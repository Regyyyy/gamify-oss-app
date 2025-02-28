<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Quest extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $primaryKey = 'quest_id';

    protected $fillable = [
        'title',
        'type',
        'description',
        'role',
        'difficulty',
        'xp_reward',
        'proficiency_reward',
        'status',
        'created_at',
        'finished_at',
    ];

    protected function casts(): array
    {
        return [
            'xp_reward' => 'integer',
            'proficiency_reward' => 'integer',
            'created_at' => 'datetime',
            'finished_at' => 'datetime',
        ];
    }
}
