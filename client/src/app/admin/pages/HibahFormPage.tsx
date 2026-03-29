import { useState, useEffect, useRef } from "react";
import {
  ChevronLeft, AlertCircle, RotateCcw, Send, FileText
} from "lucide-react";
import { useNavigate, useSearchParams, useParams } from "react-router";
import { PageWrapper } from "../components/PageWrapper";

/* ────────────────── Types ────────────────── */

type JenisHibah = "penelitian" | "pengabdian";

interface SkemaOption { id: string; label: string; }
interface DropdownOption { id: string; nama: string; }

interface FormFields {
  kelompokskema_id: string;
  targettkt_id: string;
  temahibah: string;
  roadmapuniversitas_id: string;
  risetfakultas_id: string;
  risettema_id: string;
  tema_id: string;
  subtema_id: string;
  judul: string;
  abstrak: string;
  substansiurl: string;
  dokumenurl: string;
}

/* ────────────────── Mock Ref Data ────────────────── */

const SKEMA_OPTIONS: Record<JenisHibah, SkemaOption[]> = {
  penelitian: [
    { id: "SK-01", label: "Penelitian Dasar" },
    { id: "SK-02", label: "Penelitian Terapan" },
    { id: "SK-03", label: "Penelitian Pengembangan" },
  ],
  pengabdian: [
    { id: "SK-04", label: "PKM Reguler" },
    { id: "SK-05", label: "PKM Internasional" },
  ],
};

const TKT_OPTIONS = [
  { id: "T1", label: "TKT 1 - Prinsip dasar diteliti" },
  { id: "T2", label: "TKT 2 - Konsep teknologi dirumuskan" },
  { id: "T3", label: "TKT 3 - Konsep diuji secara analitik & eksperimental" },
  { id: "T4", label: "TKT 4 - Komponen divalidasi di lingkungan laboratorium" },
  { id: "T5", label: "TKT 5 - Komponen divalidasi di lingkungan relevan" },
  { id: "T6", label: "TKT 6 - Sistem/subsistem divalidasi di lingkungan relevan" },
  { id: "T7", label: "TKT 7 - Prototipe sistem didemonstrasikan" },
  { id: "T8", label: "TKT 8 - Sistem lengkap dan berkualifikasi" },
  { id: "T9", label: "TKT 9 - Sistem actual proven" },
];

const TEMA_HIBAH_OPTIONS = [
  "Energi", "Kesehatan", "Ketahanan Pangan", "Kemaritiman", "Infrastruktur",
  "ICT & Manufaktur", "Sosial Humaniora", "Pendidikan",
];

const ROADMAP_OPTIONS: DropdownOption[] = [
  { id: "R1", nama: "Roadmap Energi Terbarukan" },
  { id: "R2", nama: "Roadmap Teknologi Digital" },
  { id: "R3", nama: "Roadmap Kesehatan dan Biomedis" },
  { id: "R4", nama: "Roadmap Ketahanan Pangan" },
];

const RISET_FAKULTAS_OPTIONS: DropdownOption[] = [
  { id: "RF-1", nama: "Informatika & Teknik" },
  { id: "RF-2", nama: "Bisnis & Manajemen" },
  { id: "RF-3", nama: "Hukum & Sosial" },
];

const TEMA_PRODI_OPTIONS: DropdownOption[] = [
  { id: "TP-1", nama: "Kecerdasan Buatan" },
  { id: "TP-2", nama: "Rekayasa Perangkat Lunak" },
  { id: "TP-3", nama: "Keamanan Sistem" },
];

// Cascading data
const RISETTEMA_BY_RISETFAKULTAS: Record<string, DropdownOption[]> = {
  "RF-1": [{ id: "RT-1", nama: "Rekayasa Komputasi" }, { id: "RT-2", nama: "Sistem Informasi" }],
  "RF-2": [{ id: "RT-3", nama: "Manajemen Strategis" }, { id: "RT-4", nama: "Keuangan Digital" }],
  "RF-3": [{ id: "RT-5", nama: "Hukum Digital" }, { id: "RT-6", nama: "Kebijakan Publik" }],
};

