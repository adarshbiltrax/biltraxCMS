<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;


return Application::configure(
    basePath: dirname(__DIR__)
)
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )

    ->withMiddleware(
        function (Middleware $middleware): void {

            /*
            |--------------------------------------------------------------------------
            | Web Middleware
            |--------------------------------------------------------------------------
            |
            | Keep the existing Inertia middleware and asset preload middleware.
            |
            */

            $middleware->web(
                append: [
                    \App\Http\Middleware\HandleInertiaRequests::class,

                    \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
                ]
            );


            /*
            |--------------------------------------------------------------------------
            | Authentication Redirect
            |--------------------------------------------------------------------------
            |
            | When an unauthenticated user tries to access:
            |
            | /cms
            | /cms/projects
            | /cms/careers
            | /cms/enquiries
            | /cms/contact-enquiries
            |
            | Laravel's "auth" middleware will redirect the user to:
            |
            | /cms/login
            |
            | This prevents:
            |
            | Route [login] not defined.
            |
            */

            $middleware->redirectGuestsTo(
                fn (Request $request) =>
                    route('cms.login')
            );

        }
    )

    ->withExceptions(
        function (Exceptions $exceptions): void {

            /*
            |--------------------------------------------------------------------------
            | API JSON Exceptions
            |--------------------------------------------------------------------------
            |
            | API requests should continue returning JSON errors instead of
            | rendering the normal Laravel HTML exception response.
            |
            */

            $exceptions->shouldRenderJsonWhen(
                fn (Request $request) =>
                    $request->is('api/*')
                    ||
                    $request->expectsJson()
            );

        }
    )

    ->create();