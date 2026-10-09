'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Shirt,
  PackageCheck,
  Package,
  CheckCircle2,
  Clock,
  Download,
  Search,
  X,
  Layers,
  GraduationCap,
  School,
  BookOpen,
  Users,
  Ruler,
  Scale,
  RefreshCw,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { exportToExcel, ExcelColumn } from '@/lib/excelExport';

interface RegistrationItem {
  id: string;
  registrationNo: string;
  studentName: string;
  gender: string;
  school: {
    id: string;
    slug: string;
    name: string;
    badgeText: string;
  };
  reRegistration: {
    id: string;
    uniformSize: string;
    uniformType: string | null;
    heightCm: number | null;
    weightKg: number | null;
    shoeSize: number | null;
    boardingPreference: string | null;
    roommatePreference: string | null;
    paymentPlan: string;
    notes: string | null;
    isUniformTaken: boolean;
    uniformTakenAt: string | null;
    status: string;
    createdAt: string;
  } | null;
}

interface StatsData {
  totalAccepted: number;
  totalConfirmed: number;
  totalPending: number;
  totalUniformTaken: number;
  totalUniformPending: number;
}

interface ReRegistrationManagerClientProps {
  initialUnit?: string; // 'all', 'tk', 'sd', 'smp'
  title?: string;
}

