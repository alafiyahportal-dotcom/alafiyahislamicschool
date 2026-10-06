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

  let targetHref = schoolSlug ? `/ppdb/daftar?school=${schoolSlug}` : '/ppdb/daftar';
  if (refCode) {
    targetHref += `${targetHref.includes('?') ? '&' : '?'}ref=${encodeURIComponent(refCode)}`;
  }

  const waHref = `https://wa.me/${waPhone}?text=${encodeURIComponent(
    `Assalamu'alaikum Admin ${schoolName}, saya ingin konsultasi mengenai pendaftaran murid baru SPMB 2027/2028.`
  )}`;

  const btnLabel = schoolSlug === 'sd'
    ? 'Daftar SPMB SD IT'
    : schoolSlug === 'tk'
    ? 'Daftar SPMB TK IT'
    : schoolSlug === 'smp'
    ? 'Daftar SPMB SMP IT'
    : 'Daftar SPMB Online';

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 sm:hidden bg-white/95 backdrop-blur-md border-t border-[#D4EBE7] px-3 py-2 shadow-2xl flex items-center space-x-2 max-w-full overflow-hidden">
      <a
        href={waHref}
        target="_blank"
        rel="noreferrer"
        className="w-10 h-10 flex flex-col items-center justify-center rounded-xl bg-softwater-light text-softwater border border-softwater/30 hover:bg-[#D4EBE7] transition-colors flex-shrink-0"
        aria-label="Konsultasi WhatsApp"
        title="WhatsApp CS"
      >
        <MessageCircle className="w-4 h-4" />
        <span className="text-[9px] font-bold text-softwater leading-none mt-0.5">Tanya</span>
      </a>

      <Link
        href="/ppdb/cek-status"
        className="w-10 h-10 flex flex-col items-center justify-center rounded-xl bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 transition-colors flex-shrink-0"
        aria-label="Cek Status Pendaftaran SPMB"
        title="Lacak Pendaftaran SPMB"
      >
        <Search className="w-4 h-4 text-softwater" />
        <span className="text-[9px] font-bold text-softwater-dark leading-none mt-0.5">Lacak</span>
      </Link>
      
      <a
        href={targetHref}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          setIsOpening(true);
          setTimeout(() => setIsOpening(false), 2000);
        }}
        className={`min-w-0 flex-1 py-2.5 px-3 rounded-full ${
          schoolSlug === 'sd'
            ? 'bg-[#00A651] hover:bg-[#008f45] shadow-[#00A651]/30'
            : 'bg-gradient-to-r from-softwater-dark to-softwater'
        } text-white text-xs font-bold text-center shadow-md flex items-center justify-center space-x-1.5 transition-all active:scale-95 ${
          isOpening ? 'opacity-85 cursor-wait' : 'hover:opacity-95'
        }`}
      >
        {isOpening ? (
          <>
            <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin flex-shrink-0" />
            <span className="truncate">Membuka SPMB...</span>
          </>
        ) : (
          <>
            <span className="truncate">{btnLabel}</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
          </>
        )}
      </a>
    </div>
  );
}

