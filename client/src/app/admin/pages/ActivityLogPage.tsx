import { useState, useEffect } from "react";
import { Search, Filter, ChevronLeft, ChevronRight, Clock, User, FileText, Banknote, CheckCircle, XCircle, Edit, Send, Trash2, LogIn, Shield, Settings, Eye, Download, RotateCcw, AlertTriangle, Calendar } from "lucide-react";
import { PageWrapper } from "../components/PageWrapper";
import { SkeletonTable } from "../components/SkeletonLoader";
import { useAuth } from "../context/AuthContext";

interface ActivityEvent {
  id: string;
  timestamp: string;
  timeAgo: string;
  user: { name: string; role: string; avatar: string };
  action: string;
  actionType: "create" | "update" | "delete" | "approve" | "reject" | "submit" | "review" | "login" | "system" | "upload" | "revert";
  module: string;
  target: string;
  detail: string;
  metadata?: Record<string, string>;
}

const ACTION_ICONS: Record<string, typeof FileText> = {
  create: FileText,
  update: Edit,
  delete: Trash2,
  approve: CheckCircle,
  reject: XCircle,
  submit: Send,
  review: Eye,
  login: LogIn,
  system: Settings,
  upload: Download,
  revert: RotateCcw,
};

const ACTION_COLORS: Record<string, { bg: string; text: string; ring: string }> = {
  create: { bg: "bg-blue-500", text: "text-blue-600", ring: "ring-blue-100" },
  update: { bg: "bg-amber-500", text: "text-amber-600", ring: "ring-amber-100" },
  delete: { bg: "bg-red-500", text: "text-red-600", ring: "ring-red-100" },
  approve: { bg: "bg-green-500", text: "text-green-600", ring: "ring-green-100" },
  reject: { bg: "bg-red-500", text: "text-red-600", ring: "ring-red-100" },
  submit: { bg: "bg-indigo-500", text: "text-indigo-600", ring: "ring-indigo-100" },
  review: { bg: "bg-purple-500", text: "text-purple-600", ring: "ring-purple-100" },
  login: { bg: "bg-gray-500", text: "text-gray-600", ring: "ring-gray-100" },
  system: { bg: "bg-slate-500", text: "text-slate-600", ring: "ring-slate-100" },
  upload: { bg: "bg-cyan-500", text: "text-cyan-600", ring: "ring-cyan-100" },
  revert: { bg: "bg-orange-500", text: "text-orange-600", ring: "ring-orange-100" },
};

const ACTION_LABELS: Record<string, string> = {
  create: "Membuat",
  update: "Mengubah",
  delete: "Menghapus",
  approve: "Menyetujui",
  reject: "Menolak",
  submit: "Mengajukan",
  review: "Me-review",
  login: "Login",
  system: "Sistem",
  upload: "Mengunggah",
  revert: "Mengembalikan",
};

