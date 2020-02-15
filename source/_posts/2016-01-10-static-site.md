---
extends: _layouts.post
title: Deploying a Static Site to S3 and CloudFront
slug: deploying-a-static-site-to-s3-and-cloudfront
author: Chris White
date: 2016-01-10
section: content
---

**Note:** this article is old and no longer reflects how this website is served to the internet, but I'm leaving it in place in case it's useful to somebody. 🙂

How long did it take for [TTFB](https://en.m.wikipedia.org/wiki/Time_to_first_byte)? If it's anything more than 100ms, let me know, as I have some complaining to do. Thanks to a combination of S3 object storage, the CloudFront CDN and Let's Encrypt, this site is served from nearly 40 edge locations from all around the world over HTTPS. Hopefully one of those is pretty close to you, allowing extremely low latency and lightning quick page loads (about ~30ms on my end). Here's how to set all that up for yourself.

To briefly summarise, we'll be:

* Deploying our static site to Amazon S3
* Setting up a CloudFront distribution
* Setting up a managed zone with Route 53
* Securing our site with a free HTTPS certificate from Let's Encrypt 

## Prerequisites

### AWS Command Line Interface

There are a couple prerequisite steps we'll need to take before we can proceed. We'll be using the AWS command line interface, so we need to go ahead and install that first. I run Linux, so the commands from this point on will cater to that, but all of this should be achievable on other operating systems as well (I just won't show you how 😄).

```
wget https://s3.amazonaws.com/aws-cli/awscli-bundle.zip
unzip awscli-bundle.zip
sudo ./awscli-bundle/install -i /usr/local/aws -b /usr/local/bin/aws
```

Go ahead and type `aws --version` into your terminal, you should see something along the lines of:

```
chris@main:~$ aws --version
aws-cli/1.9.17 Python/2.7.10 Linux/4.2.0-23-generic botocore/1.3.17
```

### Creating an IAM user and giving it the required permissions

The AWS command line interface is installed, but we don't currently have a user to use it with. We need to create a user and give it the relevent permissions to carry out the actions we'll do later on.

1. Browse to the IAM Management Console, and click "Users" on the left hand side.
2. Click "Create New Users", and enter your desired username (I used "chris").
3. Copy the access credentials that you're presented with, and save them somewhere safe. We'll need them in a minute.
4. Click "Policies" on the left hand side, and use the filter to find the following policies. After finding each one, select it and click "Policy Actions" at the top, then click "Attach". Find the user you created earlier and attach the policy to them.
    1. IAMFullAccess
    2. AmazonS3FullAccess
    3. CloudFrontFullAccess
5. Back in your terminal, run aws configure, and you'll be prompted to enter the access credentials that you saved in step 3. You only have to enter these once, they'll be saved for future use.

## Deploying our static site to Amazon S3

S3 is what we'll be using to store ther static files that make up our website. It will be the origin of the CloudFront distribution, meaning that when a request comes in from a visitor it will first go to CloudFront, and if CloudFront doesn't have the content cached, it will retrieve the contents from our S3 bucket.

1. Browse to the S3 Management Console, and click "Create Bucket" in the top left.
2. Enter a descriptive name for your new bucket. I went with cwhite.me, since it reflects the domain it'll be hosting. Click "Create".
3. Open the properties of your new bucket and enable static website hosting. Set the index document to whatever the "homepage" document of your static site is. In my case, and probably yours, that was `index.html`.
![Static site set up](/assets/images/posts/2016-01-10-static-site/static-site-setup.png)
4. We've enabled static website hosting, but the public won't have access to read any of the files inside our bucket. We need to add a policy to automatically allow public reading, so click the "Permissions" section of the bucket properties window and click "Edit bucket policy". Enter the following, remembering to change your_bucket_name to the name of your bucket:

```json
{
  "Version":"2008-10-17",
  "Statement":[{
    "Sid":"AllowPublicRead",
    "Effect":"Allow",
    "Principal": {
      "AWS": "*"
    },
    "Action":["s3:GetObject"],
    "Resource":["arn:aws:s3:::your_bucket_name/*"]
  }]
}
```

5. Now we'll upload our static site. Back on the command line, browse to the location of your static site, and run the below command. This will upload the whole current directory to your S3 bucket.

```
cd /path/to/your/static/site
aws s3 cp . s3://your_bucket_name/ --recursive
```

Wait for that process to finish, and then browse to your S3 bucket's public endpoint. It will look something like [http://your_bucket_name.s3-website-eu-west-1.amazonaws.com](#). If all went well, you should see your static site's homepage!

## Setting up a CloudFlare distribution

Now that we've got our static site up and running, let's set up CloudFront. CloudFront will store a cached copy of your static site around the world, delivering it to your users.

1. Open the CloudFront Management Console, and click "Create Distribution". Choose the "Web" delivery method.
2. It's tempting to use the autocompleted S3 bucket from the dropdown in the "Origin Domain Name" field. Don't. It creates issues with CloudFront thinking a directory is actually an object in your S3 bucket. Instead, you'll want to put the public endpoint to your S3 bucket (remember the one that looked like [http://your_bucket_name.s3-website-eu-west-1.amazonaws.com](#)?).
3. Under "Default Cache Behaviour Settings", leave everything as default, except these settings:
    1. Minimum TTL, Maximum TTL, Default TTL: Adjust these to suit your liking. These values control how often CloudFront will invalidate its cache and re-fetch objects from your S3 bucket. I just left them as default.
    2. Compress Objects Automatically: You'll want to set this to "Yes" so that CloudFront will automatically gzip assets, reducing your page load times even further.
4. Now, under "Distribution Settings", leave everything default except for:
    1. Price Class: Here you can decide which edge locations you want CloudFront to serve your content from. Choosing less edge locations will decrease your costs, but increase latency to the parts of the world that aren't included in the price class. Since our costs are going to be very low anyway, I allowed CloudFront to use all edge locations.
    2. ternate Domain Names (CNAMEs): You need to set this to be the real domain name of your static site. In my case, that was cwhite.me. If you plan on using the www prefix, enter both [yourdomain.com](#) and [www.yourdomain.com](#).
    3. Default Root Object: Set this to the same value that you set "Index Document" to when creating your S3 bucket. For most people, that will be `index.html`.
5. Click "Create Distribution". You'll see the new distribution in your distribution list, with a status of "In Progress". Your distribution is now being setup at all of Amazon's edge locations around the world, which can take a while.

## Setting up a managedzone with Route 53

While CloudFront is doing its business, we'll go ahead and set up our DNS. This will allow us to route requests for our domain to the CloudFront edge locations. Note that you don't have to use Route 53 for this, but it's easier to stay within Amazon's ecosystem here.

1. Navigate to the Route 53 Management Console and click "Hosted zones" on the left. Click "Create Hosted Zone".
2. Enter the domain name that you want to use (mine being cwhite.me). Keep the type at "Public Hosted Zone". Click Create.
3. After creation, you'll see a list of all the record sets associated with the hosted zone. The ones we're interested in right now are the values under the "NS" type. These are Amazon's name servers, and you'll need to use them for your domain.
![Amazon name servers](/assets/images/posts/2016-01-10-static-site/amazon-name-servers.png)
4. Using whatever method your domain registrar exposes to you, enter these name servers into the DNS configuration for your domain. I use Namecheap, so I went to my domain list, clicked "MANAGE" next to cwhite.me, and entered the nameservers into the relevant section.
![Namecheap name servers](/assets/images/posts/2016-01-10-static-site/namecheap-nameservers.png)
5. We'll now create a new record set to point your domain to the CloudFront distribution. Click "Create Record Set" at the top of the window in the Route 53 management console.
6. Leave the "Name" field blank. Make sure "Type" is set to "A – IPv4 address". Under "Alias", choose "Yes", and under "Alias Target", choose the CloudFront distribution you created earlier from the dropdown. Keep the routing policy as "Simple" and choose not to "Evaluate Target Health". Finally, click "Create".
![Route 53 to CloudFront](/assets/images/posts/2016-01-10-static-site/route53-to-cloudfront.png)
7. will take a while for the DNS changes to propagate around the internet, so you might not see your domain pointing to your static site right away. Depending on what DNS servers you're using and how hard they cache, it could take anywhere from a few minutes to a few hours. Fucking DNS, amirite?

## Setting up SSL using Let's Encrypt

Congrats! Bar nothing going wrong, you should now have a static site setup on an S3 bucket and served by a CloudFront distribution. Browsing to your domain should present you with your shiny new static site. There's just one problem, it's not served over HTTPS! This ain't 2015. Let's fix that.

Before December 2015, most people paid for SSL certificates. There were places you could get them for free (StartSSL ring a bell?), but it was often a minefield of hidden costs and advertising. Then Let's Encrypt launched its public beta. Let's Encrypt is a free and open source certificate authority, backed by some of the biggest tech companies from around the world. They're an authority that's trusted in all major browsers, and will give you a domain validated certificate for absolutely nothing, in the interests of increasing the use of technology that keeps you and your users safe.

There's just one catch: the certificates given by Let's Encrypt expire after 90 days, so the instructions below will have to be repeated every couple of months to be safe. I should probably work on a way to easily automate this. `// TODO: that.`

1. The first thing you need to do is grab a copy of the Let's Encrypt client:
```
git clone https://github.com/letsencrypt/letsencrypt
cd letsencrypt
```
2. Then, you'll need to run the following command to generate a certificate for your domain. Remember to change [yourdomain.com](#) to your real domain name.
```
./letsencrypt-auto certonly -a manual -d yourdomain.com --rsa-key-size 2048 --agree-tos
```
3. The Let's Encrypt client will prompt you to prove that you own the domain, by asking you to upload a file to your webspace with a given randomly generated string. It will look something like this:
![Let's Encrypt Test](/assets/images/posts/2016-01-10-static-site/letsencrypt-test.png)
The easiest way to pass this test is to use the S3 interface to create the required structure (in the above example, that'd be `/.well-known/acme-challenge`). Then upload the required filename (`ua4k1l22WNFZtyFjRC6kXl4UYiK9fm52ShZmkCcLdL0` in the example above) with the given content. Open the file you just uploaded in your browser to test that it works correctly, and then press enter in your terminal window to tell Let's Encrypt to proceed.
4. If you did the above correctly, Let's Encrypt will tell you that it successfully generated a certificate for your domain, and tell you where on your computer it is. You now need to upload the generated certificate to AWS so that you can use it with your CloudFront distribution.
5. We're going to use the handy-dandy AWS command line tools again. Run the below command in your terminal window, replacing [yourdomain.com](#) with your actual domain and `2015-01-09` with the actual date. The date is just so you have something to refer to when you update the certificate in a couple of months.
```
sudo aws iam upload-server-certificate \
    --server-certificate-name yourdomain.com-2015-01-09 \
    --certificate-body file:///etc/letsencrypt/live/yourdomain.com/cert.pem \
    --private-key file:///etc/letsencrypt/live/yourdomain.com/privkey.pem \
    --certificate-chain file:///etc/letsencrypt/live/yourdomain.com/chain.pem \
    --path /cloudfront/yourdomain.com-2015-01-09/
```
6. Now that your certificate is on AWS, navigate to the CloudFront Management Console. Select your distribution and click "Distribution Settings".
7. Under the "General" tab, click "Edit". Leave everything here as it is, except:
    1. SSL Certificate: change to "Custom SSL Certificate". From the dropdown, select the certificate you uploaded with the above command.
8. Click "Yes, Edit", then browse to the "Behaviours" tab. Under the "Behaviours" tab, select the default behaviour and click "Edit".
9. Leave all these settings as they are, except for:
    1. Viewer Protocol Policy: set to "Redirect HTTP to HTTPS".
10. Finally, click "Yes, Edit".

The distribution you've edited should now have a status of "In Progress". It should now be circulating your certificate around all of Amazon's edge locations, so this could take a while. Sit back and relax. Once it's done, you should be able to browse to your static site and see the certificate being used!

![Let's Encrypt Certificate](/assets/images/posts/2016-01-10-static-site/letsencrypt-cert.png)

## WOOP WOOP!

You've now got a static site up and running, hosted on Amazon S3, served by CloudFront and secured by Let's Encrypt. Pat yourself on the back and start constantly refreshing your site with dev tools open to see the awesome latencies 🙂
