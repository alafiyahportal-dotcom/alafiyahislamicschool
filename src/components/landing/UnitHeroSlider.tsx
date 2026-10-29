'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, MessageCircle, ArrowDownCircle, Zap, FileText, Download, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { getStoredReferralCode } from '@/lib/referral';
import HeroFloatingBubbles from './HeroFloatingBubbles';

export interface UnitSlideData {
  id: number;
  badge: string;
  titlePart1: string;
  titleHighlight: string;
  titlePart2: string;
  description: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  image: string;
  trustItems?: Array<{
    icon: 'shield' | 'check' | 'calendar' | 'grad' | 'users' | 'award';
    text: string;
  }>;
}

interface UnitHeroSliderProps {
  slug: 'tk' | 'sd' | 'smp';
  schoolName: string;
  badgeText: string;
  registrationFee?: number;
  waCenterPhone: string;
  customSlides?: UnitSlideData[];
  statsCards?: React.ReactNode;
}

function renderHeroHeadline(
  slug: string,
  titlePart1: string,
  titleHighlight: string,
  titlePart2: string,
  highlightClass: string
) {
  const p1 = (titlePart1 || '').trim();

  // SDIT official slogan: "Bukan Sekadar Tempat Belajar, Namun Juga Tempat Bertumbuh"
  if (slug === 'sd' || /bukan\s+(sekedar|sekadar)/i.test(p1)) {
    const lineCls = 'text-[2.4rem] xs:text-[2.75rem] sm:text-5xl lg:text-[3.85rem] font-black leading-[1.03] tracking-tight drop-shadow-sm';
    return (
      <div className="flex flex-col gap-1 sm:gap-1.5 text-left">
        <span className={`${lineCls} text-white`}>Bukan Sekadar</span>
        <span className={`${lineCls} text-white`}>Tempat Belajar,</span>
        <span className={`${lineCls} text-white`}>Namun Juga</span>
        <span className={`${lineCls} ${highlightClass}`}>Tempat Bertumbuh</span>
      </div>
    );
  }

  // SMP IT - 3 distinct bold lines as requested (enlarged & prominent)
  if (slug === 'smp' || /mencetak\s+generasi/i.test(p1)) {
    return (
      <div className="flex flex-col gap-1 sm:gap-1.5 text-left">
        <span className="text-[2.4rem] xs:text-[2.75rem] sm:text-5xl lg:text-[3.85rem] font-black text-white leading-[1.03] tracking-tight drop-shadow-sm">
          Mencetak Generasi
        </span>
        <span className={`text-[2.4rem] xs:text-[2.75rem] sm:text-5xl lg:text-[3.85rem] font-black ${highlightClass} leading-[1.03] tracking-tight drop-shadow-sm`}>
          Smart &amp; Religious
        </span>
        <span className="text-[2.4rem] xs:text-[2.75rem] sm:text-5xl lg:text-[3.85rem] font-black text-white leading-[1.03] tracking-tight drop-shadow-sm">
          Berakhlak Qur’ani
        </span>
      </div>
    );
  }

  // General fallback
  return (
    <div className="text-[2.4rem] xs:text-[2.75rem] sm:text-5xl lg:text-[3.85rem] font-black leading-[1.03] text-white tracking-tight flex flex-col gap-1 text-left">
      <span>{p1}</span>
      {titleHighlight && <span className={highlightClass}>{titleHighlight}</span>}
      {titlePart2 && <span>{titlePart2}</span>}
    </div>
  );
}

const SD_POLAROID_PHOTOS = [
  {
    src: '/images/sd-field-study-banner.jpg',
    title: 'Murid SDIT Al-Afiyah',
    subtitle: 'Mencetak Generasi Qur\'ani & Sains',
  },
  {
    src: '/images/sd-seedling-care.jpg',
    title: 'Observasi Greenhouse & Sains',
    subtitle: 'Outdoor Learning • Smart Akhlak Fitrah',
  },
  {
    src: '/images/sd-hero-students.jpg',
    title: 'Praktik Agro-Sains Terpadu',
    subtitle: 'Mendidik dengan Keteladanan & Adab',
  },
];

