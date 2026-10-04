import React from 'react';
import { prisma } from '@/lib/prisma';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import FoundationDashboardClient from '@/components/admin/FoundationDashboardClient';

export const dynamic = 'force-dynamic';

export default async function FoundationAdminPage() {
  // Query all schools
  const schoolsData = await prisma.school.findMany({
    include: {
      ppdbRegistrations: {
        include: {
          invoices: true
        }
      }
    }
  });

  // Query all registrations
  const allRegistrations = await prisma.pPDBRegistration.findMany({
    include: {
      school: true,
      invoices: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  // Query total affiliates
  const totalAffiliates = await prisma.affiliateProfile.count();

  // Query actual total teachers across all units
  const totalTeachers = await prisma.teacher.count({ where: { isActive: true } });

  // Aggregate stats
  const totalStudents = allRegistrations.length;
  const totalVerified = allRegistrations.filter(
    (r) => r.status === 'VERIFIED' || r.status === 'INTERVIEW_SCHEDULED' || r.status === 'ACCEPTED'
  ).length;

  let totalRevenue = 0;
  allRegistrations.forEach((r) => {
    r.invoices.forEach((inv) => {
      if (inv.paymentStatus === 'PAID') {
        totalRevenue += inv.amount;
      }
    });
  });

  const schoolsStats = schoolsData.map((s) => {
    let rev = 0;
    let verifiedCount = 0;
    s.ppdbRegistrations.forEach((r) => {
      if (r.status === 'VERIFIED' || r.status === 'ACCEPTED') verifiedCount++;
      r.invoices.forEach((inv) => {
        if (inv.paymentStatus === 'PAID') rev += inv.amount;
      });
    });

    const targetQuota = s.quota || (s.slug === 'tk' ? 40 : s.slug === 'sd' ? 60 : 75);

    return {
      id: s.id,
      name: s.name,
      slug: s.slug,
      badgeText: s.badgeText,
      totalApplicants: s.ppdbRegistrations.length,
      verifiedApplicants: verifiedCount,
      totalRevenue: rev,
      targetQuota: targetQuota
    };
  });

  const applicantRecords = allRegistrations.map((r) => {
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
      schoolName: r.school.name,
      schoolSlug: r.school.slug,
      parentName,
      parentPhone,
      registrationPath,
      status: r.status,
      paymentStatus: invoice?.paymentStatus || 'UNPAID',
      amount: invoice?.amount || 0,
      createdAt: r.createdAt.toISOString()
    };
  });

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Google-Style Sidebar */}
      <AdminSidebar
        currentRole="SUPERADMIN"
        userName="Superadmin Yayasan"
        schoolSlug="foundation"
        schoolName="Yayasan Pendidikan Imam Bonjol"
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="Konsol Superadmin Yayasan"
          subtitle="Yayasan Pendidikan Imam Bonjol Majalengka"
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full">
          <FoundationDashboardClient
            stats={{
              totalStudents,
              totalRevenue,
              totalVerified,
              totalAffiliates
            }}
            schools={schoolsStats}
            initialApplicants={applicantRecords}
            currentSchoolSlug="foundation"
            schoolName="Yayasan Pendidikan Imam Bonjol"
            totalTeachers={totalTeachers}
          />
        </main>
      </div>
    </div>
  );
}
