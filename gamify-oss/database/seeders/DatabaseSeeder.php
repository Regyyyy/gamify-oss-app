<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        // Admin account
        User::create([
            'name' => 'admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('admin'),
            'role' => 'admin',
            'avatar' => null,
            'level' => 10,
            'xp_point' => 1000,
        ]);

        // User account 1
        User::create([
            'name' => 'regy',
            'email' => 'regy@example.com',
            'password' => Hash::make('regypassword'),
            'role' => 'user',
            'avatar' => null,
            'level' => 1,
            'xp_point' => 0,
        ]);

        // User account 2
        User::create([
            'name' => 'rahma',
            'email' => 'rahma@example.com',
            'password' => Hash::make('rahmapassword'),
            'role' => 'user',
            'avatar' => null,
            'level' => 3,
            'xp_point' => 300,
        ]);
    }
}
