<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Career extends Model
{
    protected $table = 'careers';

    protected $fillable = [
        'job_title',
        'department',
        'location',
        'employment_type',
        'experience',
        'short_description',
        'job_description',
        'responsibilities',
        'requirements',
        'application_email',
        'application_url',
        'status',
        'closing_date',
        'published_at',
        'sort_order',
    ];

    protected $casts = [
        'closing_date' => 'date',
        'published_at' => 'datetime',
        'sort_order' => 'integer',
    ];
}