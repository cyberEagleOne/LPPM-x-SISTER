import { useState, useEffect } from "react";
import {
  Plus, Search, Eye, Edit, Trash2, FileText, ClipboardList,
  Award, HelpCircle, AlertTriangle, ChevronLeft, ChevronRight,
  CheckCircle, X, Calendar, Info
} from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { PageWrapper } from "../components/PageWrapper";
import { StatusBadge, type StatusType } from "../components/StatusBadge";
import { EmptyState } from "../components/EmptyState";
import { ConfirmModal } from "../components/ConfirmModal";
import { SkeletonTable } from "../components/SkeletonLoader";
import { useAuth } from "../context/AuthContext";
import { SuperAdminPkmPage } from "./SuperAdminPkmPage";
import type { DetailPenelitian } from "../../../../../shared/models/Penelitian/DetailPenelitian";

/* ────────────────── Types ────────────────── */

export type JenisHibah = "penelitian" | "pengabdian";

interface PeriodeAjuan {
  id: string;
  tahun: string;
  semester: "Ganjil" | "Genap";
  bolehApply: boolean;
  bolehReview: boolean;
  bolehPerbaikan: boolean;
  bolehReviewPerbaikan: boolean;
  bolehPleno: boolean;
  tgl_mulai_apply: string;
  tgl_akhir_apply: string;
  tgl_mulai_review: string;
  tgl_akhir_review: string;
  tgl_mulai_perbaikan: string;
  tgl_akhir_perbaikan: string;
  tgl_mulai_review_perbaikan: string;
  tgl_akhir_review_perbaikan: string;
  tgl_pengumuman_final: string;
  tgl_midtermprogress: string;
  tgl_finalreport: string;
  tgl_hasilevaluasi: string;
}

export interface HibahItem extends Partial<Omit<DetailPenelitian, "status">> {
  id: string;
  dosen_id?: string;
  judul: string;
  pengusul: string;
  skema: string;
  jenis: JenisHibah;
  tahun: string;
  periode: string;
  dana: number;
  status: StatusType;
  tanggal: string | null;
  reviewselesai: boolean;
  bolehpengumuman: boolean;
  isPkm: boolean;
  hutangLuaran: boolean;
}

/* ────────────────── Mock Data ────────────────── */

const MOCK_PERIODE: PeriodeAjuan = {
  id: "P-001",
  tahun: "2025/2026",
  semester: "Genap",
  bolehApply: true,
  bolehReview: false,
  bolehPerbaikan: false,
  bolehReviewPerbaikan: false,
  bolehPleno: false,
  tgl_mulai_apply: "2026-01-10",
  tgl_akhir_apply: "2026-03-31",
  tgl_mulai_review: "2026-04-01",
  tgl_akhir_review: "2026-04-30",
  tgl_mulai_perbaikan: "2026-05-01",
  tgl_akhir_perbaikan: "2026-05-15",
  tgl_mulai_review_perbaikan: "2026-05-16",
  tgl_akhir_review_perbaikan: "2026-05-31",
  tgl_pengumuman_final: "2026-06-10",
  tgl_midtermprogress: "2026-08-01",
  tgl_finalreport: "2026-12-15",
  tgl_hasilevaluasi: "2027-01-10",
};

const MOCK_HIBAH: HibahItem[] = [
  {
    id: "HIB-001", dosen_id: "USR-001", judul: "Penelitian IoT untuk Smart Campus Pradita", pengusul: "Dr. Arif Ramadhan, M.Sc.",
    skema: "Penelitian Dasar", jenis: "penelitian", tahun: "2025/2026", periode: "Genap",
    dana: 25000000, status: "submitted", tanggal: "2026-02-20", reviewselesai: false, bolehpengumuman: false, isPkm: false, hutangLuaran: false,
  },
  {
    id: "HIB-002", dosen_id: "USR-002", judul: "Pengembangan AI Chatbot untuk Layanan Akademik", pengusul: "Dr. Rina Wulandari",
    skema: "Penelitian Terapan", jenis: "penelitian", tahun: "2025/2026", periode: "Genap",
    dana: 35000000, status: "approved", tanggal: "2026-02-18", reviewselesai: true, bolehpengumuman: false, isPkm: false, hutangLuaran: false,
  },
  {
    id: "HIB-003", dosen_id: "USR-003", judul: "Studi Komparatif Green Building di Indonesia", pengusul: "Prof. Dimas Prakoso",
    skema: "Penelitian Dasar", jenis: "penelitian", tahun: "2025/2026", periode: "Genap",
    dana: 20000000, status: "revisi", tanggal: "2026-02-15", reviewselesai: true, bolehpengumuman: false, isPkm: false, hutangLuaran: false,
  },
  {
    id: "HIB-004", dosen_id: "USR-001", judul: "Machine Learning untuk Prediksi Cuaca Lokal", pengusul: "Dr. Lestari Handayani",
    skema: "Penelitian Terapan", jenis: "penelitian", tahun: "2025/2026", periode: "Genap",
    dana: 40000000, status: "draft", tanggal: null, reviewselesai: false, bolehpengumuman: false, isPkm: false, hutangLuaran: false,
  },
  {
    id: "HIB-005", dosen_id: "USR-002", judul: "Pengabdian Masyarakat Desa Digital - PKM", pengusul: "Dr. Fajar Nugroho",
    skema: "Pengabdian Masyarakat", jenis: "pengabdian", tahun: "2025/2026", periode: "Genap",
    dana: 15000000, status: "approved", tanggal: "2026-02-12", reviewselesai: true, bolehpengumuman: true, isPkm: true, hutangLuaran: false,
  },
  {
    id: "HIB-006", dosen_id: "USR-003", judul: "Analisis Sentimen Media Sosial untuk Brand", pengusul: "Dr. Dewi Lestari",
    skema: "Penelitian Terapan", jenis: "penelitian", tahun: "2024/2025", periode: "Ganjil",
    dana: 30000000, status: "verified", tanggal: "2025-12-10", reviewselesai: true, bolehpengumuman: false, isPkm: false, hutangLuaran: false,
  },
];

