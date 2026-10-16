import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./serif.css";

const sans = Geist({ variable: "--sans", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Exsuvera Concept Lab — Lion Ass Bitch",
  description:
    "Origins Bible, LAB Academy, Blind Spot Scan, Thyself, and Blueprint Chat — the Exsuvera / Lion Ass Bitch house.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body className={`${sans.variable} ${mono.variable}`}>{children}</body></html>;
}
