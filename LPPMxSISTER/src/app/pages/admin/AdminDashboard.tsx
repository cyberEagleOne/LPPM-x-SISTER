import { Link } from "react-router";
import {
  Users,
  FileText,
  ChevronRight,
  Shield,
  UserCheck,
  Edit2,
  Trash2,
  PlusCircle,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { motion } from "motion/react";

// ─── Quick stat data ──────────────────────────────────────────────────────────

const userStats = [
  { label: "Dosen", count: 321, color: "#1e3a8a", bg: "#eff6ff" },
  { label: "Reviewer", count: 14, color: "#065f46", bg: "#ecfdf5" },
  { label: "Admin", count: 3, color: "#7c2d12", bg: "#fef2f2" },
];

const recentUsers = [
  { name: "Dr. Siti Rahma, M.Si.", email: "siti.rahma@pradita.ac.id", role: "Dosen", prodi: "Teknik Informatika" },
  { name: "Prof. Ahmad Fauzi", email: "ahmad.fauzi@pradita.ac.id", role: "Reviewer", prodi: "—" },
  { name: "Dr. Ayu Lestari", email: "ayu.lestari@pradita.ac.id", role: "Dosen", prodi: "Farmasi" },
  { name: "Ir. Reza Pradipta", email: "reza.pradita@pradita.ac.id", role: "Dosen", prodi: "Teknik Sipil" },
];

const recentArticles = [
  { id: 1, title: "Inovasi Riset Universitas Menuju Era Society 5.0", category: "Inovasi", status: "Terbit", date: "5 Mar 2026" },
  { id: 2, title: "Workshop Penulisan Artikel Ilmiah Internasional", category: "Kegiatan", status: "Terbit", date: "1 Mar 2026" },
  { id: 3, title: "Kolaborasi LPPM dengan Industri Teknologi Nasional", category: "Kegiatan", status: "Draf", date: "3 Feb 2026" },
  { id: 4, title: "Pengumuman Hibah Penelitian Internal 2026", category: "Pengumuman", status: "Terbit", date: "20 Feb 2026" },
];

const roleColors: Record<string, string> = {
  Dosen: "bg-blue-100 text-blue-700",
  Reviewer: "bg-green-100 text-green-700",
  Admin: "bg-red-100 text-red-700",
};

const categoryColors: Record<string, string> = {
  Inovasi: "bg-blue-100 text-blue-700",
  Kegiatan: "bg-green-100 text-green-700",
  Pengumuman: "bg-amber-100 text-amber-700",
};

export function AdminDashboard() {
  return (
    <div>
      {/* ── Page header ── */}
      <div className="mb-8">
        <h1 className="text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-0.5" style={{ fontSize: 14 }}>
          Kelola pengguna dan artikel — LPPM Universitas Pradita
        </p>
      </div>

      {/* ── Role summary cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {userStats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: s.bg }}
            >
              {s.label === "Dosen" && <Users size={22} style={{ color: s.color }} />}
              {s.label === "Reviewer" && <UserCheck size={22} style={{ color: s.color }} />}
              {s.label === "Admin" && <Shield size={22} style={{ color: s.color }} />}
            </div>
            <div>
              <p className="text-gray-900" style={{ fontSize: 28, fontWeight: 800, lineHeight: 1 }}>
                {s.count}
              </p>
              <p className="text-gray-500 mt-1" style={{ fontSize: 13 }}>{s.label} Aktif</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Two-column layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── User Management panel ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#eff6ff] flex items-center justify-center">
                <Users size={16} className="text-[#1e3a8a]" />
              </div>
              <div>
                <h2 className="text-gray-900">Manajemen Pengguna</h2>
                <p className="text-gray-400" style={{ fontSize: 12 }}>Assign peran & kelola akun</p>
              </div>
            </div>
            <Link
              to="/admin/users"
              className="flex items-center gap-1 text-[#1e3a8a] hover:text-[#1e40af] transition-colors"
              style={{ fontSize: 13, fontWeight: 600 }}
            >
              Kelola Semua <ChevronRight size={14} />
            </Link>
          </div>

          {/* User list preview */}
          <div className="divide-y divide-gray-50 flex-1">
            {recentUsers.map((u) => (
              <div key={u.email} className="px-6 py-4 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-white"
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    backgroundColor:
                      u.role === "Reviewer" ? "#065f46" : u.role === "Admin" ? "#7c2d12" : "#1e3a8a",
                  }}
                >
                  {u.name.split(" ")[1]?.[0] || u.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 truncate" style={{ fontSize: 14, fontWeight: 600 }}>
                    {u.name}
                  </p>
                  <p className="text-gray-400 truncate" style={{ fontSize: 12 }}>
                    {u.email}
                  </p>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full flex-shrink-0 ${roleColors[u.role]}`}
                  style={{ fontSize: 11, fontWeight: 600 }}
                >
                  {u.role}
                </span>
              </div>
            ))}
          </div>

          <div className="px-6 py-4 border-t border-gray-100">
            <Link
              to="/admin/users"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-[#1e3a8a] text-[#1e3a8a] hover:bg-[#eff6ff] transition-colors"
              style={{ fontSize: 13, fontWeight: 700 }}
            >
              <Users size={15} />
              Buka Manajemen Pengguna
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* ── Article Management panel ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#fef2f2] flex items-center justify-center">
                <FileText size={16} className="text-[#7c2d12]" />
              </div>
              <div>
                <h2 className="text-gray-900">Manajemen Artikel</h2>
                <p className="text-gray-400" style={{ fontSize: 12 }}>Buat, edit, dan hapus artikel</p>
              </div>
            </div>
            <Link
              to="/admin/artikel"
              className="flex items-center gap-1 text-[#7c2d12] hover:text-[#92400e] transition-colors"
              style={{ fontSize: 13, fontWeight: 600 }}
            >
              Kelola Semua <ChevronRight size={14} />
            </Link>
          </div>

          {/* Article list preview */}
          <div className="divide-y divide-gray-50 flex-1">
            {recentArticles.map((a) => (
              <div key={a.id} className="px-6 py-4 flex items-start gap-3 hover:bg-gray-50 transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-[#fef2f2] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <BookOpen size={13} className="text-[#7c2d12]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 truncate" style={{ fontSize: 14, fontWeight: 600 }}>
                    {a.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`px-2 py-0.5 rounded-full ${categoryColors[a.category] ?? "bg-gray-100 text-gray-600"}`}
                      style={{ fontSize: 10, fontWeight: 600 }}
                    >
                      {a.category}
                    </span>
                    <span className="text-gray-400" style={{ fontSize: 11 }}>{a.date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 rounded-lg text-gray-400 hover:bg-amber-50 hover:text-amber-600 transition-colors">
                    <Edit2 size={13} />
                  </button>
                  <button className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>
                <span
                  className={`flex-shrink-0 px-2 py-0.5 rounded-full ${
                    a.status === "Terbit"
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                  style={{ fontSize: 10, fontWeight: 600 }}
                >
                  {a.status}
                </span>
              </div>
            ))}
          </div>

          <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
            <Link
              to="/admin/artikel"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-[#7c2d12] text-[#7c2d12] hover:bg-[#fef2f2] transition-colors"
              style={{ fontSize: 13, fontWeight: 700 }}
            >
              <FileText size={15} />
              Kelola Artikel
            </Link>
            <Link
              to="/admin/artikel"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#7c2d12] text-white hover:bg-[#92400e] transition-colors"
              style={{ fontSize: 13, fontWeight: 700 }}
            >
              <PlusCircle size={15} />
              Buat Baru
            </Link>
          </div>
        </div>
      </div>

      {/* ── Admin scope notice ── */}
      <div className="mt-6 px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 flex items-start gap-3">
        <Shield size={16} className="text-gray-400 flex-shrink-0 mt-0.5" />
        <p className="text-gray-500" style={{ fontSize: 13, lineHeight: 1.65 }}>
          <strong className="text-gray-700">Catatan peran Admin:</strong> Administrator hanya bertanggung jawab atas manajemen pengguna (assign role) dan pengelolaan artikel. Proses review dan persetujuan penelitian adalah tanggung jawab eksklusif <strong className="text-gray-700">Reviewer</strong>.
        </p>
      </div>
    </div>
  );
}