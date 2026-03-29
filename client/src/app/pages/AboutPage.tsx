import { useParams, Link } from "react-router";
import { ChevronRight, Building2, Target, BookOpen, Users, FileText, Phone, MapPin, Mail, Clock } from "lucide-react";

const aboutContent: Record<string, { title: string; content: React.ReactNode }> = {
  profil: {
    title: "Profil LPPM",
    content: (
      <div className="space-y-5 text-sm text-gray-600">
        <p className="leading-relaxed">
          Lembaga Penelitian dan Pengabdian kepada Masyarakat (LPPM) Universitas Pradita didirikan bersamaan dengan berdirinya Universitas Pradita pada tahun 2019 sebagai bagian integral dari struktur organisasi universitas.
        </p>
        <p className="leading-relaxed">
          LPPM hadir sebagai wadah untuk mendukung tri dharma perguruan tinggi, khususnya dalam bidang penelitian dan pengabdian kepada masyarakat. Sejak awal berdiri, LPPM telah berkomitmen untuk mendorong budaya riset dan inovasi di lingkungan kampus.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {[
            { icon: Building2, title: "Berdiri", value: "2019" },
            { icon: Users, title: "Dosen Aktif", value: "200+" },
            { icon: BookOpen, title: "Program Studi", value: "12" },
            { icon: Target, title: "Kluster Riset", value: "5" },
          ].map(({ icon: Icon, title, value }) => (
            <div key={title} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(227,6,19,0.08)' }}>
                <Icon className="w-5 h-5" style={{ color: '#E30613' }} />
              </div>
              <div>
                <div className="text-xs text-gray-400">{title}</div>
                <div className="text-gray-800 font-semibold text-lg">{value}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <h3 className="text-gray-800 font-semibold mb-3">Tonggak Penting</h3>
          <div className="space-y-3">
            {[
              { year: "2019", event: "Pendirian LPPM Universitas Pradita bersamaan dengan berdirinya universitas" },
              { year: "2020", event: "Peluncuran program hibah penelitian internal pertama" },
              { year: "2021", event: "Pertama kali meloloskan hibah DRTPM Kemendikbudristek" },
              { year: "2022", event: "Penyelenggaraan Seminar Nasional Riset dan Inovasi pertama" },
              { year: "2023", event: "Pencapaian 50+ publikasi internasional terindeks Scopus" },
              { year: "2024", event: "Meloloskan 8 proposal hibah DRTPM terbanyak sepanjang sejarah" },
            ].map((item) => (
              <div key={item.year} className="flex gap-4 items-start">
                <span className="shrink-0 text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: 'rgba(227,6,19,0.08)', color: '#E30613' }}>{item.year}</span>
                <span className="mt-0.5">{item.event}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  "visi-misi": {
    title: "Visi & Misi",
    content: (
      <div className="space-y-6 text-sm text-gray-600">
        <div className="rounded-xl p-6" style={{ background: 'rgba(227,6,19,0.04)', border: '1px solid rgba(227,6,19,0.12)' }}>
          <h3 className="font-semibold mb-3" style={{ color: '#E30613' }}>Visi</h3>
          <p className="text-gray-700 leading-relaxed italic">
            "Menjadi lembaga penelitian dan pengabdian kepada masyarakat yang unggul, inovatif, dan berdaya saing global dalam pengembangan ilmu pengetahuan, teknologi, dan seni untuk kesejahteraan masyarakat."
          </p>
        </div>
        <div>
          <h3 className="text-gray-800 font-semibold mb-3">Misi</h3>
          <ol className="space-y-3 list-none">
            {[
              "Menyelenggarakan penelitian yang berkualitas tinggi dan berdampak pada pengembangan ilmu pengetahuan dan teknologi.",
              "Mendorong kolaborasi penelitian interdisipliner dan lintas institusi baik nasional maupun internasional.",
              "Melaksanakan pengabdian kepada masyarakat yang berbasis hasil penelitian untuk pemberdayaan masyarakat.",
              "Mengembangkan ekosistem inovasi yang mendukung hilirisasi hasil penelitian.",
              "Meningkatkan kapasitas dan kompetensi peneliti melalui pelatihan dan pendampingan berkelanjutan.",
              "Membangun kemitraan strategis dengan industri, pemerintah, dan lembaga penelitian.",
            ].map((m, i) => (
              <li key={i} className="flex gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center mt-0.5" style={{ background: '#E30613', color: '#fff' }}>{i + 1}</span>
                <span>{m}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    ),
  },
  tujuan: {
    title: "Tujuan",
    content: (
      <div className="space-y-5 text-sm text-gray-600">
        <p className="leading-relaxed">LPPM Universitas Pradita memiliki tujuan strategis yang mendukung tercapainya visi dan misi lembaga serta universitas secara keseluruhan.</p>
        <div className="space-y-4">
          {[
            { title: "Peningkatan Kualitas Riset", desc: "Meningkatkan kualitas dan kuantitas penelitian yang dilakukan oleh sivitas akademika Universitas Pradita." },
            { title: "Hilirisasi Inovasi", desc: "Mendorong penerapan hasil penelitian untuk kepentingan masyarakat, industri, dan pemerintahan." },
            { title: "Pengembangan SDM", desc: "Meningkatkan kompetensi dosen dan mahasiswa dalam bidang penelitian dan pengabdian masyarakat." },
            { title: "Kolaborasi Strategis", desc: "Membangun jejaring kerja sama dengan industri, pemerintah, dan institusi pendidikan lainnya." },
            { title: "Akreditasi & Pengakuan", desc: "Meningkatkan pengakuan lembaga melalui akreditasi institusi penelitian dan penghargaan nasional/internasional." },
          ].map((item) => (
            <div key={item.title} className="flex gap-4 p-4 bg-white rounded-xl hover:shadow-md transition-shadow" style={{ border: '1px solid #dee2e6' }}>
              <div className="w-2 rounded-full shrink-0 mt-1" style={{ background: '#E30613', minHeight: 40 }} />
              <div>
                <h4 className="text-gray-800 font-semibold">{item.title}</h4>
                <p className="text-gray-500 mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  "dokumen-sk": {
    title: "Dokumen & SK",
    content: (
      <div className="space-y-5 text-sm text-gray-600">
        <p>Dokumen resmi dan Surat Keputusan yang berkaitan dengan LPPM Universitas Pradita dapat diakses melalui tautan berikut.</p>
        <div className="space-y-3">
          {[
            { name: "SK Pendirian LPPM Universitas Pradita", year: "2019" },
            { name: "SK Pengangkatan Ketua LPPM 2024", year: "2024" },
            { name: "Pedoman Penelitian & PKM Universitas Pradita", year: "2024" },
            { name: "Panduan Etika Penelitian", year: "2023" },
            { name: "SOP Pengajuan Hibah Internal", year: "2024" },
          ].map((doc) => (
            <a
              key={doc.name}
              href="https://drive.google.com/file/d/18RHLEay3fLxkHX7ssiN1UKA1X1BZg6Ys/view"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 bg-white rounded-xl hover:shadow-md transition-all group"
              style={{ border: '1px solid #dee2e6' }}
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(227,6,19,0.08)' }}>
                <FileText className="w-5 h-5" style={{ color: '#E30613' }} />
              </div>
              <div className="flex-1">
                <div className="text-gray-800 font-medium group-hover:text-[#E30613] transition-colors">{doc.name}</div>
                <div className="text-xs text-gray-400">Tahun {doc.year}</div>
              </div>
              <span className="text-xs px-2 py-1 rounded-full" style={{ background: '#f1f3f5', color: '#6c757d' }}>PDF</span>
            </a>
          ))}
        </div>
      </div>
    ),
  },
  struktur: {
    title: "Struktur Organisasi",
    content: (
      <div className="space-y-5 text-sm text-gray-600">
        <p>Struktur organisasi LPPM Universitas Pradita dirancang untuk mendukung pelaksanaan fungsi penelitian dan pengabdian masyarakat secara efektif dan efisien.</p>
        <div className="space-y-4">
          {[
            { role: "Ketua LPPM", name: "Prof. Dr. Ahmad Surya, M.T.", desc: "Bertanggung jawab atas keseluruhan operasional dan strategi LPPM" },
            { role: "Sekretaris LPPM", name: "Dr. Siti Nurhaliza, M.Si.", desc: "Mengelola administrasi dan koordinasi kegiatan" },
            { role: "Kepala Pusat Penelitian", name: "Dr. Arif Ramadhan, M.Eng.", desc: "Mengelola program dan kebijakan penelitian" },
            { role: "Kepala Pusat Pengabdian Masyarakat", name: "Dr. Dewi Kartika, M.Pd.", desc: "Mengelola program pengabdian kepada masyarakat" },
            { role: "Kepala Pusat Publikasi & HKI", name: "Dr. Rendra Wijaya, M.Kom.", desc: "Mengelola publikasi ilmiah dan hak kekayaan intelektual" },
          ].map((item) => (
            <div key={item.role} className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow flex items-start gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white text-sm font-bold" style={{ background: '#E30613' }}>
                {item.name.charAt(0)}
              </div>
              <div>
                <div className="text-xs font-semibold" style={{ color: '#E30613' }}>{item.role}</div>
                <div className="text-gray-800 font-medium mt-0.5">{item.name}</div>
                <div className="text-xs text-gray-500 mt-1">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  kontak: {
    title: "Kontak",
    content: (
      <div className="space-y-5 text-sm text-gray-600">
        <p>Hubungi kami untuk informasi lebih lanjut mengenai kegiatan penelitian dan pengabdian masyarakat Universitas Pradita.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { icon: MapPin, title: "Alamat Tangerang", value: "Scientia Business Park Tower I, Jl. Boulevard Gading Serpong Blok O/1, Summarecon Serpong, Gedung Menara Satu Lt. 11" },
            { icon: MapPin, title: "Alamat Jakarta", value: "Jl. Boulevard Raya LA 3 No. 1, RT.11/RW.18, Jakarta Utara, DKI Jakarta" },
            { icon: Phone, title: "Telepon", value: "021 5568 9999\n0815 8510 9999" },
            { icon: Mail, title: "Email", value: "lppm@pradita.ac.id" },
            { icon: Clock, title: "Jam Operasional", value: "Senin – Jumat: 08.00 – 17.00\nSabtu & Minggu: Tutup" },
          ].map(({ icon: Icon, title, value }) => (
            <div key={title} className="flex gap-4 p-4 bg-white rounded-xl" style={{ border: '1px solid #dee2e6' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(227,6,19,0.08)' }}>
                <Icon className="w-5 h-5" style={{ color: '#E30613' }} />
              </div>
              <div>
                <div className="font-semibold text-gray-700 mb-1">{title}</div>
                {value.split('\n').map((v, i) => <div key={i} className="text-gray-500">{v}</div>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
};

const sidebarItems = [
  { label: "Profil", path: "/about/profil" },
  { label: "Visi & Misi", path: "/about/visi-misi" },
  { label: "Tujuan", path: "/about/tujuan" },
  { label: "Dokumen & SK", path: "/about/dokumen-sk" },
  { label: "Struktur Organisasi", path: "/about/struktur" },
  { label: "Kontak", path: "/about/kontak" },
];

export function AboutPage() {
  const { section = "profil" } = useParams();
  const content = aboutContent[section] || aboutContent.profil;

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Hero */}
      <section style={{ background: '#f8f9fa', padding: '48px 0 40px', borderBottom: '1px solid #dee2e6' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link to="/" className="hover:text-[#E30613] transition-colors">Beranda</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-700">About Us</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span style={{ color: '#E30613' }}>{content.title}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{content.title}</h1>
        </div>
      </section>

      {/* Content */}
      <section style={{ padding: '48px 0 64px' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="lg:w-60 shrink-0">
              <nav className="sticky top-20 rounded-xl overflow-hidden" style={{ border: '1px solid #dee2e6' }}>
                <div className="px-4 py-3 text-xs font-bold uppercase tracking-widest" style={{ background: '#E30613', color: '#fff' }}>
                  About Us
                </div>
                {sidebarItems.map((item) => {
                  const active = `/about/${section}` === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="block px-4 py-3 text-sm transition-colors"
                      style={{
                        background: active ? 'rgba(227,6,19,0.05)' : '#fff',
                        color: active ? '#E30613' : '#495057',
                        borderLeft: active ? '3px solid #E30613' : '3px solid transparent',
                        fontWeight: active ? 600 : 400,
                        borderBottom: '1px solid #f1f3f5',
                      }}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </aside>

            {/* Main content */}
            <div className="flex-1 min-w-0 bg-white rounded-xl p-6 md:p-8" style={{ border: '1px solid #dee2e6' }}>
              {content.content}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
