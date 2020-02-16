@extends('_layouts.master')

@section('title', $page->title.' ∙ Chris White')

@section('body')
    @include('_partials.nav')

    <div class="container mx-auto">
        {{-- TODO: <article> tag? --}}
        <article class="post">
            <header class="text-center mb-12">
                <h1>{{ $page->title }}</h1>
                <time datetime="{{ $page->getDate()->format('Y-m-d') }}" class="text-gray-500">{{ $page->getDate()->format('F j, Y') }}</time>
            </header>

            @yield('content')

            <div class="text-center my-32">
                <div class="p-2 bg-white inline-block">
                    <svg class="text-gray-500 fill-current" width="24" height="24"><path d="M12 0a12 12 0 100 24 12 12 0 000-24zm8 18l-2-1c-2 0-5-1-4-3 4-6 1-9-2-9s-6 3-2 9c1 2-2 3-4 3l-2 1-2-6a10 10 0 1118 6z"/></svg>
                </div>
                <div class="h-px w-full bg-gray-300" style="margin-top: -26px;"></div>
            </div>
        </article>

        <div class="flex flex-col text-center pb-12">
            <img class="author-photo" src="/assets/images/chris.jpg" alt="Chris White">
            <div class="text-center">
                <span class="font-header text-3xl mb-2">{{ $page->author }}</span>
                <p>Chris is a software engineer living in Ottawa. He can usually be found writing web apps with Laravel and trying to avoid JavaScript as much as possible.</p>
                <p>He works for <a href="https://www.intouchinsight.com/">Intouch Insight</a> during the day, and is the founder of <a href="https://www.loglia.app/">Loglia</a> at night.</p>
            </div>
        </div>
    </div>
@endsection
