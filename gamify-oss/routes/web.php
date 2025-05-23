<?php

use App\Http\Controllers\AvatarFrameController;
use App\Http\Controllers\AchievementController;
use App\Http\Controllers\BadgeController;
use App\Http\Controllers\LeaderboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\QuestController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Updated welcome route to use the new Home component
Route::get('/', function () {
    return Inertia::render('Home', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Updated to use controller method
Route::get('/questboard', [QuestController::class, 'questBoard'])
    ->middleware(['auth', 'verified'])
    ->name('questboard');

Route::get('/beginnerquests', [QuestController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('beginnerquests');

Route::post('/quest/submit', [QuestController::class, 'submit'])
    ->middleware(['auth', 'verified'])
    ->name('quest.submit');

// New routes for team-based quest taking
Route::post('/quests/eligible-users', [QuestController::class, 'getEligibleUsers'])
    ->middleware(['auth', 'verified'])
    ->name('quests.eligible-users');

Route::post('/quests/take', [QuestController::class, 'takeQuest'])
    ->middleware(['auth', 'verified'])
    ->name('quests.take');

Route::get('/takenquests', [QuestController::class, 'communityTakenQuests'])
    ->middleware(['auth', 'verified'])
    ->name('takenquests');

Route::get('/questhistory', [QuestController::class, 'questHistory'])
    ->middleware(['auth', 'verified'])
    ->name('questhistory');

Route::get('/leaderboard', [LeaderboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('leaderboard');

Route::get('/achievements', [App\Http\Controllers\AchievementController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('achievements');

Route::post('/achievements/claim', [App\Http\Controllers\AchievementController::class, 'claim'])
    ->middleware(['auth', 'verified'])
    ->name('achievements.claim');

Route::get('/badges', [App\Http\Controllers\BadgeController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('badges');

// Admin only routes
Route::middleware(['auth', 'verified', \App\Http\Middleware\AdminMiddleware::class])->group(function () {
    Route::get('/quests/create', [QuestController::class, 'create'])->name('quests.create');
    Route::post('/quests', [QuestController::class, 'store'])->name('quests.store');

    // Admin receptionist routes
    Route::get('/receptionist', [QuestController::class, 'receptionist'])->name('receptionist');
    Route::post('/admin/quest/action', [QuestController::class, 'handleAdminAction'])->name('admin.quest.action');
});


// Modify these routes in web.php
Route::middleware('auth')->group(function () {
    // Profile routes
    Route::get('/profile/edit', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::get('/profile/{userId?}', [ProfileController::class, 'show'])->name('profile.show');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Avatar Frame Routes
    Route::get('/avatar-frames', [AvatarFrameController::class, 'index'])->name('avatar-frames.index');
    Route::put('/avatar-frames', [AvatarFrameController::class, 'update'])->name('avatar-frames.update');
});

// Admin routes for badge management
Route::middleware(['auth', 'verified', \App\Http\Middleware\AdminMiddleware::class])->group(function () {
    // Show badge award page
    Route::get('/admin/badges/award', [App\Http\Controllers\BadgeController::class, 'showAwardBadge'])
        ->name('admin.badges.award');

    // Process badge award
    Route::post('/admin/badges/award', [App\Http\Controllers\BadgeController::class, 'storeAwardBadge'])
        ->name('admin.badges.award.store');

    // API routes for fetching data
    Route::get('/admin/badges/list', [App\Http\Controllers\BadgeController::class, 'adminBadgesList'])
        ->name('admin.badges.list');

    Route::get('/admin/users/list', [App\Http\Controllers\BadgeController::class, 'adminUsersList'])
        ->name('admin.users.list');

    Route::delete('/quests/delete', [QuestController::class, 'deleteQuest'])->name('quests.delete');
});

require __DIR__ . '/auth.php';