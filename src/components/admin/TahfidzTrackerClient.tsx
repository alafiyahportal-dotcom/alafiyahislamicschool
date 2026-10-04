'use client';

import React, { useState, useMemo } from 'react';
import {
  ScrollText,
  ChevronDown,
  Search,
  Star,
  Target,
  TrendingUp,
  Users,
  BookOpen,
  Save,
  ChevronRight,
  Award,
} from 'lucide-react';

interface StudentRow {
  id: string;
  nis: string;
  fullName: string;
  classGrade: string;
  gender: string;
}

interface MusyrifRow {
  id: string;
  name: string;
  role: string;
}

interface TahfidzTrackerClientProps {
  schoolSlug: string;
  schoolName: string;
  schoolId: string;
  initialStudents: StudentRow[];
  musyrifList: MusyrifRow[];
}

// Juz list for reference
const JUZ_LIST = Array.from({ length: 30 }, (_, i) => `Juz ${i + 1}`);

// Surah names (short list for display)
const SURAH_PENDEK = [
  'An-Nas', 'Al-Falaq', 'Al-Ikhlas', 'Al-Masad', 'An-Nasr',
  'Al-Kafirun', 'Al-Kautsar', 'Al-Ma\'un', 'Al-Quraish', 'Al-Fil',
  'Al-Humazah', 'Al-Asr', 'At-Takasur', 'Al-Qari\'ah', 'Al-Adiyat',
  'Az-Zalzalah', 'Al-Bayyinah', 'Al-Qadr', 'Al-Alaq', 'At-Tin',
  'Ad-Dhuha', 'Al-Lail', 'Asy-Syams', 'Al-Balad', 'Al-Fajr',
];

