<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

/**
 * Represents a record of a car passing by a camera.
 *
 * This model is designed to be lightweight and does not use
 * the default created_at/updated_at timestamps.
 *
 * @property string $p_car_id The UUID primary key.
 * @property string $camera_id The ID of the camera that saw the car.
 * @property string $plate_num The car's plate number.
 * @property \Illuminate\Support\Carbon $timestamp The time of the sighting.
 * @property-read \App\Models\Camera $camera The associated Camera model.
 */
class PassingCar extends Model
{
    use HasFactory;

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = True;

    // --- Manual UUID Primary Key Configuration ---

    /**
     * The primary key for the model.
     *
     * @var string
     */
    protected $primaryKey = 'p_car_id';

    /**
     * Indicates if the model's ID is auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = false;

    /**
     * The data type of the primary key.
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
        'plate_num',
        'camera_id',
        'timestamp',
    ];

    /**
     * The "booted" method of the model.
     *
     * Automatically generates a UUID for the primary key when a new record is being created.
     * @return void
     */
    protected static function booted()
    {
        static::creating(function ($model) {
            // Ensure we don't overwrite an existing ID
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = Str::uuid();
            }
        });
    }

    /**
     * Defines the relationship: a PassingCar record BELONGS TO a Camera.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function camera()
    {
        return $this->belongsTo(Camera::class, 'camera_id', 'camera_id');
    }
}
