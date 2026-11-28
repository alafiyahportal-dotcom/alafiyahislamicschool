'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Volume2, VolumeX } from 'lucide-react';
import { useBackClose } from '@/components/shared/MobileBackNavigationGuard';

interface WelcomeVideoModalProps {
  videoSrc?: string;
  title?: string;
  schoolName?: string;
  autoPlay?: boolean;
}

export default function WelcomeVideoModal({
  videoSrc = '/videos/intro-sd-lite.mp4',
  title = 'Video Intro',
  schoolName = 'SDIT AL-AFIYAH',
  autoPlay = true,
}: WelcomeVideoModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Tampilkan otomatis HANYA di tampilan HP (layar < 640px) jika belum ditutup di sesi ini
  useEffect(() => {
    try {
      const isMobileViewport =
        typeof window !== 'undefined' && window.matchMedia('(max-width: 639px)').matches;
      if (!isMobileViewport) return;

      const hasSeen = sessionStorage.getItem('sd_intro_video_dismissed');
      if (!hasSeen) {
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 450);
        return () => clearTimeout(timer);
      }
    } catch {
      // ignore
    }
  }, []);

  // Autoplay saat modal terbuka & kunci scroll latar belakang
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (videoRef.current && autoPlay) {
        videoRef.current.muted = isMuted;
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn('Autoplay dicegah oleh browser:', err);
          });
        }
      }
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, autoPlay, isMuted]);

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

  useBackClose(isOpen, handleClose, 'sd-intro-video');

  const handleOpenManually = () => {
    setIsOpen(true);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      }
    }, 120);
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
      setProgress((curr / dur) * 100);
    }
  };

  return (
    <div className="sm:hidden">
      {/* Tombol Mengambang Minimalis (Hanya di HP) untuk memutar kembali video */}
      {!isOpen && (
        <button
          type="button"
          onClick={handleOpenManually}
          aria-label="Tonton Video Intro SDIT"
          className="fixed bottom-16 left-3.5 z-40 inline-flex items-center gap-1.5 px-3 py-2 rounded-xs bg-[#003831] hover:bg-[#00594f] text-white shadow-md border-l-2 border-[#e5a93b] text-[11px] font-extrabold uppercase tracking-wider transition-colors cursor-pointer"
        >
          <Play className="w-3 h-3 fill-[#e5a93b] text-[#e5a93b]" />
          <span>Video Intro</span>
        </button>
      )}

      {/* Fullscreen Mobile Intro Video (Penuh 100% Layar HP Tanpa Pinggiran) */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[130] w-screen h-[100dvh] bg-black overflow-hidden animate-in fade-in duration-200"
        >
          <video
            ref={videoRef}
            playsInline
            autoPlay={autoPlay}
            muted={isMuted}
            poster="/videos/intro-sd-poster.jpg"
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleClose}
            className="w-full h-full object-cover bg-black"
            preload="metadata"
          >
            <source src={videoSrc} type="video/mp4" />
            <source src="/videos/intro-sd.mp4" type="video/mp4" />
          </video>

          {/* Top Minimalist Floating Bar (Full-Screen Edge-to-Edge) */}
          <div className="absolute top-0 inset-x-0 z-10 px-4 pt-4 pb-6 bg-gradient-to-b from-black/75 via-black/30 to-transparent flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-[#e5a93b] shrink-0" />
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-white truncate">
                {schoolName} • {title}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={toggleMute}
                aria-label={isMuted ? 'Nyalakan Suara' : 'Matikan Suara'}
                className="w-8 h-8 rounded-xs bg-black/50 hover:bg-black/75 text-white border border-white/25 flex items-center justify-center transition-colors cursor-pointer"
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-[#e5a93b]" />
                ) : (
                  <Volume2 className="w-4 h-4 text-[#e5a93b]" />
                )}
              </button>

              <button
                type="button"
                onClick={handleClose}
                aria-label="Tutup Video"
                className="w-8 h-8 rounded-xs bg-[#00594f] hover:bg-[#003831] text-white border border-white/25 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bottom Minimalist Floating Action (Lewati) */}
          <div className="absolute bottom-5 right-4 z-10">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-xs bg-[#003831]/90 hover:bg-[#00594f] text-white border border-[#e5a93b]/70 text-[11px] font-extrabold uppercase tracking-wider backdrop-blur-xs transition-colors cursor-pointer"
            >
              Lewati ✕
            </button>
          </div>

          {/* Ultra-thin 3px Golden Progress Line at Very Bottom Edge of Screen */}
          <div className="absolute bottom-0 inset-x-0 h-[3px] bg-white/20 z-10">
            <div
              className="h-full bg-[#e5a93b] transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
