import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FeaturedCard from "@/app/components/FeaturedCard";
import ArticleGrid from "@/app/components/ArticleGrid";
import TodayEditors from "@/app/components/TodayEditors";
import { fetchArticles } from "@/lib/api/articles";
import { fetchUsers } from "@/lib/api/users";
import { pageWithSidebar, sidebarWidth, mainContent } from "@/lib/styles/sx";
import { titleMd } from "@/lib/styles/typography";

export default async function Home() {
  const [articles, users] = await Promise.all([
    fetchArticles().catch(() => []),
    fetchUsers().catch(() => []),
  ]);

  const featured = articles[0] ?? null;
  const rest = articles.slice(1);

  return (
    <Box sx={pageWithSidebar}>
      <Box component="article" sx={{ ...mainContent, display: "flex", flexDirection: "column", gap: 4 }}>
        {featured && (
          <FeaturedCard
            id={featured.id}
            title={featured.title}
            author={`@${featured.author}`}
            category={featured.tags[0] ?? ""}
            imageSrc={featured.coverUrl ?? undefined}
            price={featured.price ? `${featured.price.toLocaleString()}원` : undefined}
          />
        )}

        <Box>
          <Typography sx={{ ...titleMd, mb: 2 }}>최근 아티클</Typography>
          <ArticleGrid articles={rest} emptyMessage="아직 아티클이 없습니다." />
        </Box>
      </Box>

      <Box component="aside" sx={sidebarWidth}>
        <TodayEditors users={users} />
      </Box>
    </Box>
  );
}
