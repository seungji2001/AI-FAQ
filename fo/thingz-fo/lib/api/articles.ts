import { apiClient } from "./client";
import { ArticleListItem, ArticleDetail, ArticleCreateRequest, ArticleUpdateRequest } from "@/lib/types/article";

export async function fetchArticles(): Promise<ArticleListItem[]> {
  return apiClient.get<ArticleListItem[]>("/articles");
}

export async function fetchArticlesByTag(tag: string): Promise<ArticleListItem[]> {
  return apiClient.get<ArticleListItem[]>(`/articles?tag=${encodeURIComponent(tag)}`);
}

export async function fetchPopularTags(limit = 10): Promise<string[]> {
  return apiClient.get<string[]>(`/articles/tags/popular?limit=${limit}`);
}

export async function fetchArticlesByUser(userId: string): Promise<ArticleListItem[]> {
  return apiClient.get<ArticleListItem[]>(`/users/${userId}/articles`);
}

export async function fetchArticle(id: string): Promise<ArticleDetail> {
  return apiClient.get<ArticleDetail>(`/articles/${id}`);
}

export async function fetchArticleForEdit(id: string): Promise<ArticleDetail> {
  return apiClient.get<ArticleDetail>(`/articles/${id}/edit`);
}

export async function fetchMyDrafts(): Promise<ArticleListItem[]> {
  return apiClient.get<ArticleListItem[]>("/articles/me/drafts");
}

export async function createArticle(body: ArticleCreateRequest): Promise<{ id: string }> {
  return apiClient.post<{ id: string }>("/articles", body);
}

export async function updateArticle(id: string, body: ArticleUpdateRequest): Promise<void> {
  return apiClient.put(`/articles/${id}`, body);
}

export async function deleteArticle(id: string): Promise<void> {
  return apiClient.delete(`/articles/${id}`);
}

export async function publishDraft(id: string): Promise<void> {
  return apiClient.patch(`/articles/${id}/publish`);
}

export async function markArticleSold(id: string): Promise<void> {
  return apiClient.patch(`/articles/${id}/item/sold`);
}

export async function reportArticle(id: string, reason: string): Promise<void> {
  return apiClient.post(`/articles/${id}/reports`, { reason });
}
