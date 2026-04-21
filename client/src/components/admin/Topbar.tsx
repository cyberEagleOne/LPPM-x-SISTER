import { useState, useRef, useEffect, type FormEvent } from "react";
import { Search, Bell, Menu, ChevronDown, Maximize, Minimize, FileText, ExternalLink, X } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { SuperAdminHeader } from "./SuperAdminHeader";

// ─── Dokumen Template Data ─────────────────────────────────────────────────
const DOKUMEN_MENU = [
  {
    key: "penelitian",
    label: "Penelitian",
    items: [
      { label: "Pengesahan", url: "#" },
      { label: "Cover", url: "#" },
      { label: "Poster", url: "#" },
      {
        label: "Proposal",
        children: [
          { label: "PDP, PDF", url: "#" },
          { label: "PMK, PK-PIJAR", url: "#" },
          { label: "PPP", url: "#" },
        ],
      },
      {
        label: "Lap. Kemajuan",
        children: [
          { label: "PDP, PDF", url: "#" },
          { label: "PMK, PK-PIJAR", url: "#" },
          { label: "PPP", url: "#" },
        ],
      },
      {
        label: "Lap. Akhir",
        children: [
          { label: "PDP, PDF", url: "#" },
          { label: "PMK, PK-PIJAR", url: "#" },
          { label: "PPP", url: "#" },
        ],
      },
    ],
  },
  {
    key: "pkm",
    label: "PKM",
    items: [
      { label: "Pengesahan", url: "#" },
      { label: "Cover", url: "#" },
      { label: "Poster", url: "#" },
      {
        label: "Proposal",
        children: [
          { label: "Bidang Ilmu", url: "#" },
          { label: "Desa Binaan", url: "#" },
          { label: "Kolaborasi Pijar", url: "#" },
        ],
      },
      {
        label: "Lap. Kemajuan",
        children: [
          { label: "Bidang Ilmu", url: "#" },
          { label: "Desa Binaan", url: "#" },
          { label: "Kolaborasi Pijar", url: "#" },
        ],
      },
      {
        label: "Lap. Akhir",
        children: [
          { label: "Bidang Ilmu", url: "#" },
          { label: "Desa Binaan", url: "#" },
          { label: "Kolaborasi Pijar", url: "#" },
        ],
      },
    ],
  },
  {
    key: "pkm-mandiri",
    label: "PKM Mandiri",
    items: [
      { label: "Proposal", url: "#" },
      { label: "Laporan Akhir", url: "#" },
    ],
  },
  {
    key: "surat",
    label: "Surat",
    items: [
      { label: "Orisinalitas", url: "#" },
      { label: "Mitra Sasaran", url: "#" },
      { label: "Desa Binaan", url: "#" },
      { label: "Kwitansi", url: "#" },
      { label: "B.A Konferensi", url: "#" },
      { label: "Pernyataan KI", url: "#" },
      { label: "Pengalihan Hak Cipta", url: "#" },
    ],
  },
  {
    key: "rab",
    label: "RAB",
    url: "#",
  },
  {
    key: "buku-panduan",
    label: "Buku Panduan",
    url: "#",
  },
  {
    key: "sk",
    label: "SK",
    items: [
      { label: "SK 040/2024", url: "#" },
      { label: "SK 14/2025", url: "#" },
    ],
  },
];

