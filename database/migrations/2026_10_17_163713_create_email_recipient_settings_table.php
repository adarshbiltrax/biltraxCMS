<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('email_recipient_settings', function (Blueprint $table) {
            $table->id();
            $table->string('enquiry_to')->default('enquiry@biltrax.com');
            $table->string('careers_to')->default('careers@biltrax.com');
            $table->smallInteger('status')->default(1)->comment('1:active,0:inactive');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('email_recipient_settings');
    }
};