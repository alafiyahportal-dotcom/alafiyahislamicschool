import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Al-Afiyah Multi-Tenant Database Seeding...');

  // 1. Clean existing records in reverse order
  await prisma.notificationLog.deleteMany();
  await prisma.affiliateConversion.deleteMany();
  await prisma.affiliateProfile.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.pPDBDocument.deleteMany();
  await prisma.pPDBRegistration.deleteMany();
  await prisma.cMSSection.deleteMany();
  await prisma.user.deleteMany();
  await prisma.school.deleteMany();

  // 2. Seed 4 Schools (Tenants & Foundation)
  const tk = await prisma.school.create({
    data: {
      slug: 'tk',
      name: 'TK IT Al-Afiyah',
      unitLevel: 'TK',
      badgeText: 'PAUD / TK IT AL-AFIYAH',
      tagline: 'Membentuk Generasi Qur\'ani yang Cerdas, Mandiri & Ceria Sejak Dini',
      primaryColor: '#10B981',
      accentColor: '#FBBF24',
      registrationFee: 150000,
      quota: 40,
      waveName: 'Gelombang 1 (2026/2027)',
      isPpdbOpen: true,
      bankName: 'Bank Syariah Indonesia (BSI)',
      bankAccountNumber: '7788991122',
      bankAccountHolder: 'TK IT Al-Afiyah Majalengka',
      waCenterPhone: '6281223344551',
      address: 'Jl. Siti Armilah No. 12, Majalengka Kulon, Kec. Majalengka, Kab. Majalengka',
    },
  });

  const sd = await prisma.school.create({
    data: {
      slug: 'sd',
      name: 'SD IT Al-Afiyah',
      unitLevel: 'SD',
      badgeText: 'SD IT UNGGULAN AL-AFIYAH',
      tagline: 'Membangun Karakter Islami, Literasi Al-Qur\'an & Prestasi Unggul',
      primaryColor: '#059669',
      accentColor: '#D97706',
      registrationFee: 250000,
      quota: 60,
      waveName: 'Gelombang 1 (2026/2027)',
      isPpdbOpen: true,
      bankName: 'Bank Syariah Indonesia (BSI)',
      bankAccountNumber: '7788991123',
      bankAccountHolder: 'SD IT Al-Afiyah Majalengka',
      waCenterPhone: '6281223344552',
      address: 'Jl. Pangeran Muhammad KM 2, Simpeureum, Cigasong, Kab. Majalengka',
    },
  });

  const smp = await prisma.school.create({
    data: {
      slug: 'smp',
      name: 'SMP IT Al-Afiyah',
      unitLevel: 'SMP',
      badgeText: 'SEKOLAH MENENGAH PERTAMA ISLAM TERPADU (SMP IT)',
      tagline: 'Mencetak Generasi Pemimpin Qur\'ani Berakhlak Mulia & Berwawasan Global',
      primaryColor: '#064E3B',
      accentColor: '#B45309',
      registrationFee: 200000,
      quota: 75,
      waveName: 'Gelombang 1 (Okt 2026 - Feb 2027)',
      isPpdbOpen: true,
      bankName: 'Bank Muamalat',
      bankAccountNumber: '1360012405',
      bankAccountHolder: 'SMP IT Al Afiyah',
      waCenterPhone: '6282249357893',
      address: 'Jl. Gerakan Koperasi No. 110, Majalengka Wetan, Kec. Majalengka, Kab. Majalengka, Jawa Barat 45411',
    },
  });

  const foundation = await prisma.school.create({
    data: {
      slug: 'foundation',
      name: 'Yayasan Pendidikan Imam Bonjol',
      unitLevel: 'FOUNDATION',
      badgeText: 'PUSAT YAYASAN PENDIDIKAN IMAM BONJOL',
      tagline: 'Menaungi Lembaga Pendidikan Islam Terpadu TK IT, SD IT & SMP IT Al-Afiyah',
      primaryColor: '#184F48',
      accentColor: '#D97706',
      registrationFee: 0,
      quota: 200,
      waveName: 'Gelombang 1 (2026/2027)',
      isPpdbOpen: true,
      bankName: 'Bank Syariah Indonesia (BSI)',
      bankAccountNumber: '7788991120',
      bankAccountHolder: 'Yayasan Pendidikan Imam Bonjol Majalengka',
      waCenterPhone: '6281223344550',
      address: 'Jl. Imam Bonjol No. 01, Babakan Jawa, Cigasong, Kab. Majalengka, Jawa Barat 45411',
    },
  });

  console.log('✅ 4 Schools Seeded: TK, SD, SMP Al-Afiyah & Yayasan Foundation');

  // 3. Seed Official Master Accounts (Yayasan, Unit Admins, Unit Treasurers, Affiliates)
  const defaultPassword = bcrypt.hashSync('password123', 10);

  // A. Pimpinan Yayasan
  await prisma.user.create({
    data: {
      email: 'superadmin@alafiyah.sch.id',
      phone: '628111222333',
      passwordHash: defaultPassword,
      fullName: 'Super Admin',
      role: 'SUPERADMIN',
      schoolId: null,
    },
  });

  // B. Unit TK IT Al-Afiyah
  await prisma.user.create({
    data: {
      email: 'admin.tk@alafiyah.sch.id',
      phone: '6281223344551',
      passwordHash: defaultPassword,
      fullName: 'Admin TK IT',
      role: 'ADMIN_TK',
      schoolId: tk.id,
    },
  });

  await prisma.user.create({
    data: {
      email: 'bendahara.tk@alafiyah.sch.id',
      phone: '6281223344554',
      passwordHash: defaultPassword,
      fullName: 'Bendahara TK IT',
      role: 'FINANCE',
      schoolId: tk.id,
    },
  });

  // C. Unit SD IT Al-Afiyah
  await prisma.user.create({
    data: {
      email: 'admin.sd@alafiyah.sch.id',
      phone: '6281223344552',
      passwordHash: defaultPassword,
      fullName: 'Admin SD IT',
      role: 'ADMIN_SD',
      schoolId: sd.id,
    },
  });

  await prisma.user.create({
    data: {
      email: 'ppdb@alafiyah.sch.id',
      phone: '6285722334455',
      passwordHash: defaultPassword,
      fullName: 'Panitia PPDB SD',
      role: 'PPDB_OFFICER',
      schoolId: sd.id,
    },
  });

  await prisma.user.create({
    data: {
      email: 'bendahara.sd@alafiyah.sch.id',
      phone: '6281223344555',
      passwordHash: defaultPassword,
      fullName: 'Bendahara SD IT',
      role: 'FINANCE',
      schoolId: sd.id,
    },
  });

  // D. Unit SMP IT Al-Afiyah
  await prisma.user.create({
    data: {
      email: 'admin.smp@alafiyah.sch.id',
      phone: '6281223344553',
      passwordHash: defaultPassword,
      fullName: 'Admin SMP IT',
      role: 'ADMIN_SMP',
      schoolId: smp.id,
    },
  });

  await prisma.user.create({
    data: {
      email: 'bendahara.smp@alafiyah.sch.id',
      phone: '6281223344556',
      passwordHash: defaultPassword,
      fullName: 'Bendahara SMP IT',
      role: 'FINANCE',
      schoolId: smp.id,
    },
  });

  // E. Mitra Afiliasi
  const affiliateAhmad = await prisma.user.create({
    data: {
      email: 'afiliasi@alafiyah.sch.id',
      phone: '6281322446688',
      passwordHash: defaultPassword,
      fullName: 'Mitra Afiliasi',
      role: 'AFFILIATE',
      schoolId: null,
    },
  });

  const affiliateFatimah = await prisma.user.create({
    data: {
      email: 'mitra.alafiyah@alafiyah.sch.id',
      phone: '6281399887766',
      passwordHash: defaultPassword,
      fullName: 'Mitra Berkah',
      role: 'AFFILIATE',
      schoolId: null,
    },
  });

  console.log('✅ Official Accounts Seeded (Unit Admins & Unit Bendahara per unit, without central foundation finance)');

  // 4. Seed Official Clean Affiliate Profiles (Saldo Awal Rp 0, Siap Pakai)
  await prisma.affiliateProfile.create({
    data: {
      userId: affiliateAhmad.id,
      referralCode: 'USTADZ-AHMAD',
      customSlug: 'ustadz-ahmad',
      bankName: 'Bank Syariah Indonesia (BSI)',
      bankAccountNumber: '7123456789',
      bankAccountHolder: 'Ahmad Al-Hafidz',
      totalEarned: 0,
      balance: 0,
    },
  });

  await prisma.affiliateProfile.create({
    data: {
      userId: affiliateFatimah.id,
      referralCode: 'MITRA-BERKAH',
      customSlug: 'mitra-berkah',
      bankName: 'Bank Syariah Indonesia (BSI)',
      bankAccountNumber: '7988776655',
      bankAccountHolder: 'Fatimah Azzahra',
      totalEarned: 0,
      balance: 0,
    },
  });

  console.log('✅ Official Affiliate Profiles Seeded (Saldo Awal Rp 0)');

  // 5. Seed CMS Sections for SD IT Al-Afiyah
  const sdCmsHero = {
    headline: 'Membangun Generasi Emas Qur\'ani & Berprestasi di Majalengka',
    subheadline: 'Sekolah Dasar Islam Terpadu dengan kurikulum terintegrasi, pembinaan tahfidz juz 30, adab harian, dan keunggulan sains modern.',
    heroImage: '/images/sd-hero-greenhouse.jpg',
    stats: [
      { label: 'Murid Aktif', value: '450+' },
      { label: 'Dewan Guru Berpengalaman', value: '38 Guru' },
      { label: 'Akreditasi Lembaga', value: 'A (Unggul)' },
      { label: 'Target Tahfidz', value: 'Juz 30 Mutqin' },
    ],
  };

  const sdCmsValues = [
    {
      title: 'Akidah & Akhlakul Karimah',
      description: 'Penanaman adab Islam sebelum ilmu, pembiasaan shalat dhuha dan dzuhur berjamaah, serta birrul walidain.',
      icon: 'HeartHandshake',
    },
    {
      title: 'Tahsin & Tahfidz Al-Qur\'an',
      description: 'Metode bimbingan talaqqi tartil yang ramah anak dengan target hafalan mutqin dan tartil.',
      icon: 'BookOpen',
    },
    {
      title: 'Sains & Bahasa Unggulan',
      description: 'Laboratorium komputer interaktif, pembelajaran matematika logika ceria, dan pembiasaan kosakata Arab-Inggris.',
      icon: 'Compass',
    },
  ];

  const sdCmsPrograms = [
    {
      title: 'Kelas Tahfidz Intensif',
      desc: 'Program bimbingan khusus hafalan Al-Qur\'an dengan pendampingan guru tahfidz berdedikasi setiap pagi.',
      badge: 'Unggulan',
    },
    {
      title: 'Bilingual & Digital Literacy',
      desc: 'Pengenalan teknologi edukasi dan percakapan harian Bahasa Arab dan Inggris praktis.',
      badge: 'Modern',
    },
    {
      title: 'Pramuka SIT & Panahan Sunnah',
      desc: 'Ekstrakurikuler pembentukan karakter ksatria muslim, kepanduan, dan olahraga sunnah.',
      badge: 'Karakter',
    },
    {
      title: 'Parenting Qur\'ani & Field Trip',
      desc: 'Sinergi berkala antara dewan guru dan wali murid demi kesinambungan adab anak di rumah.',
      badge: 'Komunitas',
    },
  ];

  const sdCmsTestimonials = [
    {
      name: 'dr. H. Asep Irawan Sp.A',
      role: 'Wali Murid Kelas 4 SD IT',
      quote: 'Alhamdulillah, semenjak sekolah di Al-Afiyah, ananda menjadi sangat disiplin shalat lima waktu tanpa disuruh dan bacaan Qur\'annya sangat tartil.',
    },
    {
      name: 'Orang Tua Murid Al-Afiyah',
      role: 'Wali Murid Kelas 2 SD IT',
      quote: 'Guru-gurunya sangat sabar dan penuh kasih sayang. Suasana sekolah ramah anak dan nilai adabnya benar-benar terasa di rumah.',
    },
  ];

  await prisma.cMSSection.create({
    data: {
      schoolId: sd.id,
      sectionKey: 'hero',
      payload: JSON.stringify(sdCmsHero),
    },
  });

  await prisma.cMSSection.create({
    data: {
      schoolId: sd.id,
      sectionKey: 'values',
      payload: JSON.stringify(sdCmsValues),
    },
  });

  await prisma.cMSSection.create({
    data: {
      schoolId: sd.id,
      sectionKey: 'programs',
      payload: JSON.stringify(sdCmsPrograms),
    },
  });

  await prisma.cMSSection.create({
    data: {
      schoolId: sd.id,
      sectionKey: 'testimonials',
      payload: JSON.stringify(sdCmsTestimonials),
    },
  });

  // Seed CMS Sections for TK & SMP
  await prisma.cMSSection.create({
    data: {
      schoolId: tk.id,
      sectionKey: 'hero',
      payload: JSON.stringify({
        headline: 'Taman Tumbuh Kembang Murid Cilik yang Ceria & Shalih',
        subheadline: 'PAUD & TK Islam Terpadu dengan pendekatan belajar sambil bermain, pengenalan huruf hijaiyah, dan adab harian sejak usia dini.',
        heroImage: '/images/tk-hero-kids.jpg',
        stats: [
          { label: 'Murid Cilik', value: '120+' },
          { label: 'Ustadzah Pendidik', value: '14 Guru' },
          { label: 'Rasio Kelas', value: '1:8 Ramah' },
          { label: 'Kurikulum', value: 'Sentra & Adab' },
        ],
      }),
    },
  });

  await prisma.cMSSection.create({
    data: {
      schoolId: smp.id,
      sectionKey: 'hero',
      payload: JSON.stringify({
        headline: 'Mencetak Murid Intelektual, Berwawasan Global & Hafidz Qur\'an',
        subheadline: 'Sekolah Menengah Pertama Islam Terpadu (Fullday School) dengan target hafalan 3-5 Juz mutqin & tartil, penguasaan Bahasa Arab aktif, SCD, Mutaba\'ah Digital & Futsal Development Program.',
        heroImage: '/images/smp-tubing-1.jpg',
        stats: [
          { label: 'Murid Aktif', value: '280+' },
          { label: 'Dewan Guru Berkompeten', value: '25 Pendidik' },
          { label: 'Target Tahfidz', value: '3-5 Juz' },
          { label: 'Akreditasi', value: 'A (Unggul)' },
        ],
        slides: [
          {
            id: 1,
            badge: 'RIHLAH & OUTING CLASS SANTRI SMP IT AL-AFIYAH',
            titlePart1: 'Petualangan Seru ',
            titleHighlight: 'River Tubing',
            titlePart2: ' Cikadongdong Majalengka',
            description: 'Menumbuhkan keberanian, jiwa kepemimpinan, kemandirian, dan ukhuwah islamiyah santri menyusuri aliran sungai Cikadongdong.',
            primaryCtaText: 'Daftar SPMB SMP IT',
            primaryCtaLink: '/ppdb/daftar',
            secondaryCtaText: 'Lihat Galeri Kegiatan',
            secondaryCtaLink: '#galeri',
            image: '/images/smp-tubing-1.jpg',
          },
          {
            id: 2,
            badge: 'PROGRAM UNGGULAN TAHFIDZ 3-5 JUZ & BILINGUAL',
            titlePart1: 'Membentuk Generasi ',
            titleHighlight: 'Qur\'ani',
            titlePart2: ' & Berakhlak Mulia',
            description: 'Target hafalan Al-Qur\'an mutqin Juz 28, 29, 30 dan kelas unggulan 5+ Juz, fasih Bahasa Arab aktif lisan/tulisan, serta SCD & Mutaba\'ah Digital.',
            primaryCtaText: 'Brosur & Biaya Pendidikan',
            primaryCtaLink: '/ppdb',
            secondaryCtaText: 'Hubungi WA Center',
            secondaryCtaLink: 'https://wa.me/6282249357893',
            image: '/images/smp-outing-3.jpg',
          },
          {
            id: 3,
            badge: 'PEMBINAAN KARAKTER & KELESTARIAN ALAM',
            titlePart1: 'Kekompakan Santri & ',
            titleHighlight: 'Dewan Asatidz',
            titlePart2: ' Al-Afiyah',
            description: 'Kegiatan luar kelas yang menyenangkan untuk membentuk santri yang tangguh, peduli lingkungan, dan berakhlakul karimah.',
            primaryCtaText: 'Info SPMB Gelombang 1',
            primaryCtaLink: '/ppdb/daftar',
            secondaryCtaText: 'Program Unggulan',
            secondaryCtaLink: '#program-unggulan',
            image: '/images/smp-tubing-2.jpg',
          },
        ],
      }),
    },
  });

  // Gallery CMS Section for SMP IT
  await prisma.cMSSection.create({
    data: {
      schoolId: smp.id,
      sectionKey: 'gallery',
      payload: JSON.stringify([
        { title: 'Keseruan River Tubing Cikadongdong', image: '/images/smp-tubing-1.jpg', category: 'Outing Class' },
        { title: 'Kekompakan Tim Santri Mengarungi Arus', image: '/images/smp-tubing-2.jpg', category: 'Rihlah' },
        { title: 'Foto Bersama Usai Pengarungan', image: '/images/smp-outing-3.jpg', category: 'Dokumentasi' },
        { title: 'Persiapan Outing Class River Tubing', image: '/images/smp-outing-1.jpg', category: 'Persiapan' },
        { title: 'Pengarahan Keselamatan Dewan Asatidz', image: '/images/smp-outing-2.jpg', category: 'Pembekalan' },
      ]),
    },
  });

  // News Posts for SMP IT
  await prisma.newsPost.deleteMany({ where: { schoolId: smp.id } });
  await prisma.newsPost.createMany({
    data: [
      {
        schoolId: smp.id,
        title: 'Keseruan Outing Class & Rihlah Santri SMP IT Al-Afiyah: Arungi River Tubing Cikadongdong Majalengka',
        slug: 'keseruan-outing-class-river-tubing-cikadongdong-smp-it',
        category: 'Kegiatan',
        excerpt: 'Santri SMP IT Al-Afiyah Majalengka bersama dewan asatidz menggelar Rihlah & Outing Class menyusuri wawasan alam River Tubing Cikadongdong Majalengka dengan penuh keceriaan.',
        content: `MAJALENGKA — Para santri Sekolah Menengah Pertama Islam Terpadu (SMP IT) Al-Afiyah Majalengka mengikuti kegiatan Rihlah & Outing Class yang penuh petualangan di wahana wisata alam River Tubing Cikadongdong, Kabupaten Majalengka.

Kegiatan ini merupakan bagian integral dari program Student Character Development (SCD) untuk mengasah keberanian, kepemimpinan, kedisiplinan, serta semangat gotong royong dan ukhuwah islamiyah para santri di luar ruang kelas.

Dengan didampingi dewan asatidz pembimbing dan instruktur profesional, para santri mengenakan perlengkapan keselamatan standar internasional berupa helm pelindung dan jaket pelampung keselamatan sebelum meluncur menyusuri arus jernih sungai Cikadongdong.

"Alhamdulillah seluruh santri tampak sangat ceria, disiplin mengikuti instruksi keselamatan, dan kompak saling membantu sepanjang pengarungan. Kegiatan outdoor ini menjadi ajang menyegarkan semangat hafalan Al-Qur'an dan studi akademik santri," ungkap salah satu Ustadz pembimbing.

Seluruh rangkaian kegiatan ditutup dengan sesi foto kebersamaan dan ramah tamah antarsantri dan dewan guru.`,
        coverImage: '/images/smp-tubing-1.jpg',
        author: 'Humas SMP IT Al-Afiyah',
        isPublished: true,
        publishedAt: new Date('2026-10-04T08:00:00Z'),
      },
      {
        schoolId: smp.id,
        title: 'Pengarahan Adab & Keselamatan Rihlah Alam Bersama Dewan Asatidz SMP IT Al-Afiyah',
        slug: 'pengarahan-adab-keselamatan-rihlah-smp-it-al-afiyah',
        category: 'Kegiatan',
        excerpt: 'Sebelum memulai pengarungan sungai Cikadongdong, santri mendapatkan pembekalan adab tadabbur alam dan prosedur keselamatan dari dewan asatidz.',
        content: `MAJALENGKA — Pembentukan karakter santri SMP IT Al-Afiyah senantiasa mengedepankan penanaman adab dalam setiap aktivitas. Sebelum memulai wahana tantangan air di Cikadongdong, seluruh santri berkumpul mendapatkan pengarahan keselamatan dan doa bersama.

Asatidz mengingatkan pentingnya menjaga adab bersikap di alam bebas, menjaga kebersihan lingkungan, serta senantiasa mengingat kebesaran Allah SWT dalam keindahan ciptaan-Nya.`,
        coverImage: '/images/smp-outing-2.jpg',
        author: 'Ustadz Rio (Kesiswaan)',
        isPublished: true,
        publishedAt: new Date('2026-10-03T10:00:00Z'),
      },
      {
        schoolId: smp.id,
        title: 'Penguat Ukhuwah Islamiyah: Potret Kebersamaan Rihlah Santri & Asatidz SMP IT Al-Afiyah',
        slug: 'potret-kebersamaan-rihlah-santri-smp-it-al-afiyah',
        category: 'Kegiatan',
        excerpt: 'Kegembiraan dan rasa syukur terpancar dari seluruh peserta Rihlah SMP IT Al-Afiyah setelah sukses menaklukkan trek River Tubing Cikadongdong.',
        content: `MAJALENGKA — Rasa syukur dan kebahagiaan memenuhi wajah para santri dan dewan asatidz SMP IT Al-Afiyah setelah menyelesaikan pengarungan arum jeram tubing dengan selamat dan penuh kebersamaan.

Kegiatan rihlah ini semakin mempererat ikatan kekeluargaan antara guru dan santri, menciptakan kenangan berharga yang memotivasi semangat belajar santri di sekolah.`,
        coverImage: '/images/smp-outing-3.jpg',
        author: 'Tim Media Al-Afiyah',
        isPublished: true,
        publishedAt: new Date('2026-10-02T14:00:00Z'),
      },
    ],
  });

  // News Posts for SD IT
  await prisma.newsPost.deleteMany({ where: { schoolId: sd.id } });
  await prisma.newsPost.createMany({
    data: [
      {
        schoolId: sd.id,
        title: 'Pengumuman Resmi SPMB SD IT Al-Afiyah T.A. 2026/2027: Kuota Terbatas Hanya 2 Rombel',
        slug: 'pengumuman-resmi-spmb-sdit-al-afiyah-2026-2027',
        category: 'Pengumuman',
        excerpt: 'Sistem Penerimaan Murid Baru (SPMB) SD IT Al-Afiyah T.A. 2026/2027 resmi dibuka. Kuota terbatas hanya 2 rombel dengan 8 program unggulan terpadu. Unduh poster dan brosur resmi di sini.',
        content: `Bismillah, Yayasan Pendidikan Imam Bonjol Majalengka bersama dewan asatidzah SD IT Al-Afiyah mengumumkan pembukaan Sistem Penerimaan Murid Baru (SPMB) Tahun Ajaran 2026/2027.

Bukan sekadar tempat belajar, SD IT Al-Afiyah adalah tempat bertumbuh yang mendidik dengan sunnah Rasulullah ﷺ, metode karakter nabawiyah, dan pembiasaan adab sebelum ilmu. Demi menjaga rasio pendampingan yang intensif dan berkualitas, kuota penerimaan murid baru dibatasi HANYA 2 Rombongan Belajar (Rombel).

Ayah dan Bunda dapat mengunduh poster/brosur resmi sekolah untuk informasi lengkap, serta melakukan registrasi online melalui portal resmi SPMB Al-Afiyah.`,
        coverImage: '/images/sd-spmb-poster.jpg',
        author: 'Panitia SPMB 2026/2027',
        isPublished: true,
        publishedAt: new Date('2026-09-26T09:00:00Z'),
      },
      {
        schoolId: sd.id,
        title: 'Field Study SD IT Al-Afiyah di P4S An-Nabawiyah: Praktik Pertanian & Perikanan Smart Akhlak Fitrah',
        slug: 'field-study-sd-it-al-afiyah-p4s-an-nabawiyah',
        category: 'Field Study',
        excerpt: 'Puluhan murid SD IT Al-Afiyah mengikuti kegiatan field study di P4S An-Nabawiyah. Murid belajar memindahkan semai bibit sayur ke polybag, observasi greenhouse bambu, dan edukasi budidaya perikanan biofloc.',
        content: `Alhamdulillah, dalam rangka mewujudkan kurikulum kontekstual berbasis alam dan karakter, murid-murid SD IT Al-Afiyah melaksanakan kegiatan "Field Study: Smart Akhlak Fitrah" bertempat di Pusat Pelatihan Pertanian dan Perdesaan Swadaya (P4S) An-Nabawiyah. Kegiatan edukasi luar kelas ini dirancang untuk mengenalkan fitrah anak terhadap alam semesta dan menumbuhkan rasa syukur atas limpahan rezeki ciptaan Allah Ta'ala.`,
        coverImage: '/images/sd-field-study-banner.jpg',
        author: 'Humas SD IT Al-Afiyah',
        isPublished: true,
        publishedAt: new Date('2026-09-25T08:00:00Z'),
      },
      {
        schoolId: sd.id,
        title: 'Alhamdulillah! Tim Futsal SD IT Al-Afiyah Raih Juara 2 (Second Place) Tingkat Daerah',
        slug: 'tim-futsal-sd-it-al-afiyah-raih-juara-2',
        category: 'Prestasi',
        excerpt: 'Prestasi membanggakan kembali ditorehkan murid-murid SD IT Al-Afiyah. Tim Futsal sekolah berhasil menyabet gelar Second Place dalam kejuaraan futsal antar-sekolah tingkat daerah.',
        content: `Keluarga besar SD IT Al-Afiyah bersyukur atas torehan prestasi membanggakan yang diraih oleh Tim Futsal murid SD IT Al-Afiyah. Dalam turnamen kompetisi futsal pelajar tingkat daerah, tim sekolah sukses menembus babak final dan mengamankan posisi Juara 2 (Second Place). Pihak sekolah senantiasa mendukung penuh penyaluran minat dan bakat murid.`,
        coverImage: '/images/sd-futsal-champion.jpg',
        author: 'Pembina Olahraga SD IT',
        isPublished: true,
        publishedAt: new Date('2026-09-23T08:00:00Z'),
      },
      {
        schoolId: sd.id,
        title: 'Pembiasaan Adab Shalat Berjamaah dan Pelatihan Da\'i Cilik SD IT Al-Afiyah',
        slug: 'pembiasaan-shalat-berjamaah-daicilik-sdit-al-afiyah',
        category: 'Kegiatan',
        excerpt: 'Menanamkan adab sebelum ilmu dan iman sebelum Al-Qur\'an, murid SD IT Al-Afiyah dibimbing pembiasaan shalat berjamaah serta latihan muhadharah da\'i cilik berani tampil.',
        content: `Alhamdulillah, salah satu ruh pendidikan di SD IT Al-Afiyah adalah penguatan karakter nabawiyah dan pembiasaan ibadah praktis sejak dini.

Setiap hari, siswi dan siswa dibimbing melaksanakan shalat berjamaah dengan tertib, bersih, dan khusyuk di lingkungan kelas yang asri. Selain itu, untuk melatih kepemimpinan dan rasa percaya diri, murid-murid bergiliran memegang mikrofon dalam agenda muhadharah (latihan pidato da'i cilik) serta kultum mandiri menyampaikan nasihat kebaikan kepada rekan sekelasnya.

Dengan suasana kelas yang hangat dan penuh kasih sayang ("Here's Your Second Home"), SD IT Al-Afiyah terus berkomitmen menjadi tempat bertumbuh terbaik bagi ananda.`,
        coverImage: '/images/sd-activity-shalat-berjamaah.jpg',
        author: 'Kesiswaan SD IT Al-Afiyah',
        isPublished: true,
        publishedAt: new Date('2026-09-27T08:00:00Z'),
      },
      {
        schoolId: sd.id,
        title: 'Selamat Melaksanakan Sumatif Tengah Semester (STS) 1 SD IT Al-Afiyah',
        slug: 'sumatif-tengah-semester-1-sdit-al-afiyah',
        category: 'Pengumuman',
        excerpt: 'Pelaksanaan Sumatif Tengah Semester (STS) Semester 1 TP 2026/2027 SD IT Al-Afiyah dimulai dengan menjunjung tinggi nilai kejujuran, ketelitian, dan prinsip Smart Akhlaq Fitrah.',
        content: `Bismillah, segenap pimpinan Yayasan, kepala sekolah, dan dewan asatidzah mengucapkan selamat melaksanakan Sumatif Tengah Semester (STS) 1 bagi seluruh murid SD IT Al-Afiyah. Kegiatan asesmen ini dirancang sebagai wahana pembentukan karakter murid yang jujur, teliti, mandiri, dan beradab.`,
        coverImage: '/images/sts-semester-1-sdit.jpg',
        author: 'Kurikulum SD IT Al-Afiyah',
        isPublished: true,
        publishedAt: new Date('2026-09-20T08:00:00Z'),
      },
    ],
  });

  await prisma.cMSSection.create({
    data: {
      schoolId: foundation.id,
      sectionKey: 'hero',
      payload: JSON.stringify({
        headline: 'Membina Generasi Qur\'ani, Cerdas & Berkarakter Unggul',
        subheadline: 'Lembaga pendidikan Islam terpadu holistik di Majalengka yang memadukan kurikulum nasional, sains modern, dan tahfidz Al-Qur’an berbasis adab nabawi untuk masa depan gemilang.',
        heroImage: '/images/eduka-hero-campus.jpg',
        stats: [
          { label: 'Murid Aktif', value: '850+' },
          { label: 'Dewan Guru Berpengalaman', value: '75+ Pendidik' },
          { label: 'Akreditasi Lembaga', value: 'A (Unggul)' },
          { label: 'Target Capaian', value: 'Tahfidz & Prestasi' },
        ],
        slides: [
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
            image: '/images/arc-tahfidz.jpg',
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
          },
          {
            id: 3,
            badge: 'PPDB ONLINE TP 2026/2027 GELOMBANG 1 DIBUKA',
            titlePart1: 'Raih Beasiswa & ',
            titleHighlight: 'Diskon Biaya',
            titlePart2: ' Masuk Gelombang Dini',
            description: 'Dapatkan fasilitas pendaftaran online anti-ribet, simulasi kuitansi instan, pengukuran seragam mandiri, dan kemudahan pembayaran fleksibel.',
            primaryCtaText: 'Daftar Online 5 Menit',
            primaryCtaLink: '/ppdb/daftar',
            secondaryCtaText: 'Cek Status Pendaftaran',
            secondaryCtaLink: '/ppdb/cek-status',
            image: '/images/sd-hero-garden.jpg',
          },
        ],
      }),
    },
  });

  // 6. Clean Database: No dummy applicants or fake test invoices
  // All registration tables start completely clean (0 records) for real applicant data

  // Seed sample student achievements
  await prisma.studentAchievement.deleteMany();
  await prisma.studentAchievement.createMany({
    data: [
      {
        schoolId: smp.id,
        title: 'Juara 1 Musabaqah Hifzhil Qur’an (MHQ) 5 Juz Putra',
        studentName: 'Murid SMP IT Al-Afiyah',
        category: 'TAHFIDZ',
        level: 'PROVINSI',
        rank: 'JUARA_1',
        year: '2026',
        description: 'Meraih predikat Mumtaz dalam ajang MHQ Pelajar Tingkat Jawa Barat dengan hafalan mutqin dan tajwid fasih.',
        imageUrl: '/images/arc-tahfidz.jpg',
      },
      {
        schoolId: sd.id,
        title: 'Medali Emas Olimpiade Sains & Matematika Nasional (OSN)',
        studentName: 'Murid SD IT Al-Afiyah',
        category: 'SAINS',
        level: 'NASIONAL',
        rank: 'JUARA_1',
        year: '2026',
        description: 'Menorehkan prestasi membanggakan pada kompetisi sains tingkat SD se-Indonesia.',
        imageUrl: '/images/sd-hero-greenhouse.jpg',
      },
      {
        schoolId: smp.id,
        title: 'Juara 2 Pidato Bahasa Arab (Khitabah) Tingkat Kabupaten',
        studentName: 'Murid SMP IT Al-Afiyah',
        category: 'SENI_BAHASA',
        level: 'KABUPATEN',
        rank: 'JUARA_2',
        year: '2026',
        description: 'Pidato bertema Urgensi Adab dalam Menuntut Ilmu di hadapan dewan juri Kemenag.',
        imageUrl: '/images/smp-hero-bilingual.jpg',
      },
      {
        schoolId: tk.id,
        title: 'Juara 1 Lomba Hafalan Surat Pendek & Doa Harian Cilik',
        studentName: 'Murid TK IT Al-Afiyah',
        category: 'TAHFIDZ',
        level: 'KABUPATEN',
        rank: 'JUARA_1',
        year: '2026',
        description: 'Kelancaran membaca surat An-Naba dan doa harian dengan penuh keceriaan.',
        imageUrl: '/images/tk-hero-kids.jpg',
      },
    ],
  });
  console.log('✅ Student Achievements Seeded!');
  console.log('✨ Clean Production State: Zero dummy registrations or test invoices in database.');
  console.log('🎉 Seeding Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
