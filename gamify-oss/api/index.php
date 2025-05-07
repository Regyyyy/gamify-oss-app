<?php
// Create required directories in /tmp
require __DIR__ . '/bootstrap.php';

// For Vercel, we need to set up a few things manually
require __DIR__ . '/../vendor/autoload.php';

// Set storage directory paths
$app = require_once __DIR__ . '/../bootstrap/app.php';

// Run Laravel
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$response = $kernel->handle(
    $request = Illuminate\Http\Request::capture()
);

$response->send();

$kernel->terminate($request, $response);