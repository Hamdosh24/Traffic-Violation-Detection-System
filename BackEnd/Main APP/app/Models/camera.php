<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Camera extends Model
{
    protected $table = 'cameras';

    protected $primaryKey = 'camera_id';

    public $incrementing = true;

    protected $keyType = 'int';

    protected $fillable = [
        'region',
        'governorate',
        'street',
        'coordinates',
        'rtsp_url',
        'hls_path',
        'status',
        'external_id',
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
