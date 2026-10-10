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
  description: 'Berita kegiatan murid, prestasi kejuaraan futsal, capaian tasmi\' tahfidz, dan khazanah artikel remaja SMP IT Al-Afiyah Majalengka.',
  icons: {
    icon: [
      { url: '/images/smp-icon-192.png', type: 'image/png' },
      { url: '/smp-favicon.ico', sizes: 'any' },
    ],
    shortcut: '/images/smp-icon-192.png',
    apple: '/images/smp-icon-192.png',
  },
  openGraph: {
    title: 'Warta & Prestasi SMP IT Al-Afiyah Majalengka',
    description: 'Liputan kegiatan, prestasi olahraga dan tahfidz murid SMP IT Al-Afiyah.',
    images: ['/images/smp-spmb-poster.png'],
  },
};

export const revalidate = 60;

const DEFAULT_SMP_ARTICLES: NewsArticle[] = [
  {
    id: 'smp-prestasi-1',
    title: 'Tim Futsal SMP IT Al-Afiyah Raih Juara & Trofi Kejuaraan Pelajar Kabupaten Majalengka',
    slug: 'prestasi-futsal-development-program-smp-it',
    category: 'Prestasi',
    excerpt: 'Program pembinaan Futsal Development Program membuahkan hasil membanggakan. Tim futsal sekolah sukses meraih trofi dan menjunjung tinggi sportivitas di lapangan.',
    author: 'Pelatih & Pembina Futsal',
    date: '8 Okt 2026',
    schoolName: 'SMP IT Al-Afiyah',
    readingTime: '3 menit baca',
    imageUrl: '/images/smp-hero-pesantren.jpg',
    paragraphs: [
      'Alhamdulillah, tim futsal SMP IT Al-Afiyah berhasil menorehkan prestasi gemilang pada turnamen pelajar tingkat Kabupaten Majalengka. Melalui perjuangan gigih dan kekompakan tim, santri berhasil membawa pulang trofi kejuaraan.',
      'Kepala SMP IT Al-Afiyah menyampaikan rasa syukur dan bangga atas kerja keras para pemain serta pelatih. Prestasi ini membuktikan bahwa pendidikan Islam terpadu mampu mencetak generasi yang seimbang antara ketajaman hafalan Qur’an, ketangguhan fisik, dan akhlak sportivitas.'
    ],
    keyHighlights: [
      'Meraih trofi juara turnamen futsal pelajar tingkat kabupaten',
      'Didukung fasilitas lapangan futsal berstandar di lingkungan kampus',
      'Mengedepankan akhlak sportivitas dan adab islami di dalam dan luar lapangan'
    ]
  },
  {
    id: 'smp-kajian-1',
    title: 'Menjaga Fitrah & Karakter Remaja Islami: Menjawab Tantangan Gadget di Era Digital',
    slug: 'kajian-karakter-remaja-fitrah-gadget-smp-it',
    category: 'Kajian Islam',
    excerpt: 'Kajian parenting dan adab remaja bersama dewan asatidz mengupas kiat mendampingi generasi Z agar bijak berteknologi dan istiqamah dalam shalat serta tilawah.',
    author: 'Dewan Asatidz SMP IT',
    date: '5 Okt 2026',
    schoolName: 'SMP IT Al-Afiyah',
    readingTime: '4 menit baca',
    imageUrl: '/images/smp-spmb-poster.png',
    paragraphs: [
      'Masa remaja (aqil baligh) merupakan fase emas pembentukan identitas diri seorang muslim. Di era gempuran media sosial dan gadget saat ini, benteng terkuat yang harus ditanamkan adalah tauhid, muraqabatullah (merasa diawasi Allah), dan kebiasaan adab nabawiyah.',
      'Melalui program Student Character Development (SCD) dan bimbingan wali kelas, SMP IT Al-Afiyah mendidik para santri agar menjadikan teknologi sebagai sarana dakwah dan belajar, bukan pelarian yang melalaikan dari kewajiban ibadah.'
    ],
    keyHighlights: [
      'Pentingnya pendampingan orang tua dalam penggunaan gawai di rumah',
      'Integrasi buku pantau mutaba’ah ibadah harian santri',
      'Pendidikan adab pergaulan dan batasan syar’i usia remaja'
    ]
  },
  {
    id: 'smp-pengumuman-1',
    title: 'Alhamdulillah! SMP IT Al-Afiyah Resmi Raih Nilai Akreditasi A (Unggul) dari BAN-S/M',
    slug: 'smp-it-al-afiyah-raih-akreditasi-a',
    category: 'Pengumuman',
    excerpt: 'Prestasi membanggakan bagi seluruh civitas akademika. Standar mutu pembelajaran, sarana ber-AC, dan pembinaan tahfidz resmi diakui dengan predikat A Unggul.',
    author: 'Humas SMP IT Al-Afiyah',
    date: '3 Okt 2026',
    schoolName: 'SMP IT Al-Afiyah',
    readingTime: '3 menit baca',
    imageUrl: '/images/smp-spmb-biaya.png',
    paragraphs: [
      'Berdasarkan Surat Keputusan resmi Badan Akreditasi Nasional Sekolah/Madrasah (BAN-S/M), SMP IT Al-Afiyah Majalengka resmi memperoleh predikat Akreditasi A (Unggul).',
      'Pencapaian ini mencerminkan komitmen yayasan dan sekolah dalam menyediakan kurikulum berkualitas, asatidz berkualifikasi, lingkungan belajar kondusif, dan sistem monitoring karakter modern.'
    ],
    keyHighlights: [
      'Akreditasi A Unggul resmi dari BAN-S/M',
      'Legalitas lengkap dan terverifikasi di Kemendikbudristek',
      'Komitmen peningkatan mutu berkelanjutan menyambut T.A. 2027/2028'
    ]
  },
  {
    id: 'smp-kegiatan-1',
    title: 'Petualangan Seru River Tubing Cikadongdong: Membangun Ukhuwah & Ketangkasan Remaja',
    slug: 'rihlah-river-tubing-cikadongdong-smp-it',
    category: 'Kabar Sekolah',
    excerpt: 'Murid diajak bertadabbur alam menaklukkan arus sungai Cikadongdong. Melatih keberanian, kerja sama tim, dan kepedulian terhadap kelestarian lingkungan.',
    author: 'Kordinator Kesiswaan',
    date: '2 Okt 2026',
    schoolName: 'SMP IT Al-Afiyah',
    readingTime: '4 menit baca',
    imageUrl: '/images/smp-tubing-1.jpg',
    paragraphs: [
      'Kegiatan tahunan tadabbur alam dan rihlah santri SMP IT Al-Afiyah diselenggarakan di wisata sungai Cikadongdong Majalengka. Santri diajak mempraktikkan doa safar, dzikir alam, dan ketangkasan fisik menyusuri arus air dengan pengawasan instruktur profesional.',
      'Suasana riang dan penuh keakraban tampak di wajah para santri. Kegiatan ini sekaligus mempererat ukhuwah islamiyah antar santri dan para pembina asrama/sekolah.'
    ],
    keyHighlights: [
      'Pelatihan kepemimpinan dan ketangkasan alam terbuka',
      'Penguatan adab safar dan tadabbur ciptaan Allah Ta’ala',
      'Standar keselamatan lengkap dengan pelampung dan instruktur terlatih'
    ]
  },
  {
    id: 'smp-tahfidz-1',
    title: 'Ujian Tasmi\' 3 Juz Sekali Duduk: Santri Buktikan Hafalan Qur\'an Mutqin & Tartil',
    slug: 'ujian-tasmi-3-juz-mutqin-smp-it',
    category: 'Tahfidz',
    excerpt: 'Sesi tasmi\' akbar dihadiri oleh dewan asatidz dan para orang tua murid. Capaian hafalan mutqin menjadi bukti kesungguhan bimbingan Al-Qur\'an setiap pagi.',
    author: 'Kordinator Tahfidz',
    date: '25 Sep 2026',
    schoolName: 'SMP IT Al-Afiyah',
    readingTime: '5 menit baca',
    imageUrl: '/images/smp-outing-3.jpg',
    paragraphs: [
      'Suasana haru dan khidmat menyelimuti masjid SMP IT Al-Afiyah saat para santri melantunkan ayat-ayat suci Al-Qur’an dalam ujian tasmi’ sekali duduk tanpa membuka mushaf.',
      'Orang tua santri yang hadir turut menyimak dan meneteskan air mata bahagia menyaksikan buah hati mereka mampu menjaga kalam Ilahi di usia muda.'
    ],
    keyHighlights: [
      'Ujian tasmi’ hafalan 1 juz hingga 3 juz sekali duduk',
      'Bimbingan talaqqi bersanad oleh para penghafal Al-Qur’an 30 Juz',
      'Pemberian syahadah tahfidz resmi bagi santri yang lulus ujian'
    ]
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
        category: post.category || 'Kabar Sekolah',
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
            <span className="text-[#ffd51e] font-semibold">Warta &amp; Berita</span>
          </nav>

          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#ffd51e] mb-3">
              <span className="w-6 h-[2px] bg-[#ffd51e] rounded-full inline-block" />
              <span>Kabar Terkini, Prestasi &amp; Artikel</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Warta &amp; Prestasi SMP IT Al-Afiyah
            </h1>

            <p className="mt-3 sm:mt-4 text-sm sm:text-lg text-slate-200 leading-relaxed font-normal">
              Ikuti kabar kegiatan santri, prestasi kejuaraan, liputan outing class, dan informasi resmi dari SMP IT Al-Afiyah Majalengka.
            </p>
          </div>
        </div>
      </section>

      {/* News Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 pb-28 sm:pb-24 w-full">
        <NewsListClient initialArticles={articles} schoolSlug="smp" />
      </main>

      <Footer schoolSlug="smp" />
      <StickyMobileBar schoolSlug="smp" />
    </div>
  );
}
