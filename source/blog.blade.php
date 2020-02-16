---
pagination:
    collection: posts
    perPage: 10
---

@extends('_layouts.master')

@section('title', 'Blog ∙ Chris White')

@section('body')
    @include('_partials.nav')

    <div class="container mx-auto">
        @foreach ($pagination->items as $post)
            <div class="relative my-12 text-center">
                <h1><a class="text-black border-none" href="{{ $post->getUrl() }}">{{ $post->title }}</a></h1>
                <p class="text-gray-500">{{ $post->getDate()->format('F j, Y') }}</p>
                <p class="text-justify">{!! $post->getExcerpt() !!}</p>
                <div class="fade"></div>
            </div>

            <div class="text-center my-32">
                <div class="p-2 bg-white inline-block">
                    <svg class="text-gray-500 fill-current" width="24" height="24"><path d="M18.4 8.5l1.4 1.4L7.1 22.6 0 24l1.4-7.1L14.1 4.2l1.4 1.4L3.3 18l-.7 3.5 3.5-.7L18.4 8.5zm0-8.5l-3 2.8 5.8 5.7L24 5.7 18.3 0zM6 18.7L17.3 7.4l-.7-.7L5.3 18l.7.7z"/></svg>
                </div>
                <div class="h-px w-full bg-gray-300" style="margin-top: -26px;"></div>
            </div>
        @endforeach

        <div class="flex pb-12">
            <div class="w-1/2 text-left">
                @if ($pagination->previous)
                    <a href="{{ $pagination->previous }}" class="p-4 border-2 border-gray-500 text-gray-500 hover:text-blue-500 hover:border-blue-500">Last page</a>
                @endif
            </div>
            <div class="w-1/2 text-right">
                @if ($pagination->next)
                    <a href="{{ $pagination->next }}" class="p-4 border-2 border-gray-500 text-gray-500 hover:text-blue-500 hover:border-blue-500">Next page</a>
                @endif
            </div>
        </div>
    </div>
@endsection
