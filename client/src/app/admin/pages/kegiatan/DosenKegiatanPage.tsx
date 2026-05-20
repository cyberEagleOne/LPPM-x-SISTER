import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Plus, Search, Eye, Edit, Trash2, Send, CheckCircle,
  ChevronLeft, ChevronRight, RotateCcw, Download, Activity,
  AlertCircle, ExternalLink, Users, Building2, FileText
} from "lucide-react";
import { PageWrapper } from "../../components/PageWrapper";
import { StatusBadge, type StatusType } from "../../components/StatusBadge";
import { EmptyState } from "../../components/EmptyState";
import { ConfirmModal } from "../../components/ConfirmModal";
import { SkeletonTable } from "../../components/SkeletonLoader";
import { StepperStatus } from "../../components/StepperStatus";
import { useAuth } from "../../context/AuthContext";
import type { DetailPenelitian, Penelitian } from "../../../../../../shared/models";

type JenisKegiatan = "penelitian" | "pkm";
type ViewMode = "periode" | "list" | "form" | "detail";

interface PeriodeKegiatan {
  id: string;
  tahun: string;
  semester: string;
  aktif: boolean;
}

interface PenelitianKegiatanItem extends DetailPenelitian {
  periodeId: string;
  jenis: "penelitian";
  status: StatusType;
  tanggalDibuat: string;
  id_users?: string;
}

type PenelitianForm = Omit<DetailPenelitian, "created_at" | "updated_at" | "anggota" | "mitra_litabmas" | "dokumen"> & {
  id_users?: string;
};

const JENIS_LABELS: Record<JenisKegiatan, string> = {
  penelitian: "Kegiatan Penelitian",
  pkm: "Kegiatan PKM",
};

const JENIS_COLORS: Record<JenisKegiatan, string> = {
  penelitian: "bg-blue-100 text-blue-700",
  pkm: "bg-green-100 text-green-700",
};

const API_BASE = "http://localhost:3000/api/sdm";

const inputClass = (hasError?: boolean) =>
  `w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all bg-slate-50/50 placeholder:text-slate-400 ${
    hasError ? "border-red-300 focus:ring-red-200" : "border-slate-200 focus:ring-[#E30613]/20 focus:border-[#E30613]/40"
  }`;

const FormField = ({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: ReactNode }) => (
  <div>
    <label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 500 }}>
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {error && <p className="flex items-center gap-1 text-xs text-red-500 mt-1"><AlertCircle className="w-3 h-3" /> {error}</p>}
  </div>
);

const formatTanggalIndo = (value?: string | Date | null) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

const formatMoney = (value?: string | null) => {
  if (!value) return "-";
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue)) return value;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(numberValue);
};

const textValue = (value?: string | number | null) => (value === null || value === undefined || value === "" ? "-" : String(value));

const getPeriodeId = (item: Pick<DetailPenelitian, "tahun_pelaksanaan" | "tahun_kegiatan" | "tahun_usulan">) => {
  const year = item.tahun_pelaksanaan || item.tahun_kegiatan || item.tahun_usulan;
  return year ? `PEN-${year}` : "UNKNOWN-PERIODE";
};

const emptyDetail = (selectedPeriode?: PeriodeKegiatan | null, userId?: string): PenelitianForm => {
  const periodeYear = selectedPeriode?.id.startsWith("PEN-") ? Number(selectedPeriode.id.replace("PEN-", "")) : null;

  return {
    id: "",
    id_kategori_kegiatan: null,
    judul: "",
    id_afiliasi: null,
    afiliasi: "",
    id_kelompok_bidang: null,
    kelompok_bidang: "",
    id_litabmas_sebelumnya: null,
    litabmas_sebelumnya: "",
    id_jenis_skim: null,
    jenis_skim: "",
    lokasi: "",
    tahun_usulan: periodeYear,
    tahun_kegiatan: periodeYear,
    tahun_pelaksanaan: periodeYear,
    lama_kegiatan: null,
    tahun_pelaksanaan_ke: null,
    dana_dikti: null,
    dana_perguruan_tinggi: null,
    dana_institusi_lain: null,
    in_kind: "",
    sk_penugasan: "",
    tanggal_sk_penugasan: "",
    id_users: userId,
  };
};

