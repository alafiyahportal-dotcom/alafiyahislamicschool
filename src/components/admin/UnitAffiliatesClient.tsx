'use client';

import React, { useState } from 'react';
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
  CreditCard
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

interface UnitAffiliatesClientProps {
  schoolSlug: string;
  schoolName: string;
  conversions: UnitAffiliateConversion[];
  totalAffiliatesCount: number;
}

export default function UnitAffiliatesClient({
  schoolSlug,
  schoolName,
  conversions,
  totalAffiliatesCount,
}: UnitAffiliatesClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'PAID'>('ALL');

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const totalReferredStudents = conversions.length;
  const approvedOrPaid = conversions.filter((c) => c.status === 'APPROVED' || c.status === 'PAID');
  const totalCommission = conversions.reduce((acc, curr) => acc + curr.commissionAmount, 0);
  const paidCommission = conversions
    .filter((c) => c.status === 'PAID')
    .reduce((acc, curr) => acc + curr.commissionAmount, 0);
  const pendingCommission = conversions
    .filter((c) => c.status === 'PENDING')
    .reduce((acc, curr) => acc + curr.commissionAmount, 0);

  const filteredConversions = conversions.filter((c) => {
    const matchesSearch =
      c.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.registrationNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.affiliateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.referralCode.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#2D7A70] uppercase tracking-wider mb-1">
            <Share2 className="w-3.5 h-3.5" />
            <span>Pusat Kemitraan &amp; Afiliasi Unit</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Kemitraan Afiliasi - {schoolName}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pantau arus pendaftar yang direferensikan oleh asatidz, alumni, dan relawan dakwah sekolah.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/affiliate/dashboard"
            target="_blank"
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            <span>Portal Afiliasi Publik</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Pendaftar Rujukan */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Pendaftar via Afiliasi</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-900 tabular-nums">
              {totalReferredStudents}
            </span>
            <span className="text-xs text-slate-400 font-semibold">Calon Santri</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            {approvedOrPaid.length} pendaftar telah terkonfirmasi
          </p>
        </div>

        {/* Card 2: Mitra Terdaftar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Mitra Afiliasi Aktif</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-900 tabular-nums">
              {totalAffiliatesCount}
            </span>
            <span className="text-xs text-slate-400 font-semibold">Mitra</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Dewan guru, wali murid &amp; relawan</p>
        </div>

        {/* Card 3: Komisi Terbayar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Komisi Telah Dicairkan</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-900 tabular-nums">
              {formatRupiah(paidCommission)}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Transfer berhasil ke rekening mitra</p>
        </div>

        {/* Card 4: Komisi Menunggu */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Menunggu Verifikasi</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-900 tabular-nums">
              {formatRupiah(pendingCommission)}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Menunggu pelunasan formulir PPDB</p>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* Filter Controls */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nama santri, no registrasi, atau nama mitra..."
              className="w-full pl-9 pr-4 py-2 text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#10B981] focus:bg-white"
            />
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto">
            {(['ALL', 'PENDING', 'APPROVED', 'PAID'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                  statusFilter === st
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
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
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Share2 className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">
              Belum Ada Pendaftar via Jalur Afiliasi
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Saat calon wali murid mendaftar menggunakan kode referral dari mitra resmi, data komisi dan santri akan otomatis muncul di sini.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Calon Santri</th>
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
                      <div>{conv.studentName}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {conv.registrationNo}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">
                      {conv.affiliateName}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {conv.referralCode}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
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
    </div>
  );
}
