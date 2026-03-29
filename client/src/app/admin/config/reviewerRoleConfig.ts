export interface ReviewerMenuItem {
  label: string;
  path?: string;
  placeholder?: boolean;
  note?: string;
  legacyRouteName?: string;
  children?: ReviewerMenuItem[];
  action?: "logout";
}

export interface ReviewerSidebarItem {
  label: string;
  icon: string;
  path?: string;
  note?: string;
  highlight?: boolean;
  children?: ReviewerSidebarItem[];
}

export interface ReviewerApplicantProfile {
  name: string;
  rank: string;
  sintaId: string;
  sintaUrl: string;
  googleScholarLabel: string;
  googleScholarUrl: string;
  researchFocus: string[];
  pkmFocus: string[];
}

export interface ReviewerHibahSummary {
  kelompokSkema: string;
  tahunUsulan: string;
  temaHibah: string;
  semester: string;
  lamaKegiatan: string;
  roadmapUniversitas: string;
  risetFakultas: string;
  risetTema: string;
  temaProdi: string;
  subtemaProdi: string;
  targetTkt: string;
}

export interface ReviewerProposal {
  title: string;
  abstract: string;
  blindProposalUrl: string;
  blindDocumentUrl: string;
}

export interface ReviewerOutputItem {
  journalName: string;
  url: string;
}

export interface ReviewerBudgetItem {
  group: string;
  component: string;
  item: string;
  unit: string;
  price: number;
  volume: number;
}

export interface ReviewerPartnerItem {
  picName: string;
  institution: string;
  address: string;
  email: string;
  country: string;
  supportLetter: string;
  fund?: number;
}

export interface ReviewerDraftReview {
  answers: Record<string, number>;
  notes: string;
  submitted: boolean;
}

export interface ReviewerAssignment {
  assignmentId: string;
  hibahId: string;
  encryptedHibahId: string;
  type: "penelitian" | "pkm";
  typeLabel: string;
  reviewYearLabel: string;
  invitationDate: string;
  approvalStatus: "pending" | "terima" | "tolak";
  reviewed: boolean;
  canReview: boolean;
  applicant: ReviewerApplicantProfile;
  hibahSummary: ReviewerHibahSummary;
  proposal: ReviewerProposal;
  outputs: ReviewerOutputItem[];
  budgets: ReviewerBudgetItem[];
  partners: ReviewerPartnerItem[];
  draftReview: ReviewerDraftReview;
}

export interface ReviewerRubric {
  id: string;
  question: string;
  options: Array<{ label: string; score: number }>;
}

export const reviewerLegacySources = {
  loginRedirect: "app/Http/Controllers/Auth/LoginController.php",
  shellLayout: "resources/views/layouts/dosen/main.blade.php",
  navbar: "resources/views/layouts/dosen/nav.blade.php",
  sidebar: "resources/views/layouts/dosen/sidebar.blade.php",
  dashboard: "resources/views/dosen/index.blade.php",
  assignmentList: "resources/views/dosen/applyhibah/reviewerlists.blade.php",
  penelitianReview: "resources/views/dosen/applyhibah/reviewapplyhibah.blade.php",
  pkmReview: "resources/views/dosen/applyhibah/reviewapplyhibahpkm.blade.php",
};

export const reviewerNavbarMenu = {
  left: [
    { label: "Home", path: "/" },
    { label: "Contact", path: "/about/kontak" },
    {
      label: "Reviewer",
      children: [
        {
          label: "Hibah",
          children: [
            { label: "Review Hibah", path: "/reviewer/hibah", legacyRouteName: "hibah.reviewerlists" },
          ],
        },
      ],
    },
    { label: "Logout", action: "logout" as const },
  ],
  right: [
    { key: "search", label: "Search" },
    { key: "notifications", label: "Notifications" },
    { key: "fullscreen", label: "Fullscreen" },
    { key: "control-sidebar", label: "Control Sidebar" },
  ],
};

