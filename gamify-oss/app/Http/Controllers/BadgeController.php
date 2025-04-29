<?php

namespace App\Http\Controllers;

use App\Models\Badge;
use App\Models\User;
use App\Models\UserBadge;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class BadgeController extends Controller
{
    /**
     * Display the badges page with all badges and their unlock status.
     */
    public function index(): Response
    {
        $user = Auth::user();

        // Get all badges
        $badges = Badge::all();

        // Get the user's unlocked badges
        $unlockedBadges = UserBadge::where('user_id', $user->user_id)
            ->pluck('badge_id')
            ->toArray();

        // Enhance badges with unlock status for the current user
        $enhancedBadges = $badges->map(function ($badge) use ($unlockedBadges) {
            return [
                'id' => $badge->badge_id,
                'name' => $badge->name,
                'description' => $badge->description,
                'image_path' => $this->getBadgeImagePath($badge->badge_id),
                'is_unlocked' => in_array($badge->badge_id, $unlockedBadges),
            ];
        });

        return Inertia::render('Badges', [
            'badges' => $enhancedBadges,
        ]);
    }

    /**
     * Get the image path for a badge based on its ID.
     */
    private function getBadgeImagePath(int $badgeId): string
    {
        $imagePaths = [
            1 => '/images/badges/questioner-badge-gold.png',
            2 => '/images/badges/helper-badge-gold.png',
            3 => '/images/badges/level-badge.png',
        ];

        return $imagePaths[$badgeId] ?? '/images/badges/default-badge.png';
    }

    /**
     * Show the admin page for awarding badges.
     */
    public function showAwardBadge(): Response
    {
        // Ensure only admins can access this method
        if (Auth::user()->role !== 'admin') {
            // Use Inertia::render instead of redirect for the error response
            return Inertia::render('Badges', [
                'badges' => $this->getUserBadgesWithStatus(),
                'error' => 'Unauthorized action. Admin access required.'
            ]);
        }

        return Inertia::render('Admin/RewardBadge');
    }

    /**
     * Get user badges with unlock status for the current user.
     * Helper method to reduce code duplication.
     */
    private function getUserBadgesWithStatus()
    {
        $user = Auth::user();
        $badges = Badge::all();
        $unlockedBadges = UserBadge::where('user_id', $user->user_id)
            ->pluck('badge_id')
            ->toArray();

        return $badges->map(function ($badge) use ($unlockedBadges) {
            return [
                'id' => $badge->badge_id,
                'name' => $badge->name,
                'description' => $badge->description,
                'image_path' => $this->getBadgeImagePath($badge->badge_id),
                'is_unlocked' => in_array($badge->badge_id, $unlockedBadges),
            ];
        });
    }

    /**
     * Process the badge award from admin.
     */
    public function storeAwardBadge(Request $request)
    {
        // Ensure only admins can access this method
        if (Auth::user()->role !== 'admin') {
            return Inertia::render('Badges', [
                'badges' => $this->getUserBadgesWithStatus(),
                'error' => 'Unauthorized action. Admin access required.'
            ]);
        }

        $validated = $request->validate([
            'user_id' => 'required|exists:users,user_id',
            'badge_id' => 'required|exists:badges,badge_id',
        ]);

        // Check if the user already has this badge
        $existingBadge = UserBadge::where('user_id', $validated['user_id'])
            ->where('badge_id', $validated['badge_id'])
            ->first();

        if ($existingBadge) {
            return back()->withErrors(['badge_exists' => 'This user already has this badge.']);
        }

        // Award the badge
        UserBadge::create([
            'user_id' => $validated['user_id'],
            'badge_id' => $validated['badge_id'],
            'created_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Badge awarded successfully!');
    }

    /**
     * Get list of all badges for admin purposes.
     */
    public function adminBadgesList()
    {
        // Ensure only admins can access this method
        if (Auth::user()->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized action.'], 403);
        }

        $badges = Badge::all();
        return response()->json(['badges' => $badges]);
    }

    /**
     * Get list of all users for admin purposes.
     */
    public function adminUsersList()
    {
        // Ensure only admins can access this method
        if (Auth::user()->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized action.'], 403);
        }

        $users = User::select('user_id', 'name', 'avatar', 'level', 'xp_point')
            ->orderBy('name')
            ->get();
            
        return response()->json(['users' => $users]);
    }
}