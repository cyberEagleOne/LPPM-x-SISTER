import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { HomePageUnified } from "./pages/HomePageUnified";
import { ArticleListPage } from "./pages/ArticleListPage";
import { ArticleDetailPage } from "./pages/ArticleDetailPage";
import { AboutPage } from "./pages/AboutPage";
import { RisetPage } from "./pages/RisetPage";
import { PublikasiPage } from "./pages/PublikasiPage";
import { UnduhBerkasPage } from "./pages/UnduhBerkasPage";
import { ProgramKosabangsa } from "./pages/ProgramKosabangsa";
import { NotFoundPage } from "./pages/NotFoundPage";
import { LoginPageUnified } from "./pages/LoginPageUnified";
import { RegisterPageUnified } from "./pages/RegisterPageUnified";

// Admin imports
import { AdminLayout } from "./admin/components/AdminLayout";
import { ReviewerLayout } from "./admin/components/ReviewerLayout";
import { Dashboard } from "./admin/pages/Dashboard";
import { UserManagement } from "./admin/pages/UserManagement";
import { UserDetail } from "./admin/pages/UserDetail";
import { RolesPermissionsPage } from "./admin/pages/RolesPermissions";
import { FakultasPage, ProdiPage, PejabatPage, GroupReferencePage, NilaiReferencePage } from "./admin/pages/ReferencePage";
import { SuratTugasPage } from "./admin/pages/SuratTugasPage";
import { PublikasiPengajuanPage } from "./admin/pages/PublikasiPengajuanPage";
import { ExportDataPage } from "./admin/pages/LaporanPages";
import { NotifikasiPage } from "./admin/pages/NotifikasiPage";
import { ProfilePage } from "./admin/pages/ProfilePage";
import { SettingsPage } from "./admin/pages/SettingsPage";
import { AuditLogPage } from "./admin/pages/AuditLogPage";
import { ActivityLogPage } from "./admin/pages/ActivityLogPage";
import { RoleMatrixPage } from "./admin/pages/RoleMatrixPage";
import { ReportingPage } from "./admin/pages/ReportingPage";
import { HRDPage } from "./admin/pages/HRDPage";
import { ProfileCompletionPage } from "./admin/pages/ProfileCompletionPage";
import { CertificatePage } from "./admin/pages/CertificatePage";
import { Error401, Error403, Error404Admin, Error419, Error500 } from "./admin/pages/ErrorPages";

import { InsentifPage } from "./admin/pages/InsentifPage";
import { PeriodeAjuanPage } from "./admin/pages/PeriodeAjuanPage";
import { SkemaRisetPage } from "./admin/pages/SkemaRisetPage";
import { HakiPage } from "./admin/pages/HakiPage";
import { ArtikelAdminPage } from "./admin/pages/ArtikelAdminPage";

// Reviewer pages
import { ReviewerDashboardPage } from "./admin/pages/reviewer/ReviewerDashboardPage";
import { ReviewerHibahListModern } from "./admin/pages/reviewer/ReviewerHibahListModern";
import { ReviewHibahSharedPage } from "./admin/pages/reviewer/ReviewHibahSharedPage";
import { ReviewQuizPKM } from "./admin/pages/reviewer/ReviewQuizPKM";
import { LaporanReviewHibah } from "./admin/pages/reviewer/LaporanReviewHibah";
import { ReviewSTIndex } from "./admin/pages/reviewer/ReviewSTIndex";
import { ReviewSTDetail } from "./admin/pages/reviewer/ReviewSTDetail";
import {
  ReviewKegiatanIndex,
  ReviewKegiatanList,
  ReviewPublikasiIndex,
  ReviewPublikasiList,
} from "./admin/pages/reviewer/ReviewKegiatanPublikasi";

// Dosen-specific pages
import { DosenKonferensiPage } from "./admin/pages/DosenKonferensiPage";
import { DosenPublikasiPage } from "./admin/pages/publikasi/DosenPublikasiPage";
import { DosenKegiatanPage } from "./admin/pages/DosenKegiatanPage";

