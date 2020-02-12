<!DOCTYPE html>
<html lang="en" class="bg-red-600 min-h-screen">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <meta http-equiv="x-ua-compatible" content="ie=edge">

        <link href="https://fonts.googleapis.com/css?family=Libre+Baskerville:400,700|Source+Sans+Pro:400,400i,700,700i|Source+Code+Pro&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="{{ mix('css/main.css', 'assets/build') }}">
    </head>
    <body class="font-body text-lg bg-white min-h-screen">
        <div class="w-full h-1 bg-red-600 fixed top-0"></div>
        <div class="border-b border-gray-300 mb-6">
            <div class="container mx-auto">
                <a href="/" class="inline-block p-4 -ml-4 text-black border-none">Home</a>
                <a href="/blog" class="inline-block p-4 text-black border-none">Blog</a>
                <a href="/about" class="inline-block p-4 text-black border-none">About</a>
                <a href="/contact" class="inline-block p-4 text-black border-none">Contact</a>
            </div>
        </div>

        <div class="container mx-auto">
            @yield('body')
        </div>

        <script src="{{ mix('js/main.js', 'assets/build') }}"></script>
    </body>
</html>
