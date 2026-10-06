import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | SD IT Al-Afiyah Majalengka',
    default: 'SD IT Al-Afiyah Majalengka | Sekolah Dasar Islam Terpadu Unggulan',
  },
  description: 'PPDB SD IT Al-Afiyah Majalengka. Kurikulum terpadu nasional, hafalan tahfidz juz 30 mutqin, pembentukan karakter islami, dan sains modern.',
  icons: {
    icon: [
      { url: '/images/sd-logo.png', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/images/sd-logo.png',
    apple: '/images/sd-logo.png',
  },
};

export default function SdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
