'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  Award,
  Trophy,
  Medal,
  Plus,
  Search,
  Printer,
  Download,
  Edit2,
  Trash2,
  X,
  Check,
  AlertCircle,
  School as SchoolIcon,
  Globe,
  Filter,
} from 'lucide-react';
import CertificatePrintModal from './CertificatePrintModal';

export interface AchievementItem {
  id: string;
  schoolId: string;
  title: string;
  studentName: string;
  category: string;
  level: string;
  rank: string;
  year: string;
  description: string | null;
  imageUrl: string | null;
  createdAt: string | Date;
  school: {
    id: string;
    slug: string;
    name: string;
    primaryColor?: string;
  };
}

interface AchievementManagerClientProps {
  initialAchievements: AchievementItem[];
  schoolSlug: string; // 'tk' | 'sd' | 'smp' | 'foundation'
  schoolName: string;
  schoolId?: string;
  schools?: Array<{ id: string; slug: string; name: string }>;
}

export default function AchievementManagerClient({
  initialAchievements,
  schoolSlug,
  schoolName,
  schoolId,
  schools = [],
}: AchievementManagerClientProps) {
  const [achievements, setAchievements] = useState<AchievementItem[]>(initialAchievements);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUnit, setSelectedUnit] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AchievementItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Delete State
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Print Modal State
  const [printItem, setPrintItem] = useState<AchievementItem | null>(null);

  // Form State
  const [formSchoolId, setFormSchoolId] = useState(schoolId || schools[0]?.id || '');
  const [formTitle, setFormTitle] = useState('');
  const [formStudentName, setFormStudentName] = useState('');
  const [formCategory, setFormCategory] = useState('AKADEMIK');
  const [formLevel, setFormLevel] = useState('KABUPATEN');
  const [formRank, setFormRank] = useState('JUARA_1');
  const [formYear, setFormYear] = useState('2026');
  const [formDescription, setFormDescription] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('/images/arc-tahfidz.jpg');

  const isFoundation = schoolSlug === 'foundation';

  // Open modal for Add
  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormSchoolId(schoolId || schools[0]?.id || '');
    setFormTitle('');
    setFormStudentName('');
    setFormCategory('AKADEMIK');
    setFormLevel('KABUPATEN');
    setFormRank('JUARA_1');
    setFormYear('2026');
    setFormDescription('');
    setFormImageUrl('/images/arc-tahfidz.jpg');
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (item: AchievementItem) => {
    setEditingItem(item);
    setFormSchoolId(item.schoolId);
    setFormTitle(item.title);
    setFormStudentName(item.studentName);
    setFormCategory(item.category);
    setFormLevel(item.level);
    setFormRank(item.rank);
    setFormYear(item.year);
    setFormDescription(item.description || '');
    setFormImageUrl(item.imageUrl || '/images/arc-tahfidz.jpg');
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  // Handle Form Submit (Add or Edit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const payload = {
        id: editingItem?.id,
        schoolId: formSchoolId,
        title: formTitle,
        studentName: formStudentName,
        category: formCategory,
        level: formLevel,
        rank: formRank,
        year: formYear,
        description: formDescription.trim() || null,
        imageUrl: formImageUrl.trim() || '/images/arc-tahfidz.jpg',
      };

      const res = await fetch('/api/admin/achievements', {
        method: editingItem ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Gagal menyimpan data prestasi');
      }

      if (editingItem) {
        setAchievements((prev) =>
          prev.map((item) => (item.id === editingItem.id ? json.data : item))
        );
      } else {
        setAchievements((prev) => [json.data, ...prev]);
      }

      setIsModalOpen(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kesalahan saat memproses data');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete
  const handleDelete = async (id: string) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus data prestasi murid ini?')) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/achievements?id=${id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Gagal menghapus data');
      }

      setAchievements((prev) => prev.filter((item) => item.id !== id));
    } catch (err: any) {
      alert(err.message || 'Gagal menghapus prestasi');
    } finally {
      setDeletingId(null);
    }
  };

  // Filtered List
  const filteredAchievements = useMemo(() => {
    return achievements.filter((item) => {
      const matchSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchUnit =
        selectedUnit === 'ALL' || item.school?.slug?.toLowerCase() === selectedUnit.toLowerCase();

      const matchCategory = selectedCategory === 'ALL' || item.category === selectedCategory;

      const matchLevel = selectedLevel === 'ALL' || item.level === selectedLevel;

      return matchSearch && matchUnit && matchCategory && matchLevel;
    });
  }, [achievements, searchQuery, selectedUnit, selectedCategory, selectedLevel]);

  // KPI Calculations
  const totalCount = achievements.length;
  const goldCount = achievements.filter((a) => a.rank === 'JUARA_1').length;
  const silverBronzeCount = achievements.filter(
    (a) => a.rank === 'JUARA_2' || a.rank === 'JUARA_3'
  ).length;
  const nationalIntlCount = achievements.filter(
    (a) => a.level === 'NASIONAL' || a.level === 'INTERNASIONAL'
  ).length;

  // Export CSV (UTF-8 BOM)
  const handleExportCSV = () => {
    const headers = [
      'ID Prestasi',
      'Unit Sekolah',
      'Nama Murid',
      'Judul Kejuaraan',
      'Kategori',
      'Tingkat',
      'Peringkat',
      'Tahun',
      'Keterangan',
      'Tanggal Dibuat',
    ];

    const rows = filteredAchievements.map((item) => [
      item.id,
      item.school?.name || '',
      `"${item.studentName.replace(/"/g, '""')}"`,
      `"${item.title.replace(/"/g, '""')}"`,
      item.category,
      item.level,
      item.rank,
      item.year,
      `"${(item.description || '').replace(/"/g, '""')}"`,
      new Date(item.createdAt).toLocaleDateString('id-ID'),
    ]);

    const csvContent =
      '\uFEFF' + [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `data-prestasi-murid-alafiyah-${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getRankBadge = (rank: string) => {
    switch (rank) {
      case 'JUARA_1':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
            <Trophy className="w-3.5 h-3.5 text-amber-600" />
            <span>Juara 1 (Emas)</span>
          </span>
        );
      case 'JUARA_2':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-extrabold bg-slate-100 text-slate-800 border border-slate-300">
            <Medal className="w-3.5 h-3.5 text-slate-500" />
            <span>Juara 2 (Perak)</span>
          </span>
        );
      case 'JUARA_3':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-extrabold bg-orange-100 text-orange-900 border border-orange-300">
            <Medal className="w-3.5 h-3.5 text-orange-600" />
            <span>Juara 3 (Perunggu)</span>
          </span>
        );
      case 'HARAPAN_1':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-teal-100 text-teal-800 border border-teal-200">
            <Award className="w-3.5 h-3.5 text-teal-600" />
            <span>Harapan 1</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <Award className="w-3.5 h-3.5 text-blue-600" />
            <span>Finalis</span>
          </span>
        );
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'INTERNASIONAL':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-800 border border-purple-200">
            Internasional
          </span>
        );
      case 'NASIONAL':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800 border border-rose-200">
            Nasional
          </span>
        );
      case 'PROVINSI':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
            Provinsi
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            Kabupaten
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* 4 Kartu KPI Google Workspace Minimalist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Total Prestasi Terdata
              </p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{totalCount}</h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-[#064E3B] flex items-center justify-center border border-emerald-200/80">
              <Trophy className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 font-medium">Rekapitulasi resmi kesiswaan</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                Juara 1 / Medali Emas
              </p>
              <h3 className="text-2xl font-black text-amber-600 mt-1">{goldCount}</h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 font-medium">Peringkat tertinggi juara 1</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Perak &amp; Perunggu
              </p>
              <h3 className="text-2xl font-black text-slate-800 mt-1">{silverBronzeCount}</h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center border border-slate-200">
              <Medal className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 font-medium">Juara 2 dan Juara 3</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                Nasional &amp; Internasional
              </p>
              <h3 className="text-2xl font-black text-indigo-700 mt-1">{nationalIntlCount}</h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-200">
              <Globe className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 font-medium">Tingkat prestise tinggi</p>
        </div>
      </div>

      {/* Toolbar Filter & Aksi */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search & Dropdown Filters */}
        <div className="flex items-center gap-2.5 flex-1 flex-wrap">
          <div className="relative min-w-[220px] flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Cari nama murid, judul lomba..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:border-[#064E3B] focus:ring-2 focus:ring-emerald-600/20 focus:outline-hidden"
            />
          </div>

          {isFoundation && (
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:border-[#064E3B] focus:outline-hidden"
            >
              <option value="ALL">Semua Unit Sekolah</option>
              <option value="tk">TK IT Al-Afiyah</option>
              <option value="sd">SDIT Al-Afiyah</option>
              <option value="smp">SMP IT Al-Afiyah</option>
            </select>
          )}

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:border-[#064E3B] focus:outline-hidden"
          >
            <option value="ALL">Semua Kategori</option>
            <option value="TAHFIDZ">Tahfidz Al-Qur&apos;an</option>
            <option value="SAINS">Sains &amp; Matematika</option>
            <option value="OLAHRAGA">Olahraga &amp; Bela Diri</option>
            <option value="SENI_BAHASA">Seni &amp; Bahasa</option>
            <option value="AKADEMIK">Akademik Terpadu</option>
          </select>

          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:border-[#064E3B] focus:outline-hidden"
          >
            <option value="ALL">Semua Tingkat</option>
            <option value="KABUPATEN">Kabupaten / Kota</option>
            <option value="PROVINSI">Provinsi</option>
            <option value="NASIONAL">Nasional</option>
            <option value="INTERNASIONAL">Internasional</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-2xs cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-700" />
            <span>Ekspor CSV</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#064E3B] hover:bg-emerald-900 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Prestasi</span>
          </button>
        </div>
      </div>

      {/* Tabel Data Prestasi */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Murid &amp; Unit</th>
                <th className="py-3.5 px-4">Judul Kejuaraan &amp; Tahun</th>
                <th className="py-3.5 px-4">Kategori &amp; Tingkat</th>
                <th className="py-3.5 px-4">Peringkat Medali</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAchievements.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <Award className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-600">Tidak ada data prestasi ditemukan</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Gunakan filter lain atau klik tombol &ldquo;Tambah Prestasi&rdquo;
                    </p>
                  </td>
                </tr>
              ) : (
                filteredAchievements.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Kolom 1: Murid & Unit */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden relative shrink-0 border border-slate-200">
                          <Image
                            src={item.imageUrl || '/images/arc-tahfidz.jpg'}
                            alt={item.studentName}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{item.studentName}</p>
                          <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold text-[10px]">
                            {item.school?.name || 'Al-Afiyah'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Kolom 2: Judul & Tahun */}
                    <td className="py-4 px-4">
                      <p className="font-bold text-slate-800 leading-snug">{item.title}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Tahun {item.year}
                        {item.description ? ` • ${item.description.slice(0, 45)}...` : ''}
                      </p>
                    </td>

                    {/* Kolom 3: Kategori & Tingkat */}
                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-1 items-start">
                        <span className="text-[11px] font-bold text-slate-700">
                          {item.category.replace('_', ' ')}
                        </span>
                        {getLevelBadge(item.level)}
                      </div>
                    </td>

                    {/* Kolom 4: Peringkat */}
                    <td className="py-4 px-4">{getRankBadge(item.rank)}</td>

                    {/* Kolom 5: Aksi */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setPrintItem(item)}
                          title="Cetak Piagam Penghargaan A4"
                          className="p-2 rounded-lg bg-emerald-50 text-[#064E3B] hover:bg-emerald-100 transition-colors cursor-pointer border border-emerald-200/80 shadow-2xs"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(item)}
                          title="Edit Data Prestasi"
                          className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId === item.id}
                          title="Hapus Prestasi"
                          className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Ringkasan */}
        <div className="p-4 bg-slate-50/80 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Menampilkan {filteredAchievements.length} dari {totalCount} total prestasi</span>
          <span className="font-mono text-[11px]">Ekosistem Al-Afiyah © 2026</span>
        </div>
      </div>

      {/* Modal Tambah / Edit Prestasi */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-100 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#064E3B] flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {editingItem ? 'Edit Data Prestasi Murid' : 'Tambah Prestasi Murid Baru'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Simpan rekam jejak juara &amp; cetak piagam penghargaan resmi
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMessage && (
              <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 mt-4 text-xs">
              {/* Unit Sekolah (jika ada pilihan) */}
              {isFoundation && schools.length > 0 && (
                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">
                    Unit Sekolah <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formSchoolId}
                    onChange={(e) => setFormSchoolId(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#064E3B] focus:outline-hidden font-semibold text-slate-800"
                  >
                    {schools.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Nama Murid */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Nama Lengkap Murid <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Muhammad Rayyan Al-Ghifari"
                  value={formStudentName}
                  onChange={(e) => setFormStudentName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#064E3B] focus:outline-hidden font-bold text-slate-900"
                />
              </div>

              {/* Judul Lomba */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Nama Kompetisi / Judul Prestasi <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Musabaqah Hifdzil Qur'an (MHQ) 3 Juz"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#064E3B] focus:outline-hidden font-semibold text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Kategori */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">Bidang / Kategori</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#064E3B] focus:outline-hidden font-semibold text-slate-800"
                  >
                    <option value="TAHFIDZ">Tahfidz Qur&apos;an</option>
                    <option value="SAINS">Sains &amp; Robotik</option>
                    <option value="OLAHRAGA">Olahraga &amp; Silat</option>
                    <option value="SENI_BAHASA">Seni &amp; Pidato</option>
                    <option value="AKADEMIK">Akademik Terpadu</option>
                  </select>
                </div>

                {/* Tingkat */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">Tingkat Wilayah</label>
                  <select
                    value={formLevel}
                    onChange={(e) => setFormLevel(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#064E3B] focus:outline-hidden font-semibold text-slate-800"
                  >
                    <option value="KABUPATEN">Kabupaten / Kota</option>
                    <option value="PROVINSI">Provinsi</option>
                    <option value="NASIONAL">Nasional</option>
                    <option value="INTERNASIONAL">Internasional</option>
                  </select>
                </div>

                {/* Peringkat */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">Peringkat / Medali</label>
                  <select
                    value={formRank}
                    onChange={(e) => setFormRank(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#064E3B] focus:outline-hidden font-semibold text-slate-800"
                  >
                    <option value="JUARA_1">Juara 1 (Emas)</option>
                    <option value="JUARA_2">Juara 2 (Perak)</option>
                    <option value="JUARA_3">Juara 3 (Perunggu)</option>
                    <option value="HARAPAN_1">Juara Harapan 1</option>
                    <option value="FINALIS">Finalis Terbaik</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Tahun */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">Tahun Ajaran</label>
                  <input
                    type="text"
                    value={formYear}
                    onChange={(e) => setFormYear(e.target.value)}
                    placeholder="2026"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#064E3B] focus:outline-hidden font-semibold text-slate-900"
                  />
                </div>

                {/* Foto URL */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">Foto Dokumentasi Piala</label>
                  <input
                    type="text"
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                    placeholder="Contoh: /images/arc-tahfidz.jpg"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#064E3B] focus:outline-hidden text-slate-700"
                  />
                </div>
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Deskripsi / Keterangan Tambahan (Opsional)
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Contoh: Menjuarai lomba MHQ antar SDIT se-Jawa Barat diselenggarakan oleh Dinas Pendidikan..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#064E3B] focus:outline-hidden text-slate-800"
                />
              </div>

              {/* Actions */}
              <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-[#064E3B] hover:bg-emerald-900 text-white font-bold transition-colors cursor-pointer shadow-xs"
                >
                  {isSubmitting ? 'Menyimpan...' : editingItem ? 'Simpan Perubahan' : 'Tambah Prestasi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Cetak Piagam A4 */}
      {printItem && (
        <CertificatePrintModal
          isOpen={!!printItem}
          onClose={() => setPrintItem(null)}
          achievement={printItem}
        />
      )}
    </div>
  );
}
