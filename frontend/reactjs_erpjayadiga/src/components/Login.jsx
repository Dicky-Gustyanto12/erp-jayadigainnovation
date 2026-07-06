import { use, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login", {
        email: email,
        password: password,
      });

      const token = response.data.access_token;

      localStorage.setItem("token", token);

      Swal.fire({
        icon: "success",
        title: "Login Berhasil",
        text: "",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        navigate("/dashboard");
      });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        Swal.fire({
          icon: "error",
          title: "Email atau Password Salah",
          text: "",
          timer: 1500,
          confirmButtonColor: "#1A3263",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Kesalahan Server",
          text: "Terjadi kesalahan.",
          confirmButtonColor: "#1A3263",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

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
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Selamat Datang
        </h1>
        <p className="text-gray-500">Silakan masukkan Email dan Password</p>
      </div>

      {/* Formulir */}
      <form className="space-y-5" onSubmit={handleLogin}>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Alamat Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3263] focus:border-[#1A3263] outline-none transition-all placeholder:text-gray-400"
            placeholder="Masukkan email Anda"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Kata Sandi
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3263] focus:border-[#1A3263] outline-none transition-all placeholder:text-gray-400"
            placeholder="••••••••"
            required
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center text-sm">
          <a
            href="#"
            className="text-[#25468a] font-bold hover:text-[#25468a] transition hover:underline"
          >
            Lupa kata sandi?
          </a>
        </div>

        {/* Tombol Utama - Menggunakan #1A3263 */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full text-white py-3 rounded-lg font-bold active:transform active:scale-[0.98] transition-all shadow-md cursor-pointer 
            ${
              isLoading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 "
            }`}
        >
          {isLoading ? "Memverifikasi..." : "Masuk"}
        </button>
      </form>
    </div>
  );
};

export default Login;
