import { useState } from "react";
import { Download, BarChart3, FileBarChart, Calendar, RefreshCw, CheckCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from "recharts";
import { PageWrapper } from "../../components/admin/PageWrapper";
import { StatusBadge } from "../../components/admin/StatusBadge";
import { EmptyState } from "../../components/admin/EmptyState";

const LAPORAN_DATA = [
  { periode: "Januari 2026", hibah: 5, surat: 8, konferensi: 2, publikasi: 4 },
  { periode: "Februari 2026", hibah: 7, surat: 6, konferensi: 3, publikasi: 6 },
  { periode: "Desember 2025", hibah: 4, surat: 10, konferensi: 1, publikasi: 8 },
  { periode: "November 2025", hibah: 6, surat: 5, konferensi: 4, publikasi: 5 },
  { periode: "Oktober 2025", hibah: 3, surat: 7, konferensi: 2, publikasi: 3 },
];

const CHART_MONTHLY = [
  { month: "Sep", hibah: 3, surat: 5, konf: 1, pub: 4 },
  { month: "Okt", hibah: 5, surat: 7, konf: 2, pub: 3 },
  { month: "Nov", hibah: 4, surat: 6, konf: 4, pub: 6 },
  { month: "Des", hibah: 6, surat: 10, konf: 1, pub: 8 },
  { month: "Jan", hibah: 5, surat: 8, konf: 2, pub: 4 },
  { month: "Feb", hibah: 7, surat: 6, konf: 3, pub: 6 },
];

export function LaporanKegiatanPage() {
  const [tahun, setTahun] = useState("2026");
  return (
    <PageWrapper title="Laporan Kegiatan" subtitle="Ringkasan kegiatan penelitian dan pengabdian"
      breadcrumbs={[{ label: "Laporan" }, { label: "Laporan Kegiatan" }]}
      actions={
        <div className="flex gap-2">
          <select value={tahun} onChange={(e) => setTahun(e.target.value)} className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white">
            <option value="2026">2026</option>
            <option value="2025">2025</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-[#E30613] rounded-lg hover:bg-[#c00510] transition-all" style={{ fontWeight: 500 }}>
            <Download className="w-4 h-4" /> Export PDF
          </button>
        </div>
      }>
      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Hibah", value: 48, icon: BarChart3, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Surat Tugas", value: 32, icon: FileBarChart, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Konferensi", value: 15, icon: Calendar, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Publikasi", value: 67, icon: BarChart3, color: "text-amber-600", bg: "bg-amber-50" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-500" style={{ fontWeight: 500 }}>{s.label}</span>
              <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center`}><s.icon className={`w-4 h-4 ${s.color}`} /></div>
            </div>
            <span className="text-2xl text-slate-900" style={{ fontWeight: 700 }}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm text-slate-800 mb-4" style={{ fontWeight: 600 }}>Tren Kegiatan per Bulan</h3>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={CHART_MONTHLY}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={30} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="hibah" name="Hibah" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="surat" name="Surat Tugas" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="konf" name="Konferensi" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="pub" name="Publikasi" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm text-slate-800" style={{ fontWeight: 600 }}>Detail per Periode</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-slate-100">
              {["Periode", "Hibah", "Surat Tugas", "Konferensi", "Publikasi", "Total"].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs text-slate-500" style={{ fontWeight: 600 }}>{h}</th>
              ))}
            </tr></thead>
            <tbody className="divide-y divide-slate-50">
              {LAPORAN_DATA.map((r) => {
                const total = r.hibah + r.surat + r.konferensi + r.publikasi;
                return (
                  <tr key={r.periode} className="hover:bg-slate-50/50">
                    <td className="px-5 py-3 text-sm text-slate-700" style={{ fontWeight: 500 }}>{r.periode}</td>
                    <td className="px-5 py-3 text-sm text-slate-600">{r.hibah}</td>
                    <td className="px-5 py-3 text-sm text-slate-600">{r.surat}</td>
                    <td className="px-5 py-3 text-sm text-slate-600">{r.konferensi}</td>
                    <td className="px-5 py-3 text-sm text-slate-600">{r.publikasi}</td>
                    <td className="px-5 py-3 text-sm text-slate-800" style={{ fontWeight: 600 }}>{total}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </PageWrapper>
  );
}

const PUB_PIE = [
  { name: "Jurnal Q1", value: 8, color: "#3b82f6" },
  { name: "Jurnal Q2", value: 15, color: "#10b981" },
  { name: "Prosiding", value: 24, color: "#f59e0b" },
  { name: "HKI", value: 6, color: "#8b5cf6" },
  { name: "Buku", value: 4, color: "#ec4899" },
];

export function LaporanPublikasiPage() {
  return (
    <PageWrapper title="Laporan Publikasi" subtitle="Tracking publikasi ilmiah per periode"
      breadcrumbs={[{ label: "Laporan" }, { label: "Laporan Publikasi" }]}
      actions={
        <button className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-[#E30613] rounded-lg hover:bg-[#c00510]" style={{ fontWeight: 500 }}>
          <Download className="w-4 h-4" /> Export
        </button>
      }>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {PUB_PIE.map((s) => (
              <div key={s.name} className="bg-white rounded-xl border border-slate-200 p-5 text-center">
                <span className="text-2xl text-slate-900" style={{ fontWeight: 700 }}>{s.value}</span>
                <p className="text-xs text-slate-500 mt-1" style={{ fontWeight: 500 }}>{s.name}</p>
              </div>
            ))}
            <div className="bg-white rounded-xl border border-slate-200 p-5 text-center">
              <span className="text-2xl text-[#E30613]" style={{ fontWeight: 700 }}>{PUB_PIE.reduce((a, b) => a + b.value, 0)}</span>
              <p className="text-xs text-slate-500 mt-1" style={{ fontWeight: 500 }}>Total</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr className="border-b border-slate-100">
                  {["Judul", "Penulis", "Jenis", "Tahun", "Status"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs text-slate-500" style={{ fontWeight: 600 }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody className="divide-y divide-slate-50">
                  {[
                    { title: "AI & Education Impact Study", author: "Dr. Arif Ramadhan", jenis: "Jurnal Q1", year: "2026", status: "approved" as const },
                    { title: "Smart Campus IoT Framework", author: "Dr. Rina Wulandari", jenis: "Prosiding", year: "2026", status: "verified" as const },
                    { title: "Blockchain Digital Certificate", author: "Dr. Faisal Rahman", jenis: "Jurnal Q2", year: "2026", status: "draft" as const },
                    { title: "Green Building Assessment", author: "Dr. Dewi Lestari", jenis: "Jurnal Q2", year: "2025", status: "approved" as const },
                    { title: "Sistem Monitoring Udara IoT", author: "Dr. Fajar Nugroho", jenis: "HKI", year: "2025", status: "verified" as const },
                  ].map((r, i) => (
                    <tr key={i} className="hover:bg-slate-50/50">
                      <td className="px-5 py-3 text-sm text-slate-800 max-w-[250px] truncate" style={{ fontWeight: 500 }}>{r.title}</td>
                      <td className="px-5 py-3 text-sm text-slate-600">{r.author}</td>
                      <td className="px-5 py-3 text-sm text-slate-600">{r.jenis}</td>
                      <td className="px-5 py-3 text-sm text-slate-600">{r.year}</td>
                      <td className="px-5 py-3"><StatusBadge status={r.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Pie chart sidebar */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm text-slate-800 mb-3" style={{ fontWeight: 600 }}>Distribusi Jenis</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={PUB_PIE} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                {PUB_PIE.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-3">
            {PUB_PIE.map((d) => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-xs text-slate-600">{d.name}</span>
                </div>
                <span className="text-xs text-slate-800" style={{ fontWeight: 600 }}>{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

export function ExportDataPage() {
  const [exporting, setExporting] = useState<string | null>(null);
  const [exportHistory, setExportHistory] = useState<{ key: string; format: string; date: string; status: "done" | "failed" }[]>([
    { key: "hibah", format: "Excel", date: "2026-02-24 14:30", status: "done" },
    { key: "publikasi", format: "PDF", date: "2026-02-22 10:15", status: "done" },
    { key: "user", format: "Excel", date: "2026-02-20 09:00", status: "failed" },
  ]);

  const handleExport = (type: string, fmt: string) => {
    setExporting(`${type}-${fmt}`);
    setTimeout(() => {
      setExporting(null);
      setExportHistory((prev) => [{ key: type, format: fmt, date: new Date().toLocaleString("id-ID"), status: "done" }, ...prev]);
    }, 2000);
  };

  const exports = [
    { key: "hibah", title: "Data Hibah Internal", desc: "Export seluruh data pengajuan hibah penelitian", formats: ["Excel", "PDF", "CSV"] },
    { key: "surat", title: "Data Surat Tugas", desc: "Export data surat tugas dosen dan staff", formats: ["Excel", "PDF"] },
    { key: "konferensi", title: "Data Konferensi", desc: "Export data partisipasi konferensi", formats: ["Excel", "PDF"] },
    { key: "publikasi", title: "Data Publikasi", desc: "Export data publikasi ilmiah", formats: ["Excel", "PDF", "CSV"] },
    { key: "user", title: "Data User", desc: "Export daftar pengguna sistem", formats: ["Excel"] },
    { key: "laporan", title: "Laporan Lengkap", desc: "Laporan komprehensif semua modul", formats: ["PDF"] },
  ];

  return (
    <PageWrapper title="Export Data" subtitle="Unduh data dalam berbagai format"
      breadcrumbs={[{ label: "Laporan" }, { label: "Export Data" }]}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {exports.map((exp) => (
          <div key={exp.key} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center mb-3">
              <Download className="w-5 h-5 text-slate-600" />
            </div>
            <h4 className="text-sm text-slate-800 mb-1" style={{ fontWeight: 600 }}>{exp.title}</h4>
            <p className="text-xs text-slate-500 mb-4">{exp.desc}</p>
            <div className="flex flex-wrap gap-2">
              {exp.formats.map((fmt) => {
                const isExporting = exporting === `${exp.key}-${fmt}`;
                return (
                  <button key={fmt} onClick={() => handleExport(exp.key, fmt)} disabled={isExporting}
                    className="px-3 py-1.5 text-xs bg-slate-100 text-slate-600 rounded-md hover:bg-[#E30613] hover:text-white transition-all disabled:opacity-50 flex items-center gap-1"
                    style={{ fontWeight: 500 }}>
                    {isExporting && <RefreshCw className="w-3 h-3 animate-spin" />}
                    {isExporting ? "Mengunduh..." : fmt}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Export History */}
      <div className="bg-white rounded-xl border border-slate-200 mt-6">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm text-slate-800" style={{ fontWeight: 600 }}>Riwayat Export</h3>
        </div>
        {exportHistory.length === 0 ? (
          <EmptyState variant="no-data" title="Belum Ada Riwayat" description="Riwayat export akan muncul setelah Anda melakukan export." />
        ) : (
          <div className="divide-y divide-slate-50">
            {exportHistory.map((h, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${h.status === "done" ? "bg-green-50" : "bg-red-50"}`}>
                  {h.status === "done" ? <CheckCircle className="w-4 h-4 text-green-600" /> : <RefreshCw className="w-4 h-4 text-red-500" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-700" style={{ fontWeight: 500 }}>
                    {exports.find((e) => e.key === h.key)?.title || h.key} — {h.format}
                  </p>
                  <p className="text-xs text-slate-400">{h.date}</p>
                </div>
                <span className={`text-[11px] px-2 py-0.5 rounded-full ${h.status === "done" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`} style={{ fontWeight: 600 }}>
                  {h.status === "done" ? "Selesai" : "Gagal"}
                </span>
                {h.status === "failed" && (
                  <button onClick={() => handleExport(h.key, h.format)} className="text-xs text-[#E30613] hover:underline" style={{ fontWeight: 500 }}>
                    Retry
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
