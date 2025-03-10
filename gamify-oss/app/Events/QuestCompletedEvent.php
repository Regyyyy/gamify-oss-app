<?php

namespace App\Events;

use App\Models\Quest;
use App\Models\User;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class QuestCompletedEvent
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $user;
    public $quest;

    /**
     * Create a new event instance.
     */
    public function __construct(User $user, Quest $quest)
    {
        $this->user = $user;
        $this->quest = $quest;
    }
}