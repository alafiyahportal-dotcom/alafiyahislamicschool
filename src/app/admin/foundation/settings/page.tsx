import React from 'react';
import { prisma } from '@/lib/prisma';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import FoundationSettingsClient, {
  SchoolSettingItem,
} from '@/components/admin/FoundationSettingsClient';

export const dynamic = 'force-dynamic';

export default async function FoundationSettingsPage() {
  const schools = await prisma.school.findMany({
    include: {
      ppdbRegistrations: {
        select: {
          id: true,
          status: true,
        },
      },
    },
    orderBy: { unitLevel: 'asc' },
  });

  const formattedSchools: SchoolSettingItem[] = schools.map((school) => {
    const totalRegistrations = school.ppdbRegistrations.length;
    const verifiedCount = school.ppdbRegistrations.filter((r) =>
      ['VERIFIED', 'ACCEPTED'].includes(r.status)
    ).length;
    const acceptedCount = school.ppdbRegistrations.filter(
      (r) => r.status === 'ACCEPTED'
    ).length;
    const quota = school.quota || 60;
    const occupancyRate = Math.min(100, Math.round((totalRegistrations / quota) * 100));
    const remainingQuota = Math.max(0, quota - totalRegistrations);

    return {
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
  });

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans antialiased text-slate-800">
      <AdminSidebar
        schoolSlug="foundation"
        schoolName="Yayasan Pendidikan Imam Bonjol"
        userName="Superadministrator"
        currentRole="SUPERADMIN"
      />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="Pengaturan Sistem & Profil Yayasan"
          subtitle="Konfigurasi Rekening Bank, Kuota Penerimaan Unit & Parameter Seleksi Murid"
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full">
          <FoundationSettingsClient initialSchools={formattedSchools} />
        </main>
      </div>
    </div>
  );
}
