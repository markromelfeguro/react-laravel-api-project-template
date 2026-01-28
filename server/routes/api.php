<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\NotificationController;
use App\Http\Controllers\API\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::get('/sanctum/csrf-cookie', function () {
    return response()->noContent();
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::prefix('user/auth')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
    });

    Route::controller(UserController::class)->prefix('users')->group( function () {
        Route::put('{slug}/update', 'update');
        Route::delete('{slug}/delete', 'destroy');
        Route::post('switch-theme', 'switchTheme');
    });

    Route::controller(NotificationController::class)->prefix('notifications')->group( function () {
        Route::get('/', 'index');
        Route::get('unread', 'unread');
        Route::patch('{id}/read', 'markAsRead');
        Route::post('read-all', 'markAllAsRead');
        Route::delete('{id}', 'destroy');
    });
});