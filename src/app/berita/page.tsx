import React from 'react';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyMobileBar from '@/components/layout/StickyMobileBar';
import NewsListClient, { NewsArticle } from '@/components/news/NewsListClient';
import { prisma } from '@/lib/prisma';
import { Newspaper } from 'lucide-react';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Warta & Kajian Islam Al-Afiyah | Berita, Prestasi & Artikel Edukasi',
  description: 'Kumpulan berita terkini, pengumuman Sumatif Tengah Semester (STS), prestasi murid, artikel adab dan parenting islami Yayasan Pendidikan Imam Bonjol.',
  icons: {
    icon: [
      { url: '/images/sd-logo.png', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/images/sd-logo.png',
    apple: '/images/sd-logo.png',
  },
};

const DEFAULT_ARTICLES: NewsArticle[] = [
  {
    id: 'sd-field-study-1',
    title: 'Field Study SDIT Al-Afiyah di P4S An-Nabawiyah: Praktik Pertanian & Perikanan Smart Akhlak Fitrah',
    slug: 'field-study-sd-it-al-afiyah-p4s-an-nabawiyah',
    category: 'Kabar Sekolah',
    schoolName: 'SDIT Al-Afiyah',
    excerpt: 'Puluhan murid SDIT Al-Afiyah mengikuti kegiatan field study di P4S An-Nabawiyah. Murid belajar memindahkan semai bibit sayur ke polybag, observasi greenhouse bambu, dan edukasi budidaya perikanan biofloc.',
    author: 'Humas SDIT Al-Afiyah',
    date: '25 Sep 2026',
    readingTime: '3 menit baca',
    imageUrl: '/images/sd-field-study-banner.jpg',
    paragraphs: [
      'Alhamdulillah, dalam rangka mewujudkan kurikulum kontekstual berbasis alam dan karakter, murid-murid SDIT Al-Afiyah melaksanakan kegiatan "Field Study: Smart Akhlak Fitrah" bertempat di Pusat Pelatihan Pertanian dan Perdesaan Swadaya (P4S) An-Nabawiyah.',
      'Kegiatan edukasi luar kelas ini dirancang untuk mengenalkan fitrah anak terhadap alam semesta dan menumbuhkan rasa syukur atas limpahan rezeki ciptaan Allah Ta\'ala. Mengenakan seragam lapangan dan rompi praktikum, para murid tampak sangat antusias mengikuti seluruh rangkaian agenda.',
      'Dalam sesi agro-literasi, siswi SDIT Al-Afiyah dibimbing langsung oleh dewan guru mengenai tahapan pembenihan tanaman hortikultura. Mulai dari mengamati tunas tanaman di rak semai greenhouse, hingga praktik langsung memindahkan bibit cabai dan sayuran ke media tanam polybag secara mandiri dan cermat.',
      'Sementara itu pada sesi perikanan, murid-murid ikhwan diajak mengamati ekosistem air tawar pada kolam budidaya biofloc terpal. Murid mempraktikkan langsung cara pemberian pakan ikan yang teratur dan mempelajari siklus hidup ikan air tawar sebagai bagian dari pembelajaran sains nabawi.',
      'Kepala SDIT Al-Afiyah menyampaikan bahwa kegiatan field study ini adalah wujud nyata pilar Smart Akhlak Fitrah, di mana proses belajar tidak hanya terbatas di dalam empat dinding kelas, melainkan bersentuhan langsung dengan lingkungan nyata untuk membangun kemandirian, adab, dan kecerdasan anak.'
    ],
    keyHighlights: [
      'Lokasi Kegiatan: P4S An-Nabawiyah bersama dewan asatidzah pendamping.',
      'Praktik Agro-Sains: Observasi tray semai greenhouse & pemindahan bibit sayuran ke polybag.',
      'Budidaya Perikanan: Praktik pengenalan biofloc dan pemberian pakan ikan air tawar.',
      'Pilar Nilai: Smart Akhlak Fitrah (Kemandirian, Ketelitian, dan Rasa Syukur atas Ciptaan Allah Ta\'ala).'
    ]
  },
  {
    id: 'sd-futsal-2',
    title: 'Alhamdulillah! Tim Futsal SDIT Al-Afiyah Raih Juara 2 (Second Place) Tingkat Daerah',
    slug: 'tim-futsal-sd-it-al-afiyah-raih-juara-2',
    category: 'Prestasi',
    schoolName: 'SDIT Al-Afiyah',
    excerpt: 'Prestasi membanggakan kembali ditorehkan murid-murid SDIT Al-Afiyah. Tim Futsal sekolah berhasil menyabet gelar Second Place dalam kejuaraan futsal antar-sekolah tingkat daerah.',
    author: 'Pembina Olahraga SDIT',
    date: '23 Sep 2026',
    readingTime: '3 menit baca',
    imageUrl: '/images/sd-futsal-champion.jpg',
    paragraphs: [
      'Keluarga besar SDIT Al-Afiyah bersyukur atas torehan prestasi membanggakan yang diraih oleh Tim Futsal murid SDIT Al-Afiyah. Dalam turnamen kompetisi futsal pelajar tingkat daerah, tim sekolah sukses menembus babak final dan mengamankan posisi Juara 2 (Second Place).',
      'Perjalanan tim futsal SDIT Al-Afiyah diwarnai dengan perjuangan gigih, kekompakan strategi bermain, dan yang paling utama adalah menjunjung tinggi sportivitas serta adab islami di dalam maupun di luar lapangan.',
      'Penyerahan trofi kejuaraan dan piagam penghargaan dilangsungkan secara khidmat pada saat apel upacara bendera di lapangan sekolah. Didampingi dewan guru dan kepala sekolah, seluruh siswa-siswi yang memadati lapangan turut memberikan tepuk tangan apresiasi dan doa.',
      'Pihak sekolah senantiasa mendukung penuh penyaluran minat dan bakat murid, baik dalam bidang tahfidz Al-Qur\'an, sains teknologi, maupun bidang kebugaran jasmani dan ketangkasan olahraga sesuai anjuran Rasulullah ﷺ.'
    ],
    keyHighlights: [
      'Gelar Juara: Second Place (Juara 2) Turnamen Futsal Pelajar Tingkat Daerah.',
      'Karakter: Menjunjung tinggi sportivitas islami, kerja sama tim, dan mental juara.',
      'Apresiasi: Penyerahan piala dan sertifikat resmi pada apel upacara di hadapan seluruh murid.',
      'Pengembangan Bakat: Fasilitas ekstrakurikuler futsal dan olahraga terpadu di SDIT Al-Afiyah.'
    ]
  },
  {
    id: 'sts-1',
    title: 'Selamat Melaksanakan Sumatif Tengah Semester (STS) 1 SDIT Al-Afiyah',
    slug: 'sumatif-tengah-semester-1-sdit-al-afiyah',
    category: 'Pengumuman',
    schoolName: 'SDIT Al-Afiyah',
    excerpt: 'Pelaksanaan Sumatif Tengah Semester (STS) Semester 1 TP 2026/2027 SDIT Al-Afiyah dimulai tanggal 21 September 2026 pukul 07.15 s.d 11.00 WIB. Mengusung tagline Smart Akhlak Fitrah.',
    author: 'Kurikulum SDIT Al-Afiyah',
    date: '20 Sep 2026',
    readingTime: '2 menit baca',
    imageUrl: '/images/sts-semester-1-sdit.jpg',
    paragraphs: [
      'Bismillah, segenap pimpinan Yayasan, kepala sekolah, dan dewan asatidzah mengucapkan: "Selamat Melaksanakan Sumatif Tengah Semester (STS) Semester 1 Tahun Ajaran 2026/2027" bagi seluruh murid kelas 1 hingga 6 SDIT Al-Afiyah.',
      'Pelaksanaan Sumatif Tengah Semester (STS) 1 ini dimulai serentak pada hari Senin, 21 September 2026 dengan jam kegiatan belajar asesmen khusus, yaitu pukul 07.15 s.d 11.00 WIB bertempat di ruang kelas masing-masing Lingkungan Sekolah SDIT Al-Afiyah.',
      'Mengusung motto dan identitas "Smart Akhlak Fitrah", kegiatan asesmen ini dirancang bukan sekadar mengevaluasi penguasaan materi ajar kurikulum, melainkan menjadi wahana pembentukan karakter murid yang jujur, teliti, mandiri, dan beradab.',
      'Kami mengimbau kepada seluruh ayah dan bunda wali murid untuk mendampingi ananda dengan menjaga pola istirahat yang cukup, membiasakan sarapan sehat sebelum berangkat, serta senantiasa memanjatkan doa terbaik agar ananda diberikan kelapangan berpikir dan kemudahan dari Allah Ta’ala.'
    ],
    keyHighlights: [
      'Jadwal Pelaksanaan: Mulai 21 September 2026.',
      'Waktu: Pukul 07.15 s.d 11.00 WIB.',
      'Lokasi: Lingkungan Sekolah SDIT Al-Afiyah.',
      'Tagline & Karakter: Smart Akhlak Fitrah (Menjunjung tinggi kejujuran & adab mandiri).'
    ]
  },
  {
    id: '1',
    title: 'Murid SMP IT Al-Afiyah Raih Juara 1 MHQ 10 Juz Tingkat Wilayah Ciayumajakuning',
    slug: 'murid-smp-it-juara-1-mhq-ciayumajakuning',
    category: 'Prestasi',
    schoolName: 'SMP IT Al-Afiyah',
    excerpt: 'Ananda Muhammad Fatih berhasil meraih predikat terbaik dalam Musabaqah Hifzhil Qur’an kategori 10 Juz setelah melafalkan hafalan dengan fashahah dan tajwid mutqin.',
    author: 'Ustadz Ridwan, Al-Hafizh',
    date: '14 Sep 2026',
    readingTime: '3 menit baca',
    imageUrl: '/images/arc-tahfidz.jpg',
    paragraphs: [
      'Alhamdulillah, prestasi membanggakan kembali ditorehkan oleh murid SMP IT Al-Afiyah. Ananda Muhammad Fatih berhasil meraih predikat Terbaik I pada ajang Musabaqah Hifzhil Qur’an (MHQ) 10 Juz Tingkat Wilayah Ciayumajakuning.',
      'Perlombaan bergengsi ini diikuti oleh ratusan peserta dari berbagai pesantren dan sekolah Islam se-Jawa Barat. Di hadapan dewan juri bersanad, Ananda melantunkan ayat-ayat suci dengan tajwid yang fasih, fashahah mutqin, serta adab tilawah yang menyejukkan hati.',
      'Kepala Sekolah menyampaikan rasa syukur dan apresiasi setinggi-tingginya kepada ananda serta para asatidz pembimbing halaqah intensif yang tak kenal lelah mendampingi proses muraja’ah setiap hari.',
      'Prestasi ini diharapkan menjadi pemantik semangat bagi seluruh murid Al-Afiyah untuk terus istiqomah membersamai Al-Qur’an dan mengamalkan nilai-nilainya dalam kehidupan sehari-hari.'
    ],
    keyHighlights: [
      'Juara 1 MHQ 10 Juz kategori Murid Sekolah Menengah Wilayah Ciayumajakuning.',
      'Melafalkan hafalan dengan nilai tajwid & fashahah tertinggi (98.5).',
      'Mendapatkan beasiswa pendidikan tahfidz penuh dari yayasan.'
    ]
  },
  {
    id: '2',
    title: 'Menanamkan Adab Sebelum Menuntut Ilmu: Pondasi Utama Pendidikan Karakter Anak',
    slug: 'menanamkan-adab-sebelum-menuntut-ilmu',
    category: 'Kajian Islam',
    schoolName: 'Yayasan Al-Afiyah',
    excerpt: 'Para ulama salaf senantiasa mendahulukan adab dan kebersihan hati sebelum hafalan matan. Simak panduan praktis mendidik adab anak di era gempuran digital.',
    author: 'Ustadz H. Abdul Wahid, Lc.',
    date: '10 Sep 2026',
    readingTime: '5 menit baca',
    imageUrl: '/images/arc-ustadz.jpg',
    paragraphs: [
      'Imam Malik rahimahullah pernah berpesan: "Pelajarilah adab sebelum engkau mempelajari suatu ilmu." Nasihat emas ini menjadi ruh utama dalam seluruh kurikulum pendidikan di Ekosistem Al-Afiyah.',
      'Di era digital dengan arus informasi yang begitu deras, kecerdasan intelektual tanpa benteng adab dan akhlakul karimah rentan melahirkan generasi yang kritis namun kehilangan rasa hormat kepada orang tua dan guru.',
      'Pembiasaan adab di Al-Afiyah dimulai dari hal mendasar: adab makan dan minum sesuai sunnah, adab berbicara dengan santun, adab menghormati asatidz, hingga adab bermuamalah dengan sesama teman.',
      'Peran orang tua di rumah sangat menentukan keselarasan pembentukan karakter ini. Sinergi antara sekolah dan rumah tangga adalah kunci utama lahirnya generasi shalih yang kokoh imannya.'
    ],
    keyHighlights: [
      'Menjadikan adab sebagai kurikulum prioritas sebelum transfer wawasan sains.',
      'Program mutaba’ah adab harian terpantau langsung oleh wali murid di SIAKAD.',
      'Kajian parenting berkala untuk menyelaraskan bimbingan di rumah.'
    ]
  },
  {
    id: '3',
    title: 'Kunjungan Edukasi Saintifik Murid SDIT Al-Afiyah ke Laboratorium Botani',
    slug: 'kunjungan-edukasi-sd-it-laboratorium-botani',
    category: 'Kabar Sekolah',
    schoolName: 'SDIT Al-Afiyah',
    excerpt: 'Murid kelas 5 SDIT mempraktikkan langsung ayat-ayat kauniyyah tentang proses fotosintesis tumbuhan dan keanekaragaman flora lokal.',
    author: 'Humas SDIT Al-Afiyah',
    date: '05 Sep 2026',
    readingTime: '4 menit baca',
    imageUrl: '/images/sd-hero-greenhouse.jpg',
    paragraphs: [
      'Sebagai bagian dari pembelajaran kontekstual kurikulum terpadu, puluhan murid kelas 5 SDIT Al-Afiyah melaksanakan kegiatan field trip edukatif ke Laboratorium Botani dan Konservasi Tumbuhan.',
      'Kegiatan ini memadukan materi sains tentang jaringan tumbuhan dan fotosintesis dengan tadabbur ayat-ayat kauniyyah dalam Al-Qur’an Surat An-Nahl dan Surat Al-An’am tentang bagaimana Allah menumbuhkan aneka tanaman sebagai karunia bagi manusia.',
      'Murid diajak mengamati klorofil daun di bawah mikroskop digital, mengenal teknik okulasi tanaman buah lokal, serta membuat herbarium mini secara berkelompok.',
      'Melalui observasi lapangan ini, murid tidak hanya memahami teori biologi secara mendalam, tetapi juga semakin kagum atas kebesaran Allah Azza wa Jalla sang Pencipta alam semesta.'
    ],
    keyHighlights: [
      'Eksperimen mikroskopis klorofil daun dan fotosintesis langsung di laboratorium.',
      'Integrasi tadabbur ayat Al-Qur’an tentang keanekaragaman flora bumi.',
      'Praktik pembuatan herbarium mini ramah lingkungan.'
    ]
  },
  {
    id: '4',
    title: 'Tasyakuran Khataman Juz 30 Bersama Orang Tua Murid TK IT Al-Afiyah',
    slug: 'tasyakuran-khataman-juz-30-tk-it',
    category: 'Tahfidz',
    schoolName: 'TK IT Al-Afiyah',
    excerpt: 'Suasana haru menyelimuti wisuda mini juz 30 ananda TK IT, di mana para ananda menyematkan mahkota simbolis dan membacakan surat-surat pendek secara serentak.',
    author: 'Ustadzah Siti Mariyam',
    date: '28 Agu 2026',
    readingTime: '3 menit baca',
    imageUrl: '/images/tk-hero-kids.jpg',
    paragraphs: [
      'Suasana penuh haru dan kebahagiaan menyelimuti Aula Utama Lingkungan Sekolah Al-Afiyah saat gelaran Tasyakuran Khataman Juz 30 ananda TK IT Al-Afiyah Kelompok B.',
      'Sebanyak 35 murid cilik dengan suara merdu melantunkan surat-surat dalam Juz ‘Amma secara hafalan murni (bil ghaib) dengan irama murottal yang rapi dan serentak di hadapan para orang tua yang hadir.',
      'Puncak acara ditandai dengan prosesi penyematan mahkota simbolik dari para ananda kepada ayah dan bunda tercinta sebagai lambang penghormatan dan doa kelak di yaumil akhir.',
      'Metode talqin interaktif dengan sentuhan kasih sayang para ustadzah terbukti efektif membantu anak usia dini menghafal Al-Qur’an tanpa beban, penuh keceriaan, dan berakar kuat dalam memori mereka.'
    ],
    keyHighlights: [
      '35 murid cilik TK IT tuntas menyetorkan hafalan Juz 30 secara mutqin.',
      'Prosesi sungkeman dan penyematan mahkota kehormatan untuk orang tua.',
      'Metode pembelajaran tahfidz ramah anak berbasis multisensori.'
    ]
  },
  {
    id: '5',
    title: 'Pengumuman Jadwal Ujian Observasi & Wawancara PPDB Gelombang 1',
    slug: 'jadwal-ujian-observasi-ppdb-gelombang-1',
    category: 'Pengumuman',
    schoolName: 'Yayasan Al-Afiyah',
    excerpt: 'Bagi para calon wali murid yang telah menyelesaikan registrasi online, harap memperhatikan jadwal asesmen pemetaan tahsin, tes psikologi minat, dan wawancara kesiapan belajar.',
    author: 'Panitia PPDB Terpadu',
    date: '20 Agu 2026',
    readingTime: '2 menit baca',
    imageUrl: '/images/sd-activity-classroom-6b.jpg',
    paragraphs: [
      'Panitia Penerimaan Peserta Didik Baru (PPDB) Terpadu Yayasan Pendidikan Imam Bonjol mengumumkan jadwal resmi pelaksanaan Seleksi Observasi dan Wawancara Kesiapan Belajar untuk Gelombang 1 Tahun Ajaran 2027/2028.',
      'Rangkaian seleksi meliputi pemetaan baca Al-Qur’an/tahsin awal, tes potensi psikologi ramah anak, serta wawancara keselarasan visi tarbiyah bersama kedua orang tua/wali calon murid.',
      'Calon wali murid diharapkan hadir tepat waktu sesuai nomor antrean yang telah diunduh pada portal pendaftaran mandiri serta membawa berkas verifikasi fisik.',
      'Seluruh proses observasi mengedepankan suasana yang nyaman dan edukatif bagi ananda sehingga tidak menimbulkan rasa cemas atau ketegangan.'
    ],
    keyHighlights: [
      'Pelaksanaan asesmen bertahap dari tanggal 25 s.d 27 Agustus 2026.',
      'Wawancara keselarasan komitmen tarbiyah antara pihak orang tua dan sekolah.',
      'Pengumuman hasil kelulusan akan dirilis secara digital di portal PPDB.'
    ]
  },
  {
    id: '6',
    title: 'Keutamaan Dzikir Pagi dan Petang dalam Menjaga Ketenteraman Hati Keluarga',
    slug: 'keutamaan-dzikir-pagi-petang-keluarga',
    category: 'Kajian Islam',
    schoolName: 'Yayasan Al-Afiyah',
    excerpt: 'Dzikir pagi dan petang adalah benteng kokoh bagi seorang muslim. Ulasan ringkas hadits-hadits shahih penguat ruhani dan perlindungan dari marabahaya.',
    author: 'Dewan Asatidzah Ma’had',
    date: '15 Agu 2026',
    readingTime: '6 menit baca',
    imageUrl: '/images/sd-activity-shalat-berjamaah.jpg',
    paragraphs: [
      'Dzikir pagi dan petang merupakan amalan sunnah mu’akkadah yang senantiasa dijaga oleh Rasulullah ﷺ beserta para sahabat rodhiyallahu ‘anhum. Amalan ini ibarat baju besi yang melindungi seorang muslim dari bisikan setan, penyakit ain, dan kegundahan jiwa.',
      'Di lingkungan Al-Afiyah, seluruh murid dibiasakan mengawali hari dengan lantunan dzikir pagi bersama di halaqah kelas masing-masing sebelum jam pembelajaran pertama dimulai.',
      'Ibnul Qayyim rahimahullah mengumpamakan dzikir pagi petang seperti baju besi yang semakin tebal semakin kokoh melindungi pemakainya dari segala mara bahaya.',
      'Yayasan mendorong para wali murid untuk senantiasa menghidupkan sunnah ini di rumah tangga masing-masing agar rumah dipenuhi keberkahan, sakinah, dan perlindungan Allah Ta’ala.'
    ],
    keyHighlights: [
      'Rutinitas dzikir pagi berjamaah setiap hari sebelum sesi belajar dimulai.',
      'Penjelasan dalil-dalil shahih perlindungan dari penyakit ain dan sihir.',
      'Tersedia buku saku dzikir pagi & petang terbitan resmi Ma’had Al-Afiyah.'
    ]
  },
  {
    id: '7',
    title: 'Science & Robotic Fair: Murid SMP IT Rancang Prototipe Irigasi Cerdas Tenaga Surya',
    slug: 'science-robotic-fair-smp-it-irigasi-cerdas',
    category: 'Prestasi',
    schoolName: 'SMP IT Al-Afiyah',
    excerpt: 'Karya sains teknologi terpadu ciptaan murid kelas 8 berhasil memukau dewan juri dengan mengintegrasikan mikrokontroler sensor tanah dan prinsip tadabbur ayat kauniyyah.',
    author: 'Ir. Fathurrahman, S.Pd.',
    date: '12 Agu 2026',
    readingTime: '4 menit baca',
    imageUrl: '/images/sd-activity-multimedia-learning.jpg',
    paragraphs: [
      'Dalam ajang Science & Robotic Fair tahun ini, murid kelas 8 SMP IT Al-Afiyah unjuk kebolehan inovasi teknologi dengan merancang prototipe sistem irigasi cerdas hemat energi berbasis tenaga surya dan mikrokontroler sensor kelembapan tanah.',
      'Proyek ini dikembangkan secara kolaboratif selama dua bulan di bawah bimbingan guru sains dan teknologi informasi. Sistem ini bekerja secara otomatis menyiram tanaman hanya saat kadar air tanah di bawah ambang batas optimal, sehingga efisien dan ramah lingkungan.',
      'Menariknya, murid tidak hanya mempresentasikan aspek teknis perangkat keras dan koding, tetapi juga mengaitkannya dengan tadabbur Al-Qur’an Surat Al-Anbiya ayat 30 tentang air sebagai sumber kehidupan bagi segala makhluk.',
      'Karya ini meraih apresiasi tinggi dan direncanakan untuk diuji coba langsung di kebun hidroponik serta greenhouse botani milik sekolah.'
    ],
    keyHighlights: [
      'Prototipe irigasi otomatis berbasis sensor kelembapan tanah dan panel surya.',
      'Integrasi keterampilan koding, elektronika, dan nilai tadabbur ayat kauniyyah.',
      'Akan diterapkan di greenhouse dan kebun percontohan sekolah.'
    ]
  },
  {
    id: '8',
    title: 'Latihan Memanah & Bela Diri Sunnah: Membentuk Ketangkasan Fisik dan Jiwa Ksatria Murid',
    slug: 'latihan-memanah-bela-diri-sunnah-murid',
    category: 'Kabar Sekolah',
    schoolName: 'SMP IT Al-Afiyah',
    excerpt: 'Olahraga sunnah memanah dan bela diri silat kepanduan rutin diselenggarakan setiap pekan untuk melatih fokus, ketenangan emosi, dan kedisiplinan murid.',
    author: 'Kapten (Purn) M. Ridwan',
    date: '08 Agu 2026',
    readingTime: '3 menit baca',
    imageUrl: '/images/smp-hero-fullday.jpg',
    paragraphs: [
      'Sebagai bagian dari pembinaan jasmani dan pengamalan anjuran Rasulullah ﷺ, kegiatan ekstrakurikuler memanah dan seni bela diri silat kepanduan rutin diikuti murid SMP IT Al-Afiyah setiap akhir pekan.',
      'Olahraga memanah terbukti melatih konsentrasi tinggi, kestabilan nafas, dan ketenangan batin. Setiap murid diajarkan teknik tarikan busur yang benar, adab keselamatan di lapangan, serta filosofi fokus pada tujuan.',
      'Sementara itu, latihan bela diri silat kepanduan membekali murid dengan ketangkasan gerak, ketahanan stamina, dan kesiapan membela diri tanpa menumbuhkan kesombongan melainkan kerendahan hati.',
      'Sekolah berkomitmen mencetak generasi muslim yang tidak hanya cerdas secara akal dan mulia akhlaknya, namun juga kuat fisiknya sesuai hadits mukmin yang kuat lebih dicintai Allah.'
    ],
    keyHighlights: [
      'Pelatihan memanah sunnah dengan standar keselamatan dan instruktur bersertifikat.',
      'Membentuk konsentrasi, ketenangan mental, dan kesabaran murid.',
      'Olahraga jasmani rutin penunjang kesehatan dan kebugaran ananda.'
    ]
  },
  {
    id: '9',
    title: 'Pekan Bahasa Arab & Inggris: Menumbuhkan Percakapan Aktif dan Percaya Diri Murid SDIT',
    slug: 'pekan-bahasa-arab-inggris-sd-it',
    category: 'Kabar Sekolah',
    schoolName: 'SDIT Al-Afiyah',
    excerpt: 'Melalui kegiatan Hiwar Yaumi dan Daily English Vocabulary, murid SDIT Al-Afiyah unjuk kebolehan pidato dan bercerita kisah sahabat nabi dalam bahasa asing.',
    author: 'Ustadzah Nurul Hidayah, M.Pd.',
    date: '02 Agu 2026',
    readingTime: '4 menit baca',
    imageUrl: '/images/smp-hero-bilingual.jpg',
    paragraphs: [
      'Suasana di lingkungan SDIT Al-Afiyah tampak lebih semarak dengan digelarnya Pekan Bahasa Internasional (Language Week) yang mengusung tema "Cinta Bahasa Al-Qur’an dan Komunikasi Global".',
      'Sepanjang pekan, murid diajak membiasakan percakapan sederhana sehari-hari (Hiwar Yaumi) dalam bahasa Arab saat berinteraksi di lingkungan kelas serta pengenalan kosakata bahasa Inggris tematik.',
      'Berbagai perlombaan edukatif digelar, mulai dari lomba khitobah (pidato cilik), spelling bee islami, storytelling kisah sahabat Rasulullah, hingga drama musikal nasyid berbahasa Arab.',
      'Kegiatan ini terbukti memicu antusiasme tinggi murid tanpa rasa takut salah, menanamkan keberanian berbicara di depan umum sejak bangku sekolah dasar.'
    ],
    keyHighlights: [
      'Pembiasaan Hiwar Yaumi (percakapan Arab harian) dan English vocabulary.',
      'Lomba pidato cilik, spelling bee islami, dan drama kisah sahabat nabi.',
      'Membangun kepercayaan diri murid berbicara bahasa asing sejak usia dini.'
    ]
  },
  {
    id: '10',
    title: 'Simulasi Manasik Haji Cilik Murid TK IT Al-Afiyah di Lapangan Utama Lingkungan Sekolah',
    slug: 'manasik-haji-cilik-tk-it-alafiyah',
    category: 'Kabar Sekolah',
    schoolName: 'TK IT Al-Afiyah',
    excerpt: 'Mengenakan pakaian ihram serba putih, puluhan murid cilik belajar prosesi tawaf, sa\'i, dan wukuf dengan antusias didampingi para ustadzah dan orang tua.',
    author: 'Ustadzah Dewi Sartika, S.Pd.I.',
    date: '25 Jul 2026',
    readingTime: '3 menit baca',
    imageUrl: '/images/tk-hero-garden.jpg',
    paragraphs: [
      'Ratusan murid cilik TK IT Al-Afiyah tampak anggun dan bersemangat mengenakan busana ihram putih saat mengikuti Simulasi Manasik Haji di Lapangan Utama Lingkungan Sekolah Terpadu.',
      'Dengan replika Ka’bah berukuran proporsional, miniatur bukit Shafa-Marwah, serta tenda Mina mini, ananda dipandu melafalkan kalimat talbiyah "Labbaikallahumma labbaik" secara serentak yang menggetarkan hati.',
      'Para ustadzah dengan sabar mengenalkan setiap rukun dan wajib haji: mulai dari niat ihram, tawaf mengelilingi Ka’bah, sa’i dengan berlari-lari kecil di antara bukit, hingga melempar jumrah dengan kerikil busa lembut.',
      'Kegiatan manasik haji cilik ini bertujuan menanamkan kerinduan terhadap Baitullah dan pemahaman rukun Islam kelima ke dalam sanubari anak sejak masa keemasan (golden age).'
    ],
    keyHighlights: [
      'Pengenalan rukun haji dan umrah dengan sarana visual dan praktik interaktif.',
      'Lantunan talbiyah serempak menumbuhkan cinta ananda kepada Baitullah.',
      'Didampingi langsung oleh bunda guru dan disaksikan oleh para orang tua.'
    ]
  },
  {
    id: '11',
    title: 'Penyaluran Zakat, Infaq, dan Sedekah (ZIS) Murid: Paket Sembako Berkah untuk Warga Dhuafa',
    slug: 'penyaluran-zis-berkah-dhuafa-alafiyah',
    category: 'Pengumuman',
    schoolName: 'Yayasan Al-Afiyah',
    excerpt: 'Sebagai wujud kepedulian sosial dan aplikasi adab dermawan, OSIS murid Al-Afiyah menyalurkan 250 paket sembako kepada warga dhuafa di lingkungan sekolah.',
    author: 'Biro Sosial & Dakwah Yayasan',
    date: '18 Jul 2026',
    readingTime: '3 menit baca',
    imageUrl: '/images/sd-field-study-banner.jpg',
    paragraphs: [
      'Sebagai wujud nyata pendidikan adab kedermawanan dan empati sosial, Yayasan bersama OSIS murid Al-Afiyah sukses menyalurkan 250 paket sembako berkah kepada warga dhuafa dan lansia di lingkungan sekitar lingkungan sekolah.',
      'Dana dan paket sembako ini terkumpul dari program Kotak Infaq Jum’at Berkah murid serta donasi sukarela para wali murid sepanjang bulan lalu.',
      'Perwakilan pengurus OSIS didampingi para asatidz turun langsung menyerahkan paket bantuan ke rumah-rumah warga penerima manfaat dengan santun dan penuh ketulusan.',
      'Program ini menjadi laboratorium sosial bagi murid agar mereka menyadari nikmat rezeki yang Allah karuniakan dan terbiasa memiliki kepekaan terhadap saudara-saudara yang membutuhkan.'
    ],
    keyHighlights: [
      'Penyaluran 250 paket sembako beras, minyak goreng, dan kebutuhan pokok bagi dhuafa.',
      'Hasil himpunan infaq Jum’at rutin murid dan donasi wali murid.',
      'Melatih empati dan adab kedermawanan murid terjun langsung ke masyarakat.'
    ]
  },
  {
    id: '12',
    title: 'Tips Praktis Mendidik Anak Senang Mendirikan Shalat 5 Waktu Tanpa Disuruh',
    slug: 'tips-mendidik-anak-senang-shalat-5-waktu',
    category: 'Kajian Islam',
    schoolName: 'Yayasan Al-Afiyah',
    excerpt: 'Kiat psikologis dan syar\'i dari para ulama untuk menanamkan kecintaan shalat fardhu pada anak melalui keteladanan orang tua, pembiasaan bertahap, dan doa mustajab.',
    author: 'Ustadz Dr. Muhammad Luthfi, M.A.',
    date: '10 Jul 2026',
    readingTime: '5 menit baca',
    imageUrl: '/images/sd-activity-kultum-murid.jpg',
    paragraphs: [
      'Shalat adalah tiang agama dan amalan pertama yang akan dihisab pada hari kiamat. Banyak orang tua mengeluhkan tantangan mengajak buah hati shalat tanpa perlu perdebatan atau bentakan.',
      'Kunci utama adalah keteladanan visual. Anak adalah peniru ulung; ketika melihat ayah dan bundanya segera berwudhu begitu azan berkumandang dan meninggalkan seluruh aktivitas duniawi, anak akan menginternalisasi bahwa shalat adalah prioritas tertinggi.',
      'Langkah kedua adalah metode pembiasaan ramah dan bertahap. Mulai usia 7 tahun, ajak anak mendirikan shalat dengan pujian hangat, ciptakan sudut shalat (mushalla mini) yang wangi dan bersih di rumah, serta berikan sajadah kesukaan ananda.',
      'Terakhir, jangan pernah melupakan kekuatan doa mustajab Nabi Ibrahim ‘alaihissalam: "Rabbi-j’alni muqiimash-shalaati wa min dzurriyyati" yang senantiasa dipanjatkan setiap sujud dan ba’da shalat fardhu.'
    ],
    keyHighlights: [
      'Kekuatan keteladanan: Orang tua menjadi model utama yang bersegera shalat di awal waktu.',
      'Membangun ikatan emosional positif dan lingkungan rumah ramah ibadah.',
      'Rutin memanjatkan doa Nabi Ibrahim agar keturunan istiqomah mendirikan shalat.'
    ]
  }
];

export default async function BeritaPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; school?: string; unit?: string }>;
}) {
  const params = await searchParams;
  const schoolSlug = (params.school || params.unit || (params.cat === 'sd' ? 'sd' : '')).toLowerCase();
  const isSd = schoolSlug === 'sd';

  if (isSd) {
    const query = new URLSearchParams();
    if (params.cat && params.cat !== 'sd') query.set('cat', params.cat);
    const qs = query.toString() ? `?${query.toString()}` : '';
    redirect(`/sd/berita${qs}`);
  }

  let articles: NewsArticle[] = [];

  try {
    const dbPosts = await prisma.newsPost.findMany({
      where: { 
        isPublished: true,
        ...(isSd ? { school: { slug: 'sd' } } : {}),
      },
      orderBy: { publishedAt: 'desc' },
      include: { school: true },
      take: 20,
    });

    if (dbPosts && dbPosts.length > 0) {
      articles = dbPosts.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        category: p.category || 'Kabar Sekolah',
        excerpt: p.excerpt || p.content.slice(0, 150) + '...',
        author: p.author || (isSd ? 'Humas SDIT Al-Afiyah' : 'Humas Al-Afiyah'),
        date: new Date(p.publishedAt).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        schoolName: p.school?.name || (isSd ? 'SDIT Al-Afiyah' : undefined),
        readingTime: '4 menit baca',
        imageUrl: p.coverImage || undefined,
        paragraphs: p.content ? p.content.split('\n').filter((l: string) => l.trim().length > 0) : undefined,
      }));
    }
  } catch (err) {
    console.error('Error fetching news from database:', err);
  }

  // If DB has fewer than 3 posts, supplement with default curated articles
  if (articles.length === 0) {
    articles = isSd 
      ? DEFAULT_ARTICLES.filter(a => a.schoolName === 'SDIT Al-Afiyah' || a.category === 'Artikel & Kajian')
      : DEFAULT_ARTICLES;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-800 font-sans selection:bg-amber-200 selection:text-amber-950">
      <Navbar schoolSlug={schoolSlug as any} />

      {/* Hero Header */}
      <section className={`relative text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden ${
        isSd
          ? 'bg-gradient-to-br from-[#008f45] via-[#00A651] to-[#007036]'
          : 'bg-gradient-to-br from-[#123E38] via-[#184F48] to-[#256D63]'
      }`}>
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <p className="font-arabic text-xl sm:text-2xl text-amber-300 mb-3 tracking-wide drop-shadow-sm">
            {isSd ? 'مَدْرَسَةُ العَافِيَةِ الإبْتِدَائِيَّةِ الإسْلَامِيَّةِ' : 'نَشَرَاتُ وَمَقَالَاتُ مَعْهَدِ العَافِيَةِ'}
          </p>
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-200 text-xs font-semibold uppercase tracking-wider mb-5">
            <Newspaper className="w-3.5 h-3.5 text-amber-300" />
            <span>{isSd ? 'Warta & Khazanah SDIT Al-Afiyah' : 'Warta Sekolah & Khazanah Keilmuan'}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
            {isSd ? 'Kabar Berita & Prestasi SDIT' : 'Kabar Berita & Pengumuman Sekolah'}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-emerald-100/90 max-w-2xl mx-auto leading-relaxed">
            {isSd 
              ? 'Informasi resmi kegiatan belajar mengajar murid, field study, kejuaraan, dan artikel mutiara adab nabawiyah SDIT Al-Afiyah.'
              : 'Informasi resmi agenda ujian sumatif, dinamika kegiatan belajar murid, dokumentasi sekolah, serta mutiara faedah keilmuan dari para asatidzah.'}
          </p>
        </div>
      </section>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-8 relative z-20">
        <NewsListClient initialArticles={articles} />
      </main>

      <Footer schoolSlug={schoolSlug as any} />
      <StickyMobileBar 
        schoolSlug={schoolSlug} 
        waPhone={isSd ? '6281310139001' : '6281223344552'} 
        schoolName={isSd ? 'SDIT Al-Afiyah' : 'Al-Afiyah'} 
      />
    </div>
  );
}
