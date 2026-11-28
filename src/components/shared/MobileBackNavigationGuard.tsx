'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { extractSubdomain } from '@/lib/domain';

type OverlayCloseHandler = () => void;

const activeOverlayStack: Array<{ id: string; stateKey: string; onClose: OverlayCloseHandler }> = [];

/**
 * Helper global untuk mendaftarkan penutupan modal/menu/tab saat tombol Back HP ditekan.
 * Saat `isOpen = true`, fungsi ini menambahkan entry history ringan (`pushState`)
 * dan memasukkan handler ke stack LIFO (Last-In, First-Out).
 * Ketika pengguna menekan tombol Back sistem di HP / APK / PWA,
 * modal, lightbox, menu, atau tab yang paling atas akan tertutup terlebih dahulu
 * tanpa keluar dari halaman atau menutup aplikasi APK.
 */
export function useBackClose(isOpen: boolean, onClose: () => void, id = 'modal') {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen || typeof window === 'undefined') return;

    const stateKey = `__alafiyah_overlay_${id}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    let closedByPopState = false;

    const entry = {
      id,
      stateKey,
      onClose: () => {
        closedByPopState = true;
        onCloseRef.current();
      },
    };

    activeOverlayStack.push(entry);

    try {
      window.history.pushState(
        {
          ...(window.history.state || {}),
          __alafiyah_overlay_active: true,
          [stateKey]: true,
        },
        ''
      );
    } catch {
      // ignore
    }

    return () => {
      const idx = activeOverlayStack.indexOf(entry);
      if (idx !== -1) {
        activeOverlayStack.splice(idx, 1);
      }

      // Jika modal/tab ditutup secara manual lewat tombol X / klik tab lain (bukan tombol Back HP)
      // dan state yang kita push masih berada di puncak history, bersihkan 1 langkah agar tidak menumpuk.
      if (!closedByPopState && typeof window !== 'undefined') {
        try {
          if (window.history.state && window.history.state[stateKey]) {
            (window as any).__alafiyah_ignore_next_popstate = true;
            window.history.back();
            setTimeout(() => {
              (window as any).__alafiyah_ignore_next_popstate = false;
            }, 200);
          }
        } catch {
          // ignore
        }
      }
    };
  }, [isOpen, id]);
}

/**
 * Menentukan halaman induk (parent route) saat tombol Back ditekan pada sub-halaman.
 * Mendukung baik routing berbasis path (/sd/berita, /smp/dokumentasi) maupun
 * subdomain (sdit.alafiyah.id/berita, smpit.alafiyah.id/dokumentasi).
 */
function getParentFallbackPath(pathname: string): string | null {
  if (!pathname) return null;

  const host = typeof window !== 'undefined' ? window.location.host : '';
  const subdomain = extractSubdomain(host);

  // Jika berada di beranda utama (root atau beranda unit), tidak ada parent halaman lagi
  if (pathname === '/' || pathname === '/sd' || pathname === '/smp' || pathname === '/tk') {
    return null;
  }

  // 1. Jika diakses melalui subdomain unit (sdit.alafiyah.id / smpit.alafiyah.id / tkit.alafiyah.id)
  if (subdomain) {
    if (
      pathname.startsWith('/spmb/') ||
      pathname.startsWith(`/${subdomain}/spmb/`)
    ) {
      return '/spmb';
    }
    if (pathname.startsWith('/admin/')) {
      const adminMatch = pathname.match(/^\/admin\/(sd|smp|tk)\/([^/]+)/);
      if (adminMatch) {
        const u = adminMatch[1];
        const sub = adminMatch[2];
        return sub !== 'dashboard' ? `/admin/${u}/dashboard` : '/';
      }
    }
    return '/';
  }

  // 2. Sub-halaman SPMB SD (/sd/spmb/daftar, /sd/spmb/cek-status, /sd/spmb/pengumuman) -> /sd/spmb
  if (pathname.startsWith('/sd/spmb/')) return '/sd/spmb';
  // Halaman dalam SD (/sd/profil, /sd/program, /sd/berita, /sd/dokumentasi, dll) -> /sd
  if (pathname.startsWith('/sd/')) return '/sd';

  // 3. Sub-halaman SPMB SMP (/smp/spmb/daftar, /smp/spmb/cek-status, /smp/spmb/pengumuman) -> /smp/spmb
  if (pathname.startsWith('/smp/spmb/')) return '/smp/spmb';
  // Halaman dalam SMP (/smp/profil, /smp/program, /smp/berita, /smp/dokumentasi, dll) -> /smp
  if (pathname.startsWith('/smp/')) return '/smp';

  // 4. Halaman dalam TK (/tk/*) -> /tk
  if (pathname.startsWith('/tk/')) return '/tk';

  // 5. Sub-halaman clean path tanpa prefix (/spmb/daftar, /berita, /dokumentasi, /profil, dll)
  if (pathname.startsWith('/spmb/')) {
    const activeUnit = typeof window !== 'undefined' ? localStorage.getItem('alafiyah_active_unit') : null;
    if (activeUnit === 'smp') return '/smp/spmb';
    if (activeUnit === 'sd') return '/sd/spmb';
    return '/spmb';
  }

  // 6. Halaman dalam Admin Unit (/admin/sd/cms, /admin/sd/news, dll) -> /admin/sd/dashboard
  const adminUnitMatch = pathname.match(/^\/admin\/(sd|smp|tk)\/([^/]+)/);
  if (adminUnitMatch) {
    const unit = adminUnitMatch[1];
    const sub = adminUnitMatch[2];
    if (sub !== 'dashboard') {
      return `/admin/${unit}/dashboard`;
    }
    return `/${unit}`;
  }

  // 7. Halaman dalam Admin Yayasan (/admin/foundation/cms, dll) -> /admin/foundation
  if (pathname.startsWith('/admin/foundation/')) return '/admin/foundation';

  // 8. Halaman umum atau Affiliate / Login / Portal / Berita / Dokumentasi -> kembali ke beranda unit aktif
  if (typeof window !== 'undefined') {
    const unit = localStorage.getItem('alafiyah_active_unit');
    if (unit === 'smp') return '/smp';
    if (unit === 'tk') return '/tk';
    if (unit === 'sd') return '/sd';
  }

  return '/sd';
}

/**
 * Penjaga Navigasi Tombol Back Sistem HP / PWA / APK.
 * Memastikan:
 * 1. Jika ada modal, foto lightbox, drawer menu, atau tab kategori yang sedang aktif,
 *    tombol Back HP menutup/meresetnya satu per satu (LIFO) tanpa meninggalkan halaman.
 * 2. Di beranda maupun sub-halaman (/sd/berita, /sd/dokumentasi, /smp/berita, /smp/dokumentasi, dll),
 *    selalu terdapat history bumper (`pushState`) sehingga menekan tombol Back HP tidak pernah
 *    langsung melempar pengguna keluar dari aplikasi APK/PWA.
 */
export default function MobileBackNavigationGuard() {
  const pathname = usePathname();
  const router = useRouter();
  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;

  // Pastikan setiap kali halaman dibuka atau berganti route, ada history bumper pengaman
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ensureHistoryBumper = () => {
      try {
        const currentState = window.history.state || {};
        if (!currentState.__alafiyah_page_bumper && !currentState.__alafiyah_overlay_active) {
          window.history.pushState(
            {
              ...currentState,
              __alafiyah_page_bumper: true,
              __alafiyah_path: window.location.pathname,
            },
            ''
          );
        }
      } catch {
        // ignore
      }
    };

    ensureHistoryBumper();
  }, [pathname]);

  // Satu listener popstate global untuk menangani stack modal/tab & fallback halaman induk
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleGlobalPopState = () => {
      // 1. Jika popstate ini dipicu oleh penutupan manual tombol X (history.back sintetis), abaikan
      if ((window as any).__alafiyah_ignore_next_popstate) {
        (window as any).__alafiyah_ignore_next_popstate = false;
        return;
      }

      // 2. Jika ada modal, foto dokumentasi, detail berita, menu, atau tab kategori yang sedang aktif,
      //    tutup item paling atas di stack terlebih dahulu!
      if (activeOverlayStack.length > 0) {
        const topOverlay = activeOverlayStack.pop();
        if (topOverlay) {
          topOverlay.onClose();
        }
        return;
      }

      // 3. Jika tidak ada modal/tab terbuka dan pengguna menekan Back pada sub-halaman
      //    (misal /sd/berita, /sd/dokumentasi, /smp/berita, /smp/dokumentasi),
      //    pastikan kembali ke halaman induk/beranda unit dan tidak keluar dari APK.
      const currentPath = pathnameRef.current || window.location.pathname;
      const parentPath = getParentFallbackPath(currentPath);

      if (parentPath) {
        // Pasang kembali bumper sebelum pindah ke parent agar di halaman parent pun tidak langsung keluar APK
        try {
          window.history.pushState(
            { ...(window.history.state || {}), __alafiyah_page_bumper: true },
            ''
          );
        } catch {
          // ignore
        }
        router.push(parentPath);
      } else {
        // Jika sudah di beranda utama (/sd, /smp, atau /), tahan sekali dengan bumper agar tidak tidak sengaja keluar APK
        try {
          const st = window.history.state || {};
          if (!st.__alafiyah_home_bumper_used) {
            window.history.pushState(
              { ...st, __alafiyah_page_bumper: true, __alafiyah_home_bumper_used: true },
              ''
            );
          }
        } catch {
          // ignore
        }
      }
    };

    window.addEventListener('popstate', handleGlobalPopState);
    return () => {
      window.removeEventListener('popstate', handleGlobalPopState);
    };
  }, [router]);

  return null;
}
