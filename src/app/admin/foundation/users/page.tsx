import React from 'react';
import { prisma } from '@/lib/prisma';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import UserManagerClient from '@/components/admin/UserManagerClient';

export const dynamic = 'force-dynamic';

export default async function FoundationUsersPage() {
  const users = await prisma.user.findMany({
    include: {
      school: {
        select: {
          id: true,
          slug: true,
          name: true,
          unitLevel: true,
        },
      },
    },
    orderBy: [
      { role: 'asc' },
      { createdAt: 'desc' },
    ],
  });

  const schools = await prisma.school.findMany({
    select: {
      id: true,
      slug: true,
      name: true,
      unitLevel: true,
    },
    orderBy: { unitLevel: 'asc' },
  });

  const serializedUsers = users.map((u) => ({
    id: u.id,
    email: u.email,
    fullName: u.fullName,
    phone: u.phone,
    role: u.role,
    schoolId: u.schoolId,
    isActive: u.isActive,
    createdAt: u.createdAt.toISOString(),
    school: u.school ? {
      id: u.school.id,
      slug: u.school.slug,
      name: u.school.name,
      unitLevel: u.school.unitLevel,
    } : null,
  }));

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
          title="Manajemen Pengguna & Otoritas Sistem"
          subtitle="Kelola Akun Tenaga Pendidik, Panitia PPDB, Administrator Unit, dan Akses Pengurus Yayasan"
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full">
          <UserManagerClient
            initialUsers={serializedUsers}
            schools={schools}
          />
        </main>
      </div>
    </div>
  );
}
