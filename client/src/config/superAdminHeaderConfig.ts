export interface SuperAdminHeaderMenuItem {
  label: string;
  route?: string;
  href?: string;
  placeholder?: boolean;
  note?: string;
  legacyRouteName?: string;
  legacyRouteParams?: Array<number | string>;
  path?: string;
  children?: SuperAdminHeaderMenuItem[];
}

export interface SuperAdminHeaderPrimaryLink {
  label: string;
  route?: string;
  href?: string;
  placeholder?: boolean;
  path?: string;
}

export interface SuperAdminHeaderRightAction {
  key: "search" | "notifications" | "fullscreen" | "control-sidebar";
  label: string;
  icon: string;
}

const UNAVAILABLE_NOTE = "Menu ini masih mengikuti struktur Laravel lama dan belum punya halaman React baru.";
const SHARED_REPORT_PERIOD_NOTE = "React baru saat ini masih memakai halaman periode laporan bersama untuk kegiatan dan publikasi.";

export const SUPER_ADMIN_HEADER_ADMIN_MENU: SuperAdminHeaderMenuItem[] = [
  { label: "Web Settings", route: "websettings", legacyRouteName: "websettings", path: "/admin/settings" },
  {
    label: "Artikel",
    children: [
      { label: "Daftar Posting", route: "post.index", legacyRouteName: "post.index", path: "/admin/artikel-admin" },
      { label: "Daftar Halaman", route: "page.index", legacyRouteName: "page.index", path: "/admin/artikel-admin?tab=halaman" },
    ],
  },
  {
    label: "Hibah",
    children: [
      { label: "Periode Ajuan", route: "periodeajuanhibahs", legacyRouteName: "periodeajuanhibahs", path: "/admin/periode-ajuan?jenis=hibah" },
    ],
  },
  {
    label: "Kegiatan",
    children: [
      {
        label: "Periode Penarikan",
        route: "laporan.periodeindex",
        legacyRouteName: "laporan.periodeindex",
        legacyRouteParams: ["kegiatan"],
        path: "/admin/periode-ajuan?jenis=laporan",
        note: SHARED_REPORT_PERIOD_NOTE,
      },
    ],
  },
  {
    label: "Publikasi",
    children: [
      {
        label: "Periode Penarikan",
        route: "laporan.periodeindex",
        legacyRouteName: "laporan.periodeindex",
        legacyRouteParams: ["publikasi"],
        path: "/admin/periode-ajuan?jenis=laporan",
        note: SHARED_REPORT_PERIOD_NOTE,
      },
    ],
  },
  {
    label: "Surat Tugas",
    children: [
      { label: "Periode Pengajuan", route: "st.periodestsindex", legacyRouteName: "st.periodestsindex", path: "/admin/periode-ajuan?jenis=st" },
    ],
  },
  {
    label: "Data Tambahan",
    children: [
      { label: "Mahasiswa", route: "mahasiswa.index", legacyRouteName: "mahasiswa.index", note: UNAVAILABLE_NOTE },
      { label: "Non Dosen", route: "nondosen.index", legacyRouteName: "nondosen.index", note: UNAVAILABLE_NOTE },
      { label: "Mitra", route: "mitra.index", legacyRouteName: "mitra.index", path: "/admin/skema-riset?tab=mitra" },
      { label: "Kelompok Skema", route: "kelompokskemas", legacyRouteName: "kelompokskemas", path: "/admin/skema-riset?tab=skema" },
      { label: "Konferensi Skema", route: "konferensiskemas", legacyRouteName: "konferensiskemas", note: UNAVAILABLE_NOTE },
    ],
  },
  {
    label: "Rubrik",
    children: [
      {
        label: "Adm PKM",
        children: [
          { label: "Pertanyaan", route: "rubrik.adminpkm", legacyRouteName: "rubrik.adminpkm", note: UNAVAILABLE_NOTE },
          {
            label: "Jawaban",
            route: "rubrik.adminpilihanindexpkm",
            legacyRouteName: "rubrik.adminpilihanindexpkm",
            legacyRouteParams: ["Crypt::encrypt(0)"],
            note: "Di Laravel route lama dibuka dengan parameter default 0. React baru belum punya halaman ini.",
          },
        ],
      },
      {
        label: "Adm Penelitian",
        children: [
          { label: "Pertanyaan", route: "rubrik.adminindex", legacyRouteName: "rubrik.adminindex", note: UNAVAILABLE_NOTE },
          {
            label: "Jawaban",
            route: "rubrik.adminpilihanindex",
            legacyRouteName: "rubrik.adminpilihanindex",
            legacyRouteParams: ["Crypt::encrypt(0)"],
            note: "Di Laravel route lama dibuka dengan parameter default 0. React baru belum punya halaman ini.",
          },
        ],
      },
      {
        label: "Sub PKM",
        children: [
          { label: "Pertanyaan", route: "rubrik.pkmindex", legacyRouteName: "rubrik.pkmindex", note: UNAVAILABLE_NOTE },
          {
            label: "Jawaban",
            route: "rubrik.pkmpilihanindex",
            legacyRouteName: "rubrik.pkmpilihanindex",
            legacyRouteParams: ["Crypt::encrypt(0)"],
            note: "Di Laravel route lama dibuka dengan parameter default 0. React baru belum punya halaman ini.",
          },
        ],
      },
      {
        label: "Sub Penelitian",
        children: [
          { label: "Pertanyaan", route: "rubrik.penelitianindex", legacyRouteName: "rubrik.penelitianindex", note: UNAVAILABLE_NOTE },
          {
            label: "Jawaban",
            route: "rubrik.penelitianpilihanindex",
            legacyRouteName: "rubrik.penelitianpilihanindex",
            legacyRouteParams: ["Crypt::encrypt(0)"],
            note: "Di Laravel route lama dibuka dengan parameter default 0. React baru belum punya halaman ini.",
          },
        ],
      },
    ],
  },
  {
    label: "Quiz Evaluasi",
    children: [
      {
        label: "Quiz PKM",
        children: [
          { label: "Pertanyaan", route: "quiz.quizpkmindex", legacyRouteName: "quiz.quizpkmindex", note: UNAVAILABLE_NOTE },
          {
            label: "Jawaban",
            route: "quiz.quizpkmpilihanindex",
            legacyRouteName: "quiz.quizpkmpilihanindex",
            legacyRouteParams: ["Crypt::encrypt(0)"],
            note: "Di Laravel route lama dibuka dengan parameter default 0. React baru belum punya halaman ini.",
          },
        ],
      },
    ],
  },
  {
    label: "Universitas",
    children: [
      { label: "Roadmap", route: "roadmap", legacyRouteName: "roadmap", note: UNAVAILABLE_NOTE },
      {
        label: "Data Fakultas",
        children: [
          { label: "Fakultas", route: "fakultas", legacyRouteName: "fakultas", path: "/admin/fakultas" },
          {
            label: "Riset",
            route: "risetfakultas",
            legacyRouteName: "risetfakultas",
            legacyRouteParams: [0],
            note: "Di Laravel route lama dibuka dengan parameter default 0. React baru belum punya halaman ini.",
          },
          {
            label: "Riset Tema",
            route: "risettema",
            legacyRouteName: "risettema",
            legacyRouteParams: [0],
            note: "Di Laravel route lama dibuka dengan parameter default 0. React baru belum punya halaman ini.",
          },
          {
            label: "Prodi",
            route: "prodi",
            legacyRouteName: "prodi",
            legacyRouteParams: [0],
            path: "/admin/prodi",
            note: "Di Laravel route lama dibuka dengan parameter default 0.",
          },
        ],
      },
      {
        label: "Prodi",
        children: [
          {
            label: "Tema",
            route: "tema",
            legacyRouteName: "tema",
            legacyRouteParams: [0],
            note: "Di Laravel route lama dibuka dengan parameter default 0. React baru belum punya halaman ini.",
          },
          {
            label: "Subtema",
            route: "subtema",
            legacyRouteName: "subtema",
            legacyRouteParams: [0],
            note: "Di Laravel route lama dibuka dengan parameter default 0. React baru belum punya halaman ini.",
          },
          {
            label: "Topik",
            route: "topiktema",
            legacyRouteName: "topiktema",
            legacyRouteParams: [0],
            note: "Di Laravel route lama dibuka dengan parameter default 0. React baru belum punya halaman ini.",
          },
          {
            label: "Bidang Keahlian",
            route: "bidangkeahlian",
            legacyRouteName: "bidangkeahlian",
            legacyRouteParams: [0],
            note: "Di Laravel route lama dibuka dengan parameter default 0. React baru belum punya halaman ini.",
          },
        ],
      },
    ],
  },
];

export const SUPER_ADMIN_HEADER_PRIMARY_LINKS: SuperAdminHeaderPrimaryLink[] = [
  { label: "Home", route: "admin", path: "/admin" },
  { label: "Contact", path: "/about/kontak" },
];

export const SUPER_ADMIN_HEADER_RIGHT_ACTIONS: SuperAdminHeaderRightAction[] = [
  { key: "search", label: "Search", icon: "fas fa-search" },
  { key: "notifications", label: "Notifications", icon: "far fa-bell" },
  { key: "fullscreen", label: "Fullscreen", icon: "fas fa-expand-arrows-alt" },
  { key: "control-sidebar", label: "Control Sidebar", icon: "fas fa-th-large" },
];
