'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
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
  HelpCircle
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

export default function CheckStatusPage() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResultItem[] | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || query.trim().length < 3) {
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
        body: JSON.stringify({ query: query.trim() }),
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
    // Jalankan pencarian otomatis
    setIsLoading(true);
    setErrorMessage('');
    setHasSearched(true);

    fetch('/api/ppdb/check-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: sampleQuery }),
    })
      .then((r) => r.json())
      .then((json) => {
        if (json.success) {
          setResults(json.data || []);
        } else {
          setErrorMessage(json.error || 'Data tidak ditemukan.');
          setResults([]);
        }
      })
      .catch(() => {
        setErrorMessage('Terjadi kendala jaringan.');
        setResults([]);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="min-h-screen soft-mesh-bg flex flex-col justify-between">
      <Navbar />

      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 my-auto">
        {/* Hero Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center text-xs font-bold text-[#184F48] uppercase tracking-wide bg-[#E8F3F1] px-3.5 py-1.5 rounded-full border border-[#2D7A70]/30 shadow-2xs mb-3">
            <span>Layanan Mandiri Pelacak Pendaftaran</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Lacak Status PPDB Online
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            Periksa progres berkas, jadwal tes observasi, dan pengumuman penerimaan murid baru Al-Afiyah tanpa perlu mengingat tautan portal.
          </p>
        </div>

        {/* Search Box Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Masukkan Kata Kunci Pencarian:
            </label>
            <div className="relative flex items-center">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Search className="w-5 h-5 text-[#2D7A70]" />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Nomor Registrasi (REG-...), NIK (16 digit), atau No. WhatsApp"
                className="w-full pl-12 pr-28 sm:pr-32 py-3.5 sm:py-4 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2D7A70]/30 focus:border-[#2D7A70] transition-all font-medium text-slate-900"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="absolute right-2 top-2 bottom-2 px-4 sm:px-6 rounded-xl bg-[#2D7A70] hover:bg-[#184F48] text-white text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5 disabled:opacity-70 cursor-pointer"
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
              <button
                type="button"
                onClick={() => handleQuickSearch('REG-SD-2026-0001')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 font-mono text-[11px] transition-colors border border-slate-200"
              >
                REG-SD-2026-0001
              </button>
              <button
                type="button"
                onClick={() => handleQuickSearch('Rayyan')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 text-[11px] transition-colors border border-slate-200"
              >
                Rayyan
              </button>
              <button
                type="button"
                onClick={() => handleQuickSearch('081234567890')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 font-mono text-[11px] transition-colors border border-slate-200"
              >
                081234567890
              </button>
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
        {hasSearched && results && (
          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h2 className="text-sm font-bold text-slate-900">
                Hasil Pencarian ({results.length} Murid Ditemukan)
              </h2>
              <span className="text-xs text-slate-500">
                Kata Kunci: <span className="font-mono font-bold text-slate-800">&quot;{query}&quot;</span>
              </span>
            </div>

            {results.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Data Pendaftaran Tidak Ditemukan
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  Pastikan Nomor Registrasi, NIK, atau Nomor WhatsApp yang dimasukkan sudah benar sesuai saat mengisi formulir PPDB.
                </p>
                <div className="pt-2">
                  <Link
                    href="/ppdb/daftar"
                    className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#2D7A70] hover:bg-[#184F48] text-white text-xs font-bold transition-colors"
                  >
                    <span>Daftar Murid Baru Sekarang</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {results.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 hover:border-[#2D7A70]/60 transition-all shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#E8F3F1] text-[#2D7A70] flex items-center justify-center font-bold text-lg shrink-0 mt-0.5 border border-[#2D7A70]/20">
                        {item.studentName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-extrabold text-slate-900">
                            {item.studentName}
                          </h3>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F3F1] text-[#2D7A70] border border-[#2D7A70]/30">
                            {item.schoolBadge}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-1">
                          <span className="font-mono text-slate-700">
                            No. Reg: <strong className="text-slate-900">{item.registrationNo}</strong>
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
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#2D7A70] hover:bg-[#184F48] text-white text-xs font-bold shrink-0 transition-colors flex items-center justify-center space-x-1.5 shadow-xs"
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

        {/* Assistance / FAQ Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3 text-xs text-slate-600">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block">Butuh Bantuan Panitia PPDB?</span>
              <span>Hubungi layanan konsultasi WhatsApp resmi panitia penerimaan Yayasan Imam Bonjol.</span>
            </div>
          </div>
          <a
            href="https://wa.me/6281234567890?text=Assalamu%27alaikum%20Panitia%20PPDB%20Al-Afiyah,%20saya%20ingin%20menanyakan%20status%20pendaftaran%20ananda"
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shrink-0 transition-colors flex items-center justify-center space-x-1.5 shadow-2xs"
          >
            <span>Hubungi Panitia WhatsApp</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
