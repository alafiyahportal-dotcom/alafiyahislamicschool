'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyMobileBar from '@/components/layout/StickyMobileBar';
import CampusLocationMapSection from '@/components/landing/CampusLocationMapSection';
import AutoHorizontalSlider from '@/components/landing/AutoHorizontalSlider';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  Calendar,
  Clock,
  MapPin,
  Plus,
  Minus,
  LayoutGrid,
  List,
  Download,
  X,
  User,
  Film,
  ImageIcon,
  Users,
  MessageCircle,
} from 'lucide-react';
import { getStoredReferralCode } from '@/lib/referral';
import {
  DEFAULT_NEWS_CATEGORIES,
  mergeUniqueStrings,
  parseNewsMedia,
  getVideoEmbedUrl,
  getVideoThumbnailUrl,
} from '@/lib/news-media';
import { getDepartmentByRole } from '@/lib/departments';
import type { UnitSlideData } from '@/components/landing/UnitHeroSlider';

export { getDepartmentByRole };

export interface TeacherData {
  id: string;
  name: string;
  role: string;
  specialization?: string | null;
  photoUrl?: string | null;
  bio?: string | null;
  order: number;
}

export interface NewsData {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  coverImage?: string | null;
  author: string;
  publishedAt: string | Date;
}

export interface FacilityItem {
  name: string;
  image: string;
  desc: string;
  category?: string;
}

export interface SchoolData {
  slug: 'tk' | 'sd' | 'smp';
  name: string;
  badgeText: string;
  tagline: string;
  primaryColor: string;
  accentColor: string;
  registrationFee: number;
  waCenterPhone: string;
  address: string;
  heroHeadline?: string;
  heroSubheadline?: string;
  heroImage?: string;
  heroSlides?: UnitSlideData[];
  stats?: Array<{ label: string; value: string }>;
  values?: Array<{ title: string; description: string; icon?: string }>;
  programs?: Array<{ title: string; desc: string; badge: string }>;
  testimonials?: Array<{ name: string; role: string; quote: string }>;
  facilities?: FacilityItem[];
  teachers?: TeacherData[];
  newsPosts?: NewsData[];
  newsCategories?: string[];
  achievements?: any[];
  bankName?: string;
  bankAccountNumber?: string;
  bankAccountHolder?: string;
  waveName?: string;
  spmbData?: any;
}

export function sanitizeAdabText(text?: string | null): string {
  if (!text) return '';
  return text
    .replace(/\bSAW\b/g, 'ﷺ')
    .replace(/rasulullah\s+saw\b/gi, 'Rasulullah ﷺ')
    .replace(/nabi\s+saw\b/gi, 'Nabi ﷺ')
    .replace(/\bSWT\b/g, "Ta'ala")
    .replace(/allah\s+swt\b/gi, "Allah Ta'ala");
}

function InstagramPinIcon() {
  return (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function GlowingInstagramPin({
  className,
  rippleColor = '#ff2b56',
}: {
  className: string;
  rippleColor?: string;
}) {
  return (
    <a
      href="https://instagram.com/alafiyah_majalengka"
      target="_blank"
      rel="noreferrer"
      aria-label="Instagram SDIT Al-Afiyah"
      className={`group absolute w-[50px] h-[50px] rounded-full bg-[#d81b60] hover:bg-[#ad1457] text-white flex items-center justify-center z-20 transition-transform duration-300 hover:scale-105 ${className}`}
      style={{ color: rippleColor }}
    >
      <span
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          animation: 'praditaButtonRipple 3s infinite',
          animationDelay: '0s',
          opacity: 0.6,
          zIndex: -1,
        }}
      />
      <span
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          animation: 'praditaButtonRipple 3s infinite',
          animationDelay: '0.3s',
          opacity: 0.6,
          zIndex: -1,
        }}
      />
      <span
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          animation: 'praditaButtonRipple 3s infinite',
          animationDelay: '0.9s',
          opacity: 0.6,
          zIndex: -1,
        }}
      />
      <span className="text-white flex items-center justify-center">
        <InstagramPinIcon />
      </span>
    </a>
  );
}

