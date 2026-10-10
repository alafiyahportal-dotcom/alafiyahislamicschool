import React from 'react';
import { prisma } from '@/lib/prisma';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import CMSEditorClient, {
  CMSInitialData,
  DEFAULT_SD_KARAKTER,
  DEFAULT_SD_PROFIL,
  DEFAULT_SMP_KARAKTER,
  DEFAULT_SMP_PROFIL
} from '@/components/admin/CMSEditorClient';
import { notFound } from 'next/navigation';
import { getSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

export default async function SchoolCMSEditorPage({
  params
}: {
  params: Promise<{ schoolSlug: string }>;
}) {
  const resolvedParams = await params;
  const { schoolSlug } = resolvedParams;

  if (schoolSlug !== 'tk' && schoolSlug !== 'sd' && schoolSlug !== 'smp' && schoolSlug !== 'foundation') {
    notFound();
  }

  const school = await prisma.school.findUnique({
    where: { slug: schoolSlug },
    include: {
      cmsSections: true
    }
  });

  if (!school) {
    notFound();
  }

  // Parse existing CMS sections by key
  const sectionsMap: Record<string, any> = {};
  for (const sec of school.cmsSections) {
    try {
      sectionsMap[sec.sectionKey] = JSON.parse(sec.payload);
    } catch {
      sectionsMap[sec.sectionKey] = sec.payload;
    }
  }

  // Fallback defaults tailored to unit
  const defaultSlides = schoolSlug === 'tk'
    ? [
        {
          id: 1,
          badge: 'PAUD & TK IT AL-AFIYAH MAJALENGKA',
          titlePart1: 'Tumbuh Ceria, Mandiri & ',
          titleHighlight: 'Berakhlak Shalih',
          titlePart2: ' Sejak Usia Emas',
          description: 'Pendidikan anak usia dini berbasis sentra bermain bermakna, pembiasaan adab nabawiyah, serta stimulasi motorik ramah anak.',
          primaryCtaText: 'Daftar Murid Baru TK',
          primaryCtaLink: '/ppdb/daftar?school=tk',
          secondaryCtaText: 'Konsultasi WhatsApp',
          secondaryCtaLink: `https://wa.me/${school.waCenterPhone}`,
          image: '/images/tk-hero-kids.jpg',
          trustItems: [
            { icon: 'shield' as const, text: 'Terakreditasi Resmi' },
            { icon: 'users' as const, text: 'Rasio Kelas Ramah 1:8' },
            { icon: 'calendar' as const, text: 'T.A. 2027/2028' },
            { icon: 'check' as const, text: `Formulir: Rp ${school.registrationFee.toLocaleString('id-ID')}` }
          ]
        },
        {
          id: 2,
          badge: 'METODE SENTRA BELAJAR ISLAMI CERIA',
          titlePart1: 'Mengenal Hijaiyah & ',
          titleHighlight: 'Cinta Al-Qur’an',
          titlePart2: ' Tanpa Paksaan',
          description: 'Menanamkan kecintaan pada ibadah dan Al-Qur’an melalui lagu hijaiyah ceria, dongeng sirah nabawiyah, toilet training, serta doa harian.',
          primaryCtaText: 'Pelajari Program Sentra',
          primaryCtaLink: '/tk#program',
          secondaryCtaText: 'Hubungi Bunda Guru',
          secondaryCtaLink: `https://wa.me/${school.waCenterPhone}`,
          image: '/images/tk-hero-garden.jpg',
          trustItems: [
            { icon: 'award' as const, text: 'Stimulasi Sensorik' },
            { icon: 'check' as const, text: 'Toilet Training Mandiri' },
            { icon: 'users' as const, text: 'Bunda Guru Ramah' },
            { icon: 'calendar' as const, text: 'Gelombang 1 Dibuka' }
          ]
        }
      ]
    : schoolSlug === 'sd'
    ? [
        {
          id: 1,
          badge: 'SPMB T.A. 2027/2028 • TELAH DIBUKA',
          titlePart1: 'Bukan Sekedar Tempat Belajar, Namun Juga ',
          titleHighlight: 'Tempat Bertumbuh',
          titlePart2: '',
          description: 'Mencetak generasi sholeh, cerdas, mandiri, berwawasan, dan berakhlakul islami dengan prinsip Smart Akhlak Fitrah serta bimbingan metode karakter nabawiyah.',
          primaryCtaText: 'Daftar SPMB SDIT',
          primaryCtaLink: '/ppdb/daftar?school=sd',
          secondaryCtaText: 'WhatsApp (0813-1013-9001)',
          secondaryCtaLink: `https://wa.me/${school.waCenterPhone}`,
          image: '/images/sd-hero-greenhouse.jpg',
          trustItems: [
            { icon: 'shield' as const, text: 'Kuota Terbatas: Hanya 2 Rombel' },
            { icon: 'check' as const, text: 'Smart Akhlak Fitrah' },
            { icon: 'award' as const, text: 'Iman Sebelum Qur’an & Tahfidz' },
            { icon: 'calendar' as const, text: `Formulir: Rp ${school.registrationFee.toLocaleString('id-ID')}` }
          ]
        },
        {
          id: 2,
          badge: 'SPMB T.A. 2027/2028 • TELAH DIBUKA',
          titlePart1: 'Bukan Sekedar Tempat Belajar, Namun Juga ',
          titleHighlight: 'Tempat Bertumbuh',
          titlePart2: '',
          description: 'Mencetak generasi sholeh, cerdas, mandiri, berwawasan, dan berakhlakul islami dengan prinsip Smart Akhlak Fitrah serta bimbingan metode karakter nabawiyah.',
          primaryCtaText: 'Daftar SPMB SDIT',
          primaryCtaLink: '/ppdb/daftar?school=sd',
          secondaryCtaText: 'WhatsApp (0813-1013-9001)',
          secondaryCtaLink: `https://wa.me/${school.waCenterPhone}`,
          image: '/images/sd-hero-garden.jpg',
          trustItems: [
            { icon: 'shield' as const, text: 'Kuota Terbatas: Hanya 2 Rombel' },
            { icon: 'check' as const, text: 'Smart Akhlak Fitrah' },
            { icon: 'award' as const, text: 'Iman Sebelum Qur’an & Tahfidz' },
            { icon: 'calendar' as const, text: `Formulir: Rp ${school.registrationFee.toLocaleString('id-ID')}` }
          ]
        },
        {
          id: 3,
          badge: 'SPMB T.A. 2027/2028 • TELAH DIBUKA',
          titlePart1: 'Bukan Sekedar Tempat Belajar, Namun Juga ',
          titleHighlight: 'Tempat Bertumbuh',
          titlePart2: '',
          description: 'Mencetak generasi sholeh, cerdas, mandiri, berwawasan, dan berakhlakul islami dengan prinsip Smart Akhlak Fitrah serta bimbingan metode karakter nabawiyah.',
          primaryCtaText: 'Daftar SPMB SDIT',
          primaryCtaLink: '/ppdb/daftar?school=sd',
          secondaryCtaText: 'WhatsApp (0813-1013-9001)',
          secondaryCtaLink: `https://wa.me/${school.waCenterPhone}`,
          image: '/images/sd-hero-greenhouse.jpg',
          trustItems: [
            { icon: 'shield' as const, text: 'Kuota Terbatas: Hanya 2 Rombel' },
            { icon: 'check' as const, text: 'Smart Akhlak Fitrah' },
            { icon: 'award' as const, text: 'Iman Sebelum Qur’an & Tahfidz' },
            { icon: 'calendar' as const, text: `Formulir: Rp ${school.registrationFee.toLocaleString('id-ID')}` }
          ]
        }
      ]
    : schoolSlug === 'smp'
    ? [
        {
          id: 1,
          badge: 'SMP IT AL-AFIYAH MAJALENGKA',
          titlePart1: 'Mencetak Pemimpin ',
          titleHighlight: 'Qur’ani Berakhlak',
          titlePart2: ' & Berwawasan Global',
          description: 'Sekolah Menengah Pertama Islam Terpadu dengan sistem fullday school unggulan. Target hafalan 3-5 juz mutqin & tartil, adab islami, dan sains modern.',
          primaryCtaText: 'Daftar PPDB SMP IT',
          primaryCtaLink: '/ppdb/daftar?school=smp',
          secondaryCtaText: 'Konsultasi Panitia PPDB',
          secondaryCtaLink: `https://wa.me/${school.waCenterPhone}`,
          image: '/images/smp-hero-fullday.jpg',
          trustItems: [
            { icon: 'shield' as const, text: 'Terakreditasi A Resmi' },
            { icon: 'award' as const, text: 'Target Tahfidz 3-5 Juz Mutqin' },
            { icon: 'calendar' as const, text: 'T.A. 2027/2028' },
            { icon: 'check' as const, text: `Formulir: Rp ${school.registrationFee.toLocaleString('id-ID')}` }
          ]
        },
        {
          id: 2,
          badge: 'BILINGUAL IMMERSION & KEPEMIMPINAN',
          titlePart1: 'Penguasaan Bahasa ',
          titleHighlight: 'Arab & Inggris',
          titlePart2: ' Serta Sains Teknologi',
          description: 'Membiasakan percakapan bahasa internasional di lingkungan murid, didukung dewan guru berpengalaman, bimbingan olimpiade, dan kepemimpinan OSIS IT.',
          primaryCtaText: 'Kurikulum & Peminatan',
          primaryCtaLink: '/smp#kurikulum',
          secondaryCtaText: 'Tanya Syarat Masuk',
          secondaryCtaLink: `https://wa.me/${school.waCenterPhone}`,
          image: '/images/smp-hero-bilingual.jpg',
          trustItems: [
            { icon: 'grad' as const, text: 'Fullday School Terpadu' },
            { icon: 'award' as const, text: 'Olimpiade Sains & Robotik' },
            { icon: 'users' as const, text: 'Kepanduan Pramuka SIT' },
            { icon: 'calendar' as const, text: 'Gelombang 1 Dibuka' }
          ]
        },
        {
          id: 3,
          badge: 'LABORATORIUM & KELAS MULTIMEDIA',
          titlePart1: 'Fasilitas Modern ',
          titleHighlight: 'Ramah Prestasi',
          titlePart2: ' & Literasi Digital',
          description: 'Ruang kelas ber-AC, proyektor interaktif, laboratorium sains terstandar, serta sarana olahraga panahan yang representatif di Majalengka.',
          primaryCtaText: 'Lihat Seluruh Fasilitas',
          primaryCtaLink: '/smp#fasilitas',
          secondaryCtaText: 'Jadwal Agenda PPDB',
          secondaryCtaLink: '/agenda',
          image: '/images/smp-hero-bilingual.jpg',
          trustItems: [
            { icon: 'check' as const, text: 'Ruang Kelas Nyaman AC' },
            { icon: 'award' as const, text: 'Lab Sains & Komputer' },
            { icon: 'shield' as const, text: 'Lingkungan Asri & Islami' },
            { icon: 'calendar' as const, text: 'Tahun Ajaran Baru' }
          ]
        }
      ]
    : [
        {
          id: 1,
          badge: 'SELAMAT DATANG DI YAYASAN PENDIDIKAN IMAM BONJOL',
          titlePart1: 'Membina Generasi ',
          titleHighlight: "Qur'ani",
          titlePart2: ', Cerdas & Berkarakter Unggul',
          description: 'Lembaga pendidikan Islam terpadu holistik di Majalengka yang memadukan kurikulum nasional, sains modern, dan tahfidz Al-Qur’an berbasis adab nabawi untuk masa depan gemilang.',
          primaryCtaText: 'Daftar PPDB Sekarang',
          primaryCtaLink: '/ppdb/daftar',
          secondaryCtaText: 'Pelajari Jenjang Unit',
          secondaryCtaLink: '#unit-pendidikan',
          image: '/images/eduka-hero-campus.jpg',
          trustItems: [
            { icon: 'shield' as const, text: 'Menaungi TK, SD, SMP' },
            { icon: 'award' as const, text: 'Akreditasi A Unggul' },
            { icon: 'calendar' as const, text: 'T.A. 2027/2028' },
            { icon: 'check' as const, text: 'Pusat Tahfidz & Sains' }
          ]
        },
        {
          id: 2,
          badge: 'PROGRAM UNGGULAN TAHFIDZ & SAINS MODERN',
          titlePart1: 'Mencetak Generasi ',
          titleHighlight: 'Hafidz 30 Juz',
          titlePart2: ' Berwawasan Global',
          description: 'Didampingi dewan guru berpengalaman dengan bimbingan intensif mutqin, tartil, dan penguasaan bahasa Arab-Inggris serta teknologi digital sejak dini.',
          primaryCtaText: 'Lihat Program Tahfidz',
          primaryCtaLink: '/smp',
          secondaryCtaText: 'Jadwal Agenda Seleksi',
          secondaryCtaLink: '/agenda',
          image: '/images/arc-tahfidz.jpg',
          trustItems: [
            { icon: 'award' as const, text: 'Metode Talaqqi Tartil' },
            { icon: 'grad' as const, text: 'Bahasa Arab-Inggris' },
            { icon: 'users' as const, text: 'Dewan Guru Pilihan' },
            { icon: 'calendar' as const, text: 'Agenda Berkala' }
          ]
        },
        {
          id: 3,
          badge: 'PPDB ONLINE TP 2027/2028 GELOMBANG 1 DIBUKA',
          titlePart1: 'Raih Beasiswa & ',
          titleHighlight: 'Diskon Biaya',
          titlePart2: ' Masuk Gelombang Dini',
          description: 'Dapatkan fasilitas pendaftaran online anti-ribet, simulasi kuitansi instan, pengukuran seragam mandiri, dan kemudahan pembayaran fleksibel.',
          primaryCtaText: 'Daftar Online 5 Menit',
          primaryCtaLink: '/ppdb/daftar',
          secondaryCtaText: 'Cek Status Pendaftaran',
          secondaryCtaLink: '/ppdb/cek-status',
          image: '/images/eduka-study-group.jpg',
          trustItems: [
            { icon: 'check' as const, text: 'Formulir Mudah' },
            { icon: 'award' as const, text: 'Jalur Prestasi & Afirmasi' },
            { icon: 'users' as const, text: 'Helpdesk Responsif' },
            { icon: 'shield' as const, text: 'Sistem Terintegrasi' }
          ]
        }
      ];

  const heroPayload = sectionsMap.hero || {};
  const identityPayload = sectionsMap.identity || sectionsMap.contact || {};
  const defaultStatsForSchool = schoolSlug === 'sd' ? [
    { label: 'Kuota Penerimaan', value: 'Hanya 2 Rombel' },
    { label: 'Pilar Pendidikan', value: 'Smart Akhlak Fitrah' },
    { label: 'Akreditasi Sekolah', value: 'Terakreditasi B' },
    { label: 'Bimbingan Tahfidz', value: 'Juz 30 Mutqin' }
  ] : schoolSlug === 'smp' ? [
    { label: 'Akreditasi Lembaga', value: 'Terakreditasi A', subtext: 'BAN-S/M Resmi', badge: 'RESMI' },
    { label: 'Target Capaian Tahfidz', value: '3-5+ Juz', subtext: 'Metode Talaqqi Mutqin & Tartil', badge: 'PROGRAM UNGGULAN' },
    { label: 'Diskon Uang Bangunan', value: 'Hingga 70%', subtext: 'Alumni SDIT Al Afiyah & Umum', badge: 'SPMB GELOMBANG 1' },
    { label: 'Karakter & Bahasa', value: 'Smart & Religious', subtext: 'Bahasa Arab Aktif & Mutaba\'ah Digital', badge: 'SCD' }
  ] : schoolSlug === 'tk' ? [
    { label: 'Metode Pembelajaran', value: 'Sentra Bermain', subtext: 'Ramah Anak & Eksploratif', badge: 'GOLDEN AGE' },
    { label: 'Karakter & Adab', value: 'Adab Nabawiyah', subtext: 'Doa Harian & Toilet Training', badge: 'AKHLAQ' },
    { label: 'Rasio Kelas', value: '1 : 8 Murid', subtext: 'Pendampingan Penuh Kasih', badge: 'INTENSIF' },
    { label: 'Target Tahfidz', value: 'Juz 30 Ceria', subtext: 'Lagu & Dongeng Hijaiyah', badge: 'TAHFIDZ' }
  ] : [
    { label: 'Murid Aktif', value: '850+' },
    { label: 'Dewan Guru Berpengalaman', value: '75+ Pendidik' },
    { label: 'Akreditasi Lembaga', value: 'Terakreditasi A / B' },
    { label: 'Target Tahfidz', value: 'Hafidz 30 Juz' }
  ];
  const statsPayload = sectionsMap.stats || heroPayload.stats || defaultStatsForSchool;

  const defaultValuesForSchool = schoolSlug === 'sd' ? [
    {
      title: 'Mendidik dengan Sunnah & Karakter Nabawiyah',
      description: 'Mendidik dengan sunnah, menggunakan metode Pendidikan Karakter Nabawiyah, menanamkan akhlak dan ilmu, serta iman sebelum Al-Qur\'an.'
    },
    {
      title: 'Smart, Literasi & Tahfidz Qur\'an',
      description: 'Pembelajaran terpadu penguatan basic literasi dan numerasi serta bimbingan tahfidz Juz 30 mutqin dengan suasana asri yang membahagiakan murid.'
    },
    {
      title: 'Outdoor Learning & Pelatihan Aqil-Baligh',
      description: 'Eksplorasi kontekstual di alam dan kebun pertanian terbuka, pelatihan kemandirian aqil-baligh, serta pemetaan potensi bakat dan skill murid.'
    }
  ] : schoolSlug === 'smp' ? [
    {
      title: 'Tahfidz Al-Qur\'an Mutqin 3-5+ Juz',
      description: 'Pembelajaran Al-Qur\'an harian dengan target hafalan minimal 3 juz hingga 5+ juz dengan kaidah tajwid dan makharijul huruf yang kokoh serta tartil.',
      icon: 'BookOpen'
    },
    {
      title: 'Bi\'ah Lughawiyyah (Lingkungan Bahasa Arab)',
      description: 'Membiasakan murid berkomunikasi menggunakan bahasa Arab dalam keseharian untuk memperkuat pemahaman terhadap literatur Islam dan Al-Qur\'an.',
      icon: 'Languages'
    },
    {
      title: 'SCD & Mutaba\'ah Digital',
      description: 'Student Character Development untuk membentuk adab islami, kemandirian, kepemimpinan, dan monitoring ibadah harian yang terpantau real-time.',
      icon: 'Award'
    },
    {
      title: 'Futsal Development & Minat Bakat',
      description: 'Program pembinaan bakat olahraga futsal berjenjang, kepanduan pramuka SIT, pembinaan minat sains, dan ragam karya kreatif murid remaja.',
      icon: 'Users'
    }
  ] : schoolSlug === 'tk' ? [
    {
      title: 'Sentra Belajar Islami & Ceria',
      description: 'Metode sentra belajar berbasis eksplorasi sensorik, motorik, dan pembiasaan adab nabawiyah sejak usia dini.',
      icon: 'HeartHandshake'
    },
    {
      title: 'Tahfidz & Doa Harian Ceria',
      description: 'Mengenal huruf hijaiyah, surat pendek Juz 30, dan doa-doa harian lewat metode bernyanyi dan cerita islami tanpa paksaan.',
      icon: 'BookOpen'
    },
    {
      title: 'Kemandirian & Toilet Training',
      description: 'Pembiasaan kemandirian makan sendiri, merapikan mainan, dan toilet training dengan pendampingan penuh kasih sayang.',
      icon: 'Award'
    }
  ] : [
    { title: 'Akidah & Akhlakul Karimah', description: 'Penanaman adab nabawiyah, pembiasaan shalat berjamaah, dan birrul walidain.' },
    { title: 'Tahsin & Tahfidz Al-Qur\'an', description: 'Metode bimbingan talaqqi ramah anak dengan target hafalan mutqin dan tartil.' },
    { title: 'Sains & Teknologi Unggulan', description: 'Laboratorium interaktif, pembelajaran nalar logika, dan literasi digital beradab.' }
  ];
  const valuesPayload = sectionsMap.values || defaultValuesForSchool;

  const defaultProgramsForSchool = schoolSlug === 'sd' ? [
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
  ] : schoolSlug === 'smp' ? [
    {
      title: 'Tahfidz Al-Qur\'an 3-5+ Juz',
      desc: 'Halaqah tahfidz intensif setiap pagi dengan target kelulusan minimal 3 juz mutqin dan kelas takhassus 5+ juz.',
      badge: 'Program Unggulan',
      image: '/images/arc-tahfidz.jpg'
    },
    {
      title: 'Bi\'ah Lughawiyyah (Bahasa Arab)',
      desc: 'Penerapan lingkungan berbahasa Arab aktif untuk muhadatsah harian dan penguasaan kosa kata syar\'i.',
      badge: 'Bahasa Asing',
      image: '/images/smp-hero-bilingual.jpg'
    },
    {
      title: 'Student Character Development (SCD)',
      desc: 'Pembinaan kepemimpinan, adab pergaulan islami, kedisiplinan, dan tanggung jawab sosial murid remaja.',
      badge: 'Karakter & Adab',
      image: '/images/smp-outing-2.jpg'
    },
    {
      title: 'Mutaba\'ah Ibadah Digital',
      desc: 'Monitoring shalat berjamaah, tilawah mandiri, dan kebiasaan baik harian yang terhubung antara wali murid dan asatidz.',
      badge: 'Sistem Digital',
      image: '/images/smp-activity-multimedia.jpg'
    },
    {
      title: 'Futsal Development Program',
      desc: 'Latihan intensif fisik dan taktik futsal oleh pelatih berkompeten untuk mencetak atlet pelajar berprestasi.',
      badge: 'Minat & Olahraga',
      image: '/images/smp-hero-fullday.jpg'
    },
    {
      title: 'Kepanduan Pramuka SIT & Sains Remaja',
      desc: 'Kegiatan kepanduan islami, survival alam, tadabbur ciptaan Allah, serta eksplorasi karya ilmiah remaja.',
      badge: 'Eksplorasi & Bakat',
      image: '/images/smp-tubing-1.jpg'
    }
  ] : schoolSlug === 'tk' ? [
    { title: 'Sentra Bahan Alam & Main Peran', desc: 'Stimulasi sensorik dan imajinasi anak usia dini melalui media alam sekitar.', badge: 'Sentra Bermain' },
    { title: 'Tahfidz Ceria & Kisah Teladan Nabawi', desc: 'Mengenal Al-Qur\'an dan teladan Rasulullah ﷺ dengan metode dongeng dan keceriaan.', badge: 'Karakter Qur\'ani' },
    { title: 'Toilet Training & Kemandirian Anak', desc: 'Melatih anak terbiasa mandiri mengurus diri dan beradab bersih secara islami.', badge: 'Adab Mandiri' },
    { title: 'Parenting Edukasi Ramah Keluarga', desc: 'Sinergi berkala bunda guru dan orang tua dalam mendampingi masa emas golden age.', badge: 'Sinergi Orang Tua' }
  ] : [
    { title: 'Tahfidz Al-Qur\'an Intensif', desc: 'Bimbingan talaqqi tartil bersama dewan guru setiap pagi.', badge: 'Utama' },
    { title: 'Bilingual & Digital Literacy', desc: 'Pengenalan teknologi edukasi dan pembiasaan percakapan bahasa Arab & Inggris praktis.', badge: 'Modern' },
    { title: 'Pramuka SIT & Olahraga Sunnah', desc: 'Pembentukan karakter ksatria muslim melalui kepanduan dan panahan.', badge: 'Karakter' },
    { title: 'Parenting Qur\'ani Berkala', desc: 'Sinergi erat antara dewan guru dan wali murid demi pembiasaan anak di rumah.', badge: 'Sinergi' }
  ];
  const programsPayload = sectionsMap.programs || defaultProgramsForSchool;

  const facilitiesPayload = sectionsMap.facilities || (
    schoolSlug === 'sd' ? [
      {
        name: 'Pembiasaan Shalat Berjamaah Siswi',
        image: '/images/sd-activity-shalat-berjamaah.jpg',
        desc: 'Pembiasaan adab ibadah harian sejak dini dengan shalat berjamaah yang khusyuk, melatih ketertiban, kebersihan, dan akhlak mahmudah.',
        category: 'Ibadah & Karakter',
      },
      {
        name: 'Pelatihan Muhadharah & Da\'i Cilik Berani Tampil',
        image: '/images/sd-activity-daicilik-speech.jpg',
        desc: 'Mengasah rasa percaya diri murid, kecakapan public speaking, hafalan doa harian, dan penyampaian pesan kebaikan santun di hadapan teman sebaya.',
        category: 'Karakter & Da\'i',
      },
      {
        name: 'Kultum Mandiri & Bimbingan Kepemimpinan Murid',
        image: '/images/sd-activity-kultum-murid.jpg',
        desc: 'Melatih keberanian berbicara di hadapan publik, membawakan tausiyah singkat, serta menumbuhkan jiwa kepemimpinan nabawiyah.',
        category: 'Karakter & Da\'i',
      },
      {
        name: 'Kenyamanan Belajar Kelas Terpadu (Welcome to 6B)',
        image: '/images/sd-activity-classroom-6b.jpg',
        desc: 'Ruang kelas yang asri, bersih, ceria, dan berfasilitas lengkap, menciptakan suasana belajar yang fokus, interaktif, dan ramah anak.',
        category: 'Aktivitas Kelas',
      },
      {
        name: 'Pembelajaran Interaktif Digital & Karakter ("Second Home")',
        image: '/images/sd-activity-multimedia-learning.jpg',
        desc: 'Pemanfaatan media proyektor audio visual dalam pendalaman materi dan Al-Qur\'an, mewujudkan atmosfer sekolah sebagai rumah kedua yang hangat.',
        category: 'Aktivitas Kelas',
      },
      {
        name: 'Field Study Smart Akhlak Fitrah (P4S An-Nabawiyah)',
        image: '/images/sd-field-study-banner.jpg',
        desc: 'Observasi kontekstual murid SDIT Al-Afiyah di alam terbuka, menanamkan nilai kemandirian, rasa syukur, dan cinta ciptaan Allah Ta\'ala.',
        category: 'Agro-Sains & Alam',
      },
      {
        name: 'Prestasi Tim Futsal SDIT Al-Afiyah (Second Place)',
        image: '/images/sd-futsal-champion.jpg',
        desc: 'Raihan piala Juara 2 (Second Place) Futsal tingkat pelajar, melatih sportivitas, mental juara, dan ukhuwah islamiyah.',
        category: 'Prestasi & Bakat',
      },
      {
        name: 'Bimbingan Praktik Semai Bibit ke Polybag',
        image: '/images/sd-planting-guidance.jpg',
        desc: 'Bimbingan langsung ustadz mendampingi siswi memindahkan bibit sayur ke media polybag dengan teliti dan penuh kasih sayang.',
        category: 'Agro-Sains & Alam',
      },
      {
        name: 'Greenhouse & Observasi Bibit Hortikultura',
        image: '/images/sd-seedling-care.jpg',
        desc: 'Siswi mengamati pertumbuhan tunas tanaman pangan di rak semai greenhouse bambu sebagai sarana pembelajaran agro-sains nabawi.',
        category: 'Agro-Sains & Alam',
      },
      {
        name: 'Edukasi Budidaya Ikan & Kolam Biofloc',
        image: '/images/sd-field-fish-feeding.jpg',
        desc: 'Murid ikhwan belajar ekosistem perairan tawar dan praktik pemberian pakan ikan di kolam terpal biofloc percontohan.',
        category: 'Agro-Sains & Alam',
      },
      {
        name: 'Halaqah Tahfidz Qur\'an & Pembiasaan Adab',
        image: '/images/sd-activity-halaqah-tahfidz.jpg',
        desc: 'Bimbingan talaqqi tartil dan setoran hafalan Al-Qur\'an Juz 30 mutqin dengan metode adab nabawiyah yang ramah anak dan membahagiakan.',
        category: 'Ibadah & Karakter',
      },
    ] : schoolSlug === 'smp' ? [
      { name: 'Ruang Kelas Nyaman & Literasi Digital', image: '/images/smp-kelas-literasi.jpg', desc: 'Ruang kelas representatif ber-AC, proyektor interaktif, dan pencahayaan alami yang mendukung kenyamanan belajar seharian.', category: 'Kelas & Akademik' },
      { name: 'Laboratorium Multimedia & Komputer', image: '/images/smp-activity-multimedia.jpg', desc: 'Fasilitas komputer modern untuk pembelajaran literasi digital, riset sains, dan simulasi asesmen berbasis komputer.', category: 'Teknologi & Riset' },
      { name: 'Masjid Sekolah & Pusat Halaqah Qur\'an', image: '/images/arc-tahfidz.jpg', desc: 'Pusat pembinaan shalat berjamaah tepat waktu, dzikir ma\'tsurat, serta setoran halaqah tahfidz 3-5+ juz mutqin.', category: 'Ibadah & Ruhiyah' },
      { name: 'Sarana Futsal & Lapangan Olahraga', image: '/images/smp-hero-fullday.jpg', desc: 'Lapangan olahraga representatif untuk Futsal Development Program, kepanduan Pramuka SIT, dan kebugaran murid.', category: 'Olahraga & Bakat' },
      { name: 'Outing Class River Tubing Cikadongdong', image: '/images/smp-tubing-1.jpg', desc: 'Kegiatan tadabbur alam dan uji ketangkasan fisik peserta didik mengarungi arus sungai Cikadongdong Majalengka.', category: 'Tadabbur Alam' },
      { name: 'Ukhuwah & Team Building di Alam', image: '/images/smp-tubing-2.jpg', desc: 'Membangun kekompakan, keberanian, dan persaudaraan islami yang kokoh antar murid dan asatidz pembina.', category: 'Outing Class' },
      { name: 'Briefing Adab & Pengarahan Keselamatan', image: '/images/smp-outing-2.jpg', desc: 'Penanaman adab safar, doa harian, serta pembekalan keselamatan oleh dewan asatidz sebelum kegiatan lapangan.', category: 'Pembekalan' },
      { name: 'Dokumentasi & Kebersamaan Peserta Didik', image: '/images/smp-outing-3.jpg', desc: 'Momen kebersamaan ceria santriwan-santriwati SMP IT Al-Afiyah dalam membentuk kenangan bermakna.', category: 'Dokumentasi' }
    ] : schoolSlug === 'tk' ? [
      { name: 'Sentra Main Peran & Kreativitas Anak', image: '/images/tk-hero-kids.jpg', desc: 'Area stimulasi imajinasi sosial anak dengan miniatur profesi, pasar islami, dan tata cara bertamu santun.', category: 'Sentra Bermain' },
      { name: 'Area Bermain Outdoor & Sensorik Alami', image: '/images/tk-hero-garden.jpg', desc: 'Taman bermain asri dan aman untuk melatih motorik kasar anak, ayunan, perosotan, dan titian keseimbangan.', category: 'Motorik & Alam' },
      { name: 'Ruang Kelas Warna-Warni Ber-AC', image: '/images/tk-hero-kids.jpg', desc: 'Ruang sentra berpendingin udara yang bersih, steril, dan dirancang khusus sesuai ergonomi anak usia dini.', category: 'Sentra Kelas' },
      { name: 'Pojok Baca & Dongeng Kisah Teladan', image: '/images/arc-tahfidz.jpg', desc: 'Pojok literasi ramah anak yang dilengkapi ragam buku cerita bergambar sirah nabawiyah dan akhlak terpuji.', category: 'Literasi Usia Dini' }
    ] : [
      { name: 'Masjid & Pusat Halaqah Qur\'an', image: '/images/arc-tahfidz.jpg', desc: 'Pusat ibadah harian dan bimbingan tahfidz bersama dewan guru.', category: 'Ibadah & Karakter' },
      { name: 'Ruang Kelas Nyaman Ber-AC', image: '/images/arc-ustadz.jpg', desc: 'Dilengkapi pendingin udara, proyektor interaktif, dan pencahayaan alami sehat.', category: 'Aktivitas Kelas' },
      { name: 'Laboratorium Komputer & Sains', image: '/images/sd-hero-greenhouse.jpg', desc: 'Fasilitas praktikum teknologi informasi dan riset sains terpadu.', category: 'Teknologi' },
      { name: 'Sarana Olahraga & Bermain', image: '/images/sd-hero-activity.jpg', desc: 'Area panahan, futsal, dan sarana kebugaran jasmani murid.', category: 'Prestasi & Bakat' }
    ]
  );

  const defaultTestimonialsForSchool = schoolSlug === 'sd' ? [
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
  ] : schoolSlug === 'smp' ? [
    {
      name: 'dr. H. Hendra Lesmana, Sp.PD.',
      role: 'Orang Tua dari Fatih (Alumni & Murid SMP IT)',
      quote: 'Pilihan terbaik untuk jenjang menengah pertama di Majalengka. Target hafalan Qur\'annya terukur dengan metode mutqin yang sangat baik, dan ananda sangat mandiri serta santun kepada orang tua.'
    },
    {
      name: 'Ibu Hj. Siti Sarah Fauziyyah, M.Pd.',
      role: 'Wali Murid Kelas VIII SMP IT',
      quote: 'Perkembangan karakter dan kedisiplinan shalat berjamaah ananda luar biasa berkat Mutaba\'ah Digital dan SCD. Lingkungan pergaulannya sangat terjaga dari pengaruh negatif luar.'
    },
    {
      name: 'Bapak Ahmad Junaedi, S.T.',
      role: 'Wali Murid Siswi Kelas IX SMP IT',
      quote: 'Guru-guru asatidz mendampingi murid dengan penuh kesabaran seperti anak sendiri. Fasilitas kelasnya sangat nyaman dan program bahasanya terbukti aktif.'
    },
    {
      name: 'Ibu Nurul Aini, S.Farm., Apt.',
      role: 'Wali Murid Kelas VII SMP IT',
      quote: 'Sistem fullday terintegrasi dengan baik antara kurikulum nasional dan nilai pesantren. Anak kami selalu semangat ke sekolah dan prestasinya membanggakan.'
    }
  ] : schoolSlug === 'tk' ? [
    {
      name: 'Ibu Ratna Dewi, S.Pd',
      role: 'Wali Murid Kelompok B TK IT',
      quote: 'Alhamdulillah ananda senang sekali sekolah di TK IT Al-Afiyah. Metode sentranya membuat anak ceria, hafal doa harian, dan mandiri tanpa rewel.'
    },
    {
      name: 'Bapak Dedi Suhendar',
      role: 'Wali Murid Kelompok A TK IT',
      quote: 'Bunda gurunya sangat telaten dan sabar. Toilet training dan adab makannya berhasil diterapkan di rumah.'
    }
  ] : [
    { name: 'dr. H. Asep Irawan Sp.A', role: `Wali Murid ${school.name}`, quote: 'Alhamdulillah, semenjak sekolah di Al-Afiyah, ananda menjadi sangat mandiri, disiplin shalat, dan bacaan Qur\'annya sangat tartil.' },
    { name: 'Ibu Hj. Rina Nurhasanah S.Pd', role: `Wali Murid ${school.name}`, quote: 'Lingkungan belajar islami yang hangat dan para dewan guru yang mendidik dengan sepenuh hati. Pilihan terbaik di Majalengka.' }
  ];

  const testimonialsPayload = (sectionsMap.testimonials && sectionsMap.testimonials.length > 0)
    ? sectionsMap.testimonials
    : defaultTestimonialsForSchool;

  const rawTuition = (sectionsMap.tuition as any) || {};
  const tuitionPayload = {
    ...rawTuition,
    registrationFee: rawTuition.registrationFee ?? school.registrationFee ?? (schoolSlug === 'tk' ? 150000 : schoolSlug === 'smp' ? 200000 : 250000),
    monthlyTuition: rawTuition.monthlyTuition ?? (schoolSlug === 'tk' ? 250000 : schoolSlug === 'sd' ? 450000 : 300000),
    developmentFee: rawTuition.developmentFee ?? rawTuition.buildingFee ?? (schoolSlug === 'tk' ? 2500000 : schoolSlug === 'sd' ? 3500000 : 2500000),
    buildingFee: rawTuition.buildingFee ?? rawTuition.developmentFee ?? (schoolSlug === 'tk' ? 2500000 : schoolSlug === 'sd' ? 3500000 : 2500000),
    learningFacilities: rawTuition.learningFacilities ?? (schoolSlug === 'smp' ? 500000 : undefined),
    uniformIkhwan: rawTuition.uniformIkhwan ?? (schoolSlug === 'smp' ? 1100000 : undefined),
    uniformAkhwat: rawTuition.uniformAkhwat ?? (schoolSlug === 'smp' ? 1400000 : undefined),
    bookPackage: rawTuition.bookPackage ?? (schoolSlug === 'smp' ? 1000000 : undefined),
    studentActivities: rawTuition.studentActivities ?? (schoolSlug === 'smp' ? 1700000 : undefined),
    quota: rawTuition.quota ?? school.quota ?? (schoolSlug === 'tk' ? 30 : 60),
    waveName: rawTuition.waveName ?? school.waveName ?? (schoolSlug === 'sd' ? 'Gelombang 1 (T.A. 2027/2028)' : 'Gelombang 1 (2027/2028)'),
    discounts: rawTuition.discounts ?? (schoolSlug === 'smp' ? [
      { title: 'FREE 70% Uang Bangunan', target: 'Khusus Siswa Lulusan SDIT Al Afiyah', saving: 1750000, finalBuildingFee: 750000 },
      { title: 'FREE 50% Uang Bangunan', target: 'Untuk Siswa dari Luar SDIT (Umum)', saving: 1250000, finalBuildingFee: 1250000 }
    ] : undefined),
    waves: rawTuition.waves ?? (schoolSlug === 'smp' ? [
      { name: 'SPMB Gelombang 1', period: '1 Oktober 2026 – 28 Februari 2027', status: 'Sedang Dibuka' },
      { name: 'SPMB Gelombang 2', period: '1 Maret 2027 – 30 Juni 2027', status: 'Tahap Lanjutan' }
    ] : undefined)
  };

  // Ensure SDIT slides adhere strictly to the universal headline (no 'Ananda' and identical text across slides)
  let initialSlides = heroPayload.slides || defaultSlides;
  if (schoolSlug === 'sd' && Array.isArray(initialSlides)) {
    const first = initialSlides[0] || defaultSlides[0];
    const baseHeadline1 = 'Bukan Sekedar Tempat Belajar, Namun Juga ';
    const baseHighlight = 'Tempat Bertumbuh';
    initialSlides = initialSlides.slice(0, 3).map((s: any, idx: number) => ({
      ...s,
      id: s.id ?? idx + 1,
      badge: first.badge || 'SPMB T.A. 2027/2028 • TELAH DIBUKA',
      titlePart1: baseHeadline1,
      titleHighlight: baseHighlight,
      titlePart2: '',
      description: first.description || 'Mencetak generasi sholeh, cerdas, mandiri, berwawasan, dan berakhlakul islami dengan prinsip Smart Akhlak Fitrah serta bimbingan metode karakter nabawiyah.',
      primaryCtaText: first.primaryCtaText || 'Daftar SPMB SDIT',
      primaryCtaLink: first.primaryCtaLink || '/ppdb/daftar?school=sd',
      secondaryCtaText: first.secondaryCtaText || 'WhatsApp (0813-1013-9001)',
      secondaryCtaLink: first.secondaryCtaLink || `https://wa.me/${school.waCenterPhone}`,
      trustItems: first.trustItems || defaultSlides[0].trustItems,
      image: s.image || defaultSlides[idx]?.image || '/images/sd-hero-greenhouse.jpg'
    }));
  }

  const initialData: CMSInitialData = {
    hero: {
      headline: heroPayload.headline || `Penerimaan Peserta Didik Baru (PPDB) ${school.name}`,
      subheadline: heroPayload.subheadline || school.tagline,
      academicYear: heroPayload.academicYear || '2027/2028',
      quotaRemaining: heroPayload.quotaRemaining || school.quota || 25,
      slides: initialSlides
    },
    identity: {
      name: identityPayload.name || school.name,
      badgeText: identityPayload.badgeText || school.badgeText,
      tagline: identityPayload.tagline || school.tagline,
      schoolAddress: identityPayload.schoolAddress || identityPayload.address || school.address,
      mapsUrl: identityPayload.mapsUrl || 'https://maps.google.com/?q=Majalengka',
      whatsappNumber: identityPayload.whatsappNumber || identityPayload.waCenterPhone || school.waCenterPhone,
      officerName: identityPayload.officerName || 'Panitia PPDB Al-Afiyah',
      email: identityPayload.email || 'info@alafiyah.id',
      consultationHours: identityPayload.consultationHours || 'Senin - Sabtu: 07.30 - 15.00 WIB'
    },
    stats: statsPayload,
    values: valuesPayload,
    programs: programsPayload,
    facilities: facilitiesPayload,
    testimonials: testimonialsPayload,
    tuition: tuitionPayload,
    affiliate: (sectionsMap.affiliate as any) || undefined,
    presetImages: (sectionsMap.preset_images as any) || undefined,
    sdKarakter: (sectionsMap.sd_karakter as any) || (schoolSlug === 'sd' ? DEFAULT_SD_KARAKTER : undefined),
    sdProfil: (sectionsMap.sd_profil as any) || (schoolSlug === 'sd' ? DEFAULT_SD_PROFIL : undefined),
    smpKarakter: (sectionsMap.smp_karakter as any) || (schoolSlug === 'smp' ? DEFAULT_SMP_KARAKTER : undefined),
    smpProfil: (sectionsMap.smp_profil as any) || (schoolSlug === 'smp' ? DEFAULT_SMP_PROFIL : undefined)
  };

  const session = await getSession();
  const currentRole = session?.role || (schoolSlug === 'foundation' ? 'SUPERADMIN' : `ADMIN_${schoolSlug.toUpperCase()}`);
  const currentUserName = session?.fullName || `Admin ${school.name}`;
  const isSuperAdmin = currentRole === 'SUPERADMIN';

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar
        currentRole={currentRole}
        userName={currentUserName}
        schoolSlug={schoolSlug as any}
        schoolName={school.name}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="Editor Konten CMS"
          subtitle={`Kelola slide banner, teks publik, alamat, dan pengaturan website ${school.name}`}
          userName={currentUserName}
          userRole={isSuperAdmin ? 'Superadmin Yayasan' : `Admin Unit ${school.name}`}
          currentSchoolSlug={schoolSlug as 'tk' | 'sd' | 'smp'}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full">
          <CMSEditorClient
            schoolSlug={schoolSlug}
            schoolName={school.name}
            badgeText={school.badgeText}
            initialData={initialData}
            isSuperAdmin={isSuperAdmin}
            userRole={currentRole}
          />
        </main>
      </div>
    </div>
  );
}
