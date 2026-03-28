import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, Search, Plus, Edit2, Trash2, Eye, FileText, Calendar, User } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "../../components/ConfirmDialog";

const initialArticles = [
  { id: 1, title: "Inovasi Riset Universitas Menuju Era Society 5.0", author: "Tim Redaksi LPPM", category: "Inovasi", date: "5 Mar 2026", status: "Terbit", views: 342 },
  { id: 2, title: "Workshop Penulisan Artikel Ilmiah Internasional", author: "Humas LPPM", category: "Kegiatan", date: "1 Mar 2026", status: "Terbit", views: 215 },
  { id: 3, title: "Peningkatan Kualitas Penelitian Melalui Kolaborasi Lintas Disiplin", author: "Dr. Hendra Wijaya", category: "Opini", date: "26 Feb 2026", status: "Terbit", views: 189 },
  { id: 4, title: "Pengumuman Hibah Penelitian Internal 2026", author: "Admin LPPM", category: "Pengumuman", date: "20 Feb 2026", status: "Terbit", views: 521 },
  { id: 5, title: "Dosen Universitas Pradita Raih Penghargaan Riset Nasional", author: "Humas LPPM", category: "Prestasi", date: "15 Feb 2026", status: "Draf", views: 0 },
  { id: 6, title: "Panduan Baru Pengajuan Etika Penelitian 2026", author: "Komisi Etika", category: "Panduan", date: "10 Feb 2026", status: "Terbit", views: 278 },
  { id: 7, title: "Kolaborasi LPPM dengan Industri Teknologi Nasional", author: "Tim Redaksi LPPM", category: "Kegiatan", date: "3 Feb 2026", status: "Draf", views: 0 },
];

const categoryColors: Record<string, string> = {
  Inovasi: "bg-blue-100 text-blue-700",
  Kegiatan: "bg-green-100 text-green-700",
  Opini: "bg-purple-100 text-purple-700",
  Pengumuman: "bg-amber-100 text-amber-700",
  Prestasi: "bg-rose-100 text-rose-700",
  Panduan: "bg-cyan-100 text-cyan-700",
};

const categories = ["Inovasi", "Kegiatan", "Opini", "Pengumuman", "Prestasi", "Panduan"];

interface Article {
  id: number;
  title: string;
  author: string;
  category: string;
  date: string;
  status: string;
  views: number;
}

