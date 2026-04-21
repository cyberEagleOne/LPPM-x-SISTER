import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Banknote, FileSignature, BookMarked, Presentation, Users, CheckCircle, Clock, AlertTriangle, TrendingUp, ArrowUpRight, BarChart3, CalendarCheck, ExternalLink, ClipboardList, ShoppingBag, UserPlus, PieChart } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from "recharts";
import { useAuth } from "../../context/AuthContext";
import { resolveRoleTemplate, roleMatchesAny } from "../../config/roleTemplates";
import { PageWrapper } from "../../components/admin/PageWrapper";
import { StatusBadge, type StatusType } from "../../components/admin/StatusBadge";
import { SkeletonCard } from "../../components/admin/SkeletonLoader";
import { EmptyState } from "../../components/admin/EmptyState";

interface StatCard { label: string; value: number; icon: any; color?: string; bg: string; change?: string; link: string; }

const ADMINLTE_SUPER_STATS = [
  {
    groupTitle: "Surat Ijin Penelitian/PKM",
    items: [
      { label: "Surat Ijin Masuk", value: 0, icon: ShoppingBag, bg: "bg-[#17a2b8]", link: "/admin/surat-tugas" },
      { label: "Surat Ijin Baru", value: 0, icon: BarChart3, bg: "bg-[#28a745]", link: "/admin/surat-tugas" },
      { label: "Surat Ijin On Progress", value: 0, icon: UserPlus, bg: "bg-[#ffc107]", link: "/admin/surat-tugas" },
      { label: "Surat Ijin Selesai", value: 0, icon: PieChart, bg: "bg-[#dc3545]", link: "/admin/surat-tugas" },
    ]
  },
  {
    groupTitle: "Data Insentif",
    items: [
      { label: "Insentif Masuk", value: 0, icon: ShoppingBag, bg: "bg-[#17a2b8]", link: "/admin/insentif" },
      { label: "Insentif Baru", value: 0, icon: BarChart3, bg: "bg-[#28a745]", link: "/admin/insentif" },
      { label: "Insentif On Progress", value: 0, icon: UserPlus, bg: "bg-[#ffc107]", link: "/admin/insentif" },
      { label: "Insentif Selesai", value: 0, icon: PieChart, bg: "bg-[#dc3545]", link: "/admin/insentif" },
    ]
  }
];

const ADMIN_STATS: StatCard[] = [
  { label: "Total Hibah", value: 48, icon: Banknote, color: "text-blue-600", bg: "bg-blue-50", change: "+12%", link: "/admin/hibah/penelitian" },
  { label: "Surat Tugas", value: 32, icon: FileSignature, color: "text-emerald-600", bg: "bg-emerald-50", change: "+8%", link: "/admin/surat-tugas" },
  { label: "Konferensi", value: 15, icon: Presentation, color: "text-purple-600", bg: "bg-purple-50", change: "+5%", link: "/admin/konferensi" },
  { label: "Publikasi", value: 67, icon: BookMarked, color: "text-amber-600", bg: "bg-amber-50", change: "+20%", link: "/admin/laporan-publikasi/artikel" },
  { label: "User Aktif", value: 124, icon: Users, color: "text-cyan-600", bg: "bg-cyan-50", link: "/admin/users" },
  { label: "Pending Review", value: 9, icon: Clock, color: "text-orange-600", bg: "bg-orange-50", link: "/admin/hibah/penelitian" },
];

