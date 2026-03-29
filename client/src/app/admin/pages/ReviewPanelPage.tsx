import { useState } from "react";
import { ChevronLeft, Eye, EyeOff, Star, Send, AlertTriangle, CheckCircle, XCircle, FileText, DollarSign, MessageSquare, Clock, User } from "lucide-react";
import { PageWrapper } from "../components/PageWrapper";
import { StatusBadge } from "../components/StatusBadge";
import { useAuth } from "../context/AuthContext";
import { roleMatchesAny } from "../config/roleTemplates";
import { ConfirmModal } from "../components/ConfirmModal";

interface ReviewProposal {
  id: string;
  judul: string;
  pengusul: string;
  skema: string;
  cluster: string;
  dana: number;
  status: "submitted" | "pending-review";
  tanggal: string;
  abstrak: string;
}

const PROPOSALS_TO_REVIEW: ReviewProposal[] = [
  { id: "HIB-005", judul: "Pengabdian Masyarakat Desa Digital", pengusul: "Dr. Fajar Nugroho", skema: "Pengabdian", cluster: "ICT & Digital Innovation", dana: 15000000, status: "submitted", tanggal: "2026-02-12", abstrak: "Penelitian ini bertujuan mengembangkan model desa digital terpadu yang menggabungkan teknologi IoT, machine learning, dan platform mobile untuk meningkatkan kualitas hidup masyarakat pedesaan. Fokus utama pada sistem pertanian presisi, layanan kesehatan jarak jauh, dan pendidikan digital." },
  { id: "HIB-001", judul: "Penelitian IoT untuk Smart Campus Pradita", pengusul: "Dr. Arif Ramadhan, M.Sc.", skema: "Penelitian Dasar", cluster: "Green Technology", dana: 25000000, status: "pending-review", tanggal: "2026-02-20", abstrak: "Mengembangkan framework IoT komprehensif untuk smart campus yang mencakup monitoring energi, manajemen ruangan pintar, dan sistem keamanan berbasis sensor. Implementasi menggunakan arsitektur edge computing dan protokol MQTT untuk komunikasi real-time." },
];

interface ScoreCategory {
  key: string;
  label: string;
  maxScore: number;
  score: number;
}

