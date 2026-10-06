'use client';

import React from 'react';

export function BoyStudentIcon({ className = "w-full h-full" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Murid Laki-Laki (Ikhwan)">
      {/* Background Soft Rounded Squircle */}
      <rect width="48" height="48" rx="14" fill="#E0F2FE" />
      
      {/* Educational Boy / Peserta Didik Vector */}
      {/* Peci / Songkok / Student Cap */}
      <path
        d="M16 16.5C16 12.5 19.5 10 24 10C28.5 10 32 12.5 32 16.5V18.5H16V16.5Z"
        fill="#0369A1"
      />
      {/* Gold Academic Pin */}
      <circle cx="24" cy="14" r="1.5" fill="#F59E0B" />
      
      {/* Head */}
      <circle cx="24" cy="20.5" r="7.5" fill="#FFE4D6" />
      
      {/* Ears */}
      <circle cx="16" cy="20.5" r="1.6" fill="#FED7AA" />
      <circle cx="32" cy="20.5" r="1.6" fill="#FED7AA" />
      
      {/* Hair sideburns */}
      <path d="M16.5 18C16.5 19.5 17 21 17.5 21.5" stroke="#0F172A" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M31.5 18C31.5 19.5 31 21 30.5 21.5" stroke="#0F172A" strokeWidth="1.2" strokeLinecap="round" />
      
      {/* Cheerful Smiling Eyes */}
      <path d="M20 20C20 20.6 20.4 21 21 21" stroke="#334155" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M28 20C28 20.6 27.6 21 27 21" stroke="#334155" strokeWidth="1.4" strokeLinecap="round" />
      
      {/* Smile */}
      <path d="M21.5 23.5C22.2 24.6 23 25.2 24 25.2C25 25.2 25.8 24.6 26.5 23.5" stroke="#0369A1" strokeWidth="1.4" strokeLinecap="round" />
      
      {/* School Uniform Shoulders */}
      <path d="M12 40C12 32.5 17 29.5 24 29.5C31 29.5 36 32.5 36 40" fill="#0284C7" />
      
      {/* White Clean Collar */}
      <path d="M19 29.5L24 35L29 29.5" fill="#FFFFFF" />
      
      {/* Emerald School Tie / Accent */}
      <path d="M23 34L24 39.5L25 34" fill="#10B981" />
    </svg>
  );
}

export function GirlStudentIcon({ className = "w-full h-full" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Murid Perempuan (Akhwat)">
      {/* Background Soft Rounded Squircle */}
      <rect width="48" height="48" rx="14" fill="#FCE7F3" />
      
      {/* Educational Girl / Peserta Didik Putri Hijab Vector */}
      {/* Outer Syar'i Hijab Silhouette */}
      <path
        d="M24 9C16.5 9 13 13.5 13 21.5C13 28.5 17 33.5 24 33.5C31 33.5 35 28.5 35 21.5C35 13.5 31.5 9 24 9Z"
        fill="#DB2777"
      />
      
      {/* Inner Face Opening */}
      <path
        d="M24 13C19.5 13 17 16.5 17 21C17 25 19.5 27 24 27C28.5 27 31 25 31 21C31 16.5 28.5 13 24 13Z"
        fill="#FFE4D6"
      />
      
      {/* Hijab Inner Cap (Ciput) Band */}
      <path d="M18.5 16C20 14.5 24 14 29.5 16" stroke="#BE185D" strokeWidth="1.6" strokeLinecap="round" />
      
      {/* Cheerful Friendly Eyes */}
      <path d="M20 20.2C20.2 20.8 20.6 21.2 21.2 21.2" stroke="#475569" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M28 20.2C27.8 20.8 27.4 21.2 26.8 21.2" stroke="#475569" strokeWidth="1.4" strokeLinecap="round" />
      
      {/* Soft Rosy Cheeks */}
      <circle cx="19" cy="22.5" r="1.3" fill="#FB7185" fillOpacity="0.4" />
      <circle cx="29" cy="22.5" r="1.3" fill="#FB7185" fillOpacity="0.4" />
      
      {/* Sweet Smile */}
      <path d="M21.8 23.8C22.4 24.8 23.2 25.2 24 25.2C24.8 25.2 25.6 24.8 26.2 23.8" stroke="#9D174D" strokeWidth="1.4" strokeLinecap="round" />
      
      {/* Hijab Drape over Shoulders */}
      <path d="M12 40C12 33 16 30 24 30C32 30 36 33 36 40" fill="#BE185D" />
      
      {/* Cute Hijab Pin / Ribbon */}
      <circle cx="24" cy="30" r="1.6" fill="#F472B6" />
      <circle cx="24" cy="30" r="0.8" fill="#FFFFFF" />
    </svg>
  );
}

export function isFemaleName(name?: string): boolean {
  if (!name) return false;
  const n = name.toLowerCase();
  const femaleKeywords = [
    'putri', 'aisyah', 'ayesha', 'fatimah', 'siti', 'zahra', 'zahrah', 'nurul',
    'anisa', 'annisa', 'khadijah', 'salma', 'nisa', 'safira', 'dina', 'amelia',
    'ratna', 'dewi', 'rahma', 'marwah', 'safitri', 'alya', 'nadia', 'syifa', 'najwa'
  ];
  return femaleKeywords.some(keyword => n.includes(keyword));
}

interface StudentEduAvatarProps {
  gender?: string | null;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function StudentEduAvatar({
  gender,
  name = '',
  size = 'md',
  className = '',
}: StudentEduAvatarProps) {
  // Determine if student is girl/perempuan or boy/laki-laki
  const isGirl =
    gender === 'P' ||
    gender === 'Perempuan' ||
    gender === 'p' ||
    (Boolean(name) && isFemaleName(name));

  const sizeClasses = {
    xs: 'w-7 h-7 min-w-[28px] rounded-lg',
    sm: 'w-8 h-8 min-w-[32px] rounded-xl',
    md: 'w-10 h-10 min-w-[40px] rounded-xl',
    lg: 'w-12 h-12 min-w-[48px] rounded-2xl',
    xl: 'w-16 h-16 min-w-[64px] rounded-2xl',
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 overflow-hidden shadow-2xs border transition-transform hover:scale-105 ${
        isGirl
          ? 'border-pink-200/90 bg-pink-50 text-pink-700'
          : 'border-sky-200/90 bg-sky-50 text-sky-700'
      } ${sizeClasses[size]} ${className}`}
      title={isGirl ? `Calon Murid: ${name} (Perempuan / Akhwat)` : `Calon Murid: ${name} (Laki-laki / Ikhwan)`}
    >
      {isGirl ? (
        <GirlStudentIcon className="w-full h-full" />
      ) : (
        <BoyStudentIcon className="w-full h-full" />
      )}
    </div>
  );
}
