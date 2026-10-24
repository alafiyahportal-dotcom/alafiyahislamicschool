'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { saveReferralCode } from '@/lib/referral';

export default function ReferralTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const searchParams = new URLSearchParams(window.location.search);
    const refParam = (searchParams.get('ref') || searchParams.get('referral') || '').trim();

    if (refParam) {
      saveReferralCode(refParam);

      // If redirected from /ref, it was already recorded at the server route handler (tracked=1)
      const isAlreadyTracked = searchParams.get('tracked') === '1';

      const cleanCode = refParam.toUpperCase();
      const sessionKey = `alafiyah_ref_click_${cleanCode}`;

      if (!isAlreadyTracked && !sessionStorage.getItem(sessionKey)) {
        sessionStorage.setItem(sessionKey, '1');

        let schoolSlug = 'sd';
        const path = pathname || window.location.pathname;
        if (path.startsWith('/smp')) schoolSlug = 'smp';
        else if (path.startsWith('/tk')) schoolSlug = 'tk';
        else if (path.startsWith('/ppdb')) schoolSlug = 'foundation';

        const isDirectForm =
          path.includes('/daftar') ||
          searchParams.get('form') === '1' ||
          searchParams.get('action') === 'daftar';

        fetch('/api/affiliate/click', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            referralCode: cleanCode,
            schoolSlug,
            isDirectForm,
          }),
        }).catch(() => {});
      }
    }
  }, [pathname]);

  return null;
}

