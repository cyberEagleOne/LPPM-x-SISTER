import { useState } from "react";
import { Link } from "react-router";
import { PlusCircle, BookOpen, Clock, CheckCircle, XCircle, FileText, ChevronRight, TrendingUp, X, Calendar, User, Tag } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const stats = [
  { label: "Total Penelitian", value: 8, icon: BookOpen, color: "#1e3a8a", bg: "#eff6ff", change: "+2 tahun ini" },
  { label: "Menunggu Review", value: 2, icon: Clock, color: "#d97706", bg: "#fffbeb", change: "Perlu tindak lanjut" },
  { label: "Disetujui", value: 5, icon: CheckCircle, color: "#059669", bg: "#ecfdf5", change: "Terverifikasi" },
  { label: "Ditolak", value: 1, icon: XCircle, color: "#dc2626", bg: "#fef2f2", change: "Perlu revisi" },
];

const penelitianData = [
  { id: 1, judul: "Pengembangan Model Pembelajaran Berbasis AI untuk Pendidikan Tinggi", tahun: 2025, status: "Disetujui", tanggal: "15 Jan 2025", bidang: "Teknik Informatika", skema: "Penelitian Terapan", abstrak: "Penelitian ini mengembangkan model pembelajaran berbasis kecerdasan buatan yang adaptif untuk meningkatkan kualitas pendidikan tinggi di Indonesia. Sistem ini mampu menyesuaikan materi pembelajaran berdasarkan kemampuan dan gaya belajar masing-masing mahasiswa.", reviewer: "Prof. Ahmad Fauzi", catatan: "Data sudah sesuai dengan SISTER. Disetujui." },
  { id: 2, judul: "Implementasi IoT dalam Monitoring Kualitas Udara Perkotaan", tahun: 2025, status: "Pending", tanggal: "3 Mar 2025", bidang: "Teknik Informatika", skema: "Penelitian Terapan", abstrak: "Penelitian ini merancang dan mengimplementasikan sistem monitoring kualitas udara berbasis Internet of Things (IoT) yang dapat digunakan secara real-time di kawasan perkotaan.", reviewer: "-", catatan: "-" },
  { id: 3, judul: "Sistem Rekomendasi Beasiswa Mahasiswa Menggunakan Machine Learning", tahun: 2025, status: "Pending", tanggal: "28 Feb 2025", bidang: "Teknik Informatika", skema: "Penelitian Dasar", abstrak: "Penelitian ini mengembangkan sistem rekomendasi beasiswa menggunakan algoritma machine learning untuk membantu proses seleksi beasiswa yang lebih objektif dan efisien.", reviewer: "-", catatan: "-" },
  { id: 4, judul: "Analisis Keamanan Aplikasi Mobile Perbankan di Indonesia", tahun: 2024, status: "Disetujui", tanggal: "10 Nov 2024", bidang: "Teknik Informatika", skema: "Penelitian Terapan", abstrak: "Studi ini menganalisis kerentanan keamanan pada aplikasi mobile perbankan yang banyak digunakan di Indonesia dan memberikan rekomendasi perbaikan.", reviewer: "Prof. Ahmad Fauzi", catatan: "Semua data terverifikasi. Approve." },
  { id: 5, judul: "Optimasi Algoritma Kompresi Data untuk Perangkat IoT Berdaya Rendah", tahun: 2024, status: "Ditolak", tanggal: "2 Sep 2024", bidang: "Teknik Informatika", skema: "Penelitian Dasar", abstrak: "Penelitian ini berfokus pada optimasi algoritma kompresi data yang efisien untuk diterapkan pada perangkat IoT dengan sumber daya komputasi terbatas.", reviewer: "Prof. Ahmad Fauzi", catatan: "Tahun penelitian tidak sesuai dengan data SISTER. Mohon perbaiki dan ajukan ulang." },
  { id: 6, judul: "Pengembangan Sistem Deteksi Plagiarisme Berbasis NLP Bahasa Indonesia", tahun: 2024, status: "Disetujui", tanggal: "5 Jul 2024", bidang: "Teknik Informatika", skema: "Penelitian Pengembangan", abstrak: "Sistem ini menggunakan teknik Natural Language Processing untuk mendeteksi plagiarisme pada teks berbahasa Indonesia dengan tingkat akurasi tinggi.", reviewer: "Prof. Ahmad Fauzi", catatan: "Data valid. Disetujui." },
];

type PenelitianItem = typeof penelitianData[0];

const statusConfig: Record<string, { label: string; className: string; dot: string }> = {
  Pending: { label: "Pending", className: "bg-amber-100 text-amber-700", dot: "bg-amber-500" },
  Disetujui: { label: "Disetujui", className: "bg-green-100 text-green-700", dot: "bg-green-500" },
  Ditolak: { label: "Ditolak", className: "bg-red-100 text-red-700", dot: "bg-red-500" },
};

const statusFilter = ["Semua", "Pending", "Disetujui", "Ditolak"];

