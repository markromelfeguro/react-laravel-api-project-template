<?php

namespace App\Http\Controllers\API;

use App\Models\AuditLog;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class AuditLogController extends Controller
{
    use ApiResponse;

    public function index()
    {
        // System-wide audit logs, typically for admins
        $logs = AuditLog::with('user')->latest()->paginate(15);
        return $this->success($logs, 'System audit logs retrieved successfully.');
    }
}
