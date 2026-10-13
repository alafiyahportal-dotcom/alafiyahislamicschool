'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { getStoredReferralCode } from '@/lib/referral';

export interface UnitSlideData {
  id: number;
  badge: string;
  titlePart1: string;
  titleHighlight: string;
  titlePart2: string;
  description: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  image: string;
  trustItems?: Array<{
    icon: 'shield' | 'check' | 'calendar' | 'grad' | 'users' | 'award';
    text: string;
  }>;
}

interface UnitHeroSliderProps {
  slug: 'tk' | 'sd' | 'smp';
  schoolName: string;
  badgeText: string;
  registrationFee?: number;
  waCenterPhone: string;
  customSlides?: UnitSlideData[];
  statsCards?: React.ReactNode;
}

function renderHeroHeadline(
  slug: string,
  titlePart1: string,
  titleHighlight: string,
  titlePart2: string,
  highlightClass: string
) {
  const p1 = (titlePart1 || '').trim();

  // SDIT official slogan: "Bukan Sekadar Tempat Belajar, Namun Juga Tempat Bertumbuh"
  if (slug === 'sd' || /bukan\s+(sekedar|sekadar)/i.test(p1)) {
    const lineCls = 'text-[2.4rem] xs:text-[2.75rem] sm:text-5xl lg:text-[3.85rem] font-black leading-[1.03] tracking-tight drop-shadow-sm';
    return (
      <div className="flex flex-col gap-1 sm:gap-1.5 text-left">
        <span className={`${lineCls} text-white`}>Bukan Sekadar</span>
        <span className={`${lineCls} text-white`}>Tempat Belajar,</span>
        <span className={`${lineCls} text-white`}>Namun Juga</span>
        <span className={`${lineCls} ${highlightClass}`}>Tempat Bertumbuh</span>
      </div>
    );
  }

  // SMP IT - 3 distinct bold lines as requested (enlarged & prominent)
  if (slug === 'smp' || /mencetak\s+generasi/i.test(p1)) {
    return (
      <div className="flex flex-col gap-1 sm:gap-1.5 text-left">
        <span className="text-[2.4rem] xs:text-[2.75rem] sm:text-5xl lg:text-[3.85rem] font-black text-white leading-[1.03] tracking-tight drop-shadow-sm">
          Mencetak Generasi
        </span>
        <span className={`text-[2.4rem] xs:text-[2.75rem] sm:text-5xl lg:text-[3.85rem] font-black ${highlightClass} leading-[1.03] tracking-tight drop-shadow-sm`}>
          Smart &amp; Religious
        </span>
        <span className="text-[2.4rem] xs:text-[2.75rem] sm:text-5xl lg:text-[3.85rem] font-black text-white leading-[1.03] tracking-tight drop-shadow-sm">
          Berakhlak Qur’ani
        </span>
      </div>
    );
  }

  // General fallback
  return (
    <div className="text-[2.4rem] xs:text-[2.75rem] sm:text-5xl lg:text-[3.85rem] font-black leading-[1.03] text-white tracking-tight flex flex-col gap-1 text-left">
      <span>{p1}</span>
      {titleHighlight && <span className={highlightClass}>{titleHighlight}</span>}
      {titlePart2 && <span>{titlePart2}</span>}
    </div>
  );
}

