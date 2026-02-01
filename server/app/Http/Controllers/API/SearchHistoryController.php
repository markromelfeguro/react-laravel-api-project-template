<?php

namespace App\Http\Controllers\API;

use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use App\Models\SearchHistory;
use App\Http\Controllers\Controller;

class SearchHistoryController extends Controller
{
    use ApiResponse;
    /**
     * Delete a specific keyword for the authenticated user.
     */
    public function destroy(Request $request, $keyword)
    {
        $type = $request->query('type'); // e.g., 'App\Models\User'

        SearchHistory::where('user_id', auth()->id())
            ->where('keyword', $keyword)
            ->when($type, function ($query) use ($type) {
                return $query->where('searchable_type', $type);
            })
            ->delete();

        return $this->success(null, 'Selected search keyword removed successfully.');
    }

    /**
     * Clear all history for a specific context.
     */
    public function clear(Request $request)
    {
        $type = $request->query('type');

        SearchHistory::where('user_id', auth()->id())
            ->when($type, function ($query) use ($type) {
                return $query->where('searchable_type', $type);
            })
            ->delete();

        return $this->success(null, 'Search history cleared.');
    }
}
