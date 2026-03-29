import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ChevronLeft, ExternalLink } from "lucide-react";
import { PageWrapper } from "../../components/PageWrapper";
import { InvitationBanner } from "../../components/reviewer/InvitationBanner";
import { RubrikScoringForm } from "../../components/reviewer/RubrikScoringForm";
import { RABTable, MitraTable } from "../../components/reviewer/ReviewTables";

const MOCK_PKM = {
  id: "HIB-002",
  judul: "Pengabdian Masyarakat Desa Digital",
  pengusul: "Dr. Fajar Nugroho",
  kelompokSkema: "PKM Bidang Ilmu",
  tahunUsulan: 2026,
  semester: "Genap",
  abstrak: "Program pengabdian masyarakat bertujuan membantu UMKM di desa sekitar kampus memanfaatkan teknologi digital untuk pemasaran dan manajemen usaha.",
  proposalUrl: "https://drive.google.com/pkm-proposal.pdf",
  dokumenUrl: "https://drive.google.com/pkm-dokumen.pdf",
};

const MOCK_RAB = [
  { kelompok: "Bahan", komponen: "Modul", item: "Modul Pelatihan", satuan: "paket", hargaSatuan: 200000, volume: 20 },
  { kelompok: "Jasa", komponen: "Narasumber", item: "Instruktur Digital", satuan: "sesi", hargaSatuan: 1500000, volume: 4 },
];

const MOCK_MITRA = [
  { nama: "Pak Bambang Nugraha", institusi: "Kelurahan Batu Ceper", alamat: "Tangerang", surel: "bambang@batuceper.go.id", negara: "Indonesia" },
];

const MOCK_RUBRIK_PKM = [
  {
    id: "P1",
    pertanyaan: "Relevansi program dengan kebutuhan masyarakat mitra",
    pilihans: [
      { id: "P1-A", label: "Sangat relevan dan berbasis kebutuhan nyata", bobot: 30 },
      { id: "P1-B", label: "Cukup relevan", bobot: 18 },
      { id: "P1-C", label: "Kurang relevan", bobot: 6 },
    ],
  },
  {
    id: "P2",
    pertanyaan: "Keberlanjutan program setelah kegiatan selesai",
    pilihans: [
      { id: "P2-A", label: "Ada rencana keberlanjutan yang jelas", bobot: 25 },
      { id: "P2-B", label: "Keberlanjutan sebagian", bobot: 13 },
      { id: "P2-C", label: "Tidak ada rencana keberlanjutan", bobot: 4 },
    ],
  },
];

export function ReviewHibahPKM() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"informasi" | "substansi">("informasi");
  const [approvalStatus, setApprovalStatus] = useState<"pending" | "terima" | "tolak">("pending");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleTerima = () => { setInviteLoading(true); setTimeout(() => { setApprovalStatus("terima"); setInviteLoading(false); }, 800); };
  const handleTolak = () => { setInviteLoading(true); setTimeout(() => { setApprovalStatus("tolak"); setInviteLoading(false); }, 800); };
  const handleSubmit = () => setTimeout(() => setSubmitSuccess(true), 500);

  const TABS = [
    { key: "informasi", label: "Informasi" },
    ...(approvalStatus === "terima" ? [{ key: "substansi", label: "Review Substansi" }] : []),
  ] as const;

  return (
    <PageWrapper
      title="Review Hibah PKM"
      breadcrumbs={[{ label: "Reviewer" }, { label: "Review Hibah", path: "/reviewer/hibah" }, { label: id ?? "" }]}
      actions={
        <button onClick={() => navigate("/reviewer/hibah")} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Kembali
        </button>
      }
    >
      <InvitationBanner status={approvalStatus} onTerima={handleTerima} onTolak={handleTolak} loading={inviteLoading} />

      <div className="flex gap-1 border-b border-slate-200 mb-6">
        {TABS.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key as any)}
            className={`px-5 py-2.5 text-sm font-medium transition-all border-b-2 -mb-px ${activeTab === tab.key ? "text-[#E30613] border-[#E30613]" : "text-slate-500 border-transparent hover:text-slate-700"}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "informasi" && (
        <div className="space-y-6">
          {approvalStatus === "terima" && (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-sm font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">Informasi Proposal PKM</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Kelompok Skema", value: MOCK_PKM.kelompokSkema },
                  { label: "Tahun Usulan", value: String(MOCK_PKM.tahunUsulan) },
                  { label: "Semester", value: MOCK_PKM.semester },
                  { label: "Judul", value: MOCK_PKM.judul },
                ].map((f) => (
                  <div key={f.label}>
                    <p className="text-xs text-slate-400 font-medium mb-0.5">{f.label}</p>
                    <p className="text-sm text-slate-800 font-medium">{f.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <p className="text-xs text-slate-400 font-medium mb-1">Abstrak</p>
                <p className="text-sm text-slate-700 leading-relaxed">{MOCK_PKM.abstrak}</p>
              </div>
              <div className="flex gap-3 mt-4">
                <a href={MOCK_PKM.proposalUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm text-blue-600 hover:underline">
                  <ExternalLink className="w-3.5 h-3.5" /> Proposal
                </a>
                <a href={MOCK_PKM.dokumenUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm text-blue-600 hover:underline">
                  <ExternalLink className="w-3.5 h-3.5" /> Dokumen
                </a>
              </div>
            </div>
          )}
          {approvalStatus === "terima" && (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-sm font-semibold text-slate-800 mb-4">RAB</h3>
              <RABTable items={MOCK_RAB} />
            </div>
          )}
          {approvalStatus === "terima" && MOCK_MITRA.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-sm font-semibold text-slate-800 mb-4">Mitra</h3>
              <MitraTable items={MOCK_MITRA} />
            </div>
          )}
        </div>
      )}

      {activeTab === "substansi" && approvalStatus === "terima" && (
        submitSuccess ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="text-4xl">✅</div>
            <p className="text-base font-semibold text-green-700">Penilaian berhasil disimpan!</p>
            <button onClick={() => navigate("/reviewer/hibah")} className="mt-2 text-sm text-[#E30613] hover:underline">Kembali ke daftar</button>
          </div>
        ) : (
          <RubrikScoringForm rubrikItems={MOCK_RUBRIK_PKM} bolehReview={true} onSubmit={handleSubmit} />
        )
      )}
    </PageWrapper>
  );
}