const mapApiItem = (item: Penelitian & { detail_penelitian?: DetailPenelitian | null; status?: StatusType; tanggalDibuat?: string | Date | null }): PenelitianKegiatanItem => {
  const detail = item.detail_penelitian;
  const merged: DetailPenelitian = {
    id: item.id,
    id_kategori_kegiatan: detail?.id_kategori_kegiatan ?? null,
    judul: detail?.judul || item.judul || "",
    id_afiliasi: detail?.id_afiliasi ?? null,
    afiliasi: detail?.afiliasi ?? null,
    id_kelompok_bidang: detail?.id_kelompok_bidang ?? null,
    kelompok_bidang: detail?.kelompok_bidang ?? null,
    id_litabmas_sebelumnya: detail?.id_litabmas_sebelumnya ?? null,
    litabmas_sebelumnya: detail?.litabmas_sebelumnya ?? null,
    id_jenis_skim: detail?.id_jenis_skim ?? null,
    jenis_skim: detail?.jenis_skim ?? null,
    lokasi: detail?.lokasi ?? null,
    tahun_usulan: detail?.tahun_usulan ?? null,
    tahun_kegiatan: detail?.tahun_kegiatan ?? null,
    tahun_pelaksanaan: detail?.tahun_pelaksanaan ?? item.tahun_pelaksanaan ?? null,
    lama_kegiatan: detail?.lama_kegiatan ?? item.lama_kegiatan ?? null,
    tahun_pelaksanaan_ke: detail?.tahun_pelaksanaan_ke ?? null,
    dana_dikti: detail?.dana_dikti ?? null,
    dana_perguruan_tinggi: detail?.dana_perguruan_tinggi ?? null,
    dana_institusi_lain: detail?.dana_institusi_lain ?? null,
    in_kind: detail?.in_kind ?? null,
    sk_penugasan: detail?.sk_penugasan ?? null,
    tanggal_sk_penugasan: detail?.tanggal_sk_penugasan ?? null,
    anggota: detail?.anggota || [],
    mitra_litabmas: detail?.mitra_litabmas || [],
    dokumen: detail?.dokumen || [],
    created_at: detail?.created_at,
    updated_at: detail?.updated_at,
  };

  return {
    ...merged,
    periodeId: getPeriodeId(merged),
    jenis: "penelitian",
    status: item.status || "approved",
    tanggalDibuat: formatTanggalIndo(item.tanggalDibuat || merged.created_at || null),
    id_users: item.id_users,
  };
};

const buildPeriodeList = (items: PenelitianKegiatanItem[]) => {
  const years = Array.from(new Set(items.map((item) => item.tahun_pelaksanaan || item.tahun_kegiatan || item.tahun_usulan).filter(Boolean))) as number[];
  const currentYear = new Date().getFullYear();
  const allYears = Array.from(new Set([currentYear, ...years])).sort((a, b) => b - a);

  return [
    ...allYears.map((year, index) => ({
      id: `PEN-${year}`,
      tahun: String(year),
      semester: "Penelitian",
      aktif: index === 0,
    })),
    { id: "UNKNOWN-PERIODE", tahun: "Tidak Diketahui", semester: "Penelitian", aktif: false },
  ];
};

