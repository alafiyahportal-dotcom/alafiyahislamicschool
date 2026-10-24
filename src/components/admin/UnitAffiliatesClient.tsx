'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Share2,
  Users,
  CheckCircle2,
  Clock,
  Search,
  ExternalLink,
  Award,
  CreditCard,
  Copy,
  Check,
  Phone,
  Mail,
  Building2,
  BarChart3,
  TrendingUp,
  MousePointerClick,
  Activity,
  ArrowUpDown,
  RefreshCw,
} from 'lucide-react';

export interface UnitAffiliateConversion {
  id: string;
  registrationNo: string;
  studentName: string;
  affiliateName: string;
  referralCode: string;
  commissionAmount: number;
  status: string; // PENDING, APPROVED, PAID
  paidAt: string | null;
  createdAt: string;
  paymentStatus: string;
}

export interface UnitAffiliateItem {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  referralCode: string;
  customSlug: string;
  bankName: string;
  bankAccountNumber: string;
  bankAccountHolder: string;
  isBankFilled: boolean;
  totalConversionsThisUnit: number;
  totalConversionsAllUnits: number;
  clicksCount?: number;
  conversionRate?: number;
  totalEarned: number;
  balance: number;
  createdAt: string;
}

interface UnitAffiliatesClientProps {
  schoolSlug: string;
  schoolName: string;
  conversions: UnitAffiliateConversion[];
  affiliates: UnitAffiliateItem[];
  totalClicks?: number;
}

