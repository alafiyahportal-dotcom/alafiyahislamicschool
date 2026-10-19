'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const SD_SPLASH_SESSION_KEY = 'alafiyah_sd_welcome_seen';

export default function SdWelcomeSplash() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasCheckedSession, setHasCheckedSession] = useState(false);

  useEffect(() => {
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

        // Automatically hide splash after 2.0 seconds
        const timer = setTimeout(() => {
          setIsVisible(false);
        }, 2000);
        return () => clearTimeout(timer);
      }
    } catch {
      // Ignore sessionStorage errors
    } finally {
      setHasCheckedSession(true);
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

  if (!hasCheckedSession || !isVisible) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="sdit-welcome-splash"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.45, ease: 'easeInOut' }}
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

          {/* Center Content: Clean Official Emblem & Titles (No AI Kolom, No Arabic, No Slogan Text) */}
          <div className="flex-1 flex flex-col items-center justify-center my-auto z-10 max-w-lg px-2">
            {/* Animated Logo Container */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: 'spring',
                stiffness: 240,
                damping: 22,
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

            {/* Clean Welcome Greeting & School Title */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="space-y-1.5"
            >
              <h2 className="text-sm sm:text-base font-medium text-emerald-100/90 tracking-wide">
                Selamat Datang di Website Resmi
              </h2>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight drop-shadow-md">
                SDIT AL-AFIYAH MAJALENGKA
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-amber-300 tracking-wide pt-0.5">
                Smart • Akhlak • Fitrah
              </p>
            </motion.div>
          </div>

          {/* Bottom Branding Footer (Exact Match for Unit Identity Pattern) */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
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
