<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Violation extends Model
{
    use HasFactory, HasUuids;

    /**
     * The primary key for the model.
     *
     * @var string
     */
    protected $primaryKey = 'v_id';

    /**
     * Indicates if the IDs are auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = false;

    /**
     * The "type" of the primary key ID.
     *
     * @var string
     */
    protected $keyType = 'string';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'v_type_id',
        'camera_id',
        'plate_num',
        'timestamp',
    ];

    /**
     * Get the type of the violation.
     */
    public function violationType()
    {
        return $this->belongsTo(ViolationType::class, 'v_type_id', 'v_type_id');
    }

    
    public function camera()
    {
        return $this->belongsTo(Camera::class, 'camera_id', 'camera_id');
    }

}