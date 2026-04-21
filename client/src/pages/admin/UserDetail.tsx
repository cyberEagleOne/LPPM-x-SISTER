export { UserDetail } from "./UserDetailModern";

import { useState, useRef, ChangeEvent } from "react";
import { Link } from "react-router";
import { PageWrapper } from "../../components/admin/PageWrapper";
import {
  User, Key, Image as ImageIcon, Edit, Trash2, Eye, EyeOff,
  X, CheckCircle, ChevronDown, ArrowLeft
} from "lucide-react";

// ──────────────────────────────────────────────────────────────
// DATA
// ──────────────────────────────────────────────────────────────

const JENIS_KELAMIN = [
  { id: 6, label: "Laki Laki" },
  { id: 7, label: "Perempuan" },
];

const PANGKAT = [
  { code: "asisten-ahli",  label: "Asisten Ahli" },
  { code: "lektor",        label: "Lektor" },
  { code: "lektor-kepala", label: "Lektor Kepala" },
  { code: "profesor",      label: "Profesor" },
  { code: "tenaga-pengajar", label: "Tenaga Pengajar" },
];

const FAKULTAS = [
  { id: 1, nama: "Fakultas Sains dan Teknologi" },
  { id: 3, nama: "Fakultas Pariwisata dan Seni Kuliner" },
  { id: 4, nama: "Fakultas Manajemen dan Humaniora" },
  { id: 5, nama: "Magister Teknik Informatika" },
];

const PRODI_BY_FAKULTAS: Record<number, { id: number; nama: string }[]> = {
  1: [
    { id: 1,  nama: "Informatika" },
    { id: 4,  nama: "Sistem Informasi" },
    { id: 8,  nama: "Perencanaan Wilayah dan Kota" },
    { id: 10, nama: "Arsitektur" },
    { id: 11, nama: "Teknik Sipil" },
    { id: 12, nama: "Desain Interior" },
    { id: 13, nama: "Desain Komunikasi Visual" },
    { id: 16, nama: "Magister Teknologi Informasi" },
  ],
  3: [
    { id: 3,  nama: "Hospitaliti dan Pariwisata" },
    { id: 14, nama: "Seni Kuliner" },
  ],
  4: [
    { id: 5,  nama: "Manajemen Retail" },
    { id: 9,  nama: "Akuntansi" },
    { id: 15, nama: "Manajemen Bisnis" },
  ],
  5: [
    { id: 16, nama: "Magister Teknologi Informasi" },
  ],
};

const BIDANG_BY_PRODI: Record<number, string[]> = {
  1:  ["Cybersecurity","Data Analyst","Data Science","Decision Support Systems & Data Science","Software Engineering","Artificial Intelligent","Blockchain","Computer Science Education","Data Security","Enterprise Architecture","Governance of Enterprise I&T","Information Systems","Intelligent System","Internet of Things","IoT","UI/UX","Information System","Mobile App","Software Development"],
  4:  ["Business Intelligence","Enterprise Systems","Information Technology Management","IT Governance","Knowledge Management","Systems Analysis","Web Engineering","Database Design","E-Business","Information Architecture"],
  8:  ["Urban Planning","Regional Development","Spatial Analysis","GIS","Transportation Planning","Environmental Planning","Housing & Settlement","Land Use Planning","Coastal Zone Management","Smart City"],
  10: ["Architecture and Environment","Education","Entrepreneurship","Green and Healthy","Monitoring & Evaluation","Participatory & Collaborative Design","Participatory Architecture","Pendampingan Desain","Project Management","Society and Culture","Sustainable Architecture","Community","Critical Regionalism","Desain Komputasional - Desain Parametrik","Green Architecture","Healing Environment","Health & Wellness","Healthy Building","Urban Design","Resilient Architecture"],
  11: ["Structural Engineering","Construction Management","Geotechnical Engineering","Water Resources","Transportation Engineering","Building Materials","Earthquake Engineering","Sustainability in Construction"],
  12: ["Interior Design","Space Planning","Furniture Design","Lighting Design","Sustainable Interior","Heritage Interior","Commercial Interior","Residential Interior"],
  13: ["Animasi","Brand Identity","Character Design","Fotografi dan Videografi","Animasi & Motion Graphics","Ilustrasi","Packaging","Tipografi Modern & Postmodern","Campaign","Komik","Motion Graphics","Semiotika","Surealism","3D Modeling","Asset Desain Permainan","Branding and Visual Identity","Desain Kampanye","Desain Antarmuka dan Pengalaman Pengguna","Desain Grafis Lingkungan"],
  16: ["Advanced Computing","Artificial Intelligence","Big Data","Cloud Computing","Cybersecurity Engineering","Machine Learning","Network Security","Software Architecture"],
  3:  ["Human Resource Management","F&B Management","Hotel Management","Sustainable Tourism","Gastronomi","Pengelolaan desa wisata","Perhotelan","Pemberdayaan Masyarakat","Hospitality","Kepemanduan","Hotel Operational","Accomodation","Culture","Destinasi Pariwisata","Destination","Destination Marketing","Entepreneurship","Food & Beverage","Gastronomy Tourism","Local Wisdom","Marketing Tourism","Special Interest Tourism","Tourism"],
  14: ["Culinary Arts","Food Science","Baking & Pastry","Food Entrepreneurship","Food Safety","Gastronomic Tourism","Food Photography","F&B Operations"],
  5:  ["Retail Management","Consumer Behavior","Supply Chain","Marketing Strategy","Visual Merchandising","Digital Marketing","Business Analytics"],
  9:  ["Financial Accounting","Management Accounting","Auditing","Taxation","Cost Accounting","Public Sector Accounting","Forensic Accounting"],
  15: ["Strategic Management","Entrepreneurship","International Business","Human Capital Management","Operations Management","Corporate Finance","Business Ethics"],
};

