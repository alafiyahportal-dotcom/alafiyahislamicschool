import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Super Admin Yayasan Pendidikan Imam Bonjol',
    default: 'Super Admin | Yayasan Pendidikan Imam Bonjol Majalengka',
  },
  description: 'Pusat Manajemen Ekosistem Pendidikan Yayasan Pendidikan Imam Bonjol Majalengka',
  icons: {
    icon: [
      { url: '/images/sd-logo.png', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/images/sd-logo.png',
    apple: '/images/sd-logo.png',
  },
};

export default function FoundationAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
