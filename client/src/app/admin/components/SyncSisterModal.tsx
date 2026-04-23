import { useState, useEffect, useMemo } from "react";
import { X, DownloadCloud, UploadCloud, Search, Eye, Check, AlertTriangle } from "lucide-react";
import { SkeletonTable } from "./SkeletonLoader"; // Asumsi kamu punya ini

interface SyncSisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  dosenId: string | undefined;
  localData: any[]; // Data publikasi lokal untuk cek duplikat
  onSuccess: () => void; // Fungsi untuk me-refresh tabel utama setelah sinkronisasi
}

type SyncMode = "choose" | "get" | "post";

export function SyncSisterModal({ isOpen, onClose, dosenId, localData, onSuccess }: SyncSisterModalProps) {
  const [mode, setMode] = useState<SyncMode>("choose");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [detailItem, setDetailItem] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // State untuk konfirmasi timpa data (override)
  const [showConfirm, setShowConfirm] = useState(false);
  const [conflictingItems, setConflictingItems] = useState<any[]>([]);

  // Reset state saat modal dibuka/tutup
  useEffect(() => {
    if (isOpen) {
      setMode("choose");
      setSelectedIds(new Set());
      setItems([]);
      setDetailItem(null);
      setShowConfirm(false);
      setSearchQuery("");
    }
  }, [isOpen]);

    const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    return items.filter(item => {
        const judul = (item.judul || "").toLowerCase();
        const jenis = (item.jenis_publikasi || "").toLowerCase();
        const query = searchQuery.toLowerCase();
        
        return judul.includes(query) || jenis.includes(query);
    });
    }, [items, searchQuery]);

  if (!isOpen) return null;

  // --- LOGIKA FETCH DATA ---
const handleSelectMode = async (selectedMode: "get" | "post") => {
    setMode(selectedMode);
    setSearchQuery("");
    setLoading(true);
    
    try {
      if (selectedMode === "get") {
        // Simulasi nunggu 1 detik menggunakan Promise
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setItems([
          { id: "S-001", judul: "Jurnal AI dari SISTER", jenis_publikasi: "Artikel", tahun: "2026", existsLocally: true },
          { id: "S-002", judul: "Buku Machine Learning SISTER", jenis_publikasi: "Buku", tahun: "2025", existsLocally: false },
        ]);
      } else {
        setItems(localData);
      }
    } catch (error) {
      alert("Gagal mengambil data");
    } finally {
      setLoading(false); // Sekarang Loading akan mati SETELAH 1 detik berlalu
    }
  };

  // --- LOGIKA CHECKBOX ---
  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const isAllFilteredSelected = filteredItems.length > 0 && filteredItems.every(item => selectedIds.has(item.id));

