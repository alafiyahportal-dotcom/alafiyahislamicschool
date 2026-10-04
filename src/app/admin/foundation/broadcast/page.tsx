import React from 'react';
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import BroadcastManagerClient from '@/components/admin/BroadcastManagerClient';

export const metadata: Metadata = {
  title: 'WhatsApp Broadcast Center | Yayasan Pendidikan Imam Bonjol',
  description: 'Pusat siaran notifikasi massal WhatsApp untuk calon wali murid dan mitra afiliasi Yayasan Imam Bonjol Majalengka.',
};

export const dynamic = 'force-dynamic';

export default async function BroadcastCenterPage() {
  // Hitung jumlah per segmen
  const [pendingCount, verifiedCount, acceptedCount, allApplicantsCount, affiliateCount] = await Promise.all([
    prisma.pPDBRegistration.count({ where: { status: 'PAYMENT_PENDING' } }),
    prisma.pPDBRegistration.count({ where: { status: 'VERIFIED' } }),
    prisma.pPDBRegistration.count({ where: { status: 'ACCEPTED' } }),
    prisma.pPDBRegistration.count(),
    prisma.affiliateProfile.count(),
  ]);

  // Initial recipients default: ACCEPTED
  const initialMurid = await prisma.pPDBRegistration.findMany({
    where: { status: 'ACCEPTED' },
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

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans antialiased text-slate-800">
      <AdminSidebar
        schoolSlug="foundation"
        schoolName="Yayasan Pendidikan Imam Bonjol"
        userName="Administrator WhatsApp"
        currentRole="SUPERADMIN"
      />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="Broadcast WhatsApp Pengumuman & Tagihan"
          subtitle="Pusat Otomasi Pesan Massal Yayasan Pendidikan Imam Bonjol"
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full">
          <BroadcastManagerClient
            initialCounts={counts}
            initialRecipients={formattedRecipients}
          />
        </main>
      </div>
    </div>
  );
}
