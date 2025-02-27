<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserAvatarFrame extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $primaryKey = 'user_avatar_frame_id';

    protected $fillable = [
        'user_id',
        'avatar_frame_id',
        'is_used',
        'created_at',
        'finished_at',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function avatarFrame()
    {
        return $this->belongsTo(AvatarFrame::class, 'avatar_frame_id', 'avatar_frame_id');
    }
}
