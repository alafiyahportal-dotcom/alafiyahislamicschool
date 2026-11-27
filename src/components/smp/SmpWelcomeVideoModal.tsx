'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Volume2, VolumeX } from 'lucide-react';

interface SmpWelcomeVideoModalProps {
  videoSrc?: string;
  title?: string;
  schoolName?: string;
  autoPlay?: boolean;
}

export default function SmpWelcomeVideoModal({
  videoSrc = '/videos/intro-sd-lite.mp4',
  title = 'Video Intro',
  schoolName = 'SMP IT AL-AFIYAH',
  autoPlay = true,
}: SmpWelcomeVideoModalProps) {
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

      const hasSeen = sessionStorage.getItem('smp_intro_video_dismissed');
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

  useEffect(() => {
    if (isOpen && videoRef.current && autoPlay) {
      videoRef.current.muted = isMuted;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Autoplay dicegah oleh browser:', err);
        });
      }
    }
  }, [isOpen, autoPlay, isMuted]);

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
      sessionStorage.setItem('smp_intro_video_dismissed', 'true');
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
          aria-label="Tonton Video Intro SMP IT"
          className="fixed bottom-16 left-3.5 z-40 inline-flex items-center gap-1.5 px-3 py-2 rounded-xs bg-[#030164] hover:bg-[#090580] text-white shadow-md border-l-2 border-[#ffd51e] text-[11px] font-extrabold uppercase tracking-wider transition-colors cursor-pointer"
        >
          <Play className="w-3 h-3 fill-[#ffd51e] text-[#ffd51e]" />
          <span>Video Intro</span>
        </button>
      )}

      {/* Modal Video Intro Minimalis Tanpa Pinggiran Tebal (Khusus HP) */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
        >
          {/* Bingkai Ultra-Tipis & Minimalis (hanya garis 1px & sudut tajam modern) */}
          <div className="relative w-full max-w-[330px] bg-[#030164] rounded-xs overflow-hidden shadow-2xl border border-[#ffd51e]/50 flex flex-col">
            <div className="relative w-full aspect-[9/16] max-h-[78svh] bg-black overflow-hidden">
              <video
                ref={videoRef}
                playsInline
                autoPlay={autoPlay}
                muted={isMuted}
                poster="/images/smp-kelulusan-angkatan-3.jpg"
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleClose}
                className="w-full h-full object-cover bg-black"
                preload="metadata"
              >
                <source src={videoSrc} type="video/mp4" />
                <source src="/videos/intro-sd.mp4" type="video/mp4" />
              </video>

              {/* Top Minimalist Floating Bar */}
              <div className="absolute top-0 inset-x-0 z-10 px-3 py-2.5 bg-gradient-to-b from-black/75 via-black/30 to-transparent flex items-center justify-between">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ffd51e] shrink-0" />
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-white truncate">
                    {schoolName} • {title}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={toggleMute}
                    aria-label={isMuted ? 'Nyalakan Suara' : 'Matikan Suara'}
                    className="w-7 h-7 rounded-xs bg-black/50 hover:bg-black/75 text-white border border-white/20 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    {isMuted ? (
                      <VolumeX className="w-3.5 h-3.5 text-[#ffd51e]" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5 text-[#ffd51e]" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleClose}
                    aria-label="Tutup Video"
                    className="w-7 h-7 rounded-xs bg-[#030164] hover:bg-[#090580] text-white border border-white/25 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Bottom Minimalist Floating Action (Lewati) */}
              <div className="absolute bottom-2.5 right-2.5 z-10">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-3 py-1.5 rounded-xs bg-[#030164]/90 hover:bg-[#090580] text-white border border-[#ffd51e]/60 text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-xs transition-colors cursor-pointer"
                >
                  Lewati ✕
                </button>
              </div>

              {/* Ultra-thin 2.5px Golden Progress Line at Bottom Edge */}
              <div className="absolute bottom-0 inset-x-0 h-[2.5px] bg-white/20 z-10">
                <div
                  className="h-full bg-[#ffd51e] transition-all duration-150"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
