import PPDBRegistrationPage from '@/app/ppdb/daftar/page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Formulir Pendaftaran SPMB Online SD IT Al-Afiyah Majalengka',
  description: 'Formulir resmi pendaftaran calon murid baru SD IT Al-Afiyah Tahun Ajaran 2027/2028. Pengisian biodata santri dan orang tua secara digital.',
};

export default function SdRegistrationPage() {
  return <PPDBRegistrationPage />;
}
