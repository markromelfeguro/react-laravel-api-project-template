<?php

namespace App\Traits;
use App\Models\SearchHistory;
use Illuminate\Database\Eloquent\Relations\MorphMany;

trait HasSearchHistory
{
    /**
     * Relationship to search histories.
     */
    public function searchHistories(): MorphMany
    {
        return $this->morphMany(SearchHistory::class, 'searchable');
    }

    /**
     * Record or update a search keyword for the authenticated user.
     */
    public function recordSearch(string $keyword): void
    {
        $keyword = trim($keyword ?? '');

        if (strlen($keyword) < 3) {
            return;
        }

        SearchHistory::updateOrCreate(
            [
                'user_id'         => auth()->id(),
                'searchable_type' => static::class,
                'searchable_id'   => 0,
                'keyword'         => $keyword, 
            ],
            [
                'updated_at'      => now(),
            ]
        );
    }

    /**
     * Get top recent searches for this specific model context.
     */
    public function getRecentSearches(int $limit = 10)
    {
        return SearchHistory::where('user_id', auth()->id())
            ->where('searchable_type', static::class)
            ->where('searchable_id', 0)
            ->latest('updated_at')
            ->take($limit)
            ->pluck('keyword');
    }
}
