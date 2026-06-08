import React, { useState } from 'react';
import { Plus, Search, Filter, Eye } from 'lucide-react';
import Invoice from '../components/Invoice';

const InvoicePage = () => {
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const invoiceData = [
    { id: '1001', client: 'PT Maju Jaya', project: 'Konstruksi Gudang B', amount: 'Rp 150.000.000', date: '12 Mar 2026', status: 'Lunas' },
    { id: '1002', client: 'CV Kreatif Mandiri', project: 'Fabrikasi Rak Industri', amount: 'Rp 45.000.000', date: '25 Mar 2026', status: 'Pending' },
    { id: '1003', client: 'Taman Bermain Kota', project: 'Custom Playground Set', amount: 'Rp 85.500.000', date: '01 Apr 2026', status: 'Pending' },
  ];

  return (
    <div className="space-y-6">
      {/* Jika ada invoice yang dipilih, tampilkan modal detail */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-4xl animate-in fade-in zoom-in duration-300">
            <Invoice data={selectedInvoice} onClose={() => setSelectedInvoice(null)} />
          </div>
        </div>
      )}

      {/* Header Halaman */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Invoice</h1>
          <p className="text-gray-500">Kelola dan pantau semua tagihan pelanggan Anda.</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-[#1A3263] text-white px-5 py-3 rounded-xl font-bold hover:bg-[#25468a] transition-all shadow-lg shadow-blue-900/20">
          <Plus size={20} /> Buat Invoice Baru
        </button>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Cari klien atau nomor invoice..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1A3263] outline-none"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 font-medium transition cursor-pointer">
          <Filter size={18} /> Filter
        </button>
      </div>

      {/* Tabel Invoice */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">ID Invoice</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Klien</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Proyek</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Jumlah</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {invoiceData.map((inv) => (
              <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-bold text-[#1A3263]">#INV-{inv.id}</td>
                <td className="px-6 py-4 font-semibold text-gray-700">{inv.client}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{inv.project}</td>
                <td className="px-6 py-4 font-bold text-gray-900">{inv.amount}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                    inv.status === 'Lunas' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {inv.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button 
                    onClick={() => setSelectedInvoice(inv)}
                    className="p-2 text-gray-400 hover:text-[#1A3263] transition cursor-pointer"
                  >
                    <Eye size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoicePage;