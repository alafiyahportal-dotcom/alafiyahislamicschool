import React from 'react';
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyMobileBar from '@/components/layout/StickyMobileBar';
import NewsListClient, { NewsArticle } from '@/components/news/NewsListClient';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import {
  parseNewsMedia,
  DEFAULT_NEWS_CATEGORIES,
  mergeUniqueStrings,
  externalizeNewsPostMedia,
} from '@/lib/news-media';

export const metadata: Metadata = {
  title: 'Berita & Kegiatan | SMP IT Al-Afiyah Majalengka',
  description:
    'Berita kegiatan murid, haflah kelulusan, capaian tasmi\' tahfidz, rihlah river tubing, dan pengumuman resmi SMP IT Al-Afiyah Majalengka.',
  icons: {
    icon: [
      { url: '/images/smp-icon-192.png', type: 'image/png' },
      { url: '/smp-favicon.ico', sizes: 'any' },
    ],
    shortcut: '/images/smp-icon-192.png',
    apple: '/images/smp-icon-192.png',
  },
};

export const revalidate = 30;

const DEFAULT_SMP_ARTICLES: NewsArticle[] = [
  {
    id: 'smp-kegiatan-haflah',
    title: 'Haflah Kelulusan & Kenaikan Kelas SMP IT Al-Afiyah Angkatan ke-3: Melangkah Pasti Meraih Prestasi',
    slug: 'haflah-kelulusan-angkatan-3-smp-it-al-afiyah',
    category: 'Kegiatan',
    excerpt:
      'Momen khidmat pelepasan santri angkatan ke-3 SMP IT Al-Afiyah Majalengka bertema Melangkah Pasti Meraih Prestasi, Berakhlak Islami, Siap Berkompetisi — Be Smart & Religious.',
    author: 'Humas SMP IT Al-Afiyah',
    date: '22 Jun 2026',
    schoolName: 'SMP IT Al-Afiyah',
    readingTime: '4 menit baca',
    imageUrl: '/images/smp-kelulusan-angkatan-3.jpg',
    paragraphs: [
      'Alhamdulillah, prosesi Haflah Kelulusan dan Kenaikan Kelas SMP IT Al-Afiyah Majalengka Angkatan ke-3 berlangsung khidmat dan penuh haru di Aula Utama sekolah.',
      'Acara dihadiri oleh Ketua Yayasan Pendidikan Imam Bonjol, Kepala Sekolah Ust. Jaja Madhuri, S.Pd., M.Pd., jajaran dewan asatidz, serta seluruh orang tua/wali santri yang turut menyaksikan penyematan penghargaan tahfidz dan prestasi akademik.',
    ],
    keyHighlights: [
      'Haflah Kelulusan Angkatan ke-3 SMP IT Al-Afiyah Majalengka',
      'Penyematan penghargaan capaian Tahfidz Al-Qur’an 3–5+ Juz',
      'Komitmen mencetak generasi Be Smart & Religious',
    ],
  },
  {
    id: 'smp-tahfidz-1',
    title: "Ujian Tasmi' 3 Juz Sekali Duduk & Evaluasi Mutaba'ah Digital Santri",
    slug: 'ujian-tasmi-3-juz-mutqin-smp-it',
    category: 'Tahfidz',
    excerpt:
      "Sesi tasmi' akbar dihadiri oleh dewan asatidz dan para orang tua murid. Capaian hafalan mutqin menjadi bukti kesungguhan bimbingan Al-Qur'an setiap pagi.",
    author: 'Koordinator Tahfidz SMP IT',
    date: '25 Sep 2026',
    schoolName: 'SMP IT Al-Afiyah',
    readingTime: '4 menit baca',
    imageUrl: '/images/smp-tasmi-mutabaah-digital.jpg',
    paragraphs: [
      'Suasana haru dan khidmat menyelimuti masjid SMP IT Al-Afiyah saat para santri melantunkan ayat-ayat suci Al-Qur’an dalam ujian tasmi’ sekali duduk tanpa membuka mushaf.',
      'Orang tua santri yang hadir turut menyimak dan menyaksikan buah hati mereka mampu menjaga kalam Ilahi di usia remaja.',
    ],
    keyHighlights: [
      'Ujian tasmi’ hafalan 1 juz hingga 3 juz sekali duduk',
      'Bimbingan talaqqi rutin setiap pagi di Masjid SMP IT',
      'Pemantauan ibadah harian terintegrasi lewat Mutaba’ah Digital',
    ],
  },
  {
    id: 'smp-kegiatan-1',
    title: 'Petualangan Seru River Tubing Cikadongdong: Membangun Ukhuwah & Ketangkasan Remaja',
    slug: 'rihlah-river-tubing-cikadongdong-smp-it',
    category: 'Outing Class',
    excerpt:
      'Murid diajak bertadabbur alam menaklukkan arus sungai Cikadongdong. Melatih keberanian, kerja sama tim, dan kepedulian terhadap kelestarian lingkungan.',
    author: 'Koordinator Kesiswaan',
    date: '2 Okt 2026',
    schoolName: 'SMP IT Al-Afiyah',
    readingTime: '4 menit baca',
    imageUrl: '/images/smp-tubing-1.jpg',
    paragraphs: [
      'Kegiatan tahunan tadabbur alam dan rihlah santri SMP IT Al-Afiyah diselenggarakan di wisata sungai Cikadongdong Majalengka. Santri diajak mempraktikkan doa safar, dzikir alam, dan ketangkasan fisik menyusuri arus air dengan pengawasan instruktur profesional.',
      'Suasana riang dan penuh keakraban tampak di wajah para murid. Kegiatan ini sekaligus mempererat ukhuwah islamiyah antarmurid dan para guru pembina sekolah.',
    ],
    keyHighlights: [
      'Pelatihan kepemimpinan dan ketangkasan alam terbuka',
      'Penguatan adab safar dan tadabbur ciptaan Allah Ta’ala',
      'Standar keselamatan lengkap dengan pelampung dan instruktur terlatih',
    ],
  },
  {
    id: 'smp-pengumuman-1',
    title: 'Alhamdulillah! SMP IT Al-Afiyah Resmi Raih Nilai Akreditasi A (SK No. 012/BAN-PDM/SK/2025)',
    slug: 'smp-it-al-afiyah-raih-akreditasi-a',
    category: 'Pengumuman',
    excerpt:
      'Standar mutu pembelajaran, sarana ber-AC, dan pembinaan tahfidz SMP IT Al-Afiyah resmi diakui dengan predikat A Unggul (SK No. 012/BAN-PDM/SK/2025).',
    author: 'Humas SMP IT Al-Afiyah',
    date: '3 Okt 2026',
    schoolName: 'SMP IT Al-Afiyah',
    readingTime: '3 menit baca',
    imageUrl: '/images/smp-spmb-poster.png',
    paragraphs: [
      'Berdasarkan Surat Keputusan resmi No. 012/BAN-PDM/SK/2025 dari Badan Akreditasi Nasional (BAN-PDM), SMP IT Al-Afiyah Majalengka resmi memperoleh predikat Akreditasi A (Unggul).',
      'Pencapaian ini mencerminkan komitmen yayasan dan sekolah dalam menyediakan kurikulum berkualitas, asatidz berkualifikasi, lingkungan belajar kondusif, dan sistem monitoring karakter modern.',
    ],
    keyHighlights: [
      'Akreditasi A Unggul resmi SK No. 012/BAN-PDM/SK/2025 (BAN-PDM)',
      'Legalitas lengkap dan terverifikasi',
      'Diskon Uang Bangunan 70% (SDIT) & 50% (Umum) di SPMB Gelombang 1',
    ],
  },
];

