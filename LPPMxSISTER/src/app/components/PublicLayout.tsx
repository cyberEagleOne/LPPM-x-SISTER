import { Outlet, Link, useLocation } from "react-router";
import { useState } from "react";
import { Menu, X, BookOpen, GraduationCap } from "lucide-react";

const navLinks = [
  { label: "Beranda", to: "/" },
  { label: "Tentang Kami", to: "/about" },
  { label: "Artikel", to: "/artikel" },
  { label: "Publikasi", to: "/publikasi" },
];

export function PublicLayout() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-lg bg-[#1e3a8a] flex items-center justify-center">
                <GraduationCap className="text-white" size={20} />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-[#1e3a8a]" style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.02em" }}>LPPM × SISTER</span>
                <span className="text-gray-500" style={{ fontSize: 10, fontWeight: 400 }}>Universitas Pradita</span>
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const active = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      active
                        ? "bg-[#eff6ff] text-[#1e3a8a]"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                    style={{ fontSize: 14, fontWeight: active ? 600 : 500 }}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Login button */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/login"
                className="px-5 py-2 rounded-lg bg-[#1e3a8a] text-white hover:bg-[#1e40af] transition-colors"
                style={{ fontSize: 14, fontWeight: 600 }}
              >
                Login
              </Link>
            </div>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white px-4 pb-4 pt-2 flex flex-col gap-1">
            {navLinks.map((link) => {
              const active = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-2.5 rounded-lg transition-colors ${
                    active ? "bg-[#eff6ff] text-[#1e3a8a]" : "text-gray-600 hover:bg-gray-100"
                  }`}
                  style={{ fontSize: 14, fontWeight: active ? 600 : 500 }}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="mt-2 px-4 py-2.5 rounded-lg bg-[#1e3a8a] text-white text-center"
              style={{ fontSize: 14, fontWeight: 600 }}
            >
              Login
            </Link>
          </div>
        )}
      </nav>

      {/* Page content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-[#1e3a8a] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
                  <GraduationCap className="text-white" size={20} />
                </div>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 700 }}>LPPM × SISTER</p>
                  <p style={{ fontSize: 11, fontWeight: 400 }} className="text-blue-200">Universitas Pradita</p>
                </div>
              </div>
              <p className="text-blue-200 max-w-sm" style={{ fontSize: 13, lineHeight: 1.7 }}>
                Lembaga Penelitian dan Pengabdian Masyarakat — platform terintegrasi untuk manajemen penelitian dan publikasi akademik.
              </p>
            </div>

            <div>
              <p className="text-white mb-3" style={{ fontSize: 13, fontWeight: 600 }}>Navigasi</p>
              <ul className="flex flex-col gap-2">
                {navLinks.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="text-blue-200 hover:text-white transition-colors" style={{ fontSize: 13 }}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-white mb-3" style={{ fontSize: 13, fontWeight: 600 }}>Kontak</p>
              <ul className="flex flex-col gap-2 text-blue-200" style={{ fontSize: 13 }}>
                <li>Jl. Pendidikan No. 1</li>
                <li>Kota Pradita 12345</li>
                <li>lppm@universitaspradita.ac.id</li>
                <li>(021) 555-1234</li>
              </ul>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-blue-700 flex flex-col md:flex-row justify-between items-center gap-2">
            <p className="text-blue-300" style={{ fontSize: 12 }}>© 2026 LPPM Universitas Pradita. Hak cipta dilindungi.</p>
            <p className="text-blue-300" style={{ fontSize: 12 }}>Sistem Informasi Sumber daya TErintegrasi Riset (SISTER)</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
