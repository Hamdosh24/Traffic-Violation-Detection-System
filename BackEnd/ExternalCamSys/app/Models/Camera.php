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
        'key',
        'ip_address',
        'status',
        'model',
        'installation_date',
        'description',
    ];
}
