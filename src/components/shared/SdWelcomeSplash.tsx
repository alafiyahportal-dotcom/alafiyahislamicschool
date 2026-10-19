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
        // Automatically hide splash after 2.6 seconds
        const timer = setTimeout(() => {
          dismissSplash();
        }, 2600);
        return () => clearTimeout(timer);
      }
    } catch {
      // Ignore sessionStorage errors (e.g. incognito restrictions)
    } finally {
      setHasCheckedSession(true);
    }
  }, []);

  const dismissSplash = () => {
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(SD_SPLASH_SESSION_KEY, '1');
      }
    } catch {
      // Ignore
    }
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
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          onClick={dismissSplash}
          role="dialog"
          aria-modal="true"
          aria-label="Animasi Selamat Datang SDIT Al-Afiyah"
          className="fixed inset-0 z-[9999] flex flex-col justify-between items-center text-center p-6 sm:p-8 cursor-pointer select-none overflow-hidden"
          style={{
            background: 'linear-gradient(150deg, #064E3B 0%, #04382A 45%, #02251B 100%)',
          }}
        >
          {/* Subtle Islamic Motif Background Overlay */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255, 255, 255, 0.4) 1px, transparent 0)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Top Ambient Badge */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="pt-4 sm:pt-6 z-10"
          >
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-bold text-amber-300 tracking-wider uppercase shadow-xs">
              <span>PORTAL RESMI SEKOLAH</span>
            </div>
          </motion.div>

          {/* Center Content: Emblem, Greeting, Title */}
          <div className="flex-1 flex flex-col items-center justify-center my-auto z-10 max-w-lg px-2">
            {/* Animated Logo Container with Soft Warm Amber Glow */}
            <motion.div
              initial={{ scale: 0.75, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: 'spring',
                stiffness: 240,
                damping: 22,
                delay: 0.1,
              }}
              className="relative mb-6"
            >
              {/* Soft Ambient Radial Halo */}
              <motion.div
                animate={{
                  scale: [1, 1.14, 1],
                  opacity: [0.35, 0.65, 0.35],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: 'easeInOut',
                }}
                className="absolute -inset-5 rounded-3xl bg-amber-400/20 blur-xl pointer-events-none"
              />

              {/* Floating Badge */}
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 3.6, ease: 'easeInOut' }}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white p-3.5 shadow-2xl border border-white/50 flex items-center justify-center relative overflow-hidden"
              >
                <Image
                  src="/images/sd-logo.png"
                  alt="Logo SDIT Al-Afiyah Majalengka"
                  width={96}
                  height={96}
                  className="object-contain w-full h-full drop-shadow-xs"
                  priority
                />
              </motion.div>
            </motion.div>

            {/* Bismillah Header */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="mb-2"
            >
              <p className="font-arabic text-base sm:text-lg text-amber-300 font-semibold tracking-wide drop-shadow-xs">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
            </motion.div>

            {/* Welcome Greeting */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="space-y-1.5"
            >
              <h2 className="text-sm sm:text-base font-medium text-emerald-100 tracking-wide">
                Selamat Datang di Website Resmi
              </h2>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight drop-shadow-md">
                SDIT AL-AFIYAH MAJALENGKA
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-amber-300 tracking-wide pt-0.5">
                Smart • Akhlak • Fitrah
              </p>
              <p className="text-[11px] sm:text-xs text-emerald-100/80 max-w-sm mx-auto leading-relaxed pt-1">
                Membimbing Fitrah Ananda Menjadi Generasi Qur&apos;ani, Cerdas &amp; Berakhlak Mulia
              </p>
            </motion.div>
          </div>

          {/* Bottom Branding Footer (Exact Match for Unit Identity Pattern) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
            className="z-10 pb-2 sm:pb-4 space-y-2 w-full max-w-xs"
          >
            <div className="h-px w-24 bg-white/20 mx-auto" />
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
