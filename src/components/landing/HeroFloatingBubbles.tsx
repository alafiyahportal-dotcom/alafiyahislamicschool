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

interface FloatingHeroElement {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  className: string;
  style: React.CSSProperties;
  glowClass: string;
  wrapperClass?: string;
  tiltClass?: string;
}

export default function HeroFloatingBubbles({ slug }: HeroFloatingBubblesProps) {
  // =========================================================================
  // SMP IT: Bespoke floating elements extracted from the school poster
  // (Quran Mushaf, Piala Emas, Medali Juara, Daun Segar Hijau, & Blueprint Grid)
  // Non-slop authentic assets matching Islamic & Academic excellence identity.
  // =========================================================================
  const smpPosterElements = useMemo<FloatingHeroElement[]>(() => [
    // 1. Primary Sharp HD Quran Mushaf (Refined compact size as requested)
    {
      id: 'smp-quran-main',
      src: '/images/hero/smp-elem-quran.png',
      alt: "Mushaf Al-Qur'an Al-Afiyah",
      width: 458,
      height: 395,
      className: 'w-[95px] sm:w-[115px] md:w-[135px] animate-poster-float-slow select-none',
      glowClass: 'drop-shadow-[0_12px_28px_rgba(160,185,129,0.32)] drop-shadow-[0_3px_10px_rgba(255,213,30,0.22)]',
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
  // SD IT: Authentic Educational & Islamic floating elements
  // (Al-Quran Ungu, Pensil Ceria, Papan Tulis ABC rada ketengah, & Daun Segar Hijau)
  // Pesawat kertas & buku terbuka dihapus sesuai instruksi; daun SMP ditambahkan.
  // =========================================================================
  const sdHeroElements = useMemo<FloatingHeroElement[]>(() => [
    // 1. Primary Spiritual & Academic Anchor: Al-Qur'an Ungu Al-Afiyah
    // On mobile: shifted to top-[25%] in the empty space beside the 3 lower lines of text
    {
      id: 'sd-quran-main',
      src: '/images/hero/sd-elem-quran.png',
      alt: "Mushaf Al-Qur'an SDIT Al-Afiyah",
      width: 262,
      height: 276,
      wrapperClass: 'top-[25%] right-[3%] sm:top-[19%] sm:right-[6%] lg:top-[20%] lg:right-[8%]',
      tiltClass: '-rotate-6',
      className: 'w-[74px] xs:w-[84px] sm:w-[115px] md:w-[135px] lg:w-[155px] animate-poster-float-slow select-none',
      glowClass: 'drop-shadow-[0_14px_30px_rgba(168,85,247,0.38)] drop-shadow-[0_4px_12px_rgba(255,213,30,0.28)]',
      style: {
        animationDelay: '0s',
      },
    },
    // 2. Pensil Ceria (Slim, compact, tilted playfully diagonally ~30deg, safely in-bounds on mobile, center on laptop)
    {
      id: 'sd-pencil-creative',
      src: '/images/hero/sd-elem-pencil.png',
      alt: 'Pensil Kreatif Belajar SDIT',
      width: 140,
      height: 348,
      wrapperClass: 'top-[11%] right-[16%] sm:top-[15%] sm:left-[47%] sm:right-auto lg:top-[16%] lg:left-[49%]',
      tiltClass: 'rotate-[30deg]',
      className: 'w-[17px] xs:w-[20px] sm:w-[32px] md:w-[38px] lg:w-[44px] animate-poster-float-medium select-none',
      glowClass: 'drop-shadow-[0_10px_22px_rgba(251,191,36,0.38)] drop-shadow-[0_2px_8px_rgba(239,68,68,0.22)]',
      style: {
        animationDelay: '0.4s',
      },
    },
    // 3. Papan Tulis Mini ABC (Geser rada ke tengah pada laptop, disesuaikan proporsional di HP)
    {
      id: 'sd-board-abc',
      src: '/images/hero/sd-elem-board.png',
      alt: 'Papan Tulis Ceria ABC SDIT',
      width: 237,
      height: 170,
      wrapperClass: 'top-[46%] right-[8%] sm:top-[56%] sm:right-[15%] lg:top-[56%] lg:right-[20%]',
      tiltClass: 'rotate-3',
      className: 'w-[64px] xs:w-[72px] sm:w-[94px] md:w-[114px] lg:w-[128px] animate-poster-pendulum select-none',
      glowClass: 'drop-shadow-[0_12px_28px_rgba(234,179,8,0.36)] drop-shadow-[0_4px_12px_rgba(16,185,129,0.22)]',
      style: {
        animationDelay: '1.5s',
      },
    },
    // 4. Daun Segar Hijau Sedang (Menggantikan pesawat di langit atas kanan)
    {
      id: 'sd-leaf-medium',
      src: '/images/hero/smp-elem-leaf.png',
      alt: 'Daun Segar Prestasi SDIT',
      width: 475,
      height: 410,
      wrapperClass: 'top-[9%] right-[22%] sm:top-[12%] sm:right-[24%] lg:top-[13%] lg:right-[25%]',
      tiltClass: 'rotate-12',
      className: 'w-[44px] xs:w-[50px] sm:w-[58px] md:w-[68px] lg:w-[76px] animate-poster-leaf-1 select-none',
      glowClass: 'drop-shadow-[0_10px_22px_rgba(16,185,129,0.32)]',
      style: {
        animationDelay: '0.8s',
      },
    },
    // 5. Daun Segar Kecil Samping Kanan (Aksen melayang lembut antara Quran dan ABC)
    {
      id: 'sd-leaf-small-right',
      src: '/images/hero/smp-elem-leaf.png',
      alt: 'Daun Kecil Al-Afiyah',
      width: 475,
      height: 410,
      wrapperClass: 'top-[38%] right-[5%] sm:top-[40%] sm:right-[7%] lg:top-[42%] lg:right-[8%]',
      tiltClass: '-rotate-45',
      className: 'w-[30px] xs:w-[34px] sm:w-[40px] md:w-[46px] lg:w-[50px] opacity-80 animate-poster-leaf-2 select-none',
      glowClass: 'drop-shadow-[0_8px_18px_rgba(16,185,129,0.25)]',
      style: {
        animationDelay: '1.8s',
      },
    },
    // 6. Daun Segar Kecil Kiri (Aksen lembut di sisi kiri judul)
    {
      id: 'sd-leaf-small-left',
      src: '/images/hero/smp-elem-leaf.png',
      alt: 'Daun Kecil Aksen SDIT',
      width: 475,
      height: 410,
      wrapperClass: 'top-[22%] left-[3%] sm:top-[20%] sm:left-[4%] lg:top-[22%] lg:left-[4%]',
      tiltClass: 'rotate-45',
      className: 'w-[26px] xs:w-[30px] sm:w-[36px] md:w-[42px] lg:w-[46px] opacity-70 animate-poster-float-slow select-none',
      glowClass: 'drop-shadow-[0_8px_16px_rgba(16,185,129,0.2)]',
      style: {
        animationDelay: '1.2s',
      },
    },
  ], []);

  // Ambient orbs & sparkles for SD IT
  const sdAmbient = useMemo(() => ({
    bokehOrbs: [
      {
        id: 1,
        size: 440,
        top: '-8%',
        left: '62%',
        color: 'bg-gradient-to-br from-emerald-400/22 via-teal-300/12 to-transparent',
        blur: 'blur-3xl',
        anim: 'animate-bubble-drift',
      },
      {
        id: 2,
        size: 330,
        top: '36%',
        left: '-8%',
        color: 'bg-gradient-to-tr from-emerald-600/20 via-[#ffd51e]/12 to-transparent',
        blur: 'blur-3xl',
        anim: 'animate-bubble-float-1',
      },
      {
        id: 3,
        size: 270,
        top: '64%',
        left: '70%',
        color: 'bg-gradient-to-tl from-purple-500/12 via-teal-400/15 to-transparent',
        blur: 'blur-2xl',
        anim: 'animate-bubble-float-2',
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
            className={`pointer-events-none transition-transform duration-700 ease-out ${elem.wrapperClass || ''}`}
          >
            <div className={`relative ${elem.tiltClass || ''} ${elem.glowClass}`}>
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
  // RENDER: SD IT (Authentic Educational & Islamic Floating Elements)
  // -------------------------------------------------------------------------
  if (slug === 'sd') {
    return (
      <div
        aria-hidden="true"
        className="absolute inset-0 overflow-hidden pointer-events-none z-0 select-none"
      >
        {/* Subtle Geometric / Dot-Star Grid Motif */}
        <div className="absolute inset-0 pointer-events-none opacity-20 [mask-image:radial-gradient(ellipse_at_center,white_35%,transparent_85%)]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="sd-hero-grid" width="52" height="52" patternUnits="userSpaceOnUse">
                <circle cx="26" cy="26" r="1.25" fill="rgba(255,255,255,0.22)" />
                <path d="M 52 0 L 0 0 0 52" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.75" />
                <circle cx="52" cy="0" r="1.5" fill="rgba(255,213,30,0.3)" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#sd-hero-grid)" />
          </svg>
        </div>

        {/* Ambient Deep Bokeh Orbs */}
        {sdAmbient.bokehOrbs.map((orb) => (
          <div
            key={`sd-orb-${orb.id}`}
            className={`absolute rounded-full ${orb.color} ${orb.blur} ${orb.anim} pointer-events-none`}
            style={{
              width: `${orb.size}px`,
              height: `${orb.size}px`,
              top: orb.top,
              left: orb.left,
            }}
          />
        ))}

        {/* Authentic Floating Elements for SDIT (Al-Qur'an, Pesawat Kertas, Papan Tulis, Pensil, Buku) */}
        {sdHeroElements.map((elem) => (
          <div
            key={elem.id}
            style={elem.style}
            className={`absolute pointer-events-none transition-transform duration-700 ease-out ${elem.wrapperClass || ''}`}
          >
            <div className={`relative ${elem.tiltClass || ''} ${elem.glowClass}`}>
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
        {sdAmbient.sparkles.map((sp) => (
          <div
            key={`sd-sp-${sp.id}`}
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
  // RENDER: TK IT (Playful Glass Soap Bubbles)
  // -------------------------------------------------------------------------
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden pointer-events-none z-0 select-none"
    >
      {/* Layer 1: Ambient Deep Bokeh Orbs */}
      {tkConfig.bokehOrbs.map((orb) => (
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

      {/* Layer 2: Handcrafted 3D Glass Soap Bubbles (Retained for TK) */}
      {tkConfig.bubbles.map((b) => (
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
      {tkConfig.sparkles.map((sp) => (
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