export function ReviewPanelPage({ onBack }: { onBack: () => void }) {
  const { user } = useAuth();
  const [selectedProposal, setSelectedProposal] = useState<ReviewProposal>(PROPOSALS_TO_REVIEW[0]);
  const [blindMode, setBlindMode] = useState(true);
  const [activeTab, setActiveTab] = useState<"proposal" | "rab">("proposal");
  const [reviewComment, setReviewComment] = useState("");
  const [scores, setScores] = useState<ScoreCategory[]>([
    { key: "novelty", label: "Novelty & Originalitas", maxScore: 25, score: 0 },
    { key: "methodology", label: "Metodologi Penelitian", maxScore: 25, score: 0 },
    { key: "impact", label: "Dampak & Kontribusi", maxScore: 20, score: 0 },
    { key: "feasibility", label: "Kelayakan & Timeline", maxScore: 15, score: 0 },
    { key: "budget", label: "Rasionalitas Anggaran", maxScore: 15, score: 0 },
  ]);
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; title: string; message: string; variant: "danger" | "warning" | "success"; onConfirm: () => void }>({
    isOpen: false, title: "", message: "", variant: "success", onConfirm: () => {}
  });

  const isFinance = roleMatchesAny(user?.role, ["finance"]);
  const totalScore = scores.reduce((sum, s) => sum + s.score, 0);
  const maxTotalScore = scores.reduce((sum, s) => sum + s.maxScore, 0);
  const formatCurrency = (val: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val);

  const updateScore = (key: string, value: number) => {
    setScores(prev => prev.map(s => s.key === key ? { ...s, score: Math.min(value, s.maxScore) } : s));
  };

  const RAB_ITEMS = [
    { komponen: "Bahan Habis Pakai", total: 5000000, flag: false },
    { komponen: "Perjalanan Dinas (3x)", total: 6000000, flag: false },
    { komponen: "Sewa Peralatan Lab", total: 4000000, flag: true },
    { komponen: "Publikasi & Diseminasi", total: 3000000, flag: false },
    { komponen: "Honorarium Narasumber", total: 2000000, flag: true },
  ];

  return (
    <PageWrapper
      title="Review Panel"
      subtitle="Blind review proposals"
      breadcrumbs={[{ label: "Pengajuan" }, { label: "Hibah Internal", path: "/admin/hibah" }, { label: "Review Panel" }]}
      actions={
        <div className="flex items-center gap-2">
          <button onClick={() => setBlindMode(!blindMode)}
            className={`flex items-center gap-2 px-3 py-2 text-xs rounded-lg border transition-colors ${blindMode ? "bg-slate-800 text-white border-slate-800" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}
            style={{ fontWeight: 500 }}>
            {blindMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {blindMode ? "Blind Mode" : "Normal Mode"}
          </button>
          <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Kembali
          </button>
        </div>
      }
    >
      {/* Proposal selector */}
      <div className="flex gap-3 overflow-x-auto pb-1">
        {PROPOSALS_TO_REVIEW.map(p => (
          <button key={p.id} onClick={() => setSelectedProposal(p)}
            className={`flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
              selectedProposal.id === p.id ? "border-[#E30613] bg-red-50/50 shadow-sm" : "border-slate-200 bg-white hover:border-slate-300"
            }`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs ${
              selectedProposal.id === p.id ? "bg-[#E30613] text-white" : "bg-slate-100 text-slate-500"
            }`} style={{ fontWeight: 600 }}>{p.id.split("-")[1]}</div>
            <div className="text-left">
              <p className="text-sm text-slate-800 truncate max-w-[200px]" style={{ fontWeight: 500 }}>{p.judul}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <StatusBadge status={p.status} />
                {!blindMode && <span className="text-xs text-slate-400">{p.pengusul}</span>}
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Proposal Document Viewer */}
        <div className="lg:col-span-3 space-y-4">
          {/* Tabs */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="flex border-b border-slate-100">
              <button onClick={() => setActiveTab("proposal")}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm transition-colors ${activeTab === "proposal" ? "text-[#E30613] border-b-2 border-[#E30613] bg-red-50/30" : "text-slate-500 hover:text-slate-700"}`}
                style={{ fontWeight: activeTab === "proposal" ? 600 : 400 }}>
                <FileText className="w-4 h-4" /> Proposal
              </button>
              <button onClick={() => setActiveTab("rab")}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm transition-colors ${activeTab === "rab" ? "text-[#E30613] border-b-2 border-[#E30613] bg-red-50/30" : "text-slate-500 hover:text-slate-700"}`}
                style={{ fontWeight: activeTab === "rab" ? 600 : 400 }}>
                <DollarSign className="w-4 h-4" /> RAB
              </button>
            </div>

            {activeTab === "proposal" ? (
              <div className="p-6 space-y-5">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-1" style={{ fontWeight: 600 }}>ID Proposal</p>
                  <p className="text-sm text-slate-800" style={{ fontWeight: 500 }}>{selectedProposal.id}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-1" style={{ fontWeight: 600 }}>Judul</p>
                  <p className="text-slate-900" style={{ fontWeight: 600 }}>{selectedProposal.judul}</p>
                </div>
                {!blindMode && (
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs" style={{ fontWeight: 600 }}>
                      {selectedProposal.pengusul.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm text-slate-800" style={{ fontWeight: 500 }}>{selectedProposal.pengusul}</p>
                      <p className="text-xs text-slate-400">Ketua Peneliti</p>
                    </div>
                  </div>
                )}
                {blindMode && (
                  <div className="flex items-center gap-3 p-3 bg-slate-100 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center text-white">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 italic" style={{ fontWeight: 500 }}>Identitas disembunyikan (Blind Review)</p>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-400 mb-1" style={{ fontWeight: 500 }}>Skema</p>
                    <p className="text-sm text-slate-800" style={{ fontWeight: 500 }}>{selectedProposal.skema}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1" style={{ fontWeight: 500 }}>Kluster</p>
                    <p className="text-sm text-slate-800" style={{ fontWeight: 500 }}>{selectedProposal.cluster}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1" style={{ fontWeight: 500 }}>Dana Diajukan</p>
                    <p className="text-sm text-slate-800" style={{ fontWeight: 500 }}>{formatCurrency(selectedProposal.dana)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1" style={{ fontWeight: 500 }}>Tanggal Submit</p>
                    <p className="text-sm text-slate-800" style={{ fontWeight: 500 }}>{selectedProposal.tanggal}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-2" style={{ fontWeight: 600 }}>Abstrak</p>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="text-sm text-slate-700 leading-relaxed">{selectedProposal.abstrak}</p>
                  </div>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                  <p className="text-xs text-blue-600 mb-2" style={{ fontWeight: 600 }}>Dokumen Lampiran</p>
                  <div className="space-y-1.5">
                    {["Proposal Lengkap.pdf", "CV Peneliti.pdf", "Surat Pernyataan.pdf"].map(f => (
                      <div key={f} className="flex items-center gap-2 text-sm text-blue-700 cursor-pointer hover:underline">
                        <FileText className="w-3.5 h-3.5" /> {blindMode && f === "CV Peneliti.pdf" ? "CV Peneliti (redacted).pdf" : f}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 space-y-5">
                <h4 className="text-sm text-slate-800" style={{ fontWeight: 600 }}>Breakdown RAB</h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-100">
                        {["Komponen", "Total", "Flag"].map(h => (
                          <th key={h} className="px-3 py-2 text-left text-xs text-slate-500" style={{ fontWeight: 600 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {RAB_ITEMS.map((item, i) => (
                        <tr key={i} className={item.flag ? "bg-amber-50/50" : ""}>
                          <td className="px-3 py-2.5 text-sm text-slate-700">{item.komponen}</td>
                          <td className="px-3 py-2.5 text-sm text-slate-800" style={{ fontWeight: 500 }}>{formatCurrency(item.total)}</td>
                          <td className="px-3 py-2.5">
                            {item.flag && (
                              <span className="inline-flex items-center gap-1 text-xs text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full" style={{ fontWeight: 500 }}>
                                <AlertTriangle className="w-3 h-3" /> Perlu Cek
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-slate-200">
                        <td className="px-3 py-3 text-sm text-slate-800" style={{ fontWeight: 600 }}>Total</td>
                        <td className="px-3 py-3 text-sm text-[#E30613]" style={{ fontWeight: 700 }}>
                          {formatCurrency(RAB_ITEMS.reduce((s, i) => s + i.total, 0))}
                        </td>
                        <td />
                      </tr>
                    </tfoot>
                  </table>
                </div>
                {isFinance && (
                  <div className="p-3 bg-cyan-50 border border-cyan-100 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-4 h-4 text-cyan-600" />
                      <p className="text-sm text-cyan-800" style={{ fontWeight: 600 }}>Catatan Validasi Finance</p>
                    </div>
                    <textarea rows={2} placeholder="Tulis catatan validasi anggaran..."
                      className="w-full px-3 py-2 text-sm border border-cyan-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-300 bg-white placeholder:text-slate-400 resize-none" />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Review Scoring Form */}
        <div className="lg:col-span-2 space-y-4">
          {/* Scoring */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500" />
                <h4 className="text-sm text-slate-800" style={{ fontWeight: 600 }}>Penilaian</h4>
              </div>
              <span className={`text-sm px-3 py-1 rounded-full ${
                totalScore >= 70 ? "bg-green-50 text-green-700" : totalScore >= 50 ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600"
              }`} style={{ fontWeight: 700 }}>
                {totalScore}/{maxTotalScore}
              </span>
            </div>
            <div className="space-y-4">
              {scores.map(cat => (
                <div key={cat.key}>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs text-slate-600" style={{ fontWeight: 500 }}>{cat.label}</label>
                    <span className="text-xs text-slate-400">max {cat.maxScore}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={0} max={cat.maxScore} value={cat.score}
                      onChange={e => updateScore(cat.key, Number(e.target.value))}
                      className="flex-1 h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-[#E30613]"
                    />
                    <input
                      type="number"
                      min={0} max={cat.maxScore} value={cat.score}
                      onChange={e => updateScore(cat.key, Number(e.target.value))}
                      className="w-14 px-2 py-1 text-sm text-center border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#E30613]/30"
                    />
                  </div>
                </div>
              ))}
            </div>
            {/* Score bar */}
            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${totalScore >= 70 ? "bg-green-500" : totalScore >= 50 ? "bg-amber-500" : "bg-slate-400"}`}
                  style={{ width: `${(totalScore / maxTotalScore) * 100}%` }} />
              </div>
              <p className="text-xs text-slate-400 mt-1.5 text-center">
                {totalScore >= 70 ? "Layak didanai" : totalScore >= 50 ? "Perlu revisi" : "Belum cukup skor"}
              </p>
            </div>
          </div>

          {/* Comment */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-4 h-4 text-slate-600" />
              <h4 className="text-sm text-slate-800" style={{ fontWeight: 600 }}>Komentar Review</h4>
            </div>
            <textarea
              value={reviewComment}
              onChange={e => setReviewComment(e.target.value)}
              rows={4}
              placeholder="Tulis komentar review Anda... (wajib untuk revisi/tolak)"
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613]/40 bg-slate-50/50 placeholder:text-slate-400 resize-none"
            />
            <p className="text-[11px] text-slate-400 mt-1">Catatan wajib diisi jika meminta revisi atau menolak proposal.</p>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-2">
            <h4 className="text-sm text-slate-800 mb-3" style={{ fontWeight: 600 }}>Keputusan</h4>
            <button
              onClick={() => setConfirmModal({ isOpen: true, title: "Approve Proposal?", message: `Proposal ${selectedProposal.id} akan disetujui dengan skor ${totalScore}/${maxTotalScore}.`, variant: "success", onConfirm: onBack })}
              disabled={totalScore === 0}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-40"
              style={{ fontWeight: 500 }}
            >
              <CheckCircle className="w-4 h-4" /> Approve
            </button>
            <button
              onClick={() => setConfirmModal({ isOpen: true, title: "Minta Revisi?", message: "Proposal akan dikembalikan ke pengusul untuk direvisi.", variant: "warning", onConfirm: onBack })}
              disabled={!reviewComment}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors disabled:opacity-40"
              style={{ fontWeight: 500 }}
            >
              <AlertTriangle className="w-4 h-4" /> Minta Revisi
            </button>
            <button
              onClick={() => setConfirmModal({ isOpen: true, title: "Tolak Proposal?", message: "Proposal akan ditolak dan tidak dapat diproses lagi.", variant: "danger", onConfirm: onBack })}
              disabled={!reviewComment}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-40"
              style={{ fontWeight: 500 }}
            >
              <XCircle className="w-4 h-4" /> Tolak
            </button>
          </div>

          {/* Review History */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-slate-500" />
              <h4 className="text-sm text-slate-800" style={{ fontWeight: 600 }}>Riwayat Review</h4>
            </div>
            <div className="space-y-3">
              {[
                { reviewer: blindMode ? "Reviewer 1" : "Prof. Dimas Prakoso", date: "2026-02-25", score: 72, verdict: "Approve" },
                { reviewer: blindMode ? "Admin LPPM" : "Staff LPPM", date: "2026-02-24", score: null, verdict: "Checked" },
              ].map((h, i) => (
                <div key={i} className="flex items-start gap-3 p-2.5 bg-slate-50 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] text-slate-600 shrink-0 mt-0.5" style={{ fontWeight: 600 }}>
                    {h.reviewer.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs text-slate-700" style={{ fontWeight: 500 }}>{h.reviewer}</p>
                    <p className="text-[11px] text-slate-400">{h.date} &middot; {h.verdict}{h.score ? ` (${h.score}/100)` : ""}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(p => ({ ...p, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        variant={confirmModal.variant}
      />
    </PageWrapper>
  );
}
