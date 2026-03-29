import { useState } from "react";
import { ChevronLeft, Upload, Trash2, Send, AlertTriangle, CheckCircle } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { PageWrapper } from "../components/PageWrapper";
import { ConfirmModal } from "../components/ConfirmModal";

interface RabItem { id: string; kelompok: string; komponen: string; item: string; satuan: string; hargaSatuan: number; volume: number; total: number; }

const MOCK_RAB: RabItem[] = [
  { id: "R-1", kelompok: "Personel", komponen: "Honor Peneliti", item: "Ketua", satuan: "bulan", hargaSatuan: 2000000, volume: 6, total: 12000000 },
  { id: "R-2", kelompok: "Material", komponen: "Sensor IoT", item: "Sensor Suhu", satuan: "unit", hargaSatuan: 150000, volume: 20, total: 3000000 },
];
const MOCK_CATATAN = "<p>Mohon revisi pada bagian metodologi penelitian. Pendekatan yang diusulkan perlu diperkuat dengan referensi terbaru (5 tahun terakhir). Selain itu, target TKT yang dipilih perlu disesuaikan dengan output penelitian.</p><p>RAB juga perlu direvisi — komponen peralatan melebihi batas yang diizinkan dalam skema ini.</p>";
const formatCurrency = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

export function HibahRevisiPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ substansiurl: "https://drive.google.com/revisi-proposal", dokumenurl: "https://drive.google.com/revisi-dokumen", catatan: "Telah diperbaiki sesuai catatan reviewer" });
  const [rab, setRab] = useState<RabItem[]>(MOCK_RAB);
  const [confirmModal, setConfirmModal] = useState({ open: false, title: "", message: "", variant: "danger" as "danger" | "warning" | "success", onConfirm: () => {} });
  const [toast, setToast] = useState({ show: false, message: "" });
  const [submitted, setSubmitted] = useState(false);
  const isRevisi = true; // In real app: check from API

  const showToast = (msg: string) => { setToast({ show: true, message: msg }); setTimeout(() => setToast((p) => ({ ...p, show: false })), 3000); };
  const grandTotal = rab.reduce((s, r) => s + r.total, 0);
  const pagu = 25000000;
  const isReviewerShell = location.pathname.startsWith("/reviewer");
  const shellBase = isReviewerShell ? "/reviewer" : "/admin";
  const sectionLabel = isReviewerShell ? "Reviewer" : "Dosen";

  return (
    <PageWrapper
      title="Revisi Proposal Hibah"
      breadcrumbs={[{ label: sectionLabel }, { label: "Hibah", path: `${shellBase}/hibah/penelitian` }, { label: "Revisi" }]}
      actions={<button onClick={() => navigate(-1)} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"><ChevronLeft className="w-4 h-4" /> Kembali</button>}
    >
      <div className="max-w-3xl space-y-6">
        {/* Catatan Revisi */}
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h3 className="text-sm text-amber-800" style={{ fontWeight: 600 }}>Catatan Revisi dari Reviewer</h3>
          </div>
          <div className="text-sm text-amber-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: MOCK_CATATAN }} />
        </div>

        {/* RAB Section */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm text-slate-900" style={{ fontWeight: 600 }}>RAB (Rancangan Anggaran Biaya)</h3>
            <div className="flex gap-2">
              {rab.length > 0 && (
                <button onClick={() => setConfirmModal({ open: true, title: "Hapus RAB?", message: "Seluruh data RAB akan dihapus.", variant: "danger", onConfirm: () => setRab([]) })}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100" style={{ fontWeight: 500 }}>
                  <Trash2 className="w-3.5 h-3.5" /> Hapus RAB
                </button>
              )}
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white bg-[#E30613] rounded-lg hover:bg-[#c00510]" style={{ fontWeight: 500 }}>
                <Upload className="w-3.5 h-3.5" /> Upload RAB Baru
              </button>
            </div>
          </div>
          <div className="text-sm text-slate-500 mb-3">Pagu Skema: <span style={{ fontWeight: 600 }} className="text-slate-700">{formatCurrency(pagu)}</span></div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-slate-100"><th className="px-4 py-2.5 text-left text-xs text-slate-500 whitespace-nowrap" style={{ fontWeight: 600 }}>Kelompok</th><th className="px-4 py-2.5 text-left text-xs text-slate-500" style={{ fontWeight: 600 }}>Item</th><th className="px-4 py-2.5 text-left text-xs text-slate-500" style={{ fontWeight: 600 }}>Satuan</th><th className="px-4 py-2.5 text-right text-xs text-slate-500" style={{ fontWeight: 600 }}>Harga Satuan</th><th className="px-4 py-2.5 text-center text-xs text-slate-500" style={{ fontWeight: 600 }}>Vol</th><th className="px-4 py-2.5 text-right text-xs text-slate-500" style={{ fontWeight: 600 }}>Total</th></tr></thead>
              <tbody className="divide-y divide-slate-50">
                {rab.length === 0
                  ? <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-400">RAB belum diupload</td></tr>
                  : rab.map((r) => <tr key={r.id} className="hover:bg-slate-50/50"><td className="px-4 py-3 text-sm text-slate-600">{r.kelompok}</td><td className="px-4 py-3 text-sm text-slate-700">{r.item}</td><td className="px-4 py-3 text-sm text-slate-600">{r.satuan}</td><td className="px-4 py-3 text-sm text-slate-600 text-right">{formatCurrency(r.hargaSatuan)}</td><td className="px-4 py-3 text-sm text-slate-600 text-center">{r.volume}</td><td className="px-4 py-3 text-sm text-slate-700 text-right" style={{ fontWeight: 500 }}>{formatCurrency(r.total)}</td></tr>)
                }
              </tbody>
            </table>
          </div>
          {rab.length > 0 && (
            <div className={`mt-3 text-right p-3 rounded-lg border ${grandTotal > pagu ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"}`}>
              <span className="text-sm" style={{ fontWeight: 600 }}>Grand Total: <span className={grandTotal > pagu ? "text-red-600" : "text-green-700"}>{formatCurrency(grandTotal)}</span></span>
              {grandTotal > pagu && <span className="ml-2 text-xs text-red-500">(Melebihi pagu!)</span>}
            </div>
          )}
        </div>

        {/* Form Revisi */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-sm text-slate-900 mb-5" style={{ fontWeight: 600 }}>Perbaikan Proposal</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 500 }}>URL Perbaikan Proposal</label>
              <input type="url" value={form.substansiurl} onChange={(e) => setForm((p) => ({ ...p, substansiurl: e.target.value }))} readOnly={!isRevisi} placeholder="https://drive.google.com/..." className={`w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 ${!isRevisi ? "bg-slate-100 text-slate-500 border-slate-200" : "bg-slate-50 border-slate-200 focus:ring-[#E30613]/20"}`} />
            </div>
            <div>
              <label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 500 }}>URL Perbaikan Dokumen</label>
              <input type="url" value={form.dokumenurl} onChange={(e) => setForm((p) => ({ ...p, dokumenurl: e.target.value }))} readOnly={!isRevisi} placeholder="https://drive.google.com/..." className={`w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 ${!isRevisi ? "bg-slate-100 text-slate-500 border-slate-200" : "bg-slate-50 border-slate-200 focus:ring-[#E30613]/20"}`} />
            </div>
            <div>
              <label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 500 }}>Catatan Submit Revisi</label>
              <textarea value={form.catatan} onChange={(e) => setForm((p) => ({ ...p, catatan: e.target.value }))} readOnly={!isRevisi} rows={4} className={`w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 resize-y ${!isRevisi ? "bg-slate-100 text-slate-500 border-slate-200" : "bg-slate-50 border-slate-200 focus:ring-[#E30613]/20"}`} />
            </div>
          </div>
        </div>

        {/* Tombol Submit Revisi */}
        {isRevisi && !submitted && (
          <div className="flex gap-3">
            <button onClick={() => navigate(-1)} className="px-5 py-2.5 text-sm text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200" style={{ fontWeight: 500 }}>Batal</button>
            <button onClick={() => setConfirmModal({
              open: true, title: "Submit Revisi?",
              message: "Proposal revisi akan disubmit untuk direvisi ulang oleh reviewer.",
              variant: "warning",
              onConfirm: () => { setSubmitted(true); showToast("Revisi berhasil disubmit!"); }
            })} className="flex items-center gap-2 px-5 py-2.5 text-sm text-white bg-[#E30613] rounded-lg hover:bg-[#c00510]" style={{ fontWeight: 500 }}>
              <Send className="w-4 h-4" /> Submit Revisi
            </button>
          </div>
        )}
        {submitted && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="text-sm text-green-700 flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Revisi berhasil disubmit! Status diubah menjadi <strong>Submit Revisi</strong>.</p>
          </div>
        )}
      </div>

      <ConfirmModal {...confirmModal} isOpen={confirmModal.open} onClose={() => setConfirmModal((p) => ({ ...p, open: false }))} />
      {toast.show && <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg border bg-green-50 border-green-200 text-green-700"><CheckCircle className="w-4 h-4" /><span className="text-sm" style={{ fontWeight: 500 }}>{toast.message}</span></div>}
    </PageWrapper>
  );
}
