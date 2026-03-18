import { User, BookOpen, FileText, Edit2, Mail, Phone, MapPin, Calendar, Award, GraduationCap } from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";

const researchHistory = [
  { id: 1, judul: "Pengembangan Model Pembelajaran Berbasis AI", tahun: 2025, status: "Disetujui" },
  { id: 2, judul: "Implementasi IoT dalam Monitoring Kualitas Udara", tahun: 2025, status: "Pending" },
  { id: 3, judul: "Analisis Keamanan Aplikasi Mobile Perbankan", tahun: 2024, status: "Disetujui" },
];

const statusCfg: Record<string, string> = {
  Disetujui: "bg-green-100 text-green-700",
  Pending: "bg-amber-100 text-amber-700",
  Ditolak: "bg-red-100 text-red-700",
};

export function DosenProfile() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-gray-900">Profil Saya</h1>
          <p className="text-gray-500 mt-0.5" style={{ fontSize: 14 }}>Informasi akun dan riwayat penelitian</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Profile card */}
        <div className="lg:col-span-1 space-y-5">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 text-center">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 rounded-full bg-[#1e3a8a] flex items-center justify-center mx-auto overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1736066330610-c102cab4e942?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzb3IlMjBsZWN0dXJlJTIwdW5pdmVyc2l0eSUyMGNsYXNzcm9vbXxlbnwxfHx8fDE3NzMxNTYxOTN8MA&ixlib=rb-4.1.0&q=80&w=200"
                  alt="Dosen profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center border-2 border-white">
                <Edit2 size={12} />
              </button>
            </div>
            <h2 className="text-gray-900">Dr. Siti Rahma, M.Si.</h2>
            <p className="text-gray-500 mt-1" style={{ fontSize: 13 }}>Dosen Tetap</p>
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700" style={{ fontSize: 12, fontWeight: 600 }}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Aktif
            </div>

            <div className="mt-5 pt-5 border-t border-gray-100 space-y-3 text-left">
              <div className="flex items-center gap-3 text-gray-600">
                <Mail size={15} className="text-gray-400 flex-shrink-0" />
                <span style={{ fontSize: 13 }}>siti.rahma@pradita.ac.id</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Phone size={15} className="text-gray-400 flex-shrink-0" />
                <span style={{ fontSize: 13 }}>+62 812-3456-7890</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <MapPin size={15} className="text-gray-400 flex-shrink-0" />
                <span style={{ fontSize: 13 }}>Gedung A, Lantai 3, Ruang 301</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Calendar size={15} className="text-gray-400 flex-shrink-0" />
                <span style={{ fontSize: 13 }}>Bergabung: Agustus 2015</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-gray-700 mb-4" style={{ fontWeight: 600 }}>Statistik Penelitian</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Total Penelitian", value: 8, icon: BookOpen, color: "#1e3a8a", bg: "#eff6ff" },
                { label: "Publikasi", value: 5, icon: FileText, color: "#059669", bg: "#ecfdf5" },
                { label: "Disetujui", value: 5, icon: Award, color: "#7c3aed", bg: "#f5f3ff" },
                { label: "Penghargaan", value: 2, icon: Award, color: "#d97706", bg: "#fffbeb" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl p-3 text-center" style={{ backgroundColor: s.bg }}>
                  <p style={{ fontSize: 22, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</p>
                  <p className="text-gray-500 mt-1" style={{ fontSize: 11 }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Details */}
        <div className="lg:col-span-2 space-y-5">
          {/* Academic Info */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5">
              <GraduationCap size={18} className="text-[#1e3a8a]" />
              <h2 className="text-gray-900">Informasi Akademik</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { label: "NIDN", value: "0012345678" },
                { label: "NIP", value: "198203152015041002" },
                { label: "Program Studi", value: "Teknik Informatika" },
                { label: "Fakultas", value: "Fakultas Teknik" },
                { label: "Jabatan Fungsional", value: "Lektor Kepala" },
                { label: "Golongan", value: "IVa" },
                { label: "Pendidikan Terakhir", value: "S3 – Ilmu Komputer" },
                { label: "Institusi S3", value: "Universitas Indonesia" },
              ].map((item) => (
                <div key={item.label} className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-400 mb-1" style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {item.label}
                  </p>
                  <p className="text-gray-900" style={{ fontSize: 14, fontWeight: 600 }}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Research History */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5">
              <BookOpen size={18} className="text-[#1e3a8a]" />
              <h2 className="text-gray-900">Riwayat Penelitian Terkini</h2>
            </div>

            <div className="space-y-3">
              {researchHistory.map((r) => (
                <div key={r.id} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="w-9 h-9 rounded-lg bg-[#eff6ff] flex items-center justify-center flex-shrink-0">
                    <BookOpen size={15} className="text-[#1e3a8a]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900" style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.4 }}>{r.judul}</p>
                    <p className="text-gray-400 mt-1" style={{ fontSize: 12 }}>Tahun {r.tahun}</p>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full flex-shrink-0 ${statusCfg[r.status]}`}
                    style={{ fontSize: 11, fontWeight: 600 }}
                  >
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bidang Keahlian */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-gray-900 mb-4">Bidang Keahlian</h2>
            <div className="flex flex-wrap gap-2">
              {[
                "Artificial Intelligence", "Machine Learning", "Natural Language Processing",
                "Computer Vision", "Data Science", "Internet of Things", "Cybersecurity",
              ].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 rounded-lg bg-[#eff6ff] text-[#1e3a8a] border border-blue-100"
                  style={{ fontSize: 13, fontWeight: 500 }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
