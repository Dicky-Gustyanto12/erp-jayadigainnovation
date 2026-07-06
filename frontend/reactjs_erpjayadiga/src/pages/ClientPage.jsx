import React, { useState, useEffect } from "react";
import axios from "axios";
import { Eye, Plus, Search, Building2, X, Edit, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import Client from "../components/Client";

const ClientPage = () => {
  // ==========================================
  // 1. STATE (DATA & SAKLAR)
  // ==========================================
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // State Pop-up Detail
  const [selectedClient, setSelectedClient] = useState(null);

  // State Form Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    company: "",
    contact: "",
    email: "",
    address: "",
  });

  // ==========================================
  // 2. FUNGSI READ (GET)
  // ==========================================
  const fetchClients = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://127.0.0.1:8000/api/clients", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClients(response.data.data);
    } catch (error) {
      console.error("Gagal mengambil data Client:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal Memuat Data",
        text: "Pastikan server backend Laravel sudah berjalan.",
        confirmButtonColor: "#1A3263",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // ==========================================
  // 3. FUNGSI KENDALI FORM (CREATE & UPDATE)
  // ==========================================
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleOpenAdd = () => {
    setFormData({ company: "", contact: "", email: "", address: "" });
    setIsEditMode(false);
    setEditId(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (client) => {
    setFormData({
      company: client.company,
      contact: client.contact || "",
      email: client.email || "",
      address: client.address || "",
    });
    setIsEditMode(true);
    setEditId(client.id);
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

      if (isEditMode) {
        await axios.put(
          `http://127.0.0.1:8000/api/clients/${editId}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        Swal.fire({
          icon: "success",
          title: "Diperbarui!",
          text: "Data Client berhasil diubah.",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        await axios.post("http://127.0.0.1:8000/api/clients", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Data Client baru telah ditambahkan.",
          timer: 2000,
          showConfirmButton: false,
        });
      }

      handleCloseModal();
      fetchClients();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal Menyimpan",
        text: error.response?.data?.message || "Terjadi kesalahan pada server.",
        confirmButtonColor: "#1A3263",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==========================================
  // 4. FUNGSI DELETE
  // ==========================================
  const handleDelete = (id, company) => {
    Swal.fire({
      title: "Hapus Data Client?",
      text: `Anda yakin ingin menghapus data ${company}? Data tidak dapat dikembalikan!`,
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
          await axios.delete(`http://127.0.0.1:8000/api/clients/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          Swal.fire({
            icon: "success",
            title: "Terhapus!",
            text: "Data Client berhasil dihapus.",
            timer: 2000,
            showConfirmButton: false,
          });

          fetchClients();
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Gagal Menghapus",
            text: "Terjadi kesalahan saat menghapus data.",
            confirmButtonColor: "#1A3263",
          });
        }
      }
    });
  };

  // ==========================================
  // 5. ANTARMUKA PENGGUNA (UI)
  // ==========================================
  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Building2 className="text-[#1A3263]" size={28} /> Data Client
          </h1>
          <p className="text-gray-500 mt-1">
            Kelola informasi dan profil mitra bisnis PT Jaya Diga Innovation.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-[#1A3263] px-5 py-2.5 rounded-lg text-white font-bold hover:bg-[#122345] transition shadow-md cursor-pointer"
        >
          <Plus size={20} /> Tambah Client
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Cari nama perusahaan atau kode Client..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3263] outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left table-auto min-w-max">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold border-b border-gray-200">
              <tr>
                <th className="py-4 px-4 text-center">ID</th>
                <th className="py-4 px-4">Kode Client</th>
                <th className="py-4 px-4">Nama Perusahaan</th>
                <th className="py-4 px-4">Alamat</th>
                <th className="py-4 px-4">Kontak</th>
                <th className="py-4 px-4">Email</th>
                <th className="py-4 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {isLoading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="py-10 text-center text-gray-500 font-medium"
                  >
                    Sedang memuat data...
                  </td>
                </tr>
              ) : clients.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="py-10 text-center text-gray-500 font-medium"
                  >
                    Belum ada data Client.
                  </td>
                </tr>
              ) : (
                clients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50 transition">
                    <td className="py-4 px-4 text-center font-bold text-gray-900">
                      {client.id}
                    </td>
                    <td className="py-4 px-4 font-semibold text-gray-700">
                      {client.client_code || "-"}
                    </td>
                    <td className="py-4 px-4 font-medium text-gray-800">
                      {client.company}
                    </td>
                    <td className="py-4 px-4 text-gray-600 max-w-xs truncate">
                      {client.address || "-"}
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {client.contact || "-"}
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {client.email || "-"}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => setSelectedClient(client)}
                          className="text-blue-500 hover:text-blue-700 transition cursor-pointer"
                          title="Lihat Detail"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(client)}
                          className="text-amber-500 hover:text-amber-700 transition cursor-pointer"
                          title="Edit Data"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(client.id, client.company)
                          }
                          className="text-red-500 hover:text-red-700 transition cursor-pointer"
                          title="Hapus Data"
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

      {/* MODAL DETAIL CLIENT */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <Client
            data={selectedClient}
            onClose={() => setSelectedClient(null)}
          />
        </div>
      )}

      {/* MODAL FORM TAMBAH / EDIT CLIENT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden my-auto">
            <div className="bg-[#1A3263] px-6 py-4 flex justify-between items-center text-white">
              <h3 className="font-bold text-lg">
                {isEditMode ? "Edit Data Client" : "Tambah Client Baru"}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-blue-200 hover:text-white transition cursor-pointer"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Kode Client (Otomatis / Tidak bisa diedit) */}

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Nama Perusahaan
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="Masukkan nama perusahaan"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3263] focus:border-[#1A3263] outline-none transition-all"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Nomor Kontak
                  </label>
                  <input
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    placeholder="Contoh: 08123456789"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3263] focus:border-[#1A3263] outline-none transition-all"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Alamat Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="contoh@perusahaan.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3263] focus:border-[#1A3263] outline-none transition-all"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Alamat Lengkap
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Masukkan alamat lengkap perusahaan"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3263] focus:border-[#1A3263] outline-none transition-all resize-none"
                    disabled={isSubmitting}
                  ></textarea>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 mt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 text-gray-600 font-bold bg-gray-100 hover:bg-gray-200 rounded-lg transition cursor-pointer disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 text-white font-bold bg-[#1A3263] hover:bg-[#122345] rounded-lg transition shadow-md cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {isSubmitting
                    ? "Menyimpan..."
                    : isEditMode
                      ? "Update Data"
                      : "Simpan Client Baru"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientPage;
