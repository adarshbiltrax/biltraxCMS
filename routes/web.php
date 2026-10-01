<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;

use App\Http\Controllers\WebsiteApiController;

use App\Http\Controllers\Cms\AuthController;
use App\Http\Controllers\Cms\DashboardController;
use App\Http\Controllers\Cms\ProjectController;
use App\Http\Controllers\Cms\CareerController;
use App\Http\Controllers\Cms\MessageController;
use App\Http\Controllers\Cms\ContactEnquiryController;
use App\Http\Controllers\OpportunityEnquiryController as PublicOpportunityEnquiryController;

use App\Http\Controllers\Cms\OpportunityEnquiryController as CmsOpportunityEnquiryController;

use App\Http\Controllers\Cms\Bx1ProjectController;

/*
|--------------------------------------------------------------------------
| Public Website
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return inertia('Website/Home');
})->name('home');


/*
|--------------------------------------------------------------------------
| Public API
|--------------------------------------------------------------------------
*/

Route::get('/api/projects', [
    WebsiteApiController::class,
    'projects',
]);

Route::get('/api/careers', [
    WebsiteApiController::class,
    'careers',
]);

Route::post('/api/enquiry', [
    WebsiteApiController::class,
    'enquiry',
])->withoutMiddleware([
    ValidateCsrfToken::class,
]);

Route::post('/api/contact', [
    WebsiteApiController::class,
    'contact',
])->withoutMiddleware([
    ValidateCsrfToken::class,
]);

Route::post(
    '/api/opportunity-enquiry',
    [
        PublicOpportunityEnquiryController::class,
        'store'
    ]
)->withoutMiddleware([
    ValidateCsrfToken::class
]);


/*
|--------------------------------------------------------------------------
| CMS Authentication
|--------------------------------------------------------------------------
|
| These routes MUST remain outside the auth middleware.
|
| GET  /cms/login -> Show CMS login page
| POST /cms/login -> Authenticate CMS user
|
*/

Route::get('/cms/login', [
    AuthController::class,
    'create',
])->name('cms.login');


Route::post('/cms/login', [
    AuthController::class,
    'store',
])->name('cms.login.store');


/*
|--------------------------------------------------------------------------
| Protected CMS Routes
|--------------------------------------------------------------------------
|
| Any unauthenticated request to these routes will be redirected to:
|
| /cms/login
|
| The redirect itself is configured in bootstrap/app.php.
|
*/

Route::prefix('cms')
    ->middleware('auth')
    ->name('cms.')
    ->group(function () {


        /*
        |--------------------------------------------------------------------------
        | Dashboard
        |--------------------------------------------------------------------------
        */

        Route::get(
            '/',
            DashboardController::class
        )->name('dashboard');


        /*
        |--------------------------------------------------------------------------
        | Logout
        |--------------------------------------------------------------------------
        */

        Route::post('/logout', [
            AuthController::class,
            'destroy',
        ])->name('logout');


        /*
        |--------------------------------------------------------------------------
        | Projects
        |--------------------------------------------------------------------------
        */

        Route::resource(
            'projects',
            ProjectController::class
        )->except([
            'show',
        ]);


        /*
        |--------------------------------------------------------------------------
        | Careers
        |--------------------------------------------------------------------------
        */

        Route::resource(
            'careers',
            CareerController::class
        )->except([
            'show',
        ]);


        /*
        |--------------------------------------------------------------------------
        | Enquiries
        |--------------------------------------------------------------------------
        */

        Route::get(
            '/enquiries',
            [
                MessageController::class,
                'enquiries',
            ]
        )->name('enquiries.index');


        Route::get(
            '/enquiries/{enquiry}',
            [
                MessageController::class,
                'enquiryShow',
            ]
        )->name('enquiries.show');


        Route::patch(
            '/enquiries/{enquiry}',
            [
                MessageController::class,
                'enquiryUpdate',
            ]
        )->name('enquiries.update');


        /*
        |--------------------------------------------------------------------------
        | Contact Enquiries
        |--------------------------------------------------------------------------
        */

        Route::get(
            '/contact-enquiries',
            [
                ContactEnquiryController::class,
                'index',
            ]
        )->name('contact-enquiries.index');


        Route::get(
            '/contact-enquiries/{contact}',
            [
                ContactEnquiryController::class,
                'show',
            ]
        )->name('contact-enquiries.show');


        Route::patch(
            '/contact-enquiries/{contact}',
            [
                ContactEnquiryController::class,
                'update',
            ]
        )->name('contact-enquiries.update');


/*
|--------------------------------------------------------------------------
| OPPORTUNITY ENQUIRIES
|--------------------------------------------------------------------------
*/

Route::get(
    '/opportunity-enquiries',
    [
        CmsOpportunityEnquiryController::class,
        'index'
    ]
)->name(
    'opportunity-enquiries.index'
);


Route::get(
    '/opportunity-enquiries/{opportunityEnquiry}',
    [
        CmsOpportunityEnquiryController::class,
        'show'
    ]
)->name(
    'opportunity-enquiries.show'
);


Route::patch(
    '/opportunity-enquiries/{opportunityEnquiry}',
    [
        CmsOpportunityEnquiryController::class,
        'update'
    ]
)->name(
    'opportunity-enquiries.update'
);


/*
|--------------------------------------------------------------------------
| BX1 Project Browser
|--------------------------------------------------------------------------
*/

Route::get(
    '/bx1/projects',
    [
        Bx1ProjectController::class,
        'index',
    ]
)->name('bx1.projects.index');


Route::post(
    '/bx1/projects/search',
    [
        Bx1ProjectController::class,
        'search',
    ]
)->name('bx1.projects.search');


    });