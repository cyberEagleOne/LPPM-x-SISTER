import { useState, useEffect } from "react";
import {
  Plus, Search, Eye, Edit, Trash2, Send, CheckCircle,
  ChevronLeft, ChevronRight, RotateCcw, Download, Activity,
  AlertCircle, ExternalLink
} from "lucide-react";
import { PageWrapper } from "../../components/admin/PageWrapper";
import { StatusBadge, type StatusType } from "../../components/admin/StatusBadge";
import { EmptyState } from "../../components/admin/EmptyState";
import { ConfirmModal } from "../../components/admin/ConfirmModal";
import { SkeletonTable } from "../../components/admin/SkeletonLoader";
import { StepperStatus } from "../../components/admin/StepperStatus";

/* ────────────────── Types ────────────────── */

type JenisKegiatan = "penelitian" | "pkm";

interface PeriodeKegiatan {
  id: string;
  tahun: string;
  semester: string;
  aktif: boolean;
}

interface KegiatanItem {
  id: string;
  periodeId: string;
  jenis: JenisKegiatan;
  judulKegiatan: string;
  deskripsi: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  lokasi: string;
  urlLaporan: string;
  urlLuaran: string;
  capaian: string;
  status: StatusType;
  tanggalDibuat: string;
}

type ViewMode = "periode" | "list" | "form" | "detail";

/* ────────────────── Mock Data ────────────────── */

const MOCK_PERIODE: PeriodeKegiatan[] = [
  { id: "PK-001", tahun: "2025/2026", semester: "Genap", aktif: true },
  { id: "PK-002", tahun: "2024/2025", semester: "Ganjil", aktif: false },
  { id: "PK-003", tahun: "2024/2025", semester: "Genap", aktif: false },
];

const MOCK_KEGIATAN: KegiatanItem[] = [
  {
    id: "KGT-001", periodeId: "PK-001", jenis: "penelitian",
    judulKegiatan: "Penelitian IoT untuk Smart Campus Pradita",
    deskripsi: "Mengembangkan sistem monitoring energi berbasis IoT",
    tanggalMulai: "2026-01-15", tanggalSelesai: "2026-06-30",
    lokasi: "Universitas Pradita", urlLaporan: "https://drive.google.com/laporan", urlLuaran: "https://doi.org/luaran",
    capaian: "Jurnal Terindeks Scopus Q2", status: "submitted", tanggalDibuat: "2026-02-01",
  },
  {
    id: "KGT-002", periodeId: "PK-001", jenis: "pkm",
    judulKegiatan: "Pelatihan Digital Marketing UMKM Desa Cisauk",
    deskripsi: "Memberikan pelatihan digital marketing kepada 30 UMKM di Desa Cisauk",
    tanggalMulai: "2026-02-01", tanggalSelesai: "2026-04-30",
    lokasi: "Desa Cisauk, Tangerang", urlLaporan: "", urlLuaran: "",
    capaian: "Prosiding Nasional", status: "draft", tanggalDibuat: "2026-03-01",
  },
  {
    id: "KGT-003", periodeId: "PK-002", jenis: "penelitian",
    judulKegiatan: "Machine Learning untuk Prediksi Cuaca",
    deskripsi: "Penelitian prediksi cuaca menggunakan model LSTM",
    tanggalMulai: "2025-08-01", tanggalSelesai: "2026-01-31",
    lokasi: "Universitas Pradita", urlLaporan: "https://drive.google.com/laporan2", urlLuaran: "https://doi.org/luaran2",
    capaian: "Jurnal Sinta 2", status: "approved", tanggalDibuat: "2025-09-01",
  },
];

const generateId = () => `KGT-${String(Math.floor(Math.random() * 9000) + 1000)}`;

const JENIS_LABELS: Record<JenisKegiatan, string> = {
  penelitian: "Kegiatan Penelitian",
  pkm: "Kegiatan PKM",
};

const JENIS_COLORS: Record<JenisKegiatan, string> = {
  penelitian: "bg-blue-100 text-blue-700",
  pkm: "bg-green-100 text-green-700",
};

/* ────────────────── Main Component ────────────────── */

