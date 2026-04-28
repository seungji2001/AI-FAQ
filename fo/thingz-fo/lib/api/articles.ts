import { apiClient } from "./client";
import { ArticleListItem, ArticleDetail, ArticleCreateRequest } from "@/lib/types/article";

export async function fetchArticles(): Promise<ArticleListItem[]> {
  return apiClient.get<ArticleListItem[]>("/articles");
}

export async function fetchArticle(id: string): Promise<ArticleDetail> {
  return apiClient.get<ArticleDetail>(`/articles/${id}`);
}

export async function createArticle(body: ArticleCreateRequest): Promise<{ id: string }> {
  return apiClient.post<{ id: string }>("/articles", body);
}
