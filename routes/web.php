<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CmsController;
use Illuminate\Http\Request;
// Route::post('/cms-api/login',[CmsController::class,'login'])->middleware('throttle:5,1');
Route::post('/cms-api/login', [CmsController::class, 'login']);



Route::get('/csrf-token', function (Request $request) {
    return response()->json([
        'token' => csrf_token(),
    ])->header('Cache-Control', 'no-store, no-cache, must-revalidate');
});

Route::middleware('auth')->prefix('cms-api')->group(function () {
  Route::get('/me', [CmsController::class, 'me']);
  Route::post('/logout', [CmsController::class, 'logout']);
  Route::get('/summary', [CmsController::class, 'summary']);
  Route::get('/records/{type}', [CmsController::class, 'index']);
  Route::get('/records/{type}/{id}', [CmsController::class, 'show']);
  Route::patch('/records/{type}/{id}', [CmsController::class, 'update']);
  Route::get('/resume/{id}', [CmsController::class, 'resume']);
});
Route::view('/{any?}', 'cms')->where('any', '^(?!cms-api).*$');
