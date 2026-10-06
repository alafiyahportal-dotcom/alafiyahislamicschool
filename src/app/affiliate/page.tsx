'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyMobileBar from '@/components/layout/StickyMobileBar';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Users,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  TrendingUp,
  GraduationCap,
  School,
  Wallet,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Check,
  HeartHandshake,
  Target,
  UserPlus,
  Copy,
  MessageCircle,
  X,
  CreditCard,
  ArrowUpRight,
  Scale,
  BadgeCheck,
  Sliders,
  Star,
  CheckCheck,
} from 'lucide-react';
import { DEFAULT_AFFILIATE_CONTENT, AffiliateCMSData } from '@/types/affiliate-cms';

/**
 * Double capsule pill badge component matching reference design
 */
function DoublePillBadge({ label, isLight = false }: { label: string; isLight?: boolean }) {
  return (
    <div className="inline-flex items-center space-x-2.5 mb-3.5">
      <span className="flex items-center space-x-1">
        <span className="w-1.5 h-3.5 rounded-full bg-[#a3e635]" />
        <span className={`w-1.5 h-3.5 rounded-full ${isLight ? 'bg-white' : 'bg-[#153424]'}`} />
      </span>
      <span className={`text-xs font-bold tracking-wider uppercase ${isLight ? 'text-emerald-100' : 'text-slate-800'}`}>
        {label}
      </span>
    </div>
  );
}

/**
 * Rotating Circular Stamp Emblem from reference
 */
function CircularBadgeStamp({ text = "MITRA RESMI • AL-AFIYAH • SYARIAH • AMANAH • " }: { text?: string }) {
  return (
    <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#153424] text-white flex items-center justify-center p-1 shadow-xl border-2 border-white/20 select-none">
      <svg className="w-full h-full animate-[spin_14s_linear_infinite]" viewBox="0 0 100 100">
        <path
          id="circlePath"
          d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
          fill="none"
        />
        <text className="text-[7.5px] font-extrabold uppercase tracking-[0.18em] fill-white">
          <textPath href="#circlePath" startOffset="0%">
            {text}
          </textPath>
        </text>
      </svg>
      <div className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-[#0a1d13] text-emerald-200 flex items-center justify-center shadow-inner border border-emerald-500/30">
        <ShieldCheck className="w-5 h-5" />
      </div>
    </div>
  );
}

/**
 * Natural number counter for currency
 */
function AnimatedRupiah({ value }: { value: number }) {
  const [current, setCurrent] = useState(value);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const startVal = current;
    const diff = value - startVal;
    if (diff === 0) return;

    const duration = 250;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(startVal + diff * ease));

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    const reqId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(reqId);
  }, [value, current]);

  return (
    <span>
      {new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
      }).format(current)}
    </span>
  );
}

