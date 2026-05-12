import { cookies } from "next/headers";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import { fetchUser } from "@/lib/api/users";
import { fetchArticlesByUser } from "@/lib/api/articles";
import ArticleGrid from "@/app/components/ArticleGrid";
import FollowButton from "./_components/FollowButton";
import { mainContent } from "@/lib/styles/sx";
import { fs, fw, textSecondary } from "@/lib/styles/typography";
import { getT } from "@/lib/i18n/translations";

interface Props { params: Promise<{ id: string }> }

export default async function UserProfilePage({ params }: Props) {
  const { id } = await params;
  const locale = (await cookies()).get("locale")?.value ?? "ko";
  const t = getT(locale);

  const [user, articles] = await Promise.all([
    fetchUser(id).catch(() => null),
    fetchArticlesByUser(id).catch(() => []),
  ]);

  if (!user) {
    return (
      <Box sx={mainContent}>
        <Typography sx={textSecondary}>{t.users.notFound}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={mainContent}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
        <Avatar src={user.avatarUrl ?? undefined} sx={{ width: 64, height: 64, bgcolor: "grey.300", fontSize: fs["3xl"], fontWeight: fw.bold }}>
          {user.username[0]?.toUpperCase()}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontSize: fs["2xl"], fontWeight: fw.bold }}>{user.displayName || user.username}</Typography>
          <Typography sx={textSecondary}>@{user.username} · {t.users.articles} {articles.length}</Typography>
          {user.bio && <Typography sx={{ fontSize: fs.sm, mt: 0.5 }}>{user.bio}</Typography>}
        </Box>
        <FollowButton userId={id} />
      </Box>
      <Divider sx={{ mb: 3 }} />
      <ArticleGrid articles={articles} emptyMessage={t.users.noArticles} />
    </Box>
  );
}
