<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('schedule_exceptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('schedule_id')->constrained()->cascadeOnDelete();
            $table->date('date')->index();
            $table->string('type', 20);
            $table->string('note')->nullable();
            $table->time('new_start_time')->nullable();
            $table->time('new_end_time')->nullable();
            $table->string('new_room')->nullable();
            $table->timestamps();

            $table->unique(['schedule_id', 'date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('schedule_exceptions');
    }
};
