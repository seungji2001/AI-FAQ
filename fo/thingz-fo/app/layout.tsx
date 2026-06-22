import type { Metadata } from "next";
import ThemeRegistry from "./ThemeRegistry";
import { LanguageProvider } from "@/lib/i18n/context";
import { ToastProvider } from "@/app/components/ui/Toast";
import { cookies } from "next/headers";
import { Locale } from "@/lib/i18n/translations";
import "./globals.css";

export const metadata: Metadata = {
  title: "Thingz",
  description: "Thingz FO",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const cookieLocale = (await cookies()).get("locale")?.value;
  const initialLocale: Locale = cookieLocale === "en" || cookieLocale === "ja" ? cookieLocale : "ko";

  return (
    <html lang="ko">
      <body>
        <ThemeRegistry>
          <LanguageProvider initialLocale={initialLocale}>
            <ToastProvider>
              {children}
            </ToastProvider>
          </LanguageProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
