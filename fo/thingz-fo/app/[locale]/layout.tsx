import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getMessages } from "next-intl/server";
import { LanguageProvider } from "@/lib/i18n/context";
import type { Locale } from "@/lib/i18n/translations";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <LanguageProvider key={locale} initialLocale={locale as Locale}>
        {children}
      </LanguageProvider>
    </NextIntlClientProvider>
  );
}
