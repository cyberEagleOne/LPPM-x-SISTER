interface TimelineEntry {
  date: string;
  actor: string;
  status: string;
  catatan?: string;
}

interface ReviewTimelineProps {
  entries: TimelineEntry[];
}

const STATUS_COLORS: Record<string, string> = {
  submit: "bg-blue-500",
  submitted: "bg-blue-500",
  approve: "bg-green-500",
  approved: "bg-green-500",
  revisi: "bg-orange-500",
  "submit-revisi": "bg-indigo-500",
  tolak: "bg-red-500",
  rejected: "bg-red-500",
  verified: "bg-emerald-500",
  lunas: "bg-green-700",
  terima: "bg-green-500",
  pending: "bg-amber-500",
  draft: "bg-gray-400",
};

export function ReviewTimeline({ entries }: ReviewTimelineProps) {
  if (entries.length === 0) {
    return <p className="text-sm text-slate-400 italic text-center py-6">Belum ada riwayat status.</p>;
  }

  return (
    <div className="space-y-4">
      {entries.map((entry, i) => {
        const colorClass = STATUS_COLORS[entry.status.toLowerCase()] ?? "bg-gray-400";
        const isLast = i === entries.length - 1;
        return (
          <div key={i} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={`w-3 h-3 rounded-full ${colorClass} shrink-0 mt-1.5 ring-2 ring-white`} />
              {!isLast && <div className="w-px flex-1 bg-slate-200 mt-1" />}
            </div>
            <div className={`pb-4 ${isLast ? "" : ""}`}>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold text-slate-800">{entry.status}</span>
                <span className="text-xs text-slate-400">oleh {entry.actor}</span>
                <span className="text-xs text-slate-400">• {entry.date}</span>
              </div>
              {entry.catatan && (
                <p className="text-sm text-slate-500 mt-1 pl-0 bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
                  {entry.catatan}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