const SUBTEMA_BY_TEMA: Record<string, DropdownOption[]> = {
  "TP-1": [{ id: "ST-1", nama: "Machine Learning" }, { id: "ST-2", nama: "Deep Learning" }, { id: "ST-3", nama: "Computer Vision" }],
  "TP-2": [{ id: "ST-4", nama: "Agile Development" }, { id: "ST-5", nama: "DevOps" }],
  "TP-3": [{ id: "ST-6", nama: "Cybersecurity" }, { id: "ST-7", nama: "Network Security" }],
};

const TKT_DESKRIPSI: Record<string, string> = {
  "T1": "Prinsip dasar dari suatu teknologi diteliti dan dilaporkan. Tahap kegiatan akademis murni.",
  "T2": "Formulasi konsep dan/atau aplikasi teknologi. Tahap pengembangan konsep awal.",
  "T3": "Pembuktian konsep dari fungsi dan karakteristik teknologi secara analitis dan eksperimental.",
  "T4": "Validasi komponen teknologi di laboratorium.",
  "T5": "Validasi komponen teknologi di lingkungan yang relevan.",
  "T6": "Demonstrasi model atau prototipe di lingkungan yang relevan.",
  "T7": "Demonstrasi prototipe sistem di lingkungan operasional.",
  "T8": "Sistem lengkap dan memenuhi kualifikasi melalui pengujian.",
  "T9": "Teknologi actual proven dalam lingkungan operasional actual.",
};

const ROADMAP_ABSTRAK: Record<string, string> = {
  "R1": "Roadmap ini berfokus pada pengembangan sumber energi terbarukan seperti solar, angin, dan biomassa untuk mendukung target net-zero emission universitas.",
  "R2": "Roadmap teknologi digital mencakup AI, big data, cloud computing, dan transformasi digital untuk industri 4.0.",
  "R3": "Roadmap bidang kesehatan dan biomedis berfokus pada telemedicine, biomarker, drug discovery, dan healthcare informatics.",
  "R4": "Roadmap ketahanan pangan berfokus pada smart agriculture, precision farming, dan teknologi post-harvest.",
};

/* ────────────────── Word Count Helper ────────────────── */

const countWords = (text: string) => text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
const countTitleWords = (text: string) => text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

/* ────────────────── FormField Helper ────────────────── */

const inputCls = (err?: boolean) =>
  `w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 bg-slate-50/50 placeholder:text-slate-400 transition-all ${
    err ? "border-red-300 focus:ring-red-200" : "border-slate-200 focus:ring-[#E30613]/20 focus:border-[#E30613]/40"
  }`;

function FormField({ label, required, error, helper, children }: { label: string; required?: boolean; error?: string; helper?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 500 }}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {helper && !error && <p className="text-xs text-slate-400 mt-1">{helper}</p>}
      {error && <p className="flex items-center gap-1 text-xs text-red-500 mt-1"><AlertCircle className="w-3 h-3" /> {error}</p>}
    </div>
  );
}

/* ────────────────── Main Component ────────────────── */

