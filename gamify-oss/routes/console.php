<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();

Artisan::command('queue:work-empty', function () {
    $this->info('Starting the queue worker...');
    Artisan::call('queue:work', ['--stop-when-empty' => true]);
    $this->info('Queue worker stopped as queue is empty.');
})->purpose('Run the queue worker and stop when the queue is empty');