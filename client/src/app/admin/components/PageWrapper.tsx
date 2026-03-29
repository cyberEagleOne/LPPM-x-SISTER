import { type ReactNode } from "react";
import { ChevronRight, Home } from "lucide-react";
import { Link, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface PageWrapperProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
  children: ReactNode;
}

export function PageWrapper({ title, subtitle, breadcrumbs, actions, children }: PageWrapperProps) {
  const location = useLocation();
  const { user } = useAuth();
  const homePath =
    location.pathname.startsWith("/reviewer") || user?.role === "reviewer" ? "/reviewer" : "/admin";

  return (
    <div className="space-y-7">
      <div className="legacy-page-header flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0">
          {breadcrumbs && breadcrumbs.length > 0 ? (
            <nav className="legacy-breadcrumb mb-2 flex flex-wrap items-center gap-1.5">
              <Link to={homePath} className="inline-flex h-7 w-7 items-center justify-center rounded-md">
                <Home className="h-3.5 w-3.5" />
              </Link>
              {breadcrumbs.map((crumb, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  <ChevronRight className="h-3 w-3 text-slate-400" />
                  {crumb.path ? (
                    <Link to={crumb.path}>{crumb.label}</Link>
                  ) : (
                    <span className="text-slate-700" style={{ fontWeight: 600 }}>
                      {crumb.label}
                    </span>
                  )}
                </span>
              ))}
            </nav>
          ) : null}

          <h1 className="text-[1.65rem] leading-tight text-slate-900 tracking-[-0.02em]" style={{ fontWeight: 700 }}>
            {title}
          </h1>
          {subtitle ? <p className="legacy-muted mt-2 max-w-3xl text-[0.95rem] leading-7">{subtitle}</p> : null}
        </div>

        {actions ? (
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {actions}
          </div>
        ) : null}
      </div>

      <div className="space-y-7">
        {children}
      </div>
    </div>
  );
}
