import { useState, useEffect } from "react";
import {
  Plus, Search, Eye, Edit, Trash2, Send, CheckCircle, XCircle,
  RotateCcw, ChevronLeft, ChevronRight, Download, DollarSign,
  Calendar, Link as LinkIcon, Users, ExternalLink, AlertCircle, X
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { roleMatchesAny } from "../config/roleTemplates";
import { PageWrapper } from "../components/PageWrapper";
import { StatusBadge, type StatusType } from "../components/StatusBadge";
import { EmptyState } from "../components/EmptyState";
import { ConfirmModal } from "../components/ConfirmModal";
import { SkeletonTable } from "../components/SkeletonLoader";
import { StepperStatus } from "../components/StepperStatus";

/* ────────────────── Types ────────────────── */

interface PeriodeAjuan {
  id: string;
  tahunAjaran: string;
  semester: "ganjil" | "genap";
  waktuMulai: string;
  waktuSelesai: string;
  aktif: boolean;
}

interface TeamMember {
  id: string;
  nama: string;
  peran: "Ketua" | "Anggota";
}

interface ExternalMember {
  id: string;
  nama: string;
  afiliasi: string;
  peran: "Ketua" | "Anggota";
}

interface SuratTugasItem {
  id: string;
  periodeId: string;
  jenisKegiatan: string;
  sumberDana: string;
  peranAnda: string;
  judulKegiatan: string;
  keterangan: string;
  lokasiKegiatan: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  urlBuktiUndangan: string;
  urlProposal: string;
  urlKontrak: string;
  timPradita: TeamMember[];
  anggotaEksternal: ExternalMember[];
  status: StatusType;
  tanggalDibuat: string;
}

/* ────────────────── Mock Data ────────────────── */

const MOCK_PERIODE: PeriodeAjuan[] = [
  { id: "P-001", tahunAjaran: "2025-2026", semester: "genap", waktuMulai: "2026-01-13", waktuSelesai: "2026-03-15", aktif: true },
  { id: "P-002", tahunAjaran: "2024-2025", semester: "ganjil", waktuMulai: "2025-07-07", waktuSelesai: "2025-08-09", aktif: false },
  { id: "P-003", tahunAjaran: "2024-2025", semester: "genap", waktuMulai: "2025-01-06", waktuSelesai: "2025-03-01", aktif: false },
];

const MOCK_DOSEN = [
  "Dr. Arif Ramadhan, M.Sc.",
  "Dr. Rina Wulandari, M.T.",
  "Prof. Dimas Prakoso, Ph.D.",
  "Dr. Lestari Handayani, M.Kom.",
  "Dr. Fajar Nugroho, M.Si.",
  "Dr. Faisal Rahman, M.Eng.",
];

const generateId = () => `ST-${String(Math.floor(Math.random() * 9000) + 1000)}`;

const INITIAL_SURAT: SuratTugasItem[] = [
  {
    id: "ST-001", periodeId: "P-001", jenisKegiatan: "Konferensi", sumberDana: "Institusi",
    peranAnda: "Ketua", judulKegiatan: "Konferensi Internasional ICALT 2026",
    keterangan: "Presentasi paper terkait AI in Education", lokasiKegiatan: "Bali Convention Center",
    tanggalMulai: "2026-04-10", tanggalSelesai: "2026-04-12",
    urlBuktiUndangan: "https://icalt2026.org/invitation", urlProposal: "", urlKontrak: "",
    timPradita: [
      { id: "tm-1", nama: "Dr. Arif Ramadhan, M.Sc.", peran: "Ketua" },
      { id: "tm-2", nama: "Dr. Rina Wulandari, M.T.", peran: "Anggota" },
    ],
    anggotaEksternal: [{ id: "ex-1", nama: "John Doe", afiliasi: "MIT", peran: "Anggota" }],
    status: "submitted", tanggalDibuat: "2026-02-20",
  },
  {
    id: "ST-002", periodeId: "P-001", jenisKegiatan: "PKM", sumberDana: "Mandiri",
    peranAnda: "Ketua", judulKegiatan: "Pengabdian Masyarakat Desa Cisauk",
    keterangan: "Pelatihan literasi digital untuk UMKM", lokasiKegiatan: "Desa Cisauk, Tangerang",
    tanggalMulai: "2026-03-01", tanggalSelesai: "2026-03-03",
    urlBuktiUndangan: "", urlProposal: "https://drive.google.com/proposal", urlKontrak: "",
    timPradita: [{ id: "tm-3", nama: "Dr. Arif Ramadhan, M.Sc.", peran: "Ketua" }],
    anggotaEksternal: [],
    status: "draft", tanggalDibuat: "2026-02-18",
  },
  {
    id: "ST-003", periodeId: "P-001", jenisKegiatan: "Hibah", sumberDana: "Eksternal",
    peranAnda: "Anggota", judulKegiatan: "Penelitian Hibah Dikti 2026",
    keterangan: "", lokasiKegiatan: "Universitas Pradita",
    tanggalMulai: "2026-05-01", tanggalSelesai: "2026-11-30",
    urlBuktiUndangan: "", urlProposal: "", urlKontrak: "https://simlitabmas.go.id/kontrak",
    timPradita: [
      { id: "tm-4", nama: "Prof. Dimas Prakoso, Ph.D.", peran: "Ketua" },
      { id: "tm-5", nama: "Dr. Arif Ramadhan, M.Sc.", peran: "Anggota" },
    ],
    anggotaEksternal: [],
    status: "approved", tanggalDibuat: "2026-01-28",
  },
  {
    id: "ST-004", periodeId: "P-002", jenisKegiatan: "Konferensi", sumberDana: "Mandiri",
    peranAnda: "Ketua", judulKegiatan: "Seminar Nasional Informatika 2025",
    keterangan: "Keynote speaker", lokasiKegiatan: "Jakarta",
    tanggalMulai: "2025-09-10", tanggalSelesai: "2025-09-11",
    urlBuktiUndangan: "https://semnasinformatika.id/inv", urlProposal: "", urlKontrak: "",
    timPradita: [{ id: "tm-6", nama: "Dr. Arif Ramadhan, M.Sc.", peran: "Ketua" }],
    anggotaEksternal: [],
    status: "approved", tanggalDibuat: "2025-07-15",
  },
];

/* ────────────────── View Types ────────────────── */

type ViewMode = "periode" | "daftar" | "form" | "detail";

/* ────────────────── Helpers ────────────────── */

const formatDate = (d: string) => {
  if (!d) return "-";
  const date = new Date(d);
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  return `${days[date.getDay()]}, ${String(date.getDate()).padStart(2, "0")} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

const formatDateRange = (start: string, end: string) => `${formatDate(start)} - ${formatDate(end)}`;

/* ────────────────── Main Component ────────────────── */

export function SuratTugasPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("periode");
  const [selectedPeriode, setSelectedPeriode] = useState<PeriodeAjuan | null>(null);
  const [selectedItem, setSelectedItem] = useState<SuratTugasItem | null>(null);
  const [editingItem, setEditingItem] = useState<SuratTugasItem | null>(null);
  const [suratList, setSuratList] = useState<SuratTugasItem[]>(INITIAL_SURAT);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" as "success" | "error" });
  const [confirmModal, setConfirmModal] = useState({ open: false, title: "", message: "", variant: "danger" as "danger" | "warning" | "success", onConfirm: () => {} });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const perPage = 10;

  // Form state
  const emptyForm = (): Omit<SuratTugasItem, "id" | "tanggalDibuat" | "status"> => ({
    periodeId: selectedPeriode?.id || "",
    jenisKegiatan: "",
    sumberDana: "",
    peranAnda: "",
    judulKegiatan: "",
    keterangan: "",
    lokasiKegiatan: "",
    tanggalMulai: "",
    tanggalSelesai: "",
    urlBuktiUndangan: "",
    urlProposal: "",
    urlKontrak: "",
    timPradita: [{ id: crypto.randomUUID(), nama: user?.name || MOCK_DOSEN[0], peran: "Ketua" }],
    anggotaEksternal: [],
  });
  const [formData, setFormData] = useState(emptyForm());

  useEffect(() => { const t = setTimeout(() => setLoading(false), 500); return () => clearTimeout(t); }, []);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast((p) => ({ ...p, show: false })), 3000);
  };

  const canCreate = roleMatchesAny(user?.role, ["administrator", "lppm", "dosen"]);
  const canApprove = roleMatchesAny(user?.role, ["administrator", "lppm", "ketua-lppm"]);

  /* ────────── Form Validation ────────── */

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.jenisKegiatan) errors.jenisKegiatan = "Jenis kegiatan wajib dipilih";
    if (!formData.sumberDana) errors.sumberDana = "Sumber dana wajib dipilih";
    if (!formData.peranAnda) errors.peranAnda = "Peran wajib dipilih";
    if (!formData.judulKegiatan.trim()) errors.judulKegiatan = "Judul kegiatan wajib diisi";
    if (!formData.lokasiKegiatan.trim()) errors.lokasiKegiatan = "Lokasi kegiatan wajib diisi";
    if (!formData.tanggalMulai) errors.tanggalMulai = "Tanggal mulai wajib diisi";
    if (!formData.tanggalSelesai) errors.tanggalSelesai = "Tanggal selesai wajib diisi";
    if (formData.tanggalMulai && formData.tanggalSelesai && formData.tanggalSelesai < formData.tanggalMulai) {
      errors.tanggalSelesai = "Tanggal selesai harus ≥ tanggal mulai";
    }
    // URL validation
    const urlRegex = /^https?:\/\/.+/;
    if (formData.urlBuktiUndangan && !urlRegex.test(formData.urlBuktiUndangan)) errors.urlBuktiUndangan = "URL tidak valid";
    if (formData.urlProposal && !urlRegex.test(formData.urlProposal)) errors.urlProposal = "URL tidak valid";
    if (formData.urlKontrak && !urlRegex.test(formData.urlKontrak)) errors.urlKontrak = "URL tidak valid";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = (asSubmit: boolean) => {
    if (!validateForm()) {
      showToast("Mohon lengkapi semua field yang wajib diisi", "error");
      return;
    }
    if (editingItem) {
      // Update existing
      setSuratList((prev) =>
        prev.map((s) =>
          s.id === editingItem.id
            ? { ...s, ...formData, status: asSubmit ? "submitted" : s.status }
            : s
        )
      );
      showToast(asSubmit ? "Surat tugas berhasil disubmit" : "Perubahan berhasil disimpan");
    } else {
      // Create new
      const newItem: SuratTugasItem = {
        ...formData,
        id: generateId(),
        periodeId: selectedPeriode?.id || "",
        status: asSubmit ? "submitted" : "draft",
        tanggalDibuat: new Date().toISOString().split("T")[0],
      };
      setSuratList((prev) => [newItem, ...prev]);
      showToast(asSubmit ? "Surat tugas berhasil disubmit" : "Draft berhasil disimpan");
    }
    setEditingItem(null);
    setViewMode("daftar");
  };

  const handleReset = () => {
    setFormData(editingItem ? { ...editingItem } : emptyForm());
    setFormErrors({});
  };

  const handleDelete = (id: string) => {
    setSuratList((prev) => prev.filter((s) => s.id !== id));
    showToast("Surat tugas berhasil dihapus");
  };

  const handleStatusChange = (id: string, newStatus: StatusType) => {
    setSuratList((prev) => prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s)));
    if (selectedItem?.id === id) setSelectedItem((p) => (p ? { ...p, status: newStatus } : null));
    showToast("Status berhasil diubah");
  };

  /* ────────── Filtered & Paginated ────────── */

  const periodeFiltered = suratList.filter((s) => s.periodeId === selectedPeriode?.id);
  const filtered = periodeFiltered.filter((item) => {
    const matchSearch = item.judulKegiatan.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === "all" || item.status === statusFilter;
    return matchSearch && matchStatus;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  /* ────────── Shared form field component ────────── */

  const FormField = ({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) => (
    <div>
      <label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 500 }}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
          <AlertCircle className="w-3 h-3" /> {error}
        </p>
      )}
    </div>
  );

  const inputClass = (hasError?: boolean) =>
    `w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all bg-slate-50/50 placeholder:text-slate-400 ${
      hasError
        ? "border-red-300 focus:ring-red-200 focus:border-red-400"
        : "border-slate-200 focus:ring-[#E30613]/20 focus:border-[#E30613]/40"
    }`;

  /* ═══════════════════════════════════════════
     VIEW 4: DETAIL SURAT TUGAS
     ═══════════════════════════════════════════ */

  if (viewMode === "detail" && selectedItem) {
    const isReadOnly = selectedItem.status !== "draft" && selectedItem.status !== "revisi";
    return (
      <PageWrapper
        title="Detail Surat Tugas"
        breadcrumbs={[
          { label: "Pengajuan" },
          { label: "Periode Ajuan", path: "/admin/surat-tugas" },
          { label: selectedPeriode?.tahunAjaran || "", path: "/admin/surat-tugas" },
          { label: selectedItem.id },
        ]}
        actions={
          <button
            onClick={() => setViewMode("daftar")}
            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
          >
            <ChevronLeft className="w-4 h-4" /> Kembali
          </button>
        }
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Stepper */}
            <StepperStatus module="surat-tugas" currentStatus={selectedItem.status} />

            {/* Info Kegiatan */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <span className="text-xs text-slate-400" style={{ fontWeight: 500 }}>{selectedItem.id}</span>
                  <h3 className="text-lg text-slate-900 mt-1" style={{ fontWeight: 600 }}>{selectedItem.judulKegiatan}</h3>
                </div>
                <StatusBadge status={selectedItem.status} size="md" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Jenis Kegiatan", value: selectedItem.jenisKegiatan },
                  { label: "Sumber Dana", value: selectedItem.sumberDana },
                  { label: "Peran Anda", value: selectedItem.peranAnda },
                  { label: "Lokasi", value: selectedItem.lokasiKegiatan },
                  { label: "Tanggal Mulai", value: formatDate(selectedItem.tanggalMulai) },
                  { label: "Tanggal Selesai", value: formatDate(selectedItem.tanggalSelesai) },
                ].map((f) => (
                  <div key={f.label}>
                    <p className="text-xs text-slate-400 mb-1" style={{ fontWeight: 500 }}>{f.label}</p>
                    <p className="text-sm text-slate-800" style={{ fontWeight: 500 }}>{f.value || "-"}</p>
                  </div>
                ))}
              </div>
              {selectedItem.keterangan && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-xs text-slate-400 mb-1" style={{ fontWeight: 500 }}>Keterangan</p>
                  <p className="text-sm text-slate-700">{selectedItem.keterangan}</p>
                </div>
              )}
            </div>

            {/* Dokumen Pendukung */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <LinkIcon className="w-4 h-4 text-slate-500" />
                <h4 className="text-sm text-slate-800" style={{ fontWeight: 600 }}>Dokumen Pendukung</h4>
              </div>
              <div className="space-y-3">
                {[
                  { label: "URL Bukti Undangan", value: selectedItem.urlBuktiUndangan },
                  { label: "URL Proposal", value: selectedItem.urlProposal },
                  { label: "URL Kontrak", value: selectedItem.urlKontrak },
                ].map((doc) => (
                  <div key={doc.label} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                    <span className="text-sm text-slate-600">{doc.label}</span>
                    {doc.value ? (
                      <a href={doc.value} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
                        Lihat <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-sm text-slate-400">-</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Tim Pradita */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-4 h-4 text-slate-500" />
                <h4 className="text-sm text-slate-800" style={{ fontWeight: 600 }}>Tim Pradita</h4>
              </div>
              {selectedItem.timPradita.length > 0 ? (
                <div className="space-y-2">
                  {selectedItem.timPradita.map((m) => (
                    <div key={m.id} className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-lg">
                      <span className="text-sm text-slate-700" style={{ fontWeight: 500 }}>{m.nama}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${m.peran === "Ketua" ? "bg-blue-50 text-blue-700" : "bg-gray-100 text-gray-600"}`} style={{ fontWeight: 500 }}>
                        {m.peran}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400">Belum ada anggota</p>
              )}
            </div>

            {/* Anggota Mahasiswa / Eksternal */}
            {selectedItem.anggotaEksternal.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-4 h-4 text-slate-500" />
                  <h4 className="text-sm text-slate-800" style={{ fontWeight: 600 }}>Anggota Mahasiswa / Eksternal</h4>
                </div>
                <div className="space-y-2">
                  {selectedItem.anggotaEksternal.map((m) => (
                    <div key={m.id} className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-lg">
                      <div>
                        <span className="text-sm text-slate-700" style={{ fontWeight: 500 }}>{m.nama}</span>
                        <span className="text-xs text-slate-400 ml-2">({m.afiliasi})</span>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600" style={{ fontWeight: 500 }}>
                        {m.peran}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Timeline */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h4 className="text-sm text-slate-800 mb-4" style={{ fontWeight: 600 }}>Riwayat Status</h4>
              <div className="space-y-4">
                {[
                  { status: "Draft dibuat", by: user?.name || "-", date: selectedItem.tanggalDibuat, color: "bg-gray-400" },
                  ...(selectedItem.status !== "draft"
                    ? [{ status: "Submitted untuk review", by: user?.name || "-", date: selectedItem.tanggalDibuat, color: "bg-blue-500" }]
                    : []),
                  ...(["approved", "verified", "hutang", "lunas"].includes(selectedItem.status)
                    ? [{ status: "Approved oleh Ketua LPPM", by: "Ketua LPPM", date: selectedItem.tanggalDibuat, color: "bg-green-500" }]
                    : []),
                  ...(selectedItem.status === "rejected"
                    ? [{ status: "Ditolak", by: "Ketua LPPM", date: selectedItem.tanggalDibuat, color: "bg-red-500" }]
                    : []),
                  ...(selectedItem.status === "revisi"
                    ? [{ status: "Revisi diminta", by: "Ketua LPPM", date: selectedItem.tanggalDibuat, color: "bg-orange-500" }]
                    : []),
                ].map((log, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-2.5 h-2.5 rounded-full ${log.color} shrink-0 mt-1.5`} />
                      <div className="w-px flex-1 bg-slate-200 mt-1" />
                    </div>
                    <div className="pb-4">
                      <p className="text-sm text-slate-700" style={{ fontWeight: 500 }}>{log.status}</p>
                      <p className="text-xs text-slate-400">{log.by} &middot; {log.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Actions */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h4 className="text-sm text-slate-800 mb-3" style={{ fontWeight: 600 }}>Aksi</h4>
              <div className="space-y-2">
                {selectedItem.status === "draft" && canCreate && (
                  <>
                    <button
                      onClick={() =>
                        setConfirmModal({
                          open: true,
                          title: "Submit Surat Tugas?",
                          message: "Surat tugas akan dikirim untuk persetujuan Ketua LPPM.",
                          variant: "warning",
                          onConfirm: () => handleStatusChange(selectedItem.id, "submitted"),
                        })
                      }
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                      style={{ fontWeight: 500 }}
                    >
                      <Send className="w-4 h-4" /> Submit
                    </button>
                    <button
                      onClick={() => {
                        setEditingItem(selectedItem);
                        setFormData({ ...selectedItem });
                        setFormErrors({});
                        setViewMode("form");
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200"
                      style={{ fontWeight: 500 }}
                    >
                      <Edit className="w-4 h-4" /> Edit
                    </button>
                    <button
                      onClick={() =>
                        setConfirmModal({
                          open: true,
                          title: "Hapus Surat Tugas?",
                          message: "Data surat tugas ini akan dihapus permanen.",
                          variant: "danger",
                          onConfirm: () => {
                            handleDelete(selectedItem.id);
                            setViewMode("daftar");
                          },
                        })
                      }
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
                      style={{ fontWeight: 500 }}
                    >
                      <Trash2 className="w-4 h-4" /> Hapus
                    </button>
                  </>
                )}
                {selectedItem.status === "revisi" && canCreate && (
                  <>
                    <button
                      onClick={() => {
                        setEditingItem(selectedItem);
                        setFormData({ ...selectedItem });
                        setFormErrors({});
                        setViewMode("form");
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                      style={{ fontWeight: 500 }}
                    >
                      <Edit className="w-4 h-4" /> Edit & Revisi
                    </button>
                    <button
                      onClick={() =>
                        setConfirmModal({
                          open: true,
                          title: "Submit Ulang?",
                          message: "Revisi akan dikirim kembali untuk review.",
                          variant: "warning",
                          onConfirm: () => handleStatusChange(selectedItem.id, "submitted"),
                        })
                      }
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200"
                      style={{ fontWeight: 500 }}
                    >
                      <RotateCcw className="w-4 h-4" /> Submit Ulang
                    </button>
                  </>
                )}
                {selectedItem.status === "submitted" && canApprove && (
                  <>
                    <button
                      onClick={() =>
                        setConfirmModal({
                          open: true,
                          title: "Approve Surat Tugas?",
                          message: "Surat tugas akan disetujui.",
                          variant: "success",
                          onConfirm: () => handleStatusChange(selectedItem.id, "approved"),
                        })
                      }
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700"
                      style={{ fontWeight: 500 }}
                    >
                      <CheckCircle className="w-4 h-4" /> Approve
                    </button>
                    <button
                      onClick={() => handleStatusChange(selectedItem.id, "revisi")}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100"
                      style={{ fontWeight: 500 }}
                    >
                      <RotateCcw className="w-4 h-4" /> Minta Revisi
                    </button>
                    <button
                      onClick={() =>
                        setConfirmModal({
                          open: true,
                          title: "Tolak Surat Tugas?",
                          message: "Surat tugas akan ditolak.",
                          variant: "danger",
                          onConfirm: () => handleStatusChange(selectedItem.id, "rejected"),
                        })
                      }
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
                      style={{ fontWeight: 500 }}
                    >
                      <XCircle className="w-4 h-4" /> Tolak
                    </button>
                  </>
                )}
                {selectedItem.status === "rejected" && canCreate && (
                  <button
                    onClick={() => {
                      setEditingItem(selectedItem);
                      setFormData({ ...selectedItem });
                      setFormErrors({});
                      setViewMode("form");
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                    style={{ fontWeight: 500 }}
                  >
                    <Edit className="w-4 h-4" /> Revisi & Submit Ulang
                  </button>
                )}
                {isReadOnly && selectedItem.status === "approved" && (
                  <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200" style={{ fontWeight: 500 }}>
                    <Download className="w-4 h-4" /> Download PDF
                  </button>
                )}
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-5">
              <h4 className="text-sm text-slate-800 mb-3" style={{ fontWeight: 600 }}>Informasi</h4>
              <div className="space-y-2">
                {[
                  { label: "Dibuat", value: formatDate(selectedItem.tanggalDibuat) },
                  { label: "Periode", value: selectedPeriode ? `${selectedPeriode.tahunAjaran} (${selectedPeriode.semester})` : "-" },
                  { label: "Tim Internal", value: `${selectedItem.timPradita.length} orang` },
                  { label: "Tim Eksternal", value: `${selectedItem.anggotaEksternal.length} orang` },
                ].map((i) => (
                  <div key={i.label} className="flex justify-between">
                    <span className="text-xs text-slate-500">{i.label}</span>
                    <span className="text-xs text-slate-700" style={{ fontWeight: 500 }}>{i.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <ConfirmModal {...confirmModal} onClose={() => setConfirmModal((p) => ({ ...p, open: false }))} />
      </PageWrapper>
    );
  }

  /* ═══════════════════════════════════════════
     VIEW 3: FORM TAMBAH/EDIT SURAT TUGAS
     ═══════════════════════════════════════════ */

  if (viewMode === "form") {
    const addTimPradita = () => {
      setFormData((p) => ({
        ...p,
        timPradita: [...p.timPradita, { id: crypto.randomUUID(), nama: "", peran: "Anggota" }],
      }));
    };

    const removeTimPradita = (id: string) => {
      setFormData((p) => ({ ...p, timPradita: p.timPradita.filter((m) => m.id !== id) }));
    };

    const updateTimPradita = (id: string, field: keyof TeamMember, value: string) => {
      setFormData((p) => ({
        ...p,
        timPradita: p.timPradita.map((m) => (m.id === id ? { ...m, [field]: value } : m)),
      }));
    };

    const addEksternal = () => {
      setFormData((p) => ({
        ...p,
        anggotaEksternal: [...p.anggotaEksternal, { id: crypto.randomUUID(), nama: "", afiliasi: "", peran: "Anggota" }],
      }));
    };

    const removeEksternal = (id: string) => {
      setFormData((p) => ({ ...p, anggotaEksternal: p.anggotaEksternal.filter((m) => m.id !== id) }));
    };

    const updateEksternal = (id: string, field: keyof ExternalMember, value: string) => {
      setFormData((p) => ({
        ...p,
        anggotaEksternal: p.anggotaEksternal.map((m) => (m.id === id ? { ...m, [field]: value } : m)),
      }));
    };

    return (
      <PageWrapper
        title={editingItem ? "Edit Surat Tugas" : "Tambah Surat Tugas"}
        breadcrumbs={[
          { label: "Pengajuan" },
          { label: "Periode Ajuan", path: "/admin/surat-tugas" },
          { label: selectedPeriode?.tahunAjaran || "" },
          { label: editingItem ? "Edit" : "Tambah" },
        ]}
      >
        <div className="max-w-4xl space-y-6">
          {/* Informasi Kegiatan */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-sm text-slate-900 mb-5" style={{ fontWeight: 600 }}>Informasi Kegiatan</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField label="Jenis Kegiatan" required error={formErrors.jenisKegiatan}>
                <select
                  value={formData.jenisKegiatan}
                  onChange={(e) => setFormData((p) => ({ ...p, jenisKegiatan: e.target.value }))}
                  className={inputClass(!!formErrors.jenisKegiatan)}
                >
                  <option value="">Pilih jenis kegiatan</option>
                  {["PKM", "Konferensi", "Hibah", "Lainnya"].map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </FormField>

              <FormField label="Tanggal Mulai" required error={formErrors.tanggalMulai}>
                <input
                  type="date"
                  value={formData.tanggalMulai}
                  onChange={(e) => setFormData((p) => ({ ...p, tanggalMulai: e.target.value }))}
                  className={inputClass(!!formErrors.tanggalMulai)}
                />
              </FormField>

              <FormField label="Sumber Dana" required error={formErrors.sumberDana}>
                <select
                  value={formData.sumberDana}
                  onChange={(e) => setFormData((p) => ({ ...p, sumberDana: e.target.value }))}
                  className={inputClass(!!formErrors.sumberDana)}
                >
                  <option value="">Pilih sumber dana</option>
                  {["Mandiri", "Institusi", "Eksternal"].map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </FormField>

              <FormField label="Tanggal Selesai" required error={formErrors.tanggalSelesai}>
                <input
                  type="date"
                  value={formData.tanggalSelesai}
                  onChange={(e) => setFormData((p) => ({ ...p, tanggalSelesai: e.target.value }))}
                  className={inputClass(!!formErrors.tanggalSelesai)}
                />
              </FormField>

              <FormField label="Peran Anda" required error={formErrors.peranAnda}>
                <select
                  value={formData.peranAnda}
                  onChange={(e) => setFormData((p) => ({ ...p, peranAnda: e.target.value }))}
                  className={inputClass(!!formErrors.peranAnda)}
                >
                  <option value="">Pilih peran</option>
                  {["Ketua", "Anggota"].map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </FormField>

              <div /> {/* spacer for grid alignment */}

              <div className="sm:col-span-2">
                <FormField label="Judul Kegiatan" required error={formErrors.judulKegiatan}>
                  <input
                    type="text"
                    value={formData.judulKegiatan}
                    onChange={(e) => setFormData((p) => ({ ...p, judulKegiatan: e.target.value }))}
                    placeholder="Masukkan judul kegiatan"
                    className={inputClass(!!formErrors.judulKegiatan)}
                  />
                </FormField>
              </div>

              <FormField label="Keterangan">
                <textarea
                  value={formData.keterangan}
                  onChange={(e) => setFormData((p) => ({ ...p, keterangan: e.target.value }))}
                  placeholder="Keterangan tambahan (opsional)"
                  rows={3}
                  className={inputClass()}
                />
              </FormField>

              <div /> {/* spacer */}

              <div className="sm:col-span-2">
                <FormField label="Lokasi Kegiatan" required error={formErrors.lokasiKegiatan}>
                  <textarea
                    value={formData.lokasiKegiatan}
                    onChange={(e) => setFormData((p) => ({ ...p, lokasiKegiatan: e.target.value }))}
                    placeholder="Masukkan lokasi kegiatan"
                    rows={2}
                    className={inputClass(!!formErrors.lokasiKegiatan)}
                  />
                </FormField>
              </div>
            </div>
          </div>

          {/* Dokumen Pendukung */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-sm text-slate-900 mb-5" style={{ fontWeight: 600 }}>Dokumen Pendukung (URL)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField label="URL Bukti Undangan" error={formErrors.urlBuktiUndangan}>
                <input
                  type="url"
                  value={formData.urlBuktiUndangan}
                  onChange={(e) => setFormData((p) => ({ ...p, urlBuktiUndangan: e.target.value }))}
                  placeholder="https://..."
                  className={inputClass(!!formErrors.urlBuktiUndangan)}
                />
              </FormField>
              <FormField label="URL Proposal" error={formErrors.urlProposal}>
                <input
                  type="url"
                  value={formData.urlProposal}
                  onChange={(e) => setFormData((p) => ({ ...p, urlProposal: e.target.value }))}
                  placeholder="https://..."
                  className={inputClass(!!formErrors.urlProposal)}
                />
              </FormField>
              <FormField label="URL Kontrak" error={formErrors.urlKontrak}>
                <input
                  type="url"
                  value={formData.urlKontrak}
                  onChange={(e) => setFormData((p) => ({ ...p, urlKontrak: e.target.value }))}
                  placeholder="https://..."
                  className={inputClass(!!formErrors.urlKontrak)}
                />
              </FormField>
            </div>
          </div>

          {/* Tim Pradita */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm text-slate-900" style={{ fontWeight: 600 }}>Tim Pradita</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left text-xs text-slate-500 py-2 pr-3" style={{ fontWeight: 600 }}>Nama</th>
                    <th className="text-left text-xs text-slate-500 py-2 pr-3 w-40" style={{ fontWeight: 600 }}>Peran</th>
                    <th className="text-left text-xs text-slate-500 py-2 w-12" style={{ fontWeight: 600 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {formData.timPradita.map((member) => (
                    <tr key={member.id} className="border-b border-slate-50">
                      <td className="py-2.5 pr-3">
                        <select
                          value={member.nama}
                          onChange={(e) => updateTimPradita(member.id, "nama", e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-[#E30613]/20"
                        >
                          <option value="">Pilih dosen</option>
                          {MOCK_DOSEN.map((d) => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-2.5 pr-3">
                        <select
                          value={member.peran}
                          onChange={(e) => updateTimPradita(member.id, "peran", e.target.value as "Ketua" | "Anggota")}
                          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-[#E30613]/20"
                        >
                          <option value="Ketua">Ketua</option>
                          <option value="Anggota">Anggota</option>
                        </select>
                      </td>
                      <td className="py-2.5">
                        {formData.timPradita.length > 1 && (
                          <button onClick={() => removeTimPradita(member.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              type="button"
              onClick={addTimPradita}
              className="mt-3 flex items-center gap-1.5 px-3 py-2 text-sm text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              style={{ fontWeight: 500 }}
            >
              <Plus className="w-4 h-4" /> Tambah Anggota
            </button>
          </div>

          {/* Anggota Mahasiswa / Eksternal */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm text-slate-900" style={{ fontWeight: 600 }}>Anggota Mahasiswa / Eksternal</h3>
            </div>
            {formData.anggotaEksternal.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left text-xs text-slate-500 py-2 pr-3" style={{ fontWeight: 600 }}>Nama</th>
                      <th className="text-left text-xs text-slate-500 py-2 pr-3" style={{ fontWeight: 600 }}>Afiliasi</th>
                      <th className="text-left text-xs text-slate-500 py-2 pr-3 w-32" style={{ fontWeight: 600 }}>Peran</th>
                      <th className="w-12"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.anggotaEksternal.map((member) => (
                      <tr key={member.id} className="border-b border-slate-50">
                        <td className="py-2.5 pr-3">
                          <input
                            type="text"
                            value={member.nama}
                            onChange={(e) => updateEksternal(member.id, "nama", e.target.value)}
                            placeholder="Nama"
                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-[#E30613]/20 placeholder:text-slate-400"
                          />
                        </td>
                        <td className="py-2.5 pr-3">
                          <input
                            type="text"
                            value={member.afiliasi}
                            onChange={(e) => updateEksternal(member.id, "afiliasi", e.target.value)}
                            placeholder="Afiliasi"
                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-[#E30613]/20 placeholder:text-slate-400"
                          />
                        </td>
                        <td className="py-2.5 pr-3">
                          <select
                            value={member.peran}
                            onChange={(e) => updateEksternal(member.id, "peran", e.target.value as "Ketua" | "Anggota")}
                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-[#E30613]/20"
                          >
                            <option value="Ketua">Ketua</option>
                            <option value="Anggota">Anggota</option>
                          </select>
                        </td>
                        <td className="py-2.5">
                          <button onClick={() => removeEksternal(member.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-slate-400 mb-3">Belum ada anggota eksternal</p>
            )}
            <button
              type="button"
              onClick={addEksternal}
              className="mt-3 flex items-center gap-1.5 px-3 py-2 text-sm text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              style={{ fontWeight: 500 }}
            >
              <Plus className="w-4 h-4" /> Tambah Anggota Eksternal
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between bg-white rounded-xl border border-slate-200 px-6 py-4">
            <button
              type="button"
              onClick={() => {
                setEditingItem(null);
                setViewMode("daftar");
              }}
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              style={{ fontWeight: 500 }}
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                style={{ fontWeight: 500 }}
              >
                <RotateCcw className="w-4 h-4" /> Reset
              </button>
              <button
                type="button"
                onClick={() => handleSave(false)}
                className="flex items-center gap-2 px-5 py-2.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                style={{ fontWeight: 500 }}
              >
                <Download className="w-4 h-4" /> Draft
              </button>
              <button
                type="button"
                onClick={() =>
                  setConfirmModal({
                    open: true,
                    title: "Submit Surat Tugas?",
                    message: "Surat tugas akan langsung dikirim untuk persetujuan. Pastikan semua data sudah benar.",
                    variant: "warning",
                    onConfirm: () => handleSave(true),
                  })
                }
                className="flex items-center gap-2 px-5 py-2.5 text-sm text-white bg-[#E30613] rounded-lg hover:bg-[#c00510] transition-colors"
                style={{ fontWeight: 500 }}
              >
                <Send className="w-4 h-4" /> Submit
              </button>
            </div>
          </div>
        </div>
        <ConfirmModal {...confirmModal} onClose={() => setConfirmModal((p) => ({ ...p, open: false }))} />
      </PageWrapper>
    );
  }

  /* ═══════════════════════════════════════════
     VIEW 2: DAFTAR SURAT TUGAS (per Periode)
     ═══════════════════════════════════════════ */

  if (viewMode === "daftar" && selectedPeriode) {
    return (
      <PageWrapper
        title="Daftar Surat Tugas"
        subtitle={`Periode ${selectedPeriode.tahunAjaran} — Semester ${selectedPeriode.semester}`}
        breadcrumbs={[
          { label: "Pengajuan" },
          { label: "Periode Ajuan", path: "/admin/surat-tugas" },
          { label: `${selectedPeriode.tahunAjaran} (${selectedPeriode.semester})` },
        ]}
        actions={
          <div className="flex items-center gap-2">
            {canCreate && selectedPeriode.aktif && (
              <button
                onClick={() => {
                  setEditingItem(null);
                  setFormData(emptyForm());
                  setFormErrors({});
                  setViewMode("form");
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700 transition-all active:scale-95"
                style={{ fontWeight: 500 }}
              >
                <Plus className="w-4 h-4" /> Tambah
              </button>
            )}
            <button
              onClick={() => {
                setSelectedPeriode(null);
                setViewMode("periode");
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
            >
              <ChevronLeft className="w-4 h-4" /> Kembali
            </button>
          </div>
        }
      >
        {!selectedPeriode.aktif && (
          <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Periode ini sudah ditutup. Anda tidak dapat menambah pengajuan baru, namun masih bisa melihat data yang ada.</span>
          </div>
        )}

        {loading ? (
          <SkeletonTable rows={5} />
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            {/* Search & Filter */}
            <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <span>Show</span>
                <select className="px-2 py-1 border border-slate-200 rounded text-sm bg-white">
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                </select>
                <span>entries</span>
              </div>
              <div className="flex-1" />
              <div className="flex items-center gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                  className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-600"
                >
                  <option value="all">Semua Status</option>
                  {["draft", "submitted", "revisi", "approved", "rejected"].map((s) => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
                <div className="relative">
                  <span className="text-sm text-slate-600 mr-2">Search:</span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    className="px-3 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-[#E30613]/20"
                  />
                </div>
              </div>
            </div>

            {/* Table */}
            {paginated.length === 0 ? (
              <div className="px-5 py-16">
                <EmptyState
                  variant={searchQuery || statusFilter !== "all" ? "no-results" : "no-data"}
                  title={searchQuery || statusFilter !== "all" ? undefined : "No data available in table"}
                  onAction={() => { setSearchQuery(""); setStatusFilter("all"); }}
                  actionLabel="Reset Filter"
                />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/50">
                      {["Kegiatan", "Tanggal", "Status", "Aksi"].map((h) => (
                        <th key={h} className="px-5 py-3 text-left text-xs text-slate-600 whitespace-nowrap" style={{ fontWeight: 600 }}>
                          {h}
                          <span className="inline-block ml-1 text-slate-300">⇅</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {paginated.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-3.5">
                          <button
                            onClick={() => { setSelectedItem(item); setViewMode("detail"); }}
                            className="text-sm text-slate-800 hover:text-[#E30613] transition-colors text-left"
                            style={{ fontWeight: 500 }}
                          >
                            {item.judulKegiatan}
                          </button>
                          <p className="text-xs text-slate-400 mt-0.5">{item.jenisKegiatan} — {item.sumberDana}</p>
                        </td>
                        <td className="px-5 py-3.5 text-sm text-slate-600 whitespace-nowrap">
                          {formatDate(item.tanggalMulai).replace(/^[^,]+,\s*/, "")}
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <StatusBadge status={item.status} />
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => { setSelectedItem(item); setViewMode("detail"); }}
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                              title="Detail"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {item.status === "draft" && canCreate && (
                              <button
                                onClick={() => {
                                  setEditingItem(item);
                                  setFormData({ ...item });
                                  setFormErrors({});
                                  setViewMode("form");
                                }}
                                className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
              <p className="text-xs text-slate-500">
                Showing {filtered.length === 0 ? 0 : (currentPage - 1) * perPage + 1} to {Math.min(currentPage * perPage, filtered.length)} of {filtered.length} entries
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-xs text-slate-600 border border-slate-200 rounded-md disabled:opacity-40 hover:bg-slate-50"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 text-xs rounded-md ${
                      currentPage === i + 1
                        ? "bg-blue-500 text-white"
                        : "text-slate-600 border border-slate-200 hover:bg-slate-50"
                    }`}
                    style={{ fontWeight: 500 }}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-xs text-slate-600 border border-slate-200 rounded-md disabled:opacity-40 hover:bg-slate-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast */}
        {toast.show && (
          <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg border ${
            toast.type === "success" ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"
          }`}>
            {toast.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span className="text-sm" style={{ fontWeight: 500 }}>{toast.message}</span>
          </div>
        )}
        <ConfirmModal {...confirmModal} onClose={() => setConfirmModal((p) => ({ ...p, open: false }))} />
      </PageWrapper>
    );
  }

  /* ═══════════════════════════════════════════
     VIEW 1: PERIODE AJUAN SURAT TUGAS
     ═══════════════════════════════════════════ */

  return (
    <PageWrapper
      title="Periode Ajuan Surat Tugas"
      subtitle="Pilih periode untuk mengajukan surat tugas"
      breadcrumbs={[{ label: "Pengajuan" }, { label: "Surat Tugas" }]}
    >
      {loading ? (
        <SkeletonTable rows={3} />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {/* Header controls */}
          <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span>Show</span>
              <select className="px-2 py-1 border border-slate-200 rounded text-sm bg-white">
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
              <span>entries</span>
            </div>
            <div className="flex-1" />
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">Search:</span>
              <input
                type="text"
                className="px-3 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-[#E30613]/20"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50">
                  {["Tahun Ajaran", "Semester", "Waktu Pengajuan", "Laporan"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs text-slate-600 whitespace-nowrap" style={{ fontWeight: 600 }}>
                      {h}
                      <span className="inline-block ml-1 text-slate-300">⇅</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {MOCK_PERIODE.map((periode) => (
                  <tr key={periode.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5 text-sm text-slate-800" style={{ fontWeight: 500 }}>
                      {periode.tahunAjaran}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-600 capitalize">
                      {periode.semester}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-600">
                      {formatDateRange(periode.waktuMulai, periode.waktuSelesai)}
                    </td>
                    <td className="px-5 py-3.5">
                      {periode.aktif ? (
                        <button
                          onClick={() => {
                            setSelectedPeriode(periode);
                            setSearchQuery("");
                            setStatusFilter("all");
                            setCurrentPage(1);
                            setViewMode("daftar");
                          }}
                          className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                          style={{ fontWeight: 500 }}
                        >
                          Ajukan Surat Tugas
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedPeriode(periode);
                            setSearchQuery("");
                            setStatusFilter("all");
                            setCurrentPage(1);
                            setViewMode("daftar");
                          }}
                          className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          Lihat Data
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs text-slate-500">Showing 1 to {MOCK_PERIODE.length} of {MOCK_PERIODE.length} entries</p>
            <div className="flex items-center gap-1">
              <button className="px-3 py-1.5 text-xs text-slate-600 border border-slate-200 rounded-md opacity-40" disabled>Previous</button>
              <button className="w-8 h-8 text-xs rounded-md bg-blue-500 text-white" style={{ fontWeight: 500 }}>1</button>
              <button className="px-3 py-1.5 text-xs text-slate-600 border border-slate-200 rounded-md opacity-40" disabled>Next</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast.show && (
        <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg border ${
          toast.type === "success" ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"
        }`}>
          {toast.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span className="text-sm" style={{ fontWeight: 500 }}>{toast.message}</span>
        </div>
      )}
    </PageWrapper>
  );
}
