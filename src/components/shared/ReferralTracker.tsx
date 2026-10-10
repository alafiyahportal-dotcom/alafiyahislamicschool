'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { saveReferralCode } from '@/lib/referral';

export default function ReferralTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const searchParams = new URLSearchParams(window.location.search);
    const refParam = searchParams.get('ref') || searchParams.get('referral');

    if (refParam) {
      saveReferralCode(refParam);
    }
  }, [pathname]);

  return null;
}
