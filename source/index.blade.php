@extends('_layouts.home')

@section('body')
    <div class="min-h-screen flex flex-col items-center justify-center">
        <div class="text-center">
            <h1 class="font-home text-green-400 text-6xl tracking-tight">Chris White</h1>
            <h2 class="font-home text-green-600 -mt-10 tracking-widest mb-12">Web Developer</h2>

            <a href="/blog" class="text-2xl text-green-400 border-green-400 border-2 py-2 px-3 mr-6">Blog</a>
            <a href="/contact" class="text-2xl text-green-400 border-green-400 border-2 py-2 px-3">Contact</a>
        </div>
    </div>
@endsection
