import React from 'react';
import type { Metadata } from 'next';
import PPDBRegistrationPage from '@/app/ppdb/daftar/page';

export const metadata: Metadata = {
  title: 'Formulir Lengkap 28 Butir SPMB Online SDIT Al-Afiyah Majalengka',
  description: 'Formulir resmi 28 butir pendaftaran calon murid baru SDIT Al-Afiyah Tahun Ajaran 2027/2028. Dilengkapi opsi fleksibel untuk menyusulkan data rinci & berkas nanti.',
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
