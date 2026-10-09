import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | SD IT Al-Afiyah YPIB',
    default: 'SD IT Al-Afiyah Majalengka | YPIB',
  },
  description: 'Website Resmi SD IT Al-Afiyah Majalengka di bawah naungan Yayasan Pendidikan Imam Bonjol (YPIB). Terakreditasi B resmi, kurikulum karakter nabawiyah Smart Akhlak Fitrah, dan bimbingan Tahfidz Juz 30 Mutqin.',
  icons: {
    icon: [
      { url: '/images/sd-logo.png', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/images/sd-logo.png',
    apple: '/images/sd-logo.png',
  },
  openGraph: {
    title: 'SD IT Al-Afiyah Majalengka | YPIB',
    description: 'Sekolah Dasar Islam Terpadu Al-Afiyah di Lingkungan Giri Asih Majalengka naungan Yayasan Pendidikan Imam Bonjol.',
    siteName: 'SD IT Al-Afiyah Majalengka - YPIB',
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
