import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import {
  Award,
  Banknote,
  BarChart3,
  Bell,
  BookMarked,
  BookOpen,
  BookOpenCheck,
  Building2,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  ClipboardList,
  Cog,
  Database,
  Download,
  FileBarChart,
  FileSignature,
  FileText,
  FolderTree,
  Gift,
  GraduationCap,
  Grid3X3,
  Handshake,
  Image,
  Key,
  Layers,
  LayoutDashboard,
  LogOut,
  Newspaper,
  PlusSquare,
  Presentation,
  ScrollText,
  Settings,
  Shield,
  Star,
  Tag,
  UserCog,
  Users,
} from "lucide-react";
import { BrandLogo } from "../BrandLogo";
import { getMenuForRole, type MenuItem } from "../../config/menuConfig";
import { ROLE_LABELS, useAuth, type UserRole } from "../../context/AuthContext";

const SIDEBAR_ICON_MAP = {
  Award,
  Banknote,
  BarChart3,
  Bell,
  BookMarked,
  BookOpen,
  BookOpenCheck,
  Building2,
  ClipboardList,
  Cog,
  Database,
  Download,
  FileBarChart,
  FileSignature,
  FileText,
  FolderTree,
  Gift,
  GraduationCap,
  Grid3x3: Grid3X3,
  Handshake,
  Image,
  Key,
  Layers,
  LayoutDashboard,
  Newspaper,
  PlusSquare,
  Presentation,
  ScrollText,
  Settings,
  Shield,
  Star,
  Tag,
  UserCog,
  Users,
};

