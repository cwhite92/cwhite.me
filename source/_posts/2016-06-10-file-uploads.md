---
extends: _layouts.post
title: Avoiding the burden of file uploads
slug: avoiding-the-burden-of-file-uploads
author: Chris White
date: 2016-06-10
section: content
---

_Note: This post was updated on 2016-07-16 to reflect a better way to achieve file uploads to an S3 bucket._

Handling file uploads sucks. Code-wise it’s a fairly simple task, the files get sent along with a POST request and are available server-side in the `$_FILES` super global. Your framework of choice may even have a convenient way of dealing with these files, probably based on Symfony’s [UploadedFile](http://api.symfony.com/2.3/Symfony/Component/HttpFoundation/File/UploadedFile.html) class. Unfortunately it’s not that simple. You’ll also have to change some PHP configuration values like `post_max_size` and `upload_max_filesize`, which complicates your infrastructure provisioning and deployments. Handling large file uploads also causes high disk I/O and bandwidth use, forcing your web servers to work harder and potentially costing you more money.

Most of us know of [Amazon S3](https://aws.amazon.com/s3/), a cloud based storage service designed to store an unlimited amount of data in a redundant and highly available way. For most situations using S3 is a no brainer, but the majority of developers transfer their user’s uploads to S3 after they have received them on the server side. This doesn’t have to be the case, your user’s web browser can send the file directly to an S3 bucket. You don’t even have to open the bucket up to the public. Signed upload requests with an expiry will allow temporary access to upload a single object.

Doing this has two distinct advantages: you don’t need to complicate your server configuration to handle file uploads, and your users will likely get a better user experience by uploading straight to S3 instead of “proxying” through your web server.

This is what we’ll be creating. Note that each file selected gets saved straight to an S3 object.

<iframe width="560" height="315" src="https://www.youtube.com/embed/Xm9wHaP7q88" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Generating the upload request

Implementing this with the help of the `aws-sdk-php package` (version `3.18.14` at the time of this post) is pretty easy:

```php
// These options specify which bucket to upload to, and what the object key should start with. In this case, the
// key can be anything, and will assume the name of the file being uploaded.
$options = [
    ['bucket' => 'bucket-name'],
    ['starts-with', '$key', '']
];
 
$postObject = new PostObjectV4(
    $this->client, // The Aws\S3\S3Client instance.
    'bucket-name', // The bucket to upload to.
    [], // Any additional form inputs, they don't apply here.
    $options,
    '+1 minute' // How long the client has to start uploading the file.
);
 
$formAttributes = $postObject->getFormAttributes();
$formData = $postObject->getFormInputs();
```

The above snippet will give you a collection of form attributes and form inputs that you should use to construct your upload request to S3. The `$formAttributes` variable will have an action, a method and an enctype to add to your HTML form element. The `$formData` variable will hold an array of form inputs that you should be POSTing along to S3.

Your user’s browser can then start uploading a file to the URL contained in `$formAttributes['action']`, and it will upload directly into your bucket without touching the server. It’s very important to set a sensible expiry on a presigned request, and it’s also important to know that specifying `+1 minute` means that your user will have one minute in which to start sending the file, if the file takes 30 minutes to upload, their connection will not be closed.

There is, however, some bucket setup that you need to do. Due to our age-old enemy CORS your user will not be allowed access to upload straight to a bucket because they’ll be uploading from another domain. Fixing this is simple. Under your bucket properties in the AWS console, under the “Permissions” section, click the “Edit CORS Configuration” button.

![CORS configuration](/assets/images/posts/2016-06-10-file-uploads/cors-config.png)

Paste the below configuration into the big text area and hit “Save”.

```xml
<?xml version="1.0" encoding="UTF-8"?>  
<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">  
    <CORSRule>
        <AllowedOrigin>*</AllowedOrigin>
        <AllowedMethod>HEAD</AllowedMethod>
        <AllowedMethod>PUT</AllowedMethod>
        <AllowedMethod>POST</AllowedMethod>
        <AllowedHeader>*</AllowedHeader>
    </CORSRule>
</CORSConfiguration>
```

Our user’s browser will first be sending an `OPTIONS` request to the presigned URL, followed by a `POST` request. For some reason, in the above config specifying `HEAD` also allowed the `OPTIONS` request, and `POST` was only allowed after specifying both `PUT` and `POST`. Weird.

## Tying this into Laravel

Y’all know I’m a Laravel guy. I actually had to implement this into a Laravel 5 application in the first place, so I’ll show you how I did it.

Since w’re using the AWS SDK for PHP, so go ahead and install it in your Laravel project.

```
composer require aws/aws-sdk-php
```

When we instantiate an S3 client we need to give it some configuration values, so add those to your `.env` file (don’t forget to add dummy values to `.env.example` too!).

```
S3_KEY=your-key  
S3_SECRET=your-secret  
S3_REGION=your-bucket-region  
S3_BUCKET=your-bucket
```

Of course, you should also add a config file that you can use inside your application to grab these values. Laravel already has a `services.php` config file that we can add our S3 config to. Open it up and add the additional entries.

```php
's3' => [  
    'key'    => env('S3_KEY'),
    'secret' => env('S3_SECRET'),
    'region' => env('S3_REGION'),
    'bucket' => env('S3_BUCKET')
],
```

Great. We have all we need inside our Laravel application to instantiate a new S3 cient with the correct config and get the ball rolling. The next thing we’ll want to do is create a service provider which will be responsible for actually instantiating the client and binding it to the IoC, which will allow us to use dependency injection to grab it wherever it’s needed in our app.

Create `app/Providers/S3ServiceProvider.php`, and paste the following.

```php
<?php
 
namespace App\Providers;
 
use Aws\S3\S3Client;  
use Illuminate\Support\ServiceProvider;
 
class S3ServiceProvider extends ServiceProvider  
{
    /**
     * Bind the S3Client to the service container.
     *
     * @return void
     */
    public function boot()
    {
        $this->app->bind(S3Client::class, function() {
            return new S3Client([
                'credentials' => [
                    'key'    => config('services.s3.key'),
                    'secret' => config('services.s3.secret')
                ],
                'region' => config('services.s3.region'),
                'version' => 'latest',
            ]);
        });
    }
 
    public function register() { }
}
```

If you’re not familiar with how service providers work, what we’re doing is telling Laravel that whenever we typehint a class dependency with Aws\S3\S3Client, Laravel should instantiate a new S3 client using the provided anonymous function which will return a new’d up client to us with the configuration values pulled out of our config file. Don’t forget to tell Laravel to load this service provider when booting up by adding the following entry to the `providers` configuration in `config/app.php`:

```php
App\Providers\S3ServiceProvider::class,
```

You’ll need to create a route that the client will use to retrieve the presigned request.

```php
$router->get('/upload/signed', 'UploadController@signed');
```

And, obviously, you’ll need UploadController itself.

```php
<?php
 
namespace App\Http\Controllers;
 
use Aws\S3\PostObjectV4;  
use Aws\S3\S3Client;
 
class UploadController extends Controller  
{
    protected $client;
 
    public function __construct(S3Client $client)
    {
        $this->client = $client;
    }
 
    /**
     * Generate a presigned upload request.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function signed()
    {
        $options = [
            ['bucket' => config('services.s3.bucket')],
            ['starts-with', '$key', '']
        ];
 
        $postObject = new PostObjectV4(
            $this->client,
            config('services.s3.bucket'),
            [],
            $options,
            '+1 minute'
        );
 
        return response()->json([
            'attributes' => $postObject->getFormAttributes(),
            'additionalData' => $postObject->getFormInputs()
        ]);
    }
}
```

## The JavaScript

The project that I wrote this for is using the very popular DropzoneJS library to handle file uploading. The below JavaScript sample will be specific to my Dropzone implementation, but the same kind of concept will apply to any upload library (or even a bare bones HTML form with a `<input type="file">`).

```javascript
var dropzone = new Dropzone('#dropzone', {  
    url: '#',
    method: 'post',
    autoQueue: false,
    autoProcessQueue: false,
    init: function() {
        this.on('addedfile', function(file) {
            fetch('/upload/signed?type='+file.type, {
                method: 'get'
            }).then(function (response) {
                return response.json();
            }).then(function (json) {
                dropzone.options.url = json.attributes.action;
                file.additionalData = json.additionalData;
 
                dropzone.processFile(file);
            });
        });
 
        this.on('sending', function(file, xhr, formData) {
            xhr.timeout = 99999999;
 
            // Add the additional form data from the AWS SDK to the HTTP request.
            for (var field in file.additionalData) {
                formData.append(field, file.additionalData[field]);
            }
        });
 
        this.on('success', function(file) {
            // The file was uploaded successfully. Here you might want to trigger an action, or send another AJAX
            // request that will tell the server that the upload was successful. It's up to you.
        });
    }
});
```

We’re making Dropzone listen for files being added to the upload queue (by drag and drop or manual selection). When a file is added, an AJAX request retrieves the signed request data from our server and the Dropzone configuration is updated to upload to the correct URL. We also attach the additional form data that must be POSTed along with the uploaded file, which is then accessible inside the `sending` Dropzone event. In that `sending` event, we attach the additional form data. Dropzone then takes care of uploading the file to S3.

You may see the `success` event handler there also. You don’t have to use it, but in my case it was useful to tell the server when the upload to S3 had been completed, since I had to do some action after that point.
