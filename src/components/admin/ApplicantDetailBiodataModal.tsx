'use client';

import React, { useState } from 'react';
import {
  X,
  User,
  Users,
  School,
  FileText,
  Calendar,
  Phone,
  MapPin,
  Heart,
  ShieldCheck,
  Printer,
  Edit,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Award,
  Compass,
  Briefcase,
  Building,
  Activity,
  Layers,
  FileCheck
} from 'lucide-react';
import { calculateAgePerJuly2026, SDIT_OFFICIAL_METADATA } from '@/types/sdit-form';
import { ApplicantItem } from './PPDBVerificationClient';
import OfficialRegistrationFormModal from '@/components/portal/OfficialRegistrationFormModal';
import EditBiodataModal from '@/components/portal/EditBiodataModal';

interface ApplicantDetailBiodataModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicant: ApplicantItem | null;
  onDataUpdated?: () => void;
}

export default function ApplicantDetailBiodataModal({
  isOpen,
  onClose,
  applicant,
  onDataUpdated
}: ApplicantDetailBiodataModalProps) {
  const [activeTab, setActiveTab] = useState<'ANAK' | 'ORTU' | 'PENDIDIKAN' | 'BERKAS'>('ANAK');
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (!isOpen || !applicant) return null;

  const parent = applicant.parentDataRaw || {};
  const specific = applicant.schoolSpecificDataRaw || applicant.schoolSpecificDetails || {};
  const agePerJuly2026 = calculateAgePerJuly2026(applicant.dob || '2020-05-14');

  const formattedDob = applicant.dob
    ? new Date(applicant.dob).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : '-';

  const cleanPhone = (applicant.parentPhone || parent.motherPhone || parent.fatherPhone || '').replace(/\D/g, '');
  const waUrl = cleanPhone
    ? `https://wa.me/${cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone}?text=${encodeURIComponent(
        `Assalamu'alaikum Warahmatullahi Wabarakatuh, Panitia PPDB ${applicant.schoolName} menghubungi Ayah/Bunda dari ananda ${applicant.studentName} (No. Reg: ${applicant.registrationNo})...`
      )}`
    : null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
        <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[92vh]">
          
          {/* Header Dialog - Guaranteed Solid Contrast */}
          <div
            className="px-6 py-5 text-white flex items-center justify-between shrink-0 shadow-md relative overflow-hidden"
            style={{ backgroundColor: '#064E3B' }}
          >
            <div className="flex items-center space-x-3.5 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-white font-extrabold text-xl shadow-inner shrink-0">
                {applicant.schoolSlug.toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-white/20 text-white border border-white/30">
                    Formulir 28 Butir Lengkap
                  </span>
                  <span className="font-mono text-xs font-bold text-white bg-black/30 px-2 py-0.5 rounded-md border border-white/20">
                    {applicant.registrationNo}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
                  {applicant.studentName}
                </h2>
                <p className="text-xs text-emerald-100 font-medium mt-0.5">
                  {applicant.schoolName} • Jalur {applicant.registrationPath} • Terdaftar {applicant.createdAt}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 relative z-10">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                title="Edit / Lengkapi Data Pendaftar"
              >
                <Edit className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden sm:inline">Lengkapi Data</span>
              </button>

              <button
                type="button"
                onClick={() => setIsPrintModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                title="Cetak Formulir Resmi F-PPDB (A4)"
              >
                <Printer className="w-3.5 h-3.5 text-slate-950" />
                <span className="hidden sm:inline">Cetak F-PPDB</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-colors ml-1 cursor-pointer"
                title="Tutup Modal"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Quick Info & Tab Navigation */}
          <div className="bg-slate-100 border-b border-slate-200 px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
            {/* Tabs */}
            <div className="flex items-center space-x-1.5 overflow-x-auto py-1">
              <button
                type="button"
                onClick={() => setActiveTab('ANAK')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'ANAK'
                    ? 'bg-[#064E3B] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>1. Data Anak (1-17)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('ORTU')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'ORTU'
                    ? 'bg-[#064E3B] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>2. Orang Tua / Wali (18-20)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('PENDIDIKAN')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'PENDIDIKAN'
                    ? 'bg-[#064E3B] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <School className="w-3.5 h-3.5" />
                <span>3. Asal Sekolah &amp; Lainnya (21-28)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('BERKAS')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'BERKAS'
                    ? 'bg-[#064E3B] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>4. Berkas &amp; Dokumen</span>
              </button>
            </div>

            {/* Quick Actions (WA Ortu) */}
            {waUrl && cleanPhone.length >= 9 && (
              <a
                href={waUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#064E3B] hover:bg-emerald-800 text-white text-xs font-bold transition-colors shadow-2xs"
              >
                <Phone className="w-3 h-3 text-white" />
                <span>Hubungi Orang Tua ({cleanPhone})</span>
              </a>
            )}
          </div>

          {/* Modal Body / Tab Contents */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-slate-50/40">
            
            {/* TAB 1: KETERANGAN ANAK (Poin 1-17) */}
            {activeTab === 'ANAK' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                {/* Age Qualification Banner - High Contrast Clean Design */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      agePerJuly2026.isEligible ? 'bg-[#064E3B] text-white' : 'bg-amber-700 text-white'
                    }`}>
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500">Kalkulasi Usia per 1 Juli 2026 (Tahun Ajaran Baru):</p>
                      <p className="text-base font-extrabold text-slate-900 tracking-tight mt-0.5">
                        {agePerJuly2026.text}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3.5 py-1.5 rounded-full text-xs font-bold text-white shadow-2xs ${
                    agePerJuly2026.isEligible
                      ? 'bg-[#064E3B]'
                      : 'bg-amber-700'
                  }`}>
                    {agePerJuly2026.isEligible ? '✓ Memenuhi Syarat (Min. 6 Th)' : 'Perlu Observasi Khusus (<6 Th)'}
                  </span>
                </div>

                {/* Grid Identitas Anak */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <User className="w-4 h-4 text-emerald-600" />
                    <span>A. Identitas Calon Murid (Butir 1 s/d 10)</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block font-medium">1. Nama Lengkap:</span>
                      <span className="text-slate-900 font-bold text-sm block mt-0.5">{applicant.studentName}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block font-medium">2. Nama Panggilan:</span>
                      <span className="text-slate-900 font-bold block mt-0.5">{specific.nickname || '-'}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block font-medium">NIK Murid:</span>
                      <span className="text-slate-900 font-mono font-bold block mt-0.5">{applicant.nik || '-'}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block font-medium">3. Jenis Kelamin:</span>
                      <span className="text-slate-900 font-bold block mt-0.5">
                        {applicant.gender === 'L' ? 'Laki-Laki (L)' : 'Perempuan (P)'}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block font-medium">4. Tempat, Tanggal Lahir:</span>
                      <span className="text-slate-900 font-bold block mt-0.5">
                        {applicant.pob || specific.pob || 'Majalengka'}, {formattedDob}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block font-medium">5. Agama:</span>
                      <span className="text-slate-900 font-bold block mt-0.5">{specific.religion || 'Islam'}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block font-medium">6. Kewarganegaraan:</span>
                      <span className="text-slate-900 font-bold block mt-0.5">{specific.citizenship || 'WNI'}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block font-medium">7. Anak ke-:</span>
                      <span className="text-slate-900 font-bold block mt-0.5">Anak ke-{specific.childOrder || '1'}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block font-medium">8 &amp; 9. Jumlah Saudara:</span>
                      <span className="text-slate-900 font-bold block mt-0.5">
                        {specific.siblingsCount || '0'} Kandung • {specific.stepSiblingsCount || '0'} Tiri/Angkat
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 sm:col-span-2 lg:col-span-3">
                      <span className="text-slate-400 block font-medium">10. Bahasa Sehari-hari di Rumah:</span>
                      <span className="text-slate-900 font-bold block mt-0.5">
                        {specific.dailyLanguage || 'Bahasa Indonesia / Sunda'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Keadaan Jasmani & Tempat Tinggal */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Keadaan Jasmani */}
                  <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-emerald-600" />
                      <span>Keadaan Jasmani (Butir 11 s/d 14)</span>
                    </h3>
                    <div className="space-y-3 text-xs">
                      <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                        <span className="text-slate-500">11. Tinggi Badan:</span>
                        <span className="font-bold text-slate-900">{specific.heightCm ? `${specific.heightCm} cm` : '-'}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                        <span className="text-slate-500">12. Berat Badan:</span>
                        <span className="font-bold text-slate-900">{specific.weightKg ? `${specific.weightKg} kg` : '-'}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                        <span className="text-slate-500">14. Golongan Darah:</span>
                        <span className="font-bold text-slate-900">{specific.bloodType || 'Belum Tahu'}</span>
                      </div>
                      <div className="py-1.5">
                        <span className="text-slate-500 block mb-1">13. Riwayat Penyakit Berat / Alergi:</span>
                        <p className="p-2.5 rounded-xl bg-slate-50 text-slate-800 font-medium text-xs leading-relaxed border border-slate-100">
                          {specific.diseaseHistory || 'Tidak ada riwayat penyakit berat'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Tempat Tinggal */}
                  <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-600" />
                      <span>Tempat Tinggal (Butir 15 s/d 17)</span>
                    </h3>
                    <div className="space-y-3 text-xs">
                      <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                        <span className="text-slate-500">15. Jarak ke Sekolah:</span>
                        <span className="font-bold text-slate-900">
                          {specific.distanceToSchoolKm ? `± ${specific.distanceToSchoolKm} km` : '± 2 km'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                        <span className="text-slate-500">16. Tinggal Bersama:</span>
                        <span className="font-bold text-slate-900">{specific.livingWith || 'Kedua Orang Tua'}</span>
                      </div>
                      <div className="py-1.5">
                        <span className="text-slate-500 block mb-1">17. Alamat Lengkap Domisili:</span>
                        <p className="p-2.5 rounded-xl bg-slate-50 text-slate-800 font-medium text-xs leading-relaxed border border-slate-100">
                          {applicant.address || specific.address || 'Majalengka'}
                        </p>
                      </div>
                      <div className="flex justify-between items-center py-1 border-t border-slate-100">
                        <span className="text-slate-500">Nomor Telepon / HP:</span>
                        <span className="font-mono font-bold text-slate-900">{applicant.parentPhone || '-'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: KETERANGAN ORANG TUA / WALI (Poin 18-20) */}
            {activeTab === 'ORTU' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Ayah Kandung */}
                  <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                        <User className="w-4 h-4 text-blue-600" />
                        <span>18. Data Ayah Kandung</span>
                      </h3>
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold">
                        Ayah
                      </span>
                    </div>

                    <div className="space-y-2.5 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[11px]">Nama Lengkap:</span>
                        <span className="font-bold text-slate-900 text-sm">{parent.fatherName || '-'}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-slate-400 block text-[11px]">NIK Ayah:</span>
                          <span className="font-mono font-semibold text-slate-800">{parent.fatherNik || '-'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">Tahun Lahir:</span>
                          <span className="font-semibold text-slate-800">{parent.fatherBirthYear || '-'}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Pendidikan Terakhir:</span>
                        <span className="font-semibold text-slate-800">{parent.fatherEducation || '-'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Pekerjaan:</span>
                        <span className="font-semibold text-slate-800">{parent.fatherJob || '-'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Instansi / Perusahaan &amp; Jabatan:</span>
                        <span className="font-semibold text-slate-800">
                          {parent.fatherCompany || '-'} {parent.fatherPosition ? `(${parent.fatherPosition})` : ''}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Alamat Kantor:</span>
                        <span className="text-slate-700">{parent.fatherOfficeAddress || '-'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">No. Telepon / WhatsApp:</span>
                        <span className="font-mono font-bold text-emerald-700">{parent.fatherPhone || '-'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Ibu Kandung */}
                  <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                        <Heart className="w-4 h-4 text-rose-500" />
                        <span>19. Data Ibu Kandung</span>
                      </h3>
                      <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 text-[10px] font-bold">
                        Ibu
                      </span>
                    </div>

                    <div className="space-y-2.5 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[11px]">Nama Lengkap:</span>
                        <span className="font-bold text-slate-900 text-sm">{parent.motherName || '-'}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-slate-400 block text-[11px]">NIK Ibu:</span>
                          <span className="font-mono font-semibold text-slate-800">{parent.motherNik || '-'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">Tahun Lahir:</span>
                          <span className="font-semibold text-slate-800">{parent.motherBirthYear || '-'}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Pendidikan Terakhir:</span>
                        <span className="font-semibold text-slate-800">{parent.motherEducation || '-'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Pekerjaan:</span>
                        <span className="font-semibold text-slate-800">{parent.motherJob || '-'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Instansi / Perusahaan &amp; Jabatan:</span>
                        <span className="font-semibold text-slate-800">
                          {parent.motherCompany || '-'} {parent.motherPosition ? `(${parent.motherPosition})` : ''}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Alamat Kantor:</span>
                        <span className="text-slate-700">{parent.motherOfficeAddress || '-'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">No. Telepon / WhatsApp:</span>
                        <span className="font-mono font-bold text-emerald-700">
                          {parent.motherPhone || parent.phone || applicant.parentPhone || '-'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Wali Murid & Penghasilan */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-amber-600" />
                    <span>20. Data Wali &amp; Rentang Penghasilan Keluarga</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block">Nama Wali (Jika Ada):</span>
                      <span className="font-bold text-slate-900 block mt-0.5">{parent.guardianName || 'Tidak Ada / Bersama Ortu'}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block">Pekerjaan Wali:</span>
                      <span className="font-semibold text-slate-900 block mt-0.5">{parent.guardianJob || '-'}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block">No. Kontak Wali:</span>
                      <span className="font-mono font-semibold text-slate-900 block mt-0.5">{parent.guardianPhone || '-'}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 font-semibold block">Rentang Penghasilan Bulanan:</span>
                      <span className="font-extrabold text-slate-900 block mt-0.5">
                        {parent.incomeRange || parent.income || 'Rp 3.000.000 - Rp 5.000.000'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: ASAL SEKOLAH & LAIN-LAIN (Poin 21-28) */}
            {activeTab === 'PENDIDIKAN' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <School className="w-4 h-4 text-emerald-600" />
                    <span>C. Keterangan Sekolah &amp; Pendidikan (Butir 21 s/d 25)</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block font-medium">21. Berangkat ke Sekolah:</span>
                      <span className="font-bold text-slate-900 text-sm block mt-1 capitalize">
                        {specific.transportation || 'Diantar Orang Tua / Keluarga'}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block font-medium">22. Masuk Sekolah Sebagai:</span>
                      <span className="font-bold text-slate-900 text-sm block mt-1">
                        {specific.admissionAs || 'Murid Kelas 1 (Baru)'}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 sm:col-span-2">
                      <span className="text-slate-400 block font-medium">23. Asal Sekolah (TK / BA / RA / DA / PAUD):</span>
                      <span className="font-bold text-slate-900 text-sm block mt-1">
                        {specific.originSchoolName || 'TK IT Al-Afiyah Majalengka / RA'}
                      </span>
                      {specific.originSchoolAddress && (
                        <p className="text-[11px] text-slate-500 mt-1">Alamat TK: {specific.originSchoolAddress}</p>
                      )}
                    </div>

                    {/* Jika Murid Pindahan SD */}
                    {(specific.admissionAs?.includes('Pindahan') || specific.transferSchoolName) && (
                      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 sm:col-span-2">
                        <span className="text-amber-800 font-bold block">24 &amp; 25. Data Pindahan SD / MI:</span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                          <div>
                            <span className="text-slate-500 text-[11px] block">Asal SD/MI:</span>
                            <span className="font-bold text-slate-900">{specific.transferSchoolName || '-'}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 text-[11px] block">Tgl Meninggalkan Sekolah:</span>
                            <span className="font-bold text-slate-900">{specific.transferLeaveDate || '-'}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 text-[11px] block">Alasan Pindah:</span>
                            <span className="font-bold text-slate-900">{specific.otherNotes || '-'}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Kesiapan Belajar & Keterangan Khusus */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Compass className="w-4 h-4 text-emerald-600" />
                    <span>D. Kesiapan Belajar, Tahfidz &amp; Motivasi (Butir 26 s/d 28)</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block font-medium">Penguasaan Iqro / Al-Qur&apos;an:</span>
                      <span className="font-bold text-slate-900 block mt-0.5">{specific.iqro || 'Jilid 3 - 4'}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block font-medium">Kesiapan Calistung (Baca Tulis Huruf Latin):</span>
                      <span className="font-bold text-slate-900 block mt-0.5">{specific.reading || 'Sudah Lancar Kata'}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block font-medium">27. Info Pertama Mengenal SDIT:</span>
                      <span className="font-bold text-slate-900 block mt-0.5">
                        {specific.firstKnownSource || 'Media Sosial / Rekomendasi Saudara'}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block font-medium">28. Alasan Utama Memilih SDIT:</span>
                      <span className="font-bold text-slate-900 block mt-0.5">
                        {specific.mainReason || 'Pembinaan Karakter Islami & Tahfidz Al-Qur\'an'}
                      </span>
                    </div>

                    {specific.otherNotes && (
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 sm:col-span-2">
                        <span className="text-slate-400 block font-medium">26. Catatan Khusus / Lain-lain:</span>
                        <p className="font-medium text-slate-800 mt-0.5 leading-relaxed">{specific.otherNotes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: BERKAS & DOKUMEN FISIK / DIGITAL */}
            {activeTab === 'BERKAS' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                {/* Status Pembayaran Formulir */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-[#064E3B] text-white flex items-center justify-center font-bold">
                      Rp
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Biaya Formulir Registrasi Gelombang 1:</p>
                      <p className="text-base font-extrabold text-slate-900">
                        Rp {applicant.registrationFee ? applicant.registrationFee.toLocaleString('id-ID') : '175.000'}
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#064E3B] text-white shadow-2xs">
                    Status: {applicant.status}
                  </span>
                </div>

                {/* Uploaded Documents */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-emerald-600" />
                    <span>Dokumen Digital yang Diunggah ({applicant.documents.length})</span>
                  </h3>

                  {applicant.documents.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                      <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                      <p className="font-medium text-xs text-slate-600">Belum ada dokumen digital yang diunggah</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Calon siswa memilih opsi susulan dokumen via Portal Murid atau penyerahan fisik saat observasi.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {applicant.documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                                {doc.docType}
                              </span>
                              <span className="text-[10px] text-slate-400">PDF / IMG</span>
                            </div>
                            <p className="text-xs font-bold text-slate-900 truncate" title={doc.fileName}>
                              {doc.fileName}
                            </p>
                          </div>
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-3 inline-flex items-center justify-center space-x-1.5 w-full py-1.5 px-3 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:text-emerald-700 hover:border-emerald-300 shadow-2xs transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Buka Dokumen</span>
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Checklist Fisik Sesuai Formulir Resmi */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Checklist Dokumen Fisik Arsip Sekolah (Formulir F-PPDB)</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {[
                      'Kuitansi Asli Pendaftaran Rp 175.000',
                      'Fotokopi Akta Kelahiran Murid (2 Lembar)',
                      'Fotokopi Kartu Keluarga (KK) (2 Lembar)',
                      'Fotokopi KTP Kedua Orang Tua / Wali',
                      'Pas Foto 3x4 Calon Murid (3 Lembar)',
                      'Surat Keterangan Lulus / Ijazah TK (Bila Sudah Ada)',
                      'Surat Pindah & Buku Rapor Asli (Khusus Pindahan)',
                      'Surat Rekomendasi Psikolog (Khusus Usia <6 Tahun)'
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center space-x-2 p-2 rounded-lg bg-slate-50 border border-slate-100">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="text-slate-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
            <div className="text-[11px] text-slate-500">
              ID Pendaftaran: <span className="font-mono text-slate-700 font-semibold">{applicant.id}</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => setIsPrintModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Lembar F-PPDB (A4)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Modal: Cetak Formulir Resmi */}
      {isPrintModalOpen && (
        <OfficialRegistrationFormModal
          isOpen={isPrintModalOpen}
          onClose={() => setIsPrintModalOpen(false)}
          regNo={applicant.registrationNo}
          studentName={applicant.studentName}
          nik={applicant.nik}
          gender={applicant.gender}
          pob={applicant.pob || specific.pob || 'Majalengka'}
          dob={applicant.dob || '2020-05-14'}
          address={applicant.address || specific.address || 'Majalengka'}
          schoolName={applicant.schoolName}
          schoolSlug={applicant.schoolSlug}
          admissionTrack={applicant.registrationPath}
          schoolSpecificData={specific}
          parentData={parent}
          createdAt={applicant.createdAt}
        />
      )}

      {/* Sub-Modal: Edit / Lengkapi Data Pendaftar */}
      {isEditModalOpen && (
        <EditBiodataModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          regNo={applicant.registrationNo}
          initialStudentName={applicant.studentName}
          initialNik={applicant.nik}
          initialGender={applicant.gender}
          initialPob={applicant.pob || specific.pob || 'Majalengka'}
          initialDob={applicant.dob || '2020-05-14'}
          initialAddress={applicant.address || specific.address || 'Majalengka'}
          schoolSlug={applicant.schoolSlug}
          schoolSpecificData={specific}
          parentData={parent}
          onSuccess={() => {
            setIsEditModalOpen(false);
            if (onDataUpdated) onDataUpdated();
          }}
        />
      )}
    </>
  );
}
