import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import {
  Award,
  Banknote,
  Bell,
  Building2,
  ChevronDown,
  Cog,
  ExternalLink,
  FileText,
  FolderTree,
  GraduationCap,
  Grid,
  Maximize,
  Menu,
  Minimize,
  MinusSquare,
  PlusSquare,
  Search,
  Shield,
  Star,
  UserCog,
  Users,
  X,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useToast } from "./Toast";
import {
  SUPER_ADMIN_CONTROL_SIDEBAR,
  type AdministrationMenuItem,
} from "../../config/superAdminAdministrationMenu";
import {
  SUPER_ADMIN_HEADER_ADMIN_MENU,
  SUPER_ADMIN_HEADER_PRIMARY_LINKS,
  SUPER_ADMIN_HEADER_RIGHT_ACTIONS,
  type SuperAdminHeaderMenuItem,
  type SuperAdminHeaderPrimaryLink,
} from "../../config/superAdminHeaderConfig";

interface SuperAdminHeaderProps {
  notificationCount?: number;
  canAccessAdminLppm?: boolean;
  onToggleSidebar: () => void;
  onToggleFullscreen: () => void;
  onToggleControlSidebar?: () => void;
  onOpenNotifications: () => void;
  onLogout: () => void;
  isFullscreen?: boolean;
}

interface SearchTarget {
  key: string;
  label: string;
  section: string;
  path?: string;
  note?: string;
}

const ROOT_MENU_STYLE =
  "absolute left-0 top-full z-50 mt-1 w-[280px] rounded-lg border border-slate-200 bg-white shadow-xl";
const CHILD_MENU_STYLE =
  "absolute left-full top-0 z-50 ml-1 min-w-[240px] rounded-lg border border-slate-200 bg-white shadow-xl";

const ADMIN_ICON_MAP = {
  UserCog,
  Building2,
  GraduationCap,
  FolderTree,
  Star,
  Users,
  Shield,
  Cog,
  Award,
  Banknote,
};

function AdministrationItemIcon({ item }: { item: AdministrationMenuItem }) {
  const Icon = item.icon ? ADMIN_ICON_MAP[item.icon] : FileText;
  return <Icon className="h-4 w-4 shrink-0" />;
}

function getUnavailableMessage(item: {
  label: string;
  note?: string;
  placeholder?: boolean;
}) {
  if (item.note) {
    return item.note;
  }

  if (item.placeholder) {
    return `Menu "${item.label}" masih placeholder dari header Laravel lama.`;
  }

  return `Menu "${item.label}" belum punya halaman React baru.`;
}

function flattenAdminMenu(
  items: SuperAdminHeaderMenuItem[],
  section = "Admin LPPM",
): SearchTarget[] {
  return items.flatMap((item, index) => {
    const key = `${section}-${item.label}-${index}`;
    const self: SearchTarget[] = item.children?.length
      ? []
      : [{ key, label: item.label, section, path: item.path, note: item.note }];

    if (!item.children?.length) {
      return self;
    }

    return [
      ...self,
      ...flattenAdminMenu(item.children, `${section} / ${item.label}`),
    ];
  });
}

function flattenControlSidebar(): SearchTarget[] {
  return SUPER_ADMIN_CONTROL_SIDEBAR.flatMap((group) =>
    group.items.map((item) => ({
      key: `control-${group.key}-${item.key}`,
      label: item.label,
      section: `Control Sidebar / ${group.label}`,
      path: item.path,
      note: item.note,
    })),
  );
}

