import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ChevronLeft, CheckCircle, RotateCcw, XCircle, ExternalLink } from "lucide-react";
import { PageWrapper } from "../../components/admin/PageWrapper";
import { ReviewStatusModal } from "../../components/reviewer/ReviewStatusModal";
import { ReviewTimeline } from "../../components/reviewer/ReviewTimeline";

const MOCK_ST = {
  id: "ST-001",
  tahunAjaran: "2025/2026",
  semester: "Ganjil",
  namaDosen: "Dr. Galih Pranata, M.T.",
  peran: "Ketua",
  kegiatan: "Seminar Nasional",
  sumberDana: "DIPA Universitas",
  judulKegiatan: "Seminar Nasional Teknologi Informasi 2026",
  tanggalMulai: "2026-04-10",
  tanggalSelesai: "2026-04-11",
  tanggalPermintaan: "2026-03-01",
  lokasi: "Hotel Grand Mercure, Jakarta",
  keterangan: "Sebagai pembicara tamu.",
  urlBuktiUndangan: "https://drive.google.com/undangan.pdf",
  urlProposal: "https://drive.google.com/proposal.pdf",
  urlKontrak: "",
  anggotaInternal: [
    { nama: "Dr. Galih Pranata, M.T.", peran: "Ketua" },
    { nama: "Ir. Wulan Safitri, M.Sc.", peran: "Anggota" },
  ],
  anggotaEksternal: [
    { nama: "Prof. Yogi Darmawan", afiliasi: "Universitas Indonesia", peran: "Co-Presenter" },
  ],
  status: "submit" as "submit" | "approve" | "revisi" | "tolak",
  urlST: "",
  urlLapKemajuan: "",
  urlLapAkhir: "",
  hutangLunas: false,
};

const MOCK_TIMELINE = [
  { date: "2026-03-01", actor: "Dr. Galih Pranata", status: "Submit", catatan: "" },
  { date: "2026-03-03", actor: "Sistem", status: "Pending", catatan: "Menunggu review" },
];

