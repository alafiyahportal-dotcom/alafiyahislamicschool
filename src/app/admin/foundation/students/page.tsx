import React from 'react';
import { Metadata } from 'next';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { StudentDossierManagerClient } from '@/components/admin/StudentDossierManagerClient';

export const metadata: Metadata = {
  title: 'Buku Induk Murid Terpadu | Yayasan Pendidikan Imam Bonjol',
  description:
    'Konsol konsolidasi Buku Induk Siswa/Murid digital seluruh unit TK IT, SDIT, dan SMP IT Al-Afiyah.',
};

export const dynamic = 'force-dynamic';

export default async function FoundationStudentsPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar
        currentRole="SUPERADMIN"
        userName="Direktur Pendidikan & Kesiswaan Yayasan"
      />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="Buku Induk Kesiswaan Terpadu Yayasan"
          subtitle="Basis Data Siswa Seluruh Unit Sekolah Al-Afiyah Majalengka (TK, SD, SMP IT)"
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full">
          <StudentDossierManagerClient
            schoolName="Yayasan Pendidikan Imam Bonjol Majalengka"
          />
        </main>
      </div>
    </div>
  );
}
