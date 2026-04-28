import Box from "@mui/material/Box";
import { pagePadding } from "@/lib/styles/sx";

export default function WriteLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box component="main" sx={{ bgcolor: "grey.100", minHeight: "100vh", ...pagePadding }}>
      {children}
    </Box>
  );
}
