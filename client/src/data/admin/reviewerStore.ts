import type { ReviewerAssignment, ReviewerDraftReview } from "../config/reviewerRoleConfig";
import { normalizeMockValue } from "./mockNameMap";

export interface ReviewerDashboardProfile {
  name: string;
  rank: string;
  nidn: string;
  faculty: string;
  studyProgram: string;
  sintaId: string;
  sintaUrl: string;
  roadmapUrl: string;
  focusSummary: string;
}

export interface ReviewerDashboardCard {
  id: string;
  title: string;
  value: number;
  actionLabel: string;
  note?: string;
  path?: string;
}

const STORAGE_KEYS = {
  dashboardProfile: "lppm-pradita.reviewer.dashboard-profile.v1",
  dashboardCards: "lppm-pradita.reviewer.dashboard-cards.v1",
  assignments: "lppm-pradita.reviewer.assignments.v1",
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

function matchesAssignmentId(assignment: ReviewerAssignment, id: string | undefined) {
  if (!id) return false;
  return (
    assignment.assignmentId === id ||
    assignment.hibahId === id ||
    assignment.encryptedHibahId === id
  );
}

export const DEFAULT_REVIEWER_DASHBOARD_PROFILE: ReviewerDashboardProfile = {
  name: "Dr. Maya Permata",
  rank: "Lektor",
  nidn: "0321128401",
  faculty: "Fakultas Teknologi Informasi",
  studyProgram: "Informatika",
  sintaId: "6712345",
  sintaUrl: "https://sinta.kemdikbud.go.id/authors/profile/6712345",
  roadmapUrl: "https://example.com/roadmap-reviewer-pradita",
  focusSummary: "Artificial intelligence, sistem informasi, dan pemberdayaan digital.",
};

export const DEFAULT_REVIEWER_DASHBOARD_CARDS: ReviewerDashboardCard[] = [
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

export const DEFAULT_REVIEWER_ASSIGNMENTS: ReviewerAssignment[] = [
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
      sintaUrl: "https://sinta.kemdikbud.go.id/authors/profile/6123409",
      googleScholarLabel: "GS 320",
      googleScholarUrl: "https://scholar.google.com/citations?user=reviewer-penelitian-320",
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
      blindProposalUrl: "https://example.com/#blind-proposal-penelitian",
      blindDocumentUrl: "https://example.com/#blind-document-penelitian",
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
        supportLetter: "https://example.com/surat-dukungan-mitra-penelitian.pdf",
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
      sintaUrl: "https://sinta.kemdikbud.go.id/authors/profile/6543210",
      googleScholarLabel: "GS 285",
      googleScholarUrl: "https://scholar.google.com/citations?user=reviewer-pkm-285",
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
      blindProposalUrl: "https://example.com/#blind-proposal-pkm",
      blindDocumentUrl: "https://example.com/#blind-document-pkm",
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
        supportLetter: "https://example.com/surat-dukungan-mitra-pkm.pdf",
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

export function getReviewerDashboardProfile() {
  const profile = readStorage(STORAGE_KEYS.dashboardProfile, DEFAULT_REVIEWER_DASHBOARD_PROFILE);
  return {
    ...profile,
    sintaUrl:
      profile.sintaUrl && profile.sintaUrl !== "#"
        ? profile.sintaUrl
        : DEFAULT_REVIEWER_DASHBOARD_PROFILE.sintaUrl,
  };
}

export function saveReviewerDashboardProfile(profile: ReviewerDashboardProfile) {
  writeStorage(STORAGE_KEYS.dashboardProfile, profile);
}

export function getReviewerDashboardCards() {
  return readStorage(STORAGE_KEYS.dashboardCards, DEFAULT_REVIEWER_DASHBOARD_CARDS);
}

export function saveReviewerDashboardCards(cards: ReviewerDashboardCard[]) {
  writeStorage(STORAGE_KEYS.dashboardCards, cards);
}

export function getReviewerAssignments() {
  const assignments = readStorage(STORAGE_KEYS.assignments, DEFAULT_REVIEWER_ASSIGNMENTS);
  const defaultsById = Object.fromEntries(
    DEFAULT_REVIEWER_ASSIGNMENTS.map((assignment) => [assignment.assignmentId, assignment]),
  );

  return assignments.map((assignment) => {
    const fallback = defaultsById[assignment.assignmentId];
    if (!fallback) return assignment;

    return {
      ...assignment,
      applicant: {
        ...fallback.applicant,
        ...assignment.applicant,
        sintaUrl:
          assignment.applicant.sintaUrl && assignment.applicant.sintaUrl !== "#"
            ? assignment.applicant.sintaUrl
            : fallback.applicant.sintaUrl,
        googleScholarUrl:
          assignment.applicant.googleScholarUrl && assignment.applicant.googleScholarUrl !== "#"
            ? assignment.applicant.googleScholarUrl
            : fallback.applicant.googleScholarUrl,
      },
      proposal: {
        ...fallback.proposal,
        ...assignment.proposal,
        blindProposalUrl:
          assignment.proposal.blindProposalUrl && assignment.proposal.blindProposalUrl !== "#"
            ? assignment.proposal.blindProposalUrl
            : fallback.proposal.blindProposalUrl,
        blindDocumentUrl:
          assignment.proposal.blindDocumentUrl && assignment.proposal.blindDocumentUrl !== "#"
            ? assignment.proposal.blindDocumentUrl
            : fallback.proposal.blindDocumentUrl,
      },
      partners: assignment.partners.map((partner, index) => {
        const fallbackPartner = fallback.partners[index];
        return {
          ...fallbackPartner,
          ...partner,
          supportLetter:
            partner.supportLetter &&
            partner.supportLetter !== "#" &&
            partner.supportLetter.toLowerCase() !== "ada"
              ? partner.supportLetter
              : fallbackPartner?.supportLetter ?? partner.supportLetter,
        };
      }),
    };
  });
}

export function saveReviewerAssignments(assignments: ReviewerAssignment[]) {
  writeStorage(STORAGE_KEYS.assignments, assignments);
}

export function findReviewerAssignmentById(id: string | undefined) {
  const assignments = getReviewerAssignments();
  if (!id) return assignments[0] ?? null;
  return (
    assignments.find((assignment) => matchesAssignmentId(assignment, id)) ??
    assignments[0] ??
    null
  );
}

export function updateReviewerAssignment(
  id: string | undefined,
  updater: (assignment: ReviewerAssignment) => ReviewerAssignment,
) {
  if (!id) return null;
  const currentAssignments = getReviewerAssignments();
  let updatedAssignment: ReviewerAssignment | null = null;

  const nextAssignments = currentAssignments.map((assignment) => {
    if (!matchesAssignmentId(assignment, id)) return assignment;
    const nextAssignment = updater(assignment);
    updatedAssignment = nextAssignment;
    return nextAssignment;
  });

  if (!updatedAssignment) return null;
  saveReviewerAssignments(nextAssignments);
  return cloneData(updatedAssignment);
}

export function updateReviewerAssignmentApprovalStatus(
  id: string | undefined,
  approvalStatus: ReviewerAssignment["approvalStatus"],
) {
  return updateReviewerAssignment(id, (assignment) => ({
    ...assignment,
    approvalStatus,
  }));
}

export function saveReviewerAssignmentDraftReview(
  id: string | undefined,
  draftReview: ReviewerDraftReview,
) {
  return updateReviewerAssignment(id, (assignment) => ({
    ...assignment,
    reviewed: draftReview.submitted ? true : assignment.reviewed,
    draftReview,
  }));
}