export const reviewerSidebarMenu: ReviewerSidebarItem[] = [
  { label: "Dashboard", path: "/reviewer", icon: "LayoutDashboard" },
  {
    label: "Surat Tugas",
    icon: "FileSignature",
    children: [
      {
        label: "Daftar Ajuan ST",
        icon: "Circle",
        path: "/reviewer/surat-tugas",
        note: "Membuka daftar review surat tugas di shell reviewer React baru.",
      },
    ],
  },
  {
    label: "Hibah Internal",
    icon: "BookOpenCheck",
    children: [
      { label: "Penelitian", path: "/reviewer/hibah/penelitian", icon: "Circle", note: "Membuka halaman hibah penelitian di shell reviewer React baru." },
      { label: "Pengabdian", path: "/reviewer/hibah/pengabdian", icon: "Circle", note: "Membuka halaman hibah pengabdian di shell reviewer React baru." },
      { label: "Anggota Hibah", path: "/reviewer/hibah/anggota", icon: "Circle", note: "Membuka halaman anggota hibah di shell reviewer React baru." },
      { label: "Review Hibah", path: "/reviewer/hibah", icon: "Circle", highlight: true, legacyRouteName: "hibah.reviewerlists" },
    ],
  },
  {
    label: "Konferensi",
    icon: "Presentation",
    note: "Modul konferensi mengikuti flow dosen legacy dan belum punya halaman reviewer khusus.",
    children: [{ label: "List Konferensi", icon: "Circle", note: "Belum ada halaman reviewer khusus untuk konferensi di React baru." }],
  },
  {
    label: "Laporan Publikasi",
    icon: "BookMarked",
    children: [
      { label: "Artikel", icon: "Circle", path: "/reviewer/publikasi/artikel" },
      { label: "Buku", icon: "Circle", path: "/reviewer/publikasi/buku" },
      { label: "KI", icon: "Circle", path: "/reviewer/publikasi/haki" },
      { label: "Prototipe", icon: "Circle", path: "/reviewer/publikasi/prototipe" },
    ],
  },
  {
    label: "Laporan Kegiatan",
    icon: "ClipboardList",
    children: [
      { label: "Penelitian", icon: "Circle", path: "/reviewer/kegiatan/penelitian" },
      { label: "PKM", icon: "Circle", path: "/reviewer/kegiatan/pkm" },
    ],
  },
];

export const reviewerDashboardProfile = {
  name: "Dr. Maya Permata",
  rank: "Lektor",
  nidn: "0321128401",
  faculty: "Fakultas Teknologi Informasi",
  studyProgram: "Informatika",
  sintaId: "6712345",
  sintaUrl: "#",
  roadmapUrl: "#",
  focusSummary: "Artificial intelligence, sistem informasi, dan pemberdayaan digital.",
};

export const reviewerDashboardCards = [
  {
    id: "hutang-luaran",
    title: "Hutang Luaran Konferensi",
    value: 1,
    actionLabel: "Lihat Hutang",
    note: "Masih mengikuti pola small-box dashboard dosen legacy.",
  },
  {
    id: "hutang-keuangan",
    title: "Hutang Keuangan Konferensi",
    value: 0,
    actionLabel: "Lihat Hutang",
    note: "Masih mengikuti pola small-box dashboard dosen legacy.",
  },
  {
    id: "hutang-hibah",
    title: "Hutang Hibah",
    value: 2,
    actionLabel: "Lihat Hutang",
    path: "/reviewer/hibah",
  },
];

export const reviewerPenelitianRubrics: ReviewerRubric[] = [
  {
    id: "pen-01",
    question: "Kebaruan topik penelitian dan relevansinya terhadap tema hibah.",
    options: [
      { label: "Kurang", score: 5 },
      { label: "Cukup", score: 10 },
      { label: "Baik", score: 15 },
      { label: "Sangat baik", score: 20 },
    ],
  },
  {
    id: "pen-02",
    question: "Kejelasan rumusan masalah, tujuan, dan metodologi penelitian.",
    options: [
      { label: "Kurang", score: 5 },
      { label: "Cukup", score: 10 },
      { label: "Baik", score: 15 },
      { label: "Sangat baik", score: 20 },
    ],
  },
  {
    id: "pen-03",
    question: "Kelayakan luaran dan keterhubungan dengan roadmap universitas.",
    options: [
      { label: "Kurang", score: 5 },
      { label: "Cukup", score: 10 },
      { label: "Baik", score: 15 },
      { label: "Sangat baik", score: 20 },
    ],
  },
  {
    id: "pen-04",
    question: "Kecukupan anggaran terhadap rencana kegiatan yang diajukan.",
    options: [
      { label: "Kurang", score: 5 },
      { label: "Cukup", score: 10 },
      { label: "Baik", score: 15 },
      { label: "Sangat baik", score: 20 },
    ],
  },
];

