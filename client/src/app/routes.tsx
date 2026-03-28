import { createBrowserRouter } from "react-router";
import { PublicLayout } from "./components/PublicLayout";
import { DashboardLayout } from "./components/DashboardLayout";
import { HomePage } from "./pages/HomePage";
import { AboutPage } from "./pages/AboutPage";
import { ArtikelPage } from "./pages/ArtikelPage";
import { ArtikelDetailPage } from "./pages/ArtikelDetailPage";
import { PublikasiPage } from "./pages/PublikasiPage";
import { PublikasiDetailPage } from "./pages/PublikasiDetailPage";
import { LoginPage } from "./pages/LoginPage";
import { DosenDashboard } from "./pages/dosen/DosenDashboard";
import { TambahPenelitian } from "./pages/dosen/TambahPenelitian";
import { DosenProfile } from "./pages/dosen/DosenProfile";
import { ReviewerPage } from "./pages/reviewer/ReviewerPage";
import { ReviewerPending } from "./pages/reviewer/ReviewerPending";
import { ReviewerApproved } from "./pages/reviewer/ReviewerApproved";
import { ReviewerRejected } from "./pages/reviewer/ReviewerRejected";
import { ReviewerProfile } from "./pages/reviewer/ReviewerProfile";
import { ReviewerResearchDetailPage } from "./pages/reviewer/ReviewerResearchDetailPage";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminUsers } from "./pages/admin/AdminUsers";
import { AdminArtikel } from "./pages/admin/AdminArtikel";
import { AdminArtikelBuat } from "./pages/admin/AdminArtikelBuat";
import { AdminProfile } from "./pages/admin/AdminProfile";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: PublicLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "about", Component: AboutPage },
      { path: "artikel", Component: ArtikelPage },
      { path: "artikel/:id", Component: ArtikelDetailPage },
      { path: "publikasi", Component: PublikasiPage },
      { path: "publikasi/:id", Component: PublikasiDetailPage },
    ],
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/dosen",
    element: <DashboardLayout role="dosen" />,
    children: [
      { index: true, Component: DosenDashboard },
      { path: "tambah", Component: TambahPenelitian },
      { path: "profile", Component: DosenProfile },
    ],
  },
  {
    path: "/reviewer",
    element: <DashboardLayout role="reviewer" />,
    children: [
      { index: true, Component: ReviewerPage },
      { path: "pending", Component: ReviewerPending },
      { path: "approved", Component: ReviewerApproved },
      { path: "rejected", Component: ReviewerRejected },
      { path: "profile", Component: ReviewerProfile },
      { path: "penelitian/:id", Component: ReviewerResearchDetailPage },
    ],
  },
  {
    path: "/admin",
    element: <DashboardLayout role="admin" />,
    children: [
      { index: true, Component: AdminDashboard },
      { path: "users", Component: AdminUsers },
      { path: "artikel", Component: AdminArtikel },
      { path: "artikel/buat", Component: AdminArtikelBuat },
      { path: "profile", Component: AdminProfile },
    ],
  },
]);
