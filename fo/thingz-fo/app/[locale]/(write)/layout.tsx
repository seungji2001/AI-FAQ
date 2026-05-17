import Box from "@mui/material/Box";
import Header from "@/app/components/Header";
import { pagePadding } from "@/lib/styles/sx";

export default function WriteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <Box component="main" sx={{ bgcolor: "background.default", minHeight: "100vh", ...pagePadding }}>
        {children}
      </Box>
    </>
  );
}
