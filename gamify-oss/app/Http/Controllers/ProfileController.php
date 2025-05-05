<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Achievement;
use App\Models\UserAchievement;
use App\Models\Badge;
use App\Models\UserBadge;
use App\Models\UserProficiency;
use App\Models\Proficiency;
use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();
        
        // Only update specific fields
        $updateData = [];
        
        // Add name to update data if provided
        if ($request->has('name')) {
            $updateData['name'] = $request->name;
        }
        
        // Add email to update data if provided and different
        if ($request->has('email') && $request->email !== $user->email) {
            $updateData['email'] = $request->email;
        }
        
        // Handle avatar upload separately
        if ($request->hasFile('avatar')) {
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }
            
            $avatarPath = $request->file('avatar')->store('avatars', 'public');
            $updateData['avatar'] = $avatarPath;
        }
        
        // Use update method with only the specific fields
        User::where('user_id', $user->user_id)
            ->update($updateData);
        
        return back()->with('success', 'Profile updated successfully.');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }

    /**
     * Display the user's profile page
     */
    public function show($userId = null): Response
    {
        // If no user ID is provided, use the authenticated user
        if (!$userId) {
            $user = Auth::user();
        } else {
            $user = User::findOrFail($userId);
        }

        // Get user's achievements
        $userAchievements = UserAchievement::where('user_id', $user->user_id)
            ->where(function ($query) {
                $query->where('status', 'completed')
                    ->orWhere('status', 'claimed');
            })
            ->count();

        // Get total achievements count for percentage calculation
        $totalAchievements = Achievement::count();

        // Get user's badges
        $userBadges = UserBadge::with('badge')
            ->where('user_id', $user->user_id)
            ->get()
            ->map(function ($userBadge) {
                $badge = $userBadge->badge;
                // Get the badge image path
                $imagePaths = [
                    1 => '/images/badges/questioner-badge-gold.png',
                    2 => '/images/badges/helper-badge-gold.png',
                    3 => '/images/badges/level-badge.png',
                ];
                $imagePath = $imagePaths[$badge->badge_id] ?? '/images/badges/default-badge.png';

                return [
                    'id' => $badge->badge_id,
                    'name' => $badge->name,
                    'description' => $badge->description,
                    'image_path' => $imagePath,
                ];
            });

        // Get user's proficiencies
        $proficiencies = Proficiency::all();
        $userProficiencies = UserProficiency::where('user_id', $user->user_id)
            ->get()
            ->keyBy('proficiency_id');

        $enhancedProficiencies = $proficiencies->map(function ($proficiency) use ($userProficiencies) {
            $userProficiency = $userProficiencies->get($proficiency->proficiency_id);
            $points = $userProficiency ? $userProficiency->point : 0;

            return [
                'id' => $proficiency->proficiency_id,
                'name' => $proficiency->name,
                'points' => $points,
                'max_points' => 1000,
                'percentage' => min(100, ($points / 1000) * 100),
            ];
        });

        // Check if viewing own profile
        $isOwnProfile = Auth::id() == $user->user_id;

        // Get avatar frame path
        $avatarFramePath = \App\Http\Controllers\AvatarFrameController::getUserActiveFramePath($user);

        return Inertia::render('Profile/Profile', [
            'profileUser' => [
                'id' => $user->user_id,
                'name' => $user->name,
                'email' => $user->email,
                'avatar' => $user->avatar ? '/storage/' . $user->avatar : '/default-avatar.png',
                'avatar_frame_path' => $avatarFramePath,
                'level' => $user->level,
                'xp_point' => $user->xp_point,
                'role' => $user->role,
            ],
            'achievements' => [
                'count' => $userAchievements,
                'total' => $totalAchievements,
                'percentage' => $totalAchievements > 0 ? round(($userAchievements / $totalAchievements) * 100) : 0,
            ],
            'badges' => $userBadges,
            'proficiencies' => $enhancedProficiencies,
            'isOwnProfile' => $isOwnProfile,
        ]);
    }
}
