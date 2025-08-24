<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class PassingCar extends Model
{
    use HasFactory;

    // --- نفس الإعدادات الاحترافية لمفتاح UUID الأساسي ---
    protected $primaryKey = 'p_car_id';

    public $incrementing = false;

    protected $keyType = 'string';

    // الحقول التي نسمح بتعبئتها
    protected $fillable = [
        'plate_num',
        'camera_id',
        'timestamp',
    ];

    // دالة لإنشاء UUID تلقائيًا عند إنشاء سجل جديد
    protected static function booted()
    {
        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = Str::uuid();
            }
        });
    }

    public function camera()
    {
        return $this->belongsTo(Camera::class, 'camera_id', 'camera_id');
    }
}
