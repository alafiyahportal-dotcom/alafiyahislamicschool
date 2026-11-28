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
      // Jangan pernah memanggil window.history.back() di sini saat modal/menu ditutup!
      // Karena bila pengguna menutup menu dengan mengklik link navigasi (misal tombol LOGIN,
      // Beranda, atau Daftar SPMB), memanggil window.history.back() akan membatalkan
      // perpindahan halaman Next.js dan melempar pengguna kembali ke halaman sebelumnya!
    };
  }, [isOpen, id]);
}

/**
 * Menentukan halaman induk (parent route) saat tombol Back ditekan pada sub-halaman.
 */
function getParentFallbackPath(pathname: string): string | null {
  if (!pathname) return null;

  const host = typeof window !== 'undefined' ? window.location.host : '';
  const subdomain = extractSubdomain(host);

  // Jangan pasang bumper otomatis di beranda utama atau halaman login agar navigasi masuk/keluar selalu instan
  if (
    pathname === '/' ||
    pathname === '/sd' ||
    pathname === '/smp' ||
    pathname === '/tk' ||
    pathname === '/login' ||
    pathname.startsWith('/admin')
  ) {
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

  return null;
}

/**
 * Penjaga Navigasi Tombol Back Sistem HP / PWA / APK.
 * Memastikan:
 * 1. Jika ada modal, foto lightbox, drawer menu, atau tab kategori yang sedang aktif,
 *    tombol Back HP menutup/meresetnya satu per satu (LIFO) tanpa meninggalkan halaman.
 * 2. Jika pengguna membuka aplikasi langsung ke sub-halaman (ketika history.length <= 2),
 *    dipasang 1 bumper agar tombol Back kembali ke beranda unit dan tidak langsung keluar APK.
 *    Namun jika pengguna sudah bernavigasi normal dari Beranda -> Sub-halaman,
 *    navigasi Next.js tidak diganggu sama sekali agar perpindahan ke Beranda atau Login selalu mulus.
 */
export default function MobileBackNavigationGuard() {
  const pathname = usePathname();
  const router = useRouter();
  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;

  // Bersihkan stack overlay saat berpindah halaman (route change)
  useEffect(() => {
    activeOverlayStack.length = 0;

    if (typeof window === 'undefined') return;
    const parentPath = getParentFallbackPath(pathname);

    // Hanya pasang bumper bila pengguna mendarat langsung di sub-halaman dengan history tipis (misal baru buka APK)
    if (parentPath && window.history.length <= 2) {
      try {
        const currentState = window.history.state || {};
        if (!currentState.__alafiyah_direct_bumper) {
          window.history.pushState(
            { ...currentState, __alafiyah_direct_bumper: true },
            ''
          );
        }
      } catch {
        // ignore
      }
    }
  }, [pathname]);

  // Satu listener popstate global untuk menangani stack modal/tab
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleGlobalPopState = () => {
      if ((window as any).__alafiyah_ignore_next_popstate) {
        (window as any).__alafiyah_ignore_next_popstate = false;
        return;
      }

      // Jika ada modal, foto dokumentasi, detail berita, menu, atau tab kategori yang sedang aktif,
      // tutup item paling atas di stack terlebih dahulu!
      if (activeOverlayStack.length > 0) {
        const topOverlay = activeOverlayStack.pop();
        if (topOverlay) {
          topOverlay.onClose();
        }
        return;
      }

      // Jika mendarat langsung di sub-halaman dan history habis, arahkan ke beranda induk
      const currentPath = pathnameRef.current || window.location.pathname;
      const parentPath = getParentFallbackPath(currentPath);
      if (parentPath && window.history.length <= 2) {
        router.push(parentPath);
      }
    };

    window.addEventListener('popstate', handleGlobalPopState);
    return () => {
      window.removeEventListener('popstate', handleGlobalPopState);
    };
  }, [router]);

  return null;
}
