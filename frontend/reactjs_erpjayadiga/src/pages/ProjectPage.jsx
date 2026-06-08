import React, { useState } from 'react';
import { Plus, Search, Filter, Briefcase } from 'lucide-react';
import Project from '../components/Project';

const ProjectPage = () => {
  // Data dummy proyek
  const [listProject] = useState([
    { 
      id: 1, 
      nama: 'Konstruksi Baja Warehouse A', 
      kategori: 'Konstruksi', 
      lokasi: 'Cikarang, Bekasi', 
      deadline: '15 Mei 2026', 
      progress: 65,
      priority: 'High'
    },
    { 
      id: 2, 
      nama: 'Fabrikasi Ducting Industri', 
      kategori: 'Fabrikasi', 
      lokasi: 'Workshop Internal', 
      deadline: '20 Apr 2026', 
      progress: 30,
      priority: 'Normal'
    },
    { 
      id: 3, 
      nama: 'Custom Playground - RPTRA Kelapa', 
      kategori: 'Playground', 
      lokasi: 'Jakarta Pusat', 
      deadline: '05 Mei 2026', 
      progress: 85,
      priority: 'Normal'
    },
  ]);

  return (
    <div className="space-y-8">
      {/* Header Halaman */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Manajemen Proyek</h1>
            <p className="text-gray-500">Pantau progres pekerjaan lapangan dan workshop.</p>
          </div>
        </div>
        <button className="flex items-center justify-center gap-2 bg-[#1A3263] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#25468a] transition-all shadow-lg shadow-blue-900/20 cursor-pointer">
          <Plus size={20} /> Proyek Baru
        </button>
      </div>

      {/* Kontrol & Filter */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-2 rounded-2xl border border-gray-200 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Cari nama proyek, lokasi, atau klien..." 
            className="w-full pl-12 pr-4 py-3 bg-transparent outline-none text-gray-700 placeholder:text-gray-400"
          />
        </div>
        <div className="h-8 w-[1px] bg-gray-200 hidden md:block"></div>
        <button className="flex items-center gap-2 px-6 py-3 text-gray-600 font-bold hover:text-[#1A3263] transition cursor-pointer">
          <Filter size={18} /> Filter Kategori
        </button>
      </div>

      {/* Grid Proyek */}
      <Project projects={listProject} />
    </div>
  );
};

export default ProjectPage;