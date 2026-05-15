import { useState, useEffect, useRef } from "react";
import {
  Plus, Search, Eye, Edit, Trash2, Send, FileText, CheckCircle,
  ChevronLeft, ChevronRight, ChevronDown, RotateCcw, Download, BookOpen, 
  AlertCircle, ExternalLink, RefreshCw, Calendar, Clock, Info, X
} from "lucide-react";
import { PageWrapper } from "../../components/PageWrapper";
import { StatusBadge, type StatusType } from "../../components/StatusBadge";
import { EmptyState } from "../../components/EmptyState";
import { ConfirmModal } from "../../components/ConfirmModal";
import { SkeletonTable } from "../../components/SkeletonLoader";
import { StepperStatus } from "../../components/StepperStatus";
import { SearchableSelect } from "../../components/SearchableSelect";
import { SyncSisterModal } from "../../components/SyncSisterModal";
import { useAuth } from "../../context/AuthContext";
import { PublikasiPenulis, PublikasiDokumen} from "../../../../../../shared/models"

/* ────────────────── Types ────────────────── */

export type JenisPublikasi = "artikel" | "buku" | "haki" | "prototipe";

export interface PeriodePublikasi {
  id: string;
  tahun: string;
  semester: string;
  aktif: boolean;
  deadlines?: PeriodeDeadlines;
}

export interface PeriodeDeadlines {
  submissionStart: string | null;
  submissionDeadline: string | null;
  revisionDeadline: string | null;
  coordinatorDeadline: string | null;
  ketuaLppmDeadline: string | null;
  freezeStart: string | null;
  freezeEnd: string | null;
  keterangan: string | null;
}

export interface RiwayatAktivitas {
  id: string;
  tanggal: string; 
  status: string;
  aktor: string;
  peran: string; // Contoh: "Dosen", "Reviewer", "Admin LPPM"
  catatan?: string | null;
}

export interface PublikasiItem {
  id: string;
  periodeId: string;
  jenis_publikasi?: string; 
  jenis: JenisPublikasi;
  judul: string;
  quartile?: number | "";   
  kategori_kegiatan?: string;
  kategori_capaian_luaran?: string;
  // Artikel
  nama_jurnal?: string;
  doi?: string;
  tautan?: string;
  jenisJurnal?: string;
  issn?: string;
  halaman?: string;
  edisi?: string;
  volume?: number;
  nomor?: number;
  keterangan?: string;
  // Buku
  penerbit?: string;
  isbn?: string;
  jumlah_halaman: number | null;
  // HaKI
  nomorSertifikat?: string;
  jenisHaki?: string;
  // Prototipe
  namaProto?: string;
  jenisProto?: string;
  urlDokumen?: string;
  // Common
  tanggal: string;
  status: StatusType;
  tanggalDibuat: string;
  urutanPenulis: number | "";
  penulisDosen: PublikasiPenulis[];
  penulisMahasiswa: PublikasiPenulis[];
  riwayat?: RiwayatAktivitas[];
  dokumen: PublikasiDokumen[];
}

type ViewMode = "periode" | "list" | "form" | "detail";

/* ────────────────── Constants ────────────────── */

export const KATEGORI_CAPAIAN_LUARAN_MAP = [
  {id: null, label: "Unknown"},
  {id: 1, label: "Produk Teknologi Tepat Guna"},
  {id: 2, label: "Jenis Luaran Lainnya"},
  {id: 3, label: "Publikasi"},
  {id: 4, label: "HKI"},
  {id: 5, label: "Buku"},
  {id: 6, label: "Pembicara"},
  {id: 7, label: "Visiting Scientist"}
];

export const KATEGORI_KEGIATAN_MAP = [
  { id: 130600, label: "Hasil kegiatan pengabdian kepada masyarakat yang dipublikasikan di sebuah berkala/jurnal ilmiah pengabdian kepada masyarakat atau teknologi tepat guna, merupakan diseminasi dari luaran program kegiatan pengabdian kepada masyarakat, tiap karya" },
  { id: 120903, label: "Hasil penelitian atau hasil pemikiran yang Dipresentasikan secara oral dan dimuat dalam prosiding yang dipublikasikan (ber ISSN/ISBN): Internasional" },
  { id: 120901, label: "Hasil penelitian atau hasil pemikiran yang Dipresentasikan secara oral dan dimuat dalam prosiding yang dipublikasikan (ber ISSN/ISBN): Internasional terindeks pada Scimagojr dan Scopus" },
  { id: 120902, label: "Hasil penelitian atau hasil pemikiran yang Dipresentasikan secara oral dan dimuat dalam prosiding yang dipublikasikan (ber ISSN/ISBN): Internasional terindeks Scopus, IEEE Explore, SPIE" },
  { id: 120904, label: "Hasil penelitian atau hasil pemikiran yang Dipresentasikan secara oral dan dimuat dalam prosiding yang dipublikasikan (ber ISSN/ISBN): Nasional" },
  { id: 120905, label: "Hasil penelitian atau hasil pemikiran yang disajikan dalam bentuk poster dan dimuat dalam prosiding yang dipublikasikan dalam seminar internasional" },
  { id: 120906, label: "Hasil penelitian atau hasil pemikiran yang disajikan dalam bentuk poster dan dimuat dalam prosiding yang dipublikasikan dalam seminar nasional" },
  { id: 120911, label: "Hasil penelitian atau hasil pemikiran yang disajikan dalam koran/majalah populer/umum" },
  { id: 120907, label: "Hasil penelitian atau hasil pemikiran yang Disajikan dalam seminar/simposium/lokakarya, tetapi tidak dimuat dalam prosiding yang dipublikasikan: Internasional" },
  { id: 120908, label: "Hasil penelitian atau hasil pemikiran yang Disajikan dalam seminar/simposium/lokakarya, tetapi tidak dimuat dalam prosiding yang dipublikasikan: nasional" },
  { id: 120909, label: "Hasil penelitian atau hasil pemikiran yang tidak disajikan dalam seminar/simposium/lokakarya, tetapi dimuat dalam prosiding: Internasional" },
  { id: 120910, label: "Hasil penelitian atau hasil pemikiran yang tidak disajikan dalam seminar/simposium/lokakarya, tetapi dimuat dalam prosiding: Nasional" },
  { id: 121300, label: "Hasil penelitian atau pemikiran atau kerjasama industri termasuk penelitian penugasan dari kementerian atau LPNK yang tidak dipublikasikan (tersimpan dalam perpustakaan) yang dilakukan secara melembaga" },
  { id: 120103, label: "Hasil penelitian/hasil pemikiran dalam buku yang dipublikasikan dan berisi berbagai tulisan dari berbagai penulis (book chapter) internasional" },
  { id: 120104, label: "Hasil penelitian/hasil pemikiran dalam buku yang dipublikasikan dan berisi berbagai tulisan dari berbagai penulis (book chapter) nasional" },
  { id: 120113, label: "Hasil penelitian/pemikiran yang dipresentasikan secara oral dan dimuat dalam prosiding yang dipublikasikan (ber ISBN/ISSN) dalam seminar internasional" },
  { id: 120114, label: "Hasil penelitian/pemikiran yang dipresentasikan secara oral dan dimuat dalam prosiding yang dipublikasikan (ber ISBN/ISSN) dalam seminar nasional" }, // Mengabaikan ID 0
  { id: 120102, label: "Hasil penelitian/pemikiran yang dipublikasikan dalam bentuk buku referensi" },
  { id: 120112, label: "Hasil penelitian/pemikiran yang dipublikasikan dalam bentuk jurnal ilmiah yang ditulis dalam Bahasa Resmi PBB namun tidak memenuhi syarat-syarat sebagai jurnal ilmiah internasional" },
  { id: 120105, label: "Hasil penelitian/pemikiran yang dipublikasikan dalam bentuk jurnal internasional bereputasi" },
  { id: 120107, label: "Hasil penelitian/pemikiran yang dipublikasikan dalam bentuk jurnal internasional terindeks pada basis data internasional" },
  { id: 120106, label: "Hasil penelitian/pemikiran yang dipublikasikan dalam bentuk jurnal internasional terindeks pada database internasional bereputasi" },
  { id: 120111, label: "Hasil penelitian/pemikiran yang dipublikasikan dalam bentuk jurnal nasional" }, // Mengabaikan 0, menggunakan 120111
  { id: 120109, label: "Hasil penelitian/pemikiran yang dipublikasikan dalam bentuk jurnal nasional berbahasa Indonesia terindeks pada DOAJ" },
  { id: 120110, label: "Hasil penelitian/pemikiran yang dipublikasikan dalam bentuk jurnal nasional berbahasa Inggris atau bahasa resmi PBB terindeks pada DOAJ" },
  { id: 120108, label: "Hasil penelitian/pemikiran yang dipublikasikan dalam bentuk jurnal nasional terakreditasi Kemenristekdikti" }, // Mengabaikan 0
  { id: 120101, label: "Hasil penelitian/pemikiran yang dipublikasikan dalam bentuk monograf" },
  { id: 120121, label: "Hasil penelitian/pemikiran yang disajikan dalam koran/majalah populer/umum" },
  { id: 130500, label: "Membuat/menulis karya pengabdian pada masyarakat yang tidak dipublikasikan" },
  { id: 120200, label: "Menerjemahkan/menyadur buku ilmiah yang diterbitkan (ber ISBN)" },
  { id: 120300, label: "Mengedit/menyunting karya ilmiah dalam bentuk buku yang diterbitkan (ber ISBN)" }
];

