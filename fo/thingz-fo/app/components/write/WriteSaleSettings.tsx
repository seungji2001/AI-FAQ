"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import { styled } from "@mui/material/styles";

const CONDITIONS = ["S급", "A급", "B급", "C급"];
const DELIVERY_METHODS = ["택배", "직거래", "협의"];

const OrangeSwitch = styled(Switch)(() => ({
  "& .MuiSwitch-switchBase.Mui-checked": { color: "white" },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#FBA96E" },
}));

interface SelectChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

function SelectChip({ label, selected, onClick }: SelectChipProps) {
  return (
    <Box
      onClick={onClick}
      sx={{
        px: 2.5,
        py: 1,
        borderRadius: "20px",
        bgcolor: selected ? "#FBA96E" : "grey.200",
        color: selected ? "white" : "text.primary",
        fontWeight: selected ? 700 : 400,
        fontSize: "12px",
        cursor: "pointer",
        userSelect: "none",
        transition: "all 0.15s",
      }}
    >
      {label}
    </Box>
  );
}

export default function WriteSaleSettings() {
  const [isSale, setIsSale] = useState(true);
  const [condition, setCondition] = useState("A급");
  const [delivery, setDelivery] = useState("택배");

  return (
    <Box sx={{ bgcolor: "white", borderRadius: 3, boxShadow: 1, p: 3, display: "flex", flexDirection: "column", gap: 2.5 }}>
      <Typography sx={{ fontSize: "16px", fontWeight: 700, color: "text.primary" }}>
        판매 설정
      </Typography>
      <Divider />

      {/* 판매 토글 */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Typography sx={{ fontSize: "14px", color: "text.primary" }}>이 물건 판매하기</Typography>
        <OrangeSwitch checked={isSale} onChange={(e) => setIsSale(e.target.checked)} />
      </Box>

      {isSale && (
        <>
          {/* 판매 가격 */}
          <Box>
            <Typography sx={{ fontSize: "12px", color: "text.secondary", mb: 1 }}>판매 가격</Typography>
            <Box sx={{ display: "flex", alignItems: "center", bgcolor: "grey.200", borderRadius: 2, px: 2, height: 40 }}>
              <InputBase
                defaultValue="230,000"
                fullWidth
                sx={{ fontSize: "14px" }}
                inputProps={{ "aria-label": "price" }}
              />
              <Typography sx={{ fontSize: "14px", color: "text.secondary", flexShrink: 0 }}>원</Typography>
            </Box>
          </Box>

          {/* 물건 상태 */}
          <Box>
            <Typography sx={{ fontSize: "12px", color: "text.secondary", mb: 1 }}>물건 상태</Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {CONDITIONS.map((c) => (
                <SelectChip key={c} label={c} selected={condition === c} onClick={() => setCondition(c)} />
              ))}
            </Box>
          </Box>

          {/* 거래 방식 */}
          <Box>
            <Typography sx={{ fontSize: "12px", color: "text.secondary", mb: 1 }}>거래 방식</Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {DELIVERY_METHODS.map((d) => (
                <SelectChip key={d} label={d} selected={delivery === d} onClick={() => setDelivery(d)} />
              ))}
            </Box>
          </Box>

          <Divider />

          {/* 거래 연락처 */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Typography sx={{ fontSize: "12px", color: "text.secondary" }}>거래 연락처</Typography>
            <Box sx={{ bgcolor: "grey.200", borderRadius: 2, px: 2, height: 40, display: "flex", alignItems: "center" }}>
              <InputBase
                placeholder="인스타그램 ID (예: @thingz_official)"
                fullWidth
                sx={{ fontSize: "12px" }}
              />
            </Box>
            <Box sx={{ bgcolor: "grey.200", borderRadius: 2, px: 2, height: 40, display: "flex", alignItems: "center" }}>
              <InputBase
                placeholder="카카오 오픈채팅 링크"
                fullWidth
                sx={{ fontSize: "12px" }}
              />
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}
