import { useParams, useNavigate } from "react-router";
import { ChevronLeft, Trophy, AlertCircle, Pencil } from "lucide-react";
import { PageWrapper } from "../../components/admin/PageWrapper";
import { ProgressBarReview } from "../../components/reviewer/ProgressBarReview";

const MOCK_LAPORAN = {
  id: "HIB-001",
  judul: "Penelitian IoT untuk Smart Campus Pradita",
  adminSkor: 48,
  adminMax: 60,
  adminCatatan: "Administrasi lengkap, semua dokumen sudah tersedia.",
  financeCatatan: "Anggaran sesuai dengan RAB yang diajukan.",
  reviewer1Skor: 62,
  reviewer1Catatan: "Topik penelitian sangat relevan dan inovatif. Metodologi perlu diperkuat sedikit.",
  reviewer2Skor: 70,
  reviewer2Catatan: "Proposal berkualitas tinggi, hibah layak diterima.",
  maxSubstansi: 80,
  statusAkhir: "Didanai" as "Didanai" | "revisi" | "tolak",
};

export function LaporanReviewHibah() {
  const { id } = useParams();
  const navigate = useNavigate();
  const data = MOCK_LAPORAN;

  const nilaiAkhirReviewer = (data.reviewer1Skor + data.reviewer2Skor) / 2;

  const scoreBars = [
    { label: "Rubrik Administrasi", value: data.adminSkor, max: data.adminMax, colorClass: "bg-blue-500" },
    { label: "Nilai Substansi — Reviewer 1", value: data.reviewer1Skor, max: data.maxSubstansi, colorClass: "bg-green-500" },
    { label: "Nilai Substansi — Reviewer 2", value: data.reviewer2Skor, max: data.maxSubstansi, colorClass: "bg-green-500" },
    { label: "Nilai Akhir Reviewer (Rata-rata)", value: nilaiAkhirReviewer, max: data.maxSubstansi, colorClass: "bg-amber-500" },
  ];

  const catatanList = [
    { label: "Catatan Administrasi", catatan: data.adminCatatan },
    { label: "Catatan Finance", catatan: data.financeCatatan },
    { label: "Catatan Reviewer 1", catatan: data.reviewer1Catatan },
    { label: "Catatan Reviewer 2", catatan: data.reviewer2Catatan },
  ];

  return (
    <PageWrapper
      title="Laporan Hasil Review Hibah"
      breadcrumbs={[{ label: "Reviewer" }, { label: "Review Hibah", path: "/reviewer/hibah" }, { label: `Laporan ${id}` }]}
      actions={
        <button onClick={() => navigate("/reviewer/hibah")} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Kembali
        </button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Bar Scores */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-sm font-semibold text-slate-800 mb-5">Rekap Penilaian</h3>
            <ProgressBarReview bars={scoreBars} />
          </div>

          {/* Catatan */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-sm font-semibold text-slate-800 mb-4">Catatan Review</h3>
            <div className="space-y-3">
              {catatanList.map((c) => (
                <div key={c.label} className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-lg">
                  <p className="text-xs font-semibold text-slate-500 mb-1">{c.label}</p>
                  <p className="text-sm text-slate-700">{c.catatan}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Status Akhir */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-sm font-semibold text-slate-800 mb-4">Status Akhir Proposal</h3>
            {data.statusAkhir === "Didanai" && (
              <div className="flex flex-col items-center py-6 gap-3 text-center">
                <Trophy className="w-12 h-12 text-amber-500" />
                <p className="text-base font-bold text-green-700">Proposal Hibah Diterima</p>
                <p className="text-sm text-slate-500">Selamat! Proposal Anda mendapatkan pendanaan.</p>
                <div className="mt-3 w-full">
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Upload File Kontrak</label>
                  <input type="url" placeholder="URL Kontrak (Drive/storage)..."
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E30613]/20 bg-slate-50 placeholder:text-slate-400"
                  />
                </div>
              </div>
            )}
            {(data.statusAkhir === "revisi" || data.statusAkhir === "tolak") && (
              <div className="flex flex-col items-center py-6 gap-3 text-center">
                {data.statusAkhir === "revisi" ? (
                  <><Pencil className="w-12 h-12 text-orange-400" /><p className="text-base font-bold text-orange-700">Proposal Harap Direvisi</p></>
                ) : (
                  <><AlertCircle className="w-12 h-12 text-red-400" /><p className="text-base font-bold text-red-700">Proposal Ditolak</p></>
                )}
              </div>
            )}
          </div>

          {/* Score Summary */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
            <h4 className="text-sm font-semibold text-slate-800">Ringkasan Skor</h4>
            {[
              { label: "Admin", score: `${data.adminSkor}/${data.adminMax}` },
              { label: "Reviewer 1", score: `${data.reviewer1Skor}/${data.maxSubstansi}` },
              { label: "Reviewer 2", score: `${data.reviewer2Skor}/${data.maxSubstansi}` },
              { label: "Rata-rata", score: `${nilaiAkhirReviewer}/${data.maxSubstansi}` },
            ].map((s) => (
              <div key={s.label} className="flex justify-between text-sm">
                <span className="text-slate-600">{s.label}</span>
                <span className="font-bold text-slate-800">{s.score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

