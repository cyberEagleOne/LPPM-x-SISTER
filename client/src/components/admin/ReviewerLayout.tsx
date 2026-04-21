import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import {
  Bell,
  BookOpenCheck,
  BookMarked,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  ClipboardList,
  ExternalLink,
  FileSignature,
  Gift,
  Grid,
  LayoutDashboard,
  LogOut,
  Maximize,
  Menu,
  Minimize,
  Presentation,
  Search,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { ToastProvider, useToast } from "./Toast";
import { SessionExpiry } from "./SessionExpiry";
import { Error403 } from "../../pages/admin/ErrorPages";
import { BrandLogo } from "../BrandLogo";
import {
  reviewerControlSidebarSections,
  reviewerExcludedModules,
  reviewerNavbarMenu,
  reviewerSidebarMenu,
  type ReviewerMenuItem,
  type ReviewerSidebarItem,
} from "../../config/reviewerRoleConfig";

const SIDEBAR_ICON_MAP = {
  LayoutDashboard,
  BookOpenCheck,
  FileSignature,
  Gift,
  Presentation,
  BookMarked,
  ClipboardList,
};

function SidebarItemIcon({ icon, active = false }: { icon: string; active?: boolean }) {
  if (icon === "Circle") {
    return <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${active ? "bg-[#E30613]" : "bg-slate-500"}`} />;
  }

  const Icon = SIDEBAR_ICON_MAP[icon as keyof typeof SIDEBAR_ICON_MAP] || ClipboardList;
  return <Icon className="h-[18px] w-[18px] shrink-0" />;
}

function splitReviewerPath(path?: string) {
  if (!path) {
    return { pathname: "", search: "" };
  }

  const [pathname, search = ""] = path.split("?");
  return {
    pathname,
    search: search ? `?${search}` : "",
  };
}

function getReviewerChildKey(parentLabel: string, child: ReviewerSidebarItem) {
  return `${parentLabel}::${child.path ?? child.label}`;
}

function NavbarDropdownBranch({
  item,
  onSelect,
  closeMenus,
}: {
  item: ReviewerMenuItem;
  onSelect: (item: ReviewerMenuItem) => void;
  closeMenus: () => void;
}) {
  const [open, setOpen] = useState(false);
  const hasChildren = Boolean(item.children?.length);
  const isDisabled = !hasChildren && !item.path;

  if (!hasChildren) {
    return (
      <button
        type="button"
        onClick={() => {
          if (isDisabled) return;
          onSelect(item);
          closeMenus();
        }}
        disabled={isDisabled}
        title={item.note || item.label}
        className={`flex w-full items-start gap-2 px-4 py-2.5 text-left text-sm transition-colors ${
          isDisabled
            ? "cursor-not-allowed text-slate-300"
            : "text-slate-700 hover:bg-red-50 hover:text-[#E30613]"
        }`}
      >
        <span className="flex-1">{item.label}</span>
        {item.path ? <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 opacity-50" /> : null}
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50"
      >
        <span>{item.label}</span>
        <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform ${open ? "rotate-180" : "-rotate-90"}`} />
      </button>

      {open ? (
        <div className="absolute left-full top-0 z-50 ml-1 min-w-[220px] rounded-lg border border-slate-200 bg-white shadow-xl">
          <div className="max-h-[360px] overflow-y-auto py-1">
            {item.children?.map((child, index) => (
              <NavbarDropdownBranch
                key={`${item.label}-${child.label}-${index}`}
                item={child}
                onSelect={onSelect}
                closeMenus={closeMenus}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ReviewerNavbar({
  sidebarCollapsed,
  onToggleSidebar,
  onToggleControlSidebar,
}: {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  onToggleControlSidebar: () => void;
}) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { showToast } = useToast();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const searchTargets = useMemo(
    () => [
      { label: "Home", path: "/", section: "Navbar" },
      { label: "Contact", path: "/about/kontak", section: "Navbar" },
      { label: "Review Hibah", path: "/reviewer/hibah", section: "Reviewer / Hibah" },
      { label: "Dashboard", path: "/reviewer", section: "Sidebar" },
      { label: "Notifikasi", path: "/reviewer/notifikasi", section: "Navbar" },
      { label: "Profile Saya", path: "/reviewer/profile", section: "Sidebar" },
      ...reviewerSidebarMenu.flatMap((item) =>
        (item.children ?? []).filter((child) => Boolean(child.path)).map((child) => ({
          label: child.label,
          path: child.path,
          section: `Sidebar / ${item.label}`,
          note: child.note,
        })),
      ),
    ],
    [],
  );

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    handleFullscreenChange();

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const handleNavigate = (item: ReviewerMenuItem) => {
    if (!item.path) return;
    navigate(item.path);
  };

  const handleSearchSubmit = (event: FormEvent) => {
    event.preventDefault();
    const query = searchValue.trim().toLowerCase();

    if (!query) {
      showToast("Masukkan kata kunci menu reviewer.", "warning");
      return;
    }

    const match = searchTargets.find((item) =>
      `${item.label} ${item.section}`.toLowerCase().includes(query),
    );

    if (!match) {
      showToast(`Menu "${searchValue}" tidak ditemukan.`, "info");
      return;
    }

    if (match.path) {
      navigate(match.path);
    } else {
      showToast(match.note || `Menu "${match.label}" belum tersedia di reviewer React baru.`, "info");
    }

    setSearchOpen(false);
    setSearchValue("");
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        return;
      }

      await document.exitFullscreen();
    } catch {
      setIsFullscreen(Boolean(document.fullscreenElement));
    }
  };

  return (
    <header className="legacy-topbar sticky top-0 z-30 flex h-14 items-center gap-1 px-3">
      <button
        type="button"
        onClick={onToggleSidebar}
        className="rounded p-2 text-slate-500 transition-colors hover:text-slate-800 lg:hidden"
        aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="hidden items-center md:flex">
        {reviewerNavbarMenu.left.map((item) => {
          if (item.action === "logout") {
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="px-3 py-2 text-[15px] text-slate-500 transition-colors hover:text-slate-800"
              >
                {item.label}
              </button>
            );
          }

          if (item.children?.length) {
            return (
              <div key={item.label} ref={dropdownRef} className="relative">
                <button
                  type="button"
                  onClick={() => setMenuOpen((value) => !value)}
                  className="flex items-center gap-1 px-3 py-2 text-[15px] text-[#E30613] transition-colors hover:text-[#c00510]"
                  style={{ fontWeight: 600 }}
                >
                  {item.label}
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${menuOpen ? "rotate-180" : ""}`} />
                </button>

                {menuOpen ? (
                  <div className="absolute left-0 top-full z-50 mt-1 min-w-[240px] rounded-lg border border-slate-200 bg-white shadow-xl">
                    <div className="max-h-[360px] overflow-y-auto py-1">
                      {item.children.map((child, index) => (
                        <NavbarDropdownBranch
                          key={`${item.label}-${child.label}-${index}`}
                          item={child}
                          onSelect={handleNavigate}
                          closeMenus={() => setMenuOpen(false)}
                        />
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            );
          }

          if (item.path) {
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => navigate(item.path!)}
                className="px-3 py-2 text-[15px] text-slate-500 transition-colors hover:text-slate-800"
                title={item.note || item.label}
              >
                {item.label}
              </button>
            );
          }

          return (
            <span
              key={item.label}
              className="cursor-not-allowed px-3 py-2 text-[15px] text-slate-300"
              title={item.note || item.label}
            >
              {item.label}
            </span>
          );
        })}
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-0.5 pr-2">
        <div className="relative" ref={searchRef}>
          {searchOpen ? (
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 shadow-sm"
            >
              <Search className="h-4 w-4 text-slate-400" />
              <input
                type="search"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Search"
                autoFocus
                className="w-[220px] bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => {
                  setSearchOpen(false);
                  setSearchValue("");
                }}
                className="rounded p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="rounded p-2 text-slate-500 transition-colors hover:text-slate-800"
              aria-label="Buka pencarian"
            >
              <Search className="h-5 w-5" />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => navigate("/reviewer/notifikasi")}
          className="relative rounded p-2 text-slate-500 transition-colors hover:text-slate-800"
          aria-label="Notifikasi"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-0.5 top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold leading-none text-white">
            2
          </span>
        </button>

        <button
          type="button"
          onClick={toggleFullscreen}
          className={`hidden rounded p-2 transition-colors sm:block ${
            isFullscreen ? "bg-red-50 text-[#E30613]" : "text-slate-500 hover:text-slate-800"
          }`}
          aria-label="Toggle fullscreen"
        >
          {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
        </button>

        <button
          type="button"
          onClick={onToggleControlSidebar}
          className="rounded p-2 text-slate-500 transition-colors hover:text-slate-800"
          aria-label="Control sidebar"
        >
          <Grid className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}

function ReviewerSidebar({
  collapsed,
  mobileOpen,
  onToggleCollapse,
  onMobileClose,
}: {
  collapsed: boolean;
  mobileOpen: boolean;
  onToggleCollapse: () => void;
  onMobileClose: () => void;
}) {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) return null;

  const currentPathname = location.pathname;
  const currentSearch = location.search || "";

  const getPathMatchScore = (path?: string) => {
    const { pathname, search } = splitReviewerPath(path);
    if (!pathname) return -1;

    const isRootMenu = pathname === "/reviewer";
    if (isRootMenu) {
      return currentPathname === pathname && !currentSearch ? pathname.length + 3000 : -1;
    }

    if (search) {
      return currentPathname === pathname && currentSearch === search ? pathname.length + 3000 : -1;
    }

    if (currentPathname === pathname) {
      return pathname.length + 2000;
    }

    if (currentPathname.startsWith(`${pathname}/`)) {
      return pathname.length + 1000;
    }

    return -1;
  };

  const activeLeafLabel = useMemo(() => {
    let bestLabel: string | null = null;
    let bestScore = -1;

    for (const item of reviewerSidebarMenu) {
      if (item.children || !item.path) continue;
      const score = getPathMatchScore(item.path);
      if (score > bestScore) {
        bestScore = score;
        bestLabel = item.label;
      }
    }

    return bestLabel;
  }, [currentPathname, currentSearch]);

  const activeChildMatch = useMemo(() => {
    let bestMatch: { parentLabel: string; childKey: string } | null = null;
    let bestScore = -1;

    for (const item of reviewerSidebarMenu) {
      for (const child of item.children ?? []) {
        const score = getPathMatchScore(child.path);
        if (score > bestScore) {
          bestScore = score;
          bestMatch = {
            parentLabel: item.label,
            childKey: getReviewerChildKey(item.label, child),
          };
        }
      }
    }

    return bestMatch;
  }, [currentPathname, currentSearch]);

  const activeParentLabels = useMemo(
    () => (activeChildMatch?.parentLabel ? [activeChildMatch.parentLabel] : []),
    [activeChildMatch],
  );

  const autoOpenMenus = useMemo(
    () => activeParentLabels,
    [activeParentLabels],
  );

  const [openMenus, setOpenMenus] = useState<string[]>(autoOpenMenus);

  useEffect(() => {
    setOpenMenus((current) => Array.from(new Set([...autoOpenMenus, ...current])));
  }, [autoOpenMenus]);

  const toggleMenu = (label: string) => {
    setOpenMenus((current) =>
      current.includes(label)
        ? current.filter((item) => item !== label)
        : [...current, label],
    );
  };

  const handleItemClick = (item: ReviewerSidebarItem) => {
    if (item.path) {
      navigate(item.path);
      onMobileClose();
      return true;
    }
    return false;
  };

  return (
    <>
      {mobileOpen ? (
        <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={onMobileClose} />
      ) : null}

      <aside
        className={`legacy-sidebar fixed left-0 top-0 z-50 flex h-full flex-col transition-all duration-300 ${
          collapsed ? "w-[72px]" : "w-[260px]"
        } ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:relative lg:translate-x-0`}
      >
        <div className={`legacy-brand flex h-14 shrink-0 items-center gap-3 px-4 ${collapsed ? "justify-center" : ""}`}>
          <BrandLogo tone="light" size="sm" compact={collapsed} />
        </div>

        {!collapsed ? (
          <div className="legacy-user-card mx-4 mb-2 mt-4 shrink-0 pb-4">
            <div className="flex items-center gap-3">
              <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-500 text-xs text-white">
                {user.avatar ? (
                  <img src={user.avatar} alt="User Image" className="h-full w-full object-cover" />
                ) : (
                  <div className="px-1 text-center text-[10px] leading-tight">Reviewer</div>
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-[15px] text-[#e7ecfb]" style={{ fontWeight: 600 }}>{user.name}</p>
                <p className="mt-0.5 text-[11px] uppercase tracking-[0.18em] text-[#8fa0c2]">
                  Review Board
                </p>
              </div>
            </div>
          </div>
        ) : null}

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
          {reviewerSidebarMenu.map((item) => {
            const hasChildren = Boolean(item.children?.length);
            const isOpen = openMenus.includes(item.label);
            const active = item.label === "Dashboard"
              ? location.pathname === "/reviewer"
              : item.label === activeLeafLabel || activeParentLabels.includes(item.label);

            if (!hasChildren) {
              const isDisabled = !item.path;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    if (!isDisabled) {
                      handleItemClick(item);
                    }
                  }}
                  disabled={isDisabled}
                  title={item.note || item.label}
                  className={`legacy-menu-item flex w-full items-center gap-3 rounded px-3 py-2 text-sm transition-all ${
                    active ? "active" : ""
                  } ${collapsed ? "justify-center" : ""} ${isDisabled ? "cursor-not-allowed opacity-50 hover:bg-transparent" : ""}`}
                  aria-current={active ? "page" : undefined}
                >
                  <SidebarItemIcon icon={item.icon} active={active} />
                  {!collapsed ? <span className="flex-1 text-left">{item.label}</span> : null}
                </button>
              );
            }

            return (
              <div key={item.label}>
                <button
                  type="button"
                  onClick={() => toggleMenu(item.label)}
                  className={`legacy-menu-item flex w-full items-center gap-3 rounded px-3 py-2 text-sm transition-all ${
                    active ? "active" : ""
                  } ${collapsed ? "justify-center" : ""}`}
                  aria-expanded={!collapsed ? isOpen : undefined}
                >
                  <SidebarItemIcon icon={item.icon} active={active} />
                  {!collapsed ? (
                    <>
                      <span className="flex-1 text-left">{item.label}</span>
                      <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </>
                  ) : null}
                </button>

                {!collapsed && isOpen ? (
                  <div className="legacy-submenu ml-5 mt-1 space-y-0.5 pl-3">
                    {item.children?.map((child) => {
                      const isDisabled = !child.path;
                      const childKey = getReviewerChildKey(item.label, child);
                      const childActive = activeChildMatch?.childKey === childKey;
                      return (
                        <button
                          key={`${item.label}-${child.label}`}
                          type="button"
                          onClick={() => {
                            if (!isDisabled) {
                              handleItemClick(child);
                            }
                          }}
                          disabled={isDisabled}
                          title={child.note || child.label}
                          className={`legacy-menu-item flex w-full items-center gap-2.5 rounded px-3 py-1.5 text-[13px] transition-all ${
                            childActive ? "active" : ""
                          } ${isDisabled ? "cursor-not-allowed opacity-50 hover:bg-transparent" : ""}`}
                          aria-current={childActive ? "page" : undefined}
                        >
                          <SidebarItemIcon icon={child.icon} active={childActive} />
                          <span className={`flex-1 text-left ${child.highlight ? "text-[#9fd0ff]" : ""}`}>
                            {child.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>

        <div className="shrink-0 space-y-1 border-t border-[#4f5962] px-3 py-3">
          <Link
            to="/reviewer/profile"
            onClick={onMobileClose}
            className={`legacy-menu-item flex items-center gap-3 rounded px-3 py-2 text-sm transition-all ${collapsed ? "justify-center" : ""}`}
          >
            <ClipboardList className="h-[18px] w-[18px]" />
            {!collapsed ? <span>Profile Saya</span> : null}
          </Link>
          <button
            type="button"
            onClick={() => {
              logout();
              navigate("/");
            }}
            className={`flex w-full items-center gap-3 rounded px-3 py-2 text-sm text-rose-200 transition-all hover:bg-white/10 hover:text-white ${collapsed ? "justify-center" : ""}`}
          >
            <LogOut className="h-[18px] w-[18px]" />
            {!collapsed ? <span>Keluar</span> : null}
          </button>
        </div>

        <button
          type="button"
          onClick={onToggleCollapse}
          className="absolute -right-3 top-16 hidden h-6 w-6 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-500 shadow-sm hover:text-slate-700 lg:flex"
        >
          {collapsed ? <ChevronsRight className="h-3.5 w-3.5" /> : <ChevronsLeft className="h-3.5 w-3.5" />}
        </button>
      </aside>
    </>
  );
}

function ReviewerControlSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {open ? <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} /> : null}
      <aside
        className={`fixed right-0 top-0 z-50 h-full w-[320px] border-l border-[#4f5962] bg-[#343a40] text-[#c2c7d0] shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-[#4f5962] px-4 py-3">
          <div>
            <p className="text-[1.05rem] text-white">Reviewer Helper</p>
            <p className="text-xs text-[#9da5ad]">Catatan migrasi reviewer dari file legacy</p>
          </div>
          <button type="button" onClick={onClose} className="rounded p-2 text-[#c2c7d0] hover:bg-white/10 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-5 overflow-y-auto p-4">
          {reviewerControlSidebarSections.map((section) => (
            <section key={section.label}>
              <h3 className="mb-2 text-sm text-white" style={{ fontWeight: 600 }}>
                {section.label}
              </h3>
              <div className="space-y-2">
                {section.children.map((item) => (
                  <div key={item} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm">
                    {item}
                  </div>
                ))}
              </div>
            </section>
          ))}

          <section>
            <h3 className="mb-2 text-sm text-white" style={{ fontWeight: 600 }}>
              Modul Yang Dipisahkan
            </h3>
            <div className="space-y-2">
              {reviewerExcludedModules.map((item) => (
                <div key={item.route} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                  <p className="text-sm text-white">{item.route}</p>
                  <p className="mt-1 text-xs text-[#9da5ad]">{item.note}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </aside>
    </>
  );
}

function ReviewerShell({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [controlSidebarOpen, setControlSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    setMobileOpen(false);
    setControlSidebarOpen(false);
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  const handleSidebarToggle = () => {
    if (window.innerWidth >= 1024) {
      setSidebarCollapsed((current) => !current);
      return;
    }

    setMobileOpen((current) => !current);
  };

  if (!isAuthenticated) return null;
  if (user?.role !== "reviewer") return <Error403 />;

  return (
    <div className="legacy-admin-shell flex h-screen overflow-hidden">
      <ReviewerSidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileOpen}
        onToggleCollapse={() => setSidebarCollapsed((current) => !current)}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <ReviewerNavbar
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={handleSidebarToggle}
          onToggleControlSidebar={() => setControlSidebarOpen((current) => !current)}
        />
        <main className="legacy-content volt-shell-main flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
        <footer className="volt-shell-footer shrink-0 px-6 py-3">
          <p className="text-center text-xs text-slate-500">
            &copy; 2026 LPPM Pradita University.
          </p>
        </footer>
      </div>

      <ReviewerControlSidebar open={controlSidebarOpen} onClose={() => setControlSidebarOpen(false)} />
    </div>
  );
}

export function ReviewerLayout() {
  return (
    <ToastProvider>
      <ReviewerShell>
        <Outlet />
      </ReviewerShell>
      <SessionExpiry />
    </ToastProvider>
  );
}
