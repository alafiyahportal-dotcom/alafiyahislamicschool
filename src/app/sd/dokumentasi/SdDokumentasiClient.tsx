'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Camera, 
  ArrowLeft, 
  ChevronRight, 
  ZoomIn, 
  X, 
  CheckCircle2, 
  GraduationCap, 
  Calendar, 
  HeartHandshake, 
  ArrowRight, 
} from 'lucide-react';
import ScrollReveal from '@/components/landing/ScrollReveal';
import { useBackClose } from '@/components/shared/MobileBackNavigationGuard';

export interface GalleryItem {
  id: string;
  name: string;
  image: string;
  desc: string;
  category: string;
  date?: string;
  location?: string;
}

const GALLERY_DATA: GalleryItem[] = [
  {
    id: 'rihlah-jepara-waterpark',
    name: 'Rihlah & Tadabbur Alam Murid SDIT (Jepara Waterpark)',
    image: '/images/sd-rihlah-jepara.jpg',
    desc: 'Keceriaan rihlah edukatif dan tadabbur alam siswi SDIT Al-Afiyah bersama para asatidzah di Jepara Waterpark. Mempererat ukhuwah islamiyah, melatih kemandirian, dan menyegarkan semangat belajar.',
    category: 'Rihlah & Outing',
    date: 'Tahun Ajaran Berjalan',
    location: 'Jepara Ourland / Waterpark'
  },
  {
    id: 'shalat-berjamaah',
    name: 'Pembiasaan Shalat Berjamaah Siswi',
    image: '/images/sd-activity-shalat-berjamaah.jpg',
    desc: 'Pembiasaan adab ibadah harian sejak dini dengan shalat berjamaah yang khusyuk, melatih ketertiban, kebersihan, dan akhlak mahmudah.',
    category: 'Ibadah & Karakter',
    date: 'Setiap Hari',
    location: 'Lingkungan Giri Asih'
  },
  {
    id: 'daicilik-speech',
    name: 'Pelatihan Muhadharah & Da\'i Cilik Berani Tampil',
    image: '/images/sd-activity-daicilik-speech.jpg',
    desc: 'Mengasah rasa percaya diri murid, kecakapan public speaking, hafalan doa harian, dan penyampaian pesan kebaikan santun di hadapan teman sebaya.',
    category: 'Ibadah & Karakter',
    date: 'Program Mingguan',
    location: 'Ruang Serbaguna SDIT'
  },
  {
    id: 'kultum-murid',
    name: 'Kultum Mandiri & Bimbingan Kepemimpinan Murid',
    image: '/images/sd-activity-kultum-murid.jpg',
    desc: 'Melatih keberanian berbicara di hadapan publik, membawakan tausiyah singkat, serta menumbuhkan jiwa kepemimpinan nabawiyah.',
    category: 'Ibadah & Karakter',
    date: 'Bada Shalat Dzuhur',
    location: 'Masjid & Kelas SDIT'
  },
  {
    id: 'halaqah-tahfidz',
    name: 'Halaqah Tahfidz Qur\'an & Pembiasaan Adab',
    image: '/images/sd-activity-halaqah-tahfidz.jpg',
    desc: 'Bimbingan talaqqi tartil dan setoran hafalan Al-Qur\'an Juz 30 mutqin dengan metode adab nabawiyah yang ramah anak dan membahagiakan.',
    category: 'Ibadah & Karakter',
    date: 'Pagi Hari (07.00 - 08.00)',
    location: 'Halaqah Kelas'
  },
  {
    id: 'classroom-6b',
    name: 'Kenyamanan Belajar Kelas Terpadu (Welcome to Our Class)',
    image: '/images/sd-activity-classroom-6b.jpg',
    desc: 'Ruang kelas yang asri, bersih, ceria, dan berfasilitas lengkap, menciptakan suasana belajar yang fokus, interaktif, dan ramah anak.',
    category: 'Aktivitas Kelas',
    date: 'T.A. Berjalan',
    location: 'Gedung Belajar SDIT'
  },
  {
    id: 'multimedia-learning',
    name: 'Pembelajaran Interaktif Digital & Karakter ("Second Home")',
    image: '/images/sd-activity-multimedia-learning.jpg',
    desc: 'Pemanfaatan media audio visual dalam pendalaman materi kurikulum nasional dan sains Islam, mewujudkan sekolah sebagai rumah kedua yang hangat.',
    category: 'Aktivitas Kelas',
    date: 'KBM Harian',
    location: 'Kelas Multimedia'
  },
  {
    id: 'sts-assessment',
    name: 'Sumatif Tengah Semester (STS) 1 Terpadu Berbasis Kejujuran',
    image: '/images/sts-semester-1-sdit.jpg',
    desc: 'Pelaksanaan asesmen sumatif semester ganjil yang mengedepankan integritas, kejujuran diri, dan ketelitian belajar murid.',
    category: 'Aktivitas Kelas',
    date: 'September 2026',
    location: 'Ruang Asesmen SDIT'
  },
  {
    id: 'field-study-banner',
    name: 'Field Study Smart Akhlak Fitrah (P4S An-Nabawiyah)',
    image: '/images/sd-field-study-banner.jpg',
    desc: 'Observasi kontekstual murid SDIT Al-Afiyah di alam terbuka, menanamkan nilai kemandirian, rasa syukur, dan cinta ciptaan Allah Ta\'ala.',
    category: 'Agro-Sains & Alam',
    date: 'September 2026',
    location: 'P4S An-Nabawiyah'
  },
  {
    id: 'planting-guidance',
    name: 'Bimbingan Praktik Semai Bibit ke Polybag',
    image: '/images/sd-planting-guidance.jpg',
    desc: 'Bimbingan langsung ustadz mendampingi siswi memindahkan bibit sayur ke media polybag dengan teliti, cermat, dan penuh kasih sayang.',
    category: 'Agro-Sains & Alam',
    date: 'Field Study 2026',
    location: 'Kebun Pembibitan'
  },
  {
    id: 'seedling-care',
    name: 'Greenhouse & Observasi Bibit Hortikultura',
    image: '/images/sd-seedling-care.jpg',
    desc: 'Siswi mengamati pertumbuhan tunas tanaman pangan di rak semai greenhouse bambu sebagai sarana pembelajaran agro-sains nabawi.',
    category: 'Agro-Sains & Alam',
    date: 'Field Study 2026',
    location: 'Greenhouse Bambu P4S'
  },
  {
    id: 'fish-feeding',
    name: 'Edukasi Budidaya Ikan & Kolam Biofloc',
    image: '/images/sd-field-fish-feeding.jpg',
    desc: 'Murid ikhwan belajar ekosistem perairan tawar dan praktik pemberian pakan ikan di kolam terpal biofloc percontohan.',
    category: 'Agro-Sains & Alam',
    date: 'Field Study 2026',
    location: 'Kolam Biofloc P4S'
  },
  {
    id: 'futsal-champion',
    name: 'Prestasi Tim Futsal SDIT Al-Afiyah (Second Place)',
    image: '/images/sd-futsal-champion.jpg',
    desc: 'Raihan piala Juara 2 (Second Place) Futsal tingkat pelajar daerah, melatih sportivitas, mental juara, dan ukhuwah islamiyah.',
    category: 'Prestasi & Bakat',
    date: 'September 2026',
    location: 'Kejuaraan Pelajar'
  },
];

