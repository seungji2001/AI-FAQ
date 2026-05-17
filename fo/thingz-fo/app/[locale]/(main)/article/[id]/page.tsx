import Box from "@mui/material/Box";
import { notFound } from "next/navigation";
import ArticleContent from "@/app/components/article/ArticleContent";
import SidePanel from "./_components/SidePanel";
import { fetchArticle } from "@/lib/api/articles";
import { pageWithSidebar, sidebarWidth, mobileSidebar, mainContent } from "@/lib/styles/sx";

interface Props {
  params: Promise<{ id: string; locale: string }>;
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
