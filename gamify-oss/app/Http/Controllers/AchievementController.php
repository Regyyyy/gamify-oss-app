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

            // Award XP for the achievement
            $xpReward = $achievement->xp_reward;
            \Illuminate\Support\Facades\Log::info("Awarding XP for claimed achievement", [
                'user_id' => $user->user_id,
                'achievement_id' => $achievement->achievement_id,
                'achievement_name' => $achievement->name,
                'xp_amount' => $xpReward
            ]);

            // Dispatch XP increased event with the achievement reward
            event(new XpIncreasedEvent($user, $xpReward, 'achievement_claimed'));

            return redirect()->back()->with('success', 'Achievement claimed successfully!');
        } catch (\Exception $e) {
            // Log the error
            \Illuminate\Support\Facades\Log::error("Error claiming achievement: " . $e->getMessage());

            return redirect()->back()->with('error', 'Error claiming achievement. Please try again.');
        }
    }
}
