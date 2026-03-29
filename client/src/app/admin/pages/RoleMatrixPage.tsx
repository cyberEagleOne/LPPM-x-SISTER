import { useState } from "react";
import {
  LayoutGrid, Eye, Shield, ArrowRightLeft, SidebarIcon, AlertTriangle,
  CheckCircle, XCircle, Minus, ChevronDown, ChevronRight, Search,
  Download, FileText, ClipboardCheck, Info
} from "lucide-react";
import { PageWrapper } from "../components/PageWrapper";

// ═══════════════════════════════════════════════════════════
// CONSTANTS & TYPES
// ═══════════════════════════════════════════════════════════

const ROLES = [
  "administrator", "lppm", "dosen", "reviewer", "reviewer-hibah",
  "finance", "kordinator-publikasi", "kordinator-riset", "ketua-lppm",
  "halaman-admin", "halaman-dosen", "halaman-umum", "hrd", "terdaftar",
] as const;

type RoleKey = (typeof ROLES)[number];

const ROLE_SHORT: Record<RoleKey, string> = {
  administrator: "Admin",
  lppm: "LPPM",
  dosen: "Dosen",
  reviewer: "Reviewer",
  "reviewer-hibah": "Rev.Hibah",
  finance: "Finance",
  "kordinator-publikasi": "Krd.Pub",
  "kordinator-riset": "Krd.Riset",
  "ketua-lppm": "Ketua",
  "halaman-admin": "H.Admin",
  "halaman-dosen": "H.Dosen",
  "halaman-umum": "H.Umum",
  hrd: "HRD",
  terdaftar: "Terdaftar",
};

type YN = "Y" | "N";
type AccessType = "Full" | "Read-Only" | "No-Access";
type AllowDeny = "Allow" | "Deny";

type TabKey = "A" | "B" | "C" | "D" | "E" | "F" | "summary";

const TAB_CONFIG: { key: TabKey; label: string; icon: typeof LayoutGrid }[] = [
  { key: "A", label: "Menu Visibility", icon: LayoutGrid },
  { key: "B", label: "Page Access", icon: Eye },
  { key: "C", label: "Action Permission", icon: Shield },
  { key: "D", label: "Status Transition", icon: ArrowRightLeft },
  { key: "E", label: "Sidebar Render", icon: SidebarIcon },
  { key: "F", label: "Error/Edge-Case", icon: AlertTriangle },
  { key: "summary", label: "Ringkasan & UAT", icon: ClipboardCheck },
];

// ═══════════════════════════════════════════════════════════
// TABEL A: MENU VISIBILITY MATRIX
// ═══════════════════════════════════════════════════════════

interface MenuRow {
  code: string;
  name: string;
  desc: string;
  access: Record<RoleKey, YN>;
}

const MENU_DATA: MenuRow[] = [
  { code: "M01", name: "Dashboard", desc: "Halaman utama setelah login", access: { administrator: "Y", lppm: "Y", dosen: "Y", reviewer: "Y", "reviewer-hibah": "Y", finance: "Y", "kordinator-publikasi": "Y", "kordinator-riset": "Y", "ketua-lppm": "Y", "halaman-admin": "Y", "halaman-dosen": "Y", "halaman-umum": "N", hrd: "Y", terdaftar: "Y" } },
  { code: "M02", name: "User Management", desc: "CRUD data user sistem", access: { administrator: "Y", lppm: "N", dosen: "N", reviewer: "N", "reviewer-hibah": "N", finance: "N", "kordinator-publikasi": "N", "kordinator-riset": "N", "ketua-lppm": "N", "halaman-admin": "Y", "halaman-dosen": "N", "halaman-umum": "N", hrd: "Y", terdaftar: "N" } },
  { code: "M03", name: "Roles", desc: "Kelola daftar role", access: { administrator: "Y", lppm: "N", dosen: "N", reviewer: "N", "reviewer-hibah": "N", finance: "N", "kordinator-publikasi": "N", "kordinator-riset": "N", "ketua-lppm": "N", "halaman-admin": "Y", "halaman-dosen": "N", "halaman-umum": "N", hrd: "N", terdaftar: "N" } },
  { code: "M04", name: "Permissions", desc: "Kelola daftar permission", access: { administrator: "Y", lppm: "N", dosen: "N", reviewer: "N", "reviewer-hibah": "N", finance: "N", "kordinator-publikasi": "N", "kordinator-riset": "N", "ketua-lppm": "N", "halaman-admin": "Y", "halaman-dosen": "N", "halaman-umum": "N", hrd: "N", terdaftar: "N" } },
  { code: "M05", name: "Role-Permission Matrix", desc: "Pemetaan role ke permission", access: { administrator: "Y", lppm: "N", dosen: "N", reviewer: "N", "reviewer-hibah": "N", finance: "N", "kordinator-publikasi": "N", "kordinator-riset": "N", "ketua-lppm": "Y", "halaman-admin": "Y", "halaman-dosen": "N", "halaman-umum": "N", hrd: "N", terdaftar: "N" } },
  { code: "M06", name: "Fakultas", desc: "Master data fakultas", access: { administrator: "Y", lppm: "Y", dosen: "N", reviewer: "N", "reviewer-hibah": "N", finance: "N", "kordinator-publikasi": "N", "kordinator-riset": "N", "ketua-lppm": "Y", "halaman-admin": "Y", "halaman-dosen": "N", "halaman-umum": "N", hrd: "N", terdaftar: "N" } },
  { code: "M07", name: "Program Studi", desc: "Master data prodi", access: { administrator: "Y", lppm: "Y", dosen: "N", reviewer: "N", "reviewer-hibah": "N", finance: "N", "kordinator-publikasi": "N", "kordinator-riset": "N", "ketua-lppm": "Y", "halaman-admin": "Y", "halaman-dosen": "N", "halaman-umum": "N", hrd: "N", terdaftar: "N" } },
  { code: "M08", name: "Pejabat Pradita", desc: "Master data pejabat", access: { administrator: "Y", lppm: "Y", dosen: "N", reviewer: "N", "reviewer-hibah": "N", finance: "N", "kordinator-publikasi": "N", "kordinator-riset": "N", "ketua-lppm": "Y", "halaman-admin": "Y", "halaman-dosen": "N", "halaman-umum": "N", hrd: "Y", terdaftar: "N" } },
  { code: "M09", name: "Group Reference", desc: "Referensi grup data", access: { administrator: "Y", lppm: "Y", dosen: "N", reviewer: "N", "reviewer-hibah": "N", finance: "N", "kordinator-publikasi": "N", "kordinator-riset": "N", "ketua-lppm": "N", "halaman-admin": "Y", "halaman-dosen": "N", "halaman-umum": "N", hrd: "N", terdaftar: "N" } },
  { code: "M10", name: "Nilai Reference", desc: "Referensi nilai data", access: { administrator: "Y", lppm: "Y", dosen: "N", reviewer: "N", "reviewer-hibah": "N", finance: "N", "kordinator-publikasi": "N", "kordinator-riset": "N", "ketua-lppm": "N", "halaman-admin": "Y", "halaman-dosen": "N", "halaman-umum": "N", hrd: "N", terdaftar: "N" } },
  { code: "M11", name: "Settings", desc: "Konfigurasi sistem global", access: { administrator: "Y", lppm: "N", dosen: "N", reviewer: "N", "reviewer-hibah": "N", finance: "N", "kordinator-publikasi": "N", "kordinator-riset": "N", "ketua-lppm": "N", "halaman-admin": "Y", "halaman-dosen": "N", "halaman-umum": "N", hrd: "N", terdaftar: "N" } },
  { code: "M12", name: "Hibah Internal", desc: "Pengajuan hibah penelitian", access: { administrator: "Y", lppm: "Y", dosen: "Y", reviewer: "Y", "reviewer-hibah": "Y", finance: "Y", "kordinator-publikasi": "N", "kordinator-riset": "Y", "ketua-lppm": "Y", "halaman-admin": "Y", "halaman-dosen": "Y", "halaman-umum": "N", hrd: "N", terdaftar: "N" } },
  { code: "M13", name: "Surat Tugas", desc: "Pengajuan surat tugas", access: { administrator: "Y", lppm: "Y", dosen: "Y", reviewer: "N", "reviewer-hibah": "N", finance: "Y", "kordinator-publikasi": "N", "kordinator-riset": "Y", "ketua-lppm": "Y", "halaman-admin": "Y", "halaman-dosen": "Y", "halaman-umum": "N", hrd: "Y", terdaftar: "N" } },
  { code: "M14", name: "Konferensi", desc: "Pengajuan konferensi", access: { administrator: "Y", lppm: "Y", dosen: "Y", reviewer: "N", "reviewer-hibah": "N", finance: "Y", "kordinator-publikasi": "N", "kordinator-riset": "Y", "ketua-lppm": "Y", "halaman-admin": "Y", "halaman-dosen": "Y", "halaman-umum": "N", hrd: "N", terdaftar: "N" } },
  { code: "M15", name: "Publikasi", desc: "Pengajuan publikasi ilmiah", access: { administrator: "Y", lppm: "Y", dosen: "Y", reviewer: "N", "reviewer-hibah": "N", finance: "N", "kordinator-publikasi": "Y", "kordinator-riset": "N", "ketua-lppm": "Y", "halaman-admin": "Y", "halaman-dosen": "Y", "halaman-umum": "N", hrd: "N", terdaftar: "N" } },
  { code: "M16", name: "Laporan Kegiatan", desc: "Rekap kegiatan per periode", access: { administrator: "Y", lppm: "Y", dosen: "N", reviewer: "N", "reviewer-hibah": "N", finance: "Y", "kordinator-publikasi": "N", "kordinator-riset": "Y", "ketua-lppm": "Y", "halaman-admin": "Y", "halaman-dosen": "N", "halaman-umum": "N", hrd: "N", terdaftar: "N" } },
  { code: "M17", name: "Laporan Publikasi", desc: "Rekap publikasi per kategori", access: { administrator: "Y", lppm: "Y", dosen: "N", reviewer: "N", "reviewer-hibah": "N", finance: "N", "kordinator-publikasi": "Y", "kordinator-riset": "N", "ketua-lppm": "Y", "halaman-admin": "Y", "halaman-dosen": "N", "halaman-umum": "N", hrd: "N", terdaftar: "N" } },
  { code: "M18", name: "Export Data", desc: "Unduh data dalam berbagai format", access: { administrator: "Y", lppm: "Y", dosen: "N", reviewer: "N", "reviewer-hibah": "N", finance: "Y", "kordinator-publikasi": "Y", "kordinator-riset": "Y", "ketua-lppm": "Y", "halaman-admin": "Y", "halaman-dosen": "N", "halaman-umum": "N", hrd: "N", terdaftar: "N" } },
  { code: "M19", name: "Notification Center", desc: "Pusat notifikasi sistem", access: { administrator: "Y", lppm: "Y", dosen: "Y", reviewer: "Y", "reviewer-hibah": "Y", finance: "Y", "kordinator-publikasi": "Y", "kordinator-riset": "Y", "ketua-lppm": "Y", "halaman-admin": "Y", "halaman-dosen": "Y", "halaman-umum": "N", hrd: "Y", terdaftar: "Y" } },
  { code: "M20", name: "Profile Saya", desc: "Edit data profil pribadi", access: { administrator: "Y", lppm: "Y", dosen: "Y", reviewer: "Y", "reviewer-hibah": "Y", finance: "Y", "kordinator-publikasi": "Y", "kordinator-riset": "Y", "ketua-lppm": "Y", "halaman-admin": "Y", "halaman-dosen": "Y", "halaman-umum": "Y", hrd: "Y", terdaftar: "Y" } },
  { code: "M21", name: "Audit Log", desc: "Jejak aktivitas sistem", access: { administrator: "Y", lppm: "N", dosen: "N", reviewer: "N", "reviewer-hibah": "N", finance: "N", "kordinator-publikasi": "N", "kordinator-riset": "N", "ketua-lppm": "Y", "halaman-admin": "Y", "halaman-dosen": "N", "halaman-umum": "N", hrd: "N", terdaftar: "N" } },
];

