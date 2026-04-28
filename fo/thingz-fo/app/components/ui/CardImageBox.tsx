import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { SxProps, Theme } from "@mui/material/styles";
import { cardImage } from "@/lib/styles/sx";
import { BRAND_COLOR } from "@/lib/constants/theme";
import { badgeChip } from "@/lib/styles/typography";

interface CardImageBoxProps {
  imageSrc?: string;
  aspectRatio: string | { [key: string]: string };
  badge?: string;
  badgePosition?: { top: number; left: number };
  sx?: SxProps<Theme>;
}

export default function CardImageBox({
  imageSrc,
  aspectRatio,
  badge,
  badgePosition = { top: 12, left: 16 },
  sx,
}: CardImageBoxProps) {
  return (
    <Box
      sx={{
        ...cardImage,
        position: "relative",
        aspectRatio,
        backgroundImage: imageSrc ? `url(${imageSrc})` : undefined,
        ...sx,
      }}
    >
      {badge && (
        <Chip
          label={badge}
          size="small"
          sx={{
            ...badgeChip,
            position: "absolute",
            top: badgePosition.top,
            left: badgePosition.left,
            backgroundColor: BRAND_COLOR,
            color: "white",
          }}
        />
      )}
    </Box>
  );
}
