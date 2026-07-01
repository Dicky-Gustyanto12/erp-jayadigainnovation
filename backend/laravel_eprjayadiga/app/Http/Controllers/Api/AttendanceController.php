<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $attendances = Attendance::query()->latest()->get();

        return response()->json([
            'success' => true,
            'message' => 'Data Attendance berhasil diambil',
            'data' => $attendances
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'attendance_date' => 'required|date',
            'time_in' => 'required|date',
            'time_out' => 'required|date|after_or_equal:time_in',
            'status' => 'required|string',
            'employee_id' => 'required|integer|exists:employees,id'
        ]);

        $attendance = Attendance::create([
            'attendance_date' => $request->attendance_date,
            'time_in' => $request->time_in,
            'time_out' => $request->time_out,
            'status' => $request->status,
            'employee_id' => $request->employee_id
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Data Attendance baru berhasil ditambahkan',
            'data' => $attendance
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $attendance = Attendance::findOrFail($id);

        return response()->json([
            'success' => true,
            'message' => 'Data Attendance berhasil diambil',
            'data' => $attendance
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $attendance = Attendance::findOrFail($id);

         $request->validate([
            'attendance_date' => 'required|date',
            'time_in' => 'required|date',
            'time_out' => 'required|date|after_or_equal:time_in',
            'status' => 'required|string',
            'employee_id' => 'required|integer|exists:employees,id'
        ]);

        $attendance->update([
            'attendance_date' => $request->attendance_date,
            'time_in' => $request->time_in,
            'time_out' => $request->time_out,
            'status' => $request->status,
            'employee_id' => $request->employee_id
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Data Attendance baru berhasil diperbarui',
            'data' => $attendance
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Attendance::destroy($id);

        return response()->json([
            'success' => true,
            'message' => 'Data Attendance berhasil dihapus',
            'data' => null
        ], 200);
    }
}
