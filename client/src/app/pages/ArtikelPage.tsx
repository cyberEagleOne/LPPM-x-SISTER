import React, { useState } from "react";
import { Link } from "react-router";
import { Calendar, User, ChevronRight, Search, Tag, X } from "lucide-react";
import { motion } from "motion/react";
import { articles } from "../data/articles";

const categories = ["Semua", "Inovasi", "Kegiatan", "Opini", "Pengumuman", "Prestasi", "Panduan"];

const categoryColors: Record<string, string> = {
  Inovasi: "bg-blue-100 text-blue-700",
  Kegiatan: "bg-green-100 text-green-700",
  Opini: "bg-purple-100 text-purple-700",
  Pengumuman: "bg-amber-100 text-amber-700",
  Prestasi: "bg-rose-100 text-rose-700",
  Panduan: "bg-cyan-100 text-cyan-700",
};

export function ArtikelPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");

  const filtered = articles.filter((a) => {
    const matchSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.author.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "Semua" || a.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      {/* Header */}
      <div className="bg-[#1e3a8a] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-blue-300 mb-2" style={{ fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Berita & Informasi
          </p>
          <h1 className="text-white" style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 800 }}>
            Artikel LPPM
          </h1>
          <p className="text-blue-200 mt-2" style={{ fontSize: 14 }}>
            Berita, kegiatan, opini, dan pengumuman terbaru dari LPPM Universitas Pradita
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2.5 flex-1 shadow-sm focus-within:border-[#1e3a8a] focus-within:ring-2 focus-within:ring-[#1e3a8a]/10 transition-all">
            <Search size={16} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Cari artikel..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 outline-none text-gray-700 bg-transparent"
              style={{ fontSize: 14 }}
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full border transition-all ${
                activeCategory === cat
                  ? "bg-[#1e3a8a] text-white border-[#1e3a8a]"
                  : "bg-white text-gray-600 border-gray-200 hover:border-[#1e3a8a] hover:text-[#1e3a8a]"
              }`}
              style={{ fontSize: 13, fontWeight: 500 }}
            >
              {cat !== "Semua" && <Tag size={12} />}
              {cat}
            </button>
          ))}
        </div>

        {/* Result count */}
        <p className="text-gray-500 mb-6" style={{ fontSize: 13 }}>
          Menampilkan <strong>{filtered.length}</strong> artikel
        </p>

        {/* Articles Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((article, i) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group"
              >
                <div
                  className="h-44 flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
                  }}
                >
                  <div className="text-center px-6">
                    <span
                      className="inline-block px-3 py-1 rounded-full text-white/80 border border-white/20 mb-2"
                      style={{ fontSize: 11, fontWeight: 600 }}
                    >
                      {article.category}
                    </span>
                    <p className="text-white/90" style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.4 }}>
                      {article.title.length > 55 ? article.title.slice(0, 55) + "..." : article.title}
                    </p>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2.5 py-1 rounded-full ${categoryColors[article.category] || "bg-gray-100 text-gray-600"}`} style={{ fontSize: 11, fontWeight: 600 }}>
                      {article.category}
                    </span>
                    <span className="flex items-center gap-1 text-gray-400" style={{ fontSize: 12 }}>
                      <Calendar size={12} /> {article.date}
                    </span>
                  </div>

                  <h3 className="text-gray-900 group-hover:text-[#1e3a8a] transition-colors mb-2" style={{ lineHeight: 1.5 }}>
                    {article.title}
                  </h3>

                  <p className="text-gray-500 flex-1" style={{ fontSize: 13, lineHeight: 1.65 }}>
                    {article.preview.length > 120 ? article.preview.slice(0, 120) + "..." : article.preview}
                  </p>

                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-gray-400" style={{ fontSize: 12 }}>
                      <User size={12} /> {article.author}
                    </span>
                    <Link
                      to={`/artikel/${article.id}`}
                      className="flex items-center gap-1 text-[#1e3a8a] hover:text-[#1e40af] transition-colors"
                      style={{ fontSize: 13, fontWeight: 700 }}
                    >
                      Baca <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
            <Search size={36} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400" style={{ fontSize: 15 }}>Artikel tidak ditemukan</p>
            <p className="text-gray-400 mt-1" style={{ fontSize: 13 }}>Coba ubah kata kunci atau filter kategori</p>
          </div>
        )}
      </div>
    </div>
  );
}
