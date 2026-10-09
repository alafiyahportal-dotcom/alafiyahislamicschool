'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyMobileBar from '@/components/layout/StickyMobileBar';
import { 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Award, 
  AlertCircle,
  MessageCircle,
  Loader2,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  ArrowLeft,
  Sparkles
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

function CheckStatusSmpContent() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResultItem[] | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSearch = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const searchQuery = (customQuery !== undefined ? customQuery : query).trim();

    if (!searchQuery || searchQuery.length < 3) {
      setErrorMessage('Silakan masukkan minimal 3 karakter (Nomor Registrasi, Nama Murid, atau No. WA).');
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
          school: 'smp',
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

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusBadge = (status: string, isPaid: boolean) => {
    switch (status) {
      case 'ACCEPTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Lulus Seleksi (Diterima)
          </span>
        );
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            Berkas Terverifikasi
          </span>
        );
      case 'PENDING':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            {isPaid ? 'Menunggu Verifikasi Berkas' : 'Menunggu Konfirmasi Infaq'}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-[#ffd51e] selection:text-[#030164]">
      <Navbar schoolSlug="smp" />

      {/* Hero Header */}
      <section className="bg-gradient-to-br from-[#030164] via-[#090580] to-[#01003d] text-white pt-24 sm:pt-28 pb-16 sm:pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffd51e_1.5px,transparent_1.5px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#ffd51e]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <nav className="flex items-center gap-1.5 text-xs text-blue-200/90 mb-5" aria-label="Breadcrumb">
            <Link href="/smp" className="hover:text-white transition-colors inline-flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Beranda SMP IT</span>
            </Link>
            <ChevronRight className="w-3 h-3 text-blue-300/50" />
            <Link href="/smp/spmb" className="hover:text-white transition-colors">SPMB</Link>
            <ChevronRight className="w-3 h-3 text-blue-300/50" />
            <span className="text-[#ffd51e] font-semibold">Cek Status Pendaftaran</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-[#ffd51e]/40 text-[#ffd51e] text-xs font-bold tracking-wider uppercase mb-4 backdrop-blur-xs">
              <Search className="w-3.5 h-3.5" />
              <span>LACAK PENDAFTARAN MURID SMP IT</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Cek Status Pendaftaran SPMB
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-200 leading-relaxed font-normal">
              Pantau verifikasi berkas, konfirmasi infaq pendaftaran, serta pengumuman observasi calon murid SMP IT Al-Afiyah Tahun Ajaran 2027/2028 secara transparan.
            </p>
          </div>
        </div>
      </section>

      {/* Main Search Interface */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 pb-16 w-full space-y-8">
        
        {/* Search Input Box */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-4">
          <form onSubmit={handleSearch} className="space-y-4">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Masukkan Nomor Registrasi / Nama Murid / No. WhatsApp:
            </label>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Contoh: REG-SMP-2027-0001 atau nama murid"
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-300 text-sm focus:outline-hidden focus:border-[#030164] shadow-xs"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3.5 rounded-2xl bg-[#030164] hover:bg-blue-900 text-[#ffd51e] font-extrabold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Mencari...</span>
                  </>
                ) : (
                  <>
                    <span>Cari Data</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </form>

          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
            <span>Butuh bantuan panitia?</span>
            <a
              href="https://wa.me/6282249357893?text=Assalamu%27alaikum%20Panitia%20SPMB%20SMP%20IT%20Al-Afiyah,%20saya%20ingin%20menanyakan%20status%20pendaftaran"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#030164] font-bold hover:underline inline-flex items-center gap-1"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Panitia (0822-4935-7893)</span>
            </a>
          </div>
        </div>

        {/* Results Section */}
        {hasSearched && (
          <div className="space-y-4">
            {results && results.length > 0 ? (
              results.map((item) => (
                <div 
                  key={item.id}
                  className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-extrabold text-[#030164] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                          {item.registrationNo}
                        </span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(item.registrationNo, item.id)}
                          className="text-slate-400 hover:text-slate-600 p-1"
                          title="Salin Nomor Registrasi"
                        >
                          {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mt-2">
                        {item.studentName}
                      </h3>
                    </div>

                    <div>
                      {getStatusBadge(item.status, item.isPaid)}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
                    <div className="p-3 rounded-xl bg-slate-50">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Jenjang Sekolah:</span>
                      <strong className="text-slate-800">SMP IT Al-Afiyah</strong>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Nama Orang Tua:</span>
                      <strong className="text-slate-800">{item.parentName || '-'}</strong>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Status Infaq Formulir:</span>
                      <strong className={item.isPaid ? 'text-emerald-600' : 'text-amber-600'}>
                        {item.isPaid ? 'Lunas (Rp 200.000) ✓' : 'Belum Terkonfirmasi'}
                      </strong>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs text-slate-500">
                      Terdaftar pada: {new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>

                    <a
                      href={`https://wa.me/6282249357893?text=Assalamu%27alaikum%20Panitia%20SPMB%20SMP%20IT%20Al-Afiyah,%20saya%20ingin%20konfirmasi%20No%20Registrasi%20${item.registrationNo}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#030164] hover:underline"
                    >
                      <span>Konfirmasi Panitia</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-3">
                <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
                <h4 className="text-base font-bold text-slate-900">
                  Data Pendaftaran Tidak Ditemukan
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Pastikan nomor registrasi atau nama murid yang Anda masukkan sesuai saat mengisi formulir SPMB.
                </p>
                <div className="pt-2">
                  <Link
                    href="/smp/spmb/daftar"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#030164] text-[#ffd51e] font-bold text-xs uppercase"
                  >
                    <span>Isi Formulir Baru</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      <Footer schoolSlug="smp" />
      <StickyMobileBar schoolSlug="smp" />
    </div>
  );
}

export default function SmpCekStatusPage() {
  return (
    <Suspense fallback={
      <div className="py-24 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#030164]" />
        <p className="text-xs text-slate-500 mt-2">Memuat halaman cek status...</p>
      </div>
    }>
      <CheckStatusSmpContent />
    </Suspense>
  );
}
