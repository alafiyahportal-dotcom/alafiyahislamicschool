import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyMobileBar from '@/components/layout/StickyMobileBar';
import Link from 'next/link';
import { 
  ArrowLeft, 
  ChevronRight, 
  CheckCircle2, 
  BookOpen, 
  HeartHandshake, 
  Compass, 
  Award, 
  Users, 
  GraduationCap,
  ShieldCheck, 
  ArrowRight,
  Trophy,
  Languages,
  Smartphone,
  Sparkles,
  Flame
} from 'lucide-react';

export const metadata: Metadata = {
  title: '6 Program Unggulan & Kurikulum SMP IT Al-Afiyah',
  description: 'Program Unggulan SMP IT Al-Afiyah Majalengka: Tahfidz 3-5+ Juz Mutqin, Fasih Berbahasa Arab Aktif, SCD (Student Character Development), Mutaba\'ah Digital, & Futsal Development Program.',
  icons: {
    icon: [
      { url: '/images/smp-logo.png', type: 'image/png' },
      { url: '/smp-favicon.ico', sizes: 'any' },
    ],
    shortcut: '/images/smp-logo.png',
    apple: '/images/smp-logo.png',
  },
  openGraph: {
    title: '6 Program Unggulan SMP IT Al-Afiyah Majalengka',
    description: 'Tahfidz 3-5+ Juz, Fasih Bahasa Arab, SCD, Mutaba\'ah Digital, & Futsal Development Program. Terakreditasi A.',
    images: ['/images/smp-program-unggulan.png'],
  },
};

export const revalidate = 60;

