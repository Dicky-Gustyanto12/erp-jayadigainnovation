import React from "react";
import { User, Phone, Mail, MapPin, Briefcase, Hash } from "lucide-react";

const Karyawan = ({ data, onClose }) => {
  if (!data) return null;

  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 max-w-2xl mx-auto w-full">
      {/* Header Profil */}
      <div className="bg-[#1A3263] p-8 text-white text-center relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-blue-200 hover:text-white transition font-bold cursor-pointer"
        >
          ✕
        </button>
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg border-4 border-[#25468a]">
          <User size={48} className="text-[#1A3263]" />
        </div>
        <h2 className="text-2xl font-bold">{data.name}</h2>
        <p className="text-blue-200 text-sm mt-1">
          {data.department || "Departemen Umum"}
        </p>
      </div>

      {/* Detail Info Karyawan */}
      <div className="p-8">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6 border-b pb-2">
          Informasi Karyawan
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start gap-3">
            <div className="bg-blue-50 p-2 rounded-lg text-[#1A3263]">
              <Hash size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold mb-0.5">
                ID Karyawan
              </p>
              <p className="text-gray-900 font-bold">
                {data.employee_code || `EMP-${data.id}`}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-blue-50 p-2 rounded-lg text-[#1A3263]">
              <Briefcase size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold mb-0.5">
                Departemen
              </p>
              <p className="text-gray-900 font-medium">
                {data.department || "-"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-blue-50 p-2 rounded-lg text-[#1A3263]">
              <Phone size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold mb-0.5">
                Nomor Kontak
              </p>
              <p className="text-gray-900 font-medium">{data.contact || "-"}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-blue-50 p-2 rounded-lg text-[#1A3263]">
              <Mail size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold mb-0.5">
                Email
              </p>
              <p className="text-gray-900 font-medium">{data.email || "-"}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 md:col-span-2">
            <div className="bg-blue-50 p-2 rounded-lg text-[#1A3263]">
              <MapPin size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold mb-0.5">
                Alamat Tempat Tinggal
              </p>
              <p className="text-gray-900 font-medium leading-relaxed">
                {data.address || "-"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end">
        <button
          onClick={onClose}
          className="px-6 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-bold hover:bg-gray-100 transition cursor-pointer"
        >
          Tutup Profil
        </button>
      </div>
    </div>
  );
};

export default Karyawan;
