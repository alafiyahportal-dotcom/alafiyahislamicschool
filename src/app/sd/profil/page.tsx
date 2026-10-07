import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyMobileBar from '@/components/layout/StickyMobileBar';
import Link from 'next/link';
import { 
  Building2, 
  Target, 
  Award, 
  CheckCircle2, 
  BookOpen, 
  ShieldCheck, 
  Compass, 
  ArrowLeft, 
  ChevronRight, 
  Sparkles, 
  GraduationCap, 
  HeartHandshake, 
  Trees, 
  MapPin, 
  Phone, 
  Clock, 
  ArrowRight,
  Camera,
  Users
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Profil Lengkap SD IT',
  description: 'Profil resmi Sekolah Dasar Islam Terpadu (SD IT) Al-Afiyah Majalengka. Visi, misi, sejarah kampus Giri Asih, kurikulum Smart Akhlaq Fitrah, dan legalitas resmi BAN-SM.',
  icons: {
    icon: [
      { url: '/images/sd-logo.png', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/images/sd-logo.png',
    apple: '/images/sd-logo.png',
  },
};

export const dynamic = 'force-dynamic';

export default function SdProfilPage() {
  const identitasList = [
    { label: 'Nama Sekolah', value: 'SD IT Al-Afiyah Majalengka' },
    { label: 'Status Sekolah', value: 'Swasta Terakreditasi BAN-SM (Predikat A)' },
    { label: 'Jenjang Pendidikan', value: 'Sekolah Dasar Islam Terpadu (Kelas 1 - 6)' },
    { label: 'Pilar Pendidikan', value: 'Smart Akhlaq Fitrah • Karakter Nabawiyah' },
    { label: 'Target Tahfidz', value: 'Juz 30 Mutqin & Fashihah Makharijul Huruf' },
    { label: 'Alamat Kampus', value: 'Lingkungan Giri Asih - Jl. Gerakan Koperasi, Majalengka Wetan 45411' },
    { label: 'Lembaga Penyelenggara', value: 'Yayasan Pendidikan Imam Bonjol Majalengka' },
    { label: 'Kontak Tata Usaha', value: '+62 813-1013-9001 (WhatsApp Resmi)' },
  ];

  const misiList = [
    'Menyelenggarakan pendidikan Islam holistik berlandaskan Al-Qur\'an dan As-Sunnah sesuai pemahaman yang lurus.',
    'Menanamkan adab sebelum ilmu dan iman sebelum Al-Qur\'an melalui pembiasaan ibadah praktis harian.',
    'Membimbing bimbingan tahsin tartil dan hafalan Al-Qur\'an Juz 30 mutqin dengan metode yang ramah anak dan menyenangkan.',
    'Mengembangkan kecerdasan literasi dasar, numerasi kontekstual, dan logika sains modern sejak dini.',
    'Melaksanakan outdoor learning terintegrasi di greenhouse dan budidaya perikanan P4S An-Nabawiyah.',
    'Membina kemandirian murid dalam menyambut fase aqil-baligh serta mengasah potensi bakat minat peserta didik.'
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar schoolSlug="sd" />
      <main className="flex-1">
        {/* Hero Banner */}
        <section className="bg-gradient-to-br from-[#064e3b] via-[#047857] to-[#00A651] text-white pt-24 sm:pt-28 pb-14 sm:pb-18 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:20px_20px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Breadcrumb & Back */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <Link
                href="/sd"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-emerald-50 hover:text-white transition-all active:scale-95"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Beranda SD IT</span>
              </Link>

              <nav className="flex items-center gap-1.5 text-xs text-emerald-200" aria-label="Breadcrumb">
                <Link href="/sd" className="hover:text-white transition-colors">
                  SD IT
                </Link>
                <ChevronRight className="w-3 h-3 text-emerald-300/60" />
                <span className="text-white font-medium">Profil Sekolah</span>
              </nav>
            </div>

            <div className="max-w-3xl">
              <p className="font-arabic text-xl sm:text-2xl text-amber-300 mb-2 tracking-wide drop-shadow-sm">
                المَدْرَسَةُ الابْتِدَائِيَّةُ الإِسْلَامِيَّةُ العَافِيَة
              </p>

              <span className="text-xs font-bold text-emerald-200 uppercase tracking-widest bg-emerald-900/60 border border-emerald-400/30 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5 mb-3.5 shadow-xs">
                <Building2 className="w-3.5 h-3.5 text-emerald-300" />
                <span>PROFIL SATUAN PENDIDIKAN</span>
              </span>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Sekolah Dasar Islam Terpadu (SD IT) Al-Afiyah
              </h1>

              <p className="mt-3.5 text-xs sm:text-sm lg:text-base text-emerald-100/90 leading-relaxed font-normal">
                Bukan sekadar tempat belajar, namun juga tempat bertumbuh. Mencetak generasi sholeh, cerdas, mandiri, berwawasan, dan berakhlakul islami dengan metode Pendidikan Karakter Nabawiyah.
              </p>
            </div>
          </div>
        </section>

        {/* 4 Quick Stat Highlights */}
        <section className="py-8 bg-white border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-center">
                <span className="text-xl sm:text-2xl font-extrabold text-emerald-900 block">Akreditasi A</span>
                <span className="text-xs text-emerald-700 font-medium">BAN-SM Terakreditasi Unggul</span>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-center">
                <span className="text-xl sm:text-2xl font-extrabold text-emerald-900 block">2 Rombel</span>
                <span className="text-xs text-emerald-700 font-medium">Kuota Terbatas SPMB 2027</span>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-center">
                <span className="text-xl sm:text-2xl font-extrabold text-emerald-900 block">Juz 30 Mutqin</span>
                <span className="text-xs text-emerald-700 font-medium">Target Capaian Tahfidz</span>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-center">
                <span className="text-xl sm:text-2xl font-extrabold text-emerald-900 block">Giri Asih</span>
                <span className="text-xs text-emerald-700 font-medium">Kampus Asri &amp; Ramah Anak</span>
              </div>
            </div>
          </div>
        </section>

        {/* Visi & Misi */}
        <section className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
              {/* Visi Card */}
              <div className="p-7 sm:p-9 rounded-3xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <Target className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest block">
                        Arah &amp; Cita-Cita
                      </span>
                      <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                        Visi SD IT Al-Afiyah
                      </h2>
                    </div>
                  </div>

                  <blockquote className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-emerald-950 font-bold text-base sm:text-lg leading-relaxed">
                    &ldquo;Mencetak Generasi Sholeh, Cerdas, Mandiri, Berwawasan Luas, dan Berakhlakul Islami dengan Metode Pendidikan Karakter Nabawiyah.&rdquo;
                  </blockquote>

                  <p className="mt-5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Visi ini menegaskan komitmen SD IT Al-Afiyah dalam membangun keseimbangan antara keteguhan iman, keindahan adab pergaulan, kecakapan nalar berpikir, serta kesehatan fisik jasmani murid.
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-emerald-700">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Pilar Smart Akhlaq Fitrah</span>
                </div>
              </div>

              {/* Misi Card */}
              <div className="p-7 sm:p-9 rounded-3xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
                      <Compass className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-amber-700 uppercase tracking-widest block">
                        Langkah Strategis
                      </span>
                      <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                        Misi Pendidikan Sekolah
                      </h2>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {misiList.map((misi, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-xs sm:text-[13px] text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{misi}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-amber-800">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>Komitmen Penyelenggaraan Holistik</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tabel Identitas Sekolah & Lingkungan Belajar */}
        <section className="py-12 sm:py-16 bg-white border-t border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Data Satuan Pendidikan
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2.5">
                Identitas Resmi SD IT Al-Afiyah
              </h2>
            </div>

            <div className="max-w-3xl mx-auto rounded-2xl border border-slate-200 overflow-hidden shadow-2xs bg-white">
              <dl className="divide-y divide-slate-100">
                {identitasList.map((item, idx) => (
                  <div key={idx} className="px-5 py-3.5 sm:grid sm:grid-cols-3 sm:gap-4 hover:bg-slate-50/80 transition-colors">
                    <dt className="text-xs font-bold text-slate-500">{item.label}</dt>
                    <dd className="mt-1 text-xs sm:text-sm font-semibold text-slate-900 sm:col-span-2 sm:mt-0">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* Quick Links ke Fitur Khusus SD IT */}
        <section className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Jelajahi Lebih Dekat SD IT Al-Afiyah
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Buka seluruh fitur dan halaman khusus tanpa tercampur dengan unit lain.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <Link
                href="/sd/program"
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all group flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    10 Program Unggulan
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Karakter nabawiyah, adab sebelum ilmu, dan calistung kontekstual.
                  </p>
                </div>
              </Link>

              <Link
                href="/sd/karakter"
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all group flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    Pilar Karakter &amp; Nilai
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    3 Pilar Utama dan 7 profil karakter murid Al-Afiyah.
                  </p>
                </div>
              </Link>

              <Link
                href="/sd/dokumentasi"
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all group flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    Dokumentasi &amp; Belajar
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Potret shalat, da&apos;i cilik, kelas terpadu, dan field study P4S.
                  </p>
                </div>
              </Link>

              <Link
                href="/sd/guru"
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all group flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    Dewan Guru &amp; Asatidzah
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Profil pengajar tahfidz hafizhah 30 juz dan guru kelas berdedikasi.
                  </p>
                </div>
              </Link>

              <Link
                href="/sd/testimoni"
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all group flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    Testimoni Wali Murid
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Ulasan tulus para orang tua murid SD IT Al-Afiyah.
                  </p>
                </div>
              </Link>

              <Link
                href="/sd/kontak"
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all group flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    Layanan Tata Usaha &amp; Lokasi
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    WhatsApp hotline dan lokasi kampus Giri Asih Majalengka Wetan.
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Bottom CTA to SPMB */}
        <section className="bg-gradient-to-r from-emerald-900 to-[#064e3b] text-white py-12 sm:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Penerimaan Murid Baru SD IT Al-Afiyah T.A. 2027/2028
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-emerald-100 max-w-xl mx-auto leading-relaxed">
              Kuota dibatasi hanya 2 Rombel untuk menjaga kualitas pendampingan karakter. Pendaftaran resmi dibuka secara online.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/sd/spmb/daftar"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#00A651] hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
              >
                <span>Daftar SPMB Online</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/sd/spmb"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-xs sm:text-sm transition-all"
              >
                <span>Alur &amp; Syarat SPMB</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer schoolSlug="sd" />
      <StickyMobileBar schoolSlug="sd" />
    </div>
  );
}
