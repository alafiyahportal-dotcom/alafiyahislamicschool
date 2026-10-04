'use client';

import React, { useState, useMemo } from 'react';
import {
  BookMarked,
  ChevronDown,
  Search,
  Download,
  Users,
  Award,
  FileText,
  Edit3,
  Save,
  RotateCcw,
} from 'lucide-react';

interface StudentRow {
  id: string;
  nis: string;
  fullName: string;
  classGrade: string;
  gender: string;
}

interface GradesManagerClientProps {
  schoolSlug: string;
  schoolName: string;
  schoolId: string;
  initialStudents: StudentRow[];
  availableClasses: string[];
}

// Subjects per unit level
const SUBJECTS: Record<string, string[]> = {
  tk: ['Al-Qur\'an & Tahfidz', 'Adab & Akhlak', 'Sains Lingkungan', 'Motorik & Seni', 'Bahasa & Literasi'],
  sd: ['PAI & Qur\'an', 'PPKn', 'Bahasa Indonesia', 'Matematika', 'IPAS', 'Bahasa Arab', 'Tahfidz Al-Qur\'an', 'PJOK', 'SBdP'],
  smp: ['PAI & Qur\'an', 'PPKn', 'Bahasa Indonesia', 'Matematika', 'IPA', 'IPS', 'Bahasa Inggris', 'Bahasa Arab', 'Tahfidz Al-Qur\'an', 'PJOK', 'Informatika'],
};

const GRADE_COLOR = (nilai: number) => {
  if (nilai >= 90) return 'text-emerald-700 font-black';
  if (nilai >= 80) return 'text-blue-700 font-bold';
  if (nilai >= 70) return 'text-amber-700 font-bold';
  return 'text-rose-700 font-bold';
};

export default function GradesManagerClient({
  schoolSlug,
  schoolName,
  initialStudents,
  availableClasses,
}: GradesManagerClientProps) {
  const [selectedClass, setSelectedClass] = useState(availableClasses[0] || '');
  const [selectedSemester, setSelectedSemester] = useState<'1' | '2'>('1');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'input' | 'rekap'>('input');

  const subjects = SUBJECTS[schoolSlug] || SUBJECTS.sd;

  // Initialize grades state: { studentId: { subject: nilai } }
  const [grades, setGrades] = useState<Record<string, Record<string, number>>>(() => {
    const init: Record<string, Record<string, number>> = {};
    initialStudents.forEach((s) => {
      init[s.id] = {};
      subjects.forEach((subj) => { init[s.id][subj] = 0; });
    });
    return init;
  });

  const filtered = useMemo(() => {
    return initialStudents.filter((s) => {
      const matchClass = !selectedClass || s.classGrade === selectedClass;
      const matchSearch = s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || s.nis.includes(searchQuery);
      return matchClass && matchSearch;
    });
  }, [initialStudents, selectedClass, searchQuery]);

  const handleGradeChange = (studentId: string, subject: string, val: string) => {
    const num = Math.min(100, Math.max(0, parseInt(val) || 0));
    setGrades((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], [subject]: num },
    }));
  };

  const getAverage = (studentId: string) => {
    const studentGrades = grades[studentId] || {};
    const vals = Object.values(studentGrades).filter((v) => v > 0);
    if (vals.length === 0) return 0;
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  };

  const getPredikat = (avg: number) => {
    if (avg >= 90) return { label: 'A (Sangat Baik)', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (avg >= 80) return { label: 'B (Baik)', color: 'text-blue-700 bg-blue-50 border-blue-200' };
    if (avg >= 70) return { label: 'C (Cukup)', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    return { label: 'D (Perlu Bimbingan)', color: 'text-rose-700 bg-rose-50 border-rose-200' };
  };

  return (
    <div className="space-y-5">
      {/* Header Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200">
              <BookMarked className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Nilai & Rapor Digital</h2>
              <p className="text-xs text-slate-500">{schoolName}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Semester */}
            <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
              {(['1', '2'] as const).map((sem) => (
                <button
                  key={sem}
                  onClick={() => setSelectedSemester(sem)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedSemester === sem
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Semester {sem}
                </button>
              ))}
            </div>

            {/* Class Filter */}
            <div className="relative">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-8 py-2 appearance-none focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 cursor-pointer"
              >
                {availableClasses.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>

            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors border border-slate-200">
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ekspor PDF</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-4 bg-slate-100 p-1 rounded-xl w-fit">
          {[
            { key: 'input', label: 'Input Nilai', icon: Edit3 },
            { key: 'rekap', label: 'Rekap Rapor', icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as 'input' | 'rekap')}
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

      {activeTab === 'input' ? (
        /* Input Nilai Table */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-bold text-slate-700">{filtered.length} Murid — {selectedClass}</span>
            </div>
            <div className="relative">
              <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-2 pointer-events-none" />
              <input
                type="text"
                placeholder="Cari murid..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg pl-7 pr-3 py-1.5 w-36 focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <BookMarked className="w-10 h-10 text-slate-200 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-400">Belum ada murid di kelas ini</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50/70">
                    <th className="text-left px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider sticky left-0 bg-slate-50 min-w-[160px]">Nama Murid</th>
                    {subjects.map((subj) => (
                      <th key={subj} className="text-center px-2 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider min-w-[70px]">
                        <span className="block truncate max-w-[60px] mx-auto" title={subj}>{subj.split(' ')[0]}</span>
                      </th>
                    ))}
                    <th className="text-center px-3 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider sticky right-0 bg-slate-50 min-w-[80px]">Rata-rata</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map((student) => {
                    const avg = getAverage(student.id);
                    return (
                      <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-2.5 sticky left-0 bg-white">
                          <p className="font-semibold text-slate-800 truncate max-w-[150px]">{student.fullName}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{student.nis}</p>
                        </td>
                        {subjects.map((subj) => (
                          <td key={subj} className="px-2 py-2.5 text-center">
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={grades[student.id]?.[subj] || ''}
                              onChange={(e) => handleGradeChange(student.id, subj, e.target.value)}
                              placeholder="—"
                              className="w-14 text-center text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-1 py-1 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                            />
                          </td>
                        ))}
                        <td className="px-3 py-2.5 text-center sticky right-0 bg-white">
                          <span className={`text-sm ${GRADE_COLOR(avg)}`}>{avg > 0 ? avg : '—'}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className="px-5 py-3 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center">
            <p className="text-[10px] text-slate-400">
              💡 Nilai tersimpan otomatis ke rapor digital murid di SIAKAD.
            </p>
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-xs">
              <Save className="w-3.5 h-3.5" />
              Simpan Nilai
            </button>
          </div>
        </div>
      ) : (
        /* Rekap Rapor View */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800">Rekap Rapor — {selectedClass} — Semester {selectedSemester}</h3>
            <p className="text-xs text-slate-400 mt-0.5">Ringkasan capaian akademik seluruh murid</p>
          </div>

          <div className="divide-y divide-slate-50">
            {filtered.map((student, idx) => {
              const avg = getAverage(student.id);
              const pred = getPredikat(avg);
              return (
                <div key={student.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-slate-300 w-5">{idx + 1}</span>
                    <div>
                      <p className="text-xs font-semibold text-slate-800">{student.fullName}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{student.nis}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-black ${avg >= 70 ? 'text-slate-800' : 'text-rose-600'}`}>
                      {avg > 0 ? avg : '—'}
                    </span>
                    <span className={`px-2 py-0.5 rounded-lg border text-[10px] font-bold ${pred.color}`}>
                      {pred.label}
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