function FeatureIllustration({
  type,
}: {
  type: 'school' | 'curriculum' | 'scholarship' | 'teachers';
}) {
  if (type === 'school') {
    return (
      <svg className="w-14 h-14 mx-auto" viewBox="0 0 64 64" fill="none">
        <path d="M8 22L32 12L56 22H8Z" fill="#F5B82E" />
        <rect x="10" y="22" width="44" height="30" rx="2" fill="#004D40" />
        <path d="M22 26L32 18L42 26H22Z" fill="#F5B82E" />
        <rect x="25" y="28" width="3" height="16" fill="#E2E8F0" />
        <rect x="30.5" y="28" width="3" height="16" fill="#E2E8F0" />
        <rect x="36" y="28" width="3" height="16" fill="#E2E8F0" />
        <rect x="21" y="44" width="22" height="4" fill="#F5B82E" />
        <rect x="18" y="48" width="28" height="4" fill="#CBD5E1" />
      </svg>
    );
  }
  if (type === 'curriculum') {
    return (
      <svg className="w-14 h-14 mx-auto" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="20" r="9" fill="#38BDF8" />
        <path
          d="M26 16C28 14 33 15 35 18C37 21 34 25 30 25C27 25 25 20 26 16Z"
          fill="#004D40"
        />
        <path
          d="M23 20A9 9 0 0 0 41 20"
          stroke="#004D40"
          strokeWidth="2.5"
          fill="none"
        />
        <rect x="30.5" y="29" width="3" height="5" fill="#004D40" />
        <rect x="25" y="33" width="14" height="2.5" rx="1" fill="#004D40" />
        <rect x="16" y="36" width="32" height="7" rx="2" fill="#F5B82E" />
        <rect x="18" y="38" width="26" height="3" fill="#FFFFFF" />
        <rect x="14" y="45" width="36" height="7" rx="2" fill="#004D40" />
        <rect x="16" y="47" width="30" height="3" fill="#FFFFFF" />
      </svg>
    );
  }
  if (type === 'scholarship') {
    return (
      <svg className="w-14 h-14 mx-auto" viewBox="0 0 64 64" fill="none">
        <circle
          cx="32"
          cy="20"
          r="10"
          fill="#F5B82E"
          stroke="#D97706"
          strokeWidth="2"
        />
        <text
          x="32"
          y="24"
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize="12"
          fontWeight="bold"
        >
          ★
        </text>
        <path d="M10 34L32 24L54 34L32 44L10 34Z" fill="#003831" />
        <path
          d="M19 39V49C19 52 25 55 32 55C39 55 45 52 45 49V39L32 45L19 39Z"
          fill="#004D40"
        />
        <rect x="19" y="48" width="26" height="3.5" fill="#F5B82E" />
        <path
          d="M50 35V47"
          stroke="#F5B82E"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  return (
    <svg className="w-14 h-14 mx-auto" viewBox="0 0 64 64" fill="none">
      <circle cx="19" cy="24" r="5.5" fill="#FDBA74" />
      <path d="M14 22C14 18 24 18 24 22" fill="#003831" />
      <path
        d="M10 48C10 40 14 36 19 36C24 36 28 40 28 48H10Z"
        fill="#004D40"
      />
      <circle cx="45" cy="24" r="5.5" fill="#FDBA74" />
      <path d="M39 24C39 18 51 18 51 25" fill="#003831" />
      <path
        d="M36 48C36 40 40 36 45 36C50 36 54 40 54 48H36Z"
        fill="#004D40"
      />
      <circle cx="32" cy="20" r="6.5" fill="#FDBA74" />
      <path d="M26 18C26 13 38 13 38 18" fill="#002823" />
      <path
        d="M20 50C20 40 25 34 32 34C39 34 44 40 44 50H20Z"
        fill="#F5B82E"
      />
      <path
        d="M28 34L32 43L36 34"
        stroke="#003831"
        strokeWidth="2.5"
        fill="none"
      />
    </svg>
  );
}

const DEFAULT_HERO_IMAGES = [
  {
    id: 'sd-bg-1',
    src: '/images/sd-field-study-banner.jpg',
    alt: 'Murid SDIT Al-Afiyah Majalengka',
    objectPosition: 'object-center',
  },
  {
    id: 'sd-bg-2',
    src: '/images/sd-seedling-care.jpg',
    alt: 'Observasi Greenhouse & Agro-Sains SDIT Al-Afiyah',
    objectPosition: 'object-center',
  },
  {
    id: 'sd-bg-3',
    src: '/images/sd-activity-classroom-6b.jpg',
    alt: 'Suasana Belajar Kelas SDIT Al-Afiyah',
    objectPosition: 'object-center',
  },
  {
    id: 'sd-bg-4',
    src: '/images/sd-activity-shalat-berjamaah.jpg',
    alt: 'Pembiasaan Shalat Berjamaah SDIT Al-Afiyah',
    objectPosition: 'object-center',
  },
];

const DEFAULT_FEATURE_BOXES = [
  {
    title: 'RAMAH ANAK, FITRAH &\nTANPA TES CALISTUNG',
    href: '/sd/spmb',
    iconType: 'school' as const,
  },
  {
    title: 'METODE PENDIDIKAN\nKARAKTER NABAWIYAH',
    href: '/sd/karakter',
    iconType: 'curriculum' as const,
  },
  {
    title: 'TAHFIDZ JUZ 30 MUTQIN\n& IMAN SEBELUM QUR’AN',
    href: '/sd/program',
    iconType: 'scholarship' as const,
  },
  {
    title: 'OUTDOOR LEARNING &\nPELATIHAN AQIL-BALIGH',
    href: '/sd/dokumentasi',
    iconType: 'teachers' as const,
  },
];

const SPMB_POSTERS = [
  {
    src: '/images/sd-spmb-brosur.jpg',
    label: 'Brosur Biaya & Syarat',
    file: 'Brosur-SPMB-SDIT-Al-Afiyah-2027-2028.jpg',
  },
  {
    src: '/images/sd-spmb-story.jpg',
    label: 'Story Telah Dibuka',
    file: 'Story-SPMB-SDIT-Al-Afiyah-2027-2028.jpg',
  },
  {
    src: '/images/sd-spmb-poster-2027.jpg',
    label: 'Poster Kuota Terbatas',
    file: 'Poster-Kuota-SPMB-SDIT-Al-Afiyah-2027-2028.jpg',
  },
];

const FAQ_ITEMS = [
  {
    question: 'KAPAN SPMB ONLINE SDIT AL-AFIYAH T.A. 2027/2028 DILAKSANAKAN?',
    answer:
      'Pendaftaran Murid Baru (SPMB) dibuka dalam 3 gelombang: Gelombang 1 (1 Oktober – 30 Desember 2026), Gelombang 2 & Observasi (1 Januari – 3 April 2027), dan Gelombang 3 (6 April – 26 Juni 2027) selama kuota 2 rombel masih tersedia.',
  },
  {
    question: 'APA SAJA TAHAPAN SELEKSI SPMB DI SDIT AL-AFIYAH?',
    answer:
      'Tahapan meliputi: (1) Pengisian Formulir Online di website, (2) Pembayaran biaya formulir Rp 250.000 & unggah berkas (Akta Kelahiran, KK, KTP Orang Tua), (3) Observasi Fitrah Anak (Tanpa tes tulis calistung) & Ta’aruf Orang Tua, serta (4) Pengumuman & Daftar Ulang.',
  },
  {
    question: 'BERAPA KUOTA PENERIMAAN MURID BARU SDIT AL-AFIYAH?',
    answer:
      'Demi menjaga kualitas pendampingan adab dan pembelajaran yang optimal, kuota penerimaan murid baru dibatasi hanya 2 Rombongan Belajar (Rombel).',
  },
  {
    question: 'APA KEUNGGULAN KURIKULUM & METODE BELAJAR DI SDIT AL-AFIYAH?',
    answer:
      'SDIT Al-Afiyah menerapkan Metode Pendidikan Karakter Nabawiyah (Smart Akhlak Fitrah), menanamkan iman sebelum Al-Qur’an dan adab sebelum ilmu, Tahfidz Juz 30 Mutqin, Basic Literasi & Numerasi, Outdoor Learning (Agro-Sains Greenhouse), serta Pelatihan Kemandirian Aqil-Baligh.',
  },
  {
    question: 'DI MANA LOKASI KAMPUS SDIT AL-AFIYAH MAJALENGKA?',
    answer:
      'Berlokasi di Lingkungan Giri Asih — Jl. Gerakan Koperasi, Kel. Majalengka Wetan, Kec. Majalengka, Kab. Majalengka, Jawa Barat 45411 (Hotline WhatsApp Panitia: 0813-1013-9001).',
  },
];

const UPCOMING_EVENTS = [
  {
    day: '30',
    month: 'Des',
    year: '2026',
    title: 'Penutupan Pendaftaran SPMB Gelombang 1 SDIT Al-Afiyah',
    dateTime: '1 Okt - 30 Des 2026 @ 08:00 - 14:30 WIB',
    location: 'SDIT Al-Afiyah Majalengka',
    tag: 'SPMB',
    image: '/images/sd-spmb-poster-2027.jpg',
    href: '/sd/spmb/daftar',
  },
  {
    day: '16',
    month: 'Jan',
    year: '2027',
    title: 'Observasi Fitrah Calon Murid & Ta’aruf Wali Murid',
    dateTime: 'Januari - April 2027 @ 08:00 - 12:00 WIB',
    location: 'Kampus Giri Asih SDIT Al-Afiyah',
    tag: 'Observasi',
    image: '/images/sd-activity-classroom-6b.jpg',
    href: '/sd/spmb',
  },
  {
    day: '20',
    month: 'Feb',
    year: '2027',
    title: 'Field Study & Praktik Agro-Sains Smart Akhlak Fitrah',
    dateTime: 'Semester Genap @ 07:30 - 14:00 WIB',
    location: 'Greenhouse & Kebun Edukasi',
    tag: 'Kegiatan',
    image: '/images/sd-field-study-banner.jpg',
    href: '/sd/berita',
  },
];

const REAL_SD_TESTIMONIALS = [
  {
    name: 'Ibu Nani Mulyani, S.Pd.',
    role: 'Wali Murid Kelas 5 SDIT Al-Afiyah',
    quote:
      'Sebagai orang tua, kami sangat bersyukur menyekolahkan anak di SDIT Al-Afiyah karena metode berbasis fitrah dan karakter Nabawiyyah berhasil menumbuhkan kesadaran beribadah, adab, serta empati anak secara alami tanpa paksaan. Pembelajarannya yang menyenangkan dan selaras dengan tumbuh kembang anak didukung sinergi yang kuat antara sekolah dan orang tua benar-benar membentuk karakter anak yang berakhlak mulia dan mencintai ajaran Islam.',
    avatar: '/images/sd-activity-shalat-berjamaah.jpg',
  },
  {
    name: 'Guru SDIT Al-Afiyah',
    role: 'Coretan Guru & Pendidik SDIT Al-Afiyah',
    quote:
      'Di SDIT Al-Afiyah, kami tidak sekadar mendidik anak agar pintar, tetapi membersamai mereka agar tumbuh menjadi pribadi yang beriman, berakhlak, dan bermanfaat.',
    avatar: '/images/sd-seedling-care.jpg',
  },
];

const TESTIMONIAL_MAP_SLOTS = [
  {
    desktopPos: 'lg:absolute lg:top-[115px] lg:left-[26%] lg:w-[38%]',
    defaultAvatar: '/images/sd-activity-shalat-berjamaah.jpg',
  },
  {
    desktopPos: 'lg:absolute lg:top-[150px] lg:left-[69%] lg:w-[29%]',
    defaultAvatar: '/images/sd-seedling-care.jpg',
  },
  {
    desktopPos: 'lg:absolute lg:top-[335px] lg:left-[3%] lg:w-[31%]',
    defaultAvatar: '/images/sd-field-study-banner.jpg',
  },
  {
    desktopPos: 'lg:absolute lg:top-[355px] lg:left-[47%] lg:w-[34%]',
    defaultAvatar: '/images/sd-activity-classroom-6b.jpg',
  },
];

export default function SdLandingView({ school }: { school: SchoolData }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeNewsTab, setActiveNewsTab] = useState<string>('Semua');
  const [showFaqBox, setShowFaqBox] = useState<boolean>(true);
  const [openFaqIndex, setOpenFaqIndex] = useState<number>(0);
  const [selectedNews, setSelectedNews] = useState<NewsData | null>(null);
  const [selectedNewsSlideIndex, setSelectedNewsSlideIndex] = useState<number>(0);
  const [isPosterModalOpen, setIsPosterModalOpen] = useState(false);
  const [activePoster, setActivePoster] = useState(SPMB_POSTERS[0]);
  const [refCode, setRefCode] = useState<string | null>(null);

  useEffect(() => {
    setRefCode(getStoredReferralCode());
  }, []);

  let ppdbUrl = '/sd/spmb/daftar';
  if (refCode) {
    ppdbUrl += `?ref=${encodeURIComponent(refCode)}`;
  }

  // Dynamic Hero Images synced from CMS Hero Slides (if edited in Admin Panel)
  const heroImages = useMemo(() => {
    if (school.heroSlides && Array.isArray(school.heroSlides) && school.heroSlides.length > 0) {
      const validSlides = school.heroSlides
        .filter((s) => Boolean(s && s.image))
        .map((s, idx) => ({
          id: `cms-sd-bg-${s.id ?? idx + 1}`,
          src: s.image,
          alt: `${school.name} - Slide ${idx + 1}`,
          objectPosition: 'object-center',
        }));
      if (validSlides.length > 0) return validSlides;
    }
    return DEFAULT_HERO_IMAGES;
  }, [school.heroSlides, school.name]);

  // Dynamic Hero Copywriting synced from CMS Hero & Identity
  const heroTitle = useMemo(() => {
    return (school.name || 'SDIT AL-AFIYAH MAJALENGKA').toUpperCase();
  }, [school.name]);

  const heroDescription = useMemo(() => {
    const firstSlide = school.heroSlides?.[0];
    if (firstSlide?.description && firstSlide.description.trim().length > 0) {
      return sanitizeAdabText(firstSlide.description);
    }
    if (school.heroSubheadline && school.heroSubheadline.trim().length > 0) {
      return sanitizeAdabText(school.heroSubheadline);
    }
    return 'Bukan Sekadar Tempat Belajar, Namun Juga Tempat Bertumbuh — Mewujudkan generasi santri beradab mulia, mandiri, cinta Al-Qur’an, dan unggul dengan Metode Pendidikan Karakter Nabawiyah.';
  }, [school.heroSlides, school.heroSubheadline]);

  // Dynamic Testimonials synced 100% from real CMS data (Ibu Nani Mulyani, S.Pd. & Guru SDIT Al-Afiyah)
  const realMapTestimonials = useMemo(() => {
    const rawList =
      school.testimonials && Array.isArray(school.testimonials) && school.testimonials.length > 0
        ? school.testimonials.filter((t) => Boolean(t && t.name && t.quote))
        : REAL_SD_TESTIMONIALS;

    return rawList.slice(0, 4).map((t, idx) => {
      const slot = TESTIMONIAL_MAP_SLOTS[idx % TESTIMONIAL_MAP_SLOTS.length];
      const cleanQuote = t.quote.trim().replace(/^[“"']+|[”"']+$/g, '');
      // Single or 2-item layout centered nicely on desktop map
      let desktopPos = slot.desktopPos;
      if (rawList.length === 1) {
        desktopPos = 'lg:absolute lg:top-[155px] lg:left-[24%] lg:w-[52%]';
      } else if (rawList.length === 2) {
        desktopPos =
          idx === 0
            ? 'lg:absolute lg:top-[120px] lg:left-[15%] lg:w-[44%]'
            : 'lg:absolute lg:top-[285px] lg:left-[50%] lg:w-[42%]';
      }
      return {
        name: t.name,
        role: t.role || 'Wali Murid SDIT Al-Afiyah',
        quote: `"${sanitizeAdabText(cleanQuote)}"`,
        avatar: (t as any).avatar || slot.defaultAvatar,
        desktopPos,
      };
    });
  }, [school.testimonials]);

  const nextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % heroImages.length);
  }, [heroImages.length]);

  const prevSlide = useCallback(() => {
    setActiveSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  }, [heroImages.length]);

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsPosterModalOpen(false);
        setSelectedNews(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const newsPosts = school.newsPosts || [];

  const availableNewsTabs = useMemo(() => {
    const base =
      school.newsCategories && school.newsCategories.length > 0
        ? ['Semua', ...school.newsCategories]
        : ['Semua', 'Kegiatan', 'Field Study', 'Prestasi', 'Tahfidz', 'Pengumuman'];
    const fromPosts = newsPosts.map((p) => (p.category || '').trim()).filter(Boolean);
    return mergeUniqueStrings(base, fromPosts).slice(0, 7);
  }, [newsPosts, school.newsCategories]);

  const filteredArticles = useMemo(() => {
    if (activeNewsTab === 'Semua') return newsPosts;
    return newsPosts.filter(
      (a) => (a.category || '').toLowerCase() === activeNewsTab.toLowerCase()
    );
  }, [newsPosts, activeNewsTab]);

  const displayedArticles = (
    filteredArticles.length > 0 ? filteredArticles : newsPosts
  ).slice(0, 3);

  const mediaPosts = newsPosts.slice(0, 4);

  return (
    <div className="theme-sd flex flex-col min-h-screen bg-white text-slate-800 w-full overflow-x-clip">
      {/* Top Navbar */}
      <Navbar
        schoolName={school.name}
        badgeText={school.badgeText}
        schoolSlug="sd"
        ppdbUrl={ppdbUrl}
        waPhone={school.waCenterPhone}
        transparentAtTop={true}
      />

      {/* =====================================================================
          1. FULL-WIDTH HERO BANNER (MINIMALIST AL-HIDAYAH / PRADITA STYLE)
      ===================================================================== */}
      <section className="relative w-full h-[calc(100svh-3rem)] sm:h-[600px] lg:h-[650px] bg-[#002e29] overflow-hidden select-none">
        {heroImages.map((img, idx) => {
          const isActive = idx === activeSlide;
          return (
            <div
              key={img.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-0' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <div
                className={`absolute inset-0 transition-transform duration-[7000ms] ease-out ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.src}
                  alt={img.alt}
                  className={`w-full h-full object-cover ${img.objectPosition}`}
                />
              </div>
            </div>
          );
        })}

        <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#00241f]/90 via-[#003831]/80 to-[#00241f]/75 pointer-events-none" />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#001f1b]/95 via-transparent to-black/30 pointer-events-none" />

        <div className="relative z-20 h-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 flex flex-col justify-center items-center text-center sm:pb-14 pt-12">
          <div className="max-w-3xl space-y-4 sm:space-y-5 flex flex-col items-center">
            <h1 className="text-3xl sm:text-5xl lg:text-[3.5rem] font-black text-white uppercase tracking-tight leading-[1.1] drop-shadow-sm">
              {heroTitle}
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-slate-100/95 leading-relaxed max-w-2xl font-normal">
              {heroDescription}
            </p>

            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <Link
                href={ppdbUrl}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-sm bg-[#006B5F] hover:bg-[#F9C100] text-white hover:text-slate-950 border border-emerald-400/30 font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-lg"
              >
                <span>DAFTAR SPMB ONLINE</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                type="button"
                onClick={() => setIsPosterModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-sm bg-white/15 hover:bg-white/25 text-white border border-white/30 font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 backdrop-blur-xs cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#F9C100]" />
                <span>BROSUR &amp; BIAYA</span>
              </button>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={prevSlide}
          aria-label="Gambar Sebelumnya"
          className="hidden sm:flex absolute left-2 sm:left-5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/35 hover:bg-[#006B5F] text-white border border-white/20 items-center justify-center transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <button
          type="button"
          onClick={nextSlide}
          aria-label="Gambar Selanjutnya"
          className="hidden sm:flex absolute right-2 sm:right-5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/35 hover:bg-[#006B5F] text-white border border-white/20 items-center justify-center transition-colors cursor-pointer"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <div className="hidden sm:flex absolute bottom-6 sm:bottom-24 left-1/2 -translate-x-1/2 z-30 items-center gap-2.5">
          {heroImages.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveSlide(idx)}
              aria-label={`Pilih gambar ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                idx === activeSlide
                  ? 'w-8 bg-[#F9C100]'
                  : 'w-2 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </section>

      {/* =====================================================================
          2. 4-COLUMN HIGHLIGHT FEATURE STRIP (2x2 ON MOBILE, 4-COL DESKTOP)
      ===================================================================== */}
      <section className="relative z-30 mt-0 sm:-mt-20 max-w-6xl mx-auto px-0 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-2 lg:grid-cols-4 bg-[#FAF6EC] shadow-xl border-y sm:border border-[#E5D5B2]">
          {DEFAULT_FEATURE_BOXES.map((box, idx) => (
            <Link
              key={idx}
              href={box.href}
              className={`group px-3.5 py-6 sm:px-6 sm:py-10 flex flex-col items-center justify-center text-center gap-3 sm:gap-4 hover:bg-[#F4ECD8] transition-colors duration-200 border-[#E5D5B2] ${
                idx % 2 === 0 ? 'border-r' : 'lg:border-r'
              } ${idx < 2 ? 'border-b lg:border-b-0' : ''} ${
                idx === 3 ? 'lg:border-r-0' : ''
              }`}
            >
              <div className="group-hover:-translate-y-1 transition-transform duration-200 scale-90 sm:scale-100">
                <FeatureIllustration type={box.iconType} />
              </div>
              <h2 className="text-[11px] sm:text-[13px] font-extrabold uppercase tracking-[0.06em] sm:tracking-[0.08em] text-[#003831] group-hover:text-[#00594f] leading-snug sm:leading-relaxed whitespace-pre-line">
                {box.title}
              </h2>
            </Link>
          ))}
        </div>
      </section>

      {/* =====================================================================
          3A. FULL-WIDTH PARALLAX PRAKATA KEPALA SEKOLAH SECTION
      ===================================================================== */}
      <section
        className="relative w-full mt-0 sm:-mt-12 pt-16 pb-16 sm:pt-36 sm:pb-28 bg-fixed bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage: "url('/images/sd-hero-greenhouse.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-[#003831]/85" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8">
            <div className="lg:col-span-7 space-y-5 text-white">
              <p className="text-sm sm:text-base lg:text-[17px] leading-relaxed font-normal text-white/95 max-w-xl">
                SDIT Al-Afiyah meyakini setiap anak lahir dalam keadaan fitrah dengan potensi iman, semangat belajar, dan bakat yang unik. Metode Pendidikan Karakter Nabawiyah membimbing anak didik agar tumbuh cerdas, mandiri, mencintai ibadah, dan berakhlak mulia.
              </p>

              <div>
                <Link
                  href="/sd/profil"
                  className="inline-block px-4 py-1.5 rounded-full bg-[#e5a93b] hover:bg-[#d4962a] text-white font-bold text-xs transition-colors shadow-xs"
                >
                  Baca Lebih Lanjut
                </Link>
              </div>

              <div className="pt-1 space-y-2">
                <p className="text-xs sm:text-sm font-bold text-white">
                  Ust. Febrian Fauzi, S.Pd., M.Pd. — Kepala Sekolah SDIT Al-Afiyah Majalengka
                </p>
                <div className="w-8 h-[2.5px] bg-[#e5a93b]" />
              </div>
            </div>

            <div className="hidden lg:block lg:col-span-5" />
          </div>
        </div>
      </section>

      {/* =====================================================================
          3B. FULL-WIDTH PARALLAX "SELAMAT DATANG" SECTION (LIGHT PHOTO BG)
      ===================================================================== */}
      <section
        className="relative w-full py-20 sm:py-28 bg-fixed bg-cover bg-center overflow-hidden border-b border-slate-200/70"
        style={{
          backgroundImage: "url('/images/sd-activity-classroom-6b.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-white/88 backdrop-blur-[1px]" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8">
          <div className="max-w-lg space-y-5">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#003831] leading-[1.2] tracking-tight">
              Selamat Datang
              <br />
              di Sekolah Karakter &amp; Tahfidz
              <br />
              SDIT Al-Afiyah
            </h2>

            <p className="text-base sm:text-lg text-[#003831]/90 leading-relaxed font-normal">
              Kapan lagi menyekolahkan ananda di SD Islam Terpadu yang asri dan ramah anak dengan hafalan Juz 30 terjaga, Metode Karakter Nabawiyah, serta kuota terbatas hanya 2 rombel?
            </p>

            <div className="pt-1 flex flex-wrap items-center gap-3">
              <Link
                href="/sd/profil"
                className="inline-block px-6 py-3 rounded-sm bg-[#e5a93b] hover:bg-[#00594f] text-white font-extrabold text-xs uppercase tracking-wider transition-colors shadow-xs"
              >
                TEMUKAN JAWABANNYA
              </Link>
              <button
                type="button"
                onClick={() => setIsPosterModalOpen(true)}
                className="inline-block px-5 py-3 rounded-sm bg-[#003831] hover:bg-[#00594f] text-white font-extrabold text-xs uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
              >
                UNDUH BROSUR SPMB
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          4. ARTIKEL DAN BERITA TERBARU (MINIMALIST AL-HIDAYAH TAB LAYOUT)
      ===================================================================== */}
      <section id="news" className="py-16 sm:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#003831] tracking-tight">
            Artikel dan Berita Terbaru
          </h2>

          {/* Minimalist Bottom-Border Tabs */}
          <div className="border-b border-slate-200 flex items-center gap-1 sm:gap-4 overflow-x-auto">
            {availableNewsTabs.map((tab) => {
              const active = activeNewsTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveNewsTab(tab)}
                  className={`px-4 sm:px-5 py-3 text-xs sm:text-sm font-bold border-b-2 -mb-px whitespace-nowrap transition-colors cursor-pointer ${
                    active
                      ? 'border-[#00594f] text-[#00594f]'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* 3-Column Clean Article Teasers (Thumbnail + Title + Date only, like Al-Hidayah) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7 pt-2">
            {displayedArticles.map((article) => {
              const parsed = parseNewsMedia(article.content, article.coverImage);
              const totalSlides = parsed.allMedia.length;

              return (
                <article
                  key={article.id}
                  onClick={() => {
                    setSelectedNews(article);
                    setSelectedNewsSlideIndex(0);
                  }}
                  className="group flex flex-col space-y-3 cursor-pointer"
                >
                  <div className="relative aspect-[3/2] w-full rounded-sm overflow-hidden bg-slate-100 block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={article.coverImage || '/images/sd-activity-classroom-6b.jpg'}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    {totalSlides > 1 && (
                      <span className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-xs bg-black/70 text-white text-[10px] font-bold backdrop-blur-xs">
                        {totalSlides} Slide
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-[#003831] group-hover:text-[#00594f] transition-colors leading-snug line-clamp-2">
                    {sanitizeAdabText(article.title)}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <time>
                      {new Date(article.publishedAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </time>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="text-center pt-4">
            <Link
              href="/sd/berita"
              className="inline-block px-6 py-2.5 rounded-sm bg-[#00594f] hover:bg-[#00423b] text-white font-bold text-xs uppercase tracking-wider transition-colors"
            >
              Lihat Semua Berita
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================================
          5. PENCAPAIAN & FASILITAS MOSAIC GRID (CLEAN PHOTO TILES)
      ===================================================================== */}
      <section id="facilities" className="py-10 sm:py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          {/* Top Row (25% | 25% | 50%) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <Link
              href="/sd/profil"
              className="md:col-span-3 group relative min-h-[220px] rounded-sm overflow-hidden flex items-center justify-center p-6 text-center"
            >
              <Image
                src="/images/sd-activity-classroom-6b.jpg"
                alt="Terakreditasi Resmi BAN-S/M"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 280px"
              />
              <div className="absolute inset-0 bg-[#003831]/80 group-hover:bg-[#00594f]/80 transition-colors" />
              <h3 className="relative z-10 text-lg font-extrabold uppercase tracking-wide text-white leading-snug">
                TERAKREDITASI RESMI
                <br />
                BAN-S/M
              </h3>
            </Link>

            <Link
              href="/sd/karakter"
              className="md:col-span-3 group relative min-h-[220px] rounded-sm overflow-hidden flex items-center justify-center p-6 text-center bg-[#004d40]"
            >
              <h3 className="relative z-10 text-lg font-extrabold text-[#F9C100] leading-snug">
                Bukan Sekadar Tempat Belajar, Namun Tempat Bertumbuh
              </h3>
            </Link>

            <Link
              href="/sd/program"
              className="md:col-span-6 group relative min-h-[220px] rounded-sm overflow-hidden flex flex-col items-center justify-center p-6 text-center bg-[#FAF6EC] border border-[#E5D5B2]"
            >
              <div className="flex items-center gap-4 mb-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/ypib-logo.png"
                  alt="Logo YPIB"
                  className="w-12 h-12 object-contain"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/sd-logo.png"
                  alt="Logo SDIT Al-Afiyah"
                  className="w-12 h-12 object-contain"
                />
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-[#003831] uppercase leading-snug">
                Metode Pendidikan Karakter Nabawiyah
                <br />
                &amp; Tahfidz Juz 30 Mutqin
              </h3>
            </Link>
          </div>

          {/* Bottom Row (25% | 50% | 25%) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <Link
              href="/sd/dokumentasi"
              className="md:col-span-3 group relative min-h-[220px] rounded-sm overflow-hidden flex items-center justify-center p-6 text-center"
            >
              <Image
                src="/images/sd-futsal-champion.jpg"
                alt="Kelas Nyaman, Futsal & Olahraga"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 280px"
              />
              <div className="absolute inset-0 bg-black/60 group-hover:bg-[#00594f]/75 transition-colors" />
              <h3 className="relative z-10 text-base sm:text-lg font-extrabold uppercase tracking-wide text-white leading-snug">
                KELAS NYAMAN,
                <br />
                FUTSAL,
                <br />
                LAP. OLAHRAGA
              </h3>
            </Link>

            <Link
              href="/sd/fasilitas"
              className="md:col-span-6 group relative min-h-[220px] rounded-sm overflow-hidden flex items-center justify-center p-6 text-center"
            >
              <Image
                src="/images/sd-field-study-banner.jpg"
                alt="Greenhouse Bambu & Outdoor Learning"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 560px"
              />
              <div className="absolute inset-0 bg-[#003831]/75 group-hover:bg-[#00594f]/80 transition-colors" />
              <h3 className="relative z-10 text-lg sm:text-xl font-extrabold uppercase tracking-wide text-white leading-snug">
                OUTDOOR LEARNING
                <br />
                GREENHOUSE - AGRO SAINS - LITERASI
              </h3>
            </Link>

            <Link
              href="/sd/dokumentasi"
              className="md:col-span-3 group relative min-h-[220px] rounded-sm overflow-hidden flex items-center justify-center p-6 text-center"
            >
              <Image
                src="/images/sd-activity-shalat-berjamaah.jpg"
                alt="Shalat Berjamaah & Da'i Cilik"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 280px"
              />
              <div className="absolute inset-0 bg-black/60 group-hover:bg-[#00594f]/75 transition-colors" />
              <h3 className="relative z-10 text-base sm:text-lg font-extrabold uppercase tracking-wide text-white leading-snug">
                SHALAT BERJAMAAH
                <br />
                &amp; DA&apos;I CILIK
              </h3>
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================================
          6. FULL-WIDTH PARALLAX FAQ SPMB BANNER + COLLAPSIBLE ACCORDION
      ===================================================================== */}
      <section
        id="pengumuman"
        className="relative w-full py-20 sm:py-28 bg-fixed bg-cover bg-center text-white text-center overflow-hidden mt-8"
        style={{
          backgroundImage: "url('/images/sd-field-study-banner.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-[#003831]/85" />
        <div className="relative z-10 max-w-3xl mx-auto px-6 space-y-3">
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            FAQ SPMB
          </h2>
          <p className="text-sm sm:text-base text-slate-200">
            Temukan informasi lengkap pendaftaran murid baru di SDIT Al-Afiyah Majalengka
          </p>
          <div className="pt-2 flex flex-col items-center gap-1">
            <ChevronDown className="w-6 h-6 text-[#F9C100] animate-bounce" />
            <button
              type="button"
              onClick={() => setShowFaqBox((prev) => !prev)}
              className="text-sm sm:text-base font-extrabold uppercase tracking-widest text-white hover:text-[#F9C100] transition-colors cursor-pointer"
            >
              KLIK DI SINI
            </button>
          </div>
        </div>
      </section>

      {showFaqBox && (
        <section className="py-12 sm:py-16 bg-[#f8faf9] border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
            <div className="divide-y divide-slate-200 border border-slate-200 bg-white shadow-xs">
              {FAQ_ITEMS.map((item, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div key={idx}>
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                      className="w-full px-5 py-4 text-left flex items-center gap-3.5 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      {isOpen ? (
                        <Minus className="w-4 h-4 text-[#00594f] shrink-0" />
                      ) : (
                        <Plus className="w-4 h-4 text-[#00594f] shrink-0" />
                      )}
                      <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-[#003831]">
                        {item.question}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-12 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href={ppdbUrl}
                className="px-6 py-3 rounded-sm bg-[#00594f] hover:bg-[#00423b] text-white font-extrabold text-xs uppercase tracking-wider transition-colors"
              >
                Daftar SPMB Online
              </Link>
              <button
                type="button"
                onClick={() => setIsPosterModalOpen(true)}
                className="px-6 py-3 rounded-sm bg-[#e5a93b] hover:bg-[#d4962a] text-white font-extrabold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Lihat Brosur &amp; Biaya
              </button>
              <Link
                href="/sd/spmb/cek-status"
                className="px-6 py-3 rounded-sm bg-white hover:bg-slate-100 text-[#003831] border border-slate-300 font-extrabold text-xs uppercase tracking-wider transition-colors"
              >
                Cek Status Seleksi
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          7A. #SDITALAFIYAHMEDIA (LEFT) & ACARA-ACARA (RIGHT) — AL-HIDAYAH SPLIT
      ===================================================================== */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-start">
            {/* Left Column: #SDITALAFIYAHMEDIA Compact Horizontal List */}
            <div className="lg:col-span-6 space-y-5">
              <p className="text-center text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-900">
                #SDITALAFIYAHMEDIA
              </p>

              <div className="space-y-4">
                {mediaPosts.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => {
                      setSelectedNews(post);
                      setSelectedNewsSlideIndex(0);
                    }}
                    className="group flex items-center gap-4 hover:bg-slate-50/80 p-1.5 rounded-xs transition-colors cursor-pointer"
                  >
                    <div className="relative w-28 h-20 sm:w-32 sm:h-20 shrink-0 overflow-hidden bg-slate-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.coverImage || '/images/sd-activity-classroom-6b.jpg'}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <div className="space-y-1.5 min-w-0">
                      <h3 className="text-xs sm:text-[13.5px] font-bold text-slate-700 group-hover:text-[#00594f] leading-snug line-clamp-2 transition-colors">
                        {sanitizeAdabText(post.title)}
                      </h3>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                          {new Date(post.publishedAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 text-center">
                <Link
                  href="/sd/berita"
                  className="inline-block px-5 py-2 border border-slate-400 hover:border-slate-700 text-slate-700 hover:text-slate-950 text-xs font-medium rounded-xs transition-colors"
                >
                  Muat Lebih Banyak
                </Link>
              </div>
            </div>

            {/* Right Column: #AGENDASEKOLAH 3-Card Vertical Grid + Pagination */}
            <div className="lg:col-span-6 space-y-5">
              <p className="text-center text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-900">
                #AGENDASEKOLAH
              </p>

              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#003831] tracking-tight">
                  Acara-acara
                </h2>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <span className="p-1.5 rounded-xs bg-slate-100 text-[#003831]">
                    <LayoutGrid className="w-4 h-4" />
                  </span>
                  <span className="p-1.5 rounded-xs hover:bg-slate-100">
                    <List className="w-4 h-4" />
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {UPCOMING_EVENTS.map((ev, idx) => (
                  <Link
                    key={idx}
                    href={ev.href}
                    className="group bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
                  >
                    <div>
                      <div className="relative h-28 w-full bg-slate-100">
                        <Image
                          src={ev.image}
                          alt={ev.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="200px"
                        />
                        <div className="absolute -bottom-5 right-3 w-11 h-11 rounded-full bg-[#0284c7] text-white shadow-md flex flex-col items-center justify-center leading-none z-10">
                          <span className="text-xs font-extrabold">{ev.day}</span>
                          <span className="text-[9px] uppercase font-semibold">
                            {ev.month}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 pt-6 space-y-2.5">
                        <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-[#00594f] line-clamp-2 leading-snug transition-colors">
                          {ev.title}
                        </h3>

                        <div className="space-y-1.5 text-[11px] text-slate-500">
                          <p className="flex items-start gap-1.5 leading-relaxed">
                            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                            <span>{ev.dateTime}</span>
                          </p>
                          <p className="flex items-start gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                            <span>{ev.location}</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="px-4 pb-3.5">
                      <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-medium rounded-xs">
                        {ev.tag}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="flex items-center justify-center gap-1.5 pt-2">
                <span className="w-7 h-7 flex items-center justify-center rounded-xs bg-[#0284c7] text-white text-xs font-bold">
                  1
                </span>
                <Link
                  href="/sd/agenda"
                  className="w-7 h-7 flex items-center justify-center rounded-xs border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs"
                >
                  2
                </Link>
                <Link
                  href="/sd/agenda"
                  className="w-7 h-7 flex items-center justify-center rounded-xs border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs"
                >
                  →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          7B. STRUKTUR KEPENGURUSAN & TENAGA PENDIDIK (AUTO-SLIDING ROW)
      ===================================================================== */}
      {school.teachers && school.teachers.length > 0 && (
        <section id="dewan-guru" className="py-14 sm:py-16 bg-[#f8faf9] border-b border-slate-200/70 scroll-mt-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-[#00594f] mb-1">
                  #STRUKTURPENDIDIK
                </p>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#003831] tracking-tight">
                  Struktur Kepengurusan &amp; Tenaga Pendidik SDIT Al-Afiyah
                </h2>
              </div>
              <Link
                href="/sd/guru"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-[#00594f] hover:bg-[#003831] text-white text-xs font-bold uppercase tracking-wider transition-colors self-start md:self-auto"
              >
                <Users className="w-4 h-4" />
                <span>Lihat Struktur Lengkap</span>
              </Link>
            </div>

            <AutoHorizontalSlider itemClassName="w-[290px] sm:w-[340px] lg:w-[360px]">
              {school.teachers.map((teacher) => {
                const department = getDepartmentByRole(teacher.role, teacher.specialization || '');
                return (
                  <div
                    key={teacher.id}
                    className="bg-white rounded-sm p-5 border border-slate-200/90 shadow-xs hover:border-[#00594f] transition-all flex flex-col justify-between group h-full"
                  >
                    <div className="space-y-3.5">
                      <div className="bg-[#003831] text-white rounded-sm p-3.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#F9C100] block">
                          {department}
                        </span>
                        <span className="text-xs sm:text-sm font-extrabold text-white mt-0.5 block leading-snug">
                          {teacher.role}
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <h3 className="text-base font-bold text-[#003831] leading-snug">
                          {teacher.name}
                        </h3>
                        {teacher.specialization && (
                          <p className="text-xs text-slate-600 font-medium leading-relaxed">
                            {teacher.specialization}
                          </p>
                        )}
                        {teacher.bio && (
                          <p className="text-[11px] text-slate-500 italic leading-relaxed pt-1 line-clamp-3">
                            &ldquo;{teacher.bio}&rdquo;
                          </p>
                        )}
                      </div>
                    </div>

                    <Link
                      href="/sd/guru"
                      className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#00594f] hover:text-[#003831]"
                    >
                      <span>Detail Struktur</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                );
              })}
            </AutoHorizontalSlider>
          </div>
        </section>
      )}

      {/* =====================================================================
          7C. TESTIMONI WALI MURID (HEXAGONAL WORLD MAP + GLOWING IG PINS)
      ===================================================================== */}
      <section
        id="testimonials"
        className="relative pt-12 pb-24 sm:pb-32 bg-white bg-center bg-no-repeat bg-cover overflow-visible"
        style={{
          backgroundImage: "url('/images/world-map-clean.png')",
        }}
      >
        <style>{`
          @keyframes praditaButtonRipple {
            0% {
              box-shadow: 0 0 0 0 currentColor;
              opacity: 0.6;
            }
            70% {
              box-shadow: 0 0 0 32px currentColor;
              opacity: 0;
            }
            100% {
              box-shadow: 0 0 0 0 currentColor;
              opacity: 0;
            }
          }
        `}</style>

        <div className="relative z-10 max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 lg:min-h-[540px]">
          <h2 className="text-3xl sm:text-[42px] font-extrabold text-[#003831] text-center tracking-tight mb-10 lg:mb-0 lg:pt-4">
            Testimoni Wali Murid
          </h2>

          {/* Decorative Map Rings in open gaps */}
          <div className="hidden lg:block pointer-events-none">
            <span className="absolute top-[135px] left-[19%] w-3.5 h-3.5 rounded-full border-[3px] border-[#f5b82e]/75 bg-white" />
            <span className="absolute top-[185px] left-[22.5%] w-3.5 h-3.5 rounded-full border-[3px] border-[#f5b82e]/75 bg-white" />
            <span className="absolute top-[265px] left-[20%] w-3.5 h-3.5 rounded-full border-[3px] border-[#fb923c]/75 bg-white" />
            <span className="absolute top-[280px] left-[45.5%] w-4 h-4 rounded-full border-[3.5px] border-[#007a78]/80 bg-white" />
            <span className="absolute top-[320px] left-[43%] w-3.5 h-3.5 rounded-full border-[3px] border-[#007a78]/75 bg-white" />
            <span className="absolute top-[220px] left-[63.5%] w-3.5 h-3.5 rounded-full border-[3px] border-[#fb923c]/75 bg-white" />
            <span className="absolute top-[110px] left-[73%] w-3.5 h-3.5 rounded-full border-[3px] border-[#fb923c]/75 bg-white" />
            <span className="absolute top-[480px] left-[35.5%] w-3.5 h-3.5 rounded-full border-[3px] border-[#fb7185]/75 bg-white" />
            <span className="absolute top-[455px] left-[83%] w-3.5 h-3.5 rounded-full border-[3px] border-[#fb923c]/75 bg-white" />
          </div>

          <GlowingInstagramPin
            className="hidden lg:flex top-[200px] left-[14.5%]"
            rippleColor="#ff2b56"
          />
          <GlowingInstagramPin
            className="hidden lg:flex top-[252px] left-[64.5%]"
            rippleColor="#255cff"
          />
          <GlowingInstagramPin
            className="hidden lg:flex top-[388px] left-[38.5%]"
            rippleColor="#ff2b56"
          />
          <GlowingInstagramPin
            className="hidden lg:flex top-[396px] left-[87.5%]"
            rippleColor="#ff2b56"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:block">
            {realMapTestimonials.map((t, idx) => (
              <div
                key={idx}
                className={`${t.desktopPos} bg-white/95 backdrop-blur-[2px] rounded-[15px] p-5 sm:p-6 shadow-[0_30px_60px_-15px_rgba(255,122,92,0.35)] border border-orange-100/60 flex flex-col items-center text-center space-y-4`}
              >
                <p className="text-sm sm:text-[15px] font-semibold text-[#003831] leading-relaxed">
                  {t.quote}
                </p>

                <div className="flex items-center justify-center gap-3.5 text-left pt-1">
                  <div className="relative w-[48px] h-[48px] rounded-full overflow-hidden shrink-0 shadow-xs border border-slate-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="leading-tight">
                    <p className="text-sm text-[#003831] font-bold">
                      {t.name}
                    </p>
                    <p className="text-xs font-extrabold text-[#00594f] mt-0.5">
                      {t.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          8. COMPACT AFFILIATE BANNER & LOKASI KAMPUS
      ===================================================================== */}
      <section className="py-10 bg-[#003831] text-white border-t border-[#004d40]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left max-w-2xl">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#F9C100]">
              Program Affiliate Wali Murid SDIT Al-Afiyah
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              Syiar Kebaikan Sekolah &amp; Raih Apresiasi <span className="text-[#F9C100]">Rp 150.000 / Murid</span>
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/90">
              Daftar gratis, bagikan link rekomendasi unik Anda, dan dapatkan komisi Rp 50.000 (formulir) + Rp 100.000 (daftar ulang).
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <Link
              href="/affiliate/register?unit=sd"
              className="px-6 py-3 rounded-sm bg-[#F9C100] hover:bg-amber-300 text-slate-950 font-extrabold text-xs uppercase tracking-wider transition-colors"
            >
              Daftar Affiliate (Gratis)
            </Link>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(
                `Assalamu'alaikum Ayah & Bunda Wali Murid SDIT Al-Afiyah 🌿\n\nYuk ikut menebar syiar kebaikan pendidikan melalui *Program Affiliate Resmi Wali Murid Al-Afiyah* (SPMB T.A. 2027/2028)!\n\n💰 Total Apresiasi Rp 150.000 / murid langsung cair ke rekening Ayah/Bunda.\n\nDaftar gratis di sini:\n👉 https://sdit.alafiyah.id/affiliate/register?unit=sd`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-sm bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-[#F9C100]" />
              <span>Share ke WA</span>
            </a>
          </div>
        </div>
      </section>

      <CampusLocationMapSection unitSlug="sd" />

      {/* =====================================================================
          MODAL 1: BACA ARTIKEL LENGKAP (MULTI-FOTO & VIDEO CAROUSEL)
      ===================================================================== */}
      {selectedNews && (() => {
        const parsedModal = parseNewsMedia(selectedNews.content, selectedNews.coverImage);
        const slides =
          parsedModal.allMedia.length > 0
            ? parsedModal.allMedia
            : [
                {
                  type: 'image' as const,
                  url: selectedNews.coverImage || '/images/sd-activity-classroom-6b.jpg',
                },
              ];
        const currentSlide = slides[selectedNewsSlideIndex] || slides[0];

        return (
          <div
            onClick={() => setSelectedNews(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-0 bg-slate-950/90 backdrop-blur-md animate-in fade-in cursor-pointer overflow-hidden"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-none w-screen h-[100dvh] max-w-none max-h-none border-0 shadow-2xl overflow-hidden flex flex-col cursor-default"
            >
              <div className="bg-white/95 backdrop-blur-md px-4 sm:px-6 py-3.5 border-b border-slate-100 flex items-center justify-between shrink-0 z-20">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#E8F3F1] text-[#184F48]">
                    {selectedNews.category}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900">
                    {school.name}
                  </span>
                  {slides.length > 1 && (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                      Slide {selectedNewsSlideIndex + 1} dari {slides.length}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedNews(null)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs transition-colors shadow-sm cursor-pointer"
                >
                  <X className="w-4 h-4 text-emerald-300" />
                  <span>Tutup</span>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto md:overflow-hidden flex flex-col md:flex-row min-h-0">
                <div className="md:w-7/12 lg:w-[56%] bg-slate-950 flex flex-col justify-between relative overflow-hidden shrink-0 h-[340px] sm:h-[420px] md:h-full select-none">
                  <div className="relative flex-1 w-full h-full flex items-center justify-center p-1 sm:p-2 overflow-hidden min-h-0">
                    {currentSlide.type === 'video' ? (
                      getVideoEmbedUrl(currentSlide.url) ? (
                        <iframe
                          key={currentSlide.url}
                          src={getVideoEmbedUrl(currentSlide.url)!}
                          title={selectedNews.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          className="relative z-10 w-full h-full rounded-lg shadow-2xl border-0 bg-black"
                        />
                      ) : (
                        <video
                          key={currentSlide.url}
                          src={currentSlide.url}
                          controls
                          playsInline
                          className="relative z-10 w-full h-full object-contain rounded-lg shadow-2xl bg-black"
                        />
                      )
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={currentSlide.url}
                        src={currentSlide.url}
                        alt={selectedNews.title}
                        className="relative z-10 w-full h-full object-contain rounded-lg shadow-2xl"
                      />
                    )}

                    {slides.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedNewsSlideIndex((prev) =>
                              prev === 0 ? slides.length - 1 : prev - 1
                            )
                          }
                          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/70 hover:bg-[#00A651] text-white border border-white/20 flex items-center justify-center shadow-xl transition-all cursor-pointer"
                          title="Slide Sebelumnya"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedNewsSlideIndex((prev) =>
                              prev === slides.length - 1 ? 0 : prev + 1
                            )
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/70 hover:bg-[#00A651] text-white border border-white/20 flex items-center justify-center shadow-xl transition-all cursor-pointer"
                          title="Slide Berikutnya"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </button>
                      </>
                    )}
                  </div>

                  {slides.length > 1 && (
                    <div className="relative z-20 bg-slate-900/95 border-t border-white/10 px-4 py-2.5 flex items-center gap-2 overflow-x-auto">
                      {slides.map((media, idx) => (
                        <button
                          key={`${media.url}-${idx}`}
                          type="button"
                          onClick={() => setSelectedNewsSlideIndex(idx)}
                          className={`relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                            idx === selectedNewsSlideIndex
                              ? 'border-emerald-400 ring-2 ring-emerald-400/40 scale-105'
                              : 'border-white/20 opacity-60 hover:opacity-100'
                          }`}
                        >
                          {media.type === 'video' ? (
                            <div className="relative w-full h-full bg-slate-800 flex flex-col items-center justify-center text-white">
                              <Film className="relative z-10 w-4 h-4 text-emerald-400" />
                              <span className="relative z-10 text-[8px] font-bold mt-0.5">VIDEO</span>
                            </div>
                          ) : (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={media.url}
                              alt={`Slide ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex-1 p-5 sm:p-7 md:p-9 overflow-y-auto space-y-5 bg-white flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                      <span className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#184F48]" />
                        <strong className="text-slate-700">{selectedNews.author}</strong>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {new Date(selectedNews.publishedAt).toLocaleDateString('id-ID', {
                            dateStyle: 'full',
                          })}
                        </span>
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 leading-tight">
                      {sanitizeAdabText(selectedNews.title)}
                    </h2>

                    <div className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line space-y-3 pt-2 border-t border-slate-100 font-normal">
                      {sanitizeAdabText(parsedModal.cleanContent)}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => setSelectedNews(null)}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5 text-slate-600" />
                      <span>Kembali ke Halaman</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* =====================================================================
          MODAL 2: LIGHTBOX BROSUR & BIAYA SPMB SDIT
      ===================================================================== */}
      {isPosterModalOpen && (
        <div
          onClick={() => setIsPosterModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl w-full max-h-[92vh] bg-white rounded-2xl overflow-hidden p-4 sm:p-6 flex flex-col justify-between cursor-default"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2 flex-wrap">
                {SPMB_POSTERS.map((p) => (
                  <button
                    key={p.src}
                    type="button"
                    onClick={() => setActivePoster(p)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      activePoster.src === p.src
                        ? 'bg-[#003831] text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setIsPosterModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-auto my-3 max-h-[70vh] flex items-center justify-center bg-slate-50 rounded-xl p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activePoster.src}
                alt={activePoster.label}
                className="max-h-[68vh] w-auto object-contain rounded-lg"
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              <Link
                href={ppdbUrl}
                className="px-4 py-2 rounded-sm bg-[#00594f] hover:bg-[#003831] text-white text-xs font-bold uppercase tracking-wider"
              >
                Daftar SPMB Online
              </Link>
              <a
                href={activePoster.src}
                download={activePoster.file}
                className="px-4 py-2 rounded-sm bg-[#e5a93b] hover:bg-[#d4962a] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Brosur (JPG)</span>
              </a>
            </div>
          </div>
        </div>
      )}

      <Footer schoolSlug="sd" />
      <StickyMobileBar schoolSlug="sd" />
    </div>
  );
}