const STATUS_HAFALAN = ['Belum Mulai', 'Sedang Hafalan', 'Murajaah', 'Selesai / Mutqin'];
const STATUS_COLOR: Record<string, string> = {
  'Belum Mulai': 'bg-slate-100 text-slate-500 border-slate-200',
  'Sedang Hafalan': 'bg-amber-50 text-amber-700 border-amber-200',
  'Murajaah': 'bg-blue-50 text-blue-700 border-blue-200',
  'Selesai / Mutqin': 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

interface TahfidzEntry {
  currentJuz: string;
  currentSurah: string;
  totalHalaman: number;
  status: string;
  musyrifId: string;
  catatan: string;
  lastUpdated: string;
}

export default function TahfidzTrackerClient({
  schoolSlug,
  schoolName,
  initialStudents,
  musyrifList,
}: TahfidzTrackerClientProps) {
  const [selectedClass, setSelectedClass] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'tracker' | 'leaderboard'>('tracker');
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);

  // Initialize tahfidz data per student
  const [tahfidzData, setTahfidzData] = useState<Record<string, TahfidzEntry>>(() => {
    const init: Record<string, TahfidzEntry> = {};
    initialStudents.forEach((s, i) => {
      init[s.id] = {
        currentJuz: JUZ_LIST[Math.min(i % 10, 29)],
        currentSurah: SURAH_PENDEK[i % SURAH_PENDEK.length],
        totalHalaman: (i % 15) * 5 + 10,
        status: STATUS_HAFALAN[(i % 4)],
        musyrifId: musyrifList[0]?.id || '',
        catatan: '',
        lastUpdated: new Date().toLocaleDateString('id-ID'),
      };
    });
    return init;
  });

  const classes = useMemo(() => {
    const all = Array.from(new Set(initialStudents.map((s) => s.classGrade))).sort();
    return ['ALL', ...all];
  }, [initialStudents]);

  const filtered = useMemo(() => {
    return initialStudents.filter((s) => {
      const matchClass = selectedClass === 'ALL' || s.classGrade === selectedClass;
      const matchSearch = s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || s.nis.includes(searchQuery);
      return matchClass && matchSearch;
    });
  }, [initialStudents, selectedClass, searchQuery]);

  const updateEntry = (studentId: string, field: keyof TahfidzEntry, value: string | number) => {
    setTahfidzData((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value,
        lastUpdated: new Date().toLocaleDateString('id-ID'),
      },
    }));
  };

  // Summary stats
  const stats = useMemo(() => {
    const total = filtered.length;
    const mutqin = filtered.filter((s) => tahfidzData[s.id]?.status === 'Selesai / Mutqin').length;
    const aktif = filtered.filter((s) => tahfidzData[s.id]?.status === 'Sedang Hafalan').length;
    const avgHalaman = total > 0
      ? Math.round(filtered.reduce((sum, s) => sum + (tahfidzData[s.id]?.totalHalaman || 0), 0) / total)
      : 0;
    return { total, mutqin, aktif, avgHalaman };
  }, [filtered, tahfidzData]);

  // Leaderboard: sort by totalHalaman
  const leaderboard = useMemo(() => {
    return [...filtered].sort((a, b) =>
      (tahfidzData[b.id]?.totalHalaman || 0) - (tahfidzData[a.id]?.totalHalaman || 0)
    ).slice(0, 10);
  }, [filtered, tahfidzData]);

  return (
    <div className="space-y-5">
      {/* Header Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200">
              <ScrollText className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Mutaba&apos;ah & Tracker Tahfidz</h2>
              <p className="text-xs text-slate-500">{schoolName}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-8 py-2 appearance-none focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 cursor-pointer"
              >
                {classes.map((c) => (
                  <option key={c} value={c}>{c === 'ALL' ? 'Semua Kelas' : c}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-4 bg-slate-100 p-1 rounded-xl w-fit">
          {[
            { key: 'tracker', label: 'Input Mutabaah', icon: BookOpen },
            { key: 'leaderboard', label: 'Papan Hafalan', icon: Award },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as 'tracker' | 'leaderboard')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === tab.key
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: Users, label: 'Total Murid', value: stats.total, color: 'text-slate-700', bg: 'bg-slate-50', border: 'border-slate-200' },
          { icon: Star, label: 'Mutqin / Selesai', value: stats.mutqin, color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
          { icon: TrendingUp, label: 'Aktif Hafalan', value: stats.aktif, color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
          { icon: Target, label: 'Rata-rata Halaman', value: stats.avgHalaman, color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' },
        ].map(({ icon: Icon, label, value, color, bg, border }) => (
          <div key={label} className={`bg-white rounded-2xl border ${border} p-4 flex items-center gap-3 shadow-xs`}>
            <div className={`p-2.5 rounded-xl ${bg}`}>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <div>
              <p className="text-xl font-black text-slate-900">{value}</p>
              <p className={`text-[11px] font-bold ${color}`}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      {activeTab === 'tracker' ? (
        /* Mutabaah Tracker List */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-bold text-slate-700">{filtered.length} Murid</span>
            </div>
            <div className="relative">
              <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-2 pointer-events-none" />
              <input
                type="text"
                placeholder="Cari murid..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg pl-7 pr-3 py-1.5 w-36 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <ScrollText className="w-10 h-10 text-slate-200 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-400">Belum ada murid aktif</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {filtered.map((student) => {
                const entry = tahfidzData[student.id];
                const isExpanded = expandedStudent === student.id;
                return (
                  <div key={student.id}>
                    <button
                      onClick={() => setExpandedStudent(isExpanded ? null : student.id)}
                      className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-slate-50/50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center flex-shrink-0">
                          <BookOpen className="w-4 h-4 text-amber-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-800 truncate">{student.fullName}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{student.nis} • {student.classGrade}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                        <span className={`px-2 py-0.5 rounded-lg border text-[10px] font-bold ${STATUS_COLOR[entry?.status] || ''}`}>
                          {entry?.status || 'Belum Mulai'}
                        </span>
                        <span className="text-[10px] text-slate-500 font-bold hidden sm:block">{entry?.currentJuz}</span>
                        <ChevronRight className={`w-4 h-4 text-slate-300 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="bg-amber-50/30 border-t border-amber-100 px-5 py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Juz Saat Ini */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Juz Saat Ini</label>
                          <div className="relative">
                            <select
                              value={entry?.currentJuz || ''}
                              onChange={(e) => updateEntry(student.id, 'currentJuz', e.target.value)}
                              className="w-full text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl px-3 py-2 pr-8 appearance-none focus:outline-none focus:border-amber-400"
                            >
                              {JUZ_LIST.map((j) => <option key={j} value={j}>{j}</option>)}
                            </select>
                            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                          </div>
                        </div>

                        {/* Total Halaman */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Halaman Hafal</label>
                          <input
                            type="number"
                            min={0}
                            max={604}
                            value={entry?.totalHalaman || 0}
                            onChange={(e) => updateEntry(student.id, 'totalHalaman', parseInt(e.target.value) || 0)}
                            className="w-full text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        {/* Status */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status Hafalan</label>
                          <div className="relative">
                            <select
                              value={entry?.status || ''}
                              onChange={(e) => updateEntry(student.id, 'status', e.target.value)}
                              className="w-full text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl px-3 py-2 pr-8 appearance-none focus:outline-none focus:border-amber-400"
                            >
                              {STATUS_HAFALAN.map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                          </div>
                        </div>

                        {/* Musyrif */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Musyrif / Musyrifah</label>
                          <div className="relative">
                            <select
                              value={entry?.musyrifId || ''}
                              onChange={(e) => updateEntry(student.id, 'musyrifId', e.target.value)}
                              className="w-full text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl px-3 py-2 pr-8 appearance-none focus:outline-none focus:border-amber-400"
                            >
                              <option value="">— Pilih Musyrif —</option>
                              {musyrifList.map((m) => (
                                <option key={m.id} value={m.id}>{m.name}</option>
                              ))}
                            </select>
                            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                          </div>
                        </div>

                        {/* Catatan */}
                        <div className="space-y-1.5 sm:col-span-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Catatan Musyrif</label>
                          <textarea
                            rows={2}
                            value={entry?.catatan || ''}
                            onChange={(e) => updateEntry(student.id, 'catatan', e.target.value)}
                            placeholder="Catatan tambahan perkembangan tahfidz..."
                            className="w-full text-xs text-slate-700 bg-white border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-400 resize-none"
                          />
                        </div>

                        {/* Save */}
                        <div className="flex items-end sm:col-span-3">
                          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-colors shadow-xs ml-auto">
                            <Save className="w-3.5 h-3.5" />
                            Simpan Progress
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Leaderboard */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800">🏆 Top 10 — Papan Hafalan</h3>
            <p className="text-xs text-slate-400 mt-0.5">Diurutkan berdasarkan total halaman hafalan terbanyak</p>
          </div>
          <div className="divide-y divide-slate-50">
            {leaderboard.map((student, idx) => {
              const entry = tahfidzData[student.id];
              const medals = ['🥇', '🥈', '🥉'];
              return (
                <div key={student.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-base w-6 text-center">{medals[idx] || `${idx + 1}`}</span>
                    <div>
                      <p className="text-xs font-semibold text-slate-800">{student.fullName}</p>
                      <p className="text-[10px] text-slate-400">{student.classGrade} • {entry?.currentJuz}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="text-sm font-black text-amber-600">{entry?.totalHalaman}</p>
                      <p className="text-[9px] text-slate-400 font-medium">halaman</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-lg border text-[10px] font-bold ${STATUS_COLOR[entry?.status] || ''}`}>
                      {entry?.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
