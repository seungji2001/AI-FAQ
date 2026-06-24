import type { Metadata } from "next";
import ThemeRegistry from "./ThemeRegistry";
import { ToastProvider } from "@/app/components/ui/Toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "Thingz",
  description: "Thingz FO",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <ThemeRegistry>
          <ToastProvider>
            {children}
          </ToastProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
