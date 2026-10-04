import React from 'react';
import { prisma } from '@/lib/prisma';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import FinanceConsoleClient, { InvoiceItem, PayoutItem } from '@/components/admin/FinanceConsoleClient';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function SchoolFinancePage({
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
    where: { slug: schoolSlug },
    include: {
      invoices: {
        include: {
          registration: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      },
      conversions: {
        include: {
          affiliate: {
            include: {
              user: true
            }
          },
          registration: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  });

  if (!school) {
    notFound();
  }

  const invoices: InvoiceItem[] = school.invoices.map((inv) => ({
    id: inv.id,
    orderId: inv.orderId,
    schoolSlug: school.slug,
    schoolName: school.name,
    studentName: inv.registration?.studentName || 'Murid Baru',
    registrationNo: inv.registration?.registrationNo || '-',
    amount: inv.amount,
    paymentMethod: inv.paymentMethod || 'Midtrans QRIS/VA',
    paymentStatus: inv.paymentStatus,
    paidAt: inv.paidAt ? inv.paidAt.toISOString() : null,
    createdAt: new Date(inv.createdAt).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }));

  const payouts: PayoutItem[] = school.conversions.map((conv) => ({
    id: conv.id,
    affiliateName: conv.affiliate.user.fullName,
    affiliatePhone: conv.affiliate.user.phone || '-',
    bankName: conv.affiliate.bankName,
    bankAccountNumber: conv.affiliate.bankAccountNumber,
    bankAccountHolder: conv.affiliate.bankAccountHolder,
    studentName: conv.registration?.studentName || 'Murid Baru',
    schoolName: school.name,
    commissionAmount: conv.commissionAmount,
    status: conv.status,
    paidAt: conv.paidAt ? conv.paidAt.toISOString() : null,
    createdAt: new Date(conv.createdAt).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }));

  const roleName = `ADMIN_${schoolSlug.toUpperCase()}`;

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans antialiased text-slate-800">
      <AdminSidebar
        schoolSlug={school.slug as 'tk' | 'sd' | 'smp'}
        schoolName={school.name}
        userName={`Admin Kas & Keuangan ${school.name}`}
        currentRole={roleName}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title={`Manajemen Kas & Tagihan ${school.name}`}
          subtitle="Rekonsiliasi Kas Masuk Formulir PPDB & Verifikasi Pembayaran Tunai/Bank"
          currentSchoolSlug={school.slug as 'tk' | 'sd' | 'smp'}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full">
          <FinanceConsoleClient
            schoolSlug={school.slug}
            schoolName={school.name}
            isFoundation={false}
            initialInvoices={invoices}
            initialPayouts={payouts}
          />
        </main>
      </div>
    </div>
  );
}
