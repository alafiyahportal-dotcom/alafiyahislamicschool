'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export const UNIT_THEME_COLORS = {
  smp: '#030164',        // SMP IT Deep Navy
  sd: '#064E3B',         // SDIT Deep Forest Green Identity (Pekat)
  tk: '#0284c7',         // TK IT Sky Blue
  foundation: '#064E3B', // Yayasan Deep Forest Green
  yayasan: '#064E3B',
};

export type ActiveUnitType = 'smp' | 'sd' | 'tk' | 'yayasan';

/**
 * Intelligent detector for active school unit across URL, query param, domain,
 * document referrer, and user-persisted preference in localStorage/cookies.
 */
export function detectActiveUnit(
  pathname: string,
  searchParams?: URLSearchParams | null,
  host?: string
): ActiveUnitType {
  // 1. Query parameter detection (?unit=smp, ?school=smp)
  const unitParam = searchParams?.get('unit') || searchParams?.get('school');
  if (unitParam === 'smp' || unitParam === 'sd' || unitParam === 'tk' || unitParam === 'yayasan' || unitParam === 'foundation') {
    const resolved = unitParam === 'foundation' ? 'yayasan' : (unitParam as ActiveUnitType);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('alafiyah_active_unit', resolved);
        document.cookie = `alafiyah_active_unit=${resolved}; path=/; max-age=2592000; SameSite=Lax`;
      } catch {}
    }
    return resolved;
  }

  // 2. Subdomain detection (smpit.alafiyah.id, sdit.alafiyah.id, etc.)
  const currentHost = host || (typeof window !== 'undefined' ? window.location.host : '');
  if (currentHost.includes('smpit.') || currentHost.startsWith('smp.')) {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('alafiyah_active_unit', 'smp');
        document.cookie = 'alafiyah_active_unit=smp; path=/; max-age=2592000; SameSite=Lax';
      } catch {}
    }
    return 'smp';
  }
  if (currentHost.includes('tkit.') || currentHost.startsWith('tk.')) return 'tk';
  if (currentHost.includes('sdit.') || currentHost.startsWith('sd.')) {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('alafiyah_active_unit', 'sd');
        document.cookie = 'alafiyah_active_unit=sd; path=/; max-age=2592000; SameSite=Lax';
      } catch {}
    }
    return 'sd';
  }

  // 3. Pathname detection (/smp, /admin/smp, etc.)
  if (pathname.startsWith('/smp') || pathname.startsWith('/admin/smp')) {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('alafiyah_active_unit', 'smp');
        document.cookie = 'alafiyah_active_unit=smp; path=/; max-age=2592000; SameSite=Lax';
      } catch {}
    }
    return 'smp';
  }
  if (pathname.startsWith('/sd') || pathname.startsWith('/admin/sd')) {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('alafiyah_active_unit', 'sd');
        document.cookie = 'alafiyah_active_unit=sd; path=/; max-age=2592000; SameSite=Lax';
      } catch {}
    }
    return 'sd';
  }
  if (pathname.startsWith('/tk') || pathname.startsWith('/admin/tk')) return 'tk';
  if (pathname.startsWith('/admin/foundation')) return 'yayasan';

  // 4. Document Referrer check (e.g. user navigated from /smp to /affiliate/register or /login)
  if (typeof document !== 'undefined' && document.referrer) {
    try {
      const refUrl = new URL(document.referrer);
      if (refUrl.pathname.startsWith('/smp') || refUrl.host.includes('smp')) {
        localStorage.setItem('alafiyah_active_unit', 'smp');
        document.cookie = 'alafiyah_active_unit=smp; path=/; max-age=2592000; SameSite=Lax';
        return 'smp';
      }
      if (refUrl.pathname.startsWith('/sd') || refUrl.host.includes('sd')) {
        localStorage.setItem('alafiyah_active_unit', 'sd');
        document.cookie = 'alafiyah_active_unit=sd; path=/; max-age=2592000; SameSite=Lax';
        return 'sd';
      }
    } catch {}
  }

  // 5. User-persisted preference in localStorage / cookies
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('alafiyah_active_unit');
      if (stored === 'smp' || stored === 'sd' || stored === 'tk') {
        return stored as ActiveUnitType;
      }
    } catch {}
  }

  return 'sd';
}

export function getActiveUnitColor(
  pathname: string,
  searchParams?: URLSearchParams | null,
  host?: string
): string {
  const unit = detectActiveUnit(pathname, searchParams, host);
  return UNIT_THEME_COLORS[unit] || UNIT_THEME_COLORS.sd;
}

