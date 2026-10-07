'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Download,
  ExternalLink,
  Search,
  School,
  GraduationCap,
  BookOpen,
  Users,
  CalendarDays,
  Layers,
  X,
  Share2,
  CheckCircle2,
  Compass,
  AlertCircle,
} from 'lucide-react';
import type { AcademicEvent } from '@/app/api/agenda/route';

interface AgendaCalendarClientProps {
  initialEvents: AcademicEvent[];
  schoolSlug?: string;
}

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const DAY_NAMES = ['Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', "Jum'at", 'Sabtu'];

export default function AgendaCalendarClient({ initialEvents, schoolSlug }: AgendaCalendarClientProps) {
  const isSd = schoolSlug === 'sd';
  // Calendar state - Default to September 2026 (active academic/PPDB month in sample data)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(8); // 8 is September (0-indexed)
  const [selectedUnit, setSelectedUnit] = useState<string>(isSd ? 'sd' : 'all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState<'grid' | 'timeline'>('grid');
  const [activeEventModal, setActiveEventModal] = useState<AcademicEvent | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Filter events based on filters & search
  const filteredEvents = useMemo(() => {
    return initialEvents.filter((evt) => {
      const matchUnit =
        selectedUnit === 'all' ||
        evt.schoolSlug === selectedUnit ||
        evt.schoolSlug === 'all';
      const matchCategory =
        selectedCategory === 'all' || evt.category === selectedCategory;
      const matchSearch =
        !searchQuery.trim() ||
        evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.schoolName.toLowerCase().includes(searchQuery.toLowerCase());

      return matchUnit && matchCategory && matchSearch;
    });
  }, [initialEvents, selectedUnit, selectedCategory, searchQuery]);

  // Calendar Grid Computations
  const calendarGrid = useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();

    const cells: {
      day: number;
      isCurrentMonth: boolean;
      dateString: string;
      events: AcademicEvent[];
    }[] = [];

    // Previous month padding days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      const monthNum = currentMonth === 0 ? 12 : currentMonth;
      const yearNum = currentMonth === 0 ? currentYear - 1 : currentYear;
      const dateString = `${yearNum}-${String(monthNum).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      cells.push({
        day,
        isCurrentMonth: false,
        dateString,
        events: [],
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayEvents = filteredEvents.filter((e) => {
        if (e.startDate === dateString) return true;
        if (e.endDate && e.startDate <= dateString && e.endDate >= dateString) {
          return true;
        }
        return false;
      });

      cells.push({
        day,
        isCurrentMonth: true,
        dateString,
        events: dayEvents,
      });
    }

    // Trailing days to fill 35 or 42 grid cells
    const remaining = (7 - (cells.length % 7)) % 7;
    for (let day = 1; day <= remaining; day++) {
      const monthNum = currentMonth === 11 ? 1 : currentMonth + 2;
      const yearNum = currentMonth === 11 ? currentYear + 1 : currentYear;
      const dateString = `${yearNum}-${String(monthNum).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      cells.push({
        day,
        isCurrentMonth: false,
        dateString,
        events: [],
      });
    }

    return cells;
  }, [currentYear, currentMonth, filteredEvents]);

  // Navigate month
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleResetToday = () => {
    setCurrentYear(2026);
    setCurrentMonth(8); // September 2026
    setSelectedDate(null);
  };

  // Google Calendar URL generator
  const getGoogleCalendarUrl = (evt: AcademicEvent) => {
    const startIso = evt.startDate.replace(/-/g, '');
    const endIso = evt.endDate ? evt.endDate.replace(/-/g, '') : startIso;
    const datesParam = `${startIso}/${endIso}`;
    const text = encodeURIComponent(`[${evt.schoolName}] ${evt.title}`);
    const details = encodeURIComponent(
      `${evt.description}\n\nUnit: ${evt.schoolName}\nInformasi Resmi: https://alafiyah.sch.id/agenda`
    );
    const location = encodeURIComponent(evt.location);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${datesParam}&details=${details}&location=${location}`;
  };

  // Category colors & labels
  const getCategoryTheme = (category: AcademicEvent['category']) => {
    switch (category) {
      case 'ppdb':
        return {
          bg: 'bg-amber-50 text-amber-900 border-amber-200',
          dot: 'bg-amber-500',
          badge: 'bg-amber-100 text-amber-800',
          label: 'PPDB & Seleksi',
        };
      case 'akademik':
        return {
          bg: 'bg-sky-50 text-sky-900 border-sky-200',
          dot: 'bg-sky-500',
          badge: 'bg-sky-100 text-sky-800',
          label: 'Akademik',
        };
      case 'islamic':
        return {
          bg: 'bg-emerald-50 text-emerald-900 border-emerald-200',
          dot: 'bg-emerald-600',
          badge: 'bg-emerald-100 text-emerald-800',
          label: 'Hari Besar Islam',
        };
      case 'kegiatan':
        return {
          bg: 'bg-purple-50 text-purple-900 border-purple-200',
          dot: 'bg-purple-500',
          badge: 'bg-purple-100 text-purple-800',
          label: 'Kegiatan Murid',
        };
    }
  };

  // Format date helper (e.g. 26 September 2026)
  const formatDateIndo = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const day = parseInt(parts[2], 10);
    const month = MONTH_NAMES[parseInt(parts[1], 10) - 1];
    const year = parts[0];
    return `${day} ${month} ${year}`;
  };

  return (
    <div className="space-y-8">
      {/* Top Banner & Control Deck */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#D4EBE7] relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-[#E8F3F1]/70 pointer-events-none blur-2xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border text-xs font-bold mb-3 ${
              isSd ? 'bg-[#E8F8F0] border-[#A7F3D0] text-[#00A651]' : 'bg-[#E8F3F1] border-[#2D7A70]/30 text-[#184F48]'
            }`}>
              <CalendarDays className="w-3.5 h-3.5" />
              <span>{isSd ? 'Agenda Akademik SD IT Al-Afiyah T.A. 2026/2027' : 'Tahun Ajaran 2026/2027'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {isSd ? 'Kalender Agenda & Jadwal SD IT Al-Afiyah' : 'Kalender Agenda & Jadwal Seleksi Terpadu'}
            </h1>
            <p className="text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
              {isSd
                ? 'Pantau jadwal resmi gelombang SPMB SD IT, observasi murid, agenda kegiatan belajar mengajar (KBM), field study, serta kalender hari libur Islam SD IT Al-Afiyah Majalengka.'
                : 'Pantau jadwal lengkap gelombang PPDB, ujian observasi murid, agenda kegiatan belajar mengajar, serta kalender hari libur Islam di lingkungan Yayasan Pendidikan Imam Bonjol Majalengka.'}
            </p>
          </div>

          {/* Quick Actions (ICS & Google Cal) */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`/api/agenda?format=ics${selectedUnit !== 'all' ? `&schoolSlug=${selectedUnit}` : ''}`}
              download="agenda-alafiyah.ics"
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold shadow-2xs hover:shadow transition-all inline-flex items-center space-x-2"
              title="Unduh kalender dalam format iCalendar untuk Apple Calendar, Outlook, atau Google Calendar"
            >
              <Download className="w-4 h-4 text-[#2D7A70]" />
              <span>Unduh Kalender (.ics)</span>
            </a>
            <button
              type="button"
              onClick={() => {
                const url = window.location.href;
                navigator.clipboard.writeText(url);
                setCopiedLink(true);
                setTimeout(() => setCopiedLink(false), 2500);
              }}
              className="px-4 py-2.5 rounded-xl bg-[#E8F3F1] hover:bg-[#D4EBE7] text-[#184F48] text-xs font-bold transition-all inline-flex items-center space-x-2"
            >
              {copiedLink ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Tautan Disalin!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-[#2D7A70]" />
                  <span>Bagikan Agenda</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick KPI Stat Counter */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-100">
          <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100/80">
            <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Agenda PPDB</div>
            <div className="text-xl font-extrabold text-amber-900 mt-0.5">
              {initialEvents.filter((e) => e.category === 'ppdb' && (!isSd || e.schoolSlug === 'sd' || e.schoolSlug === 'all')).length} Jadwal
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-sky-50/60 border border-sky-100/80">
            <div className="text-[11px] font-bold text-sky-800 uppercase tracking-wider">Akademik &amp; Ujian</div>
            <div className="text-xl font-extrabold text-sky-900 mt-0.5">
              {initialEvents.filter((e) => e.category === 'akademik' && (!isSd || e.schoolSlug === 'sd' || e.schoolSlug === 'all')).length} Agenda
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100/80">
            <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Peringatan Islam</div>
            <div className="text-xl font-extrabold text-emerald-900 mt-0.5">
              {initialEvents.filter((e) => e.category === 'islamic' && (!isSd || e.schoolSlug === 'sd' || e.schoolSlug === 'all')).length} Kegiatan
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100/80">
            <div className="text-[11px] font-bold text-purple-800 uppercase tracking-wider">Aktivitas Murid</div>
            <div className="text-xl font-extrabold text-purple-900 mt-0.5">
              {initialEvents.filter((e) => e.category === 'kegiatan' && (!isSd || e.schoolSlug === 'sd' || e.schoolSlug === 'all')).length} Acara
            </div>
          </div>
        </div>
      </div>

      {/* Filter and View Switching Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-2xs border border-[#D4EBE7] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Unit Filters */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {isSd ? (
            <div className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold inline-flex items-center space-x-1.5 bg-[#00A651] text-white shadow-xs">
              <School className="w-3.5 h-3.5 text-amber-300" />
              <span>Unit SD IT Al-Afiyah</span>
            </div>
          ) : (
            [
              { id: 'all', label: 'Semua Unit', icon: Layers },
              { id: 'tk', label: 'TK IT', icon: GraduationCap },
              { id: 'sd', label: 'SD IT', icon: School },
              { id: 'smp', label: 'SMP IT', icon: BookOpen },
              { id: 'foundation', label: 'Yayasan', icon: Users },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = selectedUnit === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedUnit(tab.id)}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold inline-flex items-center space-x-1.5 transition-all cursor-pointer ${
                    active
                      ? 'bg-[#184F48] text-white shadow-sm'
                      : 'bg-slate-50 text-slate-600 hover:bg-[#E8F3F1] hover:text-[#184F48]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })
          )}
        </div>

        {/* Search and View Mode Switcher */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kegiatan, lokasi..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2D7A70]/30 focus:border-[#2D7A70]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveView('grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center space-x-1 transition-colors ${
                activeView === 'grid'
                  ? 'bg-white text-[#184F48] shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kalender</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveView('timeline')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center space-x-1 transition-colors ${
                activeView === 'timeline'
                  ? 'bg-white text-[#184F48] shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Timeline</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">Kategori:</span>
        {[
          { id: 'all', label: 'Semua Kategori' },
          { id: 'ppdb', label: 'PPDB & Seleksi', color: 'bg-amber-100 text-amber-800' },
          { id: 'akademik', label: 'Akademik & KBM', color: 'bg-sky-100 text-sky-800' },
          { id: 'islamic', label: 'Hari Besar Islam', color: 'bg-emerald-100 text-emerald-800' },
          { id: 'kegiatan', label: 'Aktivitas Murid', color: 'bg-purple-100 text-purple-800' },
        ].map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-[#2D7A70] text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* MAIN VIEW: Grid View */}
      {activeView === 'grid' && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-[#D4EBE7] space-y-6">
          {/* Calendar Month Navigation Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                {MONTH_NAMES[currentMonth]} {currentYear}
              </h2>
              <button
                type="button"
                onClick={handleResetToday}
                className="px-2.5 py-1 rounded-lg bg-[#E8F3F1] hover:bg-[#D4EBE7] text-[11px] font-bold text-[#184F48] transition-colors"
              >
                Hari Ini
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
                aria-label="Bulan Sebelumnya"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
                aria-label="Bulan Berikutnya"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center">
            {DAY_NAMES.map((d, idx) => (
              <div
                key={d}
                className={`py-2 text-[11px] font-extrabold uppercase tracking-wider rounded-lg ${
                  idx === 0 || idx === 5
                    ? 'text-emerald-700 bg-emerald-50/50'
                    : 'text-slate-500 bg-slate-50/50'
                }`}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Calendar Day Cells */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {calendarGrid.map((cell, idx) => {
              const hasEvents = cell.events.length > 0;
              const isSelected = selectedDate === cell.dateString;

              return (
                <div
                  key={`${cell.dateString}-${idx}`}
                  onClick={() => {
                    if (hasEvents) {
                      setSelectedDate(isSelected ? null : cell.dateString);
                    }
                  }}
                  className={`min-h-[90px] sm:min-h-[120px] p-1.5 sm:p-2.5 rounded-2xl border transition-all flex flex-col justify-between ${
                    cell.isCurrentMonth
                      ? hasEvents
                        ? isSelected
                          ? 'border-[#2D7A70] bg-[#E8F3F1]/40 ring-2 ring-[#2D7A70]/30 shadow-sm cursor-pointer'
                          : 'border-slate-200 bg-white hover:border-[#2D7A70]/50 hover:bg-slate-50/80 cursor-pointer shadow-2xs'
                        : 'border-slate-100 bg-white'
                      : 'border-slate-50 bg-slate-50/40 text-slate-300 opacity-60'
                  }`}
                >
                  {/* Date Header Number */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                        hasEvents && cell.isCurrentMonth
                          ? 'bg-[#184F48] text-white'
                          : cell.isCurrentMonth
                          ? 'text-slate-800'
                          : 'text-slate-400'
                      }`}
                    >
                      {cell.day}
                    </span>

                    {hasEvents && (
                      <span className="text-[10px] font-bold text-[#2D7A70] hidden sm:inline">
                        {cell.events.length} acara
                      </span>
                    )}
                  </div>

                  {/* Event Chips */}
                  <div className="space-y-1 mt-1 flex-1 overflow-hidden">
                    {cell.events.slice(0, 2).map((evt) => {
                      const theme = getCategoryTheme(evt.category);
                      return (
                        <button
                          key={evt.id}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveEventModal(evt);
                          }}
                          className={`w-full text-left px-1.5 py-0.5 rounded-md text-[10px] font-semibold truncate block border transition-transform hover:scale-102 ${theme.bg}`}
                          title={`${evt.title} (${evt.time || 'Sepanjang hari'})`}
                        >
                          <span className="truncate">{evt.title}</span>
                        </button>
                      );
                    })}
                    {cell.events.length > 2 && (
                      <div className="text-[9px] font-extrabold text-[#2D7A70] px-1">
                        +{cell.events.length - 2} kegiatan lainnya
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* If a date is selected, show its events below */}
          {selectedDate && (
            <div className="mt-6 p-5 rounded-2xl bg-[#E8F3F1]/40 border border-[#D4EBE7] animate-in fade-in duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <CalendarDays className="w-5 h-5 text-[#2D7A70]" />
                  <h3 className="font-extrabold text-slate-900 text-sm">
                    Kegiatan pada {formatDateIndo(selectedDate)}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedDate(null)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  Tutup Rincian
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredEvents
                  .filter((e) => {
                    if (e.startDate === selectedDate) return true;
                    if (e.endDate && e.startDate <= selectedDate && e.endDate >= selectedDate) return true;
                    return false;
                  })
                  .map((evt) => (
                    <div
                      key={evt.id}
                      onClick={() => setActiveEventModal(evt)}
                      className="p-4 rounded-xl bg-white border border-slate-200 hover:border-[#2D7A70] shadow-2xs hover:shadow transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F3F1] text-[#184F48]">
                            {evt.schoolName}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-500 flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{evt.time || 'Sepanjang Hari'}</span>
                          </span>
                        </div>
                        <div className="font-bold text-slate-900 text-xs sm:text-sm">{evt.title}</div>
                        <p className="text-xs text-slate-600 mt-1 line-clamp-2">{evt.description}</p>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 mt-3 pt-2 border-t border-slate-100">
                        <span className="truncate flex items-center space-x-1">
                          <MapPin className="w-3 h-3 text-[#2D7A70]" />
                          <span>{evt.location}</span>
                        </span>
                        <span className="text-[#2D7A70] font-bold">Rincian &rarr;</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ALTERNATIVE VIEW: Chronological Timeline */}
      {activeView === 'timeline' && (
        <div className="space-y-4">
          {filteredEvents.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#D4EBE7] shadow-sm">
              <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <div className="text-base font-bold text-slate-800">Tidak ada kegiatan yang cocok</div>
              <p className="text-xs text-slate-500 mt-1">
                Silakan ubah filter jenjang atau kata kunci pencarian Anda.
              </p>
            </div>
          ) : (
            <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-[#2D7A70] before:via-[#184F48] before:to-slate-200">
              {filteredEvents.map((evt) => {
                const theme = getCategoryTheme(evt.category);
                return (
                  <div key={evt.id} className="relative group">
                    {/* Timeline Node Dot */}
                    <div className="absolute -left-6 sm:-left-8 top-5 w-4 h-4 rounded-full border-2 border-white shadow-sm bg-[#184F48] group-hover:scale-125 transition-transform" />

                    <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-2xs hover:shadow-md border border-[#D4EBE7] group-hover:border-[#2D7A70] transition-all">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${theme.badge}`}>
                            {theme.label}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F3F1] text-[#184F48]">
                            {evt.schoolName}
                          </span>
                          {evt.isImportant && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                              Agenda Penting
                            </span>
                          )}
                        </div>

                        <div className="text-xs font-extrabold text-[#184F48] flex items-center space-x-1.5">
                          <CalendarDays className="w-3.5 h-3.5 text-[#2D7A70]" />
                          <span>
                            {formatDateIndo(evt.startDate)}
                            {evt.endDate && ` - ${formatDateIndo(evt.endDate)}`}
                          </span>
                        </div>
                      </div>

                      <h3
                        onClick={() => setActiveEventModal(evt)}
                        className="text-base sm:text-lg font-extrabold text-slate-900 group-hover:text-[#2D7A70] transition-colors cursor-pointer"
                      >
                        {evt.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                        {evt.description}
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-slate-100 text-xs text-slate-600">
                        <div className="flex flex-wrap items-center gap-4">
                          {evt.time && (
                            <span className="flex items-center space-x-1 font-semibold text-slate-700">
                              <Clock className="w-3.5 h-3.5 text-[#2D7A70]" />
                              <span>{evt.time}</span>
                            </span>
                          )}
                          <span className="flex items-center space-x-1 text-slate-600">
                            <MapPin className="w-3.5 h-3.5 text-rose-500" />
                            <span>{evt.location}</span>
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <a
                            href={getGoogleCalendarUrl(evt)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-[#2D7A70] text-[11px] font-bold text-[#184F48] hover:bg-[#E8F3F1] transition-all inline-flex items-center space-x-1"
                          >
                            <span>Google Cal</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                          <button
                            type="button"
                            onClick={() => setActiveEventModal(evt)}
                            className="px-3 py-1.5 rounded-xl bg-[#184F48] hover:bg-[#133f3a] text-white text-[11px] font-bold shadow-2xs transition-all"
                          >
                            Rincian Lengkap
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* EVENT DETAIL POPUP MODAL */}
      {activeEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#D4EBE7] relative overflow-hidden">
            <button
              type="button"
              onClick={() => setActiveEventModal(null)}
              className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 mb-3">
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${getCategoryTheme(activeEventModal.category).badge}`}>
                {getCategoryTheme(activeEventModal.category).label}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E8F3F1] text-[#184F48]">
                {activeEventModal.schoolName}
              </span>
            </div>

            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {activeEventModal.title}
            </h3>

            <div className="space-y-3 my-5 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
              <div className="flex items-start space-x-3">
                <CalendarDays className="w-4 h-4 text-[#2D7A70] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900">Tanggal Kegiatan</div>
                  <div className="text-slate-600">
                    {formatDateIndo(activeEventModal.startDate)}
                    {activeEventModal.endDate && ` s/d ${formatDateIndo(activeEventModal.endDate)}`}
                  </div>
                </div>
              </div>

              {activeEventModal.time && (
                <div className="flex items-start space-x-3">
                  <Clock className="w-4 h-4 text-[#2D7A70] flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-900">Waktu Pelaksanaan</div>
                    <div className="text-slate-600">{activeEventModal.time}</div>
                  </div>
                </div>
              )}

              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900">Lokasi / Ruang</div>
                  <div className="text-slate-600">{activeEventModal.location}</div>
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {activeEventModal.description}
            </p>

            <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
              <a
                href={getGoogleCalendarUrl(activeEventModal)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#184F48] to-[#2D7A70] hover:from-[#133f3a] hover:to-[#24635a] text-white text-xs font-bold shadow-sm text-center inline-flex items-center justify-center space-x-1.5 transition-all"
              >
                <span>Simpan di Google Calendar</span>
                <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
              </a>

              {activeEventModal.category === 'ppdb' && (
                <Link
                  href="/ppdb/daftar"
                  className="py-2.5 px-4 rounded-xl bg-[#E8F3F1] hover:bg-[#D4EBE7] text-[#184F48] text-xs font-bold text-center transition-colors"
                >
                  Daftar Murid
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
