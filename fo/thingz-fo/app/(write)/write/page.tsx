import Box from "@mui/material/Box";
import WriteHeader from "../../components/write/WriteHeader";
import WriteEditor from "../../components/write/WriteEditor";
import WriteSaleSettings from "../../components/write/WriteSaleSettings";

export default function WritePage() {
  return (
    <>
      <WriteHeader />
      <Box
        component="main"
        sx={{
          bgcolor: "grey.100",
          minHeight: "100vh",
          px: { xs: 2, sm: 4, md: 8 },
          py: { xs: 3, md: 5 },
          display: "flex",
          gap: 3,
          alignItems: "flex-start",
        }}
      >
        {/* 좌측: 에디터 */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <WriteEditor />
        </Box>

        {/* 우측: 판매 설정 */}
        <Box sx={{ width: { md: 360, lg: 460 }, flexShrink: 0, display: { xs: "none", md: "block" } }}>
          <WriteSaleSettings />
        </Box>
      </Box>

      {/* 모바일: 판매 설정 하단 */}
      <Box sx={{ display: { xs: "block", md: "none" }, px: 2, pb: 4 }}>
        <WriteSaleSettings />
      </Box>
    </>
  );
}
