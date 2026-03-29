import { useState, useEffect } from "react";
import { Plus, Search, Eye, Edit, Send, CheckCircle, XCircle, RotateCcw, ChevronLeft, ChevronRight, Download, DollarSign, MessageSquare } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { roleMatchesAny } from "../config/roleTemplates";
import { PageWrapper } from "../components/PageWrapper";
import { StatusBadge, type StatusType } from "../components/StatusBadge";
import { EmptyState } from "../components/EmptyState";
import { ConfirmModal } from "../components/ConfirmModal";
import { SkeletonTable } from "../components/SkeletonLoader";
import { StepperStatus } from "../components/StepperStatus";

interface KonferensiItem {
  id: string; judul: string; peserta: string; jenis: string; biaya: number; status: StatusType; tanggal: string; lokasi: string;
}

const MOCK_DATA: KonferensiItem[] = [
  { id: "KNF-001", judul: "ICALT 2026 - International Conference on Advanced Learning Technologies", peserta: "Dr. Arif Ramadhan", jenis: "Internasional", biaya: 15000000, status: "submitted", tanggal: "2026-03-15", lokasi: "Singapura" },
  { id: "KNF-002", judul: "Seminar Nasional Informatika SENASTI 2026", peserta: "Dr. Rina Wulandari", jenis: "Nasional", biaya: 3500000, status: "approved", tanggal: "2026-04-10", lokasi: "Jakarta" },
  { id: "KNF-003", judul: "IEEE ICCE 2026 - Consumer Electronics", peserta: "Prof. Dimas Prakoso", jenis: "Internasional", biaya: 20000000, status: "pending-review", tanggal: "2026-05-20", lokasi: "Las Vegas" },
  { id: "KNF-004", judul: "Workshop Big Data Analytics for Education", peserta: "Dr. Fajar Nugroho", jenis: "Workshop", biaya: 2000000, status: "draft", tanggal: "2026-06-01", lokasi: "Bandung" },
  { id: "KNF-005", judul: "Konferensi Nasional Pengabdian Masyarakat", peserta: "Dr. Lestari Handayani", jenis: "Nasional", biaya: 4500000, status: "revisi", tanggal: "2026-03-25", lokasi: "Surabaya" },
  { id: "KNF-006", judul: "ACM CHI 2026 Conference", peserta: "Dr. Dewi Lestari", jenis: "Internasional", biaya: 25000000, status: "verified", tanggal: "2026-04-15", lokasi: "Montreal" },
];

type ViewMode = "list" | "detail";

