<?php

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

use Inertia\Inertia;
use Inertia\Response;


class AuthController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Show CMS Login
    |--------------------------------------------------------------------------
    */

    public function create(
        Request $request
    ): Response|RedirectResponse {

        /*
        |--------------------------------------------------------------------------
        | Already Authenticated
        |--------------------------------------------------------------------------
        |
        | If the user already has an authenticated session,
        | there is no reason to display the login page again.
        |
        */

        if (Auth::check()) {

            return redirect()
                ->route('cms.dashboard');
        }


        /*
        |--------------------------------------------------------------------------
        | Show Login Page
        |--------------------------------------------------------------------------
        */

        return Inertia::render(
            'Auth/CmsLogin'
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Authenticate CMS User
    |--------------------------------------------------------------------------
    */

    public function store(
        Request $request
    ): RedirectResponse {

        /*
        |--------------------------------------------------------------------------
        | Validate Credentials
        |--------------------------------------------------------------------------
        */

        $credentials =
            $request->validate([
                'email' => [
                    'required',
                    'email',
                ],

                'password' => [
                    'required',
                    'string',
                ],
            ]);


        /*
        |--------------------------------------------------------------------------
        | Remember Me
        |--------------------------------------------------------------------------
        */

        $remember =
            $request->boolean(
                'remember'
            );


        /*
        |--------------------------------------------------------------------------
        | Attempt Authentication
        |--------------------------------------------------------------------------
        */

        if (
            !Auth::attempt(
                $credentials,
                $remember
            )
        ) {

            return back()
                ->withErrors([
                    'email' =>
                        'The provided email or password is incorrect.',
                ])
                ->onlyInput(
                    'email'
                );
        }


        /*
        |--------------------------------------------------------------------------
        | Regenerate Session
        |--------------------------------------------------------------------------
        |
        | Prevent session fixation after successful authentication.
        |
        */

        $request
            ->session()
            ->regenerate();


        /*
        |--------------------------------------------------------------------------
        | Redirect to CMS Dashboard
        |--------------------------------------------------------------------------
        |
        | We intentionally do NOT use:
        |
        | redirect()->intended('/')
        |
        | because CMS authentication should always land on the CMS dashboard.
        |
        */

        return redirect()
            ->route(
                'cms.dashboard'
            );
    }


    /*
    |--------------------------------------------------------------------------
    | Logout
    |--------------------------------------------------------------------------
    */

    public function destroy(
        Request $request
    ): RedirectResponse {

        /*
        |--------------------------------------------------------------------------
        | Logout User
        |--------------------------------------------------------------------------
        */

        Auth::logout();


        /*
        |--------------------------------------------------------------------------
        | Invalidate Existing Session
        |--------------------------------------------------------------------------
        */

        $request
            ->session()
            ->invalidate();


        /*
        |--------------------------------------------------------------------------
        | Generate New CSRF Token
        |--------------------------------------------------------------------------
        */

        $request
            ->session()
            ->regenerateToken();


        /*
        |--------------------------------------------------------------------------
        | Return to CMS Login
        |--------------------------------------------------------------------------
        */

        return redirect()
            ->route(
                'cms.login'
            );
    }
}