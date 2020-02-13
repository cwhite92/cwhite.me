<?php

return [
    'production' => false,
    'baseUrl' => '',
    'collections' => [
        'posts' => [
            'path' => 'blog/{slug}',
            'author' => 'Chris White',
        ],
    ],
    'excerpt' => function ($page, $characters = 600) {
        return substr($page->getContent(), 0, $characters).'...';
    }
];
