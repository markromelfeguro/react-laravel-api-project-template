<?php

namespace App\Http\Controllers\API;

use Auth;
use App\Models\User;
use App\Models\UserProfile;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\UserRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    use ApiResponse;
    
    public function index(Request $request)
    {
        $query = User::query()->with('userProfile')->whereNot('id', auth()->id());

        if ($request->filled('search')) {
            $search = $request->search;

            (new User)->recordSearch($search);
            
            $normalizedSearch = preg_replace('/[^A-Za-z0-9]/', '', $search);

            $query->where(function($q) use ($search, $normalizedSearch) {
                $q->where('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%")
                
                // Advanced normalized search: 
                // Strips - . and spaces from the column before comparing
                ->orWhereRaw("REPLACE(REPLACE(REPLACE(name, ' ', ''), '-', ''), '.', '') LIKE ?", ["%{$normalizedSearch}%"])
                ->orWhereRaw("REPLACE(REPLACE(REPLACE(email, ' ', ''), '-', ''), '.', '') LIKE ?", ["%{$normalizedSearch}%"]);
            });
        }

        $limit = $request->query('limit', 10);
        $users = $query->latest()->paginate($limit);

        $suggestions = auth()->user()->searches()
            ->latest('updated_at')
            ->take(5)
            ->pluck('keyword');

        return $this->success([
            'users' => UserResource::collection($users->items()),
            'suggestions' => $suggestions,
            'total' => $users->total(),
        ], 'Data retrieved successfully.');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UserRequest $request)
    {
        return DB::transaction(function () use ($request) {
            
            $user = User::create([
                'name'     => $request->name,
                'email'    => $request->email,
                'password' => $request->password, 
                'role'     => $request->role,
            ]);

            $profileData = [
                'user_id' => $user->id,
                'theme'   => 'system',
            ];

            if ($request->hasFile('avatar')) {
                $path = $request->file('avatar')->store('avatars', 'public');
                $profileData['avatar'] = asset('storage/' . $path);
            }

            $user->userProfile()->create($profileData);

            return $this->success(
                new UserResource($user->load('userProfile')),
                'New user created successfully.'
            );
        });
    }

    /**
     * Display the specified resource for editing/viewing.
     */
    public function show($id)
    {
        $user = User::with('userProfile')->findOrFail($id);

        return $this->success(
            new UserResource($user),
            'User retrieved successfully.'
        );
    }

    /**
     * Update the authenticated user's profile information.
     * Handles both the 'users' and 'user_profiles' tables.
     */
    public function update(UserRequest $request, $id)
    {
        $user = User::findOrFail($id);

        return DB::transaction(function () use ($request, $user) {
            // Update basic info
            $user->update($request->only(['name', 'email', 'role']));

            // Handle Password separately
            if ($request->filled('password')) {
                $user->update(['password' => Hash::make($request->password)]);
            }

            $profileData = [];
            
            // Handle Bio if present (for the WYSIWYG)
            if ($request->has('bio')) {
                $profileData['bio'] = $request->bio;
            }

            // Handle Avatar
            if ($request->hasFile('avatar')) {
                if ($user->userProfile && $user->userProfile->avatar) {
                    Storage::disk('public')->delete($user->userProfile->avatar);
                }
                $profileData['avatar'] = $request->file('avatar')->store('avatars', 'public');
            }

            $user->userProfile()->updateOrCreate(
                ['user_id' => $user->id],
                $profileData
            );

            return $this->success(
                new UserResource($user->load('userProfile')),
                'User info updated successfully.'
            );
        });
    }

    /**
     * Delete a user account and all associated data.
    */
    public function destroy($id)
    {
        $currentUser = Auth::user();
        $targetUser = User::findOrFail($id);

        if ($currentUser->id == $id) {
            return $this->error('You cannot delete your own account from here.', 403);
        }

        if ($currentUser->role !== 'superadmin' && $currentUser->role !== 'admin') {
            return $this->error('You do not have permission to delete users.', 403);
        }
        if ($targetUser->user_profile && $targetUser->user_profile->avatar) {
            Storage::disk('public')->delete($targetUser->user_profile->avatar);
        }

        auth()->user()->recordActivity(
            'User Management', 
            "Permanently deleted user account: {$targetUser->name}"
        );

        $targetUser->delete();

        return $this->success(
            null, 
            "User has been successfully deleted."
        );
    }
    
    /**
     * Remove multiple resources from storage.
    */
    public function bulkDestroy(Request $request)
    {
        $ids = $request->ids;
        
        if (!$ids || !is_array($ids)) {
            return $this->error('No valid IDs provided.', 400);
        }

        $users = User::with('userProfile')->whereIn('id', $ids)->get();

        return DB::transaction(function () use ($users) {
            $count = 0;

            foreach ($users as $user) {
                
                if ($user->id === auth()->id()) continue;

                if ($user->user_profile && $user->user_profile->avatar) {
                    Storage::disk('public')->delete($user->user_profile->avatar);
                }
                $user->delete();
                $count++;
            }

            auth()->user()->recordActivity(
                'User Management', 
                "Bulk delete performed: {$count} user(s) removed from the system."
            );

            return $this->success(null, "{$count} users have been successfully deleted.");
        });
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
