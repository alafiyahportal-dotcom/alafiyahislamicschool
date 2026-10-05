'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Calendar,
  FileText,
  Eye,
  MessageCircle,
  Award,
  XCircle,
  ChevronRight,
  Printer,
  Phone,
  ShieldCheck,
  Building,
  MapPin,
  X,
  Send,
  Loader2,
  Download
} from 'lucide-react';
import { exportToExcel, ExcelColumn } from '@/lib/excelExport';
import DocumentViewerModal from './DocumentViewerModal';
import { AssessmentRubricModal } from './AssessmentRubricModal';
import ApplicantDetailBiodataModal from './ApplicantDetailBiodataModal';
import { calculateAgePerJuly2027 } from '@/types/sdit-form';

export interface ApplicantItem {
  id: string;
  registrationNo: string;
  studentName: string;
  gender: string;
  nik: string;
  pob?: string;
  dob?: string;
  address?: string;
  schoolSlug: string;
  schoolName: string;
  registrationFee: number;
  status: string;
  parentName: string;
  parentPhone: string;
  registrationPath: string;
  schoolSpecificDetails: Record<string, any>;
  schoolSpecificDataRaw?: Record<string, any>;
  parentDataRaw?: Record<string, any>;
  assessment?: any;
  documents: Array<{
    id: string;
    docType: string;
    fileName: string;
    fileUrl: string;
    verificationStatus?: string;
    notes?: string | null;
  }>;
  createdAt: string;
}

interface PPDBVerificationClientProps {
  schoolSlug: string;
  schoolName: string;
  applicants: ApplicantItem[];
}

