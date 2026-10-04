import React from 'react';
import { prisma } from '@/lib/prisma';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import FinanceConsoleClient, { InvoiceItem, PayoutItem } from '@/components/admin/FinanceConsoleClient';

export const dynamic = 'force-dynamic';

export default async function FoundationFinancePage() {
  const allInvoices = await prisma.invoice.findMany({
    include: {
      registration: true,
      school: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const allPayouts = await prisma.affiliateConversion.findMany({
    include: {
      affiliate: {
        include: {
          user: true
        }
      },
      school: true,
      registration: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const invoices: InvoiceItem[] = allInvoices.map((inv) => ({
    id: inv.id,
    orderId: inv.orderId,
    schoolSlug: inv.school.slug,
    schoolName: inv.school.name,
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

  const payouts: PayoutItem[] = allPayouts.map((conv) => ({
    id: conv.id,
    affiliateName: conv.affiliate.user.fullName,
    affiliatePhone: conv.affiliate.user.phone || '-',
    bankName: conv.affiliate.bankName,
    bankAccountNumber: conv.affiliate.bankAccountNumber,
    bankAccountHolder: conv.affiliate.bankAccountHolder,
    studentName: conv.registration?.studentName || 'Murid Baru',
    schoolName: conv.school.name,
    commissionAmount: conv.commissionAmount,
    status: conv.status,
    paidAt: conv.paidAt ? conv.paidAt.toISOString() : null,
    createdAt: new Date(conv.createdAt).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }));

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans antialiased text-slate-800">
      <AdminSidebar
        schoolSlug="foundation"
        schoolName="Yayasan Pendidikan Imam Bonjol"
        userName="Bendahara Yayasan"
        currentRole="FINANCE"
      />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="Rekonsiliasi Kas & Keuangan Yayasan"
          subtitle="Konsolidasi Kas Masuk PPDB Seluruh Unit & Verifikasi Pencairan Mitra Afiliasi"
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full">
          <FinanceConsoleClient
            schoolSlug="foundation"
            schoolName="Pusat Yayasan Imam Bonjol"
            isFoundation={true}
            initialInvoices={invoices}
            initialPayouts={payouts}
          />
        </main>
      </div>
    </div>
  );
}
