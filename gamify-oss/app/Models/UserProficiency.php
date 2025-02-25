<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserProficiency extends Model
{
    use HasFactory;

    protected $primaryKey = 'user_proficiency_id';

    protected $fillable = [
        'user_id',
        'proficiency_id',
        'point',
        'created_at',
        'finished_at',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function proficiency()
    {
        return $this->belongsTo(Proficiency::class, 'proficiency_id', 'proficiency_id');
    }
}