const BANKS = [
  { code: "14",  label: "Bank BCA" },
  { code: "8",   label: "Bank Mandiri" },
  { code: "9",   label: "Bank BNI" },
  { code: "427", label: "Bank Syariah Indonesia (eks BNI Syariah)" },
  { code: "2",   label: "Bank BRI" },
  { code: "451", label: "Bank Syariah Indonesia (eks Mandiri Syariah)" },
  { code: "22",  label: "Bank CIMB Niaga" },
  { code: "22b", label: "Bank CIMB Niaga Syariah" },
  { code: "147", label: "Bank Muamalat" },
  { code: "213", label: "Bank Tabungan Pensiunan Nasional (BTPN)" },
  { code: "213b",label: "JENIUS" },
  { code: "422", label: "Bank Syariah Indonesia (eks BRI Syariah)" },
  { code: "200", label: "Bank Tabungan Negara (BTN)" },
  { code: "13",  label: "Permata Bank" },
  { code: "11",  label: "Bank Danamon" },
  { code: "16",  label: "Bank BII Maybank" },
  { code: "426", label: "Bank Mega" },
  { code: "153", label: "Bank Sinarmas" },
  { code: "950", label: "Bank Commonwealth" },
  { code: "28",  label: "Bank OCBC NISP" },
  { code: "441", label: "Bank Bukopin" },
  { code: "536", label: "Bank BCA Syariah" },
  { code: "31",  label: "Citibank" },
  { code: "3",   label: "Bank Ekspor Indonesia" },
  { code: "19",  label: "Bank Panin" },
  { code: "20",  label: "Bank Arta Niaga Kencana" },
  { code: "110", label: "Bank Jabar dan Banten (BJB)" },
  { code: "111", label: "Bank DKI" },
  { code: "112", label: "BPD DIY" },
  { code: "113", label: "Bank Jateng" },
  { code: "114", label: "Bank Jatim" },
  { code: "115", label: "BPD Jambi" },
  { code: "116", label: "BPD Aceh / BPD Aceh Syariah" },
  { code: "117", label: "Bank Sumut" },
  { code: "118", label: "Bank Nagari" },
  { code: "119", label: "Bank Riau" },
  { code: "120", label: "Bank Sumsel Babel" },
  { code: "121", label: "Bank Lampung" },
  { code: "122", label: "Bank Kalsel" },
  { code: "123", label: "Bank Kalbar" },
  { code: "124", label: "Bank Kaltimtara" },
  { code: "125", label: "Bank Kalteng" },
  { code: "126", label: "Bank Sulselbar" },
  { code: "127", label: "Bank SulutGo" },
  { code: "128", label: "Bank NTB / NTB Syariah" },
  { code: "129", label: "BPD Bali" },
  { code: "130", label: "Bank NTT" },
  { code: "131", label: "Bank Maluku Malut" },
  { code: "132", label: "Bank Papua" },
  { code: "133", label: "Bank Bengkulu" },
  { code: "134", label: "Bank Sulteng" },
  { code: "135", label: "Bank Sultra" },
  { code: "137", label: "Bank Banten" },
  { code: "23",  label: "Bank UOB Indonesia" },
  { code: "30",  label: "American Express Bank LTD" },
  { code: "32",  label: "JP. Morgan Chase Bank, N.A" },
  { code: "33",  label: "Bank of America, N.A" },
  { code: "34",  label: "ING Indonesia Bank" },
  { code: "36",  label: "China Construction Bank Indonesia" },
  { code: "37",  label: "Bank Artha Graha Internasional" },
  { code: "39",  label: "Bank Credit Agricole Indosuez" },
  { code: "40",  label: "The Bangkok Bank Comp. LTD" },
  { code: "41",  label: "Bank HSBC" },
  { code: "42",  label: "The Bank of Tokyo Mitsubishi UFJ LTD" },
  { code: "46",  label: "Bank DBS Indonesia" },
  { code: "47",  label: "Bank Resona Perdania" },
  { code: "48",  label: "Bank Mizuho Indonesia" },
  { code: "50",  label: "Standard Chartered Bank" },
  { code: "53",  label: "Bank Keppel Tatlee Buana" },
  { code: "54",  label: "Bank Capital Indonesia" },
  { code: "57",  label: "Bank BNP Paribas Indonesia" },
  { code: "59",  label: "Korea Exchange Bank Danamon" },
  { code: "425", label: "Bank BJB Syariah" },
  { code: "61",  label: "Bank ANZ Indonesia" },
  { code: "67",  label: "Deutsche Bank AG" },
  { code: "69",  label: "Bank of China" },
  { code: "76",  label: "Bank Bumi Arta" },
  { code: "87",  label: "Bank Ekonomi" },
  { code: "95",  label: "Bank JTRUST" },
  { code: "97",  label: "Bank Mayapada" },
  { code: "145", label: "Bank Nusantara Parahyangan" },
  { code: "146", label: "Bank of India Indonesia" },
  { code: "151", label: "Bank Mestika Dharma" },
  { code: "152", label: "Bank Metro Express (Bank Shinhan Indonesia)" },
  { code: "157", label: "Bank Maspion Indonesia" },
  { code: "161", label: "Bank Ganesha" },
  { code: "162", label: "Bank Windu Kentjana" },
  { code: "164", label: "Bank ICBC Indonesia" },
  { code: "166", label: "Bank Harmoni International" },
  { code: "167", label: "Bank QNB Indonesia" },
  { code: "212", label: "Bank Woori Saudara" },
  { code: "405", label: "Bank Swaguna" },
  { code: "459", label: "Bank Bisnis Internasional" },
  { code: "466", label: "Bank Sri Partha" },
  { code: "472", label: "Bank Jasa Jakarta" },
  { code: "484", label: "Bank Bintang Manunggal" },
  { code: "485", label: "Bank MNC" },
  { code: "490", label: "Bank Yudha Bhakti" },
  { code: "494", label: "Bank BRI Agro" },
  { code: "498", label: "Bank SBI Indonesia" },
  { code: "501", label: "Bank Royal Indonesia" },
  { code: "503", label: "Bank National Nobu" },
  { code: "506", label: "Bank Syariah Mega" },
  { code: "513", label: "Bank Ina Perdana" },
  { code: "517", label: "Bank Harfa" },
  { code: "520", label: "Prima Master Bank" },
  { code: "521", label: "Bank Persyarikatan Indonesia" },
  { code: "523", label: "Bank Sahabat Sampoerna" },
  { code: "525", label: "Bank Akita" },
  { code: "526", label: "Liman International Bank" },
  { code: "531", label: "Anglomas Internasional Bank" },
  { code: "535", label: "Bank Kesejahteraan Ekonomi" },
  { code: "542", label: "Bank Artos IND" },
  { code: "547", label: "Bank Purba Danarta" },
  { code: "548", label: "Bank Multi Arta Sentosa" },
  { code: "553", label: "Bank Mayora Indonesia" },
  { code: "555", label: "Bank Index Selindo" },
  { code: "559", label: "Centratama Nasional Bank" },
  { code: "562", label: "Bank Fama Internasional" },
  { code: "564", label: "Bank Mandiri Taspen Pos" },
  { code: "566", label: "Bank Victoria International" },
  { code: "567", label: "Bank Harda" },
  { code: "688", label: "BPR KS" },
  { code: "945", label: "Bank Agris" },
  { code: "946", label: "Bank Merincorp" },
  { code: "947", label: "Bank Maybank Indocorp" },
  { code: "949", label: "Bank CTBC Indonesia" },
];

