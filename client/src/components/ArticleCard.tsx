import { Link } from "react-router";
import { ImageWithFallback } from "./ImageWithFallback";
import type { Article } from "../../data/articles";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <div
      className="app-card group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--app-shadow-md)]"
    >
      <div className="aspect-[16/10] overflow-hidden">
        <ImageWithFallback
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-5">
        <span className="app-chip mb-3">
          {article.category}
        </span>
        <h3 className="mb-2 line-clamp-2 text-[1.05rem] text-slate-900 transition-colors group-hover:text-blue-700">
          <Link to={`/artikel/${article.id}`}>
            {article.title}
          </Link>
        </h3>
        <p className="mb-4 line-clamp-3 text-sm leading-6 text-slate-500">{article.description}</p>
        <Link
          to={`/artikel/${article.id}`}
          className="app-link inline-flex items-center text-sm group/btn"
        >
          Baca Selengkapnya
          <svg
            className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
