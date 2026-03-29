import { useState, useEffect } from "react";
import {
  Check, X, Users, ExternalLink, CheckCircle, XCircle, Clock
} from "lucide-react";
import { PageWrapper } from "../components/PageWrapper";
import { SkeletonTable } from "../components/SkeletonLoader";
import { EmptyState } from "../components/EmptyState";
import { ConfirmModal } from "../components/ConfirmModal";

/* ────────────────── Types ────────────────── */

type UndanganStatus = "pending" | "diterima" | "ditolak";

interface UndanganAngota {
  id: string;
  hibahId: string;
  judulHibah: string;
  jenis: "Penelitian" | "PKM";
  pengusul: string;
  peran: string;
  tanggalUndangan: string;
  status: UndanganStatus;
  proposalUrl?: string;
}

/* ────────────────── Mock Data ────────────────── */

const MOCK_UNDANGAN: UndanganAngota[] = [
  {
    id: "UA-001",
    hibahId: "HIB-001",
    judulHibah: "Penelitian IoT untuk Smart Campus Pradita",
    jenis: "Penelitian",
    pengusul: "Prof. Dimas Prakoso, Ph.D.",
    peran: "Anggota",
    tanggalUndangan: "2026-03-01",
    status: "pending",
    proposalUrl: "https://drive.google.com/proposal-iot",
  },
  {
    id: "UA-002",
    hibahId: "HIB-003",
    judulHibah: "Machine Learning untuk Prediksi Cuaca Lokal",
    jenis: "Penelitian",
    pengusul: "Dr. Lestari Handayani, M.Kom.",
    peran: "Anggota",
    tanggalUndangan: "2026-03-05",
    status: "diterima",
    proposalUrl: "https://drive.google.com/proposal-ml",
  },
  {
    id: "UA-003",
    hibahId: "HIB-005",
    judulHibah: "Pengabdian Masyarakat Desa Digital",
    jenis: "PKM",
    pengusul: "Dr. Fajar Nugroho, M.Si.",
    peran: "Anggota",
    tanggalUndangan: "2026-02-20",
    status: "ditolak",
  },
  {
    id: "UA-004",
    hibahId: "HIB-007",
    judulHibah: "Pelatihan AI untuk Guru SMK se-Tangerang",
    jenis: "PKM",
    pengusul: "Dr. Dewi Lestari, M.T.",
    peran: "Ketua",
    tanggalUndangan: "2026-03-10",
    status: "pending",
    proposalUrl: "https://drive.google.com/proposal-pkm-ai",
  },
];

/* ────────────────── Status Helpers ────────────────── */

const STATUS_CONFIG: Record<UndanganStatus, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
  pending: { label: "Menunggu", icon: <Clock className="w-3.5 h-3.5" />, color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
  diterima: { label: "Diterima", icon: <CheckCircle className="w-3.5 h-3.5" />, color: "text-green-700", bg: "bg-green-50 border-green-200" },
  ditolak: { label: "Ditolak", icon: <XCircle className="w-3.5 h-3.5" />, color: "text-red-700", bg: "bg-red-50 border-red-200" },
};

/* ────────────────── Main Component ────────────────── */

