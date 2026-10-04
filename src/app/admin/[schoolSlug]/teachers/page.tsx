import React from 'react';
import { prisma } from '@/lib/prisma';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import TeacherManagerClient from '@/components/admin/TeacherManagerClient';
import { notFound } from 'next/navigation';

// Revalidate every 60 seconds — teacher data changes infrequently
export const revalidate = 60;

export default async function SchoolTeachersPage({
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
      teachers: {
        orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
        include: {
          school: {
            select: {
              slug: true,
              name: true,
            },
          },
        },
      },
    },
  });

  if (!school) {
    notFound();
  }

  const roleName = `ADMIN_${schoolSlug.toUpperCase()}`;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar
        currentRole={roleName}
        userName={`Admin Tenaga Pendidik ${schoolSlug.toUpperCase()}`}
        schoolSlug={schoolSlug as 'tk' | 'sd' | 'smp'}
        schoolName={school.name}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title={`Dewan Guru & Tenaga Pendidik - ${school.name}`}
          subtitle="Manajemen Profil Pendidik, Kompetensi Keilmuan, dan Penugasan Kelas"
          currentSchoolSlug={schoolSlug as 'tk' | 'sd' | 'smp'}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full">
          <TeacherManagerClient
            initialTeachers={school.teachers}
            schoolSlug={schoolSlug}
            schoolName={school.name}
            schoolId={school.id}
          />
        </main>
      </div>
    </div>
  );
}
