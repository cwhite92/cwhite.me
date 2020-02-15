---
extends: _layouts.post
title: Laravel API Form Request Validation Errors
slug: laravel-api-form-request-validation-errors
author: Chris White
date: 2017-02-01
section: content
---

This is a quick tip post about a nice way to format your validation errors when working with a Laravel API.

If you’re using Laravel’s [Form Requests](https://laravel.com/docs/5.4/validation#form-request-validation) in the context of an API, you’ll know that by default the validation errors are chucked back to the client like this:

```json
{
  "username": [
    "The username field is required."
  ],
  "password": [
    "The password field is required."
  ]
}
```

While the above is a pretty sensible default format, it might be inconsistent with the rest of your API and thus cause confusion with your API consumers.

To build our own output, we’re going to implement our own FormRequest class that extends Laravel’s. Place it in the `app/Http/Requests` directory.

```php
<?php
 
namespace App\Http\Requests;
 
use Illuminate\Foundation\Http\FormRequest as LaravelFormRequest;
use Illuminate\Http\JsonResponse;
 
abstract class FormRequest extends LaravelFormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    abstract public function rules();
 
    /**
     * Get the failed validation response for the request.
     *
     * @param array $errors
     * @return JsonResponse
     */
    public function response(array $errors)
    {
        $transformed = [];
 
        foreach ($errors as $field => $message) {
            $transformed[] = [
                'field' => $field,
                'message' => $message[0]
            ];
        }
 
        return response()->json([
            'errors' => $transformed
        ], JsonResponse::HTTP_UNPROCESSABLE_ENTITY);
    }
}
```

Now, instead of your form request’s extending `Illuminate\Foundation\Http\FormRequest`, have them extend your `FormRequest` class. When the form request validation fails, you’ll receive an output like this instead:

```json
{
  "errors": [
    {
      "field": "username",
      "message": "The username field is required."
    },
    {
      "field": "password",
      "message": "The password field is required."
    }
  ]
}
```

In my case, this was consistent with the rest of the error responses in the API. Your needs may vary, so feel free to change that `response` method as you see fit. And if you’re one of the heathens that uses `400 Bad Request` for validation errors, use `JsonResponse::HTTP_BAD_REQUEST`. And then change it to the correct status code: `JsonResponse::HTTP_UNPROCESSABLE_ENTITY`.
