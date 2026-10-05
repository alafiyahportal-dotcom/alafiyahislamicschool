'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyMobileBar from '@/components/layout/StickyMobileBar';
import { 
  ArrowRight, 
  MessageCircle, 
  HeartHandshake, 
  BookOpen, 
  GraduationCap, 
  CheckCircle2, 
  ShieldCheck, 
  School as SchoolIcon,
  Phone,
  Award,
  Calendar,
  User,
  X,
  Newspaper,
  BookOpenCheck,
  UserCheck,
  Users,
  Compass,
  Download,
  ZoomIn,
  FileText,
  Camera,
  Copy,
  Check,
  Sparkles,
  Percent,
  Tag,
  CreditCard
} from 'lucide-react';

import { getStoredReferralCode } from '@/lib/referral';
import UnitHeroSlider, { UnitSlideData } from './UnitHeroSlider';
import InteractiveBubbleCard from './InteractiveBubbleCard';
import CampusLocationMapSection from './CampusLocationMapSection';

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
  bankName?: string;
  bankAccountNumber?: string;
  bankAccountHolder?: string;
  waveName?: string;
  spmbData?: any;
}

export interface EnhancedStatItem {
  label: string;
  value: string;
  subtext: string;
  iconType: 'users' | 'compass' | 'award' | 'quran';
  badge: string;
  color: 'emerald' | 'amber' | 'teal';
}

export function sanitizeAdabText(text?: string | null): string {
  if (!text) return '';
  return text
    .replace(/\bSAW\b/g, 'ﷺ')
    .replace(/rasulullah\s+saw\b/gi, 'Rasulullah ﷺ')
    .replace(/nabi\s+saw\b/gi, 'Nabi ﷺ')
    .replace(/\bSWT\b/g, 'Ta\'ala')
    .replace(/allah\s+swt\b/gi, 'Allah Ta\'ala');
}

export const renderStatIcon = (type: EnhancedStatItem['iconType']) => {
  const cls = 'w-3.5 h-3.5 shrink-0';
  switch (type) {
    case 'users':
      return <Users className={cls} aria-hidden="true" />;
    case 'compass':
      return <Compass className={cls} aria-hidden="true" />;
    case 'quran':
      return <BookOpen className={cls} aria-hidden="true" />;
    case 'award':
    default:
      return <Award className={cls} aria-hidden="true" />;
  }
};

/** Official SPMB SD IT T.A. 2027/2028 materials (index 0 = default active). width/height = intrinsic px, used to size the preview frame. */
const SPMB_POSTERS = [
  { src: '/images/sd-spmb-story.jpg', label: 'Story Telah Dibuka', file: 'Story-SPMB-SDIT-Al-Afiyah-2027-2028.jpg', width: 575, height: 1024 },
  { src: '/images/sd-spmb-brosur.jpg', label: 'Brosur Biaya & Syarat', file: 'Brosur-SPMB-SDIT-Al-Afiyah-2027-2028.jpg', width: 723, height: 1024 },
  { src: '/images/sd-spmb-poster-2027.jpg', label: 'Poster Kuota Terbatas', file: 'Poster-Kuota-SPMB-SDIT-Al-Afiyah-2027-2028.jpg', width: 723, height: 1024 },
];

