import { useState } from "react";
import { Gift, Plus, Search, Filter, CheckCircle, XCircle, Clock, ChevronLeft, ChevronRight, Eye, Send, RotateCcw, Download, FileText, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { roleMatchesAny } from "../config/roleTemplates";
import { PageWrapper } from "../components/PageWrapper";
import { StatusBadge, type StatusType } from "../components/StatusBadge";
import { EmptyState } from "../components/EmptyState";
import { ConfirmModal } from "../components/ConfirmModal";
import { useSearchParams } from "react-router";

type InsentifView = "list" | "form" | "detail";
type InsentifTab = "ajukan" | "saya" | "prodi" | "submitted" | "alokasi" | "finalisasi";

interface InsentifItem {
  id: string;
  judul: string;
  pengusul: string;
  jenisPub: string;
  nama_jurnal: string;
  tahun: number;
  sinta: string;
  nilai: number;
  status: StatusType;
  tanggal: string;
  prodi: string;
  catatan?: string;
}

const MOCK_INSENTIF: InsentifItem[] = [
  { id: "INS-001", judul: "Deep Learning for Batik Pattern Recognition", pengusul: "Dr. Arif Ramadhan", jenisPub: "Artikel Jurnal", nama_jurnal: "IEEE Access", tahun: 2025, sinta: "Scopus Q1", nilai: 12000000, status: "pending-review", tanggal: "2026-01-15", prodi: "Teknik Informatika" },
  { id: "INS-002", judul: "Analisis Big Data untuk Kesehatan Masyarakat", pengusul: "Dr. Rina Wulandari", jenisPub: "Artikel Jurnal", nama_jurnal: "Jurnal Kesehatan Indonesia", tahun: 2025, sinta: "Sinta 2", nilai: 3500000, status: "approved", tanggal: "2026-01-10", prodi: "Manajemen Kesehatan" },
  { id: "INS-003", judul: "Green Architecture dalam Pembangunan Perkotaan", pengusul: "Prof. Ahmad Surya", jenisPub: "Buku", nama_jurnal: "Penerbit UGM Press", tahun: 2025, sinta: "Buku Referensi", nilai: 5000000, status: "draft", tanggal: "2026-01-05", prodi: "Arsitektur" },
  { id: "INS-004", judul: "Machine Learning untuk Deteksi Fraud Perbankan", pengusul: "Dr. Dewi Kartika", jenisPub: "Prosiding", nama_jurnal: "IEEE ICAC 2025", tahun: 2025, sinta: "Scopus", nilai: 4000000, status: "submitted", tanggal: "2025-12-20", prodi: "Teknik Informatika" },
  { id: "INS-005", judul: "Fintech dan Inklusi Keuangan UMKM", pengusul: "Dr. Fajar Nugroho", jenisPub: "Artikel Jurnal", nama_jurnal: "Jurnal Keuangan dan Perbankan", tahun: 2025, sinta: "Sinta 3", nilai: 2000000, status: "revisi", tanggal: "2025-12-15", prodi: "Manajemen" },
  { id: "INS-006", judul: "Optimasi Algoritma Genetika untuk Penjadwalan", pengusul: "Dr. Faisal Rahman", jenisPub: "Artikel Jurnal", nama_jurnal: "Journal of Soft Computing", tahun: 2025, sinta: "Scopus Q2", nilai: 7000000, status: "verified", tanggal: "2025-11-10", prodi: "Teknik Informatika" },
];

const SINTA_OPTIONS = ["Scopus Q1", "Scopus Q2", "Scopus Q3", "Scopus Q4", "Sinta 1", "Sinta 2", "Sinta 3", "Sinta 4", "Sinta 5", "Sinta 6", "WoS", "Buku Referensi", "Prosiding Scopus"];

const NILAI_MAP: Record<string, number> = {
  "Scopus Q1": 12000000, "Scopus Q2": 8000000, "Scopus Q3": 5000000, "Scopus Q4": 3000000,
  "WoS": 10000000, "Sinta 1": 4000000, "Sinta 2": 3500000, "Sinta 3": 2000000,
  "Sinta 4": 1500000, "Sinta 5": 1000000, "Sinta 6": 500000,
  "Buku Referensi": 5000000, "Prosiding Scopus": 4000000,
};

function formatRp(val: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val);
}

