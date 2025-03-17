<?php

use App\Http\Controllers\AvatarFrameController;
use App\Http\Controllers\LeaderboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\QuestController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
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

Route::get('/questhistory', function () {
    return Inertia::render('Quests/QuestHistory');
})->middleware(['auth', 'verified'])->name('questhistory');

Route::get('/leaderboard', function () {
    return Inertia::render('Leaderboard');
})->middleware(['auth', 'verified'])->name('leaderboard');

Route::get('/achievements', [App\Http\Controllers\AchievementController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('achievements');

Route::post('/achievements/claim', [App\Http\Controllers\AchievementController::class, 'claim'])
    ->middleware(['auth', 'verified'])
    ->name('achievements.claim');

Route::get('/badges', function () {
    return Inertia::render('Badges');
})->middleware(['auth', 'verified'])->name('badges');

// Admin only routes
Route::middleware(['auth', 'verified', \App\Http\Middleware\AdminMiddleware::class])->group(function () {
    Route::get('/quests/create', [QuestController::class, 'create'])->name('quests.create');
    Route::post('/quests', [QuestController::class, 'store'])->name('quests.store');

    // Admin receptionist routes
    Route::get('/receptionist', [QuestController::class, 'receptionist'])->name('receptionist');
    Route::post('/admin/quest/action', [QuestController::class, 'handleAdminAction'])->name('admin.quest.action');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // Avatar Frame Routes
    Route::get('/avatar-frames', [AvatarFrameController::class, 'index'])->name('avatar-frames.index');
    Route::put('/avatar-frames', [AvatarFrameController::class, 'update'])->name('avatar-frames.update');
});

Route::get('/leaderboard', [LeaderboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('leaderboard');

require __DIR__ . '/auth.php';
