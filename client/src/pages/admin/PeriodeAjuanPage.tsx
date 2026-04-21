import { useState } from "react";
import { Calendar, Plus, Edit, Trash2, CheckCircle, XCircle, Clock, Eye, ChevronLeft } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { roleMatchesAny } from "../../config/roleTemplates";
import { PageWrapper } from "../../components/admin/PageWrapper";
import { ConfirmModal } from "../../components/admin/ConfirmModal";
import { useSearchParams } from "react-router";

type JenisPeriode = "hibah" | "st" | "insentif" | "laporan";

interface PeriodeItem {
  id: string;
  nama: string;
  jenis: JenisPeriode;
  tanggal_buka: string;
  tanggal_tutup: string;
  tahun: number;
  status: "aktif" | "ditutup" | "akan-datang";
  keterangan: string;
}

const MOCK_PERIODE: PeriodeItem[] = [
  { id: "PER-001", nama: "Periode Hibah Penelitian 2026", jenis: "hibah", tanggal_buka: "2026-01-15", tanggal_tutup: "2026-03-31", tahun: 2026, status: "aktif", keterangan: "Periode pengajuan hibah penelitian internal semester genap 2026" },
  { id: "PER-002", nama: "Periode Hibah Pengabdian 2026", jenis: "hibah", tanggal_buka: "2026-02-01", tanggal_tutup: "2026-04-30", tahun: 2026, status: "aktif", keterangan: "Periode pengajuan hibah PKM internal 2026" },
  { id: "PER-003", nama: "Periode Surat Tugas Q1 2026", jenis: "st", tanggal_buka: "2026-01-02", tanggal_tutup: "2026-03-31", tahun: 2026, status: "aktif", keterangan: "Periode pengajuan surat tugas untuk kegiatan kuartal 1 2026" },
  { id: "PER-004", nama: "Periode Insentif Publikasi 2025", jenis: "insentif", tanggal_buka: "2025-10-01", tanggal_tutup: "2025-12-31", tahun: 2025, status: "ditutup", keterangan: "Periode pengajuan insentif publikasi tahun 2025 (sudah ditutup)" },
  { id: "PER-005", nama: "Periode Pelaporan Hibah 2025", jenis: "laporan", tanggal_buka: "2025-12-01", tanggal_tutup: "2026-01-31", tahun: 2026, status: "ditutup", keterangan: "Periode pelaporan akhir kegiatan hibah penelitian 2025" },
  { id: "PER-006", nama: "Periode Hibah Penelitian Semester Ganjil 2026", jenis: "hibah", tanggal_buka: "2026-07-01", tanggal_tutup: "2026-09-30", tahun: 2026, status: "akan-datang", keterangan: "Periode pengajuan hibah penelitian semester ganjil 2026/2027" },
];

const JENIS_LABELS: Record<JenisPeriode, string> = {
  hibah: "Hibah Internal",
  st: "Surat Tugas",
  insentif: "Insentif Publikasi",
  laporan: "Pelaporan Kegiatan",
};

const STATUS_CONFIG = {
  "aktif": { label: "Aktif", bg: "bg-green-100", text: "text-green-700", dot: "bg-green-500" },
  "ditutup": { label: "Ditutup", bg: "bg-slate-100", text: "text-slate-500", dot: "bg-slate-400" },
  "akan-datang": { label: "Akan Datang", bg: "bg-blue-100", text: "text-blue-700", dot: "bg-blue-500" },
};

