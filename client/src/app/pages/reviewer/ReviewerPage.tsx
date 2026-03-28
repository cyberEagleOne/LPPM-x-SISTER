import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  CheckCheck,
  Clock,
  ChevronDown,
  ChevronUp,
  Database,
  FileText,
  User,
  Calendar,
  BookOpen,
  Hash,
  Activity,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useReviewerData } from "./reviewerStore";

// ─── Field match styles ───────────────────────────────────────────────────────

const matchConfig = {
  match: {
    rowBg: "bg-green-50/50",
    badge: "bg-green-100 text-green-700",
    icon: <CheckCheck size={13} className="text-green-600" />,
    label: "Sesuai",
    leftBorder: "border-l-2 border-green-400",
  },
  mismatch: {
    rowBg: "bg-red-50/50",
    badge: "bg-red-100 text-red-600",
    icon: <XCircle size={13} className="text-red-500" />,
    label: "Tidak Sesuai",
    leftBorder: "border-l-2 border-red-400",
  },
  partial: {
    rowBg: "bg-amber-50/50",
    badge: "bg-amber-100 text-amber-700",
    icon: <AlertTriangle size={13} className="text-amber-500" />,
    label: "Sebagian",
    leftBorder: "border-l-2 border-amber-400",
  },
};

const validityConfig = {
  valid: {
    label: "VALID — Data sesuai SISTER",
    className: "bg-green-100 text-green-700 border-green-200",
    dot: "bg-green-500",
    icon: <CheckCircle size={16} className="text-green-600" />,
  },
  invalid: {
    label: "TIDAK VALID — Data tidak ditemukan di SISTER",
    className: "bg-red-100 text-red-700 border-red-200",
    dot: "bg-red-500",
    icon: <XCircle size={16} className="text-red-500" />,
  },
  partial: {
    label: "SEBAGIAN VALID — Ada ketidaksesuaian data",
    className: "bg-amber-100 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
    icon: <AlertTriangle size={16} className="text-amber-500" />,
  },
};

// ─── Decision state ───────────────────────────────────────────────────────────

type Decision = "idle" | "approved" | "rejected";

// ─── Component ───────────────────────────────────────────────────────────────