// ─── Dokumen Mega-Menu Component ───────────────────────────────────────────
function DokumenMenu() {
  const [open, setOpen] = useState(false);
  const [openSections, setOpenSections] = useState<string[]>(["penelitian"]);
  const [openSubmenus, setOpenSubmenus] = useState<string[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleSection = (key: string) =>
    setOpenSections((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );

  const toggleSubmenu = (key: string) =>
    setOpenSubmenus((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 px-3 py-2 text-[15px] text-slate-500 hover:text-slate-800 transition-colors"
      >
        Dokumen <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 w-[260px] bg-white border border-gray-200 rounded-sm shadow-xl z-50 max-h-[calc(100vh-80px)] overflow-y-auto text-[14px]">
          {DOKUMEN_MENU.map((section) => {
            // Simple link (no children)
            if (section.url) {
              return (
                <a
                  key={section.key}
                  href={section.url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between gap-2 px-4 py-2.5 text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition-colors border-b border-gray-100"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5" />
                    {section.label}
                  </span>
                  <ExternalLink className="w-3 h-3 opacity-50" />
                </a>
              );
            }

            // Expandable section
            const isOpen = openSections.includes(section.key);
            return (
              <div key={section.key} className="border-b border-gray-100">
                <button
                  onClick={() => toggleSection(section.key)}
                  className="w-full flex items-center justify-between gap-2 px-4 py-2.5 text-slate-700 hover:bg-gray-50 transition-colors font-medium"
                >
                  <span>{section.label}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && (
                  <div className="bg-gray-50 border-t border-gray-100">
                    {section.items?.map((item) => {
                      const itemKey = `${section.key}-${item.label}`;
                      // Item with sub-children
                      if ("children" in item && item.children) {
                        const subOpen = openSubmenus.includes(itemKey);
                        return (
                          <div key={itemKey}>
                            <button
                              onClick={() => toggleSubmenu(itemKey)}
                              className="w-full flex items-center justify-between gap-2 pl-8 pr-4 py-2 text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                            >
                              <span className="flex items-center gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-slate-400 shrink-0" />
                                {item.label}
                              </span>
                              <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${subOpen ? "rotate-180" : ""}`} />
                            </button>
                            {subOpen && (
                              <div className="bg-slate-100">
                                {item.children.map((child) => (
                                  <a
                                    key={child.label}
                                    href={child.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={() => setOpen(false)}
                                    className="flex items-center gap-2 pl-12 pr-4 py-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 transition-colors text-[13px]"
                                  >
                                    <ExternalLink className="w-3 h-3 opacity-50" />
                                    {child.label}
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      }
                      // Simple item
                      return (
                        <a
                          key={itemKey}
                          href={(item as { label: string; url: string }).url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => setOpen(false)}
                          className="flex items-center justify-between gap-2 pl-8 pr-4 py-2 text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                        >
                          <span className="flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-slate-400 shrink-0" />
                            {item.label}
                          </span>
                          <ExternalLink className="w-3 h-3 opacity-50" />
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Reviewer Dropdown Menu ────────────────────────────────────────────────
function ReviewerMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const REVIEWER_LINKS = [
    { label: "Review Hibah", path: "/reviewer/hibah" },
    { label: "Review Surat Tugas", path: "/reviewer/surat-tugas" },
    { label: "Review Kegiatan", path: "/reviewer/kegiatan/penelitian" },
    { label: "Review Publikasi", path: "/reviewer/publikasi/artikel" },
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 px-3 py-2 text-[15px] text-[#E30613] font-semibold hover:text-[#c00510] transition-colors"
      >
        Reviewer <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 w-52 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-1">
          {REVIEWER_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-red-50 hover:text-[#E30613] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Topbar ───────────────────────────────────────────────────────────
interface TopbarProps {
  onMenuToggle: () => void;
  pageTitle?: string;
}

interface TopbarSearchItem {
  key: string;
  label: string;
  path: string;
  section: string;
}

const NOTIF_COUNT = 3; // Mock count — ganti dengan API call

export function Topbar({ onMenuToggle }: TopbarProps) {
  const { user, logout } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(Boolean(document.fullscreenElement));
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    handleFullscreenChange();

    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  if (!user) return null;

  const isAdmin = user.role === "administrator";
  const isDosen = user.role === "dosen";
  const isReviewer = user.role === "reviewer";
  const homePath = isReviewer ? "/" : "/admin";

  const searchItems: TopbarSearchItem[] = [
    { key: "topbar-home", label: "Home", path: homePath, section: "Navbar" },
    { key: "topbar-contact", label: "Contact", path: "/about/kontak", section: "Navbar" },
    { key: "topbar-notifications", label: "Notifications", path: "/admin/notifikasi", section: "Navbar" },
    ...(isReviewer
      ? [
          { key: "reviewer-hibah", label: "Review Hibah", path: "/reviewer/hibah", section: "Reviewer" },
          { key: "reviewer-st", label: "Review Surat Tugas", path: "/reviewer/surat-tugas", section: "Reviewer" },
          { key: "reviewer-kegiatan", label: "Review Kegiatan", path: "/reviewer/kegiatan/penelitian", section: "Reviewer" },
          { key: "reviewer-publikasi", label: "Review Publikasi", path: "/reviewer/publikasi/artikel", section: "Reviewer" },
        ]
      : []),
  ];

  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const filteredSearchItems = normalizedSearchQuery
    ? searchItems.filter((item) =>
        `${item.label} ${item.section}`.toLowerCase().includes(normalizedSearchQuery)
      )
    : searchItems.slice(0, isAdmin ? 8 : 4);

  const handleSearchSelect = (item: TopbarSearchItem) => {
    navigate(item.path);
    setSearchOpen(false);
    setSearchQuery("");
  };

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (filteredSearchItems[0]) {
      handleSearchSelect(filteredSearchItems[0]);
    }
  };

  async function toggleFullscreen() {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        return;
      }

      await document.exitFullscreen();
    } catch {
      setIsFullscreen(Boolean(document.fullscreenElement));
    }
  }

  if (isAdmin) {
    return (
      <SuperAdminHeader
        notificationCount={NOTIF_COUNT}
        canAccessAdminLppm
        onToggleSidebar={onMenuToggle}
        onToggleFullscreen={toggleFullscreen}
        onOpenNotifications={() => navigate("/admin/notifikasi")}
        onLogout={() => {
          logout();
          navigate("/login");
        }}
        isFullscreen={isFullscreen}
      />
    );
  }

  return (
    <header className="legacy-topbar sticky top-0 z-30 h-14 flex items-center px-3 gap-1">
      {/* Mobile menu */}
      <button onClick={onMenuToggle} className="rounded p-2 text-slate-500 transition-colors hover:text-slate-800 lg:hidden">
        <Menu className="w-5 h-5" />
      </button>

      {/* Legacy Links */}
      <div className="hidden md:flex items-center">
        <Link to={homePath} className="px-3 py-2 text-[15px] text-slate-500 hover:text-slate-800 transition-colors">Home</Link>
        <Link to="/about/kontak" className="px-3 py-2 text-[15px] text-slate-500 hover:text-slate-800 transition-colors">
          Contact
        </Link>
        
        {/* Dokumen mega-menu — hanya untuk dosen */}
        {isDosen && <DokumenMenu />}

        {/* Reviewer dropdown — hanya untuk reviewer */}
        {isReviewer && <ReviewerMenu />}

        <button onClick={() => { logout(); navigate("/login"); }} className="px-3 py-2 text-[15px] text-slate-500 hover:text-slate-800 transition-colors">Logout</button>
      </div>

      <div className="flex-1" />

      {/* Right actions */}
      <div className="relative flex items-center gap-0.5 pr-2">
        <div className="relative" ref={searchRef}>
          <button
            onClick={() => setSearchOpen((value) => !value)}
            className={`p-2 rounded transition-colors ${searchOpen ? "bg-red-50 text-[#E30613]" : "text-slate-500 hover:text-slate-800"}`}
            title="Cari menu administrasi"
            aria-expanded={searchOpen}
            aria-label="Buka pencarian menu"
          >
            <Search className="w-5 h-5" />
          </button>

          {searchOpen ? (
            <div className="absolute right-0 top-full mt-2 w-[360px] rounded-2xl border border-slate-200 bg-white p-3 shadow-xl z-50">
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                <Search className="w-4 h-4 shrink-0 text-slate-400" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Cari menu administrasi..."
                  autoFocus
                  className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="rounded-full p-1 text-slate-400 transition-colors hover:bg-white hover:text-slate-700"
                    aria-label="Kosongkan pencarian"
                  >
                    <X className="w-4 h-4" />
                  </button>
                ) : null}
              </form>

              <div className="mt-3">
                <div className="mb-2 flex items-center justify-between px-1">
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">
                    {normalizedSearchQuery ? "Hasil pencarian" : "Akses cepat"}
                  </p>
                  <p className="text-[11px] text-slate-400">{filteredSearchItems.length} menu</p>
                </div>

                <div className="max-h-72 space-y-1 overflow-y-auto">
                  {filteredSearchItems.length ? (
                    filteredSearchItems.map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => handleSearchSelect(item)}
                        className="w-full rounded-xl px-3 py-2 text-left transition-colors hover:bg-red-50"
                      >
                        <span className="block text-sm text-slate-800">{item.label}</span>
                        <span className="mt-0.5 block text-xs text-slate-400">{item.section}</span>
                      </button>
                    ))
                  ) : (
                    <div className="rounded-xl border border-dashed border-slate-200 px-3 py-4 text-sm text-slate-500">
                      Menu tidak ditemukan. Coba kata kunci lain.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Notifications with count badge */}
        <Link
          to="/admin/notifikasi"
          className="relative p-2 text-slate-500 hover:text-slate-800 rounded transition-colors"
        >
          <Bell className="w-5 h-5" />
          {NOTIF_COUNT > 0 && (
            <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] flex items-center justify-center px-1 text-[10px] font-bold bg-amber-500 text-white rounded-full leading-none">
              {NOTIF_COUNT > 99 ? "99+" : NOTIF_COUNT}
            </span>
          )}
        </Link>

        <button
          onClick={toggleFullscreen}
          className={`hidden sm:block p-2 rounded transition-colors ${isFullscreen ? "bg-red-50 text-[#E30613]" : "text-slate-500 hover:text-slate-800"}`}
          title={isFullscreen ? "Keluar dari mode fullscreen" : "Masuk ke mode fullscreen"}
          aria-label={isFullscreen ? "Keluar dari mode fullscreen" : "Masuk ke mode fullscreen"}
        >
          {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
}
