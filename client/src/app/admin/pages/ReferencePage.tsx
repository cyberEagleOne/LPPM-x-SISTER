export {
  FakultasPage,
  ProdiPage,
  PejabatPage,
  GroupReferencePage,
  NilaiReferencePage,
} from "./ReferenceCampusModern";

import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { PageWrapper } from "../components/PageWrapper";
import { SkeletonTable } from "../components/SkeletonLoader";

interface ReferenceItem {
  id: string;
  name: string;
  code?: string;
  description?: string;
}

interface ReferencePageProps {
  title: string;
  subtitle: string;
  breadcrumbLabel: string;
  data: ReferenceItem[];
  columns: { key: string; label: string }[];
}

export function ReferencePage({ title, subtitle, breadcrumbLabel, data, columns }: ReferencePageProps) {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => { const t = setTimeout(() => setLoading(false), 500); return () => clearTimeout(t); }, []);

  const filtered = data.filter((d) => d.name.toLowerCase().includes(searchQuery.toLowerCase()) || (d.code || "").toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <PageWrapper title={title} subtitle={subtitle} breadcrumbs={[{ label: "Referensi" }, { label: breadcrumbLabel }]}
      actions={<button className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-[#E30613] rounded-lg hover:bg-[#c00510] transition-all" style={{ fontWeight: 500 }}><Plus className="w-4 h-4" /> Tambah</button>}>
      {loading ? <SkeletonTable rows={4} /> : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Cari..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613]/40 placeholder:text-slate-400" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  {columns.map((c) => <th key={c.key} className="px-5 py-3 text-left text-xs text-slate-500" style={{ fontWeight: 600 }}>{c.label}</th>)}
                  <th className="px-5 py-3 text-left text-xs text-slate-500" style={{ fontWeight: 600 }}>Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3 text-sm text-slate-500" style={{ fontWeight: 500 }}>{d.id}</td>
                    <td className="px-5 py-3 text-sm text-slate-800" style={{ fontWeight: 500 }}>{d.name}</td>
                    {d.code !== undefined && <td className="px-5 py-3 text-sm text-slate-600">{d.code}</td>}
                    {d.description !== undefined && <td className="px-5 py-3 text-sm text-slate-600 max-w-[200px] truncate">{d.description}</td>}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"><Edit className="w-4 h-4" /></button>
                        <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}

// Pre-configured pages
function LegacyFakultasPage() {
  return <ReferencePage title="Fakultas" subtitle="Kelola data fakultas" breadcrumbLabel="Fakultas"
    data={[
      { id: "F01", name: "Fakultas Teknologi", code: "FT", description: "Teknik Informatika, Sistem Informasi" },
      { id: "F02", name: "Fakultas Bisnis", code: "FB", description: "Manajemen, Akuntansi" },
      { id: "F03", name: "Fakultas Desain", code: "FD", description: "Desain Komunikasi Visual, Arsitektur" },
      { id: "F04", name: "Fakultas Hospitality", code: "FH", description: "Hospitality & Pariwisata" },
    ]}
    columns={[{ key: "id", label: "ID" }, { key: "name", label: "Nama Fakultas" }, { key: "code", label: "Kode" }, { key: "desc", label: "Program Studi" }]} />;
}

function LegacyProdiPage() {
  return <ReferencePage title="Program Studi" subtitle="Kelola data program studi" breadcrumbLabel="Program Studi"
    data={[
      { id: "PS01", name: "Teknik Informatika", code: "TI", description: "Fakultas Teknologi" },
      { id: "PS02", name: "Sistem Informasi", code: "SI", description: "Fakultas Teknologi" },
      { id: "PS03", name: "Manajemen", code: "MN", description: "Fakultas Bisnis" },
      { id: "PS04", name: "Akuntansi", code: "AK", description: "Fakultas Bisnis" },
      { id: "PS05", name: "Desain Komunikasi Visual", code: "DKV", description: "Fakultas Desain" },
      { id: "PS06", name: "Arsitektur", code: "ARS", description: "Fakultas Desain" },
    ]}
    columns={[{ key: "id", label: "ID" }, { key: "name", label: "Program Studi" }, { key: "code", label: "Kode" }, { key: "desc", label: "Fakultas" }]} />;
}

function LegacyPejabatPage() {
  return <ReferencePage title="Pejabat Pradita" subtitle="Kelola data pejabat universitas" breadcrumbLabel="Pejabat"
    data={[
      { id: "PJ01", name: "Prof. Dr. Surya Kencana", description: "Rektor" },
      { id: "PJ02", name: "Prof. Dimas Prakoso", description: "Ketua LPPM" },
      { id: "PJ03", name: "Dr. Hadi Saputra", description: "Wakil Rektor Bidang Akademik" },
      { id: "PJ04", name: "Dr. Gilang Perdana", description: "Dekan Fakultas Teknologi" },
    ]}
    columns={[{ key: "id", label: "ID" }, { key: "name", label: "Nama" }, { key: "desc", label: "Jabatan" }]} />;
}

function LegacyGroupReferencePage() {
  return <ReferencePage title="Group Reference" subtitle="Kelola grup referensi data" breadcrumbLabel="Group Reference"
    data={[
      { id: "GR01", name: "Skema Hibah", code: "SKEMA", description: "Kategori skema hibah penelitian" },
      { id: "GR02", name: "Jenis Publikasi", code: "JENIS_PUB", description: "Kategori jenis publikasi" },
      { id: "GR03", name: "Status Kegiatan", code: "STATUS", description: "Status-status yang tersedia" },
      { id: "GR04", name: "Level Konferensi", code: "LEVEL_KONF", description: "Tingkat konferensi" },
    ]}
    columns={[{ key: "id", label: "ID" }, { key: "name", label: "Nama Group" }, { key: "code", label: "Kode" }, { key: "desc", label: "Deskripsi" }]} />;
}

function LegacyNilaiReferencePage() {
  return <ReferencePage title="Nilai Reference" subtitle="Kelola nilai-nilai referensi" breadcrumbLabel="Nilai Reference"
    data={[
      { id: "NR01", name: "Penelitian Dasar", code: "SKEMA", description: "Skema penelitian dasar" },
      { id: "NR02", name: "Penelitian Terapan", code: "SKEMA", description: "Skema penelitian terapan" },
      { id: "NR03", name: "Pengabdian", code: "SKEMA", description: "Skema pengabdian masyarakat" },
      { id: "NR04", name: "Jurnal", code: "JENIS_PUB", description: "Publikasi jurnal" },
      { id: "NR05", name: "Prosiding", code: "JENIS_PUB", description: "Publikasi prosiding" },
      { id: "NR06", name: "Buku", code: "JENIS_PUB", description: "Publikasi buku" },
      { id: "NR07", name: "HKI", code: "JENIS_PUB", description: "Hak Kekayaan Intelektual" },
    ]}
    columns={[{ key: "id", label: "ID" }, { key: "name", label: "Nilai" }, { key: "code", label: "Group" }, { key: "desc", label: "Deskripsi" }]} />;
}
