import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleContent from "@/app/components/article/ArticleContent";
import SidePanel from "./_components/SidePanel";
import { fetchArticle } from "@/lib/api/articles";
import { pageWithSidebar, sidebarWidth, mobileSidebar, mainContent } from "@/lib/styles/sx";
import { captionText } from "@/lib/styles/typography";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ArticleDetailPage({ params }: Props) {
  const { id } = await params;
  const article = await fetchArticle(id).catch(() => null);

  if (!article) notFound();

  const contentProps = {
    tag: article.tags[0],
    author: `@${article.author}`,
    date: article.publishedAt ?? "",
    title: article.title,
    body: article.content?.split("\n").filter(Boolean) ?? [],
    imageSrc: article.imageUrls[0],
    thumbnails: article.imageUrls.slice(1),
  };

  return (
    <>
      <Link href="/" style={{ textDecoration: "none" }}>
        <Typography sx={{ ...captionText, mb: 2, cursor: "pointer", "&:hover": { color: "text.primary" } }}>
          ← 피드로 돌아가기
        </Typography>
      </Link>

      <Box sx={pageWithSidebar}>
        <Box sx={mainContent}>
          <ArticleContent {...contentProps} />
        </Box>

        {/* PC */}
        <Box sx={sidebarWidth}>
          <SidePanel article={article} />
        </Box>
      </Box>

      {/* 모바일 */}
      <Box sx={mobileSidebar}>
        <SidePanel article={article} />
      </Box>
    </>
  );
}