const MOCK_ACTIVITIES: ActivityEvent[] = [
  {
    id: "ACT-001",
    timestamp: "2026-03-03 09:45:22",
    timeAgo: "15 menit lalu",
    user: { name: "Dr. Arif Ramadhan, M.Sc.", role: "Dosen", avatar: "AR" },
    action: "Submit Proposal",
    actionType: "submit",
    module: "Hibah Internal",
    target: "HIB-009 — Penelitian Blockchain untuk Identitas Digital",
    detail: "Proposal telah di-submit permanen untuk review. Semua anggota tim telah menyetujui.",
    metadata: { "Skema": "Penelitian Terapan", "Dana": "Rp 35.000.000", "Tim": "5 anggota" },
  },
  {
    id: "ACT-002",
    timestamp: "2026-03-03 09:30:11",
    timeAgo: "30 menit lalu",
    user: { name: "Prof. Dimas Prakoso", role: "Ketua LPPM", avatar: "DP" },
    action: "Approve Hibah",
    actionType: "approve",
    module: "Hibah Internal",
    target: "HIB-002 — Pengembangan AI Chatbot untuk Layanan Akademik",
    detail: "Hibah disetujui setelah review substansi, admin, dan finance selesai.",
    metadata: { "Skor Review": "87/100", "Status Finance": "RAB Valid" },
  },
  {
    id: "ACT-003",
    timestamp: "2026-03-03 09:15:44",
    timeAgo: "45 menit lalu",
    user: { name: "Dr. Lestari Handayani", role: "Reviewer", avatar: "LH" },
    action: "Submit Review",
    actionType: "review",
    module: "Hibah Internal",
    target: "HIB-001 — Penelitian IoT untuk Smart Campus",
    detail: 'Review substansi selesai. Rekomendasi: "Revisi Minor". Metodologi perlu diperkuat.',
    metadata: { "Skor": "72/100", "Rekomendasi": "Revisi Minor" },
  },
  {
    id: "ACT-004",
    timestamp: "2026-03-03 08:50:33",
    timeAgo: "1 jam lalu",
    user: { name: "Dewi Finance", role: "Finance", avatar: "DF" },
    action: "Verifikasi RAB",
    actionType: "approve",
    module: "Hibah Internal",
    target: "HIB-002 — Pengembangan AI Chatbot",
    detail: "RAB terverifikasi. Semua komponen biaya sesuai standar.",
    metadata: { "Total RAB": "Rp 35.000.000", "Status": "Valid" },
  },
  {
    id: "ACT-005",
    timestamp: "2026-03-03 08:30:00",
    timeAgo: "1.5 jam lalu",
    user: { name: "Staff LPPM", role: "Admin LPPM", avatar: "SL" },
    action: "Verifikasi Administrasi",
    actionType: "approve",
    module: "Hibah Internal",
    target: "HIB-002 — Pengembangan AI Chatbot",
    detail: "Kelengkapan administrasi terverifikasi: Proposal, CV, Surat Pernyataan lengkap.",
  },
  {
    id: "ACT-006",
    timestamp: "2026-03-03 08:15:22",
    timeAgo: "2 jam lalu",
    user: { name: "Dr. Rina Wulandari", role: "Dosen", avatar: "RW" },
    action: "Upload Dokumen",
    actionType: "upload",
    module: "Publikasi",
    target: "PUB-012 — Smart Campus IoT Framework (ICALT 2026)",
    detail: "Mengunggah bukti accepted paper dan LOA dari konferensi.",
  },
  {
    id: "ACT-007",
    timestamp: "2026-03-03 07:45:10",
    timeAgo: "2.5 jam lalu",
    user: { name: "Dr. Hendra Riset", role: "Koordinator Riset", avatar: "HR" },
    action: "Reject Track Record",
    actionType: "reject",
    module: "Track Record",
    target: "TR-045 — Publikasi Jurnal Nasional Terakreditasi",
    detail: "URL publikasi tidak valid. Diminta untuk memperbaiki dan submit ulang.",
    metadata: { "Alasan": "URL tidak dapat diakses" },
  },
  {
    id: "ACT-008",
    timestamp: "2026-03-02 16:30:55",
    timeAgo: "Kemarin, 16:30",
    user: { name: "Admin Sistem", role: "Administrator", avatar: "AS" },
    action: "Update Pengaturan",
    actionType: "update",
    module: "Settings",
    target: "Session Timeout",
    detail: "Mengubah session timeout dari 60 menit menjadi 120 menit.",
    metadata: { "Dari": "60 menit", "Ke": "120 menit" },
  },
  {
    id: "ACT-009",
    timestamp: "2026-03-02 15:20:18",
    timeAgo: "Kemarin, 15:20",
    user: { name: "Dr. Arif Ramadhan, M.Sc.", role: "Dosen", avatar: "AR" },
    action: "Buat Draft Proposal",
    actionType: "create",
    module: "Hibah Internal",
    target: "HIB-009 — Penelitian Blockchain untuk Identitas Digital",
    detail: "Membuat draft proposal baru dengan skema Penelitian Terapan.",
  },
  {
    id: "ACT-010",
    timestamp: "2026-03-02 14:10:30",
    timeAgo: "Kemarin, 14:10",
    user: { name: "Dr. Faisal Rahman", role: "Dosen", avatar: "FR" },
    action: "Submit Track Record",
    actionType: "submit",
    module: "Track Record",
    target: "TR-046 — Konferensi ICALT 2026",
    detail: "Mensubmit laporan kehadiran konferensi internasional untuk verifikasi.",
  },
  {
    id: "ACT-011",
    timestamp: "2026-03-02 11:00:00",
    timeAgo: "Kemarin, 11:00",
    user: { name: "HRD Staff", role: "HRD", avatar: "HS" },
    action: "Export Data",
    actionType: "system",
    module: "HRD",
    target: "Export Verified Data Q1 2026",
    detail: "Mengexport data kinerja dosen yang sudah terverifikasi untuk kalkulasi insentif.",
    metadata: { "Total Dosen": "45", "Periode": "Q1 2026" },
  },
  {
    id: "ACT-012",
    timestamp: "2026-03-02 09:05:12",
    timeAgo: "Kemarin, 09:05",
    user: { name: "Admin Sistem", role: "Administrator", avatar: "AS" },
    action: "Hapus User",
    actionType: "delete",
    module: "User Management",
    target: "User: user_lama@pradita.ac.id",
    detail: "Menghapus akun user yang sudah tidak aktif.",
  },
  {
    id: "ACT-013",
    timestamp: "2026-03-01 16:45:00",
    timeAgo: "2 hari lalu",
    user: { name: "Dr. Arif Ramadhan, M.Sc.", role: "Dosen", avatar: "AR" },
    action: "Revisi Proposal",
    actionType: "revert",
    module: "Hibah Internal",
    target: "HIB-003 — Studi Komparatif Green Building",
    detail: "Mengunggah dokumen revisi sesuai catatan reviewer. Metodologi diperbaiki.",
  },
  {
    id: "ACT-014",
    timestamp: "2026-03-01 10:30:00",
    timeAgo: "2 hari lalu",
    user: { name: "Prof. Dimas Prakoso", role: "Ketua LPPM", avatar: "DP" },
    action: "Verified Track Record",
    actionType: "approve",
    module: "Track Record",
    target: "TR-040 — Publikasi Q1 Scopus",
    detail: "Final approval untuk track record publikasi Scopus Q1.",
  },
];

