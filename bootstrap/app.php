
<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up'
    )
    ->withMiddleware(function (Middleware $middleware): void {

        // Trust Render reverse proxy
        $middleware->trustProxies(at: '*');

        // Keep state-changing CMS routes protected by CSRF.
        // Public website form routes are the only routes intentionally excluded.
        $middleware->validateCsrfTokens(except: [
            'team-members',
            'demoperpose-mail',
            'newCareers-form'
        ]);

    })
    ->withExceptions(function (Exceptions $exceptions): void {})
    ->create();
