'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
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
    const boldLine = 'block text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.15] tracking-tight';
    return (
      <>
        <span className="font-hero-accent block text-2xl sm:text-3xl lg:text-4xl italic font-normal tracking-wide leading-tight text-neutral-100 mb-1.5 drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]">
          Bukan Sekedar
        </span>
        {/* Heading: 3 bold lines */}
        <span className={boldLine}>Tempat Belajar,</span>
        <span className={boldLine}>Namun Juga</span>
        <span className={`${boldLine} ${highlightClass} mb-4`}>Tempat Bertumbuh</span>
      </>
    );
  }

  // Standard fallback renderer for other units (TK, SMP, etc.)
  const renderLines = (text: string) =>
    text.split(/\n|<br\s*\/?>/i).map((seg, sIdx) => (
      <React.Fragment key={sIdx}>
        {sIdx > 0 && <br />}
        {seg}
      </React.Fragment>
    ));

  return (
    <>
      {renderLines(p1)}{' '}
      {ph && (
        <span className={`${highlightClass} inline`}>
          {renderLines(ph)}
        </span>
      )}
      {p2 && (p2.startsWith(',') || p2.startsWith('.') ? p2 : ` ${p2}`)}
    </>
  );
}

interface HeroContentProps {
  slide: UnitSlideData;
  fallbackPrimaryLink: string;
  highlightClass: string;
  primaryBtnClass: string;
  badgeClass: string;
}

