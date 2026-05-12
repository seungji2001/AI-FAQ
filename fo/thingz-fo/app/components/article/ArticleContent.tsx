import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { cardBase, cardImage } from "@/lib/styles/sx";
import { BRAND_COLOR } from "@/lib/constants/theme";
import { fs, fw, lh, titleLg, captionText } from "@/lib/styles/typography";
import CardImageBox from "@/app/components/ui/CardImageBox";

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
    <Box sx={{ ...cardBase, cursor: "default", "&:hover": undefined }}>
      <CardImageBox
        imageSrc={imageSrc}
        aspectRatio={{ xs: "4/3", md: "16/7" }}
        badge={tag}
        badgePosition={{ top: 24, left: 24 }}
        sx={{ "& .MuiChip-root": { fontSize: fs.sm, height: 28 } }}
      />

      <Box sx={{ px: { xs: 2, md: 4 }, py: 3, display: "flex", flexDirection: "column", gap: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography sx={{ fontSize: fs.md, fontWeight: fw.bold, color: BRAND_COLOR }}>
            {author}
          </Typography>
          <Typography sx={captionText}>
            · {date}
          </Typography>
        </Box>

        <Typography sx={titleLg}>
          {title}
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {body.map((paragraph, i) => (
            <Typography key={i} sx={{ fontSize: fs.md, color: "text.primary", lineHeight: lh.relaxed }}>
              {paragraph}
            </Typography>
          ))}
        </Box>

        {thumbnails.length > 0 && (
          <Box sx={{ display: "flex", gap: 1.5, mt: 1, flexWrap: "wrap" }}>
            {thumbnails.map((src, i) => (
              <Box
                key={i}
                sx={{ width: { xs: 96, md: 120 }, aspectRatio: "4/3", borderRadius: 2, flexShrink: 0, ...cardImage, backgroundImage: `url(${src})` }}
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}
