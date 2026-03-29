import { useState, useEffect } from "react";
import { Plus, Search, Filter, MoreHorizontal, Eye, Edit, Trash2, Send, CheckCircle, XCircle, RotateCcw, ChevronLeft, ChevronRight, Download, FileCheck, MessageSquare, Paperclip, FileEdit, ClipboardCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { roleMatchesAny } from "../config/roleTemplates";
import { PageWrapper } from "../components/PageWrapper";
import { StatusBadge, type StatusType } from "../components/StatusBadge";
import { EmptyState } from "../components/EmptyState";
import { ConfirmModal } from "../components/ConfirmModal";
import { SkeletonTable } from "../components/SkeletonLoader";
import { StepperStatus } from "../components/StepperStatus";
import { ProposalWizardPage } from "./ProposalWizardPage";
import { ReviewPanelPage } from "./ReviewPanelPage";

interface HibahItem {
  id: string;
  judul: string;
  pengusul: string;
  skema: string;
  tahun: number;
  dana: number;
  status: StatusType;
  tanggal: string;
}

const MOCK_DATA: HibahItem[] = [
  { id: "HIB-001", judul: "Penelitian IoT untuk Smart Campus Pradita", pengusul: "Dr. Arif Ramadhan, M.Sc.", skema: "Penelitian Dasar", tahun: 2026, dana: 25000000, status: "pending-review", tanggal: "2026-02-20" },
  { id: "HIB-002", judul: "Pengembangan AI Chatbot untuk Layanan Akademik", pengusul: "Dr. Rina Wulandari", skema: "Penelitian Terapan", tahun: 2026, dana: 35000000, status: "approved", tanggal: "2026-02-18" },
  { id: "HIB-003", judul: "Studi Komparatif Green Building di Indonesia", pengusul: "Prof. Dimas Prakoso", skema: "Penelitian Dasar", tahun: 2026, dana: 20000000, status: "revisi", tanggal: "2026-02-15" },
  { id: "HIB-004", judul: "Machine Learning untuk Prediksi Cuaca Lokal", pengusul: "Dr. Lestari Handayani", skema: "Penelitian Terapan", tahun: 2026, dana: 40000000, status: "draft", tanggal: "2026-02-14" },
  { id: "HIB-005", judul: "Pengabdian Masyarakat Desa Digital", pengusul: "Dr. Fajar Nugroho", skema: "Pengabdian", tahun: 2026, dana: 15000000, status: "submitted", tanggal: "2026-02-12" },
  { id: "HIB-006", judul: "Analisis Sentimen Media Sosial untuk Brand", pengusul: "Dr. Dewi Lestari", skema: "Penelitian Terapan", tahun: 2025, dana: 30000000, status: "verified", tanggal: "2025-12-10" },
  { id: "HIB-007", judul: "Blockchain untuk Sertifikat Digital", pengusul: "Dr. Faisal Rahman", skema: "Penelitian Terapan", tahun: 2025, dana: 45000000, status: "lunas", tanggal: "2025-11-05" },
  { id: "HIB-008", judul: "Studi Wellbeing Mahasiswa Pasca Pandemi", pengusul: "Dr. Lia Megawati", skema: "Penelitian Dasar", tahun: 2025, dana: 18000000, status: "rejected", tanggal: "2025-10-20" },
];

type ViewMode = "list" | "detail" | "form" | "wizard" | "review-panel";
type FormMode = "create" | "edit";

export function HibahInternal() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [formMode, setFormMode] = useState<FormMode>("create");
  const [selectedItem, setSelectedItem] = useState<HibahItem | null>(null);
  const [data, setData] = useState<HibahItem[]>(MOCK_DATA);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmModal, setConfirmModal] = useState<{ open: boolean; title: string; message: string; variant: "danger" | "warning" | "success"; onConfirm: () => void }>({ open: false, title: "", message: "", variant: "danger", onConfirm: () => {} });
  const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "error" }>({ show: false, message: "", type: "success" });

  // Form state
  const [formData, setFormData] = useState({ judul: "", skema: "", tahun: 2026, dana: "" });

  const perPage = 5;

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((p) => ({ ...p, show: false })), 3000);
  };

  const canCreate = roleMatchesAny(user?.role, ["administrator", "lppm", "dosen", "kordinator-riset"]);
  const canReview = roleMatchesAny(user?.role, ["administrator", "lppm", "reviewer", "reviewer-hibah", "kordinator-riset", "ketua-lppm"]);
  const canApprove = roleMatchesAny(user?.role, ["administrator", "reviewer", "reviewer-hibah", "kordinator-riset", "ketua-lppm"]);
  const canFinance = roleMatchesAny(user?.role, ["administrator", "finance"]);

  // Filter & search
  const filtered = data.filter((item) => {
    const matchSearch = item.judul.toLowerCase().includes(searchQuery.toLowerCase()) || item.pengusul.toLowerCase().includes(searchQuery.toLowerCase()) || item.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === "all" || item.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const handleStatusChange = (id: string, newStatus: StatusType) => {
    setData((prev) => prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item)));
    showToast(`Status berhasil diubah ke ${newStatus}`);
    setViewMode("list");
  };

  const handleDelete = (id: string) => {
    setData((prev) => prev.filter((item) => item.id !== id));
    showToast("Data berhasil dihapus");
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formMode === "create") {
      const newItem: HibahItem = {
        id: `HIB-${String(data.length + 1).padStart(3, "0")}`,
        judul: formData.judul,
        pengusul: user?.name || "",
        skema: formData.skema,
        tahun: formData.tahun,
        dana: Number(formData.dana),
        status: "draft",
        tanggal: new Date().toISOString().split("T")[0],
      };
      setData((prev) => [newItem, ...prev]);
      showToast("Data hibah berhasil dibuat");
    } else {
      showToast("Data hibah berhasil diperbarui");
    }
    setViewMode("list");
    setFormData({ judul: "", skema: "", tahun: 2026, dana: "" });
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val);

  // WIZARD VIEW (Multi-step Proposal)
  if (viewMode === "wizard") {
    return <ProposalWizardPage onBack={() => setViewMode("list")} />;
  }

  // REVIEW PANEL VIEW
  if (viewMode === "review-panel") {
    return <ReviewPanelPage onBack={() => setViewMode("list")} />;
  }

  // DETAIL VIEW
  if (viewMode === "detail" && selectedItem) {
    return (
      <PageWrapper
        title="Detail Hibah Internal"
        breadcrumbs={[{ label: "Pengajuan" }, { label: "Hibah Internal", path: "/admin/hibah" }, { label: selectedItem.id }]}
        actions={
          <button onClick={() => setViewMode("list")} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Kembali
          </button>
        }
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Stepper */}
            <StepperStatus module="hibah" currentStatus={selectedItem.status} />

            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-xs text-slate-400" style={{ fontWeight: 500 }}>{selectedItem.id}</span>
                  <h3 className="text-lg text-slate-900 mt-1" style={{ fontWeight: 600 }}>{selectedItem.judul}</h3>
                </div>
                <StatusBadge status={selectedItem.status} size="md" />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                {[
                  { label: "Pengusul", value: selectedItem.pengusul },
                  { label: "Skema", value: selectedItem.skema },
                  { label: "Tahun", value: String(selectedItem.tahun) },
                  { label: "Dana", value: formatCurrency(selectedItem.dana) },
                  { label: "Tanggal Pengajuan", value: selectedItem.tanggal },
                  { label: "Status", value: selectedItem.status },
                ].map((field) => (
                  <div key={field.label}>
                    <p className="text-xs text-slate-400 mb-1" style={{ fontWeight: 500 }}>{field.label}</p>
                    <p className="text-sm text-slate-800" style={{ fontWeight: 500 }}>{field.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Document Checklist */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileCheck className="w-4 h-4 text-slate-600" />
                <h4 className="text-sm text-slate-800" style={{ fontWeight: 600 }}>Kelengkapan Dokumen</h4>
              </div>
              <div className="space-y-2.5">
                {[
                  { name: "Proposal Penelitian", uploaded: true, file: "proposal_iot_v2.pdf" },
                  { name: "RAB (Rencana Anggaran Biaya)", uploaded: true, file: "rab_hibah_001.xlsx" },
                  { name: "CV Ketua Peneliti", uploaded: true, file: "cv_budi_santoso.pdf" },
                  { name: "Surat Pernyataan", uploaded: selectedItem.status !== "draft", file: "surat_pernyataan.pdf" },
                  { name: "Lembar Pengesahan", uploaded: ["approved", "verified", "lunas"].includes(selectedItem.status), file: "pengesahan.pdf" },
                ].map((doc) => (
                  <div key={doc.name} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border ${doc.uploaded ? "border-green-100 bg-green-50/30" : "border-slate-200 bg-slate-50/50"}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${doc.uploaded ? "bg-green-500 text-white" : "bg-slate-200 text-slate-400"}`}>
                      {doc.uploaded ? <CheckCircle className="w-3.5 h-3.5" /> : <Paperclip className="w-3 h-3" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${doc.uploaded ? "text-slate-700" : "text-slate-400"}`} style={{ fontWeight: 500 }}>{doc.name}</p>
                      {doc.uploaded && <p className="text-[11px] text-slate-400 truncate">{doc.file}</p>}
                    </div>
                    {!doc.uploaded && (
                      <button className="text-[11px] text-[#E30613] hover:underline" style={{ fontWeight: 500 }}>Upload</button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Reviewer Notes */}
            {(selectedItem.status === "revisi" || canReview) && (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="w-4 h-4 text-slate-600" />
                  <h4 className="text-sm text-slate-800" style={{ fontWeight: 600 }}>Catatan Reviewer</h4>
                </div>
                <div className="space-y-3">
                  {selectedItem.status === "revisi" && (
                    <div className="p-3 bg-orange-50 border border-orange-100 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-orange-700" style={{ fontWeight: 600 }}>Dr. Lestari Handayani (Reviewer)</span>
                        <span className="text-[10px] text-orange-500">2026-02-16</span>
                      </div>
                      <p className="text-sm text-orange-800">Metodologi perlu diperkuat. Tambahkan justifikasi pemilihan sampel dan perbaiki timeline penelitian agar lebih realistis.</p>
                    </div>
                  )}
                  {canReview && (selectedItem.status === "submitted" || selectedItem.status === "submit-revisi" || selectedItem.status === "pending-review") && (
                    <div className="space-y-2">
                      <textarea placeholder="Tulis catatan review..." rows={3}
                        className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613]/40 bg-slate-50/50 placeholder:text-slate-400 resize-none" />
                      <p className="text-[11px] text-slate-400">Catatan wajib diisi jika meminta revisi atau menolak pengajuan.</p>
                    </div>
                  )}
                  {!canReview && selectedItem.status !== "revisi" && (
                    <p className="text-sm text-slate-400 italic">Belum ada catatan dari reviewer.</p>
                  )}
                </div>
              </div>
            )}

            {/* Timeline */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h4 className="text-sm text-slate-800 mb-4" style={{ fontWeight: 600 }}>Riwayat Status</h4>
              <div className="space-y-4">
                {[
                  { status: "Draft dibuat", by: selectedItem.pengusul, date: selectedItem.tanggal, color: "bg-gray-400" },
                  ...(selectedItem.status !== "draft" ? [{ status: "Submitted", by: selectedItem.pengusul, date: selectedItem.tanggal, color: "bg-blue-500" }] : []),
                  ...(["pending-review", "revisi", "approved", "rejected", "verified", "lunas"].includes(selectedItem.status) ? [{ status: "Pending Review", by: "System", date: selectedItem.tanggal, color: "bg-amber-500" }] : []),
                  ...(["revisi"].includes(selectedItem.status) ? [{ status: "Revisi diminta", by: "Reviewer", date: selectedItem.tanggal, color: "bg-orange-500" }] : []),
                  ...(["approved", "verified", "lunas"].includes(selectedItem.status) ? [{ status: "Approved", by: "Ketua LPPM", date: selectedItem.tanggal, color: "bg-green-500" }] : []),
                  ...(["verified", "lunas"].includes(selectedItem.status) ? [{ status: "Verified by Finance", by: "Finance", date: selectedItem.tanggal, color: "bg-emerald-500" }] : []),
                  ...(["lunas"].includes(selectedItem.status) ? [{ status: "Lunas", by: "Finance", date: selectedItem.tanggal, color: "bg-green-600" }] : []),
                ].map((log, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-2.5 h-2.5 rounded-full ${log.color} shrink-0 mt-1.5`} />
                      {i < 5 && <div className="w-px flex-1 bg-slate-200 mt-1" />}
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

          {/* Actions sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h4 className="text-sm text-slate-800 mb-3" style={{ fontWeight: 600 }}>Aksi</h4>
              <div className="space-y-2">
                {selectedItem.status === "draft" && canCreate && (
                  <>
                    <button onClick={() => setConfirmModal({ open: true, title: "Submit Pengajuan?", message: "Pengajuan akan dikirim untuk di-review. Anda tidak bisa mengedit setelah submit.", variant: "warning", onConfirm: () => handleStatusChange(selectedItem.id, "submitted") })}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors" style={{ fontWeight: 500 }}>
                      <Send className="w-4 h-4" /> Submit Pengajuan
                    </button>
                    <button onClick={() => { setFormMode("edit"); setFormData({ judul: selectedItem.judul, skema: selectedItem.skema, tahun: selectedItem.tahun, dana: String(selectedItem.dana) }); setViewMode("form"); }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors" style={{ fontWeight: 500 }}>
                      <Edit className="w-4 h-4" /> Edit
                    </button>
                    <button onClick={() => setConfirmModal({ open: true, title: "Hapus Data?", message: "Data yang dihapus tidak dapat dikembalikan.", variant: "danger", onConfirm: () => { handleDelete(selectedItem.id); setViewMode("list"); } })}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors" style={{ fontWeight: 500 }}>
                      <Trash2 className="w-4 h-4" /> Hapus
                    </button>
                  </>
                )}
                {selectedItem.status === "revisi" && canCreate && (
                  <button onClick={() => setConfirmModal({ open: true, title: "Submit Ulang?", message: "Revisi akan dikirim kembali untuk di-review.", variant: "warning", onConfirm: () => handleStatusChange(selectedItem.id, "submit-revisi") })}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors" style={{ fontWeight: 500 }}>
                    <RotateCcw className="w-4 h-4" /> Submit Revisi
                  </button>
                )}
                {(selectedItem.status === "submitted" || selectedItem.status === "submit-revisi" || selectedItem.status === "pending-review") && canReview && (
                  <>
                    <button onClick={() => handleStatusChange(selectedItem.id, "approved")}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors" style={{ fontWeight: 500 }}>
                      <CheckCircle className="w-4 h-4" /> Approve
                    </button>
                    <button onClick={() => handleStatusChange(selectedItem.id, "revisi")}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors" style={{ fontWeight: 500 }}>
                      <RotateCcw className="w-4 h-4" /> Minta Revisi
                    </button>
                    <button onClick={() => setConfirmModal({ open: true, title: "Tolak Pengajuan?", message: "Pengajuan akan ditolak dan tidak dapat diproses lagi.", variant: "danger", onConfirm: () => handleStatusChange(selectedItem.id, "rejected") })}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors" style={{ fontWeight: 500 }}>
                      <XCircle className="w-4 h-4" /> Tolak
                    </button>
                  </>
                )}
                {selectedItem.status === "approved" && canFinance && (
                  <button onClick={() => handleStatusChange(selectedItem.id, "verified")}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors" style={{ fontWeight: 500 }}>
                    <CheckCircle className="w-4 h-4" /> Verifikasi Finance
                  </button>
                )}
                {selectedItem.status === "verified" && canFinance && (
                  <button onClick={() => handleStatusChange(selectedItem.id, "lunas")}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors" style={{ fontWeight: 500 }}>
                    <CheckCircle className="w-4 h-4" /> Tandai Lunas
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        <ConfirmModal {...confirmModal} onClose={() => setConfirmModal((p) => ({ ...p, open: false }))} />
      </PageWrapper>
    );
  }

  // FORM VIEW
  if (viewMode === "form") {
    return (
      <PageWrapper
        title={formMode === "create" ? "Buat Hibah Baru" : "Edit Hibah"}
        breadcrumbs={[{ label: "Pengajuan" }, { label: "Hibah Internal", path: "/admin/hibah" }, { label: formMode === "create" ? "Baru" : "Edit" }]}
        actions={
          <button onClick={() => setViewMode("list")} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Batal
          </button>
        }
      >
        <form onSubmit={handleFormSubmit} className="max-w-2xl bg-white rounded-xl border border-slate-200 p-6 space-y-5">
          <div>
            <label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 500 }}>Judul Penelitian <span className="text-red-500">*</span></label>
            <input type="text" value={formData.judul} onChange={(e) => setFormData((p) => ({ ...p, judul: e.target.value }))} required placeholder="Masukkan judul penelitian"
              className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613]/40 transition-all bg-slate-50/50 placeholder:text-slate-400" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 500 }}>Skema <span className="text-red-500">*</span></label>
              <select value={formData.skema} onChange={(e) => setFormData((p) => ({ ...p, skema: e.target.value }))} required
                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613]/40 bg-slate-50/50 text-slate-700">
                <option value="">Pilih skema</option>
                <option value="Penelitian Dasar">Penelitian Dasar</option>
                <option value="Penelitian Terapan">Penelitian Terapan</option>
                <option value="Pengabdian">Pengabdian</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 500 }}>Tahun</label>
              <input type="number" value={formData.tahun} onChange={(e) => setFormData((p) => ({ ...p, tahun: Number(e.target.value) }))}
                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613]/40 bg-slate-50/50" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 500 }}>Dana (Rp) <span className="text-red-500">*</span></label>
            <input type="number" value={formData.dana} onChange={(e) => setFormData((p) => ({ ...p, dana: e.target.value }))} required placeholder="Contoh: 25000000"
              className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613]/40 bg-slate-50/50 placeholder:text-slate-400" />
          </div>
          <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
            <button type="submit" className="px-6 py-2.5 text-sm text-white bg-[#E30613] rounded-lg hover:bg-[#c00510] transition-all active:scale-95" style={{ fontWeight: 500 }}>
              {formMode === "create" ? "Simpan sebagai Draft" : "Simpan Perubahan"}
            </button>
            <button type="button" onClick={() => setViewMode("list")} className="px-6 py-2.5 text-sm text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors" style={{ fontWeight: 500 }}>
              Batal
            </button>
          </div>
        </form>
      </PageWrapper>
    );
  }

  // LIST VIEW
  return (
    <PageWrapper
      title="Hibah Internal"
      subtitle="Kelola pengajuan hibah penelitian internal"
      breadcrumbs={[{ label: "Pengajuan" }, { label: "Hibah Internal" }]}
      actions={
        <div className="flex items-center gap-2">
          {canCreate && (
            <>
              <button onClick={() => setViewMode("wizard")}
                className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-[#E30613] rounded-lg hover:bg-[#c00510] transition-all active:scale-95" style={{ fontWeight: 500 }}>
                <FileEdit className="w-4 h-4" /> Buat Proposal
              </button>
              <button onClick={() => { setFormMode("create"); setFormData({ judul: "", skema: "", tahun: 2026, dana: "" }); setViewMode("form"); }}
                className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors" style={{ fontWeight: 500 }}>
                <Plus className="w-4 h-4" /> Tambah Cepat
              </button>
            </>
          )}
          {canReview && (
            <button onClick={() => setViewMode("review-panel")}
              className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors" style={{ fontWeight: 500 }}>
              <ClipboardCheck className="w-4 h-4" /> Review Panel
            </button>
          )}
          <button className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors" style={{ fontWeight: 500 }}>
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      }
    >
      {loading ? (
        <SkeletonTable rows={5} />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {/* Toolbar */}
          <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} placeholder="Cari judul, pengusul, ID..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613]/40 transition-all placeholder:text-slate-400" />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#E30613]/20">
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

          {/* Table */}
          {paginated.length === 0 ? (
            searchQuery || statusFilter !== "all" ? (
              <EmptyState variant="no-results" onAction={() => { setSearchQuery(""); setStatusFilter("all"); }} actionLabel="Reset Filter" />
            ) : (
              <EmptyState variant="no-data" actionLabel={canCreate ? "Tambah Hibah Pertama" : undefined} onAction={canCreate ? () => { setFormMode("create"); setViewMode("form"); } : undefined} />
            )
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100">
                      {["ID", "Judul", "Pengusul", "Skema", "Dana", "Status", "Aksi"].map((h) => (
                        <th key={h} className="px-5 py-3 text-left text-xs text-slate-500 whitespace-nowrap" style={{ fontWeight: 600 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {paginated.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-3.5 text-sm text-slate-500 whitespace-nowrap" style={{ fontWeight: 500 }}>{item.id}</td>
                        <td className="px-5 py-3.5">
                          <button onClick={() => { setSelectedItem(item); setViewMode("detail"); }} className="text-sm text-slate-800 hover:text-[#E30613] transition-colors text-left max-w-[250px] truncate block" style={{ fontWeight: 500 }}>
                            {item.judul}
                          </button>
                          <p className="text-xs text-slate-400 mt-0.5">{item.tanggal}</p>
                        </td>
                        <td className="px-5 py-3.5 text-sm text-slate-600 whitespace-nowrap">{item.pengusul}</td>
                        <td className="px-5 py-3.5 text-sm text-slate-600 whitespace-nowrap">{item.skema}</td>
                        <td className="px-5 py-3.5 text-sm text-slate-700 whitespace-nowrap" style={{ fontWeight: 500 }}>{formatCurrency(item.dana)}</td>
                        <td className="px-5 py-3.5 whitespace-nowrap"><StatusBadge status={item.status} /></td>
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <button onClick={() => { setSelectedItem(item); setViewMode("detail"); }} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Detail">
                              <Eye className="w-4 h-4" />
                            </button>
                            {item.status === "draft" && canCreate && (
                              <>
                                <button onClick={() => { setSelectedItem(item); setFormMode("edit"); setFormData({ judul: item.judul, skema: item.skema, tahun: item.tahun, dana: String(item.dana) }); setViewMode("form"); }} className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors" title="Edit">
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button onClick={() => setConfirmModal({ open: true, title: "Hapus Data?", message: `Hapus hibah "${item.judul}"? Aksi ini tidak dapat dibatalkan.`, variant: "danger", onConfirm: () => handleDelete(item.id) })} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Hapus">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
                <p className="text-xs text-slate-500">Menampilkan {(currentPage - 1) * perPage + 1}-{Math.min(currentPage * perPage, filtered.length)} dari {filtered.length}</p>
                <div className="flex items-center gap-1">
                  <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded-md">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-8 h-8 text-xs rounded-md transition-colors ${currentPage === i + 1 ? "bg-[#E30613] text-white" : "text-slate-600 hover:bg-slate-100"}`} style={{ fontWeight: 500 }}>
                      {i + 1}
                    </button>
                  ))}
                  <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded-md">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Toast */}
      {toast.show && (
        <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg border ${toast.type === "success" ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"}`}>
          {toast.type === "success" ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
          <span className="text-sm" style={{ fontWeight: 500 }}>{toast.message}</span>
        </div>
      )}

      <ConfirmModal {...confirmModal} onClose={() => setConfirmModal((p) => ({ ...p, open: false }))} />
    </PageWrapper>
  );
}
