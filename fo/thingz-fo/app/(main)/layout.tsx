import Box from "@mui/material/Box";
import Header from "../components/Header";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <Box
        component="main"
        sx={{
          px: { xs: 2, sm: 4, md: 8 },
          py: { xs: 3, md: 5 },
        }}
      >
        {children}
      </Box>
    </>
  );
}
