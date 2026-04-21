import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { ArticleCard } from "../components/ArticleCard";
import { articles, relatedArticles } from "../data/articles";

export function ArticleListPage() {
  const allArticles = [...articles, ...relatedArticles];

  return (
    <div className="app-section py-10 sm:py-12">
      <div className="app-container space-y-8">
        <div className="space-y-3">
          <span className="app-eyebrow">Publikasi dan Informasi</span>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="app-title-lg">Artikel LPPM</h1>
              <p className="app-subtitle mt-3 max-w-3xl">
                Informasi penelitian, pengabdian, workshop, dan capaian institusi LPPM
                Universitas Pradita.
              </p>
            </div>
            <Link to="/" className="app-btn app-btn-secondary">
              Kembali ke Beranda
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {allArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </div>
  );
}
