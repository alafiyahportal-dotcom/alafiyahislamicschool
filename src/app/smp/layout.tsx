import type { Metadata, Viewport } from 'next';
import SmpThemeColorSync from '@/components/shared/SmpThemeColorSync';

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
    siteName: 'SMP IT Al-Afiyah Majalengka',
    locale: 'id_ID',
    type: 'website',
    images: ['/images/smp-spmb-poster.png'],
  },
};

export default function SmpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SmpThemeColorSync />
      {children}
    </>
  );
}
