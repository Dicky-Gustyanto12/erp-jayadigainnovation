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
        Schema::table('invoice_items', function (Blueprint $table) {
            $table->string('math_operator')->nullable()->after('unit_price');
            $table->decimal('math_operand', 20, 2)->nullable()->after('math_operator');
        });

        Schema::table('purchase_order_items', function (Blueprint $table) {
            $table->string('math_operator')->nullable()->after('unit_price');
            $table->decimal('math_operand', 20, 2)->nullable()->after('math_operator');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('invoice_items', function (Blueprint $table) {
            $table->dropColumn(['math_operator', 'math_operand']);
        });

        Schema::table('purchase_order_items', function (Blueprint $table) {
            $table->dropColumn(['math_operator', 'math_operand']);
        });
    }
};
