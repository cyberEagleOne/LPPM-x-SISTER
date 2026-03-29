import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ChevronRight, ClipboardCheck } from "lucide-react";
import { PageWrapper } from "../../components/PageWrapper";

// Reusable index + list for both Kegiatan and Publikasi review

interface PeriodeItem {
  id: string;
  label: string;
  tahunAjaran: string;
  semester: string;
  totalItem: number;
}

interface DataItem {
  id: string;
  judul: string;
  dosen: string;
  tanggal: string;
  status: "submitted" | "approved" | "revisi";
}

const MOCK_PERIODE: PeriodeItem[] = [
  { id: "P1", label: "2025/2026 Ganjil", tahunAjaran: "2025/2026", semester: "Ganjil", totalItem: 7 },
  { id: "P2", label: "2024/2025 Genap", tahunAjaran: "2024/2025", semester: "Genap", totalItem: 5 },
];

const MOCK_DATA: DataItem[] = [
  { id: "D1", judul: "laporan kegiatan penelitian AI", dosen: "Dr. Lestari Handayani", tanggal: "2026-02-20", status: "submitted" },
  { id: "D2", judul: "laporan monitoring IoT", dosen: "Dr. Arif Ramadhan", tanggal: "2026-02-18", status: "approved" },
  { id: "D3", judul: "laporan desain grafis UMKM", dosen: "Dr. Fajar Nugroho", tanggal: "2026-02-15", status: "revisi" },
];

const STATUS: Record<string, { label: string; cls: string }> = {
  submitted: { label: "Submitted", cls: "bg-blue-100 text-blue-700" },
  approved: { label: "Approved", cls: "bg-green-100 text-green-700" },
  revisi: { label: "Revisi", cls: "bg-orange-100 text-orange-700" },
};