// ═══════════════════════════════════════════════════════════
// TABEL B: PAGE ACCESS MATRIX
// ═══════════════════════════════════════════════════════════

interface PageRow {
  code: string;
  name: string;
  parent: string;
  access: Record<RoleKey, AccessType>;
}

const PAGE_DATA: PageRow[] = [
  { code: "P01", name: "Dashboard Overview", parent: "M01", access: { administrator: "Full", lppm: "Full", dosen: "Full", reviewer: "Full", "reviewer-hibah": "Full", finance: "Full", "kordinator-publikasi": "Full", "kordinator-riset": "Full", "ketua-lppm": "Full", "halaman-admin": "Full", "halaman-dosen": "Full", "halaman-umum": "No-Access", hrd: "Full", terdaftar: "Read-Only" } },
  { code: "P02", name: "User List", parent: "M02", access: { administrator: "Full", lppm: "No-Access", dosen: "No-Access", reviewer: "No-Access", "reviewer-hibah": "No-Access", finance: "No-Access", "kordinator-publikasi": "No-Access", "kordinator-riset": "No-Access", "ketua-lppm": "No-Access", "halaman-admin": "Full", "halaman-dosen": "No-Access", "halaman-umum": "No-Access", hrd: "Read-Only", terdaftar: "No-Access" } },
  { code: "P03", name: "User Detail", parent: "M02", access: { administrator: "Full", lppm: "No-Access", dosen: "No-Access", reviewer: "No-Access", "reviewer-hibah": "No-Access", finance: "No-Access", "kordinator-publikasi": "No-Access", "kordinator-riset": "No-Access", "ketua-lppm": "No-Access", "halaman-admin": "Full", "halaman-dosen": "No-Access", "halaman-umum": "No-Access", hrd: "Read-Only", terdaftar: "No-Access" } },
  { code: "P04", name: "User Edit Role", parent: "M02", access: { administrator: "Full", lppm: "No-Access", dosen: "No-Access", reviewer: "No-Access", "reviewer-hibah": "No-Access", finance: "No-Access", "kordinator-publikasi": "No-Access", "kordinator-riset": "No-Access", "ketua-lppm": "No-Access", "halaman-admin": "Full", "halaman-dosen": "No-Access", "halaman-umum": "No-Access", hrd: "No-Access", terdaftar: "No-Access" } },
  { code: "P05", name: "Hibah List", parent: "M12", access: { administrator: "Full", lppm: "Full", dosen: "Full", reviewer: "Read-Only", "reviewer-hibah": "Read-Only", finance: "Read-Only", "kordinator-publikasi": "No-Access", "kordinator-riset": "Full", "ketua-lppm": "Full", "halaman-admin": "Full", "halaman-dosen": "Full", "halaman-umum": "No-Access", hrd: "No-Access", terdaftar: "No-Access" } },
  { code: "P06", name: "Hibah Create", parent: "M12", access: { administrator: "Full", lppm: "Full", dosen: "Full", reviewer: "No-Access", "reviewer-hibah": "No-Access", finance: "No-Access", "kordinator-publikasi": "No-Access", "kordinator-riset": "Full", "ketua-lppm": "No-Access", "halaman-admin": "Full", "halaman-dosen": "Full", "halaman-umum": "No-Access", hrd: "No-Access", terdaftar: "No-Access" } },
  { code: "P07", name: "Hibah Detail", parent: "M12", access: { administrator: "Full", lppm: "Full", dosen: "Full", reviewer: "Read-Only", "reviewer-hibah": "Read-Only", finance: "Read-Only", "kordinator-publikasi": "No-Access", "kordinator-riset": "Full", "ketua-lppm": "Full", "halaman-admin": "Full", "halaman-dosen": "Full", "halaman-umum": "No-Access", hrd: "No-Access", terdaftar: "No-Access" } },
  { code: "P08", name: "Hibah Review", parent: "M12", access: { administrator: "Full", lppm: "No-Access", dosen: "No-Access", reviewer: "Full", "reviewer-hibah": "Full", finance: "No-Access", "kordinator-publikasi": "No-Access", "kordinator-riset": "No-Access", "ketua-lppm": "Full", "halaman-admin": "Full", "halaman-dosen": "No-Access", "halaman-umum": "No-Access", hrd: "No-Access", terdaftar: "No-Access" } },
  { code: "P09", name: "Hibah History", parent: "M12", access: { administrator: "Full", lppm: "Full", dosen: "Read-Only", reviewer: "Read-Only", "reviewer-hibah": "Read-Only", finance: "Read-Only", "kordinator-publikasi": "No-Access", "kordinator-riset": "Read-Only", "ketua-lppm": "Full", "halaman-admin": "Full", "halaman-dosen": "Read-Only", "halaman-umum": "No-Access", hrd: "No-Access", terdaftar: "No-Access" } },
  { code: "P10", name: "Surat Tugas List", parent: "M13", access: { administrator: "Full", lppm: "Full", dosen: "Full", reviewer: "No-Access", "reviewer-hibah": "No-Access", finance: "Read-Only", "kordinator-publikasi": "No-Access", "kordinator-riset": "Read-Only", "ketua-lppm": "Full", "halaman-admin": "Full", "halaman-dosen": "Full", "halaman-umum": "No-Access", hrd: "Read-Only", terdaftar: "No-Access" } },
  { code: "P11", name: "Surat Tugas Detail", parent: "M13", access: { administrator: "Full", lppm: "Full", dosen: "Full", reviewer: "No-Access", "reviewer-hibah": "No-Access", finance: "Read-Only", "kordinator-publikasi": "No-Access", "kordinator-riset": "Read-Only", "ketua-lppm": "Full", "halaman-admin": "Full", "halaman-dosen": "Full", "halaman-umum": "No-Access", hrd: "Read-Only", terdaftar: "No-Access" } },
  { code: "P12", name: "Surat Tugas Create", parent: "M13", access: { administrator: "Full", lppm: "Full", dosen: "Full", reviewer: "No-Access", "reviewer-hibah": "No-Access", finance: "No-Access", "kordinator-publikasi": "No-Access", "kordinator-riset": "No-Access", "ketua-lppm": "No-Access", "halaman-admin": "Full", "halaman-dosen": "Full", "halaman-umum": "No-Access", hrd: "No-Access", terdaftar: "No-Access" } },
  { code: "P13", name: "Konferensi List", parent: "M14", access: { administrator: "Full", lppm: "Full", dosen: "Full", reviewer: "No-Access", "reviewer-hibah": "No-Access", finance: "Read-Only", "kordinator-publikasi": "No-Access", "kordinator-riset": "Full", "ketua-lppm": "Full", "halaman-admin": "Full", "halaman-dosen": "Full", "halaman-umum": "No-Access", hrd: "No-Access", terdaftar: "No-Access" } },
  { code: "P14", name: "Konferensi Detail + Review", parent: "M14", access: { administrator: "Full", lppm: "Full", dosen: "Read-Only", reviewer: "No-Access", "reviewer-hibah": "No-Access", finance: "Read-Only", "kordinator-publikasi": "No-Access", "kordinator-riset": "Full", "ketua-lppm": "Full", "halaman-admin": "Full", "halaman-dosen": "Read-Only", "halaman-umum": "No-Access", hrd: "No-Access", terdaftar: "No-Access" } },
  { code: "P15", name: "Publikasi List", parent: "M15", access: { administrator: "Full", lppm: "Full", dosen: "Full", reviewer: "No-Access", "reviewer-hibah": "No-Access", finance: "No-Access", "kordinator-publikasi": "Full", "kordinator-riset": "No-Access", "ketua-lppm": "Full", "halaman-admin": "Full", "halaman-dosen": "Full", "halaman-umum": "No-Access", hrd: "No-Access", terdaftar: "No-Access" } },
  { code: "P16", name: "Publikasi Detail + Review", parent: "M15", access: { administrator: "Full", lppm: "Full", dosen: "Read-Only", reviewer: "No-Access", "reviewer-hibah": "No-Access", finance: "No-Access", "kordinator-publikasi": "Full", "kordinator-riset": "No-Access", "ketua-lppm": "Full", "halaman-admin": "Full", "halaman-dosen": "Read-Only", "halaman-umum": "No-Access", hrd: "No-Access", terdaftar: "No-Access" } },
  { code: "P17", name: "Laporan Kegiatan", parent: "M16", access: { administrator: "Full", lppm: "Full", dosen: "No-Access", reviewer: "No-Access", "reviewer-hibah": "No-Access", finance: "Read-Only", "kordinator-publikasi": "No-Access", "kordinator-riset": "Read-Only", "ketua-lppm": "Full", "halaman-admin": "Full", "halaman-dosen": "No-Access", "halaman-umum": "No-Access", hrd: "No-Access", terdaftar: "No-Access" } },
  { code: "P18", name: "Laporan Publikasi", parent: "M17", access: { administrator: "Full", lppm: "Full", dosen: "No-Access", reviewer: "No-Access", "reviewer-hibah": "No-Access", finance: "No-Access", "kordinator-publikasi": "Full", "kordinator-riset": "No-Access", "ketua-lppm": "Full", "halaman-admin": "Full", "halaman-dosen": "No-Access", "halaman-umum": "No-Access", hrd: "No-Access", terdaftar: "No-Access" } },
  { code: "P19", name: "Export Data", parent: "M18", access: { administrator: "Full", lppm: "Full", dosen: "No-Access", reviewer: "No-Access", "reviewer-hibah": "No-Access", finance: "Full", "kordinator-publikasi": "Full", "kordinator-riset": "Full", "ketua-lppm": "Full", "halaman-admin": "Full", "halaman-dosen": "No-Access", "halaman-umum": "No-Access", hrd: "No-Access", terdaftar: "No-Access" } },
  { code: "P20", name: "Profile Saya", parent: "M20", access: { administrator: "Full", lppm: "Full", dosen: "Full", reviewer: "Full", "reviewer-hibah": "Full", finance: "Full", "kordinator-publikasi": "Full", "kordinator-riset": "Full", "ketua-lppm": "Full", "halaman-admin": "Full", "halaman-dosen": "Full", "halaman-umum": "Full", hrd: "Full", terdaftar: "Full" } },
  { code: "P21", name: "Settings", parent: "M11", access: { administrator: "Full", lppm: "No-Access", dosen: "No-Access", reviewer: "No-Access", "reviewer-hibah": "No-Access", finance: "No-Access", "kordinator-publikasi": "No-Access", "kordinator-riset": "No-Access", "ketua-lppm": "No-Access", "halaman-admin": "Full", "halaman-dosen": "No-Access", "halaman-umum": "No-Access", hrd: "No-Access", terdaftar: "No-Access" } },
  { code: "P22", name: "Audit Log", parent: "M21", access: { administrator: "Full", lppm: "No-Access", dosen: "No-Access", reviewer: "No-Access", "reviewer-hibah": "No-Access", finance: "No-Access", "kordinator-publikasi": "No-Access", "kordinator-riset": "No-Access", "ketua-lppm": "Read-Only", "halaman-admin": "Full", "halaman-dosen": "No-Access", "halaman-umum": "No-Access", hrd: "No-Access", terdaftar: "No-Access" } },
  { code: "P23", name: "Error 401", parent: "—", access: { administrator: "Full", lppm: "Full", dosen: "Full", reviewer: "Full", "reviewer-hibah": "Full", finance: "Full", "kordinator-publikasi": "Full", "kordinator-riset": "Full", "ketua-lppm": "Full", "halaman-admin": "Full", "halaman-dosen": "Full", "halaman-umum": "Full", hrd: "Full", terdaftar: "Full" } },
  { code: "P24", name: "Error 403", parent: "—", access: { administrator: "Full", lppm: "Full", dosen: "Full", reviewer: "Full", "reviewer-hibah": "Full", finance: "Full", "kordinator-publikasi": "Full", "kordinator-riset": "Full", "ketua-lppm": "Full", "halaman-admin": "Full", "halaman-dosen": "Full", "halaman-umum": "Full", hrd: "Full", terdaftar: "Full" } },
  { code: "P25", name: "Error 404", parent: "—", access: { administrator: "Full", lppm: "Full", dosen: "Full", reviewer: "Full", "reviewer-hibah": "Full", finance: "Full", "kordinator-publikasi": "Full", "kordinator-riset": "Full", "ketua-lppm": "Full", "halaman-admin": "Full", "halaman-dosen": "Full", "halaman-umum": "Full", hrd: "Full", terdaftar: "Full" } },
  { code: "P26", name: "Error 419", parent: "—", access: { administrator: "Full", lppm: "Full", dosen: "Full", reviewer: "Full", "reviewer-hibah": "Full", finance: "Full", "kordinator-publikasi": "Full", "kordinator-riset": "Full", "ketua-lppm": "Full", "halaman-admin": "Full", "halaman-dosen": "Full", "halaman-umum": "Full", hrd: "Full", terdaftar: "Full" } },
  { code: "P27", name: "Error 500", parent: "—", access: { administrator: "Full", lppm: "Full", dosen: "Full", reviewer: "Full", "reviewer-hibah": "Full", finance: "Full", "kordinator-publikasi": "Full", "kordinator-riset": "Full", "ketua-lppm": "Full", "halaman-admin": "Full", "halaman-dosen": "Full", "halaman-umum": "Full", hrd: "Full", terdaftar: "Full" } },
];

