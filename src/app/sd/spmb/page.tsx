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
  ArrowLeft
} from 'lucide-react';
import ScrollReveal from '@/components/landing/ScrollReveal';

export const metadata: Metadata = {
  title: 'Informasi & Alur SPMB SD IT Al-Afiyah Majalengka TA 2027/2028',
  description: 'Panduan lengkap penerimaan murid baru SD IT Al-Afiyah. Syarat usia, alur pendaftaran, observasi, kuota rombel dan rincian biaya.',
};

export default function SdSpmbInfoPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-[#00A651]/20 selection:text-[#00A651]">
      <Navbar schoolSlug="sd" />

      {/* Hero Header Khusus SD IT */}
      <section className="bg-gradient-to-br from-[#064e3b] via-[#047857] to-[#00A651] text-white pt-24 sm:pt-28 pb-14 sm:pb-18 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:20px_20px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-emerald-200/90 mb-5" aria-label="Breadcrumb">
            <Link href="/sd" className="hover:text-white transition-colors inline-flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Beranda SD IT</span>
            </Link>
            <ChevronRight className="w-3 h-3 text-emerald-300/50" />
            <span className="text-white font-medium">Informasi SPMB</span>
          </nav>

          <div className="max-w-3xl">
            <div className="text-xs font-bold text-amber-300 uppercase tracking-widest inline-flex items-center gap-1.5 mb-3">
              <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
              <span>SPMB TAHUN AJARAN 2027/2028</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Penerimaan Murid Baru (SPMB) <br className="hidden sm:inline" />
              SD IT Al-Afiyah Majalengka
            </h1>

            <p className="mt-3.5 text-xs sm:text-sm lg:text-base text-emerald-100/90 leading-relaxed font-normal">
              Membuka pendaftaran Gelombang 1 Tahun Ajaran 2027/2028. Kuota terbatas hanya 2 rombongan belajar (maksimal 60 murid) demi menjaga intensitas pembinaan adab nabawi, tahfidz mutqin, dan sains terpadu.
            </p>

            {/* Quick Stat Badges */}
            <div className="mt-6 flex flex-wrap items-center gap-2.5 sm:gap-3">
              <div className="px-3.5 py-2 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 text-xs font-semibold text-white shadow-xs flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-300" />
                <span>Kuota: <strong>60 Murid (2 Rombel)</strong></span>
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 text-xs font-semibold text-white shadow-xs flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-300" />
                <span>Usia Minimal: <strong>6 Th (per 1 Juli 2027)</strong></span>
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 text-xs font-semibold text-white shadow-xs flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-amber-300" />
                <span>Infaq Pendaftaran: <strong>Rp 250.000</strong></span>
              </div>
            </div>

            {/* Call to Actions */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/sd/spmb/daftar"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-400/20 active:scale-95 transition-all"
              >
                <span>Isi Formulir SPMB Online</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </Link>

              <Link
                href="/sd/spmb/cek-status"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-white font-semibold text-xs sm:text-sm transition-all active:scale-95"
              >
                <span>Lacak Status Pendaftaran</span>
              </Link>

              <Link
                href="/sd/spmb/pengumuman"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-white font-semibold text-xs sm:text-sm transition-all active:scale-95"
              >
                <span>Pengumuman Kelulusan</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Alur Pendaftaran 4 Langkah */}
      <section className="py-14 sm:py-20 max-w-5xl mx-auto px-4 sm:px-6 w-full">
        <ScrollReveal yOffset={24} duration={500}>
          <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#00A651] bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            Tahapan Pendaftaran
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
            4 Langkah Mudah Menjadi Murid SD IT Al-Afiyah
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Proses terintegrasi secara digital, transparan, dan memudahkan orang tua calon murid.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs hover:border-emerald-500/40 hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/80 flex items-center justify-center font-bold text-xs font-mono">
                  01
                </span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                  Langkah 1
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-[#00A651] transition-colors">
                Pendaftaran Online
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed font-normal">
                Mengisi formulir biodata calon murid dan data orang tua/wali melalui portal SPMB SD IT. Dapatkan ID registrasi pendaftaran resmi.
              </p>
            </div>
            <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-emerald-800">
              <span>Waktu: 5-10 Menit</span>
              <span>✦</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs hover:border-emerald-500/40 hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/80 flex items-center justify-center font-bold text-xs font-mono">
                  02
                </span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                  Langkah 2
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-[#00A651] transition-colors">
                Infaq & Berkas
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed font-normal">
                Menyelesaikan infaq pendaftaran Rp 250.000 ke rekening resmi yayasan dan mengunggah scan Kartu Keluarga serta Akta Kelahiran.
              </p>
            </div>
            <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-emerald-800">
              <span>Verifikasi Otomatis</span>
              <span>✦</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs hover:border-emerald-500/40 hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/80 flex items-center justify-center font-bold text-xs font-mono">
                  03
                </span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                  Langkah 3
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-[#00A651] transition-colors">
                Observasi & Wawancara
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed font-normal">
                Calon murid mengikuti observasi kematangan sensorik, motorik & pengenalan huruf. Orang tua mengikuti sesi wawancara keselarasan visi pendidikan.
              </p>
            </div>
            <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-emerald-800">
              <span>Ramah Anak & Nyaman</span>
              <span>✦</span>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs hover:border-emerald-500/40 hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/80 flex items-center justify-center font-bold text-xs font-mono">
                  04
                </span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                  Langkah 4
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-[#00A651] transition-colors">
                Kelulusan & Seragam
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed font-normal">
                Pengumuman hasil kelulusan melalui Papan Pengumuman resmi, dilanjutkan daftar ulang, pengukuran seragam syar&apos;i, dan penyambutan murid baru.
              </p>
            </div>
            <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-emerald-800">
              <span>Fitting & Siap Belajar</span>
              <span>✦</span>
            </div>
          </div>
        </div>
        </ScrollReveal>
      </section>

      {/* Syarat & Ketentuan SPMB SD IT */}
      <section className="py-12 bg-white border-y border-slate-200">
        <ScrollReveal yOffset={24} duration={500}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#00A651] bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                  Persyaratan Calon Murid
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
                      <p className="text-xs text-slate-600 mt-0.5">Scan/Fotokopi Akta Kelahiran, Kartu Keluarga (KK), KTP kedua orang tua, serta pas foto terbaru murid.</p>
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
                    Fasilitas & Lingkungan SD IT
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold mt-4">
                    Lingkungan Giri Asih Majalengka
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
                      <span className="text-lg font-extrabold text-white">28-30 Murid/Kelas</span>
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
        </ScrollReveal>
      </section>

      {/* Pusat Bantuan WhatsApp */}
      <section className="py-12 max-w-5xl mx-auto px-4 sm:px-6 w-full">
        <ScrollReveal yOffset={20} duration={500}>
          <div className="p-6 sm:p-8 rounded-3xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-left">
              <span className="text-xs font-bold text-[#00A651] uppercase tracking-wider">
                Layanan Konsultasi Offline & Online
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                Ingin bertanya langsung ke Panitia SPMB SD IT?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-lg">
                Kunjungi sekretariat kami di Lingkungan Giri Asih atau hubungi WhatsApp resmi Panitia SD IT di 0813-1013-9001.
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
        </ScrollReveal>
      </section>

      <Footer schoolSlug="sd" />
      <StickyMobileBar schoolSlug="sd" />
    </div>
  );
}
