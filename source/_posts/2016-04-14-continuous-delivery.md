---
extends: _layouts.post
title: Continuous Delivery for Your Static Site Using Codeship
slug: continuous-delivery-for-your-static-site-with-codeship
author: Chris White
date: 2016-04-14
section: content
---

Lately, I’ve been all about continuous integration and delivery. [Since I started this blog](https://cwhite.me/posts/deploying-a-static-site-to-s3-and-cloudfront/), I’ve been looking for a better way to deploy new posts and other changes that don’t involve me using the AWS command line tools to update the files in my S3 bucket and invalidate the CloudFront cache. Some tools exist for this (such as [Stout](http://stout.is/)), but that still requires me to manually use a tool every time I want to deploy. Naff!

Since I’ve been doing a lot of research on CI/D for use at work lately, deploying a static site strikes me as something easily achievable with continuous delivery. Of all the providers that I’ve looked at, [Codeship](https://codeship.com/) got my vote due to a combination of its ease of use and £0 price tag. Since I use the Hugo static site generator with S3 for this blog, I’ll concentrate on deploying a Hugo static site to an S3 bucket with Codeship. That being said, it should be just as easy to deploy any static site, even if you don’t use a static site generator at all.

The basic flow that we want to achieve here is this:

1. We push new content to the `master` branch of our repository.
2. Codeship detects the push and clones the repository with the new changes.
3. Codeship uses Hugo to generate the static site.
4. Codeship uses the AWS command line tools to update the S3 bucket and create a CloudFront cache invalidation.

Once you’re all signed up with Codeship, go ahead and create a new project. You can link it to a Git repository from Github or Bitbucket. Codeship will present you with your project settings, which include the commands that get run before each test. Since we won’t be testing our static site (although feel free to if you want!), this is useless to us, and we’ll just empty the text area.

![Test setup commands](/assets/images/posts/2016-04-14-continuous-delivery/test-setup-commands.png)

Similarly, you’ll be presented with options relating to test pipelines. A pipeline is Codeship-speak for a container that runs your tests, and once again these options are useless to our static site. Go ahead and click that big red delete button in the bottom right. This will ensure Codeship doesn’t try to run tests when we push to `master`.

![Test pipeline](/assets/images/posts/2016-04-14-continuous-delivery/test-pipeline.png)

Now we need to configure the deployment to happen every time you push to the `master` branch. Under your project’s deployment settings, you’ll be able to set up a deployment pipeline like such:

![Deployment pipeline](/assets/images/posts/2016-04-14-continuous-delivery/deployment-pipeline.png)

Codeship will give you a bunch of deployment options, but the one we’re interested in is the “Custom Script” option. With this option, you’ll be able to specify the exact commands that get run to deploy your static site. Since I’m using Hugo, mine look like this:

```
# Codeship clones your project into this directory
cd ~/clone
 
# The theme we're using is added as a submodule, bring it in so we can compile the site
git submodule init  
git submodule update
 
# Download Hugo so we're not relying on Codeship's version
wget https://github.com/spf13/hugo/releases/download/v0.15/hugo_0.15_linux_amd64.tar.gz  
tar -xf hugo_0.15_linux_amd64.tar.gz
 
# Build the site
./hugo_0.15_linux_amd64/hugo_0.15_linux_amd64 --source ~/clone
 
# Upload new site to S3, invalidate CloudFront cache
aws configure set preview.cloudfront true  
aws s3 rm s3://cwhite.me --recursive  
aws s3 cp ./public s3://cwhite.me --recursive  
aws cloudfront create-invalidation --distribution-id E2TO5NZM4CBJEB --paths /*
```

If you’re familiar with Codeship, you may already know that they have Hugo pre-installed. Unfortunately I ran across some problems with it, and decided instead to just pull it fresh each time and use the latest binary, which works a treat.

The AWS command line tools don’t have support for invalidating a CloudFront cache by default since it’s part of a feature set that is currently not enabled. That’s why we’re enabling it before copying the site to the S3 bucket and invalidating the cache.

The final step is to tell Codeship about our AWS credentials. The AWS command line tools will look for environment variables to retrieve your IAM credentials. Navigate to the environment settings under your Codeship project’s settings, and enter the environment variables like below.

![Deployment pipeline](/assets/images/posts/2016-04-14-continuous-delivery/environment-variables.png)

After all that, you’re done! Push some changes to your static site’s master branch, and Codeship will take care of deploying them to your S3 bucket and invalidating your CloudFront cache.
