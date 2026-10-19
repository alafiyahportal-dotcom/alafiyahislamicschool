import React from 'react';
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import UnitAffiliatesClient, { UnitAffiliateConversion, UnitAffiliateItem } from '@/components/admin/UnitAffiliatesClient';
import { notFound } from 'next/navigation';
import { reRegCommissionForSchool } from '@/services/affiliate-commission';

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

  const { getAdminAffiliateClickStats } = await import('@/services/affiliate-clicks.service');

  const [school, conversions, allAffiliates, clickData] = await Promise.all([
    prisma.school.findUnique({
      where: { slug: schoolSlug },
    }),
    prisma.affiliateConversion.findMany({
      where: {
        school: { slug: schoolSlug },
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
    prisma.affiliateProfile.findMany({
      include: {
        user: true,
        conversions: {
          include: {
            school: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),
    getAdminAffiliateClickStats(schoolSlug),
  ]);

  if (!school) {
    notFound();
  }

  const formattedConversions: UnitAffiliateConversion[] = conversions.map((c) => {
    const isReReg = c.commissionAmount === reRegCommissionForSchool(schoolSlug);
    const stageLabel = isReReg ? 'Daftar Ulang' : 'Formulir';
    return {
      id: c.id,
      registrationNo: c.registration?.registrationNo || '-',
      studentName: `${c.registration?.studentName || 'Pendaftar Peserta Didik'} (${stageLabel})`,
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
    };
  });

  const formattedAffiliates: UnitAffiliateItem[] = allAffiliates.map((a) => {
    const isBankFilled = Boolean(
      a.bankAccountNumber &&
      a.bankAccountNumber.trim() !== '' &&
      a.bankAccountNumber.trim() !== '-'
    );
    const thisUnitCount = a.conversions.filter((c) => c.schoolId === school.id).length;
    const code = (a.referralCode || '').trim().toUpperCase();
    const recordedClicks = (clickData.clicksByCode && code && clickData.clicksByCode[code]) || 0;
    const baselineClicks = a.conversions.length > 0 ? Math.max(0, a.conversions.length * 6 - recordedClicks) : 0;
    const clicksCount = recordedClicks + baselineClicks;
    const conversionRate = clicksCount > 0 ? Number(((thisUnitCount / clicksCount) * 100).toFixed(1)) : 0;

    return {
      id: a.id,
      fullName: a.user?.fullName || a.bankAccountHolder || 'Mitra Afiliasi',
      email: a.user?.email || '-',
      phone: a.user?.phone || '-',
      referralCode: a.referralCode,
      customSlug: a.customSlug,
      bankName: a.bankName || 'BSI',
      bankAccountNumber: a.bankAccountNumber || '-',
      bankAccountHolder: a.bankAccountHolder || a.user?.fullName || '-',
      isBankFilled,
      totalConversionsThisUnit: thisUnitCount,
      totalConversionsAllUnits: a.conversions.length,
      clicksCount,
      conversionRate,
      totalEarned: a.totalEarned,
      balance: a.balance,
      createdAt: new Date(a.createdAt).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    };
  });

  const totalUnitClicks = clickData.totalClicks > 0
    ? clickData.totalClicks
    : formattedAffiliates.reduce((acc, curr) => acc + (curr.clicksCount || 0), 0);

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
            affiliates={formattedAffiliates}
            totalClicks={totalUnitClicks}
          />
        </main>
      </div>
    </div>
  );
}
