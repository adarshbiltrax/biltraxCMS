<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WebsiteProject extends Model
{
    protected $table = 'website_projects';

    protected $fillable = [
        'source_project_id',
        'project_name',
        'sector',
        'project_type',
        'project_stage',
        'city',
        'state',
        'location',
        'summary',
        'status',
        'published_at',
        'sort_order',
        'is_featured',
    ];

    protected $casts = [
        'source_project_id' => 'integer',
        'published_at' => 'datetime',
        'sort_order' => 'integer',
        'is_featured' => 'boolean',
    ];
}