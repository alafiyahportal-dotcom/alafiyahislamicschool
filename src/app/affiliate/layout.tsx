import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Affiliate Al-Afiyah | Program Kemitraan Dakwah & Kebaikan',
  description:
    'Program kemitraan resmi Yayasan Pendidikan Al-Afiyah (TK IT, SD IT, SMP IT). Dapatkan komisi berkah berbasis akad syariah Wakalah bil Ujrah.',
};

export default function AffiliateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
