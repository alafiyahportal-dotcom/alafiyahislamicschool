import React from 'react';
import { Metadata } from 'next';
import SiakadMobileShell from '@/components/siakad/SiakadMobileShell';

export const metadata: Metadata = {
  title: 'SIAKAD Mobile Murid | SD IT Al-Afiyah Majalengka',
  description: 'Portal Sistem Informasi Akademik (SIAKAD) Mobile SD IT Al-Afiyah Majalengka. Pantau presensi QR, capaian mutabaah tahfidz juz 30 mutqin, rapor digital, dan SPP murid secara real-time.',
  icons: {
    icon: [
      { url: '/images/sd-logo.png', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/images/sd-logo.png',
    apple: '/images/sd-logo.png',
  },
};

export default function SdSiakadPage() {
  return <SiakadMobileShell initialSchoolSlug="sd" />;
}