// ─── ReviewKegiatanIndex ─────────────────────────────────────────────────────
export function ReviewKegiatanIndex() {
  const { jenis } = useParams<{ jenis: string }>();
  const navigate = useNavigate();
  const label = jenis === "penelitian" ? "Penelitian" : "PKM";

  return (
    <PageWrapper
      title={`Review Kegiatan ${label}`}
      subtitle="Pilih periode untuk melihat daftar laporan kegiatan"
      breadcrumbs={[{ label: "Reviewer" }, { label: `Review Kegiatan ${label}` }]}
    >
      <div className="space-y-3">
        {MOCK_PERIODE.map((p) => (
          <div key={p.id} onClick={() => navigate(`/reviewer/kegiatan/${p.id}/${jenis}`)}
            className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-5 py-4 cursor-pointer hover:border-[#E30613]/30 hover:shadow-sm transition-all group">
            <div>
              <p className="text-sm font-semibold text-slate-800">{p.tahunAjaran} — {p.semester}</p>
              <p className="text-xs text-slate-500 mt-0.5">{p.totalItem} laporan kegiatan</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#E30613] transition-colors" />
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}

// ─── ReviewKegiatanList ──────────────────────────────────────────────────────
export function ReviewKegiatanList() {
  const { pid, jenis } = useParams<{ pid: string; jenis: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState(MOCK_DATA);

  const handleApprove = (id: string) => setData((prev) => prev.map((d) => d.id === id ? { ...d, status: "approved" as const } : d));

  return (
    <PageWrapper
      title={`Daftar Laporan Kegiatan`}
      breadcrumbs={[{ label: "Reviewer" }, { label: "Review Kegiatan", path: `/reviewer/kegiatan/${jenis}` }, { label: pid ?? "" }]}
      actions={
        <button onClick={() => navigate(`/reviewer/kegiatan/${jenis}`)} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
          ← Kembali
        </button>
      }
    >
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-slate-100">{["No.", "Judul", "Dosen", "Tanggal", "Status", "Aksi"].map((h) => (<th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500">{h}</th>))}</tr></thead>
            <tbody className="divide-y divide-slate-50">
              {data.map((item, i) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3.5 text-sm text-slate-400">{i + 1}</td>
                  <td className="px-5 py-3.5 text-sm font-medium text-slate-800">{item.judul}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-600">{item.dosen}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-600 whitespace-nowrap">{item.tanggal}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${STATUS[item.status]?.cls}`}>{STATUS[item.status]?.label}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    {item.status === "submitted" && (
                      <button onClick={() => handleApprove(item.id)} className="flex items-center gap-1.5 text-xs font-medium text-green-600 hover:text-green-800">
                        <ClipboardCheck className="w-3.5 h-3.5" /> Validasi
                      </button>
                    )}
                    {item.status === "approved" && <span className="text-xs text-green-500 font-medium">✅ Tervalidasi</span>}
                    {item.status === "revisi" && <span className="text-xs text-orange-500 font-medium">Revisi</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageWrapper>
  );
}

// ─── ReviewPublikasiIndex ────────────────────────────────────────────────────
export function ReviewPublikasiIndex() {
  const { jenis } = useParams<{ jenis: string }>();
  const navigate = useNavigate();
  const JENIS_LABEL: Record<string, string> = { artikel: "Artikel", buku: "Buku", haki: "HAKI", prototipe: "Prototipe" };
  const label = JENIS_LABEL[jenis ?? ""] ?? jenis;

  return (
    <PageWrapper
      title={`Review Publikasi ${label}`}
      subtitle="Pilih periode untuk melihat daftar laporan publikasi"
      breadcrumbs={[{ label: "Reviewer" }, { label: `Review Publikasi ${label}` }]}
    >
      <div className="space-y-3">
        {MOCK_PERIODE.map((p) => (
          <div key={p.id} onClick={() => navigate(`/reviewer/publikasi/${p.id}/${jenis}`)}
            className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-5 py-4 cursor-pointer hover:border-[#E30613]/30 hover:shadow-sm transition-all group">
            <div>
              <p className="text-sm font-semibold text-slate-800">{p.tahunAjaran} — {p.semester}</p>
              <p className="text-xs text-slate-500 mt-0.5">{p.totalItem} laporan publikasi</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#E30613] transition-colors" />
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}

// ─── ReviewPublikasiList ─────────────────────────────────────────────────────
export function ReviewPublikasiList() {
  const { pid, jenis } = useParams<{ pid: string; jenis: string }>();
  const navigate = useNavigate();
  const JENIS_LABEL: Record<string, string> = { artikel: "Artikel", buku: "Buku", haki: "HAKI", prototipe: "Prototipe" };
  const [data, setData] = useState(MOCK_DATA);

  const handleApprove = (id: string) => setData((prev) => prev.map((d) => d.id === id ? { ...d, status: "approved" as const } : d));

  return (
    <PageWrapper
      title={`Daftar Publikasi ${JENIS_LABEL[jenis ?? ""] ?? jenis}`}
      breadcrumbs={[{ label: "Reviewer" }, { label: "Review Publikasi", path: `/reviewer/publikasi/${jenis}` }, { label: pid ?? "" }]}
      actions={
        <button onClick={() => navigate(`/reviewer/publikasi/${jenis}`)} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
          ← Kembali
        </button>
      }
    >
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-slate-100">{["No.", "Judul / Publikasi", "Dosen", "Tanggal", "Status", "Aksi"].map((h) => (<th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500">{h}</th>))}</tr></thead>
            <tbody className="divide-y divide-slate-50">
              {data.map((item, i) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3.5 text-sm text-slate-400">{i + 1}</td>
                  <td className="px-5 py-3.5 text-sm font-medium text-slate-800">{item.judul}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-600">{item.dosen}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-600 whitespace-nowrap">{item.tanggal}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${STATUS[item.status]?.cls}`}>{STATUS[item.status]?.label}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    {item.status === "submitted" && (
                      <button onClick={() => handleApprove(item.id)} className="flex items-center gap-1.5 text-xs font-medium text-green-600 hover:text-green-800">
                        <ClipboardCheck className="w-3.5 h-3.5" /> Validasi
                      </button>
                    )}
                    {item.status === "approved" && <span className="text-xs text-green-500 font-medium">✅ Tervalidasi</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageWrapper>
  );
}
