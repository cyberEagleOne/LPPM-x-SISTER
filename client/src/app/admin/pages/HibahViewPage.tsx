import { useState, useEffect } from "react";
import {
  ChevronLeft, Plus, Trash2, Edit, Upload, Download, Send,
  CheckCircle, X, ExternalLink, AlertTriangle, FileText, Users,
  BookOpen, Link2, BarChart2, Clock, User
} from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router";
import { PageWrapper } from "../components/PageWrapper";
import { StatusBadge, type StatusType } from "../components/StatusBadge";
import { ConfirmModal } from "../components/ConfirmModal";
import { StepperStatus } from "../components/StepperStatus";

/* ────────────────── Types ────────────────── */

interface AnggotaDosen { id: string; nidn: string; nama: string; prodi: string; tugas: string; status: StatusType; }
interface AnggotaMahasiswa { id: string; nim: string; nama: string; fakultas: string; prodi: string; tugas: string; }
interface Nondosen { id: string; jenis: string; noIdentitas: string; nama: string; institusi: string; tugas: string; }
interface Luaran { id: string; kategori: string; judul: string; namaJurnal?: string; url?: string; jenisKi?: string; }
interface Integrasi { id: string; kode: string; namaMk: string; sks: string; semester: string; pertemuan: number; bentuk: string; dosenPengampu: string; prodi: string; }
interface RabItem { id: string; kelompok: string; komponen: string; item: string; satuan: string; hargaSatuan: number; volume: number; total: number; }
interface Mitra { id: string; nama: string; institusi: string; alamat: string; surel: string; negara: string; suratKesanggupan: string; dana: number; }
interface HistoryItem { id: string; tanggal: string; namaUser: string; status: StatusType; catatan: string; }

interface HibahDetail {
  id: string;
  judul: string;
  status: StatusType;
  jenis: "penelitian" | "pengabdian";
  tahunAjuan: string;
  skema: string;
  tema: string;
  semester: string;
  roadmap: string;
  risetFakultas: string;
  risetTema: string;
  temaProdi: string;
  subtema: string;
  targetTkt: string;
  abstrak: string;
  substansiUrl: string;
  dokumenUrl: string;
  luaranWajib: string;
  pagu: number;
  catatanRevisi?: string;
  bolehSubmit: boolean;
  ketuaNama: string;
  ketuaNidn: string;
  ketuaSintaId: string;
  ketuaSintaUrl: string;
  ketuaGoogleSkor: string;
  ketuaGoogleUrl: string;
  ketuaJabatan: string;
  anggotaDosen: AnggotaDosen[];
  anggotaMahasiswa: AnggotaMahasiswa[];
  nondosen: Nondosen[];
  luaran: Luaran[];
  integrasi: Integrasi[];
  rab: RabItem[];
  mitra: Mitra[];
  histories: HistoryItem[];
}

/* ────────────────── Mock Data ────────────────── */

const MOCK_DETAIL: HibahDetail = {
  id: "HIB-001",
  judul: "Penelitian IoT untuk Smart Campus Pradita",
  status: "draft",
  jenis: "penelitian",
  tahunAjuan: "Genap 2025/2026",
  skema: "Penelitian Dasar",
  tema: "ICT & Manufaktur",
  semester: "Genap",
  roadmap: "Roadmap Teknologi Digital",
  risetFakultas: "Informatika & Teknik",
  risetTema: "Rekayasa Komputasi",
  temaProdi: "Kecerdasan Buatan",
  subtema: "Machine Learning",
  targetTkt: "TKT 3",
  abstrak: "Penelitian ini bertujuan mengembangkan sistem IoT terintegrasi untuk mendukung Smart Campus Pradita...",
  substansiUrl: "https://drive.google.com/proposal-iot",
  dokumenUrl: "https://drive.google.com/dokumen-iot",
  luaranWajib: "1 Artikel Terindeks Sinta 2",
  pagu: 25000000,
  bolehSubmit: true,
  ketuaNama: "Dr. Arif Ramadhan, M.Sc.",
  ketuaNidn: "0312345678",
  ketuaSintaId: "123456",
  ketuaSintaUrl: "https://sinta.kemdikbud.go.id/authors/profile/123456",
  ketuaGoogleSkor: "150",
  ketuaGoogleUrl: "https://scholar.google.com/citations?user=abc123",
  ketuaJabatan: "Lektor Kepala",
  anggotaDosen: [
    { id: "AD-1", nidn: "0312345679", nama: "Dr. Rina Wulandari", prodi: "Teknik Informatika", tugas: "Pengembangan model ML", status: "approved" },
  ],
  anggotaMahasiswa: [
    { id: "AM-1", nim: "2020123001", nama: "Ahmad Fauzi", fakultas: "FTI", prodi: "Informatika", tugas: "Implementasi sensor IoT" },
  ],
  nondosen: [],
  luaran: [
    { id: "L-1", kategori: "jurnal", judul: "IoT-Based Smart Campus Monitoring System", namaJurnal: "Journal of IoT Research", url: "https://doi.org/example", jenisKi: undefined },
  ],
  integrasi: [
    { id: "I-1", kode: "TI4023", namaMk: "Internet of Things", sks: "3", semester: "Genap 2025/2026", pertemuan: 8, bentuk: "Proyek berbasis riset", dosenPengampu: "Dr. Arif Ramadhan", prodi: "Teknik Informatika" },
  ],
  rab: [
    { id: "R-1", kelompok: "Personel", komponen: "Honor Peneliti", item: "Ketua", satuan: "bulan", hargaSatuan: 2000000, volume: 6, total: 12000000 },
    { id: "R-2", kelompok: "Material", komponen: "Sensor IoT", item: "Sensor Suhu", satuan: "unit", hargaSatuan: 150000, volume: 20, total: 3000000 },
    { id: "R-3", kelompok: "Perjalanan", komponen: "Transportasi", item: "Pengambilan Data", satuan: "kali", hargaSatuan: 500000, volume: 10, total: 5000000 },
  ],
  mitra: [],
  histories: [
    { id: "H-1", tanggal: "2026-01-15", namaUser: "Dr. Arif Ramadhan", status: "draft", catatan: "Proposal dibuat" },
    { id: "H-2", tanggal: "2026-02-20", namaUser: "Dr. Arif Ramadhan", status: "submitted", catatan: "Proposal disubmit untuk review" },
  ],
};

