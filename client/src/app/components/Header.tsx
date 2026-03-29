import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { Search, Menu, X, ChevronDown, LogIn } from "lucide-react";
import { BrandLogo } from "./BrandLogo";

interface DropdownItem {
  label: string;
  path: string;
  external?: boolean;
}

interface NavItem {
  label: string;
  path: string;
  children?: DropdownItem[];
}

const navItems: NavItem[] = [
  {
    label: "About Us",
    path: "/about",
    children: [
      { label: "Profil", path: "/about/profil" },
      { label: "Visi & Misi", path: "/about/visi-misi" },
      { label: "Tujuan", path: "/about/tujuan" },
      { label: "Dokumen & SK", path: "/about/dokumen-sk" },
      { label: "Struktur Organisasi", path: "/about/struktur" },
      { label: "Kontak", path: "/about/kontak" },
    ],
  },
  {
    label: "Riset",
    path: "/riset",
    children: [
      { label: "Penelitian", path: "/riset/penelitian" },
      { label: "Pengabdian", path: "/riset/pengabdian" },
      { label: "HKI", path: "/riset/hki" },
      { label: "Karya Dosen", path: "/riset/karya-dosen" },
    ],
  },
  {
    label: "Publikasi",
    path: "/publikasi",
    children: [
      { label: "Buku", path: "/publikasi/buku" },
      { label: "Jurnal", path: "/publikasi/jurnal" },
      { label: "Sinta", path: "/publikasi/sinta" },
    ],
  },
  {
    label: "Artikel",
    path: "/",
  },
  {
    label: "Contact",
    path: "/about/kontak",
  },
  {
    label: "Unduh Berkas",
    path: "/unduh-berkas",
    children: [
      { label: "Berkas Panduan", path: "/unduh-berkas?tab=panduan" },
      { label: "Materi Kegiatan", path: "/unduh-berkas?tab=materi" },
      { label: "Lain-Lain", path: "/unduh-berkas?tab=lainnya" },
    ],
  },
];

interface HeaderProps {
  onSearchOpen: () => void;
}

export function Header({ onSearchOpen }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
    setMobileAccordion(null);
  }, [location.pathname]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    if (path === "/about") return location.pathname.startsWith(path) && location.pathname !== "/about/kontak";
    return location.pathname.startsWith(path);
  };

  return (
    <header className="app-site-header">
      <div className="app-container px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[84px] items-center justify-between gap-6">
          <Link to="/" className="shrink-0">
            <BrandLogo size="sm" />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" ref={dropdownRef}>
            {navItems.map((item) => (
              <div key={item.label} className="relative">
                {item.children ? (
                  <button
                    onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                    className={`app-nav-link ${isActive(item.path) ? "is-active" : ""}`}
                    aria-expanded={openDropdown === item.label}
                    type="button"
                  >
                    {item.label}
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform duration-200 ${
                        openDropdown === item.label ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                ) : (
                  <Link
                    to={item.path}
                    className={`app-nav-link ${isActive(item.path) ? "is-active" : ""}`}
                  >
                    {item.label}
                  </Link>
                )}

                {item.children && openDropdown === item.label ? (
                  <div
                    className="app-dropdown-panel absolute left-0 top-full mt-3 min-w-[240px] py-2"
                    style={{ animation: "fadeInDown 0.15s ease" }}
                  >
                    {item.children.map((child) => (
                      <Link
                        key={child.path}
                        to={child.path}
                        className="mx-2 block rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-blue-50 hover:text-blue-700"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={onSearchOpen}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--app-border)] bg-white/80 text-slate-500 transition-colors hover:bg-blue-50 hover:text-blue-700"
              aria-label="Search"
              type="button"
            >
              <Search className="w-5 h-5" />
            </button>
            <Link to="/login" className="app-btn app-btn-primary hidden sm:inline-flex">
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--app-border)] bg-white/80 text-slate-600 transition-colors hover:bg-blue-50 hover:text-blue-700 lg:hidden"
              aria-label="Menu"
              type="button"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen ? (
        <div className="border-t border-slate-200/80 bg-white/95 shadow-xl backdrop-blur lg:hidden">
          <div className="app-container px-4 py-4">
            <div className="space-y-1">
              {navItems.map((item) => (
                <div key={item.label}>
                  {item.children ? (
                    <>
                      <button
                        onClick={() =>
                          setMobileAccordion(mobileAccordion === item.label ? null : item.label)
                        }
                        className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition-colors ${
                          isActive(item.path)
                            ? "bg-blue-50 text-blue-700"
                            : "text-slate-700 hover:bg-slate-50"
                        }`}
                        type="button"
                      >
                        {item.label}
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            mobileAccordion === item.label ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {mobileAccordion === item.label ? (
                        <div className="ml-4 mt-2 border-l border-slate-200 pl-3">
                          <div className="space-y-1">
                            {item.children.map((child) => (
                              <Link
                                key={child.path}
                                to={child.path}
                                className="block rounded-xl px-3 py-2 text-sm text-slate-500 transition-colors hover:bg-blue-50 hover:text-blue-700"
                              >
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </>
                  ) : (
                    <Link
                      to={item.path}
                      className={`block rounded-2xl px-4 py-3 text-sm font-semibold transition-colors ${
                        isActive(item.path)
                          ? "bg-blue-50 text-blue-700"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
              <div className="pt-4">
                <Link
                  to="/login"
                  className="app-btn app-btn-primary w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LogIn className="w-4 h-4" />
                  Login ke SIPPM
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </header>
  );
}