// ═══════════════════════════════════════════════════════════
// TABEL C: ACTION PERMISSION MATRIX
// ═══════════════════════════════════════════════════════════

interface ActionRow {
  code: string;
  name: string;
  module: string;
  fromStatus: string;
  toStatus: string;
  access: Record<RoleKey, AllowDeny>;
}

const ACTION_DATA: ActionRow[] = [
  { code: "A01", name: "Create Draft", module: "Hibah/ST/Knf/Pub", fromStatus: "—", toStatus: "Draft", access: { administrator: "Allow", lppm: "Allow", dosen: "Allow", reviewer: "Deny", "reviewer-hibah": "Deny", finance: "Deny", "kordinator-publikasi": "Allow", "kordinator-riset": "Allow", "ketua-lppm": "Deny", "halaman-admin": "Allow", "halaman-dosen": "Allow", "halaman-umum": "Deny", hrd: "Deny", terdaftar: "Deny" } },
  { code: "A02", name: "Edit Draft", module: "Hibah/ST/Knf/Pub", fromStatus: "Draft", toStatus: "Draft", access: { administrator: "Allow", lppm: "Allow", dosen: "Allow", reviewer: "Deny", "reviewer-hibah": "Deny", finance: "Deny", "kordinator-publikasi": "Allow", "kordinator-riset": "Allow", "ketua-lppm": "Deny", "halaman-admin": "Allow", "halaman-dosen": "Allow", "halaman-umum": "Deny", hrd: "Deny", terdaftar: "Deny" } },
  { code: "A03", name: "Submit", module: "Hibah/ST/Knf/Pub", fromStatus: "Draft", toStatus: "Submitted", access: { administrator: "Allow", lppm: "Allow", dosen: "Allow", reviewer: "Deny", "reviewer-hibah": "Deny", finance: "Deny", "kordinator-publikasi": "Allow", "kordinator-riset": "Allow", "ketua-lppm": "Deny", "halaman-admin": "Allow", "halaman-dosen": "Allow", "halaman-umum": "Deny", hrd: "Deny", terdaftar: "Deny" } },
  { code: "A04", name: "Request Revision", module: "Hibah/Knf/Pub", fromStatus: "Submitted/P.Review", toStatus: "Revisi", access: { administrator: "Allow", lppm: "Allow", dosen: "Deny", reviewer: "Allow", "reviewer-hibah": "Allow", finance: "Deny", "kordinator-publikasi": "Allow", "kordinator-riset": "Allow", "ketua-lppm": "Allow", "halaman-admin": "Allow", "halaman-dosen": "Deny", "halaman-umum": "Deny", hrd: "Deny", terdaftar: "Deny" } },
  { code: "A05", name: "Submit Revision", module: "Hibah/ST/Knf/Pub", fromStatus: "Revisi", toStatus: "Submit Revisi", access: { administrator: "Allow", lppm: "Allow", dosen: "Allow", reviewer: "Deny", "reviewer-hibah": "Deny", finance: "Deny", "kordinator-publikasi": "Allow", "kordinator-riset": "Allow", "ketua-lppm": "Deny", "halaman-admin": "Allow", "halaman-dosen": "Allow", "halaman-umum": "Deny", hrd: "Deny", terdaftar: "Deny" } },
  { code: "A06", name: "Approve", module: "Hibah/ST/Knf/Pub", fromStatus: "Submitted/S.Revisi", toStatus: "Approved", access: { administrator: "Allow", lppm: "Allow", dosen: "Deny", reviewer: "Allow", "reviewer-hibah": "Allow", finance: "Deny", "kordinator-publikasi": "Allow", "kordinator-riset": "Allow", "ketua-lppm": "Allow", "halaman-admin": "Allow", "halaman-dosen": "Deny", "halaman-umum": "Deny", hrd: "Deny", terdaftar: "Deny" } },
  { code: "A07", name: "Reject", module: "Hibah/Knf/Pub", fromStatus: "Submitted/S.Revisi", toStatus: "Ditolak", access: { administrator: "Allow", lppm: "Allow", dosen: "Deny", reviewer: "Allow", "reviewer-hibah": "Allow", finance: "Deny", "kordinator-publikasi": "Allow", "kordinator-riset": "Allow", "ketua-lppm": "Allow", "halaman-admin": "Allow", "halaman-dosen": "Deny", "halaman-umum": "Deny", hrd: "Deny", terdaftar: "Deny" } },
  { code: "A08", name: "Verify Finance", module: "Hibah/ST/Knf", fromStatus: "Approved", toStatus: "Verified", access: { administrator: "Allow", lppm: "Deny", dosen: "Deny", reviewer: "Deny", "reviewer-hibah": "Deny", finance: "Allow", "kordinator-publikasi": "Deny", "kordinator-riset": "Deny", "ketua-lppm": "Deny", "halaman-admin": "Allow", "halaman-dosen": "Deny", "halaman-umum": "Deny", hrd: "Deny", terdaftar: "Deny" } },
  { code: "A09", name: "Mark Hutang", module: "Surat Tugas", fromStatus: "Approved", toStatus: "Hutang", access: { administrator: "Allow", lppm: "Deny", dosen: "Deny", reviewer: "Deny", "reviewer-hibah": "Deny", finance: "Allow", "kordinator-publikasi": "Deny", "kordinator-riset": "Deny", "ketua-lppm": "Deny", "halaman-admin": "Allow", "halaman-dosen": "Deny", "halaman-umum": "Deny", hrd: "Deny", terdaftar: "Deny" } },
  { code: "A10", name: "Mark Lunas", module: "Hibah/ST", fromStatus: "Verified/Hutang", toStatus: "Lunas", access: { administrator: "Allow", lppm: "Deny", dosen: "Deny", reviewer: "Deny", "reviewer-hibah": "Deny", finance: "Allow", "kordinator-publikasi": "Deny", "kordinator-riset": "Deny", "ketua-lppm": "Deny", "halaman-admin": "Allow", "halaman-dosen": "Deny", "halaman-umum": "Deny", hrd: "Deny", terdaftar: "Deny" } },
  { code: "A11", name: "Delete", module: "Hibah/ST/Knf/Pub", fromStatus: "Draft", toStatus: "Deleted", access: { administrator: "Allow", lppm: "Allow", dosen: "Allow", reviewer: "Deny", "reviewer-hibah": "Deny", finance: "Deny", "kordinator-publikasi": "Deny", "kordinator-riset": "Deny", "ketua-lppm": "Deny", "halaman-admin": "Allow", "halaman-dosen": "Allow", "halaman-umum": "Deny", hrd: "Deny", terdaftar: "Deny" } },
  { code: "A12", name: "Export", module: "All Reports", fromStatus: "—", toStatus: "—", access: { administrator: "Allow", lppm: "Allow", dosen: "Deny", reviewer: "Deny", "reviewer-hibah": "Deny", finance: "Allow", "kordinator-publikasi": "Allow", "kordinator-riset": "Allow", "ketua-lppm": "Allow", "halaman-admin": "Allow", "halaman-dosen": "Deny", "halaman-umum": "Deny", hrd: "Deny", terdaftar: "Deny" } },
  { code: "A13", name: "Assign Reviewer", module: "Hibah", fromStatus: "Submitted", toStatus: "Pending Review", access: { administrator: "Allow", lppm: "Allow", dosen: "Deny", reviewer: "Deny", "reviewer-hibah": "Deny", finance: "Deny", "kordinator-publikasi": "Deny", "kordinator-riset": "Allow", "ketua-lppm": "Allow", "halaman-admin": "Allow", "halaman-dosen": "Deny", "halaman-umum": "Deny", hrd: "Deny", terdaftar: "Deny" } },
  { code: "A14", name: "Assign Role", module: "User Mgmt", fromStatus: "—", toStatus: "—", access: { administrator: "Allow", lppm: "Deny", dosen: "Deny", reviewer: "Deny", "reviewer-hibah": "Deny", finance: "Deny", "kordinator-publikasi": "Deny", "kordinator-riset": "Deny", "ketua-lppm": "Deny", "halaman-admin": "Allow", "halaman-dosen": "Deny", "halaman-umum": "Deny", hrd: "Deny", terdaftar: "Deny" } },
  { code: "A15", name: "Update Settings", module: "Settings", fromStatus: "—", toStatus: "—", access: { administrator: "Allow", lppm: "Deny", dosen: "Deny", reviewer: "Deny", "reviewer-hibah": "Deny", finance: "Deny", "kordinator-publikasi": "Deny", "kordinator-riset": "Deny", "ketua-lppm": "Deny", "halaman-admin": "Allow", "halaman-dosen": "Deny", "halaman-umum": "Deny", hrd: "Deny", terdaftar: "Deny" } },
  { code: "A16", name: "Read Audit Log", module: "Audit Log", fromStatus: "—", toStatus: "—", access: { administrator: "Allow", lppm: "Deny", dosen: "Deny", reviewer: "Deny", "reviewer-hibah": "Deny", finance: "Deny", "kordinator-publikasi": "Deny", "kordinator-riset": "Deny", "ketua-lppm": "Allow", "halaman-admin": "Allow", "halaman-dosen": "Deny", "halaman-umum": "Deny", hrd: "Deny", terdaftar: "Deny" } },
];

