<?php

namespace App\Http\Controllers\API;

use App\Traits\ApiResponse;
use App\Models\SystemConfig;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class SystemConfigController extends Controller
{
    use ApiResponse;

    public function index()
    {
        return $this->success(SystemConfig::all(), 'Configs retrieved.');
    }

    public function update(Request $request)
    {
        foreach ($request->settings as $item) {
            SystemConfig::where('key', $item['key'])->update(['value' => $item['value']]);
        }
        
        auth()->user()->recordActivity(
            'System Config', 
            'Synchronized global system protocols and maintenance states.'
        );

        return $this->success(SystemConfig::all(), 'Protocol Sync Complete.');
    }
}
