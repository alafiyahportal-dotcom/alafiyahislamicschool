'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Wallet,
  CreditCard,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  ArrowDownRight,
  ArrowUpRight,
  Building2,
  DollarSign,
  Download,
  FileCheck,
  Send,
  Loader2,
  Share2,
  QrCode,
  Check,
  Phone,
  ReceiptText,
  Printer
} from 'lucide-react';
import { exportToExcel, ExcelColumn } from '@/lib/excelExport';
import OfficialReceiptModal from '@/components/portal/OfficialReceiptModal';

export interface InvoiceItem {
  id: string;
  orderId: string;
  schoolSlug: string;
  schoolName: string;
  studentName: string;
  registrationNo: string;
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
  paidAt: string | null;
  createdAt: string;
}

export interface PayoutItem {
  id: string;
  affiliateName: string;
  affiliatePhone: string;
  bankName: string;
  bankAccountNumber: string;
  bankAccountHolder: string;
  studentName: string;
  schoolName: string;
  commissionAmount: number;
  status: string;
  paidAt: string | null;
  createdAt: string;
}

interface FinanceConsoleClientProps {
  schoolSlug: string;
  schoolName: string;
  isFoundation: boolean;
  initialInvoices: InvoiceItem[];
  initialPayouts: PayoutItem[];
}

