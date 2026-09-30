<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create(
            'opportunities_enquiries',
            function (Blueprint $table) {

                $table->id();

                $table->foreignId('career_id')
                    ->nullable()
                    ->constrained('careers')
                    ->nullOnDelete();

                $table->string(
                    'position_applied_for'
                )->nullable();

                $table->string('first_name');

                $table->string('last_name');

                $table->string('email');

                $table->string(
                    'mobile_number',
                    30
                );

                $table->string(
                    'cv_link',
                    2048
                );

                $table->string(
                    'qualification'
                );

                $table->decimal(
                    'experience_years',
                    5,
                    2
                );

                $table->text(
                    'message'
                )->nullable();

                $table->boolean(
                    'location_confirmed'
                )->default(false);

                $table->string(
                    'status',
                    30
                )->default('new');

                $table->timestamps();

                $table->index('status');
                $table->index('email');
                $table->index('created_at');
            }
        );
    }


    public function down(): void
    {
        Schema::dropIfExists(
            'opportunities_enquiries'
        );
    }
};