export function AnggotaHibahPage() {
  const [loading, setLoading] = useState(true);
  const [undangan, setUndangan] = useState<UndanganAngota[]>(MOCK_UNDANGAN);
  const [filterStatus, setFilterStatus] = useState<"semua" | UndanganStatus>("semua");
  const [confirmModal, setConfirmModal] = useState({ open: false, title: "", message: "", variant: "warning" as "warning" | "danger" | "success", onConfirm: () => {} });
  const [toast, setToast] = useState({ show: false, message: "", type: "success" as "success" | "error" });

  useEffect(() => { const t = setTimeout(() => setLoading(false), 400); return () => clearTimeout(t); }, []);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast((p) => ({ ...p, show: false })), 3000);
  };

  const handleTerima = (id: string) => {
    setUndangan((prev) => prev.map((u) => u.id === id ? { ...u, status: "diterima" as UndanganStatus } : u));
    showToast("Undangan berhasil diterima");
  };

  const handleTolak = (id: string) => {
    setUndangan((prev) => prev.map((u) => u.id === id ? { ...u, status: "ditolak" as UndanganStatus } : u));
    showToast("Undangan ditolak");
  };

  const filtered = undangan.filter((u) => filterStatus === "semua" || u.status === filterStatus);

  const counts = {
    pending: undangan.filter((u) => u.status === "pending").length,
    diterima: undangan.filter((u) => u.status === "diterima").length,
    ditolak: undangan.filter((u) => u.status === "ditolak").length,
  };

  return (
    <PageWrapper
      title="Undangan Anggota Hibah"
      subtitle="Kelola undangan untuk menjadi anggota tim hibah dari dosen lain"
      breadcrumbs={[{ label: "Dosen" }, { label: "Hibah" }, { label: "Undangan Anggota" }]}
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Menunggu", count: counts.pending, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
          { label: "Diterima", count: counts.diterima, color: "text-green-600", bg: "bg-green-50", border: "border-green-100" },
          { label: "Ditolak", count: counts.ditolak, color: "text-red-600", bg: "bg-red-50", border: "border-red-100" },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl border ${s.border} ${s.bg} p-4 text-center`}>
            <p className={`text-2xl ${s.color}`} style={{ fontWeight: 700 }}>{s.count}</p>
            <p className="text-xs text-slate-500 mt-1" style={{ fontWeight: 500 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 mb-4">
        {(["semua", "pending", "diterima", "ditolak"] as const).map((s) => (
          <button key={s} onClick={() => setFilterStatus(s)}
            className={`px-4 py-1.5 text-xs rounded-full border transition-all ${
              filterStatus === s
                ? "bg-[#E30613] text-white border-[#E30613]"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
            }`} style={{ fontWeight: 500 }}>
            {s === "semua" ? "Semua" : STATUS_CONFIG[s].label}
            {s !== "semua" && counts[s] > 0 && <span className="ml-1.5 bg-white/20 text-inherit px-1.5 py-0.5 rounded-full text-[10px]">{counts[s]}</span>}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? <SkeletonTable rows={4} /> : filtered.length === 0 ? (
        <EmptyState variant="no-data" title="Tidak Ada Undangan" description="Belum ada undangan menjadi anggota hibah." />
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            const cfg = STATUS_CONFIG[item.status];
            return (
              <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-sm transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      item.jenis === "Penelitian" ? "bg-blue-50" : "bg-green-50"
                    }`}>
                      <Users className={`w-5 h-5 ${item.jenis === "Penelitian" ? "text-blue-600" : "text-green-600"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${item.jenis === "Penelitian" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`} style={{ fontWeight: 600 }}>{item.jenis}</span>
                        <span className="text-xs text-slate-400">Sebagai: <strong className="text-slate-600">{item.peran}</strong></span>
                      </div>
                      <h3 className="text-sm text-slate-900 truncate" style={{ fontWeight: 600 }}>{item.judulHibah}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Diundang oleh: {item.pengusul} · {item.tanggalUndangan}</p>
                      {item.proposalUrl && (
                        <a href={item.proposalUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-blue-500 hover:underline mt-1">
                          <ExternalLink className="w-3 h-3" /> Lihat Proposal
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.color}`} style={{ fontWeight: 600 }}>
                      {cfg.icon} {cfg.label}
                    </span>
                    {item.status === "pending" && (
                      <>
                        <button
                          onClick={() => setConfirmModal({ open: true, title: "Terima Undangan?", message: `Anda akan bergabung sebagai ${item.peran} pada hibah "${item.judulHibah}"`, variant: "success", onConfirm: () => handleTerima(item.id) })}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white bg-green-600 rounded-lg hover:bg-green-700" style={{ fontWeight: 500 }}>
                          <Check className="w-3.5 h-3.5" /> Terima
                        </button>
                        <button
                          onClick={() => setConfirmModal({ open: true, title: "Tolak Undangan?", message: `Anda akan menolak undangan pada hibah "${item.judulHibah}"`, variant: "danger", onConfirm: () => handleTolak(item.id) })}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100" style={{ fontWeight: 500 }}>
                          <X className="w-3.5 h-3.5" /> Tolak
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmModal {...confirmModal} isOpen={confirmModal.open} onClose={() => setConfirmModal((p) => ({ ...p, open: false }))} />
      {toast.show && (
        <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg border ${toast.type === "success" ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"}`}>
          {toast.type === "success" ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
          <span className="text-sm" style={{ fontWeight: 500 }}>{toast.message}</span>
        </div>
      )}
    </PageWrapper>
  );
}
