import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { GraduationCap, Eye, EyeOff, LogIn, Lock, User, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { motion } from "motion/react";

// Demo credentials mapped to roles
const DEMO_CREDENTIALS: Record<string, { role: string; path: string; label: string }> = {
  "siti.rahma@pradita.ac.id": { role: "dosen", path: "/dosen", label: "Dosen" },
  "reviewer@pradita.ac.id": { role: "reviewer", path: "/reviewer", label: "Reviewer" },
  "admin@lppm.pradita.ac.id": { role: "admin", path: "/admin", label: "Admin" },
};

export function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Username dan password wajib diisi.");
      return;
    }
    setError("");
    setLoading(true);

    setTimeout(() => {
      const found = DEMO_CREDENTIALS[username.trim().toLowerCase()];
      if (found && password.trim().length >= 4) {
        toast.success(`Selamat datang, ${found.label}!`, { description: "Anda berhasil masuk ke sistem." });
        navigate(found.path);
      } else {
        setError("Username atau password tidak valid.");
        toast.error("Login gagal", { description: "Periksa kembali username dan password Anda." });
        setLoading(false);
      }
    }, 900);
  };

  const handleQuickLogin = (email: string) => {
    setUsername(email);
    setPassword("password123");
    setLoading(true);
    setTimeout(() => {
      const found = DEMO_CREDENTIALS[email];
      if (found) {
        toast.success(`Login sebagai ${found.label}`, { description: `Masuk dengan akun ${email}` });
        navigate(found.path);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#f0f4ff] flex items-center justify-center p-4">
      {/* Subtle background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#1e3a8a 1px, transparent 1px), linear-gradient(90deg, #1e3a8a 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <Link
        to="/"
        className="fixed top-4 left-4 z-20 inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/85 border border-white text-gray-700 hover:text-[#1e3a8a] hover:bg-white transition-colors shadow-sm"
        style={{ fontSize: 13, fontWeight: 800 }}
      >
        <ArrowLeft size={16} /> Beranda
      </Link>

      <div className="relative w-full max-w-[420px]">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#1e3a8a] mb-4 shadow-lg">
            <GraduationCap className="text-white" size={28} />
          </div>
          <h1 className="text-gray-900" style={{ fontSize: 22, fontWeight: 800 }}>
            LPPM × SISTER
          </h1>
          <p className="text-gray-500 mt-1" style={{ fontSize: 13 }}>
            Sistem Informasi Sumber daya TErintegrasi Riset
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
        >
          {/* Top accent */}
          <div className="h-1 bg-gradient-to-r from-[#1e3a8a] via-[#3b82f6] to-[#1e3a8a]" />

          <div className="p-8">
            <h2 className="text-gray-900 mb-1" style={{ fontSize: 18, fontWeight: 700 }}>
              Masuk ke Sistem
            </h2>
            <p className="text-gray-400 mb-6" style={{ fontSize: 13 }}>
              Gunakan akun institusi Universitas Pradita
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Username */}
              <div>
                <label className="block text-gray-700 mb-1.5" style={{ fontSize: 13, fontWeight: 600 }}>
                  Username
                </label>
                <div className="relative">
                  <User
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="email@pradita.ac.id"
                    autoComplete="username"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-800 outline-none focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a]/10 transition-all"
                    style={{ fontSize: 14 }}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-gray-700 mb-1.5" style={{ fontSize: 13, fontWeight: 600 }}>
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password"
                    autoComplete="current-password"
                    className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-800 outline-none focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a]/10 transition-all"
                    style={{ fontSize: 14 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="px-4 py-2.5 rounded-xl bg-red-50 border border-red-100">
                  <p className="text-red-600" style={{ fontSize: 13 }}>
                    {error}
                  </p>
                </div>
              )}

              {/* Login button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1e3a8a] text-white hover:bg-[#1e40af] active:scale-[0.98] transition-all disabled:opacity-70 mt-2"
                style={{ fontSize: 14, fontWeight: 700 }}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn size={16} />
                    Login
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-white text-gray-400" style={{ fontSize: 12 }}>
                  Akun Demo
                </span>
              </div>
            </div>

            {/* Demo accounts */}
            <div className="space-y-2">
              {Object.entries(DEMO_CREDENTIALS).map(([email, info]) => (
                <button
                  key={email}
                  onClick={() => handleQuickLogin(email)}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-gray-50 hover:bg-[#eff6ff] border border-gray-200 hover:border-blue-200 transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-white flex-shrink-0"
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        backgroundColor:
                          info.role === "admin"
                            ? "#7c2d12"
                            : info.role === "reviewer"
                            ? "#065f46"
                            : "#1e3a8a",
                      }}
                    >
                      {info.label[0]}
                    </div>
                    <div className="text-left">
                      <span className="text-gray-700" style={{ fontSize: 12, fontWeight: 600 }}>
                        {info.label}
                      </span>
                      <span className="text-gray-400 ml-2" style={{ fontSize: 11 }}>
                        {email}
                      </span>
                    </div>
                  </div>
                  <span
                    className="text-gray-300 group-hover:text-[#1e3a8a] transition-colors"
                    style={{ fontSize: 11 }}
                  >
                    →
                  </span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="mt-6 text-center space-y-2">
          <Link
            to="/"
            className="text-gray-400 hover:text-[#1e3a8a] transition-colors"
            style={{ fontSize: 13 }}
          >
            ← Kembali ke Beranda
          </Link>
          <p className="text-gray-400" style={{ fontSize: 11 }}>
            © 2026 LPPM Universitas Pradita · Powered by SISTER
          </p>
        </div>
      </div>
    </div>
  );
}