export default function AffiliatePublicPage() {
  const router = useRouter();

  // Dynamic CMS content state initialized with high-quality defaults
  const [cmsContent, setCmsContent] = useState<Required<AffiliateCMSData>>(DEFAULT_AFFILIATE_CONTENT);

  useEffect(() => {
    fetch('/api/affiliate/content')
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.content) {
          setCmsContent((prev) => ({ ...prev, ...res.content }));
        }
      })
      .catch(() => {});
  }, []);

  // Set browser tab title
  useEffect(() => {
    document.title = 'Affiliate Al-Afiyah | Program Kemitraan Dakwah & Kebaikan';
  }, []);

  // State: Referral Link Copy
  const [heroCopied, setHeroCopied] = useState(false);
  const handleHeroCopy = () => {
    navigator.clipboard.writeText('https://alafiyah.sch.id/ref/MITRA-BERKAH');
    setHeroCopied(true);
    setTimeout(() => setHeroCopied(false), 2500);
  };

  // State: Modal & Persona Role Locking
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPersonaRole, setSelectedPersonaRole] = useState<'wali' | 'guru' | 'alumni' | 'relawan' | null>(null);

  const openRegisterWithPersona = (role?: 'wali' | 'guru' | 'alumni' | 'relawan') => {
    if (role) {
      setSelectedPersonaRole(role);
    }
    setIsModalOpen(true);
  };

  // State: Active Persona Tab
  const [activePersonaTab, setActivePersonaTab] = useState<'wali' | 'guru' | 'alumni' | 'relawan'>('wali');
  const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null);

  // State: Syirkah Calculator
  const [calcStudents, setCalcStudents] = useState<number>(5);
  const [calcUnit, setCalcUnit] = useState<'all' | 'tk' | 'sd' | 'smp'>('all');

  const FORM_FEE = cmsContent.commissionFormFee ?? 50000;
  const REG_FEES = {
    all: Math.round(
      ((cmsContent.commissionReRegTk ?? 250000) +
        (cmsContent.commissionReRegSd ?? 100000) +
        (cmsContent.commissionReRegSmp ?? 500000)) /
        3
    ),
    tk: cmsContent.commissionReRegTk ?? 250000,
    sd: cmsContent.commissionReRegSd ?? 100000,
    smp: cmsContent.commissionReRegSmp ?? 500000,
  };

  const formUjrahTotal = calcStudents * FORM_FEE;
  const regUjrahTotal = calcStudents * REG_FEES[calcUnit];
  const totalCalcCommission = formUjrahTotal + regUjrahTotal;

  // State: Registration Form
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    referralCode: '',
    bankName: 'Bank Syariah Indonesia (BSI)',
    bankAccountNumber: '',
    bankAccountHolder: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // State: FAQ Accordion
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTemplate(id);
    setTimeout(() => setCopiedTemplate(null), 2500);
  };

  const handleRegisterAffiliate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    if (formData.password && formData.password.length < 6) {
      setErrorMessage('Kata sandi minimal terdiri dari 6 karakter.');
      setIsLoading(false);
      return;
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      setErrorMessage('Konfirmasi kata sandi tidak cocok dengan yang dimasukkan.');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/affiliate/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password || 'password123',
          referralCode: formData.referralCode || undefined,
          bankName: formData.bankName,
          bankAccountNumber: formData.bankAccountNumber || '-',
          bankAccountHolder: formData.bankAccountHolder || formData.fullName,
          personaRole: selectedPersonaRole || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || 'Gagal mendaftarkan akun mitra afiliasi.');
        setIsLoading(false);
        return;
      }

      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }

      setSuccessMessage('Pendaftaran berhasil! Mengalihkan ke dasbor mitra...');
      setTimeout(() => {
        router.push(data.redirectUrl || '/affiliate/dashboard');
      }, 1200);
    } catch {
      setErrorMessage('Terjadi kendala koneksi internet. Silakan coba kembali.');
      setIsLoading(false);
    }
  };

  // Persona Content
  const personaData = {
    wali: {
      badge: 'Wali Murid & Komite',
      title: 'Wali Murid & Keluarga Besar Al-Afiyah',
      subtitle: 'Pengalaman nyata putra-putri Anda adalah rekomendasi paling tulus bagi sesama orang tua.',
      icon: Users,
      advantageTitle: 'Potongan SPP & Tabungan Pendidikan Peserta Didik',
      advantageText:
        'Komisi pendaftaran dapat dialihkan otomatis untuk memotong tagihan SPP bulanan ananda di sekolah atau dicairkan penuh ke rekening bank orang tua.',
      why: 'Sebagai orang tua yang merasakan langsung lingkungan islami, tahfidz mutqin, dan kenyamanan belajar di Al-Afiyah, cerita Anda sangat dipercaya oleh sanak kerabat.',
      earningExample: 'Rekomendasikan 3 kerabat masuk SD IT = Rp 450.000 (bisa menutup biaya seragam atau SPP peserta didik).',
      template:
        "Assalamu'alaikum wr. wb. Ayah/Bunda, bagi yang sedang mencari sekolah Islam berkualitas dengan bimbingan tahfidz intensif dan karakter qurani di Majalengka, PPDB Al-Afiyah (TK, SD, SMP) kini sudah dibuka. Informasi dan pendaftaran resmi: https://alafiyah.sch.id/ref/KODE-MITRA",
    },
    guru: {
      badge: 'Dewan Guru & Asatidz',
      title: 'Dewan Guru, Asatidz & Tenaga Pendidik',
      subtitle: 'Bantu murid dan peserta didik binaan melanjutkan pendidikan ke jenjang lanjutan terbaik.',
      icon: School,
      advantageTitle: 'Insentif Pengembangan Profesi & Apresiasi Pendidik',
      advantageText:
        'Apresiasi komisi berkah sebagai wujud penghormatan atas bimbingan dedikatif Anda dalam mengarahkan peserta didik melanjutkan studi ke jenjang TK, SD, maupun SMP IT.',
      why: 'Guru dan asatidz memiliki peran sentral dalam mengarahkan masa depan peserta didik. Setiap peserta didik yang Anda bimbing diapresiasi dengan hak komisi yang halal.',
      earningExample: 'Rekomendasikan 5 peserta didik lulusan melanjutkan ke SMP IT = Rp 2.750.000 langsung cair ke rekening pendidik.',
      template:
        "Bismillah. Untuk wali murid dan adik-adik peserta didik yang mencari kelanjutan sekolah terpadu dengan kurikulum unggul, hafalan Al-Qur'an, dan adab harian, kami merekomendasikan Ma'had Al-Afiyah. Pendaftaran: https://alafiyah.sch.id/ref/KODE-MITRA",
    },
    alumni: {
      badge: 'Alumni Peserta Didik',
      title: 'Alumni Peserta Didik & Pelajar Al-Afiyah',
      subtitle: 'Jadilah jembatan kebaikan untuk adik kelas dan generasi penerus almamater tercinta.',
      icon: GraduationCap,
      advantageTitle: 'Kemandirian Finansial Mahasiswa & Khidmah Almamater',
      advantageText:
        'Bangun tabungan mandiri penunjang masa kuliah dan operasional harian Anda secara halal dan fleksibel tanpa perlu mengorbankan waktu studi.',
      why: 'Anda adalah bukti hidup kualitas pendidikan karakter Al-Afiyah. Ajak adik kandung, sepupu, atau rekan di majelis untuk merasakan manfaat belajar di Al-Afiyah.',
      earningExample: "Ajak 3 sanak famili bergabung di Ma'had Al-Afiyah = Rp 1.150.000 siap ditransfer ke rekening mahasiswa Anda.",
      template:
        'Hai semuanya! Buat yang nanya sekolah Islam favorit di Majalengka yang lingkungan belajarnya asik dan fokus tahfidz, aku sangat rekomendasikan Al-Afiyah: https://alafiyah.sch.id/ref/KODE-MITRA',
    },
    relawan: {
      badge: 'Penggiat Dakwah',
      title: 'Penggiat Dakwah, Majelis & Relawan Sosial',
      subtitle: 'Syiarkan nilai pendidikan qurani sembari membangun sumber rezeki yang barakah.',
      icon: HeartHandshake,
      advantageTitle: 'Dana Operasional Dakwah & Syiar Pendidikan Islam',
      advantageText:
        'Jadikan program kemitraan ini sebagai sumber pendanaan mandiri untuk kas majelis taklim, logistik dakwah, atau kegiatan sosial tanpa membebani jamaah.',
      why: 'Bagi Anda yang aktif di majelis taklim atau media sosial dakwah, program kemitraan ini adalah sarana menyebarkan kebaikan tanpa biaya modal sepeser pun.',
      earningExample: 'Sebar tautan di majelis & jaring 8 peserta didik baru = Rp 3.200.000 dana operasional dakwah berkah.',
      template:
        "Alhamdulillah, pendaftaran peserta didik baru Yayasan Pendidikan Imam Bonjol Al-Afiyah Majalengka (TK IT, SD IT, SMP IT) tahun ajaran 2027/2028 telah dibuka. Informasi lengkap: https://alafiyah.sch.id/ref/KODE-MITRA",
    },
  };

  const faqs = [
    {
      q: 'Bagaimana hukum syariah komisi afiliasi di Al-Afiyah?',
      a: 'Program kemitraan ini menggunakan akad syariah Wakalah bil Ujrah (perwakilan berbayar atas jasa). Mitra bertindak sebagai wakil yang menyosialisasikan informasi sekolah dan berhak menerima ujrah (upah komisi) yang jelas, pasti, halal, tanpa riba ataupun skema piramida/MLM tersembunyi.',
    },
    {
      q: 'Kapan komisi dicairkan ke rekening bank saya?',
      a: 'Komisi pendaftaran formulir (Rp 50.000) diverifikasi dan dicairkan seketika saat calon wali murid melunasi biaya formulir. Sedangkan komisi registrasi ulang dicairkan ke rekening bank mitra (BSI, BRI, BCA, Mandiri, dll.) saat peserta didik menyelesaikan daftar ulang.',
    },
    {
      q: 'Apakah pendaftaran mitra afiliasi ini dipungut biaya?',
      a: '100% Gratis tanpa biaya pendaftaran, tanpa modal awal, dan tanpa target kuota wajib. Anda bebas menyebarkan tautan kapan saja sesuai keluangan waktu Anda.',
    },
    {
      q: 'Bagaimana saya memantau siapa saja yang mendaftar lewat link saya?',
      a: 'Setiap mitra mendapatkan akses ke Dasbor Afiliasi Pribadi secara real-time. Anda dapat melihat daftar nama calon peserta didik, status verifikasi berkas, konfirmasi pembayaran, dan total saldo komisi yang siap dicairkan.',
    },
    {
      q: 'Apakah sekolah menyediakan materi promosi dan brosur?',
      a: 'Ya, di dalam Dasbor Mitra tersedia materi grafis resmi siap sebar, brosur digital interaktif, caption WhatsApp/Instagram, serta template pesan yang bisa langsung Anda bagikan.',
    },
  ];

  const marqueeKeywords =
    cmsContent.marqueeKeywords && cmsContent.marqueeKeywords.length > 0
      ? cmsContent.marqueeKeywords
      : DEFAULT_AFFILIATE_CONTENT.marqueeKeywords;

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between selection:bg-emerald-100 selection:text-emerald-900 font-sans antialiased text-slate-800">
      <Navbar transparentAtTop={false} />

      {/* =========================================================================
          1. HERO SECTION: Clean Crisp White Background with Bento Photo Grid
             (Adopting Layout & Editorial Typo from Reference Image Top)
         ========================================================================= */}
      <section className="pt-10 pb-16 sm:pt-14 sm:pb-20 lg:pt-16 lg:pb-24 bg-[#FAFAFA] border-b border-slate-200/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Headline, Badge, Copy & Pill Buttons */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <DoublePillBadge label={cmsContent.heroBadge || "Program Kemitraan Dakwah & Kebaikan"} />

              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight text-slate-950 leading-[1.12]">
                {cmsContent.heroHeadline || 'Sebar Kebaikan Pendidikan,'}{' '}
                <span className="text-[#153424] block sm:inline">
                  {cmsContent.heroHighlight || 'Raih Apresiasi Berkah Nyata'}
                </span>
              </h1>

              <p className="text-slate-600 text-sm sm:text-base lg:text-lg max-w-xl leading-relaxed">
                {cmsContent.heroDescription || 'Program kemitraan resmi Yayasan Pendidikan Al-Afiyah (TK IT, SD IT, SMP IT). Dapatkan hak ujrah halal, transparan, dan terpercaya berbasis akad syariah Wakalah bil Ujrah cukup dengan berbagi rekomendasi.'}
              </p>

              {/* CTAs: Harmonious Dual-Pill Architecture (Primary Emerald + Secondary White Outline) */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <button
                  type="button"
                  onClick={() => openRegisterWithPersona()}
                  className="px-7 py-3.5 rounded-full bg-[#153424] hover:bg-[#0f271b] text-white font-bold text-sm sm:text-base transition-all duration-200 shadow-md shadow-emerald-950/20 hover:shadow-lg hover:shadow-emerald-950/30 flex items-center justify-center gap-2.5 group cursor-pointer active:scale-[0.98] border border-emerald-900/60"
                >
                  <span>Daftar Jadi Mitra</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </button>

                <a
                  href="#kalkulator"
                  className="px-6 py-3.5 rounded-full bg-white hover:bg-slate-50 text-slate-800 hover:text-slate-950 font-bold text-sm sm:text-base transition-all duration-200 border border-slate-300/90 hover:border-slate-400 shadow-xs hover:shadow-sm flex items-center justify-center gap-2 group active:scale-[0.98]"
                >
                  <span>Pelajari Skema &amp; Simulasi</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-transform duration-200 group-hover:translate-x-1" />
                </a>
              </div>

              {/* Micro Trust Indicators: Tactile Capsule Badges */}
              <div className="pt-3 flex flex-wrap items-center gap-2 sm:gap-2.5">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/90 shadow-2xs text-xs font-semibold text-slate-700">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-emerald-800 stroke-[3]" />
                  </span>
                  <span>100% Akad Syariah</span>
                </div>

                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/90 shadow-2xs text-xs font-semibold text-slate-700">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-emerald-800 stroke-[3]" />
                  </span>
                  <span>Tanpa Biaya Pendaftaran</span>
                </div>

                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/90 shadow-2xs text-xs font-semibold text-slate-700">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-emerald-800 stroke-[3]" />
                  </span>
                  <span>Pencairan Cepat Rekening</span>
                </div>
              </div>
            </div>

            {/* Right Column: Bento Photo Collage with Rotating Seal Stamp (Reference Match) */}
            <div className="lg:col-span-6 relative">
              <div className="relative mx-auto max-w-lg lg:max-w-none">
                
                {/* Collage Grid */}
                <div className="grid grid-cols-12 gap-3 sm:gap-4 items-center">
                  
                  {/* Top Large Photo */}
                  <div className="col-span-7 relative h-52 sm:h-64 rounded-3xl overflow-hidden shadow-lg border-2 border-white">
                    <Image
                      src={cmsContent.heroPhoto1 || '/images/sd-activity-halaqah-tahfidz.jpg'}
                      alt="Peserta Didik Tahfidz Al-Afiyah"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 60vw, 30vw"
                      unoptimized={cmsContent.heroPhoto1?.startsWith('data:')}
                    />
                  </div>

                  {/* Top Right Photo */}
                  <div className="col-span-5 relative h-52 sm:h-64 rounded-3xl overflow-hidden shadow-lg border-2 border-white">
                    <Image
                      src={cmsContent.heroPhoto2 || '/images/sd-activity-classroom-6b.jpg'}
                      alt="Suasana Belajar Al-Afiyah"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 40vw, 20vw"
                      unoptimized={cmsContent.heroPhoto2?.startsWith('data:')}
                    />
                  </div>

                  {/* Bottom Wide Photo with Referral Overlay Card */}
                  <div className="col-span-12 relative h-48 sm:h-56 rounded-3xl overflow-hidden shadow-xl border-2 border-white">
                    <Image
                      src={cmsContent.heroPhoto3 || '/images/smp-outing-1.jpg'}
                      alt="Kegiatan Outing Peserta Didik Al-Afiyah"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      unoptimized={cmsContent.heroPhoto3?.startsWith('data:')}
                    />
                    
                    {/* Floating Referral Box Overlay */}
                    <div className="absolute inset-x-3 bottom-3 sm:inset-x-4 sm:bottom-4 bg-white/95 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl shadow-lg border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                          Tautan Unik Rujukan Anda
                        </span>
                        <p className="font-mono text-xs sm:text-sm font-bold text-slate-900 truncate">
                          alafiyah.sch.id/ref/<span className="text-emerald-700">MITRA-BERKAH</span>
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleHeroCopy}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 flex items-center justify-center space-x-1.5 ${
                          heroCopied
                            ? 'bg-emerald-700 text-white'
                            : 'bg-[#153424] hover:bg-[#0f271b] text-white'
                        }`}
                      >
                        {heroCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Tersalin!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Salin Link</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                </div>

                {/* Overlapping Rotating Circular Seal Stamp (Reference Signature) */}
                <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 z-20">
                  <CircularBadgeStamp />
                </div>


              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          2. MARQUEE RIBBON BANNER (Reference Signature Dark Green Ticker)
         ========================================================================= */}
      <div className="bg-[#153424] text-white py-3.5 overflow-hidden whitespace-nowrap border-y border-emerald-950/40 select-none relative">
        <div className="flex w-max animate-marquee font-bold text-xs sm:text-sm tracking-wider uppercase">
          {/* First loop track */}
          <div className="flex items-center shrink-0">
            {marqueeKeywords.map((item, idx) => (
              <span key={`a-${idx}`} className="inline-flex items-center space-x-6 sm:space-x-8 px-4 sm:px-6 shrink-0">
                <span>{item}</span>
                <span className="text-[#a3e635] text-sm leading-none select-none">✻</span>
              </span>
            ))}
          </div>
          {/* Second duplicate track for seamless infinite scroll */}
          <div className="flex items-center shrink-0" aria-hidden="true">
            {marqueeKeywords.map((item, idx) => (
              <span key={`b-${idx}`} className="inline-flex items-center space-x-6 sm:space-x-8 px-4 sm:px-6 shrink-0">
                <span>{item}</span>
                <span className="text-[#a3e635] text-sm leading-none select-none">✻</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================================
          3. ABOUT / FEATURE SECTION WITH METRIC PROGRESS BARS & STATS ROW
             (Adopting Section 2 from Reference Image)
         ========================================================================= */}
      <section className="py-20 sm:py-24 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-14">
            <DoublePillBadge label="Mengenal Program Kemitraan" />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
              {cmsContent.aboutTitle || 'Membangun Generasi Qurani Melalui Sinergi & Amanah'}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
            
            {/* Left Column: 2 Stacked Rounded Photos with Circular Emblem */}
            <div className="lg:col-span-5 relative">
              <div className="relative space-y-4">
                <div className="relative h-48 sm:h-56 rounded-3xl overflow-hidden shadow-md border-2 border-slate-100">
                  <Image
                    src={cmsContent.aboutPhotoTop || '/images/sd-hero-greenhouse.jpg'}
                    alt="Praktik Sains Peserta Didik Al-Afiyah"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    unoptimized={cmsContent.aboutPhotoTop?.startsWith('data:')}
                  />
                </div>
                <div className="relative h-48 sm:h-56 rounded-3xl overflow-hidden shadow-md border-2 border-slate-100">
                  <Image
                    src={cmsContent.aboutPhotoBottom || '/images/smp-hero-bilingual.jpg'}
                    alt="Suasana Peserta Didik Bilingual Al-Afiyah"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    unoptimized={cmsContent.aboutPhotoBottom?.startsWith('data:')}
                  />
                </div>
                
                {/* Circular Stamp Overlay at Left Middle */}
                <div className="absolute top-1/2 -right-5 sm:-right-8 -translate-y-1/2 z-10">
                  <CircularBadgeStamp text="AMANAH • SYARIAH • HALAL • RESMI • " />
                </div>
              </div>
            </div>

            {/* Right Column: Narrative Copy & Metric Progress Bars (Exact Reference Match) */}
            <div className="lg:col-span-7 space-y-6 text-left lg:pl-6">
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {cmsContent.aboutDescription || 'Yayasan Pendidikan Imam Bonjol Al-Afiyah Majalengka membuka program kemitraan dakwah resmi untuk mengajak seluruh elemen masyarakat—mulai dari wali murid, dewan guru, alumni peserta didik, hingga penggiat majelis taklim—menjadi bagian dari syiar pendidikan Islam terpadu yang berkualitas.'}
              </p>

              {/* Progress Metric Bars with Lime Dots (From Reference Image) */}
              <div className="space-y-4 pt-2">
                {[
                  { label: 'Transparansi & Kepastian Akad Syariah', pct: 100, barWidth: 'w-full' },
                  { label: 'Kecepatan Validasi & Pencairan Rekening', pct: 98, barWidth: 'w-[98%]' },
                  { label: 'Dukungan Materi Promosi & Brosur Digital', pct: 95, barWidth: 'w-[95%]' },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-800">
                      <span>{item.label}</span>
                      <span className="font-mono text-slate-900">{item.pct}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full relative overflow-visible">
                      <div className={`h-full bg-[#153424] rounded-full ${item.barWidth} relative`}>
                        {/* Lime Accent Dot Indicator at edge (From Reference) */}
                        <span className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#a3e635] border-2 border-white shadow-xs" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => openRegisterWithPersona()}
                  className="px-6 py-3 rounded-full bg-[#153424] hover:bg-[#0f271b] text-white font-bold text-xs sm:text-sm transition-all shadow-sm flex items-center space-x-2 cursor-pointer"
                >
                  <span>Gabung Kemitraan Sekarang</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

          {/* Bottom Stats Counter Row with Double Pill Dividers (Exact Reference Match) */}
          <div className="pt-10 border-t border-slate-200/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { val: 'Rp 0', label: 'Modal Awal Pendaftaran' },
              { val: '100%', label: 'Akad Syariah Wakalah' },
              { val: 'Rp 550rb', label: 'Ujrah Tertinggi / Peserta Didik' },
              { val: '3 Unit', label: 'TK IT, SD IT, & SMP IT' },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
                    {stat.val}
                  </span>
                  {i < 3 && (
                    <span className="hidden md:inline-flex items-center space-x-0.5 ml-4 text-slate-300">
                      <span className="w-1.5 h-3 rounded-full bg-[#a3e635]" />
                      <span className="w-1.5 h-3 rounded-full bg-[#153424]" />
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          4. SERVICES & SYIRKAH CALCULATOR SECTION: Deep Forest Green Canvas
             with High-Contrast Chartreuse / Lime Center Highlight Card
             (Adopting Section 3 from Reference Image)
         ========================================================================= */}
      <section id="kalkulator" className="py-20 sm:py-24 bg-[#153424] text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Bar: Header on Left + White Pill Button on Right */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 text-left">
            <div>
              <DoublePillBadge label="Skema & Simulasi Komisi" isLight={true} />
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Skema Bagi Hasil &amp; Kalkulator Syirkah
              </h2>
              <p className="text-sm text-emerald-200/80 mt-1 max-w-xl">
                Kalkulasi transparan berbasis akad Wakalah bil Ujrah. Tanpa modal awal, tanpa target kuota wajib.
              </p>
            </div>

            <button
              type="button"
              onClick={() => openRegisterWithPersona()}
              className="px-6 py-3 rounded-full bg-white hover:bg-slate-100 text-[#153424] font-extrabold text-xs sm:text-sm transition-all shadow-md flex items-center space-x-2 cursor-pointer self-start md:self-auto shrink-0"
            >
              <span>Daftar Jadi Mitra</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 3-Column Grid Matching Reference:
              Left: Dark Green Card | Middle: Vibrant Lime Card | Right: Dark Green Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            
            {/* Card 1: Dark Green Card (Tahap 1 - Formulir) */}
            <div className="bg-[#1c432f] rounded-3xl p-6 border border-white/10 flex flex-col justify-between text-left space-y-5">
              <div className="space-y-4">
                <div className="relative h-44 rounded-2xl overflow-hidden border border-white/10">
                  <Image
                    src={cmsContent.formCardImage || '/images/sd-activity-multimedia-learning.jpg'}
                    alt="Pendaftaran Formulir Al-Afiyah"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    unoptimized={cmsContent.formCardImage?.startsWith('data:')}
                  />
                </div>
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-[#a3e635] uppercase font-bold">
                    Tahap 1
                  </span>
                  <h3 className="text-xl font-bold text-white mt-0.5">Komisi Formulir</h3>
                  <p className="text-2xl font-extrabold text-white mt-1">
                    Rp {(cmsContent.commissionFormFee ?? 50000).toLocaleString('id-ID')}{' '}
                    <span className="text-xs text-slate-300 font-normal">/ Peserta Didik</span>
                  </p>
                  <p className="text-xs text-emerald-100/70 mt-2 leading-relaxed">
                    Dicairkan seketika saat calon wali murid menyelesaikan pengisian dan pembayaran formulir pendaftaran PPDB online resmi.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <span className="text-[11px] text-[#a3e635] font-semibold flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verifikasi Cepat &amp; Real-Time</span>
                </span>
              </div>
            </div>

            {/* Card 2: THE VIBRANT CHARTREUSE / LIME HIGHLIGHT CARD (Center Stage) */}
            <div className="bg-[#cbf738] text-slate-950 rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col justify-between text-left space-y-5 border-2 border-white/40">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-slate-950 text-white text-[10px] font-bold uppercase tracking-wider">
                    Kalkulator Interaktif
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-800">
                    Live Simulator
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl font-black text-slate-950 tracking-tight">
                    Hitung Estimasi Komisi
                  </h3>
                  <p className="text-xs text-slate-800 mt-1">
                    Geser slider kuota calon peserta didik untuk menghitung hak ujrah Anda:
                  </p>
                </div>

                {/* Unit Selector inside Card */}
                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  {[
                    { id: 'all', label: 'Semua Jenjang' },
                    { id: 'tk', label: `TK IT (${Math.round((FORM_FEE + (cmsContent.commissionReRegTk ?? 250000)) / 1000)}rb)` },
                    { id: 'sd', label: `SD IT (${Math.round((FORM_FEE + (cmsContent.commissionReRegSd ?? 100000)) / 1000)}rb)` },
                    { id: 'smp', label: `SMP IT (${Math.round((FORM_FEE + (cmsContent.commissionReRegSmp ?? 500000)) / 1000)}rb)` },
                  ].map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => setCalcUnit(u.id as any)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        calcUnit === u.id
                          ? 'bg-slate-950 text-white shadow-xs'
                          : 'bg-white/70 hover:bg-white text-slate-900 border border-slate-950/10'
                      }`}
                    >
                      {u.label}
                    </button>
                  ))}
                </div>

                {/* Range Slider */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-xs font-bold text-slate-900">
                    <span>Target Calon Peserta Didik:</span>
                    <span className="font-mono text-sm font-extrabold px-2 py-0.5 rounded bg-white text-slate-950 border border-slate-950/20">
                      {calcStudents} Peserta Didik
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    step="1"
                    value={calcStudents}
                    onChange={(e) => setCalcStudents(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-900/20 rounded-lg appearance-none cursor-pointer accent-slate-950"
                  />
                  <div className="flex justify-between text-[10px] text-slate-700 font-mono">
                    <span>1 Peserta Didik</span>
                    <span>10 Peserta Didik</span>
                    <span>20 Peserta Didik</span>
                  </div>
                </div>

                {/* Total Counter Box */}
                <div className="p-4 rounded-2xl bg-slate-950 text-white space-y-1 shadow-md">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#cbf738] block">
                    Total Estimasi Hak Komisi
                  </span>
                  <p className="text-3xl font-black text-white font-mono tracking-tight">
                    <AnimatedRupiah value={totalCalcCommission} />
                  </p>
                  <p className="text-[10px] text-slate-300">
                    Formulir: Rp {(formUjrahTotal).toLocaleString('id-ID')} + Registrasi: Rp {(regUjrahTotal).toLocaleString('id-ID')}
                  </p>
                </div>
              </div>

              {/* Action Button inside Lime Card */}
              <button
                type="button"
                onClick={() => openRegisterWithPersona()}
                className="w-full py-3.5 rounded-2xl bg-slate-950 hover:bg-slate-900 text-white font-extrabold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
              >
                <span>Kunci Estimasi &amp; Daftar Sekarang</span>
                <ArrowRight className="w-4 h-4 text-[#cbf738]" />
              </button>
            </div>

            {/* Card 3: Dark Green Card (Tahap 2 - Kelulusan & Registrasi) */}
            <div className="bg-[#1c432f] rounded-3xl p-6 border border-white/10 flex flex-col justify-between text-left space-y-5">
              <div className="space-y-4">
                <div className="relative h-44 rounded-2xl overflow-hidden border border-white/10">
                  <Image
                    src={cmsContent.reRegCardImage || '/images/tk-hero-kids.jpg'}
                    alt="Peserta Didik Ceria Al-Afiyah"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    unoptimized={cmsContent.reRegCardImage?.startsWith('data:')}
                  />
                </div>
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-[#a3e635] uppercase font-bold">
                    Tahap 2
                  </span>
                  <h3 className="text-xl font-bold text-white mt-0.5">Komisi Daftar Ulang</h3>
                  <p className="text-2xl font-extrabold text-white mt-1">
                    s.d. Rp {Math.max(cmsContent.commissionReRegTk ?? 250000, cmsContent.commissionReRegSd ?? 100000, cmsContent.commissionReRegSmp ?? 500000).toLocaleString('id-ID')}{' '}
                    <span className="text-xs text-slate-300 font-normal">/ Peserta Didik</span>
                  </p>
                  <div className="mt-2 space-y-1 text-xs text-emerald-100/70">
                    <p className="flex justify-between border-b border-white/5 pb-1">
                      <span>TK IT Al-Afiyah:</span>
                      <strong className="text-white font-mono">
                        Rp {(cmsContent.commissionReRegTk ?? 250000).toLocaleString('id-ID')}
                      </strong>
                    </p>
                    <p className="flex justify-between border-b border-white/5 pb-1">
                      <span>SD IT Al-Afiyah:</span>
                      <strong className="text-white font-mono">
                        Rp {(cmsContent.commissionReRegSd ?? 100000).toLocaleString('id-ID')}
                      </strong>
                    </p>
                    <p className="flex justify-between pt-0.5">
                      <span>SMP IT Al-Afiyah:</span>
                      <strong className="text-white font-mono">
                        Rp {(cmsContent.commissionReRegSmp ?? 500000).toLocaleString('id-ID')}
                      </strong>
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <span className="text-[11px] text-[#a3e635] font-semibold flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Transfer Rutin Setiap Bulan</span>
                </span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          5. PERSONA SECTION: Clean White Bento Grid (Adopting Section 4 from Reference)
         ========================================================================= */}
      <section id="persona" className="py-20 sm:py-24 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <DoublePillBadge label="Persona Kemitraan" />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
              Siapa Saja yang Bisa Bergabung Menjadi Mitra?
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mt-2">
              Pilih peran Anda dan lihat bagaimana program kemitraan dakwah ini memberikan nilai nyata.
            </p>
          </div>

          {/* Tab Selector Buttons */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex p-1.5 bg-slate-100 rounded-full border border-slate-200/80 gap-1 overflow-x-auto max-w-full">
              {[
                { id: 'wali', label: 'Wali Murid', icon: Users },
                { id: 'guru', label: 'Guru & Asatidz', icon: School },
                { id: 'alumni', label: 'Alumni Peserta Didik', icon: GraduationCap },
                { id: 'relawan', label: 'Penggiat Dakwah', icon: HeartHandshake },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activePersonaTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActivePersonaTab(tab.id as any)}
                    className={`flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-[#153424] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200/60'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#a3e635]' : 'text-slate-400'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Persona Bento Card with Framer Motion */}
          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              {Object.entries(personaData).map(([key, item]) => {
                if (key !== activePersonaTab) return null;
                const Icon = item.icon;
                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.2 }}
                    className="bg-[#FAFAFA] rounded-3xl p-6 sm:p-9 border border-slate-200/90 shadow-sm space-y-6 text-left"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200/80 gap-3">
                      <div className="flex items-center space-x-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-[#153424] text-[#a3e635] flex items-center justify-center shadow-xs">
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                              {item.badge}
                            </span>
                            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-100 text-[10px] font-semibold text-emerald-900">
                              <BadgeCheck className="w-3 h-3 text-emerald-700" />
                              <span>Jalur Terbuka</span>
                            </span>
                          </div>
                          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-950 mt-0.5">
                            {item.title}
                          </h3>
                        </div>
                      </div>

                      <button
                        onClick={() => openRegisterWithPersona(key as any)}
                        className="px-5 py-2.5 rounded-full bg-[#153424] hover:bg-[#0f271b] text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center space-x-1.5 self-start sm:self-auto"
                      >
                        <span>Daftar Jalur Ini</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-sm sm:text-base font-semibold text-slate-800 leading-snug">
                      {item.subtitle}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1.5">
                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                          <Wallet className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Keuntungan Spesifik:</span>
                        </h4>
                        <p className="text-xs font-bold text-emerald-900">{item.advantageTitle}</p>
                        <p className="text-xs text-slate-600 leading-relaxed">{item.advantageText}</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1.5">
                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                          <Target className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Mengapa Ini Tepat?</span>
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">{item.why}</p>
                      </div>
                    </div>

                    {/* Simulation Result */}
                    <div className="p-4 rounded-2xl bg-[#153424] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#a3e635] block mb-0.5">
                          Simulasi Nyata:
                        </span>
                        <p className="text-xs sm:text-sm font-medium text-emerald-100">
                          {item.earningExample}
                        </p>
                      </div>
                      <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-white/10 text-white shrink-0 self-start sm:self-auto border border-white/10">
                        Cair Otomatis Bulanan
                      </span>
                    </div>

                    {/* WhatsApp Template Text Box */}
                    <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Template Pesan WhatsApp Siap Sebar:</span>
                        </span>
                        <button
                          onClick={() => handleCopyText(item.template, key)}
                          className="text-xs font-bold text-emerald-800 hover:text-emerald-950 inline-flex items-center space-x-1 cursor-pointer"
                        >
                          {copiedTemplate === key ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-700">Tersalin!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Salin Teks</span>
                            </>
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-slate-600 italic bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                        &quot;{item.template}&quot;
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* =========================================================================
          6. 5-STEP HOW IT WORKS
         ========================================================================= */}
      <section className="py-20 sm:py-24 bg-[#FAFAFA] border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <DoublePillBadge label="Alur Kerja Sederhana" />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
              5 Langkah Mudah Menjadi Mitra Afiliasi
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mt-2">
              Proses registrasi dan pembagian tautan berlangsung singkat, tanpa instalasi aplikasi tambahan.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {[
              { step: '01', title: 'Daftar Akun', desc: 'Isi formulir pendaftaran gratis dalam 1 menit tanpa modal.' },
              { step: '02', title: 'Dapat Link Unik', desc: 'Masuk ke dasbor dan salin tautan rujukan resmi bertanda nama Anda.' },
              { step: '03', title: 'Sebar Tautan', desc: 'Bagikan informasi PPDB ke kerabat, status WhatsApp, atau majelis.' },
              { step: '04', title: 'Pantau Real-Time', desc: 'Cek perkembangan pendaftaran dan verifikasi peserta didik di dasbor.' },
              { step: '05', title: 'Komisi Masuk', desc: 'Komisi otomatis ditransfer langsung ke rekening bank Anda.' },
            ].map((s) => (
              <div
                key={s.step}
                className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all text-center flex flex-col items-center"
              >
                <div className="w-12 h-12 rounded-full bg-[#153424] text-[#a3e635] font-extrabold text-sm flex items-center justify-center mb-4 shadow-xs">
                  {s.step}
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1.5">{s.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. REGISTRATION FORM SECTION (Dark Forest Green Background)
         ========================================================================= */}
      <section id="daftar" className="py-20 sm:py-24 bg-[#153424] text-white relative border-b border-emerald-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6 text-left">
              <DoublePillBadge label="Pendaftaran Terbuka" isLight={true} />

              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight whitespace-pre-line">
                {cmsContent.ctaHeadline || 'Mulai Sebarkan Kebaikan,\nRaih Manfaat Berkah.'}
              </h2>

              <p className="text-emerald-100/80 text-sm sm:text-base leading-relaxed max-w-lg whitespace-pre-line">
                {cmsContent.ctaSubheadline || 'Daftarkan diri Anda hari ini. Akun Anda langsung aktif seketika dan tautan rujukan personal siap digunakan untuk membantu generasi muslim masa depan.'}
              </p>

              <div className="space-y-3.5 pt-2">
                {[
                  'Tanpa biaya pendaftaran & tanpa modal sepeser pun',
                  'Akses dasbor pelacakan pendaftar 24/7 real-time',
                  'Pencairan komisi rutin langsung ke rekening pribadi',
                  'Didukung materi promosi digital resmi dari Ma\'had Al-Afiyah',
                ].map((point, idx) => (
                  <div key={idx} className="flex items-center space-x-3">
                    <div className="w-5 h-5 rounded-full bg-[#a3e635] text-[#153424] flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-white">
                      {point}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="bg-white rounded-3xl p-6 sm:p-9 shadow-2xl text-slate-900 border border-slate-100 max-w-md mx-auto lg:max-w-none text-left">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-extrabold text-slate-950">Formulir Pendaftaran Mitra</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Isi data diri Anda di bawah ini untuk mengaktifkan akun afiliasi resmi.
                  </p>
                </div>

                {selectedPersonaRole && (
                  <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <BadgeCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span className="text-slate-700">
                        Jalur Terpilih:{' '}
                        <strong className="text-emerald-900">{tabTitleMap(selectedPersonaRole)}</strong>
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedPersonaRole(null)}
                      className="text-[11px] text-slate-400 hover:text-slate-600 underline cursor-pointer"
                    >
                      Ubah
                    </button>
                  </div>
                )}

                {errorMessage && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700">
                    {errorMessage}
                  </div>
                )}

                {successMessage && (
                  <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700 flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{successMessage}</span>
                  </div>
                )}

                <form onSubmit={handleRegisterAffiliate} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Contoh: Ustadz Ahmad Fauzi"
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#153424] outline-hidden transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Email Aktif *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="nama@email.com"
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#153424] outline-hidden transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Nomor WhatsApp *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="081234567890"
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#153424] outline-hidden transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Kata Sandi *
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          placeholder="Min. 6 karakter"
                          className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#153424] outline-hidden pr-9"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Ulangi Sandi *
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          placeholder="Konfirmasi sandi"
                          className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#153424] outline-hidden pr-9"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setShowBankDetails(!showBankDetails)}
                      className="text-xs text-[#153424] hover:underline font-bold inline-flex items-center space-x-1 cursor-pointer"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>{showBankDetails ? 'Tutup Pengaturan Rekening' : '+ Atur Rekening Bank & Kode Kustom'}</span>
                      {showBankDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>

                    {showBankDetails && (
                      <div className="mt-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            Pilihan Kode Referral Kustom (Opsional)
                          </label>
                          <input
                            type="text"
                            value={formData.referralCode}
                            onChange={(e) => setFormData({ ...formData, referralCode: e.target.value.toUpperCase() })}
                            placeholder="Contoh: USTADZ-AHMAD (otomatis jika kosong)"
                            className="w-full px-3 py-2 text-xs font-mono uppercase bg-white border border-slate-200 rounded-xl"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              Nama Bank
                            </label>
                            <input
                              type="text"
                              value={formData.bankName}
                              onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                              placeholder="BSI / BRI / BCA / Mandiri"
                              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              Nomor Rekening
                            </label>
                            <input
                              type="text"
                              value={formData.bankAccountNumber}
                              onChange={(e) => setFormData({ ...formData, bankAccountNumber: e.target.value })}
                              placeholder="Nomor Rekening"
                              className="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-200 rounded-xl"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-4 py-3.5 px-6 rounded-full bg-[#153424] hover:bg-[#0f271b] text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer active:scale-98"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Mendaftarkan Akun Anda...</span>
                      </>
                    ) : (
                      <span>Daftar Jadi Mitra Afiliasi — Gratis</span>
                    )}
                  </button>

                  <div className="text-center pt-2">
                    <p className="text-xs text-slate-500">
                      Sudah pernah mendaftar?{' '}
                      <Link href="/affiliate/dashboard" className="text-[#153424] font-bold hover:underline">
                        Masuk ke Dasbor Mitra &rarr;
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          8. FAQ SECTION
         ========================================================================= */}
      <section className="py-20 sm:py-24 bg-white border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <DoublePillBadge label="Pertanyaan Umum" />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
              Pertanyaan yang Sering Diajukan
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Segala hal yang perlu Anda ketahui tentang kemitraan syariah Ma&apos;had Al-Afiyah.
            </p>
          </div>

          <div className="space-y-3 text-left">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-5 text-left flex items-center justify-between space-x-4 cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <span className="font-bold text-sm text-slate-900">{faq.q}</span>
                    <span className="p-1 rounded-lg bg-slate-100 text-slate-600">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          QUICK REGISTRATION POPUP MODAL
         ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 max-w-lg w-full p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto text-left relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#153424] text-emerald-300 flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Daftar Mitra Afiliasi
                  </h3>
                  <p className="text-[11px] text-slate-500">Gratis • Langsung Aktif • Akad Syariah</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {selectedPersonaRole && (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <BadgeCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span className="text-slate-700">
                    Jalur Kemitraan:{' '}
                    <strong className="text-emerald-900">{tabTitleMap(selectedPersonaRole)}</strong>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPersonaRole(null)}
                  className="text-[11px] text-slate-400 hover:text-slate-600 underline cursor-pointer"
                >
                  Ubah
                </button>
              </div>
            )}

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleRegisterAffiliate} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Contoh: Ustadz Ahmad Fauzi"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#153424] outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Aktif *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="nama@email.com"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#153424] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor WhatsApp *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="081234567890"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#153424] outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kata Sandi *
                  </label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Min. 6 karakter"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#153424] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ulangi Sandi *
                  </label>
                  <input
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Konfirmasi sandi"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#153424] outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Bank &amp; Nomor Rekening Pencairan (Bisa Diisi Nanti)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    placeholder="Bank Syariah Indonesia (BSI)"
                    className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                  />
                  <input
                    type="text"
                    value={formData.bankAccountNumber}
                    onChange={(e) => setFormData({ ...formData, bankAccountNumber: e.target.value })}
                    placeholder="No. Rekening"
                    className="px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-6 rounded-full bg-[#153424] hover:bg-[#0f271b] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Memproses Pendaftaran...</span>
                    </>
                  ) : (
                    <span>Aktifkan Akun Mitra Sekarang &rarr;</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
      <StickyMobileBar />
    </div>
  );
}

function tabTitleMap(key: string): string {
  switch (key) {
    case 'wali':
      return 'Wali Murid';
    case 'guru':
      return 'Guru / Asatidz';
    case 'alumni':
      return 'Alumni Peserta Didik';
    case 'relawan':
      return 'Penggiat Dakwah';
    default:
      return 'Mitra';
  }
}
