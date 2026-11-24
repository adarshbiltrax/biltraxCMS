<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EmailRecipientSettingSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('email_recipient_settings')->updateOrInsert(
            ['id' => 1],
            [
                'enquiry_to' => 'enquiry@biltrax.com',
                'careers_to' => 'careers@biltrax.com',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );
    }
}