import { useState } from "react";
import { Bell, CheckCheck, Trash2, Banknote, FileSignature, BookMarked, AlertCircle, CheckCircle, Mail, Inbox, Send, Eye, Clock, ArrowRight, MailOpen, RefreshCw } from "lucide-react";
import { Link } from "react-router";
import { PageWrapper } from "../components/PageWrapper";
import { useAuth } from "../context/AuthContext";

// ====== Tab: Notifikasi In-App ======

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "hibah" | "surat-tugas" | "publikasi" | "system";
  link: string;
  read: boolean;
  createdAt: string;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "1", title: "Hibah Perlu Di-review", message: 'Pengajuan hibah "Penelitian IoT untuk Smart Campus" menunggu review Anda.', type: "hibah", link: "/admin/hibah", read: false, createdAt: "2 jam lalu" },
  { id: "2", title: "Surat Tugas Disetujui", message: "Surat tugas untuk Seminar Nasional telah disetujui oleh Ketua LPPM.", type: "surat-tugas", link: "/admin/surat-tugas", read: false, createdAt: "5 jam lalu" },
  { id: "3", title: "Revisi Publikasi", message: 'Publikasi "Jurnal AI & Education Q1" memerlukan revisi. Silakan periksa catatan reviewer.', type: "publikasi", link: "/admin/publikasi-pengajuan", read: false, createdAt: "1 hari lalu" },
  { id: "4", title: "Hibah Approved", message: 'Hibah "Pengembangan AI Chatbot" telah disetujui dan siap diproses finance.', type: "hibah", link: "/admin/hibah", read: true, createdAt: "2 hari lalu" },
  { id: "5", title: "Pemeliharaan Sistem", message: "Sistem akan mengalami pemeliharaan pada Sabtu, 1 Maret 2026 pukul 22:00-00:00.", type: "system", link: "#", read: true, createdAt: "3 hari lalu" },
  { id: "6", title: "Surat Tugas Baru", message: "Anda ditugaskan sebagai pembicara Workshop Machine Learning.", type: "surat-tugas", link: "/admin/surat-tugas", read: true, createdAt: "5 hari lalu" },
];

const ICON_MAP = {
  hibah: Banknote,
  "surat-tugas": FileSignature,
  publikasi: BookMarked,
  system: AlertCircle,
};

const COLOR_MAP = {
  hibah: "bg-blue-50 text-blue-600",
  "surat-tugas": "bg-emerald-50 text-emerald-600",
  publikasi: "bg-purple-50 text-purple-600",
  system: "bg-amber-50 text-amber-600",
};

// ====== Tab: Email Notification Mockup ======

interface EmailNotification {
  id: string;
  subject: string;
  to: string;
  toName: string;
  from: string;
  trigger: string;
  module: string;
  status: "sent" | "pending" | "failed";
  sentAt: string;
  previewHtml: string;
}

