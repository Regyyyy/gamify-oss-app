<?php

use App\Http\Controllers\ProfileController;
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

Route::get('/questboard', function () {
    return Inertia::render('Quests/QuestBoard');
})->middleware(['auth', 'verified'])->name('questboard');

Route::get('/beginnerquests', function () {
    return Inertia::render('Quests/BeginnerQuests');
})->middleware(['auth', 'verified'])->name('beginnerquests');

Route::get('/takenquests', function () {
    return Inertia::render('Quests/TakenQuests');
})->middleware(['auth', 'verified'])->name('takenquests');

Route::get('/questhistory', function () {
    return Inertia::render('Quests/QuestHistory');
})->middleware(['auth', 'verified'])->name('questhistory');

Route::get('/leaderboard', function () {
    return Inertia::render('Leaderboard');
})->middleware(['auth', 'verified'])->name('leaderboard');

Route::get('/achievements', function () {
    return Inertia::render('Achievements');
})->middleware(['auth', 'verified'])->name('achievements');

Route::get('/badges', function () {
    return Inertia::render('Badges');
})->middleware(['auth', 'verified'])->name('badges');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
