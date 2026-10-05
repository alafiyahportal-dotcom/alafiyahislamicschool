'use client';

import React, { useState } from 'react';
import {
  Sliders,
  Layers,
  CircleDollarSign,
  Building2,
  Phone,
  CheckCircle2,
  AlertCircle,
  Save,
  RotateCcw,
  ShieldCheck,
  School,
  Lock,
  Unlock,
  CreditCard,
  Copy,
  ChevronRight,
  TrendingUp,
  Percent,
  Check
} from 'lucide-react';

export interface SchoolSettingItem {
  id: string;
  slug: string;
  name: string;
  unitLevel: string;
  badgeText: string;
  tagline: string;
  primaryColor: string;
  accentColor: string;
  registrationFee: number;
  quota: number;
  waveName: string;
  isPpdbOpen: boolean;
  bankName: string;
  bankAccountNumber: string;
  bankAccountHolder: string;
  waCenterPhone: string;
  address: string;
  stats: {
    totalRegistrations: number;
    verifiedCount: number;
    acceptedCount: number;
    occupancyRate: number;
    remainingQuota: number;
  };
}

interface FoundationSettingsClientProps {
  initialSchools: SchoolSettingItem[];
}

export default function FoundationSettingsClient({
  initialSchools,
}: FoundationSettingsClientProps) {
  const [schools, setSchools] = useState<SchoolSettingItem[]>(initialSchools);
  const [activeTab, setActiveTab] = useState<'waves' | 'fees' | 'banking'>('waves');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copiedBank, setCopiedBank] = useState(false);

  // Common Bank State for Centralized Foundation Account (synchronized across units)
  const [sharedBankName, setSharedBankName] = useState(schools[0]?.bankName || 'Bank Syariah Indonesia (BSI)');
  const [sharedBankAcc, setSharedBankAcc] = useState(schools[0]?.bankAccountNumber || '7788991122');
  const [sharedBankHolder, setSharedBankHolder] = useState(
    schools[0]?.bankAccountHolder || 'Yayasan Pendidikan Imam Bonjol Majalengka'
  );

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleSchoolChange = (id: string, field: keyof SchoolSettingItem, value: unknown) => {
    setSchools((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const updated = { ...s, [field]: value };
          // If quota changed, recalculate stats
          if (field === 'quota') {
            const newQuota = Number(value) || 1;
            const occupancyRate = Math.min(
              100,
              Math.round((s.stats.totalRegistrations / newQuota) * 100)
            );
            const remainingQuota = Math.max(0, newQuota - s.stats.totalRegistrations);
            updated.stats = {
              ...s.stats,
              occupancyRate,
              remainingQuota,
            };
          }
          return updated;
        }
        return s;
      })
    );
  };

  const handleApplySharedBankToAll = () => {
    setSchools((prev) =>
      prev.map((s) => ({
        ...s,
        bankName: sharedBankName,
        bankAccountNumber: sharedBankAcc,
        bankAccountHolder: sharedBankHolder,
      }))
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);
    try {
      // Sync shared bank to all units before saving
      const payloadSchools = schools.map((s) => ({
        id: s.id,
        quota: Number(s.quota),
        waveName: s.waveName,
        isPpdbOpen: Boolean(s.isPpdbOpen),
        registrationFee: Number(s.registrationFee),
        bankName: s.bankName,
        bankAccountNumber: s.bankAccountNumber,
        bankAccountHolder: s.bankAccountHolder,
        waCenterPhone: s.waCenterPhone,
        address: s.address,
        tagline: s.tagline,
      }));

      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schools: payloadSchools }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Gagal menyimpan pengaturan');
      }

      setSaveMessage({
        type: 'success',
        text: 'Semua pengaturan operasional yayasan berhasil disimpan & langsung aktif!',
      });
      setTimeout(() => setSaveMessage(null), 5000);
    } catch (err: unknown) {
      const error = err as Error;
      setSaveMessage({
        type: 'error',
        text: error.message || 'Terjadi kesalahan saat menyimpan pengaturan.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleAllPpdb = (isOpen: boolean) => {
    setSchools((prev) =>
      prev.map((s) => ({
        ...s,
        isPpdbOpen: isOpen,
      }))
    );
  };

  const handleCopyBankAccount = () => {
    navigator.clipboard.writeText(`${sharedBankName} ${sharedBankAcc} a.n ${sharedBankHolder}`);
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2500);
  };

  // Aggregate stats across all units
  const totalQuotaAll = schools.reduce((acc, curr) => acc + (curr.quota || 0), 0);
  const totalRegistrationsAll = schools.reduce(
    (acc, curr) => acc + (curr.stats.totalRegistrations || 0),
    0
  );
  const totalOccupancyRate =
    totalQuotaAll > 0 ? Math.round((totalRegistrationsAll / totalQuotaAll) * 100) : 0;
  const openUnitsCount = schools.filter((s) => s.isPpdbOpen).length;

  return (
    <div className="space-y-6">
      {/* Top Header & Overview Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#2D7A70] uppercase tracking-wider mb-1">
            <Sliders className="w-3.5 h-3.5" />
            <span>Pusat Kendali Pengaturan Operasional</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Pengaturan Sentral Yayasan
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Kelola target kuota penerimaan murid, nama & status gelombang PPDB, tarif formulir terintegrasi Midtrans, dan rekening kas terpusat Yayasan Pendidikan Imam Bonjol Majalengka.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSchools(initialSchools)}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset</span>
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#2D7A70] hover:bg-[#23635b] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Semua Pengaturan</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Save Alert Message */}
      {saveMessage && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-3 text-xs font-medium animate-in fade-in duration-200 ${
            saveMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          {saveMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{saveMessage.text}</span>
        </div>
      )}

      {/* Aggregated KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Kuota Murid</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <School className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{totalQuotaAll}</span>
            <span className="text-xs text-slate-500">Kursi Yayasan</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Gabungan TK, SD, dan SMP</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Pendaftar Masuk</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{totalRegistrationsAll}</span>
            <span className="text-xs text-slate-500">Calon Murid</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Sisa Kuota: {Math.max(0, totalQuotaAll - totalRegistrationsAll)} Kursi</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Keterisian Kuota</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{totalOccupancyRate}%</span>
            <span className="text-xs text-emerald-600 font-medium">Kapasitas</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-[#2D7A70] h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, totalOccupancyRate)}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Status PPDB Terbuka</span>
            <div className="w-8 h-8 rounded-lg bg-[#E8F3F1] text-[#2D7A70] flex items-center justify-center">
              <Unlock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">
              {openUnitsCount} / {schools.length}
            </span>
            <span className="text-xs text-emerald-600 font-medium">Unit Dibuka</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Pendaftaran online aktif</p>
        </div>
      </div>

      {/* Clean Tab Pill Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2 bg-slate-100/80 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('waves')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'waves'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-[#2D7A70]" />
            <span>1. Kuota & Gelombang PPDB</span>
          </button>
          <button
            onClick={() => setActiveTab('fees')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'fees'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CircleDollarSign className="w-3.5 h-3.5 text-amber-600" />
            <span>2. Tarif Biaya Formulir</span>
          </button>
          <button
            onClick={() => setActiveTab('banking')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'banking'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5 text-blue-600" />
            <span>3. Rekening Kas & Helpdesk</span>
          </button>
        </div>

        {activeTab === 'waves' && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Aksi Cepat PPDB:</span>
            <button
              onClick={() => handleToggleAllPpdb(true)}
              className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg font-semibold transition-colors cursor-pointer"
            >
              Buka Semua Unit
            </button>
            <button
              onClick={() => handleToggleAllPpdb(false)}
              className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg font-semibold transition-colors cursor-pointer"
            >
              Tutup Semua Unit
            </button>
          </div>
        )}
      </div>

      {/* Tab 1: Kuota & Gelombang PPDB */}
      {activeTab === 'waves' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {schools.map((school) => {
              const occupancy = school.stats.occupancyRate;
              const remaining = school.stats.remainingQuota;

              return (
                <div
                  key={school.id}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs flex flex-col justify-between"
                >
                  {/* Card Header with School Color Accent */}
                  <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white"
                        style={{ backgroundColor: school.primaryColor }}
                      >
                        Unit {school.unitLevel}
                      </span>
                      <div className="flex items-center">
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                            school.isPpdbOpen ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {school.isPpdbOpen ? 'PPDB Dibuka' : 'Ditutup Sementara'}
                        </span>
                      </div>
                    </div>
                    <h2 className="text-base font-bold text-slate-900">{school.name}</h2>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{school.tagline}</p>
                  </div>

                  {/* Card Content & Controls */}
                  <div className="p-5 space-y-4 flex-1">
                    {/* Toggle Sakelar Buka / Tutup */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                      <div className="flex items-center gap-2.5">
                        {school.isPpdbOpen ? (
                          <Unlock className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Lock className="w-4 h-4 text-slate-400" />
                        )}
                        <div>
                          <p className="text-xs font-bold text-slate-800">
                            Terima Murid Baru
                          </p>
                          <p className="text-[10px] text-slate-500">
                            {school.isPpdbOpen
                              ? 'Formulir online dapat diakses wali murid'
                              : 'Pendaftaran ditutup untuk umum'}
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={school.isPpdbOpen}
                          onChange={(e) =>
                            handleSchoolChange(school.id, 'isPpdbOpen', e.target.checked)
                          }
                          aria-label={`Status PPDB ${school.name}`}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2D7A70]"></div>
                      </label>
                    </div>

                    {/* Input Nama Gelombang */}
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Nama Gelombang Pendaftaran
                      </label>
                      <input
                        type="text"
                        value={school.waveName}
                        onChange={(e) =>
                          handleSchoolChange(school.id, 'waveName', e.target.value)
                        }
                        placeholder="Contoh: Gelombang 1 (2027/2028)"
                        className="w-full text-xs font-medium text-slate-900 bg-white border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#2D7A70]"
                      />
                    </div>

                    {/* Input Target Kuota */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-slate-700">
                          Target Kuota Kursi
                        </label>
                        <span className="text-[11px] font-bold text-slate-600">
                          {school.quota} Kursi
                        </span>
                      </div>
                      <input
                        type="number"
                        min="1"
                        max="500"
                        value={school.quota}
                        onChange={(e) =>
                          handleSchoolChange(school.id, 'quota', parseInt(e.target.value) || 0)
                        }
                        className="w-full text-xs font-medium text-slate-900 bg-white border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#2D7A70]"
                      />
                    </div>

                    {/* Progress Bar Keterisian */}
                    <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/60 space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-600 font-medium">
                          Pendaftar: <strong className="text-slate-900">{school.stats.totalRegistrations}</strong>
                        </span>
                        <span className="text-slate-600 font-medium">
                          Sisa: <strong className="text-emerald-700">{remaining} Kursi</strong>
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${occupancy}%`,
                            backgroundColor: school.primaryColor,
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>Tingkat Keterisian:</span>
                        <span className="font-bold text-slate-700">{occupancy}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Info */}
                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Terverifikasi: {school.stats.verifiedCount} murid</span>
                    <span>Lulus: {school.stats.acceptedCount} murid</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Biaya Pendaftaran & Formulir PPDB */}
      {activeTab === 'fees' && (
        <div className="space-y-6">
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 flex items-start gap-3 text-xs text-amber-900">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Koneksi Otomatis Gateway Pembayaran Midtrans Snap</p>
              <p className="mt-0.5 text-amber-800/90 leading-relaxed">
                Nominal tarif formulir yang diatur di bawah ini secara otomatis menjadi nilai tagihan invoice digital saat calon wali murid mengisi formulir di <code>/ppdb/daftar</code>, baik melalui simulator Midtrans QRIS maupun Virtual Account.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {schools.map((school) => {
              return (
                <div
                  key={school.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white"
                      style={{ backgroundColor: school.primaryColor }}
                    >
                      {school.unitLevel} Al-Afiyah
                    </span>
                    <CircleDollarSign className="w-4 h-4 text-amber-600" />
                  </div>

                  <div>
                    <h2 className="text-sm font-bold text-slate-900">{school.name}</h2>
                    <p className="text-[11px] text-slate-500">Biaya Formulir & Seleksi Berkas</p>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Nominal Tarif Formulir (IDR)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">
                        Rp
                      </span>
                      <input
                        type="number"
                        step="10000"
                        min="0"
                        value={school.registrationFee}
                        onChange={(e) =>
                          handleSchoolChange(
                            school.id,
                            'registrationFee',
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#2D7A70]"
                      />
                    </div>
                  </div>

                  {/* Format Display Badge */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                      Tampilan pada Formulir PPDB:
                    </span>
                    <span className="text-base font-bold text-slate-900 tracking-tight tabular-nums">
                      {formatRupiah(school.registrationFee)}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500 space-y-1">
                    <p>• Termasuk biaya verifikasi berkas digital</p>
                    <p>• Termasuk ujian observasi & wawancara</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Rekening Kas Yayasan & Helpdesk */}
      {activeTab === 'banking' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form Pengaturan Rekening Pusat */}
          <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#2D7A70] uppercase tracking-wider mb-1">
                <Building2 className="w-3.5 h-3.5" />
                <span>Pusat Rekening Kas Yayasan</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                Rekening Penerimaan Kas & Kuitansi Terpusat
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Rekening ini tercantum pada instruksi transfer manual tata usaha dan kuitansi pelunasan resmi murid baru di seluruh jenjang.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Nama Bank Resmi
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                  {[
                    'Bank Syariah Indonesia (BSI)',
                    'Bank Mandiri',
                    'Bank BRI',
                    'Bank BCA',
                  ].map((bank) => (
                    <button
                      key={bank}
                      type="button"
                      onClick={() => {
                        setSharedBankName(bank);
                        setSchools((prev) => prev.map((s) => ({ ...s, bankName: bank })));
                      }}
                      className={`px-2.5 py-2 text-[11px] font-semibold rounded-lg border transition-all cursor-pointer truncate ${
                        sharedBankName === bank
                          ? 'border-[#2D7A70] bg-[#E8F3F1] text-[#184F48] font-bold'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {bank}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={sharedBankName}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSharedBankName(val);
                    setSchools((prev) => prev.map((s) => ({ ...s, bankName: val })));
                  }}
                  className="w-full text-xs font-medium text-slate-900 bg-white border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#2D7A70]"
                  placeholder="Atau ketik nama bank lainnya..."
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Nomor Rekening Bank
                </label>
                <input
                  type="text"
                  value={sharedBankAcc}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSharedBankAcc(val);
                    setSchools((prev) => prev.map((s) => ({ ...s, bankAccountNumber: val })));
                  }}
                  className="w-full text-xs font-bold text-slate-900 font-mono tracking-wider bg-white border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#2D7A70]"
                  placeholder="Contoh: 7788991122"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Nama Pemilik Rekening (Atas Nama)
                </label>
                <input
                  type="text"
                  value={sharedBankHolder}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSharedBankHolder(val);
                    setSchools((prev) => prev.map((s) => ({ ...s, bankAccountHolder: val })));
                  }}
                  className="w-full text-xs font-medium text-slate-900 bg-white border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#2D7A70]"
                  placeholder="Contoh: Yayasan Pendidikan Imam Bonjol Majalengka"
                />
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleApplySharedBankToAll}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Terapkan Rekening Ini Serentak ke Seluruh Unit</span>
                </button>
              </div>
            </div>

            {/* Kontak Helpdesk WhatsApp Per Unit */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Nomor WhatsApp Helpdesk Resmi (WA Center)
              </h3>
              <div className="space-y-3">
                {schools.map((school) => (
                  <div key={school.id} className="flex items-center gap-3">
                    <span
                      className="w-12 text-center py-1 rounded text-[10px] font-bold uppercase text-white shrink-0"
                      style={{ backgroundColor: school.primaryColor }}
                    >
                      {school.unitLevel}
                    </span>
                    <div className="relative flex-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={school.waCenterPhone}
                        onChange={(e) =>
                          handleSchoolChange(school.id, 'waCenterPhone', e.target.value)
                        }
                        className="w-full text-xs font-medium text-slate-900 bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#2D7A70]"
                        placeholder="Contoh: 6281223344551"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Virtual Card Preview */}
          <div className="lg:col-span-5 space-y-4">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Pratinjau Kartu Rekening Resmi
            </div>

            {/* Super Premium Debit Card Display */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#184F48] via-[#2D7A70] to-[#123E38] p-6 text-white shadow-xl">
              {/* Decorative Glow Circles */}
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#E8F3F1]/10 rounded-full blur-xl pointer-events-none" />

              <div className="relative z-10 flex flex-col justify-between h-48">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-200/90 block">
                      Kas Operasional Yayasan
                    </span>
                    <h4 className="text-sm font-bold tracking-tight text-white mt-0.5">
                      {sharedBankName}
                    </h4>
                  </div>
                  <div className="w-10 h-7 rounded bg-amber-400/80 border border-amber-300/40 flex items-center justify-center shadow-inner">
                    <div className="w-6 h-4 border border-amber-600/40 rounded-sm grid grid-cols-2 gap-0.5 p-0.5">
                      <div className="bg-amber-500/50 rounded-xs" />
                      <div className="bg-amber-500/50 rounded-xs" />
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-emerald-200/75 uppercase tracking-wider">
                    Nomor Rekening Kas
                  </span>
                  <div className="text-xl font-bold font-mono tracking-wider text-white">
                    {sharedBankAcc}
                  </div>
                </div>

                <div className="flex items-end justify-between border-t border-white/10 pt-3">
                  <div>
                    <span className="text-[9px] text-emerald-200/70 uppercase block">
                      Atas Nama Rekening
                    </span>
                    <span className="text-xs font-bold text-white tracking-wide">
                      {sharedBankHolder}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-300 bg-white/10 px-2 py-0.5 rounded backdrop-blur-xs">
                    RESMI YAYASAN
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Copy Action */}
            <button
              type="button"
              onClick={handleCopyBankAccount}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs transition-all cursor-pointer"
            >
              {copiedBank ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Informasi Rekening Berhasil Disalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-500" />
                  <span>Salin Teks Lengkap Rekening Bank</span>
                </>
              )}
            </button>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-500 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-slate-700">
                <ChevronRight className="w-3.5 h-3.5 text-[#2D7A70]" />
                <span>Petunjuk Tata Usaha & Kuitansi</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Nomor rekening ini akan secara otomatis ditampilkan kepada wali murid yang memilih metode pembayaran <strong>Tunai / Transfer Manual Bank</strong> saat datang ke kantor tata usaha sekolah.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