const MOCK_EMAILS: EmailNotification[] = [
  {
    id: "EM-001",
    subject: "[siPPM] Proposal Hibah Anda Telah Di-submit — HIB-009",
    to: "budi.santoso@pradita.ac.id",
    toName: "Dr. Arif Ramadhan, M.Sc.",
    from: "noreply-sippm@pradita.ac.id",
    trigger: "Proposal Submit Permanen",
    module: "Hibah Internal",
    status: "sent",
    sentAt: "2026-03-03 09:45:30",
    previewHtml: "proposal-submit",
  },
  {
    id: "EM-002",
    subject: "[siPPM] Anda Ditugaskan Sebagai Reviewer — HIB-009",
    to: "siti.aminah@pradita.ac.id",
    toName: "Dr. Lestari Handayani",
    from: "noreply-sippm@pradita.ac.id",
    trigger: "Reviewer Assignment",
    module: "Hibah Internal",
    status: "sent",
    sentAt: "2026-03-03 09:46:00",
    previewHtml: "reviewer-assignment",
  },
  {
    id: "EM-003",
    subject: "[siPPM] Proposal Hibah Anda Disetujui — HIB-002",
    to: "rina.wulandari@pradita.ac.id",
    toName: "Dr. Rina Wulandari",
    from: "noreply-sippm@pradita.ac.id",
    trigger: "Hibah Approved",
    module: "Hibah Internal",
    status: "sent",
    sentAt: "2026-03-03 09:30:15",
    previewHtml: "proposal-approved",
  },
  {
    id: "EM-004",
    subject: "[siPPM] Proposal Memerlukan Revisi — HIB-003",
    to: "ahmad.wijaya@pradita.ac.id",
    toName: "Prof. Dimas Prakoso",
    from: "noreply-sippm@pradita.ac.id",
    trigger: "Review: Revisi Diminta",
    module: "Hibah Internal",
    status: "sent",
    sentAt: "2026-03-02 16:20:00",
    previewHtml: "proposal-revision",
  },
  {
    id: "EM-005",
    subject: "[siPPM] Track Record Anda Telah Diverifikasi — TR-040",
    to: "budi.santoso@pradita.ac.id",
    toName: "Dr. Arif Ramadhan, M.Sc.",
    from: "noreply-sippm@pradita.ac.id",
    trigger: "Track Record Verified",
    module: "Track Record",
    status: "sent",
    sentAt: "2026-03-01 10:35:00",
    previewHtml: "track-record-verified",
  },
  {
    id: "EM-006",
    subject: "[siPPM] Data Freeze Dimulai — Periode Q1 2026",
    to: "all-dosen@pradita.ac.id",
    toName: "Semua Dosen",
    from: "noreply-sippm@pradita.ac.id",
    trigger: "HRD Freeze Activated",
    module: "HRD",
    status: "pending",
    sentAt: "-",
    previewHtml: "freeze-notification",
  },
  {
    id: "EM-007",
    subject: "[siPPM] Undangan Tim Proposal — HIB-009",
    to: "hendra.kusuma@pradita.ac.id",
    toName: "Dr. Fajar Nugroho",
    from: "noreply-sippm@pradita.ac.id",
    trigger: "Team Member Invitation",
    module: "Hibah Internal",
    status: "failed",
    sentAt: "2026-03-02 15:22:00",
    previewHtml: "team-invitation",
  },
];

const STATUS_EMAIL_COLORS = {
  sent: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500", label: "Terkirim" },
  pending: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500", label: "Pending" },
  failed: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500", label: "Gagal" },
};

type TabType = "inbox" | "email";

function mapNotificationLinkByRole(link: string, isReviewer: boolean) {
  if (!isReviewer) return link;
  if (link === "/admin/hibah") return "/reviewer/hibah";
  if (link === "/admin/surat-tugas") return "/reviewer/surat-tugas";
  if (link === "/admin/publikasi-pengajuan") return "/reviewer/publikasi/artikel";
  return link.replace(/^\/admin/, "/reviewer");
}

