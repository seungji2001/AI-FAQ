import Box from "@mui/material/Box";
import Header from "../components/Header";
import { pagePadding } from "@/lib/styles/sx";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <Box component="main" sx={pagePadding}>
        {children}
      </Box>
    </>
  );
}
