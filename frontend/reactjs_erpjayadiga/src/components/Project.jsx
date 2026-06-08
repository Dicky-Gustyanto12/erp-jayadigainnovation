import React from 'react';
import { Calendar, MapPin, BarChart3, ChevronRight } from 'lucide-react';

const Project = ({ projects = [] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {projects.length > 0 ? (
        projects.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all group">
            {/* Thumbnail / Category Ribbon */}
            <div className="h-3 bg-[#1A3263] w-full"></div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 bg-blue-50 text-[#1A3263] text-[10px] font-bold uppercase rounded-lg">
                  {item.kategori}
                </span>
                <span className={`text-[10px] font-bold uppercase ${
                  item.priority === 'High' ? 'text-red-500' : 'text-gray-400'
                }`}>
                  {item.priority} Priority
                </span>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#1A3263] transition-colors">
                {item.nama}
              </h3>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <MapPin size={14} />
                  <span>{item.lokasi}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <Calendar size={14} />
                  <span>Deadline: {item.deadline}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1 text-xs font-bold text-gray-400">
                    <BarChart3 size={14} />
                    <span>PROGRESS</span>
                  </div>
                  <span className="text-sm font-bold text-[#1A3263]">{item.progress}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div 
                    className="bg-[#1A3263] h-2 rounded-full transition-all duration-1000" 
                    style={{ width: `${item.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <button className="w-full py-3 bg-gray-50 border-t border-gray-100 text-sm font-bold text-[#1A3263] flex items-center justify-center gap-2 hover:bg-[#1A3263] hover:text-white transition-all cursor-pointer">
              Detail Proyek <ChevronRight size={16} />
            </button>
          </div>
        ))
      ) : (
        <div className="col-span-full py-20 text-center bg-white rounded-2xl border-2 border-dashed border-gray-100 text-gray-400">
          Belum ada data proyek yang tersedia.
        </div>
      )}
    </div>
  );
};

export default Project;