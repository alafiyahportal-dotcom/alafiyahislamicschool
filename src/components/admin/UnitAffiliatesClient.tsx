'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
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
      <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-[#064E3B] hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Portal Afiliasi Publik</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Pendaftar Rujukan */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pendaftar via Afiliasi</span>
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

        {/* Card 2: Mitra Terdaftar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Mitra Afiliasi Aktif</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
              {totalAffiliates}
            </span>
            <span className="text-xs text-slate-500">Mitra Terdaftar</span>
          </div>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
            <span className="text-emerald-700 font-medium">{filledBankCount} Rekening Siap</span>
            <span>•</span>
            <span className="text-amber-700 font-medium">{unfilledBankCount} Belum Lengkap</span>
          </p>
        </div>

        {/* Card 3: Komisi Terbayar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Komisi Dicairkan</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums font-mono">
              {formatRupiah(paidCommission)}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Transfer lunas ke rekening mitra</p>
        </div>

        {/* Card 4: Komisi Menunggu */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Menunggu Pelunasan</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums font-mono">
              {formatRupiah(pendingCommission)}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Menunggu biaya formulir PPDB</p>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-3 overflow-x-auto">
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
          <span>Daftar Akun Mitra Afiliasi ({affiliates.length})</span>
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

      {/* TAB 1: MITRA AFILIASI TERDAFTAR */}
      {activeTab === 'AFFILIATES' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden space-y-4">
          {/* Filter Bar */}
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
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
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                    affiliateBankFilter === mode
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {mode === 'ALL'
                    ? `Semua Mitra (${totalAffiliates})`
                    : mode === 'FILLED'
                    ? `Rekening Lengkap (${filledBankCount})`
                    : `Belum Lengkap (${unfilledBankCount})`}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          {filteredAffiliates.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <Users className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs font-semibold text-slate-700">Tidak ada mitra afiliasi yang sesuai</p>
              <p className="text-xs text-slate-400">Coba ubah kata kunci pencarian atau ganti filter status di atas.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    <th className="py-3 px-4">Nama Mitra Afiliasi</th>
                    <th className="py-3 px-4">Kontak</th>
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

                    const baseUrl = typeof window !== 'undefined' && window.location.origin.includes('localhost')
                      ? window.location.origin
                      : 'https://alafiyah.id';

                    const reminderWaText = encodeURIComponent(
                      `Assalamu'alaikum Warahmatullahi Wabarakatuh ${aff.fullName} 🙏\n\n` +
                      `Terima kasih telah bergabung sebagai Mitra Afiliasi Al-Afiyah Majalengka (Kode: ${aff.referralCode}).\n\n` +
                      `Kami melihat data nomor rekening pencairan komisi Anda belum dilengkapi di dasbor. Silakan buka tautan resmi dasbor Anda di:\n` +
                      `🔗 ${baseUrl}/affiliate/dashboard?code=${aff.referralCode}&action=rekening\n\n` +
                      `Lalu masukkan nomor rekening BSI/Muamalat/BCA/lainnya agar komisi PPDB Anda dapat langsung kami transfer saat ada calon murid yang mendaftar.\n\n` +
                      `Jazakumullah Khairan Katsiran.\n` +
                      `_Tim Kemitraan Afiliasi Al-Afiyah Majalengka_`
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
                Saat calon wali murid mendaftar menggunakan tautan atau kode referral dari mitra resmi, data calon murid beserta nama dan nomor registrasi akan langsung tampil di sini.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
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
            
            {/* Chart 1: Leaderboard Top Mitra Afiliasi */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-700" />
                    <span>Peringkat Mitra Teraktif ({schoolSlug.toUpperCase()})</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Mitra dengan rujukan calon murid tertinggi
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
                    Progres pelunasan pendaftar &amp; pencairan komisi mitra
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
                    <span className="text-xs font-semibold text-slate-900 block">Kesiapan Rekening Mitra</span>
                    <span className="text-xs text-slate-500">
                      {filledBankCount} dari {totalAffiliates} mitra telah mengisi nomor rekening
                    </span>
                  </div>
                </div>
                <span className="text-sm font-bold font-mono text-emerald-700">
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

