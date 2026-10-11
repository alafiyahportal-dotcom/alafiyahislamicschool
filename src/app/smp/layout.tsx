import type { Metadata, Viewport } from 'next';
import SmpThemeColorSync from '@/components/shared/SmpThemeColorSync';
import { SMP_OG_IMAGE } from '@/lib/og-images';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#030164' },
    { media: '(prefers-color-scheme: dark)', color: '#010038' },
  ],
};

export const metadata: Metadata = {
  title: {
    template: '%s | SMP IT Al-Afiyah Majalengka',
    default: 'SMP IT Al-Afiyah Majalengka | Be Smart & Religious • Terakreditasi A',
  },
  description: 'Sekolah Menengah Pertama Islam Terpadu (SMP IT) Al-Afiyah Majalengka. Terakreditasi A Resmi BAN-S/M, target tahfidz 3-5+ juz mutqin, Bahasa Arab aktif, SCD (Student Character Development), Mutaba\'ah Digital, dan Futsal Development Program.',
  manifest: '/smp-manifest.json',
  appleWebApp: {
    capable: true,
    title: 'SMP IT Al-Afiyah',
    statusBarStyle: 'black-translucent',
  },
  icons: {
    icon: [
      { url: '/images/smp-icon-192.png', type: 'image/png' },
      { url: '/smp-favicon.ico', sizes: 'any' },
    ],
    shortcut: '/images/smp-icon-192.png',
    apple: '/images/smp-icon-192.png',
  },
  openGraph: {
    title: 'SMP IT Al-Afiyah Majalengka | Be Smart & Religious',
    description: 'Sekolah Menengah Pertama Islam Terpadu Terakreditasi A BAN-S/M di Majalengka. SPMB T.A. 2027/2028 dibuka dengan diskon uang bangunan hingga 70%.',
    siteName: 'SMP IT Al-Afiyah',
    locale: 'id_ID',
    type: 'website',
    images: [SMP_OG_IMAGE],
  },
  // Override root (SDIT) twitter card — WhatsApp falls back to twitter:image when og:image is unusable
  twitter: {
    card: 'summary_large_image',
    title: 'SMP IT Al-Afiyah Majalengka | Be Smart & Religious',
    description: 'SPMB SMP IT Al-Afiyah T.A. 2027/2028 dibuka. Terakreditasi A, tahfidz 3-5+ juz, diskon uang bangunan s.d. 70%.',
    images: [SMP_OG_IMAGE.url],
  },
};

const smpWebSiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://smpit.alafiyah.id/#website',
  url: 'https://smpit.alafiyah.id/',
  name: 'SMP IT Al-Afiyah',
  alternateName: [
    'SMP IT Al-Afiyah Majalengka',
    'SMPIT Al-Afiyah',
    'SMP IT Al Afiyah',
    'SMPIT Al-Afiyah Majalengka'
  ],
  description: 'Sekolah Menengah Pertama Islam Terpadu (SMP IT) Al-Afiyah Majalengka Terakreditasi A BAN-S/M.',
  inLanguage: 'id-ID',
};

export default function SmpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <head>
        <link rel="icon" type="image/png" sizes="192x192" href="/images/smp-icon-192.png" />
        <link rel="icon" type="image/x-icon" href="/smp-favicon.ico" />
        <link rel="apple-touch-icon" href="/images/smp-icon-192.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(smpWebSiteSchema) }}
        />
      </head>
      <SmpThemeColorSync />
      {children}
    </>
  );
}