const CATEGORIES = [
  'Semua',
  'Rihlah & Outing',
  'Ibadah & Karakter',
  'Aktivitas Kelas',
  'Agro-Sains & Alam',
  'Prestasi & Bakat'
];

export default function SdDokumentasiClient({ initialGallery }: { initialGallery?: GalleryItem[] }) {
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);

  useBackClose(
    activeCategory !== 'Semua',
    () => setActiveCategory('Semua'),
    'sd-gallery-tab'
  );
  useBackClose(Boolean(selectedPhoto), () => setSelectedPhoto(null), 'sd-gallery-photo');

  const galleryList = (initialGallery && initialGallery.length > 0) ? initialGallery : GALLERY_DATA;

  const filteredItems = activeCategory === 'Semua'
    ? galleryList
    : galleryList.filter((item) => item.category === activeCategory);

  return (
    <div className="w-full pt-16 sm:pt-20 bg-white">
      {/* Compact Header Al-Hidayah Style */}
      <section className="bg-[#00594f] text-white py-8 sm:py-10 border-b-4 border-[#e5a93b]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1.5 text-xs text-emerald-100/80 mb-1.5" aria-label="Breadcrumb">
            <Link href="/sd" className="hover:text-[#e5a93b] transition-colors">
              Beranda SDIT
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#e5a93b]" />
            <span className="text-[#e5a93b] font-semibold">Dokumentasi &amp; Fasilitas</span>
          </nav>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Dokumentasi Kegiatan &amp; Fasilitas Belajar SDIT Al-Afiyah
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
                      ? 'border-[#00594f] text-[#00594f]'
                      : 'border-transparent text-slate-500 hover:text-[#003831]'
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
                className="group rounded-sm overflow-hidden bg-white border border-slate-200 hover:border-[#00594f] transition-colors cursor-pointer flex flex-col justify-between"
              >
                <div className="aspect-[4/3] overflow-hidden bg-slate-100 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.dataset.triedFallback) {
                        target.dataset.triedFallback = 'true';
                        target.src = '/images/sd-hero-greenhouse.jpg';
                      }
                    }}
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2.5 py-0.5 rounded-xs text-[10px] font-bold bg-[#003831]/90 text-white uppercase tracking-wider">
                      {item.category}
                    </span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-[#003831] mb-1 group-hover:text-[#00594f] transition-colors leading-snug">
                      {item.name}
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedPhoto.image}
                alt={selectedPhoto.name}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {selectedPhoto.category}
                </span>
                {selectedPhoto.location && (
                  <span className="text-xs text-slate-500 font-medium">
                    Lokasi: {selectedPhoto.location}
                  </span>
                )}
              </div>

              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                {selectedPhoto.name}
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
