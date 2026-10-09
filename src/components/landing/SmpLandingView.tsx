'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyMobileBar from '@/components/layout/StickyMobileBar';
import CampusLocationMapSection from './CampusLocationMapSection';
import ScrollReveal from './ScrollReveal';
import UnitHeroSlider from './UnitHeroSlider';
import Hero3DStatCards from './Hero3DStatCards';
import { 
  ArrowRight, 
  MessageCircle, 
  CheckCircle2, 
  ShieldCheck, 
  Award, 
  Calendar, 
  Download, 
  ZoomIn, 
  FileText, 
  Copy, 
  Check, 
  Percent, 
  Tag, 
  CreditCard, 
  MapPin,
  ChevronDown,
  Sparkles,
  Trophy,
  BookOpen,
  Languages,
  Smartphone,
  Users,
  Compass,
  X,
  ExternalLink
} from 'lucide-react';
import { getStoredReferralCode } from '@/lib/referral';
import type { TeacherData, NewsData, FacilityItem } from './SchoolLandingTemplate';

export interface SmpLandingViewProps {
  teachers?: TeacherData[];
  newsPosts?: NewsData[];
}

const SMP_POSTERS = [
  { src: '/images/smp-spmb-poster.png', label: 'Poster Resmi SPMB', file: 'Poster-Resmi-SPMB-SMP-IT-Al-Afiyah-2027-2028.png', width: 800, height: 1000 },
  { src: '/images/smp-spmb-biaya.png', label: 'Biaya Pendidikan & Diskon', file: 'Poster-Biaya-Pendidikan-SMP-IT-Al-Afiyah-2027-2028.png', width: 800, height: 1000 },
  { src: '/images/smp-program-unggulan.png', label: 'Program Unggulan & Fasilitas', file: 'Poster-Program-Unggulan-SMP-IT-Al-Afiyah-2027-2028.png', width: 800, height: 1000 },
];

const SMP_PROGRAMS = [
  {
    number: '01',
    title: 'Tahfidz 3 - 5+ Juz Mutqin',
    category: 'Al-Qur\'an',
    desc: 'Bimbingan talaqqi tartil dengan target minimal 3 juz dasar (Juz 28, 29, 30) serta kelas tahfidz unggulan 5 juz atau lebih dengan sertifikasi tasmi\' sekali duduk.',
    href: '/smp/program',
    icon: BookOpen,
  },
  {
    number: '02',
    title: 'Fasih Berbahasa Arab',
    category: 'Bahasa Asing',
    desc: 'Pembiasaan lingkungan berbahasa (Bi\'ah Lughawiyyah) melalui muhadatsah harian, penguasaan kosa kata praktis, dan khitabah pidato bahasa Arab aktif.',
    href: '/smp/program',
    icon: Languages,
  },
  {
    number: '03',
    title: 'SCD (Student Character Development)',
    category: 'Karakter & Adab',
    desc: 'Penempaan kepemimpinan murid, adab nabawi, kemandirian aqil-baligh, serta kedisiplinan dan tanggung jawab sosial melalui pembinaan intensif.',
    href: '/smp/karakter',
    icon: ShieldCheck,
  },
  {
    number: '04',
    title: 'Mutaba\'ah Digital Terintegrasi',
    category: 'Teknologi Edukasi',
    desc: 'Sistem monitoring ibadah harian murid (shalat 5 waktu, tilawah harian, shalat dhuha & tahajjud) berbasis aplikasi yang menghubungkan murid, orang tua, dan guru.',
    href: '/smp/program',
    icon: Smartphone,
  },
  {
    number: '05',
    title: 'Futsal Development Program',
    category: 'Olahraga Prestasi',
    desc: 'Program pembinaan bakat olahraga futsal terarah dengan pelatih berpengalaman, latihan taktik, fisik terprogram, dan keikutsertaan turnamen resmi.',
    href: '/smp/program',
    icon: Trophy,
  },
  {
    number: '06',
    title: 'Ekstrakurikuler Pilihan Beragam',
    category: 'Bakat & Minat',
    desc: 'Wadah eksplorasi potensi murid: Pramuka SIT, Tata Boga (Cooking Class), Panahan, Kaligrafi, dan English Club untuk bekal kecakapan hidup modern.',
    href: '/smp/program',
    icon: Sparkles,
  },
];

const SMP_FACILITIES = [
  {
    title: 'Ruang Kelas Ber-AC & Nyaman',
    category: 'Ruang Belajar',
    image: '/images/smp-hero-fullday.jpg',
    desc: 'Ruang kelas kondusif dengan pendingin udara (AC), proyektor multimedia, pencahayaan alami optimal, dan penataan ergonomis.',
  },
  {
    title: 'Laboratorium Komputer & CBT',
    category: 'Teknologi',
    image: '/images/smp-hero-bilingual.jpg',
    desc: 'Fasilitas komputer modern dengan koneksi internet fiber optik untuk pembelajaran literasi sains, informatika, dan tes CBT.',
  },
  {
    title: 'Lapangan Olahraga & Futsal',
    category: 'Olahraga',
    image: '/images/smp-hero-pesantren.jpg',
    desc: 'Sarana olahraga representatif untuk latihan Futsal Development Program, bola voli, senam pagi, dan turnamen internal murid.',
  },
  {
    title: 'Masjid & Sarana Ibadah Sekolah',
    category: 'Pusat Ibadah',
    image: '/images/smp-outing-3.jpg',
    desc: 'Pusat pembinaan shalat fardhu berjamaah, dzikir Al-Ma\'tsurat pagi petang, dan halaqah talaqqi tahfidz murid.',
  },
  {
    title: 'Outing Class & Tadabbur Alam',
    category: 'Eksplorasi Murid',
    image: '/images/smp-tubing-1.jpg',
    desc: 'Kegiatan edukasi luar kelas, eksplorasi alam terbuka, dan river tubing untuk melatih keberanian, kerjasama tim, dan tadabbur ciptaan Allah.',
  },
  {
    title: 'Akses Internet & Mutaba\'ah Digital',
    category: 'Sistem Terpadu',
    image: '/images/smp-tubing-2.jpg',
    desc: 'Infrastruktur digital sekolah yang mendukung absensi presensi digital murid dan integrasi laporan ibadah harian kepada wali murid.',
  },
];