export default async function SmpBeritaPage() {
  let articles: NewsArticle[] = [...DEFAULT_SMP_ARTICLES];
  let newsCategories: string[] = DEFAULT_NEWS_CATEGORIES;

  try {
    const [smpSchool, dbPosts, dbAchievements] = await Promise.all([
      prisma.school.findUnique({
        where: { slug: 'smp' },
        include: {
          cmsSections: {
            where: { sectionKey: 'news_config' },
          },
        },
      }),
      prisma.newsPost.findMany({
        where: {
          school: { slug: 'smp' },
          isPublished: true,
        },
        orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
        take: 40,
      }),
      prisma.studentAchievement.findMany({
        where: {
          school: { slug: 'smp' },
        },
        orderBy: [{ createdAt: 'desc' }],
      }),
    ]);

    if (smpSchool) {
      let savedCategories: string[] = DEFAULT_NEWS_CATEGORIES;
      const cfgSec = smpSchool.cmsSections?.[0];
      if (cfgSec?.payload) {
        try {
          const parsedCfg = JSON.parse(cfgSec.payload);
          if (Array.isArray(parsedCfg.categories) && parsedCfg.categories.length > 0) {
            savedCategories = parsedCfg.categories;
          }
        } catch {}
      }
      const postCategories = (dbPosts || []).map((p) => (p.category || '').trim()).filter(Boolean);
      newsCategories = mergeUniqueStrings(savedCategories, postCategories);
    }

    const postArticles: NewsArticle[] =
      dbPosts && dbPosts.length > 0
        ? dbPosts.map((rawPost) => {
            const post = externalizeNewsPostMedia(rawPost);
            const parsed = parseNewsMedia(post.content, post.coverImage);
            return {
              id: post.id,
              title: post.title,
              slug: post.slug,
              category: post.category || 'Kegiatan',
              excerpt: post.excerpt || parsed.cleanContent.slice(0, 150) + '...',
              mediaItems: parsed.allMedia,
              paragraphs: parsed.cleanContent
                ? parsed.cleanContent.split('\n').filter((l: string) => l.trim().length > 0)
                : undefined,
              author: post.author || 'Humas SMP IT',
              date: new Date(post.publishedAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              }),
              schoolName: 'SMP IT Al-Afiyah',
              readingTime: '3 menit baca',
              imageUrl: post.coverImage || '/images/smp-kelulusan-angkatan-3.jpg',
            };
          })
        : DEFAULT_SMP_ARTICLES;

    const rankLabelMap: Record<string, string> = {
      JUARA_1: 'Juara 1 (Emas)',
      JUARA_2: 'Juara 2 (Perak)',
      JUARA_3: 'Juara 3 (Perunggu)',
      HARAPAN_1: 'Juara Harapan 1',
      HARAPAN_2: 'Juara Harapan 2',
      HARAPAN_3: 'Juara Harapan 3',
      FAVORIT: 'Juara Favorit',
      FINALIS: 'Finalis',
    };

    const achievementArticles: NewsArticle[] = (dbAchievements || []).map((ach) => {
      const rankLabel = rankLabelMap[ach.rank] || ach.rank || 'Prestasi Gemilang';
      return {
        id: `ach-${ach.id}`,
        title: `Prestasi Santri: ${ach.studentName} Raih ${rankLabel} ${ach.title}`,
        slug: `prestasi-${ach.id}`,
        category: 'Prestasi',
        excerpt:
          ach.description ||
          `${ach.studentName} berhasil menorehkan prestasi membanggakan sebagai ${rankLabel} dalam ajang ${ach.title} (${ach.level}, Tahun ${ach.year}).`,
        author: 'Tim Prestasi & Kesiswaan SMP IT',
        date: `${ach.year}`,
        schoolName: 'SMP IT Al-Afiyah',
        readingTime: '2 menit baca',
        imageUrl: ach.imageUrl || '/images/smp-kelulusan-angkatan-3.jpg',
        paragraphs: [
          `Alhamdulillah, kabar membanggakan datang dari santri SMP IT Al-Afiyah. Ananda ${ach.studentName} berhasil meraih torehan gemilang sebagai ${rankLabel} pada kejuaraan ${ach.title}.`,
          ach.description
            ? `${ach.description}. Prestasi ini diraih berkat kedisiplinan belajar, ketekunan berlatih, serta bimbingan intensif dari para asatidz pembina di lingkungan sekolah.`
            : `Pencapaian di tingkat ${ach.level} ini merupakan bukti nyata komitmen pembinaan karakter, adab, dan keunggulan potensi santri di SMP IT Al-Afiyah.`,
        ],
        keyHighlights: [
          `Nama Santri: ${ach.studentName}`,
          `Capaian: ${rankLabel} (${ach.level})`,
          `Tahun: ${ach.year}`,
          `Kategori: ${ach.category}`,
        ],
      };
    });

    articles = [...postArticles, ...achievementArticles];
  } catch (err) {
    console.error('Error fetching SMP news from DB:', err);
    articles = DEFAULT_SMP_ARTICLES;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 font-sans">
      <Navbar schoolSlug="smp" transparentAtTop={false} />

      <main className="flex-1 pt-16 sm:pt-20">
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
              <span className="text-[#ffd51e] font-semibold">Berita &amp; Kegiatan</span>
            </nav>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Berita &amp; Kegiatan SMP IT Al-Afiyah
            </h1>
          </div>
        </section>

        {/* Main Container */}
        <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <NewsListClient
            initialArticles={articles}
            schoolSlug="smp"
            initialCategories={newsCategories}
          />
        </div>
      </main>

      <Footer schoolSlug="smp" />
      <StickyMobileBar schoolSlug="smp" />
    </div>
  );
}
