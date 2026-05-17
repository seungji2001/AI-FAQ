import Box from "@mui/material/Box";
import { pagePadding } from "@/lib/styles/sx";

export default function ArticleLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", ...pagePadding }}>
      {children}
    </Box>
  );
}
