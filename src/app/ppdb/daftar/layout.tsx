import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Formulir Pendaftaran Murid Baru (PPDB 2026/2027) | SD IT & SMP IT Al-Afiyah',
  description:
    'Formulir Pendaftaran Online Penerimaan Peserta Didik Baru (PPDB) T.A. 2026/2027 Sekolah IT Al-Afiyah Majalengka.',
};

export default function PPDBDaftarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
