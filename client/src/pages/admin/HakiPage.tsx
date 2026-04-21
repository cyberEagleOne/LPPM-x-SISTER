import { useState } from "react";
import { Plus, Search, Filter, Eye, Edit, Trash2, CheckCircle, XCircle, ChevronLeft, ChevronRight, Award, Download, Clock, Send, RotateCcw } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { roleMatchesAny } from "../../config/roleTemplates";
import { PageWrapper } from "../../components/admin/PageWrapper";
import { StatusBadge, type StatusType } from "../../components/admin/StatusBadge";
import { EmptyState } from "../../components/admin/EmptyState";
import { ConfirmModal } from "../../components/admin/ConfirmModal";

interface HakiItem {
  id: string;
  judul: string;
  pencipta: string;
  jenis: string;
  sub_jenis: string;
  tahun: number;
  no_pendaftaran?: string;
  status: StatusType;
  tanggal: string;
  prodi: string;
}

const MOCK_HAKI: HakiItem[] = [
  { id: "HKI-001", judul: "Sistem Monitoring IoT untuk Smart Building berbasis AI", pencipta: "Dr. Arif Ramadhan, M.Sc.", jenis: "Paten", sub_jenis: "Paten Biasa", tahun: 2025, no_pendaftaran: "P00202500123", status: "approved", tanggal: "2025-06-15", prodi: "Teknik Informatika" },
  { id: "HKI-002", judul: "Aplikasi Mobile Deteksi Penyakit Tanaman berbasis Deep Learning", pencipta: "Dr. Rina Wulandari", jenis: "Hak Cipta", sub_jenis: "Program Komputer", tahun: 2025, no_pendaftaran: "HC20250045678", status: "verified", tanggal: "2025-05-20", prodi: "Teknik Informatika" },
  { id: "HKI-003", judul: "Modul Pembelajaran Interaktif AR/VR untuk Teknik Sipil", pencipta: "Prof. Ahmad Surya", jenis: "Hak Cipta", sub_jenis: "Karya Tulis", tahun: 2025, status: "submitted", tanggal: "2025-04-10", prodi: "Teknik Sipil" },
  { id: "HKI-004", judul: "Alat Penyaring Air Portable Tenaga Surya", pencipta: "Dr. Dewi Kartika", jenis: "Paten Sederhana", sub_jenis: "Paten Sederhana", tahun: 2024, status: "pending-review", tanggal: "2024-12-05", prodi: "Teknik Industri" },
  { id: "HKI-005", judul: "Desain Kemasan Produk UMKM Ramah Lingkungan", pencipta: "Dr. Fajar Nugroho", jenis: "Desain Industri", sub_jenis: "Desain Produk", tahun: 2024, status: "draft", tanggal: "2024-11-20", prodi: "Desain Komunikasi Visual" },
  { id: "HKI-006", judul: "Brand Identity System Pradita Research Center", pencipta: "Dr. Faisal Rahman", jenis: "Merek Dagang", sub_jenis: "Jasa", tahun: 2024, status: "revisi", tanggal: "2024-10-15", prodi: "Desain Komunikasi Visual" },
];

const JENIS_HAKI = ["Hak Cipta", "Paten", "Paten Sederhana", "Desain Industri", "Merek Dagang", "Rahasia Dagang"];

