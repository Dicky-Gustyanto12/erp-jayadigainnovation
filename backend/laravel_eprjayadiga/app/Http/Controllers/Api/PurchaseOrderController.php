<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PurchaseOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PurchaseOrderController extends Controller
{
    public function index()
    {
        $pos = PurchaseOrder::with(['client', 'project', 'items'])->latest()->get();
        return response()->json([
            'success' => true,
            'message' => 'Data Purchase Order berhasil diambil',
            'data' => $pos
        ], 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'total'               => 'required|numeric',
            'status'              => 'required|string|in:Pending,Disetujui,Ditolak,Selesai',
            'client_id'           => 'required|integer|exists:clients,id',
            'project_id'          => 'nullable|integer|exists:projects,id',
            'po_date'             => 'required|date',
            'due_date'            => 'required|date',
            'items'               => 'required|array',
            'items.*.item_type'   => 'required|string|in:barang,jasa,kategori,kosong',
            'items.*.description' => 'nullable|string', 
            'items.*.qty'         => 'nullable|numeric',
            'items.*.unit'        => 'nullable|string',
            'items.*.unit_price'  => 'nullable|numeric',
            'items.*.subtotal'    => 'nullable|numeric',
            'items.*.is_highlighted' => 'nullable|boolean',
        ]);

        DB::beginTransaction();

        try {
            $po = PurchaseOrder::create([
                'client_id'    => $request->client_id,
                'project_id'   => $request->project_id,
                'po_date'      => $request->po_date,
                'due_date'     => $request->due_date,
                'total'        => $request->total,
                'status'       => $request->status
            ]);

            foreach ($request->items as $item) {
                $po->items()->create([
                    'item_type'      => $item['item_type'],
                    'description'    => $item['description'] ?? '-', 
                    'qty'            => $item['qty'] ?? 0,
                    'unit'           => $item['unit'] ?? '-',
                    'unit_price'     => $item['unit_price'] ?? 0,
                    'math_operator'  => $item['math_operator'] ?? null,
                    'math_operand'   => $item['math_operand'] ?? null,
                    'subtotal'       => $item['subtotal'] ?? 0,
                    'is_highlighted' => $item['is_highlighted'] ?? false,
                ]);
            }

            DB::commit();
            $poComplete = PurchaseOrder::with(['client', 'project', 'items'])->find($po->id);

            return response()->json([
                'success' => true,
                'message' => 'Data Purchase Order berhasil ditambahkan',
                'data' => $poComplete
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Gagal store PO: " . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Gagal menyimpan PO: ' . $e->getMessage()], 500);
        }
    }

    public function show(int $id)
    {
        $po = PurchaseOrder::with(['client', 'project', 'items'])->where('id', $id)->first();
        if (!$po) return response()->json(['success' => false, 'message' => 'Tidak ditemukan', 'data' => null], 404);
        return response()->json(['success' => true, 'message' => 'Berhasil', 'data' => $po], 200);
    }

    public function update(Request $request, int $id)
    {
        $po = PurchaseOrder::where('id', $id)->first();
        if (!$po) return response()->json(['success' => false, 'message' => 'Tidak ditemukan', 'data' => null], 404);

        $request->validate([
            'total'               => 'required|numeric',
            'status'              => 'required|string|in:Pending,Disetujui,Ditolak,Selesai',
            'client_id'           => 'required|integer|exists:clients,id',
            'project_id'          => 'nullable|integer|exists:projects,id',
            'po_date'             => 'required|date',
            'due_date'            => 'required|date',
            'items'               => 'required|array',
            'items.*.item_type'   => 'required|string|in:barang,jasa,kategori,kosong',
            'items.*.description' => 'nullable|string', 
            'items.*.qty'         => 'nullable|numeric',
            'items.*.unit'        => 'nullable|string',
            'items.*.unit_price'  => 'nullable|numeric',
            'items.*.subtotal'    => 'nullable|numeric',
            'items.*.is_highlighted' => 'nullable|boolean',
        ]);

        DB::beginTransaction();

        try {
            $po->update([
                'client_id'    => $request->client_id,
                'project_id'   => $request->project_id,
                'po_date'      => $request->po_date,
                'due_date'     => $request->due_date,
                'total'        => $request->total,
                'status'       => $request->status
            ]);

            $po->items()->delete();
            
            foreach ($request->items as $item) {
                $po->items()->create([
                    'item_type'      => $item['item_type'],
                    'description'    => $item['description'] ?? '-', 
                    'qty'            => $item['qty'] ?? 0,
                    'unit'           => $item['unit'] ?? '-',
                    'unit_price'     => $item['unit_price'] ?? 0,
                    'math_operator'  => $item['math_operator'] ?? null,
                    'math_operand'   => $item['math_operand'] ?? null,
                    'subtotal'       => $item['subtotal'] ?? 0,
                    'is_highlighted' => $item['is_highlighted'] ?? false,
                ]);
            }

            DB::commit();
            $updatedPO = PurchaseOrder::with(['client', 'project', 'items'])->find($id);

            return response()->json(['success' => true, 'message' => 'Berhasil diperbarui', 'data' => $updatedPO], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Gagal update PO ID {$id}: " . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Gagal memperbarui: ' . $e->getMessage()], 500);
        }
    }

    public function destroy(int $id)
    {
        DB::beginTransaction();
        try {
            $deleted = PurchaseOrder::where('id', $id)->delete();
            if ($deleted === 0) return response()->json(['success' => false, 'message' => 'Tidak ditemukan'], 404);
            DB::commit();
            return response()->json(['success' => true, 'message' => 'Berhasil dihapus'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => 'Gagal menghapus'], 500);
        }
    }
}