const SMP_FAQS = [
  {
    q: 'Kapan pendaftaran SPMB SMP IT Al-Afiyah dibuka?',
    a: 'SPMB SMP IT Al-Afiyah dibuka dalam 2 gelombang: Gelombang 1 (1 Oktober 2026 – 28 Februari 2027) dengan diskon Uang Bangunan hingga 70%, dan Gelombang 2 (1 Maret 2027 – 30 Juni 2027) tanpa diskon.',
  },
  {
    q: 'Berapa besaran diskon Uang Bangunan di Gelombang 1?',
    a: 'Di Gelombang 1, pendaftar lulusan SDIT Al-Afiyah mendapatkan Diskon 70% Uang Bangunan (hemat Rp 1.750.000). Sedangkan pendaftar dari sekolah luar SDIT/Umum mendapatkan Diskon 50% Uang Bangunan (hemat Rp 1.250.000).',
  },
  {
    q: 'Apakah SMP IT Al-Afiyah sudah terakreditasi resmi?',
    a: 'Ya, SMP IT Al-Afiyah telah Terakreditasi A Resmi oleh BAN-S/M dengan predikat Unggul.',
  },
  {
    q: 'Apa saja program unggulan khusus di SMP IT Al-Afiyah?',
    a: 'Program unggulan kami meliputi: Tahfidz Al-Qur\'an 3 – 5+ Juz Mutqin, Fasih Berbahasa Arab (lisan & tulisan), SCD (Student Character Development), Mutaba\'ah Digital terintegrasi, dan Futsal Development Program.',
  },
  {
    q: 'Bagaimana alur pendaftaran dan rekening pembayaran resmi?',
    a: 'Orang tua dapat mengisi formulir online yang ringkas melalui menu pendaftaran online website ini atau datang langsung ke sekolah di Lingkungan Giri Asih (Jl. Gerakan Koperasi No. 110, Majalengka Wetan). Infaq formulir sebesar Rp 200.000 ditransfer ke Bank Muamalat No. Rek 1360012405 a.n SMP IT Al Afiyah.',
  },
];

