import { useState } from "react";
import { ChevronLeft, Upload, Trash2, Send, CheckCircle } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { PageWrapper } from "../components/PageWrapper";
import { ConfirmModal } from "../components/ConfirmModal";

interface ReviewScore { label: string; skor: number; maxSkor: number; color: string; }

const MOCK_SCORES: ReviewScore[] = [
  { label: "Rubrik Administrasi", skor: 42, maxSkor: 50, color: "bg-blue-500" },
  { label: "Nilai Substansi Reviewer 1", skor: 78, maxSkor: 100, color: "bg-green-500" },
  { label: "Nilai Substansi Reviewer 2", skor: 82, maxSkor: 100, color: "bg-green-500" },
  { label: "Nilai Akhir (Rata-rata)", skor: 80, maxSkor: 100, color: "bg-amber-500" },
];

const MOCK_RAB = [
  { id: "R-1", kelompok: "Personel", komponen: "Honor Peneliti", item: "Ketua", satuan: "bulan", hargaSatuan: 2000000, volume: 6, total: 12000000 },
  { id: "R-2", kelompok: "Material", komponen: "Sensor IoT", item: "Sensor Suhu", satuan: "unit", hargaSatuan: 150000, volume: 20, total: 3000000 },
];

const formatCurrency = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

