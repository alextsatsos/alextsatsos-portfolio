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

export const metadata: Metadata = {
  title: "Alex Tsatsos — Senior UX & Product Designer",
  description: "Portfolio of Alex Tsatsos",
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
