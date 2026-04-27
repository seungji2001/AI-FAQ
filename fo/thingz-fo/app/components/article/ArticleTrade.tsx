"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import EditorItem from "../EditorItem";

interface TradeInfo {
  condition?: string;
  delivery?: string;
  location?: string;
}

interface SellerInfo {
  username?: string;
  followers?: string;
  avatarSrc?: string;
}

interface ArticleTradeProps {
  price?: string;
  trade?: TradeInfo;
  seller?: SellerInfo;
}

export default function ArticleTrade({
  price = "230,000원",
  trade = {
    condition: "A급 · 사용감 거의 없음",
    delivery: "택배 · 직거래 모두 가능",
    location: "서울 마포구",
  },
  seller = {
    username: "@film_essay_kim",
    followers: "1.2k",
  },
}: ArticleTradeProps) {
  const INFO_ROWS = [
    { label: "상태", value: trade.condition },
    { label: "거래", value: trade.delivery },
    { label: "지역", value: trade.location },
  ];

  return (
    <Box sx={{ bgcolor: "white", borderRadius: 3, boxShadow: 1, p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
      {/* 가격 */}
      <Typography sx={{ fontSize: "28px", fontWeight: 700, color: "text.primary" }}>
        {price}
      </Typography>

      {/* 거래 정보 */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {INFO_ROWS.map(({ label, value }) => (
          <Box key={label} sx={{ display: "flex", gap: 2 }}>
            <Typography sx={{ fontSize: "12px", color: "text.secondary", width: 36, flexShrink: 0 }}>
              {label}
            </Typography>
            <Typography sx={{ fontSize: "12px", color: "text.primary" }}>
              {value}
            </Typography>
          </Box>
        ))}
      </Box>

      <Divider />

      {/* 문의 버튼 */}
      <Box>
        <Typography sx={{ fontSize: "12px", color: "text.secondary", mb: 1.5 }}>
          거래 문의하기
        </Typography>
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Button fullWidth variant="contained" disableElevation
            sx={{ bgcolor: "grey.900", color: "white", borderRadius: 2, fontSize: "12px", fontWeight: 700, py: 1.5, "&:hover": { bgcolor: "grey.800" } }}
          >
            📷 인스타그램 DM
          </Button>
          <Button fullWidth variant="contained" disableElevation
            sx={{ bgcolor: "#FEE500", color: "grey.900", borderRadius: 2, fontSize: "12px", fontWeight: 700, py: 1.5, "&:hover": { bgcolor: "#f5dc00" } }}
          >
            💬 카카오 오픈채팅
          </Button>
        </Box>
      </Box>

      <Divider />

      {/* 판매자 - EditorItem 재활용 */}
      <Box>
        <Typography sx={{ fontSize: "12px", color: "text.secondary", mb: 1.5 }}>
          판매자
        </Typography>
        <EditorItem
          username={seller.username}
          followers={seller.followers}
          avatarSrc={seller.avatarSrc}
          following={false}
        />
      </Box>
    </Box>
  );
}
