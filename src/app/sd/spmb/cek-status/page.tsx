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
  HelpCircle,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import ScrollReveal from '@/components/landing/ScrollReveal';

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
          school: 'sd', // Strictly filter for SD IT registrations
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
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-[#00A651]/20 selection:text-[#00A651]">
      <Navbar schoolSlug="sd" />

      {/* Hero Header Khusus SD IT */}
      <section className="bg-gradient-to-br from-[#064e3b] via-[#047857] to-[#00A651] text-white pt-24 sm:pt-28 pb-14 sm:pb-18 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:20px_20px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          {/* Breadcrumb */}
          <nav className="flex items-center justify-center gap-1.5 text-xs text-emerald-200/90 mb-5" aria-label="Breadcrumb">
            <Link href="/sd" className="hover:text-white transition-colors inline-flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Beranda SD IT</span>
            </Link>
            <ChevronRight className="w-3 h-3 text-emerald-300/50" />
            <Link href="/sd/spmb" className="hover:text-white transition-colors">
              SPMB
            </Link>
            <ChevronRight className="w-3 h-3 text-emerald-300/50" />
            <span className="text-white font-medium">Lacak Status</span>
          </nav>

          <p className="font-arabic text-xl sm:text-2xl text-amber-300 mb-2 tracking-wide drop-shadow-sm">
            مَدْرَسَةُ العَافِيَةِ الإبْتِدَائِيَّةِ الإسْلَامِيَّةِ
          </p>

          <div className="text-xs font-bold text-amber-300 uppercase tracking-widest inline-flex items-center gap-1.5 mb-3">
            <Search className="w-3.5 h-3.5 text-amber-300" />
            <span>PORTAL VERIFIKASI BERKAS &amp; OBSERVASI</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Cek Status Pendaftaran SPMB <br className="hidden sm:inline" />
            SD IT Al-Afiyah Majalengka
          </h1>

          <p className="mt-3.5 text-xs sm:text-sm lg:text-base text-emerald-100/90 max-w-2xl mx-auto leading-relaxed font-normal">
            Pantau perkembangan verifikasi berkas, jadwal tes observasi calon murid, serta wawancara orang tua secara transparan dan terpusat.
          </p>

          {/* Form Pencarian */}
          <form onSubmit={(e) => handleSearch(e)} className="mt-8 max-w-xl mx-auto">
            <div className="relative flex items-center shadow-xl rounded-2xl bg-white border-2 border-emerald-400/50 focus-within:border-emerald-300 transition-all p-1.5 sm:p-2 text-slate-800">
              <Search className="w-5 h-5 text-emerald-600 ml-3 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="No. Registrasi (REG-SD-...) / Nama Murid / NIK..."
                className="w-full px-3 py-2 text-xs sm:text-sm text-slate-800 bg-transparent placeholder-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 px-4 sm:px-6 py-2.5 sm:py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-70 shrink-0"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Mencari...</span>
                  </>
                ) : (
                  <>
                    <span>Cari Data</span>
                    <ArrowRight className="w-4 h-4 hidden sm:inline text-slate-950" />
                  </>
                )}
              </button>
            </div>

            {errorMessage && (
              <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-rose-200 font-medium bg-rose-950/60 px-3 py-1.5 rounded-lg border border-rose-400/30">
                <AlertCircle className="w-4 h-4 text-rose-300 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </form>
        </div>
      </section>

      {/* Main Results Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <ScrollReveal yOffset={20} duration={500}>
          {/* State: Belum Mencari */}
        {!hasSearched && (
          <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200/80 shadow-xs text-center max-w-2xl mx-auto">
            <div className="w-12 h-12 mx-auto rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-[#00A651] mb-4">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-800">
              Siapkan Nomor Registrasi SD IT Anda
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Nomor registrasi telah dikirimkan via WhatsApp dan tertera pada bukti formulir pendaftaran saat awal Anda mendaftar (contoh: <span className="font-mono font-semibold text-emerald-800">REG-SD-2026-0001</span>).
            </p>

            <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#00A651]" />
                Verifikasi Berkas Otomatis
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#00A651]" />
                Jadwal Observasi & Wawancara
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#00A651]" />
                Informasi Daftar Ulang
              </span>
            </div>
          </div>
        )}

        {/* State: Sudah Mencari & Ditemukan Data */}
        {hasSearched && results && results.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-bold text-slate-700">
                Ditemukan <span className="text-emerald-700 font-extrabold">{results.length}</span> pendaftar di SD IT Al-Afiyah:
              </h2>
              <span className="text-xs text-slate-500">Pembaruan sistem real-time</span>
            </div>

            {results.map((item) => {
              const isAccepted = item.status === 'ACCEPTED';
              const isVerifying = item.status === 'VERIFYING' || item.status === 'SUBMITTED';
              const isRejected = item.status === 'REJECTED';

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all p-5 sm:p-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase bg-[#00A651]/10 text-emerald-800 border border-[#00A651]/20">
                          SD IT Al-Afiyah
                        </span>
                        <div className="flex items-center gap-1 font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          <span>{item.registrationNo}</span>
                          <button
                            onClick={() => copyToClipboard(item.registrationNo, item.id)}
                            title="Salin Nomor Registrasi"
                            className="text-slate-400 hover:text-emerald-700 ml-1"
                          >
                            {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-2">
                        {item.studentName}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Wali: <span className="font-medium text-slate-700">{item.parentName || '-'}</span> • NIK: <span className="font-mono">{item.nik.slice(0, 6)}******{item.nik.slice(-4)}</span>
                      </p>
                    </div>

                    {/* Status Badge */}
                    <div className="self-start sm:self-center">
                      {isAccepted && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>LULUS SELEKSI</span>
                        </div>
                      )}
                      {isVerifying && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          <Clock className="w-4 h-4 text-amber-600" />
                          <span>DALAM PROSES VERIFIKASI</span>
                        </div>
                      )}
                      {isRejected && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
                          <AlertCircle className="w-4 h-4 text-rose-600" />
                          <span>BELUM DAPAT DITERIMA</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 text-xs">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-slate-500 block text-[11px]">Biaya Formulir</span>
                      <span className={`font-semibold inline-flex items-center gap-1 mt-0.5 ${item.isPaid ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {item.isPaid ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                        {item.isPaid ? 'Lunas (Rp 250.000)' : 'Menunggu Bayar'}
                      </span>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-slate-500 block text-[11px]">Kelengkapan Berkas</span>
                      <span className="font-semibold text-slate-800 block mt-0.5">
                        {item.validDocs}/{item.totalDocs || 4} Terverifikasi
                      </span>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-slate-500 block text-[11px]">Tanggal Masuk</span>
                      <span className="font-semibold text-slate-800 block mt-0.5">
                        {new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-slate-500 block text-[11px]">Jenjang Kuota</span>
                      <span className="font-semibold text-slate-800 block mt-0.5">
                        Kelas 1 (2 Rombel)
                      </span>
                    </div>
                  </div>

                  {/* Action Link to Portal */}
                  <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <p className="text-xs text-slate-500">
                      Klik detail untuk melihat jadwal tes wawancara, cetak kartu pendaftaran & upload kelengkapan akta.
                    </p>
                    <Link
                      href={`/portal/ppdb/${item.registrationNo}`}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#00A651] hover:bg-[#008f45] text-white text-xs font-semibold rounded-xl transition-all shadow-xs shrink-0"
                    >
                      <span>Buka Lembar Pendaftar</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* State: Pencarian Nihil */}
        {hasSearched && results && results.length === 0 && (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xs text-center max-w-xl mx-auto">
            <div className="w-16 h-16 mx-auto rounded-full bg-amber-50 flex items-center justify-center text-amber-600 mb-4">
              <HelpCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Data Tidak Ditemukan
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Tidak ada calon murid SD IT Al-Afiyah yang cocok dengan kata kunci &ldquo;<span className="font-semibold text-slate-800">{query}</span>&rdquo;.
            </p>
            <div className="mt-5 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-left text-xs text-slate-600 space-y-1.5">
              <p className="font-semibold text-slate-800">Tips Pencarian:</p>
              <p>• Masukkan Nomor Registrasi lengkap (contoh: <span className="font-mono font-medium">REG-SD-2026-0001</span>).</p>
              <p>• Atau ketik nama lengkap calon murid sesuai Akta Kelahiran.</p>
              <p>• Bila baru saja mengisi formulir, silakan tunggu 2-3 menit hingga database tersinkronisasi.</p>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => { setQuery(''); setHasSearched(false); }}
                className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
              >
                Coba Cari Lagi
              </button>
              <a
                href="https://wa.me/6281310139001?text=Assalamu%27alaikum%20Panitia%20SPMB%20SD%20IT%20Al-Afiyah,%20saya%20mengalami%20kendala%20saat%20cek%20status%20pendaftaran"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-xl transition-all"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Bantuan Panitia SD IT</span>
              </a>
            </div>
          </div>
        )}

        {/* Bantuan CS Panitia SD IT */}
        <div className="mt-12 p-6 rounded-3xl bg-gradient-to-r from-emerald-900 to-[#00A651] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          <div>
            <span className="text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-white/20 text-emerald-100">
              Hotline Panitia SPMB SD IT
            </span>
            <h4 className="text-base sm:text-lg font-bold mt-2">
              Butuh bantuan verifikasi berkas atau jadwal observasi?
            </h4>
            <p className="text-xs text-emerald-100 mt-1 max-w-lg leading-relaxed">
              Tim panitia SPMB SD IT Al-Afiyah siap membantu Anda pada jam operasional Senin - Sabtu pukul 07.30 - 15.00 WIB.
            </p>
          </div>
          <a
            href="https://wa.me/6281310139001?text=Assalamu%27alaikum%20Admin%20SPMB%20SD%20IT%20Al-Afiyah,%20mohon%20bantuan%20terkait%20status%20pendaftaran%20ananda"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-emerald-900 font-bold text-xs sm:text-sm hover:bg-emerald-50 transition-all shadow-md shrink-0 active:scale-95"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>WhatsApp Panitia SD IT</span>
          </a>
        </div>
      </ScrollReveal>
      </main>

      <Footer schoolSlug="sd" />
      <StickyMobileBar schoolSlug="sd" />
    </div>
  );
}

export default function CheckStatusSdPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#00A651]" />
      </div>
    }>
      <CheckStatusSdContent />
    </Suspense>
  );
}
