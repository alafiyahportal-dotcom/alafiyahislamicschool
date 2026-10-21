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
import ReferralTracker from "@/components/shared/ReferralTracker";
import DynamicUnitThemeColorSync from "@/components/shared/DynamicUnitThemeColorSync";
import WebsiteVisitorTracker from "@/components/shared/WebsiteVisitorTracker";
import AutoCacheBuster from "@/components/shared/AutoCacheBuster";
import GoogleStructuredData from "@/components/seo/GoogleStructuredData";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#064E3B" },
    { media: "(prefers-color-scheme: dark)", color: "#064E3B" },
  ],
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.alafiyah.id';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Ekosistem Pendidikan Al-Afiyah Majalengka | YPIB",
    template: "%s | Al-Afiyah Majalengka",
  },
  description: "Portal Resmi SPMB SDIT Al-Afiyah Majalengka. Sekolah Dasar Islam Terpadu berakreditasi B resmi, kurikulum karakter nabawiyah Smart Akhlak Fitrah, dan Tahfidz Juz 30 Mutqin di Lingkungan Giri Asih.",
  keywords: [
    "SDIT Al Afiyah",
    "SDIT Al-Afiyah Majalengka",
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
  authors: [{ name: "SDIT Al-Afiyah Majalengka" }],
  creator: "Yayasan Pendidikan Imam Bonjol Majalengka",
  publisher: "Al-Afiyah Islamic School",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "SDIT Al-Afiyah Majalengka - Sekolah Dasar Islam Terpadu",
    description: "Pendaftaran Murid Baru (SPMB) SDIT Al-Afiyah Majalengka. Kuota terbatas 2 rombel, kurikulum karakter nabawiyah, dan tahfidz mutqin di Lingkungan Giri Asih.",
    url: siteUrl,
    siteName: "Al-Afiyah Islamic School",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/images/sd-hero-greenhouse.jpg",
        width: 1200,
        height: 630,
        alt: "SDIT Al-Afiyah Majalengka Lingkungan Giri Asih",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SDIT Al-Afiyah Majalengka | SPMB TA 2027/2028",
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
  verification: {
    google: 'fc7b11c6b1e81534',
  },
  icons: {
    icon: [
      { url: '/images/ypib-logo.png?v=3', type: 'image/png', sizes: '32x32' },
      { url: '/images/ypib-logo.png?v=3', type: 'image/png', sizes: '192x192' },
      { url: '/images/ypib-logo.png?v=3', type: 'image/png' },
    ],
    shortcut: '/images/ypib-logo.png?v=3',
    apple: '/images/ypib-logo.png?v=3',
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
        <link rel="icon" type="image/png" sizes="32x32" href="/images/ypib-logo.png?v=3" />
        <link rel="icon" type="image/png" sizes="192x192" href="/images/ypib-logo.png?v=3" />
        <link rel="shortcut icon" href="/images/ypib-logo.png?v=3" />
        <link rel="apple-touch-icon" href="/images/ypib-logo.png?v=3" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  if (typeof window === 'undefined') return;
                  if ('serviceWorker' in navigator) {
                    navigator.serviceWorker.getRegistrations().then(function(regs) {
                      for (var r of regs) { r.unregister(); }
                    });
                  }
                  var V = '20261020_1225';
                  var s = localStorage.getItem('alafiyah_deploy_ver');
                  if (s !== V) {
                    if ('caches' in window) {
                      caches.keys().then(function(keys) {
                        for (var k of keys) { caches.delete(k); }
                      });
                    }
                    sessionStorage.clear();
                    localStorage.setItem('alafiyah_deploy_ver', V);
                    if (s) {
                      var u = new URL(window.location.href);
                      u.searchParams.set('_v', V);
                      window.location.replace(u.toString());
                    }
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
        <GoogleStructuredData />
      </head>
      <body className="min-h-full flex flex-col w-full max-w-full">
        <Suspense fallback={null}>
          <AutoCacheBuster />
          <ReferralTracker />
          <DynamicUnitThemeColorSync />
          <WebsiteVisitorTracker />
        </Suspense>
        {children}
      </body>
    </html>
  );
}

