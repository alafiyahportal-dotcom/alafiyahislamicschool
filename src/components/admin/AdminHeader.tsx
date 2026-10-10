'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Bell, Menu, User, Pencil, Check, X, LogOut, Shield } from 'lucide-react';

export interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  badgeText?: string;
  userName?: string;
  userRole?: string;
  currentSchoolSlug?: 'foundation' | 'tk' | 'sd' | 'smp' | string;
  showUnitTabs?: boolean;
}

interface UnitTabConfig {
  slug: string;
  name: string;
  shortName: string;
  url: string;
  activeClass: string;
  inactiveClass: string;
  dotActive: string;
  dotInactive: string;
  topAccent: string;
  badgeStyle: string;
}

const UNIT_CONFIGS: Record<string, UnitTabConfig> = {
  foundation: {
    slug: 'foundation',
    name: 'Yayasan Pusat',
    shortName: 'Yayasan',
    url: '/admin/foundation',
    activeClass: 'bg-[#184F48] text-white shadow-xs ring-1 ring-[#184F48]',
    inactiveClass: 'text-slate-600 hover:text-[#184F48] hover:bg-[#E8F3F1]/80',
    dotActive: 'bg-amber-300',
    dotInactive: 'bg-[#184F48]',
    topAccent: 'from-[#184F48] via-[#2D7A70] to-[#F59E0B]',
    badgeStyle: 'bg-[#E8F3F1] text-[#184F48] border-[#184F48]/30',
  },
  tk: {
    slug: 'tk',
    name: 'TK IT Al-Afiyah',
    shortName: 'TK IT',
    url: '/admin/tk/dashboard',
    activeClass: 'bg-[#0284c7] text-white shadow-xs ring-1 ring-[#0284c7]',
    inactiveClass: 'text-slate-600 hover:text-[#0284c7] hover:bg-sky-50',
    dotActive: 'bg-white',
    dotInactive: 'bg-[#0284c7]',
    topAccent: 'from-[#0284c7] via-[#0ea5e9] to-[#38bdf8]',
    badgeStyle: 'bg-sky-50 text-sky-800 border-sky-300',
  },
  sd: {
    slug: 'sd',
    name: 'SDIT Al-Afiyah',
    shortName: 'SDIT',
    url: '/admin/sd/dashboard',
    activeClass: 'bg-emerald-600 text-white shadow-xs ring-1 ring-emerald-600',
    inactiveClass: 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50',
    dotActive: 'bg-white',
    dotInactive: 'bg-emerald-600',
    topAccent: 'from-emerald-600 via-teal-500 to-amber-400',
    badgeStyle: 'bg-emerald-50 text-emerald-800 border-emerald-300',
  },
  smp: {
    slug: 'smp',
    name: 'SMP IT Al-Afiyah',
    shortName: 'SMP IT',
    url: '/admin/smp/dashboard',
    activeClass: 'bg-[#030164] text-white shadow-xs ring-1 ring-[#030164]',
    inactiveClass: 'text-slate-600 hover:text-[#030164] hover:bg-blue-50',
    dotActive: 'bg-[#ffd51e]',
    dotInactive: 'bg-[#030164]',
    topAccent: 'from-[#030164] via-[#0C368A] to-[#ffd51e]',
    badgeStyle: 'bg-blue-50 text-[#030164] border-blue-200',
  },
};

const UNIT_TABS_LIST = [
  UNIT_CONFIGS.foundation,
  UNIT_CONFIGS.tk,
  UNIT_CONFIGS.sd,
  UNIT_CONFIGS.smp,
];

