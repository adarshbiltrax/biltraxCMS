<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        $tableAlreadyExists = Schema::hasTable('email_recipient_addresses');

        // Existing installations may have created this table outside Laravel's
        // migrations using MyISAM, which does not support transactional saves.
        if ($tableAlreadyExists && DB::connection()->getDriverName() === 'mysql') {
            DB::statement('ALTER TABLE email_recipient_addresses ENGINE=InnoDB');
        }

        if (!$tableAlreadyExists) {
            Schema::create('email_recipient_addresses', function (Blueprint $table) {
                $table->id();
                $table->string('type', 20); // enquiry or career
                $table->string('email', 150);
                $table->smallInteger('status')->default(1)->comment('1:active,0:inactive');
                $table->timestamps();

                $table->unique(['type', 'email']);
            });
        } else {
            // The legacy manually-created table used varchar(255); constrain it
            // to the same width as newly-created tables so MySQL can index it.
            Schema::table('email_recipient_addresses', function (Blueprint $table) {
                $table->string('email', 150)->change();
            });

            $indexExists = collect(Schema::getIndexes('email_recipient_addresses'))
                ->contains(fn (array $index) => $index['name'] === 'email_recipient_addresses_type_email_unique');

            if (!$indexExists) {
                Schema::table('email_recipient_addresses', function (Blueprint $table) {
                    $table->unique(['type', 'email']);
                });
            }
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('email_recipient_addresses');
    }
};