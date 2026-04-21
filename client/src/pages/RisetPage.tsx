import { useParams, Link } from "react-router";
import { ChevronRight, FlaskConical, Handshake, Award, BookOpenCheck } from "lucide-react";

const risetContent: Record<string, { title: string; content: React.ReactNode }> = {
  penelitian: {
    title: "Penelitian",
    content: (
      <div className="space-y-6 text-sm text-gray-600">
        <p className="leading-relaxed">
          LPPM Universitas Pradita mendukung kegiatan penelitian dosen melalui berbagai skema pendanaan dan fasilitas riset yang komprehensif.
        </p>
        <div className="space-y-4">
          {[
            { name: "Penelitian Dasar", desc: "Penelitian fundamental untuk pengembangan ilmu pengetahuan baru", funding: "Rp 30 – 100 Juta", duration: "1–2 Tahun" },
            { name: "Penelitian Terapan", desc: "Penelitian yang menghasilkan solusi praktis untuk permasalahan industri dan masyarakat", funding: "Rp 50 – 150 Juta", duration: "1–3 Tahun" },
            { name: "Penelitian Pengembangan", desc: "Pengembangan produk, prototype, atau teknologi baru", funding: "Rp 75 – 200 Juta", duration: "2–3 Tahun" },
            { name: "Penelitian Dosen Pemula", desc: "Skema khusus untuk dosen dengan jabatan fungsional asisten ahli", funding: "Rp 15 – 30 Juta", duration: "1 Tahun" },
            { name: "Penelitian Kolaborasi", desc: "Penelitian interdisipliner yang melibatkan lebih dari satu program studi", funding: "Rp 100 – 300 Juta", duration: "1–3 Tahun" },
          ].map((item) => (
            <div key={item.name} className="bg-white rounded-xl p-5 hover:shadow-md transition-shadow" style={{ border: '1px solid #dee2e6' }}>
              <h4 className="text-gray-800 font-semibold">{item.name}</h4>
              <p className="text-gray-500 mt-1">{item.desc}</p>
              <div className="flex flex-wrap gap-3 mt-3">
                <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: 'rgba(40,167,69,0.1)', color: '#28a745' }}>
                  💰 {item.funding}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: 'rgba(0,123,255,0.1)', color: '#007bff' }}>
                  ⏱ {item.duration}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  pengabdian: {
    title: "Pengabdian",
    content: (
      <div className="space-y-6 text-sm text-gray-600">
        <p className="leading-relaxed">
          Program Pengabdian kepada Masyarakat (PkM) LPPM Universitas Pradita bertujuan untuk menghubungkan hasil riset kampus dengan kebutuhan nyata masyarakat.
        </p>
        <div className="space-y-4">
          {[
            { name: "PkM Berbasis Riset", desc: "Pengabdian yang merupakan implementasi langsung dari hasil penelitian dosen", badge: "Unggulan" },
            { name: "PkM Mandiri", desc: "Kegiatan pengabdian yang dibiayai oleh dosen secara mandiri atau dari sumber lain", badge: "Reguler" },
            { name: "PkM Dana Internal", desc: "Pengabdian yang didanai oleh Universitas Pradita melalui hibah internal LPPM", badge: "Internal" },
            { name: "KKN Tematik", desc: "Kuliah Kerja Nyata yang dikombinasikan dengan tema penelitian dan pengabdian", badge: "Mahasiswa" },
          ].map((item) => (
            <div key={item.name} className="bg-white rounded-xl p-5 hover:shadow-md transition-shadow flex gap-4" style={{ border: '1px solid #dee2e6' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(227,6,19,0.08)' }}>
                <Handshake className="w-5 h-5" style={{ color: '#E30613' }} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-gray-800 font-semibold">{item.name}</h4>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(227,6,19,0.08)', color: '#E30613' }}>{item.badge}</span>
                </div>
                <p className="text-gray-500 mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-xl p-5" style={{ background: 'rgba(227,6,19,0.04)', border: '1px solid rgba(227,6,19,0.12)' }}>
          <h4 className="font-semibold mb-2" style={{ color: '#E30613' }}>Periode Pendaftaran 2025</h4>
          <p>Pendaftaran program pengabdian internal tahun 2025 akan dibuka pada Maret 2025. Informasi lebih lanjut akan diumumkan melalui email dosen.</p>
        </div>
      </div>
    ),
  },
  hki: {
    title: "HKI",
    content: (
      <div className="space-y-6 text-sm text-gray-600">
        <p className="leading-relaxed">
          Hak Kekayaan Intelektual (HKI) merupakan salah satu luaran penting dari kegiatan penelitian. LPPM memfasilitasi proses pendaftaran dan perlindungan HKI bagi sivitas akademika.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { type: "Paten", count: "12", desc: "Invensi teknologi baru yang memiliki nilai komersial" },
            { type: "Hak Cipta", count: "45", desc: "Karya tulis, perangkat lunak, dan karya seni" },
            { type: "Merek Dagang", count: "5", desc: "Identitas produk hasil riset" },
            { type: "Desain Industri", count: "8", desc: "Tampilan estetis produk inovatif" },
          ].map((item) => (
            <div key={item.type} className="bg-white rounded-xl p-5 text-center hover:shadow-md transition-shadow" style={{ border: '1px solid #dee2e6' }}>
              <Award className="w-8 h-8 mx-auto mb-2" style={{ color: '#E30613' }} />
              <div className="text-3xl font-bold" style={{ color: '#E30613' }}>{item.count}</div>
              <div className="font-semibold text-gray-800 mt-1">{item.type}</div>
              <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <h4 className="text-gray-800 font-semibold mb-3">Alur Pendaftaran HKI</h4>
          <div className="space-y-3">
            {["Konsultasi dengan tim HKI LPPM", "Pengisian formulir permohonan HKI", "Pemeriksaan kelengkapan dokumen", "Pengajuan ke DJKI Kemenkumham", "Monitoring status permohonan", "Penerbitan sertifikat HKI"].map((step, i) => (
              <div key={step} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: '#E30613' }}>{i + 1}</div>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  "karya-dosen": {
    title: "Karya Dosen",
    content: (
      <div className="space-y-6 text-sm text-gray-600">
        <p className="leading-relaxed">
          Karya-karya terbaik dosen Universitas Pradita yang telah dihasilkan melalui kegiatan penelitian, pengabdian masyarakat, dan kreativitas akademik.
        </p>
        <div className="space-y-4">
          {[
            { category: "Buku Referensi", count: 28, items: ["Pengantar Kecerdasan Buatan - Dr. Arif Ramadhan", "Manajemen Keuangan Digital - Dr. Rina Wulandari", "Desain Sistem Informasi Modern - Dr. Fajar Nugroho"] },
            { category: "Artikel Ilmiah Internasional", count: 87, items: ["Terindeks Scopus Q1: 12 artikel", "Terindeks Scopus Q2: 34 artikel", "Terindeks WoS: 8 artikel"] },
            { category: "Artikel Ilmiah Nasional", count: 124, items: ["Jurnal Sinta 1-2: 45 artikel", "Jurnal Sinta 3-4: 79 artikel"] },
            { category: "Prototipe & Inovasi", count: 15, items: ["Aplikasi mobile manajemen penelitian", "Sistem monitoring IoT smart campus", "Platform kolaborasi riset berbasis AI"] },
          ].map((item) => (
            <div key={item.category} className="bg-white p-5 rounded-xl hover:shadow-md transition-shadow" style={{ border: '1px solid #dee2e6' }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <BookOpenCheck className="w-5 h-5 shrink-0" style={{ color: '#E30613' }} />
                  <h4 className="text-gray-800 font-semibold">{item.category}</h4>
                </div>
                <span className="text-lg font-bold" style={{ color: '#E30613' }}>{item.count}</span>
              </div>
              <ul className="space-y-1.5">
                {item.items.map((i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-500">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#E30613' }} />
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    ),
  },
};

const sidebarItems = [
  { label: "Penelitian", path: "/riset/penelitian", icon: FlaskConical },
  { label: "Pengabdian", path: "/riset/pengabdian", icon: Handshake },
  { label: "HKI", path: "/riset/hki", icon: Award },
  { label: "Karya Dosen", path: "/riset/karya-dosen", icon: BookOpenCheck },
];

export function RisetPage() {
  const { section = "penelitian" } = useParams();
  const content = risetContent[section] || risetContent.penelitian;

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <section style={{ background: '#f8f9fa', padding: '48px 0 40px', borderBottom: '1px solid #dee2e6' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link to="/" className="hover:text-[#E30613] transition-colors">Beranda</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-700">Riset</span>
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
                  Riset
                </div>
                {sidebarItems.map(({ label, path, icon: Icon }) => {
                  const active = `/riset/${section}` === path;
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
