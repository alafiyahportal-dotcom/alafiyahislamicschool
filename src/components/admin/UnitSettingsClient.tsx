'use client';

import React, { useState } from 'react';
import {
  Sliders,
  CheckCircle2,
  AlertCircle,
  Save,
  Building2,
  CreditCard,
  Phone,
  MapPin,
  Users,
  Unlock,
  Lock,
  RotateCcw,
  School,
  Wallet
} from 'lucide-react';

export interface UnitSettingItem {
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

interface UnitSettingsClientProps {
  initialSchool: UnitSettingItem;
}

export default function UnitSettingsClient({ initialSchool }: UnitSettingsClientProps) {
  const [school, setSchool] = useState<UnitSettingItem>(initialSchool);
  const [activeTab, setActiveTab] = useState<'wave' | 'finance' | 'profile'>('wave');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleChange = (field: keyof UnitSettingItem, value: unknown) => {
    setSchool((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'quota') {
        const newQuota = Number(value) || 1;
        const occupancyRate = Math.min(
          100,
          Math.round((prev.stats.totalRegistrations / newQuota) * 100)
        );
        const remainingQuota = Math.max(0, newQuota - prev.stats.totalRegistrations);
        updated.stats = {
          ...prev.stats,
          occupancyRate,
          remainingQuota,
        };
      }
      return updated;
    });
  };

