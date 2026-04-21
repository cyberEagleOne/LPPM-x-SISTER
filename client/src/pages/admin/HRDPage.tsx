import { useState, useEffect } from "react";
import { Lock, Unlock, Download, Filter, Search, AlertTriangle, DollarSign, Users, BarChart3, FileText, TrendingUp, Award, Calendar } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useAuth } from "../../context/AuthContext";
import { roleMatchesAny } from "../../config/roleTemplates";
import { PageWrapper } from "../../components/admin/PageWrapper";
import { SkeletonCard, SkeletonTable } from "../../components/admin/SkeletonLoader";
import { ConfirmModal } from "../../components/admin/ConfirmModal";

interface LecturerPerformance {
  id: string;
  name: string;
  nidn: string;
  fakultas: string;
  publications: number;
  grants: number;
  verifiedPubs: number;
  hIndex: number;
  incentiveAmount: number;
  status: "verified" | "pending" | "flagged";
}

const MOCK_LECTURERS: LecturerPerformance[] = [
  { id: "1", name: "Dr. Arif Ramadhan, M.Sc.", nidn: "0312098901", fakultas: "F. Teknologi", publications: 8, grants: 3, verifiedPubs: 7, hIndex: 5, incentiveAmount: 15000000, status: "verified" },
  { id: "2", name: "Dr. Rina Wulandari", nidn: "0405098802", fakultas: "F. Teknologi", publications: 6, grants: 2, verifiedPubs: 6, hIndex: 4, incentiveAmount: 12000000, status: "verified" },
  { id: "3", name: "Prof. Dimas Prakoso", nidn: "0120067801", fakultas: "F. Bisnis", publications: 12, grants: 4, verifiedPubs: 11, hIndex: 8, incentiveAmount: 25000000, status: "verified" },
  { id: "4", name: "Dr. Lestari Handayani", nidn: "0723088504", fakultas: "F. Teknologi", publications: 5, grants: 1, verifiedPubs: 4, hIndex: 3, incentiveAmount: 8000000, status: "pending" },
  { id: "5", name: "Dr. Fajar Nugroho", nidn: "0618078903", fakultas: "F. Desain", publications: 4, grants: 2, verifiedPubs: 3, hIndex: 2, incentiveAmount: 7000000, status: "pending" },
  { id: "6", name: "Dr. Faisal Rahman", nidn: "0815097705", fakultas: "F. Teknologi", publications: 7, grants: 3, verifiedPubs: 7, hIndex: 6, incentiveAmount: 18000000, status: "verified" },
  { id: "7", name: "Dr. Dewi Lestari", nidn: "0902068806", fakultas: "F. Bisnis", publications: 3, grants: 1, verifiedPubs: 2, hIndex: 2, incentiveAmount: 5000000, status: "flagged" },
  { id: "8", name: "Dr. Lia Megawati", nidn: "1105079007", fakultas: "F. Desain", publications: 4, grants: 1, verifiedPubs: 4, hIndex: 3, incentiveAmount: 9000000, status: "verified" },
];

const PERFORMANCE_CHART = [
  { fakultas: "F. Teknologi", pubs: 26, grants: 9 },
  { fakultas: "F. Bisnis", pubs: 15, grants: 5 },
  { fakultas: "F. Desain", pubs: 8, grants: 3 },
];

const PIE_DATA = [
  { name: "Verified", value: 5, color: "#22c55e" },
  { name: "Pending", value: 2, color: "#f59e0b" },
  { name: "Flagged", value: 1, color: "#ef4444" },
];

