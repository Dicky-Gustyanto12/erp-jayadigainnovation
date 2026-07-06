import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Plus,
  Download,
  Filter,
  TrendingUp,
  TrendingDown,
  Wallet,
  Edit,
  Trash2,
  X,
} from "lucide-react";
import Swal from "sweetalert2";

const KeuanganPage = () => {
  // ==========================================
  // 1. STATE (DATA & SAKLAR)
  // ==========================================
  const [transactions, setTransactions] = useState([]);
  const [invoices, setInvoices] = useState([]); // Untuk dropdown Invoice
  const [summary, setSummary] = useState({
    totalSaldo: 0,
    pemasukanBulanIni: 0,
    pengeluaranBulanIni: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // State Modal CRUD
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State Form Generic
  const [formData, setFormData] = useState({
    type: "in", // 'in' = Pemasukan, 'out' = Pengeluaran
    description: "",
    category: "",
    amount: "",
    date: "",
    invoice_id: "", // Khusus untuk Pemasukan
  });

  // ==========================================
  // 2. FUNGSI PENJEMPUT DATA
  // ==========================================
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // Tarik 3 API sekaligus: Incomes, Expenses, Invoices
      const [resIncomes, resExpenses, resInvoices] = await Promise.all([
        axios
          .get("http://127.0.0.1:8000/api/incomes", config)
          .catch(() => ({ data: { data: [] } })),
        axios
          .get("http://127.0.0.1:8000/api/expenses", config)
          .catch(() => ({ data: { data: [] } })),
        axios
          .get("http://127.0.0.1:8000/api/invoices", config)
          .catch(() => ({ data: { data: [] } })),
      ]);

      setInvoices(resInvoices.data.data);

      // Normalisasi data Income ke format umum
      const incomes = resIncomes.data.data.map((item) => ({
        id: item.id,
        type: "in",
        date: item.income_date,
        description: item.income_from,
        amount: item.income_amount,
        category: item.income_category,
        invoice_id: item.invoice_id,
      }));

      // Normalisasi data Expense ke format umum
      const expenses = resExpenses.data.data.map((item) => ({
        id: item.id,
        type: "out",
        date: item.expense_date,
        description: item.expense_name,
        amount: item.expense_amount,
        category: item.expense_category,
      }));

      // Gabungkan & Urutkan
      const mergedTransactions = [...incomes, ...expenses].sort(
        (a, b) => new Date(b.date) - new Date(a.date),
      );
      setTransactions(mergedTransactions);

      // Kalkulasi Ringkasan
      const totalIn = incomes.reduce(
        (sum, item) => sum + Number(item.amount),
        0,
      );
      const totalOut = expenses.reduce(
        (sum, item) => sum + Number(item.amount),
        0,
      );

      setSummary({
        totalSaldo: totalIn - totalOut,
        pemasukanBulanIni: totalIn,
        pengeluaranBulanIni: totalOut,
      });
    } catch (error) {
      console.error("Gagal mengambil data keuangan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ==========================================
  // 3. FUNGSI ALAT BANTU (FORMATTER)
  // ==========================================
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
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  // ==========================================
  // 4. KENDALI FORM (CREATE & UPDATE)
  // ==========================================
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOpenAdd = () => {
    setFormData({
      type: "in",
      description: "",
      category: "",
      amount: "",
      date: "",
      invoice_id: "",
    });
    setIsEditMode(false);
    setEditId(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (trx) => {
    setFormData({
      type: trx.type,
      description: trx.description || "",
      category: trx.category || "",
      amount: trx.amount || "",
      date: trx.date || "",
      invoice_id: trx.invoice_id || "",
    });
    setIsEditMode(true);
    setEditId(trx.id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // MAPPING PAYLOAD: Mengubah format React menjadi format yang diinginkan Laravel
      let payload = {};

      if (formData.type === "in") {
        payload = {
          income_date: formData.date,
          income_from: formData.description,
          income_amount: formData.amount,
          income_category: formData.category,
          invoice_id: formData.invoice_id, // Wajib untuk Pemasukan
        };
      } else {
        payload = {
          expense_date: formData.date,
          expense_name: formData.description,
          expense_amount: formData.amount,
          expense_category: formData.category,
        };
      }

      const endpoint = formData.type === "in" ? "incomes" : "expenses";
      const url = isEditMode
        ? `http://127.0.0.1:8000/api/${endpoint}/${editId}`
        : `http://127.0.0.1:8000/api/${endpoint}`;

      if (isEditMode) {
        await axios.put(url, payload, config);
        Swal.fire({
          icon: "success",
          title: "Diperbarui!",
          text: "Transaksi berhasil diubah.",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        await axios.post(url, payload, config);
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Transaksi baru telah dicatat.",
          timer: 2000,
          showConfirmButton: false,
        });
      }

      handleCloseModal();
      fetchData();
    } catch (error) {
      console.error(error.response?.data);
      Swal.fire({
        icon: "error",
        title: "Gagal Menyimpan",
        text: error.response?.data?.message || "Terjadi kesalahan server.",
        confirmButtonColor: "#1A3263",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==========================================
  // 5. KENDALI HAPUS (DELETE)
  // ==========================================
  const handleDelete = (id, type) => {
    Swal.fire({
      title: "Hapus Transaksi?",
      text: "Data keuangan ini akan dihapus permanen.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token");
          const endpoint = type === "in" ? "incomes" : "expenses";

          await axios.delete(`http://127.0.0.1:8000/api/${endpoint}/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          Swal.fire({
            icon: "success",
            title: "Terhapus!",
            text: "Transaksi berhasil dihapus.",
            timer: 2000,
            showConfirmButton: false,
          });
          fetchData();
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Gagal Menghapus",
            text: "Terjadi kesalahan saat menghapus data.",
          });
        }
      }
    });
  };

  // ==========================================
  // 6. ANTARMUKA PENGGUNA (UI)
  // ==========================================
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Laporan Keuangan
          </h1>
          <p className="text-gray-500">
            Pantau arus kas masuk dan keluar PT Jaya Diga Innovation.
          </p>
        </div>
        <div className="flex gap-3">
          {/* <button className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2.5 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition cursor-pointer">
            <Download size={18} /> Cetak PDF
          </button> */}
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 bg-[#1A3263] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#25468a] transition shadow-lg shadow-blue-900/20 cursor-pointer"
          >
            <Plus size={20} /> Transaksi Baru
          </button>
        </div>
      </div>

      {/* Ringkasan Saldo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1A3263] p-6 rounded-2xl shadow-lg shadow-blue-900/20 text-white">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-white/10 rounded-lg">
              <Wallet size={24} />
            </div>
            <span className="text-[10px] bg-white/20 px-2 py-1 rounded font-bold uppercase">
              Total Saldo
            </span>
          </div>
          <p className="text-blue-100 text-sm">Saldo Saat Ini</p>
          <h3 className="text-2xl font-bold mt-1">
            {formatRupiah(summary.totalSaldo)}
          </h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
              <TrendingUp size={24} />
            </div>
            <span className="text-[10px] bg-green-50 text-green-600 px-2 py-1 rounded font-bold uppercase">
              Bulan Ini
            </span>
          </div>
          <p className="text-gray-500 text-sm">Total Pemasukan</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">
            {formatRupiah(summary.pemasukanBulanIni)}
          </h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-red-100 text-red-600 rounded-lg">
              <TrendingDown size={24} />
            </div>
            <span className="text-[10px] bg-red-50 text-red-600 px-2 py-1 rounded font-bold uppercase">
              Bulan Ini
            </span>
          </div>
          <p className="text-gray-500 text-sm">Total Pengeluaran</p>
          <h3 className="text-2xl font-bold text-red-600 mt-1">
            - {formatRupiah(summary.pengeluaranBulanIni)}
          </h3>
        </div>
      </div>

      {/* Tabel Transaksi */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-800">
            Riwayat Transaksi Terakhir
          </h3>
          <button className="flex items-center gap-2 text-gray-500 text-sm font-bold hover:text-[#1A3263] cursor-pointer">
            <Filter size={18} /> Filter
          </button>
        </div>
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-sm min-w-max">
            <thead className="bg-gray-50 text-gray-400 font-bold uppercase text-[10px]">
              <tr>
                <th className="px-6 py-4">Tanggal</th>
                <th className="px-6 py-4">Keterangan Transaksi</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4 text-right">Nominal</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="py-10 text-center text-gray-500 font-medium"
                  >
                    Memuat data keuangan...
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="py-10 text-center text-gray-500 font-medium"
                  >
                    Belum ada riwayat transaksi.
                  </td>
                </tr>
              ) : (
                transactions.map((t) => (
                  <tr
                    key={`${t.type}-${t.id}`}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-gray-500">
                      {formatDate(t.date)}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-800">
                      {t.description}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-[10px] font-bold uppercase tracking-wider border border-gray-200">
                        {t.category}
                      </span>
                    </td>
                    <td
                      className={`px-6 py-4 text-right font-bold ${t.type === "in" ? "text-green-600" : "text-red-600"}`}
                    >
                      {t.type === "in" ? "+" : "-"} {formatRupiah(t.amount)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => handleOpenEdit(t)}
                          className="text-amber-500 hover:text-amber-700 transition cursor-pointer"
                          title="Edit Transaksi"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(t.id, t.type)}
                          className="text-red-500 hover:text-red-700 transition cursor-pointer"
                          title="Hapus Transaksi"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================== */}
      {/* MODAL FORM TAMBAH / EDIT TRANSAKSI */}
      {/* ========================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden my-auto">
            <div className="bg-[#1A3263] px-6 py-4 flex justify-between items-center text-white">
              <h3 className="font-bold text-lg">
                {isEditMode ? "Edit Transaksi" : "Catat Transaksi Baru"}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-blue-200 hover:text-white transition cursor-pointer"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Tipe Transaksi */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Jenis Transaksi
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      value="in"
                      checked={formData.type === "in"}
                      onChange={handleInputChange}
                      disabled={isEditMode}
                      className="w-4 h-4 text-[#1A3263]"
                    />
                    <span className="font-medium text-gray-700">
                      Pemasukan (Income)
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      value="out"
                      checked={formData.type === "out"}
                      onChange={handleInputChange}
                      disabled={isEditMode}
                      className="w-4 h-4 text-red-600"
                    />
                    <span className="font-medium text-gray-700">
                      Pengeluaran (Expense)
                    </span>
                  </label>
                </div>
              </div>

              {/* Kondisional: Tampil Hanya Jika Jenis = Pemasukan */}
              {formData.type === "in" && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Referensi Invoice
                  </label>
                  <select
                    name="invoice_id"
                    value={formData.invoice_id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3263] outline-none transition-all bg-white"
                    required
                  >
                    <option value="" disabled>
                      -- Pilih Invoice --
                    </option>
                    {invoices.map((inv) => (
                      <option key={inv.id} value={inv.id}>
                        {inv.invoice_code} - Rp {inv.total}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Tanggal Transaksi
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3263] outline-none transition-all"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Keterangan / Sumber
                </label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder={
                    formData.type === "in"
                      ? "Contoh: Pelunasan Termin 1"
                      : "Contoh: Beli Material Baja"
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3263] outline-none transition-all"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Kategori
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="Contoh: Proyek / Operasional / Bahan Baku"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3263] outline-none transition-all"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Nominal (Rp)
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="Contoh: 150000000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3263] outline-none transition-all"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 mt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 text-gray-600 font-bold bg-gray-100 hover:bg-gray-200 rounded-lg transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 text-white font-bold bg-[#1A3263] hover:bg-[#122345] rounded-lg transition shadow-md cursor-pointer disabled:opacity-75"
                >
                  {isSubmitting
                    ? "Menyimpan..."
                    : isEditMode
                      ? "Update Transaksi"
                      : "Simpan Transaksi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default KeuanganPage;
