'use client';

import React, { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AutoHorizontalSliderProps {
  children: React.ReactNode;
  /** Tailwind width classes for each card item */
  itemClassName?: string;
  /** Speed in pixels per frame (~60fps). Default 0.55 (~33px/s) */
  speed?: number;
  /** Theme for navigation arrows */
  arrowTheme?: 'light' | 'dark';
}

export default function AutoHorizontalSlider({
  children,
  itemClassName = 'w-[285px] sm:w-[330px] lg:w-[360px]',
  speed = 0.55,
  arrowTheme = 'light',
}: AutoHorizontalSliderProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const accRef = useRef(0);
  const touchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const items = React.Children.toArray(children);
  const shouldLoop = items.length >= 2;
  const displayItems = shouldLoop ? [...items, ...items] : items;

  useEffect(() => {
    const el = containerRef.current;
    if (!el || items.length < 2) return;

    let rafId: number;

    const tick = () => {
      if (!isPaused && el) {
        accRef.current += speed;
        if (accRef.current >= 1) {
          const step = Math.floor(accRef.current);
          accRef.current -= step;
          el.scrollLeft += step;

          const halfWidth = el.scrollWidth / 2;
          if (halfWidth > 0 && el.scrollLeft >= halfWidth) {
            el.scrollLeft -= halfWidth;
          }
        }
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isPaused, speed, items.length]);

  const handleManualScroll = (dir: 'left' | 'right') => {
    const el = containerRef.current;
    if (!el) return;
    setIsPaused(true);
    const amount = dir === 'left' ? -340 : 340;
    const halfWidth = el.scrollWidth / 2;
    if (dir === 'left' && el.scrollLeft <= 10 && halfWidth > 0) {
      el.scrollLeft += halfWidth;
    }
    el.scrollBy({ left: amount, behavior: 'smooth' });
    if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
    touchTimeoutRef.current = setTimeout(() => setIsPaused(false), 3000);
  };

  const handleTouchStart = () => {
    if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
    setIsPaused(true);
  };

  const handleTouchEnd = () => {
    if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
    touchTimeoutRef.current = setTimeout(() => setIsPaused(false), 2500);
  };

  if (items.length === 0) return null;

  const btnCls =
    arrowTheme === 'dark'
      ? 'bg-white/15 hover:bg-white/25 text-white border border-white/25'
      : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 shadow-sm';

  return (
    <div
      className="relative group/slider"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Left / Right Floating Manual Controls */}
      {items.length >= 2 && (
        <>
          <button
            type="button"
            onClick={() => handleManualScroll('left')}
            aria-label="Geser ke kiri"
            className={`hidden sm:flex items-center justify-center w-9 h-9 rounded-full absolute -left-3 top-1/2 -translate-y-1/2 z-20 transition-all opacity-85 hover:opacity-100 cursor-pointer ${btnCls}`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => handleManualScroll('right')}
            aria-label="Geser ke kanan"
            className={`hidden sm:flex items-center justify-center w-9 h-9 rounded-full absolute -right-3 top-1/2 -translate-y-1/2 z-20 transition-all opacity-85 hover:opacity-100 cursor-pointer ${btnCls}`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Horizontal Auto-Scrolling Track */}
      <div
        ref={containerRef}
        className="flex flex-nowrap items-stretch gap-5 overflow-x-auto pb-3 pt-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden select-none"
      >
        {displayItems.map((child, idx) => (
          <div key={idx} className={`shrink-0 flex flex-col ${itemClassName}`}>
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
