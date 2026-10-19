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

import { getDepartmentByRole } from '@/components/landing/SchoolLandingTemplate';

export const metadata: Metadata = {
  title: 'Struktur Organisasi & Tenaga Pendidik SMP IT Al-Afiyah',
  description: 'Struktur kepengurusan Yayasan Pendidikan Imam Bonjol, kepala sekolah, komite, pks kurikulum, dewan asatidz tahfidz bersanad, staf tata usaha, dan pengembang sistem digital SMP IT Al-Afiyah Majalengka.',
  icons: {
    icon: [
      { url: '/images/smp-icon-192.png', type: 'image/png' },
      { url: '/smp-favicon.ico', sizes: 'any' },
    ],
    shortcut: '/images/smp-icon-192.png',
    apple: '/images/smp-icon-192.png',
  },
  openGraph: {
    title: 'Struktur Organisasi & Tenaga Pendidik SMP IT Al-Afiyah',
    description: 'Tata kelola kepengurusan yayasan, kepala satuan pendidikan, asatidz pembina tahfidz bersanad, sarana prasarana, tata usaha, dan tim sistem IT Al-Afiyah.',
    images: ['/images/smp-og.jpg'],
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
  photoUrl?: string | null;
}

const DEFAULT_TEACHERS: TeacherItem[] = [
  {
    id: 'smp-t-0',
    name: 'Jejen Nurbayan, S.Sos',
    role: 'Ketua Yayasan Pendidikan Imam Bonjol',
    specialization: 'Manajemen Kelembagaan & Kebijakan Yayasan',
    bio: 'Mengarahkan visi pendidikan terpadu berlandaskan tauhid dan akhlak mulia demi masa depan generasi Qur\'ani.',
    category: 'Pimpinan & Manajemen'
  },
  {
    id: 'smp-t-1',
    name: 'Jaja Madhuri, S.Pd.',
    role: 'Kepala Sekolah SMP IT Al-Afiyah',
    specialization: 'Manajemen Pendidikan Islam & Karakter',
    bio: 'Memimpin penyelenggaraan pendidikan SMP IT Al-Afiyah dengan visi mencetak generasi Smart & Religious berakhlak Qur\'ani.',
    category: 'Pimpinan & Manajemen'
  },
  {
    id: 'smp-t-2',
    name: 'M. Akbar Pratama, S.Pd.',
    role: 'PKS Kurikulum (Pembantu Kepala Sekolah)',
    specialization: 'Pengembangan Kurikulum Terpadu & Mutu Akademik',
    bio: 'Mengawal integrasi Kurikulum Nasional dan kurikulum pesantren khas Al-Afiyah, riset sains, dan kecakapan akademik santri.',
    category: 'Pimpinan & Manajemen'
  },
  {
    id: 'smp-t-3',
    name: 'Rio Satrio, S.Pd.',
    role: 'PKS Kesiswaan (Pembantu Kepala Sekolah)',
    specialization: 'Pembinaan Karakter Santri, Disiplin & Minat Bakat',
    bio: 'Membina kedisiplinan, kepemimpinan nabawiyah, program SCD (Student Character Development), dan kegiatan kesiswaan positif.',
    category: 'Pimpinan & Manajemen'
  },
  {
    id: 'smp-t-4',
    name: 'Muhamad Eechram Riady, S.Pd.',
    role: 'Sarpras (Sarana & Prasarana)',
    specialization: 'Pengelolaan Fasilitas & Lingkungan Pembelajaran',
    bio: 'Memastikan kenyamanan, kelayakan sarana modern, laboratorium multimedia, dan lingkungan asri penunjang kegiatan belajar.',
    category: 'Pimpinan & Manajemen'
  },
  {
    id: 'smp-t-5',
    name: 'Iip Zaenal Arifin, S.Pd.',
    role: 'Tata Usaha',
    specialization: 'Tata Kelola Administrasi & Keuangan Pendidikan',
    bio: 'Mengelola akuntabilitas keuangan sekolah, layanan administrasi SPMB terpadu, dan tata usaha profesional bagi wali murid.',
    category: 'Pimpinan & Manajemen'
  },
  {
    id: 'smp-t-6',
    name: 'Amelia Kartika, S.Sos.',
    role: 'Humas (Hubungan Masyarakat)',
    specialization: 'Komunikasi Publik, Kemitraan & Layanan Informasi',
    bio: 'Membangun komunikasi sinergis antara sekolah, wali murid, dan masyarakat serta memfasilitasi kemitraan strategis.',
    category: 'Pimpinan & Manajemen'
  },
  {
    id: 'smp-t-7',
    name: 'Mulia Rizki',
    role: 'Lead Developer & IT Systems',
    specialization: 'Arsitektur Sistem Informasi, Fullstack Development & Database',
    bio: 'Mengembangkan dan mengelola ekosistem digital sekolah, infrastruktur sistem, database, serta operasional portal SPMB & platform digital Al-Afiyah.',
    category: 'IT & Sistem Digital'
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
      teachers = dbTeachers.map((t) => ({
        id: t.id,
        name: t.name.replace(/^(?:Ustadz|Ust\.?)\s+/i, '').trim(),
        role: t.role,
        specialization: t.specialization || 'Pendidik SMP IT',
        bio: t.bio || 'Pendidik berdedikasi tinggi di SMP IT Al-Afiyah Majalengka.',
        photoUrl: t.photoUrl,
        category: t.role.toLowerCase().includes('developer') || t.role.toLowerCase().includes('it')
          ? 'IT & Sistem Digital'
          : t.role.toLowerCase().includes('kepala') || t.role.toLowerCase().includes('manajemen') || t.role.toLowerCase().includes('yayasan') || t.role.toLowerCase().includes('ketua') || t.role.toLowerCase().includes('humas') || t.role.toLowerCase().includes('tata usaha') || t.role.toLowerCase().includes('sarpras')
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
            <span className="text-[#ffd51e] font-semibold">Struktur Organisasi &amp; Tim</span>
          </nav>

          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#ffd51e] mb-3">
              <span className="w-6 h-[2px] bg-[#ffd51e] rounded-full inline-block" />
              <span>Bagan Kepengurusan &amp; Tim Pengelola Terpadu</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Struktur Kepengurusan &amp; Tenaga Pendidik <br className="hidden sm:inline" />
              SMP&nbsp;IT Al-Afiyah
            </h1>

            <p className="mt-3 sm:mt-4 text-sm sm:text-lg text-slate-200 leading-relaxed font-normal">
              Tata kelola terintegrasi antara pimpinan yayasan, kepala satuan pendidikan, dewan asatidzah tahfidz &amp; kurikulum, tata usaha, serta pengembang sistem informasi digital yang bersinergi mewujudkan pendidikan berkarakter islami.
            </p>
          </div>
        </div>
      </section>

      {/* Teachers Grid */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10 sm:space-y-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {teachers.map((teacher) => {
            const department = getDepartmentByRole(teacher.role, teacher.specialization || '');

            return (
              <div 
                key={teacher.id}
                className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 hover:border-[#030164]/40 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="bg-gradient-to-br from-[#030164] via-[#090580] to-[#01003d] text-white rounded-xl p-3.5 shadow-2xs relative overflow-hidden">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#ffd51e] block">
                      {department}
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-white mt-0.5 block leading-snug">
                      {teacher.role}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug group-hover:text-[#030164] transition-colors">
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
          );
        })}
        </div>
      </main>

      <Footer schoolSlug="smp" />
      <StickyMobileBar schoolSlug="smp" />
    </div>
  );
}
