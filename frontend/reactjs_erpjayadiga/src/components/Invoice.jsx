import React from 'react';
import { Printer, Download, Send } from 'lucide-react';

const Invoice = ({ data, onClose }) => {
  if (!data) return null;

  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 max-w-4xl mx-auto">
      {/* Header Invoice */}
      <div className="bg-[#1A3263] p-8 text-white flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold uppercase tracking-tighter">Invoice</h2>
          <p className="text-blue-200 mt-1">#INV-{data.id}</p>
        </div>
        <div className="text-right">
          <h3 className="font-bold text-lg">PT Jaya Diga Innovation</h3>
          <p className="text-sm text-blue-100">Jl. Industri No. 123, Bekasi</p>
          <p className="text-sm text-blue-100">info@jayadiga.com</p>
        </div>
      </div>

      <div className="p-8">
        {/* Info Client & Tanggal */}
        <div className="grid grid-cols-2 gap-8 mb-10">
          <div>
            <p className="text-gray-400 text-xs uppercase font-bold mb-2">Ditagihkan Kepada:</p>
            <h4 className="text-xl font-bold text-gray-800">{data.client}</h4>
            <p className="text-gray-500 text-sm">{data.project}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-xs uppercase font-bold mb-1">Tanggal Terbit</p>
            <p className="text-gray-800 font-semibold mb-3">{data.date}</p>
            <p className="text-gray-400 text-xs uppercase font-bold mb-1">Status</p>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              data.status === 'Lunas' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
            }`}>
              {data.status}
            </span>
          </div>
        </div>

        {/* Tabel Item */}
        <table className="w-full mb-10">
          <thead>
            <tr className="border-b-2 border-gray-100 text-left">
              <th className="py-4 text-gray-400 uppercase text-xs">Deskripsi Pekerjaan</th>
              <th className="py-4 text-right text-gray-400 uppercase text-xs">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-50">
              <td className="py-5 text-gray-700 font-medium">{data.project} - Tahap 1</td>
              <td className="py-5 text-right text-gray-900 font-bold">{data.amount}</td>
            </tr>
          </tbody>
        </table>

        {/* Total Akhir */}
        <div className="flex justify-end">
          <div className="w-64 space-y-3">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span>{data.amount}</span>
            </div>
            <div className="flex justify-between text-gray-500 border-b pb-3">
              <span>Pajak (11%)</span>
              <span>Termasuk</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-[#1A3263] pt-2">
              <span>Total Tagihan</span>
              <span>{data.amount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer / Actions */}
      <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-between">
        <button onClick={onClose} className="text-gray-500 font-bold hover:text-gray-700">Tutup</button>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg text-gray-700 font-bold hover:bg-gray-100 transition">
            <Printer size={18} /> Cetak
          </button>
          <button className="flex items-center gap-2 bg-[#1A3263] px-6 py-2 rounded-lg text-white font-bold hover:bg-[#25468a] transition shadow-lg shadow-blue-900/20">
            <Send size={18} /> Kirim Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default Invoice;