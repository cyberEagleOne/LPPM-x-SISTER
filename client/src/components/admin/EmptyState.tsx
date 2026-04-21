import { Inbox, Plus, Search, ShieldX, ServerCrash, Clock } from "lucide-react";

type EmptyVariant = "no-data" | "no-results" | "no-access" | "error" | "session-expired";

interface EmptyStateProps {
  variant?: EmptyVariant;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const VARIANTS: Record<EmptyVariant, { icon: typeof Inbox; title: string; desc: string }> = {
  "no-data": { icon: Inbox, title: "Belum Ada Data", desc: "Data belum tersedia. Mulai dengan menambahkan data pertama." },
  "no-results": { icon: Search, title: "Tidak Ditemukan", desc: "Pencarian tidak menemukan hasil. Coba kata kunci lain." },
  "no-access": { icon: ShieldX, title: "Akses Ditolak", desc: "Anda tidak memiliki izin untuk mengakses halaman ini." },
  error: { icon: ServerCrash, title: "Terjadi Kesalahan", desc: "Gagal memuat data. Silakan coba lagi." },
  "session-expired": { icon: Clock, title: "Sesi Berakhir", desc: "Sesi Anda telah habis. Silakan login kembali." },
};

export function EmptyState({ variant = "no-data", title, description, actionLabel, onAction }: EmptyStateProps) {
  const v = VARIANTS[variant];
  const Icon = v.icon;
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-5">
        <Icon className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-slate-800 mb-1" style={{ fontWeight: 600 }}>{title || v.title}</h3>
      <p className="text-sm text-slate-500 text-center max-w-sm mb-6">{description || v.desc}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#E30613] text-white text-sm rounded-lg hover:bg-[#c00510] transition-all active:scale-95"
          style={{ fontWeight: 500 }}
        >
          <Plus className="w-4 h-4" />
          {actionLabel}
        </button>
      )}
    </div>
  );
}
