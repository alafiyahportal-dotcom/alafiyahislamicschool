'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { saveReferralCode } from '@/lib/referral';

export default function ReferralTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const refParam = searchParams.get('ref') || searchParams.get('referral');

    if (refParam) {
      saveReferralCode(refParam);
    }
  }, [searchParams]);

  return null;
}
