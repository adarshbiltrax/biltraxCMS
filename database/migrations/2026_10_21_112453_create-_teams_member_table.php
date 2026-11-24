<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // create Teams-member Table;
        Schema::create('team_members',function(Blueprint $table){
            $table->id();
            $table->string('firstname');
            $table->string('lastname');
            $table->string('designation');
            $table->text('bio');
            $table->string('qualification');
            $table->string('linkdin_url');
            $table->string('image');
            $table->smallInteger('status')->default(1)->comment('1:active,0:inactive');
            $table->timestamps(); 

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
