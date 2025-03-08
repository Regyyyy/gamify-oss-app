<?php

namespace Database\Seeders;

use App\Models\Achievement;
use App\Models\AvatarFrame;
use App\Models\Quest;
use Illuminate\Database\Seeder;

class AchievementAvatarFrameSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get quest titles
        $quest1 = Quest::find(1);
        $quest2 = Quest::find(2);
        $quest4 = Quest::find(4);
        $quest5 = Quest::find(5);
        
        $quest1Title = $quest1 ? $quest1->title : 'First Quest';
        $quest2Title = $quest2 ? $quest2->title : 'Second Quest';
        $quest4Title = $quest4 ? $quest4->title : 'Fourth Quest';
        $quest5Title = $quest5 ? $quest5->title : 'Fifth Quest';
        
        // Create avatar frames
        $avatarFrames = [
            ['name' => 'Golden Frame', 'description' => 'A luxurious golden avatar frame with intricate patterns.'],
            ['name' => 'Silver Frame', 'description' => 'A sleek silver avatar frame with a polished finish.'],
            ['name' => 'Error Hunter', 'description' => 'A frame with keen eyes that spot the unseen bugs.'],
            ['name' => 'Rookie\'s Crown', 'description' => 'A frame adorned with symbols of early achievement.'],
            ['name' => 'Boundless Frame', 'description' => 'A frame that expands with potential and possibility.'],
            ['name' => 'Bronze Medallion', 'description' => 'A frame showcasing the bronze rank of achievement.'],
            ['name' => 'Silver Crest', 'description' => 'A frame that shines with the brilliance of silver victory.'],
            ['name' => 'Golden Crown', 'description' => 'A frame that radiates with the glory of golden triumph.'],
        ];
        
        foreach ($avatarFrames as $index => $frame) {
            AvatarFrame::create([
                'avatar_frame_id' => $index + 1,
                'name' => $frame['name'],
                'description' => $frame['description'],
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }
        
        // Create achievements
        $achievements = [
            [
                'name' => 'Welcome, Adventurer!',
                'description' => "Complete beginner quest \"{$quest1Title}\"",
                'xp_reward' => 25,
                'avatar_frame_reward_id' => null,
            ],
            [
                'name' => 'A Guiding Hand Lifts the Community',
                'description' => "Complete beginner quest \"{$quest2Title}\"",
                'xp_reward' => 50,
                'avatar_frame_reward_id' => 2,
            ],
            [
                'name' => 'Thank You for Your Contribution, Adventurer!',
                'description' => "Complete beginner quest \"{$quest4Title}\"",
                'xp_reward' => 50,
                'avatar_frame_reward_id' => 2,
            ],
            [
                'name' => 'The Hunt for Errors Never Ends',
                'description' => "Complete beginner quest \"{$quest5Title}\"",
                'xp_reward' => 100,
                'avatar_frame_reward_id' => 3,
            ],
            [
                'name' => 'Rookie Adventurer Walks the Path of Legends',
                'description' => 'Complete all beginner quests',
                'xp_reward' => 150,
                'avatar_frame_reward_id' => 4,
            ],
            [
                'name' => 'A Warrior Accepts the Ultimate Trial',
                'description' => 'Take your first hard quest',
                'xp_reward' => 200,
                'avatar_frame_reward_id' => null,
            ],
            [
                'name' => 'Boundless Potential Begins to Unfold',
                'description' => 'Reach level 5',
                'xp_reward' => 200,
                'avatar_frame_reward_id' => 5,
            ],
            [
                'name' => 'The Bronze Harbinger\'s Ascending Path',
                'description' => 'Reach the third place or higher in leaderboard for the first time',
                'xp_reward' => 150,
                'avatar_frame_reward_id' => 6,
            ],
            [
                'name' => 'The Silver Champion\'s Unyielding Resolve',
                'description' => 'Reach the second place or higher in leaderboard for the first time',
                'xp_reward' => 200,
                'avatar_frame_reward_id' => 7,
            ],
            [
                'name' => 'The Gold Conqueror\'s Boundless Glory',
                'description' => 'Reach the first place in leaderboard for the first time',
                'xp_reward' => 300,
                'avatar_frame_reward_id' => 8,
            ],
        ];
        
        foreach ($achievements as $index => $achievement) {
            Achievement::create([
                'achievement_id' => $index + 1,
                'name' => $achievement['name'],
                'description' => $achievement['description'],
                'xp_reward' => $achievement['xp_reward'],
                'avatar_frame_reward_id' => $achievement['avatar_frame_reward_id'],
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }
    }
}