import React from 'react';
import { UserCheck, UserX, Clock, Calendar as CalendarIcon } from 'lucide-react';

const Absensi = ({ data = [] }) => { // Tambahkan default value []
  return (
    <div className="space-y-6">
      {/* Ringkasan Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-xl"><UserCheck size={24} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Hadir</p>
            <h3 className="text-2xl font-bold text-gray-900">
              {data.filter(item => item.status === 'Hadir').length}
            </h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-orange-100 text-orange-600 rounded-xl"><Clock size={24} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Izin</p>
            <h3 className="text-2xl font-bold text-gray-900">
              {data.filter(item => item.status === 'Izin').length}
            </h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-100 text-red-600 rounded-xl"><UserX size={24} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Alpa</p>
            <h3 className="text-2xl font-bold text-gray-900">
              {data.filter(item => item.status === 'Alpa').length}
            </h3>
          </div>
        </div>
      </div>

      {/* Tabel */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Nama Karyawan</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Divisi</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Jam Masuk</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data && data.length > 0 ? (
              data.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-gray-800">{item.nama}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.divisi}</td>
                  <td className="px-6 py-4 text-sm font-medium">{item.masuk}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                      item.status === 'Hadir' ? 'bg-green-100 text-green-700' : 
                      item.status === 'Izin' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-10 text-center text-gray-400 italic">
                  Data tidak ditemukan...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Absensi;