export function HibahFormPage({ mode = "new" }: { mode?: "new" | "edit" }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { id: encryptedId } = useParams();
  const jenisParam = (searchParams.get("jenis") || "penelitian") as JenisHibah;
  const [jenis] = useState<JenisHibah>(jenisParam);

  const emptyForm = (): FormFields => ({
    kelompokskema_id: "", targettkt_id: "", temahibah: "",
    roadmapuniversitas_id: "", risetfakultas_id: "", risettema_id: "",
    tema_id: "", subtema_id: "", judul: "", abstrak: "",
    substansiurl: "", dokumenurl: "",
  });

  const [form, setForm] = useState<FormFields>(emptyForm());
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Dynamic cascading options
  const [risettemaOptions, setRisettemaOptions] = useState<DropdownOption[]>([]);
  const [subtemaOptions, setSubtemaOptions] = useState<DropdownOption[]>([]);

  // Helper text states
  const [tktDeskripsi, setTktDeskripsi] = useState("");
  const [roadmapAbstrak, setRoadmapAbstrak] = useState("");

  // Pre-fill for edit
  useEffect(() => {
    if (mode === "edit" && encryptedId) {
      // Simulate fetching existing data
      setForm({
        kelompokskema_id: "SK-01", targettkt_id: "T3", temahibah: "ICT & Manufaktur",
        roadmapuniversitas_id: "R2", risetfakultas_id: "RF-1", risettema_id: "RT-1",
        tema_id: "TP-1", subtema_id: "ST-1",
        judul: "Penelitian IoT untuk Smart Campus Pradita",
        abstrak: "Penelitian ini bertujuan untuk mengembangkan sistem Internet of Things (IoT) yang terintegrasi untuk mendukung transformasi Smart Campus di Universitas Pradita. Sistem ini akan mencakup monitoring energi, keamanan, dan lingkungan secara real-time. Metodologi penelitian menggunakan pendekatan Design Science Research dengan iterasi prototipe. Data akan dikumpulkan melalui sensor IoT yang dipasang di berbagai titik strategis kampus. Analisis data menggunakan machine learning untuk prediksi dan optimasi. Hasil penelitian diharapkan dapat meningkatkan efisiensi energi sebesar 20% dan meningkatkan keamanan kampus secara signifikan.",
        substansiurl: "https://drive.google.com/proposal-iot",
        dokumenurl: "https://drive.google.com/dokumen-iot",
      });
      setRisettemaOptions(RISETTEMA_BY_RISETFAKULTAS["RF-1"] || []);
      setSubtemaOptions(SUBTEMA_BY_TEMA["TP-1"] || []);
      setTktDeskripsi(TKT_DESKRIPSI["T3"]);
      setRoadmapAbstrak(ROADMAP_ABSTRAK["R2"]);
    }
  }, [mode, encryptedId]);

  // Cascading: Riset Fakultas → Riset Tema
  const handleRisetFakultasChange = (id: string) => {
    setForm((p) => ({ ...p, risetfakultas_id: id, risettema_id: "" }));
    setRisettemaOptions(RISETTEMA_BY_RISETFAKULTAS[id] || []);
  };

  // Cascading: Tema Prodi → Subtema
  const handleTemaProdiChange = (id: string) => {
    setForm((p) => ({ ...p, tema_id: id, subtema_id: "" }));
    setSubtemaOptions(SUBTEMA_BY_TEMA[id] || []);
  };

  // TKT helper text
  const handleTktChange = (id: string) => {
    setForm((p) => ({ ...p, targettkt_id: id }));
    setTktDeskripsi(TKT_DESKRIPSI[id] || "");
  };

  // Roadmap abstrak helper
  const handleRoadmapChange = (id: string) => {
    setForm((p) => ({ ...p, roadmapuniversitas_id: id }));
    setRoadmapAbstrak(ROADMAP_ABSTRAK[id] || "");
  };

  const titleWordCount = countTitleWords(form.judul);
  const abstrakWordCount = countWords(form.abstrak);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.kelompokskema_id) errs.kelompokskema_id = "Skema hibah wajib dipilih";
    if (!form.temahibah) errs.temahibah = "Tema hibah wajib dipilih";
    if (!form.judul.trim()) errs.judul = "Judul wajib diisi";
    if (titleWordCount > 14) errs.judul = `Judul melebihi batas (${titleWordCount}/14 kata)`;
    if (abstrakWordCount < 250) errs.abstrak = `Abstrak terlalu pendek (${abstrakWordCount}/250 kata min)`;
    if (abstrakWordCount > 400) errs.abstrak = `Abstrak terlalu panjang (${abstrakWordCount}/400 kata max)`;
    if (!form.substansiurl) errs.substansiurl = "URL proposal wajib diisi";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    alert(`${mode === "new" ? "Proposal berhasil diajukan" : "Proposal berhasil diupdate"}!`);
    navigate("/admin/hibah/penelitian");
  };

  const handleReset = () => {
    setForm(emptyForm());
    setErrors({});
    setRisettemaOptions([]);
    setSubtemaOptions([]);
    setTktDeskripsi("");
    setRoadmapAbstrak("");
  };

  const pageTitle = mode === "new" ? `Ajukan Hibah ${jenis === "pengabdian" ? "Pengabdian (PKM)" : "Penelitian"} Baru` : "Edit Proposal Hibah";

  return (
    <PageWrapper
      title={pageTitle}
      breadcrumbs={[{ label: "Dosen" }, { label: "Hibah", path: `/admin/hibah/${jenis}` }, { label: mode === "new" ? "Ajukan Baru" : "Edit" }]}
    >
      <div className="max-w-5xl space-y-6">
        {/* ── Section: 2 Kolom ── */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-sm text-slate-900 mb-6" style={{ fontWeight: 600 }}>Informasi Proposal</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-5">
            {/* ── Kolom Kiri ── */}
            <div className="space-y-5">
              <FormField label="Skema Hibah" required error={errors.kelompokskema_id}>
                <select value={form.kelompokskema_id} onChange={(e) => setForm((p) => ({ ...p, kelompokskema_id: e.target.value }))} className={inputCls(!!errors.kelompokskema_id)}>
                  <option value="">Pilih skema hibah...</option>
                  {SKEMA_OPTIONS[jenis].map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </FormField>

              {/* Target TKT — hanya untuk penelitian */}
              {jenis === "penelitian" && (
                <FormField label="Target TKT" helper={tktDeskripsi || "Pilih TKT untuk melihat deskripsi"}>
                  <select value={form.targettkt_id} onChange={(e) => handleTktChange(e.target.value)} className={inputCls()}>
                    <option value="">Pilih target TKT...</option>
                    {TKT_OPTIONS.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
                  </select>
                  {tktDeskripsi && (
                    <div className="mt-2 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                      <p className="text-xs text-blue-700 leading-relaxed">{tktDeskripsi}</p>
                    </div>
                  )}
                </FormField>
              )}

              <FormField label="Tema Hibah" required error={errors.temahibah}>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {TEMA_HIBAH_OPTIONS.map((tema) => (
                    <label key={tema} className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg border cursor-pointer transition-all ${form.temahibah === tema ? "bg-[#E30613]/5 border-[#E30613]/30 text-[#E30613]" : "border-slate-200 text-slate-600 hover:border-slate-300"}`}>
                      <input type="radio" name="temahibah" value={tema} checked={form.temahibah === tema} onChange={(e) => setForm((p) => ({ ...p, temahibah: e.target.value }))} className="sr-only" />
                      <span className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 ${form.temahibah === tema ? "border-[#E30613] bg-[#E30613]" : "border-slate-300"}`} />
                      <span>{tema}</span>
                    </label>
                  ))}
                </div>
                {errors.temahibah && <p className="flex items-center gap-1 text-xs text-red-500 mt-1"><AlertCircle className="w-3 h-3" /> {errors.temahibah}</p>}
              </FormField>
            </div>

            {/* ── Kolom Kanan ── */}
            <div className="space-y-5">
              <FormField label="Roadmap Universitas">
                <select value={form.roadmapuniversitas_id} onChange={(e) => handleRoadmapChange(e.target.value)} className={inputCls()}>
                  <option value="">Pilih roadmap universitas...</option>
                  {ROADMAP_OPTIONS.map((r) => <option key={r.id} value={r.id}>{r.nama}</option>)}
                </select>
                {roadmapAbstrak && (
                  <div className="mt-2 p-3 bg-slate-50 border border-slate-100 rounded-lg">
                    <p className="text-xs text-slate-600 leading-relaxed">{roadmapAbstrak}</p>
                  </div>
                )}
              </FormField>

              <FormField label="Fokus Riset Fakultas">
                <select value={form.risetfakultas_id} onChange={(e) => handleRisetFakultasChange(e.target.value)} className={inputCls()}>
                  <option value="">Pilih fokus riset fakultas...</option>
                  {RISET_FAKULTAS_OPTIONS.map((r) => <option key={r.id} value={r.id}>{r.nama}</option>)}
                </select>
              </FormField>

              <FormField label="Tema Riset Fakultas">
                <select value={form.risettema_id} onChange={(e) => setForm((p) => ({ ...p, risettema_id: e.target.value }))} className={inputCls()} disabled={risettemaOptions.length === 0}>
                  <option value="">{risettemaOptions.length === 0 ? "Pilih riset fakultas dulu..." : "Pilih tema riset..."}</option>
                  {risettemaOptions.map((r) => <option key={r.id} value={r.id}>{r.nama}</option>)}
                </select>
              </FormField>

              <FormField label="Tema Prodi">
                <select value={form.tema_id} onChange={(e) => handleTemaProdiChange(e.target.value)} className={inputCls()}>
                  <option value="">Pilih tema prodi...</option>
                  {TEMA_PRODI_OPTIONS.map((t) => <option key={t.id} value={t.id}>{t.nama}</option>)}
                </select>
              </FormField>

              <FormField label="Subtema Prodi">
                <select value={form.subtema_id} onChange={(e) => setForm((p) => ({ ...p, subtema_id: e.target.value }))} className={inputCls()} disabled={subtemaOptions.length === 0}>
                  <option value="">{subtemaOptions.length === 0 ? "Pilih tema prodi dulu..." : "Pilih subtema..."}</option>
                  {subtemaOptions.map((s) => <option key={s.id} value={s.id}>{s.nama}</option>)}
                </select>
              </FormField>
            </div>
          </div>
        </div>

        {/* ── Section: Full Width ── */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-sm text-slate-900 mb-5" style={{ fontWeight: 600 }}>Konten Proposal</h3>
          <div className="space-y-5">
            <FormField label="Judul Proposal" required error={errors.judul}
              helper={`Judul max: 14 kata. Saat ini: ${titleWordCount} kata`}>
              <input type="text" value={form.judul}
                onChange={(e) => setForm((p) => ({ ...p, judul: e.target.value }))}
                placeholder="Masukkan judul proposal (max 14 kata)"
                className={inputCls(!!errors.judul)} />
              <div className="flex justify-end mt-1">
                <span className={`text-xs ${titleWordCount > 14 ? "text-red-500" : "text-slate-400"}`}>{titleWordCount}/14 kata</span>
              </div>
            </FormField>

            <FormField label="Abstrak" required error={errors.abstrak}>
              <textarea
                value={form.abstrak}
                onChange={(e) => setForm((p) => ({ ...p, abstrak: e.target.value }))}
                rows={8}
                placeholder="Tuliskan abstrak proposal Anda (min 250 kata, max 400 kata)..."
                className={inputCls(!!errors.abstrak) + " resize-y"}
              />
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-slate-400">Min 250 kata, Max 400 kata</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  abstrakWordCount < 250 ? "bg-amber-50 text-amber-600" :
                  abstrakWordCount > 400 ? "bg-red-50 text-red-600" :
                  "bg-green-50 text-green-600"
                }`} style={{ fontWeight: 500 }}>
                  {abstrakWordCount} kata
                  {abstrakWordCount < 250 && ` (+${250 - abstrakWordCount} lagi)`}
                  {abstrakWordCount > 400 && ` (lebih ${abstrakWordCount - 400})`}
                </span>
              </div>
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField label="URL Proposal / Substansi" required error={errors.substansiurl}>
                <input type="url" value={form.substansiurl}
                  onChange={(e) => setForm((p) => ({ ...p, substansiurl: e.target.value }))}
                  placeholder="https://drive.google.com/..."
                  className={inputCls(!!errors.substansiurl)} />
              </FormField>

              <FormField label="URL Dokumen Pendukung">
                <input type="url" value={form.dokumenurl}
                  onChange={(e) => setForm((p) => ({ ...p, dokumenurl: e.target.value }))}
                  placeholder="https://drive.google.com/..."
                  className={inputCls()} />
              </FormField>
            </div>
          </div>
        </div>

        {/* ── Tombol Aksi ── */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-wrap gap-3">
          <button onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-5 py-2.5 text-sm text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200" style={{ fontWeight: 500 }}>
            <ChevronLeft className="w-4 h-4" /> Kembali
          </button>
          <button onClick={handleReset}
            className="flex items-center gap-2 px-5 py-2.5 text-sm text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200" style={{ fontWeight: 500 }}>
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
          <button onClick={handleSubmit}
            className="flex items-center gap-2 px-5 py-2.5 text-sm text-white bg-[#E30613] rounded-lg hover:bg-[#c00510]" style={{ fontWeight: 500 }}>
            <Send className="w-4 h-4" /> {mode === "new" ? "Simpan Draft" : "Simpan Perubahan"}
          </button>
        </div>
      </div>
    </PageWrapper>
  );
}