export const KATEGORI_JURNAL_ARTIKEL = [
  {id: 24, label: "Jurnal internasional bereputasi"},
  {id: 23, label: "Jurnal internasional"},
  {id: 22, label: "Jurnal nasional terakreditasi"},
  {id: 21, label: "Jurnal nasional"},
  {id: 25, label: "Artikel ilmiah"},
  {id: 26, label: "Makalah ilmiah"},
  {id: 27, label: "Tulisan ilmiah"},
  {id: 32, label: "Prosiding seminar internasional"},
  {id: 31, label: "Prosiding seminar nasional"},
  {id: 34, label: "Poster seminar internasional"},
  {id: 9999, label: "Lain-lain"}
];

export const KATEGORI_BUKU = [
  {id: 12, label: "Buku referensi"},
  {id: 11, label: "Monograf"},
  {id: 15, label: "Book chapter internasional"},
  {id: 14, label: "Book chapter nasional"},
  {id: 61, label: "Koran/majalah populer/majalah umum"},
  {id: 71, label: "Hasil penelitian/pemikiran yang tidak dipublikasikan"},
  {id: 13, label: "Buku lainnya"}
];

export const JENIS_JURNAL_OPTIONS = ["Sinta 1", "Sinta 2", "Sinta 3", "Sinta 4", "Sinta 5", "Sinta 6", "Scopus Q1", "Scopus Q2", "Scopus Q3", "Scopus Q4", "Prosiding Terindeks", "Prosiding Nasional"];
export const JENIS_HAKI_OPTIONS = ["Hak Cipta", "Paten", "Paten Sederhana", "Merek", "Desain Industri"];
export const JENIS_PROTO_OPTIONS = ["Perangkat Lunak", "Perangkat Keras", "Modul", "Sistem", "Alat"];

export const NEW_PERIODE: PeriodePublikasi[] = [
{ 
    id: "2025/2026-Genap", 
    tahun: "2025/2026", 
    semester: "Genap", 
    aktif: true,
    deadlines: {
      submissionStart: "2026-03-01",
      submissionDeadline: "2026-05-31",
      revisionDeadline: "2026-06-15",
      coordinatorDeadline: "2026-06-30",
      ketuaLppmDeadline: "2026-07-15",
      freezeStart: "2026-07-16",
      freezeEnd: "2026-08-01",
      keterangan: "Periode pelaporan publikasi semester ganjil tahun ajaran 2026/2027. Keterlambatan tidak akan diproses."
    }
  },
  { id: "UNKNOWN-PERIODE", tahun: "Tidak Diketahui", semester: "Waktu", aktif: false }
]; 


export const JENIS_LABELS: Record<JenisPublikasi, string> = {
  artikel: "Artikel",
  buku: "Buku",
  haki: "Kekayaan Intelektual (KI)",
  prototipe: "Prototipe",
};

export const JENIS_COLORS: Record<JenisPublikasi, string> = {
  artikel: "bg-blue-100 text-blue-700",
  buku: "bg-emerald-100 text-emerald-700",
  haki: "bg-purple-100 text-purple-700",
  prototipe: "bg-amber-100 text-amber-700",
};


export const inputClass = (hasError?: boolean) =>
  `w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all bg-slate-50/50 placeholder:text-slate-400 disabled:opacity-40 disabled:cursor-not-allowed ${
    hasError ? "border-red-300 focus:ring-red-200" : "border-slate-200 focus:ring-[#E30613]/20 focus:border-[#E30613]/40"
}`;

export const FormField = ({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 500 }}>
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {error && <p className="flex items-center gap-1 text-xs text-red-500 mt-1"><AlertCircle className="w-3 h-3" /> {error}</p>}
  </div>
);

/* ────────────────── Utils ────────────────── */
  const isSubmissionOpen = (periode: PeriodePublikasi | null) => {
    if (!periode || !periode.aktif) return false;

    if (!periode.deadlines?.submissionStart || !periode.deadlines?.submissionDeadline) return true;

    const now = new Date();
    const start = new Date(periode.deadlines.submissionStart);
    const end = new Date(periode.deadlines.submissionDeadline);
    end.setHours(23, 59, 59, 999);

    return now >= start && now <= end;
  };

    const getJenisFromJenisPublikasi = (jp?: string): JenisPublikasi => {
    const text = (jp || "").toLowerCase();

    if (
      text.includes("buku") || 
      text.includes("book") || 
      text.includes("monograf") || 
      text.includes("koran") || 
      text.includes("penelitian")
    ) {
      return "buku";
    }

    if (text.includes("haki") || text.includes("paten") || text.includes("cipta") || text.includes("merek")) {
      return "haki";
    }
    if (text.includes("prototipe") || text.includes("sistem") || text.includes("alat")) {
      return "prototipe";
    }

    return "artikel"; 
  };

  const getPeriodeFromDate = (tanggalString: string) => {
    if (!tanggalString || tanggalString.toLowerCase() === "unknown") {
      return "UNKNOWN-PERIODE";
    }

    const date = new Date(tanggalString);
    
    if (isNaN(date.getTime())) {
      return "UNKNOWN-PERIODE";
    }

    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    let tahunAjaran = "";
    let semester = "";

    if (month >= 8 || month === 1) {
      semester = "Ganjil";
      const startYear = month === 1 ? year - 1 : year;
      tahunAjaran = `${startYear}/${startYear + 1}`;
    } else {
      semester = "Genap";
      tahunAjaran = `${year - 1}/${year}`;
    }

    return `${tahunAjaran}-${semester}`;
  };

    const formatTanggalIndo = (tanggalString: string) => {
    if (!tanggalString || tanggalString.toLowerCase() === "unknown") return "Tidak Diketahui";
    if (/^\d{4}$/.test(tanggalString)) return tanggalString;  
    
    const date = new Date(tanggalString);
    if (isNaN(date.getTime())) return tanggalString; 

    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };


/* ────────────────── Main Component ────────────────── */

