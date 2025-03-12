<?php

namespace App\Events;

use App\Models\User;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class XpIncreasedEvent
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $user;
    public $xpAmount;
    public $source;

    /**
     * Create a new event instance.
     */
    public function __construct(User $user, int $xpAmount, string $source)
    {
        $this->user = $user;
        $this->xpAmount = $xpAmount;
        $this->source = $source;
    }
}