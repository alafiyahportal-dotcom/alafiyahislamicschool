'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  CreditCard,
  CheckCircle2,
  Share2,
  Search,
  Filter,
  Download,
  ArrowUpRight,
  Clock,
  Building2,
  Calendar,
  AlertCircle,
  FileSpreadsheet,
  Layers,
  Trash2,
  Loader2
} from 'lucide-react';
import StudentEduAvatar from '@/components/common/StudentEduAvatar';
import EdukaStatCards from './EdukaStatCards';
import EdukaSplineChart from './EdukaSplineChart';
import EdukaDonutChart from './EdukaDonutChart';
import EdukaUnitTable from './EdukaUnitTable';
import EdukaRecentStudents from './EdukaRecentStudents';
import { exportToExcel, ExcelColumn } from '@/lib/excelExport';

interface SchoolStat {
  id: string;
  name: string;
  slug: string;
  badgeText: string;
  totalApplicants: number;
  verifiedApplicants: number;
  totalRevenue: number;
  targetQuota: number;
}

interface ApplicantRecord {
  id: string;
  registrationNo: string;
  studentName: string;
  gender?: string;
  schoolName: string;
  schoolSlug: string;
  parentName: string;
  parentPhone: string;
  registrationPath: string;
  status: string;
  paymentStatus: string;
  amount: number;
  createdAt: string;
}

interface FoundationDashboardClientProps {
  stats: {
    totalStudents: number;
    totalRevenue: number;
    totalVerified: number;
    totalAffiliates: number;
  };
  schools: SchoolStat[];
  initialApplicants: ApplicantRecord[];
  currentSchoolSlug?: 'tk' | 'sd' | 'smp' | 'foundation';
  schoolName?: string;
  totalTeachers?: number;
}

