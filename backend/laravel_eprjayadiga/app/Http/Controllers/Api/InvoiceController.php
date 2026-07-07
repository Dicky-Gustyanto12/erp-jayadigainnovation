<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Income;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class InvoiceController extends Controller
{
    public function index()
    {
        $invoices = Invoice::with(['client', 'project', 'items'])->latest()->get();
        return response()->json([
            'success' => true,
            'message' => 'Data Invoice berhasil diambil',
            'data' => $invoices
        ], 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'total'               => 'required|numeric',
            'status'              => 'required|string|in:Pending,Lunas,Dibatalkan',
            'client_id'           => 'required|integer|exists:clients,id',
            'project_id'          => 'nullable|integer|exists:projects,id',
            'invoice_date'        => 'required|date',
            'due_date'            => 'required|date',
            'items'               => 'required|array',
            
            // PERBAIKAN: Menambahkan 'kosong' ke daftar yang diizinkan
            'items.*.item_type'   => 'required|string|in:barang,dp,pelunasan,kategori,kosong',
            
            // PERBAIKAN: Deskripsi sekarang boleh kosong (nullable)
            'items.*.description' => 'nullable|string', 
            
            'items.*.qty'         => 'nullable|numeric',
            'items.*.unit'        => 'nullable|string',
            'items.*.unit_price'  => 'nullable|numeric',
            'items.*.subtotal'    => 'nullable|numeric',
            'items.*.is_highlighted' => 'nullable|boolean',
        ]);

        DB::beginTransaction();

        try {
            $invoice = Invoice::create([
                'client_id'    => $request->client_id,
                'project_id'   => $request->project_id,
                'invoice_date' => $request->invoice_date,
                'due_date'     => $request->due_date,
                'total'        => $request->total,
                'status'       => $request->status
            ]);

            foreach ($request->items as $item) {
                $invoice->items()->create([
                    'item_type'      => $item['item_type'],
                    // Jika deskripsi kosong, isi dengan "-" agar database tidak error
                    'description'    => $item['description'] ?? '-', 
                    'qty'            => $item['qty'] ?? 0,
                    'unit'           => $item['unit'] ?? '-',
                    'unit_price'     => $item['unit_price'] ?? 0,
                    'subtotal'       => $item['subtotal'] ?? 0,
                    'is_highlighted' => $item['is_highlighted'] ?? false,
                ]);
            }

            if ($invoice->status === 'Lunas') {
                Income::create([
                    'invoice_id'      => $invoice->id,
                    'income_date'     => date('Y-m-d'),
                    'income_from'     => 'Pelunasan ' . ($invoice->invoice_code ?? 'INV-'.$invoice->id),
                    'income_amount'   => $invoice->total,
                    'income_category' => 'Proyek'
                ]);

                if ($invoice->project_id) {
                    $project = Project::find($invoice->project_id);
                    if ($project && $project->status !== 'Selesai') {
                        $project->update(['status' => 'Selesai', 'end_at' => date('Y-m-d')]);
                    }
                }
            }

            DB::commit();
            $invoiceComplete = Invoice::with(['client', 'project', 'items'])->find($invoice->id);

            return response()->json([
                'success' => true,
                'message' => 'Data Invoice dan Rincian berhasil ditambahkan',
                'data' => $invoiceComplete
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Gagal store invoice: " . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Gagal menyimpan invoice: ' . $e->getMessage()], 500);
        }
    }

    public function show(int $id)
    {
        $invoice = Invoice::with(['client', 'project', 'items'])->where('id', $id)->first();
        if (!$invoice) return response()->json(['success' => false, 'message' => 'Tidak ditemukan', 'data' => null], 404);
        return response()->json(['success' => true, 'message' => 'Berhasil', 'data' => $invoice], 200);
    }

    public function update(Request $request, int $id)
    {
        $invoice = Invoice::where('id', $id)->first();
        if (!$invoice) return response()->json(['success' => false, 'message' => 'Tidak ditemukan', 'data' => null], 404);

        $request->validate([
            'total'               => 'required|numeric',
            'status'              => 'required|string|in:Pending,Lunas,Dibatalkan',
            'client_id'           => 'required|integer|exists:clients,id',
            'project_id'          => 'nullable|integer|exists:projects,id',
            'invoice_date'        => 'required|date',
            'due_date'            => 'required|date',
            'items'               => 'required|array',
            
            // PERBAIKAN: Menambahkan 'kosong' ke daftar yang diizinkan
            'items.*.item_type'   => 'required|string|in:barang,dp,pelunasan,kategori,kosong',
            
            // PERBAIKAN: Deskripsi sekarang boleh kosong (nullable)
            'items.*.description' => 'nullable|string', 
            
            'items.*.qty'         => 'nullable|numeric',
            'items.*.unit'        => 'nullable|string',
            'items.*.unit_price'  => 'nullable|numeric',
            'items.*.subtotal'    => 'nullable|numeric',
            'items.*.is_highlighted' => 'nullable|boolean',
        ]);

        DB::beginTransaction();

        try {
            $invoice->update([
                'client_id'    => $request->client_id,
                'project_id'   => $request->project_id,
                'invoice_date' => $request->invoice_date,
                'due_date'     => $request->due_date,
                'total'        => $request->total,
                'status'       => $request->status
            ]);

            // Hapus rincian lama, timpa dengan yang baru
            $invoice->items()->delete();
            
            foreach ($request->items as $item) {
                $invoice->items()->create([
                    'item_type'      => $item['item_type'],
                    // Jika deskripsi kosong, isi dengan "-" agar database tidak error
                    'description'    => $item['description'] ?? '-', 
                    'qty'            => $item['qty'] ?? 0,
                    'unit'           => $item['unit'] ?? '-',
                    'unit_price'     => $item['unit_price'] ?? 0,
                    'subtotal'       => $item['subtotal'] ?? 0,
                    'is_highlighted' => $item['is_highlighted'] ?? false,
                ]);
            }

            if ($invoice->status === 'Lunas') {
                Income::updateOrCreate(
                    ['invoice_id' => $invoice->id],
                    [
                        'income_date'     => date('Y-m-d'),
                        'income_from'     => 'Pelunasan ' . ($invoice->invoice_code ?? 'INV-'.$invoice->id),
                        'income_amount'   => $invoice->total,
                        'income_category' => 'Proyek'
                    ]
                );

                if ($invoice->project_id) {
                    $project = Project::find($invoice->project_id);
                    if ($project && $project->status !== 'Selesai') {
                        $project->update(['status' => 'Selesai', 'end_at' => date('Y-m-d')]);
                    }
                }
            } else {
                // Jika status diubah kembali dari Lunas ke Pending, hapus data pemasukannya
                Income::where('invoice_id', $invoice->id)->delete();
            }

            DB::commit();
            $updatedInvoice = Invoice::with(['client', 'project', 'items'])->find($id);

            return response()->json(['success' => true, 'message' => 'Berhasil diperbarui', 'data' => $updatedInvoice], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Gagal update invoice ID {$id}: " . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Gagal memperbarui: ' . $e->getMessage()], 500);
        }
    }

    public function destroy(int $id)
    {
        DB::beginTransaction();
        try {
            Income::where('invoice_id', $id)->delete();
            $deleted = Invoice::where('id', $id)->delete();
            if ($deleted === 0) return response()->json(['success' => false, 'message' => 'Tidak ditemukan'], 404);
            DB::commit();
            return response()->json(['success' => true, 'message' => 'Berhasil dihapus'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => 'Gagal menghapus'], 500);
        }
    }
}