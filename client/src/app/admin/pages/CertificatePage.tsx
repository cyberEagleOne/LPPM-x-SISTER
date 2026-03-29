import { useState, useEffect } from "react";
import { Download, Eye, Search, FileText, QrCode, Award, CheckCircle, Stamp } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { PageWrapper } from "../components/PageWrapper";
import { SkeletonTable } from "../components/SkeletonLoader";

interface Certificate {
  id: string;
  type: "publication" | "grant" | "conference";
  title: string;
  recipient: string;
  verifiedDate: string;
  verifiedBy: string;
  qrCode: string;
  status: "ready" | "processing";
}

const MOCK_CERTIFICATES: Certificate[] = [
  { id: "CERT-PUB-001", type: "publication", title: "Jurnal AI & Education: Impact of ML on Student Performance", recipient: "Dr. Arif Ramadhan, M.Sc.", verifiedDate: "2026-02-20", verifiedBy: "Koordinator Publikasi", qrCode: "QR-8A3F2B", status: "ready" },
  { id: "CERT-PUB-002", type: "publication", title: "Smart Campus IoT Framework (ICALT 2026)", recipient: "Dr. Rina Wulandari", verifiedDate: "2026-02-18", verifiedBy: "Ketua LPPM", qrCode: "QR-5C1D9E", status: "ready" },
  { id: "CERT-HIB-001", type: "grant", title: "Penelitian IoT untuk Smart Campus Pradita", recipient: "Dr. Arif Ramadhan, M.Sc.", verifiedDate: "2026-02-22", verifiedBy: "Ketua LPPM", qrCode: "QR-7F4A2C", status: "ready" },
  { id: "CERT-KNF-001", type: "conference", title: "ICALT 2026 - International Conference on Advanced Learning", recipient: "Dr. Arif Ramadhan, M.Sc.", verifiedDate: "2026-03-15", verifiedBy: "Koordinator Riset", qrCode: "QR-3B8E1D", status: "processing" },
  { id: "CERT-PUB-003", type: "publication", title: "Deep Learning for Bahasa Indonesia NLP (ACL 2026)", recipient: "Dr. Lestari Handayani", verifiedDate: "2026-01-20", verifiedBy: "Koordinator Publikasi", qrCode: "QR-9D2F6A", status: "ready" },
];

