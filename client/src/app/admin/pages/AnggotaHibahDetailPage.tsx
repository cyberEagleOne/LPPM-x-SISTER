import { useState } from "react";
import { ChevronLeft, ExternalLink, Send, CheckCircle, XCircle } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router";
import { PageWrapper } from "../components/PageWrapper";
import { ConfirmModal } from "../components/ConfirmModal";

interface TugasKu { tugas: string; approval_status: "pending" | "disetujui" | "ditolak"; catatan: string; }

const MOCK_TUGASKU: TugasKu = { tugas: "Pengembangan model machine learning untuk prediksi data IoT sensor", approval_status: "pending", catatan: "" };
const MOCK_HIBAH_INFO = {
  judul: "Penelitian IoT untuk Smart Campus Pradita",
  ketuaNama: "Prof. Dimas Prakoso, Ph.D.",
  ketuaJabatan: "Guru Besar",
  sintaId: "654321",
  sintaUrl: "https://sinta.kemdikbud.go.id/authors/profile/654321",
  googleSkor: "250",
  googleUrl: "https://scholar.google.com/user=xyz",
  skema: "Penelitian Dasar",
  tahun: "Genap 2025/2026",
  tema: "ICT & Manufaktur",
  roadmap: "Roadmap Teknologi Digital",
  risetFakultas: "Informatika & Teknik",
  risetTema: "Rekayasa Komputasi",
  temaProdi: "Kecerdasan Buatan",
  subtema: "Machine Learning",
  targetTkt: "TKT 5",
  abstrak: "Penelitian ini mengembangkan sistem IoT terintegrasi untuk mendukung Smart Campus di Universitas Pradita...",
  substansiUrl: "https://drive.google.com/proposal",
};

const ANGGOTA_DOSEN = [{ no: 1, nidn: "0312345678", nama: "Prof. Dimas Prakoso (Ketua)", prodi: "Teknik Informatika", tugas: "Ketua Peneliti" }];
const ANGGOTA_MAHASISWA = [{ no: 1, nim: "2020123001", nama: "Ahmad Fauzi", prodi: "Teknik Informatika", tugas: "Implementasi sensor" }];
const LUARAN = [{ no: 1, kategori: "jurnal", judul: "IoT-Based Smart Campus", namaJurnal: "Journal of IoT Research", url: "https://doi.org/example" }];
const RAB = [{ no: 1, item: "Honor Ketua", total: 12000000 }, { no: 2, item: "Sensor IoT", total: 3000000 }];
const formatCurrency = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return <div><p className="text-xs text-slate-400">{label}</p><p className="text-sm text-slate-800 mt-0.5" style={{ fontWeight: 500 }}>{value}</p></div>;
}

