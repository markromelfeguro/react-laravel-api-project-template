<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    
    Route::prefix('user/auth')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
    });
});

Route::get('/sanctum/csrf-cookie', function () {
    return response()->noContent();
});

Route::controller(UserController::class)->prefix('users')->group( function () {
    Route::post('switch-theme', 'switchTheme');
});