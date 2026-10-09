import React from 'react';
import { Metadata } from 'next';
import SiakadMobileShell from '@/components/siakad/SiakadMobileShell';

export const metadata: Metadata = {
  title: 'SIAKAD & Mutaba\'ah Santri | SMP IT Al-Afiyah Majalengka',
  description: 'Portal Sistem Informasi Akademik (SIAKAD) & Mutaba\'ah Digital SMP IT Al-Afiyah Majalengka. Pantau presensi santri, capaian tahfidz 3-5+ juz mutqin, evaluasi karakter SCD, dan status administrasi.',
  icons: {
    icon: [
      { url: '/images/smp-logo.png', type: 'image/png' },
      { url: '/smp-favicon.ico', sizes: 'any' },
    ],
    shortcut: '/images/smp-logo.png',
    apple: '/images/smp-logo.png',
  },
  openGraph: {
    title: 'SIAKAD & Mutaba\'ah Santri SMP IT Al-Afiyah',
    description: 'Portal presensi QR, grafik ibadah harian, dan capaian tahfidz santri.',
    images: ['/images/smp-spmb-poster.png'],
  },
};

export default function SmpSiakadPage() {
  return <SiakadMobileShell initialSchoolSlug="smp" />;
}
