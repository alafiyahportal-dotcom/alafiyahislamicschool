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
  AlertCircle,
  MessageCircle,
  Loader2,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
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

function CheckStatusSdContent() {
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
      setErrorMessage('Masukkan minimal 3 karakter (Nomor Registrasi / Nama Murid).');
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
          school: 'sd',
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

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans">
      <Navbar schoolSlug="sd" transparentAtTop={false} />

      <main className="flex-1 pt-16 sm:pt-20">
        {/* Compact Header Minimalis Al-Hidayah Style */}
        <section className="bg-[#00594f] text-white py-8 sm:py-10 border-b-4 border-[#e5a93b]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <nav
                className="flex items-center gap-1.5 text-xs text-emerald-100/80 mb-1.5 flex-wrap"
                aria-label="Breadcrumb"
              >
                <Link href="/sd" className="hover:text-[#e5a93b] transition-colors">
                  Beranda SDIT
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-[#e5a93b]" />
                <Link href="/sd/spmb" className="hover:text-[#e5a93b] transition-colors">
                  SPMB
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-[#e5a93b]" />
                <span className="text-[#e5a93b] font-semibold">Cek Status</span>
              </nav>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Cek Status Pendaftaran SPMB SDIT Al-Afiyah
              </h1>
            </div>

            <Link
              href="/sd/spmb/daftar"
              className="px-4 py-2 rounded-xs bg-[#e5a93b] hover:bg-[#d4962a] text-white text-xs font-bold self-start sm:self-auto shrink-0 transition-colors"
            >
              Isi Formulir Baru
            </Link>
          </div>
        </section>

        {/* Search & Results */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">
          {/* Search Form Box */}
          <div className="p-5 sm:p-6 rounded-sm bg-[#FAF6EC] border border-[#E5D5B2] space-y-3">
            <form onSubmit={(e) => handleSearch(e)} className="space-y-3">
              <label className="text-xs font-extrabold text-[#003831] uppercase tracking-wider block">
                Cari Nomor Registrasi / Nama Calon Murid
              </label>
              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Contoh: REG-SD-2027-0001 atau nama murid"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xs bg-white border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-[#00594f]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2.5 rounded-xs bg-[#00594f] hover:bg-[#003831] text-white font-extrabold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-70 shrink-0"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Mencari...</span>
                    </>
                  ) : (
                    <>
                      <span>Cari Data</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>

              {errorMessage && (
                <div className="p-2.5 rounded-xs bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </form>
          </div>

          {/* Results */}
          {hasSearched && results && results.length > 0 && (
            <div className="space-y-4">
              {results.map((item) => {
                const isAccepted = item.status === 'ACCEPTED';
                const isRejected = item.status === 'REJECTED';

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-sm border border-slate-200 p-5 space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-extrabold text-[#003831] bg-slate-100 px-2.5 py-0.5 rounded-xs">
                            {item.registrationNo}
                          </span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(item.registrationNo, item.id)}
                            className="text-slate-400 hover:text-[#00594f] cursor-pointer"
                            title="Salin"
                          >
                            {copiedId === item.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        <h3 className="text-lg font-extrabold text-[#003831] mt-1">
                          {item.studentName}
                        </h3>
                        <p className="text-xs text-slate-500">
                          Wali: <strong className="text-slate-700">{item.parentName || '-'}</strong>
                        </p>
                      </div>

                      <div>
                        {isAccepted ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xs text-xs font-bold bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>LULUS SELEKSI</span>
                          </span>
                        ) : isRejected ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xs text-xs font-bold bg-rose-100 text-rose-800">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>BELUM DITERIMA</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xs text-xs font-bold bg-amber-100 text-amber-800">
                            <Clock className="w-3.5 h-3.5" />
                            <span>PROSES VERIFIKASI</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                      <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xs">
                        <span className="text-slate-500 block text-[11px]">Biaya Formulir</span>
                        <strong className={item.isPaid ? 'text-emerald-700' : 'text-amber-700'}>
                          {item.isPaid ? 'Lunas (Rp 250.000)' : 'Menunggu Konfirmasi'}
                        </strong>
                      </div>
                      <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xs">
                        <span className="text-slate-500 block text-[11px]">Berkas</span>
                        <strong className="text-slate-800">
                          {item.validDocs}/{item.totalDocs || 4} Terverifikasi
                        </strong>
                      </div>
                      <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xs col-span-2 sm:col-span-1">
                        <span className="text-slate-500 block text-[11px]">Tanggal Daftar</span>
                        <strong className="text-slate-800">
                          {new Date(item.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </strong>
                      </div>
                    </div>

                    <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100">
                      <Link
                        href={`/portal/ppdb/${item.registrationNo}`}
                        className="px-4 py-2 rounded-xs bg-[#00594f] hover:bg-[#003831] text-white text-xs font-bold inline-flex items-center gap-1.5"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Buka Portal Murid</span>
                      </Link>
                      <a
                        href={`https://wa.me/6281310139001?text=Assalamu%27alaikum%20Panitia%20SDIT%20Al-Afiyah,%20konfirmasi%20pendaftaran%20${item.registrationNo}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-[#00594f] hover:underline inline-flex items-center gap-1"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Hubungi Panitia</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {hasSearched && results && results.length === 0 && !isLoading && (
            <div className="p-6 rounded-sm bg-white border border-slate-200 text-center space-y-2">
              <p className="text-sm font-bold text-slate-800">Data Tidak Ditemukan</p>
              <p className="text-xs text-slate-500">
                Pastikan Nomor Registrasi atau Nama Calon Murid sudah benar.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer schoolSlug="sd" />
      <StickyMobileBar schoolSlug="sd" />
    </div>
  );
}

export default function SdCheckStatusPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <CheckStatusSdContent />
    </Suspense>
  );
}
