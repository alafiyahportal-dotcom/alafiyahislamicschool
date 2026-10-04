'use client';

import React from 'react';
import { Home, CalendarCheck2, BookOpen, CreditCard, User } from 'lucide-react';

export type SiakadTab = 'home' | 'presence' | 'academic' | 'tuition' | 'profile';

interface SiakadBottomNavProps {
  activeTab: SiakadTab;
  onChangeTab: (tab: SiakadTab) => void;
  accentColor?: string;
}

export default function SiakadBottomNav({
  activeTab,
  onChangeTab,
  accentColor = '#123E38',
}: SiakadBottomNavProps) {
  const navItems: { id: SiakadTab; label: string; icon: React.ElementType }[] = [
    { id: 'home', label: 'Beranda', icon: Home },
    { id: 'presence', label: 'Presensi', icon: CalendarCheck2 },
    { id: 'academic', label: 'Tahfidz', icon: BookOpen },
    { id: 'tuition', label: 'SPP', icon: CreditCard },
    { id: 'profile', label: 'Murid', icon: User },
  ];

  return (
    <div className="absolute bottom-4 left-3 right-3 z-40 pointer-events-auto">
      <nav 
        aria-label="Navigasi Bawah SIAKAD"
        className="bg-white/95 backdrop-blur-2xl shadow-[0_12px_32px_rgba(0,0,0,0.22)] border border-slate-200/80 rounded-full px-2 py-1.5 flex items-center justify-between transition-all"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onChangeTab(item.id)}
              className={`relative flex items-center justify-center transition-all duration-300 rounded-full ${
                isActive
                  ? 'px-3 py-1.5 bg-[#123E38] text-white font-extrabold text-xs shadow-md gap-1.5'
                  : 'p-2.5 text-slate-400 hover:text-[#123E38] hover:bg-slate-100/80'
              }`}
            >
              <Icon className={`${isActive ? 'w-3.5 h-3.5 text-amber-300' : 'w-4 h-4'} shrink-0`} />
              {isActive && (
                <span className="text-[11px] font-black tracking-tight whitespace-nowrap animate-fadeIn">
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
