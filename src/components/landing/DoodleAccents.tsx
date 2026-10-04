import React from 'react';

/**
 * Coretan kuas oranye (Brush Highlight Underline) seperti pada referensi
 */
export function BrushHighlight({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 280 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full h-3 sm:h-4 text-amber-500/80 -mt-1 sm:-mt-2 ${className}`}
      preserveAspectRatio="none"
    >
      <path
        d="M3 14C60 4 140 3 277 8C210 11 110 15 3 14Z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * Panah Lengkung Berputar (Curly Loop Arrow)
 */
export function CurlyLoopArrow({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 90 45"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-14 h-8 sm:w-16 sm:h-10 text-emerald-600/80 stroke-current ${className}`}
    >
      <path
        d="M5 22C25 10 40 4 52 14C60 22 55 35 44 32C35 29 42 16 60 18C72 20 80 28 85 35M85 35L75 35M85 35L84 25"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Garis Semburan Sinar Matahari (Sunburst Lines)
 */
export function SunburstLines({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-10 h-8 sm:w-12 sm:h-10 text-amber-500 stroke-current ${className}`}
    >
      <path d="M12 40L6 44" strokeWidth="3" strokeLinecap="round" />
      <path d="M22 25L14 15" strokeWidth="3" strokeLinecap="round" />
      <path d="M42 22L45 8" strokeWidth="3" strokeLinecap="round" />
      <path d="M52 38L58 35" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Doodle Spiral Lingkaran
 */
export function SpiralDoodle({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-10 h-10 text-emerald-700 stroke-current ${className}`}
    >
      <path
        d="M24 24C23 21 27 19 28 22C30 26 23 29 20 26C16 22 21 13 28 15C36 17 37 29 30 35C22 41 11 36 10 24C9 11 23 5 35 9"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Doodle Target / Dartboard
 */
export function TargetDoodle({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-10 h-10 text-emerald-700 stroke-current ${className}`}
    >
      <circle cx="24" cy="24" r="18" strokeWidth="2.5" strokeDasharray="3 3" />
      <circle cx="24" cy="24" r="11" strokeWidth="2.5" />
      <circle cx="24" cy="24" r="4" fill="currentColor" />
      <path d="M36 12L24 24" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Pola Garis Kapur (Chalk Pattern) untuk Bento Background
 */
export function ChalkPattern({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`absolute inset-0 w-full h-full opacity-20 pointer-events-none stroke-white ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      {/* Atom */}
      <ellipse cx="40" cy="50" rx="20" ry="8" transform="rotate(-30 40 50)" strokeWidth="1.5" />
      <ellipse cx="40" cy="50" rx="20" ry="8" transform="rotate(30 40 50)" strokeWidth="1.5" />
      <circle cx="40" cy="50" r="3" fill="white" />
      {/* Open Book */}
      <path d="M120 40C125 45 135 45 140 40V65C135 70 125 70 120 65V40Z" strokeWidth="1.5" />
      <path d="M140 40C145 45 155 45 160 40V65C155 70 145 70 140 65V40Z" strokeWidth="1.5" />
      {/* Math symbols */}
      <path d="M220 30H235M227.5 22.5V37.5" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M60 140H80M60 148H80" strokeWidth="1.5" strokeLinecap="round" />
      {/* Pencil */}
      <path d="M180 130L200 110L208 118L188 138L178 140L180 130Z" strokeWidth="1.5" />
      {/* Lightbulb */}
      <path d="M110 130C105 125 105 115 112 110C118 105 128 107 130 115C132 122 126 127 124 130H116" strokeWidth="1.5" />
      <path d="M117 134H123" strokeWidth="1.5" />
    </svg>
  );
}
