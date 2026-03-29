interface ScoreBar {
  label: string;
  value: number;
  max: number;
  colorClass: string; // e.g. "bg-blue-500"
}

interface ProgressBarReviewProps {
  bars: ScoreBar[];
}

export function ProgressBarReview({ bars }: ProgressBarReviewProps) {
  return (
    <div className="space-y-4">
      {bars.map((bar) => {
        const pct = bar.max > 0 ? Math.round((bar.value / bar.max) * 100) : 0;
        return (
          <div key={bar.label}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium text-slate-700">{bar.label}</span>
              <span className="text-sm font-semibold text-slate-800">
                {bar.value} / {bar.max}
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${bar.colorClass}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-0.5 text-right">{pct}%</p>
          </div>
        );
      })}
    </div>
  );
}
