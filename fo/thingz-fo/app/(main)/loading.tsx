import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

export default function Loading() {
  return (
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" }, gap: 3 }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <Box key={i}>
          <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 3, mb: 1 }} />
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="text" width="50%" />
        </Box>
      ))}
    </Box>
  );
}
