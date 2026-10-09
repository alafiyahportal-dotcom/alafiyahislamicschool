'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowLeft, 
  ChevronRight, 
  ZoomIn, 
  X, 
  CheckCircle2, 
  GraduationCap, 
  Calendar, 
  MapPin, 
  ArrowRight,
  Award,
  Users
} from 'lucide-react';
import ScrollReveal from '@/components/landing/ScrollReveal';

export interface SmpGalleryItem {
  id: string;
  title: string;
  image: string;
  desc: string;
  category: string;
  date: string;
  location: string;
}

export const DEFAULT_SMP_GALLERIES: SmpGalleryItem[] = [
  {
    id: 'smp-gal-1',
    title: 'Haflah Kelulusan & Kenaikan Kelas SMP IT Al-Afiyah Angkatan ke-3',
    category: 'Wisuda & Kelulusan',
    image: '/images/smp-kelulusan-angkatan-3.jpg',
    desc: 'Momen khidmat pelepasan santriwati angkatan ke-3 Tahun Ajaran 2025/2026 bertema "Melangkah Pasti Meraih Prestasi, Berakhlak Islami, Siap Berkompetisi - Be Smart & Religious".',
    date: 'Tahun Ajaran 2025/2026',
    location: 'Aula Utama SMP IT Al-Afiyah'
  },
  {
    id: 'smp-gal-2',
    title: 'Penyematan Medali Kelulusan & Apresiasi Santriwati Angkatan 2026',
    category: 'Wisuda & Kelulusan',
    image: '/images/smp-wisuda-akhwat.jpg',
    desc: 'Rasa syukur dan keceriaan para santriwati berkalung medali kelulusan SMP IT Al-Afiyah setelah tuntas menempuh kurikulum terpadu dan target capaian tahfidz Al-Qur\'an.',
    date: 'Juni 2026',
    location: 'Panggung Wisuda SMP IT'
  },
  {
    id: 'smp-gal-3',
    title: 'Generasi Pemimpin Berakhlak Islami, Mandiri & Siap Berkompetisi',
    category: 'Prestasi & Karakter',
    image: '/images/smp-santri-ikhwan-wisuda.jpg',
    desc: 'Santri ikhwan berbusana formal rapi melambangkan kedewasaan, kemandirian adab, dan kesiapan melangkah ke jenjang pendidikan lanjutan dengan pondasi tauhid yang kokoh.',
    date: 'Juni 2026',
    location: 'Haflah Akhirussanah SMP IT'
  },
  {
    id: 'smp-gal-4',
    title: 'Khidmat Sinergi Dewan Asatidz, Wali Murid & Santri di Aula Sekolah',
    category: 'Sinergi Orang Tua',
    image: '/images/smp-haflah-aula.jpg',
    desc: 'Suasana syahdu dan khidmat prosesi wisuda kelulusan yang dihadiri dewan asatidz, jajaran yayasan, serta para orang tua/wali murid dengan penuh kehangatan ukhuwah.',
    date: 'Juni 2026',
    location: 'Aula Pertemuan SMP IT Al-Afiyah'
  },
  {
    id: 'smp-gal-5',
    title: 'Sesi Penyerahan Laporan Pendidikan & Evaluasi Capaian Murid',
    category: 'Sinergi Orang Tua',
    image: '/images/smp-kelulusan-konsultasi.jpg',
    desc: 'Sesi tatap muka konsultasi perkembangan karakter, hafalan tahfidz, dan prestasi akademik antara ustadz pembimbing dengan orang tua murid secara personal.',
    date: 'Juni 2026',
    location: 'Ruang Edukasi & Konsultasi'
  },
  {
    id: 'smp-gal-6',
    title: 'Petualangan Seru River Tubing Cikadongdong & Tadabbur Alam',
    category: 'Rihlah & Outing Class',
    image: '/images/smp-tubing-1.jpg',
    desc: 'Menumbuhkan keberanian, jiwa kepemimpinan, kemandirian fisik, dan ukhuwah islamiyah santri menyusuri aliran sungai Cikadongdong Majalengka yang menantang.',
    date: 'Mei 2026',
    location: 'Cikadongdong River Tubing, Majalengka'
  },
  {
    id: 'smp-gal-7',
    title: 'Kekompakan Tim Santri Mengarungi Arus Jeram Sungai',
    category: 'Rihlah & Outing Class',
    image: '/images/smp-tubing-2.jpg',
    desc: 'Membangun rasa saling percaya antar teman sebaya dan bimbingan keselamatan dari asatidz pendamping dalam aktivitas outdoor edukatif.',
    date: 'Mei 2026',
    location: 'Cikadongdong River Tubing'
  },
  {
    id: 'smp-gal-8',
    title: 'Halaqah Tahfidz & Ujian Tasmi\' Al-Qur\'an Sekali Duduk',
    category: 'Tahfidz & Ibadah',
    image: '/images/smp-outing-3.jpg',
    desc: 'Murid membacakan hafalan 1 juz Al-Qur\'an sekali duduk di hadapan dewan asatidz dan disaksikan oleh kedua orang tua secara khidmat.',
    date: 'September 2026',
    location: 'Masjid SMP IT Al-Afiyah'
  }
];

