"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Link from "next/link";

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
  price = "230,000원",
  imageSrc,
}: FeaturedCardProps) {
  return (
    <Link href={`/article/${id}`} style={{ textDecoration: "none" }}>
    <Box
      sx={{
        width: "100%",
        borderRadius: 3,
        overflow: "hidden",
        bgcolor: "white",
        boxShadow: 1,
        cursor: "pointer",
        transition: "box-shadow 0.2s",
        "&:hover": { boxShadow: 4 },
      }}
    >
      {/* 이미지 영역 */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          aspectRatio: { xs: "4 / 3", sm: "16 / 7", md: "16 / 6" },
          bgcolor: "grey.300",
          backgroundImage: imageSrc ? `url(${imageSrc})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Chip
          label="FEATURED"
          size="small"
          sx={{
            position: "absolute",
            top: 12,
            left: 16,
            bgcolor: "orange.300",
            backgroundColor: "#FBA96E",
            color: "white",
            fontWeight: 700,
            fontSize: "10px",
            height: 24,
            borderRadius: 1,
          }}
        />
      </Box>

      {/* 텍스트 영역 */}
      <Box sx={{ px: { xs: 2, md: 3 }, pt: { xs: 1.5, md: 2 }, pb: { xs: 2, md: 3 } }}>
        <Typography
          sx={{
            fontSize: { xs: "18px", md: "24px" },
            fontWeight: 700,
            color: "text.primary",
            mb: 0.5,
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            fontSize: "12px",
            color: "text.secondary",
          }}
        >
          {author}&nbsp;&nbsp;·&nbsp;&nbsp;{category}&nbsp;&nbsp;·&nbsp;&nbsp;{price}
        </Typography>
      </Box>
    </Box>
    </Link>
  );
}
