'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Share2,
  Users,
  Wallet,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Award,
  CreditCard,
  Copy,
  Check,
  Phone,
  Mail,
  AlertTriangle,
  Building2,
  BarChart3,
  Sparkles,
  ArrowUpRight,
  Flame,
  CheckCheck,
  MessageSquare
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
  totalEarned: number;
  balance: number;
  createdAt: string;
}

interface UnitAffiliatesClientProps {
  schoolSlug: string;
  schoolName: string;
  conversions: UnitAffiliateConversion[];
  affiliates: UnitAffiliateItem[];
}

export default function UnitAffiliatesClient({
  schoolSlug,
  schoolName,
  conversions,
  affiliates,
}: UnitAffiliatesClientProps) {
  const [activeTab, setActiveTab] = useState<'AFFILIATES' | 'CONVERSIONS' | 'CHARTS'>('AFFILIATES');

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
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#064E3B] uppercase tracking-wider mb-1">
            <Share2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>Pusat Kemitraan &amp; Afiliasi Unit</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Kemitraan Afiliasi - {schoolName}
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Pantau arus pendaftaran calon murid baru dari para asatidz, alumni, dan relawan dakwah sekolah beserta status rekening pencairan komisi mitra.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <Link
            href="/affiliate/dashboard"
            target="_blank"
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-[#064E3B] hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Portal Afiliasi Publik</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Pendaftar Rujukan */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pendaftar via Afiliasi</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 tabular-nums">
              {totalReferredStudents}
            </span>
            <span className="text-xs text-slate-400 font-semibold">Calon Murid</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {approvedOrPaid.length} pendaftar telah terkonfirmasi
          </p>
        </div>

        {/* Card 2: Mitra Terdaftar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mitra Afiliasi Aktif</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 tabular-nums">
              {totalAffiliates}
            </span>
            <span className="text-xs text-slate-400 font-semibold">Mitra Terdaftar</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
            <span className="text-emerald-700 font-semibold">{filledBankCount} Rekening Siap</span>
            <span>•</span>
            <span className="text-amber-700 font-semibold">{unfilledBankCount} Perlu Dilengkapi</span>
          </p>
        </div>

        {/* Card 3: Komisi Terbayar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Komisi Telah Dicairkan</span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-xl sm:text-2xl font-black text-slate-900 tabular-nums font-mono">
              {formatRupiah(paidCommission)}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Transfer lunas ke rekening mitra</p>
        </div>

        {/* Card 4: Komisi Menunggu */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Menunggu Pelunasan</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-xl sm:text-2xl font-black text-slate-900 tabular-nums font-mono">
              {formatRupiah(pendingCommission)}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Menunggu biaya formulir PPDB</p>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex items-center space-x-2 border-b border-slate-200/90 pb-3 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('AFFILIATES')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'AFFILIATES'
              ? 'bg-[#064E3B] text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Daftar Akun Mitra Afiliasi ({affiliates.length})</span>
          {unfilledBankCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-400 text-amber-950 font-bold ml-1">
              {unfilledBankCount} Perlu Rek
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('CONVERSIONS')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
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
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'CHARTS'
              ? 'bg-[#064E3B] text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Grafik &amp; Kinerja Afiliasi (Live)</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </button>
      </div>

      {/* TAB 1: MITRA AFILIASI TERDAFTAR */}
      {activeTab === 'AFFILIATES' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden space-y-4">
          {/* Filter Bar */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                value={searchAffiliate}
                onChange={(e) => setSearchAffiliate(e.target.value)}
                placeholder="Cari nama mitra, email, WA, atau kode referral..."
                className="w-full pl-9 pr-4 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#064E3B] focus:ring-1 focus:ring-[#064E3B]"
              />
            </div>

            <div className="flex items-center space-x-2 overflow-x-auto">
              {(['ALL', 'FILLED', 'UNFILLED'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setAffiliateBankFilter(mode)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                    affiliateBankFilter === mode
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {mode === 'ALL'
                    ? `Semua Mitra (${totalAffiliates})`
                    : mode === 'FILLED'
                    ? `Rekening Lengkap (${filledBankCount})`
                    : `Belum Isi Rekening (${unfilledBankCount})`}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          {filteredAffiliates.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <Users className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-700">Tidak ada mitra afiliasi yang sesuai</p>
              <p className="text-[11px] text-slate-400">Coba ubah kata kunci pencarian atau ganti filter status di atas.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Nama Mitra Afiliasi</th>
                    <th className="py-3 px-4">Kontak (WA &amp; Email)</th>
                    <th className="py-3 px-4">Kode Referral</th>
                    <th className="py-3 px-4">Rekening Pencairan Komisi</th>
                    <th className="py-3 px-4">Rujukan Murid</th>
                    <th className="py-3 px-4">Tgl Bergabung</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredAffiliates.map((aff) => {
                    const cleanPhone = aff.phone ? aff.phone.replace(/[^0-9]/g, '') : '';
                    const waFormatted = cleanPhone.startsWith('0')
                      ? '62' + cleanPhone.slice(1)
                      : cleanPhone.startsWith('62')
                      ? cleanPhone
                      : '62' + cleanPhone;

                    const reminderWaText = encodeURIComponent(
                      `Assalamu'alaikum Warahmatullahi Wabarakatuh ${aff.fullName} 🙏\n\nTerima kasih telah bergabung sebagai Mitra Afiliasi ${schoolName} Al-Afiyah Majalengka (Kode: ${aff.referralCode}).\n\nKami melihat data nomor rekening pencairan komisi Anda belum dilengkapi di dasbor. Silakan buka http://al-afiyah.sch.id/affiliate/dashboard lalu klik "Pengaturan Rekening" untuk memasukkan no. rekening BSI/Muamalat/BCA/lainnya agar komisi PPDB Anda dapat langsung kami transfer saat ada calon murid yang mendaftar.\n\nJazakumullah Khairan Katsiran.`
                    );

                    return (
                      <tr key={aff.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold text-xs shrink-0">
                              {aff.fullName.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <span className="block font-bold text-slate-900">{aff.fullName}</span>
                              <span className="text-[10px] text-slate-400 font-normal">
                                Saldo: {formatRupiah(aff.balance)}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="space-y-0.5">
                            {aff.phone && aff.phone !== '-' ? (
                              <a
                                href={`https://wa.me/${waFormatted}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-emerald-800 hover:underline"
                                title="Kirim Pesan WhatsApp"
                              >
                                <Phone className="w-3 h-3 text-emerald-600" />
                                <span>{aff.phone}</span>
                              </a>
                            ) : (
                              <span className="text-slate-400 text-[11px]">-</span>
                            )}
                            <div className="flex items-center gap-1 text-[11px] text-slate-400 truncate max-w-[170px]">
                              <Mail className="w-3 h-3 text-slate-300 shrink-0" />
                              <span className="truncate">{aff.email}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-[11px] font-black px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
                              {aff.referralCode}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopy(aff.referralCode)}
                              className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                              title="Salin Kode Referral"
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
                          {aff.isBankFilled ? (
                            <div className="space-y-0.5">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>{aff.bankName}</span>
                              </span>
                              <div className="font-mono font-bold text-slate-800 text-[11px]">
                                {aff.bankAccountNumber}
                              </div>
                              <div className="text-[10px] text-slate-400 truncate max-w-[160px]">
                                a.n. {aff.bankAccountHolder}
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-1.5">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
                                <AlertTriangle className="w-3 h-3 text-amber-600" />
                                <span>Belum Diisi Mitra</span>
                              </span>
                              {aff.phone && aff.phone !== '-' && (
                                <a
                                  href={`https://wa.me/${waFormatted}?text=${reminderWaText}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="block text-[10px] font-bold text-emerald-700 hover:underline"
                                >
                                  Ingatkan via WA &rarr;
                                </a>
                              )}
                            </div>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <div>
                            <span className="font-black text-slate-900 text-sm">
                              {aff.totalConversionsThisUnit}
                            </span>
                            <span className="text-slate-400 text-[11px] ml-1">Murid di {schoolSlug.toUpperCase()}</span>
                          </div>
                          <span className="text-[10px] text-slate-400">
                            Total {aff.totalConversionsAllUnits} murid (semua unit)
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-slate-400 font-medium text-[11px]">
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
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden space-y-4">
          {/* Filter Controls */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari nama peserta didik, no registrasi, atau nama mitra..."
                className="w-full pl-9 pr-4 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#064E3B] focus:ring-1 focus:ring-[#064E3B]"
              />
            </div>

            <div className="flex items-center space-x-2 overflow-x-auto">
              {(['ALL', 'PENDING', 'APPROVED', 'PAID'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
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
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2">
                <Share2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">
                Belum Ada Pendaftar Calon Murid via Jalur Afiliasi
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                Saat calon wali murid mendaftar menggunakan tautan atau kode referral dari mitra resmi, data calon murid beserta nama dan nomor registrasi akan langsung tampil di sini.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Calon Peserta Didik</th>
                    <th className="py-3 px-4">Mitra Perujuk</th>
                    <th className="py-3 px-4">Kode Referral</th>
                    <th className="py-3 px-4">Komisi</th>
                    <th className="py-3 px-4">Status Komisi</th>
                    <th className="py-3 px-4">Tanggal Masuk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredConversions.map((conv) => (
                    <tr key={conv.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        <div className="text-xs sm:text-sm font-bold text-slate-900">{conv.studentName}</div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                          {conv.registrationNo}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700">
                        {conv.affiliateName}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                          {conv.referralCode}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {formatRupiah(conv.commissionAmount)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            conv.status === 'PAID'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : conv.status === 'APPROVED'
                              ? 'bg-teal-50 text-teal-700 border border-teal-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {conv.status === 'PAID' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                          {conv.status === 'APPROVED' && <CreditCard className="w-3 h-3 text-teal-600" />}
                          {conv.status === 'PENDING' && <Clock className="w-3 h-3 text-amber-600" />}
                          <span>
                            {conv.status === 'PAID'
                              ? 'Telah Ditransfer'
                              : conv.status === 'APPROVED'
                              ? 'Siap Dicairkan'
                              : 'Menunggu Pelunasan'}
                          </span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400 font-medium text-[11px]">
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

      {/* TAB 3: GRAFIK & ANALISIS KINERJA (GRAFIK NYALA) */}
      {activeTab === 'CHARTS' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Chart 1: Leaderboard Top Mitra Afiliasi */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-2xs space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Flame className="w-4 h-4 text-amber-500" />
                    <span>Peringkat Mitra Teraktif ({schoolSlug.toUpperCase()})</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Mitra dengan rujukan calon murid tertinggi
                  </p>
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Live
                </span>
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
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                              idx === 0
                                ? 'bg-amber-400 text-amber-950 font-black ring-2 ring-amber-300'
                                : idx === 1
                                ? 'bg-slate-300 text-slate-800 font-bold'
                                : idx === 2
                                ? 'bg-amber-700 text-white font-bold'
                                : 'bg-slate-100 text-slate-600'
                            }`}>
                              {idx + 1}
                            </span>
                            <span className="font-bold text-slate-900">{item.fullName}</span>
                            <span className="font-mono text-[10px] text-slate-400">({item.referralCode})</span>
                          </div>
                          <span className="font-black text-slate-900 font-mono">
                            {item.totalConversionsThisUnit} Murid
                          </span>
                        </div>
                        {/* Glowing progress bar */}
                        <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden p-0.5">
                          <div
                            className="h-full rounded-full bg-linear-to-r from-emerald-500 to-teal-400 transition-all duration-500 shadow-xs"
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
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-2xs space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <span>Komposisi Status Komisi PPDB</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Progres pelunasan pendaftar &amp; pencairan komisi mitra
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-slate-700">
                  {conversions.length} Total
                </span>
              </div>

              {/* Progress Stack Bar */}
              <div className="space-y-3 pt-2">
                <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
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
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase block">Lunas Dicairkan</span>
                    <strong className="text-lg font-black text-emerald-950 font-mono block mt-0.5">
                      {paidCount}
                    </strong>
                    <span className="text-[10px] text-emerald-700">{paidPct}%</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-teal-50 border border-teal-200">
                    <span className="text-[10px] font-bold text-teal-800 uppercase block">Siap Dicairkan</span>
                    <strong className="text-lg font-black text-teal-950 font-mono block mt-0.5">
                      {approvedCount}
                    </strong>
                    <span className="text-[10px] text-teal-700">{approvedPct}%</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200">
                    <span className="text-[10px] font-bold text-amber-800 uppercase block">Menunggu Bayar</span>
                    <strong className="text-lg font-black text-amber-950 font-mono block mt-0.5">
                      {pendingCount}
                    </strong>
                    <span className="text-[10px] text-amber-700">{pendingPct}%</span>
                  </div>
                </div>
              </div>

              {/* Status Rekening Kesiapan */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-slate-600" />
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Kesiapan Rekening Mitra</span>
                    <span className="text-[11px] text-slate-500">
                      {filledBankCount} dari {totalAffiliates} mitra telah mengisi nomor rekening
                    </span>
                  </div>
                </div>
                <span className="text-sm font-black font-mono text-emerald-700">
                  {totalAffiliates > 0 ? Math.round((filledBankCount / totalAffiliates) * 100) : 0}% Siap
                </span>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