export function DosenKegiatanPage({ jenisParam = "penelitian" }: { jenisParam?: JenisKegiatan }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("periode");
  const [selectedPeriode, setSelectedPeriode] = useState<PeriodeKegiatan | null>(null);
  const [selectedItem, setSelectedItem] = useState<PenelitianKegiatanItem | null>(null);
  const [editingItem, setEditingItem] = useState<PenelitianKegiatanItem | null>(null);
  const [kegiatanList, setKegiatanList] = useState<PenelitianKegiatanItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showEmptyPeriods, setShowEmptyPeriods] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmModal, setConfirmModal] = useState({ open: false, title: "", message: "", variant: "danger" as "danger" | "warning" | "success", onConfirm: () => {} });
  const [toast, setToast] = useState({ show: false, message: "", type: "success" as "success" | "error" });
  const [formData, setFormData] = useState<PenelitianForm>(() => emptyDetail(null, user?.id));
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const perPage = 8;

  const periodeList = useMemo(() => buildPeriodeList(kegiatanList), [kegiatanList]);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast((p) => ({ ...p, show: false })), 3000);
  };

  const fetchPenelitian = async () => {
    try {
      setLoading(true);
      if (!user?.id) {
        setKegiatanList([]);
        return;
      }

      const response = await fetch(`${API_BASE}/penelitian?dosen_id=${user.id}`);
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const result = await response.json();

      if (result.status === "success") {
        setKegiatanList((result.data || []).map(mapApiItem));
      } else {
        throw new Error(result.message || "Gagal mengambil data penelitian");
      }
    } catch (error: any) {
      showToast(error.message || "Gagal mengambil data penelitian", "error");
      setKegiatanList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPenelitian();
  }, [user?.id]);

  const resetForm = (item?: PenelitianKegiatanItem | null) => {
    const next = item
      ? {
          ...item,
          id_users: item.id_users || user?.id,
        }
      : emptyDetail(selectedPeriode, user?.id);

    setFormData(next);
    setFormErrors({});
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.judul.trim()) errors.judul = "Judul wajib diisi";
    if (!formData.tahun_pelaksanaan) errors.tahun_pelaksanaan = "Tahun pelaksanaan wajib diisi";
    if (!user?.id) errors.id_users = "User belum terdeteksi";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async (asSubmit: boolean) => {
    if (!validateForm()) {
      showToast("Lengkapi field yang wajib diisi", "error");
      return;
    }

    try {
      const payload = {
        ...formData,
        id_users: user?.id,
        status: asSubmit ? "submitted" : "draft",
      };
      const url = editingItem ? `${API_BASE}/penelitian/${editingItem.id}` : `${API_BASE}/penelitian`;
      const response = await fetch(url, {
        method: editingItem ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Gagal menyimpan data penelitian");
      }

      showToast(asSubmit ? "Penelitian berhasil disubmit" : "Draft penelitian disimpan");
      setEditingItem(null);
      setViewMode("list");
      await fetchPenelitian();
    } catch (error: any) {
      showToast(error.message || "Gagal menyimpan data penelitian", "error");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE}/penelitian/${id}`, { method: "DELETE" });
      const result = await response.json();

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Gagal menghapus data penelitian");
      }

      showToast("Penelitian dihapus");
      await fetchPenelitian();
    } catch (error: any) {
      showToast(error.message || "Gagal menghapus data penelitian", "error");
    }
  };

  const periodeFiltered = kegiatanList.filter((item) =>
    item.periodeId === selectedPeriode?.id && (jenisParam === "penelitian")
  );
  const filtered = periodeFiltered.filter((item) =>
    [item.judul, item.lokasi, item.jenis_skim, item.kelompok_bidang].some((value) =>
      String(value || "").toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  if (jenisParam === "pkm") {
    return (
      <PageWrapper title="Kegiatan PKM" subtitle="Modul PKM belum tersambung ke model shared pada perubahan ini"
        breadcrumbs={[{ label: "Dosen" }, { label: "Kegiatan" }, { label: "PKM" }]}>
        <EmptyState variant="no-data" />
      </PageWrapper>
    );
  }

  if (viewMode === "detail" && selectedItem) {
    const detailFields = [
      { label: "Afiliasi", value: selectedItem.afiliasi },
      { label: "Kelompok Bidang", value: selectedItem.kelompok_bidang },
      { label: "Litabmas Sebelumnya", value: selectedItem.litabmas_sebelumnya },
      { label: "Jenis Skim", value: selectedItem.jenis_skim },
      { label: "Lokasi", value: selectedItem.lokasi },
      { label: "Tahun Usulan", value: selectedItem.tahun_usulan },
      { label: "Tahun Kegiatan", value: selectedItem.tahun_kegiatan },
      { label: "Tahun Pelaksanaan", value: selectedItem.tahun_pelaksanaan },
      { label: "Lama Kegiatan", value: selectedItem.lama_kegiatan ? `${selectedItem.lama_kegiatan} tahun` : null },
      { label: "Tahun Pelaksanaan Ke", value: selectedItem.tahun_pelaksanaan_ke },
      { label: "Dana Dikti", value: formatMoney(selectedItem.dana_dikti) },
      { label: "Dana Perguruan Tinggi", value: formatMoney(selectedItem.dana_perguruan_tinggi) },
      { label: "Dana Institusi Lain", value: formatMoney(selectedItem.dana_institusi_lain) },
      { label: "SK Penugasan", value: selectedItem.sk_penugasan },
      { label: "Tanggal SK Penugasan", value: formatTanggalIndo(selectedItem.tanggal_sk_penugasan) },
    ];

    return (
      <PageWrapper title="Detail Penelitian"
        breadcrumbs={[{ label: "Dosen" }, { label: "Kegiatan", path: "/admin/laporan-kegiatan/penelitian" }, { label: selectedItem.id }]}
        actions={<button onClick={() => setViewMode("list")} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"><ChevronLeft className="w-4 h-4" /> Kembali</button>}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <StepperStatus module="surat-tugas" currentStatus={selectedItem.status} />
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full ${JENIS_COLORS.penelitian}`} style={{ fontWeight: 600 }}>Penelitian</span>
                  <h3 className="text-base text-slate-900 mt-2 leading-relaxed" style={{ fontWeight: 600 }}>{selectedItem.judul}</h3>
                </div>
                <StatusBadge status={selectedItem.status} size="md" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {detailFields.map((field) => (
                  <div key={field.label}>
                    <p className="text-xs text-slate-400 mb-0.5">{field.label}</p>
                    <p className="text-sm text-slate-800" style={{ fontWeight: 500 }}>{textValue(field.value)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h4 className="flex items-center gap-2 text-sm text-slate-800 mb-4" style={{ fontWeight: 600 }}><Users className="w-4 h-4 text-blue-600" /> Anggota Penelitian</h4>
              {(selectedItem.anggota || []).length === 0 ? <p className="text-sm text-slate-500">Belum ada anggota.</p> : (
                <div className="divide-y divide-slate-100">
                  {selectedItem.anggota?.map((anggota, index) => (
                    <div key={`${anggota.id || anggota.nama}-${index}`} className="py-3 first:pt-0 last:pb-0">
                      <p className="text-sm text-slate-800" style={{ fontWeight: 600 }}>{anggota.nama}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{anggota.jenis} - {anggota.peran || "-"}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h4 className="flex items-center gap-2 text-sm text-slate-800 mb-4" style={{ fontWeight: 600 }}><Building2 className="w-4 h-4 text-emerald-600" /> Mitra Penelitian</h4>
                {(selectedItem.mitra_litabmas || []).length === 0 ? <p className="text-sm text-slate-500">Belum ada mitra.</p> : (
                  <div className="space-y-2">
                    {selectedItem.mitra_litabmas?.map((mitra) => (
                      <div key={mitra.id} className="text-sm text-slate-700">{mitra.nama}</div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h4 className="flex items-center gap-2 text-sm text-slate-800 mb-4" style={{ fontWeight: 600 }}><FileText className="w-4 h-4 text-amber-600" /> Dokumen Penelitian</h4>
                {(selectedItem.dokumen || []).length === 0 ? <p className="text-sm text-slate-500">Belum ada dokumen.</p> : (
                  <div className="space-y-3">
                    {selectedItem.dokumen?.map((dokumen) => (
                      <div key={dokumen.id} className="border border-slate-100 rounded-lg p-3">
                        <p className="text-sm text-slate-800" style={{ fontWeight: 600 }}>{dokumen.nama}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{dokumen.jenis_dokumen || dokumen.jenis_file || "-"}</p>
                        {dokumen.tautan && <a href={dokumen.tautan} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline mt-2">Lihat Dokumen <ExternalLink className="w-3 h-3" /></a>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h4 className="text-sm text-slate-800 mb-3" style={{ fontWeight: 600 }}>Aksi</h4>
              <div className="space-y-2">
                {(selectedItem.status === "draft" || selectedItem.status === "revisi") && (
                <>
                  <button onClick={() => { setEditingItem(selectedItem); resetForm(selectedItem); setViewMode("form"); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200" style={{ fontWeight: 500 }}><Edit className="w-4 h-4" /> Edit</button>
                  <button onClick={() => setConfirmModal({ open: true, title: "Hapus?", message: "Data penelitian akan dihapus.", variant: "danger", onConfirm: () => { handleDelete(selectedItem.id); setViewMode("list"); } })} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100" style={{ fontWeight: 500 }}><Trash2 className="w-4 h-4" /> Hapus</button>
                </>
                )}
                {["approved", "verified"].includes(selectedItem.status) && (
                  <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200" style={{ fontWeight: 500 }}><Download className="w-4 h-4" /> Export PDF</button>
                )}
                {["submitted"].includes(selectedItem.status) && (
                  <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200" style={{ fontWeight: 500 }}><Download className="w-4 h-4" /> Export PDF</button>
                )}
              </div>
            </div>
          </div>
        </div>
        <ConfirmModal {...confirmModal} isOpen={confirmModal.open} onClose={() => setConfirmModal((p) => ({ ...p, open: false }))} />
        {toast.show && <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg border ${toast.type === "success" ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"}`}><CheckCircle className="w-4 h-4" /><span className="text-sm" style={{ fontWeight: 500 }}>{toast.message}</span></div>}
      </PageWrapper>
    );
  }

  if (viewMode === "form") {
    return (
      <PageWrapper
        title={editingItem ? "Edit Penelitian" : "Tambah Penelitian"}
        breadcrumbs={[{ label: "Dosen" }, { label: "Kegiatan", path: "/admin/laporan-kegiatan/penelitian" }, { label: editingItem ? "Edit" : "Buat Baru" }]}
      >
        <div className="max-w-5xl space-y-5">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-sm text-slate-900 mb-5" style={{ fontWeight: 600 }}>Informasi Penelitian</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <FormField label="Judul" required error={formErrors.judul}>
                  <input type="text" value={formData.judul} onChange={(e) => setFormData((p) => ({ ...p, judul: e.target.value }))} className={inputClass(!!formErrors.judul)} />
                </FormField>
              </div>
              <FormField label="Afiliasi">
                <input type="text" value={formData.afiliasi || ""} onChange={(e) => setFormData((p) => ({ ...p, afiliasi: e.target.value }))} className={inputClass()} />
              </FormField>
              <FormField label="Kelompok Bidang">
                <input type="text" value={formData.kelompok_bidang || ""} onChange={(e) => setFormData((p) => ({ ...p, kelompok_bidang: e.target.value }))} className={inputClass()} />
              </FormField>
              <FormField label="Litabmas Sebelumnya">
                <input type="text" value={formData.litabmas_sebelumnya || ""} onChange={(e) => setFormData((p) => ({ ...p, litabmas_sebelumnya: e.target.value }))} className={inputClass()} />
              </FormField>
              <FormField label="Jenis Skim">
                <input type="text" value={formData.jenis_skim || ""} onChange={(e) => setFormData((p) => ({ ...p, jenis_skim: e.target.value }))} className={inputClass()} />
              </FormField>
              <div className="sm:col-span-2">
                <FormField label="Lokasi">
                  <input type="text" value={formData.lokasi || ""} onChange={(e) => setFormData((p) => ({ ...p, lokasi: e.target.value }))} className={inputClass()} />
                </FormField>
              </div>
              <FormField label="Tahun Usulan">
                <input type="number" value={formData.tahun_usulan || ""} onChange={(e) => setFormData((p) => ({ ...p, tahun_usulan: e.target.value ? Number(e.target.value) : null }))} className={inputClass()} />
              </FormField>
              <FormField label="Tahun Kegiatan">
                <input type="number" value={formData.tahun_kegiatan || ""} onChange={(e) => setFormData((p) => ({ ...p, tahun_kegiatan: e.target.value ? Number(e.target.value) : null }))} className={inputClass()} />
              </FormField>
              <FormField label="Tahun Pelaksanaan" required error={formErrors.tahun_pelaksanaan}>
                <input type="number" value={formData.tahun_pelaksanaan || ""} onChange={(e) => setFormData((p) => ({ ...p, tahun_pelaksanaan: e.target.value ? Number(e.target.value) : null }))} className={inputClass(!!formErrors.tahun_pelaksanaan)} />
              </FormField>
              <FormField label="Lama Kegiatan">
                <input type="number" value={formData.lama_kegiatan || ""} onChange={(e) => setFormData((p) => ({ ...p, lama_kegiatan: e.target.value ? Number(e.target.value) : null }))} className={inputClass()} />
              </FormField>
              <FormField label="Tahun Pelaksanaan Ke">
                <input type="number" value={formData.tahun_pelaksanaan_ke || ""} onChange={(e) => setFormData((p) => ({ ...p, tahun_pelaksanaan_ke: e.target.value ? Number(e.target.value) : null }))} className={inputClass()} />
              </FormField>
              <FormField label="Dana Dikti">
                <input type="number" value={formData.dana_dikti || ""} onChange={(e) => setFormData((p) => ({ ...p, dana_dikti: e.target.value || null }))} className={inputClass()} />
              </FormField>
              <FormField label="Dana Perguruan Tinggi">
                <input type="number" value={formData.dana_perguruan_tinggi || ""} onChange={(e) => setFormData((p) => ({ ...p, dana_perguruan_tinggi: e.target.value || null }))} className={inputClass()} />
              </FormField>
              <FormField label="Dana Institusi Lain">
                <input type="number" value={formData.dana_institusi_lain || ""} onChange={(e) => setFormData((p) => ({ ...p, dana_institusi_lain: e.target.value || null }))} className={inputClass()} />
              </FormField>
              <FormField label="SK Penugasan">
                <input type="text" value={formData.sk_penugasan || ""} onChange={(e) => setFormData((p) => ({ ...p, sk_penugasan: e.target.value }))} className={inputClass()} />
              </FormField>
              <FormField label="Tanggal SK Penugasan">
                <input type="date" value={formData.tanggal_sk_penugasan || ""} onChange={(e) => setFormData((p) => ({ ...p, tanggal_sk_penugasan: e.target.value }))} className={inputClass()} />
              </FormField>
              <div className="sm:col-span-2">
                <FormField label="In Kind">
                  <textarea rows={3} value={formData.in_kind || ""} onChange={(e) => setFormData((p) => ({ ...p, in_kind: e.target.value }))} className={inputClass()} />
                </FormField>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 flex gap-3 flex-wrap">
            <button onClick={() => setViewMode("list")} className="flex items-center gap-2 px-5 py-2.5 text-sm text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200" style={{ fontWeight: 500 }}><ChevronLeft className="w-4 h-4" /> Kembali</button>
            <button onClick={() => handleSave(false)} className="flex items-center gap-2 px-5 py-2.5 text-sm text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100" style={{ fontWeight: 500 }}>Simpan Draft</button>
            <button onClick={() => handleSave(true)} className="flex items-center gap-2 px-5 py-2.5 text-sm text-white bg-[#E30613] rounded-lg hover:bg-[#c00510]" style={{ fontWeight: 500 }}><Send className="w-4 h-4" /> Submit</button>
            <button onClick={() => resetForm(editingItem)} className="flex items-center gap-2 px-5 py-2.5 text-sm text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200" style={{ fontWeight: 500 }}><RotateCcw className="w-4 h-4" /> Reset</button>
          </div>
        </div>
        {toast.show && <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg border ${toast.type === "success" ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"}`}><CheckCircle className="w-4 h-4" /><span className="text-sm" style={{ fontWeight: 500 }}>{toast.message}</span></div>}
      </PageWrapper>
    );
  }

  if (viewMode === "list" && selectedPeriode) {
    return (
      <PageWrapper
        title={`Kegiatan Penelitian - ${selectedPeriode.tahun}`}
        breadcrumbs={[{ label: "Dosen" }, { label: "Kegiatan", path: "/admin/laporan-kegiatan/penelitian" }, { label: selectedPeriode.tahun }]}
        actions={
          <div className="flex gap-2">
            <button onClick={() => setViewMode("periode")} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"><ChevronLeft className="w-4 h-4" /> Periode</button>
            {selectedPeriode.aktif && <button onClick={() => { setEditingItem(null); resetForm(null); setViewMode("form"); }} className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-[#E30613] rounded-lg hover:bg-[#c00510]" style={{ fontWeight: 500 }}><Plus className="w-4 h-4" /> Tambah</button>}
          </div>
        }
      >
        {loading ? <SkeletonTable rows={5} /> : (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} placeholder="Cari penelitian..." className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E30613]/20" />
              </div>
            </div>
            {paginated.length === 0 ? <EmptyState variant={searchQuery ? "no-results" : "no-data"} /> : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead><tr className="border-b border-slate-100">
                      {["Tahun", "Judul", "Skim", "Lokasi", "Dana Dikti", "Status", "Aksi"].map((h) => (
                        <th key={h} className="px-5 py-3 text-left text-xs text-slate-500 whitespace-nowrap" style={{ fontWeight: 600 }}>{h}</th>
                      ))}
                    </tr></thead>
                    <tbody className="divide-y divide-slate-50">
                      {paginated.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/50">
                          <td className="px-5 py-3 text-sm text-slate-500 whitespace-nowrap">{item.tahun_pelaksanaan || item.tahun_kegiatan || "-"}</td>
                          <td className="px-5 py-3">
                            <button onClick={() => { setSelectedItem(item); setViewMode("detail"); }} className="text-sm text-slate-800 hover:text-[#E30613] text-left max-w-[280px] truncate block" style={{ fontWeight: 500 }}>{item.judul}</button>
                            <p className="text-xs text-slate-400 mt-0.5 truncate">{item.kelompok_bidang || "Kelompok bidang belum diisi"}</p>
                          </td>
                          <td className="px-5 py-3"><span className={`text-xs px-2.5 py-0.5 rounded-full ${JENIS_COLORS.penelitian}`} style={{ fontWeight: 600 }}>{item.jenis_skim || "Penelitian"}</span></td>
                          <td className="px-5 py-3 text-sm text-slate-600 max-w-[170px] truncate">{item.lokasi || "-"}</td>
                          <td className="px-5 py-3 text-sm text-slate-600 whitespace-nowrap">{formatMoney(item.dana_dikti)}</td>
                          <td className="px-5 py-3"><StatusBadge status={item.status} /></td>
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-1">
                              <button onClick={() => { setSelectedItem(item); setViewMode("detail"); }} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md"><Eye className="w-4 h-4" /></button>
                              {['draft', 'revisi'].includes(item.status) && (
                                <button onClick={() => { setEditingItem(item); resetForm(item); setViewMode("form"); }} className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-md">
                                  <Edit className="w-4 h-4" />
                                </button>
                              )}
                              {item.status === "draft" && (
                                <button onClick={() => setConfirmModal({ open: true, title: "Hapus?", message: "Data penelitian akan dihapus.", variant: "danger", onConfirm: () => handleDelete(item.id) })} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md">
                                  <Trash2 className="w-4 h-4" />
                                </button>
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
                    <p className="text-xs text-slate-500">Total: {filtered.length} penelitian</p>
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

  const visiblePeriods = periodeList.filter((period) => {
    const count = kegiatanList.filter((item) => item.periodeId === period.id).length;
    return showEmptyPeriods || count > 0 || period.aktif;
  });

  return (
    <PageWrapper title={JENIS_LABELS.penelitian} subtitle="Pilih periode untuk melihat atau menambah penelitian"
      breadcrumbs={[{ label: "Dosen" }, { label: "Kegiatan" }, { label: "Penelitian" }]}
      actions={
        <button
          onClick={() => setShowEmptyPeriods(!showEmptyPeriods)}
          className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg border transition-all ${
            showEmptyPeriods
              ? "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
              : "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
          }`}
          style={{ fontWeight: 500 }}
        >
          <Eye className="w-4 h-4" />
          {showEmptyPeriods ? "Sembunyikan yang Kosong" : "Tampilkan Semua"}
        </button>
      }>
      {loading ? <SkeletonTable rows={4} /> : (
        <div className="space-y-3">
          {visiblePeriods.map((period) => {
            const count = kegiatanList.filter((item) => item.periodeId === period.id).length;
            return (
              <div key={period.id} onClick={() => { setSelectedPeriode(period); setViewMode("list"); setCurrentPage(1); setSearchQuery(""); }}
                className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-5 py-4 cursor-pointer hover:border-[#E30613]/30 hover:shadow-sm transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center"><Activity className="w-5 h-5 text-green-600" /></div>
                  <div>
                    <p className="text-sm text-slate-800" style={{ fontWeight: 600 }}>{period.tahun} - {period.semester}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{count} penelitian terdaftar</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {period.aktif && <span className="text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full border border-green-100">Aktif</span>}
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
