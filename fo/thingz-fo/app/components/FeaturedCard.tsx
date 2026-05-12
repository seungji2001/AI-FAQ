import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Link from "next/link";
import { fs, fw, lh, dim } from "@/lib/styles/typography";
import { BRAND_COLOR } from "@/lib/constants/theme";

interface FeaturedCardProps {
  id?: string;
  title?: string;
  author?: string;
  category?: string;
  price?: string;
  imageSrc?: string;
}

export default function FeaturedCard({
  id = "1",
  title = "3년을 함께한 필름 카메라, 이제 새 주인을 찾습니다",
  author = "@film_essay_kim",
  category = "빈티지",
  price,
  imageSrc,
}: FeaturedCardProps) {
  return (
    <Link href={`/article/${id}`} style={{ textDecoration: "none" }}>
      <Box sx={{ "&:hover .featured-title": { opacity: 0.75 }, transition: "opacity 0.15s" }}>
        {/* 이미지 */}
        <Box
          sx={{
            width: "100%",
            aspectRatio: { xs: "16/9", md: "21/9" },
            borderRadius: dim.radiusCard,
            backgroundImage: imageSrc ? `url(${imageSrc})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
            bgcolor: "grey.200",
            mb: 2.5,
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* FEATURED 배지 */}
          <Box sx={{ position: "absolute", top: 16, left: 16, bgcolor: BRAND_COLOR, color: "white", px: 1.5, py: 0.5, borderRadius: "4px", fontSize: fs.sm, fontWeight: fw.semibold, letterSpacing: "0.05em" }}>
            FEATURED
          </Box>
        </Box>

        {/* 텍스트 */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {/* 카테고리 */}
          <Typography sx={{ fontSize: fs.sm, color: BRAND_COLOR, fontWeight: fw.semibold, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            {category}
          </Typography>

          {/* 제목 */}
          <Typography
            className="featured-title"
            sx={{
              fontSize: { xs: fs["4xl"], md: fs["5xl"] },
              fontWeight: fw.bold,
              color: "text.primary",
              lineHeight: lh.tight,
              transition: "opacity 0.15s",
            }}
          >
            {title}
          </Typography>

          {/* 작성자 + 가격 */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar sx={{ width: 24, height: 24, bgcolor: "grey.400", fontSize: "11px" }}>
              {author[1]?.toUpperCase()}
            </Avatar>
            <Typography sx={{ fontSize: fs.md, color: "text.secondary", fontWeight: fw.medium }}>
              {author}
            </Typography>
            {price && (
              <>
                <Typography sx={{ fontSize: fs.md, color: "text.disabled" }}>·</Typography>
                <Typography sx={{ fontSize: fs.md, color: BRAND_COLOR, fontWeight: fw.semibold }}>{price}</Typography>
              </>
            )}
          </Box>
        </Box>
      </Box>
    </Link>
  );
}
