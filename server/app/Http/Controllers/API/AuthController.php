<?php

namespace App\Http\Controllers\API;

use App\Traits\ApiResponse;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\RateLimiter;
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

        // Rate Limiting (Prevents Brute Force)
        $throttleKey = Str::transliterate(Str::lower($request->input('login_credential')).'|'.$request->ip());
        
        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            throw ValidationException::withMessages([
                'login_credential' => [__('auth.throttle', ['seconds' => $seconds])],
            ]);
        }

        //  Attempt Authentication
        if (!Auth::attempt(['email' => $credentials['login_credential'], 'password' => $credentials['password']], $request->boolean('remember_me'))) {
            
            // Increment throttle on failure
            RateLimiter::hit($throttleKey);

            throw ValidationException::withMessages([
                'login_credential' => [__('auth.failed')],
            ]);
        }

        $user = Auth::user();
        $user->recordActivity('Authentication', 'User successfully logged into the system.');
        RateLimiter::clear($throttleKey);
        $request->session()->regenerate();

        return $this->success([
            'user' => new UserResource($user),
        ], 'You have logged in successfully.');
    }

    /**
     * Logout the user out of the application.
     */
    public function logout(Request $request)
    {   
        $user = Auth::user();

        Auth::guard('web')->logout();
    
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        
        $user->recordActivity('Authentication', 'User successfully logged out from the system.');
        return $this->success(null, 'You have logged out successfully.');
    }

    /**
     * Get the authenticated user session data.
     */
    public function me(Request $request)
    {
        return new UserResource($request->user());
    }

    /**
     * Update the user's password.
     */
    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => ['required', 'string'],
            'password' => [
                'required', 
                'string', 
                'confirmed',
                Password::min(8)
                    ->letters()
                    ->mixedCase()
                    ->numbers()
                    ->symbols()
            ],
        ]);

        $user = $request->user();

        // Verify that the current_password matches the hashed password in DB
        if (!Hash::check($request->current_password, $user->password)) {
            return $this->error('The provided current password does not match our records.', 422);
        }

        $user->update([
            'password' => Hash::make($request->password)
        ]);

        return $this->success(null, 'Password updated successfully.');
    }
}