const formatCurrency = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;
const formatDate = (d: string) => new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });

/* ────────────────── Generic Table ────────────────── */

function SectionTable({ headers, rows }: { headers: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead><tr className="border-b border-slate-100">
          {headers.map((h) => <th key={h} className="px-4 py-2.5 text-left text-xs text-slate-500 whitespace-nowrap" style={{ fontWeight: 600 }}>{h}</th>)}
        </tr></thead>
        <tbody className="divide-y divide-slate-50">
          {rows.length === 0
            ? <tr><td colSpan={headers.length} className="px-4 py-8 text-center text-sm text-slate-400">Belum ada data</td></tr>
            : rows.map((row, i) => (
              <tr key={i} className="hover:bg-slate-50/50">
                {row.map((cell, j) => <td key={j} className="px-4 py-3 text-sm text-slate-600">{cell}</td>)}
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
}

/* ────────────────── Modal: Anggota Dosen ────────────────── */

function ModalAnggotaDosen({ onClose, onSave }: { onClose: () => void; onSave: (data: Partial<AnggotaDosen>) => void }) {
  const [nama, setNama] = useState("");
  const [tugas, setTugas] = useState("");
  const DOSEN_OPTIONS = [
    { id: "D-1", label: "Dr. Rina Wulandari (0312345680)" },
    { id: "D-2", label: "Prof. Dimas Prakoso (0312345681)" },
    { id: "D-3", label: "Dr. Lestari Handayani (0312345682)" },
  ];
  return (
    <ModalWrapper title="Tambah Anggota Dosen" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 500 }}>Nama Dosen <span className="text-red-500">*</span></label>
          <select value={nama} onChange={(e) => setNama(e.target.value)} className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E30613]/20 bg-slate-50">
            <option value="">Pilih dosen...</option>
            {DOSEN_OPTIONS.map((d) => <option key={d.id} value={d.id}>{d.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 500 }}>Tugas <span className="text-red-500">*</span></label>
          <textarea value={tugas} onChange={(e) => setTugas(e.target.value)} rows={3} placeholder="Deskripsikan tugas anggota..." className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E30613]/20 bg-slate-50 resize-none" />
        </div>
        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="flex-1 py-2.5 text-sm text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200" style={{ fontWeight: 500 }}>Batal</button>
          <button onClick={() => { if (nama && tugas) { onSave({ id: Date.now().toString(), nama, tugas, status: "pending" as StatusType }); onClose(); } }} className="flex-1 py-2.5 text-sm text-white bg-[#E30613] rounded-lg hover:bg-[#c00510]" style={{ fontWeight: 500 }}>Simpan Anggota</button>
        </div>
      </div>
    </ModalWrapper>
  );
}

/* ────────────────── Modal: Luaran ────────────────── */

function ModalLuaran({ onClose, onSave }: { onClose: () => void; onSave: (data: Partial<Luaran>) => void }) {
  const [form, setForm] = useState({ kategori: "", judul: "", namaJurnal: "", url: "", jenisKi: "" });
  return (
    <ModalWrapper title="Tambah Luaran Hibah" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 500 }}>Jenis Luaran <span className="text-red-500">*</span></label>
          <select value={form.kategori} onChange={(e) => setForm((p) => ({ ...p, kategori: e.target.value }))} className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#E30613]/20">
            <option value="">Pilih...</option>
            <option value="jurnal">Jurnal</option>
            <option value="ki">Kekayaan Intelektual (KI)</option>
            <option value="prosiding">Prosiding</option>
            <option value="buku">Buku</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 500 }}>Judul <span className="text-red-500">*</span></label>
          <input type="text" value={form.judul} onChange={(e) => setForm((p) => ({ ...p, judul: e.target.value }))} placeholder="Judul jurnal / objek KI" className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#E30613]/20" />
        </div>
        {form.kategori === "jurnal" && (<>
          <div><label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 500 }}>Nama Jurnal</label><input type="text" value={form.namaJurnal} onChange={(e) => setForm((p) => ({ ...p, namaJurnal: e.target.value }))} className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none" /></div>
          <div><label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 500 }}>Link Jurnal</label><input type="url" value={form.url} onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))} placeholder="https://doi.org/..." className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none" /></div>
        </>)}
        {form.kategori === "ki" && (
          <div><label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 500 }}>Jenis KI</label>
            <select value={form.jenisKi} onChange={(e) => setForm((p) => ({ ...p, jenisKi: e.target.value }))} className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none">
              <option value="">Pilih...</option><option value="Hak Cipta">Hak Cipta</option><option value="Paten">Paten</option><option value="Paten Sederhana">Paten Sederhana</option>
            </select>
          </div>
        )}
        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="flex-1 py-2.5 text-sm text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200" style={{ fontWeight: 500 }}>Batal</button>
          <button onClick={() => { if (form.kategori && form.judul) { onSave({ ...form, id: Date.now().toString() }); onClose(); } }} className="flex-1 py-2.5 text-sm text-white bg-[#E30613] rounded-lg hover:bg-[#c00510]" style={{ fontWeight: 500 }}>Simpan Luaran</button>
        </div>
      </div>
    </ModalWrapper>
  );
}

