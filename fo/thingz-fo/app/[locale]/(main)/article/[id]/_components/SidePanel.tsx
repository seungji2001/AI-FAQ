"use client";

import ArticleTrade from "@/app/components/article/ArticleTrade";
import ArticleEditorProfile from "@/app/components/article/ArticleEditorProfile";
import { ArticleDetail } from "@/lib/types/article";

interface Props {
  article: ArticleDetail;
}

export default function SidePanel({ article }: Props) {
  const { item, authorId, author, authorAvatarUrl, authorBio, authorArticles, authorFollowers } = article;

  const editorProps = {
    userId: authorId,
    username: `@${author}`,
    bio: authorBio ?? "",
    articles: authorArticles,
    followers: String(authorFollowers),
    avatarSrc: authorAvatarUrl ?? undefined,
  };

  const tradeProps = item
    ? {
        price: `${item.price?.toLocaleString()}원`,
        trade: {
          condition: `${item.condition}급`,
          delivery: item.tradeType,
        },
        seller: {
          userId: authorId,
          username: `@${author}`,
          avatarSrc: authorAvatarUrl ?? undefined,
        },
      }
    : null;

  return (
    <>
      {tradeProps && <ArticleTrade {...tradeProps} />}
      <ArticleEditorProfile {...editorProps} />
    </>
  );
}
