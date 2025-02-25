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
        Schema::create('user_ui_customizations', function (Blueprint $table) {
            $table->id('user_ui_customization_id');
            $table->foreignId('user_id')->constrained('users', 'user_id')->cascadeOnDelete();
            $table->foreignId('ui_customization_id')->constrained('ui_customizations', 'ui_customization_id')->cascadeOnDelete();
            $table->boolean('is_enabled');
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('finished_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_ui_customizations');
    }
};
