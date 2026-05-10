import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { ChevronRight, ClipboardCheck } from "lucide-react";
import { PageWrapper } from "../../components/PageWrapper";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Textarea } from "../../../components/ui/textarea";
import { Label } from "../../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";

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
  status: string;
  komentar?: string;
}

// Helper utilities for dynamic data mapping
const getCategoryFromType = (item: any) => {
  const jp = (item.jenis_publikasi || '').toLowerCase();
  if (jp.includes('buku') || jp.includes('monograf') || jp.includes('book chapter')) return 'buku';
  if (jp.includes('haki') || jp.includes('paten') || (item.nomor_paten && String(item.nomor_paten).trim() !== "")) return 'haki';
  if (jp.includes('prototipe')) return 'prototipe';
  return 'artikel'; // fallback bucket
};

const getPeriodFromDate = (dateStr: string) => {
  if (!dateStr || dateStr.toLowerCase().includes('unknown')) return { ta: 'Tidak Diketahui', sem: 'Waktu' };
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return { ta: 'Tidak Diketahui', sem: 'Waktu' };
  
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  let ta = "";
  let sem = "";

  if (month >= 2 && month <= 7) {
    ta = `${year - 1}/${year}`;
    sem = "Genap";
  } else {
    sem = "Ganjil";
    if (month === 1) {
      ta = `${year - 1}/${year}`;
    } else {
      ta = `${year}/${year + 1}`;
    }
  }

  const validYears = ["2021/2022", "2022/2023", "2023/2024", "2024/2025", "2025/2026"];
  if (!validYears.includes(ta)) return { ta: 'DLL', sem: 'Waktu' };

  return { ta, sem };
};

const MOCK_PERIODE: PeriodeItem[] = [
  { id: "P1", label: "2025/2026 Genap", tahunAjaran: "2025/2026", semester: "Genap", totalItem: 0 },
  { id: "P2", label: "2025/2026 Ganjil", tahunAjaran: "2025/2026", semester: "Ganjil", totalItem: 0 },
  { id: "P3", label: "2024/2025 Genap", tahunAjaran: "2024/2025", semester: "Genap", totalItem: 0 },
  { id: "P4", label: "2024/2025 Ganjil", tahunAjaran: "2024/2025", semester: "Ganjil", totalItem: 0 },
  { id: "P5", label: "2023/2024 Genap", tahunAjaran: "2023/2024", semester: "Genap", totalItem: 0 },
  { id: "P6", label: "2023/2024 Ganjil", tahunAjaran: "2023/2024", semester: "Ganjil", totalItem: 0 },
  { id: "P7", label: "2022/2023 Genap", tahunAjaran: "2022/2023", semester: "Genap", totalItem: 0 },
  { id: "P8", label: "2022/2023 Ganjil", tahunAjaran: "2022/2023", semester: "Ganjil", totalItem: 0 },
  { id: "P9", label: "2021/2022 Genap", tahunAjaran: "2021/2022", semester: "Genap", totalItem: 0 },
  { id: "P10", label: "2021/2022 Ganjil", tahunAjaran: "2021/2022", semester: "Ganjil", totalItem: 0 },
  { id: "DLL", label: "DLL — Waktu", tahunAjaran: "DLL", semester: "Waktu", totalItem: 0 },
  { id: "UNKNOWN", label: "Tidak Diketahui — Waktu", tahunAjaran: "Tidak Diketahui", semester: "Waktu", totalItem: 0 },
];

const MOCK_DATA: DataItem[] = [
  { id: "D1", judul: "laporan kegiatan penelitian AI", dosen: "Dr. Lestari Handayani", tanggal: "2026-02-20", status: "submitted" },
  { id: "D2", judul: "laporan monitoring IoT", dosen: "Dr. Arif Ramadhan", tanggal: "2026-02-18", status: "approved", komentar: "Sudah sesuai" },
  { id: "D3", judul: "laporan desain grafis UMKM", dosen: "Dr. Fajar Nugroho", tanggal: "2026-02-15", status: "revisi", komentar: "Laporan kurang lengkap pada bagian lampiran" },
];

