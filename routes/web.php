<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CmsController;
use App\Http\Controllers\Cms\EmailRecipientController;
use App\Http\Controllers\Formcontroller;
use App\Http\Controllers\TeamsMemberController;
use Illuminate\Http\Request;

Route::post('/cms-api/login', [CmsController::class, 'login']);

Route::get('/csrf-token', function (Request $request) {
    return response()->json([
        'token' => csrf_token(),
    ])->header('Cache-Control', 'no-store, no-cache, must-revalidate');
});
Route::middleware('auth')->prefix('cms-api')->group(function(){
    Route::get('/me',[CmsController::class,'me']);
    Route::post('/logout',[CmsController::class,'logout']);
    Route::get('/summary',[CmsController::class,'summary']);
    Route::get('/records/{type}',[CmsController::class,'index']);
    Route::get('/records/{type}/{id}',[CmsController::class,'show']);
    Route::patch('/records/{type}/{id}',[CmsController::class,'update']);
    Route::get('/resume/{id}',[CmsController::class,'resume']);
    Route::get('/email-recipients/{type}', [EmailRecipientController::class, 'show']);
    Route::put('/email-recipients/{type}', [EmailRecipientController::class, 'update']);

    // Teams memeber routes
      Route::post('/team-create',[TeamsMemberController::class,'createTeamsMember']);
      Route::post('/team-member',[TeamsMemberController::class,'getAllTeammember']);
      Route::post('/single-member',[TeamsMemberController::class,'getSingleData']);
      Route::post('/team-update',[TeamsMemberController::class,'updateTeamsMember']);
      Route::delete('/team-delete',[TeamsMemberController::class,'DeleteTeamMember']); 
    });
    //   Route::post('/cms-api/team-create',[TeamsMemberController::class,'createTeamsMember']);
    Route::post('/team-members',[TeamsMemberController::class,'getAllTeammember']);

    Route::post('/demoperpose-mail',[Formcontroller::class,'addDemo']);
    Route::post('/newCareers-form',[Formcontroller::class,'CareerForm']);
    // Route::get('cms-api/email-recipients/{type}', [EmailRecipientController::class, 'show']);
    // Route::put('cms-api/email-recipients/{type}', [EmailRecipientController::class, 'update']);

Route::view('/{any?}','cms')->where('any','^(?!cms-api).*$');
