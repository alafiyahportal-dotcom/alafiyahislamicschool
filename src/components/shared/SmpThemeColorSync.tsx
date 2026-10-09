'use client';

import { useEffect } from 'react';

/**
 * Ensures the mobile browser address bar / notch (theme-color)
 * uses SMP IT's Deep Navy (#030164) instead of SDIT's Emerald (#059669).
 */
export default function SmpThemeColorSync() {
  useEffect(() => {
    const navyColor = '#030164';

    // 1. Update or create meta[name="theme-color"]
    let themeMeta = document.querySelector('meta[name="theme-color"]');
    if (!themeMeta) {
      themeMeta = document.createElement('meta');
      themeMeta.setAttribute('name', 'theme-color');
      document.head.appendChild(themeMeta);
    }
    themeMeta.setAttribute('content', navyColor);

    // 2. Apple status bar
    let appleMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    if (appleMeta) {
      appleMeta.setAttribute('content', navyColor);
    }

    // 3. Cleanup when leaving SMP section (optional, fallback to root if navigated out)
    return () => {
      // Keep or let root handle
    };
  }, []);

  return null;
}