const STATUS: Record<string, { label: string; cls: string }> = {
  draft: { label: "Draft", cls: "bg-slate-100 text-slate-700" },
  submitted: { label: "Submitted", cls: "bg-blue-100 text-blue-700" },
  "pending-review": { label: "Pending Review", cls: "bg-yellow-100 text-yellow-700" },
  "submit-revisi": { label: "Submit Revisi", cls: "bg-purple-100 text-purple-700" },
  revisi: { label: "Revisi", cls: "bg-orange-100 text-orange-700" },
  approved: { label: "Approved", cls: "bg-green-100 text-green-700" },
  rejected: { label: "Rejected", cls: "bg-red-100 text-red-700" },
  verified: { label: "Verified", cls: "bg-teal-100 text-teal-700" },
  "read-finance": { label: "Read Finance", cls: "bg-sky-100 text-sky-700" },
  lunas: { label: "Lunas", cls: "bg-emerald-100 text-emerald-700" },
  hutang: { label: "Hutang", cls: "bg-rose-100 text-rose-700" },
  active: { label: "Active", cls: "bg-indigo-100 text-indigo-700" },
  inactive: { label: "Inactive", cls: "bg-gray-100 text-gray-700" },
  expired: { label: "Expired", cls: "bg-stone-100 text-stone-700" },
};

