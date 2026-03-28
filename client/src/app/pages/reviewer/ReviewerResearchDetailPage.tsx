import { Link, useParams, useSearchParams } from "react-router";
import {
  ArrowLeft,
  Calendar,
  User,
  BookOpen,
  Database,
  CheckCircle,
  XCircle,
  AlertTriangle,
  CheckCheck,
  ClipboardCheck,
  Clock,
} from "lucide-react";
import { useMemo } from "react";
import { useReviewerData } from "./reviewerStore";

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
    icon: <CheckCircle size={16} className="text-green-600" />,
  },
  invalid: {
    label: "TIDAK VALID — Data tidak ditemukan di SISTER",
    className: "bg-red-100 text-red-700 border-red-200",
    icon: <XCircle size={16} className="text-red-500" />,
  },
  partial: {
    label: "SEBAGIAN VALID — Ada ketidaksesuaian data",
    className: "bg-amber-100 text-amber-700 border-amber-200",
    icon: <AlertTriangle size={16} className="text-amber-500" />,
  },
};

export function ReviewerResearchDetailPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const from = searchParams.get("from") || "";

  const rid = Number(id);
  const { submissions, historyItems, getDecision } = useReviewerData();

  const submission = useMemo(() => submissions.find((s) => s.id === rid), [rid, submissions]);
  const history = useMemo(() => historyItems.find((h) => h.id === rid), [rid, historyItems]);

  const status = submission ? getDecision(submission.id) : history?.status ?? "pending";

  const backHref =
    from === "approved"
      ? "/reviewer/approved"
      : from === "rejected"
      ? "/reviewer/rejected"
      : from === "pending"
      ? "/reviewer/pending"
      : "/reviewer/profile";

  if (!submission && !history) {
    return (
      <div className="bg-[#f1f5f9]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <Link
            to="/reviewer"
            className="inline-flex items-center gap-2 text-[#065f46] hover:text-[#047857]"
            style={{ fontSize: 14, fontWeight: 800 }}
          >
            <ArrowLeft size={16} /> Kembali
          </Link>
          <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h1 className="text-gray-900">Penelitian tidak ditemukan</h1>
            <p className="text-gray-500 mt-2" style={{ fontSize: 14 }}>
              ID penelitian tidak valid atau data tidak tersedia.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const title = submission?.title ?? history!.title;
  const dosenName = submission?.dosenName ?? history!.dosenName;
  const prodi = submission?.prodi ?? history!.prodi;
  const schema = submission?.schema ?? history!.schema;
  const submittedAt = submission?.submittedAt ?? history!.submittedAt;
  const decidedAt = history?.decidedAt ?? (status === "pending" ? "-" : "—");
  const note = history?.reviewerNote ?? "";

  const validity = submission ? validityConfig[submission.overallValidity] : null;

  const statusPill =
    status === "approved"
      ? { label: "Disetujui", cls: "bg-green-100 text-green-700 border-green-200", icon: <CheckCircle size={14} /> }
      : status === "rejected"
      ? { label: "Ditolak", cls: "bg-red-100 text-red-600 border-red-200", icon: <XCircle size={14} /> }
      : { label: "Pending", cls: "bg-amber-100 text-amber-700 border-amber-200", icon: <Clock size={14} /> };

  return (
    <div className="bg-[#f1f5f9] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <Link
            to={backHref}
            className="inline-flex items-center gap-2 text-[#065f46] hover:text-[#047857]"
            style={{ fontSize: 14, fontWeight: 800 }}
          >
            <ArrowLeft size={16} /> Kembali
          </Link>
          <span
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${statusPill.cls}`}
            style={{ fontSize: 12, fontWeight: 800 }}
          >
            {statusPill.icon} {statusPill.label}
          </span>
        </div>

        <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-8 py-7 border-b border-gray-100">
            <p className="text-gray-400" style={{ fontSize: 12, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Detail Penelitian
            </p>
            <h1 className="text-gray-900 mt-2" style={{ lineHeight: 1.25 }}>
              {title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4">
              <span className="flex items-center gap-1.5 text-gray-500" style={{ fontSize: 13 }}>
                <User size={14} className="text-gray-400" /> {dosenName}
              </span>
              <span className="text-gray-300">·</span>
              <span className="flex items-center gap-1.5 text-gray-500" style={{ fontSize: 13 }}>
                <BookOpen size={14} className="text-gray-400" /> {prodi}
              </span>
              <span className="text-gray-300">·</span>
              <span className="flex items-center gap-1.5 text-gray-500" style={{ fontSize: 13 }}>
                <Calendar size={14} className="text-gray-400" /> Submit: {submittedAt}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-700" style={{ fontSize: 12, fontWeight: 800 }}>
                {schema}
              </span>
            </div>

            {validity && (
              <div className="mt-4">
                <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${validity.className}`} style={{ fontSize: 12, fontWeight: 800 }}>
                  {validity.icon}
                  {validity.label}
                </span>
              </div>
            )}
          </div>

          <div className="px-8 py-7">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
                <p className="text-gray-400" style={{ fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Keputusan
                </p>
                <p className="text-gray-900 mt-2" style={{ fontSize: 15, fontWeight: 900 }}>
                  {statusPill.label}
                </p>
                <p className="text-gray-500 mt-1" style={{ fontSize: 13 }}>
                  Tanggal: {status === "pending" ? "-" : decidedAt}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 lg:col-span-2">
                <div className="flex items-center gap-2">
                  <ClipboardCheck size={16} className="text-gray-400" />
                  <p className="text-gray-700" style={{ fontSize: 12, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    Catatan Reviewer
                  </p>
                </div>
                <p className="text-gray-700 mt-2" style={{ fontSize: 14, lineHeight: 1.8 }}>
                  {note || (status === "pending" ? "Belum ada catatan." : "Tidak ada catatan tersimpan.")}
                </p>
              </div>
            </div>

            {submission ? (
              <div className="mt-6 rounded-2xl border border-gray-100 overflow-hidden">
                <div className="grid grid-cols-2 border-b border-gray-100">
                  <div className="px-6 py-3 bg-blue-50 border-r border-gray-100 flex items-center gap-2">
                    <BookOpen size={14} className="text-[#065f46]" />
                    <span className="text-[#065f46]" style={{ fontSize: 12, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      Data Pengajuan (Dosen)
                    </span>
                  </div>
                  <div className="px-6 py-3 bg-indigo-50 flex items-center gap-2">
                    <Database size={14} className="text-indigo-600" />
                    <span className="text-indigo-700" style={{ fontSize: 12, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      Data Referensi (SISTER)
                    </span>
                    {!submission.sisterFound && (
                      <span className="ml-auto px-2 py-0.5 rounded-full bg-red-100 text-red-600" style={{ fontSize: 10, fontWeight: 900 }}>
                        TIDAK DITEMUKAN
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  {submission.fields.map((field, idx) => {
                    const cfg = matchConfig[field.match];
                    return (
                      <div key={idx} className={`grid grid-cols-2 border-b border-gray-50 last:border-0 ${cfg.rowBg}`}>
                        <div className={`px-6 py-4 border-r border-gray-100 ${cfg.leftBorder}`}>
                          <p className="text-gray-400 mb-1" style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            {field.label}
                          </p>
                          <p className="text-gray-900" style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.6 }}>
                            {field.submitted}
                          </p>
                        </div>

                        <div className="px-6 py-4">
                          <p className="text-gray-400 mb-1" style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>
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
                              style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.6 }}
                            >
                              {field.sister}
                            </p>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full flex-shrink-0 ${cfg.badge}`} style={{ fontSize: 10, fontWeight: 900 }}>
                              {cfg.icon}
                              {cfg.label}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="mt-6 px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 flex items-start gap-3">
                <Database size={16} className="text-gray-400 flex-shrink-0 mt-0.5" />
                <p className="text-gray-500" style={{ fontSize: 13, lineHeight: 1.7 }}>
                  Detail perbandingan data pengajuan vs SISTER tidak tersedia untuk item riwayat ini (demo). Jika Anda ingin,
                  kita bisa lengkapi dataset riwayat agar semua item punya detail lengkap.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

