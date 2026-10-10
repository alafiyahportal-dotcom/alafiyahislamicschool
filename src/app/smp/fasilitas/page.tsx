import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyMobileBar from '@/components/layout/StickyMobileBar';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Building2, 
  ArrowLeft, 
  ChevronRight, 
  CheckCircle2, 
  Wifi, 
  Monitor, 
  Trophy, 
  BookOpen, 
  ArrowRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Sarana & Fasilitas Sekolah SMP IT Al-Afiyah Majalengka',
  description: 'Fasilitas representatif SMP IT Al-Afiyah Majalengka: Aula pertemuan sekolah, ruang bimbingan konsultasi murid, masjid ibadah & tahfidz, panggung apresiasi, kelas ber-AC, lab komputer, dan lapangan olahraga.',
  icons: {
    icon: [
      { url: '/images/smp-logo.png', type: 'image/png' },
      { url: '/smp-favicon.ico', sizes: 'any' },
    ],
    shortcut: '/images/smp-logo.png',
    apple: '/images/smp-logo.png',
  },
  openGraph: {
    title: 'Fasilitas SMP IT Al-Afiyah Majalengka',
    description: 'Sarana belajar representatif, bersih, dan nyaman mendukung perkembangan tahfidz & akademik murid.',
    images: ['/images/smp-haflah-aula.jpg'],
  },
};

export const revalidate = 60;

interface FacilityItem {
  name: string;
  category: string;
  image: string;
  desc: string;
  features: string[];
}

const DEFAULT_FACILITIES: FacilityItem[] = [
  {
    name: 'Ruang Kelas Pembelajaran Interaktif & Nyaman',
    category: 'Ruang Belajar',
    image: '/images/smp-kelas-literasi.jpg',
    desc: 'Ruang kelas kondusif berpendingin udara (AC) dengan fasilitas proyektor multimedia, pencahayaan optimal, dan tata meja ergonomis yang menunjang interaksi aktif murid.',
    features: ['Pendingin Ruangan (AC) di Setiap Kelas', 'Proyektor Multimedia & Sound System', 'Kapasitas Siswa Terukur & Personal']
  },
  {
    name: 'Perpustakaan & Pojok Literasi Sekolah',
    category: 'Perpustakaan & Literasi',
    image: '/images/smp-perpustakaan-literasi.jpg',
    desc: 'Pusat literasi sekolah dengan ribuan judul koleksi buku keislaman, ensiklopedia sains, dan literatur umum penunjang nalar kritis serta budaya membaca murid.',
    features: ['Koleksi Buku & Kitab Lengkap', 'Area Membaca Nyaman & Tenang', 'Mendukung Budaya Literasi Harian']
  },
  {
    name: 'Aula Pertemuan & Ruang Serbaguna Utama',
    category: 'Aula & Pertemuan',
    image: '/images/smp-haflah-aula.jpg',
    desc: 'Aula representatif sekolah yang luas dan berpendingin udara untuk pertemuan akbar wali murid, prosesi haflah kelulusan, pembekalan santri, serta agenda kebersamaan sekolah.',
    features: ['Kapasitas Ratusan Jamaah & Kursi Nyaman', 'Sistem Audio Multimedia & Pendingin Ruangan', 'Pusat Agenda Haflah & Pertemuan Wali Murid']
  },
  {
    name: 'Ruang Konsultasi & Bimbingan Belajar Personal',
    category: 'Konseling & Akademik',
    image: '/images/smp-kelulusan-konsultasi.jpg',
    desc: 'Ruang tatap muka edukatif yang tenang dan kondusif untuk evaluasi capaian belajar murid, konsultasi raport secara personal antara asatidz dengan orang tua, serta pendampingan adab santri.',
    features: ['Kenyamanan & Privasi Sesi Tatap Muka', 'Bimbingan Langsung Bersama Dewan Asatidz', 'Evaluasi Capaian Akademik & Tahfidz Terpadu']
  },
  {
    name: 'Masjid & Pusat Halaqah Tahfidz Al-Qur\'an',
    category: 'Pusat Ibadah & Tahfidz',
    image: '/images/smp-outing-3.jpg',
    desc: 'Pusat pembinaan ruhiyah dan pembiasaan ibadah harian santri: shalat fardhu berjamaah, dzikir Al-Ma\'tsurat pagi petang, serta halaqah talaqqi & muraja\'ah Al-Qur\'an intensif.',
    features: ['Area Ibadah Bersih, Suci & Nyaman', 'Tempat Wudhu Higienis Terpisah Ikhwan/Akhwat', 'Suasana Tenang Menunjang Kekhusyukan']
  },
  {
    name: 'Panggung Acara & Apresiasi Prestasi Murid',
    category: 'Panggung Prestasi',
    image: '/images/smp-kelulusan-angkatan-3.jpg',
    desc: 'Sarana panggung pementasan dan apresiasi murid untuk mengasah keberanian public speaking, orasi khitabah dwibahasa (Arab-Inggris), serta seremonial wisuda penghargaan prestasi.',
    features: ['Panggung Representatif Berlatar Resmi', 'Peralatan Tata Suara & Presentasi Lengkap', 'Wadah Pengembangan Percaya Diri Murid']
  }
];

