import { useMemo, useState } from "react";
import { Eye, Search, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router";
import { PageWrapper } from "../../components/admin/PageWrapper";
import { getReviewerAssignments } from "../../data/admin/reviewerStore";

type SortKey = "invitationDate" | "typeLabel" | "approvalStatus" | "reviewed";

const APPROVAL_BADGE = {
  pending: "bg-amber-100 text-amber-700",
  terima: "bg-green-100 text-green-700",
  tolak: "bg-red-100 text-red-700",
} as const;

function getAssignmentPath(assignmentId: string, type: "penelitian" | "pkm") {
  return type === "penelitian"
    ? `/reviewer/hibah/penelitian/${assignmentId}`
    : `/reviewer/hibah/pkm/${assignmentId}`;
}

export function ReviewerHibahListModern() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("invitationDate");
  const [page, setPage] = useState(1);
  const perPage = 10;
  const reviewerAssignments = useMemo(() => getReviewerAssignments(), []);

  const filtered = useMemo(() => {
    const lowered = search.trim().toLowerCase();

    const items = reviewerAssignments.filter((assignment) => {
      if (!lowered) return true;
      return `${assignment.proposal.title} ${assignment.applicant.name} ${assignment.typeLabel}`
        .toLowerCase()
        .includes(lowered);
    });

    return [...items].sort((a, b) => {
      if (sortKey === "typeLabel") return a.typeLabel.localeCompare(b.typeLabel);
      if (sortKey === "approvalStatus") return a.approvalStatus.localeCompare(b.approvalStatus);
      if (sortKey === "reviewed") return Number(b.reviewed) - Number(a.reviewed);
      return b.invitationDate.localeCompare(a.invitationDate);
    });
  }, [reviewerAssignments, search, sortKey]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <PageWrapper
      title="Hibah Untuk Di Review"
      subtitle="Daftar penugasan review hibah mengikuti pola tabel legacy reviewer."
      breadcrumbs={[{ label: "Reviewer" }, { label: "Review Hibah" }]}
    >
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 lg:flex-row lg:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Cari proposal, pengusul, atau jenis hibah..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-sm outline-none transition-all focus:border-[#E30613]/40 focus:ring-2 focus:ring-[#E30613]/10"
            />
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-500">Urutkan</span>
            <select
              value={sortKey}
              onChange={(event) => setSortKey(event.target.value as SortKey)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
            >
              <option value="invitationDate">Tanggal Invitation</option>
              <option value="typeLabel">Jenis Hibah</option>
              <option value="approvalStatus">Status Persetujuan</option>
              <option value="reviewed">Sudah Review</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                {["No", "Link Hibah", "Jenis Hibah", "Tanggal Invitation", "Status Persetujuan", "Sudah Review?", "Aksi"].map((heading) => (
                  <th key={heading} className="whitespace-nowrap px-5 py-3 text-left text-xs text-slate-500" style={{ fontWeight: 600 }}>
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginated.map((assignment, index) => {
                const detailPath = getAssignmentPath(assignment.assignmentId, assignment.type);
                return (
                  <tr key={assignment.assignmentId} className="transition-colors hover:bg-slate-50/50">
                    <td className="px-5 py-3.5 text-sm text-slate-400">
                      {(page - 1) * perPage + index + 1}
                    </td>
                    <td className="px-5 py-3.5 align-top">
                      <div className="max-w-[320px]">
                        {assignment.approvalStatus === "terima" ? (
                          <button
                            type="button"
                            onClick={() => navigate(detailPath)}
                            className="truncate text-left text-sm text-blue-600 hover:underline"
                            style={{ fontWeight: 600 }}
                          >
                            Lihat Detail
                          </button>
                        ) : (
                          <span className="text-sm text-slate-400">Belum tersedia</span>
                        )}
                        <p className="mt-1 text-sm text-slate-800" style={{ fontWeight: 500 }}>
                          {assignment.proposal.title}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-400">{assignment.applicant.name}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex rounded-full bg-blue-100 px-2.5 py-1 text-xs text-blue-700" style={{ fontWeight: 600 }}>
                        {assignment.typeLabel}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-sm text-slate-600">
                      {assignment.invitationDate}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs ${APPROVAL_BADGE[assignment.approvalStatus]}`} style={{ fontWeight: 600 }}>
                        {assignment.approvalStatus}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs ${assignment.reviewed ? "text-green-600" : "text-slate-400"}`} style={{ fontWeight: 600 }}>
                        {assignment.reviewed ? "Sudah" : "Belum"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        type="button"
                        onClick={() => navigate(detailPath)}
                        className="inline-flex items-center gap-1 text-xs text-blue-600 transition-colors hover:text-blue-800"
                        style={{ fontWeight: 600 }}
                      >
                        <Eye className="h-3.5 w-3.5" /> Lihat <ChevronRight className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4 text-sm">
          <p className="text-slate-500">
            Menampilkan {paginated.length} dari {filtered.length} penugasan
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page === 1}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50"
            >
              Sebelumnya
            </button>
            <span className="text-slate-500">
              {page} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              disabled={page === totalPages}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50"
            >
              Berikutnya
            </button>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
