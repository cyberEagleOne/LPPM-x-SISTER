import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Mail, Eye, EyeOff, CheckCircle2, ArrowLeft, UserCircle, Lock } from "lucide-react";
import praditaLogo from "@/assets/pradita-logo.png";
import praditaBuilding from "@/assets/pradita-building.png";

export function RegisterPage() {
  const [nidn, setNidn] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordStrength =
    password.length === 0 ? null
    : password.length < 6 ? "weak"
    : password.length < 10 ? "medium"
    : "strong";

  const validate = () => {
    const e: Record<string, string> = {};
    if (!nidn.trim()) e.nidn = "NIDN wajib diisi.";
    if (!email.trim()) e.email = "Email wajib diisi.";
    else if (!isValidEmail) e.email = "Format email tidak valid.";
    if (password.length < 8) e.password = "Password minimal 8 karakter.";
    if (password !== confirmation) e.confirmation = "Konfirmasi password tidak cocok.";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    // Simulate API POST /api/register
    console.log("Register:", { nidn, email, password, password_confirmation: confirmation });
    setSuccess(true);
    setTimeout(() => navigate("/login"), 2000);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden flex min-h-[640px]">
        {/* Left — Form */}
        <div className="w-full lg:w-1/2 flex flex-col px-8 sm:px-12 py-10 relative">
          {/* Back to login */}
          <Link
            to="/login"
            className="absolute top-6 right-6 flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#E30613] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Login
          </Link>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 mb-8">
            <img src={praditaLogo} alt="Pradita University" className="h-8 w-auto" />
            <span className="text-lg text-gray-800 tracking-wide font-bold">LPPM</span>
          </Link>

          {/* Title */}
          <div className="mb-6">
            <h2 className="text-2xl text-gray-900 mb-1 font-bold">Buat Akun Baru</h2>
            <p className="text-sm text-gray-400">Daftar untuk mengakses layanan SIPPM Pradita University</p>
          </div>

          {/* Success state */}
          {success ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center">
              <CheckCircle2 className="w-14 h-14 text-green-500" />
              <p className="text-lg font-semibold text-gray-800">Registrasi Berhasil!</p>
              <p className="text-sm text-gray-400">Anda akan diarahkan ke halaman login...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
              <div className="space-y-3.5">
                {/* NIDN */}
                <div>
                  <div className={`flex items-center gap-3 border rounded-xl px-4 py-3 transition-all bg-gray-50/50 ${errors.nidn ? "border-red-400 focus-within:ring-2 focus-within:ring-red-300" : "border-gray-200 focus-within:border-[#E30613] focus-within:ring-2 focus-within:ring-[#E30613]/10"}`}>
                    <UserCircle className="w-5 h-5 text-gray-400 shrink-0" />
                    <div className="flex-1">
                      <p className="text-[10px] text-gray-400 font-medium">NIDN</p>
                      <input
                        type="text"
                        value={nidn}
                        onChange={e => setNidn(e.target.value)}
                        placeholder="Masukkan NIDN"
                        className="w-full text-sm text-gray-800 bg-transparent outline-none placeholder:text-gray-300"
                      />
                    </div>
                  </div>
                  {errors.nidn && <p className="text-xs text-red-500 mt-1 ml-1">{errors.nidn}</p>}
                </div>

                {/* Email */}
                <div>
                  <div className={`flex items-center gap-3 border rounded-xl px-4 py-3 transition-all bg-gray-50/50 ${errors.email ? "border-red-400 focus-within:ring-2 focus-within:ring-red-300" : "border-gray-200 focus-within:border-[#E30613] focus-within:ring-2 focus-within:ring-[#E30613]/10"}`}>
                    <Mail className="w-5 h-5 text-gray-400 shrink-0" />
                    <div className="flex-1">
                      <p className="text-[10px] text-gray-400 font-medium">Email</p>
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="email@pradita.ac.id"
                        className="w-full text-sm text-gray-800 bg-transparent outline-none placeholder:text-gray-300"
                      />
                    </div>
                    {isValidEmail && <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />}
                  </div>
                  {errors.email && <p className="text-xs text-red-500 mt-1 ml-1">{errors.email}</p>}
                </div>

                {/* Password */}
                <div>
                  <div className={`flex items-center gap-3 border rounded-xl px-4 py-3 transition-all bg-gray-50/50 ${errors.password ? "border-red-400 focus-within:ring-2 focus-within:ring-red-300" : "border-gray-200 focus-within:border-[#E30613] focus-within:ring-2 focus-within:ring-[#E30613]/10"}`}>
                    <Lock className="w-5 h-5 text-gray-400 shrink-0" />
                    <div className="flex-1">
                      <p className="text-[10px] text-gray-400 font-medium">Password</p>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Minimal 8 karakter"
                        className="w-full text-sm text-gray-800 bg-transparent outline-none placeholder:text-gray-300"
                      />
                    </div>
                    <button type="button" onClick={() => setShowPassword(v => !v)} className="text-gray-400 hover:text-gray-600 shrink-0">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {/* Strength bar */}
                  {password.length > 0 && (
                    <div className="mt-1.5 flex items-center gap-2">
                      <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-300 ${passwordStrength === "weak" ? "w-1/4 bg-red-400" : passwordStrength === "medium" ? "w-1/2 bg-amber-400" : "w-full bg-green-500"}`} />
                      </div>
                      <span className={`text-[11px] font-medium ${passwordStrength === "weak" ? "text-red-400" : passwordStrength === "medium" ? "text-amber-500" : "text-green-500"}`}>
                        {passwordStrength === "weak" ? "Lemah" : passwordStrength === "medium" ? "Sedang" : "Kuat"}
                      </span>
                    </div>
                  )}
                  {errors.password && <p className="text-xs text-red-500 mt-1 ml-1">{errors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div>
                  <div className={`flex items-center gap-3 border rounded-xl px-4 py-3 transition-all bg-gray-50/50 ${errors.confirmation ? "border-red-400 focus-within:ring-2 focus-within:ring-red-300" : "border-gray-200 focus-within:border-[#E30613] focus-within:ring-2 focus-within:ring-[#E30613]/10"}`}>
                    <Lock className="w-5 h-5 text-gray-400 shrink-0" />
                    <div className="flex-1">
                      <p className="text-[10px] text-gray-400 font-medium">Konfirmasi Password</p>
                      <input
                        type={showConfirm ? "text" : "password"}
                        value={confirmation}
                        onChange={e => setConfirmation(e.target.value)}
                        placeholder="Ulangi password"
                        className="w-full text-sm text-gray-800 bg-transparent outline-none placeholder:text-gray-300"
                      />
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {confirmation && confirmation === password && (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      )}
                      <button type="button" onClick={() => setShowConfirm(v => !v)} className="text-gray-400 hover:text-gray-600">
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  {errors.confirmation && <p className="text-xs text-red-500 mt-1 ml-1">{errors.confirmation}</p>}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3.5 mt-5 bg-[#E30613] text-white rounded-xl hover:bg-[#c00510] transition-all hover:shadow-lg active:scale-[0.98] text-sm font-semibold"
              >
                Register
              </button>

              <p className="text-[11px] text-gray-400 text-center mt-auto pt-4 leading-relaxed">
                Sudah punya akun?{" "}
                <Link to="/login" className="text-[#E30613] hover:underline font-medium">
                  Login di sini
                </Link>
              </p>
            </form>
          )}
        </div>

        {/* Right — Image */}
        <div className="hidden lg:block w-1/2 relative">
          <img src={praditaBuilding} alt="Pradita University Building" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute bottom-8 left-8 right-8">
            <h3 className="text-white text-xl mb-2 font-bold">Universitas Pradita</h3>
            <p className="text-white/80 text-sm leading-relaxed">Lembaga Penelitian dan Pengabdian kepada Masyarakat</p>
          </div>
        </div>
      </div>
    </div>
  );
}
