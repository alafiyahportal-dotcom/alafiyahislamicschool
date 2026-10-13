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
  MapPin, 
  Phone, 
  Clock, 
  ArrowRight,
  Target,
  Users,
  Compass,
  Trophy,
  Languages
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Profil Lengkap SMP IT Al-Afiyah | Be Smart & Religious',
  description: 'Profil resmi Sekolah Menengah Pertama Islam Terpadu (SMP IT) Al-Afiyah Majalengka. Terakreditasi A (SK No. 012/BAN-PDM/SK/2025), visi Smart & Religious, kurikulum terpadu, tahfidz 3-5+ juz mutqin, dan bahasa Arab aktif.',
  icons: {
    icon: [
      { url: '/images/smp-icon-192.png', type: 'image/png' },
      { url: '/smp-favicon.ico', sizes: 'any' },
    ],
    shortcut: '/images/smp-icon-192.png',
    apple: '/images/smp-icon-192.png',
  },
  openGraph: {
    title: 'Profil Lengkap SMP IT Al-Afiyah Majalengka',
    description: 'Mencetak generasi remaja Qur\'ani cerdas dan berakhlak mulia. Terakreditasi A (SK No. 012/BAN-PDM/SK/2025).',
    images: ['/images/smp-og.jpg'],
  },
};

export const revalidate = 60;

