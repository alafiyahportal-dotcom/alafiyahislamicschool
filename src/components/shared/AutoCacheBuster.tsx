'use client';

import { useEffect } from 'react';

const CURRENT_DEPLOY_VERSION = '20261021_0825';
const VERSION_KEY = 'alafiyah_deploy_ver';

export default function AutoCacheBuster() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkAndEvictCache = async () => {
      try {
        const stored = localStorage.getItem(VERSION_KEY);

        // Perform silent one-time cleanup on version upgrade without reloading the page
        if (stored !== CURRENT_DEPLOY_VERSION) {
          localStorage.setItem(VERSION_KEY, CURRENT_DEPLOY_VERSION);

          // Clear any rogue Service Workers silently
          if ('serviceWorker' in navigator) {
            const regs = await navigator.serviceWorker.getRegistrations();
            for (const r of regs) {
              await r.unregister();
            }
          }

          // Clear all CacheStorage API caches silently
          if ('caches' in window) {
            const keys = await caches.keys();
            for (const k of keys) {
              await caches.delete(k);
            }
          }
        }
      } catch {
        // Silent failure - do not interrupt user experience
      }
    };

    checkAndEvictCache();
  }, []);

  return null;
}
