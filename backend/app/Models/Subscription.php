<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'plan_id',
        'start_date',
        'end_date',
        'status',
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
    ];

    protected $appends = ['status'];

    /**
     * Get the dynamic status of the subscription.
     */
    public function getStatusAttribute($value)
    {
        // Try to handle both raw value from DB and the value passed to accessor
        $currentStatus = $value ?? $this->attributes['status'] ?? 'active';
        
        if ($currentStatus === 'active' && $this->end_date && $this->end_date->isPast()) {
            return 'expired';
        }
        return $currentStatus;
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function plan()
    {
        return $this->belongsTo(Plan::class);
    }
}
