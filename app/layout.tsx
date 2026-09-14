import type { Metadata } from "next";
import { Pixelify_Sans, Press_Start_2P, VT323 } from "next/font/google";
import "./globals.css";

const vt = VT323({
  variable: "--font-vt",
  subsets: ["latin"],
  weight: "400",
});

const pixelify = Pixelify_Sans({
  variable: "--font-pixelify",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const press = Press_Start_2P({
  variable: "--font-press",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "NoScroll — Stop scrolling. Start watching.",
  description:
    "Tell us your vibe. We'll pick 5 things worth watching so you can stop browsing Netflix for 20 minutes.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${vt.variable} ${pixelify.variable} ${press.variable} h-full`}
    >
      <body className="min-h-full bg-paper text-ink">{children}</body>
    </html>
  );
}
