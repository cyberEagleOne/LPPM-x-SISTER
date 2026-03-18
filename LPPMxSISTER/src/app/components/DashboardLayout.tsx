import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { useState } from "react";
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  User,
  ClipboardCheck,
  Users,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Bell,
  Search,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

import { NotificationDropdown } from "./NotificationDropdown";
import { motion, AnimatePresence } from "motion/react";

interface DashboardLayoutProps {
  role: "dosen" | "reviewer" | "admin";
}

const navConfig = {
  dosen: {
    label: "Dosen",
    color: "#1e3a8a",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", to: "/dosen" },
      { icon: PlusCircle, label: "Ajukan Penelitian", to: "/dosen/tambah" },
    ],
  },
  reviewer: {
    label: "Reviewer",
    color: "#065f46",
    items: [
      { icon: ClipboardCheck, label: "Review Penelitian", to: "/reviewer" },
      { icon: Clock, label: "Pending", to: "/reviewer/pending" },
      { icon: CheckCircle, label: "Disetujui", to: "/reviewer/approved" },
      { icon: XCircle, label: "Ditolak", to: "/reviewer/rejected" },
    ],
  },
  admin: {
    label: "Administrator",
    color: "#7c2d12",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", to: "/admin" },
      { icon: Users, label: "Manajemen Pengguna", to: "/admin/users" },
      { icon: FileText, label: "Manajemen Artikel", to: "/admin/artikel" },
    ],
  },
};

const userInfo = {
  dosen: { name: "Dr. Siti Rahma, M.Si.", subtitle: "Dosen Tetap · NIDN 0012345678", avatar: "SR" },
  reviewer: { name: "Prof. Ahmad Fauzi", subtitle: "Reviewer Eksternal", avatar: "AF" },
  admin: { name: "Admin LPPM", subtitle: "Super Administrator", avatar: "AL" },
};

export function DashboardLayout({ role }: DashboardLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const config = navConfig[role];
  const user = userInfo[role];

  const accentColor = config.color;
  const profilePath = `/${role}/profile`;

  return (
    <div className="min-h-screen flex bg-[#f1f5f9]">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col w-64 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:inset-auto lg:flex`}
        style={{ backgroundColor: accentColor }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-white/10">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <GraduationCap className="text-white" size={18} />
            </div>
            <div>
              <p className="text-white" style={{ fontSize: 13, fontWeight: 700 }}>LPPM × SISTER</p>
              <p className="text-white/60" style={{ fontSize: 10 }}>Dashboard</p>
            </div>
          </Link>
          <button
            className="lg:hidden p-1.5 rounded-md text-white/70 hover:text-white hover:bg-white/10"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* Role Badge */}
        <div className="mx-4 mt-4 mb-2 px-3 py-2 rounded-lg bg-white/10">
          <p className="text-white/60" style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>Mode Akses</p>
          <p className="text-white mt-0.5" style={{ fontSize: 13, fontWeight: 600 }}>{config.label}</p>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 pt-2 pb-4 flex flex-col gap-1">
          {config.items.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  active
                    ? "bg-white text-gray-900"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
                style={{ fontSize: 14, fontWeight: active ? 600 : 500 }}
              >
                <item.icon size={18} className={active ? "text-gray-700" : "text-white/70"} />
                {item.label}
                {active && <ChevronRight size={14} className="ml-auto text-gray-400" />}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="px-3 pb-5 border-t border-white/10 pt-4">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/10">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
            >
              <span className="text-white" style={{ fontSize: 12, fontWeight: 700 }}>{user.avatar}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white truncate" style={{ fontSize: 13, fontWeight: 600 }}>{user.name}</p>
              <p className="text-white/60 truncate" style={{ fontSize: 11 }}>{user.subtitle}</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/login")}
            className="mt-2 w-full flex items-center gap-2 px-3 py-2 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors"
            style={{ fontSize: 13 }}
          >
            <LogOut size={16} />
            Keluar
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div className="hidden sm:flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
              <Search size={15} className="text-gray-400" />
              <input
                type="text"
                placeholder="Cari..."
                className="bg-transparent outline-none text-gray-700 w-48"
                style={{ fontSize: 13 }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <NotificationDropdown />
            <Link
              to={profilePath}
              className="flex items-center gap-2 pl-2 border-l border-gray-200 hover:bg-gray-50 rounded-xl px-2 py-1 transition-colors"
              title="Buka profil"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: accentColor, fontSize: 12, fontWeight: 700 }}
              >
                {user.avatar}
              </div>
              <div className="hidden sm:block">
                <p className="text-gray-900" style={{ fontSize: 13, fontWeight: 600 }}>{user.name}</p>
                <p className="text-gray-400" style={{ fontSize: 11 }}>{config.label}</p>
              </div>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}