interface AdminSidebarProps {
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

const ROLE_SECTIONS: Partial<Record<UserRole, SidebarSection[]>> = {
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
  if (!path) {
    return { pathname: "", search: "" };
  }

  const [pathname, search = ""] = path.split("?");
  return {
    pathname,
    search: search ? `?${search}` : "",
  };
}

function collectMenuTargets(menuItems: MenuItem[]) {
  const targets = menuItems.flatMap((item) => [
    ...(item.path ? [splitMenuPath(item.path)] : []),
    ...(item.children ?? []).map((child) => splitMenuPath(child.path)),
  ]);

  return {
    pathnamesWithQueryVariants: new Set(
      targets.filter((target) => target.pathname && target.search).map((target) => target.pathname),
    ),
  };
}

function getMenuMatchScore(
  path: string | undefined,
  currentPathname: string,
  currentSearch: string,
  pathnamesWithQueryVariants: Set<string>,
) {
  const { pathname, search } = splitMenuPath(path);
  if (!pathname) return -1;

  const isRootMenu = pathname === "/admin";
  if (isRootMenu) {
    return currentPathname === pathname && !currentSearch ? pathname.length + 3000 : -1;
  }

  if (search) {
    return currentPathname === pathname && currentSearch === search ? pathname.length + 3000 : -1;
  }

  if (currentPathname === pathname) {
    if (currentSearch && pathnamesWithQueryVariants.has(pathname)) {
      return -1;
    }

    return pathname.length + 2000;
  }

  if (currentPathname.startsWith(`${pathname}/`)) {
    return pathname.length + 1000;
  }

  return -1;
}

function buildSections(menuItems: MenuItem[], role: UserRole) {
  const sectionConfig = ROLE_SECTIONS[role] ?? [
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
}

function SidebarItemIcon({ icon, active = false }: { icon: string; active?: boolean }) {
  if (icon === "Circle") {
    return <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${active ? "bg-[#E30613]" : "bg-slate-500"}`} />;
  }

  const Icon = SIDEBAR_ICON_MAP[icon as keyof typeof SIDEBAR_ICON_MAP] || FileText;
  return <Icon className="h-[18px] w-[18px] shrink-0" />;
}

export function AdminSidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: AdminSidebarProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) return null;

  const currentPathname = location.pathname;
  const currentSearch = location.search || "";
  const menuItems = useMemo(() => getMenuForRole(user.role), [user.role]);
  const { pathnamesWithQueryVariants } = useMemo(() => collectMenuTargets(menuItems), [menuItems]);

  const [preferredKeyByRoute, setPreferredKeyByRoute] = useState<Record<string, string>>({});
  const currentRouteKey = `${currentPathname}${currentSearch}`;
  const preferredKeyForCurrentRoute = preferredKeyByRoute[currentRouteKey] ?? null;

  const activeLeafKey = useMemo(() => {
    const matches = menuItems
      .filter((item) => !item.children?.length && item.path)
      .map((item) => ({
        key: item.key,
        score: getMenuMatchScore(item.path, currentPathname, currentSearch, pathnamesWithQueryVariants),
      }))
      .filter((item) => item.score >= 0);

    if (matches.length === 0) return null;

    const bestScore = Math.max(...matches.map((item) => item.score));
    const bestMatches = matches.filter((item) => item.score === bestScore);
    return bestMatches.find((item) => item.key === preferredKeyForCurrentRoute)?.key ?? bestMatches[0]?.key ?? null;
  }, [menuItems, currentPathname, currentSearch, preferredKeyForCurrentRoute, pathnamesWithQueryVariants]);

  const activeChildMatch = useMemo(() => {
    const matches = menuItems.flatMap((item) =>
      (item.children ?? []).map((child) => ({
        parentKey: item.key,
        childKey: child.key,
        score: getMenuMatchScore(child.path, currentPathname, currentSearch, pathnamesWithQueryVariants),
      })),
    ).filter((item) => item.score >= 0);

    if (matches.length === 0) return null;

    const bestScore = Math.max(...matches.map((item) => item.score));
    const bestMatches = matches.filter((item) => item.score === bestScore);
    return bestMatches.find((item) => item.childKey === preferredKeyForCurrentRoute) ?? bestMatches[0] ?? null;
  }, [menuItems, currentPathname, currentSearch, preferredKeyForCurrentRoute, pathnamesWithQueryVariants]);

  const activeParentKeys = useMemo(
    () => (activeChildMatch?.parentKey ? [activeChildMatch.parentKey] : []),
    [activeChildMatch],
  );

  const [openMenus, setOpenMenus] = useState<string[]>(activeParentKeys);

  useEffect(() => {
    setOpenMenus((current) => {
      const validKeys = new Set(menuItems.filter((item) => item.children?.length).map((item) => item.key));
      const retained = current.filter((key) => validKeys.has(key));
      return Array.from(new Set([...activeParentKeys, ...retained]));
    });
  }, [activeParentKeys, menuItems]);

  const sections = useMemo(() => buildSections(menuItems, user.role), [menuItems, user.role]);

  const handleItemClick = (path?: string, key?: string) => {
    if (!path) return false;
    if (key) {
      setPreferredKeyByRoute((current) => ({
        ...current,
        [path]: key,
      }));
    }
    navigate(path);
    onMobileClose();
    return true;
  };

  const toggleMenu = (key: string) => {
    setOpenMenus((current) =>
      current.includes(key) ? current.filter((item) => item !== key) : [...current, key],
    );
  };

  return (
    <>
      {mobileOpen ? <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={onMobileClose} /> : null}

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
                  <div className="px-1 text-center text-[10px] leading-tight">User Image</div>
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-[15px] text-[#e7ecfb]" style={{ fontWeight: 600 }}>
                  {user.name}
                </p>
                <p className="mt-0.5 text-[11px] uppercase tracking-[0.18em] text-[#8fa0c2]">
                  {ROLE_LABELS[user.role] ?? user.role}
                </p>
              </div>
            </div>
          </div>
        ) : null}

        <nav className="flex-1 overflow-y-auto px-3 py-3">
          <div className="space-y-4">
            {sections.map((section) => (
              <div key={section.key} className="space-y-1.5">
                {!collapsed ? (
                  <div className="px-3 pb-1">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-[#8fa0c2]" style={{ fontWeight: 700 }}>
                      {section.label}
                    </p>
                  </div>
                ) : null}

                <div className="space-y-1">
                  {section.items.map((item) => {
                    const hasChildren = Boolean(item.children?.length);
                    const isOpen = openMenus.includes(item.key);
                    const isActive = hasChildren
                      ? activeParentKeys.includes(item.key)
                      : item.key === activeLeafKey;

                    if (!hasChildren) {
                      return (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => {
                            handleItemClick(item.path, item.key);
                          }}
                          className={`legacy-menu-item flex w-full items-center gap-3 rounded px-3 py-2 text-sm transition-all ${
                            isActive ? "active" : ""
                          } ${collapsed ? "justify-center" : ""}`}
                          aria-current={isActive ? "page" : undefined}
                        >
                          <SidebarItemIcon icon={item.icon} active={isActive} />
                          {!collapsed ? <span className="flex-1 text-left">{item.label}</span> : null}
                          {!collapsed && item.badge && item.badge > 0 ? (
                            <span
                              className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-amber-500 px-1.5 text-[10px] text-white"
                              style={{ fontWeight: 600 }}
                            >
                              {item.badge}
                            </span>
                          ) : null}
                        </button>
                      );
                    }

                    return (
                      <div key={item.key}>
                        <button
                          type="button"
                          onClick={() => toggleMenu(item.key)}
                          className={`legacy-menu-item flex w-full items-center gap-3 rounded px-3 py-2 text-sm transition-all ${
                            isActive ? "active" : ""
                          } ${collapsed ? "justify-center" : ""}`}
                          aria-expanded={!collapsed ? isOpen : undefined}
                        >
                          <SidebarItemIcon icon={item.icon} active={isActive} />
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
                              const childActive = activeChildMatch?.childKey === child.key;

                              return (
                                <button
                                  key={`${item.key}-${child.key}`}
                                  type="button"
                                  onClick={() => {
                                    handleItemClick(child.path, child.key);
                                  }}
                                  className={`legacy-menu-item flex w-full items-center gap-2.5 rounded px-3 py-1.5 text-[13px] transition-all ${
                                    childActive ? "active" : ""
                                  }`}
                                  aria-current={childActive ? "page" : undefined}
                                >
                                  <SidebarItemIcon icon={child.icon} active={childActive} />
                                  <span className="flex-1 text-left">{child.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </nav>

        <div className="shrink-0 space-y-1 border-t border-[#4f5962] px-3 py-3">
          <Link
            to="/admin/profile"
            onClick={onMobileClose}
            className={`legacy-menu-item flex items-center gap-3 rounded px-3 py-2 text-sm transition-all ${collapsed ? "justify-center" : ""}`}
          >
            <UserCog className="h-[18px] w-[18px]" />
            {!collapsed ? <span>Profile Saya</span> : null}
          </Link>
          <button
            type="button"
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className={`flex w-full items-center gap-3 rounded px-3 py-2 text-sm text-rose-200 transition-all hover:bg-white/10 hover:text-white ${collapsed ? "justify-center" : ""}`}
          >
            <LogOut className="h-[18px] w-[18px]" />
            {!collapsed ? <span>Keluar</span> : null}
          </button>
        </div>

        <button
          type="button"
          onClick={onToggle}
          className="absolute -right-3 top-16 hidden h-6 w-6 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-500 shadow-sm hover:text-slate-700 lg:flex"
        >
          {collapsed ? <ChevronsRight className="h-3.5 w-3.5" /> : <ChevronsLeft className="h-3.5 w-3.5" />}
        </button>
      </aside>
    </>
  );
}
