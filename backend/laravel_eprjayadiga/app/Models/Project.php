<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_code',
        'project_name',
        'place',
        'deadline',
        'start_at',
        'end_at',
        'client_id',
        'status'
    ];

    protected static function booted(): void
    {
        static::creating(function (Project $project)
        {
            $lastProject = Project::orderBy('id', 'desc')->first();

            $lastNumber = $lastProject ? intval(str_replace('PJ', '', $lastProject->project_code)) : 0; 

            $project->project_code = 'PJ' . str_pad($lastNumber + 1, 3, '0', STR_PAD_LEFT);
        });
    }

    public function client() {
        return $this->belongsTo(Client::class);
    }

    public function invoices() {
        return $this->hasMany(Invoice::class);
    }

    public function tasks() {
        return $this->hasMany(Task::class);
    }

    public function employees() {
        return $this->belongsToMany(Employee::class, 'employee_project', 'project_id', 'employee_id')
                    ->withTimestamps();
    }
}
