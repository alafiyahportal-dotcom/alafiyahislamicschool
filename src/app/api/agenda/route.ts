import { NextRequest, NextResponse } from 'next/server';

export interface AcademicEvent {
  id: string;
  title: string;
  category: 'ppdb' | 'akademik' | 'islamic' | 'kegiatan';
  schoolSlug: 'tk' | 'sd' | 'smp' | 'foundation' | 'all';
  schoolName: string;
  startDate: string; // ISO date YYYY-MM-DD
  endDate?: string;
  time?: string;
  location: string;
  description: string;
  badgeText: string;
  isImportant?: boolean;
}

export const ACADEMIC_EVENTS: AcademicEvent[] = [
  {
    id: 'evt-ppdb-w1-open',
    title: 'Pembukaan PPDB Online 2026/2027 Gelombang 1',
    category: 'ppdb',
    schoolSlug: 'all',
    schoolName: 'Semua Unit (TK, SD, SMP)',
    startDate: '2026-09-01',
    endDate: '2026-09-30',
    time: '24 Jam Online',
    location: 'Portal Resmi https://alafiyah.sch.id/ppdb/daftar',
    description: 'Pendaftaran calon murid baru secara online untuk jenjang TK IT, SD IT, dan SMP IT Al-Afiyah.',
    badgeText: 'PPDB Gelombang 1',
    isImportant: true,
  },
  {
    id: 'evt-sts-sd-1',
    title: 'Sumatif Tengah Semester (STS) 1 SD IT Al-Afiyah',
    category: 'akademik',
    schoolSlug: 'sd',
    schoolName: 'SD IT Al-Afiyah',
    startDate: '2026-09-21',
    endDate: '2026-09-26',
    time: '07:15 - 11:00 WIB',
    location: 'Lingkungan Sekolah SD IT Al-Afiyah',
    description: 'Pelaksanaan asesmen Sumatif Tengah Semester (STS) Semester 1 TP 2026/2027 SD IT Al-Afiyah. Smart Akhlaq Fitrah.',
    badgeText: 'STS Semester 1',
    isImportant: true,
  },
  {
    id: 'evt-obs-sd',
    title: 'Ujian Observasi & Pemetaan Kesiapan Calon Murid SD IT',
    category: 'ppdb',
    schoolSlug: 'sd',
    schoolName: 'SD IT Al-Afiyah',
    startDate: '2026-09-26',
    time: '08:00 - 11:30 WIB',
    location: 'Gedung Utama Lingkungan Sekolah SD IT Al-Afiyah Majalengka',
    description: 'Observasi kesiapan calistung dasar, pemetaan bacaan Iqro/Al-Qur\'an, dan wawancara komitmen orang tua/wali murid.',
    badgeText: 'Observasi SD',
    isImportant: true,
  },
  {
    id: 'evt-obs-smp',
    title: 'Tes Observasi Bakat, Wawancara & Uji Tahfidz SMP IT',
    category: 'ppdb',
    schoolSlug: 'smp',
    schoolName: 'SMP IT Al-Afiyah',
    startDate: '2026-09-27',
    time: '08:00 - 14:00 WIB',
    location: 'Lingkungan Sekolah SMP IT Al-Afiyah Majalengka',
    description: 'Uji hafalan Al-Qur\'an juz 30, tes potensi akademik dasar, dan wawancara kesiapan belajar serta kemandirian murid.',
    badgeText: 'Seleksi SMP',
    isImportant: true,
  },
  {
    id: 'evt-obs-tk',
    title: 'Observasi Bermain & Tumbuh Kembang Calon Murid TK IT',
    category: 'ppdb',
    schoolSlug: 'tk',
    schoolName: 'TK IT Al-Afiyah',
    startDate: '2026-09-28',
    time: '08:30 - 10:30 WIB',
    location: 'Gedung Sentra PAUD & TK IT Al-Afiyah',
    description: 'Pengamatan motorik kasar/halus anak usia dini, kemandirian toilet training, serta dialog parenting orang tua.',
    badgeText: 'Sentra Balita TK',
  },
  {
    id: 'evt-announcement-w1',
    title: 'Rilis Pengumuman Resmi Kelulusan PPDB Gelombang 1',
    category: 'ppdb',
    schoolSlug: 'all',
    schoolName: 'Semua Unit (TK, SD, SMP)',
    startDate: '2026-09-30',
    time: '13:00 WIB',
    location: 'Papan Pengumuman Online https://alafiyah.sch.id/ppdb/pengumuman',
    description: 'Pengumuman resmi hasil seleksi murid baru dan penerbitan Surat Keputusan (SK) Kelulusan Mudir Yayasan.',
    badgeText: 'Pengumuman Lulus',
    isImportant: true,
  },
  {
    id: 'evt-rereg-w1',
    title: 'Daftar Ulang & Pengukuran Seragam Murid Baru',
    category: 'ppdb',
    schoolSlug: 'all',
    schoolName: 'Semua Unit (TK, SD, SMP)',
    startDate: '2026-10-01',
    endDate: '2026-10-10',
    time: '08:00 - 14:00 WIB',
    location: 'Kantor Tata Usaha Unit Sekolah Masing-Masing',
    description: 'Penyelesaian administrasi biaya daftar ulang, penyerahan berkas fisik, dan fitting ukuran seragam resmi Al-Afiyah.',
    badgeText: 'Daftar Ulang',
    isImportant: true,
  },
  {
    id: 'evt-stadium-generale',
    title: 'Stadium Generale & Silaturahmi Akbar Wali Murid Baru',
    category: 'kegiatan',
    schoolSlug: 'foundation',
    schoolName: 'Yayasan Pendidikan Imam Bonjol',
    startDate: '2026-10-18',
    time: '08:30 - 12:00 WIB',
    location: 'Auditorium Utama Yayasan Pendidikan Imam Bonjol',
    description: 'Pertemuan orientasi kurikulum adab & Al-Qur\'an bersama Ketua Yayasan, Dewan Pembina, dan Pengurus Komite Sekolah.',
    badgeText: 'Silaturahmi Akbar',
    isImportant: true,
  },
  {
    id: 'evt-matsama',
    title: 'Masa Ta\'aruf Murid Baru (MATSAMA / Orientasi Karakter)',
    category: 'akademik',
    schoolSlug: 'all',
    schoolName: 'Semua Unit (TK, SD, SMP)',
    startDate: '2026-10-26',
    endDate: '2026-10-28',
    time: '07:30 - 12:00 WIB',
    location: 'Lingkungan Sekolah Terpadu Al-Afiyah Majalengka',
    description: 'Pengenalan lingkungan sekolah, dewan guru, budaya adab murid, dan pembiasaan shalat dhuha serta dzikir pagi.',
    badgeText: 'Ta\'aruf Murid',
  },
  {
    id: 'evt-kbm-perdana',
    title: 'Hari Pertama Kegiatan Belajar Mengajar (KBM) Efektif',
    category: 'akademik',
    schoolSlug: 'all',
    schoolName: 'Semua Unit (TK, SD, SMP)',
    startDate: '2026-11-02',
    time: '07:00 WIB',
    location: 'Seluruh Ruang Kelas TK, SD, dan SMP IT',
    description: 'Awal resmi pembelajaran tatap muka kurikulum Islam Terpadu dan program pembinaan tahfidz Al-Qur\'an.',
    badgeText: 'Awal KBM',
    isImportant: true,
  },
  {
    id: 'evt-ramadhan-1448',
    title: 'Bulan Suci Ramadhan & Tarbiyah Intensif',
    category: 'islamic',
    schoolSlug: 'all',
    schoolName: 'Pusat Yayasan',
    startDate: '2027-02-08',
    endDate: '2027-03-09',
    time: 'Sebulan Penuh',
    location: 'Masjid Jami\' Al-Afiyah Kampus Terpadu',
    description: 'Khataman Al-Qur\'an murid, ifthar jama\'i berkala, pembagian zakat fitrah, dan shalat tarawih berjamaah.',
    badgeText: 'Ramadhan Mubarak',
  },
  {
    id: 'evt-tasmik-tahfidz',
    title: 'Ujian Tasmik Tahfidz Akbar 1 - 5 Juz Bil-Ghoib',
    category: 'kegiatan',
    schoolSlug: 'smp',
    schoolName: 'SMP IT Al-Afiyah',
    startDate: '2027-04-15',
    time: '08:00 - 15:30 WIB',
    location: 'Masjid Jami\' Al-Afiyah Majalengka',
    description: 'Ujian memperdengarkan hafalan Al-Qur\'an sekali duduk di hadapan dewan guru penguji tahfidz berdedikasi.',
    badgeText: 'Tasmik Akbar',
    isImportant: true,
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const unit = searchParams.get('unit') || 'all';
    const category = searchParams.get('category') || 'all';
    const format = searchParams.get('format') || 'json';

    let filtered = ACADEMIC_EVENTS;

    if (unit !== 'all') {
      filtered = filtered.filter(
        (e) => e.schoolSlug === unit || e.schoolSlug === 'all'
      );
    }

    if (category !== 'all') {
      filtered = filtered.filter((e) => e.category === category);
    }

    // Ekspor Format iCalendar (.ics)
    if (format === 'ics') {
      const icsLines = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Yayasan Pendidikan Imam Bonjol//Ekosistem Al-Afiyah//ID',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'X-WR-CALNAME:Kalender Akademik & PPDB Al-Afiyah Majalengka',
        'X-WR-TIMEZONE:Asia/Jakarta',
      ];

      for (const ev of filtered) {
        const startClean = ev.startDate.replace(/-/g, '');
        const endClean = ev.endDate ? ev.endDate.replace(/-/g, '') : startClean;

        icsLines.push(
          'BEGIN:VEVENT',
          `UID:${ev.id}@alafiyah.sch.id`,
          `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
          `DTSTART;VALUE=DATE:${startClean}`,
          `DTEND;VALUE=DATE:${endClean}`,
          `SUMMARY:[${ev.schoolName}] ${ev.title}`,
          `DESCRIPTION:${ev.description.replace(/\n/g, ' ')}`,
          `LOCATION:${ev.location}`,
          'STATUS:CONFIRMED',
          'END:VEVENT'
        );
      }

      icsLines.push('END:VCALENDAR');

      return new NextResponse(icsLines.join('\r\n'), {
        status: 200,
        headers: {
          'Content-Type': 'text/calendar; charset=utf-8',
          'Content-Disposition': 'attachment; filename="agenda-alafiyah-2026.ics"',
        },
      });
    }

    return NextResponse.json({
      success: true,
      totalEvents: filtered.length,
      data: filtered,
    });
  } catch (error) {
    console.error('Error fetching academic agenda:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal memuat kalender agenda sekolah' },
      { status: 500 }
    );
  }
}