export function DosenPublikasiPage({ jenisParam }: { jenisParam?: JenisPublikasi }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("periode");
  const [selectedPeriode, setSelectedPeriode] = useState<PeriodePublikasi | null>(null);
  const [selectedItem, setSelectedItem] = useState<PublikasiItem | null>(null);
  const [editingItem, setEditingItem] = useState<PublikasiItem | null>(null);
  const [publikasiList, setPublikasiList] = useState<PublikasiItem[]>([]);
  const [periodeList, setPeriodeList] = useState<PeriodePublikasi[]>([]);
  const [filterJenis, setFilterJenis] = useState<JenisPublikasi | "semua">(jenisParam || "semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [showEmptyPeriods, setShowEmptyPeriods] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const formRef = useRef<HTMLDivElement>(null);
  const [confirmModal, setConfirmModal] = useState({ open: false, title: "", message: "", variant: "danger" as "danger" | "warning" | "success", onConfirm: () => {} });
  const [toast, setToast] = useState({ show: false, message: "", type: "success" as "success" | "error" });
  const [isSyncing, setIsSyncing] = useState(false);
  const [deadlinePopup, setDeadlinePopup] = useState<PeriodePublikasi | null>(null);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const perPage = 8;

  const handleSync = async () => {
    try {
      setIsSyncing(true);
      
      // for now
      const response = await fetch(`http://localhost:3000/api/sdm/publikasi/sync`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_user: user?.id }) 
      });
      
      const result = await response.json();

      if (result.status === 'success') {
        showToast("Sinkronisasi SISTER berhasil", "success");
        await fetchPublikasi(); 
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      showToast(error.message || "Gagal melakukan sinkronisasi", "error");
    } finally {
      setIsSyncing(false); 
    }
  };

  const emptyForm = (): Omit<PublikasiItem, "id" | "tanggalDibuat" | "status"> => ({
    periodeId: selectedPeriode?.id || "",
    jenis: jenisParam || "artikel",
    jenis_publikasi: "", 
    quartile: "",
    kategori_kegiatan: "",  
    kategori_capaian_luaran: "",      
    judul: "",
    nama_jurnal: "",
    doi: "", 
    tautan: "",
    jenisJurnal: "",
    issn: "",
    halaman: "",
    edisi: "",
    volume: 0,
    nomor: 0,
    keterangan: "",
    penerbit: "", isbn: "", jumlah_halaman: null,
    nomorSertifikat: "", jenisHaki: "",
    namaProto: "", jenisProto: "", urlDokumen: "",
    tanggal: new Date().toISOString().split("T")[0],
    urutanPenulis: "",
    penulisDosen: [],
    penulisMahasiswa: [],
    dokumen: []
  });
  
    const fetchPublikasi = async () => {
      try {
        setLoading(true);
        if (!user?.id) return;

        const response = await fetch(`http://localhost:3000/api/sdm/publikasi?dosen_id=${user.id}`);
        if (!response.ok) throw new Error(`Server error: ${response.status}`);
        const result = await response.json();

        if (result.status === 'success') {
          // DEBUG 1: CEK DATA MENTAH DARI DATABASE
          console.group("DEBUGGING PUBLIKASI");
          console.log("1. Total Data Asli dari Backend:", result.data.length);
          console.log("   Isi Data Asli:", result.data);

          const dataDenganPeriode = result.data.map((item: any) => {
            const rawTanggal = item.tanggalDibuat || item.tanggal || "";
            const isUnknown = !rawTanggal || rawTanggal.toLowerCase() === "unknown";
            const idPublikasi = item.id;

            const penulisDosen: PublikasiPenulis[] = [];
            const penulisMahasiswa: PublikasiPenulis[] = [];
            const dokumen: PublikasiDokumen[] = [];

            if (item.tim_penulis && Array.isArray(item.tim_penulis)) {
                item.tim_penulis.forEach((p: any) => {
                    if (p.jenis === "Dosen") {
                        penulisDosen.push({
                          id_penulis: p.id_penulis || Math.random().toString(),
                          nama: p.nama || "Unknown",
                          afiliasi: p.afiliasi || "-",
                          urutan: p.urutan || "-",
                          id_publikasi: idPublikasi,
                          jenis: "Dosen",
                          id_sdm: p.id_sdm || "-",
                          id_peserta_didik: p.id_peserta_didik || "-",
                          nomor_induk_peserta_didik: p.nomor_induk_peserta_didik || "-",
                          id_orang: p.id_orang || "-",
                          corresponding_author: p.corresponding_author || "-",
                          peran: p.peran,
                          id: p.id
                        });
                    } 
                    else if (p.jenis === "Mahasiswa") {
                        penulisMahasiswa.push({
                          id_penulis: p.id_penulis || Math.random().toString(),
                          nama: p.nama || "Unknown",
                          afiliasi: p.afiliasi || "-",
                          urutan: p.urutan || "-",
                          id_publikasi: idPublikasi,
                          jenis: "Dosen",
                          id_sdm: p.id_sdm || "-",
                          id_peserta_didik: p.id_peserta_didik || "-",
                          nomor_induk_peserta_didik: p.nomor_induk_peserta_didik || "-",
                          id_orang: p.id_orang || "-",
                          corresponding_author: p.corresponding_author || "-",
                          peran: p.peran,
                          id: p.id
                        });
                    }
                });
            }

            if(item.dokumen && Array.isArray(item.dokumen)){
              item.dokumen.forEach((d: any) => {
                dokumen.push({
                  id: d.id || Math.random().toString(),
                  id_publikasi: idPublikasi,
                  nama: d.nama || "Unknown",
                  jenis_dokumen: d.jenis_dokumen || "-",
                  nama_file: d.nama_file || "Unknown",
                  jenis_file: d.jenis_file || "-",
                  tanggal_upload: d.tanggal_upload || "-",
                  tautan: d.tautan || "-",
                  keterangan: d.keterangan || "-"
                })
              })
            }

            return {
              ...item,
              id: String(item.id),
              
              tanggal: rawTanggal,
              
              tanggalDibuat: isUnknown ? "Tidak Diketahui" : formatTanggalIndo(rawTanggal), 
              periodeId: getPeriodeFromDate(rawTanggal), 
              jenis: getJenisFromJenisPublikasi(item.jenis_publikasi),
              penulisDosen: penulisDosen,
              penulisMahasiswa: penulisMahasiswa,
              riwayat: [
                { id: "1", tanggal: "10 April 2026, 09:00", status: "draft", aktor: user.name, peran: "Dosen", catatan: "Menyimpan draf awal dokumen." },
                { id: "2", tanggal: "12 April 2026, 14:30", status: "submitted", aktor: user.name, peran: "Dosen", catatan: null },
                { id: "3", tanggal: "15 April 2026, 10:15", status: "revisi", aktor: "Bpk. Budi", peran: "Reviewer", catatan: "Mohon perbaiki format penulisan pada dokumen lampiran sesuai panduan terbaru LPPM." },
                { id: "4", tanggal: "18 April 2026, 11:00", status: "approved", aktor: "Admin LPPM", peran: "Admin", catatan: "Dokumen sudah sesuai dan diverifikasi." }
              ].reverse()
            };
          });

          // DEBUG 2: CEK HASIL MAPPING
          console.log("2. Data Setelah di-Mapping (Cek periodeId-nya):", dataDenganPeriode);

          const uniquePeriodesMap = new Map<string, PeriodePublikasi>();
          
          NEW_PERIODE.forEach(p => uniquePeriodesMap.set(p.id, p));
          dataDenganPeriode.forEach((item: PublikasiItem) => {
            const pId = item.periodeId;
            if (!uniquePeriodesMap.has(pId) && pId !== "UNKNOWN-PERIODE") {
              const [tahun, semester] = pId.split('-');
              uniquePeriodesMap.set(pId, { id: pId, tahun, semester, aktif: false });
            }
          });

          const dynamicPeriodes = Array.from(uniquePeriodesMap.values());
          
          dynamicPeriodes.sort((a, b) => {
            if (a.id === "UNKNOWN-PERIODE") return 1;
            if (b.id === "UNKNOWN-PERIODE") return -1;
            return b.id.localeCompare(a.id);
          });

          if (dynamicPeriodes.length > 0 && dynamicPeriodes[0].id !== "UNKNOWN-PERIODE") {
             dynamicPeriodes.forEach(p => p.aktif = false);
             dynamicPeriodes[0].aktif = true;
          }

          // DEBUG 3: CEK KOTAK PERIODE
          console.log("3. Daftar Kotak Periode yang Terbuat:", dynamicPeriodes);
          console.groupEnd();

          setPeriodeList(dynamicPeriodes);
          setPublikasiList(dataDenganPeriode);
          
        } else {
          showToast(result.message || "Gagal memuat data", "error");
        }
      } catch (error: any) {
        console.error("Fetch error:", error);
        showToast(error.message || "Terjadi kesalahan jaringan", "error");
      } finally {
        setLoading(false);
      }
    };


  useEffect(() => {
    fetchPublikasi();
  }, [user?.id]);

  const [formData, setFormData] = useState(emptyForm());
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleAddPenulis = (tipe: "dosen" | "mahasiswa") => {
    const field = tipe === "dosen" ? "penulisDosen" : "penulisMahasiswa";
    setFormData((prev) => ({
      ...prev,
      [field]: [
        ...prev[field], 
        { id: Math.random().toString(36).substr(2, 9), nama: "", afiliasi: "", urutan: "" }
      ]
    }));
  };

  const handleUpdatePenulis = (tipe: "dosen" | "mahasiswa", id: string, key: keyof PublikasiPenulis, value: string | number) => {
    const field = tipe === "dosen" ? "penulisDosen" : "penulisMahasiswa";
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item) => item.id === id ? { ...item, [key]: value } : item)
    }));
  };

  const handleRemovePenulis = (tipe: "dosen" | "mahasiswa", id: string) => {
    const field = tipe === "dosen" ? "penulisDosen" : "penulisMahasiswa";
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((item) => item.id !== id)
    }));
  };

  useEffect(() => { 
    const t = setTimeout(() => setLoading(false), 400); 
    return () => clearTimeout(t); 
  }, 
  []);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast((p) => ({ ...p, show: false })), 3000);
  };

  const validateForm = (asSubmit: boolean): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.judul.trim()) errors.judul = "Judul wajib diisi";

    if (asSubmit) {
      if (!formData.tanggal) errors.tanggal = "Tanggal terbit wajib diisi";
      if (formData.jenis === "artikel" && !formData.jenisJurnal) errors.jenisJurnal = "Jenis jurnal wajib dipilih";
      if (formData.jenis === "artikel" && !formData.halaman) errors.halaman = "Halaman wajib diisi";
      if (formData.jenis === "artikel" && !formData.volume) errors.volume = "Volume wajib diisi";
    }
    
    setFormErrors(errors);
    const isValid = Object.keys(errors).length === 0;

    if (!isValid && formRef.current) {
      setTimeout(() => {
        const firstErrorElement = formRef.current?.querySelector('.border-red-300');
        
        if (firstErrorElement) {
          firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          (firstErrorElement as HTMLElement).focus();
        }
      }, 100);
    }

    return isValid;
  };

  const handleSave = async (asSubmit: boolean) => {
    if (!validateForm(asSubmit)) { 
      showToast(asSubmit ? "Lengkapi field yang wajib diisi" : "Judul wajib diisi untuk menyimpan draft", "error"); 
      return; 
    }

    let cleanQuartile = null;
    if (formData.quartile) {
        const numberOnly = String(formData.quartile).replace(/\D/g, "");
        cleanQuartile = numberOnly ? parseInt(numberOnly, 10) : null;
    }

    const newStatus = asSubmit ? "submitted" : "draft";
    const payload = {
        ...formData,
        id_user: user?.id,
        status: newStatus,
        quartile: cleanQuartile
    };

    try {
        setLoading(true);
        const url = editingItem 
            ? `http://localhost:3000/api/sdm/publikasi/${editingItem.id}` 
            : `http://localhost:3000/api/sdm/publikasi`;
        const method = editingItem ? "PUT" : "POST";

        const res = await fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        
        const data = await res.json();
        
        if (data.status === 'success') {
            showToast(asSubmit ? "Publikasi berhasil disubmit" : "Draft berhasil disimpan");

            await fetchPublikasi(); 
            
            setEditingItem(null);
            setViewMode("list");
        } else {
            throw new Error(data.message);
        }
    } catch (error: any) {
        showToast(error.message || "Gagal menyimpan data", "error");
    } finally {
        setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/api/sdm/publikasi/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (data.status === 'success') {
        showToast("Publikasi berhasil dihapus");
        await fetchPublikasi();
        if (viewMode === "detail") setViewMode("list");
      } else {
        showToast(data.message || "Gagal menghapus", "error");
      }
    } catch (error) {
      showToast("Terjadi kesalahan jaringan", "error");
    } finally {
      setLoading(false);
    }
  };

  const periodeFiltered = publikasiList.filter((p) => p.periodeId === selectedPeriode?.id);
  const filtered = periodeFiltered.filter((p) => {
    const matchJenis = filterJenis === "semua" || p.jenis === filterJenis;
    const matchSearch = p.judul.toLowerCase().includes(searchQuery.toLowerCase());
    return matchJenis && matchSearch;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

/* ═══════════ VIEW: DETAIL ═══════════ */
  if (viewMode === "detail" && selectedItem) {
    return (
      <PageWrapper title="Detail Publikasi"
        breadcrumbs={[{ label: "Dosen" }, { label: "Laporan Publikasi", path: "/admin/laporan-publikasi/artikel" }, { label: selectedItem.id }]}
        actions={<button onClick={() => setViewMode("list")} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"><ChevronLeft className="w-4 h-4" /> Kembali</button>}>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

          <div className="lg:col-span-2 space-y-5">
            <StepperStatus module="hibah" currentStatus={selectedItem.status} />
            
            {/* KOTAK INFORMASI UTAMA */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 ">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full ${JENIS_COLORS[selectedItem.jenis]}`} style={{ fontWeight: 600 }}>{JENIS_LABELS[selectedItem.jenis]}</span>
                  <h3 className="text-base text-slate-900 mt-2" style={{ fontWeight: 600 }}>{selectedItem.judul}</h3>
                </div>
                <StatusBadge status={selectedItem.status} size="md" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-xs text-slate-400 mb-0.5">Tahun Terbit</p><p className="text-sm text-slate-800" style={{ fontWeight: 500 }}>{selectedItem.tanggalDibuat}</p></div>
                {selectedItem.jenis === "artikel" && (
                  <>
                    <div><p className="text-xs text-slate-400 mb-0.5">Nama Jurnal</p><p className="text-sm text-slate-800">{selectedItem.nama_jurnal || "-"}</p></div>
                    <div><p className="text-xs text-slate-400 mb-0.5">Jenis Jurnal</p><p className="text-sm text-slate-800">{selectedItem.jenis_publikasi || "-"}</p></div>
                    <div><p className="text-xs text-slate-400 mb-0.5">Penerbit</p><p className="text-sm text-slate-800">{selectedItem.penerbit || "-"}</p></div>
                    <div><p className="text-xs text-slate-400 mb-0.5">ISSN</p><p className="text-sm text-slate-800">{selectedItem.issn || "-"}</p></div>
                    <div><p className="text-xs text-slate-400 mb-0.5">Volume/Nomor Terbit/Halaman</p><p className="text-sm text-slate-800">{`${selectedItem.volume || "-"}/${selectedItem.nomor || "-"}/${selectedItem.halaman || "-"}`}</p></div>
                    {selectedItem.doi && <div className="col-span-2"><p className="text-xs text-slate-400 mb-0.5">URL/DOI</p><a href={selectedItem.doi} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline flex items-center gap-1">Lihat <ExternalLink className="w-3 h-3" /></a></div>}
                  </>
                )}
                {selectedItem.jenis === "buku" && (
                  <>
                    <div><p className="text-xs text-slate-400 mb-0.5">Penerbit</p><p className="text-sm text-slate-800">{selectedItem.penerbit || "-"}</p></div>
                    <div><p className="text-xs text-slate-400 mb-0.5">ISBN</p><p className="text-sm text-slate-800">{selectedItem.isbn || "-"}</p></div>
                    <div><p className="text-xs text-slate-400 mb-0.5">Jumlah Halaman</p><p className="text-sm text-slate-800">{selectedItem.jumlah_halaman || "-"}</p></div>
                    {selectedItem.tautan && <div className="col-span-2"><p className="text-xs text-slate-400 mb-0.5">URL</p><a href={selectedItem.tautan} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline flex items-center gap-1">Lihat <ExternalLink className="w-3 h-3" /></a></div>}
                  </>
                )}
                {selectedItem.jenis === "haki" && (
                  <>
                    <div><p className="text-xs text-slate-400 mb-0.5">No. Sertifikat</p><p className="text-sm text-slate-800">{selectedItem.nomorSertifikat || "-"}</p></div>
                    <div><p className="text-xs text-slate-400 mb-0.5">Jenis HaKI</p><p className="text-sm text-slate-800">{selectedItem.jenisHaki || "-"}</p></div>
                  </>
                )}
                {selectedItem.jenis === "prototipe" && (
                  <>
                    <div><p className="text-xs text-slate-400 mb-0.5">Nama Prototipe</p><p className="text-sm text-slate-800">{selectedItem.namaProto || "-"}</p></div>
                    <div><p className="text-xs text-slate-400 mb-0.5">Jenis Prototipe</p><p className="text-sm text-slate-800">{selectedItem.jenisProto || "-"}</p></div>
                    {selectedItem.urlDokumen && <div className="col-span-2"><p className="text-xs text-slate-400 mb-0.5">URL Dokumen</p><a href={selectedItem.urlDokumen} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline flex items-center gap-1">Lihat <ExternalLink className="w-3 h-3" /></a></div>}
                  </>
                )}
                  <div className="col-span-2 border-t-[0.5px] border-slate-200 p-6">
                    <h3 className="text-sm text-slate-900 mb-5" style={{ fontWeight: 600 }}>Tim Penulis</h3>
                    
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* List Dosen */}
                        <div>
                          <p className="text-xs text-slate-400 mb-2">Penulis Dosen Lainnya</p>
                          {selectedItem.penulisDosen && selectedItem.penulisDosen.length > 0 ? (
                            <div className="space-y-2">
                              {selectedItem.penulisDosen.map((penulis) => (
                                <div key={penulis.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                                  <div>
                                    <p className="text-sm text-slate-800" style={{ fontWeight: 500 }}>{penulis.nama}</p>
                                    <p className="text-xs text-slate-500 mt-0.5">{penulis.afiliasi || "-"}</p>
                                  </div>
                                  <span className="text-xs text-slate-600 bg-slate-200 px-2.5 py-1 rounded-md" style={{ fontWeight: 600 }}>
                                    Urutan: {penulis.urutan || "-"}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-slate-400 italic">Tidak ada penulis dosen tambahan.</p>
                          )}
                        </div>
                        {/* List Mahasiswa */}
                        <div>
                          <p className="text-xs text-slate-400 mb-2">Penulis Mahasiswa</p>
                          {selectedItem.penulisMahasiswa && selectedItem.penulisMahasiswa.length > 0 ? (
                            <div className="space-y-2">
                              {selectedItem.penulisMahasiswa.map((penulis) => (
                                <div key={penulis.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                                  <div>
                                    <p className="text-sm text-slate-800" style={{ fontWeight: 500 }}>{penulis.nama}</p>
                                    <p className="text-xs text-slate-500 mt-0.5">{penulis.afiliasi || "-"}</p>
                                  </div>
                                  <span className="text-xs text-slate-600 bg-slate-200 px-2.5 py-1 rounded-md" style={{ fontWeight: 600 }}>
                                    Urutan: {penulis.urutan || "-"}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-slate-400 italic">Tidak ada penulis mahasiswa.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
              </div>
            </div>
          {/* DOKUMEN */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-sm text-slate-900" style={{ fontWeight: 600 }}>Dokumen Pendukung</h3>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  {selectedItem.dokumen && selectedItem.dokumen.length > 0 ? (
                    <div className="space-y-3">
                      {selectedItem.dokumen.map((d: any) => (
                        <div 
                          key={d.id} 
                          title={d.tautan ? `Buka: ${d.tautan}` : "Dokumen ini tidak memiliki tautan"}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-50 border border-slate-100 rounded-xl hover:border-blue-200 transition-colors"
                        >
                          <div className="flex items-start gap-3.5">
                            {/* Ikon File Dokumen */}
                            <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 bg-white border border-slate-200 rounded-lg shadow-sm">
                              <FileText className="w-5 h-5 text-blue-600" />
                            </div>
                            
                            {/* Informasi Dokumen */}
                            <div>
                              <p className="text-sm text-slate-800" style={{ fontWeight: 600 }}>{d.nama}</p>
                              
                              <div className="flex items-center flex-wrap gap-2 mt-1.5">
                                <span className="text-[10px] px-2 py-0.5 bg-slate-200 text-slate-700 rounded-md" style={{ fontWeight: 600 }}>
                                  {d.jenis_dokumen || "Dokumen"}
                                </span>
                                {d.jenis_file && (
                                  <>
                                    <span className="text-slate-300 text-xs">•</span>
                                    <span className="text-[11px] text-slate-500 font-mono uppercase">{d.jenis_file}</span>
                                  </>
                                )}
                                {d.tanggal_upload && (
                                  <>
                                    <span className="text-slate-300 text-xs">•</span>
                                    <span className="text-[11px] text-slate-500">{d.tanggal_upload}</span>
                                  </>
                                )}
                              </div>

                              {/* Keterangan Dokumen (Jika ada) */}
                              {d.keterangan && (
                                <p className="text-xs text-slate-500 mt-2 italic leading-relaxed">
                                  "{d.keterangan}"
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Tombol Aksi Tautan */}
                          {d.tautan && (
                            <div className="flex-shrink-0 self-start sm:self-center ml-13 sm:ml-0">
                              <a 
                                href={d.tautan} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs text-blue-700 bg-blue-100/50 hover:bg-blue-100 rounded-lg transition-colors"
                                style={{ fontWeight: 600 }}
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                Buka Tautan
                              </a>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-slate-50/50 border border-dashed border-slate-200 rounded-xl">
                      <p className="text-xs text-slate-400 italic">Tidak ada dokumen tambahan yang dilampirkan.</p>
                    </div>
                  )}
                </div>
              </div>
          </div>
          </div>
          <div className="space-y-5">
            {/* --- AKSI --- */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <h4 className="text-sm text-slate-800 mb-3" style={{ fontWeight: 600 }}>Aksi</h4>
                <div className="space-y-2">
                  {selectedItem.status === "draft" && (
                    <>
                      <button onClick={() => handleSave(true)} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700" style={{ fontWeight: 500 }}><Send className="w-4 h-4" /> Submit</button>
                      <button onClick={() => { setEditingItem(selectedItem); setFormData({ ...selectedItem }); setFormErrors({}); setViewMode("form"); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200" style={{ fontWeight: 500 }}><Edit className="w-4 h-4" /> Edit</button>
                      <button onClick={() => setConfirmModal({ open: true, title: "Hapus?", message: "Data akan dihapus.", variant: "danger", onConfirm: () => { handleDelete(selectedItem.id); setViewMode("list"); } })} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100" style={{ fontWeight: 500 }}><Trash2 className="w-4 h-4" /> Hapus</button>
                    </>
                  )}
                  {["approved", "verified"].includes(selectedItem.status) && (
                    <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200" style={{ fontWeight: 500 }}><Download className="w-4 h-4" /> Export PDF</button>
                  )}
                </div>
              </div>
            </div>
            
            {/* KOTAK RIWAYAT AKTIVITAS (Tinggi menyesuaikan konten) */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h4 className="text-sm text-slate-800 mb-4" style={{ fontWeight: 600 }}>Riwayat Aktivitas</h4>
              
              {selectedItem.riwayat && selectedItem.riwayat.length > 0 ? (
                <div className="relative border-l-2 border-slate-100 ml-2 space-y-6 pb-2 mt-2">
                  {selectedItem.riwayat.map((item, index) => {
                    const dotColor = 
                      item.status.toLowerCase() === 'approved' ? 'bg-green-500' : 
                      item.status.toLowerCase() === 'revisi' ? 'bg-amber-500' : 
                      item.status.toLowerCase() === 'submitted' ? 'bg-blue-500' : 'bg-slate-400';

                    return (
                      <div key={item.id} className="relative pl-5">
                        <div className={`absolute -left-[5px] top-1.5 w-2 h-2 rounded-full ring-4 ring-white ${dotColor}`}></div>
                        <p className="text-[11px] text-slate-400 mb-0.5">{item.tanggal}</p>
                        <div className="flex items-center flex-wrap gap-x-1.5 mb-1">
                          <span className="text-sm text-slate-800 capitalize" style={{ fontWeight: 600 }}>
                            {item.status}
                          </span>
                          <span className="text-xs text-slate-500">
                            oleh {item.aktor} ({item.peran})
                          </span>
                        </div>
                        {item.catatan && (
                          <div className="mt-2 bg-slate-50 border border-slate-100 rounded-lg p-2.5 relative">
                            <div className="absolute -top-1.5 left-4 w-3 h-3 bg-slate-50 border-t border-l border-slate-100 rotate-45"></div>
                            <p className="text-xs text-slate-600 italic relative z-10">"{item.catatan}"</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-xs text-slate-400 italic">Belum ada riwayat aktivitas.</p>
                </div>
              )}
            </div>

          </div>
        </div>
        <ConfirmModal {...confirmModal} isOpen={confirmModal.open} onClose={() => setConfirmModal((p) => ({ ...p, open: false }))} />
      </PageWrapper>
    );
  }

  /* ═══════════ VIEW: FORM ═══════════ */
  if (viewMode === "form") {
    const currentJenis = formData.jenis;
    return (
      <PageWrapper
        title={editingItem ? "Edit Publikasi" : "Tambah Publikasi"}
        breadcrumbs={[{ label: "Dosen" }, { label: "Laporan Publikasi", path: "/admin/laporan-publikasi/artikel" }, { label: editingItem ? "Edit" : "Buat Baru" }]}
      >
        <div className="space-y-5" ref={formRef}>
          <div className="space-y-5">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-sm text-slate-900 mb-5" style={{ fontWeight: 600 }}>Informasi Publikasi</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                <div className="sm:col-span-2">
                  <FormField label="Judul" 
                  required error={formErrors.judul}>
                    <input 
                    type="text" 
                    value={formData.judul} 
                    onChange={(e) => setFormData((p) => ({ ...p, judul: e.target.value }))} 
                    className={inputClass(!!formErrors.judul)} />
                  </FormField>
                </div>

                 <div className="sm:col-span-2">
                  <FormField label="Nama Jurnal" 
                  required error={formErrors.nama_jurnal}>
                    <input 
                    type="text" 
                    value={formData.nama_jurnal} 
                    onChange={(e) => setFormData((p) => ({ ...p, nama_jurnal: e.target.value }))} 
                    className={inputClass(!!formErrors.nama_jurnal)} />
                  </FormField>
                </div>

                <div className="sm:col-span-2">
                  <FormField label="Kategori Kegiatan" required error={formErrors.kategori_kegiatan}>
                    <SearchableSelect
                      options={KATEGORI_KEGIATAN_MAP.map(k => k.label)} 
                      value={formData.kategori_kegiatan || ""}
                      onChange={(selectedLabel) => {
                        const selectedObj = KATEGORI_KEGIATAN_MAP.find(k => k.label === selectedLabel);
                        setFormData((p) => ({ 
                          ...p, 
                          kategori_kegiatan: selectedLabel,
                          id_kategori_kegiatan: selectedObj ? selectedObj.id : ""
                        }));
                      }}
                      placeholder="Cari kategori kegiatan..."
                    />
                  </FormField>
                </div>

                <FormField label="Kategori Capaian Luaran"
                required error={formErrors.kategori_capaian_luaran}   
                >
                  <select
                  value={formData.kategori_capaian_luaran}
                  onChange={(selectedLabel) => {
                    const selectedObj = KATEGORI_CAPAIAN_LUARAN_MAP.find(k => k.label === selectedLabel.target.value);
                    setFormData((p) => ({ 
                      ...p, 
                      kategori_capaian_luaran: selectedLabel.target.value,
                      id_kategori_capaian_luaran: selectedObj ? selectedObj.id : ""
                    }));
                  }}
                  className={inputClass()}
                  >
                    {KATEGORI_CAPAIAN_LUARAN_MAP.map((k) => <option
                    key={k.label}
                    value={k.label}>{k.label}</option>)}
                  </select>
                </FormField>

                {/* Artikel Fields */}
                {currentJenis === "artikel" && (<>
                  <FormField label="Jenis Publikasi" required>
                    <select 
                    value={formData.jenis_publikasi || ""} 
                    onChange={(selectedLabel) => {
                    const selectedObj = KATEGORI_JURNAL_ARTIKEL.find(k => k.label === selectedLabel.target.value);
                    setFormData((p) => ({ 
                      ...p, 
                      jenis_publikasi: selectedLabel.target.value,
                      id_jenis_publikasi: selectedObj ? selectedObj.id : ""
                    }));
                  }}
                  className={inputClass()}
                  >
                      <option value="">Pilih jenis...</option>
                      {KATEGORI_JURNAL_ARTIKEL.map((j) => <option 
                      key={j.label} 
                      value={j.label}>{j.label}</option>)}
                    </select>
                  </FormField>
                  <FormField 
                    label="Tanggal Publikasi" 
                    required error={formErrors.tanggal}>
                      <input type="date" 
                      value={formData.tanggal} 
                      onChange={(e) => setFormData((p) => ({ ...p, tanggal: e.target.value }))} 
                      className={inputClass(!!formErrors.tanggal)} />
                  </FormField>
                  <FormField 
                    label={
                      formData.jenis_publikasi === "Jurnal internasional bereputasi" ? "Quartile Scopus" : 
                      formData.jenis_publikasi === "Jurnal nasional terakreditasi" ? "Peringkat Sinta" : 
                      "Peringkat / Quartile"
                    }
                  >
                    <select 
                      value={formData.quartile || ""} 
                      onChange={(e) => setFormData((p) => ({ ...p, quartile: parseInt(e.target.value) }))} 
                      // Logika penentu apakah dropdown nyala atau mati:
                      disabled={!(formData.jenis_publikasi === "Jurnal nasional terakreditasi" || formData.jenis_publikasi === "Jurnal internasional bereputasi")}
                      // Tambahan class untuk mengubah warna saat mati:
                      className={inputClass()}
                    >
                      <option value="">-- Pilih Peringkat --</option>
                      <option value="1">{formData.jenis_publikasi?.includes("internasional") ? "Q1" : "Sinta 1"}</option>
                      <option value="2">{formData.jenis_publikasi?.includes("internasional") ? "Q2" : "Sinta 2"}</option>
                      <option value="3">{formData.jenis_publikasi?.includes("internasional") ? "Q3" : "Sinta 3"}</option>
                      <option value="4">{formData.jenis_publikasi?.includes("internasional") ? "Q4" : "Sinta 4"}</option>
                      {/* Tampilkan sinta 5 & 6 secara default atau saat jurnal nasional dipilih */}
                      {(!formData.jenis_publikasi?.includes("internasional")) && (
                        <><option value="5">Sinta 5</option><option value="6">Sinta 6</option></>
                      )}
                    </select>
                  </FormField>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:col-span-2">
                    <FormField label="ISSN">
                      <input
                        type="text"
                        value={formData.issn || ""} 
                        onChange={(e) => setFormData((p) => ({...p, issn: e.target.value}))}
                        disabled={!(formData.jenis_publikasi?.includes("Jurnal") || formData.jenis_publikasi?.includes("Prosiding"))}
                        className={inputClass()}
                      />
                    </FormField>

                    <FormField label="ISBN">
                      <input
                        type="text"
                        value={formData.isbn || ""}
                        onChange={(e) => setFormData((p) => ({...p, isbn: e.target.value}))}
                        disabled={!(formData.jenis_publikasi?.includes("Prosiding"))}
                        className={inputClass()}
                      />
                    </FormField>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:col-span-2">
                    <FormField label="Halaman" 
                    required error={formErrors.halaman}>
                      <input 
                      type="text" 
                      value={formData.halaman} 
                      onChange={(e) => setFormData((p) => ({ ...p, halaman: e.target.value }))} 
                      className={inputClass(!!formErrors.halaman)} />
                    </FormField>
                    <FormField label="Edisi" 
                    required error={formErrors.edisi}>
                      <input 
                      type="text" 
                      value={formData.edisi} 
                      onChange={(e) => setFormData((p) => ({ ...p, edisi: e.target.value }))} 
                      className={inputClass(!!formErrors.edisi)} />
                    </FormField>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:col-span-2">
                    <FormField label="Volume" 
                    required error={formErrors.volume}>
                      <input 
                      type="number" 
                      min= "0"
                      value={formData.volume} 
                      onChange={(e) => setFormData((p) => ({ ...p, volume: parseInt(e.target.value) }))} 
                      className={inputClass(!!formErrors.volume)} />
                    </FormField>
                    <FormField label="Nomor" 
                    required error={formErrors.nomor}>
                      <input 
                      type="number"
                      min= "0" 
                      value={formData.nomor} 
                      onChange={(e) => setFormData((p) => ({ ...p, nomor: parseInt(e.target.value) }))} 
                      className={inputClass(!!formErrors.nomor)} />
                    </FormField>
                  </div>
                  <div className="sm:col-span-2">
                    <FormField label="DOI">
                      <input 
                      type="url" 
                      value={formData.tautan || ""} 
                      onChange={(e) => setFormData((p) => ({ ...p, tautan: e.target.value }))} 
                      className={inputClass()} />
                    </FormField>
                  </div>
                  <div className="sm:col-span-2">
                    <FormField label="Tautan">
                      <input type="url" value={formData.doi || ""} 
                      onChange={(e) => setFormData((p) => ({ ...p, doi: e.target.value }))} 
                      className={inputClass()} />
                    </FormField>
                  </div>
                  {/* ════════════ BLOK DATA PENULIS ════════════ */}
                  <div className="sm:col-span-2 mt-6 pt-6 border-t border-slate-200 space-y-6">
                    <h3 className="text-sm text-slate-900" style={{ fontWeight: 600 }}>Tim Penulis</h3>
                    
                    {/* 1. Urutan Penulis Utama (Dosen Login) */}
                    <div className="w-full sm:w-1/2">
                      <FormField label="Urutan Anda sebagai Penulis" required>
                        <input type="number" min="1" value={formData.urutanPenulis} onChange={(e) => setFormData(p => ({ ...p, urutanPenulis: parseInt(e.target.value) || "" }))} className={inputClass()} />
                      </FormField>
                    </div>

                    {/* 2. Penulis Dosen Lainnya */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-sm text-slate-700" style={{ fontWeight: 500 }}>Penulis Dosen Lainnya</label>
                        <button 
                        onClick={() => handleAddPenulis("dosen")} 
                        className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100" 
                        style={{ fontWeight: 500 }}><Plus className="w-3.5 h-3.5" /> Tambah Dosen</button>
                      </div>
                      {formData.penulisDosen.length === 0 && <p className="text-xs text-slate-400 italic">Tidak ada dosen lain yang ditambahkan.</p>}
                      
                      {formData.penulisDosen.map((item, index) => (
                        <div key={item.id} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start bg-slate-50 p-3 rounded-lg border border-slate-100">
                          <div className="sm:col-span-4"><input type="text" placeholder="Nama Dosen" value={item.nama} onChange={(e) => handleUpdatePenulis("dosen", item.id, "nama", e.target.value)} className={inputClass()} /></div>
                          <div className="sm:col-span-5"><input type="text" placeholder="Afiliasi (Contoh: Univ. A)" value={item.afiliasi} onChange={(e) => handleUpdatePenulis("dosen", item.id, "afiliasi", e.target.value)} className={inputClass()} /></div>
                          <div className="sm:col-span-2"><input type="number" placeholder="Urutan" value={item.urutan} onChange={(e) => handleUpdatePenulis("dosen", item.id, "urutan", parseInt(e.target.value) || "")} className={inputClass()} /></div>
                          <div className="sm:col-span-1 flex justify-end"><button onClick={() => handleRemovePenulis("dosen", item.id)} className="p-2.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button></div>
                        </div>
                      ))}
                    </div>

                    {/* 3. Penulis Mahasiswa */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-sm text-slate-700" style={{ fontWeight: 500 }}>Penulis Mahasiswa</label>
                        <button onClick={() => handleAddPenulis("mahasiswa")} 
                        className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100" 
                        style={{ fontWeight: 500 }}><Plus className="w-3.5 h-3.5" /> Tambah Mahasiswa</button>
                      </div>
                      {formData.penulisMahasiswa.length === 0 && <p className="text-xs text-slate-400 italic">Tidak ada mahasiswa yang ditambahkan.</p>}
                      
                      {formData.penulisMahasiswa.map((item, index) => (
                        <div key={item.id} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start bg-slate-50 p-3 rounded-lg border border-slate-100">
                          <div className="sm:col-span-4"><input type="text" placeholder="Nama Mahasiswa" value={item.nama} onChange={(e) => handleUpdatePenulis("mahasiswa", item.id, "nama", e.target.value)} className={inputClass()} /></div>
                          <div className="sm:col-span-5"><input type="text" placeholder="Afiliasi / NIM" value={item.afiliasi} onChange={(e) => handleUpdatePenulis("mahasiswa", item.id, "afiliasi", e.target.value)} className={inputClass()} /></div>
                          <div className="sm:col-span-2"><input type="number" placeholder="Urutan" value={item.urutan} onChange={(e) => handleUpdatePenulis("mahasiswa", item.id, "urutan", parseInt(e.target.value) || "")} className={inputClass()} /></div>
                          <div className="sm:col-span-1 flex justify-end"><button onClick={() => handleRemovePenulis("mahasiswa", item.id)} className="p-2.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>)}

                {/* Buku Fields */}
                {currentJenis === "buku" && (<>
                  {/* Dropdown SISTER khusus untuk Buku */}
                  <FormField label="Kategori Buku" required>
                    <select 
                    value={formData.jenis_publikasi || ""} 
                    onChange={(selectedLabel) => {
                    const selectedObj = KATEGORI_BUKU.find(k => k.label === selectedLabel.target.value);
                    setFormData((p) => ({ 
                      ...p, 
                      jenis_publikasi: selectedLabel.target.value,
                      id_jenis_publikasi: selectedObj ? selectedObj.id : ""
                    }));
                  }}
                    className={inputClass()}>
                      <option value="">Pilih kategori buku...</option>
                      {KATEGORI_BUKU.map((j) => <option key={j.label} value={j.label}>{j.label}</option>)}
                    </select>
                  </FormField>

                  <FormField label="Penerbit"><input type="text" value={formData.penerbit || ""} onChange={(e) => setFormData((p) => ({ ...p, penerbit: e.target.value }))} placeholder="Nama penerbit" className={inputClass()} /></FormField>
                  <FormField label="ISBN"><input type="text" value={formData.isbn || ""} onChange={(e) => setFormData((p) => ({ ...p, isbn: e.target.value }))} placeholder="978-xxx-xxx" className={inputClass()} /></FormField>
                  <div className="sm:col-span-2">
                    <FormField label="Tautan">
                      <input type="url" value={formData.doi || ""} 
                      onChange={(e) => setFormData((p) => ({ ...p, doi: e.target.value }))} 
                      className={inputClass()} />
                    </FormField>
                  </div>
                </>)}

                {/* HaKI Fields */}
                {currentJenis === "haki" && (<>
                  <FormField label="Jenis HaKI">
                    <select value={formData.jenisHaki || ""} 
                    onChange={(e) => setFormData((p) => ({ ...p, jenisHaki: e.target.value }))} 
                    className={inputClass()}>
                      <option value="">Pilih...</option>
                      {JENIS_HAKI_OPTIONS.map((j) => <option key={j} value={j}>{j}</option>)}
                    </select>
                  </FormField>
                  <FormField label="Nomor Sertifikat">
                    <input type="text" 
                    value={formData.nomorSertifikat || ""} 
                    onChange={(e) => setFormData((p) => ({ ...p, nomorSertifikat: e.target.value }))} 
                    className={inputClass()} />
                    </FormField>
                </>)}

                {/* Prototipe Fields */}
                {currentJenis === "prototipe" && (<>
                  <FormField label="Nama Prototipe">
                    <input type="text" 
                    value={formData.namaProto || ""} 
                    onChange={(e) => setFormData((p) => ({ ...p, namaProto: e.target.value }))} 
                    className={inputClass()} />
                    </FormField>
                  <FormField label="Jenis Prototipe">
                    <select value={formData.jenisProto || ""} onChange={(e) => setFormData((p) => ({ ...p, jenisProto: e.target.value }))} className={inputClass()}>
                      <option value="">Pilih...</option>
                      {JENIS_PROTO_OPTIONS.map((j) => <option key={j} value={j}>{j}</option>)}
                    </select>
                  </FormField>
                  <div className="sm:col-span-2"><FormField label="URL Dokumen"><input type="url" value={formData.urlDokumen || ""} onChange={(e) => setFormData((p) => ({ ...p, urlDokumen: e.target.value }))} placeholder="https://drive.google.com/..." className={inputClass()} /></FormField></div>
                </>)}
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5 flex gap-3 flex-wrap">
              <button onClick={() => setViewMode("list")} className="flex items-center gap-2 px-5 py-2.5 text-sm text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200" style={{ fontWeight: 500 }}><ChevronLeft className="w-4 h-4" /> Kembali</button>
              <button onClick={() => handleSave(false)} className="flex items-center gap-2 px-5 py-2.5 text-sm text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100" style={{ fontWeight: 500 }}>💾 Simpan Draft</button>
              <button onClick={() => handleSave(true)} className="flex items-center gap-2 px-5 py-2.5 text-sm text-white bg-[#E30613] rounded-lg hover:bg-[#c00510]" style={{ fontWeight: 500 }}><Send className="w-4 h-4" /> Submit</button>
              <button onClick={() => { setFormData(editingItem ? { ...editingItem } : emptyForm()); setFormErrors({}); }} className="flex items-center gap-2 px-5 py-2.5 text-sm text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200" style={{ fontWeight: 500 }}><RotateCcw className="w-4 h-4" /> Reset</button>
            </div>
          </div>
        </div>
      </PageWrapper>
    );
  }

  /* ═══════════ VIEW: LIST ═══════════ */
  if (viewMode === "list" && selectedPeriode) {
    return (
      <PageWrapper
        title={`Publikasi — ${selectedPeriode.tahun} (${selectedPeriode.semester})`}
        breadcrumbs={[{ label: "Dosen" }, { label: "Laporan Publikasi", path: "/admin/laporan-publikasi/artikel" }, { label: selectedPeriode.tahun }]}
        actions={
          <div className="flex gap-2">
            <button onClick={() => setViewMode("periode")} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"><ChevronLeft className="w-4 h-4" /> Periode</button>

            {isSubmissionOpen(selectedPeriode) ? (
              <button onClick={() => { setEditingItem(null); setFormData(emptyForm()); setFormErrors({}); setViewMode("form"); }} className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-[#E30613] rounded-lg hover:bg-[#c00510]" style={{ fontWeight: 500 }}><Plus className="w-4 h-4" /> Tambah</button>
            ) : selectedPeriode?.aktif && (
              <button disabled className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-slate-300 rounded-lg cursor-not-allowed" title="Di luar jadwal pengumpulan"><Plus className="w-4 h-4" /> Tambah Tertutup</button>
            )}
          </div>
        }
      >
        {loading ? <SkeletonTable rows={5} /> : (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex flex-wrap gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} placeholder="Cari publikasi..." className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E30613]/20" />
              </div>
              <select value={filterJenis} onChange={(e) => { setFilterJenis(e.target.value as typeof filterJenis); setCurrentPage(1); }} className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-600">
                <option value="semua">Semua Jenis</option>
                {(Object.entries(JENIS_LABELS) as [JenisPublikasi, string][]).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
              {selectedPeriode.aktif && (              
              <button 
                onClick={() => setIsSyncModalOpen(true)}
                disabled={isSyncing}
                className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                style={{ fontWeight: 500 }}
              >
                {/* Logika animate-spin: hanya aktif jika isSyncing true */}
                <RefreshCw className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`} />
                {isSyncing ? "Menyinkronkan..." : "Sinkron SISTER"}
              </button>)}
            </div>
            {paginated.length === 0 ? <EmptyState variant={searchQuery ? "no-results" : "no-data"} /> : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-100">
                        {["Tanggal", "Judul", "Jenis", "Status", "Aksi"].map((h) => (
                          <th key={h} className="px-5 py-3 text-left text-xs text-slate-500 whitespace-nowrap" style={{ fontWeight: 600 }}>{h}</th>
                        ))} 
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {paginated.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/50">
                          
                          {/* Kolom Tanggal*/}
                          <td className="px-5 py-3 text-sm text-slate-500 whitespace-nowrap">
                            {item.tanggalDibuat}
                          </td>

                          {/* Kolom Judul */}
                          <td className="px-5 py-3">
                            <button onClick={() => { setSelectedItem(item); setViewMode("detail"); }} className="text-sm text-slate-800 hover:text-[#E30613] text-left max-w-[250px] truncate block" style={{ fontWeight: 500 }}>
                              {item.judul}
                            </button>
                            {item.jenis === "artikel" && item.nama_jurnal && (
                              <p className="text-xs text-slate-400 mt-0.5 truncate">{item.nama_jurnal}</p>
                            )}
                          </td>

                          {/* Kolom Jenis */}
                          <td className="px-5 py-3">
                            <span className={`text-xs px-2.5 py-0.5 rounded-full ${JENIS_COLORS[item.jenis]}`} style={{ fontWeight: 600 }}>
                              {JENIS_LABELS[item.jenis]}
                            </span>
                          </td>

                          {/* Kolom Status */}
                          <td className="px-5 py-3">
                            <StatusBadge status={item.status} />
                          </td>

                          {/* Kolom Aksi */}
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-1">
                              <button onClick={() => { setSelectedItem(item); setViewMode("detail"); }} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md"><Eye className="w-4 h-4" /></button>
                              {["draft", "revisi"].includes(item.status) && <button onClick={() => { setEditingItem(item); setFormData({ ...item }); setFormErrors({}); setViewMode("form"); }} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md"><Edit className="w-4 h-4" /></button>}
                              {item.status === "draft" && <button onClick={() => setConfirmModal({ open: true, title: "Hapus?", message: "Data akan dihapus.", variant: "danger", onConfirm: () => handleDelete(item.id) })} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md"><Trash2 className="w-4 h-4" /></button>}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {totalPages > 1 && (
                  <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-xs text-slate-500">Total: {filtered.length} publikasi</p>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-1.5 text-slate-400 disabled:opacity-30"><ChevronLeft className="w-4 h-4" /></button>
                      {Array.from({ length: totalPages }).map((_, i) => <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-8 h-8 text-xs rounded-md ${currentPage === i + 1 ? "bg-[#E30613] text-white" : "text-slate-600 hover:bg-slate-100"}`}>{i + 1}</button>)}
                      <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-1.5 text-slate-400 disabled:opacity-30"><ChevronRight className="w-4 h-4" /></button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
        <ConfirmModal {...confirmModal} isOpen={confirmModal.open} onClose={() => setConfirmModal((p) => ({ ...p, open: false }))} />
        {toast.show && <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg border ${toast.type === "success" ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"}`}><CheckCircle className="w-4 h-4" /><span className="text-sm" style={{ fontWeight: 500 }}>{toast.message}</span></div>}
        <SyncSisterModal 
          isOpen={isSyncModalOpen} 
          onClose={() => setIsSyncModalOpen(false)}
          dosenId={user?.id}
          localData={publikasiList} // Kirim data lokal untuk di-render di mode POST
          onSuccess={() => {
            showToast("Sinkronisasi SISTER berhasil!", "success");
            fetchPublikasi(); // Refresh data utama
          }}
        />
      </PageWrapper>
    );
  }

  /* ═══════════ VIEW: PERIODE ═══════════ */
  const jenisTitle = jenisParam ? JENIS_LABELS[jenisParam] : "Semua Publikasi";
  const visiblePeriods = periodeList.filter((p) => {
    const count = publikasiList.filter((pub) => pub.periodeId === p.id && (jenisParam ? pub.jenis === jenisParam : true)).length;
    const isHardcoded = NEW_PERIODE.some(np => np.id === p.id);
    return showEmptyPeriods || count > 0 || isHardcoded;
  });
  return (
    <PageWrapper title={`Laporan Publikasi — ${jenisTitle}`} subtitle="Pilih periode untuk melihat atau menambah publikasi"
      breadcrumbs={[{ label: "Dosen" }, { label: "Laporan Publikasi", path: "/admin/laporan-publikasi/artikel"}, { label: jenisTitle }]}
      actions={
        <button 
          onClick={() => setShowEmptyPeriods(!showEmptyPeriods)}
          className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg border transition-all ${
            showEmptyPeriods 
              ? "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200" 
              : "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
          }`}
          style={{ fontWeight: 500 }}
        >
          <Eye className="w-4 h-4" /> 
          {showEmptyPeriods ? "Sembunyikan yang Kosong" : "Tampilkan Semua"}
        </button>
      }
      >
      {loading ? <SkeletonTable rows={4} /> : (
        <div className="space-y-3">
          {visiblePeriods.map((p) => {
            const count = publikasiList.filter((pub) => pub.periodeId === p.id && (jenisParam ? pub.jenis === jenisParam : true)).length;

            return (
              <div key={p.id} 
                className="bg-white border border-slate-200 rounded-xl px-5 py-4 hover:border-[#E30613]/30 hover:shadow-sm transition-all group relative">
                
                {/* Bagian Atas: Info Utama */}
                <div 
                  onClick={() => { setSelectedPeriode(p); setViewMode("list"); setCurrentPage(1); setSearchQuery(""); }}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center"><BookOpen className="w-5 h-5 text-blue-600" /></div>
                    <div>
                      <p className="text-sm text-slate-800" style={{ fontWeight: 600 }}>{p.tahun} — {p.semester}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{count} publikasi terdaftar</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {p.aktif && <span className="text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full border border-green-100">Aktif</span>}
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#E30613] transition-colors" />
                  </div>
                </div>

                {/* Bagian Bawah: Info Deadline */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  {p.deadlines?.submissionStart ? (
                    <button 
                      onClick={(e) => { e.stopPropagation(); setDeadlinePopup(p); }}
                      className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 transition-colors"
                      style={{ fontWeight: 500 }}
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      Pengumpulan: {formatTanggalIndo(p.deadlines.submissionStart)} s/d {formatTanggalIndo(p.deadlines.submissionDeadline || "")}
                      <Info className="w-3.5 h-3.5 ml-1" />
                    </button>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Clock className="w-3.5 h-3.5" /> Tidak ada batas waktu
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      {/* ══════════ POPUP DETAIL DEADLINE ══════════ */}
      {deadlinePopup && deadlinePopup.deadlines && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-base text-slate-900" style={{ fontWeight: 600 }}>Jadwal Periode</h3>
                <p className="text-xs text-slate-500 mt-0.5">{deadlinePopup.tahun} — {deadlinePopup.semester}</p>
              </div>
              <button onClick={() => setDeadlinePopup(null)} className="p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 rounded-full transition-colors"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                <div>
                  <p className="text-[11px] text-slate-400 mb-0.5">Submission Start</p>
                  <p className="text-sm text-slate-800" style={{ fontWeight: 500 }}>{formatTanggalIndo(deadlinePopup.deadlines.submissionStart || "")}</p>
                </div>
                <div>
                  <p className="text-[11px] text-red-500 mb-0.5">Submission Deadline</p>
                  <p className="text-sm text-slate-800" style={{ fontWeight: 600 }}>{formatTanggalIndo(deadlinePopup.deadlines.submissionDeadline || "")}</p>
                </div>
                
                <div className="col-span-2 border-t border-slate-100 my-1"></div>

                <div>
                  <p className="text-[11px] text-slate-400 mb-0.5">Revision Deadline</p>
                  <p className="text-sm text-slate-700">{formatTanggalIndo(deadlinePopup.deadlines.revisionDeadline || "") || "-"}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 mb-0.5">Koordinator Deadline</p>
                  <p className="text-sm text-slate-700">{formatTanggalIndo(deadlinePopup.deadlines.coordinatorDeadline || "") || "-"}</p>
                </div>

                <div>
                  <p className="text-[11px] text-slate-400 mb-0.5">Ketua LPPM Deadline</p>
                  <p className="text-sm text-slate-700">{formatTanggalIndo(deadlinePopup.deadlines.ketuaLppmDeadline || "") || "-"}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 mb-0.5">Masa Beku (Freeze)</p>
                  <p className="text-sm text-slate-700">{formatTanggalIndo(deadlinePopup.deadlines.freezeStart || "") || "-"} s/d {formatTanggalIndo(deadlinePopup.deadlines.freezeEnd || "") || "-"}</p>
                </div>
              </div>

              {deadlinePopup.deadlines.keterangan && (
                <div className="mt-2 bg-blue-50 border border-blue-100 rounded-xl p-4">
                  <p className="text-xs text-blue-800 italic leading-relaxed">"{deadlinePopup.deadlines.keterangan}"</p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button onClick={() => setDeadlinePopup(null)} className="px-5 py-2 text-sm bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-100" style={{ fontWeight: 500 }}>Tutup</button>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