const SMP_PROGRAMS = [
  {
    id: 'tahfidz',
    number: '01',
    title: 'Tahfidz Juz 28, 29, 30 & Unggulan 5+ Juz',
    subtitle: 'Tartil Makhraj • Kaidah Tajwid • Mutqin Hafalan',
    desc: 'Bimbingan halaqah hafalan Al-Qur\'an intensif setiap pagi bersama para asatidz muhaffizh. Target dasar kelulusan adalah 3 Juz (Juz 28, 29, 30) dengan jalur akselerasi kelas tahfidz unggulan mencapai 5 Juz bahkan lebih.',
    badge: 'Tahfidz Qur\'an',
    icon: BookOpen,
    accent: 'gold',
    highlights: [
      'Halaqah tahfidz & tahsin harian setiap pagi',
      'Ujian Tasmi\' sekali duduk per juz berhadapan dengan dewan penguji',
      'Wisuda Tahfidz berkala dan sertifikat syahadah resmi',
      'Bimbingan muraja\'ah mandiri terstruktur'
    ]
  },
  {
    id: 'bahasa-arab',
    number: '02',
    title: 'Fasih Berbahasa Arab (Lisan & Tulisan)',
    subtitle: 'Bi\'ah Lughawiyyah • Percakapan Harian • Qawa\'id Dasar',
    desc: 'Pembiasaan dan pembinaan aktif penguasaan Bahasa Arab fasih. Murid dilatih berkomunikasi langsung (Muhadatsah), memahami kaidah nahwu-sharaf aplikatif, serta mahir membaca dan menerjemahkan teks berbahasa Arab.',
    badge: 'Bahasa Arab Aktif',
    icon: Languages,
    accent: 'blue',
    highlights: [
      'Pemberian kosa kata harian (al-mufradat al-yaumiyyah)',
      'Hari wajib berbahasa Arab (Yaumul Lughah)',
      'Pidato bahasa Arab (Khitabah) melatih keberanian berorasi',
      'Kajian literatur kitab turats & qira\'ah terarah'
    ]
  },
  {
    id: 'scd',
    number: '03',
    title: 'SCD (Student Character Development)',
    subtitle: 'Adab Remaja Islami • Leadership • Kemandirian',
    desc: 'Program penempaan karakter khusus remaja usia SMP. Mengawal masa transisi pubertas murid dengan penanaman nilai adab islami, etika pergaulan syar\'i, kepemimpinan (leadership), ketahanan mental, serta kemandirian sosial.',
    badge: 'Karakter & Kepemimpinan',
    icon: HeartHandshake,
    accent: 'gold',
    highlights: [
      'Pondasi adab sebelum ilmu dan etika thalabul ilmi',
      'Latihan kepemimpinan murid (LDKS) & organisasi murid',
      'Edukasi syar\'i pergaulan remaja & proteksi bahaya pergaulan bebas',
      'Kemandirian tata tertib dan kepedulian lingkungan'
    ]
  },
  {
    id: 'mutabaah',
    number: '04',
    title: 'Mutaba\'ah Digital',
    subtitle: 'Monitoring Ibadah • Keterbukaan • Sinergi Orang Tua',
    desc: 'Program monitoring dan pembiasaan ibadah harian berbasis sistem digital. Melibatkan kolaborasi sinergis antara murid, wali murid di rumah, dan dewan guru di sekolah untuk memastikan konsistensi ibadah wajib dan sunnah.',
    badge: 'Digital Monitoring',
    icon: Smartphone,
    accent: 'blue',
    highlights: [
      'Pencatatan shalat fardhu berjamaah 5 waktu secara digital',
      'Monitoring shalat sunnah (Tahajjud, Dhuha, Rawatib)',
      'Laporan tilawah harian (One Day One Juz / Half Juz)',
      'Akses evaluasi perkembangan murid oleh orang tua via gadget'
    ]
  },
  {
    id: 'futsal',
    number: '05',
    title: 'Futsal Development Program',
    subtitle: 'Olahraga Prestasi • Pelatih Berpengalaman • Turnamen Resmi',
    desc: 'Program unggulan khusus SMP IT Al-Afiyah yang berfokus pada pembinaan dan pengembangan potensi olahraga futsal secara terarah, disiplin, dan berkelanjutan. Melatih ketahanan fisik, skill taktik, dan sportivitas murid.',
    badge: 'Olahraga Prestasi',
    icon: Trophy,
    accent: 'gold',
    highlights: [
      'Pelatihan intensif teknik dasar, taktik, dan fisik terprogram',
      'Lapangan olahraga representatif di lingkungan sekolah',
      'Keikutsertaan dalam turnamen antar-sekolah tingkat regional & kabupaten',
      'Penanaman karakter sportivitas, mental juara, dan ukhuwah islamiyah'
    ]
  },
  {
    id: 'ekskul',
    number: '06',
    title: 'Ekstrakurikuler Pilihan Beragam',
    subtitle: 'Pramuka SIT • Tata Boga • Bahasa Arab Club • Futsal Club',
    desc: 'Wadah eksplorasi minat, bakat, dan keterampilan praktis (life skills) murid. Setiap murid dapat memilih bidang ekstrakurikuler yang sesuai dengan potensi minat mereka di bawah bimbingan pembina ahli.',
    badge: 'Bakat & Minat',
    icon: Flame,
    accent: 'blue',
    highlights: [
      'Pramuka Sekolah Islam Terpadu (SIT) pembentuk ketangkasan',
      'Tata Boga: Praktik kuliner kreatif dan wirausaha makanan sehat',
      'Klub Bahasa Arab & Seni Kaligrafi Islam (Khat)',
      'Klub Olahraga dan Kebugaran Murid'
    ]
  }
];

