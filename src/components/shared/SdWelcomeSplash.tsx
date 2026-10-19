'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const SD_SPLASH_SESSION_KEY = 'alafiyah_sd_welcome_seen';

export default function SdWelcomeSplash() {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      if (typeof window === 'undefined') return;

      const path = window.location.pathname.toLowerCase();
      const host = window.location.hostname.toLowerCase();
      const search = window.location.search.toLowerCase();
      const hash = window.location.hash.toLowerCase();

      // Check if current context is SD IT (subdomain sdit.*, path /sd*, or query/hash splash)
      const isSdContext =
        path === '/sd' ||
        path.startsWith('/sd/') ||
        host.startsWith('sdit.') ||
        host.startsWith('sd.') ||
        search.includes('unit=sd') ||
        search.includes('school=sd') ||
        search.includes('splash') ||
        hash.includes('splash');

      const forcePreview = search.includes('splash') || hash.includes('splash');
      const alreadySeen = sessionStorage.getItem(SD_SPLASH_SESSION_KEY);

      if (isSdContext && (!alreadySeen || forcePreview)) {
        setIsVisible(true);
        // Mark seen immediately so navigating to beranda and back NEVER replays it
        try {
          sessionStorage.setItem(SD_SPLASH_SESSION_KEY, '1');
        } catch {}

        // Automatically hide splash after 2.5 seconds with smooth fade out
        const timer = setTimeout(() => {
          setIsVisible(false);
        }, 2500);
        return () => clearTimeout(timer);
      }
    } catch {
      // Ignore sessionStorage errors
    }
  }, []);

  const dismissSplash = () => {
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(SD_SPLASH_SESSION_KEY, '1');
      }
    } catch {}
    setIsVisible(false);
  };

  if (!mounted) {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          key="sdit-welcome-splash"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          onClick={dismissSplash}
          role="dialog"
          aria-modal="true"
          aria-label="Animasi Selamat Datang SDIT Al-Afiyah"
          className="fixed inset-0 z-[9999] flex flex-col justify-between items-center text-center p-6 sm:p-8 cursor-pointer select-none overflow-hidden"
          style={{
            background: 'linear-gradient(165deg, #032b20 0%, #02231a 50%, #011711 100%)',
          }}
        >
          {/* Subtle Clean Radial Background */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255, 255, 255, 0.4) 1px, transparent 0)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Top Spacer for Clean Balanced Alignment */}
          <div className="pt-8" />

          {/* Center Content: Clean Official Emblem & Titles with Staggered Fade-in Animation */}
          <div className="flex-1 flex flex-col items-center justify-center my-auto z-10 max-w-lg px-2">
            
            {/* 1. Animated Logo Container - Fade in & subtle scale */}
            <motion.div
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative mb-6"
            >
              {/* Clean White Rounded Badge */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white p-3.5 shadow-2xl border border-white/30 flex items-center justify-center relative overflow-hidden">
                <Image
                  src="/images/sd-logo.png"
                  alt="Logo SDIT Al-Afiyah Majalengka"
                  width={96}
                  height={96}
                  className="object-contain w-full h-full drop-shadow-xs"
                  priority
                />
              </div>
            </motion.div>

            {/* 2. Welcome Greeting & School Title - Sequenced Fade-in */}
            <div className="space-y-2">
              <motion.h2
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.22,
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="text-sm sm:text-base font-medium text-emerald-100/90 tracking-wide"
              >
                Selamat Datang di Website Resmi
              </motion.h2>

              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.35,
                  duration: 0.65,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight drop-shadow-md"
              >
                SDIT AL-AFIYAH MAJALENGKA
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.48,
                  duration: 0.55,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="text-xs sm:text-sm font-semibold text-amber-300 tracking-wide pt-0.5"
              >
                Smart • Akhlak • Fitrah
              </motion.p>
            </div>
          </div>

          {/* 3. Bottom Branding Footer - Fade-in */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.62,
              duration: 0.6,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="z-10 pb-4 space-y-2 w-full max-w-xs"
          >
            <div className="h-px w-20 bg-white/15 mx-auto" />
            <div>
              <p className="text-xs sm:text-sm font-bold text-white tracking-wide">
                SDIT Al-Afiyah Majalengka
              </p>
              <p className="text-[10px] sm:text-[11px] text-amber-300/80 font-medium tracking-wider uppercase">
                Yayasan Pendidikan Imam Bonjol
              </p>
            </div>
            <p className="text-[10px] text-emerald-200/50 pt-1">
              Ketuk layar untuk langsung masuk →
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
