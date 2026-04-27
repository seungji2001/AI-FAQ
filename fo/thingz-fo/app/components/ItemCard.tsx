"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "next/link";

interface ItemCardProps {
  id?: string;
  tag?: string;
  title?: string;
  imageSrc?: string;
}

export default function ItemCard({
  id = "1",
  tag = "#오브제",
  title = "책상 위의 세계, 10년 묵은 스탠드 램프",
  imageSrc,
}: ItemCardProps) {
  return (
    <Link href={`/article/${id}`} style={{ textDecoration: "none" }}>
    <Box
      sx={{
        width: "100%",
        borderRadius: "10px",
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
          width: "100%",
          aspectRatio: "16 / 9",
          bgcolor: "grey.200",
          backgroundImage: imageSrc ? `url(${imageSrc})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* 텍스트 영역 */}
      <Box sx={{ px: 1.5, pt: 1, pb: 1.5 }}>
        <Typography sx={{ fontSize: "12px", color: "#FBA96E", mb: 0.5 }}>
          {tag}
        </Typography>
        <Typography sx={{ fontSize: "12px", fontWeight: 700, color: "text.primary" }}>
          {title}
        </Typography>
      </Box>
    </Box>
    </Link>
  );
}