export function CertificatePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [previewCert, setPreviewCert] = useState<Certificate | null>(null);
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const filtered = MOCK_CERTIFICATES.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.recipient.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = typeFilter === "all" || c.type === typeFilter;
    return matchSearch && matchType;
  });

  const typeLabels: Record<string, { label: string; color: string; bg: string }> = {
    publication: { label: "Publikasi", color: "text-blue-700", bg: "bg-blue-50" },
    grant: { label: "Hibah", color: "text-emerald-700", bg: "bg-emerald-50" },
    conference: { label: "Konferensi", color: "text-purple-700", bg: "bg-purple-50" },
  };

  // Certificate Preview Modal
  if (previewCert) {
    return (
      <PageWrapper
        title="Preview Sertifikat"
        breadcrumbs={[{ label: "Laporan" }, { label: "Sertifikat", path: "/admin/certificate" }, { label: previewCert.id }]}
        actions={
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-[#E30613] rounded-lg hover:bg-[#c00510] transition-colors" style={{ fontWeight: 500 }}>
              <Download className="w-4 h-4" /> Download PDF
            </button>
            <button onClick={() => setPreviewCert(null)} className="px-4 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors" style={{ fontWeight: 500 }}>
              Kembali
            </button>
          </div>
        }
      >
        {/* Certificate Preview */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden shadow-lg">
            {/* Header with decorative border */}
            <div className="border-b-4 border-double border-[#E30613]/30 p-8 text-center bg-gradient-to-b from-red-50/50 to-white">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-[#E30613] flex items-center justify-center text-white">
                  <Award className="w-6 h-6" />
                </div>
              </div>
              <h2 className="text-slate-900 uppercase tracking-[0.2em] text-xs mb-1" style={{ fontWeight: 700 }}>Pradita University</h2>
              <h1 className="text-slate-800 uppercase tracking-wider" style={{ fontWeight: 700 }}>
                Lembaga Penelitian dan Pengabdian kepada Masyarakat
              </h1>
              <div className="w-24 h-0.5 bg-[#E30613] mx-auto mt-3" />
            </div>

            {/* Body */}
            <div className="p-8 text-center space-y-6">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1" style={{ fontWeight: 600 }}>Sertifikat Verifikasi</p>
                <p className="text-sm text-slate-400">No: {previewCert.id}</p>
              </div>

              <p className="text-sm text-slate-600">Dengan ini menerangkan bahwa:</p>

              <div className="py-4">
                <p className="text-xl text-slate-900" style={{ fontWeight: 700 }}>{previewCert.recipient}</p>
                <p className="text-sm text-slate-500 mt-1">NIDN: 0312098901</p>
              </div>

              <p className="text-sm text-slate-600">Telah terverifikasi sebagai {previewCert.type === "publication" ? "penulis" : previewCert.type === "grant" ? "peneliti" : "peserta"} dari:</p>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 mx-8">
                <p className="text-slate-800" style={{ fontWeight: 600 }}>{previewCert.title}</p>
                <span className={`inline-block mt-2 text-xs px-2.5 py-0.5 rounded-full ${typeLabels[previewCert.type].bg} ${typeLabels[previewCert.type].color}`} style={{ fontWeight: 500 }}>
                  {typeLabels[previewCert.type].label}
                </span>
              </div>

              {/* QR Code & Digital Stamp */}
              <div className="flex items-center justify-center gap-8 pt-4">
                <div className="text-center">
                  <div className="w-24 h-24 bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <QrCode className="w-16 h-16 text-slate-700" />
                  </div>
                  <p className="text-[10px] text-slate-400">{previewCert.qrCode}</p>
                  <p className="text-[10px] text-slate-400">Scan untuk verifikasi</p>
                </div>
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full border-2 border-[#E30613]/30 flex flex-col items-center justify-center mx-auto mb-2 relative">
                    <Stamp className="w-8 h-8 text-[#E30613]/60" />
                    <p className="text-[8px] text-[#E30613]/60 uppercase" style={{ fontWeight: 700 }}>Verified</p>
                  </div>
                  <p className="text-[10px] text-slate-400">Digital Stamp</p>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-6 border-t border-slate-100">
                <p className="text-xs text-slate-400">Diverifikasi oleh: {previewCert.verifiedBy}</p>
                <p className="text-xs text-slate-400">Tanggal: {previewCert.verifiedDate}</p>
                <p className="text-[10px] text-slate-300 mt-2">Dokumen ini dihasilkan secara otomatis oleh siPPM Pradita University</p>
              </div>
            </div>

            {/* Decorative bottom border */}
            <div className="h-2 bg-gradient-to-r from-[#E30613] via-[#ff4757] to-[#E30613]" />
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title="Sertifikat & Verifikasi"
      subtitle="Generate sertifikat terverifikasi untuk publikasi, hibah, dan konferensi"
      breadcrumbs={[{ label: "Laporan" }, { label: "Sertifikat" }]}
    >
      {loading ? (
        <SkeletonTable rows={5} />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Cari sertifikat..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E30613]/20 placeholder:text-slate-400" />
            </div>
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-600">
              <option value="all">Semua Tipe</option>
              <option value="publication">Publikasi</option>
              <option value="grant">Hibah</option>
              <option value="conference">Konferensi</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  {["ID", "Tipe", "Judul", "Penerima", "Tanggal", "Status", "Aksi"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs text-slate-500 whitespace-nowrap" style={{ fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(cert => {
                  const tl = typeLabels[cert.type];
                  return (
                    <tr key={cert.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3 text-sm text-slate-500 whitespace-nowrap" style={{ fontWeight: 500 }}>{cert.id}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${tl.bg} ${tl.color}`} style={{ fontWeight: 500 }}>{tl.label}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-800 max-w-[250px] truncate" style={{ fontWeight: 500 }}>{cert.title}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 whitespace-nowrap">{cert.recipient}</td>
                      <td className="px-4 py-3 text-sm text-slate-500 whitespace-nowrap">{cert.verifiedDate}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
                          cert.status === "ready" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
                        }`} style={{ fontWeight: 500 }}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cert.status === "ready" ? "bg-green-500" : "bg-amber-500"}`} />
                          {cert.status === "ready" ? "Siap" : "Proses"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {cert.status === "ready" && (
                            <>
                              <button onClick={() => setPreviewCert(cert)}
                                className="p-1.5 text-slate-400 hover:text-[#E30613] hover:bg-red-50 rounded-lg transition-colors" title="Preview">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Download">
                                <Download className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
