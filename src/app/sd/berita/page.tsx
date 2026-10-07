import React from 'react';
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyMobileBar from '@/components/layout/StickyMobileBar';
import NewsListClient, { NewsArticle } from '@/components/news/NewsListClient';
import { Newspaper, ChevronRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ScrollReveal from '@/components/landing/ScrollReveal';

export const metadata: Metadata = {
  title: 'Warta, Prestasi & Khazanah SD IT Al-Afiyah Majalengka',
  description: 'Berita kegiatan belajar mengajar, prestasi kejuaraan murid, agenda sekolah, dan khazanah artikel Islami SD IT Al-Afiyah Majalengka.',
  icons: {
    icon: [
      { url: '/images/sd-logo.png', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/images/sd-logo.png',
    apple: '/images/sd-logo.png',
  },
};

const DEFAULT_SD_ARTICLES: NewsArticle[] = [
  {
    id: 'sd-warta-1',
    title: 'Kemeriahan Market Day & Cooking Day: Melatih Jiwa Kewirausahaan Islami Murid SD IT',
    slug: 'market-day-cooking-day-sdit-al-afiyah',
    category: 'Kegiatan',
    excerpt: 'Murid SD IT Al-Afiyah belajar adab bermuamalah, kejujuran dalam berdagang, dan melatih kemandirian finansial sejak dini melalui simulasi pasar syariah.',
    author: 'Humas SD IT Al-Afiyah',
    date: '4 Okt 2026',
    schoolName: 'SD IT Al-Afiyah',
    readingTime: '3 menit baca',
    imageUrl: '/images/hero-building.jpg',
  },
  {
    id: 'sd-warta-2',
    title: 'Alhamdulillah! Tiga Murid SD IT Al-Afiyah Raih Juara MHQ Juz 30 Tingkat Kabupaten',
    slug: 'juara-mhq-juz-30-kabupaten-majalengka',
    category: 'Prestasi',
    excerpt: 'Prestasi membanggakan kembali ditorehkan ananda dalam ajang Musabaqah Hifdzil Qur’an. Berkat bimbingan intensif dan muraja’ah berkala.',
    author: 'Kordinator Tahfidz SD IT',
    date: '28 Sep 2026',
    schoolName: 'SD IT Al-Afiyah',
    readingTime: '4 menit baca',
    imageUrl: '/images/students-learning.jpg',
  },
  {
    id: 'sd-warta-3',
    title: 'Field Study & Observasi Alam: Mengenal Ciptaan Allah di Kebun Edukasi Majalengka',
    slug: 'field-study-alam-sdit-al-afiyah',
    category: 'Kegiatan',
    excerpt: 'Pendidikan tidak hanya di dalam kelas. Murid-murid kelas 2 dan 3 diajak bertadabbur alam memahami ekosistem tumbuhan dan sains terpadu.',
    author: 'Wali Kelas 3 SD IT',
    date: '15 Sep 2026',
    schoolName: 'SD IT Al-Afiyah',
    readingTime: '5 menit baca',
    imageUrl: '/images/school-gate.jpg',
  },
  {
    id: 'sd-warta-4',
    title: 'Adab Penuntut Ilmu: Menghormati Guru dan Menjaga Kesucian Majelis Belajar',
    slug: 'adab-penuntut-ilmu-sdit',
    category: 'Artikel & Kajian',
    excerpt: 'Imam Malik rahimahullah berkata: "Pelajarilah adab sebelum engkau mempelajari ilmu." Mengapa penanaman adab menjadi prioritas utama di SD IT Al-Afiyah.',
    author: 'Tim Bina Karakter SD IT',
    date: '5 Sep 2026',
    schoolName: 'SD IT Al-Afiyah',
    readingTime: '6 menit baca',
    imageUrl: '/images/hero-building.jpg',
  }
];

export const revalidate = 60;

export default async function SdNewsPage() {
  let articles: NewsArticle[] = [];

  try {
    const dbPosts = await prisma.newsPost.findMany({
      where: { 
        isPublished: true,
        school: { slug: 'sd' },
      },
      orderBy: { publishedAt: 'desc' },
      include: { school: true },
      take: 20,
    });

    if (dbPosts && dbPosts.length > 0) {
      articles = dbPosts.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        category: p.category || 'Kegiatan',
        excerpt: p.excerpt || p.content.slice(0, 150) + '...',
        author: p.author || 'Humas SD IT Al-Afiyah',
        date: new Date(p.publishedAt).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        schoolName: 'SD IT Al-Afiyah',
        readingTime: '4 menit baca',
        imageUrl: p.coverImage || undefined,
        paragraphs: p.content ? p.content.split('\n').filter((l: string) => l.trim().length > 0) : undefined,
      }));
    }
  } catch (err) {
    console.error('Error fetching SD news:', err);
  }

  if (articles.length === 0) {
    articles = DEFAULT_SD_ARTICLES;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-800 font-sans selection:bg-[#00A651]/20 selection:text-[#00A651]">
      <Navbar schoolSlug="sd" />

      {/* Hero Header Khusus SD IT */}
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
            <span className="text-white font-medium">Berita &amp; Artikel</span>
          </nav>

          <div className="max-w-3xl">
            <div className="text-xs font-bold text-emerald-200 uppercase tracking-widest inline-flex items-center gap-1.5 mb-3">
              <Newspaper className="w-3.5 h-3.5 text-emerald-300" />
              <span>WARTA &amp; KHAZANAH ISLAM</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Warta, Prestasi &amp; Khazanah SD IT
            </h1>

            <p className="mt-3.5 text-xs sm:text-sm lg:text-base text-emerald-100/90 leading-relaxed font-normal">
              Dinamika belajar murid, dokumentasi kegiatan luar kelas, torehan prestasi kejuaraan, serta mutiara faedah keislaman keluarga besar SD IT Al-Afiyah.
            </p>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 -mt-6 relative z-20">
        <ScrollReveal yOffset={24} duration={500}>
          <NewsListClient initialArticles={articles} />
        </ScrollReveal>
      </main>

      <Footer schoolSlug="sd" />
      <StickyMobileBar schoolSlug="sd" />
    </div>
  );
}
