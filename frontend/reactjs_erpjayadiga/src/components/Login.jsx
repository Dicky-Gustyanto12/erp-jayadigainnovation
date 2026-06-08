import React from 'react';

const Login = () => {
  return (
    <div className="w-full max-w-md px-8">
      {/* Bagian Logo */}
      <div className="flex items-center gap-2 mb-12">
        <div className="grid grid-cols-2 gap-0.5">
          {/* Menggunakan variasi opasitas dari warna #1A3263 */}
          <div className="w-3 h-3 bg-[#1A3263] rounded-sm"></div>
          <div className="w-3 h-3 bg-[#1A3263]/70 rounded-sm"></div>
          <div className="w-3 h-3 bg-[#1A3263]/90 rounded-sm"></div>
          <div className="w-3 h-3 bg-[#1A3263]/50 rounded-sm"></div>
        </div>
        <span className="text-xl font-bold text-gray-800 tracking-tight">
          PT Jaya Diga Innovation
        </span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Selamat Datang</h1>
        <p className="text-gray-500">Silakan masukkan Email dan Password</p>
      </div>

      {/* Formulir */}
      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Alamat Email
          </label>
          <input 
            type="email" 
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3263] focus:border-[#1A3263] outline-none transition-all placeholder:text-gray-400"
            placeholder="Masukkan email Anda"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Kata Sandi
          </label>
          <input 
            type="password" 
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3263] focus:border-[#1A3263] outline-none transition-all placeholder:text-gray-400"
            placeholder="••••••••"
          />
        </div>

        <div className="flex items-center text-sm">
          <a href="#" className="text-[#25468a] font-bold hover:text-[#25468a] transition hover:underline">
            Lupa kata sandi?
          </a>
        </div>

        {/* Tombol Utama - Menggunakan #1A3263 */}
        <button className="w-full bg-[#1A3263] text-white py-3 rounded-lg font-bold hover:bg-[#25468a] active:transform active:scale-[0.98] transition-all shadow-md shadow-blue-900/20 cursor-pointer">
          Masuk
        </button>
      </form>
    </div>
  );
};

export default Login;