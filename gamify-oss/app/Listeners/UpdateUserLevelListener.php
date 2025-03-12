<?php

namespace App\Listeners;

use App\Events\XpIncreasedEvent;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Log;

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

        // Log the event
        Log::info("XP increased for user", [
            'user_id' => $user->user_id,
            'user_name' => $user->name,
            'xp_amount' => $xpAmount,
            'source' => $source,
            'previous_xp' => $user->xp_point,
            'new_xp' => $user->xp_point + $xpAmount
        ]);

        // Update user's XP
        $user->xp_point += $xpAmount;
        
        // Determine appropriate level based on XP
        $newLevel = $this->determineLevel($user->xp_point);
        
        // Check if the user has leveled up
        if ($newLevel > $user->level) {
            Log::info("User leveled up", [
                'user_id' => $user->user_id,
                'user_name' => $user->name,
                'previous_level' => $user->level,
                'new_level' => $newLevel
            ]);
            
            $user->level = $newLevel;
            
            // Here you could dispatch another event if needed for level up notifications
        }
        
        // Save the updated user
        $user->save();
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