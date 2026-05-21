import { api } from '../network/APIClient';
import { ArticleListItem, ArticleDetail, ArticleCreateRequest } from '../../types/article';

const BASE = '/api/fo';

export const ArticleService = {
  fetchAll: () => api.get<ArticleListItem[]>(`${BASE}/articles`),
  fetchByTag: (tag: string) => api.get<ArticleListItem[]>(`${BASE}/articles?tag=${encodeURIComponent(tag)}`),
  fetchPopularTags: (limit = 12) => api.get<string[]>(`${BASE}/articles/tags/popular?limit=${limit}`),
  fetchByUser: (userId: string) => api.get<ArticleListItem[]>(`${BASE}/users/${userId}/articles`),
  fetchOne: (id: string) => api.get<ArticleDetail>(`${BASE}/articles/${id}`),
  fetchForEdit: (id: string) => api.get<ArticleDetail>(`${BASE}/articles/${id}/edit`),
  fetchMyDrafts: () => api.get<ArticleListItem[]>(`${BASE}/articles/me/drafts`),
  create: (body: ArticleCreateRequest) => api.post<{ id: string }>(`${BASE}/articles`, body),
  update: (id: string, body: Partial<ArticleCreateRequest>) => api.put(`${BASE}/articles/${id}`, body),
  delete: (id: string) => api.delete(`${BASE}/articles/${id}`),
  publish: (id: string) => api.patch(`${BASE}/articles/${id}/publish`),
  markSold: (id: string) => api.patch(`${BASE}/articles/${id}/item/sold`),
};
