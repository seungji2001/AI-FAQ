"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import { styled } from "@mui/material/styles";
import InputRow from "@/app/components/ui/InputRow";
import SectionLabel from "@/app/components/ui/SectionLabel";
import { panelBase } from "@/lib/styles/sx";
import { BRAND_COLOR } from "@/lib/constants/theme";
import { fs, fw, dim, titleMd } from "@/lib/styles/typography";

const CONDITIONS = ["S급", "A급", "B급", "C급"];
const DELIVERY_METHODS = ["택배", "직거래", "협의"];

const OrangeSwitch = styled(Switch)(() => ({
  "& .MuiSwitch-switchBase.Mui-checked": { color: "white" },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: BRAND_COLOR },
}));

function SelectChip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <Box onClick={onClick} sx={{
      px: 2.5, py: 1, borderRadius: dim.radiusPill,
      bgcolor: selected ? BRAND_COLOR : "grey.200",
      color: selected ? "white" : "text.primary",
      fontWeight: selected ? fw.bold : fw.normal,
      fontSize: fs.sm, cursor: "pointer", userSelect: "none", transition: "all 0.15s",
    }}>
      {label}
    </Box>
  );
}

export interface SaleSettingsValue {
  isSale: boolean;
  price: string;
  condition: string;
  delivery: string;
  instagramId: string;
  kakaoUrl: string;
}

interface WriteSaleSettingsProps {
  value: SaleSettingsValue;
  onChange: (v: SaleSettingsValue) => void;
}

export default function WriteSaleSettings({ value, onChange }: WriteSaleSettingsProps) {
  const set = (patch: Partial<SaleSettingsValue>) => onChange({ ...value, ...patch });

  return (
    <Box sx={{ ...panelBase, p: 3, display: "flex", flexDirection: "column", gap: 2.5 }}>
      <Typography sx={titleMd}>판매 설정</Typography>
      <Divider />

      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Typography sx={{ fontSize: fs.md }}>이 물건 판매하기</Typography>
        <OrangeSwitch checked={value.isSale} onChange={(e) => set({ isSale: e.target.checked })} />
      </Box>

      {value.isSale && (
        <>
          <Box>
            <SectionLabel>판매 가격</SectionLabel>
            <Box sx={{ display: "flex", alignItems: "center", bgcolor: "grey.200", borderRadius: 2, px: 2, height: 40, mt: 1 }}>
              <InputBase value={value.price} onChange={(e) => set({ price: e.target.value })} fullWidth sx={{ fontSize: fs.md }} />
              <Typography sx={{ fontSize: fs.md, color: "text.secondary", flexShrink: 0 }}>원</Typography>
            </Box>
          </Box>

          <Box>
            <SectionLabel>물건 상태</SectionLabel>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
              {CONDITIONS.map((c) => (
                <SelectChip key={c} label={c} selected={value.condition === c} onClick={() => set({ condition: c })} />
              ))}
            </Box>
          </Box>

          <Box>
            <SectionLabel>거래 방식</SectionLabel>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
              {DELIVERY_METHODS.map((d) => (
                <SelectChip key={d} label={d} selected={value.delivery === d} onClick={() => set({ delivery: d })} />
              ))}
            </Box>
          </Box>

          <Divider />

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <SectionLabel>거래 연락처</SectionLabel>
            <InputRow
              value={value.instagramId}
              onChange={(v) => set({ instagramId: v })}
              placeholder="인스타그램 ID (예: @thingz_official)"
            />
            <InputRow
              value={value.kakaoUrl}
              onChange={(v) => set({ kakaoUrl: v })}
              placeholder="카카오 오픈채팅 링크"
            />
          </Box>
        </>
      )}
    </Box>
  );
}
