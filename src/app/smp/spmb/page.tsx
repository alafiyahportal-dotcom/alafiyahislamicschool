import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyMobileBar from '@/components/layout/StickyMobileBar';
import { 
  CheckCircle2, 
  ArrowRight, 
  Calendar, 
  Users, 
  FileText, 
  HelpCircle, 
  GraduationCap, 
  MessageCircle, 
  Clock, 
  ShieldCheck, 
  BookOpen, 
  Award,
  ChevronRight,
  CreditCard,
  HeartHandshake,
  ArrowLeft,
  Percent,
  Sparkles,
  Download
} from 'lucide-react';
import { prisma } from '@/lib/prisma';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'SPMB SMP IT Al-Afiyah Majalengka TA 2027/2028 | Be Smart & Religious',
  description: 'Penerimaan Murid Baru (SPMB) SMP IT Al-Afiyah Majalengka Tahun Ajaran 2027/2028. Terakreditasi A BAN-S/M. Gelombang 1 diskon 70% uang bangunan (SDIT) dan 50% (umum). Bimbingan tahfidz 3-5+ juz mutqin dan bahasa Arab aktif.',
  icons: {
    icon: [
      { url: '/images/smp-logo.png', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/images/smp-logo.png',
    apple: '/images/smp-logo.png',
  },
  openGraph: {
    title: 'SPMB SMP IT Al-Afiyah Majalengka TA 2027/2028',
    description: 'Gelombang 1 dibuka! Diskon uang bangunan s.d 70%. Bimbingan tahfidz 3-5+ juz & futsal development program.',
    images: ['/images/smp-spmb-poster.png'],
  },
};

const BIAYA_ITEMS = [
  { item: 'Pendaftaran & Observasi', ikhwan: 200000, akhwat: 200000, note: 'Sekali di awal' },
  { item: 'Uang Bangunan (Gedung)', ikhwan: 2500000, akhwat: 2500000, note: 'Diskon 70% SDIT / 50% Umum di Gel 1' },
  { item: 'Fasilitas Pembelajaran (AC & Lab)', ikhwan: 500000, akhwat: 500000, note: 'Sarana kelas & IT' },
  { item: 'Paket Seragam Lengkap', ikhwan: 1100000, akhwat: 1400000, note: '4 stel + atribut sekolah' },
  { item: 'Paket Buku Pelajaran & Diniyyah', ikhwan: 1000000, akhwat: 1000000, note: 'Paket buku teks 1 tahun' },
  { item: 'Kegiatan Siswa 1 Tahun', ikhwan: 1700000, akhwat: 1700000, note: 'Rihlah, mabit, PHBI, outing' },
  { item: 'SPP Bulan Pertama (Juli)', ikhwan: 300000, akhwat: 300000, note: 'Termasuk mutaba\'ah digital' },
];

export default async function SmpSpmbInfoPage() {
  const regFeeText = 'Rp 200.000';
  const waNumber = '0822-4935-7893';
  const waClean = '6282249357893';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-[#ffd51e] selection:text-[#030164]">
      <Navbar schoolSlug="smp" />

      {/* Hero Header */}
      <section className="bg-gradient-to-br from-[#030164] via-[#090580] to-[#01003d] text-white pt-24 sm:pt-28 pb-16 sm:pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffd51e_1.5px,transparent_1.5px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#ffd51e]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <nav className="flex items-center gap-1.5 text-xs text-blue-200/90 mb-5" aria-label="Breadcrumb">
            <Link href="/smp" className="hover:text-white transition-colors inline-flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Beranda SMP IT</span>
            </Link>
            <ChevronRight className="w-3 h-3 text-blue-300/50" />
            <span className="text-[#ffd51e] font-semibold">Penerimaan Murid Baru (SPMB)</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-[#ffd51e]/40 text-[#ffd51e] text-xs font-bold tracking-wider uppercase mb-4 backdrop-blur-xs">
              <Award className="w-3.5 h-3.5" />
              <span>TERAKREDITASI A • TAHUN AJARAN 2027/2028</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              SPMB SMP IT Al-Afiyah
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-200 leading-relaxed font-normal">
              Selamat datang calon santri dan orang tua murid. SMP IT Al-Afiyah Majalengka membuka pendaftaran murid baru Tahun Ajaran 2027/2028. Manfaatkan promo diskon uang bangunan hingga 70% di Gelombang 1.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/smp/spmb/daftar"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#ffd51e] text-[#030164] font-bold text-xs uppercase tracking-wider hover:bg-yellow-400 transition-all shadow-md active:scale-95"
              >
                <span>Isi Formulir Online</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/smp/spmb/cek-status"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium text-xs uppercase tracking-wider transition-all"
              >
                <span>Cek Status Berkas</span>
              </Link>
              <Link
                href="/smp/spmb/pengumuman"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium text-xs uppercase tracking-wider transition-all"
              >
                <span>Pengumuman Kelulusan</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
        
        {/* Gelombang 1 & 2 Cards */}
        <section className="space-y-6">
          <div>
            <span className="text-xs font-bold text-[#030164] uppercase tracking-widest">
              Linimasa Pendaftaran
            </span>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              Jadwal Gelombang SPMB 2027/2028
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Gelombang 1 Card */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-[#030164] to-[#0c0879] text-white shadow-xl relative overflow-hidden border border-[#ffd51e]/40">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#ffd51e]/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between gap-3 mb-4">
                <span className="text-[11px] font-extrabold uppercase tracking-wider px-3.5 py-1 rounded-full bg-[#ffd51e] text-[#030164] shadow-xs">
                  Sedang Berlangsung
                </span>
                <span className="text-xs text-blue-200">Kuota Terbatas</span>
              </div>

              <h4 className="text-2xl font-extrabold text-white">
                Gelombang 1 (Promo Diskon)
              </h4>
              <p className="text-xs font-semibold text-[#ffd51e] mt-1 mb-4">
                1 Oktober 2026 – 28 Februari 2027
              </p>

              <div className="space-y-3 pt-4 border-t border-white/15">
                <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 flex items-start gap-3">
                  <Percent className="w-5 h-5 text-[#ffd51e] shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-white uppercase">
                      Diskon 70% Uang Bangunan
                    </h5>
                    <p className="text-[11px] text-blue-200 mt-0.5">
                      Khusus untuk siswa/lulusan <strong>SDIT Al-Afiyah</strong> (Hemat Rp 1.750.000, Uang Bangunan menjadi <strong>Rp 750.000</strong>).
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 flex items-start gap-3">
                  <Percent className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-white uppercase">
                      Diskon 50% Uang Bangunan
                    </h5>
                    <p className="text-[11px] text-blue-200 mt-0.5">
                      Untuk siswa dari <strong>luar SDIT Al-Afiyah / Umum</strong> (Hemat Rp 1.250.000, Uang Bangunan menjadi <strong>Rp 1.250.000</strong>).
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/15 flex items-center justify-between">
                <span className="text-xs text-blue-200">Biaya Formulir: <strong>Rp 200.000</strong></span>
                <Link
                  href="/smp/spmb/daftar"
                  className="px-4 py-2 rounded-xl bg-[#ffd51e] text-[#030164] font-bold text-xs uppercase tracking-wider hover:bg-yellow-400 transition-all shadow-xs"
                >
                  Daftar Gelombang 1
                </Link>
              </div>
            </div>

            {/* Gelombang 2 Card */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                    Akan Datang
                  </span>
                  <span className="text-xs text-slate-400">Tarif Normal</span>
                </div>

                <h4 className="text-2xl font-bold text-slate-900">
                  Gelombang 2 (Reguler)
                </h4>
                <p className="text-xs font-semibold text-slate-500 mt-1 mb-4">
                  1 Maret 2027 – 30 Juni 2027
                </p>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  Pendaftaran gelombang reguler dibuka apabila kuota santri baru belum terpenuhi. Pada Gelombang 2 berlaku tarif normal (tanpa potongan diskon uang bangunan).
                </p>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-1.5">
                  <div className="flex justify-between">
                    <span>Uang Bangunan Normal:</span>
                    <strong className="text-slate-900">Rp 2.500.000</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Biaya Formulir:</span>
                    <strong className="text-slate-900">Rp 200.000</strong>
                  </div>
                  <div className="flex justify-between text-slate-500 text-[11px] pt-1 border-t border-slate-200">
                    <span>Status Potongan:</span>
                    <span>No Diskon (Tarif Standar)</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">Pendaftaran dibuka 1 Maret 2027</span>
                <span className="text-xs font-bold text-slate-400">Siap Daring</span>
              </div>
            </div>
          </div>
        </section>

        {/* Tabel Rincian Biaya Pendidikan Resmi */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-[#030164] uppercase tracking-widest">
                Transparansi Biaya
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                Rincian Biaya Pendidikan SPMB SMP IT
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Tahun Ajaran 2027/2028 • Termasuk seragam, buku paket, kegiatan tahunan &amp; SPP Juli.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="/images/smp-spmb-biaya.png"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-50 text-[#030164] hover:bg-blue-100 text-xs font-bold border border-blue-200"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Brosur Biaya</span>
              </a>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                  <th className="py-3 px-4">No</th>
                  <th className="py-3 px-4">Komponen Biaya</th>
                  <th className="py-3 px-4 text-right">Ikhwan (Putra)</th>
                  <th className="py-3 px-4 text-right">Akhwat (Putri)</th>
                  <th className="py-3 px-4">Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {BIAYA_ITEMS.map((b, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{b.item}</td>
                    <td className="py-3 px-4 text-right font-medium">Rp {b.ikhwan.toLocaleString('id-ID')}</td>
                    <td className="py-3 px-4 text-right font-medium">Rp {b.akhwat.toLocaleString('id-ID')}</td>
                    <td className="py-3 px-4 text-slate-500 text-xs">{b.note}</td>
                  </tr>
                ))}
                
                {/* Total Baris Normal */}
                <tr className="bg-blue-50/60 font-bold text-[#030164] border-t-2 border-slate-300">
                  <td className="py-3.5 px-4" colSpan={2}>Total Tarif Normal (Gelombang 2)</td>
                  <td className="py-3.5 px-4 text-right text-base font-extrabold">Rp 7.300.000</td>
                  <td className="py-3.5 px-4 text-right text-base font-extrabold">Rp 7.600.000</td>
                  <td className="py-3.5 px-4 text-xs font-normal text-slate-600">Tarif Standar</td>
                </tr>

                {/* Total Baris Gelombang 1 Diskon Umum (50%) */}
                <tr className="bg-amber-50/50 font-bold text-amber-900">
                  <td className="py-3.5 px-4" colSpan={2}>Total Gelombang 1 (Siswa Umum / Luar SDIT - Diskon 50%)</td>
                  <td className="py-3.5 px-4 text-right text-base font-extrabold text-amber-900">Rp 6.050.000</td>
                  <td className="py-3.5 px-4 text-right text-base font-extrabold text-amber-900">Rp 6.350.000</td>
                  <td className="py-3.5 px-4 text-xs font-semibold text-amber-700">Hemat Rp 1.250.000</td>
                </tr>

                {/* Total Baris Gelombang 1 Diskon SDIT (70%) */}
                <tr className="bg-[#030164] font-bold text-white">
                  <td className="py-4 px-4" colSpan={2}>
                    <span className="text-[#ffd51e] font-extrabold uppercase tracking-wide">
                      ★ Total Gelombang 1 (Khusus Alumni SDIT Al-Afiyah - Diskon 70%)
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right text-lg font-extrabold text-[#ffd51e]">Rp 5.550.000</td>
                  <td className="py-4 px-4 text-right text-lg font-extrabold text-[#ffd51e]">Rp 5.850.000</td>
                  <td className="py-4 px-4 text-xs font-semibold text-blue-200">Hemat Rp 1.750.000</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Rekening Pembayaran Resmi */}
          <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-[#030164] to-[#0c0879] text-white flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <span className="text-[10px] text-[#ffd51e] font-bold uppercase tracking-widest block">
                Rekening Resmi Bank Muamalat
              </span>
              <h4 className="text-xl font-extrabold text-white">
                Bank Muamalat : 1360012405
              </h4>
              <p className="text-xs text-blue-200">
                Atas Nama: <strong className="text-white">SMP IT Al Afiyah</strong> • Harap simpan bukti transfer untuk konfirmasi berkas.
              </p>
            </div>

            <div className="flex gap-3">
              <Link
                href="/smp/spmb/daftar"
                className="px-6 py-3 rounded-xl bg-[#ffd51e] text-[#030164] font-bold text-xs uppercase tracking-wider hover:bg-yellow-400 transition-all shadow-md active:scale-95"
              >
                Daftar Online Sekarang
              </Link>
            </div>
          </div>
        </section>

        {/* Syarat Pendaftaran & Alur Seleksi */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#030164]" />
              <h4 className="text-lg font-bold text-slate-900">
                Persyaratan Berkas Calon Santri
              </h4>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-600 pt-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#030164] shrink-0 mt-0.5" />
                <span>Mengisi formulir pendaftaran online di website ini.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#030164] shrink-0 mt-0.5" />
                <span>Membayar infaq pendaftaran &amp; observasi sebesar Rp 200.000 ke Bank Muamalat.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#030164] shrink-0 mt-0.5" />
                <span>Fotokopi Akta Kelahiran dan Kartu Keluarga (KK) 2 lembar.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#030164] shrink-0 mt-0.5" />
                <span>Fotokopi Ijazah SD/MI atau Surat Keterangan Lulus (SKL) saat daftar ulang.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#030164] shrink-0 mt-0.5" />
                <span>Pas foto berwarna ukuran 3x4 sebanyak 4 lembar.</span>
              </li>
            </ul>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[#030164]" />
              <h4 className="text-lg font-bold text-slate-900">
                Alur Seleksi &amp; Observasi Santri
              </h4>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-600 pt-2">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-[#030164] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                <span><strong>Pendaftaran Daring:</strong> Isi biodata dan dapatkan nomor registrasi calon santri.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-[#030164] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                <span><strong>Observasi &amp; Pemetaan:</strong> Tes membaca Al-Qur'an (tahsin), nalar dasar, dan wawancara orang tua.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-[#030164] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                <span><strong>Pengumuman Kelulusan:</strong> Cek SK kelulusan santri di website atau via WhatsApp.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-[#030164] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">4</span>
                <span><strong>Daftar Ulang &amp; Fitting:</strong> Pelunasan biaya administrasi dan pengukuran seragam sekolah.</span>
              </li>
            </ul>
          </div>
        </section>

      </main>

      <Footer schoolSlug="smp" />
      <StickyMobileBar schoolSlug="smp" />
    </div>
  );
}
