import { Link } from "react-router";
import { ArrowRight, Award, FlaskConical, Handshake, ScrollText } from "lucide-react";
import { ArticleCard } from "../components/ArticleCard";
import { ImageWithFallback } from "../components/ImageWithFallback";
import { articles } from "../data/articles";

const stats = [
  { number: "45+", label: "Penelitian Aktif" },
  { number: "8", label: "Hibah DRTPM" },
  { number: "120+", label: "Publikasi Ilmiah" },
  { number: "15", label: "HKI Terdaftar" },
];

const highlights = [
  {
    icon: FlaskConical,
    title: "Penelitian Unggul",
    desc: "Mendorong riset berkualitas tinggi yang berdampak langsung pada pengembangan ilmu pengetahuan dan inovasi kampus.",
  },
  {
    icon: ScrollText,
    title: "Publikasi Ilmiah",
    desc: "Memfasilitasi dosen untuk mempublikasikan karya ilmiah pada jurnal nasional dan internasional yang bereputasi.",
  },
  {
    icon: Award,
    title: "Hibah Internal",
    desc: "Menyediakan ekosistem pendanaan, monitoring, dan dukungan pelaksanaan hibah penelitian serta pengabdian dosen.",
  },
  {
    icon: Handshake,
    title: "Pengabdian Masyarakat",
    desc: "Menghubungkan pengetahuan kampus dengan kebutuhan nyata masyarakat, mitra industri, dan lingkungan sekitar.",
  },
];

export function HomePage() {
  const featuredArticle = articles[0];
  const otherArticles = articles.slice(1, 4);

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>

      {/* ── Hero Section ── */}
      <section style={{ background: '#f8f9fa', padding: '56px 0 48px', borderBottom: '1px solid #e9ecef' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">

            {/* Text */}
            <div className="lg:col-span-2">
              <span
                className="inline-block text-xs font-semibold tracking-widest uppercase mb-4 px-3 py-1 rounded-full"
                style={{ background: 'rgba(227,6,19,0.08)', color: '#E30613' }}
              >
                Artikel Terbaru
              </span>
              <h1 className="text-2xl md:text-3xl lg:text-4xl text-gray-800 leading-snug mb-4" style={{ fontWeight: 700 }}>
                {featuredArticle?.title}
              </h1>
              <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
                {featuredArticle?.description}
              </p>
              <Link
                to={`/artikel/${featuredArticle?.id}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-full transition-all hover:shadow-lg active:scale-95"
                style={{ background: '#E30613' }}
              >
                Baca Selengkapnya <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Featured image */}
            <div className="lg:col-span-3">
              <div className="rounded-2xl overflow-hidden shadow-lg aspect-[16/9]">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1532094349884-543559a8e9e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080"
                  alt="LPPM Pradita"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section style={{ background: '#E30613' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-bold text-white">{s.number}</div>
                <div className="text-xs text-red-100 mt-1 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Artikel Lainnya ── */}
      <section style={{ padding: '60px 0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2" style={{ fontFamily: "'Amatic SC', 'Inter', cursive", fontSize: 36 }}>
              Artikel Lainnya
            </h2>
            <div className="w-12 h-1 rounded-full mx-auto" style={{ background: '#E30613' }} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {otherArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/artikel"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold border-2 rounded-full transition-all hover:shadow-md"
              style={{ borderColor: '#E30613', color: '#E30613' }}
            >
              Lihat Semua Artikel <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Highlight LPPM ── */}
      <section style={{ background: '#f8f9fa', padding: '60px 0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 style={{ fontFamily: "'Amatic SC','Inter',cursive", fontSize: 36, fontWeight: 700, color: '#343a40', marginBottom: 8 }}>
              Layanan LPPM
            </h2>
            <div className="w-12 h-1 rounded-full mx-auto" style={{ background: '#E30613' }} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 group"
                style={{ border: '1px solid #dee2e6', borderRadius: 12 }}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors"
                  style={{ background: 'rgba(227,6,19,0.08)' }}
                >
                  <Icon className="w-7 h-7" style={{ color: '#E30613' }} />
                </div>
                <h4 className="text-gray-800 font-semibold mb-2">{title}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Program Kosabangsa ── */}
      <section style={{ padding: '60px 0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group" style={{ border: '1px solid #dee2e6' }}>
              <div style={{ aspectRatio: '16/9', overflow: 'hidden' }}>
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1760992004210-44a502a2872d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080"
                  alt="Program Kosabangsa"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: 'rgba(227,6,19,0.08)', color: '#E30613' }}>Program Unggulan</span>
                <h2 className="text-xl font-bold text-gray-800 mt-3 mb-2">Program Kosabangsa</h2>
                <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                  Program pendanaan untuk menjembatani kolaborasi dalam pengembangan dan penerapan IPTEKS yang dihasilkan oleh perguruan tinggi untuk dimanfaatkan oleh masyarakat dan industri.
                </p>
                <Link
                  to="/program/kosabangsa"
                  className="inline-flex items-center gap-2 text-sm font-semibold transition-colors"
                  style={{ color: '#E30613' }}
                >
                  Pelajari Lebih Lanjut <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 flex flex-col justify-center" style={{ border: '1px solid #dee2e6' }}>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">Capaian LPPM 2024</h2>
              <div className="w-10 h-1 rounded-full mb-6" style={{ background: '#E30613' }} />
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center p-5 rounded-xl" style={{ background: '#f8f9fa', border: '1px solid #dee2e6' }}>
                    <div className="text-3xl font-bold mb-1" style={{ color: '#E30613' }}>{stat.number}</div>
                    <div className="text-xs text-gray-500 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
