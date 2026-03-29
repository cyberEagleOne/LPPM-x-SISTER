import { useState } from "react";
import { ChevronLeft, ChevronRight, Check, Plus, X, Upload, AlertTriangle, FileSpreadsheet, Users, BookOpen, Info, Trash2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { PageWrapper } from "../components/PageWrapper";
import { ConfirmModal } from "../components/ConfirmModal";

interface TeamMember {
  id: string;
  name: string;
  role: "ketua" | "anggota" | "mahasiswa";
  nidn?: string;
  nim?: string;
  status: "pending" | "approved" | "rejected";
}

interface CourseIntegration {
  courseName: string;
  sks: number;
  semester: string;
  tahunAkademik: string;
}

interface RABItem {
  id: string;
  komponen: string;
  volume: number;
  satuan: string;
  hargaSatuan: number;
  total: number;
}

const WIZARD_STEPS = [
  { key: "basic", label: "Informasi Dasar", icon: Info },
  { key: "team", label: "Tim Peneliti", icon: Users },
  { key: "course", label: "Integrasi MK", icon: BookOpen },
  { key: "rab", label: "Upload RAB", icon: FileSpreadsheet },
];

const MOCK_LECTURERS = [
  { id: "L1", name: "Dr. Rina Wulandari", nidn: "0405098802" },
  { id: "L2", name: "Dr. Fajar Nugroho", nidn: "0618078903" },
  { id: "L3", name: "Prof. Dimas Prakoso", nidn: "0120067801" },
  { id: "L4", name: "Dr. Lestari Handayani", nidn: "0723088504" },
  { id: "L5", name: "Dr. Faisal Rahman", nidn: "0815097705" },
];

const MOCK_STUDENTS = [
  { id: "S1", name: "Rizky Pratama", nim: "2026010001" },
  { id: "S2", name: "Anisa Rahma", nim: "2026010002" },
  { id: "S3", name: "Dimas Setiawan", nim: "2026010003" },
  { id: "S4", name: "Putri Handayani", nim: "2026010004" },
  { id: "S5", name: "Farhan Auliya", nim: "2026010005" },
];

export function ProposalWizardPage({ onBack }: { onBack: () => void }) {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; title: string; message: string; variant: "danger" | "warning" | "success"; onConfirm: () => void }>({
    isOpen: false, title: "", message: "", variant: "warning", onConfirm: () => {}
  });

  // Step 1: Basic Info
  const [basicInfo, setBasicInfo] = useState({
    title: "",
    abstract: "",
    tktLevel: "",
    cluster: "",
    scheme: "",
  });

  // Step 2: Team
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: "TM-0", name: user?.name || "Dosen", role: "ketua", nidn: user?.nidn || "0312098901", status: "approved" },
  ]);
  const [showAddLecturer, setShowAddLecturer] = useState(false);
  const [showAddStudent, setShowAddStudent] = useState(false);

  // Step 3: Course Integration
  const [courseData, setCourseData] = useState<CourseIntegration>({
    courseName: "",
    sks: 3,
    semester: "",
    tahunAkademik: "2025/2026",
  });

  // Step 4: RAB
  const [rabItems, setRabItems] = useState<RABItem[]>([
    { id: "R1", komponen: "Bahan Habis Pakai", volume: 1, satuan: "paket", hargaSatuan: 5000000, total: 5000000 },
    { id: "R2", komponen: "Perjalanan Dinas", volume: 2, satuan: "kali", hargaSatuan: 3000000, total: 6000000 },
    { id: "R3", komponen: "Sewa Peralatan", volume: 1, satuan: "unit", hargaSatuan: 4000000, total: 4000000 },
  ]);
  const [rabUploaded, setRabUploaded] = useState(false);
  const [rabValidation, setRabValidation] = useState({ noHiddenSheet: true, noImages: true, validFormat: true });

  const formatCurrency = (val: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val);

  const lecturerCount = teamMembers.filter(m => m.role === "anggota").length;
  const studentCount = teamMembers.filter(m => m.role === "mahasiswa").length;
  const allMembersApproved = teamMembers.every(m => m.status === "approved");
  const totalBudget = rabItems.reduce((sum, item) => sum + item.total, 0);

  const canProceed = () => {
    switch (currentStep) {
      case 0: return basicInfo.title && basicInfo.abstract && basicInfo.tktLevel && basicInfo.cluster && basicInfo.scheme;
      case 1: return lecturerCount >= 2 && studentCount >= 3;
      case 2: return courseData.courseName && courseData.semester;
      case 3: return rabUploaded && rabValidation.noHiddenSheet && rabValidation.noImages && rabValidation.validFormat;
      default: return false;
    }
  };

  const addLecturer = (lecturer: typeof MOCK_LECTURERS[0]) => {
    if (teamMembers.find(m => m.nidn === lecturer.nidn)) return;
    setTeamMembers(prev => [...prev, {
      id: `TM-${prev.length}`,
      name: lecturer.name,
      role: "anggota",
      nidn: lecturer.nidn,
      status: Math.random() > 0.5 ? "approved" : "pending",
    }]);
    setShowAddLecturer(false);
  };

  const addStudent = (student: typeof MOCK_STUDENTS[0]) => {
    if (teamMembers.find(m => m.nim === student.nim)) return;
    setTeamMembers(prev => [...prev, {
      id: `TM-${prev.length}`,
      name: student.name,
      role: "mahasiswa",
      nim: student.nim,
      status: Math.random() > 0.3 ? "approved" : "pending",
    }]);
    setShowAddStudent(false);
  };

  const removeMember = (id: string) => {
    setTeamMembers(prev => prev.filter(m => m.id !== id));
  };

  const handleSimulateUpload = () => {
    setRabUploaded(true);
    setRabValidation({ noHiddenSheet: true, noImages: true, validFormat: true });
  };

  const handleFinalSubmit = () => {
    setConfirmModal({
      isOpen: true,
      title: "Submit Proposal?",
      message: allMembersApproved
        ? "Proposal akan di-submit untuk review. Pastikan semua data sudah benar."
        : "Beberapa anggota tim belum approve. Proposal akan disimpan sebagai draft.",
      variant: allMembersApproved ? "success" : "warning",
      onConfirm: () => onBack(),
    });
  };

  return (
    <PageWrapper
      title="Buat Proposal Hibah Internal"
      breadcrumbs={[{ label: "Pengajuan" }, { label: "Hibah Internal", path: "/admin/hibah" }, { label: "Proposal Baru" }]}
      actions={
        <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Kembali
        </button>
      }
    >
      {/* Stepper */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between">
          {WIZARD_STEPS.map((step, i) => {
            const StepIcon = step.icon;
            const isComplete = i < currentStep;
            const isCurrent = i === currentStep;
            return (
              <div key={step.key} className="flex-1 flex flex-col items-center relative">
                {i > 0 && (
                  <div className={`absolute top-4 right-1/2 w-full h-0.5 -z-0 ${isComplete ? "bg-green-500" : isCurrent ? "bg-[#E30613]" : "bg-slate-200"}`} />
                )}
                <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                  isComplete ? "bg-green-500 border-green-500 text-white" :
                  isCurrent ? "bg-[#E30613] border-[#E30613] text-white" :
                  "bg-white border-slate-300 text-slate-400"
                }`}>
                  {isComplete ? <Check className="w-4 h-4" /> : <StepIcon className="w-3.5 h-3.5" />}
                </div>
                <span className={`text-xs mt-2 text-center ${
                  isComplete ? "text-green-600" : isCurrent ? "text-[#E30613]" : "text-slate-400"
                }`} style={{ fontWeight: isCurrent || isComplete ? 600 : 400 }}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        {/* STEP 1: Basic Information */}
        {currentStep === 0 && (
          <div className="space-y-5">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-5 h-5 text-[#E30613]" />
              <h3 className="text-slate-900" style={{ fontWeight: 600 }}>Informasi Dasar Proposal</h3>
            </div>
            <div>
              <label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 500 }}>Judul Proposal <span className="text-red-500">*</span></label>
              <input type="text" value={basicInfo.title} onChange={e => setBasicInfo(p => ({ ...p, title: e.target.value }))}
                placeholder="Masukkan judul penelitian / pengabdian"
                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613]/40 bg-slate-50/50 placeholder:text-slate-400" />
            </div>
            <div>
              <label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 500 }}>Abstrak <span className="text-red-500">*</span></label>
              <textarea value={basicInfo.abstract} onChange={e => setBasicInfo(p => ({ ...p, abstract: e.target.value }))}
                rows={5} placeholder="Tulis abstrak penelitian (maksimal 250 kata)..."
                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613]/40 bg-slate-50/50 placeholder:text-slate-400 resize-none" />
              <p className="text-xs text-slate-400 mt-1">{basicInfo.abstract.split(/\s+/).filter(Boolean).length}/250 kata</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 500 }}>TKT Level <span className="text-red-500">*</span></label>
                <select value={basicInfo.tktLevel} onChange={e => setBasicInfo(p => ({ ...p, tktLevel: e.target.value }))}
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613]/40 bg-slate-50/50 text-slate-700">
                  <option value="">Pilih TKT</option>
                  {[1,2,3,4,5,6,7,8,9].map(n => <option key={n} value={String(n)}>TKT {n}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 500 }}>Kluster Riset <span className="text-red-500">*</span></label>
                <select value={basicInfo.cluster} onChange={e => setBasicInfo(p => ({ ...p, cluster: e.target.value }))}
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613]/40 bg-slate-50/50 text-slate-700">
                  <option value="">Pilih Kluster</option>
                  <option value="ict">ICT & Digital Innovation</option>
                  <option value="green">Green Technology & Sustainability</option>
                  <option value="social">Social Science & Humanities</option>
                  <option value="business">Business & Management</option>
                  <option value="engineering">Engineering & Applied Science</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 500 }}>Skema <span className="text-red-500">*</span></label>
                <select value={basicInfo.scheme} onChange={e => setBasicInfo(p => ({ ...p, scheme: e.target.value }))}
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613]/40 bg-slate-50/50 text-slate-700">
                  <option value="">Pilih Skema</option>
                  <option value="penelitian-dasar">Penelitian Dasar</option>
                  <option value="penelitian-terapan">Penelitian Terapan</option>
                  <option value="pkm">Pengabdian kepada Masyarakat</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Team Members */}
        {currentStep === 1 && (
          <div className="space-y-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#E30613]" />
                <h3 className="text-slate-900" style={{ fontWeight: 600 }}>Tim Peneliti</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded-full ${lecturerCount >= 2 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`} style={{ fontWeight: 500 }}>
                  Dosen: {lecturerCount}/2 min
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${studentCount >= 3 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`} style={{ fontWeight: 500 }}>
                  Mahasiswa: {studentCount}/3 min
                </span>
              </div>
            </div>

            {/* Current team */}
            <div className="space-y-2">
              {teamMembers.map((member) => (
                <div key={member.id} className={`flex items-center gap-4 px-4 py-3 rounded-lg border ${
                  member.status === "approved" ? "border-green-100 bg-green-50/30" :
                  member.status === "pending" ? "border-amber-100 bg-amber-50/30" :
                  "border-red-100 bg-red-50/30"
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs text-white shrink-0 ${
                    member.role === "ketua" ? "bg-[#E30613]" : member.role === "anggota" ? "bg-blue-500" : "bg-purple-500"
                  }`} style={{ fontWeight: 600 }}>
                    {member.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-800 truncate" style={{ fontWeight: 500 }}>{member.name}</p>
                    <p className="text-xs text-slate-400">
                      {member.role === "ketua" ? "Ketua Peneliti" : member.role === "anggota" ? "Anggota Dosen" : "Anggota Mahasiswa"}
                      {member.nidn && ` | NIDN: ${member.nidn}`}
                      {member.nim && ` | NIM: ${member.nim}`}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
                    member.status === "approved" ? "bg-green-100 text-green-700" :
                    member.status === "pending" ? "bg-amber-100 text-amber-700" :
                    "bg-red-100 text-red-700"
                  }`} style={{ fontWeight: 500 }}>
                    {member.status === "approved" ? "Approved" : member.status === "pending" ? "Pending" : "Ditolak"}
                  </span>
                  {member.role !== "ketua" && (
                    <button onClick={() => removeMember(member.id)} className="p-1 text-slate-400 hover:text-red-500 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add buttons */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <button onClick={() => { setShowAddLecturer(!showAddLecturer); setShowAddStudent(false); }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm border-2 border-dashed border-blue-200 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors" style={{ fontWeight: 500 }}>
                  <Plus className="w-4 h-4" /> Tambah Dosen
                </button>
                {showAddLecturer && (
                  <div className="absolute top-full mt-2 left-0 w-full bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-10 max-h-48 overflow-y-auto">
                    {MOCK_LECTURERS.filter(l => !teamMembers.find(m => m.nidn === l.nidn)).map(l => (
                      <button key={l.id} onClick={() => addLecturer(l)}
                        className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                        <p style={{ fontWeight: 500 }}>{l.name}</p>
                        <p className="text-xs text-slate-400">NIDN: {l.nidn}</p>
                      </button>
                    ))}
                    {MOCK_LECTURERS.filter(l => !teamMembers.find(m => m.nidn === l.nidn)).length === 0 && (
                      <p className="px-4 py-2 text-sm text-slate-400 italic">Semua dosen sudah ditambahkan</p>
                    )}
                  </div>
                )}
              </div>
              <div className="relative flex-1">
                <button onClick={() => { setShowAddStudent(!showAddStudent); setShowAddLecturer(false); }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm border-2 border-dashed border-purple-200 rounded-lg text-purple-600 hover:bg-purple-50 transition-colors" style={{ fontWeight: 500 }}>
                  <Plus className="w-4 h-4" /> Tambah Mahasiswa
                </button>
                {showAddStudent && (
                  <div className="absolute top-full mt-2 left-0 w-full bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-10 max-h-48 overflow-y-auto">
                    {MOCK_STUDENTS.filter(s => !teamMembers.find(m => m.nim === s.nim)).map(s => (
                      <button key={s.id} onClick={() => addStudent(s)}
                        className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                        <p style={{ fontWeight: 500 }}>{s.name}</p>
                        <p className="text-xs text-slate-400">NIM: {s.nim}</p>
                      </button>
                    ))}
                    {MOCK_STUDENTS.filter(s => !teamMembers.find(m => m.nim === s.nim)).length === 0 && (
                      <p className="px-4 py-2 text-sm text-slate-400 italic">Semua mahasiswa sudah ditambahkan</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {!allMembersApproved && teamMembers.length > 1 && (
              <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-100 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-amber-800" style={{ fontWeight: 500 }}>Menunggu Persetujuan</p>
                  <p className="text-xs text-amber-600 mt-0.5">"Permanent Submit" diblokir hingga semua anggota menyetujui undangan. Anda tetap bisa menyimpan sebagai draft.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: Course Integration */}
        {currentStep === 2 && (
          <div className="space-y-5">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-5 h-5 text-[#E30613]" />
              <h3 className="text-slate-900" style={{ fontWeight: 600 }}>Integrasi Mata Kuliah</h3>
            </div>
            <p className="text-sm text-slate-500">Hubungkan proposal dengan mata kuliah terkait untuk dokumentasi akademik.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 500 }}>Nama Mata Kuliah <span className="text-red-500">*</span></label>
                <input type="text" value={courseData.courseName} onChange={e => setCourseData(p => ({ ...p, courseName: e.target.value }))}
                  placeholder="Contoh: Kecerdasan Buatan"
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613]/40 bg-slate-50/50 placeholder:text-slate-400" />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 500 }}>SKS</label>
                <input type="number" value={courseData.sks} onChange={e => setCourseData(p => ({ ...p, sks: Number(e.target.value) }))}
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613]/40 bg-slate-50/50" />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 500 }}>Semester <span className="text-red-500">*</span></label>
                <select value={courseData.semester} onChange={e => setCourseData(p => ({ ...p, semester: e.target.value }))}
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613]/40 bg-slate-50/50 text-slate-700">
                  <option value="">Pilih Semester</option>
                  <option value="ganjil">Ganjil</option>
                  <option value="genap">Genap</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 500 }}>Tahun Akademik</label>
                <select value={courseData.tahunAkademik} onChange={e => setCourseData(p => ({ ...p, tahunAkademik: e.target.value }))}
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613]/40 bg-slate-50/50 text-slate-700">
                  <option value="2025/2026">2025/2026</option>
                  <option value="2026/2027">2026/2027</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: RAB Upload */}
        {currentStep === 3 && (
          <div className="space-y-5">
            <div className="flex items-center gap-2 mb-2">
              <FileSpreadsheet className="w-5 h-5 text-[#E30613]" />
              <h3 className="text-slate-900" style={{ fontWeight: 600 }}>Upload RAB (Rencana Anggaran Biaya)</h3>
            </div>

            {/* Upload area */}
            {!rabUploaded ? (
              <div
                onClick={handleSimulateUpload}
                className="border-2 border-dashed border-slate-300 rounded-xl p-10 text-center hover:border-[#E30613]/40 hover:bg-red-50/20 transition-all cursor-pointer"
              >
                <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <p className="text-sm text-slate-600" style={{ fontWeight: 500 }}>Klik atau drag file Excel (.xlsx) ke sini</p>
                <p className="text-xs text-slate-400 mt-1">Maksimal 10MB. Format: .xlsx, .xls</p>
              </div>
            ) : (
              <div className="border border-green-200 bg-green-50/30 rounded-xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <FileSpreadsheet className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-800" style={{ fontWeight: 500 }}>RAB_Proposal_2026.xlsx</p>
                  <p className="text-xs text-slate-400">245 KB &middot; Uploaded just now</p>
                </div>
                <button onClick={() => setRabUploaded(false)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Validation */}
            {rabUploaded && (
              <>
                <div className="bg-white border border-slate-200 rounded-xl p-4">
                  <h4 className="text-sm text-slate-800 mb-3" style={{ fontWeight: 600 }}>Validasi Otomatis</h4>
                  <div className="space-y-2">
                    {[
                      { label: "Tidak ada hidden sheet", ok: rabValidation.noHiddenSheet },
                      { label: "Tidak ada gambar di Excel", ok: rabValidation.noImages },
                      { label: "Format tabel valid", ok: rabValidation.validFormat },
                    ].map(v => (
                      <div key={v.label} className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${v.ok ? "bg-green-500" : "bg-red-500"}`}>
                          {v.ok ? <Check className="w-3 h-3 text-white" /> : <X className="w-3 h-3 text-white" />}
                        </div>
                        <span className={`text-sm ${v.ok ? "text-green-700" : "text-red-700"}`} style={{ fontWeight: 500 }}>{v.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Budget Summary */}
                <div className="bg-white border border-slate-200 rounded-xl p-4">
                  <h4 className="text-sm text-slate-800 mb-3" style={{ fontWeight: 600 }}>Ringkasan Anggaran (Parsed)</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-100">
                          {["Komponen", "Vol", "Satuan", "Harga Satuan", "Total"].map(h => (
                            <th key={h} className="px-3 py-2 text-left text-xs text-slate-500" style={{ fontWeight: 600 }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {rabItems.map(item => (
                          <tr key={item.id}>
                            <td className="px-3 py-2.5 text-sm text-slate-700">{item.komponen}</td>
                            <td className="px-3 py-2.5 text-sm text-slate-600">{item.volume}</td>
                            <td className="px-3 py-2.5 text-sm text-slate-600">{item.satuan}</td>
                            <td className="px-3 py-2.5 text-sm text-slate-600">{formatCurrency(item.hargaSatuan)}</td>
                            <td className="px-3 py-2.5 text-sm text-slate-800" style={{ fontWeight: 500 }}>{formatCurrency(item.total)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="border-t-2 border-slate-200">
                          <td colSpan={4} className="px-3 py-3 text-sm text-slate-800" style={{ fontWeight: 600 }}>Total Anggaran</td>
                          <td className="px-3 py-3 text-sm text-[#E30613]" style={{ fontWeight: 700 }}>{formatCurrency(totalBudget)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between bg-white rounded-xl border border-slate-200 px-6 py-4">
        <button
          onClick={() => currentStep > 0 ? setCurrentStep(currentStep - 1) : onBack()}
          className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
          style={{ fontWeight: 500 }}
        >
          <ChevronLeft className="w-4 h-4" />
          {currentStep > 0 ? "Sebelumnya" : "Batal"}
        </button>
        <div className="flex items-center gap-1.5">
          {WIZARD_STEPS.map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === currentStep ? "bg-[#E30613] w-6" : i < currentStep ? "bg-green-500" : "bg-slate-200"}`} />
          ))}
        </div>
        {currentStep < WIZARD_STEPS.length - 1 ? (
          <button
            onClick={() => setCurrentStep(currentStep + 1)}
            disabled={!canProceed()}
            className="flex items-center gap-2 px-5 py-2.5 text-sm text-white bg-[#E30613] rounded-lg hover:bg-[#c00510] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ fontWeight: 500 }}
          >
            Selanjutnya <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleFinalSubmit}
            disabled={!canProceed()}
            className="flex items-center gap-2 px-5 py-2.5 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ fontWeight: 500 }}
          >
            <Check className="w-4 h-4" /> {allMembersApproved ? "Submit Proposal" : "Simpan Draft"}
          </button>
        )}
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