const formatDate = (d: string) => new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });

/* ────────────────── Tanggal Penting Modal ────────────────── */

function TanggalPentingModal({ periode, onClose }: { periode: PeriodeAjuan; onClose: () => void }) {
  const rows = [
    { label: "Pengajuan Hibah", mulai: periode.tgl_mulai_apply, akhir: periode.tgl_akhir_apply },
    { label: "Review Proposal", mulai: periode.tgl_mulai_review, akhir: periode.tgl_akhir_review },
    { label: "Perbaikan Proposal", mulai: periode.tgl_mulai_perbaikan, akhir: periode.tgl_akhir_perbaikan },
    { label: "Review Perbaikan", mulai: periode.tgl_mulai_review_perbaikan, akhir: periode.tgl_akhir_review_perbaikan },
    { label: "Pengumuman Pemenang", mulai: periode.tgl_pengumuman_final, akhir: "" },
    { label: "Laporan Midterm", mulai: periode.tgl_midtermprogress, akhir: "" },
    { label: "Laporan Final", mulai: periode.tgl_finalreport, akhir: "" },
    { label: "Evaluasi Hasil", mulai: periode.tgl_hasilevaluasi, akhir: "" },
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-xl mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-[#E30613]" />
            <h3 className="text-slate-900" style={{ fontWeight: 600 }}>Tanggal Penting — {periode.semester} {periode.tahun}</h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left text-xs text-slate-500 pb-2" style={{ fontWeight: 600 }}>Tahapan</th>
                <th className="text-left text-xs text-slate-500 pb-2" style={{ fontWeight: 600 }}>Mulai</th>
                <th className="text-left text-xs text-slate-500 pb-2" style={{ fontWeight: 600 }}>Akhir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {rows.map((r) => (
                <tr key={r.label} className="hover:bg-slate-50/50">
                  <td className="py-3 text-sm text-slate-700" style={{ fontWeight: 500 }}>{r.label}</td>
                  <td className="py-3 text-sm text-slate-600">{r.mulai ? formatDate(r.mulai) : "—"}</td>
                  <td className="py-3 text-sm text-slate-600">{r.akhir ? formatDate(r.akhir) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ────────────────── Main Component ────────────────── */

export function HibahInternalPage({ jenis = "penelitian" }: { jenis?: JenisHibah }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<HibahItem[]>(MOCK_HIBAH);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showTanggal, setShowTanggal] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ open: false, title: "", message: "", variant: "danger" as "danger" | "warning" | "success", onConfirm: () => {} });
  const [toast, setToast] = useState({ show: false, message: "", type: "success" as "success" | "error" });
  const perPage = 8;

  useEffect(() => { const t = setTimeout(() => setLoading(false), 500); return () => clearTimeout(t); }, []);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast((p) => ({ ...p, show: false })), 3000);
  };

  const handleDelete = (id: string) => {
    setData((prev) => prev.filter((d) => d.id !== id));
    showToast("Proposal berhasil dihapus");
  };

  const periode = MOCK_PERIODE;

  /* Banner text */
  const getBannerText = () => {
    if (periode.bolehApply) return `Hibah ${periode.semester} ${periode.tahun} sedang berlangsung mulai tanggal ${formatDate(periode.tgl_mulai_apply)} – ${formatDate(periode.tgl_akhir_apply)}`;
    if (periode.bolehReview) return `Hibah ${periode.semester} ${periode.tahun} sedang dalam proses review mulai tanggal ${formatDate(periode.tgl_mulai_review)} – ${formatDate(periode.tgl_akhir_review)}`;
    if (periode.bolehPerbaikan) return `Hibah ${periode.semester} ${periode.tahun} sedang dalam tahap perbaikan mulai tanggal ${formatDate(periode.tgl_mulai_perbaikan)} – ${formatDate(periode.tgl_akhir_perbaikan)}`;
    if (periode.bolehReviewPerbaikan) return "Saat ini sedang berlangsung review perbaikan proposal hibah";
    if (periode.bolehPleno) return "Saat ini sedang berlangsung rapat pleno penentuan pemenang hibah";
    return null;
  };

  const filtered = data.filter((d) => {
    // Validasi Keamanan Level Sesi: Hanya Admin dan Reviewer yang boleh melihat proposal milik orang lain.
    const isOwner = (user?.role === "administrator" || user?.role === "reviewer") ? true : d.dosen_id === user?.id;

    const matchJenis = jenis === "pengabdian" ? d.jenis === "pengabdian" : d.jenis === "penelitian";
    const matchSearch = d.judul.toLowerCase().includes(searchQuery.toLowerCase()) || d.id.toLowerCase().includes(searchQuery.toLowerCase());
    return isOwner && matchJenis && matchSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);
  const bannerText = getBannerText();
  const pageTitle = jenis === "pengabdian" ? "Hibah Pengabdian (PKM)" : "Hibah Penelitian";
  const shouldUseSuperAdminPkm = jenis === "pengabdian" && (user?.role === "administrator" || user?.role === "reviewer");
  const showHibahBanner = jenis === "penelitian" && !!bannerText;
  const isReviewerShell = location.pathname.startsWith("/reviewer");
  const shellBase = isReviewerShell ? "/reviewer" : "/admin";
  const sectionLabel = user?.role === "reviewer" ? "Reviewer" : "Dosen";
  const canCreateOrEdit = user?.role !== "reviewer";

  if (shouldUseSuperAdminPkm) {
    return <SuperAdminPkmPage />;
  }

  return (
    <PageWrapper
      title={pageTitle}
      subtitle="Kelola proposal hibah internal Anda"
      breadcrumbs={[{ label: sectionLabel }, { label: "Hibah" }, { label: pageTitle }]}
    >
      {/* ── Banner Periode ── */}
      {showHibahBanner ? (
        <div className="bg-gradient-to-r from-[#E30613]/5 to-blue-50 border border-[#E30613]/20 rounded-xl p-5 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-9 h-9 rounded-xl bg-[#E30613]/10 flex items-center justify-center shrink-0">
              <Info className="w-5 h-5 text-[#E30613]" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-slate-700 leading-relaxed">{bannerText}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <button onClick={() => setShowTanggal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors" style={{ fontWeight: 500 }}>
                  <Calendar className="w-3.5 h-3.5" /> Tanggal Penting
                </button>
                {periode.bolehApply && canCreateOrEdit && (
                  <button onClick={() => navigate(`${shellBase}/hibah/new?jenis=${jenis}&periode=${periode.id}`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white bg-[#E30613] rounded-lg hover:bg-[#c00510] transition-colors" style={{ fontWeight: 500 }}>
                    <Plus className="w-3.5 h-3.5" /> Apply Hibah
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            placeholder="Cari judul atau ID..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E30613]/20" />
        </div>
        {!showHibahBanner && canCreateOrEdit && (
          <button onClick={() => navigate(`${shellBase}/hibah/new?jenis=${jenis}&periode=${periode.id}`)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-[#E30613] rounded-lg hover:bg-[#c00510]" style={{ fontWeight: 500 }}>
            <Plus className="w-4 h-4" /> Ajukan Hibah
          </button>
        )}
      </div>

      {/* ── Table ── */}
      {loading ? <SkeletonTable rows={5} /> : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {paginated.length === 0 ? (
            <EmptyState variant={searchQuery ? "no-results" : "no-data"} title="Belum ada proposal hibah" description="Klik tombol Apply Hibah untuk memulai pengajuan." />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                      <th className="px-5 py-3 text-left text-xs text-slate-500 whitespace-nowrap" style={{ fontWeight: 600 }}>Judul Proposal</th>
                      <th className="px-5 py-3 text-left text-xs text-slate-500 whitespace-nowrap" style={{ fontWeight: 600 }}>Skema</th>
                      <th className="px-5 py-3 text-left text-xs text-slate-500 whitespace-nowrap" style={{ fontWeight: 600 }}>Tanggal Pengajuan</th>
                      <th className="px-5 py-3 text-left text-xs text-slate-500 whitespace-nowrap" style={{ fontWeight: 600 }}>Status</th>
                      <th className="px-5 py-3 text-left text-xs text-slate-500 whitespace-nowrap" style={{ fontWeight: 600 }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {paginated.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/30">
                        <td className="px-5 py-4">
                          <p className="text-sm text-slate-900 max-w-[280px] truncate" style={{ fontWeight: 500 }}>{item.judul}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{item.id} · {item.tahun} {item.periode}</p>
                          {/* Peringatan hutang luaran */}
                          {item.status === "verified" && item.hutangLuaran && (
                            <div className="flex items-center gap-1.5 mt-1">
                              <AlertTriangle className="w-3 h-3 text-amber-500" />
                              <span className="text-xs text-amber-600" style={{ fontWeight: 500 }}>Anda masih punya hutang luaran</span>
                              <button className="text-xs text-blue-600 hover:underline">Update Status Jurnal</button>
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600 whitespace-nowrap">{item.skema}</td>
                        <td className="px-5 py-4 text-sm text-slate-600 whitespace-nowrap">
                          {item.tanggal ? formatDate(item.tanggal) : <span className="text-slate-400 italic">belum diajukan</span>}
                        </td>
                        <td className="px-5 py-4"><StatusBadge status={item.status} /></td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1">
                            {/* 📂 View */}
                            <button
                              onClick={() => navigate(`${shellBase}/hibah/view/${item.id}`)}
                              title="Lihat Detail"
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>

                            {/* 📋 Laporan Review (jika reviewselesai) */}
                            {item.reviewselesai && (
                              <button
                                onClick={() => navigate(`${shellBase}/hibah/laporan-review/${item.id}`)}
                                title="Laporan Review"
                                className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors">
                                <ClipboardList className="w-4 h-4" />
                              </button>
                            )}

                            {/* 🖊 Revisi (jika status revisi/submitrevisi) */}
                            {["revisi", "submitrevisi"].includes(item.status) && (
                              <button
                                onClick={() => navigate(`${shellBase}/hibah/revisi/${item.id}`)}
                                title="Revisi Proposal"
                                className="p-1.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-colors">
                                <FileText className="w-4 h-4" />
                              </button>
                            )}

                            {/* ✏️ Edit (jika draft) */}
                            {item.status === "draft" && canCreateOrEdit && (
                              <button
                                onClick={() => navigate(`${shellBase}/hibah/edit/${item.id}`)}
                                title="Edit Draft"
                                className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors">
                                <Edit className="w-4 h-4" />
                              </button>
                            )}

                            {/* 🗑 Hapus (jika draft) */}
                            {item.status === "draft" && canCreateOrEdit && (
                              <button
                                onClick={() => setConfirmModal({ open: true, title: "Hapus Proposal?", message: `Proposal "${item.judul}" akan dihapus permanen.`, variant: "danger", onConfirm: () => handleDelete(item.id) })}
                                title="Hapus"
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}

                            {/* ✅ Progress (jika bolehpengumuman) */}
                            {item.bolehpengumuman && (
                              <button
                                onClick={() => navigate(`${shellBase}/hibah/pemenang/${item.id}`)}
                                title="Lihat Hasil"
                                className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors">
                                <Award className="w-4 h-4" />
                              </button>
                            )}

                            {/* ❓ Quiz PKM */}
                            {item.isPkm && (
                              <button
                                onClick={() => navigate(`/reviewer/quiz-pkm/${item.id}`)}
                                title="Quiz PKM"
                                className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-md transition-colors">
                                <HelpCircle className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
                  <p className="text-xs text-slate-500">Total: {filtered.length} proposal</p>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-1.5 text-slate-400 disabled:opacity-30"><ChevronLeft className="w-4 h-4" /></button>
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-8 h-8 text-xs rounded-md transition-colors ${currentPage === i + 1 ? "bg-[#E30613] text-white" : "text-slate-600 hover:bg-slate-100"}`}>{i + 1}</button>
                    ))}
                    <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-1.5 text-slate-400 disabled:opacity-30"><ChevronRight className="w-4 h-4" /></button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Modals */}
      {showTanggal && <TanggalPentingModal periode={periode} onClose={() => setShowTanggal(false)} />}
      <ConfirmModal {...confirmModal} isOpen={confirmModal.open} onClose={() => setConfirmModal((p) => ({ ...p, open: false }))} />

      {/* Toast */}
      {toast.show && (
        <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg border ${toast.type === "success" ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"}`}>
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm" style={{ fontWeight: 500 }}>{toast.message}</span>
        </div>
      )}
    </PageWrapper>
  );
}
