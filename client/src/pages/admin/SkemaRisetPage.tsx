import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Search, CheckCircle, ChevronLeft, Layers, Tag, Award, Handshake, BookOpenCheck, Banknote, FolderTree } from "lucide-react";
import { PageWrapper } from "../../components/admin/PageWrapper";
import { ConfirmModal } from "../../components/admin/ConfirmModal";
import { useSearchParams } from "react-router";

type SkemaTab = "skema" | "tema" | "bidang" | "hakijenis" | "biayahakcipta" | "subjenishakcipta" | "mitra";

interface SkemaItem { id: string; kode?: string; nama: string; deskripsi: string; aktif: boolean; }

const MOCK_DATA: Record<SkemaTab, SkemaItem[]> = {
  skema: [
    { id: "SK-001", kode: "DASAR", nama: "Penelitian Dasar", deskripsi: "Penelitian berorientasi pengembangan ilmu pengetahuan fundamental", aktif: true },
    { id: "SK-002", kode: "TERAPAN", nama: "Penelitian Terapan", deskripsi: "Penelitian untuk menghasilkan solusi terapan bagi industri dan masyarakat", aktif: true },
    { id: "SK-003", kode: "KEMBANG", nama: "Penelitian Pengembangan", deskripsi: "Penelitian untuk menghasilkan produk, prototipe, atau teknologi baru", aktif: true },
    { id: "SK-004", kode: "PEMULA", nama: "Penelitian Dosen Pemula", deskripsi: "Skema khusus dosen dengan jabatan fungsional asisten ahli", aktif: true },
    { id: "SK-005", kode: "KOLABORASI", nama: "Penelitian Kolaborasi", deskripsi: "Penelitian interdisipliner lintas program studi atau institusi", aktif: true },
    { id: "SK-006", kode: "KOSABANGSA", nama: "Kosabangsa", deskripsi: "Program kolaborasi pengembangan IPTEKS untuk hilirisasi hasil penelitian", aktif: true },
  ],
  tema: [
    { id: "TM-001", nama: "Kecerdasan Buatan & Machine Learning", deskripsi: "Riset terkait AI, ML, deep learning, dan computer vision", aktif: true },
    { id: "TM-002", nama: "IoT & Smart Systems", deskripsi: "Internet of Things, sistem cerdas, smart city, smart campus", aktif: true },
    { id: "TM-003", nama: "Kesehatan & Biomedis", deskripsi: "Teknologi kesehatan, bioinformatik, telemedicine", aktif: true },
    { id: "TM-004", nama: "Energi Terbarukan & Lingkungan", deskripsi: "Green technology, energi surya, pengelolaan lingkungan", aktif: true },
    { id: "TM-005", nama: "Manajemen & Bisnis Digital", deskripsi: "Fintech, e-commerce, manajemen rantai pasok digital", aktif: true },
    { id: "TM-006", nama: "Pendidikan & Teknologi Pembelajaran", deskripsi: "EdTech, e-learning, gamifikasi, AR/VR untuk pendidikan", aktif: true },
    { id: "TM-007", nama: "Arsitektur & Desain Berkelanjutan", deskripsi: "Green building, urban design, desain inklusif", aktif: true },
    { id: "TM-008", nama: "Keamanan Siber", deskripsi: "Cybersecurity, kriptografi, forensik digital", aktif: false },
  ],
  bidang: [
    { id: "BD-001", nama: "Teknik Informatika", deskripsi: "Algoritma, perangkat lunak, sistem informasi", aktif: true },
    { id: "BD-002", nama: "Teknik Elektro & Otomasi", deskripsi: "Elektronika, otomasi industri, robotik", aktif: true },
    { id: "BD-003", nama: "Teknik Sipil & Arsitektur", deskripsi: "Konstruksi, perencanaan kota, arsitektur", aktif: true },
    { id: "BD-004", nama: "Manajemen & Akuntansi", deskripsi: "Manajemen bisnis, keuangan, akuntansi", aktif: true },
    { id: "BD-005", nama: "Desain Komunikasi Visual", deskripsi: "Desain grafis, multimedia, UI/UX", aktif: true },
    { id: "BD-006", nama: "Psikologi & Ilmu Sosial", deskripsi: "Psikologi industri, sosiologi, komunikasi", aktif: true },
  ],
  hakijenis: [
    { id: "HK-001", kode: "HC", nama: "Hak Cipta", deskripsi: "Perlindungan karya tulis, perangkat lunak, karya seni", aktif: true },
    { id: "HK-002", kode: "PT", nama: "Paten", deskripsi: "Invensi teknologi baru yang memiliki nilai komersial", aktif: true },
    { id: "HK-003", kode: "PS", nama: "Paten Sederhana", deskripsi: "Invensi dengan lingkup perlindungan lebih sempit dari paten biasa", aktif: true },
    { id: "HK-004", kode: "DI", nama: "Desain Industri", deskripsi: "Tampilan estetis produk industri", aktif: true },
    { id: "HK-005", kode: "MK", nama: "Merek Dagang", deskripsi: "Identitas produk/layanan hasil inovasi", aktif: true },
    { id: "HK-006", kode: "RD", nama: "Rahasia Dagang", deskripsi: "Informasi rahasia yang memiliki nilai ekonomi", aktif: false },
  ],
  biayahakcipta: [
    { id: "BH-001", nama: "Biaya Pendaftaran Hak Cipta", deskripsi: "Komponen biaya pengajuan awal untuk pencatatan hak cipta", aktif: true },
    { id: "BH-002", nama: "Biaya Percepatan Proses", deskripsi: "Biaya tambahan untuk prioritas layanan administrasi", aktif: true },
    { id: "BH-003", nama: "Biaya Revisi Berkas", deskripsi: "Biaya untuk penyesuaian dokumen setelah evaluasi administrasi", aktif: false },
  ],
  subjenishakcipta: [
    { id: "SJ-001", nama: "Program Komputer", deskripsi: "Sub jenis hak cipta untuk aplikasi, sistem, dan perangkat lunak", aktif: true },
    { id: "SJ-002", nama: "Buku dan Modul", deskripsi: "Sub jenis untuk buku ajar, modul, dan karya tulis ilmiah", aktif: true },
    { id: "SJ-003", nama: "Poster dan Desain Visual", deskripsi: "Sub jenis untuk materi visual, poster, dan media promosi", aktif: true },
    { id: "SJ-004", nama: "Video Pembelajaran", deskripsi: "Sub jenis untuk konten audio visual dan multimedia edukatif", aktif: false },
  ],
  mitra: [
    { id: "MT-001", nama: "PT Telkom Indonesia", deskripsi: "Mitra industri bidang telekomunikasi dan digital", aktif: true },
    { id: "MT-002", nama: "BRIN (Badan Riset dan Inovasi Nasional)", deskripsi: "Mitra lembaga penelitian pemerintah", aktif: true },
    { id: "MT-003", nama: "Universitas Indonesia", deskripsi: "Mitra perguruan tinggi untuk kolaborasi riset", aktif: true },
    { id: "MT-004", nama: "Pemkot Tangerang Selatan", deskripsi: "Mitra pemerintah daerah untuk pengabdian masyarakat", aktif: true },
    { id: "MT-005", nama: "Microsoft Indonesia", deskripsi: "Mitra industri teknologi untuk riset AI dan cloud", aktif: true },
    { id: "MT-006", nama: "BPJS Kesehatan", deskripsi: "Mitra untuk riset kesehatan dan kebijakan publik", aktif: false },
  ],
};

