import { Check } from "lucide-react";
import type { StatusType } from "./StatusBadge";

interface Step {
  key: string;
  label: string;
}

const HIBAH_STEPS: Step[] = [
  { key: "draft", label: "Draft" },
  { key: "submitted", label: "Submit" },
  { key: "pending-review", label: "Review" },
  { key: "approved", label: "Approve" },
  { key: "verified", label: "Finance" },
  { key: "lunas", label: "Lunas" },
];

const SURAT_STEPS: Step[] = [
  { key: "draft", label: "Draft" },
  { key: "submitted", label: "Submit" },
  { key: "approved", label: "Approve" },
  { key: "verified", label: "Verifikasi" },
  { key: "hutang", label: "Hutang" },
  { key: "lunas", label: "Lunas" },
];

const KONFERENSI_STEPS: Step[] = [
  { key: "draft", label: "Draft" },
  { key: "submitted", label: "Submit" },
  { key: "pending-review", label: "Review" },
  { key: "approved", label: "Approve" },
  { key: "verified", label: "Verifikasi" },
];

const PUBLIKASI_STEPS: Step[] = [
  { key: "draft", label: "Draft" },
  { key: "submitted", label: "Submit" },
  { key: "pending-review", label: "Review" },
  { key: "approved", label: "Approve" },
  { key: "verified", label: "Terbit" },
];

export type StepperModule = "hibah" | "surat-tugas" | "konferensi" | "publikasi";

const STEP_MAP: Record<StepperModule, Step[]> = {
  hibah: HIBAH_STEPS,
  "surat-tugas": SURAT_STEPS,
  konferensi: KONFERENSI_STEPS,
  publikasi: PUBLIKASI_STEPS,
};

const STATUS_ORDER: Record<string, number> = {
  draft: 0,
  submitted: 1,
  "submit-revisi": 1,
  "pending-review": 2,
  revisi: 2,
  approved: 3,
  "read-finance": 3,
  verified: 4,
  hutang: 4,
  lunas: 5,
  rejected: -1,
};

interface StepperStatusProps {
  module: StepperModule;
  currentStatus: StatusType;
}

export function StepperStatus({ module, currentStatus }: StepperStatusProps) {
  const steps = STEP_MAP[module];
  const currentIdx = STATUS_ORDER[currentStatus] ?? 0;
  const isRejected = currentStatus === "rejected";
  const isRevisi = currentStatus === "revisi" || currentStatus === "submit-revisi";

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs text-slate-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Progress</h4>
        {isRejected && (
          <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-full" style={{ fontWeight: 600 }}>Ditolak</span>
        )}
        {isRevisi && (
          <span className="text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full" style={{ fontWeight: 600 }}>Revisi</span>
        )}
      </div>
      <div className="flex items-center gap-0 mt-4">
        {steps.map((step, i) => {
          const stepIdx = i;
          const isComplete = !isRejected && currentIdx > stepIdx;
          const isCurrent = !isRejected && currentIdx === stepIdx;
          const isFuture = isRejected || currentIdx < stepIdx;

          return (
            <div key={step.key} className="flex-1 flex flex-col items-center relative">
              {/* Connector line */}
              {i > 0 && (
                <div className={`absolute top-3 right-1/2 w-full h-0.5 -z-0 ${isComplete ? "bg-green-500" : isCurrent ? "bg-[#E30613]" : "bg-slate-200"}`} />
              )}
              {/* Circle */}
              <div className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center text-[10px] border-2 transition-all ${
                isComplete ? "bg-green-500 border-green-500 text-white" :
                isCurrent ? "bg-[#E30613] border-[#E30613] text-white" :
                isRejected && i === 0 ? "bg-red-500 border-red-500 text-white" :
                "bg-white border-slate-300 text-slate-400"
              }`} style={{ fontWeight: 700 }}>
                {isComplete ? <Check className="w-3 h-3" /> : i + 1}
              </div>
              {/* Label */}
              <span className={`text-[10px] mt-1.5 text-center leading-tight ${
                isComplete ? "text-green-600" :
                isCurrent ? "text-[#E30613]" :
                "text-slate-400"
              }`} style={{ fontWeight: isCurrent || isComplete ? 600 : 400 }}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
