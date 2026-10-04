'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Plus,
  Download,
  Printer,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  UserPlus,
  RefreshCw,
  Filter,
  UserCheck,
  Building,
  Eye,
  FileSpreadsheet,
  X
} from 'lucide-react';
import { exportToExcel, ExcelColumn } from '@/lib/excelExport';
import { StudentDossierPrintModal } from './StudentDossierPrintModal';

interface StudentDossierManagerClientProps {
  schoolSlug?: string; // If undefined, foundation superadmin mode
  schoolName?: string;
}

export const StudentDossierManagerClient: React.FC<StudentDossierManagerClientProps> = ({
  schoolSlug,
  schoolName = 'Yayasan Pendidikan Imam Bonjol'
}) => {
  const [students, setStudents] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({
    total: 0,
    active: 0,
    male: 0,
    female: 0,
    classes: [],
    unconvertedCount: 0
  });
  const [unconvertedPPDB, setUnconvertedPPDB] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedSchool, setSelectedSchool] = useState(schoolSlug || 'ALL');

  // Modals state
  const [selectedStudentForPrint, setSelectedStudentForPrint] = useState<any | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    schoolSlug: schoolSlug || 'sd',
    nis: '',
    nisn: '',
    fullName: '',
    gender: 'L',
    pob: 'Majalengka',
    dob: '2019-05-15',
    nik: '',
    religion: 'Islam',
    address: '',
    classGrade: '1 SD IT',
    academicYear: '2026/2027',
    fatherName: '',
    fatherPhone: '',
    fatherJob: '',
    motherName: '',
    motherPhone: '',
    motherJob: '',
    status: 'ACTIVE',
    notes: ''
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      const activeSchool = schoolSlug || (selectedSchool !== 'ALL' ? selectedSchool : '');
      if (activeSchool) params.append('schoolSlug', activeSchool);
      if (selectedClass !== 'ALL') params.append('classGrade', selectedClass);
      if (selectedStatus !== 'ALL') params.append('status', selectedStatus);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());

      const res = await fetch(`/api/admin/students?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setStudents(json.data || []);
        setStats(json.stats || {});
        setUnconvertedPPDB(json.unconvertedPPDB || []);
      }
    } catch (e) {
      console.error('Failed to fetch students:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [schoolSlug, selectedSchool, selectedClass, selectedStatus]);

  // Handle Search on Enter or debounce
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStudents();
  };

  // Convert PPDB registration to Student
  const handleConvertPPDB = async (regId: string) => {
    try {
      const res = await fetch('/api/admin/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ convertRegistrationId: regId })
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        alert(json.error || 'Gagal mendaftarkan murid');
        return;
      }
      alert(json.message || 'Murid berhasil didaftarkan ke Buku Induk!');
      fetchStudents();
    } catch (e: any) {
      alert(e.message || 'Terjadi kesalahan sistem');
    }
  };

  // Open Edit Modal
  const handleEditClick = (student: any) => {
    setEditingStudent(student);
    let p: any = {};
    try {
      p = typeof student.parentInfo === 'string' ? JSON.parse(student.parentInfo) : (student.parentInfo || {});
    } catch (e) {
      p = {};
    }

    setFormData({
      schoolSlug: student.school?.slug || 'sd',
      nis: student.nis,
      nisn: student.nisn || '',
      fullName: student.fullName,
      gender: student.gender,
      pob: student.pob,
      dob: new Date(student.dob).toISOString().split('T')[0],
      nik: student.nik || '',
      religion: student.religion || 'Islam',
      address: student.address,
      classGrade: student.classGrade,
      academicYear: student.academicYear || '2026/2027',
      fatherName: p.fatherName || '',
      fatherPhone: p.fatherPhone || p.parentPhone || '',
      fatherJob: p.fatherJob || '',
      motherName: p.motherName || '',
      motherPhone: p.motherPhone || '',
      motherJob: p.motherJob || '',
      status: student.status,
      notes: student.notes || ''
    });
    setFormError(null);
    setFormSuccess(null);
    setIsAddModalOpen(true);
  };

  // Delete Student
  const handleDeleteStudent = async (studentId: string, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus data Buku Induk murid "${name}"? Tindakan ini tidak dapat dibatalkan.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/students/${studentId}`, {
        method: 'DELETE'
      });
      const json = await res.json();
      if (json.success) {
        fetchStudents();
      } else {
        alert(json.error || 'Gagal menghapus murid');
      }
    } catch (e: any) {
      alert(e.message || 'Terjadi kesalahan');
    }
  };

  // Save manual / edited student
  const handleSaveStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    setFormSuccess(null);

    const parentPayload = {
      fatherName: formData.fatherName,
      fatherPhone: formData.fatherPhone,
      fatherJob: formData.fatherJob,
      motherName: formData.motherName,
      motherPhone: formData.motherPhone,
      motherJob: formData.motherJob
    };

    try {
      if (editingStudent) {
        // PUT update
        const res = await fetch(`/api/admin/students/${editingStudent.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            parentInfo: parentPayload
          })
        });
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.error || 'Gagal memperbarui data');
        setFormSuccess('Data murid berhasil diperbarui!');
      } else {
        // POST create
        const res = await fetch('/api/admin/students', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            parentInfo: parentPayload
          })
        });
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.error || 'Gagal menambahkan murid');
        setFormSuccess('Murid baru berhasil didaftarkan ke Buku Induk!');
      }

      setTimeout(() => {
        setIsAddModalOpen(false);
        setEditingStudent(null);
        fetchStudents();
      }, 1000);
    } catch (err: any) {
      setFormError(err.message || 'Gagal menyimpan data murid');
    } finally {
      setSubmitting(false);
    }
  };

  // Export EMIS / DAPODIK Excel
  const handleExportExcel = () => {
    if (students.length === 0) {
      alert('Tidak ada data murid untuk diekspor.');
      return;
    }

    const columns: ExcelColumn[] = [
      { header: 'No', key: 'no', width: 6, align: 'center' },
      { header: 'NIS (Buku Induk)', key: 'nis', width: 18, align: 'center' },
      { header: 'NISN Kemendikbud', key: 'nisn', width: 18, align: 'center' },
      { header: 'NIK Murid', key: 'nik', width: 20, align: 'center' },
      { header: 'Nama Lengkap Murid', key: 'fullName', width: 28, align: 'left' },
      { header: 'Gender', key: 'gender', width: 12, align: 'center' },
      { header: 'Tempat Lahir', key: 'pob', width: 18, align: 'left' },
      { header: 'Tanggal Lahir', key: 'dob', width: 16, align: 'center' },
      { header: 'Agama', key: 'religion', width: 12, align: 'center' },
      { header: 'Unit Sekolah', key: 'schoolName', width: 18, align: 'center' },
      { header: 'Tingkat / Rombel', key: 'classGrade', width: 16, align: 'center' },
      { header: 'Tahun Ajaran', key: 'academicYear', width: 16, align: 'center' },
      { header: 'Alamat Domisili', key: 'address', width: 36, align: 'left' },
      { header: 'Nama Ayah Kandung', key: 'fatherName', width: 24, align: 'left' },
      { header: 'No. HP Ayah / Wali', key: 'fatherPhone', width: 20, align: 'center' },
      { header: 'Pekerjaan Ayah', key: 'fatherJob', width: 20, align: 'left' },
      { header: 'Nama Ibu Kandung', key: 'motherName', width: 24, align: 'left' },
      { header: 'No. HP Ibu', key: 'motherPhone', width: 20, align: 'center' },
      { header: 'Pekerjaan Ibu', key: 'motherJob', width: 20, align: 'left' },
      { header: 'Status Siswa', key: 'status', width: 16, align: 'center' },
      { header: 'Catatan / Prestasi', key: 'notes', width: 30, align: 'left' },
    ];

    const exportRows = students.map((s, index) => {
      let p: any = {};
      try {
        p = typeof s.parentInfo === 'string' ? JSON.parse(s.parentInfo) : (s.parentInfo || {});
      } catch (e) {
        p = {};
      }

      const birthDate = new Date(s.dob).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

      return {
        no: index + 1,
        nis: s.nis || '-',
        nisn: s.nisn || '-',
        nik: s.nik || '-',
        fullName: s.fullName,
        gender: s.gender === 'L' ? 'L (Ikhwan)' : 'P (Akhwat)',
        pob: s.pob || '-',
        dob: birthDate,
        religion: s.religion || 'Islam',
        schoolName: s.school?.name || '-',
        classGrade: s.classGrade,
        academicYear: s.academicYear || '2026/2027',
        address: s.address || '-',
        fatherName: p.fatherName || '-',
        fatherPhone: p.fatherPhone || p.parentPhone || '-',
        fatherJob: p.fatherJob || '-',
        motherName: p.motherName || '-',
        motherPhone: p.motherPhone || '-',
        motherJob: p.motherJob || '-',
        status: s.status === 'ACTIVE' ? 'Aktif' : s.status,
        notes: s.notes || '-',
      };
    });

    const timestamp = new Date().toISOString().split('T')[0];
    exportToExcel({
      fileName: `buku-induk-murid-${schoolSlug || 'yayasan'}-${timestamp}`,
      sheetName: 'Buku Induk Murid',
      title: 'BUKU INDUK REKAM JEJAK MURID DIGITAL (DAPODIK & EMIS)',
      subtitle: `${schoolName} • Lingkungan Sekolah Terpadu Cigasong, Majalengka`,
      columns,
      data: exportRows,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-[#2D7A70] flex items-center justify-center text-white font-semibold">
              <GraduationCap className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Buku Induk Murid Digital
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#E8F3F1] text-[#184F48]">
              EMIS & DAPODIK Ready
            </span>
          </div>
          <p className="text-xs text-slate-500">
            {schoolName} • Tata kelola arsip rekam jejak siswa, nomor NIS resmi, dan dokumen buku induk A4.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Quick PPDB Convert Button with Badge */}
          {stats.unconvertedCount > 0 && (
            <button
              onClick={() => setIsConvertModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-xl transition-all cursor-pointer shadow-xs"
            >
              <UserPlus className="w-3.5 h-3.5 text-amber-700" />
              <span>Konversi Murid PPDB</span>
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px] font-semibold tabular-nums">
                {stats.unconvertedCount}
              </span>
            </button>
          )}

          {/* Export Excel Button */}
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-all cursor-pointer shadow-xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#2D7A70]" />
            <span>Ekspor EMIS/DAPODIK (.xlsx)</span>
          </button>

          {/* Add Student Button */}
          <button
            onClick={() => {
              setEditingStudent(null);
              setFormData({
                schoolSlug: schoolSlug || 'sd',
                nis: `2026-${(schoolSlug || 'sd').toUpperCase()}-${String(students.length + 1).padStart(4, '0')}`,
                nisn: '',
                fullName: '',
                gender: 'L',
                pob: 'Majalengka',
                dob: '2019-05-15',
                nik: '',
                religion: 'Islam',
                address: '',
                classGrade: schoolSlug === 'tk' ? 'TK A' : schoolSlug === 'sd' ? '1 SD IT' : '7 SMP IT',
                academicYear: '2026/2027',
                fatherName: '',
                fatherPhone: '',
                fatherJob: '',
                motherName: '',
                motherPhone: '',
                motherJob: '',
                status: 'ACTIVE',
                notes: ''
              });
              setFormError(null);
              setFormSuccess(null);
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#2D7A70] hover:bg-[#184F48] rounded-xl transition-all cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Murid</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#E8F3F1] flex items-center justify-center text-[#2D7A70]">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Total Murid</p>
            <p className="text-xl font-bold tracking-tight text-slate-900 tabular-nums">{stats.total || 0}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Ikhwan (L)</p>
            <p className="text-xl font-bold tracking-tight text-slate-900 tabular-nums">{stats.male || 0}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Akhwat (P)</p>
            <p className="text-xl font-bold tracking-tight text-slate-900 tabular-nums">{stats.female || 0}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Murid Aktif</p>
            <p className="text-xl font-bold tracking-tight text-emerald-700 tabular-nums">{stats.active || 0}</p>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari berdasarkan nama murid, NIS, NISN, atau NIK..."
              className="w-full pl-10 pr-20 py-2 text-xs border border-slate-300 rounded-xl bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2D7A70] transition-colors"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 text-[10px] font-bold text-white bg-[#2D7A70] hover:bg-[#184F48] rounded-lg cursor-pointer"
            >
              Cari
            </button>
          </form>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* School Selector if Foundation Superadmin */}
            {!schoolSlug && (
              <select
                value={selectedSchool}
                onChange={(e) => setSelectedSchool(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#2D7A70]"
              >
                <option value="ALL">Semua Unit Sekolah</option>
                <option value="tk">TK IT Al-Afiyah</option>
                <option value="sd">SD IT Al-Afiyah</option>
                <option value="smp">SMP IT Al-Afiyah</option>
              </select>
            )}

            {/* Class Filter */}
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#2D7A70]"
            >
              <option value="ALL">Semua Rombel/Kelas</option>
              {stats.classes?.map((c: string) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#2D7A70]"
            >
              <option value="ALL">Semua Status</option>
              <option value="ACTIVE">Murid Aktif</option>
              <option value="GRADUATED">Alumni / Lulus</option>
              <option value="TRANSFERRED">Mutasi Pindah</option>
            </select>

            <button
              onClick={fetchStudents}
              className="p-2 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              title="Refresh data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#2D7A70]' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold tracking-wider uppercase text-[10px]">
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4">NIS / NISN</th>
                <th className="py-3 px-4">Nama Lengkap Murid</th>
                <th className="py-3 px-4">Gender</th>
                <th className="py-3 px-4">Rombel / Kelas</th>
                <th className="py-3 px-4">Tempat, Tgl Lahir</th>
                <th className="py-3 px-4">Orang Tua & WhatsApp</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center w-36">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#2D7A70]" />
                    <span>Memuat data Buku Induk...</span>
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <GraduationCap className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <span>Belum ada data murid yang sesuai kriteria filter.</span>
                  </td>
                </tr>
              ) : (
                students.map((student, idx) => {
                  let p: any = {};
                  try {
                    p = typeof student.parentInfo === 'string' ? JSON.parse(student.parentInfo) : (student.parentInfo || {});
                  } catch (e) {
                    p = {};
                  }

                  const birthFormatted = new Date(student.dob).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  });

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 text-center text-slate-400 font-mono text-[11px]">
                        {idx + 1}
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        <div className="font-bold text-slate-900">{student.nis}</div>
                        <div className="text-[10px] text-slate-400">
                          {student.nisn ? `NISN: ${student.nisn}` : 'NISN: -'}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{student.fullName}</div>
                        <div className="text-[10px] text-slate-500">
                          {student.school?.name} • NIK: {student.nik || '-'}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                            student.gender === 'L'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-pink-50 text-pink-700 border border-pink-200'
                          }`}
                        >
                          {student.gender === 'L' ? 'L (Ikhwan)' : 'P (Akhwat)'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-[#184F48] bg-[#E8F3F1] px-2 py-0.5 rounded-md text-[11px]">
                          {student.classGrade}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {student.academicYear || '2026/2027'}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">
                        <div>{student.pob}</div>
                        <div className="text-[10px] text-slate-400">{birthFormatted}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-800">
                          {p.fatherName || p.motherName || '-'}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {p.fatherPhone || p.motherPhone || p.parentPhone || '-'}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            student.status === 'ACTIVE'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : student.status === 'GRADUATED'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {student.status === 'ACTIVE' ? 'Aktif' : student.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Print Dossier */}
                          <button
                            onClick={() => {
                              setSelectedStudentForPrint(student);
                              setIsPrintModalOpen(true);
                            }}
                            className="p-1.5 text-slate-600 hover:text-white bg-slate-100 hover:bg-[#2D7A70] rounded-lg transition-colors cursor-pointer"
                            title="Cetak Lembar Buku Induk A4"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit Student */}
                          <button
                            onClick={() => handleEditClick(student)}
                            className="p-1.5 text-slate-600 hover:text-white bg-slate-100 hover:bg-amber-600 rounded-lg transition-colors cursor-pointer"
                            title="Edit Data Murid"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Student */}
                          <button
                            onClick={() => handleDeleteStudent(student.id, student.fullName)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Hapus dari Buku Induk"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Convert PPDB Modal */}
      {isConvertModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="flex items-center justify-between px-6 py-4 bg-[#184F48] text-white">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-amber-300" />
                <h3 className="text-base font-bold">Konversi Murid PPDB ke Buku Induk</h3>
              </div>
              <button
                onClick={() => setIsConvertModalOpen(false)}
                className="p-1 text-emerald-200 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <p className="text-xs text-slate-600 mb-4">
                Daftar calon murid baru hasil seleksi PPDB berstatus <strong>ACCEPTED</strong> yang belum diterbitkan Nomor Induk Murid (NIS) lokal Al-Afiyah:
              </p>

              {unconvertedPPDB.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  Semua murid yang diterima telah dikonversi ke Buku Induk.
                </div>
              ) : (
                <div className="space-y-3">
                  {unconvertedPPDB.map((reg) => (
                    <div
                      key={reg.id}
                      className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition-colors"
                    >
                      <div>
                        <div className="font-bold text-xs text-slate-900">{reg.studentName}</div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {reg.registrationNo} • {reg.school?.name} • NIK: {reg.nik}
                        </div>
                        {reg.reRegistration && (
                          <span className="inline-block mt-1 px-2 py-0.2 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800">
                            Telah Daftar Ulang (Seragam: {reg.reRegistration.uniformSize})
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleConvertPPDB(reg.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#2D7A70] hover:bg-[#184F48] rounded-lg transition-colors cursor-pointer shadow-xs"
                      >
                        <GraduationCap className="w-3.5 h-3.5" />
                        <span>Terbitkan NIS</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-right">
              <button
                onClick={() => setIsConvertModalOpen(false)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-200 cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden my-6 border border-slate-200">
            <div className="flex items-center justify-between px-6 py-4 bg-[#184F48] text-white">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-amber-300" />
                <h3 className="text-base font-bold">
                  {editingStudent ? 'Edit Data Buku Induk Murid' : 'Tambah Murid ke Buku Induk'}
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-emerald-200 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              {formSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{formSuccess}</span>
                </div>
              )}
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-300 text-rose-800 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Unit & Identifiers */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Unit Sekolah *</label>
                  <select
                    value={formData.schoolSlug}
                    onChange={(e) => setFormData({ ...formData, schoolSlug: e.target.value })}
                    disabled={!!editingStudent}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="tk">TK IT Al-Afiyah</option>
                    <option value="sd">SD IT Al-Afiyah</option>
                    <option value="smp">SMP IT Al-Afiyah</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">NIS (Nomor Induk) *</label>
                  <input
                    type="text"
                    required
                    value={formData.nis}
                    onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                    placeholder="misal: 2026-SD-0001"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">NISN Kemendikbud</label>
                  <input
                    type="text"
                    value={formData.nisn}
                    onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                    placeholder="10 digit angka"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              {/* Biodata */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap Murid *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Nama lengkap sesuai akta"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jenis Kelamin *</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="L">Laki-laki (Ikhwan)</option>
                    <option value="P">Perempuan (Akhwat)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tempat Lahir *</label>
                  <input
                    type="text"
                    required
                    value={formData.pob}
                    onChange={(e) => setFormData({ ...formData, pob: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal Lahir *</label>
                  <input
                    type="date"
                    required
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">NIK Murid</label>
                  <input
                    type="text"
                    value={formData.nik}
                    onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                    placeholder="16 digit NIK"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              {/* Class and Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Rombel / Kelas *</label>
                  <input
                    type="text"
                    required
                    value={formData.classGrade}
                    onChange={(e) => setFormData({ ...formData, classGrade: e.target.value })}
                    placeholder="misal: 1 SD IT A"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tahun Pelajaran *</label>
                  <input
                    type="text"
                    required
                    value={formData.academicYear}
                    onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status Murid</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="ACTIVE">Murid Aktif</option>
                    <option value="GRADUATED">Lulus / Alumni</option>
                    <option value="TRANSFERRED">Mutasi Keluar</option>
                    <option value="DROPPED">Non-Aktif</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Alamat Domisili Lengkap *</label>
                <textarea
                  rows={2}
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Nama jalan, RT/RW, Desa/Kelurahan, Kecamatan, Kabupaten"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              {/* Parent Info */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <h5 className="font-bold text-slate-800 text-xs">Data Orang Tua / Wali</h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Nama Ayah Kandung"
                    value={formData.fatherName}
                    onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                    className="px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                  />
                  <input
                    type="text"
                    placeholder="No. WhatsApp Ayah/Wali"
                    value={formData.fatherPhone}
                    onChange={(e) => setFormData({ ...formData, fatherPhone: e.target.value })}
                    className="px-3 py-1.5 border border-slate-300 rounded-lg bg-white font-mono"
                  />
                  <input
                    type="text"
                    placeholder="Pekerjaan Ayah"
                    value={formData.fatherJob}
                    onChange={(e) => setFormData({ ...formData, fatherJob: e.target.value })}
                    className="px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Nama Ibu Kandung"
                    value={formData.motherName}
                    onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                    className="px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Pekerjaan Ibu"
                    value={formData.motherJob}
                    onChange={(e) => setFormData({ ...formData, motherJob: e.target.value })}
                    className="px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Catatan Khusus / Tahfidz</label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="misal: Capaian hafalan Juz 30, riwayat beasiswa, dll."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 font-bold text-white bg-[#2D7A70] hover:bg-[#184F48] rounded-lg transition-all cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Menyimpan...' : editingStudent ? 'Simpan Perubahan' : 'Daftarkan Murid'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official A4 Print Modal */}
      {selectedStudentForPrint && (
        <StudentDossierPrintModal
          isOpen={isPrintModalOpen}
          onClose={() => {
            setIsPrintModalOpen(false);
            setSelectedStudentForPrint(null);
          }}
          student={selectedStudentForPrint}
        />
      )}
    </div>
  );
};
