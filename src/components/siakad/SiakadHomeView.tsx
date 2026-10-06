'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  ChevronRight, 
  BookOpen, 
  Award, 
  CalendarCheck, 
  FlaskConical, 
  Languages, 
  GraduationCap, 
  ShieldCheck, 
  Clock, 
  ChevronLeft,
  Share2,
  ArrowRight
} from 'lucide-react';
import { SiakadTab } from './SiakadBottomNav';
import SiakadNewsDetailView, { SiakadNewsItem } from './SiakadNewsDetailView';

export interface SiakadStudentData {
  nis: string;
  fullName: string;
  unitLevel: 'TK' | 'SD' | 'SMP';
  schoolName: string;
  classGrade: string;
  academicYear: string;
  primaryColor: string;
  accentColor: string;
  avatarUrl?: string;
  attendanceRate: number; // e.g. 98
  todayCheckInTime: string; // e.g. "06.52 WIB"
  currentJuzTarget: string; // e.g. "Juz 29 (Surat Al-Mulk)"
  tahfidzProgress: number; // e.g. 88
  adabScore: number; // e.g. 99
}

interface SiakadHomeViewProps {
  student: SiakadStudentData;
  onNavigateTab: (tab: SiakadTab) => void;
  onOpenStudentSwitcher?: () => void;
}

