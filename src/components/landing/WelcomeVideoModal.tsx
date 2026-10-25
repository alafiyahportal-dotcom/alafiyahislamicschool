'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Volume2, VolumeX, Play, RotateCcw, Sparkles } from 'lucide-react';

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
  const [isMuted, setIsMuted] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
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

  // Sync autoplay saat modal terbuka
  useEffect(() => {
    if (isOpen && videoRef.current && autoPlay) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setHasStarted(true);
          })
          .catch((err) => {
            console.warn('Autoplay tertahan oleh browser (menjalankan fallback muted):', err);
            if (videoRef.current) {
              videoRef.current.muted = true;
              setIsMuted(true);
              videoRef.current.play().catch(() => {});
            }
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
        videoRef.current.muted = false;
        setIsMuted(false);
        videoRef.current.play().catch(() => {
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true);
            videoRef.current.play().catch(() => {});
          }
        });
      }
    }, 150);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
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
          className="fixed bottom-6 left-6 z-40 group flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-emerald-950/90 hover:bg-emerald-900 text-white shadow-2xl shadow-emerald-950/50 border border-emerald-400/40 backdrop-blur-md transition-all duration-300 hover:scale-105 cursor-pointer text-xs font-semibold"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
          </span>
          <Play className="w-3.5 h-3.5 fill-current text-amber-400" />
          <span>Tonton Video Pembuka</span>
        </button>
      )}

      {/* Modal Video Pembuka (Optimized Portrait Story / Reels Style) */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
        >
          <div className="relative w-full max-w-[390px] sm:max-w-[420px] max-h-[92vh] bg-slate-950 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-emerald-500/30 flex flex-col">
            {/* Header Modal */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-900/95 border-b border-white/10 text-white shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider truncate">
                    {schoolName}
                  </div>
                  <h3 className="text-xs font-semibold text-slate-100 truncate">
                    {title}
                  </h3>
                </div>
              </div>

              {/* Tombol X Tutup */}
              <button
                onClick={handleClose}
                aria-label="Tutup Video Pembuka"
                className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0 ml-2"
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
                muted={isMuted}
                controls
                poster="/videos/intro-sd-poster.jpg"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleVideoEnded}
                className="w-full h-full object-cover sm:object-contain bg-black"
                preload="auto"
              >
                {/* 1. Versi kompresi MP4 H.264 ringkas (5.6 MB - Cepat di Android/iPhone/Laptop) */}
                <source src="/videos/intro-sd-lite.mp4" type="video/mp4" />
                {/* 2. Versi 1080p MP4 H.264 (15.2 MB) */}
                <source src="/videos/intro-sd.mp4" type="video/mp4" />
                {/* 3. Fallback QuickTime MOV asli */}
                <source src="/videos/IMG_4216.MOV" type="video/quicktime" />
                Browser Anda belum mendukung pemutaran video langsung.
              </video>

              {/* Overlay Tombol Suara */}
              {isMuted && (
                <button
                  onClick={toggleMute}
                  className="absolute bottom-16 right-3 sm:bottom-18 sm:right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/75 hover:bg-black/90 text-white text-xs font-medium border border-white/20 backdrop-blur-sm transition-all hover:scale-105 cursor-pointer shadow-xl"
                >
                  <VolumeX className="w-3.5 h-3.5 text-amber-400" />
                  <span>Aktifkan Suara</span>
                </button>
              )}
            </div>

            {/* Progress Bar Bawah */}
            <div className="w-full bg-slate-900 h-1 relative overflow-hidden shrink-0">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Footer Modal */}
            <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-950 text-slate-300 text-xs border-t border-white/5 shrink-0">
              <span className="font-mono text-[11px] text-slate-400">
                {formatTime(currentTime)} / {formatTime(duration || 27)}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className="p-1 rounded-md hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title={isMuted ? 'Nyalakan Suara' : 'Matikan Suara'}
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-emerald-400" />
                  )}
                </button>
                <button
                  onClick={handleClose}
                  className="px-3 py-1 rounded-lg bg-emerald-600/80 hover:bg-emerald-600 text-white font-medium text-xs transition-colors cursor-pointer"
                >
                  Lewati Video (X)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
