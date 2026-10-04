import React from 'react';
import { Metadata } from 'next';
import SiakadMobileShell from '@/components/siakad/SiakadMobileShell';

export const metadata: Metadata = {
  title: 'SIAKAD Mobile iOS | Portal Akademik & Murid Al-Afiyah',
  description: 'Portal Sistem Informasi Akademik (SIAKAD) Mobile Al-Afiyah Majalengka. Pantau kehadiran presensi gerbang, mutaba\'ah tahfidz Al-Qur\'an, rapor digital, dan SPP murid secara real-time.',
};

export default function SiakadMobilePage() {
  return <SiakadMobileShell />;
}
