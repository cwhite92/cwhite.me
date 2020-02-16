---
extends: _layouts.post
title: Disabling HTML5 form validation for Laravel Dusk tests
slug: disabling-html5-form-validation-for-laravel-dusk-tests
author: Chris White
date: 2019-01-03
section: content
---

If you’re testing form validation using Laravel Dusk, you’ve probably hit a scenario where the form submission is blocked by Chrome before it’s sent to the server because of HTML5 form validation.

HTML5 form validation blocks a submission when you add an attribute such as required to an input element, or you use `type="email"`. In your Laravel Dusk tests, you’ll probably see this manifesting as a client-side popup dialog in your failing test screenshots.

This is a really tricky thing to test. Since it happens completely client-side without modifying the DOM, it’s hard to assert that the error appears. Even if you do work out a hacky way to do it, it’s not actually testing that your web application’s form validation is working. You’re essentially just testing that Chrome supports HTML5 form validation, and I’m sure the Google/Chromium teams have their own tests for that. 🙂

Your first thought may be to try to disable HTML5 form validation using `ChromeOptions` in `DuskTestCase`. Unfortunately there is no such option. That really only leaves one way: adding the `novalidate` property to your HTML forms. This attribute, when applied to a HTML form, disables the browser’s native form validation. But this has its own drawback in that it disables a perfectly useful feature that probably provides value to your users.

Thankfully, Dusk allows you to **inject JavaScript onto the page at runtime**! Using this feature, we can dynamically inject a small code snippet that iterates over the forms on the page and adds the `novalidate` attribute automatically, **just for your tests**. By adding this browser macro to DuskTestCase:

```php
public static function prepare()
{
    static::startChromeDriver();

    Browser::macro('disableClientSideValidation', function () {
        $this->script('for(var f=document.forms,i=f.length;i--;)f[i].setAttribute("novalidate",i)');

        return $this;
    });
}
```

You can then call it within your tests like so:

```php
$this->browse(function (Browser $browser) {
    $browser->visit('/register')
        ->disableClientSideValidation()
        ->type('email', 'notvalidemail')
        ->click('@submit')

        ->assertPathIs('/register')
        ->assertSee('The email must be a valid email address.');
});
```

And viola! The result is you’re actually testing your application’s form validation, and **you don’t have to give up HTML5 form validation to do it**!