/* ────────────────── Modal: RAB Upload ────────────────── */

function ModalRAB({ pagu, onClose }: { pagu: number; onClose: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  return (
    <ModalWrapper title="Upload RAB (Excel)" onClose={onClose}>
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
          <p className="text-sm text-blue-700"><span style={{ fontWeight: 600 }}>Pagu skema:</span> {formatCurrency(pagu)}</p>
          <p className="text-xs text-blue-500 mt-0.5">Total RAB tidak boleh melebihi pagu yang tersedia.</p>
        </div>
        <div>
          <label className="block text-sm text-slate-700 mb-2" style={{ fontWeight: 500 }}>File RAB (Excel) <span className="text-red-500">*</span></label>
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-[#E30613]/30 transition-colors">
            <Upload className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-500 mb-1">Drag & drop atau klik untuk upload</p>
            <p className="text-xs text-slate-400">.xlsx, .xls · Max 10MB</p>
            <input type="file" accept=".xlsx,.xls" onChange={(e) => setFile(e.target.files?.[0] || null)} className="hidden" id="rab-file" />
            <label htmlFor="rab-file" className="mt-3 inline-block px-4 py-2 text-xs text-white bg-slate-600 rounded-lg cursor-pointer hover:bg-slate-700" style={{ fontWeight: 500 }}>Pilih File</label>
            {file && <p className="mt-2 text-xs text-green-600" style={{ fontWeight: 500 }}>✓ {file.name}</p>}
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 text-sm text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200" style={{ fontWeight: 500 }}>Batal</button>
          <button onClick={() => { if (file) { alert("RAB berhasil diupload!"); onClose(); } }} className="flex-1 py-2.5 text-sm text-white bg-[#E30613] rounded-lg hover:bg-[#c00510]" style={{ fontWeight: 500 }}>Upload RAB</button>
        </div>
      </div>
    </ModalWrapper>
  );
}

/* ────────────────── Modal: Mitra ────────────────── */

function ModalMitra({ onClose, onSave }: { onClose: () => void; onSave: (data: Partial<Mitra>) => void }) {
  const [form, setForm] = useState({ nama: "", institusi: "", suratKesanggupan: "", dana: "" });
  const ic = "w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#E30613]/20";
  return (
    <ModalWrapper title="Tambah Mitra" onClose={onClose}>
      <div className="space-y-4">
        {[
          { label: "Nama Mitra (PIC)", key: "nama", type: "text", ph: "Nama PIC mitra" },
          { label: "Surat Kesanggupan (URL)", key: "suratKesanggupan", type: "url", ph: "https://drive.google.com/..." },
          { label: "Dana (Rp)", key: "dana", type: "number", ph: "0" },
        ].map((f) => (
          <div key={f.key}>
            <label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 500 }}>{f.label} {f.key !== "suratKesanggupan" && <span className="text-red-500">*</span>}</label>
            <input type={f.type} value={(form as any)[f.key]} onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))} placeholder={f.ph} className={ic} />
          </div>
        ))}
        <div><label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 500 }}>Institusi Mitra <span className="text-red-500">*</span></label>
          <select value={form.institusi} onChange={(e) => setForm((p) => ({ ...p, institusi: e.target.value }))} className={ic}>
            <option value="">Pilih institusi...</option>
            <option value="BRIN">BRIN</option><option value="Kemendikbud">Kemendikbud</option><option value="PT Swasta">PT Swasta</option>
          </select>
        </div>
        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="flex-1 py-2.5 text-sm text-slate-600 bg-slate-100 rounded-lg" style={{ fontWeight: 500 }}>Batal</button>
          <button onClick={() => { if (form.nama && form.institusi) { onSave({ id: Date.now().toString(), nama: form.nama, institusi: form.institusi, suratKesanggupan: form.suratKesanggupan, dana: Number(form.dana), alamat: "", surel: "", negara: "Indonesia" }); onClose(); } }} className="flex-1 py-2.5 text-sm text-white bg-[#E30613] rounded-lg" style={{ fontWeight: 500 }}>Simpan Mitra</button>
        </div>
      </div>
    </ModalWrapper>
  );
}