export default function PPDBVerificationClient({
  schoolSlug,
  schoolName,
  applicants: initialApplicants
}: PPDBVerificationClientProps) {
  const [applicants, setApplicants] = useState<ApplicantItem[]>(initialApplicants);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  // Modal States
  const [selectedApplicant, setSelectedApplicant] = useState<ApplicantItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedApplicantForDetail, setSelectedApplicantForDetail] = useState<ApplicantItem | null>(null);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [selectedApplicantForAssessment, setSelectedApplicantForAssessment] = useState<ApplicantItem | null>(null);
  const [activeDocItem, setActiveDocItem] = useState<{
    id: string;
    docType: string;
    fileName: string;
    fileUrl: string;
    verificationStatus?: string;
    notes?: string | null;
  } | null>(null);

  // Schedule Form State
  const [scheduleDate, setScheduleDate] = useState('Sabtu, 28 Maret 2026 Pukul 08.30 WIB');
  const [testLocation, setTestLocation] = useState(`Gedung Utama ${schoolName} Majalengka`);

  const handleDocStatusUpdated = (docId: string, newStatus: string, notes?: string) => {
    setApplicants((prev) =>
      prev.map((app) => {
        if (selectedApplicant && app.id === selectedApplicant.id) {
          const updatedDocs = app.documents.map((d) =>
            d.id === docId ? { ...d, verificationStatus: newStatus, notes: notes !== undefined ? notes : d.notes } : d
          );
          return { ...app, documents: updatedDocs };
        }
        return app;
      })
    );

    if (selectedApplicant) {
      setSelectedApplicant((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          documents: prev.documents.map((d) =>
            d.id === docId ? { ...d, verificationStatus: newStatus, notes: notes !== undefined ? notes : d.notes } : d
          ),
        };
      });
    }

    if (activeDocItem && activeDocItem.id === docId) {
      setActiveDocItem((prev) => (prev ? { ...prev, verificationStatus: newStatus, notes: notes !== undefined ? notes : prev.notes } : null));
    }
  };

  // Filtering
  const filteredApplicants = applicants.filter((item) => {
    const matchesSearch =
      item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.registrationNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.parentPhone.includes(searchTerm);
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Stats
  const totalCount = applicants.length;
  const pendingCount = applicants.filter((a) => a.status === 'SUBMITTED').length;
  const verifiedCount = applicants.filter((a) => a.status === 'VERIFIED').length;
  const scheduledCount = applicants.filter((a) => a.status === 'INTERVIEW_SCHEDULED').length;
  const acceptedCount = applicants.filter((a) => a.status === 'ACCEPTED').length;

  const handleExportExcel = () => {
    if (filteredApplicants.length === 0) {
      alert('Tidak ada data pendaftar untuk diekspor.');
      return;
    }

    const columns: ExcelColumn[] = [
      { header: 'No', key: 'no', width: 6, align: 'center' },
      { header: 'No. Registrasi', key: 'registrationNo', width: 18, align: 'center' },
      { header: 'Nama Lengkap Murid', key: 'studentName', width: 28, align: 'left' },
      { header: 'Nama Panggilan', key: 'nickname', width: 16, align: 'left' },
      { header: 'Jenis Kelamin', key: 'gender', width: 14, align: 'center' },
      { header: 'NIK Murid', key: 'nik', width: 20, align: 'center' },
      { header: 'Tempat Lahir', key: 'pob', width: 18, align: 'left' },
      { header: 'Tanggal Lahir', key: 'dob', width: 16, align: 'center' },
      { header: 'Usia per 1 Juli 2027', key: 'ageJuly2027', width: 20, align: 'center' },
      { header: 'Unit Sekolah', key: 'schoolName', width: 18, align: 'center' },
      { header: 'Jalur Masuk', key: 'registrationPath', width: 18, align: 'center' },
      { header: 'Anak Ke-', key: 'childOrder', width: 10, align: 'center' },
      { header: 'Jml Saudara', key: 'siblings', width: 14, align: 'center' },
      { header: 'TB (cm)', key: 'heightCm', width: 10, align: 'center' },
      { header: 'BB (kg)', key: 'weightKg', width: 10, align: 'center' },
      { header: 'Gol. Darah', key: 'bloodType', width: 12, align: 'center' },
      { header: 'Riwayat Sakit / Alergi', key: 'diseaseHistory', width: 26, align: 'left' },
      { header: 'Alamat Domisili', key: 'address', width: 35, align: 'left' },
      { header: 'Jarak ke Sekolah (km)', key: 'distanceKm', width: 18, align: 'center' },
      { header: 'Tinggal Bersama', key: 'livingWith', width: 18, align: 'left' },
      { header: 'Berangkat Sekolah', key: 'transportation', width: 18, align: 'left' },
      { header: 'Asal TK / Sekolah Asal', key: 'originSchool', width: 28, align: 'left' },
      { header: 'Kesiapan Calistung', key: 'reading', width: 22, align: 'left' },
      { header: 'Iqro / Al-Qur\'an', key: 'iqro', width: 18, align: 'left' },
      { header: 'Nama Ayah Kandung', key: 'fatherName', width: 24, align: 'left' },
      { header: 'NIK Ayah', key: 'fatherNik', width: 18, align: 'center' },
      { header: 'Pendidikan Ayah', key: 'fatherEducation', width: 16, align: 'center' },
      { header: 'Pekerjaan Ayah', key: 'fatherJob', width: 20, align: 'left' },
      { header: 'Instansi Ayah', key: 'fatherCompany', width: 22, align: 'left' },
      { header: 'No. HP Ayah', key: 'fatherPhone', width: 18, align: 'center' },
      { header: 'Nama Ibu Kandung', key: 'motherName', width: 24, align: 'left' },
      { header: 'NIK Ibu', key: 'motherNik', width: 18, align: 'center' },
      { header: 'Pendidikan Ibu', key: 'motherEducation', width: 16, align: 'center' },
      { header: 'Pekerjaan Ibu', key: 'motherJob', width: 20, align: 'left' },
      { header: 'Instansi Ibu', key: 'motherCompany', width: 22, align: 'left' },
      { header: 'No. WhatsApp Ibu / Ortu', key: 'parentPhone', width: 20, align: 'center' },
      { header: 'Penghasilan Ortu', key: 'income', width: 24, align: 'left' },
      { header: 'Alasan Memilih SDIT', key: 'mainReason', width: 30, align: 'left' },
      { header: 'Status Seleksi', key: 'statusFormatted', width: 22, align: 'center' },
      { header: 'Skor Observasi', key: 'assessmentScore', width: 14, align: 'center' },
      { header: 'Tanggal Pendaftaran', key: 'createdFormatted', width: 22, align: 'center' },
    ];

    const exportRows = filteredApplicants.map((a, idx) => {
      const p = a.parentDataRaw || {};
      const s = a.schoolSpecificDataRaw || a.schoolSpecificDetails || {};
      const ageCalc = calculateAgePerJuly2027(a.dob || '2021-05-14');

      return {
        no: idx + 1,
        registrationNo: a.registrationNo,
        studentName: a.studentName,
        nickname: s.nickname || '-',
        gender: a.gender === 'L' ? 'Laki-Laki (L)' : 'Perempuan (P)',
        nik: a.nik || '-',
        pob: a.pob || s.pob || 'Majalengka',
        dob: a.dob || '-',
        ageJuly2027: ageCalc.text,
        schoolName: a.schoolName,
        registrationPath: a.registrationPath,
        childOrder: s.childOrder || '1',
        siblings: `${s.siblingsCount || 0} Kandung / ${s.stepSiblingsCount || 0} Tiri`,
        heightCm: s.heightCm || '-',
        weightKg: s.weightKg || '-',
        bloodType: s.bloodType || 'Belum Tahu',
        diseaseHistory: s.diseaseHistory || 'Tidak Ada',
        address: a.address || s.address || '-',
        distanceKm: s.distanceToSchoolKm || '2',
        livingWith: s.livingWith || 'Kedua Orang Tua',
        transportation: s.transportation || 'Diantar',
        originSchool: s.originSchoolName || '-',
        reading: s.reading || '-',
        iqro: s.iqro || '-',
        fatherName: p.fatherName || '-',
        fatherNik: p.fatherNik || '-',
        fatherEducation: p.fatherEducation || '-',
        fatherJob: p.fatherJob || '-',
        fatherCompany: p.fatherCompany || '-',
        fatherPhone: p.fatherPhone || '-',
        motherName: p.motherName || '-',
        motherNik: p.motherNik || '-',
        motherEducation: p.motherEducation || '-',
        motherJob: p.motherJob || '-',
        motherCompany: p.motherCompany || '-',
        parentPhone: a.parentPhone || p.motherPhone || p.phone || '-',
        income: p.incomeRange || p.income || '-',
        mainReason: s.mainReason || 'Karakter & Tahfidz',
        statusFormatted:
          a.status === 'VERIFIED'
            ? 'Berkas Lunas Terverifikasi'
            : a.status === 'ACCEPTED'
            ? 'Diterima (Lulus)'
            : a.status === 'INTERVIEW_SCHEDULED'
            ? 'Terjadwal Observasi'
            : a.status === 'REJECTED'
            ? 'Cadangan / Ditolak'
            : 'Menunggu Review',
        assessmentScore: a.assessment?.totalScore ? String(a.assessment.totalScore) : '-',
        createdFormatted: a.createdAt,
      };
    });

    exportToExcel({
      fileName: `PPDB_${schoolSlug.toUpperCase()}_LENGKAP_28_BUTIR_${new Date().toISOString().slice(0, 10)}`,
      sheetName: `PPDB ${schoolSlug.toUpperCase()} 28 Butir`,
      title: `REKAPITULASI DETAIL LENGKAP FORMULIR 28 BUTIR PPDB ${schoolSlug.toUpperCase()} AL-AFIYAH`,
      subtitle: `Yayasan Pendidikan Imam Bonjol Majalengka • Tahun Ajaran 2027/2028 • Arsip Panitia`,
      columns,
      data: exportRows,
    });
  };

  const handleUpdateStatus = async (
    id: string,
    newStatus: string,
    extraData?: { scheduleDate?: string; testLocation?: string }
  ) => {
    setIsUpdating(id);
    try {
      const res = await fetch(`/api/admin/registrations/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          ...extraData
        })
      });
      if (res.ok) {
        setApplicants((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
        );
        setIsScheduleModalOpen(false);
      }
    } catch (err) {
      console.error('Failed to update status', err);
    } finally {
      setIsUpdating(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            <span>Diterima (Lulus)</span>
          </span>
        );
      case 'INTERVIEW_SCHEDULED':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-300">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>Terjadwal Observasi</span>
          </span>
        );
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#E8F3F1] text-[#2D7A70] border border-[#2D7A70]/30">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#2D7A70]" />
            <span>Berkas Lunas Terverifikasi</span>
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>Cadangan / Ditolak</span>
          </span>
        );
      case 'SUBMITTED':
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Menunggu Verifikasi</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Total Pendaftar</p>
          <p className="text-xl font-bold text-slate-900 mt-1">{totalCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs text-amber-600 font-medium">Perlu Verifikasi</p>
          <p className="text-xl font-bold text-amber-700 mt-1">{pendingCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs text-[#2D7A70] font-medium">Berkas Valid</p>
          <p className="text-xl font-bold text-[#2D7A70] mt-1">{verifiedCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs text-blue-600 font-medium">Jadwal Observasi</p>
          <p className="text-xl font-bold text-blue-700 mt-1">{scheduledCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs col-span-2 sm:col-span-1">
          <p className="text-xs text-emerald-600 font-medium">Murid Diterima</p>
          <p className="text-xl font-bold text-emerald-700 mt-1">{acceptedCount}</p>
        </div>
      </div>

      {/* Main Table Card (Google Workspace Style) */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        {/* Table Header & Controls */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex items-center space-x-2 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari murid, no. reg, nama ortu, atau WhatsApp..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#2D7A70] focus:ring-1 focus:ring-[#2D7A70]"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 flex-1 sm:flex-initial">
              <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-auto bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 focus:outline-hidden focus:border-[#2D7A70]"
              >
                <option value="ALL">Semua Status Seleksi</option>
                <option value="SUBMITTED">Menunggu Verifikasi</option>
                <option value="VERIFIED">Berkas Lunas Terverifikasi</option>
                <option value="INTERVIEW_SCHEDULED">Terjadwal Observasi</option>
                <option value="ACCEPTED">Diterima</option>
                <option value="REJECTED">Cadangan / Ditolak</option>
              </select>
            </div>

            <button
              type="button"
              onClick={handleExportExcel}
              className="w-full sm:w-auto justify-center px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold inline-flex items-center space-x-1.5 transition-colors shadow-2xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Ekspor Excel (.xlsx)</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-100/70 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Calon Murid & No. Reg</th>
                <th className="py-3 px-4">Wali Murid & Kontak</th>
                <th className="py-3 px-4">Berkas Persyaratan</th>
                <th className="py-3 px-4">Status Seleksi</th>
                <th className="py-3 px-4 text-right">Tindakan Seleksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApplicants.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-medium text-slate-600">Tidak ada data pendaftar yang sesuai</p>
                    <p className="text-[11px] text-slate-400 mt-1">Coba ubah kata kunci pencarian atau filter status</p>
                  </td>
                </tr>
              ) : (
                filteredApplicants.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Calon Murid */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{item.studentName}</span>
                        {item.schoolSpecificDetails?.nickname && (
                          <span className="text-[10px] text-slate-500 font-medium italic">
                            ({item.schoolSpecificDetails.nickname})
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 mt-0.5 flex-wrap gap-y-1">
                        <span className="font-mono text-[11px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-semibold">
                          {item.registrationNo}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-[11px] text-slate-600">{item.gender === 'L' ? 'Laki-Laki' : 'Perempuan'}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-[11px] text-emerald-700 font-bold">{item.registrationPath}</span>
                        {item.dob && (
                          <>
                            <span className="text-slate-300">•</span>
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                              Usia: {calculateAgePerJuly2027(item.dob).text}
                            </span>
                          </>
                        )}
                        {item.assessment && (
                          <>
                            <span className="text-slate-300">•</span>
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-50 text-amber-900 border border-amber-300">
                              <Award className="w-3 h-3 text-amber-600" />
                              <span>Skor: {item.assessment.totalScore}</span>
                            </span>
                          </>
                        )}
                      </div>
                      {item.schoolSpecificDetails?.originSchoolName && (
                        <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                          <Building className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[240px]">TK/Asal: {item.schoolSpecificDetails.originSchoolName}</span>
                        </div>
                      )}
                    </td>

                    {/* Wali & Kontak */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{item.parentName}</div>
                      <a
                        href={`https://wa.me/${item.parentPhone.startsWith('0') ? '62' + item.parentPhone.slice(1) : item.parentPhone}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-1 text-emerald-700 hover:text-emerald-800 font-mono mt-0.5"
                      >
                        <Phone className="w-3 h-3 text-emerald-600" />
                        <span>{item.parentPhone}</span>
                      </a>
                    </td>

                    {/* Berkas */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-1.5 items-start">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedApplicant(item);
                            setIsDocModalOpen(true);
                          }}
                          className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors border border-slate-200 cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5 text-slate-500" />
                          <span>{item.documents.length} Dokumen Digital</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedApplicantForDetail(item);
                            setIsDetailModalOpen(true);
                          }}
                          className="inline-flex items-center space-x-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 cursor-pointer"
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Checklist Berkas Fisik &rarr;</span>
                        </button>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">{getStatusBadge(item.status)}</td>

                    {/* Tindakan */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center space-x-1.5">
                        {/* Tombol Detail Lengkap (28 Butir Formulir) */}
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedApplicantForDetail(item);
                            setIsDetailModalOpen(true);
                          }}
                          className="px-2.5 py-1 rounded-md bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all flex items-center space-x-1 shadow-2xs cursor-pointer"
                          title="Buka Lembar Lengkap Formulir 28 Butir & Dokumen Murid"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Detail Lengkap</span>
                        </button>

                        {/* Assessment / Rubric Button */}
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedApplicantForAssessment(item);
                            setIsAssessmentModalOpen(true);
                          }}
                          className="px-2 py-1 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold border border-amber-300 transition-colors flex items-center space-x-1 cursor-pointer"
                          title="Uji Observasi & Input Nilai"
                        >
                          <Award className="w-3.5 h-3.5 text-amber-600" />
                          <span>{item.assessment ? `Nilai: ${item.assessment.totalScore}` : 'Asesmen'}</span>
                        </button>

                        {item.status === 'SUBMITTED' && (
                          <button
                            type="button"
                            disabled={isUpdating === item.id}
                            onClick={() => handleUpdateStatus(item.id, 'VERIFIED')}
                            className="px-2.5 py-1 rounded-md bg-[#E8F3F1] hover:bg-[#d5ebe7] text-[#2D7A70] text-xs font-semibold border border-[#2D7A70]/30 transition-colors"
                          >
                            {isUpdating === item.id ? (
                              <Loader2 className="w-3 h-3 animate-spin inline" />
                            ) : (
                              'Verifikasi Berkas'
                            )}
                          </button>
                        )}

                        {(item.status === 'VERIFIED' || item.status === 'SUBMITTED') && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedApplicant(item);
                              setIsScheduleModalOpen(true);
                            }}
                            className="px-2.5 py-1 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold border border-blue-200 transition-colors flex items-center space-x-1"
                          >
                            <Calendar className="w-3 h-3" />
                            <span>Jadwalkan Tes</span>
                          </button>
                        )}

                        {item.status === 'INTERVIEW_SCHEDULED' && (
                          <>
                            <button
                              type="button"
                              disabled={isUpdating === item.id}
                              onClick={() => handleUpdateStatus(item.id, 'ACCEPTED')}
                              className="px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-2xs transition-colors"
                            >
                              Luluskan
                            </button>
                            <button
                              type="button"
                              disabled={isUpdating === item.id}
                              onClick={() => handleUpdateStatus(item.id, 'REJECTED')}
                              className="px-2.5 py-1 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold border border-rose-200 transition-colors"
                            >
                              Cadangan
                            </button>
                          </>
                        )}

                        <Link
                          href={`/portal/ppdb/${item.registrationNo}`}
                          target="_blank"
                          className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition-colors"
                          title="Buka Portal Murid"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal 1: Pratinjau Dokumen Unggahan */}
      {isDocModalOpen && selectedApplicant && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Dokumen Persyaratan: {selectedApplicant.studentName}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  {selectedApplicant.registrationNo} • {selectedApplicant.schoolName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsDocModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {selectedApplicant.documents.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  Tidak ada dokumen yang diunggah secara daring.
                </div>
              ) : (
                selectedApplicant.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {doc.docType}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="text-xs font-semibold text-slate-900">
                            {doc.docType === 'KK' ? 'Kartu Keluarga (KK)' : doc.docType === 'AKTA' ? 'Akta Kelahiran' : 'Pas Foto Murid'}
                          </p>
                          {doc.verificationStatus === 'VALID' ? (
                            <span className="px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                              SAH
                            </span>
                          ) : doc.verificationStatus === 'INVALID' ? (
                            <span className="px-1.5 py-0.2 rounded-md bg-rose-100 text-rose-800 text-[10px] font-bold">
                              REVISI
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold">
                              PENDING
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500">{doc.fileName}</p>
                        {doc.notes && (
                          <p className="text-[10px] text-rose-600 italic mt-0.5">Catatan: {doc.notes}</p>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveDocItem(doc)}
                      className="py-1.5 px-3 rounded-lg bg-white border border-[#2D7A70]/40 text-[#184F48] hover:bg-[#E8F3F1] text-xs font-bold transition-colors flex items-center space-x-1.5 cursor-pointer shadow-2xs"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#2D7A70]" />
                      <span>Periksa Berkas</span>
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsDocModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer"
              >
                Tutup
              </button>
              {selectedApplicant.status === 'SUBMITTED' && (
                <button
                  type="button"
                  onClick={() => {
                    handleUpdateStatus(selectedApplicant.id, 'VERIFIED');
                    setIsDocModalOpen(false);
                  }}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer"
                >
                  Sahkan Semua & Lanjut ke Verifikasi
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Document Viewer Modal */}
      {selectedApplicant && (
        <DocumentViewerModal
          isOpen={!!activeDocItem}
          onClose={() => setActiveDocItem(null)}
          document={activeDocItem}
          studentName={selectedApplicant.studentName}
          regNo={selectedApplicant.registrationNo}
          onStatusUpdated={handleDocStatusUpdated}
        />
      )}

      {/* Modal 2: Atur Jadwal Observasi & Wawancara */}
      {isScheduleModalOpen && selectedApplicant && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Atur Jadwal Observasi & Wawancara
                </h3>
                <p className="text-xs text-slate-500">
                  Murid: <span className="font-semibold text-slate-800">{selectedApplicant.studentName}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsScheduleModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Hari & Waktu Pelaksanaan
                </label>
                <input
                  type="text"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:border-[#2D7A70]"
                  placeholder="Contoh: Sabtu, 28 Maret 2026 Pukul 08.30 WIB"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Lokasi / Ruang Observasi
                </label>
                <input
                  type="text"
                  value={testLocation}
                  onChange={(e) => setTestLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:border-[#2D7A70]"
                  placeholder="Contoh: Gedung Al-Afiyah, Ruang Wawancara 2"
                />
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-[11px] leading-relaxed flex items-start space-x-2">
                <MessageCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>
                  Menyimpan jadwal ini akan secara otomatis memicu pengiriman pesan WhatsApp resmi ke nomor wali murid (<strong>{selectedApplicant.parentPhone}</strong>) berisi tanggal, jam, dan lokasi ujian.
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsScheduleModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isUpdating === selectedApplicant.id}
                onClick={() =>
                  handleUpdateStatus(selectedApplicant.id, 'INTERVIEW_SCHEDULED', {
                    scheduleDate,
                    testLocation
                  })
                }
                className="px-4 py-2 bg-[#2D7A70] hover:bg-[#184F48] text-white text-xs font-semibold rounded-lg flex items-center space-x-1.5 shadow-2xs"
              >
                {isUpdating === selectedApplicant.id ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>Simpan & Kirim Undangan WA</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Asesmen Observasi PPDB */}
      {isAssessmentModalOpen && selectedApplicantForAssessment && (
        <AssessmentRubricModal
          isOpen={isAssessmentModalOpen}
          onClose={() => {
            setIsAssessmentModalOpen(false);
            setSelectedApplicantForAssessment(null);
          }}
          registration={{
            ...selectedApplicantForAssessment,
            school: {
              slug: selectedApplicantForAssessment.schoolSlug,
              name: selectedApplicantForAssessment.schoolName,
              unitLevel: selectedApplicantForAssessment.schoolSlug.toUpperCase()
            }
          }}
          onSaved={() => {
            window.location.reload();
          }}
        />
      )}

      {/* Modal 4: Detail Lengkap 28 Butir & Berkas Fisik/Digital */}
      {isDetailModalOpen && selectedApplicantForDetail && (
        <ApplicantDetailBiodataModal
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedApplicantForDetail(null);
          }}
          applicant={selectedApplicantForDetail}
          onDataUpdated={() => {
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}