// ──────────────────────────────────────────────────────────────
// HELPER COMPONENTS
// ──────────────────────────────────────────────────────────────

const INPUT_CLS = "w-full px-3 py-1.5 text-[15px] border border-[#ced4da] rounded-sm focus:border-[#80bdff] focus:outline-none focus:ring-1 focus:ring-[#80bdff] h-[34px] bg-white";
const LABEL_CLS = "block text-[15px] font-bold mb-[5px]";
const DISABLED_CLS = "w-full px-3 py-1.5 text-[15px] bg-[#e9ecef] text-[#495057] border border-[#ced4da] rounded-sm h-[34px]";

function FieldRow({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div className="mb-4">
      <label className={LABEL_CLS}>
        {label}{required && <span className="text-[#dc3545] ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

// Simple multi-tag select component
function MultiTagSelect({
  options,
  selected,
  onChange,
  placeholder = "Ketik atau pilih...",
}: {
  options: string[];
  selected: string[];
  onChange: (val: string[]) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const filtered = options.filter(o => o.toLowerCase().includes(search.toLowerCase()) && !selected.includes(o));

  const add = (item: string) => { onChange([...selected, item]); setSearch(""); };
  const remove = (item: string) => onChange(selected.filter(s => s !== item));

  return (
    <div className="relative">
      <div
        className="flex flex-wrap gap-1 p-1 border border-[#ced4da] rounded-sm bg-white min-h-[34px] cursor-text"
        onClick={() => setOpen(true)}
      >
        {selected.map((tag) => (
          <span key={tag} className="flex items-center gap-1 px-2 py-0.5 bg-[#e4e4e4] text-[#333] rounded-[3px] text-[13px] border border-[#d4d4d4]">
            <button type="button" onClick={e => { e.stopPropagation(); remove(tag); }} className="text-[#a4a4a4] hover:text-[#555]">×</button>
            {tag}
          </span>
        ))}
        <input
          className="flex-1 min-w-[120px] outline-none border-none bg-transparent px-1 text-[15px]"
          placeholder={selected.length === 0 ? placeholder : ""}
          value={search}
          onChange={e => { setSearch(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
        />
      </div>
      {open && filtered.length > 0 && (
        <ul className="absolute z-20 w-full bg-white border border-[#ced4da] rounded-sm shadow-md max-h-[180px] overflow-y-auto mt-0.5">
          {filtered.map(opt => (
            <li
              key={opt}
              onMouseDown={() => add(opt)}
              className="px-3 py-1.5 text-[14px] hover:bg-[#007bff] hover:text-white cursor-pointer"
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
      {open && filtered.length === 0 && search && (
        <div className="absolute z-20 w-full bg-white border border-[#ced4da] rounded-sm shadow-md px-3 py-2 text-[13px] text-[#6c757d] mt-0.5">
          Tidak ada pilihan yang cocok
        </div>
      )}
    </div>
  );
}

// Image upload preview component
function ImageUpload({
  label,
  value,
  onChange,
  onRemove,
  size = 150,
}: {
  label?: string;
  value: string | null;
  onChange: (url: string) => void;
  onRemove: () => void;
  size?: number;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onChange(url);
  };

  return (
    <div>
      {label && <label className={LABEL_CLS}>{label}</label>}
      <div
        style={{ width: size, height: size }}
        className="border border-[#ced4da] bg-[#f8f9fa] mb-2 flex items-center justify-center overflow-hidden rounded-sm"
      >
        {value
          ? <img src={value} alt="preview" className="w-full h-full object-cover" />
          : <ImageIcon className="w-10 h-10 text-[#ced4da]" />
        }
      </div>
      <input type="file" accept="image/*" ref={ref} className="hidden" onChange={handleFile} />
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => ref.current?.click()}
          className="flex items-center gap-1 px-3 py-[5px] text-[14px] text-white bg-[#007bff] hover:bg-[#0069d9] border border-[transparent] rounded-[3px] transition-colors h-[34px]"
        >
          <ImageIcon className="w-3.5 h-3.5" /> Pilih
        </button>
        {value && (
          <button
            type="button"
            onClick={onRemove}
            className="flex items-center gap-1 px-3 py-[5px] text-[14px] text-white bg-[#dc3545] hover:bg-[#c82333] border border-transparent rounded-[3px] transition-colors h-[34px]"
          >
            <Trash2 className="w-3.5 h-3.5" /> Remove
          </button>
        )}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────

function LegacyUserDetail() {
  const [activeTab, setActiveTab] = useState<"account" | "profile">("account");

  // Simulate role — change to "dosen" to hide Back button
  const userRole: "administrator" | "dosen" = "administrator";

  // ── Account tab state ──
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ newPassword: "", confirmPassword: "" });
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // ── Profile: left column ──
  const [namaDepan, setNamaDepan] = useState("Super");
  const [namaBelakang, setNamaBelakang] = useState("Admin");
  const [aboutMe, setAboutMe] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState<number | "">(6);
  const [tanggalLahir, setTanggalLahir] = useState("");
  const [noTelp, setNoTelp] = useState("12345");
  const [bankAccount, setBankAccount] = useState("14");
  const [noRekening, setNoRekening] = useState("123456789");
  const [npwp, setNpwp] = useState("123456789");
  const [ttdUrl, setTtdUrl] = useState<string | null>(null);

  // ── Profile: right column ──
  const [fakultasId, setFakultasId] = useState<number | "">(1);
  const [prodiId,    setProdiId]    = useState<number | "">(1);
  const [pangkat,    setPangkat]    = useState("asisten-ahli");
  const [sintaId,    setSintaId]    = useState("1");
  const [sintaUrl,   setSintaUrl]   = useState("https://www.sintaurl.com/");
  const [gscholarUrl, setGscholarUrl] = useState("https://www.sintaurl.com/");
  const [gscholarSkor, setGscholarSkor] = useState("2");
  const [bidangPenelitian, setBidangPenelitian] = useState<string[]>(["Data Analyst"]);
  const [bidangPkm,        setBidangPkm]        = useState<string[]>(["Software Engineering"]);
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);

  // ── Derived: cascade dropdowns ──
  const prodiOptions = fakultasId ? (PRODI_BY_FAKULTAS[fakultasId] ?? []) : [];
  const bidangOptions = prodiId ? (BIDANG_BY_PRODI[prodiId as number] ?? []) : [];

  const handleFakultasChange = (id: number) => {
    setFakultasId(id);
    const prodiList = PRODI_BY_FAKULTAS[id] ?? [];
    const firstProdi = prodiList[0];
    setProdiId(firstProdi ? firstProdi.id : "");
    setBidangPenelitian([]);
    setBidangPkm([]);
  };

  const handleProdiChange = (id: number) => {
    setProdiId(id);
    setBidangPenelitian([]);
    setBidangPkm([]);
  };

  // ── Password modal ──
  const openPasswordModal = () => {
    setPasswordForm({ newPassword: "", confirmPassword: "" });
    setPasswordError("");
    setPasswordSuccess(false);
    setShowPasswordModal(true);
  };

  const handlePasswordSubmit = () => {
    if (passwordForm.newPassword.length < 8) {
      setPasswordError("Password minimal 8 karakter.");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Konfirmasi password tidak cocok.");
      return;
    }
    setPasswordError("");
    setPasswordSuccess(true);
    setTimeout(() => {
      setShowPasswordModal(false);
      setPasswordSuccess(false);
    }, 1500);
  };

  return (
    <PageWrapper
      title="Detail User"
      breadcrumbs={[{ label: "Home", path: "/admin" }, { label: "Detail User" }]}
    >
      <div className="flex flex-col md:flex-row gap-4 font-[Helvetica_Neue,Helvetica,Arial,sans-serif] text-[15px] text-[#333]">

        {/* ── Left Card: User Avatar ── */}
        <div className="w-full md:w-[300px] shrink-0">
          <div className="bg-white border-t-[3px] border-t-[#007bff] shadow-sm rounded-sm">
            <div className="p-5 text-center">
              <div className="w-[100px] h-[100px] rounded-full bg-[#6c757d] mx-auto mb-3 flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
                {fotoUrl
                  ? <img src={fotoUrl} alt="avatar" className="w-full h-full object-cover" />
                  : "S"
                }
              </div>
              <h3 className="text-[21px] font-medium leading-[1.2] mb-[2px]">
                {namaDepan} {namaBelakang}
              </h3>
              <p className="text-[#777] text-[14px]">Administrator</p>
            </div>
          </div>
        </div>

        {/* ── Right: Tabs ── */}
        <div className="flex-1 w-full overflow-hidden">
          <div className="bg-white shadow-sm rounded-sm border-t-[3px] border-t-transparent flex flex-col">

            {/* Tabs Header */}
            <ul className="flex flex-wrap pl-0 mb-0 border-b border-[#dee2e6] bg-[#007bff] text-white -mt-[3px] pt-[3px] rounded-t-sm gap-[2px]">
              <li>
                <button
                  onClick={() => setActiveTab("account")}
                  className={`flex items-center gap-1.5 px-[15px] py-[10px] text-[15px] transition-colors ${activeTab === "account" ? "bg-white text-[#495057] rounded-tl-sm rounded-tr-sm" : "text-white hover:text-white/80"}`}
                >
                  <Key className="w-4 h-4" /> Account
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`flex items-center gap-1.5 px-[15px] py-[10px] text-[15px] transition-colors ${activeTab === "profile" ? "bg-white text-[#495057] rounded-tl-sm rounded-tr-sm border-x border-[#dee2e6]" : "text-white hover:text-white/80"}`}
                >
                  <User className="w-4 h-4" fill={activeTab === "profile" ? "#495057" : "white"} /> Profile
                </button>
              </li>
            </ul>

            {/* ──────────── ACCOUNT TAB ──────────── */}
            {activeTab === "account" && (
              <div className="p-5 animate-in fade-in duration-200">
                <div className="max-w-lg">
                  <FieldRow label="NIDN">
                    <input type="text" value="525077202" disabled className={DISABLED_CLS} />
                  </FieldRow>
                  <FieldRow label="Email">
                    <input type="text" value="edisons.siregar@pradita.ac.id" disabled className={DISABLED_CLS} />
                  </FieldRow>
                  <button
                    onClick={openPasswordModal}
                    className="flex items-center gap-1.5 px-3 py-[5px] text-[14px] text-white bg-[#dc3545] hover:bg-[#c82333] border border-[#dc3545] hover:border-[#bd2130] rounded-[3px] transition-colors h-[34px] mt-2"
                  >
                    <Key className="w-4 h-4" /> Ganti Password
                  </button>
                </div>
              </div>
            )}

            {/* ──────────── PROFILE TAB ──────────── */}
            {activeTab === "profile" && (
              <div className="p-5 animate-in fade-in duration-200">
                {/* Update Profile button */}
                <div className="flex justify-end mb-4">
                  <button className="flex items-center gap-1.5 px-3 py-[5px] text-[14px] text-white bg-[#28a745] hover:bg-[#218838] border border-[#28a745] hover:border-[#1e7e34] rounded-[3px] transition-colors h-[34px]">
                    <Edit className="w-4 h-4" /> Update Profile
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-0">

                  {/* ── Left Column ── */}
                  <div>
                    <FieldRow label="Nama Depan">
                      <input type="text" value={namaDepan} onChange={e => setNamaDepan(e.target.value)} className={INPUT_CLS} />
                    </FieldRow>
                    <FieldRow label="Nama Belakang">
                      <input type="text" value={namaBelakang} onChange={e => setNamaBelakang(e.target.value)} className={INPUT_CLS} />
                    </FieldRow>
                    <FieldRow label="About Me">
                      <textarea
                        rows={3}
                        value={aboutMe}
                        onChange={e => setAboutMe(e.target.value)}
                        className="w-full px-3 py-1.5 text-[15px] border border-[#ced4da] rounded-sm focus:border-[#80bdff] focus:outline-none focus:ring-1 focus:ring-[#80bdff] resize-none"
                      />
                    </FieldRow>
                    <FieldRow label="Jenis Kelamin">
                      <div className="relative">
                        <select
                          value={jenisKelamin}
                          onChange={e => setJenisKelamin(Number(e.target.value))}
                          className={INPUT_CLS + " appearance-none pr-8"}
                        >
                          {JENIS_KELAMIN.map(jk => (
                            <option key={jk.id} value={jk.id}>{jk.label}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6c757d] pointer-events-none" />
                      </div>
                    </FieldRow>
                    <FieldRow label="Tanggal Lahir">
                      <input
                        type="datetime-local"
                        value={tanggalLahir}
                        onChange={e => setTanggalLahir(e.target.value)}
                        className={INPUT_CLS}
                      />
                    </FieldRow>
                    <FieldRow label="No. Telp">
                      <input type="tel" value={noTelp} onChange={e => setNoTelp(e.target.value)} className={INPUT_CLS} />
                    </FieldRow>
                    <FieldRow label="Bank Account">
                      <div className="relative">
                        <select
                          value={bankAccount}
                          onChange={e => setBankAccount(e.target.value)}
                          className={INPUT_CLS + " appearance-none pr-8"}
                        >
                          {BANKS.map(b => (
                            <option key={b.code} value={b.code}>{b.label}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6c757d] pointer-events-none" />
                      </div>
                    </FieldRow>
                    <FieldRow label="No. Rekening" required>
                      <input type="text" value={noRekening} onChange={e => setNoRekening(e.target.value)} className={INPUT_CLS} />
                    </FieldRow>
                    <FieldRow label="NPWP" required>
                      <input type="text" value={npwp} onChange={e => setNpwp(e.target.value)} className={INPUT_CLS} />
                    </FieldRow>
                    <FieldRow label="Tanda Tangan Digital">
                      <ImageUpload
                        value={ttdUrl}
                        onChange={setTtdUrl}
                        onRemove={() => setTtdUrl(null)}
                        size={150}
                      />
                    </FieldRow>
                  </div>

                  {/* ── Right Column ── */}
                  <div>
                    {/* Fakultas (changes Prodi) */}
                    <FieldRow label="Fakultas">
                      <div className="relative">
                        <select
                          value={fakultasId}
                          onChange={e => handleFakultasChange(Number(e.target.value))}
                          className={INPUT_CLS + " appearance-none pr-8"}
                        >
                          <option value="">-- Pilih Fakultas --</option>
                          {FAKULTAS.map(f => (
                            <option key={f.id} value={f.id}>{f.nama}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6c757d] pointer-events-none" />
                      </div>
                      <p className="text-[12px] text-[#6c757d] mt-1">Mengubah ini akan mereset pilihan Program Study</p>
                    </FieldRow>

                    {/* Prodi (changes Bidang Fokus) */}
                    <FieldRow label="Program Study">
                      <div className="relative">
                        <select
                          value={prodiId}
                          onChange={e => handleProdiChange(Number(e.target.value))}
                          disabled={prodiOptions.length === 0}
                          className={INPUT_CLS + " appearance-none pr-8 disabled:bg-[#e9ecef] disabled:text-[#6c757d]"}
                        >
                          <option value="">-- Pilih Program Study --</option>
                          {prodiOptions.map(p => (
                            <option key={p.id} value={p.id}>{p.nama}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6c757d] pointer-events-none" />
                      </div>
                      <p className="text-[12px] text-[#6c757d] mt-1">Mengubah ini akan mereset Bidang Fokus</p>
                    </FieldRow>

                    <FieldRow label="Pangkat / Jabatan Akademik">
                      <div className="relative">
                        <select
                          value={pangkat}
                          onChange={e => setPangkat(e.target.value)}
                          className={INPUT_CLS + " appearance-none pr-8"}
                        >
                          {PANGKAT.map(p => (
                            <option key={p.code} value={p.code}>{p.label}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6c757d] pointer-events-none" />
                      </div>
                    </FieldRow>
                    <FieldRow label="Sinta ID">
                      <input type="text" value={sintaId} onChange={e => setSintaId(e.target.value)} className={INPUT_CLS} />
                    </FieldRow>
                    <FieldRow label="Sinta URL">
                      <input type="url" value={sintaUrl} onChange={e => setSintaUrl(e.target.value)} className={INPUT_CLS} placeholder="https://" />
                    </FieldRow>
                    <FieldRow label="Google Scholar URL">
                      <input type="url" value={gscholarUrl} onChange={e => setGscholarUrl(e.target.value)} className={INPUT_CLS} placeholder="https://" />
                    </FieldRow>
                    <FieldRow label="Google Scholar Skor">
                      <input type="number" value={gscholarSkor} onChange={e => setGscholarSkor(e.target.value)} className={INPUT_CLS} min="0" />
                    </FieldRow>

                    {/* Bidang Fokus Penelitian */}
                    <FieldRow label="Bidang Fokus Penelitian">
                      {bidangOptions.length > 0 ? (
                        <MultiTagSelect
                          options={bidangOptions}
                          selected={bidangPenelitian}
                          onChange={setBidangPenelitian}
                          placeholder="Pilih bidang penelitian..."
                        />
                      ) : (
                        <div className="px-3 py-1.5 h-[34px] flex items-center text-[14px] text-[#6c757d] border border-[#ced4da] rounded-sm bg-[#e9ecef]">
                          Pilih Program Study terlebih dahulu
                        </div>
                      )}
                    </FieldRow>

                    {/* Bidang Fokus PKM */}
                    <FieldRow label="Bidang Fokus PKM">
                      {bidangOptions.length > 0 ? (
                        <MultiTagSelect
                          options={bidangOptions}
                          selected={bidangPkm}
                          onChange={setBidangPkm}
                          placeholder="Pilih bidang PKM..."
                        />
                      ) : (
                        <div className="px-3 py-1.5 h-[34px] flex items-center text-[14px] text-[#6c757d] border border-[#ced4da] rounded-sm bg-[#e9ecef]">
                          Pilih Program Study terlebih dahulu
                        </div>
                      )}
                    </FieldRow>

                    {/* Foto Profil */}
                    <FieldRow label="Foto Profil">
                      <ImageUpload
                        value={fotoUrl}
                        onChange={url => { setFotoUrl(url); }}
                        onRemove={() => setFotoUrl(null)}
                        size={150}
                      />
                    </FieldRow>
                  </div>
                </div>
              </div>
            )}

            {/* ── Footer: Back button (Admin only) ── */}
            {userRole === "administrator" && (
              <div className="p-3 bg-[#f8f9fa] border-t border-[#dee2e6]">
                <Link
                  to="/admin/users"
                  className="flex items-center gap-1.5 px-3 py-[5px] text-[14px] font-normal text-[#333] bg-white hover:bg-[#e2e6ea] border border-[#ccc] hover:border-[#dae0e5] rounded-[3px] transition-colors h-[34px] w-max"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </Link>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ──────────── MODAL GANTI PASSWORD ──────────── */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowPasswordModal(false)} />
          <div className="relative bg-white rounded-sm shadow-xl w-full max-w-md mx-4 z-10 font-[Helvetica_Neue,Helvetica,Arial,sans-serif]">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#dee2e6] bg-[#f8f9fa] rounded-t-sm">
              <h5 className="text-[16px] font-semibold text-[#333] flex items-center gap-2">
                <Key className="w-4 h-4 text-[#dc3545]" /> Ganti Password
              </h5>
              <button onClick={() => setShowPasswordModal(false)} className="text-[#6c757d] hover:text-[#333] transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-5 py-5">
              {passwordSuccess ? (
                <div className="flex flex-col items-center py-4 gap-3">
                  <CheckCircle className="w-12 h-12 text-[#28a745]" />
                  <p className="text-[15px] text-[#28a745] font-semibold">Password berhasil diubah!</p>
                </div>
              ) : (
                <>
                  <div className="mb-4 p-3 bg-[#e9ecef] rounded-sm border border-[#dee2e6] text-[14px] text-[#495057]">
                    Mengubah password untuk: <span className="font-bold text-[#333]">Raka Pratama</span>
                    <span className="block text-[13px] text-[#777]">edisons.siregar@pradita.ac.id</span>
                  </div>

                  {passwordError && (
                    <div className="mb-4 px-3 py-2 bg-[#f8d7da] border border-[#f5c6cb] rounded-sm text-[#721c24] text-[14px]">
                      {passwordError}
                    </div>
                  )}

                  {/* New Password */}
                  <div className="mb-4">
                    <label className={LABEL_CLS}>Password Baru</label>
                    <div className="relative">
                      <input
                        type={showNewPass ? "text" : "password"}
                        value={passwordForm.newPassword}
                        onChange={e => setPasswordForm(p => ({ ...p, newPassword: e.target.value }))}
                        placeholder="Minimal 8 karakter"
                        className="w-full px-3 py-1.5 pr-10 text-[15px] border border-[#ced4da] rounded-sm focus:border-[#80bdff] focus:outline-none focus:ring-1 focus:ring-[#80bdff] h-[34px]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPass(v => !v)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-[#6c757d] hover:text-[#333]"
                      >
                        {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {passwordForm.newPassword.length > 0 && (
                      <div className="mt-1.5">
                        <div className="h-1 w-full bg-[#dee2e6] rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-300 ${
                            passwordForm.newPassword.length < 6 ? "w-1/4 bg-[#dc3545]"
                            : passwordForm.newPassword.length < 10 ? "w-1/2 bg-[#ffc107]"
                            : "w-full bg-[#28a745]"
                          }`} />
                        </div>
                        <span className="text-[12px] text-[#6c757d]">
                          {passwordForm.newPassword.length < 6 ? "Lemah" : passwordForm.newPassword.length < 10 ? "Sedang" : "Kuat"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="mb-2">
                    <label className={LABEL_CLS}>Konfirmasi Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPass ? "text" : "password"}
                        value={passwordForm.confirmPassword}
                        onChange={e => setPasswordForm(p => ({ ...p, confirmPassword: e.target.value }))}
                        placeholder="Ulangi password baru"
                        className={`w-full px-3 py-1.5 pr-10 text-[15px] border rounded-sm focus:outline-none focus:ring-1 h-[34px] ${
                          passwordForm.confirmPassword && passwordForm.confirmPassword !== passwordForm.newPassword
                            ? "border-[#dc3545] focus:border-[#dc3545] focus:ring-[#dc3545]/30"
                            : "border-[#ced4da] focus:border-[#80bdff] focus:ring-[#80bdff]"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPass(v => !v)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-[#6c757d] hover:text-[#333]"
                      >
                        {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {passwordForm.confirmPassword && passwordForm.confirmPassword !== passwordForm.newPassword && (
                      <p className="text-[12px] text-[#dc3545] mt-1">Password tidak cocok</p>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            {!passwordSuccess && (
              <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-[#dee2e6] bg-[#f8f9fa] rounded-b-sm">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="flex items-center gap-1.5 px-3 py-[5px] text-[14px] text-[#333] bg-white hover:bg-[#e2e6ea] border border-[#ccc] rounded-[3px] transition-colors h-[34px]"
                >
                  Batal
                </button>
                <button
                  onClick={handlePasswordSubmit}
                  className="flex items-center gap-1.5 px-3 py-[5px] text-[14px] text-white bg-[#007bff] hover:bg-[#0069d9] border border-[#007bff] rounded-[3px] transition-colors h-[34px]"
                >
                  <Key className="w-4 h-4" /> Simpan Password
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
