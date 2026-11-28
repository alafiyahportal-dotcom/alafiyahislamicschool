'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyMobileBar from '@/components/layout/StickyMobileBar';
import CampusLocationMapSection from '@/components/landing/CampusLocationMapSection';
import AutoHorizontalSlider from '@/components/landing/AutoHorizontalSlider';
import FacelessIslamicAvatar from '@/components/shared/FacelessIslamicAvatar';
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
  Users,
  MessageCircle,
  Calculator,
  Check,
  Copy,
} from 'lucide-react';
import { getStoredReferralCode } from '@/lib/referral';
import {
  mergeUniqueStrings,
  parseNewsMedia,
  getVideoEmbedUrl,
} from '@/lib/news-media';
import { getDepartmentByRole } from '@/lib/departments';
import type { UnitSlideData } from '@/components/landing/UnitHeroSlider';

export interface SmpLandingProps {
  teachers?: Array<{
    id: string;
    name: string;
    role: string;
    specialization?: string | null;
    bio?: string | null;
    photoUrl?: string | null;
  }>;
  newsPosts?: Array<{
    id: string;
    title: string;
    slug: string;
    category: string;
    excerpt: string;
    content: string;
    coverImage?: string | null;
    author: string;
    publishedAt: string | Date;
  }>;
  achievements?: Array<any>;
  cmsData?: {
    heroSlides?: UnitSlideData[];
    heroHeadline?: string;
    heroSubheadline?: string;
    programs?: Array<{
      id?: string;
      title: string;
      badge?: string;
      desc: string;
      highlights?: string[];
    }>;
    facilities?: Array<{
      id?: string;
      name?: string;
      title?: string;
      image: string;
      desc: string;
      category?: string;
    }>;
    testimonials?: Array<{
      name: string;
      role: string;
      quote: string;
      tag?: string;
    }>;
    newsCategories?: string[];
  };
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
      href="https://www.instagram.com/smpitalafiyahmjl"
      target="_blank"
      rel="noreferrer"
      aria-label="Instagram SMP IT Al-Afiyah"
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
        <rect x="10" y="22" width="44" height="30" rx="2" fill="#030164" />
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
          fill="#030164"
        />
        <path
          d="M23 20A9 9 0 0 0 41 20"
          stroke="#030164"
          strokeWidth="2.5"
          fill="none"
        />
        <rect x="30.5" y="29" width="3" height="5" fill="#030164" />
        <rect x="25" y="33" width="14" height="2.5" rx="1" fill="#030164" />
        <rect x="16" y="36" width="32" height="7" rx="2" fill="#F5B82E" />
        <rect x="18" y="38" width="26" height="3" fill="#FFFFFF" />
        <rect x="14" y="45" width="36" height="7" rx="2" fill="#030164" />
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
        <path d="M10 34L32 24L54 34L32 44L10 34Z" fill="#01003d" />
        <path
          d="M19 39V49C19 52 25 55 32 55C39 55 45 52 45 49V39L32 45L19 39Z"
          fill="#030164"
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
      <path d="M14 22C14 18 24 18 24 22" fill="#01003d" />
      <path
        d="M10 48C10 40 14 36 19 36C24 36 28 40 28 48H10Z"
        fill="#030164"
      />
      <circle cx="45" cy="24" r="5.5" fill="#FDBA74" />
      <path d="M39 24C39 18 51 18 51 25" fill="#01003d" />
      <path
        d="M36 48C36 40 40 36 45 36C50 36 54 40 54 48H36Z"
        fill="#030164"
      />
      <circle cx="32" cy="20" r="6.5" fill="#FDBA74" />
      <path d="M26 18C26 13 38 13 38 18" fill="#01003d" />
      <path
        d="M20 50C20 40 25 34 32 34C39 34 44 40 44 50H20Z"
        fill="#F5B82E"
      />
      <path
        d="M28 34L32 43L36 34"
        stroke="#030164"
        strokeWidth="2.5"
        fill="none"
      />
    </svg>
  );
}

const DEFAULT_HERO_IMAGES = [
  {
    id: 'smp-bg-1',
    src: '/images/smp-kelulusan-angkatan-3.jpg',
    alt: 'Haflah Kelulusan Angkatan ke-3 SMP IT Al-Afiyah Majalengka',
    objectPosition: 'object-center',
  },
  {
    id: 'smp-bg-2',
    src: '/images/smp-halaqah-tahfidz-quran.jpg',
    alt: 'Halaqah Tahfidz Al-Quran SMP IT Al-Afiyah',
    objectPosition: 'object-center',
  },
  {
    id: 'smp-bg-3',
    src: '/images/smp-kelas-literasi.jpg',
    alt: 'Pembelajaran Aktif di Kelas SMP IT Al-Afiyah',
    objectPosition: 'object-center',
  },
  {
    id: 'smp-bg-4',
    src: '/images/smp-pramuka-outdoor.jpg',
    alt: 'Kepanduan Pramuka SIT & Karakter Outdoor SMP IT Al-Afiyah',
    objectPosition: 'object-center',
  },
];

const DEFAULT_FEATURE_BOXES = [
  {
    title: 'TERAKREDITASI A RESMI &\nDISKON BANGUNAN S.D. 70%',
    href: '/smp/spmb',
    iconType: 'school' as const,
  },
  {
    title: 'TAHFIDZ 3 - 5+ JUZ MUTQIN\n& FASIH BAHASA ARAB',
    href: '/smp/program',
    iconType: 'scholarship' as const,
  },
  {
    title: 'CHARACTER DEVELOPMENT (SCD)\n& MUTABA’AH DIGITAL',
    href: '/smp/karakter',
    iconType: 'curriculum' as const,
  },
  {
    title: 'FUTSAL DEVELOPMENT PROGRAM\n& PRAMUKA SIT',
    href: '/smp/fasilitas',
    iconType: 'teachers' as const,
  },
];

const SPMB_POSTERS = [
  {
    src: '/images/smp-spmb-poster.png',
    label: 'Poster Utama SPMB',
    file: 'Poster-SPMB-SMP-IT-Al-Afiyah-2027-2028.png',
  },
  {
    src: '/images/smp-spmb-biaya.png',
    label: 'Rincian Biaya & Diskon',
    file: 'Rincian-Biaya-SPMB-SMP-IT-Al-Afiyah-2027-2028.png',
  },
  {
    src: '/images/smp-program-unggulan.png',
    label: '6 Program Unggulan',
    file: 'Program-Unggulan-SMP-IT-Al-Afiyah-2027-2028.png',
  },
];

const BIAYA_ITEMS = [
  { item: 'Pendaftaran & Observasi', ikhwan: 200000, akhwat: 200000, note: 'Sekali di awal pendaftaran' },
  { item: 'Uang Bangunan (Gedung)', ikhwan: 2500000, akhwat: 2500000, note: 'Diskon 70% SDIT / 50% Umum di Gel 1' },
  { item: 'Fasilitas Pembelajaran (AC & Lab)', ikhwan: 500000, akhwat: 500000, note: 'Sarana kelas ber-AC & IT' },
  { item: 'Paket Seragam Lengkap', ikhwan: 1100000, akhwat: 1400000, note: '4 stel seragam + atribut sekolah' },
  { item: 'Paket Buku Pelajaran & Diniyyah', ikhwan: 1000000, akhwat: 1000000, note: 'Paket buku teks 1 tahun' },
  { item: 'Kegiatan Siswa 1 Tahun', ikhwan: 1700000, akhwat: 1700000, note: 'Rihlah tubing, mabit, PHBI & outing' },
  { item: 'SPP Bulan Pertama (Juli)', ikhwan: 300000, akhwat: 300000, note: 'Termasuk mutaba\'ah digital' },
];

