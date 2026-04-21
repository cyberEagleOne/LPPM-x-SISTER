import { normalizeMockValue } from "./mockNameMap";

export type ManagedRoleTemplate = "administrator" | "dosen" | "reviewer" | "halaman-umum";

export type ManagedRoleKey = string;

export type ManagedUserStatus = "active" | "inactive";

export interface ManagedUserProfile {
  namaDepan?: string;
  namaBelakang?: string;
  aboutMe?: string;
  jenisKelamin?: number | "";
  tanggalLahir?: string;
  noTelp?: string;
  bankAccount?: string;
  noRekening?: string;
  npwp?: string;
  ttdUrl?: string | null;
  fotoUrl?: string | null;
  fakultasId?: number | "";
  prodiId?: number | "";
  pangkat?: string;
  sintaId?: string;
  sintaUrl?: string;
  gscholarUrl?: string;
  gscholarSkor?: string;
  bidangPenelitian?: string[];
  bidangPkm?: string[];
}

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  roleKeys: ManagedRoleKey[];
  fakultas: string;
  prodi?: string;
  nidn?: string;
  status: ManagedUserStatus;
  profile?: ManagedUserProfile;
}

export interface ManagedRoleDefinition {
  key: ManagedRoleKey;
  label: string;
  slug: string;
  description: string;
  template: ManagedRoleTemplate;
  system: boolean;
}

export interface ManagedPermissionDefinition {
  id: string;
  module: string;
  action: string;
  description: string;
}

export type RolePermissionMatrix = Record<ManagedRoleKey, string[]>;

const STORAGE_KEYS = {
  users: "lppm-pradita.super-admin.users.v2",
  roles: "lppm-pradita.super-admin.roles.v2",
  permissions: "lppm-pradita.super-admin.permissions.v2",
  matrix: "lppm-pradita.super-admin.matrix.v2",
} as const;

function cloneData<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readStorage<T>(key: string, fallback: T): T {
  if (!canUseStorage()) return cloneData(fallback);
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return cloneData(fallback);
    return normalizeMockValue(JSON.parse(raw) as T);
  } catch {
    return cloneData(fallback);
  }
}

function writeStorage<T>(key: string, value: T) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export const DEFAULT_ROLE_DEFINITIONS: ManagedRoleDefinition[] = [
  { key: "administrator", label: "Administrator", slug: "administrator", description: "Super admin penuh untuk seluruh area administrasi.", template: "administrator", system: true },
  { key: "halaman-admin", label: "Halaman Admin", slug: "halaman-admin", description: "Gerbang akses ke shell admin.", template: "administrator", system: true },
  { key: "lppm", label: "LPPM", slug: "lppm", description: "Operator inti LPPM untuk administrasi hibah dan referensi.", template: "administrator", system: true },
  { key: "dosen", label: "Dosen", slug: "dosen", description: "Pengguna dosen untuk pengajuan internal.", template: "dosen", system: true },
  { key: "halaman-dosen", label: "Halaman Dosen", slug: "halaman-dosen", description: "Hak masuk ke shell dosen.", template: "dosen", system: true },
  { key: "reviewer", label: "Reviewer", slug: "reviewer", description: "Reviewer umum untuk proses penilaian.", template: "reviewer", system: true },
  { key: "reviewer-hibah", label: "Reviewer Hibah", slug: "reviewer-hibah", description: "Reviewer khusus hibah.", template: "reviewer", system: true },
  { key: "finance", label: "Finance", slug: "finance", description: "Role keuangan untuk monitoring pendanaan.", template: "administrator", system: true },
  { key: "kordinator-publikasi", label: "Koordinator Publikasi", slug: "kordinator-publikasi", description: "Koordinator modul publikasi.", template: "administrator", system: true },
  { key: "kordinator-riset", label: "Koordinator Riset", slug: "kordinator-riset", description: "Koordinator modul riset dan konferensi.", template: "administrator", system: true },
  { key: "ketua-lppm", label: "Ketua LPPM", slug: "ketua-lppm", description: "Role approval tingkat pimpinan LPPM.", template: "administrator", system: true },
  { key: "halaman-umum", label: "Halaman Umum", slug: "halaman-umum", description: "Akses publik umum non-admin.", template: "halaman-umum", system: true },
  { key: "hrd", label: "HRD", slug: "hrd", description: "Read-only user administration dan surat tugas.", template: "administrator", system: true },
  { key: "terdaftar", label: "Terdaftar", slug: "terdaftar", description: "Pengguna yang baru terdaftar dengan akses minim.", template: "halaman-umum", system: true },
];

