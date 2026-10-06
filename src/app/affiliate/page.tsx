'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
  Sparkles,
  Copy,
  MessageCircle,
  X,
  CreditCard,
  Zap,
  ArrowUpRight,
  Scale,
  BadgeCheck,
  Sliders,
} from 'lucide-react';

/**
 * Smooth natural counter for currency values
 */
function AnimatedRupiah({ value }: { value: number }) {
  const [current, setCurrent] = useState(value);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const startVal = current;
    const diff = value - startVal;
    if (diff === 0) return;

    const duration = 280;

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

  // Set browser tab title
  useEffect(() => {
    document.title = 'Affiliate Al-Afiyah | Program Kemitraan Dakwah & Kebaikan';
  }, []);

  // State: Hero Live Card Copy Interaction
  const [heroCopied, setHeroCopied] = useState(false);
  const handleHeroCopy = () => {
    navigator.clipboard.writeText('https://alafiyah.sch.id/ref/MITRA-BERKAH');
    setHeroCopied(true);
    setTimeout(() => setHeroCopied(false), 2500);
  };

  // State: Registration Modal & Locked Persona Role
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPersonaRole, setSelectedPersonaRole] = useState<'wali' | 'guru' | 'alumni' | 'relawan' | null>(null);

  const openRegisterWithPersona = (role?: 'wali' | 'guru' | 'alumni' | 'relawan') => {
    if (role) {
      setSelectedPersonaRole(role);
    }
    setIsModalOpen(true);
  };

  // State: Persona Tabs
  const [activePersonaTab, setActivePersonaTab] = useState<'wali' | 'guru' | 'alumni' | 'relawan'>('wali');
  const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null);

  // State: Interactive Syirkah / Commission Calculator
  const [calcStudents, setCalcStudents] = useState<number>(5);
  const [calcUnit, setCalcUnit] = useState<'all' | 'tk' | 'sd' | 'smp'>('all');

  const FORM_FEE = 50000;
  const REG_FEES = {
    all: 375000, // Rata-rata proporsional lintas unit Al-Afiyah
    tk: 250000,
    sd: 350000,
    smp: 500000,
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

      // Trigger celebration confetti
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

  // Persona Data Content with specialized benefits & verified badges
  const personaData = {
    wali: {
      badge: 'Wali Murid & Komite',
      title: 'Wali Murid & Keluarga Besar Al-Afiyah',
      subtitle: 'Pengalaman nyata putra-putri Anda adalah rekomendasi paling tulus bagi sesama orang tua.',
      icon: Users,
      advantageTitle: 'Potongan SPP & Tabungan Pendidikan Santri',
      advantageText:
        'Komisi pendaftaran dapat dialihkan otomatis untuk memotong tagihan SPP bulanan ananda di sekolah atau dicairkan penuh ke rekening bank orang tua. Biaya sekolah jadi jauh lebih ringan bahkan gratis.',
      why: 'Sebagai orang tua yang merasakan langsung lingkungan islami, tahfidz mutqin, dan kenyamanan belajar di Al-Afiyah, cerita Anda sangat dipercaya oleh keluarga, tetangga, dan rekan kerja yang sedang mencari sekolah terbaik.',
      earningExample:
        'Rekomendasikan 3 kerabat masuk SD IT Al-Afiyah = Rp 1.200.000 (bisa menutup biaya SPP berbulan-bulan).',
      template:
        "Assalamu'alaikum wr. wb. Ayah/Bunda, bagi yang sedang mencari sekolah Islam berkualitas dengan bimbingan tahfidz intensif dan karakter qurani di Majalengka, PPDB Al-Afiyah (TK, SD, SMP) kini sudah dibuka. Informasi dan pendaftaran resmi bisa dicek langsung di tautan ini: https://alafiyah.sch.id/ref/KODE-MITRA",
    },
    guru: {
      badge: 'Dewan Guru & Asatidz',
      title: 'Dewan Guru, Asatidz & Tenaga Pendidik',
      subtitle: 'Bantu murid dan santri binaan melanjutkan pendidikan ke jenjang lanjutan terbaik.',
      icon: School,
      advantageTitle: 'Insentif Pengembangan Profesi & Apresiasi Pendidik',
      advantageText:
        'Apresiasi komisi berkah sebagai wujud penghormatan atas bimbingan dedikatif Anda dalam mengarahkan santri melanjutkan studi ke jenjang TK, SD, maupun SMP IT Al-Afiyah.',
      why: 'Guru dan asatidz memiliki peran sentral dalam mengarahkan masa depan santri. Melalui program kemitraan dakwah ini, setiap santri yang Anda bimbing diapresiasi dengan komisi berkah yang halal dan profesional.',
      earningExample:
        'Rekomendasikan 5 santri lulusan melanjutkan ke SMP IT Al-Afiyah = Rp 2.750.000 komisi pendidik langsung cair.',
      template:
        "Bismillah. Untuk wali murid dan adik-adik santri yang mencari kelanjutan sekolah terpadu dengan kurikulum unggul, hafalan Al-Qur'an, dan pembiasaan adab harian, kami merekomendasikan Ma'had Al-Afiyah Majalengka. Pendaftaran online dapat diakses melalui link resmi: https://alafiyah.sch.id/ref/KODE-MITRA",
    },
    alumni: {
      badge: 'Alumni Santri',
      title: 'Alumni Santri & Pelajar Al-Afiyah',
      subtitle: 'Jadilah jembatan kebaikan untuk adik kelas dan generasi penerus almamater tercinta.',
      icon: GraduationCap,
      advantageTitle: 'Kemandirian Finansial Mahasiswa & Khidmah Almamater',
      advantageText:
        'Bangun tabungan mandiri penunjang masa kuliah dan operasional harian Anda secara halal dan fleksibel tanpa perlu mengorbankan konsentrasi waktu belajar.',
      why: 'Anda adalah bukti hidup kualitas pendidikan karakter Al-Afiyah. Ajak adik kandung, sepupu, atau rekan di majelis untuk merasakan manfaat belajar di Al-Afiyah, sekaligus memperoleh penghasilan mandiri yang halal.',
      earningExample:
        'Ajak 3 sanak famili bergabung di Ma\'had Al-Afiyah = Rp 1.150.000 siap ditransfer ke rekening mahasiswa/alumni Anda.',
      template:
        'Hai semuanya! Buat yang nanya sekolah Islam favorit di Majalengka yang lingkungan santrinya asik dan fokus tahfidz, aku sangat rekomendasikan Al-Afiyah. Saat ini gelombang PPDB sudah dibuka, langsung daftar lewat link ini ya: https://alafiyah.sch.id/ref/KODE-MITRA',
    },
    relawan: {
      badge: 'Penggiat Dakwah',
      title: 'Penggiat Dakwah, Majelis & Relawan Sosial',
      subtitle: 'Syiarkan nilai pendidikan qurani sembari membangun sumber rezeki yang barakah.',
      icon: Sparkles,
      advantageTitle: 'Dana Operasional Dakwah & Syiar Pendidikan Islam',
      advantageText:
        'Jadikan program kemitraan ini sebagai sumber pendanaan mandiri untuk kas majelis taklim, logistik dakwah, atau kegiatan sosial keumatan tanpa membebani jamaah.',
      why: 'Bagi Anda yang aktif di majelis taklim, komunitas kebaikan, atau media sosial dakwah, program kemitraan ini adalah sarana menyebarkan alternatif pendidikan bernilai Islam tanpa biaya modal sepeser pun.',
      earningExample:
        'Sebar tautan di majelis & jaring 8 santri baru = Rp 3.200.000 dana operasional dakwah berkah.',
      template:
        "Alhamdulillah, pendaftaran santri baru Yayasan Pendidikan Imam Bonjol Al-Afiyah Majalengka (TK IT, SD IT, SMP IT) tahun ajaran 2027/2028 telah dibuka. Mari siapkan generasi berakhlak mulia. Informasi lengkap & pendaftaran: https://alafiyah.sch.id/ref/KODE-MITRA",
    },
  };

  const faqs = [
    {
      q: 'Bagaimana hukum syariah komisi afiliasi di Al-Afiyah?',
      a: 'Program kemitraan ini menggunakan akad syariah Wakalah bil Ujrah (perwakilan berbayar atas jasa). Mitra bertindak sebagai wakil yang menyosialisasikan informasi sekolah dan berhak menerima ujrah (upah komisi) yang jelas, pasti, halal, tanpa riba ataupun skema piramida/MLM tersembunyi.',
    },
    {
      q: 'Kapan komisi dicairkan ke rekening bank saya?',
      a: 'Komisi pendaftaran formulir (Rp 50.000) diverifikasi dan dicairkan seketika saat calon wali murid melunasi biaya formulir. Sedangkan komisi registrasi ulang dicairkan ke rekening bank mitra (BSI, BRI, BCA, Mandiri, dll.) saat santri menyelesaikan daftar ulang.',
    },
    {
      q: 'Apakah pendaftaran mitra afiliasi ini dipungut biaya?',
      a: '100% Gratis tanpa biaya pendaftaran, tanpa modal awal, dan tanpa target kuota wajib. Anda bebas menyebarkan tautan kapan saja sesuai keluangan waktu Anda.',
    },
    {
      q: 'Bagaimana saya memantau siapa saja yang mendaftar lewat link saya?',
      a: 'Setiap mitra mendapatkan akses ke Dasbor Afiliasi Pribadi secara real-time. Anda dapat melihat daftar nama calon santri, status verifikasi berkas, konfirmasi pembayaran, dan total saldo komisi yang siap dicairkan.',
    },
    {
      q: 'Apakah sekolah menyediakan materi promosi dan brosur?',
      a: 'Ya, di dalam Dasbor Mitra tersedia materi grafis resmi siap sebar, brosur digital interaktif, caption WhatsApp/Instagram, serta template pesan yang bisa langsung Anda bagikan.',
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between selection:bg-emerald-100 selection:text-emerald-900 font-sans antialiased text-slate-800">
      <Navbar />

      {/* =========================================================================
          1. HERO SECTION: Dignified Midnight Navy (Clean, Academic, Zero Neon)
         ========================================================================= */}
      <section className="relative bg-[#0B1528] text-white pt-28 pb-20 sm:pt-36 lg:pt-40 lg:pb-28 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Authentic Copy & Calm Dignified CTAs */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Restrained Badge */}
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-800/90 border border-slate-700 text-slate-200 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Program Kemitraan Dakwah &amp; Kebaikan TP 2027/2028</span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
                Sebar Kebaikan,{' '}
                <span className="text-amber-400 block sm:inline">
                  Apresiasi Berkah Masuk Rekening.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-slate-300 text-sm sm:text-base lg:text-lg max-w-2xl leading-relaxed">
                Program kemitraan resmi Yayasan Pendidikan Imam Bonjol Al-Afiyah (TK IT, SD IT, SMP IT) yang berlandaskan amanah, transparansi, dan akad syariah Wakalah bil Ujrah. Rekomendasikan calon santri, pantau pendaftaran real-time, dan nikmati apresiasi komisi nyata setiap bulan.
              </p>

              {/* Solid Dignified CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button
                  onClick={() => openRegisterWithPersona()}
                  className="px-7 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-sm sm:text-base transition-colors shadow-sm flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
                >
                  <span>Daftar Mitra Afiliasi (Gratis)</span>
                  <ArrowRight className="w-4 h-4 text-emerald-200" />
                </button>

                <a
                  href="#kalkulator"
                  className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white font-semibold text-sm sm:text-base transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>Simulasi Komisi Syirkah</span>
                </a>
              </div>

              {/* Clean Monochromatic SVG Trust Badges */}
              <div className="pt-6 flex flex-wrap items-center gap-3 text-xs text-slate-300 border-t border-slate-800">
                <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-800/60 border border-slate-700/80">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-medium text-slate-300">Akad Syariah Wakalah</span>
                </div>
                <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-800/60 border border-slate-700/80">
                  <Wallet className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-medium text-slate-300">Pencairan Cepat ke Bank</span>
                </div>
                <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-800/60 border border-slate-700/80">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-medium text-slate-300">Pantau Calon Santri Real-Time</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Mockup Dashboard Card (Refined SaaS Executive Look) */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Card */}
                <div className="relative bg-[#131F37] border border-slate-700/90 rounded-2xl p-6 sm:p-7 shadow-xl space-y-4 text-left">
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-3.5 border-b border-slate-700/80">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 text-white flex items-center justify-center font-bold text-xs">
                        MA
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white tracking-wide">Mitra Al-Afiyah</h4>
                        <p className="text-[11px] text-slate-400">ID: AFY-2027-089 • Ma&apos;had Al-Afiyah</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
                      <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Terverifikasi</span>
                    </span>
                  </div>

                  {/* Monospace Referral Link Row with Clear Feedback */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-medium text-slate-300">Tautan Unik Rujukan:</span>
                      <span className="text-[10px] text-slate-400">Siap Dibagikan</span>
                    </div>
                    <div className="flex items-center space-x-2 p-1.5 rounded-xl bg-[#0B1426] border border-slate-700">
                      <div className="flex-1 min-w-0 px-2.5 py-1 font-mono text-xs text-slate-200 truncate">
                        alafiyah.sch.id/ref/<span className="font-bold text-white">MITRA-BERKAH</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleHeroCopy}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center space-x-1.5 ${
                          heroCopied
                            ? 'bg-emerald-700 text-white'
                            : 'bg-slate-200 hover:bg-white text-slate-900'
                        }`}
                      >
                        {heroCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-white" />
                            <span>Tersalin!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-700" />
                            <span>Salin</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Live Mini Metrics Grid */}
                  <div className="grid grid-cols-2 gap-3 pt-0.5">
                    <div className="p-3.5 rounded-xl bg-[#0B1426] border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Santri Terdaftar</span>
                      <p className="text-xl font-bold text-white mt-0.5">3 <span className="text-xs text-slate-400 font-normal">Murid</span></p>
                      <p className="text-[11px] text-slate-400 mt-1 flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>Berkas Terverifikasi</span>
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#0B1426] border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Potensi Ujrah</span>
                      <p className="text-xl font-bold text-white mt-0.5">Rp 1.150.000</p>
                      <p className="text-[11px] text-slate-400 mt-1">Pencairan Bank Syariah</p>
                    </div>
                  </div>

                  {/* Clean Activity Ticker */}
                  <div className="p-2.5 rounded-lg bg-[#0B1426] border border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center space-x-2 truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                      <span className="truncate">Rujukan baru: <span className="text-slate-200 font-medium">Farhan (SD IT)</span></span>
                    </div>
                    <span className="text-slate-300 font-mono text-xs shrink-0 ml-2 font-semibold">+Rp 400.000</span>
                  </div>

                  {/* Action Link to Portal */}
                  <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-700/80">
                    <span className="text-slate-400">Sudah terdaftar sebagai mitra?</span>
                    <Link
                      href="/affiliate/dashboard"
                      className="text-slate-200 hover:text-white font-bold inline-flex items-center space-x-1"
                    >
                      <span>Masuk Dasbor</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          2. INTERACTIVE SYIRKAH / COMMISSION CALCULATOR (Clean Light Executive Style)
         ========================================================================= */}
      <section id="kalkulator" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200 text-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-emerald-100 text-emerald-900 border border-emerald-200 mb-3">
              <Scale className="w-3.5 h-3.5 text-emerald-700" />
              <span>KALKULATOR APRESIASI SYIRKAH</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Hitung Estimasi Komisi &amp; Hak Ujrah Anda
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              Kalkulasi riil dan transparan berbasis akad Wakalah bil Ujrah. Tanpa modal awal, tanpa biaya pendaftaran, dan tanpa potongan sepihak.
            </p>
          </div>

          {/* Calculator Card Container */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-9 shadow-sm space-y-6 text-left">
            
            {/* 1. Unit Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 flex items-center space-x-1.5">
                <Sliders className="w-3.5 h-3.5 text-slate-500" />
                <span>Pilih Jenjang Sekolah Target:</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'all', label: 'Semua Jenjang', rate: 'Rata-rata Rp 425rb/murid' },
                  { id: 'tk', label: 'TK IT Al-Afiyah', rate: 'Total Rp 300rb/murid' },
                  { id: 'sd', label: 'SD IT Al-Afiyah', rate: 'Total Rp 400rb/murid' },
                  { id: 'smp', label: 'SMP IT Al-Afiyah', rate: 'Total Rp 550rb/murid' },
                ].map((unit) => {
                  const isActive = calcUnit === unit.id;
                  return (
                    <button
                      key={unit.id}
                      type="button"
                      onClick={() => setCalcUnit(unit.id as any)}
                      className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <p className={`text-xs font-bold ${isActive ? 'text-white' : 'text-slate-900'}`}>
                        {unit.label}
                      </p>
                      <p className={`text-[11px] mt-0.5 ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>
                        {unit.rate}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Slider with Clean Quantity Badge & Chips */}
            <div className="space-y-4 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="studentSlider" className="text-xs font-semibold text-slate-700">
                    Jumlah Santri yang Anda Referensikan:
                  </label>
                  <p className="text-[11px] text-slate-500">Geser slider atau pilih kuota di bawah</p>
                </div>
                <div className="px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-900 flex items-center space-x-1 font-mono">
                  <span className="text-lg font-bold">{calcStudents}</span>
                  <span className="text-xs text-slate-600">Santri</span>
                </div>
              </div>

              {/* Range Slider */}
              <input
                id="studentSlider"
                aria-label="Jumlah Santri yang Direferensikan"
                type="range"
                min="1"
                max="20"
                step="1"
                value={calcStudents}
                onChange={(e) => setCalcStudents(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-700 focus:outline-hidden"
              />

              {/* Quick Select Chips */}
              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                <span className="text-[11px] text-slate-500 mr-1">Rekomendasi Target:</span>
                {[3, 5, 8, 10, 15, 20].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setCalcStudents(num)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                      calcStudents === num
                        ? 'bg-slate-900 text-white font-bold shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    {num} Murid
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Transparent Breakdown Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {/* Box 1: Formulir */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                  Tahap 1: Formulir
                </span>
                <p className="text-xl font-bold text-slate-900 tracking-tight font-mono">
                  <AnimatedRupiah value={formUjrahTotal} />
                </p>
                <p className="text-[11px] text-slate-500">
                  Rp 50.000 × {calcStudents} murid • Cair saat formulir lunas
                </p>
              </div>

              {/* Box 2: Registrasi / Daftar Ulang */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                  Tahap 2: Daftar Ulang
                </span>
                <p className="text-xl font-bold text-slate-900 tracking-tight font-mono">
                  <AnimatedRupiah value={regUjrahTotal} />
                </p>
                <p className="text-[11px] text-slate-500">
                  Rata-rata registrasi resmi per santri
                </p>
              </div>

              {/* Box 3: Total Take-Home Commission */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                <span className="text-[11px] text-emerald-900 uppercase tracking-wider font-bold">
                  Total Estimasi Komisi
                </span>
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-800 tracking-tight font-mono">
                  <AnimatedRupiah value={totalCalcCommission} />
                </p>
                <p className="text-[11px] text-emerald-700">
                  Hak ujrah bersih langsung ke rekening Anda
                </p>
              </div>
            </div>

            {/* 4. Akad Syariah Wakalah bil Ujrah Note */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start space-x-3.5 text-xs text-slate-700">
              <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h5 className="font-bold text-slate-900">
                  Prinsip Syariah: Akad Wakalah bil Ujrah (Bebas Riba &amp; Gharar)
                </h5>
                <p className="text-slate-600 leading-relaxed text-[11px] sm:text-xs">
                  Sistem apresiasi kemitraan Al-Afiyah berpegang pada fatwa akad perwakilan atas jasa (Wakalah bil Ujrah). Upah bersifat pasti (*ma&apos;lum*), transparan, tanpa unsur manipulatif atau piramida MLM, dan ditujukan semata untuk menyiarkan pendidikan Islam yang barakah.
                </p>
              </div>
            </div>

            {/* 5. Direct Action CTA */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-100">
              <div>
                <p className="text-xs text-slate-800 font-semibold">
                  Siap menjadi jembatan kebaikan untuk {calcStudents} santri baru?
                </p>
                <p className="text-[11px] text-slate-500">Pendaftaran akun mitra gratis dan langsung aktif dalam 1 menit.</p>
              </div>
              <button
                type="button"
                onClick={() => openRegisterWithPersona()}
                className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-xs flex items-center justify-center space-x-2 transition-colors cursor-pointer"
              >
                <span>Kunci Estimasi &amp; Daftar Sekarang</span>
                <ArrowRight className="w-4 h-4 text-emerald-200" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          3. PERSONA SECTION WITH SMOOTH FRAMER MOTION TRANSITIONS
         ========================================================================= */}
      <section id="persona" className="py-20 sm:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-emerald-100 text-emerald-800 border border-emerald-200 mb-3">
              PERSONA KEMITRAAN
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Program Ini Dirancang Khusus untuk Anda
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mt-2">
              Pilih peran Anda dan lihat bagaimana program ini memberikan nilai nyata bagi Anda dan keluarga.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex p-1.5 bg-slate-100 rounded-2xl border border-slate-200 shadow-2xs gap-1 sm:gap-2 overflow-x-auto max-w-full">
              {[
                { id: 'wali', label: 'Wali Murid', icon: Users },
                { id: 'guru', label: 'Guru & Asatidz', icon: School },
                { id: 'alumni', label: 'Alumni Santri', icon: GraduationCap },
                { id: 'relawan', label: 'Penggiat Dakwah', icon: Sparkles },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activePersonaTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActivePersonaTab(tab.id as any)}
                    className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Persona Card with Smooth Framer Motion Transition */}
          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              {Object.entries(personaData).map(([key, item]) => {
                if (key !== activePersonaTab) return null;
                const Icon = item.icon;
                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 12, scale: 0.99 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -12, scale: 0.99 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm space-y-6 text-left"
                  >
                    {/* Card Top */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
                      <div className="flex items-center space-x-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-white text-emerald-800 flex items-center justify-center border border-slate-200 shadow-2xs">
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                              {item.badge}
                            </span>
                            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-100 text-[10px] font-semibold text-emerald-900 border border-emerald-200">
                              <BadgeCheck className="w-3 h-3 text-emerald-700" />
                              <span>Lencana Resmi Mitra</span>
                            </span>
                          </div>
                          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                            {item.title}
                          </h3>
                        </div>
                      </div>

                      <button
                        onClick={() => openRegisterWithPersona(key as any)}
                        className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center space-x-1.5 self-start sm:self-auto"
                      >
                        <span>Daftar Sebagai {tabTitleMap(key)}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-emerald-200" />
                      </button>
                    </div>

                    <p className="text-sm sm:text-base font-semibold text-slate-800 leading-snug">
                      {item.subtitle}
                    </p>

                    {/* Dual Highlight Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Persona Specific Advantage */}
                      <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 space-y-1.5">
                        <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center space-x-1.5">
                          <Wallet className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Keuntungan Spesifik: {item.advantageTitle}</span>
                        </h4>
                        <p className="text-xs text-emerald-950 font-medium leading-relaxed">
                          {item.advantageText}
                        </p>
                      </div>

                      {/* Why it works */}
                      <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1.5">
                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
                          <Zap className="w-3.5 h-3.5 text-amber-500" />
                          <span>Mengapa Ini Sangat Tepat?</span>
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {item.why}
                        </p>
                      </div>
                    </div>

                    {/* Earning Scenario Display */}
                    <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-0.5">
                          Simulasi Manfaat Nyata:
                        </span>
                        <p className="text-xs sm:text-sm font-medium text-slate-200">
                          {item.earningExample}
                        </p>
                      </div>
                      <span className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-white/10 text-slate-300 shrink-0 self-start sm:self-auto border border-white/10">
                        Cair Otomatis Tiap Bulan
                      </span>
                    </div>

                    {/* Broadcast Message Ready to Share */}
                    <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-900 flex items-center space-x-1.5">
                          <MessageCircle className="w-3.5 h-3.5 text-amber-600" />
                          <span>Contoh Pesan Siap Sebar ke WhatsApp:</span>
                        </span>
                        <button
                          onClick={() => handleCopyText(item.template, key)}
                          className="text-xs font-bold text-amber-800 hover:text-amber-950 inline-flex items-center space-x-1 cursor-pointer"
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
                      <p className="text-xs text-slate-700 italic bg-white p-3 rounded-xl border border-amber-200/40 leading-relaxed font-sans">
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
          4. 5-STEP HOW IT WORKS (Tactile Stepper)
         ========================================================================= */}
      <section className="py-20 sm:py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-emerald-100 text-emerald-800 border border-emerald-200 mb-3">
              ALUR KERJA
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              5 Langkah Mudah Menjadi Mitra Afiliasi
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mt-2">
              Proses registrasi dan pembagian tautan berlangsung singkat, tanpa instalasi aplikasi tambahan.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              {
                step: '01',
                title: 'Daftar Akun',
                desc: 'Isi formulir pendaftaran gratis dalam 1 menit tanpa dipungut biaya apa pun.',
              },
              {
                step: '02',
                title: 'Dapat Link Unik',
                desc: 'Masuk ke dasbor dan salin tautan rujukan resmi bertanda nama Anda.',
              },
              {
                step: '03',
                title: 'Sebar Tautan',
                desc: 'Bagikan informasi PPDB ke kerabat, status WhatsApp, atau grup majelis.',
              },
              {
                step: '04',
                title: 'Pantau Real-Time',
                desc: 'Cek perkembangan pendaftaran dan verifikasi santri langsung di dasbor.',
              },
              {
                step: '05',
                title: 'Komisi Masuk',
                desc: 'Komisi otomatis ditransfer langsung ke rekening bank terdaftar Anda.',
              },
            ].map((s) => (
              <div
                key={s.step}
                className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all text-center flex flex-col items-center group"
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-900 text-amber-400 font-extrabold text-sm flex items-center justify-center mb-4 shadow-xs">
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
          5. EMBEDDED REGISTRATION FORM SECTION (Midnight Navy, Zero Neon)
         ========================================================================= */}
      <section id="daftar" className="py-20 sm:py-24 bg-[#0B1528] text-white relative border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Direct Invitation */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-slate-800 text-slate-300 border border-slate-700">
                Pendaftaran Terbuka
              </span>

              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Mulai Sebarkan Kebaikan,<br />
                Raih Manfaat Berkah.
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-lg">
                Daftarkan diri Anda hari ini. Akun Anda langsung aktif seketika dan tautan rujukan personal siap digunakan untuk membantu generasi muslim masa depan.
              </p>

              <div className="space-y-3.5 pt-2">
                {[
                  'Tanpa biaya pendaftaran & tanpa modal sepeser pun',
                  'Akses dasbor pelacakan pendaftar 24/7 real-time',
                  'Pencairan komisi rutin langsung ke rekening pribadi',
                  'Didukung materi promosi digital resmi dari Ma\'had Al-Afiyah',
                ].map((point, idx) => (
                  <div key={idx} className="flex items-center space-x-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-slate-200">
                      {point}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Registration Form */}
            <div className="lg:col-span-6">
              <div className="bg-white rounded-3xl p-6 sm:p-9 shadow-xl text-slate-900 border border-slate-100 max-w-md mx-auto lg:max-w-none text-left">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-slate-900">Formulir Pendaftaran Mitra</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Isi data diri Anda di bawah ini untuk mengaktifkan akun afiliasi resmi.
                  </p>
                </div>

                {/* Persona Role Tag Banner if selected */}
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
                  {/* Nama Lengkap */}
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
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-hidden transition-all"
                    />
                  </div>

                  {/* Email & Nomor WhatsApp */}
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
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-hidden transition-all"
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
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-hidden transition-all"
                      />
                    </div>
                  </div>

                  {/* Kata Sandi */}
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
                          className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-600 outline-hidden pr-9"
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
                          className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-600 outline-hidden pr-9"
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

                  {/* Rekening & Kode Referral */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setShowBankDetails(!showBankDetails)}
                      className="text-xs text-emerald-800 hover:text-emerald-900 font-bold inline-flex items-center space-x-1 cursor-pointer"
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

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-4 py-3.5 px-6 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm shadow-xs transition-colors flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer"
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
                      <Link href="/affiliate/dashboard" className="text-emerald-800 font-bold hover:underline">
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
          6. FAQ ACCORDION SECTION
         ========================================================================= */}
      <section className="py-20 sm:py-24 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-slate-100 text-slate-700 border border-slate-200 mb-3">
              FAQ
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
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
                  className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-5 text-left flex items-center justify-between space-x-4 cursor-pointer hover:bg-slate-50/80 transition-colors"
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
          QUICK REGISTRATION POPUP MODAL (Role-Aware)
         ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 max-w-lg w-full p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto text-left relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-100">
                  <Sparkles className="w-5 h-5 text-emerald-700" />
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

            {/* Persona Role Tag Banner if selected */}
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
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
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
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-600 outline-hidden"
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
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-600 outline-hidden"
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
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-600 outline-hidden"
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
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-600 outline-hidden"
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
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-600 outline-hidden"
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
                  className="w-full py-3 px-6 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer"
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
      return 'Alumni Santri';
    case 'relawan':
      return 'Penggiat Dakwah';
    default:
      return 'Mitra';
  }
}