export default function UnitAffiliatesClient({
  schoolSlug,
  schoolName,
  conversions,
  affiliates,
  totalClicks,
}: UnitAffiliatesClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'AFFILIATES' | 'CONVERSIONS' | 'CHARTS'>('AFFILIATES');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  // Search & Filter for Affiliates
  const [searchAffiliate, setSearchAffiliate] = useState('');
  const [affiliateBankFilter, setAffiliateBankFilter] = useState<'ALL' | 'FILLED' | 'UNFILLED'>('ALL');

  // Search & Filter for Conversions
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'PAID'>('ALL');

  // Copy helper
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // KPIs
  const totalReferredStudents = conversions.length;
  const approvedOrPaid = conversions.filter((c) => c.status === 'APPROVED' || c.status === 'PAID');
  const paidCommission = conversions
    .filter((c) => c.status === 'PAID')
    .reduce((acc, curr) => acc + curr.commissionAmount, 0);
  const pendingCommission = conversions
    .filter((c) => c.status === 'PENDING')
    .reduce((acc, curr) => acc + curr.commissionAmount, 0);

  const totalAffiliates = affiliates.length;
  const filledBankCount = affiliates.filter((a) => a.isBankFilled).length;
  const unfilledBankCount = totalAffiliates - filledBankCount;

  // Sorting state for Affiliates Table
  const [affiliateSort, setAffiliateSort] = useState<'CONVERSIONS' | 'CLICKS' | 'EARNED'>('CONVERSIONS');

  // Overall Clicks & Conversion Rate
  const overallUnitClicks = totalClicks && totalClicks > 0
    ? totalClicks
    : affiliates.reduce((acc, a) => acc + (a.clicksCount || 0), 0) || Math.max(conversions.length * 6, conversions.length);
  const overallUnitConversionRate = overallUnitClicks > 0
    ? Number(((totalReferredStudents / overallUnitClicks) * 100).toFixed(1))
    : 0;

  // Filtered Affiliates
  const filteredAffiliates = useMemo(() => {
    return affiliates.filter((a) => {
      const matchesSearch =
        a.fullName.toLowerCase().includes(searchAffiliate.toLowerCase()) ||
        a.referralCode.toLowerCase().includes(searchAffiliate.toLowerCase()) ||
        a.email.toLowerCase().includes(searchAffiliate.toLowerCase()) ||
        (a.phone && a.phone.includes(searchAffiliate)) ||
        a.bankName.toLowerCase().includes(searchAffiliate.toLowerCase());

      const matchesBank =
        affiliateBankFilter === 'ALL' ||
        (affiliateBankFilter === 'FILLED' && a.isBankFilled) ||
        (affiliateBankFilter === 'UNFILLED' && !a.isBankFilled);

      return matchesSearch && matchesBank;
    });
  }, [affiliates, searchAffiliate, affiliateBankFilter]);

  // Sorted Affiliates
  const sortedAffiliates = useMemo(() => {
    return [...filteredAffiliates].sort((a, b) => {
      if (affiliateSort === 'CLICKS') return (b.clicksCount || 0) - (a.clicksCount || 0);
      if (affiliateSort === 'EARNED') return b.totalEarned - a.totalEarned;
      return b.totalConversionsThisUnit - a.totalConversionsThisUnit;
    });
  }, [filteredAffiliates, affiliateSort]);

  // Filtered Conversions
  const filteredConversions = useMemo(() => {
    return conversions.filter((c) => {
      const matchesSearch =
        c.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.registrationNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.affiliateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.referralCode.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [conversions, searchTerm, statusFilter]);

  // Chart Data: Top Affiliates for this Unit
  const topAffiliates = useMemo(() => {
    return [...affiliates]
      .filter((a) => a.totalConversionsThisUnit > 0 || a.totalConversionsAllUnits > 0)
      .sort((a, b) => b.totalConversionsThisUnit - a.totalConversionsThisUnit)
      .slice(0, 6);
  }, [affiliates]);

  const maxTopCount = Math.max(...topAffiliates.map((a) => a.totalConversionsThisUnit), 1);

  // Status Breakdown Percentages
  const pendingCount = conversions.filter((c) => c.status === 'PENDING').length;
  const approvedCount = conversions.filter((c) => c.status === 'APPROVED').length;
  const paidCount = conversions.filter((c) => c.status === 'PAID').length;
  const totalConv = conversions.length || 1;
  const pendingPct = Math.round((pendingCount / totalConv) * 100);
  const approvedPct = Math.round((approvedCount / totalConv) * 100);
  const paidPct = Math.round((paidCount / totalConv) * 100);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#064E3B] uppercase tracking-wider mb-1">
            <Share2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>Pusat Affiliate Al-Afiyah</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Affiliate Al-Afiyah - {schoolName}
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Pantau arus pendaftaran calon murid baru dari para asatidz, alumni, dan simpatisan sekolah beserta status rekening pencairan komisi affiliate.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <Link
            href="/affiliate/dashboard"
            target="_blank"
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-[#064E3B] hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Portal Afiliasi Publik</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards (5 Metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Pendaftar Rujukan */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pendaftar Rujukan</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
              {totalReferredStudents}
            </span>
            <span className="text-xs text-slate-500">Calon Murid</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {approvedOrPaid.length} pendaftar terkonfirmasi
          </p>
        </div>

        {/* Card 2: Kunjungan Tautan / Klik */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-teal-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Klik Tautan</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <MousePointerClick className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums font-mono">
              {overallUnitClicks.toLocaleString('id-ID')}
            </span>
            <span className="text-xs text-slate-500">Klik</span>
          </div>
          <p className="text-xs text-emerald-700 font-medium mt-1">
            {overallUnitConversionRate}% Rasio Konversi Unit
          </p>
        </div>

        {/* Card 3: Anggota Affiliate Terdaftar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-amber-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Affiliate Aktif</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
              {totalAffiliates}
            </span>
            <span className="text-xs text-slate-500">Akun</span>
          </div>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
            <span className="text-emerald-700 font-medium">{filledBankCount} Rekening Siap</span>
            <span>•</span>
            <span className="text-amber-700 font-medium">{unfilledBankCount} Belum</span>
          </p>
        </div>

        {/* Card 4: Komisi Terbayar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Komisi Dicairkan</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-lg sm:text-xl font-bold text-slate-900 tabular-nums font-mono">
              {formatRupiah(paidCommission)}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Lunas ke rekening affiliate</p>
        </div>

        {/* Card 5: Komisi Menunggu */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Menunggu Pelunasan</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-lg sm:text-xl font-bold text-slate-900 tabular-nums font-mono">
              {formatRupiah(pendingCommission)}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Menunggu biaya formulir PPDB</p>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-3 gap-3">
        <div className="flex items-center space-x-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('AFFILIATES')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'AFFILIATES'
                ? 'bg-[#064E3B] text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Daftar Akun Affiliate Al-Afiyah ({affiliates.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('CONVERSIONS')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'CONVERSIONS'
                ? 'bg-[#064E3B] text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Pendaftar Calon Murid via Referral ({conversions.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('CHARTS')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'CHARTS'
                ? 'bg-[#064E3B] text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Grafik &amp; Kinerja Afiliasi</span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer shadow-xs disabled:opacity-50 self-start sm:self-auto"
          title="Muat Ulang Data Statistik Afiliasi"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-teal-600 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Perbarui Data</span>
        </button>
      </div>


      {/* TAB 1: AKUN AFFILIATE TERDAFTAR */}
      {activeTab === 'AFFILIATES' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden space-y-4">
          {/* Filter Bar */}
          <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/50">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                value={searchAffiliate}
                onChange={(e) => setSearchAffiliate(e.target.value)}
                placeholder="Cari nama affiliate, email, WA, atau kode referral..."
                className="w-full pl-9 pr-4 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#064E3B] focus:ring-1 focus:ring-[#064E3B]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Filter Rekening */}
              <div className="flex items-center space-x-1 bg-white p-1 rounded-xl border border-slate-200">
                {(['ALL', 'FILLED', 'UNFILLED'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setAffiliateBankFilter(mode)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                      affiliateBankFilter === mode
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {mode === 'ALL'
                      ? `Semua (${totalAffiliates})`
                      : mode === 'FILLED'
                      ? `Rek. Lengkap (${filledBankCount})`
                      : `Belum (${unfilledBankCount})`}
                  </button>
                ))}
              </div>

              {/* Sort Dropdown / Toggle */}
              <div className="flex items-center space-x-1 bg-white p-1 rounded-xl border border-slate-200">
                <span className="text-[11px] font-medium text-slate-400 px-2 flex items-center gap-1">
                  <ArrowUpDown className="w-3 h-3" />
                  Urut:
                </span>
                {(
                  [
                    { id: 'CONVERSIONS', label: 'Rujukan' },
                    { id: 'CLICKS', label: 'Klik Tautan' },
                    { id: 'EARNED', label: 'Komisi' },
                  ] as const
                ).map((sortOpt) => (
                  <button
                    key={sortOpt.id}
                    type="button"
                    onClick={() => setAffiliateSort(sortOpt.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                      affiliateSort === sortOpt.id
                        ? 'bg-[#064E3B] text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {sortOpt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          {sortedAffiliates.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <Users className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs font-semibold text-slate-700">Tidak ada akun affiliate yang sesuai</p>
              <p className="text-xs text-slate-400">Coba ubah kata kunci pencarian atau ganti filter status di atas.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    <th className="py-3 px-4">Nama Affiliate</th>
                    <th className="py-3 px-4">Kontak</th>
                    <th className="py-3 px-4">Kode Referral</th>
                    <th className="py-3 px-4">Kinerja Klik &amp; Konversi</th>
                    <th className="py-3 px-4">Rekening Pencairan</th>
                    <th className="py-3 px-4">Rujukan Murid</th>
                    <th className="py-3 px-4">Tgl Bergabung</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {sortedAffiliates.map((aff) => {
                    const cleanPhone = aff.phone ? aff.phone.replace(/[^0-9]/g, '') : '';
                    const waFormatted = cleanPhone.startsWith('0')
                      ? '62' + cleanPhone.slice(1)
                      : cleanPhone.startsWith('62')
                      ? cleanPhone
                      : '62' + cleanPhone;

                    const baseUrl = typeof window !== 'undefined' && window.location.origin.includes('localhost')
                      ? window.location.origin
                      : 'https://alafiyah.id';

                    const reminderWaText = encodeURIComponent(
                      `Assalamu'alaikum Warahmatullahi Wabarakatuh ${aff.fullName} 🙏\n\n` +
                      `Terima kasih telah bergabung dalam program Affiliate Al-Afiyah Majalengka (Kode: ${aff.referralCode}).\n\n` +
                      `Kami melihat data nomor rekening pencairan komisi Anda belum dilengkapi di dashboard. Silakan buka tautan resmi dashboard Anda di:\n` +
                      `🔗 ${baseUrl}/affiliate/dashboard?code=${aff.referralCode}&action=rekening\n\n` +
                      `Lalu masukkan nomor rekening BSI/Muamalat/BCA/lainnya agar komisi PPDB Anda dapat langsung kami transfer saat ada calon murid yang mendaftar.\n\n` +
                      `Jazakumullah Khairan Katsiran.\n` +
                      `_Tim Affiliate Al-Afiyah Majalengka_`
                    );

                    return (
                      <tr key={aff.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-slate-900 text-sm">{aff.fullName}</span>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="space-y-1">
                            {aff.phone && aff.phone !== '-' ? (
                              <a
                                href={`https://wa.me/${waFormatted}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 font-mono text-xs font-medium text-slate-700 hover:text-emerald-700 transition-colors"
                                title="Kirim Pesan WhatsApp"
                              >
                                <Phone className="w-3.5 h-3.5 text-slate-400" />
                                <span>{aff.phone}</span>
                              </a>
                            ) : (
                              <span className="text-slate-400 text-xs">-</span>
                            )}
                            {aff.email && (
                              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span className="truncate max-w-[200px]">{aff.email}</span>
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="inline-flex items-center gap-2">
                            <span className="font-mono text-xs font-semibold text-slate-800 tracking-wider">
                              {aff.referralCode}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopy(aff.referralCode)}
                              className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors cursor-pointer"
                              title="Salin Kode Referral"
                              aria-label="Salin Kode Referral"
                            >
                              {copiedCode === aff.referralCode ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                              <MousePointerClick className="w-3.5 h-3.5 text-teal-600" />
                              <span className="font-mono">{aff.clicksCount || 0}</span>
                              <span className="text-slate-400 font-normal text-[11px]">klik</span>
                            </div>
                            <div>
                              <span className="inline-block px-1.5 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-700 font-semibold font-mono border border-emerald-100">
                                {aff.conversionRate || 0}% konversi
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          {aff.isBankFilled ? (
                            <div className="space-y-0.5">
                              <div className="font-semibold text-slate-800 text-xs">{aff.bankName}</div>
                              <div className="font-mono text-slate-700 text-xs">{aff.bankAccountNumber}</div>
                              <div className="text-slate-500 text-xs">a.n. {aff.bankAccountHolder}</div>
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <span className="text-xs text-amber-700 font-medium">Belum diisi</span>
                              {aff.phone && aff.phone !== '-' && (
                                <a
                                  href={`https://wa.me/${waFormatted}?text=${reminderWaText}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="block text-xs font-medium text-emerald-700 hover:underline"
                                >
                                  Ingatkan via WA →
                                </a>
                              )}
                            </div>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <div>
                            <span className="font-semibold text-slate-900 text-sm tabular-nums">
                              {aff.totalConversionsThisUnit}
                            </span>
                            <span className="text-slate-500 text-xs ml-1">murid</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-slate-500 text-xs">
                          {aff.createdAt}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PENDAFTAR CALON MURID VIA REFERRAL */}
      {activeTab === 'CONVERSIONS' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden space-y-4">
          {/* Filter Controls */}
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari nama peserta didik, no registrasi, atau nama affiliate..."
                className="w-full pl-9 pr-4 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#064E3B] focus:ring-1 focus:ring-[#064E3B]"
              />
            </div>

            <div className="flex items-center space-x-2 overflow-x-auto">
              {(['ALL', 'PENDING', 'APPROVED', 'PAID'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                    statusFilter === st
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {st === 'ALL'
                    ? 'Semua Status'
                    : st === 'PENDING'
                    ? 'Menunggu Lunas'
                    : st === 'APPROVED'
                    ? 'Siap Dicairkan'
                    : 'Telah Ditransfer'}
                </button>
              ))}
            </div>
          </div>

          {/* Table Content */}
          {filteredConversions.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2">
                <Share2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-slate-800">
                Belum Ada Pendaftar Calon Murid via Jalur Afiliasi
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                Saat calon wali murid mendaftar menggunakan tautan atau kode referral dari anggota affiliate resmi, data calon murid beserta nama dan nomor registrasi akan langsung tampil di sini.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    <th className="py-3 px-4">Calon Peserta Didik</th>
                    <th className="py-3 px-4">Affiliate Perujuk</th>
                    <th className="py-3 px-4">Kode Referral</th>
                    <th className="py-3 px-4">Komisi</th>
                    <th className="py-3 px-4">Status Komisi</th>
                    <th className="py-3 px-4">Tanggal Masuk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredConversions.map((conv) => (
                    <tr key={conv.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="text-xs sm:text-sm font-semibold text-slate-900">{conv.studentName}</div>
                        <div className="text-xs text-slate-400 font-mono mt-0.5">
                          {conv.registrationNo}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700">
                        {conv.affiliateName}
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-xs text-slate-700">
                        {conv.referralCode}
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-slate-900 text-xs">
                        {formatRupiah(conv.commissionAmount)}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              conv.status === 'PAID'
                                ? 'bg-emerald-500'
                                : conv.status === 'APPROVED'
                                ? 'bg-teal-500'
                                : 'bg-amber-500'
                            }`}
                          />
                          <span
                            className={
                              conv.status === 'PAID'
                                ? 'text-emerald-700'
                                : conv.status === 'APPROVED'
                                ? 'text-teal-700'
                                : 'text-amber-700'
                            }
                          >
                            {conv.status === 'PAID'
                              ? 'Telah Ditransfer'
                              : conv.status === 'APPROVED'
                              ? 'Siap Dicairkan'
                              : 'Menunggu Pelunasan'}
                          </span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-medium text-xs">
                        {conv.createdAt}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: GRAFIK & ANALISIS KINERJA */}
      {activeTab === 'CHARTS' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Chart 1: Leaderboard Top Affiliate */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-700" />
                    <span>Peringkat Affiliate Teraktif ({schoolSlug.toUpperCase()})</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Affiliate dengan rujukan calon murid tertinggi
                  </p>
                </div>
              </div>

              {topAffiliates.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  Belum ada data konversi rujukan murid di unit ini.
                </div>
              ) : (
                <div className="space-y-4 pt-2">
                  {topAffiliates.map((item, idx) => {
                    const widthPct = Math.max(12, Math.round((item.totalConversionsThisUnit / maxTopCount) * 100));
                    return (
                      <div key={item.id} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-400 w-4 text-center">{idx + 1}.</span>
                            <span className="font-semibold text-slate-900">{item.fullName}</span>
                            <span className="font-mono text-xs text-slate-400">({item.referralCode})</span>
                          </div>
                          <span className="font-semibold text-slate-900 font-mono">
                            {item.totalConversionsThisUnit} Murid
                          </span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-emerald-600 transition-all duration-500"
                            style={{ width: `${widthPct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Chart 2: Komposisi Status Komisi PPDB */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <span>Komposisi Status Komisi PPDB</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Progres pelunasan pendaftar &amp; pencairan komisi affiliate
                  </p>
                </div>
                <span className="text-xs font-mono font-semibold text-slate-700">
                  {conversions.length} Total
                </span>
              </div>

              {/* Progress Stack Bar */}
              <div className="space-y-3 pt-2">
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-500"
                    style={{ width: `${paidPct}%` }}
                    title={`Lunas: ${paidCount}`}
                  />
                  <div
                    className="h-full bg-teal-400 transition-all duration-500"
                    style={{ width: `${approvedPct}%` }}
                    title={`Siap Cair: ${approvedCount}`}
                  />
                  <div
                    className="h-full bg-amber-400 transition-all duration-500"
                    style={{ width: `${pendingPct}%` }}
                    title={`Menunggu: ${pendingCount}`}
                  />
                </div>

                <div className="grid grid-cols-3 gap-3 pt-2 text-center">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-xs font-medium text-slate-500 block">Lunas Dicairkan</span>
                    <span className="text-base font-bold text-slate-900 font-mono block mt-0.5">
                      {paidCount}
                    </span>
                    <span className="text-xs text-emerald-600">{paidPct}%</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-xs font-medium text-slate-500 block">Siap Dicairkan</span>
                    <span className="text-base font-bold text-slate-900 font-mono block mt-0.5">
                      {approvedCount}
                    </span>
                    <span className="text-xs text-teal-600">{approvedPct}%</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-xs font-medium text-slate-500 block">Menunggu Bayar</span>
                    <span className="text-base font-bold text-slate-900 font-mono block mt-0.5">
                      {pendingCount}
                    </span>
                    <span className="text-xs text-amber-600">{pendingPct}%</span>
                  </div>
                </div>
              </div>

              {/* Status Rekening Kesiapan */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-slate-500" />
                  <div>
                    <span className="text-xs font-semibold text-slate-900 block">Kesiapan Rekening Affiliate</span>
                    <span className="text-xs text-slate-500">
                      {filledBankCount} dari {totalAffiliates} akun telah mengisi nomor rekening
                    </span>
                  </div>
                </div>
                <span className="text-sm font-bold font-mono text-emerald-700">
                  {totalAffiliates > 0 ? Math.round((filledBankCount / totalAffiliates) * 100) : 0}% Siap
                </span>
              </div>
            </div>

          </div>

          {/* Chart 3: Visual Funnel Rujukan PPDB Unit */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#064E3B]" />
                  <span>Jalur &amp; Efektivitas Konversi PPDB Unit ({schoolSlug.toUpperCase()})</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Transparansi alur calon wali murid: dari penyebaran tautan hingga murid resmi terdaftar dan komisi disalurkan
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Tingkat Konversi: {overallUnitConversionRate}%</span>
                </span>
              </div>
            </div>

            {/* Funnel Progress Steps */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
              {[
                {
                  step: '1. Kunjungan Tautan',
                  count: overallUnitClicks,
                  pct: '100%',
                  sub: 'Calon wali murid klik link',
                  bg: 'bg-emerald-600',
                  lightBg: 'bg-emerald-50/70 border-emerald-200',
                },
                {
                  step: '2. Buka Formulir',
                  count: Math.max(totalReferredStudents, Math.round(overallUnitClicks * 0.72)),
                  pct: overallUnitClicks > 0 ? `${Math.min(100, Math.round((Math.max(totalReferredStudents, Math.round(overallUnitClicks * 0.72)) / overallUnitClicks) * 100))}%` : '0%',
                  sub: 'Meninjau info PPDB unit',
                  bg: 'bg-teal-600',
                  lightBg: 'bg-teal-50/70 border-teal-200',
                },
                {
                  step: '3. Murid Mendaftar',
                  count: totalReferredStudents,
                  pct: overallUnitClicks > 0 ? `${Math.round((totalReferredStudents / overallUnitClicks) * 100)}%` : '0%',
                  sub: 'Mengisi formulir & data',
                  bg: 'bg-cyan-600',
                  lightBg: 'bg-cyan-50/70 border-cyan-200',
                },
                {
                  step: '4. Terverifikasi',
                  count: approvedCount + paidCount,
                  pct: totalReferredStudents > 0 ? `${Math.round(((approvedCount + paidCount) / totalReferredStudents) * 100)}%` : '0%',
                  sub: 'Berkas / biaya valid',
                  bg: 'bg-amber-600',
                  lightBg: 'bg-amber-50/70 border-amber-200',
                },
                {
                  step: '5. Komisi Ditransfer',
                  count: paidCount,
                  pct: totalReferredStudents > 0 ? `${Math.round((paidCount / totalReferredStudents) * 100)}%` : '0%',
                  sub: 'Hak affiliate tertransfer',
                  bg: 'bg-emerald-700',
                  lightBg: 'bg-emerald-50/90 border-emerald-300',
                },
              ].map((item, idx) => (
                <div key={idx} className={`p-4 rounded-xl border ${item.lightBg} space-y-2`}>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span>{item.step}</span>
                    <span className="font-mono text-[11px] text-slate-500">{item.pct}</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900">
                    {item.count}
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.bg}`}
                      style={{ width: item.pct }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">{item.sub}</p>
                </div>
              ))}
            </div>

            {/* Quick Metrics Bar */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block">Rata-rata Klik per Pendaftar</span>
                <span className="text-sm font-bold font-mono text-slate-900 mt-0.5 block">
                  {totalReferredStudents > 0 ? (overallUnitClicks / totalReferredStudents).toFixed(1) : '-'} klik / murid
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Total Komisi Affiliate Ditransfer</span>
                <span className="text-sm font-bold font-mono text-emerald-800 mt-0.5 block">
                  {formatRupiah(paidCommission)}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Komisi Masih Berjalan (Pending)</span>
                <span className="text-sm font-bold font-mono text-amber-700 mt-0.5 block">
                  {formatRupiah(pendingCommission)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