export default function UnitHeroSlider({
  slug,
  schoolName,
  badgeText,
  registrationFee = 250000,
  waCenterPhone,
  customSlides,
  statsCards
}: UnitHeroSliderProps) {
  const [refCode, setRefCode] = useState<string | null>(null);
  const [polaroidIdx, setPolaroidIdx] = useState(0);
  const [countdown, setCountdown] = useState({ days: 62, hours: 14, minutes: 56, seconds: 22 });

  useEffect(() => {
    setRefCode(getStoredReferralCode());
  }, []);

  // Live countdown timer for SD SPMB card
  useEffect(() => {
    if (slug !== 'sd') return;

    const updateTimer = () => {
      const now = new Date().getTime();
      // Target: End of Gelombang 1 (30 Dec 2026), fallback to Gelombang 2 (3 Apr 2027), fallback to Gelombang 3 (26 Jun 2027)
      const wave1End = new Date('2026-12-30T23:59:59+07:00').getTime();
      const wave2End = new Date('2027-04-03T23:59:59+07:00').getTime();
      const wave3End = new Date('2027-06-26T23:59:59+07:00').getTime();

      const target = now < wave1End ? wave1End : now < wave2End ? wave2End : wave3End;
      const diff = Math.max(0, target - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setCountdown({ days, hours, minutes, seconds });
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [slug]);

  // Subtle auto-cycle for polaroid photo every 6 seconds on SD
  useEffect(() => {
    if (slug !== 'sd') return;
    const interval = setInterval(() => {
      setPolaroidIdx((prev) => (prev + 1) % SD_POLAROID_PHOTOS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slug]);

  const ppdbUrl = slug === 'sd' ? '/sd/spmb/daftar' : slug === 'smp' ? '/smp/spmb/daftar' : `/ppdb/daftar?school=${slug}`;
  const waUrl = `https://wa.me/${waCenterPhone}?text=${encodeURIComponent(
    `Assalamu'alaikum Panitia SPMB ${schoolName}, saya ingin bertanya perihal informasi pendaftaran murid baru TP 2027/2028.`
  )}`;

  // Default unit-tailored slide data
  const slide = useMemo<UnitSlideData>(() => {
    if (customSlides && customSlides.length > 0) {
      return customSlides[0];
    }

    if (slug === 'sd') {
      return {
        id: 1,
        badge: 'SPMB T.A. 2027/2028 • TELAH DIBUKA',
        titlePart1: 'Bukan Sekadar Tempat Belajar, Namun Juga ',
        titleHighlight: 'Tempat Bertumbuh',
        titlePart2: '',
        description: 'Mencetak generasi sholeh, mandiri, dan berakhlak mulia dengan prinsip Smart Akhlak Fitrah serta bimbingan karakter nabawiyah.',
        primaryCtaText: 'Daftar SPMB SDIT',
        primaryCtaLink: ppdbUrl,
        secondaryCtaText: 'Tanya Admin WA',
        secondaryCtaLink: waUrl,
        image: '/images/hero/sd-santri-cutout.webp',
        trustItems: [
          { icon: 'shield', text: 'Kurikulum Terpadu & Karakter Nabawiyah' },
          { icon: 'check', text: 'Lingkungan Asri & Ramah Anak' },
          { icon: 'award', text: 'Tahfidz Juz 30 Mutqin' },
          { icon: 'calendar', text: `Formulir: Rp ${registrationFee.toLocaleString('id-ID')}` },
        ]
      };
    }

    if (slug === 'tk') {
      return {
        id: 1,
        badge: 'PAUD & TK IT AL-AFIYAH MAJALENGKA',
        titlePart1: 'Tumbuh Ceria, Mandiri & ',
        titleHighlight: 'Berakhlak Shalih',
        titlePart2: 'Sejak Usia Emas',
        description: 'Pendidikan usia dini berbasis sentra bermain bermakna dan pembiasaan adab nabawiyah dengan bimbingan guru penuh kasih sayang.',
        primaryCtaText: 'Daftar Murid Baru TK',
        primaryCtaLink: ppdbUrl,
        secondaryCtaText: 'Konsultasi WhatsApp',
        secondaryCtaLink: waUrl,
        image: '/images/hero/sd-cutout.webp',
        trustItems: [
          { icon: 'shield', text: 'Terakreditasi Resmi' },
          { icon: 'users', text: 'Rasio Kelas Ramah 1:8' },
          { icon: 'calendar', text: 'T.A. 2027/2028' },
          { icon: 'check', text: `Formulir: Rp ${registrationFee.toLocaleString('id-ID')}` }
        ]
      };
    }

    // Default SMP
    return {
      id: 1,
      badge: 'SPMB T.A. 2027/2028 • BE SMART & RELIGIOUS',
      titlePart1: 'Mencetak Generasi',
      titleHighlight: 'Smart & Religious',
      titlePart2: 'Berakhlak Qur’ani',
      description: 'Sekolah Menengah Pertama Islam Terpadu Terakreditasi A dengan target tahfidz 3-5+ juz mutqin, fasih bahasa Arab, dan pembinaan karakter mandiri.',
      primaryCtaText: 'Daftar SPMB SMP IT',
      primaryCtaLink: ppdbUrl,
      secondaryCtaText: 'Konsultasi WhatsApp',
      secondaryCtaLink: waUrl,
      image: '/images/hero/smp-cutout.webp',
      trustItems: [
        { icon: 'award', text: 'Terakreditasi A (SK No. 012/BAN-PDM/SK/2025)' },
        { icon: 'check', text: 'Target Tahfidz 3-5+ Juz' },
        { icon: 'calendar', text: 'Diskon Gelombang 1 s.d. 70%' },
        { icon: 'shield', text: `Formulir: Rp ${registrationFee.toLocaleString('id-ID')}` }
      ]
    };
  }, [slug, customSlides, ppdbUrl, waUrl, registrationFee]);

  // Unit theme styles - solid identity color per unit (no photo, full-color banner)
  const theme = useMemo(() => {
    switch (slug) {
      case 'sd':
        return {
          bgClass: 'bg-gradient-to-br from-[#064e3b] via-[#047857] to-[#00A651]',
          highlightText: 'text-[#ffd51e]',
          primaryBtn: 'bg-[#ffd51e] hover:bg-yellow-400 text-[#064e3b]',
        };
      case 'tk':
        return {
          bgClass: 'bg-gradient-to-b from-[#059669] via-[#047857] to-[#065f46]',
          highlightText: 'text-[#ffd51e]',
          primaryBtn: 'bg-[#ffd51e] hover:bg-yellow-400 text-[#044e39]',
        };
      case 'smp':
      default:
        return {
          bgClass: 'bg-gradient-to-b from-[#05027a] via-[#030164] to-[#02004a]',
          highlightText: 'text-[#ffd51e]',
          primaryBtn: 'bg-[#ffd51e] hover:bg-yellow-400 text-[#030164]',
        };
    }
  }, [slug]);

  let effectiveCtaLink = slide.primaryCtaLink || ppdbUrl;
  if (refCode && (effectiveCtaLink.includes('/ppdb/daftar') || effectiveCtaLink.includes('/spmb/daftar'))) {
    effectiveCtaLink += `${effectiveCtaLink.includes('?') ? '&' : '?'}ref=${encodeURIComponent(refCode)}`;
  }

  // ============================================================================
  // BESPOKE SD HERO LAYOUT (Polaroid Red Pushpin + Curved Wave + Floating SPMB Card)
  // ============================================================================
  if (slug === 'sd') {
    const activePolaroid = SD_POLAROID_PHOTOS[polaroidIdx] || SD_POLAROID_PHOTOS[0];

    return (
      <div className="relative w-full bg-white select-none overflow-hidden">
        {/* Top Deep Emerald Hero Area */}
        <section className="relative w-full bg-gradient-to-b from-[#005742] via-[#00634b] to-[#00684e] text-white pt-24 sm:pt-32 lg:pt-36 pb-32 sm:pb-44 lg:pb-48 overflow-hidden">
          {/* Subtle ambient radial glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -left-24 w-[480px] h-[480px] rounded-full bg-emerald-400/10 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-1/4 right-0 w-[420px] h-[420px] rounded-full bg-teal-300/10 blur-3xl"
          />

          <div className="relative z-10 max-w-6xl xl:max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 xl:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
              {/* Left Column: Typography, Hashtags & Selengkapnya Pill */}
              <div className="lg:col-span-7 text-left">
                <p className="text-emerald-200/95 italic font-medium text-sm sm:text-base lg:text-[17px] mb-2.5 sm:mb-3 tracking-wide">
                  Ahlan wa Sahlan di Official Website
                </p>

                <h1 className="text-[2.5rem] xs:text-[2.85rem] sm:text-5xl lg:text-[3.6rem] xl:text-[4rem] font-black uppercase text-white leading-[1.06] tracking-tight drop-shadow-xs">
                  SDIT AL-AFIYAH
                </h1>

                <p className="mt-4 sm:mt-5 text-base sm:text-lg lg:text-xl text-white/95 leading-relaxed max-w-xl font-semibold">
                  Bukan Sekadar Tempat Belajar, Namun Juga Tempat Bertumbuh.
                </p>

                {/* Hashtags Row */}
                <div className="mt-5 sm:mt-6 flex flex-wrap items-center gap-x-4 sm:gap-x-5 gap-y-2 text-xs sm:text-sm font-extrabold tracking-wide">
                  <span>
                    <span className="text-[#f59e0b]">#</span>
                    <span className="text-white">SmartAkhlakFitrah</span>
                  </span>
                  <span>
                    <span className="text-[#f59e0b]">#</span>
                    <span className="text-white">JagoTahfidz</span>
                  </span>
                </div>

                {/* White Pill CTA Button */}
                <div className="mt-7 sm:mt-8 flex flex-wrap items-center gap-3">
                  <a
                    href="#pengumuman"
                    className="group inline-flex items-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-white hover:bg-emerald-50 text-[#005c45] font-extrabold text-xs sm:text-[13px] uppercase tracking-wider shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-95"
                  >
                    <ArrowDownCircle className="w-4 h-4 text-[#005c45] stroke-[2.3] transition-transform duration-200 group-hover:translate-y-0.5" />
                    <span>SELENGKAPNYA</span>
                  </a>
                </div>
              </div>

              {/* Right Column: Stacked Polaroid Frame with Red 3D Pushpin */}
              <div className="lg:col-span-5 flex justify-center lg:justify-end mt-2 lg:mt-0">
                <div
                  onClick={() => setPolaroidIdx((prev) => (prev + 1) % SD_POLAROID_PHOTOS.length)}
                  title="Klik untuk melihat foto kegiatan murid lainnya"
                  className="relative w-full max-w-[360px] sm:max-w-[400px] cursor-pointer group"
                >
                  {/* Back Stacked Polaroid Card */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-white/90 rounded-[22px] rotate-[-6deg] translate-x-2 translate-y-2 shadow-xl transition-transform duration-500 group-hover:rotate-[-8deg]"
                  />

                  {/* Main Front Polaroid Card */}
                  <div className="relative bg-white rounded-[22px] p-3.5 sm:p-4 pb-5 sm:pb-6 shadow-[0_25px_55px_-12px_rgba(0,0,0,0.4)] rotate-[2deg] group-hover:rotate-[0.5deg] transition-all duration-500">
                    {/* 3D Red Pushpin SVG */}
                    <div
                      aria-hidden="true"
                      className="absolute -top-5 left-1/2 -translate-x-1/2 z-20 drop-shadow-[0_6px_6px_rgba(0,0,0,0.35)]"
                    >
                      <svg width="34" height="42" viewBox="0 0 34 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Metallic needle */}
                        <path d="M17 26L17 40" stroke="#94A3B8" strokeWidth="2.6" strokeLinecap="round" />
                        <path d="M17 26L17 34" stroke="#475569" strokeWidth="2.6" strokeLinecap="round" />
                        {/* Pin base collar */}
                        <ellipse cx="17" cy="24" rx="9" ry="4.5" fill="#B91C1C" />
                        {/* Pin body cylinder */}
                        <path d="M11 11L9 23C9 25 12.5 26.5 17 26.5C21.5 26.5 25 25 25 23L23 11H11Z" fill="#DC2626" />
                        {/* Pin top cap */}
                        <ellipse cx="17" cy="10" rx="8.5" ry="5.5" fill="#EF4444" />
                        {/* Glossy highlight */}
                        <ellipse cx="14.5" cy="8.5" rx="3.5" ry="2" fill="#FCA5A5" opacity="0.75" />
                      </svg>
                    </div>

                    {/* Photo Container */}
                    <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-slate-100">
                      <img
                        src={activePolaroid.src}
                        alt={activePolaroid.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      {/* Subtle slide dots */}
                      <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 bg-black/35 backdrop-blur-xs px-2 py-1 rounded-full">
                        {SD_POLAROID_PHOTOS.map((_, i) => (
                          <span
                            key={i}
                            className={`h-1.5 rounded-full transition-all ${i === polaroidIdx ? 'w-4 bg-white' : 'w-1.5 bg-white/50'
                              }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Polaroid Caption */}
                    <div className="mt-3.5 sm:mt-4 text-center px-2">
                      <h3 className="text-sm sm:text-[15px] font-extrabold text-slate-900 tracking-tight">
                        {activePolaroid.title}
                      </h3>
                      <p className="text-[11px] sm:text-xs font-medium text-[#00684e]/85 mt-0.5">
                        {activePolaroid.subtitle}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Smooth Curved White Wave Divider at Bottom of Hero */}
          <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none z-10">
            <svg
              className="relative block w-full h-[65px] sm:h-[95px] lg:h-[120px]"
              viewBox="0 0 1440 120"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0,64 C240,12 480,108 720,88 C960,68 1200,24 1440,56 L1440,120 L0,120 Z"
                fill="#ffffff"
              />
            </svg>
          </div>
        </section>

        {/* Overlapping Floating SPMB Card */}
        <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 sm:-mt-28 lg:-mt-32 pb-8 sm:pb-12">
          <div className="bg-white rounded-[26px] sm:rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.14)] border border-slate-100 p-5 sm:p-8 lg:p-9">
            {/* Top Row: SPMB Title + Live Red Countdown Boxes */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              {/* Left: Lightning Badge & Title */}
              <div className="flex items-center gap-3.5 sm:gap-4">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-amber-50 border border-amber-200/70 flex items-center justify-center shrink-0 shadow-2xs">
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-[#f59e0b] fill-[#f59e0b]" />
                </div>
                <div>
                  <div className="text-base sm:text-xl font-extrabold text-slate-900 tracking-tight leading-tight">
                    SPMB T.A 2027/2028
                  </div>
                  <div className="text-lg sm:text-2xl font-black text-[#007a55] tracking-tight leading-tight mt-0.5">
                    DIBUKA!
                  </div>
                </div>
              </div>

              {/* Right: 4 Crimson Countdown Boxes */}
              <div className="flex items-center gap-2 sm:gap-2.5 self-start sm:self-auto">
                {[
                  { value: countdown.days, label: 'Hari' },
                  { value: countdown.hours, label: 'Jam' },
                  { value: countdown.minutes, label: 'Menit' },
                  { value: countdown.seconds, label: 'Detik' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="w-[52px] sm:w-[60px] py-2 sm:py-2.5 rounded-xl bg-[#dc2626] text-white flex flex-col items-center justify-center shadow-sm"
                  >
                    <span className="text-base sm:text-xl font-black leading-none tracking-tight tabular-nums">
                      {String(item.value).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-semibold text-white/90 mt-1">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Middle Row: 3 Pill CTA Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mt-6 sm:mt-7">
              <Link
                href={effectiveCtaLink}
                className="w-full py-3.5 px-5 rounded-full bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs sm:text-[13px] flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-[1.01] active:scale-95"
              >
                <FileText className="w-4 h-4 shrink-0" />
                <span>Daftar Online PPDB</span>
              </Link>

              <a
                href="#pengumuman"
                className="w-full py-3.5 px-5 rounded-full bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold text-xs sm:text-[13px] flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-[1.01] active:scale-95"
              >
                <Download className="w-4 h-4 shrink-0" />
                <span>Unduh Brosur &amp; Biaya</span>
              </a>

              <Link
                href="/sd/program"
                className="w-full py-3.5 px-5 rounded-full bg-[#00684e] hover:bg-[#00523d] text-white font-bold text-xs sm:text-[13px] flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-[1.01] active:scale-95"
              >
                <BookOpen className="w-4 h-4 shrink-0" />
                <span>Panduan Kurikulum</span>
              </Link>
            </div>

            {/* Subtle Divider */}
            <div className="border-t border-slate-100 my-5 sm:my-6" />

            {/* Bottom Row: 4 Schedule Info Boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-slate-50/90 border border-slate-100 rounded-2xl p-3.5 sm:p-4">
                <div className="text-xs font-extrabold text-slate-800">
                  Masa Pendaftaran Gel. 1
                </div>
                <div className="text-[11px] sm:text-xs text-slate-500 mt-1 font-medium">
                  1 Oktober s/d 30 Desember 2026
                </div>
              </div>

              <div className="bg-slate-50/90 border border-slate-100 rounded-2xl p-3.5 sm:p-4">
                <div className="text-xs font-extrabold text-slate-800">
                  Gelombang 2 &amp; Observasi
                </div>
                <div className="text-[11px] sm:text-xs text-slate-500 mt-1 font-medium">
                  1 Jan – 3 Apr 2027 (Tes &amp; Observasi)
                </div>
              </div>

              <div className="bg-slate-50/90 border border-slate-100 rounded-2xl p-3.5 sm:p-4">
                <div className="text-xs font-extrabold text-slate-800">
                  Gelombang 3
                </div>
                <div className="text-[11px] sm:text-xs text-slate-500 mt-1 font-medium">
                  6 April – 26 Juni 2027
                </div>
              </div>

              <div className="bg-slate-50/90 border border-slate-100 rounded-2xl p-3.5 sm:p-4">
                <div className="text-xs font-extrabold text-slate-800">
                  Daftar Ulang &amp; Kuota
                </div>
                <div className="text-[11px] sm:text-xs text-slate-500 mt-1 font-medium">
                  Kuota Terbatas Hanya 2 Rombel
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section
      className={`relative text-white overflow-hidden select-none w-full flex flex-col min-h-screen min-h-[100svh] ${theme.bgClass}`}
    >
      {/* Bespoke organic floating glass bubbles & orbs */}
      <HeroFloatingBubbles slug={slug} />

      {/* Headline block — vertically centered in the space between navbar and CTA */}
      <div className="relative z-10 flex-1 flex flex-col justify-center max-w-7xl mx-auto w-full px-5 sm:px-6 lg:px-8 pt-20 sm:pt-28 lg:pt-32 pb-6 sm:pb-8">
        <div className="max-w-3xl">
          {slide.badge && (
            <motion.div
              initial={false}
              animate={{ y: [0, -3, 0] }}
              transition={{
                y: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
              }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[11px] sm:text-xs font-black tracking-wider text-[#ffd51e] uppercase mb-4 sm:mb-5 backdrop-blur-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ffd51e] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ffd51e]" />
              </span>
              <span>{slide.badge}</span>
            </motion.div>
          )}

          <motion.h1
            initial={false}
            animate={{ y: [0, -3.5, 0] }}
            transition={{
              y: { duration: 4.4, repeat: Infinity, ease: 'easeInOut' },
            }}
            className="w-full opacity-100"
          >
            {renderHeroHeadline(slug, slide.titlePart1, slide.titleHighlight, slide.titlePart2, theme.highlightText)}
          </motion.h1>

          {slide.description && (
            <motion.p
              initial={false}
              animate={{ y: [0, -2, 0] }}
              transition={{
                y: { duration: 4.4, repeat: Infinity, ease: 'easeInOut', delay: 0.2 },
              }}
              className="mt-4 sm:mt-6 max-w-xl text-sm sm:text-base lg:text-lg text-white/90 leading-relaxed opacity-100"
            >
              {slide.description}
            </motion.p>
          )}

          {slide.trustItems && slide.trustItems.length > 0 && !statsCards && (
            <div className="mt-6 pt-4 border-t border-white/15 flex flex-wrap gap-x-6 gap-y-2 text-xs sm:text-sm text-white/85 font-medium">
              {slide.trustItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ffd51e]" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom block — CTA buttons sit directly above the 4 stat cards */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:pb-10 lg:pb-12">
        <div className="grid grid-cols-2 gap-2.5 sm:flex sm:gap-3 mb-3 sm:mb-5">
          <Link
            href={effectiveCtaLink}
            className={`group relative overflow-hidden inline-flex h-12 items-center justify-center gap-2 px-3 sm:px-7 rounded-xl text-[13px] sm:text-sm font-black transition-all duration-300 hover:scale-[1.02] active:scale-95 animate-cta-glow ${theme.primaryBtn}`}
          >
            {/* 60fps Shimmer Beam */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -translate-x-full animate-cta-shimmer bg-gradient-to-r from-transparent via-white/50 to-transparent"
            />
            <span className="relative z-10 truncate">{slug === 'smp' ? 'Daftar SPMB' : slide.primaryCtaText || 'Daftar SPMB'}</span>
            <ArrowRight className="relative z-10 w-4 h-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1 animate-cta-arrow" />
          </Link>

          {slide.secondaryCtaLink && (
            <a
              href={slide.secondaryCtaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex h-12 items-center justify-center gap-2 px-3 sm:px-6 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 hover:border-white/50 text-white text-xs sm:text-sm font-bold uppercase tracking-wider backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] active:scale-95 hover:shadow-[0_0_24px_rgba(255,255,255,0.2)]"
            >
              {/* Online Green Pulsing Indicator */}
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <MessageCircle className="w-4 h-4 text-[#ffd51e] shrink-0 animate-cta-wiggle group-hover:scale-110 transition-transform duration-200" />
              <span className="truncate">Konsultasi WA</span>
            </a>
          )}

          {slug === 'smp' && (
            <Link
              href={`/affiliate/register?unit=${slug}`}
              className="group relative overflow-hidden col-span-2 sm:col-span-1 inline-flex h-12 items-center justify-center gap-2 px-4 sm:px-5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-200 text-slate-950 text-xs sm:text-sm font-black shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-95 animate-cta-glow-amber"
            >
              {/* Delayed Shimmer Beam for natural choreography */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -translate-x-full animate-cta-shimmer-delay bg-gradient-to-r from-transparent via-white/45 to-transparent"
              />
              <span className="relative z-10">Daftar Affiliate Al-Afiyah</span>
              <span className="relative z-10 font-mono transition-transform duration-200 group-hover:translate-x-1 animate-cta-arrow">→</span>
            </Link>
          )}
        </div>

        {statsCards}
      </div>
    </section>
  );
}
