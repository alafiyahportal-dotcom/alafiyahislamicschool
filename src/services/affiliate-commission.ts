import type { Prisma } from '@prisma/client';

type Tx = Prisma.TransactionClient;

/** Commission rule per unit (same as the original rule in PaymentService). */
export function commissionForSchool(slug: string): number {
  if (slug === 'tk') return 250000;
  if (slug === 'smp') return 500000;
  return 100000; // sd
}

/**
 * Called right after a referred registration is created.
 * Records the referral as PENDING so it shows up immediately on the affiliate dashboard
 * ("Menunggu"), without adding anything to the affiliate's balance yet.
 */
export async function recordPendingConversion(
  tx: Tx,
  params: { affiliateId: string; schoolId: string; schoolSlug: string; registrationId: string }
) {
  const existing = await tx.affiliateConversion.findFirst({
    where: { registrationId: params.registrationId },
  });
  if (existing) return existing;

  return tx.affiliateConversion.create({
    data: {
      affiliateId: params.affiliateId,
      schoolId: params.schoolId,
      registrationId: params.registrationId,
      commissionAmount: commissionForSchool(params.schoolSlug),
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

  const existing = await tx.affiliateConversion.findFirst({
    where: { registrationId: registration.id },
  });

  // Already credited before — never double-count.
  if (existing && existing.status !== 'PENDING') return null;

  const commission = existing?.commissionAmount ?? commissionForSchool(registration.schoolSlug);

  if (existing) {
    await tx.affiliateConversion.update({
      where: { id: existing.id },
      data: { status: 'APPROVED' },
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
