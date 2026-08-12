import { normalizeMockValue } from "./mockNameMap";

export type WebsitePostStatus = "draft" | "published";
export type WebsitePageStatus = "saved" | "published";

export interface WebsiteSettingsData {
  image: string | null;
  siteName: string;
  about: string;
  address: string;
  email: string;
  phone: string;
  urls: string[];
  templatePenelitian: string;
  templatePkm: string;
  templateMandiri: string;
  templateKi: string;
}

export interface WebsitePostItem {
  id: string;
  judul: string;
  penulis: string[];
  editor: string;
  kategoris: string[];
  excerpt: string;
  body: string;
  regionberita: string[];
  image: string | null;
  namaimage: string;
  figcaption: string;
  published_at: string;
  status: WebsitePostStatus;
  views: number;
}

export interface WebsitePageItem {
  id: string;
  judul: string;
  excerpt: string;
  body: string;
  status: WebsitePageStatus;
  updated_at: string;
}

export interface WebsiteCategoryItem {
  id: string;
  nama: string;
  slug: string;
}

export interface WebsiteGalleryItem {
  id: string;
  nama: string;
  deskripsi: string;
  tanggal: string;
  coverImage: string | null;
}

const STORAGE_KEYS = {
  settings: "lppm-pradita.super-admin.website.settings.v1",
  posts: "lppm-pradita.super-admin.website.posts.v1",
  pages: "lppm-pradita.super-admin.website.pages.v1",
  categories: "lppm-pradita.super-admin.website.categories.v1",
  galleries: "lppm-pradita.super-admin.website.galleries.v1",
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

export const DEFAULT_WEBSITE_SETTINGS: WebsiteSettingsData = {
  image: null,
  siteName: "LPPM Portal Integration",
  about:
    "Portal LPPM berfokus pada penguatan budaya riset, pengabdian masyarakat, dan hilirisasi inovasi kampus.",
  address: "Kawasan Edukasi Terpadu, Jakarta",
  email: "lppm@example.com",
  phone: "+62 21 5555 9999",
  urls: ["https://example.com", "https://sippm.example.com"],
  templatePenelitian:
    "Template dokumen penelitian mencakup pengesahan, proposal, laporan kemajuan, dan laporan akhir.",
  templatePkm:
    "Template dokumen PKM mencakup pengesahan, proposal, laporan kemajuan, dan laporan akhir.",
  templateMandiri:
    "Template mandiri dipakai untuk proposal dan laporan akhir kegiatan yang tidak memakai skema pendanaan institusi.",
  templateKi:
    "Template KI memuat surat pernyataan, pengalihan hak cipta, dan lampiran pendaftaran kekayaan intelektual.",
};

export const DEFAULT_WEBSITE_CATEGORIES: WebsiteCategoryItem[] = [
  { id: "KAT-001", nama: "Berita", slug: "berita" },
  { id: "KAT-002", nama: "Panduan", slug: "panduan" },
  { id: "KAT-003", nama: "Kegiatan", slug: "kegiatan" },
  { id: "KAT-004", nama: "Pengumuman", slug: "pengumuman" },
  { id: "KAT-005", nama: "Laporan", slug: "laporan" },
  { id: "KAT-006", nama: "Tips dan Trik", slug: "tips-trik" },
];

export const DEFAULT_WEBSITE_POSTS: WebsitePostItem[] = [
  {
    id: "POST-001",
    judul: "Portal LPPM Raih Hibah Penelitian 2026",
    penulis: ["Admin LPPM"],
    editor: "Admin Demo",
    kategoris: ["Berita"],
    excerpt:
      "Tim LPPM berhasil meloloskan proposal penelitian dalam kompetisi Hibah Riset 2026.",
    body:
      "Tim LPPM berhasil meloloskan proposal penelitian dalam kompetisi Hibah Riset 2026. Capaian ini menjadi modal penting untuk memperkuat ekosistem riset kampus.",
    regionberita: ["homepage", "riset"],
    image: null,
    namaimage: "",
    figcaption: "",
    published_at: "2026-03-01",
    status: "published",
    views: 1245,
  },
  {
    id: "POST-002",
    judul: "Panduan Pengajuan Surat Tugas Kegiatan Ilmiah 2026",
    penulis: ["Admin LPPM"],
    editor: "Raka Pratama",
    kategoris: ["Panduan"],
    excerpt:
      "Panduan lengkap untuk mengajukan surat tugas kegiatan ilmiah melalui sistem SIPPM terbaru.",
    body:
      "Panduan lengkap untuk mengajukan surat tugas kegiatan ilmiah melalui sistem SIPPM terbaru. Seluruh dosen diminta mengikuti struktur dokumen dan timeline yang berlaku.",
    regionberita: ["homepage"],
    image: null,
    namaimage: "",
    figcaption: "",
    published_at: "2026-02-20",
    status: "published",
    views: 892,
  },
  {
    id: "POST-003",
    judul: "Prosedur Baru Pelaporan Kegiatan Penelitian 2026",
    penulis: ["Admin LPPM"],
    editor: "Raka Pratama",
    kategoris: ["Pengumuman"],
    excerpt:
      "Mulai tahun 2026, pelaporan kegiatan penelitian wajib dilakukan melalui sistem SIPPM secara bertahap.",
    body:
      "Mulai tahun 2026, pelaporan kegiatan penelitian wajib dilakukan melalui sistem SIPPM secara bertahap. Tim diminta menyiapkan file pendukung sesuai template terbaru.",
    regionberita: ["riset"],
    image: null,
    namaimage: "",
    figcaption: "",
    published_at: "2026-02-10",
    status: "draft",
    views: 0,
  },
];

export const DEFAULT_WEBSITE_PAGES: WebsitePageItem[] = [
  {
    id: "PAGE-001",
    judul: "Tentang LPPM",
    excerpt: "Profil singkat LPPM Universitas Pradita.",
    body:
      "LPPM Universitas Pradita berperan dalam pengelolaan penelitian, pengabdian kepada masyarakat, publikasi, dan penguatan inovasi.",
    status: "published",
    updated_at: "2026-03-10",
  },
  {
    id: "PAGE-002",
    judul: "Visi dan Misi",
    excerpt: "Arah strategis LPPM dalam mendukung tridharma perguruan tinggi.",
    body:
      "Visi dan misi LPPM menitikberatkan pada kualitas riset, relevansi pengabdian, dan dampak sosial yang terukur.",
    status: "published",
    updated_at: "2026-02-28",
  },
  {
    id: "PAGE-003",
    judul: "Kontak",
    excerpt: "Informasi kontak dan alamat layanan LPPM.",
    body:
      "Hubungi LPPM melalui email resmi, telepon, atau kunjungi kantor layanan di lingkungan kampus Pradita.",
    status: "saved",
    updated_at: "2026-02-15",
  },
];

export const DEFAULT_WEBSITE_GALLERIES: WebsiteGalleryItem[] = [
  {
    id: "GAL-001",
    nama: "Seminar Nasional Riset 2025",
    deskripsi: "Dokumentasi seminar nasional riset dan inovasi LPPM 2025.",
    tanggal: "2025-06-15",
    coverImage: null,
  },
  {
    id: "GAL-002",
    nama: "Workshop Penulisan Hibah",
    deskripsi: "Dokumentasi workshop penulisan proposal hibah DRTPM.",
    tanggal: "2025-04-20",
    coverImage: null,
  },
];

export function getWebsiteSettings() {
  return readStorage(STORAGE_KEYS.settings, DEFAULT_WEBSITE_SETTINGS);
}

export function saveWebsiteSettings(settings: WebsiteSettingsData) {
  writeStorage(STORAGE_KEYS.settings, settings);
}

export function getWebsitePosts() {
  return readStorage(STORAGE_KEYS.posts, DEFAULT_WEBSITE_POSTS);
}

export function saveWebsitePosts(posts: WebsitePostItem[]) {
  writeStorage(STORAGE_KEYS.posts, posts);
}

export function getWebsitePages() {
  return readStorage(STORAGE_KEYS.pages, DEFAULT_WEBSITE_PAGES);
}

export function saveWebsitePages(pages: WebsitePageItem[]) {
  writeStorage(STORAGE_KEYS.pages, pages);
}

export function getWebsiteCategories() {
  return readStorage(STORAGE_KEYS.categories, DEFAULT_WEBSITE_CATEGORIES);
}

export function saveWebsiteCategories(categories: WebsiteCategoryItem[]) {
  writeStorage(STORAGE_KEYS.categories, categories);
}

export function getWebsiteGalleries() {
  return readStorage(STORAGE_KEYS.galleries, DEFAULT_WEBSITE_GALLERIES);
}

export function saveWebsiteGalleries(galleries: WebsiteGalleryItem[]) {
  writeStorage(STORAGE_KEYS.galleries, galleries);
}

export function createWebsiteId(prefix: string, ids: string[]) {
  const maxNumeric = ids.reduce((highest, id) => {
    const numeric = Number(id.replace(/\D/g, ""));
    return Number.isFinite(numeric) ? Math.max(highest, numeric) : highest;
  }, 0);
  return `${prefix}-${String(maxNumeric + 1).padStart(3, "0")}`;
}
