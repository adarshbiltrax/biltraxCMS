<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        /*
        |--------------------------------------------------------------------------
        | Website Projects
        |--------------------------------------------------------------------------
        */

        Schema::create('website_projects', function (Blueprint $table) {

            $table->id();

            // Biltrax project reference
            $table->unsignedBigInteger('source_project_id')
                ->nullable()
                ->index();

            // Main project information
            $table->string('project_name');

            $table->string('sector')
                ->nullable();

            $table->string('project_type')
                ->nullable();

            $table->string('project_stage')
                ->nullable();

            // Location
            $table->string('city')
                ->nullable();

            $table->string('state')
                ->nullable();

            $table->string('location')
                ->nullable();

            // Website description
            $table->text('summary')
                ->nullable();

            // Publishing
            $table->enum('status', [
                'draft',
                'published',
            ])->default('draft');

            $table->timestamp('published_at')
                ->nullable();

            $table->unsignedInteger('sort_order')
                ->default(0);

            $table->boolean('is_featured')
                ->default(false);

            $table->timestamps();


            /*
            |--------------------------------------------------------------------------
            | Indexes
            |--------------------------------------------------------------------------
            */

            $table->index('status');

            $table->index('sector');

            $table->index('project_stage');

            $table->index('state');

            $table->index('is_featured');

            $table->index([
                'status',
                'sort_order',
            ]);
        });


        /*
        |--------------------------------------------------------------------------
        | Careers
        |--------------------------------------------------------------------------
        */

        Schema::create('careers', function (Blueprint $table) {

            $table->id();

            // Basic job information
            $table->string('job_title');

            $table->string('department')
                ->nullable();

            $table->string('location')
                ->nullable();

            $table->string('employment_type')
                ->nullable();

            $table->string('experience')
                ->nullable();

            // Job content
            $table->text('short_description')
                ->nullable();

            $table->longText('job_description')
                ->nullable();

            $table->longText('responsibilities')
                ->nullable();

            $table->longText('requirements')
                ->nullable();

            // Application
            $table->string('application_email')
                ->nullable();

            $table->text('application_url')
                ->nullable();

            // Publishing
            $table->enum('status', [
                'draft',
                'published',
                'closed',
            ])->default('draft');

            $table->date('closing_date')
                ->nullable();

            $table->timestamp('published_at')
                ->nullable();

            $table->unsignedInteger('sort_order')
                ->default(0);

            $table->timestamps();


            /*
            |--------------------------------------------------------------------------
            | Indexes
            |--------------------------------------------------------------------------
            */

            $table->index('status');

            $table->index('department');

            $table->index('closing_date');

            $table->index([
                'status',
                'sort_order',
            ]);
        });


        /*
        |--------------------------------------------------------------------------
        | General / Demo Enquiries
        |--------------------------------------------------------------------------
        */

        Schema::create('enquiries', function (Blueprint $table) {

            $table->id();

            // Contact information
            $table->string('name');

            $table->string('company')
                ->nullable();

            $table->string('designation')
                ->nullable();

            $table->string('email');

            $table->string('phone')
                ->nullable();

            // Enquiry information
            $table->string('enquiry_type')
                ->nullable();

            $table->text('products')
                ->nullable();

            $table->text('sectors')
                ->nullable();

            $table->text('regions')
                ->nullable();

            $table->longText('message')
                ->nullable();

            // CMS workflow
            $table->enum('status', [
                'new',
                'reviewed',
                'contacted',
                'closed',
            ])->default('new');

            $table->timestamps();


            /*
            |--------------------------------------------------------------------------
            | Indexes
            |--------------------------------------------------------------------------
            */

            $table->index('status');

            $table->index('email');

            $table->index('created_at');
        });


        /*
        |--------------------------------------------------------------------------
        | Contact Enquiries
        |--------------------------------------------------------------------------
        */

        Schema::create('contact_messages', function (Blueprint $table) {

            $table->id();

            $table->string('name');

            $table->string('company')
                ->nullable();

            $table->string('email');

            $table->string('phone')
                ->nullable();

            $table->string('subject')
                ->nullable();

            $table->longText('message')
                ->nullable();

            // CMS workflow
            $table->enum('status', [
                'new',
                'read',
                'contacted',
                'closed',
            ])->default('new');

            $table->timestamps();


            /*
            |--------------------------------------------------------------------------
            | Indexes
            |--------------------------------------------------------------------------
            */

            $table->index('status');

            $table->index('email');

            $table->index('created_at');
        });
    }


    public function down(): void
    {
        /*
        |--------------------------------------------------------------------------
        | Reverse order
        |--------------------------------------------------------------------------
        */

        Schema::dropIfExists('contact_messages');

        Schema::dropIfExists('enquiries');

        Schema::dropIfExists('careers');

        Schema::dropIfExists('website_projects');
    }
};