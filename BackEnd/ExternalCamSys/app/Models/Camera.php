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
        'ip_address',
        'status',
        'hls_path',
        'rtsp_url',
        'ai_enabled',
        'model',
        'installation_date',
        'description',
    ];

    protected $casts = [
        'ai_enabled' => 'boolean',
        'installation_date' => 'date',
    ];
}
