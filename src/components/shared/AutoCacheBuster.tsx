'use client';

import { useEffect } from 'react';

const CURRENT_DEPLOY_VERSION = '20261020_1140';
const VERSION_KEY = 'alafiyah_deploy_ver';

export default function AutoCacheBuster() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkAndEvictCache = async () => {
      try {
        const stored = localStorage.getItem(VERSION_KEY);

        // 1. If version mismatch, perform immediate purge
        if (stored !== CURRENT_DEPLOY_VERSION) {
          localStorage.setItem(VERSION_KEY, CURRENT_DEPLOY_VERSION);

          // Clear any rogue Service Workers
          if ('serviceWorker' in navigator) {
            const regs = await navigator.serviceWorker.getRegistrations();
            for (const r of regs) {
              await r.unregister();
            }
          }

          // Clear all CacheStorage API caches
          if ('caches' in window) {
            const keys = await caches.keys();
            for (const k of keys) {
              await caches.delete(k);
            }
          }

          // Clear session storage so old splash flags are wiped
          sessionStorage.clear();

          // Only reload if we were transitioning from an older version
          if (stored) {
            const url = new URL(window.location.href);
            url.searchParams.set('_v', CURRENT_DEPLOY_VERSION);
            window.location.replace(url.toString());
            return;
          }
        }

        // 2. Background check against server version endpoint
        const res = await fetch('/api/version', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data?.version && data.version !== CURRENT_DEPLOY_VERSION) {
            localStorage.setItem(VERSION_KEY, data.version);
            if ('caches' in window) {
              const keys = await caches.keys();
              for (const k of keys) {
                await caches.delete(k);
              }
            }
            sessionStorage.clear();
            const url = new URL(window.location.href);
            url.searchParams.set('_v', data.version);
            window.location.replace(url.toString());
          }
        }
      } catch {
        // Silent failure - do not interrupt user experience
      }
    };

    checkAndEvictCache();

    // Re-check automatically when user brings the tab / app back into focus
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkAndEvictCache();
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  return null;
}
