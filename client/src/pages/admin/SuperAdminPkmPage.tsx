import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  Download,
  Eye,
  FileSearch,
  FileText,
  FolderPlus,
  Pencil,
  Plus,
  Search,
  Send,
  Trash2,
  Upload,
  Users,
  XCircle,
} from "lucide-react";
import { useSearchParams } from "react-router";
import { ConfirmModal } from "../../components/admin/ConfirmModal";
import { EmptyState } from "../../components/admin/EmptyState";
import { PageWrapper } from "../../components/admin/PageWrapper";
import { useAuth } from "../../context/AuthContext";

type PkmStatus = "draft" | "submit" | "tolak" | "revisi" | "setuju" | "legitimasi";
type PkmListMode = "pkm-ku" | "baru" | "approve";
type PkmView = "list" | "new" | "edit" | "detail" | "legacy";
type PkmTab = "detail" | "files" | "history" | "surat";
type ConfirmVariant = "danger" | "warning" | "success";

interface MemberInternal {
  id: string;
  userId: string;
  name: string;
  role: string;
}

interface MemberExternal {
  id: string;
  name: string;
  affiliation: string;
  role: string;
}

interface FileItem {
  id: string;
  description: string;
  fileName: string;
  uploadedAt: string;
}

interface HistoryItem {
  id: string;
  actor: string;
  status: PkmStatus;
  note: string;
  createdAt: string;
}

interface SuratTugas {
  nomor: string;
  tanggal: string;
}

interface PkmRecord {
  id: string;
  userId: string;
  pengusul: string;
  sumberDana: string;
  judul: string;
  tempat: string;
  tglMulai: string;
  tglSelesai: string;
  keterangan: string;
  approvalStatus: PkmStatus;
  internalMembers: MemberInternal[];
  externalMembers: MemberExternal[];
  files: FileItem[];
  history: HistoryItem[];
  suratTugas: SuratTugas | null;
}

interface DraftState {
  sumberDana: string;
  judul: string;
  tempat: string;
  tglMulai: string;
  tglSelesai: string;
  keterangan: string;
  internalMembers: MemberInternal[];
  externalMembers: MemberExternal[];
}

const USER_OPTIONS = [
  { userId: "1", name: "Raka Pratama" },
  { userId: "2", name: "Dr. Fajar Nugroho, M.Si." },
  { userId: "3", name: "Dr. Arif Ramadhan, M.Sc." },
  { userId: "4", name: "Prof. Dimas Prakoso" },
];

const SUMBER_DANA_OPTIONS = ["Mandiri", "Internal Universitas", "DRTPM", "Mitra Industri", "Pemda"];
const INTERNAL_ROLE_OPTIONS = ["Ketua", "Anggota", "Pendamping"];
const EXTERNAL_ROLE_OPTIONS = ["Mitra Utama", "Anggota External", "Narasumber"];

const STATUS_CLASS: Record<PkmStatus, string> = {
  draft: "bg-slate-100 text-slate-600",
  submit: "bg-blue-50 text-blue-700",
  tolak: "bg-red-50 text-red-700",
  revisi: "bg-amber-50 text-amber-700",
  setuju: "bg-green-50 text-green-700",
  legitimasi: "bg-emerald-50 text-emerald-700",
};

const STATUS_LABEL: Record<PkmStatus, string> = {
  draft: "Draft",
  submit: "Submit",
  tolak: "Ditolak",
  revisi: "Revisi",
  setuju: "Setuju",
  legitimasi: "Legitimasi",
};

const MOCK_RECORDS: PkmRecord[] = [
  {
    id: "PKM-001",
    userId: "1",
    pengusul: "Raka Pratama",
    sumberDana: "Mandiri",
    judul: "PKM Literasi Digital UMKM",
    tempat: "Cilenggang, Tangerang Selatan",
    tglMulai: "2026-03-10",
    tglSelesai: "2026-06-20",
    keterangan: "Pendampingan pemasaran digital dan katalog produk untuk UMKM mitra.",
    approvalStatus: "draft",
    internalMembers: [
      { id: "INT-1", userId: "1", name: "Raka Pratama", role: "Ketua" },
      { id: "INT-2", userId: "3", name: "Dr. Arif Ramadhan, M.Sc.", role: "Anggota" },
    ],
    externalMembers: [{ id: "EXT-1", name: "Siti Nurhayati", affiliation: "UMKM Mitra", role: "Mitra Utama" }],
    files: [],
    history: [{ id: "HIS-1", actor: "Raka Pratama", status: "draft", note: "Draft PKM dibuat.", createdAt: "2026-03-09 09:10" }],
    suratTugas: null,
  },
  {
    id: "PKM-002",
    userId: "1",
    pengusul: "Raka Pratama",
    sumberDana: "Internal Universitas",
    judul: "PKM Administrasi Keuangan RT",
    tempat: "BSD City",
    tglMulai: "2026-01-12",
    tglSelesai: "2026-04-25",
    keterangan: "Penguatan pencatatan keuangan warga melalui spreadsheet sederhana.",
    approvalStatus: "tolak",
    internalMembers: [{ id: "INT-3", userId: "1", name: "Raka Pratama", role: "Ketua" }],
    externalMembers: [],
    files: [{ id: "FILE-1", description: "Proposal PKM", fileName: "proposal-keuangan.pdf", uploadedAt: "2026-01-13" }],
    history: [
      { id: "HIS-2", actor: "Raka Pratama", status: "draft", note: "Draft dibuat.", createdAt: "2026-01-10 08:20" },
      { id: "HIS-3", actor: "Raka Pratama", status: "submit", note: "Proposal disubmit.", createdAt: "2026-01-14 10:00" },
      { id: "HIS-4", actor: "Administrator", status: "tolak", note: "Mohon lengkapi indikator dampak dan target luaran.", createdAt: "2026-01-18 16:30" },
    ],
    suratTugas: null,
  },
  {
    id: "PKM-003",
    userId: "2",
    pengusul: "Dr. Fajar Nugroho, M.Si.",
    sumberDana: "DRTPM",
    judul: "PKM Bank Sampah Desa Digital",
    tempat: "Cisauk",
    tglMulai: "2026-02-05",
    tglSelesai: "2026-07-30",
    keterangan: "Pendampingan bank sampah berbasis dashboard monitoring.",
    approvalStatus: "submit",
    internalMembers: [{ id: "INT-4", userId: "2", name: "Dr. Fajar Nugroho, M.Si.", role: "Ketua" }],
    externalMembers: [{ id: "EXT-2", name: "Wahyu Pratama", affiliation: "Pemda", role: "Mitra Utama" }],
    files: [
      { id: "FILE-2", description: "Proposal PKM", fileName: "proposal-bank-sampah.pdf", uploadedAt: "2026-02-06" },
      { id: "FILE-3", description: "Surat Mitra", fileName: "surat-mitra.pdf", uploadedAt: "2026-02-06" },
    ],
    history: [
      { id: "HIS-5", actor: "Dr. Fajar Nugroho, M.Si.", status: "draft", note: "Draft dibuat.", createdAt: "2026-02-05 07:50" },
      { id: "HIS-6", actor: "Dr. Fajar Nugroho, M.Si.", status: "submit", note: "Proposal dikirim untuk review.", createdAt: "2026-02-07 09:12" },
    ],
    suratTugas: null,
  },
  {
    id: "PKM-004",
    userId: "3",
    pengusul: "Dr. Arif Ramadhan, M.Sc.",
    sumberDana: "Internal Universitas",
    judul: "PKM Digital Branding Produk Pangan Lokal",
    tempat: "Kabupaten Tangerang",
    tglMulai: "2026-01-20",
    tglSelesai: "2026-05-10",
    keterangan: "Kolaborasi dengan UMKM desa untuk branding dan pemasaran digital.",
    approvalStatus: "setuju",
    internalMembers: [{ id: "INT-5", userId: "3", name: "Dr. Arif Ramadhan, M.Sc.", role: "Ketua" }],
    externalMembers: [{ id: "EXT-3", name: "Rina Lestari", affiliation: "UMKM Mitra", role: "Mitra Utama" }],
    files: [{ id: "FILE-4", description: "Proposal PKM", fileName: "proposal-branding.pdf", uploadedAt: "2026-01-21" }],
    history: [
      { id: "HIS-7", actor: "Dr. Arif Ramadhan, M.Sc.", status: "submit", note: "Proposal dikirim.", createdAt: "2026-01-22 09:00" },
      { id: "HIS-8", actor: "Administrator", status: "setuju", note: "Proposal sesuai dan disetujui.", createdAt: "2026-01-28 11:40" },
    ],
    suratTugas: { nomor: "019/LPPM/PKM/2026", tanggal: "2026-01-28" },
  },
  {
    id: "PKM-005",
    userId: "1",
    pengusul: "Raka Pratama",
    sumberDana: "Mitra Industri",
    judul: "PKM Katalog Digital Kampung Wisata",
    tempat: "Serpong",
    tglMulai: "2025-11-12",
    tglSelesai: "2026-02-20",
    keterangan: "Pendampingan katalog digital dan pemetaan pengunjung.",
    approvalStatus: "legitimasi",
    internalMembers: [{ id: "INT-6", userId: "1", name: "Raka Pratama", role: "Ketua" }],
    externalMembers: [{ id: "EXT-4", name: "Pokdarwis", affiliation: "Komunitas Warga", role: "Mitra Utama" }],
    files: [
      { id: "FILE-5", description: "Proposal PKM", fileName: "proposal-kampung-wisata.pdf", uploadedAt: "2025-11-14" },
      { id: "FILE-6", description: "Lembar Pengesahan", fileName: "lembar-pengesahan.pdf", uploadedAt: "2025-11-14" },
    ],
    history: [
      { id: "HIS-9", actor: "Raka Pratama", status: "submit", note: "Proposal disubmit.", createdAt: "2025-11-15 09:20" },
      { id: "HIS-10", actor: "Administrator", status: "setuju", note: "Proposal disetujui.", createdAt: "2025-11-20 13:10" },
      { id: "HIS-11", actor: "Administrator", status: "legitimasi", note: "Surat tugas difinalkan.", createdAt: "2025-11-24 15:45" },
    ],
    suratTugas: { nomor: "117/LPPM/PKM/2025", tanggal: "2025-11-20" },
  },
];