export function ReviewerPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [expanded, setExpanded] = useState<Record<number, boolean>>({ 1: true });
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [pendingAction, setPendingAction] = useState<{ id: number; decision: Decision } | null>(null);

  const { pendingSubmissions, counts, decideOnce, getDecision } = useReviewerData();

  const toggle = (id: number) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const requestDecision = (id: number, d: Decision) => {
    setPendingAction({ id, decision: d });
  };

  const confirmDecision = () => {
    if (!pendingAction) return;
    const { id, decision: d } = pendingAction;
    const note = notes[id] ?? "";
    const ok = decideOnce(id, d as "approved" | "rejected", note);
    const title = pendingSubmissions.find((s) => s.id === id)?.title ?? "";
    const short = title.length > 55 ? title.slice(0, 55) + "..." : title;

    if (!ok) {
      toast.error("Keputusan sudah tercatat", { description: "Penelitian ini sudah pernah disetujui/ditolak." });
      setPendingAction(null);
      return;
    }

    if (d === "approved") toast.success("Penelitian Disetujui", { description: short });
    else toast.error("Penelitian Ditolak", { description: short });

    setPendingAction(null);
    navigate(d === "approved" ? "/reviewer/approved" : "/reviewer/rejected");
  };

  const pending = counts.pending;
  const approved = counts.approved;
  const rejected = counts.rejected;

  const list = useMemo(() => pendingSubmissions, [pendingSubmissions]);
  const focusedId = Number(searchParams.get("id"));

  // Auto-expand focused item if present in list
  useEffect(() => {
    if (!Number.isFinite(focusedId)) return;
    if (!list.some((s) => s.id === focusedId)) return;
    setExpanded((prev) => ({ ...prev, [focusedId]: true }));
  }, [focusedId, list]);

  return (
    <div>
      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-gray-900">Review & Validasi Penelitian</h1>
          <p className="text-gray-500 mt-1" style={{ fontSize: 14 }}>
            Bandingkan data pengajuan dosen dengan data referensi dari{" "}
            <span className="font-semibold text-[#1e3a8a]">SISTER</span> sebelum membuat keputusan.
          </p>
        </div>

        {/* Top-right buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            to="/reviewer/pending"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200 hover:bg-amber-200/40 transition-colors"
            style={{ fontSize: 12, fontWeight: 700 }}
          >
            <Clock size={13} /> {pending} Pending
          </Link>
          <Link
            to="/reviewer/approved"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-100 text-green-700 border border-green-200 hover:bg-green-200/40 transition-colors"
            style={{ fontSize: 12, fontWeight: 700 }}
          >
            <CheckCircle size={13} /> {approved} Disetujui
          </Link>
          <Link
            to="/reviewer/rejected"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-100 text-red-600 border border-red-200 hover:bg-red-200/40 transition-colors"
            style={{ fontSize: 12, fontWeight: 700 }}
          >
            <XCircle size={13} /> {rejected} Ditolak
          </Link>
        </div>
      </div>

      {/* ── SISTER info banner ── */}
      <div className="mb-6 flex items-start gap-3 px-5 py-4 rounded-xl bg-[#eff6ff] border border-blue-200">
        <Database size={18} className="text-[#1e3a8a] flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-[#1e3a8a]" style={{ fontSize: 13, fontWeight: 700 }}>
            Koneksi SISTER Aktif
          </p>
          <p className="text-blue-600 mt-0.5" style={{ fontSize: 12 }}>
            Data referensi diambil secara langsung dari API SISTER Kemdikbud. Pastikan setiap
            perbedaan data diperiksa sebelum keputusan dibuat.
          </p>
        </div>
        <span className="flex items-center gap-1.5 ml-auto flex-shrink-0 px-2.5 py-1 rounded-full bg-green-100 text-green-700" style={{ fontSize: 11, fontWeight: 700 }}>
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
          Online
        </span>
      </div>

      {/* ── Research list ── */}
      {list.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-6 border-b border-gray-100">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                <CheckCircle size={20} className="text-green-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-gray-900">Semua pengajuan sudah ditinjau</h2>
                <p className="text-gray-500 mt-1" style={{ fontSize: 14, lineHeight: 1.7 }}>
                  Tidak ada penelitian <strong>pending</strong> saat ini. Anda bisa melihat rekap keputusan atau meninjau riwayat review.
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                to="/reviewer/approved"
                className="bg-green-50 border border-green-100 rounded-2xl p-5 hover:bg-green-100/40 transition-colors"
              >
                <p className="text-green-700" style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Disetujui
                </p>
                <p className="text-gray-900 mt-2" style={{ fontSize: 30, fontWeight: 900, lineHeight: 1 }}>
                  {approved}
                </p>
                <p className="text-green-700 mt-2" style={{ fontSize: 13, fontWeight: 700 }}>
                  Lihat daftar disetujui →
                </p>
              </Link>

              <Link
                to="/reviewer/rejected"
                className="bg-red-50 border border-red-100 rounded-2xl p-5 hover:bg-red-100/40 transition-colors"
              >
                <p className="text-red-700" style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Ditolak
                </p>
                <p className="text-gray-900 mt-2" style={{ fontSize: 30, fontWeight: 900, lineHeight: 1 }}>
                  {rejected}
                </p>
                <p className="text-red-700 mt-2" style={{ fontSize: 13, fontWeight: 700 }}>
                  Lihat daftar ditolak →
                </p>
              </Link>

              <Link
                to="/reviewer/profile"
                className="bg-[#eff6ff] border border-blue-200 rounded-2xl p-5 hover:bg-blue-50 transition-colors"
              >
                <p className="text-[#1e3a8a]" style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Riwayat & Profil
                </p>
                <p className="text-gray-900 mt-2" style={{ fontSize: 15, fontWeight: 800, lineHeight: 1.3 }}>
                  Kelola profil dan filter riwayat review
                </p>
                <p className="text-[#1e3a8a] mt-2" style={{ fontSize: 13, fontWeight: 700 }}>
                  Buka profil →
                </p>
              </Link>
            </div>

            <div className="mt-5 px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 flex items-start gap-3">
              <Database size={16} className="text-gray-400 flex-shrink-0 mt-0.5" />
              <p className="text-gray-500" style={{ fontSize: 13, lineHeight: 1.7 }}>
                <strong className="text-gray-700">Tips:</strong> Anda bisa kembali lagi nanti — jika ada pengajuan baru,
                otomatis akan muncul di tab <strong className="text-gray-700">Pending</strong>.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {list.map((item) => {
          const isExpanded = expanded[item.id] ?? false;
          const decision = (getDecision(item.id) === "pending" ? "idle" : getDecision(item.id)) as Decision;
          const validity = validityConfig[item.overallValidity];
          const matchCount = item.fields.filter((f) => f.match === "match").length;
          const mismatchCount = item.fields.filter((f) => f.match === "mismatch").length;
          const totalFields = item.fields.length;

          return (
            <div
              key={item.id}
              className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${
                decision === "approved"
                  ? "border-green-300"
                  : decision === "rejected"
                  ? "border-red-300"
                  : "border-gray-200"
              }`}
            >
              {/* ── Card Header ── */}
              <div
                className={`px-6 py-5 cursor-pointer ${
                  decision === "approved"
                    ? "bg-green-50"
                    : decision === "rejected"
                    ? "bg-red-50"
                    : "bg-white hover:bg-gray-50"
                } transition-colors`}
                onClick={() => toggle(item.id)}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      decision === "approved"
                        ? "bg-green-100"
                        : decision === "rejected"
                        ? "bg-red-100"
                        : "bg-[#eff6ff]"
                    }`}
                  >
                    {decision === "approved" ? (
                      <CheckCircle size={20} className="text-green-600" />
                    ) : decision === "rejected" ? (
                      <XCircle size={20} className="text-red-500" />
                    ) : (
                      <FileText size={20} className="text-[#1e3a8a]" />
                    )}
                  </div>

                  {/* Title & meta */}
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900" style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.4 }}>
                      {item.title}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
                      <span className="flex items-center gap-1 text-gray-500" style={{ fontSize: 12 }}>
                        <User size={11} /> {item.dosenName}
                      </span>
                      <span className="text-gray-300">·</span>
                      <span className="flex items-center gap-1 text-gray-500" style={{ fontSize: 12 }}>
                        <Calendar size={11} /> {item.submittedAt}
                      </span>
                      <span className="text-gray-300">·</span>
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700" style={{ fontSize: 11, fontWeight: 600 }}>
                        {item.schema}
                      </span>
                    </div>

                    {/* Validity + match score */}
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${validity.className}`}
                      >
                        {validity.icon}
                        {validity.label}
                      </span>
                      <span className="text-gray-400" style={{ fontSize: 12 }}>
                        {matchCount}/{totalFields} field sesuai
                      </span>
                      {mismatchCount > 0 && (
                        <span className="flex items-center gap-1 text-red-500" style={{ fontSize: 12 }}>
                          <AlertTriangle size={11} /> {mismatchCount} ketidaksesuaian
                        </span>
                      )}
                      {decision !== "idle" && (
                        <span
                          className={`px-2.5 py-1 rounded-full border text-xs font-bold ${
                            decision === "approved"
                              ? "bg-green-100 text-green-700 border-green-200"
                              : "bg-red-100 text-red-600 border-red-200"
                          }`}
                        >
                          {decision === "approved" ? "✓ DISETUJUI" : "✕ DITOLAK"}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Expand toggle */}
                  <button
                    className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors flex-shrink-0 mt-0.5"
                    onClick={(e) => { e.stopPropagation(); toggle(item.id); }}
                  >
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                </div>
              </div>

              {/* ── Expanded: Comparison Panel ── */}
              {isExpanded && (
                <div className="border-t border-gray-100">
                  {/* Column headers */}
                  <div className="grid grid-cols-2 border-b border-gray-100">
                    <div className="px-6 py-3 bg-blue-50 border-r border-gray-100 flex items-center gap-2">
                      <FileText size={14} className="text-[#1e3a8a]" />
                      <span className="text-[#1e3a8a]" style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        Data Pengajuan (Dosen)
                      </span>
                    </div>
                    <div className="px-6 py-3 bg-indigo-50 flex items-center gap-2">
                      <Database size={14} className="text-indigo-600" />
                      <span className="text-indigo-700" style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        Data Referensi (SISTER)
                      </span>
                      {!item.sisterFound && (
                        <span className="ml-auto px-2 py-0.5 rounded-full bg-red-100 text-red-600" style={{ fontSize: 10, fontWeight: 700 }}>
                          TIDAK DITEMUKAN
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Comparison rows */}
                  <div>
                    {item.fields.map((field, idx) => {
                      const cfg = matchConfig[field.match];
                      return (
                        <div
                          key={idx}
                          className={`grid grid-cols-2 border-b border-gray-50 last:border-0 ${cfg.rowBg}`}
                        >
                          {/* Left — submitted */}
                          <div className={`px-6 py-4 border-r border-gray-100 ${cfg.leftBorder}`}>
                            <p className="text-gray-400 mb-1" style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                              {field.label}
                            </p>
                            <p className="text-gray-900" style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.5 }}>
                              {field.submitted}
                            </p>
                          </div>

                          {/* Right — SISTER */}
                          <div className="px-6 py-4 relative">
                            <p className="text-gray-400 mb-1" style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                              {field.label}
                            </p>
                            <div className="flex items-start justify-between gap-3">
                              <p
                                className={`flex-1 ${
                                  field.match === "mismatch"
                                    ? "text-red-600"
                                    : field.match === "partial"
                                    ? "text-amber-700"
                                    : "text-gray-900"
                                }`}
                                style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.5 }}
                              >
                                {field.sister}
                              </p>
                              {/* Match badge */}
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full flex-shrink-0 ${cfg.badge}`}
                                style={{ fontSize: 10, fontWeight: 700 }}
                              >
                                {cfg.icon}
                                {cfg.label}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Match summary bar */}
                  <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center gap-4">
                    <Activity size={14} className="text-gray-400" />
                    <p className="text-gray-500" style={{ fontSize: 12 }}>Ringkasan Validasi:</p>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-green-600" style={{ fontSize: 12, fontWeight: 600 }}>
                        <CheckCheck size={13} /> {matchCount} sesuai
                      </span>
                      <span className="flex items-center gap-1 text-amber-600" style={{ fontSize: 12, fontWeight: 600 }}>
                        <AlertTriangle size={13} /> {item.fields.filter(f => f.match === "partial").length} sebagian
                      </span>
                      <span className="flex items-center gap-1 text-red-500" style={{ fontSize: 12, fontWeight: 600 }}>
                        <XCircle size={13} /> {mismatchCount} tidak sesuai
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden ml-2">
                      <div
                        className="h-full rounded-full bg-green-500"
                        style={{ width: `${(matchCount / totalFields) * 100}%` }}
                      />
                    </div>
                    <span className="text-gray-500" style={{ fontSize: 12, fontWeight: 600 }}>
                      {Math.round((matchCount / totalFields) * 100)}%
                    </span>
                  </div>

                  {/* Note & Decision */}
                  <div className="px-6 py-5 space-y-4 bg-white border-t border-gray-100">
                    {/* Note */}
                    <div>
                      <label className="block text-gray-700 mb-2" style={{ fontSize: 13, fontWeight: 600 }}>
                        Catatan Reviewer{" "}
                        {decision === "rejected" && (
                          <span className="text-red-500 font-normal" style={{ fontSize: 12 }}>(wajib diisi saat menolak)</span>
                        )}
                      </label>
                      <textarea
                        rows={3}
                        value={notes[item.id] ?? ""}
                        onChange={(e) =>
                          setNotes((prev) => ({ ...prev, [item.id]: e.target.value }))
                        }
                        placeholder="Tulis catatan atau alasan keputusan review..."
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-700 bg-gray-50 outline-none focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a]/10 resize-none transition-all"
                        style={{ fontSize: 14 }}
                      />
                    </div>

                    {/* Alert when invalid but trying to approve */}
                    {item.overallValidity === "invalid" && decision === "idle" && (
                      <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-red-50 border border-red-200">
                        <AlertTriangle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
                        <p className="text-red-700" style={{ fontSize: 13, lineHeight: 1.6 }}>
                          <strong>Peringatan:</strong> Data penelitian ini tidak ditemukan di SISTER.
                          Sangat disarankan untuk <strong>menolak</strong> pengajuan ini.
                        </p>
                      </div>
                    )}

                    {/* Decision buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => requestDecision(item.id, "rejected")}
                        disabled={decision !== "idle"}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-bold transition-all ${
                          decision === "rejected"
                            ? "bg-red-600 border-red-600 text-white shadow-lg shadow-red-200"
                            : "border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
                        } ${decision !== "idle" ? "opacity-60 cursor-not-allowed hover:bg-transparent" : ""}`}
                        style={{ fontSize: 14 }}
                      >
                        <XCircle size={18} />
                        {decision === "rejected" ? "✓ Ditolak" : "Reject"}
                      </button>

                      <button
                        onClick={() => requestDecision(item.id, "approved")}
                        disabled={decision !== "idle"}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-bold transition-all ${
                          decision === "approved"
                            ? "bg-green-600 border-green-600 text-white shadow-lg shadow-green-200"
                            : "border-green-400 text-green-700 hover:bg-green-50 hover:border-green-500"
                        } ${decision !== "idle" ? "opacity-60 cursor-not-allowed hover:bg-transparent" : ""}`}
                        style={{ fontSize: 14 }}
                      >
                        <CheckCircle size={18} />
                        {decision === "approved" ? "✓ Disetujui" : "Approve"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
          })}
        </div>
      )}

      {/* ── Confirm dialog ── */}
      <ConfirmDialog
        open={pendingAction !== null}
        title="Konfirmasi Keputusan"
        message={pendingAction ? `Apakah Anda yakin ingin ${pendingAction.decision === "approved" ? "menyetujui" : "menolak"} penelitian "${pendingSubmissions.find((s) => s.id === pendingAction.id)?.title}"? Tindakan ini akan dicatat dalam sistem.` : ""}
        confirmLabel={pendingAction?.decision === "approved" ? "Ya, Setujui" : "Ya, Tolak"}
        variant={pendingAction?.decision === "approved" ? "info" : "danger"}
        onConfirm={confirmDecision}
        onCancel={() => setPendingAction(null)}
      />
    </div>
  );
}