<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Accident extends Model
{
    use HasFactory;

    // المفتاح الأساسي
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
        'claimed_by',
        'claimed_at',
    ];

    /**
     * تحويل الحقول
     */
    protected $casts = [
        'claimed_at' => 'datetime',
    ];

    /**
     * إنشاء UUID تلقائياً عند إنشاء سجل جديد
     */
    protected static function booted()
    {
        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = (string) Str::uuid();
            }
        });
    }

    /**
     * تفعيل Route Model Binding باستخدام UUID
     */
    public function getRouteKeyName()
    {
        return 'id';
    }

    /**
     * العلاقة مع الكاميرا
     */
    public function camera()
    {
        return $this->belongsTo(Camera::class, 'camera_id', 'camera_id');
    }

    /**
     * علاقة مع الموظف الذي تبنى الحادث
     */
    public function claimer()
    {
        return $this->belongsTo(User::class, 'claimed_by', 'user_id');
    }
}
