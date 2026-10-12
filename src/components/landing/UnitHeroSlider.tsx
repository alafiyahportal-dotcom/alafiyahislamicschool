'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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

  // If this is SDIT's headline ("Bukan Sekedar / Sekadar") - 3 distinct lines
  if (slug === 'sd' || /bukan\s+(sekedar|sekadar)/i.test(p1)) {
    return (
      <div className="flex flex-col gap-1 text-left">
        <span className="font-hero-accent text-2xl sm:text-3xl lg:text-4xl italic font-normal tracking-wide text-[#ffd51e] drop-shadow-sm">
          Bukan Sekedar
        </span>
        <span className="text-[2.4rem] xs:text-[2.75rem] sm:text-5xl lg:text-[3.85rem] font-black text-white leading-[1.03] tracking-tight">
          Tempat Belajar,
        </span>
        <span className={`text-[2.4rem] xs:text-[2.75rem] sm:text-5xl lg:text-[3.85rem] font-black ${highlightClass} leading-[1.03] tracking-tight`}>
          Tempat Bertumbuh
        </span>
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
        titlePart1: 'Bukan Sekedar Tempat Belajar, Namun Juga ',
        titleHighlight: 'Tempat Bertumbuh',
        titlePart2: '',
        description: 'Mencetak generasi sholeh, mandiri, dan berakhlak mulia dengan prinsip Smart Akhlak Fitrah serta bimbingan karakter nabawiyah.',
        primaryCtaText: 'Daftar SPMB SDIT',
        primaryCtaLink: ppdbUrl,
        secondaryCtaText: 'Tanya Admin WA',
        secondaryCtaLink: waUrl,
        image: '/images/hero/sd-cutout.webp',
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
        { icon: 'award', text: 'Terakreditasi A BAN-S/M' },
        { icon: 'check', text: 'Target Tahfidz 3-5+ Juz' },
        { icon: 'calendar', text: 'Diskon Gelombang 1 s.d. 70%' },
        { icon: 'shield', text: `Formulir: Rp ${registrationFee.toLocaleString('id-ID')}` }
      ]
    };
  }, [slug, customSlides, ppdbUrl, waUrl, registrationFee]);

  // Unit theme styles - Bright, solid identity color (YPIB style) with NO dark/black gradient overlays
  const theme = useMemo(() => {
    switch (slug) {
      case 'sd':
        return {
          bgClass: 'bg-gradient-to-br from-[#064e3b] via-[#047857] to-[#00A651]',
          highlightText: 'text-[#ffd51e]',
          badgeBorder: 'border-[#ffd51e]/40 text-[#ffd51e]',
          primaryBtn: 'bg-[#ffd51e] hover:bg-yellow-400 text-[#064e3b] font-black shadow-lg shadow-black/15',
          circleBackdrop: 'bg-white/10 border-white/20',
          badgePillText: '',
          cutoutSrc: '/images/hero/sd-cutout.webp',
        };
      case 'tk':
        return {
          bgClass: 'bg-[#059669] bg-gradient-to-b from-[#059669] via-[#047857] to-[#065f46]',
          highlightText: 'text-[#ffd51e]',
          badgeBorder: 'border-[#ffd51e]/40 text-[#ffd51e]',
          primaryBtn: 'bg-[#ffd51e] hover:bg-yellow-400 text-[#044e39] font-black shadow-lg shadow-black/15',
          circleBackdrop: 'bg-white/10 border-white/20',
          badgePillText: '',
          cutoutSrc: '/images/hero/sd-cutout.webp',
        };
      case 'smp':
      default:
        return {
          bgClass: 'bg-[#030164] bg-gradient-to-b from-[#05027a] via-[#030164] to-[#02004a]',
          highlightText: 'text-[#ffd51e]',
          badgeBorder: 'border-[#ffd51e]/40 text-[#ffd51e]',
          primaryBtn: 'bg-[#ffd51e] hover:bg-yellow-400 text-[#030164] font-black shadow-lg shadow-black/15',
          circleBackdrop: 'bg-white/10 border-white/20',
          badgePillText: '',
          cutoutSrc: '/images/hero/smp-santri-cutout.webp',
        };
    }
  }, [slug]);

  let effectiveCtaLink = slide.primaryCtaLink || ppdbUrl;
  if (refCode && effectiveCtaLink.includes('/ppdb/daftar')) {
    effectiveCtaLink += `${effectiveCtaLink.includes('?') ? '&' : '?'}ref=${encodeURIComponent(refCode)}`;
  }

  // Common CTA buttons block - Side-by-side 2-column grid on mobile, inline on desktop
  const ctaButtons = (
    <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-row sm:items-center sm:gap-3 w-full sm:w-auto">
      <Link
        href={effectiveCtaLink}
        className={`inline-flex h-10 xs:h-11 sm:h-12 w-full sm:w-auto items-center justify-center gap-1.5 px-3 xs:px-5 rounded-xl text-xs sm:text-sm font-black transition-all duration-200 hover:-translate-y-0.5 active:scale-95 text-center shadow-md ${theme.primaryBtn}`}
      >
        <span className="truncate">{slug === 'smp' ? 'Daftar SPMB' : slide.primaryCtaText || 'Daftar SPMB'}</span>
        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
      </Link>

      {slide.secondaryCtaLink && (
        <a
          href={slide.secondaryCtaLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-10 xs:h-11 sm:h-12 w-full sm:w-auto items-center justify-center gap-1.5 px-2 xs:px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-white text-[11px] xs:text-xs sm:text-sm font-bold uppercase tracking-wider transition-all text-center backdrop-blur-sm shadow-xs"
        >
          <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ffd51e] shrink-0" />
          <span className="truncate">Konsultasi WA</span>
        </a>
      )}
    </div>
  );

  return (
    <section className={`relative text-white overflow-hidden select-none w-full flex-shrink-0 flex flex-col justify-between min-h-screen min-h-[100dvh] ${theme.bgClass} pb-6 sm:pb-12 lg:pb-16`}>
      {/* Subtle top ambient glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/[0.04] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 left-1/4 w-[400px] h-[400px] bg-white/[0.03] rounded-full blur-2xl pointer-events-none" />

      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-28 sm:pt-32 lg:pt-36 pb-3 sm:pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 lg:gap-10 items-center">
          {/* Left Column: Heading & Subtitle (and CTA on desktop) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left relative z-20">
            {/* Overline Badge (Diatas Judul) - Subtle organic floating & glowing ping */}
            {slide.badge && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{
                  opacity: 1,
                  y: [0, -3, 0],
                }}
                transition={{
                  opacity: { duration: 0.5, ease: 'easeOut' },
                  y: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
                }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 hover:border-[#ffd51e]/60 text-[11px] sm:text-xs font-black tracking-wider text-[#ffd51e] uppercase mb-2.5 sm:mb-4 backdrop-blur-sm shadow-xs transition-colors select-none"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ffd51e] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ffd51e]" />
                </span>
                <span>{slide.badge}</span>
              </motion.div>
            )}

            {/* Dominant 3-Line Headline (Judul) - Continuous living breathing motion */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{
                opacity: 1,
                y: [0, -3.5, 0],
              }}
              transition={{
                opacity: { duration: 0.6, delay: 0.1, ease: 'easeOut' },
                y: { duration: 4.4, repeat: Infinity, ease: 'easeInOut', delay: 0.2 },
              }}
              className="w-full text-balance"
            >
              {renderHeroHeadline(slug, slide.titlePart1, slide.titleHighlight, slide.titlePart2, theme.highlightText)}
            </motion.h1>

            {/* Subtitle / Description (Sub Judul) - Gentle living breathing motion */}
            {slide.description && (
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{
                  opacity: 1,
                  y: [0, -2, 0],
                }}
                transition={{
                  opacity: { duration: 0.6, delay: 0.2, ease: 'easeOut' },
                  y: { duration: 4.4, repeat: Infinity, ease: 'easeInOut', delay: 0.4 },
                }}
                className="mt-3.5 sm:mt-5 max-w-[240px] xs:max-w-[270px] sm:max-w-md lg:max-w-xl text-xs sm:text-sm lg:text-base text-white/90 leading-relaxed font-normal"
              >
                {slide.description}
              </motion.p>
            )}

            {/* Primary Action Buttons (Desktop only - on mobile placed below the image) */}
            <div className="hidden lg:flex mt-6 w-full">
              {ctaButtons}
            </div>

            {/* Trust bullet points */}
            {slide.trustItems && slide.trustItems.length > 0 && !statsCards && (
              <div className="mt-5 sm:mt-6 pt-4 border-t border-white/15 w-full flex flex-wrap gap-x-6 gap-y-2 text-xs sm:text-sm text-white/85 font-medium">
                {slide.trustItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ffd51e]" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Student Cutout Visual Plate */}
          <div className="lg:col-span-5 flex flex-col items-end lg:items-center justify-end relative -mt-28 xs:-mt-36 sm:-mt-44 lg:mt-0 z-10 w-full pointer-events-none">
            <div className="relative w-full max-w-[340px] xs:max-w-[380px] sm:max-w-[440px] lg:max-w-[500px] flex items-end justify-end lg:justify-center ml-auto">
              {/* Islamic Arch Portal Backdrop (active for SMP cutout) */}
              {slug !== 'sd' && (
                <div
                  className="absolute bottom-0 right-0 sm:right-auto w-64 sm:w-80 lg:w-[22rem] h-[300px] sm:h-[390px] lg:h-[450px] rounded-t-full bg-gradient-to-t from-white/[0.04] to-white/[0.14] border-t-2 border-x border-white/25 shadow-2xl backdrop-blur-sm pointer-events-none translate-x-4 sm:translate-x-8"
                />
              )}

              {/* Cut-out Student Photo - Shifted right for SMP and enlarged */}
              <div className={`relative z-10 w-full flex justify-end lg:justify-center items-end ${
                slug === 'smp' ? 'translate-x-6 xs:translate-x-10 sm:translate-x-14 lg:translate-x-10' : 'translate-x-2 sm:translate-x-4'
              }`}>
                <Image
                  src={theme.cutoutSrc}
                  alt={schoolName}
                  width={780}
                  height={546}
                  priority
                  className="w-auto max-h-[330px] xs:max-h-[380px] sm:max-h-[460px] lg:max-h-[520px] object-contain drop-shadow-[0_16px_32px_rgba(0,0,0,0.32)] select-none pointer-events-none"
                />
              </div>
            </div>

            {/* CTA Buttons on Mobile: positioned directly below the image and above the 4 cards */}
            <div className="flex lg:hidden mt-4 sm:mt-6 w-full justify-center pointer-events-auto">
              {ctaButtons}
            </div>
          </div>
        </div>
      </div>

      {/* Hero Bottom Highlight Cards (SMP & SD Stat Cards) */}
      {statsCards && (
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 sm:pb-12 w-full pt-2 sm:pt-4">
          {statsCards}
        </div>
      )}
    </section>
  );
}
