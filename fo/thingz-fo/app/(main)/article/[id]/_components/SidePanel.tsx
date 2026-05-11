"use client";

import { useState } from "react";
import ArticleTrade from "@/app/components/article/ArticleTrade";
import ArticleEditorProfile from "@/app/components/article/ArticleEditorProfile";
import LoginDialog from "@/app/components/LoginDialog";
import { ArticleDetail } from "@/lib/types/article";
import { getUserFromToken, tokenStorage } from "@/lib/auth/token";
import { markArticleSold } from "@/lib/api/articles";

interface Props {
  article: ArticleDetail;
}

export default function SidePanel({ article }: Props) {
  const [loginOpen, setLoginOpen] = useState(false);
  const [isSold, setIsSold] = useState(article.item?.isSold ?? false);

  const currentUser = tokenStorage.getAccessToken()
    ? getUserFromToken(tokenStorage.getAccessToken()!)
    : null;
  const isOwner = currentUser?.userId === article.authorId;

  const handleSold = async () => {
    if (!window.confirm("판매 완료로 변경하시겠습니까?")) return;
    await markArticleSold(article.id);
    setIsSold(true);
  };

  const editorProps = {
    userId: article.authorId,
    username: `@${article.author}`,
    bio: article.authorBio ?? "",
    articles: article.authorArticles,
    followers: String(article.authorFollowers),
    avatarSrc: article.authorAvatarUrl ?? undefined,
    onLoginRequired: () => setLoginOpen(true),
  };

  const tradeProps = article.item
    ? {
        price: `${article.item.price?.toLocaleString()}원`,
        isSold,
        trade: {
          condition: `${article.item.condition}급`,
          delivery: article.item.tradeType,
        },
        seller: {
          userId: article.authorId,
          username: `@${article.author}`,
          avatarSrc: article.authorAvatarUrl ?? undefined,
        },
        instagramId: article.authorInstagramId,
        kakaoUrl: article.authorKakaoUrl,
        onSoldClick: isOwner && !isSold ? handleSold : undefined,
        onLoginRequired: () => setLoginOpen(true),
      }
    : null;

  return (
    <>
      <LoginDialog open={loginOpen} onClose={() => setLoginOpen(false)} />
      {tradeProps && <ArticleTrade {...tradeProps} />}
      <ArticleEditorProfile {...editorProps} />
    </>
  );
}
