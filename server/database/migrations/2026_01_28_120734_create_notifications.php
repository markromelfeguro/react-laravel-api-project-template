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
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            
            // Categorization
            $table->enum('type', ['sms', 'email', 'system'])->default('system');
            $table->string('subject')->nullable();
            $table->text('message');
            
            $table->json('data')->nullable();
            $table->string('action_url')->nullable();
            
            $table->boolean('is_read')->default(false);
            $table->enum('status', ['pending', 'sent', 'failed'])->default('sent');
            $table->timestamp('read_at')->nullable(); 
            $table->timestamp('sent_at')->useCurrent();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
