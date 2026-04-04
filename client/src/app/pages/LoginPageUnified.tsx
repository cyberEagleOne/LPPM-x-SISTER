import { useState, type FormEvent, type ReactNode } from "react";
import { Link, useNavigate } from "react-router";
import {
  BookOpen,
  CheckCircle2,
  Eye,
  EyeOff,
  Globe,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Star,
} from "lucide-react";
import { AuthShell } from "../components/AuthShell";
import { useAuth, type UserRole, type User } from "../admin/context/AuthContext";
import { getDefaultAdminLanding } from "../admin/config/roleTemplates";
import praditaBuilding from "@/assets/pradita-building.png";

const DEMO_ROLES: {
  role: UserRole;
  label: string;
  desc: string;
  icon: ReactNode;
}[] = [
  {
    role: "administrator",
    label: "Administrator",
    desc: "Kelola master data, pengguna, dan modul administrasi LPPM.",
    icon: <ShieldCheck className="h-5 w-5" />,
  },
  {
    role: "dosen",
    label: "Dosen",
    desc: "Ajukan hibah, konferensi, publikasi, dan laporan kegiatan.",
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    role: "reviewer",
    label: "Reviewer",
    desc: "Tinjau penugasan hibah dan isi penilaian melalui shell reviewer.",
    icon: <Star className="h-5 w-5" />,
  },
  {
    role: "halaman-umum",
    label: "Halaman Umum",
    desc: "Masuk ke area publik untuk melihat informasi dan artikel LPPM.",
    icon: <Globe className="h-5 w-5" />,
  },
];

export function LoginPageUnified() {
  const [showManual, setShowManual] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); 
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleDemoLogin = (role: UserRole) => {
    const dummyUser: User = {
      id: `demo-${role}-999`,
      name: `Akun Demo ${role}`,
      email: `demo.${role}@pradita.ac.id`,
      role: role,
    };

    login(dummyUser); 
    
    navigate(getDefaultAdminLanding(role));
  };

  const handleManualSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: email, 
          password: password 
        }),
      });

      const dataJson = await response.json();

      if(!response.ok){
        throw new Error(dataJson.message || "Terjadi kesalahan saat login");
      }

      if (response.ok) {
        const userDataAsli: User = {
          id: dataJson.data.id.toString(),
          name: dataJson.data.nama, 
          email: dataJson.data.email,
          nidn: dataJson.data.nidn,
          role: "dosen" as UserRole
        };

        login(userDataAsli); 
        navigate(getDefaultAdminLanding("dosen"));
      }
    } catch (error: any) {
      console.error("Gagal terhubung ke server:", error);
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      backTo="/"
      backLabel="Kembali ke situs"
      title="Masuk ke workspace SIPPM"
      subtitle="Gunakan satu pintu akses yang sama untuk admin, dosen, reviewer, maupun akses publik sehingga pengalaman visual dan navigasi tetap konsisten."
      asideImage={praditaBuilding}
    >
      {errorMessage && (
          <div className="mb-4 flex items-center gap-2 p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg" role="alert">
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">{errorMessage}</span>
          </div>
        )}

      {!showManual ? (
        <div className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-2">
            {DEMO_ROLES.map(({ role, label, desc, icon }) => (
              <button
                key={role}
                type="button"
                onClick={() => handleDemoLogin(role)}
                className="app-card group p-5 text-left transition hover:-translate-y-0.5 hover:border-[var(--app-border-strong)] hover:shadow-[var(--app-shadow-md)]"
              >
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--app-primary-soft)] text-[var(--app-primary)]">
                  {icon}
                </div>
                <div className="space-y-1.5">
                  <div className="text-base font-semibold text-[var(--app-heading)]">{label}</div>
                  <p className="text-sm leading-6 text-slate-500">{desc}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-[var(--app-border)]" />
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
              atau
            </span>
            <div className="h-px flex-1 bg-[var(--app-border)]" />
          </div>

          <button
            type="button"
            onClick={() => setShowManual(true)}
            className="app-btn app-btn-secondary w-full"
          >
            Masuk dengan email dan password
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <button
            type="button"
            onClick={() => setShowManual(false)}
            className="app-link inline-flex items-center gap-2 text-sm"
          >
            Kembali ke pilihan role
          </button>

          <form onSubmit={handleManualSubmit} className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[var(--app-heading)]">
                Email
              </span>
              <div className="flex items-center gap-3 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-muted)] px-4 py-3 focus-within:border-[var(--app-primary)] focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(227,6,19,0.09)]">
                <Mail className="h-5 w-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@pradita.ac.id"
                  className="w-full border-0 bg-transparent p-0 text-sm text-[var(--app-heading)] outline-none placeholder:text-slate-300"
                  required
                />
                {isValidEmail ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : null}
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[var(--app-heading)]">
                Password
              </span>
              <div className="flex items-center gap-3 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-muted)] px-4 py-3 focus-within:border-[var(--app-primary)] focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(227,6,19,0.09)]">
                <LockKeyhole className="h-5 w-5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="w-full border-0 bg-transparent p-0 text-sm text-[var(--app-heading)] outline-none placeholder:text-slate-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="text-slate-400 transition hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </label>

            <div className="flex items-center justify-between gap-3 pt-1">
              <Link to="/register" className="app-link text-sm">
                Buat akun baru
              </Link>
              <button
                type="button"
                className="text-sm font-medium text-slate-400 transition hover:text-[var(--app-primary)]"
              >
                Lupa password?
              </button>
            </div>
            {isLoading ? (
              <button disabled className="app-btn app-btn-primary w-full !disabled:opacity-50 !disabled: cursor-wait">
                Masuk ke dashboard
              </button>
            ) : (
              <button type="submit" className="app-btn app-btn-primary w-full">
                Masuk ke dashboard
              </button>
            )}
          </form>
        </div>
      )}
    </AuthShell>
  );
}

