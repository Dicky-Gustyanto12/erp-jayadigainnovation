<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PurchaseOrder extends Model
{
    use HasFactory;

    protected $fillable = [
        'po_code',
        'client_id',
        'project_id',
        'total',
        'po_date',
        'due_date',
        'status',
    ];

    protected static function booted(): void
    {
        static::creating(function (PurchaseOrder $po)
        {
            $lastPO = PurchaseOrder::orderBy('id', 'desc')->first();

            $lastNumber = $lastPO ? intval(str_replace('PO', '', $lastPO->po_code)) : 0;

            $po->po_code = 'PO' . str_pad($lastNumber + 1, 3, '0', STR_PAD_LEFT);
        });
    }

    public function project() {
        return $this->belongsTo(Project::class);
    }

    public function client() {
        return $this->belongsTo(Client::class);     
    }

    public function items() {
        return $this->hasMany(PurchaseOrderItem::class);
    }

    public function invoices() {
        return $this->hasMany(Invoice::class);
    }
}
