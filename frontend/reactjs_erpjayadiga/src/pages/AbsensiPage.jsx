import React, { useState } from 'react';
import { Search, Download } from 'lucide-react';
import Absensi from '../components/Absensi';

const AbsensiPage = () => {
  // Pastikan data ini tidak undefined
  const [dataAbsensi] = useState([
    { nama: 'Budi Santoso', divisi: 'Konstruksi', masuk: '07:45', status: 'Hadir' },
    { nama: 'Siti Aminah', divisi: 'Administrasi', masuk: '08:00', status: 'Hadir' },
    { nama: 'Andi Wijaya', divisi: 'Fabrikasi', masuk: '--:--', status: 'Izin' },
    { nama: 'Dewi Lestari', divisi: 'Keuangan', masuk: '07:55', status: 'Hadir' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#1A3263]">Absensi Karyawan</h1>
          <p className="text-gray-500">PT Jaya Diga Innovation</p>
        </div>
        <button className="bg-white border border-gray-300 px-4 py-2 rounded-xl font-bold flex items-center gap-2 text-gray-700 hover:bg-gray-50 cursor-pointer">
          <Download size={18} /> Export
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text" 
          placeholder="Cari karyawan..." 
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#1A3263]"
        />
      </div>

      {/* KRITIKAL: Nama prop harus 'data' sesuai dengan yang diterima di Absensi.jsx */}
      <Absensi data={dataAbsensi} /> 
    </div>
  );
};

export default AbsensiPage;