export function applyThemeColorToDocument(targetColor: string) {
  if (typeof document === 'undefined') return;

  // 1. Update or create standard meta[name="theme-color"]
  let themeMeta = document.querySelector('meta[name="theme-color"]:not([media])');
  if (!themeMeta) {
    themeMeta = document.createElement('meta');
    themeMeta.setAttribute('name', 'theme-color');
    document.head.appendChild(themeMeta);
  }
  themeMeta.setAttribute('content', targetColor);

  // 2. Update media-specific theme-color tags (prefers-color-scheme)
  const mediaThemeMetas = document.querySelectorAll('meta[name="theme-color"][media]');
  mediaThemeMetas.forEach((meta) => {
    meta.setAttribute('content', targetColor);
  });

  // 3. Apple mobile status bar
  let appleMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
  if (!appleMeta) {
    appleMeta = document.createElement('meta');
    appleMeta.setAttribute('name', 'apple-mobile-web-app-status-bar-style');
    document.head.appendChild(appleMeta);
  }
  appleMeta.setAttribute('content', 'default');

  // 4. Windows phone / IE navbutton
  let msMeta = document.querySelector('meta[name="msapplication-navbutton-color"]');
  if (!msMeta) {
    msMeta = document.createElement('meta');
    msMeta.setAttribute('name', 'msapplication-navbutton-color');
    document.head.appendChild(msMeta);
  }
  msMeta.setAttribute('content', targetColor);
}

/**
 * Synchronizes PWA Manifest, Apple Touch Icons, and Browser Favicons
 * to guarantee that mobile "Add to Home Screen" uses the exact matching unit logo.
 */
export function applyPwaIdentityToDocument(
  unit: ActiveUnitType,
  pathname: string = ''
) {
  if (typeof document === 'undefined') return;

  const isAffiliate = pathname.startsWith('/affiliate');
  const isLogin = pathname.startsWith('/login');

  let manifestUrl = '/manifest.json';
  let appTitle = 'Al-Afiyah';
  let iconUrl = '/icons/icon-192.png';
  let themeColor = UNIT_THEME_COLORS[unit] || UNIT_THEME_COLORS.sd;

  if (unit === 'smp') {
    iconUrl = '/icons/smp-192.png';
    themeColor = UNIT_THEME_COLORS.smp;
    if (isAffiliate) {
      manifestUrl = '/affiliate-smp-manifest.json';
      appTitle = 'Dashboard Afiliasi Al-Afiyah';
    } else if (isLogin) {
      manifestUrl = '/login-smp-manifest.json';
      appTitle = 'Login SMP IT';
    } else {
      manifestUrl = '/smp-manifest.json';
      appTitle = 'SMP IT Al-Afiyah';
    }
  } else if (unit === 'sd') {
    iconUrl = '/icons/sd-192.png';
    themeColor = UNIT_THEME_COLORS.sd;
    if (isAffiliate) {
      manifestUrl = '/affiliate-sd-manifest.json';
      appTitle = 'Dashboard Afiliasi Al-Afiyah';
    } else if (isLogin) {
      manifestUrl = '/login-sd-manifest.json';
      appTitle = 'Login SDIT';
    } else {
      manifestUrl = '/sd-manifest.json';
      appTitle = 'SDIT Al-Afiyah';
    }
  }

  // 1. Synchronize Web App Manifest
  let manifestLink = document.querySelector<HTMLLinkElement>("link[rel='manifest']");
  if (!manifestLink) {
    manifestLink = document.createElement('link');
    manifestLink.rel = 'manifest';
    document.head.appendChild(manifestLink);
  }
  manifestLink.href = manifestUrl;

  // 2. Synchronize Apple Touch Icon (Primary target for iOS "Add to Home Screen")
  const appleTouchIcons = document.querySelectorAll<HTMLLinkElement>(
    "link[rel='apple-touch-icon'], link[rel='apple-touch-icon-precomposed']"
  );
  if (appleTouchIcons.length === 0) {
    const appleLink = document.createElement('link');
    appleLink.rel = 'apple-touch-icon';
    appleLink.href = iconUrl;
    document.head.appendChild(appleLink);
  } else {
    appleTouchIcons.forEach((el) => {
      el.href = iconUrl;
    });
  }

  // 3. Synchronize Tab Favicons
  const standardIcons = document.querySelectorAll<HTMLLinkElement>(
    "link[rel='icon'], link[rel='shortcut icon']"
  );
  standardIcons.forEach((el) => {
    el.href = iconUrl;
  });

  // 4. Synchronize App Titles for Home Screen
  let appleTitleMeta = document.querySelector<HTMLMetaElement>('meta[name="apple-mobile-web-app-title"]');
  if (!appleTitleMeta) {
    appleTitleMeta = document.createElement('meta');
    appleTitleMeta.name = 'apple-mobile-web-app-title';
    document.head.appendChild(appleTitleMeta);
  }
  appleTitleMeta.content = appTitle;

  let appNameMeta = document.querySelector<HTMLMetaElement>('meta[name="application-name"]');
  if (!appNameMeta) {
    appNameMeta = document.createElement('meta');
    appNameMeta.name = 'application-name';
    document.head.appendChild(appNameMeta);
  }
  appNameMeta.content = appTitle;

  // 5. Synchronize Theme Colors
  applyThemeColorToDocument(themeColor);
}

export default function DynamicUnitThemeColorSync() {
  const pathname = usePathname();

  useEffect(() => {
    const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const activeUnit = detectActiveUnit(pathname, searchParams);
    applyPwaIdentityToDocument(activeUnit, pathname);
  }, [pathname]);

  return null;
}
