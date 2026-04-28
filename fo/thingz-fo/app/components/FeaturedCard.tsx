"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { cardBase } from "@/lib/styles/sx";
import { fs, fw, captionText, titleLg } from "@/lib/styles/typography";
import CardImageBox from "@/app/components/ui/CardImageBox";

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
      <Box sx={cardBase}>
        <CardImageBox
          imageSrc={imageSrc}
          aspectRatio={{ xs: "4 / 3", sm: "16 / 7", md: "16 / 6" }}
          badge="FEATURED"
          badgePosition={{ top: 12, left: 16 }}
        />
        <Box sx={{ px: { xs: 2, md: 3 }, pt: { xs: 1.5, md: 2 }, pb: { xs: 2, md: 3 } }}>
          <Typography sx={titleLg}>{title}</Typography>
          <Typography sx={captionText}>
            {author}&nbsp;&nbsp;·&nbsp;&nbsp;{category}
            {price && <>&nbsp;&nbsp;·&nbsp;&nbsp;{price}</>}
          </Typography>
        </Box>
      </Box>
    </Link>
  );
}
