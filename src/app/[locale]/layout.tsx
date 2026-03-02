import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Clinical ToolBox | CRA & CRC Productivity Suite",
  description: "Essential calculation, schedule, and conversion tools for Clinical Research Associates (CRA) and Coordinators (CRC). Minimized input, clear results - available in PDF/Excel.",
  keywords: ["CRA", "CRC", "Clinical Trial", "Compliance Calculator", "Visit Schedule", "CRF", "CRO"],
  authors: [{ name: "Clinical ToolBox Team" }],
  openGraph: {
    title: "Clinical ToolBox",
    description: "One stop shop for Clinical Research productivity tools.",
    type: "website",
    locale: "ko_KR",
  }
};

export default async function RootLayout(
  props: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
  }
) {
  const params = await props.params;

  const {
    locale
  } = params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              {props.children}
            </main>
            <Footer />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
