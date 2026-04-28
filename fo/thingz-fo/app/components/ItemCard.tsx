"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { cardBase } from "@/lib/styles/sx";
import { BRAND_COLOR } from "@/lib/constants/theme";
import { fs, fw, dim } from "@/lib/styles/typography";
import CardImageBox from "@/app/components/ui/CardImageBox";

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
      <Box sx={{ ...cardBase, borderRadius: dim.radiusCard }}>
        <CardImageBox imageSrc={imageSrc} aspectRatio="16 / 9" />
        <Box sx={{ px: 1.5, pt: 1, pb: 1.5 }}>
          <Typography sx={{ fontSize: fs.sm, color: BRAND_COLOR, mb: 0.5 }}>
            {tag}
          </Typography>
          <Typography sx={{ fontSize: fs.sm, fontWeight: fw.bold, color: "text.primary" }}>
            {title}
          </Typography>
        </Box>
      </Box>
    </Link>
  );
}
