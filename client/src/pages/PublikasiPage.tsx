import { useParams, Link } from "react-router";
import { ChevronRight, BookOpen, FileText, Award, ExternalLink, GraduationCap } from "lucide-react";

const publikasiContent: Record<string, { title: string; content: React.ReactNode }> = {
  jurnal: {
    title: "Jurnal",
    content: (
      <div className="space-y-6 text-sm text-gray-600">
        <p>Universitas Pradita mendorong publikasi ilmiah di jurnal nasional terakreditasi dan jurnal internasional bereputasi.</p>
        <h4 className="text-gray-800">Jurnal Terkelola LPPM</h4>
        <div className="space-y-4 mt-3">
          {[
            { name: "Jurnal Pradita Teknika", issn: "ISSN: 2XXX-XXXX", scope: "Teknik & Informatika", status: "SINTA 4" },
            { name: "Jurnal Pradita Bisnis", issn: "ISSN: 2XXX-XXXX", scope: "Bisnis & Manajemen", status: "SINTA 5" },
            { name: "Jurnal Pradita Desain", issn: "ISSN: 2XXX-XXXX", scope: "Desain & Arsitektur", status: "Dalam Pengajuan" },
          ].map((item) => (
            <div key={item.name} className="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-gray-800 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#E30613]" />
                    {item.name}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">{item.issn} | {item.scope}</p>
                </div>
                <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">{item.status}</span>
              </div>
              <button className="mt-3 text-xs text-[#E30613] hover:underline flex items-center gap-1">
                Kunjungi Jurnal <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
        <h4 className="text-gray-800 mt-6">Target Publikasi Jurnal 2025</h4>
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <div className="text-2xl text-blue-700" style={{ fontWeight: 700 }}>25</div>
            <div className="text-xs text-blue-600 mt-1">Scopus Q1-Q2</div>
          </div>
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <div className="text-2xl text-green-700" style={{ fontWeight: 700 }}>50</div>
            <div className="text-xs text-green-600 mt-1">SINTA 1-4</div>
          </div>
        </div>
      </div>
    ),
  },
  prosiding: {
    title: "Prosiding",
    content: (
      <div className="space-y-6 text-sm text-gray-600">
        <p>Prosiding dari konferensi dan seminar yang diikuti atau diselenggarakan oleh civitas akademika Universitas Pradita.</p>
        <div className="space-y-4">
          {[
            { name: "Prosiding Seminar Nasional Riset dan Inovasi 2024", date: "Juni 2024", papers: 45 },
            { name: "Proceedings of International Conference on Smart Computing 2024", date: "Mei 2024", papers: 32 },
            { name: "Prosiding Workshop Pengabdian Masyarakat 2024", date: "April 2024", papers: 28 },
            { name: "Proceedings of IEEE Conference on Technology 2023", date: "November 2023", papers: 15 },
          ].map((item) => (
            <div key={item.name} className="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-[#E30613] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-gray-800">{item.name}</h4>
                  <div className="flex gap-3 mt-2">
                    <span className="text-xs text-gray-500">{item.date}</span>
                    <span className="text-xs text-gray-500">{item.papers} papers</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  buku: {
    title: "Buku",
    content: (
      <div className="space-y-6 text-sm text-gray-600">
        <p>Buku-buku yang ditulis oleh dosen Universitas Pradita sebagai bagian dari kontribusi ilmiah dan akademik.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { title: "Pengantar Kecerdasan Buatan", author: "Dr. Arif Ramadhan", year: "2024", isbn: "978-XXX-XXX" },
            { title: "Manajemen Proyek Konstruksi Modern", author: "Dr. Ahmad Surya", year: "2023", isbn: "978-XXX-XXX" },
            { title: "Desain Interaksi untuk Pengalaman Pengguna", author: "Dr. Dewi Kartika", year: "2023", isbn: "978-XXX-XXX" },
            { title: "Statistika Terapan untuk Penelitian", author: "Dr. Siti Nurhaliza", year: "2022", isbn: "978-XXX-XXX" },
          ].map((item) => (
            <div key={item.title} className="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-md transition-shadow">
              <BookOpen className="w-8 h-8 text-[#E30613] mb-3" />
              <h4 className="text-gray-800">{item.title}</h4>
              <p className="text-xs text-gray-500 mt-1">{item.author}</p>
              <div className="flex gap-3 mt-2">
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{item.year}</span>
                <span className="text-xs text-gray-400">{item.isbn}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
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
  const content = publikasiContent[section] || publikasiContent.buku;

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <section style={{ background: '#f8f9fa', padding: '48px 0 40px', borderBottom: '1px solid #dee2e6' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link to="/" className="hover:text-[#E30613] transition-colors">Beranda</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-700">Publikasi</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span style={{ color: '#E30613' }}>{content.title}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{content.title}</h1>
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
              {content.content}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
