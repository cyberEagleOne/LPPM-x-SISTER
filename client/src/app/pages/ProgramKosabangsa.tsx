import { useState } from "react";
import { Link } from "react-router";
import { ChevronRight, Calendar, CheckCircle, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "../components/ImageWithFallback";

const timeline = [
  { date: "Februari 2025", event: "Pengumuman dan Sosialisasi Program", status: "completed" },
  { date: "Maret 2025", event: "Pembukaan Pendaftaran Proposal", status: "completed" },
  { date: "April 2025", event: "Batas Akhir Pengajuan Proposal", status: "active" },
  { date: "Mei 2025", event: "Review dan Seleksi Proposal", status: "upcoming" },
  { date: "Juni 2025", event: "Pengumuman Penerima Hibah", status: "upcoming" },
  { date: "Juli 2025", event: "Penandatanganan Kontrak", status: "upcoming" },
  { date: "Agustus - Desember 2025", event: "Pelaksanaan Program", status: "upcoming" },
  { date: "Januari 2026", event: "Laporan Akhir dan Evaluasi", status: "upcoming" },
];

const requirements = [
  "Dosen tetap di perguruan tinggi yang memiliki NIDN/NIDK",
  "Proposal melibatkan kolaborasi minimal 2 institusi (perguruan tinggi, industri, atau pemerintah)",
  "Fokus pada pengembangan dan penerapan IPTEKS yang berdampak pada masyarakat",
  "Memiliki track record penelitian minimal 2 tahun terakhir",
  "Proposal disertai surat dukungan dari mitra kolaborasi",
  "Anggaran sesuai dengan ketentuan yang berlaku (maks. Rp 300 juta)",
  "Bersedia mengikuti monitoring dan evaluasi selama program berlangsung",
  "Menyertakan rencana keberlanjutan program pasca pendanaan",
];

export function ProgramKosabangsa() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Hero */}
      <div className="relative h-64 md:h-80 bg-gray-100">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1760992004210-44a502a2872d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBzZXJ2aWNlJTIwdm9sdW50ZWVyaW5nJTIwcHJvZ3JhbXxlbnwxfHx8fDE3NzE1NTI3NDB8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Program Kosabangsa"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 text-sm text-white/70 mb-3">
              <Link to="/" className="hover:text-white">Beranda</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-white">Program Kosabangsa</span>
            </div>
            <h1 className="text-2xl md:text-4xl text-white" style={{ fontWeight: 600 }}>Program Kosabangsa</h1>
            <p className="text-sm text-white/80 mt-2 max-w-2xl">
              Program pendanaan kolaborasi untuk pengembangan dan penerapan IPTEKS yang dihasilkan oleh perguruan tinggi untuk dimanfaatkan oleh masyarakat dan industri.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* About */}
        <section className="mb-14">
          <h2 className="text-xl text-gray-800 mb-4">Tentang Program</h2>
          <div className="text-sm text-gray-600 space-y-3">
            <p>Program Kosabangsa (Kolaborasi Sains untuk Bangsa) merupakan program pendanaan yang dirancang untuk menjembatani kolaborasi antara perguruan tinggi, industri, dan pemerintah dalam pengembangan dan penerapan ilmu pengetahuan, teknologi, dan seni (IPTEKS).</p>
            <p>Program ini bertujuan untuk mendorong hilirisasi hasil penelitian agar dapat memberikan dampak nyata bagi masyarakat dan pembangunan nasional. Melalui skema pendanaan kolaboratif, diharapkan sinergi antara berbagai pemangku kepentingan dapat menghasilkan solusi inovatif untuk permasalahan yang dihadapi bangsa.</p>
          </div>
        </section>

        {/* Timeline */}
        <section className="mb-14">
          <h2 className="text-xl text-gray-800 mb-6">Timeline Program</h2>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
            <div className="space-y-6">
              {timeline.map((item, index) => (
                <div key={index} className="relative flex items-start gap-4 pl-10">
                  <div className={`absolute left-2.5 w-3 h-3 rounded-full border-2 ${
                    item.status === "completed" ? "bg-green-500 border-green-500" :
                    item.status === "active" ? "bg-[#E30613] border-[#E30613] ring-4 ring-[#E30613]/20" :
                    "bg-white border-gray-300"
                  }`} />
                  <div className={`flex-1 bg-white border rounded-xl p-4 transition-shadow hover:shadow-md ${
                    item.status === "active" ? "border-[#E30613]/30 shadow-sm" : "border-gray-100"
                  }`}>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-500">{item.date}</span>
                      {item.status === "completed" && (
                        <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Selesai
                        </span>
                      )}
                      {item.status === "active" && (
                        <span className="text-xs bg-red-50 text-[#E30613] px-2 py-0.5 rounded-full">Berlangsung</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 mt-1">{item.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Requirements */}
        <section className="mb-14">
          <h2 className="text-xl text-gray-800 mb-6">Syarat Pengajuan</h2>
          <div className="bg-gray-50 rounded-xl p-6">
            <ul className="space-y-3">
              {requirements.map((req, index) => (
                <li key={index} className="flex items-start gap-3 text-sm text-gray-600">
                  <div className="w-6 h-6 rounded-full bg-[#E30613] text-white flex items-center justify-center text-xs shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  {req}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center bg-gradient-to-br from-[#E30613] to-[#a0040d] rounded-2xl p-8 md:p-12 text-white">
          <h2 className="text-2xl mb-3" style={{ fontWeight: 600 }}>Tertarik Mengajukan Proposal?</h2>
          <p className="text-sm text-white/80 max-w-lg mx-auto mb-6">
            Daftarkan diri Anda dan mulai ajukan proposal penelitian kolaboratif untuk Program Kosabangsa 2025.
          </p>
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#E30613] rounded-xl hover:bg-gray-100 transition-all hover:shadow-lg active:scale-95"
            >
              Daftar Sekarang
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="max-w-md mx-auto bg-white rounded-xl p-6 text-left">
              <h3 className="text-gray-800 mb-4">Formulir Pendaftaran</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Nama Lengkap"
                  className="w-full px-4 py-2.5 text-sm text-gray-800 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613]"
                />
                <input
                  type="email"
                  placeholder="Email Institusi"
                  className="w-full px-4 py-2.5 text-sm text-gray-800 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613]"
                />
                <input
                  type="text"
                  placeholder="Institusi"
                  className="w-full px-4 py-2.5 text-sm text-gray-800 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613]"
                />
                <input
                  type="text"
                  placeholder="Judul Proposal"
                  className="w-full px-4 py-2.5 text-sm text-gray-800 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613]"
                />
                <button
                  onClick={() => {
                    alert("Pendaftaran berhasil dikirim! (Demo mode)");
                    setShowForm(false);
                  }}
                  className="w-full px-4 py-2.5 bg-[#E30613] text-white text-sm rounded-lg hover:bg-[#c00510] transition-all"
                >
                  Kirim Pendaftaran
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
