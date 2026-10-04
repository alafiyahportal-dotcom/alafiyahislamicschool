'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Trophy } from 'lucide-react';
import AchievementShowcaseModal from './AchievementShowcaseModal';

interface ArchItem {
  id: number;
  title: string;
  role: string;
  unit: string;
  image: string;
  quote: string;
}

// Hanya gunakan foto real sekolah (bukan foto profil murid/guru AI)
// Nama yang ditampilkan adalah deskripsi kegiatan, bukan nama individu
const archItems: ArchItem[] = [
  {
    id: 1,
    title: 'Halaqah Tahfidz Al-Qur\'an',
    role: 'Program Tahfidz SMP IT',
    unit: 'SMP IT Al-Afiyah',
    image: '/images/arc-tahfidz.jpg',
    quote: 'Bimbingan hafalan Al-Qur\'an mutqin dengan metode talaqqi tartil setiap pagi bersama dewan guru.'
  },
  {
    id: 2,
    title: 'Praktik Sains Greenhouse',
    role: 'Outdoor Learning SD IT',
    unit: 'SD IT Al-Afiyah',
    image: '/images/sd-hero-greenhouse.jpg',
    quote: 'Murid belajar agro-literasi dan sains nabawi langsung dari kebun dan greenhouse sekolah.'
  },
  {
    id: 3,
    title: 'Kegiatan Pembelajaran SD IT',
    role: 'Karakter & Prestasi',
    unit: 'SD IT Al-Afiyah',
    image: '/images/sd-hero-activity.jpg',
    quote: 'Membentuk karakter Islami, literasi Al-Qur\'an, dan prestasi unggul melalui kegiatan bermakna.'
  },
  {
    id: 4,
    title: 'Fullday School SMP IT',
    role: 'Sistem Pembelajaran Terpadu',
    unit: 'SMP IT Al-Afiyah',
    image: '/images/smp-hero-fullday.jpg',
    quote: 'Sistem fullday school dengan integrasi tahfidz, sains, dan bahasa Arab-Inggris yang menyenangkan.'
  },
  {
    id: 5,
    title: 'Tim Futsal SD IT',
    role: 'Juara 2 Turnamen Pelajar',
    unit: 'SD IT Al-Afiyah',
    image: '/images/sd-futsal-champion.jpg',
    quote: 'Menjunjung sportivitas islami dan kerja sama tim membawa kami meraih trofi membanggakan.'
  },
  {
    id: 6,
    title: 'Taman Tumbuh Kembang TK',
    role: 'Sentra Bermain & Belajar',
    unit: 'TK IT Al-Afiyah',
    image: '/images/tk-hero-garden.jpg',
    quote: 'Bermain sambil belajar doa harian dan huruf hijaiyah dalam suasana taman yang ceria dan aman.'
  }
];

interface DialTick {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  isLong: boolean;
}

// Precomputed with strict 2 decimal precision to eliminate SSR vs Client floating-point hydration mismatch
const DIAL_TICKS: DialTick[] = Array.from({ length: 80 }).map((_, i) => {
  const pct = i / 79;
  const angle = Math.PI - pct * Math.PI; // from 180 deg to 0 deg
  const rOuter = 460;
  const rInner = i % 5 === 0 ? 438 : 446; // Every 5th tick is longer
  const cx = 500;
  const cy = 400;

  return {
    x1: Math.round((cx + Math.cos(angle) * rInner) * 100) / 100,
    y1: Math.round((cy - Math.sin(angle) * (rInner * 0.5)) * 100) / 100,
    x2: Math.round((cx + Math.cos(angle) * rOuter) * 100) / 100,
    y2: Math.round((cy - Math.sin(angle) * (rOuter * 0.5)) * 100) / 100,
    isLong: i % 5 === 0
  };
});

