import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Lagos Weekender - Your Guide to Lagos Lifestyle",
  description: "Discover the best events, nightlife, dining, and entertainment in Lagos. Your ultimate guide to weekend plans and lifestyle experiences in Lagos, Nigeria.",
  keywords: "Lagos events, Lagos nightlife, Lagos entertainment, Lagos dining, Lagos lifestyle, weekend plans Lagos",
  authors: [{ name: "The Lagos Weekender" }],
  openGraph: {
    title: "The Lagos Weekender - Your Guide to Lagos Lifestyle",
    description: "Discover the best events, nightlife, dining, and entertainment in Lagos.",
    url: "https://thelagosweekender.com",
    siteName: "The Lagos Weekender",
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Lagos Weekender - Your Guide to Lagos Lifestyle",
    description: "Discover the best events, nightlife, dining, and entertainment in Lagos.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preload critical images for LCP optimization */}
        <link
          rel="preload"
          as="image"
          href="http://localhost:3845/assets/0c18dc1e3edf0be8d6e78c6c601cfcb169710e54.png"
          type="image/png"
        />
        <link
          rel="preload"
          as="image"
          href="/images/homepage/hero-placeholder-1.svg"
          type="image/svg+xml"
        />
        <link
          rel="preload"
          as="image"
          href="/images/events/hero-placeholder-2.svg"
          type="image/svg+xml"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {/* Skip to main content link for accessibility */}
          <a 
            href="#main-content" 
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:border focus:border-gray-300 focus:rounded"
          >
            Skip to main content
          </a>
          <Header />
          <main className="min-h-screen" role="main" id="main-content">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
