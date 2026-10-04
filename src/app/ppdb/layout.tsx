import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portal Penerimaan Murid Baru (PPDB 2026/2027) | Sekolah IT Al-Afiyah Majalengka',
  description:
    'Informasi Jalur Masuk, Syarat Pendaftaran, Biaya Pendidikan & Formulir Online PPDB TK IT, SD IT, dan SMP IT Al-Afiyah Majalengka.',
};

export default function PPDBLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
