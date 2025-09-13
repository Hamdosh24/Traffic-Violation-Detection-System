<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ViolationType extends Model
{
    use HasFactory, HasUuids;

    protected $primaryKey = 'v_type_id';

    public $incrementing = false;

    protected $keyType = 'string';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    // هذه هي الحقول الصحيحة التي نسمح بتعبئتها في جدول أنواع المخالفات
    protected $fillable = [
        'type_name',
        'key',
        'fine_amount',
    ];

    public function violations()
    {
        return $this->hasMany(Violation::class, 'v_type_id', 'v_type_id');
    }
}
