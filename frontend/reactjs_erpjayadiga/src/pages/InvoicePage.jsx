import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Eye,
  Plus,
  Search,
  Filter,
  X,
  Edit,
  Trash2,
  PlusCircle,
} from "lucide-react";
import Swal from "sweetalert2";
// Pastikan nama komponen cetakmu disesuaikan di sini:
import PrintableInvoice from "../components/PrintableInvoice";

const InvoicePage = () => {
  // ==========================================
  // 1. STATE (DATA & SAKLAR)
  // ==========================================
  const [invoices, setInvoices] = useState([]);
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // State Modal Detail
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // State Modal Form (Create/Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State Form Dinamis (Ditambah array 'items')
  const [formData, setFormData] = useState({
    client_id: "",
    project_id: "",
    total: 0,
    invoice_date: "",
    due_date: "",
    status: "Pending",
    items: [
      {
        item_type: "barang",
        description: "",
        qty: 1,
        unit: "unit",
        unit_price: 0,
        subtotal: 0,
      },
    ],
  });

  // ==========================================
  // 2. FUNGSI PENJEMPUT DATA
  // ==========================================
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const [resInvoices, resClients, resProjects] = await Promise.all([
        axios.get("http://127.0.0.1:8000/api/invoices", config),
        axios.get("http://127.0.0.1:8000/api/clients", config),
        axios.get("http://127.0.0.1:8000/api/projects", config),
      ]);

      setInvoices(resInvoices.data.data);
      setClients(resClients.data.data);
      setProjects(resProjects.data.data);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal Memuat Data",
        text: "Pastikan server backend berjalan.",
        confirmButtonColor: "#1A3263",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Efek untuk menghitung ulang Grand Total secara otomatis setiap kali 'items' berubah
  useEffect(() => {
    const calculatedTotal = formData.items.reduce(
      (sum, item) => sum + (Number(item.subtotal) || 0),
      0,
    );
    setFormData((prev) => ({ ...prev, total: calculatedTotal }));
  }, [formData.items]);

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
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  // ==========================================
  // 4. KENDALI FORM INDUK (HEADER INVOICE)
  // ==========================================
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "client_id") {
      setFormData({ ...formData, client_id: value, project_id: "" });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // ==========================================
  // 5. KENDALI BARIS ITEM (DYNAMIC ROWS)
  // ==========================================
  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          item_type: "barang",
          description: "",
          qty: 1,
          unit: "unit",
          unit_price: 0,
          subtotal: 0,
        },
      ],
    });
  };

  const handleRemoveItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;

    // Auto-calculate subtotal for the row
    if (field === "qty" || field === "unit_price") {
      newItems[index].subtotal =
        Number(newItems[index].qty) * Number(newItems[index].unit_price);
    }

    setFormData({ ...formData, items: newItems });
  };

  // ==========================================
  // 6. KENDALI MODAL & SUBMIT
  // ==========================================
  const handleOpenAdd = () => {
    setFormData({
      client_id: "",
      project_id: "",
      total: 0,
      invoice_date: "",
      due_date: "",
      status: "Pending",
      items: [
        {
          item_type: "barang",
          description: "",
          qty: 1,
          unit: "unit",
          unit_price: 0,
          subtotal: 0,
        },
      ],
    });
    setIsEditMode(false);
    setEditId(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (inv) => {
    setFormData({
      client_id: inv.client_id || "",
      project_id: inv.project_id || "",
      total: inv.total || 0,
      invoice_date: inv.invoice_date || "",
      due_date: inv.due_date || "",
      status: inv.status || "Pending",
      // Jika relasi items sudah dikirim dari backend, gunakan itu. Jika tidak, sediakan array kosong.
      items:
        inv.items && inv.items.length > 0
          ? inv.items
          : [
              {
                item_type: "barang",
                description: "",
                qty: 1,
                unit: "unit",
                unit_price: 0,
                subtotal: 0,
              },
            ],
    });
    setIsEditMode(true);
    setEditId(inv.id);
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

      if (isEditMode) {
        await axios.put(
          `http://127.0.0.1:8000/api/invoices/${editId}`,
          formData,
          config,
        );
        Swal.fire({
          icon: "success",
          title: "Diperbarui!",
          text: "Invoice berhasil diubah.",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        await axios.post(
          "http://127.0.0.1:8000/api/invoices",
          formData,
          config,
        );
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Invoice baru diterbitkan.",
          timer: 2000,
          showConfirmButton: false,
        });
      }

      handleCloseModal();
      fetchData();
    } catch (error) {
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

  const handleDelete = (id, code) => {
    Swal.fire({
      title: "Hapus Invoice?",
      text: `Anda yakin ingin menghapus invoice ${code}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Ya, Hapus!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token");
          await axios.delete(`http://127.0.0.1:8000/api/invoices/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          Swal.fire({
            icon: "success",
            title: "Terhapus!",
            timer: 2000,
            showConfirmButton: false,
          });
          fetchData();
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Gagal",
            text: "Terjadi kesalahan saat menghapus data.",
          });
        }
      }
    });
  };

  // ==========================================
  // 7. ANTARMUKA PENGGUNA (UI)
  // ==========================================
  return (
    <div className="relative">
      {/* HEADER & PENCARIAN (Sama seperti sebelumnya) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Manajemen Invoice
          </h1>
          <p className="text-gray-500 mt-1">
            Kelola dan pantau semua tagihan beserta rincian itemnya.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 bg-[#1A3263] px-5 py-2.5 rounded-lg text-white font-bold hover:bg-[#122345] transition shadow-md cursor-pointer"
        >
          <Plus size={20} /> Buat Invoice Baru
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Cari klien atau nomor invoice..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3263] outline-none"
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition cursor-pointer">
          <Filter size={20} /> Filter
        </button>
      </div>

      {/* TABEL DATA INDUK */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left table-auto min-w-max">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold border-b border-gray-200">
              <tr>
                <th className="py-4 px-6">ID Invoice</th>
                <th className="py-4 px-6">Klien</th>
                <th className="py-4 px-6">Proyek</th>
                <th className="py-4 px-6">Jatuh Tempo</th>
                <th className="py-4 px-6 text-right">Grand Total</th>
                <th className="py-4 px-6 text-center">Status</th>
                <th className="py-4 px-6 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="py-10 text-center text-gray-500 font-medium"
                  >
                    Sedang memuat data...
                  </td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="py-10 text-center text-gray-500 font-medium"
                  >
                    Belum ada data invoice.
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50 transition">
                    <td className="py-4 px-6 font-bold text-[#1A3263]">
                      {inv.invoice_code || `INV-${inv.id}`}
                    </td>
                    <td className="py-4 px-6 text-gray-700 font-medium">
                      {inv.client?.company || (
                        <span className="text-red-400 italic">Tanpa Klien</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {inv.project?.project_name || "-"}
                    </td>
                    <td className="py-4 px-6 text-gray-600 font-medium">
                      {formatDate(inv.due_date)}
                    </td>
                    <td className="py-4 px-6 font-bold text-gray-900 text-right">
                      {formatRupiah(inv.total)}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider border ${
                          (inv.status || "PENDING").toUpperCase() === "LUNAS"
                            ? "bg-green-100 text-green-700 border-green-200"
                            : "bg-orange-100 text-orange-700 border-orange-200"
                        }`}
                      >
                        {inv.status || "PENDING"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => setSelectedInvoice(inv)}
                          className="text-blue-500 hover:text-blue-700 transition"
                          title="Lihat/Cetak Invoice"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(inv)}
                          className="text-amber-500 hover:text-amber-700 transition"
                          title="Edit Invoice"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(
                              inv.id,
                              inv.invoice_code || `INV-${inv.id}`,
                            )
                          }
                          className="text-red-500 hover:text-red-700 transition"
                          title="Hapus Invoice"
                        >
                          <Trash2 size={18} />
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
      {/* 1. POP-UP DETAIL / PRINTABLE INVOICE       */}
      {/* ========================================== */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          {/* Memanggil komponen cetak (PrintableInvoice) di sini */}
          <div className="w-full max-w-5xl my-auto">
            <PrintableInvoice
              data={selectedInvoice}
              onClose={() => setSelectedInvoice(null)}
            />
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 2. POP-UP FORM DINAMIS BUAT / EDIT INVOICE */}
      {/* ========================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          {/* Modal dilebarkan jadi max-w-5xl agar tabel rincian muat */}
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
            <div className="bg-[#1A3263] px-6 py-4 flex justify-between items-center text-white shrink-0">
              <h3 className="font-bold text-lg">
                {isEditMode ? "Edit Invoice & Rincian" : "Buat Invoice Baru"}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-blue-200 hover:text-white transition cursor-pointer"
              >
                <X size={24} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6 overflow-y-auto flex-1 flex flex-col gap-8"
            >
              {/* --- BAGIAN ATAS: INFO UTAMA --- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Pilih Klien
                  </label>
                  <select
                    name="client_id"
                    value={formData.client_id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3263] outline-none"
                    required
                    disabled={isSubmitting}
                  >
                    <option value="" disabled>
                      -- Pilih Klien --
                    </option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.company}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Pilih Proyek (Opsional)
                  </label>
                  <select
                    name="project_id"
                    value={formData.project_id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3263] outline-none"
                    disabled={isSubmitting || !formData.client_id}
                  >
                    <option value="">-- Pilih Proyek --</option>
                    {projects
                      .filter(
                        (p) =>
                          String(p.client_id) === String(formData.client_id),
                      )
                      .map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.project_name}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Tanggal Terbit
                  </label>
                  <input
                    type="date"
                    name="invoice_date"
                    value={formData.invoice_date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3263] outline-none"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Jatuh Tempo
                  </label>
                  <input
                    type="date"
                    name="due_date"
                    value={formData.due_date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3263] outline-none"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* --- BAGIAN BAWAH: RINCIAN ITEM DINAMIS --- */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-bold text-gray-800 border-b-2 border-[#1A3263] pb-1">
                    Rincian Pekerjaan / Tagihan
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="flex items-center gap-1.5 text-sm bg-blue-50 text-[#1A3263] px-3 py-1.5 rounded font-bold hover:bg-blue-100 transition"
                  >
                    <PlusCircle size={16} /> Tambah Baris
                  </button>
                </div>

                <div className="border border-gray-200 rounded-lg overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-gray-100 text-gray-600 font-semibold border-b border-gray-200">
                      <tr>
                        <th className="py-3 px-4 w-32">Tipe Baris</th>
                        <th className="py-3 px-4 min-w-[200px]">
                          Deskripsi Pekerjaan
                        </th>
                        <th className="py-3 px-4 w-24">Qty</th>
                        <th className="py-3 px-4 w-24">Satuan</th>
                        <th className="py-3 px-4 w-40">Harga Satuan</th>
                        <th className="py-3 px-4 w-40 text-right">Subtotal</th>
                        <th className="py-3 px-4 w-12 text-center">X</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {formData.items.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="p-2">
                            <select
                              value={item.item_type}
                              onChange={(e) =>
                                handleItemChange(
                                  index,
                                  "item_type",
                                  e.target.value,
                                )
                              }
                              className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#1A3263] outline-none bg-white"
                            >
                              <option value="barang">Barang/Jasa</option>
                              <option value="dp">Uang Muka (DP)</option>
                              <option value="pelunasan">Pelunasan</option>
                            </select>
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) =>
                                handleItemChange(
                                  index,
                                  "description",
                                  e.target.value,
                                )
                              }
                              placeholder="Contoh: Pembuatan Flying Fox"
                              className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#1A3263] outline-none"
                              required
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              min="1"
                              value={item.qty}
                              onChange={(e) =>
                                handleItemChange(index, "qty", e.target.value)
                              }
                              className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#1A3263] outline-none text-center"
                              required
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={item.unit}
                              onChange={(e) =>
                                handleItemChange(index, "unit", e.target.value)
                              }
                              placeholder="ls/unit"
                              className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#1A3263] outline-none text-center"
                              required
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              value={item.unit_price}
                              onChange={(e) =>
                                handleItemChange(
                                  index,
                                  "unit_price",
                                  e.target.value,
                                )
                              }
                              className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#1A3263] outline-none"
                              required
                            />
                          </td>
                          <td className="p-2 text-right font-bold text-gray-700 bg-gray-50">
                            {formatRupiah(item.subtotal)}
                          </td>
                          <td className="p-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(index)}
                              className="text-red-400 hover:text-red-600 transition"
                              disabled={formData.items.length === 1}
                            >
                              <Trash2 size={18} className="mx-auto" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-100 border-t-2 border-gray-300">
                      <tr>
                        <td
                          colSpan="5"
                          className="py-3 px-4 text-right font-bold text-gray-700"
                        >
                          GRAND TOTAL TAGIHAN:
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-[#1A3263] text-lg">
                          {formatRupiah(formData.total)}
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* --- STATUS & TOMBOL SIMPAN --- */}
              <div className="flex flex-col md:flex-row justify-between items-end border-t border-gray-100 pt-5 mt-auto">
                <div className="w-full md:w-1/3 mb-4 md:mb-0">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Status Pembayaran
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3263] outline-none bg-white font-medium text-gray-800"
                    disabled={isSubmitting}
                  >
                    <option value="Pending">Pending / Belum Lunas</option>
                    <option value="Lunas">Lunas (Tercatat di Arus Kas)</option>
                    <option value="Dibatalkan">Dibatalkan</option>
                  </select>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    disabled={isSubmitting}
                    className="flex-1 md:flex-none px-6 py-2.5 text-gray-600 font-bold bg-gray-100 hover:bg-gray-200 rounded-lg transition cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 md:flex-none px-6 py-2.5 text-white font-bold bg-[#1A3263] hover:bg-[#122345] rounded-lg transition shadow-md cursor-pointer disabled:opacity-75"
                  >
                    {isSubmitting
                      ? "Menyimpan..."
                      : isEditMode
                        ? "Update Master & Rincian"
                        : "Simpan Invoice"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoicePage;
