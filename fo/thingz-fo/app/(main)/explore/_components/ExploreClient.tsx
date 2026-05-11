"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Chip from "@mui/material/Chip";
import SearchIcon from "@mui/icons-material/Search";
import { fetchArticles, fetchArticlesByTag } from "@/lib/api/articles";
import { ArticleListItem } from "@/lib/types/article";
import ItemCard from "@/app/components/ItemCard";
import { articleGrid, mainContent } from "@/lib/styles/sx";
import { fs, fw, titleMd, textSecondary } from "@/lib/styles/typography";
import { BRAND_COLOR } from "@/lib/constants/theme";

const POPULAR_TAGS = ["필름카메라", "빈티지", "오디오", "자전거", "카메라렌즈", "시계", "책", "의류"];

export default function ExploreClient() {
  const router = useRouter();
  const params = useSearchParams();
  const initialTag = params.get("tag") ?? "";

  const [input, setInput] = useState(initialTag);
  const [activeTag, setActiveTag] = useState(initialTag);
  const [articles, setArticles] = useState<ArticleListItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetcher = activeTag ? fetchArticlesByTag(activeTag) : fetchArticles();
    fetcher
      .then(setArticles)
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }, [activeTag]);

  const handleSearch = (tag: string) => {
    const trimmed = tag.trim().replace(/^#/, "");
    setActiveTag(trimmed);
    setInput(trimmed);
    router.replace(trimmed ? `/explore?tag=${encodeURIComponent(trimmed)}` : "/explore");
  };

  return (
    <Box sx={mainContent}>
      <Typography sx={{ ...titleMd, mb: 3 }}>탐색</Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1, bgcolor: "grey.100", borderRadius: 3, px: 2, py: 1, mb: 2 }}>
        <SearchIcon sx={{ color: "text.secondary", fontSize: fs.xl }} />
        <InputBase
          fullWidth
          placeholder="태그로 검색 (예: 필름카메라)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch(input)}
          sx={{ fontSize: fs.md }}
        />
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 4 }}>
        {POPULAR_TAGS.map((tag) => (
          <Chip
            key={tag}
            label={`#${tag}`}
            clickable
            onClick={() => handleSearch(tag)}
            sx={{
              fontSize: fs.sm,
              fontWeight: activeTag === tag ? fw.bold : fw.normal,
              bgcolor: activeTag === tag ? BRAND_COLOR : "grey.100",
              color: activeTag === tag ? "white" : "text.primary",
              "&:hover": { bgcolor: activeTag === tag ? BRAND_COLOR : "grey.200" },
            }}
          />
        ))}
      </Box>

      {activeTag && (
        <Typography sx={{ ...textSecondary, mb: 2 }}>
          #{activeTag} 검색 결과 {articles.length}개
        </Typography>
      )}

      {loading ? (
        <Typography sx={textSecondary}>불러오는 중...</Typography>
      ) : articles.length === 0 ? (
        <Typography sx={textSecondary}>아티클이 없어요.</Typography>
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
