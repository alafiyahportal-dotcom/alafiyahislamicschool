import React from 'react';
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import AnalyticsDashboardClient from '@/components/admin/AnalyticsDashboardClient';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ schoolSlug: string }>;
}): Promise<Metadata> {
  const { schoolSlug } = await params;
  return {
    title: `Analitik & Corong PPDB | ${schoolSlug.toUpperCase()} IT Al-Afiyah`,
    description: 'Pemantauan performa corong konversi PPDB, perolehan pendaftar, dan efektivitas mitra afiliasi.',
  };
}

export default async function SchoolAnalyticsPage({
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

  // 1. Fetch schools
  const schools = await prisma.school.findMany({
    orderBy: { unitLevel: 'asc' },
  });

  // 2. Fetch registrations with invoices and schools
  const registrations = await prisma.pPDBRegistration.findMany({
    include: {
      school: {
        select: {
          id: true,
          slug: true,
          name: true,
          unitLevel: true,
          primaryColor: true,
          accentColor: true,
          registrationFee: true,
          quota: true,
        },
      },
      invoices: {
        select: {
          id: true,
          amount: true,
          paymentStatus: true,
          paymentMethod: true,
          paidAt: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // 3. Fetch affiliates
  const affiliates = await prisma.affiliateProfile.findMany({
    include: {
      user: { select: { fullName: true } },
      conversions: true,
    },
  });

  // Overview metrics
  const totalApplicants = registrations.length;
  const paidInvoices = registrations.flatMap((r) => r.invoices).filter((inv) => inv.paymentStatus === 'PAID');
  const totalRevenue = paidInvoices.reduce((acc, curr) => acc + curr.amount, 0);

  const verifiedCount = registrations.filter((r) =>
    ['VERIFIED', 'INTERVIEW_SCHEDULED', 'ACCEPTED'].includes(r.status)
  ).length;
  const interviewCount = registrations.filter((r) =>
    ['INTERVIEW_SCHEDULED', 'ACCEPTED'].includes(r.status)
  ).length;
  const acceptedCount = registrations.filter((r) => r.status === 'ACCEPTED').length;

  const totalQuota = schools.reduce((acc, curr) => acc + curr.quota, 0);
  const overallOccupancyRate = totalQuota > 0 ? Math.min(100, Math.round((totalApplicants / totalQuota) * 100)) : 0;
  const totalAffiliates = affiliates.length;
  const totalCommissionApproved = affiliates.reduce((acc, curr) => acc + curr.totalEarned, 0);

  // 5-Stage Funnel
  const stage1Count = totalApplicants;
  const stage2Count = registrations.filter((r) =>
    r.invoices.some((inv) => inv.paymentStatus === 'PAID') ||
    ['VERIFIED', 'INTERVIEW_SCHEDULED', 'ACCEPTED'].includes(r.status)
  ).length;
  const stage3Count = verifiedCount;
  const stage4Count = interviewCount;
  const stage5Count = acceptedCount;

  const calculateDropOff = (prev: number, curr: number) => {
    if (prev === 0) return 0;
    return Math.round(((prev - curr) / prev) * 100);
  };

  const funnel = [
    {
      stage: 1,
      id: 'STAGE_STARTED',
      name: 'Pengisian Formulir Awal',
      description: 'Calon wali murid memulai pendaftaran di portal online',
      count: stage1Count,
      percentage: stage1Count > 0 ? 100 : 0,
      dropOffRate: 0,
      color: '#2D7A70',
    },
    {
      stage: 2,
      id: 'STAGE_PAID',
      name: 'Pembayaran Formulir Lunas',
      description: 'Biaya registrasi terkonfirmasi melalui QRIS, VA, atau Kasir',
      count: stage2Count,
      percentage: stage1Count > 0 ? Math.round((stage2Count / stage1Count) * 100) : 0,
      dropOffRate: calculateDropOff(stage1Count, stage2Count),
      color: '#10B981',
    },
    {
      stage: 3,
      id: 'STAGE_VERIFIED',
      name: 'Kelengkapan Berkas Valid',
      description: 'KK, Akta Kelahiran, dan Foto telah diverifikasi panitia',
      count: stage3Count,
      percentage: stage1Count > 0 ? Math.round((stage3Count / stage1Count) * 100) : 0,
      dropOffRate: calculateDropOff(stage2Count, stage3Count),
      color: '#059669',
    },
    {
      stage: 4,
      id: 'STAGE_INTERVIEW',
      name: 'Ujian Observasi / Wawancara',
      description: 'Murid mengikuti tes kesiapan belajar, tahsin, atau akademik',
      count: stage4Count,
      percentage: stage1Count > 0 ? Math.round((stage4Count / stage1Count) * 100) : 0,
      dropOffRate: calculateDropOff(stage3Count, stage4Count),
      color: '#047857',
    },
    {
      stage: 5,
      id: 'STAGE_ACCEPTED',
      name: 'Diterima Resmi Sekolah',
      description: 'Surat Keputusan (SK) Kelulusan resmi diterbitkan',
      count: stage5Count,
      percentage: stage1Count > 0 ? Math.round((stage5Count / stage1Count) * 100) : 0,
      dropOffRate: calculateDropOff(stage4Count, stage5Count),
      color: '#064E3B',
    },
  ];

  // Unit comparison
  const unitComparison = schools.map((s) => {
    const schoolRegistrations = registrations.filter((r) => r.schoolId === s.id);
    const schoolPaidInvoices = schoolRegistrations
      .flatMap((r) => r.invoices)
      .filter((inv) => inv.paymentStatus === 'PAID');
    const schoolRevenue = schoolPaidInvoices.reduce((acc, curr) => acc + curr.amount, 0);
    const schoolVerified = schoolRegistrations.filter((r) =>
      ['VERIFIED', 'INTERVIEW_SCHEDULED', 'ACCEPTED'].includes(r.status)
    ).length;
    const schoolAccepted = schoolRegistrations.filter((r) => r.status === 'ACCEPTED').length;
    const quota = s.quota || 60;
    const applicantsCount = schoolRegistrations.length;
    const occupancyRate = quota > 0 ? Math.min(100, Math.round((applicantsCount / quota) * 100)) : 0;
    const potentialRevenue = quota * s.registrationFee;

    return {
      schoolId: s.id,
      slug: s.slug,
      name: s.name,
      unitLevel: s.unitLevel,
      badgeText: s.badgeText,
      primaryColor: s.primaryColor,
      accentColor: s.accentColor,
      registrationFee: s.registrationFee,
      quota,
      applicantsCount,
      verifiedCount: schoolVerified,
      acceptedCount: schoolAccepted,
      occupancyRate,
      revenue: schoolRevenue,
      potentialRevenue,
      remainingSeats: Math.max(0, quota - applicantsCount),
    };
  });

  // Source attribution
  const affiliateReferred = registrations.filter((r) => r.affiliateId !== null);
  const directOrganic = registrations.filter((r) => r.affiliateId === null);
  const affiliateCount = affiliateReferred.length;
  const directCount = directOrganic.length;
  const affiliatePercentage = totalApplicants > 0 ? Math.round((affiliateCount / totalApplicants) * 100) : 0;
  const directPercentage = totalApplicants > 0 ? Math.round((directCount / totalApplicants) * 100) : 0;

  const topAffiliates = affiliates
    .map((aff) => ({
      id: aff.id,
      name: aff.user?.fullName || 'Mitra Afiliasi',
      referralCode: aff.referralCode,
      referredCount: aff.conversions.length,
      totalEarned: aff.totalEarned,
    }))
    .sort((a, b) => b.referredCount - a.referredCount)
    .slice(0, 5);

  // Demographics
  const maleCount = registrations.filter((r) => r.gender === 'L').length;
  const femaleCount = registrations.filter((r) => r.gender === 'P').length;

  let regulerCount = 0;
  let tahfidzCount = 0;
  let beasiswaCount = 0;

  registrations.forEach((r) => {
    try {
      const spec = JSON.parse(r.schoolSpecificData || '{}');
      const track = (spec.admissionTrack || '').toUpperCase();
      if (track.includes('TAHFIDZ') || track.includes('PRESTASI')) {
        tahfidzCount++;
      } else if (track.includes('BEASISWA') || track.includes('DHUAFA') || track.includes('AFIRMASI')) {
        beasiswaCount++;
      } else {
        regulerCount++;
      }
    } catch {
      regulerCount++;
    }
  });

  const paymentMethods: Record<string, number> = {};
  paidInvoices.forEach((inv) => {
    const method = inv.paymentMethod || 'LAINNYA';
    paymentMethods[method] = (paymentMethods[method] || 0) + 1;
  });

  const analyticsData = {
    overview: {
      totalApplicants,
      totalRevenue,
      verifiedCount,
      acceptedCount,
      totalQuota,
      overallOccupancyRate,
      totalAffiliates,
      totalCommissionApproved,
    },
    funnel,
    unitComparison,
    sourceAttribution: {
      affiliateCount,
      directCount,
      affiliatePercentage,
      directPercentage,
      topAffiliates,
    },
    demographics: {
      gender: {
        male: maleCount,
        female: femaleCount,
        malePercent: totalApplicants > 0 ? Math.round((maleCount / totalApplicants) * 100) : 0,
        femalePercent: totalApplicants > 0 ? Math.round((femaleCount / totalApplicants) * 100) : 0,
      },
      tracks: {
        reguler: regulerCount,
        tahfidz: tahfidzCount,
        beasiswa: beasiswaCount,
      },
    },
    paymentMethods,
  };

  const roleName = `ADMIN_${schoolSlug.toUpperCase()}`;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar
        currentRole={roleName}
        userName={`Admin ${schoolSlug.toUpperCase()}`}
        schoolSlug={schoolSlug as 'tk' | 'sd' | 'smp'}
        schoolName={school.name}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title={`Analisis & Corong Konversi PPDB - ${school.name}`}
          subtitle="Pemantauan Performa Pemasaran, Rasio Kelulusan & Tingkat Keterisian Kuota Unit"
          currentSchoolSlug={schoolSlug as 'tk' | 'sd' | 'smp'}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full">
          <AnalyticsDashboardClient
            initialData={analyticsData}
            initialSelectedUnit={schoolSlug}
          />
        </main>
      </div>
    </div>
  );
}
