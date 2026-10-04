import React from 'react';
import { prisma } from '@/lib/prisma';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import AttendanceManagerClient from '@/components/admin/AttendanceManagerClient';
import { notFound } from 'next/navigation';
import { getSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

export default async function SchoolAttendancePage({
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
      students: {
        where: { status: 'ACTIVE' },
        orderBy: [{ classGrade: 'asc' }, { fullName: 'asc' }],
      },
    },
  });

  if (!school) {
    notFound();
  }

  const session = await getSession();
  const roleName = session?.role || `ADMIN_${schoolSlug.toUpperCase()}`;
  const userName = session?.fullName || `Tata Usaha ${schoolSlug.toUpperCase()}`;

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
          title={`Presensi Murid — ${school.name}`}
          subtitle="Input kehadiran harian, izin, sakit, dan alpa murid per kelas"
          currentSchoolSlug={schoolSlug as 'tk' | 'sd' | 'smp'}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full">
          <AttendanceManagerClient
            schoolSlug={schoolSlug}
            schoolName={school.name}
            schoolId={school.id}
            initialStudents={school.students.map((s) => ({
              id: s.id,
              nis: s.nis,
              fullName: s.fullName,
              classGrade: s.classGrade,
              gender: s.gender,
            }))}
          />
        </main>
      </div>
    </div>
  );
}
