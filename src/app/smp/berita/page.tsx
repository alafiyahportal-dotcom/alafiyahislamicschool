import React from 'react';
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyMobileBar from '@/components/layout/StickyMobileBar';
import NewsListClient, { NewsArticle } from '@/components/news/NewsListClient';
import { Newspaper, ChevronRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Warta, Prestasi & Khazanah SMP IT Al-Afiyah',
  description: 'Berita kegiatan santri, prestasi kejuaraan futsal, capaian tasmi\' tahfidz, dan khazanah artikel remaja SMP IT Al-Afiyah Majalengka.',
  icons: {
    icon: [
      { url: '/images/smp-logo.png', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/images/smp-logo.png',
    apple: '/images/smp-logo.png',
  },
  openGraph: {
    title: 'Warta & Prestasi SMP IT Al-Afiyah Majalengka',
    description: 'Liputan kegiatan, prestasi olahraga dan tahfidz santri SMP IT Al-Afiyah.',
    images: ['/images/smp-spmb-poster.png'],
  },
};

export const revalidate = 60;

const DEFAULT_SMP_ARTICLES: NewsArticle[] = [
  {
    id: 'smp-warta-1',
    title: 'Alhamdulillah! SMP IT Al-Afiyah Resmi Raih Nilai Akreditasi A (Unggul) dari BAN-S/M',
    slug: 'smp-it-al-afiyah-raih-akreditasi-a',
    category: 'Akademik',
    excerpt: 'Prestasi membanggakan bagi seluruh civitas akademika. Standar mutu pembelajaran, sarana ber-AC, dan pembinaan tahfidz resmi diakui dengan predikat A Unggul.',
    author: 'Humas SMP IT Al-Afiyah',
    date: '6 Okt 2026',
    schoolName: 'SMP IT Al-Afiyah',
    readingTime: '3 menit baca',
    imageUrl: '/images/smp-spmb-poster.png',
  },
  {
    id: 'smp-warta-2',
    title: 'Petualangan Seru River Tubing Cikadongdong: Membangun Ukhuwah & Ketangkasan Remaja',
    slug: 'rihlah-river-tubing-cikadongdong-smp-it',
    category: 'Kegiatan',
    excerpt: 'Santri diajak bertadabbur alam menaklukkan arus sungai Cikadongdong. Melatih keberanian, kerja sama tim, dan kepedulian terhadap kelestarian lingkungan.',
    author: 'Kordinator Kesiswaan',
    date: '2 Okt 2026',
    schoolName: 'SMP IT Al-Afiyah',
    readingTime: '4 menit baca',
    imageUrl: '/images/smp-tubing-1.jpg',
  },
  {
    id: 'smp-warta-3',
    title: 'Ujian Tasmi\' 3 Juz Sekali Duduk: Santri Buktikan Hafalan Qur\'an Mutqin & Tartil',
    slug: 'ujian-tasmi-3-juz-mutqin-smp-it',
    category: 'Tahfidz',
    excerpt: 'Sesi tasmi\' akbar dihadiri oleh dewan asatidz dan para orang tua santri. Capaian hafalan mutqin menjadi bukti kesungguhan bimbingan Al-Qur\'an setiap pagi.',
    author: 'Kordinator Tahfidz',
    date: '25 Sep 2026',
    schoolName: 'SMP IT Al-Afiyah',
    readingTime: '5 menit baca',
    imageUrl: '/images/smp-outing-3.jpg',
  },
  {
    id: 'smp-warta-4',
    title: 'Tim Futsal SMP IT Al-Afiyah Tampil Memukau di Kejuaraan Pelajar Kabupaten Majalengka',
    slug: 'prestasi-futsal-development-program-smp-it',
    category: 'Prestasi',
    excerpt: 'Program pembinaan Futsal Development Program membuahkan hasil. Tim futsal sekolah meraih trofi dan menjunjung tinggi sportivitas di lapangan.',
    author: 'Pelatih Olahraga',
    date: '18 Sep 2026',
    schoolName: 'SMP IT Al-Afiyah',
    readingTime: '3 menit baca',
    imageUrl: '/images/smp-hero-pesantren.jpg',
  }
];

export default async function SmpBeritaPage() {
  let articles: NewsArticle[] = DEFAULT_SMP_ARTICLES;

  try {
    const dbPosts = await prisma.newsPost.findMany({
      where: {
        school: { slug: 'smp' },
        isPublished: true,
      },
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      take: 12,
    });

    if (dbPosts && dbPosts.length > 0) {
      articles = dbPosts.map((post) => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        category: post.category || 'Berita',
        excerpt: post.excerpt,
        content: post.content,
        author: post.author || 'Humas SMP IT',
        date: new Date(post.publishedAt).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        schoolName: 'SMP IT Al-Afiyah',
        readingTime: '3 menit baca',
        imageUrl: post.coverImage || '/images/smp-spmb-poster.png',
      }));
    }
  } catch (err) {
    console.error('Error fetching SMP news from DB:', err);
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-[#ffd51e] selection:text-[#030164]">
      <Navbar schoolSlug="smp" />

      {/* Hero Header */}
      <section className="bg-gradient-to-br from-[#030164] via-[#090580] to-[#01003d] text-white pt-24 sm:pt-28 pb-16 sm:pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffd51e_1.5px,transparent_1.5px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#ffd51e]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <nav className="flex items-center gap-1.5 text-xs text-blue-200/90 mb-5" aria-label="Breadcrumb">
            <Link href="/smp" className="hover:text-white transition-colors inline-flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Beranda SMP IT</span>
            </Link>
            <ChevronRight className="w-3 h-3 text-blue-300/50" />
            <span className="text-[#ffd51e] font-semibold">Warta &amp; Berita</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-[#ffd51e]/40 text-[#ffd51e] text-xs font-bold tracking-wider uppercase mb-4 backdrop-blur-xs">
              <Newspaper className="w-3.5 h-3.5" />
              <span>KABAR TERKINI, PRESTASI &amp; ARTIKEL</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Warta &amp; Prestasi SMP IT Al-Afiyah
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-200 leading-relaxed font-normal">
              Ikuti kabar kegiatan santri, prestasi kejuaraan, liputan outing class, dan informasi resmi dari kampus SMP IT Al-Afiyah Majalengka.
            </p>
          </div>
        </div>
      </section>

      {/* News Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <NewsListClient initialArticles={articles} />
      </main>

      <Footer schoolSlug="smp" />
      <StickyMobileBar schoolSlug="smp" />
    </div>
  );
}
