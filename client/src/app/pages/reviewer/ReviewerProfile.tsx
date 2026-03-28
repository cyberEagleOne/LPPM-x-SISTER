import { useMemo, useState } from "react";
import { Mail, Phone, MapPin, Calendar, Award, GraduationCap, ClipboardCheck, CheckCircle, XCircle, Clock, BookOpen, Search, X, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { useReviewerData } from "./reviewerStore";
import { Link } from "react-router";

const statusCfg: Record<string, string> = {
  Disetujui: "bg-green-100 text-green-700",
  Pending: "bg-amber-100 text-amber-700",
  Ditolak: "bg-red-100 text-red-700",
};

const profile = {
  name: "Prof. Ahmad Fauzi, M.Sc., Ph.D.",
  email: "ahmad.fauzi@pradita.ac.id",
  phone: "+62 812-3456-7890",
  location: "Jakarta, Indonesia",
  expertise: "Teknik Informatika, AI & ML",
  position: "Guru Besar / Profesor",
  joined: "1 Januari 2020",
  avatar: "AF",
  subtitle: "Reviewer Eksternal — LPPM Universitas Pradita",
};

export function ReviewerProfile() {
  const { historyItems, counts } = useReviewerData();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"Semua" | "Disetujui" | "Ditolak" | "Pending">("Semua");
  const [prodi, setProdi] = useState("Semua Prodi");

  const reviewStats = useMemo(() => {
    return [
      { label: "Total Review", value: counts.total, icon: ClipboardCheck, color: "#065f46", bg: "#ecfdf5" },
      { label: "Disetujui", value: counts.approved, icon: CheckCircle, color: "#059669", bg: "#ecfdf5" },
      { label: "Ditolak", value: counts.rejected, icon: XCircle, color: "#dc2626", bg: "#fef2f2" },
      { label: "Pending", value: counts.pending, icon: Clock, color: "#d97706", bg: "#fffbeb" },
    ];
  }, [counts]);

  const prodiOptions = useMemo(() => {
    const set = new Set<string>();
    for (const i of historyItems) set.add(i.prodi);
    return ["Semua Prodi", ...Array.from(set).sort()];
  }, [historyItems]);

  const filteredHistory = useMemo(() => {
    const s = search.trim().toLowerCase();
    return historyItems.filter((i) => {
      const matchSearch =
        !s ||
        i.title.toLowerCase().includes(s) ||
        i.dosenName.toLowerCase().includes(s) ||
        i.prodi.toLowerCase().includes(s);
      const statusLabel =
        i.status === "approved" ? "Disetujui" : i.status === "rejected" ? "Ditolak" : "Pending";
      const matchStatus = status === "Semua" || statusLabel === status;
      const matchProdi = prodi === "Semua Prodi" || i.prodi === prodi;
      return matchSearch && matchStatus && matchProdi;
    });
  }, [historyItems, prodi, search, status]);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-gray-900">Profil Reviewer</h1>
          <p className="text-gray-500 mt-0.5" style={{ fontSize: 14 }}>
            Informasi akun dan riwayat review
          </p>
        </div>
      </div>

      {/* Profile card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
        <div className="h-32 relative" style={{ background: "linear-gradient(135deg, #065f46 0%, #059669 100%)" }}>
          <div className="absolute -bottom-12 left-8">
            <div
              className="w-24 h-24 rounded-2xl bg-white border-4 border-white shadow-lg flex items-center justify-center"
              style={{ backgroundColor: "#065f46" }}
            >
              <span className="text-white" style={{ fontSize: 32, fontWeight: 900 }}>
                {profile.avatar}
              </span>
            </div>
          </div>
        </div>
        <div className="pt-16 pb-6 px-8">
          <h2 className="text-gray-900">{profile.name}</h2>
          <p className="text-gray-500 mt-1" style={{ fontSize: 14 }}>
            {profile.subtitle}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
                <Mail size={15} className="text-green-700" />
              </div>
              <div>
                <p className="text-gray-400" style={{ fontSize: 11, fontWeight: 700 }}>
                  Email
                </p>
                <p className="text-gray-700" style={{ fontSize: 13 }}>
                  {profile.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
                <Phone size={15} className="text-green-700" />
              </div>
              <div>
                <p className="text-gray-400" style={{ fontSize: 11, fontWeight: 700 }}>
                  Telepon
                </p>
                <p className="text-gray-700" style={{ fontSize: 13 }}>
                  {profile.phone}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
                <MapPin size={15} className="text-green-700" />
              </div>
              <div>
                <p className="text-gray-400" style={{ fontSize: 11, fontWeight: 700 }}>
                  Lokasi
                </p>
                <p className="text-gray-700" style={{ fontSize: 13 }}>
                  {profile.location}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
                <GraduationCap size={15} className="text-green-700" />
              </div>
              <div>
                <p className="text-gray-400" style={{ fontSize: 11, fontWeight: 700 }}>
                  Keahlian
                </p>
                <p className="text-gray-700" style={{ fontSize: 13 }}>
                  {profile.expertise}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
                <Award size={15} className="text-green-700" />
              </div>
              <div>
                <p className="text-gray-400" style={{ fontSize: 11, fontWeight: 700 }}>
                  Jabatan
                </p>
                <p className="text-gray-700" style={{ fontSize: 13 }}>
                  {profile.position}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
                <Calendar size={15} className="text-green-700" />
              </div>
              <div>
                <p className="text-gray-400" style={{ fontSize: 11, fontWeight: 700 }}>
                  Bergabung
                </p>
                <p className="text-gray-700" style={{ fontSize: 13 }}>
                  {profile.joined}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {reviewStats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm"
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: s.bg }}>
              <s.icon size={18} style={{ color: s.color }} />
            </div>
            <p className="text-gray-900" style={{ fontSize: 28, fontWeight: 900, lineHeight: 1 }}>
              {s.value}
            </p>
            <p className="text-gray-500 mt-1" style={{ fontSize: 13 }}>
              {s.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* History */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ClipboardCheck size={18} className="text-[#065f46]" />
            <h2 className="text-gray-900">Riwayat Review</h2>
          </div>
          <span className="text-gray-400" style={{ fontSize: 13, fontWeight: 800 }}>
            {filteredHistory.length} item
          </span>
        </div>

        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/60">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2.5 shadow-sm flex-1">
              <Search size={16} className="text-gray-400 flex-shrink-0" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari judul / dosen / prodi..."
                className="flex-1 outline-none text-gray-700 bg-transparent"
                style={{ fontSize: 14 }}
              />
              {search && (
                <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600">
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="flex gap-3">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="border border-gray-200 rounded-lg px-3 py-2.5 bg-white text-gray-700 outline-none focus:border-[#065f46]"
                style={{ fontSize: 14 }}
              >
                <option value="Semua">Semua Status</option>
                <option value="Pending">Pending</option>
                <option value="Disetujui">Disetujui</option>
                <option value="Ditolak">Ditolak</option>
              </select>
              <select
                value={prodi}
                onChange={(e) => setProdi(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2.5 bg-white text-gray-700 outline-none focus:border-[#065f46]"
                style={{ fontSize: 14 }}
              >
                {prodiOptions.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-50">
          {filteredHistory.slice(0, 100).map((r) => {
            const label = r.status === "approved" ? "Disetujui" : r.status === "rejected" ? "Ditolak" : "Pending";
            return (
              <div key={r.id} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                  <BookOpen size={13} className="text-[#065f46]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 truncate" style={{ fontSize: 14, fontWeight: 700 }}>
                    {r.title}
                  </p>
                  <p className="text-gray-400 mt-0.5" style={{ fontSize: 12 }}>
                    {r.dosenName} · {r.status === "pending" ? r.submittedAt : r.decidedAt} · {r.prodi}
                  </p>
                </div>
                <Link
                  to={`/reviewer/penelitian/${r.id}`}
                  className="hidden sm:inline-flex items-center gap-1 text-[#065f46] hover:text-[#047857] transition-colors"
                  style={{ fontSize: 13, fontWeight: 800 }}
                >
                  Detail <ChevronRight size={14} />
                </Link>
                <span
                  className={`px-2.5 py-1 rounded-full flex-shrink-0 ${statusCfg[label]}`}
                  style={{ fontSize: 11, fontWeight: 700 }}
                >
                  {label}
                </span>
              </div>
            );
          })}

          {filteredHistory.length === 0 && (
            <div className="px-6 py-12 text-center text-gray-400">
              <ClipboardCheck size={32} className="mx-auto mb-3 text-gray-300" />
              <p style={{ fontSize: 14 }}>Tidak ada riwayat yang cocok dengan filter</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