export function InsentifPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [view, setView] = useState<InsentifView>("list");
  const [selected, setSelected] = useState<InsentifItem | null>(null);
  const [data, setData] = useState(MOCK_INSENTIF);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [confirmModal, setConfirmModal] = useState<{ open: boolean; title: string; message: string; variant: "danger" | "warning" | "success"; onConfirm: () => void }>({ open: false, title: "", message: "", variant: "warning", onConfirm: () => {} });
  const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "error" }>({ show: false, message: "", type: "success" });

  const [formData, setFormData] = useState({ judul: "", jenisPub: "Artikel Jurnal", nama_jurnal: "", tahun: 2025, sinta: "" });

  const perPage = 6;

  // Determine active tab from URL param
  const tab = (searchParams.get("tab") || "submitted") as InsentifTab;

  const isDosen = roleMatchesAny(user?.role, ["dosen", "internal"]);
  const isAdmin = roleMatchesAny(user?.role, ["administrator", "lppm", "ketua-lppm"]);
  const isHRD = roleMatchesAny(user?.role, ["hrd", "administrator", "lppm", "ketua-lppm", "finance"]);
  const isKaprodi = roleMatchesAny(user?.role, ["kaprodi", "administrator", "lppm"]);
  const isKordPub = roleMatchesAny(user?.role, ["kordinator-publikasi", "administrator", "lppm", "ketua-lppm"]);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(p => ({ ...p, show: false })), 3000);
  };

  const handleStatusChange = (id: string, newStatus: StatusType) => {
    setData(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
    showToast(`Status berhasil diubah ke ${newStatus}`);
    setView("list");
  };

  const filteredData = data.filter(item => {
    const matchSearch = item.judul.toLowerCase().includes(search.toLowerCase()) || item.pengusul.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || item.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const paginated = filteredData.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filteredData.length / perPage);

  const getPageTitle = () => {
    if (tab === "ajukan") return "Ajukan Insentif Baru";
    if (tab === "saya") return "Insentif Saya";
    if (tab === "prodi") return "Review Insentif Prodi";
    if (tab === "finalisasi") return "Finalisasi Insentif";
    if (tab === "alokasi") return "Alokasi Insentif";
    return "Insentif Publikasi";
  };

  // FORM VIEW
  if (view === "form" || tab === "ajukan") {
    const estimasiNilai = NILAI_MAP[formData.sinta] || 0;
    return (
      <PageWrapper
        title="Ajukan Insentif Publikasi"
        breadcrumbs={[{ label: "Insentif Publikasi" }, { label: "Ajukan Baru" }]}
        actions={<button onClick={() => setView("list")} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"><ChevronLeft className="w-4 h-4" /> Batal</button>}
      >
        <div className="max-w-2xl">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p className="font-semibold mb-1">Panduan Pengajuan Insentif</p>
              <p>Insentif publikasi diberikan untuk karya ilmiah yang telah dipublikasikan dan terindeks di basis data bereputasi. Pastikan memiliki bukti penerimaan/publikasi yang valid.</p>
            </div>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const newItem: InsentifItem = {
                id: `INS-${String(data.length + 1).padStart(3, "0")}`,
                judul: formData.judul,
                pengusul: user?.name || "",
                jenisPub: formData.jenisPub,
                nama_jurnal: formData.nama_jurnal,
                tahun: formData.tahun,
                sinta: formData.sinta,
                nilai: estimasiNilai,
                status: "draft",
                tanggal: new Date().toISOString().split("T")[0],
                prodi: user?.prodi || "",
              };
              setData(prev => [newItem, ...prev]);
              showToast("Insentif berhasil disimpan sebagai draft");
              setView("list");
            }}
            className="bg-white rounded-xl border border-slate-200 p-6 space-y-5"
          >
            <div>
              <label className="block text-sm text-slate-700 font-medium mb-1.5">Judul Publikasi <span className="text-red-500">*</span></label>
              <input type="text" value={formData.judul} required onChange={e => setFormData(p => ({ ...p, judul: e.target.value }))}
                placeholder="Masukkan judul artikel/buku/prosiding"
                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E30613]/20 bg-slate-50/50" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-700 font-medium mb-1.5">Jenis Publikasi</label>
                <select value={formData.jenisPub} onChange={e => setFormData(p => ({ ...p, jenisPub: e.target.value }))}
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50/50">
                  <option>Artikel Jurnal</option>
                  <option>Prosiding</option>
                  <option>Buku</option>
                  <option>Hak Cipta</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-700 font-medium mb-1.5">Tahun Terbit</label>
                <input type="number" value={formData.tahun} onChange={e => setFormData(p => ({ ...p, tahun: Number(e.target.value) }))}
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50/50" />
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-700 font-medium mb-1.5">Nama Jurnal / Prosiding / Penerbit <span className="text-red-500">*</span></label>
              <input type="text" value={formData.nama_jurnal} required onChange={e => setFormData(p => ({ ...p, nama_jurnal: e.target.value }))}
                placeholder="Contoh: IEEE Access, Penerbit UGM Press"
                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50/50" />
            </div>
            <div>
              <label className="block text-sm text-slate-700 font-medium mb-1.5">Indeksasi / Level <span className="text-red-500">*</span></label>
              <select value={formData.sinta} required onChange={e => setFormData(p => ({ ...p, sinta: e.target.value }))}
                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50/50">
                <option value="">Pilih level indeksasi</option>
                {SINTA_OPTIONS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            {/* Estimasi nilai */}
            {estimasiNilai > 0 && (
              <div className="p-4 bg-green-50 rounded-xl border border-green-200 flex items-center gap-3">
                <Gift className="w-5 h-5 text-green-600 shrink-0" />
                <div>
                  <p className="text-xs text-green-600 font-medium">Estimasi Insentif</p>
                  <p className="text-xl font-bold text-green-700">{formatRp(estimasiNilai)}</p>
                </div>
              </div>
            )}
            <div className="pt-2 flex gap-3 border-t border-slate-100">
              <button type="submit" className="px-6 py-2.5 text-sm text-white bg-[#E30613] rounded-lg hover:bg-[#c00510] font-medium">Simpan sebagai Draft</button>
              <button type="button" onClick={() => setView("list")} className="px-6 py-2.5 text-sm text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 font-medium">Batal</button>
            </div>
          </form>
        </div>
      </PageWrapper>
    );
  }

  // DETAIL VIEW
  if (view === "detail" && selected) {
    return (
      <PageWrapper
        title="Detail Insentif Publikasi"
        breadcrumbs={[{ label: "Insentif" }, { label: selected.id }]}
        actions={<button onClick={() => setView("list")} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"><ChevronLeft className="w-4 h-4" /> Kembali</button>}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-xs text-slate-400 font-medium">{selected.id}</span>
                  <h3 className="text-lg font-semibold text-slate-900 mt-1">{selected.judul}</h3>
                </div>
                <StatusBadge status={selected.status} size="md" />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {[
                  { label: "Pengusul", value: selected.pengusul },
                  { label: "Jenis Publikasi", value: selected.jenisPub },
                  { label: "Nama Jurnal", value: selected.nama_jurnal },
                  { label: "Tahun", value: String(selected.tahun) },
                  { label: "Indeksasi", value: selected.sinta },
                  { label: "Program Studi", value: selected.prodi },
                  { label: "Estimasi Nilai", value: formatRp(selected.nilai) },
                  { label: "Tanggal Ajuan", value: selected.tanggal },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-xs text-slate-400 font-medium mb-1">{label}</p>
                    <p className="text-sm text-slate-800 font-medium">{value}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* Dokumen Pendukung */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h4 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2"><FileText className="w-4 h-4" /> Dokumen Pendukung</h4>
              <div className="space-y-2">
                {[
                  { name: "Naskah Publikasi / Artikel", uploaded: true },
                  { name: "Letter of Acceptance (LoA)", uploaded: selected.status !== "draft" },
                  { name: "Bukti Indeksasi (tangkapan layar)", uploaded: selected.status !== "draft" },
                  { name: "Surat Pernyataan Keaslian", uploaded: ["approved","verified"].includes(selected.status) },
                ].map(doc => (
                  <div key={doc.name} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border ${doc.uploaded ? "border-green-100 bg-green-50/30" : "border-slate-200 bg-slate-50"}`}>
                    <CheckCircle className={`w-4 h-4 ${doc.uploaded ? "text-green-500" : "text-slate-300"}`} />
                    <span className={`text-sm ${doc.uploaded ? "text-slate-700" : "text-slate-400"} font-medium`}>{doc.name}</span>
                    {!doc.uploaded && <button className="ml-auto text-xs text-[#E30613] font-medium hover:underline">Upload</button>}
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Actions */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h4 className="text-sm font-semibold text-slate-800 mb-3">Aksi</h4>
              <div className="space-y-2">
                {selected.status === "draft" && isDosen && (
                  <button onClick={() => handleStatusChange(selected.id, "submitted")}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 font-medium">
                    <Send className="w-4 h-4" /> Submit Pengajuan
                  </button>
                )}
                {selected.status === "revisi" && isDosen && (
                  <button onClick={() => handleStatusChange(selected.id, "submitted")}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 font-medium">
                    <RotateCcw className="w-4 h-4" /> Submit Ulang
                  </button>
                )}
                {(selected.status === "submitted" || selected.status === "pending-review") && (isAdmin || isKaprodi) && (
                  <>
                    <button onClick={() => handleStatusChange(selected.id, "approved")}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700 font-medium">
                      <CheckCircle className="w-4 h-4" /> Setujui
                    </button>
                    <button onClick={() => handleStatusChange(selected.id, "revisi")}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 font-medium">
                      <RotateCcw className="w-4 h-4" /> Minta Revisi
                    </button>
                    <button onClick={() => setConfirmModal({ open: true, title: "Tolak?", message: "Pengajuan akan ditolak.", variant: "danger", onConfirm: () => handleStatusChange(selected.id, "rejected") })}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 font-medium">
                      <XCircle className="w-4 h-4" /> Tolak
                    </button>
                  </>
                )}
                {selected.status === "approved" && isHRD && (
                  <button onClick={() => handleStatusChange(selected.id, "verified")}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 font-medium">
                    <CheckCircle className="w-4 h-4" /> Verifikasi & Alokasi
                  </button>
                )}
                {selected.status === "verified" && isHRD && (
                  <button onClick={() => handleStatusChange(selected.id, "lunas")}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700 font-medium">
                    <CheckCircle className="w-4 h-4" /> Tandai Lunas
                  </button>
                )}
                <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 font-medium">
                  <Download className="w-4 h-4" /> Download Rekap
                </button>
              </div>
            </div>
            {/* Ringkasan Nilai */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h4 className="text-sm font-semibold text-slate-800 mb-3">Nilai Insentif</h4>
              <div className="text-center py-4">
                <div className="text-3xl font-bold text-[#E30613]">{formatRp(selected.nilai)}</div>
                <div className="text-xs text-slate-400 mt-1">Estimasi berdasarkan {selected.sinta}</div>
              </div>
            </div>
          </div>
        </div>
        <ConfirmModal {...confirmModal} onClose={() => setConfirmModal(p => ({ ...p, open: false }))} />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title={getPageTitle()}
      subtitle="Kelola pengajuan insentif publikasi civitas akademika"
      breadcrumbs={[{ label: "Insentif Publikasi" }]}
      actions={
        <div className="flex items-center gap-2">
          {isDosen && (
            <button onClick={() => setView("form")} className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-[#E30613] rounded-lg hover:bg-[#c00510] font-medium">
              <Plus className="w-4 h-4" /> Ajukan Insentif
            </button>
          )}
          {isHRD && (
            <button className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 font-medium">
              <Download className="w-4 h-4" /> Export Excel
            </button>
          )}
        </div>
      }
    >
      {/* Summary cards (admin only) */}
      {isAdmin && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Menunggu Review", count: data.filter(d => d.status === "pending-review" || d.status === "submitted").length, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
            { label: "Disetujui", count: data.filter(d => d.status === "approved").length, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
            { label: "Terverifikasi", count: data.filter(d => d.status === "verified").length, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Total Nilai (Est.)", count: data.filter(d => d.status !== "rejected").reduce((a, b) => a + b.nilai, 0), icon: Gift, color: "text-[#E30613]", bg: "bg-red-50", isCurrency: true },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-500 font-medium">{s.label}</span>
                <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center`}><s.icon className={`w-4 h-4 ${s.color}`} /></div>
              </div>
              <div className={`text-xl font-bold ${(s as any).isCurrency ? "text-sm" : ""}`}>
                {(s as any).isCurrency ? formatRp(s.count) : s.count}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {/* Toolbar */}
        <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Cari judul, pengusul..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E30613]/20 placeholder:text-slate-400" />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-600 focus:outline-none">
              <option value="all">Semua Status</option>
              <option value="draft">Draft</option>
              <option value="submitted">Submitted</option>
              <option value="pending-review">Pending Review</option>
              <option value="revisi">Revisi</option>
              <option value="approved">Approved</option>
              <option value="rejected">Ditolak</option>
              <option value="verified">Verified</option>
              <option value="lunas">Lunas</option>
            </select>
          </div>
        </div>

        {paginated.length === 0 ? (
          <EmptyState variant="no-data" actionLabel={isDosen ? "Ajukan Insentif" : undefined} onAction={isDosen ? () => setView("form") : undefined} />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    {["ID", "Judul", "Pengusul", "Jurnal/Prosiding", "Indeksasi", "Nilai Est.", "Status", "Aksi"].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-xs text-slate-500 font-semibold whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {paginated.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3.5 text-sm text-slate-400 font-medium whitespace-nowrap">{item.id}</td>
                      <td className="px-5 py-3.5">
                        <button onClick={() => { setSelected(item); setView("detail"); }} className="text-sm text-slate-800 hover:text-[#E30613] font-medium text-left max-w-[220px] truncate block">
                          {item.judul}
                        </button>
                        <p className="text-xs text-slate-400">{item.jenisPub} · {item.tahun}</p>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-slate-600 whitespace-nowrap">{item.pengusul}</td>
                      <td className="px-5 py-3.5 text-sm text-slate-600 max-w-[180px] truncate">{item.nama_jurnal}</td>
                      <td className="px-5 py-3.5 text-sm text-slate-600 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: 'rgba(227,6,19,0.08)', color: '#E30613' }}>{item.sinta}</span>
                      </td>
                      <td className="px-5 py-3.5 text-sm font-semibold text-slate-700 whitespace-nowrap">{formatRp(item.nilai)}</td>
                      <td className="px-5 py-3.5"><StatusBadge status={item.status} /></td>
                      <td className="px-5 py-3.5">
                        <button onClick={() => { setSelected(item); setView("detail"); }} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md" title="Detail">
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
              <p className="text-xs text-slate-500">Menampilkan {(page - 1) * perPage + 1}–{Math.min(page * perPage, filteredData.length)} dari {filteredData.length}</p>
              <div className="flex items-center gap-1">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded-md"><ChevronLeft className="w-4 h-4" /></button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button key={i} onClick={() => setPage(i + 1)} className={`w-8 h-8 text-xs rounded-md ${page === i + 1 ? "bg-[#E30613] text-white" : "text-slate-600 hover:bg-slate-100"} font-medium`}>{i + 1}</button>
                ))}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded-md"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
          </>
        )}
      </div>

      {toast.show && (
        <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg border ${toast.type === "success" ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"}`}>
          {toast.type === "success" ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}
      <ConfirmModal {...confirmModal} onClose={() => setConfirmModal(p => ({ ...p, open: false }))} />
    </PageWrapper>
  );
}
