import React from 'react';
import { TrendingUp, TrendingDown, Wallet, ArrowRight } from 'lucide-react';

const Keuangan = ({ transactions = [] }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Ringkasan Saldo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1A3263] p-6 rounded-2xl shadow-lg shadow-blue-900/20 text-white">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-white/10 rounded-lg">
              <Wallet size={24} />
            </div>
            <span className="text-[10px] bg-white/20 px-2 py-1 rounded font-bold uppercase">Total Saldo</span>
          </div>
          <p className="text-blue-100 text-sm">Saldo Saat Ini</p>
          <h3 className="text-2xl font-bold mt-1">Rp 1.250.000.000</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
              <TrendingUp size={24} />
            </div>
            <span className="text-[10px] bg-green-50 text-green-600 px-2 py-1 rounded font-bold uppercase">Bulan Ini</span>
          </div>
          <p className="text-gray-500 text-sm">Pemasukan</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">Rp 450.000.000</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-red-100 text-red-600 rounded-lg">
              <TrendingDown size={24} />
            </div>
            <span className="text-[10px] bg-red-50 text-red-600 px-2 py-1 rounded font-bold uppercase">Bulan Ini</span>
          </div>
          <p className="text-gray-500 text-sm">Pengeluaran</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1 text-red-600">- Rp 120.500.000</h3>
        </div>
      </div>

      {/* Tabel Transaksi Terakhir */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-800">Transaksi Terakhir</h3>
          <button className="text-sm font-bold text-[#1A3263] hover:underline cursor-pointer">Lihat Semua</button>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-400 font-bold uppercase text-[10px]">
            <tr>
              <th className="px-6 py-4">Keterangan Transaksi</th>
              <th className="px-6 py-4">Kategori</th>
              <th className="px-6 py-4">Tanggal</th>
              <th className="px-6 py-4 text-right">Nominal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {transactions.map((t, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-semibold text-gray-800">{t.desc}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-[10px] font-bold uppercase">
                    {t.cat}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500">{t.date}</td>
                <td className={`px-6 py-4 text-right font-bold ${t.type === 'in' ? 'text-green-600' : 'text-red-600'}`}>
                  {t.type === 'in' ? '+' : '-'} {t.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Keuangan;