import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyMobileBar from '@/components/layout/StickyMobileBar';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { 
  Users, 
  ArrowLeft, 
  ChevronRight, 
  Award, 
  BookOpen, 
  GraduationCap, 
  HeartHandshake, 
  Trophy,
  Languages
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Dewan Asatidz & Pendidik SMP IT Al-Afiyah',
  description: 'Profil dewan asatidz pembina tahfidz Al-Qur\'an bersanad, guru bahasa Arab, pengajar sains akademik, dan pelatih Futsal Development Program SMP IT Al-Afiyah Majalengka.',
  icons: {
    icon: [
      { url: '/images/smp-icon-192.png', type: 'image/png' },
      { url: '/smp-favicon.ico', sizes: 'any' },
    ],
    shortcut: '/images/smp-icon-192.png',
    apple: '/images/smp-icon-192.png',
  },
  openGraph: {
    title: 'Dewan Asatidz & Pendidik SMP IT Al-Afiyah',
    description: 'Pendidik berakhlak Qur\'ani, kompeten di bidangnya, dan berdedikasi membina murid.',
    images: ['/images/smp-program-unggulan.png'],
  },
};

export const revalidate = 60;

interface TeacherItem {
  id: string;
  name: string;
  role: string;
  specialization?: string | null;
  bio?: string | null;
  category: string;
}

const DEFAULT_TEACHERS: TeacherItem[] = [
  {
    id: 'smp-t-1',
    name: 'Ustadz H. Rahmat Hidayat, M.Pd.',
    role: 'Kepala Sekolah SMP IT Al-Afiyah',
    specialization: 'Manajemen Pendidikan Islam',
    bio: 'Berpengalaman lebih dari 15 tahun dalam memimpin lembaga pendidikan Islam terpadu, berfokus pada integrasi karakter Smart & Religious.',
    category: 'Pimpinan & Manajemen'
  },
  {
    id: 'smp-t-2',
    name: 'Ustadz Ahmad Fauzi, Lc., Al-Hafizh',
    role: 'Koordinator Tahfidz & Diniyyah',
    specialization: 'Tahfidz 30 Juz Bersanad & Ulumul Qur\'an',
    bio: 'Alumnus Timur Tengah pemegang sanad qira\'ah Hafs \'an \'Ashim, pembina halaqah tahfidz mutqin dan bimbingan tasmi\' murid.',
    category: 'Tahfidz & Diniyyah'
  },
  {
    id: 'smp-t-3',
    name: 'Ustadz Muhammad Wildan, S.Pd.I.',
    role: 'Pengampu Bahasa Arab & Adab',
    specialization: 'Kaidah Nahwu-Sharaf & Muhadatsah Aktif',
    bio: 'Mengembangkan metode bi\'ah lughawiyyah interaktif agar murid fasih berkomunikasi lisan dan mendalami literatur kitab turats.',
    category: 'Bahasa & Karakter'
  },
  {
    id: 'smp-t-4',
    name: 'Ustadzah Siti Maryam, S.Pd., M.Si.',
    role: 'Pendidik IPA Terpadu & Sains',
    specialization: 'Sains Eksperimental & Laboratorium Komputer',
    bio: 'Membimbing literasi sains, riset terapan, dan persiapan olimpiade akademik murid tingkat kabupaten dan provinsi.',
    category: 'Akademik & Sains'
  },
  {
    id: 'smp-t-5',
    name: 'Coach Hendra Kusuma, S.Or.',
    role: 'Pelatih Kepala Futsal Development Program',
    specialization: 'Pelatih Futsal Berlisensi & Kebugaran Fisik',
    bio: 'Mengarahkan pembinaan olahraga futsal terstruktur, disiplin taktik tim, dan penanaman sportivitas juara bagi murid.',
    category: 'Olahraga & Prestasi'
  },
  {
    id: 'smp-t-6',
    name: 'Ustadzah Nabila Zahra, S.Sos.',
    role: 'Koordinator SCD (Student Character Development)',
    specialization: 'Konseling Remaja & Adab Islami',
    bio: 'Mendampingi perkembangan psikologis murid remaja, pembinaan etika pergaulan syar\'i, dan pendampingan Mutaba\'ah Digital.',
    category: 'Bahasa & Karakter'
  }
];

