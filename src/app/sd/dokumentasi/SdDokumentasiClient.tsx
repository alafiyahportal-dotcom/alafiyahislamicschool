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

interface GalleryItem {
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
    id: 'shalat-berjamaah',
    name: 'Pembiasaan Shalat Berjamaah Siswi',
    image: '/images/sd-activity-shalat-berjamaah.jpg',
    desc: 'Pembiasaan adab ibadah harian sejak dini dengan shalat berjamaah yang khusyuk, melatih ketertiban, kebersihan, dan akhlak mahmudah.',
    category: 'Ibadah & Karakter',
    date: 'Setiap Hari',
    location: 'Kampus Giri Asih'
  },
  {
    id: 'daicilik-speech',
    name: 'Pelatihan Muhadharah & Da\'i Cilik Berani Tampil',
    image: '/images/sd-activity-daicilik-speech.jpg',
    desc: 'Mengasah rasa percaya diri murid, kecakapan public speaking, hafalan doa harian, dan penyampaian pesan kebaikan santun di hadapan teman sebaya.',
    category: 'Ibadah & Karakter',
    date: 'Program Mingguan',
    location: 'Ruang Serbaguna SD IT'
  },
  {
    id: 'kultum-murid',
    name: 'Kultum Mandiri & Bimbingan Kepemimpinan Murid',
    image: '/images/sd-activity-kultum-murid.jpg',
    desc: 'Melatih keberanian berbicara di hadapan publik, membawakan tausiyah singkat, serta menumbuhkan jiwa kepemimpinan nabawiyah.',
    category: 'Ibadah & Karakter',
    date: 'Bada Shalat Dzuhur',
    location: 'Masjid & Kelas SD IT'
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
    location: 'Gedung Belajar SD IT'
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
    location: 'Ruang Asesmen SD IT'
  },
  {
    id: 'field-study-banner',
    name: 'Field Study Smart Akhlak Fitrah (P4S An-Nabawiyah)',
    image: '/images/sd-field-study-banner.jpg',
    desc: 'Observasi kontekstual murid SD IT Al-Afiyah di alam terbuka, menanamkan nilai kemandirian, rasa syukur, dan cinta ciptaan Allah Ta\'ala.',
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
    name: 'Prestasi Tim Futsal SD IT Al-Afiyah (Second Place)',
    image: '/images/sd-futsal-champion.jpg',
    desc: 'Raihan piala Juara 2 (Second Place) Futsal tingkat pelajar daerah, melatih sportivitas, mental juara, dan ukhuwah islamiyah.',
    category: 'Prestasi & Bakat',
    date: 'September 2026',
    location: 'Kejuaraan Pelajar'
  },
];

const CATEGORIES = [
  'Semua',
  'Ibadah & Karakter',
  'Aktivitas Kelas',
  'Agro-Sains & Alam',
  'Prestasi & Bakat'
];

export default function SdDokumentasiClient() {
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);

  const filteredItems = activeCategory === 'Semua'
    ? GALLERY_DATA
    : GALLERY_DATA.filter((item) => item.category === activeCategory);

  return (
    <div className="w-full">
      {/* Header Banner Hijau Khas SD IT */}
      <section className="bg-gradient-to-br from-[#064e3b] via-[#047857] to-[#00A651] text-white pt-24 sm:pt-28 pb-14 sm:pb-18 relative overflow-hidden">
        {/* Subtle patterned backdrop */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:20px_20px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb & Back Button */}
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
              <span className="text-white font-medium">Dokumentasi &amp; Belajar</span>
            </nav>
          </div>

          <div className="max-w-3xl">
            <span className="text-xs font-bold text-emerald-200 uppercase tracking-widest bg-emerald-900/60 border border-emerald-400/30 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5 mb-3.5 shadow-xs">
              <Camera className="w-3.5 h-3.5 text-emerald-300" />
              <span>DOKUMENTASI &amp; SARANA BELAJAR SD IT</span>
            </span>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Dokumentasi Kegiatan &amp; Aktivitas Belajar SD IT
            </h1>

            <p className="mt-3.5 text-xs sm:text-sm lg:text-base text-emerald-100/90 leading-relaxed font-normal">
              Potret nyata keseharian murid SD IT Al-Afiyah Majalengka: pembiasaan ibadah shalat berjamaah, muhadharah da&apos;i cilik, suasana kelas interaktif, agro-literasi di P4S An-Nabawiyah, dan prestasi membanggakan.
            </p>

            {/* Quick Badges */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 mt-6 text-xs text-emerald-100">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 border border-white/15">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                <span>100% Dokumentasi Asli SD IT</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 border border-white/15">
                <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
                <span>Smart Akhlaq Fitrah</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 border border-white/15">
                <HeartHandshake className="w-3.5 h-3.5 text-emerald-200" />
                <span>Karakter Nabawiyah</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Tabs & Gallery Grid */}
      <section className="py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter Tabs */}
          <ScrollReveal yOffset={16} duration={400}>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mb-10">
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-2xs ${
                      isActive
                        ? 'bg-[#00A651] text-white shadow-md scale-105'
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-300 hover:text-emerald-800'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </ScrollReveal>

          {/* Photo Cards Grid */}
          <ScrollReveal yOffset={24} duration={500}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedPhoto(item)}
                  className="group rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-2xs hover:shadow-lg hover:border-emerald-400/60 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-slate-100 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/95 text-emerald-900 shadow-xs border border-emerald-100 backdrop-blur-xs">
                        {item.category}
                      </span>
                    </div>

                    {item.location && (
                      <div className="absolute bottom-3 left-3">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-900/80 text-white backdrop-blur-xs">
                          {item.location}
                        </span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-slate-900/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-2xs">
                      <span className="px-4 py-2 rounded-xl bg-white/95 text-slate-900 text-xs font-bold shadow-md flex items-center gap-1.5">
                        <ZoomIn className="w-4 h-4 text-emerald-700" />
                        <span>Perbesar Foto</span>
                      </span>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1.5 group-hover:text-emerald-700 transition-colors leading-snug">
                        {item.name}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-700 font-semibold">
                      <span className="flex items-center gap-1">
                        <Camera className="w-3.5 h-3.5" />
                        <span>Lihat Detail</span>
                      </span>
                      <span className="group-hover:translate-x-1 transition-transform">➔</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Bottom CTA to SPMB */}
      <section className="bg-gradient-to-r from-emerald-900 to-[#064e3b] text-white py-12 sm:py-16 border-t border-emerald-800">
        <ScrollReveal yOffset={24} duration={500}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="px-3.5 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-600/40 text-emerald-200 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 mb-3">
              <HeartHandshake className="w-3.5 h-3.5 text-amber-300" />
              <span>Penerimaan Murid Baru T.A. 2027/2028</span>
            </span>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-2">
              Ingin Ananda Bertumbuh &amp; Belajar di SD IT Al-Afiyah?
            </h2>

            <p className="mt-2.5 text-xs sm:text-sm text-emerald-100 max-w-2xl mx-auto leading-relaxed">
              Kuota terbatas hanya 2 Rombel demi pendampingan adab dan pembentukan karakter nabawiyah yang optimal.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/sd/spmb/daftar"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#00A651] hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
              >
                <span>Daftar SPMB SD IT Online</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/sd/spmb"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-xs sm:text-sm transition-all"
              >
                <span>Alur &amp; Syarat SPMB</span>
              </Link>
              <Link
                href="/sd"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl text-emerald-200 hover:text-white font-medium text-xs sm:text-sm transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Beranda SD IT</span>
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedPhoto.image}
                alt={selectedPhoto.name}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
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
