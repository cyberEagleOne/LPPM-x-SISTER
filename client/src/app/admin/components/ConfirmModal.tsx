import { AlertTriangle, Trash2, CheckCircle, XCircle } from "lucide-react";

type ConfirmVariant = "danger" | "warning" | "success" | "info";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
  loading?: boolean;
}

const VARIANT_CONFIG: Record<ConfirmVariant, { icon: typeof AlertTriangle; iconBg: string; iconColor: string; btnBg: string; btnHover: string }> = {
  danger: { icon: Trash2, iconBg: "bg-red-100", iconColor: "text-red-600", btnBg: "bg-red-600", btnHover: "hover:bg-red-700" },
  warning: { icon: AlertTriangle, iconBg: "bg-amber-100", iconColor: "text-amber-600", btnBg: "bg-amber-600", btnHover: "hover:bg-amber-700" },
  success: { icon: CheckCircle, iconBg: "bg-green-100", iconColor: "text-green-600", btnBg: "bg-green-600", btnHover: "hover:bg-green-700" },
  info: { icon: XCircle, iconBg: "bg-blue-100", iconColor: "text-blue-600", btnBg: "bg-blue-600", btnHover: "hover:bg-blue-700" },
};

export function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmLabel = "Ya, Lanjutkan", cancelLabel = "Batal", variant = "danger", loading }: ConfirmModalProps) {
  if (!isOpen) return null;
  const v = VARIANT_CONFIG[variant];
  const Icon = v.icon;
  const confirmClass =
    variant === "danger"
      ? "app-btn app-btn-primary"
      : variant === "warning"
        ? "app-btn border-0 bg-amber-500 text-white hover:bg-amber-600"
        : variant === "success"
          ? "app-btn border-0 bg-emerald-600 text-white hover:bg-emerald-700"
          : "app-btn border-0 bg-sky-600 text-white hover:bg-sky-700";

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="app-modal-panel relative mx-4 w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start gap-4">
          <div className={`shrink-0 w-11 h-11 rounded-2xl ${v.iconBg} flex items-center justify-center`}>
            <Icon className={`w-5 h-5 ${v.iconColor}`} />
          </div>
          <div className="flex-1">
            <h3 className="text-slate-900 mb-1.5 text-[1.02rem]" style={{ fontWeight: 700 }}>{title}</h3>
            <p className="text-sm leading-6 text-slate-500">{message}</p>
          </div>
        </div>
        <div className="mt-7 flex items-center justify-end gap-3">
          <button onClick={onClose} className="app-btn app-btn-secondary text-sm" style={{ fontWeight: 600 }} type="button">
            {cancelLabel}
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            disabled={loading}
            className={`${confirmClass} text-sm disabled:opacity-50 disabled:hover:translate-y-0`}
            style={{ fontWeight: 600 }}
            type="button"
          >
            {loading ? "Memproses..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
