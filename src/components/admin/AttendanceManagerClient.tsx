'use client';

import React, { useState, useMemo } from 'react';
import {
  CalendarDays,
  CheckCircle2,
  XCircle,
  Clock,
  Stethoscope,
  ChevronDown,
  Search,
  Download,
  Users,
  BarChart3,
  Filter,
} from 'lucide-react';

interface StudentRow {
  id: string;
  nis: string;
  fullName: string;
  classGrade: string;
  gender: string;
}

interface AttendanceManagerClientProps {
  schoolSlug: string;
  schoolName: string;
  schoolId: string;
  initialStudents: StudentRow[];
}

type AttendanceStatus = 'HADIR' | 'IZIN' | 'SAKIT' | 'ALFA';

const STATUS_CONFIG: Record<AttendanceStatus, {
  label: string;
  color: string;
  bg: string;
  border: string;
  icon: React.ElementType;
}> = {
  HADIR:  { label: 'Hadir',  color: 'text-emerald-700', bg: 'bg-emerald-50',  border: 'border-emerald-300', icon: CheckCircle2 },
  IZIN:   { label: 'Izin',   color: 'text-blue-700',    bg: 'bg-blue-50',     border: 'border-blue-300',    icon: Clock },
  SAKIT:  { label: 'Sakit',  color: 'text-amber-700',   bg: 'bg-amber-50',    border: 'border-amber-300',   icon: Stethoscope },
  ALFA:   { label: 'Alfa',   color: 'text-rose-700',    bg: 'bg-rose-50',     border: 'border-rose-300',    icon: XCircle },
};

