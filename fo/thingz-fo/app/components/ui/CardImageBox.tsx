import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { SxProps, Theme } from "@mui/material/styles";
import { cardImage, imgContain } from "@/lib/styles/sx";
import { INK, IVORY } from "@/lib/constants/theme";
import { badgeChip } from "@/lib/styles/typography";

interface CardImageBoxProps {
  imageSrc?: string;
  alt?: string;
  aspectRatio: string | { [key: string]: string };
  badge?: string;
  badgePosition?: { top: number; left: number };
  sx?: SxProps<Theme>;
}

export default function CardImageBox({
  imageSrc,
  alt = "",
  aspectRatio,
  badge,
  badgePosition = { top: 12, left: 16 },
  sx,
}: CardImageBoxProps) {
  return (
    <Box
      sx={[
        cardImage,
        { position: "relative" as const, aspectRatio },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      {imageSrc && (
        <Box component="img" src={imageSrc} alt={alt} sx={imgContain} />
      )}
      {badge && (
        <Chip
          label={badge}
          size="small"
          sx={{
            ...badgeChip,
            position: "absolute",
            top: badgePosition.top,
            left: badgePosition.left,
            bgcolor: INK,
            color: IVORY,
          }}
        />
      )}
    </Box>
  );
}
