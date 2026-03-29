export { ArtikelAdminPage } from "./ArtikelAdminModernPage";

import { useState } from "react";
import { Plus, Search, Edit, Trash2, Eye, ChevronLeft, Newspaper, Tag, Image, FileText, ChevronRight, CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { PageWrapper } from "../components/PageWrapper";
import { ConfirmModal } from "../components/ConfirmModal";

type ArtikelTab = "artikel" | "kategori" | "galeri";
type ArtikelStatus = "published" | "draft" | "archived";

interface ArtikelItem {
  id: string;
  judul: string;
  kategori: string;
  penulis: string;
  status: ArtikelStatus;
  tanggal: string;
  views: number;
  excerpt: string;
}

interface KategoriItem {
  id: string;
  nama: string;
  slug: string;
  jumlah_artikel: number;
}

interface GaleriItem {
  id: string;
  nama: string;
  deskripsi: string;
  tanggal: string;
}

const MOCK_ARTIKEL: ArtikelItem[] = [
  { id: "ART-001", judul: "LPPM Pradita Raih Hibah DRTPM 2026 untuk 8 Penelitian", kategori: "Berita", penulis: "Admin LPPM", status: "published", tanggal: "2026-03-01", views: 1245, excerpt: "LPPM Universitas Pradita berhasil meloloskan 8 proposal penelitian dalam kompetisi Hibah DRTPM 2026..." },
  { id: "ART-002", judul: "Panduan Pengajuan Surat Tugas Kegiatan Ilmiah 2026", kategori: "Panduan", penulis: "Admin LPPM", status: "published", tanggal: "2026-02-20", views: 892, excerpt: "Berikut adalah panduan lengkap untuk mengajukan surat tugas kegiatan ilmiah melalui SIPPM..." },
  { id: "ART-003", judul: "Workshop Penulisan Proposal Hibah bersama BRIN", kategori: "Kegiatan", penulis: "Staff LPPM", status: "published", tanggal: "2026-02-15", views: 567, excerpt: "LPPM Pradita menyelenggarakan workshop intensif penulisan proposal hibah kompetitif bersama narasumber dari BRIN..." },
  { id: "ART-004", judul: "Prosedur Baru Pelaporan Kegiatan Penelitian 2026", kategori: "Pengumuman", penulis: "Admin LPPM", status: "draft", tanggal: "2026-02-10", views: 0, excerpt: "Mulai tahun 2026, pelaporan kegiatan penelitian wajib dilakukan melalui sistem SIPPM..." },
  { id: "ART-005", judul: "Rekap Capaian Penelitian dan PKM Tahun 2025", kategori: "Laporan", penulis: "Ketua LPPM", status: "published", tanggal: "2026-01-31", views: 1589, excerpt: "Laporan tahunan capaian kegiatan penelitian dan pengabdian masyarakat Universitas Pradita tahun 2025..." },
  { id: "ART-006", judul: "Tips Menulis Artikel untuk Jurnal Terindeks Scopus", kategori: "Tips & Trik", penulis: "Dr. Arif Ramadhan", status: "archived", tanggal: "2025-11-20", views: 2340, excerpt: "Panduan praktis menulis artikel ilmiah yang diterima di jurnal terindeks Scopus Q1-Q2..." },
];

const MOCK_KATEGORI: KategoriItem[] = [
  { id: "KAT-001", nama: "Berita", slug: "berita", jumlah_artikel: 12 },
  { id: "KAT-002", nama: "Panduan", slug: "panduan", jumlah_artikel: 8 },
  { id: "KAT-003", nama: "Kegiatan", slug: "kegiatan", jumlah_artikel: 15 },
  { id: "KAT-004", nama: "Pengumuman", slug: "pengumuman", jumlah_artikel: 6 },
  { id: "KAT-005", nama: "Laporan", slug: "laporan", jumlah_artikel: 4 },
  { id: "KAT-006", nama: "Tips & Trik", slug: "tips-trik", jumlah_artikel: 9 },
];

const MOCK_GALERI: GaleriItem[] = [
  { id: "GAL-001", nama: "Seminar Nasional Riset 2025", deskripsi: "Dokumentasi foto seminar nasional riset dan inovasi LPPM 2025", tanggal: "2025-06-15" },
  { id: "GAL-002", nama: "Workshop Penulisan Hibah", deskripsi: "Dokumentasi workshop penulisan proposal hibah DRTPM", tanggal: "2025-04-20" },
  { id: "GAL-003", nama: "Pengabdian Masyarakat Desa Digital", deskripsi: "Kegiatan PKM Kosabangsa di desa mitra", tanggal: "2025-03-10" },
];

const STATUS_CONFIG: Record<ArtikelStatus, { label: string; bg: string; text: string }> = {
  published: { label: "Diterbitkan", bg: "bg-green-100", text: "text-green-700" },
  draft: { label: "Draft", bg: "bg-slate-100", text: "text-slate-500" },
  archived: { label: "Diarsipkan", bg: "bg-amber-100", text: "text-amber-700" },
};

function LegacyArtikelAdminPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<ArtikelTab>("artikel");
  const [artikelData, setArtikelData] = useState(MOCK_ARTIKEL);
  const [kategoriData, setKategoriData] = useState(MOCK_KATEGORI);
  const [galeriData, setGaleriData] = useState(MOCK_GALERI);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"list" | "form" | "detail">("list");
  const [selectedArtikel, setSelectedArtikel] = useState<ArtikelItem | null>(null);
  const [page, setPage] = useState(1);
  const [confirmModal, setConfirmModal] = useState<{ open: boolean; title: string; message: string; variant: "danger" | "warning" | "success"; onConfirm: () => void }>({ open: false, title: "", message: "", variant: "danger", onConfirm: () => {} });
  const [toast, setToast] = useState({ show: false, message: "", ok: true });

  const [formArtikel, setFormArtikel] = useState({ judul: "", kategori: "Berita", excerpt: "" });
  const [formKategori, setFormKategori] = useState({ nama: "", slug: "" });
  const [formGaleri, setFormGaleri] = useState({ nama: "", deskripsi: "" });

  const perPage = 6;

  const showToast = (msg: string, ok = true) => { setToast({ show: true, message: msg, ok }); setTimeout(() => setToast(p => ({ ...p, show: false })), 3000); };

  const filteredArtikel = artikelData.filter(a => a.judul.toLowerCase().includes(search.toLowerCase()) || a.kategori.toLowerCase().includes(search.toLowerCase()));
  const paginatedArtikel = filteredArtikel.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filteredArtikel.length / perPage);

  const handlePublish = (id: string) => {
    setArtikelData(prev => prev.map(a => a.id === id ? { ...a, status: a.status === "published" ? "draft" : "published" } : a));
    showToast("Status artikel diperbarui");
  };
  const handleDeleteArtikel = (id: string) => { setArtikelData(prev => prev.filter(a => a.id !== id)); showToast("Artikel dihapus"); };
  const handleDeleteKategori = (id: string) => { setKategoriData(prev => prev.filter(a => a.id !== id)); showToast("Kategori dihapus"); };
  const handleDeleteGaleri = (id: string) => { setGaleriData(prev => prev.filter(a => a.id !== id)); showToast("Album dihapus"); };

  // Form
  if (view === "form" && tab === "artikel") {
    return (
      <PageWrapper title={selectedArtikel ? "Edit Artikel" : "Tulis Artikel Baru"} breadcrumbs={[{ label: "Manajemen Konten" }, { label: "Artikel" }, { label: selectedArtikel ? "Edit" : "Baru" }]} actions={<button onClick={() => { setView("list"); setSelectedArtikel(null); }} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"><ChevronLeft className="w-4 h-4" /> Batal</button>}>
        <form onSubmit={e => {
          e.preventDefault();
          if (selectedArtikel) {
            setArtikelData(prev => prev.map(a => a.id === selectedArtikel.id ? { ...a, ...formArtikel } : a));
            showToast("Artikel diperbarui");
          } else {
            const newArtikel: ArtikelItem = { id: `ART-${String(artikelData.length + 1).padStart(3, "0")}`, ...formArtikel, penulis: user?.name || "Admin", status: "draft", tanggal: new Date().toISOString().split("T")[0], views: 0 };
            setArtikelData(prev => [newArtikel, ...prev]);
            showToast("Artikel disimpan sebagai draft");
          }
          setView("list"); setSelectedArtikel(null);
        }} className="max-w-2xl bg-white rounded-xl border border-slate-200 p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Judul Artikel <span className="text-red-500">*</span></label>
            <input type="text" value={formArtikel.judul} required onChange={e => setFormArtikel(p => ({ ...p, judul: e.target.value }))} placeholder="Masukkan judul artikel" className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Kategori</label>
            <select value={formArtikel.kategori} onChange={e => setFormArtikel(p => ({ ...p, kategori: e.target.value }))} className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50/50">
              {kategoriData.map(k => <option key={k.id}>{k.nama}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Ringkasan</label>
            <textarea value={formArtikel.excerpt} onChange={e => setFormArtikel(p => ({ ...p, excerpt: e.target.value }))} rows={3} placeholder="Ringkasan singkat artikel" className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50/50 resize-none" />
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-xs text-slate-500 font-medium mb-2">📝 Konten Artikel</p>
            <p className="text-xs text-slate-400">Editor konten artikel lengkap (rich text) akan terintegrasi di sini. Untuk saat ini, konten dapat dikelola melalui admin backend.</p>
          </div>
          <div className="flex gap-3 border-t border-slate-100 pt-4">
            <button type="submit" className="px-6 py-2.5 text-sm text-white bg-[#E30613] rounded-lg hover:bg-[#c00510] font-medium">Simpan Draft</button>
            <button type="button" onClick={() => { setView("list"); setSelectedArtikel(null); }} className="px-6 py-2.5 text-sm text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 font-medium">Batal</button>
          </div>
        </form>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title="Manajemen Konten Website"
      subtitle="Kelola artikel, kategori, dan galeri LPPM Pradita"
      breadcrumbs={[{ label: "Manajemen Konten" }]}
      actions={
        <button onClick={() => { setFormArtikel({ judul: "", kategori: "Berita", excerpt: "" }); setView("form"); }}
          className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-[#E30613] rounded-lg hover:bg-[#c00510] font-medium">
          <Plus className="w-4 h-4" />
          {tab === "artikel" ? "Tulis Artikel" : tab === "kategori" ? "Tambah Kategori" : "Tambah Album"}
        </button>
      }
    >
      {/* Tabs */}
      <div className="flex gap-1 p-1.5 bg-slate-100 rounded-xl w-fit mb-6">
        {([["artikel", "Artikel", Newspaper], ["kategori", "Kategori", Tag], ["galeri", "Galeri", Image]] as const).map(([key, label, Icon]) => (
          <button key={key} onClick={() => { setTab(key); setSearch(""); setPage(1); }}
            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg font-medium transition-all ${tab === key ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
            <Icon className="w-3.5 h-3.5" /> {label}
          </button>
        ))}
      </div>

      {/* ARTIKEL TAB */}
      {tab === "artikel" && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Cari artikel..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E30613]/20" />
            </div>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                {["Judul", "Kategori", "Penulis", "Status", "Tanggal", "Views", "Aksi"].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs text-slate-500 font-semibold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedArtikel.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="text-sm text-slate-800 font-medium max-w-[240px] truncate">{item.judul}</p>
                    <p className="text-xs text-slate-400 mt-0.5 max-w-[240px] truncate">{item.excerpt}</p>
                  </td>
                  <td className="px-5 py-3.5"><span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">{item.kategori}</span></td>
                  <td className="px-5 py-3.5 text-sm text-slate-600 whitespace-nowrap">{item.penulis}</td>
                  <td className="px-5 py-3.5"><span className={`text-xs px-2 py-1 rounded-full font-semibold ${STATUS_CONFIG[item.status].bg} ${STATUS_CONFIG[item.status].text}`}>{STATUS_CONFIG[item.status].label}</span></td>
                  <td className="px-5 py-3.5 text-sm text-slate-500 whitespace-nowrap">{item.tanggal}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-600 font-medium">{item.views.toLocaleString()}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1">
                      <button onClick={() => { setSelectedArtikel(item); setFormArtikel({ judul: item.judul, kategori: item.kategori, excerpt: item.excerpt }); setView("form"); }} className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-md" title="Edit"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handlePublish(item.id)} className={`p-1.5 rounded-md transition-colors ${item.status === "published" ? "text-slate-400 hover:text-slate-600 hover:bg-slate-100" : "text-slate-400 hover:text-green-600 hover:bg-green-50"}`} title={item.status === "published" ? "Arsipkan" : "Terbitkan"}>{item.status === "published" ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}</button>
                      <button onClick={() => setConfirmModal({ open: true, title: "Hapus Artikel?", message: `Hapus "${item.judul}"?`, variant: "danger", onConfirm: () => handleDeleteArtikel(item.id) })} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md" title="Hapus"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {totalPages > 1 && (
            <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
              <p className="text-xs text-slate-500">{filteredArtikel.length} artikel</p>
              <div className="flex items-center gap-1">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 text-slate-400 disabled:opacity-30 rounded-md"><ChevronLeft className="w-4 h-4" /></button>
                {Array.from({ length: totalPages }).map((_, i) => (<button key={i} onClick={() => setPage(i + 1)} className={`w-8 h-8 text-xs rounded-md font-medium ${page === i + 1 ? "bg-[#E30613] text-white" : "text-slate-600 hover:bg-slate-100"}`}>{i + 1}</button>))}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1.5 text-slate-400 disabled:opacity-30 rounded-md"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* KATEGORI TAB */}
      {tab === "kategori" && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead><tr className="border-b border-slate-100">{["#", "Nama Kategori", "Slug", "Jumlah Artikel", "Aksi"].map(h => <th key={h} className="px-5 py-3 text-left text-xs text-slate-500 font-semibold">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-slate-50">
              {kategoriData.map((item, i) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3.5 text-xs text-slate-400">{i + 1}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-800 font-medium">{item.nama}</td>
                  <td className="px-5 py-3.5"><code className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600">{item.slug}</code></td>
                  <td className="px-5 py-3.5 text-sm text-slate-600">{item.jumlah_artikel} artikel</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-md"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => setConfirmModal({ open: true, title: "Hapus Kategori?", message: `Hapus kategori "${item.nama}"?`, variant: "danger", onConfirm: () => handleDeleteKategori(item.id) })} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* GALERI TAB */}
      {tab === "galeri" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {galeriData.map(item => (
            <div key={item.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                <Image className="w-12 h-12 text-slate-300" />
              </div>
              <div className="p-4">
                <h4 className="text-sm font-semibold text-slate-800">{item.nama}</h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{item.deskripsi}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-slate-400">{item.tanggal}</span>
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md"><Eye className="w-4 h-4" /></button>
                    <button className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-md"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => setConfirmModal({ open: true, title: "Hapus Album?", message: `Hapus album "${item.nama}"?`, variant: "danger", onConfirm: () => handleDeleteGaleri(item.id) })} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {/* Add new album card */}
          <button className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-[#E30613]/30 hover:text-[#E30613] transition-colors">
            <Plus className="w-8 h-8" />
            <span className="text-sm font-medium">Tambah Album</span>
          </button>
        </div>
      )}

      {toast.show && (
        <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg border ${toast.ok ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"}`}>
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}
      <ConfirmModal {...confirmModal} onClose={() => setConfirmModal(p => ({ ...p, open: false }))} />
    </PageWrapper>
  );
}
