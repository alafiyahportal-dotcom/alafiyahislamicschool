import React from 'react';
import { prisma } from '@/lib/prisma';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import NewsManagerClient from '@/components/admin/NewsManagerClient';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function SchoolNewsPage({
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
      newsPosts: {
        orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
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
        userName={`Redaksi Berita ${schoolSlug.toUpperCase()}`}
        schoolSlug={schoolSlug as 'tk' | 'sd' | 'smp'}
        schoolName={school.name}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title={`Kabar & Kegiatan - ${school.name}`}
          subtitle="Publikasi Artikel, Dokumentasi Acara Murid, Prestasi & Pengumuman Resmi"
          currentSchoolSlug={schoolSlug as 'tk' | 'sd' | 'smp'}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full">
          <NewsManagerClient
            initialNews={school.newsPosts}
            schoolSlug={schoolSlug}
            schoolName={school.name}
            schoolId={school.id}
          />
        </main>
      </div>
    </div>
  );
}
