import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ChevronLeft, ExternalLink } from "lucide-react";
import { PageWrapper } from "../../components/admin/PageWrapper";
import { InvitationBanner } from "../../components/reviewer/InvitationBanner";
import { RubrikScoringForm } from "../../components/reviewer/RubrikScoringForm";
import { RABTable, LuaranTable, MitraTable } from "../../components/reviewer/ReviewTables";

// ─── Mock Data ──────────────────────────────────────────────────────────────
const MOCK_HIBAH = {
  id: "HIB-001",
  judul: "Penelitian IoT untuk Smart Campus Pradita",
  pengusul: "Dr. Arif Ramadhan, M.Sc.",
  kelompokSkema: "Penelitian Dasar",
  tahunUsulan: 2026,
  temaHibah: "Teknologi Informasi & Komunikasi",
  semester: "Ganjil",
  abstrak: "Penelitian ini bertujuan mengembangkan sistem IoT terintegrasi untuk Smart Campus Pradita, mencakup monitoring energi, pengelolaan fasilitas, dan sistem kehadiran berbasis biometrik.",
  proposalUrl: "https://drive.google.com/proposal.pdf",
  dokumenUrl: "https://drive.google.com/dokumen.pdf",
};

const MOCK_RAB = [
  { kelompok: "Bahan", komponen: "Elektronik", item: "Sensor IoT", satuan: "unit", hargaSatuan: 500000, volume: 10 },
  { kelompok: "Jasa", komponen: "Tenaga Ahli", item: "Programmer", satuan: "OB", hargaSatuan: 3000000, volume: 3 },
  { kelompok: "Overhead", komponen: "Operasional", item: "Transportasi", satuan: "paket", hargaSatuan: 500000, volume: 4 },
];

const MOCK_LUARAN = [
  { namaJurnal: "Journal of IoT Research", url: "https://iotjournal.example.com" },
];

const MOCK_MITRA = [
  { nama: "Bapak Ridwan Setiawan", institusi: "PT. Tech Solutions Indonesia", alamat: "Jakarta Selatan", surel: "ridwan@techsol.id", negara: "Indonesia", dana: 10000000 },
];

const MOCK_RUBRIK = [
  {
    id: "R1",
    pertanyaan: "Kualitas dan keaslian topik penelitian",
    pilihans: [
      { id: "R1-A", label: "Sangat original dan inovatif", bobot: 25 },
      { id: "R1-B", label: "Cukup original", bobot: 15 },
      { id: "R1-C", label: "Kurang original", bobot: 5 },
    ],
  },
  {
    id: "R2",
    pertanyaan: "Kekuatan metodologi penelitian",
    pilihans: [
      { id: "R2-A", label: "Metodologi sangat kuat dan terstruktur", bobot: 25 },
      { id: "R2-B", label: "Metodologi cukup baik", bobot: 15 },
      { id: "R2-C", label: "Metodologi lemah, perlu perbaikan", bobot: 5 },
    ],
  },
  {
    id: "R3",
    pertanyaan: "Kesesuaian anggaran dengan kegiatan",
    pilihans: [
      { id: "R3-A", label: "Anggaran sangat sesuai dan efisien", bobot: 20 },
      { id: "R3-B", label: "Anggaran cukup sesuai", bobot: 12 },
      { id: "R3-C", label: "Anggaran tidak proporsional", bobot: 4 },
    ],
  },
];

