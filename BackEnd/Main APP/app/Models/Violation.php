<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Represents a single traffic violation record in the database.
 *
 * This model uses UUIDs for its primary key.
 *
 * @property string $v_id The unique identifier for the violation (UUID).
 * @property int $v_type_id The foreign key for the violation type.
 * @property string $camera_id The foreign key for the camera that recorded the violation (UUID).
 * @property string $plate_num The license plate number of the vehicle.
 * @property \Illuminate\Support\Carbon $timestamp The exact time the violation occurred.
 * @property-read \App\Models\ViolationType $violationType The associated violation type.
 * @property-read \App\Models\Camera $camera The camera that captured the violation.
 */
class Violation extends Model
{
    use HasFactory;
    use HasUuids; // This trait handles UUID generation and configuration.

    /**
     * The primary key for the model.
     *
     * @var string
     */
    protected $primaryKey = 'v_id';

    /**
     * The attributes that are mass assignable.
     *
     * Using $fillable is a security measure to prevent unintended data modification.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'v_type_id',
        'camera_id',
        'plate_num',
        'timestamp',
    ];

    /**
     * Defines the relationship to the ViolationType model.
     * A Violation belongs to one ViolationType.
     */
    public function violationType(): BelongsTo
    {
        return $this->belongsTo(ViolationType::class, 'v_type_id', 'v_type_id');
    }

    /**
     * Defines the relationship to the Camera model.
     * A Violation is recorded by one Camera.
     */
    public function camera(): BelongsTo
    {
        return $this->belongsTo(Camera::class, 'camera_id', 'camera_id');
    }
}
