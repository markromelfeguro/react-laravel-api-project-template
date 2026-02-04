<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckMaintenance
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (\App\Models\User::isUnderMaintenance()) {
            $user = auth()->user();
            if (!$user || ($user->role !== 'admin' && $user->role !== 'superadmin')) {
                return response()->json(['message' => 'System is under maintenance.'], 503);
            }
        }
        return $next($request);
    }
}
