import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { ChevronDown, LayoutDashboard, Database, Users, Shield, Key, Grid3X3, BookOpen, Building2, GraduationCap, UserCog, FolderTree, Star, FileText, Banknote, FileSignature, Presentation, BookMarked, BarChart3, ClipboardList, FileBarChart, Download, Bell, Settings, Cog, ScrollText, LogOut, ChevronsLeft, ChevronsRight, Circle, PlusSquare, Image, Newspaper, Layers, Tag, BookOpenCheck, Award, Handshake, Gift } from "lucide-react";
import { useAuth, ROLE_LABELS } from "../context/AuthContext";
import { getMenuForRole, type MenuItem } from "../config/menuConfig";
import { BrandLogo } from "../../components/BrandLogo";

const ICON_MAP: Record<string, typeof LayoutDashboard> = {
  LayoutDashboard, Database, Users, Shield, Key, Grid3x3: Grid3X3, BookOpen, Building2, GraduationCap, UserCog, FolderTree, Star, FileText, Banknote, FileSignature, Presentation, BookMarked, BarChart3, ClipboardList, FileBarChart, Download, Bell, Settings, Cog, ScrollText, Circle, PlusSquare, Image, Newspaper, Layers, Tag, BookOpenCheck, Award, Handshake, Gift
};

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

interface SidebarSection {
  key: string;
  label: string;
  itemKeys: string[];
}

const SECTION_MAP: Record<string, SidebarSection[]> = {
  administrator: [
    {
      key: "workspace",
      label: "Workspace",
      itemKeys: ["dashboard", "surat-tugas", "penelitian", "pkm", "hibah-internal", "haki"],
    },
    {
      key: "administrasi",
      label: "Administrasi",
      itemKeys: ["master", "referensi", "konten", "reporting", "sistem"],
    },
  ],
  dosen: [
    {
      key: "workspace",
      label: "Workspace",
      itemKeys: ["dashboard", "hibah-dosen", "surat-tugas", "konferensi"],
    },
    {
      key: "pelaporan",
      label: "Pelaporan",
      itemKeys: ["laporan-publikasi", "laporan-kegiatan"],
    },
  ],
};

