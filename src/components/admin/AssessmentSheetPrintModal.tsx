'use client';

import { X, Printer, Award, CheckCircle2, ShieldAlert } from 'lucide-react';

interface AssessmentSheetPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  registration: any;
  assessment: any;
}

export const AssessmentSheetPrintModal: React.FC<AssessmentSheetPrintModalProps> = ({
  isOpen,
  onClose,
  registration,
  assessment
}) => {
  if (!isOpen || !registration || !assessment) return null;

  const handlePrint = () => {
    window.print();
  };

  let aspectScores: any = {};
  try {
    if (typeof assessment.aspectScores === 'string') {
      aspectScores = JSON.parse(assessment.aspectScores);
    } else if (assessment.aspectScores) {
      aspectScores = assessment.aspectScores;
    }
  } catch (e) {
    aspectScores = {};
  }

  const unitSlug = registration.school?.slug || 'sd';
  const unitName = registration.school?.name || 'Sekolah Islam Terpadu Al-Afiyah';

  const assessedDateFormatted = new Date(assessment.assessedAt || Date.now()).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-transparent print:static">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden my-8 print:my-0 print:shadow-none print:rounded-none print:max-w-none print:w-full">
        {/* Screen Header (Hidden on Print) */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#2D7A70] flex items-center justify-center text-white">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold">Berita Acara & Lembar Hasil Asesmen (A4)</h2>
              <p className="text-xs text-slate-400">
                {registration.registrationNo} • {registration.studentName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#2D7A70] hover:bg-[#184F48] rounded-lg transition-colors cursor-pointer shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Lembar Asesmen (A4)</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Sheet */}
        <div className="p-8 sm:p-12 text-slate-800 text-xs leading-relaxed font-serif print:p-6 print:text-[11px]">
          {/* Official Letterhead */}
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
                <h1 className="text-lg font-bold uppercase text-[#184F48] tracking-tight mt-0.5">
                  PANITIA PENERIMAAN MURID BARU (PPDB) 2026/2027
                </h1>
                <p className="text-[10px] text-slate-500 mt-0.5 font-serif">
                  {unitName} • Lingkungan Sekolah Terpadu Cigasong, Kabupaten Majalengka, Jawa Barat
                </p>
              </div>
              <div className="w-16 flex-shrink-0 text-right font-sans">
                <div className="border border-slate-300 px-2 py-1 rounded text-[9px] font-bold text-slate-700 bg-slate-50 uppercase">
                  F-OBS-01
                </div>
              </div>
            </div>
          </div>

          {/* Document Title */}
          <div className="text-center mb-6 font-sans">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 underline underline-offset-4">
              BERITA ACARA & LEMBAR HASIL UJI OBSERVASI SELEKSI
            </h2>
            <p className="text-[11px] text-slate-600 mt-1 font-serif">
              Nomor: {registration.registrationNo}/PPDB-OBS/{new Date().getFullYear()}
            </p>
          </div>

          {/* Student Identifiers Banner */}
          <div className="grid grid-cols-2 gap-4 p-4 mb-6 border border-slate-300 rounded-lg bg-slate-50/50 font-sans text-xs">
            <div className="space-y-1.5">
              <div className="flex">
                <span className="w-32 text-slate-500 font-medium">No. Registrasi:</span>
                <span className="font-bold text-slate-900">{registration.registrationNo}</span>
              </div>
              <div className="flex">
                <span className="w-32 text-slate-500 font-medium">Nama Calon Murid:</span>
                <span className="font-bold text-[#184F48] uppercase">{registration.studentName}</span>
              </div>
              <div className="flex">
                <span className="w-32 text-slate-500 font-medium">Jenis Kelamin:</span>
                <span className="text-slate-800">{registration.gender === 'L' ? 'Laki-laki (Ikhwan)' : 'Perempuan (Akhwat)'}</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex">
                <span className="w-32 text-slate-500 font-medium">Unit Pilihan:</span>
                <span className="font-semibold text-slate-900">{unitName}</span>
              </div>
              <div className="flex">
                <span className="w-32 text-slate-500 font-medium">Tanggal Observasi:</span>
                <span className="text-slate-800">{assessedDateFormatted}</span>
              </div>
              <div className="flex">
                <span className="w-32 text-slate-500 font-medium">Guru Penguji:</span>
                <span className="font-semibold text-slate-900">{assessment.interviewerName}</span>
              </div>
            </div>
          </div>

          {/* Assessment Score Table */}
          <div className="mb-6 font-sans">
            <h4 className="font-bold text-xs uppercase tracking-wider text-white bg-[#2D7A70] px-3 py-1.5 rounded-sm mb-2 flex items-center justify-between">
              <span>RINCIAN SKOR INDIKATOR OBSERVASI</span>
              <span className="text-[10px] font-normal text-emerald-100">Skala 1 - 100</span>
            </h4>
            <table className="w-full border-collapse border border-slate-300 text-xs">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 text-slate-700">
                  <th className="py-2 px-3 text-left w-12 border-r border-slate-300">No</th>
                  <th className="py-2 px-3 text-left border-r border-slate-300">Aspek Kriteria Penilaian</th>
                  <th className="py-2 px-3 text-center w-24 border-r border-slate-300">Bobot</th>
                  <th className="py-2 px-3 text-center w-24">Nilai Diperoleh</th>
                </tr>
              </thead>
              <tbody>
                {unitSlug === 'tk' && (
                  <>
                    <tr className="border-b border-slate-200">
                      <td className="py-2 px-3 text-center border-r border-slate-200">1</td>
                      <td className="py-2 px-3 border-r border-slate-200 font-medium">Motorik Kasar & Halus (Keseimbangan, Menggunting, Meronce)</td>
                      <td className="py-2 px-3 text-center border-r border-slate-200 text-slate-500">25%</td>
                      <td className="py-2 px-3 text-center font-bold text-slate-900">{aspectScores.motorik || '-'}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-2 px-3 text-center border-r border-slate-200">2</td>
                      <td className="py-2 px-3 border-r border-slate-200 font-medium">Kemandirian & Toilet Training (Makan Sendiri, Melepas Sepatu)</td>
                      <td className="py-2 px-3 text-center border-r border-slate-200 text-slate-500">25%</td>
                      <td className="py-2 px-3 text-center font-bold text-slate-900">{aspectScores.kemandirian || '-'}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-2 px-3 text-center border-r border-slate-200">3</td>
                      <td className="py-2 px-3 border-r border-slate-200 font-medium">Komunikasi Verbal & Pengenalan Warna/Angka Dasar</td>
                      <td className="py-2 px-3 text-center border-r border-slate-200 text-slate-500">25%</td>
                      <td className="py-2 px-3 text-center font-bold text-slate-900">{aspectScores.komunikasi || '-'}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-2 px-3 text-center border-r border-slate-200">4</td>
                      <td className="py-2 px-3 border-r border-slate-200 font-medium">Wawancara Komitmen Orang Tua & Keselarasan Pola Asuh</td>
                      <td className="py-2 px-3 text-center border-r border-slate-200 text-slate-500">25%</td>
                      <td className="py-2 px-3 text-center font-bold text-slate-900">{aspectScores.wawancaraOrtu || '-'}</td>
                    </tr>
                  </>
                )}

                {unitSlug === 'sd' && (
                  <>
                    <tr className="border-b border-slate-200">
                      <td className="py-2 px-3 text-center border-r border-slate-200">1</td>
                      <td className="py-2 px-3 border-r border-slate-200 font-medium">Kelancaran Bacaan Iqro / Tahsin Al-Qur'an (Makhorijul Huruf)</td>
                      <td className="py-2 px-3 text-center border-r border-slate-200 text-slate-500">30%</td>
                      <td className="py-2 px-3 text-center font-bold text-slate-900">{aspectScores.tahsinIqro || '-'}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-2 px-3 text-center border-r border-slate-200">2</td>
                      <td className="py-2 px-3 border-r border-slate-200 font-medium">Kesiapan Calistung Dasar (Menulis Huruf, Hitung Sederhana)</td>
                      <td className="py-2 px-3 text-center border-r border-slate-200 text-slate-500">25%</td>
                      <td className="py-2 px-3 text-center font-bold text-slate-900">{aspectScores.calistung || '-'}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-2 px-3 text-center border-r border-slate-200">3</td>
                      <td className="py-2 px-3 border-r border-slate-200 font-medium">Hafalan Surat Pendek Juz Amma & Doa Harian</td>
                      <td className="py-2 px-3 text-center border-r border-slate-200 text-slate-500">25%</td>
                      <td className="py-2 px-3 text-center font-bold text-slate-900">{aspectScores.suratPendek || '-'}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-2 px-3 text-center border-r border-slate-200">4</td>
                      <td className="py-2 px-3 border-r border-slate-200 font-medium">Wawancara Kesiapan Belajar & Komitmen Pendampingan Orang Tua</td>
                      <td className="py-2 px-3 text-center border-r border-slate-200 text-slate-500">20%</td>
                      <td className="py-2 px-3 text-center font-bold text-slate-900">{aspectScores.wawancaraOrtu || '-'}</td>
                    </tr>
                  </>
                )}

                {unitSlug === 'smp' && (
                  <>
                    <tr className="border-b border-slate-200">
                      <td className="py-2 px-3 text-center border-r border-slate-200">1</td>
                      <td className="py-2 px-3 border-r border-slate-200 font-medium">Uji Tahfidz, Tajwid & Kelancaran Tilawah Al-Qur'an</td>
                      <td className="py-2 px-3 text-center border-r border-slate-200 text-slate-500">35%</td>
                      <td className="py-2 px-3 text-center font-bold text-slate-900">{aspectScores.tahfidzTajwid || '-'}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-2 px-3 text-center border-r border-slate-200">2</td>
                      <td className="py-2 px-3 border-r border-slate-200 font-medium">Tes Potensi Akademik (Matematika Dasar, Bahasa & Agama)</td>
                      <td className="py-2 px-3 text-center border-r border-slate-200 text-slate-500">25%</td>
                      <td className="py-2 px-3 text-center font-bold text-slate-900">{aspectScores.potensiAkademik || '-'}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-2 px-3 text-center border-r border-slate-200">3</td>
                      <td className="py-2 px-3 border-r border-slate-200 font-medium">Kesiapan Belajar &amp; Kemandirian Murid</td>
                      <td className="py-2 px-3 text-center border-r border-slate-200 text-slate-500">25%</td>
                      <td className="py-2 px-3 text-center font-bold text-slate-900">{aspectScores.kesiapanAsrama || '-'}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-2 px-3 text-center border-r border-slate-200">4</td>
                      <td className="py-2 px-3 border-r border-slate-200 font-medium">Wawancara Komitmen Orang Tua Terhadap Regulasi Sekolah</td>
                      <td className="py-2 px-3 text-center border-r border-slate-200 text-slate-500">15%</td>
                      <td className="py-2 px-3 text-center font-bold text-slate-900">{aspectScores.wawancaraOrtu || '-'}</td>
                    </tr>
                  </>
                )}

                {/* Score Summary Row */}
                <tr className="bg-slate-50 font-bold border-t-2 border-slate-400">
                  <td colSpan={3} className="py-2 px-3 text-right border-r border-slate-300 uppercase">
                    SKOR TOTAL AKHIR (TERTIMBANG):
                  </td>
                  <td className="py-2 px-3 text-center text-sm font-bold text-[#184F48] tabular-nums">
                    {assessment.totalScore} / 100
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Final Recommendation Card */}
          <div className="mb-6 p-4 border border-slate-300 rounded-lg bg-slate-50 font-sans">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-800 text-xs">REKOMENDASI KELULUSAN TIM PENGUJI:</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  assessment.recommendation === 'RECOMMENDED'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : assessment.recommendation === 'CONSIDERED'
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-rose-100 text-rose-800 border border-rose-300'
                }`}
              >
                {assessment.recommendation === 'RECOMMENDED' && 'SANGAT DIREKOMENDASIKAN (DITERIMA)'}
                {assessment.recommendation === 'CONSIDERED' && 'DIPERTIMBANGKAN (CADANGAN)'}
                {assessment.recommendation === 'NOT_RECOMMENDED' && 'BELUM MEMENUHI KRITERIA'}
              </span>
            </div>
            <p className="text-slate-700 text-xs font-serif italic">
              Catatan Tim Penguji: "{assessment.notes || 'Calon murid menunjukkan potensi adab dan kecerdasan yang selaras dengan nilai Al-Afiyah.'}"
            </p>
          </div>

          {/* Signatures */}
          <div className="mt-8 pt-4 border-t border-slate-300 font-sans">
            <div className="flex items-center justify-between text-center">
              <div className="w-56">
                <p className="text-slate-600 text-[10px]">
                  Majalengka, {assessedDateFormatted}
                </p>
                <p className="font-bold text-slate-800 mt-0.5">Guru Penguji Observasi</p>
                <div className="h-20 flex items-center justify-center text-slate-300 text-[10px] italic">
                  (Tanda Tangan Penguji)
                </div>
                <p className="font-semibold text-slate-900 underline underline-offset-2">
                  {assessment.interviewerName}
                </p>
                <p className="text-[9px] text-slate-500 font-mono">Tim Seleksi Akademik & Tahfidz</p>
              </div>

              <div className="w-56">
                <p className="text-slate-600 text-[10px]">Mengetahui,</p>
                <p className="font-bold text-slate-800 mt-0.5">Ketua Panitia PPDB Yayasan</p>
                <div className="h-20 flex items-center justify-center text-slate-300 text-[10px] italic">
                  (Tanda Tangan & Cap)
                </div>
                <p className="font-semibold text-slate-900 underline underline-offset-2">
                  Ketua Panitia PPDB
                </p>
                <p className="text-[9px] text-slate-500 font-mono">Ketua Panitia PPDB 2026/2027</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
