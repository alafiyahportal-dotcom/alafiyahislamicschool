'use client';

import React from 'react';
import { Printer, X, Award, ShieldCheck, Download, Calendar } from 'lucide-react';

interface AdmissionLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  regNo: string;
  schoolName: string;
  schoolSlug: string;
  admissionTrack?: string;
  nik?: string;
  parentName?: string;
}

export default function AdmissionLetterModal({
  isOpen,
  onClose,
  studentName,
  regNo,
  schoolName,
  schoolSlug,
  admissionTrack = 'REGULER',
  nik = '3210123456780001',
  parentName = 'Bapak/Ibu Orang Tua / Wali',
}: AdmissionLetterModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto print:p-0 print:bg-white print:static">
      {/* Container Dialog */}
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden print:shadow-none print:w-full print:max-w-none print:rounded-none my-6">
        {/* Screen Controls Header (Hidden in Print) */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200 print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#2D7A70]" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Surat Keputusan (SK) Kelulusan Resmi
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#2D7A70] hover:bg-[#23635b] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / Simpan PDF</span>
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
        <div className="p-8 sm:p-12 text-slate-800 font-serif leading-relaxed print:p-8">
          {/* KOP SURAT YAYASAN */}
          <div className="text-center pb-4 border-b-4 border-double border-slate-900">
            <div className="flex items-center justify-center gap-4 mb-2">
              {schoolSlug === 'sd' ? (
                <div className="w-14 h-14 flex items-center justify-center shrink-0">
                  <img
                    src="/images/sd-logo.png"
                    alt="Logo SD IT Al-Afiyah"
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-full bg-[#184F48] flex items-center justify-center text-white font-sans font-extrabold text-xl shadow-xs border-2 border-emerald-500">
                  IB
                </div>
              )}
              <div>
                <h3 className="text-sm font-sans font-extrabold tracking-widest text-[#184F48] uppercase">
                  YAYASAN PENDIDIKAN IMAM BONJOL MAJALENGKA
                </h3>
                <h2 className="text-lg font-sans font-black text-slate-900 uppercase tracking-wide">
                  {schoolName.toUpperCase()}
                </h2>
                <p className="text-[11px] font-sans text-slate-600">
                  Kompleks Pendidikan Islam Terpadu Al-Afiyah, Majalengka, Jawa Barat 45411
                </p>
                <p className="text-[10px] font-sans text-slate-500">
                  Telp: 0812-2334-4552 | Email: sekretariat@alafiyah.sch.id | Web: https://alafiyah.sch.id
                </p>
              </div>
            </div>
          </div>

          {/* NOMOR SURAT & PERIHAL */}
          <div className="text-center mt-6 mb-6">
            <h1 className="text-sm font-sans font-bold uppercase tracking-wider underline text-slate-900">
              SURAT KEPUTUSAN PANITIA SELEKSI PENERIMAAN MURID BARU (PPDB)
            </h1>
            <p className="text-xs font-sans text-slate-700 mt-1">
              Nomor: 045/SK-PPDB/YPIB/{schoolSlug.toUpperCase()}/V/2026
            </p>
            <p className="text-xs font-sans font-semibold text-slate-800 mt-1">
              TENTANG: KELULUSAN SELEKSI DAN PENERIMAAN MURID BARU TAHUN AJARAN 2026/2027
            </p>
          </div>

          {/* ISI KEPUTUSAN */}
          <div className="space-y-4 text-xs sm:text-[13px] text-justify font-sans">
            <p>
              Berdasarkan hasil verifikasi berkas persyaratan administratif, observasi kesiapan belajar, tes wawancara potensi murid dan pemetaan kompetensi keislaman yang telah dilaksanakan oleh Panitia Penerimaan Murid Baru (PPDB) Yayasan Pendidikan Imam Bonjol Majalengka, dengan ini Ketua Yayasan dan Mudir Lembaga menetapkan bahwa:
            </p>

            {/* TABEL DATA MURID */}
            <div className="my-3 mx-4 p-4 bg-slate-50/80 border border-slate-200 rounded-xl font-sans">
              <table className="w-full text-xs">
                <tbody>
                  <tr className="border-b border-slate-200/60">
                    <td className="py-1.5 w-40 font-semibold text-slate-600">Nama Lengkap Murid</td>
                    <td className="py-1.5 w-4 text-slate-400">:</td>
                    <td className="py-1.5 font-bold text-slate-900 text-sm">{studentName}</td>
                  </tr>
                  <tr className="border-b border-slate-200/60">
                    <td className="py-1.5 font-semibold text-slate-600">Nomor Registrasi</td>
                    <td className="py-1.5 text-slate-400">:</td>
                    <td className="py-1.5 font-mono font-bold text-[#184F48]">{regNo}</td>
                  </tr>
                  <tr className="border-b border-slate-200/60">
                    <td className="py-1.5 font-semibold text-slate-600">NIK Murid</td>
                    <td className="py-1.5 text-slate-400">:</td>
                    <td className="py-1.5 font-mono text-slate-800">{nik}</td>
                  </tr>
                  <tr className="border-b border-slate-200/60">
                    <td className="py-1.5 font-semibold text-slate-600">Nama Orang Tua / Wali</td>
                    <td className="py-1.5 text-slate-400">:</td>
                    <td className="py-1.5 text-slate-800">{parentName}</td>
                  </tr>
                  <tr className="border-b border-slate-200/60">
                    <td className="py-1.5 font-semibold text-slate-600">Jalur Pendaftaran</td>
                    <td className="py-1.5 text-slate-400">:</td>
                    <td className="py-1.5 font-semibold text-emerald-700">{admissionTrack}</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 font-semibold text-slate-600">Unit Sekolah Diterima</td>
                    <td className="py-1.5 text-slate-400">:</td>
                    <td className="py-1.5 font-bold text-slate-900">{schoolName}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* STATUS KELULUSAN */}
            <div className="p-3 bg-emerald-50/70 border border-emerald-300 rounded-xl text-center my-4 font-sans">
              <span className="text-[11px] uppercase font-bold text-emerald-800 tracking-wider block">
                HASIL KEPUTUSAN PANITIA SELEKSI:
              </span>
              <span className="text-base font-extrabold text-emerald-900 tracking-widest mt-0.5 block">
                DITERIMA SEBAGAI MURID BARU T.A. 2026/2027
              </span>
            </div>

            <p>
              Kepada orang tua/wali murid yang bersangkutan dimohon untuk menyelesaikan proses daftar ulang administratif dan penyerahan berkas fisik asli sesuai jadwal yang telah ditentukan oleh kantor tata usaha sekolah.
            </p>

            <p>
              Demikian surat keputusan ini diterbitkan dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya. Semoga Allah Subhanahu wa Ta&apos;ala memberikan keberkahan dan kemudahan dalam menuntut ilmu.
            </p>
          </div>

          {/* TANDA TANGAN & STEMPEL RESMI */}
          <div className="mt-8 flex justify-end font-sans">
            <div className="w-64 text-center text-xs relative">
              <p className="text-slate-600">Majalengka, {currentDate}</p>
              <p className="font-bold text-slate-900 mt-1">Ketua Yayasan Pendidikan Imam Bonjol</p>

              {/* AREA TTD & STEMPEL */}
              <div className="relative h-24 my-2 flex items-center justify-center">
                {/* STEMPEL RESMI BASAH DIGITAL (EMERALD CIRCLE) */}
                <div className="absolute left-6 w-20 h-20 rounded-full border-2 border-dashed border-emerald-600/70 flex flex-col items-center justify-center text-emerald-700 font-bold rotate-[-12deg] pointer-events-none opacity-85">
                  <span className="text-[7px] uppercase tracking-tighter">YAYASAN IMAM BONJOL</span>
                  <Award className="w-5 h-5 text-emerald-600 my-0.5" />
                  <span className="text-[7px] uppercase tracking-tighter">MAJALENGKA</span>
                </div>

                {/* TANDA TANGAN KALIGRAFI */}
                <span className="font-serif italic font-extrabold text-xl text-slate-800 tracking-wider rotate-[-2deg]">
                  Ahmad Sanusi
                </span>
              </div>

              <p className="font-bold text-slate-900 underline">Dr. H. Ahmad Sanusi, M.Pd.I</p>
              <p className="text-[11px] text-slate-500">NIPY. 19780415 200801 1 002</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
