'use client';

import React from 'react';
import { Printer, X, FileText, CheckSquare, ShieldCheck, QrCode } from 'lucide-react';

interface OfficialRegistrationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  regNo: string;
  studentName: string;
  nik: string;
  gender: string;
  pob: string;
  dob: string;
  address: string;
  schoolName: string;
  schoolSlug: string;
  admissionTrack?: string;
  schoolSpecificData?: Record<string, unknown>;
  parentData?: Record<string, string>;
  createdAt?: string;
}

export default function OfficialRegistrationFormModal({
  isOpen,
  onClose,
  regNo,
  studentName,
  nik,
  gender,
  pob,
  dob,
  address,
  schoolName,
  schoolSlug,
  admissionTrack = 'REGULER',
  schoolSpecificData = {},
  parentData = {},
  createdAt,
}: OfficialRegistrationFormModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDob = dob
    ? new Date(dob).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '-';

  const registrationDate = createdAt
    ? new Date(createdAt).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

  const getUnitLevel = () => {
    if (schoolSlug === 'tk') return 'PAUD / TK IT (Taman Kanak-Kanak Islam Terpadu)';
    if (schoolSlug === 'smp') return 'SMP IT (Sekolah Menengah Pertama Islam Terpadu)';
    return 'SDIT (Sekolah Dasar Islam Terpadu)';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto print:p-0 print:bg-white print:static">
      {/* Container Dialog */}
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden print:shadow-none print:w-full print:max-w-none print:rounded-none my-6">
        {/* Screen Controls Header (Hidden in Print) */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#2D7A70]" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Formulir Pendaftaran Resmi Murid Baru (F-PPDB A4)
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#2D7A70] hover:bg-[#184F48] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Formulir A4</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Paper (A4 Style) */}
        <div className="p-8 sm:p-12 print:p-6 text-slate-900 font-sans max-w-[210mm] mx-auto bg-white">
          
          {/* ================= HALAMAN 1 ================= */}
          <div className="space-y-5 pb-8 border-b-2 border-dashed border-slate-300 print:border-none print:pb-0 print:break-after-page">
            
            {/* Kop Surat Yayasan / Satuan SDIT */}
            {schoolSlug === 'sd' ? (
              <div className="border-b-2 border-slate-900 pb-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 flex items-center justify-center flex-shrink-0">
                    <img
                      src="/images/sd-logo.png"
                      alt="Logo SDIT Al-Afiyah"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h2 className="text-xs font-bold tracking-wider text-slate-800 uppercase">
                      YAYASAN PENDIDIKAN IMAM BONJOL
                    </h2>
                    <p className="text-[12px] font-bold text-slate-700">
                      المدرسة الإبتدائية المتكاملة العافية
                    </p>
                    <h1 className="text-sm sm:text-base font-black text-slate-900 uppercase leading-tight">
                      SEKOLAH DASAR ISLAM TERPADU SDIT AL AFIYAH
                    </h1>
                    <p className="text-[9px] sm:text-[10px] text-slate-600 leading-snug">
                      SK. DISDIK NOMOR : 473 TAHUN 2017 &bull; NSS : 102021601070 &bull; NPSN : 69900910<br />
                      ALAMAT : LINGKUNGAN GIRI ASIH - JL. GERAKAN KOPERASI MAJALENGKA WETAN 45411
                    </p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="inline-block px-2.5 py-1 rounded border border-slate-900 text-[11px] font-mono font-extrabold uppercase">
                    F-PPDB 2027/2028
                  </span>
                  <div className="text-[10px] text-slate-500 mt-1 font-mono">
                    No: {regNo}
                  </div>
                </div>
              </div>
            ) : (
              <div className="border-b-2 border-slate-900 pb-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {schoolSlug === 'smp' ? (
                    <div className="w-16 h-16 flex items-center justify-center flex-shrink-0">
                      <img
                        src="/images/smp-logo.png"
                        alt="Logo SMP IT Al-Afiyah"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-[#184F48] text-white font-extrabold text-2xl flex items-center justify-center flex-shrink-0 border-2 border-amber-400">
                      IB
                    </div>
                  )}
                  <div>
                    <h2 className="text-xs font-bold tracking-widest text-slate-600 uppercase">
                      Yayasan Pendidikan Imam Bonjol Majalengka
                    </h2>
                    <h1 className="text-base sm:text-lg font-black text-slate-900 uppercase leading-tight">
                      {schoolName}
                    </h1>
                    <p className="text-[10px] sm:text-[11px] text-slate-600 leading-snug">
                      Jl. Gerakan Koperasi, Majalengka, Jawa Barat 45411<br />
                      Izin Kemenag/Kemdikbud RI • Telp/WA: (0233) 8281-9900 • Web: https://alafiyah.id
                    </p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="inline-block px-2.5 py-1 rounded border border-slate-900 text-[11px] font-mono font-extrabold uppercase">
                    F-PPDB 2026
                  </span>
                  <div className="text-[10px] text-slate-500 mt-1 font-mono">
                    No: {regNo}
                  </div>
                </div>
              </div>
            )}

            {/* Judul Formulir */}
            <div className="text-center pt-2">
              <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-slate-900 underline decoration-slate-400">
                {schoolSlug === 'sd'
                  ? 'FORMULIR PENDAFTARAN CALON PESERTA DIDIK BARU SDIT AL AFIYAH'
                  : 'Lembar Formulir Pendaftaran Peserta Didik Baru'}
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                TAHUN PELAJARAN 2027/2028 &bull; GELOMBANG 1
              </p>
            </div>

            {/* Kotak Ringkasan Registrasi */}
            <div className="grid grid-cols-3 gap-2 p-2.5 bg-slate-50 border border-slate-300 text-xs">
              <div>
                <span className="text-slate-500 text-[10px] block">No. Pendaftaran:</span>
                <span className="font-mono font-bold text-slate-900">{regNo}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Gelombang Pendaftaran:</span>
                <span className="font-bold text-slate-900">Gelombang 1 (Rp 250.000)</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Jalur Masuk:</span>
                <span className="font-bold text-[#184F48]">{admissionTrack}</span>
              </div>
            </div>

            {/* Bagian A: Identitas Anak (Poin 1-17) */}
            <div className="space-y-2">
              <div className="bg-slate-800 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider">
                A. KETERANGAN ANAK
              </div>

              <div className="flex gap-4">
                {/* Tabel Identitas */}
                <table className="flex-1 text-xs border-collapse">
                  <tbody>
                    <tr className="border-b border-slate-200">
                      <td className="py-1 w-44 text-slate-600">1. Nama Lengkap</td>
                      <td className="py-1 w-3 text-center">:</td>
                      <td className="py-1 font-bold uppercase text-slate-900">{studentName}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-1 text-slate-600">2. Nama Panggilan</td>
                      <td className="py-1 text-center">:</td>
                      <td className="py-1 text-slate-900">{(schoolSpecificData.nickname as string) || '-'}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-1 text-slate-600">3. Jenis Kelamin</td>
                      <td className="py-1 text-center">:</td>
                      <td className="py-1 text-slate-900">
                        {gender === 'L' ? 'Laki-Laki' : 'Perempuan'}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-1 text-slate-600">4. Tempat &amp; Tanggal Lahir</td>
                      <td className="py-1 text-center">:</td>
                      <td className="py-1 text-slate-900">{pob}, {formattedDob}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-1 text-slate-600">5. Agama</td>
                      <td className="py-1 text-center">:</td>
                      <td className="py-1 text-slate-900">{(schoolSpecificData.religion as string) || 'Islam'}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-1 text-slate-600">6. Kewarganegaraan</td>
                      <td className="py-1 text-center">:</td>
                      <td className="py-1 text-slate-900">{(schoolSpecificData.citizenship as string) || 'WNI'}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-1 text-slate-600">7. Anak ke-</td>
                      <td className="py-1 text-center">:</td>
                      <td className="py-1 text-slate-900">{(schoolSpecificData.childOrder as string) || '1'}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-1 text-slate-600">8. Jml Saudara Kandung</td>
                      <td className="py-1 text-center">:</td>
                      <td className="py-1 text-slate-900">{(schoolSpecificData.siblingsCount as string) || '1'} Orang</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-1 text-slate-600">9. Jml Saudara Tiri/Angkat</td>
                      <td className="py-1 text-center">:</td>
                      <td className="py-1 text-slate-900">{(schoolSpecificData.stepSiblingsCount as string) || '0'} Orang</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-1 text-slate-600">10. Bahasa Sehari-hari</td>
                      <td className="py-1 text-center">:</td>
                      <td className="py-1 text-slate-900">{(schoolSpecificData.dailyLanguage as string) || 'Bahasa Indonesia'}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-1 text-slate-600">11. Tinggi Badan / 12. Berat</td>
                      <td className="py-1 text-center">:</td>
                      <td className="py-1 text-slate-900">
                        {(schoolSpecificData.heightCm as string) ? `${schoolSpecificData.heightCm} cm` : '-'} / {(schoolSpecificData.weightKg as string) ? `${schoolSpecificData.weightKg} kg` : '-'}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-1 text-slate-600">13. Penyakit Pernah Diderita</td>
                      <td className="py-1 text-center">:</td>
                      <td className="py-1 text-slate-900">{(schoolSpecificData.diseaseHistory as string) || 'Tidak Ada'}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-1 text-slate-600">14. Golongan Darah</td>
                      <td className="py-1 text-center">:</td>
                      <td className="py-1 text-slate-900">{(schoolSpecificData.bloodType as string) || 'Belum Tahu'}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-1 text-slate-600">15. Jarak Rumah ke Sekolah</td>
                      <td className="py-1 text-center">:</td>
                      <td className="py-1 text-slate-900">{(schoolSpecificData.distanceToSchoolKm as string) ? `${schoolSpecificData.distanceToSchoolKm} km` : '-'}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-1 text-slate-600">16. Mengikuti / Tinggal Dengan</td>
                      <td className="py-1 text-center">:</td>
                      <td className="py-1 text-slate-900">{(schoolSpecificData.livingWith as string) || 'Keduanya (Ayah & Ibu)'}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-1 text-slate-600">17. Alamat Lengkap</td>
                      <td className="py-1 text-center">:</td>
                      <td className="py-1 text-slate-900 leading-snug">{address}</td>
                    </tr>
                  </tbody>
                </table>

                {/* Box Pas Foto Fisik 3x4 */}
                <div className="w-24 h-32 border-2 border-dashed border-slate-400 rounded flex flex-col items-center justify-center p-2 text-center text-slate-400 text-[10px] flex-shrink-0 bg-slate-50 self-start">
                  <span>Pas Foto</span>
                  <span className="font-bold text-slate-500">3 x 4</span>
                  <span className="text-[9px] mt-1 text-slate-400">(Warna)</span>
                </div>
              </div>
            </div>

            {/* Bagian B: Data Orang Tua / Wali (Poin 18 - 20) */}
            <div className="space-y-2">
              <div className="bg-slate-800 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider">
                B. KETERANGAN ORANG TUA / WALI
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* 18. Data Ayah */}
                <div className="border border-slate-300 p-2.5 rounded bg-white space-y-1">
                  <div className="font-bold text-slate-900 border-b border-slate-200 pb-1 text-[11px] uppercase">
                    18. Data Ayah Kandung
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Nama Lengkap:</span>
                    <span className="font-semibold text-slate-900">{parentData.fatherName || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tahun Lahir / Pendidikan:</span>
                    <span className="text-slate-900">{parentData.fatherBirthYear || '-'} / {parentData.fatherEducation || 'S1'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Pekerjaan / Instansi:</span>
                    <span className="text-slate-900">{parentData.fatherJob || 'Wiraswasta'} {parentData.fatherCompany ? `(${parentData.fatherCompany})` : ''}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Jabatan:</span>
                    <span className="text-slate-900">{parentData.fatherPosition || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">No. Telp / HP:</span>
                    <span className="font-mono text-slate-900">{parentData.fatherPhone || parentData.phone || '-'}</span>
                  </div>
                </div>

                {/* 19. Data Ibu */}
                <div className="border border-slate-300 p-2.5 rounded bg-white space-y-1">
                  <div className="font-bold text-slate-900 border-b border-slate-200 pb-1 text-[11px] uppercase">
                    19. Data Ibu Kandung
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Nama Lengkap:</span>
                    <span className="font-semibold text-slate-900">{parentData.motherName || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tahun Lahir / Pendidikan:</span>
                    <span className="text-slate-900">{parentData.motherBirthYear || '-'} / {parentData.motherEducation || 'S1'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Pekerjaan / Instansi:</span>
                    <span className="text-slate-900">{parentData.motherJob || 'Ibu Rumah Tangga'} {parentData.motherCompany ? `(${parentData.motherCompany})` : ''}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Jabatan:</span>
                    <span className="text-slate-900">{parentData.motherPosition || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">No. WhatsApp Ibu:</span>
                    <span className="font-mono text-slate-900">{parentData.motherPhone || parentData.phone || '-'}</span>
                  </div>
                </div>
              </div>

              {parentData.hasGuardian === 'true' && parentData.guardianName && (
                <div className="border border-slate-300 p-2.5 rounded bg-white text-xs space-y-1 mt-2">
                  <div className="font-bold text-slate-900 border-b border-slate-200 pb-1 text-[11px] uppercase">
                    20. Data Wali Murid
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Nama Wali:</span>
                      <span className="font-semibold text-slate-900">{parentData.guardianName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Pekerjaan / Telp:</span>
                      <span className="text-slate-900">{parentData.guardianJob || '-'} / {parentData.guardianPhone || '-'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bagian C: Keterangan Lain-Lain (Poin 21 - 28) */}
            <div className="space-y-2">
              <div className="bg-slate-800 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider">
                C. KETERANGAN LAIN-LAIN
              </div>

              <div className="border border-slate-300 p-2.5 rounded text-xs space-y-1.5 bg-slate-50">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="flex justify-between">
                    <span className="text-slate-600">21. Berangkat Sekolah:</span>
                    <span className="font-bold text-slate-900 capitalize">{(schoolSpecificData.transportation as string) || 'Diantar'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">22. Masuk Sekolah Sebagai:</span>
                    <span className="font-bold text-slate-900">{(schoolSpecificData.admissionAs as string) || 'Murid Kelas 1 (Baru)'}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">23. Asal Sekolah (TK/BA/RA/DA):</span>
                  <span className="font-bold text-slate-900">{(schoolSpecificData.originSchoolName as string) || (schoolSpecificData.previousSchool as string) || 'TK IT / RA Al-Afiyah'}</span>
                </div>
                {(schoolSpecificData.transferSchoolName as string) && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">24. Pindahan dari SD/MI:</span>
                    <span className="font-bold text-slate-900">{schoolSpecificData.transferSchoolName as string}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-600">27. Info Pertama Mengenal SDIT:</span>
                  <span className="text-slate-900">{(schoolSpecificData.firstKnownSource as string) || 'Media Sosial / Rekomendasi'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">28. Alasan Utama Memilih SDIT:</span>
                  <span className="font-bold text-slate-900">{(schoolSpecificData.mainReason as string) || 'Kurikulum Islam Terpadu & Tahfidz Al-Qur\'an'}</span>
                </div>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 text-right italic">
              Hal. 1 dari 2 &mdash; Formulir Resmi SDIT AL AFIYAH Majalengka
            </div>
          </div>

          {/* ================= HALAMAN 2 ================= */}
          <div className="space-y-5 pt-8 print:pt-6">
            
            {/* Header Mini Halaman 2 */}
            <div className="border-b border-slate-300 pb-2 flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700">
                PERSYARATAN &amp; KELENGKAPAN PENDAFTARAN SISWA BARU SDIT AL AFIYAH 2027/2028
              </span>
              <span className="font-mono text-slate-400 text-[10px]">
                Hal. 2 dari 2
              </span>
            </div>

            {/* Kotak Ringkasan Murid Halaman 2 */}
            <div className="grid grid-cols-3 gap-2 p-2.5 bg-slate-50 border border-slate-300 text-xs">
              <div>
                <span className="text-slate-500 text-[10px] block">NO. PENDAFTARAN:</span>
                <span className="font-mono font-bold text-slate-900">{regNo}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">GELOMBANG PENDAFTARAN:</span>
                <span className="font-bold text-slate-900">Gelombang 1</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">NAMA PESERTA DIDIK:</span>
                <span className="font-bold text-slate-900 uppercase">{studentName}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-700 leading-snug">
              Orang tua calon peserta didik baru/pindahan SDIT AL AFIYAH mendaftarkan putra - putrinya dengan kelengkapan persyaratan sebagai berikut:
            </p>

            {/* Tabel 12 Butir Persyaratan Resmi Dokumen Fisik SDIT */}
            <div className="space-y-2">
              <table className="w-full text-xs border border-slate-300 border-collapse">
                <thead className="bg-slate-100 text-slate-800 font-bold">
                  <tr>
                    <th className="border border-slate-300 p-2 text-center w-10">No</th>
                    <th className="border border-slate-300 p-2 text-left">Rincian Persyaratan &amp; Kelengkapan</th>
                    <th className="border border-slate-300 p-2 text-center w-24">Cek Panitia</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-300 p-1.5 text-center">1</td>
                    <td className="border border-slate-300 p-1.5">Usia minimal SD kelas 1 per 1 Juli 2027 adalah enam tahun</td>
                    <td className="border border-slate-300 p-1.5 text-center font-bold text-emerald-800">[ &check; ]</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-1.5 text-center">2</td>
                    <td className="border border-slate-300 p-1.5">Membayar biaya pendaftaran sebesar Rp250.000,00 (gelombang 1), Rp275.000,00 (gelombang 2), atau Rp300.000,00 (gelombang 3)</td>
                    <td className="border border-slate-300 p-1.5 text-center font-bold text-emerald-800">[ &check; ] LUNAS</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-1.5 text-center">3</td>
                    <td className="border border-slate-300 p-1.5">Mengisi formulir pendaftaran</td>
                    <td className="border border-slate-300 p-1.5 text-center font-bold text-emerald-800">[ &check; ]</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-1.5 text-center">4</td>
                    <td className="border border-slate-300 p-1.5">Menyerahkan foto copy ijazah/surat keterangan Tamat dari TK/RA/BA (1 lembar)</td>
                    <td className="border border-slate-300 p-1.5 text-center font-bold text-slate-700">[ &check; ]</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-1.5 text-center">5</td>
                    <td className="border border-slate-300 p-1.5">Menyerahkan foto copy Kartu Keluarga (2 lembar)</td>
                    <td className="border border-slate-300 p-1.5 text-center font-bold text-slate-700">[ &check; ]</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-1.5 text-center">6</td>
                    <td className="border border-slate-300 p-1.5">Menyerahkan foto copy Akta Kelahiran (2 lembar)</td>
                    <td className="border border-slate-300 p-1.5 text-center font-bold text-slate-700">[ &check; ]</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-1.5 text-center">7</td>
                    <td className="border border-slate-300 p-1.5">Menyerahkan pas foto berwarna 3x4 (2 lembar)</td>
                    <td className="border border-slate-300 p-1.5 text-center font-bold text-slate-700">[ &check; ]</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-1.5 text-center">8</td>
                    <td className="border border-slate-300 p-1.5">Surat pengantar dari sekolah sebelumnya (bagi pindahan)</td>
                    <td className="border border-slate-300 p-1.5 text-center text-slate-400">[ &minus; ]</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-1.5 text-center">9</td>
                    <td className="border border-slate-300 p-1.5">Raport terakhir dari sekolah sebelumnya (bagi pindahan)</td>
                    <td className="border border-slate-300 p-1.5 text-center text-slate-400">[ &minus; ]</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-1.5 text-center">10</td>
                    <td className="border border-slate-300 p-1.5">NISN (bagi pindahan)</td>
                    <td className="border border-slate-300 p-1.5 text-center text-slate-400">[ &minus; ]</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-1.5 text-center">11</td>
                    <td className="border border-slate-300 p-1.5">Surat kelakuan baik (bagi pindahan)</td>
                    <td className="border border-slate-300 p-1.5 text-center text-slate-400">[ &minus; ]</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-1.5 text-center">12</td>
                    <td className="border border-slate-300 p-1.5">Surat Akreditasi sekolah (bagi pindahan)</td>
                    <td className="border border-slate-300 p-1.5 text-center text-slate-400">[ &minus; ]</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Stopmap Notice */}
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded text-[11px] text-amber-950 font-medium leading-relaxed">
              Semua persyaratan tersebut dimasukkan ke dalam <strong>1 stopmap</strong> dan dikumpulkan pada waktu mengembalikan formulir, paling lambat diserahkan pada saat <strong>tiga hari sebelum pelaksanaan Tes PPDB 2027/2028</strong>.
            </div>

            {/* Area Tanda Tangan */}
            <div className="pt-4 grid grid-cols-2 gap-8 text-xs">
              {/* Panitia PPDB SDIT AL AFIYAH */}
              <div className="text-center space-y-16">
                <div>
                  <p className="text-slate-600">Majalengka, {registrationDate}</p>
                  <p className="font-bold text-slate-900">Panitia PPDB SDIT AL AFIYAH</p>
                  <p className="text-[10px] text-slate-500">Penerima Berkas,</p>
                </div>
                <div>
                  <p className="font-bold text-slate-900 underline">
                    ( .................................................... )
                  </p>
                  <p className="text-[10px] text-slate-500">Tanda Tangan &amp; Nama Terang</p>
                </div>
              </div>

              {/* Orang Tua / Wali */}
              <div className="text-center space-y-16">
                <div>
                  <p className="text-slate-600">Majalengka, {registrationDate}</p>
                  <p className="font-bold text-slate-900">Orang Tua / Wali Calon Murid,</p>
                </div>
                <div>
                  <p className="font-bold text-slate-900 underline">
                    ( {parentData.fatherName || parentData.motherName || '...........................................'} )
                  </p>
                  <p className="text-[10px] text-slate-500">Tanda Tangan &amp; Nama Terang</p>
                </div>
              </div>
            </div>

            {/* Footer Nota */}
            <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span>Dicetak melalui Portal Murid Al-Afiyah: {regNo}</span>
              <span>Dokumen Sah Panitia PPDB TA 2027/2028</span>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
