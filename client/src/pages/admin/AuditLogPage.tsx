import { useState, useEffect } from "react";
import { Search, Filter, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { PageWrapper } from "../../components/admin/PageWrapper";
import { SkeletonTable } from "../../components/admin/SkeletonLoader";

interface AuditItem {
  id: string;
  user: string;
  action: string;
  module: string;
  detail: string;
  ip: string;
  timestamp: string;
}

const MOCK_LOGS: AuditItem[] = [
  { id: "LOG-001", user: "Admin Sistem", action: "UPDATE", module: "Settings", detail: 'Mengubah session timeout dari 60 ke 120 menit', ip: "192.168.1.100", timestamp: "2026-02-25 14:30:22" },
  { id: "LOG-002", user: "Dr. Arif Ramadhan", action: "CREATE", module: "Hibah Internal", detail: 'Membuat pengajuan hibah "Penelitian IoT untuk Smart Campus"', ip: "192.168.1.45", timestamp: "2026-02-25 11:15:04" },
  { id: "LOG-003", user: "Prof. Dimas Prakoso", action: "APPROVE", module: "Hibah Internal", detail: 'Approve pengajuan hibah HIB-002', ip: "192.168.1.20", timestamp: "2026-02-24 16:45:30" },
  { id: "LOG-004", user: "Dewi Finance", action: "VERIFY", module: "Hibah Internal", detail: 'Verifikasi pembayaran hibah HIB-006', ip: "192.168.1.55", timestamp: "2026-02-24 10:20:15" },
  { id: "LOG-005", user: "Admin Sistem", action: "DELETE", module: "User Management", detail: 'Menghapus user "User Lama"', ip: "192.168.1.100", timestamp: "2026-02-23 09:00:44" },
  { id: "LOG-006", user: "Dr. Rina Wulandari", action: "SUBMIT", module: "Publikasi", detail: 'Submit publikasi "Smart Campus IoT Framework"', ip: "192.168.1.32", timestamp: "2026-02-22 13:22:18" },
  { id: "LOG-007", user: "Admin Sistem", action: "LOGIN", module: "Auth", detail: "Login berhasil", ip: "192.168.1.100", timestamp: "2026-02-22 08:00:01" },
  { id: "LOG-008", user: "Dr. Lestari Handayani", action: "REVIEW", module: "Hibah Internal", detail: 'Memberikan review pada hibah HIB-003', ip: "192.168.1.67", timestamp: "2026-02-21 15:10:33" },
];

const ACTION_COLORS: Record<string, string> = {
  CREATE: "bg-green-100 text-green-700",
  UPDATE: "bg-blue-100 text-blue-700",
  DELETE: "bg-red-100 text-red-700",
  APPROVE: "bg-emerald-100 text-emerald-700",
  VERIFY: "bg-cyan-100 text-cyan-700",
  SUBMIT: "bg-indigo-100 text-indigo-700",
  REVIEW: "bg-amber-100 text-amber-700",
  LOGIN: "bg-gray-100 text-gray-700",
};

export function AuditLogPage() {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 6;

  useEffect(() => { const t = setTimeout(() => setLoading(false), 500); return () => clearTimeout(t); }, []);

  const filtered = MOCK_LOGS.filter((l) => {
    const matchSearch = l.user.toLowerCase().includes(searchQuery.toLowerCase()) || l.detail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchAction = actionFilter === "all" || l.action === actionFilter;
    return matchSearch && matchAction;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  return (
    <PageWrapper title="Audit Log" subtitle="Riwayat aktivitas seluruh sistem" breadcrumbs={[{ label: "Sistem" }, { label: "Audit Log" }]}>
      {loading ? <SkeletonTable rows={6} /> : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} placeholder="Cari user atau detail..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613]/40 placeholder:text-slate-400" />
            </div>
            <select value={actionFilter} onChange={(e) => { setActionFilter(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-600">
              <option value="all">Semua Action</option>
              {["CREATE", "UPDATE", "DELETE", "APPROVE", "VERIFY", "SUBMIT", "REVIEW", "LOGIN"].map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  {["Waktu", "User", "Action", "Module", "Detail", "IP"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs text-slate-500" style={{ fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {paginated.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50/50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 whitespace-nowrap">
                        <Clock className="w-3 h-3" />{l.timestamp}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-slate-700 whitespace-nowrap" style={{ fontWeight: 500 }}>{l.user}</td>
                    <td className="px-5 py-3">
                      <span className={`text-[11px] px-2 py-0.5 rounded ${ACTION_COLORS[l.action] || "bg-gray-100 text-gray-700"}`} style={{ fontWeight: 600 }}>{l.action}</span>
                    </td>
                    <td className="px-5 py-3 text-sm text-slate-600 whitespace-nowrap">{l.module}</td>
                    <td className="px-5 py-3 text-sm text-slate-500 max-w-[250px] truncate">{l.detail}</td>
                    <td className="px-5 py-3 text-xs text-slate-400 whitespace-nowrap">{l.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs text-slate-500">Menampilkan {(currentPage - 1) * perPage + 1}-{Math.min(currentPage * perPage, filtered.length)} dari {filtered.length}</p>
            <div className="flex items-center gap-1">
              <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-1.5 text-slate-400 disabled:opacity-30 rounded-md"><ChevronLeft className="w-4 h-4" /></button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-8 h-8 text-xs rounded-md ${currentPage === i + 1 ? "bg-[#E30613] text-white" : "text-slate-600 hover:bg-slate-100"}`} style={{ fontWeight: 500 }}>{i + 1}</button>
              ))}
              <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-1.5 text-slate-400 disabled:opacity-30 rounded-md"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
