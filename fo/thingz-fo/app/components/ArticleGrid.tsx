import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ItemCard from "@/app/components/ItemCard";
import { textSecondary } from "@/lib/styles/typography";
import { ArticleListItem } from "@/lib/types/article";

interface ArticleGridProps {
  articles: ArticleListItem[];
  emptyMessage?: string;
  loading?: boolean;
}

export default function ArticleGrid({ articles, emptyMessage = "아티클이 없어요.", loading }: ArticleGridProps) {
  if (loading) return <Typography sx={textSecondary}>불러오는 중...</Typography>;
  if (articles.length === 0) return <Typography sx={textSecondary}>{emptyMessage}</Typography>;
  return (
    <Box>
      {articles.map((a) => (
        <ItemCard
          key={a.id}
          id={a.id}
          title={a.title}
          author={a.author}
          tag={a.tags[0] ?? ""}
          imageSrc={a.coverUrl ?? undefined}
          price={a.price}
        />
      ))}
    </Box>
  );
}
