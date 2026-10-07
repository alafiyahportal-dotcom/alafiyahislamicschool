import React from 'react';
import { prisma } from '@/lib/prisma';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import CMSEditorClient, { CMSInitialData } from '@/components/admin/CMSEditorClient';
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
          description: 'Mencetak generasi sholeh, cerdas, mandiri, berwawasan, dan berakhlakul islami dengan prinsip Smart Akhlaq Fitrah serta bimbingan metode karakter nabawiyah.',
          primaryCtaText: 'Daftar SPMB SD IT',
          primaryCtaLink: '/ppdb/daftar?school=sd',
          secondaryCtaText: 'WhatsApp (0813-1013-9001)',
          secondaryCtaLink: `https://wa.me/${school.waCenterPhone}`,
          image: '/images/sd-hero-greenhouse.jpg',
          trustItems: [
            { icon: 'shield' as const, text: 'Kuota Terbatas: Hanya 2 Rombel' },
            { icon: 'check' as const, text: 'Smart Akhlaq Fitrah' },
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
          description: 'Mencetak generasi sholeh, cerdas, mandiri, berwawasan, dan berakhlakul islami dengan prinsip Smart Akhlaq Fitrah serta bimbingan metode karakter nabawiyah.',
          primaryCtaText: 'Daftar SPMB SD IT',
          primaryCtaLink: '/ppdb/daftar?school=sd',
          secondaryCtaText: 'WhatsApp (0813-1013-9001)',
          secondaryCtaLink: `https://wa.me/${school.waCenterPhone}`,
          image: '/images/sd-hero-garden.jpg',
          trustItems: [
            { icon: 'shield' as const, text: 'Kuota Terbatas: Hanya 2 Rombel' },
            { icon: 'check' as const, text: 'Smart Akhlaq Fitrah' },
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
          description: 'Mencetak generasi sholeh, cerdas, mandiri, berwawasan, dan berakhlakul islami dengan prinsip Smart Akhlaq Fitrah serta bimbingan metode karakter nabawiyah.',
          primaryCtaText: 'Daftar SPMB SD IT',
          primaryCtaLink: '/ppdb/daftar?school=sd',
          secondaryCtaText: 'WhatsApp (0813-1013-9001)',
          secondaryCtaLink: `https://wa.me/${school.waCenterPhone}`,
          image: '/images/sd-hero-activity.jpg',
          trustItems: [
            { icon: 'shield' as const, text: 'Kuota Terbatas: Hanya 2 Rombel' },
            { icon: 'check' as const, text: 'Smart Akhlaq Fitrah' },
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
  const statsPayload = sectionsMap.stats || heroPayload.stats || [
    { label: 'Murid Aktif', value: schoolSlug === 'foundation' ? '850+' : schoolSlug === 'tk' ? '120+' : schoolSlug === 'sd' ? '450+' : '280+' },
    { label: 'Dewan Guru Berpengalaman', value: schoolSlug === 'foundation' ? '75+ Pendidik' : schoolSlug === 'tk' ? '14 Guru' : schoolSlug === 'sd' ? '38 Guru' : '25 Pendidik' },
    { label: 'Akreditasi Lembaga', value: 'Terakreditasi B' },
    { label: 'Target Tahfidz', value: schoolSlug === 'tk' ? 'Juz 30 Ceria' : schoolSlug === 'sd' ? 'Juz 30 Mutqin' : '3-5 Juz Tartil' }
  ];

  const valuesPayload = sectionsMap.values || [
    { title: 'Akidah & Akhlakul Karimah', description: 'Penanaman adab nabawiyah, pembiasaan shalat berjamaah, dan birrul walidain.' },
    { title: 'Tahsin & Tahfidz Al-Qur\'an', description: 'Metode bimbingan talaqqi ramah anak dengan target hafalan mutqin dan tartil.' },
    { title: 'Sains & Teknologi Unggulan', description: 'Laboratorium interaktif, pembelajaran nalar logika, dan literasi digital beradab.' }
  ];

  const programsPayload = sectionsMap.programs || [
    { title: 'Tahfidz Al-Qur\'an Intensif', desc: 'Bimbingan bimbingan talaqqi tartil bersama dewan guru setiap pagi.', badge: 'Utama' },
    { title: 'Bilingual & Digital Literacy', desc: 'Pengenalan teknologi edukasi dan pembiasaan percakapan bahasa Arab & Inggris praktis.', badge: 'Modern' },
    { title: 'Pramuka SIT & Olahraga Sunnah', desc: 'Pembentukan karakter ksatria muslim melalui kepanduan dan panahan.', badge: 'Karakter' },
    { title: 'Parenting Qur\'ani Berkala', desc: 'Sinergi erat antara dewan guru dan wali murid demi pembiasaan anak di rumah.', badge: 'Sinergi' }
  ];

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
        desc: 'Observasi kontekstual murid SD IT Al-Afiyah di alam terbuka, menanamkan nilai kemandirian, rasa syukur, dan cinta ciptaan Allah Ta\'ala.',
        category: 'Agro-Sains & Alam',
      },
      {
        name: 'Prestasi Tim Futsal SD IT Al-Afiyah (Second Place)',
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
      { name: 'Keseruan River Tubing Cikadongdong', image: '/images/smp-tubing-1.jpg', desc: 'Outing class peserta didik mengarungi arus sungai Cikadongdong Majalengka.', category: 'Outing Class' },
      { name: 'Kekompakan Tim Peserta Didik Mengarungi Arus', image: '/images/smp-tubing-2.jpg', desc: 'Pembentukan karakter kepemimpinan & ukhuwah islamiyah peserta didik.', category: 'Rihlah' },
      { name: 'Foto Bersama Usai Pengarungan', image: '/images/smp-outing-3.jpg', desc: 'Dokumentasi kebersamaan peserta didik & dewan asatidz SMP IT Al-Afiyah.', category: 'Dokumentasi' },
      { name: 'Persiapan Outing Class River Tubing', image: '/images/smp-outing-1.jpg', desc: 'Foto bersama di spanduk selamat datang River Tubing Cikadongdong.', category: 'Persiapan' },
      { name: 'Pengarahan Keselamatan Dewan Asatidz', image: '/images/smp-outing-2.jpg', desc: 'Pembekalan adab tadabbur alam dan briefing keselamatan dari asatidz.', category: 'Pembekalan' },
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
      role: 'Wali Murid Kelas 5 SD IT',
      quote: 'Menumbuhkan kesadaran beribadah, adab, serta empati anak secara alami tanpa paksaan. Pembelajarannya yang menyenangkan dan selaras dengan tumbuh kembang anak didukung sinergi yang kuat antara sekolah dan orang tua benar-benar membentuk karakter anak yang berakhlak mulia dan mencintai ajaran Islam.'
    },
    {
      name: 'Orang Tua Murid Al-Afiyah',
      role: 'Wali Murid Kelas 2 SD IT',
      quote: 'Guru-gurunya sangat sabar dan penuh kasih sayang. Suasana sekolah ramah anak dan nilai adabnya benar-benar terasa di rumah.'
    }
  ] : [
    { name: 'dr. H. Asep Irawan Sp.A', role: `Wali Murid ${school.name}`, quote: 'Alhamdulillah, semenjak sekolah di Al-Afiyah, ananda menjadi sangat mandiri, disiplin shalat, dan bacaan Qur\'annya sangat tartil.' },
    { name: 'Ibu Hj. Rina Nurhasanah S.Pd', role: `Wali Murid ${school.name}`, quote: 'Lingkungan belajar islami yang hangat dan para dewan guru yang mendidik dengan sepenuh hati. Pilihan terbaik di Majalengka.' }
  ];

  const testimonialsPayload = (sectionsMap.testimonials && sectionsMap.testimonials.length > 0)
    ? sectionsMap.testimonials
    : defaultTestimonialsForSchool;

  const tuitionPayload = sectionsMap.tuition || {
    registrationFee: school.registrationFee || (schoolSlug === 'tk' ? 150000 : schoolSlug === 'sd' ? 200000 : 250000),
    monthlyTuition: schoolSlug === 'tk' ? 250000 : schoolSlug === 'sd' ? 400000 : 650000,
    developmentFee: schoolSlug === 'tk' ? 2500000 : schoolSlug === 'sd' ? 4500000 : 7000000,
    quota: school.quota || 60,
    waveName: school.waveName || 'Gelombang 1 (2027/2028)'
  };

  // Ensure SD IT slides adhere strictly to the universal headline (no 'Ananda' and identical text across slides)
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
      description: first.description || 'Mencetak generasi sholeh, cerdas, mandiri, berwawasan, dan berakhlakul islami dengan prinsip Smart Akhlaq Fitrah serta bimbingan metode karakter nabawiyah.',
      primaryCtaText: first.primaryCtaText || 'Daftar SPMB SD IT',
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
      email: identityPayload.email || 'info@alafiyah.sch.id',
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
    sdKarakter: (sectionsMap.sd_karakter as any) || undefined,
    sdProfil: (sectionsMap.sd_profil as any) || undefined
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
