import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";
import "./motion.css";
import "./studio.css";
import "./legal.css";
import { PrivacyControls } from "@/components/PrivacyControls";
const rubik = Rubik({
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-rubik",
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
    images: [{ url: "/brand/logo-primary.png", width: 438, height: 418, alt: "אוראל לוי, יוצר תוכן AI" }],
  },
  robots: { index: site.ready, follow: site.ready },
  icons: { icon: "/brand/icon.png", apple: "/brand/icon.png" },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl" className={rubik.variable}>
      <body>{children}<PrivacyControls /></body>
    </html>
  );
}