export function HRDPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isFrozen, setIsFrozen] = useState(false);
  const [yearFilter, setYearFilter] = useState("2026");
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; title: string; message: string; variant: "danger" | "warning" | "success"; onConfirm: () => void }>({
    isOpen: false, title: "", message: "", variant: "warning", onConfirm: () => {}
  });

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  const formatCurrency = (val: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val);

  const filtered = MOCK_LECTURERS.filter(l =>
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.nidn.includes(searchQuery)
  );

  const totalIncentive = MOCK_LECTURERS.reduce((s, l) => s + l.incentiveAmount, 0);
  const totalPubs = MOCK_LECTURERS.reduce((s, l) => s + l.publications, 0);
  const totalVerifiedPubs = MOCK_LECTURERS.reduce((s, l) => s + l.verifiedPubs, 0);

  const isHRD = roleMatchesAny(user?.role, ["hrd", "administrator"]);

  return (
    <PageWrapper
      title="HRD Dashboard"
      subtitle="Manajemen data kinerja dosen & kalkulasi insentif"
      breadcrumbs={[{ label: "HRD" }, { label: "Dashboard" }]}
      actions={
        <div className="flex items-center gap-2">
          {isHRD && (
            <button
              onClick={() => setConfirmModal({
                isOpen: true,
                title: isFrozen ? "Buka Freeze?" : "Aktifkan Data Freeze?",
                message: isFrozen
                  ? "Data akan kembali bisa diedit oleh dosen."
                  : "Selama freeze, dosen tidak bisa mengedit data track record. Ini diperlukan untuk kalkulasi bonus.",
                variant: isFrozen ? "success" : "warning",
                onConfirm: () => setIsFrozen(!isFrozen),
              })}
              className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-colors ${
                isFrozen ? "bg-red-600 text-white hover:bg-red-700" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
              style={{ fontWeight: 500 }}
            >
              {isFrozen ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
              {isFrozen ? "Freeze Active" : "Activate Freeze"}
            </button>
          )}
          <button className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-[#E30613] rounded-lg hover:bg-[#c00510] transition-colors"
            style={{ fontWeight: 500 }}>
            <Download className="w-4 h-4" /> Export Data
          </button>
        </div>
      }
    >
      {/* Freeze Banner */}
      {isFrozen && (
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-4 flex items-center gap-4 text-white shadow-lg">
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm" style={{ fontWeight: 600 }}>Data Freeze Period Active</p>
            <p className="text-xs text-white/80 mt-0.5">HRD sedang memproses kalkulasi bonus. Dosen tidak dapat mengedit data track record selama periode ini.</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/15 rounded-lg text-xs" style={{ fontWeight: 500 }}>
            <Calendar className="w-3.5 h-3.5" /> Sejak: 1 Mar 2026
          </div>
        </div>
      )}

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Dosen", value: MOCK_LECTURERS.length, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Total Publikasi", value: totalPubs, icon: FileText, color: "text-emerald-600", bg: "bg-emerald-50", sub: `${totalVerifiedPubs} verified` },
            { label: "Total Insentif", value: formatCurrency(totalIncentive), icon: DollarSign, color: "text-amber-600", bg: "bg-amber-50" },
            { label: "Rata-rata H-Index", value: (MOCK_LECTURERS.reduce((s, l) => s + l.hIndex, 0) / MOCK_LECTURERS.length).toFixed(1), icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-slate-500" style={{ fontWeight: 500 }}>{stat.label}</span>
                <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-[18px] h-[18px] ${stat.color}`} />
                </div>
              </div>
              <span className="text-2xl text-slate-900" style={{ fontWeight: 700 }}>{stat.value}</span>
              {stat.sub && <p className="text-xs text-slate-400 mt-0.5">{stat.sub}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Charts Row */}
      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm text-slate-800 mb-4" style={{ fontWeight: 600 }}>Kinerja per Fakultas</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={PERFORMANCE_CHART} barGap={4}>
                <XAxis dataKey="fakultas" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={30} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
                <Bar dataKey="pubs" name="Publikasi" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                <Bar dataKey="grants" name="Hibah" fill="#10b981" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm text-slate-800 mb-3" style={{ fontWeight: 600 }}>Status Verifikasi</h3>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                  {PIE_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center">
              {PIE_DATA.map(d => (
                <div key={d.name} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-[10px] text-slate-500">{d.name} ({d.value})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Incentive Calculation Table */}
      {!loading && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#E30613]" />
              <h3 className="text-sm text-slate-800" style={{ fontWeight: 600 }}>Ringkasan Insentif Dosen</h3>
            </div>
            <div className="flex-1" />
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Cari dosen..."
                  className="pl-8 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg w-48 focus:outline-none focus:ring-2 focus:ring-[#E30613]/20 placeholder:text-slate-400" />
              </div>
              <select value={yearFilter} onChange={e => setYearFilter(e.target.value)}
                className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-600">
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  {["Nama Dosen", "NIDN", "Fakultas", "Publikasi", "Verified", "H-Index", "Hibah", "Insentif", "Status"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs text-slate-500 whitespace-nowrap" style={{ fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(lecturer => (
                  <tr key={lecturer.id} className={`hover:bg-slate-50/50 transition-colors ${lecturer.status === "flagged" ? "bg-red-50/30" : ""}`}>
                    <td className="px-4 py-3 text-sm text-slate-800 whitespace-nowrap" style={{ fontWeight: 500 }}>{lecturer.name}</td>
                    <td className="px-4 py-3 text-sm text-slate-500 whitespace-nowrap">{lecturer.nidn}</td>
                    <td className="px-4 py-3 text-sm text-slate-500 whitespace-nowrap">{lecturer.fakultas}</td>
                    <td className="px-4 py-3 text-sm text-slate-700 text-center">{lecturer.publications}</td>
                    <td className="px-4 py-3 text-sm text-green-600 text-center" style={{ fontWeight: 500 }}>{lecturer.verifiedPubs}</td>
                    <td className="px-4 py-3 text-sm text-slate-700 text-center">{lecturer.hIndex}</td>
                    <td className="px-4 py-3 text-sm text-slate-700 text-center">{lecturer.grants}</td>
                    <td className="px-4 py-3 text-sm text-slate-800 whitespace-nowrap" style={{ fontWeight: 600 }}>{formatCurrency(lecturer.incentiveAmount)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
                        lecturer.status === "verified" ? "bg-green-50 text-green-700" :
                        lecturer.status === "pending" ? "bg-amber-50 text-amber-700" :
                        "bg-red-50 text-red-700"
                      }`} style={{ fontWeight: 500 }}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          lecturer.status === "verified" ? "bg-green-500" :
                          lecturer.status === "pending" ? "bg-amber-500" :
                          "bg-red-500"
                        }`} />
                        {lecturer.status === "verified" ? "Verified" : lecturer.status === "pending" ? "Pending" : "Flagged"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-200 bg-slate-50/50">
                  <td colSpan={7} className="px-4 py-3 text-sm text-slate-800" style={{ fontWeight: 600 }}>Total Insentif</td>
                  <td className="px-4 py-3 text-sm text-[#E30613]" style={{ fontWeight: 700 }}>{formatCurrency(totalIncentive)}</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(p => ({ ...p, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        variant={confirmModal.variant}
      />
    </PageWrapper>
  );
}
