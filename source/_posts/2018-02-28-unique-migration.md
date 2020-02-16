---
extends: _layouts.post
title: Adding Unique Field to MySQL Table With Existing Records
slug: adding-unique-field-to-mysql-table-with-existing-records
author: Chris White
date: 2018-02-28
section: content
---

Another quick tip, this time around adding a uniqued field to a MySQL table that already has data in it using a Laravel migration.

Take the below example:
```php
class AddSlugToPostsTable extends Migration
{
    public function up()
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->string('slug')->unique()->after('title');
        });
    }

    public function down()
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropColumn('slug');
        });
    }
}
```

A real simple migration to add a `slug` field to an existing `posts` table. If you run this migration with existing data in the `posts` table, you’ll come across this error:

```
SQLSTATE[23000]: Integrity constraint violation: 1062 Duplicate entry '' for key 'posts_slug_unique'
```

This is because you’re not giving each row in the table a unique value to populate `slug` with, so it’s failing on the 2nd row (as it has the same empty string value as the first row). You can’t set a default value for this field either, as you’ll end up with the same error.

The workaround to this is relatively simple, but may not be immediately obvious: perform the operation in steps. Create the `slug` field without the unique constraint, populate it with unique values, and finally add the unique constraint.

```php
public function up()
{
    // Step 1: add the slug field without unique()
    Schema::table('posts', function (Blueprint $table) {
        $table->string('slug')->after('title');
    });
 
    // Step 2: Update each row to populate the slug field
    DB::table('posts')->get()->each(function ($post) {
        DB::table('posts')->where('id', $post->id)->update(['slug' => str_slug($post->title)]);
    });
 
    // Step 3: add the unique constraint to slugs
    Schema::table('posts', function (Blueprint $table) {
        $table->unique('slug');
    });
}
```

Migrations can be extremely useful for migrating your data as well as your schema. Don’t be shy to use the DB facade inside them, but try to stay clear of using Eloquent models directly. Your migrations should be immutable, so that once they’re run in production they never change. Eloquent models, by nature, change over time along with your codebase and adapt their behavior to suit new business requirements, which can lead to your old migrations subtly changing their behavior as well.
