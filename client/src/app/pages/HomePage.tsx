import { Link } from "react-router";
import { ArrowRight, BookOpen, Users, Award, FileText, ChevronRight, Calendar, User } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { AnimatedCounter } from "../components/AnimatedCounter";
import { motion } from "motion/react";
import { articles } from "../data/articles";
import { publications } from "../data/publications";

const stats = [
  { label: "Total Penelitian", value: 1248, icon: BookOpen, color: "#1e3a8a", bg: "#eff6ff" },
  { label: "Publikasi Terbit", value: 892, icon: FileText, color: "#065f46", bg: "#ecfdf5" },
  { label: "Dosen Aktif", value: 347, icon: Users, color: "#7c2d12", bg: "#fff7ed" },
  { label: "Penghargaan", value: 54, icon: Award, color: "#4c1d95", bg: "#f5f3ff" },
];

const latestPublications = publications.slice(0, 3);
const latestArticles = articles.slice(0, 3);

const categoryColors: Record<string, string> = {
  Inovasi: "bg-blue-100 text-blue-700",
  Kegiatan: "bg-green-100 text-green-700",
  Opini: "bg-purple-100 text-purple-700",
};

export function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#1e3a8a]">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1767969456622-801489bdc169?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwY2FtcHVzJTIwcmVzZWFyY2glMjBidWlsZGluZ3xlbnwxfHx8fDE3NzMxNTYxOTJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="University campus"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400"></span>
              <span className="text-white/90" style={{ fontSize: 13, fontWeight: 500 }}>
                Platform Penelitian Terintegrasi
              </span>
            </div>
            <h1 className="text-white mb-4" style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 800, lineHeight: 1.2 }}>
              LPPM × SISTER
              <br />
              <span style={{ color: "#93c5fd" }}>Universitas Pradita</span>
            </h1>
            <p className="text-blue-200 mb-8" style={{ fontSize: 16, lineHeight: 1.75, maxWidth: 520 }}>
              Sistem manajemen penelitian terpadu untuk mendukung ekosistem riset, review, dan publikasi ilmiah civitas akademika.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/publikasi"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-[#1e3a8a] hover:bg-blue-50 transition-colors"
                style={{ fontSize: 14, fontWeight: 600 }}
              >
                Lihat Publikasi
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/30 text-white hover:bg-white/10 transition-colors"
                style={{ fontSize: 14, fontWeight: 600 }}
              >
                Masuk ke Sistem
              </Link>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="relative h-12 overflow-hidden">
          <svg viewBox="0 0 1440 48" preserveAspectRatio="none" className="absolute bottom-0 w-full h-full fill-[#f8fafc]">
            <path d="M0,48 L0,24 Q360,0 720,24 Q1080,48 1440,24 L1440,48 Z" />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div
                className="w-11 h-11 rounded-lg flex items-center justify-center mb-3"
                style={{ backgroundColor: stat.bg }}
              >
                <stat.icon size={20} style={{ color: stat.color }} />
              </div>
              <AnimatedCounter value={stat.value} className="text-gray-900" style={{ fontSize: 26, fontWeight: 800, lineHeight: 1 }} />
              <p className="text-gray-500 mt-1" style={{ fontSize: 13 }}>{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Latest Publications */}
      <section className="bg-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[#1e3a8a] mb-1" style={{ fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Terbaru
              </p>
              <h2 className="text-gray-900">Publikasi Ilmiah</h2>
            </div>
            <Link
              to="/publikasi"
              className="hidden sm:inline-flex items-center gap-1.5 text-[#1e3a8a] hover:text-[#1e40af] transition-colors"
              style={{ fontSize: 14, fontWeight: 600 }}
            >
              Lihat Semua <ChevronRight size={15} />
            </Link>
          </div>

          <div className="space-y-4">
            {latestPublications.map((pub, i) => (
              <div
                key={pub.id}
                className="flex items-start gap-4 p-5 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-[#f8faff] transition-all"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#eff6ff] text-[#1e3a8a]"
                  style={{ fontSize: 13, fontWeight: 700 }}
                >
                  #{String(i + 1).padStart(2, "0")}
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/publikasi/${pub.id}`}
                    className="text-gray-900 hover:text-[#1e3a8a] transition-colors"
                    style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.5 }}
                  >
                    {pub.title}
                  </Link>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
                    <span className="flex items-center gap-1 text-gray-500" style={{ fontSize: 12 }}>
                      <User size={12} /> {pub.author}
                    </span>
                    <span className="text-gray-300">·</span>
                    <span className="text-gray-500" style={{ fontSize: 12 }}>{pub.prodi}</span>
                    <span className="text-gray-300">·</span>
                    <span className="text-gray-500" style={{ fontSize: 12 }}>{pub.year}</span>
                  </div>
                  <p className="text-gray-400 mt-1" style={{ fontSize: 12 }}>DOI: {pub.doi}</p>
                </div>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-100 text-green-700 flex-shrink-0" style={{ fontSize: 11, fontWeight: 600 }}>
                  Terverifikasi
                </span>
              </div>
            ))}
          </div>

          <div className="sm:hidden mt-4 text-center">
            <Link to="/publikasi" className="text-[#1e3a8a]" style={{ fontSize: 14, fontWeight: 600 }}>
              Lihat Semua Publikasi →
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[#1e3a8a] mb-1" style={{ fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Berita & Info
            </p>
            <h2 className="text-gray-900">Artikel Terkini</h2>
          </div>
          <Link
            to="/artikel"
            className="hidden sm:inline-flex items-center gap-1.5 text-[#1e3a8a] hover:text-[#1e40af] transition-colors"
            style={{ fontSize: 14, fontWeight: 600 }}
          >
            Lihat Semua <ChevronRight size={15} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestArticles.map((article) => (
            <article
              key={article.id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden group"
            >
              <div className="h-40 bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6] flex items-center justify-center">
                <BookOpen size={36} className="text-white/40" />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2.5 py-1 rounded-full ${categoryColors[article.category]}`} style={{ fontSize: 11, fontWeight: 600 }}>
                    {article.category}
                  </span>
                  <span className="flex items-center gap-1 text-gray-400" style={{ fontSize: 12 }}>
                    <Calendar size={12} /> {article.date}
                  </span>
                </div>
                <h3 className="text-gray-900 group-hover:text-[#1e3a8a] transition-colors" style={{ lineHeight: 1.5 }}>
                  {article.title}
                </h3>
                <p className="text-gray-500 mt-2 line-clamp-2" style={{ fontSize: 13, lineHeight: 1.65 }}>
                  {article.preview}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-gray-400" style={{ fontSize: 12 }}>
                    <User size={12} /> {article.author}
                  </span>
                  <Link
                    to={`/artikel/${article.id}`}
                    className="flex items-center gap-1 text-[#1e3a8a] hover:text-[#1e40af]"
                    style={{ fontSize: 13, fontWeight: 700 }}
                  >
                    Baca <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-gradient-to-r from-[#1e3a8a] to-[#1d4ed8] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-white mb-3" style={{ fontSize: "clamp(20px, 3vw, 30px)", fontWeight: 700 }}>
            Siap Mendaftarkan Penelitian Anda?
          </h2>
          <p className="text-blue-200 mb-6" style={{ fontSize: 15, maxWidth: 480, margin: "0 auto 24px" }}>
            Masuk ke portal LPPM × SISTER dan mulai proses pengajuan penelitian Anda hari ini.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-lg bg-white text-[#1e3a8a] hover:bg-blue-50 transition-colors"
            style={{ fontSize: 14, fontWeight: 600 }}
          >
            Masuk Sekarang <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}