/* ────────────────── Modal Wrapper ────────────────── */

function ModalWrapper({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white">
          <h3 className="text-slate-900" style={{ fontWeight: 600 }}>{title}</h3>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

/* ────────────────── Main Component ────────────────── */

const TABS = ["Profil Ketua", "Info Ajuan", "Anggota Dosen", "Mahasiswa", "Nondosen", "Luaran", "Integrasi", "RAB", "Mitra", "Summary", "Histories"];

export function HibahViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const storedTab = parseInt(localStorage.getItem("hibahActiveTab") || "0");
  const [activeTab, setActiveTab] = useState(isNaN(storedTab) ? 0 : storedTab);
  const [hibah, setHibah] = useState<HibahDetail>(MOCK_DETAIL);
  const [modal, setModal] = useState<"dosen" | "mahasiswa" | "nondosen" | "luaran" | "integrasi" | "rab" | "mitra" | null>(null);
  const [confirmModal, setConfirmModal] = useState({ open: false, title: "", message: "", variant: "danger" as "danger" | "warning" | "success", onConfirm: () => {} });
  const [toast, setToast] = useState({ show: false, message: "" });
  const isReviewerShell = location.pathname.startsWith("/reviewer");
  const shellBase = isReviewerShell ? "/reviewer" : "/admin";
  const sectionLabel = isReviewerShell ? "Reviewer" : "Dosen";

  const isDraft = hibah.status === "draft";

  const handleTabChange = (idx: number) => {
    setActiveTab(idx);
    localStorage.setItem("hibahActiveTab", String(idx));
  };

  const showToast = (msg: string) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast((p) => ({ ...p, show: false })), 3000);
  };

  const handleSubmitPermanen = () => {
    setHibah((p) => ({ ...p, status: "submitted" as StatusType }));
    showToast("Proposal berhasil disimpan permanen!");
  };

  const grandTotal = hibah.rab.reduce((s, r) => s + r.total, 0);

  const renderTabContent = () => {
    switch (activeTab) {
      /* ── Tab 0: Profil Ketua ── */
      case 0: return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Nama Ketua", value: hibah.ketuaNama },
              { label: "NIDN", value: hibah.ketuaNidn },
              { label: "Pangkat/Jabatan", value: hibah.ketuaJabatan },
              { label: "Profil Sinta", value: <a href={hibah.ketuaSintaUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">{hibah.ketuaSintaId} <ExternalLink className="w-3 h-3" /></a> },
              { label: "Google Scholar", value: <a href={hibah.ketuaGoogleUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">h-index: {hibah.ketuaGoogleSkor} <ExternalLink className="w-3 h-3" /></a> },
            ].map((f) => (
              <div key={f.label} className="bg-slate-50 rounded-lg p-4">
                <p className="text-xs text-slate-400 mb-1">{f.label}</p>
                <p className="text-sm text-slate-800" style={{ fontWeight: 500 }}>{f.value}</p>
              </div>
            ))}
          </div>
        </div>
      );

      /* ── Tab 1: Info Ajuan ── */
      case 1: return (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            {[
              { l: "Kelompok Skema", v: hibah.skema },
              { l: "Tahun Usulan", v: hibah.tahunAjuan },
              { l: "Tema Hibah", v: hibah.tema },
              { l: "Semester", v: hibah.semester },
              { l: "Lama Kegiatan", v: "1 Semester" },
              { l: "Roadmap Universitas", v: hibah.roadmap },
              { l: "Fokus Riset Fakultas", v: hibah.risetFakultas },
              { l: "Tema Riset Fakultas", v: hibah.risetTema },
              { l: "Tema Prodi", v: hibah.temaProdi },
              { l: "SubTema Prodi", v: hibah.subtema },
              ...(hibah.jenis === "penelitian" ? [{ l: "Target TKT", v: hibah.targetTkt }] : []),
            ].map((f) => (
              <div key={f.l}><p className="text-xs text-slate-400 mb-0.5">{f.l}</p><p className="text-sm text-slate-800" style={{ fontWeight: 500 }}>{f.v}</p></div>
            ))}
          </div>
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div><p className="text-xs text-slate-400 mb-1">Judul</p><p className="text-sm text-slate-900" style={{ fontWeight: 600 }}>{hibah.judul}</p></div>
            <div><p className="text-xs text-slate-400 mb-1">Abstrak</p><p className="text-sm text-slate-700 leading-relaxed">{hibah.abstrak}</p></div>
            <div className="grid grid-cols-2 gap-4">
              {hibah.substansiUrl && <div><p className="text-xs text-slate-400 mb-1">Proposal</p><a href={hibah.substansiUrl} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline flex items-center gap-1">Lihat Proposal <ExternalLink className="w-3 h-3" /></a></div>}
              {hibah.dokumenUrl && <div><p className="text-xs text-slate-400 mb-1">Dokumen</p><a href={hibah.dokumenUrl} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline flex items-center gap-1">Lihat Dokumen <ExternalLink className="w-3 h-3" /></a></div>}
            </div>
          </div>
        </div>
      );

      /* ── Tab 2: Anggota Dosen ── */
      case 2: return (
        <div className="space-y-4">
          {isDraft && <button onClick={() => setModal("dosen")} className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-[#E30613] rounded-lg hover:bg-[#c00510]" style={{ fontWeight: 500 }}><Plus className="w-4 h-4" /> Tambah Dosen</button>}
          <SectionTable
            headers={["No", "NIDN", "Nama", "Prodi", "Tugas", "Status", ...(isDraft ? ["Aksi"] : [])]}
            rows={hibah.anggotaDosen.map((a, i) => [
              i + 1, a.nidn, a.nama, a.prodi, a.tugas,
              <StatusBadge key={a.id} status={a.status} />,
              ...(isDraft ? [<button key="del" onClick={() => setConfirmModal({ open: true, title: "Hapus Anggota?", message: `Hapus ${a.nama}?`, variant: "danger", onConfirm: () => setHibah((p) => ({ ...p, anggotaDosen: p.anggotaDosen.filter((x) => x.id !== a.id) })) })} className="p-1.5 text-slate-400 hover:text-red-600 rounded-md"><Trash2 className="w-3.5 h-3.5" /></button>] : []),
            ])}
          />
        </div>
      );

      /* ── Tab 3: Mahasiswa ── */
      case 3: return (
        <div className="space-y-4">
          {isDraft && <button onClick={() => setModal("mahasiswa")} className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-[#E30613] rounded-lg hover:bg-[#c00510]" style={{ fontWeight: 500 }}><Plus className="w-4 h-4" /> Tambah Mahasiswa</button>}
          <SectionTable
            headers={["No", "NIM", "Nama", "Fakultas", "Prodi", "Tugas", ...(isDraft ? ["Aksi"] : [])]}
            rows={hibah.anggotaMahasiswa.map((m, i) => [
              i + 1, m.nim, m.nama, m.fakultas, m.prodi, m.tugas,
              ...(isDraft ? [<button key="del" onClick={() => setHibah((p) => ({ ...p, anggotaMahasiswa: p.anggotaMahasiswa.filter((x) => x.id !== m.id) }))} className="p-1.5 text-slate-400 hover:text-red-600 rounded-md"><Trash2 className="w-3.5 h-3.5" /></button>] : []),
            ])}
          />
        </div>
      );

      /* ── Tab 4: Nondosen ── */
      case 4: return (
        <div className="space-y-4">
          {isDraft && <button onClick={() => setModal("nondosen")} className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-[#E30613] rounded-lg hover:bg-[#c00510]" style={{ fontWeight: 500 }}><Plus className="w-4 h-4" /> Tambah Nondosen</button>}
          <SectionTable
            headers={["No", "Jenis", "No. Identitas", "Nama", "Institusi", "Tugas"]}
            rows={hibah.nondosen.map((n, i) => [i + 1, n.jenis, n.noIdentitas, n.nama, n.institusi, n.tugas])}
          />
        </div>
      );

      /* ── Tab 5: Luaran ── */
      case 5: return (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-sm text-amber-700"><AlertTriangle className="w-4 h-4 inline mr-1.5" /><strong>Wajib:</strong> {hibah.luaranWajib}</p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-sm text-amber-700"><AlertTriangle className="w-4 h-4 inline mr-1.5" /><strong>Wajib:</strong> Semua Tim Hibah harus sebagai penulis di jurnal atau KI</p>
            <p className="text-xs text-amber-600 mt-1">Tim: {hibah.ketuaNama}{hibah.anggotaDosen.map((a) => `, ${a.nama}`).join("")}</p>
          </div>
          {isDraft && <button onClick={() => setModal("luaran")} className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-[#E30613] rounded-lg hover:bg-[#c00510]" style={{ fontWeight: 500 }}><Plus className="w-4 h-4" /> Jurnal dan KI</button>}
          <SectionTable
            headers={["No", "Kategori", "Judul", "Nama Jurnal", "URL", "Jenis KI", ...(isDraft ? ["Aksi"] : [])]}
            rows={hibah.luaran.map((l, i) => [
              i + 1,
              <span key={l.id} className="capitalize px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700" style={{ fontWeight: 600 }}>{l.kategori}</span>,
              l.judul, l.namaJurnal || "—",
              l.url ? <a key="url" href={l.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-xs">Lihat</a> : "—",
              l.jenisKi || "—",
              ...(isDraft ? [<button key="del" onClick={() => setHibah((p) => ({ ...p, luaran: p.luaran.filter((x) => x.id !== l.id) }))} className="p-1.5 text-slate-400 hover:text-red-600 rounded-md"><Trash2 className="w-3.5 h-3.5" /></button>] : []),
            ])}
          />
        </div>
      );

      /* ── Tab 6: Integrasi ── */
      case 6: return (
        <div className="space-y-4">
          {isDraft && hibah.integrasi.length === 0 && <button onClick={() => setModal("integrasi")} className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-[#E30613] rounded-lg hover:bg-[#c00510]" style={{ fontWeight: 500 }}><Plus className="w-4 h-4" /> Tambah Integrasi Matakuliah</button>}
          <SectionTable
            headers={["No", "Kode", "Nama MK", "SKS", "Semester/TA", "Pertemuan", "Bentuk", "Dosen Pengampu", "Prodi"]}
            rows={hibah.integrasi.map((t, i) => [i + 1, t.kode, t.namaMk, t.sks, t.semester, t.pertemuan, t.bentuk, t.dosenPengampu, t.prodi])}
          />
        </div>
      );

      /* ── Tab 7: RAB ── */
      case 7: return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-600">Pagu Skema: <span style={{ fontWeight: 600 }}>{formatCurrency(hibah.pagu)}</span></div>
            {isDraft && (
              hibah.rab.length === 0
                ? <button onClick={() => setModal("rab")} className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-[#E30613] rounded-lg hover:bg-[#c00510]" style={{ fontWeight: 500 }}><Upload className="w-4 h-4" /> Submit RAB</button>
                : <button onClick={() => setConfirmModal({ open: true, title: "Hapus RAB?", message: "Seluruh data RAB akan dihapus.", variant: "danger", onConfirm: () => setHibah((p) => ({ ...p, rab: [] })) })} className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100" style={{ fontWeight: 500 }}><Trash2 className="w-4 h-4" /> Hapus RAB</button>
            )}
          </div>
          <SectionTable
            headers={["No", "Kelompok", "Komponen", "Item", "Satuan", "Harga Satuan", "Volume", "Total"]}
            rows={hibah.rab.map((r, i) => [i + 1, r.kelompok, r.komponen, r.item, r.satuan, formatCurrency(r.hargaSatuan), r.volume, formatCurrency(r.total)])}
          />
          {hibah.rab.length > 0 && (
            <div className={`text-right p-3 rounded-lg border ${grandTotal > hibah.pagu ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"}`}>
              <span className="text-sm" style={{ fontWeight: 600 }}>Grand Total: <span className={grandTotal > hibah.pagu ? "text-red-600" : "text-green-700"}>{formatCurrency(grandTotal)}</span></span>
              {grandTotal > hibah.pagu && <span className="ml-2 text-xs text-red-500">(Melebihi pagu!)</span>}
            </div>
          )}
        </div>
      );

      /* ── Tab 8: Mitra ── */
      case 8: return (
        <div className="space-y-4">
          {isDraft && <button onClick={() => setModal("mitra")} className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-[#E30613] rounded-lg hover:bg-[#c00510]" style={{ fontWeight: 500 }}><Plus className="w-4 h-4" /> Tambah Mitra</button>}
          <SectionTable
            headers={["No", "Nama Mitra", "Institusi", "Alamat", "Surel", "Negara", "Surat Kesanggupan", "Dana"]}
            rows={hibah.mitra.map((m, i) => [
              i + 1, m.nama, m.institusi, m.alamat, m.surel, m.negara,
              m.suratKesanggupan ? <a key="url" href={m.suratKesanggupan} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-xs">Lihat</a> : "—",
              formatCurrency(m.dana),
            ])}
          />
        </div>
      );

      /* ── Tab 9: Summary ── */
      case 9: return (
        <div className="space-y-6">
          {[
            { title: "Informasi Hibah", content: <div className="grid grid-cols-2 gap-3">{[{ l: "Judul", v: hibah.judul }, { l: "Skema", v: hibah.skema }, { l: "Status", v: <StatusBadge key="s" status={hibah.status} /> }].map((f) => <div key={f.l}><p className="text-xs text-slate-400">{f.l}</p><p className="text-sm text-slate-800">{f.v}</p></div>)}</div> },
            { title: "Anggota Dosen", content: <SectionTable headers={["Nama", "NIDN", "Tugas"]} rows={hibah.anggotaDosen.map((a) => [a.nama, a.nidn, a.tugas])} /> },
            { title: "Mahasiswa", content: <SectionTable headers={["NIM", "Nama", "Tugas"]} rows={hibah.anggotaMahasiswa.map((m) => [m.nim, m.nama, m.tugas])} /> },
            { title: "Luaran", content: <SectionTable headers={["Kategori", "Judul"]} rows={hibah.luaran.map((l) => [l.kategori, l.judul])} /> },
            { title: "RAB", content: <SectionTable headers={["Item", "Total"]} rows={hibah.rab.map((r) => [r.item, formatCurrency(r.total)])} /> },
          ].map((s) => (
            <div key={s.title}>
              <div className="bg-blue-50 border-l-4 border-blue-400 px-4 py-2 mb-3 rounded-r-lg"><p className="text-sm text-blue-700" style={{ fontWeight: 600 }}>{s.title}</p></div>
              {s.content}
            </div>
          ))}

          <div className="pt-4 border-t border-slate-100">
            {(isDraft || hibah.status === "revisi") && hibah.bolehSubmit ? (
              <button onClick={() => setConfirmModal({ open: true, title: "Simpan Permanen?", message: "Proposal akan disimpan permanen dan tidak dapat diubah lagi.", variant: "warning", onConfirm: handleSubmitPermanen })}
                className="flex items-center gap-2 px-5 py-3 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700" style={{ fontWeight: 500 }}>
                <CheckCircle className="w-4 h-4" /> Simpan Permanen
              </button>
            ) : !hibah.bolehSubmit ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600" style={{ fontWeight: 500 }}>Data Hibah Belum Sesuai — Lengkapi semua bagian sebelum submit.</p>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-700" style={{ fontWeight: 500 }}><CheckCircle className="w-4 h-4 inline mr-1.5" />Data Tersimpan Permanen</p>
              </div>
            )}
            <button className="mt-3 flex items-center gap-2 px-4 py-2 text-sm text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200" style={{ fontWeight: 500 }}>
              <Download className="w-4 h-4" /> Export PDF
            </button>
          </div>
        </div>
      );

      /* ── Tab 10: Histories ── */
      case 10: return (
        <div className="space-y-0">
          {hibah.histories.map((h, i) => (
            <div key={h.id} className="flex gap-4 pb-6">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-[#E30613]/10 flex items-center justify-center shrink-0"><Clock className="w-4 h-4 text-[#E30613]" /></div>
                {i < hibah.histories.length - 1 && <div className="w-0.5 h-full bg-slate-100 mt-2 flex-1" />}
              </div>
              <div className="flex-1 -mt-0.5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-slate-800" style={{ fontWeight: 500 }}>{h.namaUser}</span>
                  <StatusBadge status={h.status} />
                </div>
                <p className="text-xs text-slate-500">{formatDate(h.tanggal)}</p>
                {h.catatan && <p className="text-sm text-slate-600 mt-1 bg-slate-50 px-3 py-2 rounded-lg">{h.catatan}</p>}
              </div>
            </div>
          ))}
        </div>
      );

      default: return null;
    }
  };

  return (
    <PageWrapper
      title={hibah.judul}
      subtitle={`${hibah.jenis === "penelitian" ? "Hibah Penelitian" : "Hibah PKM"} · ${hibah.tahunAjuan}`}
      breadcrumbs={[{ label: sectionLabel }, { label: "Hibah", path: `${shellBase}/hibah/${hibah.jenis}` }, { label: hibah.id }]}
      actions={
        <div className="flex items-center gap-2">
          <StatusBadge status={hibah.status} size="md" />
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">
            <ChevronLeft className="w-4 h-4" /> Kembali
          </button>
        </div>
      }
    >
      {/* Status Stepper */}
      <StepperStatus module="hibah" currentStatus={hibah.status} />

      {/* Tabs */}
      <div className="mt-5 bg-white rounded-xl border border-slate-200 overflow-hidden">
        {/* Tab Nav */}
        <div className="overflow-x-auto border-b border-slate-100">
          <div className="flex min-w-max">
            {TABS.map((tab, idx) => (
              <button key={tab} onClick={() => handleTabChange(idx)}
                className={`px-4 py-3.5 text-sm whitespace-nowrap transition-all border-b-2 ${
                  activeTab === idx
                    ? "border-[#E30613] text-[#E30613] bg-[#E30613]/5"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                }`} style={{ fontWeight: activeTab === idx ? 600 : 400 }}>
                {tab}
              </button>
            ))}
          </div>
        </div>
        {/* Tab Content */}
        <div className="p-6">{renderTabContent()}</div>
      </div>

      {/* Modals */}
      {modal === "dosen" && <ModalAnggotaDosen onClose={() => setModal(null)} onSave={(d) => setHibah((p) => ({ ...p, anggotaDosen: [...p.anggotaDosen, d as AnggotaDosen] }))} />}
      {modal === "luaran" && <ModalLuaran onClose={() => setModal(null)} onSave={(d) => setHibah((p) => ({ ...p, luaran: [...p.luaran, d as Luaran] }))} />}
      {modal === "rab" && <ModalRAB pagu={hibah.pagu} onClose={() => setModal(null)} />}
      {modal === "mitra" && <ModalMitra onClose={() => setModal(null)} onSave={(d) => setHibah((p) => ({ ...p, mitra: [...p.mitra, d as Mitra] }))} />}
      {modal === "mahasiswa" && (
        <ModalWrapper title="Tambah Anggota Mahasiswa" onClose={() => setModal(null)}>
          <div className="space-y-4">
            <div><label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 500 }}>Prodi <span className="text-red-500">*</span></label><select className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#E30613]/20"><option value="">Pilih prodi...</option><option>Teknik Informatika</option><option>Sistem Informasi</option></select></div>
            <div><label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 500 }}>Nama Mahasiswa <span className="text-red-500">*</span></label><select className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#E30613]/20"><option value="">Pilih mahasiswa...</option><option>Ahmad Fauzi (2020123001)</option></select></div>
            <div><label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 500 }}>Tugas <span className="text-red-500">*</span></label><textarea rows={3} className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none resize-none" /></div>
            <div className="flex gap-3"><button onClick={() => setModal(null)} className="flex-1 py-2.5 text-sm text-slate-600 bg-slate-100 rounded-lg" style={{ fontWeight: 500 }}>Batal</button><button onClick={() => setModal(null)} className="flex-1 py-2.5 text-sm text-white bg-[#E30613] rounded-lg" style={{ fontWeight: 500 }}>Simpan</button></div>
          </div>
        </ModalWrapper>
      )}
      {modal === "nondosen" && (
        <ModalWrapper title="Tambah Anggota Nondosen" onClose={() => setModal(null)}>
          <div className="space-y-4">
            <div><label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 500 }}>Nama Nondosen</label><select className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none"><option value="">Pilih...</option><option>Dr. Joko Widodo (Universitas Negeri)</option></select></div>
            <div><label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 500 }}>Tugas</label><textarea rows={3} className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none resize-none" /></div>
            <div className="flex gap-3"><button onClick={() => setModal(null)} className="flex-1 py-2.5 text-sm text-slate-600 bg-slate-100 rounded-lg" style={{ fontWeight: 500 }}>Batal</button><button onClick={() => setModal(null)} className="flex-1 py-2.5 text-sm text-white bg-[#E30613] rounded-lg" style={{ fontWeight: 500 }}>Simpan</button></div>
          </div>
        </ModalWrapper>
      )}
      {modal === "integrasi" && (
        <ModalWrapper title="Tambah Integrasi Matakuliah" onClose={() => setModal(null)}>
          <div className="grid grid-cols-2 gap-4">
            {[{ label: "Kode MK", ph: "TI4023", type: "text" }, { label: "Nama MK", ph: "Internet of Things", type: "text" }, { label: "Jumlah SKS", ph: "3", type: "text" }, { label: "Jumlah Pertemuan", ph: "8", type: "number" }, { label: "Semester/TA", ph: "Genap 2025/2026", type: "text" }].map((f) => (
              <div key={f.label}><label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 500 }}>{f.label} <span className="text-red-500">*</span></label><input type={f.type} placeholder={f.ph} className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none" /></div>
            ))}
            <div><label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 500 }}>Dosen Pengampu</label><select className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none"><option>Dr. Arif Ramadhan</option></select></div>
            <div className="col-span-2"><label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 500 }}>Bentuk Integrasi</label><input type="text" placeholder="RPS; Tugas Mahasiswa, KKN" className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none" /></div>
          </div>
          <div className="flex gap-3 mt-4"><button onClick={() => setModal(null)} className="flex-1 py-2.5 text-sm text-slate-600 bg-slate-100 rounded-lg" style={{ fontWeight: 500 }}>Batal</button><button onClick={() => setModal(null)} className="flex-1 py-2.5 text-sm text-white bg-[#E30613] rounded-lg" style={{ fontWeight: 500 }}>Simpan</button></div>
        </ModalWrapper>
      )}

      <ConfirmModal {...confirmModal} isOpen={confirmModal.open} onClose={() => setConfirmModal((p) => ({ ...p, open: false }))} />
      {toast.show && <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg border bg-green-50 border-green-200 text-green-700"><CheckCircle className="w-4 h-4" /><span className="text-sm" style={{ fontWeight: 500 }}>{toast.message}</span></div>}
    </PageWrapper>
  );
}
