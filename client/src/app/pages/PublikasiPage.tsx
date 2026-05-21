import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { ChevronRight, BookOpen, FileText, Award, ExternalLink, GraduationCap } from "lucide-react";
import type { Publikasi } from "../../../../shared/models/Publikasi/Publikasi";

const publikasiContent: Record<string, { title: string; content: React.ReactNode }> = {
  sinta: {
    title: "Sinta",
    content: (
      <div className="space-y-6 text-sm text-gray-600">
        <p className="leading-relaxed">Sinta (Science and Technology Index) adalah portal yang dikembangkan oleh Kemendikbudristek untuk mengindeks peneliti, jurnal, dan institusi di Indonesia.</p>
        <a
          href="https://sinta.kemdikbud.go.id/affiliations/profile/1233"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 p-5 rounded-xl hover:shadow-md transition-all group"
          style={{ border: '1px solid #dee2e6', background: '#fff' }}
        >
          <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(227,6,19,0.08)' }}>
            <GraduationCap className="w-6 h-6" style={{ color: '#E30613' }} />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-gray-800 group-hover:text-[#E30613] transition-colors flex items-center gap-2">
              Profil Sinta Universitas Pradita <ExternalLink className="w-3.5 h-3.5" />
            </div>
            <p className="text-gray-500 text-xs mt-1">Lihat profil institusi, dosen, dan karya ilmiah Universitas Pradita di portal Sinta Kemendikbudristek</p>
          </div>
        </a>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { label: "Skor Afiliasi", value: "1.250" },
            { label: "Dosen Terindeks", value: "89" },
            { label: "Artikel Terindeks", value: "340+" },
          ].map((s) => (
            <div key={s.label} className="p-4 rounded-xl text-center" style={{ background: 'rgba(227,6,19,0.04)', border: '1px solid rgba(227,6,19,0.1)' }}>
              <div className="text-2xl font-bold" style={{ color: '#E30613' }}>{s.value}</div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
        <div>
          <h4 className="text-gray-800 font-semibold mb-3">Jurnal Pradita di Sinta</h4>
          <div className="space-y-3">
            {[
              { name: "Jurnal Inovasi Informatika", sinta: "Sinta 4", url: "https://jurnal.pradita.ac.id/jii" },
              { name: "Jurnal Teknologi dan Desain", sinta: "Sinta 4", url: "https://jurnal.pradita.ac.id/jtd" },
              { name: "Jurnal Riset Manajemen, Akuntansi, dan Bisnis", sinta: "Sinta 5", url: "https://jurnal.pradita.ac.id/jrmab" },
              { name: "Jurnal Ilmiah Mahasiswa Teknik dan Desain", sinta: "Sinta 5", url: "https://jurnal.pradita.ac.id/jimtd" },
              { name: "Jurnal Tinjauan Manajemen dan Akuntansi Mahasiswa", sinta: "Sinta 5", url: "https://jurnal.pradita.ac.id/jtmam" },
            ].map((j) => (
              <a key={j.name} href={j.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl hover:shadow-sm transition-all group"
                style={{ border: '1px solid #dee2e6', background: '#fff' }}
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="w-4 h-4 shrink-0" style={{ color: '#E30613' }} />
                  <span className="text-gray-700 group-hover:text-[#E30613] transition-colors text-sm">{j.name}</span>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full ml-2 shrink-0" style={{ background: 'rgba(227,6,19,0.08)', color: '#E30613' }}>{j.sinta}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  hki: {
    title: "HKI (Hak Kekayaan Intelektual)",
    content: (
      <div className="space-y-6 text-sm text-gray-600">
        <p>Pencatatan dan perlindungan hak kekayaan intelektual dari hasil penelitian dan inovasi civitas akademika.</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { number: "15", label: "Hak Cipta" },
            { number: "5", label: "Paten" },
            { number: "3", label: "Desain Industri" },
            { number: "8", label: "Merek" },
          ].map((item) => (
            <div key={item.label} className="bg-[#E30613]/5 rounded-xl p-4 text-center">
              <div className="text-xl text-[#E30613]" style={{ fontWeight: 700 }}>{item.number}</div>
              <div className="text-xs text-gray-600 mt-1">{item.label}</div>
            </div>
          ))}
        </div>
        <h4 className="text-gray-800">HKI Terdaftar Terbaru</h4>
        <div className="space-y-3 mt-3">
          {[
            { title: "Sistem Monitoring IoT untuk Smart Building", type: "Paten", status: "Granted", year: "2024" },
            { title: "Aplikasi Mobile Deteksi Penyakit Tanaman", type: "Hak Cipta", status: "Terdaftar", year: "2024" },
            { title: "Alat Penyaring Air Portable Tenaga Surya", type: "Paten Sederhana", status: "Dalam Proses", year: "2024" },
            { title: "Modul Pembelajaran Interaktif AR/VR", type: "Hak Cipta", status: "Terdaftar", year: "2023" },
          ].map((item) => (
            <div key={item.title} className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow">
              <Award className="w-5 h-5 text-[#E30613] shrink-0" />
              <div className="flex-1">
                <div className="text-gray-800" style={{ fontWeight: 500 }}>{item.title}</div>
                <div className="flex gap-2 mt-1">
                  <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{item.type}</span>
                  <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">{item.status}</span>
                  <span className="text-xs text-gray-400">{item.year}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
};

const sidebarItems = [
  { label: "Buku", path: "/publikasi/buku", icon: BookOpen },
  { label: "Jurnal", path: "/publikasi/jurnal", icon: FileText },
  { label: "Sinta", path: "/publikasi/sinta", icon: GraduationCap },
];

export function PublikasiPage() {
  const { section = "buku" } = useParams();
  
  const [publikasiList, setPublikasiList] = useState<Publikasi[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (["buku", "jurnal", "prosiding"].includes(section)) {
      setIsLoading(true);
      setTimeout(() => {
        const mockData: Publikasi[] = [
          {
            id: "pub-1",
            judul: "Implementasi AI pada Sektor Pertanian Modern",
            jenis_publikasi: section === "jurnal" ? "Jurnal Nasional Terakreditasi" : "Buku Referensi",
            kategori_kegiatan: "Penelitian Terapan",
            quartile: section === "jurnal" ? 2 : null,
            tanggal: "2024-05-12",
            asal_data: "SISTER",
            id_user: "dosen-123",
          },
          {
            id: "pub-2",
            judul: "Analisis Sentimen Pengguna Menggunakan NLP",
            jenis_publikasi: section === "jurnal" ? "Jurnal Internasional" : "Prosiding Konferensi",
            kategori_kegiatan: "Penelitian Dasar",
            quartile: section === "jurnal" ? 1 : null,
            tanggal: "2025-01-20",
            asal_data: "Manual",
            id_user: "dosen-456",
          }
        ];
        setPublikasiList(mockData);
        setIsLoading(false);
      }, 800);
    }
  }, [section]);

  const renderDynamicPublikasi = () => {
    if (isLoading) return <div className="animate-pulse p-4 text-gray-500">Memuat data publikasi...</div>;

    return (
      <div className="space-y-6 text-sm text-gray-600">
        <p className="leading-relaxed">
          Berikut adalah daftar {section} karya sivitas akademika Universitas Pradita (Data ditarik dari sistem terpadu).
        </p>
        <div className="space-y-4">
          {publikasiList.map((item) => (
            <div key={item.id} className="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-[#E30613] shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-gray-800 font-semibold">{item.judul}</h4>
                  <p className="text-xs text-gray-500 mt-1">{item.kategori_kegiatan}</p>
                  <div className="flex gap-2 mt-3 flex-wrap">
                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-100">
                      {item.jenis_publikasi}
                    </span>
                    {item.quartile && (
                      <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full border border-purple-100">
                        Q{item.quartile}
                      </span>
                    )}
                    <span className="text-xs bg-gray-50 text-gray-600 px-2 py-0.5 rounded-full border border-gray-200">
                      📅 {item.tanggal}
                    </span>
                    <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-100">
                      Sumber: {item.asal_data}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {publikasiList.length === 0 && <p className="text-gray-500">Belum ada data publikasi untuk kategori ini.</p>}
        </div>
      </div>
    );
  };

  const isDynamic = ["buku", "jurnal", "prosiding"].includes(section);
  
  const displayContent = isDynamic 
    ? { title: section.charAt(0).toUpperCase() + section.slice(1), content: renderDynamicPublikasi() }
    : publikasiContent[section] || { title: "Publikasi", content: null };

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <section style={{ background: '#f8f9fa', padding: '48px 0 40px', borderBottom: '1px solid #dee2e6' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link to="/" className="hover:text-[#E30613] transition-colors">Beranda</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-700">Publikasi</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span style={{ color: '#E30613' }}>{displayContent.title}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{displayContent.title}</h1>
        </div>
      </section>

      <section style={{ padding: '48px 0 64px' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-60 shrink-0">
              <nav className="sticky top-20 rounded-xl overflow-hidden" style={{ border: '1px solid #dee2e6' }}>
                <div className="px-4 py-3 text-xs font-bold uppercase tracking-widest" style={{ background: '#E30613', color: '#fff' }}>
                  Publikasi
                </div>
                {sidebarItems.map(({ label, path, icon: Icon }) => {
                  const active = `/publikasi/${section}` === path;
                  return (
                    <Link
                      key={path}
                      to={path}
                      className="flex items-center gap-3 px-4 py-3 text-sm transition-colors"
                      style={{
                        background: active ? 'rgba(227,6,19,0.05)' : '#fff',
                        color: active ? '#E30613' : '#495057',
                        borderLeft: active ? '3px solid #E30613' : '3px solid transparent',
                        fontWeight: active ? 600 : 400,
                        borderBottom: '1px solid #f1f3f5',
                      }}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {label}
                    </Link>
                  );
                })}
              </nav>
            </aside>
            <div className="flex-1 min-w-0 bg-white rounded-xl p-6 md:p-8" style={{ border: '1px solid #dee2e6' }}>
              {displayContent.content}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
