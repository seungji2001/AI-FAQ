import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { fetchUser } from "@/lib/api/users";
import { fetchArticlesByUser } from "@/lib/api/articles";
import ArticleGrid from "@/app/components/ArticleGrid";
import UserProfileHeader from "./_components/UserProfileHeader";
import { mainContent } from "@/lib/styles/sx";
import { textSecondary } from "@/lib/styles/typography";
import { getTranslations } from "next-intl/server";
import Typography from "@mui/material/Typography";

interface Props { params: Promise<{ id: string; locale: string }> }

export default async function UserProfilePage({ params }: Props) {
  const { id } = await params;
  const [user, articles, t] = await Promise.all([
    fetchUser(id).catch(() => null),
    fetchArticlesByUser(id).catch(() => []),
    getTranslations("users"),
  ]);

  if (!user) {
    return (
      <Box sx={mainContent}>
        <Typography sx={textSecondary}>{t("notFound")}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={mainContent}>
      <UserProfileHeader user={user} articleCount={articles.length} />
      <Divider sx={{ mb: 3 }} />
      <ArticleGrid articles={articles} emptyMessage={t("noArticles")} />
    </Box>
  );
}
