import { useState, useEffect } from "react";
import { Plus, Search, Eye, Send, CheckCircle, XCircle, RotateCcw, ChevronLeft, ChevronRight, Download, ExternalLink, MessageSquare, FileCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { roleMatchesAny } from "../../config/roleTemplates";
import { PageWrapper } from "../../components/admin/PageWrapper";
import { StatusBadge, type StatusType } from "../../components/admin/StatusBadge";
import { EmptyState } from "../../components/admin/EmptyState";
import { ConfirmModal } from "../../components/admin/ConfirmModal";
import { SkeletonTable } from "../../components/admin/SkeletonLoader";
import { StepperStatus } from "../../components/admin/StepperStatus";

interface PublikasiItem {
  id: string; judul: string; penulis: string; jenis: string; status: StatusType; tanggal: string; jurnal: string; link: string; doi: string;
}

const MOCK_DATA: PublikasiItem[] = [
  { id: "PUB-001", judul: "Jurnal AI & Education: Impact of Machine Learning on Student Performance", penulis: "Dr. Arif Ramadhan", jenis: "Jurnal Q1", status: "revisi", tanggal: "2026-02-21", jurnal: "IEEE Transactions on Education", link: "https://ieee.org/example", doi: "10.1109/TE.2026.001" },
  { id: "PUB-002", judul: "Prosiding ICALT: Smart Campus IoT Framework", penulis: "Dr. Rina Wulandari", jenis: "Prosiding", status: "approved", tanggal: "2026-02-18", jurnal: "ICALT 2026 Proceedings", link: "https://icalt.org/example", doi: "10.1145/1234567" },
  { id: "PUB-003", judul: "Buku: Panduan Penelitian Perguruan Tinggi", penulis: "Prof. Dimas Prakoso", jenis: "Buku", status: "submitted", tanggal: "2026-02-15", jurnal: "Penerbit UI", link: "", doi: "" },
  { id: "PUB-004", judul: "HKI: Sistem Monitoring Kualitas Udara Berbasis IoT", penulis: "Dr. Fajar Nugroho", jenis: "HKI", status: "pending-review", tanggal: "2026-02-10", jurnal: "DJKI", link: "", doi: "HKI-2026-00123" },
  { id: "PUB-005", judul: "Jurnal: Blockchain-based Digital Certificate Verification", penulis: "Dr. Faisal Rahman", jenis: "Jurnal Q2", status: "draft", tanggal: "2026-02-05", jurnal: "Journal of Systems & Software", link: "", doi: "" },
  { id: "PUB-006", judul: "Prosiding: Deep Learning for Bahasa Indonesia NLP", penulis: "Dr. Lestari Handayani", jenis: "Prosiding", status: "verified", tanggal: "2026-01-20", jurnal: "ACL 2026", link: "https://acl.org/example", doi: "10.18653/v1/2026.acl-001" },
  { id: "PUB-007", judul: "Jurnal: Green Building Assessment Model for Tropical Climate", penulis: "Dr. Dewi Lestari", jenis: "Jurnal Q2", status: "approved", tanggal: "2026-01-15", jurnal: "Building & Environment", link: "https://sciencedirect.com/example", doi: "10.1016/j.buildenv.2026.001" },
];

type ViewMode = "list" | "detail";

export function PublikasiPengajuanPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedItem, setSelectedItem] = useState<PublikasiItem | null>(null);
  const [data, setData] = useState(MOCK_DATA);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmModal, setConfirmModal] = useState({ open: false, title: "", message: "", variant: "danger" as "danger" | "warning" | "success", onConfirm: () => {} });
  const [toast, setToast] = useState({ show: false, message: "" });
  const perPage = 5;

  useEffect(() => { const t = setTimeout(() => setLoading(false), 600); return () => clearTimeout(t); }, []);

  const showToast = (msg: string) => { setToast({ show: true, message: msg }); setTimeout(() => setToast((p) => ({ ...p, show: false })), 3000); };
  const canCreate = roleMatchesAny(user?.role, ["administrator", "lppm", "dosen", "kordinator-publikasi"]);
  const canReview = roleMatchesAny(user?.role, ["administrator", "lppm", "kordinator-publikasi", "ketua-lppm"]);

  const handleStatusChange = (id: string, newStatus: StatusType) => {
    setData((prev) => prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item)));
    showToast("Status berhasil diubah");
    if (selectedItem?.id === id) setSelectedItem((p) => p ? { ...p, status: newStatus } : null);
  };

  const filtered = data.filter((item) => {
    const matchSearch = item.judul.toLowerCase().includes(searchQuery.toLowerCase()) || item.penulis.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === "all" || item.status === statusFilter;
    return matchSearch && matchStatus;
  });
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  // DETAIL
  if (viewMode === "detail" && selectedItem) {
    const completeness = [
      { label: "Judul lengkap", ok: !!selectedItem.judul },
      { label: "Nama jurnal/prosiding", ok: !!selectedItem.jurnal },
      { label: "DOI/Nomor HKI", ok: !!selectedItem.doi },
      { label: "Link publikasi", ok: !!selectedItem.link },
      { label: "Bukti dokumen", ok: ["approved", "verified"].includes(selectedItem.status) },
    ];
    const completeCount = completeness.filter((c) => c.ok).length;

    return (
      <PageWrapper title="Detail Publikasi"
        breadcrumbs={[{ label: "Pengajuan" }, { label: "Publikasi", path: "/admin/publikasi-pengajuan" }, { label: selectedItem.id }]}
        actions={<button onClick={() => setViewMode("list")} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"><ChevronLeft className="w-4 h-4" /> Kembali</button>}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <StepperStatus module="publikasi" currentStatus={selectedItem.status} />
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div><span className="text-xs text-slate-400" style={{ fontWeight: 500 }}>{selectedItem.id}</span>
                  <h3 className="text-lg text-slate-900 mt-1" style={{ fontWeight: 600 }}>{selectedItem.judul}</h3></div>
                <StatusBadge status={selectedItem.status} size="md" />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                {[
                  { label: "Penulis", value: selectedItem.penulis },
                  { label: "Jenis", value: selectedItem.jenis },
                  { label: "Jurnal/Prosiding", value: selectedItem.jurnal },
                  { label: "DOI", value: selectedItem.doi || "-" },
                  { label: "Tanggal Submit", value: selectedItem.tanggal },
                ].map((f) => (
                  <div key={f.label}><p className="text-xs text-slate-400 mb-1" style={{ fontWeight: 500 }}>{f.label}</p><p className="text-sm text-slate-800" style={{ fontWeight: 500 }}>{f.value}</p></div>
                ))}
                {selectedItem.link && (
                  <div>
                    <p className="text-xs text-slate-400 mb-1" style={{ fontWeight: 500 }}>Link</p>
                    <a href={selectedItem.link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline flex items-center gap-1" style={{ fontWeight: 500 }}>
                      Buka <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Completeness Summary */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4"><FileCheck className="w-4 h-4 text-slate-600" /><h4 className="text-sm text-slate-800" style={{ fontWeight: 600 }}>Kelengkapan Submission ({completeCount}/{completeness.length})</h4></div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-4">
                <div className={`h-full rounded-full transition-all ${completeCount === completeness.length ? "bg-green-500" : "bg-amber-500"}`} style={{ width: `${(completeCount / completeness.length) * 100}%` }} />
              </div>
              <div className="space-y-2">
                {completeness.map((c) => (
                  <div key={c.label} className="flex items-center gap-2">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${c.ok ? "bg-green-500 text-white" : "bg-slate-200 text-slate-400"}`}>
                      {c.ok ? <CheckCircle className="w-3 h-3" /> : <span className="text-[10px]">-</span>}
                    </div>
                    <span className={`text-sm ${c.ok ? "text-slate-700" : "text-slate-400"}`}>{c.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Review Notes */}
            {(selectedItem.status === "revisi" || canReview) && (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex items-center gap-2 mb-4"><MessageSquare className="w-4 h-4 text-slate-600" /><h4 className="text-sm text-slate-800" style={{ fontWeight: 600 }}>Catatan Koordinator</h4></div>
                {selectedItem.status === "revisi" && (
                  <div className="p-3 bg-orange-50 border border-orange-100 rounded-lg mb-3">
                    <p className="text-xs text-orange-700 mb-1" style={{ fontWeight: 600 }}>Koordinator Publikasi</p>
                    <p className="text-sm text-orange-800">Kategori jurnal tidak sesuai dengan bukti yang dilampirkan. Mohon periksa kembali klasifikasi Q1/Q2 dan lampirkan bukti SJR/Scopus.</p>
                  </div>
                )}
                {canReview && ["submitted", "pending-review"].includes(selectedItem.status) && (
                  <textarea placeholder="Tulis catatan review..." rows={3}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E30613]/20 bg-slate-50/50 placeholder:text-slate-400 resize-none" />
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h4 className="text-sm text-slate-800 mb-3" style={{ fontWeight: 600 }}>Aksi</h4>
              <div className="space-y-2">
                {selectedItem.status === "draft" && canCreate && (
                  <button onClick={() => setConfirmModal({ open: true, title: "Submit Publikasi?", message: "Publikasi akan dikirim untuk review koordinator.", variant: "warning", onConfirm: () => handleStatusChange(selectedItem.id, "submitted") })}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700" style={{ fontWeight: 500 }}><Send className="w-4 h-4" /> Submit</button>
                )}
                {selectedItem.status === "revisi" && canCreate && (
                  <button onClick={() => handleStatusChange(selectedItem.id, "submitted")}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700" style={{ fontWeight: 500 }}><RotateCcw className="w-4 h-4" /> Submit Revisi</button>
                )}
                {["submitted", "pending-review"].includes(selectedItem.status) && canReview && (
                  <>
                    <button onClick={() => setConfirmModal({ open: true, title: "Approve?", message: "Publikasi akan disetujui.", variant: "success", onConfirm: () => handleStatusChange(selectedItem.id, "approved") })}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700" style={{ fontWeight: 500 }}><CheckCircle className="w-4 h-4" /> Approve</button>
                    <button onClick={() => handleStatusChange(selectedItem.id, "revisi")}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100" style={{ fontWeight: 500 }}><RotateCcw className="w-4 h-4" /> Minta Revisi</button>
                    <button onClick={() => setConfirmModal({ open: true, title: "Tolak?", message: "Publikasi akan ditolak.", variant: "danger", onConfirm: () => handleStatusChange(selectedItem.id, "rejected") })}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100" style={{ fontWeight: 500 }}><XCircle className="w-4 h-4" /> Tolak</button>
                  </>
                )}
                {selectedItem.status === "approved" && canReview && (
                  <button onClick={() => handleStatusChange(selectedItem.id, "verified")}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-white bg-emerald-600 rounded-lg hover:bg-emerald-700" style={{ fontWeight: 500 }}><CheckCircle className="w-4 h-4" /> Tandai Terbit</button>
                )}
              </div>
            </div>
          </div>
        </div>
        <ConfirmModal {...confirmModal} onClose={() => setConfirmModal((p) => ({ ...p, open: false }))} />
      </PageWrapper>
    );
  }

  // LIST
  return (
    <PageWrapper title="Publikasi" subtitle="Kelola pengajuan dan tracking publikasi ilmiah"
      breadcrumbs={[{ label: "Pengajuan" }, { label: "Publikasi" }]}
      actions={
        <div className="flex items-center gap-2">
          {canCreate && <button className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-[#E30613] rounded-lg hover:bg-[#c00510] active:scale-95" style={{ fontWeight: 500 }}><Plus className="w-4 h-4" /> Tambah</button>}
          <button className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50" style={{ fontWeight: 500 }}><Download className="w-4 h-4" /> Export</button>
        </div>
      }>
      {loading ? <SkeletonTable rows={5} /> : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} placeholder="Cari publikasi..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E30613]/20 placeholder:text-slate-400" />
            </div>
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }} className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-600">
              <option value="all">Semua Status</option>
              {["draft", "submitted", "pending-review", "revisi", "approved", "verified"].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          {paginated.length === 0 ? <EmptyState variant={searchQuery ? "no-results" : "no-data"} onAction={() => { setSearchQuery(""); setStatusFilter("all"); }} actionLabel="Reset" /> : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead><tr className="border-b border-slate-100">
                    {["ID", "Judul Publikasi", "Penulis", "Jenis", "Status", "Aksi"].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-xs text-slate-500 whitespace-nowrap" style={{ fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody className="divide-y divide-slate-50">
                    {paginated.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50">
                        <td className="px-5 py-3.5 text-sm text-slate-500" style={{ fontWeight: 500 }}>{item.id}</td>
                        <td className="px-5 py-3.5"><button onClick={() => { setSelectedItem(item); setViewMode("detail"); }} className="text-sm text-slate-800 hover:text-[#E30613] text-left max-w-[280px] truncate block" style={{ fontWeight: 500 }}>{item.judul}</button><p className="text-xs text-slate-400 mt-0.5">{item.jurnal} &middot; {item.tanggal}</p></td>
                        <td className="px-5 py-3.5 text-sm text-slate-600 whitespace-nowrap">{item.penulis}</td>
                        <td className="px-5 py-3.5"><span className="text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full" style={{ fontWeight: 500 }}>{item.jenis}</span></td>
                        <td className="px-5 py-3.5 whitespace-nowrap"><StatusBadge status={item.status} /></td>
                        <td className="px-5 py-3.5"><button onClick={() => { setSelectedItem(item); setViewMode("detail"); }} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md"><Eye className="w-4 h-4" /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
                <p className="text-xs text-slate-500">Menampilkan {(currentPage - 1) * perPage + 1}-{Math.min(currentPage * perPage, filtered.length)} dari {filtered.length}</p>
                <div className="flex items-center gap-1">
                  <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-1.5 text-slate-400 disabled:opacity-30"><ChevronLeft className="w-4 h-4" /></button>
                  {Array.from({ length: totalPages }).map((_, i) => <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-8 h-8 text-xs rounded-md ${currentPage === i + 1 ? "bg-[#E30613] text-white" : "text-slate-600 hover:bg-slate-100"}`} style={{ fontWeight: 500 }}>{i + 1}</button>)}
                  <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-1.5 text-slate-400 disabled:opacity-30"><ChevronRight className="w-4 h-4" /></button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
      {toast.show && <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg border bg-green-50 border-green-200 text-green-700"><CheckCircle className="w-4 h-4" /><span className="text-sm" style={{ fontWeight: 500 }}>{toast.message}</span></div>}
      <ConfirmModal {...confirmModal} onClose={() => setConfirmModal((p) => ({ ...p, open: false }))} />
    </PageWrapper>
  );
}
