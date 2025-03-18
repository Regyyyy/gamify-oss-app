<?php

namespace App\Http\Controllers;

use App\Models\Achievement;
use App\Models\AvatarFrame;
use App\Models\UserAchievement;
use App\Models\UserAvatarFrame;
use App\Events\AchievementClaimedEvent;
use App\Events\XpIncreasedEvent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AchievementController extends Controller
{
    /**
     * Display the user's achievements.
     */
    public function index()
    {
        $user = Auth::user();

        // Get all achievements with their avatar frames
        $achievements = Achievement::with('avatarFrame')->get();

        // Get the user's completed achievements
        $userAchievements = UserAchievement::where('user_id', $user->user_id)
            ->get()
            ->keyBy('achievement_id');

        // Enhance the achievements with completion status
        $enhancedAchievements = $achievements->map(function ($achievement) use ($userAchievements) {
            $userAchievement = $userAchievements->get($achievement->achievement_id);

            $isCompleted = false;
            $isClaimed = false;

            if ($userAchievement) {
                $isCompleted = true;
                $isClaimed = $userAchievement->status === 'claimed';
            }

            return [
                'id' => $achievement->achievement_id,
                'name' => $achievement->name,
                'description' => $achievement->description,
                'xp_reward' => $achievement->xp_reward,
                'extra_reward' => $achievement->avatar_frame_reward_id !== null,
                'avatar_frame_name' => $achievement->avatarFrame ? $achievement->avatarFrame->name : null,
                'is_completed' => $isCompleted,
                'is_claimed' => $isClaimed,
            ];
        });

        return Inertia::render('Achievements', [
            'userAchievements' => $enhancedAchievements,
        ]);
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
     * Handle claiming of achievements - status change only
     */
    public function claim(Request $request)
    {
        $request->validate([
            'achievement_id' => 'required|exists:achievements,achievement_id',
        ]);

        $user = Auth::user();
        $achievementId = $request->achievement_id;

        // Find the user achievement
        $userAchievement = UserAchievement::where('user_id', $user->user_id)
            ->where('achievement_id', $achievementId)
            ->where('status', 'completed')  // Only completed achievements can be claimed
            ->first();

        if (!$userAchievement) {
            return response()->json(['error' => 'Achievement not found or already claimed'], 404);
        }

        // Get the achievement details (for event dispatch)
        $achievement = Achievement::find($achievementId);
        if (!$achievement) {
            return redirect()->back()->with('error', 'Achievement not found');
        }

        try {
            // Update the status to claimed - this is the only change we're making
            $userAchievement->status = 'claimed';
            $userAchievement->save();

            // Log the successful claim
            \Illuminate\Support\Facades\Log::info("User {$user->name} claimed achievement: {$achievement->name}");

            // If the achievement has an avatar frame reward, give it to the user
            if ($achievement->avatar_frame_reward_id) {
                // Check if user already has this avatar frame
                $existingFrame = UserAvatarFrame::where('user_id', $user->user_id)
                    ->where('avatar_frame_id', $achievement->avatar_frame_reward_id)
                    ->first();

                if (!$existingFrame) {
                    // Create a new entry in user_avatar_frames
                    UserAvatarFrame::create([
                        'user_id' => $user->user_id,
                        'avatar_frame_id' => $achievement->avatar_frame_reward_id,
                        'is_used' => false, // Default to not used
                        'created_at' => now()
                    ]);

                    \Illuminate\Support\Facades\Log::info("Awarded avatar frame to user for achievement", [
                        'user_id' => $user->user_id,
                        'achievement_id' => $achievement->achievement_id,
                        'avatar_frame_id' => $achievement->avatar_frame_reward_id
                    ]);
                }
            }

            // Award XP for the achievement - DIRECTLY UPDATE DATABASE instead of dispatching event
            $xpReward = $achievement->xp_reward;
            $previousXp = $user->xp_point;
            $newXp = $previousXp + $xpReward;

            \Illuminate\Support\Facades\Log::info("Awarding XP for claimed achievement (direct DB update)", [
                'user_id' => $user->user_id,
                'achievement_id' => $achievement->achievement_id,
                'achievement_name' => $achievement->name,
                'xp_amount' => $xpReward,
                'previous_xp' => $previousXp,
                'new_xp' => $newXp
            ]);

            // Update XP directly in the database
            \Illuminate\Support\Facades\DB::table('users')
                ->where('user_id', $user->user_id)
                ->update(['xp_point' => $newXp]);

            // Refresh user and check for level up
            // Get fresh user data from the database
            $user = \App\Models\User::find($user->user_id);
            $currentLevel = $user->level;
            $newLevel = $this->determineLevel($newXp);

            if ($newLevel > $currentLevel) {
                \Illuminate\Support\Facades\DB::table('users')
                    ->where('user_id', $user->user_id)
                    ->update(['level' => $newLevel]);

                \Illuminate\Support\Facades\Log::info("User leveled up from claimed achievement", [
                    'user_id' => $user->user_id,
                    'previous_level' => $currentLevel,
                    'new_level' => $newLevel
                ]);
            }

            return redirect()->back()->with('success', 'Achievement claimed successfully!');
        } catch (\Exception $e) {
            // Log the error
            \Illuminate\Support\Facades\Log::error("Error claiming achievement: " . $e->getMessage());

            return redirect()->back()->with('error', 'Error claiming achievement. Please try again.');
        }
    }
}
