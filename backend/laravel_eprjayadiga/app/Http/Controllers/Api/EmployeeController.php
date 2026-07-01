<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Employee;

class EmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $employees = Employee::query()->latest()->get();

        return response()->json([
            'success' => true,
            'message' => 'Data karyawan berhasil diambil',
            'data' => $employees
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'address' => 'required|string',
            'contact' => 'required|string',
            'email' => 'nullable|string|email|unique:employees,email',
            'department' => 'required|string',
        ]);

        $employee = Employee::create([
            'name' => $request->name,
            'address' => $request->address,
            'contact' => $request->contact,
            'email' => $request->email,
            'department' => $request->department,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Data karyawan baru berhasil ditambahkan',
            'data' => $employee
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $employee = Employee::findOrFail($id);

        return response()->json([
            'success' => true,
            'message' => 'Data karyawan berhasil ditampilkan',
            'data' => $employee
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $employee = Employee::findOrFail($id);

        $request->validate([
            'name' => 'required|string',
            'address' => 'required|string',
            'contact' => 'required|string',
            'email' => 'nullable|string|email|unique:employees,email,' . $employee->id,
            'department' => 'required|string',
        ]);

        $employee->update([
            'name' => $request->name,
            'address' => $request->address,
            'contact' => $request->contact,
            'email' => $request->email,
            'department' => $request->department,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Data karyawan berhasil diperbarui',
            'data' => $employee
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Employee::destroy($id);
        
        return response()->json([
            'success' => true,
            'message' => 'Data karyawan berhasil dihapus',
            'data' => null
        ], 200);
    }
}
