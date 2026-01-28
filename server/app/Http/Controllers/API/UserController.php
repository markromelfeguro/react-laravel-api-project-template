<?php

namespace App\Http\Controllers\API;

use Auth;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\UserRequest;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    use ApiResponse;

    /**
     * Update the authenticated user's profile information.
     * Handles both the 'users' and 'user_profiles' tables.
     */
    public function update(UserRequest $request, $id): JsonResponse
    {
        $validated = $request->validated();
        $targetUser = User::findOrFail($id);
        $profile = $targetUser->userProfile ?: $targetUser->userProfile()->make();

        $hasFile = $request->hasFile('avatar');
        
        $targetUser->fill([
            'name' => $validated['name'],
            'role' => $validated['role'] ?? $targetUser->role,
        ]);

        $profile->fill([
            'bio'   => $validated['bio'] ?? $profile->bio,
            'phone' => $validated['phone'] ?? $profile->phone,
        ]);

        if (!$targetUser->isDirty() && !$profile->isDirty() && !$hasFile) {
            return $this->success(
                null,
                'No changes detected.'
            );
        }

        if ($hasFile) {
            if ($profile->avatar) {
                Storage::disk('public')->delete($profile->avatar);
            }
            $profile->avatar = $request->file('avatar')->store('avatars', 'public');
        }

        $targetUser->save();
        $targetUser->userProfile()->save($profile);

        return $this->success(
            new UserResource($targetUser->load('userProfile')),
            'Profile updated successfully.'
        );
    }

    /**
     * Decommission a user account and purge all associated infrastructure assets.
    */
   public function destroy($id): JsonResponse
    {
        $currentUser = Auth::user();

        $targetUser = User::findOrFail($id);

        if ($currentUser->role !== 'admin' && $currentUser->id != $id) {
            return $this->error('Unauthorized decommissioning attempt.', 403);
        }

        if ($targetUser->userProfile && $targetUser->userProfile->avatar) {
            Storage::disk('public')->delete($targetUser->userProfile->avatar);
        }

        $targetUser->delete();

        return $this->success(
            null, 
            "Identity [ID: {$id}] and associated assets have been permanently purged from the system."
        );
    }

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
