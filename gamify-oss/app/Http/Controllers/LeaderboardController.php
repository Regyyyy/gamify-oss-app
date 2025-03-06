<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LeaderboardController extends Controller
{
    /**
     * Display the leaderboard page with users sorted by XP points.
     */
    public function index(): Response
    {
        // Get all users, ordered by XP points (descending)
        $users = User::select('user_id', 'name', 'avatar', 'xp_point', 'level')
            ->orderBy('xp_point', 'desc')
            ->get();
        
        return Inertia::render('Leaderboard', [
            'users' => $users,
        ]);
    }
}