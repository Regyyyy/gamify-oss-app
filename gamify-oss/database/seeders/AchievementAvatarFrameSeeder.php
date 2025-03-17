<?php

namespace Database\Seeders;

use App\Models\Achievement;
use App\Models\AvatarFrame;
use App\Models\UserAchievement;
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
            ['name' => 'Default', 'description' => 'A sleek silver metal circle, symbolizing the foundation of every contributor\'s journey. Simple metallic texture, subtle circuit-like engravings.'],
            ['name' => 'Guiding Hand of the Community', 'description' => 'A frame celebrating those who offer guidance, with a warm, inviting design. Light gold or soft bronze accents, a small open hand symbol at the bottom.'],
            ['name' => 'Code Weaver\'s Seal', 'description' => 'A badge of honor for those who submit pull requests, weaving new features into the project. Silver and blue hues, a quill or code bracket (<>) symbol.'],
            ['name' => 'Bug Hunter\'s Mark', 'description' => 'A frame for the sharp-eyed debuggers who track down and report issues. Dark bronze with a magnifying glass and a small beetle icon.'],
            ['name' => 'Rookie Adventurer\'s Crest', 'description' => 'A frame signifying the first steps of an open-source journey. Light bronze with a path or boot print icon.'],
            ['name' => 'Unfolding Potential', 'description' => 'Marking the first major milestone of progression. A mystical swirling energy effect in silver and blue.'],
            ['name' => 'The Bronze Harbinger', 'description' => 'A tribute to those who achieve third place on the leaderboard. Bronze frame with subtle flames and a small bronze medal icon.'],
            ['name' => 'The Silver Champion', 'description' => 'A mark of unwavering determination, given to those who secure second place. Lighter silver frame with a laurel wreath and a small silver medal icon.'],
            ['name' => 'The Golden Conqueror', 'description' => 'A frame reserved for the champions who claim first place. A radiant gold frame with a crown and a small golden medal icon.'],
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
                'avatar_frame_reward_id' => 3,
            ],
            [
                'name' => 'The Hunt for Errors Never Ends',
                'description' => "Complete beginner quest \"{$quest5Title}\"",
                'xp_reward' => 100,
                'avatar_frame_reward_id' => 4,
            ],
            [
                'name' => 'Rookie Adventurer Walks the Path of Legends',
                'description' => 'Complete all beginner quests',
                'xp_reward' => 150,
                'avatar_frame_reward_id' => 5,
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
                'avatar_frame_reward_id' => 6,
            ],
            [
                'name' => 'The Bronze Harbinger\'s Ascending Path',
                'description' => 'Reach the third place or higher in leaderboard for the first time',
                'xp_reward' => 150,
                'avatar_frame_reward_id' => 7,
            ],
            [
                'name' => 'The Silver Champion\'s Unyielding Resolve',
                'description' => 'Reach the second place or higher in leaderboard for the first time',
                'xp_reward' => 200,
                'avatar_frame_reward_id' => 8,
            ],
            [
                'name' => 'The Gold Conqueror\'s Boundless Glory',
                'description' => 'Reach the first place in leaderboard for the first time',
                'xp_reward' => 300,
                'avatar_frame_reward_id' => 9,
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