export function HakiPage() {
  const { user } = useAuth();
  const [data, setData] = useState(MOCK_HAKI);
  const [view, setView] = useState<"list" | "detail" | "form">("list");
  const [selected, setSelected] = useState<HakiItem | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [jenisFilter, setJenisFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [confirmModal, setConfirmModal] = useState<{ open: boolean; title: string; message: string; variant: "danger" | "warning" | "success"; onConfirm: () => void }>({ open: false, title: "", message: "", variant: "danger", onConfirm: () => {} });
  const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "error" }>({ show: false, message: "", type: "success" });

  const [formData, setFormData] = useState({ judul: "", jenis: "Hak Cipta", sub_jenis: "", tahun: 2025 });

  const perPage = 6;
  const isDosen = roleMatchesAny(user?.role, ["dosen", "internal"]);
  const isAdmin = roleMatchesAny(user?.role, ["administrator", "lppm", "ketua-lppm", "kordinator-publikasi"]);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast(p => ({ ...p, show: false })), 3000);
  };

  const handleStatusChange = (id: string, status: StatusType) => {
    setData(prev => prev.map(d => d.id === id ? { ...d, status } : d));
    showToast("Status berhasil diperbarui");
    setView("list");
  };

  const handleDelete = (id: string) => {
    setData(prev => prev.filter(d => d.id !== id));
    showToast("Data berhasil dihapus");
  };

  const filtered = data.filter(d => {
    const matchSearch = d.judul.toLowerCase().includes(search.toLowerCase()) || d.pencipta.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || d.status === statusFilter;
    const matchJenis = jenisFilter === "all" || d.jenis === jenisFilter;
    return matchSearch && matchStatus && matchJenis;
  });

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  // DETAIL VIEW
  if (view === "detail" && selected) {
    return (
      <PageWrapper
        title="Detail HKI"
        breadcrumbs={[{ label: "HAKI" }, { label: selected.id }]}
        actions={<button onClick={() => setView("list")} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"><ChevronLeft className="w-4 h-4" /> Kembali</button>}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <span className="text-xs text-slate-400 font-medium">{selected.id}</span>
                <h3 className="text-lg font-semibold text-slate-900 mt-1">{selected.judul}</h3>
              </div>
              <StatusBadge status={selected.status} size="md" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Pencipta/Inventor", value: selected.pencipta },
                { label: "Jenis HKI", value: selected.jenis },
                { label: "Sub Jenis", value: selected.sub_jenis },
                { label: "Tahun", value: String(selected.tahun) },
                { label: "Program Studi", value: selected.prodi },
                { label: "No. Pendaftaran", value: selected.no_pendaftaran || "- (Belum didaftarkan)" },
                { label: "Tanggal Pengajuan", value: selected.tanggal },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs text-slate-400 font-medium mb-1">{label}</p>
                  <p className="text-sm text-slate-800 font-medium">{value}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Actions */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h4 className="text-sm font-semibold text-slate-800 mb-3">Aksi</h4>
              <div className="space-y-2">
                {selected.status === "draft" && isDosen && (
                  <button onClick={() => handleStatusChange(selected.id, "submitted")} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-white bg-blue-600 rounded-lg font-medium hover:bg-blue-700">
                    <Send className="w-4 h-4" /> Submit ke LPPM
                  </button>
                )}
                {selected.status === "revisi" && isDosen && (
                  <button onClick={() => handleStatusChange(selected.id, "submitted")} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-white bg-indigo-600 rounded-lg font-medium hover:bg-indigo-700">
                    <RotateCcw className="w-4 h-4" /> Submit Ulang
                  </button>
                )}
                {(selected.status === "submitted" || selected.status === "pending-review") && isAdmin && (
                  <>
                    <button onClick={() => handleStatusChange(selected.id, "approved")} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-white bg-green-600 rounded-lg font-medium hover:bg-green-700">
                      <CheckCircle className="w-4 h-4" /> Setujui & Proses ke DJKI
                    </button>
                    <button onClick={() => handleStatusChange(selected.id, "revisi")} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-orange-600 bg-orange-50 rounded-lg font-medium hover:bg-orange-100">
                      <RotateCcw className="w-4 h-4" /> Minta Revisi
                    </button>
                    <button onClick={() => setConfirmModal({ open: true, title: "Tolak?", message: "Pengajuan HKI akan ditolak.", variant: "danger", onConfirm: () => handleStatusChange(selected.id, "rejected") })} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 bg-red-50 rounded-lg font-medium hover:bg-red-100">
                      <XCircle className="w-4 h-4" /> Tolak
                    </button>
                  </>
                )}
                {selected.status === "approved" && isAdmin && (
                  <button onClick={() => handleStatusChange(selected.id, "verified")} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-white bg-emerald-600 rounded-lg font-medium hover:bg-emerald-700">
                    <CheckCircle className="w-4 h-4" /> Tandai Terdaftar DJKI
                  </button>
                )}
                <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 bg-slate-100 rounded-lg font-medium hover:bg-slate-200">
                  <Download className="w-4 h-4" /> Download Dokumen
                </button>
              </div>
            </div>
          </div>
        </div>
        <ConfirmModal {...confirmModal} onClose={() => setConfirmModal(p => ({ ...p, open: false }))} />
      </PageWrapper>
    );
  }

  // FORM VIEW 
  if (view === "form") {
    return (
      <PageWrapper
        title="Daftarkan HKI Baru"
        breadcrumbs={[{ label: "HAKI" }, { label: "Daftar Ciptaan Baru" }]}
        actions={<button onClick={() => setView("list")} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"><ChevronLeft className="w-4 h-4" /> Batal</button>}
      >
        <form onSubmit={(e) => {
          e.preventDefault();
          const newItem: HakiItem = {
            id: `HKI-${String(data.length + 1).padStart(3, "0")}`,
            judul: formData.judul, pencipta: user?.name || "", jenis: formData.jenis,
            sub_jenis: formData.sub_jenis, tahun: formData.tahun, status: "draft",
            tanggal: new Date().toISOString().split("T")[0], prodi: user?.prodi || "",
          };
          setData(prev => [newItem, ...prev]);
          showToast("HKI berhasil disimpan sebagai draft");
          setView("list");
        }} className="max-w-2xl bg-white rounded-xl border border-slate-200 p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Judul Ciptaan/Invensi <span className="text-red-500">*</span></label>
            <input type="text" value={formData.judul} required onChange={e => setFormData(p => ({ ...p, judul: e.target.value }))} placeholder="Masukkan judul" className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50/50" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Jenis HKI</label>
              <select value={formData.jenis} onChange={e => setFormData(p => ({ ...p, jenis: e.target.value }))} className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50/50">
                {JENIS_HAKI.map(j => <option key={j}>{j}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Tahun</label>
              <input type="number" value={formData.tahun} onChange={e => setFormData(p => ({ ...p, tahun: Number(e.target.value) }))} className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50/50" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Sub Jenis / Keterangan</label>
            <input type="text" value={formData.sub_jenis} onChange={e => setFormData(p => ({ ...p, sub_jenis: e.target.value }))} placeholder="Contoh: Program Komputer, Karya Tulis" className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50/50" />
          </div>
          <div className="flex gap-3 border-t border-slate-100 pt-4">
            <button type="submit" className="px-6 py-2.5 text-sm text-white bg-[#E30613] rounded-lg hover:bg-[#c00510] font-medium">Simpan Draft</button>
            <button type="button" onClick={() => setView("list")} className="px-6 py-2.5 text-sm text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 font-medium">Batal</button>
          </div>
        </form>
      </PageWrapper>
    );
  }

  // LIST VIEW
  return (
    <PageWrapper
      title="HAKI (Hak Kekayaan Intelektual)"
      subtitle="Kelola pendaftaran hak kekayaan intelektual civitas akademika"
      breadcrumbs={[{ label: "HAKI" }]}
      actions={
        <div className="flex items-center gap-2">
          <button onClick={() => setView("form")} className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-[#E30613] rounded-lg hover:bg-[#c00510] font-medium">
            <Plus className="w-4 h-4" /> Daftar Ciptaan Baru
          </button>
          {isAdmin && <button className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 font-medium"><Download className="w-4 h-4" /> Export</button>}
        </div>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Hak Cipta", count: data.filter(d => d.jenis === "Hak Cipta").length, icon: Award, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Paten", count: data.filter(d => d.jenis.includes("Paten")).length, icon: Award, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Terdaftar DJKI", count: data.filter(d => d.status === "verified").length, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
          { label: "Pending Review", count: data.filter(d => d.status === "pending-review" || d.status === "submitted").length, icon: Clock, color: "text-orange-600", bg: "bg-orange-50" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-500 font-medium">{s.label}</span>
              <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center`}><s.icon className={`w-4 h-4 ${s.color}`} /></div>
            </div>
            <div className="text-2xl font-bold text-slate-900">{s.count}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Cari judul, pencipta..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E30613]/20 placeholder:text-slate-400" />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select value={jenisFilter} onChange={e => { setJenisFilter(e.target.value); setPage(1); }} className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-600">
              <option value="all">Semua Jenis</option>
              {JENIS_HAKI.map(j => <option key={j}>{j}</option>)}
            </select>
            <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-600">
              <option value="all">Semua Status</option>
              <option value="draft">Draft</option>
              <option value="submitted">Submitted</option>
              <option value="pending-review">Pending</option>
              <option value="approved">Disetujui</option>
              <option value="verified">Terdaftar</option>
              <option value="rejected">Ditolak</option>
            </select>
          </div>
        </div>
        {paginated.length === 0 ? (
          <EmptyState variant="no-data" actionLabel="Daftar Ciptaan Baru" onAction={() => setView("form")} />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    {["ID", "Judul", "Pencipta", "Jenis", "Tahun", "Status", "Aksi"].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-xs text-slate-500 font-semibold whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {paginated.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3.5 text-xs text-slate-400 font-medium whitespace-nowrap">{item.id}</td>
                      <td className="px-5 py-3.5">
                        <button onClick={() => { setSelected(item); setView("detail"); }} className="text-sm text-slate-800 hover:text-[#E30613] font-medium text-left max-w-[240px] truncate block">{item.judul}</button>
                        <p className="text-xs text-slate-400 mt-0.5">{item.sub_jenis || item.jenis}</p>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-slate-600 whitespace-nowrap">{item.pencipta}</td>
                      <td className="px-5 py-3.5"><span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">{item.jenis}</span></td>
                      <td className="px-5 py-3.5 text-sm text-slate-600">{item.tahun}</td>
                      <td className="px-5 py-3.5"><StatusBadge status={item.status} /></td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1">
                          <button onClick={() => { setSelected(item); setView("detail"); }} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Detail"><Eye className="w-4 h-4" /></button>
                          {item.status === "draft" && <button className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors" title="Edit"><Edit className="w-4 h-4" /></button>}
                          {item.status === "draft" && <button onClick={() => setConfirmModal({ open: true, title: "Hapus?", message: `Hapus HKI "${item.judul}"?`, variant: "danger", onConfirm: () => handleDelete(item.id) })} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Hapus"><Trash2 className="w-4 h-4" /></button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
              <p className="text-xs text-slate-500">Menampilkan {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} dari {filtered.length}</p>
              <div className="flex items-center gap-1">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded-md"><ChevronLeft className="w-4 h-4" /></button>
                {Array.from({ length: totalPages }).map((_, i) => (<button key={i} onClick={() => setPage(i + 1)} className={`w-8 h-8 text-xs rounded-md font-medium ${page === i + 1 ? "bg-[#E30613] text-white" : "text-slate-600 hover:bg-slate-100"}`}>{i + 1}</button>))}
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
