<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Income;
use Illuminate\Http\Request;

class IncomeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $incomes = Income::query()->latest()->get();

        return response()->json([
            'success' => true,
            'message' => 'Data Income berhasil diambil',
            'data' => $incomes
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'income_date' => 'required|date',
            'income_from' => 'required|string',
            'income_amount' => 'required|numeric',
            'income_category' => 'required|string',
            'invoice_id' => 'required|integer|exists:invoices,id'
        ]);

        $income = Income::create([
            'income_date' => $request->income_date,
            'income_from' => $request->income_from,
            'income_amount' => $request->income_amount,
            'income_category' => $request->income_category,
            'invoice_id' => $request->invoice_id
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Data Income baru berhasil ditambahkan',
            'data' => $income
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $income = Income::findOrFail($id);

        return response()->json([
            'success' => true,
            'message' => 'Data Income berhasil diambil',
            'data' => $income
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $income = Income::findOrFail($id);

        $request->validate([
            'income_date' => 'required|date',
            'income_from' => 'required|string',
            'income_amount' => 'required|numeric',
            'income_category' => 'required|string',
            'invoice_id' => 'required|integer|exists:invoices,id'
        ]);

        $income->update([
            'income_date' => $request->income_date,
            'income_from' => $request->income_from,
            'income_amount' => $request->income_amount,
            'income_category' => $request->income_category,
            'invoice_id' => $request->invoice_id
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Data Income berhasil diperbarui',
            'data' => $income
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Income::destroy($id);

        return response()->json([
            'success' => true,
            'message' => 'Data Income berhasil dihapus',
            'data' => null
        ], 200);
    }
}
