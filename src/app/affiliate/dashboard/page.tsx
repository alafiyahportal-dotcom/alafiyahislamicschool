'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Wallet, 
  Users, 
  Copy, 
  Check, 
  ArrowUpRight, 
  LogOut, 
  Building2, 
  Clock, 
  CheckCircle2, 
  Share2,
  QrCode,
  Download,
  AlertCircle,
  Loader2,
  MessageSquare,
  Send,
  HelpCircle,
  TrendingUp,
  Award,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  X
} from 'lucide-react';

interface AffiliateConversionItem {
  id: string;
  studentName: string;
  registrationNo: string;
  schoolName: string;
  schoolSlug: string;
  commissionAmount: number;
  status: string;
  createdAt: string;
}

interface AffiliateProfileData {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  referralCode: string;
  customSlug: string;
  bankName: string;
  bankAccountNumber: string;
  bankAccountHolder: string;
  balance: number;
  totalEarned: number;
  totalStudents: number;
  verifiedStudents: number;
  pendingStudents: number;
  tier: string;
  nextTierTarget: number;
  tierProgress: number;
  conversions: AffiliateConversionItem[];
}

export default function AffiliateDashboardPage() {
  const [profile, setProfile] = useState<AffiliateProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null);

  // Conversion filter & search states
  const [conversionFilter, setConversionFilter] = useState<'ALL' | 'APPROVED' | 'PAID' | 'PENDING'>('ALL');
  const [searchStudent, setSearchStudent] = useState('');

  // Payout Modal State
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState<number>(0);
  const [isProcessingPayout, setIsProcessingPayout] = useState(false);
  const [payoutSuccessMessage, setPayoutSuccessMessage] = useState<string | null>(null);
  const [payoutErrorMessage, setPayoutErrorMessage] = useState<string | null>(null);

  // QR Code Modal State
  const [showQrModal, setShowQrModal] = useState(false);
  const [selectedQrLink, setSelectedQrLink] = useState({ title: '', url: '' });

  // Fetch real affiliate profile
  const fetchAffiliateProfile = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/affiliate/me');
      const data = await res.json();
      if (data.success && data.profile) {
        setProfile(data.profile);
        setPayoutAmount(data.profile.balance);
      }
    } catch (err) {
      console.error('Failed to load affiliate profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAffiliateProfile();
  }, []);

  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  const customSlug = profile?.customSlug || 'mitra-ahmad';
  const referralCode = profile?.referralCode || 'MITRA-AHMAD';

  const tkLink = `${origin}/ref/tk/${customSlug}`;
  const sdLink = `${origin}/ref/sd/${customSlug}`;
  const smpLink = `${origin}/ref/smp/${customSlug}`;
  const generalLink = `${origin}/ppdb/daftar?ref=${referralCode}`;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(label);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  const copyTemplateText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTemplate(label);
    setTimeout(() => setCopiedTemplate(null), 2500);
  };

  const handleOpenQr = (title: string, url: string) => {
    setSelectedQrLink({ title, url });
    setShowQrModal(true);
  };

  const handleRequestPayoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingPayout(true);
    setPayoutErrorMessage(null);
    setPayoutSuccessMessage(null);

    try {
      const res = await fetch('/api/affiliate/payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: payoutAmount }),
      });

      const data = await res.json();
      if (!res.ok) {
        setPayoutErrorMessage(data.error || 'Gagal mengajukan pencairan dana.');
        setIsProcessingPayout(false);
        return;
      }

      setPayoutSuccessMessage(data.message || 'Pencairan dana berhasil diajukan.');
      if (profile) {
        setProfile({
          ...profile,
          balance: data.newBalance ?? (profile.balance - payoutAmount),
        });
      }
      setTimeout(() => {
        setShowPayoutModal(false);
        setPayoutSuccessMessage(null);
      }, 2500);
    } catch {
      setPayoutErrorMessage('Terjadi gangguan jaringan saat memproses pencairan.');
    } finally {
      setIsProcessingPayout(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  // WhatsApp Canned Promotional Texts
  const cannedMessages = [
    {
      id: 'general',
      title: 'Pendaftaran PPDB 2027/2028 Dibuka (Semua Unit)',
      summary: 'Cocok untuk disebarkan di grup keluarga, alumni, dan majelis taklim.',
      text: `*Assalamu'alaikum Warahmatullahi Wabarakatuh,*

Bapak/Ibu yang dirahmati Allah, kabar gembira pendaftaran murid baru (*PPDB 2027/2028*) di *Yayasan Pendidikan Imam Bonjol Al-Afiyah Majalengka* (TK IT, SD IT, SMP IT) resmi dibuka!

Keunggulan Al-Afiyah:
 Pembinaan Karakter & Adab Islami
 Bimbingan Tahfidz Al-Qur'an Intensif Bersanad
 Kurikulum Terpadu & Literasi Sains Modern
 Tenaga Pendidik Profesional & Lingkungan Asri

Dapatkan kemudahan pendaftaran melalui tautan resmi rujukan saya:
👉 ${generalLink}

Informasi kuota dan konsultasi pendaftaran online dapat langsung diakses pada tautan di atas. Semoga putra-putri kita menjadi generasi shalih dan mushlih. Aamiin!`,
    },
    {
      id: 'sdit',
      title: 'Fokus SDIT Al-Afiyah (Target 5-10 Juz Mutqin)',
      summary: 'Khusus calon wali murid yang mencari sekolah dasar Islam unggulan.',
      text: `*Mencari SD Islam Terbaik di Majalengka?*

Alhamdulillah *SD IT Al-Afiyah Majalengka* kini membuka pendaftaran murid baru T.A. 2027/2028.

Fasilitas & Program Unggulan:
 Target 5 - 10 Juz Hafalan Al-Qur'an Bersanad
 Pembiasaan Shalat Berjamaah & Adab Harian
 Kelas Ber-AC, Smart Classroom & Lab Komputer
 Ekstrakurikuler Panahan, Renang, Futsal, & Robotik

Silakan amankan kursi dan nomor registrasi ananda sekarang melalui tautan resmi ini:
👉 ${sdLink}

Kuota rombel sangat terbatas (hanya 2 rombel per-angkatan)!`,
    },
    {
      id: 'beasiswa',
      title: 'Info Beasiswa Tahfidz & Keringanan Infaq',
      summary: 'Informasi jalur prestasi tahfidz dan beasiswa dhuafa berprestasi.',
      text: `*Informasi Beasiswa Tahfidz Al-Qur'an Al-Afiyah Majalengka*

Yayasan Pendidikan Imam Bonjol Al-Afiyah Majalengka menyediakan kuota khusus *Jalur Beasiswa Tahfidz* untuk calon murid baru yang memiliki hafalan Al-Qur'an.

Daftarkan putra-putri Anda melalui portal resmi berikut:
👉 ${generalLink}

Mari bersama mewujudkan generasi Qur'ani berakhlak mulia. Mohon bantu sebarkan informasi kebaikan ini kepada kerabat yang membutuhkan!`,
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-700 mx-auto" />
          <p className="text-xs text-slate-500 font-medium">Memuat Dasbor Mitra Afiliasi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Top Header - Google Workspace Clean Style */}
      <header className="bg-white border-b border-slate-200/90 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link 
              href="/" 
              className="w-9 h-9 rounded-xl bg-[#064E3B] text-white font-bold flex items-center justify-center text-sm shadow-xs hover:bg-emerald-900 transition-colors"
            >
              IB
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-slate-900 leading-tight">
                  Dasbor Mitra Afiliasi
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {profile?.tier || '🥉 Mitra Bronze'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Yayasan Pendidikan Imam Bonjol Al-Afiyah Majalengka</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden sm:block text-right">
              <span className="text-xs font-bold text-slate-900 block">
                {profile?.fullName || 'Bapak Ahmad Al-Hafidz'}
              </span>
              <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Kode: {referralCode}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-rose-600 transition-colors cursor-pointer shadow-2xs"
              title="Keluar / Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        
        {/* Top Welcome Banner & Tier Status */}
        <div className="rounded-3xl bg-[#064E3B] text-white p-6 sm:p-8 shadow-md border border-emerald-900/60 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold border border-white/15">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Status Kemitraan Aktif • TP 2027/2028</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
                Ahlan wa Sahlan, {profile?.fullName || 'Bapak Ahmad'}!
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-2xl">
                Setiap calon murid yang mendaftar dan lunas melalui tautan referral Anda akan otomatis menghasilkan bagi hasil komisi berkah yang cair langsung ke rekening {profile?.bankName || 'BSI'} Anda.
              </p>
            </div>

            {/* Tier Progress Badge */}
            <div className="lg:col-span-4 bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/20 text-right space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-emerald-200 font-medium">Tingkat Mitra:</span>
                <strong className="text-amber-300 font-bold">{profile?.tier || '🥉 Mitra Bronze'}</strong>
              </div>
              
              <div className="w-full bg-black/20 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-amber-400 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${profile?.tierProgress || 30}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-emerald-200/80">
                <span>{profile?.totalStudents || 0} Murid Terdaftar</span>
                <span>Target Berikutnya: {profile?.nextTierTarget || 3} Murid</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Balance */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Saldo Komisi Tersedia</span>
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                  <Wallet className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 font-mono">
                Rp {(profile?.balance || 0).toLocaleString('id-ID')}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 truncate max-w-[120px]">
                {profile?.bankName || 'BSI'}
              </span>
              <button
                type="button"
                onClick={() => setShowPayoutModal(true)}
                disabled={(profile?.balance || 0) <= 0}
                className="text-xs font-bold text-[#064E3B] hover:text-emerald-900 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Tarik Saldo &rarr;
              </button>
            </div>
          </div>

          {/* Card 2: Total Earned */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Total Akumulasi Komisi</span>
                <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 font-mono">
                Rp {(profile?.totalEarned || 0).toLocaleString('id-ID')}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
              Riwayat komisi sepanjang masa
            </div>
          </div>

          {/* Card 3: Total Students */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Murid Terdaftar</span>
                <div className="p-2 rounded-xl bg-teal-50 text-teal-700">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 font-mono">
                {profile?.totalStudents || 0} <span className="text-sm font-normal text-slate-500">Murid</span>
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-emerald-800 font-semibold flex items-center gap-1.5">
              <span>{profile?.verifiedStudents || 0} Lunas</span>
              <span>•</span>
              <span className="text-amber-700">{profile?.pendingStudents || 0} Menunggu</span>
            </div>
          </div>

          {/* Card 4: Bank Details */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Rekening Tujuan</span>
                <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
                  <Building2 className="w-4 h-4" />
                </div>
              </div>
              <p className="text-xs font-bold text-slate-900">
                {profile?.bankName || 'Bank Syariah Indonesia'}
              </p>
              <p className="text-sm font-mono font-bold text-slate-700 mt-1">
                {profile?.bankAccountNumber || '-'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 truncate">
              a.n. {profile?.bankAccountHolder || profile?.fullName}
            </div>
          </div>
        </div>

        {/* Shareable Links Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                <Share2 className="w-4 h-4 text-[#064E3B]" />
                <span>Tautan Referral Khusus Anda</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Salin dan bagikan tautan ini ke media sosial atau grup WhatsApp. Calon murid yang mengklik akan otomatis terikat komisi Anda selama 30 hari:
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleOpenQr('Tautan Pendaftaran Terpadu', generalLink)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <QrCode className="w-4 h-4 text-[#064E3B]" />
                <span>QR Code Mitra Afiliasi</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* TK Link */}
            <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span className="text-emerald-900 font-extrabold">TK IT Al-Afiyah</span>
                  <span className="text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[10px] font-bold">
                    Total Komisi Rp 100.000 / murid
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mb-2">Formulir (Rp 30rb) + Daftar Ulang (Rp 70rb). Usia 4-6 th, sentra adab.</p>
                <p className="text-[11px] font-mono text-slate-700 truncate bg-white p-2.5 rounded-xl border border-slate-200 select-all">
                  {tkLink}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => copyToClipboard(tkLink, 'TK')}
                  className="py-2 px-3 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center justify-center space-x-1 cursor-pointer shadow-2xs"
                >
                  {copiedLink === 'TK' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600 font-bold">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Link</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenQr('TK IT Al-Afiyah', tkLink)}
                  className="py-2 px-3 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center justify-center space-x-1 cursor-pointer shadow-2xs"
                >
                  <QrCode className="w-3.5 h-3.5 text-slate-500" />
                  <span>QR Code</span>
                </button>
              </div>
            </div>

            {/* SD Link */}
            <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span className="text-emerald-900 font-extrabold">SD IT Al-Afiyah</span>
                  <span className="text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[10px] font-bold">
                    Total Komisi Rp 150.000 / murid
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mb-2">Formulir (Rp 50rb) + Daftar Ulang Awal 1 Jt (Rp 100rb). Target tahfidz juz 30.</p>
                <p className="text-[11px] font-mono text-slate-700 truncate bg-white p-2.5 rounded-xl border border-slate-200 select-all">
                  {sdLink}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => copyToClipboard(sdLink, 'SD')}
                  className="py-2 px-3 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center justify-center space-x-1 cursor-pointer shadow-2xs"
                >
                  {copiedLink === 'SD' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600 font-bold">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Link</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenQr('SD IT Al-Afiyah', sdLink)}
                  className="py-2 px-3 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center justify-center space-x-1 cursor-pointer shadow-2xs"
                >
                  <QrCode className="w-3.5 h-3.5 text-slate-500" />
                  <span>QR Code</span>
                </button>
              </div>
            </div>

            {/* SMP Link */}
            <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span className="text-emerald-900 font-extrabold">SMP IT Al-Afiyah</span>
                  <span className="text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[10px] font-bold">
                    Total Komisi Rp 200.000 / murid
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mb-2">Formulir (Rp 60rb) + Daftar Ulang (Rp 140rb). Fullday &amp; tahfidz intensif.</p>
                <p className="text-[11px] font-mono text-slate-700 truncate bg-white p-2.5 rounded-xl border border-slate-200 select-all">
                  {smpLink}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => copyToClipboard(smpLink, 'SMP')}
                  className="py-2 px-3 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center justify-center space-x-1 cursor-pointer shadow-2xs"
                >
                  {copiedLink === 'SMP' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600 font-bold">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Link</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenQr('SMP IT Al-Afiyah', smpLink)}
                  className="py-2 px-3 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center justify-center space-x-1 cursor-pointer shadow-2xs"
                >
                  <QrCode className="w-3.5 h-3.5 text-slate-500" />
                  <span>QR Code</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp Promotional Toolkit (Canned Messages) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-2">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Materi Promosi Cepat</span>
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              Teks Promosi Siap Sebar ke WhatsApp &amp; Media Sosial
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Pilih pesan yang sesuai, salin dengan 1-klik, dan bagikan ke grup wali murid, keluarga, maupun kenalan Anda:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cannedMessages.map((msg) => (
              <div 
                key={msg.id}
                className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 flex flex-col justify-between space-y-4 hover:border-emerald-300 transition-colors"
              >
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {msg.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {msg.summary}
                  </p>
                  <div className="mt-3 p-3 rounded-xl bg-white border border-slate-200 text-[11px] text-slate-700 max-h-40 overflow-y-auto leading-relaxed whitespace-pre-line font-sans">
                    {msg.text}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => copyTemplateText(msg.text, msg.id)}
                    className="flex-1 py-2 px-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    {copiedTemplate === msg.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Teks</span>
                      </>
                    )}
                  </button>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(msg.text)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1 shadow-2xs"
                    title="Bagikan Langsung ke WhatsApp"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim WA</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conversions Table */}
        {(() => {
          const filteredConversions = (profile?.conversions || []).filter((conv) => {
            const matchesFilter = conversionFilter === 'ALL' || conv.status === conversionFilter;
            const matchesSearch = !searchStudent || 
              conv.studentName.toLowerCase().includes(searchStudent.toLowerCase()) ||
              conv.registrationNo.toLowerCase().includes(searchStudent.toLowerCase()) ||
              conv.schoolName.toLowerCase().includes(searchStudent.toLowerCase());
            return matchesFilter && matchesSearch;
          });

          const countApproved = (profile?.conversions || []).filter(c => c.status === 'APPROVED').length;
          const countPaid = (profile?.conversions || []).filter(c => c.status === 'PAID').length;
          const countPending = (profile?.conversions || []).filter(c => c.status === 'PENDING').length;

          return (
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
              <div className="p-6 sm:p-7 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Riwayat Rujukan Calon Murid &amp; Komisi</h2>
                  <p className="text-xs text-slate-500">Daftar calon murid yang mendaftar melalui tautan referral pribadi Anda</p>
                </div>
                
                {/* Search Box */}
                <div className="w-full sm:w-64">
                  <input
                    type="text"
                    value={searchStudent}
                    onChange={(e) => setSearchStudent(e.target.value)}
                    placeholder="Cari murid / no. reg..."
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-[#064E3B] focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="px-6 py-3 bg-slate-50/50 border-b border-slate-100 flex items-center gap-2 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setConversionFilter('ALL')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                    conversionFilter === 'ALL'
                      ? 'bg-[#064E3B] text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Semua ({profile?.conversions?.length || 0})
                </button>
                <button
                  type="button"
                  onClick={() => setConversionFilter('APPROVED')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                    conversionFilter === 'APPROVED'
                      ? 'bg-emerald-700 text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Siap Cair ({countApproved})
                </button>
                <button
                  type="button"
                  onClick={() => setConversionFilter('PAID')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                    conversionFilter === 'PAID'
                      ? 'bg-blue-700 text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Lunas Ditransfer ({countPaid})
                </button>
                <button
                  type="button"
                  onClick={() => setConversionFilter('PENDING')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                    conversionFilter === 'PENDING'
                      ? 'bg-amber-600 text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Menunggu Bayar ({countPending})
                </button>
              </div>

              <div className="overflow-x-auto">
                {filteredConversions.length > 0 ? (
                  <table className="w-full text-left admin-table">
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Nama Calon Murid</th>
                        <th>No. Registrasi</th>
                        <th>Unit Sekolah</th>
                        <th>Nominal Komisi</th>
                        <th>Waktu Konversi</th>
                        <th>Status Komisi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredConversions.map((conv, idx) => (
                        <tr key={conv.id}>
                          <td className="font-mono text-xs">{idx + 1}</td>
                          <td>
                            <strong className="text-slate-900 text-xs block font-bold">
                              {conv.studentName}
                            </strong>
                          </td>
                          <td className="font-mono text-xs text-slate-500">
                            {conv.registrationNo}
                          </td>
                          <td className="text-xs font-semibold text-slate-700">
                            {conv.schoolName}
                          </td>
                          <td className="font-bold text-emerald-800 text-xs font-mono">
                            Rp {conv.commissionAmount.toLocaleString('id-ID')}
                          </td>
                          <td className="text-slate-500 text-xs">
                            {new Date(conv.createdAt).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </td>
                          <td>
                            {conv.status === 'APPROVED' && (
                              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>APPROVED (SIAP CAIR)</span>
                              </span>
                            )}
                            {conv.status === 'PAID' && (
                              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                                <Check className="w-3.5 h-3.5" />
                                <span>LUNAS DITRANSFER</span>
                              </span>
                            )}
                            {conv.status === 'PENDING' && (
                              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                                <Clock className="w-3.5 h-3.5" />
                                <span>MENUNGGU BAYAR</span>
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="py-12 px-6 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                      <Users className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800">
                      {searchStudent || conversionFilter !== 'ALL'
                        ? 'Tidak Ada Data Yang Cocok'
                        : 'Belum Ada Rujukan Murid'}
                    </h3>
                    <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                      {searchStudent || conversionFilter !== 'ALL'
                        ? 'Coba ubah kata kunci pencarian atau ganti filter status di atas.'
                        : 'Mulai sebar tautan referral Anda ke kerabat dan media sosial. Komisi akan otomatis tercatat segera setelah calon murid mendaftarkan diri!'}
                    </p>
                    {(!searchStudent && conversionFilter === 'ALL') && (
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => copyToClipboard(generalLink, 'ALL')}
                          className="px-4 py-2 rounded-xl bg-[#064E3B] text-white text-xs font-bold hover:bg-emerald-900 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Salin Tautan Utama Sekarang</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })()}

      </main>

      {/* PAYOUT REQUEST MODAL */}
      {showPayoutModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Wallet className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Tarik Saldo Komisi</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPayoutModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {payoutSuccessMessage ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="text-xs font-bold text-emerald-900">{payoutSuccessMessage}</p>
                <p className="text-[11px] text-emerald-700">Modal ini akan tertutup otomatis.</p>
              </div>
            ) : (
              <form onSubmit={handleRequestPayoutSubmit} className="space-y-4">
                {payoutErrorMessage && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
                    {payoutErrorMessage}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Saldo Tersedia Saat Ini
                  </label>
                  <p className="text-xl font-black text-slate-900 font-mono">
                    Rp {(profile?.balance || 0).toLocaleString('id-ID')}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nominal Yang Ingin Ditarik (Rp)
                  </label>
                  <input
                    type="number"
                    min={50000}
                    max={profile?.balance || 0}
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(Number(e.target.value))}
                    className="w-full px-4 py-2.5 text-sm font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl focus:border-[#064E3B] focus:ring-2 focus:ring-emerald-600/20 focus:bg-white focus:outline-hidden"
                  />
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                    <span>Minimal penarikan: Rp 50.000</span>
                    <button
                      type="button"
                      onClick={() => setPayoutAmount(profile?.balance || 0)}
                      className="text-emerald-800 font-bold hover:underline cursor-pointer"
                    >
                      Tarik Semua
                    </button>
                  </div>
                </div>

                {/* Bank Target Review */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <p className="text-slate-500 font-medium">Rekening Tujuan:</p>
                  <p className="font-bold text-slate-900">{profile?.bankName}</p>
                  <p className="font-mono text-slate-700 font-semibold">
                    {profile?.bankAccountNumber} a.n. {profile?.bankAccountHolder}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPayoutModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessingPayout || payoutAmount <= 0}
                    className="px-5 py-2.5 rounded-xl bg-[#064E3B] hover:bg-emerald-900 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isProcessingPayout ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Memproses...</span>
                      </>
                    ) : (
                      <span>Konfirmasi Penarikan</span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* QR CODE MODAL */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-900">{selectedQrLink.title}</span>
              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-2">
              <div className="p-4 bg-white border border-slate-200 rounded-2xl inline-block shadow-xs">
                {/* Visual QR Code Generator via standard image API */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                    selectedQrLink.url
                  )}`}
                  alt="QR Code Referral"
                  className="w-48 h-48 mx-auto"
                />
              </div>
              <p className="text-xs font-bold text-slate-800 mt-3 font-mono truncate px-2">
                {selectedQrLink.url}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Scan menggunakan kamera HP untuk langsung menuju form pendaftaran dengan rujukan Anda.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  copyToClipboard(selectedQrLink.url, 'QR_URL');
                  alert('Tautan berhasil disalin ke clipboard!');
                }}
                className="w-full py-2.5 rounded-xl bg-[#064E3B] hover:bg-emerald-900 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Salin Tautan QR Code
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
