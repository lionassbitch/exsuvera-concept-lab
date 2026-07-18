import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./serif.css";

const sans = Geist({ variable: "--sans", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Concept Lab — Thyself + Blueprint Chat",
  description: "Proof-of-concept websites and strategic SWOT reports for Thyself and Blueprint Chat.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body className={`${sans.variable} ${mono.variable}`}>{children}</body></html>;
}
