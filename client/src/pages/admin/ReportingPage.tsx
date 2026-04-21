import { useState, useEffect } from "react";
import { Upload, CheckCircle, Clock, AlertCircle, FileText, Video, FileSpreadsheet, Presentation, ExternalLink, ChevronLeft, Download, Eye } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { PageWrapper } from "../../components/admin/PageWrapper";
import { StatusBadge, type StatusType } from "../../components/admin/StatusBadge";
import { SkeletonCard } from "../../components/admin/SkeletonLoader";

interface GrantReport {
  id: string;
  grantId: string;
  grantTitle: string;
  pengusul: string;
  scheme: string;
  year: number;
  status: "in-progress" | "completed";
  deadline: string;
}

interface ReportItem {
  key: string;
  label: string;
  icon: typeof FileText;
  status: "uploaded" | "pending" | "verified" | "revision";
  file?: string;
  date?: string;
  note?: string;
}

const MOCK_GRANTS: GrantReport[] = [
  { id: "RPT-001", grantId: "HIB-002", grantTitle: "Pengembangan AI Chatbot untuk Layanan Akademik", pengusul: "Dr. Rina Wulandari", scheme: "Penelitian Terapan", year: 2026, status: "in-progress", deadline: "2026-06-30" },
  { id: "RPT-002", grantId: "HIB-006", grantTitle: "Analisis Sentimen Media Sosial untuk Brand", pengusul: "Dr. Dewi Lestari", scheme: "Penelitian Terapan", year: 2025, status: "completed", deadline: "2025-12-31" },
  { id: "RPT-003", grantId: "HIB-007", grantTitle: "Blockchain untuk Sertifikat Digital", pengusul: "Dr. Faisal Rahman", scheme: "Penelitian Terapan", year: 2025, status: "completed", deadline: "2025-11-30" },
];

