import React from "react";
import { Printer, Download, Send } from "lucide-react";

const Invoice = ({ data, onClose }) => {
  if (!data) return null;

  // Formatter Uang & Tanggal
  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 max-w-4xl mx-auto">
      {/* Header Invoice */}
      <div className="bg-[#1A3263] p-8 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold uppercase tracking-tighter">
            Invoice
          </h2>
          <p className="text-blue-200 mt-1 font-medium">
            {data.invoice_code || `INV-${data.id}`}
          </p>
        </div>
        <div className="text-left md:text-right">
          <h3 className="font-bold text-lg">PT Jaya Diga Innovation</h3>
          <p className="text-sm text-blue-100">Jl. Industri No. 123, Bekasi</p>
          <p className="text-sm text-blue-100">info@jayadiga.com</p>
        </div>
      </div>

      <div className="p-8">
        {/* Info Client & Tanggal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div>
            <p className="text-gray-400 text-xs uppercase font-bold mb-2 tracking-wider">
              Ditagihkan Kepada:
            </p>
            <h4 className="text-xl font-bold text-gray-800">
              {data.client?.company || (
                <span className="text-red-400 italic font-normal">
                  Klien tidak ditemukan
                </span>
              )}
            </h4>
            <p className="text-gray-500 text-sm mt-1">
              Up: {data.client?.client_name || "-"}
            </p>
            {data.client?.address && (
              <p className="text-gray-500 text-sm mt-1 max-w-xs">
                {data.client.address}
              </p>
            )}
          </div>

          <div className="text-left md:text-right border-t md:border-t-0 pt-4 md:pt-0 border-gray-100">
            <p className="text-gray-400 text-xs uppercase font-bold mb-1 tracking-wider">
              Jatuh Tempo
            </p>
            <p className="text-gray-800 font-bold mb-4">
              {formatDate(data.due_date)}
            </p>

            <p className="text-gray-400 text-xs uppercase font-bold mb-1 tracking-wider">
              Status
            </p>
            <span
              className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold border uppercase tracking-wider ${
                (data.status || "PENDING").toUpperCase() === "LUNAS"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-orange-50 text-orange-700 border-orange-200"
              }`}
            >
              {data.status || "Pending"}
            </span>
          </div>
        </div>

        {/* Tabel Item Tagihan */}
        <div className="overflow-x-auto">
          <table className="w-full mb-10">
            <thead>
              <tr className="border-b-2 border-gray-100 text-left">
                <th className="py-4 text-gray-400 uppercase text-xs font-bold">
                  Deskripsi Tagihan
                </th>
                <th className="py-4 text-right text-gray-400 uppercase text-xs font-bold">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-50">
                <td className="py-5 text-gray-700 font-medium">
                  {data.project?.project_name
                    ? `Pembayaran Proyek: ${data.project.project_name}`
                    : "Layanan Jasa Development"}
                </td>
                <td className="py-5 text-right text-gray-900 font-bold">
                  {/* PERBAIKAN: Menggunakan data.total, bukan data.amount */}
                  {formatRupiah(data.total)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Total Akhir */}
        <div className="flex justify-end">
          <div className="w-full md:w-72 space-y-3">
            <div className="flex justify-between text-gray-500 text-sm">
              <span>Subtotal</span>
              {/* PERBAIKAN: Menggunakan data.total */}
              <span>{formatRupiah(data.total)}</span>
            </div>
            <div className="flex justify-between text-gray-500 text-sm border-b border-gray-100 pb-4">
              <span>Pajak (Termasuk)</span>
              <span>Rp 0</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-[#1A3263] pt-2">
              <span>Total Tagihan</span>
              {/* PERBAIKAN: Menggunakan data.total */}
              <span>{formatRupiah(data.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer / Actions */}
      <div className="p-6 bg-gray-50 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* PERBAIKAN: Tombol Tutup sekarang memiliki warna merah yang elegan */}
        <button
          onClick={onClose}
          className="px-5 py-2.5 bg-red-50 text-red-600 font-bold hover:bg-red-100 rounded-lg transition cursor-pointer order-2 md:order-1"
        >
          Tutup
        </button>

        <div className="flex gap-3 w-full md:w-auto order-1 md:order-2">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-gray-300 px-4 py-2.5 rounded-lg text-gray-700 font-bold hover:bg-gray-100 transition cursor-pointer">
            <Printer size={18} />{" "}
            <span className="hidden md:inline">Cetak</span>
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#1A3263] px-6 py-2.5 rounded-lg text-white font-bold hover:bg-[#25468a] transition shadow-lg shadow-blue-900/20 cursor-pointer">
            <Send size={18} /> Kirim Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
