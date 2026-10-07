import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
  display: "swap",
});

import { Suspense } from "react";
import Script from "next/script";
import HelpdeskChatWidget from "@/components/shared/HelpdeskChatWidget";
import ReferralTracker from "@/components/shared/ReferralTracker";
import GoogleStructuredData from "@/components/seo/GoogleStructuredData";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#059669" },
    { media: "(prefers-color-scheme: dark)", color: "#064E3B" },
  ],
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://alafiyahislamicschool.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SD IT Al-Afiyah Majalengka | Yayasan Pendidikan Imam Bonjol",
    template: "%s | SD IT Al-Afiyah",
  },
  description: "Portal Resmi SPMB SD IT Al-Afiyah Majalengka. Sekolah Dasar Islam Terpadu berakreditasi B resmi, kurikulum karakter nabawiyah Smart Akhlaq Fitrah, dan Tahfidz Juz 30 Mutqin di Lingkungan Giri Asih.",
  keywords: [
    "SDIT Al Afiyah",
    "SD IT Al-Afiyah Majalengka",
    "PMB YPIB Majalengka",
    "SPMB SDIT Al-Afiyah",
    "Sekolah Dasar Islam Terpadu Majalengka",
    "Pendaftaran SD Majalengka",
    "SD Islam Terbaik Majalengka",
    "Tahfidz Quran Majalengka",
    "Yayasan Pendidikan Imam Bonjol",
    "PPDB Al Afiyah",
    "Program Afiliasi Al Afiyah"
  ],
  authors: [{ name: "SD IT Al-Afiyah Majalengka" }],
  creator: "Yayasan Pendidikan Imam Bonjol Majalengka",
  publisher: "Al-Afiyah Islamic School",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "SD IT Al-Afiyah Majalengka - Sekolah Dasar Islam Terpadu",
    description: "Pendaftaran Murid Baru (SPMB) SD IT Al-Afiyah Majalengka. Kuota terbatas 2 rombel, kurikulum karakter nabawiyah, dan tahfidz mutqin di Lingkungan Giri Asih.",
    url: siteUrl,
    siteName: "SD IT Al-Afiyah Majalengka",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/images/sd-hero-greenhouse.jpg",
        width: 1200,
        height: 630,
        alt: "SD IT Al-Afiyah Majalengka Lingkungan Giri Asih",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SD IT Al-Afiyah Majalengka | SPMB TA 2027/2028",
    description: "Sekolah Dasar Islam Terpadu Terakreditasi B resmi di Lingkungan Giri Asih Majalengka.",
    images: ["/images/sd-hero-greenhouse.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: '/images/sd-logo.png', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/images/sd-logo.png',
    apple: '/images/sd-logo.png',
  },
  manifest: "/manifest.json",
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${plusJakartaSans.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <GoogleStructuredData />
      </head>
      <body className="min-h-full flex flex-col w-full max-w-full">
        <Script
          id="sw-cleanup"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(function(regs) {
                  for (var reg of regs) { reg.unregister(); }
                });
              }
            `,
          }}
        />
        <Suspense fallback={null}>
          <ReferralTracker />
        </Suspense>
        {children}
        <HelpdeskChatWidget />
      </body>
    </html>
  );
}

