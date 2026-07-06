import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import InvoicePage from "./pages/InvoicePage";
import AbsensiPage from "./pages/AbsensiPage";
import ProjectPage from "./pages/ProjectPage";
import KeuanganPage from "./pages/KeuanganPage";
import KaryawanPage from "./pages/KaryawanPage";
import ClientPage from "./pages/ClientPage";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const GuestRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route
          path="/login"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />

        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="flex min-h-screen bg-gray-50">
                <Sidebar />
                <main className="flex-1 min-h-screen overflow-x-hidden">
                  <div className="p-8">
                    <Routes>
                      <Route path="/dashboard" element={<DashboardPage />} />
                      <Route path="/invoice" element={<InvoicePage />} />
                      <Route path="/absensi" element={<AbsensiPage />} />
                      <Route path="/project" element={<ProjectPage />} />
                      <Route path="/keuangan" element={<KeuanganPage />} />
                      <Route path="/karyawan" element={<KaryawanPage />} />
                      <Route path="/client" element={<ClientPage />} />
                      <Route path="*" element={<Navigate to="/dashboard" />} />
                    </Routes>
                  </div>
                </main>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