function splitMenuPath(path?: string) {
  if (!path) return { pathname: "", search: "" };
  const [pathname, search = ""] = path.split("?");
  return {
    pathname,
    search: search ? `?${search}` : "",
  };
}

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) return null;
  const menuItems = getMenuForRole(user.role);
  const currentSearch = location.search || "";

  const getMenuMatchScore = (path?: string) => {
    const { pathname, search } = splitMenuPath(path);
    if (!pathname) return -1;

    const isRootMenu = pathname === "/admin" || pathname === "/reviewer";
    const inSameContext = isRootMenu
      ? location.pathname === pathname
      : location.pathname === pathname || location.pathname.startsWith(`${pathname}/`);

    if (!inSameContext) return -1;
    if (search && (location.pathname !== pathname || search !== currentSearch)) return -1;

    return pathname.length + (search ? 1000 : 0);
  };

  const activeLeafKey = useMemo(() => {
    let bestKey: string | null = null;
    let bestScore = -1;

    for (const item of menuItems) {
      if (item.children || !item.path) continue;
      const score = getMenuMatchScore(item.path);
      if (score > bestScore) {
        bestScore = score;
        bestKey = item.key;
      }
    }

    return bestKey;
  }, [menuItems, location.pathname, currentSearch]);

  const activeChildKey = useMemo(() => {
    let bestKey: string | null = null;
    let bestScore = -1;

    for (const item of menuItems) {
      for (const child of item.children ?? []) {
        const score = getMenuMatchScore(child.path);
        if (score > bestScore) {
          bestScore = score;
          bestKey = child.key;
        }
      }
    }

    return bestKey;
  }, [menuItems, location.pathname, currentSearch]);

  const activeParentKeys = useMemo(
    () =>
      menuItems
        .filter((item) => item.children?.some((child) => child.key === activeChildKey))
        .map((item) => item.key),
    [menuItems, activeChildKey],
  );

  const autoOpenMenus = useMemo(
    () => activeParentKeys,
    [activeParentKeys],
  );

  const [openMenus, setOpenMenus] = useState<string[]>(autoOpenMenus);

  useEffect(() => {
    setOpenMenus((prev) => {
      const validKeys = new Set(menuItems.filter((item) => item.children).map((item) => item.key));
      const retained = prev.filter((key) => validKeys.has(key));
      return Array.from(new Set([...autoOpenMenus, ...retained]));
    });
  }, [autoOpenMenus, menuItems]);

  const groupedMenuItems = useMemo(() => {
    const sectionConfig = SECTION_MAP[user.role] ?? [
      {
        key: "menu",
        label: "Menu",
        itemKeys: menuItems.map((item) => item.key),
      },
    ];

    const itemMap = new Map(menuItems.map((item) => [item.key, item]));
    const usedKeys = new Set<string>();
    const sections = sectionConfig
      .map((section) => {
        const items = section.itemKeys
          .map((key) => itemMap.get(key))
          .filter((item): item is MenuItem => Boolean(item));

        items.forEach((item) => usedKeys.add(item.key));

        return {
          ...section,
          items,
        };
      })
      .filter((section) => section.items.length > 0);

    const leftovers = menuItems.filter((item) => !usedKeys.has(item.key));
    if (leftovers.length > 0) {
      sections.push({
        key: "lainnya",
        label: "Lainnya",
        itemKeys: leftovers.map((item) => item.key),
        items: leftovers,
      });
    }

    return sections;
  }, [menuItems, user.role]);

  const toggleMenu = (key: string) => {
    setOpenMenus((prev) => prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]);
  };

  const renderMenuItem = (item: MenuItem) => {
    const Icon = ICON_MAP[item.icon] || FileText;
    const active = item.key === "dashboard"
      ? location.pathname === "/admin" && !currentSearch
      : item.key === activeLeafKey;
    const groupActive = activeParentKeys.includes(item.key);
    const isOpen = openMenus.includes(item.key);

    if (item.children) {
      return (
        <div key={item.key}>
          <button
            type="button"
            onClick={() => toggleMenu(item.key)}
            className={`legacy-menu-item w-full flex items-center gap-3 px-3 py-2 rounded text-sm transition-all ${
              groupActive ? "active" : ""
            } ${collapsed ? "justify-center" : ""}`}
            aria-expanded={!collapsed ? isOpen : undefined}
          >
            <Icon className="w-[18px] h-[18px] shrink-0" />
            {!collapsed && (
              <>
                <span className="flex-1 text-left" style={{ fontWeight: groupActive ? 500 : 400 }}>{item.label}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </>
            )}
          </button>
          {!collapsed && isOpen && (
            <div className="legacy-submenu ml-5 mt-1 space-y-0.5 pl-3">
              {item.children.map((child) => {
                const ChildIcon = ICON_MAP[child.icon] || FileText;
                const childActive = child.key === activeChildKey;
                const isCircle = child.icon === "Circle";
                return (
                  <button
                    key={child.key}
                    type="button"
                    onClick={() => {
                      if (!child.path) return;
                      navigate(child.path);
                      onMobileClose();
                    }}
                    className={`legacy-menu-item flex items-center gap-2.5 px-3 py-1.5 rounded text-[13px] transition-all ${
                      childActive ? "active" : ""
                    }`}
                    style={{ fontWeight: childActive ? 500 : 400 }}
                    aria-current={childActive ? "page" : undefined}
                  >
                    {isCircle ? (
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${childActive ? "bg-[#E30613]" : "bg-slate-500"}`} />
                    ) : (
                      <ChildIcon className="w-4 h-4 shrink-0" />
                    )}
                    {child.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    return (
      <button
        key={item.key}
        type="button"
        onClick={() => {
          if (!item.path) return;
          navigate(item.path);
          onMobileClose();
        }}
        className={`legacy-menu-item flex items-center gap-3 px-3 py-2 rounded text-sm transition-all ${
          active ? "active" : ""
        } ${collapsed ? "justify-center" : ""}`}
        style={{ fontWeight: active ? 500 : 400 }}
        aria-current={active ? "page" : undefined}
      >
        <Icon className="w-[18px] h-[18px] shrink-0" />
        {!collapsed && (
          <span className="flex-1">{item.label}</span>
        )}
        {!collapsed && item.badge && item.badge > 0 && (
          <span className="min-w-[20px] h-5 flex items-center justify-center px-1.5 text-[10px] bg-amber-500 text-white rounded-full" style={{ fontWeight: 600 }}>
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={onMobileClose} />
      )}

      <aside className={`legacy-sidebar fixed top-0 left-0 z-50 h-full flex flex-col transition-all duration-300 ${
        collapsed ? "w-[72px]" : "w-[260px]"
      } ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:relative`}
      >
        {/* Logo */}
        <div className={`legacy-brand shrink-0 flex items-center gap-3 px-4 h-14 ${collapsed ? "justify-center" : ""}`}>
          <BrandLogo tone="light" size="sm" compact={collapsed} />
        </div>

        {/* User card */}
        {!collapsed && (
          <div className="legacy-user-card shrink-0 mx-4 mt-4 mb-2 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-500 overflow-hidden flex items-center justify-center text-white text-xs shrink-0 relative">
                {user.avatar ? (
                  <img src={user.avatar} alt="User Image" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-[10px] text-center leading-tight break-words px-1">User Image</div>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-[15px] truncate text-[#e7ecfb]" style={{ fontWeight: 600 }}>{user.name}</p>
                <p className="mt-0.5 text-[11px] uppercase tracking-[0.18em] text-[#8fa0c2]">
                  {ROLE_LABELS[user.role] ?? user.role}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto px-3 py-3">
          <div className="space-y-4">
            {groupedMenuItems.map((section) => (
              <div key={section.key} className="space-y-1.5">
                {!collapsed && (
                  <div className="px-3 pb-1">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-[#8fa0c2]" style={{ fontWeight: 700 }}>
                      {section.label}
                    </p>
                  </div>
                )}
                <div className="space-y-1">
                  {section.items.map(renderMenuItem)}
                </div>
              </div>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="shrink-0 border-t border-[#4f5962] px-3 py-3 space-y-1">
          <Link
            to="/admin/profile"
            onClick={onMobileClose}
            className={`legacy-menu-item flex items-center gap-3 px-3 py-2 rounded text-sm transition-all ${collapsed ? "justify-center" : ""}`}
          >
            <UserCog className="w-[18px] h-[18px]" />
            {!collapsed && <span>Profile Saya</span>}
          </Link>
          <button
            onClick={() => { logout(); navigate("/login"); }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm text-rose-200 hover:text-white hover:bg-white/10 transition-all ${collapsed ? "justify-center" : ""}`}
          >
            <LogOut className="w-[18px] h-[18px]" />
            {!collapsed && <span>Keluar</span>}
          </button>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          className="hidden lg:flex absolute -right-3 top-16 w-6 h-6 bg-white border border-slate-300 rounded-full items-center justify-center text-slate-500 hover:text-slate-700 shadow-sm z-10"
        >
          {collapsed ? <ChevronsRight className="w-3.5 h-3.5" /> : <ChevronsLeft className="w-3.5 h-3.5" />}
        </button>
      </aside>
    </>
  );
}
