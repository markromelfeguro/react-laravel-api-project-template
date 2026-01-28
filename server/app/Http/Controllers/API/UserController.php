<?php

namespace App\Http\Controllers\API;

use Auth;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;

class UserController extends Controller
{
   /**
     * Update the user's UI theme preference in their profile.
     */
    public function switchTheme(Request $request): JsonResponse
    {
        $request->validate([
            'theme' => ['required', 'string', 'in:light,dark,system'],
        ]);

        $user = Auth::user();

        $user->userProfile()->update(
            ['theme' => $request->theme]
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Theme updated to ' . $request->theme,
            'theme' => $request->theme
        ]);
    }
}
