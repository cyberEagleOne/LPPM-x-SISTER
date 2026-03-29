import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { AdminSidebar } from "./AdminSidebar";
import { Topbar } from "./Topbar";
import { useAuth } from "../context/AuthContext";
import { ToastProvider } from "./Toast";
import { SessionExpiry } from "./SessionExpiry";
import { Error403 } from "../pages/ErrorPages";
import { canAccessAdminPath } from "../config/routeAccess";

export function AdminLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    setMobileOpen(false);
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  const handleMenuToggle = () => {
    if (window.innerWidth >= 1024) {
      setSidebarCollapsed((current) => !current);
      return;
    }

    setMobileOpen((current) => !current);
  };

  if (!isAuthenticated) return null;

  if (user && !canAccessAdminPath(user.role, location.pathname)) {
    return <Error403 />;
  }

  return (
    <ToastProvider>
      <div className="legacy-admin-shell flex h-screen overflow-hidden">
        <AdminSidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <Topbar onMenuToggle={handleMenuToggle} />
          <main className="legacy-content volt-shell-main flex-1 overflow-y-auto p-4 lg:p-6 xl:p-7">
            <Outlet />
          </main>
          <footer className="volt-shell-footer shrink-0 px-6 py-3">
            <p className="text-center text-xs text-slate-500">
              &copy; 2026 LPPM Pradita University. Unified workspace theme for public, admin, dosen, dan reviewer.
            </p>
          </footer>
        </div>
      </div>
      <SessionExpiry />
    </ToastProvider>
  );
}
