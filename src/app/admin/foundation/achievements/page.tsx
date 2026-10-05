import React from 'react';
import { prisma } from '@/lib/prisma';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import AchievementManagerClient from '@/components/admin/AchievementManagerClient';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export default async function FoundationAchievementsPage() {
  const [achievements, schools] = await Promise.all([
    prisma.studentAchievement.findMany({
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
    }),
    prisma.school.findMany({
      select: {
        id: true,
        slug: true,
        name: true,
      },
      orderBy: { name: 'asc' },
    }),
  ]);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar
        currentRole="SUPERADMIN"
        userName="Superadmin Yayasan"
        schoolSlug="foundation"
        schoolName="Yayasan Pendidikan Imam Bonjol"
      />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="Konsol Pusat Prestasi Murid Terpadu - Yayasan"
          subtitle="Pemantauan Prestasi TK, SD, SMP Al-Afiyah, Generator Piagam A4 Resmi, dan Ekspor Rekapitulasi"
          currentSchoolSlug="foundation"
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full">
          <AchievementManagerClient
            initialAchievements={achievements}
            schoolSlug="foundation"
            schoolName="Yayasan Pendidikan Imam Bonjol"
            schools={schools}
          />
        </main>
      </div>
    </div>
  );
}
