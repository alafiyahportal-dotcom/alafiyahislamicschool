import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Program Afiliasi | Kemitraan Dakwah & Syariah Al-Afiyah',
  description:
    'Program Afiliasi Al-Afiyah terbuka untuk siapa saja — wali murid, asatidzah, alumni, dan masyarakat umum. Dapatkan komisi berkah berbasis akad syariah Wakalah bil Ujrah.',
  alternates: {
    canonical: '/affiliate',
  },
  openGraph: {
    title: 'Program Afiliasi Al-Afiyah Majalengka',
    description: 'Raih komisi syariah berkah dengan menjadi mitra affiliator SPMB SD IT Al-Afiyah.',
    url: '/affiliate',
    siteName: 'Al-Afiyah Islamic School',
    locale: 'id_ID',
    type: 'website',
  },
};

export default function AffiliateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
