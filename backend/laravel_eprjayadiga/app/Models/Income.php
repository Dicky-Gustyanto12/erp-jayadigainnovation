<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Income extends Model
{
    use HasFactory;

    protected $fillable = [
        'income_date',
        'income_from',
        'income_amount',
        'income_category',
        'invoice_id'
    ];

    public function invoice() {
        return $this->belongsTo(Invoice::class);
    }
}
