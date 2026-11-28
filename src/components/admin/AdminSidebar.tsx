'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useBackClose } from '@/components/shared/MobileBackNavigationGuard';
import {
  LayoutDashboard,
  Users,
  FileEdit,
  Share2,
  Building2,
  LogOut,
  ChevronDown,
  ExternalLink,
  School,
  Wallet,
  ClipboardCheck,
  MessageSquare,
  UserCheck,
  Newspaper,
  Settings,
  BarChart3,
  Radio,
  Shirt,
  GraduationCap,
  HelpCircle,
  FolderArchive,
  Award,
  X,
  CalendarDays,
  BookMarked,
  ScrollText
} from 'lucide-react';

interface AdminSidebarProps {
  currentRole?: string;
  userName?: string;
  schoolSlug?: 'tk' | 'sd' | 'smp' | 'foundation';
  schoolName?: string;
}

export default function AdminSidebar({
  currentRole = 'SUPERADMIN',
  userName = 'Administrator',
  schoolSlug: initialSchoolSlug = 'foundation',
  schoolName = 'Yayasan Pendidikan Imam Bonjol'
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useBackClose(isMobileOpen, () => setIsMobileOpen(false), 'admin-mobile-sidebar');

  // Auto-detect schoolSlug from route pathname to ensure 100% accurate branding
  const schoolSlug = (() => {
    if (pathname.startsWith('/admin/smp')) return 'smp';
    if (pathname.startsWith('/admin/sd')) return 'sd';
    if (pathname.startsWith('/admin/tk')) return 'tk';
    return initialSchoolSlug;
  })();

  useEffect(() => {
    const handleToggle = () => setIsMobileOpen((prev) => !prev);
    const handleClose = () => setIsMobileOpen(false);

    window.addEventListener('toggle-admin-sidebar', handleToggle);
    window.addEventListener('close-admin-sidebar', handleClose);
    return () => {
      window.removeEventListener('toggle-admin-sidebar', handleToggle);
      window.removeEventListener('close-admin-sidebar', handleClose);
    };
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Dynamically synchronize browser tab title & favicon based on active unit
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const unitTitle =
        schoolSlug === 'sd'
          ? 'Admin SDIT Al-Afiyah'
          : schoolSlug === 'tk'
          ? 'Admin TK IT Al-Afiyah'
          : schoolSlug === 'smp'
          ? 'Admin SMP IT Al-Afiyah'
          : 'Super Admin | Yayasan Pendidikan Imam Bonjol';

      let pageContext = '';
      if (pathname.includes('/cms')) pageContext = 'Editor Konten CMS';
      else if (pathname.includes('/ppdb')) pageContext = 'Pendaftar SPMB';
      else if (pathname.includes('/students')) pageContext = 'Buku Induk Murid';
      else if (pathname.includes('/achievements')) pageContext = 'Prestasi Murid';
      else if (pathname.includes('/re-registration')) pageContext = 'Daftar Ulang & Seragam';
      else if (pathname.includes('/analytics')) pageContext = 'Analitik & Corong';
      else if (pathname.includes('/finance')) pageContext = 'Kas & Tagihan';
      else if (pathname.includes('/teachers')) pageContext = 'Dewan Guru';
      else if (pathname.includes('/news')) pageContext = 'Berita & Kegiatan';
      else if (pathname.includes('/broadcast')) pageContext = 'WhatsApp Broadcast';
      else if (pathname.includes('/attendance')) pageContext = 'Presensi Murid';
      else if (pathname.includes('/grades')) pageContext = 'Nilai & Rapor';
      else if (pathname.includes('/tahfidz')) pageContext = "Mutaba'ah Tahfidz";
      else if (pathname.includes('/settings')) pageContext = 'Pengaturan Unit';
      else if (pathname.includes('/dashboard')) pageContext = 'Dashboard';

      document.title = pageContext ? `${pageContext} | ${unitTitle}` : `${unitTitle} Majalengka`;

      const iconHref =
        schoolSlug === 'smp'
          ? '/images/smp-logo.png?v=2'
          : schoolSlug === 'sd'
          ? '/images/sd-logo.png?v=2'
          : '/images/ypib-logo.png?v=2';
      const iconLinks = document.querySelectorAll<HTMLLinkElement>("link[rel*='icon']");
      if (iconLinks.length === 0) {
        const newLink = document.createElement('link');
        newLink.rel = 'icon';
        newLink.href = iconHref;
        document.getElementsByTagName('head')[0].appendChild(newLink);
      } else {
        iconLinks.forEach((l) => {
          l.href = iconHref;
        });
      }
    }
  }, [schoolSlug, pathname]);

  // Lock body scroll on mobile when drawer is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/session', { method: 'DELETE' });
    } catch {
      // fallback
    }
    document.cookie = 'alafiyah_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    router.push('/login');
  };

  const isFoundation = schoolSlug === 'foundation';

  // Define nav items strictly scoped to role & tenant - prioritized by operational access
  const navItems = [
    {
      name: 'Dashboard',
      href: schoolSlug === 'foundation' ? '/admin/foundation' : `/admin/${schoolSlug}/dashboard`,
      icon: LayoutDashboard,
      active: pathname === '/admin/foundation' || pathname === `/admin/${schoolSlug}/dashboard`
    },
    {
      name: 'Pendaftar SPMB',
      href: schoolSlug === 'foundation' ? '/admin/foundation#pendaftar' : `/admin/${schoolSlug}/ppdb`,
      icon: ClipboardCheck,
      active: pathname.includes('/ppdb') || (schoolSlug === 'foundation' && pathname === '/admin/foundation'),
      badge: 'Baru'
    },
    {
      name: 'Kas & Tagihan',
      href: schoolSlug === 'foundation' ? '/admin/foundation/finance' : `/admin/${schoolSlug}/finance`,
      icon: Wallet,
      active: pathname.endsWith('/finance')
    },
    {
      name: 'Affiliate Al-Afiyah',
      href: schoolSlug === 'foundation' ? '/admin/foundation/affiliates' : `/admin/${schoolSlug}/affiliates`,
      icon: Share2,
      active: pathname.includes('/affiliate')
    },
    {
      name: 'Editor Konten CMS',
      href: schoolSlug === 'foundation' ? '/admin/foundation/cms' : `/admin/${schoolSlug}/cms`,
      icon: FileEdit,
      active: pathname.endsWith('/cms')
    },
    {
      name: 'Buku Induk Murid',
      href: schoolSlug === 'foundation' ? '/admin/foundation/students' : `/admin/${schoolSlug}/students`,
      icon: GraduationCap,
      active: pathname.endsWith('/students'),
      sectionLabel: 'Akademik & Siswa'
    },
    {
      name: 'Daftar Ulang & Seragam',
      href: schoolSlug === 'foundation' ? '/admin/foundation/re-registration' : `/admin/${schoolSlug}/re-registration`,
      icon: Shirt,
      active: pathname.endsWith('/re-registration')
    },
    {
      name: 'Dewan Guru',
      href: schoolSlug === 'foundation' ? '/admin/foundation/users' : `/admin/${schoolSlug}/teachers`,
      icon: UserCheck,
      active: pathname.endsWith('/teachers') || (schoolSlug === 'foundation' && pathname.endsWith('/users'))
    },
    {
      name: 'Prestasi Murid',
      href: schoolSlug === 'foundation' ? '/admin/foundation/achievements' : `/admin/${schoolSlug}/achievements`,
      icon: Award,
      active: pathname.endsWith('/achievements')
    },
    {
      name: 'Kabar & Artikel Blog',
      href: schoolSlug === 'foundation' ? '/admin/foundation/cms' : `/admin/${schoolSlug}/news`,
      icon: Newspaper,
      active: pathname.endsWith('/news'),
      sectionLabel: 'Komunikasi & Publikasi'
    },
    {
      name: 'Pusat WhatsApp & Log',
      href: schoolSlug === 'foundation' ? '/admin/foundation/broadcast' : `/admin/${schoolSlug}/broadcast`,
      icon: Radio,
      active: pathname.endsWith('/broadcast') || pathname.endsWith('/notifications')
    },
    // SIAKAD Features (Presensi, Nilai & Rapor, Tahfidz) disembunyikan sementara sesuai instruksi.
    ...((!isFoundation && false)
      ? [
          {
            name: 'Presensi Murid',
            href: `/admin/${schoolSlug}/attendance`,
            icon: CalendarDays,
            active: pathname.endsWith('/attendance'),
            sectionLabel: 'SIAKAD — Akademik'
          },
          {
            name: 'Nilai & Rapor',
            href: `/admin/${schoolSlug}/grades`,
            icon: BookMarked,
            active: pathname.endsWith('/grades')
          },
          {
            name: 'Mutaba\'ah Tahfidz',
            href: `/admin/${schoolSlug}/tahfidz`,
            icon: ScrollText,
            active: pathname.endsWith('/tahfidz')
          }
        ]
      : []),
    {
      name: 'Analitik & Corong',
      href: schoolSlug === 'foundation' ? '/admin/foundation/analytics' : `/admin/${schoolSlug}/analytics`,
      icon: BarChart3,
      active: pathname.endsWith('/analytics'),
      sectionLabel: 'Sistem & Pengaturan'
    },
    {
      name: isFoundation ? 'Pengaturan Yayasan' : 'Pengaturan Unit',
      href: schoolSlug === 'foundation' ? '/admin/foundation/settings' : `/admin/${schoolSlug}/settings`,
      icon: Settings,
      active: pathname.endsWith('/settings')
    }
  ];

  // Dynamic color palette per school unit for active links, hover states, and indicators
  const isSmp = schoolSlug === 'smp';
  const isTk = schoolSlug === 'tk';
  const isSd = schoolSlug === 'sd';

  const sidebarTheme = isSmp
    ? {
        headerBg: 'bg-[#030164] border-b-2 border-[#ffd51e] text-white',
        activeText: 'text-[#030164] font-extrabold',
        activeBg: 'bg-[#FAF6EC]',
        activeBar: 'bg-[#030164]',
        activeIcon: 'text-[#030164]',
        hoverClass: 'hover:text-[#030164] hover:bg-slate-50',
        badgeClass: 'bg-[#030164] text-[#ffd51e]',
        selectFocus: 'focus:border-[#030164]',
      }
    : isTk
    ? {
        headerBg: 'bg-[#0284c7] border-b-2 border-[#e5a93b] text-white',
        activeText: 'text-[#0284c7] font-extrabold',
        activeBg: 'bg-sky-50/90',
        activeBar: 'bg-[#0284c7]',
        activeIcon: 'text-[#0284c7]',
        hoverClass: 'hover:text-[#0284c7] hover:bg-sky-50/50',
        badgeClass: 'bg-[#0284c7] text-white',
        selectFocus: 'focus:border-[#0284c7]',
      }
    : {
        headerBg: 'bg-[#00594f] border-b-2 border-[#e5a93b] text-white',
        activeText: 'text-[#00594f] font-extrabold',
        activeBg: 'bg-[#FAF6EC]',
        activeBar: 'bg-[#00594f]',
        activeIcon: 'text-[#00594f]',
        hoverClass: 'hover:text-[#00594f] hover:bg-slate-50',
        badgeClass: 'bg-[#00594f] text-white',
        selectFocus: 'focus:border-[#00594f]',
      };

  const renderSidebarContent = (isMobileDrawer: boolean) => (
    <div className="flex flex-col h-full justify-between min-h-0 bg-white">
      <div className="flex flex-col flex-1 min-h-0">
        {/* Minimalist Unit Header Matching Website Identity */}
        <div className={`h-14 sm:h-16 flex-shrink-0 flex items-center justify-between px-4 gap-3 ${sidebarTheme.headerBg}`}>
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="bg-white p-1 rounded-xs shrink-0">
              {schoolSlug === 'smp' ? (
                <img
                  src="/images/smp-logo.png"
                  alt="Logo SMP IT Al-Afiyah"
                  className="w-7 h-7 object-contain"
                />
              ) : schoolSlug === 'sd' ? (
                <img
                  src="/images/sd-logo.png"
                  alt="Logo SDIT Al-Afiyah"
                  className="w-7 h-7 object-contain"
                />
              ) : (
                <img
                  src="/images/ypib-logo.png"
                  alt="Logo YPIB"
                  className="w-7 h-7 object-contain"
                />
              )}
            </div>

            <div className="min-w-0">
              <h2 className="text-xs sm:text-sm font-extrabold text-white uppercase tracking-wide truncate leading-tight">
                {schoolSlug === 'tk'
                  ? 'TK IT Al-Afiyah'
                  : schoolSlug === 'sd'
                  ? 'SDIT Al-Afiyah'
                  : schoolSlug === 'smp'
                  ? 'SMP IT Al-Afiyah'
                  : 'Yayasan Al-Afiyah'}
              </h2>
              <p className="text-[10px] text-white/80 font-semibold truncate">
                ADMIN PANEL
              </p>
            </div>
          </div>

          {isMobileDrawer && (
            <button
              type="button"
              onClick={() => setIsMobileOpen(false)}
              aria-label="Tutup Navigasi"
              className="p-1 text-white/80 hover:text-white rounded-xs cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Optional Superadmin Switcher (Shown cleanly only for Superadmin) */}
        {isFoundation && currentRole === 'SUPERADMIN' && (
          <div className="flex-shrink-0 px-4 py-2.5 bg-slate-50/70 border-b border-slate-100">
            <div className="relative">
              <select
                value={schoolSlug}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'foundation') router.push('/admin/foundation');
                  else router.push(`/admin/${val}/dashboard`);
                  if (isMobileDrawer) setIsMobileOpen(false);
                }}
                aria-label="Pilih Unit Sekolah"
                className={`w-full text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 pr-7 appearance-none focus:outline-none ${sidebarTheme.selectFocus} cursor-pointer shadow-2xs`}
              >
                <option value="foundation">Yayasan Pusat</option>
                <option value="tk">TK IT Al-Afiyah</option>
                <option value="sd">SDIT Al-Afiyah</option>
                <option value="smp">SMP IT Al-Afiyah</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>
        )}
        {/* Navigation Items (Scrollable Middle Section) */}
        <nav className="p-3 space-y-0.5 flex-1 min-h-0 overflow-y-auto overscroll-contain">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <React.Fragment key={item.name}>
                {/* Section Divider Label (e.g. SIAKAD — Akademik) */}
                {'sectionLabel' in item && item.sectionLabel && (
                  <div className="pt-3 pb-1 px-4 flex items-center gap-2">
                    <div className="flex-1 h-px bg-slate-100" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 whitespace-nowrap">
                      {item.sectionLabel}
                    </span>
                    <div className="flex-1 h-px bg-slate-100" />
                  </div>
                )}
                <Link
                  href={item.href}
                  prefetch={false}
                  onClick={() => {
                    if (isMobileDrawer) setIsMobileOpen(false);
                  }}
                  className={`relative flex items-center justify-between px-3.5 py-2.5 rounded-xs text-xs transition-colors ${
                    item.active
                      ? `${sidebarTheme.activeText} ${sidebarTheme.activeBg}`
                      : `text-slate-600 font-semibold ${sidebarTheme.hoverClass}`
                  }`}
                >
                  {item.active && (
                    <span className={`absolute left-0 top-1 bottom-1 w-1 ${sidebarTheme.activeBar}`} />
                  )}

                  <div className="flex items-center space-x-2.5 truncate">
                    <Icon
                      className={`w-4 h-4 flex-shrink-0 transition-colors ${
                        item.active ? sidebarTheme.activeIcon : 'text-slate-400'
                      }`}
                    />
                    <span className="truncate">{item.name}</span>
                  </div>

                  {'badge' in item && item.badge && (
                    <span className={`px-1.5 py-0.5 rounded-xs text-[10px] font-bold flex-shrink-0 ${sidebarTheme.badgeClass}`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              </React.Fragment>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: User Info / Logout & Copyright */}
      <div className="flex-shrink-0 p-3.5 border-t border-slate-200 bg-slate-50/70 space-y-2">
        <div className="flex items-center justify-between">
          <div className="truncate pr-2">
            <p className="text-xs font-extrabold text-slate-900 truncate">{userName}</p>
            <p className="text-[10px] text-slate-500 uppercase font-semibold truncate">{currentRole}</p>
          </div>
          <button
            onClick={handleLogout}
            title="Keluar"
            aria-label="Keluar"
            className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xs transition-colors cursor-pointer flex-shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-slate-400 font-semibold pt-1 border-t border-slate-200/80">
          © {schoolSlug === 'smp' ? 'SMP IT' : 'SD IT'} Al-Afiyah x modula.studio
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop Fixed/Sticky Sidebar (Stays pinned on the left, full viewport height, never scrolls away!) */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-slate-100 flex-col justify-between flex-shrink-0 h-screen sticky top-0 self-start z-30 select-none shadow-2xs overflow-hidden">
        {renderSidebarContent(false)}
      </aside>

      {/* 2. Mobile & Tablet Slide-Out Drawer */}
      {/* Dark Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer Content */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-white shadow-2xl flex flex-col justify-between select-none lg:hidden transform transition-transform duration-300 ease-in-out overflow-hidden ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Navigasi Menu Mobile"
      >
        {renderSidebarContent(true)}
      </aside>
    </>
  );
}
