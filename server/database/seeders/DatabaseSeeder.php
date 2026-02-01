<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory(50)->create();

        User::create([
            'name' => 'Mark Romel Feguro',
            'email' => 'markromelfeguro@superadmin.com',
            'email_verified_at' => now(),
            'password' => '@Superadmin123',
            'role' => 'superadmin',
        ]);
    }
}
