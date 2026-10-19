<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CmsController;
use App\Http\Controllers\Cms\EmailRecipientController;
Route::post('/cms-api/login',[CmsController::class,'login'])->middleware('throttle:5,1');
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
    });
    // Route::get('cms-api/email-recipients/{type}', [EmailRecipientController::class, 'show']);
    // Route::put('cms-api/email-recipients/{type}', [EmailRecipientController::class, 'update']);

Route::view('/{any?}','cms')->where('any','^(?!cms-api).*$');
