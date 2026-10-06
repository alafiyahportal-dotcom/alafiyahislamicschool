import React from 'react';
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import UnitAffiliatesClient, { UnitAffiliateConversion } from '@/components/admin/UnitAffiliatesClient';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ schoolSlug: string }>;
}): Promise<Metadata> {
  const { schoolSlug } = await params;
  return {
    title: `Kemitraan Afiliasi | ${schoolSlug.toUpperCase()} IT Al-Afiyah`,
    description: 'Pemantauan rujukan pendaftaran murid dan komisi mitra afiliasi.',
  };
}

export default async function SchoolAffiliatesPage({
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
  });

  if (!school) {
    notFound();
  }

  const [conversions, totalAffiliatesCount] = await Promise.all([
    prisma.affiliateConversion.findMany({
      where: {
        schoolId: school.id,
      },
      include: {
        affiliate: {
          include: {
            user: true,
          },
        },
        registration: {
          include: {
            invoices: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prisma.affiliateProfile.count(),
  ]);

  const formattedConversions: UnitAffiliateConversion[] = conversions.map((c) => ({
    id: c.id,
    registrationNo: c.registration?.registrationNo || '-',
    studentName: c.registration?.studentName || 'Pendaftar Peserta Didik',
    affiliateName: c.affiliate?.user?.fullName || 'Mitra Afiliasi',
    referralCode: c.affiliate?.referralCode || '-',
    commissionAmount: c.commissionAmount,
    status: c.status,
    paidAt: c.paidAt ? new Date(c.paidAt).toLocaleDateString('id-ID') : null,
    createdAt: new Date(c.createdAt).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
    paymentStatus: c.registration?.invoices?.[0]?.paymentStatus || 'UNPAID',
  }));

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
          title={`Kemitraan Afiliasi - ${school.name}`}
          subtitle="Pemantauan Pendaftaran Rujukan Calon Murid, Kode Referral & Status Komisi Mitra"
          currentSchoolSlug={schoolSlug as 'tk' | 'sd' | 'smp'}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full">
          <UnitAffiliatesClient
            schoolSlug={schoolSlug}
            schoolName={school.name}
            conversions={formattedConversions}
            totalAffiliatesCount={totalAffiliatesCount}
          />
        </main>
      </div>
    </div>
  );
}
