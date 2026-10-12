import React from 'react';
import { prisma } from '@/lib/prisma';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import FoundationDashboardClient from '@/components/admin/FoundationDashboardClient';
import { notFound } from 'next/navigation';
import { getSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

export default async function SchoolUnitAdminPage({
  params
}: {
  params: Promise<{ schoolSlug: string }>;
}) {
  const resolvedParams = await params;
  const { schoolSlug } = resolvedParams;

  if (schoolSlug !== 'tk' && schoolSlug !== 'sd' && schoolSlug !== 'smp') {
    notFound();
  }

  // Query school, affiliates, teachers, and session in parallel for maximum performance
  const [school, totalAffiliates, rawTeacherCount, session] = await Promise.all([
    prisma.school.findUnique({
      where: { slug: schoolSlug },
      include: {
        ppdbRegistrations: {
          include: {
            invoices: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    }),
    prisma.affiliateProfile.count(),
    prisma.teacher.count({
      where: { school: { slug: schoolSlug }, isActive: true }
    }),
    getSession()
  ]);

  if (!school) {
    notFound();
  }

  // Unit-specific stats
  const totalStudents = school.ppdbRegistrations.length;
  const totalVerified = school.ppdbRegistrations.filter(
    (r) => r.status === 'VERIFIED' || r.status === 'INTERVIEW_SCHEDULED' || r.status === 'ACCEPTED'
  ).length;

  let totalRevenue = 0;
  school.ppdbRegistrations.forEach((r) => {
    r.invoices.forEach((inv) => {
      if (inv.paymentStatus === 'PAID') {
        totalRevenue += inv.amount;
      }
    });
  });

  const targetQuota = schoolSlug === 'tk' ? 50 : schoolSlug === 'sd' ? 90 : 120;

  const schoolStat = [
    {
      id: school.id,
      name: school.name,
      slug: school.slug,
      badgeText: school.badgeText,
      totalApplicants: totalStudents,
      verifiedApplicants: totalVerified,
      totalRevenue: totalRevenue,
      targetQuota: targetQuota
    }
  ];

  const applicantRecords = school.ppdbRegistrations.map((r) => {
    let parentName = 'Wali Murid';
    let parentPhone = '-';
    let registrationPath = 'Reguler';
    try {
      const parent = JSON.parse(r.parentData || '{}');
      parentName = parent.fatherName || parent.motherName || 'Wali Murid';
      parentPhone = parent.phone || parent.whatsapp || '-';
    } catch {
      // fallback
    }
    try {
      const specific = JSON.parse(r.schoolSpecificData || '{}');
      registrationPath = specific.registrationPath || specific.path || 'Reguler';
    } catch {
      // fallback
    }
    const invoice = r.invoices[0];
    return {
      id: r.id,
      registrationNo: r.registrationNo,
      studentName: r.studentName,
      gender: r.gender,
      schoolName: school.name,
      schoolSlug: school.slug,
      parentName,
      parentPhone,
      registrationPath,
      status: r.status,
      paymentStatus: invoice?.paymentStatus || 'UNPAID',
      amount: invoice?.amount || 0,
      createdAt: r.createdAt.toISOString()
    };
  });

  const teacherCount = rawTeacherCount > 0 ? rawTeacherCount : (schoolSlug === 'sd' ? 8 : schoolSlug === 'smp' ? 6 : 4);
  const roleName = session?.role || `ADMIN_${schoolSlug.toUpperCase()}`;
  const userName = session?.fullName || `Admin Unit ${schoolSlug.toUpperCase()} Al-Afiyah`;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar
        currentRole={roleName}
        userName={userName}
        schoolSlug={schoolSlug as 'tk' | 'sd' | 'smp'}
        schoolName={school.name}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title={`Dasbor Admin ${school.name}`}
          subtitle="Pusat Data PPDB & Manajemen Seleksi Murid"
          userName={userName}
          userRole={roleName === 'SUPERADMIN' ? 'Superadmin Yayasan' : `Admin Unit ${school.name}`}
          currentSchoolSlug={schoolSlug as 'tk' | 'sd' | 'smp'}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full">
          <FoundationDashboardClient
            stats={{
              totalStudents,
              totalRevenue,
              totalVerified,
              totalAffiliates
            }}
            schools={schoolStat}
            initialApplicants={applicantRecords}
            currentSchoolSlug={schoolSlug as 'tk' | 'sd' | 'smp'}
            schoolName={school.name}
            totalTeachers={teacherCount}
          />
        </main>
      </div>
    </div>
  );
}
