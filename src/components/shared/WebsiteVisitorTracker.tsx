'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function WebsiteVisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;

      const path = pathname || window.location.pathname;
      const host = window.location.hostname.toLowerCase();

      // Determine unit
      let unit = 'foundation';
      if (path.startsWith('/sd') || host.startsWith('sdit.') || host.startsWith('sd.')) {
        unit = 'sd';
      } else if (path.startsWith('/smp') || host.startsWith('smpit.') || host.startsWith('smp.')) {
        unit = 'smp';
      } else if (path.startsWith('/tk') || host.startsWith('tkit.') || host.startsWith('tk.')) {
        unit = 'tk';
      }

      // Check if session visit was already logged for this unit in the current browsing session
      const sessionKey = `alafiyah_visit_logged_${unit}`;
      if (sessionStorage.getItem(sessionKey)) {
        return;
      }

      // Mark logged immediately
      sessionStorage.setItem(sessionKey, '1');

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