export function DosenKegiatanPage({ jenisParam }: { jenisParam?: JenisKegiatan }) {
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("periode");
  const [selectedPeriode, setSelectedPeriode] = useState<PeriodeKegiatan | null>(null);
  const [selectedItem, setSelectedItem] = useState<KegiatanItem | null>(null);
  const [editingItem, setEditingItem] = useState<KegiatanItem | null>(null);
  const [kegiatanList, setKegiatanList] = useState<KegiatanItem[]>(MOCK_KEGIATAN);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmModal, setConfirmModal] = useState({ open: false, title: "", message: "", variant: "danger" as "danger" | "warning" | "success", onConfirm: () => {} });
  const [toast, setToast] = useState({ show: false, message: "", type: "success" as "success" | "error" });
  const perPage = 8;

  const emptyForm = (): Omit<KegiatanItem, "id" | "tanggalDibuat" | "status"> => ({
    periodeId: selectedPeriode?.id || "",
    jenis: jenisParam || "penelitian",
    judulKegiatan: "", deskripsi: "",
    tanggalMulai: "", tanggalSelesai: "",
    lokasi: "", urlLaporan: "", urlLuaran: "", capaian: "",
  });

  const [formData, setFormData] = useState(emptyForm());
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => { const t = setTimeout(() => setLoading(false), 400); return () => clearTimeout(t); }, []);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast((p) => ({ ...p, show: false })), 3000);
  };

  const inputClass = (hasError?: boolean) =>
    `w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all bg-slate-50/50 placeholder:text-slate-400 ${
      hasError ? "border-red-300 focus:ring-red-200" : "border-slate-200 focus:ring-[#E30613]/20"
    }`;

  const FormField = ({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) => (
    <div>
      <label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 500 }}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="flex items-center gap-1 text-xs text-red-500 mt-1"><AlertCircle className="w-3 h-3" /> {error}</p>}
    </div>
  );

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.judulKegiatan.trim()) errors.judulKegiatan = "Judul wajib diisi";
    if (!formData.tanggalMulai) errors.tanggalMulai = "Tanggal mulai wajib diisi";
    if (!formData.lokasi.trim()) errors.lokasi = "Lokasi wajib diisi";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = (asSubmit: boolean) => {
    if (!validateForm()) { showToast("Lengkapi field yang wajib diisi", "error"); return; }
    if (editingItem) {
      setKegiatanList((prev) => prev.map((k) => k.id === editingItem.id ? { ...k, ...formData, status: asSubmit ? "submitted" : k.status } : k));
      showToast(asSubmit ? "Berhasil disubmit" : "Draft disimpan");
    } else {
      const newItem: KegiatanItem = { ...formData, id: generateId(), status: asSubmit ? "submitted" : "draft", tanggalDibuat: new Date().toISOString().split("T")[0] };
      setKegiatanList((prev) => [newItem, ...prev]);
      showToast(asSubmit ? "Kegiatan berhasil disubmit" : "Draft disimpan");
    }
    setEditingItem(null);
    setViewMode("list");
  };

  const handleDelete = (id: string) => {
    setKegiatanList((prev) => prev.filter((k) => k.id !== id));
    showToast("Kegiatan dihapus");
  };

  const periodeFiltered = kegiatanList.filter((k) =>
    k.periodeId === selectedPeriode?.id && (jenisParam ? k.jenis === jenisParam : true)
  );
  const filtered = periodeFiltered.filter((k) => k.judulKegiatan.toLowerCase().includes(searchQuery.toLowerCase()));
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  /* ═══════════ VIEW: DETAIL ═══════════ */
  if (viewMode === "detail" && selectedItem) {
    return (
      <PageWrapper title="Detail Laporan Kegiatan"
        breadcrumbs={[{ label: "Dosen" }, { label: "Kegiatan", path: "/admin/kegiatan" }, { label: selectedItem.id }]}
        actions={<button onClick={() => setViewMode("list")} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"><ChevronLeft className="w-4 h-4" /> Kembali</button>}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <StepperStatus module="surat-tugas" currentStatus={selectedItem.status} />
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full ${JENIS_COLORS[selectedItem.jenis]}`} style={{ fontWeight: 600 }}>{JENIS_LABELS[selectedItem.jenis]}</span>
                  <h3 className="text-base text-slate-900 mt-2" style={{ fontWeight: 600 }}>{selectedItem.judulKegiatan}</h3>
                </div>
                <StatusBadge status={selectedItem.status} size="md" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Tanggal Mulai", value: selectedItem.tanggalMulai },
                  { label: "Tanggal Selesai", value: selectedItem.tanggalSelesai },
                  { label: "Lokasi", value: selectedItem.lokasi },
                  { label: "Capaian/Luaran", value: selectedItem.capaian },
                ].map((f) => <div key={f.label}><p className="text-xs text-slate-400 mb-0.5">{f.label}</p><p className="text-sm text-slate-800" style={{ fontWeight: 500 }}>{f.value || "-"}</p></div>)}
                {selectedItem.deskripsi && <div className="col-span-2"><p className="text-xs text-slate-400 mb-0.5">Deskripsi</p><p className="text-sm text-slate-700">{selectedItem.deskripsi}</p></div>}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                {selectedItem.urlLaporan && <div className="flex items-center gap-2"><p className="text-sm text-slate-500">URL Laporan:</p><a href={selectedItem.urlLaporan} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline flex items-center gap-1">Lihat <ExternalLink className="w-3 h-3" /></a></div>}
                {selectedItem.urlLuaran && <div className="flex items-center gap-2"><p className="text-sm text-slate-500">URL Luaran:</p><a href={selectedItem.urlLuaran} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline flex items-center gap-1">Lihat <ExternalLink className="w-3 h-3" /></a></div>}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h4 className="text-sm text-slate-800 mb-3" style={{ fontWeight: 600 }}>Aksi</h4>
              <div className="space-y-2">
                {selectedItem.status === "draft" && (
                  <>
                    <button onClick={() => handleSave(true)} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700" style={{ fontWeight: 500 }}><Send className="w-4 h-4" /> Submit</button>
                    <button onClick={() => { setEditingItem(selectedItem); setFormData({ ...selectedItem }); setFormErrors({}); setViewMode("form"); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200" style={{ fontWeight: 500 }}><Edit className="w-4 h-4" /> Edit</button>
                    <button onClick={() => setConfirmModal({ open: true, title: "Hapus?", message: "Data akan dihapus.", variant: "danger", onConfirm: () => { handleDelete(selectedItem.id); setViewMode("list"); } })} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100" style={{ fontWeight: 500 }}><Trash2 className="w-4 h-4" /> Hapus</button>
                  </>
                )}
                {["approved", "verified"].includes(selectedItem.status) && <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200" style={{ fontWeight: 500 }}><Download className="w-4 h-4" /> Export PDF</button>}
              </div>
            </div>
          </div>
        </div>
        <ConfirmModal {...confirmModal} isOpen={confirmModal.open} onClose={() => setConfirmModal((p) => ({ ...p, open: false }))} />
      </PageWrapper>
    );
  }

  /* ═══════════ VIEW: FORM ═══════════ */
  if (viewMode === "form") {
    return (
      <PageWrapper
        title={editingItem ? "Edit Laporan Kegiatan" : "Tambah Laporan Kegiatan"}
        breadcrumbs={[{ label: "Dosen" }, { label: "Kegiatan", path: "/admin/kegiatan" }, { label: editingItem ? "Edit" : "Buat Baru" }]}
      >
        <div className="max-w-3xl space-y-5">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-sm text-slate-900 mb-5" style={{ fontWeight: 600 }}>Informasi Kegiatan</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField label="Jenis Kegiatan" required>
                <select value={formData.jenis} onChange={(e) => setFormData((p) => ({ ...p, jenis: e.target.value as JenisKegiatan }))} className={inputClass()} disabled={!!jenisParam}>
                  <option value="penelitian">Kegiatan Penelitian</option>
                  <option value="pkm">Kegiatan PKM</option>
                </select>
              </FormField>

              <div />

              <div className="sm:col-span-2">
                <FormField label="Judul Kegiatan" required error={formErrors.judulKegiatan}>
                  <input type="text" value={formData.judulKegiatan} onChange={(e) => setFormData((p) => ({ ...p, judulKegiatan: e.target.value }))}
                    placeholder="Judul kegiatan penelitian/PKM" className={inputClass(!!formErrors.judulKegiatan)} />
                </FormField>
              </div>

              <div className="sm:col-span-2">
                <FormField label="Deskripsi Kegiatan">
                  <textarea value={formData.deskripsi} onChange={(e) => setFormData((p) => ({ ...p, deskripsi: e.target.value }))}
                    rows={3} placeholder="Deskripsi singkat kegiatan..." className={inputClass()} />
                </FormField>
              </div>

              <FormField label="Tanggal Mulai" required error={formErrors.tanggalMulai}>
                <input type="date" value={formData.tanggalMulai} onChange={(e) => setFormData((p) => ({ ...p, tanggalMulai: e.target.value }))} className={inputClass(!!formErrors.tanggalMulai)} />
              </FormField>

              <FormField label="Tanggal Selesai">
                <input type="date" value={formData.tanggalSelesai} onChange={(e) => setFormData((p) => ({ ...p, tanggalSelesai: e.target.value }))} className={inputClass()} />
              </FormField>

              <div className="sm:col-span-2">
                <FormField label="Lokasi Kegiatan" required error={formErrors.lokasi}>
                  <input type="text" value={formData.lokasi} onChange={(e) => setFormData((p) => ({ ...p, lokasi: e.target.value }))}
                    placeholder="Kota / Nama Tempat" className={inputClass(!!formErrors.lokasi)} />
                </FormField>
              </div>

              <FormField label="URL Laporan">
                <input type="url" value={formData.urlLaporan} onChange={(e) => setFormData((p) => ({ ...p, urlLaporan: e.target.value }))}
                  placeholder="https://drive.google.com/..." className={inputClass()} />
              </FormField>

              <FormField label="URL Luaran">
                <input type="url" value={formData.urlLuaran} onChange={(e) => setFormData((p) => ({ ...p, urlLuaran: e.target.value }))}
                  placeholder="https://doi.org/..." className={inputClass()} />
              </FormField>

              <div className="sm:col-span-2">
                <FormField label="Capaian / Luaran">
                  <input type="text" value={formData.capaian} onChange={(e) => setFormData((p) => ({ ...p, capaian: e.target.value }))}
                    placeholder="Contoh: Jurnal Sinta 2, Prosiding Nasional..." className={inputClass()} />
                </FormField>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 flex gap-3 flex-wrap">
            <button onClick={() => setViewMode("list")} className="flex items-center gap-2 px-5 py-2.5 text-sm text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200" style={{ fontWeight: 500 }}><ChevronLeft className="w-4 h-4" /> Kembali</button>
            <button onClick={() => handleSave(false)} className="flex items-center gap-2 px-5 py-2.5 text-sm text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100" style={{ fontWeight: 500 }}>💾 Simpan Draft</button>
            <button onClick={() => handleSave(true)} className="flex items-center gap-2 px-5 py-2.5 text-sm text-white bg-[#E30613] rounded-lg hover:bg-[#c00510]" style={{ fontWeight: 500 }}><Send className="w-4 h-4" /> Submit</button>
            <button onClick={() => { setFormData(editingItem ? { ...editingItem } : emptyForm()); setFormErrors({}); }} className="flex items-center gap-2 px-5 py-2.5 text-sm text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200" style={{ fontWeight: 500 }}><RotateCcw className="w-4 h-4" /> Reset</button>
          </div>
        </div>
      </PageWrapper>
    );
  }

  /* ═══════════ VIEW: LIST ═══════════ */
  if (viewMode === "list" && selectedPeriode) {
    return (
      <PageWrapper
        title={`${jenisParam ? JENIS_LABELS[jenisParam] : "Laporan Kegiatan"} — ${selectedPeriode.tahun}`}
        breadcrumbs={[{ label: "Dosen" }, { label: "Kegiatan", path: "/admin/kegiatan" }, { label: selectedPeriode.tahun }]}
        actions={
          <div className="flex gap-2">
            <button onClick={() => setViewMode("periode")} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"><ChevronLeft className="w-4 h-4" /> Periode</button>
            {selectedPeriode.aktif && <button onClick={() => { setEditingItem(null); setFormData(emptyForm()); setFormErrors({}); setViewMode("form"); }} className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-[#E30613] rounded-lg hover:bg-[#c00510]" style={{ fontWeight: 500 }}><Plus className="w-4 h-4" /> Tambah</button>}
          </div>
        }
      >
        {loading ? <SkeletonTable rows={5} /> : (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} placeholder="Cari kegiatan..." className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E30613]/20" />
              </div>
            </div>
            {paginated.length === 0 ? <EmptyState variant={searchQuery ? "no-results" : "no-data"} /> : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead><tr className="border-b border-slate-100">
                      {["ID", "Judul Kegiatan", "Jenis", "Tanggal", "Capaian", "Status", "Aksi"].map((h) => (
                        <th key={h} className="px-5 py-3 text-left text-xs text-slate-500 whitespace-nowrap" style={{ fontWeight: 600 }}>{h}</th>
                      ))}
                    </tr></thead>
                    <tbody className="divide-y divide-slate-50">
                      {paginated.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/50">
                          <td className="px-5 py-3 text-sm text-slate-500">{item.id}</td>
                          <td className="px-5 py-3">
                            <button onClick={() => { setSelectedItem(item); setViewMode("detail"); }} className="text-sm text-slate-800 hover:text-[#E30613] text-left max-w-[220px] truncate block" style={{ fontWeight: 500 }}>{item.judulKegiatan}</button>
                            <p className="text-xs text-slate-400 mt-0.5 truncate">{item.lokasi}</p>
                          </td>
                          <td className="px-5 py-3"><span className={`text-xs px-2.5 py-0.5 rounded-full ${JENIS_COLORS[item.jenis]}`} style={{ fontWeight: 600 }}>{item.jenis === "penelitian" ? "Penelitian" : "PKM"}</span></td>
                          <td className="px-5 py-3 text-sm text-slate-600 whitespace-nowrap">{item.tanggalMulai}</td>
                          <td className="px-5 py-3 text-sm text-slate-600 max-w-[150px] truncate">{item.capaian || "-"}</td>
                          <td className="px-5 py-3"><StatusBadge status={item.status} /></td>
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-1">
                              <button onClick={() => { setSelectedItem(item); setViewMode("detail"); }} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md"><Eye className="w-4 h-4" /></button>
                              {["draft", "revisi"].includes(item.status) && <button onClick={() => { setEditingItem(item); setFormData({ ...item }); setFormErrors({}); setViewMode("form"); }} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md"><Edit className="w-4 h-4" /></button>}
                              {item.status === "draft" && <button onClick={() => setConfirmModal({ open: true, title: "Hapus?", message: "Data akan dihapus.", variant: "danger", onConfirm: () => handleDelete(item.id) })} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md"><Trash2 className="w-4 h-4" /></button>}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {totalPages > 1 && (
                  <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-xs text-slate-500">Total: {filtered.length}</p>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-1.5 text-slate-400 disabled:opacity-30"><ChevronLeft className="w-4 h-4" /></button>
                      {Array.from({ length: totalPages }).map((_, i) => <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-8 h-8 text-xs rounded-md ${currentPage === i + 1 ? "bg-[#E30613] text-white" : "text-slate-600 hover:bg-slate-100"}`}>{i + 1}</button>)}
                      <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-1.5 text-slate-400 disabled:opacity-30"><ChevronRight className="w-4 h-4" /></button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
        <ConfirmModal {...confirmModal} isOpen={confirmModal.open} onClose={() => setConfirmModal((p) => ({ ...p, open: false }))} />
        {toast.show && <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg border ${toast.type === "success" ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"}`}><CheckCircle className="w-4 h-4" /><span className="text-sm" style={{ fontWeight: 500 }}>{toast.message}</span></div>}
      </PageWrapper>
    );
  }

  /* ═══════════ VIEW: PERIODE ═══════════ */
  const jenisTitle = jenisParam ? JENIS_LABELS[jenisParam] : "Laporan Kegiatan";
  return (
    <PageWrapper title={jenisTitle} subtitle="Pilih periode untuk melihat atau menambah laporan kegiatan"
      breadcrumbs={[{ label: "Dosen" }, { label: "Kegiatan" }, { label: jenisTitle }]}>
      {loading ? <SkeletonTable rows={4} /> : (
        <div className="space-y-3">
          {MOCK_PERIODE.map((p) => {
            const count = kegiatanList.filter((k) => k.periodeId === p.id && (jenisParam ? k.jenis === jenisParam : true)).length;
            return (
              <div key={p.id} onClick={() => { setSelectedPeriode(p); setViewMode("list"); setCurrentPage(1); setSearchQuery(""); }}
                className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-5 py-4 cursor-pointer hover:border-[#E30613]/30 hover:shadow-sm transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center"><Activity className="w-5 h-5 text-green-600" /></div>
                  <div>
                    <p className="text-sm text-slate-800" style={{ fontWeight: 600 }}>{p.tahun} — {p.semester}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{count} laporan kegiatan</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {p.aktif && <span className="text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full border border-green-100">Aktif</span>}
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#E30613] transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </PageWrapper>
  );
}
