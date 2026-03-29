import { normalizeMockValue } from "./mockNameMap";

export interface FacultyItem {
  id: string;
  name: string;
  code: string;
  dean: string;
  description: string;
}

export interface StudyProgramItem {
  id: string;
  facultyId: string;
  name: string;
  code: string;
  degree: string;
  accreditation: string;
}

export interface OfficialItem {
  id: string;
  name: string;
  position: string;
  unit: string;
  email: string;
}

export interface ReferenceGroupItem {
  id: string;
  name: string;
  code: string;
  description: string;
}

export interface ReferenceValueItem {
  id: string;
  groupId: string;
  label: string;
  valueCode: string;
  description: string;
  sortOrder: number;
}

const STORAGE_KEYS = {
  faculties: "lppm-pradita.super-admin.reference.faculties.v1",
  studyPrograms: "lppm-pradita.super-admin.reference.study-programs.v1",
  officials: "lppm-pradita.super-admin.reference.officials.v1",
  groups: "lppm-pradita.super-admin.reference.groups.v1",
  values: "lppm-pradita.super-admin.reference.values.v1",
} as const;

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function cloneData<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
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

export const DEFAULT_FACULTIES: FacultyItem[] = [
  { id: "FK-001", name: "Fakultas Teknologi", code: "FT", dean: "Dr. Gilang Perdana", description: "Teknik Informatika dan Sistem Informasi." },
  { id: "FK-002", name: "Fakultas Bisnis", code: "FB", dean: "Prof. Ratna Kusumawati", description: "Manajemen dan Akuntansi." },
  { id: "FK-003", name: "Fakultas Desain", code: "FD", dean: "Dr. Citra Maheswari", description: "DKV, Arsitektur, dan Desain Interior." },
  { id: "FK-004", name: "Fakultas Hospitality", code: "FH", dean: "Dr. Bayu Saptono", description: "Hospitality dan Pariwisata." },
];

export const DEFAULT_STUDY_PROGRAMS: StudyProgramItem[] = [
  { id: "PD-001", facultyId: "FK-001", name: "Teknik Informatika", code: "TI", degree: "S1", accreditation: "Baik Sekali" },
  { id: "PD-002", facultyId: "FK-001", name: "Sistem Informasi", code: "SI", degree: "S1", accreditation: "Baik Sekali" },
  { id: "PD-003", facultyId: "FK-002", name: "Manajemen", code: "MN", degree: "S1", accreditation: "Unggul" },
  { id: "PD-004", facultyId: "FK-002", name: "Akuntansi", code: "AK", degree: "S1", accreditation: "Baik Sekali" },
  { id: "PD-005", facultyId: "FK-003", name: "Desain Komunikasi Visual", code: "DKV", degree: "S1", accreditation: "Baik" },
  { id: "PD-006", facultyId: "FK-003", name: "Arsitektur", code: "ARS", degree: "S1", accreditation: "Baik" },
];

export const DEFAULT_OFFICIALS: OfficialItem[] = [
  { id: "PJB-001", name: "Prof. Dr. Surya Kencana", position: "Rektor", unit: "Universitas", email: "rektor@pradita.ac.id" },
  { id: "PJB-002", name: "Prof. Dimas Prakoso", position: "Ketua LPPM", unit: "LPPM", email: "ketua.lppm@pradita.ac.id" },
  { id: "PJB-003", name: "Dr. Hadi Saputra", position: "Wakil Rektor Bidang Akademik", unit: "Universitas", email: "wr1@pradita.ac.id" },
  { id: "PJB-004", name: "Dr. Gilang Perdana", position: "Dekan Fakultas Teknologi", unit: "Fakultas Teknologi", email: "dekan.ft@pradita.ac.id" },
];

export const DEFAULT_REFERENCE_GROUPS: ReferenceGroupItem[] = [
  { id: "GR-001", name: "Skema Hibah", code: "SKEMA", description: "Kategori skema hibah penelitian dan pengabdian." },
  { id: "GR-002", name: "Jenis Publikasi", code: "JENIS_PUB", description: "Kategori jenis publikasi ilmiah dan luaran." },
  { id: "GR-003", name: "Status Kegiatan", code: "STATUS", description: "Status proses kegiatan dan pengajuan." },
  { id: "GR-004", name: "Level Konferensi", code: "LEVEL_KONF", description: "Tingkat konferensi nasional dan internasional." },
];

export const DEFAULT_REFERENCE_VALUES: ReferenceValueItem[] = [
  { id: "RV-001", groupId: "GR-001", label: "Penelitian Dasar", valueCode: "PEN_DASAR", description: "Skema penelitian dasar.", sortOrder: 1 },
  { id: "RV-002", groupId: "GR-001", label: "Penelitian Terapan", valueCode: "PEN_TERAPAN", description: "Skema penelitian terapan.", sortOrder: 2 },
  { id: "RV-003", groupId: "GR-001", label: "Pengabdian Masyarakat", valueCode: "PKM", description: "Skema pengabdian masyarakat.", sortOrder: 3 },
  { id: "RV-004", groupId: "GR-002", label: "Jurnal", valueCode: "JURNAL", description: "Publikasi jurnal.", sortOrder: 1 },
  { id: "RV-005", groupId: "GR-002", label: "Prosiding", valueCode: "PROSIDING", description: "Publikasi prosiding.", sortOrder: 2 },
  { id: "RV-006", groupId: "GR-002", label: "Buku", valueCode: "BUKU", description: "Publikasi buku.", sortOrder: 3 },
  { id: "RV-007", groupId: "GR-003", label: "Draft", valueCode: "DRAFT", description: "Status draft.", sortOrder: 1 },
  { id: "RV-008", groupId: "GR-003", label: "Approved", valueCode: "APPROVED", description: "Status disetujui.", sortOrder: 2 },
];

export function getFaculties() {
  return readStorage(STORAGE_KEYS.faculties, DEFAULT_FACULTIES);
}

export function saveFaculties(items: FacultyItem[]) {
  writeStorage(STORAGE_KEYS.faculties, items);
}

export function getStudyPrograms() {
  return readStorage(STORAGE_KEYS.studyPrograms, DEFAULT_STUDY_PROGRAMS);
}

export function saveStudyPrograms(items: StudyProgramItem[]) {
  writeStorage(STORAGE_KEYS.studyPrograms, items);
}

export function getOfficials() {
  return readStorage(STORAGE_KEYS.officials, DEFAULT_OFFICIALS);
}

export function saveOfficials(items: OfficialItem[]) {
  writeStorage(STORAGE_KEYS.officials, items);
}

export function getReferenceGroups() {
  return readStorage(STORAGE_KEYS.groups, DEFAULT_REFERENCE_GROUPS);
}

export function saveReferenceGroups(items: ReferenceGroupItem[]) {
  writeStorage(STORAGE_KEYS.groups, items);
}

export function getReferenceValues() {
  return readStorage(STORAGE_KEYS.values, DEFAULT_REFERENCE_VALUES);
}

export function saveReferenceValues(items: ReferenceValueItem[]) {
  writeStorage(STORAGE_KEYS.values, items);
}

export function createReferenceId(prefix: string, ids: string[]) {
  const maxNumeric = ids.reduce((highest, id) => {
    const numeric = Number(id.replace(/\D/g, ""));
    return Number.isFinite(numeric) ? Math.max(highest, numeric) : highest;
  }, 0);
  return `${prefix}-${String(maxNumeric + 1).padStart(3, "0")}`;
}