// ═══════════════════════════════════════════════════════════
// TABEL D: STATUS TRANSITION MATRIX
// ═══════════════════════════════════════════════════════════

interface TransitionRow {
  module: string;
  from: string;
  to: string;
  allowedRole: string;
  mandatoryInput: string;
  notifTo: string;
  uxNote: string;
  allowed: boolean;
}

const TRANSITION_DATA: TransitionRow[] = [
  { module: "Hibah", from: "Draft", to: "Submitted", allowedRole: "Dosen, LPPM, Krd.Riset", mandatoryInput: "Judul, Skema, Dana, Dokumen proposal", notifTo: "Reviewer, LPPM", uxNote: "Tombol Submit aktif hanya jika semua field wajib terisi", allowed: true },
  { module: "Hibah", from: "Submitted", to: "Pending Review", allowedRole: "LPPM, Krd.Riset, Ketua LPPM", mandatoryInput: "Pilih reviewer", notifTo: "Reviewer yang ditunjuk", uxNote: "Auto-transition jika reviewer sudah di-assign", allowed: true },
  { module: "Hibah", from: "Pending Review", to: "Revisi", allowedRole: "Reviewer, Rev.Hibah, Ketua LPPM", mandatoryInput: "Catatan revisi (wajib)", notifTo: "Pengusul (Dosen)", uxNote: "Catatan revisi muncul di panel detail", allowed: true },
  { module: "Hibah", from: "Revisi", to: "Submit Revisi", allowedRole: "Dosen, LPPM, Krd.Riset", mandatoryInput: "Dokumen revisi terupdate", notifTo: "Reviewer sebelumnya", uxNote: "Tombol berubah dari Submit ke Submit Revisi", allowed: true },
  { module: "Hibah", from: "Submit Revisi", to: "Approved", allowedRole: "Reviewer, Rev.Hibah, Ketua LPPM", mandatoryInput: "—", notifTo: "Pengusul, Finance", uxNote: "Stepper maju ke langkah Approve", allowed: true },
  { module: "Hibah", from: "Submitted", to: "Approved", allowedRole: "Reviewer, Rev.Hibah, Ketua LPPM", mandatoryInput: "—", notifTo: "Pengusul, Finance", uxNote: "Shortcut approve tanpa revisi", allowed: true },
  { module: "Hibah", from: "Submitted", to: "Ditolak", allowedRole: "Reviewer, Rev.Hibah, Ketua LPPM", mandatoryInput: "Alasan tolak (wajib)", notifTo: "Pengusul", uxNote: "Konfirmasi modal warna merah, final state", allowed: true },
  { module: "Hibah", from: "Approved", to: "Verified", allowedRole: "Finance, Admin", mandatoryInput: "—", notifTo: "Pengusul, LPPM", uxNote: "Finance badge muncul di detail", allowed: true },
  { module: "Hibah", from: "Verified", to: "Lunas", allowedRole: "Finance, Admin", mandatoryInput: "Bukti transfer/pembayaran", notifTo: "Pengusul, LPPM", uxNote: "Status final, badge hijau", allowed: true },
  { module: "Hibah", from: "Draft", to: "Approved", allowedRole: "—", mandatoryInput: "—", notifTo: "—", uxNote: "NOT ALLOWED — harus lewat Submit dulu", allowed: false },
  { module: "Hibah", from: "Ditolak", to: "Approved", allowedRole: "—", mandatoryInput: "—", notifTo: "—", uxNote: "NOT ALLOWED — Ditolak adalah final state", allowed: false },
  { module: "Hibah", from: "Lunas", to: "Revisi", allowedRole: "—", mandatoryInput: "—", notifTo: "—", uxNote: "NOT ALLOWED — Lunas adalah final state", allowed: false },
  { module: "Surat Tugas", from: "Draft", to: "Submitted", allowedRole: "Dosen, LPPM", mandatoryInput: "Kegiatan, Jenis, Biaya, Periode", notifTo: "Ketua LPPM", uxNote: "Periode harus aktif, jika tidak ada redirect ke pemilih", allowed: true },
  { module: "Surat Tugas", from: "Submitted", to: "Approved", allowedRole: "Ketua LPPM, Admin", mandatoryInput: "—", notifTo: "Dosen, Finance", uxNote: "Stepper maju ke Approve", allowed: true },
  { module: "Surat Tugas", from: "Submitted", to: "Revisi", allowedRole: "Ketua LPPM, LPPM", mandatoryInput: "Catatan revisi", notifTo: "Dosen pengaju", uxNote: "Catatan wajib diisi", allowed: true },
  { module: "Surat Tugas", from: "Approved", to: "Hutang", allowedRole: "Finance, Admin", mandatoryInput: "—", notifTo: "LPPM, Dosen", uxNote: "Status keuangan berubah, badge amber", allowed: true },
  { module: "Surat Tugas", from: "Hutang", to: "Lunas", allowedRole: "Finance, Admin", mandatoryInput: "Bukti pembayaran", notifTo: "LPPM, Dosen", uxNote: "Konfirmasi modal, status final hijau", allowed: true },
  { module: "Surat Tugas", from: "Lunas", to: "Draft", allowedRole: "—", mandatoryInput: "—", notifTo: "—", uxNote: "NOT ALLOWED — tidak bisa revert", allowed: false },
  { module: "Konferensi", from: "Draft", to: "Submitted", allowedRole: "Dosen, LPPM, Krd.Riset", mandatoryInput: "Nama konf, Biaya, Lokasi", notifTo: "LPPM, Krd.Riset", uxNote: "Validasi dokumen lampiran", allowed: true },
  { module: "Konferensi", from: "Submitted", to: "Approved", allowedRole: "LPPM, Krd.Riset, Ketua LPPM", mandatoryInput: "—", notifTo: "Finance, Dosen", uxNote: "Stepper maju", allowed: true },
  { module: "Konferensi", from: "Submitted", to: "Revisi", allowedRole: "LPPM, Krd.Riset, Ketua LPPM", mandatoryInput: "Catatan revisi (wajib)", notifTo: "Dosen", uxNote: "Alasan wajib diisi sebelum tombol aktif", allowed: true },
  { module: "Konferensi", from: "Approved", to: "Verified", allowedRole: "Finance, Admin", mandatoryInput: "Validasi biaya", notifTo: "Dosen, LPPM", uxNote: "Finance muncul di blok biaya detail", allowed: true },
  { module: "Konferensi", from: "Submitted", to: "Verified", allowedRole: "—", mandatoryInput: "—", notifTo: "—", uxNote: "NOT ALLOWED — harus Approve dulu", allowed: false },
  { module: "Publikasi", from: "Draft", to: "Submitted", allowedRole: "Dosen, Krd.Publikasi", mandatoryInput: "Judul, Jenis, Jurnal/Prosiding", notifTo: "Krd.Publikasi", uxNote: "Kelengkapan submission ditampilkan", allowed: true },
  { module: "Publikasi", from: "Submitted", to: "Approved", allowedRole: "Krd.Publikasi, Ketua LPPM", mandatoryInput: "—", notifTo: "Dosen", uxNote: "Koordinator memeriksa kelengkapan", allowed: true },
  { module: "Publikasi", from: "Submitted", to: "Revisi", allowedRole: "Krd.Publikasi, Ketua LPPM", mandatoryInput: "Catatan revisi", notifTo: "Dosen", uxNote: "Catatan detail tentang kekurangan", allowed: true },
  { module: "Publikasi", from: "Approved", to: "Verified (Terbit)", allowedRole: "Krd.Publikasi, Admin", mandatoryInput: "Link/DOI publikasi final", notifTo: "Dosen, LPPM", uxNote: "Final state, badge hijau Terbit", allowed: true },
  { module: "Publikasi", from: "Ditolak", to: "Draft", allowedRole: "—", mandatoryInput: "—", notifTo: "—", uxNote: "NOT ALLOWED — harus buat pengajuan baru", allowed: false },
];

