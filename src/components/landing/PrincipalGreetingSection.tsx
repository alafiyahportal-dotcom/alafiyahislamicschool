'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollReveal from './ScrollReveal';
import {
  Quote,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Check,
} from 'lucide-react';

interface PrincipalGreetingProps {
  schoolSlug?: string;
}

/* ─── Authentic Custom SVG Icons Matching the Principal's Presentation ─── */

function TreeIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="currentColor" className={className} aria-hidden="true">
      <path d="M32 6c-6.2 0-11.4 4.1-13.1 9.7C13.3 16.5 9 21.3 9 27.2c0 4.4 2.5 8.3 6.2 10.2-.2.9-.2 1.8-.2 2.6 0 5.5 4.5 10 10 10 1.4 0 2.8-.3 4-.9V56c0 1.1-.9 2-2 2h-2v2h14v-2h-2c-1.1 0-2-.9-2-2v-6.9c1.2.6 2.6.9 4 .9 5.5 0 10-4.5 10-10 0-.8-.1-1.7-.2-2.6 3.7-1.9 6.2-5.8 6.2-10.2 0-5.9-4.3-10.7-9.9-11.5C43.4 10.1 38.2 6 32 6zm-3 36.2c-2.2-1.8-3.8-4.2-4.5-6.9h2.6c.6 1.7 1.6 3.2 2.9 4.4v2.5zm6 0v-2.5c1.3-1.2 2.3-2.7 2.9-4.4h2.6c-.7 2.7-2.3 5.1-4.5 6.9z" />
    </svg>
  );
}

function HeartIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="currentColor" className={className} aria-hidden="true">
      <path d="M32 56.6l-3.9-3.5C14.4 40.7 6 33.1 6 22.9 6 14.8 12.3 8.5 20.4 8.5c4.6 0 9 2.1 11.6 5.5 2.6-3.4 7-5.5 11.6-5.5C51.7 8.5 58 14.8 58 22.9c0 10.2-8.4 17.8-22.1 30.2L32 56.6z" />
    </svg>
  );
}

function BrainIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="currentColor" className={className} aria-hidden="true">
      <path d="M32 10c-4.5 0-8.4 2.5-10.4 6.2C16.2 16.9 12 21.5 12 27c0 2.8 1.1 5.4 2.9 7.3-.6 1.4-.9 3-.9 4.7 0 6.1 4.9 11 11 11h3v6h4V46c0-4.4 3.6-8 8-8h2v-4h-2c-3.5 0-6.6 1.5-8.8 3.9V30h5.2l3.4-3.4-2.8-2.8L33 28.2V22h-4v8.2l-4.4-4.4-2.8 2.8L26.2 33H29v13h-4c-3.9 0-7-3.1-7-7 0-1.3.4-2.6 1.1-3.6l.8-1.2-1-.9C17.1 31.7 16 29.4 16 27c0-3.9 3.1-7 7-7h1.3l.6-1.2C26.3 15.9 29 14 32 14s5.7 1.9 7.1 4.8l.6 1.2H41c3.9 0 7 3.1 7 7 0 2.4-1.1 4.7-2.9 6.3l-1 .9.8 1.2c.7 1 1.1 2.3 1.1 3.6 0 3.9-3.1 7-7 7h-3v6h4v-2.1c5.1-.5 9-4.8 9-9.9 0-1.7-.3-3.3-.9-4.7 1.8-1.9 2.9-4.5 2.9-7.3 0-5.5-4.2-10.1-9.6-10.8C40.4 12.5 36.5 10 32 10z" />
    </svg>
  );
}

function PodiumIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="currentColor" className={className} aria-hidden="true">
      <circle cx="32" cy="11" r="4" />
      <path d="M23 14l5 5h8l5-5 2.5 2.5-6.5 6.5V35h-3v-7h-4v7h-3V23l-6.5-6.5L23 14z" />
      <circle cx="15" cy="19" r="3.5" />
      <path d="M11 25h8c1.7 0 3 1.3 3 3v7h-2.5v6h-9v-6H8v-7c0-1.7 1.3-3 3-3z" />
      <circle cx="49" cy="21" r="3.5" />
      <path d="M45 27h8c1.7 0 3 1.3 3 3v7h-2.5v6h-9v-6H42v-7c0-1.7 1.3-3 3-3z" />
      <path d="M6 43h16v-6h20v8h16v11H6V43z" />
    </svg>
  );
}

function GrowthStageIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="currentColor" className={className} aria-hidden="true">
      <circle cx="46" cy="18" r="7.5" />
      <path d="M22 28c4.5 0 11 1.5 15 5l6 10c1 1.7.4 3.8-1.3 4.8-1.7 1-3.8.4-4.8-1.3l-4.6-7.7-8.3-1.3v9.5c0 2.2-1.8 4-4 4h-7c-2.2 0-4-1.8-4-4s1.8-4 4-4h3v-7c0-4.4 3.6-8 6-8z" />
    </svg>
  );
}

interface SlideTopic {
  id: string;
  stepNumber: string;
  shortLabel: string;
  title: string;
  subtitle: string;
  cardGradient: string;
  glowColor: string;
  progressGradient: string;
  tabActiveClass: string;
  badgeClass: string;
  iconBg: string;
  iconType: 'tree' | 'equality' | 'heart' | 'brain' | 'podium' | 'growth';
  description: string[];
  highlights: string[];
  comparisonColumns?: {
    leftTitle: string;
    leftBadge: string;
    leftItems: string[];
    rightTitle: string;
    rightBadge: string;
    rightItems: string[];
  };
  numberedPrinciples?: string[];
}

const CHARACTER_SLIDES: SlideTopic[] = [
  {
    id: 'nabawiyah',
    stepNumber: '01',
    shortLabel: 'Karakter Nabawiyah',
    title: 'Pendidikan Karakter Nabawiyah',
    subtitle: 'Metode Generasi Terbaik: Rasulullah ﷺ, Para Sahabat, Tabi’in & Tabi’ut Tabi’in',
    cardGradient: 'bg-gradient-to-br from-[#0a4b29] via-[#064e3b] to-[#043322]',
    glowColor: 'bg-emerald-400/20',
    progressGradient: 'from-[#00A651] via-emerald-400 to-amber-400',
    tabActiveClass: 'bg-[#0a4b29] text-white border-[#0a4b29]',
    badgeClass: 'bg-emerald-400/20 text-emerald-100 border-emerald-300/30',
    iconBg: 'bg-emerald-100 text-[#064e3b]',
    iconType: 'tree',
    description: [
      'SDIT Al-Afiyah meyakini bahwa setiap anak lahir dalam keadaan fitrah, yaitu memiliki kecenderungan untuk menerima kebenaran dan mengamalkannya. Oleh karena itu, sekolah tidak hanya menjadi ruang transfer ilmu, tetapi menjadi lingkungan tumbuh yang aman, menyenangkan, dan penuh makna.',
    ],
    numberedPrinciples: [
      'Pendidikan karakter adalah pendidikan yang meyakini bahwa setiap anak terlahir dalam keadaan fitrah.',
      'Pendidikan karakter adalah pendidikan yang menjaga dan menumbuhkan karakter-karakter baik yang sudah ada pada diri anak.',
      'Pendidikan karakter menggunakan metode pembelajaran yang telah diwahyukan kepada Rasulullah ﷺ.',
    ],
    highlights: ['Berbasis Fitrah Anak', 'Menjaga & Menumbuhkan', 'Metode Wahyu Nabawiyah'],
  },
  {
    id: 'kadar-karakter',
    stepNumber: '02',
    shortLabel: 'Sama & Unik',
    title: '2 Kadar Karakter Pembawaan Anak',
    subtitle: 'Keseimbangan antara Nilai yang Ditumbuhkan Bersama & Keunikan Tiap Pribadi Anak',
    cardGradient: 'bg-gradient-to-br from-[#0d543e] via-[#064e3b] to-[#073b3a]',
    glowColor: 'bg-amber-400/20',
    progressGradient: 'from-emerald-500 via-teal-400 to-amber-400',
    tabActiveClass: 'bg-[#0d543e] text-white border-[#0d543e]',
    badgeClass: 'bg-amber-400/20 text-amber-100 border-amber-300/30',
    iconBg: 'bg-amber-400 text-slate-950',
    iconType: 'equality',
    description: [
      'Karakter pembawaan yang telah ada pada diri manusia—terkait dengan kadar kesamaan karakter antarpribadi anak—terbagi menjadi dua dimensi utama yang ditumbuhkan secara selaras:',
    ],
    comparisonColumns: {
      leftTitle: '1. Semua Anak Sama',
      leftBadge: 'Ditumbuhkan ke Semua Anak',
      leftItems: [
        'Kecintaan kepada Allah ﷻ',
        'Kecintaan kepada Ibadah',
        'Adab dan Akhlak Mulia',
        'Kecintaan Belajar & Karakter Perkembangan',
      ],
      rightTitle: '2. Masing-Masing Anak Berbeda',
      rightBadge: 'Anak Menjadi Unik • Menyesuaikan Keunikan Anak',
      rightItems: [
        'Allah Ta’ala memberikan karunia karakter yang berbeda-beda pada setiap anak',
        'Gaya belajar dan bakat yang berbeda pada masing-masing anak',
        'Penumbuhannya menyesuaikan keunikan setiap anak tanpa diseragamkan secara kaku',
      ],
    },
    highlights: ['Ditumbuhkan ke Semua Anak', 'Anak Menjadi Unik', 'Menyesuaikan Keunikan Anak'],
  },
  {
    id: 'iman',
    stepNumber: '03',
    shortLabel: 'Karakter Iman',
    title: 'Karakter Iman',
    subtitle: 'Pondasi Tauhid, Kecintaan Ibadah, dan Ilmu sebagai Dasar Seluruh Perilaku',
    cardGradient: 'bg-gradient-to-br from-[#0b4d2c] via-[#064e3b] to-[#1e3a2f]',
    glowColor: 'bg-rose-500/20',
    progressGradient: 'from-rose-500 via-red-400 to-amber-400',
    tabActiveClass: 'bg-rose-600 text-white border-rose-600',
    badgeClass: 'bg-rose-500/25 text-rose-100 border-rose-300/30',
    iconBg: 'bg-rose-500 text-white',
    iconType: 'heart',
    description: [
      'Setiap anak memiliki karakter iman, yaitu setiap anak dilahirkan dalam keadaan mentauhidkan Allah ﷻ serta memiliki kecenderungan fitrah untuk mencintai kebenaran.',
      'Dengan sepenuh hati, guru menyajikan pendidikan iman, menumbuhkan kecintaan dan kesadaran terhadap syariat agama, mencintai ibadah, berakhlak mulia, dan menjadikan ilmu sebagai dasar seluruh perilaku.',
    ],
    highlights: ['Mentauhidkan Allah ﷻ', 'Cinta Syariat & Ibadah', 'Ilmu Dasar Seluruh Perilaku'],
  },
  {
    id: 'belajar',
    stepNumber: '04',
    shortLabel: 'Karakter Belajar',
    title: 'Karakter Belajar',
    subtitle: 'Menumbuhkan Rasa Ingin Tahu dalam Lingkungan yang Aman & Menyenangkan',
    cardGradient: 'bg-gradient-to-br from-[#084c3a] via-[#0f5156] to-[#063940]',
    glowColor: 'bg-cyan-400/20',
    progressGradient: 'from-teal-400 via-cyan-400 to-emerald-400',
    tabActiveClass: 'bg-[#0f5156] text-white border-[#0f5156]',
    badgeClass: 'bg-cyan-400/20 text-cyan-100 border-cyan-300/30',
    iconBg: 'bg-white text-[#064e3b]',
    iconType: 'brain',
    description: [
      'Anak ditumbuhkan rasa ingin tahunya, menampakkan gaya belajar anak, semangat menjelajah, keberanian mencoba, dan ketangguhan dalam proses belajar.',
      'Di sekolah, anak merasa aman meski berbuat salah, karena kesalahan adalah bagian dari perjalanan tumbuh—sebab Allah Ta’ala menciptakan setiap manusia sebagai pembelajar yang tangguh. Apabila kecintaan sudah tumbuh, maka anak akan belajar dengan sendirinya.',
    ],
    highlights: ['Rasa Ingin Tahu & Menjelajah', 'Aman Mencoba Tanpa Takut Salah', 'Belajar Mandiri karena Cinta'],
  },
  {
    id: 'bakat',
    stepNumber: '05',
    shortLabel: 'Karakter Bakat',
    title: 'Karakter Bakat',
    subtitle: 'Setiap Anak Akan Menghebat pada Waktunya & Berperan bagi Peradaban',
    cardGradient: 'bg-gradient-to-br from-[#0b4f2b] via-[#14532d] to-[#052e16]',
    glowColor: 'bg-amber-400/25',
    progressGradient: 'from-amber-400 via-yellow-400 to-emerald-400',
    tabActiveClass: 'bg-amber-600 text-white border-amber-600',
    badgeClass: 'bg-amber-400/25 text-amber-100 border-amber-300/40',
    iconBg: 'bg-amber-400 text-slate-950',
    iconType: 'podium',
    description: [
      'Setiap anak dianugerahi oleh Allah bakat yang hebat dengan potensi unik. Sekolah membantu mereka menjaga fitrahnya dan mengembangkan bakatnya tanpa terburu-buru, karena setiap anak akan menghebat pada waktunya. Tugas kita adalah menumbuhkan kemandirian anak dalam melaksanakan segala sesuatu yang dipelajarinya.',
      'Setelah kecintaan telah tumbuh, sifat pembelajar telah tumbuh, dan kemandirian telah tumbuh, maka diharapkan anak sudah mulai berperan pada peradaban sebagaimana seorang yang tumbuh dewasa—berperan sebagai pribadi yang memiliki akhlak mulia, kreatif, dan produktif.',
    ],
    highlights: ['Menghebat pada Waktunya', 'Kemandirian Mengamalkan Ilmu', 'Kreatif & Produktif bagi Peradaban'],
  },
  {
    id: 'perkembangan',
    stepNumber: '06',
    shortLabel: 'Karakter Perkembangan',
    title: 'Karakter Perkembangan',
    subtitle: 'Perubahan Bertahap, Sistematis, dan Berkesinambungan Menuju Kedewasaan',
    cardGradient: 'bg-gradient-to-br from-[#0a5230] via-[#047857] to-[#064e3b]',
    glowColor: 'bg-lime-400/20',
    progressGradient: 'from-lime-400 via-emerald-400 to-teal-400',
    tabActiveClass: 'bg-[#047857] text-white border-[#047857]',
    badgeClass: 'bg-lime-300/20 text-lime-100 border-lime-300/30',
    iconBg: 'bg-emerald-200 text-[#064e3b]',
    iconType: 'growth',
    description: [
      'Setiap manusia akan mengalami fase perkembangan dalam hidupnya, mulai dari penciptaan sampai usia dewasa hingga tutup usia.',
      'Perkembangan manusia adalah proses terjadinya berbagai perubahan bertahap yang dialami individu menuju tingkat kedewasaan atau kematangan, yang berlangsung secara sistematis, berproses, dan berkesinambungan—baik secara fisik maupun psikis.',
    ],
    highlights: ['Fase Tumbuh Bertahap', 'Sistematis & Berkesinambungan', 'Kematangan Fisik & Psikis'],
  },
];

