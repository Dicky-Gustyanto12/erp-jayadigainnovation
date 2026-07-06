import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Eye,
  Plus,
  Search,
  Filter,
  Briefcase,
  X,
  Edit,
  Trash2,
  MapPin,
  Calendar,
  Building2,
} from "lucide-react";
import Swal from "sweetalert2";
import Project from "../components/Project";

const ProjectPage = () => {
  // ==========================================
  // 1. STATE (DATA & SAKLAR)
  // ==========================================
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Data dengan Default Status "Perencanaan"
  const [formData, setFormData] = useState({
    project_name: "",
    client_id: "",
    place: "",
    start_at: "",
    end_at: "",
    deadline: "",
    status: "Perencanaan",
  });

  // ==========================================
  // 2. FUNGSI PENJEMPUT DATA (GET)
  // ==========================================
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const [resProjects, resClients] = await Promise.all([
        axios.get("http://127.0.0.1:8000/api/projects", config),
        axios.get("http://127.0.0.1:8000/api/clients", config),
      ]);

      setProjects(resProjects.data.data);
      setClients(resClients.data.data);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
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
    fetchData();
  }, []);

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
  // 3. FUNGSI KENDALI FORM (CREATE & UPDATE)
  // ==========================================
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOpenAdd = () => {
    setFormData({
      project_name: "",
      client_id: "",
      place: "",
      start_at: "",
      end_at: "",
      deadline: "",
      status: "Perencanaan", // Default
    });
    setIsEditMode(false);
    setEditId(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (proj) => {
    setFormData({
      project_name: proj.project_name,
      client_id: proj.client_id || "",
      place: proj.place || "",
      start_at: proj.start_at || "",
      end_at: proj.end_at || "",
      deadline: proj.deadline || "",
      status: proj.status || "Perencanaan",
    });
    setIsEditMode(true);
    setEditId(proj.id);
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
        // PUT data lengkap ke Laravel termasuk 'status'
        await axios.put(
          `http://127.0.0.1:8000/api/projects/${editId}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        Swal.fire({
          icon: "success",
          title: "Diperbarui!",
          text: "Data Proyek berhasil diubah.",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        // POST data lengkap ke Laravel termasuk 'status'
        await axios.post("http://127.0.0.1:8000/api/projects", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Proyek baru telah ditambahkan.",
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
  const handleDelete = (id, name) => {
    Swal.fire({
      title: "Hapus Proyek?",
      text: `Anda yakin ingin menghapus proyek ${name}? Data tidak dapat dikembalikan!`,
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
          await axios.delete(`http://127.0.0.1:8000/api/projects/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          Swal.fire({
            icon: "success",
            title: "Terhapus!",
            text: "Data Proyek berhasil dihapus.",
            timer: 2000,
            showConfirmButton: false,
          });

          fetchData();
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
      {/* Header Halaman */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3 tracking-tight">
            <Briefcase className="text-[#1A3263]" size={28} /> Manajemen Proyek
          </h1>
          <p className="text-gray-500 mt-1">
            Pantau progres pekerjaan lapangan dan workshop.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 bg-[#1A3263] text-white px-5 py-2.5 rounded-lg font-bold hover:bg-[#122345] transition-all shadow-md cursor-pointer"
        >
          <Plus size={20} /> Proyek Baru
        </button>
      </div>

      {/* Kontrol & Filter */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6">
        <div className="relative flex-1 w-full">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Cari nama proyek atau lokasi..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3263] outline-none transition-all"
          />
        </div>
        <div className="h-8 w-[1px] bg-gray-200 hidden md:block"></div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition cursor-pointer">
          <Filter size={18} /> Filter Status
        </button>
      </div>

      {/* TAMPILAN GRID CARD PROYEK */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-10 text-center text-gray-500 font-medium">
            Sedang memuat data proyek...
          </div>
        ) : projects.length === 0 ? (
          <div className="col-span-full py-10 text-center text-gray-500 font-medium bg-white rounded-xl border border-gray-200 border-dashed">
            Belum ada proyek yang terdaftar.
          </div>
        ) : (
          projects.map((proj) => {
            // Logika Warna Status
            const statusText = proj.status || "Perencanaan";
            let statusColor =
              "bg-gray-100 text-gray-600 border border-gray-200";

            if (statusText === "Perencanaan")
              statusColor =
                "bg-amber-100 text-amber-700 border border-amber-200";
            if (statusText === "Sedang Berjalan")
              statusColor = "bg-blue-100 text-[#1A3263] border border-blue-200";
            if (statusText === "Selesai")
              statusColor =
                "bg-green-100 text-green-700 border border-green-200";
            if (statusText === "Batal")
              statusColor = "bg-red-100 text-red-700 border border-red-200";

            return (
              <div
                key={proj.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden border border-gray-200"
              >
                {/* Header Card (Biru Solid) */}
                <div className="bg-[#1A3263] p-5">
                  <span className="inline-block text-xs font-bold text-[#1A3263] bg-white px-2.5 py-1 rounded-md shadow-sm">
                    {proj.project_code || `PJ-${proj.id}`}
                  </span>
                  <h3 className="font-bold text-lg text-white mt-3 line-clamp-2 leading-tight">
                    {proj.project_name}
                  </h3>
                </div>

                {/* Body Card (Putih) */}
                <div className="p-5 flex-1 flex flex-col">
                  {/* Badge Status Statis */}
                  <div className="mb-4">
                    <span
                      className={`text-[10px] uppercase tracking-wider font-bold px-3 py-1.5 rounded-full ${statusColor}`}
                    >
                      {statusText}
                    </span>
                  </div>

                  {/* Detail Info */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 text-sm text-gray-600">
                      <Building2
                        size={16}
                        className="mt-0.5 text-gray-400 shrink-0"
                      />
                      <span className="line-clamp-1 font-medium text-gray-800">
                        {proj.client?.company || (
                          <i className="text-red-400 font-normal">
                            Tidak ada data Client
                          </i>
                        )}
                      </span>
                    </div>

                    <div className="flex items-start gap-3 text-sm text-gray-600">
                      <MapPin
                        size={16}
                        className="mt-0.5 text-gray-400 shrink-0"
                      />
                      <span className="line-clamp-1">{proj.place || "-"}</span>
                    </div>

                    <div className="flex items-start gap-3 text-sm text-gray-600">
                      <Calendar
                        size={16}
                        className="mt-0.5 text-gray-400 shrink-0"
                      />
                      <span>
                        Deadline:{" "}
                        <span className="font-semibold text-gray-800">
                          {formatDate(proj.deadline)}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Card (Aksi) */}
                <div className="px-5 py-4 border-t border-gray-100 flex justify-end gap-2 bg-gray-50">
                  <button
                    onClick={() => setSelectedProject(proj)}
                    className="p-2 text-blue-500 hover:bg-blue-100 rounded-lg transition cursor-pointer"
                    title="Lihat Detail"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(proj)}
                    className="p-2 text-amber-500 hover:bg-amber-100 rounded-lg transition cursor-pointer"
                    title="Edit Proyek"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(proj.id, proj.project_name)}
                    className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition cursor-pointer"
                    title="Hapus Proyek"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ========================================== */}
      {/* AREA MODAL / POP-UP */}
      {/* ========================================== */}

      {/* MODAL DETAIL PROYEK */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <Project
            data={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        </div>
      )}

      {/* MODAL FORM TAMBAH / EDIT PROYEK */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden my-auto">
            <div className="bg-[#1A3263] px-6 py-4 flex justify-between items-center text-white">
              <h3 className="font-bold text-lg">
                {isEditMode ? "Edit Data Proyek" : "Buat Proyek Baru"}
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
                {/* Nama Proyek */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Nama Proyek
                  </label>
                  <input
                    type="text"
                    name="project_name"
                    value={formData.project_name}
                    onChange={handleInputChange}
                    placeholder="Contoh: Pembuatan Conveyor Belt"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3263] focus:border-[#1A3263] outline-none transition-all"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                {/* Dropdown Client */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Pilih Client
                  </label>
                  <select
                    name="client_id"
                    value={formData.client_id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3263] focus:border-[#1A3263] outline-none transition-all bg-white"
                    required
                    disabled={isSubmitting}
                  >
                    <option value="" disabled>
                      -- Pilih Perusahaan Client --
                    </option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.company} - {client.client_code}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Lokasi / Place */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Lokasi Pekerjaan
                  </label>
                  <input
                    type="text"
                    name="place"
                    value={formData.place}
                    onChange={handleInputChange}
                    placeholder="Contoh: Workshop Internal / Pabrik Client"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3263] focus:border-[#1A3263] outline-none transition-all"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Dropdown Status (Penyimpanan ke Backend) */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Status Proyek
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3263] focus:border-[#1A3263] outline-none transition-all bg-white font-medium"
                    disabled={isSubmitting}
                  >
                    <option value="Perencanaan">Perencanaan</option>
                    <option value="Sedang Berjalan">Sedang Berjalan</option>
                    <option value="Selesai">Selesai</option>
                    <option value="Batal">Batal</option>
                  </select>
                </div>

                {/* Tanggal Mulai */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Tanggal Mulai (Start)
                  </label>
                  <input
                    type="date"
                    name="start_at"
                    value={formData.start_at}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3263] focus:border-[#1A3263] outline-none transition-all text-gray-700"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Tanggal Selesai Aktual */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Tanggal Selesai (End)
                  </label>
                  <input
                    type="date"
                    name="end_at"
                    value={formData.end_at}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3263] focus:border-[#1A3263] outline-none transition-all text-gray-700"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Tenggat Waktu (Deadline) */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Tenggat Waktu (Deadline)
                  </label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3263] focus:border-[#1A3263] outline-none transition-all text-gray-700"
                    required
                    disabled={isSubmitting}
                  />
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
                      ? "Update Proyek"
                      : "Simpan Proyek Baru"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectPage;
