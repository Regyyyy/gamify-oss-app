<?php

namespace App\Providers;

use App\Events\QuestCompletedEvent;
use App\Events\XpIncreasedEvent;
use App\Events\AchievementClaimedEvent;
use App\Listeners\AchievementTrackerListener;
use App\Listeners\UpdateUserLevelListener;
use App\Listeners\AchievementRewardListener;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
        
        // Register event listeners for achievements
        Event::listen(
            QuestCompletedEvent::class,
            [AchievementTrackerListener::class, 'handle']
        );
        
        // Register event listeners for XP and level up
        Event::listen(
            \App\Events\XpIncreasedEvent::class,
            [\App\Listeners\UpdateUserLevelListener::class, 'handle']
        );
    }
}