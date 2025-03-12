<?php

namespace App\Listeners;

use App\Events\XpIncreasedEvent;
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
    }

    /**
     * Check if user should level up and update if needed
     */
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
            'calculated_level' => $newLevel
        ]);
        
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