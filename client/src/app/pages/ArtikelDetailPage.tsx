import { Link, useParams } from "react-router";
import { Calendar, Clock, User, ChevronLeft, Share2 } from "lucide-react";
import { toast } from "sonner";
import { getArticleById } from "../data/articles";

export function ArtikelDetailPage() {
  const { id } = useParams();
  const articleId = Number(id);
  const article = Number.isFinite(articleId) ? getArticleById(articleId) : undefined;

  if (!article) {
    return (
      <div className="bg-[#f8fafc] min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            to="/artikel"
            className="inline-flex items-center gap-2 text-[#1e3a8a] hover:text-[#1e40af]"
            style={{ fontSize: 14, fontWeight: 600 }}
          >
            <ChevronLeft size={16} /> Kembali ke Artikel
          </Link>
          <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h1 className="text-gray-900">Artikel tidak ditemukan</h1>
            <p className="text-gray-500 mt-2" style={{ fontSize: 14 }}>
              ID artikel tidak valid atau artikel sudah tidak tersedia.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link disalin!", { description: "Tautan artikel berhasil disalin ke clipboard." });
    } catch {
      toast.success("Judul disalin!", { description: article.title });
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      {/* Top header */}
      <div className="bg-[#1e3a8a]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Link
            to="/artikel"
            className="inline-flex items-center gap-2 text-blue-200 hover:text-white transition-colors"
            style={{ fontSize: 14, fontWeight: 600 }}
          >
            <ChevronLeft size={16} /> Kembali
          </Link>

          <div className="mt-5">
            <span
              className="inline-block px-3 py-1 rounded-full text-white/80 border border-white/20"
              style={{ fontSize: 11, fontWeight: 700 }}
            >
              {article.category}
            </span>
            <h1 className="text-white mt-3" style={{ fontSize: "clamp(22px, 4vw, 38px)", fontWeight: 900, lineHeight: 1.25 }}>
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 text-blue-200" style={{ fontSize: 13 }}>
              <span className="inline-flex items-center gap-1.5">
                <User size={14} /> {article.author}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar size={14} /> {article.date}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock size={14} /> {article.readTime}
              </span>
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white transition-colors"
                style={{ fontWeight: 700 }}
              >
                <Share2 size={14} /> Bagikan
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Article body */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <article className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <p className="text-gray-600" style={{ fontSize: 15, lineHeight: 1.8 }}>
            {article.preview}
          </p>
          <div className="mt-6">
            {article.content.split("\n\n").map((paragraph, idx) => (
              <p
                key={idx}
                className="text-gray-800 mb-4"
                style={{ fontSize: 16, lineHeight: 1.9 }}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}

