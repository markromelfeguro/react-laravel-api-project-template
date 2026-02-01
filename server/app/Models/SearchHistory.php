<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class SearchHistory extends Model
{
    protected $table = 'search_histories';

    protected $fillable = [
        'user_id',
        'searchable_id',
        'searchable_type',
        'keyword'
    ];

    /**
     * The model being searched (e.g., User, Product, Order).
     */
    public function searchable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * The user who performed the search.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
