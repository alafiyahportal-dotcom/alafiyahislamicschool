import React from 'react';
import { Metadata } from 'next';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import ReRegistrationManagerClient from '@/components/admin/ReRegistrationManagerClient';

export const metadata: Metadata = {
  title: 'Logistik Seragam & Daftar Ulang Terpadu | Yayasan Pendidikan Imam Bonjol',
  description:
    'Konsol konsolidasi rekapitulasi seragam murid baru dan pemantauan daftar ulang seluruh unit TK, SD, dan SMP.',
};

export const dynamic = 'force-dynamic';

export default async function FoundationReRegistrationPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar
        currentRole="SUPERADMIN"
        userName="Kepala Bagian Logistik & Sarpras Yayasan"
      />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="Manajemen Daftar Ulang & Logistik Seragam Murid"
          subtitle="Pemantauan Agregasi Ukuran Seragam Vendor Konveksi & Administrasi Berkas Siswa Masuk"
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full">
          <ReRegistrationManagerClient
            initialUnit="all"
            title="Konsol Logistik Seragam & Daftar Ulang Seluruh Unit (TK, SD, SMP)"
          />
        </main>
      </div>
    </div>
  );
}
