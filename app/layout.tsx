import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./serif.css";

const sans = Geist({ variable: "--sans", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Exsuvera Concept Lab",
    template: "%s · Exsuvera",
  },
  description:
    "Exsuvera Concept Lab — Thyself, Blueprint Chat, Blind Spot Scan, and LAB Academy.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body className={`${sans.variable} ${mono.variable}`}>{children}</body></html>;
}
