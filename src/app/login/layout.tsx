import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Masuk ke Akun | Portal SPMB & Siakad Al-Afiyah',
  description: 'Masuk ke Akun. Selamat datang kembali di Portal Resmi SPMB & Sistem Informasi SDIT Al-Afiyah Majalengka. Cek status formulir pendaftaran, pengumuman hasil observasi, dan administrasi murid.',
  alternates: {
    canonical: '/login',
  },
  openGraph: {
    title: 'Masuk ke Akun - Portal Resmi Al-Afiyah',
    description: 'Masuk ke Akun SPMB SDIT Al-Afiyah Majalengka. Akses layanan pendaftaran, verifikasi berkas, dan informasi kelulusan murid baru.',
    url: '/login',
    siteName: 'SDIT Al-Afiyah Majalengka',
    locale: 'id_ID',
    type: 'website',
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
