import React from 'react';
import { prisma } from '@/lib/prisma';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import AchievementManagerClient from '@/components/admin/AchievementManagerClient';
import { notFound } from 'next/navigation';

export const revalidate = 60;

export default async function SchoolAchievementsPage({
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

  const achievements = await prisma.studentAchievement.findMany({
    where: { schoolId: school.id },
    include: {
      school: {
        select: {
          id: true,
          slug: true,
          name: true,
          primaryColor: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const roleName = `ADMIN_${schoolSlug.toUpperCase()}`;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar
        currentRole={roleName}
        userName={`Admin Kesiswaan ${schoolSlug.toUpperCase()}`}
        schoolSlug={schoolSlug as 'tk' | 'sd' | 'smp'}
        schoolName={school.name}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title={`Tata Kelola Prestasi Murid - ${school.name}`}
          subtitle="Pencatatan Kejuaraan, Piagam Apresiasi A4 Resmi, dan Rekapitulasi Prestasi Kesiswaan"
          currentSchoolSlug={schoolSlug as 'tk' | 'sd' | 'smp'}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full">
          <AchievementManagerClient
            initialAchievements={achievements}
            schoolSlug={schoolSlug}
            schoolName={school.name}
            schoolId={school.id}
          />
        </main>
      </div>
    </div>
  );
}
