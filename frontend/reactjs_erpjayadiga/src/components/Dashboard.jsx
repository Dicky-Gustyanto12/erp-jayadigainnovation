import React from 'react';
import { 
  Briefcase, 
  Users, 
  TrendingUp, 
  AlertCircle,
  ArrowUpRight,
  Clock
} from 'lucide-react';

const Dashboard = () => {
  // Data Dummy untuk Statistik
  const stats = [
    { label: 'Proyek Aktif', value: '12', icon: <Briefcase size={24} />, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Total Karyawan', value: '48', icon: <Users size={24} />, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Pendapatan Bulan Ini', value: 'Rp 450jt', icon: <TrendingUp size={24} />, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Invoice Pending', value: '5', icon: <AlertCircle size={24} />, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Utama</h1>
        <p className="text-gray-500">Selamat datang kembali di Sistem ERP Jaya Diga Innovation.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
                {stat.icon}
              </div>
              <span className="flex items-center text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-lg">
                <ArrowUpRight size={14} /> +12%
              </span>
            </div>
            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Progress Proyek (Sisi Kiri - Lebar) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Status Proyek Konstruksi</h3>
          <div className="space-y-6">
            {[
              { name: 'Pembangunan Gudang A', progress: 75, color: 'bg-[#1A3263]' },
              { name: 'Fabrikasi Struktur Baja B', progress: 40, color: 'bg-blue-400' },
              { name: 'Instalasi Playground Taman C', progress: 90, color: 'bg-green-500' },
            ].map((project, i) => (
              <div key={i}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">{project.name}</span>
                  <span className="text-sm font-bold text-[#1A3263]">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div 
                    className={`${project.color} h-3 rounded-full transition-all duration-1000`} 
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Aktivitas Terbaru (Sisi Kanan - Sempit) */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Log Aktivitas</h3>
          <div className="space-y-6">
            {[
              { msg: 'Invoice #1002 dikirim', time: '2 menit yang lalu' },
              { msg: 'Project Baru: Playground Bekasi', time: '1 jam yang lalu' },
              { msg: 'Absensi: 42 Karyawan hadir', time: '3 jam yang lalu' },
              { msg: 'Keuangan: Input kas masuk', time: '5 jam yang lalu' },
            ].map((log, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="mt-1 p-1 bg-blue-50 text-blue-600 rounded-full">
                  <Clock size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{log.msg}</p>
                  <p className="text-xs text-gray-400">{log.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;