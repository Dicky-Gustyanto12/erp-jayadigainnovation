<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $clients = Client::query()->latest()->get();

        return response()->json([
            'success' => true,
            'message' => 'Data Client berhasil diambil',
            'data' => $clients
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'company' => 'required|string',
            'address' => 'required|string',
            'contact' => 'required|string',
            'email' => 'required|string|email|unique:clients,email' 
        ]);

        $client = Client::create([
            'company' => $request->company,
            'address' => $request->address,
            'contact' => $request->contact,
            'email' => $request->email
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Data client baru berhasil ditambahkan',
            'data' => $client
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $client = Client::findOrFail($id);

        return response()->json([
            'success' => true,
            'message' => 'Data client berhasil diambil',
            'data' => $client
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $client = Client::findOrFail($id);

        $request->validate([
            'company' => 'required|string',
            'address' => 'required|string',
            'contact' => 'required|string',
            'email' => 'required|string|email|unique:clients,email,' . $client->id
        ]);

        $client->update([
            'company' => $request->company,
            'address' => $request->address,
            'contact' => $request->contact,
            'email' => $request->email
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Data Client berhasil diperbarui',
            'data' => $client
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Client::destroy($id);

        return response()->json([
            'success' => true,
            'message' => 'Data client berhasil dihapus',
            'data' => null
        ], 200);
    }
}
    