export default function SmpProgramPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-[#ffd51e] selection:text-[#030164] overflow-x-clip">
      <Navbar schoolSlug="smp" />

      {/* Hero Header */}
      <section className="bg-gradient-to-br from-[#030164] via-[#090580] to-[#01003d] text-white pt-24 sm:pt-28 pb-14 sm:pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffd51e_1.5px,transparent_1.5px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#ffd51e]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <nav className="flex items-center gap-1.5 text-xs text-blue-200/90 mb-5 flex-wrap" aria-label="Breadcrumb">
            <Link href="/smp" className="hover:text-white transition-colors inline-flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Beranda SMP IT</span>
            </Link>
            <ChevronRight className="w-3 h-3 text-blue-300/50" />
            <span className="text-[#ffd51e] font-semibold">Program Unggulan</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-[#ffd51e]/40 text-[#ffd51e] text-[11px] sm:text-xs font-bold tracking-wider uppercase mb-3 backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>KURIKULUM UNGGULAN BERKUALITAS AKREDITASI A</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              6 Program Unggulan SMP IT Al-Afiyah
            </h1>

            <p className="mt-3 sm:mt-4 text-sm sm:text-lg text-slate-200 leading-relaxed font-normal">
              Dirancang khusus untuk membimbing usia remaja agar memiliki fondasi spiritual Al-Qur'an yang kokoh, aktif berbahasa Arab, berkarakter mulia, serta berprestasi dalam bidang akademik dan olahraga.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
              <Link
                href="/smp/spmb"
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#ffd51e] text-[#030164] font-black text-xs uppercase tracking-wider hover:bg-yellow-400 transition-all shadow-md active:scale-95 inline-flex items-center justify-center gap-2"
              >
                <span>Daftar SPMB 2027/2028</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/smp/fasilitas"
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium text-xs uppercase tracking-wider transition-all inline-flex items-center justify-center gap-2"
              >
                <span>Lihat Sarana &amp; Fasilitas</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Program Grid Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12 sm:space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {SMP_PROGRAMS.map((prog) => {
            const IconComp = prog.icon;
            const isGold = prog.accent === 'gold';
            return (
              <div 
                key={prog.id} 
                id={prog.id}
                className="p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-[#030164]/40 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Accent top stripe */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 ${isGold ? 'bg-[#ffd51e]' : 'bg-[#030164]'}`} />

                <div>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <span className="w-10 h-10 rounded-2xl bg-blue-50 text-[#030164] font-extrabold text-sm flex items-center justify-center border border-blue-100 group-hover:scale-105 transition-transform">
                      {prog.number}
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                      {prog.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#030164] transition-colors leading-snug">
                    {prog.title}
                  </h3>
                  <p className="text-xs font-semibold text-[#030164]/70 mt-1 mb-3">
                    {prog.subtitle}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed mb-6">
                    {prog.desc}
                  </p>

                  <div className="space-y-2.5 pt-4 border-t border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                      Capaian &amp; Aktivitas Program:
                    </span>
                    {prog.highlights.map((point, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#030164] shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#030164]">
                    Kurikulum Terpadu
                  </span>
                  <Link
                    href="/smp/spmb"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#030164] hover:text-blue-800 transition-colors"
                  >
                    <span>Daftar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Struktur Integrasi Kurikulum */}
        <section className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-8 lg:p-12 space-y-6 sm:space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-[#030164] uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Sinergi Kurikulum
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
              Perpaduan Kurikulum Nasional &amp; Kepesantrenan
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Keseimbangan antara sains modern, literasi numerasi, dan pembinaan ruhiyah agar murid siap melanjutkan ke jenjang SMA/MA unggulan maupun pesantren ternama.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#030164] flex items-center justify-center font-bold mb-4">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">Kurikulum Nasional</h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Standar kompetensi Kurikulum Merdeka Kemendikbudristek: Matematika, IPA Terpadu, Bahasa Indonesia, Bahasa Inggris, IPS, dan Informatika.
              </p>
              <span className="text-[11px] font-bold text-[#030164]">Ujian Nasional &amp; Asesmen Bakat</span>
            </div>

            <div className="p-6 rounded-2xl bg-blue-50/60 border border-blue-100">
              <div className="w-10 h-10 rounded-xl bg-[#030164] text-[#ffd51e] flex items-center justify-center font-bold mb-4">
                <BookOpen className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">Kurikulum Diniyyah Al-Afiyah</h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Tahfidz Al-Qur'an 3–5+ Juz, Tahsin metode bersanad, Bahasa Arab (Nahwu-Sharaf aplikatif), Hadits Pilihan, Fiqih Ibadah, dan Sirah Nabawiyah.
              </p>
              <span className="text-[11px] font-bold text-[#030164]">Sanad &amp; Syahadah Tahfidz</span>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold mb-4">
                <Trophy className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">Pengembangan Potensi</h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Futsal Development Program, SCD (Student Character Development), Mutaba'ah Digital ibadah, pramuka, dan kegiatan entrepreneurship murid.
              </p>
              <span className="text-[11px] font-bold text-[#030164]">Kompetensi Hidup Berkarakter</span>
            </div>
          </div>
        </section>

      </main>

      <Footer schoolSlug="smp" />
      <StickyMobileBar schoolSlug="smp" />
    </div>
  );
}
