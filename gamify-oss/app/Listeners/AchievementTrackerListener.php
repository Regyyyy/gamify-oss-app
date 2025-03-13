<?php

namespace App\Listeners;

use App\Events\QuestCompletedEvent;
use App\Models\Achievement;
use App\Models\Quest;
use App\Models\TakenQuest;
use App\Models\UserAchievement;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class AchievementTrackerListener implements ShouldQueue
{
    /**
     * Handle the event.
     */
    public function handle(QuestCompletedEvent $event): void
    {
        $user = $event->user;
        $quest = $event->quest;

        \Illuminate\Support\Facades\Log::info("AchievementTrackerListener triggered", [
            'listener_class' => get_class($this),
            'user_id' => $user->user_id,
            'user_name' => $user->name,
            'quest_id' => $quest->quest_id,
            'quest_title' => $quest->title
        ]);

        // Check for specific quest completion achievements
        $this->checkSpecificQuestAchievements($user, $quest);

        // Check for "all beginner quests" achievement
        $this->checkAllBeginnerQuestsAchievement($user);

        // Add this new check for first hard advanced quest
        $this->checkFirstHardAdvancedQuestAchievement($user, $quest);
    }

    /**
     * Check if this is the user's first hard advanced quest
     */
    private function checkFirstHardAdvancedQuestAchievement($user, $quest): void
    {
        // Only proceed if the current quest is Advanced type and Hard difficulty
        if ($quest->type === 'Advanced' && $quest->difficulty === 'Hard') {
            \Illuminate\Support\Facades\Log::info("Checking first hard advanced quest achievement", [
                'user_id' => $user->user_id,
                'quest_id' => $quest->quest_id,
                'difficulty' => $quest->difficulty,
                'type' => $quest->type
            ]);

            // Achievement ID for first hard quest
            $firstHardQuestAchievementId = 6;

            // Check if user already has this achievement
            $existingAchievement = UserAchievement::where('user_id', $user->user_id)
                ->where('achievement_id', $firstHardQuestAchievementId)
                ->first();

            if (!$existingAchievement) {
                \Illuminate\Support\Facades\Log::info("Unlocking 'First Hard Quest' achievement for user", [
                    'user_id' => $user->user_id,
                    'user_name' => $user->name
                ]);

                // Create the achievement record with "completed" status
                UserAchievement::create([
                    'user_id' => $user->user_id,
                    'achievement_id' => $firstHardQuestAchievementId,
                    'status' => 'completed',
                    'created_at' => now()
                ]);
            } else {
                \Illuminate\Support\Facades\Log::info("User already has first hard quest achievement", [
                    'user_id' => $user->user_id
                ]);
            }
        }
    }

    private function checkSpecificQuestAchievements($user, $quest): void
    {
        // Map quest IDs to achievement IDs
        $questAchievementMap = [
            1 => 1, // Quest ID 1 => Achievement ID 1 (Welcome, Adventurer!)
            2 => 2, // Quest ID 2 => Achievement ID 2 (A Guiding Hand Lifts the Community)
            4 => 3, // Quest ID 4 => Achievement ID 3
            5 => 4, // Quest ID 5 => Achievement ID 4
        ];

        \Illuminate\Support\Facades\Log::info("Checking for specific quest achievement", [
            'quest_id' => $quest->quest_id,
            'has_mapping' => isset($questAchievementMap[$quest->quest_id]),
            'mapped_achievement_id' => $questAchievementMap[$quest->quest_id] ?? 'none'
        ]);

        // Check if this quest has a corresponding achievement
        if (isset($questAchievementMap[$quest->quest_id])) {
            $achievementId = $questAchievementMap[$quest->quest_id];

            // Check if user already has this achievement
            $existingAchievement = UserAchievement::where('user_id', $user->user_id)
                ->where('achievement_id', $achievementId)
                ->first();

            \Illuminate\Support\Facades\Log::info("Checking if user already has achievement", [
                'user_id' => $user->user_id,
                'achievement_id' => $achievementId,
                'already_has_achievement' => ($existingAchievement != null)
            ]);

            if (!$existingAchievement) {
                \Illuminate\Support\Facades\Log::info("Creating new achievement record for user", [
                    'user_id' => $user->user_id,
                    'achievement_id' => $achievementId
                ]);

                // Create the achievement record with "completed" status
                // BUT DO NOT award XP here - that happens only when claimed
                $userAchievement = UserAchievement::create([
                    'user_id' => $user->user_id,
                    'achievement_id' => $achievementId,
                    'status' => 'completed',
                    'created_at' => now()
                ]);

                \Illuminate\Support\Facades\Log::info("Achievement record created", [
                    'user_achievement_id' => $userAchievement->user_achievement_id ?? 'failed',
                    'status' => 'completed'
                ]);
            }
        }
    }

    /**
     * The XP thresholds for each level
     */
    protected $levelThresholds = [
        1 => 0,
        2 => 200,
        3 => 450,
        4 => 750,
        5 => 1100,
        6 => 1500,
        7 => 1950,
        8 => 2450,
        9 => 3050,
        10 => 3650
    ];

    /**
     * Determine the appropriate level based on XP
     */
    private function determineLevel(int $xp): int
    {
        // Start from the highest level and work backwards
        for ($level = 10; $level > 1; $level--) {
            if ($xp >= $this->levelThresholds[$level]) {
                return $level;
            }
        }

        return 1; // Default to level 1
    }

    /**
     * Check if user has completed all beginner quests
     */
    private function checkAllBeginnerQuestsAchievement($user): void
    {
        // Achievement ID for "all beginner quests completed"
        $allBeginnerQuestsAchievementId = 5;

        // Check if user already has this achievement
        $existingAchievement = UserAchievement::where('user_id', $user->user_id)
            ->where('achievement_id', $allBeginnerQuestsAchievementId)
            ->first();

        if (!$existingAchievement) {
            // Get IDs of all beginner quests
            $beginnerQuestIds = Quest::where('type', 'Beginner')->pluck('quest_id')->toArray();

            // Get user's completed beginner quests
            $completedQuestIds = TakenQuest::where('user_id', $user->user_id)
                ->whereNotNull('submission')
                ->pluck('quest_id')
                ->toArray();

            // Check if user has completed all beginner quests
            $hasCompletedAllBeginnerQuests = count(array_intersect($beginnerQuestIds, $completedQuestIds)) === count($beginnerQuestIds);

            if ($hasCompletedAllBeginnerQuests) {
                Log::info("Unlocking 'all beginner quests' achievement for user {$user->name}");

                // Create the achievement record
                UserAchievement::create([
                    'user_id' => $user->user_id,
                    'achievement_id' => $allBeginnerQuestsAchievementId,
                    'status' => 'completed',
                    'created_at' => now()
                ]);
            }
        }
    }
}
