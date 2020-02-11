@extends('_layouts.master')

@section('body')
    @foreach ($posts as $post)
        <div class="relative">
            <h1><a href="{{ $post->getUrl() }}">{{ $post->title }}</a></h1>
            <p>{!! $post->excerpt() !!}</p>
            <div class="fade"></div>
        </div>
    @endforeach
@endsection
