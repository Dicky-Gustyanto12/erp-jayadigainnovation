import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  UserCheck, 
  Briefcase, 
  Wallet, 
  LogOut,
  ChevronRight
} from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'invoice', path: '/invoice', label: 'Invoice', icon: <FileText size={20} /> },
    { id: 'absensi', path: '/absensi', label: 'Absensi', icon: <UserCheck size={20} /> },
    { id: 'project', path: '/project', label: 'Project', icon: <Briefcase size={20} /> },
    { id: 'keuangan', path: '/keuangan', label: 'Keuangan', icon: <Wallet size={20} /> },
  ];

  return (
    <div className="w-64 min-h-screen h-screen sticky top-0 bg-[#1A3263] text-white flex flex-col shadow-xl z-50">
      {/* Bagian Logo */}
      <div className="p-6 border-b border-white/10 flex flex-col items-center">
        <div className="mb-3 bg-white p-2 rounded-xl shadow-inner flex items-center justify-center">
           <img 
            src="/logo.png" 
            alt="Logo Jaya Diga" 
            className="h-10 w-auto object-contain" 
            onError={(e) => { e.target.style.display = 'none' }}
          />
        </div>
        <div className="text-center">
          <h1 className="text-sm font-bold uppercase tracking-tight">ERP System</h1>
          <p className="text-[13px] text-white font-semibold leading-tight">
            PT Jaya Diga Innovation
          </p>
        </div>
      </div>

      {/* Navigasi Menu */}
      <nav className="flex-1 mt-6 px-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 group cursor-pointer ${
                isActive 
                  ? 'bg-white text-[#1A3263] shadow-lg' 
                  : 'hover:bg-white/10 text-blue-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={isActive ? 'text-[#1A3263]' : 'text-blue-300 group-hover:text-white'}>
                  {item.icon}
                </div>
                <span className="font-semibold">{item.label}</span>
              </div>
              {isActive && <ChevronRight size={16} className="text-[#1A3263]" />}
            </button>
          );
        })}
      </nav>

      {/* Tombol Keluar */}
      <div className="p-4 border-t border-white/10">
        <button 
          onClick={() => navigate('/')} 
          className="w-full flex items-center gap-3 p-3 text-red-300 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-all font-semibold cursor-pointer group"
        >
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Keluar</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;