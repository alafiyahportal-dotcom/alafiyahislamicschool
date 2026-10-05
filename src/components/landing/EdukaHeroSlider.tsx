'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getSchoolUrl } from '@/lib/domain';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  BookOpen
} from 'lucide-react';

export interface FoundationSlideData {
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
}

const baseEdukaSlide = {
  badge: 'SELAMAT DATANG DI YAYASAN PENDIDIKAN IMAM BONJOL',
  titlePart1: 'Membina Generasi ',
  titleHighlight: "Qur'ani",
  titlePart2: ', Cerdas & Berkarakter Unggul',
  description:
    'Lembaga pendidikan Islam terpadu holistik di Majalengka yang memadukan kurikulum nasional, sains modern, dan tahfidz Al-Qur’an berbasis adab nabawi untuk masa depan gemilang.',
  primaryCtaText: 'Daftar PPDB Sekarang',
  primaryCtaLink: '/ppdb/daftar',
  secondaryCtaText: 'Profil Yayasan',
  secondaryCtaLink: '/profil#tentang',
};

const defaultSlides: FoundationSlideData[] = [
  { id: 1, ...baseEdukaSlide, image: '/images/arc-tahfidz.jpg' },
  { id: 2, ...baseEdukaSlide, image: '/images/eduka-hero-campus.jpg' },
  { id: 3, ...baseEdukaSlide, image: '/images/sd-hero-garden.jpg' },
];

interface EdukaHeroSliderProps {
  customSlides?: FoundationSlideData[];
}

export default function EdukaHeroSlider({ customSlides }: EdukaHeroSliderProps = {}) {
  const rawSlides = customSlides && customSlides.length > 0 ? customSlides : defaultSlides;
  const first = rawSlides[0];
  const slides = rawSlides.slice(0, 3).map((s, idx) => ({
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
    image: s.image,
  }));
  
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto advance slides every 4.5s continuously
  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [currentSlide, slides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

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
            {/* Multi-Layer Cinematic Contrast Gradient: Dark vignette on left and bottom for crisp readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/35 z-10 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 z-10 pointer-events-none" />
            {/* Subtle Islamic Teal Ambient Glow */}
            <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#2D7A70]/20 rounded-full blur-3xl pointer-events-none z-10" />
          </div>
        );
      })}

      {/* Main Content Container with Zero-Jeda Smooth Crossfade & Header Clearance */}
      <div
        className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20 lg:pb-24 w-full flex flex-col justify-start"
        style={{ paddingTop: 'clamp(108px, 14vh, 140px)' }}
      >
        <div className="relative max-w-3xl lg:max-w-5xl flex flex-col justify-start space-y-4 sm:space-y-5 text-left">
          {/* Welcome Badge Tagline (Eduka Style) */}
          <div className="max-w-full inline-flex items-center px-3.5 sm:px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 backdrop-blur-md shadow-sm self-start">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-300 truncate [word-spacing:0.1em]">
              {slides[0].badge}
            </span>
          </div>

          {/* Main Headline - Bold, Prominent, Punchy Typography */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.14] sm:leading-[1.12] drop-shadow-lg break-words max-w-3xl lg:max-w-4xl [word-spacing:0.08em]">
            {slides[0].titlePart1.trim()}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400 inline">
              {slides[0].titleHighlight.trim()}
            </span>
            {slides[0].titlePart2.trim().startsWith(',') || slides[0].titlePart2.trim().startsWith('.') 
              ? slides[0].titlePart2 
              : ` ${slides[0].titlePart2.trim()}`}
          </h1>

          {/* Subtitle description */}
          <p className="text-sm sm:text-base lg:text-xl text-slate-200 leading-relaxed font-normal max-w-2xl lg:max-w-3xl drop-shadow-sm [word-spacing:0.06em]">
            {slides[0].description}
          </p>

          {/* Dual Action Buttons (Matching Eduka Reference) */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center space-y-2.5 sm:space-y-0 sm:space-x-4">
            {/* Primary Golden Amber Button */}
            {slides[0].primaryCtaLink.startsWith('http') ? (
              <a
                href={slides[0].primaryCtaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-amber-600/30 hover:shadow-amber-600/50 transition-all flex items-center justify-center space-x-2 cursor-pointer transform hover:-translate-y-0.5 group"
              >
                <span>{slides[0].primaryCtaText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-white" />
              </a>
            ) : (
              <Link
                href={slides[0].primaryCtaLink}
                className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-amber-600/30 hover:shadow-amber-600/50 transition-all flex items-center justify-center space-x-2 cursor-pointer transform hover:-translate-y-0.5 group"
              >
                <span>{slides[0].primaryCtaText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-white" />
              </Link>
            )}

            {/* Secondary Clean White Outline Button */}
            <Link
              href={slides[0].secondaryCtaLink}
              className="w-full sm:w-auto px-6 sm:px-7 py-3.5 sm:py-4 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/30 font-bold text-sm sm:text-base backdrop-blur-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-amber-300" />
              <span>{slides[0].secondaryCtaText}</span>
            </Link>
          </div>

          {/* Clean Editorial Trust Row (Plain Text Spacing without Cards or Dots) */}
          <div className="pt-3 flex flex-wrap items-center gap-x-6 sm:gap-x-8 gap-y-2 text-xs sm:text-sm font-semibold text-slate-200/90">
            <span className="whitespace-nowrap tracking-wide">
              Terakreditasi A Resmi
            </span>
            <span className="whitespace-nowrap tracking-wide hidden sm:inline">
              Kurikulum Terpadu Kemenag &amp; Kemendikbud
            </span>
            <span className="whitespace-nowrap tracking-wide sm:hidden">
              Kurikulum Terpadu
            </span>
            <span className="whitespace-nowrap tracking-wide">
              T.A. 2027/2028
            </span>
          </div>
        </div>
      </div>

      {/* Slider Left & Right Arrow Buttons (Round Floating Style) */}
      <button
        onClick={prevSlide}
        aria-label="Slide Sebelumnya"
        className="hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-amber-500 text-white hover:text-white border border-white/20 hover:border-amber-400 backdrop-blur-md items-center justify-center transition-all cursor-pointer shadow-lg"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Slide Selanjutnya"
        className="hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-amber-500 text-white hover:text-white border border-white/20 hover:border-amber-400 backdrop-blur-md items-center justify-center transition-all cursor-pointer shadow-lg"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Bottom Center Modern Indicator Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Pindah ke slide ${idx + 1}`}
              className={`transition-all duration-300 rounded-full h-2.5 cursor-pointer ${
                idx === currentSlide
                  ? 'w-8 bg-amber-400 shadow-md shadow-amber-400/50'
                  : 'w-2.5 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      )}

    </section>
  );
}