// ═══════════════════════════════════════════════════════════
// TABEL E: SIDEBAR RENDER RULE MATRIX
// ═══════════════════════════════════════════════════════════

interface SidebarRule {
  id: string;
  condition: string;
  variant: string;
  shown: string;
  hidden: string;
  defaultExpanded: string;
  fallback: string;
}

const SIDEBAR_RULES: SidebarRule[] = [
  { id: "SR-01", condition: "role = administrator", variant: "Admin Full", shown: "Semua menu (M01-M21)", hidden: "—", defaultExpanded: "Dashboard, Pengajuan", fallback: "—" },
  { id: "SR-02", condition: "role = halaman-admin", variant: "Admin Full", shown: "Sama dengan administrator", hidden: "—", defaultExpanded: "Dashboard, Master Data", fallback: "Jika role tidak cocok, gunakan SR-10" },
  { id: "SR-03", condition: "role = lppm", variant: "Admin Terbatas", shown: "M01, M06-M10, M12-M19, M20", hidden: "M02-M05, M11, M21", defaultExpanded: "Dashboard, Pengajuan", fallback: "—" },
  { id: "SR-04", condition: "role = finance", variant: "Finance", shown: "M01, M12-M14, M16, M18-M20", hidden: "M02-M11, M15, M17, M21", defaultExpanded: "Dashboard, Pengajuan", fallback: "—" },
  { id: "SR-05", condition: "role = reviewer | reviewer-hibah", variant: "Reviewer", shown: "M01, M12, M19, M20", hidden: "M02-M11, M13-M18, M21", defaultExpanded: "Dashboard", fallback: "—" },
  { id: "SR-06", condition: "role = dosen | halaman-dosen", variant: "Dosen", shown: "M01, M12-M15, M19, M20", hidden: "M02-M11, M16-M18, M21", defaultExpanded: "Dashboard, Pengajuan", fallback: "—" },
  { id: "SR-07", condition: "role = kordinator-publikasi", variant: "Koordinator", shown: "M01, M15, M17-M20", hidden: "M02-M14, M16, M21", defaultExpanded: "Dashboard, Publikasi", fallback: "—" },
  { id: "SR-08", condition: "role = kordinator-riset", variant: "Koordinator", shown: "M01, M12-M14, M16, M18-M20", hidden: "M02-M11, M15, M17, M21", defaultExpanded: "Dashboard, Pengajuan", fallback: "—" },
  { id: "SR-09", condition: "role = ketua-lppm", variant: "Ketua", shown: "M01, M05-M08, M12-M21", hidden: "M02-M04, M09-M11", defaultExpanded: "Dashboard, Pengajuan, Laporan", fallback: "—" },
  { id: "SR-10", condition: "role = hrd", variant: "HRD", shown: "M01, M02 (read), M08, M13, M19, M20", hidden: "M03-M07, M09-M12, M14-M18, M21", defaultExpanded: "Dashboard", fallback: "—" },
  { id: "SR-11", condition: "role = terdaftar", variant: "Minimal", shown: "M01, M19, M20", hidden: "M02-M18, M21", defaultExpanded: "Dashboard", fallback: "Tampilkan banner 'Hubungi admin untuk aktivasi akses'" },
  { id: "SR-12", condition: "role = halaman-umum", variant: "Public Only", shown: "M20 (Profile saja)", hidden: "M01-M19, M21", defaultExpanded: "—", fallback: "Redirect ke /login jika belum login" },
  { id: "SR-13", condition: "Multi-role (contoh: dosen + reviewer)", variant: "Prioritas tertinggi", shown: "Gabungan menu dari semua role", hidden: "Menu yang tidak ada di semua role", defaultExpanded: "Sesuai role prioritas tertinggi", fallback: "Prioritas: admin > h.admin > lppm > finance > reviewer > dosen > h.dosen > terdaftar > h.umum" },
];

// ═══════════════════════════════════════════════════════════
// TABEL F: ERROR/EDGE-CASE ACCESS MATRIX
// ═══════════════════════════════════════════════════════════

interface ErrorScenario {
  scenario: string;
  trigger: string;
  target: string;
  message: string;
  ctaPrimary: string;
  ctaSecondary: string;
  roleImpact: string;
}

const ERROR_SCENARIOS: ErrorScenario[] = [
  { scenario: "401 — Belum Login", trigger: "User mengakses /admin tanpa session", target: "/401", message: "Anda perlu login terlebih dahulu untuk mengakses halaman ini.", ctaPrimary: "Login", ctaSecondary: "Ke Beranda", roleImpact: "Semua — redirect ke login" },
  { scenario: "403 — Tidak Punya Akses", trigger: "User mengakses halaman di luar role-nya", target: "/admin/403", message: "Anda tidak memiliki izin untuk mengakses halaman ini.", ctaPrimary: "Kembali ke Dashboard", ctaSecondary: "Hubungi Admin", roleImpact: "Terdaftar paling sering kena, reviewer akses settings" },
  { scenario: "404 — Data Hilang", trigger: "Route param ID tidak ditemukan di database", target: "/admin/404", message: "Data yang Anda cari tidak ditemukan atau telah dihapus.", ctaPrimary: "Kembali ke Daftar", ctaSecondary: "Ke Dashboard", roleImpact: "Semua role — deep link rusak" },
  { scenario: "419 — Sesi Habis", trigger: "Session timeout 30 menit tanpa aktivitas", target: "/admin/419", message: "Sesi login Anda telah habis. Data yang belum disimpan mungkin hilang.", ctaPrimary: "Login Kembali", ctaSecondary: "—", roleImpact: "Semua role — data form hilang" },
  { scenario: "500 — Error Server", trigger: "API gagal / exception backend", target: "/admin/500", message: "Terjadi gangguan pada sistem. Tim teknis telah diberitahu.", ctaPrimary: "Coba Lagi", ctaSecondary: "Hubungi Admin", roleImpact: "Semua role — operasi gagal" },
  { scenario: "Menu Ada tapi Page No-Access", trigger: "Menu visible tapi halaman butuh permission level lebih tinggi", target: "Halaman bersangkutan", message: "Anda bisa melihat menu ini tapi tidak memiliki akses penuh. Hubungi admin.", ctaPrimary: "Kembali", ctaSecondary: "Request Akses", roleImpact: "HRD lihat user list (read-only), reviewer lihat hibah (read-only)" },
  { scenario: "Route Param Hilang", trigger: "URL /admin/hibah/:id tanpa id valid", target: "/admin/404", message: "Parameter halaman tidak lengkap. Silakan akses dari menu navigasi.", ctaPrimary: "Ke Daftar Hibah", ctaSecondary: "Ke Dashboard", roleImpact: "Semua role — bookmark/link rusak" },
  { scenario: "Data Null Relation", trigger: "Foreign key mengarah ke data yang sudah dihapus/nonaktif", target: "Halaman detail bersangkutan", message: "Beberapa data terkait tidak tersedia. Informasi ditampilkan sebagian.", ctaPrimary: "Lanjutkan", ctaSecondary: "Hubungi Admin", roleImpact: "Dosen/LPPM — data master fakultas/prodi berubah" },
  { scenario: "Avatar/Logo Tidak Ada", trigger: "Foto profil atau logo belum diupload", target: "—", message: "—", ctaPrimary: "—", ctaSecondary: "—", roleImpact: "Semua — fallback inisial nama ditampilkan (gradient circle)" },
  { scenario: "No Active Period", trigger: "Semua periode pengajuan sudah ditutup", target: "Halaman create form", message: "Tidak ada periode aktif saat ini. Pengajuan baru tidak dapat dibuat.", ctaPrimary: "Lihat Daftar", ctaSecondary: "Hubungi LPPM", roleImpact: "Dosen, LPPM — tombol Create disabled + info banner" },
];

