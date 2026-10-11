import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Affiliate Al-Afiyah | Program Rekomendasi Resmi TK IT, SDIT, SMP IT',
  description:
    'Program Affiliate Al-Afiyah terbuka untuk siapa saja — wali murid, asatidzah, alumni, dan masyarakat umum. Dapatkan komisi apresiasi resmi dan transparan cukup dengan berbagi link rekomendasi.',
  alternates: {
    canonical: '/affiliate',
  },
  openGraph: {
    title: 'Program Affiliate Al-Afiyah Majalengka',
    description: 'Raih komisi apresiasi resmi dengan menjadi affiliate SPMB Al-Afiyah.',
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
