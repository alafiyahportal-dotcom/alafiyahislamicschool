import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Formulir Pendaftaran Murid Baru (SPMB 2027/2028) | SDIT Al-Afiyah Majalengka',
  description:
    'Formulir Pendaftaran Online Sistem Penerimaan Murid Baru (SPMB) T.A. 2027/2028 SDIT Al-Afiyah Majalengka.',
  icons: {
    icon: [
      { url: '/images/sd-logo.png', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/images/sd-logo.png',
    apple: '/images/sd-logo.png',
  },
};

export default function PPDBDaftarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
