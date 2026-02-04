<?php

namespace Database\Seeders;

use App\Models\SystemConfig;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class SystemConfigSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            ['key' => 'site_name', 'value' => 'Command Center', 'type' => 'string'],
            ['key' => 'maintenance_mode', 'value' => 'false', 'type' => 'boolean'],
        ];

        foreach ($settings as $setting) {
            SystemConfig::firstOrCreate(['key' => $setting['key']], $setting);
        }
    }
}
