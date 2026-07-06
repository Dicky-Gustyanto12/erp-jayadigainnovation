import React from "react";
import Login from "../components/Login";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex bg-white font-sans">
      <div className="flex-1 flex items-center justify-center bg-white">
        <Login />
      </div>

      <div className="hidden lg:flex flex-1 bg-[#1A3263] items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          ></div>
          <div className="absolute -top-10 -left-10 w-64 h-64 border border-white/10 rounded-full"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-900/20 rounded-tl-full blur-3xl"></div>
        </div>

        <div className="relative z-10 w-full max-w-lg px-12 flex flex-col items-center text-center">
          <div className="mb-12 transform hover:scale-105 transition-transform duration-700 ease-in-out">
            <img
              src="logo.png"
              alt="Construction and Fabrication Illustration"
              className="w-1/4 mx-auto h-auto drop-shadow-2xl rounded-lg"
            />
          </div>

          <div className="text-white">
            <h2 className="text-3xl font-bold mb-4 tracking-tight uppercase">
              PT Jaya Diga Innovation
            </h2>
            <p className="text-blue-100/80 text-lg leading-relaxed">
              Solusi terpercaya untuk <strong>Konstruksi Baja</strong>,
              <strong> Fabrikasi Industri</strong>, dan spesialis pembuatan
              <strong> Custom Playground</strong> berkualitas tinggi.
            </p>
          </div>

          <div className="mt-10 flex flex-col items-center">
            <p className="text-xs uppercase tracking-widest text-blue-300/60 mb-4 font-semibold">
              Construction • Fabrication • Innovation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