// New Hibah pages
import { HibahInternalPage } from "./admin/pages/HibahInternalPage";
import { HibahFormPage } from "./admin/pages/HibahFormPage";
import { HibahViewPage } from "./admin/pages/HibahViewPage";
import { HibahRevisiPage } from "./admin/pages/HibahRevisiPage";
import { HibahPemenangPage } from "./admin/pages/HibahPemenangPage";
import { AnggotaHibahListPage } from "./admin/pages/AnggotaHibahListPage";
import { AnggotaHibahDetailPage } from "./admin/pages/AnggotaHibahDetailPage";

export const router = createBrowserRouter([
  // Public website
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: HomePageUnified },
      { path: "artikel", Component: ArticleListPage },
      { path: "artikel/:id", Component: ArticleDetailPage },
      { path: "about/:section", Component: AboutPage },
      { path: "about", Component: AboutPage },
      { path: "riset/:section", Component: RisetPage },
      { path: "riset", Component: RisetPage },
      { path: "publikasi/:section", Component: PublikasiPage },
      { path: "publikasi", Component: PublikasiPage },
      { path: "unduh-berkas", Component: UnduhBerkasPage },
      { path: "program/kosabangsa", Component: ProgramKosabangsa },
      { path: "*", Component: NotFoundPage },
    ],
  },
  // Login
  {
    path: "/login",
    Component: LoginPageUnified,
  },
  // Register
  {
    path: "/register",
    Component: RegisterPageUnified,
  },
  // Admin panel
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      { index: true, Component: Dashboard },
      // Master Data
      { path: "users", Component: UserManagement },
      { path: "users/:id", Component: UserDetail },
      { path: "roles", element: <RolesPermissionsWrapper tab="roles" /> },
      { path: "permissions", element: <RolesPermissionsWrapper tab="permissions" /> },
      { path: "role-matrix", element: <RolesPermissionsWrapper tab="matrix" /> },
      { path: "access-matrix", Component: RoleMatrixPage },
      // Referensi
      { path: "fakultas", Component: FakultasPage },
      { path: "prodi", Component: ProdiPage },
      { path: "pejabat", Component: PejabatPage },
      { path: "group-reference", Component: GroupReferencePage },
      { path: "nilai-reference", Component: NilaiReferencePage },
      { path: "skema-riset", Component: SkemaRisetPage },
      // Pengajuan Hibah Internal
      { path: "hibah", Component: HibahInternalPage },
      { path: "hibah/penelitian", element: <HibahInternalPage jenis="penelitian" /> },
      { path: "hibah/pengabdian", element: <HibahInternalPage jenis="pengabdian" /> },
      { path: "hibah/new", Component: HibahFormPage },
      { path: "hibah/edit/:id", element: <HibahFormPage mode="edit" /> },
      { path: "hibah/view/:id", Component: HibahViewPage },
      { path: "hibah/revisi/:id", Component: HibahRevisiPage },
      { path: "hibah/pemenang/:id", Component: HibahPemenangPage },
      { path: "hibah/anggota", Component: AnggotaHibahListPage },
      { path: "hibah/anggota/detail/:id", Component: AnggotaHibahDetailPage },
      { path: "hibah/laporan-review/:id", Component: LaporanReviewHibah },
      // Surat Tugas
      { path: "surat-tugas", Component: SuratTugasPage },
      // HAKI
      { path: "haki", Component: HakiPage },
      // Insentif Publikasi
      { path: "insentif", Component: InsentifPage },
      { path: "insentif/ajukan", Component: InsentifPage },
      { path: "insentif/saya", Component: InsentifPage },
      { path: "insentif/prodi", Component: InsentifPage },
      { path: "insentif/submitted", Component: InsentifPage },
      { path: "insentif/alokasi", Component: InsentifPage },
      { path: "insentif/finalisasi", Component: InsentifPage },
      // Periode Ajuan
      { path: "periode-ajuan", Component: PeriodeAjuanPage },
      // Konferensi
      { path: "konferensi", Component: DosenKonferensiPage },
      // Publikasi
      { path: "publikasi-pengajuan", Component: PublikasiPengajuanPage },
      // Laporan Kegiatan (Dosen CRUD)
      { path: "laporan-kegiatan", Component: DosenKegiatanPage },
      { path: "laporan-kegiatan/penelitian", element: <DosenKegiatanPage jenisParam="penelitian" /> },
      { path: "laporan-kegiatan/pkm", element: <DosenKegiatanPage jenisParam="pkm" /> },
      // Laporan Publikasi (Dosen CRUD)
      { path: "laporan-publikasi", Component: DosenPublikasiPage },
      { path: "laporan-publikasi/artikel", element: <DosenPublikasiPage key="artikel" jenisParam="artikel" /> },
      { path: "laporan-publikasi/buku", element: <DosenPublikasiPage key="buku" jenisParam="buku" /> },
      { path: "laporan-publikasi/ki", element: <DosenPublikasiPage key="haki" jenisParam="haki" /> },
      { path: "laporan-publikasi/prototipe", element: <DosenPublikasiPage key="prototipe" jenisParam="prototipe" /> },
      { path: "export", Component: ExportDataPage },
      // Manajemen Konten
      { path: "artikel-admin", Component: ArtikelAdminPage },
      // Notifikasi & Profile
      { path: "notifikasi", Component: NotifikasiPage },
      { path: "profile", Component: ProfilePage },
      // Sistem
      { path: "settings", Component: SettingsPage },
      { path: "audit-log", Component: AuditLogPage },
      { path: "activity-log", Component: ActivityLogPage },
      // Reporting & Tools
      { path: "reporting", Component: ReportingPage },
      { path: "hrd", Component: HRDPage },
      { path: "profil-akademik", Component: ProfileCompletionPage },
      { path: "certificate", Component: CertificatePage },
      // Error pages
      { path: "403", Component: Error403 },
      { path: "419", Component: Error419 },
      { path: "500", Component: Error500 },
      // Admin 404
      { path: "*", Component: Error404Admin },
    ],
  },
  // Reviewer routes
  {
    path: "/reviewer",
    Component: ReviewerLayout,
    children: [
      { index: true, Component: ReviewerDashboardPage },
      { path: "profile", Component: ProfilePage },
      { path: "notifikasi", Component: NotifikasiPage },
      // Review Hibah
      { path: "hibah", Component: ReviewerHibahListModern },
      { path: "hibah/penelitian", element: <HibahInternalPage jenis="penelitian" /> },
      { path: "hibah/pengabdian", element: <HibahInternalPage jenis="pengabdian" /> },
      { path: "hibah/anggota", Component: AnggotaHibahListPage },
      { path: "hibah/anggota/detail/:id", Component: AnggotaHibahDetailPage },
      { path: "hibah/view/:id", Component: HibahViewPage },
      { path: "hibah/revisi/:id", Component: HibahRevisiPage },
      { path: "hibah/pemenang/:id", Component: HibahPemenangPage },
      { path: "hibah/penelitian/:id", element: <ReviewHibahSharedPage type="penelitian" /> },
      { path: "hibah/pkm/:id", element: <ReviewHibahSharedPage type="pkm" /> },
      { path: "hibah/laporan-review/:id", Component: LaporanReviewHibah },
      { path: "hibah/laporan/:id", Component: LaporanReviewHibah },
      { path: "quiz-pkm/:id", Component: ReviewQuizPKM },
      // Review Surat Tugas
      { path: "surat-tugas", Component: ReviewSTIndex },
      { path: "surat-tugas/:id", Component: ReviewSTDetail },
      // Review Kegiatan
      { path: "kegiatan/:jenis", Component: ReviewKegiatanIndex },
      { path: "kegiatan/:pid/:jenis", Component: ReviewKegiatanList },
      // Review Publikasi
      { path: "publikasi/:jenis", Component: ReviewPublikasiIndex },
      { path: "publikasi/:pid/:jenis", Component: ReviewPublikasiList },
    ],
  },
  // Standalone error pages
  { path: "/401", Component: Error401 },
  { path: "/403", Component: Error403 },
  { path: "/419", Component: Error419 },
  { path: "/500", Component: Error500 },
]);

// Wrapper for RolesPermissionsPage because it needs a prop
function RolesPermissionsWrapper({ tab }: { tab: "roles" | "permissions" | "matrix" }) {
  return <RolesPermissionsPage tab={tab} />;
}