export function ReportingPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [selectedGrant, setSelectedGrant] = useState<GrantReport | null>(null);
  const [reportItems, setReportItems] = useState<ReportItem[]>([]);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const handleSelectGrant = (grant: GrantReport) => {
    setSelectedGrant(grant);
    setReportItems([
      { key: "progress", label: "Laporan Kemajuan (Progress Report)", icon: FileText, status: grant.status === "completed" ? "verified" : "uploaded", file: "laporan_kemajuan_v2.pdf", date: "2026-04-15" },
      { key: "final", label: "Laporan Akhir (Final Report)", icon: FileSpreadsheet, status: grant.status === "completed" ? "verified" : "pending" },
      { key: "turnitin", label: "Hasil Turnitin", icon: FileText, status: grant.status === "completed" ? "verified" : grant.id === "RPT-001" ? "uploaded" : "pending", file: grant.id === "RPT-001" ? "turnitin_result_18pct.pdf" : undefined, date: grant.id === "RPT-001" ? "2026-05-01" : undefined },
      { key: "youtube", label: "Dokumentasi YouTube", icon: Video, status: grant.status === "completed" ? "verified" : "pending", note: "Link video dokumentasi kegiatan" },
      { key: "dissemination", label: "PPT Diseminasi", icon: Presentation, status: grant.status === "completed" ? "verified" : grant.id === "RPT-001" ? "revision" : "pending", note: grant.id === "RPT-001" ? "Perlu revisi: tambahkan slide hasil & kesimpulan" : undefined },
    ]);
  };

  const completedCount = reportItems.filter(r => r.status === "verified" || r.status === "uploaded").length;
  const totalItems = reportItems.length;
  const completionPct = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "uploaded": return <Clock className="w-4 h-4 text-blue-500" />;
      case "revision": return <AlertCircle className="w-4 h-4 text-orange-500" />;
      default: return <Clock className="w-4 h-4 text-slate-300" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "verified": return { text: "Verified", bg: "bg-green-50", color: "text-green-700" };
      case "uploaded": return { text: "Uploaded", bg: "bg-blue-50", color: "text-blue-700" };
      case "revision": return { text: "Revisi", bg: "bg-orange-50", color: "text-orange-700" };
      default: return { text: "Pending", bg: "bg-slate-100", color: "text-slate-500" };
    }
  };

  const handleUpload = (key: string) => {
    setReportItems(prev => prev.map(r =>
      r.key === key ? { ...r, status: "uploaded" as const, file: `${key}_uploaded.pdf`, date: new Date().toISOString().split("T")[0] } : r
    ));
  };

  // Detail view
  if (selectedGrant) {
    return (
      <PageWrapper
        title="Laporan Pasca-Pendanaan"
        subtitle={selectedGrant.grantTitle}
        breadcrumbs={[{ label: "Laporan" }, { label: "Pelaporan", path: "/admin/reporting" }, { label: selectedGrant.grantId }]}
        actions={
          <button onClick={() => setSelectedGrant(null)} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Kembali
          </button>
        }
      >
        {/* Progress overview */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="text-sm text-slate-800" style={{ fontWeight: 600 }}>Progress Pelaporan</h4>
              <p className="text-xs text-slate-400 mt-0.5">Deadline: {selectedGrant.deadline}</p>
            </div>
            <div className="text-right">
              <span className="text-2xl text-slate-900" style={{ fontWeight: 700 }}>{completionPct}%</span>
              <p className="text-xs text-slate-400">{completedCount}/{totalItems} dokumen</p>
            </div>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all ${completionPct === 100 ? "bg-green-500" : "bg-[#E30613]"}`}
              style={{ width: `${completionPct}%` }} />
          </div>
          {/* Status tracker badges */}
          <div className="flex flex-wrap gap-2 mt-4">
            {reportItems.map(item => {
              const sl = getStatusLabel(item.status);
              return (
                <span key={item.key} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs ${sl.bg} ${sl.color}`} style={{ fontWeight: 500 }}>
                  {getStatusIcon(item.status)}
                  {item.label.split("(")[0].trim()}
                </span>
              );
            })}
          </div>
        </div>

        {/* Report Items */}
        <div className="space-y-3">
          {reportItems.map(item => {
            const ItemIcon = item.icon;
            const sl = getStatusLabel(item.status);
            return (
              <div key={item.key} className={`bg-white rounded-xl border p-5 transition-all ${
                item.status === "revision" ? "border-orange-200" : item.status === "verified" ? "border-green-100" : "border-slate-200"
              }`}>
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    item.status === "verified" ? "bg-green-50" : item.status === "revision" ? "bg-orange-50" : item.status === "uploaded" ? "bg-blue-50" : "bg-slate-50"
                  }`}>
                    <ItemIcon className={`w-5 h-5 ${
                      item.status === "verified" ? "text-green-500" : item.status === "revision" ? "text-orange-500" : item.status === "uploaded" ? "text-blue-500" : "text-slate-400"
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm text-slate-800" style={{ fontWeight: 600 }}>{item.label}</p>
                      <span className={`text-[11px] px-2 py-0.5 rounded-full ${sl.bg} ${sl.color}`} style={{ fontWeight: 500 }}>{sl.text}</span>
                    </div>
                    {item.file && (
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 rounded-lg text-xs text-slate-600 border border-slate-100">
                          <FileText className="w-3 h-3" /> {item.file}
                        </div>
                        {item.date && <span className="text-xs text-slate-400">Uploaded: {item.date}</span>}
                      </div>
                    )}
                    {item.status === "revision" && item.note && (
                      <div className="mt-2 p-2.5 bg-orange-50 border border-orange-100 rounded-lg">
                        <p className="text-xs text-orange-700">{item.note}</p>
                      </div>
                    )}
                    {item.key === "youtube" && item.status !== "pending" && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-blue-600 hover:underline cursor-pointer">
                        <ExternalLink className="w-3.5 h-3.5" /> https://youtu.be/example-dokumentasi
                      </div>
                    )}
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    {item.status === "verified" && (
                      <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                    {(item.status === "pending" || item.status === "revision") && (
                      <button onClick={() => handleUpload(item.key)}
                        className="flex items-center gap-1.5 px-3 py-2 text-xs text-white bg-[#E30613] rounded-lg hover:bg-[#c00510] transition-colors"
                        style={{ fontWeight: 500 }}>
                        <Upload className="w-3.5 h-3.5" />
                        {item.status === "revision" ? "Re-upload" : "Upload"}
                      </button>
                    )}
                    {item.status === "uploaded" && (
                      <button className="flex items-center gap-1.5 px-3 py-2 text-xs text-slate-500 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                        style={{ fontWeight: 500 }}>
                        <Download className="w-3.5 h-3.5" /> Download
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* YouTube Link Input */}
        {reportItems.find(r => r.key === "youtube")?.status === "pending" && (
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Video className="w-4 h-4 text-[#E30613]" />
              <h4 className="text-sm text-slate-800" style={{ fontWeight: 600 }}>Link Dokumentasi YouTube</h4>
            </div>
            <div className="flex gap-3">
              <input type="url" placeholder="https://youtube.com/watch?v=..."
                className="flex-1 px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613]/40 bg-slate-50/50 placeholder:text-slate-400" />
              <button onClick={() => handleUpload("youtube")}
                className="px-4 py-2.5 text-sm text-white bg-[#E30613] rounded-lg hover:bg-[#c00510] transition-colors"
                style={{ fontWeight: 500 }}>Simpan</button>
            </div>
          </div>
        )}
      </PageWrapper>
    );
  }

  // List view
  return (
    <PageWrapper
      title="Pelaporan Pasca-Pendanaan"
      subtitle="Upload dokumen pelaporan untuk hibah yang sudah didanai"
      breadcrumbs={[{ label: "Laporan" }, { label: "Pelaporan" }]}
    >
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_GRANTS.map(grant => (
            <button key={grant.id} onClick={() => handleSelectGrant(grant)}
              className="bg-white rounded-xl border border-slate-200 p-5 text-left hover:shadow-md hover:border-slate-300 transition-all group">
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs text-slate-400" style={{ fontWeight: 500 }}>{grant.grantId}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  grant.status === "completed" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
                }`} style={{ fontWeight: 500 }}>
                  {grant.status === "completed" ? "Selesai" : "Dalam Proses"}
                </span>
              </div>
              <h4 className="text-sm text-slate-800 mb-2 group-hover:text-[#E30613] transition-colors line-clamp-2" style={{ fontWeight: 600 }}>
                {grant.grantTitle}
              </h4>
              <p className="text-xs text-slate-400 mb-3">{grant.pengusul} &middot; {grant.scheme}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Deadline: {grant.deadline}</span>
                <span className="text-xs text-[#E30613]" style={{ fontWeight: 500 }}>Lihat Detail &rarr;</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </PageWrapper>
  );
}
