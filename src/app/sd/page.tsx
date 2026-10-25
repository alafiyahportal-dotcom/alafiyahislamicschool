import React from 'react';
import SchoolLandingTemplate, { SchoolData, TeacherData } from '@/components/landing/SchoolLandingTemplate';
import WelcomeVideoModal from '@/components/landing/WelcomeVideoModal';
import { prisma } from '@/lib/prisma';
import type { Metadata } from 'next';
import { SD_OG_IMAGE } from '@/lib/og-images';

export const metadata: Metadata = {
  title: 'SDIT Al-Afiyah Majalengka | Sekolah Dasar Islam Terpadu Unggulan',
  description: 'PPDB SDIT Al-Afiyah Majalengka. Kurikulum terpadu nasional, hafalan tahfidz juz 30 mutqin, pembentukan karakter islami, dan sains modern.',
  openGraph: {
    title: 'SDIT Al-Afiyah Majalengka | Sekolah Dasar Islam Terpadu Unggulan',
    description: 'PPDB SDIT Al-Afiyah Majalengka. Kurikulum terpadu nasional, hafalan tahfidz juz 30 mutqin, pembentukan karakter islami, dan sains modern.',
    siteName: 'SDIT Al-Afiyah',
    locale: 'id_ID',
    type: 'website',
    images: [SD_OG_IMAGE],
  },
};

export const revalidate = 60;