export default function SchoolLandingTemplate({ school }: { school: SchoolData }) {
  const [selectedNews, setSelectedNews] = useState<NewsData | null>(null);
  const [isPosterModalOpen, setIsPosterModalOpen] = useState(false);
  const [activePoster, setActivePoster] = useState(SPMB_POSTERS[0]);
  const [selectedGalleryItem, setSelectedGalleryItem] = useState<FacilityItem | null>(null);
  const [galleryCategory, setGalleryCategory] = useState<string>('all');
  const [newsFilter, setNewsFilter] = useState<'all' | 'Pengumuman' | 'Kegiatan'>('all');
  const [copiedBankAcc, setCopiedBankAcc] = useState(false);
  const [refCode, setRefCode] = useState<string | null>(null);
  const [isOpeningSpmb, setIsOpeningSpmb] = useState(false);

  useEffect(() => {
    setRefCode(getStoredReferralCode());
  }, []);

  let ppdbUrl = `/ppdb/daftar?school=${school.slug}`;
  if (refCode) {
    ppdbUrl += `&ref=${encodeURIComponent(refCode)}`;
  }

  const handleCopyAccount = (accountNo: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(accountNo);
      setCopiedBankAcc(true);
      setTimeout(() => setCopiedBankAcc(false), 2200);
    }
  };

  const waUrl = `https://wa.me/${school.waCenterPhone}?text=${encodeURIComponent(
    `Assalamu'alaikum Panitia SPMB ${school.name}, saya ingin bertanya perihal informasi pendaftaran murid baru 2027/2028.`
  )}`;

  // ESC key handler to close any active modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsPosterModalOpen(false);
        setSelectedNews(null);
        setSelectedGalleryItem(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const defaultStats: EnhancedStatItem[] = school.slug === 'sd' ? [
    { 
      label: 'Kuota Penerimaan', 
      value: 'Hanya 2 Rombel', 
      subtext: 'T.A. 2027/2028 Terbatas',
      iconType: 'users',
      badge: 'SPMB SD IT',
      color: 'emerald',
    },
    { 
      label: 'Pilar Pendidikan', 
      value: 'Smart Akhlaq Fitrah', 
      subtext: 'Fondasi Karakter Nabawiyah',
      iconType: 'compass',
      badge: 'Kurikulum Khas',
      color: 'emerald',
    },
    { 
      label: 'Akreditasi Sekolah', 
      value: 'A (Unggul)', 
      subtext: 'BAN-SM Terakreditasi',
      iconType: 'award',
      badge: 'Mutu Resmi',
      color: 'emerald',
    },
    { 
      label: 'Bimbingan Tahfidz', 
      value: 'Juz 30 Mutqin', 
      subtext: 'Target Hafalan Lulusan',
      iconType: 'quran',
      badge: 'Target Mutqin',
      color: 'emerald',
    },
  ] : [
    { 
      label: 'Murid Aktif', 
      value: '450+', 
      subtext: 'Generasi Shalih & Cerdas',
      iconType: 'users',
      badge: 'Peserta Didik',
      color: 'emerald',
    },
    { 
      label: 'Guru Berpengalaman', 
      value: '35+ Guru', 
      subtext: 'Tenaga Pendidik Beradab',
      iconType: 'compass',
      badge: 'Ustadz / Ustadzah',
      color: 'amber',
    },
    { 
      label: 'Akreditasi Lembaga', 
      value: 'A (Unggul)', 
      subtext: 'Standar Mutu Nasional',
      iconType: 'award',
      badge: 'Mutu Resmi',
      color: 'teal',
    },
    { 
      label: 'Target Capaian', 
      value: 'Qur\'ani & Prestasi', 
      subtext: 'Karakter & Akademik Holistik',
      iconType: 'quran',
      badge: 'Target Unggulan',
      color: 'emerald',
    },
  ];

  const defaultPrograms = school.programs || [
    {
      title: 'Tahsin & Tahfidz Al-Qur\'an',
      desc: 'Bimbingan intensif talaqqi tartil dengan target hafalan mutqin dan fasih sejak awal.',
      badge: 'Program Utama',
    },
    {
      title: 'Pembiasaan Adab & Karakter',
      desc: 'Penanaman akhlakul karimah, shalat berjamaah, kemandirian, dan adab birrul walidain.',
      badge: 'Karakter',
    },
    {
      title: 'Sains & Literasi Digital',
      desc: 'Pembelajaran sains interaktif, logika matematika, serta pengenalan teknologi bermanfaat.',
      badge: 'Modern',
    },
    {
      title: 'Ekstrakurikuler Bakat Minat',
      desc: 'Pengembangan potensi murid melalui panahan, beladiri thibbun nabawi, pramuka, dan seni.',
      badge: 'Ekskul',
    },
  ];

  const defaultTestimonials = school.testimonials || [
    {
      name: 'dr. H. Asep Irawan Sp.A',
      role: 'Wali Murid Al-Afiyah Majalengka',
      quote: 'Alhamdulillah, semenjak sekolah di Al-Afiyah, ananda menjadi mandiri, tertib shalat, dan bacaan Qur\'annya sangat tartil.',
    },
    {
      name: 'Ibu Hj. Rina Nurhasanah S.Pd',
      role: 'Wali Murid Al-Afiyah Majalengka',
      quote: 'Lingkungan belajar islami yang hangat dan para dewan guru yang mendidik dengan sepenuh hati. Pilihan terbaik di Majalengka.',
    },
  ];

  const defaultValues = school.values && school.values.length > 0 ? school.values : (
    school.slug === 'sd' ? [
      {
        title: 'Mendidik dengan Sunnah & Karakter Nabawiyah',
        description: 'Mendidik dengan sunnah, menggunakan metode Pendidikan Karakter Nabawiyah, menanamkan akhlaq dan ilmu, serta iman sebelum Al-Qur\'an.',
      },
      {
        title: 'Smart, Literasi & Tahfidz Qur\'an',
        description: 'Pembelajaran terpadu penguatan basic literasi dan numerasi serta bimbingan tahfidz Juz 30 mutqin dengan suasana asri yang membahagiakan murid.',
      },
      {
        title: 'Outdoor Learning & Pelatihan Aqil-Baligh',
        description: 'Eksplorasi kontekstual di alam dan kebun pertanian terbuka, pelatihan kemandirian aqil-baligh, serta pemetaan potensi bakat dan skill murid.',
      },
    ] : [
      {
        title: 'Akidah & Akhlakul Karimah',
        description: 'Penanaman adab sebelum ilmu. Menanamkan kebiasaan shalat berjamaah, doa harian, serta hormat dan santun kepada orang tua dan sesama.',
      },
      {
        title: 'Tahsin & Tahfidz Al-Qur\'an',
        description: 'Bimbingan menghafal Al-Qur\'an dengan metode talaqqi tartil yang menyenangkan, memastikan bacaan tajwid fashih dan hafalan mutqin.',
      },
      {
        title: 'Sains & Berwawasan Global',
        description: 'Kurikulum terintegrasi yang melatih daya kritis, kreativitas sains, dasar logika matematika, serta literasi bahasa asing yang aplikatif.',
      },
    ]
  );

  const rawFacilities: FacilityItem[] = school.facilities && school.facilities.length > 0 ? school.facilities : (
    school.slug === 'sd' ? [
      {
        name: 'Pembiasaan Shalat Berjamaah Siswi',
        image: '/images/sd-activity-shalat-berjamaah.jpg',
        desc: 'Pembiasaan adab ibadah harian sejak dini dengan shalat berjamaah yang khusyuk, melatih ketertiban, kebersihan, dan akhlak mahmudah.',
        category: 'Ibadah & Karakter',
      },
      {
        name: 'Pelatihan Muhadharah & Da\'i Cilik Berani Tampil',
        image: '/images/sd-activity-daicilik-speech.jpg',
        desc: 'Mengasah rasa percaya diri murid, kecakapan public speaking, hafalan doa harian, dan penyampaian pesan kebaikan santun di hadapan teman sebaya.',
        category: 'Karakter & Da\'i',
      },
      {
        name: 'Kultum Mandiri & Bimbingan Kepemimpinan Murid',
        image: '/images/sd-activity-kultum-murid.jpg',
        desc: 'Melatih keberanian berbicara di hadapan publik, membawakan tausiyah singkat, serta menumbuhkan jiwa kepemimpinan nabawiyah.',
        category: 'Karakter & Da\'i',
      },
      {
        name: 'Kenyamanan Belajar Kelas Terpadu (Welcome to 6B)',
        image: '/images/sd-activity-classroom-6b.jpg',
        desc: 'Ruang kelas yang asri, bersih, ceria, dan berfasilitas lengkap, menciptakan suasana belajar yang fokus, interaktif, dan ramah anak.',
        category: 'Aktivitas Kelas',
      },
      {
        name: 'Pembelajaran Interaktif Digital & Karakter ("Second Home")',
        image: '/images/sd-activity-multimedia-learning.jpg',
        desc: 'Pemanfaatan media proyektor audio visual dalam pendalaman materi dan Al-Qur\'an, mewujudkan atmosfer sekolah sebagai rumah kedua yang hangat.',
        category: 'Aktivitas Kelas',
      },
      {
        name: 'Field Study Smart Akhlak Fitrah (P4S An-Nabawiyah)',
        image: '/images/sd-field-study-banner.jpg',
        desc: 'Observasi kontekstual murid SD IT Al-Afiyah di alam terbuka, menanamkan nilai kemandirian, rasa syukur, dan cinta ciptaan Allah Ta\'ala.',
        category: 'Agro-Sains & Alam',
      },
      {
        name: 'Prestasi Tim Futsal SD IT Al-Afiyah (Second Place)',
        image: '/images/sd-futsal-champion.jpg',
        desc: 'Raihan piala Juara 2 (Second Place) Futsal tingkat pelajar, melatih sportivitas, mental juara, dan ukhuwah islamiyah.',
        category: 'Prestasi & Bakat',
      },
      {
        name: 'Bimbingan Praktik Semai Bibit ke Polybag',
        image: '/images/sd-planting-guidance.jpg',
        desc: 'Bimbingan langsung ustadz mendampingi siswi memindahkan bibit sayur ke media polybag dengan teliti dan penuh kasih sayang.',
        category: 'Agro-Sains & Alam',
      },
      {
        name: 'Greenhouse & Observasi Bibit Hortikultura',
        image: '/images/sd-seedling-care.jpg',
        desc: 'Siswi mengamati pertumbuhan tunas tanaman pangan di rak semai greenhouse bambu sebagai sarana pembelajaran agro-sains nabawi.',
        category: 'Agro-Sains & Alam',
      },
      {
        name: 'Edukasi Budidaya Ikan & Kolam Biofloc',
        image: '/images/sd-field-fish-feeding.jpg',
        desc: 'Murid ikhwan belajar ekosistem perairan tawar dan praktik pemberian pakan ikan di kolam terpal biofloc percontohan.',
        category: 'Agro-Sains & Alam',
      },
      {
        name: 'Halaqah Tahfidz Qur\'an & Pembiasaan Adab',
        image: '/images/sd-activity-halaqah-tahfidz.jpg',
        desc: 'Bimbingan talaqqi tartil dan setoran hafalan Al-Qur\'an Juz 30 mutqin dengan metode adab nabawiyah yang ramah anak dan membahagiakan.',
        category: 'Ibadah & Karakter',
      },
    ] : school.slug === 'tk' ? [
      {
        name: 'Taman Bermain & Edukasi Sentra Cilik',
        image: '/images/tk-hero-kids.jpg',
        desc: 'Sarana permainan edukatif luar dan dalam ruang yang aman, melatih motorik kasar dan halus serta sosialisasi santun sejak dini.',
        category: 'Sentra & Bermain',
      },
      {
        name: 'Kebun Belajar Hijau & Pengenalan Flora Ramah Anak',
        image: '/images/tk-hero-garden.jpg',
        desc: 'Pembelajaran sains awal mengenalkan aneka ciptaan Allah Ta\'ala melalui interaksi ceria dengan tanaman di kebun sekolah.',
        category: 'Alam & Sains',
      },
      {
        name: 'Ruang Sentra Ibadah & Doa Harian',
        image: '/images/sd-activity-shalat-berjamaah.jpg',
        desc: 'Pembiasaan wudhu mandiri, praktik shalat ceria, hafalan surat-surat pendek dan doa harian dengan metode penuh kasih sayang.',
        category: 'Ibadah & Adab',
      },
      {
        name: 'Kelas Sentra Kreativitas Seni & Hijaiyah',
        image: '/images/tk-hero-kids.jpg',
        desc: 'Pengenalan huruf hijaiyah berirama, menggambar, dan merangsang daya cipta ananda dengan fasilitas ramah balita.',
        category: 'Kreativitas',
      },
    ] : [
      {
        name: 'Pusat Halaqah Tahfidz & Masjid Kampus',
        image: '/images/arc-tahfidz.jpg',
        desc: 'Pusat ibadah harian berjamaah, pembinaan tahfidz 3-5 juz mutqin, dan majelis kajian adab islami bersama asatidz pembina.',
        category: 'Tahfidz & Ibadah',
      },
      {
        name: 'Kelas Bilingual & Pembelajaran Modern',
        image: '/images/smp-hero-bilingual.jpg',
        desc: 'Ruang kelas multimedia kondusif dengan kurikulum terpadu pembiasaan percakapan Bahasa Arab dan Inggris aktif.',
        category: 'Akademik',
      },
      {
        name: 'Gedung Fullday School & Kampus Asri',
        image: '/images/smp-hero-fullday.jpg',
        desc: 'Fasilitas gedung pembelajaran terpadu yang asri, nyaman, dan mendukung program pembinaan karakter fullday school.',
        category: 'Kampus',
      },
      {
        name: 'Laboratorium Multimedia & Komputer',
        image: '/images/sd-activity-multimedia-learning.jpg',
        desc: 'Sarana riset digital, literasi teknologi islami, dan praktikum sains modern yang terarah.',
        category: 'Teknologi',
      },
    ]
  );

  // Pastikan poster PPDB dipisah secara khusus dan tidak tercampur di grid galeri fasilitas
  const defaultFacilities = rawFacilities.filter(
    (fac) => !fac.image?.includes('spmb') && !fac.name?.toLowerCase().includes('poster')
  );

  const availableCategories = useMemo(() => {
    if (school.slug !== 'sd') return [];
    const cats = new Set<string>();
    defaultFacilities.forEach((item) => {
      if (item.category) cats.add(item.category);
    });
    return ['Semua', ...Array.from(cats)];
  }, [school.slug, defaultFacilities]);

  const filteredFacilities = useMemo(() => {
    if (galleryCategory === 'all' || galleryCategory === 'Semua') return defaultFacilities;
    return defaultFacilities.filter((item) => item.category === galleryCategory);
  }, [defaultFacilities, galleryCategory]);

  return (
    <div className={`${school.slug === 'sd' ? 'theme-sd ' : ''}min-h-screen flex flex-col soft-mesh-bg selection:bg-emerald-100 selection:text-emerald-900 overflow-x-clip w-full max-w-full`}>
      {/* Top Unified Navbar */}
      <Navbar
        schoolName={school.name}
        badgeText={school.badgeText}
        schoolSlug={school.slug}
        ppdbUrl={ppdbUrl}
        waPhone={school.waCenterPhone}
        transparentAtTop={true}
      />

      {/* Unit Hero Slider with Ken Burns Zoom & Smooth Zero-Jeda Crossfade */}
      <UnitHeroSlider
        slug={school.slug}
        schoolName={school.name}
        badgeText={school.badgeText}
        registrationFee={school.registrationFee}
        waCenterPhone={school.waCenterPhone}
        customSlides={school.heroSlides}
      />

      {/* Stats: compact 2×2 bento grid on mobile, 4-up on desktop */}
      <section className="relative z-10 bg-neutral-50 border-b border-neutral-200/70 py-4 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* No-op touchstart (delegated to all cards) makes iOS Safari apply :active immediately on tap */}
          <ul className="w-full grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4" onTouchStart={() => {}}>
            {defaultStats.map((stat) => (
              <li
                key={stat.label}
                className="bg-white rounded-2xl border border-neutral-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-3.5 sm:p-5 cursor-pointer select-none [-webkit-tap-highlight-color:transparent] transition-all duration-200 ease-out hover:border-neutral-300 active:scale-[0.97] active:bg-neutral-50 active:border-emerald-500/40 active:shadow-sm motion-reduce:transition-none motion-reduce:active:scale-100"
              >
                <p className="flex items-start gap-1.5 text-[10px] font-semibold tracking-wider uppercase text-neutral-500 leading-tight">
                  <span className="text-green-600 mt-px">{renderStatIcon(stat.iconType)}</span>
                  <span>{stat.label}</span>
                </p>
                <p className="mt-1.5 text-sm sm:text-base font-bold text-neutral-900 leading-snug">
                  {stat.value}
                </p>
                <p className="mt-1 text-[11px] text-neutral-400 line-clamp-1">
                  {stat.subtext}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Pengumuman & Brosur Resmi SPMB (Khusus & Dapat Diunduh) */}
      <section id="pengumuman" className="py-16 sm:py-20 bg-white border-b border-slate-200/60 scroll-mt-16 sm:scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>Pengumuman &amp; Unduh Dokumen Resmi</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
              Poster &amp; Brosur SPMB {school.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Informasi resmi Sistem Penerimaan Murid Baru Tahun Ajaran 2027/2028. Tersedia dalam resolusi tinggi yang dapat Anda unduh atau simpan langsung.
            </p>
          </div>

          {school.slug === 'smp' ? (
            <div className="bg-slate-50/90 rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm hover:border-slate-300 transition-all p-6 sm:p-8 lg:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                {/* Left Column: Gelombang 1 & 2 Schedules & Building Discounts */}
                <div className="lg:col-span-6 space-y-6">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100/80 text-emerald-900 border border-emerald-200 mb-3">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>SPMB TP 2027/2028 • Gelombang 1 &amp; 2</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                      Jadwal Gelombang &amp; Program Diskon Uang Bangunan
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                      Daftarkan ananda pada Gelombang 1 untuk memperoleh keringanan investasi sarana prasarana pendidikan (uang bangunan) dengan kuota rombel terbatas.
                    </p>
                  </div>

                  {/* Wave 1 Card */}
                  <div className="p-5 rounded-2xl bg-white border-2 border-emerald-500 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-xl shadow-xs flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Sedang Dibuka</span>
                    </div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <h4 className="text-base font-extrabold text-slate-900">SPMB Gelombang 1</h4>
                    </div>
                    <p className="text-xs font-bold text-emerald-800 bg-emerald-50 inline-block px-2.5 py-1 rounded-lg border border-emerald-200 mb-3.5">
                      📅 1 Oktober 2026 &ndash; 28 Februari 2027
                    </p>

                    <div className="space-y-2.5 pt-1 border-t border-slate-100">
                      <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-200/70">
                        <Tag className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-extrabold text-emerald-950">
                            Diskon 70% Uang Bangunan
                          </p>
                          <p className="text-[11px] text-emerald-800">
                            Khusus untuk siswa lulusan SDIT AL Afiyah
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/70">
                        <Percent className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-extrabold text-amber-950">
                            Diskon 50% Uang Bangunan
                          </p>
                          <p className="text-[11px] text-amber-800">
                            Untuk siswa pendaftar dari luar SDIT
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Wave 2 Card */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <h4 className="text-sm font-bold text-slate-800">SPMB Gelombang 2</h4>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        Tahap Lanjutan
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium mb-2">
                      📅 1 Maret 2027 &ndash; 30 Juni 2027
                    </p>
                    <div className="p-2.5 rounded-xl bg-slate-50 text-slate-600 text-[11px] flex items-center justify-between border border-slate-100">
                      <span>Ketentuan Biaya:</span>
                      <strong className="text-slate-800 font-bold">No Diskon (Tarif Biaya Normal)</strong>
                    </div>
                  </div>
                </div>

                {/* Right Column: Official Bank Account Card & Direct Actions */}
                <div className="lg:col-span-6 space-y-6">
                  {/* Visual Bank Card */}
                  <div className="rounded-3xl p-6 sm:p-7 text-white shadow-xl relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 border border-emerald-600/40">
                    <div className="flex items-center justify-between pb-4 border-b border-white/15">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-amber-300" />
                        <span className="text-xs font-bold tracking-wider uppercase text-emerald-100">
                          Rekening Resmi Pembayaran SPMB
                        </span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-slate-950 uppercase">
                        Terverifikasi
                      </span>
                    </div>

                    <div className="py-6 space-y-4">
                      <div>
                        <span className="text-[11px] text-emerald-200 block uppercase font-medium">Bank Penerima:</span>
                        <h4 className="text-xl sm:text-2xl font-black text-white tracking-wide">
                          Bank Muamalat
                        </h4>
                      </div>

                      <div className="bg-black/25 p-4 rounded-2xl border border-white/15 flex items-center justify-between gap-3">
                        <div>
                          <span className="text-[10px] text-emerald-200 block font-medium uppercase">Nomor Rekening Resmi:</span>
                          <span className="text-xl sm:text-2xl font-black font-mono tracking-wider text-amber-300">
                            1360012405
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyAccount('1360012405')}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-emerald-50 text-slate-900 font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
                          title="Salin Nomor Rekening"
                        >
                          {copiedBankAcc ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-700" />
                              <span className="text-emerald-800">Tersalin!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-slate-600" />
                              <span>Salin</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div>
                        <span className="text-[11px] text-emerald-200 block uppercase font-medium">Atas Nama Rekening:</span>
                        <p className="text-base font-bold text-white tracking-wide">
                          SMP IT Al Afiyah
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/15 text-[11px] text-emerald-100/90 leading-relaxed flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                      <span>
                        Seluruh pembayaran formulir pendaftaran dan daftar ulang SPMB SMP IT hanya disalurkan melalui rekening resmi di atas.
                      </span>
                    </div>
                  </div>

                  {/* Highlights SMP IT */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-white border border-slate-200">
                      <span className="text-[10px] font-bold text-emerald-700 uppercase block mb-0.5">Target Qur&apos;an</span>
                      <strong className="text-slate-900 block">3-5 Juz Mutqin</strong>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-slate-200">
                      <span className="text-[10px] font-bold text-emerald-700 uppercase block mb-0.5">Bahasa Aktif</span>
                      <strong className="text-slate-900 block">Bilingual Immersion</strong>
                    </div>
                  </div>

                  {/* Direct Action Buttons */}
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <a
                      href={`/ppdb/daftar?school=smp${refCode ? `&ref=${encodeURIComponent(refCode)}` : ''}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        setIsOpeningSpmb(true);
                        setTimeout(() => setIsOpeningSpmb(false), 2000);
                      }}
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
                    >
                      {isOpeningSpmb ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Membuka SPMB...</span>
                        </>
                      ) : (
                        <>
                          <span>Daftar SPMB SMP IT Online</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </a>

                    <a
                      href={`https://wa.me/${school.waCenterPhone}?text=Assalamu%27alaikum%20Panitia%20SPMB%20SMP%20IT%20Al-Afiyah%2C%20saya%20ingin%20konsultasi%20pendaftaran%20Gelombang%201.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm transition-colors shadow-2xs"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-600" />
                      <span>WhatsApp Panitia SPMB</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50/80 rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm hover:border-slate-300 transition-all p-6 sm:p-8 lg:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* Left Column: Poster Image Preview with hover action */}
                <div className="lg:col-span-5 flex flex-col items-center">
                  <div 
                    onClick={() => setIsPosterModalOpen(true)}
                    className="relative group rounded-2xl overflow-hidden border-2 border-slate-200/80 shadow-md bg-white cursor-pointer max-w-sm w-full"
                  >
                    <img
                      src={activePoster.src}
                      alt={`${activePoster.label} SPMB ${school.name} 2027/2028`}
                      width={activePoster.width}
                      height={activePoster.height}
                      className="block w-full h-auto group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-2xs">
                      <span className="px-4 py-2 rounded-xl bg-white/95 text-slate-900 text-xs font-bold shadow-lg flex items-center gap-2">
                        <ZoomIn className="w-4 h-4 text-emerald-600" />
                        <span>Lihat Ukuran Penuh</span>
                      </span>
                    </div>
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white/90 text-emerald-900 shadow-xs border border-emerald-100">
                        T.A. 2027/2028
                      </span>
                    </div>
                  </div>

                  {/* Poster switcher */}
                  <div className="mt-3 w-full max-w-sm grid grid-cols-3 gap-2" role="tablist" aria-label="Pilih materi SPMB">
                    {SPMB_POSTERS.map((poster) => {
                      const isActive = poster.src === activePoster.src;
                      return (
                        <button
                          key={poster.src}
                          type="button"
                          role="tab"
                          aria-selected={isActive}
                          onClick={() => setActivePoster(poster)}
                          className={`group/thumb flex flex-col items-center gap-1 rounded-xl p-1.5 border transition-all cursor-pointer active:scale-95 ${
                            isActive ? 'border-emerald-600 bg-emerald-50' : 'border-slate-200 bg-white hover:border-emerald-300'
                          }`}
                        >
                          <img src={poster.src} alt="" className="h-16 w-full object-cover object-top rounded-lg" />
                          <span className={`text-[10px] font-bold leading-tight text-center ${isActive ? 'text-emerald-800' : 'text-slate-500'}`}>
                            {poster.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-4 w-full max-w-sm flex flex-col gap-2">
                    <a
                      href={activePoster.src}
                      download={activePoster.file}
                      className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm shadow-sm transition-all"
                    >
                      <Download className="w-4 h-4 text-emerald-300" />
                      <span>Unduh {activePoster.label} (JPG)</span>
                    </a>
                    <p className="text-[11px] text-slate-400 text-center">
                      Format JPG • Siap Dibagikan
                    </p>
                  </div>
                </div>

                {/* Right Column: Key Details & Direct Enrollment Steps */}
                <div className="lg:col-span-7 space-y-6">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100/70 text-emerald-900 border border-emerald-200 mb-3">
                      <span>Kuota Sangat Terbatas</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      <span>Hanya 2 Rombel</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                      Penerimaan Murid Baru SD IT Al-Afiyah T.A. 2027/2028
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                      &ldquo;Bukan Sekadar Tempat Belajar, Namun Juga Tempat Bertumbuh.&rdquo; Menanamkan nilai iman sebelum Al-Qur&apos;an, adab nabawiyah sebelum ilmu, dan pembiasaan sunnah Rasulullah ﷺ dalam suasana sekolah yang asri dan membahagiakan murid.
                    </p>
                  </div>

                  {/* Highlights List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                    <div className="p-3.5 rounded-xl bg-white border border-slate-200/80">
                      <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block mb-1">
                        Karakter Utama
                      </span>
                      <p className="text-xs font-bold text-slate-900">
                        Metode Karakter Nabawiyah
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Keteladanan adab sunnah Rasulullah ﷺ &amp; kemandirian aqil-baligh.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white border border-slate-200/80">
                      <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block mb-1">
                        Target Al-Qur&apos;an
                      </span>
                      <p className="text-xs font-bold text-slate-900">
                        Tahfidz Juz 30 Mutqin
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Bimbingan talaqqi tartil dengan tajwid fashih ramah anak.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white border border-slate-200/80">
                      <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block mb-1">
                        Metode Belajar
                      </span>
                      <p className="text-xs font-bold text-slate-900">
                        Outdoor Learning &amp; Agro-Sains
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Eksplorasi greenhouse bambu, botani, &amp; perikanan air tawar.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white border border-slate-200/80">
                      <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block mb-1">
                        Investasi Pendaftaran
                      </span>
                      <p className="text-xs font-bold text-slate-900">
                        Biaya Formulir Rp {school.registrationFee.toLocaleString('id-ID')}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Termasuk panduan berkas &amp; tes observasi kesiapan anak.
                      </p>
                    </div>
                  </div>

                  {/* Direct Action Buttons */}
                  <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center gap-3">
                    <a
                      href={ppdbUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        setIsOpeningSpmb(true);
                        setTimeout(() => setIsOpeningSpmb(false), 2000);
                      }}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#00A651] hover:bg-[#008f45] text-white font-bold text-xs sm:text-sm shadow-xs transition-colors active:scale-95"
                    >
                      {isOpeningSpmb ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Membuka SPMB...</span>
                        </>
                      ) : (
                        <>
                          <span>{school.slug === 'sd' ? 'Daftar SPMB SD IT Online' : 'Daftar SPMB Online'}</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </a>

                    <a
                      href={`https://wa.me/${school.waCenterPhone}?text=Assalamu%27alaikum%20Panitia%20SPMB%20SD%20IT%20Al-Afiyah%2C%20saya%20ingin%20konsultasi%20pendaftaran%20murid%20baru.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm transition-colors shadow-2xs"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-600" />
                      <span>WhatsApp Panitia SPMB</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 3 Core Values (Pilar Karakter Islami SD IT Al-Afiyah): Modern Minimalist */}
      <section id="values" className="relative py-20 bg-gradient-to-b from-white via-slate-50/40 to-white border-b border-slate-200/60 scroll-mt-16 sm:scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200 inline-block shadow-2xs mb-3">
              Nilai Utama &amp; Character Building
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {school.slug === 'sd' ? 'Tiga Pilar Karakter SD IT Al-Afiyah' : `Tiga Pilar Karakter ${school.name}`}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-3 max-w-xl mx-auto leading-relaxed">
              {school.slug === 'sd'
                ? 'Mendidik murid di SD IT Al-Afiyah tidak hanya unggul dalam kognitif sains, tetapi berakar kuat pada nilai-nilai adab nabawiyah, fitrah kemandirian, dan cinta Al-Qur\'an.'
                : 'Mendidik anak tidak hanya unggul dalam kognitif sains, tetapi berakar kuat pada nilai-nilai adab nabawiyah.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {defaultValues.map((val, idx) => (
              <InteractiveBubbleCard
                key={idx}
                variant={idx === 0 ? 'emerald' : idx === 1 ? 'amber' : 'teal'}
                className="rounded-3xl p-7 bg-white/95 border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between h-full"
              >
                <div className="flex-1 pb-6">
                  {/* Modern Minimalist Icon Badge with Spring Tilt on Hover/Click */}
                  <div className="flex items-center justify-between mb-5">
                    <div className={`transition-transform duration-300 group-hover:scale-110 ${
                      idx === 0 
                        ? 'text-emerald-700' 
                        : idx === 1 
                        ? 'text-amber-700' 
                        : 'text-teal-700'
                    }`}>
                      {idx === 0 ? <HeartHandshake className="w-8 h-8" /> : idx === 1 ? <BookOpen className="w-8 h-8" /> : <GraduationCap className="w-8 h-8" />}
                    </div>

                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full border shadow-2xs ${
                      idx === 0 
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                        : idx === 1 
                        ? 'bg-amber-50 text-amber-800 border-amber-200' 
                        : 'bg-teal-50 text-teal-800 border-teal-200'
                    }`}>
                      Pilar 0{idx + 1}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2.5 group-hover:text-emerald-800 transition-colors">
                    {sanitizeAdabText(val.title)}
                  </h3>
                  <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-normal">
                    {sanitizeAdabText(val.description)}
                  </p>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between w-full text-[11px] font-semibold text-emerald-800">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Prinsip Smart Akhlaq Fitrah</span>
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all flex items-center gap-1">
                    <span>Selengkapnya</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </InteractiveBubbleCard>
            ))}
          </div>
        </div>
      </section>

      {/* Program Unggulan */}
      <section 
        id="programs" 
        className="py-16 sm:py-20 bg-emerald-900 scroll-mt-16 sm:scroll-mt-20 w-full text-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-3xl">
            <span className="text-xs font-bold text-emerald-200 uppercase tracking-widest bg-black/20 px-3.5 py-1.5 rounded-full border border-white/15 inline-block shadow-2xs">
              Kurikulum Terintegrasi
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight mt-3">
              Program Unggulan <span className="text-amber-400">{school.name}</span>
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 mt-2 max-w-2xl leading-relaxed">
              Pilar keunggulan kurikulum berakar pada nilai karakter nabawiyah, adab islami, serta penguatan literasi dan agro-sains.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {defaultPrograms.map((prog, idx) => (
              <InteractiveBubbleCard
                key={idx}
                variant={idx % 2 === 0 ? 'emerald' : 'teal'}
                className="bg-white rounded-2xl p-5 border border-white/90 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full group"
              >
                <div className="flex-1 pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                      {prog.badge}
                    </span>
                    <span className="text-xs font-black text-emerald-600 font-mono">0{idx + 1}</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors leading-snug">
                    {sanitizeAdabText(prog.title)}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {sanitizeAdabText(prog.desc)}
                  </p>
                </div>
                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between w-full text-xs font-medium text-emerald-600">
                  <span>Terintegrasi Kurikulum</span>
                  <span className="text-[10px] text-emerald-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all">✦</span>
                </div>
              </InteractiveBubbleCard>
            ))}
          </div>
        </div>
      </section>

      {/* Dewan Guru & Tenaga Pendidik (Sprint 3 - M11) */}
      {school.teachers && school.teachers.length > 0 && (
        <section id="teachers" className="py-16 bg-white border-b border-slate-200/60 scroll-mt-16 sm:scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Kompetensi &amp; Dedikasi</span>
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
                  Dewan Guru &amp; Tenaga Pendidik
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Mendidik dengan keteladanan akhlak, hafalan mutqin, dan dedikasi penuh kasih sayang.
                </p>
              </div>

              <div className="mt-4 md:mt-0 flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                  {school.teachers.length} Tenaga Pendidik Aktif
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {school.teachers.map((teacher) => (
                <div
                  key={teacher.id}
                  className="bg-slate-50/70 rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-emerald-500/50 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    {/* Teacher Avatar */}
                    <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-emerald-600/30 p-0.5 shadow-sm group-hover:scale-105 transition-transform duration-300">
                      <img
                        src={
                          teacher.photoUrl ||
                          '/images/arc-ustadz.jpg'
                        }
                        alt={teacher.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>

                    {/* Teacher Bio Info */}
                    <div className="text-center space-y-1.5">
                      <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-emerald-700 transition-colors">
                        {teacher.name}
                      </h3>
                      <span className="inline-block px-2.5 py-0.5 rounded-md bg-emerald-100/70 text-emerald-800 text-[11px] font-semibold border border-emerald-200/60">
                        {teacher.role}
                      </span>
                      {teacher.specialization && (
                        <p className="text-[11px] text-slate-600 font-medium leading-relaxed pt-1">
                          {teacher.specialization}
                        </p>
                      )}
                      {teacher.bio && (
                        <p className="text-[10px] text-slate-400 italic leading-relaxed pt-1 line-clamp-2">
                          &ldquo;{teacher.bio}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/60 text-center">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                      Tenaga Pendidik {school.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Galeri Fasilitas & Dokumentasi Kegiatan */}
      <section id="facilities" className="py-16 sm:py-20 bg-slate-50/50 border-b border-slate-200/60 scroll-mt-16 sm:scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200 inline-flex items-center gap-1.5 shadow-2xs">
              <Camera className="w-3.5 h-3.5 text-emerald-600" />
              <span>{school.slug === 'sd' ? 'Galeri Aktivitas & Dokumentasi SD IT' : 'Sarana Prasarana'}</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
              {school.slug === 'sd' ? 'Dokumentasi Kegiatan & Aktivitas Belajar SD IT' : 'Fasilitas Pembelajaran Modern & Representatif'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
              {school.slug === 'sd'
                ? 'Potret nyata keseharian murid: pembiasaan ibadah shalat berjamaah, muhadharah da\'i cilik, suasana belajar interaktif di kelas, agro-literasi, dan prestasi santri.'
                : 'Dukungan infrastruktur lengkap demi kenyamanan dan keamanan aktivitas ibadah dan belajar murid.'}
            </p>

            {/* Filter Tabs for SD IT */}
            {school.slug === 'sd' && availableCategories.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-6">
                {availableCategories.map((cat) => {
                  const isActive = galleryCategory === cat || (galleryCategory === 'all' && cat === 'Semua');
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setGalleryCategory(cat)}
                      className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-softwater-dark text-white shadow-sm scale-105'
                          : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-300 hover:text-emerald-800'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFacilities.map((fac, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedGalleryItem(fac)}
                className="group rounded-2xl overflow-hidden bg-white border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-emerald-400/50 transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div className="aspect-[4/3] overflow-hidden bg-slate-100 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={fac.image}
                    alt={fac.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {fac.category && (
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/95 text-emerald-900 shadow-xs border border-emerald-100 backdrop-blur-xs">
                        {fac.category}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-2xs">
                    <span className="px-3.5 py-1.5 rounded-xl bg-white/95 text-slate-900 text-xs font-bold shadow-md flex items-center gap-1.5">
                      <ZoomIn className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Perbesar Foto</span>
                    </span>
                  </div>
                </div>
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-1.5 group-hover:text-emerald-800 transition-colors leading-snug">
                      {sanitizeAdabText(fac.name)}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed">
                      {sanitizeAdabText(fac.desc)}
                    </p>
                  </div>
                  <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-emerald-700">
                    <span>Lihat Dokumentasi</span>
                    <span className="text-xs group-hover:translate-x-1 transition-transform">➔</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kabar & Agenda Kegiatan Sekolah (Sprint 3 - M12) */}
      {school.newsPosts && school.newsPosts.length > 0 && (
        <section id="news" className="py-16 bg-white border-b border-slate-200/60 scroll-mt-16 sm:scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-flex items-center gap-1.5">
                  <Newspaper className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Kabar Al-Afiyah</span>
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
                  Dokumentasi &amp; Agenda Kegiatan Terkini
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Kabar prestasi, agenda daurah, kegiatan ekstrakurikuler, dan pengumuman resmi {school.name}.
                </p>
              </div>

              {/* Tab Filter Kategori Pengumuman / Kegiatan */}
              <div className="mt-4 md:mt-0 flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200/80">
                <button
                  type="button"
                  onClick={() => setNewsFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    newsFilter === 'all'
                      ? 'bg-white text-emerald-800 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Semua Warta
                </button>
                <button
                  type="button"
                  onClick={() => setNewsFilter('Pengumuman')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    newsFilter === 'Pengumuman'
                      ? 'bg-emerald-800 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Tab Pengumuman
                </button>
                <button
                  type="button"
                  onClick={() => setNewsFilter('Kegiatan')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    newsFilter === 'Kegiatan'
                      ? 'bg-white text-emerald-800 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Kegiatan &amp; Prestasi
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {school.newsPosts
                .filter((post) => {
                  if (newsFilter === 'all') return true;
                  if (newsFilter === 'Pengumuman') return post.category.toLowerCase().includes('pengumuman');
                  return !post.category.toLowerCase().includes('pengumuman');
                })
                .map((post) => (
                <div
                  key={post.id}
                  className="bg-slate-50/70 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-lg hover:border-emerald-500/50 transition-all flex flex-col overflow-hidden group"
                >
                  <div className="relative h-48 w-full bg-slate-200 overflow-hidden">
                    <img
                      src={
                        post.coverImage ||
                        '/images/sd-activity-classroom-6b.jpg'
                      }
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-bold bg-white/90 text-slate-800 shadow-xs backdrop-blur-xs">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                          {new Date(post.publishedAt).toLocaleDateString('id-ID', {
                            dateStyle: 'medium',
                          })}
                        </span>
                        <span>•</span>
                        <span>{post.author}</span>
                      </div>

                      <h3 className="font-bold text-slate-900 line-clamp-2 text-base leading-snug group-hover:text-emerald-700 transition-colors">
                        {sanitizeAdabText(post.title)}
                      </h3>

                      <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                        {sanitizeAdabText(post.excerpt)}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-200/70 flex items-center justify-between">
                      <button
                        onClick={() => setSelectedNews(post)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
                      >
                        <span>Baca Selengkapnya</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      {post.coverImage && (post.coverImage.includes('spmb') || post.coverImage.includes('poster')) && (
                        <a
                          href={post.coverImage}
                          download={`Poster-Brosur-SPMB-${school.slug.toUpperCase()}-2027-2028.jpg`}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-lg transition-colors"
                          title="Unduh Poster"
                        >
                          <Download className="w-3 h-3 text-emerald-600" />
                          <span>Unduh</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimoni Orang Tua */}
      <section className="py-16 sm:py-20 bg-emerald-900 text-white w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-emerald-200 uppercase tracking-widest bg-black/20 px-3.5 py-1.5 rounded-full border border-white/15 inline-block shadow-2xs">
              Kata Mereka
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight mt-3">
              Testimoni <span className="text-amber-400">Orang Tua Murid</span>
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 mt-2 max-w-xl mx-auto leading-relaxed">
              Kepercayaan tulus Ayah dan Bunda mendampingi proses tumbuh kembang ananda di {school.name}.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {defaultTestimonials.map((testi, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 sm:p-7 border border-white/90 shadow-xl relative flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="relative">
                  <span className="text-3xl text-emerald-700 font-serif leading-none block mb-1 select-none">“</span>
                  <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed mb-6 font-normal">
                    &ldquo;{testi.quote}&rdquo;
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100 flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-900 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                    {testi.name[0]}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">{testi.name}</h4>
                    <p className="text-[11px] text-slate-400 font-medium">{testi.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal Dialog Baca Artikel Lengkap */}
      {selectedNews && (
        <div 
          onClick={() => setSelectedNews(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in cursor-pointer overflow-y-auto"
        >
          {/* Floating always-visible close button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedNews(null);
            }}
            className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[70] inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900/95 hover:bg-black text-white font-bold text-xs sm:text-sm shadow-2xl border border-white/20 transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
            title="Kembali ke Halaman (ESC)"
          >
            <X className="w-4 h-4 text-emerald-300" />
            <span>Kembali / Tutup</span>
          </button>

          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[86vh] cursor-default my-auto"
          >
            <div className="relative h-48 sm:h-56 w-full bg-slate-100 flex-shrink-0">
              <img
                src={
                  selectedNews.coverImage ||
                  '/images/sd-activity-classroom-6b.jpg'
                }
                alt={selectedNews.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/90 text-slate-800 shadow-sm backdrop-blur-xs">
                  {selectedNews.category}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedNews(null)}
                className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/75 hover:bg-slate-900 text-white font-bold text-xs transition-colors shadow-sm cursor-pointer"
              >
                <X className="w-4 h-4" />
                <span>Kembali</span>
              </button>
            </div>

            <div className="p-5 sm:p-7 overflow-y-auto space-y-4 flex-1">
              <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>
                  {new Date(selectedNews.publishedAt).toLocaleDateString('id-ID', {
                    dateStyle: 'full',
                  })}
                </span>
                <span>•</span>
                <User className="w-4 h-4 text-slate-400" />
                <span>{selectedNews.author}</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
                {sanitizeAdabText(selectedNews.title)}
              </h2>

              <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line space-y-3 pt-2 border-t border-slate-100 font-normal">
                {sanitizeAdabText(selectedNews.content)}
              </div>
            </div>

            <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
              <div className="flex items-center gap-2">
                {selectedNews.coverImage && (selectedNews.coverImage.includes('poster') || selectedNews.coverImage.includes('spmb') || selectedNews.category.toLowerCase().includes('pengumuman')) && (
                  <a
                    href={selectedNews.coverImage}
                    download={`Dokumen-Resmi-${selectedNews.slug || 'al-afiyah'}.jpg`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-800 hover:bg-emerald-900 text-white shadow-2xs transition-all"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Unduh Gambar / Poster</span>
                  </a>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSelectedNews(null)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5 text-slate-600" />
                <span>Kembali ke Halaman</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal Full Screen Preview & Unduh Poster SPMB */}
      {isPosterModalOpen && (
        <div 
          onClick={() => setIsPosterModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in cursor-pointer overflow-y-auto"
        >
          {/* Floating always-visible close button fixed to top-right of window */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsPosterModalOpen(false);
            }}
            className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[70] inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900/95 hover:bg-black text-white font-bold text-xs sm:text-sm shadow-2xl border border-white/20 transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
            title="Kembali ke Halaman (ESC)"
          >
            <X className="w-4 h-4 text-emerald-300" />
            <span>Kembali / Tutup</span>
          </button>

          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl w-full bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[86vh] cursor-default my-auto"
          >
            {/* Header with prominent Kembali button */}
            <div className="flex-shrink-0 flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-white">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 truncate">
                  Poster Resmi SPMB {school.name} T.A. 2027/2028
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPosterModalOpen(false)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5 text-slate-600" />
                <span>Kembali</span>
              </button>
            </div>

            {/* Poster Image: Comfortably fits on any screen */}
            <div className="overflow-y-auto p-3 sm:p-4 bg-slate-100/90 flex items-center justify-center flex-1">
              <img
                src={school.slug === 'smp' ? (school.heroImage || '/images/smp-hero-fullday.jpg') : activePoster.src}
                alt={`Poster SPMB ${school.name}`}
                className="max-h-[50vh] sm:max-h-[55vh] w-auto max-w-full object-contain rounded-xl shadow-md border border-slate-200/80"
              />
            </div>

            {/* Footer with Download and Kembali action */}
            <div className="flex-shrink-0 p-3 sm:p-4 bg-white border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <span className="text-[11px] sm:text-xs text-slate-500 font-medium">
                JPG Resolusi Tinggi • Siap Cetak &amp; Disimpan
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={school.slug === 'smp' ? (school.heroImage || '/images/smp-hero-fullday.jpg') : activePoster.src}
                  download={school.slug === 'smp' ? `Poster-Resmi-SPMB-SMP-Al-Afiyah-2027-2028.jpg` : activePoster.file}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Unduh Poster (JPG)</span>
                </a>
                <button
                  type="button"
                  onClick={() => setIsPosterModalOpen(false)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Kembali</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal: Galeri Foto Aktivitas & Sarana */}
      {selectedGalleryItem && (
        <div 
          className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn"
          onClick={() => setSelectedGalleryItem(null)}
        >
          {/* Top Floating Close Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedGalleryItem(null);
            }}
            className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[90] inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900/95 hover:bg-black text-white font-bold text-xs sm:text-sm shadow-2xl border border-white/20 transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
            title="Tutup (ESC)"
          >
            <X className="w-4 h-4 text-emerald-300" />
            <span>Tutup (ESC)</span>
          </button>

          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl w-full bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] cursor-default my-auto animate-scaleUp"
          >
            {/* Header */}
            <div className="flex-shrink-0 flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-white">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                {selectedGalleryItem.category && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100/70 text-emerald-800 border border-emerald-200">
                    {selectedGalleryItem.category}
                  </span>
                )}
                <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 truncate">
                  Dokumentasi {school.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedGalleryItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Image Preview Box */}
            <div className="flex-1 overflow-hidden p-2 sm:p-4 bg-slate-950/95 flex items-center justify-center min-h-[260px] max-h-[58vh]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedGalleryItem.image}
                alt={selectedGalleryItem.name}
                className="max-h-[54vh] w-auto max-w-full object-contain rounded-xl shadow-md"
              />
            </div>

            {/* Footer Caption */}
            <div className="flex-shrink-0 p-4 sm:p-5 bg-white border-t border-slate-100 space-y-1">
              <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                {sanitizeAdabText(selectedGalleryItem.name)}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                {sanitizeAdabText(selectedGalleryItem.desc)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Interactive School Map & Location */}
      <CampusLocationMapSection unitSlug={school.slug} />

      {/* High-Converting Bottom CTA Banner: Full-width Solid Green Above Footer */}
      <section id="contact" className="py-16 sm:py-20 bg-emerald-900 text-white w-full scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center mb-3">
            <span className="text-xs font-bold text-emerald-200 uppercase tracking-widest bg-black/20 px-3.5 py-1.5 rounded-full border border-white/15 inline-block shadow-2xs">
              Penerimaan Murid Baru (SPMB) 2027/2028
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight max-w-3xl mx-auto">
            Kuota Terbatas! Amankan Kursi Belajar <span className="text-amber-400">Ananda Sekarang</span>
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-3 max-w-xl mx-auto leading-relaxed font-normal">
            Daftarkan ananda sekarang sebelum kuota 2 rombel terpenuhi. Bergabunglah bersama keluarga besar {school.name} untuk bimbingan karakter nabawiyah dan tahfidz mutqin.
          </p>

          <div className="pt-6 flex justify-center">
            <Link
              href={ppdbUrl}
              className="px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm sm:text-base shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center cursor-pointer"
            >
              <span>Daftar Sekarang</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Unified Footer */}
      <Footer schoolSlug={school.slug} />

      {/* Sticky Mobile Bottom Bar */}
      <StickyMobileBar
        schoolSlug={school.slug}
        waPhone={school.waCenterPhone}
        schoolName={school.name}
      />
    </div>
  );
}