const TAB_CONFIG: { key: SkemaTab; label: string; icon: typeof Layers; color: string }[] = [
  { key: "skema", label: "Kelompok Skema", icon: Layers, color: "text-blue-600" },
  { key: "tema", label: "Tema Riset", icon: Tag, color: "text-purple-600" },
  { key: "bidang", label: "Bidang Keahlian", icon: BookOpenCheck, color: "text-green-600" },
  { key: "hakijenis", label: "Jenis HAKI", icon: Award, color: "text-amber-600" },
  { key: "biayahakcipta", label: "Biaya Hak Cipta", icon: Banknote, color: "text-blue-600" },
  { key: "subjenishakcipta", label: "Sub Jenis Hak Cipta", icon: FolderTree, color: "text-cyan-600" },
  { key: "mitra", label: "Mitra", icon: Handshake, color: "text-emerald-600" },
];

interface FormData { nama: string; kode: string; deskripsi: string; }

export function SkemaRisetPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedTab = searchParams.get("tab") as SkemaTab | null;
  const initTab = requestedTab && TAB_CONFIG.some((item) => item.key === requestedTab) ? requestedTab : "skema";
  const [activeTab, setActiveTab] = useState<SkemaTab>(initTab);
  const [data, setData] = useState(MOCK_DATA);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"list" | "form">("list");
  const [editItem, setEditItem] = useState<SkemaItem | null>(null);
  const [formData, setFormData] = useState<FormData>({ nama: "", kode: "", deskripsi: "" });
  const [confirmModal, setConfirmModal] = useState<{ open: boolean; title: string; message: string; variant: "danger" | "warning" | "success"; onConfirm: () => void }>({ open: false, title: "", message: "", variant: "danger", onConfirm: () => {} });
  const [toast, setToast] = useState<{ show: boolean; message: string }>({ show: false, message: "" });

  useEffect(() => {
    setActiveTab(initTab);
  }, [initTab]);

  const showToast = (msg: string) => { setToast({ show: true, message: msg }); setTimeout(() => setToast(p => ({ ...p, show: false })), 3000); };

  const filtered = data[activeTab].filter(item =>
    item.nama.toLowerCase().includes(search.toLowerCase()) || item.deskripsi.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setData(prev => ({ ...prev, [activeTab]: prev[activeTab].filter(d => d.id !== id) }));
    showToast("Data berhasil dihapus");
  };

  const handleToggle = (id: string) => {
    setData(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].map(d => d.id === id ? { ...d, aktif: !d.aktif } : d),
    }));
    showToast("Status berhasil diperbarui");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editItem) {
      setData(prev => ({ ...prev, [activeTab]: prev[activeTab].map(d => d.id === editItem.id ? { ...d, ...formData } : d) }));
      showToast("Data berhasil diperbarui");
    } else {
      const prefix = activeTab.toUpperCase().slice(0, 2);
      const newItem: SkemaItem = { id: `${prefix}-${String(data[activeTab].length + 1).padStart(3, "0")}`, ...formData, aktif: true };
      setData(prev => ({ ...prev, [activeTab]: [newItem, ...prev[activeTab]] }));
      showToast("Data berhasil ditambahkan");
    }
    setView("list");
    setEditItem(null);
    setFormData({ nama: "", kode: "", deskripsi: "" });
  };

  const tabInfo = TAB_CONFIG.find(t => t.key === activeTab)!;

  if (view === "form") {
    return (
      <PageWrapper
        title={editItem ? `Edit ${tabInfo.label}` : `Tambah ${tabInfo.label}`}
        breadcrumbs={[{ label: "Referensi" }, { label: tabInfo.label }, { label: editItem ? "Edit" : "Tambah" }]}
        actions={<button onClick={() => { setView("list"); setEditItem(null); }} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"><ChevronLeft className="w-4 h-4" /> Batal</button>}
      >
        <form onSubmit={handleSubmit} className="max-w-xl bg-white rounded-xl border border-slate-200 p-6 space-y-5">
          {(activeTab === "skema" || activeTab === "hakijenis") && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Kode</label>
              <input type="text" value={formData.kode} onChange={e => setFormData(p => ({ ...p, kode: e.target.value }))}
                placeholder="Contoh: DASAR, HC" className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50/50" />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama <span className="text-red-500">*</span></label>
            <input type="text" value={formData.nama} required onChange={e => setFormData(p => ({ ...p, nama: e.target.value }))}
              placeholder={`Nama ${tabInfo.label}`} className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Deskripsi</label>
            <textarea value={formData.deskripsi} onChange={e => setFormData(p => ({ ...p, deskripsi: e.target.value }))}
              rows={3} className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50/50 resize-none" />
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
      title="Data Referensi Riset"
      subtitle="Kelola kelompok skema, tema, bidang keahlian, jenis HAKI, biaya hak cipta, sub jenis hak cipta, dan mitra"
      breadcrumbs={[{ label: "Referensi" }, { label: tabInfo.label }]}
      actions={
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari..."
              className="pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E30613]/20 w-52" />
          </div>
          <button onClick={() => { setFormData({ nama: "", kode: "", deskripsi: "" }); setView("form"); }}
            className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-[#E30613] rounded-lg hover:bg-[#c00510] font-medium">
            <Plus className="w-4 h-4" /> Tambah
          </button>
        </div>
      }
    >
      {/* Tabs */}
      <div className="flex flex-wrap gap-1 mb-6 p-1.5 bg-slate-100 rounded-xl w-fit">
        {TAB_CONFIG.map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => { setActiveTab(key); setSearch(""); setSearchParams({ tab: key }); }}
            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg font-medium transition-all ${activeTab === key ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
            <Icon className={`w-3.5 h-3.5 ${activeTab === key ? tabInfo.color : ""}`} />
            {label}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-400 font-medium">Total {tabInfo.label}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{data[activeTab].length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-400 font-medium">Aktif</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{data[activeTab].filter(d => d.aktif).length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-400 font-medium">Tidak Aktif</p>
          <p className="text-2xl font-bold text-slate-400 mt-1">{data[activeTab].filter(d => !d.aktif).length}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              {["#", ...(activeTab === "skema" || activeTab === "hakijenis" ? ["Kode"] : []), "Nama", "Deskripsi", "Status", "Aksi"].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs text-slate-500 font-semibold whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-12 text-sm text-slate-400">Tidak ada data ditemukan</td></tr>
            ) : filtered.map((item, i) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3.5 text-xs text-slate-400 font-medium">{i + 1}</td>
                {(activeTab === "skema" || activeTab === "hakijenis") && (
                  <td className="px-5 py-3.5">
                    {item.kode && <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">{item.kode}</span>}
                  </td>
                )}
                <td className="px-5 py-3.5 text-sm text-slate-800 font-medium">{item.nama}</td>
                <td className="px-5 py-3.5 text-sm text-slate-500 max-w-[300px]">{item.deskripsi}</td>
                <td className="px-5 py-3.5">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${item.aktif ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                    {item.aktif ? "Aktif" : "Nonaktif"}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-1">
                    <button onClick={() => {
                      setEditItem(item);
                      setFormData({ nama: item.nama, kode: item.kode || "", deskripsi: item.deskripsi });
                      setView("form");
                    }} className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleToggle(item.id)} className={`p-1.5 rounded-md transition-colors ${item.aktif ? "text-slate-400 hover:text-red-600 hover:bg-red-50" : "text-slate-400 hover:text-green-600 hover:bg-green-50"}`}>
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button onClick={() => setConfirmModal({ open: true, title: "Hapus?", message: `Hapus "${item.nama}"?`, variant: "danger", onConfirm: () => handleDelete(item.id) })}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
