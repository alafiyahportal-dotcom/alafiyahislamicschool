'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Printer, 
  Download, 
  ArrowLeft, 
  ExternalLink, 
  CheckCircle2, 
  Share2, 
  ShieldCheck, 
  UserPlus, 
  LogIn, 
  Wallet,
  AlertCircle,
  Calculator
} from 'lucide-react';

export default function AffiliateGuidePage() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 py-6 sm:py-10 px-3 sm:px-6 font-sans print:p-0 print:m-0 print:bg-white text-slate-900">
      {/* CSS Khusus Cetak: Menghilangkan Header & Footer Otomatis Browser (URL localhost, Tanggal, Judul Tab) */}
      <style dangerouslySetInnerHTML={{ __html: `
        @page {
          size: A4 portrait;
          margin: 0mm !important;
        }
        @media print {
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print-paper {
            padding: 10mm 14mm !important;
            margin: 0 auto !important;
            max-width: 100% !important;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
          }
        }
      ` }} />

      {/* Top Floating Control Bar (Hidden on Print) */}
      <div className="max-w-4xl mx-auto mb-6 print:hidden">
        <div className="bg-slate-900 text-white rounded-2xl p-4 sm:px-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <Link 
              href="/affiliate" 
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Kembali ke Beranda Afiliasi"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
                Status: In Progress • Siap Cetak
              </span>
              <h1 className="text-sm sm:text-base font-bold text-white leading-tight">
                Panduan Operasional Akun Afiliasi SD IT Al-Afiyah
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Unduh PDF</span>
            </button>
            <a
              href="/docs/panduan-afiliasi-sdit-alafiyah.html"
              download="Panduan_Akun_Afiliasi_SDIT_AlAfiyah.html"
              className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer border border-white/20"
              title="Unduh File HTML Mandiri"
            >
              <Download className="w-4 h-4 text-emerald-300" />
              <span className="hidden sm:inline">Simpan File</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Document Paper Sheet (A4 Styled on Desktop and Print) */}
      <div className="print-paper max-w-4xl mx-auto bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-slate-200/90 overflow-hidden print:shadow-none print:border-none print:rounded-none">
        
        {/* Kop Surat Resmi Yayasan & SD IT */}
        <div className="p-6 sm:p-8 border-b-2 border-[#064E3B] text-center bg-slate-50/50 print:bg-transparent">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#064E3B] text-white flex items-center justify-center font-bold text-lg shadow-sm">
              IB
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#064E3B] uppercase tracking-wide">
                YAYASAN PENDIDIKAN IMAM BONJOL MAJALENGKA
              </h2>
              <p className="text-xs sm:text-sm font-bold text-emerald-800">
                SD IT AL-AFIYAH MAJALENGKA (SMART AKHLAQ FITRAH)
              </p>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 max-w-xl mx-auto">
            Lingkungan Giri Asih - Jl. Gerakan Koperasi, Kel. Majalengka Wetan 45411 • Hotline: 0813-1013-9001
          </p>
        </div>

        {/* Document Body */}
        <div className="p-6 sm:p-10 space-y-8">
          
          {/* Document Header & Title */}
          <div className="text-center space-y-1">
            <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-emerald-100 text-emerald-900 border border-emerald-200 inline-block">
              Petunjuk Operasional Singkat
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight pt-1">
              Cara Pendaftaran &amp; Login Akun Mitra Afiliasi
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
              Panduan ringkas bagi wali murid, dewan guru, dan simpatisan untuk bergabung sebagai mitra syiar dakwah SD IT Al-Afiyah.
            </p>
          </div>

          {/* Project In-Progress Notice */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <strong className="block font-bold text-emerald-900 mb-0.5">
                STATUS SISTEM: DALAM TAHAP PENGEMBANGAN AKTIF (IN PROGRESS)
              </strong>
              Platform digital terpadu Al-Afiyah saat ini terus disempurnakan. Dokumen panduan ini disiapkan sebagai materi bahasan dalam rapat internal SD IT Al-Afiyah siang ini untuk menyerap masukan operasional nyata dari para asatidzah dan pengurus yayasan.
            </div>
          </div>

          {/* BAGIAN 1: CARA DAFTAR AKUN */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 pb-2 border-b border-slate-200">
              <UserPlus className="w-5 h-5 text-emerald-700" />
              <h3 className="text-base font-extrabold text-[#064E3B]">
                A. Cara Pendaftaran Akun Mitra Afiliasi Baru (Hanya 2 Menit)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start space-x-3">
                <span className="w-7 h-7 rounded-full bg-[#064E3B] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  1
                </span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Buka Link Pendaftaran</h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Kunjungi <strong>alafiyah.sch.id/affiliate</strong> atau klik menu <em>&quot;Mitra Afiliasi&quot;</em> di bagian footer website sekolah.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start space-x-3">
                <span className="w-7 h-7 rounded-full bg-[#064E3B] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  2
                </span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Isi Formulir Singkat</h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Masukkan Nama Lengkap, Nomor WhatsApp aktif (untuk info pencairan), Alamat Email, dan buat Password baru.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start space-x-3">
                <span className="w-7 h-7 rounded-full bg-[#064E3B] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  3
                </span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Masukkan Rekening Bank</h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Pilih nama bank (contoh: <em>BSI / Bank Syariah Indonesia</em>) dan nomor rekening atas nama mitra untuk transfer ujrah.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start space-x-3">
                <span className="w-7 h-7 rounded-full bg-[#064E3B] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  4
                </span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Klik &quot;Daftar Sebagai Mitra&quot;</h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Akun langsung aktif seketika! Sistem langsung mengarahkan Anda ke <strong>Dasbor Mitra Pribadi</strong> di HP.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* BAGIAN 2: CARA LOGIN */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 pb-2 border-b border-slate-200">
              <LogIn className="w-5 h-5 text-emerald-700" />
              <h3 className="text-base font-extrabold text-[#064E3B]">
                B. Cara Login Akun Afiliasi (Bagi yang Sudah Terdaftar)
              </h3>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  ✓
                </span>
                <p className="text-xs text-slate-700 leading-relaxed">
                  <strong>Langkah 1:</strong> Buka halaman login di <strong>alafiyah.sch.id/login</strong>.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  ✓
                </span>
                <p className="text-xs text-slate-700 leading-relaxed">
                  <strong>Langkah 2:</strong> Masukkan <strong>Email</strong> dan <strong>Password</strong> yang didaftarkan, lalu klik <strong>&quot;Masuk ke Portal&quot;</strong>.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  ✓
                </span>
                <p className="text-xs text-slate-700 leading-relaxed">
                  <strong>Langkah 3:</strong> Anda langsung masuk ke halaman <strong>Dasbor Afiliasi</strong> (<code>/affiliate/dashboard</code>) untuk menyalin link dan cek rujukan.
                </p>
              </div>
            </div>

          </div>

          {/* BAGIAN 3: MEKANISME KERJA REFERRAL & KOMISI */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 pb-2 border-b border-slate-200">
              <Share2 className="w-5 h-5 text-emerald-700" />
              <h3 className="text-base font-extrabold text-[#064E3B]">
                C. Cara Kerja Menyebarkan Link &amp; Pemantauan Hasil
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-100 text-slate-900 border-b border-slate-200 font-bold">
                  <tr>
                    <th className="p-3">Tahapan</th>
                    <th className="p-3">Yang Dilakukan Mitra</th>
                    <th className="p-3">Yang Dilakukan Sistem Digital</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-3 font-bold text-emerald-800">1. Salin Link</td>
                    <td className="p-3 text-slate-700">Buka dasbor di HP, klik tombol <em>&quot;Salin Tautan Afiliasi&quot;</em>.</td>
                    <td className="p-3 text-slate-600">Sistem mengunci kode unik referral mitra (contoh: <code>?ref=AHMAD</code>).</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-emerald-800">2. Bagikan Info</td>
                    <td className="p-3 text-slate-700">Kirimkan link ke grup WA keluarga, kenalan, atau status WA bersama poster resmi.</td>
                    <td className="p-3 text-slate-600">Sistem melacak calon wali murid yang membuka link tersebut.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-emerald-800">3. Pendaftaran</td>
                    <td className="p-3 text-slate-700">Calon murid mengisi formulir PPDB online dan melunasi biaya formulir.</td>
                    <td className="p-3 text-slate-600">Sistem otomatis mencatat data pendaftar baru atas nama mitra.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-emerald-800">4. Pantau Hasil</td>
                    <td className="p-3 text-slate-700">Mitra membuka dasbor kapan saja untuk melihat nama pendaftar dan saldo komisi.</td>
                    <td className="p-3 text-slate-600">Data ditampilkan 100% transparan dan anti-sengketa.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-emerald-800">5. Pencairan</td>
                    <td className="p-3 text-slate-700">Mengajukan transfer ke rekening bank mitra, atau dialihkan sebagai <strong>pemotong SPP</strong> ananda.</td>
                    <td className="p-3 text-slate-600">Terekonsiliasi otomatis dengan laporan kas Bendahara Yayasan.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* BAGIAN 4: BESARAN & ESTIMASI POTENSI KOMISI MITRA */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 pb-2 border-b border-slate-200">
              <Wallet className="w-5 h-5 text-emerald-700" />
              <h3 className="text-base font-extrabold text-[#064E3B]">
                D. Struktur Resmi &amp; Estimasi Potensi Komisi / Ujrah Mitra
              </h3>
            </div>

            {/* Grid 3 Unit Sekolah */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">TK IT Al-Afiyah</span>
                <p className="text-lg font-black text-slate-900 mt-0.5">Rp 100.000</p>
                <span className="text-[10px] text-slate-500 block">per murid diterima</span>
              </div>
              <div className="p-3.5 rounded-xl border-2 border-emerald-500 bg-emerald-50/70 text-center relative shadow-sm">
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full shadow-xs">
                  Fokus SD IT
                </span>
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">SD IT Al-Afiyah</span>
                <p className="text-xl font-black text-emerald-900 mt-0.5">Rp 150.000</p>
                <span className="text-[10px] text-emerald-700 font-semibold block">total per murid rujukan</span>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">SMP IT Al-Afiyah</span>
                <p className="text-lg font-black text-slate-900 mt-0.5">Rp 200.000</p>
                <span className="text-[10px] text-slate-500 block">per murid diterima</span>
              </div>
            </div>

            {/* Rincian Mekanisme Komisi SD IT Al-Afiyah */}
            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs space-y-2">
              <span className="font-bold text-emerald-950 block text-[11px] uppercase tracking-wide">
                📌 Rincian Pembagian Komisi SD IT Al-Afiyah (Total Rp 150.000 / Murid):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-800">
                <div className="bg-white p-2.5 rounded-lg border border-emerald-200 shadow-2xs">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-slate-700">1. Tahap Pendaftaran</span>
                    <strong className="text-emerald-700 font-bold">Komisi Rp 50.000</strong>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">Uang pendaftaran formulir: Rp 250.000</p>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-emerald-200 shadow-2xs">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-slate-700">2. Tahap Daftar Ulang Awal</span>
                    <strong className="text-emerald-700 font-bold">Komisi Rp 100.000</strong>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">Pembayaran daftar ulang awal: Rp 1.000.000</p>
                </div>
              </div>
            </div>

            {/* Tabel Simulasi Estimasi Pendapatan SD IT */}
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <div className="bg-[#064E3B] text-white px-4 py-2.5 flex items-center justify-between text-xs">
                <span className="font-bold flex items-center gap-1.5">
                  <Calculator className="w-3.5 h-3.5 text-amber-300" />
                  Simulasi Estimasi Perolehan Komisi SD IT Al-Afiyah (Rp 150.000 / Murid)
                </span>
                <span className="text-[10px] text-emerald-200 font-medium">Kuota Terbatas: 2 Rombel</span>
              </div>
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">Jumlah Rekomendasi Murid</th>
                    <th className="p-2.5">Rincian Perhitungan</th>
                    <th className="p-2.5">Total Komisi Diterima</th>
                    <th className="p-2.5">Contoh Manfaat Nyata</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-700">
                  <tr>
                    <td className="p-2.5 font-bold text-slate-900">1 Murid Baru</td>
                    <td className="p-2.5 font-mono text-[11px]">Rp 50.000 + Rp 100.000</td>
                    <td className="p-2.5 font-bold text-emerald-700">Rp 150.000</td>
                    <td className="p-2.5 text-slate-600">Hak komisi langsung terkunci di sistem</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-slate-900">3 Murid Baru</td>
                    <td className="p-2.5 font-mono text-[11px]">3 × Rp 150.000</td>
                    <td className="p-2.5 font-bold text-emerald-700">Rp 450.000</td>
                    <td className="p-2.5 text-slate-600">Dapat membantu keperluan buku paket / seragam</td>
                  </tr>
                  <tr className="bg-emerald-50/40">
                    <td className="p-2.5 font-bold text-slate-900">5 Murid Baru</td>
                    <td className="p-2.5 font-mono text-[11px]">5 × Rp 150.000</td>
                    <td className="p-2.5 font-bold text-emerald-700">Rp 750.000</td>
                    <td className="p-2.5 text-slate-600">Meringankan iuran SPP bulanan ananda</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-slate-900">10 Murid Baru</td>
                    <td className="p-2.5 font-mono text-[11px]">10 × Rp 150.000</td>
                    <td className="p-2.5 font-bold text-emerald-700">Rp 1.500.000</td>
                    <td className="p-2.5 text-slate-600">Bagi hasil syiar berkah cair ke rekening mitra</td>
                  </tr>
                  <tr className="bg-amber-50/40">
                    <td className="p-2.5 font-bold text-slate-900">20 Murid (1 Rombel)</td>
                    <td className="p-2.5 font-mono text-[11px]">20 × Rp 150.000</td>
                    <td className="p-2.5 font-bold text-amber-700">Rp 3.000.000</td>
                    <td className="p-2.5 text-slate-600">Insentif syiar dakwah yang sangat signifikan</td>
                  </tr>
                  <tr className="bg-emerald-100/50">
                    <td className="p-2.5 font-bold text-emerald-950">40 Murid (2 Rombel Penuh)</td>
                    <td className="p-2.5 font-mono text-[11px]">40 × Rp 150.000</td>
                    <td className="p-2.5 font-black text-emerald-900">Rp 6.000.000</td>
                    <td className="p-2.5 font-bold text-emerald-900">Kuota maksimal SD IT Al-Afiyah terpenuhi 100%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Skema Pilihan Pencairan */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-[#064E3B] block mb-1">1. Transfer Rekening Bank Tunai</span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Ditransfer langsung ke rekening bank mitra (BSI, Mandiri, BRI, dll) setiap tanggal 5 awal bulan oleh Bagian Keuangan Yayasan.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-[#064E3B] block mb-1">2. Pemotong SPP Bulanan Murid</span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Khusus mitra dari kalangan wali murid aktif, komisi dapat langsung dialihkan sebagai pemotong SPP bulanan ananda sehingga meringankan biaya pendidikan.
                </p>
              </div>
            </div>
          </div>

          {/* KOTAK KETENTUAN SYAR'I */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <h4 className="text-xs font-bold text-[#064E3B] uppercase tracking-wider">
              Prinsip Syar&apos;i Kemitraan Dakwah Al-Afiyah:
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Program ini bukan Multi-Level Marketing (MLM) dan tanpa skema piramida. Ini adalah akad murni <em>Ju&apos;alah / Ujrah</em> atas jasa merekomendasikan kebaikan pendidikan Islam. 100% bebas biaya pendaftaran, transparan, dan bertujuan utama mempercepat terpenuhinya kuota eksklusif SD IT Al-Afiyah (<strong>Hanya 2 Rombel</strong>) dengan murid yang satu visi akhlak nabawiyah.
            </p>
          </div>

        </div>

        {/* Footer Dokumen */}
        <div className="p-6 border-t border-slate-200 text-center bg-slate-50/80 text-[11px] text-slate-500 space-y-1.5">
          <p className="font-semibold text-slate-700">
            Sistem Informasi Ekosistem Terpadu Al-Afiyah • Yayasan Pendidikan Imam Bonjol Majalengka
          </p>
          <p className="text-slate-600">
            Arsitektur &amp; Pengembangan Sistem (Developer): <strong className="text-emerald-800 font-bold">Mulia / Kareem Al Biruny</strong>
          </p>
          <p className="text-[10px] text-slate-400">
            Dokumen resmi ini dapat langsung dicetak (Ctrl + P) atau disimpan ke format PDF untuk dibagikan ke peserta rapat.
          </p>
        </div>

      </div>
    </div>
  );
}