export function ReviewSTDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"detail" | "laporan" | "histories">("detail");
  const [modal, setModal] = useState<{ open: boolean; action: "approve" | "revisi" | "tolak" }>({ open: false, action: "approve" });
  const [status, setStatus] = useState(MOCK_ST.status);
  const [timeline, setTimeline] = useState(MOCK_TIMELINE);
  const [hutangLunas, setHutangLunas] = useState(MOCK_ST.hutangLunas);
  const [actionLoading, setActionLoading] = useState(false);

  const st = MOCK_ST;
  const canReview = status === "submit" || status === "revisi";

  const handleAction = (catatan: string) => {
    setActionLoading(true);
    setTimeout(() => {
      const newStatus = modal.action === "approve" ? "approve" : modal.action === "revisi" ? "revisi" : "tolak";
      setStatus(newStatus as any);
      setTimeline((prev) => [...prev, { date: new Date().toISOString().split("T")[0], actor: "Reviewer", status: newStatus, catatan }]);
      setModal((m) => ({ ...m, open: false }));
      setActionLoading(false);
    }, 800);
  };

  const handleTerimaLaporan = () => {
    setActionLoading(true);
    setTimeout(() => { setHutangLunas(true); setActionLoading(false); }, 800);
  };

  const STATUS_COLORS: Record<string, string> = {
    submit: "bg-blue-100 text-blue-700",
    approve: "bg-green-100 text-green-700",
    revisi: "bg-orange-100 text-orange-700",
    tolak: "bg-red-100 text-red-700",
  };

  return (
    <PageWrapper
      title="Review Surat Tugas"
      breadcrumbs={[{ label: "Reviewer" }, { label: "Review ST", path: "/reviewer/surat-tugas" }, { label: id ?? "" }]}
      actions={
        <button onClick={() => navigate("/reviewer/surat-tugas")} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Kembali
        </button>
      }
    >
      {/* Status badge */}
      <div className="flex items-center gap-3 mb-5">
        <span className={`px-3 py-1.5 text-xs font-bold rounded-full ${STATUS_COLORS[status] ?? "bg-slate-100 text-slate-600"}`}>
          Status: {status.toUpperCase()}
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200 mb-6">
        {[
          { key: "detail", label: "Detail Ajuan ST" },
          { key: "laporan", label: "Laporan Kegiatan" },
          { key: "histories", label: "Histories" },
        ].map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key as any)}
            className={`px-5 py-2.5 text-sm font-medium transition-all border-b-2 -mb-px ${activeTab === tab.key ? "text-[#E30613] border-[#E30613]" : "text-slate-500 border-transparent hover:text-slate-700"}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ─── Tab: Detail ─── */}
      {activeTab === "detail" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Tahun Ajaran", value: `${st.tahunAjaran} — ${st.semester}` },
              { label: "Nama Dosen", value: st.namaDosen },
              { label: "Peran", value: st.peran },
              { label: "Kegiatan", value: st.kegiatan },
              { label: "Sumber Dana", value: st.sumberDana },
              { label: "Judul Kegiatan", value: st.judulKegiatan },
              { label: "Tanggal Kegiatan", value: `${st.tanggalMulai} – ${st.tanggalSelesai}` },
              { label: "Tanggal Permintaan ST", value: st.tanggalPermintaan },
              { label: "Lokasi", value: st.lokasi },
              { label: "Keterangan", value: st.keterangan },
            ].map((f) => (
              <div key={f.label}>
                <p className="text-xs text-slate-400 font-medium mb-0.5">{f.label}</p>
                <p className="text-sm text-slate-800 font-medium">{f.value}</p>
              </div>
            ))}
            <div><p className="text-xs text-slate-400 font-medium mb-0.5">URL Bukti Undangan</p>
              <a href={st.urlBuktiUndangan} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm text-blue-600 hover:underline"><ExternalLink className="w-3.5 h-3.5" /> Unduh</a></div>
            <div><p className="text-xs text-slate-400 font-medium mb-0.5">URL Proposal</p>
              <a href={st.urlProposal} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm text-blue-600 hover:underline"><ExternalLink className="w-3.5 h-3.5" /> Unduh</a></div>
          </div>

          {/* Tim Internal */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h4 className="text-sm font-semibold text-slate-800 mb-3">Tim Peneliti (Internal Pradita)</h4>
            <table className="w-full text-sm"><thead><tr className="border-b border-slate-100"><th className="px-3 py-2 text-left text-xs font-semibold text-slate-500">Nama</th><th className="px-3 py-2 text-left text-xs font-semibold text-slate-500">Peran</th></tr></thead>
              <tbody className="divide-y divide-slate-50">{st.anggotaInternal.map((a, i) => (<tr key={i}><td className="px-3 py-2.5 text-slate-700">{a.nama}</td><td className="px-3 py-2.5 text-slate-600">{a.peran}</td></tr>))}</tbody>
            </table>
          </div>

          {st.anggotaEksternal.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h4 className="text-sm font-semibold text-slate-800 mb-3">Tim Peneliti (Eksternal)</h4>
              <table className="w-full text-sm"><thead><tr className="border-b border-slate-100"><th className="px-3 py-2 text-left text-xs font-semibold text-slate-500">Nama</th><th className="px-3 py-2 text-left text-xs font-semibold text-slate-500">Afiliasi</th><th className="px-3 py-2 text-left text-xs font-semibold text-slate-500">Peran</th></tr></thead>
                <tbody className="divide-y divide-slate-50">{st.anggotaEksternal.map((a, i) => (<tr key={i}><td className="px-3 py-2.5 text-slate-700">{a.nama}</td><td className="px-3 py-2.5 text-slate-600">{a.afiliasi}</td><td className="px-3 py-2.5 text-slate-600">{a.peran}</td></tr>))}</tbody>
              </table>
            </div>
          )}

          {/* Aksi */}
          {canReview && (
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h4 className="text-sm font-semibold text-slate-800 mb-3">Aksi Review</h4>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setModal({ open: true, action: "approve" })} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors">
                  <CheckCircle className="w-4 h-4" /> Approve
                </button>
                <button onClick={() => setModal({ open: true, action: "revisi" })} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-orange-600 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors">
                  <RotateCcw className="w-4 h-4" /> Minta Revisi
                </button>
                <button onClick={() => setModal({ open: true, action: "tolak" })} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 transition-colors">
                  <XCircle className="w-4 h-4" /> Tolak
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── Tab: Laporan ─── */}
      {activeTab === "laporan" && (
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-3 py-1.5 text-xs font-bold rounded-full ${hutangLunas ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                Hutang: {hutangLunas ? "✅ LUNAS" : "❌ Belum Lunas"}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              {[
                { label: "URL Surat Tugas", url: st.urlST },
                { label: "URL Laporan Kemajuan", url: st.urlLapKemajuan },
                { label: "URL Laporan Akhir", url: st.urlLapAkhir },
                { label: "URL Proposal", url: st.urlProposal },
              ].map((f) => (
                <div key={f.label}>
                  <p className="text-xs text-slate-400 font-medium mb-0.5">{f.label}</p>
                  {f.url ? (
                    <a href={f.url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm text-blue-600 hover:underline"><ExternalLink className="w-3.5 h-3.5" /> Unduh</a>
                  ) : (
                    <p className="text-sm text-slate-400 italic">— Belum diupload</p>
                  )}
                </div>
              ))}
            </div>
            {!hutangLunas && (
              <div className="flex gap-2">
                <button onClick={handleTerimaLaporan} disabled={actionLoading} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-60 transition-colors">
                  <CheckCircle className="w-4 h-4" /> Terima Laporan Kegiatan
                </button>
                <button onClick={() => setModal({ open: true, action: "revisi" })} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-orange-600 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors">
                  <RotateCcw className="w-4 h-4" /> Minta Revisi Laporan
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── Tab: Histories ─── */}
      {activeTab === "histories" && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h4 className="text-sm font-semibold text-slate-800 mb-5">Riwayat Status</h4>
          <ReviewTimeline entries={timeline} />
        </div>
      )}

      <ReviewStatusModal
        open={modal.open}
        action={modal.action}
        onClose={() => setModal((m) => ({ ...m, open: false }))}
        onConfirm={handleAction}
        loading={actionLoading}
      />
    </PageWrapper>
  );
}