export const SIAKAD_NEWS_ARTICLES: SiakadNewsItem[] = [
  {
    id: 'berita-sts-1',
    title: 'Selamat Melaksanakan Sumatif Tengah Semester (STS) 1 SD IT Al-Afiyah',
    category: 'Pengumuman',
    categoryColor: '#059669',
    unitTag: 'SD IT',
    date: '20 Sep 2026',
    author: 'Kurikulum SD IT Al-Afiyah',
    authorRole: 'Biro Kurikulum & Asesmen Akademik',
    coverImage: '/images/sts-semester-1-sdit.jpg',
    excerpt: 'Pelaksanaan Sumatif Tengah Semester (STS) Semester 1 TP 2026/2027 SD IT Al-Afiyah dimulai tanggal 21 September 2026 pukul 07.15 s.d 11.00 WIB. Mengusung tagline Smart Akhlaq Fitrah.',
    readTime: '2 mnt baca',
    paragraphs: [
      'Bismillah, segenap civitas akademika Yayasan dan dewan guru SD IT Al-Afiyah mengucapkan: "Selamat Melaksanakan Sumatif Tengah Semester (STS) Semester 1 Tahun Ajaran 2026/2027" bagi seluruh murid kelas 1 hingga 6 SD IT Al-Afiyah.',
      'Pelaksanaan Sumatif Tengah Semester (STS) 1 ini dimulai serentak pada hari Senin, 21 September 2026 dengan jam belajar khusus yaitu pukul 07.15 s.d 11.00 WIB bertempat di ruang kelas masing-masing Lingkungan Sekolah SD IT Al-Afiyah.',
      'Mengusung tagline dan karakter utama "Smart Akhlaq Fitrah", kegiatan asesmen ini dirancang bukan sekadar mengukur capaian kognitif pembelajaran intrakurikuler, melainkan sarana pembiasaan adab kejujuran, ketelitian, dan kemandirian belajar sejak usia dini.',
      'Kami mengimbau kepada seluruh ayah dan bunda wali murid untuk mendampingi ananda dengan menjaga kebugaran fisik, memastikan sarapan bergizi sebelum berangkat, serta memanjatkan doa terbaik agar ananda diberikan kelapangan berpikir dan hasil yang berkah.'
    ],
    keyHighlights: [
      'Jadwal Pelaksanaan: Mulai 21 September 2026.',
      'Waktu: Pukul 07.15 s.d 11.00 WIB.',
      'Lokasi: Lingkungan Sekolah SD IT Al-Afiyah.',
      'Tagline & Karakter: Smart Akhlaq Fitrah (Menjunjung tinggi kejujuran & adab mandiri).'
    ]
  },
  {
    id: 'berita-1',
    title: 'Murid SMP IT Al-Afiyah Raih Juara 1 MHQ 10 Juz Tingkat Wilayah Ciayumajakuning',
    category: 'Prestasi',
    categoryColor: '#D97706',
    unitTag: 'SMP IT',
    date: '14 Sep 2026',
    author: 'Ustadz Ridwan, Al-Hafizh',
    authorRole: 'Koordinator Tahfidz & Keagamaan SMP IT',
    coverImage: '/images/arc-tahfidz.jpg',
    excerpt: 'Ananda Muhammad Fatih berhasil meraih predikat terbaik dalam Musabaqah Hifzhil Qur’an kategori 10 Juz setelah melafalkan hafalan dengan fashahah dan tajwid mutqin.',
    readTime: '3 mnt baca',
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
    id: 'berita-2',
    title: 'Menanamkan Adab Sebelum Menuntut Ilmu: Pondasi Utama Pendidikan Karakter Anak',
    category: 'Kajian Islam',
    categoryColor: '#0284C7',
    unitTag: 'Yayasan',
    date: '10 Sep 2026',
    author: 'Ustadz H. Abdul Wahid, Lc.',
    authorRole: 'Dewan Asatidzah & Tarbiyah',
    coverImage: '/images/arc-ustadz.jpg',
    excerpt: 'Para ulama salaf senantiasa mendahulukan adab dan kebersihan hati sebelum hafalan matan. Simak panduan praktis mendidik adab anak di era gempuran digital.',
    readTime: '5 mnt baca',
    paragraphs: [
      'Imam Malik rahimahullah pernah berpesan: "Pelajarilah adab sebelum engkau mempelajari suatu ilmu." Nasihat emas ini menjadi ruh utama dalam seluruh kurikulum pendidikan di Ekosistem Al-Afiyah Majalengka.',
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
    id: 'berita-3',
    title: 'Kunjungan Edukasi Saintifik Murid SD IT Al-Afiyah ke Laboratorium Botani',
    category: 'Kabar Sekolah',
    categoryColor: '#059669',
    unitTag: 'SD IT',
    date: '05 Sep 2026',
    author: 'Humas SD IT Al-Afiyah',
    authorRole: 'Biro Komunikasi & Publikasi',
    coverImage: '/images/sd-hero-greenhouse.jpg',
    excerpt: 'Murid kelas 5 SD IT mempraktikkan langsung ayat-ayat kauniyyah tentang proses fotosintesis tumbuhan dan keanekaragaman flora lokal di Majalengka.',
    readTime: '4 mnt baca',
    paragraphs: [
      'Sebagai bagian dari pembelajaran kontekstual kurikulum terpadu, puluhan murid kelas 5 SD IT Al-Afiyah melaksanakan kegiatan field trip edukatif ke Laboratorium Botani dan Konservasi Tumbuhan.',
      'Kegiatan ini memadukan materi sains tentang jaringan tumbuhan dan fotosintesis dengan tadabbur ayat-ayat kauniyyah dalam Al-Qur’an Surat An-Nahl dan Surat Al-An’am tentang bagaimana Allah menumbuhkan aneka tanaman sebagai karunia bagi manusia.',
      'Murid diajak mengamati klorofil daun di bawah mikroskop digital, mengenal teknik okulasi tanaman buah lokal Majalengka, serta membuat herbarium mini secara berkelompok.',
      'Melalui observasi lapangan ini, murid tidak hanya memahami teori biologi secara mendalam, tetapi juga semakin kagum atas kebesaran Allah Azza wa Jalla sang Pencipta alam semesta.'
    ],
    keyHighlights: [
      'Eksperimen mikroskopis klorofil daun dan fotosintesis langsung di laboratorium.',
      'Integrasi tadabbur ayat Al-Qur’an tentang keanekaragaman flora bumi.',
      'Praktik pembuatan herbarium mini ramah lingkungan.'
    ]
  },
  {
    id: 'berita-4',
    title: 'Tasyakuran Khataman Juz 30 Bersama Orang Tua Murid TK IT Al-Afiyah',
    category: 'Tahfidz',
    categoryColor: '#059669',
    unitTag: 'TK IT',
    date: '28 Agu 2026',
    author: 'Ustadzah Siti Mariyam',
    authorRole: 'Koordinator Tahfidz Balita & TK IT',
    coverImage: '/images/tk-hero-kids.jpg',
    excerpt: 'Suasana haru menyelimuti wisuda mini juz 30 ananda TK IT, di mana para ananda menyematkan mahkota simbolis dan membacakan surat-surat pendek secara serentak.',
    readTime: '3 mnt baca',
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
    id: 'berita-5',
    title: 'Pekan Penilaian Harian & Penguatan Karakter Adab Murid Al-Afiyah',
    category: 'Akademik',
    categoryColor: '#059669',
    unitTag: 'Yayasan',
    date: '20 Agu 2026',
    author: 'Tim Bina Karakter Al-Afiyah',
    authorRole: 'Biro Kesiswaan & Pembiasaan Adab',
    coverImage: '/images/sd-activity-classroom-6b.jpg',
    excerpt: 'Memasuki pekan evaluasi berkala, seluruh peserta didik dibimbing membiasakan adab jujur, tertib, dan menghargai waktu dalam menuntaskan target belajar.',
    readTime: '2 mnt baca',
    paragraphs: [
      'Bismillah, dalam rangka mengawal capaian belajar yang seimbang antara kompetensi materi dan keteguhan akhlaq, sekolah menyelenggarakan Pekan Penilaian Harian Berbasis Adab.',
      'Rangkaian kegiatan ini mengajak para murid untuk membiasakan berdoa sebelum mengawali lembar tugas, mengedepankan kejujuran mutlak, serta saling menghormati ketenangan ruang belajar.',
      'Para wali kelas dan asatidzah pendamping memberikan apresiasi khusus bagi ananda yang menunjukkan inisiatif adab terpuji sepanjang proses belajar mandiri.',
      'Sinergi dan doa para orang tua di rumah senantiasa menjadi pilar utama keberkahan ilmu dan kemudahan bagi ananda tercinta.'
    ],
    keyHighlights: [
      'Pembiasaan adab kejujuran dan ketertiban sebelum dan sesudah asesmen.',
      'Pendampingan intensif bersama wali kelas di setiap rombongan belajar.',
      'Monitoring berkala mutaba\'ah harian melalui aplikasi SIAKAD.'
    ]
  },
  {
    id: 'berita-6',
    title: 'Keutamaan Dzikir Pagi dan Petang dalam Menjaga Ketenteraman Hati Keluarga',
    category: 'Kajian Islam',
    categoryColor: '#0284C7',
    unitTag: 'Yayasan',
    date: '15 Agu 2026',
    author: 'Dewan Asatidzah Ma’had',
    authorRole: 'Komisi Dakwah & Fatwa',
    coverImage: '/images/sd-activity-shalat-berjamaah.jpg',
    excerpt: 'Dzikir pagi dan petang adalah benteng kokoh bagi seorang muslim. Ulasan ringkas hadits-hadits shahih penguat ruhani dan perlindungan dari marabahaya.',
    readTime: '6 mnt baca',
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
    id: 'berita-7',
    title: 'Science & Robotic Fair: Murid SMP IT Rancang Prototipe Irigasi Cerdas Tenaga Surya',
    category: 'Prestasi',
    categoryColor: '#D97706',
    unitTag: 'SMP IT',
    date: '12 Agu 2026',
    author: 'Ir. Fathurrahman, S.Pd.',
    authorRole: 'Guru Pembimbing Sains & Robotika SMP IT',
    coverImage: '/images/sd-activity-multimedia-learning.jpg',
    excerpt: 'Karya sains teknologi terpadu ciptaan murid kelas 8 berhasil memukau dewan juri dengan mengintegrasikan mikrokontroler sensor tanah dan prinsip tadabbur ayat kauniyyah.',
    readTime: '4 mnt baca',
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
    id: 'berita-8',
    title: 'Latihan Memanah & Bela Diri Sunnah: Membentuk Ketangkasan Fisik dan Jiwa Ksatria Murid',
    category: 'Kabar Sekolah',
    categoryColor: '#123E38',
    unitTag: 'SMP IT',
    date: '08 Agu 2026',
    author: 'Kapten (Purn) M. Ridwan',
    authorRole: 'Pelatih Kepanduan & Panahan Sunnah',
    coverImage: '/images/smp-hero-fullday.jpg',
    excerpt: 'Olahraga sunnah memanah dan bela diri silat kepanduan rutin diselenggarakan setiap pekan untuk melatih fokus, ketenangan emosi, dan kedisiplinan murid.',
    readTime: '3 mnt baca',
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
    id: 'berita-9',
    title: 'Pekan Bahasa Arab & Inggris: Menumbuhkan Percakapan Aktif dan Percaya Diri Murid SD IT',
    category: 'Kabar Sekolah',
    categoryColor: '#059669',
    unitTag: 'SD IT',
    date: '02 Agu 2026',
    author: 'Ustadzah Nurul Hidayah, M.Pd.',
    authorRole: 'Koordinator Bahasa Asing SD IT Al-Afiyah',
    coverImage: '/images/smp-hero-bilingual.jpg',
    excerpt: 'Melalui kegiatan Hiwar Yaumi dan Daily English Vocabulary, murid SD IT Al-Afiyah unjuk kebolehan pidato dan bercerita kisah sahabat nabi dalam bahasa asing.',
    readTime: '4 mnt baca',
    paragraphs: [
      'Suasana di lingkungan SD IT Al-Afiyah tampak lebih semarak dengan digelarnya Pekan Bahasa Internasional (Language Week) yang mengusung tema "Cinta Bahasa Al-Qur’an dan Komunikasi Global".',
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
    id: 'berita-10',
    title: 'Simulasi Manasik Haji Cilik Murid TK IT Al-Afiyah di Lapangan Utama Lingkungan Sekolah',
    category: 'Kabar Sekolah',
    categoryColor: '#059669',
    unitTag: 'TK IT',
    date: '25 Jul 2026',
    author: 'Ustadzah Dewi Sartika, S.Pd.I.',
    authorRole: 'Guru Sentra Agama & Ibadah TK IT',
    coverImage: '/images/tk-hero-garden.jpg',
    excerpt: 'Mengenakan pakaian ihram serba putih, puluhan murid cilik belajar prosesi tawaf, sa\'i, dan wukuf dengan antusias didampingi para ustadzah dan orang tua.',
    readTime: '3 mnt baca',
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
    id: 'berita-11',
    title: 'Penyaluran Zakat, Infaq, dan Sedekah (ZIS) Murid: Paket Sembako Berkah untuk Warga Dhuafa',
    category: 'Pengumuman',
    categoryColor: '#4338CA',
    unitTag: 'Yayasan',
    date: '18 Jul 2026',
    author: 'Biro Sosial & Dakwah Yayasan',
    authorRole: 'Pengelola ZISWAF Al-Afiyah',
    coverImage: '/images/sd-field-study-banner.jpg',
    excerpt: 'Sebagai wujud kepedulian sosial dan aplikasi adab dermawan, OSIS murid Al-Afiyah menyalurkan 250 paket sembako kepada warga dhuafa di lingkungan sekolah.',
    readTime: '3 mnt baca',
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
    id: 'berita-12',
    title: 'Tips Praktis Mendidik Anak Senang Mendirikan Shalat 5 Waktu Tanpa Disuruh',
    category: 'Kajian Islam',
    categoryColor: '#0284C7',
    unitTag: 'Yayasan',
    date: '10 Jul 2026',
    author: 'Ustadz Dr. Muhammad Luthfi, M.A.',
    authorRole: 'Pakar Parenting Nabawiyah & Dosen Fiqih',
    coverImage: '/images/sd-activity-kultum-murid.jpg',
    excerpt: 'Kiat psikologis dan syar\'i dari para ulama untuk menanamkan kecintaan shalat fardhu pada anak melalui keteladanan orang tua, pembiasaan bertahap, dan doa mustajab.',
    readTime: '5 mnt baca',
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

export default function SiakadHomeView({
  student,
  onNavigateTab,
  onOpenStudentSwitcher,
}: SiakadHomeViewProps) {
  const [selectedNews, setSelectedNews] = useState<SiakadNewsItem | null>(null);
  const [articles, setArticles] = useState<SiakadNewsItem[]>(SIAKAD_NEWS_ARTICLES);
  const [activeUnitFilter, setActiveUnitFilter] = useState<string>('ALL');
  const newsScrollRef = useRef<HTMLDivElement>(null);

  // Synchronize with published news from the same DB as the public website
  // Uses /api/news (isPublished:true only) — same data source as /berita page
  useEffect(() => {
    let isMounted = true;
    async function loadLiveNews() {
      try {
        // Fetch all published news (no schoolSlug filter = all units visible in SIAKAD)
        const res = await fetch('/api/news');
        if (!res.ok) return;
        const data = await res.json();
        if (data.news && Array.isArray(data.news) && data.news.length > 0 && isMounted) {
          const dbItems: SiakadNewsItem[] = data.news.map((item: {
            id: string;
            title: string;
            category?: string;
            publishedAt?: string;
            createdAt?: string;
            author?: string;
            coverImage?: string | null;
            excerpt?: string;
            content?: string;
            school?: {
              slug: string;
              name: string;
              unitLevel?: string;
            };
          }) => ({
            id: item.id,
            title: item.title,
            category: item.category || 'Kabar Sekolah',
            categoryColor:
              item.category === 'Tahfidz' ? '#059669' :
              item.category === 'Prestasi' ? '#D97706' :
              item.category === 'Pengumuman' ? '#4338CA' :
              item.category === 'Kajian' ? '#0284C7' : '#123E38',
            unitTag: item.school?.unitLevel || (item.school?.slug ? `${item.school.slug.toUpperCase()} IT` : 'Yayasan'),
            date: new Date(item.publishedAt || item.createdAt || new Date()).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            }),
            author: item.author || 'Humas Al-Afiyah',
            authorRole: 'Redaksi & Pengasuhan',
            coverImage: item.coverImage || '/images/sd-activity-classroom-6b.jpg',
            excerpt: item.excerpt || (item.content ? item.content.slice(0, 120) + '...' : ''),
            readTime: `${Math.max(2, Math.ceil((item.content?.length || 500) / 400))} mnt baca`,
            paragraphs: item.content
              ? item.content.split('\n').filter((p: string) => p.trim().length > 0)
              : [item.excerpt || ''],
            keyHighlights: [
              `Warta resmi ekosistem Al-Afiyah`,
              `Kategori berita: ${item.category || 'Kabar Sekolah'}`,
              `Telah diverifikasi oleh dewan redaksi & tata usaha`
            ]
          }));

          // DB news goes first (newest), static demo articles as fallback below
          setArticles([...dbItems, ...SIAKAD_NEWS_ARTICLES]);
        } else if (isMounted) {
          // No DB news yet — use static demo articles
          setArticles(SIAKAD_NEWS_ARTICLES);
        }
      } catch {
        // Offline / DB error — fallback to static articles silently
        if (isMounted) setArticles(SIAKAD_NEWS_ARTICLES);
      }
    }
    loadLiveNews();
    return () => {
      isMounted = false;
    };
  }, []);

  const scrollNews = (direction: 'left' | 'right') => {
    if (newsScrollRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      newsScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Filter articles based on active filter pill
  const filteredArticles = activeUnitFilter === 'ALL'
    ? articles
    : articles.filter(a => {
        const tag = a.unitTag?.toUpperCase() || '';
        return tag.includes(activeUnitFilter);
      });

  // If a news article is selected, transition seamlessly to the full article reader
  if (selectedNews) {
    return (
      <SiakadNewsDetailView 
        news={selectedNews} 
        onBack={() => setSelectedNews(null)} 
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col pb-24 overflow-y-auto font-sans selection:bg-amber-300 selection:text-emerald-950 relative">
      {/* Top Header Area (Deep Emerald Identity) */}
      <div 
        className="pt-7 pb-6 px-5 relative shrink-0"
        style={{
          background: 'linear-gradient(165deg, #123E38 0%, #184F48 40%, #0E3530 100%)',
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1px), linear-gradient(165deg, #123E38 0%, #184F48 40%, #0E3530 100%)',
          backgroundSize: '20px 20px, 100% 100%'
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-200/90 tracking-wide mb-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <span>Assalamu’alaikum, Ananda</span>
            </div>
            <h1 className="text-xl font-black text-white tracking-tight">
              {student.fullName}
            </h1>
            <p className="text-[11px] font-bold text-amber-300 flex items-center gap-1 mt-0.5">
              <span>{student.classGrade}</span>
              <span>•</span>
              <span className="text-emerald-200/80">{student.schoolName.split(' ')[0]} {student.schoolName.split(' ')[1]}</span>
            </p>
          </div>

          {/* Child Switcher / Avatar Button */}
          <button
            onClick={onOpenStudentSwitcher}
            aria-label="Ganti Murid"
            className="group relative flex items-center justify-center p-1 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all shadow-md"
          >
            <div className="w-11 h-11 rounded-xl bg-amber-400 text-emerald-950 font-black text-sm flex items-center justify-center overflow-hidden border border-amber-300/60 shadow-inner">
              {student.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={student.avatarUrl} 
                  alt={student.fullName}
                  className="w-full h-full object-cover" 
                />
              ) : (
                <span>{student.fullName.charAt(0)}</span>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#123E38] flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-2.5 h-2.5 text-white" />
            </div>
          </button>
        </div>

        {/* Global Search Pill Bar (Clean White) */}
        <div className="mt-4">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari target hafalan, jadwal, atau mutaba'ah..."
              className="w-full pl-10 pr-4 py-2.5 bg-white text-slate-800 placeholder-slate-400 text-xs rounded-full shadow-lg focus:outline-hidden focus:ring-2 focus:ring-amber-400 transition-all font-medium"
            />
          </div>
        </div>
      </div>

      {/* Main Content Area (Clean Light Canvas with Pure White Cards) */}
      <div className="flex-1 bg-[#F5F7F6] text-slate-800 rounded-t-[28px] pt-4.5 px-4 pb-28 space-y-4 -mt-3 shadow-inner relative z-10">
        {/* Attendance Donut Card (Matches Center Phone Reference: Clean White Card) */}
        <div className="bg-white rounded-3xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-slate-150/80 transition-all">
          <div className="flex items-center justify-between mb-2.5 px-0.5">
            <span className="text-xs font-black text-slate-800 flex items-center gap-1.5 tracking-tight">
              <CalendarCheck className="w-4 h-4 text-[#123E38]" />
              <span>Presensi &amp; Kehadiran</span>
            </span>
            <button
              onClick={() => onNavigateTab('presence')}
              className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-0.5"
            >
              <span>Lihat Detail</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center justify-between bg-slate-50/80 rounded-2xl p-3 border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold text-sm overflow-hidden border border-emerald-300 shadow-inner">
                {student.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={student.avatarUrl} alt={student.fullName} className="w-full h-full object-cover" />
                ) : (
                  <span>{student.fullName.slice(0, 2).toUpperCase()}</span>
                )}
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-900 leading-tight">
                  {student.fullName}
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                  Desember 2026 • 1448 H
                </p>
                <div className="inline-flex items-center gap-1.5 text-[9px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full mt-1 border border-emerald-200/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  <span>Gerbang: {student.todayCheckInTime} (Tepat Waktu)</span>
                </div>
              </div>
            </div>

            {/* Circular Donut Progress Badge */}
            <div className="relative flex items-center justify-center shrink-0">
              <svg className="w-12 h-12 transform -rotate-90">
                <circle
                  cx="24"
                  cy="24"
                  r="18"
                  stroke="#E2E8F0"
                  strokeWidth="3.5"
                  fill="transparent"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="18"
                  stroke="#059669"
                  strokeWidth="3.5"
                  fill="transparent"
                  strokeDasharray={113.09}
                  strokeDashoffset={113.09 * (1 - student.attendanceRate / 100)}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[11px] font-black text-slate-900 font-mono">
                  {student.attendanceRate}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Assignment & Tahfidz Bento Grid (2x2 Colorful Cards from Reference) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-0.5">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
              Status Capaian &amp; Target
            </h3>
            <button
              onClick={() => onNavigateTab('academic')}
              className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950"
            >
              Lihat Rapor
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {/* 1. Tahfidz Al-Qur'an (Emerald Gradient) */}
            <div 
              onClick={() => onNavigateTab('academic')}
              className="cursor-pointer rounded-2xl p-3.5 text-white shadow-sm transition-all hover:scale-[1.02] relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)' }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-1.5 rounded-lg bg-white/20 backdrop-blur-xs">
                  <BookOpen className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[9px] font-black tracking-tight">
                  Mutqin 88%
                </span>
              </div>
              <h4 className="text-xs font-bold leading-tight">Tahfidz Qur’an</h4>
              <p className="text-[10px] text-emerald-100/90 mt-1 line-clamp-1">{student.currentJuzTarget}</p>
              <p className="text-[9px] text-emerald-200/90 mt-0.5 flex items-center gap-1 font-mono">
                <Clock className="w-2.5 h-2.5" />
                <span>Tasmi’: 24 Des 2026</span>
              </p>
            </div>

            {/* 2. Mutaba'ah Shalat & Adab (Warm Coral / Amber) */}
            <div 
              onClick={() => onNavigateTab('academic')}
              className="cursor-pointer rounded-2xl p-3.5 text-white shadow-sm transition-all hover:scale-[1.02] relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #EA580C 0%, #C2410C 100%)' }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-1.5 rounded-lg bg-white/20 backdrop-blur-xs">
                  <Award className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-white text-[9px] font-bold">
                  Skor {student.adabScore}
                </span>
              </div>
              <h4 className="text-xs font-bold leading-tight">Mutaba’ah Adab</h4>
              <p className="text-[10px] text-orange-100/90 mt-1 line-clamp-1">Shalat 5 Waktu &amp; Dhuha</p>
              <p className="text-[9px] text-orange-200/90 mt-0.5 flex items-center gap-1">
                <ShieldCheck className="w-2.5 h-2.5" />
                <span>Terverifikasi Asatidz</span>
              </p>
            </div>

            {/* 3. Sains & Logika (Teal / Steel Blue) */}
            <div 
              onClick={() => onNavigateTab('academic')}
              className="cursor-pointer rounded-2xl p-3.5 text-white shadow-sm transition-all hover:scale-[1.02] relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)' }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-1.5 rounded-lg bg-white/20 backdrop-blur-xs">
                  <FlaskConical className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="px-1.5 py-0.5 rounded-full bg-sky-200 text-sky-950 text-[9px] font-black">
                  Tuntas
                </span>
              </div>
              <h4 className="text-xs font-bold leading-tight">Sains &amp; Logika</h4>
              <p className="text-[10px] text-sky-100/90 mt-1 line-clamp-1">Proyek Robotika Murid</p>
              <p className="text-[9px] text-sky-200/90 mt-0.5 font-mono">Nilai A (94/100)</p>
            </div>

            {/* 4. Bahasa Arab & Inggris (Royal Indigo) */}
            <div 
              onClick={() => onNavigateTab('academic')}
              className="cursor-pointer rounded-2xl p-3.5 text-white shadow-sm transition-all hover:scale-[1.02] relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #3730A3 100%)' }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-1.5 rounded-lg bg-white/20 backdrop-blur-xs">
                  <Languages className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="px-1.5 py-0.5 rounded-full bg-indigo-200 text-indigo-950 text-[9px] font-black">
                  Bilingual
                </span>
              </div>
              <h4 className="text-xs font-bold leading-tight">Bahasa &amp; Hiwar</h4>
              <p className="text-[10px] text-indigo-100/90 mt-1 line-clamp-1">Mufradat &amp; Muhadatsah</p>
              <p className="text-[9px] text-indigo-200/90 mt-0.5">Ujian Lisan: Pekan Depan</p>
            </div>
          </div>
        </div>

        {/* School Moments / Kabar & Dokumentasi Kegiatan */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-0.5">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
                Momen &amp; Kabar Sekolah
              </h3>
              <p className="text-[10px] text-slate-400 font-medium">
                Klik kabar untuk baca selengkapnya
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-500 mr-1 hidden sm:inline">
                Desember 2026
              </span>
              <button
                type="button"
                onClick={() => scrollNews('left')}
                aria-label="Scroll kabar ke kiri"
                className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-emerald-700 hover:border-emerald-400 hover:bg-emerald-50/50 shadow-2xs transition-all active:scale-90"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => scrollNews('right')}
                aria-label="Scroll kabar ke kanan"
                className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-emerald-700 hover:border-emerald-400 hover:bg-emerald-50/50 shadow-2xs transition-all active:scale-90"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Unit Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[10px]">
            {[
              { id: 'ALL', label: 'Semua Kabar' },
              { id: 'TK', label: 'TK IT' },
              { id: 'SD', label: 'SD IT' },
              { id: 'SMP', label: 'SMP IT' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveUnitFilter(tab.id)}
                className={`px-3 py-1 rounded-full font-bold whitespace-nowrap transition-all ${
                  activeUnitFilter === tab.id
                    ? 'bg-[#123E38] text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Horizontally scrollable news stream */}
          <div 
            ref={newsScrollRef}
            className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory scroll-smooth cursor-pointer -mx-1 px-1"
          >
            {filteredArticles.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedNews(item)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedNews(item);
                  }
                }}
                className="group snap-start shrink-0 w-[240px] bg-white rounded-2xl overflow-hidden border border-slate-200/80 hover:border-emerald-400 shadow-xs hover:shadow-md active:scale-[0.98] transition-all duration-200 flex flex-col justify-between text-left focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <div>
                  <div className="h-28 w-full relative overflow-hidden bg-slate-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.coverImage}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                    
                    <div className="absolute top-2 left-2 flex items-center gap-1">
                      {item.unitTag && (
                        <span className="px-2 py-0.5 rounded-md bg-white text-slate-900 text-[9px] font-black shadow-xs">
                          {item.unitTag}
                        </span>
                      )}
                      <span 
                        className="px-2 py-0.5 rounded-md text-white text-[9px] font-bold backdrop-blur-xs shadow-xs"
                        style={{ backgroundColor: item.categoryColor }}
                      >
                        {item.category}
                      </span>
                    </div>

                    <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-md bg-black/60 text-amber-300 text-[9px] font-mono flex items-center gap-1 backdrop-blur-xs">
                      <Clock className="w-2.5 h-2.5" />
                      <span>{item.readTime}</span>
                    </span>
                  </div>

                  <div className="p-3 pb-2">
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-emerald-800 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {item.excerpt}
                    </p>
                  </div>
                </div>

                {/* Footer of Card */}
                <div className="px-3 pb-3 pt-1 border-t border-slate-100 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400 font-medium">
                    {item.date}
                  </span>
                  <span className="font-bold text-emerald-700 group-hover:text-emerald-800 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-all">
                    <span>Baca</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Access to SPP & Kuitansi (Clean White Surface) */}
        <div className="bg-white border border-slate-150/90 rounded-2xl p-3.5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-400 text-slate-950 font-black shadow-xs">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">
                SPP &amp; Iuran Bulan Berjalan
              </p>
              <p className="text-[10px] text-slate-500">
                Desember 2026: <strong className="text-emerald-700 font-bold">Lunas Terverifikasi</strong>
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('tuition')}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold transition-colors shadow-xs"
          >
            Lihat Kasir
          </button>
        </div>
      </div>
    </div>
  );
}
