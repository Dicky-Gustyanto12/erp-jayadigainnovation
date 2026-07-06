import React from "react";
import {
  Briefcase,
  Building2,
  MapPin,
  Calendar,
  Clock,
  Flag,
} from "lucide-react";

const Project = ({ data, onClose }) => {
  if (!data) return null;

  // Alat bantu format tanggal
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
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 max-w-2xl mx-auto w-full">
      {/* HEADER KARTU (WARNA BIRU) */}
      <div className="bg-[#1A3263] p-8 text-white text-center relative flex flex-col items-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-blue-200 hover:text-white transition font-bold cursor-pointer"
        >
          ✕
        </button>

        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg border-4 border-[#25468a]">
          <Briefcase size={48} className="text-[#1A3263]" />
        </div>

        <h2 className="text-2xl font-bold px-4 leading-tight mb-2">
          {data.project_name}
        </h2>

        <div className="flex items-center justify-center gap-3 mt-1">
          <p className="text-blue-200 text-sm font-medium">
            {data.project_code || `PJ-${data.id}`}
          </p>
          <span className="text-blue-200 text-sm">•</span>
          {/* Badge Status di Header */}
          <span className="text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full bg-white text-[#1A3263] shadow-sm">
            {data.status || "Perencanaan"}
          </span>
        </div>
      </div>

      {/* DETAIL INFO PROYEK */}
      <div className="p-8">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6 border-b pb-2">
          Informasi Pekerjaan
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start gap-3 md:col-span-2 border-b border-gray-100 pb-4">
            <div className="bg-blue-50 p-2 rounded-lg text-[#1A3263] shrink-0">
              <Building2 size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold mb-0.5">
                Client / Mitra Bisnis
              </p>
              <p className="text-gray-900 font-bold text-lg">
                {data.client?.company || (
                  <span className="text-red-400 italic font-normal">
                    Tidak ada data Client
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-blue-50 p-2 rounded-lg text-[#1A3263] shrink-0">
              <MapPin size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold mb-0.5">
                Lokasi Proyek
              </p>
              <p className="text-gray-900 font-medium">{data.place || "-"}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-orange-50 p-2 rounded-lg text-orange-600 shrink-0">
              <Flag size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold mb-0.5">
                Tenggat Waktu (Deadline)
              </p>
              <p className="text-gray-900 font-bold">
                {formatDate(data.deadline)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-green-50 p-2 rounded-lg text-green-600 shrink-0">
              <Calendar size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold mb-0.5">
                Tanggal Mulai (Start)
              </p>
              <p className="text-gray-900 font-medium">
                {formatDate(data.start_at)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-purple-50 p-2 rounded-lg text-purple-600 shrink-0">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold mb-0.5">
                Tanggal Selesai (End)
              </p>
              <p className="text-gray-900 font-medium">
                {formatDate(data.end_at)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end">
        <button
          onClick={onClose}
          className="px-6 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-bold hover:bg-gray-100 transition cursor-pointer"
        >
          Tutup Detail
        </button>
      </div>
    </div>
  );
};

export default Project;
