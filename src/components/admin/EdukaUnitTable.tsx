'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Users,
  BookOpen,
  School,
  Sparkles,
  Layers,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  MoreHorizontal,
  ArrowRight,
  RotateCcw
} from 'lucide-react';

export interface UnitRow {
  id: string;
  name: string;
  headmaster: string;
  slug: string;
  badgeTag: string;
  iconType: 'class' | 'tahfidz' | 'science' | 'school' | 'users';
  levelInfo: string;
  studentsCount: number;
  quotaTarget: number;
  statusText: string;
  statusType: 'ongoing' | 'completed' | 'upcoming';
  directLink: string;
}

export interface SchoolStatProp {
  id: string;
  name: string;
  slug: string;
  badgeText: string;
  totalApplicants: number;
  verifiedApplicants: number;
  totalRevenue: number;
  targetQuota: number;
}

interface EdukaUnitTableProps {
  schools?: SchoolStatProp[];
  schoolSlug?: 'tk' | 'sd' | 'smp' | 'foundation';
}

export default function EdukaUnitTable({
  schools,
  schoolSlug = 'foundation',
}: EdukaUnitTableProps) {
  const [activeTab, setActiveTab] = useState<'All' | 'Ongoing' | 'Upcoming' | 'Completed'>('All');

  // DATASET 1: YAYASAN VIEW (Multi-Unit Consolidation - Neutral Titles)
  const defaultFoundationRows: UnitRow[] = [
    {
      id: '1',
      name: 'TK IT Al-Afiyah Majalengka',
      headmaster: 'Kepala Sekolah TK IT',
      slug: 'tk',
      badgeTag: 'PAUD / TK',
      iconType: 'school',
      levelInfo: 'Kelompok A & B',
      studentsCount: 38,
      quotaTarget: 40,
      statusText: 'Hampir Penuh',
      statusType: 'ongoing',
      directLink: '/admin/tk/dashboard',
    },
    {
      id: '2',
      name: 'SD IT Al-Afiyah Majalengka',
      headmaster: 'Kepala Sekolah SD IT',
      slug: 'sd',
      badgeTag: 'SD IT Terpadu',
      iconType: 'school',
      levelInfo: 'Kelas 1 Reguler & Tahfidz',
      studentsCount: 68,
      quotaTarget: 75,
      statusText: 'Dibuka',
      statusType: 'ongoing',
      directLink: '/admin/sd/dashboard',
    },
    {
      id: '3',
      name: 'SMP IT Al-Afiyah Majalengka',
      headmaster: 'Kepala Sekolah SMP IT',
      slug: 'smp',
      badgeTag: 'SMP Islam Terpadu',
      iconType: 'school',
      levelInfo: 'Fullday School & Tahfidz',
      studentsCount: 60,
      quotaTarget: 60,
      statusText: 'Lengkap / Penuh',
      statusType: 'completed',
      directLink: '/admin/smp/dashboard',
    },
    {
      id: '4',
      name: 'Program Kemitraan Afiliasi',
      headmaster: 'Koordinator Kemitraan Dakwah',
      slug: 'foundation',
      badgeTag: 'Mitra Yayasan',
      iconType: 'users',
      levelInfo: 'Jejaring Majelis & Guru',
      studentsCount: 18,
      quotaTarget: 25,
      statusText: 'Aktif Menjaring',
      statusType: 'upcoming',
      directLink: '/affiliate/dashboard',
    },
  ];

  // DATASET 2: SD IT SPECIFIC CLASSES (Neutral, Fully Editable)
  // DATASET 2: SD IT SPECIFIC CLASSES (Neutral, Fully Editable)
  const defaultSdRows: UnitRow[] = [
    {
      id: 'sd-1',
      name: 'Kelas 1A - Reguler Terpadu',
      headmaster: 'Wali Kelas 1A',
      slug: 'sd',
      badgeTag: 'Kelas 1A',
      iconType: 'class',
      levelInfo: 'Kurikulum Terpadu + Diniyah',
      studentsCount: 0,
      quotaTarget: 28,
      statusText: 'Dibuka',
      statusType: 'ongoing',
      directLink: '/admin/sd/ppdb',
    },
    {
      id: 'sd-2',
      name: 'Kelas 1B - Reguler Terpadu',
      headmaster: 'Wali Kelas 1B',
      slug: 'sd',
      badgeTag: 'Kelas 1B',
      iconType: 'class',
      levelInfo: 'Kurikulum Terpadu',
      studentsCount: 0,
      quotaTarget: 25,
      statusText: 'Dibuka',
      statusType: 'ongoing',
      directLink: '/admin/sd/ppdb',
    },
    {
      id: 'sd-3',
      name: 'Kelas 1C - Reguler Terpadu',
      headmaster: 'Wali Kelas 1C',
      slug: 'sd',
      badgeTag: 'Kelas 1C',
      iconType: 'class',
      levelInfo: 'Kurikulum Terpadu',
      studentsCount: 0,
      quotaTarget: 22,
      statusText: 'Dibuka',
      statusType: 'ongoing',
      directLink: '/admin/sd/ppdb',
    },
    {
      id: 'sd-4',
      name: 'Kelas 1D - Reguler Terpadu',
      headmaster: 'Wali Kelas 1D',
      slug: 'sd',
      badgeTag: 'Kelas 1D',
      iconType: 'class',
      levelInfo: 'Kurikulum Terpadu',
      studentsCount: 0,
      quotaTarget: 20,
      statusText: 'Dibuka',
      statusType: 'ongoing',
      directLink: '/admin/sd/ppdb',
    },
  ];

  // DATASET 3: TK IT SPECIFIC CLASSES (Neutral, Fully Editable)
  const defaultTkRows: UnitRow[] = [
    {
      id: 'tk-1',
      name: 'Kelompok A1 (Usia 4 - 5 Tahun)',
      headmaster: 'Wali Kelas Kelompok A1',
      slug: 'tk',
      badgeTag: 'Kelompok A',
      iconType: 'class',
      levelInfo: 'Stimulasi Motorik & Karakter',
      studentsCount: 0,
      quotaTarget: 20,
      statusText: 'Dibuka',
      statusType: 'ongoing',
      directLink: '/admin/tk/ppdb',
    },
    {
      id: 'tk-2',
      name: 'Kelompok B1 (Usia 5 - 6 Tahun)',
      headmaster: 'Wali Kelas Kelompok B1',
      slug: 'tk',
      badgeTag: 'Kelompok B',
      iconType: 'class',
      levelInfo: 'Kesiapan Belajar & Juz 30',
      studentsCount: 0,
      quotaTarget: 20,
      statusText: 'Dibuka',
      statusType: 'ongoing',
      directLink: '/admin/tk/ppdb',
    },
    {
      id: 'tk-3',
      name: 'Sentra Karakter & Doa Harian',
      headmaster: 'Guru Sentra TK IT',
      slug: 'tk',
      badgeTag: 'Sentra Quran',
      iconType: 'tahfidz',
      levelInfo: 'Hafalan Doa & Adab Harian',
      studentsCount: 0,
      quotaTarget: 40,
      statusText: 'Dibuka',
      statusType: 'ongoing',
      directLink: '/admin/tk/students',
    },
  ];

  // DATASET 4: SMP IT SPECIFIC CLASSES (Neutral, Fully Editable)
  const defaultSmpRows: UnitRow[] = [
    {
      id: 'smp-1',
      name: 'Kelas 7A - Putra (Ikhwan)',
      headmaster: 'Wali Kelas 7A',
      slug: 'smp',
      badgeTag: 'Kelas 7A',
      iconType: 'class',
      levelInfo: 'Fullday Terpadu & Bahasa Arab',
      studentsCount: 0,
      quotaTarget: 30,
      statusText: 'Dibuka',
      statusType: 'ongoing',
      directLink: '/admin/smp/ppdb',
    },
    {
      id: 'smp-2',
      name: 'Kelas 7B - Putri (Akhwat)',
      headmaster: 'Wali Kelas 7B',
      slug: 'smp',
      badgeTag: 'Kelas 7B',
      iconType: 'class',
      levelInfo: 'Fullday Terpadu & Adab Putri',
      studentsCount: 0,
      quotaTarget: 30,
      statusText: 'Dibuka',
      statusType: 'ongoing',
      directLink: '/admin/smp/ppdb',
    },
    {
      id: 'smp-3',
      name: 'Kelas 7C - Sains & Bahasa Asing',
      headmaster: 'Wali Kelas 7C',
      slug: 'smp',
      badgeTag: 'Kelas 7C',
      iconType: 'science',
      levelInfo: 'Kurikulum Merdeka & Bilingual',
      studentsCount: 0,
      quotaTarget: 25,
      statusText: 'Dibuka',
      statusType: 'ongoing',
      directLink: '/admin/smp/ppdb',
    },
  ];

  // Determine initial default
  const getDefaultBaseRows = () => {
    if (schoolSlug === 'sd') return defaultSdRows;
    if (schoolSlug === 'tk') return defaultTkRows;
    if (schoolSlug === 'smp') return defaultSmpRows;
    return defaultFoundationRows;
  };

  // State with LocalStorage persistence so user edits and additions are remembered!
  const [rows, setRows] = useState<UnitRow[]>(getDefaultBaseRows());
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storageKey = `alafiyah_rombel_${schoolSlug}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRows(parsed);
        }
      }
    } catch {
      // ignore
    }
    setIsLoaded(true);
  }, [schoolSlug]);

  const saveRows = (newRows: UnitRow[]) => {
    setRows(newRows);
    try {
      localStorage.setItem(`alafiyah_rombel_${schoolSlug}`, JSON.stringify(newRows));
    } catch {
      // ignore
    }
  };

  const handleResetToDefault = () => {
    if (confirm('Kembalikan daftar kelas/rombel ke format standar?')) {
      const initial = getDefaultBaseRows();
      saveRows(initial);
    }
  };

  // Modal State for Add & Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<UnitRow | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    headmaster: '',
    levelInfo: '',
    studentsCount: 0,
    quotaTarget: 30,
    statusText: 'Dibuka',
    statusType: 'ongoing' as 'ongoing' | 'completed' | 'upcoming',
    iconType: 'class' as 'class' | 'tahfidz' | 'science' | 'school' | 'users',
  });

  const handleOpenAddModal = () => {
    setEditingRow(null);
    setFormData({
      name: '',
      headmaster: '',
      levelInfo: 'Kurikulum Terpadu',
      studentsCount: 0,
      quotaTarget: 30,
      statusText: 'Dibuka',
      statusType: 'ongoing',
      iconType: 'class',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (row: UnitRow) => {
    setEditingRow(row);
    setFormData({
      name: row.name,
      headmaster: row.headmaster,
      levelInfo: row.levelInfo,
      studentsCount: row.studentsCount,
      quotaTarget: row.quotaTarget,
      statusText: row.statusText,
      statusType: row.statusType,
      iconType: row.iconType || 'class',
    });
    setIsModalOpen(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingRow) {
      // Update existing
      const updated = rows.map((r) =>
        r.id === editingRow.id
          ? {
              ...r,
              ...formData,
              name: formData.name.trim(),
              headmaster: formData.headmaster.trim() || 'Wali Kelas',
              levelInfo: formData.levelInfo.trim() || 'Terpadu',
              studentsCount: Number(formData.studentsCount) || 0,
              quotaTarget: Number(formData.quotaTarget) || 30,
            }
          : r
      );
      saveRows(updated);
    } else {
      // Add new
      const newRow: UnitRow = {
        id: `custom-${Date.now()}`,
        name: formData.name.trim(),
        headmaster: formData.headmaster.trim() || 'Wali Kelas',
        slug: schoolSlug,
        badgeTag: formData.name.substring(0, 10),
        iconType: formData.iconType,
        levelInfo: formData.levelInfo.trim() || 'Terpadu',
        studentsCount: Number(formData.studentsCount) || 0,
        quotaTarget: Number(formData.quotaTarget) || 30,
        statusText: formData.statusText,
        statusType: formData.statusType,
        directLink: schoolSlug === 'foundation' ? '/admin/foundation' : `/admin/${schoolSlug}/ppdb`,
      };
      saveRows([...rows, newRow]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteRow = (id: string) => {
    if (confirm('Yakin ingin menghapus rombel / kelas ini?')) {
      const updated = rows.filter((r) => r.id !== id);
      saveRows(updated);
      setIsModalOpen(false);
    }
  };

  // Minimalist Icon Renderer - No Photos!
  const renderMinimalIcon = (iconType: string) => {
    switch (iconType) {
      case 'tahfidz':
        return <BookOpen className="w-5 h-5 text-slate-700 group-hover:text-emerald-700 transition-colors" />;
      case 'science':
        return <Sparkles className="w-5 h-5 text-slate-700 group-hover:text-emerald-700 transition-colors" />;
      case 'school':
        return <School className="w-5 h-5 text-slate-700 group-hover:text-emerald-700 transition-colors" />;
      case 'users':
        return <Users className="w-5 h-5 text-slate-700 group-hover:text-emerald-700 transition-colors" />;
      case 'class':
      default:
        return <GraduationCap className="w-5 h-5 text-slate-700 group-hover:text-emerald-700 transition-colors" />;
    }
  };

  // Dynamic status badge styling based on real status text
  const renderStatusBadge = (item: UnitRow) => {
    const text = item.statusText || 'Dibuka';
    let badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';

    if (text === 'Hampir Penuh') {
      badgeClass = 'bg-amber-50 text-amber-800 border-amber-200';
    } else if (text === 'Seleksi' || text.includes('Seleksi')) {
      badgeClass = 'bg-blue-50 text-blue-700 border-blue-200';
    } else if (text === 'Penuh' || text.includes('Penuh') || text.includes('Lengkap')) {
      badgeClass = 'bg-slate-100 text-slate-700 border-slate-300';
    } else if (text === 'Ditutup' || text.includes('Tutup')) {
      badgeClass = 'bg-rose-50 text-rose-700 border-rose-200';
    } else if (text === 'Aktif Berjalan') {
      badgeClass = 'bg-teal-50 text-teal-700 border-teal-200';
    } else if (item.statusType === 'upcoming') {
      badgeClass = 'bg-blue-50 text-blue-700 border-blue-200';
    } else if (item.statusType === 'completed') {
      badgeClass = 'bg-slate-100 text-slate-700 border-slate-300';
    }

    return (
      <span
        className={`inline-block w-28 text-center py-1 rounded-full text-[10px] font-bold border shadow-2xs transition-transform group-hover/badge:scale-105 ${badgeClass}`}
      >
        {text}
      </span>
    );
  };

  let title = 'Unit Sekolah Al-Afiyah';
  let subtitle = 'Status kuota penerimaan dan pemantauan per jenjang yayasan';
  let footerLabel = 'Pengaturan Kuota Terpusat';
  let footerLink = '/admin/foundation/settings';
  let footerLinkText = 'Kelola Kuota Unit';

  if (schoolSlug === 'sd') {
    title = 'Rombel & Program Belajar SD IT Al-Afiyah';
    subtitle = 'Status keterisian kuota per kelas & rombongan belajar TP 2027/2028';
    footerLabel = 'Pusat Penerimaan SD IT';
    footerLink = '/admin/sd/ppdb';
    footerLinkText = 'Buka Manajemen PPDB SD';
  } else if (schoolSlug === 'tk') {
    title = 'Kelompok & Sentra Belajar TK IT Al-Afiyah';
    subtitle = 'Status keterisian kuota per kelompok usia anak TP 2027/2028';
    footerLabel = 'Pusat Penerimaan TK IT';
    footerLink = '/admin/tk/ppdb';
    footerLinkText = 'Buka Manajemen PPDB TK';
  } else if (schoolSlug === 'smp') {
    title = 'Rombel & Program Belajar SMP IT Al-Afiyah';
    subtitle = 'Status keterisian kuota kelas fullday & peminatan TP 2027/2028';
    footerLabel = 'Pusat Penerimaan SMP IT';
    footerLink = '/admin/smp/ppdb';
    footerLinkText = 'Buka Manajemen PPDB SMP';
  }

  // Filter rows based on status
  const filtered = rows.filter((r) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Ongoing') {
      return (
        r.statusType === 'ongoing' ||
        r.statusText === 'Dibuka' ||
        r.statusText === 'Hampir Penuh' ||
        r.statusText === 'Aktif Berjalan'
      );
    }
    if (activeTab === 'Upcoming') {
      return r.statusType === 'upcoming' || r.statusText.includes('Seleksi');
    }
    if (activeTab === 'Completed') {
      return (
        r.statusType === 'completed' ||
        r.statusText.includes('Penuh') ||
        r.statusText.includes('Ditutup')
      );
    }
    return true;
  });

  return (
    <div className="bg-white rounded-[24px] p-6 sm:p-7 border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col justify-between relative overflow-hidden">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div>
          <h3 className="font-bold text-base sm:text-lg text-slate-900 tracking-tight">
            {title}
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            {subtitle}
          </p>
        </div>

        {/* Action Button: Add Rombel / Edit Names */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
            title="Reset ke format standar"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Rombel / Kelas</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs (All, Ongoing, Upcoming, Completed) */}
      <div className="flex items-center space-x-2 pt-4 pb-2 text-xs font-semibold border-b border-slate-100 overflow-x-auto no-scrollbar">
        {(['All', 'Ongoing', 'Upcoming', 'Completed'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex-shrink-0 whitespace-nowrap ${
              activeTab === tab
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {tab === 'All'
              ? schoolSlug === 'foundation'
                ? 'Semua Unit'
                : 'Semua Rombel'
              : tab === 'Ongoing'
              ? 'Sedang Buka'
              : tab === 'Upcoming'
              ? 'Seleksi'
              : 'Penuh'}
          </button>
        ))}
      </div>

      {/* Column Headers */}
      <div className="hidden sm:flex items-center gap-3 px-3 pt-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
        <div className="flex-1 min-w-0">
          {schoolSlug === 'foundation' ? 'Unit Sekolah' : 'Nama Rombel / Program'}
        </div>
        <div className="w-28 sm:w-32 flex-shrink-0 text-right">
          Keterisian Kuota
        </div>
        <div className="w-32 flex-shrink-0 text-center">
          Status PPDB
        </div>
        <div className="w-20 flex-shrink-0 text-right pr-1">
          Aksi
        </div>
      </div>

      {/* Rows List with Minimalist Clean Icons (No Photos) */}
      <div className="divide-y divide-slate-100 mt-1">
        {filtered.length === 0 ? (
          <div className="py-10 text-center text-xs text-slate-400 italic">
            Belum ada rombel pada kategori ini. Klik &quot;Tambah Rombel / Kelas&quot; untuk menambahkan.
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="py-3 flex items-center gap-3 hover:bg-slate-50/80 px-2 sm:px-3 rounded-2xl transition-colors group"
            >
              {/* 1. Minimalist Icon Box + Title + Subtitle - NO PHOTOS */}
              <div className="flex items-center space-x-3.5 min-w-0 flex-1">
                <div className="w-11 h-11 rounded-xl bg-slate-50 group-hover:bg-emerald-50 border border-slate-200/90 group-hover:border-emerald-200 flex items-center justify-center flex-shrink-0 shadow-2xs transition-colors">
                  {renderMinimalIcon(item.iconType)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold text-xs sm:text-sm text-slate-900 truncate">
                      {item.name}
                    </h4>
                  </div>
                  <div className="text-[11px] text-slate-500 truncate mt-0.5">
                    <span className="font-medium text-slate-800">{item.headmaster}</span> •{' '}
                    <span>{item.levelInfo}</span>
                  </div>
                </div>
              </div>

              {/* 2. Students Count & Quota */}
              <div className="hidden sm:flex flex-col items-end justify-center w-28 sm:w-32 flex-shrink-0 text-right">
                <div className="font-semibold text-xs text-slate-900 tabular-nums">
                  {item.studentsCount} / {item.quotaTarget}
                </div>
                <div className="text-[10px] text-slate-400">
                  Murid Terdaftar
                </div>
              </div>

              {/* 3. Status Badge Pill - Klik langsung untuk ubah status */}
              <div className="w-32 flex-shrink-0 flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => handleOpenEditModal(item)}
                  title="Klik untuk ubah Status PPDB"
                  className="cursor-pointer group/badge"
                >
                  {renderStatusBadge(item)}
                </button>
              </div>

              {/* 4. Action: Edit & Open Link */}
              <div className="w-20 flex-shrink-0 flex items-center justify-end space-x-1">
                <button
                  type="button"
                  onClick={() => handleOpenEditModal(item)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                  title="Edit Rombel & Pengajar"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>

                <Link
                  href={item.directLink}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  title="Buka Dasbor PPDB"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Link */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 mt-2">
        <span>{footerLabel}</span>
        <Link
          href={footerLink}
          className="font-bold text-[#10B981] hover:underline inline-flex items-center space-x-1"
        >
          <span>{footerLinkText}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Modal: Tambah & Edit Rombel / Kelas */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  {editingRow ? 'Edit Data Rombel / Kelas' : 'Tambah Rombel / Kelas Baru'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Kelas / Rombel
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Kelas 1A, Kelompok B2, Kelas 7A"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Wali Kelas / Pengajar
                </label>
                <input
                  type="text"
                  value={formData.headmaster}
                  onChange={(e) => setFormData({ ...formData, headmaster: e.target.value })}
                  placeholder="Ketik nama wali kelas / guru..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Keterangan / Kurikulum
                </label>
                <input
                  type="text"
                  value={formData.levelInfo}
                  onChange={(e) => setFormData({ ...formData, levelInfo: e.target.value })}
                  placeholder="Contoh: Reguler Terpadu, Tahfidz Al-Qur'an, Sains"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Murid Terdaftar
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.studentsCount}
                    onChange={(e) => setFormData({ ...formData, studentsCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Target Kuota
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.quotaTarget}
                    onChange={(e) => setFormData({ ...formData, quotaTarget: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Status PPDB
                  </label>
                  <select
                    value={
                      ['Dibuka', 'Hampir Penuh', 'Seleksi', 'Penuh', 'Ditutup', 'Aktif Berjalan'].includes(formData.statusText)
                        ? formData.statusText
                        : 'CUSTOM'
                    }
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === 'Dibuka') {
                        setFormData({ ...formData, statusText: 'Dibuka', statusType: 'ongoing' });
                      } else if (val === 'Hampir Penuh') {
                        setFormData({ ...formData, statusText: 'Hampir Penuh', statusType: 'ongoing' });
                      } else if (val === 'Seleksi') {
                        setFormData({ ...formData, statusText: 'Seleksi', statusType: 'upcoming' });
                      } else if (val === 'Penuh') {
                        setFormData({ ...formData, statusText: 'Penuh', statusType: 'completed' });
                      } else if (val === 'Ditutup') {
                        setFormData({ ...formData, statusText: 'Ditutup', statusType: 'completed' });
                      } else if (val === 'Aktif Berjalan') {
                        setFormData({ ...formData, statusText: 'Aktif Berjalan', statusType: 'ongoing' });
                      } else {
                        setFormData({ ...formData, statusText: '', statusType: 'ongoing' });
                      }
                    }}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white font-medium"
                  >
                    <option value="Dibuka">Dibuka</option>
                    <option value="Hampir Penuh">Hampir Penuh</option>
                    <option value="Seleksi">Seleksi</option>
                    <option value="Penuh">Penuh</option>
                    <option value="Ditutup">Ditutup</option>
                    <option value="Aktif Berjalan">Aktif Berjalan</option>
                    <option value="CUSTOM">Lainnya (Ketik Manual...)</option>
                  </select>

                  {!['Dibuka', 'Hampir Penuh', 'Seleksi', 'Penuh', 'Ditutup', 'Aktif Berjalan'].includes(formData.statusText) && (
                    <input
                      type="text"
                      value={formData.statusText}
                      onChange={(e) => setFormData({ ...formData, statusText: e.target.value })}
                      placeholder="Ketik status PPDB kustom..."
                      className="mt-1.5 w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                      autoFocus
                    />
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ikon Tampilan
                  </label>
                  <select
                    value={formData.iconType}
                    onChange={(e) => setFormData({ ...formData, iconType: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white"
                  >
                    <option value="class">Topi Sarjana (Kelas)</option>
                    <option value="tahfidz">Buku Terbuka (Tahfidz)</option>
                    <option value="science">Bintang (Sains / Khusus)</option>
                    <option value="school">Gedung Sekolah (Unit)</option>
                    <option value="users">Grup Peserta Didik (Umum)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                {editingRow ? (
                  <button
                    type="button"
                    onClick={() => handleDeleteRow(editingRow.id)}
                    className="text-xs text-rose-600 hover:text-rose-700 hover:underline flex items-center space-x-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    Simpan Data
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