export default function AdminHeader({
  title,
  subtitle,
  badgeText,
  userName = 'Admin',
  userRole = 'Staf Al-Afiyah',
  currentSchoolSlug,
  showUnitTabs = true,
}: AdminHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Profile Edit State
  const [currentName, setCurrentName] = useState(userName);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [tempName, setTempName] = useState(userName);
  const [isSavingName, setIsSavingName] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Generate clean 2-letter initials
  const initials = (() => {
    const parts = (currentName || 'Admin').trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return (currentName || 'AD').substring(0, 2).toUpperCase();
  })();

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempName.trim()) return;

    setIsSavingName(true);
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName: tempName.trim() }),
      });

      if (res.ok) {
        setCurrentName(tempName.trim());
        setSaveSuccess(true);
        setTimeout(() => {
          setSaveSuccess(false);
          setIsProfileModalOpen(false);
          router.refresh();
        }, 800);
      }
    } catch (err) {
      console.error('Failed to update name:', err);
    } finally {
      setIsSavingName(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/session', { method: 'DELETE' });
    } catch {
      // ignore
    }
    document.cookie = 'alafiyah_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    router.push('/login');
  };

  // Auto-detect current active unit scope from props or path
  const activeSlug = (() => {
    if (currentSchoolSlug && UNIT_CONFIGS[currentSchoolSlug]) {
      return currentSchoolSlug;
    }
    if (pathname.includes('/admin/tk')) return 'tk';
    if (pathname.includes('/admin/sd')) return 'sd';
    if (pathname.includes('/admin/smp')) return 'smp';
    return 'foundation';
  })();

  const currentTheme = UNIT_CONFIGS[activeSlug] || UNIT_CONFIGS.foundation;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      
      {/* Dynamic Top Accent Bar reflecting the active unit/yayasan theme */}
      <div className={`h-1 w-full bg-gradient-to-r ${currentTheme.topAccent}`} />

      {/* Main Header Row */}
      <div className="h-16 sm:h-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 sm:gap-4">
        
        {/* Left: Mobile Hamburger Button + Title & Subtitle */}
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('toggle-admin-sidebar'));
              }
            }}
            title="Buka Menu Navigasi"
            aria-label="Buka Menu Navigasi"
            className="lg:hidden p-2 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors flex-shrink-0 cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <h1 className="text-sm sm:text-base lg:text-lg font-bold text-slate-900 tracking-tight truncate">
              {title}
            </h1>
            {subtitle && (
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5 truncate max-w-xs sm:max-w-md lg:max-w-xl">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Center: Unit Navigation Tabs - Strictly shown ONLY on Yayasan Pusat console */}
        {showUnitTabs && activeSlug === 'foundation' && (
          <nav
            aria-label="Pindah Unit Sekolah"
            className="hidden xl:flex items-center p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80 shadow-2xs space-x-1 flex-shrink-0"
          >
            {UNIT_TABS_LIST.map((tab) => {
              const isActive = activeSlug === tab.slug;
              return (
                <Link
                  key={tab.slug}
                  href={tab.url}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                    isActive ? tab.activeClass : tab.inactiveClass
                  }`}
                >
                  {tab.name}
                </Link>
              );
            })}
          </nav>
        )}

        {/* Right: Search Bar + Notification Bell + Profile Avatar */}
        <div className="flex items-center space-x-2.5 sm:space-x-3.5 flex-shrink-0">
          
          {/* Rounded Search Bar */}
          <div className="relative hidden 2xl:block w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari data... (/)"
              className="w-full bg-slate-50 hover:bg-slate-100 focus:bg-white text-xs text-slate-800 placeholder-slate-400 rounded-full pl-9 pr-8 py-2 border border-slate-200 focus:border-[#10B981] focus:ring-4 focus:ring-[#10B981]/10 outline-none transition-all"
            />
            <kbd className="absolute right-2.5 top-2 text-[9px] font-mono text-slate-400 bg-white border border-slate-200 px-1 py-0.2 rounded shadow-2xs">
              /
            </kbd>
          </div>

          {/* Notification Bell */}
          <button
            title="Notifikasi Masuk"
            aria-label="Notifikasi Masuk"
            className="relative p-2 sm:p-2.5 text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-full border border-slate-200/80 transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4 text-slate-700" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
          </button>

          {/* User Profile - Minimalist Initials Avatar & Clickable to Edit Name */}
          <button
            type="button"
            onClick={() => {
              setTempName(currentName);
              setIsProfileModalOpen(true);
            }}
            className="flex items-center space-x-2.5 pl-1 sm:pl-2 border-l border-slate-200 hover:bg-slate-50/80 p-1 rounded-xl transition-all text-left cursor-pointer group"
            title="Klik untuk melihat atau mengedit nama akun Anda"
          >
            {/* Minimalist Icon/Initials Badge - No Photos! */}
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-100 group-hover:bg-emerald-50 border border-slate-200/90 group-hover:border-emerald-300 flex items-center justify-center text-slate-700 group-hover:text-emerald-700 font-bold text-xs shadow-2xs flex-shrink-0 transition-colors">
              {initials}
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-bold text-slate-900 leading-tight group-hover:text-emerald-700 transition-colors flex items-center gap-1.5">
                <span>{currentName}</span>
                <Pencil className="w-2.5 h-2.5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
              </div>
              <div className="text-[10px] text-slate-400 font-medium">
                {userRole}
              </div>
            </div>
          </button>

        </div>

      </div>

      {/* Interactive Modal: Edit User Display Name */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-sm w-full p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Ubah Nama Akun</h3>
                  <p className="text-[11px] text-slate-400">{userRole}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveName} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap / Tampilan Anda
                </label>
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="Ketik nama Anda..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white"
                  required
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Nama ini akan muncul pada header sistem dan histori transaksi/laporan.
                </p>
              </div>

              {saveSuccess && (
                <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center space-x-1.5">
                  <Check className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Nama berhasil diperbarui!</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-xs text-rose-600 hover:text-rose-700 hover:underline flex items-center space-x-1 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar</span>
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsProfileModalOpen(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingName || !tempName.trim()}
                    className="px-4 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    {isSavingName ? 'Menyimpan...' : 'Simpan Nama'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sub-Bar: Mobile & Tablet Unit Tabs (Only shown in Yayasan Scope) */}
      {showUnitTabs && activeSlug === 'foundation' && (
        <div className="xl:hidden px-4 py-2 bg-slate-50/80 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {UNIT_TABS_LIST.map((tab) => {
            const isActive = activeSlug === tab.slug;
            return (
              <Link
                key={tab.slug}
                href={tab.url}
                className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 ${
                  isActive ? tab.activeClass : tab.inactiveClass
                }`}
              >
                {tab.name}
              </Link>
            );
          })}
        </div>
      )}

    </header>
  );
}
