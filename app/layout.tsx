import type { Metadata } from "next";
import {
  Bricolage_Grotesque,
  Hanken_Grotesk,
  Architects_Daughter,
} from "next/font/google";
import "../styles/globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

// Downloaded at build time and served locally.
// The actual family names are defined in styles/fonts.css via @font-face,
// which is what tokens.css --font-* variables reference.
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--nf-bricolage",
  display: "swap",
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--nf-hanken",
  display: "swap",
});

const architects = Architects_Daughter({
  subsets: ["latin"],
  weight: "400",
  variable: "--nf-architects",
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
    <html
      lang="en"
      className={`${bricolage.variable} ${hanken.variable} ${architects.variable}`}
    >
      <body>
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
