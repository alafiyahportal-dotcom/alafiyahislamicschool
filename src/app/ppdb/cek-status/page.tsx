'use client';

import React, { useState, useEffect, Suspense, useTransition } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyMobileBar from '@/components/layout/StickyMobileBar';
import { 
  Search, 
  ArrowRight, 
  UserCheck, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Award, 
  School, 
  AlertCircle,
  FileText,
  MessageCircle,
  Loader2,
  HelpCircle,
  Copy,
  Check,
  Building2,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface SearchResultItem {
  id: string;
  registrationNo: string;
  studentName: string;
  nik: string;
  gender: string;
  schoolName: string;
  schoolSlug: string;
  schoolBadge: string;
  status: string;
  isPaid: boolean;
  totalDocs: number;
  validDocs: number;
  parentName: string;
  createdAt: string;
}

type UnitType = 'sd' | 'smp' | 'tk' | 'all';

interface UnitConfig {
  id: UnitType;
  name: string;
  shortTitle: string;
  badgeText: string;
  themeColor: string;
  themeHex: string;
  badgeTag: string;
  heading: string;
  subtitle: string;
  placeholder: string;
  quickExamples: { label: string; query: string }[];
  waPhone: string;
  waHelpTitle: string;
  waHelpText: string;
  waDefaultMsg: string;
  registerUrl: string;
  registerBtnText: string;
  navbarSlug?: 'tk' | 'sd' | 'smp';
  footerSlug: 'tk' | 'sd' | 'smp' | 'foundation';
}

const UNIT_CONFIGS: Record<UnitType, UnitConfig> = {
  sd: {
    id: 'sd',
    name: 'SD IT Al-Afiyah',
    shortTitle: 'SD IT',
    badgeText: 'SD IT',
    themeColor: 'from-[#00A651] to-[#008f45]',
    themeHex: '#00A651',
    badgeTag: 'Paling Populer',
    heading: 'Lacak Status SPMB SD IT Al-Afiyah',
    subtitle: 'Periksa progres verifikasi berkas, jadwal tes observasi, dan pengumuman penerimaan calon murid baru SD IT Al-Afiyah T.A. 2027/2028.',
    placeholder: 'Nomor Registrasi (REG-SD-...), NIK (16 digit), atau No. WhatsApp',
    quickExamples: [
      { label: 'REG-SD-2026-0001', query: 'REG-SD-2026-0001' },
      { label: '0813-1013-9001', query: '081310139001' },
      { label: '3210123456780001', query: '3210123456780001' },
    ],
    waPhone: '6281310139001',
    waHelpTitle: 'Butuh Bantuan Panitia SPMB SD IT?',
    waHelpText: 'Hubungi layanan konsultasi WhatsApp resmi panitia penerimaan murid baru SD IT Al-Afiyah Majalengka.',
    waDefaultMsg: 'Assalamu%27alaikum%20Panitia%20SPMB%20SD%20IT%20Al-Afiyah,%20saya%20ingin%20menanyakan%20status%20pendaftaran%20ananda',
    registerUrl: '/ppdb/daftar?school=sd',
    registerBtnText: 'Daftar SPMB SD IT Sekarang',
    navbarSlug: 'sd',
    footerSlug: 'sd',
  },
  smp: {
    id: 'smp',
    name: 'SMP IT Al-Afiyah',
    shortTitle: 'SMP IT',
    badgeText: 'SMP IT',
    themeColor: 'from-sky-600 to-sky-700',
    themeHex: '#0284c7',
    badgeTag: 'Boarding & Full Day',
    heading: 'Lacak Status SPMB SMP IT Al-Afiyah',
    subtitle: 'Periksa verifikasi berkas akademik & tahfidz, jadwal tes observasi, dan pengumuman calon santri/murid SMP IT Al-Afiyah.',
    placeholder: 'Nomor Registrasi (REG-SMP-...), NIK (16 digit), atau No. WhatsApp',
    quickExamples: [
      { label: 'REG-SMP-2026-0001', query: 'REG-SMP-2026-0001' },
      { label: '0812-2334-4552', query: '081223344552' },
      { label: '3210123456780002', query: '3210123456780002' },
    ],
    waPhone: '6281223344552',
    waHelpTitle: 'Butuh Bantuan Panitia SPMB SMP IT?',
    waHelpText: 'Hubungi layanan konsultasi WhatsApp resmi panitia penerimaan santri baru SMP IT Al-Afiyah.',
    waDefaultMsg: 'Assalamu%27alaikum%20Panitia%20SPMB%20SMP%20IT%20Al-Afiyah,%20saya%20ingin%20menanyakan%20status%20pendaftaran%20ananda',
    registerUrl: '/ppdb/daftar?school=smp',
    registerBtnText: 'Daftar SPMB SMP IT Sekarang',
    navbarSlug: 'smp',
    footerSlug: 'smp',
  },
  tk: {
    id: 'tk',
    name: 'TK IT Al-Afiyah',
    shortTitle: 'TK IT',
    badgeText: 'TK IT',
    themeColor: 'from-amber-600 to-amber-700',
    themeHex: '#d97706',
    badgeTag: 'Sentra & Usia Dini',
    heading: 'Lacak Status SPMB TK IT Al-Afiyah',
    subtitle: 'Periksa progres pendaftaran, formulir observasi tumbuh kembang anak usia dini TK IT Al-Afiyah.',
    placeholder: 'Nomor Registrasi (REG-TK-...), NIK (16 digit), atau No. WhatsApp',
    quickExamples: [
      { label: 'REG-TK-2026-0001', query: 'REG-TK-2026-0001' },
      { label: '0812-2334-4552', query: '081223344552' },
      { label: '3210123456780003', query: '3210123456780003' },
    ],
    waPhone: '6281223344552',
    waHelpTitle: 'Butuh Bantuan Panitia SPMB TK IT?',
    waHelpText: 'Hubungi layanan konsultasi WhatsApp resmi panitia penerimaan murid PAUD/TK IT Al-Afiyah.',
    waDefaultMsg: 'Assalamu%27alaikum%20Panitia%20SPMB%20TK%20IT%20Al-Afiyah,%20saya%20ingin%20menanyakan%20status%20pendaftaran%20ananda',
    registerUrl: '/ppdb/daftar?school=tk',
    registerBtnText: 'Daftar SPMB TK IT Sekarang',
    navbarSlug: 'tk',
    footerSlug: 'tk',
  },
  all: {
    id: 'all',
    name: 'Yayasan Pendidikan Imam Bonjol',
    shortTitle: 'Pusat / Semua Unit',
    badgeText: 'Semua Unit',
    themeColor: 'from-[#184F48] to-[#2D7A70]',
    themeHex: '#184F48',
    badgeTag: 'Pencarian Terpadu',
    heading: 'Lacak Status PPDB Online Terpadu',
    subtitle: 'Pencarian terintegrasi data pendaftaran nomor registrasi, NIK, dan nomor WhatsApp untuk seluruh unit pendidikan Al-Afiyah (TK, SD, SMP).',
    placeholder: 'Nomor Registrasi (REG-...), NIK (16 digit), atau No. WhatsApp',
    quickExamples: [
      { label: 'REG-SD-2026-0001', query: 'REG-SD-2026-0001' },
      { label: 'REG-SMP-2026-0001', query: 'REG-SMP-2026-0001' },
      { label: '0813-1013-9001', query: '081310139001' },
    ],
    waPhone: '6281223344552',
    waHelpTitle: 'Butuh Bantuan Panitia PPDB Yayasan?',
    waHelpText: 'Hubungi layanan konsultasi WhatsApp resmi panitia penerimaan Yayasan Pendidikan Imam Bonjol.',
    waDefaultMsg: 'Assalamu%27alaikum%20Sekretariat%20Yayasan%20Imam%20Bonjol,%20saya%20ingin%20menanyakan%20status%20pendaftaran%20ananda',
    registerUrl: '/ppdb/daftar',
    registerBtnText: 'Daftar SPMB Terpadu',
    navbarSlug: undefined,
    footerSlug: 'foundation',
  },
};

function CheckStatusContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [, startTransition] = useTransition();

  const paramSchool = (searchParams.get('school') || searchParams.get('unit') || '').toLowerCase();
  const initialUnit: UnitType = 
    paramSchool === 'sd' || paramSchool === 'smp' || paramSchool === 'tk'
      ? paramSchool
      : 'sd'; // Default to SD IT when navigating from school site

  const [activeUnit, setActiveUnit] = useState<UnitType>(initialUnit);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResultItem[] | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Sync state if URL search param changes
  useEffect(() => {
    if (paramSchool === 'sd' || paramSchool === 'smp' || paramSchool === 'tk' || paramSchool === 'all') {
      setActiveUnit(paramSchool);
    }
  }, [paramSchool]);

  const config = UNIT_CONFIGS[activeUnit] || UNIT_CONFIGS.sd;

  const handleUnitChange = (unit: UnitType) => {
    setActiveUnit(unit);
    setErrorMessage('');
    startTransition(() => {
      const newUrl = unit === 'all' ? '/ppdb/cek-status?school=all' : `/ppdb/cek-status?school=${unit}`;
      router.replace(newUrl, { scroll: false });
    });
  };

  const handleSearch = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const searchQuery = (customQuery !== undefined ? customQuery : query).trim();

    if (!searchQuery || searchQuery.length < 3) {
      setErrorMessage('Silakan masukkan minimal 3 karakter untuk melakukan pencarian.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setHasSearched(true);

    try {
      const res = await fetch('/api/ppdb/check-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query: searchQuery,
          // We pass unit optionally; if user is in a unit, search API can filter or return all
          school: activeUnit === 'all' ? undefined : activeUnit 
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setErrorMessage(json.error || 'Gagal mencari data pendaftaran.');
        setResults([]);
      } else {
        setResults(json.data || []);
      }
    } catch {
      setErrorMessage('Terjadi gangguan jaringan saat menghubungi server.');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickSearch = (sampleQuery: string) => {
    setQuery(sampleQuery);
    handleSearch(undefined, sampleQuery);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter results for current active unit if applicable
  const currentUnitResults = results ? (
    activeUnit === 'all' 
      ? results 
      : results.filter(item => item.schoolSlug === activeUnit)
  ) : null;

  const otherUnitResults = results && activeUnit !== 'all' ? (
    results.filter(item => item.schoolSlug !== activeUnit)
  ) : [];

  return (
    <div className="min-h-screen soft-mesh-bg flex flex-col justify-between overflow-x-clip">
      {/* Unit-specific Navbar: Displays SD IT Logo & Title if 'sd' */}
      <Navbar schoolSlug={config.navbarSlug} />

      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 my-auto pb-24 sm:pb-12">
        {/* Unit Tabs Selector */}
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
            <School className="w-3.5 h-3.5 text-slate-400" />
            <span>Pilih Satuan Pendidikan / Unit</span>
          </div>

          <div className="inline-flex p-1.5 rounded-2xl bg-white/90 backdrop-blur-sm border border-slate-200/90 shadow-sm max-w-full overflow-x-auto scrollbar-none">
            {/* SD IT Tab */}
            <button
              type="button"
              onClick={() => handleUnitChange('sd')}
              className={`flex items-center space-x-2 px-3.5 sm:px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeUnit === 'sd'
                  ? 'bg-[#00A651] text-white shadow-md shadow-[#00A651]/25 ring-2 ring-[#00A651]/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${activeUnit === 'sd' ? 'bg-amber-300' : 'bg-emerald-500'}`} />
              <span>SD IT Al-Afiyah</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-extrabold ${activeUnit === 'sd' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'}`}>
                SPMB Buka
              </span>
            </button>

            {/* SMP IT Tab */}
            <button
              type="button"
              onClick={() => handleUnitChange('smp')}
              className={`flex items-center space-x-2 px-3.5 sm:px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeUnit === 'smp'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/25 ring-2 ring-sky-600/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${activeUnit === 'smp' ? 'bg-white' : 'bg-sky-500'}`} />
              <span>SMP IT</span>
            </button>

            {/* TK IT Tab */}
            <button
              type="button"
              onClick={() => handleUnitChange('tk')}
              className={`flex items-center space-x-2 px-3.5 sm:px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeUnit === 'tk'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/25 ring-2 ring-amber-600/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${activeUnit === 'tk' ? 'bg-white' : 'bg-amber-500'}`} />
              <span>TK IT</span>
            </button>

            {/* Pusat / Semua Unit Tab */}
            <button
              type="button"
              onClick={() => handleUnitChange('all')}
              className={`flex items-center space-x-1.5 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeUnit === 'all'
                  ? 'bg-[#184F48] text-white shadow-md shadow-[#184F48]/25 ring-2 ring-[#184F48]/30'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Semua Unit</span>
            </button>
          </div>
        </div>

        {/* Hero Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wide px-3.5 py-1.5 rounded-full border shadow-2xs mb-3 transition-colors duration-300"
            style={{
              backgroundColor: activeUnit === 'sd' ? '#E8F8F0' : activeUnit === 'smp' ? '#E0F2FE' : activeUnit === 'tk' ? '#FEF3C7' : '#E8F3F1',
              color: activeUnit === 'sd' ? '#00A651' : activeUnit === 'smp' ? '#0369a1' : activeUnit === 'tk' ? '#b45309' : '#184F48',
              borderColor: activeUnit === 'sd' ? '#A7F3D0' : activeUnit === 'smp' ? '#BAE6FD' : activeUnit === 'tk' ? '#FDE68A' : '#A7D4CF',
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tab Khusus: {config.name}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {config.heading}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            {config.subtitle}
          </p>
        </div>

        {/* Search Box Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm mb-8 transition-all">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Masukkan Kata Kunci Pencarian:
              </label>
              <span className="text-[11px] font-semibold text-slate-400">
                Pencarian Resmi PPDB
              </span>
            </div>

            <div className="relative flex items-center">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Search className="w-5 h-5" style={{ color: config.themeHex }} />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={config.placeholder}
                className="w-full pl-12 pr-28 sm:pr-36 py-3.5 sm:py-4 text-xs sm:text-sm bg-slate-50/80 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:border-transparent transition-all font-medium text-slate-900"
                style={{
                  // Dynamic focus ring
                  outlineColor: config.themeHex,
                }}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="absolute right-2 top-2 bottom-2 px-4 sm:px-6 rounded-xl text-white text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5 disabled:opacity-70 cursor-pointer"
                style={{ backgroundColor: config.themeHex }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="hidden sm:inline">Mencari...</span>
                  </>
                ) : (
                  <>
                    <span>Cari Murid</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>

            {/* Quick Sample Search Tags */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-600">Contoh Cepat:</span>
              {config.quickExamples.map((ex, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleQuickSearch(ex.query)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 font-mono text-[11px] transition-colors border border-slate-200 cursor-pointer"
                >
                  {ex.label}
                </button>
              ))}
            </div>
          </form>

          {errorMessage && (
            <div className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Results Section */}
        {hasSearched && currentUnitResults && (
          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <h2 className="text-sm font-bold text-slate-900">
                  Hasil Pencarian di {config.shortTitle}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
                  {currentUnitResults.length} Murid
                </span>
              </div>
              <span className="text-xs text-slate-500">
                Kata Kunci: <span className="font-mono font-bold text-slate-800">&quot;{query}&quot;</span>
              </span>
            </div>

            {/* Cross-unit match alert if data was found in another unit */}
            {otherUnitResults.length > 0 && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-start space-x-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">
                      Ditemukan {otherUnitResults.length} data pendaftaran di unit lain ({otherUnitResults.map(o => o.schoolName).join(', ')})
                    </span>
                    <span className="text-amber-800 text-[11px]">
                      Apakah ananda mendaftar di unit tersebut? Anda dapat beralih tab untuk melihat rincian lengkapnya.
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleUnitChange((otherUnitResults[0].schoolSlug as UnitType) || 'all')}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors shrink-0 shadow-2xs cursor-pointer flex items-center space-x-1"
                >
                  <span>Buka Tab {otherUnitResults[0].schoolName}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {currentUnitResults.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Data Pendaftaran Tidak Ditemukan di {config.name}
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  Pastikan Nomor Registrasi (contoh: <span className="font-mono font-bold text-slate-700">{config.quickExamples[0].label}</span>), NIK, atau Nomor WhatsApp yang dimasukkan sudah tepat.
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <Link
                    href={config.registerUrl}
                    className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-white text-xs font-bold transition-all shadow-xs"
                    style={{ backgroundColor: config.themeHex }}
                  >
                    <span>{config.registerBtnText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleUnitChange('all')}
                    className="inline-flex items-center space-x-1 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors border border-slate-200 cursor-pointer"
                  >
                    <span>Cari di Semua Unit</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {currentUnitResults.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 hover:border-slate-300 transition-all shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start space-x-4">
                      <div 
                        className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shrink-0 mt-0.5 border"
                        style={{
                          backgroundColor: item.schoolSlug === 'sd' ? '#E8F8F0' : item.schoolSlug === 'smp' ? '#E0F2FE' : '#FEF3C7',
                          color: item.schoolSlug === 'sd' ? '#00A651' : item.schoolSlug === 'smp' ? '#0284c7' : '#d97706',
                          borderColor: item.schoolSlug === 'sd' ? '#A7F3D0' : item.schoolSlug === 'smp' ? '#BAE6FD' : '#FDE68A',
                        }}
                      >
                        {item.studentName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-extrabold text-slate-900">
                            {item.studentName}
                          </h3>
                          <span 
                            className="px-2 py-0.5 rounded-full text-[10px] font-bold border"
                            style={{
                              backgroundColor: item.schoolSlug === 'sd' ? '#E8F8F0' : item.schoolSlug === 'smp' ? '#E0F2FE' : '#FEF3C7',
                              color: item.schoolSlug === 'sd' ? '#00A651' : item.schoolSlug === 'smp' ? '#0284c7' : '#d97706',
                              borderColor: item.schoolSlug === 'sd' ? '#A7F3D0' : item.schoolSlug === 'smp' ? '#BAE6FD' : '#FDE68A',
                            }}
                          >
                            {item.schoolBadge}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-1">
                          <span className="font-mono text-slate-700 flex items-center space-x-1">
                            <span>No. Reg:</span>
                            <strong className="text-slate-900 font-bold">{item.registrationNo}</strong>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(item.registrationNo, item.id)}
                              className="p-1 hover:text-slate-800 transition-colors cursor-pointer"
                              title="Salin No. Registrasi"
                            >
                              {copiedId === item.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-400" />}
                            </button>
                          </span>
                          <span>•</span>
                          <span>Unit: <strong>{item.schoolName}</strong></span>
                          <span>•</span>
                          <span>Wali: {item.parentName}</span>
                        </div>

                        {/* Status Badges */}
                        <div className="mt-2.5 flex flex-wrap items-center gap-2">
                          {item.status === 'ACCEPTED' ? (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
                              <Award className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Alhamdulillah, Diterima</span>
                            </span>
                          ) : item.status === 'INTERVIEW_SCHEDULED' ? (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold border border-blue-300">
                              <Calendar className="w-3.5 h-3.5 text-blue-600" />
                              <span>Jadwal Observasi Ditetapkan</span>
                            </span>
                          ) : item.isPaid ? (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-[#E8F3F1] text-[#184F48] text-xs font-bold border border-[#2D7A70]/30">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#2D7A70]" />
                              <span>Berkas Lunas & Terverifikasi</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold border border-amber-300">
                              <Clock className="w-3.5 h-3.5 text-amber-600" />
                              <span>Menunggu Pelunasan Formulir</span>
                            </span>
                          )}

                          <span className="text-[11px] text-slate-400">
                            Terdaftar: {new Date(item.createdAt).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Link
                      href={`/portal/ppdb/${item.registrationNo}`}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-white text-xs font-bold shrink-0 transition-all flex items-center justify-center space-x-1.5 shadow-xs hover:opacity-95"
                      style={{ backgroundColor: config.themeHex }}
                    >
                      <span>Buka Portal Resmi Ananda</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Assistance / Hotline Card per Unit */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3 text-xs text-slate-600">
            <div 
              className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border"
              style={{
                backgroundColor: activeUnit === 'sd' ? '#E8F8F0' : activeUnit === 'smp' ? '#E0F2FE' : '#FEF3C7',
                color: config.themeHex,
                borderColor: activeUnit === 'sd' ? '#A7F3D0' : activeUnit === 'smp' ? '#BAE6FD' : '#FDE68A',
              }}
            >
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block text-sm">
                {config.waHelpTitle}
              </span>
              <span className="text-slate-600 text-xs leading-relaxed">
                {config.waHelpText}
              </span>
            </div>
          </div>
          <a
            href={`https://wa.me/${config.waPhone}?text=${config.waDefaultMsg}`}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shrink-0 transition-colors flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer"
          >
            <span>Hubungi WhatsApp Panitia</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </main>

      {/* Unit-specific Footer: Displays SD IT address, phone, social media when 'sd' */}
      <Footer schoolSlug={config.footerSlug} />

      {/* Mobile Sticky Bar for fast actions */}
      <StickyMobileBar 
        schoolSlug={config.navbarSlug} 
        waPhone={config.waPhone} 
        schoolName={config.name} 
      />
    </div>
  );
}

export default function CheckStatusPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen soft-mesh-bg flex items-center justify-center">
          <div className="flex flex-col items-center space-y-3">
            <Loader2 className="w-8 h-8 text-[#00A651] animate-spin" />
            <p className="text-xs font-semibold text-slate-600">Memuat Portal Lacak Status...</p>
          </div>
        </div>
      }
    >
      <CheckStatusContent />
    </Suspense>
  );
}
