import React from 'react';
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import UnitSettingsClient, { UnitSettingItem } from '@/components/admin/UnitSettingsClient';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ schoolSlug: string }>;
}): Promise<Metadata> {
  const { schoolSlug } = await params;
  return {
    title: `Pengaturan Unit | ${schoolSlug.toUpperCase()} IT Al-Afiyah`,
    description: 'Konfigurasi mandiri gelombang penerimaan, kuota murid, rekening kas unit, dan nomor layanan helpdesk.',
  };
}

export default async function SchoolSettingsPage({
  params,
}: {
  params: Promise<{ schoolSlug: string }>;
}) {
  const resolvedParams = await params;
  const { schoolSlug } = resolvedParams;

  if (schoolSlug !== 'tk' && schoolSlug !== 'sd' && schoolSlug !== 'smp') {
    notFound();
  }

  const school = await prisma.school.findUnique({
    where: { slug: schoolSlug },
    include: {
      ppdbRegistrations: {
        select: {
          id: true,
          status: true,
        },
      },
    },
  });

  if (!school) {
    notFound();
  }

  const totalRegistrations = school.ppdbRegistrations.length;
  const verifiedCount = school.ppdbRegistrations.filter((r) =>
    ['VERIFIED', 'ACCEPTED'].includes(r.status)
  ).length;
  const acceptedCount = school.ppdbRegistrations.filter((r) => r.status === 'ACCEPTED').length;
  const quota = school.quota || 60;
  const occupancyRate = Math.min(100, Math.round((totalRegistrations / quota) * 100));
  const remainingQuota = Math.max(0, quota - totalRegistrations);

  const formattedSchool: UnitSettingItem = {
    id: school.id,
    slug: school.slug,
    name: school.name,
    unitLevel: school.unitLevel,
    badgeText: school.badgeText,
    tagline: school.tagline,
    primaryColor: school.primaryColor,
    accentColor: school.accentColor,
    registrationFee: school.registrationFee,
    quota,
    waveName: school.waveName,
    isPpdbOpen: school.isPpdbOpen,
    bankName: school.bankName,
    bankAccountNumber: school.bankAccountNumber,
    bankAccountHolder: school.bankAccountHolder,
    waCenterPhone: school.waCenterPhone,
    address: school.address,
    stats: {
      totalRegistrations,
      verifiedCount,
      acceptedCount,
      occupancyRate,
      remainingQuota,
    },
  };

  const roleName = `ADMIN_${schoolSlug.toUpperCase()}`;

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans antialiased text-slate-800">
      <AdminSidebar
        schoolSlug={schoolSlug as 'tk' | 'sd' | 'smp'}
        schoolName={school.name}
        userName={`Admin ${schoolSlug.toUpperCase()}`}
        currentRole={roleName}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title={`Pengaturan Unit - ${school.name}`}
          subtitle="Konfigurasi Mandiri Gelombang Pendaftaran, Kuota Kursi, Rekening Unit & Helpdesk"
          currentSchoolSlug={schoolSlug as 'tk' | 'sd' | 'smp'}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full">
          <UnitSettingsClient initialSchool={formattedSchool} />
        </main>
      </div>
    </div>
  );
}
