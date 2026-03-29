import { useParams, Link } from "react-router";
import { Calendar, User, Share2, ArrowLeft, Facebook, Twitter, LinkIcon } from "lucide-react";
import { articles, relatedArticles } from "../data/articles";
import { ArticleCard } from "../components/ArticleCard";
import { ImageWithFallback } from "../components/ImageWithFallback";

export function ArticleDetailPage() {
  const { id } = useParams();
  const article = [...articles, ...relatedArticles].find((a) => a.id === id);

  if (!article) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
        <h1 className="text-2xl text-gray-800 mb-4">Artikel Tidak Ditemukan</h1>
        <p className="text-gray-500 mb-6">Artikel yang Anda cari tidak tersedia.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#E30613] text-white text-sm rounded-lg hover:bg-[#c00510] transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = article.title;
    const shareUrls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      copy: url,
    };

    if (platform === "copy") {
      navigator.clipboard.writeText(url);
      alert("Link berhasil disalin!");
    } else {
      window.open(shareUrls[platform], "_blank", "noopener,noreferrer");
    }
  };

  const articleContent = article.content || `<p>Konten lengkap artikel "${article.title}" akan segera tersedia. Silakan kembali lagi nanti untuk membaca artikel ini secara lengkap.</p><p>LPPM Universitas Pradita terus berkomitmen untuk menyediakan informasi terkini terkait penelitian, pengabdian masyarakat, dan kegiatan akademik lainnya.</p>`;

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Hero Image */}
      <div className="relative h-64 md:h-96 bg-gray-100">
        <ImageWithFallback
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="max-w-4xl mx-auto">
            <span className="inline-block text-xs bg-[#E30613] text-white px-3 py-1 rounded-full mb-3">
              {article.category}
            </span>
            <h1 className="text-xl md:text-3xl text-white" style={{ fontWeight: 600 }}>
              {article.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Back link */}
        <Link
          to="/artikel"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#E30613] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Artikel
        </Link>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8 pb-6 border-b border-gray-100">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {article.date}
          </span>
          <span className="flex items-center gap-1.5">
            <User className="w-4 h-4" />
            {article.author}
          </span>
        </div>

        {/* Content */}
        <div
          className="prose prose-gray max-w-none mb-10 [&_p]:text-gray-600 [&_p]:mb-4 [&_h3]:text-gray-800 [&_h3]:mt-8 [&_h3]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_li]:text-gray-600 [&_li]:text-sm"
          dangerouslySetInnerHTML={{ __html: articleContent }}
        />

        {/* Share buttons */}
        <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
          <span className="flex items-center gap-1.5 text-sm text-gray-500">
            <Share2 className="w-4 h-4" />
            Bagikan:
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => handleShare("facebook")}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-all"
            >
              <Facebook className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleShare("twitter")}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2] transition-all"
            >
              <Twitter className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleShare("copy")}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-800 hover:text-white hover:border-gray-800 transition-all"
            >
              <LinkIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Related Articles */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl text-gray-800 mb-8">Artikel Terkait</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedArticles.map((relatedArticle) => (
              <ArticleCard key={relatedArticle.id} article={relatedArticle} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
