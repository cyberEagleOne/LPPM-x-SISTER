import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, Search, User, Calendar, BookOpen, ChevronRight, CheckCircle, XCircle, AlertTriangle, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { DecidedItem } from "./reviewerData";

interface Props {
  title: string;
  description: string;
  status: "pending" | "approved" | "rejected";
  items: DecidedItem[];
  accentColor: string;
  accentBg: string;
  icon: React.ReactNode;
}

const matchScoreColor = (score: number) => {
  if (score >= 80) return "text-green-700 bg-green-100";
  if (score >= 50) return "text-amber-700 bg-amber-100";
  return "text-red-700 bg-red-100";
};

export function ReviewerTablePage({ title, description, status, items, accentColor, accentBg, icon }: Props) {
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<DecidedItem | null>(null);

  const filtered = items.filter(
    (i) =>
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.dosenName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link to="/reviewer" className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {icon}
            <h1 className="text-gray-900">{title}</h1>
          </div>
          <p className="text-gray-500 mt-0.5" style={{ fontSize: 14 }}>{description}</p>
        </div>
        <span
          className="px-4 py-2 rounded-full border"
          style={{ fontSize: 14, fontWeight: 700, color: accentColor, backgroundColor: accentBg, borderColor: accentColor + "30" }}
        >
          {filtered.length} Penelitian
        </span>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2.5 shadow-sm mb-6 max-w-md focus-within:border-[#065f46] focus-within:ring-2 focus-within:ring-[#065f46]/10 transition-all">
        <Search size={16} className="text-gray-400 flex-shrink-0" />
        <input
          type="text"
          placeholder="Cari judul atau nama dosen..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 outline-none text-gray-700 bg-transparent"
          style={{ fontSize: 14 }}
        />
        {search && (
          <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600">
            <X size={14} />
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-gray-500" style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Judul Penelitian</th>
                <th className="text-left px-4 py-3 text-gray-500 hidden md:table-cell" style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Dosen</th>
                <th className="text-center px-4 py-3 text-gray-500" style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Skema</th>
                <th className="text-center px-4 py-3 text-gray-500" style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  {status === "pending" ? "Tanggal Submit" : "Tanggal Keputusan"}
                </th>
                <th className="text-center px-4 py-3 text-gray-500" style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Match Score</th>
                <th className="text-center px-4 py-3 text-gray-500" style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((item, i) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                  className="hover:bg-gray-50/60 transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: accentBg }}>
                        <BookOpen size={13} style={{ color: accentColor }} />
                      </div>
                      <div>
                        <p className="text-gray-900" style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.4 }}>{item.title}</p>
                        <p className="text-gray-400 mt-0.5 md:hidden" style={{ fontSize: 12 }}>{item.dosenName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <p className="flex items-center gap-1.5 text-gray-600" style={{ fontSize: 13 }}>
                      <User size={12} className="text-gray-400" /> {item.dosenName}
                    </p>
                    <p className="text-gray-400 mt-0.5" style={{ fontSize: 12 }}>{item.prodi}</p>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-700" style={{ fontSize: 11, fontWeight: 600 }}>
                      {item.schema}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="flex items-center justify-center gap-1 text-gray-500" style={{ fontSize: 13 }}>
                      <Calendar size={12} /> {status === "pending" ? item.submittedAt : item.decidedAt}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full ${matchScoreColor(item.matchScore)}`} style={{ fontSize: 12, fontWeight: 700 }}>
                      {item.matchScore >= 80 ? <CheckCircle size={12} /> : item.matchScore >= 50 ? <AlertTriangle size={12} /> : <XCircle size={12} />}
                      {item.matchScore}%
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    {status === "pending" ? (
                      <div className="inline-flex items-center gap-3 justify-center">
                        <Link
                          to={`/reviewer?id=${item.id}`}
                          className="inline-flex items-center gap-1 text-[#065f46] hover:text-[#047857]"
                          style={{ fontSize: 13, fontWeight: 800 }}
                        >
                          Review <ChevronRight size={14} />
                        </Link>
                        <Link
                          to={`/reviewer/penelitian/${item.id}?from=pending`}
                          className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-700"
                          style={{ fontSize: 13, fontWeight: 800 }}
                        >
                          Detail <ChevronRight size={14} />
                        </Link>
                      </div>
                    ) : (
                      <Link
                        to={`/reviewer/penelitian/${item.id}?from=${status}`}
                        className="inline-flex items-center gap-1 text-[#065f46] hover:text-[#047857]"
                        style={{ fontSize: 13, fontWeight: 800 }}
                      >
                        Detail <ChevronRight size={14} />
                      </Link>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <BookOpen size={36} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400" style={{ fontSize: 15 }}>Tidak ada data penelitian</p>
          </div>
        )}
      </div>

    </div>
  );
}
