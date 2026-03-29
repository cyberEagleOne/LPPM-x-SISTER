import { useState } from "react";
import { Star } from "lucide-react";

interface RubrikPilihan {
  id: string;
  label: string;
  bobot: number;
}

interface RubrikItem {
  id: string;
  pertanyaan: string;
  pilihans: RubrikPilihan[];
}

interface RubrikScoringFormProps {
  rubrikItems: RubrikItem[];
  existingAnswers?: Record<string, string>; // rubrikId -> pilihanId
  existingCatatan?: string;
  existingSkor?: number;
  bolehReview?: boolean; // false = masa penilaian berakhir
  onSubmit: (answers: Record<string, string>, catatan: string) => void;
  loading?: boolean;
}

export function RubrikScoringForm({
  rubrikItems,
  existingAnswers,
  existingCatatan,
  existingSkor,
  bolehReview = true,
  onSubmit,
  loading,
}: RubrikScoringFormProps) {
  const [answers, setAnswers] = useState<Record<string, string>>(existingAnswers ?? {});
  const [catatan, setCatatan] = useState(existingCatatan ?? "");

  const totalSkor = Object.entries(answers).reduce((acc, [rubrikId, pilihanId]) => {
    const rubrik = rubrikItems.find((r) => r.id === rubrikId);
    const pilihan = rubrik?.pilihans.find((p) => p.id === pilihanId);
    return acc + (pilihan?.bobot ?? 0);
  }, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(answers, catatan);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {existingSkor !== undefined && (
        <div className="flex items-center gap-2 px-4 py-3 bg-blue-50 border border-blue-100 rounded-xl">
          <Star className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">
            Nilai yang anda berikan: <strong>{existingSkor}</strong>
          </span>
        </div>
      )}

      {rubrikItems.map((rubrik) => (
        <div key={rubrik.id} className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-sm font-semibold text-slate-800 mb-3">{rubrik.pertanyaan}</p>
          <div className="space-y-2">
            {rubrik.pilihans.map((pilihan) => {
              const isSelected = answers[rubrik.id] === pilihan.id;
              return (
                <label
                  key={pilihan.id}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? "border-[#E30613] bg-red-50"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="radio"
                    name={`rubrik-${rubrik.id}`}
                    value={pilihan.id}
                    checked={isSelected}
                    disabled={!bolehReview}
                    onChange={() => setAnswers((prev) => ({ ...prev, [rubrik.id]: pilihan.id }))}
                    className="accent-[#E30613]"
                  />
                  <span className="text-sm text-slate-700 flex-1">{pilihan.label}</span>
                  <span className="text-xs font-semibold text-slate-500 shrink-0">Bobot: {pilihan.bobot}</span>
                </label>
              );
            })}
          </div>
        </div>
      ))}

      {/* Catatan */}
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <label className="block text-sm font-semibold text-slate-800 mb-2">
          Catatan Reviewer <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={4}
          required
          disabled={!bolehReview}
          value={catatan}
          onChange={(e) => setCatatan(e.target.value)}
          placeholder="Tuliskan catatan review Anda untuk proposal ini..."
          className="w-full px-4 py-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613]/40 bg-slate-50 placeholder:text-slate-400 resize-none disabled:opacity-70"
        />
      </div>

      {/* Score Preview */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl">
        <span className="text-sm text-slate-600 font-medium">Skor sementara:</span>
        <span className="text-lg font-bold text-[#E30613]">{totalSkor}</span>
      </div>

      {bolehReview ? (
        <button
          type="submit"
          disabled={loading || Object.keys(answers).length !== rubrikItems.length || !catatan.trim()}
          className="w-full py-3 text-sm font-medium text-white bg-[#E30613] rounded-xl hover:bg-[#c00510] disabled:opacity-50 transition-all active:scale-[0.99]"
        >
          {loading ? "Menyimpan..." : "💾 Submit Penilaian"}
        </button>
      ) : (
        <div className="px-4 py-3 bg-orange-50 border border-orange-200 rounded-xl text-sm text-orange-700 font-medium text-center">
          ⏰ Masa Penilaian Sudah Berakhir
        </div>
      )}
    </form>
  );
}
