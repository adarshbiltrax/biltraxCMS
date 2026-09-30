<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OpportunityEnquiry extends Model
{
    protected $table =
        'opportunities_enquiries';


    protected $fillable = [
        'career_id',
        'position_applied_for',
        'first_name',
        'last_name',
        'email',
        'mobile_number',
        'cv_link',
        'qualification',
        'experience_years',
        'message',
        'location_confirmed',
        'status',
    ];


    protected $casts = [
        'location_confirmed' =>
            'boolean',

        'experience_years' =>
            'decimal:2',
    ];


    public function career(): BelongsTo
    {
        return $this->belongsTo(
            Career::class
        );
    }


    public function getFullNameAttribute(): string
    {
        return trim(
            $this->first_name .
            ' ' .
            $this->last_name
        );
    }
}