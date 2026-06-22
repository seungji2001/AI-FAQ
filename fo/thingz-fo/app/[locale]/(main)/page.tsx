import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FeaturedCard from "@/app/components/FeaturedCard";
import ItemCard from "@/app/components/ItemCard";
import TodayEditors from "@/app/components/TodayEditors";
import SearchBar from "@/app/components/SearchBar";
import { fetchArticles } from "@/lib/api/articles";
import { fetchUsers } from "@/lib/api/users";
import { pageWithSidebar, sidebarWidth, mainContent } from "@/lib/styles/sx";
import { titleMd, textSecondary } from "@/lib/styles/typography";
import { getTranslations } from "next-intl/server";

export default async function Home() {
  const [articles, users, t] = await Promise.all([
    fetchArticles().catch(() => []),
    fetchUsers().catch(() => []),
    getTranslations("home"),
  ]);

  const featured = articles[0] ?? null;
  const rest = articles.slice(1);

  return (
    <Box sx={pageWithSidebar}>
      <Box component="article" sx={{ ...mainContent, display: "flex", flexDirection: "column", gap: 4 }}>
        <SearchBar />
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
          <Typography sx={{ ...titleMd, mb: 2 }}>
            {t("recentArticles")}
          </Typography>
          {rest.length > 0 ? (
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", xl: "1fr 1fr 1fr" }, gap: 3 }}>
              {rest.map((article) => (
                <ItemCard
                  key={article.id}
                  id={article.id}
                  title={article.title}
                  author={article.author}
                  tag={article.tags[0] ?? ""}
                  imageSrc={article.coverUrl ?? undefined}
                  price={article.price}
                />
              ))}
            </Box>
          ) : (
            <Typography sx={textSecondary}>
              {t("noArticles")}
            </Typography>
          )}
        </Box>
      </Box>

      <Box component="aside" sx={sidebarWidth}>
        <TodayEditors users={users} title={t("todayEditors")} noEditors={t("noEditors")} />
      </Box>
    </Box>
  );
}
