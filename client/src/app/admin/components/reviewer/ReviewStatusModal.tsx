import { useState } from "react";
import { X, CheckCircle, RotateCcw, XCircle } from "lucide-react";

type ActionType = "approve" | "revisi" | "tolak";

interface ReviewStatusModalProps {
  open: boolean;
  action: ActionType;
  onClose: () => void;
  onConfirm: (catatan: string) => void;
  loading?: boolean;
}

const ACTION_CONFIG: Record<ActionType, { title: string; icon: React.ReactNode; color: string; btnClass: string }> = {
  approve: {
    title: "Approve Pengajuan",
    icon: <CheckCircle className="w-5 h-5 text-green-600" />,
    color: "text-green-700",
    btnClass: "bg-green-600 hover:bg-green-700 text-white",
  },
  revisi: {
    title: "Minta Revisi",
    icon: <RotateCcw className="w-5 h-5 text-orange-500" />,
    color: "text-orange-700",
    btnClass: "bg-orange-500 hover:bg-orange-600 text-white",
  },
  tolak: {
    title: "Tolak Pengajuan",
    icon: <XCircle className="w-5 h-5 text-red-600" />,
    color: "text-red-700",
    btnClass: "bg-red-600 hover:bg-red-700 text-white",
  },
};

export function ReviewStatusModal({ open, action, onClose, onConfirm, loading }: ReviewStatusModalProps) {
  const [catatan, setCatatan] = useState("");
  const cfg = ACTION_CONFIG[action];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {cfg.icon}
            <h3 className={`text-base font-semibold ${cfg.color}`}>{cfg.title}</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        <textarea
          rows={4}
          value={catatan}
          onChange={(e) => setCatatan(e.target.value)}
          placeholder={
            action === "approve"
              ? "Tambahkan catatan (opsional)..."
              : "Tuliskan alasan atau catatan revisi / penolakan..."
          }
          className="w-full px-4 py-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E30613]/20 bg-slate-50 placeholder:text-slate-400 resize-none mb-4"
        />

        <div className="flex items-center gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={() => {
              onConfirm(catatan);
              setCatatan("");
            }}
            disabled={loading || (action !== "approve" && !catatan.trim())}
            className={`px-5 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 ${cfg.btnClass}`}
          >
            {loading ? "Memproses..." : "Konfirmasi"}
          </button>
        </div>
      </div>
    </div>
  );
}
