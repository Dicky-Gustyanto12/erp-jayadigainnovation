<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    use HasFactory;

    protected $fillable = [
        'attendance_date',
        'time_in',
        'time_out',
        'status',
        'employee_id'
    ];

    public function employee() {
        return $this->belongsTo(Employee::class);
    }
}