// ═══════════════════════════════════════════════════════════
// SUMMARY DATA
// ═══════════════════════════════════════════════════════════

const CRITICAL_RULES = [
  "Role 'terdaftar' hanya bisa akses Dashboard (read-only), Notifikasi, dan Profile — semua menu lain WAJIB hidden.",
  "Hanya role 'administrator' dan 'halaman-admin' yang bisa mengubah role user (A14) — tidak ada exception.",
  "Finance TIDAK BOLEH bisa Create/Edit/Submit pengajuan apapun — hanya Verify dan Mark Lunas.",
  "Reviewer/Reviewer-hibah HANYA bisa akses Hibah dalam mode review — tidak bisa create, edit, atau delete.",
  "Setiap aksi Approve/Reject/Revisi WAJIB melewati ConfirmModal — tidak ada shortcut bypass.",
  "Status 'Ditolak' dan 'Lunas' adalah FINAL STATE — tidak ada transisi keluar dari status ini.",
  "Semua catatan Revisi dan Tolak WAJIB diisi (mandatory input) — tombol disabled jika kosong.",
  "Session timeout 30 menit WAJIB menampilkan warning 5 menit sebelum habis — user bisa extend.",
  "Data master yang berstatus nonaktif TIDAK BOLEH muncul di dropdown form pengajuan baru.",
  "Setiap role WAJIB punya landing page yang valid — tidak boleh ada role yang landing ke halaman 403.",
];

const CONFLICT_RISKS = [
  { id: "CR-01", desc: "Dosen + Reviewer pada satu user: bisa submit DAN review hibah yang sama", resolution: "Guard: user tidak bisa review pengajuan miliknya sendiri" },
  { id: "CR-02", desc: "LPPM bisa create dan approve — potensi self-approval", resolution: "Workflow: submitter tidak bisa approve submission sendiri" },
  { id: "CR-03", desc: "Administrator override semua — bisa bypass workflow", resolution: "Audit log wajib mencatat setiap admin override" },
  { id: "CR-04", desc: "Finance mark Lunas tanpa validasi bukti bayar", resolution: "Mandatory: upload bukti bayar sebelum tombol Lunas aktif" },
  { id: "CR-05", desc: "Ketua LPPM approve tanpa ada reviewer assign", resolution: "Guard: Approve hanya aktif jika reviewer sudah memberi assessment" },
  { id: "CR-06", desc: "HRD bisa lihat User List tapi tidak bisa edit role — confusing UX", resolution: "Tampilkan User List mode read-only, hide tombol Edit" },
  { id: "CR-07", desc: "Role 'halaman-admin' vs 'administrator' overlap besar", resolution: "halaman-admin = tampilan admin tanpa write akses ke sistem kritis (settings, audit)" },
  { id: "CR-08", desc: "Kordinator-publikasi tidak bisa akses hibah — tapi beberapa publikasi linked ke hibah", resolution: "Tampilkan info hibah sebagai read-only reference di detail publikasi" },
  { id: "CR-09", desc: "Reviewer-hibah berbeda dengan reviewer umum tetapi menu sama", resolution: "Filter data: reviewer-hibah hanya lihat hibah, reviewer bisa lihat semua jenis review" },
  { id: "CR-10", desc: "Notifikasi deep-link ke halaman yang user tidak punya akses", resolution: "Cek akses sebelum redirect — jika no-access, tampilkan 403 dengan info notifikasi" },
];

interface UATItem {
  role: string;
  page: string;
  action: string;
  expected: string;
}

const UAT_CHECKLIST: UATItem[] = [
  { role: "administrator", page: "Semua halaman (M01-M21)", action: "Navigasi semua menu", expected: "Semua menu visible dan accessible" },
  { role: "administrator", page: "User Management", action: "Assign Role ke user", expected: "Role berubah, sidebar user berubah sesuai" },
  { role: "dosen", page: "Hibah Internal", action: "Create → Submit → lihat di list", expected: "Draft tersimpan, status berubah ke Submitted" },
  { role: "dosen", page: "User Management", action: "Akses langsung via URL", expected: "Redirect ke 403, menu tidak visible di sidebar" },
  { role: "reviewer", page: "Hibah Detail", action: "Approve tanpa catatan", expected: "Tombol aktif, approve berhasil" },
  { role: "reviewer", page: "Hibah Detail", action: "Minta Revisi tanpa catatan", expected: "Tombol disabled / toast peringatan wajib isi catatan" },
  { role: "finance", page: "Surat Tugas Detail", action: "Mark Hutang → Mark Lunas", expected: "Status berubah ke Hutang, lalu Lunas. Badge berubah warna." },
  { role: "finance", page: "Hibah Create", action: "Akses halaman create", expected: "Redirect ke 403 atau tombol Create tidak muncul" },
  { role: "kordinator-publikasi", page: "Publikasi Detail", action: "Review → Approve", expected: "Status berubah, notifikasi ke dosen" },
  { role: "kordinator-publikasi", page: "Hibah Internal", action: "Akses menu", expected: "Menu Hibah tidak visible di sidebar" },
  { role: "ketua-lppm", page: "Audit Log", action: "Lihat log", expected: "Read-only, tidak ada tombol edit/delete" },
  { role: "ketua-lppm", page: "Settings", action: "Akses Settings", expected: "Menu Settings tidak visible / 403" },
  { role: "hrd", page: "User List", action: "Lihat data user", expected: "Read-only view, tidak ada tombol Edit Role" },
  { role: "hrd", page: "Surat Tugas", action: "Lihat list", expected: "Read-only, tidak ada tombol Create/Edit" },
  { role: "terdaftar", page: "Dashboard", action: "Login dan lihat dashboard", expected: "Dashboard read-only, banner 'Hubungi admin untuk aktivasi'" },
  { role: "terdaftar", page: "Hibah Internal", action: "Akses via URL", expected: "Menu tidak visible, akses langsung → 403" },
  { role: "Semua", page: "Session Timeout", action: "Idle 30 menit", expected: "Warning 5 menit sebelum, overlay 419 setelah habis" },
  { role: "Semua", page: "Error 404", action: "Akses /admin/xyz-invalid", expected: "Halaman 404 tampil dengan tombol recovery" },
  { role: "dosen + reviewer", page: "Hibah milik sendiri", action: "Coba review hibah sendiri", expected: "Tombol review disabled / tidak muncul" },
  { role: "Semua", page: "Profil Saya", action: "Edit profil + ganti password", expected: "Data tersimpan, toast sukses, tab password terpisah" },
];

// ═══════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════

function CellYN({ value }: { value: YN }) {
  return value === "Y" ? (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600"><CheckCircle className="w-3.5 h-3.5" /></span>
  ) : (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-300"><XCircle className="w-3.5 h-3.5" /></span>
  );
}

function CellAccess({ value }: { value: AccessType }) {
  if (value === "Full") return <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-100 text-green-700" style={{ fontWeight: 600 }}>Full</span>;
  if (value === "Read-Only") return <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700" style={{ fontWeight: 600 }}>R/O</span>;
  return <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-400" style={{ fontWeight: 600 }}>N/A</span>;
}

function CellAllow({ value }: { value: AllowDeny }) {
  return value === "Allow" ? (
    <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-100 text-green-700" style={{ fontWeight: 600 }}>Allow</span>
  ) : (
    <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-50 text-red-400" style={{ fontWeight: 600 }}>Deny</span>
  );
}

