<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class ActivityLog extends Model
{
    protected $table = 'activity_logs';

    protected $primaryKey = 'log_id';

    protected $keyType = 'int';

    public $incrementing = true;

    public $timestamps = true;

    protected $fillable = [
        'user_id',
        'action_type',
        'description',
        'model_type',
        'model_id',
        'ip_address',
        'user_agent',
    ];

    public function user()
    {
        return $this->belongsTo(user::class, 'user_id', 'user_id');
    }

}
