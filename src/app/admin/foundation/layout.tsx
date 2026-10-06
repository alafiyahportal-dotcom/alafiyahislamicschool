import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Super Admin Yayasan Pendidikan Imam Bonjol',
    default: 'Super Admin | Yayasan Pendidikan Imam Bonjol Majalengka',
  },
  description: 'Pusat Manajemen Ekosistem Pendidikan Yayasan Pendidikan Imam Bonjol Majalengka',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function FoundationAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
