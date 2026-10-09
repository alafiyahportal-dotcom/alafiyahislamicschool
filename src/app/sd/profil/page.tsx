import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyMobileBar from '@/components/layout/StickyMobileBar';
import Link from 'next/link';
import ScrollReveal from '@/components/landing/ScrollReveal';
import { prisma } from '@/lib/prisma';
import { 
  Building2, 
  Award, 
  CheckCircle2, 
  BookOpen, 
  ShieldCheck, 
  ArrowLeft, 
  ChevronRight, 
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
  description: 'Profil resmi Sekolah Dasar Islam Terpadu (SD IT) Al-Afiyah Majalengka. Visi, misi, sejarah Lingkungan Giri Asih, kurikulum Smart Akhlak Fitrah, dan legalitas resmi BAN-SM.',
  icons: {
    icon: [
      { url: '/images/sd-logo.png', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/images/sd-logo.png',
    apple: '/images/sd-logo.png',
  },
};

export const revalidate = 0;

export default async function SdProfilPage() {
  const defaultIdentitasList = [
    { label: 'Nama Sekolah', value: 'SD IT Al-Afiyah Majalengka' },
    { label: 'Status Akreditasi', value: 'Terakreditasi B (BAN-SM)' },
    { label: 'Yayasan Penyelenggara', value: 'Yayasan Pendidikan Imam Bonjol (YPIB) Majalengka' },
    { label: 'Gugus Sekolah', value: 'Sekolah Imbas dari 7 Sekolah di Gugus 3 Nusa Indah, Kec. Majalengka' },
    { label: 'Kurikulum Pembelajaran', value: 'Perpaduan Kurikulum Diknas (K-13) & Kurikulum Yayasan berpijak pada Iman dan Taqwa' },
    { label: 'Program Unggulan', value: 'Tahsin dan Tahfidz Al-Qur\'an' },
    { label: 'Jenjang Pendidikan', value: 'Sekolah Dasar Islam Terpadu (Kelas 1 - 6)' },
    { label: 'Alamat Sekolah', value: 'Lingkungan Giri Asih - Jl. Gerakan Koperasi, Kel. Majalengka Kulon, Kec. Majalengka, Kab. Majalengka, Jawa Barat 45411' },
    { label: 'Telepon / WhatsApp', value: '0813-1013-9001 (Layanan Terpadu Tata Usaha & SPMB)' },
    { label: 'Email Resmi', value: 'sditalafiyahmjl@gmail.com' },
  ];

  const defaultMisiList = [
    'Menumbuhkan nilai-nilai tauhid dalam seluruh aspek pembelajaran dan pembiasaan.',
    'Mengajarkan aqidah dan ibadah yang sohihah sesuai dengan Al-Qur’an dan As-Sunnah sesuai dengan pemahaman salafus sholih.',
    'Membiasakan anak dengan akhlak Islami dalam keseharian.',
    'Mendidik anak agar kreatif dan inovatif.',
    'Menanamkan rasa cinta yang mendalam kepada Allah ﷻ dan Rasul-Nya ﷺ.',
    'Berusaha mendidik murid-murid agar menguasai semua mata pelajaran baik umum maupun agama secara komprehensif.'
  ];

  let identitasList = defaultIdentitasList;
  let misiList = defaultMisiList;
  let visiText = 'Menjadi Sekolah Dasar Islam Terpadu yang unggul dalam melahirkan generasi bertaqwa, berakhlak mulia, cerdas, terampil, mandiri, dan berwawasan luas berdasarkan Al-Qur\'an dan As-Sunnah.';

  try {
    const school = await prisma.school.findUnique({
      where: { slug: 'sd' },
      include: { cmsSections: true },
    });
    const cmsSec = school?.cmsSections.find((s) => s.sectionKey === 'sd_profil');
    if (cmsSec?.payload) {
      const parsed = JSON.parse(cmsSec.payload);
      if (Array.isArray(parsed.identitasList) && parsed.identitasList.length > 0) {
        identitasList = parsed.identitasList;
      }
      if (Array.isArray(parsed.misiList) && parsed.misiList.length > 0) {
        misiList = parsed.misiList;
      }
      if (parsed.visiText) {
        visiText = parsed.visiText;
      }
    }
  } catch (err) {
    console.error('Error fetching SD profil data from CMS:', err);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar schoolSlug="sd" />
      <main className="flex-1">
        {/* Hero Banner */}
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
              <span className="text-white font-medium">Profil Sekolah</span>
            </nav>

            <div className="max-w-3xl">
              <div className="text-xs font-bold text-emerald-200 uppercase tracking-widest inline-flex items-center gap-1.5 mb-3">
                <Building2 className="w-3.5 h-3.5 text-emerald-300" />
                <span>PROFIL SATUAN PENDIDIKAN</span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Sekolah Dasar Islam <br />
                Terpadu (SD&nbsp;IT) Al-Afiyah
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
            <ScrollReveal yOffset={20} duration={500} className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-center">
                <span className="text-xl sm:text-2xl font-extrabold text-emerald-900 block">Akreditasi B</span>
                <span className="text-xs text-emerald-700 font-medium">BAN-SM Resmi</span>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-center">
                <span className="text-xl sm:text-2xl font-extrabold text-emerald-900 block">YPIB Majalengka</span>
                <span className="text-xs text-emerald-700 font-medium">Yayasan Pendidikan Imam Bonjol</span>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-center">
                <span className="text-xl sm:text-2xl font-extrabold text-emerald-900 block">Gugus 3 Nusa Indah</span>
                <span className="text-xs text-emerald-700 font-medium">Sekolah Imbas 7 Sekolah</span>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-center">
                <span className="text-xl sm:text-2xl font-extrabold text-emerald-900 block">Tahsin &amp; Tahfidz</span>
                <span className="text-xs text-emerald-700 font-medium">Program Unggulan Al-Qur&apos;an</span>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Sambutan Kepala Sekolah SDIT Al Afiyah */}
        <section className="py-12 sm:py-16 bg-gradient-to-b from-white to-slate-50/70 border-b border-slate-200/80">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal yOffset={24} duration={500}>
              <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xs p-6 sm:p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-50/80 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                
                <div className="relative z-10">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                    <span className="px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 border border-emerald-200">
                      <GraduationCap className="w-4 h-4 text-emerald-700" />
                      <span>Sambutan Kepala Sekolah SD IT Al-Afiyah</span>
                    </span>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                      🌱 Tempat Bertumbuh
                    </span>
                  </div>

                  <div className="space-y-4 text-xs sm:text-sm lg:text-base text-slate-700 leading-relaxed font-normal">
                    <p className="font-bold text-emerald-950 text-base sm:text-lg">
                      Bismillahirrahmanirrahim.
                    </p>
                    <p>
                      Selamat datang di <strong>SD IT Al-Afiyah</strong>, tempat kami meyakini bahwa setiap anak adalah amanah Allah ﷻ dengan potensi, keunikan, dan fitrahnya masing-masing.
                    </p>
                    <p>
                      Bagi kami, pendidikan bukan sekadar tentang nilai dan prestasi. Pendidikan adalah tentang menemani anak bertumbuh, mengenal dirinya, mencintai kebaikan, serta berkembang sesuai fitrahnya dalam lingkungan yang penuh iman, ilmu, dan kasih sayang.
                    </p>
                    <blockquote className="p-4 sm:p-5 rounded-2xl bg-emerald-50/80 border-l-4 border-[#00A651] text-emerald-950 font-semibold italic text-sm sm:text-base">
                      &ldquo;Karena itu, SD IT Al-Afiyah bukan sekadar tempat belajar, namun juga tempat bertumbuh.&rdquo;
                    </blockquote>
                    <p>
                      Kami mengajak Ayah Bunda untuk bersama-sama memilih lingkungan pendidikan terbaik bagi putra-putri tercinta. Mari tumbuhkan iman, karakter, potensi, dan kecintaan belajar mereka bersama kami.
                    </p>
                    <p>
                      Mari bergabung bersama SD IT Al-Afiyah — tempat anak belajar dengan bahagia, bertumbuh dengan cinta, dan berkembang menjadi pribadi yang bermanfaat.
                    </p>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="font-extrabold text-slate-900 text-sm sm:text-base">
                        Febrian Fauzi, S.Pd
                      </p>
                      <p className="text-xs text-emerald-700 font-semibold mt-0.5">
                        Kepala Sekolah SD IT Al-Afiyah
                      </p>
                    </div>
                    <Link
                      href="/sd/spmb"
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#00A651] hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-95 shrink-0"
                    >
                      <span>Informasi SPMB SD IT</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Selayang Pandang & Legalitas Sekolah */}
        <section className="py-12 sm:py-16 bg-white border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal yOffset={24} duration={500} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block">
                  Selayang Pandang &amp; Naungan
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight text-balance leading-snug">
                  Mengenal Lebih Dekat <br className="hidden sm:inline" />
                  SD&nbsp;IT Al-Afiyah Majalengka
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  <strong>SD IT Al-Afiyah</strong> adalah sekolah formal yang berada di bawah naungan <strong>Yayasan Pendidikan Imam Bonjol (YPIB)</strong>. SD IT Al-Afiyah juga merupakan <strong>sekolah imbas dari 7 sekolah lainnya di Gugus 3 Nusa Indah</strong> yang ada di Kecamatan Majalengka, Kabupaten Majalengka.
                </p>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  SD IT Al-Afiyah menyelenggarakan pendidikan dan pembelajaran berdasarkan <strong>kurikulum nasional (Kurikulum 2013)</strong> dan <strong>kurikulum muatan lokal yang bernuansa keagamaan/religi</strong>. Selain itu, terdapat program unggulan utama, yaitu <strong>Tahsin dan Tahfidz Al-Qur&apos;an</strong>.
                </p>
                <div className="pt-2 flex flex-wrap gap-2.5 sm:gap-3">
                  <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#00A651]" />
                    <span>Terakreditasi B Resmi</span>
                  </div>
                  <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#00A651]" />
                    <span>Tahsin &amp; Tahfidz Qur&apos;an</span>
                  </div>
                  <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#00A651]" />
                    <span>Naungan YPIB Majalengka</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
                <div className="relative z-10">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 bg-white/10 px-3 py-1 rounded-full inline-block mb-3">
                    MUTU PENDIDIKAN BERPIJAK IMTAK
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold leading-snug">
                    Perpaduan Kurikulum Diknas &amp; Religi Yayasan
                  </h3>
                  <p className="mt-3 text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-normal">
                    SD IT Al-Afiyah dalam kegiatan belajar mengajar menggunakan perpaduan kurikulum Diknas dan kurikulum yayasan dalam mutu berpijak pada iman dan taqwa.
                  </p>
                  <div className="mt-6 pt-4 border-t border-emerald-800 flex items-center justify-between text-xs text-emerald-200">
                    <span>Lingkungan Giri Asih</span>
                    <span className="font-bold text-amber-300">Gugus 3 Nusa Indah</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Visi & Misi */}
        <section className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal yOffset={24} duration={500} className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
              {/* Visi Card */}
              <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="mb-5">
                    <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-[#007638] border border-[#00A651]/20 uppercase tracking-wider mb-2.5">
                      Visi SD IT Al-Afiyah
                    </span>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                      Mewujudkan Generasi Sholeh &amp; Berakhlak
                    </h2>
                  </div>

                  <blockquote className="p-5 rounded-xl bg-slate-50/90 border-l-4 border-[#00A651] text-emerald-950 font-semibold text-base sm:text-lg leading-relaxed">
                    &ldquo;{visiText}&rdquo;
                  </blockquote>

                  <p className="mt-5 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    Visi ini menegaskan komitmen SD IT Al-Afiyah dalam membentuk murid yang berkepribadian islami, berakhlak mulia, cerdas dalam pemikiran, serta mandiri dalam amal ibadah dan kehidupan sehari-hari.
                  </p>
                </div>
              </div>

              {/* Misi Card */}
              <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="mb-5">
                    <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-[#007638] border border-[#00A651]/20 uppercase tracking-wider mb-2.5">
                      Misi Pendidikan Sekolah
                    </span>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                      Langkah Strategis Pembinaan Murid
                    </h2>
                  </div>

                  <div className="space-y-3">
                    {misiList.map((misi, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-xs sm:text-[13px] text-slate-700">
                        <span className="w-5 h-5 rounded-md bg-emerald-50 text-emerald-800 text-[11px] font-bold flex items-center justify-center shrink-0 border border-emerald-200/80 mt-0.5 font-mono">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{misi}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Tabel Identitas Sekolah & Lingkungan Belajar */}
        <section className="py-12 sm:py-16 bg-white border-t border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal yOffset={20} duration={500} className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Data Satuan Pendidikan
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2.5">
                Identitas Resmi SD IT Al-Afiyah
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.1} yOffset={24} duration={500} className="max-w-3xl mx-auto rounded-2xl border border-slate-200 overflow-hidden shadow-2xs bg-white">
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
            </ScrollReveal>
          </div>
        </section>

        {/* Quick Links ke Fitur Khusus SD IT */}
        <section className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal yOffset={20} duration={500} className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Jelajahi Lebih Dekat SD IT Al-Afiyah
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Buka seluruh fitur dan halaman khusus tanpa tercampur dengan unit lain.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.1} yOffset={24} duration={500} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              <Link
                href="/sd/program"
                className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-400/60 hover:shadow-md transition-all group flex items-start gap-3.5"
              >
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 group-hover:bg-[#00A651] group-hover:text-white transition-colors">
                  <BookOpen className="w-4 h-4" />
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
                className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-400/60 hover:shadow-md transition-all group flex items-start gap-3.5"
              >
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 group-hover:bg-[#00A651] group-hover:text-white transition-colors">
                  <HeartHandshake className="w-4 h-4" />
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
                className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-400/60 hover:shadow-md transition-all group flex items-start gap-3.5"
              >
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 group-hover:bg-[#00A651] group-hover:text-white transition-colors">
                  <Camera className="w-4 h-4" />
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
                className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-400/60 hover:shadow-md transition-all group flex items-start gap-3.5"
              >
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 group-hover:bg-[#00A651] group-hover:text-white transition-colors">
                  <Users className="w-4 h-4" />
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
                className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-400/60 hover:shadow-md transition-all group flex items-start gap-3.5"
              >
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 group-hover:bg-[#00A651] group-hover:text-white transition-colors">
                  <Award className="w-4 h-4" />
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
                className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-400/60 hover:shadow-md transition-all group flex items-start gap-3.5"
              >
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 group-hover:bg-[#00A651] group-hover:text-white transition-colors">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    Layanan Tata Usaha &amp; Lokasi
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    WhatsApp hotline dan lokasi sekolah Lingkungan Giri Asih Majalengka Kulon.
                  </p>
                </div>
              </Link>
            </ScrollReveal>
          </div>
        </section>

        {/* Bottom CTA to SPMB */}
        <section className="bg-gradient-to-r from-emerald-900 to-[#064e3b] text-white py-12 sm:py-16">
          <ScrollReveal yOffset={24} duration={500} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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
          </ScrollReveal>
        </section>
      </main>
      <Footer schoolSlug="sd" />
      <StickyMobileBar schoolSlug="sd" />
    </div>
  );
}
