<?php

namespace App\Listeners;

use App\Events\XpIncreasedEvent;
use App\Models\UserAchievement;
use App\Models\Achievement;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class UpdateUserLevelListener implements ShouldQueue
{
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
     * Handle the event.
     */
    public function handle(XpIncreasedEvent $event): void
    {
        $user = $event->user;
        $xpAmount = $event->xpAmount;
        $source = $event->source;

        // Log the received event
        Log::info("XP increased event received", [
            'user_id' => $user->user_id,
            'user_name' => $user->name,
            'xp_amount' => $xpAmount,
            'source' => $source
        ]);

        // Handle different sources appropriately
        switch ($source) {
            // For events that already updated XP directly in DB
            case 'beginner_quest_direct':
                // No XP update needed, just check and update level if needed
                $this->checkAndUpdateLevel($user);
                break;

            // For advanced quests awarded by admin
            case 'advanced_quest':
                // Need to update XP and check level
                $previousXp = $user->xp_point;
                $newXp = $previousXp + $xpAmount;

                // Update database directly
                DB::table('users')
                    ->where('user_id', $user->user_id)
                    ->update(['xp_point' => $newXp]);

                Log::info("XP updated in DB for advanced quest", [
                    'user_id' => $user->user_id,
                    'previous_xp' => $previousXp,
                    'new_xp' => $newXp,
                    'difference' => $xpAmount
                ]);

                // Reload user with updated XP to check level
                $user->refresh();
                $this->checkAndUpdateLevel($user);
                break;

            // For claimed achievements
            case 'achievement_claimed':
                // Need to update XP and check level
                $previousXp = $user->xp_point;
                $newXp = $previousXp + $xpAmount;

                // Update database directly
                DB::table('users')
                    ->where('user_id', $user->user_id)
                    ->update(['xp_point' => $newXp]);

                Log::info("XP updated in DB for claimed achievement", [
                    'user_id' => $user->user_id,
                    'previous_xp' => $previousXp,
                    'new_xp' => $newXp,
                    'difference' => $xpAmount
                ]);

                // Reload user with updated XP to check level
                $user->refresh();
                $this->checkAndUpdateLevel($user);
                break;

            // Unknown source - log warning but still check level
            default:
                Log::warning("Unknown XP source received", [
                    'source' => $source,
                    'user_id' => $user->user_id
                ]);
                $this->checkAndUpdateLevel($user);
                break;
        }

        // Inside the handle method in UpdateUserLevelListener.php
        // Add this after the level up check

        // Check for leaderboard achievements if the user's XP has changed
        if ($xpAmount > 0 || $source === 'beginner_quest_direct' || $source === 'achievement_claimed') {
            try {
                // Create a new instance of AchievementTrackerListener to use its methods
                $achievementTracker = new \App\Listeners\AchievementTrackerListener();

                // Call method to check leaderboard position and award achievements
                $achievementTracker->checkLeaderboardAchievements($user);

                Log::info("Leaderboard achievements check completed after XP change", [
                    'user_id' => $user->user_id,
                    'user_name' => $user->name,
                    'source' => $source
                ]);
            } catch (\Exception $e) {
                Log::error("Error checking leaderboard achievements", [
                    'user_id' => $user->user_id,
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);
            }
        }
    }

    private function checkAndUpdateLevel($user): void
    {
        // Get current XP and level
        $currentXp = $user->xp_point;
        $currentLevel = $user->level;

        // Determine appropriate level based on XP
        $newLevel = $this->determineLevel($currentXp);

        // Log level check
        Log::info("Checking level for user", [
            'user_id' => $user->user_id,
            'current_xp' => $currentXp,
            'current_level' => $currentLevel,
            'calculated_level' => $newLevel,
            'will_trigger_level5' => ($newLevel >= 5 && $currentLevel < 5)
        ]);

        // Store if level 5 should be triggered
        $shouldTriggerLevel5 = ($newLevel >= 5 && $currentLevel < 5);

        // Only update if level has increased
        if ($newLevel > $currentLevel) {
            // Update level directly in database
            DB::table('users')
                ->where('user_id', $user->user_id)
                ->update(['level' => $newLevel]);

            Log::info("User leveled up", [
                'user_id' => $user->user_id,
                'user_name' => $user->name,
                'from_level' => $currentLevel,
                'to_level' => $newLevel,
                'current_xp' => $currentXp
            ]);

            // Check for level 5 achievement using the stored flag
            if ($shouldTriggerLevel5) {
                // Important: Refresh the user object to make sure it has the updated level
                $user->refresh();
                Log::info("Level 5 condition is TRUE, calling unlockLevel5Achievement");
                $this->unlockLevel5Achievement($user);
            } else {
                Log::info("Level 5 condition is FALSE, not unlocking achievement");
            }
        }
    }

    private function unlockLevel5Achievement($user): void
    {
        try {
            // Achievement ID 7 is for reaching level 5
            $achievementId = 7;

            // Check if user already has this achievement
            $existingAchievement = \App\Models\UserAchievement::where('user_id', $user->user_id)
                ->where('achievement_id', $achievementId)
                ->first();

            if (!$existingAchievement) {
                // Verify the achievement exists
                $achievement = \App\Models\Achievement::find($achievementId);

                if (!$achievement) {
                    Log::error("Cannot unlock level 5 achievement - achievement ID {$achievementId} not found");
                    return;
                }

                Log::info("Unlocking 'Reach level 5' achievement for user {$user->name}", [
                    'user_id' => $user->user_id,
                    'achievement_id' => $achievementId,
                    'achievement_name' => $achievement->name
                ]);

                // Create the achievement record with "completed" status
                \App\Models\UserAchievement::create([
                    'user_id' => $user->user_id,
                    'achievement_id' => $achievementId,
                    'status' => 'completed',
                    'created_at' => now()
                ]);

                Log::info("Level 5 achievement successfully created for user {$user->name}");
            } else {
                Log::info("User {$user->name} already has the level 5 achievement");
            }
        } catch (\Exception $e) {
            Log::error("Error unlocking level 5 achievement", [
                'user_id' => $user->user_id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }
    }

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
}
