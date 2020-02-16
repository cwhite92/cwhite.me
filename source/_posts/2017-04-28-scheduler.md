---
extends: _layouts.post
title: Laravel Scheduler CRON Job on Elastic Beanstalk Docker Environments
slug: laravel-scheduler-cron-job-on-elastic-beanstalk-docker-environments
author: Chris White
date: 2017-04-28
section: content
---

This week I had to set up something which I assumed would be trivial, but turned out to be a little more involved. So I’m jotting it down here to refer to later, or help anybody who might stumble upon it from a frantic Google search.

One of the projects I’m working on right now has a staging environment on AWS Elastic Beanstalk, using a multi-container docker configuration. It’s a Laravel application, and it has some scheduled tasks that run every 1 and 24 hours. If you’re familiar with Laravel’s scheduler, you’ll know that you have to set up a single Cron job that runs every minute. The scheduler then takes care of running each task based on its defined schedule.

First thing’s first, since we’re in a Docker environment on Elastic Beanstalk we need to build an artisan Docker image to run our `schedule:run` command. I used the following Dockerfile.

```dockerfile
FROM php:7.1-cli
 
RUN apt-get update && apt-get install -y libmcrypt-dev
RUN docker-php-ext-install pdo_mysql mbstring mcrypt
 
RUN usermod -u 1000 www-data
WORKDIR /var/www/html
ENTRYPOINT ["php", "artisan"]
```

Build it, tag it, and push it to Elastic Container Registry.

```
docker build -t yourproject/artisan .
docker tag yourproject/artisan:latest 132274109557.dkr.ecr.eu-west-1.amazonaws.com/yourproject/artisan:latest
docker push 132274109557.dkr.ecr.eu-west-1.amazonaws.com/yourproject/artisan:latest
```

Now we have an artisan image that we can use to run our `schedule:run` command in our cronjob. The next step is creating the crontab file.

If you’ve never used an `.ebextensions` directory with your Elastic Beanstalk app, it’s essentially just a place to put configuration files that are acted upon by Elastic Beanstalk when it deploys your codebase.

Create a new `.ebextensions` directory in the root of your project, and create a file inside it called `cronjob.config`. Paste the following contents, replacing the ECR URL with your actual repository URL.

```
files:
  "/etc/cron.d/scheduler":
    mode: "000644"
    owner: root
    group: root
    content: |
      #* * * * * root docker run --rm -v /var/app/current:/var/www/html 132274109557.dkr.ecr.eu-west-1.amazonaws.com/yourproject/artisan:latest schedule:run >> /dev/null 2>&1
 
container_commands:
  001-uncomment-cron:
    leader_only: true
command: "sed -i -e 's/#//' /etc/cron.d/scheduler"
```

Deploy your app, and you should now have a working scheduler. It’s probably also a good idea to add some logging to your scheduled commands, so that you can be sure they are indeed running. 😉

If you’re curious about why I’m deploying a commented out crontab file and then using a container command to remove the comment – it’s because Elastic Beanstalk by nature will deploy the same crontab file across the entire fleet of servers running in your environment. The problem is that the scheduler should only be running on one server to avoid tricky race conditions. To get around this, we deploy a commented out crontab file to every server, and then have the lead server uncomment its crontab file using a `sed` call.

In Elastic Beanstalk terms, the “lead server” is the one that is coordinating the deployment of your application. Elastic Beanstalk selects this server from your fleet when you deploy your app.
