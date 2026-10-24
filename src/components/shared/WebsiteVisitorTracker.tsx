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

      // Session deduplication: counts unique visit per session per unit
      const sessionKey = `alafiyah_visit_session_${unit}`;
      if (sessionStorage.getItem(sessionKey)) {
        return;
      }

      // Mark session as counted
      sessionStorage.setItem(sessionKey, '1');

      const payload = JSON.stringify({
        unit,
        path,
      });

      fetch('/api/analytics/visitor-hit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.success && data?.stats) {
            // Dispatch live update so FooterVisitorBadge & dashboards update immediately
            window.dispatchEvent(
              new CustomEvent('alafiyah_visitor_stats_updated', {
                detail: { stats: data.stats },
              })
            );
          }
        })
        .catch(() => {});
    } catch {
      // Ignore
    }
  }, [pathname]);

  return null;
}

