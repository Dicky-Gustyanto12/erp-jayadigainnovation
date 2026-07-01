<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tasks = Task::query()->latest()->get();

        return response()->json([
            'success' => true,
            'message' => 'Data Task berhasil diambil',
            'data' => $tasks
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'task_name' => 'required|string',
            'percent' => 'required|integer|min:0|max:100',
            'start_at' => 'required|date',
            'status' => 'required|string',
            'project_id' => 'required|integer|exists:projects,id'
        ]);

        $task = Task::create([
            'task_name' => $request->task_name,
            'percent' => $request->percent,
            'start_at' => $request->start_at,
            'status' => $request->status,
            'project_id' => $request->project_id
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Data Task baru berhasil ditambahkan',
            'data' => $task
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $task = Task::findOrFail($id);

        return response()->json([
            'success' => true,
            'message' => 'Data Task berhasil diambil',
            'data' => $task
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $task = Task::findOrFail($id);

        $request->validate([
            'task_name' => 'required|string',
            'percent' => 'required|integer|min:0|max:100',
            'start_at' => 'required|date',
            'status' => 'required|string',
            'project_id' => 'required|integer|exists:projects,id'
        ]);

        $task->update([
            'task_name' => $request->task_name,
            'percent' => $request->percent,
            'start_at' => $request->start_at,
            'status' => $request->status,
            'project_id' => $request->project_id
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Data Task berhasil diperbarui',
            'data' => $task
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Task::destroy($id);

        return response()->json([
            'success' => true,
            'message' => 'Data Task berhasil dihapus',
            'data' => null
        ], 200);
    }
}