function StickyTh({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <th className={`px-2 py-2.5 text-left text-[10px] text-slate-500 whitespace-nowrap sticky left-0 bg-white z-10 ${className}`} style={{ fontWeight: 600 }}>{children}</th>;
}

function RoleTh({ role }: { role: RoleKey }) {
  return (
    <th className="px-1.5 py-2.5 text-center text-[10px] text-slate-500 whitespace-nowrap min-w-[52px]" style={{ fontWeight: 600 }}>
      <span className="block leading-tight">{ROLE_SHORT[role]}</span>
    </th>
  );
}

export function RoleMatrixPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("A");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (key: string) => setExpandedGroups((p) => ({ ...p, [key]: !p[key] }));

  return (
    <PageWrapper
      title="Role Access Matrix"
      subtitle="Referensi lengkap akses menu, halaman, aksi, status, sidebar, dan error handling per role"
      breadcrumbs={[{ label: "Master Data" }, { label: "Access Matrix" }]}
      actions={
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-[#E30613] rounded-lg hover:bg-[#c00510] transition-all active:scale-95"
          style={{ fontWeight: 500 }}
        >
          <Download className="w-4 h-4" /> Export / Print
        </button>
      }
    >
      {/* Legend */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap gap-x-6 gap-y-2 items-center">
        <span className="text-xs text-slate-500" style={{ fontWeight: 600 }}>LEGEND:</span>
        <span className="flex items-center gap-1.5 text-xs text-slate-600"><CheckCircle className="w-3.5 h-3.5 text-green-500" /> Y / Allow / Full</span>
        <span className="flex items-center gap-1.5 text-xs text-slate-600"><XCircle className="w-3.5 h-3.5 text-slate-300" /> N / Deny / No-Access</span>
        <span className="flex items-center gap-1 text-xs"><span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700" style={{ fontWeight: 600 }}>R/O</span> Read-Only</span>
        <span className="flex items-center gap-1 text-xs"><span className="text-[10px] px-1.5 py-0.5 rounded bg-red-100 text-red-600" style={{ fontWeight: 600 }}>N/A</span> Not Allowed</span>
        <span className="flex items-center gap-1.5 text-xs text-slate-600"><Minus className="w-3.5 h-3.5 text-slate-400" /> Tidak Berlaku</span>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 overflow-x-auto pb-1 -mx-1 px-1">
        {TAB_CONFIG.map((t) => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs rounded-lg whitespace-nowrap transition-all shrink-0 ${activeTab === t.key ? "bg-slate-800 text-white shadow-sm" : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"}`}
            style={{ fontWeight: activeTab === t.key ? 600 : 400 }}>
            <t.icon className="w-3.5 h-3.5" /> {t.key !== "summary" ? `Tabel ${t.key}: ` : ""}{t.label}
          </button>
        ))}
      </div>

      {/* ═══════ TABEL A ═══════ */}
      {activeTab === "A" && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm text-slate-800" style={{ fontWeight: 600 }}>Tabel A: Menu Visibility Matrix</h3>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Cari menu..."
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#E30613]/20 w-48" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50">
                  <StickyTh className="min-w-[50px]">Kode</StickyTh>
                  <th className="px-2 py-2.5 text-left text-[10px] text-slate-500 min-w-[130px]" style={{ fontWeight: 600 }}>Menu</th>
                  <th className="px-2 py-2.5 text-left text-[10px] text-slate-500 min-w-[150px] hidden lg:table-cell" style={{ fontWeight: 600 }}>Deskripsi</th>
                  {ROLES.map((r) => <RoleTh key={r} role={r} />)}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {MENU_DATA.filter((m) => !searchQuery || m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.code.toLowerCase().includes(searchQuery.toLowerCase())).map((m) => (
                  <tr key={m.code} className="hover:bg-slate-50/50">
                    <td className="px-2 py-2 text-[11px] text-slate-500 sticky left-0 bg-white" style={{ fontWeight: 600 }}>{m.code}</td>
                    <td className="px-2 py-2 text-[11px] text-slate-800" style={{ fontWeight: 500 }}>{m.name}</td>
                    <td className="px-2 py-2 text-[11px] text-slate-400 hidden lg:table-cell">{m.desc}</td>
                    {ROLES.map((r) => <td key={r} className="px-1.5 py-2 text-center"><CellYN value={m.access[r]} /></td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/50">
            <p className="text-[10px] text-slate-400">Total: {MENU_DATA.length} menu &times; {ROLES.length} roles = {MENU_DATA.length * ROLES.length} sel</p>
          </div>
        </div>
      )}

      {/* ═══════ TABEL B ═══════ */}
      {activeTab === "B" && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100">
            <h3 className="text-sm text-slate-800" style={{ fontWeight: 600 }}>Tabel B: Page Access Matrix</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Full = baca + tulis | Read-Only = hanya baca | No-Access = tidak bisa akses</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50">
                  <StickyTh className="min-w-[42px]">Kode</StickyTh>
                  <th className="px-2 py-2.5 text-left text-[10px] text-slate-500 min-w-[140px]" style={{ fontWeight: 600 }}>Halaman</th>
                  <th className="px-2 py-2.5 text-left text-[10px] text-slate-500 min-w-[50px]" style={{ fontWeight: 600 }}>Parent</th>
                  {ROLES.map((r) => <RoleTh key={r} role={r} />)}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {PAGE_DATA.map((p) => (
                  <tr key={p.code} className="hover:bg-slate-50/50">
                    <td className="px-2 py-2 text-[11px] text-slate-500 sticky left-0 bg-white" style={{ fontWeight: 600 }}>{p.code}</td>
                    <td className="px-2 py-2 text-[11px] text-slate-800" style={{ fontWeight: 500 }}>{p.name}</td>
                    <td className="px-2 py-2 text-[11px] text-slate-400">{p.parent}</td>
                    {ROLES.map((r) => <td key={r} className="px-1 py-2 text-center"><CellAccess value={p.access[r]} /></td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/50">
            <p className="text-[10px] text-slate-400">Total: {PAGE_DATA.length} halaman &times; {ROLES.length} roles = {PAGE_DATA.length * ROLES.length} sel</p>
          </div>
        </div>
      )}

      {/* ═══════ TABEL C ═══════ */}
      {activeTab === "C" && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100">
            <h3 className="text-sm text-slate-800" style={{ fontWeight: 600 }}>Tabel C: Action Permission Matrix</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Setiap aksi kritikal membutuhkan konfirmasi modal (ConfirmModal)</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50">
                  <StickyTh className="min-w-[42px]">Kode</StickyTh>
                  <th className="px-2 py-2.5 text-left text-[10px] text-slate-500 min-w-[110px]" style={{ fontWeight: 600 }}>Aksi</th>
                  <th className="px-2 py-2.5 text-left text-[10px] text-slate-500 min-w-[90px] hidden lg:table-cell" style={{ fontWeight: 600 }}>Modul</th>
                  <th className="px-2 py-2.5 text-left text-[10px] text-slate-500 min-w-[80px] hidden lg:table-cell" style={{ fontWeight: 600 }}>From</th>
                  <th className="px-2 py-2.5 text-left text-[10px] text-slate-500 min-w-[80px] hidden lg:table-cell" style={{ fontWeight: 600 }}>To</th>
                  {ROLES.map((r) => <RoleTh key={r} role={r} />)}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {ACTION_DATA.map((a) => (
                  <tr key={a.code} className="hover:bg-slate-50/50">
                    <td className="px-2 py-2 text-[11px] text-slate-500 sticky left-0 bg-white" style={{ fontWeight: 600 }}>{a.code}</td>
                    <td className="px-2 py-2 text-[11px] text-slate-800" style={{ fontWeight: 500 }}>{a.name}</td>
                    <td className="px-2 py-2 text-[11px] text-slate-400 hidden lg:table-cell">{a.module}</td>
                    <td className="px-2 py-2 text-[11px] text-slate-400 hidden lg:table-cell">{a.fromStatus}</td>
                    <td className="px-2 py-2 text-[11px] text-slate-400 hidden lg:table-cell">{a.toStatus}</td>
                    {ROLES.map((r) => <td key={r} className="px-1 py-2 text-center"><CellAllow value={a.access[r]} /></td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/50">
            <p className="text-[10px] text-slate-400">Total: {ACTION_DATA.length} aksi &times; {ROLES.length} roles = {ACTION_DATA.length * ROLES.length} sel</p>
          </div>
        </div>
      )}

      {/* ═══════ TABEL D ═══════ */}
      {activeTab === "D" && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100">
            <h3 className="text-sm text-slate-800" style={{ fontWeight: 600 }}>Tabel D: Status Transition Matrix</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Menunjukkan transisi status yang valid dan yang dilarang per modul</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50">
                  {["Modul", "From", "To", "Allowed Role", "Mandatory Input", "Notifikasi ke", "Catatan UX"].map((h) => (
                    <th key={h} className="px-3 py-2.5 text-left text-[10px] text-slate-500 whitespace-nowrap" style={{ fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {(["Hibah", "Surat Tugas", "Konferensi", "Publikasi"] as const).map((mod) => {
                  const rows = TRANSITION_DATA.filter((t) => t.module === mod);
                  const isExpanded = expandedGroups[mod] !== false; // default expanded
                  return (
                    <>{/* Group header */}
                      <tr key={`grp-${mod}`} className="bg-slate-50 cursor-pointer" onClick={() => toggleGroup(mod)}>
                        <td colSpan={7} className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-slate-500" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
                            <span className="text-[11px] text-slate-700" style={{ fontWeight: 600 }}>{mod}</span>
                            <span className="text-[10px] text-slate-400">({rows.length} transisi)</span>
                          </div>
                        </td>
                      </tr>
                      {isExpanded && rows.map((t, i) => (
                        <tr key={`${mod}-${i}`} className={`hover:bg-slate-50/50 ${!t.allowed ? "bg-red-50/30" : ""}`}>
                          <td className="px-3 py-2 text-[11px] text-slate-400">{t.module}</td>
                          <td className="px-3 py-2 text-[11px] text-slate-700" style={{ fontWeight: 500 }}>{t.from}</td>
                          <td className="px-3 py-2 text-[11px]" style={{ fontWeight: 500 }}>
                            <span className={t.allowed ? "text-green-700" : "text-red-500"}>{t.to}</span>
                          </td>
                          <td className="px-3 py-2 text-[11px] text-slate-600">{t.allowed ? t.allowedRole : <span className="text-red-400 italic">Not Allowed</span>}</td>
                          <td className="px-3 py-2 text-[11px] text-slate-500">{t.mandatoryInput}</td>
                          <td className="px-3 py-2 text-[11px] text-slate-500">{t.notifTo}</td>
                          <td className="px-3 py-2 text-[11px] text-slate-500 max-w-[200px]">
                            {!t.allowed && <span className="inline-flex items-center gap-1 text-red-500" style={{ fontWeight: 600 }}><XCircle className="w-3 h-3" /></span>}
                            {t.uxNote}
                          </td>
                        </tr>
                      ))}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/50">
            <p className="text-[10px] text-slate-400">Total: {TRANSITION_DATA.length} transisi ({TRANSITION_DATA.filter((t) => !t.allowed).length} invalid/dilarang)</p>
          </div>
        </div>
      )}

      {/* ═══════ TABEL E ═══════ */}
      {activeTab === "E" && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100">
            <h3 className="text-sm text-slate-800" style={{ fontWeight: 600 }}>Tabel E: Sidebar Render Rule Matrix</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Prioritas role (multi-role): administrator &gt; halaman-admin &gt; lppm &gt; finance &gt; reviewer &gt; dosen &gt; halaman-dosen &gt; terdaftar &gt; halaman-umum</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50">
                  {["Rule ID", "Kondisi Role", "Sidebar Variant", "Menu Group Ditampilkan", "Menu Group Disembunyikan", "Default Expanded", "Fallback"].map((h) => (
                    <th key={h} className="px-3 py-2.5 text-left text-[10px] text-slate-500 whitespace-nowrap" style={{ fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {SIDEBAR_RULES.map((r) => (
                  <tr key={r.id} className={`hover:bg-slate-50/50 ${r.id === "SR-13" ? "bg-amber-50/30" : ""}`}>
                    <td className="px-3 py-2.5 text-[11px] text-slate-500" style={{ fontWeight: 600 }}>{r.id}</td>
                    <td className="px-3 py-2.5 text-[11px] text-slate-800" style={{ fontWeight: 500 }}>{r.condition}</td>
                    <td className="px-3 py-2.5">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600" style={{ fontWeight: 600 }}>{r.variant}</span>
                    </td>
                    <td className="px-3 py-2.5 text-[11px] text-green-700 max-w-[200px]">{r.shown}</td>
                    <td className="px-3 py-2.5 text-[11px] text-red-400 max-w-[150px]">{r.hidden}</td>
                    <td className="px-3 py-2.5 text-[11px] text-slate-600">{r.defaultExpanded}</td>
                    <td className="px-3 py-2.5 text-[11px] text-slate-500 max-w-[200px]">{r.fallback || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══════ TABEL F ═══════ */}
      {activeTab === "F" && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100">
            <h3 className="text-sm text-slate-800" style={{ fontWeight: 600 }}>Tabel F: Error / Edge-Case Access Matrix</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50">
                  {["Skenario", "Trigger", "Halaman Tujuan", "Pesan UI", "CTA Primer", "CTA Sekunder", "Role Impact"].map((h) => (
                    <th key={h} className="px-3 py-2.5 text-left text-[10px] text-slate-500 whitespace-nowrap" style={{ fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {ERROR_SCENARIOS.map((e, i) => (
                  <tr key={i} className="hover:bg-slate-50/50">
                    <td className="px-3 py-2.5 text-[11px] text-slate-800 whitespace-nowrap" style={{ fontWeight: 600 }}>{e.scenario}</td>
                    <td className="px-3 py-2.5 text-[11px] text-slate-600 max-w-[180px]">{e.trigger}</td>
                    <td className="px-3 py-2.5 text-[11px] text-slate-500">{e.target}</td>
                    <td className="px-3 py-2.5 text-[11px] text-slate-600 max-w-[200px]">{e.message || "—"}</td>
                    <td className="px-3 py-2.5"><span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-700" style={{ fontWeight: 600 }}>{e.ctaPrimary}</span></td>
                    <td className="px-3 py-2.5 text-[11px] text-slate-400">{e.ctaSecondary}</td>
                    <td className="px-3 py-2.5 text-[11px] text-slate-500 max-w-[180px]">{e.roleImpact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══════ SUMMARY & UAT ═══════ */}
      {activeTab === "summary" && (
        <div className="space-y-6">
          {/* Critical Rules */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center"><AlertTriangle className="w-4 h-4 text-red-600" /></div>
              <div>
                <h3 className="text-sm text-slate-800" style={{ fontWeight: 600 }}>10 Rule Paling Kritikal</h3>
                <p className="text-[11px] text-slate-400">Jika dilanggar, sistem dianggap gagal</p>
              </div>
            </div>
            <div className="space-y-2.5">
              {CRITICAL_RULES.map((rule, i) => (
                <div key={i} className="flex gap-3 p-3 bg-slate-50 rounded-lg">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#E30613] text-white text-[10px] shrink-0" style={{ fontWeight: 700 }}>{i + 1}</span>
                  <p className="text-xs text-slate-700 leading-relaxed">{rule}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Conflict Risks */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center"><Info className="w-4 h-4 text-amber-600" /></div>
              <div>
                <h3 className="text-sm text-slate-800" style={{ fontWeight: 600 }}>10 Potensi Konflik Akses</h3>
                <p className="text-[11px] text-slate-400">Harus diuji di prototype sebelum production</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="px-3 py-2 text-left text-[10px] text-slate-500" style={{ fontWeight: 600 }}>ID</th>
                    <th className="px-3 py-2 text-left text-[10px] text-slate-500" style={{ fontWeight: 600 }}>Konflik</th>
                    <th className="px-3 py-2 text-left text-[10px] text-slate-500" style={{ fontWeight: 600 }}>Resolusi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {CONFLICT_RISKS.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/50">
                      <td className="px-3 py-2.5 text-[11px] text-slate-500" style={{ fontWeight: 600 }}>{c.id}</td>
                      <td className="px-3 py-2.5 text-[11px] text-orange-700 max-w-[300px]">{c.desc}</td>
                      <td className="px-3 py-2.5 text-[11px] text-green-700 max-w-[300px]">{c.resolution}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* UAT Checklist */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center"><ClipboardCheck className="w-4 h-4 text-green-600" /></div>
              <div>
                <h3 className="text-sm text-slate-800" style={{ fontWeight: 600 }}>Checklist UAT Berbasis Role</h3>
                <p className="text-[11px] text-slate-400">Siapa menguji apa, aksi apa, expected result apa</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/50">
                    <th className="px-3 py-2 text-left text-[10px] text-slate-500 w-8" style={{ fontWeight: 600 }}>#</th>
                    <th className="px-3 py-2 text-left text-[10px] text-slate-500" style={{ fontWeight: 600 }}>Role Penguji</th>
                    <th className="px-3 py-2 text-left text-[10px] text-slate-500" style={{ fontWeight: 600 }}>Halaman</th>
                    <th className="px-3 py-2 text-left text-[10px] text-slate-500" style={{ fontWeight: 600 }}>Aksi Diuji</th>
                    <th className="px-3 py-2 text-left text-[10px] text-slate-500" style={{ fontWeight: 600 }}>Expected Result</th>
                    <th className="px-3 py-2 text-center text-[10px] text-slate-500 w-12" style={{ fontWeight: 600 }}>Pass?</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {UAT_CHECKLIST.map((u, i) => (
                    <tr key={i} className="hover:bg-slate-50/50">
                      <td className="px-3 py-2.5 text-[11px] text-slate-400" style={{ fontWeight: 600 }}>{i + 1}</td>
                      <td className="px-3 py-2.5"><span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700" style={{ fontWeight: 600 }}>{u.role}</span></td>
                      <td className="px-3 py-2.5 text-[11px] text-slate-700" style={{ fontWeight: 500 }}>{u.page}</td>
                      <td className="px-3 py-2.5 text-[11px] text-slate-600">{u.action}</td>
                      <td className="px-3 py-2.5 text-[11px] text-slate-600 max-w-[250px]">{u.expected}</td>
                      <td className="px-3 py-2.5 text-center">
                        <div className="w-5 h-5 rounded border-2 border-slate-300 mx-auto" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Ringkasan Keputusan Desain */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-sm text-slate-800 mb-4" style={{ fontWeight: 600 }}>Ringkasan Keputusan Desain Utama</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "Role 'terdaftar' bersifat sandbox — akses minimal sampai admin mengaktivasi",
                "halaman-admin/halaman-dosen/halaman-umum adalah access group bukan user role — digunakan untuk template sidebar",
                "Multi-role mengikuti prioritas tertinggi untuk sidebar, tapi permission digabung (union)",
                "Semua final state (Ditolak, Lunas) irreversible — butuh pengajuan baru untuk memulai ulang",
                "Finance tidak bisa membuat pengajuan — separation of duty dijalankan ketat",
                "Reviewer tidak bisa mereview pengajuan sendiri — self-review guard wajib",
                "Setiap perubahan role user membutuhkan audit trail otomatis",
                "Error 419 (session expired) harus menampilkan peringatan 5 menit sebelum timeout",
              ].map((d, i) => (
                <div key={i} className="flex gap-2 p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                  <CheckCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-700 leading-relaxed">{d}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Risiko UX */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-sm text-slate-800 mb-4" style={{ fontWeight: 600 }}>Risiko UX yang Masih Mungkin Terjadi</h3>
            <div className="space-y-2">
              {[
                "User multi-role mungkin bingung dengan sidebar yang berubah — perlu onboarding tooltip",
                "Deep-link notifikasi ke halaman yang tidak bisa diakses akan membuat UX terasa broken",
                "Form yang belum disimpan akan hilang jika session timeout — perlu auto-save draft lokal",
                "Tabel pada mobile perlu horizontal scroll — risiko miss informasi penting di kolom kanan",
                "Cascade delete pada master data (fakultas/prodi) bisa membuat relasi di modul lain kosong",
              ].map((r, i) => (
                <div key={i} className="flex gap-2 p-3 bg-amber-50/50 rounded-lg border border-amber-100">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-700 leading-relaxed">{r}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Asumsi */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-sm text-slate-800 mb-4" style={{ fontWeight: 600 }}>Asumsi yang Harus Divalidasi Stakeholder</h3>
            <div className="space-y-2">
              {[
                "Satu user hanya memiliki SATU role aktif pada satu waktu (bukan multi-role simultan)",
                "Periode pengajuan dikontrol oleh admin — jika tidak ada periode aktif, create disabled",
                "HRD hanya butuh read-access ke user list dan surat tugas — tidak perlu write",
                "Reviewer-hibah dan Reviewer umum memiliki scope yang berbeda (hibah-only vs semua modul review)",
                "Status 'Ditolak' adalah final — tidak ada mekanisme banding/appeal dalam sistem ini",
                "Export data tersedia dalam format Excel dan PDF — CSV hanya untuk modul tertentu",
                "Notifikasi bersifat in-app only — email notification di luar scope sistem ini",
              ].map((a, i) => (
                <div key={i} className="flex gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <FileText className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-700 leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
