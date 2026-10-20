'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function WebsiteVisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;

      const path = pathname || window.location.pathname;

      // DO NOT track admin pages, internal APIs, Next.js assets, or auth routes
      if (
        path.startsWith('/admin') ||
        path.startsWith('/api') ||
        path.startsWith('/_next') ||
        path.startsWith('/auth')
      ) {
        return;
      }

      // DO NOT track automated bots or headless browsers
      const ua = navigator.userAgent || '';
      if (/bot|crawl|spider|headless|lighthouse/i.test(ua)) {
        return;
      }

      const host = window.location.hostname.toLowerCase();

      // Determine unit accurately
      let unit = 'foundation';
      if (path.startsWith('/sd') || host.startsWith('sdit.') || host.startsWith('sd.')) {
        unit = 'sd';
      } else if (path.startsWith('/smp') || host.startsWith('smpit.') || host.startsWith('smp.')) {
        unit = 'smp';
      } else if (path.startsWith('/tk') || host.startsWith('tkit.') || host.startsWith('tk.')) {
        unit = 'tk';
      }

      // Unique visitor per unit per day: prevent double-counting across refreshes and page hops
      const todayDate = new Date().toISOString().slice(0, 10);
      const storageKey = `alafiyah_visit_${unit}_${todayDate}`;

      if (localStorage.getItem(storageKey)) {
        return;
      }

      // Mark logged for today for this unit
      localStorage.setItem(storageKey, '1');
      sessionStorage.setItem(`alafiyah_visit_logged_${unit}`, '1');

      const payload = JSON.stringify({
        unit,
        path,
      });

      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/analytics/visitor-hit', new Blob([payload], { type: 'application/json' }));
      } else {
        fetch('/api/analytics/visitor-hit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      // Ignore
    }
  }, [pathname]);

  return null;
}
