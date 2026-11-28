'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';

/**
 * Helper global untuk mendaftarkan penutupan modal/menu saat tombol Back HP ditekan.
 * Saat `isOpen = true`, fungsi ini menambahkan entry history ringan (`pushState`)
 * sehingga ketika pengguna menekan tombol Back sistem di HP / APK / PWA,
 * modal atau menu yang terbuka akan tertutup lebih dulu tanpa keluar dari aplikasi.
 */
export function useBackClose(isOpen: boolean, onClose: () => void, id = 'modal') {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen || typeof window === 'undefined') return;

    const stateKey = `__alafiyah_overlay_${id}_${Date.now()}`;
    let closedByPopState = false;

    try {
      window.history.pushState({ ...(window.history.state || {}), [stateKey]: true }, '');
    } catch {
      // ignore
    }

    const handlePopState = () => {
      closedByPopState = true;
      (window as any).__alafiyah_overlay_handled_popstate = true;
      onCloseRef.current();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      // Jika modal ditutup lewat tombol X (bukan tombol Back HP) dan state kita masih di paling atas,
      // bersihkan entry history tambahan agar tidak menumpuk.
      if (!closedByPopState && typeof window !== 'undefined') {
        try {
          if (window.history.state && window.history.state[stateKey]) {
            (window as any).__alafiyah_overlay_handled_popstate = true;
            window.history.back();
            setTimeout(() => {
              (window as any).__alafiyah_overlay_handled_popstate = false;
            }, 150);
          }
        } catch {
          // ignore
        }
      }
    };
  }, [isOpen, id]);
}

function getParentFallbackPath(pathname: string): string | null {
  if (!pathname || pathname === '/' || pathname === '/sd' || pathname === '/smp' || pathname === '/tk') {
    return null;
  }

  // Sub-halaman SPMB SD (/sd/spmb/daftar, /sd/spmb/cek-status, /sd/spmb/pengumuman) -> /sd/spmb
  if (pathname.startsWith('/sd/spmb/')) return '/sd/spmb';
  // Halaman dalam SD (/sd/profil, /sd/program, /sd/berita, dll) -> /sd
  if (pathname.startsWith('/sd/')) return '/sd';

  // Sub-halaman SPMB SMP (/smp/spmb/daftar, /smp/spmb/cek-status, /smp/spmb/pengumuman) -> /smp/spmb
  if (pathname.startsWith('/smp/spmb/')) return '/smp/spmb';
  // Halaman dalam SMP (/smp/profil, /smp/program, /smp/berita, dll) -> /smp
  if (pathname.startsWith('/smp/')) return '/smp';

  // Halaman dalam Admin Unit (/admin/sd/cms, /admin/sd/news, dll) -> /admin/sd/dashboard
  const adminUnitMatch = pathname.match(/^\/admin\/(sd|smp|tk)\/([^/]+)/);
  if (adminUnitMatch) {
    const unit = adminUnitMatch[1];
    const sub = adminUnitMatch[2];
    if (sub !== 'dashboard') {
      return `/admin/${unit}/dashboard`;
    }
    return `/${unit}`;
  }

  // Halaman dalam Admin Yayasan (/admin/foundation/cms, dll) -> /admin/foundation
  if (pathname.startsWith('/admin/foundation/')) return '/admin/foundation';

  // Halaman Affiliate (/affiliate/register, /affiliate/dashboard) -> kembali ke unit aktif
  if (pathname.startsWith('/affiliate') || pathname.startsWith('/login') || pathname.startsWith('/portal')) {
    if (typeof window !== 'undefined') {
      const unit = localStorage.getItem('alafiyah_active_unit');
      if (unit === 'smp') return '/smp';
    }
    return '/sd';
  }

  return '/sd';
}

/**
 * Penjaga Navigasi Tombol Back Sistem HP / PWA / APK.
 * Memastikan:
 * 1. Saat pengguna membuka sub-halaman atau tab langsung di PWA/APK (di mana history stack tipis),
 *    menekan tombol Back fisik di HP akan mengarahkan kembali ke halaman induk / beranda unit,
 *    bukan langsung menutup / keluar dari APK.
 */
export default function MobileBackNavigationGuard() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const fallbackPath = getParentFallbackPath(pathname);
    if (!fallbackPath) return;

    // Pasang bumper state di halaman sub-route bila belum ada agar tombol Back HP tertangkap di dalam aplikasi
    const currentState = window.history.state || {};
    if (!currentState.__alafiyah_subpage_guard) {
      try {
        window.history.pushState(
          { ...currentState, __alafiyah_subpage_guard: true, __alafiyah_path: pathname },
          ''
        );
      } catch {
        // ignore
      }
    }

    const handlePopState = () => {
      // Jika ada modal/overlay yang baru saja menangkap popstate, jangan navigasi halaman
      if ((window as any).__alafiyah_overlay_handled_popstate) {
        (window as any).__alafiyah_overlay_handled_popstate = false;
        return;
      }

      // Jika pengguna menekan Back dari sub-halaman dan history kembali ke bumper awal,
      // arahkan secara mulus ke halaman induk/beranda agar tidak keluar dari APK.
      const parent = getParentFallbackPath(pathname);
      if (parent && window.location.pathname === pathname) {
        router.push(parent);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [pathname, router]);

  return null;
}