export const reviewerPkmRubrics: ReviewerRubric[] = [
  {
    id: "pkm-01",
    question: "Kejelasan masalah mitra dan urgensi program pengabdian.",
    options: [
      { label: "Kurang", score: 5 },
      { label: "Cukup", score: 10 },
      { label: "Baik", score: 15 },
      { label: "Sangat baik", score: 20 },
    ],
  },
  {
    id: "pkm-02",
    question: "Kesesuaian metode pelaksanaan dengan kebutuhan sasaran.",
    options: [
      { label: "Kurang", score: 5 },
      { label: "Cukup", score: 10 },
      { label: "Baik", score: 15 },
      { label: "Sangat baik", score: 20 },
    ],
  },
  {
    id: "pkm-03",
    question: "Potensi keberlanjutan dan dampak program pada masyarakat.",
    options: [
      { label: "Kurang", score: 5 },
      { label: "Cukup", score: 10 },
      { label: "Baik", score: 15 },
      { label: "Sangat baik", score: 20 },
    ],
  },
  {
    id: "pkm-04",
    question: "Efisiensi dan kelayakan anggaran terhadap aktivitas PKM.",
    options: [
      { label: "Kurang", score: 5 },
      { label: "Cukup", score: 10 },
      { label: "Baik", score: 15 },
      { label: "Sangat baik", score: 20 },
    ],
  },
];

export const reviewerAssignments: ReviewerAssignment[] = [
  {
    assignmentId: "rvw-penelitian-001",
    hibahId: "HIBAH-PEN-001",
    encryptedHibahId: "encrypted-penelitian-001",
    type: "penelitian",
    typeLabel: "Penelitian",
    reviewYearLabel: "Genap 2025/2026",
    invitationDate: "12 Februari 2026",
    approvalStatus: "pending",
    reviewed: false,
    canReview: true,
    applicant: {
      name: "Dr. Reza Mahendra",
      rank: "Lektor Kepala",
      sintaId: "6123409",
      sintaUrl: "#",
      googleScholarLabel: "GS 320",
      googleScholarUrl: "#",
      researchFocus: ["Sistem cerdas", "Data analytics"],
      pkmFocus: ["Transformasi digital UMKM"],
    },
    hibahSummary: {
      kelompokSkema: "PDP",
      tahunUsulan: "2026",
      temaHibah: "Transformasi Digital",
      semester: "Genap",
      lamaKegiatan: "1 Semester",
      roadmapUniversitas: "Roadmap AI untuk pendidikan",
      risetFakultas: "Analitik data",
      risetTema: "Computer vision",
      temaProdi: "Kecerdasan buatan",
      subtemaProdi: "Computer vision applied",
      targetTkt: "TKT 4",
    },
    proposal: {
      title: "Pemanfaatan Computer Vision untuk Monitoring Kelas Cerdas",
      abstract:
        "Proposal penelitian fokus pada pemanfaatan model visi komputer untuk meningkatkan monitoring aktivitas belajar dan evaluasi proses pembelajaran.",
      blindProposalUrl: "#",
      blindDocumentUrl: "#",
    },
    outputs: [
      { journalName: "Jurnal Sistem Cerdas", url: "https://example.com/jurnal-sistem-cerdas" },
      { journalName: "Seminar Nasional AI", url: "https://example.com/seminar-ai" },
    ],
    budgets: [
      { group: "Bahan", component: "Dataset", item: "Lisensi data", unit: "paket", price: 2500000, volume: 1 },
      { group: "Peralatan", component: "Sensor", item: "Kamera", unit: "unit", price: 1750000, volume: 2 },
      { group: "Publikasi", component: "Artikel", item: "APC jurnal", unit: "paket", price: 3000000, volume: 1 },
    ],
    partners: [
      {
        picName: "Siska Putri",
        institution: "SMA Pradita",
        address: "BSD, Tangerang Selatan",
        email: "maya@example.com",
        country: "Indonesia",
        supportLetter: "Ada",
        fund: 5000000,
      },
    ],
    draftReview: {
      answers: {},
      notes: "",
      submitted: false,
    },
  },
  {
    assignmentId: "rvw-pkm-002",
    hibahId: "HIBAH-PKM-002",
    encryptedHibahId: "encrypted-pkm-002",
    type: "pkm",
    typeLabel: "PKM",
    reviewYearLabel: "Ganjil 2025/2026",
    invitationDate: "20 Februari 2026",
    approvalStatus: "terima",
    reviewed: true,
    canReview: true,
    applicant: {
      name: "Dr. Nisa Azzahra",
      rank: "Lektor",
      sintaId: "6543210",
      sintaUrl: "#",
      googleScholarLabel: "GS 285",
      googleScholarUrl: "#",
      researchFocus: ["Kewirausahaan digital"],
      pkmFocus: ["Pemberdayaan UMKM", "Desa binaan"],
    },
    hibahSummary: {
      kelompokSkema: "PKM Desa Binaan",
      tahunUsulan: "2026",
      temaHibah: "Pemberdayaan Masyarakat",
      semester: "Ganjil",
      lamaKegiatan: "1 Semester",
      roadmapUniversitas: "Inovasi sosial berbasis teknologi",
      risetFakultas: "Sistem informasi bisnis",
      risetTema: "Digitalisasi UMKM",
      temaProdi: "Kewirausahaan digital",
      subtemaProdi: "Pemasaran online desa binaan",
      targetTkt: "",
    },
    proposal: {
      title: "Digitalisasi Pemasaran Produk Desa melalui Pendampingan Marketplace",
      abstract:
        "Proposal PKM berfokus pada peningkatan kapasitas masyarakat desa binaan dalam pemasaran digital, pencatatan usaha, dan strategi promosi berbasis marketplace.",
      blindProposalUrl: "#",
      blindDocumentUrl: "#",
    },
    outputs: [{ journalName: "Jurnal Pengabdian Masyarakat", url: "https://example.com/jurnal-pkm" }],
    budgets: [
      { group: "Pelatihan", component: "Workshop", item: "Modul pelatihan", unit: "paket", price: 1500000, volume: 1 },
      { group: "Operasional", component: "Transport", item: "Transport tim", unit: "perjalanan", price: 500000, volume: 4 },
    ],
    partners: [
      {
        picName: "Novi Anggraini",
        institution: "BUMDes Sejahtera",
        address: "Kabupaten Bogor",
        email: "bumdes@example.com",
        country: "Indonesia",
        supportLetter: "Ada",
        fund: 3000000,
      },
    ],
    draftReview: {
      answers: {
        "pkm-01": 15,
        "pkm-02": 15,
        "pkm-03": 20,
        "pkm-04": 15,
      },
      notes:
        "Program sangat relevan dengan kebutuhan desa. Perlu penajaman indikator keberhasilan tiap fase pendampingan.",
      submitted: true,
    },
  },
];

