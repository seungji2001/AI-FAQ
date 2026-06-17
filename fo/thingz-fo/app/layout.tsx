import type { Metadata } from "next";
import ThemeRegistry from "./ThemeRegistry";
import { LanguageProvider } from "@/lib/i18n/context";
import { ToastProvider } from "@/app/components/ui/Toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "Thingz",
  description: "Thingz FO",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>
        <ThemeRegistry>
          <LanguageProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </LanguageProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