export default function SmpLandingView({ teachers = [], newsPosts = [] }: SmpLandingViewProps) {
  const [activePoster, setActivePoster] = useState(SMP_POSTERS[0]);
  const [isPosterModalOpen, setIsPosterModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [smpGender, setSmpGender] = useState<'ikhwan' | 'akhwat'>('ikhwan');
  const [smpDiscountType, setSmpDiscountType] = useState<'sdit' | 'umum' | 'normal'>('sdit');
  const [copiedBank, setCopiedBank] = useState(false);
  const [refCode, setRefCode] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    setRefCode(getStoredReferralCode());
  }, []);

  let ppdbUrl = '/smp/spmb/daftar';
  if (refCode) {
    ppdbUrl += `?ref=${encodeURIComponent(refCode)}`;
  }

  const handleCopyAccount = (num: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(num);
      setCopiedBank(true);
      setTimeout(() => setCopiedBank(false), 2200);
    }
  };

  // Fee calculation
  const baseBangunan = 2500000;
  const discountBangunan = smpDiscountType === 'sdit' ? 1750000 : smpDiscountType === 'umum' ? 1250000 : 0;
  const finalBangunan = baseBangunan - discountBangunan;
  const seragamFee = smpGender === 'ikhwan' ? 1100000 : 1400000;
  const sppFee = 300000;
  const baseTotal = 200000 + baseBangunan + 500000 + seragamFee + 1000000 + 1700000 + sppFee;
  const finalTotal = baseTotal - discountBangunan;

  const displayStats = [
    { 
      label: 'Akreditasi Lembaga', 
      value: 'Terakreditasi A', 
      subtext: 'BAN-S/M Unggul Resmi',
      iconType: 'award' as const,
      badge: 'Akreditasi A',
      color: 'blue' as const,
    },
    { 
      label: 'Target Tahfidz', 
      value: '3 – 5+ Juz', 
      subtext: 'Juz 28, 29, 30 & Unggulan',
      iconType: 'quran' as const,
      badge: 'Tahfidz Mutqin',
      color: 'blue' as const,
    },
    { 
      label: 'Diskon Gelombang 1', 
      value: 's.d. 70%', 
      subtext: 'Uang Bangunan 1 Okt - 28 Feb',
      iconType: 'compass' as const,
      badge: 'SPMB Gel. 1',
      color: 'amber' as const,
    },
    { 
      label: 'Tagline & Prestasi', 
      value: 'Smart & Religious', 
      subtext: 'Bahasa Arab & Futsal Program',
      iconType: 'users' as const,
      badge: 'Be Smart',
      color: 'blue' as const,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-[#ffd51e] selection:text-[#030164] overflow-x-clip">
      {/* Top Navbar */}
      <Navbar
        schoolName="SMP IT Al-Afiyah"
        badgeText="TERAKREDITASI A • SMP ISLAM TERPADU AL-AFIYAH"
        schoolSlug="smp"
        ppdbUrl={ppdbUrl}
        waPhone="6282249357893"
        transparentAtTop={true}
      />

      {/* Unit Hero Slider with Ken Burns Effect */}
      <UnitHeroSlider
        slug="smp"
        schoolName="SMP IT Al-Afiyah"
        badgeText="TERAKREDITASI A • BE SMART & RELIGIOUS"
        registrationFee={200000}
        waCenterPhone="6282249357893"
        statsCards={<Hero3DStatCards stats={displayStats} unitSlug="smp" />}
      />

      {/* Quick Action Strip (Deep Navy with Gold Accent) */}
      <section className="bg-[#030164] text-white border-y border-[#ffd51e]/30 py-4 sm:py-5 shadow-lg relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center md:text-left">
            <span className="w-3 h-3 rounded-full bg-[#ffd51e] animate-ping shrink-0 hidden sm:inline-block" />
            <div>
              <p className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2 justify-center md:justify-start">
                <span className="text-[#ffd51e]">SPMB T.A. 2027/2028 Gelombang 1 Sedang Dibuka!</span>
              </p>
              <p className="text-xs text-slate-300">
                Diskon Uang Bangunan 70% (SDIT Al-Afiyah) &amp; 50% (Pendaftar Umum) s.d. 28 Februari 2027
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              href={ppdbUrl}
              className="px-5 py-2.5 rounded-xl bg-[#ffd51e] text-[#030164] font-black text-xs uppercase tracking-wider hover:bg-yellow-400 transition-all shadow-md active:scale-95 inline-flex items-center gap-1.5"
            >
              <span>Daftar Online</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://wa.me/6282249357893?text=Assalamu%27alaikum%20Panitia%20SPMB%20SMP%20IT%20Al-Afiyah,%20saya%20ingin%20konsultasi%20pendaftaran"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all inline-flex items-center gap-1.5"
            >
              <MessageCircle className="w-4 h-4 text-[#ffd51e]" />
              <span>Tanya Admin WA</span>
            </a>
          </div>
        </div>
      </section>

      {/* SECTION 1: SPMB 2027/2028 - BIAYA & SIMULATOR DISKON */}
      <section id="spmb" className="py-16 sm:py-20 bg-white border-b border-slate-200 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal yOffset={24} duration={500} className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#030164]/10 border border-[#030164]/20 text-[#030164] text-xs font-black tracking-wider uppercase mb-3">
              <Tag className="w-3.5 h-3.5 text-[#030164]" />
              <span>SISTEM PENERIMAAN MURID BARU T.A. 2027/2028</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-snug">
              Informasi Gelombang &amp; Rincian Investasi Pendidikan
            </h2>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Membentuk generasi <em>Be Smart &amp; Religious</em>. Dapatkan keringanan investasi pendidikan hingga 70% khusus pada Gelombang 1.
            </p>
          </ScrollReveal>

          {/* Banner Gelombang 1 & 2 Cards */}
          <ScrollReveal delay={0.1} yOffset={24} duration={500} className="mb-10">
            <div className="bg-gradient-to-br from-[#030164] via-[#080554] to-[#01002e] rounded-3xl border border-[#ffd51e]/40 p-6 sm:p-8 lg:p-10 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#ffd51e]/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/15">
                <div>
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-[#ffd51e] text-[#030164] mb-3">
                    <Award className="w-3.5 h-3.5" />
                    <span>SMP IT AL-AFIYAH • TERAKREDITASI A RESMI</span>
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    Jadwal &amp; Ketentuan Gelombang SPMB
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                    Segera daftarkan ananda di Gelombang 1 untuk mengamankan kuota kelas terbatas dan potongan uang bangunan maksimal.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-xs font-bold text-white">
                    Infaq Formulir: Rp 200.000
                  </span>
                  <span className="px-4 py-2 rounded-xl bg-[#ffd51e]/20 border border-[#ffd51e]/50 text-xs font-black text-[#ffd51e]">
                    Bank Muamalat: 1360012405
                  </span>
                </div>
              </div>

              {/* Grid Gelombang 1 vs 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-6 relative z-10">
                {/* Gelombang 1 */}
                <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border-2 border-[#ffd51e] shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-[#ffd51e] text-[#030164] text-[10px] font-black uppercase tracking-wider px-3.5 py-1 rounded-bl-xl flex items-center gap-1 shadow-sm">
                    <Check className="w-3 h-3 stroke-[3]" />
                    <span>SEDANG DIBUKA</span>
                  </div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ffd51e] animate-pulse" />
                    <h4 className="text-lg font-black text-white">SPMB Gelombang 1</h4>
                  </div>
                  <p className="text-xs font-bold text-[#ffd51e] bg-black/40 inline-block px-3 py-1 rounded-lg border border-[#ffd51e]/30 mb-4">
                    📅 1 Oktober 2026 – 28 Februari 2027
                  </p>

                  <div className="space-y-3 pt-3 border-t border-white/15">
                    <div className="p-3 rounded-xl bg-white/10 border border-[#ffd51e]/40">
                      <p className="text-xs font-black text-[#ffd51e] uppercase tracking-wider">
                        DISKON 70% UANG BANGUNAN*
                      </p>
                      <p className="text-xs text-white font-medium mt-0.5">
                        Khusus untuk murid lulusan SDIT Al Afiyah (Hemat Rp 1.750.000)
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-white/10 border border-white/20">
                      <p className="text-xs font-black text-amber-300 uppercase tracking-wider">
                        DISKON 50% UANG BANGUNAN**
                      </p>
                      <p className="text-xs text-white font-medium mt-0.5">
                        Untuk murid pendaftar dari luar SDIT / Umum (Hemat Rp 1.250.000)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Gelombang 2 */}
                <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/20 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <h4 className="text-lg font-bold text-white">SPMB Gelombang 2</h4>
                      <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-white/15 text-slate-300">
                        Tahap Lanjutan
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-medium mb-4">
                      📅 1 Maret 2027 – 30 Juni 2027
                    </p>
                    <div className="p-4 rounded-xl bg-black/30 text-slate-300 text-xs border border-white/10 flex items-center justify-between">
                      <span>Ketentuan Diskon:</span>
                      <strong className="text-white font-black text-sm">Biaya Normal (No Diskon)</strong>
                    </div>
                  </div>
                  <div className="mt-6 pt-3 border-t border-white/10 text-xs text-slate-300 leading-relaxed">
                    💡 <em>Sangat disarankan mendaftar di Gelombang 1 untuk memastikan ketersediaan kuota rombel dan memperoleh keringanan biaya pendidikan terbaik.</em>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Interactive Fee Simulator & Breakdown */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 lg:p-10 mb-12">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-6 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold text-[#030164] uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-200 inline-flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-[#030164]" />
                  <span>Simulasi Transparansi Biaya</span>
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-2">
                  Tabel Rincian Biaya Masuk &amp; Kalkulator Diskon
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Transparansi penuh biaya pendidikan SMP IT Al-Afiyah T.A. 2027/2028 resmi yayasan tanpa biaya tersembunyi.
                </p>
              </div>

              {/* Gender Switch (Clean Text Only, No Emojis) */}
              <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 self-start lg:self-auto">
                <button
                  type="button"
                  onClick={() => setSmpGender('ikhwan')}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    smpGender === 'ikhwan'
                      ? 'bg-[#030164] text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Murid Ikhwan (Putra)
                </button>
                <button
                  type="button"
                  onClick={() => setSmpGender('akhwat')}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    smpGender === 'akhwat'
                      ? 'bg-[#030164] text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Murid Akhwat (Putri)
                </button>
              </div>
            </div>

            {/* Discount Category Selector */}
            <div className="mt-6">
              <label className="text-xs font-bold text-slate-700 block mb-2 uppercase tracking-wider">
                Pilih Kategori Pendaftar (Simulasi Diskon):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setSmpDiscountType('sdit')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    smpDiscountType === 'sdit'
                      ? 'bg-blue-50/90 border-[#030164] shadow-sm ring-2 ring-[#030164]/20'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-black text-[#030164]">Alumni SDIT Al Afiyah</span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#030164] text-[#ffd51e]">
                      Diskon 70%
                    </span>
                  </div>
                  <p className="text-xs text-blue-900 font-semibold">Hemat Rp 1.750.000 Uang Bangunan</p>
                </button>

                <button
                  type="button"
                  onClick={() => setSmpDiscountType('umum')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    smpDiscountType === 'umum'
                      ? 'bg-amber-50/90 border-amber-500 shadow-sm ring-2 ring-amber-500/20'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-black text-amber-950">Pendaftar Luar SDIT / Umum</span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500 text-slate-950">
                      Diskon 50%
                    </span>
                  </div>
                  <p className="text-xs text-amber-900 font-semibold">Hemat Rp 1.250.000 Uang Bangunan</p>
                </button>

                <button
                  type="button"
                  onClick={() => setSmpDiscountType('normal')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    smpDiscountType === 'normal'
                      ? 'bg-slate-200 border-slate-600 shadow-sm ring-2 ring-slate-400'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-800">Biaya Normal (Gelombang 2)</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-300 text-slate-800">
                      No Diskon
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">Tarif standar tanpa potongan gelombang</p>
                </button>
              </div>
            </div>

            {/* Table Breakdown */}
            <div className="mt-6 border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              <div className="divide-y divide-slate-100 text-xs sm:text-sm">
                <div className="flex items-center justify-between p-3.5 sm:px-5 bg-slate-50">
                  <span className="font-semibold text-slate-800">1. Infaq Formulir Pendaftaran</span>
                  <span className="font-mono font-bold text-slate-900">Rp 200.000</span>
                </div>
                
                <div className="flex items-center justify-between p-3.5 sm:px-5 bg-white">
                  <div>
                    <span className="font-semibold text-slate-800">2. Infaq Pengembangan Sarana (Uang Bangunan)</span>
                    {discountBangunan > 0 && (
                      <span className="block text-[11px] text-[#030164] font-bold">
                        Potongan {smpDiscountType === 'sdit' ? '70% (SDIT Al-Afiyah)' : '50% (Pendaftar Umum)'}: -Rp {discountBangunan.toLocaleString('id-ID')}
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    {discountBangunan > 0 && (
                      <span className="line-through text-slate-400 text-xs mr-2 font-mono">
                        Rp {baseBangunan.toLocaleString('id-ID')}
                      </span>
                    )}
                    <span className="font-mono font-bold text-[#030164]">
                      Rp {finalBangunan.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3.5 sm:px-5 bg-slate-50">
                  <span className="font-semibold text-slate-800">3. Fasilitas Pembelajaran Modern</span>
                  <span className="font-mono font-bold text-slate-900">Rp 500.000</span>
                </div>

                <div className="flex items-center justify-between p-3.5 sm:px-5 bg-white">
                  <span className="font-semibold text-slate-800">
                    4. Paket Seragam Sekolah Lengkap ({smpGender === 'ikhwan' ? 'Ikhwan' : 'Akhwat Syar\'i'})
                  </span>
                  <span className="font-mono font-bold text-slate-900">
                    Rp {seragamFee.toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3.5 sm:px-5 bg-slate-50">
                  <span className="font-semibold text-slate-800">5. Paket Buku Pelajaran &amp; Modul</span>
                  <span className="font-mono font-bold text-slate-900">Rp 1.000.000</span>
                </div>

                <div className="flex items-center justify-between p-3.5 sm:px-5 bg-white">
                  <span className="font-semibold text-slate-800">6. Program Kegiatan Murid (SCD, Outing, Mutaba&apos;ah)</span>
                  <span className="font-mono font-bold text-slate-900">Rp 1.700.000</span>
                </div>

                <div className="flex items-center justify-between p-3.5 sm:px-5 bg-slate-50">
                  <span className="font-semibold text-slate-800">7. SPP Pendidikan (Bulan Pertama)</span>
                  <span className="font-mono font-bold text-slate-900">Rp {sppFee.toLocaleString('id-ID')}</span>
                </div>

                {/* Grand Total Bar */}
                <div className="flex items-center justify-between p-4 sm:p-6 bg-gradient-to-r from-[#030164] to-[#0d077e] text-white">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-[#ffd51e] font-black block">
                      Total Biaya Pendidikan ({smpGender === 'ikhwan' ? 'Murid Ikhwan' : 'Murid Akhwat'})
                    </span>
                    <span className="text-xs text-slate-300">
                      {discountBangunan > 0 ? `Hemat Rp ${discountBangunan.toLocaleString('id-ID')} pada Gelombang 1` : 'Tarif Biaya Normal Gelombang 2'}
                    </span>
                  </div>
                  <div className="text-right">
                    {discountBangunan > 0 && (
                      <span className="text-xs line-through text-slate-400 font-mono block">
                        Rp {baseTotal.toLocaleString('id-ID')}
                      </span>
                    )}
                    <span className="text-2xl sm:text-3xl font-black font-mono text-[#ffd51e]">
                      Rp {finalTotal.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Official Posters & Bank Payment Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Official Posters */}
            <div className="lg:col-span-6 bg-slate-50 rounded-3xl border border-slate-200 p-6 sm:p-7 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#030164] uppercase tracking-wider block">
                    Dokumen Brosur Resmi
                  </span>
                  <h4 className="text-base font-black text-slate-900 mt-0.5">
                    Materi Publikasi SPMB SMP IT
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPosterModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-[#030164] hover:bg-slate-100 transition-all flex items-center gap-1 shadow-2xs cursor-pointer"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>Perbesar</span>
                </button>
              </div>

              {/* Poster Preview Frame */}
              <div
                onClick={() => setIsPosterModalOpen(true)}
                className="group relative rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm cursor-pointer aspect-[4/5] flex items-center justify-center p-2"
              >
                <img
                  src={activePoster.src}
                  alt={activePoster.label}
                  className="w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-2xs">
                  <span className="px-4 py-2 rounded-xl bg-white/95 text-[#030164] text-xs font-black shadow-lg flex items-center gap-2">
                    <ZoomIn className="w-4 h-4 text-[#030164]" />
                    <span>Lihat Brosur Ukuran Penuh</span>
                  </span>
                </div>
              </div>

              {/* Poster Switcher Tabs */}
              <div className="grid grid-cols-3 gap-2">
                {SMP_POSTERS.map((poster) => {
                  const isActive = poster.src === activePoster.src;
                  return (
                    <button
                      key={poster.src}
                      type="button"
                      onClick={() => setActivePoster(poster)}
                      className={`flex flex-col items-center gap-1 rounded-xl p-2 border transition-all cursor-pointer ${
                        isActive
                          ? 'border-[#030164] bg-blue-50/80 shadow-xs ring-1 ring-[#030164]'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <img src={poster.src} alt="" className="h-16 w-full object-cover object-top rounded-lg" />
                      <span className={`text-[10px] font-bold text-center leading-tight ${isActive ? 'text-[#030164]' : 'text-slate-600'}`}>
                        {poster.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Download Button */}
              <a
                href={activePoster.src}
                download={activePoster.file}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#030164] hover:bg-[#07038c] text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all active:scale-95"
              >
                <Download className="w-4 h-4 text-[#ffd51e]" />
                <span>Unduh {activePoster.label} (PNG)</span>
              </a>
            </div>

            {/* Right: Bank Transfer & Action Steps */}
            <div className="lg:col-span-6 space-y-6">
              {/* Bank Card */}
              <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#030164] to-[#090566] text-white shadow-lg space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/15">
                  <div>
                    <span className="text-[11px] font-bold text-[#ffd51e] uppercase tracking-wider block">
                      Rekening Resmi Yayasan
                    </span>
                    <h4 className="text-lg font-black text-white mt-0.5">
                      Bank Muamalat Indonesia
                    </h4>
                  </div>
                  <CreditCard className="w-8 h-8 text-[#ffd51e]/80" />
                </div>

                <div className="space-y-1">
                  <span className="text-xs text-slate-300 font-medium">Nomor Rekening Pendaftaran:</span>
                  <div className="flex items-center justify-between p-3.5 bg-black/30 rounded-2xl border border-white/20">
                    <span className="text-xl sm:text-2xl font-mono font-black text-white tracking-widest">
                      1360012405
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyAccount('1360012405')}
                      className="px-3 py-1.5 rounded-xl bg-[#ffd51e] text-[#030164] text-xs font-black hover:bg-yellow-400 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      {copiedBank ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Salin No. Rek</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-slate-300 pt-1">
                    Atas Nama: <strong className="text-white font-bold">SMP IT Al Afiyah</strong>
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white/10 text-xs text-slate-200 border border-white/10">
                  📌 <em>Infaq pendaftaran sebesar Rp 200.000. Bukti transfer diunggah saat pendaftaran online atau dikirim ke WhatsApp admin panitia.</em>
                </div>
              </div>

              {/* Direct Next Step Action */}
              <div className="p-6 sm:p-7 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
                <h4 className="text-base font-black text-slate-900">
                  Langkah Mudah Pendaftaran SPMB
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#030164] text-[#ffd51e] text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      <strong>Pilih Jalur &amp; Isi Formulir:</strong> Isi data pokok calon murid melalui formulir online ringkas kami.
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#030164] text-[#ffd51e] text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      <strong>Transfer Infaq Pendaftaran:</strong> Infaq Rp 200.000 ke Bank Muamalat 1360012405 a.n SMP IT Al Afiyah.
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#030164] text-[#ffd51e] text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      <strong>Observasi &amp; Wawancara:</strong> Menghadiri jadwal tes observasi dasar membaca Al-Qur&apos;an dan wawancara di sekolah.
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex flex-wrap gap-2.5">
                  <Link
                    href={ppdbUrl}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#030164] hover:bg-[#07038c] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm active:scale-95"
                  >
                    <span>Daftar Sekarang Online</span>
                    <ArrowRight className="w-4 h-4 text-[#ffd51e]" />
                  </Link>

                  <a
                    href="https://wa.me/6282249357893?text=Assalamu%27alaikum%20Panitia%20SPMB%20SMP%20IT%20Al-Afiyah,%20saya%20ingin%20konsultasi%20pendaftaran"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold text-xs transition-all"
                  >
                    <MessageCircle className="w-4 h-4 text-[#030164]" />
                    <span>WhatsApp Panitia (0822-4935-7893)</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: 6 PROGRAM UNGGULAN (High Contrast White Cards on Deep Navy Background) */}
      <section id="programs" className="py-16 sm:py-20 bg-[#030164] text-white scroll-mt-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#ffd51e]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal yOffset={24} duration={500} className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-[#ffd51e]/40 text-[#ffd51e] text-xs font-black tracking-wider uppercase mb-3">
              <Award className="w-3.5 h-3.5" />
              <span>KURIKULUM UNGGULAN &amp; KARAKTER</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-snug">
              6 Program Unggulan SMP IT Al-Afiyah
            </h2>
            <p className="mt-2 text-sm text-slate-200 leading-relaxed">
              Memadukan kurikulum nasional, penguatan tahfidz mutqin, kecakapan bahasa Arab aktif, serta pembinaan karakter kepemimpinan murid.
            </p>
          </ScrollReveal>

          {/* Programs Grid: Pure Crisp White Cards with High Contrast */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SMP_PROGRAMS.map((prog, idx) => (
              <ScrollReveal
                key={prog.number}
                delay={idx * 0.08}
                yOffset={24}
                duration={500}
                className="h-full"
              >
                <div className="h-full p-6 sm:p-7 rounded-3xl bg-white text-slate-900 border-2 border-slate-200/90 shadow-xl hover:shadow-2xl hover:border-[#ffd51e] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
                  <div>
                    {/* Header bar: Number & Category Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-black tracking-widest text-[#030164] font-mono bg-blue-50 px-3 py-1 rounded-xl border border-blue-200">
                        {prog.number}
                      </span>
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#030164] text-[#ffd51e]">
                        {prog.category}
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-slate-900 mb-2 leading-snug group-hover:text-[#030164] transition-colors">
                      {prog.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      {prog.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      href={prog.href}
                      className="inline-flex items-center gap-1.5 text-xs font-black text-[#030164] group-hover:text-[#07038c] group-hover:underline"
                    >
                      <span>Pelajari Program</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#030164] group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/smp/program"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#ffd51e] text-[#030164] font-black text-xs uppercase tracking-wider hover:bg-yellow-400 transition-all shadow-md active:scale-95"
            >
              <span>Buka Halaman Seluruh Kurikulum SMP IT</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 3: STUDENT CHARACTER DEVELOPMENT (SCD) & MUTABA'AH DIGITAL */}
      <section id="karakter" className="py-16 sm:py-20 bg-slate-100 border-b border-slate-200 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold text-[#030164] uppercase tracking-wider bg-blue-100/70 px-3.5 py-1.5 rounded-full border border-blue-200 inline-block">
                Pondasi Karakter &amp; Adab
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                SCD (Student Character Development) &amp; Mutaba&apos;ah Digital
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Di SMP IT Al-Afiyah, adab ditanamkan sebelum ilmu. Murid dibimbing secara konsisten agar memiliki akidah yang lurus, adab islami, kemandirian aqil-baligh, serta kedisiplinan ibadah harian.
              </p>

              <div className="space-y-4 pt-2">
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#030164] text-[#ffd51e] flex items-center justify-center shrink-0 font-black">
                    1
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Pembiasaan Shalat 5 Waktu &amp; Dzikir Ma&apos;tsurat</h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Shalat fardhu berjamaah di masjid sekolah dan dzikir pagi petang sebagai benteng ruhiyah murid remaja.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#030164] text-[#ffd51e] flex items-center justify-center shrink-0 font-black">
                    2
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Aplikasi Mutaba&apos;ah Digital Terintegrasi</h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Kolaborasi transparan antara murid, orang tua di rumah, dan dewan guru di sekolah dalam memantau amalan yaumiyah.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#030164] text-[#ffd51e] flex items-center justify-center shrink-0 font-black">
                    3
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Mabit Ruhiyah &amp; Muhasabah Remaja</h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Program bermalam di sekolah untuk penguatan shalat tahajjud, tausiyah kepemimpinan, dan muhasabah adab birrul walidain.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/smp/karakter"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#030164] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#07038c] transition-all shadow-sm"
                >
                  <span>Lihat Selengkapnya Program Karakter</span>
                  <ArrowRight className="w-4 h-4 text-[#ffd51e]" />
                </Link>
              </div>
            </div>

            {/* Right: Graphic Card */}
            <div className="lg:col-span-6">
              <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200 aspect-[4/3]">
                <img
                  src="/images/smp-outing-3.jpg"
                  alt="Aktivitas Ibadah dan Karakter SMP IT Al-Afiyah"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-6 sm:p-8 text-white">
                  <span className="px-3 py-1 rounded-full bg-[#ffd51e] text-[#030164] text-[10px] font-black uppercase tracking-wider self-start mb-2">
                    Pembiasaan Ibadah
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-white">
                    Halaqah Tahfidz &amp; Keteladanan Guru
                  </h3>
                  <p className="text-xs text-slate-200 mt-1 max-w-md">
                    Mencetak generasi murid yang mandiri, beradab santun, dan mencintai Al-Qur&apos;an di lingkungan Giri Asih.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: SARANA & FASILITAS SEKOLAH DI LINGKUNGAN GIRI ASIH */}
      <section id="fasilitas" className="py-16 sm:py-20 bg-white border-b border-slate-200 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal yOffset={24} duration={500} className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#030164] uppercase tracking-wider bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200 inline-block mb-3">
              Sarana Prasarana Sekolah
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-snug">
              Fasilitas Pembelajaran SMP IT Al-Afiyah
            </h2>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Berlokasi di Lingkungan Giri Asih (Jl. Gerakan Koperasi No. 110, Majalengka Wetan) dengan sarana representatif, bersih, dan asri demi kenyamanan belajar murid.
            </p>
          </ScrollReveal>

          {/* Facilities Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SMP_FACILITIES.map((fac, idx) => (
              <ScrollReveal
                key={idx}
                delay={(idx % 3) * 0.1}
                yOffset={24}
                duration={500}
                className="h-full flex flex-col"
              >
                <div
                  onClick={() => setSelectedPhoto(fac.image)}
                  className="group rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 shadow-2xs hover:shadow-md hover:border-[#030164]/40 transition-all duration-300 flex flex-col justify-between h-full cursor-pointer"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-slate-200 relative">
                    <img
                      src={fac.image}
                      alt={fac.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#030164] text-[#ffd51e] shadow-sm">
                        {fac.category}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-2xs">
                      <span className="px-3.5 py-1.5 rounded-xl bg-white text-[#030164] text-xs font-bold shadow-md flex items-center gap-1.5">
                        <ZoomIn className="w-3.5 h-3.5" />
                        <span>Perbesar Foto</span>
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 mb-1.5 group-hover:text-[#030164] transition-colors">
                        {fac.title}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {fac.desc}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs font-bold text-[#030164]">
                      <span>Fasilitas Resmi SMP IT</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/smp/fasilitas"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider transition-all border border-slate-300"
            >
              <span>Lihat Dokumentasi Fasilitas Lengkap</span>
              <ArrowRight className="w-4 h-4 text-[#030164]" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 5: OUTING CLASS & KEGIATAN MURID */}
      <section id="dokumentasi" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold text-[#030164] uppercase tracking-wider bg-blue-100/70 px-3.5 py-1.5 rounded-full border border-blue-200 inline-block mb-2">
                Dokumentasi Nyata Murid
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Aktivitas Rihlah, Outing &amp; Kejuaraan Futsal Murid
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Potret kegiatan tadabbur alam, river tubing, mabit, dan latihan intensif atlet futsal murid SMP IT Al-Afiyah.
              </p>
            </div>
            <Link
              href="/smp/dokumentasi"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#030164] hover:underline shrink-0"
            >
              <span>Lihat Seluruh Galeri Dokumentasi</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm aspect-[4/3] group relative cursor-pointer" onClick={() => setSelectedPhoto('/images/smp-tubing-1.jpg')}>
              <img src="/images/smp-tubing-1.jpg" alt="Outing Murid SMP IT" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent flex items-end p-4 text-white">
                <p className="text-xs font-bold">Rihlah River Tubing &amp; Tadabbur Alam</p>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm aspect-[4/3] group relative cursor-pointer" onClick={() => setSelectedPhoto('/images/smp-tubing-2.jpg')}>
              <img src="/images/smp-tubing-2.jpg" alt="Kebersamaan Murid SMP IT" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent flex items-end p-4 text-white">
                <p className="text-xs font-bold">Ukhuwah &amp; Pembentukan Mental Juara</p>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm aspect-[4/3] group relative cursor-pointer" onClick={() => setSelectedPhoto('/images/smp-tubing-3.jpg')}>
              <img src="/images/smp-tubing-3.jpg" alt="Keceriaan Murid SMP IT" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent flex items-end p-4 text-white">
                <p className="text-xs font-bold">Kemandirian &amp; Leadership Murid</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: FAQ ACCORDION */}
      <section id="faq" className="py-16 sm:py-20 bg-white border-b border-slate-200 scroll-mt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal yOffset={24} duration={500} className="text-center mb-12">
            <span className="text-xs font-bold text-[#030164] uppercase tracking-wider bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200 inline-block mb-3">
              Tanya Jawab Seputar SPMB
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Pertanyaan yang Sering Diajukan (FAQ)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Informasi penting seputar pendaftaran, seleksi observasi, dan kurikulum SMP IT Al-Afiyah.
            </p>
          </ScrollReveal>

          <div className="space-y-3">
            {SMP_FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 hover:text-[#030164] transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-500 transition-transform duration-300 shrink-0 ${
                        isOpen ? 'rotate-180 text-[#030164]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200/60 pt-3 bg-white">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 7: PETA LOKASI SEKOLAH DI LINGKUNGAN GIRI ASIH */}
      <CampusLocationMapSection unitSlug="smp" />

      {/* SECTION 8: BOTTOM CTA BANNER */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-[#030164] via-[#090580] to-[#01003d] text-white text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <span className="px-3.5 py-1.5 rounded-full bg-[#ffd51e] text-[#030164] text-xs font-black uppercase tracking-wider inline-block">
            KUOTA GELOMBANG 1 TERBATAS
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Wujudkan Masa Depan Murid yang <br />
            <span className="text-[#ffd51e]">Smart &amp; Religious</span> Bersama Kami
          </h2>
          <p className="text-sm sm:text-base text-slate-200 max-w-2xl mx-auto leading-relaxed">
            Daftarkan putra-putri tercinta sekarang juga. Dapatkan potongan biaya uang bangunan hingga 70% sebelum 28 Februari 2027.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <Link
              href={ppdbUrl}
              className="px-8 py-4 rounded-2xl bg-[#ffd51e] text-[#030164] font-black text-sm uppercase tracking-wider hover:bg-yellow-400 transition-all shadow-lg active:scale-95 inline-flex items-center gap-2"
            >
              <span>Daftar SPMB Online Sekarang</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </Link>
            <a
              href="https://wa.me/6282249357893?text=Assalamu%27alaikum%20Panitia%20SPMB%20SMP%20IT%20Al-Afiyah,%20saya%20ingin%20konsultasi%20pendaftaran"
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm uppercase tracking-wider transition-all inline-flex items-center gap-2"
            >
              <MessageCircle className="w-5 h-5 text-[#ffd51e]" />
              <span>Konsultasi WhatsApp Admin</span>
            </a>
          </div>
        </div>
      </section>

      {/* Lightbox Modal for Official Posters */}
      {isPosterModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setIsPosterModalOpen(false)}
        >
          <div
            className="relative max-w-3xl w-full max-h-[90vh] bg-white rounded-3xl overflow-hidden p-4 sm:p-6 flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h4 className="text-sm sm:text-base font-black text-slate-900">
                {activePoster.label} • SPMB SMP IT Al-Afiyah
              </h4>
              <button
                type="button"
                onClick={() => setIsPosterModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-auto my-4 max-h-[70vh] flex items-center justify-center bg-slate-50 rounded-2xl p-2">
              <img
                src={activePoster.src}
                alt={activePoster.label}
                className="max-h-[68vh] w-auto object-contain rounded-xl"
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              <span className="text-xs text-slate-500">Resolusi Tinggi • Format Gambar Resmi</span>
              <a
                href={activePoster.src}
                download={activePoster.file}
                className="px-4 py-2 rounded-xl bg-[#030164] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#07038c] transition-all flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-[#ffd51e]" />
                <span>Unduh Gambar</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal for Photo Gallery */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] bg-white rounded-3xl overflow-hidden p-4 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                Dokumentasi Fasilitas &amp; Kegiatan SMP IT Al-Afiyah
              </h4>
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-auto my-2 max-h-[75vh] flex items-center justify-center">
              <img src={selectedPhoto} alt="Foto Fasilitas" className="max-h-[72vh] w-auto object-contain rounded-xl" />
            </div>
          </div>
        </div>
      )}

      {/* Footer & Mobile Bar */}
      <Footer schoolSlug="smp" />
      <StickyMobileBar schoolSlug="smp" />
    </div>
  );
}
