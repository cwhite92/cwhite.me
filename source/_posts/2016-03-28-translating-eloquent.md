---
extends: _layouts.post
title: Translating Eloquent Fields with MySQL's Native JSON Type
slug: translating-eloquent-fields-with-mysqls-native-json-type
author: Chris White
date: 2016-03-28
section: content
---

Since version 5.7.8, MySQL has supported a [native JSON data type](https://dev.mysql.com/doc/refman/5.7/en/json.html). Since I’m a bit of a weirdo who finds structured data formats interesting, I wanted to experiment with its different uses in the context of a web application. One potential use-case I thought of was using it for internationalisation – storing different text translations for a field.

Let’s take a look at how internationalisation is typically done in a web application and how it could be done through the use of MySQL’s native JSON type. Since I’m uncreative, I’ll be using Laravel and an age-old blog posts example. We’ll keep it simple and say the requirement is that the titles and body content of our posts need to be multilingual. If you want to jump straight to the proof of concept, [here’s the GitHub repository](https://github.com/cwhite92/laravel-json-translations-example).

## The boring, traditional way

Normally we’d achieve this by creating two database tables for our posts. The first table contains only language-neutral data: things like primary keys, fields that are the same across languages, etc. The second table contains the localised text, stored against the relevant ISO code of the language it represents. In a typical Laravel migration class, that might look like this:

```php
Schema::create('posts', function (Blueprint $table) {  
    $table->increments('id');
    $table->string('slug')->unique();
    $table->timestamps();
});
 
Schema::create('post_translations', function (Blueprint $table) {  
    $table->unsignedInteger('post_id');
    $table->string('locale');
    $table->string('title');
    $table->text('content');
    $table->timestamps();
    
    $table->foreign('post_id')->references('id')->on('posts')->onDelete('cascade');
});
```

When we want to retrieve a post in a specific language, we’d execute a query that joins the `post_translations` table in order to grab the localised text.

```php
$post = DB::table('posts')
    ->select('posts.id', 'posts.slug', 'post_translations.title', 'post_translations.content')
    ->join('post_translations', 'post_translations.post_id', '=', 'posts.id')
    ->where('posts.id', 1)
    ->where('post_translations.locale', 'en') // or 'fr', 'de' etc.
    ->first();
```

This is a tried and true method, and arguably the best since it follows database normalisation principles. But it doesn’t use JSON, and any JavaScript developer will tell you that JSON is cool.

## The JSON way

We can achieve the same thing using MySQL’s native JSON data type by changing our migration to the following.

```php
Schema::create('posts', function (Blueprint $table) {  
    $table->increments('id');
    $table->string('slug')->unique();
    $table->json('title');
    $table->json('content');
    $table->timestamps();
});
```

Since we’ll now be storing the different localised text strings in the same table as the object, we can drop the `post_translations` table. We’ve made the `title` and `content` fields take JSON, which will have the following structure:

```json
{
    "en": "Hello world",
    "fr": "Bonjour le monde",
    "de": "Hallo welt"
}
```

To retrieve blog posts in a particular language, our query now changes to take advantage of Laravel 5.2’s support of JSON:

```php
$post = DB::table('posts')
    ->select('posts.id', 'posts.slug', 'posts.title->en', 'posts.content->en') // or 'posts.title->fr'
    ->where('posts.id', 1)
    ->first();
```

This is a much simpler query that requires no joins. In the background, Laravel is executing a query taking advantage of MySQL’s native JSON path syntax:

```sql
select `posts`.`id`, `posts`.`slug`, `posts`.title->"$.en", `posts`.content->"$.en" from `posts` where `posts`.`id` = ?
```

## Automating the translations

This is great and all, but it doesn’t help us much in a real application. Laravel’s DB facade returns stdClass objects as results, not our nice Eloquent models. We’ll also likely want to default to a specific language depending on the locale specified in our application’s config, and fall back to another if it’s not available. To help with this, we’ll create a trait that can be used by our Eloquent models to automatically retrieve the correct translation for a model field. Dump the code below into `Translatable.php`, somewhere in your project.

```php
<?php
 
namespace App;
 
trait Translatable  
{
    /**
     * Returns a model attribute.
     *
     * @param $key
     * @return string
     */
    public function getAttribute($key)
    {
        if (isset($this->translatable) && in_array($key, $this->translatable)) {
            return $this->getTranslatedAttribute($key);
        }
 
        return parent::getAttribute($key);
    }
 
    /**
     * Returns a translatable model attribute based on the application's locale settings.
     *
     * @param $key
     * @return string
     */
    protected function getTranslatedAttribute($key)
    {
        $values = $this->getAttributeValue($key);
        $primaryLocale = config('app.locale');
        $fallbackLocale = config('app.fallback_locale');
 
        if (!$values) {
            return null;
        }
 
        if (!isset($values[$primaryLocale])) {
            // We don't have a primary locale value, so return the fallback locale.
            // Failing that, return an empty string.
            return $values[$fallbackLocale] ?: '';
        }
 
        return $values[$primaryLocale];
    }
 
    /**
     * Determine whether the provided attribute should be casted as JSON when it is being set.
     * If it is a translatable field, it should be casted to JSON.
     *
     * @param $key
     * @return bool
     */
    protected function isJsonCastable($key)
    {
        if (isset($this->translatable) && in_array($key, $this->translatable)) {
            return true;
        }
 
        return parent::isJsonCastable($key);
    }
}
```

What we’re doing above is overriding `Illuminate\Database\Eloquent\Model`'s implementation of `getAttribute()` with our own. The `getAttribute()` method will be executed on each access to the model’s fields. We’ll check if the field we’re accessing has translations and if it has, we’ll return the correct one based on the locale setting defined in the application’s config. If there’s no entry for that locale, we’ll use the fallback locale, and as a last resort we’ll just return an empty string.

All that’s left is hooking this trait up to a model.

```php
<?php
 
namespace App;
 
use Illuminate\Database\Eloquent\Model;
 
class Post extends Model  
{
    use Translatable;
 
    protected $table = 'posts';
 
    public $translatable = ['title'];
    public $casts = ['title' => 'json'];
}
```

You’ll notice that just `use`ing the trait isn’t enough – we also have to tell the `getAttribute()` method what model fields are translatable. Also, we have to use the `$casts` property to let Laravel know that it should save this field as JSON when it persists to MySQL.

Saving or updating a post with translated fields becomes super easy.

```php
Post::create([  
    'slug' => 'test-post-please-ignore',
    'title' => [
        'en' => 'Test post please ignore',
        'fr' => "post test s'il vous plaît ignorer",
        'de' => 'Test- Post bitte ignorieren'
    ],
    'content' => [
        'en' => 'I am just a test post',
        'fr' => 'Je suis juste un post-test',
        'de' => 'Ich bin nur ein Test Post'
    ]
]);
```

Check out the [GitHub repository](https://github.com/cwhite92/laravel-json-translations-example) to see it in a working Laravel application.

## Are you convinced?

I’ll leave this one up to you. Personally, I’m not convinced enough in this approach to drop the translation text lookup table for a JSON field. I’m not a fan of having to retrieve and re-save every language’s translation when adding/removing one translation.

That being said, the proof of concept does indeed prove that this method works. And I do like the idea of not requiring a translations lookup table for every translatable object. Whether or not those positives outweigh the negatives depends on your own project requirements and your personal opinion as a developer (a cop-out answer, I know!).
