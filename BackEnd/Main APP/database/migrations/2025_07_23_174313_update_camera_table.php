<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cameras', function (Blueprint $table) {
            $table->string('region');
            $table->string('governorate');
            $table->string('street')->nullable();
            $table->string('coordinates')->nullable(); // يمكنك تخزينها كنص lat,long أو JSON

            // حذف عمود location
            $table->dropColumn('location');
        });
    }

    public function down(): void
    {
        Schema::table('cameras', function (Blueprint $table) {
            $table->string('location')->nullable();

            $table->dropColumn(['region', 'governorate', 'street', 'coordinates']);
        });
    }
};
