import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SoundEffectsProvider } from "@/audio/sound-effects-provider";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : undefined,
  title: "Dingle Varshney | Software Developer Portfolio",
  description:
    "I'm Dingle Varshney, an MCA student and aspiring software developer building useful web applications and exploring AI, machine learning, and problem solving.",
  alternates: process.env.NEXT_PUBLIC_SITE_URL ? { canonical: "/" } : undefined,
  openGraph: {
    type: "website",
    title: "Dingle Varshney | Software Developer Portfolio",
    description: "Explore My software projects, skills, and interactive 3D portfolio.",
    siteName: "Dingle Varshney",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Dingle Varshney — Software Developer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dingle Varshney | Software Developer Portfolio",
    description:
      "Explore Dingle Varshney’s software projects, skills, and interactive 3D portfolio.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <SoundEffectsProvider>{children}</SoundEffectsProvider>
      </body>
    </html>
  );
}
