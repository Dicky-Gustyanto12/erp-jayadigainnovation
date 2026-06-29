<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'invoice_code',
        'total',
        'status',
        'client_id',
        'project_id',
        'invoice_date'
    ];

    protected static function booted(): void
    {
        static::creating(function (Invoice $invoice)
        {
            $lastInvoice = Invoice::orderBy('id', 'desc')->first();

            $lastNumber = $lastInvoice ? intval(str_replace('INV', '', $lastInvoice->invoice_code)) : 0;

            $invoice->invoice_code = 'INV' . str_pad($lastNumber + 1, 3, '0', STR_PAD_LEFT);
        });
        
    }

    public function incomes() {
        return $this->hasMany(Income::class);
    }

    public function project() {
        return $this->belongsTo(Project::class);
    }

    public function client() {
        return $this->belongsTo(Client::class);     
    }
}
