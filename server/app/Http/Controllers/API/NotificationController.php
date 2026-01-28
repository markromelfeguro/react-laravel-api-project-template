<?php

namespace App\Http\Controllers\API;

use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\NotificationResource;

class NotificationController extends Controller
{
    use ApiResponse;

    /**
     * Get all notifications for the authenticated user.
     */
    public function index()
    {
        $notifications = Auth::user()->notifications()
            ->orderBy('created_at', 'desc')
            ->get();

        return $this->success(
            NotificationResource::collection($notifications),
            'Notifications retrieved successfully.'
        );
    }

    /**
     * Get only unread notifications.
     */
    public function unread()
    {
        $notifications = Auth::user()->notifications()
            ->unread()
            ->orderBy('created_at', 'desc')
            ->get();

        return $this->success(
            NotificationResource::collection($notifications),
            'Unread notifications retrieved.'
        );
    }

    /**
     * Mark a specific notification as read.
     */
    public function markAsRead($id)
    {
        $notification = Auth::user()->notifications()->findOrFail($id);
        
        $notification->update([
            'is_read' => true,
            'read_at' => now()
        ]);

        return $this->success(
            new NotificationResource($notification),
            'Notification marked as read.'
        );
    }

    /**
     * Mark all user notifications as read.
     */
    public function markAllAsRead()
    {
        Auth::user()->notifications()
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now()
            ]);

        return $this->success(null, 'All notifications marked as read.');
    }

    /**
     * Delete a notification.
     */
    public function destroy($id)
    {
        $notification = Auth::user()->notifications()->findOrFail($id);
        $notification->delete();

        return $this->success(null, 'Notification deleted.');
    }
}
