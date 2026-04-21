import { useMemo } from "react";
import { ArrowUpRight, ClipboardCheck, ExternalLink, UserRound } from "lucide-react";
import { PageWrapper } from "../../components/admin/PageWrapper";
import { useToast } from "../../components/admin/Toast";
import { useNavigate } from "react-router";
import {
  getReviewerDashboardCards,
  getReviewerDashboardProfile,
  type ReviewerDashboardCard,
} from "../../data/admin/reviewerStore";

export function ReviewerDashboardPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const reviewerDashboardProfile = useMemo(() => getReviewerDashboardProfile(), []);
  const reviewerDashboardCards = useMemo(() => getReviewerDashboardCards(), []);

  const initials = useMemo(
    () =>
      reviewerDashboardProfile.name
        .split(" ")
        .slice(0, 2)
        .map((part) => part.charAt(0))
        .join("")
        .toUpperCase(),
    [reviewerDashboardProfile.name],
  );

  const handleCardAction = (card: ReviewerDashboardCard) => {
    if (card.path) {
      navigate(card.path);
      return;
    }

    showToast(card.note || `Modul "${card.title}" masih mengikuti dashboard reviewer legacy.`, "info");
  };

  return (
    <PageWrapper
      title="Dashboard Reviewer"
      breadcrumbs={[{ label: "Reviewer" }, { label: "Dashboard" }]}
    >
      <div className="space-y-6">
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 px-6 py-5">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-400" style={{ fontWeight: 700 }}>
              Reviewer Profile
            </p>
            <h2 className="mt-2 text-2xl text-slate-900" style={{ fontWeight: 700 }}>
              {reviewerDashboardProfile.name}
            </h2>
          </div>

          <div className="grid gap-6 px-6 py-6 md:grid-cols-[auto_minmax(0,1fr)] md:items-start">
            <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-blue-600 text-3xl text-white shadow-sm">
              {initials || <UserRound className="h-8 w-8" />}
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Jabatan</p>
                  <p className="mt-1 text-sm text-slate-900" style={{ fontWeight: 700 }}>
                    {reviewerDashboardProfile.rank}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-400">NIDN</p>
                  <p className="mt-1 text-sm text-slate-900" style={{ fontWeight: 700 }}>
                    {reviewerDashboardProfile.nidn}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Fakultas</p>
                  <p className="mt-1 text-sm text-slate-900" style={{ fontWeight: 700 }}>
                    {reviewerDashboardProfile.faculty}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Program Studi</p>
                  <p className="mt-1 text-sm text-slate-900" style={{ fontWeight: 700 }}>
                    {reviewerDashboardProfile.studyProgram}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={reviewerDashboardProfile.sintaUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#E30613] px-4 py-2.5 text-sm text-white"
                  style={{ fontWeight: 600 }}
                >
                  Sinta {reviewerDashboardProfile.sintaId} <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {reviewerDashboardCards.map((card) => (
            <div key={card.id} className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-400" style={{ fontWeight: 700 }}>
                    {card.title}
                  </p>
                  <p className="mt-3 text-3xl text-slate-900" style={{ fontWeight: 700 }}>
                    {card.value}
                  </p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100">
                  <ClipboardCheck className="h-5 w-5 text-slate-700" />
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleCardAction(card)}
                className="mt-6 inline-flex items-center gap-2 text-sm text-blue-600"
                style={{ fontWeight: 600 }}
              >
                {card.actionLabel} <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          ))}
        </section>
      </div>
    </PageWrapper>
  );
}
