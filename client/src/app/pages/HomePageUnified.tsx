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

export function HomePageUnified() {
  const featuredArticle = articles[0];
  const otherArticles = articles.slice(1, 4);

  return (
    <div className="pb-8">
      <section className="app-section pt-8 sm:pt-10">
        <div className="app-container">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center">
            <div className="space-y-6">
              <span className="app-eyebrow">LPPM Universitas Pradita</span>
              <div className="space-y-5">
                <h1 className="app-title">
                  Satu ruang kerja riset untuk penelitian, publikasi, hibah, dan pengabdian.
                </h1>
                <p className="app-subtitle max-w-2xl">
                  SIPPM menyatukan informasi layanan LPPM, berita terbaru, dan akses ke
                  workspace internal agar dosen, reviewer, dan admin bekerja dalam pola yang
                  konsisten dan mudah dipahami.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link to="/login" className="app-btn app-btn-primary">
                  Masuk ke SIPPM
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/artikel" className="app-btn app-btn-secondary">
                  Lihat Artikel
                </Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((item) => (
                  <div key={item.label} className="app-card px-5 py-5">
                    <div className="text-2xl font-semibold tracking-[-0.03em] text-[var(--app-heading)]">
                      {item.number}
                    </div>
                    <div className="mt-1 text-sm text-slate-500">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="app-panel overflow-hidden p-3 sm:p-4">
              <div className="relative overflow-hidden rounded-[1.2rem]">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1532094349884-543559a8e9e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080"
                  alt="Aktivitas riset LPPM Pradita"
                  className="aspect-[16/10] w-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/70 via-slate-950/15 to-transparent p-6 sm:p-7">
                  <div className="space-y-2">
                    <span className="inline-flex items-center rounded-full bg-white/14 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-md">
                      Artikel Pilihan
                    </span>
                    <div className="text-xl font-semibold leading-snug text-white sm:text-2xl">
                      {featuredArticle?.title}
                    </div>
                    <p className="max-w-xl text-sm leading-6 text-slate-200">
                      {featuredArticle?.description}
                    </p>
                    <Link
                      to={`/artikel/${featuredArticle?.id}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-white transition hover:text-rose-200"
                    >
                      Baca selengkapnya
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="app-section app-section-muted">
        <div className="app-container">
          <div className="space-y-3">
            <span className="app-eyebrow">Layanan Utama</span>
            <div>
              <h2 className="app-title-lg">Ekosistem kerja LPPM yang lebih rapi dan terhubung.</h2>
              <p className="app-subtitle mt-3 max-w-3xl">
                Setiap layanan dirancang dengan struktur yang seragam agar pengguna publik,
                dosen, reviewer, dan admin tetap merasa berada di web yang sama.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {highlights.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="app-card-soft p-6">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--app-primary-soft)] text-[var(--app-primary)]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--app-heading)]">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="app-section">
        <div className="app-container">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-3">
              <span className="app-eyebrow">Publikasi dan Informasi</span>
              <div>
                <h2 className="app-title-lg">Artikel terbaru dari aktivitas LPPM.</h2>
                <p className="app-subtitle mt-3 max-w-2xl">
                  Informasi penelitian, pengabdian, workshop, dan capaian institusi ditampilkan
                  dengan card yang seragam agar mudah dibaca di seluruh halaman.
                </p>
              </div>
            </div>
            <Link to="/artikel" className="app-btn app-btn-secondary">
              Lihat semua artikel
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {otherArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>

      <section className="app-section pt-0">
        <div className="app-container">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div className="app-card overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1760992004210-44a502a2872d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080"
                alt="Program Kosabangsa"
                className="aspect-[16/10] w-full object-cover"
              />
              <div className="space-y-4 p-6 sm:p-7">
                <span className="app-chip">Program Unggulan</span>
                <div>
                  <h2 className="app-title-md">Program Kosabangsa</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    Pendanaan kolaboratif untuk mendorong penerapan IPTEKS hasil perguruan tinggi
                    agar memberi manfaat nyata bagi masyarakat dan mitra industri.
                  </p>
                </div>
                <Link to="/program/kosabangsa" className="app-link inline-flex items-center gap-2 text-sm">
                  Pelajari lebih lanjut
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="app-card-soft p-6 sm:p-8">
              <div className="space-y-3">
                <span className="app-eyebrow">Capaian Tahunan</span>
                <div>
                  <h2 className="app-title-md">Ringkasan performa LPPM 2024</h2>
                  <p className="app-subtitle mt-3">
                    Visual, angka, dan action dibuat memakai pola yang sama seperti panel internal
                    agar konsistensi terasa sejak halaman publik sampai dashboard role.
                  </p>
                </div>
              </div>

              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                {stats.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[1.15rem] border border-[var(--app-border)] bg-white px-5 py-5 shadow-[var(--app-shadow-sm)]"
                  >
                    <div className="text-3xl font-semibold tracking-[-0.03em] text-[var(--app-primary)]">
                      {item.number}
                    </div>
                    <div className="mt-2 text-sm font-medium text-slate-500">{item.label}</div>
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
