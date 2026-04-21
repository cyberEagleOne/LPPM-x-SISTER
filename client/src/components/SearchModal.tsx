import { useState } from "react";
import { X, Search } from "lucide-react";
import { useNavigate } from "react-router";
import { articles } from "../data/articles";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  if (!isOpen) return null;

  const results = query.trim()
    ? articles.filter(
      (a) =>
        a.title.toLowerCase().includes(query.toLowerCase()) ||
        a.description.toLowerCase().includes(query.toLowerCase())
    )
    : [];

  const handleSelect = (id: string) => {
    onClose();
    setQuery("");
    navigate(`/artikel/${id}`);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 sm:pt-32" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="app-modal-panel relative mx-4 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-slate-200/80 px-5 py-4">
          <Search className="w-5 h-5 shrink-0 text-slate-400" />
          <input
            type="text"
            autoFocus
            placeholder="Cari artikel, riset, publikasi..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
          />
          <button
            onClick={onClose}
            className="rounded-full p-1 text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-700"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {query.trim() && (
          <div className="max-h-80 overflow-y-auto">
            {results.length > 0 ? (
              <div className="py-2">
                {results.map((article) => (
                  <button
                    key={article.id}
                    onClick={() => handleSelect(article.id)}
                    className="flex w-full items-start gap-3 px-5 py-3 text-left transition-colors hover:bg-blue-50/60"
                    type="button"
                  >
                    <img
                      src={article.image}
                      alt=""
                      className="w-12 h-12 rounded-lg object-cover shrink-0"
                    />
                    <div>
                      <p className="text-sm text-slate-800">{article.title}</p>
                      <p className="mt-0.5 text-xs text-slate-500">{article.category}</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-5 py-8 text-center">
                <p className="text-sm text-slate-500">
                  Tidak ada hasil untuk "{query}"
                </p>
              </div>
            )}
          </div>
        )}

        {!query.trim() && (
          <div className="px-5 py-6 text-center">
            <p className="text-sm text-slate-400">
              Ketik untuk mencari artikel, riset, atau publikasi
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