export function AdminArtikel() {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [search, setSearch] = useState("");
  const [editArticle, setEditArticle] = useState<Article | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: "", author: "", category: "Inovasi", content: "" });
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  const filtered = articles.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.author.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditArticle(null);
    setFormData({ title: "", author: "", category: "Inovasi", content: "" });
    setShowModal(true);
  };

  const openEdit = (article: Article) => {
    setEditArticle(article);
    setFormData({ title: article.title, author: article.author, category: article.category, content: "" });
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    setDeleteTarget(id);
  };

  const confirmDelete = () => {
    if (deleteTarget !== null) {
      const article = articles.find((a) => a.id === deleteTarget);
      setArticles((prev) => prev.filter((a) => a.id !== deleteTarget));
      toast.success("Artikel dihapus", { description: article?.title ?? "" });
      setDeleteTarget(null);
    }
  };

  const handleSave = () => {
    if (editArticle) {
      setArticles((prev) =>
        prev.map((a) =>
          a.id === editArticle.id
            ? { ...a, title: formData.title, author: formData.author, category: formData.category }
            : a
        )
      );
      toast.success("Artikel diperbarui", { description: formData.title });
    } else {
      setArticles((prev) => [
        ...prev,
        {
          id: Date.now(),
          title: formData.title,
          author: formData.author,
          category: formData.category,
          date: "10 Mar 2026",
          status: "Draf",
          views: 0,
        },
      ]);
      toast.success("Artikel dibuat", { description: formData.title });
    }
    setShowModal(false);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link to="/admin" className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-gray-900">Manajemen Artikel</h1>
          <p className="text-gray-500 mt-0.5" style={{ fontSize: 14 }}>Buat, edit, dan kelola artikel LPPM</p>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-[#fef2f2] flex items-center justify-center">
            <FileText size={18} className="text-[#7c2d12]" />
          </div>
          <div>
            <p className="text-gray-900" style={{ fontSize: 22, fontWeight: 800 }}>{articles.length}</p>
            <p className="text-gray-500" style={{ fontSize: 13 }}>Total Artikel</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
            <Eye size={18} className="text-green-600" />
          </div>
          <div>
            <p className="text-gray-900" style={{ fontSize: 22, fontWeight: 800 }}>
              {articles.filter((a) => a.status === "Terbit").length}
            </p>
            <p className="text-gray-500" style={{ fontSize: 13 }}>Terbit</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
            <Edit2 size={18} className="text-amber-600" />
          </div>
          <div>
            <p className="text-gray-900" style={{ fontSize: 22, fontWeight: 800 }}>
              {articles.filter((a) => a.status === "Draf").length}
            </p>
            <p className="text-gray-500" style={{ fontSize: 13 }}>Draf</p>
          </div>
        </div>
      </div>

      {/* Table card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row gap-3 justify-between">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 flex-1 max-w-xs">
            <Search size={15} className="text-gray-400" />
            <input
              type="text"
              placeholder="Cari artikel..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent outline-none text-gray-700 flex-1"
              style={{ fontSize: 13 }}
            />
          </div>
          <Link
            to="/admin/artikel/buat"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#7c2d12] text-white hover:bg-[#92400e] transition-colors"
            style={{ fontSize: 13, fontWeight: 600 }}
          >
            <Plus size={16} /> Buat Artikel
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-gray-500" style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Judul</th>
                <th className="text-left px-4 py-3 text-gray-500 hidden md:table-cell" style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Penulis & Tanggal</th>
                <th className="text-center px-4 py-3 text-gray-500" style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Kategori</th>
                <th className="text-center px-4 py-3 text-gray-500" style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Status</th>
                <th className="text-center px-4 py-3 text-gray-500 hidden sm:table-cell" style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Views</th>
                <th className="text-center px-4 py-3 text-gray-500" style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((article) => (
                <tr key={article.id} className="hover:bg-[#fdf8f6] transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#fef2f2" }}>
                        <FileText size={14} className="text-[#7c2d12]" />
                      </div>
                      <p className="text-gray-900" style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.4 }}>{article.title}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <p className="flex items-center gap-1 text-gray-600" style={{ fontSize: 13 }}>
                      <User size={12} className="text-gray-400" /> {article.author}
                    </p>
                    <p className="flex items-center gap-1 text-gray-400 mt-0.5" style={{ fontSize: 12 }}>
                      <Calendar size={11} /> {article.date}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full ${categoryColors[article.category] || "bg-gray-100 text-gray-600"}`} style={{ fontSize: 11, fontWeight: 600 }}>
                      {article.category}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full ${
                        article.status === "Terbit" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                      }`}
                      style={{ fontSize: 11, fontWeight: 600 }}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${article.status === "Terbit" ? "bg-green-500" : "bg-amber-500"}`}></span>
                      {article.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center hidden sm:table-cell">
                    <span className="flex items-center justify-center gap-1 text-gray-500" style={{ fontSize: 13 }}>
                      <Eye size={12} /> {article.views.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => openEdit(article)}
                        className="p-1.5 rounded-lg text-gray-400 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(article.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-14">
            <FileText size={32} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400" style={{ fontSize: 14 }}>Artikel tidak ditemukan</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
            <h2 className="text-gray-900 mb-5">{editArticle ? "Edit Artikel" : "Buat Artikel Baru"}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1.5" style={{ fontSize: 13, fontWeight: 600 }}>Judul Artikel</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                  placeholder="Judul artikel"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 text-gray-700 outline-none focus:border-[#7c2d12]"
                  style={{ fontSize: 14 }}
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1.5" style={{ fontSize: 13, fontWeight: 600 }}>Penulis</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData((p) => ({ ...p, author: e.target.value }))}
                  placeholder="Nama penulis"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 text-gray-700 outline-none focus:border-[#7c2d12]"
                  style={{ fontSize: 14 }}
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1.5" style={{ fontSize: 13, fontWeight: 600 }}>Kategori</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 text-gray-700 outline-none focus:border-[#7c2d12]"
                  style={{ fontSize: 14 }}
                >
                  {categories.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-1.5" style={{ fontSize: 13, fontWeight: 600 }}>Konten Artikel</label>
                <textarea
                  rows={5}
                  value={formData.content}
                  onChange={(e) => setFormData((p) => ({ ...p, content: e.target.value }))}
                  placeholder="Tulis konten artikel..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 text-gray-700 outline-none focus:border-[#7c2d12] resize-none"
                  style={{ fontSize: 14 }}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600"
                style={{ fontSize: 14, fontWeight: 600 }}
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-2.5 rounded-xl bg-[#7c2d12] text-white"
                style={{ fontSize: 14, fontWeight: 600 }}
              >
                {editArticle ? "Simpan Perubahan" : "Buat Artikel"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={deleteTarget !== null}
        title="Hapus Artikel"
        message={`Apakah Anda yakin ingin menghapus artikel "${articles.find((a) => a.id === deleteTarget)?.title ?? ""}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Hapus"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}