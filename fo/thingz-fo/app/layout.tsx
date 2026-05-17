import type { Metadata } from "next";
import { Pacifico } from "next/font/google";
import ThemeRegistry from "./ThemeRegistry";
import { LanguageProvider } from "@/lib/i18n/context";
import { ToastProvider } from "@/app/components/ui/Toast";
import "./globals.css";

const pacifico = Pacifico({ subsets: ["latin"], weight: "400", variable: "--font-pacifico" });

export const metadata: Metadata = {
  title: "Thingz",
  description: "Thingz FO",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={pacifico.variable}>
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
