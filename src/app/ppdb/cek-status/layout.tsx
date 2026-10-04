import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cek Status Pendaftaran & Hasil Seleksi | PPDB Sekolah IT Al-Afiyah',
  description:
    'Lacak status pendaftaran formulir dan pembayaran PPDB murid baru Sekolah IT Al-Afiyah Majalengka secara real-time.',
};

export default function PPDBCekStatusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
