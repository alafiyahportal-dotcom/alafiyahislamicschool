import React from 'react';
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import NotificationLogClient, { NotificationLogItem } from '@/components/admin/NotificationLogClient';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params
}: {
  params: Promise<{ schoolSlug: string }>;
}): Promise<Metadata> {
  const { schoolSlug } = await params;
  return {
    title: `Log Pesan WhatsApp | ${schoolSlug.toUpperCase()} IT Al-Afiyah`,
    description: 'Audit trail riwayat pengiriman notifikasi WhatsApp & status delivery gateway.',
  };
}

export default async function SchoolNotificationLogsPage({
  params
}: {
  params: Promise<{ schoolSlug: string }>;
}) {
  const resolvedParams = await params;
  const { schoolSlug } = resolvedParams;

  if (schoolSlug !== 'tk' && schoolSlug !== 'sd' && schoolSlug !== 'smp') {
    notFound();
  }

  const school = await prisma.school.findUnique({
    where: { slug: schoolSlug }
  });

  if (!school) {
    notFound();
  }

  const logs = await prisma.notificationLog.findMany({
    where: {
      schoolId: school.id
    },
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
    schoolName: l.school?.name || school.name,
    schoolSlug: l.school?.slug || school.slug,
    createdAt: new Date(l.createdAt).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }));

  const roleName = `ADMIN_${schoolSlug.toUpperCase()}`;

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans antialiased text-slate-800">
      <AdminSidebar
        schoolSlug={schoolSlug as 'tk' | 'sd' | 'smp'}
        schoolName={school.name}
        userName={`Admin ${schoolSlug.toUpperCase()}`}
        currentRole={roleName}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title={`Log Pesan WhatsApp - ${school.name}`}
          subtitle="Audit Trail Riwayat Pengiriman Notifikasi & Status Delivery OTP / Tagihan Murid"
          currentSchoolSlug={schoolSlug as 'tk' | 'sd' | 'smp'}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full">
          <NotificationLogClient initialLogs={formattedLogs} />
        </main>
      </div>
    </div>
  );
}