export default function HavenlyArchCarousel() {
  const [activeIndex, setActiveIndex] = useState(2);
  const [isMobile, setIsMobile] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto rotation effect every 3.8s continuously
  useEffect(() => {
    if (isModalOpen) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % archItems.length);
    }, 3800);
    return () => clearInterval(interval);
  }, [activeIndex, isModalOpen]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % archItems.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + archItems.length) % archItems.length);
  };

  // Compute 5 visible slots along an arch
  // Offset relative to active: -2, -1, 0, 1, 2
  const visibleCards = [-2, -1, 0, 1, 2].map((offset) => {
    const index = (activeIndex + offset + archItems.length) % archItems.length;
    return {
      ...archItems[index],
      offset
    };
  });

  // Arc positioning parameters
  const getCardStyle = (offset: number) => {
    // Map offset to angle in degrees (-50 deg to +50 deg)
    const angle = offset * (isMobile ? 20 : 24);
    const rad = (angle * Math.PI) / 180;
    
    // Radius of curvature
    const radiusX = isMobile ? 185 : 380;
    const radiusY = isMobile ? 65 : 120;

    const x = Math.sin(rad) * radiusX;
    const y = -Math.cos(rad) * radiusY + radiusY; // Arcs downward at sides

    const isCenter = offset === 0;
    const isAdjacent = Math.abs(offset) === 1;

    return {
      x,
      y,
      rotate: angle * 0.75, // Slight tilt matching curvature
      scale: isCenter ? 1.05 : isAdjacent ? (isMobile ? 0.8 : 0.92) : (isMobile ? 0.6 : 0.78),
      zIndex: isCenter ? 30 : isAdjacent ? 20 : 10,
      opacity: isCenter ? 1 : isAdjacent ? 0.85 : (isMobile ? 0.4 : 0.65)
    };
  };

  return (
    <div
      className="relative w-full max-w-6xl mx-auto overflow-hidden select-none py-12"
    >
      {/* Top Semi-Circular Gauge / Dial with Precision Tick Marks */}
      <div className="relative w-full h-80 sm:h-96 flex items-center justify-center">
        {/* SVG Tick Marks Arc Dial */}
        <svg
          viewBox="0 0 1000 450"
          fill="none"
          suppressHydrationWarning
          className="absolute top-0 w-full max-w-4xl h-auto pointer-events-none opacity-60 text-[#2D7A70] stroke-current"
        >
          {/* Main Arched Base Line */}
          <path
            d="M 60 380 A 440 220 0 0 1 940 380"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          {/* Precomputed Fixed-Precision Radiating Tick Marks */}
          {DIAL_TICKS.map((tick, i) => (
            <line
              key={i}
              x1={tick.x1}
              y1={tick.y1}
              x2={tick.x2}
              y2={tick.y2}
              strokeWidth={tick.isLong ? '2.2' : '1.2'}
              strokeOpacity={tick.isLong ? '0.95' : '0.45'}
              suppressHydrationWarning
            />
          ))}
        </svg>

        {/* Floating Animated Cards on the Arc */}
        <div className="relative w-full h-full flex items-center justify-center">
          {visibleCards.map((card) => {
            const style = getCardStyle(card.offset);
            const isCenter = card.offset === 0;

            return (
              <motion.div
                key={card.id}
                layout
                animate={{
                  x: style.x,
                  y: style.y,
                  rotate: style.rotate,
                  scale: style.scale,
                  opacity: style.opacity
                }}
                transition={{
                  type: 'spring',
                  stiffness: 180,
                  damping: 24,
                  mass: 0.8
                }}
                style={{ zIndex: style.zIndex }}
                onClick={() => {
                  if (!isCenter) {
                    setActiveIndex(
                      (activeIndex + card.offset + archItems.length) %
                        archItems.length
                    );
                  }
                }}
                className={`absolute cursor-pointer group transition-all duration-300 ${
                  isCenter ? 'ring-4 ring-[#2D7A70] shadow-2xl' : 'hover:scale-95'
                }`}
              >
                {/* Card Container */}
                <div className="w-36 sm:w-44 lg:w-48 h-52 sm:h-64 lg:h-72 rounded-3xl overflow-hidden bg-stone-900 border-2 border-white/60 shadow-xl relative">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    sizes="(max-width: 640px) 144px, (max-width: 1024px) 176px, 192px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Card Label */}
                  <div className="absolute bottom-3 left-3 right-3 text-left">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#E8F3F1] bg-[#184F48]/85 backdrop-blur-xs px-2 py-0.5 rounded-full inline-block border border-[#3C9388]/50 mb-1">
                      {card.unit}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-white leading-tight truncate">
                      {card.title}
                    </h4>
                    <p className="text-[10px] sm:text-xs text-stone-300 truncate">
                      {card.role}
                    </p>
                  </div>

                  {/* Center Active Pulsing Indicator */}
                  {isCenter && (
                    <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-[#2D7A70] text-white flex items-center justify-center shadow-md">
                      <Trophy className="w-3.5 h-3.5 text-amber-300" />
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Carousel Navigation Arrows */}
        <button
          onClick={handlePrev}
          title="Sebelumnya"
          aria-label="Sebelumnya"
          className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/95 hover:bg-white text-stone-800 hover:text-[#2D7A70] border border-[#D4EBE7] shadow-md flex items-center justify-center z-40 transition-all hover:scale-110 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          title="Berikutnya"
          aria-label="Berikutnya"
          className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/95 hover:bg-white text-stone-800 hover:text-[#2D7A70] border border-[#D4EBE7] shadow-md flex items-center justify-center z-40 transition-all hover:scale-110 cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Center Quote Display (Smoothly Animates with Active Card) */}
      <div className="mt-4 text-center max-w-xl mx-auto px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={archItems[activeIndex].id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-2"
          >
            <p className="text-xs sm:text-sm text-stone-600 italic font-medium [word-spacing:0.06em]">
              &ldquo;{archItems[activeIndex].quote}&rdquo;
            </p>
            <div className="text-[11px] font-bold text-[#2D7A70] uppercase tracking-wider [word-spacing:0.08em]">
              — {archItems[activeIndex].title} &bull; {archItems[activeIndex].unit}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Pagination Dots */}
        <div className="flex items-center justify-center space-x-1.5 pt-4">
          {archItems.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              aria-label={`Slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === activeIndex
                  ? 'w-7 bg-[#2D7A70]'
                  : 'w-1.5 bg-stone-300 hover:bg-[#2D7A70]/60'
              }`}
            />
          ))}
        </div>

        {/* Trigger Button to Open Full Achievement Showcase */}
        <div className="pt-6">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-full bg-[#184F48] hover:bg-[#2D7A70] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer group"
          >
            <Trophy className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
            <span>Lihat Galeri Prestasi &amp; Piala Murid Lengkap</span>
          </button>
        </div>
      </div>

      {/* Interactive Achievement Modal */}
      <AchievementShowcaseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
