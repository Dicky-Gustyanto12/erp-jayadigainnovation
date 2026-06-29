<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_code',
        'name',
        'address',
        'contact',
        'email',
        'department'
    ];

    protected static function booted(): void
    {
        static::creating(function (Employee $employee)
        {
            $lastEmployee = Project::orderBy('id', 'desc')->first();

            $lastNumber =  $lastEmployee ? intval(str_replace('EP', '',  $lastEmployee->employee_code)) : 0;

            $employee->employee_code = 'EP' . str_pad($lastNumber + 1, 3, '0', STR_PAD_LEFT);
        });
    }

    public function attendances() {
        return $this->hasMany(Attendance::class);
    }

    public function projects() {
        return $this->belongsToMany(Project::class, 'employee_project', 'employee_id', 'project_id')
                    ->withTimestamps();
    }
}
