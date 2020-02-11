@extends('_layouts.master')

@section('body')
    <h1>{{ $page->title }}</h1>
    <p>By {{ $page->author }} • {{ date('F j, Y', $page->date) }}</p>

    @yield('content')
@endsection
