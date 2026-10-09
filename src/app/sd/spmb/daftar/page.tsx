import PPDBRegistrationPage from '@/app/ppdb/daftar/page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Formulir Pendaftaran SPMB Online SDIT Al-Afiyah Majalengka',
  description: 'Formulir resmi pendaftaran calon murid baru SDIT Al-Afiyah Tahun Ajaran 2027/2028. Pengisian biodata calon murid dan orang tua secara digital.',
  icons: {
    icon: [
      { url: '/images/sd-logo.png', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/images/sd-logo.png',
    apple: '/images/sd-logo.png',
  },
};

export default function SdRegistrationPage() {
  return <PPDBRegistrationPage />;
}