const toggleSelectAll = () => {
    const newSet = new Set(selectedIds);
    if (isAllFilteredSelected) {
      // Jika semua sudah terpilih, hapus hasil pencarian dari selection
      filteredItems.forEach(item => newSet.delete(item.id));
    } else {
      // Jika belum, tambahkan semua hasil pencarian ke selection
      filteredItems.forEach(item => newSet.add(item.id));
    }
    setSelectedIds(newSet);
  };

  // --- LOGIKA SUBMIT ---
  const handleProcessSync = () => {
    if (selectedIds.size === 0) return alert("Pilih minimal 1 data untuk disinkronkan.");

    if (mode === "get") {
      // Cek apakah ada data yang bentrok dengan localData (misal dari judul atau ID SISTER)
      // Logika disederhanakan: cek field existsLocally dari mock data
      const selectedItems = items.filter(i => selectedIds.has(i.id));
      const conflicts = selectedItems.filter(i => i.existsLocally); 
      
      if (conflicts.length > 0) {
        setConflictingItems(conflicts);
        setShowConfirm(true); // Munculkan pop-up konfirmasi timpa
        return;
      }
    }

    executeSyncAPI();
  };

  const executeSyncAPI = async () => {
    setLoading(true);
    setShowConfirm(false);
    try {
      const endpoint = mode === "get" ? "/api/sdm/publikasi/sync/pull" : "/api/sdm/publikasi/sync/push";
      const payload = { dosen_id: dosenId, selected_ids: Array.from(selectedIds) };
      
      // TODO: Panggil API sebenarnya
      // await fetch(endpoint, { method: "POST", body: JSON.stringify(payload) });
      
      // Simulasi delay
      await new Promise(r => setTimeout(r, 1500));
      
      onSuccess(); // Panggil fungsi refresh di halaman utama
      onClose(); // Tutup modal
    } catch (error) {
      alert("Gagal melakukan sinkronisasi");
    } finally {
      setLoading(false);
    }
  };

  // ══════════ RENDER: PILIH MODE ══════════
  if (mode === "choose") {
    return (
      <ModalLayout title="Pilih Metode Sinkronisasi SISTER" onClose={onClose}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
          <button onClick={() => handleSelectMode("get")} className="flex flex-col items-center justify-center p-8 border-2 border-blue-100 rounded-2xl bg-blue-50 hover:!bg-red-100 hover:border-blue-300 transition-all group">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
              <DownloadCloud className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Tarik Data (GET)</h3>
            <p className="text-sm text-center text-slate-500 mt-2">Ambil publikasi terbaru dari server SISTER ke SIPPM.</p>
          </button>

          <button onClick={() => handleSelectMode("post")} className="flex flex-col items-center justify-center p-8 border-2 border-emerald-100 rounded-2xl bg-emerald-50 hover:bg-emerald-100 hover:border-emerald-300 transition-all group">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
              <UploadCloud className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Kirim Data (POST)</h3>
            <p className="text-sm text-center text-slate-500 mt-2">Kirim publikasi yang ada di SIPPM ke server SISTER.</p>
          </button>
        </div>
      </ModalLayout>
    );
  }

  // ══════════ RENDER: KONFIRMASI DUPLIKAT ══════════
  if (showConfirm) {
    return (
      <ModalLayout title="Peringatan: Data Sudah Ada" onClose={() => setShowConfirm(false)}>
        <div className="p-6">
          <div className="flex items-start gap-4 p-4 bg-amber-50 border border-amber-200 rounded-xl mb-6">
            <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-amber-900">Publikasi Ditemukan di Database Lokal</h4>
              <p className="text-sm text-amber-800 mt-1 leading-relaxed">
                Terdapat {conflictingItems.length} data yang Anda pilih sudah terdaftar di database website. Apakah Anda yakin ingin memperbaruinya dengan data dari SISTER? (Data lama akan tertimpa).
              </p>
            </div>
          </div>
          <ul className="list-disc list-inside text-sm text-slate-600 ml-4 mb-6 space-y-1">
            {conflictingItems.slice(0, 3).map(i => <li key={i.id}>{i.judul}</li>)}
            {conflictingItems.length > 3 && <li>...dan {conflictingItems.length - 3} lainnya</li>}
          </ul>
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
            <button onClick={() => setShowConfirm(false)} className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg">Batal</button>
            <button onClick={executeSyncAPI} className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg">Ya, Perbarui Data</button>
          </div>
        </div>
      </ModalLayout>
    );
  }

  // ══════════ RENDER: LIST DATA (GET/POST) ══════════
  return (
    <ModalLayout 
      title={mode === "get" ? "Tarik Data dari SISTER" : "Kirim Data ke SISTER"} 
      onClose={onClose}
      onBack={() => { setMode("choose"); setDetailItem(null); }}
    >
      <div className="flex flex-col h-[70vh]">
        {/* Detail Panel Overlay (Jika diklik "Lihat Detail") */}
        {detailItem ? (
          <div className="p-6 overflow-y-auto flex-1">
            <button onClick={() => setDetailItem(null)} className="text-sm text-blue-600 mb-4 hover:underline">← Kembali ke daftar</button>
            <h2 className="text-xl font-bold mb-4">{detailItem.judul}</h2>
            <div>
                <p className="text-xs text-slate-500">Tahun/Tanggal</p>
                <p className="font-medium">{detailItem.tahun || detailItem.tanggalDibuat || detailItem.tanggal || "-"}</p>
              {/* Tambahkan detail lainnya sesuai kebutuhan */}
            </div>
          </div>
        ) : (
          <div className="flex flex-col flex-1 overflow-hidden">
            
            {/* 👇 3. INPUT PENCARIAN 👇 */}
            <div className="p-4 border-b border-slate-100 bg-white">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Cari berdasarkan judul atau jenis publikasi..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Tabel Data */}
            <div className="flex-1 overflow-y-auto p-4">
              {loading ? <SkeletonTable rows={4} /> : filteredItems.length === 0 ? (
                // Tampilan jika pencarian tidak ditemukan
                <div className="text-center py-10">
                  <p className="text-sm text-slate-500">Tidak ada data yang sesuai dengan pencarian "{searchQuery}".</p>
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 sticky top-0 z-10">
                    <tr>
                      <th className="p-3 text-left w-12 border-b border-slate-200">
                        {/* Checkbox Select All */}
                        <input 
                          type="checkbox" 
                          checked={isAllFilteredSelected} 
                          onChange={toggleSelectAll} 
                          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                      </th>
                      <th className="p-3 text-left font-semibold text-slate-600 border-b border-slate-200">Judul Publikasi</th>
                      <th className="p-3 text-center font-semibold text-slate-600 w-24 border-b border-slate-200">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {/* 👇 Ganti items.map menjadi filteredItems.map 👇 */}
                    {filteredItems.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50">
                        <td className="p-3">
                          <input type="checkbox" checked={selectedIds.has(item.id)} onChange={() => toggleSelect(item.id)} className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"/>
                        </td>
                        <td className="p-3">
                          <p className="font-medium text-slate-800">{item.judul}</p>
                          <div className="flex gap-2 mt-1">
                             <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{item.jenis_publikasi}</span>
                             {mode === "get" && item.existsLocally && <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded">Ada di lokal</span>}
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          <button onClick={() => setDetailItem(item)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg" title="Lihat Detail">
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between mt-auto">
          <p className="text-sm text-slate-600 font-medium">Terpilih: {selectedIds.size} data</p>
          <button 
            onClick={handleProcessSync}
            disabled={loading || selectedIds.size === 0}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold text-white transition-all
              ${loading || selectedIds.size === 0 ? "bg-slate-300 cursor-not-allowed" : mode === "get" ? "bg-blue-600 hover:bg-blue-700" : "bg-emerald-600 hover:bg-emerald-700"}`}
          >
            {loading ? "Memproses..." : mode === "get" ? "Tarik Data Terpilih" : "Kirim Data Terpilih"}
          </button>
        </div>
      </div>
    </ModalLayout>
  );
}

// ══════════ KOMPONEN PEMBUNGKUS MODAL KECIL ══════════
function ModalLayout({ title, children, onClose, onBack }: any) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            {onBack && <button onClick={onBack} className="text-sm font-medium text-slate-500 hover:text-slate-800">← Back</button>}
            <h2 className="text-lg font-bold text-slate-800">{title}</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 rounded-full transition-colors"><X className="w-5 h-5" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}