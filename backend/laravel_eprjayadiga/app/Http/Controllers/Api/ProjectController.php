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
        $projects = Project::query()->latest()->get();

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

        $request->validate([
            'project_name' => 'required|string',
            'place' => 'required|string',
            'deadline' => 'required|date',
            'start_at' => 'required|date',
            'end_at' => 'required|date|after_or_equal:start_at',
            'client_id' => 'required|integer|exists:clients,id'
        ]);

        $project = Project::create([
            'project_name' => $request->project_name,
            'place' => $request->place,
            'deadline' => $request->deadline,
            'start_at' => $request->start_at,
            'end_at' => $request->end_at,
            'client_id' => $request->client_id
        ]);
        
        return response()->json([
            'success' => true,
            'message' => 'Data Project baru berhasil ditambahkan',
            'data' => $project
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $project = Project::findOrFail($id);

        return response()->json([
                'success' => true,
                'message' => 'Data Project berhasil diambil',
                'data' => $project
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $project = Project::query()->findOrFail($id);

       $request->validate([
            'project_name' => 'required|string',
            'place' => 'required|string',
            'deadline' => 'required|date',
            'start_at' => 'required|date',
            'end_at' => 'required|date|after_or_equal:start_at',
            'client_id' => 'required|integer|exists:clients,id'
        ]);
        
        $project->update([
            'project_name' => $request->project_name,
            'place' => $request->place,
            'deadline' => $request->deadline,
            'start_at' => $request->start_at,
            'end_at' => $request->end_at,
            'client_id' => $request->client_id
        ]);

        return response()->json([
                'success' => true,
                'message' => 'Data Project berhasil diperbarui',
                'data' => $project
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Project::destroy($id);
    
        return response()->json([
            'success' => true,
            'message' => 'Data Project berhasil dihapus',
            'data' => null
        ], 200);
    }
}
