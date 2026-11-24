<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmailRecipientAddress extends Model
{
    protected $table = 'email_recipient_addresses';

    protected $fillable = [
        'type',
        'email',
        'status',
    ];

    protected $casts = [
        'status' => 'integer',
    ];

    public static function activeEmailsForType(string $type): array
    {
        return static::query()
            ->where('type', $type)
            ->where('status', 1)
            ->orderBy('id')
            ->pluck('email')
            ->map(fn ($email) => trim($email))
            ->filter()
            ->unique(fn ($email) => mb_strtolower($email))
            ->values()
            ->all();
    }
}