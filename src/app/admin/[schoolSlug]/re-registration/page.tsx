import React from 'react';
import { prisma } from '@/lib/prisma';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import ReRegistrationManagerClient from '@/components/admin/ReRegistrationManagerClient';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function SchoolReRegistrationPage({
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

  const roleName = `ADMIN_${schoolSlug.toUpperCase()}`;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar
        currentRole={roleName}
        userName={`Tata Usaha & Logistik ${schoolSlug.toUpperCase()}`}
        schoolSlug={schoolSlug as 'tk' | 'sd' | 'smp'}
        schoolName={school.name}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title={`Daftar Ulang & Logistik Seragam - ${school.name}`}
          subtitle="Pemantauan Ukuran Seragam Murid, Rekapitulasi Konveksi, dan Penyerahan Fisik"
          currentSchoolSlug={schoolSlug as 'tk' | 'sd' | 'smp'}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full">
          <ReRegistrationManagerClient
            initialUnit={schoolSlug}
            title={`Logistik Seragam Murid - ${school.name}`}
          />
        </main>
      </div>
    </div>
  );
}
