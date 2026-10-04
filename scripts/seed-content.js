const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Menyiapkan Data Dewan Asatidz & Berita Kegiatan Sekolah...');

  const tk = await prisma.school.findUnique({ where: { slug: 'tk' } });
  const sd = await prisma.school.findUnique({ where: { slug: 'sd' } });
  const smp = await prisma.school.findUnique({ where: { slug: 'smp' } });

  if (!tk || !sd || !smp) {
    console.error('❌ Sekolah belum terdaftar di database.');
    return;
  }

  // 1. Seed Teachers if empty
  const teacherCount = await prisma.teacher.count();
  if (teacherCount === 0) {
    console.log('📝 Memasukkan data Dewan Asatidz...');

    // TK IT Teachers
    await prisma.teacher.createMany({
      data: [
        {
          schoolId: tk.id,
          name: 'Ustadzah Siti Rahmah, S.Pd.',
          role: 'Kepala Sekolah TK IT',
          specialization: 'Spesialis Pendidikan Anak Usia Dini & Parenting Karakter',
          photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop',
          bio: 'Pengalaman 12 tahun mendidik santri cilik dengan pendekatan kasih sayang, fitrah anak, dan pembiasaan adab.',
          order: 1,
          isActive: true,
        },
        {
          schoolId: tk.id,
          name: 'Ustadzah Nurul Hidayati, S.Pd.I',
          role: 'Koordinator Sentra Tahsin & Adab',
          specialization: 'Tahsin Bersertifikat Qiroati & Pembiasaan Doa Harian',
          photoUrl: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?q=80&w=400&auto=format&fit=crop',
          bio: 'Fokus menanamkan kecintaan pada lantunan Al-Quran dan hafalan doa sehari-hari secara menyenangkan.',
          order: 2,
          isActive: true,
        },
        {
          schoolId: tk.id,
          name: 'Ustadzah Aisyah Maharani, S.Pd.',
          role: 'Pendidik Sentra Kreativitas & Motorik',
          specialization: 'Pengembangan Motorik Kasar-Halus & Eksplorasi Seni',
          photoUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=400&auto=format&fit=crop',
          bio: 'Mengembangkan kecerdasan kinestetik dan kemandirian santri usia emas melalui bermain edukatif.',
          order: 3,
          isActive: true,
        },
      ],
    });

    // SD IT Teachers
    await prisma.teacher.createMany({
      data: [
        {
          schoolId: sd.id,
          name: 'Ustadz H. Lukman Hakim, M.Pd.',
          role: 'Kepala Sekolah SD IT',
          specialization: 'Magister Manajemen Pendidikan & Pembina Kurikulum JSIT',
          photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
          bio: 'Berkomitmen mengintegrasikan nilai-nilai tauhid dalam setiap mata pelajaran umum dan kurikulum nasional.',
          order: 1,
          isActive: true,
        },
        {
          schoolId: sd.id,
          name: 'Ustadz Ahmad Zulfikar, Lc., S.Pd.I',
          role: 'Koordinator Tahfidz Al-Qur\'an',
          specialization: 'Sanad Al-Qur\'an Qira\'ah \'Ashim Riwayat Hafsh, Alumni Al-Azhar',
          photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
          bio: 'Membimbing talaqqi dan tahfidz juz 30 mutqin santri SD dengan metode mutqin dan tartil.',
          order: 2,
          isActive: true,
        },
        {
          schoolId: sd.id,
          name: 'Ustadzah Dewi Sartika, S.Si., M.Pd.',
          role: 'Wali Kelas Unggulan & Koordinator Sains',
          specialization: 'Sains Interaktif, Eksperimen Cilik & Matematika Nalaria Realistik',
          photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop',
          bio: 'Membimbing tim olimpiade sains santri Al-Afiyah dan pembiasaan literasi digital bermanfaat.',
          order: 3,
          isActive: true,
        },
        {
          schoolId: sd.id,
          name: 'Ustadz Rian Hidayat, S.Or.',
          role: 'Pelatih Sunnah Archery & Pandu SIT',
          specialization: 'Pelatih Panahan Lisensi Nasional & Instruktur Pramuka Islam',
          photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
          bio: 'Melatih ketangkasan fisik, fokus mental, disiplin diri, dan ketahanan stamina generasi pejuang.',
          order: 4,
          isActive: true,
        },
      ],
    });

    // SMP IT Teachers
    await prisma.teacher.createMany({
      data: [
        {
          schoolId: smp.id,
          name: 'Ustadz Dr. H. Fahmi Basyaiban, M.A.',
          role: 'Mudir Ma\'had & Kepala SMP IT',
          specialization: 'Doktor Dirasat Islamiyah, Pengampu Kajian Aqidah & Fiqih Peradaban',
          photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop',
          bio: 'Memimpin pembinaan holistik santri asrama dan fullday untuk mencetak pemimpin masa depan bertauhid lurus.',
          order: 1,
          isActive: true,
        },
        {
          schoolId: smp.id,
          name: 'Ustadz Muhammad Farhan, Lc., Al-Hafizh',
          role: 'Musyrif Utama Tahfidz & Asrama',
          specialization: 'Al-Hafizh 30 Juz Bersanad, Sanad Jazariyah & Tuhfatul Athfal',
          photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop',
          bio: 'Mendampingi santri mukim 24 jam dalam halaqah tahfidz intensif, qiyamul lail, dan kedisiplinan adab santri.',
          order: 2,
          isActive: true,
        },
        {
          schoolId: smp.id,
          name: 'Ustadzah Khadijah Zahra, M.Ed.',
          role: 'Koordinator Kurikulum Bilingual & Bahasa',
          specialization: 'Pendidikan Bahasa Inggris & Metodologi Muhadatsah Arab Modern',
          photoUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=400&auto=format&fit=crop',
          bio: 'Membangun lingkungan asrama berbahasa Arab & Inggris aktif serta membina public speaking santri.',
          order: 3,
          isActive: true,
        },
        {
          schoolId: smp.id,
          name: 'Ustadz Irfan Maulana, S.T., M.Kom.',
          role: 'Pembina Riset, Robotik & Coding',
          specialization: 'Pengembangan Teknologi Web, Kecerdasan Buatan & Robotika Edukasi',
          photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop',
          bio: 'Membina ekstrakurikuler teknologi untuk menyiapkan santri menguasai keilmuan digital di era revolusi industri.',
          order: 4,
          isActive: true,
        },
      ],
    });

    console.log('✅ Data Dewan Asatidz berhasil disimpan.');
  }

  // 2. Seed News if empty
  const newsCount = await prisma.newsPost.count();
  if (newsCount === 0) {
    console.log('📰 Memasukkan data Berita & Agenda Kegiatan...');

    // TK IT News
    await prisma.newsPost.createMany({
      data: [
        {
          schoolId: tk.id,
          title: 'Pekan Ceria Cooking Day: Melatih Kemandirian & Adab Makan Islami Santri Cilik',
          slug: 'pekan-ceria-cooking-day-tk-alafiyah',
          category: 'Kegiatan',
          excerpt: 'Santri TK IT Al-Afiyah belajar membuat bekal sehat sendiri, mengenal sayuran bergizi, dan mengamalkan doa serta adab makan Rasulullah.',
          content: `Alhamdulillah, TK IT Al-Afiyah Majalengka sukses menyelenggarakan agenda rutin Cooking Day dengan tema "Santri Mandiri, Makanan Halal & Bergizi Thayyib".\n\nKegiatan ini diikuti oleh seluruh ananda kelompok A dan B di aula bermain Al-Afiyah. Didampingi oleh bunda guru, ananda diajarkan cara mencuci tangan yang higienis, membaca doa sebelum makan, menggunakan tangan kanan, serta tidak mencela makanan.\n\n"Tujuan kegiatan ini adalah menstimulasi motorik halus anak lewat memotong buah lunak, mengoles selai, sekaligus mengenalkan konsep makanan halal dan berkah sejak dini," tutur Ustadzah Siti Rahmah, S.Pd., Kepala TK IT Al-Afiyah.`,
          coverImage: 'https://images.unsplash.com/photo-1588072432836-e10032774350?q=80&w=800&auto=format&fit=crop',
          author: 'Humas TK IT Al-Afiyah',
          isPublished: true,
          publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        },
        {
          schoolId: tk.id,
          title: 'Wisuda Tahfidz Cilik Surah Pendek Juz 30 Angkatan Ke-V',
          slug: 'wisuda-tahfidz-cilik-juz-30-angkatan-v',
          category: 'Tahfidz',
          excerpt: 'Sebanyak 35 santri balita dan usia dini Al-Afiyah berhasil menyelesaikan hafalan surat-surat pilihan Juz 30 dengan pelafalan makharijul huruf yang fasih.',
          content: `Suasana haru dan bangga menyelimuti gedung pertemuan Al-Afiyah pada acara Wisuda Tahfidz Cilik Angkatan Ke-V. Para orang tua tampak terharu saat menyaksikan ananda masing-masing melantunkan Surah An-Naba dan An-Nazi'at secara bersamaan tanpa ragu.\n\nDalam acara ini, dewan guru menyerahkan syahadah kelulusan tahsin dan selempang hafiz cilik sebagai bentuk apresiasi atas ketekunan santri cilik kita.`,
          coverImage: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=800&auto=format&fit=crop',
          author: 'Humas TK IT Al-Afiyah',
          isPublished: true,
          publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        },
      ],
    });

    // SD IT News
    await prisma.newsPost.createMany({
      data: [
        {
          schoolId: sd.id,
          title: 'Santri SD IT Al-Afiyah Raih Juara 1 Olimpiade Sains & Matematika Tingkat Jawa Barat',
          slug: 'juara-1-olimpiade-sains-matematika-jabar',
          category: 'Prestasi',
          excerpt: 'Prestasi membanggakan kembali diraih ananda Muhammad Raihan dan tim olimpiade sains SD IT Al-Afiyah dalam ajang kompetisi sains bergengsi.',
          content: `Keluarga besar SD IT Al-Afiyah bersyukur atas torehan prestasi ananda Muhammad Raihan (Kelas 5) yang meraih Medali Emas Juara 1 Olimpiade Sains Terpadu Tingkat Propinsi Jawa Barat.\n\nKeberhasilan ini membuktikan bahwa perpaduan kurikulum Al-Qur'an dan penguatan sains modern mampu melahirkan generasi yang unggul dalam ilmu duniawi dan kokoh dalam aqidah ukhrawi. Selamat kepada ananda dan dewan pembina!`,
          coverImage: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=800&auto=format&fit=crop',
          author: 'Tim Media SD IT',
          isPublished: true,
          publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        },
        {
          schoolId: sd.id,
          title: 'Semarak Kemah Ukhuwah & Latihan Kepemimpinan Pandu SIT di Buper Majalengka',
          slug: 'kemah-ukhuwah-pandu-sit-majalengka',
          category: 'Kegiatan',
          excerpt: 'Ratusan santri kelas 4-6 mengikuti perkemahan tiga hari dua malam untuk mengasah kemandirian, kekompakan regu, dan ketangguhan fisik berlandaskan adab Islam.',
          content: `Di tengah sejuknya udara Bumi Perkemahan Majalengka, santri SD IT Al-Afiyah mendirikan tenda dan mengikuti ragam agenda kepanduan Islam, mulai dari navigasi kompas, tali-temali, memasak mandiri, shalat tahajud bersama di alam terbuka, hingga lomba pioneering.\n\nKegiatan ini rutin digelar setiap semester untuk melatih jiwa kepemimpinan dan rasa persaudaraan yang kuat antar santri.`,
          coverImage: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=800&auto=format&fit=crop',
          author: 'Pembina Pramuka SIT',
          isPublished: true,
          publishedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        },
      ],
    });

    // SMP IT News
    await prisma.newsPost.createMany({
      data: [
        {
          schoolId: smp.id,
          title: 'Khataman & Uji Publik Tahfidz 30 Juz Mutqin Santri Pesantren Al-Afiyah 2026',
          slug: 'khataman-uji-publik-tahfidz-30-juz-2026',
          category: 'Tahfidz',
          excerpt: 'Sebanyak 12 santri angkatan ke-4 sukses menuntaskan tasmi bil-ghaib 30 juz sekali duduk di hadapan dewan penguji bersanad dan para masyaikh.',
          content: `Alhamdulillah tsumma alhamdulillah, sebuah nikmat agung terasa nyata di Masjid Jami' Pesantren Imam Bonjol Al-Afiyah. Dua belas santri ikhwan dan akhwat menyelesaikan Uji Publik Tahfidz 30 Juz Mutqin dengan predikat Mumtaz.\n\nUji publik ini disaksikan langsung oleh para orang tua santri dan tamu undangan dari Kantor Kementerian Agama Majalengka. Para santri diuji secara acak melanjutkan ayat dari juz 1 hingga juz 30 tanpa melihat mushaf.`,
          coverImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&auto=format&fit=crop',
          author: 'Lembaga Tahfidz Ma\'had',
          isPublished: true,
          publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        },
        {
          schoolId: smp.id,
          title: 'Daurah Bahasa Arab Intensif Bersama Masyaikh Universitas Al-Azhar Kairo',
          slug: 'daurah-bahasa-arab-masyaikh-al-azhar',
          category: 'Kegiatan',
          excerpt: 'Penguatan bahasa komunikasi santri pesantren melalui muhadatsah intensif, pembedahan kaidah nahwu sharaf aplikatif, dan retorika khutbah.',
          content: `Dalam rangka memantapkan santri berbahasa Arab aktif di lingkungan asrama, SMP IT & Pesantren Al-Afiyah mengundang pengajar tamu dari Kairo Mesir selama dua pekan.\n\nSantri diajak berinteraksi langsung dalam percakapan sehari-hari, debat ilmiah berbahasa Arab, serta menulis naskah orasi Islami. Antusiasme santri sangat luar biasa!`,
          coverImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop',
          author: 'Divisi Bahasa Asrama',
          isPublished: true,
          publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        },
      ],
    });

    console.log('✅ Data Berita & Agenda Kegiatan berhasil disimpan.');
  }

  console.log('🎉 Seeding Konten Sprint 3 Selesai dengan Sempurna!');
}

main()
  .catch((err) => {
    console.error('❌ Terjadi kesalahan seeding:', err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
