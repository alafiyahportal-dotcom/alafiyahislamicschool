import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyMobileBar from '@/components/layout/StickyMobileBar';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Sarana & Fasilitas Sekolah | SMP IT Al-Afiyah Majalengka',
  description:
    'Fasilitas representatif SMP IT Al-Afiyah Majalengka: Ruang kelas ber-AC, perpustakaan literasi, aula pertemuan, masjid pusat halaqah tahfidz, ruang konsultasi, lab komputer, dan lapangan olahraga.',
  icons: {
    icon: [
      { url: '/images/smp-icon-192.png', type: 'image/png' },
      { url: '/smp-favicon.ico', sizes: 'any' },
    ],
    shortcut: '/images/smp-icon-192.png',
    apple: '/images/smp-icon-192.png',
  },
};

export const revalidate = 60;

interface FacilityItem {
  name: string;
  category: string;
  image: string;
  desc: string;
}

const DEFAULT_FACILITIES: FacilityItem[] = [
  {
    name: 'Ruang Kelas Pembelajaran Interaktif & Ber-AC',
    category: 'Ruang Belajar',
    image: '/images/smp-kelas-literasi.jpg',
    desc: 'Ruang kelas kondusif berpendingin udara (AC) dengan fasilitas proyektor multimedia, pencahayaan optimal, dan tata meja ergonomis yang menunjang interaksi aktif murid.',
  },
  {
    name: 'Perpustakaan & Pojok Literasi Sekolah',
    category: 'Perpustakaan & Literasi',
    image: '/images/smp-perpustakaan-literasi.jpg',
    desc: 'Pusat literasi sekolah dengan ribuan judul koleksi buku keislaman, ensiklopedia sains, dan literatur umum penunjang nalar kritis serta budaya membaca murid.',
  },
  {
    name: 'Masjid & Pusat Halaqah Tahfidz Al-Qur\'an',
    category: 'Pusat Ibadah & Tahfidz',
    image: '/images/smp-masjid-pusat-halaqah.jpg',
    desc: 'Pusat pembinaan ruhiyah dan pembiasaan ibadah harian santri: shalat fardhu berjamaah, dzikir Al-Ma\'tsurat pagi petang, serta halaqah talaqqi & muraja\'ah Al-Qur\'an intensif.',
  },
  {
    name: 'Aula Pertemuan & Ruang Serbaguna Utama',
    category: 'Aula & Pertemuan',
    image: '/images/smp-haflah-aula.jpg',
    desc: 'Aula representatif sekolah yang luas dan berpendingin udara untuk pertemuan akbar wali murid, prosesi haflah kelulusan, pembekalan santri, serta agenda kebersamaan sekolah.',
  },
  {
    name: 'Ruang Konsultasi & Bimbingan Belajar Personal',
    category: 'Konseling & Akademik',
    image: '/images/smp-kelulusan-konsultasi.jpg',
    desc: 'Ruang tatap muka edukatif yang tenang dan kondusif untuk evaluasi capaian belajar murid, konsultasi raport secara personal antara asatidz dengan orang tua, serta pendampingan adab santri.',
  },
  {
    name: 'Panggung Acara & Apresiasi Prestasi Murid',
    category: 'Panggung Prestasi',
    image: '/images/smp-kelulusan-angkatan-3.jpg',
    desc: 'Sarana panggung pementasan dan apresiasi murid untuk mengasah keberanian public speaking, orasi khitabah dwibahasa (Arab-Inggris), serta seremonial wisuda penghargaan prestasi.',
  },
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
        }));
      }
    }
  } catch (err) {
    console.error('Error fetching SMP facilities from CMS, using default list:', err);
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 font-sans">
      <Navbar schoolSlug="smp" transparentAtTop={false} />

      <main className="flex-1 pt-16 sm:pt-20">
        {/* Compact Header Al-Hidayah Style */}
        <section className="bg-[#030164] text-white py-8 sm:py-10 border-b-4 border-[#ffd51e]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <nav className="flex items-center gap-1.5 text-xs text-blue-200/80 mb-1.5" aria-label="Breadcrumb">
                <Link href="/smp" className="hover:text-[#ffd51e] transition-colors">
                  Beranda SMP IT
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-[#ffd51e]" />
                <span className="text-[#ffd51e] font-semibold">Sarana &amp; Fasilitas</span>
              </nav>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Sarana &amp; Fasilitas Belajar SMP IT Al-Afiyah
              </h1>
            </div>

            <Link
              href="/smp/dokumentasi"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xs bg-[#ffd51e] hover:bg-amber-300 text-[#030164] font-extrabold text-xs transition-colors self-start sm:self-auto shrink-0"
            >
              <span>Lihat Galeri Kegiatan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* Clean 3-Column Facility Photo Cards */}
        <section className="py-10 sm:py-14">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {facilities.map((fac, idx) => (
                <div
                  key={idx}
                  className="rounded-sm overflow-hidden bg-white border border-slate-200 hover:border-[#030164] transition-colors flex flex-col justify-between group"
                >
                  <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden">
                    <Image
                      src={fac.image}
                      alt={fac.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2.5 py-0.5 rounded-xs text-[10px] font-bold bg-[#030164]/90 text-[#ffd51e] uppercase tracking-wider">
                        {fac.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-[#030164] mb-1 leading-snug">
                        {fac.name}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {fac.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <Link
                href="/smp/spmb/daftar"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xs bg-[#030164] hover:bg-[#090580] text-white font-bold text-xs transition-colors"
              >
                <span>Daftar SPMB SMP IT Online</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/smp/kontak"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#030164] hover:text-blue-900"
              >
                <span>Kunjungi Kampus Giri Asih (Peta Lokasi)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer schoolSlug="smp" />
      <StickyMobileBar schoolSlug="smp" />
    </div>
  );
}
