'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, MessageCircle, Search } from 'lucide-react';
import { getStoredReferralCode } from '@/lib/referral';

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
  const [refCode, setRefCode] = useState<string | null>(null);
  const [isOpening, setIsOpening] = useState(false);

  useEffect(() => {
    setRefCode(getStoredReferralCode());
  }, []);

  let targetHref = schoolSlug === 'sd'
    ? '/sd/spmb/daftar'
    : schoolSlug === 'smp'
    ? '/smp/spmb/daftar'
    : (schoolSlug ? `/ppdb/daftar?school=${schoolSlug}` : '/ppdb/daftar');
  if (refCode) {
    targetHref += `${targetHref.includes('?') ? '&' : '?'}ref=${encodeURIComponent(refCode)}`;
  }

  const waHref = `https://wa.me/${waPhone}?text=${encodeURIComponent(
    `Assalamu'alaikum Admin ${schoolName}, saya ingin konsultasi mengenai pendaftaran murid baru SPMB 2027/2028.`
  )}`;

  const btnLabel = schoolSlug === 'sd'
    ? 'Daftar SPMB SDIT'
    : schoolSlug === 'tk'
    ? 'Daftar SPMB TK IT'
    : schoolSlug === 'smp'
    ? 'Daftar SPMB SMP IT'
    : 'Daftar SPMB Online';

  const lacakHref = schoolSlug === 'sd'
    ? '/sd/spmb/cek-status'
    : schoolSlug === 'smp'
    ? '/smp/spmb/cek-status'
    : (schoolSlug ? `/ppdb/cek-status?school=${schoolSlug}` : '/ppdb/cek-status');

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 sm:hidden bg-white/95 backdrop-blur-md border-t border-[#D4EBE7] px-3 py-2 shadow-2xl flex items-center space-x-2 max-w-full overflow-hidden">
      <a
        href={waHref}
        target="_blank"
        rel="noreferrer"
        className={`w-10 h-10 flex flex-col items-center justify-center rounded-xl transition-colors flex-shrink-0 ${
          schoolSlug === 'smp'
            ? 'bg-blue-50 text-[#030164] border border-[#030164]/20 hover:bg-blue-100'
            : 'bg-softwater-light text-softwater border border-softwater/30 hover:bg-[#D4EBE7]'
        }`}
        aria-label="Konsultasi WhatsApp"
        title="WhatsApp CS"
      >
        <MessageCircle className="w-4 h-4" />
        <span className={`text-[9px] font-bold leading-none mt-0.5 ${schoolSlug === 'smp' ? 'text-[#030164]' : 'text-softwater'}`}>Tanya</span>
      </a>

      <Link
        href={lacakHref}
        className={`w-10 h-10 flex flex-col items-center justify-center rounded-xl transition-colors flex-shrink-0 ${
          schoolSlug === 'sd'
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
            : schoolSlug === 'smp'
            ? 'bg-amber-50 text-slate-800 border border-amber-200 hover:bg-amber-100'
            : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
        }`}
        aria-label="Cek Status Pendaftaran SPMB"
        title="Lacak Pendaftaran SPMB"
      >
        <Search className={`w-4 h-4 ${schoolSlug === 'sd' ? 'text-[#00A651]' : schoolSlug === 'smp' ? 'text-amber-600' : 'text-softwater'}`} />
        <span className={`text-[9px] font-bold ${schoolSlug === 'sd' ? 'text-[#00A651]' : schoolSlug === 'smp' ? 'text-slate-800' : 'text-softwater-dark'} leading-none mt-0.5`}>Lacak</span>
      </Link>
      
      <Link
        href={targetHref}
        className={`min-w-0 flex-1 py-2.5 px-3 rounded-full ${
          schoolSlug === 'sd'
            ? 'bg-[#00A651] hover:bg-[#008f45] shadow-[#00A651]/30 text-white'
            : schoolSlug === 'smp'
            ? 'bg-[#030164] hover:bg-[#02004d] text-white border border-[#ffd51e]/40 shadow-[#030164]/40'
            : 'bg-gradient-to-r from-softwater-dark to-softwater text-white'
        } text-xs font-bold text-center shadow-md flex items-center justify-center space-x-1.5 transition-all active:scale-95`}
      >
        <span className="truncate">{btnLabel}</span>
        <ArrowRight className={`w-3.5 h-3.5 flex-shrink-0 ${schoolSlug === 'smp' ? 'text-[#ffd51e]' : 'text-amber-300'}`} />
      </Link>
    </div>
  );
}