const REVIEWER_STATS: StatCard[] = [
  { label: "Perlu Di-review", value: 4, icon: Clock, color: "text-orange-600", bg: "bg-orange-50", link: "/admin/hibah/penelitian" },
  { label: "Sudah Di-review", value: 12, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50", link: "/admin/hibah/penelitian" },
  { label: "Revisi Masuk", value: 2, icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50", link: "/admin/hibah/penelitian" },
];


interface RecentItem { id: string; title: string; type: string; status: StatusType; date: string; link: string; }

const RECENT_ITEMS: RecentItem[] = [
  { id: "1", title: "Penelitian IoT untuk Smart Campus", type: "Hibah Internal", status: "pending-review", date: "2026-02-24", link: "/admin/hibah/penelitian" },
  { id: "2", title: "Surat Tugas Seminar Nasional", type: "Surat Tugas", status: "approved", date: "2026-02-23", link: "/admin/surat-tugas" },
  { id: "3", title: "Paper ICALT 2026", type: "Konferensi", status: "submitted", date: "2026-02-22", link: "/admin/konferensi" },
  { id: "4", title: "Jurnal AI & Education Q1", type: "Publikasi", status: "revisi", date: "2026-02-21", link: "/admin/laporan-publikasi/artikel" },
  { id: "5", title: "Hibah Penelitian Energi Terbarukan", type: "Hibah Internal", status: "draft", date: "2026-02-20", link: "/admin/hibah/penelitian" },
  { id: "6", title: "Workshop Machine Learning", type: "Konferensi", status: "approved", date: "2026-02-19", link: "/admin/konferensi" },
];

const TASK_ITEMS: RecentItem[] = [
  { id: "t1", title: "Review pengajuan hibah HIB-001", type: "Hibah", status: "pending-review", date: "Deadline: Hari ini", link: "/admin/hibah/penelitian" },
  { id: "t2", title: "Verifikasi pembayaran ST-004", type: "Surat Tugas", status: "submitted", date: "Deadline: Besok", link: "/admin/surat-tugas" },
  { id: "t3", title: "Approve publikasi PUB-003", type: "Publikasi", status: "submitted", date: "Deadline: 27 Feb", link: "/admin/laporan-publikasi/artikel" },
];

const CHART_DATA = [
  { month: "Sep", hibah: 3, surat: 5, pub: 4 },
  { month: "Okt", hibah: 5, surat: 7, pub: 3 },
  { month: "Nov", hibah: 4, surat: 6, pub: 6 },
  { month: "Des", hibah: 6, surat: 10, pub: 8 },
  { month: "Jan", hibah: 5, surat: 8, pub: 4 },
  { month: "Feb", hibah: 7, surat: 6, pub: 6 },
];

const PIE_DATA = [
  { name: "Draft", value: 5, color: "#94a3b8" },
  { name: "Review", value: 9, color: "#f59e0b" },
  { name: "Revisi", value: 4, color: "#f97316" },
  { name: "Approved", value: 14, color: "#22c55e" },
  { name: "Ditolak", value: 1, color: "#ef4444" },
];

/* ──── Hutang Cards Data (for dosen dashboard) ──── */

interface HutangCard {
  count: number;
  label: string;
  linkLabel: string;
  link: string;
}

const DOSEN_HUTANG: HutangCard[] = [
  { count: 2, label: "Hutang Luaran Konferensi", linkLabel: "Lihat Hutang", link: "/admin/konferensi" },
  { count: 1, label: "Hutang Luaran Hibah", linkLabel: "Lihat Hutang", link: "/admin/hibah/penelitian" },
];

/* ──── Profile info for dosen ──── */

interface DosenProfile {
  nama: string;
  jabatan: string;
  nidn: string;
  fakultas: string;
  prodi: string;
  sintaId: string;
  sintaUrl: string;
  roadmap: string;
  bidangFocus: string;
}

const MOCK_DOSEN_PROFILE: Record<string, DosenProfile> = {
  default: {
    nama: "Dr. Arif Ramadhan, M.Sc.",
    jabatan: "Lektor",
    nidn: "0312098901",
    fakultas: "Fakultas Sains dan Teknologi",
    prodi: "Prodi Teknik Informatika",
    sintaId: "6822334",
    sintaUrl: "https://sinta.kemdikbud.go.id/authors/profile/6822334",
    roadmap: "Artificial Intelligence",
    bidangFocus: "Machine Learning, Computer Vision",
  },
};

interface QuickActionItem {
  label: string;
  description: string;
  icon: any;
  link: string;
}

interface ProgressRow {
  label: string;
  count: number;
  pct: number;
  color: string;
}

const DOSEN_STATS: StatCard[] = [
  { label: "Proposal Aktif", value: 3, icon: Banknote, color: "text-[#E30613]", bg: "bg-[#fff1f2]", change: "+1", link: "/admin/hibah/penelitian" },
  { label: "Surat Tugas Aktif", value: 2, icon: FileSignature, color: "text-emerald-600", bg: "bg-emerald-50", change: "+1", link: "/admin/surat-tugas" },
  { label: "Luaran Publikasi", value: 4, icon: BookMarked, color: "text-amber-600", bg: "bg-amber-50", link: "/admin/laporan-publikasi/artikel" },
  { label: "Agenda Konferensi", value: 1, icon: Presentation, color: "text-sky-600", bg: "bg-sky-50", link: "/admin/konferensi" },
];

const DOSEN_QUICK_ACTIONS: QuickActionItem[] = [
  {
    label: "Ajukan Penelitian",
    description: "Masuk ke modul hibah penelitian untuk membuat proposal baru.",
    icon: Banknote,
    link: "/admin/hibah/penelitian",
  },
  {
    label: "Ajukan Pengabdian",
    description: "Lanjutkan draft atau buat proposal PKM terbaru.",
    icon: ClipboardList,
    link: "/admin/hibah/pengabdian",
  },
  {
    label: "Buat Surat Tugas",
    description: "Kelola ajuan surat tugas dari workspace dosen yang sama.",
    icon: FileSignature,
    link: "/admin/surat-tugas",
  },
  {
    label: "Lapor Publikasi",
    description: "Submit artikel, buku, KI, atau prototipe pada periode aktif.",
    icon: BookMarked,
    link: "/admin/laporan-publikasi/artikel",
  },
];

const DOSEN_RECENT_ITEMS: RecentItem[] = [
  { id: "d1", title: "Proposal Penelitian AI untuk Pembelajaran Adaptif", type: "Hibah Internal", status: "submitted", date: "2026-03-18", link: "/admin/hibah/penelitian" },
  { id: "d2", title: "Laporan kemajuan Pengabdian Smart Village", type: "PKM", status: "pending-review", date: "2026-03-17", link: "/admin/hibah/pengabdian" },
  { id: "d3", title: "Artikel Scopus tentang Computer Vision", type: "Publikasi", status: "approved", date: "2026-03-16", link: "/admin/laporan-publikasi/artikel" },
  { id: "d4", title: "Permintaan revisi surat tugas seminar nasional", type: "Surat Tugas", status: "revisi", date: "2026-03-15", link: "/admin/surat-tugas" },
];

const DOSEN_STATUS_ROWS: ProgressRow[] = [
  { label: "Proposal Draft", count: 2, pct: 24, color: "bg-slate-400" },
  { label: "Menunggu Review", count: 3, pct: 38, color: "bg-amber-500" },
  { label: "Perlu Revisi", count: 1, pct: 14, color: "bg-orange-500" },
  { label: "Disetujui", count: 2, pct: 24, color: "bg-emerald-500" },
];

export function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  if (!user) return null;

  const roleTemplate = resolveRoleTemplate(user.role);
  const isDosen = roleTemplate === "dosen";
  const isAdmin = roleTemplate === "administrator";

  const getStats = () => {
    if (isAdmin) return ADMIN_STATS;
    if (roleTemplate === "reviewer") return REVIEWER_STATS;
    return []; // dosen uses profile view instead
  };
  const stats = getStats();

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Selamat Pagi";
    if (h < 17) return "Selamat Siang";
    return "Selamat Malam";
  };

  const showChart = roleMatchesAny(user.role, ["administrator"]);
  const showTasks = roleMatchesAny(user.role, ["administrator", "reviewer"]);

  const dosenProfile = {
    ...MOCK_DOSEN_PROFILE.default,
    nama: user.name,
    nidn: user.nidn || MOCK_DOSEN_PROFILE.default.nidn,
    fakultas: user.fakultas || MOCK_DOSEN_PROFILE.default.fakultas,
    prodi: user.prodi || MOCK_DOSEN_PROFILE.default.prodi,
  };

  /* ═══════════════════════════════════════════
     DOSEN DASHBOARD - Profile-centric view
     ═══════════════════════════════════════════ */

  if (isDosen) {
    return (
      <PageWrapper
        title="Dashboard Dosen"
        breadcrumbs={[{ label: "Dashboard" }]}
        actions={
          <Link
            to="/admin/hibah/penelitian"
            className="inline-flex items-center gap-2 rounded-xl bg-[#E30613] px-4 py-2.5 text-sm text-white"
            style={{ fontWeight: 600 }}
          >
            Buka Workspace Hibah <ArrowUpRight className="h-4 w-4" />
          </Link>
        }
      >
        {loading ? (
          <div className="space-y-6">
            <SkeletonCard />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <div className="border-b border-slate-100 px-6 py-5">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-400" style={{ fontWeight: 700 }}>
                  Profil Dosen
                </p>
                <h2 className="mt-2 text-2xl text-slate-900" style={{ fontWeight: 700 }}>
                  {dosenProfile.nama}
                </h2>
              </div>

              <div className="grid gap-6 px-6 py-6 md:grid-cols-[auto_minmax(0,1fr)] md:items-start">
                <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-[#E30613] text-3xl text-white shadow-sm">
                  {user.name.charAt(0)}
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl bg-slate-50 px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Jabatan</p>
                      <p className="mt-1 text-sm text-slate-900" style={{ fontWeight: 700 }}>
                        {dosenProfile.jabatan}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.14em] text-slate-400">NIDN</p>
                      <p className="mt-1 text-sm text-slate-900" style={{ fontWeight: 700 }}>
                        {dosenProfile.nidn}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Fakultas</p>
                      <p className="mt-1 text-sm text-slate-900" style={{ fontWeight: 700 }}>
                        {dosenProfile.fakultas}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Program Studi</p>
                      <p className="mt-1 text-sm text-slate-900" style={{ fontWeight: 700 }}>
                        {dosenProfile.prodi}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href={dosenProfile.sintaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-[#E30613] px-4 py-2.5 text-sm text-white"
                      style={{ fontWeight: 600 }}
                    >
                      Sinta {dosenProfile.sintaId} <ExternalLink className="h-4 w-4" />
                    </a>
                    <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600">
                      <TrendingUp className="h-4 w-4 text-emerald-500" />
                      {dosenProfile.roadmap}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.14em] text-slate-400" style={{ fontWeight: 700 }}>
                      Bidang Fokus
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {dosenProfile.bidangFocus}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              {DOSEN_STATS.map((stat) => (
                <Link
                  key={stat.label}
                  to={stat.link}
                  className="group overflow-hidden rounded-xl border border-slate-200 bg-white p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.16em] text-slate-400" style={{ fontWeight: 700 }}>
                        {stat.label}
                      </p>
                      <p className="mt-3 text-3xl text-slate-900" style={{ fontWeight: 700 }}>
                        {stat.value}
                      </p>
                    </div>
                    <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${stat.bg}`}>
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-sm text-slate-500">Masuk ke modul</span>
                    <span className="inline-flex items-center gap-1 text-sm text-slate-900 transition-transform group-hover:translate-x-0.5" style={{ fontWeight: 600 }}>
                      Open <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </section>

            <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(340px,0.9fr)]">
              <div className="rounded-xl border border-slate-200 bg-white">
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-400" style={{ fontWeight: 700 }}>
                      Quick Actions
                    </p>
                    <h3 className="mt-2 text-lg text-slate-900" style={{ fontWeight: 700 }}>
                      Jalur kerja yang paling sering dipakai dosen
                    </h3>
                  </div>
                </div>

                <div className="grid gap-4 px-6 py-6 md:grid-cols-2">
                  {DOSEN_QUICK_ACTIONS.map((action) => (
                    <Link
                      key={action.label}
                      to={action.link}
                      className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 transition-colors hover:bg-white"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm text-slate-900" style={{ fontWeight: 700 }}>
                            {action.label}
                          </p>
                          <p className="mt-2 text-sm leading-6 text-slate-500">
                            {action.description}
                          </p>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white">
                          <action.icon className="h-4 w-4 text-[#E30613]" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="border-t border-slate-100 px-6 py-5">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-400" style={{ fontWeight: 700 }}>
                    Kewajiban Luaran
                  </p>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    {DOSEN_HUTANG.map((hutang) => (
                      <div key={hutang.label} className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-3xl text-slate-900" style={{ fontWeight: 700 }}>
                              {hutang.count}
                            </p>
                            <p className="mt-1 text-sm text-slate-600" style={{ fontWeight: 500 }}>
                              {hutang.label}
                            </p>
                            <Link
                              to={hutang.link}
                              className="mt-3 inline-flex items-center gap-1.5 text-sm text-[#E30613]"
                              style={{ fontWeight: 600 }}
                            >
                              {hutang.linkLabel} <ExternalLink className="h-3 w-3" />
                            </Link>
                          </div>
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white">
                            <ClipboardList className="h-5 w-5 text-[#E30613]" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <section className="rounded-xl border border-slate-200 bg-white">
                  <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                    <div>
                      <p className="text-xs uppercase tracking-[0.16em] text-slate-400" style={{ fontWeight: 700 }}>
                        Aktivitas Terkini
                      </p>
                      <h3 className="mt-2 text-lg text-slate-900" style={{ fontWeight: 700 }}>
                        Update terbaru workspace dosen
                      </h3>
                    </div>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {DOSEN_RECENT_ITEMS.map((item) => (
                      <Link key={item.id} to={item.link} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/80">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-slate-900" style={{ fontWeight: 600 }}>
                            {item.title}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {item.type} · {item.date}
                          </p>
                        </div>
                        <StatusBadge status={item.status} />
                      </Link>
                    ))}
                  </div>
                </section>

                <section className="rounded-xl border border-slate-200 bg-white p-6">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-400" style={{ fontWeight: 700 }}>
                    Ringkasan Status
                  </p>
                  <div className="mt-4 space-y-3">
                    {DOSEN_STATUS_ROWS.map((row) => (
                      <div key={row.label}>
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-xs text-slate-500">{row.label}</span>
                          <span className="text-xs text-slate-700" style={{ fontWeight: 600 }}>
                            {row.count}
                          </span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                          <div className={`h-full rounded-full ${row.color}`} style={{ width: `${row.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </section>
          </div>
        )}
      </PageWrapper>
    );
  }

  /* ═══════════════════════════════════════════
     DEFAULT DASHBOARD (Admin/LPPM/Finance/etc)
     ═══════════════════════════════════════════ */

  if (isAdmin) {
    return (
      <PageWrapper
        title="Dashboard Admin"
        breadcrumbs={[{ label: "Dashboard" }]}
        actions={
          <Link
            to="/admin/reporting"
            className="inline-flex items-center gap-2 rounded-xl bg-[#E30613] px-4 py-2.5 text-sm text-white"
            style={{ fontWeight: 600 }}
          >
            Buka Reporting <ArrowUpRight className="h-4 w-4" />
          </Link>
        }
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {ADMIN_STATS.map((stat) => (
            <Link
              key={stat.label}
              to={stat.link}
              className="group overflow-hidden rounded-xl border border-slate-200 bg-white p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-400" style={{ fontWeight: 700 }}>
                    {stat.label}
                  </p>
                  <p className="mt-3 text-3xl text-slate-900" style={{ fontWeight: 700 }}>
                    {stat.value}
                  </p>
                </div>
                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-sm text-slate-500">Lihat detail modul</span>
                <span className="inline-flex items-center gap-1 text-sm text-slate-900 transition-transform group-hover:translate-x-0.5" style={{ fontWeight: 600 }}>
                  Open <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.9fr)]">
          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-slate-400" style={{ fontWeight: 700 }}>
                  Performance Overview
                </p>
                <h2 className="mt-2 text-2xl text-slate-900" style={{ fontWeight: 700 }}>
                  Pergerakan pengajuan lintas modul
                </h2>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="rounded-2xl bg-slate-50 px-3 py-2">
                  <p className="text-slate-400">Hibah</p>
                  <p className="text-slate-900" style={{ fontWeight: 700 }}>
                    48
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-3 py-2">
                  <p className="text-slate-400">Surat</p>
                  <p className="text-slate-900" style={{ fontWeight: 700 }}>
                    32
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-3 py-2">
                  <p className="text-slate-400">Publikasi</p>
                  <p className="text-slate-900" style={{ fontWeight: 700 }}>
                    67
                  </p>
                </div>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={310}>
              <BarChart data={CHART_DATA} barGap={10}>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#7b88a8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#7b88a8" }} axisLine={false} tickLine={false} width={34} />
                <Tooltip
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 16,
                    border: "1px solid #d9e3f5",
                    boxShadow: "0 24px 50px -36px rgba(15,23,42,0.34)",
                  }}
                  cursor={{ fill: "rgba(227, 6, 19, 0.05)" }}
                />
                <Bar dataKey="hibah" name="Hibah" fill="#E30613" radius={[8, 8, 0, 0]} />
                <Bar dataKey="surat" name="Surat Tugas" fill="#0f766e" radius={[8, 8, 0, 0]} />
                <Bar dataKey="pub" name="Publikasi" fill="#475569" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </section>

          <div className="space-y-6">
            <section className="rounded-xl border border-slate-200 bg-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-400" style={{ fontWeight: 700 }}>
                    Status Mix
                  </p>
                  <h3 className="mt-2 text-lg text-slate-900" style={{ fontWeight: 700 }}>
                    Distribusi status pengajuan
                  </h3>
                </div>
                <TrendingUp className="h-5 w-5 text-slate-400" />
              </div>

              <ResponsiveContainer width="100%" height={180}>
                <RechartsPieChart>
                  <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={48} outerRadius={72} paddingAngle={4} dataKey="value">
                    {PIE_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 16, border: "1px solid #d9e3f5" }} />
                </RechartsPieChart>
              </ResponsiveContainer>

              <div className="mt-3 space-y-2">
                {PIE_DATA.map((item) => (
                  <div key={item.name} className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2">
                    <span className="inline-flex items-center gap-2 text-sm text-slate-600">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      {item.name}
                    </span>
                    <span className="text-sm text-slate-900" style={{ fontWeight: 700 }}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-6">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400" style={{ fontWeight: 700 }}>
                Queue Snapshot
              </p>
              <div className="mt-4 space-y-3">
                {TASK_ITEMS.map((item) => (
                  <Link
                    key={item.id}
                    to={item.link}
                    className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-3.5 py-3 hover:bg-white"
                  >
                    <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-2xl bg-white">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-slate-900" style={{ fontWeight: 600 }}>
                        {item.title}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">{item.date}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(340px,0.85fr)]">
          <section className="rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-slate-400" style={{ fontWeight: 700 }}>
                  Latest Activity
                </p>
                <h3 className="mt-2 text-lg text-slate-900" style={{ fontWeight: 700 }}>
                  Aktivitas terbaru lintas modul
                </h3>
              </div>
              <Link to="/admin/notifikasi" className="inline-flex items-center gap-1 text-sm text-[#E30613]" style={{ fontWeight: 600 }}>
                Buka notifikasi <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="divide-y divide-slate-100">
              {RECENT_ITEMS.map((item) => (
                <Link key={item.id} to={item.link} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/80">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-slate-900" style={{ fontWeight: 600 }}>
                      {item.title}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {item.type} · {item.date}
                    </p>
                  </div>
                  <StatusBadge status={item.status} />
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-400" style={{ fontWeight: 700 }}>
              Workflow Boards
            </p>
            <div className="mt-4 space-y-4">
              {ADMINLTE_SUPER_STATS.map((group) => (
                <div key={group.groupTitle} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm text-slate-900" style={{ fontWeight: 700 }}>
                      {group.groupTitle}
                    </h3>
                    <span className="rounded-full bg-white px-2.5 py-1 text-xs text-slate-600">
                      {group.items.reduce((sum, item) => sum + item.value, 0)} total
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {group.items.map((item) => (
                      <Link key={item.label} to={item.link} className="rounded-2xl bg-white px-3 py-3">
                        <p className="text-xl text-slate-900" style={{ fontWeight: 700 }}>
                          {item.value}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">{item.label}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title={`${greeting()}, ${user.name.split(" ")[0]}!`} subtitle="Berikut ringkasan aktivitas LPPM Anda hari ini.">
      {/* Stat Cards */}
      <div className={`grid gap-4 ${stats.length > 4 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"}`}>
        {loading
          ? Array.from({ length: stats.length }).map((_, i) => <SkeletonCard key={i} />)
          : stats.map((stat) => (
              <Link key={stat.label} to={stat.link} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-slate-300 transition-all group">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-slate-500" style={{ fontWeight: 500 }}>{stat.label}</span>
                  <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center`}><stat.icon className={`w-[18px] h-[18px] ${stat.color}`} /></div>
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-2xl text-slate-900" style={{ fontWeight: 700 }}>{stat.value}</span>
                  {stat.change && <span className="flex items-center gap-0.5 text-xs text-green-600" style={{ fontWeight: 500 }}><TrendingUp className="w-3 h-3" />{stat.change}</span>}
                </div>
              </Link>
            ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Chart */}
          {showChart && !loading && (
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-sm text-slate-800 mb-4" style={{ fontWeight: 600 }}>Tren Pengajuan (6 Bulan Terakhir)</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={CHART_DATA} barGap={2}>
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={30} />
                  <Tooltip
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}
                    cursor={{ fill: "rgba(0,0,0,0.03)" }}
                  />
                  <Bar dataKey="hibah" name="Hibah" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="surat" name="Surat Tugas" fill="#10b981" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="pub" name="Publikasi" fill="#f59e0b" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Task List */}
          {showTasks && !loading && (
            <div className="bg-white rounded-xl border border-slate-200">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <CalendarCheck className="w-4 h-4 text-[#E30613]" />
                  <h3 className="text-sm text-slate-800" style={{ fontWeight: 600 }}>Tugas Prioritas</h3>
                </div>
                <span className="text-[10px] bg-[#E30613] text-white px-2 py-0.5 rounded-full" style={{ fontWeight: 600 }}>{TASK_ITEMS.length}</span>
              </div>
              {TASK_ITEMS.length === 0 ? (
                <EmptyState variant="no-data" title="Tidak Ada Tugas" description="Semua tugas telah diselesaikan." />
              ) : (
                <div className="divide-y divide-slate-50">
                  {TASK_ITEMS.map((item) => (
                    <Link key={item.id} to={item.link} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors group">
                      <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-4 h-4 text-orange-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-800 truncate group-hover:text-[#E30613] transition-colors" style={{ fontWeight: 500 }}>{item.title}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{item.type} &middot; {item.date}</p>
                      </div>
                      <StatusBadge status={item.status} />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Recent Activity */}
          <div className="bg-white rounded-xl border border-slate-200">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h3 className="text-sm text-slate-800" style={{ fontWeight: 600 }}>Aktivitas Terbaru</h3>
              <Link to="/admin/notifikasi" className="text-xs text-[#E30613] hover:underline flex items-center gap-1" style={{ fontWeight: 500 }}>
                Lihat Semua <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
            {loading ? (
              <div className="p-5 space-y-4 animate-pulse">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4"><div className="h-4 flex-1 bg-slate-100 rounded" /><div className="h-5 w-20 bg-slate-100 rounded-full" /></div>
                ))}
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {RECENT_ITEMS.map((item) => (
                  <Link key={item.id} to={item.link} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors group">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-800 truncate group-hover:text-[#E30613] transition-colors" style={{ fontWeight: 500 }}>{item.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{item.type} &middot; {item.date}</p>
                    </div>
                    <StatusBadge status={item.status} />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm text-slate-800 mb-4" style={{ fontWeight: 600 }}>Aksi Cepat</h3>
            <div className="space-y-2">
              {isAdmin ? (
                <>
                  <Link to="/admin/hibah/penelitian" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-600 hover:bg-slate-50 hover:text-[#E30613] transition-colors border border-slate-100">
                    <Banknote className="w-4 h-4" /> Ajukan Hibah Baru
                  </Link>
                  <Link to="/admin/surat-tugas" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-600 hover:bg-slate-50 hover:text-[#E30613] transition-colors border border-slate-100">
                    <FileSignature className="w-4 h-4" /> Buat Surat Tugas
                  </Link>
                  <Link to="/admin/laporan-publikasi/artikel" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-600 hover:bg-slate-50 hover:text-[#E30613] transition-colors border border-slate-100">
                    <BookMarked className="w-4 h-4" /> Submit Publikasi
                  </Link>
                </>
              ) : (
                <Link to="/admin/notifikasi" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-600 hover:bg-slate-50 hover:text-[#E30613] transition-colors border border-slate-100">
                  <BarChart3 className="w-4 h-4" /> Lihat Notifikasi
                </Link>
              )}
            </div>
          </div>

          {/* Pie chart / Status Overview */}
          {!loading && (
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-sm text-slate-800 mb-3" style={{ fontWeight: 600 }}>Distribusi Status</h3>
              <ResponsiveContainer width="100%" height={160}>
                <RechartsPieChart>
                  <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                    {PIE_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
                </RechartsPieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 justify-center">
                {PIE_DATA.map((d) => (
                  <div key={d.name} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-[10px] text-slate-500">{d.name} ({d.value})</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status bar chart */}
          {!loading && (
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-sm text-slate-800 mb-4" style={{ fontWeight: 600 }}>Ringkasan Status</h3>
              <div className="space-y-3">
                {[
                  { label: "Draft", count: 5, pct: 15, color: "bg-gray-400" },
                  { label: "Pending Review", count: 9, pct: 27, color: "bg-amber-500" },
                  { label: "Revisi", count: 4, pct: 12, color: "bg-orange-500" },
                  { label: "Approved", count: 14, pct: 42, color: "bg-green-500" },
                  { label: "Ditolak", count: 1, pct: 3, color: "bg-red-500" },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-500">{s.label}</span>
                      <span className="text-xs text-slate-700" style={{ fontWeight: 600 }}>{s.count}</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${s.color} transition-all`} style={{ width: `${s.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
