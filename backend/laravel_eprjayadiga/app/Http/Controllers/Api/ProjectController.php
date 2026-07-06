<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $projects = Project::with('client')->latest()->get();

        return response()->json([
            'success' => true,
            'message' => 'Data Project berhasil diambil',
            'data' => $projects
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // 1. Validasi Input (Termasuk Status & end_at dibuat nullable)
        $validated = $request->validate([
            'project_name' => 'required|string',
            'place'        => 'required|string',
            'deadline'     => 'required|date',
            'start_at'     => 'required|date',
            'end_at'       => 'nullable|date|after_or_equal:start_at', 
            'client_id'    => 'required|integer|exists:clients,id',
            'status'       => 'required|in:Perencanaan,Sedang Berjalan,Selesai,Batal'
        ]);

        // 2. Simpan Data (Jauh lebih bersih menggunakan $validated)
        // Catatan: project_code sudah otomatis dibuat oleh Model Project.php
        $project = Project::create($validated);
        
        return response()->json([
            'success' => true,
            'message' => 'Data Project baru berhasil ditambahkan',
            'data' => $project
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        // Menggunakan where()->first() agar aman mengembalikan JSON jika tidak ketemu
        $project = Project::with('client')->where('id', $id)->first();

        if (!$project) {
            return response()->json([
                'success' => false,
                'message' => 'Data Project tidak ditemukan',
                'data' => null
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Data Project berhasil diambil',
            'data' => $project
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $id)
    {
        $project = Project::where('id', $id)->first();

        if (!$project) {
            return response()->json([
                'success' => false,
                'message' => 'Data Project tidak ditemukan',
                'data' => null
            ], 404);
        }

        $validated = $request->validate([
            'project_name' => 'required|string',
            'place'        => 'required|string',
            'deadline'     => 'required|date',
            'start_at'     => 'required|date',
            'end_at'       => 'nullable|date|after_or_equal:start_at',
            'client_id'    => 'required|integer|exists:clients,id',
            'status'       => 'required|in:Perencanaan,Sedang Berjalan,Selesai,Batal'
        ]);
        
        $project->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Data Project berhasil diperbarui',
            'data' => $project
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        // Delete langsung dari Builder agar Intelephense tidak error
        $deleted = Project::where('id', $id)->delete();
    
        if ($deleted === 0) {
            return response()->json([
                'success' => false,
                'message' => 'Data Project tidak ditemukan',
                'data' => null
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Data Project berhasil dihapus',
            'data' => null
        ], 200);
    }
}