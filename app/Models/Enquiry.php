<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Enquiry extends Model
{
    protected $table = 'enquiries';

    protected $fillable = [
        'name',
        'company',
        'designation',
        'email',
        'phone',
        'enquiry_type',
        'products',
        'sectors',
        'regions',
        'message',
        'status',
    ];
}