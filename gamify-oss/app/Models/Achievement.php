<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Achievement extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $primaryKey = 'achievement_id';

    protected $fillable = [
        'name',
        'description',
        'xp_reward',
        'avatar_frame_reward_id',
    ];

    public function avatarFrame()
    {
        return $this->belongsTo(AvatarFrame::class, 'avatar_frame_reward_id', 'avatar_frame_id');
    }
}