export function KonferensiPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedItem, setSelectedItem] = useState<KonferensiItem | null>(null);
  const [data, setData] = useState(MOCK_DATA);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewNote, setReviewNote] = useState("");
  const [confirmModal, setConfirmModal] = useState({ open: false, title: "", message: "", variant: "danger" as "danger" | "warning" | "success", onConfirm: () => {} });
  const [toast, setToast] = useState({ show: false, message: "" });
  const perPage = 5;

  useEffect(() => { const t = setTimeout(() => setLoading(false), 600); return () => clearTimeout(t); }, []);

  const showToast = (msg: string) => { setToast({ show: true, message: msg }); setTimeout(() => setToast((p) => ({ ...p, show: false })), 3000); };
  const canCreate = roleMatchesAny(user?.role, ["administrator", "lppm", "dosen", "kordinator-riset"]);
  const canReview = roleMatchesAny(user?.role, ["administrator", "lppm", "kordinator-riset", "ketua-lppm"]);
  const canFinance = roleMatchesAny(user?.role, ["administrator", "finance"]);
  const formatCurrency = (val: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val);

  const handleStatusChange = (id: string, newStatus: StatusType) => {
    setData((prev) => prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item)));
    showToast("Status berhasil diubah");
    if (selectedItem?.id === id) setSelectedItem((p) => p ? { ...p, status: newStatus } : null);
  };

  const filtered = data.filter((item) => {
    const matchSearch = item.judul.toLowerCase().includes(searchQuery.toLowerCase()) || item.peserta.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === "all" || item.status === statusFilter;
    return matchSearch && matchStatus;
  });
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  // DETAIL
  if (viewMode === "detail" && selectedItem) {
    return (
      <PageWrapper title="Detail Konferensi"
        breadcrumbs={[{ label: "Pengajuan" }, { label: "Konferensi", path: "/admin/konferensi" }, { label: selectedItem.id }]}
        actions={<button onClick={() => setViewMode("list")} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"><ChevronLeft className="w-4 h-4" /> Kembali</button>}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <StepperStatus module="konferensi" currentStatus={selectedItem.status} />
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div><span className="text-xs text-slate-400" style={{ fontWeight: 500 }}>{selectedItem.id}</span>
                  <h3 className="text-lg text-slate-900 mt-1" style={{ fontWeight: 600 }}>{selectedItem.judul}</h3></div>
                <StatusBadge status={selectedItem.status} size="md" />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                {[
                  { label: "Peserta", value: selectedItem.peserta },
                  { label: "Jenis", value: selectedItem.jenis },
                  { label: "Lokasi", value: selectedItem.lokasi },
                  { label: "Biaya", value: formatCurrency(selectedItem.biaya) },
                  { label: "Tanggal", value: selectedItem.tanggal },
                ].map((f) => (
                  <div key={f.label}><p className="text-xs text-slate-400 mb-1" style={{ fontWeight: 500 }}>{f.label}</p><p className="text-sm text-slate-800" style={{ fontWeight: 500 }}>{f.value}</p></div>
                ))}
              </div>
            </div>

            {/* Finance Block */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4"><DollarSign className="w-4 h-4 text-slate-600" /><h4 className="text-sm text-slate-800" style={{ fontWeight: 600 }}>Rincian Biaya</h4></div>
              <div className="space-y-2">
                {[
                  { item: "Registration Fee", amount: selectedItem.biaya * 0.4 },
                  { item: "Transportasi", amount: selectedItem.biaya * 0.35 },
                  { item: "Akomodasi", amount: selectedItem.biaya * 0.2 },
                  { item: "Lainnya", amount: selectedItem.biaya * 0.05 },
                ].map((b) => (
                  <div key={b.item} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                    <span className="text-sm text-slate-600">{b.item}</span>
                    <span className="text-sm text-slate-700" style={{ fontWeight: 500 }}>{formatCurrency(Math.round(b.amount))}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-2"><span className="text-sm text-slate-800" style={{ fontWeight: 600 }}>Total</span><span className="text-sm text-[#E30613]" style={{ fontWeight: 700 }}>{formatCurrency(selectedItem.biaya)}</span></div>
              </div>
            </div>

            {/* Review Notes */}
            {(canReview || selectedItem.status === "revisi") && (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex items-center gap-2 mb-4"><MessageSquare className="w-4 h-4 text-slate-600" /><h4 className="text-sm text-slate-800" style={{ fontWeight: 600 }}>Catatan</h4></div>
                {selectedItem.status === "revisi" && (
                  <div className="p-3 bg-orange-50 border border-orange-100 rounded-lg mb-3">
                    <p className="text-xs text-orange-700 mb-1" style={{ fontWeight: 600 }}>Koordinator Riset</p>
                    <p className="text-sm text-orange-800">Bukti pembayaran registration fee belum dilampirkan. Mohon upload bukti transfer.</p>
                  </div>
                )}
                {canReview && ["submitted", "pending-review"].includes(selectedItem.status) && (
                  <textarea value={reviewNote} onChange={(e) => setReviewNote(e.target.value)} placeholder="Tulis catatan..." rows={3}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E30613]/20 bg-slate-50/50 placeholder:text-slate-400 resize-none" />
                )}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h4 className="text-sm text-slate-800 mb-3" style={{ fontWeight: 600 }}>Aksi</h4>
              <div className="space-y-2">
                {selectedItem.status === "draft" && canCreate && (
                  <button onClick={() => setConfirmModal({ open: true, title: "Submit?", message: "Pengajuan konferensi akan dikirim.", variant: "warning", onConfirm: () => handleStatusChange(selectedItem.id, "submitted") })}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700" style={{ fontWeight: 500 }}><Send className="w-4 h-4" /> Submit</button>
                )}
                {selectedItem.status === "revisi" && canCreate && (
                  <button onClick={() => handleStatusChange(selectedItem.id, "submitted")}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700" style={{ fontWeight: 500 }}><RotateCcw className="w-4 h-4" /> Submit Revisi</button>
                )}
                {["submitted", "pending-review"].includes(selectedItem.status) && canReview && (
                  <>
                    <button onClick={() => setConfirmModal({ open: true, title: "Approve?", message: "Konferensi akan disetujui.", variant: "success", onConfirm: () => handleStatusChange(selectedItem.id, "approved") })}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700" style={{ fontWeight: 500 }}><CheckCircle className="w-4 h-4" /> Approve</button>
                    <button onClick={() => { if (!reviewNote.trim()) { showToast("Catatan wajib diisi untuk revisi"); return; } handleStatusChange(selectedItem.id, "revisi"); }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100" style={{ fontWeight: 500 }}><RotateCcw className="w-4 h-4" /> Minta Revisi</button>
                    <button onClick={() => { if (!reviewNote.trim()) { showToast("Alasan tolak wajib diisi"); return; } setConfirmModal({ open: true, title: "Tolak?", message: "Pengajuan akan ditolak.", variant: "danger", onConfirm: () => handleStatusChange(selectedItem.id, "rejected") }); }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100" style={{ fontWeight: 500 }}><XCircle className="w-4 h-4" /> Tolak</button>
                  </>
                )}
                {selectedItem.status === "approved" && canFinance && (
                  <button onClick={() => handleStatusChange(selectedItem.id, "verified")}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-white bg-emerald-600 rounded-lg hover:bg-emerald-700" style={{ fontWeight: 500 }}><CheckCircle className="w-4 h-4" /> Verifikasi Finance</button>
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
    <PageWrapper title="Konferensi" subtitle="Kelola pengajuan dan partisipasi konferensi"
      breadcrumbs={[{ label: "Pengajuan" }, { label: "Konferensi" }]}
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
              <input type="text" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} placeholder="Cari konferensi..."
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
                    {["ID", "Konferensi", "Peserta", "Jenis", "Biaya", "Status", "Aksi"].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-xs text-slate-500 whitespace-nowrap" style={{ fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody className="divide-y divide-slate-50">
                    {paginated.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50">
                        <td className="px-5 py-3.5 text-sm text-slate-500" style={{ fontWeight: 500 }}>{item.id}</td>
                        <td className="px-5 py-3.5"><button onClick={() => { setSelectedItem(item); setViewMode("detail"); }} className="text-sm text-slate-800 hover:text-[#E30613] text-left max-w-[250px] truncate block" style={{ fontWeight: 500 }}>{item.judul}</button><p className="text-xs text-slate-400 mt-0.5">{item.tanggal} &middot; {item.lokasi}</p></td>
                        <td className="px-5 py-3.5 text-sm text-slate-600 whitespace-nowrap">{item.peserta}</td>
                        <td className="px-5 py-3.5 text-sm text-slate-600 whitespace-nowrap">{item.jenis}</td>
                        <td className="px-5 py-3.5 text-sm text-slate-700 whitespace-nowrap" style={{ fontWeight: 500 }}>{formatCurrency(item.biaya)}</td>
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
