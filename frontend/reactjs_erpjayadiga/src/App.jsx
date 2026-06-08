import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import InvoicePage from './pages/InvoicePage';
import AbsensiPage from './pages/AbsensiPage';
import ProjectPage from './pages/ProjectPage';
import KeuanganPage from './pages/KeuanganPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Halaman Login Tanpa Sidebar */}
        <Route path="/" element={<LoginPage />} />

        {/* Semua halaman lain dengan Sidebar */}
        <Route
          path="/*"
          element={
            <div className="flex min-h-screen bg-gray-50">
              {/* Sidebar tetap di sini */}
              <Sidebar />

              {/* Area Konten Utama */}
              <main className="flex-1 min-h-screen overflow-x-hidden">
                <div className="p-8">
                  <Routes>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/invoice" element={<InvoicePage />} />
                    <Route path="/absensi" element={<AbsensiPage />} />
                    <Route path="/project" element={<ProjectPage />} />
                    <Route path="/keuangan" element={<KeuanganPage />} />

                    {/* Default jika salah ketik URL */}
                    <Route path="*" element={<Navigate to="/dashboard" />} />
                  </Routes>
                </div>
              </main>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;