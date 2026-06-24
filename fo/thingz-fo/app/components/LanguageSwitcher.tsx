"use client";

import Box from "@mui/material/Box";
import { useLocale } from "@/lib/i18n/context";
import { Locale } from "@/lib/i18n/translations";
import { fs, fw } from "@/lib/styles/typography";
import { usePathname, useRouter } from "next/navigation";

const LOCALES: { value: Locale; label: string }[] = [
  { value: "ko", label: "한" },
  { value: "en", label: "EN" },
  { value: "ja", label: "日" },
];

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const handleLocaleChange = (nextLocale: Locale) => {
    if (nextLocale === locale) return;

    setLocale(nextLocale);
    const localizedPath = pathname.match(/^\/(ko|en|ja)(?=\/|$)/)
      ? pathname.replace(/^\/(ko|en|ja)(?=\/|$)/, `/${nextLocale}`)
      : `/${nextLocale}${pathname === "/" ? "" : pathname}`;
    router.replace(localizedPath);
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
      {LOCALES.map(({ value, label }, i) => (
        <Box key={value} sx={{ display: "flex", alignItems: "center" }}>
          <Box
            component="button"
            onClick={() => handleLocaleChange(value)}
            sx={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: fs.sm,
              fontWeight: locale === value ? fw.bold : fw.normal,
              color: locale === value ? "text.primary" : "text.secondary",
              px: 0.5,
              py: 0,
              lineHeight: 1,
              opacity: locale === value ? 1 : 0.5,
              transition: "opacity 0.15s",
              "&:hover": { opacity: 1 },
            }}
          >
            {label}
          </Box>
          {i < LOCALES.length - 1 && (
            <Box component="span" sx={{ fontSize: fs.sm, color: "grey.400", userSelect: "none" }}>|</Box>
          )}
        </Box>
      ))}
    </Box>
  );
}
