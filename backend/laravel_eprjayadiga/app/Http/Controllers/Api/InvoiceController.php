<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Income; 
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    public function index()
    {
        // Tambahkan 'items' agar rincian barang ikut terkirim ke React
        $invoices = Invoice::with(['client', 'project', 'items'])->latest()->get();

        return response()->json([
            'success' => true,
            'message' => 'Data Invoice berhasil diambil',
            'data' => $invoices
        ], 200);
    }

    public function store(Request $request)
    {
        // 1. Validasi Super Ketat (termasuk validasi array items)
        $validated = $request->validate([
            'total'               => 'required|numeric',
            'status'              => 'required|string|in:Pending,Lunas,Dibatalkan',
            'client_id'           => 'required|integer|exists:clients,id',
            'project_id'          => 'nullable|integer|exists:projects,id',
            'invoice_date'        => 'required|date',
            'due_date'            => 'required|date',
            'items'               => 'required|array',
            'items.*.item_type'   => 'required|string|in:barang,dp,pelunasan',
            'items.*.description' => 'required|string',
            'items.*.qty'         => 'required|numeric',
            'items.*.unit'        => 'required|string',
            'items.*.unit_price'  => 'required|numeric',
            'items.*.subtotal'    => 'required|numeric',
        ]);

        // 2. Simpan Induk Invoice
        $invoice = Invoice::create([
            'client_id'    => $request->client_id,
            'project_id'   => $request->project_id,
            'invoice_date' => $request->invoice_date,
            'due_date'     => $request->due_date,
            'total'        => $request->total, // <--- MASALAH NULL TERSOLUSIKAN DI SINI
            'status'       => $request->status
        ]);

        // 3. Simpan Rincian Barang (Looping)
        foreach ($request->items as $item) {
            $invoice->items()->create([
                'item_type'   => $item['item_type'],
                'description' => $item['description'],
                'qty'         => $item['qty'],
                'unit'        => $item['unit'],
                'unit_price'  => $item['unit_price'],
                'subtotal'    => $item['subtotal'],
            ]);
        }

        // 4. Otomatisasi Arus Kas (Jika Lunas)
        if ($invoice->status === 'Lunas') {
            Income::create([
                'invoice_id'      => $invoice->id,
                'income_date'     => date('Y-m-d'),
                'income_from'     => 'Pelunasan ' . $invoice->invoice_code,
                'income_amount'   => $invoice->total,
                'income_category' => 'Proyek' 
            ]);
        }

        // Ambil ulang data lengkap untuk dikembalikan ke Frontend
        $invoiceComplete = Invoice::with(['client', 'project', 'items'])->find($invoice->id);

        return response()->json([
            'success' => true,
            'message' => 'Data Invoice dan Rincian berhasil ditambahkan',
            'data' => $invoiceComplete
        ], 201);
    }

    public function show(int $id)
    {
        $invoice = Invoice::with(['client', 'project', 'items'])->where('id', $id)->first();

        if (!$invoice) {
            return response()->json([
                'success' => false,
                'message' => 'Data Invoice tidak ditemukan',
                'data' => null
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Data Invoice berhasil diambil',
            'data' => $invoice
        ], 200);
    }

    public function update(Request $request, int $id)
    {
        $invoice = Invoice::where('id', $id)->first();

        if (!$invoice) {
            return response()->json([
                'success' => false,
                'message' => 'Data Invoice tidak ditemukan',
                'data' => null
            ], 404);
        }

        $request->validate([
            'total'               => 'required|numeric',
            'status'              => 'required|string|in:Pending,Lunas,Dibatalkan',
            'client_id'           => 'required|integer|exists:clients,id',
            'project_id'          => 'nullable|integer|exists:projects,id',
            'invoice_date'        => 'required|date',
            'due_date'            => 'required|date',
            'items'               => 'required|array',
        ]);

        // 1. Update Induk Invoice
        $invoice->update([
            'client_id'    => $request->client_id,
            'project_id'   => $request->project_id,
            'invoice_date' => $request->invoice_date,
            'due_date'     => $request->due_date,
            'total'        => $request->total,
            'status'       => $request->status
        ]);

        // 2. Hapus rincian lama, lalu masukkan yang baru (Teknik termudah untuk Dynamic Rows)
        $invoice->items()->delete();
        foreach ($request->items as $item) {
            $invoice->items()->create([
                'item_type'   => $item['item_type'] ?? 'barang',
                'description' => $item['description'],
                'qty'         => $item['qty'],
                'unit'        => $item['unit'],
                'unit_price'  => $item['unit_price'],
                'subtotal'    => $item['subtotal'],
            ]);
        }

        // 3. Otomatisasi Sinkronisasi Pemasukan
        if ($invoice->status === 'Lunas') {
            Income::updateOrCreate(
                ['invoice_id' => $invoice->id],
                [
                    'income_date'     => date('Y-m-d'), 
                    'income_from'     => 'Pelunasan ' . $invoice->invoice_code,
                    'income_amount'   => $invoice->total,
                    'income_category' => 'Proyek'
                ]
            );
        } else {
            Income::where('invoice_id', $invoice->id)->delete();
        }

        $updatedInvoice = Invoice::with(['client', 'project', 'items'])->find($id);

        return response()->json([
            'success' => true,
            'message' => 'Data Invoice berhasil diperbarui',
            'data' => $updatedInvoice
        ], 200);
    }

    public function destroy(int $id)
    {
        Income::where('invoice_id', $id)->delete();
        
        // Relasi items() akan otomatis terhapus jika di migration menggunakan cascadeOnDelete()
        $deleted = Invoice::where('id', $id)->delete();

        if ($deleted === 0) {
            return response()->json([
                'success' => false,
                'message' => 'Data Invoice tidak ditemukan',
                'data' => null
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Data Invoice berhasil dihapus',
            'data' => null
        ], 200);
    }
}