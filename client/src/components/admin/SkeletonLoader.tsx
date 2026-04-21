export function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 w-24 bg-slate-200 rounded" />
        <div className="h-8 w-8 bg-slate-200 rounded-lg" />
      </div>
      <div className="h-7 w-16 bg-slate-200 rounded mb-2" />
      <div className="h-3 w-32 bg-slate-100 rounded" />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden animate-pulse">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="h-5 w-40 bg-slate-200 rounded" />
        <div className="flex gap-2">
          <div className="h-9 w-48 bg-slate-100 rounded-lg" />
          <div className="h-9 w-24 bg-slate-100 rounded-lg" />
        </div>
      </div>
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="px-5 py-4 flex items-center gap-4">
            <div className="h-4 w-8 bg-slate-100 rounded" />
            <div className="h-4 flex-1 bg-slate-100 rounded" />
            <div className="h-4 w-24 bg-slate-100 rounded" />
            <div className="h-6 w-20 bg-slate-100 rounded-full" />
            <div className="h-8 w-20 bg-slate-100 rounded-lg" />
          </div>
        ))}
      </div>
      <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
        <div className="h-4 w-32 bg-slate-100 rounded" />
        <div className="h-8 w-48 bg-slate-100 rounded-lg" />
      </div>
    </div>
  );
}

export function SkeletonDetail() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse space-y-6">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 bg-slate-200 rounded-full" />
        <div className="space-y-2">
          <div className="h-5 w-48 bg-slate-200 rounded" />
          <div className="h-3 w-32 bg-slate-100 rounded" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 w-20 bg-slate-200 rounded" />
            <div className="h-4 w-full bg-slate-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
