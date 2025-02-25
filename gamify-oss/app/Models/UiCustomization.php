<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UiCustomization extends Model
{
    use HasFactory;

    protected $primaryKey = 'ui_customization_id';

    protected $fillable = [
        'name',
    ];
}
