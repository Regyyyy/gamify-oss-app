<?php

namespace App\Http\Controllers;

use App\Models\AvatarFrame;
use App\Models\User;
use App\Models\UserAvatarFrame;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LeaderboardController extends Controller
{
    /**
     * Display the leaderboard page with users sorted by XP points.
     */
    // In LeaderboardController.php
    public function index(): Response
    {
        // Get all users, ordered by XP points (descending)
        $users = User::select('user_id', 'name', 'avatar', 'xp_point', 'level')
            ->orderBy('xp_point', 'desc')
            ->get();

        // Enhance users with their active avatar frame
        foreach ($users as $user) {
            // Get the user's active frame
            $activeFrame = UserAvatarFrame::where('user_id', $user->user_id)
                ->where('is_used', true)
                ->first();

            if ($activeFrame) {
                $frame = AvatarFrame::find($activeFrame->avatar_frame_id);
                if ($frame) {
                    $user->avatar_frame_path = AvatarFrameController::getFrameImagePath($frame->name);
                } else {
                    $user->avatar_frame_path = '/images/avatar-frames/default-frame.svg';
                }
            } else {
                $user->avatar_frame_path = '/images/avatar-frames/default-frame.svg';
            }
        }

        return Inertia::render('Leaderboard', [
            'users' => $users,
        ]);
    }
}
