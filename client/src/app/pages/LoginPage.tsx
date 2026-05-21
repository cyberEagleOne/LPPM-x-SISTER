import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Mail, Eye, EyeOff, CheckCircle2, ArrowLeft } from "lucide-react";
import { useAuth, type User } from "../admin/context/AuthContext";
import { getDefaultAdminLanding } from "../admin/config/roleTemplates";
import praditaLogo from "@/assets/pradita-logo.png";
import praditaBuilding from "@/assets/pradita-building.png";

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dummyManualUser: User = {
      id: "1",
      name: "User",
      email: email,
      role: "dosen", // Role statis paling aman untuk kebutuhan render sebelum ada API sungguhan
    };
    login(dummyManualUser);
    navigate(getDefaultAdminLanding("dosen"));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden flex min-h-[620px]">

        {/* Left Side */}
        <div className="w-full lg:w-1/2 flex flex-col px-8 sm:px-12 py-10 relative">
          {/* Back to site */}
          <Link to="/" className="absolute top-6 right-6 flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#E30613] transition-colors">
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Link>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 mb-7">
            <img src={praditaLogo} alt="Pradita University" className="h-8 w-auto" />
            <span className="text-lg text-gray-800 tracking-wide" style={{ fontWeight: 700 }}>LPPM</span>
          </Link>

            /* ── Manual Login Form ── */
            <>
              <div className="mb-5">
                <h2 className="text-2xl text-gray-900 mb-1" style={{ fontWeight: 700 }}>Masuk Akun</h2>
                <p className="text-sm text-gray-400">Masukkan email dan password Anda</p>
              </div>

              <form onSubmit={handleManualSubmit} className="flex-1 flex flex-col">
                <div className="space-y-3.5">
                  {/* Email */}
                  <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-[#E30613] focus-within:ring-2 focus-within:ring-[#E30613]/10 transition-all bg-gray-50/50">
                    <Mail className="w-5 h-5 text-gray-400 shrink-0" />
                    <div className="flex-1">
                      <p className="text-[10px] text-gray-400" style={{ fontWeight: 500 }}>Email Address</p>
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@pradita.ac.id"
                        className="w-full text-sm text-gray-800 bg-transparent outline-none placeholder:text-gray-300" required />
                    </div>
                    {isValidEmail && <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />}
                  </div>

                  {/* Password */}
                  <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-[#E30613] focus-within:ring-2 focus-within:ring-[#E30613]/10 transition-all bg-gray-50/50">
                    <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-[10px] text-gray-400" style={{ fontWeight: 500 }}>Password</p>
                      <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                        placeholder="Masukkan password"
                        className="w-full text-sm text-gray-800 bg-transparent outline-none placeholder:text-gray-300" required />
                    </div>
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-600 shrink-0">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end mt-2">
                  <a href="#" className="text-xs text-[#E30613] hover:underline" onClick={(e) => e.preventDefault()}>
                    Lupa password?
                  </a>
                </div>

                <button type="submit"
                  className="w-full py-3.5 mt-4 bg-[#E30613] text-white rounded-xl hover:bg-[#c00510] transition-all hover:shadow-lg active:scale-[0.98] text-sm"
                  style={{ fontWeight: 600 }}>
                  Masuk ke Dashboard
                </button>

                {/* Divider + Social */}
                <div className="flex items-center gap-4 my-4">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400" style={{ fontWeight: 500 }}>Atau Lanjutkan Dengan</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                <div className="flex items-center justify-center gap-4">
                  <button type="button" className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-all hover:shadow-sm">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                  </button>
                  <button type="button" className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center hover:bg-black transition-all hover:shadow-sm">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                    </svg>
                  </button>
                </div>
              </form>
            </>
        </div>

        {/* Right Side - Image */}
        <div className="hidden lg:block w-1/2 relative">
          <img src={praditaBuilding} alt="Pradita University Building" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute bottom-8 left-8 right-8">
            <h3 className="text-white text-xl mb-2" style={{ fontWeight: 700 }}>Universitas Pradita</h3>
            <p className="text-white/80 text-sm leading-relaxed">Lembaga Penelitian dan Pengabdian kepada Masyarakat</p>
          </div>
        </div>
      </div>
    </div>
  );
}
