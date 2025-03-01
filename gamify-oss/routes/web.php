<?php

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

Route::get('/receptionist', function () {
    return Inertia::render('Admin/Receptionist');
})->middleware(['auth', 'verified'])->name('receptionist');

// Admin only routes
Route::middleware(['auth', 'verified', \App\Http\Middleware\AdminMiddleware::class])->group(function () {
    Route::get('/quests/create', [QuestController::class, 'create'])->name('quests.create');
    Route::post('/quests', [QuestController::class, 'store'])->name('quests.store');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';