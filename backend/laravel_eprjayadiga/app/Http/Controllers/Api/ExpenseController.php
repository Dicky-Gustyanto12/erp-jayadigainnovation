<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use Illuminate\Http\Request;

class ExpenseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $expenses = Expense::query()->latest()->get();

        return response()->json([
            'success' => true,
            'message' => 'Data Expense berhasil diambil',
            'data' => $expenses
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'expense_date' => 'required|date',
            'expense_name' => 'required|string',
            'expense_amount' => 'required|numeric',
            'expense_category' => 'required|string'
        ]);

        $expense = Expense::create([
            'expense_date' => $request->expense_date,
            'expense_name' => $request->expense_name,
            'expense_amount' => $request->expense_amount,
            'expense_category' => $request->expense_category
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Data Expense baru berhasil ditambahkan',
            'data' => $expense
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $expense = Expense::findOrFail($id);

        return response()->json([
            'success' => true,
            'message' => 'Data Expense berhasil diambil',
            'data' => $expense
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
         $expense = Expense::findOrFail($id);

         $request->validate([
            'expense_date' => 'required|date',
            'expense_name' => 'required|string',
            'expense_amount' => 'required|numeric',
            'expense_category' => 'required|string'
        ]);

        $expense->update([
            'expense_date' => $request->expense_date,
            'expense_name' => $request->expense_name,
            'expense_amount' => $request->expense_amount,
            'expense_category' => $request->expense_category
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Data Expense berhasil diperbarui',
            'data' => $expense
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Expense::destroy($id);

        return response()->json([
            'success' => true,
            'message' => 'Data Expense berhasil dihapus',
            'data' => null
        ], 200);
    }
}
