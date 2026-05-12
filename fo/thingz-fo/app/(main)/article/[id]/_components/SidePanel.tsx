"use client";

import { useState, useEffect } from "react";
import ArticleTrade from "@/app/components/article/ArticleTrade";
import ArticleEditorProfile from "@/app/components/article/ArticleEditorProfile";
import LoginDialog from "@/app/components/LoginDialog";
import { ArticleDetail } from "@/lib/types/article";
import { getUserFromToken, tokenStorage } from "@/lib/auth/token";
import { markArticleSold } from "@/lib/api/articles";
import { checkIsFollowing } from "@/lib/api/follow";
import { useT } from "@/lib/i18n/context";
import { conditionLabel, deliveryLabel } from "@/lib/i18n/translations";

interface Props { article: ArticleDetail }

export default function SidePanel({ article }: Props) {
  const t = useT();
  const [loginOpen, setLoginOpen] = useState(false);
  const [isSold, setIsSold] = useState(article.item?.isSold ?? false);
  const [following, setFollowing] = useState(false);

  const currentUser = tokenStorage.getAccessToken() ? getUserFromToken(tokenStorage.getAccessToken()!) : null;
  const isOwner = currentUser?.userId === article.authorId;

  useEffect(() => {
    if (!currentUser || isOwner) return;
    checkIsFollowing(article.authorId).then(setFollowing).catch(() => {});
  }, [article.authorId]);

  const handleSold = async () => {
    if (!window.confirm(t.article.markAsSoldConfirm)) return;
    await markArticleSold(article.id);
    setIsSold(true);
  };

  const editorProps = {
    userId: article.authorId, username: `@${article.author}`, bio: article.authorBio ?? "",
    articles: article.authorArticles, followers: String(article.authorFollowers),
    avatarSrc: article.authorAvatarUrl ?? undefined, following,
    onLoginRequired: () => setLoginOpen(true),
  };

  const tradeProps = article.item ? {
    price: `${article.item.price?.toLocaleString()}${t.write.priceUnit}`,
    isSold,
    trade: {
      condition: conditionLabel(article.item.condition, t),
      delivery: deliveryLabel(article.item.tradeType, t),
    },
    seller: { userId: article.authorId, username: `@${article.author}`, avatarSrc: article.authorAvatarUrl ?? undefined },
    instagramId: article.authorInstagramId, kakaoUrl: article.authorKakaoUrl,
    onSoldClick: isOwner && !isSold ? handleSold : undefined,
    onLoginRequired: () => setLoginOpen(true),
  } : null;

  return (
    <>
      <LoginDialog open={loginOpen} onClose={() => setLoginOpen(false)} />
      {tradeProps && <ArticleTrade {...tradeProps} />}
      <ArticleEditorProfile {...editorProps} />
    </>
  );
}