const ADDITIONAL_FACILITIES = [
  {
    icon: Building2,
    name: 'Ruang Kelas Nyaman & Ber-AC',
    desc: 'Ruang kelas kondusif berpendingin udara (AC) dengan pencahayaan alami optimal, tata letak meja ergonomis, dan fasilitas proyektor multimedia.'
  },
  {
    icon: Monitor,
    name: 'Laboratorium Komputer Modern',
    desc: 'Perangkat PC terkini dan jaringan internet kecepatan tinggi untuk pembelajaran informatika, literasi digital, dan simulasi asesmen berbasis komputer.'
  },
  {
    icon: Trophy,
    name: 'Lapangan Olahraga & Futsal',
    desc: 'Sarana olahraga representatif di lingkungan sekolah untuk latihan Futsal Development Program, bola voli, senam pagi, dan kejuaraan antarkelas.'
  },
  {
    icon: Wifi,
    name: 'Akses Internet & Mutaba\'ah Digital',
    desc: 'Infrastruktur jaringan sekolah terintegrasi untuk menunjang pencatatan presensi siswa, capaian tahfidz, dan portal akademik SIAKAD real-time.'
  }
];

export default async function SmpFasilitasPage() {
  let facilities: FacilityItem[] = DEFAULT_FACILITIES;

  try {
    const school = await prisma.school.findUnique({
      where: { slug: 'smp' },
      include: { cmsSections: true },
    });
    const cmsSec = school?.cmsSections.find((s) => s.sectionKey === 'facilities');
    if (cmsSec?.payload) {
      const parsed = JSON.parse(cmsSec.payload);
      if (Array.isArray(parsed) && parsed.length > 0) {
        facilities = parsed.map((item: any) => ({
          name: item.name || item.title || 'Fasilitas SMP IT',
          category: item.category || 'Fasilitas Sekolah',
          image: item.image || '/images/smp-haflah-aula.jpg',
          desc: item.desc || item.description || '',
          features: Array.isArray(item.features) ? item.features : ['Fasilitas Nyaman & Representatif', 'Dukungan Pembelajaran Terpadu']
        }));
      }
    }
  } catch (err) {
    console.error('Error fetching SMP facilities from CMS, using default list:', err);
  }

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
            <span className="text-[#ffd51e] font-semibold">Sarana &amp; Fasilitas</span>
          </nav>

          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#ffd51e] mb-3">
              <span className="w-6 h-[2px] bg-[#ffd51e] rounded-full inline-block" />
              <span>Sarana Pembelajaran Nyata &amp; Representatif</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Fasilitas SMP IT Al-Afiyah
            </h1>

            <p className="mt-3 sm:mt-4 text-xs sm:text-sm lg:text-base text-slate-200 leading-relaxed font-normal">
              Kami menyediakan lingkungan belajar yang aman, asri, dan representatif di Majalengka untuk mendukung optimalisasi pembinaan adab nabawi, capaian tahfidz, akademik terpadu, dan potensi jasmani murid.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
              <Link
                href="/smp/spmb"
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#ffd51e] text-[#030164] font-black text-xs uppercase tracking-wider hover:bg-yellow-400 transition-all shadow-md active:scale-95 inline-flex items-center justify-center gap-2"
              >
                <span>Daftar SPMB SMP IT</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/smp/kontak"
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium text-xs uppercase tracking-wider transition-all inline-flex items-center justify-center gap-2"
              >
                <span>Kunjungi Sekolah (Maps)</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities Grid (100% Authentic Photos) */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12 sm:space-y-16">
        <div className="space-y-10 sm:space-y-12">
          {facilities.map((fac, idx) => (
            <div 
              key={idx}
              className={`rounded-2xl sm:rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all grid grid-cols-1 lg:grid-cols-12 gap-0 ${
                idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Media Preview (Authentic Photos Only) */}
              <div className={`lg:col-span-6 relative min-h-[260px] sm:min-h-[340px] bg-slate-900 overflow-hidden ${
                idx % 2 === 1 ? 'lg:order-2' : ''
              }`}>
                <Image
                  src={fac.image}
                  alt={fac.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-[#ffd51e] text-[#030164] shadow-xs">
                    {fac.category}
                  </span>
                </div>
              </div>

              {/* Text Description */}
              <div className={`lg:col-span-6 p-5 sm:p-8 lg:p-10 flex flex-col justify-between ${
                idx % 2 === 1 ? 'lg:order-1' : ''
              }`}>
                <div className="space-y-4">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#030164] font-extrabold text-sm flex items-center justify-center border border-blue-100">
                    0{idx + 1}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                    {fac.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {fac.desc}
                  </p>

                  <div className="pt-4 border-t border-slate-100 space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
                      Keunggulan Sarana:
                    </span>
                    {fac.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-[#030164] shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 sm:mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-semibold truncate max-w-[200px]">SMP IT Al-Afiyah (Lingkungan Giri Asih)</span>
                  <Link
                    href="/smp/kontak"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#030164] hover:text-blue-800 shrink-0"
                  >
                    <span>Lokasi Sekolah</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Facility Features (Clean Icon-Based, No AI Slop) */}
        <section className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-6 sm:p-10 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#030164] mb-2">
              <span className="w-5 h-[2px] bg-[#030164] rounded-full inline-block" />
              <span>Sarana Penunjang Lainnya</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Infrastruktur &amp; Kenyamanan Belajar Terpadu
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Fasilitas penunjang harian yang terus dirawat dan diperbarui untuk kenyamanan seluruh civitas akademika.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {ADDITIONAL_FACILITIES.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-[#030164]/30 hover:shadow-md transition-all space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100/80 text-[#030164] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">{item.name}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Info Lokasi Sekolah */}
        <section className="p-5 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#030164] to-[#0c0879] text-white flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 shadow-xl border border-[#ffd51e]/30">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs text-[#ffd51e] font-bold uppercase tracking-widest block">
              Kunjungan &amp; Observasi Fasilitas Sekolah
            </span>
            <h4 className="text-xl sm:text-2xl font-extrabold text-white">
              Ingin Meninjau Langsung Fasilitas Kami?
            </h4>
            <p className="text-xs sm:text-sm text-blue-200 max-w-xl">
              Ayah Bunda dipersilakan berkunjung ke sekolah SMP IT Al-Afiyah di Lingkungan Giri Asih (Jl. Gerakan Koperasi No. 110, Majalengka Wetan) pada jam kerja (Senin - Sabtu). Tim panitia siap menyambut dan mendampingi tour sekolah.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-2.5 sm:gap-3">
            <Link
              href="/smp/spmb"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#ffd51e] text-[#030164] font-black text-xs uppercase tracking-wider hover:bg-yellow-400 transition-all shadow-md active:scale-95 text-center inline-flex items-center justify-center"
            >
              Daftar SPMB Online
            </Link>
            <a
              href="https://wa.me/6282249357893?text=Assalamu%27alaikum%20Panitia%20SMP%20IT%20Al-Afiyah,%20saya%20ingin%20jadwalkan%20kunjungan%20melihat%20fasilitas%20sekolah"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium text-xs uppercase tracking-wider transition-all text-center inline-flex items-center justify-center"
            >
              Jadwalkan Kunjungan WA
            </a>
          </div>
        </section>
      </main>

      <Footer schoolSlug="smp" />
      <StickyMobileBar schoolSlug="smp" />
    </div>
  );
}