// ─── Component ───────────────────────────────────────────────────────────────
export function ReviewHibahPenelitian() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"informasi" | "substansi">("informasi");
  const [approvalStatus, setApprovalStatus] = useState<"pending" | "terima" | "tolak">("pending");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const hibah = MOCK_HIBAH;

  const handleTerima = () => {
    setInviteLoading(true);
    setTimeout(() => { setApprovalStatus("terima"); setInviteLoading(false); }, 800);
  };
  const handleTolak = () => {
    setInviteLoading(true);
    setTimeout(() => { setApprovalStatus("tolak"); setInviteLoading(false); }, 800);
  };
  const handleRubrikSubmit = (_answers: Record<string, string>, _catatan: string) => {
    setTimeout(() => { setSubmitSuccess(true); }, 500);
  };

  const TABS = [
    { key: "informasi", label: "Informasi" },
    ...(approvalStatus === "terima" ? [{ key: "substansi", label: "Review Substansi Penelitian" }] : []),
  ] as const;

  return (
    <PageWrapper
      title="Review Hibah Penelitian"
      breadcrumbs={[{ label: "Reviewer" }, { label: "Review Hibah", path: "/reviewer/hibah" }, { label: id ?? "" }]}
      actions={
        <button onClick={() => navigate("/reviewer/hibah")} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Kembali
        </button>
      }
    >
      {/* Invitation Banner */}
      <InvitationBanner
        status={approvalStatus}
        onTerima={handleTerima}
        onTolak={handleTolak}
        loading={inviteLoading}
      />

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-5 py-2.5 text-sm font-medium transition-all border-b-2 -mb-px ${
              activeTab === tab.key
                ? "text-[#E30613] border-[#E30613]"
                : "text-slate-500 border-transparent hover:text-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ─── Tab: Informasi ─── */}
      {activeTab === "informasi" && (
        <div className="space-y-6">
          {/* Informasi Hibah - hanya tampil jika terima */}
          {approvalStatus === "terima" && (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-sm font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">Informasi Proposal</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Kelompok Skema", value: hibah.kelompokSkema },
                  { label: "Tahun Usulan", value: String(hibah.tahunUsulan) },
                  { label: "Tema Hibah", value: hibah.temaHibah },
                  { label: "Semester", value: hibah.semester },
                  { label: "Judul", value: hibah.judul },
                ].map((f) => (
                  <div key={f.label}>
                    <p className="text-xs text-slate-400 font-medium mb-0.5">{f.label}</p>
                    <p className="text-sm text-slate-800 font-medium">{f.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <p className="text-xs text-slate-400 font-medium mb-1">Abstrak</p>
                <p className="text-sm text-slate-700 leading-relaxed">{hibah.abstrak}</p>
              </div>

              <div className="flex gap-3 mt-4">
                <a href={hibah.proposalUrl} target="_blank" rel="noreferrer"
                  className="flex items-center gap-1.5 text-sm text-blue-600 hover:underline">
                  <ExternalLink className="w-3.5 h-3.5" /> Proposal
                </a>
                <a href={hibah.dokumenUrl} target="_blank" rel="noreferrer"
                  className="flex items-center gap-1.5 text-sm text-blue-600 hover:underline">
                  <ExternalLink className="w-3.5 h-3.5" /> Dokumen
                </a>
              </div>
            </div>
          )}

          {/* RAB */}
          {approvalStatus === "terima" && (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-sm font-semibold text-slate-800 mb-4">Rancangan Anggaran Biaya (RAB)</h3>
              <RABTable items={MOCK_RAB} />
            </div>
          )}

          {/* Luaran */}
          {approvalStatus === "terima" && MOCK_LUARAN.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-sm font-semibold text-slate-800 mb-4">Luaran</h3>
              <LuaranTable items={MOCK_LUARAN} luaranWajib="Jurnal Nasional Terakreditasi Sinta 2" />
            </div>
          )}

          {/* Mitra */}
          {approvalStatus === "terima" && MOCK_MITRA.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-sm font-semibold text-slate-800 mb-4">Mitra</h3>
              <MitraTable items={MOCK_MITRA} />
            </div>
          )}
        </div>
      )}

      {/* ─── Tab: Substansi ─── */}
      {activeTab === "substansi" && approvalStatus === "terima" && (
        <div>
          {submitSuccess ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="text-4xl">✅</div>
              <p className="text-base font-semibold text-green-700">Penilaian berhasil disimpan!</p>
              <button onClick={() => navigate("/reviewer/hibah")} className="mt-2 text-sm text-[#E30613] hover:underline">
                Kembali ke daftar
              </button>
            </div>
          ) : (
            <RubrikScoringForm
              rubrikItems={MOCK_RUBRIK}
              bolehReview={true}
              onSubmit={handleRubrikSubmit}
            />
          )}
        </div>
      )}
    </PageWrapper>
  );
}

