'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, MessageCircle, Search } from 'lucide-react';

interface StickyMobileBarProps {
  schoolSlug?: string;
  waPhone?: string;
  schoolName?: string;
}

export default function StickyMobileBar({
  schoolSlug,
  waPhone = '6281223344552',
  schoolName = 'Al-Afiyah',
}: StickyMobileBarProps) {
  const ppdbHref = schoolSlug ? `/ppdb/daftar?school=${schoolSlug}` : '/ppdb/daftar';
  const waHref = `https://wa.me/${waPhone}?text=${encodeURIComponent(
    `Assalamu'alaikum Admin ${schoolName}, saya ingin konsultasi mengenai pendaftaran murid baru PPDB 2026/2027.`
  )}`;

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 sm:hidden bg-white/95 backdrop-blur-md border-t border-[#D4EBE7] px-3 py-2 shadow-2xl flex items-center space-x-2 max-w-full overflow-hidden">
      <a
        href={waHref}
        target="_blank"
        rel="noreferrer"
        className="w-10 h-10 flex flex-col items-center justify-center rounded-xl bg-[#E8F3F1] text-[#2D7A70] border border-[#2D7A70]/30 hover:bg-[#D4EBE7] transition-colors flex-shrink-0"
        aria-label="Konsultasi WhatsApp"
        title="WhatsApp CS"
      >
        <MessageCircle className="w-4 h-4" />
        <span className="text-[9px] font-bold text-[#2D7A70] leading-none mt-0.5">Tanya</span>
      </a>

      <Link
        href="/ppdb/cek-status"
        className="w-10 h-10 flex flex-col items-center justify-center rounded-xl bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 transition-colors flex-shrink-0"
        aria-label="Cek Status Pendaftaran"
        title="Lacak Pendaftaran"
      >
        <Search className="w-4 h-4 text-[#2D7A70]" />
        <span className="text-[9px] font-bold text-[#184F48] leading-none mt-0.5">Lacak</span>
      </Link>
      <Link
        href={ppdbHref}
        className="min-w-0 flex-1 py-2.5 px-3 rounded-full bg-gradient-to-r from-[#184F48] to-[#2D7A70] text-white text-xs font-bold text-center shadow-md flex items-center justify-center space-x-1.5"
      >
        <span className="truncate">Daftar PPDB Sekarang</span>
        <ArrowRight className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
      </Link>
    </div>
  );
}
