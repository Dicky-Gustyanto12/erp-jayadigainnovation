import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';

const AdminDashboardPage = () => {
  const [activePage, setActivePage] = useState('dashboard');

  // Contoh data statistik sederhana
  const stats = [
    { label: 'Total Project', value: '12', color: 'bg-blue-50' },
    { label: 'Invoice Pending', value: 'Rps 4.5M', color: 'bg-orange-50' },
    { label: 'Kehadiran Hari Ini', value: '85%', color: 'bg-green-50' },
    { label: 'Arus Kas', value: '+12%', color: 'bg-purple-50' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Sidebar Component */}
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800 capitalize">
            {activePage}
          </h2>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900">Administrator</p>
              <p className="text-xs text-gray-500">Jaya Diga Innovation</p>
            </div>
            <div className="w-10 h-10  rounded-full flex items-center justify-center text-white font-bold">
              <img src="logo.png" alt="" />
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="p-8">
          {activePage === 'dashboard' && (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className={`${stat.color} p-6 rounded-2xl border border-gray-100 shadow-sm transition-transform hover:scale-105 cursor-pointer`}>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-[#1A3263]">{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Placeholder Table / Info */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm min-h-[400px]">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-gray-800">Aktivitas Terkini</h3>
                  <button className="text-sm font-bold text-[#1A3263] hover:underline">Lihat Semua</button>
                </div>
                <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-100 rounded-xl">
                  <p className="text-gray-400 italic">Data untuk modul {activePage} akan muncul di sini.</p>
                </div>
              </div>
            </div>
          )}

          {activePage !== 'dashboard' && (
            <div className="bg-white p-12 rounded-2xl border border-gray-200 shadow-sm text-center">
              <h3 className="text-xl font-bold text-gray-800 mb-2 underline decoration-[#1A3263] decoration-4 underline-offset-8">
                Halaman {activePage}
              </h3>
              <p className="text-gray-500">Konten untuk bagian ini sedang dalam pengembangan.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardPage;