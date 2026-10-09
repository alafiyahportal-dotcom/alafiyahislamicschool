import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | SMP IT Al-Afiyah Majalengka',
    default: 'SMP IT Al-Afiyah Majalengka | Be Smart & Religious • Terakreditasi A',
  },
  description: 'Sekolah Menengah Pertama Islam Terpadu (SMP IT) Al-Afiyah Majalengka. Terakreditasi A Resmi BAN-S/M, target tahfidz 3-5+ juz mutqin, Bahasa Arab aktif, SCD (Student Character Development), Mutaba\'ah Digital, dan Futsal Development Program.',
  icons: {
    icon: [
      { url: '/images/smp-logo.png', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/images/smp-logo.png',
    apple: '/images/smp-logo.png',
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
  return <>{children}</>;
}
