import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import ArticleContent from "../../../components/article/ArticleContent";
import ArticleTrade from "../../../components/article/ArticleTrade";
import ArticleEditorProfile from "../../../components/article/ArticleEditorProfile";

export default function ArticleDetailPage() {
  return (
    <Box sx={{ bgcolor: "grey.100", minHeight: "100vh", mx: -8, px: { xs: 2, sm: 4, md: 8 }, py: { xs: 2, md: 4 } }}>
      {/* 뒤로가기 */}
      <Link href="/" style={{ textDecoration: "none" }}>
        <Typography
          sx={{ fontSize: "12px", color: "text.secondary", mb: 2, cursor: "pointer", "&:hover": { color: "text.primary" } }}
        >
          ← 피드로 돌아가기
        </Typography>
      </Link>

      {/* PC: 좌우 2단 */}
      <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start" }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <ArticleContent />
        </Box>
        <Box sx={{ width: { md: 360, lg: 460 }, flexShrink: 0, display: { xs: "none", md: "flex" }, flexDirection: "column", gap: 3 }}>
          <ArticleTrade />
          <ArticleEditorProfile />
        </Box>
      </Box>

      {/* 모바일: 하단 배치 */}
      <Box sx={{ display: { xs: "flex", md: "none" }, flexDirection: "column", gap: 3, mt: 3 }}>
        <ArticleTrade />
        <ArticleEditorProfile />
      </Box>
    </Box>
  );
}
