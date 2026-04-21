import { useParams } from "react-router";
import { articles, relatedArticles } from "../data/articles";
// import { fetchArticleByIdApi } from "../api/articleApi"; // Bisa dipakai kelak jika asynchronous

/**
 * LOGIC LAYER: Mengurus pencarian data berdasarkan parameter
 * dan fungsi action handler (spt share).
 */
export const useArticleDetail = () => {
  const { id } = useParams();
  
  // Logic pengambilan data
  const article = [...articles, ...relatedArticles].find((a) => a.id === id);

  // Logic content fallback
  const formattedContent = article?.content || (article && `<p>Konten lengkap artikel "${article.title}" akan segera tersedia. Silakan kembali lagi nanti untuk membaca artikel ini secara lengkap.</p><p>LPPM Universitas Pradita terus berkomitmen untuk menyediakan informasi terkini terkait penelitian, pengabdian masyarakat, dan kegiatan akademik lainnya.</p>`);

  // Action handler
  const handleShare = (platform: string) => {
    if (!article) return;
    
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

  return {
    article,
    formattedContent,
    handleShare
  };
};
