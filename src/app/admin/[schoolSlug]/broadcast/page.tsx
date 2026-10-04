import React from 'react';
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import BroadcastManagerClient from '@/components/admin/BroadcastManagerClient';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params
}: {
  params: Promise<{ schoolSlug: string }>;
}): Promise<Metadata> {
  const { schoolSlug } = await params;
  return {
    title: `WhatsApp Broadcast Center | ${schoolSlug.toUpperCase()} IT Al-Afiyah`,
    description: 'Pusat siaran notifikasi massal WhatsApp untuk calon wali murid dan mitra afiliasi.',
  };
}

export default async function SchoolBroadcastPage({
  params
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
  });

  if (!school) {
    notFound();
  }

  // Hitung jumlah per segmen khusus unit ini
  const [pendingCount, verifiedCount, acceptedCount, allApplicantsCount, affiliateCount] = await Promise.all([
    prisma.pPDBRegistration.count({ where: { schoolId: school.id, status: 'PAYMENT_PENDING' } }),
    prisma.pPDBRegistration.count({ where: { schoolId: school.id, status: 'VERIFIED' } }),
    prisma.pPDBRegistration.count({ where: { schoolId: school.id, status: 'ACCEPTED' } }),
    prisma.pPDBRegistration.count({ where: { schoolId: school.id } }),
    prisma.affiliateProfile.count(),
  ]);

  // Initial recipients default: ACCEPTED of this unit
  const initialMurid = await prisma.pPDBRegistration.findMany({
    where: { schoolId: school.id, status: 'ACCEPTED' },
    include: { school: true },
    orderBy: { createdAt: 'desc' },
  });

  const formattedRecipients = initialMurid.map((reg) => {
    let parentData: Record<string, string> = {};
    try {
      parentData = JSON.parse(reg.parentData || '{}');
    } catch {
      // ignore
    }

    const phone = parentData.motherPhone || parentData.fatherPhone || '628122334455';
    const parentName = parentData.motherName || parentData.fatherName || 'Wali Murid';

    return {
      id: reg.id,
      studentName: reg.studentName,
      parentName,
      phone,
      registrationNo: reg.registrationNo,
      schoolName: reg.school.name,
      schoolSlug: reg.school.slug,
      status: reg.status,
    };
  });

  const counts = {
    PAYMENT_PENDING: pendingCount,
    VERIFIED: verifiedCount,
    ACCEPTED: acceptedCount,
    ALL_APPLICANTS: allApplicantsCount,
    AFFILIATE_ACTIVE: affiliateCount,
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
          title={`Broadcast WhatsApp - ${school.name}`}
          subtitle="Pusat Otomasi Pesan Massal, Pengumuman Kelulusan & Pengingat Tagihan Murid"
          currentSchoolSlug={schoolSlug as 'tk' | 'sd' | 'smp'}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full">
          <BroadcastManagerClient
            initialCounts={counts}
            initialRecipients={formattedRecipients}
            defaultSchoolSlug={schoolSlug}
            isUnitScoped={true}
            schoolName={school.name}
          />
        </main>
      </div>
    </div>
  );
}
