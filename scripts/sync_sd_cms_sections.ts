import { prisma } from '../src/lib/prisma';

async function main() {
  const sd = await prisma.school.findUnique({
    where: { slug: 'sd' },
    include: { cmsSections: true }
  });

  if (!sd) {
    console.error('School sd not found!');
    process.exit(1);
  }

  console.log('Found SD school:', sd.id, sd.name);

  // 1. Identity
  const identityData = {
    name: 'SD IT Al-Afiyah Majalengka',
    badgeText: 'TERAKREDITASI B • YPIB GUGUS 3 NUSA INDAH',
    tagline: 'Mendidik Generasi Sholeh, Cerdas, Mandiri, Berwawasan Luas, dan Berakhlakul Islami',
    schoolAddress: 'Lingkungan Giri Asih - Jl. Gerakan Koperasi, Kel. Majalengka Kulon, Kec. Majalengka, Kab. Majalengka 45411',
    mapsUrl: 'https://maps.google.com/?q=Majalengka',
    whatsappNumber: '6281310139001',
    officerName: 'Layanan Terpadu Tata Usaha & SPMB SD IT',
    email: 'sditalafiyahmjl@gmail.com',
    consultationHours: 'Senin - Jumat: 07.00 - 15.00 WIB • Sabtu: 07.00 - 12.00 WIB'
  };

  // 2. Stats
  const statsData = [
    { label: 'Kuota Penerimaan', value: 'Hanya 2 Rombel' },
    { label: 'Pilar Pendidikan', value: 'Smart Akhlaq Fitrah' },
    { label: 'Akreditasi Sekolah', value: 'Terakreditasi B' },
    { label: 'Bimbingan Tahfidz', value: 'Juz 30 Mutqin' }
  ];

  // 3. Values
  const valuesData = [
    {
      title: 'Mendidik dengan Sunnah & Karakter Nabawiyah',
      description: 'Mendidik dengan sunnah, menggunakan metode Pendidikan Karakter Nabawiyah, menanamkan akhlaq dan ilmu, serta iman sebelum Al-Qur\'an.'
    },
    {
      title: 'Smart, Literasi & Tahfidz Qur\'an',
      description: 'Pembelajaran terpadu penguatan basic literasi dan numerasi serta bimbingan tahfidz Juz 30 mutqin dengan suasana asri yang membahagiakan murid.'
    },
    {
      title: 'Outdoor Learning & Pelatihan Aqil-Baligh',
      description: 'Eksplorasi kontekstual di alam dan kebun pertanian terbuka, pelatihan kemandirian aqil-baligh, serta pemetaan potensi bakat dan skill murid.'
    }
  ];

  // 4. Programs (10 Real Programs)
  const programsData = [
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

  // 5. Facilities (11 Authentic Real Photos)
  const facilitiesData = [
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
  ];

  // 6. Tuition
  const tuitionData = {
    registrationFee: 250000,
    monthlyTuition: 400000,
    developmentFee: 3500000,
    quota: 60,
    waveName: 'Gelombang 1 (T.A. 2027/2028)'
  };

  const sectionsToSync = [
    { key: 'identity', payload: JSON.stringify(identityData) },
    { key: 'stats', payload: JSON.stringify(statsData) },
    { key: 'values', payload: JSON.stringify(valuesData) },
    { key: 'programs', payload: JSON.stringify(programsData) },
    { key: 'facilities', payload: JSON.stringify(facilitiesData) },
    { key: 'tuition', payload: JSON.stringify(tuitionData) }
  ];

  for (const item of sectionsToSync) {
    const existing = sd.cmsSections.find(s => s.sectionKey === item.key);
    if (existing) {
      await prisma.cMSSection.update({
        where: { id: existing.id },
        data: { payload: item.payload }
      });
      console.log(`Updated CMS section [${item.key}] for SD`);
    } else {
      await prisma.cMSSection.create({
        data: {
          schoolId: sd.id,
          sectionKey: item.key,
          payload: item.payload
        }
      });
      console.log(`Created CMS section [${item.key}] for SD`);
    }
  }

  // Also clean up hero section if it has any reference to the deleted AI image sd-hero-activity.jpg
  const heroSection = sd.cmsSections.find(s => s.sectionKey === 'hero');
  if (heroSection && heroSection.payload.includes('sd-hero-activity.jpg')) {
    const updatedPayload = heroSection.payload.replace(/\/images\/sd-hero-activity\.jpg/g, '/images/sd-hero-greenhouse.jpg');
    await prisma.cMSSection.update({
      where: { id: heroSection.id },
      data: { payload: updatedPayload }
    });
    console.log('Cleaned up deleted AI image reference in SD hero section');
  }

  console.log('All SD CMS sections successfully synchronized with actual website content!');
}

main()
  .catch((e) => {
    console.error('Error syncing SD CMS sections:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
