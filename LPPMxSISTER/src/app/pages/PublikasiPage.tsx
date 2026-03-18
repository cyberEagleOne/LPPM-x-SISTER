import { useState } from "react";
import { Link } from "react-router";
import { Search, Filter, User, Calendar, BookOpen, ChevronDown } from "lucide-react";
import { publications } from "../data/publications";

const prodiOptions = ["Semua Prodi", "Teknik Informatika", "Ekonomi Pembangunan", "Farmasi", "Biologi", "Teknik Sipil", "Manajemen", "Teknik Kimia", "Pendidikan Matematika"];
const yearOptions = ["Semua Tahun", "2025", "2024", "2023"];

export function PublikasiPage() {
  const [search, setSearch] = useState("");
  const [prodi, setProdi] = useState("Semua Prodi");
  const [year, setYear] = useState("Semua Tahun");
  const [showFilter, setShowFilter] = useState(false);

  const filtered = publications.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.author.toLowerCase().includes(search.toLowerCase()) ||
      p.journal.toLowerCase().includes(search.toLowerCase());
    const matchProdi = prodi === "Semua Prodi" || p.prodi === prodi;
    const matchYear = year === "Semua Tahun" || String(p.year) === year;
    return matchSearch && matchProdi && matchYear;
  });

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      {/* Header */}
      <div className="bg-[#1e3a8a] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-blue-300 mb-2" style={{ fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Basis Data
          </p>
          <h1 className="text-white" style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 800 }}>
            Publikasi Ilmiah
          </h1>
          <p className="text-blue-200 mt-2" style={{ fontSize: 14 }}>
            Daftar publikasi ilmiah yang telah diverifikasi oleh LPPM Universitas Pradita
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2.5 flex-1 shadow-sm">
            <Search size={16} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Cari judul, penulis, atau jurnal..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 outline-none text-gray-700 bg-transparent"
              style={{ fontSize: 14 }}
            />
          </div>
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-gray-200 text-gray-600 hover:border-[#1e3a8a] hover:text-[#1e3a8a] shadow-sm transition-colors"
            style={{ fontSize: 14 }}
          >
            <Filter size={15} />
            Filter
            <ChevronDown size={15} className={`transition-transform ${showFilter ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Filter panel */}
        {showFilter && (
          <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2" style={{ fontSize: 13, fontWeight: 600 }}>Program Studi</label>
                <select
                  value={prodi}
                  onChange={(e) => setProdi(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-700 bg-white outline-none focus:border-[#1e3a8a]"
                  style={{ fontSize: 14 }}
                >
                  {prodiOptions.map((p) => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2" style={{ fontSize: 13, fontWeight: 600 }}>Tahun Publikasi</label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-700 bg-white outline-none focus:border-[#1e3a8a]"
                  style={{ fontSize: 14 }}
                >
                  {yearOptions.map((y) => <option key={y}>{y}</option>)}
                </select>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => { setProdi("Semua Prodi"); setYear("Semua Tahun"); }}
                className="text-gray-500 hover:text-gray-700 mr-4"
                style={{ fontSize: 13 }}
              >
                Reset
              </button>
              <button
                onClick={() => setShowFilter(false)}
                className="px-4 py-2 rounded-lg bg-[#1e3a8a] text-white"
                style={{ fontSize: 13, fontWeight: 600 }}
              >
                Terapkan
              </button>
            </div>
          </div>
        )}

        {/* Count */}
        <p className="text-gray-500 mb-5" style={{ fontSize: 13 }}>
          Menampilkan <strong>{filtered.length}</strong> dari {publications.length} publikasi
        </p>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-5 py-3.5 text-gray-500" style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Judul & Jurnal</th>
                  <th className="text-left px-4 py-3.5 text-gray-500 hidden md:table-cell" style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Penulis</th>
                  <th className="text-left px-4 py-3.5 text-gray-500 hidden lg:table-cell" style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Program Studi</th>
                  <th className="text-center px-4 py-3.5 text-gray-500" style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Tahun</th>
                  <th className="text-center px-4 py-3.5 text-gray-500" style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.length > 0 ? filtered.map((pub) => (
                  <tr key={pub.id} className="hover:bg-[#f8faff] transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#eff6ff] flex items-center justify-center flex-shrink-0 mt-0.5">
                          <BookOpen size={14} className="text-[#1e3a8a]" />
                        </div>
                        <div>
                          <Link
                            to={`/publikasi/${pub.id}`}
                            className="text-gray-900 hover:text-[#1e3a8a] transition-colors"
                            style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.4 }}
                          >
                            {pub.title}
                          </Link>
                          <p className="text-gray-400 mt-1" style={{ fontSize: 12 }}>
                            {pub.journal} · DOI: {pub.doi}
                          </p>
                          <div className="md:hidden mt-1">
                            <span className="flex items-center gap-1 text-gray-500" style={{ fontSize: 12 }}>
                              <User size={11} /> {pub.author}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className="flex items-center gap-1.5 text-gray-600" style={{ fontSize: 13 }}>
                        <User size={13} className="text-gray-400" /> {pub.author}
                      </span>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <span className="text-gray-600" style={{ fontSize: 13 }}>{pub.prodi}</span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="flex items-center justify-center gap-1 text-gray-500" style={{ fontSize: 13 }}>
                        <Calendar size={12} /> {pub.year}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 text-green-700" style={{ fontSize: 11, fontWeight: 600 }}>
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                        {pub.status}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="text-center py-16 text-gray-400">
                      <Search size={32} className="mx-auto mb-3 text-gray-300" />
                      <p style={{ fontSize: 14 }}>Tidak ada publikasi yang ditemukan</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-gray-400" style={{ fontSize: 13 }}>Halaman 1 dari 1</p>
            <div className="flex items-center gap-1">
              {[1].map((p) => (
                <button
                  key={p}
                  className="w-8 h-8 rounded-lg bg-[#1e3a8a] text-white"
                  style={{ fontSize: 13, fontWeight: 600 }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}