export const DEFAULT_PERMISSIONS: ManagedPermissionDefinition[] = [
  { id: "users.view", module: "Users", action: "View", description: "Melihat daftar user dan detail dasar." },
  { id: "users.manage", module: "Users", action: "Manage", description: "Menambah, mengubah, dan menghapus user." },
  { id: "roles.manage", module: "Roles", action: "Manage", description: "Mengelola role sistem." },
  { id: "permissions.manage", module: "Permissions", action: "Manage", description: "Mengelola daftar permission." },
  { id: "matrix.manage", module: "Roles", action: "Assign Permission", description: "Mengubah matrix role-permission." },
  { id: "hibah.view", module: "Hibah Internal", action: "View", description: "Melihat daftar hibah." },
  { id: "hibah.create", module: "Hibah Internal", action: "Create", description: "Membuat ajuan hibah baru." },
  { id: "hibah.edit", module: "Hibah Internal", action: "Edit", description: "Mengubah ajuan hibah." },
  { id: "hibah.approve", module: "Hibah Internal", action: "Approve", description: "Menyetujui ajuan hibah." },
  { id: "hibah.review", module: "Hibah Internal", action: "Review", description: "Memberi review dan catatan hibah." },
  { id: "surat.view", module: "Surat Tugas", action: "View", description: "Melihat daftar surat tugas." },
  { id: "surat.create", module: "Surat Tugas", action: "Create", description: "Membuat surat tugas." },
  { id: "surat.approve", module: "Surat Tugas", action: "Approve", description: "Menyetujui surat tugas." },
  { id: "konf.view", module: "Konferensi", action: "View", description: "Melihat pengajuan konferensi." },
  { id: "konf.create", module: "Konferensi", action: "Create", description: "Membuat pengajuan konferensi." },
  { id: "pub.view", module: "Publikasi", action: "View", description: "Melihat pengajuan publikasi." },
  { id: "pub.create", module: "Publikasi", action: "Create", description: "Membuat pengajuan publikasi." },
  { id: "pub.approve", module: "Publikasi", action: "Approve", description: "Menyetujui pengajuan publikasi." },
  { id: "settings.manage", module: "Settings", action: "Manage", description: "Mengubah pengaturan sistem." },
  { id: "audit.view", module: "Audit", action: "View", description: "Melihat audit log." },
  { id: "report.export", module: "Reporting", action: "Export", description: "Mengunduh laporan dan data." },
];

const DEFAULT_MATRIX: RolePermissionMatrix = {
  administrator: DEFAULT_PERMISSIONS.map((permission) => permission.id),
  "halaman-admin": DEFAULT_PERMISSIONS.map((permission) => permission.id),
  lppm: ["users.view", "hibah.view", "hibah.create", "hibah.edit", "surat.view", "surat.create", "konf.view", "konf.create", "pub.view", "report.export"],
  dosen: ["hibah.view", "hibah.create", "hibah.edit", "surat.view", "surat.create", "konf.view", "konf.create", "pub.view", "pub.create"],
  "halaman-dosen": ["hibah.view", "hibah.create", "hibah.edit", "surat.view", "surat.create", "konf.view", "konf.create", "pub.view", "pub.create"],
  reviewer: ["hibah.view", "hibah.review"],
  "reviewer-hibah": ["hibah.view", "hibah.review"],
  finance: ["hibah.view", "surat.view", "report.export"],
  "kordinator-publikasi": ["pub.view", "pub.create", "pub.approve", "report.export"],
  "kordinator-riset": ["hibah.view", "hibah.create", "hibah.edit", "konf.view", "konf.create", "report.export"],
  "ketua-lppm": ["hibah.view", "hibah.approve", "surat.view", "surat.approve", "pub.view", "pub.approve", "audit.view", "report.export"],
  "halaman-umum": [],
  hrd: ["users.view", "surat.view"],
  terdaftar: [],
};

