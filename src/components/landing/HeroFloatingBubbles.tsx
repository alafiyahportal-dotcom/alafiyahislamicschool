'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';

interface HeroFloatingBubblesProps {
  slug: 'sd' | 'smp' | 'tk';
}

interface BubbleConfig {
  id: number;
  size: number;
  left: string;
  top: string;
  animationClass: string;
  delay?: string;
  opacity: number;
  glowColor: string;
  borderColor: string;
  gradientFill: string;
  hasSpecular?: boolean;
}

interface SmpPosterElement {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  className: string;
  style: React.CSSProperties;
  glowClass: string;
}

export default function HeroFloatingBubbles({ slug }: HeroFloatingBubblesProps) {
  // =========================================================================
  // SMP IT: Bespoke floating elements extracted from the school poster
  // (Quran Mushaf, Piala Emas, Medali Juara, Daun Segar Hijau, & Blueprint Grid)
  // Non-slop authentic assets matching Islamic & Academic excellence identity.
  // =========================================================================
  const smpPosterElements = useMemo<SmpPosterElement[]>(() => [
    // 1. Primary Sharp HD Quran Mushaf (Refined compact size as requested)
    {
      id: 'smp-quran-main',
      src: '/images/hero/smp-elem-quran.png',
      alt: "Mushaf Al-Qur'an Al-Afiyah",
      width: 458,
      height: 395,
      className: 'w-[95px] sm:w-[115px] md:w-[135px] animate-poster-float-slow select-none',
      glowClass: 'drop-shadow-[0_12px_28px_rgba(16,185,129,0.32)] drop-shadow-[0_3px_10px_rgba(255,213,30,0.22)]',
      style: {
        position: 'absolute',
        top: '22%',
        right: '7%',
        animationDelay: '0s',
      },
    },
    // 2. Secondary Depth HD Quran Mushaf (Lower-left background depth)
    {
      id: 'smp-quran-depth',
      src: '/images/hero/smp-elem-quran.png',
      alt: "Mushaf Al-Qur'an Latar",
      width: 458,
      height: 395,
      className: 'w-[75px] sm:w-[90px] md:w-[105px] opacity-75 -rotate-12 animate-poster-leaf-1 select-none',
      glowClass: 'drop-shadow-[0_10px_24px_rgba(16,185,129,0.22)]',
      style: {
        position: 'absolute',
        top: '64%',
        left: '5%',
        animationDelay: '1.8s',
      },
    },
    // 3. HD 3D Gold Trophy (Clearly smaller than the Quran with soft depth-of-field blur)
    {
      id: 'smp-trophy',
      src: '/images/hero/smp-elem-trophy.png',
      alt: 'Piala Juara Prestasi Emas',
      width: 483,
      height: 401,
      className: 'w-[65px] sm:w-[80px] md:w-[98px] animate-poster-float-medium select-none',
      glowClass: 'drop-shadow-[0_12px_28px_rgba(255,213,30,0.38)] drop-shadow-[0_3px_10px_rgba(16,185,129,0.2)]',
      style: {
        position: 'absolute',
        top: '13%',
        right: '23%',
        animationDelay: '0.8s',
      },
    },
    // 4. HD Botanical Leaf 1 (Right drift, soft motion/depth blur as requested)
    {
      id: 'smp-leaf-right',
      src: '/images/hero/smp-elem-leaf.png',
      alt: 'Daun Segar Prestasi',
      width: 475,
      height: 410,
      className: 'w-[75px] sm:w-[92px] md:w-[110px] rotate-12 animate-poster-leaf-1 select-none',
      glowClass: 'drop-shadow-[0_12px_24px_rgba(16,185,129,0.3)]',
      style: {
        position: 'absolute',
        top: '56%',
        right: '2%',
        animationDelay: '0.5s',
      },
    },
    // 5. HD Botanical Leaf 2 (Top-left accent, soft motion/depth blur)
    {
      id: 'smp-leaf-top-left',
      src: '/images/hero/smp-elem-leaf.png',
      alt: 'Daun Segar Al-Afiyah',
      width: 475,
      height: 410,
      className: 'w-[60px] sm:w-[72px] md:w-[85px] rotate-45 opacity-75 animate-poster-float-slow select-none',
      glowClass: 'drop-shadow-[0_10px_20px_rgba(16,185,129,0.22)]',
      style: {
        position: 'absolute',
        top: '20%',
        left: '3%',
        animationDelay: '1.2s',
      },
    },
  ], []);

  // Ambient orbs & sparkles
  const smpAmbient = useMemo(() => ({
    bokehOrbs: [
      {
        id: 1,
        size: 420,
        top: '-5%',
        left: '65%',
        color: 'bg-gradient-to-br from-indigo-500/20 via-sky-400/10 to-transparent',
        blur: 'blur-3xl',
        anim: 'animate-bubble-drift',
      },
      {
        id: 2,
        size: 340,
        top: '35%',
        left: '-10%',
        color: 'bg-gradient-to-tr from-blue-600/15 via-[#ffd51e]/8 to-transparent',
        blur: 'blur-3xl',
        anim: 'animate-bubble-float-1',
      },
      {
        id: 3,
        size: 260,
        top: '60%',
        left: '75%',
        color: 'bg-gradient-to-tl from-emerald-500/15 via-teal-400/10 to-transparent',
        blur: 'blur-2xl',
        anim: 'animate-bubble-float-2',
      },
    ],
    sparkles: [
      { id: 201, size: 8, top: '24%', left: '78%', color: 'bg-emerald-300', delay: '0.2s' },
      { id: 202, size: 10, top: '48%', left: '82%', color: 'bg-[#ffd51e]', delay: '1.4s' },
      { id: 203, size: 7, top: '62%', left: '60%', color: 'bg-amber-200', delay: '2.1s' },
      { id: 204, size: 9, top: '15%', left: '66%', color: 'bg-teal-300', delay: '0.9s' },
      { id: 205, size: 6, top: '75%', left: '16%', color: 'bg-[#ffd51e]', delay: '3.2s' },
    ],
  }), []);

  // =========================================================================
  // SD IT (User mandate: "yang sd tetep gelembung aja dlu ya")
  // Pristine Handcrafted Glass Soap Bubbles
  // =========================================================================
  const sdConfig = useMemo<{
    bokehOrbs: Array<{
      id: number;
      size: number;
      top: string;
      left: string;
      color: string;
      blur: string;
      anim: string;
    }>;
    bubbles: BubbleConfig[];
    sparkles: Array<{
      id: number;
      size: number;
      top: string;
      left: string;
      color: string;
      delay: string;
    }>;
  }>(() => ({
    bokehOrbs: [
      {
        id: 1,
        size: 440,
        top: '-8%',
        left: '62%',
        color: 'bg-gradient-to-br from-emerald-400/20 via-teal-300/10 to-transparent',
        blur: 'blur-3xl',
        anim: 'animate-bubble-drift',
      },
      {
        id: 2,
        size: 320,
        top: '38%',
        left: '-8%',
        color: 'bg-gradient-to-tr from-emerald-600/20 via-[#ffd51e]/10 to-transparent',
        blur: 'blur-3xl',
        anim: 'animate-bubble-float-1',
      },
      {
        id: 3,
        size: 280,
        top: '65%',
        left: '72%',
        color: 'bg-gradient-to-tl from-teal-400/15 to-transparent',
        blur: 'blur-2xl',
        anim: 'animate-bubble-float-2',
      },
    ],
    bubbles: [
      {
        id: 101,
        size: 92,
        top: '16%',
        left: '70%',
        animationClass: 'animate-bubble-float-1',
        opacity: 0.65,
        glowColor: 'shadow-[0_8px_32px_rgba(52,211,153,0.25),inset_0_2px_12px_rgba(255,255,255,0.5)]',
        borderColor: 'border-white/35',
        gradientFill: 'bg-gradient-to-br from-white/20 via-emerald-400/15 to-teal-500/15',
        hasSpecular: true,
      },
      {
        id: 102,
        size: 66,
        top: '34%',
        left: '85%',
        animationClass: 'animate-bubble-float-2',
        delay: '1.2s',
        opacity: 0.55,
        glowColor: 'shadow-[0_6px_24px_rgba(16,185,129,0.22),inset_0_2px_8px_rgba(255,255,255,0.45)]',
        borderColor: 'border-white/30',
        gradientFill: 'bg-gradient-to-tr from-white/25 via-emerald-300/15 to-transparent',
        hasSpecular: true,
      },
      {
        id: 103,
        size: 54,
        top: '52%',
        left: '64%',
        animationClass: 'animate-bubble-float-3',
        delay: '0.6s',
        opacity: 0.6,
        glowColor: 'shadow-[0_4px_20px_rgba(251,191,36,0.22),inset_0_1px_6px_rgba(255,255,255,0.45)]',
        borderColor: 'border-amber-200/40',
        gradientFill: 'bg-gradient-to-br from-[#ffd51e]/15 via-white/10 to-transparent',
        hasSpecular: true,
      },
      {
        id: 104,
        size: 78,
        top: '65%',
        left: '10%',
        animationClass: 'animate-bubble-float-2',
        delay: '2.2s',
        opacity: 0.5,
        glowColor: 'shadow-[0_6px_26px_rgba(52,211,153,0.2),inset_0_2px_10px_rgba(255,255,255,0.35)]',
        borderColor: 'border-white/25',
        gradientFill: 'bg-gradient-to-tl from-emerald-500/15 via-white/15 to-transparent',
        hasSpecular: true,
      },
      {
        id: 105,
        size: 40,
        top: '20%',
        left: '54%',
        animationClass: 'animate-bubble-float-3',
        delay: '2.8s',
        opacity: 0.45,
        glowColor: 'shadow-[0_4px_16px_rgba(110,231,183,0.25),inset_0_1px_6px_rgba(255,255,255,0.4)]',
        borderColor: 'border-white/30',
        gradientFill: 'bg-gradient-to-br from-white/20 to-emerald-400/10',
        hasSpecular: true,
      },
      {
        id: 106,
        size: 114,
        top: '6%',
        left: '86%',
        animationClass: 'animate-bubble-drift',
        opacity: 0.4,
        glowColor: 'shadow-[0_12px_40px_rgba(16,185,129,0.18),inset_0_3px_16px_rgba(255,255,255,0.3)]',
        borderColor: 'border-white/20',
        gradientFill: 'bg-gradient-to-br from-white/10 via-emerald-300/10 to-teal-600/10',
        hasSpecular: true,
      },
    ],
    sparkles: [
      { id: 201, size: 8, top: '22%', left: '76%', color: 'bg-emerald-200', delay: '0.3s' },
      { id: 202, size: 10, top: '46%', left: '80%', color: 'bg-[#ffd51e]', delay: '1.2s' },
      { id: 203, size: 7, top: '58%', left: '58%', color: 'bg-white', delay: '2s' },
      { id: 204, size: 9, top: '14%', left: '64%', color: 'bg-teal-200', delay: '0.7s' },
      { id: 205, size: 6, top: '72%', left: '18%', color: 'bg-[#ffd51e]', delay: '3s' },
    ],
  }), []);

  // =========================================================================
  // TK Default Setup (Playful bubbles)
  // =========================================================================
  const tkConfig = useMemo(() => ({
    bokehOrbs: [
      {
        id: 1,
        size: 400,
        top: '-5%',
        left: '60%',
        color: 'bg-gradient-to-br from-emerald-400/20 via-sky-400/15 to-transparent',
        blur: 'blur-3xl',
        anim: 'animate-bubble-drift',
      },
      {
        id: 2,
        size: 300,
        top: '35%',
        left: '-5%',
        color: 'bg-gradient-to-tr from-amber-400/15 via-emerald-500/15 to-transparent',
        blur: 'blur-3xl',
        anim: 'animate-bubble-float-1',
      },
    ],
    bubbles: [
      {
        id: 101,
        size: 84,
        top: '18%',
        left: '70%',
        animationClass: 'animate-bubble-float-1',
        opacity: 0.65,
        glowColor: 'shadow-[0_8px_32px_rgba(56,189,248,0.22),inset_0_2px_12px_rgba(255,255,255,0.45)]',
        borderColor: 'border-white/35',
        gradientFill: 'bg-gradient-to-br from-white/20 via-sky-400/15 to-emerald-400/15',
        hasSpecular: true,
      },
      {
        id: 102,
        size: 60,
        top: '36%',
        left: '84%',
        animationClass: 'animate-bubble-float-2',
        delay: '1.4s',
        opacity: 0.55,
        glowColor: 'shadow-[0_6px_24px_rgba(251,191,36,0.25),inset_0_2px_8px_rgba(255,255,255,0.5)]',
        borderColor: 'border-amber-200/40',
        gradientFill: 'bg-gradient-to-tr from-amber-300/15 via-white/20 to-transparent',
        hasSpecular: true,
      },
    ],
    sparkles: [
      { id: 201, size: 8, top: '20%', left: '74%', color: 'bg-sky-200', delay: '0.2s' },
      { id: 202, size: 9, top: '44%', left: '78%', color: 'bg-amber-300', delay: '1.5s' },
    ],
  }), []);

  // -------------------------------------------------------------------------
  // RENDER: SMP IT (Authentic Poster Floating Elements)
  // -------------------------------------------------------------------------
  if (slug === 'smp') {
    return (
      <div
        aria-hidden="true"
        className="absolute inset-0 overflow-hidden pointer-events-none z-0 select-none"
      >
        {/* Subtle Islamic / Tech Blueprint Grid (Echoing the school poster background) */}
        <div className="absolute inset-0 pointer-events-none opacity-20 [mask-image:radial-gradient(ellipse_at_center,white_35%,transparent_85%)]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="smp-hero-poster-grid" width="56" height="56" patternUnits="userSpaceOnUse">
                <path d="M 56 0 L 0 0 0 56" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="0.75" />
                <circle cx="56" cy="0" r="1.5" fill="rgba(255,213,30,0.35)" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#smp-hero-poster-grid)" />
          </svg>
        </div>

        {/* Ambient Deep Bokeh Orbs */}
        {smpAmbient.bokehOrbs.map((orb) => (
          <div
            key={`smp-orb-${orb.id}`}
            className={`absolute rounded-full ${orb.color} ${orb.blur} ${orb.anim} pointer-events-none`}
            style={{
              width: `${orb.size}px`,
              height: `${orb.size}px`,
              top: orb.top,
              left: orb.left,
            }}
          />
        ))}

        {/* Authentic Floating Elements from Poster (Al-Qur'an, Piala, Medali, Daun) */}
        {smpPosterElements.map((elem) => (
          <div
            key={elem.id}
            style={elem.style}
            className={`pointer-events-none transition-transform duration-700 ease-out`}
          >
            <div className={`relative ${elem.glowClass}`}>
              <Image
                src={elem.src}
                alt={elem.alt}
                width={elem.width}
                height={elem.height}
                className={elem.className}
                priority
                unoptimized
              />
            </div>
          </div>
        ))}

        {/* Luminous Golden & Emerald Micro-Gleams */}
        {smpAmbient.sparkles.map((sp) => (
          <div
            key={`smp-sp-${sp.id}`}
            className={`absolute rounded-full shadow-[0_0_12px_rgba(255,213,30,0.7)] animate-bubble-sparkle ${sp.color}`}
            style={{
              width: `${sp.size}px`,
              height: `${sp.size}px`,
              top: sp.top,
              left: sp.left,
              animationDelay: sp.delay,
            }}
          />
        ))}
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // RENDER: SD IT & TK (Glass Soap Bubbles retained as requested)
  // -------------------------------------------------------------------------
  const currentConfig = slug === 'sd' ? sdConfig : tkConfig;

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden pointer-events-none z-0 select-none"
    >
      {/* Layer 1: Ambient Deep Bokeh Orbs */}
      {currentConfig.bokehOrbs.map((orb) => (
        <div
          key={`orb-${orb.id}`}
          className={`absolute rounded-full ${orb.color} ${orb.blur} ${orb.anim} pointer-events-none`}
          style={{
            width: `${orb.size}px`,
            height: `${orb.size}px`,
            top: orb.top,
            left: orb.left,
          }}
        />
      ))}

      {/* Layer 2: Handcrafted 3D Glass Soap Bubbles (Retained for SD) */}
      {currentConfig.bubbles.map((b) => (
        <div
          key={`bubble-${b.id}`}
          className={`absolute rounded-full border backdrop-blur-[1.5px] ${b.borderColor} ${b.gradientFill} ${b.glowColor} ${b.animationClass}`}
          style={{
            width: `${b.size}px`,
            height: `${b.size}px`,
            top: b.top,
            left: b.left,
            opacity: b.opacity,
            animationDelay: b.delay || '0s',
          }}
        >
          {b.hasSpecular && (
            <>
              <span
                className="absolute top-[14%] left-[16%] w-[28%] h-[16%] rounded-full bg-gradient-to-br from-white/90 via-white/40 to-transparent -rotate-35 blur-[0.5px]"
                aria-hidden="true"
              />
              <span
                className="absolute bottom-[14%] right-[16%] w-[16%] h-[12%] rounded-full bg-white/30 blur-[0.5px]"
                aria-hidden="true"
              />
            </>
          )}
        </div>
      ))}

      {/* Layer 3: Floating Micro-Luminous Pearls & Sparkles */}
      {currentConfig.sparkles.map((sp) => (
        <div
          key={`sparkle-${sp.id}`}
          className={`absolute rounded-full shadow-[0_0_12px_rgba(255,255,255,0.6)] animate-bubble-sparkle ${sp.color}`}
          style={{
            width: `${sp.size}px`,
            height: `${sp.size}px`,
            top: sp.top,
            left: sp.left,
            animationDelay: sp.delay,
          }}
        />
      ))}
    </div>
  );
}
