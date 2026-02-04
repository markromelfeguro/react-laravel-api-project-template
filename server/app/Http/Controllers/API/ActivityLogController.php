<?php

namespace App\Http\Controllers\API;

use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ActivityLogController extends Controller
{
    use ApiResponse;

    public function index()
    {
        $logs = auth()->user()->activityLogs()->latest()->paginate(10);
        return $this->success($logs, 'Activity logs retrieved successfully.');
    }
}
