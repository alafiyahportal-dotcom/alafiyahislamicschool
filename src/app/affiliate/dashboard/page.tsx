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
  Send,
  AlertCircle,
  Settings,
  Edit3,
  GraduationCap,
  BookOpen,
  Layers
} from 'lucide-react';
import { INDONESIA_BANKS } from '@/lib/constants/banks';
import IslamicToast from '@/components/common/IslamicToast';
import { detectActiveUnit, applyPwaIdentityToDocument, ActiveUnitType } from '@/components/shared/DynamicUnitThemeColorSync';

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

interface PayoutScheduleInfo {
  frequency: string;
  frequencyLabel: string;
  canWithdraw: boolean;
  lastPayoutDate: string | null;
  nextAvailableDate: string | null;
  daysLeft: number;
  ruleNotice: string;
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
  payoutSchedule?: PayoutScheduleInfo;
  conversions: AffiliateConversionItem[];
}

export default function AffiliateDashboardPage() {
  const [profile, setProfile] = useState<AffiliateProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [activeUnit, setActiveUnit] = useState<ActiveUnitType>('sd');

  // Conversion filter & search states
  const [conversionFilter, setConversionFilter] = useState<'ALL' | 'APPROVED' | 'PAID' | 'PENDING'>('ALL');
  const [searchStudent, setSearchStudent] = useState('');

  // Payout Modal State
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState<number>(0);
  const [isProcessingPayout, setIsProcessingPayout] = useState(false);
  const [payoutSuccessMessage, setPayoutSuccessMessage] = useState<string | null>(null);
  const [payoutErrorMessage, setPayoutErrorMessage] = useState<string | null>(null);

  // Bank Account & Profile Modal State
  const [showBankModal, setShowBankModal] = useState(false);
  const [bankFormData, setBankFormData] = useState({
    bankName: 'Bank Syariah Indonesia (BSI)',
    bankAccountNumber: '',
    bankAccountHolder: '',
    fullName: '',
    phone: '',
  });
  const [isSavingBank, setIsSavingBank] = useState(false);
  const [isCustomBank, setIsCustomBank] = useState(false);
  const [customBankName, setCustomBankName] = useState('');
  const [bankSaveSuccess, setBankSaveSuccess] = useState<string | null>(null);
  const [bankSaveError, setBankSaveError] = useState<string | null>(null);
  const [justRegistered, setJustRegistered] = useState(false);
  const [bankSavedJustNow, setBankSavedJustNow] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const unit = detectActiveUnit(window.location.pathname, searchParams);
      setActiveUnit(unit);
      applyPwaIdentityToDocument(unit, '/affiliate/dashboard');
      document.title = unit === 'smp' 
        ? 'Dashboard Afiliasi SMP IT | Al-Afiyah' 
        : 'Dashboard Afiliasi | Al-Afiyah Islamic School';

      if (searchParams.get('new') === '1') {
        setJustRegistered(true);
      }
    }
  }, []);

  // Islamic Toast State
  const [toast, setToast] = useState<{
    isOpen: boolean;
    type: 'success' | 'error' | 'info';
    title?: string;
    message: string;
  }>({
    isOpen: false,
    type: 'success',
    message: '',
  });

  // QR Code Modal State
  const [showQrModal, setShowQrModal] = useState(false);
  const [selectedQrLink, setSelectedQrLink] = useState({ title: '', url: '' });

  // Fetch real affiliate profile
  const fetchAffiliateProfile = async (targetCodeOrEmail?: string) => {
    try {
      setIsLoading(true);
      let queryParam = '';
      if (targetCodeOrEmail) {
        const isEmail = targetCodeOrEmail.includes('@');
        queryParam = `?${isEmail ? 'email' : 'code'}=${encodeURIComponent(targetCodeOrEmail)}`;
      } else if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const qCode = params.get('code') || params.get('ref');
        const qEmail = params.get('email');
        if (qCode) {
          queryParam = `?code=${encodeURIComponent(qCode)}`;
          localStorage.setItem('alafiyah_my_affiliate_code', qCode.trim().toUpperCase());
        } else if (qEmail) {
          queryParam = `?email=${encodeURIComponent(qEmail)}`;
        } else {
          const cachedCode = localStorage.getItem('alafiyah_my_affiliate_code');
          if (cachedCode) {
            queryParam = `?code=${encodeURIComponent(cachedCode)}`;
          }
        }
      }

      const res = await fetch(`/api/affiliate/me${queryParam}`);
      const data = await res.json();
      if (data.success && data.profile) {
        setProfile(data.profile);
        setPayoutAmount(data.profile.balance);
        if (typeof window !== 'undefined' && data.profile.referralCode) {
          localStorage.setItem('alafiyah_my_affiliate_code', data.profile.referralCode);
        }

        if (typeof window !== 'undefined') {
          const params = new URLSearchParams(window.location.search);
          const act = params.get('action');
          const edit = params.get('edit');
          if (act === 'rekening' || act === 'bank' || edit === 'bank' || edit === 'rekening') {
            setBankFormData({
              bankName: data.profile.bankName || 'Bank Syariah Indonesia (BSI)',
              bankAccountNumber: (!data.profile.bankAccountNumber || data.profile.bankAccountNumber === '-') ? '' : data.profile.bankAccountNumber,
              bankAccountHolder: data.profile.bankAccountHolder || data.profile.fullName || '',
              fullName: data.profile.fullName || '',
              phone: data.profile.phone || '',
            });
            setShowBankModal(true);
          }
        }
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

  const handleOpenBankModal = () => {
    const currentBank = profile?.bankName || '';
    const isKnown = INDONESIA_BANKS.includes((currentBank as any));
    if (isKnown && currentBank !== 'Bank / Rekening Lainnya (Tulis Sendiri)') {
      setIsCustomBank(false);
      setCustomBankName('');
      setBankFormData({
        bankName: currentBank,
        bankAccountNumber: (!profile?.bankAccountNumber || profile?.bankAccountNumber === '-') ? '' : profile.bankAccountNumber,
        bankAccountHolder: profile?.bankAccountHolder || profile?.fullName || '',
        fullName: profile?.fullName || '',
        phone: profile?.phone || '',
      });
    } else if (currentBank) {
      setIsCustomBank(true);
      setCustomBankName(currentBank);
      setBankFormData({
        bankName: 'Bank / Rekening Lainnya (Tulis Sendiri)',
        bankAccountNumber: (!profile?.bankAccountNumber || profile?.bankAccountNumber === '-') ? '' : profile.bankAccountNumber,
        bankAccountHolder: profile?.bankAccountHolder || profile?.fullName || '',
        fullName: profile?.fullName || '',
        phone: profile?.phone || '',
      });
    } else {
      setIsCustomBank(false);
      setCustomBankName('');
      setBankFormData({
        bankName: '',
        bankAccountNumber: '',
        bankAccountHolder: profile?.fullName || '',
        fullName: profile?.fullName || '',
        phone: profile?.phone || '',
      });
    }
    setBankSaveSuccess(null);
    setBankSaveError(null);
    setShowBankModal(true);
  };

  const handleSaveBankSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingBank(true);
    setBankSaveError(null);
    setBankSaveSuccess(null);

    const cleanNum = bankFormData.bankAccountNumber.trim();
    if (!cleanNum || cleanNum === '-') {
      setBankSaveError('Nomor rekening bank atau nomor HP e-wallet wajib diisi.');
      setIsSavingBank(false);
      return;
    }
    if (!bankFormData.bankAccountHolder.trim()) {
      setBankSaveError('Nama pemilik rekening sesuai buku tabungan wajib diisi.');
      setIsSavingBank(false);
      return;
    }

    const finalBankName = isCustomBank
      ? (customBankName.trim() || 'Bank Lainnya')
      : (bankFormData.bankName.trim() || 'Bank Syariah Indonesia (BSI)');

    try {
      const res = await fetch('/api/affiliate/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bankName: finalBankName,
          bankAccountNumber: cleanNum,
          bankAccountHolder: bankFormData.bankAccountHolder.trim(),
          fullName: bankFormData.fullName.trim() || undefined,
          phone: bankFormData.phone.trim() || undefined,
          referralCode: profile?.referralCode,
          email: profile?.email,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setBankSaveError(data.error || 'Gagal menyimpan data rekening.');
        setToast({
          isOpen: true,
          type: 'error',
          title: 'Qadarullah, Mohon Maaf',
          message: data.error || 'Gagal menyimpan data rekening.',
        });
        setIsSavingBank(false);
        return;
      }

      setBankSaveSuccess('Alhamdulillah, Baarakallahu fiik! Rekening pencairan komisi berhasil disimpan dengan aman.');
      setToast({
        isOpen: true,
        type: 'success',
        title: 'Alhamdulillah, Baarakallahu Fiik!',
        message: 'Rekening pencairan komisi berhasil disimpan dengan aman.',
      });
      if (profile) {
        setProfile({
          ...profile,
          bankName: finalBankName,
          bankAccountNumber: cleanNum,
          bankAccountHolder: bankFormData.bankAccountHolder.trim(),
          fullName: bankFormData.fullName.trim() || profile.fullName,
          phone: bankFormData.phone.trim() || profile.phone,
        });
      }
      setBankSavedJustNow(true);
      setJustRegistered(false);

      setTimeout(() => {
        setShowBankModal(false);
        setBankSaveSuccess(null);
      }, 1800);
    } catch {
      setBankSaveError('Qadarullah, terjadi gangguan jaringan saat menyimpan data rekening. Silakan periksa koneksi Anda.');
      setToast({
        isOpen: true,
        type: 'error',
        title: 'Qadarullah, Terjadi Kendala',
        message: 'Terjadi gangguan jaringan saat menyimpan data rekening. Silakan periksa koneksi Anda.',
      });
    } finally {
      setIsSavingBank(false);
    }
  };

  const isBankIncomplete = !profile?.bankAccountNumber || profile.bankAccountNumber === '-' || profile.bankAccountNumber.trim() === '';


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
✅ Target Tahfidz Al-Qur'an: Juz 30 Mutqin + Juz 29 & 28
✅ Pembiasaan Adab & Karakter Islami Sejak Dini
✅ Tenaga Pendidik Berpengalaman & Penuh Kasih Sayang
✅ Lingkungan Belajar Nyaman, Asri & Ramah Anak
✅ Fasilitas Lengkap & Beragam Kegiatan Ekstrakurikuler

📌 Kuota pendaftaran sangat terbatas untuk menjaga rasio belajar ananda yang optimal. Biaya formulir pendaftaran: Rp 250.000.

Informasi lengkap & formulir pendaftaran online resmi:

🌐 Profil & Informasi Lengkap SDIT:
${sdLink}

📝 Formulir Pendaftaran Langsung SDIT:
${sdFormLink}

Mari bersama wujudkan generasi sholeh, berakhlak mulia, dan berprestasi bersama SDIT Al-Afiyah.

Wassalamu'alaikum Warahmatullahi Wabarakatuh.`;
    }

    if (unit === 'SMP') {
      return `Assalamu'alaikum Warahmatullahi Wabarakatuh Ayah/Bunda 🙏

PPDB SMP IT Al-Afiyah Majalengka Tahun Ajaran 2026/2027 Telah Resmi Dibuka!

Mempersiapkan masa depan putra-putri dengan perpaduan keilmuan akademis, adab, dan Al-Qur'an:
✅ Terakreditasi A (Unggul)
✅ Program Unggulan Fullday School (Sekolah Terpadu Pagi - Sore)
✅ Program Unggulan Tahfidz Al-Qur'an (Target 3 - 5+ Juz)
✅ Pembiasaan Bahasa Arab & Inggris Aktif
✅ Tersedia Program Keringanan Biaya & Beasiswa Berprestasi

Kuota pendaftaran terbatas! Informasi lengkap & pendaftaran online:

🌐 Profil & Informasi Lengkap SMP IT:
${smpLink}

📝 Formulir Pendaftaran Langsung SMP IT:
${smpFormLink}

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

Informasi lengkap & pendaftaran online:

🌐 Profil & Pendaftaran TK IT:
${tkLink}

🏛️ Portal Terpadu Yayasan:
${generalLink}

Ayah/Bunda dapat mendaftarkan ananda sebelum kuota kelas terpenuhi.

Wassalamu'alaikum Warahmatullahi Wabarakatuh.`;
    }

    // Default / ALL (PPDB Terpadu)
    return `Assalamu'alaikum Warahmatullahi Wabarakatuh Ayah/Bunda 🙏

Penerimaan Peserta Didik Baru (PPDB) Terpadu Yayasan Pendidikan Imam Bonjol Al-Afiyah Majalengka Tahun Ajaran 2026/2027 telah resmi dibuka!

Pilihan Jenjang Pendidikan:
• PAUD / TK IT Al-Afiyah (Fondasi Karakter & Cinta Ibadah Usia Dini)
• SDIT Al-Afiyah (Adab Islami, Sains & Tahfidz Al-Qur'an)
• SMP IT Al-Afiyah (Akreditasi A, Program Unggulan Fullday School)

Silakan akses informasi lengkap dan formulir pendaftaran melalui tautan resmi kami:

📌 Portal PPDB Terpadu Yayasan:
${generalLink}

📌 Formulir Pendaftaran Langsung SDIT:
${sdFormLink}

📌 Formulir Pendaftaran Langsung SMP IT:
${smpFormLink}

Mari bimbing ananda menuju masa depan yang sholeh, cerdas, dan mandiri bersama keluarga besar Al-Afiyah.

Wassalamu'alaikum Warahmatullahi Wabarakatuh.`;
  };

  const handleCopyBroadcast = (unit?: 'SD' | 'SMP' | 'TK' | 'ALL') => {
    const target = unit || selectedBroadcastUnit;
    const msg = getBroadcastMessage(target);
    navigator.clipboard.writeText(msg);
    setCopiedBroadcast(true);
    setToast({
      isOpen: true,
      type: 'info',
      title: 'Baarakallahu Fiik!',
      message: `Pesan broadcast promosi jenjang ${target} berhasil disalin ke papan klip.`,
    });
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
    setToast({
      isOpen: true,
      type: 'info',
      title: 'Baarakallahu Fiik!',
      message: `Tautan ${label} berhasil disalin ke papan klip.`,
    });
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
        setToast({
          isOpen: true,
          type: 'error',
          title: 'Qadarullah, Mohon Maaf',
          message: data.error || 'Gagal mengajukan pencairan dana.',
        });
        setIsProcessingPayout(false);
        return;
      }

      setPayoutSuccessMessage('Alhamdulillah, Baarakallahu fiik! Pengajuan pencairan komisi berhasil diajukan dan segera diproses oleh Bagian Keuangan.');
      setToast({
        isOpen: true,
        type: 'success',
        title: 'Alhamdulillah, Baarakallahu Fiik!',
        message: 'Pengajuan pencairan komisi berhasil diajukan dan segera diproses oleh Bagian Keuangan.',
      });
      if (profile) {
        setProfile({
          ...profile,
          balance: data.newBalance ?? (profile.balance - payoutAmount),
          payoutSchedule: data.payoutSchedule || {
            frequency: 'WEEKLY',
            frequencyLabel: '1 Kali Seminggu',
            canWithdraw: false,
            lastPayoutDate: new Date().toISOString(),
            nextAvailableDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            daysLeft: 7,
            ruleNotice: 'Penarikan komisi dapat diajukan maksimal 1 (satu) kali dalam seminggu agar rekapitulasi Bendahara Yayasan tetap tertib dan teratur.',
          },
        });
      }
      setTimeout(() => {
        setShowPayoutModal(false);
        setPayoutSuccessMessage(null);
      }, 2500);
    } catch {
      setPayoutErrorMessage('Qadarullah, terjadi gangguan jaringan saat memproses pencairan dana. Silakan coba kembali.');
      setToast({
        isOpen: true,
        type: 'error',
        title: 'Qadarullah, Terjadi Kendala',
        message: 'Terjadi gangguan jaringan saat memproses pencairan dana. Silakan coba kembali.',
      });
    } finally {
      setIsProcessingPayout(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = activeUnit === 'smp' ? '/login?unit=smp' : activeUnit === 'sd' ? '/login?unit=sd' : '/login';
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
          <div className="flex items-center gap-3">
            <img 
              src={activeUnit === 'smp' ? '/images/smp-logo.png' : '/images/sd-logo.png'} 
              alt={activeUnit === 'smp' ? 'SMP IT Al-Afiyah' : 'SDIT Al-Afiyah'}
              className="w-9 h-9 sm:w-10 sm:h-10 object-contain shrink-0" 
            />
            <div>
              <h1 className="text-sm font-bold text-slate-900 leading-tight">
                {activeUnit === 'smp' ? 'Dashboard Afiliasi SMP IT' : 'Dashboard Afiliasi Al-Afiyah'}
              </h1>
              <p className="text-[11px] text-slate-500">
                {activeUnit === 'smp' ? 'SMP IT Al-Afiyah Majalengka • Be Smart & Religious' : 'Yayasan Pendidikan Imam Bonjol Al-Afiyah Majalengka'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              type="button"
              onClick={handleOpenBankModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-2xs cursor-pointer"
              title="Atur Rekening Pencairan & Profil"
            >
              <Settings className="w-3.5 h-3.5 text-emerald-800" />
              <span className="hidden sm:inline">Pengaturan Rekening</span>
              {isBankIncomplete && (
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              )}
            </button>

            <div className="hidden sm:block text-right border-l border-slate-200 pl-3">
              <span className="text-xs font-bold text-slate-900 block truncate max-w-[140px]">
                {profile?.fullName || 'Mitra Afiliasi'}
              </span>
              <span className="text-[11px] font-mono text-slate-500 block">
                ID: {referralCode}
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

        {/* Top Notifications (Matching Screenshot 2 & 3) */}
        {justRegistered && (
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-900 text-xs sm:text-sm font-semibold flex items-center gap-2.5 shadow-xs">
            <span className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
              ✓
            </span>
            <span>
              Akun afiliasi berhasil dibuat! Kode unikmu: <strong className="font-mono font-bold text-[#064E3B]">{profile?.referralCode}</strong>
            </span>
          </div>
        )}

        {bankSavedJustNow && (
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-900 text-xs sm:text-sm font-semibold flex items-center gap-2.5 shadow-xs">
            <span className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
              ✓
            </span>
            <span>Data rekening bank berhasil disimpan.</span>
          </div>
        )}

        {/* Bank Completion Card / Verified Card (Matching Screenshot 2 & 3) */}
        {isBankIncomplete ? (
          <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-[#064E3B] text-white flex items-center justify-center shrink-0 shadow-sm">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Lengkapi Data Rekening Bank
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Untuk mulai membagikan link referral dan mendapatkan komisi, silakan isi data rekening pencairan Anda di bawah ini.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveBankSubmit} className="space-y-4 pt-2">
              {bankSaveError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  {bankSaveError}
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Nama Bank
                </label>
                <select
                  value={isCustomBank ? 'Bank / Rekening Lainnya (Tulis Sendiri)' : bankFormData.bankName}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === 'Bank / Rekening Lainnya (Tulis Sendiri)') {
                      setIsCustomBank(true);
                      setBankFormData((p) => ({ ...p, bankName: val }));
                    } else {
                      setIsCustomBank(false);
                      setBankFormData((p) => ({ ...p, bankName: val }));
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A651] bg-white cursor-pointer"
                >
                  {INDONESIA_BANKS.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
                {isCustomBank && (
                  <input
                    type="text"
                    required
                    value={customBankName}
                    onChange={(e) => setCustomBankName(e.target.value)}
                    placeholder="Ketik nama bank Anda"
                    className="w-full mt-2 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A651]"
                  />
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Nomor Rekening
                </label>
                <input
                  type="text"
                  required
                  value={bankFormData.bankAccountNumber}
                  onChange={(e) => setBankFormData((p) => ({ ...p, bankAccountNumber: e.target.value }))}
                  placeholder="Contoh: 1234567890"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A651]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Atas Nama
                </label>
                <input
                  type="text"
                  required
                  value={bankFormData.bankAccountHolder}
                  onChange={(e) => setBankFormData((p) => ({ ...p, bankAccountHolder: e.target.value }))}
                  placeholder="Sesuai buku tabungan"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A651]"
                />
              </div>

              <button
                type="submit"
                disabled={isSavingBank}
                className="px-6 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#00A651] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm cursor-pointer disabled:opacity-70"
              >
                {isSavingBank ? 'Menyimpan Rekening...' : 'Simpan Rekening'}
              </button>
            </form>
          </div>
        ) : (
          /* Rekening Pencairan Box (Screenshot 2) */
          <div className="rounded-2xl bg-emerald-50/70 border border-emerald-200 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Rekening Pencairan:</span>
                <span className="font-bold text-slate-900 text-sm sm:text-base">
                  {profile?.bankName} — {profile?.bankAccountNumber} (a.n {profile?.bankAccountHolder})
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleOpenBankModal}
              className="text-xs font-bold text-[#064E3B] hover:underline self-start sm:self-auto cursor-pointer"
            >
              Edit Rekening
            </button>
          </div>
        )}

        {/* 4 Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Balance */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Saldo Komisi Tersedia</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    1x Seminggu
                  </span>
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                    <Wallet className="w-4 h-4" />
                  </div>
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 font-mono">
                Rp {(profile?.balance || 0).toLocaleString('id-ID')}
              </p>
              {profile?.payoutSchedule && !profile.payoutSchedule.canWithdraw && (
                <p className="text-[11px] text-amber-700 font-medium mt-1">
                  ⏳ Penarikan berikutnya dpt diajukan dlm {profile.payoutSchedule.daysLeft} hari lagi
                </p>
              )}
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 truncate max-w-[120px]">
                {profile?.bankName || 'BSI'}
              </span>
              <button
                type="button"
                onClick={() => setShowPayoutModal(true)}
                disabled={(profile?.balance || 0) <= 0 || (profile?.payoutSchedule && !profile.payoutSchedule.canWithdraw)}
                title={
                  profile?.payoutSchedule && !profile.payoutSchedule.canWithdraw
                    ? `Penarikan berikutnya dapat diajukan dalam ${profile.payoutSchedule.daysLeft} hari lagi (kebijakan 1x seminggu).`
                    : (profile?.balance || 0) <= 0
                    ? 'Saldo komisi belum mencukupi.'
                    : 'Ajukan penarikan komisi'
                }
                className="text-xs font-bold text-[#064E3B] hover:text-emerald-900 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                {profile?.payoutSchedule && !profile.payoutSchedule.canWithdraw
                  ? `Tarik Saldo (${profile.payoutSchedule.daysLeft}h lagi)`
                  : 'Tarik Saldo →'}
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
          <div className={`bg-white rounded-2xl p-6 border shadow-2xs flex flex-col justify-between ${
            isBankIncomplete ? 'border-amber-300 ring-2 ring-amber-400/20' : 'border-slate-200/90'
          }`}>
            <div>
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Rekening Tujuan</span>
                <div className={`p-2 rounded-xl ${isBankIncomplete ? 'bg-amber-100 text-amber-700' : 'bg-blue-50 text-blue-700'}`}>
                  <Building2 className="w-4 h-4" />
                </div>
              </div>
              <p className="text-xs font-bold text-slate-900">
                {profile?.bankName || 'Bank Syariah Indonesia'}
              </p>
              {isBankIncomplete ? (
                <div className="mt-1.5">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Belum Diisi (Bisa Diisi Sekarang)</span>
                  </span>
                </div>
              ) : (
                <p className="text-sm font-mono font-bold text-slate-700 mt-1">
                  {profile?.bankAccountNumber}
                </p>
              )}
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 truncate max-w-[120px]">
                {isBankIncomplete ? 'Pencairan tertunda' : `a.n. ${profile?.bankAccountHolder || profile?.fullName}`}
              </span>
              <button
                type="button"
                onClick={handleOpenBankModal}
                className={`text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                  isBankIncomplete ? 'text-amber-800 hover:text-amber-950 font-extrabold underline' : 'text-[#064E3B] hover:text-emerald-900 underline'
                }`}
              >
                <span>{isBankIncomplete ? 'Isi Rekening →' : 'Ubah Rekening →'}</span>
              </button>
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* SD Link */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 flex flex-col justify-between shadow-2xs">
              <div>
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-slate-900 font-bold text-sm">SDIT Al-Afiyah</span>
                  <span className="text-xs font-bold text-emerald-800">Komisi Rp 150.000</span>
                </div>
                <p className="text-[11px] text-slate-500 mb-3">Formulir (Rp 50.000) + Daftar Ulang (Rp 100.000)</p>
                
                <div className="space-y-2">
                  <div>
                    <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider block">1. Tautan Profil &amp; Info SD:</span>
                    <p className="text-[11px] font-mono text-slate-700 truncate bg-slate-50 p-2 rounded-xl border border-slate-200 select-all">
                      {sdLink}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider block">2. Tautan Formulir Langsung SD:</span>
                    <p className="text-[11px] font-mono text-slate-700 truncate bg-slate-50 p-2 rounded-xl border border-slate-200 select-all">
                      {sdFormLink}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedBroadcastUnit('SD');
                    handleCopyBroadcast('SD');
                  }}
                  className="flex-1 py-2.5 px-2 rounded-xl bg-[#064E3B] text-white text-xs font-bold hover:bg-emerald-900 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  title="Salin pesan siar WhatsApp lengkap dengan 2 link (profil & form)"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedBroadcast && selectedBroadcastUnit === 'SD' ? 'Tersalin!' : 'Salin Pesan & 2 Link'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSendWhatsApp('SD')}
                  className="py-2.5 px-3 rounded-xl bg-[#25D366] text-white text-xs font-bold hover:bg-[#20ba5a] transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                  title="Kirim ke WhatsApp"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>WA</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenQr('SDIT Al-Afiyah', sdLink)}
                  className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shadow-2xs"
                  title="QR Code"
                >
                  <QrCode className="w-3.5 h-3.5 text-slate-600" />
                </button>
              </div>
            </div>

            {/* SMP Link */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 flex flex-col justify-between shadow-2xs">
              <div>
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-slate-900 font-bold text-sm">SMP IT Al-Afiyah</span>
                  <span className="text-xs font-bold text-emerald-800">Komisi Rp 150.000</span>
                </div>
                <p className="text-[11px] text-slate-500 mb-3">Formulir (Rp 50.000) + Daftar Ulang (Rp 100.000)</p>
                
                <div className="space-y-2">
                  <div>
                    <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider block">1. Tautan Profil &amp; Info SMP:</span>
                    <p className="text-[11px] font-mono text-slate-700 truncate bg-slate-50 p-2 rounded-xl border border-slate-200 select-all">
                      {smpLink}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider block">2. Tautan Formulir Langsung SMP:</span>
                    <p className="text-[11px] font-mono text-slate-700 truncate bg-slate-50 p-2 rounded-xl border border-slate-200 select-all">
                      {smpFormLink}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedBroadcastUnit('SMP');
                    handleCopyBroadcast('SMP');
                  }}
                  className="flex-1 py-2.5 px-2 rounded-xl bg-[#064E3B] text-white text-xs font-bold hover:bg-emerald-900 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  title="Salin pesan siar WhatsApp lengkap dengan 2 link (profil & form)"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedBroadcast && selectedBroadcastUnit === 'SMP' ? 'Tersalin!' : 'Salin Pesan & 2 Link'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSendWhatsApp('SMP')}
                  className="py-2.5 px-3 rounded-xl bg-[#25D366] text-white text-xs font-bold hover:bg-[#20ba5a] transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                  title="Kirim ke WhatsApp"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>WA</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenQr('SMP IT Al-Afiyah', smpLink)}
                  className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shadow-2xs"
                  title="QR Code"
                >
                  <QrCode className="w-3.5 h-3.5 text-slate-600" />
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
                <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider">
                  Pesan Siar / Broadcast WhatsApp (1-Klik)
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-3xl">
                Setiap pesan siar di bawah sudah otomatis memuat <strong>Link Profil Informasi</strong> dan <strong>Link Formulir Pendaftaran Langsung</strong>. Klik tombol <strong>Salin Pesan &amp; 2 Link</strong> untuk menyalin semuanya dalam 1 kali klik.
              </p>
            </div>
          </div>

          {/* Unit Switcher Tabs - Unit Aktif (SDIT & SMP IT) */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80 overflow-x-auto">
            <button
              type="button"
              onClick={() => setSelectedBroadcastUnit('SD')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                selectedBroadcastUnit === 'SD'
                  ? 'bg-[#064E3B] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <GraduationCap className={`w-3.5 h-3.5 ${selectedBroadcastUnit === 'SD' ? 'text-emerald-300' : 'text-emerald-700'}`} />
              <span>SDIT Al-Afiyah</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedBroadcastUnit('SMP')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                selectedBroadcastUnit === 'SMP'
                  ? 'bg-[#1E3A8A] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <BookOpen className={`w-3.5 h-3.5 ${selectedBroadcastUnit === 'SMP' ? 'text-blue-300' : 'text-blue-700'}`} />
              <span>SMP IT Al-Afiyah</span>
            </button>
          </div>

          {/* Message Preview Container */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Preview Pesan Broadcast Siap Kirim (Sudah Memuat Link Profil &amp; Form):</span>
              <span className="text-[11px] text-slate-500 font-mono">
                {selectedBroadcastUnit === 'SD' ? 'SDIT Al-Afiyah' : 'SMP IT Al-Afiyah'}
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
                      <span>Pesan &amp; 2 Link Berhasil Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Salin Pesan &amp; 2 Link (1-Klik)</span>
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
                Otomatis mengaitkan komisi Anda selama 30 hari sejak calon murid membuka tautan.
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
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-tight">Tarik Saldo Komisi</h3>
                  <p className="text-[10px] text-emerald-800 font-semibold">Jadwal Penarikan: 1 Kali Seminggu</p>
                </div>
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
                {/* Kebijakan Penarikan 1x Seminggu Info Box */}
                <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
                  <span className="text-base">📅</span>
                  <div className="space-y-0.5 leading-relaxed text-[11px]">
                    <strong className="block font-bold text-amber-900">
                      Kebijakan Penarikan: Maksimal 1x per Minggu
                    </strong>
                    <p className="text-amber-800">
                      Untuk menjaga ketertiban administrasi dan memudahkan rekapitulasi Bendahara Yayasan, pengajuan penarikan dana komisi diproses berkala satu kali setiap pekan.
                    </p>
                  </div>
                </div>

                {profile?.payoutSchedule && !profile.payoutSchedule.canWithdraw && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-bold">Batas Waktu Mingguan Sedang Berjalan</strong>
                      <p className="text-[11px] text-rose-700 mt-0.5">
                        Anda telah mengajukan penarikan dalam kurun 7 hari terakhir. Pengajuan penarikan berikutnya dapat dilakukan pada{' '}
                        <strong>
                          {profile.payoutSchedule.nextAvailableDate
                            ? new Date(profile.payoutSchedule.nextAvailableDate).toLocaleDateString('id-ID', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                              })
                            : `${profile.payoutSchedule.daysLeft} hari lagi`}
                        </strong>{' '}
                        ({profile.payoutSchedule.daysLeft} hari lagi).
                      </p>
                    </div>
                  </div>
                )}

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
                    disabled={isProcessingPayout || payoutAmount <= 0 || (profile?.payoutSchedule && !profile.payoutSchedule.canWithdraw)}
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
                  copyToClipboard(selectedQrLink.url, 'Tautan QR Code');
                }}
                className="w-full py-2.5 rounded-xl bg-[#064E3B] hover:bg-emerald-900 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Salin Tautan QR Code
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BANK ACCOUNT & PROFILE SETTINGS MODAL */}
      {showBankModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in-95 duration-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Pengaturan Rekening Pencairan
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Data rekening tujuan transfer bagi hasil resmi Al-Afiyah
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowBankModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {bankSaveSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{bankSaveSuccess}</span>
              </div>
            )}

            {bankSaveError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{bankSaveError}</span>
              </div>
            )}

            <form onSubmit={handleSaveBankSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Pilihan Bank / Dompet Digital (E-Wallet) <span className="text-rose-500">*</span>
                </label>
                <select
                  value={isCustomBank ? 'Bank / Rekening Lainnya (Tulis Sendiri)' : bankFormData.bankName}
                  onChange={(e) => {
                    if (e.target.value === 'Bank / Rekening Lainnya (Tulis Sendiri)') {
                      setIsCustomBank(true);
                      setBankFormData({ ...bankFormData, bankName: '' });
                    } else {
                      setIsCustomBank(false);
                      setBankFormData({ ...bankFormData, bankName: e.target.value });
                    }
                  }}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:border-[#064E3B] focus:ring-2 focus:ring-emerald-600/20 focus:bg-white focus:outline-hidden text-slate-900 cursor-pointer shadow-2xs"
                >
                  <option value="">-- Pilih Bank / E-Wallet Pencairan --</option>
                  {INDONESIA_BANKS.map((bank) => (
                    <option key={bank} value={bank}>
                      {bank}
                    </option>
                  ))}
                </select>

                {isCustomBank && (
                  <div className="mt-2.5 animate-in fade-in duration-200">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Tuliskan Nama Bank / Dompet Digital Anda: <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required={isCustomBank}
                      value={customBankName}
                      onChange={(e) => setCustomBankName(e.target.value)}
                      placeholder="Contoh: Bank Nagari, Bank Papua, Jenius, dll"
                      className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-emerald-600/40 rounded-xl focus:border-[#064E3B] focus:ring-2 focus:ring-emerald-600/20 focus:outline-hidden text-slate-900 shadow-2xs"
                    />
                  </div>
                )}

                <span className="text-[11px] text-slate-500 mt-1.5 block leading-relaxed">
                  💡 Bebas gunakan rekening bank apa saja (BSI, BCA, BRI, Mandiri, BNI, Bank Daerah) atau E-Wallet (DANA / GoPay / OVO) atas nama pribadi Anda.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Nomor Rekening / No. HP E-Wallet <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={bankFormData.bankAccountNumber}
                    onChange={(e) => setBankFormData({ ...bankFormData, bankAccountNumber: e.target.value })}
                    placeholder="Contoh: 7123456789"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl focus:border-[#064E3B] focus:ring-2 focus:ring-emerald-600/20 focus:bg-white focus:outline-hidden text-slate-900 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Nama Pemilik Rekening <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={bankFormData.bankAccountHolder}
                    onChange={(e) => setBankFormData({ ...bankFormData, bankAccountHolder: e.target.value })}
                    placeholder="Sesuai buku tabungan"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:border-[#064E3B] focus:ring-2 focus:ring-emerald-600/20 focus:bg-white focus:outline-hidden text-slate-900 shadow-2xs"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-2">
                  Informasi Kontak Mitra
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nama Lengkap Mitra
                    </label>
                    <input
                      type="text"
                      value={bankFormData.fullName}
                      onChange={(e) => setBankFormData({ ...bankFormData, fullName: e.target.value })}
                      placeholder="Nama Lengkap"
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nomor WhatsApp Aktif
                    </label>
                    <input
                      type="text"
                      value={bankFormData.phone}
                      onChange={(e) => setBankFormData({ ...bankFormData, phone: e.target.value })}
                      placeholder="0812xxxxxxxx"
                      className="w-full px-3.5 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowBankModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Tutup
                </button>
                <button
                  type="submit"
                  disabled={isSavingBank}
                  className="px-5 py-2.5 rounded-xl bg-[#064E3B] hover:bg-emerald-900 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isSavingBank ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Simpan Rekening Pencairan</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Islamic Notification Toast */}
      <IslamicToast
        isOpen={toast.isOpen}
        onClose={() => setToast((prev) => ({ ...prev, isOpen: false }))}
        type={toast.type}
        title={toast.title}
        message={toast.message}
      />
    </div>
  );
}

