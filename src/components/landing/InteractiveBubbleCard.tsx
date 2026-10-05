'use client';

import React, { useState, useRef, useCallback } from 'react';

interface ClickRipple {
  id: number;
  x: number;
  y: number;
}

interface InteractiveCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'emerald' | 'amber' | 'teal';
  onClick?: () => void;
  interactive?: boolean;
}

export default function InteractiveBubbleCard({
  children,
  className = '',
  variant = 'emerald',
  onClick,
  interactive = true,
}: InteractiveCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<ClickRipple[]>([]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setIsHovered(true);
  }, [interactive]);

  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setIsHovered(true);
  }, [interactive]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setMousePos(null);
    setIsPressed(false);
  }, []);

  const handleMouseDown = useCallback(() => {
    setIsPressed(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsPressed(false);
  }, []);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (onClick) onClick();
    if (!interactive || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple: ClickRipple = {
      id: Date.now() + Math.random(),
      x,
      y,
    };
    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 450);
  }, [interactive, onClick]);

  // Modern minimalist color accents
  const variantStyles = {
    emerald: {
      border: 'border-slate-200/80 hover:border-emerald-500/70',
      spotlight: 'from-emerald-400/20 via-teal-300/10 to-transparent',
      shadow: 'hover:shadow-[0_16px_36px_-12px_rgba(16,185,129,0.18)]',
      ripple: 'border-emerald-400/70 bg-emerald-400/10',
      accentTop: 'bg-emerald-500',
    },
    amber: {
      border: 'border-slate-200/80 hover:border-amber-500/70',
      spotlight: 'from-amber-400/20 via-orange-300/10 to-transparent',
      shadow: 'hover:shadow-[0_16px_36px_-12px_rgba(245,158,11,0.18)]',
      ripple: 'border-amber-400/70 bg-amber-400/10',
      accentTop: 'bg-amber-500',
    },
    teal: {
      border: 'border-slate-200/80 hover:border-teal-500/70',
      spotlight: 'from-teal-400/20 via-cyan-300/10 to-transparent',
      shadow: 'hover:shadow-[0_16px_36px_-12px_rgba(20,184,166,0.18)]',
      ripple: 'border-teal-400/70 bg-teal-400/10',
      accentTop: 'bg-teal-500',
    },
  }[variant];

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={handleClick}
      className={`group relative overflow-hidden bg-white/95 rounded-2xl border transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu hover:scale-[1.03] hover:-translate-y-1.5 active:scale-[0.98] cursor-pointer select-none ${variantStyles.border} ${variantStyles.shadow} ${isPressed ? 'scale-[0.98]' : ''} ${className}`}
    >
      {/* Subtle modern cursor spotlight gradient (pure ambient light) */}
      {interactive && isHovered && mousePos && (
        <div
          className={`absolute pointer-events-none rounded-full blur-2xl bg-radial ${variantStyles.spotlight} -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200 z-0`}
          style={{
            left: `${mousePos.x}px`,
            top: `${mousePos.y}px`,
            width: '220px',
            height: '220px',
          }}
        />
      )}

      {/* Modern minimalist click ripple (sleek expanding light ring) */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className={`absolute pointer-events-none rounded-full border animate-ping duration-500 -translate-x-1/2 -translate-y-1/2 z-10 ${variantStyles.ripple}`}
          style={{
            left: `${ripple.x}px`,
            top: `${ripple.y}px`,
            width: '90px',
            height: '90px',
          }}
        />
      ))}

      {/* Inner subtle specular top edge line for modern glass depth */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none z-10" />

      {/* Card Children Content — flex column so a footer child can pin to the bottom with mt-auto */}
      <div className="relative z-10 flex flex-col h-full">{children}</div>
    </div>
  );
}

export const ModernInteractiveCard = InteractiveBubbleCard;
