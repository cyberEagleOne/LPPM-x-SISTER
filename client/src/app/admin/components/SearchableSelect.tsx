import { useState, useEffect, useRef } from "react";
import { Search, Check, ChevronDown } from "lucide-react";

export interface SearchableSelectProps {
  options: string[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  error?: string;
}

export function SearchableSelect({ options, value, onChange, placeholder = "Pilih kategori...", error }: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Tombol Pemicu */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full px-4 py-2.5 text-sm bg-slate-50 border rounded-lg cursor-pointer transition-colors ${
          error ? "border-red-300 ring-1 ring-red-100" : "border-slate-200 hover:border-slate-300"
        }`}
      >
        <span className={`block truncate ${!value ? "text-slate-400" : "text-slate-700"}`}>
          {value || placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </div>

      {/* Menu Dropdown */}
      {isOpen && (
        <div className="absolute z-[100] w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
          {/* Kolom Pencarian */}
          <div className="p-3 border-b border-slate-100 bg-slate-50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                autoFocus
                placeholder="Cari kategori (cth: jurnal internasional, buku)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Daftar Opsi */}
          <div className="max-h-64 overflow-y-auto p-2">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                  className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    value === option ? "bg-blue-50 text-blue-700" : "hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <div className="mt-0.5 shrink-0 w-4">
                    {value === option && <Check className="w-4 h-4 text-blue-600" />}
                  </div>
                  <span className="text-sm leading-relaxed whitespace-normal text-left">{option}</span>
                </div>
              ))
            ) : (
              <div className="p-4 text-sm text-center text-slate-400 italic">
                Kategori tidak ditemukan.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}