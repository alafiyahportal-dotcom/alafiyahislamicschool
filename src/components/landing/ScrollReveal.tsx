'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // Delay in seconds (e.g. 0.15 for 150ms)
  duration?: number; // Duration in ms (default 500ms)
  yOffset?: number; // Initial translateY distance in px (default 24)
  as?: 'div' | 'section' | 'ul' | 'li' | 'header';
}

export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  duration = 500,
  yOffset = 24,
  as: Component = 'div',
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Check prefers-reduced-motion
    if (
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setIsVisible(true);
      return;
    }

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    // Check if already in viewport on mount (accounting for bottom offset)
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 20 && rect.bottom > 0) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
          observer.disconnect();
        }
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px -20px 0px',
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <Component
      ref={ref as any}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : `translateY(${yOffset}px)`,
        transition: `opacity ${duration}ms cubic-bezier(0.25, 0.1, 0.25, 1) ${delay}s, transform ${duration}ms cubic-bezier(0.25, 0.1, 0.25, 1) ${delay}s`,
        willChange: isVisible ? 'auto' : 'opacity, transform',
      }}
      className={className}
    >
      {children}
    </Component>
  );
}