export default async function SmpProfilPage() {
  const identitasSekolah = [
    { label: 'Nama Sekolah Resmi', value: 'SMP IT Al-Afiyah Majalengka' },
    { label: 'Status Akreditasi', value: 'Terakreditasi A (SK No. 012/BAN-PDM/SK/2025)' },
    { label: 'Tagline & Semboyan', value: 'Be Smart and Be Religius' },
    { label: 'Yayasan Penyelenggara', value: 'Yayasan Pendidikan Imam Bonjol (YPIB) Majalengka' },
    { label: 'Ketua Yayasan', value: 'Jejen Nurbayan, S.Sos.' },
    { label: 'Kepala Sekolah', value: 'Jaja Madhuri, S.Pd.' },
    { label: 'Tata Usaha', value: 'Iip Zaenal Arifin, S.Pd.' },
    { label: 'Sarpras', value: 'Muhamad Eechram Riady, S.Pd.' },
    { label: 'Humas', value: 'Amelia Kartika, S.Sos.' },
    { label: 'Jenjang Pendidikan', value: 'Sekolah Menengah Pertama Islam Terpadu (Kelas VII – IX)' },
    { label: 'Kurikulum Utama', value: 'Integrasi Kurikulum Nasional & Kurikulum Pesantren Terpadu Al-Afiyah' },
    { label: 'Target Capaian Tahfidz', value: 'Minimal 3 Juz (Juz 28, 29, 30) & Kelas Unggulan 5+ Juz Mutqin' },
    { label: 'Penguasaan Bahasa', value: 'Bahasa Internasional (Bahasa Arab & Bahasa Inggris Aktif)' },
    { label: 'Alamat Sekolah', value: 'Lingkungan Giri Asih - Jl. Gerakan Koperasi No. 110, Majalengka Wetan, Kec. Majalengka, Kab. Majalengka 45411' },
    { label: 'Hotline Resmi / WhatsApp', value: '0822-4935-7893 (Layanan Informasi SPMB & Tata Usaha)' },
    { label: 'Rekening Resmi SPMB', value: 'Bank Muamalat 1360012405 a.n SMP IT Al Afiyah' },
    { label: 'Media Sosial', value: 'IG: @smpitalafiyahmjl • FB & YouTube: SMP IT Al Afiyah' },
  ];

  const strukturPengurus = [
    { jabatan: 'Ketua Yayasan', nama: 'Jejen Nurbayan, S.Sos.', role: 'Penyelenggara Lembaga (YPIB)', icon: Building2 },
    { jabatan: 'Kepala Sekolah', nama: 'Jaja Madhuri, S.Pd.', role: 'Pimpinan Satuan Pendidikan & Akademik', icon: GraduationCap },
    { jabatan: 'PKS Kurikulum', nama: 'M. Akbar Pratama, S.Pd.', role: 'Pengembangan Kurikulum & Mutu Pembelajaran', icon: BookOpen },
    { jabatan: 'PKS Kesiswaan', nama: 'Rio Satrio, S.Pd.', role: 'Pembinaan Karakter & Kedisiplinan Santri', icon: Users },
    { jabatan: 'Sarpras', nama: 'Muhamad Eechram Riady, S.Pd.', role: 'Pengelolaan Fasilitas & Sarana Belajar', icon: Compass },
    { jabatan: 'Tata Usaha', nama: 'Iip Zaenal Arifin, S.Pd.', role: 'Akuntabilitas Keuangan & Administrasi Sekolah', icon: Award },
    { jabatan: 'Humas', nama: 'Amelia Kartika, S.Sos.', role: 'Kemitraan, Komunikasi Publik & Layanan Informasi', icon: HeartHandshake },
    { jabatan: 'Lead Developer & IT Systems', nama: 'Mulia Rizki', role: 'Pengembang Sistem Digital & Pusat Data', icon: ShieldCheck },
  ];

  const defaultMisiList = [
    'Menetapkan motto sekolah yaitu Be Smart and Be Religius.',
    'Membiasakan Murid menggunakan bahasa Arab/Inggris di lingkungan sekolah, sehingga fasih berbahasa Arab/Inggris baik lisan maupun tulisan.',
    'Membiasakan Murid menghafalkan Al Quran minimal 3 juz.',
    'Menanamkan nilai-nilai tauhid, mengajarkan akidah ahlusunnah dan ibadah yang sohihah mengikuti Al-Qur\'an dan As-Sunnah sesuai dengan pemahaman salafus shaleh.',
    'Membiasakan anak dengan akhlak Islami, mendidik anak agar kreatif dan inovatif, serta menanamkan rasa cinta kepada Allah dan Rosul-Nya.',
    'Mendidik Murid agar mampu menguasai semua pelajaran baik umum maupun agama termasuk teknologi informatika, sehingga dapat menciptakan SDM yang handal.',
    'Mengikuti kegiatan PMBK yang dilaksanakan oleh Dinas Pendidikan.',
    'Mengikuti kegiatan turnamen yang dilaksanakan oleh lembaga lain.',
    'Melakukan pemetaan mutu pendidikan.',
    'Membuat rencana pemenuhan mutu pendidikan.',
    'Melaksanakan rencana pemenuhan mutu pendidikan.',
    'Mengembangkan kemampuan belajar dan berinovasi.',
    'Mengembangkan literasi digital.',
    'Mengembangkan kecakapan hidup.',
    'Mengembangkan penguatan pendidikan karakter.'
  ];

  let visi = 'Unggul dalam bahasa Internasional (Inggris dan Arab), hafal Al Quran dan Menguasai Teknologi Informatika';
  let misiList = defaultMisiList;

  try {
    const school = await prisma.school.findUnique({
      where: { slug: 'smp' },
      include: { cmsSections: true },
    });
    const cmsSec = school?.cmsSections.find((s) => s.sectionKey === 'smp_profil');
    if (cmsSec?.payload) {
      const parsed = JSON.parse(cmsSec.payload);
      if (parsed.visi) visi = parsed.visi;
      if (Array.isArray(parsed.misi) && parsed.misi.length > 0) {
        misiList = parsed.misi;
      }
    }
  } catch (err) {
    console.error('Error fetching SMP profil data from CMS:', err);
  }

  const pilarKeunggulan = [
    {
      title: 'Akademik Berbobot & Terakreditasi A',
      desc: 'Standar mutu pembelajaran unggul yang diakui BAN-PDM dengan predikat A Unggul (SK No. 012/BAN-PDM/SK/2025).',
      icon: Award,
    },
    {
      title: 'Tahfidz 3-5+ Juz Terarah',
      desc: 'Bimbingan halaqah harian bersama asatidz bersanad untuk menjamin kualitas makhraj dan mutqin.',
      icon: BookOpen,
    },
    {
      title: 'Karakter Remaja Tangguh (SCD)',
      desc: 'Pendampingan intensif masa transisi remaja dengan adab islami, anti-bullying, dan jiwa kepemimpinan.',
      icon: ShieldCheck,
    },
    {
      title: 'Futsal Development Program',
      desc: 'Pembinaan olahraga kompetitif terarah yang melatih ketahanan fisik, kerja sama tim, dan sportivitas.',
      icon: Trophy,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-[#ffd51e] selection:text-[#030164] overflow-x-clip">
      <Navbar schoolSlug="smp" />

      {/* Hero Header SMP IT (Sleek Deep Navy & Gold Aesthetic) */}
      <section className="bg-gradient-to-br from-[#030164] via-[#090580] to-[#01003d] text-white pt-24 sm:pt-28 pb-14 sm:pb-20 relative overflow-hidden">
        {/* Subtle geometric pattern overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffd51e_1.5px,transparent_1.5px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#ffd51e]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#030164] rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-blue-200/90 mb-5 flex-wrap" aria-label="Breadcrumb">
            <Link href="/smp" className="hover:text-white transition-colors inline-flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Beranda SMP IT</span>
            </Link>
            <ChevronRight className="w-3 h-3 text-blue-300/50" />
            <span className="text-[#ffd51e] font-semibold">Profil Lengkap</span>
          </nav>

          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#ffd51e] mb-3">
              <span className="w-6 h-[2px] bg-[#ffd51e] rounded-full inline-block" />
              <span>Terakreditasi A Resmi (SK No. 012/BAN-PDM/SK/2025)</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Profil SMP IT Al-Afiyah
            </h1>

            <p className="mt-3 sm:mt-4 text-sm sm:text-lg text-slate-200 leading-relaxed font-normal">
              Mewujudkan generasi remaja muslim yang cerdas secara intelektual, kokoh dalam aqidah, fasih berbahasa Arab, dan unggul dalam akhlak terpuji. <span className="text-[#ffd51e] font-semibold italic">"Be Smart & Religious"</span>.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
              <Link
                href="/smp/spmb"
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#ffd51e] text-[#030164] font-black text-xs uppercase tracking-wider hover:bg-yellow-400 transition-all shadow-md active:scale-95 inline-flex items-center justify-center gap-2"
              >
                <span>Info SPMB 2027/2028</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/smp/program"
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium text-xs uppercase tracking-wider transition-all inline-flex items-center justify-center gap-2"
              >
                <span>Lihat 6 Program Unggulan</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12 sm:space-y-16">
        
        {/* Visi & Misi Card (Executive Navy Layout) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          <div className="lg:col-span-5 bg-gradient-to-br from-[#030164] to-[#0d0a7a] text-white p-5 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl shadow-xl relative overflow-hidden border border-blue-900/50">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#ffd51e]/10 rounded-full blur-2xl pointer-events-none" />
            <div className="text-xs font-bold text-[#ffd51e] uppercase tracking-widest mb-2 flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span>Visi Utama Sekolah</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-snug">
              Visi SMP IT Al-Afiyah Majalengka
            </h2>
            <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-xs">
              <p className="text-sm sm:text-base font-bold text-white leading-relaxed italic">
                &ldquo;{visi}&rdquo;
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-white/15 space-y-3">
              <div className="flex items-center gap-3 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-[#ffd51e] shrink-0" />
                <span>Terakreditasi A (SK No. 012/BAN-PDM/SK/2025) BAN-PDM</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-[#ffd51e] shrink-0" />
                <span>Target Hafalan Minimal 3 Juz Al-Qur'an</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-[#ffd51e] shrink-0" />
                <span>Bahasa Internasional (Arab &amp; Inggris) serta Teknologi Informatika</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white p-5 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-100 pb-3">
              <div>
                <div className="text-xs font-bold text-[#030164] uppercase tracking-widest mb-1">
                  Amanah Pendidikan
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {misiList.length} Misi Strategis SMP IT Al-Afiyah
                </h3>
              </div>
              <span className="px-3 py-1 bg-blue-50 text-[#030164] text-xs font-bold rounded-full font-mono">
                Motto: Be Smart and Be Religius
              </span>
            </div>

            <div className="space-y-2.5 max-h-[560px] overflow-y-auto pr-1 sm:pr-2">
              {misiList.map((m, idx) => (
                <div
                  key={idx}
                  className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-blue-300 hover:bg-blue-50/30 transition-all flex items-start gap-3 group"
                >
                  <span className="w-7 h-7 rounded-lg bg-[#030164] text-[#ffd51e] font-black text-xs flex items-center justify-center shrink-0 mt-0.5 font-mono shadow-2xs group-hover:scale-105 transition-transform">
                    {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                    {m}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4 Pilar Keunggulan SMP IT */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest text-[#030164] mb-2">
              <span className="w-5 h-[2px] bg-[#030164] rounded-full inline-block" />
              <span>Keunggulan Kompetitif</span>
              <span className="w-5 h-[2px] bg-[#030164] rounded-full inline-block" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
              Mengapa Memilih SMP IT Al-Afiyah?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Kombinasi kurikulum seimbang yang mengawal transisi remaja agar kuat secara moral dan kompetitif secara sains.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {pilarKeunggulan.map((p, idx) => {
              const IconComp = p.icon;
              return (
                <div key={idx} className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md hover:border-[#030164]/30 transition-all flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#030164] flex items-center justify-center mb-4">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <h4 className="text-base font-bold text-slate-900 mb-2">{p.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Struktur Kepengurusan & Dewan Pimpinan Sekolah */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest text-[#030164] mb-2">
              <span className="w-5 h-[2px] bg-[#030164] rounded-full inline-block" />
              <span>Struktur Organisasi Resmi</span>
              <span className="w-5 h-[2px] bg-[#030164] rounded-full inline-block" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              Dewan Pimpinan &amp; Pengelola Sekolah
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5">
              Amanah kepemimpinan dan manajemen profesional SMP IT Al-Afiyah Majalengka.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4">
            {strukturPengurus.map((p, idx) => {
              const IconComp = p.icon;
              return (
                <div
                  key={idx}
                  className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#030164]/40 transition-all flex flex-col justify-between text-left group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-[#030164] text-[10px] sm:text-[11px] font-mono font-bold tracking-wide">
                        {p.jabatan}
                      </span>
                      <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-[#030164] group-hover:text-[#ffd51e] transition-colors">
                        <IconComp className="w-4 h-4" />
                      </div>
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#030164] transition-colors">
                      {p.nama}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {p.role}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Tabel Identitas Resmi Sekolah */}
        <section className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-8 lg:p-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-[#030164] uppercase tracking-widest">
                Data Kelembagaan Resmi
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                Identitas SMP IT Al-Afiyah Majalengka
              </h3>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-700 bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-xl w-fit">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-slate-500 font-medium">Status Legalitas:</span>
              <span className="font-bold text-emerald-700">Aktif &amp; Terverifikasi Resmi</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {identitasSekolah.map((item, idx) => (
              <div key={idx} className="flex flex-col p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-100/80">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  {item.label}
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-900 mt-1">
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          {/* Banner Rekening Resmi SPMB */}
          <div className="mt-6 p-5 sm:p-7 rounded-2xl bg-gradient-to-r from-[#030164] to-[#0c0879] text-white flex flex-col md:flex-row items-stretch md:items-center justify-between gap-5 border border-[#ffd51e]/30">
            <div className="space-y-1 text-center md:text-left">
              <span className="text-[10px] text-[#ffd51e] font-bold uppercase tracking-widest block">
                Rekening Resmi Pendaftaran SPMB
              </span>
              <h4 className="text-lg sm:text-xl font-extrabold text-white">
                Bank Muamalat : 1360012405
              </h4>
              <p className="text-xs text-blue-200">
                Atas Nama: <strong className="text-white">SMP IT Al Afiyah</strong> • Seluruh transaksi pendaftaran wajib disalurkan melalui rekening resmi ini.
              </p>
            </div>

            <Link
              href="/smp/spmb"
              className="w-full md:w-auto px-6 py-3 rounded-xl bg-[#ffd51e] text-[#030164] font-black text-xs uppercase tracking-wider hover:bg-yellow-400 transition-all shadow-md active:scale-95 text-center inline-flex items-center justify-center"
            >
              Rincian Biaya &amp; Daftar SPMB
            </Link>
          </div>
        </section>

      </main>

      <Footer schoolSlug="smp" />
      <StickyMobileBar schoolSlug="smp" />
    </div>
  );
}
