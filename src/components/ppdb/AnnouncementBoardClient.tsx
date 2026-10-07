'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Search,
  CheckCircle2,
  Trophy,
  School,
  ExternalLink,
  Copy,
  Check,
  Calendar,
  ChevronRight,
  ShieldCheck,
  FileText,
  CreditCard,
  MessageCircle,
  HelpCircle,
  X
} from 'lucide-react';

export interface AcceptedStudent {
  id: string;
  registrationNo: string;
  studentName: string;
  gender: string;
  pob: string;
  schoolSlug: string;
  schoolName: string;
  schoolBadge: string;
  waveName: string;
  track: string;
  programType: string | null;
  acceptedDate: string;
}

export interface SchoolInfo {
  id: string;
  slug: string;
  name: string;
  badgeText: string;
  quota: number;
  waveName: string;
  primaryColor: string;
  accentColor: string;
}

interface AnnouncementBoardClientProps {
  initialData: AcceptedStudent[];
  initialStats: {
    totalAccepted: number;
    tkCount: number;
    sdCount: number;
    smpCount: number;
  };
  schools: SchoolInfo[];
  schoolSlug?: string;
}

export default function AnnouncementBoardClient({
  initialData,
  initialStats,
  schools,
  schoolSlug,
}: AnnouncementBoardClientProps) {
  const isSd = schoolSlug === 'sd';
  const [activeUnit, setActiveUnit] = useState<string>(schoolSlug || 'all');
  const [activeTrack, setActiveTrack] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedNo, setCopiedNo] = useState<string | null>(null);

  const handleCopy = (regNo: string) => {
    navigator.clipboard.writeText(regNo);
    setCopiedNo(regNo);
    setTimeout(() => setCopiedNo(null), 2000);
  };

  // Filter murid berdasarkan tab unit, jalur, dan query pencarian
  const filteredStudents = useMemo(() => {
    return initialData.filter((s) => {
      const matchUnit = activeUnit === 'all' || s.schoolSlug === activeUnit;
      const matchTrack =
        activeTrack === 'all' ||
        s.track.toLowerCase().includes(activeTrack.toLowerCase());
      const matchQuery =
        searchQuery.trim() === '' ||
        s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.registrationNo.toLowerCase().includes(searchQuery.toLowerCase());

      return matchUnit && matchTrack && matchQuery;
    });
  }, [initialData, activeUnit, activeTrack, searchQuery]);

  const getUnitBadgeStyle = (slug: string) => {
    switch (slug) {
      case 'tk':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'sd':
        return 'bg-[#E8F8F0] text-[#00A651] border-[#A7F3D0]';
      case 'smp':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F3F9F8] via-[#F8FAFC] to-white pb-24">
      {/* Top Banner Hero */}
      <section className={`relative overflow-hidden ${
        isSd
          ? 'bg-gradient-to-br from-[#008f45] via-[#00A651] to-[#007036]'
          : 'bg-gradient-to-br from-[#184F48] via-[#1E5D55] to-[#2D7A70]'
      } text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8`}>
        {/* Subtle Decorative Background Circles */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 -mb-20 w-80 h-80 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          {isSd && (
            <p className="font-arabic text-xl sm:text-2xl text-amber-300 mb-2 drop-shadow-sm">
              مَدْرَسَةُ العَافِيَةِ الإبْتِدَائِيَّةِ الإسْلَامِيَّةِ
            </p>
          )}
          <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-amber-300 mb-4">
            <span>{isSd ? 'Pengumuman Kelulusan SPMB SD IT Al-Afiyah TA 2027/2028' : 'Pengumuman Kelulusan Resmi TA 2027/2028'}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
            {isSd ? 'Papan Hasil Seleksi SPMB SD IT Al-Afiyah' : 'Papan Hasil Seleksi PPDB Terpadu'}
          </h1>
          <p className="max-w-3xl mx-auto text-sm sm:text-base text-[#D4EBE7] leading-relaxed">
            {isSd
              ? 'Selamat kepada para calon murid baru yang telah dinyatakan lolos observasi & tes wawancara nabawiyah di SD IT Al-Afiyah Majalengka.'
              : 'Selamat kepada para calon murid baru yang telah dinyatakan lolos observasi & wawancara di Yayasan Pendidikan Imam Bonjol Majalengka (TK IT, SD IT, & SMP IT Al-Afiyah).'}
          </p>

          {/* Quick Action Navigation Buttons */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={isSd ? '/ppdb/cek-status?school=sd' : '/ppdb/cek-status'}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white text-[#00A651] font-bold text-xs sm:text-sm hover:bg-[#E8F8F0] transition shadow-md"
            >
              <Search className="w-4 h-4 text-[#00A651]" />
              <span>Cek Status Pribadi via NIK / WA</span>
            </Link>
            <Link
              href={isSd ? '/ppdb/daftar?school=sd' : '/ppdb/daftar'}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold text-xs sm:text-sm transition"
            >
              <ChevronRight className="w-4 h-4" />
              <span>Alur &amp; Pendaftaran SPMB SD IT</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        
        {/* KPI Summary Cards */}
        {isSd ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-8 max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-emerald-200/80 flex items-center space-x-3.5"
            >
              <div className="w-12 h-12 rounded-xl bg-[#E8F8F0] text-[#00A651] flex items-center justify-center font-bold flex-shrink-0">
                <Trophy className="w-6 h-6 text-[#00A651]" />
              </div>
              <div>
                <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Murid Diterima SD IT
                </p>
                <p className="text-xl sm:text-2xl font-black text-slate-900">
                  {initialStats.sdCount}{' '}
                  <span className="text-xs font-medium text-slate-400">Murid Lolos</span>
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-[#A7F3D0] flex items-center space-x-3.5"
            >
              <div className="w-12 h-12 rounded-xl bg-[#E8F8F0] text-[#00A651] flex items-center justify-center font-bold flex-shrink-0">
                <School className="w-6 h-6 text-[#00A651]" />
              </div>
              <div>
                <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-emerald-800">
                  Target Kuota SD IT
                </p>
                <p className="text-xl sm:text-2xl font-black text-slate-900">
                  60 Kuota <span className="text-xs font-medium text-emerald-600">(2 Rombel)</span>
                </p>
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
            {/* Card Total */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200/80 flex items-center space-x-3.5"
            >
              <div className="w-12 h-12 rounded-xl bg-[#E8F3F1] text-[#184F48] flex items-center justify-center font-bold flex-shrink-0">
                <Trophy className="w-6 h-6 text-[#2D7A70]" />
              </div>
              <div>
                <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Total Murid Lolos
                </p>
                <p className="text-xl sm:text-2xl font-black text-slate-900">
                  {initialStats.totalAccepted}{' '}
                  <span className="text-xs font-medium text-slate-400">Murid</span>
                </p>
              </div>
            </motion.div>

            {/* Card TK */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-amber-200/80 flex items-center space-x-3.5"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold flex-shrink-0">
                <span className="text-sm font-black">TK</span>
              </div>
              <div>
                <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-amber-800">
                  TK IT Al-Afiyah
                </p>
                <p className="text-xl sm:text-2xl font-black text-slate-900">
                  {initialStats.tkCount}{' '}
                  <span className="text-xs font-medium text-slate-400">/ 50 Kuota</span>
                </p>
              </div>
            </motion.div>

            {/* Card SD */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-teal-200/80 flex items-center space-x-3.5"
            >
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold flex-shrink-0">
                <span className="text-sm font-black">SD</span>
              </div>
              <div>
                <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-teal-800">
                  SD IT Al-Afiyah
                </p>
                <p className="text-xl sm:text-2xl font-black text-slate-900">
                  {initialStats.sdCount}{' '}
                  <span className="text-xs font-medium text-slate-400">/ 60 Kuota</span>
                </p>
              </div>
            </motion.div>

            {/* Card SMP */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
              className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-emerald-200/80 flex items-center space-x-3.5"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold flex-shrink-0">
                <span className="text-sm font-black">SMP</span>
              </div>
              <div>
                <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-emerald-800">
                  SMP IT Al-Afiyah
                </p>
                <p className="text-xl sm:text-2xl font-black text-slate-900">
                  {initialStats.smpCount}{' '}
                  <span className="text-xs font-medium text-slate-400">/ 75 Kuota</span>
                </p>
              </div>
            </motion.div>
          </div>
        )}

        {/* Filter & Search Bar Container */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200/80 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Unit Selector Tabs - Only shown when NOT locked to SD IT */}
            {!isSd && (
              <div className="flex items-center space-x-1.5 p-1 bg-slate-100/80 rounded-xl overflow-x-auto">
                <button
                  onClick={() => setActiveUnit('all')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                    activeUnit === 'all'
                      ? 'bg-white text-[#184F48] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Semua Unit ({initialStats.totalAccepted})
                </button>
                <button
                  onClick={() => setActiveUnit('tk')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                    activeUnit === 'tk'
                      ? 'bg-white text-amber-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  TK IT ({initialStats.tkCount})
                </button>
                <button
                  onClick={() => setActiveUnit('sd')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                    activeUnit === 'sd'
                      ? 'bg-white text-teal-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  SD IT ({initialStats.sdCount})
                </button>
                <button
                  onClick={() => setActiveUnit('smp')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                    activeUnit === 'smp'
                      ? 'bg-white text-emerald-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  SMP IT ({initialStats.smpCount})
                </button>
              </div>
            )}

            {/* Instant Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama murid atau no. registrasi..."
                className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2D7A70] focus:border-transparent transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Secondary Track Filter Pills */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Jalur Masuk:</span>
            {['all', 'Reguler', 'Tahfidz', 'Beasiswa'].map((t) => (
              <button
                key={t}
                onClick={() => setActiveTrack(t)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition ${
                  activeTrack === t
                    ? 'bg-[#184F48] text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t === 'all' ? 'Semua Jalur' : t}
              </button>
            ))}
          </div>
        </div>

        {/* Results List Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden mb-12">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h2 className="font-bold text-slate-900 text-sm sm:text-base">
                Daftar Murid Diterima Resmi
              </h2>
              <span className="text-xs text-slate-500 font-normal">
                ({filteredStudents.length} Murid Ditemukan)
              </span>
            </div>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              Data Resmi Panitia PPDB Yayasan Imam Bonjol
            </span>
          </div>

          {filteredStudents.length === 0 ? (
            <div className="py-16 px-4 text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Tidak ada data murid yang sesuai
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
                Coba ubah kata kunci pencarian, nomor registrasi, atau reset filter unit sekolah untuk melihat seluruh murid.
              </p>
              <button
                onClick={() => {
                  setActiveUnit('all');
                  setActiveTrack('all');
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-xl bg-[#2D7A70] text-white text-xs font-semibold hover:bg-[#184F48] transition"
              >
                Reset Semua Filter
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4 w-12 text-center">No</th>
                    <th className="py-3.5 px-4">No. Registrasi</th>
                    <th className="py-3.5 px-4">Nama Calon Murid</th>
                    <th className="py-3.5 px-4">Unit Sekolah</th>
                    <th className="py-3.5 px-4">Jalur & Program</th>
                    <th className="py-3.5 px-4 text-center">Status Kelulusan</th>
                    <th className="py-3.5 px-4 text-right">Aksi Dokumen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map((student, index) => (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* No */}
                      <td className="py-3.5 px-4 text-center text-slate-400 font-medium">
                        {index + 1}
                      </td>

                      {/* No Registrasi */}
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        <div className="flex items-center space-x-1.5">
                          <span>{student.registrationNo}</span>
                          <button
                            onClick={() => handleCopy(student.registrationNo)}
                            title="Salin No. Registrasi"
                            className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-100 transition"
                          >
                            {copiedNo === student.registrationNo ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Nama Murid */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">
                          {student.studentName}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {student.gender === 'L' ? 'Laki-laki (Ikhwan)' : 'Perempuan (Akhwat)'} • {student.pob}
                        </div>
                      </td>

                      {/* Unit Sekolah */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${getUnitBadgeStyle(
                            student.schoolSlug
                          )}`}
                        >
                          {student.schoolBadge}
                        </span>
                      </td>

                      {/* Jalur & Program */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800 text-xs">
                          {student.track}
                        </div>
                        {student.programType && (
                          <div className="text-[11px] text-slate-400">
                            {student.programType}
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>DITERIMA</span>
                        </span>
                      </td>

                      {/* Aksi */}
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/portal/ppdb/${student.registrationNo}`}
                          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#184F48] hover:bg-[#2D7A70] text-white text-xs font-semibold shadow-2xs transition"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Buka Portal & SK</span>
                          <ExternalLink className="w-3 h-3 opacity-70" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Next Steps & Re-Registration Notice */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-white to-[#F8FAFC] p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold mb-4">
              <FileText className="w-5 h-5 text-emerald-700" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base mb-2">
              1. Unduh Dokumen Resmi
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Buka portal murid dengan mengklik nomor registrasi Anda. Unduh Surat Keputusan (SK) Kelulusan berstempel resmi dan Kartu Tanda Murid (KTM) Digital standar ISO.
            </p>
          </div>

          <div className="bg-gradient-to-br from-white to-[#F8FAFC] p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold mb-4">
              <CreditCard className="w-5 h-5 text-teal-700" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base mb-2">
              2. Daftar Ulang & Seragam
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Lakukan penyelesaian biaya daftar ulang dan pengukuran seragam di kantor tata usaha unit sekolah masing-masing pada tanggal 1 s/d 10 Oktober 2026.
            </p>
          </div>

          <div className="bg-gradient-to-br from-white to-[#F8FAFC] p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold mb-4">
              <Calendar className="w-5 h-5 text-amber-700" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base mb-2">
              3. Silaturahmi Wali Murid
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pertemuan akbar orang tua/wali murid baru dan Stadium Generale bersama Mudir Yayasan & Kepala Sekolah dijadwalkan pada hari Ahad, 18 Oktober 2026.
            </p>
          </div>
        </div>

        {/* Need Help Banner */}
        <div className={`rounded-2xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md ${
          isSd ? 'bg-gradient-to-r from-[#00A651] to-[#008f45]' : 'bg-gradient-to-r from-[#184F48] to-[#2D7A70]'
        }`}>
          <div className="space-y-1.5 text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-black">
              Nomor Registrasi Anda Belum Tercantum?
            </h3>
            <p className="text-xs sm:text-sm text-[#D4EBE7] max-w-xl">
              Murid yang berkasnya masih dalam proses peninjauan atau observasi susulan dapat memantau status terkini melalui halaman Pelacak Status PPDB.
            </p>
          </div>
          <div className="flex items-center space-x-3 flex-shrink-0">
            <Link
              href={isSd ? '/ppdb/cek-status?school=sd' : '/ppdb/cek-status'}
              className={`px-4 py-2.5 rounded-xl bg-white ${isSd ? 'text-[#00A651] hover:bg-[#E8F8F0]' : 'text-[#184F48] hover:bg-[#E8F3F1]'} text-xs sm:text-sm font-bold transition shadow-xs`}
            >
              Cek Status Pribadi
            </Link>
          </div>
        </div>

      </main>
    </div>
  );
}
