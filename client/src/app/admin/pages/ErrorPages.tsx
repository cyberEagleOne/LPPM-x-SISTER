import { Link, useNavigate } from "react-router";
import { ShieldX, FileQuestion, Clock, ServerCrash, ArrowLeft, Home, LogIn, RefreshCw, Lock } from "lucide-react";

interface ErrorLayoutProps {
  code: string;
  title: string;
  description: string;
  icon: typeof ShieldX;
  iconBg: string;
  iconColor: string;
  actions: React.ReactNode;
}

function ErrorLayout({ code, title, description, icon: Icon, iconBg, iconColor, actions }: ErrorLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="text-center max-w-md">
        <div className={`w-20 h-20 ${iconBg} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
          <Icon className={`w-10 h-10 ${iconColor}`} />
        </div>
        <p className="text-6xl text-slate-200 mb-2" style={{ fontWeight: 800 }}>{code}</p>
        <h1 className="text-xl text-slate-900 mb-2" style={{ fontWeight: 700 }}>{title}</h1>
        <p className="text-sm text-slate-500 mb-8 leading-relaxed">{description}</p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {actions}
        </div>
      </div>
    </div>
  );
}

export function Error401() {
  return (
    <ErrorLayout
      code="401"
      title="Belum Login"
      description="Anda perlu login terlebih dahulu untuk mengakses halaman ini. Silakan masuk dengan akun yang terdaftar."
      icon={Lock}
      iconBg="bg-blue-100"
      iconColor="text-blue-600"
      actions={
        <Link to="/login" className="flex items-center gap-2 px-5 py-2.5 text-sm text-white bg-[#E30613] rounded-lg hover:bg-[#c00510] transition-colors" style={{ fontWeight: 500 }}>
          <LogIn className="w-4 h-4" /> Login
        </Link>
      }
    />
  );
}

export function Error403() {
  const navigate = useNavigate();
  return (
    <ErrorLayout
      code="403"
      title="Akses Ditolak"
      description="Anda tidak memiliki izin untuk mengakses halaman ini. Hubungi administrator jika Anda merasa ini adalah kesalahan."
      icon={ShieldX}
      iconBg="bg-red-100"
      iconColor="text-red-600"
      actions={
        <>
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-5 py-2.5 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors" style={{ fontWeight: 500 }}>
            <ArrowLeft className="w-4 h-4" /> Kembali
          </button>
          <Link to="/admin" className="flex items-center gap-2 px-5 py-2.5 text-sm text-white bg-[#E30613] rounded-lg hover:bg-[#c00510] transition-colors" style={{ fontWeight: 500 }}>
            <Home className="w-4 h-4" /> Dashboard
          </Link>
        </>
      }
    />
  );
}

export function Error404Admin() {
  const navigate = useNavigate();
  return (
    <ErrorLayout
      code="404"
      title="Halaman Tidak Ditemukan"
      description="Halaman yang Anda cari tidak ditemukan atau telah dipindahkan. Periksa kembali URL atau kembali ke halaman utama."
      icon={FileQuestion}
      iconBg="bg-amber-100"
      iconColor="text-amber-600"
      actions={
        <>
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-5 py-2.5 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors" style={{ fontWeight: 500 }}>
            <ArrowLeft className="w-4 h-4" /> Kembali
          </button>
          <Link to="/admin" className="flex items-center gap-2 px-5 py-2.5 text-sm text-white bg-[#E30613] rounded-lg hover:bg-[#c00510] transition-colors" style={{ fontWeight: 500 }}>
            <Home className="w-4 h-4" /> Dashboard
          </Link>
        </>
      }
    />
  );
}

export function Error419() {
  return (
    <ErrorLayout
      code="419"
      title="Sesi Berakhir"
      description="Sesi login Anda telah habis karena tidak ada aktivitas. Silakan login kembali untuk melanjutkan."
      icon={Clock}
      iconBg="bg-orange-100"
      iconColor="text-orange-600"
      actions={
        <Link to="/login" className="flex items-center gap-2 px-5 py-2.5 text-sm text-white bg-[#E30613] rounded-lg hover:bg-[#c00510] transition-colors" style={{ fontWeight: 500 }}>
          <LogIn className="w-4 h-4" /> Login Kembali
        </Link>
      }
    />
  );
}

export function Error500() {
  return (
    <ErrorLayout
      code="500"
      title="Terjadi Kesalahan Sistem"
      description="Server mengalami kesalahan internal. Coba muat ulang halaman atau hubungi tim support jika masalah berlanjut."
      icon={ServerCrash}
      iconBg="bg-purple-100"
      iconColor="text-purple-600"
      actions={
        <>
          <button onClick={() => window.location.reload()} className="flex items-center gap-2 px-5 py-2.5 text-sm text-white bg-[#E30613] rounded-lg hover:bg-[#c00510] transition-colors" style={{ fontWeight: 500 }}>
            <RefreshCw className="w-4 h-4" /> Muat Ulang
          </button>
          <a href="mailto:support@pradita.ac.id" className="flex items-center gap-2 px-5 py-2.5 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors" style={{ fontWeight: 500 }}>
            Hubungi Support
          </a>
        </>
      }
    />
  );
}