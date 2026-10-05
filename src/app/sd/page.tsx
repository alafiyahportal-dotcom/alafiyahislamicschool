import React from 'react';
import SchoolLandingTemplate, { SchoolData } from '@/components/landing/SchoolLandingTemplate';
import { prisma } from '@/lib/prisma';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SD IT Al-Afiyah Majalengka | Sekolah Dasar Islam Terpadu Unggulan',
  description: 'PPDB SD IT Al-Afiyah Majalengka. Kurikulum terpadu nasional, hafalan tahfidz juz 30 mutqin, pembentukan karakter islami, dan sains modern.',
  icons: {
    icon: [
      { url: '/images/sd-logo.png', type: 'image/png' },
    ],
    shortcut: '/images/sd-logo.png',
    apple: '/images/sd-logo.png',
  },
};

export default async function SdLandingPage() {
  const dbSchool = await prisma.school.findUnique({
    where: { slug: 'sd' },
    include: {
      cmsSections: true,
      teachers: {
        where: { isActive: true },
        orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      },
      newsPosts: {
        where: { isPublished: true },
        orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
        take: 6,
      },
    },
  });

  const sectionsMap: Record<string, any> = {};
  for (const sec of dbSchool?.cmsSections || []) {
    try {
      sectionsMap[sec.sectionKey] = JSON.parse(sec.payload);
    } catch {
      sectionsMap[sec.sectionKey] = sec.payload;
    }
  }

  const heroData = sectionsMap.hero || {};
  const identityData = sectionsMap.identity || sectionsMap.contact || {};

  // Program Unggulan — sesuai poster resmi SPMB T.A. 2027/2028
  const defaultPrograms = [
    {
      title: 'Mendidik dengan Sunnah',
      desc: 'Menggunakan metode Pendidikan Karakter Nabawiyah dan keteladanan sunnah Rasulullah ﷺ.',
      badge: 'Karakter Nabawi',
    },
    {
      title: 'Akhlaq dan Ilmu',
      desc: 'Menanamkan iman sebelum Al-Qur\'an serta adab sebelum ilmu agar berkah dan berakhlak mulia.',
      badge: 'Iman & Adab',
    },
    {
      title: 'Lingkungan Nyaman & Asri',
      desc: 'Suasana sekolah yang bersih, sejuk, rindang, dan membahagiakan anak dalam belajar.',
      badge: 'Ramah Anak',
    },
    {
      title: 'Basic Literasi & Numerasi',
      desc: 'Penguatan fondasi calistung kontekstual, nalar sains, dan logika matematika sejak dini.',
      badge: 'Literasi Numerasi',
    },
    {
      title: 'Outdoor Learning',
      desc: 'Pembelajaran aktif di alam terbuka, sains tanaman di greenhouse bambu, dan observasi kebun sekolah.',
      badge: 'Outdoor Learning',
    },
    {
      title: 'Pelatihan Aqil-Baligh',
      desc: 'Pembinaan agar murid mandiri, terampil, dan beradab dalam menyambut fase aqil-baligh.',
      badge: 'Kemandirian',
    },
    {
      title: 'Pemetaan Potensi Bakat & Skill',
      desc: 'Identifikasi dan pengembangan potensi bakat, skill, dan kemandirian tiap murid.',
      badge: 'Talent Mapping',
    },
    {
      title: 'Tahfidz Qur\'an',
      desc: 'Bimbingan tahsin tartil dan hafalan Al-Qur\'an intensif juz 30 mutqin ramah anak.',
      badge: 'Tahfidz Mutqin',
    },
    {
      title: 'Penumbuhan Karakter Bakat',
      desc: 'Menumbuhkan karakter positif melalui penyaluran minat dan bakat murid secara terarah.',
      badge: 'Karakter Bakat',
    },
    {
      title: 'Pembelajaran Berfokus pada Proses',
      desc: 'Menghargai proses belajar tiap anak, bukan sekadar hasil akhir.',
      badge: 'Proses Belajar',
    },
  ];

  const defaultSdNewsPosts = [
    {
      id: 'sd-news-spmb',
      title: 'Pengumuman Resmi SPMB SD IT Al-Afiyah T.A. 2027/2028: Kuota Terbatas Hanya 2 Rombel',
      slug: 'pengumuman-resmi-spmb-sdit-al-afiyah-2026-2027',
      category: 'Pengumuman',
      excerpt: 'Sistem Penerimaan Murid Baru (SPMB) SD IT Al-Afiyah T.A. 2027/2028 resmi dibuka. Kuota terbatas hanya 2 rombel dengan 10 program unggulan terpadu. Unduh poster dan brosur resmi di sini.',
      content: 'Bismillah, Yayasan Pendidikan Imam Bonjol Majalengka bersama dewan asatidzah SD IT Al-Afiyah mengumumkan pembukaan Sistem Penerimaan Murid Baru (SPMB) Tahun Ajaran 2027/2028.\n\nBukan sekadar tempat belajar, SD IT Al-Afiyah adalah tempat bertumbuh yang mendidik dengan sunnah Rasulullah ﷺ, metode karakter nabawiyah, dan pembiasaan adab sebelum ilmu. Demi menjaga rasio pendampingan yang intensif dan berkualitas, kuota penerimaan murid baru dibatasi HANYA 2 Rombongan Belajar (Rombel).\n\nAyah dan Bunda dapat mengunduh poster/brosur resmi sekolah untuk informasi lengkap, serta melakukan registrasi online melalui portal resmi SPMB Al-Afiyah.',
      coverImage: '/images/sd-spmb-poster.jpg',
      author: 'Panitia SPMB 2027/2028',
      publishedAt: '2026-09-26T09:00:00.000Z',
    },
    {
      id: 'sd-news-field-study',
      title: 'Field Study SD IT Al-Afiyah di P4S An-Nabawiyah: Praktik Pertanian & Perikanan Smart Akhlak Fitrah',
      slug: 'field-study-sd-it-al-afiyah-p4s-an-nabawiyah',
      category: 'Field Study',
      excerpt: 'Puluhan murid SD IT Al-Afiyah mengikuti kegiatan field study di P4S An-Nabawiyah. Murid belajar memindahkan semai bibit sayur ke polybag, observasi greenhouse bambu, dan edukasi budidaya perikanan biofloc.',
      content: 'Alhamdulillah, dalam rangka mewujudkan kurikulum kontekstual berbasis alam dan karakter, murid-murid SD IT Al-Afiyah melaksanakan kegiatan "Field Study: Smart Akhlak Fitrah" bertempat di Pusat Pelatihan Pertanian dan Perdesaan Swadaya (P4S) An-Nabawiyah. Kegiatan edukasi luar kelas ini dirancang untuk mengenalkan fitrah anak terhadap alam semesta dan menumbuhkan rasa syukur atas limpahan rezeki ciptaan Allah Ta\'ala.',
      coverImage: '/images/sd-field-study-banner.jpg',
      author: 'Humas SD IT Al-Afiyah',
      publishedAt: '2026-09-25T08:00:00.000Z',
    },
    {
      id: 'sd-news-futsal',
      title: 'Alhamdulillah! Tim Futsal SD IT Al-Afiyah Raih Juara 2 (Second Place) Tingkat Daerah',
      slug: 'tim-futsal-sd-it-al-afiyah-raih-juara-2',
      category: 'Prestasi',
      excerpt: 'Prestasi membanggakan kembali ditorehkan murid-murid SD IT Al-Afiyah. Tim Futsal sekolah berhasil menyabet gelar Second Place dalam kejuaraan futsal antar-sekolah tingkat daerah.',
      content: 'Keluarga besar SD IT Al-Afiyah bersyukur atas torehan prestasi membanggakan yang diraih oleh Tim Futsal murid SD IT Al-Afiyah. Dalam turnamen kompetisi futsal pelajar tingkat daerah, tim sekolah sukses menembus babak final dan mengamankan posisi Juara 2 (Second Place). Pihak sekolah senantiasa mendukung penuh penyaluran minat dan bakat murid.',
      coverImage: '/images/sd-futsal-champion.jpg',
      author: 'Pembina Olahraga SD IT',
      publishedAt: '2026-09-23T08:00:00.000Z',
    },
    {
      id: 'sd-news-kegiatan-karakter',
      title: 'Pembiasaan Adab Shalat Berjamaah dan Pelatihan Da\'i Cilik SD IT Al-Afiyah',
      slug: 'pembiasaan-shalat-berjamaah-daicilik-sdit-al-afiyah',
      category: 'Kegiatan',
      excerpt: 'Menanamkan adab sebelum ilmu dan iman sebelum Al-Qur\'an, murid SD IT Al-Afiyah dibimbing pembiasaan shalat berjamaah serta latihan muhadharah da\'i cilik berani tampil.',
      content: 'Alhamdulillah, salah satu ruh pendidikan di SD IT Al-Afiyah adalah penguatan karakter nabawiyah dan pembiasaan ibadah praktis sejak dini.\n\nSetiap hari, siswi dan siswa dibimbing melaksanakan shalat berjamaah dengan tertib, bersih, dan khusyuk di lingkungan kelas yang asri. Selain itu, untuk melatih kepemimpinan dan rasa percaya diri, murid-murid bergiliran memegang mikrofon dalam agenda muhadharah (latihan pidato da\'i cilik) serta kultum mandiri menyampaikan nasihat kebaikan kepada rekan sekelasnya.\n\nDengan suasana kelas yang hangat dan penuh kasih sayang ("Here\'s Your Second Home"), SD IT Al-Afiyah terus berkomitmen menjadi tempat bertumbuh terbaik bagi ananda.',
      coverImage: '/images/sd-activity-shalat-berjamaah.jpg',
      author: 'Kesiswaan SD IT Al-Afiyah',
      publishedAt: '2026-09-27T08:00:00.000Z',
    },
    {
      id: 'sd-news-sts',
      title: 'Selamat Melaksanakan Sumatif Tengah Semester (STS) 1 SD IT Al-Afiyah',
      slug: 'sumatif-tengah-semester-1-sdit-al-afiyah',
      category: 'Pengumuman',
      excerpt: 'Pelaksanaan Sumatif Tengah Semester (STS) Semester 1 TP 2026/2027 SD IT Al-Afiyah dimulai dengan menjunjung tinggi nilai kejujuran, ketelitian, dan prinsip Smart Akhlaq Fitrah.',
      content: 'Bismillah, segenap pimpinan Yayasan, kepala sekolah, dan dewan asatidzah mengucapkan selamat melaksanakan Sumatif Tengah Semester (STS) 1 bagi seluruh murid SD IT Al-Afiyah. Kegiatan asesmen ini dirancang sebagai wahana pembentukan karakter murid yang jujur, teliti, mandiri, dan beradab.',
      coverImage: '/images/sts-semester-1-sdit.jpg',
      author: 'Kurikulum SD IT Al-Afiyah',
      publishedAt: '2026-09-20T08:00:00.000Z',
    },
  ];

  const schoolData: SchoolData = {
    slug: 'sd',
    name: identityData.name || dbSchool?.name || 'SD IT Al-Afiyah',
    badgeText: identityData.badgeText || dbSchool?.badgeText || 'SPMB 2027/2028 • KUOTA HANYA 2 ROMBEL',
    tagline: identityData.tagline || dbSchool?.tagline || 'Smart Akhlaq Fitrah • Mencetak Generasi Sholeh Cerdas Mandiri Berwawasan dan Berakhlakul Islami',
    primaryColor: dbSchool?.primaryColor || '#059669',
    accentColor: dbSchool?.accentColor || '#D97706',
    registrationFee: dbSchool?.registrationFee || 250000,
    waCenterPhone: identityData.whatsappNumber || dbSchool?.waCenterPhone || '6281310139001',
    address: identityData.schoolAddress || identityData.address || dbSchool?.address || 'Lingkungan Giri Asih - Jl. Gerakan Koperasi Majalengka Wetan 45411',
    heroHeadline: heroData.headline || 'Bukan Sekadar Tempat Belajar Namun Juga Tempat Bertumbuh',
    heroSubheadline: heroData.subheadline || 'Mencetak Generasi Sholeh Cerdas Mandiri Berwawasan dan Berakhlakul Islami dengan Metode Pendidikan Karakter Nabawiyah.',
    heroImage: heroData.heroImage || '/images/sd-hero-greenhouse.jpg',
    heroSlides: heroData.slides,
    stats: sectionsMap.stats || heroData.stats,
    values: sectionsMap.values,
    programs: sectionsMap.programs || defaultPrograms,
    facilities: sectionsMap.facilities,
    testimonials: sectionsMap.testimonials,
    teachers: dbSchool?.teachers || [],
    newsPosts: (dbSchool?.newsPosts && dbSchool.newsPosts.length > 0) ? dbSchool.newsPosts : defaultSdNewsPosts,
  };

  return <SchoolLandingTemplate school={schoolData} />;
}
