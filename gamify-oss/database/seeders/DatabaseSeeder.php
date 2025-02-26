<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Achievement;
use App\Models\AvatarFrame;
use App\Models\Badge;
use App\Models\Proficiency;
use App\Models\Quest;
use App\Models\TakenQuest;
use App\Models\UserAchievement;
use App\Models\UserBadge;
use App\Models\UserUICustomization;
use App\Models\UICustomization;
use App\Models\UserAvatarFrame;
use App\Models\UserProficiency;
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

        // Avatar Frames
        $avatarFrame1 = AvatarFrame::create(['name' => 'Golden Frame', 'description' => 'A luxurious golden avatar frame.']);
        $avatarFrame2 = AvatarFrame::create(['name' => 'Silver Frame', 'description' => 'A sleek silver avatar frame.']);

        // Achievements
        Achievement::create(['name' => 'First Steps', 'description' => 'Complete your first quest.', 'xp_reward' => 100, 'avatar_frame_reward_id' => $avatarFrame1->avatar_frame_id]);
        Achievement::create(['name' => 'Pro Explorer', 'description' => 'Complete 10 quests.', 'xp_reward' => 500, 'avatar_frame_reward_id' => $avatarFrame2->avatar_frame_id]);

        // Badges
        $badge1 = Badge::create(['name' => 'Beginner', 'description' => 'Awarded for starting the journey.']);
        $badge2 = Badge::create(['name' => 'Veteran', 'description' => 'Awarded for exceptional contributions.']);

        // Proficiencies
        $proficiency1 = Proficiency::create(['name' => 'Coding']);
        $proficiency2 = Proficiency::create(['name' => 'Documentation']);

        // Quests
        $quest1 = Quest::create([
            'title' => 'Fix a Bug',
            'type' => 'Development',
            'role' => 'Developer',
            'difficulty' => 'Easy',
            'xp_reward' => 150,
            'proficiency_reward' => $proficiency1->proficiency_id,
            'status' => 'active',
            'created_at' => now(),
            'finished_at' => null,
        ]);

        $quest2 = Quest::create([
            'title' => 'Write Documentation',
            'type' => 'Writing',
            'role' => 'Technical Writer',
            'difficulty' => 'Medium',
            'xp_reward' => 200,
            'proficiency_reward' => $proficiency2->proficiency_id,
            'status' => 'active',
            'created_at' => now(),
            'finished_at' => null,
        ]);

        // Taken Quests
        TakenQuest::create(['quest_id' => $quest1->quest_id, 'user_id' => 2]);
        TakenQuest::create(['quest_id' => $quest2->quest_id, 'user_id' => 3]);

        // User Achievements
        UserAchievement::create(['user_id' => 2, 'achievement_id' => 1, 'status' => 'completed']);
        UserAchievement::create(['user_id' => 3, 'achievement_id' => 2, 'status' => 'in-progress']);

        // User Badges
        UserBadge::create(['user_id' => 2, 'badge_id' => $badge1->badge_id, 'created_at' => now(), 'finished_at' => null]);
        UserBadge::create(['user_id' => 3, 'badge_id' => $badge2->badge_id, 'created_at' => now(), 'finished_at' => null]);

        // UI Customizations
        $ui1 = UICustomization::create(['name' => 'Leaderboard']);
        $ui2 = UICustomization::create(['name' => 'Achievements']);

        // User UI Customizations
        UserUICustomization::create(['user_id' => 2, 'ui_customization_id' => $ui1->ui_customization_id, 'is_enabled' => true, 'created_at' => now(), 'finished_at' => null]);
        UserUICustomization::create(['user_id' => 3, 'ui_customization_id' => $ui2->ui_customization_id, 'is_enabled' => false, 'created_at' => now(), 'finished_at' => null]);

        // User Avatar Frames
        UserAvatarFrame::create(['user_id' => 2, 'avatar_frame_id' => $avatarFrame1->avatar_frame_id, 'is_used' => true, 'created_at' => now(), 'finished_at' => null]);
        UserAvatarFrame::create(['user_id' => 3, 'avatar_frame_id' => $avatarFrame2->avatar_frame_id, 'is_used' => false, 'created_at' => now(), 'finished_at' => null]);

        // User Proficiencies
        UserProficiency::create(['user_id' => 2, 'proficiency_id' => $proficiency1->proficiency_id, 'point' => 200, 'created_at' => now(), 'finished_at' => null]);
        UserProficiency::create(['user_id' => 3, 'proficiency_id' => $proficiency2->proficiency_id, 'point' => 300, 'created_at' => now(), 'finished_at' => null]);
    }
}