function ProgressBar({ label, skor, maxSkor, color }: ReviewScore) {
  const pct = Math.round((skor / maxSkor) * 100);
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-slate-700" style={{ fontWeight: 500 }}>{label}</p>
        <span className="text-sm" style={{ fontWeight: 700 }}>{skor}/{maxSkor}</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-3">
        <div className={`${color} h-3 rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <p className="text-right text-xs text-slate-400 mt-1">{pct}%</p>
    </div>
  );
}

export function HibahPemenangPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [rab, setRab] = useState(MOCK_RAB);
  const [form, setForm] = useState({ substansiurl: "", dokumenurl: "", catatan: "" });
  const [confirmModal, setConfirmModal] = useState({ open: false, title: "", message: "", variant: "warning" as "danger" | "warning" | "success", onConfirm: () => {} });
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "" });

  const showToast = (msg: string) => { setToast({ show: true, message: msg }); setTimeout(() => setToast((p) => ({ ...p, show: false })), 3000); };
  const grandTotal = rab.reduce((s, r) => s + r.total, 0);
  const pagu = 25000000;
  const isReviewerShell = location.pathname.startsWith("/reviewer");
  const shellBase = isReviewerShell ? "/reviewer" : "/admin";
  const sectionLabel = isReviewerShell ? "Reviewer" : "Dosen";

  return (
    <PageWrapper
      title="Hasil Penilaian Proposal"
      subtitle="Ringkasan skor review dan penilaian dari reviewer"
      breadcrumbs={[{ label: sectionLabel }, { label: "Hibah", path: `${shellBase}/hibah/penelitian` }, { label: "Hasil Penilaian" }]}
      actions={<button onClick={() => navigate(-1)} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"><ChevronLeft className="w-4 h-4" /> Kembali</button>}
    >
      <div className="max-w-3xl space-y-6">
        {/* ── Section Penilaian ── */}
        <div>
          <h3 className="text-sm text-slate-900 mb-4" style={{ fontWeight: 600 }}>Penilaian Proposal</h3>
          <div className="space-y-3">
            {MOCK_SCORES.map((s) => <ProgressBar key={s.label} {...s} />)}
          </div>
        </div>

        {/* ── Section RAB ── */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm text-slate-900" style={{ fontWeight: 600 }}>RAB</h3>
            <div className="flex gap-2">
              {rab.length > 0 && (
                <button onClick={() => setConfirmModal({ open: true, title: "Hapus RAB?", message: "Seluruh data RAB akan dihapus.", variant: "danger", onConfirm: () => setRab([]) })}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100" style={{ fontWeight: 500 }}>
                  <Trash2 className="w-3.5 h-3.5" /> Hapus RAB
                </button>
              )}
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white bg-[#E30613] rounded-lg" style={{ fontWeight: 500 }}>
                <Upload className="w-3.5 h-3.5" /> Upload RAB Baru
              </button>
            </div>
          </div>
          <div className="text-sm text-slate-500 mb-3">Pagu: <strong>{formatCurrency(pagu)}</strong></div>
          <table className="w-full">
            <thead><tr className="border-b border-slate-100">
              {["Kelompok", "Item", "Satuan", "Harga Satuan", "Vol", "Total"].map((h) => <th key={h} className="px-4 py-2 text-left text-xs text-slate-500" style={{ fontWeight: 600 }}>{h}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-slate-50">
              {rab.length === 0 ? <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-400">Belum ada RAB</td></tr>
                : rab.map((r) => <tr key={r.id}><td className="px-4 py-3 text-sm text-slate-600">{r.kelompok}</td><td className="px-4 py-3 text-sm text-slate-700">{r.item}</td><td className="px-4 py-3 text-sm text-slate-600">{r.satuan}</td><td className="px-4 py-3 text-sm text-slate-600">{formatCurrency(r.hargaSatuan)}</td><td className="px-4 py-3 text-sm text-slate-600">{r.volume}</td><td className="px-4 py-3 text-sm" style={{ fontWeight: 500 }}>{formatCurrency(r.total)}</td></tr>)
              }
            </tbody>
          </table>
          {rab.length > 0 && (
            <div className={`mt-3 text-right p-3 rounded-lg border ${grandTotal > pagu ? "bg-red-50 border-red-200 text-red-700" : "bg-green-50 border-green-200 text-green-700"}`}>
              <span className="text-sm" style={{ fontWeight: 600 }}>Grand Total: {formatCurrency(grandTotal)}</span>
            </div>
          )}
        </div>

        {/* ── Form Perbaikan ── */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-sm text-slate-900 mb-5" style={{ fontWeight: 600 }}>Perbaikan Proposal Lanjutan</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 500 }}>URL Perbaikan Proposal</label>
              <input type="url" value={form.substansiurl} onChange={(e) => setForm((p) => ({ ...p, substansiurl: e.target.value }))} placeholder="https://drive.google.com/..." className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#E30613]/20" />
            </div>
            <div>
              <label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 500 }}>URL Perbaikan Dokumen</label>
              <input type="url" value={form.dokumenurl} onChange={(e) => setForm((p) => ({ ...p, dokumenurl: e.target.value }))} placeholder="https://drive.google.com/..." className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#E30613]/20" />
            </div>
            <div>
              <label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 500 }}>Catatan</label>
              <textarea value={form.catatan} onChange={(e) => setForm((p) => ({ ...p, catatan: e.target.value }))} rows={3} className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#E30613]/20 resize-y" />
            </div>
          </div>
          {!submitted ? (
            <button className="mt-4 flex items-center gap-2 px-5 py-2.5 text-sm text-white bg-[#E30613] rounded-lg hover:bg-[#c00510]" style={{ fontWeight: 500 }}
              onClick={() => setConfirmModal({ open: true, title: "Submit Revisi?", message: "Proposal perbaikan akan disubmit ke reviewer.", variant: "warning", onConfirm: () => { setSubmitted(true); showToast("Revisi berhasil disubmit!"); } })}>
              <Send className="w-4 h-4" /> Submit Revisi
            </button>
          ) : (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-700 flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Revisi berhasil disubmit!</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal {...confirmModal} isOpen={confirmModal.open} onClose={() => setConfirmModal((p) => ({ ...p, open: false }))} />
      {toast.show && <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg border bg-green-50 border-green-200 text-green-700"><CheckCircle className="w-4 h-4" /><span className="text-sm" style={{ fontWeight: 500 }}>{toast.message}</span></div>}
    </PageWrapper>
  );
}