function HeaderMenuBranch({
  item,
  depth = 0,
  onSelect,
  closeMenus,
}: {
  item: SuperAdminHeaderMenuItem;
  depth?: number;
  onSelect: (item: SuperAdminHeaderMenuItem) => void;
  closeMenus: () => void;
}) {
  const [open, setOpen] = useState(false);
  const hasChildren = Boolean(item.children?.length);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open]);

  if (!hasChildren) {
    return (
      <button
        type="button"
        title={item.note || item.label}
        onClick={() => {
          onSelect(item);
          closeMenus();
        }}
        className="flex w-full items-start gap-2 px-4 py-2.5 text-left text-sm text-slate-700 transition-colors hover:bg-red-50 hover:text-[#E30613]"
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
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform ${
            open ? "rotate-180" : depth === 0 ? "" : "-rotate-90"
          }`}
        />
      </button>

      {open ? (
        <div className={CHILD_MENU_STYLE}>
          <div className="max-h-[360px] overflow-y-auto py-1">
            {item.children?.map((child, index) => (
              <HeaderMenuBranch
                key={`${item.label}-${child.label}-${index}`}
                item={child}
                depth={depth + 1}
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

function AdminLppmDropdown({
  canAccessAdminLppm,
  onSelect,
}: {
  canAccessAdminLppm: boolean;
  onSelect: (item: SuperAdminHeaderMenuItem) => void;
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const closeMenus = () => setOpen(false);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  if (!canAccessAdminLppm) {
    return null;
  }

  return (
    <div ref={dropdownRef} className="relative hidden sm:block">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-1 px-3 py-2 text-[15px] text-slate-500 transition-colors hover:text-slate-800"
      >
        Admin LPPM
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open ? (
        <div className={ROOT_MENU_STYLE}>
          <div className="max-h-[420px] overflow-y-auto py-1">
            {SUPER_ADMIN_HEADER_ADMIN_MENU.map((item, index) => (
              <HeaderMenuBranch
                key={`${item.label}-${index}`}
                item={item}
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

export function SuperAdminHeader({
  notificationCount = 0,
  canAccessAdminLppm = true,
  onToggleSidebar,
  onToggleFullscreen,
  onToggleControlSidebar,
  onOpenNotifications,
  onLogout,
  isFullscreen = false,
}: SuperAdminHeaderProps) {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const [openAdminGroups, setOpenAdminGroups] = useState<string[]>(["setting"]);

  const searchRef = useRef<HTMLDivElement>(null);
  const controlSidebarRef = useRef<HTMLDivElement>(null);

  const searchTargets = useMemo<SearchTarget[]>(
    () => [
      ...SUPER_ADMIN_HEADER_PRIMARY_LINKS.map((item, index) => ({
        key: `primary-${index}-${item.label}`,
        label: item.label,
        section: "Navbar",
        path: item.path,
        note: item.placeholder ? `Menu "${item.label}" masih placeholder dari header Laravel lama.` : undefined,
      })),
      ...flattenAdminMenu(SUPER_ADMIN_HEADER_ADMIN_MENU),
      ...flattenControlSidebar(),
    ],
    [],
  );

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }

      if (
        controlSidebarRef.current &&
        !controlSidebarRef.current.contains(event.target as Node)
      ) {
        setAdminMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const handleNavigate = (item: SuperAdminHeaderMenuItem | SuperAdminHeaderPrimaryLink) => {
    if (item.path) {
      navigate(item.path);
      return;
    }

    showToast(getUnavailableMessage(item), "info");
  };

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalized = searchValue.trim().toLowerCase();
    if (!normalized) {
      showToast("Masukkan kata kunci menu yang ingin dibuka.", "warning");
      return;
    }

    const match = searchTargets.find((item) =>
      `${item.label} ${item.section}`.toLowerCase().includes(normalized),
    );

    if (!match) {
      showToast(`Menu "${searchValue}" tidak ditemukan.`, "info");
      return;
    }

    if (match.path) {
      navigate(match.path);
    } else {
      showToast(match.note || `Menu "${match.label}" belum tersedia.`, "info");
    }

    setSearchOpen(false);
    setSearchValue("");
  };

  const toggleAdminGroup = (groupKey: string) => {
    setOpenAdminGroups((current) =>
      current.includes(groupKey)
        ? current.filter((item) => item !== groupKey)
        : [...current, groupKey],
    );
  };

  const searchAction = SUPER_ADMIN_HEADER_RIGHT_ACTIONS.find((item) => item.key === "search");
  const notificationsAction = SUPER_ADMIN_HEADER_RIGHT_ACTIONS.find(
    (item) => item.key === "notifications",
  );
  const fullscreenAction = SUPER_ADMIN_HEADER_RIGHT_ACTIONS.find(
    (item) => item.key === "fullscreen",
  );
  const controlSidebarAction = SUPER_ADMIN_HEADER_RIGHT_ACTIONS.find(
    (item) => item.key === "control-sidebar",
  );

  return (
    <header className="legacy-topbar sticky top-0 z-30 flex h-14 items-center gap-1 px-3">
      <button
        type="button"
        onClick={onToggleSidebar}
        className="rounded p-2 text-slate-500 transition-colors hover:text-slate-800 lg:hidden"
        aria-label="Toggle sidebar"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="hidden items-center md:flex">
        {SUPER_ADMIN_HEADER_PRIMARY_LINKS.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => handleNavigate(item)}
            className={`px-3 py-2 text-[15px] transition-colors ${
              item.placeholder
                ? "text-slate-300 hover:text-slate-400"
                : "text-slate-500 hover:text-slate-800"
            }`}
            title={
              item.placeholder
                ? `Menu "${item.label}" masih placeholder dari header Laravel lama.`
                : item.label
            }
          >
            {item.label}
          </button>
        ))}

        <AdminLppmDropdown canAccessAdminLppm={canAccessAdminLppm} onSelect={handleNavigate} />

        <button
          type="button"
          onClick={onLogout}
          className="px-3 py-2 text-[15px] text-slate-500 transition-colors hover:text-slate-800"
        >
          Logout
        </button>
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
                aria-label="Tutup pencarian"
              >
                <X className="h-4 w-4" />
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="rounded p-2 text-slate-500 transition-colors hover:text-slate-800"
              title={searchAction?.label || "Search"}
              aria-label={searchAction?.label || "Search"}
            >
              <Search className="h-5 w-5" />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={onOpenNotifications}
          className="relative rounded p-2 text-slate-500 transition-colors hover:text-slate-800"
          title={notificationsAction?.label || "Notifications"}
          aria-label={notificationsAction?.label || "Notifications"}
        >
          <Bell className="h-5 w-5" />
          {notificationCount > 0 ? (
            <span className="absolute right-0.5 top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold leading-none text-white">
              {notificationCount > 99 ? "99+" : notificationCount}
            </span>
          ) : null}
        </button>

        <button
          type="button"
          onClick={onToggleFullscreen}
          className={`hidden rounded p-2 transition-colors sm:block ${
            isFullscreen ? "bg-red-50 text-[#E30613]" : "text-slate-500 hover:text-slate-800"
          }`}
          title={fullscreenAction?.label || "Fullscreen"}
          aria-label={fullscreenAction?.label || "Fullscreen"}
        >
          {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
        </button>

        <div className="relative" ref={controlSidebarRef}>
          <button
            type="button"
            onClick={() => {
              setAdminMenuOpen((value) => !value);
              onToggleControlSidebar?.();
            }}
            className="rounded p-2 text-slate-500 transition-colors hover:text-slate-800"
            title={controlSidebarAction?.label || "Control Sidebar"}
            aria-label={controlSidebarAction?.label || "Control Sidebar"}
          >
            <Grid className="h-5 w-5" />
          </button>

          {adminMenuOpen ? (
            <div className="absolute right-0 top-full mt-2 max-h-[calc(100vh-80px)] w-[280px] overflow-y-auto rounded-sm border border-[#454d55] bg-[#343a40] font-['Source_Sans_3',sans-serif] shadow-xl">
              <div className="border-b border-[#4f5962] bg-[#343a40] px-4 py-3 text-[1.1rem] text-white">
                Administrasi
              </div>

              <div className="py-2 text-[#c2c7d0]">
                {SUPER_ADMIN_CONTROL_SIDEBAR.map((group) => (
                  <div key={group.key}>
                    <button
                      type="button"
                      onClick={() => toggleAdminGroup(group.key)}
                      className={`flex w-full items-center gap-3 px-4 py-2 transition-colors hover:bg-white/10 ${
                        group.key === "hibah" ? "mt-1" : ""
                      }`}
                    >
                      {openAdminGroups.includes(group.key) ? (
                        <MinusSquare className="h-4 w-4" />
                      ) : (
                        <PlusSquare className="h-4 w-4" />
                      )}
                      <span className="flex-1 text-left text-[14.5px]">{group.label}</span>
                      <ChevronDown
                        className={`h-3.5 w-3.5 transition-transform ${
                          openAdminGroups.includes(group.key) ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {openAdminGroups.includes(group.key) ? (
                      <div className="border-y border-[#4f5962] bg-[#2f3640] py-1">
                        {group.items.map((item) => (
                          <button
                            key={item.key}
                            type="button"
                            onClick={() => {
                              navigate(item.path);
                              setAdminMenuOpen(false);
                            }}
                            className="flex w-full items-start gap-3 px-8 py-2 text-left text-[14px] transition-colors hover:bg-white/10 hover:text-white"
                          >
                            <AdministrationItemIcon item={item} />
                            <span className="min-w-0">
                              <span className="block">{item.label}</span>
                              {item.note ? (
                                <span className="mt-0.5 block text-[11px] text-[#9da5ad]">
                                  {item.note}
                                </span>
                              ) : null}
                            </span>
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
