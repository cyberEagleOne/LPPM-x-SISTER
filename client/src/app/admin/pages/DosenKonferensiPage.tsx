import { useState, useEffect } from "react";
import {
  Plus, Search, Eye, Edit, Trash2, Send, CheckCircle,
  RotateCcw, ChevronLeft, ChevronRight, Download, Calendar, AlertCircle,
  ExternalLink
} from "lucide-react";

import { PageWrapper } from "../components/PageWrapper";
import { StatusBadge, type StatusType } from "../components/StatusBadge";
import { EmptyState } from "../components/EmptyState";
import { ConfirmModal } from "../components/ConfirmModal";
import { SkeletonTable } from "../components/SkeletonLoader";
import { StepperStatus } from "../components/StepperStatus";

/* ────────────────── Types ────────────────── */

interface PeriodeKonf {
  id: string;
  tahun: string;
  semester: string;
  aktif: boolean;
}

interface KonferensiItem {
  id: string;
  judulKonferensi: string;
  judulManuscript: string;
  kategori: string;
  luaran: string;
  tahun: string;
  semester: string;
  tanggal: string;
  keterangan: string;
  urlManuscript: string;
  urlPersetujuanProdi: string;
  urlLOA: string;
  urlFlyer: string;
  totalRAB: number;
  urlRAB: string;
  urlOrisinalitas: string;
  status: StatusType;
  tanggalDibuat: string;
}

type ViewMode = "periode" | "list" | "form" | "detail";

/* ────────────────── Ref Data ────────────────── */

const KATEGORI_KONF = ["Internasional", "Nasional", "Workshop", "Seminar Lokal"];

const LUARAN_BY_KATEGORI: Record<string, { id: string; label: string; dana: string }[]> = {
  "Internasional": [
    { id: "L1", label: "Prosiding Terindeks Scopus", dana: "Hingga Rp 25.000.000" },
    { id: "L2", label: "Prosiding IEEE/ACM", dana: "Hingga Rp 20.000.000" },
    { id: "L3", label: "Presentasi Oral", dana: "Hingga Rp 15.000.000" },
  ],
  "Nasional": [
    { id: "L4", label: "Prosiding Nasional Terakreditasi", dana: "Hingga Rp 8.000.000" },
    { id: "L5", label: "Poster Presentation", dana: "Hingga Rp 5.000.000" },
  ],
  "Workshop": [
    { id: "L6", label: "Sertifikat Peserta", dana: "Hingga Rp 3.000.000" },
  ],
  "Seminar Lokal": [
    { id: "L7", label: "Makalah Seminar", dana: "Hingga Rp 2.000.000" },
  ],
};

const MOCK_PERIODE: PeriodeKonf[] = [
  { id: "PK-001", tahun: "2025/2026", semester: "Genap", aktif: true },
  { id: "PK-002", tahun: "2024/2025", semester: "Ganjil", aktif: false },
  { id: "PK-003", tahun: "2024/2025", semester: "Genap", aktif: false },
];

const MOCK_KONF: KonferensiItem[] = [
  {
    id: "KNF-001", judulKonferensi: "ICALT 2026 International Conference", judulManuscript: "IoT in Smart Campus",
    kategori: "Internasional", luaran: "Prosiding Terindeks Scopus", tahun: "2025/2026", semester: "Genap",
    tanggal: "2026-04-10", keterangan: "Pengajuan dana konferensi",
    urlManuscript: "https://drive.google.com/manuscript", urlPersetujuanProdi: "https://drive.google.com/persetujuan",
    urlLOA: "https://drive.google.com/loa", urlFlyer: "https://drive.google.com/flyer",
    totalRAB: 15000000, urlRAB: "https://drive.google.com/rab", urlOrisinalitas: "https://drive.google.com/ori",
    status: "submitted", tanggalDibuat: "2026-02-20",
  },
  {
    id: "KNF-002", judulKonferensi: "Seminar Nasional Informatika 2026", judulManuscript: "Machine Learning untuk Prediksi",
    kategori: "Nasional", luaran: "Prosiding Nasional Terakreditasi", tahun: "2025/2026", semester: "Genap",
    tanggal: "2026-05-15", keterangan: "Pengajuan dana konferensi",
    urlManuscript: "", urlPersetujuanProdi: "", urlLOA: "", urlFlyer: "",
    totalRAB: 6500000, urlRAB: "", urlOrisinalitas: "",
    status: "draft", tanggalDibuat: "2026-03-01",
  },
];

