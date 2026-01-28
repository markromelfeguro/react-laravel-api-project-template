<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    use ApiResponse;

    /**
     * Handle an incoming authentication request.
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'login_credential' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        // Attempt to authenticate using the 'email' field in the database
        if (!Auth::attempt(['email' => $credentials['login_credential'], 'password' => $credentials['password']], $request->boolean('remember_me'))) {
            throw ValidationException::withMessages([
                'login_credential' => [__('auth.failed')],
            ]);
        }

        $request->session()->regenerate();

        return $this->success([
            'user' => new UserResource(Auth::user()),
        ], 'Login successful.');
    }

    /**
     * Log the user out of the application.
     */
    public function logout(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return $this->success(null, 'Logged out successfully.');
    }

    /**
     * Get the authenticated user session data.
     */
    public function me(Request $request)
    {
        // Matches AuthService.ts: handleRequest(AxiosInstance.get('/user/auth/me'), ...)
        return new UserResource($request->user());
    }
}
