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
  Sparkles, 
  MessageCircle, 
  Clock, 
  ShieldCheck, 
  BookOpen, 
  Award,
  ChevronRight,
  CreditCard,
  HeartHandshake
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Informasi & Alur SPMB SD IT Al-Afiyah Majalengka TA 2027/2028',
  description: 'Panduan lengkap penerimaan santri baru SD IT Al-Afiyah. Syarat usia, alur pendaftaran, observasi, kuota rombel dan rincian biaya.',
};

export default function SdSpmbInfoPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-[#00A651]/20 selection:text-[#00A651]">
      <Navbar schoolSlug="sd" />

      {/* Hero Section */}
      <section className="relative pt-24 pb-14 bg-gradient-to-b from-[#00A651]/12 via-emerald-50/50 to-slate-50 border-b border-emerald-100 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(#00A651_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          {/* Breadcrumb */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 border border-emerald-200 shadow-xs mb-4 text-xs font-semibold text-emerald-800">
            <Link href="/sd" className="hover:underline">SD IT Al-Afiyah</Link>
            <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-950 font-bold">Informasi & Alur SPMB</span>
          </div>

          <div className="text-xs sm:text-sm font-arabic font-bold text-emerald-700 tracking-wider mb-2">
            مَدْرَسَةُ العَافِيَةِ الإبْتِدَائِيَّةِ الإسْلَامِيَّةِ
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Sistem Penerimaan Murid Baru (SPMB) <br className="hidden sm:inline" />
            <span className="text-[#00A651]">SD IT Al-Afiyah Majalengka</span>
          </h1>

          <p className="mt-3.5 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Membuka pendaftaran Gelombang 1 Tahun Ajaran 2027/2028. Kuota terbatas hanya 2 rombongan belajar (maksimal 60 santri) demi menjaga intensitas pengawasan adab dan tahfidz mutqin.
          </p>

          {/* Quick Stat Badges */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-white border border-emerald-200 text-xs font-semibold text-emerald-900 shadow-xs flex items-center gap-2">
              <Users className="w-4 h-4 text-[#00A651]" />
              <span>Kuota: <strong>60 Murid (2 Rombel)</strong></span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-white border border-emerald-200 text-xs font-semibold text-emerald-900 shadow-xs flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#00A651]" />
              <span>Usia Minimal: <strong>6 Th (per 1 Juli 2027)</strong></span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-white border border-emerald-200 text-xs font-semibold text-emerald-900 shadow-xs flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#00A651]" />
              <span>Infaq Pendaftaran: <strong>Rp 250.000</strong></span>
            </div>
          </div>

          {/* Call to Actions */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/sd/spmb/daftar"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-[#00A651] hover:bg-[#008f45] text-white font-bold text-sm sm:text-base shadow-lg shadow-emerald-600/20 active:scale-95 transition-all"
            >
              <span>Isi Formulir SPMB Online</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/sd/spmb/cek-status"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold text-sm sm:text-base shadow-xs active:scale-95 transition-all"
            >
              <span>Lacak Status Pendaftaran</span>
            </Link>

            <Link
              href="/sd/spmb/pengumuman"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold text-sm sm:text-base shadow-xs active:scale-95 transition-all"
            >
              <span>Pengumuman Kelulusan</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Alur Pendaftaran 4 Langkah */}
      <section className="py-14 sm:py-20 max-w-5xl mx-auto px-4 sm:px-6 w-full">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#00A651] bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            Tahapan Pendaftaran
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
            4 Langkah Mudah Menjadi Santri SD IT Al-Afiyah
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Proses terintegrasi secara digital, transparan, dan memudahkan orang tua calon murid.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Step 1 */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100/70 text-[#00A651] flex items-center justify-center font-extrabold text-lg mb-4">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Pendaftaran Online
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Mengisi formulir biodata calon murid dan data orang tua/wali melalui portal SPMB SD IT. Dapatkan ID registrasi pendaftaran resmi.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-1 rounded">
                Waktu: 5-10 Menit
              </span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100/70 text-[#00A651] flex items-center justify-center font-extrabold text-lg mb-4">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Infaq & Berkas
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Menyelesaikan infaq pendaftaran Rp 250.000 ke rekening resmi yayasan dan mengunggah scan Kartu Keluarga serta Akta Kelahiran.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-1 rounded">
                Verifikasi Otomatis
              </span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100/70 text-[#00A651] flex items-center justify-center font-extrabold text-lg mb-4">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Observasi & Wawancara
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Calon santri mengikuti observasi kematangan sensorik, motorik & pengenalan huruf. Orang tua mengikuti sesi wawancara keselarasan visi pendidikan.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-1 rounded">
                Ramah Anak & Nyaman
              </span>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100/70 text-[#00A651] flex items-center justify-center font-extrabold text-lg mb-4">
                4
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Kelulusan & Seragam
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Pengumuman hasil kelulusan melalui Papan Pengumuman resmi, dilanjutkan daftar ulang, pengukuran seragam syar&apos;i, dan penyambutan santri baru.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-1 rounded">
                Fitting & Siap Belajar
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Syarat & Ketentuan SPMB SD IT */}
      <section className="py-12 bg-white border-y border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#00A651] bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                Persyaratan Calon Santri
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
                Syarat Masuk SD IT Al-Afiyah
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Kami menerapkan kriteria yang memastikan kenyamanan belajar dan kesiapan psikologis anak dalam mengikuti kurikulum terpadu nasional dan kepesantrenan.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <CheckCircle2 className="w-5 h-5 text-[#00A651] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-800">Usia Calon Murid</h4>
                    <p className="text-xs text-slate-600 mt-0.5">Telah berusia 6 tahun per 1 Juli 2027. Anak berusia minimal 5 tahun 8 bulan dapat dipertimbangkan jika memiliki kesiapan belajar yang matang.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <CheckCircle2 className="w-5 h-5 text-[#00A651] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-800">Kelengkapan Administrasi</h4>
                    <p className="text-xs text-slate-600 mt-0.5">Scan/Fotokopi Akta Kelahiran, Kartu Keluarga (KK), KTP kedua orang tua, serta pas foto terbaru santri.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <CheckCircle2 className="w-5 h-5 text-[#00A651] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-800">Komitmen Bersama Orang Tua</h4>
                    <p className="text-xs text-slate-600 mt-0.5">Kesediaan orang tua/wali untuk mendampingi muraja&apos;ah tahfidz di rumah dan mematuhi tata tertib syar&apos;i yayasan.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Kotak Rekapitulasi Rombel & Lokasi */}
            <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 bg-white/10 px-3 py-1 rounded-full">
                  Fasilitas & Kampus SD IT
                </span>
                <h3 className="text-xl sm:text-2xl font-bold mt-4">
                  Kampus Giri Asih Majalengka
                </h3>
                <p className="text-xs text-emerald-100 mt-2 leading-relaxed">
                  Lingkungan Giri Asih - Jl. Gerakan Koperasi, Majalengka Kulon. Gedung milik sendiri dengan suasana asri, masjid representatif, dan sarana bermain edukatif.
                </p>

                <div className="mt-6 pt-6 border-t border-emerald-800/60 grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-400 text-xs block">Kapasitas Maksimal</span>
                    <span className="text-lg font-extrabold text-white">60 Calon Murid</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-xs block">Rasio Kelas</span>
                    <span className="text-lg font-extrabold text-white">28-30 Santri/Kelas</span>
                  </div>
                </div>

                <div className="mt-6 pt-4">
                  <Link
                    href="/sd/spmb/daftar"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-[#00A651] hover:bg-[#008f45] text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
                  >
                    <span>Daftar Sekarang Sebelum Kuota Penuh</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pusat Bantuan WhatsApp */}
      <section className="py-12 max-w-5xl mx-auto px-4 sm:px-6 w-full">
        <div className="p-6 sm:p-8 rounded-3xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-left">
            <span className="text-xs font-bold text-[#00A651] uppercase tracking-wider">
              Layanan Konsultasi Offline & Online
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
              Ingin bertanya langsung ke Panitia SPMB SD IT?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-lg">
              Kunjungi sekretariat kami di Kampus Giri Asih atau hubungi WhatsApp resmi Panitia SD IT di 0813-1013-9001.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            <Link
              href="/sd/kontak"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold text-xs sm:text-sm transition-all"
            >
              <span>Lokasi & Kontak TU</span>
            </Link>
            <a
              href="https://wa.me/6281310139001?text=Assalamu%27alaikum%20Panitia%20SPMB%20SD%20IT%20Al-Afiyah,%20saya%20ingin%20berkonsultasi%20mengenai%20pendaftaran"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#00A651] hover:bg-[#008f45] text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Panitia SD IT</span>
            </a>
          </div>
        </div>
      </section>

      <Footer schoolSlug="sd" />
      <StickyMobileBar schoolSlug="sd" />
    </div>
  );
}
