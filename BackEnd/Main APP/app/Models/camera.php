<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Camera extends Model
{
    // تأكد أن اسم الجدول مطابق لما في قاعدة البيانات
    protected $table = 'cameras';

    // المفتاح الأساسي
    protected $primaryKey = 'camera_id';

    // المفتاح ليس auto-increment
    public $incrementing = true;

    // نوع المفتاح الأساسي
    protected $keyType = 'int';

    // الحقول القابلة للتعبئة (تعديل حسب الحقول الموجودة لديك)
    protected $fillable = [
        'region',
        'governorate',
        'street',
        'coordinates',
        'rtsp_url',
        'hls_path',
        'status',
    ];

    // علاقة واحد-إلى-عدة مع جدول violations
    public function violations()
    {
        return $this->hasMany(Violation::class, 'camera_id', 'camera_id');
    }

    public function PassingCars()
    {
        return $this->hasMany(PassingCar::class, 'camera_id', 'camera_id');
    }    
    
    public function Accidents()
    {
        return $this->hasMany(Accident::class, 'camera_id', 'camera_id');
    }
}
