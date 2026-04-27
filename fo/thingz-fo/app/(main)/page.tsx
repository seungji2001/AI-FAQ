import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FeaturedCard from "../components/FeaturedCard";
import ItemCard from "../components/ItemCard";
import TodayEditors from "../components/TodayEditors";

export default function Home() {
  return (
    <Box sx={{ display: "flex", gap: 4, alignItems: "flex-start" }}>
      {/* 메인 콘텐츠 */}
      <Box component="article" sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 4 }}>
        <FeaturedCard />
        <Box>
          <Typography sx={{ fontSize: "16px", fontWeight: 700, color: "text.primary", mb: 2 }}>
            최근 아티클
          </Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" }, gap: 3 }}>
            <ItemCard />
            <ItemCard />
            <ItemCard />
          </Box>
        </Box>
      </Box>

      {/* 사이드 */}
      <Box component="aside" sx={{ width: 360, flexShrink: 0, display: { xs: "none", md: "block" } }}>
        <TodayEditors />
      </Box>
    </Box>
  );
}