const FAQ_ITEMS = [
  {
    question: 'KAPAN JADWAL PENDAFTARAN SPMB GELOMBANG 1 & 2 SMP IT AL-AFIYAH?',
    answer:
      'Gelombang 1 dibuka tanggal 1 Oktober 2026 – 28 Februari 2027 (Promo Diskon 70% Uang Bangunan bagi siswa SDIT Al-Afiyah & Diskon 50% bagi siswa luar/umum). Gelombang 2 dibuka tanggal 1 Maret – 30 Juni 2027 dengan tarif normal selama kuota masih tersedia.',
  },
  {
    question: 'BERAPA PERBEDAAN RINCIAN BIAYA ANTARA MURID IKHWAN DAN AKHWAT?',
    answer:
      'Seluruh komponen biaya sama, kecuali Paket Seragam Lengkap (Ikhwan Rp 1.100.000, Akhwat Rp 1.400.000 karena tambahan jilbab syar’i). Total Gelombang 1 Diskon 70% (SDIT): Ikhwan Rp 5.550.000 / Akhwat Rp 5.850.000. Total Gelombang 1 Diskon 50% (Umum): Ikhwan Rp 6.050.000 / Akhwat Rp 6.350.000.',
  },
  {
    question: 'APAKAH CALON MURID WAJIB SUDAH LANCAR MEMBACA AL-QUR’AN SAAT MENDAFTAR?',
    answer:
      'Saat observasi akan dilakukan pemetaan kemampuan bacaan Al-Qur’an. Bagi murid yang belum lancar tajwid/makhrajnya akan masuk kelas Tahsin Intensif sebelum melanjutkan setoran target Tahfidz 3–5+ Juz Mutqin.',
  },
  {
    question: 'BAGAIMANA SISTEM PEMANTAUAN IBADAH HARIAN MURID (MUTABA’AH DIGITAL)?',
    answer:
      'Setiap murid dibekali akun Mutaba’ah Digital untuk memantau shalat fardhu 5 waktu, shalat dhuha, tilawah harian, dzikir pagi-petang, serta adab birrul walidain di rumah yang terhubung langsung antara wali kelas dan orang tua.',
  },
  {
    question: 'KE REKENING MANA PEMBAYARAN BIAYA PENDAFTARAN RP 200.000 DITRANSFER?',
    answer:
      'Seluruh pembayaran resmi SPMB ditransfer ke Bank Muamalat No. Rekening 1360012405 a.n. SMP IT Al Afiyah. Konfirmasi bukti transfer dikirimkan melalui formulir online atau WhatsApp Panitia 0822-4935-7893.',
  },
];

const UPCOMING_EVENTS = [
  // Slide 1 (Halaman 1)
  {
    day: '28',
    month: 'Feb',
    year: '2027',
    title: 'Penutupan SPMB Gelombang 1 (Diskon Bangunan 70% & 50%)',
    dateTime: '1 Okt 2026 - 28 Feb 2027 @ 07:30 - 14:30 WIB',
    location: 'SMP IT Al-Afiyah Majalengka',
    tag: 'SPMB Gel. 1',
    image: '/images/smp-spmb-poster.png',
    href: '/smp/spmb/daftar',
  },
  {
    day: '15',
    month: 'Nov',
    year: '2026',
    title: 'Tasmi’ Akbar Tahfidz Al-Qur’an 3 Juz Sekali Duduk',
    dateTime: 'Semester Ganjil @ 07:30 - 11:30 WIB',
    location: 'Masjid SMP IT Al-Afiyah',
    tag: 'Tahfidz',
    image: '/images/smp-tasmi-mutabaah-digital.jpg',
    href: '/smp/program',
  },
  {
    day: '14',
    month: 'Des',
    year: '2026',
    title: 'Turnamen Futsal Development Program & Kepanduan SIT',
    dateTime: 'Desember 2026 @ 08:00 - 15:00 WIB',
    location: 'Lapangan Olahraga SMP IT',
    tag: 'Olahraga',
    image: '/images/smp-pramuka-outdoor.jpg',
    href: '/smp/fasilitas',
  },
  // Slide 2 (Halaman 2)
  {
    day: '24',
    month: 'Jan',
    year: '2027',
    title: 'Mabit Ruhiyah & Muhasabah Remaja (SCD Character Camp)',
    dateTime: 'Januari 2027 @ 16:00 - 07:00 WIB',
    location: 'Kampus Giri Asih SMP IT Al-Afiyah',
    tag: 'Karakter SCD',
    image: '/images/smp-masjid-pusat-halaqah.jpg',
    href: '/smp/karakter',
  },
  {
    day: '20',
    month: 'Feb',
    year: '2027',
    title: 'Rihlah Edukatif & Tadabbur Alam River Tubing Cikadongdong',
    dateTime: 'Februari 2027 @ 07:30 - 15:00 WIB',
    location: 'Cikadongdong River Tubing, Majalengka',
    tag: 'Rihlah & Outing',
    image: '/images/smp-tubing-1.jpg',
    href: '/smp/dokumentasi',
  },
  {
    day: '20',
    month: 'Jun',
    year: '2027',
    title: 'Haflah Akhirussanah, Wisuda Tahfidz & Apresiasi Prestasi Santri',
    dateTime: 'Juni 2027 @ 08:00 - 12:30 WIB',
    location: 'Aula Utama SMP IT Al-Afiyah',
    tag: 'Haflah & Wisuda',
    image: '/images/smp-kelulusan-angkatan-3.jpg',
    href: '/smp/dokumentasi',
  },
];

