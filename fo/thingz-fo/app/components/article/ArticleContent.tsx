"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";

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
  body = [
    "처음 이 카메라를 손에 넣은 건 대학교 졸업 직전이었다. 친구의 권유로 중고 카메라 가게에 들어갔다가, 구석에 놓인 이 Olympus OM-1을 발견했다. 흠집 하나 없이 깨끗한 바디, 손에 쥐는 순간 느껴지는 묵직함. 그냥 지나칠 수가 없었다.",
    "3년 동안 제주도, 교토, 서울 골목골목을 함께 다녔다. 필름 특유의 그레인이 담긴 사진들은 지금도 내 방 벽에 걸려있다. 이제 더 작은 공간으로 이사를 가게 되어 새 주인을 찾는다.",
  ],
  imageSrc,
  thumbnails = [],
}: ArticleContentProps) {
  return (
    <Box sx={{ bgcolor: "white", borderRadius: 3, overflow: "hidden", boxShadow: 1 }}>
      {/* 대표 이미지 */}
      <Box
        sx={{
          width: "100%",
          aspectRatio: { xs: "4/3", md: "16/7" },
          bgcolor: "grey.300",
          position: "relative",
          backgroundImage: imageSrc ? `url(${imageSrc})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Chip
          label={tag}
          size="small"
          sx={{
            position: "absolute",
            top: 24,
            left: 24,
            bgcolor: "#FBA96E",
            color: "white",
            fontWeight: 700,
            fontSize: "12px",
            borderRadius: 1,
            height: 28,
          }}
        />
      </Box>

      {/* 본문 */}
      <Box sx={{ px: { xs: 2, md: 4 }, py: 3, display: "flex", flexDirection: "column", gap: 2 }}>
        {/* 작성자 / 날짜 */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography sx={{ fontSize: "14px", fontWeight: 700, color: "#FBA96E" }}>
            {author}
          </Typography>
          <Typography sx={{ fontSize: "12px", color: "text.secondary" }}>
            · {date}
          </Typography>
        </Box>

        {/* 제목 */}
        <Typography sx={{ fontSize: { xs: "20px", md: "24px" }, fontWeight: 700, color: "text.primary" }}>
          {title}
        </Typography>

        {/* 본문 단락 */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {body.map((paragraph, i) => (
            <Typography key={i} sx={{ fontSize: "14px", color: "text.secondary", lineHeight: 1.8 }}>
              {paragraph}
            </Typography>
          ))}
        </Box>

        {/* 썸네일 이미지 목록 */}
        <Box sx={{ display: "flex", gap: 1.5, mt: 1, flexWrap: "wrap" }}>
          {(thumbnails.length > 0 ? thumbnails : Array(4).fill(null)).map((src, i) => (
            <Box
              key={i}
              sx={{
                width: 112,
                height: 80,
                borderRadius: 2,
                bgcolor: "grey.200",
                backgroundImage: src ? `url(${src})` : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
                flexShrink: 0,
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