export default function FoundationDashboardClient({
  stats,
  schools,
  initialApplicants,
  currentSchoolSlug = 'foundation',
  schoolName = 'Yayasan Pendidikan Imam Bonjol',
  totalTeachers
}: FoundationDashboardClientProps) {
  const isFoundation = currentSchoolSlug === 'foundation';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSchool, setSelectedSchool] = useState(isFoundation ? 'ALL' : currentSchoolSlug);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [applicants, setApplicants] = useState<ApplicantRecord[]>(initialApplicants);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const filteredApplicants = applicants.filter((item) => {
    const matchesSearch =
      item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.registrationNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.parentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSchool = selectedSchool === 'ALL' || item.schoolSlug === selectedSchool;
    const matchesStatus = selectedStatus === 'ALL' || item.status === selectedStatus;
    return matchesSearch && matchesSchool && matchesStatus;
  });

  const handleStatusChange = async (id: string, newStatus: string) => {
    setIsUpdating(id);
    try {
      const res = await fetch(`/api/admin/registrations/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setApplicants((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, status: newStatus } : item
          )
        );
      }
    } catch (e) {
      console.error('Failed to update status', e);
    } finally {
      setIsUpdating(null);
    }
  };

  const handleDeleteApplicant = async (id: string, studentName: string, regNo: string) => {
    const isConfirmed = window.confirm(
      `Apakah Anda yakin ingin menghapus data pendaftaran ananda ${studentName} (${regNo})?\n\nData ini akan dibersihkan secara permanen dari sistem.`
    );
    if (!isConfirmed) return;

    setIsDeleting(id);
    try {
      const res = await fetch(`/api/admin/registrations/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        setApplicants((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert(data.error || 'Gagal menghapus data pendaftaran');
      }
    } catch (e) {
      console.error('Failed to delete registration', e);
      alert('Terjadi gangguan jaringan saat menghapus data.');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleExportExcel = () => {
    if (filteredApplicants.length === 0) {
      alert('Tidak ada data murid untuk diekspor.');
      return;
    }

    const columns: ExcelColumn[] = [
      { header: 'No', key: 'no', width: 6, align: 'center' },
      { header: 'No. Registrasi', key: 'registrationNo', width: 18, align: 'center' },
      { header: 'Nama Lengkap Murid', key: 'studentName', width: 28, align: 'left' },
      { header: 'Unit Sekolah', key: 'schoolName', width: 18, align: 'center' },
      { header: 'Jalur Pendaftaran', key: 'registrationPath', width: 20, align: 'center' },
      { header: 'Nama Orang Tua / Wali', key: 'parentName', width: 26, align: 'left' },
      { header: 'No. WhatsApp', key: 'parentPhone', width: 18, align: 'center' },
      { header: 'Status Seleksi', key: 'statusFormatted', width: 20, align: 'center' },
      { header: 'Status Pembayaran', key: 'paymentStatusFormatted', width: 20, align: 'center' },
      { header: 'Biaya Formulir', key: 'amountFormatted', width: 18, align: 'right' },
      { header: 'Tanggal Pendaftaran', key: 'createdFormatted', width: 22, align: 'center' },
    ];

    const exportRows = filteredApplicants.map((a, idx) => ({
      no: idx + 1,
      registrationNo: a.registrationNo,
      studentName: a.studentName,
      schoolName: a.schoolName,
      registrationPath: a.registrationPath,
      parentName: a.parentName,
      parentPhone: a.parentPhone,
      statusFormatted:
        a.status === 'VERIFIED'
          ? 'Berkas Terverifikasi'
          : a.status === 'ACCEPTED'
          ? 'Lulus Seleksi (Accepted)'
          : a.status === 'INTERVIEW_SCHEDULED'
          ? 'Jadwal Wawancara'
          : 'Menunggu Review',
      paymentStatusFormatted: a.paymentStatus === 'PAID' ? 'Lunas (PAID)' : 'Menunggu Bayar',
      amountFormatted: `Rp ${(a.amount || 0).toLocaleString('id-ID')}`,
      createdFormatted: new Date(a.createdAt).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    }));

    exportToExcel({
      fileName: `PPDB_Konsolidasi_Yayasan_${new Date().toISOString().slice(0, 10)}`,
      sheetName: 'PPDB Konsolidasi',
      title: 'REKAPITULASI PENERIMAAN MURID BARU (PPDB) TINGKAT YAYASAN',
      subtitle: 'Yayasan Pendidikan Imam Bonjol Majalengka (TK IT, SD IT, SMP IT Al-Afiyah)',
      columns,
      data: exportRows,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
            <CheckCircle2 className="w-3 h-3" /> Berkas Terverifikasi
          </span>
        );
      case 'INTERVIEW_SCHEDULED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
            <Clock className="w-3 h-3" /> Jadwal Wawancara
          </span>
        );
      case 'ACCEPTED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
            <CheckCircle2 className="w-3 h-3" /> Lulus Seleksi
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
            <AlertCircle className="w-3 h-3" /> Tidak Diterima
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
            <Clock className="w-3 h-3" /> Menunggu Review
          </span>
        );
    }
  };

  const currentSchoolTargetQuota = (() => {
    if (isFoundation) {
      return schools.reduce((acc, s) => acc + (s.targetQuota || 0), 0) || 175;
    }
    const currentSchool = schools.find((s) => s.slug === currentSchoolSlug);
    return currentSchool?.targetQuota || (currentSchoolSlug === 'tk' ? 40 : currentSchoolSlug === 'sd' ? 60 : 75);
  })();

  const distinctParentsCount = new Set(
    filteredApplicants.map((a) => a.parentPhone || a.parentName).filter(Boolean)
  ).size;

  return (
    <div className="space-y-8">
      {/* 1. TOP ROW: 4 VIBRANT GRADIENT EDUKA STAT CARDS */}
      <EdukaStatCards
        stats={stats}
        totalTeachers={totalTeachers ?? 0}
        targetQuota={currentSchoolTargetQuota}
        schoolSlug={currentSchoolSlug}
      />

      {/* 2. MIDDLE ROW: COURSES / UNIT SEKOLAH (7 COLS) & INTERACTIVE SPLINE CHART (5 COLS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 flex flex-col">
          <EdukaUnitTable schools={schools} schoolSlug={currentSchoolSlug} />
        </div>
        <div className="lg:col-span-5 flex flex-col">
          <EdukaSplineChart applicants={filteredApplicants} schoolSlug={currentSchoolSlug} />
        </div>
      </div>

      {/* 3. THIRD ROW: RECENT STUDENTS PARTICIPATION (7 COLS) & DONUT DISTRIBUTION (5 COLS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 flex flex-col">
          <EdukaRecentStudents applicants={applicants} schoolSlug={currentSchoolSlug} />
        </div>
        <div className="lg:col-span-5 flex flex-col">
          <EdukaDonutChart
            totalStudents={filteredApplicants.length}
            totalTeachers={totalTeachers ?? 0}
            totalParents={distinctParentsCount}
            totalAffiliates={stats.totalAffiliates || 0}
            targetQuota={currentSchoolTargetQuota}
            schoolSlug={currentSchoolSlug}
          />
        </div>
      </div>

      {/* 4. DETAIL REGISTRATIONS TABLE & STATUS MANAGEMENT CONSOLE */}
      <div id="pendaftar" className="bg-white rounded-[24px] p-6 sm:p-7 border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col justify-between relative overflow-hidden">
        {/* Table Header with Right Accent Pill */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-base sm:text-lg text-slate-900 tracking-tight">
                {isFoundation
                  ? 'Basis Data & Verifikasi Murid PPDB (Semua Unit)'
                  : `Basis Data & Verifikasi Murid PPDB - ${schoolName || currentSchoolSlug.toUpperCase() + ' IT Al-Afiyah'}`}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                Live Data
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {isFoundation
                ? 'Konsol pencarian murid terpadu, validasi berkas fisik/digital, dan update status seleksi yayasan'
                : `Konsol pencarian, validasi berkas fisik/digital, dan update status seleksi murid ${currentSchoolSlug.toUpperCase()} IT`}
            </p>
          </div>
        </div>

        {/* Table Controls (Search + Filters + CSV Export) */}
        <div className="py-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 border-b border-slate-100">
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari nama murid, no. registrasi, atau orang tua..."
                className="w-full bg-slate-50 text-xs text-slate-800 placeholder-slate-400 rounded-xl pl-10 pr-3 py-2.5 border border-slate-200 focus:bg-white focus:border-[#10B981] focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all font-medium"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {isFoundation ? (
              <select
                value={selectedSchool}
                onChange={(e) => setSelectedSchool(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#10B981] font-semibold cursor-pointer"
              >
                <option value="ALL">Semua Unit Jenjang</option>
                <option value="tk">TK IT Al-Afiyah</option>
                <option value="sd">SD IT Al-Afiyah</option>
                <option value="smp">SMP IT Al-Afiyah</option>
              </select>
            ) : (
              <div className="flex items-center bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3 py-2.5 text-xs font-semibold shadow-2xs">
                <span>{schoolName || `${currentSchoolSlug.toUpperCase()} IT Al-Afiyah`}</span>
              </div>
            )}

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#10B981] font-semibold cursor-pointer"
            >
              <option value="ALL">Semua Status</option>
              <option value="SUBMITTED">Menunggu Review</option>
              <option value="VERIFIED">Berkas Terverifikasi</option>
              <option value="INTERVIEW_SCHEDULED">Jadwal Wawancara</option>
              <option value="ACCEPTED">Lulus Seleksi</option>
            </select>

            <button
              onClick={handleExportExcel}
              className="flex items-center gap-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 px-4 py-2.5 rounded-xl transition-all shadow-md shadow-slate-900/10 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ekspor Excel (.xlsx)</span>
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto mt-2">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-100">
                <th className="py-3.5 px-4 rounded-l-xl">No. Registrasi</th>
                <th className="py-3.5 px-4">Nama Calon Murid</th>
                {isFoundation && <th className="py-3.5 px-4">Unit</th>}
                <th className="py-3.5 px-4">Wali & WhatsApp</th>
                <th className="py-3.5 px-4">Jalur</th>
                <th className="py-3.5 px-4">Status Biaya</th>
                <th className="py-3.5 px-4">Status Seleksi</th>
                <th className="py-3.5 px-4 text-right rounded-r-xl">Aksi Perubahan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredApplicants.length === 0 ? (
                <tr>
                  <td colSpan={isFoundation ? 8 : 7} className="py-12 text-center text-slate-400">
                    <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-slate-600">Tidak ada murid yang cocok dengan kriteria pencarian.</p>
                    <p className="text-slate-400 text-[11px] mt-0.5">Coba ubah kata kunci atau bersihkan filter pencarian.</p>
                  </td>
                </tr>
              ) : (
                filteredApplicants.map((applicant) => (
                  <tr key={applicant.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-900">
                      <Link
                        href={`/portal/ppdb/${applicant.registrationNo}`}
                        target="_blank"
                        className="text-[#10B981] hover:underline font-semibold inline-flex items-center space-x-1"
                      >
                        <span>{applicant.registrationNo}</span>
                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      <div className="flex items-center gap-2.5">
                        <StudentEduAvatar
                          gender={applicant.gender}
                          name={applicant.studentName}
                          size="xs"
                        />
                        <div>
                          <span className="font-semibold block text-slate-900">{applicant.studentName}</span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {applicant.gender === 'P' ? 'Perempuan (Akhwat)' : 'Laki-laki (Ikhwan)'}
                          </span>
                        </div>
                      </div>
                    </td>
                    {isFoundation && (
                      <td className="py-3.5 px-4">
                        <span className="text-[10px] font-semibold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg border border-slate-200">
                          {applicant.schoolSlug.toUpperCase()}
                        </span>
                      </td>
                    )}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{applicant.parentName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {applicant.parentPhone}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="capitalize font-medium text-slate-600">
                        {applicant.registrationPath}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {applicant.paymentStatus === 'PAID' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          Lunas (Rp {applicant.amount.toLocaleString('id-ID')})
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
                          Belum Bayar
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {getStatusBadge(applicant.status)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        <select
                          disabled={isUpdating === applicant.id || isDeleting === applicant.id}
                          value={applicant.status}
                          onChange={(e) => handleStatusChange(applicant.id, e.target.value)}
                          className="text-[11px] bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-bold focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-emerald-500 cursor-pointer disabled:opacity-50 shadow-2xs"
                        >
                          <option value="SUBMITTED">Menunggu</option>
                          <option value="VERIFIED">Verifikasi Berkas</option>
                          <option value="INTERVIEW_SCHEDULED">Jadwal Wawancara</option>
                          <option value="ACCEPTED">Luluskan Murid</option>
                          <option value="REJECTED">Tolak</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => handleDeleteApplicant(applicant.id, applicant.studentName, applicant.registrationNo)}
                          disabled={isDeleting === applicant.id || isUpdating === applicant.id}
                          title={`Hapus pendaftaran ${applicant.studentName} (${applicant.registrationNo})`}
                          className="p-1.5 rounded-lg border border-transparent text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-all cursor-pointer disabled:opacity-50"
                        >
                          {isDeleting === applicant.id ? (
                            <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="pt-4 mt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <span>Menampilkan <strong className="text-slate-800 font-bold">{filteredApplicants.length}</strong> dari {applicants.length} murid terdaftar</span>
          <span className="font-mono text-[11px] text-slate-400">Pusat Kendali Terpadu Al-Afiyah Eduka</span>
        </div>
      </div>
    </div>
  );
}
