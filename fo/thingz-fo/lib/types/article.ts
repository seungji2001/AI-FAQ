export interface ArticleListItem {
  id: string;
  title: string;
  author: string;
  coverUrl: string | null;
  tags: string[];
  price: number | null;
}

export interface ArticleDetail {
  id: string;
  title: string;
  content: string;
  author: string;
  authorAvatarUrl: string | null;
  authorBio: string | null;
  authorFollowers: number;
  authorArticles: number;
  publishedAt: string | null;
  imageUrls: string[];
  tags: string[];
  item: ArticleItem | null;
}

export interface ArticleItem {
  price: number;
  condition: string;
  tradeType: string;
  isSold: boolean;
}

export interface ArticleCreateRequest {
  userId: string;
  title: string;
  content: string;
  tags: string[];
  imageUrls: string[];
  isPublished?: boolean;
  item: {
    forSale: boolean;
    price?: number;
    condition?: string;
    tradeType?: string;
  };
}
