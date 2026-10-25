'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Play } from 'lucide-react';

interface WelcomeVideoModalProps {
  videoSrc?: string;
  title?: string;
  schoolName?: string;
  autoPlay?: boolean;
}

export default function WelcomeVideoModal({
  videoSrc = '/videos/intro-sd-lite.mp4',
  title = 'Sekilas Suasana & Pembiasaan Belajar',
  schoolName = 'SDIT Al-Afiyah Majalengka',
  autoPlay = true,
}: WelcomeVideoModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Cek apakah sudah pernah dilihat di sesi browser ini
  useEffect(() => {
    try {
      const hasSeen = sessionStorage.getItem('sd_intro_video_dismissed');
      // Jika belum pernah ditutup, buka modal otomatis
      if (!hasSeen) {
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 500);
        return () => clearTimeout(timer);
      }
    } catch {
      setIsOpen(true);
    }
  }, []);

  // Sync autoplay saat modal terbuka (muted agar browser tidak memblokir)
  useEffect(() => {
    if (isOpen && videoRef.current && autoPlay) {
      videoRef.current.muted = true;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Autoplay dicegah oleh browser:', err);
        });
      }
    }
  }, [isOpen, autoPlay]);

  // ESC key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleClose = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setIsOpen(false);
    try {
      sessionStorage.setItem('sd_intro_video_dismissed', 'true');
    } catch {
      // ignore
    }
  };

  const handleOpenManually = () => {
    setIsOpen(true);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      }
    }, 150);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const curr = videoRef.current.currentTime;
      const dur = videoRef.current.duration || 27;
      setCurrentTime(curr);
      setProgress((curr / dur) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 27);
    }
  };

  const handleVideoEnded = () => {
    // Otomatis menutup sendiri ketika durasi video selesai
    handleClose();
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {/* Floating Button untuk memutar kembali video kapan saja jika modal sudah ditutup */}
      {!isOpen && (
        <button
          onClick={handleOpenManually}
          aria-label="Tonton Video Pembuka SDIT"
          className="fixed bottom-6 left-6 z-40 group flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-950/90 hover:bg-emerald-900 text-white shadow-2xl shadow-emerald-950/50 border border-emerald-400/40 backdrop-blur-md transition-all duration-300 hover:scale-105 cursor-pointer text-xs font-semibold"
        >
          <Play className="w-3.5 h-3.5 fill-current text-white" />
          <span>Tonton Video Pembuka</span>
        </button>
      )}

      {/* Modal Video Pembuka (Translucent Frosted Glass Theme SDIT) */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-emerald-950/35 backdrop-blur-md sm:backdrop-blur-lg animate-in fade-in duration-300"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
        >
          <div className="relative w-full max-w-[390px] sm:max-w-[420px] max-h-[92vh] bg-emerald-950/90 backdrop-blur-2xl rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(6,78,59,0.5)] border border-emerald-400/35 flex flex-col">
            {/* Header Modal (Khas SDIT Al-Afiyah) */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-emerald-900/90 via-emerald-800/90 to-teal-900/90 border-b border-emerald-500/25 text-white shrink-0">
              <div className="min-w-0 pr-2">
                <div className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider truncate">
                  {schoolName}
                </div>
                <h3 className="text-xs font-semibold text-white truncate">
                  {title}
                </h3>
              </div>

              {/* Tombol X Tutup */}
              <button
                onClick={handleClose}
                aria-label="Tutup Video Pembuka"
                className="p-1.5 rounded-full text-emerald-200 hover:text-white hover:bg-white/15 transition-colors cursor-pointer shrink-0"
                title="Tutup (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Container (Format Vertikal 9:16) */}
            <div className="relative w-full aspect-[9/16] max-h-[72vh] bg-black flex items-center justify-center overflow-hidden">
              <video
                ref={videoRef}
                playsInline
                autoPlay={autoPlay}
                muted
                poster="/videos/intro-sd-poster.jpg"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleVideoEnded}
                className="w-full h-full object-cover sm:object-contain bg-black"
                preload="auto"
              >
                {/* 1. Versi kompresi MP4 H.264 ringkas (5.8 MB - Cepat di Android/iPhone/Laptop) */}
                <source src="/videos/intro-sd-lite.mp4" type="video/mp4" />
                {/* 2. Versi 1080p MP4 H.264 (15.2 MB) */}
                <source src="/videos/intro-sd.mp4" type="video/mp4" />
                Browser Anda belum mendukung pemutaran video langsung.
              </video>
            </div>

            {/* Progress Bar Bawah */}
            <div className="w-full bg-emerald-950/80 h-1 relative overflow-hidden shrink-0">
              <div
                className="h-full bg-gradient-to-r from-amber-400 via-teal-300 to-emerald-400 transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Footer Modal: Timer & Tombol Lewati */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-emerald-950/95 text-emerald-100 text-xs border-t border-emerald-500/20 shrink-0">
              <span className="font-mono text-[11px] text-emerald-200/90 font-medium">
                {formatTime(currentTime)} / {formatTime(duration || 27)}
              </span>

              <button
                onClick={handleClose}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-md shadow-emerald-900/40 transition-colors cursor-pointer"
              >
                Lewati Video (X)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
