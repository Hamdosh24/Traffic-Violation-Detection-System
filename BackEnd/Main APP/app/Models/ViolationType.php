<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Represents a type of violation, such as "speeding" or "illegal parking".
 *
 * This model defines the properties of a violation type, including its name,
 * a unique key, and the associated fine amount.
 *
 * @property string $v_type_id The primary key for the violation type (UUID).
 * @property string $type_name The human-readable name of the violation (e.g., "Speeding").
 * @property string $key A unique programmatic key (e.g., "SPEEDING_VIOLATION").
 * @property float $fine_amount The fine associated with this violation type.
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Violation[] $violations The collection of all violations of this type.
 */
class ViolationType extends Model
{
    use HasFactory;
    use HasUuids; // This trait handles UUID generation and configuration.

    /**
     * The primary key for the model.
     *
     * @var string
     */
    protected $primaryKey = 'v_type_id';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'type_name',
        'key',
        'fine_amount',
    ];

    /**
     * Get all the violations associated with this violation type.
     * A ViolationType can have many Violations.
     */
    public function violations(): HasMany
    {
        return $this->hasMany(Violation::class, 'v_type_id', 'v_type_id');
    }
}
