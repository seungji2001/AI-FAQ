"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Chip from "@mui/material/Chip";
import SearchIcon from "@mui/icons-material/Search";
import { fetchArticles, fetchArticlesByTag, fetchPopularTags } from "@/lib/api/articles";
import { ArticleListItem } from "@/lib/types/article";
import ArticleGrid from "@/app/components/ArticleGrid";
import { mainContent } from "@/lib/styles/sx";
import { fs, fw, titleMd, textSecondary } from "@/lib/styles/typography";
import { INK, IVORY } from "@/lib/constants/theme";
import { useT } from "@/lib/i18n/context";

export default function ExploreClient() {
  const t = useT();
  const router = useRouter();
  const params = useSearchParams();
  const initialTag = params.get("tag") ?? "";

  const [input, setInput] = useState(initialTag);
  const [activeTag, setActiveTag] = useState(initialTag);
  const [articles, setArticles] = useState<ArticleListItem[]>([]);
  const [popularTags, setPopularTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPopularTags(12).then(setPopularTags).catch(() => setPopularTags([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    const fetcher = activeTag ? fetchArticlesByTag(activeTag) : fetchArticles();
    fetcher.then(setArticles).catch(() => setArticles([])).finally(() => setLoading(false));
  }, [activeTag]);

  const handleSearch = (tag: string) => {
    const trimmed = tag.trim().replace(/^#/, "");
    setActiveTag(trimmed);
    setInput(trimmed);
    router.replace(trimmed ? `/explore?tag=${encodeURIComponent(trimmed)}` : "/explore");
  };

  return (
    <Box sx={mainContent}>
      <Typography sx={{ ...titleMd, mb: 3 }}>{t.explore.title}</Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1, bgcolor: "grey.100", borderRadius: 3, px: 2, py: 1, mb: 2 }}>
        <SearchIcon sx={{ color: "text.secondary", fontSize: fs.xl }} />
        <InputBase fullWidth placeholder={t.explore.searchPlaceholder} value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch(input)}
          sx={{ fontSize: fs.md }}
        />
      </Box>

      {popularTags.length > 0 && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 4 }}>
          {popularTags.map((tag) => (
            <Chip key={tag} label={`#${tag}`} clickable onClick={() => handleSearch(tag)}
              sx={{ fontSize: fs.sm, fontWeight: activeTag === tag ? fw.bold : fw.normal, bgcolor: activeTag === tag ? INK : "grey.100", color: activeTag === tag ? IVORY : "text.primary", "&:hover": { bgcolor: activeTag === tag ? INK : "grey.200" } }}
            />
          ))}
        </Box>
      )}

      {activeTag && (
        <Typography sx={{ ...textSecondary, mb: 2 }}>
          {t.explore.results.replace("{tag}", activeTag).replace("{count}", String(articles.length))}
        </Typography>
      )}

      <ArticleGrid articles={articles} loading={loading} emptyMessage={t.explore.noArticles} />
    </Box>
  );
}