// Group by date
function groupByDate(activities: ActivityEvent[]): { date: string; label: string; events: ActivityEvent[] }[] {
  const groups: Record<string, ActivityEvent[]> = {};
  activities.forEach((a) => {
    const date = a.timestamp.split(" ")[0];
    if (!groups[date]) groups[date] = [];
    groups[date].push(a);
  });
  const today = "2026-03-03";
  const yesterday = "2026-03-02";
  return Object.entries(groups).map(([date, events]) => ({
    date,
    label: date === today ? "Hari Ini" : date === yesterday ? "Kemarin" : date,
    events,
  }));
}

export function ActivityLogPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [moduleFilter, setModuleFilter] = useState("all");
  const [actionFilter, setActionFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const filtered = MOCK_ACTIVITIES.filter((a) => {
    const matchSearch =
      a.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.detail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchModule = moduleFilter === "all" || a.module === moduleFilter;
    const matchAction = actionFilter === "all" || a.actionType === actionFilter;
    return matchSearch && matchModule && matchAction;
  });

  const grouped = groupByDate(filtered);
  const modules = [...new Set(MOCK_ACTIVITIES.map((a) => a.module))];
  const actionTypes = [...new Set(MOCK_ACTIVITIES.map((a) => a.actionType))];

  return (
    <PageWrapper
      title="Timeline Activity Log"
      subtitle="Riwayat seluruh aktivitas sistem secara kronologis"
      breadcrumbs={[{ label: "Sistem" }, { label: "Activity Log" }]}
      actions={
        <button className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-[#E30613] rounded-lg hover:bg-[#c00510] transition-colors" style={{ fontWeight: 500 }}>
          <Download className="w-4 h-4" /> Export Log
        </button>
      }
    >
      {loading ? (
        <SkeletonTable rows={8} />
      ) : (
        <>
          {/* Filters */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari user, target, atau detail..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613]/40 placeholder:text-slate-400"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={moduleFilter}
                onChange={(e) => setModuleFilter(e.target.value)}
                className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-600"
              >
                <option value="all">Semua Modul</option>
                {modules.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-600"
              >
                <option value="all">Semua Aksi</option>
                {actionTypes.map((a) => (
                  <option key={a} value={a}>{ACTION_LABELS[a] || a}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Total Aktivitas", value: MOCK_ACTIVITIES.length, color: "text-blue-600", bg: "bg-blue-50" },
              { label: "Hari Ini", value: MOCK_ACTIVITIES.filter((a) => a.timestamp.startsWith("2026-03-03")).length, color: "text-green-600", bg: "bg-green-50" },
              { label: "Approval", value: MOCK_ACTIVITIES.filter((a) => a.actionType === "approve").length, color: "text-emerald-600", bg: "bg-emerald-50" },
              { label: "Modul Aktif", value: modules.length, color: "text-purple-600", bg: "bg-purple-50" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center shrink-0`}>
                  <span className={`text-lg ${stat.color}`} style={{ fontWeight: 700 }}>{stat.value}</span>
                </div>
                <span className="text-xs text-slate-500" style={{ fontWeight: 500 }}>{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div className="space-y-8">
            {grouped.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-500" style={{ fontWeight: 500 }}>Tidak ada aktivitas ditemukan</p>
              </div>
            ) : (
              grouped.map((group) => (
                <div key={group.date}>
                  {/* Date header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-xs text-slate-600" style={{ fontWeight: 600 }}>{group.label}</span>
                    </div>
                    <div className="flex-1 h-px bg-slate-200" />
                    <span className="text-xs text-slate-400">{group.events.length} aktivitas</span>
                  </div>

                  {/* Events */}
                  <div className="relative ml-5">
                    {/* Vertical line */}
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-slate-200" />

                    <div className="space-y-1">
                      {group.events.map((event, idx) => {
                        const ActionIcon = ACTION_ICONS[event.actionType] || FileText;
                        const colors = ACTION_COLORS[event.actionType] || ACTION_COLORS.system;
                        const isExpanded = expandedId === event.id;

                        return (
                          <div key={event.id} className="relative pl-8">
                            {/* Timeline dot */}
                            <div className={`absolute left-0 top-4 -translate-x-1/2 w-8 h-8 rounded-full ${colors.bg} flex items-center justify-center ring-4 ${colors.ring} ring-white z-10`}>
                              <ActionIcon className="w-3.5 h-3.5 text-white" />
                            </div>

                            {/* Event card */}
                            <div
                              className={`bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md hover:border-slate-300 transition-all cursor-pointer ${isExpanded ? "shadow-md border-slate-300" : ""}`}
                              onClick={() => setExpandedId(isExpanded ? null : event.id)}
                            >
                              <div className="flex items-start gap-3">
                                {/* Avatar */}
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-white text-[10px] shrink-0" style={{ fontWeight: 600 }}>
                                  {event.user.avatar}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-sm text-slate-800" style={{ fontWeight: 600 }}>{event.user.name}</span>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${colors.bg.replace("500", "50")} ${colors.text}`} style={{ fontWeight: 500 }}>
                                      {ACTION_LABELS[event.actionType]}
                                    </span>
                                    <span className="text-xs text-slate-400">•</span>
                                    <span className="text-xs text-slate-400">{event.user.role}</span>
                                  </div>
                                  <p className="text-sm text-slate-600 mt-0.5" style={{ fontWeight: 500 }}>{event.target}</p>
                                  <div className="flex items-center gap-2 mt-1.5">
                                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                                      <Clock className="w-3 h-3" /> {event.timeAgo}
                                    </span>
                                    <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-50 text-slate-500" style={{ fontWeight: 500 }}>{event.module}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Expanded detail */}
                              {isExpanded && (
                                <div className="mt-3 pt-3 border-t border-slate-100">
                                  <p className="text-sm text-slate-600">{event.detail}</p>
                                  {event.metadata && (
                                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                                      {Object.entries(event.metadata).map(([key, val]) => (
                                        <div key={key} className="px-3 py-2 bg-slate-50 rounded-lg">
                                          <p className="text-[10px] text-slate-400 uppercase" style={{ fontWeight: 600 }}>{key}</p>
                                          <p className="text-xs text-slate-700 mt-0.5" style={{ fontWeight: 500 }}>{val}</p>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                  <div className="flex items-center gap-3 mt-3">
                                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                                      <Clock className="w-3 h-3" /> {event.timestamp}
                                    </span>
                                    <span className="text-[11px] text-slate-400">ID: {event.id}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </PageWrapper>
  );
}
