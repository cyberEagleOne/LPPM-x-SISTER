import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { Eye, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { PageWrapper } from "../components/PageWrapper";
import { SkeletonTable } from "../components/SkeletonLoader";
import { EmptyState } from "../components/EmptyState";

interface AnggotaHibahRow {
  id: string;
  tahunAjuan: string;
  judul: string;
  ketua: string;
  jenis: "Penelitian" | "PKM";
  tugas: string;
  persetujuan: "pending" | "disetujui" | "ditolak";
}

const MOCK: AnggotaHibahRow[] = [
  { id: "AH-001", tahunAjuan: "Genap 2025/2026", judul: "Penelitian IoT untuk Smart Campus Pradita", ketua: "Prof. Dimas Prakoso, Ph.D.", jenis: "Penelitian", tugas: "Pengembangan model machine learning", persetujuan: "disetujui" },
  { id: "AH-002", tahunAjuan: "Genap 2025/2026", judul: "Machine Learning untuk Prediksi Cuaca Lokal", ketua: "Dr. Lestari Handayani, M.Kom.", jenis: "Penelitian", tugas: "Analisis data dan validasi model", persetujuan: "pending" },
  { id: "AH-003", tahunAjuan: "Ganjil 2025/2026", judul: "Pengabdian Masyarakat Desa Digital", ketua: "Dr. Fajar Nugroho, M.Si.", jenis: "PKM", tugas: "Pelatihan masyarakat", persetujuan: "ditolak" },
];

const persetujuanConfig: Record<string, { label: string; cls: string }> = {
  pending: { label: "Menunggu", cls: "bg-amber-100 text-amber-700" },
  disetujui: { label: "Disetujui", cls: "bg-green-100 text-green-700" },
  ditolak: { label: "Ditolak", cls: "bg-red-100 text-red-700" },
};

export function AnggotaHibahListPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [data] = useState(MOCK);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 8;

  useEffect(() => { const t = setTimeout(() => setLoading(false), 400); return () => clearTimeout(t); }, []);

  const filtered = data.filter((d) =>
    d.judul.toLowerCase().includes(search.toLowerCase()) || d.ketua.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);
  const isReviewerShell = location.pathname.startsWith("/reviewer");
  const shellBase = isReviewerShell ? "/reviewer" : "/admin";
  const sectionLabel = isReviewerShell ? "Reviewer" : "Dosen";

  return (
    <PageWrapper
      title="Undangan Anggota Hibah"
      subtitle="Daftar hibah di mana Anda diundang sebagai anggota tim"
      breadcrumbs={[{ label: sectionLabel }, { label: "Hibah" }, { label: "Undangan Anggota" }]}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} placeholder="Cari judul atau ketua..." className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E30613]/20" />
        </div>
      </div>

      {loading ? <SkeletonTable rows={5} /> : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {paginated.length === 0
            ? <EmptyState variant={search ? "no-results" : "no-data"} title="Belum ada undangan" description="Anda belum diundang sebagai anggota hibah manapun." />
            : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/50">
                        {["Tahun Ajuan", "Judul", "Ketua", "Jenis", "Tugas", "Persetujuan", "Aksi"].map((h) => (
                          <th key={h} className="px-5 py-3 text-left text-xs text-slate-500 whitespace-nowrap" style={{ fontWeight: 600 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {paginated.map((item) => {
                        const cfg = persetujuanConfig[item.persetujuan];
                        return (
                          <tr key={item.id} className="hover:bg-slate-50/30">
                            <td className="px-5 py-4 text-sm text-slate-600 whitespace-nowrap">{item.tahunAjuan}</td>
                            <td className="px-5 py-4">
                              <p className="text-sm text-slate-900 max-w-[240px] truncate" style={{ fontWeight: 500 }}>{item.judul}</p>
                              <p className="text-xs text-slate-400">{item.id}</p>
                            </td>
                            <td className="px-5 py-4 text-sm text-slate-600 whitespace-nowrap">{item.ketua}</td>
                            <td className="px-5 py-4">
                              <span className={`text-xs px-2 py-0.5 rounded-full ${item.jenis === "Penelitian" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`} style={{ fontWeight: 600 }}>{item.jenis}</span>
                            </td>
                            <td className="px-5 py-4 text-sm text-slate-600 max-w-[160px] truncate">{item.tugas}</td>
                            <td className="px-5 py-4">
                              <span className={`text-xs px-2.5 py-1 rounded-full ${cfg.cls}`} style={{ fontWeight: 600 }}>{cfg.label}</span>
                            </td>
                            <td className="px-5 py-4">
                              <button onClick={() => navigate(`${shellBase}/hibah/anggota/detail/${item.id}`)}
                                className="flex items-center gap-1 p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                                <Eye className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {totalPages > 1 && (
                  <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-xs text-slate-500">Total: {filtered.length} undangan</p>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-1.5 text-slate-400 disabled:opacity-30"><ChevronLeft className="w-4 h-4" /></button>
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-8 h-8 text-xs rounded-md ${currentPage === i + 1 ? "bg-[#E30613] text-white" : "text-slate-600 hover:bg-slate-100"}`}>{i + 1}</button>
                      ))}
                      <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-1.5 text-slate-400 disabled:opacity-30"><ChevronRight className="w-4 h-4" /></button>
                    </div>
                  </div>
                )}
              </>
            )}
        </div>
      )}
    </PageWrapper>
  );
}
