<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

/**
 * Represents an accident record in the database.
 *
 * This model manually handles UUID generation for its primary key.
 *
 * @property string $id The primary key (UUID) of the accident.
 * @property int $camera_id The ID of the camera that recorded the accident.
 * @property \Illuminate\Support\Carbon $timestamp The exact time the accident occurred.
 * @property string $status The current status of the accident (e.g., 'new', 'acknowledged').
 * @property int|null $claimed_by The ID of the user who acknowledged the accident.
 * @property \Illuminate\Support\Carbon|null $claimed_at The time the accident was acknowledged.
 * @property-read \App\Models\Camera $camera The associated Camera model.
 * @property-read \App\Models\User|null $claimer The user who claimed the accident.
 */
class Accident extends Model
{
    use HasFactory;

    // --- UUID Primary Key Configuration ---

    /**
     * Indicates if the model's ID is auto-incrementing.
     * Set to false because we are using non-sequential UUIDs.
     *
     * @var bool
     */
    public $incrementing = false;

    /**
     * The data type of the primary key.
     * Set to 'string' because a UUID is a string.
     *
     * @var string
     */
    protected $keyType = 'string';

    // --- Model Configuration ---

    /**
     * The attributes that are mass assignable.
     * This acts as a security whitelist for creating/updating records.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'camera_id',
        'timestamp',
        'status',
        'claimed_by',
        'claimed_at',
    ];

    /**
     * The attributes that should be cast to native types.
     * This ensures that timestamp fields are treated as powerful Carbon date objects.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'timestamp'  => 'datetime',
        'claimed_at' => 'datetime',
    ];

    /**
     * The "booted" method of the model.
     *
     * This method is used to hook into the model's lifecycle events. Here,
     * we're automatically generating a UUID for new records before they are created.
     */
    protected static function booted(): void
    {
        // This is a model event listener. It runs just before a new record is saved to the database.
        static::creating(function (self $model) {
            // Check if the primary key is already set to avoid overwriting it.
            if (empty($model->{$model->getKeyName()})) {
                // Generate a new version 4 UUID and assign it to the primary key.
                $model->{$model->getKeyName()} = (string) Str::uuid();
            }
        });
    }

    /**
     * Get the route key for the model.
     * Overriding this is often needed when not using 'id' as the primary lookup key in routes.
     *
     * @return string
     */
    public function getRouteKeyName(): string
    {
        // Explicitly state that the 'id' column should be used for Route Model Binding.
        return 'id';
    }


    // --- Relationships ---

    /**
     * Defines the relationship: an Accident BELONGS TO a Camera.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function camera(): BelongsTo
    {
        // Foreign key on this 'accidents' table: 'camera_id'
        // Owner key on the 'cameras' table: 'camera_id'
        return $this->belongsTo(Camera::class, 'camera_id', 'camera_id');
    }

    /**
     * Defines the relationship: an Accident can be claimed by (BELONGS TO) a User.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function claimer(): BelongsTo
    {
        // Foreign key on this 'accidents' table: 'claimed_by'
        // Owner key on the 'users' table: 'user_id'
        return $this->belongsTo(User::class, 'claimed_by', 'user_id');
    }
}
