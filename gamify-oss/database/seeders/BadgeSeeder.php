<?php

namespace Database\Seeders;

use App\Models\Badge;
use Illuminate\Database\Seeder;

class BadgeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {   
        $badges = [
            [
                'badge_id' => 1,
                'name' => 'The Visionary Questioner',
                'description' => 'Ask 20 questions by creating or commenting on issues.',
            ],
            [
                'badge_id' => 2,
                'name' => 'The Guiding Helper',
                'description' => 'Reply to 20 issues or issue comments.',
            ],
            [
                'badge_id' => 3,
                'name' => 'The Ascended',
                'description' => 'Reach Level 10 on the platform.',
            ],
        ];
        
        foreach ($badges as $badge) {
            Badge::create($badge);
        }
    }
}