<?php

use App\Http\Controllers\API\SystemConfigController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\AuditLogController;
use App\Http\Controllers\API\ActivityLogController;
use App\Http\Controllers\API\NotificationController;
use App\Http\Controllers\API\SearchHistoryController;

Route::post('/login', [AuthController::class, 'login']);

Route::get('/sanctum/csrf-cookie', function () {
    return response()->noContent();
});

Route::controller(SystemConfigController::class)->prefix('system-configs')->group( function () {
        Route::get('/',  'index');
    });

Route::middleware(['check.maintenance', 'auth:sanctum'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::prefix('user/auth')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/change-password', [AuthController::class, 'changePassword']);
    });

    Route::controller(UserController::class)->prefix('users')->group( function () {
        Route::get('/', 'index');
        Route::post('store', 'store');
        Route::get('{slug}/show', 'show');
        Route::put('{slug}/update', 'update');
        Route::delete('{slug}/delete', 'destroy');
        Route::delete('bulk-delete', 'bulkDestroy');
        Route::post('switch-theme', 'switchTheme');
    });

    Route::controller(SearchHistoryController::class)->prefix('user-searches')->group(function () {
        Route::delete('clear',  'clear');
        Route::delete('{keyword}',  'destroy');
    });

    Route::controller(NotificationController::class)->prefix('notifications')->group( function () {
        Route::get('/', 'index');
        Route::get('unread', 'unread');
        Route::patch('{id}/read', 'markAsRead');
        Route::post('read-all', 'markAllAsRead');
        Route::delete('{id}', 'destroy');
    });


    Route::controller(SystemConfigController::class)->prefix('system-configs')->group( function () {
        Route::post('update',  'update');
    });

    Route::get('/activity-logs', [ActivityLogController::class, 'index']);
    Route::get('/audit-logs', [AuditLogController::class, 'index']);
});