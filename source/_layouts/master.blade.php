<!DOCTYPE html>
<html lang="en" class="bg-red-600 min-h-screen">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <meta http-equiv="x-ua-compatible" content="ie=edge">

        <link href="https://fonts.googleapis.com/css?family=Libre+Baskerville:400,700|Source+Sans+Pro:400,400i,700,700i&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="{{ mix('css/main.css', 'assets/build') }}">
    </head>
    <body class="font-body text-lg py-10 bg-white min-h-screen">
        <div class="w-full h-1 bg-red-600 fixed top-0"></div>

        <div class="container mx-auto">
            @yield('body')
        </div>
    </body>
</html>