function StatusPill({ status }: { status: PeriodeItem["status"] }) {
  const c = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

export function PeriodeAjuanPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const jenisFocus = (searchParams.get("jenis") || "hibah") as JenisPeriode;

  const [data, setData] = useState(MOCK_PERIODE);
  const [view, setView] = useState<"list" | "form">("list");
  const [editItem, setEditItem] = useState<PeriodeItem | null>(null);
  const [activeTab, setActiveTab] = useState<JenisPeriode>(jenisFocus);
  const [confirmModal, setConfirmModal] = useState<{ open: boolean; title: string; message: string; variant: "danger" | "warning" | "success"; onConfirm: () => void }>({ open: false, title: "", message: "", variant: "danger", onConfirm: () => {} });
  const [toast, setToast] = useState<{ show: boolean; message: string }>({ show: false, message: "" });

  const [formData, setFormData] = useState({
    nama: "", jenis: "hibah" as JenisPeriode, tanggal_buka: "", tanggal_tutup: "", tahun: 2026, keterangan: "",
  });

  const isAdmin = roleMatchesAny(user?.role, ["administrator", "lppm", "ketua-lppm"]);

  const showToast = (message: string) => {
    setToast({ show: true, message });
    setTimeout(() => setToast(p => ({ ...p, show: false })), 3000);
  };

  const filtered = data.filter(d => d.jenis === activeTab);

  const handleDelete = (id: string) => {
    setData(prev => prev.filter(d => d.id !== id));
    showToast("Periode berhasil dihapus");
  };

  const handleToggle = (id: string) => {
    setData(prev => prev.map(d => {
      if (d.id !== id) return d;
      return { ...d, status: d.status === "aktif" ? "ditutup" : "aktif" };
    }));
    showToast("Status periode diperbarui");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editItem) {
      setData(prev => prev.map(d => d.id === editItem.id ? { ...d, ...formData, status: "aktif" as const } : d));
      showToast("Periode berhasil diperbarui");
    } else {
      const newItem: PeriodeItem = {
        id: `PER-${String(data.length + 1).padStart(3, "0")}`,
        ...formData,
        status: "akan-datang",
      };
      setData(prev => [newItem, ...prev]);
      showToast("Periode baru berhasil ditambahkan");
    }
    setView("list");
    setEditItem(null);
  };

  if (view === "form") {
    return (
      <PageWrapper
        title={editItem ? "Edit Periode Ajuan" : "Tambah Periode Ajuan"}
        breadcrumbs={[{ label: "Periode Ajuan" }, { label: editItem ? "Edit" : "Tambah Baru" }]}
        actions={<button onClick={() => { setView("list"); setEditItem(null); }} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"><ChevronLeft className="w-4 h-4" /> Batal</button>}
      >
        <form onSubmit={handleSubmit} className="max-w-2xl bg-white rounded-xl border border-slate-200 p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama Periode <span className="text-red-500">*</span></label>
            <input type="text" value={formData.nama} required onChange={e => setFormData(p => ({ ...p, nama: e.target.value }))}
              placeholder="Contoh: Periode Hibah Penelitian 2026"
              className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E30613]/20 bg-slate-50/50" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Jenis Periode</label>
              <select value={formData.jenis} onChange={e => setFormData(p => ({ ...p, jenis: e.target.value as JenisPeriode }))}
                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50/50">
                {Object.entries(JENIS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Tahun</label>
              <input type="number" value={formData.tahun} onChange={e => setFormData(p => ({ ...p, tahun: Number(e.target.value) }))}
                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50/50" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Tanggal Buka <span className="text-red-500">*</span></label>
              <input type="date" value={formData.tanggal_buka} required onChange={e => setFormData(p => ({ ...p, tanggal_buka: e.target.value }))}
                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50/50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Tanggal Tutup <span className="text-red-500">*</span></label>
              <input type="date" value={formData.tanggal_tutup} required onChange={e => setFormData(p => ({ ...p, tanggal_tutup: e.target.value }))}
                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50/50" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Keterangan</label>
            <textarea value={formData.keterangan} onChange={e => setFormData(p => ({ ...p, keterangan: e.target.value }))}
              rows={3} placeholder="Deskripsi tambahan tentang periode ini"
              className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50/50 resize-none" />
          </div>
          <div className="flex gap-3 pt-2 border-t border-slate-100">
            <button type="submit" className="px-6 py-2.5 text-sm text-white bg-[#E30613] rounded-lg hover:bg-[#c00510] font-medium">Simpan</button>
            <button type="button" onClick={() => { setView("list"); setEditItem(null); }} className="px-6 py-2.5 text-sm text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 font-medium">Batal</button>
          </div>
        </form>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title="Manajemen Periode Ajuan"
      subtitle="Kelola periode buka/tutup pengajuan hibah, surat tugas, dan insentif"
      breadcrumbs={[{ label: "Periode Ajuan" }]}
      actions={isAdmin && (
        <button onClick={() => { setFormData({ nama: "", jenis: activeTab, tanggal_buka: "", tanggal_tutup: "", tahun: 2026, keterangan: "" }); setView("form"); }}
          className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-[#E30613] rounded-lg hover:bg-[#c00510] font-medium">
          <Plus className="w-4 h-4" /> Tambah Periode
        </button>
      )}
    >
      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-slate-100 rounded-xl w-fit mb-6">
        {(Object.entries(JENIS_LABELS) as [JenisPeriode, string][]).map(([key, label]) => (
          <button key={key} onClick={() => setActiveTab(key)}
            className={`px-4 py-2 text-sm rounded-lg transition-all font-medium ${activeTab === key ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 py-16 text-center">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">Belum ada periode untuk jenis ini</p>
            {isAdmin && (
              <button onClick={() => { setFormData({ nama: "", jenis: activeTab, tanggal_buka: "", tanggal_tutup: "", tahun: 2026, keterangan: "" }); setView("form"); }}
                className="mt-4 px-4 py-2 text-sm text-white bg-[#E30613] rounded-lg font-medium">
                Tambah Periode Baru
              </button>
            )}
          </div>
        ) : (
          filtered.map(item => (
            <div key={item.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-sm font-semibold text-slate-800">{item.nama}</h3>
                    <StatusPill status={item.status} />
                    <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{item.tahun}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1.5">{item.keterangan}</p>
                  <div className="flex items-center gap-6 mt-3">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Buka: <strong className="text-slate-700">{item.tanggal_buka}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Tutup: <strong className="text-slate-700">{item.tanggal_tutup}</strong></span>
                    </div>
                  </div>
                </div>
                {isAdmin && (
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => handleToggle(item.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${item.status === "aktif" ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-green-50 text-green-600 hover:bg-green-100"}`}>
                      {item.status === "aktif" ? <><XCircle className="w-3.5 h-3.5" /> Tutup</> : <><CheckCircle className="w-3.5 h-3.5" /> Buka</>}
                    </button>
                    <button onClick={() => {
                      setEditItem(item);
                      setFormData({ nama: item.nama, jenis: item.jenis, tanggal_buka: item.tanggal_buka, tanggal_tutup: item.tanggal_tutup, tahun: item.tahun, keterangan: item.keterangan });
                      setView("form");
                    }} className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => setConfirmModal({ open: true, title: "Hapus Periode?", message: `Hapus periode "${item.nama}"?`, variant: "danger", onConfirm: () => handleDelete(item.id) })}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {toast.show && (
        <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3 bg-green-50 border border-green-200 text-green-700 rounded-xl shadow-lg">
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}
      <ConfirmModal {...confirmModal} onClose={() => setConfirmModal(p => ({ ...p, open: false }))} />
    </PageWrapper>
  );
}
