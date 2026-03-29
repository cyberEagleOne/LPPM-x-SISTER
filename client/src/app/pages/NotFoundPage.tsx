import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";

export function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="text-center">
        <div className="text-7xl text-[#E30613] mb-4" style={{ fontWeight: 700 }}>404</div>
        <h1 className="text-2xl text-gray-800 mb-2">Halaman Tidak Ditemukan</h1>
        <p className="text-sm text-gray-500 mb-8 max-w-md mx-auto">
          Maaf, halaman yang Anda cari tidak tersedia. Silakan kembali ke beranda atau gunakan menu navigasi.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#E30613] text-white text-sm rounded-lg hover:bg-[#c00510] transition-all hover:shadow-md active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
