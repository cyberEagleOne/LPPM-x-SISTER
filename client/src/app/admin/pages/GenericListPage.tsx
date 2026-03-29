import { useState, useEffect } from "react";
import { Plus, Search, Filter, Eye, Edit, Trash2, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { PageWrapper, type BreadcrumbItem } from "../components/PageWrapper";
import { StatusBadge, type StatusType } from "../components/StatusBadge";
import { EmptyState } from "../components/EmptyState";
import { SkeletonTable } from "../components/SkeletonLoader";

export interface GenericItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  status: StatusType;
  date: string;
  extra?: string;
}

interface GenericListPageProps {
  pageTitle: string;
  pageSubtitle: string;
  breadcrumbs: BreadcrumbItem[];
  data: GenericItem[];
  columns: { key: string; label: string }[];
  statusOptions: { value: string; label: string }[];
  categoryOptions?: { value: string; label: string }[];
  canCreate?: boolean;
}

export function GenericListPage({ pageTitle, pageSubtitle, breadcrumbs, data: initialData, columns, statusOptions, canCreate = true }: GenericListPageProps) {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 6;

  useEffect(() => { const t = setTimeout(() => setLoading(false), 600); return () => clearTimeout(t); }, []);

  const filtered = initialData.filter((item) => {
    const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === "all" || item.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  return (
    <PageWrapper title={pageTitle} subtitle={pageSubtitle} breadcrumbs={breadcrumbs}
      actions={
        <div className="flex items-center gap-2">
          {canCreate && (
            <button className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-[#E30613] rounded-lg hover:bg-[#c00510] transition-all active:scale-95" style={{ fontWeight: 500 }}>
              <Plus className="w-4 h-4" /> Tambah Baru
            </button>
          )}
          <button className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50" style={{ fontWeight: 500 }}>
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      }>

      {loading ? <SkeletonTable rows={5} /> : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} placeholder="Cari..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613]/40 transition-all placeholder:text-slate-400" />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-600">
                <option value="all">Semua Status</option>
                {statusOptions.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </div>

          {paginated.length === 0 ? (
            <EmptyState variant={searchQuery ? "no-results" : "no-data"} onAction={() => { setSearchQuery(""); setStatusFilter("all"); }} actionLabel="Reset Filter" />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100">
                      {columns.map((c) => (
                        <th key={c.key} className="px-5 py-3 text-left text-xs text-slate-500 whitespace-nowrap" style={{ fontWeight: 600 }}>{c.label}</th>
                      ))}
                      <th className="px-5 py-3 text-left text-xs text-slate-500 whitespace-nowrap" style={{ fontWeight: 600 }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {paginated.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-3.5 text-sm text-slate-500 whitespace-nowrap" style={{ fontWeight: 500 }}>{item.id}</td>
                        <td className="px-5 py-3.5">
                          <p className="text-sm text-slate-800 max-w-[280px] truncate" style={{ fontWeight: 500 }}>{item.title}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{item.date}</p>
                        </td>
                        <td className="px-5 py-3.5 text-sm text-slate-600 whitespace-nowrap">{item.subtitle}</td>
                        <td className="px-5 py-3.5 text-sm text-slate-600 whitespace-nowrap">{item.category}</td>
                        {item.extra !== undefined && (
                          <td className="px-5 py-3.5 text-sm text-slate-700 whitespace-nowrap" style={{ fontWeight: 500 }}>{item.extra}</td>
                        )}
                        <td className="px-5 py-3.5 whitespace-nowrap"><StatusBadge status={item.status} /></td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1">
                            <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"><Eye className="w-4 h-4" /></button>
                            {item.status === "draft" && (
                              <>
                                <button className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"><Edit className="w-4 h-4" /></button>
                                <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"><Trash2 className="w-4 h-4" /></button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
                <p className="text-xs text-slate-500">Menampilkan {(currentPage - 1) * perPage + 1}-{Math.min(currentPage * perPage, filtered.length)} dari {filtered.length}</p>
                <div className="flex items-center gap-1">
                  <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-1.5 text-slate-400 disabled:opacity-30 rounded-md"><ChevronLeft className="w-4 h-4" /></button>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-8 h-8 text-xs rounded-md ${currentPage === i + 1 ? "bg-[#E30613] text-white" : "text-slate-600 hover:bg-slate-100"}`} style={{ fontWeight: 500 }}>{i + 1}</button>
                  ))}
                  <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-1.5 text-slate-400 disabled:opacity-30 rounded-md"><ChevronRight className="w-4 h-4" /></button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </PageWrapper>
  );
}
