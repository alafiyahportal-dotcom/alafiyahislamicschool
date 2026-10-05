import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Formulir Pendaftaran Murid Baru (SPMB 2027/2028) | SD IT Al-Afiyah Majalengka',
  description:
    'Formulir Pendaftaran Online Sistem Penerimaan Murid Baru (SPMB) T.A. 2027/2028 SD IT Al-Afiyah Majalengka.',
};

export default function PPDBDaftarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
