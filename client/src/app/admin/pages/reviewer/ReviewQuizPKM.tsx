import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ChevronLeft, Star, ExternalLink } from "lucide-react";
import { PageWrapper } from "../../components/PageWrapper";

const MOCK_QUIZ = [
  {
    id: "Q1",
    pertanyaan: "Bagaimana kualitas pemateri/instruktur dalam program ini?",
    pilihans: [
      { id: "Q1-A", label: "Sangat Memuaskan", bobot: 4 },
      { id: "Q1-B", label: "Memuaskan", bobot: 3 },
      { id: "Q1-C", label: "Cukup", bobot: 2 },
      { id: "Q1-D", label: "Kurang Memuaskan", bobot: 1 },
    ],
  },
  {
    id: "Q2",
    pertanyaan: "Bagaimana kesesuaian materi dengan kebutuhan mitra?",
    pilihans: [
      { id: "Q2-A", label: "Sangat Sesuai", bobot: 4 },
      { id: "Q2-B", label: "Sesuai", bobot: 3 },
      { id: "Q2-C", label: "Cukup Sesuai", bobot: 2 },
      { id: "Q2-D", label: "Tidak Sesuai", bobot: 1 },
    ],
  },
  {
    id: "Q3",
    pertanyaan: "Apakah program ini memberikan manfaat nyata bagi mitra?",
    pilihans: [
      { id: "Q3-A", label: "Sangat Bermanfaat", bobot: 4 },
      { id: "Q3-B", label: "Bermanfaat", bobot: 3 },
      { id: "Q3-C", label: "Cukup Bermanfaat", bobot: 2 },
      { id: "Q3-D", label: "Kurang Bermanfaat", bobot: 1 },
    ],
  },
];

export function ReviewQuizPKM() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [urlSurat, setUrlSurat] = useState("");
  const [saran, setSaran] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const totalSkor = Object.entries(answers).reduce((acc, [qid, pid]) => {
    const q = MOCK_QUIZ.find((q) => q.id === qid);
    const p = q?.pilihans.find((p) => p.id === pid);
    return acc + (p?.bobot ?? 0);
  }, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 800);
  };

  if (submitted) {
    return (
      <PageWrapper title="Survey Kepuasan Mitra PKM" breadcrumbs={[{ label: "Reviewer" }, { label: "Quiz PKM" }]}>
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="text-4xl">✅</div>
          <p className="text-base font-semibold text-green-700">Survey berhasil dikirimkan!</p>
          <p className="text-sm text-slate-500">Skor Anda: <strong>{totalSkor}</strong></p>
          <button onClick={() => navigate("/reviewer/hibah")} className="mt-3 px-5 py-2 text-sm font-medium bg-[#E30613] text-white rounded-lg hover:bg-[#c00510]">
            Kembali ke Daftar
          </button>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title="Survey Kepuasan Mitra PKM"
      breadcrumbs={[{ label: "Reviewer" }, { label: "Review Hibah", path: "/reviewer/hibah" }, { label: "Quiz PKM", path: `/reviewer/quiz-pkm/${id}` }]}
      actions={
        <button onClick={() => navigate("/reviewer/hibah")} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Kembali
        </button>
      }
    >
      <div className="max-w-2xl mx-auto">
        <div className="bg-blue-50 border border-blue-100 rounded-xl px-5 py-4 mb-6 text-sm text-blue-800 leading-relaxed">
          Selanjutnya, mohon Bpk/Ibu/Sdr dapat memberikan saran-saran perbaikan, agar Universitas Pradita dapat meningkatkan kualitas pelaksanaan program Pengabdian Masyarakat di lingkungan Bapak/Ibu.
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {MOCK_QUIZ.map((q) => (
            <div key={q.id} className="bg-white border border-slate-200 rounded-xl p-5">
              <p className="text-sm font-semibold text-slate-800 mb-3">{q.pertanyaan}</p>
              <div className="space-y-2">
                {q.pilihans.map((p) => {
                  const isSelected = answers[q.id] === p.id;
                  return (
                    <label key={p.id} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border cursor-pointer transition-all ${isSelected ? "border-[#E30613] bg-red-50" : "border-slate-200 hover:bg-slate-50"}`}>
                      <input type="radio" name={q.id} value={p.id} checked={isSelected}
                        onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: p.id }))}
                        className="accent-[#E30613]"
                      />
                      <span className="text-sm text-slate-700 flex-1">{p.label}</span>
                      <span className="text-xs font-semibold text-slate-400">Skor: {p.bobot}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}

          {/* URL Surat */}
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <label className="block text-sm font-semibold text-slate-800 mb-2">
              URL Surat Kepuasan Mitra <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-slate-400 shrink-0" />
              <input type="url" required value={urlSurat} onChange={(e) => setUrlSurat(e.target.value)}
                placeholder="https://drive.google.com/..."
                className="flex-1 px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E30613]/20 bg-slate-50 placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Saran */}
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <label className="block text-sm font-semibold text-slate-800 mb-2">
              Saran dan Perbaikan <span className="text-red-500">*</span>
            </label>
            <textarea rows={4} required value={saran} onChange={(e) => setSaran(e.target.value)}
              placeholder="Tuliskan saran untuk peningkatan kualitas program pengabdian..."
              className="w-full px-4 py-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E30613]/20 bg-slate-50 placeholder:text-slate-400 resize-none"
            />
          </div>

          {/* Score */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500" />
              <span className="text-sm text-slate-600 font-medium">Skor sementara:</span>
            </div>
            <span className="text-lg font-bold text-[#E30613]">{totalSkor}</span>
          </div>

          <button type="submit" disabled={loading || Object.keys(answers).length !== MOCK_QUIZ.length || !urlSurat || !saran.trim()}
            className="w-full py-3 text-sm font-medium text-white bg-[#E30613] rounded-xl hover:bg-[#c00510] disabled:opacity-50 transition-all">
            {loading ? "Mengirim..." : "📤 Submit Survey"}
          </button>
        </form>
      </div>
    </PageWrapper>
  );
}
