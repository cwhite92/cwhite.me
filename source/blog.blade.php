@extends('_layouts.master')

@section('body')
    @include('_partials.nav')

    <div class="container mx-auto">
        {{-- TODO: make this paginated --}}
        @foreach ($posts as $post)
            <div class="relative">
                <h1><a class="text-black border-none" href="{{ $post->getUrl() }}">{{ $post->title }}</a></h1>
                <p>{!! $post->excerpt() !!}</p>
                <div class="fade"></div>
            </div>
        @endforeach
    </div>
@endsection
