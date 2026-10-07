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
  Sparkles,
  ExternalLink,
  ChevronRight
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
      <section className="relative pt-24 pb-14 bg-gradient-to-b from-[#00A651]/10 via-emerald-50/40 to-slate-50 border-b border-emerald-100 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#00A651_1px,transparent_1px)] [background-size:20px_20px]" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          {/* Breadcrumb SD */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 border border-emerald-200/80 shadow-xs mb-4 text-xs font-medium text-emerald-800">
            <Link href="/sd" className="hover:underline">SD IT Al-Afiyah</Link>
            <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
            <Link href="/sd/spmb" className="hover:underline">SPMB Online</Link>
            <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-950 font-semibold">Lacak Status</span>
          </div>

          <div className="text-xs sm:text-sm font-arabic font-bold text-emerald-700 tracking-wider mb-2">
            مَدْرَسَةُ العَافِيَةِ الإبْتِدَائِيَّةِ الإسْلَامِيَّةِ
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
            Cek Status Pendaftaran <br className="hidden sm:inline" />
            <span className="text-[#00A651]">SD IT Al-Afiyah</span>
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Pantau perkembangan verifikasi berkas, jadwal observasi calon santri & wawancara orang tua secara transparan dan terpusat.
          </p>

          {/* Form Pencarian */}
          <form onSubmit={(e) => handleSearch(e)} className="mt-8 max-w-xl mx-auto">
            <div className="relative flex items-center shadow-lg rounded-2xl bg-white border-2 border-emerald-500/30 focus-within:border-emerald-500 transition-all p-1.5 sm:p-2">
              <Search className="w-5 h-5 text-emerald-600 ml-3 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="No. Registrasi (REG-SD-...) / Nama Murid / NIK..."
                className="w-full px-3 py-2 text-sm sm:text-base text-slate-800 bg-transparent placeholder-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 px-4 sm:px-6 py-2.5 sm:py-3 bg-[#00A651] hover:bg-[#008f45] text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-70 shrink-0"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Mencari...</span>
                  </>
                ) : (
                  <>
                    <span>Cari Data</span>
                    <ArrowRight className="w-4 h-4 hidden sm:inline" />
                  </>
                )}
              </button>
            </div>

            {errorMessage && (
              <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-rose-600 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </form>
        </div>
      </section>

      {/* Main Results Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* State: Belum Mencari */}
        {!hasSearched && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs text-center max-w-2xl mx-auto">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 flex items-center justify-center text-[#00A651] mb-4">
              <Sparkles className="w-7 h-7" />
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
              Tidak ada calon santri SD IT Al-Afiyah yang cocok dengan kata kunci &ldquo;<span className="font-semibold text-slate-800">{query}</span>&rdquo;.
            </p>
            <div className="mt-5 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-left text-xs text-slate-600 space-y-1.5">
              <p className="font-semibold text-slate-800">Tips Pencarian:</p>
              <p>• Masukkan Nomor Registrasi lengkap (contoh: <span className="font-mono font-medium">REG-SD-2026-0001</span>).</p>
              <p>• Atau ketik nama lengkap calon santri sesuai Akta Kelahiran.</p>
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
