import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | SDIT Al-Afiyah YPIB',
    default: 'SDIT Al-Afiyah Majalengka | YPIB',
  },
  description: 'Website Resmi SDIT Al-Afiyah Majalengka di bawah naungan Yayasan Pendidikan Imam Bonjol (YPIB). Terakreditasi B resmi, kurikulum karakter nabawiyah Smart Akhlak Fitrah, dan bimbingan Tahfidz Juz 30 Mutqin.',
  icons: {
    icon: [
      { url: '/images/sd-logo.png', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/images/sd-logo.png',
    apple: '/images/sd-logo.png',
  },
  openGraph: {
    title: 'SDIT Al-Afiyah Majalengka | YPIB',
    description: 'Sekolah Dasar Islam Terpadu Al-Afiyah di Lingkungan Giri Asih Majalengka naungan Yayasan Pendidikan Imam Bonjol.',
    siteName: 'SDIT Al-Afiyah Majalengka - YPIB',
    locale: 'id_ID',
    type: 'website',
  },
};

export default function SdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