export default function UnitHeroSlider({
  slug,
  schoolName,
  badgeText,
  registrationFee = 250000,
  waCenterPhone,
  customSlides,
  statsCards
}: UnitHeroSliderProps) {
  const [refCode, setRefCode] = useState<string | null>(null);

  useEffect(() => {
    setRefCode(getStoredReferralCode());
  }, []);

  const ppdbUrl = slug === 'sd' ? '/sd/spmb/daftar' : slug === 'smp' ? '/smp/spmb/daftar' : `/ppdb/daftar?school=${slug}`;
  const waUrl = `https://wa.me/${waCenterPhone}?text=${encodeURIComponent(
    `Assalamu'alaikum Panitia SPMB ${schoolName}, saya ingin bertanya perihal informasi pendaftaran murid baru TP 2027/2028.`
  )}`;

  // Default unit-tailored slide data
  const slide = useMemo<UnitSlideData>(() => {
    if (customSlides && customSlides.length > 0) {
      return customSlides[0];
    }

    if (slug === 'sd') {
      return {
        id: 1,
        badge: 'SPMB T.A. 2027/2028 • TELAH DIBUKA',
        titlePart1: 'Bukan Sekadar Tempat Belajar, Namun Juga ',
        titleHighlight: 'Tempat Bertumbuh',
        titlePart2: '',
        description: 'Mencetak generasi sholeh, mandiri, dan berakhlak mulia dengan prinsip Smart Akhlak Fitrah serta bimbingan karakter nabawiyah.',
        primaryCtaText: 'Daftar SPMB SDIT',
        primaryCtaLink: ppdbUrl,
        secondaryCtaText: 'Tanya Admin WA',
        secondaryCtaLink: waUrl,
        image: '/images/hero/sd-santri-cutout.webp',
        trustItems: [
          { icon: 'shield', text: 'Kurikulum Terpadu & Karakter Nabawiyah' },
          { icon: 'check', text: 'Lingkungan Asri & Ramah Anak' },
          { icon: 'award', text: 'Tahfidz Juz 30 Mutqin' },
          { icon: 'calendar', text: `Formulir: Rp ${registrationFee.toLocaleString('id-ID')}` },
        ]
      };
    }

    if (slug === 'tk') {
      return {
        id: 1,
        badge: 'PAUD & TK IT AL-AFIYAH MAJALENGKA',
        titlePart1: 'Tumbuh Ceria, Mandiri & ',
        titleHighlight: 'Berakhlak Shalih',
        titlePart2: 'Sejak Usia Emas',
        description: 'Pendidikan usia dini berbasis sentra bermain bermakna dan pembiasaan adab nabawiyah dengan bimbingan guru penuh kasih sayang.',
        primaryCtaText: 'Daftar Murid Baru TK',
        primaryCtaLink: ppdbUrl,
        secondaryCtaText: 'Konsultasi WhatsApp',
        secondaryCtaLink: waUrl,
        image: '/images/hero/sd-cutout.webp',
        trustItems: [
          { icon: 'shield', text: 'Terakreditasi Resmi' },
          { icon: 'users', text: 'Rasio Kelas Ramah 1:8' },
          { icon: 'calendar', text: 'T.A. 2027/2028' },
          { icon: 'check', text: `Formulir: Rp ${registrationFee.toLocaleString('id-ID')}` }
        ]
      };
    }

    // Default SMP
    return {
      id: 1,
      badge: 'SPMB T.A. 2027/2028 • BE SMART & RELIGIOUS',
      titlePart1: 'Mencetak Generasi',
      titleHighlight: 'Smart & Religious',
      titlePart2: 'Berakhlak Qur’ani',
      description: 'Sekolah Menengah Pertama Islam Terpadu Terakreditasi A dengan target tahfidz 3-5+ juz mutqin, fasih bahasa Arab, dan pembinaan karakter mandiri.',
      primaryCtaText: 'Daftar SPMB SMP IT',
      primaryCtaLink: ppdbUrl,
      secondaryCtaText: 'Konsultasi WhatsApp',
      secondaryCtaLink: waUrl,
      image: '/images/hero/smp-cutout.webp',
      trustItems: [
        { icon: 'award', text: 'Terakreditasi A (SK No. 012/BAN-PDM/SK/2025)' },
        { icon: 'check', text: 'Target Tahfidz 3-5+ Juz' },
        { icon: 'calendar', text: 'Diskon Gelombang 1 s.d. 70%' },
        { icon: 'shield', text: `Formulir: Rp ${registrationFee.toLocaleString('id-ID')}` }
      ]
    };
  }, [slug, customSlides, ppdbUrl, waUrl, registrationFee]);

  // Unit theme styles - solid identity color per unit (no photo, full-color banner)
  const theme = useMemo(() => {
    switch (slug) {
      case 'sd':
        return {
          bgClass: 'bg-gradient-to-br from-[#064e3b] via-[#047857] to-[#00A651]',
          highlightText: 'text-[#ffd51e]',
          primaryBtn: 'bg-[#ffd51e] hover:bg-yellow-400 text-[#064e3b]',
        };
      case 'tk':
        return {
          bgClass: 'bg-gradient-to-b from-[#059669] via-[#047857] to-[#065f46]',
          highlightText: 'text-[#ffd51e]',
          primaryBtn: 'bg-[#ffd51e] hover:bg-yellow-400 text-[#044e39]',
        };
      case 'smp':
      default:
        return {
          bgClass: 'bg-gradient-to-b from-[#05027a] via-[#030164] to-[#02004a]',
          highlightText: 'text-[#ffd51e]',
          primaryBtn: 'bg-[#ffd51e] hover:bg-yellow-400 text-[#030164]',
        };
    }
  }, [slug]);

  let effectiveCtaLink = slide.primaryCtaLink || ppdbUrl;
  if (refCode && effectiveCtaLink.includes('/ppdb/daftar')) {
    effectiveCtaLink += `${effectiveCtaLink.includes('?') ? '&' : '?'}ref=${encodeURIComponent(refCode)}`;
  }

  return (
    <section
      className={`relative text-white overflow-hidden select-none w-full flex flex-col min-h-screen min-h-[100svh] ${theme.bgClass}`}
    >
      {/* Soft ambient glows (decorative) */}
      <div aria-hidden="true" className="absolute -top-32 -right-32 w-[420px] h-[420px] sm:w-[560px] sm:h-[560px] bg-white/[0.06] rounded-full blur-3xl pointer-events-none" />
      <div aria-hidden="true" className="absolute top-1/3 -left-40 w-[360px] h-[360px] bg-[#ffd51e]/[0.05] rounded-full blur-3xl pointer-events-none" />

      {/* Headline block — vertically centered in the space between navbar and CTA */}
      <div className="relative z-10 flex-1 flex flex-col justify-center max-w-7xl mx-auto w-full px-5 sm:px-6 lg:px-8 pt-24 sm:pt-28 lg:pt-32 pb-6 sm:pb-8">
        <div className="max-w-3xl">
          {slide.badge && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: [0, -3, 0] }}
              transition={{
                opacity: { duration: 0.5, ease: 'easeOut' },
                y: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
              }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[11px] sm:text-xs font-black tracking-wider text-[#ffd51e] uppercase mb-4 sm:mb-5 backdrop-blur-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ffd51e] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ffd51e]" />
              </span>
              <span>{slide.badge}</span>
            </motion.div>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: [0, -3.5, 0] }}
            transition={{
              opacity: { duration: 0.6, delay: 0.1, ease: 'easeOut' },
              y: { duration: 4.4, repeat: Infinity, ease: 'easeInOut', delay: 0.2 },
            }}
            className="w-full"
          >
            {renderHeroHeadline(slug, slide.titlePart1, slide.titleHighlight, slide.titlePart2, theme.highlightText)}
          </motion.h1>

          {slide.description && (
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: [0, -2, 0] }}
              transition={{
                opacity: { duration: 0.6, delay: 0.2, ease: 'easeOut' },
                y: { duration: 4.4, repeat: Infinity, ease: 'easeInOut', delay: 0.4 },
              }}
              className="mt-4 sm:mt-6 max-w-xl text-sm sm:text-base lg:text-lg text-white/90 leading-relaxed"
            >
              {slide.description}
            </motion.p>
          )}

          {slide.trustItems && slide.trustItems.length > 0 && !statsCards && (
            <div className="mt-6 pt-4 border-t border-white/15 flex flex-wrap gap-x-6 gap-y-2 text-xs sm:text-sm text-white/85 font-medium">
              {slide.trustItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ffd51e]" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom block — CTA buttons sit directly above the 4 stat cards */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:pb-10 lg:pb-12">
        <div className="grid grid-cols-2 gap-2.5 sm:flex sm:gap-3 mb-3 sm:mb-5">
          <Link
            href={effectiveCtaLink}
            className={`inline-flex h-12 items-center justify-center gap-1.5 px-3 sm:px-7 rounded-xl text-[13px] sm:text-sm font-black shadow-lg shadow-black/15 transition-all duration-200 hover:-translate-y-0.5 active:scale-95 ${theme.primaryBtn}`}
          >
            <span className="truncate">{slug === 'smp' ? 'Daftar SPMB' : slide.primaryCtaText || 'Daftar SPMB'}</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </Link>

          {slide.secondaryCtaLink && (
            <a
              href={slide.secondaryCtaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-1.5 px-3 sm:px-6 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-white text-xs sm:text-sm font-bold uppercase tracking-wider backdrop-blur-sm transition-all"
            >
              <MessageCircle className="w-4 h-4 text-[#ffd51e] shrink-0" />
              <span className="truncate">Konsultasi WA</span>
            </a>
          )}
        </div>

        {statsCards}
      </div>
    </section>
  );
}