export function NotifikasiPage() {
  const { user } = useAuth();
  const isReviewer = user?.role === "reviewer";
  const [activeTab, setActiveTab] = useState<TabType>("inbox");
  const [notifications, setNotifications] = useState(() =>
    MOCK_NOTIFICATIONS.map((item) => ({
      ...item,
      link: mapNotificationLinkByRole(item.link, isReviewer),
    })),
  );
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [previewEmail, setPreviewEmail] = useState<EmailNotification | null>(null);
  const [emailFilter, setEmailFilter] = useState("all");

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filtered = filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const markRead = (id: string) => setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  const deleteNotif = (id: string) => setNotifications((prev) => prev.filter((n) => n.id !== id));

  const filteredEmails = MOCK_EMAILS.filter((e) => emailFilter === "all" || e.status === emailFilter);

  return (
    <PageWrapper
      title="Notifikasi"
      subtitle={activeTab === "inbox" ? `${unreadCount} belum dibaca` : `${MOCK_EMAILS.length} email notifikasi`}
      breadcrumbs={[{ label: "Notifikasi" }]}
      actions={
        activeTab === "inbox" ? (
          <button onClick={markAllRead} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors" style={{ fontWeight: 500 }}>
            <CheckCheck className="w-4 h-4" /> Tandai Semua Dibaca
          </button>
        ) : (
          <button className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors" style={{ fontWeight: 500 }}>
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        )
      }
    >
      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {([
          { key: "inbox" as TabType, label: "Notifikasi", icon: Bell, badge: unreadCount },
          { key: "email" as TabType, label: "Email Mockup", icon: Mail, badge: 0 },
        ]).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-colors ${
              activeTab === tab.key ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
            style={{ fontWeight: activeTab === tab.key ? 600 : 400 }}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.badge > 0 && (
              <span className="min-w-[18px] h-[18px] flex items-center justify-center px-1 text-[10px] bg-[#E30613] text-white rounded-full" style={{ fontWeight: 600 }}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ======== TAB 1: Notifikasi In-App ======== */}
      {activeTab === "inbox" && (
        <>
          <div className="flex gap-2">
            {(["all", "unread"] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 text-sm rounded-lg transition-colors ${filter === f ? "bg-[#E30613] text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`} style={{ fontWeight: 500 }}>
                {f === "all" ? "Semua" : `Belum Dibaca (${unreadCount})`}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-50">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center py-16">
                <Bell className="w-12 h-12 text-slate-300 mb-4" />
                <p className="text-sm text-slate-500" style={{ fontWeight: 500 }}>Tidak ada notifikasi</p>
              </div>
            ) : (
              filtered.map((n) => {
                const Icon = ICON_MAP[n.type];
                const color = COLOR_MAP[n.type];
                return (
                  <div key={n.id} className={`flex items-start gap-4 px-5 py-4 hover:bg-slate-50/50 transition-colors ${!n.read ? "bg-blue-50/30" : ""}`}>
                    <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <Link to={n.link} onClick={() => markRead(n.id)} className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-slate-800" style={{ fontWeight: n.read ? 400 : 600 }}>{n.title}</p>
                        {!n.read && <span className="w-2 h-2 bg-[#E30613] rounded-full shrink-0" />}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.message}</p>
                      <p className="text-[11px] text-slate-400 mt-1">{n.createdAt}</p>
                    </Link>
                    <button onClick={() => deleteNotif(n.id)} className="p-1.5 text-slate-300 hover:text-red-500 rounded-md transition-colors shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}

      {/* ======== TAB 2: Email Notification Mockup ======== */}
      {activeTab === "email" && !previewEmail && (
        <>
          <div className="flex gap-2">
            {([
              { key: "all", label: "Semua" },
              { key: "sent", label: "Terkirim" },
              { key: "pending", label: "Pending" },
              { key: "failed", label: "Gagal" },
            ]).map((f) => (
              <button
                key={f.key}
                onClick={() => setEmailFilter(f.key)}
                className={`px-4 py-2 text-sm rounded-lg transition-colors ${emailFilter === f.key ? "bg-[#E30613] text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}
                style={{ fontWeight: 500 }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Email summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: "Terkirim", count: MOCK_EMAILS.filter((e) => e.status === "sent").length, icon: Send, color: "text-green-600", bg: "bg-green-50" },
              { label: "Pending", count: MOCK_EMAILS.filter((e) => e.status === "pending").length, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
              { label: "Gagal", count: MOCK_EMAILS.filter((e) => e.status === "failed").length, icon: AlertCircle, color: "text-red-600", bg: "bg-red-50" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-xl text-slate-900" style={{ fontWeight: 700 }}>{stat.count}</p>
                  <p className="text-xs text-slate-500">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Email list */}
          <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-50">
            {filteredEmails.map((email) => {
              const statusConfig = STATUS_EMAIL_COLORS[email.status];
              return (
                <div
                  key={email.id}
                  className="flex items-start gap-4 px-5 py-4 hover:bg-slate-50/50 transition-colors cursor-pointer"
                  onClick={() => setPreviewEmail(email)}
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm text-slate-800 truncate" style={{ fontWeight: 600 }}>{email.subject}</p>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      To: {email.toName} &lt;{email.to}&gt;
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-50 text-slate-500" style={{ fontWeight: 500 }}>{email.module}</span>
                      <span className="text-[11px] text-slate-400">•</span>
                      <span className="text-[11px] text-slate-400">{email.trigger}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${statusConfig.bg} ${statusConfig.text}`} style={{ fontWeight: 500 }}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
                      {statusConfig.label}
                    </span>
                    <span className="text-[11px] text-slate-400">{email.sentAt !== "-" ? email.sentAt.split(" ")[1] : "-"}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ======== Email Preview ======== */}
      {activeTab === "email" && previewEmail && (
        <EmailPreview email={previewEmail} onBack={() => setPreviewEmail(null)} />
      )}
    </PageWrapper>
  );
}

// ====== Email Preview Component ======

function EmailPreview({ email, onBack }: { email: EmailNotification; onBack: () => void }) {
  return (
    <div className="space-y-4">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-500 hover:text-[#E30613] transition-colors" style={{ fontWeight: 500 }}>
        <ArrowRight className="w-4 h-4 rotate-180" /> Kembali ke daftar email
      </button>

      {/* Email metadata */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E30613] to-[#ff4757] flex items-center justify-center text-white text-xs" style={{ fontWeight: 600 }}>
              SP
            </div>
            <div>
              <p className="text-sm text-slate-800" style={{ fontWeight: 600 }}>siPPM Pradita University</p>
              <p className="text-xs text-slate-400">{email.from}</p>
            </div>
          </div>
          <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${STATUS_EMAIL_COLORS[email.status].bg} ${STATUS_EMAIL_COLORS[email.status].text}`} style={{ fontWeight: 500 }}>
            <span className={`w-1.5 h-1.5 rounded-full ${STATUS_EMAIL_COLORS[email.status].dot}`} />
            {STATUS_EMAIL_COLORS[email.status].label}
          </span>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex gap-12">
            <span className="text-slate-400 w-12 shrink-0">To:</span>
            <span className="text-slate-700">{email.toName} &lt;{email.to}&gt;</span>
          </div>
          <div className="flex gap-12">
            <span className="text-slate-400 w-12 shrink-0">Subject:</span>
            <span className="text-slate-800" style={{ fontWeight: 600 }}>{email.subject}</span>
          </div>
          <div className="flex gap-12">
            <span className="text-slate-400 w-12 shrink-0">Sent:</span>
            <span className="text-slate-700">{email.sentAt}</span>
          </div>
          <div className="flex gap-12">
            <span className="text-slate-400 w-12 shrink-0">Trigger:</span>
            <span className="text-xs px-2 py-0.5 rounded bg-indigo-50 text-indigo-700" style={{ fontWeight: 500 }}>{email.trigger}</span>
          </div>
        </div>
      </div>

      {/* Email body mockup */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2 bg-slate-50">
          <Eye className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-500" style={{ fontWeight: 600 }}>Preview Email Template</span>
        </div>
        <div className="p-6">
          <div className="max-w-lg mx-auto border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            {/* Email header */}
            <div className="bg-gradient-to-r from-[#1e293b] to-[#334155] px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-white text-sm" style={{ fontWeight: 700 }}>siPPM</p>
                  <p className="text-white/60 text-[10px]">Pradita University</p>
                </div>
              </div>
            </div>

            {/* Email body */}
            <div className="px-6 py-6 space-y-4">
              <p className="text-sm text-slate-600">Yth. <span style={{ fontWeight: 600 }}>{email.toName}</span>,</p>

              {email.previewHtml === "proposal-submit" && (
                <>
                  <p className="text-sm text-slate-600">Proposal hibah internal Anda telah berhasil di-submit dan sedang dalam proses review.</p>
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                    <p className="text-xs text-blue-500 uppercase" style={{ fontWeight: 600 }}>Detail Proposal</p>
                    <p className="text-sm text-slate-800 mt-1" style={{ fontWeight: 600 }}>Penelitian Blockchain untuk Identitas Digital</p>
                    <p className="text-xs text-slate-500 mt-1">ID: HIB-009 | Skema: Penelitian Terapan</p>
                    <p className="text-xs text-slate-500">Dana: Rp 35.000.000</p>
                  </div>
                  <p className="text-sm text-slate-600">Proposal Anda akan di-review oleh 3 pihak secara paralel: Reviewer Substansi, Admin LPPM, dan Finance.</p>
                </>
              )}

              {email.previewHtml === "reviewer-assignment" && (
                <>
                  <p className="text-sm text-slate-600">Anda telah ditugaskan sebagai <span style={{ fontWeight: 600 }}>reviewer substansi</span> untuk proposal hibah berikut:</p>
                  <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
                    <p className="text-xs text-purple-500 uppercase" style={{ fontWeight: 600 }}>Proposal untuk Di-review</p>
                    <p className="text-sm text-slate-800 mt-1" style={{ fontWeight: 600 }}>Penelitian Blockchain untuk Identitas Digital</p>
                    <p className="text-xs text-slate-500 mt-1">ID: HIB-009 | Skema: Penelitian Terapan</p>
                  </div>
                  <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                    <p className="text-xs text-amber-700">Ini adalah blind review. Identitas pengusul tidak akan ditampilkan.</p>
                  </div>
                </>
              )}

              {email.previewHtml === "proposal-approved" && (
                <>
                  <p className="text-sm text-slate-600">Selamat! Proposal hibah internal Anda telah <span className="text-green-600" style={{ fontWeight: 600 }}>disetujui</span>.</p>
                  <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <p className="text-xs text-green-600 uppercase" style={{ fontWeight: 600 }}>Approved</p>
                    </div>
                    <p className="text-sm text-slate-800" style={{ fontWeight: 600 }}>Pengembangan AI Chatbot untuk Layanan Akademik</p>
                    <p className="text-xs text-slate-500 mt-1">ID: HIB-002 | Skor Review: 87/100</p>
                  </div>
                  <p className="text-sm text-slate-600">Langkah selanjutnya: menunggu proses pencairan dana oleh tim Finance.</p>
                </>
              )}

              {email.previewHtml === "proposal-revision" && (
                <>
                  <p className="text-sm text-slate-600">Proposal hibah Anda memerlukan <span className="text-orange-600" style={{ fontWeight: 600 }}>revisi</span>. Silakan perbaiki sesuai catatan reviewer.</p>
                  <div className="bg-orange-50 border border-orange-100 rounded-lg p-4">
                    <p className="text-xs text-orange-500 uppercase" style={{ fontWeight: 600 }}>Catatan Reviewer</p>
                    <p className="text-sm text-slate-700 mt-1">"Metodologi perlu diperkuat. Tambahkan justifikasi pemilihan sampel."</p>
                  </div>
                  <p className="text-sm text-slate-600">Silakan login ke siPPM dan upload dokumen revisi sebelum tenggat waktu.</p>
                </>
              )}

              {email.previewHtml === "track-record-verified" && (
                <>
                  <p className="text-sm text-slate-600">Track record publikasi Anda telah <span className="text-green-600" style={{ fontWeight: 600 }}>terverifikasi</span> oleh Ketua LPPM.</p>
                  <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4">
                    <p className="text-xs text-emerald-500 uppercase" style={{ fontWeight: 600 }}>Verified</p>
                    <p className="text-sm text-slate-800 mt-1" style={{ fontWeight: 600 }}>Publikasi Q1 Scopus</p>
                    <p className="text-xs text-slate-500 mt-1">ID: TR-040</p>
                  </div>
                  <p className="text-sm text-slate-600">Anda dapat men-download sertifikat verifikasi dari menu Sertifikat di siPPM.</p>
                </>
              )}

              {email.previewHtml === "freeze-notification" && (
                <>
                  <p className="text-sm text-slate-600">Pemberitahuan: <span className="text-red-600" style={{ fontWeight: 600 }}>Data Freeze Period</span> akan dimulai.</p>
                  <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                    <p className="text-xs text-red-500 uppercase" style={{ fontWeight: 600 }}>Data Freeze</p>
                    <p className="text-sm text-slate-800 mt-1" style={{ fontWeight: 600 }}>Periode: 1 Mar 2026 — 15 Mar 2026</p>
                    <p className="text-xs text-slate-500 mt-1">Selama periode ini, Anda tidak dapat mengedit data track record.</p>
                  </div>
                  <p className="text-sm text-slate-600">Pastikan semua data Anda sudah lengkap sebelum freeze dimulai.</p>
                </>
              )}

              {email.previewHtml === "team-invitation" && (
                <>
                  <p className="text-sm text-slate-600">Anda telah diundang sebagai <span style={{ fontWeight: 600 }}>anggota tim peneliti</span> untuk proposal hibah berikut:</p>
                  <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
                    <p className="text-xs text-indigo-500 uppercase" style={{ fontWeight: 600 }}>Undangan Tim</p>
                    <p className="text-sm text-slate-800 mt-1" style={{ fontWeight: 600 }}>Penelitian Blockchain untuk Identitas Digital</p>
                    <p className="text-xs text-slate-500 mt-1">Ketua: Dr. Arif Ramadhan, M.Sc.</p>
                  </div>
                  <p className="text-sm text-slate-600">Silakan login ke siPPM dan tekan tombol <span style={{ fontWeight: 600 }}>Approve</span> untuk menyetujui partisipasi Anda.</p>
                </>
              )}

              {/* CTA button */}
              <div className="text-center py-2">
                <span className="inline-block px-6 py-2.5 bg-[#E30613] text-white text-sm rounded-lg" style={{ fontWeight: 500 }}>
                  Buka siPPM Dashboard
                </span>
              </div>

              <div className="border-t border-slate-100 pt-4 mt-4">
                <p className="text-[11px] text-slate-400 text-center">
                  Email ini dikirim secara otomatis oleh siPPM — Sistem Informasi Penelitian dan Pengabdian kepada Masyarakat, Pradita University.
                  <br />Jangan membalas email ini.
                </p>
              </div>
            </div>

            {/* Email footer */}
            <div className="bg-slate-50 px-6 py-3 border-t border-slate-100">
              <p className="text-[10px] text-slate-400 text-center">&copy; 2026 LPPM Pradita University. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
