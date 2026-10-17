'use client';

import React, { useEffect, useState } from 'react';

/**
 * Launch splash for installed PWA (home-screen app).
 *
 * Android/iOS show their own splash (unit color + icon) while the app starts.
 * This overlay provides a smooth fade-out into the app ONLY ONCE per app launch session.
 * Subsequent navigations (e.g. after login, switching pages, or entering beranda)
 * NEVER replay the splash or flicker back to the logo screen.
 */
interface LaunchSplashProps {
  background: string;
  logoSrc: string;
  logoAlt: string;
}

export const PWA_SPLASH_SESSION_KEY = 'alafiyah_pwa_splash_seen';

export default function LaunchSplash({ background, logoSrc, logoAlt }: LaunchSplashProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(PWA_SPLASH_SESSION_KEY)) {
        setVisible(false);
        return;
      }
      sessionStorage.setItem(PWA_SPLASH_SESSION_KEY, '1');
      const timer = setTimeout(() => {
        setVisible(false);
      }, 950);
      return () => clearTimeout(timer);
    } catch {
      setVisible(false);
    }
  }, []);

  if (!visible) return null;

  return (
    <div
      id="pwa-launch-splash"
      className="launch-splash"
      style={{ backgroundColor: background }}
      aria-hidden="true"
    >
      <script
        dangerouslySetInnerHTML={{
          __html: `
            try {
              if (sessionStorage.getItem('${PWA_SPLASH_SESSION_KEY}')) {
                var el = document.getElementById('pwa-launch-splash');
                if (el) el.style.display = 'none';
              }
            } catch(e) {}
          `,
        }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element -- must paint instantly, no lazy/optimizer */}
      <img src={logoSrc} alt={logoAlt} width={120} height={120} decoding="sync" fetchPriority="high" />
    </div>
  );
}
