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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#059669" },
    { media: "(prefers-color-scheme: dark)", color: "#064E3B" },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "Al-Afiyah | Yayasan Pendidikan Imam Bonjol Majalengka",
    template: "%s | Al-Afiyah",
  },
  description: "Portal Terpadu Multi-Tenant TK IT, SD IT, & SMP IT Al-Afiyah Majalengka. Pendaftaran Peserta Didik Baru (PPDB), kurikulum tahfidz Qur'an, dan informasi resmi.",
  icons: {
    icon: '/favicon.ico',
  },
  // PWA manifest
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