export const DEFAULT_USERS: ManagedUser[] = [
  {
    id: "USR-001",
    name: "Raka Pratama",
    email: "raka.pratama@pradita.ac.id",
    roleKeys: ["administrator", "halaman-admin"],
    fakultas: "-",
    prodi: "-",
    nidn: "000000001",
    status: "active",
    profile: {
      namaDepan: "Raka",
      namaBelakang: "Pratama",
      noTelp: "081234567890",
      bankAccount: "14",
      noRekening: "123456789",
      npwp: "123456789",
      fakultasId: 1,
      prodiId: 1,
      pangkat: "asisten-ahli",
      sintaId: "1",
      sintaUrl: "https://sinta.kemdikbud.go.id",
      gscholarUrl: "https://scholar.google.com",
      gscholarSkor: "2",
      bidangPenelitian: ["Data Analyst"],
      bidangPkm: ["Software Engineering"],
    },
  },
  { id: "USR-002", name: "Rizky Maulana", email: "rizky.maulana@contoh.com", roleKeys: ["dosen", "halaman-dosen"], fakultas: "-", prodi: "-", nidn: "000000002", status: "active" },
  { id: "USR-003", name: "Nadira Putri Lestari, S.T., M.T.", email: "nadira.lestari@pradita.ac.id", roleKeys: ["dosen", "halaman-dosen"], fakultas: "Fakultas Teknik", prodi: "Teknik Informatika", nidn: "0312098901", status: "active" },
  { id: "USR-004", name: "Belinda Prameswari, S.T., M.Eng.", email: "belinda.prameswari@pradita.ac.id", roleKeys: ["dosen", "halaman-dosen"], fakultas: "Fakultas Teknik", prodi: "Teknik Sipil", nidn: "0312098902", status: "active" },
  { id: "USR-005", name: "Dr. Farhan Mahendra, S.T., M.T., M.B.A.", email: "farhan.mahendra@pradita.ac.id", roleKeys: ["dosen", "halaman-dosen"], fakultas: "Fakultas Teknik", prodi: "Arsitektur", nidn: "0312098903", status: "active" },
  { id: "USR-006", name: "Rizal Saputra, S.T., M.T.", email: "rizal.saputra@pradita.ac.id", roleKeys: ["dosen", "halaman-dosen"], fakultas: "Fakultas Teknik", prodi: "Sistem Informasi", nidn: "0312098904", status: "active" },
  { id: "USR-007", name: "Intan Ayu Maharani, S.T., M.T.", email: "intan.ayu@pradita.ac.id", roleKeys: ["dosen", "halaman-dosen"], fakultas: "Fakultas Teknik", prodi: "Desain Interior", nidn: "0312098905", status: "inactive" },
  { id: "USR-008", name: "Della Olivia, S.T., M.T.", email: "della.olivia@pradita.ac.id", roleKeys: ["dosen", "halaman-dosen"], fakultas: "Fakultas Desain", prodi: "Desain Komunikasi Visual", nidn: "0312098906", status: "active" },
  { id: "USR-009", name: "Rendi Akbar Pratama", email: "rendi.akbar@pradita.ac.id", roleKeys: ["hrd"], fakultas: "Fakultas Teknologi", prodi: "Sistem Informasi", nidn: "0312098907", status: "active" },
  { id: "USR-010", name: "Aditya Firmansyah, S.T., M.T.", email: "aditya.firmansyah@pradita.ac.id", roleKeys: ["reviewer", "reviewer-hibah"], fakultas: "Fakultas Teknik", prodi: "Teknik Informatika", nidn: "0312098908", status: "active" },
];

