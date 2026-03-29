import type { UserRole } from "../context/AuthContext";

export interface MenuItem {
  key: string;
  label: string;
  icon: string;
  path?: string;
  children?: MenuItem[];
  roles: UserRole[];
  hiddenRoles?: UserRole[]; // Roles that have access to the route but won't see it in the sidebar
  badge?: number;
}

// ─── Role Groups ────────────────────────────────────
const ALL_MAIN: UserRole[] = ["administrator", "dosen", "reviewer", "halaman-umum"];
const ADMIN_ONLY: UserRole[] = ["administrator"];


export const menuConfig: MenuItem[] = [
  // ─── Dashboard ─────────────────────────────────────
  {
    key: "dashboard",
    label: "Dashboard",
    icon: "LayoutDashboard",
    path: "/admin",
    roles: ALL_MAIN,
  },

  // ─── Surat Tugas ───────────────────────────────────
  {
    key: "surat-tugas",
    label: "Surat Tugas",
    icon: "FileSignature",
    roles: ["administrator", "dosen"],
    children: [
      {
        key: "daftar-ajuan-st",
        label: "Daftar Ajuan ST",
        icon: "Circle",
        path: "/admin/surat-tugas",
        roles: ["administrator", "dosen"],
      },
      {
        key: "periode-st",
        label: "Periode Ajuan ST",
        icon: "Circle",
        path: "/admin/periode-ajuan?jenis=st",
        roles: ["administrator"],
      },
    ],
  },

  // ─── Penelitian (admin/reviewer view) ──────────────
  {
    key: "penelitian",
    label: "Penelitian",
    icon: "BookOpenCheck",
    roles: ["administrator", "reviewer"],
    children: [
      {
        key: "penelitian-all",
        label: "All",
        icon: "Circle",
        path: "/admin/hibah/penelitian",
        roles: ["administrator", "reviewer"],
      },
      {
        key: "penelitian-baru",
        label: "Baru",
        icon: "Circle",
        path: "/admin/hibah/penelitian?filter=submit",
        roles: ["administrator", "reviewer"],
      },
      {
        key: "penelitian-tolak",
        label: "Tolak",
        icon: "Circle",
        path: "/admin/hibah/penelitian?filter=rejected",
        roles: ["administrator"],
      },
      {
        key: "penelitian-approve",
        label: "Approve",
        icon: "Circle",
        path: "/admin/hibah/penelitian?filter=approved",
        roles: ["administrator"],
      },
    ],
  },

  // ─── PKM (admin/reviewer view) ─────────────────────
  {
    key: "pkm",
    label: "PKM",
    icon: "Handshake",
    roles: ["administrator", "reviewer"],
    children: [
      {
        key: "pkm-ku",
        label: "PKM Ku",
        icon: "Circle",
        path: "/admin/hibah/pengabdian",
        roles: ["administrator"],
      },
      {
        key: "pkm-baru",
        label: "Baru",
        icon: "Circle",
        path: "/admin/hibah/pengabdian?filter=submit",
        roles: ["administrator", "reviewer"],
      },
      {
        key: "pkm-approve",
        label: "Approve",
        icon: "Circle",
        path: "/admin/hibah/pengabdian?filter=approved",
        roles: ["administrator", "reviewer"],
      },
    ],
  },

  // ─── Hibah Internal (admin view) ───────────────────
  {
    key: "hibah-internal",
    label: "Hibah",
    icon: "BookOpen",
    roles: ["administrator", "reviewer"],
    children: [
      {
        key: "hibah-all",
        label: "All",
        icon: "Circle",
        path: "/admin/hibah/anggota",
        roles: ["administrator", "reviewer"],
      },
      {
        key: "hibah-baru",
        label: "Baru",
        icon: "Circle",
        path: "/admin/periode-ajuan?jenis=hibah",
        roles: ["administrator"],
      },
      {
        key: "hibah-tolak",
        label: "Tolak",
        icon: "Circle",
        path: "/admin/hibah/penelitian?filter=rejected",
        roles: ["administrator"],
      },
      {
        key: "hibah-approve",
        label: "Approve",
        icon: "Circle",
        path: "/admin/hibah/penelitian?filter=approved",
        roles: ["administrator"],
      },
    ],
  },

  // ─── Hibah Internal (dosen view) ───────────────────
  {
    key: "hibah-dosen",
    label: "Hibah Internal",
    icon: "BookOpen",
    roles: ["dosen"],
    children: [
      {
        key: "hibah-dosen-penelitian",
        label: "Penelitian",
        icon: "Circle",
        path: "/admin/hibah/penelitian",
        roles: ["dosen"],
      },
      {
        key: "hibah-dosen-pengabdian",
        label: "Pengabdian",
        icon: "Circle",
        path: "/admin/hibah/pengabdian",
        roles: ["dosen"],
      },
      {
        key: "hibah-dosen-anggota",
        label: "Anggota Hibah",
        icon: "Circle",
        path: "/admin/hibah/anggota",
        roles: ["dosen"],
      },
    ],
  },

  // ─── HAKI ──────────────────────────────────────────
  {
    key: "haki",
    label: "HAKI",
    icon: "Award",
    roles: ADMIN_ONLY,
    children: [
      {
        key: "haki-daftar",
        label: "Daftar Ciptaan",
        icon: "Circle",
        path: "/admin/haki",
        roles: ADMIN_ONLY,
      },
    ],
  },

  // ─── Insentif Publikasi ────────────────────────────
  {
    key: "insentif",
    label: "Insentif Publikasi",
    icon: "Gift",
    roles: ADMIN_ONLY,
    hiddenRoles: ["administrator"],
    children: [
      {
        key: "insentif-submitted",
        label: "Submitted",
        icon: "Circle",
        path: "/admin/insentif/submitted",
        roles: ADMIN_ONLY,
      },
      {
        key: "insentif-finalisasi",
        label: "Finalisasi",
        icon: "Circle",
        path: "/admin/insentif/finalisasi",
        roles: ADMIN_ONLY,
      },
      {
        key: "periode-insentif",
        label: "Periode Ajuan",
        icon: "Circle",
        path: "/admin/periode-ajuan?jenis=insentif",
        roles: ADMIN_ONLY,
      },
    ],
  },

  // ─── Konferensi ────────────────────────────────────
  {
    key: "konferensi",
    label: "Konferensi",
    icon: "Presentation",
    roles: ["administrator", "dosen"],
    hiddenRoles: ["administrator"],
    children: [
      {
        key: "list-konferensi",
        label: "List Konferensi",
        icon: "Circle",
        path: "/admin/konferensi",
        roles: ["administrator", "dosen"],
      },
    ],
  },

  // ─── Laporan Publikasi ─────────────────────────────
  {
    key: "laporan-publikasi",
    label: "Laporan Publikasi",
    icon: "BookMarked",
    roles: ["administrator", "dosen"],
    hiddenRoles: ["administrator"],
    children: [
      {
        key: "pub-artikel",
        label: "Artikel",
        icon: "Circle",
        path: "/admin/laporan-publikasi/artikel",
        roles: ["administrator", "dosen"],
      },
      {
        key: "pub-buku",
        label: "Buku",
        icon: "Circle",
        path: "/admin/laporan-publikasi/buku",
        roles: ["administrator", "dosen"],
      },
      {
        key: "pub-ki",
        label: "KI",
        icon: "Circle",
        path: "/admin/laporan-publikasi/ki",
        roles: ["administrator", "dosen"],
      },
      {
        key: "pub-prototipe",
        label: "Prototipe",
        icon: "Circle",
        path: "/admin/laporan-publikasi/prototipe",
        roles: ["administrator", "dosen"],
      },
    ],
  },

  // ─── Laporan Kegiatan ──────────────────────────────
  {
    key: "laporan-kegiatan",
    label: "Laporan Kegiatan",
    icon: "ClipboardList",
    roles: ["administrator", "dosen"],
    hiddenRoles: ["administrator"],
    children: [
      {
        key: "kegiatan-penelitian",
        label: "Penelitian",
        icon: "Circle",
        path: "/admin/laporan-kegiatan/penelitian",
        roles: ["administrator", "dosen"],
      },
      {
        key: "kegiatan-pkm",
        label: "PKM",
        icon: "Circle",
        path: "/admin/laporan-kegiatan/pkm",
        roles: ["administrator", "dosen"],
      },
    ],
  },

  // ─── Master Data ───────────────────────────────────
  {
    key: "master",
    label: "Master Data",
    icon: "Database",
    roles: ADMIN_ONLY,
    hiddenRoles: ["administrator"],
    children: [
      { key: "users", label: "User Management", icon: "Users", path: "/admin/users", roles: ADMIN_ONLY, hiddenRoles: ["administrator"] },
      { key: "roles", label: "Roles", icon: "Shield", path: "/admin/roles", roles: ADMIN_ONLY, hiddenRoles: ["administrator"] },
      { key: "permissions", label: "Permissions", icon: "Key", path: "/admin/permissions", roles: ADMIN_ONLY, hiddenRoles: ["administrator"] },
      { key: "role-matrix", label: "Role-Permission Matrix", icon: "Grid3x3", path: "/admin/role-matrix", roles: ADMIN_ONLY, hiddenRoles: ["administrator"] },
      { key: "access-matrix", label: "Access Matrix", icon: "Shield", path: "/admin/access-matrix", roles: ADMIN_ONLY, hiddenRoles: ["administrator"] },
    ],
  },

  // ─── Referensi ─────────────────────────────────────
  {
    key: "referensi",
    label: "Referensi",
    icon: "BookOpen",
    roles: ADMIN_ONLY,
    hiddenRoles: ["administrator"],
    children: [
      { key: "fakultas", label: "Fakultas", icon: "Building2", path: "/admin/fakultas", roles: ADMIN_ONLY, hiddenRoles: ["administrator"] },
      { key: "prodi", label: "Program Studi", icon: "GraduationCap", path: "/admin/prodi", roles: ADMIN_ONLY, hiddenRoles: ["administrator"] },
      { key: "pejabat", label: "Pejabat Pradita", icon: "UserCog", path: "/admin/pejabat", roles: ADMIN_ONLY, hiddenRoles: ["administrator"] },
      { key: "group-ref", label: "Group Reference", icon: "FolderTree", path: "/admin/group-reference", roles: ADMIN_ONLY, hiddenRoles: ["administrator"] },
      { key: "nilai-ref", label: "Nilai Reference", icon: "Star", path: "/admin/nilai-reference", roles: ADMIN_ONLY, hiddenRoles: ["administrator"] },
      { key: "skema-riset", label: "Kelompok Skema", icon: "Layers", path: "/admin/skema-riset?tab=skema", roles: ADMIN_ONLY, hiddenRoles: ["administrator"] },
      { key: "tema-riset", label: "Tema Riset", icon: "Tag", path: "/admin/skema-riset?tab=tema", roles: ADMIN_ONLY, hiddenRoles: ["administrator"] },
      { key: "bidang-keahlian", label: "Bidang Keahlian", icon: "BookOpenCheck", path: "/admin/skema-riset?tab=bidang", roles: ADMIN_ONLY, hiddenRoles: ["administrator"] },
      { key: "jenis-haki", label: "Jenis HAKI", icon: "Award", path: "/admin/skema-riset?tab=hakijenis", roles: ADMIN_ONLY, hiddenRoles: ["administrator"] },
      { key: "mitra", label: "Mitra", icon: "Handshake", path: "/admin/skema-riset?tab=mitra", roles: ADMIN_ONLY, hiddenRoles: ["administrator"] },
    ],
  },

  // ─── Manajemen Konten ──────────────────────────────
  {
    key: "konten",
    label: "Manajemen Konten",
    icon: "Newspaper",
    roles: ADMIN_ONLY,
    hiddenRoles: ["administrator"],
    children: [
      { key: "artikel-admin", label: "Artikel", icon: "FileText", path: "/admin/artikel-admin", roles: ADMIN_ONLY, hiddenRoles: ["administrator"] },
      { key: "kategori-artikel", label: "Kategori", icon: "Tag", path: "/admin/artikel-admin?tab=kategori", roles: ADMIN_ONLY, hiddenRoles: ["administrator"] },
      { key: "galeri", label: "Galeri", icon: "Image", path: "/admin/artikel-admin?tab=galeri", roles: ADMIN_ONLY, hiddenRoles: ["administrator"] },
    ],
  },

  // ─── Pelaporan Hibah ───────────────────────────────
  {
    key: "reporting",
    label: "Pelaporan Hibah",
    icon: "FileText",
    path: "/admin/reporting",
    roles: ADMIN_ONLY,
    hiddenRoles: ["administrator"],
  },

  // ─── Sistem ────────────────────────────────────────
  {
    key: "sistem",
    label: "Sistem",
    icon: "Settings",
    roles: ADMIN_ONLY,
    hiddenRoles: ["administrator"],
    children: [
      { key: "settings", label: "Settings", icon: "Cog", path: "/admin/settings", roles: ADMIN_ONLY, hiddenRoles: ["administrator"] },
      { key: "audit-log", label: "Audit Log", icon: "ScrollText", path: "/admin/audit-log", roles: ADMIN_ONLY, hiddenRoles: ["administrator"] },
      { key: "activity-log", label: "Activity Log", icon: "ClipboardList", path: "/admin/activity-log", roles: ADMIN_ONLY, hiddenRoles: ["administrator"] },
    ],
  },
];

export function getMenuForRole(role: UserRole): MenuItem[] {
  return menuConfig
    .filter((item) => item.roles.includes(role) && (!item.hiddenRoles?.includes(role)))
    .map((item) => ({
      ...item,
      children: item.children?.filter((child) => child.roles.includes(role) && (!child.hiddenRoles?.includes(role))),
    }))
    .filter((item) => !item.children || item.children.length > 0);
}
