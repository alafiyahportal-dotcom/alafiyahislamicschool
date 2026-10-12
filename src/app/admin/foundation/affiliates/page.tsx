import React from 'react';
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import UnitAffiliatesClient, {
  UnitAffiliateConversion,
  UnitAffiliateItem,
} from '@/components/admin/UnitAffiliatesClient';
import { reRegCommissionForSchool } from '@/services/affiliate-commission';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Kemitraan Afiliasi Yayasan | Yayasan Pendidikan Imam Bonjol',
  description: 'Pemantauan pusat kemitraan afiliasi seluruh unit (TK, SDIT, SMP IT) Al-Afiyah Majalengka.',
};

export default async function FoundationAffiliatesPage() {
  const [conversions, allAffiliates] = await Promise.all([
    prisma.affiliateConversion.findMany({
      include: {
        affiliate: {
          include: {
            user: true,
          },
        },
        school: true,
        registration: {
          include: {
            invoices: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prisma.affiliateProfile.findMany({
      include: {
        user: true,
        conversions: {
          include: {
            school: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),
  ]);

  const formattedConversions: UnitAffiliateConversion[] = conversions.map((c) => {
    const isReReg = c.commissionAmount === reRegCommissionForSchool(c.school?.slug || 'sd');
    const stageLabel = isReReg ? 'Daftar Ulang' : 'Formulir';
    return {
      id: c.id,
      registrationNo: c.registration?.registrationNo || '-',
      studentName: `${c.registration?.studentName || 'Calon Peserta Didik'} (${c.school?.slug.toUpperCase()} - ${stageLabel})`,
      affiliateName: c.affiliate?.user?.fullName || 'Mitra Afiliasi',
      referralCode: c.affiliate?.referralCode || '-',
      commissionAmount: c.commissionAmount,
      status: c.status,
      paidAt: c.paidAt ? new Date(c.paidAt).toLocaleDateString('id-ID') : null,
      createdAt: new Date(c.createdAt).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      paymentStatus: c.registration?.invoices?.[0]?.paymentStatus || 'UNPAID',
    };
  });

  const formattedAffiliates: UnitAffiliateItem[] = allAffiliates.map((a) => {
    const isBankFilled = Boolean(
      a.bankAccountNumber &&
      a.bankAccountNumber.trim() !== '' &&
      a.bankAccountNumber.trim() !== '-'
    );
    return {
      id: a.id,
      fullName: a.user?.fullName || a.bankAccountHolder || 'Mitra Afiliasi',
      email: a.user?.email || '-',
      phone: a.user?.phone || '-',
      referralCode: a.referralCode,
      customSlug: a.customSlug,
      bankName: a.bankName || 'BSI',
      bankAccountNumber: a.bankAccountNumber || '-',
      bankAccountHolder: a.bankAccountHolder || a.user?.fullName || '-',
      isBankFilled,
      totalConversionsThisUnit: a.conversions.length,
      totalConversionsAllUnits: a.conversions.length,
      totalEarned: a.totalEarned,
      balance: a.balance,
      createdAt: new Date(a.createdAt).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    };
  });

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans antialiased text-slate-800">
      <AdminSidebar
        schoolSlug="foundation"
        schoolName="Yayasan Pendidikan Imam Bonjol"
        userName="Super Admin Yayasan"
        currentRole="SUPERADMIN"
      />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="Pusat Kemitraan Afiliasi Yayasan"
          subtitle="Pemantauan Terpadu Mitra Afiliasi & Komisi Seluruh Unit TK IT, SDIT, dan SMP IT Al-Afiyah"
          currentSchoolSlug="foundation"
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full">
          <UnitAffiliatesClient
            schoolSlug="foundation"
            schoolName="Seluruh Unit Al-Afiyah"
            conversions={formattedConversions}
            affiliates={formattedAffiliates}
          />
        </main>
      </div>
    </div>
  );
}
