'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Wallet, 
  Users, 
  Copy, 
  Check, 
  LogOut, 
  Building2, 
  Clock, 
  CheckCircle2, 
  Share2,
  QrCode,
  Loader2,
  TrendingUp,
  X,
  MessageSquare,
  Send
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

  useEffect(() => {
    document.title = 'Dashboard Affiliate Al-Afiyah';
  }, []);

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

  const host = typeof window !== 'undefined' ? window.location.host : '';
  const protocol = typeof window !== 'undefined' ? window.location.protocol : 'https:';
  // Strip school subdomain so affiliate central links resolve cleanly
  const rootDomain = host ? host.replace(/^(www|sdit|smpit|tkit|sd|smp|tk)\./i, '') : 'localhost:3000';
  const rootOrigin = typeof window !== 'undefined' ? `${protocol}//${rootDomain}` : 'http://localhost:3000';
  const customSlug = profile?.customSlug || 'mitra-ahmad';
  const referralCode = profile?.referralCode || 'MITRA-AHMAD';

  // Landing page links (unit-specific profiles)
  const tkLink = `${rootOrigin}/ref/tk/${customSlug}`;
  const sdLink = `${rootOrigin}/ref/sd/${customSlug}`;
  const smpLink = `${rootOrigin}/ref/smp/${customSlug}`;

  // Direct registration form links
  const smpFormLink = `${rootOrigin}/smp/spmb/daftar?ref=${referralCode}`;
  const sdFormLink = `${rootOrigin}/sd/spmb/daftar?ref=${referralCode}`;
  // General hub link (multi-unit: parents choose TK, SD, or SMP)
  const generalLink = `${rootOrigin}/ppdb?ref=${referralCode}`;

  // Broadcast WhatsApp State & Generator
  const [selectedBroadcastUnit, setSelectedBroadcastUnit] = useState<'SD' | 'SMP' | 'TK' | 'ALL'>('SD');
  const [copiedBroadcast, setCopiedBroadcast] = useState(false);

  const getBroadcastMessage = (unit: 'SD' | 'SMP' | 'TK' | 'ALL'): string => {
    if (unit === 'SD') {
      return `Assalamu'alaikum Warahmatullahi Wabarakatuh Ayah/Bunda 🙏

Kabar gembira! Penerimaan Peserta Didik Baru (PPDB) SDIT Al-Afiyah Majalengka Tahun Ajaran 2026/2027 telah resmi dibuka.

Kenapa memilih SDIT Al-Afiyah?
✅ Target Tahfidz Al-Qur'an 5 - 10 Juz
✅ Pembiasaan Adab & Karakter Islami Sejak Dini
✅ Tenaga Pendidik Berpengalaman & Penuh Kasih Sayang
✅ Lingkungan Belajar Nyaman, Asri & Ramah Anak
✅ Fasilitas Lengkap & Beragam Kegiatan Ekstrakurikuler

📌 Kuota pendaftaran sangat terbatas untuk menjaga rasio belajar ananda yang optimal. Biaya formulir pendaftaran: Rp 250.000.

Pendaftaran online dan informasi lengkap dapat langsung diakses melalui tautan resmi kami:
👉 ${sdLink}

Mari bersama wujudkan generasi sholeh, berakhlak mulia, dan berprestasi bersama SDIT Al-Afiyah.

Wassalamu'alaikum Warahmatullahi Wabarakatuh.`;
    }

    if (unit === 'SMP') {
      return `Assalamu'alaikum Warahmatullahi Wabarakatuh Ayah/Bunda 🙏

PPDB SMP IT Al-Afiyah Majalengka Tahun Ajaran 2026/2027 Telah Resmi Dibuka!

Mempersiapkan masa depan putra-putri dengan perpaduan keilmuan akademis, adab, dan Al-Qur'an:
✅ Terakreditasi A (Unggul)
✅ Pilihan Program Asrama (Boarding) & Fullday School
✅ Program Unggulan Tahfidz Al-Qur'an (Target 3 - 5+ Juz)
✅ Pembiasaan Bahasa Arab & Inggris Aktif
✅ Tersedia Program Keringanan Biaya & Beasiswa Berprestasi

Kuota pendaftaran terbatas! Dapatkan kemudahan pendaftaran langsung melalui tautan resmi mitra kami:
👉 ${smpLink}

Mari bimbing masa transisi terbaik putra-putri tercinta di lingkungan yang aman, agamis, dan berprestasi.

Wassalamu'alaikum Warahmatullahi Wabarakatuh.`;
    }

    if (unit === 'TK') {
      return `Assalamu'alaikum Warahmatullahi Wabarakatuh Ayah/Bunda 🙏

Tumbuh kembang ananda di usia emas memerlukan pondasi keimanan, cinta ibadah, dan stimulasi belajar yang penuh kasih sayang.

PPDB TK IT Al-Afiyah Majalengka Tahun Ajaran 2026/2027:
🌸 Pembiasaan Doa Harian, Hadits Pilihan & Hafalan Juz 'Amma
🌸 Metode Belajar Sambil Bermain yang Menyenangkan & Kreatif
🌸 Pembentukan Karakter Mandiri, Percaya Diri & Berakhlak Islami
🌸 Guru Penyayang & Area Bermain Edukatif Aman

Informasi lengkap dan pendaftaran online dapat langsung diakses melalui tautan resmi berikut:
👉 ${tkLink}

Ayah/Bunda dapat mendaftarkan ananda sebelum kuota kelas terpenuhi.

Wassalamu'alaikum Warahmatullahi Wabarakatuh.`;
    }

    // Default / ALL (PPDB Terpadu)
    return `Assalamu'alaikum Warahmatullahi Wabarakatuh Ayah/Bunda 🙏

Penerimaan Peserta Didik Baru (PPDB) Terpadu Yayasan Pendidikan Imam Bonjol Al-Afiyah Majalengka Tahun Ajaran 2026/2027 telah resmi dibuka!

Pilihan Jenjang Pendidikan:
🌱 TK IT Al-Afiyah (Fondasi Karakter & Cinta Ibadah Usia Dini)
📗 SDIT Al-Afiyah (Adab Islami, Sains & Tahfidz Al-Qur'an)
📘 SMP IT Al-Afiyah (Akreditasi A, Program Asrama & Fullday)

Dapatkan informasi kurikulum, brosur digital, serta pendaftaran online terpadu melalui tautan resmi mitra kami:
👉 ${generalLink}

Mari bimbing ananda menuju masa depan yang sholeh, cerdas, dan mandiri bersama keluarga besar Al-Afiyah.

Wassalamu'alaikum Warahmatullahi Wabarakatuh.`;
  };

  const handleCopyBroadcast = (unit?: 'SD' | 'SMP' | 'TK' | 'ALL') => {
    const target = unit || selectedBroadcastUnit;
    const msg = getBroadcastMessage(target);
    navigator.clipboard.writeText(msg);
    setCopiedBroadcast(true);
    setTimeout(() => setCopiedBroadcast(false), 2500);
  };

  const handleSendWhatsApp = (unit?: 'SD' | 'SMP' | 'TK' | 'ALL') => {
    const target = unit || selectedBroadcastUnit;
    const msg = getBroadcastMessage(target);
    const url = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(label);
    setTimeout(() => setCopiedLink(null), 2500);
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



  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-700 mx-auto" />
          <p className="text-xs text-slate-500 font-medium">Memuat Dashboard Affiliate Al-Afiyah...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200/90 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div>
            <h1 className="text-sm font-bold text-slate-900 leading-tight">
              Dashboard Affiliate Al-Afiyah
            </h1>
            <p className="text-[11px] text-slate-500">Yayasan Pendidikan Imam Bonjol Al-Afiyah Majalengka</p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden sm:block text-right">
              <span className="text-xs font-bold text-slate-900 block">
                {profile?.fullName || 'Mitra Afiliasi'}
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
        
        {/* Top Welcome Banner */}
        <div className="rounded-2xl bg-[#064E3B] text-white p-6 sm:p-7 shadow-xs border border-emerald-900/60 relative overflow-hidden">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Akun Mitra Aktif</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                Selamat Datang, {profile?.fullName || 'Mitra Afiliasi'}
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-2xl">
                Pantau rujukan pendaftaran dan pencairan komisi resmi pendaftaran murid baru Al-Afiyah secara transparan.
              </p>
            </div>
            <div className="sm:text-right shrink-0">
              <button
                type="button"
                onClick={() => setShowPayoutModal(true)}
                disabled={(profile?.balance || 0) <= 0}
                className="px-4 py-2.5 rounded-xl bg-white text-[#064E3B] text-xs font-bold hover:bg-emerald-50 transition-colors shadow-xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer inline-flex items-center gap-1.5"
              >
                <Wallet className="w-4 h-4 text-[#064E3B]" />
                <span>Tarik Komisi</span>
              </button>
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
                <span>QR Code Affiliate</span>
              </button>
            </div>
          </div>

          {/* General Link Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#064E3B] uppercase tracking-wider">Tautan Utama PPDB (Pilihan Multi-Unit)</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">Direkomendasikan</span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">Wali murid dapat memilih pendaftaran unit TK, SDIT, maupun SMP IT langsung dari satu tautan:</p>
              <p className="text-xs font-mono text-slate-800 truncate mt-2 bg-white px-3 py-2 rounded-xl border border-emerald-200 select-all font-semibold">
                {generalLink}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setSelectedBroadcastUnit('ALL');
                  handleCopyBroadcast('ALL');
                }}
                className="px-3.5 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                title="Salin pesan siar WhatsApp PPDB Terpadu lengkap dengan link"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Broadcast WA</span>
              </button>
              <button
                type="button"
                onClick={() => copyToClipboard(generalLink, 'ALL')}
                className="px-4 py-2.5 rounded-xl bg-[#064E3B] text-white text-xs font-bold hover:bg-emerald-900 transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                {copiedLink === 'ALL' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Tautan</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => handleOpenQr('Tautan Utama PPDB', generalLink)}
                className="p-2.5 rounded-xl bg-white border border-emerald-200 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shadow-2xs"
                title="QR Code"
              >
                <QrCode className="w-4 h-4 text-[#064E3B]" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* TK Link */}
            <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span className="text-emerald-900 font-extrabold text-sm">TK IT Al-Afiyah</span>
                  <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 text-[10px] font-bold">
                    Menunggu Ketentuan Panitia
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mb-2">Besaran komisi unit TK akan diumumkan panitia.</p>
                <p className="text-[11px] font-mono text-slate-700 truncate bg-white p-2.5 rounded-xl border border-slate-200 select-all">
                  {tkLink}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-1.5 pt-2">
                <button
                  type="button"
                  onClick={() => copyToClipboard(tkLink, 'TK')}
                  className="py-2 px-1.5 rounded-xl bg-white border border-slate-200 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 flex items-center justify-center space-x-1 cursor-pointer shadow-2xs"
                  title="Salin tautan saja"
                >
                  {copiedLink === 'TK' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600 font-bold">Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Link</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedBroadcastUnit('TK');
                    handleCopyBroadcast('TK');
                  }}
                  className="py-2 px-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-800 hover:bg-emerald-100 flex items-center justify-center space-x-1 cursor-pointer shadow-2xs"
                  title="Salin pesan broadcast WA beserta link"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Broadcast</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenQr('TK IT Al-Afiyah', tkLink)}
                  className="py-2 px-1.5 rounded-xl bg-white border border-slate-200 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 flex items-center justify-center space-x-1 cursor-pointer shadow-2xs"
                  title="QR Code"
                >
                  <QrCode className="w-3.5 h-3.5 text-slate-500" />
                  <span>QR</span>
                </button>
              </div>
            </div>

            {/* SD Link */}
            <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span className="text-emerald-900 font-extrabold text-sm">SDIT Al-Afiyah</span>
                  <span className="text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[10px] font-bold">
                    Komisi Rp 150.000 / murid
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mb-2">Formulir (Rp 50.000) + Daftar Ulang (Rp 100.000)</p>
                
                <div className="space-y-1 mt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Tautan Profil &amp; Pendaftaran SD:</span>
                  <p className="text-[11px] font-mono text-slate-700 truncate bg-white p-2 rounded-xl border border-slate-200 select-all">
                    {sdLink}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-1.5 pt-2">
                <button
                  type="button"
                  onClick={() => copyToClipboard(sdLink, 'SD')}
                  className="py-2 px-1.5 rounded-xl bg-white border border-slate-200 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 flex items-center justify-center space-x-1 cursor-pointer shadow-2xs"
                  title="Salin tautan saja"
                >
                  {copiedLink === 'SD' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600 font-bold">Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Link</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedBroadcastUnit('SD');
                    handleCopyBroadcast('SD');
                  }}
                  className="py-2 px-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-800 hover:bg-emerald-100 flex items-center justify-center space-x-1 cursor-pointer shadow-2xs"
                  title="Salin pesan broadcast WA beserta link"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Broadcast</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenQr('SDIT Al-Afiyah', sdLink)}
                  className="py-2 px-1.5 rounded-xl bg-white border border-slate-200 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 flex items-center justify-center space-x-1 cursor-pointer shadow-2xs"
                  title="QR Code"
                >
                  <QrCode className="w-3.5 h-3.5 text-slate-500" />
                  <span>QR</span>
                </button>
              </div>
            </div>

            {/* SMP Link */}
            <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span className="text-emerald-900 font-extrabold text-sm">SMP IT Al-Afiyah</span>
                  <span className="text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[10px] font-bold">
                    Komisi Rp 150.000 / murid
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mb-2">Formulir (Rp 50.000) + Daftar Ulang (Rp 100.000)</p>
                
                <div className="space-y-1 mt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Tautan Profil &amp; Pendaftaran SMP:</span>
                  <p className="text-[11px] font-mono text-slate-700 truncate bg-white p-2 rounded-xl border border-slate-200 select-all">
                    {smpLink}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-1.5 pt-2">
                <button
                  type="button"
                  onClick={() => copyToClipboard(smpLink, 'SMP')}
                  className="py-2 px-1.5 rounded-xl bg-white border border-slate-200 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 flex items-center justify-center space-x-1 cursor-pointer shadow-2xs"
                  title="Salin tautan saja"
                >
                  {copiedLink === 'SMP' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600 font-bold">Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Link</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedBroadcastUnit('SMP');
                    handleCopyBroadcast('SMP');
                  }}
                  className="py-2 px-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-800 hover:bg-emerald-100 flex items-center justify-center space-x-1 cursor-pointer shadow-2xs"
                  title="Salin pesan broadcast WA beserta link"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Broadcast</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenQr('SMP IT Al-Afiyah', smpLink)}
                  className="py-2 px-1.5 rounded-xl bg-white border border-slate-200 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 flex items-center justify-center space-x-1 cursor-pointer shadow-2xs"
                  title="QR Code"
                >
                  <QrCode className="w-3.5 h-3.5 text-slate-500" />
                  <span>QR</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dedicated WhatsApp Broadcast Hub */}
        <div id="broadcast-section" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-100/80 text-emerald-800">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider">
                  Pesan Siar / Broadcast WhatsApp (1-Klik)
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Link Otomatis Tersemat
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-3xl">
                Teks resmi sudah terpasang otomatis dengan link referral Anda. Anda cukup klik <strong>Salin Pesan (1-Klik)</strong> atau langsung buka via WhatsApp tanpa perlu repot tempel link secara terpisah.
              </p>
            </div>
          </div>

          {/* Unit Switcher Tabs */}
          <div className="flex items-center gap-2 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/80 overflow-x-auto">
            <button
              type="button"
              onClick={() => setSelectedBroadcastUnit('SD')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                selectedBroadcastUnit === 'SD'
                  ? 'bg-white text-emerald-900 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <span>📗 SDIT Al-Afiyah</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                selectedBroadcastUnit === 'SD' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200/70 text-slate-600'
              }`}>
                Komisi Rp 150rb
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedBroadcastUnit('SMP')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                selectedBroadcastUnit === 'SMP'
                  ? 'bg-white text-emerald-900 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <span>📘 SMP IT Al-Afiyah</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                selectedBroadcastUnit === 'SMP' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200/70 text-slate-600'
              }`}>
                Komisi Rp 150rb
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedBroadcastUnit('ALL')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                selectedBroadcastUnit === 'ALL'
                  ? 'bg-white text-emerald-900 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <span>🏛️ Semua Unit (PPDB Terpadu)</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedBroadcastUnit('TK')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                selectedBroadcastUnit === 'TK'
                  ? 'bg-white text-emerald-900 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <span>🌱 TK IT Al-Afiyah</span>
            </button>
          </div>

          {/* Message Preview Container */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Preview Pesan Broadcast Siap Sebar:</span>
              <span className="text-[11px] text-emerald-700 font-mono">
                {selectedBroadcastUnit === 'SD' && 'Link: /ref/sd/' + customSlug}
                {selectedBroadcastUnit === 'SMP' && 'Link: /ref/smp/' + customSlug}
                {selectedBroadcastUnit === 'TK' && 'Link: /ref/tk/' + customSlug}
                {selectedBroadcastUnit === 'ALL' && 'Link: /ppdb?ref=' + referralCode}
              </span>
            </div>

            <div className="relative rounded-2xl bg-slate-50 border border-slate-200 p-5 font-sans text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap selection:bg-emerald-200">
              {getBroadcastMessage(selectedBroadcastUnit)}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyBroadcast()}
                  className="px-5 py-3 rounded-xl bg-[#064E3B] text-white text-xs font-bold hover:bg-emerald-900 transition-all inline-flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-98"
                >
                  {copiedBroadcast ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>Pesan &amp; Link Berhasil Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Salin Pesan &amp; Link (1-Klik)</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleSendWhatsApp()}
                  className="px-5 py-3 rounded-xl bg-[#25D366] text-white text-xs font-bold hover:bg-[#20ba5a] transition-all inline-flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-98"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim Langsung ke WhatsApp</span>
                </button>
              </div>

              <span className="text-[11px] text-slate-500 text-center sm:text-right">
                Otomatis mengaitkan komisi Anda selama 30 hari sejak tautan diklik.
              </span>
            </div>
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
