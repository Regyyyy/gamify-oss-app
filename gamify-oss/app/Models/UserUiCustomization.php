<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserUiCustomization extends Model
{
    use HasFactory;

    protected $primaryKey = 'user_ui_customization_id';

    protected $fillable = [
        'user_id',
        'ui_customization_id',
        'is_enabled',
        'created_at',
        'finished_at',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function uiCustomization()
    {
        return $this->belongsTo(UICustomization::class, 'ui_customization_id', 'ui_customization_id');
    }
}
