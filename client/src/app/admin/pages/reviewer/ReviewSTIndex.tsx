import { useNavigate } from "react-router";
import { FileText, ChevronRight, Calendar } from "lucide-react";
import { PageWrapper } from "../../components/PageWrapper";

interface PeriodeST {
  id: string;
  tahunAjaran: string;
  semester: string;
  periodeAwal: string;
  periodeAkhir: string;
  totalPengajuan: number;
}

const MOCK_PERIODE: PeriodeST[] = [
  { id: "S1", tahunAjaran: "2025/2026", semester: "Ganjil", periodeAwal: "2025-08-01", periodeAkhir: "2025-12-31", totalPengajuan: 12 },
  { id: "S2", tahunAjaran: "2024/2025", semester: "Genap", periodeAwal: "2025-01-15", periodeAkhir: "2025-06-30", totalPengajuan: 8 },
  { id: "S3", tahunAjaran: "2024/2025", semester: "Ganjil", periodeAwal: "2024-08-01", periodeAkhir: "2024-12-31", totalPengajuan: 15 },
];

export function ReviewSTIndex() {
  const navigate = useNavigate();

  return (
    <PageWrapper
      title="Review Surat Tugas"
      subtitle="Pilih periode untuk melihat daftar pengajuan surat tugas"
      breadcrumbs={[{ label: "Reviewer" }, { label: "Review Surat Tugas" }]}
    >
      <div className="space-y-3">
        {MOCK_PERIODE.map((p) => (
          <div
            key={p.id}
            onClick={() => navigate(`/reviewer/surat-tugas/${p.id}`)}
            className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-5 py-4 cursor-pointer hover:border-[#E30613]/30 hover:shadow-sm transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#E30613]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">{p.tahunAjaran} — {p.semester}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <p className="text-xs text-slate-500">{p.periodeAwal} – {p.periodeAkhir}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                {p.totalPengajuan} Pengajuan
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#E30613] transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}
