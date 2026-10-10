'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export const UNIT_THEME_COLORS = {
  smp: '#030164',        // SMP IT Deep Navy
  sd: '#00A651',         // SDIT Emerald Green
  tk: '#0284c7',         // TK IT Sky Blue
  foundation: '#184F48', // Yayasan Forest Green
  yayasan: '#184F48',
};

export function getActiveUnitColor(
  pathname: string,
  searchParams?: URLSearchParams | null,
  host?: string
): string {
  // 1. Hostname detection (smpit.alafiyah.id, tkit.alafiyah.id, sdit.alafiyah.id, etc.)
  const currentHost = host || (typeof window !== 'undefined' ? window.location.host : '');
  if (currentHost.includes('smpit.') || currentHost.startsWith('smp.')) return UNIT_THEME_COLORS.smp;
  if (currentHost.includes('tkit.') || currentHost.startsWith('tk.')) return UNIT_THEME_COLORS.tk;
  if (currentHost.includes('sdit.') || currentHost.startsWith('sd.')) return UNIT_THEME_COLORS.sd;

  // 2. Query parameter detection (?unit=smp, ?school=smp)
  const unitParam = searchParams?.get('unit') || searchParams?.get('school');
  if (unitParam === 'smp') return UNIT_THEME_COLORS.smp;
  if (unitParam === 'tk') return UNIT_THEME_COLORS.tk;
  if (unitParam === 'sd') return UNIT_THEME_COLORS.sd;
  if (unitParam === 'yayasan' || unitParam === 'foundation') return UNIT_THEME_COLORS.foundation;

  // 3. Pathname detection (/smp, /admin/smp, etc.)
  if (pathname.startsWith('/smp') || pathname.startsWith('/admin/smp')) return UNIT_THEME_COLORS.smp;
  if (pathname.startsWith('/tk') || pathname.startsWith('/admin/tk')) return UNIT_THEME_COLORS.tk;
  if (pathname.startsWith('/sd') || pathname.startsWith('/admin/sd')) return UNIT_THEME_COLORS.sd;
  if (pathname.startsWith('/admin/foundation')) return UNIT_THEME_COLORS.foundation;

  // Default fallback for root / general portal
  return UNIT_THEME_COLORS.sd;
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

export default function DynamicUnitThemeColorSync() {
  const pathname = usePathname();

  useEffect(() => {
    const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const targetColor = getActiveUnitColor(pathname, searchParams);
    applyThemeColorToDocument(targetColor);
  }, [pathname]);

  return null;
}
