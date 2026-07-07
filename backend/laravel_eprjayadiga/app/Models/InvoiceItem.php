<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InvoiceItem extends Model
{
    use HasFactory;

    // PASTIKAN item_type dan is_highlighted ADA DI SINI
    protected $fillable = [
        'invoice_id', 
        'item_type', 
        'description', 
        'qty', 
        'unit', 
        'unit_price', 
        'subtotal', 
        'is_highlighted'
    ];

    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }
}