  const handleTogglePpdb = async () => {
    const nextState = !school.isPpdbOpen;
    handleChange('isPpdbOpen', nextState);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: school.id,
          isPpdbOpen: nextState,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSaveMessage({
          type: 'success',
          text: `Status portal PPDB ${school.name} berhasil diubah menjadi: ${nextState ? 'DIBUKA' : 'DITUTUP'}!`,
        });
        setTimeout(() => setSaveMessage(null), 4000);
      }
    } catch (err) {
      console.error('Failed to quick-save PPDB status:', err);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: school.id,
          quota: Number(school.quota),
          waveName: school.waveName,
          isPpdbOpen: Boolean(school.isPpdbOpen),
          registrationFee: Number(school.registrationFee),
          bankName: school.bankName,
          bankAccountNumber: school.bankAccountNumber,
          bankAccountHolder: school.bankAccountHolder,
          waCenterPhone: school.waCenterPhone,
          address: school.address,
          tagline: school.tagline,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Gagal menyimpan konfigurasi unit');
      }

      setSaveMessage({
        type: 'success',
        text: `Pengaturan ${school.name} berhasil disimpan dan langsung aktif!`,
      });
      setTimeout(() => setSaveMessage(null), 5000);
    } catch (err: unknown) {
      const error = err as Error;
      setSaveMessage({
        type: 'error',
        text: error.message || 'Terjadi kesalahan saat menyimpan pengaturan unit.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#2D7A70] uppercase tracking-wider mb-1">
            <Sliders className="w-3.5 h-3.5" />
            <span>Pusat Kendali Pengaturan Unit</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Pengaturan {school.name}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola mandiri gelombang penerimaan, kuota kelas, rekening kas unit, dan nomor layanan helpdesk.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <RotateCcw className="w-4 h-4 animate-spin" />
              <span>Menyimpan...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Simpan Pengaturan Unit</span>
            </>
          )}
        </button>
      </div>

      {/* Save Status Notification */}
      {saveMessage && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between border ${
            saveMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          <div className="flex items-center space-x-2">
            {saveMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            )}
            <span>{saveMessage.text}</span>
          </div>
          <button
            onClick={() => setSaveMessage(null)}
            className="text-slate-400 hover:text-slate-600 font-bold ml-4 cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Live Monitoring KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Status PPDB */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status Portal PPDB</span>
          <div className="mt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={handleTogglePpdb}
              title="Klik untuk langsung buka/tutup PPDB"
              className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-all hover:scale-105 ${
                school.isPpdbOpen
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                  : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
              }`}
            >
              {school.isPpdbOpen ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
              <span>{school.isPpdbOpen ? 'PENDAFTARAN DIBUKA' : 'PENDAFTARAN DITUTUP'}</span>
            </button>
          </div>
          <p className="text-[10px] text-slate-400 mt-2">Klik tombol untuk langsung mengubah status</p>
        </div>

        {/* Card 2: Total Pendaftar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pendaftar Masuk</span>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-900 tabular-nums">
              {school.stats.totalRegistrations}
            </span>
            <span className="text-xs text-slate-400 font-semibold">/ {school.quota} Kuota</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            {school.stats.verifiedCount} Terverifikasi, {school.stats.acceptedCount} Resmi Diterima
          </p>
        </div>

        {/* Card 3: Sisa Kuota */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Sisa Kuota Kursi</span>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-900 tabular-nums">
              {school.stats.remainingQuota}
            </span>
            <span className="text-xs text-slate-400 font-semibold">Kursi Tersisa</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Berdasarkan total pendaftar yang masuk</p>
        </div>

        {/* Card 4: Rasio Keterisian */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Rasio Keterisian</span>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-[#10B981] tabular-nums">
              {school.stats.occupancyRate}%
            </span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-[#10B981] h-full rounded-full transition-all"
              style={{ width: `${Math.min(100, school.stats.occupancyRate)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 bg-white px-4 rounded-t-2xl">
        <button
          onClick={() => setActiveTab('wave')}
          className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center space-x-2 ${
            activeTab === 'wave'
              ? 'border-[#10B981] text-[#10B981]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Gelombang &amp; Kuota PPDB</span>
        </button>

        <button
          onClick={() => setActiveTab('finance')}
          className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center space-x-2 ${
            activeTab === 'finance'
              ? 'border-[#10B981] text-[#10B981]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>Biaya &amp; Rekening Unit</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center space-x-2 ${
            activeTab === 'profile'
              ? 'border-[#10B981] text-[#10B981]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Kontak &amp; Profil Unit</span>
        </button>
      </div>

      {/* Tab 1: Gelombang & Kuota */}
      {activeTab === 'wave' && (
        <div className="bg-white p-6 rounded-b-2xl border border-slate-200 border-t-0 shadow-2xs space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nama Gelombang Aktif
              </label>
              <input
                type="text"
                value={school.waveName}
                onChange={(e) => handleChange('waveName', e.target.value)}
                placeholder="Contoh: Gelombang 1 - Early Bird"
                className="w-full px-3.5 py-2.5 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#10B981]"
              />
              <p className="text-[10px] text-slate-400 mt-1">Ditampilkan pada formulir pendaftaran calon wali murid</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Target Kuota Murid Baru
              </label>
              <input
                type="number"
                min="1"
                value={school.quota}
                onChange={(e) => handleChange('quota', Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#10B981]"
              />
              <p className="text-[10px] text-slate-400 mt-1">Kapasitas kursi penerimaan yang dihitung pada grafik keterisian</p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-800">Status Pendaftaran Online PPDB</h4>
              <p className="text-[11px] text-slate-500">
                {school.isPpdbOpen
                  ? 'Portal pendaftaran unit ini terbuka untuk calon wali murid baru.'
                  : 'Portal pendaftaran ditutup sementara waktu.'}
              </p>
            </div>
            <button
              type="button"
              onClick={handleTogglePpdb}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center space-x-1.5 ${
                school.isPpdbOpen
                  ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              {school.isPpdbOpen ? (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Tutup Pendaftaran</span>
                </>
              ) : (
                <>
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Buka Pendaftaran</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Biaya & Rekening Kas Unit */}
      {activeTab === 'finance' && (
        <div className="bg-white p-6 rounded-b-2xl border border-slate-200 border-t-0 shadow-2xs space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Biaya Formulir Registrasi (Rp)
              </label>
              <input
                type="number"
                step="5000"
                min="0"
                value={school.registrationFee}
                onChange={(e) => handleChange('registrationFee', Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#10B981]"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Terformat: <span className="font-bold text-slate-700">{formatRupiah(school.registrationFee)}</span>
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nama Bank Rekening Unit
              </label>
              <input
                type="text"
                value={school.bankName}
                onChange={(e) => handleChange('bankName', e.target.value)}
                placeholder="Contoh: Bank Syariah Indonesia (BSI)"
                className="w-full px-3.5 py-2.5 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#10B981]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nomor Rekening Unit
              </label>
              <input
                type="text"
                value={school.bankAccountNumber}
                onChange={(e) => handleChange('bankAccountNumber', e.target.value)}
                placeholder="Contoh: 7788991122"
                className="w-full px-3.5 py-2.5 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#10B981]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nama Pemilik Rekening (Atas Nama)
              </label>
              <input
                type="text"
                value={school.bankAccountHolder}
                onChange={(e) => handleChange('bankAccountHolder', e.target.value)}
                placeholder="Contoh: SDIT Al-Afiyah Majalengka"
                className="w-full px-3.5 py-2.5 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#10B981]"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Kontak & Profil Unit */}
      {activeTab === 'profile' && (
        <div className="bg-white p-6 rounded-b-2xl border border-slate-200 border-t-0 shadow-2xs space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nomor WhatsApp Helpdesk / CS Unit
              </label>
              <input
                type="text"
                value={school.waCenterPhone}
                onChange={(e) => handleChange('waCenterPhone', e.target.value)}
                placeholder="Contoh: 6281310139001"
                className="w-full px-3.5 py-2.5 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#10B981]"
              />
              <p className="text-[10px] text-slate-400 mt-1">Gunakan format 628xxx (tanpa tanda plus atau spasi)</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Tagline / Visi Singkat Unit
              </label>
              <input
                type="text"
                value={school.tagline}
                onChange={(e) => handleChange('tagline', e.target.value)}
                placeholder="Contoh: Mencetak Generasi Berakhlak Qurani & Unggul Teknologi"
                className="w-full px-3.5 py-2.5 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#10B981]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Alamat Fisik Gedung Unit
              </label>
              <textarea
                rows={3}
                value={school.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="Alamat lengkap sekolah..."
                className="w-full px-3.5 py-2.5 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#10B981]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
