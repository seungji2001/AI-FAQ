"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import Divider from "@mui/material/Divider";
import { styled } from "@mui/material/styles";
import InputRow from "@/app/components/ui/InputRow";
import SelectChip from "@/app/components/ui/SelectChip";
import SectionLabel from "@/app/components/ui/SectionLabel";
import { panelBase } from "@/lib/styles/sx";
import { BRAND_COLOR } from "@/lib/constants/theme";
import { fs, titleMd } from "@/lib/styles/typography";
import { useT } from "@/lib/i18n/context";

const OrangeSwitch = styled(Switch)(() => ({
  "& .MuiSwitch-switchBase.Mui-checked": { color: "white" },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: BRAND_COLOR },
}));

// condition: "S"|"A"|"B"|"C"  delivery: "택배"|"직거래"|"협의"
export interface SaleSettingsValue {
  isSale: boolean; price: string; condition: string; delivery: string; instagramId: string; kakaoUrl: string;
}

interface WriteSaleSettingsProps {
  value: SaleSettingsValue;
  onChange: (v: SaleSettingsValue) => void;
}

export default function WriteSaleSettings({ value, onChange }: WriteSaleSettingsProps) {
  const t = useT();
  const set = (patch: Partial<SaleSettingsValue>) => onChange({ ...value, ...patch });

  const CONDITIONS = [
    { key: "S", label: t.write.conditionS },
    { key: "A", label: t.write.conditionA },
    { key: "B", label: t.write.conditionB },
    { key: "C", label: t.write.conditionC },
  ];
  const DELIVERY_METHODS = [
    { key: "택배", label: t.write.deliveryParcel },
    { key: "직거래", label: t.write.deliveryDirect },
    { key: "협의", label: t.write.deliveryNegotiable },
  ];

  return (
    <Box sx={{ ...panelBase, p: 3, display: "flex", flexDirection: "column", gap: 2.5 }}>
      <Typography sx={titleMd}>{t.write.saleSettings}</Typography>
      <Divider />

      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Typography sx={{ fontSize: fs.md }}>{t.write.sellItem}</Typography>
        <OrangeSwitch checked={value.isSale} onChange={(e) => set({ isSale: e.target.checked })} />
      </Box>

      {value.isSale && (
        <>
          <Box>
            <SectionLabel>{t.write.price}</SectionLabel>
            <Box sx={{ mt: 1 }}>
              <InputRow value={value.price} onChange={(v) => set({ price: v })} placeholder={t.write.priceHint} suffix={t.write.priceUnit} />
            </Box>
          </Box>

          <Box>
            <SectionLabel>{t.write.itemCondition}</SectionLabel>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
              {CONDITIONS.map(({ key, label }) => (
                <SelectChip key={key} label={label} selected={value.condition === key} onClick={() => set({ condition: key })} />
              ))}
            </Box>
          </Box>

          <Box>
            <SectionLabel>{t.write.tradeMethod}</SectionLabel>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
              {DELIVERY_METHODS.map(({ key, label }) => (
                <SelectChip key={key} label={label} selected={value.delivery === key} onClick={() => set({ delivery: key })} />
              ))}
            </Box>
          </Box>

          <Divider />

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <SectionLabel>{t.write.contactInfo}</SectionLabel>
            <InputRow value={value.instagramId} onChange={(v) => set({ instagramId: v })} placeholder={t.write.instagramPlaceholder} />
            <InputRow value={value.kakaoUrl} onChange={(v) => set({ kakaoUrl: v })} placeholder={t.write.kakaoPlaceholder} />
          </Box>
        </>
      )}
    </Box>
  );
}
