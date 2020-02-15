---
extends: _layouts.post
title: Hosting a Laravel application on AWS Lambda
slug: hosting-a-laravel-application-on-aws-lambda
author: Chris White
date: 2016-10-04
section: content
---

This weekend, after stumbling upon an Amazon blog post that describes [how to run arbitrary executables in AWS Lambda](https://aws.amazon.com/blogs/compute/running-executables-in-aws-lambda/), I started wondering if it would be possible to run a PHP script inside a Lambda function. Those of you who are familiar with Lambda will know that the only officially supported runtimes are Java, Python and JavaScript, but if it allows you to run arbitrary executables then it should theoretically be possible to run the PHP CLI binary and thus execute a PHP script.

After a weekend of experimentation and plenty of rum and cokes, it turns out that is possible. And it’s also possible to get the Laravel framework (and probably many other web frameworks) running in a Lambda function by using PHP CGI. Sadly, running a Laravel web application on Lambda is probably too impractical to be worth it in a lot of cases, but it was pretty fun to get it working in a serverless architecture regardless.

## About Lambda

Lambda is Amazon’s Function-as-a-Service (FaaS) product. It lets you execute functions in response to an event. An event can be a schedule (for example, execute a function every minute) or it can be triggered by another AWS event (like an S3 file upload or an API Gateway HTTP request).

For this use-case, I’ll be tying it up to API Gateway to handle HTTP requests. I gave the function the maximum allowed memory of 1.5GB, which means that Laravel can use up to 1.5GB of memory while serving a single request. This is overkill on memory requirement, but for a reason. When you increase the amount of memory given to a Lambda function, you also increase its CPU allowance which helps it to execute faster. In the case of Laravel, that makes a big difference. It meant cutting about 100ms off the HTTP response time compared with a 512MB function. The function runs on the Node 4.3 runtime.

## Spawning the PHP CGI process

The precursor to all of this is to somehow get the PHP CGI binary executing inside a Lambda function. This can be done by compiling the binary on the same platform and architecture as Lambda and then uploading the built binary with your function’s source code. Predictably, I found out that Lambda functions run on top of Amazon’s own AMI image, so compiling for that platform was easy. Spin up an EC2 instance with the AMI image and compile PHP CGI like so.

```
sudo su
yum install -y libexif-devel libjpeg-devel gd-devel curl-devel openssl-devel libxml2-devel gcc
cd /tmp
wget http://uk1.php.net/get/php-7.0.11.tar.gz/from/this/mirror -O php-7.0.11.tar.gz
tar zxvf php-7.0.11.tar.gz
cd php-5.6.5/
./configure --prefix=/tmp/php-7.0.11/compiled/ --without-pear --enable-shared=no --enable-static=yes --enable-phar --enable-json --disable-all --with-openssl --with-curl --enable-libxml --enable-simplexml --enable-xml --with-mhash --with-gd --enable-exif --with-freetype-dir --enable-mbstring --enable-sockets --enable-pdo --with-pdo-mysql --enable-tokenizer
make
make install
```

Once those are finished, you’ll have an output that includes the following.

```
Installing PHP CGI binary:        /tmp/php-7.0.11/compiled/bin/
Installing PHP CGI man page:      /tmp/php-7.0.11/compiled/php/man/man1/
```

The PHP CGI binary that you need is now located at `/tmp/php-7.0.11/compiled/bin/php-cgi`. Copy it off the server (I used scp) and put it in the root of the project.

```
scp -i ~/path/to/pem.pem ec2-user@52.211.x.x:/tmp/php-7.0.11/compiled/bin/php-cgi ~/dev/laravel-lambda/php-cgi
```

Now we can write a NodeJS Lambda function that spawns the PHP CGI process and returns its output. Paste the following into an `index.js` file in the root of your project (along with php-cgi).

```javascript
var spawn = require('child_process').spawn;
 
exports.handler = function(event, context) {
    var php = spawn('./php-cgi', ['-v']);
 
    var output = '';
    php.stdout.on('data', function(data) {
        output += data.toString('utf-8');
    });
 
    php.on('close', function() {
        context.succeed(output);
    });
};
```

If you click the blue “Test” button in the Lambda console, you should see the following output:

```
PHP 7.0.11 (cgi-fcgi) (built: Oct  3 2016 17:17:12)
Copyright (c) 1997-2016 The PHP Group
Zend Engine v3.0.0, Copyright (c) 1998-2016 Zend Technologies
```

Sweet! PHP CGI is running.

## Responding to HTTP requests

We’ve got PHP CGI running which means it’s now possible for us to run a PHP script to handle a HTTP request. An obvious choice for sending HTTP requests to a Lambda function is API Gateway. API Gateway will forward the HTTP request to the Lambda function as an event. The Lambda function is then responsible for sending a HTTP response back which gets returned to the website visitor.

Unfortunately though, it’s not quite that simple. API Gateway doesn’t send a HTTP request in the format you might expect it to. API Gateway will actually convert the HTTP request to a JSON object that represents that request, and your Lambda function needs to respond to API Gateway with another JSON object that represents the HTTP response. Below is a flowchart that gives a high level overview of what this exchange looks like.

![Lambda HTTP](/assets/images/posts/2016-04-10-laravel-lambda/lambda-http.png)

With that in mind, our Lambda function that lives in index.js is going to have to do a bit of pre and post-processing to convert the JSON representation of a HTTP request into something that PHP CGI will understand, and convert the HTTP response into a JSON object that API Gateway will understand. Luckily, this isn’t so hard.

```javascript
var spawn = require('child_process').spawn;
var parser = require('http-string-parser');
 
exports.handler = function(event, context) {
    // Sets some sane defaults here so that this function doesn't fail when it's not handling a HTTP request from
    // API Gateway.
    var requestMethod = event.httpMethod || 'GET';
    var serverName = event.headers ? event.headers.Host : '';
    var requestUri = event.path || '';
    var headers = {};
 
    // Convert all headers passed by API Gateway into the correct format for PHP CGI. This means converting a header
    // such as "X-Test" into "HTTP_X-TEST".
    if (event.headers) {
        Object.keys(event.headers).map(function (key) {
            headers['HTTP_' + key.toUpperCase()] = event.headers[key];
        });
    }
 
    // Spawn the PHP CGI process with a bunch of environment variables that describe the request.
    var php = spawn('./php-cgi', ['function.php'], {
        env: Object.assign({
            REDIRECT_STATUS: 200,
            REQUEST_METHOD: requestMethod,
            SCRIPT_FILENAME: 'function.php',
            SCRIPT_NAME: '/function.php',
            PATH_INFO: '/',
            SERVER_NAME: serverName,
            SERVER_PROTOCOL: 'HTTP/1.1',
            REQUEST_URI: requestUri
        }, headers)
    });
 
    // Listen for output on stdout, this is the HTTP response.
    var response = '';
    php.stdout.on('data', function(data) {
        response += data.toString('utf-8');
    });
 
    // When the process exists, we should have a complete HTTP response to send back to API Gateway.
    php.on('close', function(code) {
        // Parses a raw HTTP response into an object that we can manipulate into the required format.
        var parsedResponse = parser.parseResponse(response);
 
        // Signals the end of the Lambda function, and passes the provided object back to API Gateway.
        context.succeed({
            statusCode: parsedResponse.statusCode || 200,
            headers: parsedResponse.headers,
            body: parsedResponse.body
        });
    });
};
```

It’s worth going over how we’re passing the HTTP request information to PHP CGI. When we spawn the child process, we’re setting a bunch of environment variables which PHP CGI populates into the `$_SERVER` super global. All PHP frameworks (Laravel included) use this super global to determine request information such as the URL being requested and the HTTP request method.

After the PHP CGI process is spawned and its output captured, the [http-string-parser](https://www.npmjs.com/package/http-string-parser) library is used to parse the HTML response string into its different parts (status code, headers and response body). This is returned to API Gateway in a format that it recognises, and API Gateway then sends the client the response.

With this script, I’ve assumed that the PHP script being used is in a file called `function.php` in the root of the Lambda function. To test everything is working, populate the script with:

```php
<?php
 
var_dump($_SERVER);
```

Send a request to your Lambda function from API Gateway and you should see the `$_SERVER` super global dumped out.

## Let's try it with Laravel!

So now we’ve got PHP responding to HTTP requests, the next step is to bring in a Laravel application and try to get it running.

I’ll put it under a directory called laravel so that we can separate it from the rest of our Lambda function.

The Lambda function also needs to be changed to execute Laravel’s front controller, `index.php`. That’s a simple change, just provide the path to Laravel’s `index.php` in the spawn call.

```javascript
var php = spawn('./php-cgi', ['laravel/public/index.php'], { ... };
```

A couple of the environment variables also need to be changed, namely `SCRIPT_FILENAME` and `SCRIPT_NAME`.

```
SCRIPT_FILENAME: 'laravel/public/index.php',
SCRIPT_NAME: '/index.php',
```

Zip up the directory again, upload it to Lambda, and refresh your API Gateway URL to see if it works!

![Lambda error](/assets/images/posts/2016-04-10-laravel-lambda/lambda-error.png)

**Shit.** 💩

So it turns out that a Laravel application can’t run on Lambda with its default configuration. The problem is that Laravel tries to write to directories that it doesn’t have permission to write to. This is because Lambda functions can’t write to any part of their file system that isn’t the `/tmp` directory. In the above example, Laravel is trying to write a compiled Blade view into a cache directory outside of `/tmp`. To fix this, we just have to change any part of the application’s configuration that deals with file systems to write to the `/tmp` directory.

Add the following line to `.env` to write Laravel’s log to the syslog instead of a log file under `storage`:

```
APP_LOG=syslog
```

Change the `file` entry in the `cache.php` config file to write to /tmp instead of the storage directory:

```php
'file' => [
    'driver' => 'file',
    'path' => '/tmp/laravel/framework/cache',
],
```

Change the `local` entry in the `filesystems.php` config file to write to `/tmp`:

```php
'local' => [
    'driver' => 'local',
    'root' => '/tmp/laravel/filesystem',
],
```

Change the `files` entry in the `session.php` config file to write to `/tmp`:

```php
'files' => '/tmp/laravel/framework/sessions',
```

Change the `compiled` entry in the `view.php` config file to write to `/tmp`:

```php
'compiled' => realpath('/tmp/laravel/framework/views'),
```

Re-zip the directory, upload it to your Lambda function, reload the page and voilà!

![Laravel running on Lambda](/assets/images/posts/2016-04-10-laravel-lambda/laravel-on-lambda.png)

## Conclusion

There are a number of advantages and disadvantages to running a web application on AWS Lambda.

### Pros

The biggest pro to Lambda is never having to worry about the server. Amazon have a transparent cluster of servers that run your Lambda functions, but you never have to interact with them or even know that they’re there. Other services such as Forge and ServerPilot go some way into allowing developers to not worry so much about the infrastructure, but they don’t come close to allowing you to assume that there is no server at all.

Lambda functions scale effortlessly to any traffic size. Once your application is on Lambda, it can handle one request in the same way that it can handle a million, and it requires no brain power on your part. Go ahead and launch that global marketing campaign without worrying about the infrastructure coping. **However**, it’s worth noting that this doesn’t apply to other AWS services that your application might be using. If your Laravel application is tied up to an RDS database for example, the RDS database might not handle the load.

Extremely granular billing will drastically cut down on your costs. Lambda functions are billed in increments of 100ms, and come with an extremely generous free tier of 1 million requests per month and 266,000 seconds of execution time (on the highest resource function of 1.5GB). This means that if every request in your application responds in 200ms or under, you can handle at least 1.3 million requests per month for free. Even after that free allowance, additional requests are 20 cents per million after. Compare this with a modest $40 or $80 per month DigitalOcean droplet, and you’ve got a lot more 🍻 money.

### Cons

The largest con is that Laravel and other frameworks or applications won’t officially support running on Lambda. I got lucky with Laravel because it allows you to customise everywhere that the framework writes files to. I can imagine Symfony does the same. I can tell you for a fact that this method won’t work for something like WordPress, that will try to write files here there and everywhere.

Your application has to be specifically built to execute in a stateless environment. This is a good rule to follow anyway, and is part of the [12 factor app](https://12factor.net/) principles. It basically means that if you need to store state at any point, it should be stored outside of the application. Profile photo uploads go to S3, queue jobs go to SQS, caching is achieved with ElastiCache, etc.

Lambda functions have a warm-up time. The first time you run the function, it can take a few seconds to execute. This is due to the nature of the containerized infrastructure that is executing your function. Once it’s warmed up after the first run, subsequent executions are a lot faster. This problem can quite easily be mitigated by having another Lambda function that sends a HTTP request to your API Gateway URL every minute, which will ensure that your Lambda function is always warm. The difference can be seen in these two screenshots from the network tab of Chrome’s dev tools, where the first request took 2.3 seconds and the second took 160ms.

![Cold function start](/assets/images/posts/2016-04-10-laravel-lambda/before.png)

![Warm function start](/assets/images/posts/2016-04-10-laravel-lambda/after.png)

Your Laravel Blade views can’t be cached. Since you can’t rely on the container that executes your function to be the same one that was used in a previous request, it’s likely that the Blade view cache won’t exist in the new container and your Blade view will be re-compiled. As far as I’m aware, it’s not possible to make Laravel cache a Blade view into a 3rd party system like ElastiCache. This is a small overhead and thus a bit of a moot point, but worth taking note of. You can mitigate this issue by naming your views `x.php` instead of `x.blade.php` and using regular PHP template tags instead of Blade tags, and this will bypass the Blade interpreter completely.

API Gateway does not yet have support for streaming a binary response back to the client. This means you won’t be able to use it for things like file downloads. You can get around this by base64 encoding the file contents inside the JSON object passed back to API Gateway, but since your Lambda function can only have 1.5GB of memory this means you can only send back a file less than ~1GB in size. Which, depending on your use-case, might be fine.
