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

There are a couple prerequisite steps we’ll need to take before we can proceed. We’ll be using the AWS command line interface, so we need to go ahead and install that first. I run Linux, so the commands from this point on will cater to that, but all of this should be achievable on other operating systems as well (I just won’t show you how 😄).

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

The AWS command line interface is installed, but we don’t currently have a user to use it with. We need to create a user and give it the relevent permissions to carry out the actions we’ll do later on.

1. Browse to the IAM Management Console, and click “Users” on the left hand side.
2. Click “Create New Users”, and enter your desired username (I used “chris”).
3. Copy the access credentials that you’re presented with, and save them somewhere safe. We’ll need them in a minute.
4. Click “Policies” on the left hand side, and use the filter to find the following policies. After finding each one, select it and click “Policy Actions” at the top, then click “Attach”. Find the user you created earlier and attach the policy to them.
    1. IAMFullAccess
    2. AmazonS3FullAccess
    3. CloudFrontFullAccess
5. Back in your terminal, run aws configure, and you’ll be prompted to enter the access credentials that you saved in step 3. You only have to enter these once, they’ll be saved for future use.

### Deploying our static site to Amazon S3

S3 is what we’ll be using to store ther static files that make up our website. It will be the origin of the CloudFront distribution, meaning that when a request comes in from a visitor it will first go to CloudFront, and if CloudFront doesn’t have the content cached, it will retrieve the contents from our S3 bucket.