export function DosenDashboard() {
  const [selectedItem, setSelectedItem] = useState<PenelitianItem | null>(null);
  const [activeFilter, setActiveFilter] = useState("Semua");

  const filtered = activeFilter === "Semua"
    ? penelitianData
    : penelitianData.filter((p) => p.status === activeFilter);

  return (
    <div>
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-gray-900">Dashboard Dosen</h1>
          <p className="text-gray-500 mt-0.5" style={{ fontSize: 14 }}>Selamat datang, Dr. Siti Rahma, M.Si. — Teknik Informatika</p>
        </div>
        <Link
          to="/dosen/tambah"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1e3a8a] text-white hover:bg-[#1e40af] transition-colors shadow-sm"
          style={{ fontSize: 14, fontWeight: 600 }}
        >
          <PlusCircle size={18} />
          Ajukan Penelitian
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-default"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: s.bg }}>
                <s.icon size={18} style={{ color: s.color }} />
              </div>
              <TrendingUp size={14} className="text-gray-300" />
            </div>
            <p className="text-gray-900" style={{ fontSize: 28, fontWeight: 800, lineHeight: 1 }}>{s.value}</p>
            <p className="text-gray-700 mt-1" style={{ fontSize: 13, fontWeight: 500 }}>{s.label}</p>
            <p className="text-gray-400 mt-0.5" style={{ fontSize: 11 }}>{s.change}</p>
          </motion.div>
        ))}
      </div>

      {/* Research table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-[#1e3a8a]" />
            <h2 className="text-gray-900">Daftar Penelitian Saya</h2>
          </div>
          <div className="flex items-center gap-2">
            {/* Status filter tabs */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              {statusFilter.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-3 py-1 rounded-md transition-all ${
                    activeFilter === f
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  style={{ fontSize: 12, fontWeight: activeFilter === f ? 600 : 500 }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-6 py-3 text-gray-500" style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Judul Penelitian</th>
                <th className="text-left px-4 py-3 text-gray-500 hidden md:table-cell" style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Tanggal Submit</th>
                <th className="text-center px-4 py-3 text-gray-500" style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Status</th>
                <th className="text-center px-4 py-3 text-gray-500" style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((p) => {
                const st = statusConfig[p.status];
                return (
                  <tr key={p.id} className="hover:bg-[#f8faff] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#eff6ff] flex items-center justify-center flex-shrink-0 mt-0.5">
                          <BookOpen size={13} className="text-[#1e3a8a]" />
                        </div>
                        <div>
                          <p className="text-gray-900" style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.4 }}>{p.judul}</p>
                          <p className="text-gray-400 mt-0.5" style={{ fontSize: 12 }}>{p.bidang} · {p.tahun}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className="text-gray-500" style={{ fontSize: 13 }}>{p.tanggal}</span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${st.className}`}
                        style={{ fontSize: 11, fontWeight: 600 }}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`}></span>
                        {st.label}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => setSelectedItem(p)}
                        className="inline-flex items-center gap-1 text-[#1e3a8a] hover:text-[#1e40af]"
                        style={{ fontSize: 13, fontWeight: 600 }}
                      >
                        Detail <ChevronRight size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-14">
                    <BookOpen size={32} className="text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-400" style={{ fontSize: 14 }}>Tidak ada penelitian dengan status ini</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className={`px-6 py-5 flex items-start justify-between ${
                selectedItem.status === "Disetujui" ? "bg-green-50" :
                selectedItem.status === "Ditolak" ? "bg-red-50" : "bg-amber-50"
              }`}>
                <div className="flex-1 min-w-0 pr-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full mb-3 ${statusConfig[selectedItem.status].className}`}
                    style={{ fontSize: 11, fontWeight: 600 }}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${statusConfig[selectedItem.status].dot}`}></span>
                    {statusConfig[selectedItem.status].label}
                  </span>
                  <h3 className="text-gray-900" style={{ lineHeight: 1.5 }}>{selectedItem.judul}</h3>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-2 rounded-lg text-gray-400 hover:bg-white/60 hover:text-gray-600 transition-colors flex-shrink-0"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal body */}
              <div className="px-6 py-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-400 flex items-center gap-1.5" style={{ fontSize: 11, fontWeight: 600 }}>
                      <Calendar size={11} /> Tanggal Submit
                    </p>
                    <p className="text-gray-900 mt-1" style={{ fontSize: 14, fontWeight: 600 }}>{selectedItem.tanggal}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-400 flex items-center gap-1.5" style={{ fontSize: 11, fontWeight: 600 }}>
                      <Tag size={11} /> Skema
                    </p>
                    <p className="text-gray-900 mt-1" style={{ fontSize: 14, fontWeight: 600 }}>{selectedItem.skema}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-400 flex items-center gap-1.5" style={{ fontSize: 11, fontWeight: 600 }}>
                      <BookOpen size={11} /> Bidang
                    </p>
                    <p className="text-gray-900 mt-1" style={{ fontSize: 14, fontWeight: 600 }}>{selectedItem.bidang}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-400 flex items-center gap-1.5" style={{ fontSize: 11, fontWeight: 600 }}>
                      <User size={11} /> Reviewer
                    </p>
                    <p className="text-gray-900 mt-1" style={{ fontSize: 14, fontWeight: 600 }}>{selectedItem.reviewer}</p>
                  </div>
                </div>

                <div>
                  <p className="text-gray-500 mb-2" style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Abstrak</p>
                  <p className="text-gray-700 bg-gray-50 rounded-lg p-4" style={{ fontSize: 14, lineHeight: 1.7 }}>
                    {selectedItem.abstrak}
                  </p>
                </div>

                {selectedItem.catatan !== "-" && (
                  <div className={`rounded-lg p-4 ${
                    selectedItem.status === "Ditolak" ? "bg-red-50 border border-red-100" :
                    selectedItem.status === "Disetujui" ? "bg-green-50 border border-green-100" : "bg-gray-50"
                  }`}>
                    <p className="text-gray-500 mb-1" style={{ fontSize: 12, fontWeight: 600 }}>Catatan Reviewer</p>
                    <p className={`${selectedItem.status === "Ditolak" ? "text-red-700" : "text-gray-700"}`} style={{ fontSize: 14, lineHeight: 1.6 }}>
                      {selectedItem.catatan}
                    </p>
                  </div>
                )}
              </div>

              {/* Modal footer */}
              <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-5 py-2 rounded-xl bg-[#1e3a8a] text-white hover:bg-[#1e40af] transition-colors"
                  style={{ fontSize: 14, fontWeight: 600 }}
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}