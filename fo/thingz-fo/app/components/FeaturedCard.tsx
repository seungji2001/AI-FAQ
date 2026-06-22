import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Link from "next/link";
import { fs, fw, lh, ls, dim } from "@/lib/styles/typography";
import { cardImage, imgContain } from "@/lib/styles/sx";
import { BRAND_COLOR, INK, IVORY } from "@/lib/constants/theme";

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
            ...cardImage,
            aspectRatio: { xs: "16/9", md: "21/9" },
            borderRadius: dim.radiusCard,
            mb: 2.5,
            position: "relative",
          }}
        >
          {imageSrc ? (
            <Box component="img" src={imageSrc} alt={title} sx={imgContain} />
          ) : (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography sx={{ fontFamily: "var(--font-pacifico)", fontSize: { xs: fs["5xl"], md: fs["6xl"] }, color: BRAND_COLOR }}>
                Thingz
              </Typography>
              <Typography sx={{ fontSize: fs.xs, color: "text.secondary", fontWeight: fw.semibold, letterSpacing: ls.wide }}>
                STORY WAITING FOR A PHOTO
              </Typography>
            </Box>
          )}
          <Box sx={{ position: "absolute", top: 16, left: 16, bgcolor: INK, color: IVORY, px: 1.5, py: 0.5, borderRadius: dim.radiusTag, fontSize: fs.sm, fontWeight: fw.semibold, letterSpacing: ls.wide }}>
            FEATURED
          </Box>
        </Box>

        {/* 텍스트 */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          <Typography sx={{ fontSize: fs.sm, color: "text.secondary", fontWeight: fw.semibold, textTransform: "uppercase", letterSpacing: ls.wider }}>
            {category}
          </Typography>

          <Typography
            className="featured-title"
            sx={{ fontSize: { xs: fs["4xl"], md: fs["5xl"] }, fontWeight: fw.bold, color: "text.primary", lineHeight: lh.tight, transition: "opacity 0.15s" }}
          >
            {title}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar sx={{ width: 24, height: 24, bgcolor: "grey.400", fontSize: fs.xs }}>
              {author[1]?.toUpperCase()}
            </Avatar>
            <Typography sx={{ fontSize: fs.md, color: "text.secondary", fontWeight: fw.medium }}>
              {author}
            </Typography>
            {price && (
              <>
                <Typography sx={{ fontSize: fs.md, color: "text.disabled" }}>·</Typography>
                <Typography sx={{ fontSize: fs.md, color: BRAND_COLOR, fontWeight: fw.bold }}>{price}</Typography>
              </>
            )}
          </Box>
        </Box>
      </Box>
    </Link>
  );
}
