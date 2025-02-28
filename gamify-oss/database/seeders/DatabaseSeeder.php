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
        $proficiency1 = Proficiency::create(['name' => 'Game Designer']);
        $proficiency2 = Proficiency::create(['name' => 'Game Artist']);
        $proficiency3 = Proficiency::create(['name' => 'Game Programmer']);
        $proficiency4 = Proficiency::create(['name' => 'Audio Composer']);

        // Quests
        // Beginner Quests
        $quest1 = Quest::create([
            'title' => 'Membuka repository project dan baca README',
            'type' => 'Beginner',
            'description' => 'Buka lah repository dari project kita, yang bisa diakses melalui project info yang ada pada halaman quest. Cobalah untuk membaca README sehingga kalian bisa memahami apa yang dilakukan dan dibutuhkan oleh project kita. Selesaikan quest ini dengan submit screenshot layar dari repository project kita.',
            'role' => null,
            'difficulty' => 'Easy',
            'xp_reward' => 75,
            'proficiency_reward' => null,
            'status' => 'open',
            'created_at' => now(),
            'finished_at' => null,
        ]);

        $quest2 = Quest::create([
            'title' => 'Memberi komentar kepada 3 issues yang berbeda',
            'type' => 'Beginner',
            'description' => 'Berikan komentar terhadap 3 issue yang berbeda. Komentar bisa berisikan masukan atau ide yang berkaitan terhadap issue yang dikomentar. Selesaikan quest ini dengan submit screenshot dari komentar-komentar yang telah kalian berikan.',
            'role' => null,
            'difficulty' => 'Easy',
            'xp_reward' => 75,
            'proficiency_reward' => null,
            'status' => 'open',
            'created_at' => now(),
            'finished_at' => null,
        ]);

        $quest3 = Quest::create([
            'title' => 'Membuat fork dari project repository',
            'type' => 'Beginner',
            'description' => 'Lakukan fork terhadap repository project kita, dan set up project tersebut di device kalian masing-masing. Selesaikan quest ini dengan submit screenshot hasil fork kalian.',
            'role' => null,
            'difficulty' => 'Easy',
            'xp_reward' => 75,
            'proficiency_reward' => null,
            'status' => 'open',
            'created_at' => now(),
            'finished_at' => null,
        ]);

        $quest4 = Quest::create([
            'title' => 'Melakukan pull request kepada project repository',
            'type' => 'Beginner',
            'description' => 'Lakukan pull request kepada main repository project kita. Kalian dibebaskan untuk memberikan kontribusi dalam bentuk apapun (aset ataupun program) untuk pull request ini. Selesaikan quest ini dengan submit screenshot permintaan pull request yang sudah diberikan.',
            'role' => null,
            'difficulty' => 'Medium',
            'xp_reward' => 150,
            'proficiency_reward' => null,
            'status' => 'open',
            'created_at' => now(),
            'finished_at' => null,
        ]);

        $quest5 = Quest::create([
            'title' => 'Membuat issue baru terkait ide/masukan/temuan pada project',
            'type' => 'Beginner',
            'description' => 'Buatlah sebuah issue baru yang berisikan ide, temuan, ataupun masukan terhadap aspek apapun dari project. Contoh judul issue: terdapat bug pada kode …, design document belum menjelaskan terkait …, aku mendapatkan ide untuk … agar game lebih menarik, dan lain sebagainya. Selesaikan quest ini dengan submit screenshot issue yang sudah dibuat.',
            'role' => null,
            'difficulty' => 'Easy',
            'xp_reward' => 75,
            'proficiency_reward' => null,
            'status' => 'open',
            'created_at' => now(),
            'finished_at' => null,
        ]);

        $quest6 = Quest::create([
            'title' => 'Write Documentation',
            'type' => 'Writing',
            'description' => 'This is description',
            'role' => 'Game Designer',
            'difficulty' => 'Medium',
            'xp_reward' => 200,
            'proficiency_reward' => 120,
            'status' => 'active',
            'created_at' => now(),
            'finished_at' => null,
        ]);


        // Taken Quests
        TakenQuest::create(['quest_id' => $quest1->quest_id, 'user_id' => 2, 'submission' => null]);
        TakenQuest::create(['quest_id' => $quest2->quest_id, 'user_id' => 3, 'submission' => null]);

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
