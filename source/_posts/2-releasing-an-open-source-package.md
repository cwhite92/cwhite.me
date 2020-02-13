---
extends: _layouts.post
title: "Releasing an Open Source Package: Lessons Learned"
slug: releasing-an-open-source-package-lessons-learned
author: Chris White
date: 2016-02-07
section: content
---

I’ve spent the last few weeks working on an open source package to help with managing files on Backblaze’s B2 storage service. The development of [b2-sdk-php](https://github.com/cwhite92/b2-sdk-php), which it’s not-so-originally called, has taught me a few valuable lessons for anybody looking to dive into releasing an open source package.

## Start small, release early

The biggest problems that I face with side projects is losing motivation over time. There are many projects sitting in my development directory that haven’t been worked on in months, simply because I lost focus of the original goal and the motivation behind it.

Keep your initial goal narrow and focused. Work towards that goal, and think about widening the scope of the package only once that goal has been achieved. For example, my first goal for the B2 SDK was to get basic bucket operations (create, list, delete) implemented. Once that was done and I was happy with it, I got a nice fresh dose of motivation to tide me over to the next goal (which was file management). It’s all about those frequent wins keeping your motivation up.

On top of that, make sure to release early. If your project isn’t production ready yet, just make that clear in the readme. Shipping early will allow interest to gather, which will only serve to boost your motivation. Additionally, this can close the feedback loop between you and your potential users. Releasing 1.0.0 with absolutely no interest around your package is like having a birthday party where nobody shows up. You’ll be sad. You’ll lose motivation.

## Write tests. No seriously, do it.

I’m not going to sit here and tell you that I’ve always written tests for everything I’ve done. In fact, it wasn’t that long ago that I started recognising the huge benefits of testing. But even at this stage I’m extremely glad I did. The number of regressions that my tests have caught have saved me on a number of occasions.

If I’m looking around for a package to help me out with a problem I’m having, I’m going to completely disregard yours if it doesn’t have tests. I’m sorry, but it basically means I can’t trust your package. I’m sure your code is the best I’ve ever seen and I’m sure you’re super smart, but we’re all human. Humans make mistakes and mistakes mean regressions. If it’s a work setting where I have a client paying good money for me to solve a problem, it’s going to be my ass on the line when you introduce a regression and their feature breaks.

Don’t get me wrong, I still have hell of a lot more to learn about testing. It seems you can learn just as much about testing code as you can about writing it in the first place. But recognising the importance and advantages of tests is the first step.

## Don't have a cow over code quality

The main thing people are looking for in a package is that it solves their problem. They generally don’t care what it looks like on the inside. It’s a black box: they put things in, and expect other things out. I can’t say I’ve ever deeply analysed the code quality of a package before I decided to use it. For most people, a quick glance at the API is enough to tell them if it will suit their needs, and they’ll probably never look at your source code.

Work on finalising your package’s API for the first version, get it working, and then think about improving your code. Barring any big performance or security problems, nobody is going to care that some of your classes have more than one responsibility or you’ve not perfectly followed the DRY principle. Stuff like that can come later, at which point you can bump the minor version and people can quickly update to your shiny, high quality code with a `composer update`.

## Document, document, document!

I hate writing documentation. I think most developers hate writing documentation. Unfortunately, your users hate it when you don’t write documentation. The biggest cop-out for not writing docs is “I don’t have time!”. I reckon that’s usually bollocks. Do you have time to answer the same questions over and over from your users, when you could’ve just invested the time to write documentation which answers that question in the first place? I found a nice quote about this from a dude called [Scott Berkun](http://scottberkun.com/) who seems to know his stuff:

> When 100 people are listening to you for an hour, that’s 100 hours of people’s time devoted to what you have to say. If you can’t spend 5 or 10 hours preparing for them, thinking about them, and refining your points to best suit their needs, what does that say about your respect for your audience’s time? It says your 5 hours are more important than 100 of theirs, which requires an ego larger than the entire solar system.

At the very least, you should be showing people searching for your package how to use it. For a lot of packages putting a overview of the API in the readme is sufficient, for larger projects you might want to consider using the more advanced documentation features (like a wiki) on platforms like GitHub. When I’m searching for a package, taking a minute to glance over its API gives me a good understanding about if it will solve my particular problem. Use this to capture interest.

## Use an easy-going license

When you release code, by default, it is under your copyright. Its default state means that the code is wholly owned by you, and other people don’t have the right to do anything with it including redistributing it in the software that they create. That’s not open source, and for anybody following the law it means they can’t use your package. Congratulations, you’ve just locked out 100% of your potential users! Of ocurse, not everybody follows licensing laws, but a lot of developers working in companies will have no choice lest they face possible legal action.

You can allow the use of your package by including a license which specifically grants its use. Something as simple as a `LICENSE[.md|.txt]` file in your project root can grant people permission to use, redistribute or modify your code with or without attribution.

Most code (on GitHub, anyway) uses the MIT license. MIT is a very permissive license, and lets people do essentially whatever they want with your code, as long as they give attribution back to you and don’t hold you liable for anything nasty. That’s good, because it means if your package has bugs and your users lose money, you won’t be held responsible.

Of course, you should pick whatever license fits the intended use of your code. You can even choose to not include a license, if your intention is to just show off the code without letting people use it. You can find a good summary of various popular licenses on [Choose a License](https://choosealicense.com/).
