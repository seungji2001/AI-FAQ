import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Link from "next/link";
import { BRAND_COLOR } from "@/lib/constants/theme";
import { fs, fw, lh, dim } from "@/lib/styles/typography";

interface ItemCardProps {
  id?: string;
  tag?: string;
  title?: string;
  author?: string;
  imageSrc?: string;
  price?: number | null;
}

export default function ItemCard({
  id = "1",
  tag = "#오브제",
  title = "책상 위의 세계, 10년 묵은 스탠드 램프",
  author,
  imageSrc,
  price,
}: ItemCardProps) {
  return (
    <Link href={`/article/${id}`} style={{ textDecoration: "none" }}>
      <Box
        sx={{
          display: "flex",
          gap: { xs: 2, md: 3 },
          py: { xs: 2.5, md: 3 },
          borderBottom: "1px solid",
          borderColor: "grey.100",
          alignItems: "flex-start",
          "&:hover .card-title": { color: "grey.600" },
        }}
      >
        {/* 왼쪽: 텍스트 */}
        <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 0.75 }}>
          {author && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <Avatar sx={{ width: 20, height: 20, bgcolor: "grey.400", fontSize: fs.xs }}>
                {author[0]?.toUpperCase()}
              </Avatar>
              <Typography sx={{ fontSize: fs.sm, color: "text.secondary", fontWeight: fw.medium }}>
                @{author}
              </Typography>
            </Box>
          )}

          <Typography
            className="card-title"
            sx={{
              fontSize: { xs: fs.xl, md: fs["3xl"] },
              fontWeight: fw.semibold,
              color: "text.primary",
              lineHeight: lh.tight,
              transition: "color 0.15s",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {title}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5, flexWrap: "wrap" }}>
            {tag && (
              <Typography sx={{ fontSize: fs.sm, color: "text.secondary", bgcolor: "grey.100", px: 1, py: 0.25, borderRadius: dim.radiusTag }}>
                {tag}
              </Typography>
            )}
            {price != null && (
              <Typography sx={{ fontSize: fs.sm, color: BRAND_COLOR, fontWeight: fw.semibold }}>
                {price.toLocaleString()}원
              </Typography>
            )}
          </Box>
        </Box>

        {/* 오른쪽: 썸네일 */}
        {imageSrc && (
          <Box
            sx={{
              width: dim.thumbnailWidth,
              height: dim.thumbnailWidth,
              flexShrink: 0,
              borderRadius: dim.radiusCard,
              backgroundImage: `url(${imageSrc})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              bgcolor: "grey.200",
            }}
          />
        )}
      </Box>
    </Link>
  );
}
