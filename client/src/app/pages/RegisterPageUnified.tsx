import { useState, type FormEvent, type ReactNode } from "react";
import { Link, useNavigate } from "react-router";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UserCircle2,
} from "lucide-react";
import { AuthShell } from "../components/AuthShell";
import praditaBuilding from "@/assets/pradita-building.png";

export function RegisterPageUnified() {
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
    password.length === 0
      ? null
      : password.length < 6
        ? "weak"
        : password.length < 10
          ? "medium"
          : "strong";

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!nidn.trim()) nextErrors.nidn = "NIDN wajib diisi.";
    if (!email.trim()) nextErrors.email = "Email wajib diisi.";
    else if (!isValidEmail) nextErrors.email = "Format email tidak valid.";
    if (password.length < 8) nextErrors.password = "Password minimal 8 karakter.";
    if (password !== confirmation) nextErrors.confirmation = "Konfirmasi password tidak cocok.";
    return nextErrors;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setSuccess(true);
    setTimeout(() => navigate("/login"), 1800);
  };

  return (
    <AuthShell
      backTo="/login"
      backLabel="Kembali ke login"
      title="Buat akun SIPPM baru"
      subtitle="Form registrasi mengikuti pola komponen yang sama dengan halaman login dan panel internal, sehingga pengalaman pengguna tetap seragam di seluruh aplikasi."
      asideTitle="Registrasi yang selaras dengan sistem desain utama."
      asideDescription="Input, validasi, tombol aksi, dan area informasi memakai bentuk, jarak, dan hierarki visual yang sama seperti halaman lain agar web terasa benar-benar satu kesatuan."
      asideImage={praditaBuilding}
      footerNote={
        <p className="leading-6">
          Sudah punya akun?{" "}
          <Link to="/login" className="app-link">
            Login di sini
          </Link>
        </p>
      }
    >
      {success ? (
        <div className="app-card-soft flex min-h-[360px] flex-col items-center justify-center gap-4 px-6 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[var(--app-heading)]">
              Registrasi berhasil
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Anda akan diarahkan ke halaman login dalam beberapa detik.
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <FieldShell
            label="NIDN"
            error={errors.nidn}
            icon={<UserCircle2 className="h-5 w-5 text-slate-400" />}
          >
            <input
              type="text"
              value={nidn}
              onChange={(e) => setNidn(e.target.value)}
              placeholder="Masukkan NIDN"
              className="w-full border-0 bg-transparent p-0 text-sm text-[var(--app-heading)] outline-none placeholder:text-slate-300"
            />
          </FieldShell>

          <FieldShell
            label="Email"
            error={errors.email}
            icon={<Mail className="h-5 w-5 text-slate-400" />}
            trailing={isValidEmail ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : null}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@pradita.ac.id"
              className="w-full border-0 bg-transparent p-0 text-sm text-[var(--app-heading)] outline-none placeholder:text-slate-300"
            />
          </FieldShell>

          <FieldShell
            label="Password"
            error={errors.password}
            icon={<LockKeyhole className="h-5 w-5 text-slate-400" />}
            trailing={
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="text-slate-400 transition hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
          >
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 8 karakter"
              className="w-full border-0 bg-transparent p-0 text-sm text-[var(--app-heading)] outline-none placeholder:text-slate-300"
            />
          </FieldShell>

          {password.length > 0 ? (
            <div className="flex items-center gap-3 px-1">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                <div
                  className={`h-full rounded-full transition-all ${
                    passwordStrength === "weak"
                      ? "w-1/3 bg-rose-500"
                      : passwordStrength === "medium"
                        ? "w-2/3 bg-amber-500"
                        : "w-full bg-emerald-500"
                  }`}
                />
              </div>
              <span
                className={`text-xs font-semibold uppercase tracking-[0.18em] ${
                  passwordStrength === "weak"
                    ? "text-rose-500"
                    : passwordStrength === "medium"
                      ? "text-amber-500"
                      : "text-emerald-600"
                }`}
              >
                {passwordStrength === "weak"
                  ? "Lemah"
                  : passwordStrength === "medium"
                    ? "Sedang"
                    : "Kuat"}
              </span>
            </div>
          ) : null}

          <FieldShell
            label="Konfirmasi Password"
            error={errors.confirmation}
            icon={<LockKeyhole className="h-5 w-5 text-slate-400" />}
            trailing={
              <div className="flex items-center gap-2">
                {confirmation && confirmation === password ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ) : null}
                <button
                  type="button"
                  onClick={() => setShowConfirm((current) => !current)}
                  className="text-slate-400 transition hover:text-slate-600"
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            }
          >
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              placeholder="Ulangi password"
              className="w-full border-0 bg-transparent p-0 text-sm text-[var(--app-heading)] outline-none placeholder:text-slate-300"
            />
          </FieldShell>

          <button type="submit" className="app-btn app-btn-primary w-full">
            Register
          </button>
        </form>
      )}
    </AuthShell>
  );
}

interface FieldShellProps {
  label: string;
  error?: string;
  icon: ReactNode;
  trailing?: ReactNode;
  children: ReactNode;
}

function FieldShell({ label, error, icon, trailing, children }: FieldShellProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-[var(--app-heading)]">{label}</span>
      <div
        className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition ${
          error
            ? "border-rose-300 bg-rose-50/60 shadow-[0_0_0_4px_rgba(227,6,19,0.08)]"
            : "border-[var(--app-border)] bg-[var(--app-surface-muted)] focus-within:border-[var(--app-primary)] focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(227,6,19,0.09)]"
        }`}
      >
        {icon}
        {children}
        {trailing}
      </div>
      {error ? <p className="mt-2 text-sm text-rose-700">{error}</p> : null}
    </label>
  );
}
