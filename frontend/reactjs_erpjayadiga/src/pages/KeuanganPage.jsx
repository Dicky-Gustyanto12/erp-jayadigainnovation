import React, { useState } from 'react';
import { Plus, Download, Filter, PieChart } from 'lucide-react';
import Keuangan from '../components/Keuangan';

const KeuanganPage = () => {
  const [listTransaksi] = useState([
    { desc: 'Pembayaran Termin 1 - Gudang Cikarang', cat: 'Proyek', date: '02 Apr 2026', amount: 'Rp 150.000.000', type: 'in' },
    { desc: 'Pembelian Material Baja WF', cat: 'Fabrikasi', date: '01 Apr 2026', amount: 'Rp 45.000.000', type: 'out' },
    { desc: 'Gaji Karyawan Maret', cat: 'Operasional', date: '31 Mar 2026', amount: 'Rp 65.000.000', type: 'out' },
    { desc: 'DP Proyek Playground Jakarta', cat: 'Playground', date: '30 Mar 2026', amount: 'Rp 25.500.000', type: 'in' },
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Laporan Keuangan</h1>
          <p className="text-gray-500">Pantau arus kas masuk dan keluar PT Jaya Diga Innovation.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2.5 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition cursor-pointer">
            <Download size={18} /> Cetak PDF
          </button>
          <button className="flex items-center gap-2 bg-[#1A3263] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#25468a] transition shadow-lg shadow-blue-900/20 cursor-pointer">
            <Plus size={20} /> Transaksi Baru
          </button>
        </div>
      </div>

      {/* Kontrol Cepat */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex gap-4">
          <button className="text-sm font-bold text-[#1A3263] px-4 py-2 bg-blue-50 rounded-lg">Semua</button>
          <button className="text-sm font-bold text-gray-400 px-4 py-2 hover:text-[#1A3263] transition">Pemasukan</button>
          <button className="text-sm font-bold text-gray-400 px-4 py-2 hover:text-[#1A3263] transition">Pengeluaran</button>
        </div>
        <button className="flex items-center gap-2 text-gray-500 text-sm font-bold hover:text-[#1A3263] cursor-pointer">
          <Filter size={18} /> Filter Periode
        </button>
      </div>

      {/* Main Content Component */}
      <Keuangan transactions={listTransaksi} />
    </div>
  );
};

export default KeuanganPage;