<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Accident extends Model
{
    use HasFactory;

    // --- إعدادات مفتاح UUID الأساسي ---
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    /**
     * الحقول التي نسمح بتعبئتها
     */
    protected $fillable = [
        'camera_id',
        'timestamp',
        'status',
    ];

    /**
     * دالة لإنشاء UUID تلقائيًا عند إنشاء سجل جديد
     */
    protected static function booted()
    {
        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = Str::uuid();
            }
        });
    }
}