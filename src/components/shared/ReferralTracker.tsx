'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function ReferralTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const refParam = searchParams.get('ref') || searchParams.get('referral');

    if (refParam) {
      const cleanRef = refParam.trim().toUpperCase();
      if (cleanRef) {
        // Save to cookie (30 days)
        document.cookie = `alafiyah_ref=${encodeURIComponent(
          JSON.stringify({ referralCode: cleanRef })
        )}; path=/; max-age=${60 * 60 * 24 * 30}`;

        // Save to localStorage
        try {
          localStorage.setItem('alafiyah_ref_code', cleanRef);
        } catch {}
      }
    }
  }, [searchParams]);

  return null;
}