/** Badge, headline, description, CTA and trust points — shared by static and sliding modes. */
function HeroContent({
  slide,
  fallbackPrimaryLink,
  highlightClass,
  primaryBtnClass,
  badgeClass,
}: HeroContentProps) {
  const [refCode, setRefCode] = useState<string | null>(null);
  const [isOpening, setIsOpening] = useState(false);

  useEffect(() => {
    setRefCode(getStoredReferralCode());
  }, []);

  let rawLink = slide.primaryCtaLink || fallbackPrimaryLink;
  if (refCode && rawLink.includes('/ppdb/daftar')) {
    rawLink += `${rawLink.includes('?') ? '&' : '?'}ref=${encodeURIComponent(refCode)}`;
  }
  const isSpmbLink = rawLink.includes('/ppdb/daftar');

  return (
    <>
      {/* Minimal Floating Badge — outer layer floats, inner layer handles tactile press so transforms never fight */}
      {slide.badge && (
        <div className="mb-4 sm:mb-5 animate-hero-float">
          <Link
            href={rawLink}
            className={`inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] sm:text-xs font-medium tracking-wider backdrop-blur-md transition-transform duration-200 hover:scale-[1.03] active:scale-95 ${badgeClass}`}
          >
            {slide.badge}
          </Link>
        </div>
      )}

      {/* Text block capped so copy never runs into the subject of the background photo */}
      <div className="w-full max-w-xl lg:max-w-2xl text-left">
        {/* Main Headline — large & dominant */}
        <h1 className="w-full text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.15] tracking-tight text-left text-white drop-shadow-lg break-words">
          {renderHeroHeadline(slide.titlePart1, slide.titleHighlight, slide.titlePart2, highlightClass)}
        </h1>

        {/* Subtitle Description — constrained measure to balance with the CTA below */}
        {slide.description && (
          <p className="mt-3.5 sm:mt-5 max-w-sm sm:max-w-md lg:max-w-xl text-sm sm:text-base lg:text-lg leading-relaxed text-left text-neutral-200 font-normal drop-shadow-sm">
            {slide.description}
          </p>
        )}
      </div>

      {/* Single Primary CTA — slim, fit-content, left-aligned with the text margin */}
      <Link
        href={rawLink}
        className={`mt-6 inline-flex h-11 items-center justify-start gap-2 px-5 rounded-xl text-white text-sm font-semibold shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:scale-95 cursor-pointer group ${primaryBtnClass}`}
      >
        <span>{slide.primaryCtaText || 'Daftar SPMB Online'}</span>
        <ArrowRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" />
      </Link>

      {/* Trust Points - mobile: left-aligned stacked list with hairline dividers; sm+: plain inline row */}
      {slide.trustItems && slide.trustItems.length > 0 && (
        <ul className="mt-6 sm:mt-8 w-full flex flex-col gap-2.5 text-left text-xs sm:text-sm font-medium text-neutral-200 space-y-1 sm:space-y-0 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8 sm:gap-y-2 sm:font-semibold">
          {slide.trustItems.map((item, tIdx) => (
            <li
              key={tIdx}
              className="border-l-2 border-emerald-500/60 pl-2.5 leading-snug tracking-wide sm:border-l sm:border-white/20 sm:pl-0 sm:whitespace-nowrap font-medium text-neutral-200"
            >
              {item.text}
            </li>
          ))}
        </ul>
      )}
    </>
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
  const [currentSlide, setCurrentSlide] = useState(0);

  const ppdbUrl = slug === 'sd' ? '/sd/spmb/daftar' : slug === 'smp' ? '/smp/spmb/daftar' : `/ppdb/daftar?school=${slug}`;
  const waUrl = `https://wa.me/${waCenterPhone}?text=${encodeURIComponent(
    `Assalamu'alaikum Panitia SPMB ${schoolName}, saya ingin bertanya perihal informasi pendaftaran murid baru TP 2027/2028.`
  )}`;

  // Default unit-tailored slides if no custom slides provided
  const slides: UnitSlideData[] = useMemo(() => {
    const sanitizeSdTrustItems = (items?: UnitSlideData['trustItems']): UnitSlideData['trustItems'] => {
      const defaultSdItems: NonNullable<UnitSlideData['trustItems']> = [
        { icon: 'shield', text: 'Kurikulum Terpadu & Karakter Nabawiyah' },
        { icon: 'check', text: 'Lingkungan Asri & Ramah Anak' },
        { icon: 'award', text: 'Iman Sebelum Qur’an & Tahfidz' },
        { icon: 'calendar', text: `Formulir: Rp ${registrationFee.toLocaleString('id-ID')}` },
      ];

      if (!items || items.length === 0) return defaultSdItems;

      return items.map((item) => {
        const textLower = item.text.toLowerCase();
        if (textLower.includes('kuota') || textLower.includes('rombel')) {
          return { icon: item.icon || 'shield', text: 'Kurikulum Terpadu & Karakter Nabawiyah' };
        }
        if (textLower.includes('smart')) {
          return { icon: item.icon || 'check', text: 'Lingkungan Asri & Ramah Anak' };
        }
        return item;
      });
    };

    if (customSlides && customSlides.length > 0) {
      const first = customSlides[0];
      const slidesToUse = customSlides.slice(0, 3);
      return slidesToUse.map((s, idx) => ({
        ...s,
        id: s.id ?? idx + 1,
        badge: first.badge,
        titlePart1: first.titlePart1,
        titleHighlight: first.titleHighlight,
        titlePart2: (first.titlePart2 || '').replace(/ananda/gi, '').trim(),
        description: first.description,
        primaryCtaText: first.primaryCtaText,
        primaryCtaLink: first.primaryCtaLink,
        secondaryCtaText: first.secondaryCtaText,
        secondaryCtaLink: first.secondaryCtaLink,
        trustItems: slug === 'sd' ? sanitizeSdTrustItems(first.trustItems) : first.trustItems,
        image: s.image,
      }));
    }

    if (slug === 'tk') {
      const baseTkSlide = {
        badge: 'PAUD & TK IT AL-AFIYAH MAJALENGKA',
        titlePart1: 'Tumbuh Ceria, Mandiri & ',
        titleHighlight: 'Berakhlak Shalih',
        titlePart2: ' Sejak Usia Emas',
        description:
          'Pendidikan anak usia dini berbasis sentra bermain bermakna, pembiasaan adab nabawiyah, serta stimulasi motorik ramah anak dengan bimbingan guru pendidik penuh kasih sayang.',
        primaryCtaText: 'Daftar Murid Baru TK',
        primaryCtaLink: ppdbUrl,
        secondaryCtaText: 'Konsultasi WhatsApp',
        secondaryCtaLink: waUrl,
        trustItems: [
          { icon: 'shield' as const, text: 'Terakreditasi Resmi' },
          { icon: 'users' as const, text: 'Rasio Kelas Ramah 1:8' },
          { icon: 'calendar' as const, text: 'T.A. 2027/2028' },
          { icon: 'check' as const, text: `Formulir: Rp ${registrationFee.toLocaleString('id-ID')}` }
        ]
      };

      return [
        { id: 1, ...baseTkSlide, image: '/images/tk-hero-kids.jpg' },
        { id: 2, ...baseTkSlide, image: '/images/tk-hero-garden.jpg' },
        { id: 3, ...baseTkSlide, image: '/images/eduka-study-group.jpg' },
      ];
    }

    if (slug === 'sd') {
      const baseSdSlide = {
        badge: 'SPMB T.A. 2027/2028 • TELAH DIBUKA',
        titlePart1: 'Bukan Sekedar Tempat Belajar, Namun Juga ',
        titleHighlight: 'Tempat Bertumbuh',
        titlePart2: '',
        description:
          'Mencetak generasi sholeh, cerdas, mandiri, berwawasan, dan berakhlakul islami dengan prinsip Smart Akhlak Fitrah serta bimbingan metode karakter nabawiyah.',
        primaryCtaText: 'Daftar SPMB SDIT',
        primaryCtaLink: ppdbUrl,
        secondaryCtaText: 'WhatsApp (0813-1013-9001)',
        secondaryCtaLink: 'https://wa.me/6281310139001?text=Assalamu%27alaikum%20Panitia%20SPMB%20SDIT%20Al-Afiyah%2C%20saya%20ingin%20konsultasi%20pendaftaran',
        trustItems: [
          { icon: 'shield' as const, text: 'Kurikulum Terpadu & Karakter Nabawiyah' },
          { icon: 'check' as const, text: 'Lingkungan Asri & Ramah Anak' },
          { icon: 'award' as const, text: 'Iman Sebelum Qur’an & Tahfidz' },
          { icon: 'calendar' as const, text: `Formulir: Rp ${registrationFee.toLocaleString('id-ID')}` }
        ]
      };

      return [
        { id: 1, ...baseSdSlide, image: '/images/sd-hero-greenhouse.jpg' },
        { id: 2, ...baseSdSlide, image: '/images/sd-hero-garden.jpg' },
        { id: 3, ...baseSdSlide, image: '/images/sd-hero-activity.jpg' },
      ];
    }

    // Default SMP IT
    const baseSmpSlide = {
      badge: 'SPMB T.A. 2027/2028 • BE SMART & RELIGIOUS',
      titlePart1: 'Mencetak Generasi ',
      titleHighlight: 'Smart & Religious',
      titlePart2: ' Berakhlak Qur’ani',
      description:
        'Sekolah Menengah Pertama Islam Terpadu Terakreditasi A. Target hafalan 3-5+ juz mutqin, fasih Bahasa Arab aktif, SCD & Mutaba\'ah Digital, serta Futsal Development Program.',
      primaryCtaText: 'Daftar SPMB SMP IT',
      primaryCtaLink: ppdbUrl,
      secondaryCtaText: 'Konsultasi Panitia (0822-4935-7893)',
      secondaryCtaLink: waUrl,
      trustItems: [
        { icon: 'shield' as const, text: 'Terakreditasi A Resmi' },
        { icon: 'award' as const, text: 'Target Tahfidz 3-5+ Juz Mutqin' },
        { icon: 'calendar' as const, text: 'Diskon Uang Bangunan s.d. 70%' },
        { icon: 'check' as const, text: `Formulir: Rp ${registrationFee.toLocaleString('id-ID')}` }
      ]
    };

    return [
      { id: 1, ...baseSmpSlide, image: '/images/smp-spmb-poster.png' },
      { id: 2, ...baseSmpSlide, image: '/images/smp-tubing-1.jpg' },
      { id: 3, ...baseSmpSlide, image: '/images/smp-outing-3.jpg' },
    ];
  }, [slug, ppdbUrl, waUrl, registrationFee, customSlides]);

  // Unit theme configuration
  const themeConfig = useMemo(() => {
    switch (slug) {
      case 'tk':
        return {
          glowColor: 'bg-emerald-500/20',
          badgeText: 'text-emerald-300/90',
          highlight: 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-amber-300 to-yellow-300',
          primaryBtn: 'bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 hover:from-emerald-500 hover:to-teal-700 shadow-emerald-900/40'
        };
      case 'sd':
        return {
          glowColor: 'bg-[#00A651]/20',
          badgeText: 'text-[#00A651]',
          highlight: 'text-[#00A651]',
          primaryBtn: 'bg-[#00A651] hover:bg-[#008f45] shadow-[#00A651]/40 text-white font-bold'
        };
      case 'smp':
      default:
        return {
          glowColor: 'bg-[#030164]/40',
          badgeText: 'text-[#ffd51e] border-[#ffd51e]/30 bg-[#030164]/60',
          highlight: 'text-transparent bg-clip-text bg-gradient-to-r from-[#ffd51e] via-amber-200 to-yellow-300',
          primaryBtn: 'bg-[#030164] hover:bg-[#02004d] text-white border border-[#ffd51e]/40 shadow-lg shadow-[#030164]/50 font-bold'
        };
    }
  }, [slug]);

  // Check if all slides have identical text content (e.g. user wants static text overlay with changing background photos)
  const isAllSameContent = useMemo(() => {
    if (slug === 'sd') return true;
    if (slides.length <= 1) return true;
    const first = slides[0];
    return slides.every(
      (s) =>
        (s.titlePart1 || '').trim() === (first.titlePart1 || '').trim() &&
        (s.titleHighlight || '').trim() === (first.titleHighlight || '').trim() &&
        (s.titlePart2 || '').trim() === (first.titlePart2 || '').trim() &&
        (s.description || '').trim() === (first.description || '').trim() &&
        (s.primaryCtaText || '').trim() === (first.primaryCtaText || '').trim()
    );
  }, [slides, slug]);

  // Auto advance slides every 4.5s continuously
  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [currentSlide, slides.length]);

  return (
    <section
      className="relative bg-slate-950 text-white overflow-hidden select-none w-full flex-shrink-0 flex flex-col justify-start"
      style={{ minHeight: '680px' }}
    >
      {/* Background Slides with Ken Burns Zoom & Smooth Seamless Crossfade */}
      {slides.map((s, idx) => {
        const isActive = idx === currentSlide;
        return (
          <div
            key={s.id || idx}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
            }`}
            style={{ minHeight: '100%', height: '100%' }}
          >
            {/* Smooth Continuous Zoom Container */}
            <div className={`absolute inset-0 w-full h-full overflow-hidden ${isActive ? 'animate-kenburns' : 'scale-100'}`}>
              <Image
                src={s.image}
                alt={s.badge || 'Hero Slide'}
                fill
                priority={idx === 0}
                className="object-cover object-center"
                sizes="100vw"
                unoptimized={s.image?.startsWith('data:')}
              />
            </div>
            {/* Multi-Layer Cinematic Contrast Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/40 z-10 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30 z-10 pointer-events-none" />
            {/* Subtle Unit Theme Ambient Glow */}
            <div
              className={`absolute top-1/4 left-10 w-96 h-96 ${themeConfig.glowColor} rounded-full blur-3xl pointer-events-none z-10`}
            />
          </div>
        );
      })}

      {/* Main Content Container with Zero-Jeda Smooth Crossfade & Header Clearance */}
      <div
        className={`relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col justify-start ${
          statsCards ? 'pb-3 sm:pb-5' : 'pb-16 sm:pb-20 lg:pb-24'
        }`}
        style={{ paddingTop: 'clamp(96px, 12vh, 128px)' }}
      >
        {isAllSameContent ? (
          <div className="relative w-full max-w-3xl lg:max-w-5xl flex flex-col items-start justify-start text-left">
            <HeroContent
              slide={slides[0]}
              fallbackPrimaryLink={ppdbUrl}
              highlightClass={themeConfig.highlight}
              primaryBtnClass={themeConfig.primaryBtn}
              badgeClass={themeConfig.badgeText}
            />
          </div>
        ) : (
          <div className="relative max-w-3xl lg:max-w-5xl min-h-[480px] sm:min-h-[500px] lg:min-h-[530px]">
            {slides.map((s, idx) => {
              const isTextActive = idx === currentSlide;

              return (
                <div
                  key={s.id || idx}
                  className={`absolute inset-x-0 top-0 flex flex-col items-start justify-start text-left transition-all duration-700 ease-in-out ${
                    isTextActive
                      ? 'opacity-100 translate-y-0 pointer-events-auto z-10'
                      : 'opacity-0 translate-y-2 pointer-events-none z-0'
                  }`}
                >
                  <HeroContent
                    slide={s}
                    fallbackPrimaryLink={ppdbUrl}
                    highlightClass={themeConfig.highlight}
                    primaryBtnClass={themeConfig.primaryBtn}
                    badgeClass={themeConfig.badgeText}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Hero Bottom Highlight Cards nested inside the banner */}
      {statsCards && (
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12 w-full pt-1 sm:pt-2">
          {statsCards}
        </div>
      )}
    </section>
  );
}