export default async function SdLandingPage() {
  let dbSchool = null;
  let achievements: any[] = [];
  try {
    const [schoolData, achList] = await Promise.all([
      prisma.school.findUnique({
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
      }),
      prisma.studentAchievement.findMany({
        where: { school: { slug: 'sd' } },
        include: {
          school: {
            select: {
              slug: true,
              name: true,
              primaryColor: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);
    dbSchool = schoolData;
    achievements = achList;
  } catch (err) {
    console.error('Error fetching SD school data, falling back to static content:', err);
  }

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
      title: 'Akhlak dan Ilmu',
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
      title: 'Pengumuman Resmi SPMB SDIT Al-Afiyah T.A. 2027/2028: Kuota Terbatas Hanya 2 Rombel',
      slug: 'pengumuman-resmi-spmb-sdit-al-afiyah-2026-2027',
      category: 'Pengumuman',
      excerpt: 'Sistem Penerimaan Murid Baru (SPMB) SDIT Al-Afiyah T.A. 2027/2028 resmi dibuka. Kuota terbatas hanya 2 rombel dengan 10 program unggulan terpadu. Unduh poster dan brosur resmi di sini.',
      content: 'Bismillah, Yayasan Pendidikan Imam Bonjol Majalengka bersama dewan asatidzah SDIT Al-Afiyah mengumumkan pembukaan Sistem Penerimaan Murid Baru (SPMB) Tahun Ajaran 2027/2028.\n\nBukan sekadar tempat belajar, SDIT Al-Afiyah adalah tempat bertumbuh yang mendidik dengan sunnah Rasulullah ﷺ, metode karakter nabawiyah, dan pembiasaan adab sebelum ilmu. Demi menjaga rasio pendampingan yang intensif dan berkualitas, kuota penerimaan murid baru dibatasi HANYA 2 Rombongan Belajar (Rombel).\n\nAyah dan Bunda dapat mengunduh poster/brosur resmi sekolah untuk informasi lengkap, serta melakukan registrasi online melalui portal resmi SPMB Al-Afiyah.',
      coverImage: '/images/sd-spmb-poster-2027.jpg',
      author: 'Panitia SPMB 2027/2028',
      publishedAt: '2026-09-26T09:00:00.000Z',
    },
    {
      id: 'sd-news-field-study',
      title: 'Field Study SDIT Al-Afiyah di P4S An-Nabawiyah: Praktik Pertanian & Perikanan Smart Akhlak Fitrah',
      slug: 'field-study-sd-it-al-afiyah-p4s-an-nabawiyah',
      category: 'Field Study',
      excerpt: 'Puluhan murid SDIT Al-Afiyah mengikuti kegiatan field study di P4S An-Nabawiyah. Murid belajar memindahkan semai bibit sayur ke polybag, observasi greenhouse bambu, dan edukasi budidaya perikanan biofloc.',
      content: 'Alhamdulillah, dalam rangka mewujudkan kurikulum kontekstual berbasis alam dan karakter, murid-murid SDIT Al-Afiyah melaksanakan kegiatan "Field Study: Smart Akhlak Fitrah" bertempat di Pusat Pelatihan Pertanian dan Perdesaan Swadaya (P4S) An-Nabawiyah. Kegiatan edukasi luar kelas ini dirancang untuk mengenalkan fitrah anak terhadap alam semesta dan menumbuhkan rasa syukur atas limpahan rezeki ciptaan Allah Ta\'ala.',
      coverImage: '/images/sd-field-study-banner.jpg',
      author: 'Humas SDIT Al-Afiyah',
      publishedAt: '2026-09-25T08:00:00.000Z',
    },
    {
      id: 'sd-news-futsal',
      title: 'Alhamdulillah! Tim Futsal SDIT Al-Afiyah Raih Juara 2 (Second Place) Tingkat Daerah',
      slug: 'tim-futsal-sd-it-al-afiyah-raih-juara-2',
      category: 'Prestasi',
      excerpt: 'Prestasi membanggakan kembali ditorehkan murid-murid SDIT Al-Afiyah. Tim Futsal sekolah berhasil menyabet gelar Second Place dalam kejuaraan futsal antar-sekolah tingkat daerah.',
      content: 'Keluarga besar SDIT Al-Afiyah bersyukur atas torehan prestasi membanggakan yang diraih oleh Tim Futsal murid SDIT Al-Afiyah. Dalam turnamen kompetisi futsal pelajar tingkat daerah, tim sekolah sukses menembus babak final dan mengamankan posisi Juara 2 (Second Place). Pihak sekolah senantiasa mendukung penuh penyaluran minat dan bakat murid.',
      coverImage: '/images/sd-futsal-champion.jpg',
      author: 'Pembina Olahraga SDIT',
      publishedAt: '2026-09-23T08:00:00.000Z',
    },
    {
      id: 'sd-news-kegiatan-karakter',
      title: 'Pembiasaan Adab Shalat Berjamaah dan Pelatihan Da\'i Cilik SDIT Al-Afiyah',
      slug: 'pembiasaan-shalat-berjamaah-daicilik-sdit-al-afiyah',
      category: 'Kegiatan',
      excerpt: 'Menanamkan adab sebelum ilmu dan iman sebelum Al-Qur\'an, murid SDIT Al-Afiyah dibimbing pembiasaan shalat berjamaah serta latihan muhadharah da\'i cilik berani tampil.',
      content: 'Alhamdulillah, salah satu ruh pendidikan di SDIT Al-Afiyah adalah penguatan karakter nabawiyah dan pembiasaan ibadah praktis sejak dini.\n\nSetiap hari, siswi dan siswa dibimbing melaksanakan shalat berjamaah dengan tertib, bersih, dan khusyuk di lingkungan kelas yang asri. Selain itu, untuk melatih kepemimpinan dan rasa percaya diri, murid-murid bergiliran memegang mikrofon dalam agenda muhadharah (latihan pidato da\'i cilik) serta kultum mandiri menyampaikan nasihat kebaikan kepada rekan sekelasnya.\n\nDengan suasana kelas yang hangat dan penuh kasih sayang ("Here\'s Your Second Home"), SDIT Al-Afiyah terus berkomitmen menjadi tempat bertumbuh terbaik bagi ananda.',
      coverImage: '/images/sd-activity-shalat-berjamaah.jpg',
      author: 'Kesiswaan SDIT Al-Afiyah',
      publishedAt: '2026-09-27T08:00:00.000Z',
    },
    {
      id: 'sd-news-sts',
      title: 'Selamat Melaksanakan Sumatif Tengah Semester (STS) 1 SDIT Al-Afiyah',
      slug: 'sumatif-tengah-semester-1-sdit-al-afiyah',
      category: 'Pengumuman',
      excerpt: 'Pelaksanaan Sumatif Tengah Semester (STS) Semester 1 TP 2026/2027 SDIT Al-Afiyah dimulai dengan menjunjung tinggi nilai kejujuran, ketelitian, dan prinsip Smart Akhlak Fitrah.',
      content: 'Bismillah, segenap pimpinan Yayasan, kepala sekolah, dan dewan asatidzah mengucapkan selamat melaksanakan Sumatif Tengah Semester (STS) 1 bagi seluruh murid SDIT Al-Afiyah. Kegiatan asesmen ini dirancang sebagai wahana pembentukan karakter murid yang jujur, teliti, mandiri, dan beradab.',
      coverImage: '/images/sts-semester-1-sdit.jpg',
      author: 'Kurikulum SDIT Al-Afiyah',
      publishedAt: '2026-09-20T08:00:00.000Z',
    },
  ];

  const defaultSdStructuralTeam: TeacherData[] = [
    {
      id: 't-sd-1',
      name: 'Jejen Nurbayan, S.Sos',
      role: 'Ketua Yayasan Pendidikan Imam Bonjol',
      specialization: 'Manajemen Kelembagaan & Kebijakan Yayasan',
      bio: "Mengarahkan visi pendidikan terpadu berlandaskan tauhid dan akhlak mulia demi masa depan generasi Qur'ani.",
      order: 1,
    },
    {
      id: 't-sd-2',
      name: 'Febrian Fauzi, S.Pd',
      role: 'Kepala Sekolah SDIT Al-Afiyah Majalengka',
      specialization: 'Kepemimpinan Sekolah & Mutu Pendidikan',
      bio: 'Mendidik dengan keteladanan dan menanamkan adab sebelum ilmu agar proses belajar anak senantiasa berkah dan membahagiakan.',
      order: 2,
    },
    {
      id: 't-sd-3',
      name: 'Yayan Herdianto, S.Pd',
      role: 'Komite Sekolah SDIT Al-Afiyah',
      specialization: 'Kemitraan Sekolah & Paguyuban Orang Tua',
      bio: 'Menjembatani komunikasi sinergis antara pihak sekolah dan orang tua murid demi tercapainya lingkungan belajar yang ideal.',
      order: 3,
    },
    {
      id: 't-sd-4',
      name: 'Windi Widayanti, S.Pd',
      role: 'Kasie Kurikulum SDIT Al-Afiyah',
      specialization: 'Kurikulum Merdeka & Integrasi Karakter Adab',
      bio: 'Mengembangkan kurikulum kontekstual yang memadukan capaian akademis nasional dengan penguatan karakter islami.',
      order: 4,
    },
    {
      id: 't-sd-5',
      name: 'Muhammad Rizki, S.Pd',
      role: 'Koordinator Tahfidz SDIT Al-Afiyah',
      specialization: "Talaqqi, Tartil & Tahfidz Al-Qur'an",
      bio: "Membimbing hafalan Al-Qur'an dengan metode yang ramah, tartil sesuai tajwid, dan menumbuhkan kecintaan pada Al-Qur'an sejak dini.",
      order: 5,
    },
    {
      id: 't-sd-6',
      name: 'Iyan Kusdiana, S.Pd',
      role: 'Wakasek Kesiswaan SDIT Al-Afiyah',
      specialization: 'Pembinaan Karakter & Pengembangan Minat Murid',
      bio: 'Membimbing pembiasaan disiplin, adab harian, dan keaktifan murid dalam berbagai kegiatan ekstrakurikuler positif.',
      order: 6,
    },
    {
      id: 't-sd-7',
      name: 'Moch. Ajat Nurhidayat, S.T',
      role: 'Tata Usaha SDIT Al-Afiyah',
      specialization: 'Administrasi Sekolah & Sistem Informasi Akademik',
      bio: 'Memberikan pelayanan administrasi, kearsipan data pokok, dan operasional layanan sekolah yang tertib serta terpercaya.',
      order: 7,
    },
    {
      id: 't-sd-8',
      name: 'Aditya Rahadian, S.TP',
      role: 'Bendahara SDIT Al-Afiyah',
      specialization: 'Tata Kelola Keuangan & Akuntabilitas Anggaran',
      bio: 'Menyelenggarakan pencatatan anggaran dan tata kelola keuangan sekolah yang transparan, amanah, dan akuntabel.',
      order: 8,
    },
    {
      id: 't-sd-9',
      name: 'Mulia Rizki',
      role: 'Lead Developer & IT Systems',
      specialization: 'Arsitektur Sistem Informasi, Fullstack Development & Database',
      bio: 'Mengembangkan dan mengelola ekosistem digital sekolah, infrastruktur sistem, database, serta operasional portal SPMB & platform digital Al-Afiyah.',
      order: 9,
    },
  ];

  let rawTeachers: TeacherData[] = (dbSchool?.teachers && dbSchool.teachers.length > 0)
    ? dbSchool.teachers.map((t) => ({
        id: t.id,
        name: t.name,
        role: t.role,
        specialization: t.specialization,
        photoUrl: t.photoUrl,
        bio: t.bio,
        order: t.order,
      }))
    : defaultSdStructuralTeam;

  // Pastikan Developer (Mulia Rizki) dan Ketua Yayasan (Jejen Nurbayan) selalu tercakup dalam struktur
  if (!rawTeachers.some((t) => t.name.toLowerCase().includes('mulia rizki'))) {
    rawTeachers.push(defaultSdStructuralTeam[8]);
  }
  if (!rawTeachers.some((t) => t.name.toLowerCase().includes('jejen nurbayan'))) {
    rawTeachers.unshift(defaultSdStructuralTeam[0]);
  }

  const schoolData: SchoolData = {
    slug: 'sd',
    name: identityData.name || dbSchool?.name || 'SDIT Al-Afiyah Majalengka',
    badgeText: identityData.badgeText || dbSchool?.badgeText || 'TERAKREDITASI B • YPIB GUGUS 3 NUSA INDAH',
    tagline: identityData.tagline || dbSchool?.tagline || 'Mendidik Generasi Sholeh, Cerdas, Mandiri, Berwawasan Luas, dan Berakhlakul Islami',
    primaryColor: dbSchool?.primaryColor || '#064e3b',
    accentColor: dbSchool?.accentColor || '#D97706',
    registrationFee: dbSchool?.registrationFee || 250000,
    waCenterPhone: identityData.whatsappNumber || dbSchool?.waCenterPhone || '6281310139001',
    address: identityData.schoolAddress || identityData.address || dbSchool?.address || 'Lingkungan Giri Asih - Jl. Gerakan Koperasi, Kel. Majalengka Kulon, Kec. Majalengka, Kab. Majalengka 45411',
    heroHeadline: heroData.headline || 'Bukan Sekadar Tempat Belajar, Namun Juga Tempat Bertumbuh 🌱',
    heroSubheadline: heroData.subheadline || 'Selamat datang di SDIT Al-Afiyah. Kami menemani anak bertumbuh, mengenal dirinya, mencintai kebaikan, serta berkembang sesuai fitrahnya dalam lingkungan yang penuh iman, ilmu, dan kasih sayang.',
    heroImage: heroData.heroImage || '/images/sd-hero-greenhouse.jpg',
    heroSlides: heroData.slides,
    stats: sectionsMap.stats || heroData.stats,
    values: sectionsMap.values,
    programs: sectionsMap.programs || defaultPrograms,
    facilities: sectionsMap.facilities,
    testimonials: (sectionsMap.testimonials && sectionsMap.testimonials.length > 0)
      ? sectionsMap.testimonials
      : [
          {
            name: 'Ibu Nani Mulyani, S.Pd.',
            role: 'Wali Murid Kelas 5 SDIT',
            quote: 'Menumbuhkan kesadaran beribadah, adab, serta empati anak secara alami tanpa paksaan. Pembelajarannya yang menyenangkan dan selaras dengan tumbuh kembang anak didukung sinergi yang kuat antara sekolah dan orang tua benar-benar membentuk karakter anak yang berakhlak mulia dan mencintai ajaran Islam.'
          },
          {
            name: 'Orang Tua Murid Al-Afiyah',
            role: 'Wali Murid Kelas 2 SDIT',
            quote: 'Guru-gurunya sangat sabar dan penuh kasih sayang. Suasana sekolah ramah anak dan nilai adabnya benar-benar terasa di rumah.'
          }
        ],
    teachers: rawTeachers,
    newsPosts: (dbSchool?.newsPosts && dbSchool.newsPosts.length > 0) ? dbSchool.newsPosts : defaultSdNewsPosts,
    achievements,
  };

  return (
    <>
      <WelcomeVideoModal
        videoSrc="/videos/intro-sd-lite.mp4"
        title="Sekilas Suasana & Pembiasaan Belajar SDIT"
        schoolName="SDIT Al-Afiyah Majalengka"
      />
      <SchoolLandingTemplate school={schoolData} />
    </>
  );
}
