import Typography from "@mui/material/Typography";
import { captionText } from "@/lib/styles/typography";

interface SectionLabelProps {
  children: React.ReactNode;
}

export default function SectionLabel({ children }: SectionLabelProps) {
  return (
    <Typography sx={captionText}>{children}</Typography>
  );
}
