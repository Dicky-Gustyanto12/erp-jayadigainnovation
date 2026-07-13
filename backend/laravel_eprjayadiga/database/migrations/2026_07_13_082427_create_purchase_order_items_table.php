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
        Schema::create('purchase_order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('purchase_order_id')->constrained('purchase_orders')->onDelete('cascade');
            $table->string('item_type')->default('barang');
            $table->text('description')->nullable();
            $table->decimal('qty', 10, 2)->nullable();
            $table->string('unit')->nullable();
            $table->decimal('unit_price', 15, 2)->nullable();
            $table->decimal('subtotal', 15, 2)->nullable();
            $table->boolean('is_highlighted')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchase_order_items');
    }
};
