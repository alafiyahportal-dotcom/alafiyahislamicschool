import React from 'react';
import { prisma } from '@/lib/prisma';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import TahfidzTrackerClient from '@/components/admin/TahfidzTrackerClient';
import { notFound } from 'next/navigation';
import { getSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

export default async function SchoolTahfidzPage({
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
      teachers: {
        where: { isActive: true },
        orderBy: [{ order: 'asc' }],
        select: { id: true, name: true, role: true },
      },
    },
  });

  if (!school) {
    notFound();
  }

  const session = await getSession();
  const roleName = session?.role || `ADMIN_${schoolSlug.toUpperCase()}`;
  const userName = session?.fullName || `Koordinator Tahfidz ${schoolSlug.toUpperCase()}`;

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
          title={`Mutaba'ah & Tracker Tahfidz — ${school.name}`}
          subtitle="Input progress hafalan harian, rekap pencapaian juz & surah, dan monitoring musyrif"
          currentSchoolSlug={schoolSlug as 'tk' | 'sd' | 'smp'}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full">
          <TahfidzTrackerClient
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
            musyrifList={school.teachers.map((t) => ({
              id: t.id,
              name: t.name,
              role: t.role,
            }))}
          />
        </main>
      </div>
    </div>
  );
}
