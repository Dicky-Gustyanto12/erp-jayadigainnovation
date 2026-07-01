<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $invoices = Invoice::query()->latest()->get();

        return response()->json([
            'success' => true,
            'message' => 'Data Invoice berhasil diambil',
            'data' => $invoices
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'total' => 'required|numeric',
            'status' => 'required|string',
            'client_id' => 'required|integer|exists:clients,id',
            'project_id' => 'required|integer|exists:projects,id',
            'invoice_date' => 'required|date'
        ]);

        $invoice = Invoice::create([
            'total' => $request->total,
            'status' => $request->status,
            'client_id' => $request->client_id,
            'project_id' => $request->project_id,
            'invoice_date' => $request->invoice_date
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Data Invoice baru berhasil ditambahkan',
            'data' => $invoice
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $invoice = Invoice::findOrFail($id);

        return response()->json([
            'success' => true,
            'message' => 'Data Invoice baru berhasil diambil',
            'data' => $invoice
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $invoice = Invoice::findOrFail($id);

        $request->validate([
            'total' => 'required|numeric',
            'status' => 'required|string',
            'client_id' => 'required|integer|exists:clients,id',
            'project_id' => 'required|integer|exists:projects,id',
            'invoice_date' => 'required|date'
        ]);

        $invoice->update([
            'total' => $request->total,
            'status' => $request->status,
            'client_id' => $request->client_id,
            'project_id' => $request->project_id,
            'invoice_date' => $request->invoice_date
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Data Invoice berhasil diperbarui',
            'data' => $invoice
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Invoice::destroy($id);

        return response()->json([
            'success' => true,
            'message' => 'Data Invoice berhasil dihapus',
            'data' => null
        ], 200);
    }
}
