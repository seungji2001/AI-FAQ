import Box from "@mui/material/Box";
import { fs, fw, dim } from "@/lib/styles/typography";
import { INK, IVORY } from "@/lib/constants/theme";

interface SelectChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export default function SelectChip({ label, selected, onClick }: SelectChipProps) {
  return (
    <Box
      onClick={onClick}
      sx={{
        px: 2.5,
        py: 1,
        borderRadius: dim.radiusPill,
        bgcolor: selected ? INK : "grey.200",
        color: selected ? IVORY : "text.primary",
        fontWeight: selected ? fw.bold : fw.normal,
        fontSize: fs.sm,
        cursor: "pointer",
        userSelect: "none",
        transition: "all 0.15s",
      }}
    >
      {label}
    </Box>
  );
}
