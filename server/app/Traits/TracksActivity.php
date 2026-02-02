<?php

namespace App\Traits;

use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

trait TracksActivity
{
    public function recordActivity(string $action, string $description) {
        return ActivityLog::create([
            'user_id' => Auth::id() ?? $this->id,
            'action' => $action,
            'description' => $description,
            'ip_address' => Request::ip(),
            'user_agent' => Request::userAgent(),
        ]);
    }

    public function activityLogs() {
        return $this->hasMany(ActivityLog::class);
    }
}