const CATEGORIES = [
  'Semua',
  'Wisuda & Kelulusan',
  'Prestasi & Karakter',
  'Sinergi Orang Tua',
  'Rihlah & Outing Class',
  'Tahfidz & Ibadah'
];

export default function SmpDokumentasiClient({
  initialGallery
}: {
  initialGallery?: SmpGalleryItem[];
}) {
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [selectedPhoto, setSelectedPhoto] = useState<SmpGalleryItem | null>(null);

  const galleryList = (initialGallery && initialGallery.length > 0) ? initialGallery : DEFAULT_SMP_GALLERIES;

  const filteredItems = activeCategory === 'Semua'
    ? galleryList
    : galleryList.filter((item) => item.category === activeCategory);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedPhoto(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="w-full">
      {/* Hero Header SMP */}
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
            <span className="text-[#ffd51e] font-semibold">Galeri &amp; Dokumentasi</span>
          </nav>

          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#ffd51e] mb-3">
              <span className="w-6 h-[2px] bg-[#ffd51e] rounded-full inline-block" />
              <span>Dokumentasi Nyata SMP IT Al-Afiyah</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Galeri Kegiatan &amp; Haflah Kelulusan
            </h1>

            <p className="mt-3 sm:mt-4 text-xs sm:text-sm lg:text-base text-slate-200 leading-relaxed font-normal">
              Potret nyata santri SMP IT Al-Afiyah Majalengka: Dari momen syahdu haflah kelulusan &amp; penyematan medali tahfidz, kebersamaan sinergi orang tua, pembentukan karakter kepemimpinan, hingga keseruan rihlah tadabbur alam river tubing.
            </p>

            {/* Quick Badges */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 mt-6 text-xs text-blue-100">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 border border-white/15">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#ffd51e]" />
                <span>100% Dokumentasi Asli SMP IT</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 border border-white/15">
                <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
                <span>Haflah Kelulusan Angkatan ke-3</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 border border-white/15">
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                <span>Be Smart &amp; Religious</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const count = cat === 'Semua' 
              ? galleryList.length 
              : galleryList.filter((item) => item.category === cat).length;
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#030164] text-[#ffd51e] shadow-md shadow-blue-950/20'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-[#ffd51e] text-[#030164]' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedPhoto(item)}
              className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-[#030164]/40 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <div className="relative h-52 sm:h-64 bg-slate-900 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  
                  {/* Category Pill */}
                  <div className="absolute top-3.5 left-3.5 sm:top-4 sm:left-4">
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-[#030164] text-[#ffd51e] border border-white/20 shadow-xs">
                      {item.category}
                    </span>
                  </div>

                  {/* Zoom Icon Hover Hint */}
                  <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn className="w-4 h-4" />
                  </div>
                </div>

                <div className="p-4 sm:p-6 space-y-2 sm:space-y-3">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#030164] transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {item.desc}
                  </p>
                </div>
              </div>

              <div className="px-4 pb-4 pt-3 sm:px-6 sm:pb-6 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{item.date}</span>
                </div>
                <div className="flex items-center gap-1.5 truncate max-w-[160px]">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{item.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Bottom CTA to SPMB */}
      <section className="bg-gradient-to-r from-[#030164] via-[#090580] to-[#01003d] text-white py-12 sm:py-16 border-t border-blue-900">
        <ScrollReveal yOffset={24} duration={500}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest text-[#ffd51e] mb-2">
              <span className="w-5 h-[2px] bg-[#ffd51e] rounded-full inline-block" />
              <span>Penerimaan Murid Baru SMP IT Al-Afiyah</span>
              <span className="w-5 h-[2px] bg-[#ffd51e] rounded-full inline-block" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-2">
              Siapkan Generasi Berakhlak Islami, Cerdas &amp; Siap Berkompetisi
            </h2>

            <p className="mt-2.5 text-xs sm:text-sm text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Bergabunglah bersama keluarga besar SMP IT Al-Afiyah Majalengka. Program unggulan Tahfidz Qur&apos;an, Bilingual Arab-Inggris, Pembinaan Karakter Remaja (SCD), dan Futsal Development Program.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/smp/spmb/daftar"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#ffd51e] hover:bg-yellow-400 text-[#030164] font-extrabold text-xs sm:text-sm shadow-md transition-all active:scale-95"
              >
                <span>Daftar Online SPMB SMP IT</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/smp/spmb"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-xs sm:text-sm transition-all"
              >
                <span>Informasi Biaya &amp; Alur</span>
              </Link>
              <Link
                href="/smp"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl text-blue-200 hover:text-white font-medium text-xs sm:text-sm transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Beranda SMP</span>
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              aria-label="Tutup foto"
              className="absolute top-3.5 right-3.5 z-10 w-9 h-9 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative aspect-[16/10] sm:aspect-[16/9] bg-slate-900">
              <img
                src={selectedPhoto.image}
                alt={selectedPhoto.title}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-[#030164] border border-blue-200">
                  {selectedPhoto.category}
                </span>
                {selectedPhoto.location && (
                  <span className="text-xs text-slate-500 font-medium">
                    Lokasi: {selectedPhoto.location}
                  </span>
                )}
              </div>

              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                {selectedPhoto.title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                {selectedPhoto.desc}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
