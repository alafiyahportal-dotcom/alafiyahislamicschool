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
  Briefcase,
  Activity,
  FileCheck,
  Compass,
  Download
} from 'lucide-react';
import { calculateAgePerJuly2027 } from '@/types/sdit-form';
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
  const AgePerJuly2027 = calculateAgePerJuly2027(applicant.dob || '2021-05-14');

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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
        <div className="relative w-full max-w-4xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden my-auto flex flex-col max-h-[94vh]">
          
          {/* Header Dialog - Modern Minimalist, No Initial Badge */}
          <div className="px-4 sm:px-6 py-4 sm:py-5 bg-[#064E3B] text-white flex items-center justify-between shrink-0 shadow-sm relative overflow-hidden">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="p-2 sm:p-2.5 rounded-xl bg-white/10 border border-white/20 text-white shrink-0">
                <FileText className="w-5 h-5 text-emerald-300" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-white/15 text-emerald-100 border border-white/20">
                    Formulir 28 Butir Lengkap
                  </span>
                  <span className="font-mono text-[11px] font-bold text-white bg-black/25 px-2 py-0.5 rounded-md border border-white/15">
                    {applicant.registrationNo}
                  </span>
                </div>
                <h2 className="text-base sm:text-xl font-bold text-white tracking-tight mt-1 truncate">
                  {applicant.studentName}
                </h2>
                <p className="text-[11px] sm:text-xs text-emerald-100/90 font-medium truncate">
                  {applicant.schoolName} • Jalur {applicant.registrationPath} • Terdaftar {applicant.createdAt}
                </p>
              </div>
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0 ml-2">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-white/95 hover:bg-white text-slate-800 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                title="Edit / Lengkapi Data Pendaftar"
              >
                <Edit className="w-3.5 h-3.5 text-amber-700" />
                <span className="hidden md:inline">Lengkapi Data</span>
              </button>

              <button
                type="button"
                onClick={() => setIsPrintModalOpen(true)}
                className="px-3 sm:px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                title="Cetak Formulir Resmi F-PPDB (A4)"
              >
                <Printer className="w-3.5 h-3.5 text-slate-950" />
                <span className="hidden sm:inline">Cetak / Unduh F-PPDB</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 sm:p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
                title="Tutup Modal"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Quick Info & Tab Navigation */}
          <div className="bg-slate-100/80 border-b border-slate-200 px-4 sm:px-6 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shrink-0">
            {/* Tabs */}
            <div className="flex items-center space-x-1.5 overflow-x-auto py-0.5 no-scrollbar">
              <button
                type="button"
                onClick={() => setActiveTab('ANAK')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  activeTab === 'ANAK'
                    ? 'bg-[#064E3B] text-white shadow-xs'
                    : 'bg-white border border-slate-200/90 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>1. Data Murid (1-17)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('ORTU')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  activeTab === 'ORTU'
                    ? 'bg-[#064E3B] text-white shadow-xs'
                    : 'bg-white border border-slate-200/90 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>2. Orang Tua / Wali (18-20)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('PENDIDIKAN')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  activeTab === 'PENDIDIKAN'
                    ? 'bg-[#064E3B] text-white shadow-xs'
                    : 'bg-white border border-slate-200/90 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <School className="w-3.5 h-3.5" />
                <span>3. Asal Sekolah &amp; Lainnya (21-28)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('BERKAS')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  activeTab === 'BERKAS'
                    ? 'bg-[#064E3B] text-white shadow-xs'
                    : 'bg-white border border-slate-200/90 text-slate-700 hover:bg-slate-50'
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
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition-colors shadow-2xs self-start sm:self-auto cursor-pointer"
              >
                <Phone className="w-3 h-3 text-white" />
                <span>Hubungi Orang Tua ({cleanPhone})</span>
              </a>
            )}
          </div>

          {/* Modal Body / Tab Contents */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5 bg-slate-50/60">
            
            {/* TAB 1: KETERANGAN ANAK (Poin 1-17) */}
            {activeTab === 'ANAK' && (
              <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-150">
                {/* Age Qualification Card */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      AgePerJuly2027.isEligible ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-medium text-slate-500">Kalkulasi Usia per 1 Juli 2027 (Tahun Ajaran Baru):</p>
                      <p className="text-sm sm:text-base font-bold text-slate-900 tracking-tight mt-0.5">
                        {AgePerJuly2027.text}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold text-center ${
                    AgePerJuly2027.isEligible
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}>
                    {AgePerJuly2027.isEligible ? '✓ Memenuhi Syarat (Min. 6 Tahun)' : 'Perlu Observasi Khusus (<6 Tahun)'}
                  </span>
                </div>

                {/* Section A: Identitas Calon Murid (Butir 1 s/d 10) */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                  <div className="px-5 py-3.5 bg-slate-50/80 border-b border-slate-200/90 flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <User className="w-4 h-4 text-emerald-700" />
                      <span>A. Identitas Calon Murid (Butir 1 s/d 10)</span>
                    </h3>
                  </div>

                  <div className="divide-y divide-slate-100 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
                      <div className="px-5 py-3 flex flex-col justify-center">
                        <span className="text-[11px] font-medium text-slate-400">1. Nama Lengkap Murid</span>
                        <span className="text-sm font-semibold text-slate-900 mt-0.5">{applicant.studentName}</span>
                      </div>
                      <div className="px-5 py-3 flex flex-col justify-center">
                        <span className="text-[11px] font-medium text-slate-400">2. Nama Panggilan</span>
                        <span className="text-sm font-semibold text-slate-900 mt-0.5">{specific.nickname || '-'}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
                      <div className="px-5 py-3 flex flex-col justify-center">
                        <span className="text-[11px] font-medium text-slate-400">Nomor Induk Kependudukan (NIK)</span>
                        <span className="text-sm font-mono font-semibold text-slate-900 mt-0.5">{applicant.nik || '-'}</span>
                      </div>
                      <div className="px-5 py-3 flex flex-col justify-center">
                        <span className="text-[11px] font-medium text-slate-400">3. Jenis Kelamin</span>
                        <span className="text-sm font-semibold text-slate-900 mt-0.5">
                          {applicant.gender === 'L' ? 'Laki-Laki (L)' : 'Perempuan (P)'}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
                      <div className="px-5 py-3 flex flex-col justify-center">
                        <span className="text-[11px] font-medium text-slate-400">4. Tempat, Tanggal Lahir</span>
                        <span className="text-sm font-semibold text-slate-900 mt-0.5">
                          {applicant.pob || specific.pob || 'Majalengka'}, {formattedDob}
                        </span>
                      </div>
                      <div className="px-5 py-3 flex flex-col justify-center">
                        <span className="text-[11px] font-medium text-slate-400">5. Agama &amp; Kewarganegaraan</span>
                        <span className="text-sm font-semibold text-slate-900 mt-0.5">
                          {specific.religion || 'Islam'} • {specific.citizenship || 'WNI'}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
                      <div className="px-5 py-3 flex flex-col justify-center">
                        <span className="text-[11px] font-medium text-slate-400">7. Anak ke-</span>
                        <span className="text-sm font-semibold text-slate-900 mt-0.5">Anak ke-{specific.childOrder || '1'}</span>
                      </div>
                      <div className="px-5 py-3 flex flex-col justify-center">
                        <span className="text-[11px] font-medium text-slate-400">8 &amp; 9. Jumlah Saudara</span>
                        <span className="text-sm font-semibold text-slate-900 mt-0.5">
                          {specific.siblingsCount || '0'} Kandung • {specific.stepSiblingsCount || '0'} Tiri/Angkat
                        </span>
                      </div>
                    </div>

                    <div className="px-5 py-3 flex flex-col justify-center">
                      <span className="text-[11px] font-medium text-slate-400">10. Bahasa Sehari-hari di Rumah</span>
                      <span className="text-sm font-semibold text-slate-900 mt-0.5">
                        {specific.dailyLanguage || 'Bahasa Indonesia / Sunda'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Section B & C: Keadaan Jasmani & Tempat Tinggal */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Keadaan Jasmani */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                    <div className="px-5 py-3 bg-slate-50/80 border-b border-slate-200/90 flex items-center justify-between">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                        <Activity className="w-4 h-4 text-emerald-700" />
                        <span>Keadaan Jasmani (Butir 11 s/d 14)</span>
                      </h3>
                    </div>
                    <div className="divide-y divide-slate-100 text-xs">
                      <div className="px-5 py-2.5 flex justify-between items-center">
                        <span className="text-slate-500">11. Tinggi Badan</span>
                        <span className="font-semibold text-slate-900">{specific.heightCm ? `${specific.heightCm} cm` : '-'}</span>
                      </div>
                      <div className="px-5 py-2.5 flex justify-between items-center">
                        <span className="text-slate-500">12. Berat Badan</span>
                        <span className="font-semibold text-slate-900">{specific.weightKg ? `${specific.weightKg} kg` : '-'}</span>
                      </div>
                      <div className="px-5 py-2.5 flex justify-between items-center">
                        <span className="text-slate-500">14. Golongan Darah</span>
                        <span className="font-semibold text-slate-900">{specific.bloodType || 'Belum Tahu'}</span>
                      </div>
                      <div className="px-5 py-3">
                        <span className="text-slate-500 block text-[11px]">13. Riwayat Penyakit Berat / Alergi:</span>
                        <p className="mt-1 text-slate-800 font-medium leading-relaxed">
                          {specific.diseaseHistory || 'Tidak ada riwayat penyakit berat'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Tempat Tinggal */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                    <div className="px-5 py-3 bg-slate-50/80 border-b border-slate-200/90 flex items-center justify-between">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-emerald-700" />
                        <span>Tempat Tinggal (Butir 15 s/d 17)</span>
                      </h3>
                    </div>
                    <div className="divide-y divide-slate-100 text-xs">
                      <div className="px-5 py-2.5 flex justify-between items-center">
                        <span className="text-slate-500">15. Jarak ke Sekolah</span>
                        <span className="font-semibold text-slate-900">
                          {specific.distanceToSchoolKm ? `± ${specific.distanceToSchoolKm} km` : '± 2 km'}
                        </span>
                      </div>
                      <div className="px-5 py-2.5 flex justify-between items-center">
                        <span className="text-slate-500">16. Tinggal Bersama</span>
                        <span className="font-semibold text-slate-900">{specific.livingWith || 'Kedua Orang Tua'}</span>
                      </div>
                      <div className="px-5 py-3">
                        <span className="text-slate-500 block text-[11px]">17. Alamat Lengkap Domisili:</span>
                        <p className="mt-1 text-slate-800 font-medium leading-relaxed">
                          {applicant.address || specific.address || 'Majalengka'}
                        </p>
                      </div>
                      <div className="px-5 py-2.5 flex justify-between items-center">
                        <span className="text-slate-500">Kontak WhatsApp</span>
                        <span className="font-mono font-semibold text-slate-900">{applicant.parentPhone || '-'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: KETERANGAN ORANG TUA / WALI (Poin 18-20) */}
            {activeTab === 'ORTU' && (
              <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-150">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Ayah Kandung */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                    <div className="px-5 py-3 bg-slate-50/80 border-b border-slate-200/90 flex items-center justify-between">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                        <User className="w-4 h-4 text-blue-700" />
                        <span>18. Data Ayah Kandung</span>
                      </h3>
                      <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-bold">
                        Ayah
                      </span>
                    </div>

                    <div className="divide-y divide-slate-100 text-xs">
                      <div className="px-5 py-3">
                        <span className="text-[11px] font-medium text-slate-400 block">Nama Lengkap</span>
                        <span className="text-sm font-semibold text-slate-900 mt-0.5 block">{parent.fatherName || '-'}</span>
                      </div>
                      <div className="grid grid-cols-2 divide-x divide-slate-100 px-5 py-2.5">
                        <div>
                          <span className="text-[11px] font-medium text-slate-400 block">NIK Ayah</span>
                          <span className="font-mono font-semibold text-slate-900 mt-0.5 block">{parent.fatherNik || '-'}</span>
                        </div>
                        <div className="pl-4">
                          <span className="text-[11px] font-medium text-slate-400 block">Tahun Lahir</span>
                          <span className="font-semibold text-slate-900 mt-0.5 block">{parent.fatherBirthYear || '-'}</span>
                        </div>
                      </div>
                      <div className="px-5 py-2.5">
                        <span className="text-[11px] font-medium text-slate-400 block">Pendidikan Terakhir</span>
                        <span className="font-semibold text-slate-900 mt-0.5 block">{parent.fatherEducation || '-'}</span>
                      </div>
                      <div className="px-5 py-2.5">
                        <span className="text-[11px] font-medium text-slate-400 block">Pekerjaan &amp; Instansi</span>
                        <span className="font-semibold text-slate-900 mt-0.5 block">
                          {parent.fatherJob || '-'} {parent.fatherCompany ? `• ${parent.fatherCompany}` : ''}
                        </span>
                      </div>
                      <div className="px-5 py-2.5">
                        <span className="text-[11px] font-medium text-slate-400 block">Alamat Kantor</span>
                        <span className="text-slate-800 mt-0.5 block">{parent.fatherOfficeAddress || '-'}</span>
                      </div>
                      <div className="px-5 py-2.5">
                        <span className="text-[11px] font-medium text-slate-400 block">No. Kontak / WhatsApp</span>
                        <span className="font-mono font-semibold text-emerald-800 mt-0.5 block">{parent.fatherPhone || '-'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Ibu Kandung */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                    <div className="px-5 py-3 bg-slate-50/80 border-b border-slate-200/90 flex items-center justify-between">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                        <Heart className="w-4 h-4 text-rose-600" />
                        <span>19. Data Ibu Kandung</span>
                      </h3>
                      <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[10px] font-bold">
                        Ibu
                      </span>
                    </div>

                    <div className="divide-y divide-slate-100 text-xs">
                      <div className="px-5 py-3">
                        <span className="text-[11px] font-medium text-slate-400 block">Nama Lengkap</span>
                        <span className="text-sm font-semibold text-slate-900 mt-0.5 block">{parent.motherName || '-'}</span>
                      </div>
                      <div className="grid grid-cols-2 divide-x divide-slate-100 px-5 py-2.5">
                        <div>
                          <span className="text-[11px] font-medium text-slate-400 block">NIK Ibu</span>
                          <span className="font-mono font-semibold text-slate-900 mt-0.5 block">{parent.motherNik || '-'}</span>
                        </div>
                        <div className="pl-4">
                          <span className="text-[11px] font-medium text-slate-400 block">Tahun Lahir</span>
                          <span className="font-semibold text-slate-900 mt-0.5 block">{parent.motherBirthYear || '-'}</span>
                        </div>
                      </div>
                      <div className="px-5 py-2.5">
                        <span className="text-[11px] font-medium text-slate-400 block">Pendidikan Terakhir</span>
                        <span className="font-semibold text-slate-900 mt-0.5 block">{parent.motherEducation || '-'}</span>
                      </div>
                      <div className="px-5 py-2.5">
                        <span className="text-[11px] font-medium text-slate-400 block">Pekerjaan &amp; Instansi</span>
                        <span className="font-semibold text-slate-900 mt-0.5 block">
                          {parent.motherJob || '-'} {parent.motherCompany ? `• ${parent.motherCompany}` : ''}
                        </span>
                      </div>
                      <div className="px-5 py-2.5">
                        <span className="text-[11px] font-medium text-slate-400 block">Alamat Kantor</span>
                        <span className="text-slate-800 mt-0.5 block">{parent.motherOfficeAddress || '-'}</span>
                      </div>
                      <div className="px-5 py-2.5">
                        <span className="text-[11px] font-medium text-slate-400 block">No. Kontak / WhatsApp</span>
                        <span className="font-mono font-semibold text-emerald-800 mt-0.5 block">
                          {parent.motherPhone || parent.phone || applicant.parentPhone || '-'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Data Wali & Penghasilan Bulanan */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                  <div className="px-5 py-3 bg-slate-50/80 border-b border-slate-200/90 flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-amber-700" />
                      <span>20. Data Wali &amp; Rentang Penghasilan Keluarga</span>
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 text-xs">
                    <div className="px-5 py-3">
                      <span className="text-[11px] font-medium text-slate-400 block">Nama Wali (Bila Ada)</span>
                      <span className="font-semibold text-slate-900 mt-0.5 block">{parent.guardianName || 'Bersama Orang Tua'}</span>
                    </div>
                    <div className="px-5 py-3">
                      <span className="text-[11px] font-medium text-slate-400 block">Pekerjaan Wali</span>
                      <span className="font-semibold text-slate-900 mt-0.5 block">{parent.guardianJob || '-'}</span>
                    </div>
                    <div className="px-5 py-3">
                      <span className="text-[11px] font-medium text-slate-400 block">No. Kontak Wali</span>
                      <span className="font-mono font-semibold text-slate-900 mt-0.5 block">{parent.guardianPhone || '-'}</span>
                    </div>
                    <div className="px-5 py-3 bg-slate-50/40">
                      <span className="text-[11px] font-medium text-slate-500 block">Rentang Penghasilan Bulanan</span>
                      <span className="font-bold text-slate-900 mt-0.5 block">
                        {parent.incomeRange || parent.income || 'Rp 3.000.000 - Rp 5.000.000'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: ASAL SEKOLAH & LAIN-LAIN (Poin 21-28) */}
            {activeTab === 'PENDIDIKAN' && (
              <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-150">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                  <div className="px-5 py-3.5 bg-slate-50/80 border-b border-slate-200/90 flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <School className="w-4 h-4 text-emerald-700" />
                      <span>C. Keterangan Sekolah &amp; Pendidikan (Butir 21 s/d 25)</span>
                    </h3>
                  </div>

                  <div className="divide-y divide-slate-100 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
                      <div className="px-5 py-3">
                        <span className="text-[11px] font-medium text-slate-400 block">21. Berangkat ke Sekolah</span>
                        <span className="font-semibold text-slate-900 mt-0.5 block capitalize">
                          {specific.transportation || 'Diantar Orang Tua / Keluarga'}
                        </span>
                      </div>
                      <div className="px-5 py-3">
                        <span className="text-[11px] font-medium text-slate-400 block">22. Masuk Sekolah Sebagai</span>
                        <span className="font-semibold text-slate-900 mt-0.5 block">
                          {specific.admissionAs || 'Murid Kelas 1 (Baru)'}
                        </span>
                      </div>
                    </div>

                    <div className="px-5 py-3">
                      <span className="text-[11px] font-medium text-slate-400 block">23. Asal Sekolah (TK / BA / RA / PAUD)</span>
                      <span className="text-sm font-semibold text-slate-900 mt-0.5 block">
                        {specific.originSchoolName || 'TK IT Al-Afiyah Majalengka / RA'}
                      </span>
                      {specific.originSchoolAddress && (
                        <p className="text-[11px] text-slate-500 mt-1">Alamat TK: {specific.originSchoolAddress}</p>
                      )}
                    </div>

                    {/* Jika Murid Pindahan SD */}
                    {(specific.admissionAs?.includes('Pindahan') || specific.transferSchoolName) && (
                      <div className="px-5 py-3 bg-amber-50/50">
                        <span className="text-amber-800 font-bold block text-[11px]">24 &amp; 25. Data Pindahan SD / MI:</span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                          <div>
                            <span className="text-slate-500 text-[10px] block">Asal SD/MI:</span>
                            <span className="font-semibold text-slate-900">{specific.transferSchoolName || '-'}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 text-[10px] block">Tgl Meninggalkan Sekolah:</span>
                            <span className="font-semibold text-slate-900">{specific.transferLeaveDate || '-'}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 text-[10px] block">Alasan Pindah:</span>
                            <span className="font-semibold text-slate-900">{specific.otherNotes || '-'}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Kesiapan Belajar & Keterangan Khusus */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                  <div className="px-5 py-3.5 bg-slate-50/80 border-b border-slate-200/90 flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <Compass className="w-4 h-4 text-emerald-700" />
                      <span>D. Kesiapan Belajar, Tahfidz &amp; Motivasi (Butir 26 s/d 28)</span>
                    </h3>
                  </div>

                  <div className="divide-y divide-slate-100 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
                      <div className="px-5 py-3">
                        <span className="text-[11px] font-medium text-slate-400 block">Penguasaan Iqro / Al-Qur&apos;an</span>
                        <span className="font-semibold text-slate-900 mt-0.5 block">{specific.iqro || 'Jilid 3 - 4'}</span>
                      </div>
                      <div className="px-5 py-3">
                        <span className="text-[11px] font-medium text-slate-400 block">Kesiapan Calistung (Huruf Latin)</span>
                        <span className="font-semibold text-slate-900 mt-0.5 block">{specific.reading || 'Sudah Lancar Kata'}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
                      <div className="px-5 py-3">
                        <span className="text-[11px] font-medium text-slate-400 block">27. Info Pertama Mengenal SDIT</span>
                        <span className="font-semibold text-slate-900 mt-0.5 block">
                          {specific.firstKnownSource || 'Media Sosial / Rekomendasi Saudara'}
                        </span>
                      </div>
                      <div className="px-5 py-3">
                        <span className="text-[11px] font-medium text-slate-400 block">28. Alasan Utama Memilih SDIT</span>
                        <span className="font-semibold text-slate-900 mt-0.5 block">
                          {specific.mainReason || 'Pembinaan Karakter Islami & Tahfidz Al-Qur\'an'}
                        </span>
                      </div>
                    </div>

                    {specific.otherNotes && (
                      <div className="px-5 py-3">
                        <span className="text-[11px] font-medium text-slate-400 block">26. Catatan Khusus / Lain-lain</span>
                        <p className="font-medium text-slate-800 mt-1 leading-relaxed">{specific.otherNotes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: BERKAS & DOKUMEN FISIK / DIGITAL */}
            {activeTab === 'BERKAS' && (
              <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-150">
                {/* Status Biaya Registrasi */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                      Rp
                    </div>
                    <div>
                      <p className="text-[11px] font-medium text-slate-500">Biaya Formulir Registrasi Gelombang 1:</p>
                      <p className="text-base font-bold text-slate-900">
                        Rp {applicant.registrationFee ? applicant.registrationFee.toLocaleString('id-ID') : '250.000'}
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Status: {applicant.status}
                  </span>
                </div>

                {/* Uploaded Documents */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                  <div className="px-5 py-3.5 bg-slate-50/80 border-b border-slate-200/90 flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-emerald-700" />
                      <span>Dokumen Digital yang Diunggah ({applicant.documents.length})</span>
                    </h3>
                  </div>

                  <div className="p-5">
                    {applicant.documents.length === 0 ? (
                      <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                        <p className="font-semibold text-xs text-slate-600">Belum ada dokumen digital yang diunggah</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Calon siswa dapat menyerahkan berkas fisik langsung saat observasi atau menyusul via portal murid.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {applicant.documents.map((doc) => (
                          <div
                            key={doc.id}
                            className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/80 flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                                  {doc.docType}
                                </span>
                                <span className="text-[10px] text-slate-400">Digital</span>
                              </div>
                              <p className="text-xs font-semibold text-slate-900 truncate" title={doc.fileName}>
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
                </div>

                {/* Checklist Fisik Sesuai Formulir Resmi */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                  <div className="px-5 py-3.5 bg-slate-50/80 border-b border-slate-200/90 flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      <span>Checklist Dokumen Fisik Arsip Sekolah (Formulir F-PPDB)</span>
                    </h3>
                  </div>
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {[
                      'Kuitansi Asli Pendaftaran Rp 250.000',
                      'Fotokopi Akta Kelahiran Murid (2 Lembar)',
                      'Fotokopi Kartu Keluarga (KK) (2 Lembar)',
                      'Fotokopi KTP Kedua Orang Tua / Wali',
                      'Pas Foto 3x4 Calon Murid (3 Lembar)',
                      'Surat Keterangan Lulus / Ijazah TK (Bila Sudah Ada)',
                      'Surat Pindah & Buku Rapor Asli (Khusus Pindahan)',
                      'Surat Rekomendasi Psikolog (Khusus Usia <6 Tahun)'
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center space-x-2 p-2 rounded-lg bg-slate-50/80 border border-slate-100">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span className="text-slate-700 font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="px-4 sm:px-6 py-3.5 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
            <div className="text-[11px] text-slate-500 font-mono text-center sm:text-left">
              No. Reg: <span className="font-bold text-slate-800">{applicant.registrationNo}</span>
            </div>
            <div className="flex items-center justify-end space-x-2">
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
                className="px-4 py-2 rounded-xl bg-[#064E3B] hover:bg-emerald-900 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak / Unduh F-PPDB (A4)</span>
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
          dob={applicant.dob || '2021-05-14'}
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
          initialDob={applicant.dob || '2021-05-14'}
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
