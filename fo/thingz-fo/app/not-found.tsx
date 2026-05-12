import { cookies } from "next/headers";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { getT } from "@/lib/i18n/translations";
import { fs, titleLg } from "@/lib/styles/typography";

export default async function NotFound() {
  const locale = (await cookies()).get("locale")?.value ?? "ko";
  const t = getT(locale);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: 2, textAlign: "center", px: 2 }}>
      <Typography sx={{ fontSize: fs.display, fontWeight: 700, color: "grey.200", lineHeight: 1 }}>
        {t.notFound.heading}
      </Typography>
      <Typography sx={titleLg}>{t.notFound.title}</Typography>
      <Typography sx={{ fontSize: fs.md, color: "text.secondary" }}>{t.notFound.description}</Typography>
      <Button href="/" variant="outlined" sx={{ mt: 1, borderRadius: 2 }}>{t.notFound.backToHome}</Button>
    </Box>
  );
}
