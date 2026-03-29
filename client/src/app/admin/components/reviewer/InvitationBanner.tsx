import type { ReactNode } from "react";
import { CheckCircle, XCircle, Clock, Loader2 } from "lucide-react";

interface InvitationBannerProps {
  status: "pending" | "terima" | "tolak";
  onTerima?: () => void;
  onTolak?: () => void;
  loading?: boolean;
}

export function InvitationBanner({ status, onTerima, onTolak, loading }: InvitationBannerProps) {
  if (status === "terima") {
    return (
      <div className="flex items-center gap-3 px-4 py-3 bg-green-50 border border-green-200 rounded-xl mb-6">
        <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
        <p className="text-sm text-green-800 font-medium">Anda setuju untuk melakukan review pada proposal ini.</p>
      </div>
    );
  }
  if (status === "tolak") {
    return (
      <div className="flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl mb-6">
        <XCircle className="w-5 h-5 text-red-600 shrink-0" />
        <p className="text-sm text-red-800 font-medium">Anda menolak untuk melakukan review pada proposal ini.</p>
      </div>
    );
  }
  // pending
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl mb-6">
      <div className="flex items-center gap-3">
        <Clock className="w-5 h-5 text-amber-600 shrink-0" />
        <p className="text-sm text-amber-800 font-medium">Butuh persetujuan: apakah Anda bersedia melakukan review pada proposal ini?</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onTerima}
          disabled={loading}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-60 transition-colors"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
          Terima
        </button>
        <button
          onClick={onTolak}
          disabled={loading}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 disabled:opacity-60 transition-colors"
        >
          <XCircle className="w-3.5 h-3.5" />
          Tolak
        </button>
      </div>
    </div>
  );
}
