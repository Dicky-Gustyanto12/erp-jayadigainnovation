<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PurchaseOrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'purchase_order_id', 
        'item_type', 
        'description', 
        'qty', 
        'unit', 
        'unit_price',
        'math_operator',
        'math_operand', 
        'subtotal', 
        'is_highlighted'
    ];

    public function purchaseOrder()
    {
        return $this->belongsTo(PurchaseOrder::class);
    }
}
