import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import { fetchUser } from "@/lib/api/users";
import { fetchArticlesByUser } from "@/lib/api/articles";
import ItemCard from "@/app/components/ItemCard";
import { articleGrid, mainContent } from "@/lib/styles/sx";
import { fs, fw, textSecondary } from "@/lib/styles/typography";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function UserProfilePage({ params }: Props) {
  const { id } = await params;

  const [user, articles] = await Promise.all([
    fetchUser(id).catch(() => null),
    fetchArticlesByUser(id).catch(() => []),
  ]);

  if (!user) {
    return (
      <Box sx={mainContent}>
        <Typography sx={textSecondary}>유저를 찾을 수 없습니다.</Typography>
      </Box>
    );
  }

  const displayName = user.displayName || user.username;

  return (
    <Box sx={mainContent}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
        <Avatar src={user.avatarUrl ?? undefined} sx={{ width: 64, height: 64, bgcolor: "grey.300", fontSize: fs["3xl"], fontWeight: fw.bold }}>
          {user.username[0]?.toUpperCase()}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontSize: fs["2xl"], fontWeight: fw.bold }}>{displayName}</Typography>
          <Typography sx={textSecondary}>@{user.username} · 아티클 {articles.length}개</Typography>
          {user.bio && <Typography sx={{ fontSize: fs.sm, mt: 0.5 }}>{user.bio}</Typography>}
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {articles.length === 0 ? (
        <Typography sx={textSecondary}>아직 발행한 아티클이 없어요.</Typography>
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