export const reviewerControlSidebarSections = [
  {
    label: "Aksi Reviewer",
    children: [
      "Terima undangan review",
      "Tolak undangan review",
      "Lihat proposal blind",
      "Lihat dokumen blind",
      "Pilih skor per rubrik",
      "Isi catatan reviewer",
      "Submit hasil review",
    ],
  },
  {
    label: "Catatan Migrasi",
    children: [
      "Role reviewer memakai shell dosen, bukan shell administrator.",
      "Menu reviewer muncul di navbar, bukan sidebar.",
      "Tab review hanya tampil bila status persetujuan reviewer adalah terima.",
      "Submit form review membuat record baru atau update record lama berdasarkan hidden field sudahreview.",
      "Masa review dikendalikan fungsi bolehreview().",
    ],
  },
];

export const reviewerExcludedModules = [
  {
    route: "reviewsurattugasindex",
    ownerRole: "lppm",
    note: "Halaman review surat tugas ada di layout dashboard dan bukan menu reviewer pada navbar dosen.",
  },
  {
    route: "review.reviewkegiatanindex",
    ownerRole: "lppm/kordinator-riset/ketua-lppm",
    note: "Review laporan kegiatan per periode milik role pengelola, bukan reviewer hibah.",
  },
  {
    route: "review.reviewpublikasiindex",
    ownerRole: "lppm/kordinator-publikasi/ketua-lppm",
    note: "Review laporan publikasi per periode milik pengelola publikasi.",
  },
];

export function findReviewerAssignmentById(id: string | undefined) {
  if (!id) return reviewerAssignments[0] ?? null;
  return (
    reviewerAssignments.find(
      (assignment) =>
        assignment.assignmentId === id ||
        assignment.hibahId === id ||
        assignment.encryptedHibahId === id,
    ) ?? reviewerAssignments[0] ?? null
  );
}

export function getReviewerRubrics(type: ReviewerAssignment["type"]) {
  return type === "pkm" ? reviewerPkmRubrics : reviewerPenelitianRubrics;
}
