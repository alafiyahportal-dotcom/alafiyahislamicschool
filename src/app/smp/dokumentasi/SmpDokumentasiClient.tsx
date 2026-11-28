'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  X,
  Calendar,
  MapPin,
  ArrowRight,
} from 'lucide-react';
import { useBackClose } from '@/components/shared/MobileBackNavigationGuard';

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
    desc: 'Momen khidmat pelepasan santri angkatan ke-3 Tahun Ajaran 2025/2026 bertema "Melangkah Pasti Meraih Prestasi, Berakhlak Islami, Siap Berkompetisi - Be Smart & Religious".',
    date: 'Tahun Ajaran 2025/2026',
    location: 'Aula Utama SMP IT Al-Afiyah',
  },
  {
    id: 'smp-gal-2',
    title: 'Pramuka SIT & Kepanduan Karakter Outdoor di Alam Terbuka',
    category: 'Kepanduan & Karakter',
    image: '/images/smp-pramuka-outdoor.jpg',
    desc: 'Latihan kepanduan Pramuka SIT untuk mengasah ketangguhan fisik, kedisiplinan, kemandirian mental, kepemimpinan (qiyadah), dan kerja sama tim santri di alam terbuka Majalengka.',
    date: 'Agustus 2026',
    location: 'Bumi Perkemahan & Alam Terbuka Majalengka',
  },
  {
    id: 'smp-gal-3',
    title: 'Pembelajaran Aktif di Ruang Kelas & Wawasan Geografi Global',
    category: 'Akademik & Literasi',
    image: '/images/smp-kelas-literasi.jpg',
    desc: 'Santri ikhwan aktif mengkaji literatur dan peta kawasan regional ASEAN di ruang kelas yang nyaman, representatif, dan mendorong wawasan keilmuan yang luas.',
    date: 'September 2026',
    location: 'Ruang Kelas SMP IT Al-Afiyah',
  },
  {
    id: 'smp-gal-4',
    title: 'Budaya Literasi & Riset Mandiri di Perpustakaan Sekolah',
    category: 'Akademik & Literasi',
    image: '/images/smp-perpustakaan-literasi.jpg',
    desc: 'Santri tekun mencatat riset dan membaca buku-buku referensi di pojok baca perpustakaan sekolah untuk memperluas cakrawala ilmu pengetahuan, adab, dan sains.',
    date: 'Agustus 2026',
    location: 'Perpustakaan & Reading Corner SMP IT',
  },
  {
    id: 'smp-gal-5',
    title: 'Generasi Pemimpin Berakhlak Islami, Mandiri & Siap Berkompetisi',
    category: 'Kepanduan & Karakter',
    image: '/images/smp-santri-ikhwan-wisuda.jpg',
    desc: 'Santri ikhwan berbusana formal rapi melambangkan kedewasaan, kemandirian adab, dan kesiapan melangkah ke jenjang pendidikan lanjutan dengan pondasi tauhid yang kokoh.',
    date: 'Juni 2026',
    location: 'Haflah Akhirussanah SMP IT',
  },
  {
    id: 'smp-gal-6',
    title: 'Khidmat Sinergi Dewan Asatidz, Wali Murid & Santri di Aula Sekolah',
    category: 'Sinergi Orang Tua',
    image: '/images/smp-haflah-aula.jpg',
    desc: 'Suasana syahdu dan khidmat prosesi wisuda kelulusan yang dihadiri dewan asatidz, jajaran yayasan, serta para orang tua/wali murid dengan penuh kehangatan ukhuwah.',
    date: 'Juni 2026',
    location: 'Aula Pertemuan SMP IT Al-Afiyah',
  },
  {
    id: 'smp-gal-7',
    title: 'Sesi Penyerahan Laporan Pendidikan & Evaluasi Capaian Murid',
    category: 'Sinergi Orang Tua',
    image: '/images/smp-kelulusan-konsultasi.jpg',
    desc: 'Sesi tatap muka konsultasi perkembangan karakter, hafalan tahfidz, dan prestasi akademik antara ustadz pembimbing dengan orang tua murid secara personal.',
    date: 'Juni 2026',
    location: 'Ruang Edukasi & Konsultasi',
  },
  {
    id: 'smp-gal-8',
    title: 'Petualangan Seru River Tubing Cikadongdong & Tadabbur Alam',
    category: 'Rihlah & Outing Class',
    image: '/images/smp-tubing-1.jpg',
    desc: 'Menumbuhkan keberanian, jiwa kepemimpinan, kemandirian fisik, dan ukhuwah islamiyah santri menyusuri aliran sungai Cikadongdong Majalengka yang menantang.',
    date: 'Mei 2026',
    location: 'Cikadongdong River Tubing, Majalengka',
  },
  {
    id: 'smp-gal-9',
    title: "Halaqah Tahfidz Al-Qur'an & Talaqqi Bersama Asatidz",
    category: 'Tahfidz & Ibadah',
    image: '/images/smp-halaqah-tahfidz-quran.jpg',
    desc: "Suasana halaqah Al-Qur'an intensif para santri di ruang utama masjid dengan bimbingan asatidz pembina tahfidz mutqin.",
    date: 'Oktober 2026',
    location: 'Masjid SMP IT Al-Afiyah',
  },
  {
    id: 'smp-gal-10',
    title: "Ujian Tasmi' Al-Qur'an & Mutaba'ah Digital Santri",
    category: 'Tahfidz & Ibadah',
    image: '/images/smp-tasmi-mutabaah-digital.jpg',
    desc: "Pelaksanaan ujian tasmi' hafalan Al-Qur'an santri dan pencatatan mutaba'ah digital terpadu oleh ustadz penguji.",
    date: 'Oktober 2026',
    location: 'Masjid SMP IT Al-Afiyah',
  },
  {
    id: 'smp-gal-11',
    title: 'Bimbingan Adab, Dzikir & Pembiasaan Shalat di Masjid',
    category: 'Tahfidz & Ibadah',
    image: '/images/smp-masjid-pusat-halaqah.jpg',
    desc: 'Keteladanan para asatidz dalam membimbing adab, shalat fardhu berjamaah, serta dzikir harian santriwan di lingkungan masjid sekolah.',
    date: 'Oktober 2026',
    location: 'Masjid SMP IT Al-Afiyah',
  },
];

