export interface AdministrationMenuItem {
  key: string;
  label: string;
  path: string;
  icon?: "UserCog" | "Building2" | "GraduationCap" | "FolderTree" | "Star" | "Users" | "Shield" | "Cog" | "Award" | "Banknote";
  note?: string;
}

export interface AdministrationMenuGroup {
  key: string;
  label: string;
  items: AdministrationMenuItem[];
}

// Diambil dari docs/super-admin-administrasi-full-react.md dan
// resources/js/super-admin/superAdminAdministrationBlueprint.js.
// Isi di sini sengaja dibatasi ke jalur React yang sudah tersedia di repo ini.

export const SUPER_ADMIN_LEFT_MENU: AdministrationMenuGroup[] = [
  {
    key: "website",
    label: "Website",
    items: [
      { key: "web-settings", label: "Web Settings", path: "/admin/settings", icon: "Cog" },
      { key: "posting-website", label: "Posting Website", path: "/admin/artikel-admin", icon: "Star" },
      { key: "halaman-website", label: "Halaman Website", path: "/admin/artikel-admin?tab=halaman", icon: "Star" },
    ],
  },
  {
    key: "periode",
    label: "Periode",
    items: [
      { key: "periode-hibah", label: "Periode Ajuan Hibah", path: "/admin/periode-ajuan?jenis=hibah", icon: "Shield" },
      { key: "periode-st", label: "Periode Pengajuan ST", path: "/admin/periode-ajuan?jenis=st", icon: "Shield" },
    ],
  },
  {
    key: "data-tambahan",
    label: "Data Tambahan",
    items: [
      { key: "kelompok-skema", label: "Kelompok Skema", path: "/admin/skema-riset?tab=skema", icon: "Star" },
      { key: "mitra", label: "Mitra", path: "/admin/skema-riset?tab=mitra", icon: "Building2" },
      { key: "jenis-hak-cipta", label: "Jenis Hak Cipta", path: "/admin/skema-riset?tab=hakijenis", icon: "Award" },
      { key: "biaya-hak-cipta", label: "Biaya Hak Cipta", path: "/admin/skema-riset?tab=biayahakcipta", icon: "Banknote" },
      { key: "sub-jenis-hak-cipta", label: "Sub Jenis Hak Cipta", path: "/admin/skema-riset?tab=subjenishakcipta", icon: "FolderTree" },
    ],
  },
];

export const SUPER_ADMIN_CONTROL_SIDEBAR: AdministrationMenuGroup[] = [
  {
    key: "setting",
    label: "Setting dan Admin",
    items: [
      { key: "users", label: "Users", path: "/admin/users", icon: "UserCog" },
      { key: "fakultas", label: "Fakultas", path: "/admin/fakultas", icon: "Building2" },
      { key: "program-study", label: "Program Study", path: "/admin/prodi", icon: "GraduationCap" },
      { key: "pejabat-pradita", label: "Pejabat Pradita", path: "/admin/pejabat", icon: "UserCog" },
      { key: "group-reference", label: "Group Reference", path: "/admin/group-reference", icon: "FolderTree" },
      { key: "nilai-reference", label: "Nilai Reference", path: "/admin/nilai-reference", icon: "Star" },
      { key: "roles", label: "Roles", path: "/admin/roles", icon: "Users" },
      { key: "permission", label: "Permission", path: "/admin/permissions", icon: "Shield" },
      { key: "role-permission", label: "Role Permission", path: "/admin/role-matrix", icon: "Shield" },
      { key: "settings", label: "Settings", path: "/admin/settings", icon: "Cog" },
    ],
  },
  {
    key: "hibah",
    label: "Hibah",
    items: [
      { key: "jenis-hak-cipta", label: "Jenis Hak Cipta", path: "/admin/skema-riset?tab=hakijenis", icon: "Award" },
      { key: "biaya-hak-cipta", label: "Biaya Hak Cipta", path: "/admin/skema-riset?tab=biayahakcipta", icon: "Banknote" },
      { key: "sub-jenis-hak-cipta", label: "Sub Jenis Hak Cipta", path: "/admin/skema-riset?tab=subjenishakcipta", icon: "FolderTree" },
      {
        key: "pembayaran-hak-cipta",
        label: "Pembayaran Hak Cipta",
        path: "/admin/group-reference",
        icon: "Star",
        note: "Oddity legacy: di Blade lama item ini masih salah route ke group reference.",
      },
    ],
  },
];
