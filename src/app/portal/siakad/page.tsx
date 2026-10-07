import React from 'react';
import { Metadata } from 'next';
import SiakadMobileShell from '@/components/siakad/SiakadMobileShell';

export const metadata: Metadata = {
  title: 'SIAKAD Mobile iOS | Portal Akademik & Murid Al-Afiyah',
  description: 'Portal Sistem Informasi Akademik (SIAKAD) Mobile Al-Afiyah Majalengka. Pantau kehadiran presensi gerbang, mutaba\'ah tahfidz Al-Qur\'an, rapor digital, dan SPP murid secara real-time.',
};

export default async function SiakadMobilePage({
  searchParams,
}: {
  searchParams: Promise<{ school?: string; unit?: string }>;
}) {
  const params = await searchParams;
  const schoolSlug = (params.school || params.unit || 'sd').toLowerCase();
  return <SiakadMobileShell initialSchoolSlug={schoolSlug} />;
}
