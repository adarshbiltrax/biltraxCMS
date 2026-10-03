<?php

return [
    'postmark' => ['key' => env('POSTMARK_API_KEY')],
    'resend' => ['key' => env('RESEND_API_KEY')],
    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],
    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'bx1' => [
        'auth_url' => env('BX1_AUTH_URL', 'https://api.biltrax.com/v1/get-auth-token'),
        'search_url' => env('BX1_SEARCH_URL', 'https://api.biltrax.com/v1/project-search'),
        'client_id' => env('BX1_CLIENT_ID'),
        'client_secret' => env('BX1_CLIENT_SECRET'),
        'username' => env('BX1_USERNAME'),
        'password' => env('BX1_PASSWORD'),
    ],

    'bx2' => [
        'auth_url' => env('BX2_AUTH_URL', 'https://bx2api.biltrax.com/v1/get-user-auth-token'),
        'search_url' => env('BX2_SEARCH_URL', 'https://bx2api.biltrax.com/v1/bx2-project-search'),
        'client_id' => env('BX2_CLIENT_ID'),
        'client_secret' => env('BX2_CLIENT_SECRET'),
        'username' => env('BX2_USERNAME'),
        'password' => env('BX2_PASSWORD'),
    ],
];
