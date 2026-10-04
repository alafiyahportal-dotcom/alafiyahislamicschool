import React from 'react';
import { prisma } from '@/lib/prisma';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import NotificationLogClient, { NotificationLogItem } from '@/components/admin/NotificationLogClient';

export const dynamic = 'force-dynamic';

export default async function NotificationLogsPage() {
  const logs = await prisma.notificationLog.findMany({
    include: {
      school: true
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 100
  });

  const formattedLogs: NotificationLogItem[] = logs.map((l) => ({
    id: l.id,
    recipientPhone: l.recipientPhone,
    recipientName: l.recipientName,
    eventType: l.eventType,
    messageContent: l.messageContent,
    status: l.status,
    schoolName: l.school?.name || 'Pusat Yayasan',
    schoolSlug: l.school?.slug || 'foundation',
    createdAt: new Date(l.createdAt).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }));

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans antialiased text-slate-800">
      <AdminSidebar
        schoolSlug="foundation"
        schoolName="Yayasan Pendidikan Imam Bonjol"
        userName="Administrator WhatsApp"
        currentRole="SUPERADMIN"
      />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="Log Pengiriman WhatsApp Gateway"
          subtitle="Audit Trail Riwayat Pengiriman Notifikasi & Status Delivery OTP / Tagihan"
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full">
          <NotificationLogClient initialLogs={formattedLogs} />
        </main>
      </div>
    </div>
  );
}
