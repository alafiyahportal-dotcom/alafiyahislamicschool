'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, MessageCircle } from 'lucide-react';
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
  titlePart1: string,
  titleHighlight: string,
  titlePart2: string,
  highlightClass: string
) {
  const p1 = (titlePart1 || '').trim();
  const ph = (titleHighlight || '').trim();
  const p2 = (titlePart2 || '').trim();

  // If this is SDIT's headline ("Bukan Sekedar / Sekadar")
  if (/bukan\s+(sekedar|sekadar)/i.test(p1)) {
    return (
      <div className="flex flex-col gap-0.5">
        <span className="font-hero-accent text-xl sm:text-2xl lg:text-3xl italic font-normal tracking-wide text-[#ffd51e] drop-shadow-sm">
          Bukan Sekedar
        </span>
        <span className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
          Tempat Belajar,
        </span>
        <span className={`text-2xl sm:text-4xl lg:text-5xl font-black ${highlightClass} leading-tight`}>
          Tempat Bertumbuh
        </span>
      </div>
    );
  }

  // SMP / General headline
  return (
    <div className="text-2xl sm:text-4xl lg:text-5xl font-black leading-tight text-white tracking-tight">
      <span>{p1}</span>{' '}
      {ph && (
        <span className={`${highlightClass} inline`}>
          {ph}
        </span>
      )}{' '}
      {p2 && <span>{p2}</span>}
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
          bgClass: 'bg-[#008a43] bg-gradient-to-b from-[#009b4b] via-[#008a43] to-[#007538]',
          highlightText: 'text-[#ffd51e]',
          badgeBorder: 'border-[#ffd51e]/40 text-[#ffd51e]',
          primaryBtn: 'bg-[#ffd51e] hover:bg-yellow-400 text-[#00602e] font-black shadow-lg shadow-black/15',
          circleBackdrop: 'bg-white/10 border-white/20',
          badgePillText: 'Terakreditasi B • BAN-S/M',
          cutoutSrc: '/images/hero/sd-cutout.webp',
        };
      case 'tk':
        return {
          bgClass: 'bg-[#059669] bg-gradient-to-b from-[#059669] via-[#047857] to-[#065f46]',
          highlightText: 'text-[#ffd51e]',
          badgeBorder: 'border-[#ffd51e]/40 text-[#ffd51e]',
          primaryBtn: 'bg-[#ffd51e] hover:bg-yellow-400 text-[#044e39] font-black shadow-lg shadow-black/15',
          circleBackdrop: 'bg-white/10 border-white/20',
          badgePillText: 'PAUD IT Al-Afiyah',
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
          badgePillText: 'Terakreditasi A • BAN-S/M',
          cutoutSrc: '/images/hero/smp-cutout.webp',
        };
    }
  }, [slug]);

  let effectiveCtaLink = slide.primaryCtaLink || ppdbUrl;
  if (refCode && effectiveCtaLink.includes('/ppdb/daftar')) {
    effectiveCtaLink += `${effectiveCtaLink.includes('?') ? '&' : '?'}ref=${encodeURIComponent(refCode)}`;
  }

  return (
    <section className={`relative text-white overflow-hidden select-none w-full flex-shrink-0 flex flex-col justify-start ${theme.bgClass}`}>
      {/* Subtle top ambient glow - Unit matched (no muddy black shadow) */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/[0.04] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 left-1/4 w-[400px] h-[400px] bg-white/[0.03] rounded-full blur-2xl pointer-events-none" />

      {/* Main Content Area */}
      <div
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-24 sm:pt-28 lg:pt-32 pb-6 sm:pb-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-center">
          {/* Left Column: Heading, Subtitle & Action */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Overline Badge */}
            {slide.badge && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[11px] sm:text-xs font-black tracking-wider text-[#ffd51e] uppercase mb-3 sm:mb-4 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-[#ffd51e] animate-pulse" />
                <span>{slide.badge}</span>
              </div>
            )}

            {/* Dominant Headline */}
            <h1 className="w-full text-balance">
              {renderHeroHeadline(slide.titlePart1, slide.titleHighlight, slide.titlePart2, theme.highlightText)}
            </h1>

            {/* Subtitle / Description - Short and clean */}
            {slide.description && (
              <p className="mt-2.5 sm:mt-3.5 max-w-xl text-sm sm:text-base lg:text-lg text-white/90 leading-relaxed font-normal">
                {slide.description}
              </p>
            )}

            {/* Primary Action Buttons (Desktop & Fallback when statsCards are below) */}
            <div className="mt-4 sm:mt-6 flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <Link
                href={effectiveCtaLink}
                className={`inline-flex h-11 sm:h-12 w-full sm:w-auto items-center justify-center gap-2 px-6 rounded-xl text-sm font-black transition-all duration-200 hover:-translate-y-0.5 active:scale-95 text-center ${theme.primaryBtn}`}
              >
                <span>{slide.primaryCtaText || 'Daftar SPMB Online'}</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </Link>

              {slide.secondaryCtaLink && (
                <a
                  href={slide.secondaryCtaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 sm:h-12 w-full sm:w-auto items-center justify-center gap-2 px-5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-all text-center backdrop-blur-sm"
                >
                  <MessageCircle className="w-4 h-4 text-[#ffd51e]" />
                  <span>{slide.secondaryCtaText || 'Tanya Admin WA'}</span>
                </a>
              )}
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

          {/* Right Column: Student Cutout Visual Plate (Universitas YPIB style) */}
          <div className="lg:col-span-5 flex justify-center items-end relative mt-2 sm:mt-4 lg:mt-0">
            <div className="relative w-full max-w-[320px] sm:max-w-[380px] lg:max-w-[440px] flex items-end justify-center">
              {/* Soft circular plate behind cutout */}
              <div
                className={`absolute bottom-0 w-56 h-56 sm:w-72 sm:h-72 lg:w-88 lg:h-88 rounded-full border ${theme.circleBackdrop} pointer-events-none`}
              />

              {/* Cut-out Student Photo */}
              <div className="relative z-10 w-full flex justify-center items-end">
                <Image
                  src={theme.cutoutSrc}
                  alt={schoolName}
                  width={640}
                  height={640}
                  priority
                  className="w-auto max-h-[260px] sm:max-h-[340px] lg:max-h-[420px] object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.28)] select-none pointer-events-none"
                />
              </div>

              {/* Floating Quality / Accreditation Badge like YPIB */}
              <div className="absolute bottom-2 left-2 sm:left-4 z-20 px-3 py-1.5 rounded-xl bg-white/95 text-slate-900 border border-slate-200/80 shadow-lg backdrop-blur-md flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] sm:text-xs font-black tracking-tight">{theme.badgePillText}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Bottom Highlight Cards (SMP & SD Stat Cards) */}
      {statsCards && (
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8 w-full pt-1 sm:pt-2">
          {statsCards}
        </div>
      )}
    </section>
  );
}
