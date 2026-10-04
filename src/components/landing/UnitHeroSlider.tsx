'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

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

  // If this is SD IT's headline ("Bukan Sekedar / Sekadar")
  if (/bukan\s+(sekedar|sekadar)/i.test(p1)) {
    return (
      <>
        {/* Accent: refined serif italic, sized to hold its own against the large heading */}
        <span className="font-hero-accent block mb-2 text-3xl sm:text-4xl md:text-[2.75rem] italic font-normal tracking-wide leading-snug text-white/90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]">
          Bukan Sekedar
        </span>
        {/* Heading: fixed 3-line structure */}
        <span className="block">Tempat Belajar,</span>
        <span className="block">Namun Juga</span>
        <span className="block">
          <span className={highlightClass}>Tempat Bertumbuh</span>
          {p2 ? (p2.startsWith(',') || p2.startsWith('.') ? p2 : ` ${p2}`) : ' Ananda'}
        </span>
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
  badgeClass
}: HeroContentProps) {
  const pLink = slide.primaryCtaLink || fallbackPrimaryLink;

  return (
    <>
      {/* Minimal Floating Badge — outer layer floats, inner layer handles tactile press so transforms never fight */}
      {slide.badge && (
        <div className="mb-4 sm:mb-5 animate-hero-float">
          <Link
            href={pLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] sm:text-xs font-medium tracking-wider backdrop-blur-md transition-transform duration-200 hover:scale-[1.03] active:scale-95 ${badgeClass}`}
          >
            {slide.badge}
          </Link>
        </div>
      )}

      {/* Main Headline — large & dominant; sm step kept at 2.75rem so line 3 stays on one line */}
      <h1 className="w-full text-4xl sm:text-[2.75rem] md:text-5xl lg:text-6xl font-extrabold leading-[1.12] tracking-tight text-left text-white drop-shadow-lg break-words">
        {renderHeroHeadline(slide.titlePart1, slide.titleHighlight, slide.titlePart2, highlightClass)}
      </h1>

      {/* Subtitle Description — constrained measure to balance with the CTA below */}
      {slide.description && (
        <p className="mt-3 sm:mt-5 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg text-sm lg:text-lg leading-relaxed text-left text-neutral-300 font-normal drop-shadow-sm">
          {slide.description}
        </p>
      )}

      {/* Single Primary CTA — slim, fit-content, left-aligned with the text margin */}
      <Link
        href={pLink}
        target="_blank"
        rel="noopener noreferrer"
        className={`mt-6 inline-flex h-11 items-center justify-start gap-2 px-5 rounded-xl text-white text-sm font-semibold shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:scale-95 cursor-pointer group ${primaryBtnClass}`}
      >
        <span>{slide.primaryCtaText || 'Daftar Sekarang'}</span>
        <ArrowRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" />
      </Link>

      {/* Trust Points - mobile: left-aligned stacked list with hairline dividers; sm+: plain inline row */}
      {slide.trustItems && slide.trustItems.length > 0 && (
        <ul className="mt-6 sm:mt-8 w-full flex flex-col gap-2 text-left text-xs font-medium text-neutral-400 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8 sm:gap-y-2 sm:text-sm sm:font-semibold sm:text-slate-200/90">
          {slide.trustItems.map((item, tIdx) => (
            <li
              key={tIdx}
              className="border-l border-white/20 pl-2.5 leading-snug tracking-wide sm:border-0 sm:pl-0 sm:whitespace-nowrap"
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
  registrationFee = 175000,
  waCenterPhone,
  customSlides
}: UnitHeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const ppdbUrl = `/ppdb/daftar?school=${slug}`;
  const waUrl = `https://wa.me/${waCenterPhone}?text=${encodeURIComponent(
    `Assalamu'alaikum Panitia PPDB ${schoolName}, saya ingin bertanya perihal informasi pendaftaran murid baru TP 2026/2027.`
  )}`;

  // Default unit-tailored slides if no custom slides provided
  const slides: UnitSlideData[] = useMemo(() => {
    if (customSlides && customSlides.length > 0) {
      const first = customSlides[0];
      const slidesToUse = customSlides.slice(0, 3);
      return slidesToUse.map((s, idx) => ({
        ...s,
        id: s.id ?? idx + 1,
        badge: first.badge,
        titlePart1: first.titlePart1,
        titleHighlight: first.titleHighlight,
        titlePart2: first.titlePart2,
        description: first.description,
        primaryCtaText: first.primaryCtaText,
        primaryCtaLink: first.primaryCtaLink,
        secondaryCtaText: first.secondaryCtaText,
        secondaryCtaLink: first.secondaryCtaLink,
        trustItems: first.trustItems,
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
          { icon: 'calendar' as const, text: 'T.A. 2026/2027' },
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
        badge: 'SPMB T.A. 2026/2027 • TELAH DIBUKA',
        titlePart1: 'Bukan Sekedar\nTempat Belajar,\nNamun Juga ',
        titleHighlight: 'Tempat\nBertumbuh',
        titlePart2: ' Ananda',
        description:
          'Mencetak generasi sholeh, cerdas, mandiri, berwawasan, dan berakhlakul islami dengan prinsip Smart Akhlaq Fitrah serta bimbingan metode karakter nabawiyah.',
        primaryCtaText: 'Daftar SPMB SD IT',
        primaryCtaLink: ppdbUrl,
        secondaryCtaText: 'WhatsApp (0895-3222-26104)',
        secondaryCtaLink: 'https://wa.me/62895322226104?text=Assalamu%27alaikum%20Panitia%20SPMB%20SDIT%20Al-Afiyah%2C%20saya%20ingin%20konsultasi%20pendaftaran%20ananda',
        trustItems: [
          { icon: 'shield' as const, text: 'Kuota Terbatas: Hanya 2 Rombel' },
          { icon: 'check' as const, text: 'Smart Akhlaq Fitrah' },
          { icon: 'award' as const, text: 'Iman Sebelum Qur’an & Tahfidz' }
        ]
      };

      return [
        { id: 1, ...baseSdSlide, image: '/images/sd-hero-greenhouse.jpg' },
        { id: 2, ...baseSdSlide, image: '/images/sd-activity-shalat-berjamaah.jpg' },
        { id: 3, ...baseSdSlide, image: '/images/sd-activity-multimedia-learning.jpg' },
      ];
    }

    // Default SMP IT
    const baseSmpSlide = {
      badge: 'SMP IT AL-AFIYAH MAJALENGKA',
      titlePart1: 'Mencetak Pemimpin ',
      titleHighlight: 'Qur’ani Berakhlak',
      titlePart2: ' & Berwawasan Global',
      description:
        'Sekolah Menengah Pertama Islam Terpadu dengan sistem fullday school unggulan. Target hafalan 3-5 juz mutqin & tartil, adab islami, SCD, Mutaba\'ah Digital, serta Futsal Development Program.',
      primaryCtaText: 'Daftar PPDB SMP IT',
      primaryCtaLink: ppdbUrl,
      secondaryCtaText: 'Konsultasi Panitia PPDB',
      secondaryCtaLink: waUrl,
      trustItems: [
        { icon: 'shield' as const, text: 'Terakreditasi A Resmi' },
        { icon: 'award' as const, text: 'Target Tahfidz 3-5 Juz Mutqin' },
        { icon: 'calendar' as const, text: 'T.A. 2026/2027' },
        { icon: 'check' as const, text: `Formulir: Rp ${registrationFee.toLocaleString('id-ID')}` }
      ]
    };

    return [
      { id: 1, ...baseSmpSlide, image: '/images/smp-tubing-1.jpg' },
      { id: 2, ...baseSmpSlide, image: '/images/smp-outing-3.jpg' },
      { id: 3, ...baseSmpSlide, image: '/images/smp-tubing-2.jpg' },
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
          glowColor: 'bg-teal-500/20',
          badgeText: 'text-amber-300/90',
          highlight: 'text-green-500',
          primaryBtn: 'bg-green-600 hover:bg-green-700 shadow-green-950/40'
        };
      case 'smp':
      default:
        return {
          glowColor: 'bg-emerald-700/25',
          badgeText: 'text-teal-200/90',
          highlight: 'text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-300 to-emerald-300',
          primaryBtn: 'bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800 hover:from-emerald-500 hover:to-teal-600 shadow-teal-900/40'
        };
    }
  }, [slug]);

  // Check if all slides have identical text content (e.g. user wants static text overlay with changing background photos)
  const isAllSameContent = useMemo(() => {
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
  }, [slides]);

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
      className="relative bg-slate-950 text-white overflow-hidden select-none w-full min-h-[660px] sm:min-h-[700px] lg:min-h-[740px] flex-shrink-0 flex flex-col justify-start"
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
              />
            </div>
            {/* Multi-Layer Cinematic Contrast Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/40 z-10 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/45 z-10 pointer-events-none" />
            {/* Subtle Unit Theme Ambient Glow */}
            <div
              className={`absolute top-1/4 left-10 w-96 h-96 ${themeConfig.glowColor} rounded-full blur-3xl pointer-events-none z-10`}
            />
          </div>
        );
      })}

      {/* Main Content Container with Zero-Jeda Smooth Crossfade & Header Clearance */}
      <div
        className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20 lg:pb-24 w-full flex flex-col justify-start"
        style={{ paddingTop: 'clamp(108px, 14vh, 140px)' }}
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
    </section>
  );
}
