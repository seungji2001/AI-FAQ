"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import { tokenStorage, getUserFromToken } from "@/lib/auth/token";
import { fetchArticlesByUser } from "@/lib/api/articles";
import { ArticleListItem } from "@/lib/types/article";
import ItemCard from "@/app/components/ItemCard";
import { articleGrid, mainContent } from "@/lib/styles/sx";
import { fs, fw, titleMd, textSecondary } from "@/lib/styles/typography";
import { KAKAO_COLOR, KAKAO_TEXT_COLOR } from "@/lib/constants/theme";

export default function MyPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<ArticleListItem[]>([]);
  const [username, setUsername] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = tokenStorage.getAccessToken();
    if (!token) {
      router.replace("/");
      return;
    }
    const user = getUserFromToken(token);
    if (!user) { router.replace("/"); return; }
    setUsername(user.username);

    fetchArticlesByUser(user.userId)
      .then(setArticles)
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }, [router]);

  return (
    <Box sx={mainContent}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <Avatar sx={{ width: 56, height: 56, bgcolor: KAKAO_COLOR, color: KAKAO_TEXT_COLOR, fontSize: fs["2xl"], fontWeight: fw.bold }}>
          {username[0]?.toUpperCase()}
        </Avatar>
        <Box>
          <Typography sx={{ fontSize: fs["2xl"], fontWeight: fw.bold }}>@{username}</Typography>
          <Typography sx={textSecondary}>아티클 {articles.length}개</Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Typography sx={{ ...titleMd, mb: 2 }}>내 아티클</Typography>

      {loading ? (
        <Typography sx={textSecondary}>불러오는 중...</Typography>
      ) : articles.length === 0 ? (
        <Typography sx={textSecondary}>아직 작성한 아티클이 없어요.</Typography>
      ) : (
        <Box sx={articleGrid}>
          {articles.map((a) => (
            <ItemCard key={a.id} id={a.id} title={a.title} tag={a.tags[0] ?? ""} imageSrc={a.coverUrl ?? undefined} />
          ))}
        </Box>
      )}
    </Box>
  );
}
