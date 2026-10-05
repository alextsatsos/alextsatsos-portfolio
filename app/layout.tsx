import type { Metadata } from "next";
import { Fira_Code, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "../styles/globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

// Downloaded at build time and served locally.
// The actual family names are defined in styles/fonts.css via @font-face,
// which is what tokens.css --font-* variables reference.
const firaCode = Fira_Code({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--nf-fira-code",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--nf-inter",
  display: "swap",
});

const SITE_URL = "https://alextsatsos.com";
const DESCRIPTION =
  "UX designer with 8+ years in fintech and enterprise retail. I design the complex workflows that power high-stakes software — not the polished consumer flows everyone else designs.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "Alex Tsatsos — Senior UX & Product Designer | Enterprise & Fintech UX",
    template: "%s — Alex Tsatsos",
  },
  description: DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Alex Tsatsos",
    title:
      "Alex Tsatsos — Senior UX & Product Designer | Enterprise & Fintech UX",
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Alex Tsatsos — Senior UX & Product Designer | Enterprise & Fintech UX",
    description: DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${firaCode.variable} ${inter.variable}`}>
      <body>
        <Nav />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