export default async function SmpGuruPage() {
  let teachers: TeacherItem[] = DEFAULT_TEACHERS;

  try {
    const dbTeachers = await prisma.teacher.findMany({
      where: {
        school: { slug: 'smp' },
        isActive: true,
      },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });

    if (dbTeachers && dbTeachers.length > 0) {
      teachers = dbTeachers.map((t, idx) => ({
        id: t.id,
        name: t.name,
        role: t.role,
        specialization: t.specialization || 'Pendidik SMP IT',
        bio: t.bio || 'Pendidik berdedikasi tinggi di SMP IT Al-Afiyah Majalengka.',
        category: t.role.toLowerCase().includes('kepala') || t.role.toLowerCase().includes('manajemen')
          ? 'Pimpinan & Manajemen'
          : t.role.toLowerCase().includes('tahfidz') || t.role.toLowerCase().includes('qur')
          ? 'Tahfidz & Diniyyah'
          : t.role.toLowerCase().includes('futsal') || t.role.toLowerCase().includes('olahraga')
          ? 'Olahraga & Prestasi'
          : 'Akademik & Sains'
      }));
    }
  } catch (err) {
    console.error('Error fetching SMP teachers:', err);
  }

  const categories = ['Semua', 'Pimpinan & Manajemen', 'Tahfidz & Diniyyah', 'Bahasa & Karakter', 'Akademik & Sains', 'Olahraga & Prestasi'];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-[#ffd51e] selection:text-[#030164] overflow-x-clip">
      <Navbar schoolSlug="smp" />

      {/* Hero Header */}
      <section className="bg-gradient-to-br from-[#030164] via-[#090580] to-[#01003d] text-white pt-24 sm:pt-28 pb-14 sm:pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffd51e_1.5px,transparent_1.5px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#ffd51e]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <nav className="flex items-center gap-1.5 text-xs text-blue-200/90 mb-5 flex-wrap" aria-label="Breadcrumb">
            <Link href="/smp" className="hover:text-white transition-colors inline-flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Beranda SMP IT</span>
            </Link>
            <ChevronRight className="w-3 h-3 text-blue-300/50" />
            <span className="text-[#ffd51e] font-semibold">Dewan Asatidz &amp; Pendidik</span>
          </nav>

          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#ffd51e] mb-3">
              <span className="w-6 h-[2px] bg-[#ffd51e] rounded-full inline-block" />
              <span>Pendidik Kompeten, Berkarakter &amp; Berdedikasi</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Dewan Guru &amp; Asatidzah SMP IT
            </h1>

            <p className="mt-3 sm:mt-4 text-sm sm:text-lg text-slate-200 leading-relaxed font-normal">
              Para asatidz pembina tahfidz bersanad, sarjana lulusan universitas terkemuka, dan praktisi kepemudaan yang mendampingi tumbuh kembang murid secara personal dan penuh keteladanan.
            </p>
          </div>
        </div>
      </section>

      {/* Teachers Grid */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10 sm:space-y-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {teachers.map((teacher) => (
            <div 
              key={teacher.id}
              className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 hover:border-[#030164]/40 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <p className="text-xs font-semibold text-[#030164] mb-1">
                  {teacher.role}
                </p>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug">
                  {teacher.name}
                </h3>

                {teacher.specialization && (
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <p className="text-xs text-slate-600">
                      <span className="text-slate-400 font-normal">Amanah / Bidang: </span>
                      <span className="font-semibold text-slate-800">{teacher.specialization}</span>
                    </p>
                  </div>
                )}

                {teacher.bio && (
                  <p className="mt-2.5 text-xs text-slate-500 italic leading-relaxed">
                    &ldquo;{teacher.bio}&rdquo;
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer schoolSlug="smp" />
      <StickyMobileBar schoolSlug="smp" />
    </div>
  );
}