function ReviewModal({
  isOpen,
  onClose,
  item,
  onSave
}: {
  isOpen: boolean;
  onClose: () => void;
  item: DataItem | null;
  onSave: (id: string, status: string, komentar: string) => void;
}) {
  const [status, setStatus] = useState<string>("approved");
  const [komentar, setKomentar] = useState("");

  useEffect(() => {
    if (item) {
      setStatus(item.status === "submitted" ? "approved" : item.status);
      setKomentar(item.komentar || "");
    }
  }, [item]);

  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-800">Review Laporan</DialogTitle>
          <DialogDescription className="text-slate-500 mt-1.5">
            Tentukan status laporan dan berikan komentar atau catatan perbaikan.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-slate-700">Status Review</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full h-auto px-4 py-3 border-2 border-slate-200 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] text-base font-semibold text-slate-800 transition-colors hover:border-slate-300 [&>svg]:text-black [&>svg]:opacity-100 [&>svg]:w-5 [&>svg]:h-5">
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px] rounded-xl border-slate-200 shadow-lg p-0">
                {Object.keys(STATUS).map((key) => (
                  <SelectItem key={key} value={key} className="py-3 px-4 cursor-pointer font-medium text-slate-700 focus:bg-slate-50 focus:text-slate-900 border-b border-slate-200 last:border-0 rounded-none">
                    {STATUS[key].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label htmlFor="komentar" className="text-sm font-semibold text-slate-700">Komentar / Catatan</Label>
            <Textarea
              id="komentar"
              placeholder="Tambahkan komentar atau catatan perbaikan di sini..."
              value={komentar}
              onChange={(e) => setKomentar(e.target.value)}
              className="min-h-[140px] p-3.5 border-2 border-slate-200 rounded-xl focus-visible:ring-2 focus-visible:ring-[#E30613]/20 focus-visible:border-[#E30613] bg-white shadow-sm resize-y text-base"
            />
          </div>
        </div>

        <DialogFooter className="gap-3 sm:gap-0 pt-6 mt-2 border-t border-slate-100">
          <Button variant="outline" onClick={onClose} className="border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold px-6 py-2.5 h-auto rounded-lg">Batal</Button>
          <Button onClick={() => onSave(item.id, status, komentar)} className="bg-[#E30613] hover:bg-[#c20511] text-white font-semibold px-6 py-2.5 h-auto rounded-lg shadow-md transition-all">Simpan Review</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── ReviewKegiatanIndex ─────────────────────────────────────────────────────
export function ReviewKegiatanIndex() {
  const { jenis } = useParams<{ jenis: string }>();
  const navigate = useNavigate();
  const label = jenis === "penelitian" ? "Penelitian" : "PKM";
  const [filterYear, setFilterYear] = useState("all");

  const uniqueYears = Array.from(new Set(MOCK_PERIODE.map((p) => p.tahunAjaran))).sort().reverse();
  const filteredPeriode = filterYear === "all"
    ? MOCK_PERIODE
    : MOCK_PERIODE.filter((p) => p.tahunAjaran === filterYear);

  return (
    <PageWrapper
      title={`Review Kegiatan ${label}`}
      subtitle="Pilih periode untuk melihat daftar laporan kegiatan"
      breadcrumbs={[{ label: "Reviewer" }, { label: `Review Kegiatan ${label}` }]}
      actions={
        <div className="w-[220px]">
          <Select value={filterYear} onValueChange={setFilterYear}>
            <SelectTrigger className="w-full h-10 border border-slate-200 rounded-lg bg-white text-slate-700 font-medium shadow-sm">
              <SelectValue placeholder="Filter Tahun Ajaran" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200 shadow-lg">
              <SelectItem value="all" className="cursor-pointer font-medium text-slate-700">Semua Tahun Ajaran</SelectItem>
              {uniqueYears.map((yr) => (
                <SelectItem key={yr} value={yr} className="cursor-pointer font-medium text-slate-700">
                  Tahun {yr}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      }
    >
      <div className="space-y-3">
        {filteredPeriode.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500">
            Tidak ada periode yang tersedia.
          </div>
        ) : filteredPeriode.map((p) => (
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
  const [selectedItem, setSelectedItem] = useState<DataItem | null>(null);

  const handleSaveReview = (id: string, status: string, komentar: string) => {
    setData((prev) => prev.map((d) => d.id === id ? { ...d, status, komentar } : d));
    setSelectedItem(null);
  };

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
            <thead><tr className="border-b border-slate-100">{["No.", "Judul", "Dosen", "Tanggal", "Status", "Komentar", "Aksi"].map((h) => (<th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500">{h}</th>))}</tr></thead>
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
                  <td className="px-5 py-3.5 text-sm text-slate-600 truncate max-w-[150px]" title={item.komentar}>
                    {item.komentar || "-"}
                  </td>
                  <td className="px-5 py-3.5">
                    <button onClick={() => setSelectedItem(item)} className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-800">
                      <ClipboardCheck className="w-3.5 h-3.5" /> {item.status === "submitted" ? "Review" : "Ubah Review"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ReviewModal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        item={selectedItem}
        onSave={handleSaveReview}
      />
    </PageWrapper>
  );
}

// ─── ReviewPublikasiIndex ────────────────────────────────────────────────────
export function ReviewPublikasiIndex() {
  const { jenis } = useParams<{ jenis: string }>();
  const navigate = useNavigate();
  const JENIS_LABEL: Record<string, string> = { artikel: "Artikel", buku: "Buku", haki: "HAKI", prototipe: "Prototipe" };
  const label = JENIS_LABEL[jenis ?? ""] ?? jenis;
  const [filterYear, setFilterYear] = useState("all");
  const [periods, setPeriods] = useState<PeriodeItem[]>(MOCK_PERIODE);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDynamicCounts = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:3000/api/reviewer/publikasi');
        const result = await res.json();
        
        if (result.status === 'success') {
          // count items
          const frequency: Record<string, number> = {};
          
          result.data.forEach((item: any) => {
            const cat = getCategoryFromType(item);
            // must match category
            if (cat === (jenis || 'artikel')) {
              const { ta, sem } = getPeriodFromDate(item.tanggal);
              const key = `${ta}|${sem}`;
              frequency[key] = (frequency[key] || 0) + 1;
            }
          });

          setPeriods(MOCK_PERIODE.map(p => ({
            ...p,
            totalItem: frequency[`${p.tahunAjaran}|${p.semester}`] || 0
          })));
        }
      } catch (err) {
        console.error("Error syncing dynamic counts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDynamicCounts();
  }, [jenis]);

  const uniqueYears = Array.from(new Set(periods.map((p) => p.tahunAjaran))).sort().reverse();
  const filteredPeriode = filterYear === "all"
    ? periods
    : periods.filter((p) => p.tahunAjaran === filterYear);

  return (
    <PageWrapper
      title={`Review Publikasi ${label}`}
      subtitle="Pilih periode untuk melihat daftar laporan publikasi"
      breadcrumbs={[{ label: "Reviewer" }, { label: `Review Publikasi ${label}` }]}
      actions={
        <div className="w-[220px]">
          <Select value={filterYear} onValueChange={setFilterYear}>
            <SelectTrigger className="w-full h-10 border border-slate-200 rounded-lg bg-white text-slate-700 font-medium shadow-sm">
              <SelectValue placeholder="Filter Tahun Ajaran" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200 shadow-lg">
              <SelectItem value="all" className="cursor-pointer font-medium text-slate-700">Semua Tahun Ajaran</SelectItem>
              {uniqueYears.map((yr) => (
                <SelectItem key={yr} value={yr} className="cursor-pointer font-medium text-slate-700">
                  {yr === 'DLL' || yr === 'Tidak Diketahui' ? yr : `Tahun ${yr}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      }
    >
      <div className="space-y-3">
        {loading ? (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500">
            Memuat statistik periode...
          </div>
        ) : filteredPeriode.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500">
            Tidak ada periode yang tersedia.
          </div>
        ) : filteredPeriode.map((p) => (
          <div key={p.id} onClick={() => navigate(`/reviewer/publikasi/${p.id}/${jenis}`)}
            className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-5 py-4 cursor-pointer hover:border-[#E30613]/30 hover:shadow-sm transition-all group">
            <div>
              <p className="text-sm font-semibold text-slate-800">
                {p.tahunAjaran} {p.semester !== 'Waktu' ? `— ${p.semester}` : ''}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">{p.totalItem} laporan publikasi terdaftar</p>
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
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<DataItem | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3000/api/reviewer/publikasi');
      const result = await res.json();
      
      if (result.status === 'success') {
        const currentPeriod = MOCK_PERIODE.find(p => p.id === pid);

        // Apply server data filter exactly correlating to client definitions
        const filtered = result.data.filter((item: any) => {
          // filter by publication type
          const itemCat = getCategoryFromType(item);
          if (itemCat !== (jenis || 'artikel')) return false;

          // filter by mapped academic period definition
          const { ta, sem } = getPeriodFromDate(item.tanggal);
          return currentPeriod && currentPeriod.tahunAjaran === ta && currentPeriod.semester === sem;
        });

        const formattedData = filtered.map((item: any) => ({
          id: item.id,
          judul: item.judul,
          dosen: item.dosen || "-",
          tanggal: item.tanggal,
          status: item.status || "draft",
          komentar: item.komentar || ""
        }));
        setData(formattedData);
      }
    } catch (err) {
      console.error("Failed to fetch reviewer data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveReview = async (id: string, status: string, komentar: string) => {
    try {
      const res = await fetch(`http://localhost:3000/api/reviewer/publikasi/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status, komentar })
      });
      
      const result = await res.json();
      if (result.status === 'success') {
        setData((prev) => prev.map((d) => d.id === id ? { ...d, status, komentar } : d));
        setSelectedItem(null);
      } else {
        alert("Gagal menyimpan review: " + result.message);
      }
    } catch (err) {
      console.error("Error saving review:", err);
      alert("Terjadi kesalahan saat menyimpan review.");
    }
  };

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
            <thead><tr className="border-b border-slate-100">{["No.", "Judul / Publikasi", "Dosen", "Tanggal", "Status", "Komentar", "Aksi"].map((h) => (<th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500">{h}</th>))}</tr></thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-500">Memuat data...</td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-500">Belum ada data publikasi untuk direview.</td>
                </tr>
              ) : data.map((item, i) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3.5 text-sm text-slate-400">{i + 1}</td>
                  <td className="px-5 py-3.5 text-sm font-medium text-slate-800">{item.judul}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-600">{item.dosen}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-600 whitespace-nowrap">{item.tanggal}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${STATUS[item.status]?.cls || 'bg-slate-100 text-slate-700'}`}>{STATUS[item.status]?.label || item.status}</span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-600 truncate max-w-[150px]" title={item.komentar}>
                    {item.komentar || "-"}
                  </td>
                  <td className="px-5 py-3.5">
                    <button onClick={() => setSelectedItem(item)} className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-800">
                      <ClipboardCheck className="w-3.5 h-3.5" /> {item.status === "submitted" || item.status === "draft" ? "Review" : "Ubah Review"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ReviewModal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        item={selectedItem}
        onSave={handleSaveReview}
      />
    </PageWrapper>
  );
}

