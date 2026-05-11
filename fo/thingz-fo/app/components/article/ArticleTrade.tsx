import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import EditorItem from "@/app/components/EditorItem";
import SectionLabel from "@/app/components/ui/SectionLabel";
import { panelBase } from "@/lib/styles/sx";
import { KAKAO_COLOR, KAKAO_COLOR_HOVER } from "@/lib/constants/theme";
import { fs, fw, btnDark } from "@/lib/styles/typography";

interface TradeInfo {
  condition?: string;
  delivery?: string;
  location?: string;
}

interface SellerInfo {
  userId?: string;
  username?: string;
  followers?: string;
  avatarSrc?: string;
}

interface ArticleTradeProps {
  price?: string;
  isSold?: boolean;
  trade?: TradeInfo;
  seller?: SellerInfo;
  instagramId?: string | null;
  kakaoUrl?: string | null;
  onSoldClick?: () => void;
  onLoginRequired?: () => void;
}

export default function ArticleTrade({
  price = "230,000원",
  isSold = false,
  trade = {},
  seller = {},
  instagramId,
  kakaoUrl,
  onSoldClick,
  onLoginRequired,
}: ArticleTradeProps) {
  const INFO_ROWS = [
    { label: "상태", value: trade.condition },
    { label: "거래", value: trade.delivery },
    { label: "지역", value: trade.location },
  ].filter(({ value }) => value);

  return (
    <Box sx={{ ...panelBase, p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography sx={{ fontSize: fs["5xl"], fontWeight: fw.bold, color: "text.primary" }}>
          {price}
        </Typography>
        {isSold && (
          <Chip label="판매완료" size="small" sx={{ bgcolor: "grey.300", color: "text.secondary", fontWeight: fw.bold }} />
        )}
      </Box>

      {INFO_ROWS.length > 0 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {INFO_ROWS.map(({ label, value }) => (
            <Box key={label} sx={{ display: "flex", gap: 2 }}>
              <Typography sx={{ fontSize: fs.sm, color: "text.secondary", width: 36, flexShrink: 0 }}>
                {label}
              </Typography>
              <Typography sx={{ fontSize: fs.sm, color: "text.primary" }}>
                {value}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      {!isSold && (instagramId || kakaoUrl) && (
        <>
          <Divider />
          <Box>
            <SectionLabel>거래 문의하기</SectionLabel>
            <Box sx={{ display: "flex", gap: 1.5, mt: 1.5 }}>
              {instagramId && (
                <Button
                  fullWidth component="a"
                  href={`https://instagram.com/${instagramId}`}
                  target="_blank" rel="noopener noreferrer"
                  variant="contained" disableElevation sx={btnDark}
                >
                  📷 인스타그램 DM
                </Button>
              )}
              {kakaoUrl && (
                <Button
                  fullWidth component="a"
                  href={kakaoUrl}
                  target="_blank" rel="noopener noreferrer"
                  variant="contained" disableElevation
                  sx={{ ...btnDark, bgcolor: KAKAO_COLOR, color: "grey.900", "&:hover": { bgcolor: KAKAO_COLOR_HOVER } }}
                >
                  💬 카카오 오픈채팅
                </Button>
              )}
            </Box>
          </Box>
        </>
      )}

      {onSoldClick && !isSold && (
        <>
          <Divider />
          <Button variant="outlined" fullWidth onClick={onSoldClick}
            sx={{ fontSize: fs.sm, fontWeight: fw.bold, borderRadius: 2, color: "text.secondary", borderColor: "grey.400" }}
          >
            판매 완료로 변경
          </Button>
        </>
      )}

      <Divider />

      <Box>
        <SectionLabel>판매자</SectionLabel>
        <Box sx={{ mt: 1.5 }}>
          <EditorItem
            userId={seller.userId}
            username={seller.username}
            followers={seller.followers}
            avatarSrc={seller.avatarSrc}
            onLoginRequired={onLoginRequired}
          />
        </Box>
      </Box>
    </Box>
  );
}