const DEFAULT_SMP_NEWS = [
  {
    id: 'smp-news-1',
    title: 'Haflah Kelulusan & Kenaikan Kelas SMP IT Al-Afiyah Angkatan ke-3: Melangkah Pasti Meraih Prestasi',
    slug: 'haflah-kelulusan-angkatan-3-smp-it-al-afiyah',
    category: 'Kegiatan',
    excerpt:
      'Momen khidmat pelepasan santri angkatan ke-3 SMP IT Al-Afiyah Majalengka bertema Melangkah Pasti Meraih Prestasi, Berakhlak Islami, Siap Berkompetisi — Be Smart & Religious.',
    content:
      'Alhamdulillah, prosesi Haflah Kelulusan dan Kenaikan Kelas SMP IT Al-Afiyah Majalengka Angkatan ke-3 berlangsung khidmat dan penuh haru di Aula Utama sekolah.\n\nAcara dihadiri oleh Ketua Yayasan Pendidikan Imam Bonjol, Kepala Sekolah Ust. Jaja Madhuri, S.Pd., M.Pd., jajaran dewan asatidz, serta seluruh orang tua/wali santri yang turut menyaksikan penyematan penghargaan tahfidz dan prestasi akademik.',
    coverImage: '/images/smp-kelulusan-angkatan-3.jpg',
    author: 'Humas SMP IT Al-Afiyah',
    publishedAt: '2026-06-22T08:00:00.000Z',
  },
  {
    id: 'smp-news-2',
    title: 'Ujian Tasmi’ Al-Qur’an & Evaluasi Mutaba’ah Digital Santri Bersama Dewan Asatidz',
    slug: 'ujian-tasmi-quran-dan-mutabaah-digital-smp-it',
    category: 'Tahfidz',
    excerpt:
      'Santri SMP IT Al-Afiyah melaksanakan ujian tasmi’ hafalan Al-Qur’an sekali duduk serta evaluasi catatan ibadah harian melalui sistem Mutaba’ah Digital.',
    content:
      'Program unggulan Tahfidz Al-Qur’an 3–5+ Juz di SMP IT Al-Afiyah dikawal melalui halaqah talaqqi rutin setiap pagi dan ujian tasmi’ berkala di Masjid sekolah.\n\nSelain penjagaan kualitas tajwid dan kelancaran hafalan (mutqin), pembiasaan ibadah harian santri dipantau secara transparan melalui sistem Mutaba’ah Digital yang terintegrasi dengan orang tua.',
    coverImage: '/images/smp-tasmi-mutabaah-digital.jpg',
    author: 'Koordinator Tahfidz SMP IT',
    publishedAt: '2026-10-12T08:00:00.000Z',
  },
  {
    id: 'smp-news-3',
    title: 'Tadabbur Alam & Petualangan River Tubing Cikadongdong: Melatih Keberanian & Ukhuwah Santri',
    slug: 'tadabbur-alam-river-tubing-cikadongdong-smp-it',
    category: 'Outing Class',
    excerpt:
      'Kegiatan outing class river tubing di Sungai Cikadongdong Majalengka menumbuhkan ketangguhan fisik, kepemimpinan, dan mempererat ukhuwah islamiyah antarsantri.',
    content:
      'Dalam rangka menyeimbangkan kebugaran jasmani dan penyegaran semangat belajar, santri SMP IT Al-Afiyah mengikuti kegiatan Rihlah Tadabbur Alam & River Tubing di Cikadongdong, Majalengka.\n\nDidampingi langsung oleh para asatidz pembina dan tim instruktur keselamatan, para santri belajar keberanian, kerja sama tim, serta mensyukuri keindahan alam ciptaan Allah Ta’ala.',
    coverImage: '/images/smp-tubing-1.jpg',
    author: 'Kesiswaan SMP IT Al-Afiyah',
    publishedAt: '2026-09-28T08:00:00.000Z',
  },
];

const DEFAULT_SMP_TEACHERS = [
  {
    id: 'smp-t-0',
    name: 'Jejen Nurbayan, S.Sos',
    role: 'Ketua Yayasan Pendidikan Imam Bonjol',
    specialization: 'Manajemen Kelembagaan & Kebijakan Yayasan',
    bio: 'Mengarahkan visi pendidikan terpadu berlandaskan tauhid dan akhlak mulia demi masa depan generasi Qur\'ani.',
  },
  {
    id: 'smp-t-1',
    name: 'Jaja Madhuri, S.Pd., M.Pd.',
    role: 'Kepala Sekolah SMP IT Al-Afiyah',
    specialization: 'Manajemen Pendidikan Islam & Karakter',
    bio: 'Memimpin penyelenggaraan pendidikan SMP IT Al-Afiyah dengan visi mencetak generasi Smart & Religious berakhlak Qur\'ani.',
  },
  {
    id: 'smp-t-2',
    name: 'M. Akbar Pratama, S.Pd.',
    role: 'PKS Kurikulum (Pembantu Kepala Sekolah)',
    specialization: 'Pengembangan Kurikulum Terpadu & Mutu Akademik',
    bio: 'Mengawal integrasi Kurikulum Nasional dan kurikulum pesantren khas Al-Afiyah, riset sains, dan kecakapan akademik santri.',
  },
  {
    id: 'smp-t-3',
    name: 'Rio Satrio, S.Pd.',
    role: 'PKS Kesiswaan (Pembantu Kepala Sekolah)',
    specialization: 'Pembinaan Karakter Santri, Disiplin & Minat Bakat',
    bio: 'Membina kedisiplinan, kepemimpinan nabawiyah, program SCD (Student Character Development), dan kegiatan kesiswaan positif.',
  },
  {
    id: 'smp-t-4',
    name: 'Muhamad Eechram Riady, S.Pd.',
    role: 'Sarpras (Sarana & Prasarana)',
    specialization: 'Pengelolaan Fasilitas & Lingkungan Pembelajaran',
    bio: 'Memastikan kenyamanan, kelayakan sarana modern, laboratorium multimedia, dan lingkungan asri penunjang kegiatan belajar.',
  },
  {
    id: 'smp-t-5',
    name: 'Iip Zaenal Arifin, S.Pd.',
    role: 'Tata Usaha',
    specialization: 'Tata Kelola Administrasi & Keuangan Pendidikan',
    bio: 'Mengelola akuntabilitas keuangan sekolah, layanan administrasi SPMB terpadu, dan tata usaha profesional bagi wali murid.',
  },
  {
    id: 'smp-t-6',
    name: 'Amelia Kartika, S.Sos.',
    role: 'Humas (Hubungan Masyarakat)',
    specialization: 'Komunikasi Publik, Kemitraan & Layanan Informasi',
    bio: 'Membangun komunikasi sinergis antara sekolah, wali murid, dan masyarakat serta memfasilitasi kemitraan strategis.',
  },
  {
    id: 'smp-t-7',
    name: 'Mulia Rizki',
    role: 'Lead Developer & IT Systems',
    specialization: 'Arsitektur Sistem Informasi, Fullstack Development & Database',
    bio: 'Mengembangkan dan mengelola ekosistem digital sekolah, infrastruktur sistem, database, serta operasional portal SPMB & platform digital Al-Afiyah.',
  },
];

const REAL_SMP_TESTIMONIALS = [
  {
    name: 'Ust. Jaja Madhuri, S.Pd., M.Pd.',
    role: 'Kepala Sekolah SMP IT Al-Afiyah Majalengka',
    quote:
      'Di SMP IT Al-Afiyah, kami membimbing santri di fase remaja dengan keteladanan adab nabawiyah, kedisiplinan ibadah melalui Mutaba’ah Digital, hafalan Al-Qur’an 3–5+ Juz mutqin, serta kemahiran Bahasa Arab aktif agar lahir generasi pemimpin yang Be Smart & Religious.',
    avatar: '/images/smp-kelulusan-angkatan-3.jpg',
  },
  {
    name: 'Dewan Asatidz & Pembina Tahfidz',
    role: 'Tim Pendidik SMP IT Al-Afiyah',
    quote:
      'Sinergi erat antara pembiasaan shalat berjamaah di masjid sekolah, halaqah Al-Qur’an setiap pagi, dan komunikasi rutin bersama orang tua menjadi kunci tumbuhnya karakter santri yang santun, mandiri, dan berprestasi.',
    avatar: '/images/smp-halaqah-tahfidz-quran.jpg',
  },
];

