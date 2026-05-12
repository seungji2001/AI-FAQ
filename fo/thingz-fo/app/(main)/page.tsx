import { cookies } from "next/headers";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import FeaturedCard from "@/app/components/FeaturedCard";
import ArticleGrid from "@/app/components/ArticleGrid";
import TodayEditors from "@/app/components/TodayEditors";
import { fetchArticles } from "@/lib/api/articles";
import { fetchUsers } from "@/lib/api/users";
import { pageWithSidebar, sidebarWidth, mainContent } from "@/lib/styles/sx";
import { fs, fw, textSecondary } from "@/lib/styles/typography";
import { getT } from "@/lib/i18n/translations";

export default async function Home() {
  const locale = (await cookies()).get("locale")?.value ?? "ko";
  const t = getT(locale);

  const [articles, users] = await Promise.all([
    fetchArticles().catch(() => []),
    fetchUsers().catch(() => []),
  ]);

  const featured = articles[0] ?? null;
  const rest = articles.slice(1);

  return (
    <Box sx={pageWithSidebar}>
      <Box component="article" sx={{ ...mainContent, display: "flex", flexDirection: "column", gap: 5 }}>
        {featured && <FeaturedCard
          id={featured.id} title={featured.title} author={`@${featured.author}`}
          category={featured.tags[0] ?? ""} imageSrc={featured.coverUrl ?? undefined}
          price={featured.price ? `${featured.price.toLocaleString()}${t.write.priceUnit}` : undefined}
        />}

        <Box>
          <Typography sx={{ fontSize: fs.sm, fontWeight: fw.semibold, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.08em", mb: 0.5 }}>
            {t.feed.recentArticles}
          </Typography>
          <Divider sx={{ mb: 0 }} />
          <ArticleGrid articles={rest} emptyMessage={t.feed.noArticles} />
        </Box>
      </Box>

      <Box component="aside" sx={sidebarWidth}>
        <Box sx={{ position: "sticky", top: 80, display: "flex", flexDirection: "column", gap: 5 }}>
          <TodayEditors users={users} title={t.feed.todayEditors} />
        </Box>
      </Box>
    </Box>
  );
}