function renderTopicIcon(type: SlideTopic['iconType'], className = 'w-6 h-6') {
  switch (type) {
    case 'tree':
    case 'equality':
      return <TreeIcon className={className} />;
    case 'heart':
      return <HeartIcon className={className} />;
    case 'brain':
      return <BrainIcon className={className} />;
    case 'podium':
      return <PodiumIcon className={className} />;
    case 'growth':
      return <GrowthStageIcon className={className} />;
  }
}

export default function PrincipalGreetingSection({ schoolSlug = 'sd' }: PrincipalGreetingProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);

  const totalSlides = CHARACTER_SLIDES.length;
  const activeSlide = CHARACTER_SLIDES[activeIndex];

  const handleNext = useCallback(() => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const handleSelectSlide = (index: number) => {
    setDirection(index >= activeIndex ? 1 : -1);
    setActiveIndex(index);
  };

  // Auto-advance every 6.5 seconds unless paused
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      handleNext();
    }, 6500);
    return () => clearInterval(timer);
  }, [isPaused, handleNext]);

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-emerald-50/50 via-white to-emerald-50/30 relative overflow-hidden border-b border-emerald-100">
      {/* Subtle Ambient Background */}
      <div className="absolute top-12 right-[-120px] w-96 h-96 bg-emerald-200/35 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-12 left-[-120px] w-96 h-96 bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <ScrollReveal yOffset={24} duration={500} className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest text-[#064e3b] mb-3 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300/70">
            <span className="w-2 h-2 rounded-full bg-[#00A651]" />
            <span>Sambutan Kepala Sekolah &amp; Filosofi Pendidikan</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-[42px] font-black text-slate-900 tracking-tight leading-[1.15]">
            SDIT Al-Afiyah: Bukan Sekadar{' '}
            <span className="text-[#00A651]">Tempat Belajar</span>, Namun Juga{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#00A651]">
              Tempat Bertumbuh
            </span>
          </h2>

          <p className="text-xs sm:text-sm lg:text-base text-slate-600 mt-3 leading-relaxed">
            Literasi konsep <strong>Pendidikan Karakter Nabawiyah</strong> oleh Kepala Sekolah SDIT Al-Afiyah Majalengka dalam menjaga fitrah, iman, belajar, bakat, dan tumbuh kembang setiap anak.
          </p>
        </ScrollReveal>

        {/* Main Card Container */}
        <ScrollReveal delay={0.1} yOffset={24} duration={500}>
          <div
            className="bg-gradient-to-b from-white via-emerald-50/25 to-white rounded-3xl shadow-md border border-emerald-200/80 relative overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Top Accent Ribbon */}
            <div className="h-2 w-full bg-gradient-to-r from-[#064e3b] via-[#00A651] to-[#f59e0b]" />

            <div className="p-6 sm:p-10 lg:p-12">
              {/* Top Editorial Introduction (Full-Width, Clean without Side Map Box) */}
              <div className="relative pb-7 mb-7 border-b border-emerald-200/70">
                <Quote className="hidden sm:block absolute top-0 right-0 w-14 h-14 text-emerald-100 pointer-events-none" />

                <div className="inline-block text-xs font-extrabold text-[#064e3b] bg-emerald-100/80 px-3 py-1 rounded-lg tracking-wider uppercase mb-2.5">
                  Bismillaahirrohmaanirrohiim
                </div>
                <h3 className="text-base sm:text-xl font-extrabold text-slate-900 mb-4">
                  Assalamu’alaikum Warahmatullahi Wabarakatuh
                </h3>

                <div className="space-y-3.5 text-xs sm:text-sm lg:text-[15px] text-slate-700 leading-relaxed">
                  <p>
                    <strong className="text-[#064e3b]">SDIT Al-Afiyah</strong> meyakini bahwa setiap anak lahir dalam keadaan <strong className="text-[#064e3b]">fitrah</strong>, yaitu memiliki kecenderungan alami untuk menerima kebenaran dan mengamalkannya. Setiap anak memiliki <strong className="text-slate-900">karakter iman</strong> (dilahirkan dalam keadaan mentauhidkan Allah ﷻ), dikaruniai <strong className="text-slate-900">karakter belajar</strong> serta <strong className="text-slate-900">karakter perkembangan</strong>, dan dianugerahi <strong className="text-slate-900">bakat yang unik</strong> dengan potensi hebat yang akan tumbuh pada waktunya.
                  </p>
                  <p>
                    Oleh karena itu, sekolah tidak hanya menjadi ruang transfer ilmu, tetapi menjadi <span className="bg-emerald-100/90 text-emerald-950 font-semibold px-2 py-0.5 rounded-md border border-emerald-300/80">lingkungan tumbuh yang aman, menyenangkan, dan penuh makna</span> dengan mengusung konsep <strong>Metode Pendidikan Karakter Nabawiyah</strong> yang dibawa oleh generasi terbaik: generasi Nabi Muhammad ﷺ, para Sahabat, Tabi’in, dan Tabi’ut Tabi’in.
                  </p>
                </div>
              </div>

              {/* Interactive Motion Carousel Header & Pill Tabs */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-2 overflow-x-auto pb-1.5 sm:pb-0 no-scrollbar">
                  {CHARACTER_SLIDES.map((slide, idx) => {
                    const isActive = idx === activeIndex;
                    return (
                      <button
                        key={slide.id}
                        type="button"
                        onClick={() => handleSelectSlide(idx)}
                        className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 border ${
                          isActive
                            ? `${slide.tabActiveClass} shadow-sm scale-[1.02]`
                            : 'bg-emerald-50/70 text-emerald-950 border-emerald-200/80 hover:bg-emerald-100/80'
                        }`}
                      >
                        <span
                          className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                            isActive ? 'bg-white/20 text-white' : 'bg-emerald-200/80 text-emerald-900'
                          }`}
                        >
                          {slide.stepNumber}
                        </span>
                        <span>{slide.shortLabel}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Auto-play & Prev/Next Controls */}
                <div className="flex items-center justify-end gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsPaused((p) => !p)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-200/80 text-xs font-semibold transition-colors"
                    title={isPaused ? 'Jalankan Otomatis' : 'Jeda Pergantian Otomatis'}
                  >
                    {isPaused ? <Play className="w-3.5 h-3.5 text-[#00A651]" /> : <Pause className="w-3.5 h-3.5 text-[#064e3b]" />}
                    <span>{isPaused ? 'Putar Otomatis' : 'Berganti Otomatis'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-200/80 transition-colors"
                    aria-label="Materi Sebelumnya"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-200/80 transition-colors"
                    aria-label="Materi Selanjutnya"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Animated Progress Bar */}
              <div className="w-full h-1.5 bg-emerald-100 rounded-full overflow-hidden mb-5">
                <motion.div
                  key={`${activeSlide.id}-${isPaused ? 'paused' : 'playing'}`}
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{
                    duration: isPaused ? 0.2 : 6.5,
                    ease: 'linear',
                  }}
                  className={`h-full bg-gradient-to-r ${activeSlide.progressGradient}`}
                />
              </div>

              {/* Colorful Animated Slide Content Box (Matching Principal's Green Presentation Deck) */}
              <div
                className={`relative min-h-[290px] sm:min-h-[260px] rounded-2xl ${activeSlide.cardGradient} text-white border border-emerald-700/50 p-6 sm:p-8 shadow-lg overflow-hidden transition-colors duration-500`}
              >
                {/* Decorative Glow Orbs inside Card */}
                <div className={`absolute -top-20 -right-20 w-72 h-72 ${activeSlide.glowColor} rounded-full blur-3xl pointer-events-none`} />
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-emerald-300/10 rounded-full blur-3xl pointer-events-none" />

                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={activeSlide.id}
                    custom={direction}
                    initial={{ opacity: 0, x: direction * 36, y: 6 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    exit={{ opacity: 0, x: direction * -36, y: -6 }}
                    transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                    className="relative z-10 space-y-5"
                  >
                    {/* Slide Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/15">
                      <div className="flex items-start sm:items-center gap-4">
                        <motion.div
                          initial={{ scale: 0.8, rotate: -6 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ duration: 0.35 }}
                          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${activeSlide.iconBg} flex items-center justify-center shadow-md shrink-0`}
                        >
                          {renderTopicIcon(activeSlide.iconType, 'w-7 h-7 sm:w-8 sm:h-8')}
                        </motion.div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${activeSlide.badgeClass}`}>
                              Materi {activeSlide.stepNumber} / 06
                            </span>
                          </div>
                          <h4 className="text-lg sm:text-2xl font-black text-white mt-1">
                            {activeSlide.title}
                          </h4>
                          <p className="text-xs sm:text-sm font-medium text-emerald-100/90 mt-0.5">
                            {activeSlide.subtitle}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Slide Paragraphs */}
                    <div className="space-y-3 text-xs sm:text-sm lg:text-[15px] text-emerald-50/95 leading-relaxed">
                      {activeSlide.description.map((para, i) => (
                        <p key={i}>{para}</p>
                      ))}
                    </div>

                    {/* Optional Numbered Principles (Slide 1) */}
                    {activeSlide.numberedPrinciples && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
                        {activeSlide.numberedPrinciples.map((principle, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.08 * (idx + 1), duration: 0.3 }}
                            className="bg-white/12 backdrop-blur-xs rounded-xl p-4 border border-white/20 flex flex-col justify-between"
                          >
                            <div className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 text-xs font-black flex items-center justify-center mb-2.5 shadow-xs">
                              {idx + 1}
                            </div>
                            <p className="text-xs sm:text-sm font-semibold text-white leading-relaxed">
                              {principle}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {/* Optional Two-Column Comparison (Slide 2: Semua Anak Sama vs Masing-Masing Anak Berbeda) */}
                    {activeSlide.comparisonColumns && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                        <motion.div
                          initial={{ opacity: 0, x: -16 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1, duration: 0.35 }}
                          className="bg-white/12 backdrop-blur-xs rounded-2xl p-4 sm:p-5 border border-emerald-300/30"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2.5 border-b border-white/15">
                            <h5 className="text-sm sm:text-base font-black text-white">
                              {activeSlide.comparisonColumns.leftTitle}
                            </h5>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-400 text-slate-950 text-[11px] font-extrabold shadow-2xs">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              {activeSlide.comparisonColumns.leftBadge}
                            </span>
                          </div>
                          <ul className="space-y-2">
                            {activeSlide.comparisonColumns.leftItems.map((item, i) => (
                              <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-emerald-50 font-medium">
                                <span className="w-5 h-5 rounded-full bg-emerald-400/25 text-emerald-200 flex items-center justify-center shrink-0 mt-0.5">
                                  <Check className="w-3 h-3 stroke-[2.5]" />
                                </span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, x: 16 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.18, duration: 0.35 }}
                          className="bg-white/12 backdrop-blur-xs rounded-2xl p-4 sm:p-5 border border-amber-300/35"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2.5 border-b border-white/15">
                            <h5 className="text-sm sm:text-base font-black text-white">
                              {activeSlide.comparisonColumns.rightTitle}
                            </h5>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 text-[11px] font-extrabold shadow-2xs">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              {activeSlide.comparisonColumns.rightBadge}
                            </span>
                          </div>
                          <ul className="space-y-2">
                            {activeSlide.comparisonColumns.rightItems.map((item, i) => (
                              <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-emerald-50 font-medium">
                                <span className="w-5 h-5 rounded-full bg-amber-400/25 text-amber-200 flex items-center justify-center shrink-0 mt-0.5">
                                  <Check className="w-3 h-3 stroke-[2.5]" />
                                </span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      </div>
                    )}

                    {/* Slide Highlights */}
                    <div className="flex flex-wrap items-center gap-2 pt-2">
                      {activeSlide.highlights.map((tag, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/15 border border-white/25 text-xs font-bold text-white"
                        >
                          <Check className="w-3.5 h-3.5 text-amber-300 stroke-[2.5]" />
                          <span>{tag}</span>
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Footer Sign-off & CTA */}
              <div className="mt-8 pt-6 border-t border-emerald-200/70 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
                <div>
                  <p className="text-xs text-slate-500">Wassalamu’alaikum Warahmatullahi Wabarakatuh,</p>
                  <p className="text-base sm:text-lg font-black text-slate-900 mt-1">
                    Ust. Febrian Fauzi, S.Pd., M.Pd.
                  </p>
                  <p className="text-xs text-[#064e3b] font-semibold">
                    Kepala Sekolah SDIT Al-Afiyah Majalengka
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Yayasan Pendidikan Imam Bonjol (YPIB) Majalengka
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href="/sd/profil"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-200 text-xs font-bold transition-all"
                  >
                    <span>Lihat Profil SDIT</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="https://wa.me/6281310139001?text=Assalamu%27alaikum%20Kepala%20Sekolah%20SDIT%20Al-Afiyah%2C%20saya%20ingin%20konsultasi%20pendidikan%20ananda"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#064e3b] hover:bg-[#047857] text-white text-xs font-bold transition-all shadow-sm hover:shadow active:scale-95"
                  >
                    <span>Konsultasi via WhatsApp</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