function makeId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
}

function buildSuratNumber(id: string) {
  const digits = id.replace(/\D/g, "").slice(-3).padStart(3, "0");
  return `${digits}/LPPM/PKM/${new Date().getFullYear()}`;
}

function createEmptyDraft(userId: string, userName: string): DraftState {
  return {
    sumberDana: "Mandiri",
    judul: "",
    tempat: "",
    tglMulai: "",
    tglSelesai: "",
    keterangan: "",
    internalMembers: [{ id: makeId("INT"), userId, name: userName, role: "Ketua" }],
    externalMembers: [{ id: makeId("EXT"), name: "", affiliation: "", role: "Mitra Utama" }],
  };
}

function createDraftFromRecord(record: PkmRecord): DraftState {
  return {
    sumberDana: record.sumberDana,
    judul: record.judul,
    tempat: record.tempat,
    tglMulai: record.tglMulai,
    tglSelesai: record.tglSelesai,
    keterangan: record.keterangan,
    internalMembers: record.internalMembers.map((item) => ({ ...item })),
    externalMembers: record.externalMembers.map((item) => ({ ...item })),
  };
}

function StatusPill({ status }: { status: PkmStatus }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs ${STATUS_CLASS[status]}`} style={{ fontWeight: 600 }}>
      <span className="h-1.5 w-1.5 rounded-full bg-current/70" />
      {STATUS_LABEL[status]}
    </span>
  );
}

export function SuperAdminPkmPage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [records, setRecords] = useState<PkmRecord[]>(MOCK_RECORDS);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [draft, setDraft] = useState<DraftState | null>(null);
  const [note, setNote] = useState("");
  const [newFile, setNewFile] = useState({ description: "", fileName: "" });
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    title: "",
    message: "",
    variant: "danger" as ConfirmVariant,
    onConfirm: () => {},
  });
  const [toast, setToast] = useState({ show: false, message: "", type: "success" as "success" | "error" });

  const view = (searchParams.get("view") as PkmView | null) ?? "list";
  const filter = searchParams.get("filter");
  const tab = (searchParams.get("tab") as PkmTab | null) ?? "detail";
  const activeId = searchParams.get("id");
  const listMode: PkmListMode = filter === "submit" ? "baru" : filter === "approved" ? "approve" : "pkm-ku";
  const currentUserId = user?.id ?? "0";
  const currentUserName = user?.name ?? "Administrator";
  const selectedRecord = records.find((item) => item.id === activeId) ?? null;
  const isAdministrator = user?.role === "administrator";
  const isReviewer = user?.role === "reviewer";

  useEffect(() => {
    if (view === "new") {
      setDraft(createEmptyDraft(currentUserId, currentUserName));
      setNote("");
      setNewFile({ description: "", fileName: "" });
      return;
    }
    if ((view === "edit" || view === "detail" || view === "legacy") && selectedRecord) {
      setDraft(createDraftFromRecord(selectedRecord));
      setNote(selectedRecord.history[selectedRecord.history.length - 1]?.note ?? "");
      setNewFile({ description: "", fileName: "" });
    }
  }, [view, activeId, currentUserId, currentUserName, selectedRecord]);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((current) => ({ ...current, show: false })), 2600);
  };

  const goList = (mode: PkmListMode) => {
    const next = new URLSearchParams();
    if (mode === "baru") next.set("filter", "submit");
    if (mode === "approve") next.set("filter", "approved");
    setSearchParams(next);
  };

  const goView = (nextView: Exclude<PkmView, "list">, id?: string, nextTab?: PkmTab) => {
    const next = new URLSearchParams();
    if (listMode === "baru") next.set("filter", "submit");
    if (listMode === "approve") next.set("filter", "approved");
    next.set("view", nextView);
    if (id) next.set("id", id);
    if (nextTab) next.set("tab", nextTab);
    setSearchParams(next);
  };

  const openConfirm = (title: string, message: string, variant: ConfirmVariant, onConfirm: () => void) => {
    setConfirmModal({ open: true, title, message, variant, onConfirm });
  };

  const filteredRecords = records.filter((record) => {
    if (listMode === "pkm-ku" && record.userId !== currentUserId) return false;
    if (listMode === "baru" && record.approvalStatus !== "submit" && record.approvalStatus !== "revisi") return false;
    if (listMode === "approve" && record.approvalStatus !== "setuju") return false;
    return `${record.judul} ${record.pengusul} ${record.approvalStatus}`.toLowerCase().includes(search.toLowerCase());
  });

  const updateRecord = (id: string, updater: (record: PkmRecord) => PkmRecord) => {
    setRecords((current) => current.map((record) => (record.id === id ? updater(record) : record)));
  };

  const changeStatus = (record: PkmRecord, status: PkmStatus, actor: string, nextNote: string, createSurat = false) => {
    const historyItem: HistoryItem = {
      id: makeId("HIS"),
      actor,
      status,
      note: nextNote || `Status berubah ke ${STATUS_LABEL[status]}.`,
      createdAt: new Date().toLocaleString("id-ID"),
    };
    return {
      ...record,
      approvalStatus: status,
      suratTugas: createSurat && !record.suratTugas ? { nomor: buildSuratNumber(record.id), tanggal: new Date().toISOString().slice(0, 10) } : record.suratTugas,
      history: [...record.history, historyItem],
    };
  };

  const updateDraftField = (field: "sumberDana" | "judul" | "tempat" | "tglMulai" | "tglSelesai" | "keterangan", value: string) => {
    setDraft((current) => (current ? { ...current, [field]: value } : current));
  };

  const updateInternalMember = (id: string, field: "userId" | "role", value: string) => {
    setDraft((current) => {
      if (!current) return current;
      return {
        ...current,
        internalMembers: current.internalMembers.map((item) => {
          if (item.id !== id) return item;
          if (field === "userId") {
            return {
              ...item,
              userId: value,
              name: USER_OPTIONS.find((option) => option.userId === value)?.name ?? "",
            };
          }
          return { ...item, role: value };
        }),
      };
    });
  };

  const addInternalMember = () => {
    setDraft((current) =>
      current
        ? {
            ...current,
            internalMembers: [...current.internalMembers, { id: makeId("INT"), userId: "", name: "", role: "Anggota" }],
          }
        : current,
    );
  };

  const removeInternalMember = (id: string) => {
    setDraft((current) => {
      if (!current) return current;
      if (current.internalMembers.length === 1) {
        showToast("Minimal satu peneliti internal harus tetap ada.", "error");
        return current;
      }
      return {
        ...current,
        internalMembers: current.internalMembers.filter((item) => item.id !== id),
      };
    });
  };

  const updateExternalMember = (id: string, field: "name" | "affiliation" | "role", value: string) => {
    setDraft((current) => {
      if (!current) return current;
      return {
        ...current,
        externalMembers: current.externalMembers.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
      };
    });
  };

  const addExternalMember = () => {
    setDraft((current) =>
      current
        ? {
            ...current,
            externalMembers: [...current.externalMembers, { id: makeId("EXT"), name: "", affiliation: "", role: "Anggota External" }],
          }
        : current,
    );
  };

  const removeExternalMember = (id: string) => {
    setDraft((current) => {
      if (!current) return current;
      if (current.externalMembers.length === 1) {
        return {
          ...current,
          externalMembers: [{ id: makeId("EXT"), name: "", affiliation: "", role: "Mitra Utama" }],
        };
      }
      return {
        ...current,
        externalMembers: current.externalMembers.filter((item) => item.id !== id),
      };
    });
  };

  const resetExternalMembers = () => {
    setDraft((current) =>
      current
        ? {
            ...current,
            externalMembers: [{ id: makeId("EXT"), name: "", affiliation: "", role: "Mitra Utama" }],
          }
        : current,
    );
  };

  const resetDraft = () => {
    if (view === "new") {
      setDraft(createEmptyDraft(currentUserId, currentUserName));
      return;
    }
    if (selectedRecord) {
      setDraft(createDraftFromRecord(selectedRecord));
    }
  };

  const normalizeDraft = (value: DraftState) => {
    const internalMembers = value.internalMembers
      .filter((item) => item.userId)
      .map((item) => ({
        ...item,
        name: USER_OPTIONS.find((option) => option.userId === item.userId)?.name ?? item.name,
      }));
    const externalMembers = value.externalMembers.filter((item) => item.name.trim() || item.affiliation.trim());
    return { ...value, internalMembers, externalMembers };
  };

  const validateDraft = () => {
    if (!draft) return false;
    if (!draft.judul.trim() || !draft.tempat.trim() || !draft.tglMulai || !draft.tglSelesai) {
      showToast("Lengkapi judul, tempat, dan tanggal PKM terlebih dahulu.", "error");
      return false;
    }
    const normalized = normalizeDraft(draft);
    if (normalized.internalMembers.length === 0) {
      showToast("Tambahkan minimal satu peneliti internal.", "error");
      return false;
    }
    return true;
  };

  const applyDraftToRecord = (record: PkmRecord, source: DraftState) => ({
    ...record,
    sumberDana: source.sumberDana,
    judul: source.judul.trim(),
    tempat: source.tempat.trim(),
    tglMulai: source.tglMulai,
    tglSelesai: source.tglSelesai,
    keterangan: source.keterangan.trim(),
    internalMembers: source.internalMembers,
    externalMembers: source.externalMembers,
  });

  const saveDraft = (targetStatus: "draft" | "submit" | "revisi") => {
    if (!draft || !validateDraft()) return;
    const normalized = normalizeDraft(draft);

    if (view === "new") {
      const nextIdNumber = Math.max(0, ...records.map((item) => Number(item.id.replace(/\D/g, "")) || 0)) + 1;
      const nextId = `PKM-${String(nextIdNumber).padStart(3, "0")}`;
      const nextRecord: PkmRecord = {
        id: nextId,
        userId: currentUserId,
        pengusul: currentUserName,
        sumberDana: normalized.sumberDana,
        judul: normalized.judul.trim(),
        tempat: normalized.tempat.trim(),
        tglMulai: normalized.tglMulai,
        tglSelesai: normalized.tglSelesai,
        keterangan: normalized.keterangan.trim(),
        approvalStatus: "draft",
        internalMembers: normalized.internalMembers,
        externalMembers: normalized.externalMembers,
        files: [],
        history: [
          {
            id: makeId("HIS"),
            actor: currentUserName,
            status: "draft",
            note: "Draft PKM dibuat.",
            createdAt: new Date().toLocaleString("id-ID"),
          },
        ],
        suratTugas: null,
      };
      setRecords((current) => [nextRecord, ...current]);
      showToast("Draft PKM berhasil dibuat.");
      goView("detail", nextId);
      return;
    }

    if (!selectedRecord) return;

    if (targetStatus === "draft") {
      updateRecord(selectedRecord.id, (record) => applyDraftToRecord(record, normalized));
      showToast("Draft PKM berhasil diperbarui.");
      return;
    }

    if (selectedRecord.files.length === 0) {
      showToast("Tambahkan file pendukung sebelum mengirim PKM.", "error");
      return;
    }

    updateRecord(selectedRecord.id, (record) =>
      changeStatus(
        applyDraftToRecord(record, normalized),
        targetStatus,
        currentUserName,
        targetStatus === "revisi" ? "Perbaikan proposal dikirim ulang." : "Proposal dikirim untuk review.",
      ),
    );
    showToast(targetStatus === "revisi" ? "Revisi PKM berhasil dikirim." : "PKM berhasil disubmit.");
    goView("detail", selectedRecord.id, "history");
  };

  const addSupportingFile = () => {
    if (!selectedRecord) return;
    if (!newFile.description.trim() || !newFile.fileName.trim()) {
      showToast("Isi deskripsi dan nama file terlebih dahulu.", "error");
      return;
    }
    updateRecord(selectedRecord.id, (record) => ({
      ...record,
      files: [
        {
          id: makeId("FILE"),
          description: newFile.description.trim(),
          fileName: newFile.fileName.trim(),
          uploadedAt: new Date().toISOString().slice(0, 10),
        },
        ...record.files,
      ],
    }));
    setNewFile({ description: "", fileName: "" });
    showToast("File pendukung berhasil ditambahkan.");
  };

  const deleteSupportingFile = (fileId: string) => {
    if (!selectedRecord) return;
    updateRecord(selectedRecord.id, (record) => ({
      ...record,
      files: record.files.filter((item) => item.id !== fileId),
    }));
    showToast("File pendukung berhasil dihapus.");
  };

  const handleDetailStatus = (status: "submit" | "revisi" | "setuju" | "tolak" | "legitimasi") => {
    if (!selectedRecord) return;
    if ((status === "submit" || status === "revisi") && selectedRecord.files.length === 0) {
      showToast("Tambahkan file pendukung sebelum mengirim PKM.", "error");
      return;
    }

    updateRecord(selectedRecord.id, (record) =>
      changeStatus(
        record,
        status,
        currentUserName,
        note,
        status === "setuju",
      ),
    );
    setNote("");
    showToast(
      status === "setuju"
        ? "PKM berhasil disetujui dan surat tugas disiapkan."
        : status === "tolak"
          ? "PKM berhasil ditolak."
          : status === "legitimasi"
            ? "PKM berhasil dilegitimasi."
            : status === "revisi"
              ? "Revisi PKM berhasil dikirim."
              : "PKM berhasil disubmit.",
    );
    goView("detail", selectedRecord.id, status === "legitimasi" ? "surat" : "history");
  };

  const handleLegacyStatus = (status: "tolak" | "setuju" | "legitimasi") => {
    if (!selectedRecord) return;
    updateRecord(selectedRecord.id, (record) => changeStatus(record, status, currentUserName, note, false));
    setNote("");
    showToast(
      status === "setuju"
        ? "PKM disetujui lewat jalur legacy."
        : status === "tolak"
          ? "PKM ditolak lewat jalur legacy."
          : "PKM dilegitimasi lewat jalur legacy.",
    );
    if (status === "legitimasi") {
      goView("detail", selectedRecord.id, "surat");
      return;
    }
    goView("legacy", selectedRecord.id);
  };

  const isSelectedCreator = selectedRecord?.userId === currentUserId;
  const canManageFiles = !!selectedRecord && isSelectedCreator && (selectedRecord.approvalStatus === "draft" || selectedRecord.approvalStatus === "tolak");
  const canReviewRecord = !!selectedRecord && !isSelectedCreator && (selectedRecord.approvalStatus === "submit" || selectedRecord.approvalStatus === "revisi");
  const canLegitimize = !!selectedRecord && isAdministrator && selectedRecord.approvalStatus === "setuju";

  if (!user) {
    return <EmptyState variant="session-expired" />;
  }

  if (!isAdministrator && !isReviewer) {
    return (
      <PageWrapper title="PKM" subtitle="Flow ini khusus administrator dan reviewer." breadcrumbs={[{ label: "PKM" }]}>
        <EmptyState variant="no-access" title="Akses PKM super admin ditolak" description="Halaman pengabdian dosen tetap memakai flow hibah yang sudah ada." />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title="PKM Administrator"
      subtitle="Implementasi flow PKM dari web lama ke React baru untuk administrator dan reviewer."
      breadcrumbs={[{ label: "PKM" }]}
      actions={
        view !== "list" ? (
          <button onClick={() => goList(listMode)} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 hover:bg-slate-50" style={{ fontWeight: 600 }}>
            <ChevronLeft className="h-4 w-4" />
            Kembali ke List
          </button>
        ) : null
      }
    >
      <div className="space-y-4">
        {view === "list" ? (
          <div className="flex justify-end">
            <div className="inline-flex flex-wrap gap-2 rounded-xl bg-slate-100 p-1">
              {(["pkm-ku", "baru", "approve"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => goList(mode)}
                  className={`rounded-lg px-3 py-2 text-xs ${listMode === mode ? "bg-[#E30613] text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}
                  style={{ fontWeight: 600 }}
                >
                  {mode === "pkm-ku" ? "PKM Ku" : mode === "baru" ? "Baru" : "Approve"}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {view === "list" ? (
          <div className="rounded-xl border border-slate-200 bg-white">
            <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm text-slate-900" style={{ fontWeight: 600 }}>{listMode === "pkm-ku" ? "PKM Ku" : listMode === "baru" ? "Baru" : "Approve"}</h3>
                <p className="mt-1 text-xs text-slate-500">{listMode === "pkm-ku" ? "Daftar ajuan PKM milik Anda." : listMode === "baru" ? "Proposal PKM status submit atau revisi." : "Proposal PKM yang sudah disetujui."}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative min-w-[220px]">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari judul, pengusul, status" className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm text-slate-700 outline-none focus:border-[#E30613]/40 focus:ring-2 focus:ring-[#E30613]/15" />
                </div>
                {listMode === "pkm-ku" ? (
                  <>
                    <button
                      onClick={() => {
                        if (selectedIds.length === 0) {
                          showToast("Pilih minimal satu draft PKM untuk dihapus.", "error");
                          return;
                        }
                        openConfirm("Hapus data terpilih?", "Semua PKM terpilih akan dihapus dari list.", "danger", () => {
                          setRecords((current) => current.filter((item) => !selectedIds.includes(item.id)));
                          setSelectedIds([]);
                          showToast("PKM terpilih berhasil dihapus.");
                        });
                      }}
                      className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700 hover:bg-red-100"
                      style={{ fontWeight: 600 }}
                    >
                      <Trash2 className="h-4 w-4" />
                      Hapus
                    </button>
                    <button onClick={() => goView("new")} className="inline-flex items-center gap-2 rounded-lg bg-[#E30613] px-4 py-2 text-sm text-white hover:bg-[#c00510]" style={{ fontWeight: 600 }}>
                      <Plus className="h-4 w-4" />
                      Tambah
                    </button>
                  </>
                ) : null}
              </div>
            </div>

            {filteredRecords.length === 0 ? (
              <EmptyState variant={search ? "no-results" : "no-data"} title="Belum ada data PKM" description="Belum ada ajuan yang cocok dengan filter aktif saat ini." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50/60">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs text-slate-500">
                        <input
                          type="checkbox"
                          checked={selectedIds.length > 0 && selectedIds.length === filteredRecords.length}
                          onChange={() => setSelectedIds(selectedIds.length === filteredRecords.length ? [] : filteredRecords.map((item) => item.id))}
                          className="h-4 w-4 rounded border-slate-300"
                        />
                      </th>
                      <th className="px-4 py-3 text-left text-xs text-slate-500">Tanggal</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-500">Pengusul</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-500">Judul</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-500">Status</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-500">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredRecords.map((record) => {
                      const isCreator = record.userId === currentUserId;
                      return (
                        <tr key={record.id} className="hover:bg-slate-50/40">
                          <td className="px-4 py-3"><input type="checkbox" checked={selectedIds.includes(record.id)} onChange={() => setSelectedIds((current) => current.includes(record.id) ? current.filter((item) => item !== record.id) : [...current, record.id])} className="h-4 w-4 rounded border-slate-300" /></td>
                          <td className="px-4 py-3 text-sm text-slate-600">{formatDate(record.tglMulai)}</td>
                          <td className="px-4 py-3 text-sm text-slate-600">{record.pengusul}</td>
                          <td className="px-4 py-3 text-sm text-slate-700">
                            <p style={{ fontWeight: 600 }}>{record.judul}</p>
                            <p className="mt-1 text-xs text-slate-400">{record.id}</p>
                          </td>
                          <td className="px-4 py-3"><StatusPill status={record.approvalStatus} /></td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap items-center gap-2">
                              {isAdministrator && record.approvalStatus !== "draft" ? <button onClick={() => goView("legacy", record.id)} className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"><FileSearch className="h-4 w-4" /></button> : null}
                              {isAdministrator && record.approvalStatus === "legitimasi" ? <button onClick={() => goView("detail", record.id, "surat")} className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"><FileText className="h-4 w-4" /></button> : null}
                              {isCreator && (record.approvalStatus === "draft" || record.approvalStatus === "tolak") ? <button onClick={() => goView("edit", record.id)} className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:border-amber-200 hover:bg-amber-50 hover:text-amber-700"><Pencil className="h-4 w-4" /></button> : null}
                              {isCreator && record.approvalStatus === "draft" ? <button onClick={() => openConfirm("Hapus PKM?", "Draft PKM ini akan dihapus permanen.", "danger", () => { setRecords((current) => current.filter((item) => item.id !== record.id)); showToast("Draft PKM berhasil dihapus."); })} className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-700"><Trash2 className="h-4 w-4" /></button> : null}
                              {isCreator && record.approvalStatus === "legitimasi" ? <button onClick={() => showToast(`Simulasi download Word untuk ${record.id}.`)} className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"><Download className="h-4 w-4" /></button> : null}
                              <button onClick={() => goView("detail", record.id)} className="rounded-lg bg-slate-900 px-3 py-2 text-xs text-white hover:bg-slate-700" style={{ fontWeight: 600 }}>Detail</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : null}
        {(view === "new" || view === "edit") && draft ? (
          <div className="space-y-4">
            {view === "edit" && selectedRecord && selectedRecord.approvalStatus !== "draft" && selectedRecord.approvalStatus !== "tolak" ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-700">
                Draft ini sudah masuk proses review. Edit hanya dibuka untuk status `draft` atau `tolak`.
              </div>
            ) : (
              <>
                <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(340px,0.9fr)]">
                  <div className="rounded-xl border border-slate-200 bg-white">
                    <div className="border-b border-slate-100 px-5 py-4">
                      <h3 className="text-sm text-slate-900" style={{ fontWeight: 600 }}>{view === "new" ? "Tambah PKM" : "Edit Penelitian"}</h3>
                      <p className="mt-1 text-xs text-slate-500">
                        {view === "new" ? "Form ini mengikuti struktur PKM lama: metadata utama di kiri, anggota internal dan external di kanan." : "Label Penelitian dipertahankan agar tetap dekat dengan behavior Blade lama."}
                      </p>
                    </div>
                    <div className="space-y-4 px-5 py-5">
                      <div>
                        <label className="mb-2 block text-xs text-slate-500" style={{ fontWeight: 600 }}>Diajukan Oleh</label>
                        <input value={currentUserName} disabled className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-500" />
                      </div>
                      <div>
                        <label className="mb-2 block text-xs text-slate-500" style={{ fontWeight: 600 }}>Sumber Pendanaan</label>
                        <select value={draft.sumberDana} onChange={(event) => updateDraftField("sumberDana", event.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#E30613]/40 focus:ring-2 focus:ring-[#E30613]/15">
                          {SUMBER_DANA_OPTIONS.map((item) => (
                            <option key={item} value={item}>{item}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="mb-2 block text-xs text-slate-500" style={{ fontWeight: 600 }}>Judul Penelitian</label>
                        <textarea value={draft.judul} onChange={(event) => updateDraftField("judul", event.target.value)} rows={4} placeholder="Masukkan judul PKM" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#E30613]/40 focus:ring-2 focus:ring-[#E30613]/15" />
                      </div>
                      <div>
                        <label className="mb-2 block text-xs text-slate-500" style={{ fontWeight: 600 }}>Tempat Penelitian</label>
                        <textarea value={draft.tempat} onChange={(event) => updateDraftField("tempat", event.target.value)} rows={3} placeholder="Lokasi kegiatan PKM" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#E30613]/40 focus:ring-2 focus:ring-[#E30613]/15" />
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-xs text-slate-500" style={{ fontWeight: 600 }}>Tanggal Mulai</label>
                          <input type="date" value={draft.tglMulai} onChange={(event) => updateDraftField("tglMulai", event.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#E30613]/40 focus:ring-2 focus:ring-[#E30613]/15" />
                        </div>
                        <div>
                          <label className="mb-2 block text-xs text-slate-500" style={{ fontWeight: 600 }}>Tanggal Selesai</label>
                          <input type="date" value={draft.tglSelesai} onChange={(event) => updateDraftField("tglSelesai", event.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#E30613]/40 focus:ring-2 focus:ring-[#E30613]/15" />
                        </div>
                      </div>
                      <div>
                        <label className="mb-2 block text-xs text-slate-500" style={{ fontWeight: 600 }}>Keterangan</label>
                        <textarea value={draft.keterangan} onChange={(event) => updateDraftField("keterangan", event.target.value)} rows={4} placeholder="Deskripsi singkat kegiatan" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#E30613]/40 focus:ring-2 focus:ring-[#E30613]/15" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-xl border border-slate-200 bg-white">
                      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                        <div>
                          <h3 className="text-sm text-slate-900" style={{ fontWeight: 600 }}>Peneliti Pradita</h3>
                          <p className="mt-1 text-xs text-slate-500">Minimal satu anggota internal wajib ada sebelum draft disimpan.</p>
                        </div>
                        <button onClick={addInternalMember} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 hover:bg-slate-50" style={{ fontWeight: 600 }}>
                          <Plus className="h-4 w-4" />
                          Tambah
                        </button>
                      </div>
                      <div className="space-y-3 px-5 py-4">
                        {draft.internalMembers.map((item, index) => (
                          <div key={item.id} className="rounded-lg border border-slate-200 bg-slate-50/60 p-3">
                            <div className="mb-3 flex items-center justify-between">
                              <p className="text-xs text-slate-500" style={{ fontWeight: 600 }}>Anggota Internal {index + 1}</p>
                              {draft.internalMembers.length > 1 ? (
                                <button onClick={() => removeInternalMember(item.id)} className="rounded-md p-1 text-slate-400 hover:bg-red-50 hover:text-red-600">
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              ) : null}
                            </div>
                            <div className="grid gap-3">
                              <select value={item.userId} onChange={(event) => updateInternalMember(item.id, "userId", event.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#E30613]/40 focus:ring-2 focus:ring-[#E30613]/15">
                                <option value="">Pilih peneliti</option>
                                {USER_OPTIONS.map((option) => (
                                  <option key={option.userId} value={option.userId}>{option.name}</option>
                                ))}
                              </select>
                              <select value={item.role} onChange={(event) => updateInternalMember(item.id, "role", event.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#E30613]/40 focus:ring-2 focus:ring-[#E30613]/15">
                                {INTERNAL_ROLE_OPTIONS.map((option) => (
                                  <option key={option} value={option}>{option}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white">
                      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                        <div>
                          <h3 className="text-sm text-slate-900" style={{ fontWeight: 600 }}>Anggota External</h3>
                          <p className="mt-1 text-xs text-slate-500">Bagian ini fleksibel dan boleh kosong, tetapi baris awal tetap disediakan seperti flow lama.</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={resetExternalMembers} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 hover:bg-slate-50" style={{ fontWeight: 600 }}>
                            Reset
                          </button>
                          <button onClick={addExternalMember} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 hover:bg-slate-50" style={{ fontWeight: 600 }}>
                            <Plus className="h-4 w-4" />
                            Tambah
                          </button>
                        </div>
                      </div>
                      <div className="space-y-3 px-5 py-4">
                        {draft.externalMembers.map((item, index) => (
                          <div key={item.id} className="rounded-lg border border-slate-200 bg-slate-50/60 p-3">
                            <div className="mb-3 flex items-center justify-between">
                              <p className="text-xs text-slate-500" style={{ fontWeight: 600 }}>External {index + 1}</p>
                              <button onClick={() => removeExternalMember(item.id)} className="rounded-md p-1 text-slate-400 hover:bg-red-50 hover:text-red-600">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                            <div className="grid gap-3">
                              <input value={item.name} onChange={(event) => updateExternalMember(item.id, "name", event.target.value)} placeholder="Nama external" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#E30613]/40 focus:ring-2 focus:ring-[#E30613]/15" />
                              <input value={item.affiliation} onChange={(event) => updateExternalMember(item.id, "affiliation", event.target.value)} placeholder="Afiliasi" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#E30613]/40 focus:ring-2 focus:ring-[#E30613]/15" />
                              <select value={item.role} onChange={(event) => updateExternalMember(item.id, "role", event.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#E30613]/40 focus:ring-2 focus:ring-[#E30613]/15">
                                {EXTERNAL_ROLE_OPTIONS.map((option) => (
                                  <option key={option} value={option}>{option}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-xs text-slate-500">
                    {view === "new" ? "Tombol Lanjut akan membuat draft lalu membawa Anda ke halaman detail untuk upload file pendukung." : `File pendukung saat ini: ${selectedRecord?.files.length ?? 0}. Submit hanya aktif jika file sudah ada.`}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button onClick={() => goList(listMode)} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 hover:bg-slate-50" style={{ fontWeight: 600 }}>
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </button>
                    {view === "edit" ? (
                      <>
                        {selectedRecord?.approvalStatus === "draft" ? (
                          <>
                            <button onClick={() => saveDraft("draft")} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50" style={{ fontWeight: 600 }}>
                              Draft
                            </button>
                            <button onClick={() => saveDraft("submit")} disabled={(selectedRecord?.files.length ?? 0) === 0} className="inline-flex items-center gap-2 rounded-lg bg-[#E30613] px-4 py-2 text-sm text-white hover:bg-[#c00510] disabled:cursor-not-allowed disabled:bg-slate-300" style={{ fontWeight: 600 }}>
                              <Send className="h-4 w-4" />
                              Submit
                            </button>
                          </>
                        ) : null}
                        {selectedRecord?.approvalStatus === "tolak" ? (
                          <button onClick={() => saveDraft("revisi")} disabled={(selectedRecord?.files.length ?? 0) === 0} className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm text-white hover:bg-amber-600 disabled:cursor-not-allowed disabled:bg-slate-300" style={{ fontWeight: 600 }}>
                            <Send className="h-4 w-4" />
                            Revisi
                          </button>
                        ) : null}
                      </>
                    ) : (
                      <button onClick={() => saveDraft("draft")} className="inline-flex items-center gap-2 rounded-lg bg-[#E30613] px-4 py-2 text-sm text-white hover:bg-[#c00510]" style={{ fontWeight: 600 }}>
                        <FolderPlus className="h-4 w-4" />
                        Lanjut
                      </button>
                    )}
                    <button onClick={resetDraft} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 hover:bg-slate-50" style={{ fontWeight: 600 }}>
                      Reset
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : null}
        {view === "detail" ? (
          selectedRecord ? (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200 bg-white">
                <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm text-slate-900" style={{ fontWeight: 600 }}>{selectedRecord.judul}</h3>
                      <StatusPill status={selectedRecord.approvalStatus} />
                    </div>
                    <p className="mt-1 text-xs text-slate-500">{selectedRecord.id} · {selectedRecord.pengusul}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(["detail", "files", "history", "surat"] as const).map((item) => (
                      <button
                        key={item}
                        onClick={() => goView("detail", selectedRecord.id, item)}
                        className={`rounded-lg px-3 py-2 text-xs ${tab === item ? "bg-[#E30613] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                        style={{ fontWeight: 600 }}
                      >
                        {item === "detail" ? "Detail" : item === "files" ? "File Pendukung" : item === "history" ? "History" : "Surat Tugas"}
                      </button>
                    ))}
                  </div>
                </div>

                {tab === "detail" ? (
                  <div className="grid gap-4 px-5 py-5 lg:grid-cols-[minmax(0,1fr)_320px]">
                    <div className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                          <p className="text-xs text-slate-500" style={{ fontWeight: 600 }}>Nomor ST</p>
                          <p className="mt-2 text-sm text-slate-700">{selectedRecord.suratTugas?.nomor ?? "-"}</p>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                          <p className="text-xs text-slate-500" style={{ fontWeight: 600 }}>Sumber Dana</p>
                          <p className="mt-2 text-sm text-slate-700">{selectedRecord.sumberDana}</p>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
                          <p className="text-xs text-slate-500" style={{ fontWeight: 600 }}>Deskripsi</p>
                          <p className="mt-2 text-sm leading-6 text-slate-700">{selectedRecord.keterangan || "-"}</p>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                          <p className="text-xs text-slate-500" style={{ fontWeight: 600 }}>Tempat</p>
                          <p className="mt-2 text-sm text-slate-700">{selectedRecord.tempat}</p>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                          <p className="text-xs text-slate-500" style={{ fontWeight: 600 }}>Tanggal</p>
                          <p className="mt-2 text-sm text-slate-700">{formatDate(selectedRecord.tglMulai)} - {formatDate(selectedRecord.tglSelesai)}</p>
                        </div>
                      </div>

                      <div className="rounded-xl border border-slate-200">
                        <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
                          <Users className="h-4 w-4 text-[#E30613]" />
                          <h4 className="text-sm text-slate-900" style={{ fontWeight: 600 }}>Peneliti Pradita</h4>
                        </div>
                        <div className="divide-y divide-slate-100">
                          {selectedRecord.internalMembers.map((item) => (
                            <div key={item.id} className="flex items-center justify-between px-4 py-3 text-sm text-slate-700">
                              <span>{item.name}</span>
                              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">{item.role}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {selectedRecord.externalMembers.length > 0 ? (
                        <div className="rounded-xl border border-slate-200">
                          <div className="border-b border-slate-100 px-4 py-3">
                            <h4 className="text-sm text-slate-900" style={{ fontWeight: 600 }}>Peneliti External</h4>
                          </div>
                          <div className="divide-y divide-slate-100">
                            {selectedRecord.externalMembers.map((item) => (
                              <div key={item.id} className="grid gap-1 px-4 py-3 text-sm text-slate-700 sm:grid-cols-[minmax(0,1fr)_180px_140px] sm:items-center">
                                <span>{item.name || "-"}</span>
                                <span className="text-slate-500">{item.affiliation || "-"}</span>
                                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">{item.role}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs text-slate-500" style={{ fontWeight: 600 }}>Status Saat Ini</p>
                        <div className="mt-3"><StatusPill status={selectedRecord.approvalStatus} /></div>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-white p-4">
                        <label className="mb-2 block text-xs text-slate-500" style={{ fontWeight: 600 }}>Catatan</label>
                        <textarea value={note} onChange={(event) => setNote(event.target.value)} rows={9} placeholder="Catatan review atau submit akan ikut tersimpan ke history." className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#E30613]/40 focus:ring-2 focus:ring-[#E30613]/15" />
                        <p className="mt-2 text-xs text-slate-400">Textarea ini menggantikan alur catatan AJAX dari halaman lama.</p>
                      </div>
                    </div>
                  </div>
                ) : null}

                {tab === "files" ? (
                  <div className="space-y-4 px-5 py-5">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h4 className="text-sm text-slate-900" style={{ fontWeight: 600 }}>File Pendukung</h4>
                          <p className="mt-1 text-xs text-slate-500">{selectedRecord.files.length === 0 ? "File pendukung kegiatan tidak ditemukan." : `${selectedRecord.files.length} file pendukung sudah diunggah.`}</p>
                        </div>
                        {canManageFiles ? (
                          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-700">Draft/Tolak: file masih bisa dikelola</span>
                        ) : null}
                      </div>
                    </div>

                    {canManageFiles ? (
                      <div className="grid gap-3 rounded-xl border border-dashed border-slate-300 bg-white p-4 sm:grid-cols-[minmax(0,1fr)_220px_auto] sm:items-end">
                        <div>
                          <label className="mb-2 block text-xs text-slate-500" style={{ fontWeight: 600 }}>Nama File</label>
                          <input value={newFile.description} onChange={(event) => setNewFile((current) => ({ ...current, description: event.target.value }))} placeholder="Contoh: Proposal PKM" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#E30613]/40 focus:ring-2 focus:ring-[#E30613]/15" />
                        </div>
                        <div>
                          <label className="mb-2 block text-xs text-slate-500" style={{ fontWeight: 600 }}>File</label>
                          <input type="file" onChange={(event) => setNewFile((current) => ({ ...current, fileName: event.target.files?.[0]?.name ?? "" }))} className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-xs file:text-slate-600 hover:file:bg-slate-200" />
                          {newFile.fileName ? <p className="mt-2 text-xs text-slate-400">{newFile.fileName}</p> : null}
                        </div>
                        <button onClick={addSupportingFile} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#E30613] px-4 py-2 text-sm text-white hover:bg-[#c00510]" style={{ fontWeight: 600 }}>
                          <Upload className="h-4 w-4" />
                          Tambah File
                        </button>
                      </div>
                    ) : null}

                    {selectedRecord.files.length === 0 ? (
                      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                        Silahkan submit file pendukung sebelum proposal dikirim ke reviewer.
                      </div>
                    ) : (
                      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                        <table className="w-full">
                          <thead className="bg-slate-50/70">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs text-slate-500">Deskripsi</th>
                              <th className="px-4 py-3 text-left text-xs text-slate-500">File</th>
                              <th className="px-4 py-3 text-left text-xs text-slate-500">Tanggal</th>
                              <th className="px-4 py-3 text-left text-xs text-slate-500">Aksi</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {selectedRecord.files.map((item) => (
                              <tr key={item.id}>
                                <td className="px-4 py-3 text-sm text-slate-700">{item.description}</td>
                                <td className="px-4 py-3 text-sm text-slate-600">{item.fileName}</td>
                                <td className="px-4 py-3 text-sm text-slate-500">{formatDate(item.uploadedAt)}</td>
                                <td className="px-4 py-3">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <button onClick={() => showToast(`Preview file ${item.fileName} disimulasikan.`)} className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">
                                      <Eye className="h-4 w-4" />
                                    </button>
                                    {canManageFiles ? (
                                      <button onClick={() => openConfirm("Hapus file pendukung?", `${item.fileName} akan dihapus dari proposal ini.`, "danger", () => deleteSupportingFile(item.id))} className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-700">
                                        <Trash2 className="h-4 w-4" />
                                      </button>
                                    ) : null}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ) : null}

                {tab === "history" ? (
                  <div className="space-y-4 px-5 py-5">
                    {selectedRecord.history.length === 0 ? (
                      <EmptyState variant="no-data" title="History belum tersedia" description="Belum ada perubahan status untuk proposal ini." />
                    ) : (
                      <div className="space-y-4">
                        {selectedRecord.history.slice().reverse().map((item) => (
                          <div key={item.id} className="flex gap-4 rounded-xl border border-slate-200 bg-white p-4">
                            <div className="flex w-10 shrink-0 justify-center">
                              <span className="mt-1 h-3.5 w-3.5 rounded-full bg-[#E30613]/80" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex flex-wrap items-center gap-2">
                                  <p className="text-sm text-slate-900" style={{ fontWeight: 600 }}>{item.actor}</p>
                                  <StatusPill status={item.status} />
                                </div>
                                <p className="text-xs text-slate-400">{item.createdAt}</p>
                              </div>
                              <p className="mt-2 text-sm leading-6 text-slate-600">{item.note || "-"}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : null}

                {tab === "surat" ? (
                  <div className="space-y-4 px-5 py-5">
                    {selectedRecord.approvalStatus === "legitimasi" && selectedRecord.suratTugas ? (
                      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <h4 className="text-sm text-emerald-800" style={{ fontWeight: 600 }}>Surat Tugas Tersedia</h4>
                            <p className="mt-2 text-sm text-emerald-700">Nomor: {selectedRecord.suratTugas.nomor}</p>
                            <p className="mt-1 text-sm text-emerald-700">Tanggal: {formatDate(selectedRecord.suratTugas.tanggal)}</p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <button onClick={() => showToast(`Preview PDF ${selectedRecord.id} disimulasikan.`)} className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-white px-4 py-2 text-sm text-emerald-700 hover:bg-emerald-100" style={{ fontWeight: 600 }}>
                              <Eye className="h-4 w-4" />
                              Preview
                            </button>
                            <button onClick={() => showToast(`Download PDF ${selectedRecord.id} disimulasikan.`)} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700" style={{ fontWeight: 600 }}>
                              <Download className="h-4 w-4" />
                              Download PDF
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : selectedRecord.approvalStatus === "legitimasi" ? (
                      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-700">
                        Proposal sudah berstatus legitimasi, tetapi nomor surat belum terbentuk. Ini bisa terjadi jika approval lewat jalur legacy yang tidak membuat surat tugas otomatis.
                      </div>
                    ) : (
                      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600">
                        Surat Tugas akan tersedia setelah proposal disetujui dan masuk tahap legitimasi.
                      </div>
                    )}
                  </div>
                ) : null}
              </div>

              <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <button onClick={() => goList(listMode)} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 hover:bg-slate-50" style={{ fontWeight: 600 }}>
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </button>
                  {selectedRecord.files.length === 0 ? (
                    <span className="inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
                      <AlertTriangle className="h-4 w-4" />
                      Tambahkan file pendukung sebelum submit
                    </span>
                  ) : null}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {isSelectedCreator && selectedRecord.approvalStatus === "draft" ? (
                    <button onClick={() => handleDetailStatus("submit")} className="inline-flex items-center gap-2 rounded-lg bg-[#E30613] px-4 py-2 text-sm text-white hover:bg-[#c00510]" style={{ fontWeight: 600 }}>
                      <Send className="h-4 w-4" />
                      Submit
                    </button>
                  ) : null}
                  {isSelectedCreator && selectedRecord.approvalStatus === "tolak" ? (
                    <button onClick={() => handleDetailStatus("revisi")} className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm text-white hover:bg-amber-600" style={{ fontWeight: 600 }}>
                      <Send className="h-4 w-4" />
                      Submit Revisi
                    </button>
                  ) : null}
                  {canReviewRecord ? (
                    <>
                      <button onClick={() => openConfirm("Tolak proposal ini?", "Status akan berubah menjadi tolak dan catatan akan disimpan ke history.", "warning", () => handleDetailStatus("tolak"))} className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700 hover:bg-red-100" style={{ fontWeight: 600 }}>
                        <XCircle className="h-4 w-4" />
                        Tolak
                      </button>
                      <button onClick={() => openConfirm("Setujui proposal ini?", "Status akan berubah menjadi setuju dan surat tugas akan disiapkan.", "success", () => handleDetailStatus("setuju"))} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700" style={{ fontWeight: 600 }}>
                        <CheckCircle2 className="h-4 w-4" />
                        Setuju
                      </button>
                    </>
                  ) : null}
                  {canLegitimize ? (
                    <button onClick={() => openConfirm("Legitimasi proposal ini?", "Status akan berubah menjadi legitimasi.", "success", () => handleDetailStatus("legitimasi"))} className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-700" style={{ fontWeight: 600 }}>
                      <FileText className="h-4 w-4" />
                      Legitimasi
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          ) : (
            <EmptyState variant="no-data" title="Data PKM tidak ditemukan" description="Record yang Anda buka tidak ada atau sudah terhapus dari mock state." />
          )
        ) : null}
        {view === "legacy" ? (
          selectedRecord ? (
            <div className="space-y-4">
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-white">
                  <div className="border-b border-slate-100 px-5 py-4">
                    <h3 className="text-sm text-slate-900" style={{ fontWeight: 600 }}>Legacy Approval View</h3>
                    <p className="mt-1 text-xs text-slate-500">Halaman ini meniru `viewpenelitian` lama yang memproses approval lewat jalur POST biasa.</p>
                  </div>
                  <div className="space-y-4 px-5 py-5">
                    <div>
                      <p className="text-xs text-slate-500" style={{ fontWeight: 600 }}>Ketua</p>
                      <p className="mt-2 text-sm text-slate-700">{selectedRecord.internalMembers[0]?.name ?? selectedRecord.pengusul}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500" style={{ fontWeight: 600 }}>Anggota</p>
                      <div className="mt-2 space-y-2">
                        {selectedRecord.internalMembers.slice(1).length > 0 ? selectedRecord.internalMembers.slice(1).map((item) => (
                          <div key={item.id} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                            {item.name} · {item.role}
                          </div>
                        )) : <p className="text-sm text-slate-400">Belum ada anggota tambahan.</p>}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500" style={{ fontWeight: 600 }}>Judul Penelitian</p>
                      <p className="mt-2 text-sm leading-6 text-slate-700">{selectedRecord.judul}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500" style={{ fontWeight: 600 }}>Keterangan</p>
                      <p className="mt-2 text-sm leading-6 text-slate-700">{selectedRecord.keterangan || "-"}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white">
                  <div className="border-b border-slate-100 px-5 py-4">
                    <h3 className="text-sm text-slate-900" style={{ fontWeight: 600 }}>Ringkasan Lampiran dan Catatan</h3>
                    <p className="mt-1 text-xs text-slate-500">Berbeda dari jalur detail AJAX, persetujuan legacy tidak membuat surat tugas otomatis saat status menjadi setuju.</p>
                  </div>
                  <div className="space-y-4 px-5 py-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-xs text-slate-500" style={{ fontWeight: 600 }}>Tempat Penelitian</p>
                        <p className="mt-2 text-sm text-slate-700">{selectedRecord.tempat}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500" style={{ fontWeight: 600 }}>Tanggal</p>
                        <p className="mt-2 text-sm text-slate-700">{formatDate(selectedRecord.tglMulai)} - {formatDate(selectedRecord.tglSelesai)}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500" style={{ fontWeight: 600 }}>Lampiran</p>
                      <div className="mt-2 space-y-2">
                        {selectedRecord.files.length > 0 ? selectedRecord.files.map((item) => (
                          <div key={item.id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                            <span>{item.description}</span>
                            <span className="text-xs text-slate-400">{item.fileName}</span>
                          </div>
                        )) : <p className="text-sm text-slate-400">Belum ada lampiran.</p>}
                      </div>
                    </div>
                    <div>
                      <label className="mb-2 block text-xs text-slate-500" style={{ fontWeight: 600 }}>Catatan</label>
                      <textarea value={note} onChange={(event) => setNote(event.target.value)} rows={8} placeholder="Catatan approval legacy" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#E30613]/40 focus:ring-2 focus:ring-[#E30613]/15" />
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500">
                      Status sekarang: <span className="text-slate-700" style={{ fontWeight: 600 }}>{STATUS_LABEL[selectedRecord.approvalStatus]}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <button onClick={() => goList(listMode)} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 hover:bg-slate-50" style={{ fontWeight: 600 }}>
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
                <div className="flex flex-wrap items-center gap-2">
                  {(selectedRecord.approvalStatus === "submit" || selectedRecord.approvalStatus === "revisi") ? (
                    <>
                      <button onClick={() => openConfirm("Tolak proposal ini?", "Approval legacy akan mengubah status menjadi tolak tanpa side effect surat tugas.", "warning", () => handleLegacyStatus("tolak"))} className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700 hover:bg-red-100" style={{ fontWeight: 600 }}>
                        <XCircle className="h-4 w-4" />
                        Tolak
                      </button>
                      <button onClick={() => openConfirm("Setujui proposal ini?", "Approval legacy hanya mengubah status dan history, tanpa membuat surat tugas otomatis.", "success", () => handleLegacyStatus("setuju"))} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700" style={{ fontWeight: 600 }}>
                        <CheckCircle2 className="h-4 w-4" />
                        Setuju
                      </button>
                    </>
                  ) : null}
                  {selectedRecord.approvalStatus === "setuju" ? (
                    <button onClick={() => openConfirm("Legitimasi proposal ini?", "Status akan menjadi legitimasi lewat jalur legacy.", "success", () => handleLegacyStatus("legitimasi"))} className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-700" style={{ fontWeight: 600 }}>
                      <FileText className="h-4 w-4" />
                      Dekan Legitimasi
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          ) : (
            <EmptyState variant="no-data" title="Data PKM tidak ditemukan" description="Record legacy yang Anda buka tidak ada di mock state." />
          )
        ) : null}
      </div>

      <ConfirmModal {...confirmModal} isOpen={confirmModal.open} onClose={() => setConfirmModal((current) => ({ ...current, open: false }))} />
      {toast.show ? <div className={`fixed bottom-6 right-6 z-[120] flex items-center gap-3 rounded-xl border px-5 py-3 shadow-lg ${toast.type === "success" ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-700"}`}>{toast.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}<span className="text-sm" style={{ fontWeight: 600 }}>{toast.message}</span></div> : null}
    </PageWrapper>
  );
}
