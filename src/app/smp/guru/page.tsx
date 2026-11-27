import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyMobileBar from '@/components/layout/StickyMobileBar';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ChevronRight } from 'lucide-react';
import { getDepartmentByRole } from '@/lib/departments';

export const metadata: Metadata = {
  title: 'Struktur Organisasi & Tenaga Pendidik | SMP IT Al-Afiyah',
  description:
    'Struktur kepengurusan Yayasan Pendidikan Imam Bonjol, kepala sekolah, PKS kurikulum, PKS kesiswaan, sarpras, tata usaha, humas, dan pengembang sistem digital SMP IT Al-Afiyah Majalengka.',
  icons: {
    icon: [
      { url: '/images/smp-icon-192.png', type: 'image/png' },
      { url: '/smp-favicon.ico', sizes: 'any' },
    ],
    shortcut: '/images/smp-icon-192.png',
    apple: '/images/smp-icon-192.png',
  },
};

export const revalidate = 60;

interface TeacherItem {
  id: string;
  name: string;
  role: string;
  specialization?: string | null;
  bio?: string | null;
}

const DEFAULT_TEACHERS: TeacherItem[] = [
  {
    id: 'smp-t-0',
    name: 'Jejen Nurbayan, S.Sos',
    role: 'Ketua Yayasan Pendidikan Imam Bonjol',
    specialization: 'Manajemen Kelembagaan & Kebijakan Yayasan',
    bio: "Mengarahkan visi pendidikan terpadu berlandaskan tauhid dan akhlak mulia demi masa depan generasi Qur'ani.",
  },
  {
    id: 'smp-t-1',
    name: 'Jaja Madhuri, S.Pd., M.Pd.',
    role: 'Kepala Sekolah SMP IT Al-Afiyah',
    specialization: 'Manajemen Pendidikan Islam & Karakter',
    bio: "Memimpin penyelenggaraan pendidikan SMP IT Al-Afiyah dengan visi mencetak generasi Smart & Religious berakhlak Qur'ani.",
  },
  {
    id: 'smp-t-2',
    name: 'M. Akbar Pratama, S.Pd.',
    role: 'PKS Kurikulum (Pembantu Kepala Sekolah)',
    specialization: 'Pengembangan Kurikulum Terpadu & Mutu Akademik',
    bio: 'Mengawal integrasi Kurikulum Nasional dan kurikulum pesantren khas Al-Afiyah, riset sains, dan kecakapan akademik santri.',
  },
  {
    id: 'smp-t-3',
    name: 'Rio Satrio, S.Pd.',
    role: 'PKS Kesiswaan (Pembantu Kepala Sekolah)',
    specialization: 'Pembinaan Karakter Santri, Disiplin & Minat Bakat',
    bio: 'Membina kedisiplinan, kepemimpinan nabawiyah, program SCD (Student Character Development), dan kegiatan kesiswaan positif.',
  },
  {
    id: 'smp-t-4',
    name: 'Muhamad Eechram Riady, S.Pd.',
    role: 'Sarpras (Sarana & Prasarana)',
    specialization: 'Pengelolaan Fasilitas & Lingkungan Pembelajaran',
    bio: 'Memastikan kenyamanan, kelayakan sarana modern, laboratorium multimedia, dan lingkungan asri penunjang kegiatan belajar.',
  },
  {
    id: 'smp-t-5',
    name: 'Iip Zaenal Arifin, S.Pd.',
    role: 'Tata Usaha',
    specialization: 'Tata Kelola Administrasi & Keuangan Pendidikan',
    bio: 'Mengelola akuntabilitas keuangan sekolah, layanan administrasi SPMB terpadu, dan tata usaha profesional bagi wali murid.',
  },
  {
    id: 'smp-t-6',
    name: 'Amelia Kartika, S.Sos.',
    role: 'Humas (Hubungan Masyarakat)',
    specialization: 'Komunikasi Publik, Kemitraan & Layanan Informasi',
    bio: 'Membangun komunikasi sinergis antara sekolah, wali murid, dan masyarakat serta memfasilitasi kemitraan strategis.',
  },
  {
    id: 'smp-t-7',
    name: 'Mulia Rizki',
    role: 'Lead Developer & IT Systems',
    specialization: 'Arsitektur Sistem Informasi, Fullstack Development & Database',
    bio: 'Mengembangkan dan mengelola ekosistem digital sekolah, infrastruktur sistem, database, serta operasional portal SPMB & platform digital Al-Afiyah.',
  },
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
      const mapped: TeacherItem[] = dbTeachers.map((t) => {
        const cleanName = t.name.replace(/^(?:Ustadz|Ust\.?)\s+/i, '').trim();
        return {
          id: t.id,
          name: cleanName.toLowerCase().includes('jaja madhuri')
            ? 'Jaja Madhuri, S.Pd., M.Pd.'
            : cleanName,
          role: t.role,
          specialization: t.specialization || 'Pendidik SMP IT Al-Afiyah',
          bio: t.bio || 'Pendidik berdedikasi tinggi di SMP IT Al-Afiyah Majalengka.',
        };
      });

      if (!mapped.some((t) => t.name.toLowerCase().includes('jejen nurbayan'))) {
        mapped.unshift(DEFAULT_TEACHERS[0]);
      }
      if (!mapped.some((t) => t.name.toLowerCase().includes('mulia rizki'))) {
        mapped.push(DEFAULT_TEACHERS[7]);
      }
      teachers = mapped;
    }
  } catch (err) {
    console.error('Error fetching SMP teachers:', err);
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 font-sans">
      <Navbar schoolSlug="smp" transparentAtTop={false} />

      <main className="flex-1 pt-16 sm:pt-20">
        {/* Compact Header Al-Hidayah Style */}
        <section className="bg-[#030164] text-white py-8 sm:py-10 border-b-4 border-[#ffd51e]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav
              className="flex items-center gap-1.5 text-xs text-blue-200/80 mb-1.5"
              aria-label="Breadcrumb"
            >
              <Link href="/smp" className="hover:text-[#ffd51e] transition-colors">
                Beranda SMP IT
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-[#ffd51e]" />
              <span className="text-[#ffd51e] font-semibold">Struktur Organisasi &amp; Tim</span>
            </nav>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Struktur Kepengurusan &amp; Tenaga Pendidik SMP IT Al-Afiyah
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-blue-100/90 max-w-3xl leading-relaxed">
              Tata kelola terintegrasi antara pimpinan yayasan, kepala satuan pendidikan, dewan asatidzah tahfidz &amp; kurikulum, tata usaha, serta pengembang sistem informasi digital yang bersinergi mewujudkan pendidikan berkarakter islami.
            </p>
          </div>
        </section>

        {/* Structural Directory Grid — Deskripsi Lengkap Tetap Utuh */}
        <section className="py-10 sm:py-14 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {teachers.map((teacher) => {
                const department = getDepartmentByRole(
                  teacher.role,
                  teacher.specialization || ''
                );

                return (
                  <div
                    key={teacher.id}
                    className="p-5 rounded-sm bg-white border border-slate-200 hover:border-[#030164] transition-all flex flex-col justify-between group"
                  >
                    <div className="space-y-4">
                      <div className="bg-[#030164] text-white rounded-sm p-3.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#ffd51e] block">
                          {department}
                        </span>
                        <span className="text-xs sm:text-sm font-extrabold text-white mt-0.5 block leading-snug">
                          {teacher.role}
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <h3 className="text-base sm:text-lg font-bold text-[#030164] tracking-tight leading-snug">
                          {teacher.name}
                        </h3>
                        {teacher.specialization && (
                          <p className="text-xs text-slate-600 font-medium leading-relaxed">
                            {teacher.specialization}
                          </p>
                        )}
                        {teacher.bio && (
                          <p className="text-[11px] text-slate-600 italic leading-relaxed bg-slate-50/80 p-3 rounded-sm border border-slate-100 mt-2">
                            &ldquo;{teacher.bio}&rdquo;
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="inline-flex items-center gap-1.5 text-slate-500 font-medium">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                        <span>Aktif Bertugas</span>
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400">
                        SMP IT Al-Afiyah
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer schoolSlug="smp" />
      <StickyMobileBar schoolSlug="smp" />
    </div>
  );
}
