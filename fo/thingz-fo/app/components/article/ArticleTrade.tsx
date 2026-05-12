"use client";

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
import { useT } from "@/lib/i18n/context";

interface TradeInfo { condition?: string; delivery?: string; location?: string }
interface SellerInfo { userId?: string; username?: string; followers?: string; avatarSrc?: string }

interface ArticleTradeProps {
  price?: string; isSold?: boolean; trade?: TradeInfo; seller?: SellerInfo;
  instagramId?: string | null; kakaoUrl?: string | null;
  onSoldClick?: () => void; onLoginRequired?: () => void;
}

export default function ArticleTrade({
  price = "230,000원", isSold = false, trade = {}, seller = {},
  instagramId, kakaoUrl, onSoldClick, onLoginRequired,
}: ArticleTradeProps) {
  const t = useT();

  const INFO_ROWS = [
    { label: t.article.condition, value: trade.condition },
    { label: t.article.delivery, value: trade.delivery },
    { label: t.article.location, value: trade.location },
  ].filter(({ value }) => value);

  return (
    <Box sx={{ ...panelBase, p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography sx={{ fontSize: fs["5xl"], fontWeight: fw.bold, color: "text.primary" }}>{price}</Typography>
        {isSold && <Chip label={t.article.sold} size="small" sx={{ bgcolor: "grey.300", color: "text.secondary", fontWeight: fw.bold }} />}
      </Box>

      {INFO_ROWS.length > 0 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {INFO_ROWS.map(({ label, value }) => (
            <Box key={label} sx={{ display: "flex", gap: 2 }}>
              <Typography sx={{ fontSize: fs.sm, color: "text.secondary", width: 36, flexShrink: 0 }}>{label}</Typography>
              <Typography sx={{ fontSize: fs.sm, color: "text.primary" }}>{value}</Typography>
            </Box>
          ))}
        </Box>
      )}

      {!isSold && (instagramId || kakaoUrl) && (
        <>
          <Divider />
          <Box>
            <SectionLabel>{t.article.contactSection}</SectionLabel>
            <Box sx={{ display: "flex", gap: 1.5, mt: 1.5 }}>
              {instagramId && (
                <Button fullWidth component="a" href={`https://instagram.com/${instagramId}`}
                  target="_blank" rel="noopener noreferrer" variant="contained" disableElevation sx={btnDark}
                >
                  {t.article.instagramDm}
                </Button>
              )}
              {kakaoUrl && (
                <Button fullWidth component="a" href={kakaoUrl}
                  target="_blank" rel="noopener noreferrer" variant="contained" disableElevation
                  sx={{ ...btnDark, bgcolor: KAKAO_COLOR, color: "grey.900", "&:hover": { bgcolor: KAKAO_COLOR_HOVER } }}
                >
                  {t.article.kakaoChat}
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
            {t.article.markAsSold}
          </Button>
        </>
      )}

      <Divider />
      <Box>
        <SectionLabel>{t.article.seller}</SectionLabel>
        <Box sx={{ mt: 1.5 }}>
          <EditorItem userId={seller.userId} username={seller.username} followers={seller.followers} avatarSrc={seller.avatarSrc} onLoginRequired={onLoginRequired} />
        </Box>
      </Box>
    </Box>
  );
}
