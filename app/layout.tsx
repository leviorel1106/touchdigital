import type { Metadata } from "next";
import localFont from "next/font/local";
import { site } from "@/lib/site";
import "./globals.css";
import "./motion.css";
import "./studio.css";
import "./legal.css";
import { PrivacyControls } from "@/components/PrivacyControls";
const assistant = localFont({
  src: [
    { path: "./fonts/assistant-400.ttf", weight: "400" },
    { path: "./fonts/assistant-500.ttf", weight: "500" },
    { path: "./fonts/assistant-600.ttf", weight: "600" },
    { path: "./fonts/assistant-700.ttf", weight: "700" },
    { path: "./fonts/assistant-800.ttf", weight: "800" },
  ],
  variable: "--font-assistant",
  display: "swap",
});
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined);
export const metadata: Metadata = {
  title: "אוראל לוי | יצירת תוכן AI לעסקים",
  description: site.description,
  ...(siteUrl
    ? { metadataBase: new URL(siteUrl), alternates: { canonical: "/" } }
    : {}),
  openGraph: {
    title: "אוראל לוי | העסק שלך. מעבר לדמיון.",
    description: site.description,
    locale: "he_IL",
    type: "website",
    siteName: "Orel Levi",
  },
  robots: { index: site.ready, follow: site.ready },
  icons: { icon: "/icon.svg" },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl" className={assistant.variable}>
      <body>{children}<PrivacyControls /></body>
    </html>
  );
}
