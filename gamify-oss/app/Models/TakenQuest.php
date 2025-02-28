<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TakenQuest extends Model
{
    use HasFactory;

    protected $primaryKey = 'taken_quest_id';

    protected $fillable = [
        'quest_id',
        'user_id',
        'submission'
    ];

    public function quest()
    {
        return $this->belongsTo(Quest::class, 'quest_id', 'quest_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
}