export default function FinanceConsoleClient({
  schoolSlug,
  schoolName,
  isFoundation,
  initialInvoices,
  initialPayouts
}: FinanceConsoleClientProps) {
  const [activeTab, setActiveTab] = useState<'invoices' | 'payouts'>('invoices');
  const [invoices, setInvoices] = useState<InvoiceItem[]>(initialInvoices);
  const [payouts, setPayouts] = useState<PayoutItem[]>(initialPayouts);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<InvoiceItem | null>(null);

  // Financial Calculations
  const totalPaidRevenue = invoices
    .filter((inv) => inv.paymentStatus === 'PAID')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const totalUnpaidRevenue = invoices
    .filter((inv) => inv.paymentStatus === 'UNPAID')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const totalPendingPayouts = payouts
    .filter((p) => p.status === 'PENDING')
    .reduce((sum, p) => sum + p.commissionAmount, 0);

  const netBalance = totalPaidRevenue - totalPendingPayouts;

  // Filter Invoices
  const filteredInvoices = invoices.filter((item) => {
    const matchesSearch =
      item.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.registrationNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || item.paymentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filter Payouts
  const filteredPayouts = payouts.filter((item) => {
    const matchesSearch =
      item.affiliateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.bankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.bankAccountNumber.includes(searchTerm);
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleConfirmInvoice = async (invoiceId: string) => {
    setIsProcessing(invoiceId);
    try {
      const res = await fetch(`/api/admin/finance/invoices/${invoiceId}/confirm-pay`, {
        method: 'POST'
      });
      const data = await res.json();
      if (res.ok) {
        setInvoices((prev) =>
          prev.map((inv) =>
            inv.id === invoiceId
              ? {
                  ...inv,
                  paymentStatus: 'PAID',
                  paymentMethod: 'TUNAI / KASIR YAYASAN',
                  paidAt: new Date().toISOString()
                }
              : inv
          )
        );
        setSuccessToast(data.message || 'Pembayaran berhasil dikonfirmasi LUNAS');
        setTimeout(() => setSuccessToast(null), 4000);
      }
    } catch (e) {
      console.error('Failed to confirm invoice', e);
    } finally {
      setIsProcessing(null);
    }
  };

  const handleConfirmPayout = async (payoutId: string) => {
    setIsProcessing(payoutId);
    try {
      const res = await fetch(`/api/admin/finance/payouts/${payoutId}/confirm-pay`, {
        method: 'POST'
      });
      const data = await res.json();
      if (res.ok) {
        setPayouts((prev) =>
          prev.map((p) =>
            p.id === payoutId
              ? {
                  ...p,
                  status: 'PAID',
                  paidAt: new Date().toISOString()
                }
              : p
          )
        );
        setSuccessToast(data.message || 'Pencairan komisi berhasil disetujui');
        setTimeout(() => setSuccessToast(null), 4000);
      }
    } catch (e) {
      console.error('Failed to confirm payout', e);
    } finally {
      setIsProcessing(null);
    }
  };

  const handleExportExcel = () => {
    const timestamp = new Date().toISOString().slice(0, 10);

    if (activeTab === 'invoices') {
      if (filteredInvoices.length === 0) {
        alert('Tidak ada data transaksi tagihan untuk diekspor.');
        return;
      }

      const columns: ExcelColumn[] = [
        { header: 'No', key: 'no', width: 6, align: 'center' },
        { header: 'No. Tagihan (Order ID)', key: 'orderId', width: 22, align: 'center' },
        { header: 'No. Registrasi', key: 'registrationNo', width: 18, align: 'center' },
        { header: 'Nama Murid', key: 'studentName', width: 28, align: 'left' },
        { header: 'Unit Sekolah', key: 'schoolName', width: 18, align: 'center' },
        { header: 'Nominal Tagihan', key: 'amountFormatted', width: 20, align: 'right' },
        { header: 'Metode Pembayaran', key: 'paymentMethod', width: 18, align: 'center' },
        { header: 'Status Pembayaran', key: 'paymentStatus', width: 20, align: 'center' },
        { header: 'Waktu Lunas', key: 'paidAt', width: 22, align: 'center' },
        { header: 'Tanggal Tagihan', key: 'createdAt', width: 22, align: 'center' },
      ];

      const exportRows = filteredInvoices.map((inv, idx) => ({
        no: idx + 1,
        orderId: inv.orderId,
        registrationNo: inv.registrationNo,
        studentName: inv.studentName,
        schoolName: inv.schoolName,
        amountFormatted: `Rp ${inv.amount.toLocaleString('id-ID')}`,
        paymentMethod: inv.paymentMethod,
        paymentStatus: inv.paymentStatus === 'PAID' ? 'Lunas (PAID)' : 'Menunggu Bayar (UNPAID)',
        paidAt: inv.paidAt
          ? new Date(inv.paidAt).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })
          : '-',
        createdAt: inv.createdAt,
      }));

      exportToExcel({
        fileName: `Rekonsiliasi_Tagihan_${schoolSlug || 'Yayasan'}_${timestamp}`,
        sheetName: 'Rekonsiliasi Tagihan',
        title: 'REKONSILIASI PENERIMAAN KAS & PEMBAYARAN FORMULIR PPDB',
        subtitle: `Unit: ${(schoolSlug || 'Semua Unit').toUpperCase()} • Yayasan Pendidikan Imam Bonjol`,
        columns,
        data: exportRows,
      });
    } else {
      if (filteredPayouts.length === 0) {
        alert('Tidak ada data pencairan komisi untuk diekspor.');
        return;
      }

      const columns: ExcelColumn[] = [
        { header: 'No', key: 'no', width: 6, align: 'center' },
        { header: 'Nama Mitra Afiliasi', key: 'affiliateName', width: 26, align: 'left' },
        { header: 'No. WhatsApp', key: 'affiliatePhone', width: 18, align: 'center' },
        { header: 'Bank Tujuan', key: 'bankName', width: 16, align: 'center' },
        { header: 'Nomor Rekening', key: 'bankAccountNumber', width: 20, align: 'center' },
        { header: 'Atas Nama Rekening', key: 'bankAccountHolder', width: 26, align: 'left' },
        { header: 'Murid Rujukan', key: 'studentName', width: 26, align: 'left' },
        { header: 'Unit Sekolah', key: 'schoolName', width: 18, align: 'center' },
        { header: 'Besaran Komisi', key: 'commissionFormatted', width: 20, align: 'right' },
        { header: 'Status Pencairan', key: 'status', width: 18, align: 'center' },
        { header: 'Waktu Transfer', key: 'paidAt', width: 22, align: 'center' },
        { header: 'Tanggal Pengajuan', key: 'createdAt', width: 22, align: 'center' },
      ];

      const exportRows = filteredPayouts.map((p, idx) => ({
        no: idx + 1,
        affiliateName: p.affiliateName,
        affiliatePhone: p.affiliatePhone,
        bankName: p.bankName,
        bankAccountNumber: p.bankAccountNumber,
        bankAccountHolder: p.bankAccountHolder,
        studentName: p.studentName,
        schoolName: p.schoolName,
        commissionFormatted: `Rp ${p.commissionAmount.toLocaleString('id-ID')}`,
        status: p.status === 'PAID' ? 'Sudah Ditransfer' : 'Perlu Ditransfer',
        paidAt: p.paidAt
          ? new Date(p.paidAt).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })
          : '-',
        createdAt: p.createdAt,
      }));

      exportToExcel({
        fileName: `Pencairan_Komisi_Mitra_${timestamp}`,
        sheetName: 'Komisi Mitra Afiliasi',
        title: 'DAFTAR PENCAIRAN KOMISI MITRA AFILIASI',
        subtitle: 'Yayasan Pendidikan Imam Bonjol Majalengka',
        columns,
        data: exportRows,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Success Notification Toast */}
      {successToast && (
        <div className="p-3 bg-[#E8F3F1] border border-[#2D7A70]/40 text-[#184F48] rounded-xl text-xs font-semibold flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-[#2D7A70]" />
            <span>{successToast}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessToast(null)}
            className="text-xs text-slate-400 hover:text-slate-700"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Kas Masuk */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Kas Masuk (Lunas)</span>
            <div className="w-8 h-8 rounded-lg bg-[#E8F3F1] text-[#2D7A70] flex items-center justify-center">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold tracking-tight text-slate-900 mt-2 tabular-nums">
            Rp {totalPaidRevenue.toLocaleString('id-ID')}
          </p>
          <p className="text-[11px] text-[#2D7A70] font-semibold mt-1">
            {invoices.filter((i) => i.paymentStatus === 'PAID').length} Transaksi Terverifikasi
          </p>
        </div>

        {/* Tagihan Menunggu Bayar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Menunggu Pembayaran</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold tracking-tight text-slate-900 mt-2 tabular-nums">
            Rp {totalUnpaidRevenue.toLocaleString('id-ID')}
          </p>
          <p className="text-[11px] text-amber-700 font-semibold mt-1">
            {invoices.filter((i) => i.paymentStatus === 'UNPAID').length} Tagihan Pending
          </p>
        </div>

        {/* Komisi Afiliasi Pending */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Pencairan Komisi Mitra</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold tracking-tight text-slate-900 mt-2 tabular-nums">
            Rp {totalPendingPayouts.toLocaleString('id-ID')}
          </p>
          <p className="text-[11px] text-purple-700 font-semibold mt-1">
            {payouts.filter((p) => p.status === 'PENDING').length} Permohonan Pencairan
          </p>
        </div>

        {/* Saldo Bersih */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Estimasi Saldo Kas Bersih</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold tracking-tight text-slate-900 mt-2 tabular-nums">
            Rp {netBalance.toLocaleString('id-ID')}
          </p>
          <p className="text-[11px] text-slate-500 font-medium mt-1">
            Penerimaan formulir setelah komisi
          </p>
        </div>
      </div>

      {/* Tab Navigation (Google Workspace Clean Style) */}
      <div className="flex items-center space-x-2 border-b border-slate-200 overflow-x-auto no-scrollbar flex-nowrap">
        <button
          type="button"
          onClick={() => {
            setActiveTab('invoices');
            setStatusFilter('ALL');
          }}
          className={`py-3 px-4 text-xs font-bold transition-colors border-b-2 flex items-center space-x-2 flex-shrink-0 whitespace-nowrap cursor-pointer ${
            activeTab === 'invoices'
              ? 'border-[#2D7A70] text-[#2D7A70]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Rekonsiliasi Tagihan & Pemasukan Formulir</span>
          <span className="ml-1.5 px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-600">
            {invoices.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('payouts');
            setStatusFilter('ALL');
          }}
          className={`py-3 px-4 text-xs font-bold transition-colors border-b-2 flex items-center space-x-2 flex-shrink-0 whitespace-nowrap cursor-pointer ${
            activeTab === 'payouts'
              ? 'border-[#2D7A70] text-[#2D7A70]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Share2 className="w-4 h-4" />
          <span>Pencairan Komisi Mitra Afiliasi</span>
          <span className="ml-1.5 px-2 py-0.5 rounded-full text-[10px] bg-purple-100 text-purple-700 font-bold">
            {payouts.filter((p) => p.status === 'PENDING').length} Baru
          </span>
        </button>
      </div>

      {/* Main Table Container */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        {/* Table Search & Filter Bar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex items-center space-x-2 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={
                  activeTab === 'invoices'
                    ? 'Cari no tagihan, nama murid, atau no reg...'
                    : 'Cari nama mitra, rekening bank, murid...'
                }
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#2D7A70] focus:ring-1 focus:ring-[#2D7A70]"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 flex-1 sm:flex-initial">
              <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-auto bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 focus:outline-hidden focus:border-[#2D7A70]"
              >
                <option value="ALL">Semua Status</option>
                {activeTab === 'invoices' ? (
                  <>
                    <option value="PAID">Lunas (Paid)</option>
                    <option value="UNPAID">Menunggu (Unpaid)</option>
                  </>
                ) : (
                  <>
                    <option value="PENDING">Perlu Ditransfer</option>
                    <option value="PAID">Sudah Dicairkan</option>
                  </>
                )}
              </select>
            </div>

            <button
              type="button"
              onClick={handleExportExcel}
              className="w-full sm:w-auto justify-center px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold inline-flex items-center space-x-1.5 transition-colors shadow-2xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Ekspor Pembukuan Excel (.xlsx)</span>
            </button>
          </div>
        </div>

        {/* TAB 1: INVOICES TABLE */}
        {activeTab === 'invoices' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-100/70 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">No. Tagihan (Order ID)</th>
                  <th className="py-3 px-4">Calon Murid & Unit</th>
                  <th className="py-3 px-4">Nominal Tagihan</th>
                  <th className="py-3 px-4">Metode Bayar</th>
                  <th className="py-3 px-4">Status Pembayaran</th>
                  <th className="py-3 px-4 text-right">Tindakan Kasir</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <CreditCard className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                      <p className="font-medium text-slate-600">Tidak ada data transaksi</p>
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 text-xs">
                        {inv.orderId}
                        <span className="block text-[11px] font-normal text-slate-400 font-sans mt-0.5">
                          {inv.createdAt}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 text-sm">{inv.studentName}</div>
                        <div className="flex items-center space-x-2 text-[11px] text-slate-500 mt-0.5">
                          <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">
                            {inv.registrationNo}
                          </span>
                          <span>•</span>
                          <span>{inv.schoolName}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900 text-sm tabular-nums">
                        Rp {inv.amount.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[11px]">
                          <QrCode className="w-3 h-3 text-slate-500" />
                          <span>{inv.paymentMethod}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {inv.paymentStatus === 'PAID' ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#E8F3F1] text-[#2D7A70] border border-[#2D7A70]/30">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#2D7A70]" />
                            <span>LUNAS TERVERIFIKASI</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            <span>MENUNGGU PEMBAYARAN</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {inv.paymentStatus === 'UNPAID' ? (
                          <button
                            type="button"
                            disabled={isProcessing === inv.id}
                            onClick={() => handleConfirmInvoice(inv.id)}
                            className="px-3 py-1.5 rounded-lg bg-[#2D7A70] hover:bg-[#184F48] text-white text-xs font-bold transition-colors shadow-2xs inline-flex items-center space-x-1.5"
                          >
                            {isProcessing === inv.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Check className="w-3.5 h-3.5" />
                            )}
                            <span>Konfirmasi Lunas Tunai</span>
                          </button>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                              Lunas {inv.paidAt ? new Date(inv.paidAt).toLocaleDateString('id-ID') : ''}
                            </span>
                            <button
                              type="button"
                              onClick={() => setSelectedReceipt(inv)}
                              className="px-2.5 py-1 rounded-lg bg-[#E8F3F1] hover:bg-[#d5ebe7] text-[#184F48] border border-[#2D7A70]/30 text-xs font-semibold transition-colors inline-flex items-center gap-1 cursor-pointer shadow-2xs"
                            >
                              <ReceiptText className="w-3 h-3 text-[#2D7A70]" />
                              <span>Cetak Kuitansi</span>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: PAYOUTS TABLE */}
        {activeTab === 'payouts' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-100/70 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Nama Mitra & Kontak</th>
                  <th className="py-3 px-4">Rekening Tujuan</th>
                  <th className="py-3 px-4">Murid Rujukan</th>
                  <th className="py-3 px-4">Besaran Komisi</th>
                  <th className="py-3 px-4">Status Pencairan</th>
                  <th className="py-3 px-4 text-right">Tindakan Keuangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPayouts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <Share2 className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                      <p className="font-medium text-slate-600">Tidak ada pengajuan pencairan komisi</p>
                    </td>
                  </tr>
                ) : (
                  filteredPayouts.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 text-sm">{p.affiliateName}</div>
                        <a
                          href={`https://wa.me/${p.affiliatePhone.startsWith('0') ? '62' + p.affiliatePhone.slice(1) : p.affiliatePhone}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center space-x-1 text-emerald-700 font-mono text-xs mt-0.5 hover:underline"
                        >
                          <Phone className="w-3 h-3 text-emerald-600" />
                          <span>{p.affiliatePhone}</span>
                        </a>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800">{p.bankName}</div>
                        <div className="font-mono text-slate-600 text-xs mt-0.5">
                          {p.bankAccountNumber} (a.n. {p.bankAccountHolder})
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{p.studentName}</div>
                        <div className="text-[11px] text-slate-500">{p.schoolName}</div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900 text-sm tabular-nums">
                        Rp {p.commissionAmount.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3.5 px-4">
                        {p.status === 'PAID' ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#E8F3F1] text-[#2D7A70] border border-[#2D7A70]/30">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#2D7A70]" />
                            <span>SUDAH DITRANSFER</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-300">
                            <Clock className="w-3.5 h-3.5 text-purple-600" />
                            <span>PERLU DITRANSFER</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {p.status === 'PENDING' ? (
                          <button
                            type="button"
                            disabled={isProcessing === p.id}
                            onClick={() => handleConfirmPayout(p.id)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-2xs inline-flex items-center space-x-1.5"
                          >
                            {isProcessing === p.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Send className="w-3.5 h-3.5" />
                            )}
                            <span>Setujui & Transfer</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-medium">
                            Ditransfer pada {p.paidAt ? new Date(p.paidAt).toLocaleDateString('id-ID') : '-'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Official Receipt Modal for Cashier Print */}
      {selectedReceipt && (
        <OfficialReceiptModal
          isOpen={!!selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
          studentName={selectedReceipt.studentName}
          regNo={selectedReceipt.registrationNo}
          schoolName={selectedReceipt.schoolName}
          orderId={selectedReceipt.orderId}
          amount={selectedReceipt.amount}
          paymentMethod={selectedReceipt.paymentMethod}
          paidAt={selectedReceipt.paidAt || undefined}
        />
      )}
    </div>
  );
}
