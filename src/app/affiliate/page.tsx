'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyMobileBar from '@/components/layout/StickyMobileBar';
import confetti from 'canvas-confetti';
import {
  ArrowRight,
  Users,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  TrendingUp,
  Award,
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
  ArrowUpRight
} from 'lucide-react';

export default function AffiliatePublicPage() {
  const router = useRouter();

  // State: Hero Live Card Copy Interaction
  const [heroCopied, setHeroCopied] = useState(false);
  const handleHeroCopy = () => {
    navigator.clipboard.writeText('https://alafiyah.sch.id/ref/MITRA-BERKAH');
    setHeroCopied(true);
    setTimeout(() => setHeroCopied(false), 2500);
  };

  // State: Registration Modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State: Persona Tabs
  const [activePersonaTab, setActivePersonaTab] = useState<'wali' | 'guru' | 'alumni' | 'relawan'>('wali');
  const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null);

  // State: Reward Simulator Tabs
  const [rewardTab, setRewardTab] = useState<'paket' | 'kalkulator'>('paket');
  const [tkCount, setTkCount] = useState(3);
  const [sdCount, setSdCount] = useState(6);
  const [smpCount, setSmpCount] = useState(3);

  const totalMuridCustom = tkCount + sdCount + smpCount;
  // Formula transparan Al-Afiyah: Formulir 50k + Kelulusan & Registrasi (TK 250k, SD 350k, SMP 500k)
  const customFormCommission = totalMuridCustom * 50000;
  const customEnrollCommission = (tkCount * 250000) + (sdCount * 350000) + (smpCount * 500000);
  const totalCommissionCustom = customFormCommission + customEnrollCommission;

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
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
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

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Persona Data Content
  const personaData = {
    wali: {
      badge: 'Wali Murid & Komite',
      title: 'Wali Murid & Keluarga Besar Al-Afiyah',
      subtitle: 'Pengalaman nyata putra-putri Anda adalah rekomendasi terbaik bagi sesama orang tua.',
      icon: Users,
      why: 'Sebagai orang tua yang telah merasakan langsung lingkungan islami, tahfidz, dan kenyamanan belajar di Al-Afiyah, cerita tulus Anda sangat dipercaya oleh keluarga, tetangga, dan rekan kerja yang sedang mencari sekolah terbaik.',
      earningExample: 'Rekomendasikan 4 anak kerabat masuk SD IT & SMP IT = Rp 1.600.000 komisi tunai masuk ke rekening Anda.',
      template: 'Assalamu\'alaikum wr. wb. Ayah/Bunda, bagi yang sedang mencari sekolah Islam berkualitas dengan bimbingan tahfidz intensif dan karakter qurani di Majalengka, PPDB Al-Afiyah (TK, SD, SMP) kini sudah dibuka. Informasi dan pendaftaran resmi bisa dicek langsung di tautan ini: https://alafiyah.sch.id/ref/KODE-MITRA',
    },
    guru: {
      badge: 'Dewan Guru & Asatidz',
      title: 'Dewan Guru, Asatidz & Tenaga Pendidik',
      subtitle: 'Bantu murid dan santri binaan melanjutkan pendidikan ke jenjang lanjutan terbaik.',
      icon: School,
      why: 'Guru dan asatidz memiliki peran sentral dalam mengarahkan masa depan santri. Melalui program kemitraan dakwah ini, setiap santri yang Anda bimbing untuk melanjutkan ke jenjang TK, SD, maupun SMP IT Al-Afiyah diapresiasi dengan komisi berkah.',
      earningExample: 'Rekomendasikan 6 santri lulusan melanjutkan ke SMP IT Al-Afiyah = Rp 3.300.000 komisi pendidik langsung cair.',
      template: 'Bismillah. Untuk wali murid dan adik-adik santri yang mencari kelanjutan sekolah terpadu dengan kurikulum unggul, hafalan Al-Qur\'an, dan pembiasaan adab harian, kami merekomendasikan Ma\'had Al-Afiyah Majalengka. Pendaftaran online dapat diakses melalui link resmi: https://alafiyah.sch.id/ref/KODE-MITRA',
    },
    alumni: {
      badge: 'Alumni Santri',
      title: 'Alumni Santri & Pelajar Al-Afiyah',
      subtitle: 'Jadilah jembatan kebaikan untuk adik kelas dan generasi penerus almamater tercinta.',
      icon: GraduationCap,
      why: 'Anda adalah bukti hidup kualitas pendidikan karakter Al-Afiyah. Ajak adik kandung, sepupu, atau rekan di majelis untuk merasakan manfaat belajar di Al-Afiyah, sekaligus memperoleh penghasilan mandiri yang halal dan fleksibel.',
      earningExample: 'Ajak 3 sanak famili bergabung di Ma\'had Al-Afiyah = Rp 1.150.000 siap ditransfer ke rekening mahasiswa/alumni Anda.',
      template: 'Hai semuanya! Buat yang nanya sekolah Islam favorit di Majalengka yang lingkungan santrinya asik dan fokus tahfidz, aku sangat rekomendasikan Al-Afiyah. Saat ini gelombang PPDB sudah dibuka, langsung daftar lewat link ini ya: https://alafiyah.sch.id/ref/KODE-MITRA',
    },
    relawan: {
      badge: 'Penggiat Dakwah',
      title: 'Penggiat Dakwah, Majelis & Relawan Sosial',
      subtitle: 'Syiarkan nilai pendidikan qurani sembari membangun sumber rezeki yang barakah.',
      icon: Sparkles,
      why: 'Bagi Anda yang aktif di majelis taklim, komunitas kebaikan, atau media sosial dakwah, program kemitraan ini adalah sarana menyebarkan alternatif pendidikan bernilai Islam tanpa biaya modal sepeser pun.',
      earningExample: 'Sebar tautan di komunitas dan jaring 10 santri baru = Rp 3.800.000 komisi transparan.',
      template: 'Alhamdulillah, pendaftaran santri baru Yayasan Pendidikan Imam Bonjol Al-Afiyah Majalengka (TK IT, SD IT, SMP IT) tahun ajaran 2027/2028 telah dibuka. Mari siapkan generasi berakhlak mulia. Informasi lengkap & pendaftaran: https://alafiyah.sch.id/ref/KODE-MITRA',
    },
  };

  const faqs = [
    {
      q: 'Bagaimana hukum syariah komisi afiliasi di Al-Afiyah?',
      a: 'Program kemitraan ini menggunakan akad syariah Wakalah bil Ujrah (perwakilan berbayar atas jasa). Mitra bertindak sebagai wakil yang menyosialisasikan informasi sekolah dan berhak menerima ujrah (upah komisi) yang jelas, transparan, halal, tanpa riba ataupun skema piramida tersembunyi.',
    },
    {
      q: 'Kapan komisi dicairkan ke rekening bank saya?',
      a: 'Komisi pendaftaran formulir diverifikasi secara real-time saat calon wali murid melunasi biaya formulir. Sedangkan komisi daftar ulang dicairkan setiap bulan langsung ke rekening bank mitra yang didaftarkan (BSI, BRI, BCA, Mandiri, dll.).',
    },
    {
      q: 'Apakah pendaftaran mitra afiliasi ini dipungut biaya?',
      a: '100% Gratis tanpa biaya pendaftaran, tanpa modal awal, dan tanpa target kuota wajib. Anda bebas menyebarkan tautan kapan saja sesuai kemudahan Anda.',
    },
    {
      q: 'Bagaimana saya memantau siapa saja yang mendaftar lewat link saya?',
      a: 'Setiap mitra mendapatkan akses ke Dasbor Afiliasi Pribadi secara real-time. Anda dapat melihat daftar nama calon santri, status verifikasi berkas, konfirmasi pembayaran, dan total saldo komisi yang siap dicairkan.',
    },
    {
      q: 'Apakah sekolah menyediakan materi promosi dan brosur?',
      a: 'Ya, di dalam Dasbor Mitra tersedia materi grafis siap sebar, brosur digital resmi, copy caption WhatsApp/Instagram, serta template pesan yang bisa langsung Anda bagikan.',
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between selection:bg-emerald-100 selection:text-emerald-900 font-sans antialiased text-slate-800">
      <Navbar />

      {/* =========================================================================
          1. HERO SECTION (Dark Luxury Navy + Live Partner Card Experience)
         ========================================================================= */}
      <section className="relative bg-[#07131F] text-white pt-28 pb-20 sm:pt-36 lg:pt-40 lg:pb-28 overflow-hidden border-b border-slate-800">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-0 w-[30rem] h-[30rem] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Authentic Copy & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Honest Badge */}
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Program Kemitraan Dakwah &amp; Kebaikan TP 2027/2028</span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
                Sebar Kebaikan,{' '}
                <span className="text-amber-400 block sm:inline">
                  Komisi Berkah Masuk Rekening.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-slate-300 text-sm sm:text-base lg:text-lg max-w-2xl leading-relaxed">
                Program kemitraan resmi Yayasan Pendidikan Imam Bonjol Al-Afiyah (TK IT, SD IT, SMP IT) yang transparan, amanah, dan berbasis akad syariah. Cukup bagikan tautan rujukan Anda, pantau calon santri secara real-time, dan nikmati apresiasi komisi nyata setiap bulan.
              </p>

              {/* CTA Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-sm sm:text-base transition-all duration-200 shadow-lg shadow-amber-400/25 hover:shadow-amber-400/40 flex items-center justify-center space-x-2 group cursor-pointer active:scale-98"
                >
                  <span>Daftar Mitra Afiliasi (Gratis)</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>

                <a
                  href="#komisi"
                  className="px-7 py-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-white font-semibold text-sm sm:text-base transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>Pelajari Skema &amp; Simulasi</span>
                </a>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-400 border-t border-slate-800/80">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Akad Syariah Wakalah</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Wallet className="w-4 h-4 text-amber-400" />
                  <span>Pencairan Cepat ke Bank</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  <span>Pantau Calon Santri Real-Time</span>
                </div>
              </div>
            </div>

            {/* Right Column: Live Interactive Partner Experience Card (Zero Slop!) */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                {/* Glow Backdrop */}
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-amber-500/20 to-teal-500/20 rounded-3xl blur-xl opacity-75" />

                {/* Main Card */}
                <div className="relative bg-slate-900/90 backdrop-blur-xl border border-slate-700/70 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 text-left">
                  
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold text-sm">
                        MA
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-bold text-white">Mitra Al-Afiyah</h4>
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        </div>
                        <p className="text-[11px] text-slate-400">Akun Terverifikasi • Ma&apos;had Al-Afiyah</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300">
                      Tier Aktif
                    </span>
                  </div>

                  {/* Interactive Referral Link Box */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
                      <span>Tautan Unik Rujukan Anda:</span>
                      <span className="text-[10px] text-emerald-400 font-mono">Siap Dibagikan</span>
                    </label>
                    <div className="flex items-center space-x-2 p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                      <div className="flex-1 min-w-0 px-2 font-mono text-xs text-amber-300 truncate">
                        alafiyah.sch.id/ref/<span className="font-bold text-white">MITRA-BERKAH</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleHeroCopy}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                          heroCopied
                            ? 'bg-emerald-500 text-white'
                            : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
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
                            <span>Salin</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Live Mini Metrics Grid */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/50">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Santri Terdaftar</span>
                      <p className="text-xl font-bold text-white mt-0.5">3 <span className="text-xs text-slate-400 font-normal">Murid</span></p>
                      <p className="text-[10px] text-emerald-400 mt-0.5 flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Formulir Terverifikasi</span>
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/50">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Potensi Komisi</span>
                      <p className="text-xl font-bold text-emerald-400 mt-0.5">Rp 1.150.000</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Pencairan Bank BSI</p>
                    </div>
                  </div>

                  {/* Action Link to Portal */}
                  <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-800">
                    <span className="text-slate-400">Sudah terdaftar sebagai mitra?</span>
                    <Link
                      href="/affiliate/dashboard"
                      className="text-amber-400 hover:text-amber-300 font-bold inline-flex items-center space-x-1"
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
          2. PERSONA SECTION WITH INTERACTIVE ANIMATED TABS
         ========================================================================= */}
      <section id="persona" className="py-20 sm:py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
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

          {/* Animated Tab Switcher */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex p-1.5 bg-white rounded-2xl border border-slate-200 shadow-2xs gap-1 sm:gap-2 overflow-x-auto max-w-full">
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
                        ? 'bg-slate-900 text-white shadow-xs scale-100'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Animated Persona Card Content */}
          <div className="max-w-4xl mx-auto">
            {Object.entries(personaData).map(([key, item]) => {
              if (key !== activePersonaTab) return null;
              const Icon = item.icon;
              return (
                <div
                  key={key}
                  className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-6 text-left animate-fadeIn"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                    <div className="flex items-center space-x-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                          {item.badge}
                        </span>
                        <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                          {item.title}
                        </h3>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
                    >
                      Daftar Sebagai {tabTitleMap(key)} &rarr;
                    </button>
                  </div>

                  <p className="text-sm sm:text-base font-semibold text-slate-800">
                    {item.subtitle}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                        <span>Mengapa Ini Sangat Tepat?</span>
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {item.why}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/70">
                      <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
                        <Wallet className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Simulasi Hasil Nyata</span>
                      </h4>
                      <p className="text-xs text-emerald-900 font-medium leading-relaxed">
                        {item.earningExample}
                      </p>
                    </div>
                  </div>

                  {/* Broadcast Message Ready to Share */}
                  <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-900 flex items-center space-x-1.5">
                        <MessageCircle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Contoh Teks Siap Sebar ke WhatsApp:</span>
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
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* =========================================================================
          3. REWARD & SIMULATOR WITH ANIMATED TABS & SLIDERS
         ========================================================================= */}
      <section id="komisi" className="py-20 sm:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-amber-100 text-amber-800 border border-amber-200 mb-3">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>SKEMA KOMISI &amp; REWARD</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Apresiasi Nyata Tanpa Potongan Tersembunyi
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mt-2">
              Setiap santri yang Anda referensikan mendapatkan hak bimbingan terbaik, dan Anda mendapatkan hak komisi yang halal dan transparan.
            </p>
          </div>

          {/* Tab Switcher: Paket Standar vs Kalkulator Kustom */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex p-1 bg-slate-100 rounded-2xl border border-slate-200 gap-1">
              <button
                onClick={() => setRewardTab('paket')}
                className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  rewardTab === 'paket'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Pilihan Paket Proyeksi
              </button>
              <button
                onClick={() => setRewardTab('kalkulator')}
                className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                  rewardTab === 'kalkulator'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Kalkulator Interaktif Kustom</span>
              </button>
            </div>
          </div>

          {/* TAB 1: PAKET PROYEKSI STANDAR */}
          {rewardTab === 'paket' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch animate-fadeIn">
              
              {/* Card 1: 5 Santri */}
              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col justify-between text-left group">
                <div className="p-8">
                  <span className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">
                    SKENARIO AWAL
                  </span>
                  <h3 className="text-3xl font-extrabold text-slate-900 mt-1 mb-5">
                    5 Murid
                  </h3>

                  <div className="space-y-3 pt-4 border-t border-slate-100 text-xs">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-slate-800">Komisi Formulir</p>
                        <p className="text-[11px] text-slate-400">Rp 50.000 / orang</p>
                      </div>
                      <span className="font-bold text-slate-900 text-sm">Rp 250.000</span>
                    </div>

                    <div className="flex justify-between items-center pt-2.5 border-t border-dashed border-slate-200">
                      <div>
                        <p className="font-semibold text-slate-800">Komisi Kelulusan</p>
                        <p className="text-[11px] text-slate-400">Rata-rata Rp 350.000</p>
                      </div>
                      <span className="font-bold text-slate-900 text-sm">Rp 1.750.000</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0B1528] text-white p-6 text-center">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 block mb-1">
                    TOTAL KOMISI DITERIMA
                  </span>
                  <p className="text-2xl font-bold text-white tracking-tight">
                    Rp 2.000.000
                  </p>
                </div>
              </div>

              {/* Card 2: 15 Santri (Featured Golden Highlight) */}
              <div className="bg-white rounded-3xl border-2 border-amber-400 overflow-hidden shadow-xl lg:-translate-y-2 relative flex flex-col justify-between text-left">
                <div className="bg-amber-400 text-slate-950 text-[10px] font-extrabold tracking-widest uppercase text-center py-1.5">
                  PALING POPULER &amp; REALISTIS
                </div>

                <div className="p-8">
                  <span className="text-[11px] font-bold text-amber-700 tracking-wider uppercase">
                    SKENARIO MENENGAH
                  </span>
                  <h3 className="text-3xl font-extrabold text-slate-900 mt-1 mb-5">
                    15 Murid
                  </h3>

                  <div className="space-y-3 pt-4 border-t border-slate-100 text-xs">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-slate-800">Komisi Formulir</p>
                        <p className="text-[11px] text-slate-400">Rp 50.000 / orang</p>
                      </div>
                      <span className="font-bold text-slate-900 text-sm">Rp 750.000</span>
                    </div>

                    <div className="flex justify-between items-center pt-2.5 border-t border-dashed border-slate-200">
                      <div>
                        <p className="font-semibold text-slate-800">Komisi Kelulusan</p>
                        <p className="text-[11px] text-slate-400">Rata-rata Rp 350.000</p>
                      </div>
                      <span className="font-bold text-slate-900 text-sm">Rp 5.250.000</span>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-400 text-slate-950 p-6 text-center">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-900/80 block mb-1">
                    TOTAL KOMISI DITERIMA
                  </span>
                  <p className="text-3xl font-extrabold text-slate-950 tracking-tight">
                    Rp 6.000.000
                  </p>
                </div>
              </div>

              {/* Card 3: 30 Santri */}
              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col justify-between text-left group">
                <div className="p-8">
                  <span className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">
                    SKENARIO UTAMA
                  </span>
                  <h3 className="text-3xl font-extrabold text-slate-900 mt-1 mb-5">
                    30 Murid
                  </h3>

                  <div className="space-y-3 pt-4 border-t border-slate-100 text-xs">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-slate-800">Komisi Formulir</p>
                        <p className="text-[11px] text-slate-400">Rp 50.000 / orang</p>
                      </div>
                      <span className="font-bold text-slate-900 text-sm">Rp 1.500.000</span>
                    </div>

                    <div className="flex justify-between items-center pt-2.5 border-t border-dashed border-slate-200">
                      <div>
                        <p className="font-semibold text-slate-800">Komisi Kelulusan</p>
                        <p className="text-[11px] text-slate-400">Rata-rata Rp 350.000</p>
                      </div>
                      <span className="font-bold text-slate-900 text-sm">Rp 10.500.000</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0B1528] text-white p-6 text-center">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 block mb-1">
                    TOTAL KOMISI DITERIMA
                  </span>
                  <p className="text-2xl font-bold text-white tracking-tight">
                    Rp 12.000.000
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: KALKULATOR INTERAKTIF KUSTOM */}
          {rewardTab === 'kalkulator' && (
            <div className="max-w-2xl mx-auto bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 text-left space-y-6 shadow-sm animate-fadeIn">
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  Kalkulator Bagi Hasil Mandiri
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Geser slider di bawah untuk menghitung potensi bagi hasil sesuai target santri di tiap unit.
                </p>
              </div>

              <div className="space-y-5 text-xs">
                {/* TK IT */}
                <div>
                  <div className="flex justify-between font-bold text-slate-700 mb-1.5">
                    <span>Murid TK IT Al-Afiyah (Rp 300.000/anak):</span>
                    <span className="text-emerald-700 font-extrabold text-sm">{tkCount} Murid</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={tkCount}
                    onChange={(e) => setTkCount(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                </div>

                {/* SD IT */}
                <div>
                  <div className="flex justify-between font-bold text-slate-700 mb-1.5">
                    <span>Murid SD IT Al-Afiyah (Rp 400.000/anak):</span>
                    <span className="text-emerald-700 font-extrabold text-sm">{sdCount} Murid</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    value={sdCount}
                    onChange={(e) => setSdCount(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                </div>

                {/* SMP IT */}
                <div>
                  <div className="flex justify-between font-bold text-slate-700 mb-1.5">
                    <span>Murid SMP IT Al-Afiyah (Rp 550.000/anak):</span>
                    <span className="text-emerald-700 font-extrabold text-sm">{smpCount} Murid</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={smpCount}
                    onChange={(e) => setSmpCount(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                </div>

                {/* Calculated Result Box */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Estimasi Total Komisi ({totalMuridCustom} Santri Rujukan)
                    </span>
                    <p className="text-2xl sm:text-3xl font-extrabold text-emerald-700 tracking-tight mt-1">
                      {formatRupiah(totalCommissionCustom)}
                    </p>
                  </div>

                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                  >
                    Daftar Sekarang &rarr;
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* =========================================================================
          4. 5-STEP HOW IT WORKS (Modern Minimalist Stepper)
         ========================================================================= */}
      <section className="py-20 sm:py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-blue-100 text-blue-800 border border-blue-200 mb-3">
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
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all text-center flex flex-col items-center"
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
          5. EMBEDDED REGISTRATION FORM SECTION (Functional & Direct)
         ========================================================================= */}
      <section id="daftar" className="py-20 sm:py-24 bg-[#07131F] text-white relative overflow-hidden">
        {/* Glow ambient */}
        <div className="absolute top-1/2 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Direct Invitation */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-amber-400/10 border border-amber-400/30 text-amber-400">
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
                    <div className="w-5 h-5 rounded-full bg-emerald-400/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-slate-200">
                      {point}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Real Functional Registration Form */}
            <div className="lg:col-span-6">
              <div className="bg-white rounded-3xl p-6 sm:p-9 shadow-2xl text-slate-900 border border-slate-100 max-w-md mx-auto lg:max-w-none text-left">
                
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-slate-900">Formulir Pendaftaran Mitra</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Isi data diri Anda di bawah ini untuk mengaktifkan akun afiliasi.
                  </p>
                </div>

                {errorMessage && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700">
                    {errorMessage}
                  </div>
                )}

                {successMessage && (
                  <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700 flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
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
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
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
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
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
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
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
                          className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none pr-9"
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
                          className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none pr-9"
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
                      className="text-xs text-emerald-700 hover:text-emerald-800 font-bold inline-flex items-center space-x-1 cursor-pointer"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>{showBankDetails ? 'Tutup Pengaturan Rekening' : '+ Atur Rekening Bank & Kode Kustom'}</span>
                      {showBankDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>

                    {showBankDetails && (
                      <div className="mt-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 animate-fadeIn">
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
                    className="w-full mt-4 py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-sm shadow-md shadow-amber-400/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer active:scale-98"
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
                      <Link href="/affiliate/dashboard" className="text-emerald-700 font-bold hover:underline">
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
          QUICK REGISTRATION POPUP MODAL (When clicking CTA anywhere)
         ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto text-left relative">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Daftar Mitra Afiliasi
                  </h3>
                  <p className="text-[11px] text-slate-400">Gratis • Langsung Aktif • Akad Syariah</p>
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
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
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
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
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
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
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
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
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
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
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
                  className="w-full py-3 px-6 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer"
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
