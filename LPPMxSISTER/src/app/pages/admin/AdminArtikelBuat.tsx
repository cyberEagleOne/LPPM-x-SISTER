import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, FileText, Image, Bold, Italic, List, Link2, Eye, Save, Upload } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "../../components/ConfirmDialog";

const categories = ["Inovasi", "Kegiatan", "Opini", "Pengumuman", "Prestasi", "Panduan"];

export function AdminArtikelBuat() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("Inovasi");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState<"Draf" | "Terbit">("Draf");
  const [showPreview, setShowPreview] = useState(false);
  const [showDiscard, setShowDiscard] = useState(false);

  const canPublish = title.trim() && author.trim() && content.trim();

  const handleSave = (publishStatus: "Draf" | "Terbit") => {
    if (!title.trim()) {
      toast.error("Judul wajib diisi");
      return;
    }
    if (!author.trim()) {
      toast.error("Penulis wajib diisi");
      return;
    }
    if (publishStatus === "Terbit" && !content.trim()) {
      toast.error("Konten wajib diisi untuk menerbitkan artikel");
      return;
    }
    toast.success(publishStatus === "Terbit" ? "Artikel diterbitkan!" : "Draf disimpan!", {
      description: title,
    });
    navigate("/admin/artikel");
  };

  const handleDiscard = () => {
    if (title || author || content || excerpt) {
      setShowDiscard(true);
    } else {
      navigate("/admin/artikel");
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={handleDiscard}
            className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-gray-900">Buat Artikel Baru</h1>
            <p className="text-gray-500 mt-0.5" style={{ fontSize: 14 }}>
              Tulis dan terbitkan artikel untuk halaman publik LPPM
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            style={{ fontSize: 13, fontWeight: 600 }}
          >
            <Eye size={15} /> Preview
          </button>
          <button
            onClick={() => handleSave("Draf")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            style={{ fontSize: 13, fontWeight: 600 }}
          >
            <Save size={15} /> Simpan Draf
          </button>
          <button
            onClick={() => handleSave("Terbit")}
            disabled={!canPublish}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#7c2d12] text-white hover:bg-[#92400e] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ fontSize: 13, fontWeight: 600 }}
          >
            <Upload size={15} /> Terbitkan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main editor */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <label className="block text-gray-700 mb-2" style={{ fontSize: 13, fontWeight: 600 }}>
              Judul Artikel <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masukkan judul artikel yang menarik..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 bg-gray-50 outline-none focus:border-[#7c2d12] focus:ring-2 focus:ring-[#7c2d12]/10 transition-all"
              style={{ fontSize: 16, fontWeight: 600 }}
            />
          </div>

          {/* Content editor */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-3 border-b border-gray-100 flex items-center justify-between">
              <label className="text-gray-700" style={{ fontSize: 13, fontWeight: 600 }}>
                Konten Artikel <span className="text-red-500">*</span>
              </label>
              {/* Fake toolbar */}
              <div className="flex items-center gap-1">
                {[Bold, Italic, List, Link2, Image].map((Icon, i) => (
                  <button
                    key={i}
                    className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                    onClick={() => toast.info("Editor toolbar", { description: "Fitur rich text editor akan tersedia di versi berikutnya." })}
                  >
                    <Icon size={16} />
                  </button>
                ))}
              </div>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tulis konten artikel di sini...&#10;&#10;Gunakan paragraf terpisah untuk struktur yang rapi. Anda juga dapat menambahkan sub-judul, daftar poin, dan referensi."
              className="w-full px-6 py-4 text-gray-700 bg-white outline-none resize-none"
              style={{ fontSize: 15, lineHeight: 1.8, minHeight: 360 }}
            />
            <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-gray-400" style={{ fontSize: 12 }}>
                {content.length} karakter · ~{Math.ceil(content.split(/\s+/).filter(Boolean).length / 200)} menit baca
              </span>
              <span className="text-gray-400" style={{ fontSize: 12 }}>
                Markdown sederhana didukung
              </span>
            </div>
          </div>

          {/* Excerpt */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <label className="block text-gray-700 mb-2" style={{ fontSize: 13, fontWeight: 600 }}>
              Ringkasan / Excerpt
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Ringkasan singkat yang akan ditampilkan di halaman daftar artikel (maks 200 karakter)..."
              rows={3}
              maxLength={200}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-700 bg-gray-50 outline-none focus:border-[#7c2d12] focus:ring-2 focus:ring-[#7c2d12]/10 transition-all resize-none"
              style={{ fontSize: 14 }}
            />
            <p className="text-gray-400 text-right mt-1" style={{ fontSize: 12 }}>{excerpt.length}/200</p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish settings */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-gray-900 mb-4 flex items-center gap-2" style={{ fontWeight: 600 }}>
              <FileText size={16} className="text-[#7c2d12]" /> Pengaturan
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1.5" style={{ fontSize: 13, fontWeight: 600 }}>
                  Penulis <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Nama penulis"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 text-gray-700 outline-none focus:border-[#7c2d12] transition-all"
                  style={{ fontSize: 14 }}
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1.5" style={{ fontSize: 13, fontWeight: 600 }}>Kategori</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 text-gray-700 outline-none focus:border-[#7c2d12] transition-all"
                  style={{ fontSize: 14 }}
                >
                  {categories.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-1.5" style={{ fontSize: 13, fontWeight: 600 }}>Tags</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="riset, inovasi, teknologi"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 text-gray-700 outline-none focus:border-[#7c2d12] transition-all"
                  style={{ fontSize: 14 }}
                />
                <p className="text-gray-400 mt-1" style={{ fontSize: 12 }}>Pisahkan dengan koma</p>
              </div>
              <div>
                <label className="block text-gray-700 mb-1.5" style={{ fontSize: 13, fontWeight: 600 }}>Status</label>
                <div className="flex gap-2">
                  {(["Draf", "Terbit"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatus(s)}
                      className={`flex-1 py-2 rounded-lg border-2 transition-all ${
                        status === s
                          ? s === "Terbit"
                            ? "bg-green-50 border-green-400 text-green-700"
                            : "bg-amber-50 border-amber-400 text-amber-700"
                          : "border-gray-200 text-gray-500 hover:border-gray-300"
                      }`}
                      style={{ fontSize: 13, fontWeight: 600 }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Cover image placeholder */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-gray-900 mb-4 flex items-center gap-2" style={{ fontWeight: 600 }}>
              <Image size={16} className="text-[#7c2d12]" /> Gambar Sampul
            </h3>
            <div
              className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-[#7c2d12]/40 hover:bg-[#fef2f2]/30 transition-all cursor-pointer"
              onClick={() => toast.info("Upload gambar", { description: "Fitur upload gambar akan tersedia di versi berikutnya." })}
            >
              <Image size={32} className="text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500" style={{ fontSize: 13, fontWeight: 600 }}>Klik untuk upload gambar</p>
              <p className="text-gray-400 mt-1" style={{ fontSize: 12 }}>PNG, JPG maks 2MB · Rasio 16:9</p>
            </div>
          </div>

          {/* Tips */}
          <div className="rounded-xl bg-[#fef2f2] border border-[#7c2d12]/10 p-5">
            <p className="text-[#7c2d12]" style={{ fontSize: 13, fontWeight: 700 }}>Tips Menulis Artikel</p>
            <ul className="mt-2 space-y-1.5">
              {[
                "Gunakan judul yang jelas dan menarik",
                "Tambahkan ringkasan untuk preview di homepage",
                "Pisahkan konten menjadi paragraf pendek",
                "Simpan sebagai draf jika belum selesai",
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-[#92400e]" style={{ fontSize: 12, lineHeight: 1.5 }}>
                  <span className="w-1 h-1 rounded-full bg-[#7c2d12] mt-1.5 flex-shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Preview modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowPreview(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="px-8 pt-8 pb-6" style={{ background: "linear-gradient(135deg, #7c2d12 0%, #b45309 100%)" }}>
              <p className="text-white/60 mb-1" style={{ fontSize: 11, fontWeight: 600 }}>PREVIEW ARTIKEL</p>
              <h2 className="text-white" style={{ fontSize: 20, fontWeight: 800 }}>
                {title || "Judul Artikel"}
              </h2>
              <p className="text-white/70 mt-2" style={{ fontSize: 13 }}>
                {author || "Penulis"} · {category} · 17 Mar 2026
              </p>
            </div>
            <div className="flex-1 overflow-y-auto px-8 py-6">
              {content ? (
                content.split("\n\n").map((p, i) => (
                  <p key={i} className="text-gray-700 mb-4" style={{ fontSize: 15, lineHeight: 1.8 }}>{p}</p>
                ))
              ) : (
                <p className="text-gray-400 italic" style={{ fontSize: 15 }}>Belum ada konten...</p>
              )}
            </div>
            <div className="px-8 py-4 border-t border-gray-100 flex justify-end">
              <button onClick={() => setShowPreview(false)} className="px-5 py-2 rounded-xl bg-[#7c2d12] text-white" style={{ fontSize: 14, fontWeight: 600 }}>
                Tutup Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Discard confirmation */}
      <ConfirmDialog
        open={showDiscard}
        title="Buang Perubahan?"
        message="Anda memiliki perubahan yang belum disimpan. Apakah yakin ingin keluar tanpa menyimpan?"
        confirmLabel="Buang"
        variant="danger"
        onConfirm={() => navigate("/admin/artikel")}
        onCancel={() => setShowDiscard(false)}
      />
    </div>
  );
}
