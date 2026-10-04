'use client';

import React from 'react';
import { X, Printer, CheckCircle2, ShieldCheck } from 'lucide-react';

interface StudentDossierPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: any;
}

export const StudentDossierPrintModal: React.FC<StudentDossierPrintModalProps> = ({
  isOpen,
  onClose,
  student
}) => {
  if (!isOpen || !student) return null;

  const handlePrint = () => {
    window.print();
  };

  // Parse parent info safely
  let parents: any = {};
  try {
    if (typeof student.parentInfo === 'string') {
      parents = JSON.parse(student.parentInfo);
    } else if (student.parentInfo) {
      parents = student.parentInfo;
    }
  } catch (e) {
    parents = {};
  }

  // Parse specific data if available from registration
  let specData: any = {};
  try {
    if (student.registration?.schoolSpecificData) {
      specData = JSON.parse(student.registration.schoolSpecificData);
    }
  } catch (e) {
    specData = {};
  }

  const birthDateFormatted = new Date(student.dob).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const entryDateFormatted = new Date(student.createdAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const unitName = student.school?.name || 'Sekolah Islam Terpadu Al-Afiyah';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-transparent print:static">
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden my-8 print:my-0 print:shadow-none print:rounded-none print:max-w-none print:w-full">
        {/* Screen Toolbar Header (Hidden on Print) */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#2D7A70] flex items-center justify-center text-white font-bold">
              BI
            </div>
            <div>
              <h2 className="text-base font-semibold">Lembar Buku Induk Murid Resmi (A4)</h2>
              <p className="text-xs text-slate-400">
                NIS: {student.nis} • {student.fullName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#2D7A70] hover:bg-[#184F48] rounded-lg transition-colors cursor-pointer shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Buku Induk (A4)</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Sheet (A4 Dimensions) */}
        <div className="p-8 sm:p-12 text-slate-800 text-xs leading-relaxed font-serif print:p-6 print:text-[11px]">
          {/* Official Letterhead (Kop Surat) */}
          <div className="border-b-2 border-slate-900 pb-4 mb-6">
            <div className="flex items-center justify-between gap-4">
              <div className="w-16 h-16 flex-shrink-0 rounded-xl bg-[#184F48] text-white flex flex-col items-center justify-center font-bold font-sans">
                <span className="text-xl tracking-tighter">IB</span>
                <span className="text-[8px] uppercase tracking-widest text-amber-300">Majalengka</span>
              </div>
              <div className="text-center flex-1 font-sans">
                <h3 className="text-[11px] uppercase tracking-widest font-semibold text-slate-600">
                  Yayasan Pendidikan Imam Bonjol Majalengka
                </h3>
                <h1 className="text-xl font-bold uppercase text-[#184F48] tracking-tight mt-0.5">
                  {unitName}
                </h1>
                <p className="text-[10px] text-slate-500 mt-1 font-serif">
                  Izin Operasional Kemendikbud & Kemenag RI • NPSN: 69987654 • NSM: 121232100099
                </p>
                <p className="text-[10px] text-slate-500 font-serif">
                  Jl. Imam Bonjol No. 01, Cigasong, Kabupaten Majalengka, Jawa Barat 45411 | Telp/WA: 0812-3456-7890
                </p>
              </div>
              <div className="w-16 flex-shrink-0 text-right font-sans">
                <div className="inline-block border border-slate-300 px-2 py-1 rounded text-[9px] font-bold text-slate-700 bg-slate-50 uppercase">
                  EMIS / DAPODIK
                </div>
              </div>
            </div>
          </div>

          {/* Document Title */}
          <div className="text-center mb-6 font-sans">
            <h2 className="text-base font-bold uppercase tracking-wider text-slate-900 underline underline-offset-4">
              LEMBAR BUKU INDUK SISWA / MURID
            </h2>
            <p className="text-[11px] text-slate-600 mt-1 font-serif">
              Tahun Pelajaran {student.academicYear || '2026/2027'} • Kelas/Rombel: <strong>{student.classGrade}</strong>
            </p>
          </div>

          {/* Photo & Primary Identifiers Banner */}
          <div className="flex items-start justify-between gap-6 p-4 mb-6 border border-slate-300 rounded-lg bg-slate-50/50 font-sans">
            <div className="flex-1 space-y-1 text-xs">
              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-500 font-medium">Nomor Induk Murid (NIS):</span>
                <span className="col-span-2 font-bold text-slate-900 tracking-wide text-sm">{student.nis}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-500 font-medium">NISN Kemendikbud:</span>
                <span className="col-span-2 font-semibold text-slate-900">{student.nisn || 'Dalam Proses Verifikasi Dinas'}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-500 font-medium">Nama Lengkap Murid:</span>
                <span className="col-span-2 font-bold text-[#184F48] text-sm uppercase">{student.fullName}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-500 font-medium">NIK Kependudukan:</span>
                <span className="col-span-2 text-slate-800 font-mono">{student.nik || '-'}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-500 font-medium">Status Siswa:</span>
                <span className="col-span-2 font-semibold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>MURID AKTIF TERDAFTAR</span>
                </span>
              </div>
            </div>

            {/* Photo Box 3x4 */}
            <div className="w-24 h-32 border-2 border-dashed border-slate-400 rounded-md flex flex-col items-center justify-center text-slate-400 text-[10px] bg-white flex-shrink-0">
              <span>Pas Foto</span>
              <span className="font-sans font-bold text-slate-500">3 x 4 cm</span>
              <span className="text-[8px] text-slate-400 mt-1">Stempel Cap</span>
            </div>
          </div>

          {/* Section A: Data Pribadi Murid */}
          <div className="mb-5">
            <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-white bg-[#2D7A70] px-3 py-1 rounded-sm mb-2">
              A. IDENTITAS PRIBADI MURID
            </h4>
            <table className="w-full border-collapse border border-slate-300">
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="w-1/3 py-1 px-3 bg-slate-50 font-medium text-slate-600 border-r border-slate-200">1. Nama Lengkap</td>
                  <td className="py-1 px-3 font-semibold text-slate-900">{student.fullName}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-1 px-3 bg-slate-50 font-medium text-slate-600 border-r border-slate-200">2. Jenis Kelamin</td>
                  <td className="py-1 px-3 text-slate-800">{student.gender === 'L' ? 'Laki-laki (Ikhwan)' : 'Perempuan (Akhwat)'}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-1 px-3 bg-slate-50 font-medium text-slate-600 border-r border-slate-200">3. Tempat, Tanggal Lahir</td>
                  <td className="py-1 px-3 text-slate-800">{student.pob}, {birthDateFormatted}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-1 px-3 bg-slate-50 font-medium text-slate-600 border-r border-slate-200">4. Agama & Kewarganegaraan</td>
                  <td className="py-1 px-3 text-slate-800">{student.religion || 'Islam'} / Indonesia (WNI)</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-1 px-3 bg-slate-50 font-medium text-slate-600 border-r border-slate-200">5. Alamat Tempat Tinggal</td>
                  <td className="py-1 px-3 text-slate-800">{student.address}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-1 px-3 bg-slate-50 font-medium text-slate-600 border-r border-slate-200">6. Tanggal Terdaftar Masuk</td>
                  <td className="py-1 px-3 text-slate-800">{entryDateFormatted}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section B: Data Orang Tua / Wali */}
          <div className="mb-5">
            <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-white bg-[#2D7A70] px-3 py-1 rounded-sm mb-2">
              B. DATA ORANG TUA / WALI MURID
            </h4>
            <table className="w-full border-collapse border border-slate-300">
              <thead>
                <tr className="border-b border-slate-300 bg-slate-100 font-sans text-slate-700">
                  <th className="py-1 px-3 text-left w-1/3 border-r border-slate-300">Keterangan</th>
                  <th className="py-1 px-3 text-left w-1/3 border-r border-slate-300">Data Ayah Kandung</th>
                  <th className="py-1 px-3 text-left w-1/3">Data Ibu Kandung</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="py-1 px-3 bg-slate-50 font-medium text-slate-600 border-r border-slate-200">Nama Lengkap</td>
                  <td className="py-1 px-3 font-semibold text-slate-900 border-r border-slate-200">{parents.fatherName || '-'}</td>
                  <td className="py-1 px-3 font-semibold text-slate-900">{parents.motherName || '-'}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-1 px-3 bg-slate-50 font-medium text-slate-600 border-r border-slate-200">Pekerjaan / Instansi</td>
                  <td className="py-1 px-3 text-slate-800 border-r border-slate-200">{parents.fatherJob || '-'}</td>
                  <td className="py-1 px-3 text-slate-800">{parents.motherJob || '-'}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-1 px-3 bg-slate-50 font-medium text-slate-600 border-r border-slate-200">Nomor Telepon / WhatsApp</td>
                  <td className="py-1 px-3 text-slate-800 font-mono border-r border-slate-200">{parents.fatherPhone || parents.parentPhone || '-'}</td>
                  <td className="py-1 px-3 text-slate-800 font-mono">{parents.motherPhone || '-'}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-1 px-3 bg-slate-50 font-medium text-slate-600 border-r border-slate-200">Penghasilan Bulanan</td>
                  <td className="py-1 px-3 text-slate-800 border-r border-slate-200">{parents.fatherIncome || parents.parentIncome || '-'}</td>
                  <td className="py-1 px-3 text-slate-800">{parents.motherIncome || '-'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section C: Catatan Khusus & Perkembangan */}
          <div className="mb-6">
            <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-white bg-[#2D7A70] px-3 py-1 rounded-sm mb-2">
              C. CATATAN AKADEMIK & TAHFIDZ AL-QUR'AN
            </h4>
            <div className="border border-slate-300 p-3 rounded-sm bg-slate-50/50 text-slate-700">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-bold text-slate-900 block mb-1">Capaian Awal Masuk:</span>
                  <p className="text-slate-700">{student.notes || 'Murid Baru Terdaftar Hasil Seleksi PPDB Yayasan Pendidikan Imam Bonjol.'}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-900 block mb-1">Target Kurikulum Yayasan:</span>
                  <p className="text-slate-700">
                    {student.school?.slug === 'tk' && 'Kemandirian motorik, adab makan, hafalan doa harian & surat pendek Juz 30.'}
                    {student.school?.slug === 'sd' && 'Mutqin Juz 30 & 29, pembiasaan shalat berjamaah, sains & calistung terpadu.'}
                    {student.school?.slug === 'smp' && 'Tahfidz Al-Qur\'an Tartil & Mutqin, bahasa Arab & Inggris aktif, sains & adab terpadu.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Signatures & Legal Endorsement Section */}
          <div className="mt-8 pt-4 border-t border-slate-300 font-sans">
            <div className="flex items-center justify-between text-center">
              {/* Parent Signature */}
              <div className="w-56">
                <p className="text-slate-600 text-[10px]">Mengetahui,</p>
                <p className="font-bold text-slate-800 mt-0.5">Orang Tua / Wali Murid</p>
                <div className="h-20 flex items-center justify-center text-slate-300 text-[10px] italic">
                  (Tanda Tangan Asli)
                </div>
                <p className="font-semibold text-slate-900 underline underline-offset-2">
                  {parents.fatherName || parents.motherName || 'Wali Murid'}
                </p>
              </div>

              {/* Official Seal / Stempel Digital */}
              <div className="flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-full border-2 border-emerald-700 text-emerald-800 flex flex-col items-center justify-center p-1 transform -rotate-12 select-none shadow-xs">
                  <ShieldCheck className="w-5 h-5 text-emerald-700" />
                  <span className="text-[7px] font-bold uppercase text-center leading-none mt-0.5">
                    ARSIP RESMI
                  </span>
                  <span className="text-[6px] text-center font-bold text-emerald-700">
                    BUKU INDUK
                  </span>
                </div>
                <span className="text-[8px] text-slate-400 mt-1 font-mono">TERDAFTAR RESMI</span>
              </div>

              {/* School Principal Signature */}
              <div className="w-56">
                <p className="text-slate-600 text-[10px]">
                  Majalengka, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
                <p className="font-bold text-slate-800 mt-0.5">Kepala Sekolah / Mudir Unit</p>
                <div className="h-20 flex items-center justify-center text-slate-300 text-[10px] italic">
                  (Tanda Tangan & Stempel)
                </div>
                <p className="font-bold text-slate-900 underline underline-offset-2">
                  {student.school?.slug === 'tk' && 'Ibu Siti Aminah, S.Pd.'}
                  {student.school?.slug === 'sd' && 'Bapak H. Lukman Hakim, M.Pd.'}
                  {student.school?.slug === 'smp' && 'Bapak Dr. H. Ahmad Syauqi, M.Pd.I'}
                  {!['tk', 'sd', 'smp'].includes(student.school?.slug) && 'Pimpinan Lembaga Al-Afiyah'}
                </p>
                <p className="text-[9px] text-slate-500 font-mono">NIPY. 19840815.201201.1.001</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
