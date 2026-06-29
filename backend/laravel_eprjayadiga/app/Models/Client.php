<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_code',
        'company',
        'address',
        'contact',
        'email'
    ];

    protected static function booted(): void
    {
        static::creating(function (Client $client) {
            $lastClient = Client::orderBy('id', 'desc')->first();

            $lastNumber = $lastClient ? intval(str_replace('CL', '', $lastClient->client_code)) : 0;

            $client->client_code = 'CL'. str_pad($lastNumber + 1, 3, '0', STR_PAD_LEFT); 
        }); 
    }

    public function projects() {
        return $this->hasMany(Project::class);
    }

    public function invoices() {
        return $this->hasMany(Invoice::class);
    }
}