const generateId = () => `KNF-${String(Math.floor(Math.random() * 9000) + 1000)}`;

const emptyForm = (): Omit<KonferensiItem, "id" | "tanggalDibuat" | "status"> => ({
  judulKonferensi: "", judulManuscript: "", kategori: "", luaran: "",
  tahun: "", semester: "", tanggal: "", keterangan: "Pengajuan dana konferensi",
  urlManuscript: "", urlPersetujuanProdi: "", urlLOA: "", urlFlyer: "",
  totalRAB: 0, urlRAB: "", urlOrisinalitas: "",
});

/* ────────────────── Main Component ────────────────── */

export function DosenKonferensiPage() {
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("periode");
  const [selectedPeriode, setSelectedPeriode] = useState<PeriodeKonf | null>(null);
  const [selectedItem, setSelectedItem] = useState<KonferensiItem | null>(null);
  const [editingItem, setEditingItem] = useState<KonferensiItem | null>(null);
  const [konferensiList, setKonferensiList] = useState<KonferensiItem[]>(MOCK_KONF);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState(emptyForm());
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [luaranOptions, setLuaranOptions] = useState<{ id: string; label: string; dana: string }[]>([]);
  const [selectedLuaranDana, setSelectedLuaranDana] = useState("");
  const [confirmModal, setConfirmModal] = useState({ open: false, title: "", message: "", variant: "danger" as "danger" | "warning" | "success", onConfirm: () => {} });
  const [toast, setToast] = useState({ show: false, message: "", type: "success" as "success" | "error" });
  const perPage = 8;

  useEffect(() => { const t = setTimeout(() => setLoading(false), 500); return () => clearTimeout(t); }, []);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast((p) => ({ ...p, show: false })), 3000);
  };

  // Cascading: kategori → luaran options
  const handleKategoriChange = (kategori: string) => {
    setFormData((p) => ({ ...p, kategori, luaran: "" }));
    const opts = LUARAN_BY_KATEGORI[kategori] || [];
    setLuaranOptions(opts);
    setSelectedLuaranDana("");
  };

  const handleLuaranChange = (luaran: string) => {
    setFormData((p) => ({ ...p, luaran }));
    const selected = luaranOptions.find((o) => o.label === luaran);
    setSelectedLuaranDana(selected?.dana || "");
  };

  const inputClass = (hasError?: boolean) =>
    `w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all bg-slate-50/50 placeholder:text-slate-400 ${
      hasError ? "border-red-300 focus:ring-red-200" : "border-slate-200 focus:ring-[#E30613]/20 focus:border-[#E30613]/40"
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

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.judulKonferensi.trim()) errors.judulKonferensi = "Judul konferensi wajib diisi";
    if (!formData.judulManuscript.trim()) errors.judulManuscript = "Judul manuscript wajib diisi";
    if (!formData.tanggal) errors.tanggal = "Tanggal wajib diisi";
    if (!formData.luaran) errors.luaran = "Luaran wajib dipilih";
    const urlRegex = /^https?:\/\/.+/;
    if (formData.urlManuscript && !urlRegex.test(formData.urlManuscript)) errors.urlManuscript = "URL tidak valid";
    if (formData.urlLOA && !urlRegex.test(formData.urlLOA)) errors.urlLOA = "URL tidak valid";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = (asSubmit: boolean) => {
    if (!validateForm()) { showToast("Mohon lengkapi field yang wajib diisi", "error"); return; }
    if (editingItem) {
      setKonferensiList((prev) => prev.map((k) => k.id === editingItem.id ? { ...k, ...formData, status: asSubmit ? "submitted" : k.status } : k));
      showToast(asSubmit ? "Berhasil disubmit" : "Draft disimpan");
    } else {
      const newItem: KonferensiItem = {
        ...formData,
        id: generateId(),
        status: asSubmit ? "submitted" : "draft",
        tanggalDibuat: new Date().toISOString().split("T")[0],
      };
      setKonferensiList((prev) => [newItem, ...prev]);
      showToast(asSubmit ? "Konferensi berhasil disubmit" : "Draft disimpan");
    }
    setEditingItem(null);
    setViewMode("list");
  };

  const handleDelete = (id: string) => {
    setKonferensiList((prev) => prev.filter((k) => k.id !== id));
    showToast("Konferensi dihapus");
  };

  const handleStatusChange = (id: string, status: StatusType) => {
    setKonferensiList((prev) => prev.map((k) => k.id === id ? { ...k, status } : k));
    if (selectedItem?.id === id) setSelectedItem((p) => p ? { ...p, status } : null);
    showToast("Status diubah");
  };

  const periodeFiltered = konferensiList.filter((k) =>
    selectedPeriode ? k.tahun === selectedPeriode.tahun && k.semester === selectedPeriode.semester : false
  );
  const filtered = periodeFiltered.filter((k) =>
    k.judulKonferensi.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  /* ═══════════ VIEW: DETAIL ═══════════ */
  if (viewMode === "detail" && selectedItem) {
    const docLinks = [
      { label: "URL Manuscript", url: selectedItem.urlManuscript },
      { label: "URL Persetujuan Prodi", url: selectedItem.urlPersetujuanProdi },
      { label: "URL LOA", url: selectedItem.urlLOA },
      { label: "URL Flyer", url: selectedItem.urlFlyer },
      { label: "URL RAB", url: selectedItem.urlRAB },
      { label: "URL Orisinalitas", url: selectedItem.urlOrisinalitas },
    ];
    return (
      <PageWrapper title="Detail Konferensi"
        breadcrumbs={[{ label: "Dosen" }, { label: "Konferensi", path: "/admin/konferensi" }, { label: selectedItem.id }]}
        actions={<button onClick={() => setViewMode("list")} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"><ChevronLeft className="w-4 h-4" /> Kembali</button>}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <StepperStatus module="konferensi" currentStatus={selectedItem.status} />

            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div><span className="text-xs text-slate-400">{selectedItem.id}</span><h3 className="text-base text-slate-900 mt-1" style={{ fontWeight: 600 }}>{selectedItem.judulKonferensi}</h3></div>
                <StatusBadge status={selectedItem.status} size="md" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Judul Manuscript", value: selectedItem.judulManuscript },
                  { label: "Kategori", value: selectedItem.kategori },
                  { label: "Luaran", value: selectedItem.luaran },
                  { label: "Tahun Ajaran", value: `${selectedItem.tahun} — ${selectedItem.semester}` },
                  { label: "Tanggal", value: selectedItem.tanggal },
                  { label: "Total RAB", value: `Rp ${selectedItem.totalRAB.toLocaleString("id-ID")}` },
                ].map((f) => (
                  <div key={f.label}><p className="text-xs text-slate-400 mb-0.5">{f.label}</p><p className="text-sm text-slate-800" style={{ fontWeight: 500 }}>{f.value || "-"}</p></div>
                ))}
                {selectedItem.keterangan && (
                  <div className="col-span-2"><p className="text-xs text-slate-400 mb-0.5">Keterangan</p><p className="text-sm text-slate-700">{selectedItem.keterangan}</p></div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h4 className="text-sm text-slate-800 mb-4" style={{ fontWeight: 600 }}>Dokumen Pendukung</h4>
              <div className="space-y-2">
                {docLinks.map((d) => (
                  <div key={d.label} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                    <span className="text-sm text-slate-600">{d.label}</span>
                    {d.url ? (
                      <a href={d.url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
                        Lihat <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : <span className="text-sm text-slate-400">—</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Aksi */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h4 className="text-sm text-slate-800 mb-3" style={{ fontWeight: 600 }}>Aksi</h4>
              <div className="space-y-2">
                {selectedItem.status === "draft" && (
                  <>
                    <button onClick={() => setConfirmModal({ open: true, title: "Submit?", message: "Konferensi akan disubmit untuk review.", variant: "warning", onConfirm: () => handleStatusChange(selectedItem.id, "submitted") })}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700" style={{ fontWeight: 500 }}>
                      <Send className="w-4 h-4" /> Submit
                    </button>
                    <button onClick={() => { setEditingItem(selectedItem); setFormData({ ...selectedItem }); setFormErrors({}); setViewMode("form"); }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200" style={{ fontWeight: 500 }}>
                      <Edit className="w-4 h-4" /> Edit
                    </button>
                    <button onClick={() => setConfirmModal({ open: true, title: "Hapus?", message: "Data akan dihapus permanen.", variant: "danger", onConfirm: () => { handleDelete(selectedItem.id); setViewMode("list"); } })}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100" style={{ fontWeight: 500 }}>
                      <Trash2 className="w-4 h-4" /> Hapus
                    </button>
                  </>
                )}
                {selectedItem.status === "revisi" && (
                  <button onClick={() => { setEditingItem(selectedItem); setFormData({ ...selectedItem }); setFormErrors({}); setViewMode("form"); }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700" style={{ fontWeight: 500 }}>
                    <Edit className="w-4 h-4" /> Edit & Revisi
                  </button>
                )}
                {["approved", "verified"].includes(selectedItem.status) && (
                  <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200" style={{ fontWeight: 500 }}>
                    <Download className="w-4 h-4" /> Export PDF
                  </button>
                )}
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
        title={editingItem ? "Edit Konferensi" : "Ajukan Konferensi Baru"}
        breadcrumbs={[{ label: "Dosen" }, { label: "Konferensi", path: "/admin/konferensi" }, { label: editingItem ? "Edit" : "Buat Baru" }]}
      >
        <div className="max-w-4xl space-y-6">
          {/* INFO KEGIATAN */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-sm text-slate-900 mb-5" style={{ fontWeight: 600 }}>Informasi Konferensi</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField label="Tahun Ajaran">
                <select value={formData.tahun} onChange={(e) => setFormData((p) => ({ ...p, tahun: e.target.value }))} className={inputClass()}>
                  <option value="">Pilih Tahun</option>
                  {["2025/2026", "2024/2025", "2023/2024"].map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </FormField>

              <FormField label="Semester">
                <select value={formData.semester} onChange={(e) => setFormData((p) => ({ ...p, semester: e.target.value }))} className={inputClass()}>
                  <option value="">Pilih Semester</option>
                  <option value="Ganjil">Ganjil</option>
                  <option value="Genap">Genap</option>
                </select>
              </FormField>

              <FormField label="Tanggal Konferensi" required error={formErrors.tanggal}>
                <input type="date" value={formData.tanggal} onChange={(e) => setFormData((p) => ({ ...p, tanggal: e.target.value }))} className={inputClass(!!formErrors.tanggal)} />
              </FormField>

              <FormField label="Kategori Konferensi">
                <select value={formData.kategori} onChange={(e) => handleKategoriChange(e.target.value)} className={inputClass()}>
                  <option value="">Pilih Kategori</option>
                  {KATEGORI_KONF.map((k) => <option key={k} value={k}>{k}</option>)}
                </select>
              </FormField>

              <div className="sm:col-span-2">
                <FormField label="Luaran Konferensi" required error={formErrors.luaran}>
                  <select value={formData.luaran} onChange={(e) => handleLuaranChange(e.target.value)} className={inputClass(!!formErrors.luaran)} disabled={!formData.kategori}>
                    <option value="">Pilih kategori dulu...</option>
                    {luaranOptions.map((o) => <option key={o.id} value={o.label}>{o.label}</option>)}
                  </select>
                  {selectedLuaranDana && (
                    <p className="text-xs text-blue-600 mt-1.5 flex items-center gap-1">💰 Dana: {selectedLuaranDana}</p>
                  )}
                </FormField>
              </div>

              <div className="sm:col-span-2">
                <FormField label="Judul Konferensi" required error={formErrors.judulKonferensi}>
                  <input type="text" value={formData.judulKonferensi} onChange={(e) => setFormData((p) => ({ ...p, judulKonferensi: e.target.value }))}
                    placeholder="Masukkan judul konferensi" className={inputClass(!!formErrors.judulKonferensi)} />
                </FormField>
              </div>

              <div className="sm:col-span-2">
                <FormField label="Judul Manuscript" required error={formErrors.judulManuscript}>
                  <input type="text" value={formData.judulManuscript} onChange={(e) => setFormData((p) => ({ ...p, judulManuscript: e.target.value }))}
                    placeholder="Masukkan judul manuscript" className={inputClass(!!formErrors.judulManuscript)} />
                </FormField>
              </div>

              <div className="sm:col-span-2">
                <FormField label="Keterangan">
                  <textarea value={formData.keterangan} onChange={(e) => setFormData((p) => ({ ...p, keterangan: e.target.value }))}
                    rows={2} placeholder="Keterangan tambahan" className={inputClass()} />
                </FormField>
              </div>
            </div>
          </div>

          {/* DOKUMEN PENDUKUNG */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-sm text-slate-900 mb-5" style={{ fontWeight: 600 }}>Dokumen Pendukung (URL)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { key: "urlManuscript" as keyof typeof formData, label: "URL File Manuscript", required: true },
                { key: "urlPersetujuanProdi" as keyof typeof formData, label: "URL File Persetujuan Prodi", required: true },
                { key: "urlLOA" as keyof typeof formData, label: "URL File LOA", required: true },
                { key: "urlFlyer" as keyof typeof formData, label: "URL File Flyer", required: true },
                { key: "urlRAB" as keyof typeof formData, label: "URL File RAB", required: true },
                { key: "urlOrisinalitas" as keyof typeof formData, label: "URL File Orisinalitas", required: true },
              ].map((field) => (
                <FormField key={field.key} label={field.label} required={field.required} error={formErrors[field.key]}>
                  <input type="url" value={String(formData[field.key] || "")}
                    onChange={(e) => setFormData((p) => ({ ...p, [field.key]: e.target.value }))}
                    placeholder="https://drive.google.com/..."
                    className={inputClass(!!formErrors[field.key])} />
                </FormField>
              ))}
              <FormField label="Total RAB (Rp)">
                <input type="number" value={formData.totalRAB || ""}
                  onChange={(e) => setFormData((p) => ({ ...p, totalRAB: Number(e.target.value) }))}
                  placeholder="0" className={inputClass()} />
              </FormField>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-wrap gap-3">
            <button onClick={() => setViewMode("list")} className="flex items-center gap-2 px-5 py-2.5 text-sm text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200" style={{ fontWeight: 500 }}>
              <ChevronLeft className="w-4 h-4" /> Kembali
            </button>
            <button onClick={() => handleSave(false)} className="flex items-center gap-2 px-5 py-2.5 text-sm text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100" style={{ fontWeight: 500 }}>
              💾 Simpan Draft
            </button>
            <button onClick={() => handleSave(true)} className="flex items-center gap-2 px-5 py-2.5 text-sm text-white bg-[#E30613] rounded-lg hover:bg-[#c00510]" style={{ fontWeight: 500 }}>
              <Send className="w-4 h-4" /> Submit
            </button>
            <button onClick={() => { setFormData(editingItem ? { ...editingItem } : emptyForm()); setFormErrors({}); }} className="flex items-center gap-2 px-5 py-2.5 text-sm text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200" style={{ fontWeight: 500 }}>
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
          </div>
        </div>
      </PageWrapper>
    );
  }

  /* ═══════════ VIEW: LIST ═══════════ */
  if (viewMode === "list" && selectedPeriode) {
    return (
      <PageWrapper
        title={`Konferensi — ${selectedPeriode.tahun} (${selectedPeriode.semester})`}
        breadcrumbs={[{ label: "Dosen" }, { label: "Konferensi", path: "/admin/konferensi" }, { label: selectedPeriode.tahun }]}
        actions={
          <div className="flex gap-2">
            <button onClick={() => setViewMode("periode")} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">
              <ChevronLeft className="w-4 h-4" /> Periode
            </button>
            {selectedPeriode.aktif && (
              <button onClick={() => { setEditingItem(null); setFormData(emptyForm()); setFormErrors({}); setViewMode("form"); }}
                className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-[#E30613] rounded-lg hover:bg-[#c00510]" style={{ fontWeight: 500 }}>
                <Plus className="w-4 h-4" /> Ajukan Baru
              </button>
            )}
          </div>
        }
      >
        {loading ? <SkeletonTable rows={5} /> : (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  placeholder="Cari konferensi..." className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E30613]/20" />
              </div>
            </div>
            {paginated.length === 0 ? <EmptyState variant={searchQuery ? "no-results" : "no-data"} /> : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead><tr className="border-b border-slate-100">
                      {["ID", "Judul Konferensi", "Kategori", "Luaran", "Tanggal", "Status", "Aksi"].map((h) => (
                        <th key={h} className="px-5 py-3 text-left text-xs text-slate-500 whitespace-nowrap" style={{ fontWeight: 600 }}>{h}</th>
                      ))}
                    </tr></thead>
                    <tbody className="divide-y divide-slate-50">
                      {paginated.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/50">
                          <td className="px-5 py-3.5 text-sm text-slate-500" style={{ fontWeight: 500 }}>{item.id}</td>
                          <td className="px-5 py-3.5">
                            <button onClick={() => { setSelectedItem(item); setViewMode("detail"); }} className="text-sm text-slate-800 hover:text-[#E30613] text-left max-w-[220px] truncate block" style={{ fontWeight: 500 }}>{item.judulKonferensi}</button>
                            <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[220px]">{item.judulManuscript}</p>
                          </td>
                          <td className="px-5 py-3.5 text-sm text-slate-600 whitespace-nowrap">{item.kategori}</td>
                          <td className="px-5 py-3.5 text-sm text-slate-600 max-w-[180px] truncate">{item.luaran}</td>
                          <td className="px-5 py-3.5 text-sm text-slate-600 whitespace-nowrap">{item.tanggal}</td>
                          <td className="px-5 py-3.5 whitespace-nowrap"><StatusBadge status={item.status} /></td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-1">
                              <button onClick={() => { setSelectedItem(item); setViewMode("detail"); }} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md"><Eye className="w-4 h-4" /></button>
                              {["draft", "revisi"].includes(item.status) && (
                                <button onClick={() => { setEditingItem(item); setFormData({ ...item }); setFormErrors({}); setViewMode("form"); }} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md"><Edit className="w-4 h-4" /></button>
                              )}
                              {item.status === "draft" && (
                                <button onClick={() => setConfirmModal({ open: true, title: "Hapus?", message: "Data akan dihapus permanen.", variant: "danger", onConfirm: () => handleDelete(item.id) })} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md"><Trash2 className="w-4 h-4" /></button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {totalPages > 1 && (
                  <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-xs text-slate-500">Total: {filtered.length} konferensi</p>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-1.5 text-slate-400 disabled:opacity-30"><ChevronLeft className="w-4 h-4" /></button>
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-8 h-8 text-xs rounded-md ${currentPage === i + 1 ? "bg-[#E30613] text-white" : "text-slate-600 hover:bg-slate-100"}`}>{i + 1}</button>
                      ))}
                      <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-1.5 text-slate-400 disabled:opacity-30"><ChevronRight className="w-4 h-4" /></button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
        <ConfirmModal {...confirmModal} isOpen={confirmModal.open} onClose={() => setConfirmModal((p) => ({ ...p, open: false }))} />
        {toast.show && (
          <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg border ${toast.type === "success" ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"}`}>
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm" style={{ fontWeight: 500 }}>{toast.message}</span>
          </div>
        )}
      </PageWrapper>
    );
  }

  /* ═══════════ VIEW: PERIODE ═══════════ */
  return (
    <PageWrapper title="Konferensi Saya" subtitle="Pilih periode untuk melihat pengajuan konferensi"
      breadcrumbs={[{ label: "Dosen" }, { label: "Konferensi" }]}>
      {loading ? <SkeletonTable rows={4} /> : (
        <div className="space-y-3">
          {MOCK_PERIODE.map((p) => {
            const count = konferensiList.filter((k) => k.tahun === p.tahun && k.semester === p.semester).length;
            return (
              <div key={p.id} onClick={() => { setSelectedPeriode(p); setViewMode("list"); setCurrentPage(1); setSearchQuery(""); }}
                className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-5 py-4 cursor-pointer hover:border-[#E30613]/30 hover:shadow-sm transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-800" style={{ fontWeight: 600 }}>{p.tahun} — {p.semester}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{count} pengajuan konferensi</p>
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