export default function AttendanceManagerClient({
  schoolSlug,
  schoolName,
  initialStudents,
}: AttendanceManagerClientProps) {
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedClass, setSelectedClass] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>(() => {
    // Default semua murid HADIR
    const init: Record<string, AttendanceStatus> = {};
    initialStudents.forEach((s) => { init[s.id] = 'HADIR'; });
    return init;
  });
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Unique class grades
  const classes = useMemo(() => {
    const all = Array.from(new Set(initialStudents.map((s) => s.classGrade))).sort();
    return ['ALL', ...all];
  }, [initialStudents]);

  // Filtered students
  const filtered = useMemo(() => {
    return initialStudents.filter((s) => {
      const matchClass = selectedClass === 'ALL' || s.classGrade === selectedClass;
      const matchSearch = s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.nis.includes(searchQuery);
      return matchClass && matchSearch;
    });
  }, [initialStudents, selectedClass, searchQuery]);

  // Summary stats
  const stats = useMemo(() => {
    const counts = { HADIR: 0, IZIN: 0, SAKIT: 0, ALFA: 0 };
    filtered.forEach((s) => {
      counts[attendance[s.id] || 'HADIR']++;
    });
    return counts;
  }, [filtered, attendance]);

  const handleSetStatus = (studentId: string, status: AttendanceStatus) => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleSetAll = (status: AttendanceStatus) => {
    const updated: Record<string, AttendanceStatus> = { ...attendance };
    filtered.forEach((s) => { updated[s.id] = status; });
    setAttendance(updated);
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save (will connect to API when Attendance table is added to schema)
    await new Promise((r) => setTimeout(r, 800));
    setIsSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-5">
      {/* Header Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
              <CalendarDays className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Input Presensi Harian</h2>
              <p className="text-xs text-slate-500">{schoolName}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Date Picker */}
            <input
              type="date"
              value={selectedDate}
              max={today}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 cursor-pointer"
            />

            {/* Class Filter */}
            <div className="relative">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-8 py-2 appearance-none focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 cursor-pointer"
              >
                {classes.map((c) => (
                  <option key={c} value={c}>{c === 'ALL' ? 'Semua Kelas' : c}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                savedSuccess
                  ? 'bg-emerald-500 text-white'
                  : 'bg-[#059669] hover:bg-emerald-700 text-white'
              } disabled:opacity-60`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              {isSaving ? 'Menyimpan...' : savedSuccess ? 'Tersimpan!' : 'Simpan Presensi'}
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(Object.entries(STATUS_CONFIG) as [AttendanceStatus, typeof STATUS_CONFIG[AttendanceStatus]][]).map(([status, cfg]) => {
          const Icon = cfg.icon;
          return (
            <div key={status} className={`bg-white rounded-2xl border ${cfg.border} p-4 flex items-center gap-3 shadow-xs`}>
              <div className={`p-2.5 rounded-xl ${cfg.bg}`}>
                <Icon className={`w-4 h-4 ${cfg.color}`} />
              </div>
              <div>
                <p className="text-xl font-black text-slate-900">{stats[status]}</p>
                <p className={`text-[11px] font-bold ${cfg.color}`}>{cfg.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Student Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Header */}
        <div className="px-4 sm:px-5 py-3.5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-700">
              {filtered.length} Murid {selectedClass !== 'ALL' ? `— ${selectedClass}` : ''}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Set All Buttons */}
            <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">Atur semua:</span>
            {(['HADIR', 'ALFA'] as AttendanceStatus[]).map((s) => {
              const cfg = STATUS_CONFIG[s];
              return (
                <button
                  key={s}
                  onClick={() => handleSetAll(s)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${cfg.bg} ${cfg.color} ${cfg.border} hover:opacity-80 transition-opacity`}
                >
                  Semua {cfg.label}
                </button>
              );
            })}

            {/* Search */}
            <div className="relative">
              <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-2 pointer-events-none" />
              <input
                type="text"
                placeholder="Cari nama / NIS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg pl-7 pr-3 py-1.5 w-36 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
              />
            </div>
          </div>
        </div>

        {/* Empty state */}
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Users className="w-10 h-10 text-slate-200 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-400">Belum ada murid aktif terdaftar</p>
            <p className="text-xs text-slate-300 mt-1">Tambahkan murid di menu Buku Induk Murid</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {/* Column headers */}
            <div className="grid grid-cols-[auto_1fr_auto] sm:grid-cols-[3rem_2fr_1fr_auto] gap-3 px-4 sm:px-5 py-2.5 bg-slate-50/70">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider hidden sm:block">#</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nama Murid</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider hidden sm:block">Kelas</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</span>
            </div>

            {filtered.map((student, idx) => {
              const currentStatus = attendance[student.id] || 'HADIR';
              return (
                <div
                  key={student.id}
                  className="grid grid-cols-[auto_1fr_auto] sm:grid-cols-[3rem_2fr_1fr_auto] gap-3 px-4 sm:px-5 py-3 items-center hover:bg-slate-50/50 transition-colors"
                >
                  <span className="text-xs text-slate-400 font-mono hidden sm:block">{String(idx + 1).padStart(2, '0')}</span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-900 truncate">{student.fullName}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{student.nis}</p>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium hidden sm:block truncate">{student.classGrade}</span>

                  {/* Status Toggle Buttons */}
                  <div className="flex gap-1">
                    {(Object.entries(STATUS_CONFIG) as [AttendanceStatus, typeof STATUS_CONFIG[AttendanceStatus]][]).map(([status, cfg]) => {
                      const Icon = cfg.icon;
                      const isActive = currentStatus === status;
                      return (
                        <button
                          key={status}
                          onClick={() => handleSetStatus(student.id, status)}
                          title={cfg.label}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all border text-[10px] font-bold ${
                            isActive
                              ? `${cfg.bg} ${cfg.color} ${cfg.border} shadow-xs`
                              : 'bg-white text-slate-300 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer note */}
        <div className="px-5 py-3 bg-slate-50/50 border-t border-slate-100">
          <p className="text-[10px] text-slate-400">
            💡 Data presensi akan tersinkronisasi ke SIAKAD murid secara otomatis setelah fitur penyimpanan database aktif.
          </p>
        </div>
      </div>
    </div>
  );
}
