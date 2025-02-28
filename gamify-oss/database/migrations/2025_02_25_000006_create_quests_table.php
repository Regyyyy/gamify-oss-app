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
        Schema::create('quests', function (Blueprint $table) {
            $table->id('quest_id');
            $table->string('title');
            $table->string('description', 1000);
            $table->string('type');
            $table->string('role')->nullable();
            $table->string('difficulty');
            $table->integer('xp_reward');
            $table->integer('proficiency_reward')->nullable();
            $table->string('status');
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('finished_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quests');
    }
};
