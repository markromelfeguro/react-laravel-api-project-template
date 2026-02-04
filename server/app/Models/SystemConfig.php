<?php

namespace App\Models;

use App\Traits\TracksActivity;
use Illuminate\Database\Eloquent\Model;

class SystemConfig extends Model
{
    use TracksActivity;
    protected $fillable = ['key', 'value', 'type'];

    /**
     * Helper to get a config value by key.
     */
    public static function getVal($key, $default = null)
    {
        $config = self::where('key', $key)->first();
        if (!$config) return $default;

        return $config->type === 'boolean' 
            ? filter_var($config->value, FILTER_VALIDATE_BOOLEAN) 
            : $config->value;
    }
}