export default function ReRegistrationManagerClient({
  initialUnit = 'all',
  title = 'Manajemen Daftar Ulang & Logistik Seragam Murid',
}: ReRegistrationManagerClientProps) {
  const isAllUnits = initialUnit === 'all';
  const [selectedUnit, setSelectedUnit] = useState<string>(initialUnit);
  const [selectedUniformStatus, setSelectedUniformStatus] = useState<string>('all'); // 'all', 'TAKEN', 'PENDING'
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [data, setData] = useState<RegistrationItem[]>([]);
  const [stats, setStats] = useState<StatsData>({
    totalAccepted: 0,
    totalConfirmed: 0,
    totalPending: 0,
    totalUniformTaken: 0,
    totalUniformPending: 0,
  });
  const [sizeAggregation, setSizeAggregation] = useState<Record<string, number>>({
    S: 0,
    M: 0,
    L: 0,
    XL: 0,
    XXL: 0,
    CUSTOM: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdatingId, setIsUpdatingId] = useState<string | null>(null);

  // When not in 'all' mode, unit is strictly locked to initialUnit
  const effectiveUnit = isAllUnits ? selectedUnit : initialUnit;

  // Fetch data from API
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (effectiveUnit !== 'all') params.append('schoolSlug', effectiveUnit);
      if (selectedUniformStatus !== 'all') params.append('uniformStatus', selectedUniformStatus);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());

      const res = await fetch(`/api/admin/re-registration?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setData(json.data);
        setStats(json.stats);
        setSizeAggregation(json.sizeAggregation);
      }
    } catch (err) {
      console.error('Failed to fetch re-registration data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [effectiveUnit, selectedUniformStatus]);

  // Handle Search Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Toggle uniform handover status
  const handleToggleHandover = async (reRegistrationId: string, currentStatus: boolean) => {
    setIsUpdatingId(reRegistrationId);
    try {
      const res = await fetch('/api/admin/re-registration', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reRegistrationId,
          isUniformTaken: !currentStatus,
        }),
      });
      const json = await res.json();
      if (json.success) {
        // Refresh local data
        setData((prev) =>
          prev.map((item) => {
            if (item.reRegistration && item.reRegistration.id === reRegistrationId) {
              return {
                ...item,
                reRegistration: {
                  ...item.reRegistration,
                  isUniformTaken: !currentStatus,
                  uniformTakenAt: !currentStatus ? new Date().toISOString() : null,
                },
              };
            }
            return item;
          })
        );
        // Refresh stats
        setStats((prev) => ({
          ...prev,
          totalUniformTaken: !currentStatus ? prev.totalUniformTaken + 1 : prev.totalUniformTaken - 1,
          totalUniformPending: !currentStatus ? prev.totalUniformPending - 1 : prev.totalUniformPending + 1,
        }));
      } else {
        alert(json.error || 'Gagal memperbarui status seragam');
      }
    } catch (err) {
      console.error('Error toggling handover:', err);
      alert('Terjadi kesalahan jaringan.');
    } finally {
      setIsUpdatingId(null);
    }
  };

  // Export to Excel for local tailors / garment vendor
  const handleExportExcel = () => {
    const confirmedItems = data.filter((d) => d.reRegistration !== null);
    if (confirmedItems.length === 0) {
      alert('Belum ada data murid yang menyelesaikan daftar ulang untuk diekspor.');
      return;
    }

    const columns: ExcelColumn[] = [
      { header: 'No', key: 'no', width: 6, align: 'center' },
      { header: 'No. Registrasi', key: 'registrationNo', width: 18, align: 'center' },
      { header: 'Nama Murid', key: 'studentName', width: 28, align: 'left' },
      { header: 'Unit Sekolah', key: 'schoolName', width: 18, align: 'center' },
      { header: 'Jenis Kelamin', key: 'gender', width: 14, align: 'center' },
      { header: 'Ukuran Seragam', key: 'uniformSize', width: 16, align: 'center' },
      { header: 'Model Busana', key: 'uniformType', width: 24, align: 'left' },
      { header: 'Tinggi Badan (cm)', key: 'heightCm', width: 18, align: 'center' },
      { header: 'Berat Badan (kg)', key: 'weightKg', width: 18, align: 'center' },
      { header: 'Ukuran Sepatu', key: 'shoeSize', width: 16, align: 'center' },
      { header: 'Pilihan Program', key: 'boardingPreference', width: 20, align: 'left' },
      { header: 'Skema Pembayaran', key: 'paymentPlan', width: 20, align: 'center' },
      { header: 'Catatan Penjahit', key: 'notes', width: 32, align: 'left' },
      { header: 'Status Penyerahan', key: 'statusTaken', width: 20, align: 'center' },
      { header: 'Tanggal Daftar Ulang', key: 'reRegDate', width: 22, align: 'center' },
    ];

    const exportRows = confirmedItems.map((item, idx) => {
      const r = item.reRegistration!;
      return {
        no: idx + 1,
        registrationNo: item.registrationNo,
        studentName: item.studentName,
        schoolName: item.school.name,
        gender: item.gender === 'L' ? 'Ikhwan (L)' : 'Akhwat (P)',
        uniformSize: r.uniformSize,
        uniformType: r.uniformType || '-',
        heightCm: r.heightCm ? `${r.heightCm} cm` : '-',
        weightKg: r.weightKg ? `${r.weightKg} kg` : '-',
        shoeSize: r.shoeSize || '-',
        boardingPreference: r.boardingPreference || '-',
        paymentPlan: r.paymentPlan === 'FULL' ? 'Lunas Penuh (Full)' : r.paymentPlan || '-',
        notes: r.notes || '-',
        statusTaken: r.isUniformTaken ? 'Sudah Diserahkan' : 'Belum Diambil',
        reRegDate: new Date(r.createdAt).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
      };
    });

    exportToExcel({
      fileName: `rekap-seragam-konveksi-${effectiveUnit}-${new Date().toISOString().split('T')[0]}`,
      sheetName: 'Rekap Seragam Konveksi',
      title: 'REKAPITULASI LOGISTIK SERAGAM & DAFTAR ULANG MURID BARU',
      subtitle: `Unit Sekolah: ${effectiveUnit.toUpperCase()} • Sekolah Islam Terpadu Al-Afiyah Majalengka`,
      columns,
      data: exportRows,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#2D7A70] uppercase tracking-wider mb-1">
            <PackageCheck className="w-4 h-4" />
            <span>Manajemen Logistik &amp; Pendaftaran Ulang</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Rekap Daftar Ulang &amp; Seragam Murid
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola rincian ukuran seragam konveksi murid baru, skema pembayaran, dan serah terima seragam.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={fetchData}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
            title="Muat ulang data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#2D7A70]' : ''}`} />
          </button>

          <button
            type="button"
            onClick={handleExportExcel}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#184F48] to-[#2D7A70] hover:from-[#133f3a] hover:to-[#24635a] text-white text-xs font-semibold shadow-sm inline-flex items-center space-x-2 transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-amber-300" />
            <span>Ekspor Excel (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* KPI Stats & Garment Size Breakdown Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Status Stats */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-3">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Status Konfirmasi Daftar Ulang
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-3 bg-slate-50 rounded-xl">
              <div className="text-[10px] font-medium text-slate-500">Murid Lolos</div>
              <div className="text-lg font-bold text-slate-900 mt-0.5 tabular-nums">{stats.totalAccepted}</div>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
              <div className="text-[10px] font-medium text-emerald-800">Daftar Ulang</div>
              <div className="text-lg font-bold text-emerald-900 mt-0.5 tabular-nums">{stats.totalConfirmed}</div>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
              <div className="text-[10px] font-medium text-amber-800">Belum DU</div>
              <div className="text-lg font-bold text-amber-900 mt-0.5 tabular-nums">{stats.totalPending}</div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Seragam Sudah Diserahkan:</span>
            <span className="font-semibold text-emerald-700 tabular-nums">
              {stats.totalUniformTaken} dari {stats.totalConfirmed} murid
            </span>
          </div>
        </div>

        {/* Size Aggregation Matrix (2 Columns) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
              <Ruler className="w-3.5 h-3.5 text-[#2D7A70]" />
              <span>Rekap Kebutuhan Ukuran Seragam Vendor Konveksi</span>
            </div>
            <span className="text-[11px] font-semibold text-[#2D7A70] bg-[#E8F3F1] px-2 py-0.5 rounded-full tabular-nums">
              Total: {stats.totalConfirmed} Stel Pesanan
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
            {[
              { size: 'S', label: 'Size S', color: 'bg-slate-50 text-slate-800 border-slate-200' },
              { size: 'M', label: 'Size M', color: 'bg-blue-50 text-blue-900 border-blue-200' },
              { size: 'L', label: 'Size L', color: 'bg-emerald-50 text-emerald-900 border-emerald-200' },
              { size: 'XL', label: 'Size XL', color: 'bg-purple-50 text-purple-900 border-purple-200' },
              { size: 'XXL', label: 'Size XXL', color: 'bg-amber-50 text-amber-900 border-amber-200' },
              { size: 'CUSTOM', label: 'Khusus', color: 'bg-rose-50 text-rose-900 border-rose-200' },
            ].map((s) => (
              <div
                key={s.size}
                className={`p-3 rounded-xl border text-center ${s.color} transition-transform hover:scale-102`}
              >
                <div className="text-[11px] font-semibold uppercase tracking-wider opacity-75">{s.label}</div>
                <div className="text-xl font-bold mt-0.5 tabular-nums">{sizeAggregation[s.size] || 0}</div>
                <div className="text-[10px] opacity-60">Paket</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Unit Tabs / Locked Unit Badge */}
        {!isAllUnits ? (
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-emerald-50 text-[#184F48] border border-emerald-200/80 text-xs font-semibold shadow-2xs">
              <School className="w-4 h-4 text-[#2D7A70]" />
              <span>Unit: {initialUnit === 'tk' ? 'PAUD / TK IT Al-Afiyah' : initialUnit === 'sd' ? 'SDIT Al-Afiyah' : initialUnit === 'smp' ? 'SMP IT Al-Afiyah' : `${initialUnit.toUpperCase()} IT Al-Afiyah`}</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: 'Semua Unit', icon: Layers },
              { id: 'tk', label: 'TK IT', icon: GraduationCap },
              { id: 'sd', label: 'SDIT', icon: School },
              { id: 'smp', label: 'SMP IT', icon: BookOpen },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = selectedUnit === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedUnit(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold inline-flex items-center space-x-1.5 transition-all cursor-pointer ${
                    active
                      ? 'bg-[#184F48] text-white shadow-2xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-[#E8F3F1] hover:text-[#184F48]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Handover Status Pills & Search */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            {[
              { id: 'all', label: 'Semua' },
              { id: 'PENDING', label: 'Belum Diambil' },
              { id: 'TAKEN', label: 'Sudah Diserahkan' },
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setSelectedUniformStatus(st.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  selectedUniformStatus === st.id
                    ? 'bg-white text-[#184F48] font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          <div className="relative flex-1 sm:w-56">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama murid..."
              className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2D7A70]/30"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px] tracking-wider">
                <th className="p-3.5">Murid &amp; No. Reg</th>
                {isAllUnits && <th className="p-3.5">Unit</th>}
                <th className="p-3.5 text-center">Ukuran Seragam</th>
                <th className="p-3.5">Postur Fisik</th>
                <th className="p-3.5">Skema &amp; Program</th>
                <th className="p-3.5">Catatan Penjahit</th>
                <th className="p-3.5 text-center">Status Seragam</th>
                <th className="p-3.5 text-right">Aksi Penyerahan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={isAllUnits ? 8 : 7} className="p-8 text-center text-slate-400">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <span>Tidak ada data murid daftar ulang yang cocok dengan filter.</span>
                  </td>
                </tr>
              ) : (
                data.map((reg) => {
                  const reReg = reg.reRegistration;
                  const isTaken = reReg?.isUniformTaken;
                  const isUpdating = isUpdatingId === reReg?.id;

                  return (
                    <tr key={reg.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Murid Name & Reg */}
                      <td className="p-3.5">
                        <div className="font-semibold text-slate-900 text-sm">{reg.studentName}</div>
                        <div className="text-[11px] text-slate-400 font-mono flex items-center space-x-1.5 mt-0.5">
                          <span>{reg.registrationNo}</span>
                          <span>•</span>
                          <span>{reg.gender === 'L' ? 'Ikhwan' : 'Akhwat'}</span>
                        </div>
                      </td>

                      {/* Unit (Only shown in all-units / foundation mode) */}
                      {isAllUnits && (
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#E8F3F1] text-[#184F48]">
                            {reg.school.badgeText}
                          </span>
                        </td>
                      )}

                      {/* Uniform Size */}
                      <td className="p-3.5 text-center">
                        {reReg ? (
                          <div className="inline-block">
                            <span className="w-9 h-9 rounded-xl bg-[#184F48] text-white font-bold text-sm flex items-center justify-center mx-auto shadow-2xs">
                              {reReg.uniformSize}
                            </span>
                            <span className="text-[9px] text-slate-400 block mt-0.5 truncate max-w-[90px]">
                              {reReg.uniformType?.split('&')[0] || 'Standar'}
                            </span>
                          </div>
                        ) : (
                          <span className="px-2 py-1 rounded-md text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                            Belum DU
                          </span>
                        )}
                      </td>

                      {/* Posture */}
                      <td className="p-3.5">
                        {reReg ? (
                          <div className="space-y-0.5 text-[11px]">
                            <div>TB: <strong>{reReg.heightCm || '-'} cm</strong></div>
                            <div>BB: <strong>{reReg.weightKg || '-'} kg</strong></div>
                            <div>Sepatu: <strong>No. {reReg.shoeSize || '-'}</strong></div>
                          </div>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      {/* Payment & Boarding */}
                      <td className="p-3.5">
                        {reReg ? (
                          <div className="space-y-0.5 text-[11px]">
                            <span className="inline-block px-1.5 py-0.5 rounded bg-slate-100 font-semibold text-slate-700">
                              {reReg.paymentPlan}
                            </span>
                            {reReg.boardingPreference && (
                              <div className="text-[10px] text-slate-500 truncate max-w-[120px]">
                                🏠 {reReg.boardingPreference}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      {/* Notes */}
                      <td className="p-3.5">
                        {reReg?.notes ? (
                          <span className="text-[11px] text-slate-600 italic line-clamp-2 max-w-[150px]">
                            &ldquo;{reReg.notes}&rdquo;
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      {/* Status Seragam */}
                      <td className="p-3.5 text-center">
                        {reReg ? (
                          isTaken ? (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Sudah Diambil</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                              <Clock className="w-3 h-3 text-slate-500" />
                              <span>Belum Diambil</span>
                            </span>
                          )
                        ) : (
                          <span className="text-slate-400 text-[11px]">-</span>
                        )}
                      </td>

                      {/* Action Handover Toggle */}
                      <td className="p-3.5 text-right">
                        {reReg ? (
                          <button
                            type="button"
                            onClick={() => handleToggleHandover(reReg.id, Boolean(isTaken))}
                            disabled={isUpdating}
                            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold inline-flex items-center space-x-1 transition-colors cursor-pointer ${
                              isTaken
                                ? 'bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-rose-700'
                                : 'bg-[#184F48] hover:bg-[#133f3a] text-white shadow-2xs'
                            }`}
                          >
                            <PackageCheck className="w-3.5 h-3.5" />
                            <span>{isTaken ? 'Batal Ambil' : 'Serahkan'}</span>
                          </button>
                        ) : (
                          <span className="text-[10px] text-amber-600 font-semibold">Menunggu Wali</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
