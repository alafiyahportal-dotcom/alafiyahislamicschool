import type { Prisma } from '@prisma/client';

type Tx = Prisma.TransactionClient;

/** Commission rule per unit for registration form (Tahap 1 / Formulir). */
export function formCommissionForSchool(slug: string): number {
  if (slug === 'tk') return 0; // Belum ada data / menunggu penetapan panitia
  if (slug === 'smp') return 50000; // SMP: Rp 50.000
  return 50000; // SD: Rp 50.000
}

/** Commission rule per unit for re-registration (Tahap 2 / Daftar Ulang). */
export function reRegCommissionForSchool(slug: string): number {
  if (slug === 'tk') return 0; // Belum ada data / menunggu penetapan panitia
  if (slug === 'smp') return 100000; // SMP: Rp 100.000 (Total = Rp 150.000)
  return 100000; // SD: Rp 100.000 (Total = Rp 150.000)
}

/** Legacy / default alias for form commission. */
export function commissionForSchool(slug: string): number {
  return formCommissionForSchool(slug);
}

/**
 * Called right after a referred registration is created.
 * Records the referral as PENDING so it shows up immediately on the affiliate dashboard
 * ("Menunggu"), with the form commission amount, without adding anything to balance yet.
 */
export async function recordPendingConversion(
  tx: Tx,
  params: { affiliateId: string; schoolId: string; schoolSlug: string; registrationId: string }
) {
  const formFee = formCommissionForSchool(params.schoolSlug);

  const existing = await tx.affiliateConversion.findFirst({
    where: { registrationId: params.registrationId },
  });

  if (existing) {
    // If it was already created, make sure the commissionAmount matches the form fee if pending
    if (existing.status === 'PENDING' && existing.commissionAmount !== formFee) {
      return tx.affiliateConversion.update({
        where: { id: existing.id },
        data: { commissionAmount: formFee },
      });
    }
    return existing;
  }

  return tx.affiliateConversion.create({
    data: {
      affiliateId: params.affiliateId,
      schoolId: params.schoolId,
      registrationId: params.registrationId,
      commissionAmount: formFee,
      status: 'PENDING',
    },
  });
}

/**
 * Called when a registration's form fee is confirmed PAID (by admin or payment gateway).
 * Moves the conversion to APPROVED and credits the affiliate balance exactly once.
 * Returns affiliate contact info for notifications, or null if the registration wasn't referred.
 */
export async function approveConversionForRegistration(
  tx: Tx,
  registration: { id: string; affiliateId: string | null; schoolId: string; schoolSlug: string }
) {
  if (!registration.affiliateId) return null;

  const affiliate = await tx.affiliateProfile.findUnique({
    where: { id: registration.affiliateId },
    include: { user: true },
  });
  if (!affiliate) return null;

  const commission = formCommissionForSchool(registration.schoolSlug);

  // Look for the pending form conversion
  const existing = await tx.affiliateConversion.findFirst({
    where: {
      registrationId: registration.id,
      status: 'PENDING',
    },
  });

  // Already credited before — never double-count
  if (!existing) {
    const alreadyApproved = await tx.affiliateConversion.findFirst({
      where: {
        registrationId: registration.id,
        commissionAmount: commission,
        status: { in: ['APPROVED', 'PAID'] },
      },
    });
    if (alreadyApproved) return null;
  }

  if (existing) {
    await tx.affiliateConversion.update({
      where: { id: existing.id },
      data: {
        status: 'APPROVED',
        commissionAmount: commission,
      },
    });
  } else {
    await tx.affiliateConversion.create({
      data: {
        affiliateId: affiliate.id,
        schoolId: registration.schoolId,
        registrationId: registration.id,
        commissionAmount: commission,
        status: 'APPROVED',
      },
    });
  }

  await tx.affiliateProfile.update({
    where: { id: affiliate.id },
    data: {
      totalEarned: { increment: commission },
      balance: { increment: commission },
    },
  });

  return { phone: affiliate.user.phone, name: affiliate.user.fullName, commission };
}

/**
 * Called when a student completes Re-registration (Tahap 2 / Daftar Ulang).
 * Awards the re-registration commission and credits the affiliate balance.
 */
export async function awardReRegistrationCommission(
  tx: Tx,
  registration: {
    id: string;
    affiliateId: string | null;
    schoolId: string;
    schoolSlug: string;
    studentName?: string;
    schoolName?: string;
  }
) {
  if (!registration.affiliateId) return null;

  const commission = reRegCommissionForSchool(registration.schoolSlug);

  // Prevent double-crediting re-registration commission for the same registration
  const alreadyAwarded = await tx.affiliateConversion.findFirst({
    where: {
      registrationId: registration.id,
      commissionAmount: commission,
    },
  });
  if (alreadyAwarded) return null;

  const affiliate = await tx.affiliateProfile.findUnique({
    where: { id: registration.affiliateId },
    include: { user: true },
  });
  if (!affiliate) return null;

  const conv = await tx.affiliateConversion.create({
    data: {
      affiliateId: affiliate.id,
      schoolId: registration.schoolId,
      registrationId: registration.id,
      commissionAmount: commission,
      status: 'APPROVED',
    },
  });

  await tx.affiliateProfile.update({
    where: { id: affiliate.id },
    data: {
      totalEarned: { increment: commission },
      balance: { increment: commission },
    },
  });

  return {
    phone: affiliate.user.phone,
    name: affiliate.user.fullName,
    commission,
    conversionId: conv.id,
  };
}
