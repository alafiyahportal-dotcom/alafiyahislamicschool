'use client';

import React, { useMemo } from 'react';

interface HeroFloatingBubblesProps {
  slug: 'sd' | 'smp' | 'tk';
}

interface BubbleConfig {
  id: number;
  size: number; // in pixels
  left: string; // css percentage or calc
  top: string; // css percentage or calc
  animationClass: string;
  delay?: string;
  opacity: number;
  glowColor: string;
  borderColor: string;
  gradientFill: string;
  hasSpecular?: boolean;
  blurLevel?: string;
}

export default function HeroFloatingBubbles({ slug }: HeroFloatingBubblesProps) {
  const configs = useMemo<{
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
  }>(() => {
    if (slug === 'smp') {
      return {
        // Deep ambient background orbs (Layer 1 - deep bokeh)
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
            color: 'bg-gradient-to-tl from-cyan-400/15 to-transparent',
            blur: 'blur-2xl',
            anim: 'animate-bubble-float-2',
          },
        ],
        // Crisp floating glass soap bubbles (Layer 2 - midground)
        bubbles: [
          {
            id: 101,
            size: 88,
            top: '18%',
            left: '72%',
            animationClass: 'animate-bubble-float-1',
            opacity: 0.65,
            glowColor: 'shadow-[0_8px_32px_rgba(56,189,248,0.22),inset_0_2px_12px_rgba(255,255,255,0.45)]',
            borderColor: 'border-white/35',
            gradientFill: 'bg-gradient-to-br from-white/20 via-cyan-400/10 to-indigo-500/15',
            hasSpecular: true,
          },
          {
            id: 102,
            size: 64,
            top: '32%',
            left: '86%',
            animationClass: 'animate-bubble-float-2',
            delay: '1.5s',
            opacity: 0.55,
            glowColor: 'shadow-[0_6px_24px_rgba(99,102,241,0.25),inset_0_2px_8px_rgba(255,255,255,0.5)]',
            borderColor: 'border-white/30',
            gradientFill: 'bg-gradient-to-tr from-white/25 via-sky-400/15 to-transparent',
            hasSpecular: true,
          },
          {
            id: 103,
            size: 52,
            top: '55%',
            left: '68%',
            animationClass: 'animate-bubble-float-3',
            delay: '0.8s',
            opacity: 0.6,
            glowColor: 'shadow-[0_4px_20px_rgba(255,213,30,0.2),inset_0_1px_6px_rgba(255,255,255,0.4)]',
            borderColor: 'border-amber-200/40',
            gradientFill: 'bg-gradient-to-br from-[#ffd51e]/15 via-white/10 to-transparent',
            hasSpecular: true,
          },
          {
            id: 104,
            size: 76,
            top: '68%',
            left: '8%',
            animationClass: 'animate-bubble-float-2',
            delay: '2.5s',
            opacity: 0.5,
            glowColor: 'shadow-[0_6px_26px_rgba(56,189,248,0.18),inset_0_2px_10px_rgba(255,255,255,0.35)]',
            borderColor: 'border-white/25',
            gradientFill: 'bg-gradient-to-tl from-indigo-500/15 via-white/15 to-transparent',
            hasSpecular: true,
          },
          {
            id: 105,
            size: 42,
            top: '22%',
            left: '52%',
            animationClass: 'animate-bubble-float-3',
            delay: '3s',
            opacity: 0.45,
            glowColor: 'shadow-[0_4px_16px_rgba(147,197,253,0.2),inset_0_1px_6px_rgba(255,255,255,0.4)]',
            borderColor: 'border-white/30',
            gradientFill: 'bg-gradient-to-br from-white/20 to-sky-400/10',
            hasSpecular: true,
          },
          {
            id: 106,
            size: 110,
            top: '8%',
            left: '88%',
            animationClass: 'animate-bubble-drift',
            opacity: 0.4,
            glowColor: 'shadow-[0_12px_40px_rgba(56,189,248,0.15),inset_0_3px_16px_rgba(255,255,255,0.3)]',
            borderColor: 'border-white/20',
            gradientFill: 'bg-gradient-to-br from-white/10 via-sky-300/10 to-indigo-600/10',
            hasSpecular: true,
          },
        ],
        // Tiny luminous pearls & sparkles (Layer 3 - accents)
        sparkles: [
          { id: 201, size: 8, top: '24%', left: '78%', color: 'bg-sky-200', delay: '0.2s' },
          { id: 202, size: 10, top: '48%', left: '82%', color: 'bg-[#ffd51e]', delay: '1.4s' },
          { id: 203, size: 7, top: '62%', left: '60%', color: 'bg-white', delay: '2.1s' },
          { id: 204, size: 9, top: '15%', left: '66%', color: 'bg-cyan-300', delay: '0.9s' },
          { id: 205, size: 6, top: '75%', left: '16%', color: 'bg-[#ffd51e]', delay: '3.2s' },
        ],
      };
    }

    if (slug === 'sd') {
      return {
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
      };
    }

    // Default TK (Fresh Playful Palette)
    return {
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
        {
          id: 103,
          size: 50,
          top: '54%',
          left: '66%',
          animationClass: 'animate-bubble-float-3',
          delay: '0.9s',
          opacity: 0.6,
          glowColor: 'shadow-[0_4px_20px_rgba(52,211,153,0.22),inset_0_1px_6px_rgba(255,255,255,0.4)]',
          borderColor: 'border-white/30',
          gradientFill: 'bg-gradient-to-br from-emerald-400/15 via-white/10 to-transparent',
          hasSpecular: true,
        },
      ],
      sparkles: [
        { id: 201, size: 8, top: '20%', left: '74%', color: 'bg-sky-200', delay: '0.2s' },
        { id: 202, size: 9, top: '44%', left: '78%', color: 'bg-amber-300', delay: '1.5s' },
        { id: 203, size: 6, top: '60%', left: '62%', color: 'bg-emerald-200', delay: '2.2s' },
      ],
    };
  }, [slug]);

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden pointer-events-none z-0 select-none"
    >
      {/* ── Layer 1: Ambient Deep Bokeh Orbs ── */}
      {configs.bokehOrbs.map((orb) => (
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

      {/* ── Layer 2: Handcrafted 3D Glass Soap Bubbles ── */}
      {configs.bubbles.map((b) => (
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
          {/* Top-Left Specular Light Reflection (gives genuine glass sphere curvature) */}
          {b.hasSpecular && (
            <>
              <span
                className="absolute top-[14%] left-[16%] w-[28%] h-[16%] rounded-full bg-gradient-to-br from-white/90 via-white/40 to-transparent -rotate-35 blur-[0.5px]"
                aria-hidden="true"
              />
              {/* Secondary Soft Rim Bounce Reflection at bottom-right */}
              <span
                className="absolute bottom-[14%] right-[16%] w-[16%] h-[12%] rounded-full bg-white/30 blur-[0.5px]"
                aria-hidden="true"
              />
            </>
          )}
        </div>
      ))}

      {/* ── Layer 3: Floating Micro-Luminous Pearls & Sparkles ── */}
      {configs.sparkles.map((sp) => (
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
