import type { Metadata } from 'next';
import { SD_OG_IMAGE } from '@/lib/og-images';
import LaunchSplash from '@/components/shared/LaunchSplash';

export const metadata: Metadata = {
  title: {
    template: '%s | SDIT Al-Afiyah YPIB',
    default: 'SDIT Al-Afiyah Majalengka | YPIB',
  },
  description: 'Website Resmi SDIT Al-Afiyah Majalengka di bawah naungan Yayasan Pendidikan Imam Bonjol (YPIB). Terakreditasi B resmi, kurikulum karakter nabawiyah Smart Akhlak Fitrah, dan bimbingan Tahfidz Juz 30 Mutqin.',
  manifest: '/sd-manifest.json',
  appleWebApp: {
    capable: true,
    title: 'SDIT Al-Afiyah',
    statusBarStyle: 'default',
  },
  icons: {
    icon: [
      { url: '/images/sd-logo.png', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/images/sd-logo.png',
    apple: '/images/sd-apple-icon.png',
  },
  openGraph: {
    title: 'SDIT Al-Afiyah Majalengka | YPIB',
    description: 'Sekolah Dasar Islam Terpadu Al-Afiyah di Lingkungan Giri Asih Majalengka naungan Yayasan Pendidikan Imam Bonjol.',
    siteName: 'SDIT Al-Afiyah',
    locale: 'id_ID',
    type: 'website',
    images: [SD_OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SDIT Al-Afiyah Majalengka | SPMB TA 2027/2028',
    description: 'Sekolah Dasar Islam Terpadu Terakreditasi B resmi di Lingkungan Giri Asih Majalengka.',
    images: [SD_OG_IMAGE.url],
  },
};

const sdWebSiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://sdit.alafiyah.id/#website',
  url: 'https://sdit.alafiyah.id/',
  name: 'SDIT Al-Afiyah',
  alternateName: [
    'SDIT Al-Afiyah Majalengka',
    'SD IT Al-Afiyah',
    'SDIT Al Afiyah',
    'SD IT Al-Afiyah Majalengka'
  ],
  description: 'Portal Resmi Sistem Penerimaan Murid Baru (SPMB) dan Informasi Terpadu SDIT Al-Afiyah Majalengka.',
  inLanguage: 'id-ID',
};

export default function SdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <head>
        <link rel="icon" type="image/png" sizes="192x192" href="/images/sd-logo.png" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/images/sd-apple-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(sdWebSiteSchema) }}
        />
      </head>
      <LaunchSplash background="#00A651" logoSrc="/icons/sd-512.png" logoAlt="SDIT Al-Afiyah" />
      {children}
    </>
  );
}
