import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FeaturedCard from "../components/FeaturedCard";
import ItemCard from "../components/ItemCard";
import TodayEditors from "../components/TodayEditors";
import { fetchArticles } from "@/lib/api/articles";
import { fetchUsers } from "@/lib/api/users";
import { pageWithSidebar, sidebarWidth, mainContent } from "@/lib/styles/sx";
import { titleMd, textSecondary } from "@/lib/styles/typography";

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
          <Typography sx={{ ...titleMd, mb: 2 }}>
            최근 아티클
          </Typography>
          {rest.length > 0 ? (
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" }, gap: 3 }}>
              {rest.map((article) => (
                <ItemCard
                  key={article.id}
                  id={article.id}
                  title={article.title}
                  tag={article.tags[0] ?? ""}
                  imageSrc={article.coverUrl ?? undefined}
                />
              ))}
            </Box>
          ) : (
            <Typography sx={textSecondary}>
              아직 아티클이 없습니다.
            </Typography>
          )}
        </Box>
      </Box>

      <Box component="aside" sx={sidebarWidth}>
        <TodayEditors users={users} />
      </Box>
    </Box>
  );
}