export function getManagedRoles() {
  return readStorage(STORAGE_KEYS.roles, DEFAULT_ROLE_DEFINITIONS);
}

export function saveManagedRoles(roles: ManagedRoleDefinition[]) {
  writeStorage(STORAGE_KEYS.roles, roles);
}

export function getManagedPermissions() {
  return readStorage(STORAGE_KEYS.permissions, DEFAULT_PERMISSIONS);
}

export function saveManagedPermissions(permissions: ManagedPermissionDefinition[]) {
  writeStorage(STORAGE_KEYS.permissions, permissions);
}

export function syncRolePermissionMatrix(
  matrix: Partial<RolePermissionMatrix>,
  roles: ManagedRoleDefinition[],
  permissions: ManagedPermissionDefinition[],
): RolePermissionMatrix {
  const allowedIds = new Set(permissions.map((permission) => permission.id));
  return roles.reduce((acc, role) => {
    const existing = matrix[role.key] ?? DEFAULT_MATRIX[role.key] ?? [];
    acc[role.key] = Array.from(new Set(existing.filter((permissionId) => allowedIds.has(permissionId))));
    return acc;
  }, {} as RolePermissionMatrix);
}

export function getRolePermissionMatrix() {
  const roles = getManagedRoles();
  const permissions = getManagedPermissions();
  const matrix = readStorage<Partial<RolePermissionMatrix>>(STORAGE_KEYS.matrix, DEFAULT_MATRIX);
  return syncRolePermissionMatrix(matrix, roles, permissions);
}

export function saveRolePermissionMatrix(matrix: RolePermissionMatrix) {
  writeStorage(STORAGE_KEYS.matrix, matrix);
}

export function getManagedUsers() {
  return readStorage(STORAGE_KEYS.users, DEFAULT_USERS).map((user) => {
    if (user.id !== "USR-001") return user;
    return {
      ...user,
      profile: {
        ...user.profile,
        namaDepan: "Raka",
        namaBelakang: "Pratama",
      },
    };
  });
}

export function saveManagedUsers(users: ManagedUser[]) {
  writeStorage(STORAGE_KEYS.users, users);
}

export function createManagedUserId(existingUsers: ManagedUser[]) {
  const maxNumericId = existingUsers.reduce((maxValue, user) => {
    const numericValue = Number(user.id.replace(/\D/g, ""));
    return Number.isFinite(numericValue) ? Math.max(maxValue, numericValue) : maxValue;
  }, 0);
  return `USR-${String(maxNumericId + 1).padStart(3, "0")}`;
}

export function getRoleLabelMap(roles: ManagedRoleDefinition[]) {
  return Object.fromEntries(roles.map((role) => [role.key, role.label])) as Record<string, string>;
}

export function getPrimaryRoleLabel(roleKeys: ManagedRoleKey[], roles: ManagedRoleDefinition[]) {
  const labelMap = getRoleLabelMap(roles);
  return roleKeys.map((roleKey) => labelMap[roleKey] ?? roleKey).join(", ");
}

export function buildDefaultProfileFromUser(user: ManagedUser): ManagedUserProfile {
  const [namaDepan = user.name, ...rest] = user.name.split(" ");
  return {
    namaDepan,
    namaBelakang: rest.join(" "),
    aboutMe: "",
    jenisKelamin: 6,
    tanggalLahir: "",
    noTelp: "",
    bankAccount: "14",
    noRekening: "",
    npwp: "",
    ttdUrl: null,
    fotoUrl: null,
    fakultasId: 1,
    prodiId: 1,
    pangkat: "asisten-ahli",
    sintaId: user.nidn ?? "",
    sintaUrl: "",
    gscholarUrl: "",
    gscholarSkor: "0",
    bidangPenelitian: [],
    bidangPkm: [],
  };
}
