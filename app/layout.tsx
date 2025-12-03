import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Display font - headings and important text
const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

// Body font - readable text
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

// Mono font - code and data
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "QuickClaims.ai | Insurance Claim Management for Contractors",
  description: "AI-powered insurance claim supplement platform for construction contractors. Upload carrier scopes, detect missing items, generate IRC-backed defense notes, and build professional supplement packages.",
  keywords: ["insurance claims", "contractors", "roofing", "supplements", "Xactimate", "IRC codes"],
  authors: [{ name: "GalaxyCo.ai" }],
  openGraph: {
    title: "QuickClaims.ai",
    description: "AI-powered insurance claim management for construction contractors",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="antialiased min-h-screen bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