export function AnggotaHibahDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [tugasku] = useState<TugasKu>(MOCK_TUGASKU);
  const [response, setResponse] = useState({ pilihan: "", catatan: "" });
  const [submitted, setSubmitted] = useState(tugasku.approval_status !== "pending");
  const [confirmModal, setConfirmModal] = useState({ open: false, title: "", message: "", variant: "warning" as "danger" | "warning" | "success", onConfirm: () => {} });
  const [toast, setToast] = useState({ show: false, message: "", type: "success" as "success" | "error" });
  const isReviewerShell = location.pathname.startsWith("/reviewer");
  const shellBase = isReviewerShell ? "/reviewer" : "/admin";
  const sectionLabel = isReviewerShell ? "Reviewer" : "Dosen";

  const showToast = (msg: string, type: "success" | "error" = "success") => { setToast({ show: true, message: msg, type }); setTimeout(() => setToast((p) => ({ ...p, show: false })), 3000); };

  const handleSubmit = () => {
    setConfirmModal({
      open: true,
      title: response.pilihan === "terima" ? "Terima Undangan?" : "Tolak Undangan?",
      message: response.pilihan === "terima" ? "Anda akan bergabung sebagai anggota dalam hibah ini." : "Anda yakin ingin menolak undangan ini?",
      variant: response.pilihan === "terima" ? "success" as "success" : "danger" as "danger",
      onConfirm: () => { setSubmitted(true); showToast(response.pilihan === "terima" ? "Undangan berhasil diterima!" : "Undangan ditolak.", response.pilihan === "terima" ? "success" : "error"); },
    });
  };

  return (
    <PageWrapper
      title="Detail Undangan Anggota Hibah"
      breadcrumbs={[{ label: sectionLabel }, { label: "Hibah" }, { label: "Anggota", path: `${shellBase}/hibah/anggota` }, { label: id || "Detail" }]}
      actions={<button onClick={() => navigate(-1)} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"><ChevronLeft className="w-4 h-4" /> Kembali</button>}
    >
      <div className="max-w-4xl space-y-6">
        {/* ── Profil Ketua ── */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-sm text-slate-900 mb-4" style={{ fontWeight: 600 }}>Profil Ketua Hibah</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <InfoRow label="Nama" value={MOCK_HIBAH_INFO.ketuaNama} />
            <InfoRow label="Jabatan" value={MOCK_HIBAH_INFO.ketuaJabatan} />
            <InfoRow label="Profil Sinta" value={<a href={MOCK_HIBAH_INFO.sintaUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">{MOCK_HIBAH_INFO.sintaId} <ExternalLink className="w-3 h-3" /></a>} />
            <InfoRow label="Google Scholar" value={<a href={MOCK_HIBAH_INFO.googleUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">h: {MOCK_HIBAH_INFO.googleSkor} <ExternalLink className="w-3 h-3" /></a>} />
          </div>
        </div>

        {/* ── Info Hibah ── */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-sm text-slate-900 mb-4" style={{ fontWeight: 600 }}>Informasi Hibah</h3>
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-4">
            {[
              { l: "Judul", v: MOCK_HIBAH_INFO.judul },
              { l: "Skema", v: MOCK_HIBAH_INFO.skema },
              { l: "Tahun Ajuan", v: MOCK_HIBAH_INFO.tahun },
              { l: "Tema", v: MOCK_HIBAH_INFO.tema },
              { l: "Roadmap Universitas", v: MOCK_HIBAH_INFO.roadmap },
              { l: "Riset Fakultas", v: MOCK_HIBAH_INFO.risetFakultas },
              { l: "Target TKT", v: MOCK_HIBAH_INFO.targetTkt },
            ].map((f) => <InfoRow key={f.l} label={f.l} value={f.v} />)}
          </div>
          <div><p className="text-xs text-slate-400 mb-1">Abstrak</p><p className="text-sm text-slate-700 leading-relaxed">{MOCK_HIBAH_INFO.abstrak}</p></div>
          <div className="mt-3"><p className="text-xs text-slate-400 mb-1">Proposal</p><a href={MOCK_HIBAH_INFO.substansiUrl} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline flex items-center gap-1 w-fit">Lihat Proposal <ExternalLink className="w-3 h-3" /></a></div>
        </div>

        {/* ── Tabel Anggota Dosen ── */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-sm text-slate-900 mb-4" style={{ fontWeight: 600 }}>Tim Dosen</h3>
          <table className="w-full"><thead><tr className="border-b border-slate-100">{["No", "NIDN", "Nama", "Prodi", "Tugas"].map((h) => <th key={h} className="px-4 py-2 text-left text-xs text-slate-500" style={{ fontWeight: 600 }}>{h}</th>)}</tr></thead>
            <tbody>{ANGGOTA_DOSEN.map((a) => <tr key={a.no} className="border-b border-slate-50"><td className="px-4 py-3 text-sm text-slate-500">{a.no}</td><td className="px-4 py-3 text-sm text-slate-600">{a.nidn}</td><td className="px-4 py-3 text-sm text-slate-700">{a.nama}</td><td className="px-4 py-3 text-sm text-slate-600">{a.prodi}</td><td className="px-4 py-3 text-sm text-slate-600">{a.tugas}</td></tr>)}</tbody>
          </table>
        </div>

        {/* ── Tabel Mahasiswa ── */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-sm text-slate-900 mb-4" style={{ fontWeight: 600 }}>Anggota Mahasiswa</h3>
          <table className="w-full"><thead><tr className="border-b border-slate-100">{["No", "NIM", "Nama", "Prodi", "Tugas"].map((h) => <th key={h} className="px-4 py-2 text-left text-xs text-slate-500" style={{ fontWeight: 600 }}>{h}</th>)}</tr></thead>
            <tbody>{ANGGOTA_MAHASISWA.map((m) => <tr key={m.no} className="border-b border-slate-50"><td className="px-4 py-3 text-sm text-slate-500">{m.no}</td><td className="px-4 py-3 text-sm text-slate-600">{m.nim}</td><td className="px-4 py-3 text-sm text-slate-700">{m.nama}</td><td className="px-4 py-3 text-sm text-slate-600">{m.prodi}</td><td className="px-4 py-3 text-sm text-slate-600">{m.tugas}</td></tr>)}</tbody>
          </table>
        </div>

        {/* ── Tabel Luaran ── */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-sm text-slate-900 mb-4" style={{ fontWeight: 600 }}>Luaran</h3>
          <table className="w-full"><thead><tr className="border-b border-slate-100">{["No", "Kategori", "Judul", "Nama Jurnal", "URL"].map((h) => <th key={h} className="px-4 py-2 text-left text-xs text-slate-500" style={{ fontWeight: 600 }}>{h}</th>)}</tr></thead>
            <tbody>{LUARAN.map((l) => <tr key={l.no} className="border-b border-slate-50"><td className="px-4 py-3 text-sm text-slate-500">{l.no}</td><td className="px-4 py-3 text-sm text-slate-600 capitalize">{l.kategori}</td><td className="px-4 py-3 text-sm text-slate-700">{l.judul}</td><td className="px-4 py-3 text-sm text-slate-600">{l.namaJurnal}</td><td className="px-4 py-3"><a href={l.url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline">Lihat</a></td></tr>)}</tbody>
          </table>
        </div>

        {/* ── RAB ── */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-sm text-slate-900 mb-4" style={{ fontWeight: 600 }}>RAB</h3>
          <table className="w-full"><thead><tr className="border-b border-slate-100">{["No", "Item", "Total"].map((h) => <th key={h} className="px-4 py-2 text-left text-xs text-slate-500" style={{ fontWeight: 600 }}>{h}</th>)}</tr></thead>
            <tbody>{RAB.map((r) => <tr key={r.no} className="border-b border-slate-50"><td className="px-4 py-3 text-sm text-slate-500">{r.no}</td><td className="px-4 py-3 text-sm text-slate-700">{r.item}</td><td className="px-4 py-3 text-sm text-slate-700">{formatCurrency(r.total)}</td></tr>)}</tbody>
          </table>
        </div>

        {/* ── Form Response ── */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-sm text-slate-900 mb-5" style={{ fontWeight: 600 }}>Response Undangan</h3>
          {submitted ? (
            <div className={`flex items-center gap-3 p-4 rounded-xl border ${tugasku.approval_status === "disetujui" || response.pilihan === "terima" ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"}`}>
              {tugasku.approval_status === "disetujui" || response.pilihan === "terima" ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
              <p className="text-sm" style={{ fontWeight: 500 }}>{tugasku.approval_status === "disetujui" || response.pilihan === "terima" ? "Anda telah menerima undangan ini." : "Anda telah menolak undangan ini."}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 500 }}>Tugas Anda</label>
                <input type="text" value={tugasku.tugas} readOnly className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-100 text-slate-600" />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 500 }}>Pilih Response <span className="text-red-500">*</span></label>
                <select value={response.pilihan} onChange={(e) => setResponse((p) => ({ ...p, pilihan: e.target.value }))} disabled={submitted} className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#E30613]/20">
                  <option value="">Pilih respons...</option>
                  <option value="terima">✅ Terima Undangan</option>
                  <option value="tolak">❌ Tolak Undangan</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 500 }}>Catatan Response (opsional)</label>
                <textarea value={response.catatan} onChange={(e) => setResponse((p) => ({ ...p, catatan: e.target.value }))} rows={3} placeholder="Catatan tambahan..." className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#E30613]/20 resize-none" />
              </div>
              <button onClick={handleSubmit} disabled={!response.pilihan} className="flex items-center gap-2 px-5 py-2.5 text-sm text-white bg-[#E30613] rounded-lg hover:bg-[#c00510] disabled:opacity-50" style={{ fontWeight: 500 }}>
                <Send className="w-4 h-4" /> Kirim Response
              </button>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal {...confirmModal} isOpen={confirmModal.open} onClose={() => setConfirmModal((p) => ({ ...p, open: false }))} />
      {toast.show && <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg border ${toast.type === "success" ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"}`}><CheckCircle className="w-4 h-4" /><span className="text-sm" style={{ fontWeight: 500 }}>{toast.message}</span></div>}
    </PageWrapper>
  );
}
