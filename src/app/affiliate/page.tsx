'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {
  ArrowRight,
  ArrowLeft,
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
  FileText,
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
function CircularBadgeStamp({ text = "AFFILIATE RESMI • AL-AFIYAH • TERPERCAYA • AMANAH • " }: { text?: string }) {
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
 * Scroll fade animation variant (triggers both when scrolling down and up)
 */
const scrollFadeVariant: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

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

  const [schoolSlug, setSchoolSlug] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const s = params.get('school');
      if (s) setSchoolSlug(s);
    }
  }, []);

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
    document.title = 'Affiliate Al-Afiyah | Program Rekomendasi Resmi';
  }, []);

  // State: Referral Link Copy
  const [heroCopied, setHeroCopied] = useState(false);
  const handleHeroCopy = () => {
    navigator.clipboard.writeText('https://alafiyah.id/ref/MITRA-BERKAH');
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

  // State: Commission Calculator
  const [calcStudents, setCalcStudents] = useState<number>(5);
  const [calcUnit, setCalcUnit] = useState<'all' | 'tk' | 'sd' | 'smp'>('sd');

  const FORM_FEES = {
    sd: cmsContent.commissionFormSd ?? (cmsContent.commissionFormFee ?? 50000),
    tk: cmsContent.commissionFormTk ?? 25000,
    smp: cmsContent.commissionFormSmp ?? 35000,
    all: Math.round(
      ((cmsContent.commissionFormSd ?? (cmsContent.commissionFormFee ?? 50000)) +
        (cmsContent.commissionFormTk ?? 25000) +
        (cmsContent.commissionFormSmp ?? 35000)) /
        3
    ),
  };

  const REG_FEES = {
    sd: cmsContent.commissionReRegSd ?? 100000,
    tk: cmsContent.commissionReRegTk ?? 50000,
    smp: cmsContent.commissionReRegSmp ?? 65000,
    all: Math.round(
      ((cmsContent.commissionReRegSd ?? 100000) +
        (cmsContent.commissionReRegTk ?? 50000) +
        (cmsContent.commissionReRegSmp ?? 65000)) /
        3
    ),
  };

  const currentFormFee = FORM_FEES[calcUnit];
  const currentRegFee = REG_FEES[calcUnit];
  const formCommissionTotal = calcStudents * currentFormFee;
  const regCommissionTotal = calcStudents * currentRegFee;
  const totalCalcCommission = formCommissionTotal + regCommissionTotal;

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
      earningExample: 'Rekomendasikan 3 kerabat masuk SDIT = Rp 450.000 (bisa menutup biaya seragam atau SPP peserta didik).',
      template:
        "Assalamu'alaikum wr. wb. Ayah/Bunda, bagi yang sedang mencari sekolah Islam berkualitas dengan bimbingan tahfidz intensif dan karakter qurani di Majalengka, PPDB Al-Afiyah (TK, SD, SMP) kini sudah dibuka. Informasi dan pendaftaran resmi: https://alafiyah.id/ref/KODE-MITRA",
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
        "Bismillah. Untuk wali murid dan adik-adik peserta didik yang mencari kelanjutan sekolah terpadu dengan kurikulum unggul, hafalan Al-Qur'an, dan adab harian, kami merekomendasikan Ma'had Al-Afiyah. Pendaftaran: https://alafiyah.id/ref/KODE-MITRA",
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
        'Hai semuanya! Buat yang nanya sekolah Islam favorit di Majalengka yang lingkungan belajarnya asik dan fokus tahfidz, aku sangat rekomendasikan Al-Afiyah: https://alafiyah.id/ref/KODE-MITRA',
    },
    relawan: {
      badge: 'Penggiat Dakwah',
      title: 'Penggiat Dakwah, Majelis & Relawan Sosial',
      subtitle: 'Syiarkan nilai pendidikan qurani sembari membangun sumber rezeki yang barakah.',
      icon: HeartHandshake,
      advantageTitle: 'Dana Operasional & Insentif Kebaikan Pendidikan',
      advantageText:
        'Jadikan program affiliate ini sebagai sumber pendanaan mandiri untuk kas majelis, kegiatan sosial, atau insentif pribadi tanpa membebani jamaah.',
      why: 'Bagi Anda yang aktif di majelis taklim atau media sosial, program affiliate ini adalah sarana menyebarkan kebaikan tanpa modal sepeser pun.',
      earningExample: 'Sebar tautan rekomendasi & ajak 8 peserta didik baru = Rp 3.200.000 komisi apresiasi berkah.',
      template:
        "Alhamdulillah, pendaftaran peserta didik baru Yayasan Pendidikan Imam Bonjol Al-Afiyah Majalengka (TK IT, SDIT, SMP IT) telah dibuka. Informasi lengkap: https://alafiyah.id/ref/KODE-ANDA",
    },
  };

  const faqs = [
    {
      q: 'Apakah program affiliate Al-Afiyah aman, halal, dan bebas riba?',
      a: 'Ya, program Affiliate Al-Afiyah 100% aman, halal, dan transparan. Anda berperan menyebarkan info kebaikan pendidikan Islam dan berhak mendapatkan apresiasi komisi resmi yang jelas, pasti, tanpa potongan sepihak, dan bukan sistem MLM ataupun skema piramida.',
    },
    {
      q: 'Kapan komisi dicairkan ke rekening bank saya?',
      a: 'Komisi pendaftaran formulir diverifikasi dan dicairkan segera saat calon wali murid melunasi biaya formulir. Sedangkan komisi registrasi ulang dicairkan ke rekening bank affiliate (BSI, BRI, BCA, Mandiri, dll.) saat peserta didik menyelesaikan daftar ulang.',
    },
    {
      q: 'Apakah pendaftaran Affiliate Al-Afiyah ini dipungut biaya?',
      a: '100% Gratis tanpa biaya pendaftaran, tanpa modal awal, dan tanpa target kuota wajib. Anda bebas menyebarkan tautan kapan saja sesuai keluangan waktu Anda.',
    },
    {
      q: 'Bagaimana saya memantau siapa saja yang mendaftar lewat link saya?',
      a: 'Setiap anggota affiliate mendapatkan akses ke Dashboard Affiliate pribadi secara real-time. Anda dapat melihat daftar nama calon peserta didik, status verifikasi berkas, konfirmasi pembayaran, dan total saldo komisi yang siap dicairkan.',
    },
    {
      q: 'Apakah sekolah menyediakan materi promosi dan brosur?',
      a: 'Ya, di dalam Dashboard Affiliate tersedia materi grafis resmi siap sebar, brosur digital interaktif, teks pesan WhatsApp/Instagram, serta template yang bisa langsung Anda bagikan.',
    },
  ];

  const marqueeKeywords =
    cmsContent.marqueeKeywords && cmsContent.marqueeKeywords.length > 0
      ? cmsContent.marqueeKeywords
      : DEFAULT_AFFILIATE_CONTENT.marqueeKeywords;

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between selection:bg-emerald-100 selection:text-emerald-900 font-sans antialiased text-slate-800">
      <Navbar schoolSlug={schoolSlug === 'sd' ? 'sd' : undefined} transparentAtTop={false} />

      {/* =========================================================================
          1. HERO SECTION: Clean Crisp White Background with Bento Photo Grid
             (Adopting Layout & Editorial Typo from Reference Image Top)
         ========================================================================= */}
      <section className="pt-10 pb-16 sm:pt-14 sm:pb-20 lg:pt-16 lg:pb-24 bg-[#FAFAFA] border-b border-slate-200/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Headline, Badge, Copy & Pill Buttons */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.15 }}
              variants={scrollFadeVariant}
              className="lg:col-span-6 space-y-6 text-left"
            >
              {schoolSlug === 'sd' && (
                <div className="mb-2">
                  <Link
                    href="/sd"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-xs font-semibold text-emerald-800 transition-all active:scale-95"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Kembali ke Beranda SDIT</span>
                  </Link>
                </div>
              )}
              <DoublePillBadge label={cmsContent.heroBadge || "Program Affiliate Al-Afiyah"} />

              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight text-slate-950 leading-[1.12]">
                {cmsContent.heroHeadline || 'Sebar Kebaikan Pendidikan,'}{' '}
                <span className="text-[#153424] block sm:inline">
                  {cmsContent.heroHighlight || 'Raih Apresiasi Berkah Nyata'}
                </span>
              </h1>

              <p className="text-slate-600 text-sm sm:text-base lg:text-lg max-w-xl leading-relaxed">
                {cmsContent.heroDescription || 'Program rujukan resmi Yayasan Pendidikan Al-Afiyah (TK IT, SDIT, SMP IT). Dapatkan komisi apresiasi yang transparan, mudah, dan terpercaya cukup dengan membagikan link rekomendasi pendaftaran sekolah.'}
              </p>

              {/* CTAs: Harmonious Dual-Pill Architecture (Primary Emerald + Secondary White Outline) */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <button
                  type="button"
                  onClick={() => openRegisterWithPersona()}
                  className="px-7 py-3.5 rounded-full bg-[#153424] hover:bg-[#0f271b] text-white font-bold text-sm sm:text-base transition-all duration-200 shadow-md shadow-emerald-950/20 hover:shadow-lg hover:shadow-emerald-950/30 flex items-center justify-center gap-2.5 group cursor-pointer active:scale-[0.98] border border-emerald-900/60"
                >
                  <span>Daftar Jadi Affiliate</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </button>

                <a
                  href="#kalkulator"
                  className="px-6 py-3.5 rounded-full bg-white hover:bg-slate-50 text-slate-800 hover:text-slate-950 font-bold text-sm sm:text-base transition-all duration-200 border border-slate-300/90 hover:border-slate-400 shadow-xs hover:shadow-sm flex items-center justify-center gap-2 group active:scale-[0.98]"
                >
                  <span>Pelajari Cara Kerja &amp; Komisi</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-transform duration-200 group-hover:translate-x-1" />
                </a>
              </div>

              {/* Micro Trust Indicators: Tactile Capsule Badges */}
              <div className="pt-3 flex flex-wrap items-center gap-2 sm:gap-2.5">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/90 shadow-2xs text-xs font-semibold text-slate-700">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-emerald-800 stroke-[3]" />
                  </span>
                  <span>100% Gratis &amp; Halal</span>
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
                  <span>Pencairan Cepat ke Rekening</span>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Bento Photo Collage with Rotating Seal Stamp (Reference Match) */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.15 }}
              variants={scrollFadeVariant}
              className="lg:col-span-6 relative"
            >
              <div className="relative mx-auto max-w-lg lg:max-w-none">
                
                {/* Modern Dashboard Live Preview Card (No Documentation Photos) */}
                <div className="bg-[#153424] rounded-3xl p-5 sm:p-7 shadow-2xl border-2 border-emerald-900/80 text-white relative overflow-hidden">
                  
                  {/* Subtle Background Glows */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#a3e635]/10 rounded-full blur-3xl pointer-events-none" />

                  {/* Header Bar of Dashboard Preview */}
                  <div className="relative z-10 flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                      </div>
                      <span className="text-[11px] font-mono font-semibold text-emerald-200/90 pl-1.5">
                        Live Affiliate Dashboard
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-[#a3e635] text-[10px] font-bold border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#a3e635] animate-pulse" />
                      <span>Pelacakan Aktif</span>
                    </span>
                  </div>

                  {/* Top Stats Cards: Saldo & Konversi */}
                  <div className="relative z-10 grid grid-cols-2 gap-3 mb-5">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs text-left">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-200/70">
                          Estimasi Komisi
                        </span>
                        <TrendingUp className="w-3.5 h-3.5 text-[#a3e635]" />
                      </div>
                      <p className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
                        Rp 2.450.000
                      </p>
                      <span className="text-[10px] text-[#a3e635] font-semibold mt-1 inline-block">
                        +Rp 150rb minggu ini
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs text-left">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-200/70">
                          Siswa Rujukan
                        </span>
                        <Users className="w-3.5 h-3.5 text-amber-300" />
                      </div>
                      <p className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
                        16 <span className="text-xs font-normal text-emerald-200/70">Siswa</span>
                      </p>
                      <span className="text-[10px] text-emerald-200/80 font-medium mt-1 inline-block">
                        12 Formulir • 4 Daftar Ulang
                      </span>
                    </div>
                  </div>

                  {/* Activity Feed: Live Simulation */}
                  <div className="relative z-10 space-y-2 mb-5 text-left">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200/60 block px-1">
                      Aktivitas Rujukan Terverifikasi
                    </span>

                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-[#a3e635] font-mono text-[10px] font-bold shrink-0">
                          SDIT
                        </span>
                        <div className="truncate">
                          <p className="font-bold text-white truncate text-[11px]">Formulir SPMB Terverifikasi</p>
                          <p className="text-[10px] text-emerald-200/60">Ananda Fatih • Baru saja</p>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-[#a3e635] text-xs shrink-0 pl-2">
                        +Rp 50.000
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 font-mono text-[10px] font-bold shrink-0">
                          SMP IT
                        </span>
                        <div className="truncate">
                          <p className="font-bold text-white truncate text-[11px]">Daftar Ulang Selesai</p>
                          <p className="text-[10px] text-emerald-200/60">Ananda Zaid • 1 jam lalu</p>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-[#a3e635] text-xs shrink-0 pl-2">
                        +Rp 65.000
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold shrink-0">
                          TK IT
                        </span>
                        <div className="truncate">
                          <p className="font-bold text-white truncate text-[11px]">Formulir SPMB Terverifikasi</p>
                          <p className="text-[10px] text-emerald-200/60">Ananda Maryam • Hari ini</p>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-[#a3e635] text-xs shrink-0 pl-2">
                        +Rp 25.000
                      </span>
                    </div>
                  </div>

                  {/* Dedicated Referral Link Box */}
                  <div className="relative z-10 bg-white rounded-2xl p-4 shadow-sm border border-slate-200 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-slate-900">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-900">
                          Tautan Personal Anda
                        </span>
                      </div>
                      <p className="font-mono text-xs sm:text-sm font-bold text-slate-900 truncate">
                        alafiyah.id/ref/<span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-bold">KODE-ANDA</span>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => openRegisterWithPersona()}
                      className="px-4 py-2.5 rounded-xl bg-[#153424] hover:bg-[#0f271b] text-white text-xs font-bold transition-all shadow-xs hover:shadow-md cursor-pointer shrink-0 flex items-center justify-center space-x-1.5 active:scale-95 border border-emerald-900/60"
                    >
                      <span>Dapatkan Link</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#a3e635]" />
                    </button>
                  </div>

                </div>

                {/* Overlapping Rotating Circular Seal Stamp (Reference Signature) */}
                <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 z-20">
                  <CircularBadgeStamp />
                </div>

              </div>
            </motion.div>

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
          
          {/* Section Header with Scroll Fade */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.15 }}
            variants={scrollFadeVariant}
            className="text-center max-w-3xl mx-auto mb-14"
          >
            <DoublePillBadge label="Mengenal Program Affiliate" />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
              {cmsContent.aboutTitle || 'Membangun Generasi Qurani Melalui Sinergi & Amanah'}
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.15 }}
            variants={scrollFadeVariant}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16"
          >
            
            {/* Left Column: Modern System Highlights (No Documentation Photos) */}
            <div className="lg:col-span-5 relative">
              <div className="relative space-y-4">
                
                {/* Bento Card 1: Transparent System Architecture */}
                <div className="rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-[#153424] via-[#1a3f2c] to-[#0f271b] text-white shadow-lg border border-emerald-900/60 relative overflow-hidden text-left">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 text-[#a3e635] flex items-center justify-center border border-white/10 shadow-xs">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-[#a3e635]/15 text-[#a3e635] text-[10px] font-mono font-bold border border-[#a3e635]/30">
                      Sistem Resmi Terpusat
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold text-white tracking-tight">
                    Ekosistem Afiliasi Berbasis Kejujuran &amp; Teknologi
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed mt-2">
                    Didukung pelacakan referral otomatis 24/7 dan pencatatan komisi transparan tanpa potongan tersembunyi.
                  </p>

                  <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-2 gap-3 text-[11px] text-emerald-100">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-[#a3e635] shrink-0" />
                      <span>Pelacakan Cookie 30 Hari</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-[#a3e635] shrink-0" />
                      <span>Notifikasi WhatsApp Real-Time</span>
                    </div>
                  </div>
                </div>

                {/* Bento Card 2: 3-Unit Structure Matrix */}
                <div className="rounded-3xl p-5 bg-[#FAFAFA] border border-slate-200/90 shadow-sm text-left space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Mendukung 3 Jenjang Pendidikan
                    </span>
                    <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Multi-Unit Terpadu
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2.5 text-center">
                    <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                      <span className="text-[10px] text-slate-500 block font-bold">TK IT</span>
                      <strong className="text-sm font-black text-slate-900 font-mono">Rp 75.000</strong>
                      <span className="text-[9px] text-slate-400 block mt-0.5">/ Peserta Didik</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-2xs">
                      <span className="text-[10px] text-emerald-800 block font-bold">SDIT</span>
                      <strong className="text-sm font-black text-emerald-950 font-mono">Rp 150.000</strong>
                      <span className="text-[9px] text-emerald-700 block mt-0.5">/ Peserta Didik</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                      <span className="text-[10px] text-slate-500 block font-bold">SMP IT</span>
                      <strong className="text-sm font-black text-slate-900 font-mono">Rp 100.000</strong>
                      <span className="text-[9px] text-slate-400 block mt-0.5">/ Peserta Didik</span>
                    </div>
                  </div>
                </div>

                {/* Circular Stamp Overlay at Left Middle */}
                <div className="absolute top-1/2 -right-5 sm:-right-8 -translate-y-1/2 z-10">
                  <CircularBadgeStamp text="AMANAH • TRANSPARAN • HALAL • RESMI • " />
                </div>
              </div>
            </div>

            {/* Right Column: Narrative Copy & Metric Progress Bars (Exact Reference Match) */}
            <div className="lg:col-span-7 space-y-6 text-left lg:pl-6">
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {cmsContent.aboutDescription || 'Yayasan Pendidikan Imam Bonjol Al-Afiyah Majalengka membuka program affiliate resmi untuk mengajak seluruh elemen masyarakat—mulai dari wali murid, dewan guru, alumni peserta didik, hingga simpatisan pendidikan—menjadi bagian dari syiar pendidikan Islam terpadu yang berkualitas.'}
              </p>

              {/* Progress Metric Bars with Lime Dots (From Reference Image) */}
              <div className="space-y-4 pt-2">
                {[
                  { label: 'Transparansi Komisi & Bebas Biaya', pct: 100, barWidth: 'w-full' },
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
                  <span>Gabung Affiliate Sekarang</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </motion.div>

          {/* Bottom Stats Counter Row with Scroll Fade */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.15 }}
            variants={scrollFadeVariant}
            className="pt-10 border-t border-slate-200/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
          >
            {[
              { val: 'Rp 0', label: 'Modal Awal Pendaftaran' },
              { val: '100%', label: 'Transparan & Bebas Riba' },
              {
                val: `Rp ${Math.round(Math.max(FORM_FEES.sd + REG_FEES.sd, FORM_FEES.tk + REG_FEES.tk, FORM_FEES.smp + REG_FEES.smp) / 1000)}rb`,
                label: 'Komisi Tertinggi / Siswa',
              },
              { val: '3 Unit', label: 'TK IT, SDIT, & SMP IT' },
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
          </motion.div>
        </div>
      </section>

      {/* =========================================================================
          4. SERVICES & COMMISSION CALCULATOR SECTION: Deep Forest Green Canvas
             with High-Contrast Chartreuse / Lime Center Highlight Card
             (Adopting Section 3 from Reference Image)
         ========================================================================= */}
      <section id="kalkulator" className="py-20 sm:py-24 bg-[#153424] text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Bar: Header on Left + White Pill Button on Right */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.15 }}
            variants={scrollFadeVariant}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 text-left"
          >
            <div>
              <DoublePillBadge label="Skema & Simulasi Komisi" isLight={true} />
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Simulasi Komisi &amp; Estimasi Pendapatan
              </h2>
              <p className="text-sm text-emerald-200/80 mt-1 max-w-xl">
                Kalkulasi transparan dan mudah dipahami. Tanpa modal awal, tanpa biaya pendaftaran, dan tanpa target kuota wajib.
              </p>
            </div>

            <button
              type="button"
              onClick={() => openRegisterWithPersona()}
              className="px-6 py-3 rounded-full bg-white hover:bg-slate-100 text-[#153424] font-extrabold text-xs sm:text-sm transition-all shadow-md flex items-center space-x-2 cursor-pointer self-start md:self-auto shrink-0"
            >
              <span>Daftar Jadi Affiliate</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>

          {/* 3-Column Grid Matching Reference:
              Left: Dark Green Card | Middle: Vibrant Lime Card | Right: Dark Green Card */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.15 }}
            variants={scrollFadeVariant}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch"
          >
            
            {/* Card 1: Dark Green Card (Tahap 1 - Formulir) */}
            <div className="bg-[#1c432f] rounded-3xl p-6 border border-white/10 flex flex-col justify-between text-left space-y-5">
              <div className="space-y-4">
                <div className="h-36 rounded-2xl border border-white/10 bg-gradient-to-br from-[#153424] via-[#1c432f] to-[#0f271b] p-4 flex flex-col justify-between relative overflow-hidden shadow-inner">
                  <div className="flex items-center justify-between">
                    <span className="w-10 h-10 rounded-xl bg-[#a3e635]/15 border border-[#a3e635]/30 text-[#a3e635] flex items-center justify-center shadow-xs">
                      <FileText className="w-5 h-5" />
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/10 text-emerald-200 border border-white/10">
                      Tahap 01
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#a3e635] block">
                      Aktivasi Formulir SPMB
                    </span>
                    <p className="text-[11px] text-emerald-100/75 leading-tight mt-0.5">
                      Komisi otomatis tercatat saat calon wali murid melunasi biaya formulir via link Anda.
                    </p>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-[#a3e635] uppercase font-bold">
                    Tahap 1
                  </span>
                  <h3 className="text-xl font-bold text-white mt-0.5">Komisi Formulir</h3>
                  <p className="text-2xl font-extrabold text-white mt-1">
                    s.d. Rp {Math.max(FORM_FEES.sd, FORM_FEES.smp, FORM_FEES.tk).toLocaleString('id-ID')}{' '}
                    <span className="text-xs text-slate-300 font-normal">/ Peserta Didik</span>
                  </p>
                  <div className="mt-2 space-y-1 text-xs text-emerald-100/70">
                    <p className="flex justify-between border-b border-white/5 pb-1">
                      <span>SDIT Al-Afiyah:</span>
                      <strong className="text-white font-mono">
                        Rp {FORM_FEES.sd.toLocaleString('id-ID')}
                      </strong>
                    </p>
                    <p className="flex justify-between border-b border-white/5 pb-1">
                      <span>SMP IT Al-Afiyah:</span>
                      <strong className="text-white font-mono">
                        Rp {FORM_FEES.smp.toLocaleString('id-ID')}
                      </strong>
                    </p>
                    <p className="flex justify-between pt-0.5">
                      <span>TK IT Al-Afiyah:</span>
                      <strong className="text-white font-mono">
                        Rp {FORM_FEES.tk.toLocaleString('id-ID')}
                      </strong>
                    </p>
                  </div>
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
                    Geser jumlah calon siswa yang mendaftar untuk menghitung estimasi komisi Anda:
                  </p>
                </div>

                {/* Unit Selector inside Card */}
                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  {[
                    { id: 'all', label: 'Semua Jenjang' },
                    { id: 'sd', label: `SDIT (${Math.round((FORM_FEES.sd + REG_FEES.sd) / 1000)}rb)` },
                    { id: 'smp', label: `SMP IT (${Math.round((FORM_FEES.smp + REG_FEES.smp) / 1000)}rb)` },
                    { id: 'tk', label: `TK IT (${Math.round((FORM_FEES.tk + REG_FEES.tk) / 1000)}rb)` },
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
                    Total Estimasi Komisi Anda
                  </span>
                  <p className="text-3xl font-black text-white font-mono tracking-tight">
                    <AnimatedRupiah value={totalCalcCommission} />
                  </p>
                  <p className="text-[10px] text-slate-300">
                    Komisi Formulir: Rp {(formCommissionTotal).toLocaleString('id-ID')} + Registrasi: Rp {(regCommissionTotal).toLocaleString('id-ID')}
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
                <div className="h-36 rounded-2xl border border-white/10 bg-gradient-to-br from-[#153424] via-[#1c432f] to-[#0f271b] p-4 flex flex-col justify-between relative overflow-hidden shadow-inner">
                  <div className="flex items-center justify-between">
                    <span className="w-10 h-10 rounded-xl bg-[#a3e635]/15 border border-[#a3e635]/30 text-[#a3e635] flex items-center justify-center shadow-xs">
                      <GraduationCap className="w-5 h-5" />
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/10 text-emerald-200 border border-white/10">
                      Tahap 02
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#a3e635] block">
                      Daftar Ulang Selesai
                    </span>
                    <p className="text-[11px] text-emerald-100/75 leading-tight mt-0.5">
                      Komisi utama cair saat calon siswa dinyatakan lulus dan menyelesaikan daftar ulang.
                    </p>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-[#a3e635] uppercase font-bold">
                    Tahap 2
                  </span>
                  <h3 className="text-xl font-bold text-white mt-0.5">Komisi Daftar Ulang</h3>
                  <p className="text-2xl font-extrabold text-white mt-1">
                    s.d. Rp {Math.max(REG_FEES.sd, REG_FEES.smp, REG_FEES.tk).toLocaleString('id-ID')}{' '}
                    <span className="text-xs text-slate-300 font-normal">/ Peserta Didik</span>
                  </p>
                  <div className="mt-2 space-y-1 text-xs text-emerald-100/70">
                    <p className="flex justify-between border-b border-white/5 pb-1">
                      <span>SDIT Al-Afiyah:</span>
                      <strong className="text-white font-mono">
                        Rp {REG_FEES.sd.toLocaleString('id-ID')}
                      </strong>
                    </p>
                    <p className="flex justify-between border-b border-white/5 pb-1">
                      <span>SMP IT Al-Afiyah:</span>
                      <strong className="text-white font-mono">
                        Rp {REG_FEES.smp.toLocaleString('id-ID')}
                      </strong>
                    </p>
                    <p className="flex justify-between pt-0.5">
                      <span>TK IT Al-Afiyah:</span>
                      <strong className="text-white font-mono">
                        Rp {REG_FEES.tk.toLocaleString('id-ID')}
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

          </motion.div>

        </div>
      </section>

      {/* =========================================================================
          5. PERSONA SECTION: Clean White Bento Grid (Adopting Section 4 from Reference)
         ========================================================================= */}
      <section id="persona" className="py-20 sm:py-24 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.15 }}
            variants={scrollFadeVariant}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <DoublePillBadge label="Peluang Kolaborasi" />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
              Siapa Saja yang Bisa Bergabung Menjadi Affiliate?
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mt-2">
              Pilih peran Anda dan lihat bagaimana program affiliate Al-Afiyah memberikan manfaat nyata.
            </p>
          </motion.div>

          {/* Tab Selector Buttons */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.15 }}
            variants={scrollFadeVariant}
            className="flex justify-center mb-8"
          >
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
          </motion.div>

          {/* Active Persona Bento Card with Framer Motion */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.15 }}
            variants={scrollFadeVariant}
            className="max-w-4xl mx-auto"
          >
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
          </motion.div>

        </div>
      </section>

      {/* =========================================================================
          6. 5-STEP HOW IT WORKS
         ========================================================================= */}
      <section className="py-20 sm:py-24 bg-[#FAFAFA] border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.15 }}
            variants={scrollFadeVariant}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <DoublePillBadge label="Alur Kerja Sederhana" />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
              5 Langkah Mudah Memulai Affiliate Al-Afiyah
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mt-2">
              Proses registrasi dan pembagian tautan berlangsung singkat, tanpa instalasi aplikasi tambahan.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.15 }}
            variants={scrollFadeVariant}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5"
          >
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
          </motion.div>
        </div>
      </section>

      {/* =========================================================================
          7. REGISTRATION FORM SECTION (Dark Forest Green Background)
         ========================================================================= */}
      <section id="daftar" className="py-20 sm:py-24 bg-[#153424] text-white relative border-b border-emerald-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.15 }}
              variants={scrollFadeVariant}
              className="lg:col-span-6 space-y-6 text-left"
            >
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
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.15 }}
              variants={scrollFadeVariant}
              className="lg:col-span-6"
            >
              <div className="bg-white rounded-3xl p-6 sm:p-9 shadow-2xl text-slate-900 border border-slate-100 max-w-md mx-auto lg:max-w-none text-left">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-extrabold text-slate-950">Formulir Pendaftaran Affiliate</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Isi data diri Anda di bawah ini untuk mengaktifkan akun affiliate resmi.
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
                      <span>Daftar Jadi Affiliate — Gratis</span>
                    )}
                  </button>

                  <div className="text-center pt-2">
                    <p className="text-xs text-slate-500">
                      Sudah pernah mendaftar?{' '}
                      <Link href="/affiliate/dashboard" className="text-[#153424] font-bold hover:underline">
                        Masuk ke Dashboard Affiliate &rarr;
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          8. FAQ SECTION
         ========================================================================= */}
      <section className="py-20 sm:py-24 bg-white border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.15 }}
            variants={scrollFadeVariant}
            className="text-center mb-12"
          >
            <DoublePillBadge label="Pertanyaan Umum" />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
              Pertanyaan yang Sering Diajukan
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Segala hal yang perlu Anda ketahui tentang program Affiliate Al-Afiyah.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.15 }}
            variants={scrollFadeVariant}
            className="space-y-3 text-left"
          >
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
          </motion.div>
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
                    Daftar Akun Affiliate Al-Afiyah
                  </h3>
                  <p className="text-[11px] text-slate-500">Gratis • Langsung Aktif • 100% Halal</p>
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
                    Kategori Affiliate:{' '}
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
                    <span>Aktifkan Akun Affiliate Sekarang &rarr;</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer schoolSlug={schoolSlug === 'sd' ? 'sd' : undefined} />
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
      return 'Affiliate';
  }
}
