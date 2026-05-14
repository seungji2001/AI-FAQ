import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import { BRAND_COLOR } from "@/lib/constants/theme";
import { fs, fw, lh, titleLg, captionText, dim } from "@/lib/styles/typography";
import { cardImage } from "@/lib/styles/sx";

interface ArticleContentProps {
  tag?: string;
  author?: string;
  date?: string;
  title?: string;
  body?: string[];
  imageSrc?: string;
  thumbnails?: string[];
}

export default function ArticleContent({
  tag = "#빈티지",
  author = "@film_essay_kim",
  date = "2025.04.18",
  title = "3년을 함께한 필름 카메라, 이제 새 주인을 찾습니다",
  body = [],
  imageSrc,
  thumbnails = [],
}: ArticleContentProps) {
  return (
    <Box>
      {/* 태그 */}
      {tag && (
        <Typography sx={{ fontSize: fs.sm, color: BRAND_COLOR, fontWeight: fw.semibold, textTransform: "uppercase", letterSpacing: "0.08em", mb: 2 }}>
          {tag}
        </Typography>
      )}

      {/* 제목 */}
      <Typography sx={{ ...titleLg, mb: 2.5 }}>{title}</Typography>

      {/* 작성자 + 날짜 */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
        <Avatar sx={{ width: 36, height: 36, bgcolor: "grey.300", fontSize: fs.md, fontWeight: fw.semibold }}>
          {author[1]?.toUpperCase()}
        </Avatar>
        <Box>
          <Typography sx={{ fontSize: fs.md, fontWeight: fw.medium, color: "text.primary" }}>{author}</Typography>
          <Typography sx={captionText}>{date}</Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* 히어로 이미지 */}
      {imageSrc && (
        <Box
          sx={{
            ...cardImage,
            aspectRatio: { xs: "4/3", md: "16/7" },
            borderRadius: dim.radiusCard,
            backgroundImage: `url(${imageSrc})`,
            mb: 3,
          }}
        />
      )}

      {/* 본문 */}
      {body.length > 0 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {body.map((paragraph, i) => (
            <Typography
              key={i}
              sx={{ fontSize: fs["2xl"], color: "text.primary", lineHeight: lh.relaxed, fontWeight: fw.normal }}
            >
              {paragraph}
            </Typography>
          ))}
        </Box>
      )}

      {/* 추가 이미지 */}
      {thumbnails.length > 0 && (
        <Box sx={{ display: "flex", gap: 1.5, mt: 3, flexWrap: "wrap" }}>
          {thumbnails.map((src, i) => (
            <Box
              key={i}
              sx={{ width: dim.thumbnailWidth, aspectRatio: "4/3", borderRadius: dim.radiusCard, flexShrink: 0, ...cardImage, backgroundImage: `url(${src})` }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
