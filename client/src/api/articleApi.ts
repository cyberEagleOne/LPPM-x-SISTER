import { articles, Article } from "../data/articles";

/**
 * DATA LAYER: HTTP Request ke Backend untuk Artikel
 */
export const fetchArticlesApi = async (): Promise<Article[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(articles);
    }, 500); // Simulasi delay network
  });
};

export const fetchArticleByIdApi = async (id: string): Promise<Article | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(articles.find((a: Article) => a.id === id));
    }, 500);
  });
};
