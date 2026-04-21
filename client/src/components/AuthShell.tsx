import { Link } from "react-router";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { BrandLogo } from "./BrandLogo";

interface AuthShellProps {
  backTo: string;
  backLabel: string;
  title: string;
  subtitle: string;
  asideTitle?: string;
  asideDescription?: string;
  asideImage: string;
  asideBadge?: string;
  footerNote?: ReactNode;
  children: ReactNode;
}

export function AuthShell({
  backTo,
  backLabel,
  title,
  subtitle,
  asideTitle,
  asideDescription,
  asideImage,
  asideBadge = "SIPPM Workspace",
  footerNote,
  children,
}: AuthShellProps) {
  return (
    <div className="app-shell flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="app-auth-shell mx-auto w-full max-w-6xl overflow-hidden">
        <div className="grid min-h-[680px] lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)]">
          <div className="relative flex flex-col bg-white px-6 py-6 sm:px-10 sm:py-8 lg:px-12">
            <div className="mb-10 flex items-start justify-between gap-4">
              <Link
                to="/"
                className="inline-flex items-center rounded-2xl border border-transparent p-1 transition hover:bg-slate-50"
              >
                <BrandLogo size="md" />
              </Link>
              <Link
                to={backTo}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--app-border)] bg-white px-4 py-2 text-sm font-semibold text-slate-500 transition hover:border-[var(--app-border-strong)] hover:text-[var(--app-heading)]"
              >
                <ArrowLeft className="h-4 w-4" />
                {backLabel}
              </Link>
            </div>

            <div className="mb-8 space-y-3">
              <span className="app-eyebrow">Access Portal</span>
              <div>
                <h1 className="app-title-md">{title}</h1>
                <p className="app-subtitle mt-3 max-w-xl text-sm sm:text-base">{subtitle}</p>
              </div>
            </div>

            <div className="flex-1">{children}</div>

            {footerNote ? (
              <div className="mt-8 border-t border-[var(--app-border)] pt-5 text-sm text-slate-500">
                {footerNote}
              </div>
            ) : null}
          </div>

          <aside className="app-auth-aside relative hidden overflow-hidden lg:flex">
            <img
              src={asideImage}
              alt="Pradita University"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.18)_0%,rgba(15,23,42,0.76)_100%)]" />
            <div className="relative z-10 flex h-full flex-col justify-between p-8 xl:p-10">
              <span className="inline-flex w-fit items-center rounded-full border border-white/18 bg-white/12 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/90 backdrop-blur-md">
                {asideBadge}
              </span>

              {asideTitle || asideDescription ? (
                <div className="space-y-5">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-white/18 bg-white/14 backdrop-blur-md">
                    <BrandLogo tone="light" size="sm" compact />
                  </div>
                  <div className="max-w-md space-y-4">
                    {asideTitle ? (
                      <h2 className="text-3xl font-semibold leading-tight tracking-[-0.03em] text-white">
                        {asideTitle}
                      </h2>
                    ) : null}
                    {asideDescription ? (
                      <p className="text-base leading-7 text-slate-200">{asideDescription}</p>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