const CATEGORIES = [
  'Semua',
  'Wisuda & Kelulusan',
  'Tahfidz & Ibadah',
  'Akademik & Literasi',
  'Kepanduan & Karakter',
  'Sinergi Orang Tua',
  'Rihlah & Outing Class',
];

export default function SmpDokumentasiClient({
  initialGallery,
}: {
  initialGallery?: SmpGalleryItem[];
}) {
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [selectedPhoto, setSelectedPhoto] = useState<SmpGalleryItem | null>(null);

  useBackClose(Boolean(selectedPhoto), () => setSelectedPhoto(null), 'smp-gallery-photo');
  useBackClose(
    activeCategory !== 'Semua' && !selectedPhoto,
    () => setActiveCategory('Semua'),
    'smp-gallery-tab'
  );

  const galleryList =
    initialGallery && initialGallery.length > 0 ? initialGallery : DEFAULT_SMP_GALLERIES;

  const filteredItems =
    activeCategory === 'Semua'
      ? galleryList
      : galleryList.filter((item) => item.category === activeCategory);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedPhoto(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="w-full pt-16 sm:pt-20 bg-white">
      {/* Compact Header Al-Hidayah Style */}
      <section className="bg-[#030164] text-white py-8 sm:py-10 border-b-4 border-[#ffd51e]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav
            className="flex items-center gap-1.5 text-xs text-blue-200/80 mb-1.5"
            aria-label="Breadcrumb"
          >
            <Link href="/smp" className="hover:text-[#ffd51e] transition-colors">
              Beranda SMP IT
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#ffd51e]" />
            <span className="text-[#ffd51e] font-semibold">Galeri &amp; Dokumentasi</span>
          </nav>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Dokumentasi Kegiatan &amp; Haflah Kelulusan SMP IT Al-Afiyah
          </h1>
        </div>
      </section>

      {/* Filter Tabs & Gallery Grid */}
      <section className="py-10 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Minimalist Underline Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 border-b border-slate-200 mb-8">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`pb-3 text-xs sm:text-sm font-bold transition-colors border-b-2 -mb-[1px] cursor-pointer ${
                    isActive
                      ? 'border-[#030164] text-[#030164]'
                      : 'border-transparent text-slate-500 hover:text-[#030164]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Photo Cards Grid (Clean Minimalist Style) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedPhoto(item)}
                className="group rounded-sm overflow-hidden bg-white border border-slate-200 hover:border-[#030164] transition-colors cursor-pointer flex flex-col justify-between"
              >
                <div className="aspect-[4/3] overflow-hidden bg-slate-100 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.dataset.triedFallback) {
                        target.dataset.triedFallback = 'true';
                        target.src = '/images/smp-kelulusan-angkatan-3.jpg';
                      }
                    }}
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2.5 py-0.5 rounded-xs text-[10px] font-bold bg-[#030164]/90 text-[#ffd51e] uppercase tracking-wider">
                      {item.category}
                    </span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-[#030164] mb-1 group-hover:text-blue-900 transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-white rounded-sm overflow-hidden shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              aria-label="Tutup foto"
              className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-slate-900/80 text-white flex items-center justify-center hover:bg-slate-900 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-7 bg-slate-950 flex items-center justify-center min-h-[260px] sm:min-h-[380px] relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedPhoto.image}
                  alt={selectedPhoto.title}
                  className="w-full h-full max-h-[75vh] object-contain"
                />
              </div>

              <div className="lg:col-span-5 p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <span className="inline-block px-2.5 py-0.5 rounded-xs text-[10px] font-bold uppercase tracking-wider bg-[#030164] text-[#ffd51e]">
                    {selectedPhoto.category}
                  </span>

                  <h3 className="text-lg font-extrabold text-[#030164] leading-snug">
                    {selectedPhoto.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {selectedPhoto.desc}
                  </p>

                  <div className="pt-2 space-y-1.5 text-xs text-slate-500 border-t border-slate-100">
                    {selectedPhoto.date && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-[#030164]" />
                        <span>{selectedPhoto.date}</span>
                      </div>
                    )}
                    {selectedPhoto.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#030164]" />
                        <span>{selectedPhoto.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <Link
                    href="/smp/spmb/daftar"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xs bg-[#030164] hover:bg-[#090580] text-[#ffd51e] font-bold text-xs transition-colors"
                  >
                    <span>Daftar SPMB SMP IT</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setSelectedPhoto(null)}
                    className="px-4 py-2 rounded-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
