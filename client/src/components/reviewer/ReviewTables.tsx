// Shared read-only table components for Reviewer pages

interface RABItem {
  kelompok: string;
  komponen: string;
  item: string;
  satuan: string;
  hargaSatuan: number;
  volume: number;
}

export function RABTable({ items }: { items: RABItem[] }) {
  const fmt = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
  const total = items.reduce((acc, r) => acc + r.hargaSatuan * r.volume, 0);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            {["No.", "Kelompok", "Komponen", "Item", "Satuan", "Harga Satuan", "Volume", "Total"].map((h) => (
              <th key={h} className="px-3 py-2.5 text-left text-xs font-semibold text-slate-500 whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.map((row, i) => (
            <tr key={i} className="hover:bg-slate-50/50">
              <td className="px-3 py-2.5 text-slate-500">{i + 1}</td>
              <td className="px-3 py-2.5 text-slate-700">{row.kelompok}</td>
              <td className="px-3 py-2.5 text-slate-700">{row.komponen}</td>
              <td className="px-3 py-2.5 text-slate-700">{row.item}</td>
              <td className="px-3 py-2.5 text-slate-600">{row.satuan}</td>
              <td className="px-3 py-2.5 text-slate-700 font-medium">{fmt(row.hargaSatuan)}</td>
              <td className="px-3 py-2.5 text-slate-700">{row.volume}</td>
              <td className="px-3 py-2.5 text-slate-800 font-semibold">{fmt(row.hargaSatuan * row.volume)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-slate-300 bg-slate-50">
            <td colSpan={7} className="px-3 py-3 text-sm font-bold text-slate-800 text-right">Total Anggaran:</td>
            <td className="px-3 py-3 text-sm font-bold text-[#E30613]">{fmt(total)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

interface LuaranItem {
  namaJurnal: string;
  url: string;
}

export function LuaranTable({ items, luaranWajib }: { items: LuaranItem[]; luaranWajib?: string }) {
  return (
    <div>
      {luaranWajib && (
        <p className="text-xs text-slate-500 mb-2">
          <span className="font-semibold">Wajib:</span> {luaranWajib}
        </p>
      )}
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            {["No.", "Nama Jurnal", "URL"].map((h) => (
              <th key={h} className="px-3 py-2.5 text-left text-xs font-semibold text-slate-500">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.map((row, i) => (
            <tr key={i} className="hover:bg-slate-50/50">
              <td className="px-3 py-2.5 text-slate-500">{i + 1}</td>
              <td className="px-3 py-2.5 text-slate-700">{row.namaJurnal}</td>
              <td className="px-3 py-2.5">
                <a href={row.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-xs">
                  {row.url}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface MitraItem {
  nama: string;
  institusi: string;
  alamat: string;
  surel: string;
  negara: string;
  suratUrl?: string;
  dana?: number;
}

export function MitraTable({ items }: { items: MitraItem[] }) {
  const fmt = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            {["No.", "Nama Mitra", "Institusi", "Alamat", "Surel", "Negara", "Surat", "Dana"].map((h) => (
              <th key={h} className="px-3 py-2.5 text-left text-xs font-semibold text-slate-500 whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.map((row, i) => (
            <tr key={i} className="hover:bg-slate-50/50">
              <td className="px-3 py-2.5 text-slate-500">{i + 1}</td>
              <td className="px-3 py-2.5 text-slate-700 font-medium">{row.nama}</td>
              <td className="px-3 py-2.5 text-slate-600">{row.institusi}</td>
              <td className="px-3 py-2.5 text-slate-600">{row.alamat}</td>
              <td className="px-3 py-2.5 text-slate-600">{row.surel}</td>
              <td className="px-3 py-2.5 text-slate-600">{row.negara}</td>
              <td className="px-3 py-2.5">
                {row.suratUrl ? (
                  <a href={row.suratUrl} target="_blank" rel="noreferrer" className="text-blue-600 text-xs hover:underline">
                    Unduh
                  </a>
                ) : "-"}
              </td>
              <td className="px-3 py-2.5 text-slate-700 font-medium">{row.dana ? fmt(row.dana) : "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
