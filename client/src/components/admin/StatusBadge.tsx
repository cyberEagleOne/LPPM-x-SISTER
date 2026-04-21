export type StatusType =
  | "draft" | "submitted" | "pending-review" | "revisi" | "submit-revisi"
  | "approved" | "rejected" | "verified" | "read-finance" | "lunas" | "hutang"
  | "active" | "inactive" | "expired";

const STATUS_CONFIG: Record<StatusType, { label: string; bg: string; text: string; dot: string }> = {
  draft: { label: "Draft", bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" },
  submitted: { label: "Submitted", bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  "pending-review": { label: "Pending Review", bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  revisi: { label: "Revisi", bg: "bg-orange-50", text: "text-orange-700", dot: "bg-orange-500" },
  "submit-revisi": { label: "Submit Revisi", bg: "bg-indigo-50", text: "text-indigo-700", dot: "bg-indigo-500" },
  approved: { label: "Approved", bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
  rejected: { label: "Ditolak", bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  verified: { label: "Verified", bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  "read-finance": { label: "Read by Finance", bg: "bg-cyan-50", text: "text-cyan-700", dot: "bg-cyan-500" },
  lunas: { label: "Lunas", bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
  hutang: { label: "Hutang", bg: "bg-rose-50", text: "text-rose-700", dot: "bg-rose-500" },
  active: { label: "Active", bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
  inactive: { label: "Inactive", bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" },
  expired: { label: "Expired", bg: "bg-red-50", text: "text-red-600", dot: "bg-red-400" },
};

interface StatusBadgeProps {
  status: StatusType;
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.draft;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 ${size === "sm" ? "py-0.5 text-xs" : "py-1 text-sm"} rounded-full ${config.bg} ${config.text}`}
      style={{ fontWeight: 500 }}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}