const TESTIMONIAL_MAP_SLOTS = [
  {
    desktopPos: 'lg:absolute lg:top-[115px] lg:left-[26%] lg:w-[38%]',
    defaultAvatar: '/images/smp-kelulusan-angkatan-3.jpg',
  },
  {
    desktopPos: 'lg:absolute lg:top-[150px] lg:left-[69%] lg:w-[29%]',
    defaultAvatar: '/images/smp-halaqah-tahfidz-quran.jpg',
  },
  {
    desktopPos: 'lg:absolute lg:top-[335px] lg:left-[3%] lg:w-[31%]',
    defaultAvatar: '/images/smp-kelas-literasi.jpg',
  },
  {
    desktopPos: 'lg:absolute lg:top-[355px] lg:left-[47%] lg:w-[34%]',
    defaultAvatar: '/images/smp-pramuka-outdoor.jpg',
  },
];

export default function SmpLandingView({
  teachers = [],
  newsPosts = [],
  cmsData,
}: SmpLandingProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeNewsTab, setActiveNewsTab] = useState<string>('Semua');
  const [agendaPage, setAgendaPage] = useState<number>(1);
  const [agendaViewMode, setAgendaViewMode] = useState<'grid' | 'list'>('grid');
  const [showFaqBox, setShowFaqBox] = useState<boolean>(true);
  const [openFaqIndex, setOpenFaqIndex] = useState<number>(0);
  const [selectedNews, setSelectedNews] = useState<any | null>(null);
  const [selectedNewsSlideIndex, setSelectedNewsSlideIndex] = useState<number>(0);
  const [isPosterModalOpen, setIsPosterModalOpen] = useState(false);
  const [activePoster, setActivePoster] = useState(SPMB_POSTERS[0]);
  const [isFeeModalOpen, setIsFeeModalOpen] = useState(false);
  const [activeGender, setActiveGender] = useState<'ikhwan' | 'akhwat'>('ikhwan');
  const [copiedBank, setCopiedBank] = useState(false);
  const [refCode, setRefCode] = useState<string | null>(null);

  useEffect(() => {
    setRefCode(getStoredReferralCode());
  }, []);

  let ppdbUrl = '/smp/spmb/daftar';
  if (refCode) {
    ppdbUrl += `?ref=${encodeURIComponent(refCode)}`;
  }

  const handleCopyAccount = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText('1360012405');
      setCopiedBank(true);
      setTimeout(() => setCopiedBank(false), 2200);
    }
  };

  // Calculations for Fee Simulator Modal
  const seragamAmount = activeGender === 'ikhwan' ? 1100000 : 1400000;
  const normalTotal = 200000 + 2500000 + 500000 + seragamAmount + 1000000 + 1700000 + 300000;
  const sditDiscountTotal = normalTotal - 1750000;
  const umumDiscountTotal = normalTotal - 1250000;

  // Dynamic Hero Images synced from CMS Hero Slides
  const heroImages = useMemo(() => {
    if (cmsData?.heroSlides && Array.isArray(cmsData.heroSlides) && cmsData.heroSlides.length > 0) {
      const validSlides = cmsData.heroSlides
        .filter((s) => Boolean(s && s.image))
        .map((s, idx) => ({
          id: `cms-smp-bg-${s.id ?? idx + 1}`,
          src: s.image,
          alt: `SMP IT Al-Afiyah Majalengka - Slide ${idx + 1}`,
          objectPosition: 'object-center',
        }));
      if (validSlides.length > 0) return validSlides;
    }
    return DEFAULT_HERO_IMAGES;
  }, [cmsData?.heroSlides]);

  const heroTitle = 'SMP IT AL-AFIYAH MAJALENGKA';

  const heroDescription = useMemo(() => {
    const firstSlide = cmsData?.heroSlides?.[0];
    if (firstSlide?.description && firstSlide.description.trim().length > 0) {
      return sanitizeAdabText(firstSlide.description);
    }
    if (cmsData?.heroSubheadline && cmsData.heroSubheadline.trim().length > 0) {
      return sanitizeAdabText(cmsData.heroSubheadline);
    }
    return 'Be Smart & Religious — Sekolah Menengah Pertama Islam Terpadu Terakreditasi A (SK No. 012/BAN-PDM/SK/2025) dengan program unggulan Tahfidz 3–5+ Juz Mutqin, Bahasa Arab Aktif, Student Character Development (SCD), & Mutaba’ah Digital.';
  }, [cmsData?.heroSlides, cmsData?.heroSubheadline]);

  // Dynamic Testimonials synced from CMS database
  const realMapTestimonials = useMemo(() => {
    const rawList =
      cmsData?.testimonials && Array.isArray(cmsData.testimonials) && cmsData.testimonials.length > 0
        ? cmsData.testimonials.filter((t) => Boolean(t && t.name && t.quote))
        : REAL_SMP_TESTIMONIALS;

    return rawList.slice(0, 4).map((t, idx) => {
      const slot = TESTIMONIAL_MAP_SLOTS[idx % TESTIMONIAL_MAP_SLOTS.length];
      const cleanQuote = t.quote.trim().replace(/^[“"']+|[”"']+$/g, '');
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
        role: t.role || 'Wali Murid SMP IT Al-Afiyah',
        quote: `"${sanitizeAdabText(cleanQuote)}"`,
        avatar: (t as any).avatar || slot.defaultAvatar,
        desktopPos,
      };
    });
  }, [cmsData?.testimonials]);

  // Structural Teachers list (keep complete specialization & bio intact)
  const displayTeachers = useMemo(() => {
    const base = teachers && teachers.length > 0 ? [...teachers] : [...DEFAULT_SMP_TEACHERS];
    if (!base.some((t) => t.name.toLowerCase().includes('jejen nurbayan'))) {
      base.unshift(DEFAULT_SMP_TEACHERS[0]);
    }
    if (!base.some((t) => t.name.toLowerCase().includes('mulia rizki'))) {
      base.push(DEFAULT_SMP_TEACHERS[7]);
    }
    return base;
  }, [teachers]);

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
        setIsFeeModalOpen(false);
        setSelectedNews(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const allArticles = useMemo(() => {
    return newsPosts && newsPosts.length > 0 ? newsPosts : DEFAULT_SMP_NEWS;
  }, [newsPosts]);

  const availableNewsTabs = useMemo(() => {
    const base =
      cmsData?.newsCategories && cmsData.newsCategories.length > 0
        ? ['Semua', ...cmsData.newsCategories]
        : ['Semua', 'Kegiatan', 'Tahfidz', 'Prestasi', 'Outing Class', 'Pengumuman'];
    const fromPosts = allArticles.map((p) => (p.category || '').trim()).filter(Boolean);
    return mergeUniqueStrings(base, fromPosts).slice(0, 7);
  }, [allArticles, cmsData?.newsCategories]);

  const filteredArticles = useMemo(() => {
    if (activeNewsTab === 'Semua') return allArticles;
    return allArticles.filter(
      (a) => (a.category || '').toLowerCase() === activeNewsTab.toLowerCase()
    );
  }, [allArticles, activeNewsTab]);

  const displayedArticles = (
    filteredArticles.length > 0 ? filteredArticles : allArticles
  ).slice(0, 3);

  const mediaPosts = allArticles.slice(0, 4);

  return (
    <div className="theme-smp flex flex-col min-h-screen bg-white text-slate-800 w-full overflow-x-clip">
      {/* Top Navbar */}
      <Navbar
        schoolName="SMP IT Al-Afiyah"
        badgeText="Terakreditasi A • Be Smart & Religious"
        schoolSlug="smp"
        ppdbUrl={ppdbUrl}
        waPhone="6282249357893"
        transparentAtTop={true}
      />

      {/* =====================================================================
          1. FULL-WIDTH HERO BANNER (MINIMALIST AL-HIDAYAH / PRADITA STYLE)
      ===================================================================== */}
      <section className="relative w-full h-[calc(100svh-3rem)] sm:h-[600px] lg:h-[650px] bg-[#010030] overflow-hidden select-none">
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

        <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#020148]/90 via-[#030164]/80 to-[#020148]/75 pointer-events-none" />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#010030]/95 via-transparent to-black/30 pointer-events-none" />

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
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-sm bg-[#ffd51e] hover:bg-amber-300 text-[#030164] font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-lg"
              >
                <span>DAFTAR SPMB ONLINE</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                type="button"
                onClick={() => setIsPosterModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-sm bg-white/15 hover:bg-white/25 text-white border border-white/30 font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 backdrop-blur-xs cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#ffd51e]" />
                <span>BROSUR &amp; BIAYA</span>
              </button>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={prevSlide}
          aria-label="Gambar Sebelumnya"
          className="hidden sm:flex absolute left-2 sm:left-5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/35 hover:bg-[#030164] text-white border border-white/20 items-center justify-center transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <button
          type="button"
          onClick={nextSlide}
          aria-label="Gambar Selanjutnya"
          className="hidden sm:flex absolute right-2 sm:right-5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/35 hover:bg-[#030164] text-white border border-white/20 items-center justify-center transition-colors cursor-pointer"
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
                  ? 'w-8 bg-[#ffd51e]'
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
              <h2 className="text-[11px] sm:text-[13px] font-extrabold uppercase tracking-[0.06em] sm:tracking-[0.08em] text-[#030164] group-hover:text-blue-900 leading-snug sm:leading-relaxed whitespace-pre-line">
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
          backgroundImage: "url('/images/smp-haflah-aula.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-[#030164]/88" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8">
            <div className="lg:col-span-7 space-y-5 text-white">
              <p className="text-sm sm:text-base lg:text-[17px] leading-relaxed font-normal text-white/95 max-w-xl">
                SMP IT Al-Afiyah berkomitmen membimbing santri di fase remaja melalui keteladanan adab nabawiyah, hafalan Al-Qur&apos;an 3–5+ Juz mutqin, kemahiran Bahasa Arab aktif, serta pembinaan karakter kepemimpinan (Student Character Development) agar tumbuh menjadi generasi yang cerdas dan religius.
              </p>

              <div>
                <Link
                  href="/smp/profil"
                  className="inline-block px-4 py-1.5 rounded-full bg-[#e5a93b] hover:bg-[#d4962a] text-white font-bold text-xs transition-colors shadow-xs"
                >
                  Baca Lebih Lanjut
                </Link>
              </div>

              <div className="pt-1 space-y-2">
                <p className="text-xs sm:text-sm font-bold text-white">
                  Ust. Jaja Madhuri, S.Pd., M.Pd. — Kepala Sekolah SMP IT Al-Afiyah Majalengka
                </p>
                <div className="w-8 h-[2.5px] bg-[#ffd51e]" />
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
          backgroundImage: "url('/images/smp-kelas-literasi.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-white/90 backdrop-blur-[1px]" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8">
          <div className="max-w-lg space-y-5">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#030164] leading-[1.2] tracking-tight">
              Selamat Datang
              <br />
              di Sekolah Karakter, Tahfidz &amp; Bahasa Arab
              <br />
              SMP IT Al-Afiyah
            </h2>

            <p className="text-base sm:text-lg text-slate-800/90 leading-relaxed font-normal">
              Kapan lagi menyekolahkan ananda di SMP Islam Terpadu Terakreditasi A dengan bimbingan Tahfidz 3–5+ Juz, Bahasa Arab aktif, Mutaba&apos;ah Digital, serta promo Diskon Uang Bangunan hingga 70% di Gelombang 1?
            </p>

            <div className="pt-1 flex flex-wrap items-center gap-3">
              <Link
                href="/smp/profil"
                className="inline-block px-6 py-3 rounded-sm bg-[#e5a93b] hover:bg-[#030164] text-white font-extrabold text-xs uppercase tracking-wider transition-colors shadow-xs"
              >
                TEMUKAN JAWABANNYA
              </Link>
              <button
                type="button"
                onClick={() => setIsFeeModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-sm bg-[#030164] hover:bg-[#090580] text-white font-extrabold text-xs uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
              >
                <Calculator className="w-3.5 h-3.5 text-[#ffd51e]" />
                <span>SIMULASI &amp; RINCIAN BIAYA</span>
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
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#030164] tracking-tight">
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
                      ? 'border-[#030164] text-[#030164]'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* 3-Column Clean Article Teasers */}
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
                      src={article.coverImage || '/images/smp-kelulusan-angkatan-3.jpg'}
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

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-[#030164] transition-colors leading-snug line-clamp-2">
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
              href="/smp/berita"
              className="inline-block px-6 py-2.5 rounded-sm bg-[#030164] hover:bg-[#090580] text-white font-bold text-xs uppercase tracking-wider transition-colors"
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
              href="/smp/profil"
              className="md:col-span-3 group relative min-h-[220px] rounded-sm overflow-hidden flex items-center justify-center p-6 text-center"
            >
              <Image
                src="/images/smp-kelulusan-angkatan-3.jpg"
                alt="Terakreditasi A Resmi BAN-PDM"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 280px"
              />
              <div className="absolute inset-0 bg-[#030164]/80 group-hover:bg-[#090580]/80 transition-colors" />
              <h3 className="relative z-10 text-lg font-extrabold uppercase tracking-wide text-white leading-snug">
                TERAKREDITASI A RESMI
                <br />
                BAN-PDM
              </h3>
            </Link>

            <Link
              href="/smp/karakter"
              className="md:col-span-3 group relative min-h-[220px] rounded-sm overflow-hidden flex items-center justify-center p-6 text-center bg-[#030164]"
            >
              <h3 className="relative z-10 text-lg font-extrabold text-[#ffd51e] leading-snug">
                Be Smart &amp; Be Religious — Berakhlak Islami, Siap Berkompetisi
              </h3>
            </Link>

            <Link
              href="/smp/program"
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
                  src="/images/smp-logo.png"
                  alt="Logo SMP IT Al-Afiyah"
                  className="w-12 h-12 object-contain"
                />
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-[#030164] uppercase leading-snug">
                Tahfidz Al-Qur&apos;an 3 - 5+ Juz Mutqin
                <br />
                &amp; Bahasa Arab Aktif
              </h3>
            </Link>
          </div>

          {/* Bottom Row (25% | 50% | 25%) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <Link
              href="/smp/fasilitas"
              className="md:col-span-3 group relative min-h-[220px] rounded-sm overflow-hidden flex items-center justify-center p-6 text-center"
            >
              <Image
                src="/images/smp-kelas-literasi.jpg"
                alt="Kelas Ber-AC, Lab Komputer & Futsal"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 280px"
              />
              <div className="absolute inset-0 bg-black/60 group-hover:bg-[#030164]/75 transition-colors" />
              <h3 className="relative z-10 text-base sm:text-lg font-extrabold uppercase tracking-wide text-white leading-snug">
                KELAS BER-AC,
                <br />
                LAB KOMPUTER,
                <br />
                FUTSAL PROGRAM
              </h3>
            </Link>

            <Link
              href="/smp/fasilitas"
              className="md:col-span-6 group relative min-h-[220px] rounded-sm overflow-hidden flex items-center justify-center p-6 text-center"
            >
              <Image
                src="/images/smp-masjid-pusat-halaqah.jpg"
                alt="Masjid, Halaqah Tahfidz & Perpustakaan"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 560px"
              />
              <div className="absolute inset-0 bg-[#030164]/75 group-hover:bg-[#090580]/80 transition-colors" />
              <h3 className="relative z-10 text-lg sm:text-xl font-extrabold uppercase tracking-wide text-white leading-snug">
                MASJID &amp; PUSAT HALAQAH TAHFIDZ
                <br />
                AULA PERTEMUAN - PERPUSTAKAAN LITERASI
              </h3>
            </Link>

            <Link
              href="/smp/dokumentasi"
              className="md:col-span-3 group relative min-h-[220px] rounded-sm overflow-hidden flex items-center justify-center p-6 text-center"
            >
              <Image
                src="/images/smp-tubing-1.jpg"
                alt="Pramuka SIT & River Tubing"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 280px"
              />
              <div className="absolute inset-0 bg-black/60 group-hover:bg-[#030164]/75 transition-colors" />
              <h3 className="relative z-10 text-base sm:text-lg font-extrabold uppercase tracking-wide text-white leading-snug">
                PRAMUKA SIT
                <br />
                &amp; RIVER TUBING
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
          backgroundImage: "url('/images/smp-kelulusan-angkatan-3.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-[#030164]/88" />
        <div className="relative z-10 max-w-3xl mx-auto px-6 space-y-3">
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            FAQ SPMB
          </h2>
          <p className="text-sm sm:text-base text-slate-200">
            Temukan informasi lengkap pendaftaran murid baru &amp; diskon gelombang 1 di SMP IT Al-Afiyah Majalengka
          </p>
          <div className="pt-2 flex flex-col items-center gap-1">
            <ChevronDown className="w-6 h-6 text-[#ffd51e] animate-bounce" />
            <button
              type="button"
              onClick={() => setShowFaqBox((prev) => !prev)}
              className="text-sm sm:text-base font-extrabold uppercase tracking-widest text-white hover:text-[#ffd51e] transition-colors cursor-pointer"
            >
              KLIK DI SINI
            </button>
          </div>
        </div>
      </section>

      {showFaqBox && (
        <section className="py-12 sm:py-16 bg-[#f8fafc] border-b border-slate-200">
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
                        <Minus className="w-4 h-4 text-[#030164] shrink-0" />
                      ) : (
                        <Plus className="w-4 h-4 text-[#030164] shrink-0" />
                      )}
                      <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-[#030164]">
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
                className="px-6 py-3 rounded-sm bg-[#030164] hover:bg-[#090580] text-white font-extrabold text-xs uppercase tracking-wider transition-colors"
              >
                Daftar SPMB Online
              </Link>
              <button
                type="button"
                onClick={() => setIsFeeModalOpen(true)}
                className="px-6 py-3 rounded-sm bg-[#e5a93b] hover:bg-[#d4962a] text-white font-extrabold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Simulasi Biaya &amp; Diskon 70%
              </button>
              <Link
                href="/smp/spmb/cek-status"
                className="px-6 py-3 rounded-sm bg-white hover:bg-slate-100 text-[#030164] border border-slate-300 font-extrabold text-xs uppercase tracking-wider transition-colors"
              >
                Cek Status Seleksi
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          7A. #SMPITALAFIYAHMEDIA (LEFT) & ACARA-ACARA (RIGHT) — AL-HIDAYAH SPLIT
      ===================================================================== */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-start">
            {/* Left Column: #SMPITALAFIYAHMEDIA Compact Horizontal List */}
            <div className="lg:col-span-6 space-y-5">
              <p className="text-center text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-900">
                #SMPITALAFIYAHMEDIA
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
                        src={post.coverImage || '/images/smp-kelulusan-angkatan-3.jpg'}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <div className="space-y-1.5 min-w-0">
                      <h3 className="text-xs sm:text-[13.5px] font-bold text-slate-700 group-hover:text-[#030164] leading-snug line-clamp-2 transition-colors">
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
                  href="/smp/berita"
                  className="inline-block px-5 py-2 border border-slate-400 hover:border-slate-700 text-slate-700 hover:text-slate-950 text-xs font-medium rounded-xs transition-colors"
                >
                  Muat Lebih Banyak
                </Link>
              </div>
            </div>

            {/* Right Column: #AGENDASEKOLAH 3-Card Vertical Grid + Interactive Pagination */}
            <div className="lg:col-span-6 space-y-5">
              <p className="text-center text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-900">
                #AGENDASEKOLAH
              </p>

              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#030164] tracking-tight">
                  Acara-acara
                </h2>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <button
                    type="button"
                    onClick={() => setAgendaViewMode('grid')}
                    aria-label="Tampilan Grid"
                    className={`p-1.5 rounded-xs cursor-pointer transition-colors ${
                      agendaViewMode === 'grid'
                        ? 'bg-slate-100 text-[#030164]'
                        : 'hover:bg-slate-100 text-slate-400'
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setAgendaViewMode('list')}
                    aria-label="Tampilan Daftar"
                    className={`p-1.5 rounded-xs cursor-pointer transition-colors ${
                      agendaViewMode === 'list'
                        ? 'bg-slate-100 text-[#030164]'
                        : 'hover:bg-slate-100 text-slate-400'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {(() => {
                const EVENTS_PER_PAGE = 3;
                const totalAgendaPages = Math.ceil(UPCOMING_EVENTS.length / EVENTS_PER_PAGE);
                const currentAgendaEvents = UPCOMING_EVENTS.slice(
                  (agendaPage - 1) * EVENTS_PER_PAGE,
                  agendaPage * EVENTS_PER_PAGE
                );

                return (
                  <>
                    {agendaViewMode === 'grid' ? (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {currentAgendaEvents.map((ev, idx) => (
                          <Link
                            key={`${agendaPage}-${idx}`}
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
                                <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-[#030164] line-clamp-2 leading-snug transition-colors">
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
                    ) : (
                      <div className="space-y-3">
                        {currentAgendaEvents.map((ev, idx) => (
                          <Link
                            key={`${agendaPage}-list-${idx}`}
                            href={ev.href}
                            className="group bg-white border border-slate-200/90 p-3 shadow-xs hover:shadow-md transition-all flex items-center gap-4"
                          >
                            <div className="w-12 h-12 rounded-full bg-[#0284c7] text-white shadow-xs flex flex-col items-center justify-center leading-none shrink-0">
                              <span className="text-xs font-extrabold">{ev.day}</span>
                              <span className="text-[9px] uppercase font-semibold">
                                {ev.month}
                              </span>
                            </div>
                            <div className="min-w-0 flex-1 space-y-1">
                              <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 group-hover:text-[#030164] line-clamp-1 transition-colors">
                                {ev.title}
                              </h3>
                              <p className="text-[11px] text-slate-500 truncate">
                                {ev.dateTime} • {ev.location}
                              </p>
                            </div>
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-medium rounded-xs shrink-0">
                              {ev.tag}
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-center gap-1.5 pt-2">
                      {Array.from({ length: totalAgendaPages }, (_, i) => i + 1).map((pageNum) => {
                        const isActive = agendaPage === pageNum;
                        return (
                          <button
                            key={pageNum}
                            type="button"
                            onClick={() => setAgendaPage(pageNum)}
                            aria-label={`Slide Agenda ${pageNum}`}
                            className={`w-7 h-7 flex items-center justify-center rounded-xs text-xs font-bold transition-colors cursor-pointer ${
                              isActive
                                ? 'bg-[#0284c7] text-white shadow-2xs'
                                : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      <button
                        type="button"
                        onClick={() =>
                          setAgendaPage((prev) => (prev >= totalAgendaPages ? 1 : prev + 1))
                        }
                        aria-label="Slide Agenda Berikutnya"
                        className="w-7 h-7 flex items-center justify-center rounded-xs border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs cursor-pointer transition-colors"
                      >
                        →
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          7B. STRUKTUR KEPENGURUSAN & TENAGA PENDIDIK (AUTO-SLIDING ROW)
      ===================================================================== */}
      {displayTeachers.length > 0 && (
        <section id="dewan-guru" className="py-14 sm:py-16 bg-[#f8fafc] border-b border-slate-200/70 scroll-mt-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-[#030164] mb-1">
                  #STRUKTURPENDIDIK
                </p>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#030164] tracking-tight">
                  Struktur Kepengurusan &amp; Tenaga Pendidik SMP IT Al-Afiyah
                </h2>
              </div>
              <Link
                href="/smp/guru"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-[#030164] hover:bg-[#090580] text-white text-xs font-bold uppercase tracking-wider transition-colors self-start md:self-auto"
              >
                <Users className="w-4 h-4 text-[#ffd51e]" />
                <span>Lihat Struktur Lengkap</span>
              </Link>
            </div>

            <AutoHorizontalSlider itemClassName="w-[290px] sm:w-[340px] lg:w-[360px]">
              {displayTeachers.map((teacher) => {
                const department = getDepartmentByRole(teacher.role, teacher.specialization || '');
                return (
                  <div
                    key={teacher.id}
                    className="bg-white rounded-sm p-5 border border-slate-200/90 shadow-xs hover:border-[#030164] transition-all flex flex-col justify-between group h-full"
                  >
                    <div className="space-y-3.5">
                      <div className="bg-[#030164] text-white rounded-sm p-3.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#ffd51e] block">
                          {department}
                        </span>
                        <span className="text-xs sm:text-sm font-extrabold text-white mt-0.5 block leading-snug">
                          {teacher.role}
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <h3 className="text-base font-bold text-[#030164] leading-snug">
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
                      href="/smp/guru"
                      className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#030164] hover:text-blue-900"
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
          <h2 className="text-3xl sm:text-[42px] font-extrabold text-[#030164] text-center tracking-tight mb-10 lg:mb-0 lg:pt-4">
            Testimoni &amp; Suara Sekolah
          </h2>

          {/* Decorative Map Rings in open gaps */}
          <div className="hidden lg:block pointer-events-none">
            <span className="absolute top-[135px] left-[19%] w-3.5 h-3.5 rounded-full border-[3px] border-[#f5b82e]/75 bg-white" />
            <span className="absolute top-[185px] left-[22.5%] w-3.5 h-3.5 rounded-full border-[3px] border-[#f5b82e]/75 bg-white" />
            <span className="absolute top-[265px] left-[20%] w-3.5 h-3.5 rounded-full border-[3px] border-[#fb923c]/75 bg-white" />
            <span className="absolute top-[280px] left-[45.5%] w-4 h-4 rounded-full border-[3.5px] border-[#030164]/80 bg-white" />
            <span className="absolute top-[320px] left-[43%] w-3.5 h-3.5 rounded-full border-[3px] border-[#030164]/75 bg-white" />
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
                <p className="text-sm sm:text-[15px] font-semibold text-slate-900 leading-relaxed">
                  {t.quote}
                </p>

                <div className="flex items-center justify-center gap-3.5 text-left pt-1">
                  <FacelessIslamicAvatar
                    name={t.name}
                    role={t.role}
                    unit="smp"
                    className="w-[48px] h-[48px]"
                  />
                  <div className="leading-tight">
                    <p className="text-sm text-[#030164] font-bold">
                      {t.name}
                    </p>
                    <p className="text-xs font-extrabold text-amber-600 mt-0.5">
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
      <section className="py-10 bg-[#030164] text-white border-t border-blue-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left max-w-2xl">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#ffd51e]">
              Program Affiliate Wali Murid SMP IT Al-Afiyah
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              Syiar Kebaikan Sekolah &amp; Raih Apresiasi <span className="text-[#ffd51e]">Rp 150.000 / Murid</span>
            </h3>
            <p className="text-xs sm:text-sm text-blue-100/90">
              Daftar gratis, bagikan link rekomendasi unik Anda, dan dapatkan komisi Rp 50.000 (formulir) + Rp 100.000 (daftar ulang).
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <Link
              href="/affiliate/register?unit=smp"
              className="px-6 py-3 rounded-sm bg-[#ffd51e] hover:bg-amber-300 text-[#030164] font-extrabold text-xs uppercase tracking-wider transition-colors"
            >
              Daftar Affiliate (Gratis)
            </Link>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(
                `Assalamu'alaikum Ayah & Bunda Wali Murid SMP IT Al-Afiyah 🌿\n\nYuk ikut menebar syiar kebaikan pendidikan melalui *Program Affiliate Resmi Wali Murid SMP IT Al-Afiyah* (SPMB T.A. 2027/2028)!\n\n💰 Total Apresiasi Rp 150.000 / murid langsung cair ke rekening Ayah/Bunda.\n\nDaftar gratis di sini:\n👉 https://smpit.alafiyah.id/affiliate/register?unit=smp`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-sm bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-[#ffd51e]" />
              <span>Share ke WA</span>
            </a>
          </div>
        </div>
      </section>

      <CampusLocationMapSection unitSlug="smp" />

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
                  url: selectedNews.coverImage || '/images/smp-kelulusan-angkatan-3.jpg',
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
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#030164]">
                    {selectedNews.category}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900">
                    SMP IT Al-Afiyah
                  </span>
                  {slides.length > 1 && (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-[#030164]">
                      Slide {selectedNewsSlideIndex + 1} dari {slides.length}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedNews(null)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs transition-colors shadow-sm cursor-pointer"
                >
                  <X className="w-4 h-4 text-[#ffd51e]" />
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
                          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/70 hover:bg-[#030164] text-white border border-white/20 flex items-center justify-center shadow-xl transition-all cursor-pointer"
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
                          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/70 hover:bg-[#030164] text-white border border-white/20 flex items-center justify-center shadow-xl transition-all cursor-pointer"
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
                              ? 'border-[#ffd51e] ring-2 ring-[#ffd51e]/40 scale-105'
                              : 'border-white/20 opacity-60 hover:opacity-100'
                          }`}
                        >
                          {media.type === 'video' ? (
                            <div className="relative w-full h-full bg-slate-800 flex flex-col items-center justify-center text-white">
                              <Film className="relative z-10 w-4 h-4 text-[#ffd51e]" />
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
                        <User className="w-3.5 h-3.5 text-[#030164]" />
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
          MODAL 2: LIGHTBOX BROSUR & BIAYA SPMB SMP IT
      ===================================================================== */}
      {isPosterModalOpen && (
        <div
          onClick={() => setIsPosterModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl w-full max-h-[92vh] bg-white rounded-sm overflow-hidden p-4 sm:p-6 flex flex-col justify-between cursor-default"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2 flex-wrap">
                {SPMB_POSTERS.map((p) => (
                  <button
                    key={p.src}
                    type="button"
                    onClick={() => setActivePoster(p)}
                    className={`px-3 py-1.5 rounded-xs text-xs font-bold transition-colors cursor-pointer ${
                      activePoster.src === p.src
                        ? 'bg-[#030164] text-[#ffd51e]'
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

            <div className="flex-1 overflow-auto my-3 max-h-[70vh] flex items-center justify-center bg-slate-50 rounded-sm p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activePoster.src}
                alt={activePoster.label}
                className="max-h-[68vh] w-auto object-contain"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <Link
                  href={ppdbUrl}
                  className="px-4 py-2 rounded-sm bg-[#030164] hover:bg-[#090580] text-[#ffd51e] text-xs font-bold uppercase tracking-wider"
                >
                  Daftar SPMB Online
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setIsPosterModalOpen(false);
                    setIsFeeModalOpen(true);
                  }}
                  className="px-3.5 py-2 rounded-sm bg-slate-100 hover:bg-slate-200 text-[#030164] text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Simulasi Biaya
                </button>
              </div>
              <a
                href={activePoster.src}
                download={activePoster.file}
                className="px-4 py-2 rounded-sm bg-[#e5a93b] hover:bg-[#d4962a] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Brosur</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 3: SIMULASI & TABEL BIAYA SPMB SMP IT (IKHWAN/AKHWAT & DISKON 70%)
      ===================================================================== */}
      {isFeeModalOpen && (
        <div
          onClick={() => setIsFeeModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl w-full max-h-[92vh] bg-white rounded-sm overflow-hidden flex flex-col justify-between cursor-default border border-slate-200 shadow-2xl"
          >
            {/* Header */}
            <div className="bg-[#030164] text-white px-5 py-4 border-b-4 border-[#ffd51e] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#ffd51e] block">
                  SPMB SMP IT Al-Afiyah T.A. 2027/2028
                </span>
                <h3 className="text-base sm:text-lg font-extrabold">
                  Rincian Biaya &amp; Simulasi Diskon Gelombang 1
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsFeeModalOpen(false)}
                className="w-8 h-8 rounded-xs bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Gender Toggle */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-[#FAF6EC] border border-[#E5D5B2] p-3.5 rounded-sm">
                <span className="text-xs font-extrabold text-[#030164] uppercase tracking-wider">
                  Pilih Kategori Santri:
                </span>
                <div className="inline-flex bg-white border border-slate-200 p-1 rounded-xs">
                  <button
                    type="button"
                    onClick={() => setActiveGender('ikhwan')}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-xs transition-colors cursor-pointer ${
                      activeGender === 'ikhwan'
                        ? 'bg-[#030164] text-[#ffd51e]'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Santri Ikhwan (Putra)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveGender('akhwat')}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-xs transition-colors cursor-pointer ${
                      activeGender === 'akhwat'
                        ? 'bg-[#030164] text-[#ffd51e]'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Santri Akhwat (Putri)
                  </button>
                </div>
              </div>

              {/* Clean Cost Table */}
              <div className="border border-slate-200 overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700">
                    <tr>
                      <th className="py-2.5 px-3.5 font-bold">Komponen Biaya</th>
                      <th className="py-2.5 px-3.5 font-bold text-right">
                        Nominal ({activeGender === 'ikhwan' ? 'Putra' : 'Putri'})
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {BIAYA_ITEMS.map((b, idx) => {
                      const val = activeGender === 'ikhwan' ? b.ikhwan : b.akhwat;
                      return (
                        <tr key={idx} className="hover:bg-slate-50/70">
                          <td className="py-2.5 px-3.5">
                            <span className="font-bold text-slate-900 block">
                              {idx + 1}. {b.item}
                            </span>
                            <span className="text-[11px] text-slate-500">{b.note}</span>
                          </td>
                          <td className="py-2.5 px-3.5 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                            Rp {val.toLocaleString('id-ID')}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* 3 Total Comparison Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-sm bg-[#030164] text-white border-l-4 border-[#ffd51e]">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#ffd51e] block">
                    Gel. 1 • Diskon 70% (Alumni SDIT)
                  </span>
                  <p className="text-lg font-black font-mono text-white mt-1">
                    Rp {sditDiscountTotal.toLocaleString('id-ID')}
                  </p>
                  <span className="text-[10px] text-blue-200">Hemat Rp 1.750.000</span>
                </div>

                <div className="p-3.5 rounded-sm bg-[#FAF6EC] border border-[#E5D5B2] text-[#030164]">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 block">
                    Gel. 1 • Diskon 50% (Umum)
                  </span>
                  <p className="text-lg font-black font-mono text-[#030164] mt-1">
                    Rp {umumDiscountTotal.toLocaleString('id-ID')}
                  </p>
                  <span className="text-[10px] text-slate-600">Hemat Rp 1.250.000</span>
                </div>

                <div className="p-3.5 rounded-sm bg-slate-100 border border-slate-200 text-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    Gel. 2 • Tarif Normal
                  </span>
                  <p className="text-lg font-bold font-mono text-slate-900 mt-1">
                    Rp {normalTotal.toLocaleString('id-ID')}
                  </p>
                  <span className="text-[10px] text-slate-500">1 Mar – 30 Jun 2027</span>
                </div>
              </div>

              {/* Official Bank Info */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block text-[11px]">
                    Rekening Resmi Pendaftaran (Infaq Formulir Rp 200.000):
                  </span>
                  <strong className="text-[#030164] font-extrabold">
                    Bank Muamalat 1360012405 a.n. SMP IT Al Afiyah
                  </strong>
                </div>
                <button
                  type="button"
                  onClick={handleCopyAccount}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xs bg-white border border-slate-300 hover:border-[#030164] text-[#030164] font-bold text-xs cursor-pointer self-start sm:self-auto"
                >
                  {copiedBank ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin No. Rek</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <Link
                href="/smp/spmb"
                className="text-xs font-bold text-[#030164] hover:underline"
              >
                Lihat Halaman Lengkap SPMB →
              </Link>
              <Link
                href={ppdbUrl}
                className="px-5 py-2 rounded-sm bg-[#030164] hover:bg-[#090580] text-[#ffd51e] text-xs font-extrabold uppercase tracking-wider"
              >
                Isi Formulir SPMB Online
              </Link>
            </div>
          </div>
        </div>
      )}

      <Footer schoolSlug="smp" />
      <StickyMobileBar
        schoolSlug="smp"
        waPhone="6282249357893"
        schoolName="SMP IT Al-Afiyah"
      />
    </div>
  );
}
