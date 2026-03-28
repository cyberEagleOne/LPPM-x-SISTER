import { Target, Eye, Users, Award, BookOpen, Globe } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

const orgStructure = [
  { title: "Ketua LPPM", name: "Prof. Dr. Hendra Gunawan, M.Eng.", level: 1 },
  { title: "Wakil Ketua Bidang Penelitian", name: "Dr. Suwandi, M.Si.", level: 2 },
  { title: "Wakil Ketua Bidang PKM", name: "Dr. Retno Palupi, M.Pd.", level: 2 },
  { title: "Kepala Divisi Data & Publikasi", name: "M. Iqbal Fauzan, S.T., M.Kom.", level: 3 },
  { title: "Kepala Divisi Reviewer", name: "Dr. Agus Prasetyo, M.Si.", level: 3 },
  { title: "Staf Administrasi", name: "Rina Marlina, S.E.", level: 3 },
];

const values = [
  { icon: Target, label: "Inovatif", desc: "Mendorong riset berbasis inovasi yang relevan dengan kebutuhan zaman." },
  { icon: Globe, label: "Kolaboratif", desc: "Membangun kemitraan lintas disiplin, institusi, dan negara." },
  { icon: Award, label: "Bereputasi", desc: "Menghasilkan publikasi bermutu di jurnal nasional dan internasional." },
  { icon: BookOpen, label: "Edukatif", desc: "Menjadikan penelitian sebagai sarana pembelajaran bagi seluruh sivitas." },
];

export function AboutPage() {
  return (
    <div className="bg-[#f8fafc]">
      {/* Page Header */}
      <div className="bg-[#1e3a8a] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-blue-300 mb-2" style={{ fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Profil Lembaga
          </p>
          <h1 className="text-white" style={{ fontSize: "clamp(24px, 4vw, 38px)", fontWeight: 800 }}>
            Tentang LPPM
          </h1>
          <p className="text-blue-200 mt-3" style={{ fontSize: 15, maxWidth: 550, lineHeight: 1.7 }}>
            Lembaga Penelitian dan Pengabdian kepada Masyarakat Universitas Pradita
          </p>
        </div>
      </div>

      {/* Description */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-gray-900 mb-5">Deskripsi Lembaga</h2>
            <div className="space-y-4 text-gray-600" style={{ fontSize: 15, lineHeight: 1.8 }}>
              <p>
                LPPM (Lembaga Penelitian dan Pengabdian kepada Masyarakat) Universitas Pradita adalah unit pelaksana
                teknis yang bertugas mengelola, mengkoordinasikan, dan memfasilitasi kegiatan penelitian serta pengabdian
                kepada masyarakat di lingkungan universitas.
              </p>
              <p>
                Didirikan pada tahun 1985, LPPM telah berkontribusi dalam menghasilkan lebih dari 10.000 karya ilmiah
                dan memfasilitasi ratusan kegiatan pengabdian masyarakat di seluruh Indonesia. Sistem SISTER hadir
                sebagai platform digital untuk mengintegrasikan seluruh proses administrasi riset.
              </p>
              <p>
                Kami berkomitmen menjadi pusat keunggulan riset yang berorientasi pada dampak nyata bagi masyarakat
                dan kemajuan ilmu pengetahuan nasional maupun internasional.
              </p>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-lg h-72 lg:h-80">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1605781645799-c9c7d820b4ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY2FkZW1pYyUyMHJlc2VhcmNoJTIwbGFib3JhdG9yeSUyMHNjaWVuY2V8ZW58MXx8fHwxNzczMTU2MTkyfDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Research laboratory"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Visi */}
            <div className="bg-[#eff6ff] rounded-2xl p-8 border border-blue-100">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-xl bg-[#1e3a8a] flex items-center justify-center">
                  <Eye size={22} className="text-white" />
                </div>
                <h2 className="text-[#1e3a8a]">Visi</h2>
              </div>
              <p className="text-gray-700" style={{ fontSize: 15, lineHeight: 1.8 }}>
                Menjadi lembaga penelitian dan pengabdian masyarakat yang unggul, inovatif, dan berdampak di tingkat
                nasional dan internasional pada tahun 2035.
              </p>
            </div>

            {/* Misi */}
            <div className="bg-[#f0fdf4] rounded-2xl p-8 border border-green-100">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-xl bg-[#065f46] flex items-center justify-center">
                  <Target size={22} className="text-white" />
                </div>
                <h2 className="text-[#065f46]">Misi</h2>
              </div>
              <ol className="space-y-2" style={{ fontSize: 15, lineHeight: 1.7 }}>
                {[
                  "Meningkatkan kualitas dan kuantitas penelitian yang relevan dan berdampak",
                  "Memfasilitasi publikasi ilmiah di jurnal bereputasi internasional",
                  "Membangun kemitraan strategis dengan industri dan pemerintah",
                  "Mengembangkan kapasitas peneliti melalui pelatihan dan pendampingan",
                ].map((m, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-700">
                    <span className="mt-1 w-5 h-5 rounded-full bg-[#065f46]/10 text-[#065f46] flex items-center justify-center flex-shrink-0" style={{ fontSize: 11, fontWeight: 700 }}>{i + 1}</span>
                    {m}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h2 className="text-gray-900 mb-2 text-center">Nilai-Nilai Kami</h2>
        <p className="text-gray-500 text-center mb-10" style={{ fontSize: 14 }}>Prinsip yang mendasari setiap kegiatan LPPM</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {values.map((v) => (
            <div key={v.label} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm text-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-[#eff6ff] flex items-center justify-center mx-auto mb-4">
                <v.icon size={22} className="text-[#1e3a8a]" />
              </div>
              <h3 className="text-gray-900 mb-2">{v.label}</h3>
              <p className="text-gray-500" style={{ fontSize: 13, lineHeight: 1.65 }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Org Structure */}
      <section className="bg-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-10">
            <Users size={22} className="text-[#1e3a8a]" />
            <h2 className="text-gray-900">Struktur Organisasi</h2>
          </div>

          <div className="space-y-4">
            {/* Level 1 */}
            <div className="flex justify-center">
              <div className="bg-[#1e3a8a] text-white rounded-xl p-5 w-full max-w-sm text-center shadow-lg">
                <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }} className="text-blue-300 mb-1">
                  {orgStructure[0].title}
                </p>
                <p style={{ fontSize: 15, fontWeight: 700 }}>{orgStructure[0].name}</p>
              </div>
            </div>

            {/* Level 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {orgStructure.filter((o) => o.level === 2).map((o) => (
                <div key={o.title} className="bg-[#1d4ed8] text-white rounded-xl p-4 text-center shadow">
                  <p style={{ fontSize: 11, fontWeight: 600 }} className="text-blue-200 mb-1">{o.title}</p>
                  <p style={{ fontSize: 14, fontWeight: 600 }}>{o.name}</p>
                </div>
              ))}
            </div>

            {/* Level 3 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {orgStructure.filter((o) => o.level === 3).map((o) => (
                <div key={o.title} className="bg-[#eff6ff] border border-blue-100 rounded-xl p-4 text-center">
                  <p style={{ fontSize: 11, fontWeight: 600 }} className="text-[#1e3a8a] mb-1">{o.title}</p>
                  <p style={{ fontSize: 13, fontWeight: 600 }} className="text-gray-800">{o.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
